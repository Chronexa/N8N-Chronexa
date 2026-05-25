/**
 * Tier 1 fixes — exact duplicate, thin posts, service page typo, slug cleanup.
 * Each section is clearly labelled and independently safe to re-run.
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL    = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const TOKEN          = process.env.FRAMER_API_TOKEN;
const BLOG_COLL_ID   = "L8b3IANtH";
const SVC_COLL_ID    = "dyBK85CaG";
const DRY_RUN        = process.argv.includes("--dry-run");

function log(msg)  { console.log("  " + msg); }
function section(t){ console.log("\n── " + t + " " + "─".repeat(55 - t.length)); }

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);
  const framer = await connect(PROJECT_URL, TOKEN);
  const colls  = await framer.getCollections();
  const blog   = colls.find(c => c.id === BLOG_COLL_ID);
  const svc    = colls.find(c => c.id === SVC_COLL_ID);
  const posts  = await blog.getItems();
  const svcItems = await svc.getItems();

  const redirectsToAdd = [];
  const itemsToSetDraft = []; // { coll, item }
  const slugRenames = [];     // { coll, item, newSlug }

  // ── 1. EXACT DUPLICATE: CRM post ──────────────────────────────────────────
  section("1. CRM exact duplicate");
  // Two posts with identical titles — different slugs:
  //   /blog/saas-crm-optimisation          (1,004 words — weaker slug, shorter)
  //   /blog/how-b2b-saas-companies-...     (2,009 words — canonical)
  const weakCrm = posts.find(p => p.slug === "saas-crm-optimisation");
  const keepCrm = posts.find(p => p.slug === "how-b2b-saas-companies-reduce-sales-rep-crm-time-from-60-to-20");
  if (weakCrm && keepCrm) {
    log(`Weak:  /blog/${weakCrm.slug}  (${weakCrm.id})`);
    log(`Canon: /blog/${keepCrm.slug}`);
    redirectsToAdd.push({ from: `/blog/${weakCrm.slug}`, to: `/blog/${keepCrm.slug}`, expandToAllLocales: false });
    itemsToSetDraft.push({ coll: blog, item: weakCrm, reason: "Exact duplicate title — weaker slug" });
  } else {
    log(`⚠ Posts not found (may already be fixed)`);
  }

  // ── 2. THIN / STUB POSTS ───────────────────────────────────────────────────
  section("2. Thin/stub posts");
  const thinMap = [
    // 79-word stub → redirect to nearest revenue ops post
    { slug: "saas-founders-reporting-automation-ai",
      to:   "/blog/saas-revenue-operations-automation-mrr-visibility",
      reason: "79 words — stub" },
    // 336-word stub → redirect to better customer support post
    { slug: "support-ai",
      to:   "/blog/beyond-the-chatbot-the-rise-of-agentic-ai-in-customer-support",
      reason: "336 words — stub" },
  ];
  for (const { slug, to, reason } of thinMap) {
    const item = posts.find(p => p.slug === slug);
    if (item) {
      log(`${slug}  → ${to}  (${reason})`);
      redirectsToAdd.push({ from: `/blog/${slug}`, to, expandToAllLocales: false });
      itemsToSetDraft.push({ coll: blog, item, reason });
    } else {
      log(`⚠ Not found: ${slug}`);
    }
  }

  // ── 3. SERVICE PAGE SLUG TYPO ─────────────────────────────────────────────
  section("3. Service page slug typo: leagal → legal");
  const leagal = svcItems.find(p => p.slug === "leagal-automation");
  if (leagal) {
    log(`Found: /services/${leagal.slug}  (id: ${leagal.id})`);
    redirectsToAdd.push({ from: "/services/leagal-automation", to: "/services/legal-automation", expandToAllLocales: false });
    slugRenames.push({ coll: svc, item: leagal, newSlug: "legal-automation", reason: "Typo in slug" });
  } else {
    log(`⚠ Not found (may already be fixed)`);
  }

  // ── 4. SLUG CLEANUP: dots, parentheses, "he-glass-box" typo ───────────────
  section("4. Slug cleanup — parentheses, dots, missing T");
  const slugFixes = [
    // Parentheses in slugs — clean them
    { old: "n8n-ai-agent-node-enterprise-architecture-guide-(2026)",           newSlug: "n8n-ai-agent-node-enterprise-architecture-guide-2026" },
    { old: "he-glass-box-agency-why-chronexa-is-built-on-n8n-(and-why-you-should-care)", newSlug: "the-glass-box-agency-why-chronexa-is-built-on-n8n" },
    { old: "n8n-agency-launch-kit-client-acquisition-framework-(free)",        newSlug: "n8n-agency-launch-kit-client-acquisition-framework" },
    { old: "n8n-voice-ai-elevenlabs-twilio-tutorial-(2026)",                   newSlug: "n8n-voice-ai-elevenlabs-twilio-tutorial-2026" },
    { old: "top-15-n8n-use-cases-for-b2b-saas-(with-ready-to-clone-workflows)",newSlug: "top-15-n8n-use-cases-for-b2b-saas" },
    { old: "agency-vs.-automation-how-we-beat-an-8-person-team-with-n8n-(and-generated-180k-extra)", newSlug: "agency-vs-automation-how-we-beat-an-8-person-team-with-n8n" },
    { old: "how-to-automate-soc-2-evidence-collection-(without-your-auditor-hating-you)", newSlug: "how-to-automate-soc2-evidence-collection" },
    { old: "the-complete-guide-to-invoice-automation-(that-actually-works-with-messy-data)", newSlug: "the-complete-guide-to-invoice-automation" },
    { old: "what-to-do-when-your-hoa-reserve-study-is-outdated-(and-how-to-update-it-fast)", newSlug: "what-to-do-when-your-hoa-reserve-study-is-outdated" },
    { old: "why-scaling-lead-outreach-with-humans-is-financial-suicide-(and-how-ai-agents-are-changing-the-game)", newSlug: "why-scaling-lead-outreach-with-humans-is-financial-suicide" },
    // Dots in slugs
    { old: "off-the-shelf-ai-vs.-custom-workflows-the-ria-build-vs.-buy-guide", newSlug: "off-the-shelf-ai-vs-custom-workflows-ria-build-vs-buy-guide" },
    { old: "you-re-not-understaffed.-you-re-under-automated.",                  newSlug: "youre-not-understaffed-youre-under-automated" },
    // Excessive length — trim to keyword core
    { old: "how-multi-channel-d2c-brands-eliminate-inventory-stockouts-across-shopify-amazon-and-walmart", newSlug: "d2c-eliminate-inventory-stockouts-shopify-amazon-walmart" },
    { old: "how-styleup-fashion-achieved-30-support-cost-reduction-20-faster-resolution-with-chronexa-s-ai-automation", newSlug: "styleup-fashion-ai-support-cost-reduction" },
    { old: "the-silent-profit-drain-unmasking-the-hidden-costs-of-traditional-customer-support", newSlug: "hidden-costs-traditional-customer-support" },
    { old: "the-death-of-the-billable-hour-how-agentic-workflows-are-driving-value-based-pricing-in-2026", newSlug: "billable-hour-death-agentic-workflows-value-based-pricing" },
    { old: "beyond-chatgpt-why-law-firms-are-migrating-to-private-self-hosted-ai-infrastructure-in-2026", newSlug: "law-firms-private-self-hosted-ai-infrastructure" },
    { old: "when-a-5m-trust-distribution-depends-on-finding-the-right-clause-in-the-right-pdf", newSlug: "trust-distribution-ai-clause-search-pdf" },
  ];

  for (const { old: oldSlug, newSlug } of slugFixes) {
    const item = posts.find(p => p.slug === oldSlug);
    if (item) {
      log(`${oldSlug.slice(0, 60)}\n     → ${newSlug}`);
      redirectsToAdd.push({ from: `/blog/${oldSlug}`, to: `/blog/${newSlug}`, expandToAllLocales: false });
      slugRenames.push({ coll: blog, item, newSlug, reason: "Slug cleanup" });
    } else {
      log(`⚠ Not found: ${oldSlug.slice(0, 60)}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Redirects to add:    ${redirectsToAdd.length}`);
  console.log(`  Items to draft:      ${itemsToSetDraft.length}`);
  console.log(`  Slug renames:        ${slugRenames.length}`);

  if (DRY_RUN) { await framer.disconnect(); return; }

  // ── Apply slug renames first (old URL 404s → redirect catches it) ──────────
  section("Applying slug renames");
  for (const { coll, item, newSlug } of slugRenames) {
    await coll.addItems([{ id: item.id, slug: newSlug, draft: item.draft, fieldData: {} }]);
    log(`✓ Renamed: ${item.slug} → ${newSlug}`);
  }

  // ── Set duplicate/thin posts to draft ─────────────────────────────────────
  section("Setting duplicate/thin posts to draft");
  for (const { coll, item, reason } of itemsToSetDraft) {
    await coll.addItems([{ id: item.id, slug: item.slug, draft: true, fieldData: {} }]);
    log(`✓ Drafted: ${item.slug}  (${reason})`);
  }

  // ── Add all redirects ──────────────────────────────────────────────────────
  section("Adding redirects");
  // Add in batches of 20 to avoid timeouts
  const BATCH = 20;
  let added = 0;
  for (let i = 0; i < redirectsToAdd.length; i += BATCH) {
    const batch = redirectsToAdd.slice(i, i + BATCH);
    const result = await framer.addRedirects(batch);
    added += result.length;
    log(`Batch ${Math.floor(i/BATCH)+1}: added ${result.length} redirects`);
  }
  log(`Total redirects added: ${added}`);

  // ── Publish ────────────────────────────────────────────────────────────────
  section("Publishing");
  await framer.publish();
  log("✓ Site published");

  await framer.disconnect();
  console.log("\n✓ Tier 1 fixes complete.");
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
