#!/usr/bin/env node
/**
 * Build + deploy the "Meta Lead Ads -> Sheet + WhatsApp" n8n workflow.
 *
 * Flow: Meta calls our webhook the instant someone submits an Instant Form.
 * The payload carries only a leadgen_id, so we call Graph to fetch the answers,
 * normalise them to the same column shape as the backfill export, append to the
 * master tab and the campaign tab, then fire a WhatsApp alert to the team.
 *
 * Two things worth knowing:
 *  - appsecret_proof is a CONSTANT here. It is HMAC(access_token, app_secret) and
 *    both inputs are fixed (the system-user token never expires), so we precompute
 *    it in .env rather than making the Code node do crypto, which n8n sandboxes.
 *  - Meta retries the webhook unless it gets a 200 within a few seconds, so we
 *    respond immediately and do the slow work afterwards.
 *
 * Usage: node scripts/meta/build-lead-workflow.js
 */
const { loadEnv, setEnv } = require('./lib');
const { FIELD_MAP, COLUMNS } = require('./normalize');

const env = loadEnv();
const WF_NAME = 'Meta Lead Ads → Sheet + WhatsApp';
const WEBHOOK_PATH = 'meta-leads';
const VERIFY_TOKEN = env.META_WEBHOOK_VERIFY_TOKEN || require('crypto').randomBytes(16).toString('hex');
if (!env.META_WEBHOOK_VERIFY_TOKEN) setEnv('META_WEBHOOK_VERIFY_TOKEN', VERIFY_TOKEN);

const CONSENT_KEY = env.META_CONSENT_FIELD_KEY || 'whatsapp_consent';
// gid of the 'All Leads' tab — stable for the life of the workbook.
const MASTER_GID = 417864124;
const RECIPIENTS = (env.WA_ALERT_RECIPIENTS || '918580875285,917486900000,917973109226').split(',');
const WA_PHONE_ID = env.WA_PHONE_NUMBER_ID || '1261828987009541'; // sandbox until the real number registers
const API = env.META_API_VERSION || 'v23.0';

const node = (name, type, typeVersion, position, parameters, extra = {}) =>
  ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 36), name, type, typeVersion, position, parameters, ...extra });

/* ---- Code node bodies -------------------------------------------------- */

// Meta batches changes; one POST can carry several leads across several forms.
const EXTRACT = `
const out = [];
for (const item of $input.all()) {
  const body = item.json.body || item.json;
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const v = change.value || {};
      if (!v.leadgen_id) continue;
      out.push({ json: {
        leadgen_id: v.leadgen_id,
        form_id: v.form_id || '',
        page_id: v.page_id || '',
        created_time: v.created_time ? new Date(v.created_time * 1000).toISOString() : '',
      }});
    }
  }
}
return out;
`.trim();

const NORMALISE = `
const FIELD_MAP = ${JSON.stringify(FIELD_MAP, null, 2)};
const COLUMNS = ${JSON.stringify(COLUMNS)};

function normalisePhone(raw) {
  if (!raw) return '';
  let v = String(raw).replace(/^p:/i, '').replace(/[^\\d+]/g, '');
  if (!v.startsWith('+')) {
    if (v.length === 10) v = '+91' + v;
    else if (v.length > 10) v = '+' + v;
  }
  return v;
}
function toIst(iso) {
  if (!iso) return '';
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date(iso)).reduce((a, x) => (a[x.type] = x.value, a), {});
  return p.year + '-' + p.month + '-' + p.day + ' ' + p.hour + ':' + p.minute;
}

const out = [];
for (const item of $input.all()) {
  const lead = item.json;
  const rec = { received_ist: toIst(lead.created_time), lead_id: lead.id || '', form_name: lead.form_name || '' };
  const extra = [];
  for (const f of lead.field_data || []) {
    const value = (f.values || []).join(', ').trim();
    if (!value) continue;
    const key = FIELD_MAP[f.name];
    if (key) rec[key] = key === 'phone' ? normalisePhone(value) : value;
    else extra.push(f.name + ': ' + value);
  }
  rec.extra = extra.join(' | ');
  rec.campaign = lead.campaign_name || 'No campaign';
  rec.adset = lead.adset_name || '';
  rec.ad = lead.ad_name || '';
  rec.platform = lead.platform === 'ig' ? 'Instagram' : lead.platform === 'fb' ? 'Facebook' : (lead.platform || '');
  // Google Sheets tab titles reject : \\\\ / ? * [ ]
  rec._tab = rec.campaign.replace(/[:\\\\/?*\\[\\]]/g, '-').slice(0, 90).trim() || 'Unknown';
  rec._row = COLUMNS.map(c => rec[c] ?? '');
  // Short, readable summary for the WhatsApp alert body.
  rec._business = [rec.business_type, rec.team_size].filter(Boolean).join(', ')
    || [rec.company, rec.website].filter(Boolean).join(' — ')
    || 'Not stated';
  rec._wants = rec.automate_area || rec.looking_for || rec.biggest_challenge || 'Not stated';

  // Consent to be messaged on WhatsApp. Meta returns disclaimer answers in
  // custom_disclaimer_responses on newer forms, but older/other shapes put them in
  // field_data, so check both. Absent means NO — never assume consent.
  const CONSENT_KEY = '${CONSENT_KEY}';
  let consented = false;
  // Meta reports a ticked box as is_checked: "1" — NOT "true". Testing for 'true'
  // silently read every consenting lead as non-consenting and suppressed the nudge.
  const isTicked = (v) => v === true || /^(1|true|yes|on|checked)$/i.test(String(v ?? ''));
  for (const d of lead.custom_disclaimer_responses || []) {
    for (const c of d.checkbox_key ? [d] : (d.responses || [])) {
      if (c.checkbox_key === CONSENT_KEY && isTicked(c.is_checked)) consented = true;
    }
  }
  for (const f of lead.field_data || []) {
    if (f.name === CONSENT_KEY && isTicked((f.values || []).join(''))) consented = true;
  }
  rec._consent = consented;
  rec.consent = consented ? 'yes' : 'no';

  // Defence in depth. Nothing upstream should ever hand us a months-old lead, but on
  // 2026-08-31 a broken reconciler did exactly that and 258 alerts went out about
  // leads from June. The sheet still records anything it is given; only the MESSAGING
  // is gated on the lead being genuinely new.
  const ageMs = lead.created_time ? (Date.now() - new Date(lead.created_time).getTime()) : 0;
  rec._age_days = Math.floor(ageMs / 864e5);
  rec._is_recent = rec._age_days <= 7;
  rec._first_name = String(rec.name || '').trim().split(/\\s+/)[0] || 'there';
  rec._enquiry = rec.looking_for || rec.automate_area || 'your enquiry';
  out.push({ json: rec });
}
return out;
`.trim();

// One WhatsApp send per recipient, so a single bad number cannot suppress the rest.
// The message body is assembled here rather than in the HTTP node's expression:
// a multi-line inline expression silently produced a malformed body, and doing it
// in code also lets us sanitise the values.
const FANOUT = `
const recipients = ${JSON.stringify(RECIPIENTS)};

// WhatsApp rejects template parameters containing newlines, tabs, or runs of 4+
// spaces, and several leads typed multi-line answers into the form.
function clean(v, max = 240) {
  const s = String(v ?? '').replace(/[\\r\\n\\t]+/g, ' / ').replace(/\\s{2,}/g, ' ').trim();
  return (s.length > max ? s.slice(0, max - 1) + '…' : s) || 'Not given';
}

// Read the lead from Normalise BY NAME, not from $input. This node sits at the end
// of the sheet-writing chain, so $input holds the Google Sheets API response — every
// lead field would be undefined and every alert would read "Not given".
const out = [];
for (const item of $('Normalise').all()) {
  const r = item.json;
  // A stale lead is still written to the sheet upstream — it just never triggers an
  // alert. This is the last line of defence against a replay storm.
  if (!r._is_recent) {
    console.log('skipping alert: lead ' + r.lead_id + ' is ' + r._age_days + ' days old');
    continue;
  }
  const parameters = [r.campaign, r.name, r.phone, r._business, r._wants]
    .map(v => ({ type: 'text', text: clean(v) }));
  for (const to of recipients) {
    out.push({ json: { ...r, _to: to, wa_body: {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: { name: 'new_lead_alert', language: { code: 'en' }, components: [{ type: 'body', parameters }] },
    } } });
  }
}
return out;
`.trim();

/* ---- Nodes ------------------------------------------------------------- */

const nodes = [
  node('Webhook', 'n8n-nodes-base.webhook', 2.1, [-660, 300], {
    httpMethod: ['GET', 'POST'], multipleMethods: true, path: WEBHOOK_PATH,
    responseMode: 'responseNode', options: {},
  }, { webhookId: 'meta-leads-webhook' }),

  node('Respond Challenge', 'n8n-nodes-base.respondToWebhook', 1.1, [-220, 180], {
    respondWith: 'text',
    responseBody: '={{ $json.query["hub.verify_token"] === "' + VERIFY_TOKEN + '" ? $json.query["hub.challenge"] : "bad verify token" }}',
    options: {},
  }),

  // Answer Meta instantly; the chain below keeps running after the response.
  node('Ack 200', 'n8n-nodes-base.respondToWebhook', 1.1, [-220, 400], {
    respondWith: 'text', responseBody: 'EVENT_RECEIVED', options: {},
  }),

  node('Extract Lead IDs', 'n8n-nodes-base.code', 2, [0, 400], { jsCode: EXTRACT }),

  // The webhook payload has no answers in it — only an ID to look up.
  node('Fetch Lead', 'n8n-nodes-base.httpRequest', 4.2, [220, 400], {
    method: 'GET',
    url: '=https://graph.facebook.com/' + API + '/{{ $json.leadgen_id }}',
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'fields', value: 'created_time,id,field_data,custom_disclaimer_responses,campaign_name,adset_name,ad_name,form_id,platform' },
      { name: 'access_token', value: env.META_PAGE_TOKEN },
      { name: 'appsecret_proof', value: env.META_PAGE_TOKEN_PROOF },
    ] },
    options: { response: { response: { neverError: false } } },
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 2000 }),

  node('Normalise', 'n8n-nodes-base.code', 2, [440, 400], { jsCode: NORMALISE }),

  // Sheets access tokens live ~1h, so mint a fresh one per run.
  node('Google Token', 'n8n-nodes-base.httpRequest', 4.2, [660, 400], {
    method: 'POST', url: 'https://oauth2.googleapis.com/token',
    sendBody: true, contentType: 'form-urlencoded',
    bodyParameters: { parameters: [
      { name: 'client_id', value: env.GSC_CLIENT_ID },
      { name: 'client_secret', value: env.GSC_CLIENT_SECRET },
      { name: 'refresh_token', value: env.GOOGLE_OAUTH_REFRESH_TOKEN },
      { name: 'grant_type', value: 'refresh_token' },
    ] },
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 2000 }),

  // The master tab is sorted newest-first and used as the call queue, so a new lead
  // must go to the TOP. Appending put it at row 170 of 170 — precisely where nobody
  // looks. Insert a blank row 2 first, then write into it.
  node('Insert Row At Top', 'n8n-nodes-base.httpRequest', 4.2, [880, 400], {
    method: 'POST',
    url: 'https://sheets.googleapis.com/v4/spreadsheets/' + env.META_LEADS_SHEET_ID + ':batchUpdate',
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'Authorization', value: '=Bearer {{ $json.access_token }}' }] },
    sendBody: true, specifyBody: 'json',
    jsonBody: `={{ ({ requests: [ { insertDimension: { range: { sheetId: ${MASTER_GID}, dimension: "ROWS", startIndex: 1, endIndex: 2 }, inheritFromBefore: false } } ] }) }}`,
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 2000 }),

  node('Write Newest Lead', 'n8n-nodes-base.httpRequest', 4.2, [1000, 400], {
    method: 'PUT',
    url: 'https://sheets.googleapis.com/v4/spreadsheets/' + env.META_LEADS_SHEET_ID
      + "/values/'All Leads'!A2?valueInputOption=RAW",
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'Authorization', value: "=Bearer {{ $('Google Token').item.json.access_token }}" }] },
    sendBody: true, specifyBody: 'json',
    jsonBody: "={{ ({ values: [ $('Normalise').item.json._row ] }) }}",
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 2000 }),

  // The campaign tab may not exist yet (a brand-new campaign). A failed append
  // must not block the WhatsApp alert, so this branch continues on error.
  node('Append Campaign Tab', 'n8n-nodes-base.httpRequest', 4.2, [1100, 400], {
    method: 'POST',
    url: '=https://sheets.googleapis.com/v4/spreadsheets/' + env.META_LEADS_SHEET_ID
      + "/values/'{{ $('Normalise').item.json._tab }}'!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'Authorization', value: "=Bearer {{ $('Google Token').item.json.access_token }}" }] },
    sendBody: true, specifyBody: 'json',
    jsonBody: "={{ ({ values: [ $('Normalise').item.json._row ] }) }}",
    options: {},
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 2000 }),

  node('Fan Out Recipients', 'n8n-nodes-base.code', 2, [1320, 400], { jsCode: FANOUT }),

  node('Send WhatsApp', 'n8n-nodes-base.httpRequest', 4.2, [1540, 400], {
    method: 'POST',
    url: 'https://graph.facebook.com/' + API + '/' + WA_PHONE_ID + '/messages',
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'access_token', value: env.META_ACCESS_TOKEN },
      { name: 'appsecret_proof', value: env.META_ACCESS_TOKEN_PROOF },
    ] },
    sendBody: true, specifyBody: 'json',
    jsonBody: '={{ $json.wa_body }}',
    options: {},
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 3000 }),

  // Messages the LEAD, not us. Live since the consent-carrying form
  // (META_LEAD_FORM_ID_V2) went into the ad. The 'Consented?' gate in front of it is
  // what keeps this safe — sending without a ticked box risks the number being banned.
  node('Nudge Lead', 'n8n-nodes-base.httpRequest', 4.2, [1760, 560], {
    method: 'POST',
    url: 'https://graph.facebook.com/' + API + '/' + WA_PHONE_ID + '/messages',
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'access_token', value: env.META_ACCESS_TOKEN },
      { name: 'appsecret_proof', value: env.META_ACCESS_TOKEN_PROOF },
    ] },
    sendBody: true, specifyBody: 'json',
    jsonBody: `={{ ({
      messaging_product: "whatsapp",
      to: $('Normalise').item.json.phone.replace('+',''),
      type: "template",
      template: { name: "lead_ack", language: { code: "en" }, components: [{ type: "body", parameters: [
        { type: "text", text: $('Normalise').item.json._first_name },
        { type: "text", text: $('Normalise').item.json._enquiry }
      ]}]}
    }) }}`,
    options: {},
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 3000 }),

  // Only people who ticked the WhatsApp consent box and gave a number get nudged.
  node('Consented?', 'n8n-nodes-base.if', 2.2, [1540, 560], {
    conditions: { options: { caseSensitive: false, version: 2 }, combinator: 'and', conditions: [
      { id: 'c1', operator: { type: 'boolean', operation: 'true', singleValue: true },
        leftValue: '={{ $json._consent }}', rightValue: '' },
      { id: 'c2', operator: { type: 'string', operation: 'notEmpty', singleValue: true },
        leftValue: '={{ $json.phone }}', rightValue: '' },
      // Never nudge someone about an enquiry they made weeks ago.
      { id: 'c3', operator: { type: 'boolean', operation: 'true', singleValue: true },
        leftValue: '={{ $json._is_recent }}', rightValue: '' },
    ] },
    options: {},
  }),

  node('Notes', 'n8n-nodes-base.stickyNote', 1, [-680, 40], {
    width: 640, height: 200,
    content: `## Meta Lead Ads → Sheet + WhatsApp\n\n`
      + `Webhook: \`https://n8n.chronexa.io/webhook/${WEBHOOK_PATH}\`\n`
      + `Sheet: https://docs.google.com/spreadsheets/d/${env.META_LEADS_SHEET_ID}/edit\n\n`
      + `Sends from WhatsApp phone_number_id \`${WA_PHONE_ID}\` using template \`new_lead_alert\`.\n`
      + `To switch to the real Chronexa number, change WA_PHONE_NUMBER_ID in .env and re-run\n`
      + `\`node scripts/meta/build-lead-workflow.js\`.`,
  }),
];

const connections = {
  // multipleMethods gives the Webhook node one output per method, in the order
  // declared above: output 0 = GET (Meta's one-time verification handshake),
  // output 1 = POST (every real lead).
  Webhook: { main: [
    [{ node: 'Respond Challenge', type: 'main', index: 0 }],
    [{ node: 'Ack 200', type: 'main', index: 0 }],
  ] },
  'Ack 200': { main: [[{ node: 'Extract Lead IDs', type: 'main', index: 0 }]] },
  'Extract Lead IDs': { main: [[{ node: 'Fetch Lead', type: 'main', index: 0 }]] },
  'Fetch Lead': { main: [[{ node: 'Normalise', type: 'main', index: 0 }]] },
  Normalise: { main: [[
    { node: 'Google Token', type: 'main', index: 0 },
    { node: 'Consented?', type: 'main', index: 0 },
  ]] },
  'Consented?': { main: [[{ node: 'Nudge Lead', type: 'main', index: 0 }], []] },
  'Google Token': { main: [[{ node: 'Insert Row At Top', type: 'main', index: 0 }]] },
  'Insert Row At Top': { main: [[{ node: 'Write Newest Lead', type: 'main', index: 0 }]] },
  'Write Newest Lead': { main: [[{ node: 'Append Campaign Tab', type: 'main', index: 0 }]] },
  'Append Campaign Tab': { main: [[{ node: 'Fan Out Recipients', type: 'main', index: 0 }]] },
  'Fan Out Recipients': { main: [[{ node: 'Send WhatsApp', type: 'main', index: 0 }]] },
};

(async () => {
  const base = env.N8N_API_URL.replace(/\/+$/, '');
  const H = { 'X-N8N-API-KEY': env.N8N_API_KEY, 'Content-Type': 'application/json' };
  const body = { name: WF_NAME, nodes, connections, settings: { executionOrder: 'v1' } };

  const list = await (await fetch(`${base}/workflows?limit=250`, { headers: H })).json();
  const existing = (list.data || []).find((w) => w.name === WF_NAME);

  let id;
  if (existing) {
    const r = await fetch(`${base}/workflows/${existing.id}`, { method: 'PUT', headers: H, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(`update failed ${r.status} ${JSON.stringify(j).slice(0, 400)}`);
    id = existing.id; console.log('updated workflow', id);
  } else {
    const r = await fetch(`${base}/workflows`, { method: 'POST', headers: H, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(`create failed ${r.status} ${JSON.stringify(j).slice(0, 400)}`);
    id = j.id; console.log('created workflow', id);
  }
  setEnv('N8N_META_LEADS_WORKFLOW_ID', id);
  console.log(`webhook: https://n8n.chronexa.io/webhook/${WEBHOOK_PATH}`);
  console.log(`verify token: ${VERIFY_TOKEN}`);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
