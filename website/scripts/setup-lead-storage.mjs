/**
 * One-time setup for website lead storage (user-requested):
 *  1. Google Sheet "Chronexa — Website Leads" (created by the GSC service
 *     account, shared with team@chronexa.io) — for quick access.
 *  2. Baserow table "Website Leads" in the existing DB (NOT the Master Leads DB).
 * Prints the IDs to put in .env. Keys read from .env (never hardcoded).
 * Run from repo root: node website/scripts/setup-lead-storage.mjs
 */
import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..'); // repo root
config({ path: resolve(ROOT, '.env') });

const HEADERS = ['Submitted At', 'Name', 'Email', 'Company', 'What to automate', 'Source'];
const SHARE_WITH = 'team@chronexa.io';

// ---------- 1. Google Sheet (OAuth — created under YOUR Google account) -------
async function setupSheet() {
  const oauth2 = new google.auth.OAuth2(process.env.GSC_CLIENT_ID, process.env.GSC_CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: oauth2 });
  const ss = await sheets.spreadsheets.create({
    requestBody: { properties: { title: 'Chronexa — Website Leads' }, sheets: [{ properties: { title: 'Leads' } }] },
  });
  const id = ss.data.spreadsheetId;
  await sheets.spreadsheets.values.update({
    spreadsheetId: id, range: 'Leads!A1', valueInputOption: 'RAW', requestBody: { values: [HEADERS] },
  });
  // The sheet is owned by your account (it's in your Drive). Save the id for the app.
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env.local');
  let env = ''; try { env = readFileSync(envPath, 'utf8'); } catch {}
  env = env.replace(/^GOOGLE_SHEET_ID=.*$/m, '').replace(/\n{3,}/g, '\n\n');
  writeFileSync(envPath, env.trimEnd() + `\nGOOGLE_SHEET_ID=${id}\n`);
  console.log(`✓ created Sheet under your Google account → website/.env.local GOOGLE_SHEET_ID written`);
  console.log(`  https://docs.google.com/spreadsheets/d/${id}`);
}

// ---------- 2. Baserow table ----------
async function setupBaserow() {
  const host = process.env.BASEROW_HOST || 'https://api.baserow.io';
  const dbId = process.env.BASEROW_DATABASE_ID;
  // JWT (table/field creation needs user login, not the DB token)
  const tok = await (await fetch(`${host}/api/user/token-auth/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.BASEROW_EMAIL, password: process.env.BASEROW_PASSWORD }),
  })).json();
  const jwt = tok.access_token || tok.token;
  if (!jwt) { console.log('✗ Baserow JWT failed:', JSON.stringify(tok).slice(0, 150)); return; }
  const H = { 'Content-Type': 'application/json', Authorization: `JWT ${jwt}` };

  const table = await (await fetch(`${host}/api/database/tables/database/${dbId}/`, {
    method: 'POST', headers: H, body: JSON.stringify({ name: 'Website Leads' }),
  })).json();
  if (!table.id) { console.log('✗ Baserow table create failed:', JSON.stringify(table).slice(0, 150)); return; }
  console.log(`✓ BASEROW_LEADS_TABLE_ID=${table.id}`);

  // The default table ships with Name/Notes/Active. Add the fields we need.
  for (const name of ['Email', 'Company', 'What to automate', 'Source', 'Submitted At']) {
    const f = await (await fetch(`${host}/api/database/fields/table/${table.id}/`, {
      method: 'POST', headers: H, body: JSON.stringify({ name, type: 'text' }),
    })).json();
    console.log(f.id ? `   + field "${name}"` : `   ! field "${name}" failed: ${JSON.stringify(f).slice(0, 80)}`);
  }
}

// ---------- Mint a fresh Baserow database token (the .env one is dead) ----------
async function mintBaserowToken() {
  const host = process.env.BASEROW_HOST || 'https://api.baserow.io';
  const ws = process.env.BASEROW_WORKSPACE_ID;
  const tok = await (await fetch(`${host}/api/user/token-auth/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.BASEROW_EMAIL, password: process.env.BASEROW_PASSWORD }),
  })).json();
  const jwt = tok.access_token || tok.token;
  if (!jwt) { console.log('✗ JWT failed:', JSON.stringify(tok).slice(0, 150)); return; }
  const H = { 'Content-Type': 'application/json', Authorization: `JWT ${jwt}` };
  const created = await (await fetch(`${host}/api/database/tokens/`, {
    method: 'POST', headers: H, body: JSON.stringify({ name: 'website-leads', workspace: Number(ws) }),
  })).json();
  if (!created.id) { console.log('✗ token create failed:', JSON.stringify(created).slice(0, 200)); return; }
  // grant create + read on the workspace's databases
  await fetch(`${host}/api/database/tokens/${created.id}/`, {
    method: 'PATCH', headers: H,
    body: JSON.stringify({ permissions: { create: true, read: true, update: true, delete: false } }),
  });
  // write straight into .env.local (gitignored) — never echo the secret
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env.local');
  let env = ''; try { env = readFileSync(envPath, 'utf8'); } catch {}
  env = env.replace(/^BASEROW_LEADS_TOKEN=.*$/m, '').replace(/\n{3,}/g, '\n\n');
  writeFileSync(envPath, env.trimEnd() + `\nBASEROW_LEADS_TOKEN=${created.key}\n`);
  console.log(`✓ minted Baserow token id=${created.id} (create+read+update) → written to website/.env.local`);
}

if (process.argv.includes('--token')) { await mintBaserowToken(); process.exit(0); }

// ---------- Clear test/default rows from the leads table (via JWT) ----------
if (process.argv.includes('--clean')) {
  const host = process.env.BASEROW_HOST || 'https://api.baserow.io';
  const tableId = process.env.BASEROW_LEADS_TABLE_ID || '1015183';
  const tok = await (await fetch(`${host}/api/user/token-auth/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.BASEROW_EMAIL, password: process.env.BASEROW_PASSWORD }) })).json();
  const jwt = tok.access_token || tok.token;
  const H = { Authorization: `JWT ${jwt}` };
  const rows = await (await fetch(`${host}/api/database/rows/table/${tableId}/?size=200`, { headers: H })).json();
  for (const r of rows.results || []) {
    await fetch(`${host}/api/database/rows/table/${tableId}/${r.id}/`, { method: 'DELETE', headers: H });
  }
  console.log(`✓ cleared ${(rows.results || []).length} row(s) from leads table`);
  process.exit(0);
}

const sheetOnly = process.argv.includes('--sheet-only');
console.log('— Google Sheet —');
try { await setupSheet(); } catch (e) {
  console.log('✗ Sheet setup error:', e.message);
  const errs = e?.response?.data?.error || e?.errors;
  if (errs) console.log('  detail:', JSON.stringify(errs).slice(0, 500));
}
if (!sheetOnly) {
  console.log('\n— Baserow —');
  try { await setupBaserow(); } catch (e) { console.log('✗ Baserow setup error:', e.message); }
}
