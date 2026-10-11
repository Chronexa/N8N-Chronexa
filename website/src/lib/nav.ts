/**
 * Site information architecture (2026-10-07). One source for Nav and Footer.
 *
 * Standard enterprise pattern: Services · Industries · Work · Insights · About · CTA.
 * Rules: one page per offer (no duplicate CPA/legal pages, no redirecting URLs),
 * services grouped by what the buyer is trying to do, industries only where we
 * have a dedicated page. Replaces the old Services + Use Cases + AI Engines + Blog
 * menus (~40 links, several 308s).
 */

export type NavLink = { label: string; href: string; blurb?: string };
export type NavGroup = { head: string; links: NavLink[] };

export const SERVICE_GROUPS: NavGroup[] = [
  {
    head: 'AI & automation',
    links: [
      { label: 'AI strategy consulting', href: '/ai-strategy-consulting' },
      { label: 'AI workflow automation', href: '/ai-automation' },
      { label: 'AI agent development', href: '/ai-agent-development' },
      { label: 'AI integration services', href: '/ai-integration-services' },
      { label: 'AI voice agents', href: '/ai-voice-agent-development' },
    ],
  },
  {
    // The solution pages (2026-09-14 studio rebuild). Restored to the Services menu 2026-10-08.
    head: 'Business solutions',
    links: [
      { label: 'AI sales & outreach engine', href: '/ai-sales-outreach-engine' },
      { label: 'Document data extraction', href: '/document-processing-automation' },
      { label: 'AI knowledge systems', href: '/ai-knowledge-systems' },
      { label: 'Business process automation', href: '/business-process-automation-consulting' },
      { label: 'CRM automation', href: '/crm-automation-services' },
      { label: 'Customer support automation', href: '/customer-support-automation' },
      { label: 'CPA & accounting automation', href: '/cpa-accounting-automation' },
      { label: 'Legal AI & automation', href: '/legal-ai-automation' },
      { label: 'Investment research automation', href: '/investment-research-automation' },
      { label: 'Industrial data & predictive maintenance', href: '/industrial-data-predictive-maintenance' },
      { label: 'Automated reporting', href: '/automated-reporting' },
    ],
  },
  {
    head: 'Engineering & teams',
    links: [
      { label: 'Custom software & SaaS', href: '/custom-software-development' },
      { label: 'UX & product design', href: '/ui-ux-design-services' },
      { label: 'E-commerce & D2C brands', href: '/ecommerce-development' },
      { label: 'Shopify SEO services', href: '/shopify-seo-services' },
      { label: 'Tech stack migration', href: '/tech-stack-migration' },
      { label: 'Dedicated AI engineers', href: '/dedicated-ai-engineers' },
      { label: 'AI training for employees', href: '/ai-training-for-employees' },
      { label: 'AI workspace setup', href: '/ai-workspace-setup' },
      { label: 'Custom MCP servers', href: '/custom-mcp-server-development' },
    ],
  },
];

export const INDUSTRY_GROUPS: NavGroup[] = [
  {
    head: 'Professional services',
    links: [
      { label: 'Law firms', href: '/legal-ai-automation' },
      { label: 'Accounting & CPA firms', href: '/cpa-accounting-automation' },
      { label: 'Insurance', href: '/insurance-claims-triage-automation' },
    ],
  },
  {
    head: 'Finance',
    links: [
      { label: 'Financial services & fintech', href: '/financial-services-automation' },
      { label: 'Investment research', href: '/investment-research-automation' },
      { label: 'VC & private equity', href: '/vc-pe-crm-automation' },
    ],
  },
  {
    head: 'Commerce & operations',
    links: [
      { label: 'E-commerce & D2C', href: '/d2c-ecommerce-automation' },
      { label: 'Property management', href: '/property-management-automation' },
      { label: 'Industrial & manufacturing', href: '/industrial-data-predictive-maintenance' },
    ],
  },
];

export const WORK_LINKS: NavLink[] = [
  { label: 'Case studies', href: '/case-studies', blurb: 'Client deployments and the systems we run ourselves' },
  { label: 'Workflow portfolio', href: '/n8n-portfolio', blurb: 'Real n8n workflows, open on the canvas' },
  { label: 'AI engines', href: '/ai-engines', blurb: 'Interactive demos of six production systems' },
  { label: 'Stores we built', href: '/ecommerce-development', blurb: 'LUMIQ, VITALEDGE and Loom & Little, live' },
];

export const INSIGHT_GROUPS: NavGroup[] = [
  {
    head: 'Start here',
    links: [
      { label: 'How we work', href: '/how-we-work' },
      { label: 'Delivery & security', href: '/delivery-and-security' },
      { label: 'What is AI automation?', href: '/what-is-ai-automation' },
      { label: 'What AI automation costs', href: '/ai-automation-cost' },
      { label: 'What a Shopify store costs', href: '/custom-shopify-store-cost' },
    ],
  },
  {
    head: 'Free tools',
    links: [
      { label: 'AI ROI calculator', href: '/ai-roi-calculator' },
      { label: 'Document cost calculator', href: '/document-processing-cost-calculator' },
      { label: 'All free tools', href: '/tools' },
    ],
  },
];

/** Shown as the right-hand feature column of the Services menu, and reused in the footer. */
export const AUDIT_OFFER = {
  head: 'Free AI audit',
  title: 'Not sure where to start?',
  body: 'We map how your team works and find the one workflow worth automating first. The audit and first workflow are free, with the scope agreed before we build.',
  cta: 'Book a free AI audit',
};
