/**
 * Pull 90-day GSC data for chronexa.io.
 * Outputs: scripts/gsc-audit-data.json
 *   - Per-page: impressions, clicks, CTR, avg position
 *   - Per-page: top 5 queries
 *   - Summary stats
 *
 * Run: node scripts/gsc-site-audit.mjs
 */
import { google } from "googleapis";
import { config as dotenvConfig } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const CLIENT_ID     = process.env.GSC_CLIENT_ID;
const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN;
const SITE_URL      = "sc-domain:chronexa.io";  // domain property

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3456");
oauth2.setCredentials({ refresh_token: REFRESH_TOKEN });

const sc = google.searchconsole({ version: "v1", auth: oauth2 });

// Last 90 days
const endDate   = new Date();
const startDate = new Date();
startDate.setDate(endDate.getDate() - 90);
const START = startDate.toISOString().slice(0, 10);
const END   = endDate.toISOString().slice(0, 10);

async function fetchAllPages() {
  const rows = [];
  let startRow = 0;
  const rowLimit = 1000;

  while (true) {
    const res = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: START,
        endDate:   END,
        dimensions: ["page"],
        rowLimit,
        startRow,
      },
    });
    const batch = res.data.rows || [];
    rows.push(...batch);
    if (batch.length < rowLimit) break;
    startRow += rowLimit;
  }
  return rows;
}

async function fetchTopQueriesForPage(page, topN = 5) {
  try {
    const res = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: START,
        endDate:   END,
        dimensions: ["query", "page"],
        dimensionFilterGroups: [{
          filters: [{ dimension: "page", operator: "equals", expression: page }],
        }],
        rowLimit: topN,
      },
    });
    return (res.data.rows || []).map(r => ({
      query:       r.keys[0],
      clicks:      r.clicks,
      impressions: r.impressions,
      ctr:         +(r.ctr * 100).toFixed(2),
      position:    +r.position.toFixed(1),
    }));
  } catch {
    return [];
  }
}

async function run() {
  console.log(`Fetching GSC data: ${START} → ${END}\n`);

  // Step 1: All pages
  console.log("Pulling all-pages performance...");
  const pageRows = await fetchAllPages();
  console.log(`  ${pageRows.length} pages found\n`);

  // Step 2: Sort by impressions, take top 80 for query enrichment
  pageRows.sort((a, b) => b.impressions - a.impressions);
  const enrichTop = pageRows.slice(0, 80);

  console.log("Fetching top queries for top 80 pages...");
  const enriched = [];
  for (let i = 0; i < enrichTop.length; i++) {
    const row = enrichTop[i];
    const page = row.keys[0];
    const queries = await fetchTopQueriesForPage(page);
    enriched.push({
      page,
      clicks:      row.clicks,
      impressions: row.impressions,
      ctr:         +(row.ctr * 100).toFixed(2),
      position:    +row.position.toFixed(1),
      top_queries: queries,
      // CTR opportunity: high impressions + low CTR = priority for meta fix
      ctr_opportunity: row.impressions > 50 && row.ctr < 0.03,
    });
    if ((i + 1) % 10 === 0) process.stdout.write(`  ${i + 1}/${enrichTop.length}...\n`);
  }

  // Step 3: Remaining pages (no query enrichment)
  const rest = pageRows.slice(80).map(row => ({
    page:        row.keys[0],
    clicks:      row.clicks,
    impressions: row.impressions,
    ctr:         +(row.ctr * 100).toFixed(2),
    position:    +row.position.toFixed(1),
    top_queries: [],
    ctr_opportunity: row.impressions > 50 && row.ctr < 0.03,
  }));

  const allPages = [...enriched, ...rest];

  // Step 4: Summary stats
  const blogPages  = allPages.filter(p => p.page.includes("/blog/"));
  const ctrOpps    = allPages.filter(p => p.ctr_opportunity);
  const pos4to10   = allPages.filter(p => p.position >= 4 && p.position <= 10 && p.impressions > 20);
  const pos11to20  = allPages.filter(p => p.position > 10 && p.position <= 20 && p.impressions > 20);
  const totalClicks      = allPages.reduce((s, p) => s + p.clicks, 0);
  const totalImpressions = allPages.reduce((s, p) => s + p.impressions, 0);

  const summary = {
    period: `${START} to ${END}`,
    total_pages_with_data: allPages.length,
    total_clicks:          totalClicks,
    total_impressions:     totalImpressions,
    avg_ctr:               +((totalClicks / totalImpressions) * 100).toFixed(2),
    blog_pages:            blogPages.length,
    ctr_opportunity_pages: ctrOpps.length,
    positions_4_to_10:     pos4to10.length,
    positions_11_to_20:    pos11to20.length,
  };

  const output = {
    generated_at: new Date().toISOString(),
    summary,
    // Quick-win lists
    ctr_opportunities: ctrOpps
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 30)
      .map(p => ({ page: p.page, impressions: p.impressions, ctr: p.ctr, position: p.position, top_queries: p.top_queries })),
    positions_4_to_10: pos4to10
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 30),
    positions_11_to_20: pos11to20
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 30),
    all_pages: allPages,
  };

  const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "gsc-audit-data.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log("\n=== GSC SUMMARY ===");
  console.log(`Period:              ${summary.period}`);
  console.log(`Pages with data:     ${summary.total_pages_with_data}`);
  console.log(`Total clicks:        ${summary.total_clicks.toLocaleString()}`);
  console.log(`Total impressions:   ${summary.total_impressions.toLocaleString()}`);
  console.log(`Avg CTR:             ${summary.avg_ctr}%`);
  console.log(`CTR opportunities:   ${summary.ctr_opportunity_pages} pages (imp ≥50, CTR <3%)`);
  console.log(`Positions 4–10:      ${summary.positions_4_to_10} pages`);
  console.log(`Positions 11–20:     ${summary.positions_11_to_20} pages`);
  console.log(`\nOutput: scripts/gsc-audit-data.json`);
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
