/**
 * Load the SEO strategy v2 (2026-07-25) keyword map into Baserow "Keyword Backlog" (table 1022496).
 *  - Adds missing v2 lifecycle/BOFU/UAE keywords (dedup against existing rows by normalized text).
 *  - Renumbers Priority on ALL queued rows into the v2 order: CPA cluster first,
 *    interleaved ~60/20/20 with agency-BOFU and UAE, then Wealth, Legal, tail.
 *  - Never touches rows with Status=used (they are history).
 *
 * Auth: BASEROW_BACKLOG_TOKEN (database token scoped to the backlog DB).
 * Run:  node scripts/load-keyword-backlog.js          (dry run — prints the plan)
 *       node scripts/load-keyword-backlog.js --apply  (writes)
 */
require('dotenv').config();
const axios = require('axios');

const TABLE = 1022496;
const BASE = `https://api.baserow.io/api/database/rows/table/${TABLE}`;
const H = { headers: { Authorization: `Token ${process.env.BASEROW_BACKLOG_TOKEN}`, 'Content-Type': 'application/json' } };
const APPLY = process.argv.includes('--apply');
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

// New v2 keywords (strategy v2 §4 lifecycle clusters + §5 BOFU + §2 UAE). Layer A = vertical money term, B = agency/category, C = decision-stage.
const NEW_ROWS = [
  { Keyword: 'CPA client onboarding automation',                          Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Onboard — biggest demand in cluster' },
  { Keyword: 'tax document collection automation for CPA firms',          Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Onboard — client document chaser' },
  { Keyword: 'engagement letter automation for CPA firms',                Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Onboard — post exists (cpa-engagement-letter-automation), refresh to method' },
  { Keyword: 'tax workpaper preparation automation',                      Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Serve — 252 impr in GSC already, pos 46' },
  { Keyword: 'UltraTax CS workflow automation',                           Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 tool spoke — GSC shows pos 3-6 flicker' },
  { Keyword: 'account reconciliation automation for accounting firms',    Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Serve' },
  { Keyword: '1099 data extraction automation',                           Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Serve — pairs with K-1 spoke' },
  { Keyword: 'practice management automation for accounting firms',       Layer: 'A', Vertical: 'cpa_tax',       Notes: 'v2 lifecycle: Retain — Karbon/Canopy/Firm360 angle' },
  { Keyword: 'RIA client onboarding automation',                          Layer: 'A', Vertical: 'wealth_ria',    Notes: 'v2 lifecycle: Onboard — Q4 cluster' },
  { Keyword: 'ACAT transfer paperwork automation',                        Layer: 'A', Vertical: 'wealth_ria',    Notes: 'v2 lifecycle: Onboard — NIGO/rejection pain, post exists to fold in' },
  { Keyword: 'custody statement reconciliation automation',               Layer: 'A', Vertical: 'wealth_ria',    Notes: 'v2 lifecycle: Serve' },
  { Keyword: 'KYC automation for wealth management',                      Layer: 'A', Vertical: 'wealth_ria',    Notes: 'v2 lifecycle: Onboard/compliance' },
  { Keyword: 'law firm time capture automation',                          Layer: 'A', Vertical: 'legal',         Notes: 'v2 lifecycle: Serve — revenue-leak angle, page exists' },
  { Keyword: 'how to choose an AI automation vendor for regulated industries', Layer: 'B', Vertical: 'category', Notes: 'v2 BOFU — comparison content we author (§5.2)' },
  { Keyword: 'AI automation agency pricing',                              Layer: 'B', Vertical: 'category',      Notes: 'v2 BOFU — 1,967 impr on existing pricing post, reframe target' },
  { Keyword: 'build vs buy AI for accounting firms',                      Layer: 'C', Vertical: 'cpa_tax',       Notes: 'v2 BOFU — consolidation survivor of duplicate build-vs-buy posts' },
  { Keyword: 'AI automation agency Dubai',                                Layer: 'B', Vertical: 'uae',           Notes: 'v2 geo 20-30%: page exists (ai-automation-agency-dubai), 271 impr pos 27' },
  { Keyword: 'corporate tax automation UAE',                              Layer: 'A', Vertical: 'uae',           Notes: 'v2 geo: FTA e-invoicing/corporate tax — localized, real regulator' },
  { Keyword: 'AI document processing UAE',                                Layer: 'A', Vertical: 'uae',           Notes: 'v2 geo: document intelligence localized (DIFC/ADGM firms)' },
];

// v2 priority order for the QUEUED backlog (P8+; P1-7 are used/history).
// ~60% CPA cluster : 20% BOFU/agency : 20% UAE interleaved, then Wealth, Legal, tail.
const PRIORITY_ORDER = [
  'CPA client onboarding automation',
  'tax document collection automation for CPA firms',
  'engagement letter automation for CPA firms',
  'AI automation company for CPA firms',
  'AI automation agency Dubai',
  'tax workpaper preparation automation',
  'K-1 tax form OCR extraction',
  'SafeSend automation for CPA firms',
  'is AI safe for client tax data',
  'corporate tax automation UAE',
  'Karbon workflow automation',
  'UltraTax CS workflow automation',
  'account reconciliation automation for accounting firms',
  'AI ROI for CPA firms',
  'AI document processing UAE',
  '1099 data extraction automation',
  'practice management automation for accounting firms',
  'Hubdoc QuickBooks reconciliation automation',
  'build vs buy AI for accounting firms',
  'how to choose an AI automation vendor for regulated industries',
  'tax software AI integration',
  'AI automation agency pricing',
  // Wealth/RIA block (next quarter, queued behind CPA)
  'RIA client onboarding automation',
  'ACAT transfer paperwork automation',
  'custody statement reconciliation automation',
  'Form ADV amendment automation',
  'KYC automation for wealth management',
  'Redtail CRM automation',
  'Wealthbox automation for RIAs',
  'AI meeting prep for financial advisors',
  'Orion reporting automation',
  'SEC marketing rule compliance automation',
  'AI in wealth management 2026',
  // Legal block
  'law firm time capture automation',
  'AI automation agency for law firms',
  'AI in legal industry 2026',
  'legal RAG vector database',
  // Flag-plant / PE / category tail
  'investment research automation',
  'AI for M&A due diligence',
  'portfolio company monitoring automation',
  'Affinity CRM workflow automation',
  'pitch deck parsing AI',
  'AI term sheet analysis',
  'AI automation agency for private equity',
  'AI automation services for financial services',
  'AI compliance requirements financial services',
  'enterprise AI automation consultant',
  'custom AI development for regulated industries',
  'cost of custom AI development',
  'AI document intelligence for enterprises',
  'secure AI deployment on premise',
  'AI agents for professional services firms',
];

(async () => {
  // 1) read existing
  let rows = [], next = `${BASE}/?user_field_names=true&size=200`;
  while (next) { const r = await axios.get(next, H); rows.push(...r.data.results); next = r.data.next; }
  const byNorm = new Map(rows.map(r => [norm(r.Keyword || ''), r]));
  console.log(`Existing rows: ${rows.length} (${rows.filter(r => r.Status === 'used').length} used)`);

  // 2) create missing
  const toCreate = NEW_ROWS.filter(n => !byNorm.has(norm(n.Keyword)))
    .map(n => ({ ...n, Status: 'queued', Priority: 999 }));
  console.log(`\nNew keywords to add: ${toCreate.length}`);
  toCreate.forEach(n => console.log(`  + [${n.Layer}/${n.Vertical}] ${n.Keyword}`));
  if (APPLY && toCreate.length) {
    const res = await axios.post(`${BASE}/batch/?user_field_names=true`, { items: toCreate }, H);
    res.data.items.forEach(r => byNorm.set(norm(r.Keyword), r));
    console.log(`  ✓ created ${res.data.items.length}`);
  }

  // 3) renumber queued priorities per v2 order
  const updates = [];
  PRIORITY_ORDER.forEach((kw, i) => {
    const row = byNorm.get(norm(kw));
    if (!row) { console.log(`  ! not found (skipped): ${kw}`); return; }
    if (row.Status === 'used') { console.log(`  ! already used (skipped): ${kw}`); return; }
    const want = 8 + i;
    if (row.Priority !== want) updates.push({ id: row.id, Priority: want });
  });
  console.log(`\nPriority updates needed: ${updates.length}`);
  if (APPLY && updates.length) {
    const res = await axios.patch(`${BASE}/batch/?user_field_names=true`, { items: updates }, H);
    console.log(`  ✓ updated ${res.data.items.length}`);
  }
  console.log(APPLY ? '\nDONE — backlog is on v2 order.' : '\nDRY RUN — re-run with --apply to write.');
})().catch(e => { console.error('ERR', e.response?.status, JSON.stringify(e.response?.data || e.message).slice(0, 500)); process.exit(1); });
