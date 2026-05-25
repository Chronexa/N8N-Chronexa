/**
 * Bidirectional links: case studies ↔ related blog posts.
 * - Blog posts get a "See a real example:" line before the CTA <hr />
 * - Case studies get a "Further reading:" line appended to Content Field 2
 *
 * Run: node scripts/link-case-studies.mjs
 * Preview: node scripts/link-case-studies.mjs --dry-run
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL   = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLL_ID  = "L8b3IANtH";
const CS_COLL_ID    = "rw5orra1a";
const TOKEN         = process.env.FRAMER_API_TOKEN;
const DRY_RUN       = process.argv.includes("--dry-run");

const F_BLOG_BODY   = "fSfrbBQqV";
const F_CS_BODY2    = "jdwxxnkMq"; // Content Field 2 (appended at bottom of case study)
const BOOKING_URL   = "https://cal.com/chronexa/30min";

// Pairs: each case study linked to specific blog posts
const PAIRS = [
  {
    cs: { id: "Od9WUZLn2", slug: "how-reservestudy-automated-report-production-with-ai",
          label: "How ReserveStudy.com cut report creation time from days to minutes" },
    blogs: [
      { id: "SCO7BwoJk", slug: "what-to-do-when-your-hoa-reserve-study-is-outdated",
        csAnchor: "how ReserveStudy.com automated this end-to-end" },
      { id: "TQh0qSXA7", slug: "reserve-study-automation-for-hoas-ai-powered-reserve-analysis-in-hours-not-weeks",
        csAnchor: "see it live in this case study" },
    ],
  },
  {
    cs: { id: "oMEFhuNr_", slug: "ai-outbound-sales-automation-personalisation-case-study",
          label: "Scaling Personalized Outbound Pipeline Without Increasing Sales Headcount" },
    blogs: [
      { id: "gd13Yg1DV", slug: "saas-revenue-operations-automation-mrr-visibility",
        csAnchor: "how one team scaled outbound without adding headcount" },
      { id: "IOgj5yyUP", slug: "why-scaling-lead-outreach-with-humans-is-financial-suicide",
        csAnchor: "a real team that solved this exact problem" },
    ],
  },
  {
    cs: { id: "yEmGi05RE", slug: "how-leading-law-firm-automated-regulatory-intelligence",
          label: "How a Leading Corporate Law Firm Automated Regulatory Intelligence with AI" },
    blogs: [
      { id: "Q59DfGhrX", slug: "document-automation-tools-for-regulated-industries",
        csAnchor: "how a corporate law firm automated regulatory intelligence" },
      { id: "nFssilqAG", slug: "adv-form-automation-compliance-ria-workflows",
        csAnchor: "see this in production at a leading law firm" },
    ],
  },
  {
    cs: { id: "hSgFdj2_9", slug: "ai-automation-tax-workflow-cpa-case-study",
          label: "Scaling Tax Season Capacity Without Increasing Headcount for a CPA Firm" },
    blogs: [
      { id: "TnBW3xpIR", slug: "tax-document-automation-workflow-cpa-firms",
        csAnchor: "how a CPA firm scaled tax season without adding staff" },
      { id: "kmBXAUmit", slug: "cpa-firm-client-onboarding-automation-3-days",
        csAnchor: "the CPA firm that eliminated tax season bottlenecks" },
      { id: "VyREIUqTQ", slug: "tax-season-automation-cpa-firm-scaling",
        csAnchor: "a CPA firm that solved exactly this problem" },
    ],
  },
  {
    cs: { id: "cTNTnFJ82", slug: "how-autopartsco-scaled-customer-support-with-ai",
          label: "How AutoPartsCo transformed customer operations using AI automation" },
    blogs: [
      { id: "xjQLukIhp", slug: "grow-smarter-ai-customer-support-strategies-for-smbs-to-compete-with-giants",
        csAnchor: "how AutoPartsCo transformed their support operation with AI" },
      { id: "qVtwFabU0", slug: "beyond-the-chatbot-the-rise-of-agentic-ai-in-customer-support",
        csAnchor: "see it working in a real business" },
    ],
  },
  {
    cs: { id: "jJT307oJx", slug: "how-ledgersync-eliminated-invoice-backlogs-using-ai",
          label: "How LedgerSync Eliminated Invoice Backlogs Using AI" },
    blogs: [
      { id: "OsflskW8g", slug: "invoice-reconciliation-automation-saas-founders",
        csAnchor: "how LedgerSync eliminated invoice backlogs with automation" },
      { id: "uROWykGih", slug: "account-reconciliation-automation-custom-ai-workflows",
        csAnchor: "a live implementation that solved this" },
    ],
  },
  {
    cs: { id: "cFF1eJDdS", slug: "how-freshcart-boosted-lead-quality-with-ai-scoring",
          label: "How FreshCart Foods Boosted Lead Quality With AI Scoring" },
    blogs: [
      { id: "gd13Yg1DV", slug: "saas-revenue-operations-automation-mrr-visibility",
        csAnchor: "how FreshCart improved lead quality with AI scoring" },
    ],
  },
];

function blogCsLink(cs, anchor) {
  return `<p dir="auto"><strong>See it in practice:</strong> <a href="/case-studies/${cs.slug}">${anchor} →</a></p>`;
}
function csBlogLink(blogs) {
  const links = blogs.map(b => `<a href="/blog/${b.slug}">${b.slug.replace(/-/g, ' ')}</a>`).join(", ");
  return `<p dir="auto"><strong>Further reading:</strong> ${links}</p>`;
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer    = await connect(PROJECT_URL, TOKEN);
  const colls     = await framer.getCollections();
  const blog      = colls.find(c => c.id === BLOG_COLL_ID);
  const csCollection = colls.find(c => c.id === CS_COLL_ID);
  const blogItems = await blog.getItems();
  const csItems   = await csCollection.getItems();

  const blogById  = Object.fromEntries(blogItems.map(i => [i.id, i]));
  const csById    = Object.fromEntries(csItems.map(i => [i.id, i]));

  let updated = 0;

  for (const pair of PAIRS) {
    const cs = csById[pair.cs.id];
    if (!cs) { console.log(`⚠ Case study not found: ${pair.cs.id}`); continue; }

    console.log(`\n── Case study: ${cs.slug}`);

    // 1. Blog posts → link to case study
    for (const blogRef of pair.blogs) {
      const item = blogById[blogRef.id];
      if (!item) { console.log(`  ⚠ Blog not found: ${blogRef.id}`); continue; }
      if (item.draft) { console.log(`  — Draft: ${item.slug}`); continue; }

      const body = item.fieldData[F_BLOG_BODY]?.value ?? "";
      if (body.includes(cs.slug)) {
        console.log(`  ✓ Blog already links to CS: ${item.slug}`);
        continue;
      }

      const linkHtml = blogCsLink(pair.cs, blogRef.csAnchor);
      let newBody;
      const hrIdx = body.indexOf("<hr />");
      newBody = hrIdx !== -1
        ? body.slice(0, hrIdx) + linkHtml + "\n" + body.slice(hrIdx)
        : body + "\n" + linkHtml;

      if (DRY_RUN) {
        console.log(`  [DRY] Blog → CS: ${item.slug}`);
      } else {
        await blog.addItems([{
          id: item.id, slug: item.slug, draft: item.draft,
          fieldData: { [F_BLOG_BODY]: { type: "formattedText", value: newBody } },
        }]);
        console.log(`  ✓ Blog → CS: ${item.slug}`);
      }
      updated++;
    }

    // 2. Case study → link to related blog posts
    const csBody2 = cs.fieldData[F_CS_BODY2]?.value ?? "";
    const hasAnyBlogLink = pair.blogs.some(b => csBody2.includes(b.slug));
    if (hasAnyBlogLink) {
      console.log(`  ✓ CS already links to blogs`);
    } else {
      const blogLinks = csBlogLink(pair.blogs);
      const newCsBody = csBody2 + (csBody2 ? "\n" : "") + blogLinks;
      if (DRY_RUN) {
        console.log(`  [DRY] CS → blogs`);
      } else {
        await csCollection.addItems([{
          id: cs.id, slug: cs.slug, draft: cs.draft,
          fieldData: { [F_CS_BODY2]: { type: "formattedText", value: newCsBody } },
        }]);
        console.log(`  ✓ CS → blogs`);
      }
      updated++;
    }
  }

  console.log(`\nTotal updates: ${updated}`);

  if (!DRY_RUN && updated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
