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
  [/dubai|\buae\b|emirates|abu dhabi|\bgcc\b|middle east/i, ['ai-automation-agency-dubai']],
  [/invoice|billing|reconcil|accounts payable|accounts receivable|\bap\b|\bar\b|expense|month-?end|close|ledger|bookkeep/i, ['finance-automation', 'document-processing-automation']],
  [/\btax\b|cpa|accounting|\b1099\b|w-?2/i, ['cpa-tax-document-automation', 'finance-automation']],
  [/legal|law firm|contract|due diligence|clause|litigation|matter intake|imanage|netdocuments/i, ['legal-due-diligence-automation', 'document-processing-automation']],
  [/\bria\b|wealth|advisor|fiduciary|custody|adv form|portfolio.*(report|monitor)|registered investment/i, ['financial-services-automation', 'document-processing-automation']],
  [/insurance|claim|underwrit|fnol|subrogation|guidewire/i, ['insurance-claims-triage-automation', 'document-processing-automation']],
  [/\bvc\b|private equity|\bpe\b|venture|deal flow|pitch deck|affinity|portfolio compan/i, ['vc-pe-crm-automation', 'sales-revenue-automation']],
  [/hoa|reserve study|property manage|real estate|kvcore/i, ['property-management-automation']],
  [/pharma|life scien|clinical|biotech|regulatory (doc|submission)/i, ['pharma-life-sciences-automation', 'document-processing-automation']],
  [/d2c|e-?commerce|shopify|cart|inventory|stockout|retention|amazon|woocommerce/i, ['d2c-ecommerce-automation', 'marketing-automation']],
  [/customer support|help ?desk|ticket|\bcx\b|chatbot|customer service|customer quer/i, ['customer-support-automation']],
  [/\bhr\b|recruit|hiring|onboard|resume|talent|employee/i, ['hr-automation']],
  [/\blead\b|\bsdr\b|outbound|cold email|prospect|\bcrm\b|pipeline|revenue|\bsales\b|gtm|forecast/i, ['sales-revenue-automation']],
  [/marketing|\bseo\b|content (production|marketing)|newsletter|campaign|\bads?\b|social media/i, ['marketing-automation']],
  [/compliance|soc ?2|hipaa|\bkyc\b|\baml\b|\baudit\b|regulated/i, ['document-processing-automation', 'financial-services-automation']],
  [/document|\bocr\b|\bpdf\b|extraction|\bidp\b|unstructured|data entry/i, ['document-processing-automation']],
  [/integrat|\bapi\b|data layer|\betl\b|sync|warehouse|migrat/i, ['system-data-integration', 'n8n-automation-services']],
  [/n8n|zapier|workflow|\bagent|self-host|automation (platform|tool)|orchestrat/i, ['n8n-automation-services', 'system-data-integration']],
  [/readiness|assessment|audit your|where to start|roadmap/i, ['ai-readiness-assessment']],
];

const FALLBACK = ['n8n-automation-services', 'document-processing-automation', 'sales-revenue-automation'];

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
  'sales-revenue': 'sales-revenue-automation',
};

/** The pillar page for a post's industry, if it has one. */
export function pillarFor(industry?: string): { slug: string; label: string } | undefined {
  const slug = industry ? PILLAR_BY_INDUSTRY[industry] : undefined;
  return slug ? { slug, label: LABEL.get(slug) || slug } : undefined;
}

export function relatedServices(opts: { title?: string; category?: string; slug?: string; industry?: string }) {
  const hay = `${opts.title || ''} ${opts.category || ''} ${opts.slug || ''}`.toLowerCase();
  const picked: string[] = [];
  // Pillar first — it is the guaranteed link, not a keyword coincidence.
  const pillar = PILLAR_BY_INDUSTRY[opts.industry || ''];
  if (pillar) picked.push(pillar);
  for (const [re, slugs] of RULES) {
    if (re.test(hay)) for (const s of slugs) if (!picked.includes(s)) picked.push(s);
  }
  for (const s of FALLBACK) { if (picked.length >= 3) break; if (!picked.includes(s)) picked.push(s); }
  return picked.slice(0, 3).map((slug) => ({ slug, label: LABEL.get(slug) || slug }));
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

export function relatedCalculator(opts: { title?: string; category?: string; slug?: string }): CalculatorDef | undefined {
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
  | { tier: 'scope'; calc?: CalculatorDef }
  | { tier: 'calculator'; calc: CalculatorDef }
  | { tier: 'call' };

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
}): ArticleCtaPlan {
  const calc = relatedCalculator(opts);
  if (isComparisonPost(opts)) return { tier: 'scope', calc };
  if (calc) return { tier: 'calculator', calc };
  return { tier: 'call' };
}
