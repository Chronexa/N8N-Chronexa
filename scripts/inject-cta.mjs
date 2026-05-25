/**
 * Inject persona-aware booking CTAs into 46 blog posts that currently have none.
 * Reads live body, appends CTA HTML, updates via addItems merge (body field only).
 * Idempotent: skips posts already containing the booking URL.
 *
 * Run: node scripts/inject-cta.mjs
 * Preview: node scripts/inject-cta.mjs --dry-run
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
const BOOKING_URL  = "https://cal.com/chronexa/30min";
const F_BODY       = "fSfrbBQqV";

// Target item IDs from SEO audit (live posts only — drafted posts excluded)
const TARGETS = [
  { id: "d6Ie0tGAL", persona: ["cpa", "ria"] },
  { id: "munNLRiib", persona: ["ria"] },
  { id: "f2XZ_vwb2", persona: ["ria"] },
  { id: "sDggIB_VS", persona: ["general"] },
  { id: "hVXZg6M9J", persona: ["general"] },
  { id: "x1TF2gevq", persona: ["general"] },
  { id: "XNZZ8bn63", persona: ["general"] },
  { id: "gRpOWmp_3", persona: ["general"] },
  { id: "ziipQCdUF", persona: ["general"] },
  { id: "RZ3a46hmj", persona: ["general"] },
  { id: "z0WrtfaYR", persona: ["cpa", "saas"] },
  { id: "SCO7BwoJk", persona: ["general"] },
  // hV1blFlg_ = saas-crm-optimisation → DRAFTED, skip
  { id: "pyD_M1d7F", persona: ["legal"] },
  { id: "TQh0qSXA7", persona: ["general"] },
  { id: "Rf0Rssfrw", persona: ["fintech"] },
  { id: "eSz9vOSN1", persona: ["cpa", "legal", "saas"] },
  { id: "A3LWU4jM5", persona: ["saas", "sales-revops"] },
  { id: "AjnOmWBkB", persona: ["supply-chain"] },
  { id: "NmLNGC2MS", persona: ["sales-revops", "supply-chain"] },
  { id: "iP0pWh1Eh", persona: ["supply-chain"] },
  { id: "xjQLukIhp", persona: ["cx-support"] },
  { id: "BLUo4emXg", persona: ["cx-support"] },
  { id: "qVtwFabU0", persona: ["cx-support"] },
  // DRwFgEa4N = support-ai → DRAFTED, skip
  // vPd4q5YbV = saas-founders-reporting-automation-ai → DRAFTED, skip
  { id: "cvxc5zoal", persona: ["fintech", "saas", "sales-revops"] },
  { id: "nFssilqAG", persona: ["legal", "ria"] },
  { id: "a_jFpI7gJ", persona: ["agency"] },
  { id: "JQRkBXQlg", persona: ["agency", "cpa"] },
  { id: "cIjoiU3gD", persona: ["agency", "legal", "ria"] },
  { id: "kp7ftpkdB", persona: ["agency", "ria"] },
  { id: "lgtdFY0vY", persona: ["legal", "ria"] },
  { id: "TnBW3xpIR", persona: ["cpa", "saas"] },
  { id: "oMEiS4BZJ", persona: ["agency", "ria"] },
  { id: "feDj_ThYr", persona: ["ria"] },
  { id: "D6E5Wq84t", persona: ["supply-chain"] },
  { id: "gF0LEHzaB", persona: ["saas"] },
  { id: "Q59DfGhrX", persona: ["cpa", "legal"] },
  { id: "ZrhxylgOe", persona: ["cpa", "legal"] },
  { id: "Nqit3evpP", persona: ["ria"] },
  { id: "T0krS9nIr", persona: ["general"] },
  { id: "TAeqr0FWr", persona: ["cpa"] },
  { id: "LM8u6iAMK", persona: ["agency", "ria"] },
  { id: "H98tMMd0R", persona: ["saas"] },
  { id: "W3Y7vro1v", persona: ["cpa", "legal"] },
];

const CTA = {
  ria: {
    headline: "Ready to eliminate the manual work slowing down your advisory practice?",
    body: "Chronexa builds custom AI workflows for RIA and wealth management firms — from client onboarding and ADV filing to custody reconciliation and CRM hygiene. Most clients see 60–80% time savings in the first 90 days.",
  },
  cpa: {
    headline: "Want to cut the manual hours out of client reporting and tax season?",
    body: "Chronexa works with CPA and accounting firms to automate document intake, deadline tracking, and client communication workflows — without replacing your existing practice management stack.",
  },
  legal: {
    headline: "Ready to automate the compliance and billing workflows draining your firm?",
    body: "Chronexa builds AI automations for legal and professional services firms — from matter intake and document review to billing reconciliation and compliance reporting. Built on n8n, self-hosted if required.",
  },
  agency: {
    headline: "Want to stop doing manually what your agency should be automating?",
    body: "Chronexa helps agencies eliminate invoice reconciliation, client reporting, and ops bottlenecks with custom AI workflows built on n8n. Free yourself from the work that doesn't scale.",
  },
  saas: {
    headline: "Building B2B SaaS? Your RevOps stack shouldn't require a human to run.",
    body: "Chronexa helps SaaS founders automate CRM hygiene, onboarding sequences, churn signals, and sales ops workflows — so your revenue engine runs without the headcount.",
  },
  "cx-support": {
    headline: "Want to cut support costs without cutting the quality your customers expect?",
    body: "Chronexa builds agentic AI support workflows for B2B companies — triage, resolution, escalation, and CX reporting — that actually handle complex queries, not just FAQs.",
  },
  "supply-chain": {
    headline: "Want to automate the manual ops holding back your fulfilment and inventory workflows?",
    body: "Chronexa builds custom n8n automations for D2C and supply chain teams — from order routing and PO reconciliation to inventory sync across Shopify, Amazon, and Walmart.",
  },
  fintech: {
    headline: "Looking to automate compliance, KYC, or reconciliation workflows?",
    body: "Chronexa works with fintech and financial services companies to automate the repetitive, high-stakes workflows that consume your ops team — without the risk of a DIY build.",
  },
  "sales-revops": {
    headline: "Ready to stop letting manual RevOps work slow down your pipeline?",
    body: "Chronexa helps B2B sales teams automate lead routing, CRM hygiene, outbound sequencing, and reporting — so your reps focus on closing, not data entry.",
  },
  general: {
    headline: "Ready to see what AI automation could eliminate from your operations?",
    body: "Chronexa works with mid-market B2B companies to automate the workflows that consume your team's time. In 30 minutes, we can show you exactly what's possible for your specific situation.",
  },
};

const PRIORITY = ["ria", "cpa", "legal", "agency", "saas", "cx-support", "supply-chain", "fintech", "sales-revops", "general"];

function ctaHtml(personas) {
  const best = PRIORITY.find(p => personas.includes(p)) || "general";
  const { headline, body } = CTA[best];
  return [
    `<hr />`,
    `<div dir="auto">`,
    `<h3 dir="auto">${headline}</h3>`,
    `<p dir="auto">${body}</p>`,
    `<p dir="auto"><a href="${BOOKING_URL}">Book a Free 30-Minute Strategy Call →</a></p>`,
    `</div>`,
  ].join("\n");
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer = await connect(PROJECT_URL, TOKEN);
  const colls  = await framer.getCollections();
  const blog   = colls.find(c => c.id === BLOG_COLL_ID);
  const items  = await blog.getItems();

  const byId = Object.fromEntries(items.map(i => [i.id, i]));

  let updated = 0, skipped = 0, missing = 0;

  for (const { id, persona } of TARGETS) {
    const item = byId[id];
    if (!item) {
      console.log(`  ⚠ Not found: ${id}`);
      missing++;
      continue;
    }
    if (item.draft) {
      console.log(`  — Draft, skipping: ${item.slug}`);
      skipped++;
      continue;
    }
    const currentBody = item.fieldData[F_BODY]?.value ?? "";
    if (currentBody.includes(BOOKING_URL)) {
      console.log(`  ✓ Already has CTA: ${item.slug}`);
      skipped++;
      continue;
    }

    const newBody = currentBody + "\n" + ctaHtml(persona);

    if (DRY_RUN) {
      console.log(`  [DRY] Would inject CTA (${PRIORITY.find(p => persona.includes(p)) || "general"} persona): ${item.slug}`);
      updated++;
      continue;
    }

    await blog.addItems([{
      id:    item.id,
      slug:  item.slug,
      draft: item.draft,
      fieldData: {
        [F_BODY]: { type: "formattedText", value: newBody },
      },
    }]);
    console.log(`  ✓ CTA injected (${PRIORITY.find(p => persona.includes(p)) || "general"}): ${item.slug}`);
    updated++;
  }

  console.log(`\nSummary: ${updated} updated, ${skipped} skipped, ${missing} not found`);

  if (!DRY_RUN && updated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
