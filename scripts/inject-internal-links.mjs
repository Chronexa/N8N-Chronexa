/**
 * Hub-and-spoke internal linking.
 * For each persona cluster, inject a "Further reading" link in the top-5 spoke posts
 * pointing to the cluster hub. Links are placed just before the CTA <hr /> separator.
 * Idempotent: skips posts that already contain the hub slug.
 *
 * Run: node scripts/inject-internal-links.mjs
 * Preview: node scripts/inject-internal-links.mjs --dry-run
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL  = "https://framer.com/projects/Chromexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const PROJECT_URL_FIXED = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLL_ID = "L8b3IANtH";
const TOKEN        = process.env.FRAMER_API_TOKEN;
const DRY_RUN      = process.argv.includes("--dry-run");
const F_BODY       = "fSfrbBQqV";

// Cluster definitions: hub slug, anchor text, and spoke item IDs (top 5 by word count, live)
// IDs pulled from live audit data — script verifies draft status at runtime.
const CLUSTERS = [
  {
    name: "RIA / Wealth Management",
    hub: { slug: "client-onboarding-automation-ria-custom-workflows", title: "Client Onboarding Automation: Why RIAs Need Custom Workflows" },
    anchor: "how leading RIAs are automating client onboarding end-to-end",
    spokes: ["nFssilqAG", "feDj_ThYr", "lgtdFY0vY", "f2XZ_vwb2", "munNLRiib"],
  },
  {
    name: "CPA / Accounting",
    hub: { slug: "cpa-firm-client-onboarding-automation-3-days", title: "CPA Firm Client Onboarding: Stop Chasing Documents and Go Live in 3 Days" },
    anchor: "how CPA firms are cutting onboarding time to 3 days with automation",
    spokes: ["kEU4JaUbb", "uROWykGih", "W3Y7vro1v", "VyREIUqTQ", "TnBW3xpIR"],
  },
  {
    name: "Legal / Compliance",
    hub: { slug: "document-automation-tools-for-regulated-industries", title: "Document Automation Tools for Regulated Industries" },
    anchor: "the right document automation stack for regulated industries",
    spokes: ["nFssilqAG", "eSz9vOSN1", "lgtdFY0vY", "pyD_M1d7F", "Q59DfGhrX"],
    // Note: Q59DfGhrX IS the hub — will be skipped at runtime
  },
  {
    name: "SaaS / RevOps",
    hub: { slug: "saas-revenue-operations-automation-mrr-visibility", title: "Revenue Operations Automation for SaaS Founders: The MRR Visibility Playbook" },
    anchor: "how SaaS founders are automating RevOps for full MRR visibility",
    spokes: ["qrtcywVgt", "OrTIDa8EN", "bPqmnWozx", "vAV1101IW", "OsflskW8g"],
  },
  {
    name: "Agency Owners",
    hub: { slug: "ai-workflow-automation-agency-owners-complete-guide", title: "The Complete Guide to AI Workflow Automation for Agency Owners (2026)" },
    anchor: "the complete guide to AI workflow automation for agencies",
    spokes: ["tmUoq7zEY", "a_jFpI7gJ", "JQRkBXQlg", "cIjoiU3gD", "LM8u6iAMK"],
  },
  {
    name: "Supply Chain / D2C",
    hub: { slug: "ecommerce-order-operations-automation-dtc-founders-scale-fulfillment", title: "E-Commerce Order Operations Automation: How D2C Founders Scale Fulfillment" },
    anchor: "how D2C founders scale fulfilment without scaling headcount",
    spokes: ["iP0pWh1Eh", "D6E5Wq84t", "vKAL_pn6b", "AjnOmWBkB", "NmLNGC2MS"],
  },
  {
    name: "CX / Customer Support",
    hub: { slug: "how-us-d2c-brands-cut-customer-service-response-time-from-8-hours-to-8-minutes", title: "How US D2C Brands Cut Customer Service Response Time from 8 Hours to 8 Minutes" },
    anchor: "how leading brands cut support response time from 8 hours to 8 minutes",
    spokes: ["d1E2QbNeU", "qVtwFabU0", "xjQLukIhp", "BLUo4emXg", "cvxc5zoal"],
  },
];

function relatedHtml(hub, anchor) {
  return `<p dir="auto"><strong>Further reading:</strong> See ${anchor} — <a href="/blog/${hub.slug}">${hub.title}</a></p>`;
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer = await connect(PROJECT_URL_FIXED, TOKEN);
  const blog   = (await framer.getCollections()).find(c => c.id === BLOG_COLL_ID);
  const items  = await blog.getItems();
  const byId   = Object.fromEntries(items.map(i => [i.id, i]));

  let totalUpdated = 0;

  for (const cluster of CLUSTERS) {
    console.log(`\n── ${cluster.name} ──`);
    let clusterUpdated = 0;

    for (const spokeId of cluster.spokes) {
      const item = byId[spokeId];
      if (!item) { console.log(`  ⚠ Not found: ${spokeId}`); continue; }
      if (item.draft) { console.log(`  — Draft: ${item.slug}`); continue; }
      if (item.slug === cluster.hub.slug) { console.log(`  — Hub itself, skip: ${item.slug}`); continue; }

      const body = item.fieldData[F_BODY]?.value ?? "";
      if (body.includes(cluster.hub.slug)) {
        console.log(`  ✓ Already links: ${item.slug}`);
        continue;
      }

      const linkHtml = relatedHtml(cluster.hub, cluster.anchor);

      // Insert before the CTA <hr /> separator if present, else append
      let newBody;
      const hrIdx = body.indexOf("<hr />");
      if (hrIdx !== -1) {
        newBody = body.slice(0, hrIdx) + linkHtml + "\n" + body.slice(hrIdx);
      } else {
        newBody = body + "\n" + linkHtml;
      }

      if (DRY_RUN) {
        console.log(`  [DRY] Would link → hub: ${item.slug}`);
        clusterUpdated++;
        continue;
      }

      await blog.addItems([{
        id:    item.id,
        slug:  item.slug,
        draft: item.draft,
        fieldData: { [F_BODY]: { type: "formattedText", value: newBody } },
      }]);
      console.log(`  ✓ Linked: ${item.slug}`);
      clusterUpdated++;
    }

    console.log(`  → ${clusterUpdated} updated in ${cluster.name}`);
    totalUpdated += clusterUpdated;
  }

  console.log(`\nTotal: ${totalUpdated} posts updated`);

  if (!DRY_RUN && totalUpdated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
