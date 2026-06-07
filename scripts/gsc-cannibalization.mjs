/**
 * Pull Google Search Console query×page data and surface CANNIBALIZATION:
 * queries where 2+ of our own URLs both earn impressions (splitting signals).
 * Also prints a page→primary-query map. Read-only. Run: node scripts/gsc-cannibalization.mjs
 */
import { google } from 'googleapis';
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });
// The token owns the DOMAIN property (sc-domain:), not the URL-prefix form.
const SITE = 'sc-domain:chronexa.io';
const oauth2 = new google.auth.OAuth2(process.env.GSC_CLIENT_ID, process.env.GSC_CLIENT_SECRET);
oauth2.setCredentials({ refresh_token: process.env.GSC_REFRESH_TOKEN });
const webmasters = google.webmasters({ version: 'v3', auth: oauth2 });

const today = new Date();
const d = (back) => new Date(today.getTime() - back * 864e5).toISOString().slice(0, 10);

const res = await webmasters.searchanalytics.query({
  siteUrl: SITE,
  requestBody: {
    startDate: d(120),
    endDate: d(1),
    dimensions: ['query', 'page'],
    rowLimit: 25000,
    dataState: 'all',
  },
});
const rows = res.data.rows || [];
console.log(`Site: ${SITE}  |  ${rows.length} query×page rows (last ~120d)\n`);

// group by query
const byQuery = new Map();
for (const r of rows) {
  const [q, page] = r.keys;
  if (!byQuery.has(q)) byQuery.set(q, []);
  byQuery.get(q).push({ page, impressions: r.impressions, clicks: r.clicks, position: r.position });
}

// cannibalization = a query with 2+ pages each with >=10 impressions
const cannib = [];
for (const [q, pages] of byQuery) {
  const sig = pages.filter((p) => p.impressions >= 10);
  if (sig.length >= 2) {
    const totalImpr = sig.reduce((s, p) => s + p.impressions, 0);
    const totalClicks = sig.reduce((s, p) => s + p.clicks, 0);
    cannib.push({ q, totalImpr, totalClicks, pages: sig.sort((a, b) => b.impressions - a.impressions) });
  }
}
cannib.sort((a, b) => b.totalImpr - a.totalImpr);

console.log(`==== CANNIBALIZATION: ${cannib.length} queries with 2+ competing URLs ====\n`);
for (const c of cannib.slice(0, 30)) {
  console.log(`"${c.q}"  — ${c.totalImpr} impr, ${c.totalClicks} clicks across ${c.pages.length} URLs:`);
  for (const p of c.pages) {
    console.log(`    ${String(Math.round(p.impressions)).padStart(5)} impr  pos ${p.position.toFixed(1).padStart(5)}  ${p.page.replace(/^https?:\/\/[^/]+/, '')}`);
  }
}
console.log('\nDone.');
