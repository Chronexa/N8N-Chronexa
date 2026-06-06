import { getService } from './services-content';

/**
 * Single source of truth for the Services vs Use-Cases information architecture
 * (mirrors automaly.io's two-axis model). Drives the mega-menu nav, the
 * /solutions and /use-cases hubs, the homepage, and the footer.
 * URLs stay flat (keyword-first); this only groups them.
 */
export type NavKind = 'service' | 'function' | 'industry' | 'geo';

type Meta = { kind: NavKind; navLabel: string; order: number };

const CLASSIFY: Record<string, Meta> = {
  // Services — capabilities (what we build)
  'ai-readiness-assessment': { kind: 'service', navLabel: 'AI Readiness Assessment', order: 1 },
  'document-processing-automation': { kind: 'service', navLabel: 'Document Processing & Intelligence', order: 2 },
  'sales-revenue-automation': { kind: 'service', navLabel: 'Sales & Revenue Operations', order: 3 },
  'marketing-automation': { kind: 'service', navLabel: 'Marketing Automation', order: 4 },
  'system-data-integration': { kind: 'service', navLabel: 'System & Data Integration', order: 5 },
  'n8n-automation-services': { kind: 'service', navLabel: 'Custom AI Agents & n8n', order: 6 },

  // Use cases — by function (a department inside any company)
  'finance-automation': { kind: 'function', navLabel: 'Finance', order: 1 },
  'operations-automation': { kind: 'function', navLabel: 'Operations', order: 2 },
  'customer-support-automation': { kind: 'function', navLabel: 'Customer Support', order: 3 },
  'hr-automation': { kind: 'function', navLabel: 'HR & Recruitment', order: 4 },

  // Use cases — by industry (the type of company we serve)
  'legal-due-diligence-automation': { kind: 'industry', navLabel: 'Legal & Law Firms', order: 1 },
  'cpa-tax-document-automation': { kind: 'industry', navLabel: 'Accounting & CPA Firms', order: 2 },
  'insurance-claims-triage-automation': { kind: 'industry', navLabel: 'Insurance', order: 3 },
  'financial-services-automation': { kind: 'industry', navLabel: 'Financial Services', order: 4 },
  'vc-pe-crm-automation': { kind: 'industry', navLabel: 'VC & Private Equity', order: 5 },
  'property-management-automation': { kind: 'industry', navLabel: 'Property Management', order: 6 },
  'pharma-life-sciences-automation': { kind: 'industry', navLabel: 'Pharma & Life Sciences', order: 7 },
  'd2c-ecommerce-automation': { kind: 'industry', navLabel: 'D2C & E-commerce', order: 8 },

  // Geo
  'us-ai-automation-agency': { kind: 'geo', navLabel: 'US AI Automation Agency', order: 1 },
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
  return 'AI automation agency';
}
