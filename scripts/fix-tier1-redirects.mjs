/**
 * Add all Tier 1 redirects. Slug renames + drafts already applied by fix-tier1.mjs.
 * Parentheses and dots are percent-encoded so Framer accepts the paths.
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const TOKEN       = process.env.FRAMER_API_TOKEN;
const DRY_RUN     = process.argv.includes("--dry-run");

// Encode chars Framer rejects in redirect from-paths
function enc(slug) {
  return slug
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/'/g, "%27")
    .replace(/\.$/, "%2E");   // trailing dot only
}

const redirects = [
  // ── Exact duplicate
  { from: "/blog/saas-crm-optimisation",
    to:   "/blog/how-b2b-saas-companies-reduce-sales-rep-crm-time-from-60-to-20" },

  // ── Thin/stub posts
  { from: "/blog/saas-founders-reporting-automation-ai",
    to:   "/blog/saas-revenue-operations-automation-mrr-visibility" },
  { from: "/blog/support-ai",
    to:   "/blog/beyond-the-chatbot-the-rise-of-agentic-ai-in-customer-support" },

  // ── Service slug typo
  { from: "/services/leagal-automation",
    to:   "/services/legal-automation" },

  // ── Slug cleanups — old slug → new clean slug (already renamed in Framer)
  { from: enc("/blog/n8n-ai-agent-node-enterprise-architecture-guide-(2026)"),
    to:   "/blog/n8n-ai-agent-node-enterprise-architecture-guide-2026" },
  { from: enc("/blog/he-glass-box-agency-why-chronexa-is-built-on-n8n-(and-why-you-should-care)"),
    to:   "/blog/the-glass-box-agency-why-chronexa-is-built-on-n8n" },
  { from: enc("/blog/n8n-agency-launch-kit-client-acquisition-framework-(free)"),
    to:   "/blog/n8n-agency-launch-kit-client-acquisition-framework" },
  { from: enc("/blog/n8n-voice-ai-elevenlabs-twilio-tutorial-(2026)"),
    to:   "/blog/n8n-voice-ai-elevenlabs-twilio-tutorial-2026" },
  { from: enc("/blog/top-15-n8n-use-cases-for-b2b-saas-(with-ready-to-clone-workflows)"),
    to:   "/blog/top-15-n8n-use-cases-for-b2b-saas" },
  { from: enc("/blog/agency-vs.-automation-how-we-beat-an-8-person-team-with-n8n-(and-generated-180k-extra)"),
    to:   "/blog/agency-vs-automation-how-we-beat-an-8-person-team-with-n8n" },
  { from: enc("/blog/how-to-automate-soc-2-evidence-collection-(without-your-auditor-hating-you)"),
    to:   "/blog/how-to-automate-soc2-evidence-collection" },
  { from: enc("/blog/the-complete-guide-to-invoice-automation-(that-actually-works-with-messy-data)"),
    to:   "/blog/the-complete-guide-to-invoice-automation" },
  { from: enc("/blog/what-to-do-when-your-hoa-reserve-study-is-outdated-(and-how-to-update-it-fast)"),
    to:   "/blog/what-to-do-when-your-hoa-reserve-study-is-outdated" },
  { from: enc("/blog/why-scaling-lead-outreach-with-humans-is-financial-suicide-(and-how-ai-agents-are-changing-the-game)"),
    to:   "/blog/why-scaling-lead-outreach-with-humans-is-financial-suicide" },
  { from: "/blog/off-the-shelf-ai-vs.-custom-workflows-the-ria-build-vs.-buy-guide",
    to:   "/blog/off-the-shelf-ai-vs-custom-workflows-ria-build-vs-buy-guide" },
  { from: enc("/blog/you-re-not-understaffed.-you-re-under-automated."),
    to:   "/blog/youre-not-understaffed-youre-under-automated" },
  { from: "/blog/how-multi-channel-d2c-brands-eliminate-inventory-stockouts-across-shopify-amazon-and-walmart",
    to:   "/blog/d2c-eliminate-inventory-stockouts-shopify-amazon-walmart" },
  { from: "/blog/how-styleup-fashion-achieved-30-support-cost-reduction-20-faster-resolution-with-chronexa-s-ai-automation",
    to:   "/blog/styleup-fashion-ai-support-cost-reduction" },
  { from: "/blog/the-silent-profit-drain-unmasking-the-hidden-costs-of-traditional-customer-support",
    to:   "/blog/hidden-costs-traditional-customer-support" },
  { from: "/blog/the-death-of-the-billable-hour-how-agentic-workflows-are-driving-value-based-pricing-in-2026",
    to:   "/blog/billable-hour-death-agentic-workflows-value-based-pricing" },
  { from: "/blog/beyond-chatgpt-why-law-firms-are-migrating-to-private-self-hosted-ai-infrastructure-in-2026",
    to:   "/blog/law-firms-private-self-hosted-ai-infrastructure" },
  { from: "/blog/when-a-5m-trust-distribution-depends-on-finding-the-right-clause-in-the-right-pdf",
    to:   "/blog/trust-distribution-ai-clause-search-pdf" },
];

const payload = redirects.map(r => ({ ...r, expandToAllLocales: false }));

if (DRY_RUN) {
  console.log("DRY RUN — redirects that would be added:\n");
  payload.forEach(r => console.log(`  ${r.from}\n    → ${r.to}`));
  console.log(`\nTotal: ${payload.length}`);
  process.exit(0);
}

async function run() {
  const framer = await connect(PROJECT_URL, TOKEN);

  const BATCH = 10;
  let total = 0;

  for (let i = 0; i < payload.length; i += BATCH) {
    const batch = payload.slice(i, i + BATCH);
    try {
      const result = await framer.addRedirects(batch);
      total += result.length;
      console.log(`Batch ${Math.floor(i / BATCH) + 1}: +${result.length}`);
    } catch (e) {
      console.error(`Batch ${Math.floor(i / BATCH) + 1} FAILED: ${e.message}`);
      // Try one-by-one to isolate the bad entry
      for (const r of batch) {
        try {
          const res = await framer.addRedirects([r]);
          total += res.length;
          console.log(`  ✓ ${r.from}`);
        } catch (e2) {
          console.error(`  ✗ ${r.from}  →  ${e2.message}`);
        }
      }
    }
  }

  console.log(`\nTotal redirects added: ${total}`);
  console.log("Publishing...");
  await framer.publish();
  console.log("✓ Published.");
  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
