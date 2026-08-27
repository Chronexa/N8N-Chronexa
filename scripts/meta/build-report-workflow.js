#!/usr/bin/env node
/**
 * Build + deploy the "Meta Ads — Daily Report" n8n workflow.
 *
 * Runs at 09:00 IST, pulls yesterday's and the day-before's account numbers from
 * Meta, and WhatsApps a short summary to the founders. Comparing two days is what
 * makes the message worth reading — a bare "spend 400, leads 3" tells you nothing
 * about whether that is good.
 *
 * Usage: node scripts/meta/build-report-workflow.js
 */
const { loadEnv, setEnv } = require('./lib');

const env = loadEnv();
const WF_NAME = 'Meta Ads — Daily Report';
const API = env.META_API_VERSION || 'v23.0';
const WA_PHONE_ID = env.WA_PHONE_NUMBER_ID;
const RECIPIENTS = (env.WA_ALERT_RECIPIENTS || '').split(',').filter(Boolean);

const node = (name, type, typeVersion, position, parameters, extra = {}) =>
  ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 36), name, type, typeVersion, position, parameters, ...extra });

// Meta's `actions` array reports a lead under several names; `lead` is the canonical
// one. Summing the others double-counts, which is how a 165-lead account looks like 330.
const SUMMARISE = `
function leadsOf(row) {
  for (const a of row.actions || []) if (a.action_type === 'lead') return Number(a.value) || 0;
  return 0;
}
// alwaysOutputData means an account with no delivery still yields one empty item,
// so rows without a date must be dropped or the report renders "Invalid Date".
const rows = $input.all().map(i => i.json).filter(r => r && r.date_start);
const byDate = {};
for (const r of rows) byDate[r.date_start] = r;
const dates = Object.keys(byDate).sort();
const prev = dates.length > 1 ? byDate[dates[0]] : null;

// Fall back to yesterday in IST when nothing delivered at all — a zero report is
// still a useful report ("we spent nothing"), an error is not.
const istYesterday = new Date(Date.now() + 5.5 * 3600e3 - 864e5).toISOString().slice(0, 10);
const day = byDate[dates[dates.length - 1]] || { spend: 0, actions: [], date_start: istYesterday };

const spend = Number(day.spend) || 0;
const leads = leadsOf(day);
const cpl   = leads ? spend / leads : 0;

const pSpend = prev ? Number(prev.spend) || 0 : null;
const pLeads = prev ? leadsOf(prev) : null;

function delta(now, before, label, isMoney) {
  if (before === null || before === 0) return null;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return label + ' flat';
  return label + ' ' + (pct > 0 ? 'up ' : 'down ') + Math.abs(pct) + '%';
}
const bits = [delta(spend, pSpend, 'spend'), delta(leads, pLeads, 'leads')].filter(Boolean);
const compare = bits.length ? bits.join(', ') : 'no comparable day before';

// WhatsApp template parameters reject newlines and runs of 4+ spaces.
const clean = v => String(v ?? '').replace(/[\\r\\n\\t]+/g, ' ').replace(/\\s{2,}/g, ' ').trim() || 'None';
const fmtDate = new Date(day.date_start + 'T00:00:00+05:30')
  .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

return [{ json: {
  report_date: clean(fmtDate),
  spend: 'Rs ' + spend.toFixed(0),
  leads: String(leads),
  cpl: leads ? 'Rs ' + cpl.toFixed(0) : 'no leads yet',
  compare: clean(compare),
  _raw: { spend, leads, date: day.date_start },
} }];
`.trim();

const BEST = `
function leadsOf(row) {
  for (const a of row.actions || []) if (a.action_type === 'lead') return Number(a.value) || 0;
  return 0;
}
const rows = $input.all().map(i => i.json);
// Best = most leads; spend breaks a tie the cheap way round.
let best = null;
for (const r of rows) {
  const l = leadsOf(r), s = Number(r.spend) || 0;
  if (!best || l > best.l || (l === best.l && l > 0 && s < best.s)) best = { name: r.campaign_name, l, s };
}
const summary = $('Summarise Day').first().json;
const label = !best || best.l === 0
  ? (rows.length ? 'none produced a lead' : 'nothing ran')
  : best.name + ' (' + best.l + ' lead' + (best.l === 1 ? '' : 's') + ' at Rs ' + (best.s / best.l).toFixed(0) + ')';

const clean = v => String(v ?? '').replace(/[\\r\\n\\t]+/g, ' ').replace(/\\s{2,}/g, ' ').trim() || 'None';
const out = [];
for (const to of ${JSON.stringify(RECIPIENTS)}) {
  out.push({ json: { to, wa_body: {
    messaging_product: 'whatsapp', to, type: 'template',
    template: { name: 'daily_ads_report', language: { code: 'en' }, components: [{ type: 'body', parameters: [
      { type: 'text', text: clean(summary.report_date) },
      { type: 'text', text: clean(summary.spend) },
      { type: 'text', text: clean(summary.leads) },
      { type: 'text', text: clean(summary.cpl) },
      { type: 'text', text: clean(label).slice(0, 240) },
      { type: 'text', text: clean(summary.compare) },
    ]}]},
  } } });
}
return out;
`.trim();

const insightsNode = (name, pos, level, extraFields) => node(name, 'n8n-nodes-base.httpRequest', 4.2, pos, {
  method: 'GET',
  url: `https://graph.facebook.com/${API}/${env.META_AD_ACCOUNT_ID}/insights`,
  sendQuery: true,
  queryParameters: { parameters: [
    { name: 'level', value: level },
    // Two days so the report can say whether yesterday was better or worse.
    { name: 'date_preset', value: 'last_2d' },
    { name: 'time_increment', value: level === 'account' ? '1' : 'all_days' },
    { name: 'fields', value: extraFields },
    { name: 'limit', value: '200' },
    { name: 'access_token', value: env.META_ACCESS_TOKEN },
    { name: 'appsecret_proof', value: env.META_ACCESS_TOKEN_PROOF },
  ] },
  options: {},
}, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, alwaysOutputData: true });

const nodes = [
  node('Every morning 9am IST', 'n8n-nodes-base.scheduleTrigger', 1.2, [-640, 300], {
    rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * *' }] },
  }),
  insightsNode('Account Insights', [-400, 300], 'account', 'spend,actions,date_start,date_stop'),
  node('Summarise Day', 'n8n-nodes-base.code', 2, [-160, 300], { jsCode: SUMMARISE }),
  insightsNode('Campaign Insights', [80, 300], 'campaign', 'campaign_name,spend,actions'),
  node('Build Message', 'n8n-nodes-base.code', 2, [320, 300], { jsCode: BEST }),
  node('Send Report', 'n8n-nodes-base.httpRequest', 4.2, [560, 300], {
    method: 'POST',
    url: `https://graph.facebook.com/${API}/${WA_PHONE_ID}/messages`,
    sendQuery: true,
    queryParameters: { parameters: [
      { name: 'access_token', value: env.META_ACCESS_TOKEN },
      { name: 'appsecret_proof', value: env.META_ACCESS_TOKEN_PROOF },
    ] },
    sendBody: true, specifyBody: 'json', jsonBody: '={{ $json.wa_body }}',
    options: {},
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 3000 }),
  node('Notes', 'n8n-nodes-base.stickyNote', 1, [-660, 40], {
    width: 620, height: 170,
    content: '## Meta Ads — Daily Report\n\n'
      + 'Fires 09:00 IST. Reads the ad account for the last 2 days, compares them, and\n'
      + 'WhatsApps the founders using the `daily_ads_report` template.\n\n'
      + 'Rebuild with `node scripts/meta/build-report-workflow.js`.',
  }),
];

const connections = {
  'Every morning 9am IST': { main: [[{ node: 'Account Insights', type: 'main', index: 0 }]] },
  'Account Insights': { main: [[{ node: 'Summarise Day', type: 'main', index: 0 }]] },
  'Summarise Day': { main: [[{ node: 'Campaign Insights', type: 'main', index: 0 }]] },
  'Campaign Insights': { main: [[{ node: 'Build Message', type: 'main', index: 0 }]] },
  'Build Message': { main: [[{ node: 'Send Report', type: 'main', index: 0 }]] },
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
  setEnv('N8N_META_REPORT_WORKFLOW_ID', id);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
