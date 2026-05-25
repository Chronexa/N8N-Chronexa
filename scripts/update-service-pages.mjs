/**
 * Update 7 service pages:
 * - Inject a booking CTA into Content Field Final (if missing)
 * - Add links to 2 relevant blog posts (if missing)
 *
 * Run: node scripts/update-service-pages.mjs
 * Preview: node scripts/update-service-pages.mjs --dry-run
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL  = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const SVC_COLL_ID  = "dyBK85CaG";
const TOKEN        = process.env.FRAMER_API_TOKEN;
const DRY_RUN      = process.argv.includes("--dry-run");
const BOOKING_URL  = "https://cal.com/chronexa/30min";

// Content Field Final — where CTA + related links live
const F_FINAL = "o0SJqU94o";

const SERVICES = [
  {
    id:    "M5BSgwTI8",
    title: "Supply Chain AI Solutions",
    cta: {
      headline: "Ready to eliminate the manual ops holding back your supply chain?",
      body:     "Chronexa builds custom AI workflows for D2C and supply chain teams — from order routing and PO reconciliation to inventory sync across Shopify, Amazon, and Walmart.",
    },
    blogs: [
      { slug: "ecommerce-order-operations-automation-dtc-founders-scale-fulfillment", label: "E-Commerce Order Operations Automation: How D2C Founders Scale Fulfilment" },
      { slug: "purchase-order-reconciliation-automation-reduce-cycle-time", label: "Purchase Order Reconciliation Automation: Reduce Cycle Time" },
    ],
  },
  {
    id:    "DE1DfAWuQ",
    title: "Document Processing & AI Research",
    cta: {
      headline: "Want to cut the manual hours out of document processing and compliance review?",
      body:     "Chronexa builds AI document pipelines for regulated industries — law firms, CPA practices, and financial services teams. Extraction, classification, and routing — all automated.",
    },
    blogs: [
      { slug: "document-automation-tools-for-regulated-industries", label: "Document Automation Tools for Regulated Industries: Compliance & Speed" },
      { slug: "audit-documentation-automation-cut-prep-time", label: "Audit Documentation Automation: Cut Prep Time by 60%" },
    ],
  },
  {
    id:    "ifoZP1KvC",
    title: "Sales & Revenue Operations",
    cta: {
      headline: "Want to stop letting manual RevOps work slow down your pipeline?",
      body:     "Chronexa helps B2B sales teams automate lead routing, CRM hygiene, outbound sequencing, and reporting — so your reps focus on closing, not data entry.",
    },
    blogs: [
      { slug: "saas-revenue-operations-automation-mrr-visibility", label: "Revenue Operations Automation for SaaS Founders: The MRR Visibility Playbook" },
      { slug: "automated-crm-data-hygiene-stale-opportunity-archival", label: "Automated CRM Data Hygiene & Stale Opportunity Archival" },
    ],
  },
  {
    id:    "GkwZ4JuSi", // slug renamed leagal → legal via Tier 1; use ID
    title: "Legal Document Processing",
    cta: {
      headline: "Ready to automate compliance reporting, document review, or billing workflows?",
      body:     "Chronexa builds AI automations for legal and professional services firms — from matter intake and document review to billing reconciliation and regulatory intelligence. Built on n8n, self-hosted if required.",
    },
    blogs: [
      { slug: "document-automation-tools-for-regulated-industries", label: "Document Automation Tools for Regulated Industries: Compliance & Speed" },
      { slug: "adv-form-automation-compliance-ria-workflows", label: "ADV Form Automation: Compliance Workflows for RIA Firms" },
    ],
  },
  {
    id:    "PAciBiIs3", // marketing-automation — already has CTA, add blog links only
    title: "Marketing Automation",
    cta:   null, // skip CTA injection
    blogs: [
      { slug: "how-b2b-saas-companies-reduce-sales-rep-crm-time-from-60-to-20", label: "How B2B SaaS Companies Reduce Sales Rep CRM Time from 60% to 20%" },
      { slug: "how-d2c-brands-capture-35-more-leads-with-multi-channel-form-automation", label: "How D2C Brands Capture 35% More Leads With Multi-Channel Form Automation" },
    ],
  },
  {
    id:    "e_M34T8Dw",
    title: "D2C & E-commerce Automation",
    cta: {
      headline: "Want to automate fulfilment, support, and retention without scaling your ops team?",
      body:     "Chronexa builds custom AI workflows for D2C brands — order routing, customer support triage, loyalty triggers, and inventory sync across every channel.",
    },
    blogs: [
      { slug: "ecommerce-order-operations-automation-dtc-founders-scale-fulfillment", label: "E-Commerce Order Operations Automation: How D2C Founders Scale Fulfilment" },
      { slug: "how-us-d2c-brands-cut-customer-service-response-time-from-8-hours-to-8-minutes", label: "How US D2C Brands Cut Customer Service Response Time from 8 Hours to 8 Minutes" },
    ],
  },
  {
    id:    "jsDFLXwf_",
    title: "Custom AI Workflows",
    cta: {
      headline: "Want a custom AI workflow built specifically for your business?",
      body:     "Chronexa designs and deploys production-grade AI automations on n8n — self-hosted, auditable, and built around your existing stack. No templates. No lock-in.",
    },
    blogs: [
      { slug: "n8n-ai-agents-features-2026-complete-guide", label: "N8N AI Agents Features 2026: The Complete Founder's Guide" },
      { slug: "ai-workflow-automation-agency-owners-complete-guide", label: "The Complete Guide to AI Workflow Automation for Agency Owners (2026)" },
    ],
  },
];

function buildFinalContent(svc, currentFinal) {
  const parts = [];

  // Blog links section (if not already present)
  const missingBlogs = svc.blogs.filter(b => !currentFinal.includes(b.slug));
  if (missingBlogs.length > 0) {
    const links = missingBlogs.map(b =>
      `<a href="/blog/${b.slug}">${b.label}</a>`
    ).join(" · ");
    parts.push(`<p dir="auto"><strong>Related resources:</strong> ${links}</p>`);
  }

  // CTA block (if no booking URL yet and cta defined)
  if (svc.cta && !currentFinal.includes(BOOKING_URL)) {
    parts.push(
      `<hr />`,
      `<div dir="auto">`,
      `<h3 dir="auto">${svc.cta.headline}</h3>`,
      `<p dir="auto">${svc.cta.body}</p>`,
      `<p dir="auto"><a href="${BOOKING_URL}">Book a Free 30-Minute Strategy Call →</a></p>`,
      `</div>`,
    );
  }

  return parts.join("\n");
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer  = await connect(PROJECT_URL, TOKEN);
  const svc     = (await framer.getCollections()).find(c => c.id === SVC_COLL_ID);
  const items   = await svc.getItems();
  const byId    = Object.fromEntries(items.map(i => [i.id, i]));

  let updated = 0;

  for (const page of SERVICES) {
    const item = byId[page.id];
    if (!item) { console.log(`⚠ Not found: ${page.id} (${page.title})`); continue; }

    const currentFinal = item.fieldData[F_FINAL]?.value ?? "";
    const addition = buildFinalContent(page, currentFinal);

    if (!addition) {
      console.log(`✓ Already complete: ${item.slug}`);
      continue;
    }

    const newFinal = currentFinal + (currentFinal ? "\n" : "") + addition;

    if (DRY_RUN) {
      console.log(`[DRY] Update: ${item.slug}  (+${addition.length} chars)`);
      updated++;
      continue;
    }

    await svc.addItems([{
      id:    item.id,
      slug:  item.slug,
      draft: item.draft,
      fieldData: { [F_FINAL]: { type: "formattedText", value: newFinal } },
    }]);
    console.log(`✓ Updated: ${item.slug}`);
    updated++;
  }

  console.log(`\nTotal: ${updated} service pages updated`);

  if (!DRY_RUN && updated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
