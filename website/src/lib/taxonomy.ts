import { getService } from './services-content';

/**
 * Single source of truth for the Services vs Use-Cases information architecture
 * (mirrors automaly.io's two-axis model). Drives the mega-menu nav, the
 * /solutions and /use-cases hubs, the homepage, and the footer.
 * URLs stay flat (keyword-first); this only groups them.
 */
export type NavKind = 'service' | 'function' | 'industry' | 'geo' | 'integration';

type Meta = { kind: NavKind; navLabel: string; order: number };

const CLASSIFY: Record<string, Meta> = {
  // Services — capabilities (what we build). Signature capabilities first, then foundational/parity.
  'agentic-ai-systems': { kind: 'service', navLabel: 'Agentic AI Systems', order: 1 },
  'rag-knowledge-engines': { kind: 'service', navLabel: 'RAG & Knowledge Engines', order: 2 },
  'document-processing-automation': { kind: 'service', navLabel: 'Document Intelligence', order: 3 },
  'secure-ai-deployment': { kind: 'service', navLabel: 'Secure & Compliant AI Deployment', order: 4 },
  'applied-ml-data-science': { kind: 'service', navLabel: 'Applied ML & Data Science', order: 5 },
  'system-data-integration': { kind: 'service', navLabel: 'System & Data Integration', order: 6 },
  'n8n-automation-services': { kind: 'service', navLabel: 'Workflow Automation (n8n)', order: 7 },
  'ai-readiness-assessment': { kind: 'service', navLabel: 'AI Readiness Assessment', order: 8 },
  'ai-growth-systems-for-startups': { kind: 'service', navLabel: 'AI Growth Systems for Startups', order: 9 },

  // Use cases — by function (a department inside any company)
  'finance-automation': { kind: 'function', navLabel: 'Finance', order: 1 },
  'operations-automation': { kind: 'function', navLabel: 'Operations', order: 2 },
  'customer-support-automation': { kind: 'function', navLabel: 'Customer Support', order: 3 },
  'hr-automation': { kind: 'function', navLabel: 'HR & Recruitment', order: 4 },
  'sales-revenue-automation': { kind: 'function', navLabel: 'Sales & Revenue', order: 5 },
  'marketing-automation': { kind: 'function', navLabel: 'Marketing', order: 6 },
  'cybersecurity-automation': { kind: 'function', navLabel: 'Cybersecurity', order: 7 },

  // Use cases — by industry (the type of company we serve)
  'legal-due-diligence-automation': { kind: 'industry', navLabel: 'Legal & Law Firms', order: 1 },
  'cpa-tax-document-automation': { kind: 'industry', navLabel: 'Accounting & CPA Firms', order: 2 },
  'insurance-claims-triage-automation': { kind: 'industry', navLabel: 'Insurance', order: 3 },
  'financial-services-automation': { kind: 'industry', navLabel: 'Financial Services', order: 4 },
  'vc-pe-crm-automation': { kind: 'industry', navLabel: 'VC & Private Equity', order: 5 },
  'pharma-life-sciences-automation': { kind: 'industry', navLabel: 'Pharma & Life Sciences', order: 6 },
  // Demoted out of the menu (off the regulated-enterprise positioning) — pages kept live
  // (still routed + in sitemap), just not featured in nav/use-cases. Reversible.
  // 'property-management-automation' / 'd2c-ecommerce-automation' intentionally omitted.
  // Law-firm archetype pages ('ai-for-large/mid-size/small-law-firms') also intentionally
  // out of nav — reached via the legal pillar's related[] and the sitemap.

  // Geo
  'us-ai-automation-agency': { kind: 'geo', navLabel: 'US AI Automation Agency', order: 1 },
  'ai-automation-agency-dubai': { kind: 'geo', navLabel: 'AI Automation Agency Dubai', order: 2 },

  // Integrations — tool-specific landing pages (Layer-A "moat" keywords). Kept OUT of the
  // mega-nav and /solutions on purpose; reached via their parent pillar's related[], the
  // sitemap, and internal links. Grouped by the vertical they serve.
  // Legal
  'imanage-netdocuments-automation': { kind: 'integration', navLabel: 'iManage & NetDocuments Automation', order: 1 },
  'contract-review-automation-software': { kind: 'integration', navLabel: 'Contract Review Automation', order: 2 },
  'law-firm-matter-intake-automation': { kind: 'integration', navLabel: 'Matter Intake & Conflict-Check Automation', order: 3 },
  'regulatory-filing-monitoring-automation': { kind: 'integration', navLabel: 'Regulatory & SEC Filing Monitoring', order: 4 },
  'law-firm-automated-time-capture': { kind: 'integration', navLabel: 'Automated Time Capture & AI Billing', order: 16 },
  'relativity-document-review-automation': { kind: 'integration', navLabel: 'Relativity Review-to-Report Automation', order: 17 },
  'law-firm-knowledge-management-ai': { kind: 'integration', navLabel: 'AI Knowledge Management for Law Firms', order: 18 },
  // Tax / CPA
  'tax-software-ai-integration': { kind: 'integration', navLabel: 'Tax Software AI Integration', order: 5 },
  'k1-tax-form-ocr-extraction': { kind: 'integration', navLabel: 'K-1 Form OCR Extraction', order: 6 },
  'bookkeeping-automation-quickbooks-xero': { kind: 'integration', navLabel: 'Bookkeeping Automation (QuickBooks & Xero)', order: 7 },
  'safesend-karbon-workflow-automation': { kind: 'integration', navLabel: 'SafeSend & Karbon Workflow Automation', order: 8 },
  // Financial / Wealth-RIA
  'ria-crm-automation': { kind: 'integration', navLabel: 'RIA CRM Automation (Redtail & Wealthbox)', order: 9 },
  'ria-compliance-automation': { kind: 'integration', navLabel: 'RIA Compliance Automation', order: 10 },
  'ai-copilot-financial-advisors': { kind: 'integration', navLabel: 'AI Co-Pilot for Financial Advisors', order: 11 },
  // M&A / PE / IB
  'affinity-crm-automation': { kind: 'integration', navLabel: 'Affinity CRM Automation', order: 12 },
  'pitch-deck-parsing-software': { kind: 'integration', navLabel: 'Pitch Deck Parsing', order: 13 },
  'ai-term-sheet-analysis': { kind: 'integration', navLabel: 'AI Term Sheet Analysis', order: 14 },
  'portfolio-company-monitoring-automation': { kind: 'integration', navLabel: 'Portfolio Company Monitoring', order: 15 },
};

export type NavItem = { slug: string; navLabel: string; title: string; heroSub: string };

function group(kind: NavKind): NavItem[] {
  return Object.entries(CLASSIFY)
    .filter(([, m]) => m.kind === kind)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([slug, m]) => {
      const s = getService(slug);
      return { slug, navLabel: m.navLabel, title: s?.serviceName ?? m.navLabel, heroSub: s?.heroSub ?? '' };
    });
}

export const services = group('service');
export const useCasesByFunction = group('function');
export const useCasesByIndustry = group('industry');
export const geoPages = group('geo');

/** Category of a page, used to vary the hero pill + layout accent so pages don't all read identically. */
export function getKind(slug: string): NavKind | undefined {
  return CLASSIFY[slug]?.kind;
}

/** Short label shown as the hero eyebrow pill on a service/use-case page. */
export function getCategoryLabel(slug: string): string {
  const m = CLASSIFY[slug];
  if (!m) return 'Solution';
  if (m.kind === 'service') return 'Service';
  if (m.kind === 'function') return 'Use case · By function';
  if (m.kind === 'industry') return 'Use case · By industry';
  if (m.kind === 'integration') return 'Integration';
  return 'AI automation agency';
}
