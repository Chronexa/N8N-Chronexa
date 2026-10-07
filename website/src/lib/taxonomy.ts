import { getService } from './services-content';

/**
 * Single source of truth for the Services vs Use-Cases information architecture
 * (mirrors automaly.io's two-axis model). Drives the mega-menu nav, the
 * /solutions and /use-cases hubs, the homepage, and the footer.
 * URLs stay flat (keyword-first); this only groups them.
 */
export type NavKind = 'service' | 'function' | 'industry' | 'geo' | 'integration';

/** `title`/`heroSub` are only needed for the rebuilt solution pages, which are
 *  bespoke compositions with no entry in the SERVICES data (there is nothing
 *  for `getService` to return). Everything else still reads from that data. */
type Meta = { kind: NavKind; navLabel: string; order: number; title?: string; heroSub?: string };

const CLASSIFY: Record<string, Meta> = {
  // Growth pages 2026-10-07: the AI-integration-partner positioning (lib/growth-pages.ts).
  'ai-automation-agency': { kind: 'service', navLabel: 'AI Automation Agency', order: -6, title: 'AI Automation Agency', heroSub: 'Your AI integration partner: free audit, first workflow free, live in a week.' },
  'ai-strategy-consulting': { kind: 'service', navLabel: 'AI Strategy Consulting', order: -5, title: 'AI Strategy Consulting', heroSub: 'An ROI-ranked AI roadmap, with the first item built free.' },
  'ai-knowledge-systems': { kind: 'service', navLabel: 'AI Knowledge Systems', order: -4, title: 'AI Knowledge Systems', heroSub: 'A company brain agents can read, so they act like your experienced staff.' },
  'ai-integration-services': { kind: 'service', navLabel: 'AI Integration Services', order: -3, title: 'AI Integration Services', heroSub: 'Connect every tool you already use, legacy systems included.' },
  'ai-agent-development': { kind: 'service', navLabel: 'AI Agent Development', order: -2, title: 'AI Agent Development', heroSub: 'Agents that research, draft, review and escalate what needs a person.' },
  'custom-mcp-server-development': { kind: 'integration', navLabel: 'Custom MCP Server Development', order: 30, title: 'Custom MCP Server Development', heroSub: 'Secure AI access to internal and legacy systems.' },
  'automated-reporting': { kind: 'integration', navLabel: 'Automated Reporting', order: 31, title: 'Automated Reporting', heroSub: 'Reports, decks and a daily briefing that write themselves.' },
  'ai-email-management': { kind: 'integration', navLabel: 'AI Email Management', order: 32, title: 'AI Email Management', heroSub: 'Inbox triage and drafted replies that know your clients.' },
  'ai-training-for-employees': { kind: 'integration', navLabel: 'AI Training for Employees', order: 33, title: 'AI Training for Employees', heroSub: 'Make your team AI-native on its own work.' },
  'tech-stack-migration': { kind: 'integration', navLabel: 'Tech Stack Migration', order: 34, title: 'Tech Stack & Data Migration', heroSub: 'A future-ready stack, only if it pays.' },
  'how-we-work': { kind: 'integration', navLabel: 'How We Work', order: 35, title: 'How We Work', heroSub: 'Free audit, first workflow free, ROI-priced builds.' },
  'ai-roi-calculator': { kind: 'integration', navLabel: 'AI ROI Calculator', order: 36, title: 'AI ROI Calculator', heroSub: 'Capacity and revenue per employee, with your numbers.' },
  'ai-automation-cost': { kind: 'integration', navLabel: 'AI Automation Cost', order: 37, title: 'What AI Automation Costs', heroSub: 'What drives the price, and why the first step is free.' },
  'what-is-ai-automation': { kind: 'integration', navLabel: 'What Is AI Automation', order: 38, title: 'What Is AI Automation', heroSub: 'A plain-English guide with business examples.' },

  // Primary solutions. Order is the nav order.
  'ai-automation': {
    kind: 'service', navLabel: 'AI Workflow Automation', order: 1,
    title: 'AI Workflow Automation',
    heroSub: 'A done-for-you system that completes one defined business workflow across the tools you already use.',
  },
  'ai-workspace-setup': {
    kind: 'service', navLabel: 'AI Workspace Setup', order: 2,
    title: 'AI Workspace Setup & Team Enablement',
    heroSub: 'Claude, Codex, company connectors, reusable skills and role-specific training delivered as one working environment.',
  },
  'business-process-automation-consulting': { kind: 'service', navLabel: 'Business Process Automation', order: 3 },
  'document-processing-automation': { kind: 'service', navLabel: 'Document Data Extraction', order: 3 },
  'ai-sales-outreach-engine': { kind: 'service', navLabel: 'AI Sales & Outreach Engine', order: 5 },
  'crm-automation-services': { kind: 'service', navLabel: 'CRM Automation', order: 6 },
  'customer-support-automation': { kind: 'service', navLabel: 'Customer Support Automation', order: 7 },

  // Vertical solution pages added 2026-09-14. Bespoke pages with no SERVICES
  // entry, so they carry their own nav title and sub here.
  'cpa-accounting-automation': {
    kind: 'service', navLabel: 'CPA & Accounting Automation', order: 13,
    title: 'CPA & Accounting Firm Automation',
    heroSub: 'Engagement-driven document collection, missing-document detection and practice-system integration.',
  },
  'legal-ai-automation': {
    kind: 'service', navLabel: 'Legal AI & Automation', order: 14,
    title: 'Legal AI & Automation for Law Firms',
    heroSub: 'Secure AI inside your own tenant, inheriting the matter permissions you already enforce.',
  },
  'investment-research-automation': {
    kind: 'service', navLabel: 'Investment Research Automation', order: 15,
    title: 'Investment Research & Portfolio Data Automation',
    heroSub: 'Portfolio consolidation, screening and risk monitoring built on evidence you can reproduce.',
  },
  'industrial-data-predictive-maintenance': {
    kind: 'service', navLabel: 'Industrial Data & Predictive Maintenance', order: 16,
    title: 'Industrial Data & Predictive Maintenance Systems',
    heroSub: 'Asset context, condition monitoring and maintenance actions built across the industrial data chain.',
  },

  // Use cases — by function (a department inside any company)
  'finance-automation': { kind: 'function', navLabel: 'Finance', order: 1 },
  'operations-automation': { kind: 'function', navLabel: 'Operations', order: 2 },
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
      return {
        slug,
        navLabel: m.navLabel,
        title: m.title ?? s?.serviceName ?? m.navLabel,
        heroSub: m.heroSub ?? s?.heroSub ?? '',
      };
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
