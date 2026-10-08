import { services, useCasesByFunction, useCasesByIndustry, geoPages } from './taxonomy';
import { CALCULATORS, type CalculatorDef } from '../components/calculators/registry';

/**
 * Maps a blog post to its 2-3 most relevant service/use-case pages, so every
 * post links "up" to a money page with keyword-rich anchor text (hub-and-spoke
 * internal linking). Topic match is keyword-based on title + category + slug.
 */
const ALL = [...services, ...useCasesByFunction, ...useCasesByIndustry, ...geoPages];
const LABEL = new Map(ALL.map((i) => [i.slug, i.title || i.navLabel]));

// First match wins ordering; multiple rules can contribute (deduped, capped at 3).
const RULES: [RegExp, string[]][] = [
  // Geo first: a UAE/Dubai post should link its regional money page ahead of the
  // generic vertical pages, then let the vertical rules below fill the remaining slots.
  [/dubai|\buae\b|emirates|abu dhabi|\bgcc\b|middle east/i, ['ai-automation-agency']],
  [/invoice|billing|reconcil|accounts payable|accounts receivable|\bap\b|\bar\b|expense|month-?end|close|ledger|bookkeep/i, ['document-processing-automation']],
  [/\btax\b|cpa|accounting|\b1099\b|w-?2/i, ['cpa-tax-document-automation', 'document-processing-automation']],
  [/legal|law firm|contract|due diligence|clause|litigation|matter intake|imanage|netdocuments/i, ['legal-due-diligence-automation', 'document-processing-automation']],
  [/\bria\b|wealth|advisor|fiduciary|custody|adv form|portfolio.*(report|monitor)|registered investment/i, ['financial-services-automation', 'document-processing-automation']],
  [/insurance|claim|underwrit|fnol|subrogation|guidewire/i, ['insurance-claims-triage-automation', 'document-processing-automation']],
  [/\bvc\b|private equity|\bpe\b|venture|deal flow|pitch deck|affinity|portfolio compan/i, ['vc-pe-crm-automation', 'ai-sales-outreach-engine']],
  [/hoa|reserve study|property manage|real estate|kvcore/i, ['property-management-automation']],
  [/pharma|life scien|clinical|biotech|regulatory (doc|submission)/i, ['pharma-life-sciences-automation', 'document-processing-automation']],
  [/d2c|e-?commerce|shopify|cart|inventory|stockout|retention|amazon|woocommerce/i, ['d2c-ecommerce-automation', 'ai-automation-agency']],
  [/customer support|help ?desk|ticket|\bcx\b|chatbot|customer service|customer quer/i, ['customer-support-automation']],
  [/\bhr\b|recruit|hiring|onboard|resume|talent|employee/i, ['hr-automation']],
  [/\blead\b|\bsdr\b|outbound|cold email|prospect|\bcrm\b|pipeline|revenue|\bsales\b|gtm|forecast/i, ['ai-sales-outreach-engine']],
  // 'marketing-automation' 308-redirects to 'ai-sales-outreach-engine' (next.config.ts) — link
  // straight to the real destination so the reader doesn't hit a hop and a mismatched label.
  [/marketing|\bseo\b|content (production|marketing)|newsletter|campaign|\bads?\b|social media/i, ['ai-sales-outreach-engine']],
  [/compliance|soc ?2|hipaa|\bkyc\b|\baml\b|\baudit\b|regulated/i, ['document-processing-automation', 'financial-services-automation']],
  [/document|\bocr\b|\bpdf\b|extraction|\bidp\b|unstructured|data entry/i, ['document-processing-automation']],
  [/integrat|\bapi\b|data layer|\betl\b|sync|warehouse|migrat|\bmcp\b/i, ['ai-integration-services', 'custom-mcp-server-development']],
  [/\bagent|knowledge|\brag\b/i, ['ai-agent-development', 'ai-knowledge-systems']],
  [/n8n|zapier|workflow|self-host|automation (platform|tool)|orchestrat/i, ['ai-automation', 'ai-automation-agency']],
  [/report|briefing|dashboard|presentation/i, ['automated-reporting']],
  [/email|inbox/i, ['ai-email-management']],
  [/training|adopt|ai-native|team enablement/i, ['ai-training-for-employees']],
  [/cost|pricing|price|roi|budget/i, ['ai-automation-cost', 'ai-roi-calculator']],
  [/readiness|assessment|audit your|where to start|roadmap|strategy/i, ['ai-strategy-consulting', 'how-we-work']],
];

const FALLBACK = ['ai-automation-agency', 'ai-knowledge-systems', 'ai-integration-services'];

/**
 * The pillar page each audience cluster links UP to (hub-and-spoke). The blog
 * strategy requires every post in a cluster to link its pillar — keyword rules
 * alone missed it whenever a post's title/slug didn't happen to contain the
 * vertical keyword (a CPA post titled "Cross-Document Data Mismatches" matched
 * only the generic document rule and never reached /cpa-tax-document-automation).
 * Keyed by the Sanity `industry` value; `cross-industry` has no single pillar,
 * so those posts fall through to the keyword rules as before.
 */
const PILLAR_BY_INDUSTRY: Record<string, string> = {
  'cpa-firms': 'cpa-tax-document-automation',
  'law-firms': 'legal-due-diligence-automation',
  'rias-wealth-management': 'financial-services-automation',
  'private-equity-vc': 'vc-pe-crm-automation',
  'insurance-healthcare': 'insurance-claims-triage-automation',
  'sales-revenue': 'ai-sales-outreach-engine',
  startups: 'ai-automation-agency',
};

/**
 * Industry-scoped service slots, used INSTEAD of the keyword rules for the
 * audiences listed here.
 *
 * Why this exists: the RULES above read a free-text haystack, which is fine when a
 * post's vocabulary belongs to its audience. It is not fine for the startup
 * cluster, whose whole vocabulary is money and hiring. "What Does Your Next Hire
 * Actually Cost? The Headcount Tax, Priced" matches /\btax\b/ on the words
 * "Headcount Tax" and picks up the two CPA money pages, which is exactly wrong for
 * a founder. Where an audience has a small, known-correct set of pages, name them.
 *
 * Pillar first, so it keeps slot one. Any industry absent from this map falls
 * through to the keyword rules exactly as before.
 */
const SERVICES_BY_INDUSTRY: Record<string, string[]> = {
  startups: ['ai-automation-agency', 'ai-sales-outreach-engine', 'business-process-automation-consulting'],
};

/** The pillar page for a post's industry, if it has one. */
export function pillarFor(industry?: string): { slug: string; label: string } | undefined {
  const slug = industry ? PILLAR_BY_INDUSTRY[industry] : undefined;
  return slug ? { slug, label: LABEL.get(slug) || slug } : undefined;
}

/**
 * The buyer-intent page each post hands its reader to (2026-10 SEO forensics: the
 * blog never fed the pages that book calls). Reserved as the LAST related-service
 * slot so a vertical pillar can still lead, but every post ends one click from a
 * page built to convert. First match wins; the agency page is the default.
 */
const BUYER_RULES: [RegExp, string][] = [
  [/\bmcp\b|model context protocol/i, 'custom-mcp-server-development'],
  [/migrat|replatform|legacy (system|software)|switch(ing)? from/i, 'tech-stack-migration'],
  [/integrat|\bapi\b|\betl\b|\bsync\b|data layer|connector|\berp\b/i, 'ai-integration-services'],
  [/knowledge|\brag\b|semantic search|internal search|policy|playbook/i, 'ai-knowledge-systems'],
  [/\bagents?\b|copilot|assistant|chatbot|autonomous/i, 'ai-agent-development'],
  [/report|briefing|dashboard|presentation/i, 'automated-reporting'],
  [/\bemail\b|inbox/i, 'ai-email-management'],
  [/training|upskill|ai-native|team enablement/i, 'ai-training-for-employees'],
  [/cost|pricing|price|budget|per invoice|\broi\b|payback/i, 'ai-automation-cost'],
  [/consultant|consulting|advisor|advisory/i, 'ai-consultant'],
  [/strategy|roadmap|readiness|where to start|assessment|maturity/i, 'ai-strategy-consulting'],
];

export function buyerPageFor(hay: string): string {
  for (const [re, slug] of BUYER_RULES) if (re.test(hay)) return slug;
  return 'ai-automation-agency';
}

export function relatedServices(opts: { title?: string; category?: string; slug?: string; industry?: string }) {
  const hay = `${opts.title || ''} ${opts.category || ''} ${opts.slug || ''}`.toLowerCase();
  const picked: string[] = [];
  // Pillar first — it is the guaranteed link, not a keyword coincidence.
  const pillar = PILLAR_BY_INDUSTRY[opts.industry || ''];
  if (pillar) picked.push(pillar);
  // An explicit per-audience list wins over keyword matching entirely.
  const scoped = SERVICES_BY_INDUSTRY[opts.industry || ''];
  if (scoped) {
    for (const s of scoped) if (!picked.includes(s)) picked.push(s);
    return picked.slice(0, 3).map((slug) => ({ slug, label: LABEL.get(slug) || slug }));
  }
  for (const [re, slugs] of RULES) {
    if (re.test(hay)) for (const s of slugs) if (!picked.includes(s)) picked.push(s);
  }
  for (const s of FALLBACK) { if (picked.length >= 3) break; if (!picked.includes(s)) picked.push(s); }
  // Two vertical/keyword matches at most; the last slot is always the buyer page.
  const buyer = buyerPageFor(hay);
  const head = picked.filter((s) => s !== buyer).slice(0, 2);
  return [...head, buyer].map((slug) => ({ slug, label: LABEL.get(slug) || slug }));
}

/**
 * Matches a blog post to one of the three free calculators, when the topic is a
 * genuine fit — a law-firm/tax/document reader gets a 2-minute "see your number"
 * offer instead of a cold call ask. No fallback: most posts (n8n tutorials, etc.)
 * don't fit any calculator and keep the plain book-a-call CTA rather than being
 * pushed toward an irrelevant one.
 */
const CALC_RULES: [RegExp, string][] = [
  [/legal|law firm|contract|due diligence|clause|litigation|matter intake|imanage|netdocuments|billable|billing|conflict check/i, 'law-firm-billing-leakage-calculator'],
  [/\btax\b|cpa|accounting|\b1099\b|w-?2|bookkeep|tax season|\bk-?1\b|axcess|safesend|karbon/i, 'cpa-tax-season-capacity-calculator'],
  [/document|\bocr\b|\bpdf\b|extraction|\bidp\b|unstructured|data entry|paperwork/i, 'document-processing-cost-calculator'],
];

/**
 * Audiences with no calculator that fits them. Without this, the startup cluster's
 * money vocabulary trips CALC_RULES: "The Headcount Tax" matches /\btax\b/ and a
 * founder gets offered the CPA tax-season capacity calculator, which is a worse
 * ask than no calculator at all. These posts fall through to the plain call.
 */
const NO_CALCULATOR_INDUSTRIES = new Set(['startups']);

export function relatedCalculator(opts: {
  title?: string;
  category?: string;
  slug?: string;
  industry?: string;
}): CalculatorDef | undefined {
  if (opts.industry && NO_CALCULATOR_INDUSTRIES.has(opts.industry)) return undefined;
  const hay = `${opts.title || ''} ${opts.category || ''} ${opts.slug || ''}`.toLowerCase();
  for (const [re, slug] of CALC_RULES) {
    if (re.test(hay)) return CALCULATORS.find((c) => c.slug === slug);
  }
  return undefined;
}

/* ---------------------------------------------------------------------------
   Article CTA intent tiers
   ---------------------------------------------------------------------------
   Search Console (May-Aug 2026) showed the blog's highest-earning posts are all
   vendor-comparison pieces ("top AI automation agencies …"), and every one of
   them fell through to a generic "Book a Free Strategy Call" because no
   calculator rule matched. That reader is mid-shortlist asking "who do I hire";
   a calendar link answers a question they have not reached yet.

   So the ask is chosen by READER INTENT, not by keyword coincidence:
     scope      — comparison / vendor-selection posts. Answer the shortlisting
                  question: how we scope, price and build. Calculator, when one
                  fits, rides along as the lighter secondary ask.
     calculator — cost/problem posts matching CALC_RULES. Two minutes, no email:
                  the correctly-sized first ask for a cold organic reader.
     call       — everything else. One quiet, non-aggressive ask.
   --------------------------------------------------------------------------- */

export type ArticleCtaPlan =
  | { tier: 'offer' }
  | { tier: 'scope'; calc?: CalculatorDef }
  | { tier: 'calculator'; calc: CalculatorDef }
  | { tier: 'call' };

/**
 * Agency-shopping posts — a strict subset of comparison intent, and the most
 * commercially valuable traffic on the site.
 *
 * These are the "top/best AI automation agencies" listicles. GSC (May-Aug 2026)
 * puts eight of them at 58 clicks and ~19k impressions against 17 clicks from
 * the 67 CPA/legal/wealth pages combined — this reader is not researching a
 * topic, they are picking a supplier this week.
 *
 * They get the `offer` tier rather than `scope` because a shortlisting reader
 * will compare three vendors before booking anything with any of them. Asking
 * for a call loses to whichever competitor asked for less; asking for ten
 * sample documents is a smaller commitment than the shortlist itself, and it
 * puts our output in front of them while they are still comparing.
 */
const AGENCY_SHOPPING_RE =
  /(?:top|best)[- ].{0,30}(?:ai[- ])?(?:automation|n8n)[- ](?:agenc|consultan|expert|compan|partner|firm)|automation-agencies|n8n-(?:consultants|experts)|best-n8n/i;

export function isAgencyShoppingPost(opts: { title?: string; slug?: string }): boolean {
  return AGENCY_SHOPPING_RE.test(`${opts.title || ''} ${opts.slug || ''}`);
}

/**
 * Outsourcing-vs-AI comparison posts — the same shortlisting-stage reader as
 * agency-shopping, arrived at from the other real search vocabulary buyers
 * use ("legal process outsourcing", "data entry outsourcing") rather than
 * "AI automation agency". A reader comparing "outsource this or build it" is
 * already sold on getting the work off their plate; the same offer-tier logic
 * applies — a ten-document sample is a smaller ask than the vendor shortlist.
 */
const OUTSOURCING_COMPARISON_RE = /outsourc(?:ing|ed)[- ].{0,40}\bvs\.?\b|\bvs\.?[- ].{0,40}outsourc|outsourcing[- ]alternative/i;

export function isOutsourcingComparisonPost(opts: { title?: string; slug?: string }): boolean {
  return OUTSOURCING_COMPARISON_RE.test(`${opts.title || ''} ${opts.slug || ''}`);
}

/**
 * Comparison / vendor-selection signals. `format: 'comparison'` and
 * `topic: 'build-vs-buy'` are set in Sanity and authoritative; the regex is the
 * fallback for the older imported corpus, which predates the taxonomy fields.
 */
const COMPARISON_RE =
  /\bvs\.?\b|\bversus\b|\balternatives?\b|\btop \d+\b|\btop (?:ai|n8n|automation|software|tools?|agenc|companies|platforms?|vendors?)|\brankings?\b|\bshortlist\b|\bbuild[ -]vs[ -]buy\b|\bhow to (?:choose|pick|select|evaluate)\b|\bchoosing\b|\bwhich .{0,40}\b(?:should|is best|to choose)\b|\bbest .{0,40}\b(?:agenc|vendor|platform|tool|software|compan|provider|partner)/i;

export function isComparisonPost(opts: { title?: string; slug?: string; format?: string; topic?: string }): boolean {
  if (opts.format === 'comparison') return true;
  if (opts.topic === 'build-vs-buy') return true;
  return COMPARISON_RE.test(`${opts.title || ''} ${opts.slug || ''}`);
}

/**
 * The single primary ask for a post. Comparison intent is checked BEFORE the
 * calculator: on a "best legal AI vendors" post the reader is comparing
 * suppliers, so the scope answer leads and the billing-leakage calculator
 * becomes the secondary, no-email option rather than a detour.
 */
export function articleCta(opts: {
  title?: string;
  category?: string;
  slug?: string;
  format?: string;
  topic?: string;
  industry?: string;
}): ArticleCtaPlan {
  const calc = relatedCalculator(opts);
  // Checked before comparison: agency-shopping and outsourcing-comparison are
  // both comparison intent at its most commercial, and earn the offer rather
  // than the scoping explainer.
  if (isAgencyShoppingPost(opts) || isOutsourcingComparisonPost(opts)) return { tier: 'offer' };
  if (isComparisonPost(opts)) return { tier: 'scope', calc };
  if (calc) return { tier: 'calculator', calc };
  return { tier: 'call' };
}
