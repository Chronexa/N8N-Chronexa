/**
 * Single source of truth for the blog taxonomy: three orthogonal axes (industry,
 * topic, format) plus an optional region. Drives the /blog index filters, the
 * /blog/industries/* and /blog/topics/* hub pages, and the sitemap.
 *
 * Mirrors the shape of src/lib/taxonomy.ts (the Services/Use-Cases IA) so the two
 * read alike. The `values` here MUST match the option lists in
 * src/sanity/schema/post.ts — Sanity is the runtime source of truth for which post
 * sits in which bucket; this file owns the labels, copy, and indexability rules.
 *
 * `indexable: false` means the bucket is a filter chip only — no URL, no hub page,
 * no sitemap entry. Thin hub pages over 3-4 posts invite index bloat and dilute the
 * hubs that have real depth, so a bucket has to earn its page (~10+ posts).
 */

export type Axis = 'industry' | 'topic';

export interface Bucket {
  /** URL segment + the value stored on the Sanity document. */
  value: string;
  /** Chip / card label. */
  label: string;
  /**
   * Short form for filter chips. The full labels ("Cross-Industry & Professional
   * Services") wrapped the chip row onto three lines; chips have to scan in one
   * glance, so they get a two-word name.
   */
  short: string;
  /** <h1> on the hub page. Keyword-first, not the short chip label. */
  heading: string;
  /**
   * 100-200 words answering the definitional question the hub name implies.
   * Rendered as the hub's opening paragraphs. This is the passage an AI answer
   * engine can actually quote — a bare grid of cards gives it nothing.
   */
  intro: string;
  metaTitle: string;
  metaDescription: string;
  order: number;
  indexable: boolean;
  /**
   * Per-collection accent. The page read flat because every cover is the same
   * cream-and-charcoal line illustration, and those thumbnails are most of the
   * visual area — accents elsewhere could not outweigh a wall of identical beige.
   * Tinting the thumbnail per collection makes a CPA card and a legal card
   * distinguishable at a glance.
   *
   * `ink` is text-weight (checked ≥4.5:1 on warm paper); `wash` is the ~10%
   * thumbnail tint. Deliberately desaturated and earthy so it reads editorial
   * rather than like a SaaS colour wheel. Green stays first among equals — it is
   * still the brand and still owns buttons and links.
   */
  ink: string;
  wash: string;
}

/* ------------------------------- Industry ------------------------------- */

export const INDUSTRIES: Bucket[] = [
  {
    value: 'cpa-firms',
    ink: '#2F6B3A',
    wash: 'rgba(47, 107, 58, 0.18)',
    label: 'CPA & Accounting Firms',
    short: 'CPA Firms',
    heading: 'AI automation for CPA and accounting firms',
    intro:
      'AI automation for CPA firms means putting software in the path of the document-heavy work that fills a tax season — collecting client source documents, reading them, checking them against each other, and moving them into the tax application without a person retyping anything. In practice the bottleneck is almost never the return itself. It is the chase for missing documents, the K-1 footnote a scanning tool skipped, the duplicate receipt, the amended return that arrives after the workpaper is built, and the handoffs between CCH Axcess, SafeSend, Karbon and UltraTax that no single vendor owns end to end. The posts below cover that ground for firms that already own their software stack and are deciding what to automate inside it: what practice-management platforms genuinely do and where they stop, what an integration actually requires when a vendor will not open its API, what this costs, and how to judge a build-versus-buy decision without taking a sales deck at face value.',
    metaTitle: 'AI Automation for CPA & Accounting Firms — Chronexa Blog',
    metaDescription:
      'Practical guides on tax document automation, K-1 extraction, workpaper prep, and CCH Axcess, SafeSend, Karbon and UltraTax integration — written for CPA firms.',
    order: 1,
    indexable: true,
  },
  {
    value: 'law-firms',
    ink: '#35507A',
    wash: 'rgba(53, 80, 122, 0.18)',
    label: 'Law Firms & Legal',
    short: 'Law Firms',
    heading: 'AI automation for law firms',
    intro:
      'AI automation for law firms covers the operational work that sits around legal work rather than replacing it: capturing billable time that currently goes unrecorded, running conflict checks at intake, moving documents through iManage or NetDocuments, monitoring regulatory and SEC filings, and reviewing contracts at a volume that manual review cannot reach. The constraint in legal is rarely capability — it is confidentiality, privilege and professional responsibility. A firm cannot send privileged material to a general-purpose model and treat the question as settled, and ABA guidance and malpractice carriers have both moved on what they expect a firm to be able to demonstrate. The posts below deal with both halves: the operational case for automating a specific workflow, and the data-sovereignty and governance questions that decide whether a given approach is usable at a firm at all. Several are written for the build-versus-buy decision specifically, including where a practice-management vendor genuinely covers the need and where it leaves a gap.',
    metaTitle: 'AI Automation for Law Firms — Chronexa Blog',
    metaDescription:
      'Guides on legal AI: matter intake, conflict checks, time capture, contract review, iManage and NetDocuments automation, ABA ethics and data sovereignty.',
    order: 2,
    indexable: true,
  },
  {
    value: 'rias-wealth-management',
    ink: '#96601A',
    wash: 'rgba(183, 121, 31, 0.18)',
    label: 'RIAs & Wealth Management',
    short: 'RIAs & Wealth',
    heading: 'AI automation for RIAs and wealth management firms',
    intro:
      'For registered investment advisers, automation earns its place in the operational layer between the custodian, the CRM and the client — the work that scales with client count rather than with assets. That means ACAT transfer paperwork that gets rejected as NIGO and has to be re-cut, custody statements reconciled across multiple custodians, Form ADV amendments re-keyed from data the CRM already holds, quarterly client reports assembled by hand from Orion and a spreadsheet, and the annual compliance review that is really a document-gathering exercise. Redtail, Wealthbox and Orion each cover part of this well and none of them covers the seams between them, which is where advisor and operations time actually goes. The posts below are written for firms deciding what to automate first, with attention to the compliance surface — SEC marketing rule, KYC, wash-sale exposure across custodians — because in an RIA the operational fix and the compliance obligation are usually the same piece of work.',
    metaTitle: 'AI Automation for RIAs & Wealth Management — Chronexa Blog',
    metaDescription:
      'Guides on RIA operations: ACAT and NIGO rejections, custody reconciliation, Form ADV, SEC marketing rule compliance, and Redtail, Wealthbox and Orion automation.',
    order: 3,
    indexable: true,
  },
  {
    value: 'cross-industry',
    ink: '#9C4A28',
    wash: 'rgba(156, 74, 40, 0.18)',
    label: 'Cross-Industry & Business Teams',
    short: 'Cross-Industry',
    heading: 'AI automation for business teams',
    intro:
      'Some questions do not belong to one vertical. What AI workflow automation actually is and where it differs from the last generation of integration tools. What an implementation costs, and what changes between a ten-thousand-dollar scope and a six-figure one. Whether to build a custom system or buy a point solution, and how the answer shifts once a firm has more than a handful of tools. How to evaluate an automation agency when every deck makes the same claims. What manual data entry and manual invoice processing genuinely cost per employee and per document, which is the number most firms have never calculated. The posts below are the cross-cutting ones: definitions, cost and ROI benchmarks, vendor-selection frameworks, and the platform comparisons that apply whether you run a law firm, an accounting practice, or an operations team inside a larger company.',
    metaTitle: 'AI Automation for Business Teams — Chronexa Blog',
    metaDescription:
      'Cross-industry guides to AI workflow automation: what it costs, when to build or buy, how to choose a provider and how platforms compare.',
    order: 4,
    indexable: true,
  },
  {
    value: 'sales-revenue',
    ink: '#1F6F6B',
    wash: 'rgba(31, 111, 107, 0.18)',
    label: 'Sales & Revenue Teams',
    short: 'Sales',
    heading: 'AI automation for sales and revenue teams',
    intro:
      'Automation aimed at the revenue side: prospecting, enrichment, lead scoring, CRM hygiene and the sequencing work that otherwise consumes an SDR’s day.',
    metaTitle: 'AI Automation for Sales & Revenue Teams — Chronexa Blog',
    metaDescription: 'Guides on AI for sales: prospecting agents, lead scoring, CRM automation and intent-driven sequencing.',
    order: 5,
    indexable: false,
  },
  {
    value: 'startups',
    ink: '#4F6320',
    wash: 'rgba(79, 99, 32, 0.18)',
    label: 'Startups & Founders',
    short: 'Startups',
    heading: 'AI automation for startups and founders',
    intro:
      'Written for founders of Seed to Series B startups deciding what a growth target should cost. The unit here is the open role, not the task: what a hire actually costs once recruitment, tools, management time and ramp are counted, which parts of a role are genuinely repeatable, and when hiring is still the right answer.',
    metaTitle: 'AI Automation for Startups & Founders — Chronexa Blog',
    metaDescription:
      'Hiring cost breakdowns, the Leverage Ratio, and what to automate before your next hire — written for Seed to Series B founders in India.',
    order: 8,
    // Filter chip only until the cluster has real depth (~10+ posts). A thin hub
    // over two or three articles invites index bloat, per the rule at the top of
    // this file. Flip to true once the cluster earns it.
    indexable: false,
  },
  {
    value: 'private-equity-vc',
    ink: '#6B3F70',
    wash: 'rgba(107, 63, 112, 0.18)',
    label: 'Private Equity, VC & M&A',
    short: 'PE & VC',
    heading: 'AI automation for private equity, VC and M&A',
    intro:
      'Automation across the deal lifecycle: pitch-deck screening, diligence document review, CRM and deal-flow hygiene, and portfolio-company monitoring.',
    metaTitle: 'AI Automation for Private Equity & VC — Chronexa Blog',
    metaDescription: 'Guides on AI for PE, VC and M&A: due diligence, pitch deck parsing, Affinity CRM automation and portfolio monitoring.',
    order: 6,
    indexable: false,
  },
  {
    value: 'insurance-healthcare',
    ink: '#2E6383',
    wash: 'rgba(46, 99, 131, 0.18)',
    label: 'Insurance & Healthcare',
    short: 'Insurance',
    heading: 'AI automation for insurance and healthcare',
    intro: 'Document-heavy, heavily regulated workflows: claims intake and triage, and HIPAA-bound records processing.',
    metaTitle: 'AI Automation for Insurance & Healthcare — Chronexa Blog',
    metaDescription: 'Guides on AI for claims triage, insurance document processing and HIPAA-compliant healthcare records automation.',
    order: 7,
    indexable: false,
  },
];

/* -------------------------------- Topic --------------------------------- */

export const TOPICS: Bucket[] = [
  {
    value: 'compliance-security',
    ink: '#35507A',
    wash: 'rgba(53, 80, 122, 0.18)',
    label: 'Compliance, Security & Data Sovereignty',
    short: 'Compliance',
    heading: 'AI compliance, security and data sovereignty',
    intro:
      'In a regulated firm, the question is rarely whether an AI system can do the work. It is whether the firm can put client data through it and still meet its obligations — and be able to show how. That covers where the data physically sits and who can reach it, whether a model provider trains on what you send, what a self-hosted deployment actually requires, and what your regulator, your professional body or your malpractice carrier expects you to be able to evidence. The specifics differ by vertical: SEC and FINRA for advisers, ABA guidance and privilege for law firms, HIPAA in healthcare, DIFC and ADGM in the Gulf. The posts below work through those constraints concretely rather than treating "secure" and "compliant" as adjectives — including the cases where the honest answer is that a particular tool is not usable for a particular kind of document.',
    metaTitle: 'AI Compliance, Security & Data Sovereignty — Chronexa Blog',
    metaDescription:
      'Guides on deploying AI inside regulated firms: data sovereignty, self-hosted infrastructure, SEC, FINRA, ABA and HIPAA constraints, and what to evidence.',
    order: 1,
    indexable: true,
  },
  {
    value: 'build-vs-buy',
    ink: '#9C4A28',
    wash: 'rgba(156, 74, 40, 0.18)',
    label: 'Build vs Buy & Vendor Selection',
    short: 'Build vs Buy',
    heading: 'Build vs buy, and how to choose an AI vendor',
    intro:
      'Most firms reach the same fork: buy a point solution that covers one workflow well, or build a custom system that spans the tools you already own. The honest answer depends on how many systems the work crosses, whether your vendors will open their APIs, and how much the workflow differs from the vendor\'s assumed default — a firm whose process matches the product should buy it. The posts below give decision frameworks rather than a verdict, plus the vendor-evaluation questions that actually separate products: what happens when the vendor cannot reach your data, whether the tool disappears into your stack or becomes another application to check, and what the real cost comparison looks like once implementation and maintenance are included. Also here: the platform comparisons (n8n, Make, Zapier, Workato) and the alternatives round-ups.',
    metaTitle: 'Build vs Buy AI & Vendor Selection — Chronexa Blog',
    metaDescription:
      'Decision frameworks for building versus buying AI systems, evaluating automation vendors, and comparing n8n, Make, Zapier and Workato.',
    order: 2,
    indexable: true,
  },
  {
    value: 'automation-platforms',
    ink: '#1F6F6B',
    wash: 'rgba(31, 111, 107, 0.18)',
    label: 'n8n & Automation Platforms',
    short: 'n8n & Platforms',
    heading: 'n8n and automation platform engineering',
    intro:
      'The engineering layer: how the orchestration platform itself is built, hosted and paid for. n8n is the backbone of most of what we ship, largely because it can be self-hosted — which is what makes it viable for firms that cannot send client data to a multi-tenant SaaS. These posts are more technical than the rest of the blog: self-hosting architecture and its real cost, building multi-agent systems on the AI Agent node, cutting model API spend with batch processing, migrating off Zapier or Make, and integrating systems that were never designed to be driven by an agent. Useful if you are the person actually building it, or if you are evaluating whether a proposed architecture is sound before signing off on it.',
    metaTitle: 'n8n & Automation Platform Engineering — Chronexa Blog',
    metaDescription:
      'Technical guides on n8n: self-hosting architecture and cost, multi-agent systems, the AI Agent node, API cost control, and migrating from Zapier or Make.',
    order: 3,
    indexable: true,
  },
  {
    value: 'ai-agents',
    ink: '#6B3F70',
    wash: 'rgba(107, 63, 112, 0.18)',
    label: 'AI Agents & Agentic Workflows',
    short: 'AI Agents',
    heading: 'AI agents and agentic workflows',
    intro:
      'An AI agent, in the sense used here, is a system that decides what to do next rather than following a fixed path — it reads a document, judges what kind it is, and routes it accordingly, instead of running the same five steps regardless. That flexibility is useful when the input is messy and the correct next step depends on what arrived. It also makes agents harder to deploy safely, since a system with discretion needs boundaries, logging and a human checkpoint on anything consequential. The posts below cover where agents genuinely outperform fixed workflows, what implementation looks like across business teams, the ROI evidence that exists so far, and the technical patterns for building multi-agent systems that stay debuggable.',
    metaTitle: 'AI Agents & Agentic Workflows — Chronexa Blog',
    metaDescription:
      'Guides to AI agents: where agents beat fixed workflows, how implementation works, multi-agent architecture and ROI evidence.',
    order: 4,
    indexable: true,
  },
  {
    value: 'cost-pricing-roi',
    ink: '#96601A',
    wash: 'rgba(183, 121, 31, 0.18)',
    label: 'Cost, Pricing & ROI',
    short: 'Cost & ROI',
    heading: 'What AI automation costs, and what it returns',
    intro:
      'The money questions, answered with numbers rather than adjectives. What an automation engagement costs at different scopes and what materially changes between them. What manual work costs today per employee, per invoice and per document — the baseline most businesses have never actually calculated, and without which no ROI claim means anything. The posts below include cost breakdowns, pricing explanations, ROI benchmarks by industry, and calculators that let you use your own figures instead of taking ours.',
    metaTitle: 'AI Automation Cost, Pricing & ROI — Chronexa Blog',
    metaDescription:
      'What AI automation costs and returns: agency pricing explained, cost per invoice and per employee, revenue leakage, and ROI benchmarks by industry.',
    order: 5,
    indexable: true,
  },
  {
    value: 'document-intelligence',
    ink: '#2F6B3A',
    wash: 'rgba(47, 107, 58, 0.18)',
    label: 'Document Intelligence & Data Extraction',
    short: 'Document AI',
    heading: 'Document intelligence and data extraction',
    intro:
      'Document intelligence is the work of turning a PDF, a scan or an email attachment into structured data a system can act on — and, more importantly, of catching what is wrong with it. Extraction is the easy half and largely solved; the hard half is judgement. Does this K-1 footnote change the number on the face of the form? Is this the third copy of a receipt already filed? Does the figure on the custody statement match the figure in the CRM? Is this an amended return that invalidates the workpaper built last week? Tools that only extract will report success on a document that is quietly wrong. The posts below cover extraction accuracy, cross-document validation, intake pipelines that handle duplicates and amendments, and what separates a document tool that reduces review work from one that relocates it.',
    metaTitle: 'Document Intelligence & Data Extraction — Chronexa Blog',
    metaDescription:
      'Guides on document AI: OCR and extraction accuracy, cross-document validation, intake pipelines, duplicate and amendment handling for regulated firms.',
    order: 6,
    indexable: true,
  },
];

/* ------------------------- Format & region (filters) ---------------------- */

export const FORMATS = [
  { value: 'guide', label: 'Guide' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'case-study', label: 'Case study' },
  { value: 'explainer', label: 'Explainer' },
] as const;

/**
 * Region is a filter, never a hub. /ai-automation-agency-dubai and
 * /us-ai-automation-agency already own these keywords; a blog hub would compete
 * with the money pages for the same queries.
 */
export const REGIONS = [
  { value: 'uae-gulf', label: 'UAE & the Gulf' },
  { value: 'united-states', label: 'United States' },
] as const;

/* -------------------------------- Lookups -------------------------------- */

const INDUSTRY_BY_VALUE = new Map(INDUSTRIES.map((b) => [b.value, b]));
const TOPIC_BY_VALUE = new Map(TOPICS.map((b) => [b.value, b]));

export function getBucket(axis: Axis, value: string | undefined): Bucket | undefined {
  if (!value) return undefined;
  return axis === 'industry' ? INDUSTRY_BY_VALUE.get(value) : TOPIC_BY_VALUE.get(value);
}

export function bucketsFor(axis: Axis): Bucket[] {
  return (axis === 'industry' ? INDUSTRIES : TOPICS).slice().sort((a, b) => a.order - b.order);
}

/** Only these get a hub URL, a sitemap entry and generateStaticParams coverage. */
export function indexableBuckets(axis: Axis): Bucket[] {
  return bucketsFor(axis).filter((b) => b.indexable);
}

/** Allowed values per field — mirrors the option lists in sanity/schema/post.ts. */
export const TAXONOMY_VALUES = {
  industry: INDUSTRIES.map((b) => b.value),
  topic: TOPICS.map((b) => b.value),
  format: FORMATS.map((f) => f.value),
  region: REGIONS.map((r) => r.value),
} as const;

export const labelFor = (axis: Axis, value?: string) => getBucket(axis, value)?.label ?? '';
export const formatLabel = (v?: string) => FORMATS.find((f) => f.value === v)?.label ?? '';
export const regionLabel = (v?: string) => REGIONS.find((r) => r.value === v)?.label ?? '';

/** URL for a hub page. Sits one level below /blog/[slug], so no route collision. */
export const hubPath = (axis: Axis, value: string) =>
  axis === 'industry' ? `/blog/industries/${value}` : `/blog/topics/${value}`;

/* --------------------------- Classification rules ------------------------- */
/**
 * Ordered, FIRST-MATCH-WINS rules over `slug + title`. Same pattern as the RULES
 * array in src/lib/blog-links.ts.
 *
 * These exist to SEED the one-time backfill (scripts/backfill-blog-taxonomy-*.mjs).
 * After that, Sanity is the source of truth and a mis-classified post is fixed by
 * an editor, not a deploy. Runtime code must never re-derive a post's bucket from
 * these rules — read the document fields instead.
 *
 * Order matters: the narrower the audience, the earlier the rule.
 */
export const INDUSTRY_RULES: [string, RegExp][] = [
  // NOTE on precision: bare `advisor`/`advisory` and bare `invoice` were removed.
  // CPA firms sell "advisory" services, so `advisory` pulled CPA posts into the RIA
  // bucket ("AI Agents for CPA and Accounting Firms: Automate Tax, Billing, and
  // Advisory"). And every industry has invoices — `invoice` dragged a Dubai freight
  // post into CPA. Ambiguous single words cannot be allowed to decide a bucket.
  ['rias-wealth-management', /\bria\b|\brias\b|wealth|financial advisor|advisory firm|registered investment|acats?\b|nigo|custody|custodian|redtail|wealthbox|orion|form-adv|adv-form|wash-sale|fiduciary|trust-distribution|quarterly-client-report|annual-compliance-review|tax-aware|understaffed|sec-marketing|finra/i],
  ['cpa-firms', /\bcpa\b|\btax\b|accounting|accountant|bookkeep|quickbooks|xero|k-?1\b|irs\b|safesend|karbon|ultratax|cch|axcess|firm360|workpaper|audit-documentation|audit-prep|engagement-letter|practice-management|fixed-assets|1099|w-?2|preparer|busy season/i],
  ['law-firms', /legal|law-firm|law firm|lawyer|attorney|contract|litigation|matter|imanage|netdocuments|relativity|clio|malpractice|billable|privileged|conflict-check|sec-filing|docket|counsel|\baba\b/i],
  ['private-equity-vc', /private-equity|private equity|\bpe\b|venture|\bvc\b|\bm&a\b|due-diligence|due diligence|pitch-deck|pitch deck|affinity|deal-lifecycle|deal flow|portfolio compan/i],
  // Bare `insurance` matched "malpractice insurance", which is law-firm vocabulary,
  // and pushed a legal post into a second bucket (→ cross-industry). Require an
  // actual insurance-industry phrase instead.
  ['insurance-healthcare', /insurance claim|claims triage|claims process|underwrit|policyholder|\binsurer\b|healthcare|hipaa|medical|patient/i],
  // Bare `crm` removed: EVERY vertical runs a CRM, so it dragged three RIA posts
  // (Redtail, Orion, Form ADV) into a second bucket. Sales posts are identifiable
  // by their own vocabulary without it.
  ['sales-revenue', /\bsdr\b|prospecting|apollo|lead-scoring|lead scoring|outbound|cold email|sales-automation|sales automation|sales pipeline/i],
];

export const TOPIC_RULES: [string, RegExp][] = [
  ['compliance-security', /complian|governance|\bsecure\b|security|self-host|self hosted|privileged|sovereign|\bkyc\b|\baml\b|hipaa|\bsec\b|finra|\baba\b|difc|adgm|\bvat\b|e-invoicing|form-adv|adv-form|regulat|risk|malpractice|is-ai-safe|audit/i],
  ['build-vs-buy', /build-vs-buy|build vs buy|off-the-shelf|custom-ai|custom ai|vs\b|versus|alternatives|choose|top-\d|top \d|best-|best |review|comparison|vendor|productized|point-solutions|readiness/i],
  ['cost-pricing-roi', /cost|pricing|price|\broi\b|benchmark|leakage|save|savings|revenue|billing|per-invoice|per-employee|budget|scaling|capacity|reduce-/i],
  ['document-intelligence', /document|\bocr\b|\bpdf\b|extraction|intake|paperwork|data-entry|data entry|workpaper|statement|reconcil|scanning|footnote|clause|mismatch|collection|filing|report/i],
  ['ai-agents', /\bagent|agentic|multi-agent|copilot|co-pilot|autonomous|claude|\bllm\b/i],
  ['automation-platforms', /n8n|zapier|make\b|workato|palantir|platform|integration|workflow|orchestrat|\bapi\b|migration|whatsapp/i],
];

export const REGION_RULES: [string, RegExp][] = [
  ['uae-gulf', /uae|dubai|difc|adgm|abu-dhabi|emirates|\bgcc\b|whatsapp-business|fta-e-invoicing|freight-logistics/i],
  ['united-states', /\bus-|united-states|\busa\b|\bsec\b|finra|\baba\b|irs|1099|w-?2|k-?1\b|hipaa|new-york/i],
];

/** Format is inferred from title shape rather than subject matter. */
export const FORMAT_RULES: [string, RegExp][] = [
  ['case-study', /case-study|case study|how we|we built|we fired|we replaced|\$\d|recovered|results/i],
  // No bare "which " here — a question-form title with no vs/alternatives is a
  // decision explainer, not a comparison. Real comparisons trip vs/versus/
  // alternatives/compare/best/top-N first.
  ['comparison', /\bvs\.?\b|versus|alternatives|compare|comparison|top-?\s?\d|best |build-vs-buy|off-the-shelf/i],
  ['explainer', /^what-is|what is|^why|why |^is-|is it|^does|^do-you|definition|explained|plain-english|guide-for-business/i],
];

const firstMatch = (rules: [string, RegExp][], hay: string, fallback = '') =>
  rules.find(([, re]) => re.test(hay))?.[0] ?? fallback;

/** Distinct buckets a haystack matches, in rule order. */
const allMatches = (rules: [string, RegExp][], hay: string) => [
  ...new Set(rules.filter(([, re]) => re.test(hay)).map(([k]) => k)),
];

/**
 * Industry needs more care than first-match-wins. A post that names two verticals
 * ("ROI Benchmarks for Law, Accounting and Financial Services") is genuinely
 * cross-industry — taking whichever rule happens to sit first in the array would
 * file it under one vertical and quietly mislead the reader who lands on that hub.
 *
 * So: exactly one distinct match wins; two or more means cross-industry. The
 * headline is tried first because it is the author's own statement of audience;
 * the excerpt is only consulted to rescue a post the headline left unclassified.
 */
function resolveIndustry(headline: string, excerpt: string): string {
  const fromHeadline = allMatches(INDUSTRY_RULES, headline);
  if (fromHeadline.length === 1) return fromHeadline[0];
  if (fromHeadline.length > 1) return 'cross-industry';

  const fromExcerpt = allMatches(INDUSTRY_RULES, excerpt);
  return fromExcerpt.length === 1 ? fromExcerpt[0] : 'cross-industry';
}

/**
 * Seed classification for one post. Used by the backfill script only.
 *
 * ONLY industry reads the excerpt, and that asymmetry is deliberate:
 *
 * - Industry is identified by named entities — Karbon, Redtail, iManage, ACAT.
 *   Those appear in excerpts, and the newer posts are written in the buyer's own
 *   language so their titles carry no vendor keywords at all. "Your Client
 *   Uploaded Everything. So Why Isn't It Ready?" is a CPA post and only the
 *   excerpt ("Karbon files client documents...") says so. Title-and-slug alone
 *   dumped that whole batch into cross-industry.
 *
 * - Topic is identified by framing, which lives in the title. Feeding it the
 *   excerpt made it markedly worse: incidental words like "compliance", "risk"
 *   and "audit" appear in most excerpts, so the first topic rule swallowed
 *   everything (compliance-security 30 → 49, automation-platforms 28 → 6).
 *
 * - Region is a strong claim; an excerpt mentioning the SEC in passing must not
 *   geo-tag a global post as US-specific.
 */
export function classifyPost(post: { slug: string; title: string; excerpt?: string }) {
  const headline = `${post.slug} ${post.title}`;
  return {
    industry: resolveIndustry(headline, post.excerpt ?? ''),
    topic: firstMatch(TOPIC_RULES, headline, 'automation-platforms'),
    format: firstMatch(FORMAT_RULES, headline, 'guide'),
    region: firstMatch(REGION_RULES, headline) || undefined,
  };
}
