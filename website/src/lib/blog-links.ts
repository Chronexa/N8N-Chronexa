import { services, useCasesByFunction, useCasesByIndustry } from './taxonomy';
import { CALCULATORS, type CalculatorDef } from '../components/calculators/registry';

/**
 * Maps a blog post to its 2-3 most relevant service/use-case pages, so every
 * post links "up" to a money page with keyword-rich anchor text (hub-and-spoke
 * internal linking). Topic match is keyword-based on title + category + slug.
 */
const ALL = [...services, ...useCasesByFunction, ...useCasesByIndustry];
const LABEL = new Map(ALL.map((i) => [i.slug, i.title || i.navLabel]));

// First match wins ordering; multiple rules can contribute (deduped, capped at 3).
const RULES: [RegExp, string[]][] = [
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

export function relatedServices(opts: { title?: string; category?: string; slug?: string }) {
  const hay = `${opts.title || ''} ${opts.category || ''} ${opts.slug || ''}`.toLowerCase();
  const picked: string[] = [];
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
