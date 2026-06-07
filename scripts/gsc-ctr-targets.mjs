/**
 * Rank CTR-optimization targets from GSC: pages with real impressions ranking
 * positions ~3-15 but low CTR (titles/metas not winning clicks). For each, show
 * the best query (by impressions) so titles/metas can be rewritten around it.
 * Read-only. Run: node scripts/gsc-ctr-targets.mjs
 */
import { google } from 'googleapis';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const oauth2 = new google.auth.OAuth2(process.env.GSC_CLIENT_ID, process.env.GSC_CLIENT_SECRET);
oauth2.setCredentials({ refresh_token: process.env.GSC_REFRESH_TOKEN });
const wm = google.webmasters({ version: 'v3', auth: oauth2 });
const d = (b) => new Date(Date.now() - b * 864e5).toISOString().slice(0, 10);

const r = await wm.searchanalytics.query({
  siteUrl: 'sc-domain:chronexa.io',
  requestBody: { startDate: d(120), endDate: d(1), dimensions: ['page', 'query'], rowLimit: 25000, dataState: 'all' },
});
const rows = r.data.rows || [];

const pages = new Map();
for (const row of rows) {
  const [page, query] = row.keys;
  if (!pages.has(page)) pages.set(page, { impr: 0, clicks: 0, posSum: 0, queries: [] });
  const p = pages.get(page);
  p.impr += row.impressions; p.clicks += row.clicks; p.posSum += row.position * row.impressions;
  p.queries.push({ query, impressions: row.impressions, clicks: row.clicks, position: row.position });
}

const targets = [];
for (const [page, p] of pages) {
  const avgPos = p.posSum / p.impr;
  const ctr = p.clicks / p.impr;
  // winnable: enough impressions, ranking on/near page 1, and under-clicking
  if (p.impr >= 200 && avgPos <= 15 && ctr < 0.03) {
    const topQ = p.queries.sort((a, b) => b.impressions - a.impressions)[0];
    targets.push({ page: page.replace(/^https?:\/\/[^/]+/, ''), impr: Math.round(p.impr), clicks: p.clicks, ctr: (ctr * 100).toFixed(1), avgPos: avgPos.toFixed(1), topQ: topQ.query, topQImpr: Math.round(topQ.impressions), topQPos: topQ.position.toFixed(1) });
  }
}
targets.sort((a, b) => b.impr - a.impr);

console.log(`${targets.length} CTR-optimization targets (impr≥200, pos≤15, CTR<3%), by impressions:\n`);
for (const t of targets.slice(0, 25)) {
  console.log(`${String(t.impr).padStart(6)} impr  ${t.ctr.padStart(4)}% CTR  pos ${t.avgPos.padStart(4)}  ${t.page}`);
  console.log(`        ↳ best query: "${t.topQ}" (${t.topQImpr} impr, pos ${t.topQPos})`);
}
