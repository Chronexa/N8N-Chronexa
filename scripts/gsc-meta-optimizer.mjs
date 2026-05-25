/**
 * GSC-informed meta description optimizer.
 * Uses the actual top search query per post to write meta descriptions
 * that match searcher intent exactly.
 *
 * Targets the top 30 posts by impressions (CTR <3%, imp ≥50).
 * Uses Claude Sonnet for the top 5 high-volume posts, Haiku for the rest.
 *
 * Run: node scripts/gsc-meta-optimizer.mjs
 * Preview: node scripts/gsc-meta-optimizer.mjs --dry-run
 */
import { connect } from "framer-api";
import { config as dotenvConfig } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL  = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLL_ID = "L8b3IANtH";
const TOKEN        = process.env.FRAMER_API_TOKEN;
const ANTHROPIC    = process.env.ANTHROPIC_API_KEY;
const DRY_RUN      = process.argv.includes("--dry-run");

const F_TITLE   = "eu1SUO8Ae";
const F_EXCERPT = "Ot6aVH0Gv";

// Load GSC data
const GSC = JSON.parse(readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "gsc-audit-data.json"), "utf8"
));

// Build slug → GSC data map
const gscBySlug = {};
for (const p of GSC.all_pages) {
  const slug = p.page.replace(/^https:\/\/chronexa\.io\/blog\//, "").replace(/\/$/, "");
  gscBySlug[slug] = p;
}

// Target slugs — ordered by impression volume (skip drafted ones)
const TARGETS = [
  "n8n-ai-agent-node-build-multi-agent-systems-in-2026",
  "top-ai-automation-agencies-b2b-saas-2026",
  "ai-in-2025-hype-reality-and-the-market-landscape",
  "ai-automation-agency-pricing-what-you-get",
  "fintech-automation-with-n8n-8-workflows-for-compliance-teams",
  "blog-best-ai-lead-scoring-platforms-b2b-saas",
  "n8n-voice-ai-elevenlabs-twilio-tutorial-2026",       // renamed from paren version
  "blog-ai-sdr-engine-automation-case-study",
  "n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams",
  "n8n-langchain-integration-complete-rag-workflow-tutorial",
  "top-n8n-automation-experts-india",
  "blog-best-n8n-consultants-by-region",
  "legal-tech-automation-12-n8n-workflows-for-law-firms",
  "secure-ai-workflow-automation-compliance-risks",
  "ai-document-processing-why-95-cost-reduction-requires-production-infrastructure",
  "manual-invoice-processing-cost-per-invoice-automation",
  "what-is-n8n-the-2026-guide-to-open-source-workflow-ai-automation",
  "manual-data-entry-cost-per-employee-how-to-stop",
  "top-15-n8n-use-cases-for-b2b-saas",                  // renamed from paren version
  "real-estate-leads-go-cold-5-minutes-instant-response",
  "property-management-automation-playbook-portfolio-owners",
  "reduce-claude-api-costs-n8n-batch-api",
  "n8n-for-agencies-packaging-pricing-and-selling-automation-retainers", // pos 3.8, 0 clicks!
  "reduce-kyc-processing-cost-ai-automation",
  "migrate-zapier-to-n8n-enterprise-ai",
  "reserve-study-automation-for-hoas-ai-powered-reserve-analysis-in-hours-not-weeks",
  "xai-funding-20b-series-e-signals-new-compute-era",
  "ai-insurance-claims-document-processing-guide",
];

const SYSTEM = `You are an SEO copywriter for Chronexa.io — an AI automation agency for mid-market B2B companies.

Write a meta description for a blog post. You are given the post title, the top search query people used to find it on Google, and its current meta description (may be empty).

Rules:
- 145–155 characters exactly (count every character including spaces)
- Put the primary keyword from the search query in the FIRST 60 characters
- Directly address the specific intent shown by the search query
- State a specific outcome or number where possible
- End with an action hook ("Here's how.", "See the breakdown.", "Read the guide.", etc.)
- No hype words (revolutionary, amazing, game-changing)
- Do NOT start with "Learn how to" or "Discover"
- Do NOT include quotation marks in the output
- Output ONLY the meta description — nothing else`;

async function callClaude(title, query, current, model = "claude-haiku-4-5-20251001") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Post title: "${title}"
Top search query: "${query}"
Current meta description: "${current || "(none)"}"

Write the new meta description:`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text.trim().replace(/^["']|["']$/g, "");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer = await connect(PROJECT_URL, TOKEN);
  const blog   = (await framer.getCollections()).find(c => c.id === BLOG_COLL_ID);
  const items  = await blog.getItems();
  const bySlug = Object.fromEntries(items.map(i => [i.slug, i]));

  let updated = 0, skipped = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const targetSlug = TARGETS[i];

    // Find item — try exact slug first, then partial match (for old-URL entries in GSC)
    const item = bySlug[targetSlug] || items.find(it => it.slug.startsWith(targetSlug.slice(0, 40)));
    if (!item) { console.log(`  ⚠ Not in Framer: ${targetSlug}`); skipped++; continue; }
    if (item.draft) { console.log(`  — Draft: ${item.slug}`); skipped++; continue; }

    // Find GSC data — try both the target slug and the item's actual (possibly renamed) slug
    const gsc = gscBySlug[targetSlug] || gscBySlug[item.slug];
    const topQuery = gsc?.top_queries?.[0]?.query || "";
    const impressions = gsc?.impressions || 0;

    const title   = item.fieldData[F_TITLE]?.value ?? item.slug;
    const current = item.fieldData[F_EXCERPT]?.value ?? "";

    // Use Sonnet for top 5 high-volume posts, Haiku for the rest
    const model = i < 5 ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001";

    console.log(`[${i + 1}/${TARGETS.length}] ${impressions.toLocaleString()} imp  "${title.slice(0, 50)}"`);
    if (topQuery) console.log(`  query: ${topQuery}`);
    console.log(`  current: ${current ? '"' + current.slice(0, 80) + '…"' : "(none)"}`);

    if (!topQuery && current && current.length >= 140) {
      console.log(`  → No query data + already has meta — skipping`);
      skipped++;
      await sleep(300);
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [DRY] Would generate meta (${model})\n`);
      updated++;
      continue;
    }

    let meta;
    try {
      meta = await callClaude(title, topQuery || title, current, model);
    } catch (e) {
      console.error(`  ⚠ Error: ${e.message}`);
      skipped++;
      continue;
    }

    // Trim if too long
    if (meta.length > 155) {
      meta = meta.slice(0, 152).replace(/\s+\S*$/, "") + "…";
    }
    if (meta.length < 100) {
      console.warn(`  ⚠ Too short (${meta.length}) — skipping`);
      skipped++;
      continue;
    }

    console.log(`  → "${meta}" (${meta.length} chars)`);

    await blog.addItems([{
      id:    item.id,
      slug:  item.slug,
      draft: item.draft,
      fieldData: { [F_EXCERPT]: { type: "string", value: meta } },
    }]);
    console.log(`  ✓ Updated\n`);
    updated++;

    await sleep(i < 5 ? 800 : 400);
  }

  console.log(`\nSummary: ${updated} updated, ${skipped} skipped`);

  if (!DRY_RUN && updated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
