#!/usr/bin/env node
/**
 * Backfill every Meta Instant-Form lead into one Google Sheet.
 *
 * Creates the workbook on first run and records its ID in .env as META_LEADS_SHEET_ID;
 * on later runs it reuses that workbook and rewrites the tabs, so this is safe to
 * re-run. Layout: an "All Leads" master tab (newest first — that is the call list)
 * plus one tab per campaign for reporting.
 *
 * Usage: node scripts/meta/export-leads.js
 */
const { loadEnv, setEnv, graphAll, googleAccessToken, sheets } = require('./lib');
const { COLUMNS, normaliseLead, rowFor, safeTabName } = require('./normalize');

const TITLE = 'Chronexa — Meta Leads';
const MASTER = 'All Leads';

async function fetchAllLeads(env) {
  const auth = { token: env.META_ACCESS_TOKEN, secret: env.META_APP_SECRET, version: env.META_API_VERSION || 'v23.0' };
  const forms = await graphAll(`${env.META_PAGE_ID}/leadgen_forms`, { fields: 'name,status,leads_count', limit: 100 }, authPage(env, auth));
  const leads = [];
  for (const form of forms) {
    if (!form.leads_count) continue;
    const raw = await graphAll(`${form.id}/leads`, {
      fields: 'created_time,field_data,custom_disclaimer_responses,campaign_name,adset_name,ad_name,platform', limit: 100,
    }, authPage(env, auth));
    for (const l of raw) leads.push(normaliseLead(l, form.name));
    console.log(`  form ${form.id} "${form.name}" -> ${raw.length} leads`);
  }
  // Newest first: the sheet doubles as a call queue.
  leads.sort((a, b) => b.received_ist.localeCompare(a.received_ist));
  return leads;
}

/** Lead retrieval is a Page-token operation; the system-user token is rejected with #190. */
function authPage(env, base) {
  return { ...base, token: env.META_PAGE_TOKEN, secret: env.META_APP_SECRET };
}

async function ensurePageToken(env) {
  if (env.META_PAGE_TOKEN) return env.META_PAGE_TOKEN;
  const { graphGet } = require('./lib');
  const r = await graphGet(env.META_PAGE_ID, { fields: 'access_token' }, {
    token: env.META_ACCESS_TOKEN, secret: env.META_APP_SECRET, version: env.META_API_VERSION || 'v23.0',
  });
  if (!r.access_token) throw new Error('Could not mint a Page access token');
  setEnv('META_PAGE_TOKEN', r.access_token);
  env.META_PAGE_TOKEN = r.access_token;
  console.log('minted + saved META_PAGE_TOKEN');
  return r.access_token;
}

/** Campaigns currently delivering — they need a tab before their first lead arrives. */
async function activeCampaignNames(env) {
  const { graphAll } = require('./lib');
  const camps = await graphAll(`${env.META_AD_ACCOUNT_ID}/campaigns`,
    { fields: 'name,effective_status', limit: 200 },
    { token: env.META_ACCESS_TOKEN, secret: env.META_APP_SECRET, version: env.META_API_VERSION || 'v23.0' });
  return camps.filter((c) => c.effective_status === 'ACTIVE').map((c) => c.name);
}

async function ensureWorkbook(env, at) {
  if (env.META_LEADS_SHEET_ID) {
    try {
      await sheets('GET', `/${env.META_LEADS_SHEET_ID}?fields=spreadsheetId`, at);
      return env.META_LEADS_SHEET_ID;
    } catch {
      console.log('stored sheet ID unreachable, creating a fresh workbook');
    }
  }
  const created = await sheets('POST', '', at, {
    properties: { title: TITLE, locale: 'en_GB', timeZone: 'Asia/Kolkata' },
    sheets: [{ properties: { title: MASTER } }],
  });
  setEnv('META_LEADS_SHEET_ID', created.spreadsheetId);
  console.log('created workbook', created.spreadsheetId);
  return created.spreadsheetId;
}

/**
 * Snapshot any column a human added that this script does not own, keyed by lead_id.
 *
 * This script clears and rewrites whole tabs, which on 2026-08-31 silently destroyed
 * six columns Tushar had been filling in by hand — Call Status, remarks, follow-up
 * dates and more — along with every note in them. The sheet is a shared working
 * document, not a private output, so anything we did not write must survive a rebuild.
 */
async function snapshotManualColumns(sheetId, at, tab) {
  let existing;
  try {
    existing = await sheets('GET', `/${sheetId}/values/${encodeURIComponent(`'${tab}'!A:ZZ`)}`, at);
  } catch {
    return null; // Tab does not exist yet — nothing to preserve.
  }
  const values = existing.values || [];
  const header = values[0] || [];
  if (!header.length) return null;

  const owned = new Set(COLUMNS);
  const manual = header.map((name, i) => ({ name, i })).filter((c) => c.name && !owned.has(c.name));
  if (!manual.length) return null;

  const leadCol = header.indexOf('lead_id');
  if (leadCol === -1) return null;

  const byLead = {};
  for (const row of values.slice(1)) {
    const id = row[leadCol];
    if (!id) continue;
    const vals = manual.map((c) => row[c.i] ?? '');
    if (vals.some((v) => String(v).trim())) byLead[id] = vals;
  }
  return { names: manual.map((c) => c.name), byLead };
}

/** Re-attach preserved columns to the right of the columns this script owns. */
async function restoreManualColumns(sheetId, at, tab, snap, orderedLeadIds) {
  if (!snap) return 0;
  const blank = snap.names.map(() => '');
  const rows = orderedLeadIds.map((id) => snap.byLead[id] || blank);
  const startCol = COLUMNS.length; // 0-indexed, so this is the first free column
  const a1 = (n) => (n < 26 ? String.fromCharCode(65 + n) : String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26)));
  const range = `'${tab}'!${a1(startCol)}1`;
  await sheets('PUT', `/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, at,
    { values: [snap.names, ...rows] });
  return Object.keys(snap.byLead).length;
}

/** Create any missing tabs, then clear the ones we are about to rewrite. */
async function syncTabs(sheetId, at, wanted) {
  const meta = await sheets('GET', `/${sheetId}?fields=sheets.properties`, at);
  const existing = new Map(meta.sheets.map((s) => [s.properties.title, s.properties.sheetId]));
  const missing = wanted.filter((t) => !existing.has(t));
  if (missing.length) {
    await sheets('POST', `/${sheetId}:batchUpdate`, at, {
      requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
    });
  }
  const clearing = wanted.filter((t) => existing.has(t));
  if (clearing.length) {
    await sheets('POST', `/${sheetId}/values:batchClear`, at, { ranges: clearing.map((t) => `'${t}'!A:Z`) });
  }
  return missing;
}

/** Freeze + bold the header row so the sheet is usable on a phone. */
async function formatTabs(sheetId, at, titles) {
  const meta = await sheets('GET', `/${sheetId}?fields=sheets.properties`, at);
  const byTitle = new Map(meta.sheets.map((s) => [s.properties.title, s.properties.sheetId]));
  const requests = [];
  for (const t of titles) {
    const gid = byTitle.get(t);
    if (gid === undefined) continue;
    requests.push({ updateSheetProperties: { properties: { sheetId: gid, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
    requests.push({ repeatCell: {
      range: { sheetId: gid, startRowIndex: 0, endRowIndex: 1 },
      cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.93, green: 0.93, blue: 0.95 } } },
      fields: 'userEnteredFormat(textFormat,backgroundColor)',
    } });
    requests.push({ autoResizeDimensions: { dimensions: { sheetId: gid, dimension: 'COLUMNS', startIndex: 0, endIndex: COLUMNS.length } } });
  }
  if (requests.length) await sheets('POST', `/${sheetId}:batchUpdate`, at, { requests });
}

(async () => {
  const env = loadEnv();
  await ensurePageToken(env);

  console.log('fetching leads from Meta...');
  const leads = await fetchAllLeads(env);
  console.log(`total ${leads.length} leads\n`);

  const at = await googleAccessToken(env);
  const sheetId = await ensureWorkbook(env, at);

  const byCampaign = new Map();
  for (const l of leads) {
    const tab = safeTabName(l.campaign || 'No campaign');
    if (!byCampaign.has(tab)) byCampaign.set(tab, []);
    byCampaign.get(tab).push(l);
  }

  // A campaign that just went live has no leads yet, so it would get no tab and its
  // first real lead would have nowhere to land. Create tabs for active campaigns too.
  for (const name of await activeCampaignNames(env)) {
    const tab = safeTabName(name);
    if (!byCampaign.has(tab)) byCampaign.set(tab, []);
  }

  const tabs = [MASTER, ...byCampaign.keys()];

  // Capture anything a human added BEFORE the clear, so it can be put back after.
  const snapshots = {};
  for (const tab of tabs) snapshots[tab] = await snapshotManualColumns(sheetId, at, tab);

  await syncTabs(sheetId, at, tabs);

  const data = [{ range: `'${MASTER}'!A1`, values: [COLUMNS, ...leads.map(rowFor)] }];
  for (const [tab, rows] of byCampaign) data.push({ range: `'${tab}'!A1`, values: [COLUMNS, ...rows.map(rowFor)] });
  await sheets('POST', `/${sheetId}/values:batchUpdate`, at, { valueInputOption: 'RAW', data });

  // Put the human columns back, realigned to the new row order.
  let restored = 0;
  restored += await restoreManualColumns(sheetId, at, MASTER, snapshots[MASTER], leads.map((l) => l.lead_id));
  for (const [tab, rows] of byCampaign) {
    restored += await restoreManualColumns(sheetId, at, tab, snapshots[tab], rows.map((l) => l.lead_id));
  }
  if (restored) console.log(`preserved manual columns on ${restored} row(s)`);

  await formatTabs(sheetId, at, tabs);

  console.log(`wrote ${MASTER}: ${leads.length} rows`);
  for (const [tab, rows] of byCampaign) console.log(`  ${tab}: ${rows.length}`);
  console.log(`\nhttps://docs.google.com/spreadsheets/d/${sheetId}/edit`);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
