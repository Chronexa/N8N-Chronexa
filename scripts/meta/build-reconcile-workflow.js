#!/usr/bin/env node
/**
 * Build + deploy "Meta Leads — Reconcile" — the safety net behind the webhook.
 *
 * Webhooks are best-effort. Meta will not deliver them at all while the app is
 * unpublished, and even a published app can miss one during an outage. On
 * 2026-08-27 a real lead (Abhay / LUMERA) was lost this way and nobody knew until
 * the counts were compared by hand.
 *
 * This runs every 15 minutes, compares the lead IDs Meta holds against the IDs
 * already in the sheet, and replays anything missing through the SAME webhook the
 * live pipeline uses. Replaying rather than duplicating the logic means the sheet
 * write, the team alert and the consent-gated nudge all behave identically whether
 * a lead arrived by webhook or by reconciliation.
 *
 * Reading the sheet first is what makes it safe to run repeatedly: a lead already
 * present is never replayed, so there are no duplicate rows and no duplicate alerts.
 *
 * Usage: node scripts/meta/build-reconcile-workflow.js
 */
const { loadEnv, setEnv } = require('./lib');

const env = loadEnv();
const WF_NAME = 'Meta Leads — Reconcile';
const API = env.META_API_VERSION || 'v23.0';
// Read the header + every column and locate lead_id BY NAME. Hardcoding a column
// letter caused a real incident on 2026-08-31: adding a 'consent' column shifted
// lead_id from T to U, the reconciler matched nothing, concluded all 174 leads were
// missing, and replayed the lot — hundreds of WhatsApp messages about months-old leads.
const LEAD_ID_RANGE = "'All Leads'!A:Z";

const node = (name, type, typeVersion, position, parameters, extra = {}) =>
  ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 36), name, type, typeVersion, position, parameters, ...extra });

const PICK_FORMS = `
const res = $input.first().json;
const out = [];
for (const f of res.data || []) {
  if ((f.leads_count || 0) > 0) out.push({ json: { form_id: f.id, name: f.name, leads_count: f.leads_count } });
}
return out;
`.trim();

const DIFF = `
// --- Safeguard 1: only ever consider genuinely recent leads -------------------
// The webhook handles live leads; this net exists for the ones it drops. A lead
// older than a week is not a delivery failure, it is history — replaying it means
// WhatsApping someone about an enquiry they made months ago.
const MAX_AGE_DAYS = 7;
// --- Safeguard 2: never replay more than a handful in one run ----------------
// If this cap is ever hit something is wrong with the comparison, not with Meta.
// Better to under-deliver and log loudly than to spam the team and the leads.
const MAX_REPLAYS = 5;

const cutoff = Date.now() - MAX_AGE_DAYS * 864e5;
const recent = [];
for (const item of $input.all()) {
  for (const l of item.json.data || []) {
    if (!l.id) continue;
    const t = l.created_time ? new Date(l.created_time).getTime() : 0;
    if (t && t >= cutoff) recent.push(String(l.id));
  }
}

// --- Safeguard 3: find lead_id by header name, never by column position ------
const sheet = $('Read Sheet IDs').first().json;
const values = sheet.values || [];
const header = values[0] || [];
const col = header.indexOf('lead_id');
if (col === -1) {
  // Refuse to guess. Emitting nothing is safe; guessing replays everything.
  console.log('RECONCILE ABORTED: no lead_id column found in the sheet header');
  return [];
}
const known = new Set(values.slice(1).map(r => String((r && r[col]) || '')).filter(Boolean));
if (known.size === 0) {
  console.log('RECONCILE ABORTED: sheet returned zero known lead ids — refusing to replay');
  return [];
}

let missing = [...new Set(recent)].filter(id => !known.has(id));
if (missing.length > MAX_REPLAYS) {
  console.log('RECONCILE ABORTED: ' + missing.length + ' leads looked missing, over the cap of '
    + MAX_REPLAYS + '. This means the comparison is broken, not that Meta dropped that many.');
  return [];
}

return missing.map(id => ({ json: {
  leadgen_id: id,
  replay_payload: {
    object: 'page',
    entry: [{
      id: '${env.META_PAGE_ID}',
      time: Math.floor(Date.now() / 1000),
      changes: [{ field: 'leadgen', value: {
        leadgen_id: id,
        page_id: '${env.META_PAGE_ID}',
        created_time: Math.floor(Date.now() / 1000),
      } }],
    }],
  },
} }));
`.trim();

const nodes = [
  node('Every 15 minutes', 'n8n-nodes-base.scheduleTrigger', 1.2, [-720, 300], {
    rule: { interval: [{ field: 'minutes', minutesInterval: 15 }] },
  }),

  node('Google Token', 'n8n-nodes-base.httpRequest', 4.2, [-500, 300], {
    method: 'POST', url: 'https://oauth2.googleapis.com/token',
    sendBody: true, contentType: 'form-urlencoded',
    bodyParameters: { parameters: [
      { name: 'client_id', value: env.GSC_CLIENT_ID },
      { name: 'client_secret', value: env.GSC_CLIENT_SECRET },
      { name: 'refresh_token', value: env.GOOGLE_OAUTH_REFRESH_TOKEN },
      { name: 'grant_type', value: 'refresh_token' },
    ] },
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 }),

  node('Read Sheet IDs', 'n8n-nodes-base.httpRequest', 4.2, [-280, 300], {
    method: 'GET',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${env.META_LEADS_SHEET_ID}/values/${encodeURIComponent(LEAD_ID_RANGE)}`,
    sendHeaders: true,
    headerParameters: { parameters: [{ name: 'Authorization', value: '=Bearer {{ $json.access_token }}' }] },
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 }),

  node('Get Forms', 'n8n-nodes-base.httpRequest', 4.2, [-60, 300], {
    method: 'GET',
    url: `https://graph.facebook.com/${API}/${env.META_PAGE_ID}/leadgen_forms`,
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'fields', value: 'name,leads_count' },
      { name: 'limit', value: '100' },
      { name: 'access_token', value: env.META_PAGE_TOKEN },
      { name: 'appsecret_proof', value: env.META_PAGE_TOKEN_PROOF },
    ] },
    options: {},
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 }),

  node('Pick Active Forms', 'n8n-nodes-base.code', 2, [160, 300], { jsCode: PICK_FORMS }),

  // Newest 50 per form is plenty: this runs every 15 minutes, and the backfill
  // script covers anything older.
  node('Get Recent Leads', 'n8n-nodes-base.httpRequest', 4.2, [380, 300], {
    method: 'GET',
    url: '=https://graph.facebook.com/' + API + '/{{ $json.form_id }}/leads',
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'fields', value: 'id,created_time' },
      { name: 'limit', value: '50' },
      { name: 'access_token', value: env.META_PAGE_TOKEN },
      { name: 'appsecret_proof', value: env.META_PAGE_TOKEN_PROOF },
    ] },
    options: {},
  }, { retryOnFail: true, maxTries: 2, waitBetweenTries: 3000, alwaysOutputData: true }),

  node('Find Missing', 'n8n-nodes-base.code', 2, [600, 300], { jsCode: DIFF }),

  // Replayed through the live webhook so every downstream behaviour is identical.
  node('Replay Through Webhook', 'n8n-nodes-base.httpRequest', 4.2, [820, 300], {
    method: 'POST',
    url: 'https://n8n.chronexa.io/webhook/meta-leads',
    sendBody: true, specifyBody: 'json',
    jsonBody: '={{ $json.replay_payload }}',
    options: {},
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 3000 }),

  node('Notes', 'n8n-nodes-base.stickyNote', 1, [-740, 20], {
    width: 700, height: 190,
    content: '## Meta Leads — Reconcile (safety net)\n\n'
      + 'Every 15 min: compare lead IDs in Meta against lead IDs already in the sheet,\n'
      + 'and replay any missing one through the live webhook.\n\n'
      + 'Exists because Meta does NOT deliver webhooks while the app is unpublished —\n'
      + 'a real lead was lost that way on 2026-08-27. Safe to run forever: leads already\n'
      + 'in the sheet are never replayed, so no duplicate rows or alerts.',
  }),
];

const connections = {
  'Every 15 minutes': { main: [[{ node: 'Google Token', type: 'main', index: 0 }]] },
  'Google Token': { main: [[{ node: 'Read Sheet IDs', type: 'main', index: 0 }]] },
  'Read Sheet IDs': { main: [[{ node: 'Get Forms', type: 'main', index: 0 }]] },
  'Get Forms': { main: [[{ node: 'Pick Active Forms', type: 'main', index: 0 }]] },
  'Pick Active Forms': { main: [[{ node: 'Get Recent Leads', type: 'main', index: 0 }]] },
  'Get Recent Leads': { main: [[{ node: 'Find Missing', type: 'main', index: 0 }]] },
  'Find Missing': { main: [[{ node: 'Replay Through Webhook', type: 'main', index: 0 }]] },
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
    if (!r.ok) throw new Error(`update failed ${r.status} ${JSON.stringify(await r.json()).slice(0, 400)}`);
    id = existing.id; console.log('updated workflow', id);
  } else {
    const r = await fetch(`${base}/workflows`, { method: 'POST', headers: H, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(`create failed ${r.status} ${JSON.stringify(j).slice(0, 400)}`);
    id = j.id; console.log('created workflow', id);
  }
  setEnv('N8N_META_RECONCILE_WORKFLOW_ID', id);
  const act = await fetch(`${base}/workflows/${id}/activate`, { method: 'POST', headers: H });
  console.log('activate ->', act.status);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
