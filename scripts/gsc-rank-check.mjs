/**
 * Monthly GSC rank check for the active SEO-v2 cluster (currently CPA, Q3 2026).
 * Pulls last-28-day query positions for the target keywords + page stats for cluster URLs,
 * prints a table and appends a dated markdown report to seo/rank-tracking/.
 *
 * Run monthly: node scripts/gsc-rank-check.mjs
 * (Track keywords/pages below in sync with the Baserow Keyword Backlog, table 1022496.)
 */
import { google } from 'googleapis';
import { config as dotenvConfig } from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenvConfig({ path: resolve(ROOT, '.env') });

// --- the active tracking set (edit when the quarter's cluster changes) ---
const KEYWORDS = [
  'cpa client onboarding automation',
  'tax document collection automation',
  'engagement letter automation',
  'tax workpaper preparation automation',
  'automate tax workpaper preparation',
  'k-1 tax form ocr extraction',
  'safesend automation',
  'karbon workflow automation',
  'ultratax cs workflow automation',
  'ai automation company for cpa firms',
  'cpa automation',
  'tax document automation software',
  'ai automation agency dubai',
];
const PAGES = [
  '/cpa-tax-document-automation',
  '/blog/cpa-firm-client-onboarding-automation-3-days',
  '/blog/tax-document-collection-automation-cpa-firms',
  '/blog/tax-workpaper-preparation-automation',
  '/blog/ai-automation-company-for-cpa-firms',
  '/blog/safesend-automation-for-cpa-firms',
  '/blog/cch-axcess-safesend-karbon-ai-agent-n8n',
  '/blog/ultratax-cs-claude-n8n-tax-season-automation',
];

const oauth2 = new google.auth.OAuth2(process.env.GSC_CLIENT_ID, process.env.GSC_CLIENT_SECRET, 'http://localhost:3456');
oauth2.setCredentials({ refresh_token: process.env.GSC_REFRESH_TOKEN });
const sc = google.searchconsole({ version: 'v1', auth: oauth2 });
const SITE = 'sc-domain:chronexa.io';

const end = new Date();
const start = new Date();
start.setDate(end.getDate() - 28);
const [START, END] = [start, end].map(d => d.toISOString().slice(0, 10));

async function q(body) {
  const r = await sc.searchanalytics.query({ siteUrl: SITE, requestBody: { startDate: START, endDate: END, dataState: 'all', ...body } });
  return r.data.rows || [];
}

// Query-level: any query containing each target phrase's distinctive words
const allQueries = await q({ dimensions: ['query'], rowLimit: 5000 });
const kwRows = KEYWORDS.map(kw => {
  const matches = allQueries.filter(r => r.keys[0].includes(kw));
  if (!matches.length) {
    // relaxed: all significant words present
    const words = kw.split(' ').filter(w => w.length > 3);
    const loose = allQueries.filter(r => words.every(w => r.keys[0].includes(w)));
    if (!loose.length) return { kw, status: 'not ranking', impr: 0, pos: null };
    const impr = loose.reduce((s, r) => s + r.impressions, 0);
    const pos = loose.reduce((s, r) => s + r.position * r.impressions, 0) / impr;
    return { kw, status: `~${loose.length} related`, impr, pos: +pos.toFixed(1) };
  }
  const impr = matches.reduce((s, r) => s + r.impressions, 0);
  const clicks = matches.reduce((s, r) => s + r.clicks, 0);
  const pos = matches.reduce((s, r) => s + r.position * r.impressions, 0) / impr;
  return { kw, status: `${matches.length} queries`, impr, clicks, pos: +pos.toFixed(1) };
});

// Page-level
const allPages = await q({ dimensions: ['page'], rowLimit: 2000 });
const pgRows = PAGES.map(pg => {
  const row = allPages.find(r => r.keys[0] === `https://chronexa.io${pg}`);
  return row
    ? { pg, impr: row.impressions, clicks: row.clicks, pos: +row.position.toFixed(1) }
    : { pg, impr: 0, clicks: 0, pos: null };
});

// --- print + persist ---
const pad = (s, n) => String(s ?? '—').padEnd(n);
console.log(`\nGSC rank check — ${START} → ${END} (28d)\n`);
console.log(pad('KEYWORD', 46) + pad('POS', 7) + pad('IMPR', 7) + 'STATUS');
for (const r of kwRows) console.log(pad(r.kw, 46) + pad(r.pos, 7) + pad(r.impr, 7) + r.status);
console.log('\n' + pad('PAGE', 56) + pad('POS', 7) + pad('IMPR', 7) + 'CLICKS');
for (const r of pgRows) console.log(pad(r.pg, 56) + pad(r.pos, 7) + pad(r.impr, 7) + (r.clicks ?? 0));

const md = [
  `# GSC rank check — ${END}`,
  ``,
  `Window: ${START} → ${END} (28 days). Cluster: CPA (Q3 2026). Source: GSC Search Analytics API.`,
  ``,
  `## Target keywords`,
  `| Keyword | Avg pos | Impressions | Match |`,
  `|---|---:|---:|---|`,
  ...kwRows.map(r => `| ${r.kw} | ${r.pos ?? '—'} | ${r.impr} | ${r.status} |`),
  ``,
  `## Cluster pages`,
  `| Page | Avg pos | Impressions | Clicks |`,
  `|---|---:|---:|---:|`,
  ...pgRows.map(r => `| ${r.pg} | ${r.pos ?? '—'} | ${r.impr} | ${r.clicks ?? 0} |`),
  ``,
].join('\n');
mkdirSync(resolve(ROOT, 'seo/rank-tracking'), { recursive: true });
const out = resolve(ROOT, `seo/rank-tracking/${END}.md`);
writeFileSync(out, md);
console.log(`\n✓ report written: seo/rank-tracking/${END}.md`);
