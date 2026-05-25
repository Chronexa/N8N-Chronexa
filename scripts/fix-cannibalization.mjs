/**
 * Consolidate 8 topic cannibalization clusters.
 * For each cluster: add 301 redirect from weak → canonical, then set weak to draft.
 *
 * Run: node scripts/fix-cannibalization.mjs
 * Preview: node scripts/fix-cannibalization.mjs --dry-run
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL  = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLL_ID = "L8b3IANtH";
const TOKEN        = process.env.FRAMER_API_TOKEN;
const DRY_RUN      = process.argv.includes("--dry-run");

// Each entry: weakId → canonicalSlug (the slug currently live on canonical post)
// Weak post will be set to draft; redirect added from its current slug → canonical.
const CLUSTERS = [
  // ── n8n AI Agent Features (3 near-duplicates, keep complete-guide)
  { weakId: "fzvShXhGJ", canonicalSlug: "n8n-ai-agents-features-2026-complete-guide", cluster: "n8n AI Agent Features" },
  { weakId: "gF0LEHzaB", canonicalSlug: "n8n-ai-agents-features-2026-complete-guide", cluster: "n8n AI Agent Features" },
  // ── n8n Architecture (keep build-multi-agent, redirect short enterprise guide)
  { weakId: "m0lrmIbAv", canonicalSlug: "n8n-ai-agent-node-build-multi-agent-systems-in-2026", cluster: "n8n Architecture" },
  // ── Document Automation Regulated Industries (keep broadest; redirect CPA-specific near-dupe + guide)
  { weakId: "ZrhxylgOe", canonicalSlug: "document-automation-tools-for-regulated-industries", cluster: "Document Automation" },
  { weakId: "zvqpTgQe9", canonicalSlug: "document-automation-tools-for-regulated-industries", cluster: "Document Automation" },
  // ── n8n vs Zapier (keep real cost analysis; redirect two thinner comparisons)
  { weakId: "cDFX1YLqS", canonicalSlug: "n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis", cluster: "n8n vs Zapier" },
  { weakId: "de8wejkwA", canonicalSlug: "n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis", cluster: "n8n vs Zapier" },
  // ── RIA Onboarding (keep custom-workflows as canonical at 2511w; redirect 3 weaker versions)
  { weakId: "jVlf2ANY_", canonicalSlug: "client-onboarding-automation-ria-custom-workflows", cluster: "RIA Onboarding" },
  { weakId: "kp7ftpkdB", canonicalSlug: "client-onboarding-automation-ria-custom-workflows", cluster: "RIA Onboarding" },
  { weakId: "oMEiS4BZJ", canonicalSlug: "client-onboarding-automation-ria-custom-workflows", cluster: "RIA Onboarding" },
  // ── PO Reconciliation (keep reduce-cycle-time at 2124w; redirect audit-prep at 2013w)
  { weakId: "uPokthcbC", canonicalSlug: "purchase-order-reconciliation-automation-reduce-cycle-time", cluster: "PO Reconciliation" },
  // ── Self-hosting n8n (keep original at 1419w; redirect cost-breakdown at 1046w)
  { weakId: "KXLTsE53A", canonicalSlug: "self-hosting-n8n-architecture-security-and-cost", cluster: "Self-hosting n8n" },
  // ── UAE Wealth Manager AI Platforms (keep wealth-management-uae; redirect two near-dupes)
  { weakId: "Nqit3evpP", canonicalSlug: "best-ai-agent-platforms-wealth-management-uae", cluster: "UAE Wealth Managers" },
  { weakId: "SoGIGoQlE", canonicalSlug: "best-ai-agent-platforms-wealth-management-uae", cluster: "UAE Wealth Managers" },
];

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer = await connect(PROJECT_URL, TOKEN);
  const blog   = (await framer.getCollections()).find(c => c.id === BLOG_COLL_ID);
  const items  = await blog.getItems();
  const byId   = Object.fromEntries(items.map(i => [i.id, i]));

  const redirectsToAdd  = [];
  const itemsToDraft    = [];

  for (const { weakId, canonicalSlug, cluster } of CLUSTERS) {
    const weak = byId[weakId];
    if (!weak) {
      console.log(`  ⚠ Not found: ${weakId}  (${cluster})`);
      continue;
    }
    if (weak.draft) {
      console.log(`  — Already draft: ${weak.slug}  (${cluster})`);
      continue;
    }
    console.log(`  [${cluster}]  /blog/${weak.slug}  →  /blog/${canonicalSlug}`);
    redirectsToAdd.push({ from: `/blog/${weak.slug}`, to: `/blog/${canonicalSlug}`, expandToAllLocales: false });
    itemsToDraft.push({ item: weak, cluster });
  }

  console.log(`\nSummary: ${redirectsToAdd.length} redirects, ${itemsToDraft.length} drafts`);

  if (DRY_RUN) {
    await framer.disconnect();
    return;
  }

  // 1. Add redirects first (so old URL resolves before we draft it)
  console.log("\nAdding redirects...");
  const BATCH = 10;
  for (let i = 0; i < redirectsToAdd.length; i += BATCH) {
    const batch = redirectsToAdd.slice(i, i + BATCH);
    try {
      const res = await framer.addRedirects(batch);
      console.log(`  Batch ${Math.floor(i / BATCH) + 1}: +${res.length}`);
    } catch (e) {
      // Try one-by-one on batch failure
      for (const r of batch) {
        try {
          await framer.addRedirects([r]);
          console.log(`  ✓ ${r.from}`);
        } catch (e2) {
          console.error(`  ✗ ${r.from}: ${e2.message}`);
        }
      }
    }
  }

  // 2. Set weak posts to draft
  console.log("\nSetting to draft...");
  for (const { item, cluster } of itemsToDraft) {
    await blog.addItems([{ id: item.id, slug: item.slug, draft: true, fieldData: {} }]);
    console.log(`  ✓ Drafted: ${item.slug}  (${cluster})`);
  }

  // 3. Publish
  console.log("\nPublishing...");
  await framer.publish();
  console.log("✓ Published.");

  await framer.disconnect();
  console.log("\n✓ Cannibalization consolidation complete.");
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
