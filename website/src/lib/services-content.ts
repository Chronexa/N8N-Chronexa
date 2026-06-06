/**
 * Content for Chronexa's commercial service / landing pages.
 * Flat keyword-first slugs (SEO decision D-003). Old /services/* paths
 * 301-redirect here. Each entry drives metadata, Service + FAQPage +
 * BreadcrumbList JSON-LD, and a SOTA commercial-page layout (ServiceArticle).
 *
 * ROI values are tied to verified case-study numbers or factual capabilities —
 * not invented percentages.
 */
export type ServiceFaq = { q: string; a: string };

export type ServiceContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSub: string;
  /** AEO answer-first lead — 1–2 sentences that directly answer the page's core question. */
  answer: string;
  serviceName: string;
  serviceType: string;
  schemaDescription: string;
  /** Outcome metrics shown in the ROI strip. */
  roi: { value: string; label: string }[];
  /** Optional accent "breaking point" callout rendered inside the body — adds shape variety between pages. */
  callout?: string;
  /** Body sections: heading + paragraphs. */
  sections: { heading: string; level: 2 | 3; body: string[] }[];
  /** How it works — 3–4 steps. */
  process: { title: string; body: string }[];
  /** Example automation workflows (automaly-style "what we'd build for you"). */
  workflows?: string[];
  /** Why a custom build beats off-the-shelf SaaS for this use case. */
  whyCustom: string[];
  included: string[];
  faqs: ServiceFaq[];
  /** Linked case study for proof (optional). */
  proof?: { slug: string; label: string };
  /** Related service slugs to cross-link. */
  related: string[];
};

const GUARANTEE =
  'Every engagement is fixed-price with ROI targets agreed up front, backed by our 90-day ROI guarantee.';

export const SERVICES: ServiceContent[] = [
  {
    slug: 'legal-due-diligence-automation',
    metaTitle: 'Legal Due Diligence Automation & iManage Workflow | Chronexa',
    metaDescription:
      'Integrate iManage and NetDocuments with custom AI workflows to automate due diligence, contract review, and matter intake for top-tier law firms.',
    h1: 'Legal Due Diligence Automation & iManage Workflow Integration',
    heroSub:
      'Integrate iManage and NetDocuments with custom AI workflows to automate due diligence, contract review, and matter intake — without disrupting your security protocols.',
    answer:
      'Legal due diligence automation uses AI (OCR + LLM extraction) to read contracts and filings, flag risk, and write structured data straight back into iManage or NetDocuments — so associates stop doing manual review and your firm reviews more matters in less time.',
    callout:
      'What works at 20 matters breaks at 200. When associates do manual review, the firm reviews fewer matters, risk clauses slip through, and realization rates fall. Automation is how you scale review capacity without scaling headcount.',
    serviceName: 'Legal Due Diligence Automation',
    serviceType: 'Legal document processing automation',
    schemaDescription:
      'Custom AI workflows for legal due diligence, contract review, and matter intake integrated with iManage and NetDocuments.',
    roi: [
      { value: 'iManage', label: 'Built on your existing DMS — no rip-and-replace' },
      { value: '100%', label: 'Audit-trail coverage on every extracted document' },
      { value: 'Days→hours', label: 'Faster matter intake & due diligence cycles' },
    ],
    sections: [
      {
        heading: 'Integrating legacy legal tech with AI',
        level: 2,
        body: [
          "Off-the-shelf software doesn't work for top-tier law firms. You need iManage workflow automation that respects your strict security protocols while eliminating manual data entry. We specialize in connecting rigid document management systems to advanced AI pipelines — inside the environment you already control.",
        ],
      },
      {
        heading: 'Automating due diligence & contract review',
        level: 3,
        body: [
          'Manual contract review and regulatory tracking is a massive drain on your associates. We deploy OCR and custom LLM extraction models that automatically parse contracts, flag risk and liabilities, tag metadata, and sync the structured data directly back to NetDocuments or iManage — with a full audit trail on every action.',
        ],
      },
    ],
    process: [
      { title: 'Discovery & security scoping', body: 'We map your matter-intake and review workflow and align to your DMS security model before any build.' },
      { title: 'Build on your DMS', body: 'We connect AI extraction to iManage/NetDocuments and configure risk-flagging rules to your practice areas.' },
      { title: 'Test against real matters', body: 'We validate accuracy on real documents with human-in-the-loop review for low-confidence items.' },
      { title: 'Deploy & monitor', body: 'Go live with audit trails, access controls, and ongoing accuracy monitoring.' },
    ],
    whyCustom: [
      'Runs inside your environment — client data never leaves systems you control.',
      'Built on iManage/NetDocuments instead of forcing a new platform on your associates.',
      'Risk rules tuned to your practice areas, not a generic SaaS template.',
    ],
    included: [
      'iManage & NetDocuments integration',
      'AI contract review & clause extraction',
      'Risk & liability flagging',
      'Automated matter intake workflows',
      'Metadata tagging & search',
      'Audit trails & access controls',
      'Regulatory change monitoring',
    ],
    faqs: [
      { q: 'Does this work with our existing iManage or NetDocuments setup?', a: 'Yes. We build directly on top of your current document management system rather than replacing it — your security model, folder structure, and access controls stay intact.' },
      { q: 'How do you handle confidentiality and data security?', a: 'Workflows run inside your environment with role-based access, full audit trails, and no client data leaving systems you control. We scope security requirements before any build begins.' },
      { q: 'How accurate is the AI extraction for legal documents?', a: 'We pair OCR/LLM extraction with validation rules and human-in-the-loop review for low-confidence items, so accuracy improves over time without sacrificing control.' },
      { q: 'How long does a legal automation build take?', a: 'Most engagements go live in 4–6 weeks: week 1 discovery and mapping, weeks 2–3 build and integration, week 4 testing against real matters before go-live.' },
      { q: 'Can it monitor regulatory changes too?', a: 'Yes. We build pipelines that watch regulatory sources and surface relevant changes into your workflow, so compliance tracking stops being a manual chore.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-leading-law-firm-automated-regulatory-intelligence', label: 'How a leading corporate law firm automated regulatory intelligence with AI' },
    related: ['cpa-tax-document-automation', 'insurance-claims-triage-automation', 'n8n-automation-services'],
  },
  {
    slug: 'insurance-claims-triage-automation',
    metaTitle: 'Automated Insurance Claims Triage & FNOL Processing | Chronexa',
    metaDescription:
      'Automate First Notice of Loss (FNOL) intake, claims triage, and subrogation detection inside Guidewire and Duck Creek with custom AI workflows.',
    h1: 'Automated Insurance Claims Triage & FNOL Processing',
    heroSub:
      'Automate First Notice of Loss (FNOL) intake, claims triage, and subrogation detection inside Guidewire and Duck Creek.',
    answer:
      'Automated claims triage uses AI to read FNOL documents — police reports, medical bills, photos — the moment a claim arrives, classify severity, route it, and flag subrogation, directly on top of Guidewire or Duck Creek. Faster, more consistent triage means a better loss ratio without adding adjusters.',
    callout:
      'Manual FNOL intake and triage cap how fast claims can move. As volume rises, cycle times stretch, leakage grows, and adjusters spend their day sorting and re-keying instead of resolving claims.',
    serviceName: 'Insurance Claims Triage Automation',
    serviceType: 'Insurance claims processing automation',
    schemaDescription:
      'Automated FNOL intake, real-time claims triage, and subrogation detection built on Guidewire ClaimCenter and Duck Creek.',
    roi: [
      { value: 'Real-time', label: 'FNOL intake & triage the moment a claim lands' },
      { value: 'Guidewire', label: 'Built on ClaimCenter / Duck Creek — no replacement' },
      { value: '↑ Recovery', label: 'Surfaces subrogation opportunities humans miss' },
    ],
    sections: [
      {
        heading: 'Accelerating First Notice of Loss (FNOL)',
        level: 2,
        body: [
          'The speed at which you process an FNOL dictates your loss ratio. We build custom infrastructure to completely automate FNOL intake. Using AI document extraction, our systems parse police reports, medical bills, and photos to perform automated claims triage in real time — routing each claim to the right path instantly.',
        ],
      },
      {
        heading: 'Subrogation detection & enterprise integration',
        level: 3,
        body: [
          "Identifying subrogation opportunities manually leaves money on the table. Our pipelines scan unstructured claim data to surface subrogation automatically. And we don't force you into new software — we build these workflows directly on top of legacy systems like Guidewire ClaimCenter and Duck Creek.",
        ],
      },
    ],
    process: [
      { title: 'Map your claims flow', body: 'We document FNOL intake, triage rules, and routing across your lines of business.' },
      { title: 'Build on your core system', body: 'We layer AI extraction and triage onto Guidewire/Duck Creek without disrupting adjusters.' },
      { title: 'Tune & validate', body: 'We test against real claims and tune classification and subrogation rules to your data.' },
      { title: 'Deploy & measure', body: 'Go live and track FNOL cycle time, touchless triage rate, and recovered subrogation.' },
    ],
    whyCustom: [
      'Layers onto Guidewire/Duck Creek — adjusters keep their existing tools.',
      'Triage rules tuned to your lines of business, not a generic engine.',
      'Reads the messy real-world docs (police reports, photos) off-the-shelf tools choke on.',
    ],
    included: [
      'Automated FNOL intake & parsing',
      'Real-time claims triage & routing',
      'Police report, medical bill & photo extraction',
      'Subrogation opportunity detection',
      'Guidewire ClaimCenter & Duck Creek integration',
      'Loss-ratio & cycle-time reporting',
    ],
    faqs: [
      { q: 'Do we have to replace Guidewire or Duck Creek?', a: 'No. We build automation layers on top of your existing core systems, so your adjusters keep working in the tools they know.' },
      { q: 'What documents can the triage system read?', a: 'Police reports, medical bills, estimates, and claim photos — structured and unstructured. We tune extraction to your specific lines of business.' },
      { q: 'How is ROI measured for claims automation?', a: 'We track FNOL cycle time, touchless triage rate, and recovered subrogation dollars, and report against the targets agreed before the build.' },
      { q: 'How accurate is automated triage?', a: 'Triage runs against rules we tune to your historical claims, with human review for edge cases — accuracy improves as the system sees more of your data.' },
      { q: 'How long does it take to deploy?', a: 'Most builds go live in 4–6 weeks, depending on the number of lines of business and integration points.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['legal-due-diligence-automation', 'property-management-automation', 'n8n-automation-services'],
  },
  {
    slug: 'cpa-tax-document-automation',
    metaTitle: 'CPA Workflow Automation & Tax Document Extraction | Chronexa',
    metaDescription:
      'Automate tax document ingestion, OCR extraction, and QuickBooks/Xero reconciliation workflows for CPA firms — scale tax season without adding headcount.',
    h1: 'CPA Workflow Automation & Tax Document Extraction',
    heroSub:
      'Automate tax document ingestion, OCR extraction, and QuickBooks reconciliation workflows for CPA firms — so accountants stop doing data entry.',
    answer:
      'CPA workflow automation uses OCR and AI to ingest tax documents, categorize expenses, and reconcile statements in QuickBooks or Xero automatically — letting a firm process far more returns in tax season without hiring more preparers.',
    callout:
      'What works at 200 returns breaks at 2,000. In peak season, manual data entry caps how many clients a firm can serve — and burns out preparers on work that should be review and advisory, not typing.',
    serviceName: 'CPA Workflow Automation',
    serviceType: 'Accounting & tax document automation',
    schemaDescription:
      'Tax document ingestion, OCR extraction, and QuickBooks/Xero reconciliation automation for CPA firms.',
    roi: [
      { value: '10x', label: 'Throughput in tax season without adding headcount' },
      { value: 'Hubdoc→QBO', label: 'Receipts to reconciled books, hands-off' },
      { value: 'Audit-ready', label: 'Full logging on every document processed' },
    ],
    sections: [
      {
        heading: 'Eliminate manual data entry during tax season',
        level: 2,
        body: [
          'When you are processing thousands of returns, manual data entry is your biggest liability. As a specialized CPA workflow automation consultant, we build bespoke systems that use OCR to automate the intake of complex tax documents — so your preparers spend time on review and advisory, not typing.',
        ],
      },
      {
        heading: 'Hubdoc to QuickBooks automation workflow',
        level: 3,
        body: [
          'Stop paying accountants to act as data-entry clerks. We engineer seamless Hubdoc-to-QuickBooks automation workflows that automatically ingest receipts, categorize expenses using AI, and reconcile bank statements in Xero or QBO without human intervention.',
        ],
      },
    ],
    process: [
      { title: 'Map your tax workflow', body: 'We document how documents arrive, get categorized, and flow into your accounting stack.' },
      { title: 'Build the ingestion pipeline', body: 'OCR + AI categorization wired into QuickBooks/Xero with review queues for exceptions.' },
      { title: 'Validate on real returns', body: 'We test against your actual documents and tune until accuracy meets your bar.' },
      { title: 'Deploy for the season', body: 'Go live with audit-ready logging and capacity to handle peak volume.' },
    ],
    whyCustom: [
      'Connects the specific stack your firm runs (Hubdoc, QBO, Xero, portals).',
      'Human-in-the-loop review keeps accuracy high where it matters.',
      'Scales for tax-season peaks — the exact moment manual entry breaks down.',
    ],
    included: [
      'OCR tax document ingestion',
      'AI expense categorization',
      'Hubdoc → QuickBooks / Xero sync',
      'Automated bank reconciliation',
      'Exception handling & review queues',
      'Audit-ready logging',
    ],
    faqs: [
      { q: 'Which accounting systems do you integrate with?', a: 'QuickBooks Online, Xero, and Hubdoc are the most common, plus document portals and practice-management tools. If your firm relies on a specific platform, we can almost always connect it.' },
      { q: 'Is the extraction accurate enough for tax work?', a: 'We pair OCR with validation rules and human-in-the-loop review for low-confidence items, so accuracy improves over time without sacrificing control.' },
      { q: 'Can this handle the volume of tax season?', a: 'Yes — the workflows process thousands of documents in parallel, which is exactly when manual entry becomes the bottleneck.' },
      { q: 'Do our accountants need to learn new software?', a: 'No. The automation runs behind the tools they already use; your team focuses on review and advisory.' },
      { q: 'How long does it take to set up?', a: 'Most firms are live in 4–6 weeks, well ahead of peak season if you start early.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'ai-automation-tax-workflow-cpa-case-study', label: 'Scaling tax-season capacity without increasing headcount for a CPA firm' },
    related: ['legal-due-diligence-automation', 'vc-pe-crm-automation', 'n8n-automation-services'],
  },
  {
    slug: 'property-management-automation',
    metaTitle: 'Property Management Workflow Automation | Chronexa',
    metaDescription:
      'Compress 6-hour manual reporting into 11 minutes with custom n8n property management workflow automation, reserve study generation, and kvCORE lead nurturing.',
    h1: 'Property Management Workflow Automation & Automated Reserve Studies',
    heroSub:
      'Compress 6-hour manual reporting into 11 minutes with custom n8n workflows for property management and reserve studies.',
    answer:
      'Property management automation replaces manual reserve study reporting and lead handling with custom n8n workflows — generating audit-ready reports in minutes instead of hours and nurturing leads automatically in kvCORE and Follow Up Boss.',
    serviceName: 'Property Management Workflow Automation',
    serviceType: 'Property management workflow automation',
    schemaDescription:
      'Automated reserve study reporting, lead nurturing, and CRM integration for property managers and brokerages.',
    roi: [
      { value: '6 hrs → 11 min', label: 'Per reserve study report' },
      { value: '85%', label: 'Reduction in time spent per report' },
      { value: '1200+', label: 'Reports processed annually' },
    ],
    sections: [
      {
        heading: 'The end of manual reserve study reporting',
        level: 2,
        body: [
          'If your analysts are spending 6+ hours manually pulling data to generate reserve study reports, you are leaking massive operational capital. By implementing property management workflow automation, we compress that 6-hour reporting cycle down to just 11 minutes.',
          'Our custom workflows integrate directly into your existing infrastructure, automating the extraction of maintenance data, financial forecasting, and compliance requirements to instantly generate audit-ready reserve studies.',
        ],
      },
      {
        heading: 'Automated lead nurturing & CRM integration',
        level: 3,
        body: [
          "We don't just stop at reporting. For high-volume brokerages and property managers, we deploy kvCORE lead nurturing automation and Follow Up Boss integrations that categorize incoming leads, deploy voice AI for initial contact, and sync to your CRM without lifting a finger.",
        ],
      },
    ],
    process: [
      { title: 'Map the reporting cycle', body: 'We document every data source and step that goes into a reserve study or lead handoff today.' },
      { title: 'Build the automation', body: 'Custom n8n workflows extract data, run forecasts, and generate audit-ready reports / nurture leads.' },
      { title: 'Validate output', body: 'We confirm reports match your standards and CRM sync is clean before go-live.' },
      { title: 'Deploy & support', body: 'Go live and keep optimizing as volume grows.' },
    ],
    whyCustom: [
      'Built on n8n — you own the workflows, with no per-report SaaS fees.',
      'Integrates kvCORE and Follow Up Boss, the tools brokerages actually run.',
      'Audit-ready output tuned to your reporting standards, not a template.',
    ],
    included: [
      'Automated reserve study generation',
      'Maintenance & financial data extraction',
      'Compliance-ready report templates',
      'kvCORE lead nurturing automation',
      'Follow Up Boss CRM integration',
      'Voice AI for first contact',
    ],
    faqs: [
      { q: 'How much faster is automated reserve study reporting?', a: 'Clients typically go from a 6+ hour manual cycle to roughly 11 minutes per report, with audit-ready output generated directly from your data sources.' },
      { q: 'Do you integrate with kvCORE and Follow Up Boss?', a: 'Yes. We automate lead capture, categorization, and nurturing inside the CRMs you already use, including voice AI for initial outreach.' },
      { q: 'Is this a product we buy, or a custom build?', a: "It's a custom build on your stack. You own the workflows — there's no new subscription seat your whole team has to learn." },
      { q: 'Will the reports meet our compliance standards?', a: 'We build report templates to your exact standards and validate output against real studies before go-live.' },
      { q: 'How long does it take?', a: 'Most builds go live in 4–6 weeks depending on the number of data sources and integrations.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-reservestudy-automated-report-production-with-ai', label: 'How ReserveStudy.com cut report creation time from days to minutes' },
    related: ['vc-pe-crm-automation', 'insurance-claims-triage-automation', 'n8n-automation-services'],
  },
  {
    slug: 'vc-pe-crm-automation',
    metaTitle: 'Affinity CRM Workflow Automation for VC & PE | Chronexa',
    metaDescription:
      'Automate portfolio monitoring and pitch deck parsing directly within Affinity CRM for venture capital and private equity firms with custom AI workflows.',
    h1: 'Affinity CRM Workflow Automation & Deal Flow Parsing',
    heroSub:
      'Automate portfolio monitoring and pitch deck parsing directly within Affinity CRM for venture capital and private equity firms.',
    answer:
      'VC/PE CRM automation watches your firm’s inbox, detects incoming pitch decks, extracts the key financials and founder data with AI, and writes them straight into Affinity — and keeps monitoring your portfolio automatically, so analysts stop doing data entry and never miss a signal.',
    serviceName: 'VC & PE CRM Deal Flow Automation',
    serviceType: 'CRM & deal flow automation',
    schemaDescription:
      'Portfolio monitoring, pitch deck parsing, and deal-flow automation built inside Affinity CRM for VC and PE firms.',
    roi: [
      { value: 'Affinity', label: 'Built inside the CRM your firm already runs' },
      { value: '0 manual entry', label: 'Pitch decks parsed into structured CRM fields' },
      { value: '24/7', label: 'Automated portfolio monitoring & signals' },
    ],
    sections: [
      {
        heading: 'Mastering deal flow with Affinity CRM',
        level: 2,
        body: [
          "If your analysts are manually entering founder data and funding histories into your CRM, you are losing speed to execution. We engineer high-end Affinity CRM workflow automation that monitors your firm's inbox, automatically identifies incoming pitch decks, and extracts the core financial metrics into structured CRM fields.",
        ],
      },
      {
        heading: 'Automating portfolio company monitoring',
        level: 3,
        body: [
          "Monitoring your investments shouldn't require manual web scraping. We build custom systems to automate portfolio company monitoring for VC and PE firms — automatically updating Affinity with news mentions, competitor movements, and executive hires related to your portfolio.",
        ],
      },
    ],
    process: [
      { title: 'Map your deal flow', body: 'We document how decks arrive, what data matters, and how your CRM is structured.' },
      { title: 'Build inbox → CRM automation', body: 'AI detects decks, extracts metrics and founder data, and writes to Affinity automatically.' },
      { title: 'Add portfolio monitoring', body: 'We wire up news, hiring, and competitor signal tracking for your portfolio companies.' },
      { title: 'Deploy & refine', body: 'Go live with alerts and analytics, refining extraction to your fields.' },
    ],
    whyCustom: [
      'Built inside Affinity (or your CRM) — analysts keep one source of truth.',
      'Extraction tuned to the metrics your firm actually tracks.',
      'Monitoring covers your specific portfolio, not a generic news feed.',
    ],
    included: [
      'Inbox monitoring & pitch deck detection',
      'AI extraction of financials & founder data',
      'Structured write-back to Affinity CRM',
      'Automated portfolio company monitoring',
      'News, hiring & competitor signal tracking',
      'Deal-flow analytics & alerts',
    ],
    faqs: [
      { q: 'Does this only work with Affinity CRM?', a: 'Affinity is our most common deployment, but the same deal-flow automation patterns apply to other VC/PE CRMs. We integrate with what your firm already runs on.' },
      { q: 'How are pitch decks parsed into the CRM?', a: 'Incoming decks are detected from your inbox, key metrics and founder details are extracted with AI, and the structured data is written straight into the right CRM fields.' },
      { q: 'Can it monitor our existing portfolio automatically?', a: 'Yes. We track news, executive hires, and competitor moves for your portfolio companies and push updates into the CRM so nothing is missed.' },
      { q: 'Is our deal data kept private?', a: 'Yes — workflows run in your environment with access controls; sensitive deal data stays in systems you control.' },
      { q: 'How long does it take to deploy?', a: 'Most builds go live in 4–6 weeks depending on integrations and the depth of monitoring.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'ai-outbound-sales-automation-personalisation-case-study', label: 'Scaling a personalized outbound pipeline without increasing sales headcount' },
    related: ['cpa-tax-document-automation', 'legal-due-diligence-automation', 'n8n-automation-services'],
  },
  {
    slug: 'marketing-automation',
    metaTitle: 'AI Marketing Automation Agency & Services | Chronexa',
    metaDescription:
      'Custom AI marketing automation — multi-channel campaigns, content, ad optimization, and reporting orchestrated across your stack. Built for B2B growth teams.',
    h1: 'AI Marketing Automation Services',
    heroSub:
      'Run multi-channel campaigns, content, and reporting on autopilot — custom AI marketing automation built across the tools your team already uses.',
    answer:
      'AI marketing automation orchestrates your campaigns, content, ad spend, and reporting across channels automatically — so your team focuses on strategy while the busywork (scheduling, optimization, weekly reports) runs itself.',
    serviceName: 'AI Marketing Automation',
    serviceType: 'Marketing automation services',
    schemaDescription:
      'Custom AI marketing automation: multi-channel campaign orchestration, content distribution, ad optimization, CRM integration, and automated reporting for B2B teams.',
    roi: [
      { value: 'Multi-channel', label: 'Campaigns across email, ads, social & CRM in one system' },
      { value: 'Auto-reported', label: 'Weekly performance reports generated for you' },
      { value: 'Always-on', label: 'Continuous A/B testing & budget optimization' },
    ],
    sections: [
      {
        heading: 'Campaigns that run themselves',
        level: 2,
        body: [
          'Most marketing teams lose hours to scheduling posts, moving data between tools, and assembling reports. We build custom automation that orchestrates multi-channel campaigns end to end — content distribution, ad management, and CRM sync — so launches happen on time without manual hand-offs.',
        ],
      },
      {
        heading: 'Reporting & optimization without the busywork',
        level: 3,
        body: [
          'We wire your ad platforms, analytics, and CRM into one pipeline that optimizes budget allocation, runs A/B tests, and produces the weekly performance report automatically. Your team spends its time on strategy and creative, not copy-paste.',
        ],
      },
    ],
    process: [
      { title: 'Map your funnel & stack', body: 'We document your channels, tools, and reporting needs before any build.' },
      { title: 'Build the orchestration', body: 'Campaign, content, and ad workflows wired across your stack with CRM sync.' },
      { title: 'Add analytics & testing', body: 'Automated reporting, A/B tests, and budget optimization tuned to your KPIs.' },
      { title: 'Deploy & optimize', body: 'Go live with weekly reporting and ongoing tuning against your targets.' },
    ],
    whyCustom: [
      'Connects the exact channels and CRM you run — not a fixed SaaS template.',
      'Owns the boring parts (scheduling, reporting) so your team does strategy.',
      'Scales across channels without adding marketing-ops headcount.',
    ],
    included: [
      'Multi-channel campaign automation',
      'Content scheduling & distribution',
      'Ad optimization & budget allocation',
      'Real-time performance analytics',
      'CRM integration (HubSpot, Salesforce)',
      'A/B testing automation',
      'Automated weekly performance reports',
    ],
    faqs: [
      { q: 'Which marketing tools do you integrate with?', a: 'HubSpot, Salesforce, Mailchimp, Google Ads, LinkedIn Ads, and most major martech platforms. If your team relies on a specific tool, we can almost always connect it.' },
      { q: 'Do you replace our marketing team?', a: 'No — we remove the repetitive work (scheduling, data movement, reporting) so your team spends more time on strategy and creative.' },
      { q: 'Can you automate content production too?', a: 'Yes. We build AI-assisted content and distribution pipelines, with human review where it matters, so output scales without losing quality.' },
      { q: 'How do you measure marketing ROI?', a: 'We track the metrics you care about — pipeline, conversion, cost per lead — and surface them in automated weekly reports.' },
      { q: 'How long does it take to set up?', a: 'Most builds go live in 4–6 weeks depending on the number of channels and integrations.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-freshcart-boosted-lead-quality-with-ai-scoring', label: 'How FreshCart Foods boosted lead quality with AI scoring' },
    related: ['d2c-ecommerce-automation', 'vc-pe-crm-automation', 'n8n-automation-services'],
  },
  {
    slug: 'd2c-ecommerce-automation',
    metaTitle: 'D2C & E-commerce Automation Agency | Chronexa',
    metaDescription:
      'Scale D2C and e-commerce operations 10x without 10x headcount — order automation, real-time inventory sync, AI customer support, and personalization across Shopify, Amazon & more.',
    h1: 'D2C & E-commerce Automation',
    heroSub:
      'Scale your store operations 10x without 10x headcount — custom AI automation for orders, inventory, support, and personalization across your channels.',
    answer:
      'D2C and e-commerce automation connects your storefronts, inventory, support, and marketing into automated workflows — syncing stock in real time, handling routine support with AI, and personalizing offers — so operations scale without proportional headcount.',
    serviceName: 'D2C & E-commerce Automation',
    serviceType: 'E-commerce automation services',
    schemaDescription:
      'Custom D2C and e-commerce automation: multi-channel order processing, real-time inventory sync, AI customer support, and personalization across Shopify, Amazon, and Walmart.',
    roi: [
      { value: '10x', label: 'Scale store operations without 10x headcount' },
      { value: 'Real-time', label: 'Inventory sync across Shopify, Amazon & Walmart' },
      { value: 'AI support', label: 'Routine customer queries handled automatically' },
    ],
    sections: [
      {
        heading: 'Operations that scale with orders, not headcount',
        level: 2,
        body: [
          'As order volume grows, manual ops break — inventory drifts out of sync, support queues back up, and fulfillment errors creep in. We build automation that processes multi-channel orders, keeps inventory synced in real time across Shopify, Amazon, and Walmart, and coordinates fulfillment, so growth does not mean a bigger ops team.',
        ],
      },
      {
        heading: 'Personalization & support on autopilot',
        level: 3,
        body: [
          'We deploy AI-powered customer support for routine queries, personalized product recommendations, and automated email/SMS campaigns segmented by behavior — lifting conversion and retention while your team handles the cases that actually need a human.',
        ],
      },
    ],
    process: [
      { title: 'Map your store stack', body: 'We document your channels, inventory, support, and fulfillment flows.' },
      { title: 'Build the automation', body: 'Order processing, real-time inventory sync, and support/personalization workflows.' },
      { title: 'Validate & tune', body: 'We test against real orders and tune routing, recommendations, and support responses.' },
      { title: 'Deploy & scale', body: 'Go live with monitoring and keep optimizing as volume grows.' },
    ],
    whyCustom: [
      'Connects your actual channels (Shopify, Amazon, Walmart, 3PLs) — not a one-size SaaS.',
      'Handles your catalog, pricing, and support rules, not a generic bot.',
      'Scales through peaks (launches, holidays) without adding ops staff.',
    ],
    included: [
      'Multi-channel order automation',
      'Real-time inventory sync',
      'AI-powered customer support chatbots',
      'Personalized product recommendations',
      'Automated email & SMS campaigns',
      'Dynamic pricing optimization',
      'Fulfillment & shipping coordination',
      'Customer segmentation workflows',
    ],
    faqs: [
      { q: 'Which platforms do you integrate with?', a: 'Shopify, Amazon, Walmart, WooCommerce, major 3PLs, and the email/SMS and support tools you already run. If you use a specific platform, we can almost always connect it.' },
      { q: 'Can you keep inventory in sync across channels?', a: 'Yes — real-time inventory sync across every channel is one of the most common (and highest-ROI) things we build, eliminating oversells and stockouts.' },
      { q: 'How does AI customer support work?', a: 'It handles routine, repetitive queries (order status, returns, FAQs) automatically and escalates anything that needs a human — so your team focuses on the hard cases.' },
      { q: 'Will automation hurt the customer experience?', a: 'Done right it improves it — faster responses, fewer errors, and personalization at scale. Humans stay in the loop where judgment matters.' },
      { q: 'How long does it take to set up?', a: 'Most builds go live in 4–6 weeks depending on channels and integrations.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-autopartsco-scaled-customer-support-with-ai', label: 'How AutoPartsCo transformed operations with AI automation' },
    related: ['marketing-automation', 'n8n-automation-services', 'us-ai-automation-agency'],
  },
  {
    slug: 'document-processing-automation',
    metaTitle: 'Document Processing Automation & Document Intelligence | Chronexa',
    metaDescription:
      'Intelligent document processing built as context-aware pipelines — OCR + LLM extraction, RAG grounding, and human-in-the-loop validation. Deep experience across legal, finance, insurance, accounting, and pharma.',
    h1: 'Document Processing Automation & Document Intelligence',
    heroSub:
      'Turn high-volume documents into structured, decision-ready data — context-aware pipelines that run from client onboarding through the full data journey, not one-off AI chats.',
    answer:
      'Document processing automation — intelligent document processing (IDP) — turns large volumes of documents into structured, trustworthy data using a pipeline of OCR, LLM extraction against a defined schema, RAG grounding for traceability, and human-in-the-loop validation. Unlike chatting with an AI one file at a time, it is a context-aware system that carries information from client onboarding through the entire data journey.',
    callout:
      'Document “chat” breaks the moment you have thousands of documents across hundreds of clients. One-off conversations lose context; real document intelligence carries it across the entire pipeline, every time.',
    serviceName: 'Document Processing & Intelligence',
    serviceType: 'Intelligent document processing',
    schemaDescription:
      'Intelligent document processing pipelines (OCR + LLM extraction + RAG grounding + human-in-the-loop validation) for legal, financial services, insurance, accounting, research, and pharma.',
    roi: [
      { value: 'Onboarding → insight', label: 'Context carried across the full client data journey' },
      { value: 'OCR + LLM + RAG', label: 'Extraction grounded in the source for traceability' },
      { value: '6+ industries', label: 'Legal, finance, insurance, accounting, pharma & research' },
    ],
    sections: [
      {
        heading: 'Document intelligence, not document chat',
        level: 2,
        body: [
          'Uploading files into a chatbot does not scale. If you are an accountant with hundreds of clients, you cannot run thousands of separate chats to extract and reconcile information — context is lost the moment each conversation ends.',
          'Real document intelligence builds and carries context. We engineer a "chain of thought" the system follows across the whole journey — from the moment a client is onboarded, through every document they send, to the decision the data ultimately supports. That context is what lets a CPA file taxes, evaluate strategy, and actually make sense of extracted information, instead of re-explaining the situation on every upload.',
        ],
      },
      {
        heading: 'How our IDP pipeline works',
        level: 3,
        body: [
          'We capture documents with high-fidelity OCR, classify them, then use LLMs to extract data against a defined schema for each document type. Every extracted field is grounded in the source via retrieval (RAG), so outputs are traceable and audit-ready rather than a black box. Low-confidence items route to a human-in-the-loop review step; high-confidence items flow straight through. The structured result is written into the systems you already run — ERP, DMS, or accounting software — with full audit trails and exception handling.',
        ],
      },
      {
        heading: 'Where we have deployed document intelligence',
        level: 3,
        body: [
          'Document intelligence has been a core Chronexa capability since day one, in production across legal, financial services, insurance, research, patent review, accounting, and pharma. We work under NDA, so we do not name clients — but the experience is real and hands-on: from reserve-study report generation combining OCR and AI, to document and matter workflows for a law firm, to extensive accounting and pharma deployments.',
        ],
      },
    ],
    process: [
      { title: 'Map the document journey', body: 'We map every step from client onboarding to the decision the data supports — the context your pipeline must carry.' },
      { title: 'Build the pipeline', body: 'OCR + classification + schema-based LLM extraction + RAG grounding, tuned to your document types.' },
      { title: 'Tune accuracy with human-in-the-loop', body: 'We validate against real documents and route exceptions to review until accuracy meets your bar.' },
      { title: 'Integrate & run', body: 'Straight-through processing where confidence is high, written into your ERP/DMS/accounting stack with audit trails.' },
    ],
    whyCustom: [
      'A context-carrying "chain of thought", not stateless one-off chats that forget every session.',
      'Extraction tuned to your taxonomy and document types — not a generic template.',
      'Runs inside your environment with access controls — built for NDA and compliance requirements.',
      'Every field is traceable to its source document, so output is audit-ready.',
    ],
    included: [
      'High-fidelity OCR capture',
      'Document classification',
      'Schema-based LLM extraction',
      'RAG grounding with source citations',
      'Validation & human-in-the-loop review',
      'Client-context pipelines (onboarding → data journey)',
      'ERP / DMS / accounting integration',
      'Audit trails & exception handling',
    ],
    faqs: [
      { q: 'Isn’t this just ChatGPT for documents?', a: 'No. Chatting with an AI handles one file at a time and forgets context when the session ends. We build context-carrying pipelines that span a client’s entire data journey, so the system understands the situation, not just the page in front of it — and it scales to thousands of documents.' },
      { q: 'Can it handle hundreds of clients and thousands of documents?', a: 'Yes — that is exactly the point. Instead of manual chats, documents flow through automated pipelines with classification, extraction, validation, and routing, so volume becomes a strength rather than a bottleneck.' },
      { q: 'How accurate is it, and can we trust the output?', a: 'We extract against a defined schema, ground every field in the source document with RAG for traceability, and route low-confidence items to human review. Accuracy improves as the system sees more of your documents.' },
      { q: 'Our documents are confidential — how is that handled?', a: 'Pipelines run inside your environment with role-based access and audit trails; sensitive documents never leave systems you control. We routinely work under NDA.' },
      { q: 'Which industries have you done this for?', a: 'Legal, financial services, insurance, accounting, pharma, research, and patent review — among others. The same pipeline patterns apply across document-heavy industries.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-reservestudy-automated-report-production-with-ai', label: 'How ReserveStudy.com cut report creation time from days to minutes' },
    related: ['cpa-tax-document-automation', 'legal-due-diligence-automation', 'insurance-claims-triage-automation'],
  },
  {
    slug: 'sales-revenue-automation',
    metaTitle: 'Sales & Revenue Operations Automation (RevOps) | Chronexa',
    metaDescription:
      'AI sales and revenue operations automation — unify sales, marketing & CS data, automate lead scoring, CRM enrichment, pipeline management, deal-risk detection, and forecasting across Salesforce and HubSpot.',
    h1: 'Sales & Revenue Operations Automation',
    heroSub:
      'Turn disconnected tools into one revenue engine — automated lead scoring, CRM enrichment, pipeline management, deal-risk detection, and forecasting, so your team sells instead of doing admin.',
    answer:
      'Sales and revenue operations (RevOps) automation unifies your sales, marketing, and customer-success data into one system that scores leads, enriches your CRM, manages pipeline, detects deal risk, and forecasts revenue — removing manual admin so reps spend time selling and leaders forecast with confidence.',
    callout:
      'What works at 5 reps breaks at 15. Without automation, reps spend hours on CRM admin instead of selling, inbound leads sit untouched, and forecasts rely on stale spreadsheets — revenue leaks at every stage.',
    serviceName: 'Sales & Revenue Operations Automation',
    serviceType: 'Revenue operations automation',
    schemaDescription:
      'RevOps automation: unified go-to-market data, AI lead scoring, CRM enrichment, pipeline automation, deal-risk detection, and revenue forecasting across Salesforce and HubSpot.',
    roi: [
      { value: 'One revenue engine', label: 'Sales, marketing & CS unified on clean data' },
      { value: 'AI lead scoring', label: 'Reps focus on the deals most likely to close' },
      { value: 'Predictable forecast', label: 'ML-driven pipeline risk detection & forecasting' },
    ],
    sections: [
      {
        heading: 'One revenue engine, not disconnected tools',
        level: 2,
        body: [
          'Revenue operations (RevOps) aligns sales, marketing, and customer success around shared processes, clean data, and predictable revenue. Most teams lose deals not to competitors but to data trapped in silos — a lead the SDR never saw, a renewal nobody flagged, a forecast built on a stale spreadsheet.',
          'We instrument the revenue engine end to end: one source of truth, clean and enriched data, and automation that connects every stage from first touch to closed-won and renewal.',
        ],
      },
      {
        heading: 'From first touch to forecast, automated',
        level: 3,
        body: [
          'We automate AI-powered lead scoring so reps work the highest-intent deals first; CRM enrichment so records stay complete without manual entry; pipeline-management workflows; and deal health and risk detection, where machine learning surfaces at-risk deals before they slip. On top of that sits forecasting, meeting auto-logging, rep activity tracking, and — increasingly — AI-agent orchestration across the full go-to-market workflow.',
        ],
      },
    ],
    process: [
      { title: 'Map your revenue process', body: 'We document your funnel, data sources, and how sales, marketing, and CS hand off today.' },
      { title: 'Unify & clean the data', body: 'We consolidate and enrich data into your CRM so everything runs on one trustworthy source of truth.' },
      { title: 'Automate the engine', body: 'Lead scoring, enrichment, pipeline workflows, deal-risk detection, and forecasting, wired across your stack.' },
      { title: 'Deploy & report', body: 'Go live with dashboards and weekly reporting, tuning models against your real outcomes.' },
    ],
    whyCustom: [
      'Built on your CRM (Salesforce, HubSpot) and your actual go-to-market motion — not a rigid template.',
      'Unifies and cleans your data instead of adding yet another disconnected tool.',
      'Scoring and risk models tuned to your historical deals, so the intelligence reflects your business.',
      'You own the workflows and the data pipeline end to end.',
    ],
    included: [
      'AI-powered lead scoring',
      'Automated CRM enrichment',
      'Pipeline management workflows',
      'Deal health & risk detection',
      'Revenue & pipeline forecasting',
      'Meeting auto-logging & activity tracking',
      'Email sequence automation',
      'Multi-platform integration (Salesforce, HubSpot)',
      'RevOps reporting & dashboards',
    ],
    faqs: [
      { q: 'How is this different from just having a CRM?', a: 'A CRM stores data; it does not keep it clean, score it, detect risk, or forecast for you. We automate and unify the work on top of your CRM and add the intelligence layer that turns it into a predictable revenue engine.' },
      { q: 'Which CRMs and tools do you work with?', a: 'Salesforce, HubSpot, Pipedrive, Affinity, and the marketing and data tools around them. If your team runs on a specific platform, we can almost always integrate it.' },
      { q: 'Can you improve our forecasting accuracy?', a: 'Yes. With clean, unified pipeline data and ML-based risk detection, forecasts stop being guesswork — you see which deals are real and which are slipping, early.' },
      { q: 'Do you replace our sales or RevOps team?', a: 'No — we remove the manual admin (data entry, list building, reporting) and give the team better intelligence, so they spend their time selling and deciding.' },
      { q: 'How do you handle messy CRM data?', a: 'Data enrichment, deduplication, and validation pipelines are part of the build — clean data is the foundation everything else depends on.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'ai-outbound-sales-automation-personalisation-case-study', label: 'Scaling a personalized outbound pipeline without increasing sales headcount' },
    related: ['vc-pe-crm-automation', 'marketing-automation', 'n8n-automation-services'],
  },
  {
    slug: 'n8n-automation-services',
    metaTitle: 'n8n Automation Services & Consulting | Chronexa',
    metaDescription:
      'An n8n-first automation agency. We design, build, and self-host custom n8n workflows and AI agents for B2B teams. Hire expert n8n consultants.',
    h1: 'n8n Automation Services & Consulting',
    answer:
      'Chronexa is an n8n-first automation agency: we design, build, self-host, and maintain custom n8n workflows and AI agents for B2B teams — so you own portable automation assets instead of renting per-task SaaS.',
    heroSub:
      "We're an n8n-first automation agency. Custom workflows, self-hosted deployments, and AI agents — engineered on n8n and integrated into the stack you already run.",
    serviceName: 'n8n Automation Services',
    serviceType: 'n8n workflow automation consulting',
    schemaDescription:
      'Expert n8n automation services and consulting: custom workflow design, self-hosted n8n deployment, AI agents, and Zapier/Make migration for B2B teams.',
    roi: [
      { value: 'Self-hosted', label: 'You own the workflows — no per-task fees' },
      { value: 'AI agents', label: 'LLM nodes & agents native to your workflows' },
      { value: '4–6 weeks', label: 'From scope to a production system' },
    ],
    sections: [
      {
        heading: 'Why work with an n8n specialist',
        level: 2,
        body: [
          'Most agencies treat n8n as one tool among many. We are n8n-first: it is the engine behind every system we ship. That means self-hostable workflows you fully own, no per-task pricing, and the freedom to run AI agents, custom code, and any API in one place — instead of being boxed in by an off-the-shelf SaaS.',
        ],
      },
      {
        heading: 'What we build on n8n',
        level: 3,
        body: [
          'Multi-step automations, AI agent pipelines, CRM and document workflows, and back-office process automation — all on n8n, integrated with the tools you already use. We handle error handling, monitoring, and retries so the systems run unattended in production.',
        ],
      },
    ],
    process: [
      { title: 'Discovery & scoping', body: 'We map the workflow, define success metrics, and write a clear scope before any build.' },
      { title: 'Build & integrate', body: 'We build the workflows on n8n and wire up your APIs, CRMs, and AI agents.' },
      { title: 'Harden & test', body: 'Error handling, retries, and monitoring, validated against real data.' },
      { title: 'Self-host & hand over', body: 'We deploy on your infrastructure with docs and training — you own it.' },
    ],
    whyCustom: [
      'Self-hosted on your infrastructure — full data control, no per-task billing.',
      'AI agents, custom code, and any API in one workflow, not a closed SaaS.',
      'Portable assets you own and can extend, not a subscription you rent.',
    ],
    included: [
      'Custom n8n workflow design & build',
      'Self-hosted n8n deployment & hardening',
      'AI agent / LLM nodes in n8n',
      'API & app integrations (CRM, docs, comms)',
      'Migration from Zapier / Make to n8n',
      'Error handling, monitoring & retries',
      'Team training & documentation',
      'Ongoing optimization & support',
    ],
    faqs: [
      { q: 'Do you self-host n8n or use n8n Cloud?', a: 'Either. We most often self-host on your infrastructure (or a private instance we manage) for data control and cost, but we work with n8n Cloud too if you prefer.' },
      { q: 'Can you migrate our Zapier or Make workflows to n8n?', a: 'Yes — migrating off per-task pricing to self-hosted n8n is one of our most common engagements. We rebuild and harden the workflows, then validate them against real data before cutover.' },
      { q: 'Do we need n8n experience on our team?', a: 'No. We build, deploy, and maintain everything, and train your team on the parts they want to own. You get full documentation either way.' },
      { q: 'Why n8n instead of Zapier or Make?', a: 'n8n is self-hostable (your data, no per-task fees), handles complex logic and AI agents natively, and produces portable workflows you own rather than rent.' },
      { q: 'How long does an n8n build take?', a: 'Most go live in 4–6 weeks: week 1 discovery and scoping, weeks 2–3 build and integration, week 4 testing — then deploy.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['us-ai-automation-agency', 'vc-pe-crm-automation', 'legal-due-diligence-automation'],
  },
  {
    slug: 'us-ai-automation-agency',
    metaTitle: 'US AI Automation Agency & Consultants | Chronexa',
    metaDescription:
      'AI automation agency for US B2B teams. Custom n8n & AI workflows, 30–60 day delivery, and a 90-day ROI guarantee. Document, sales, legal & finance automation.',
    h1: 'US AI Automation Agency',
    answer:
      'Chronexa is an AI automation agency for US B2B teams. We build custom AI and n8n workflows on your existing stack — scoped, fixed-price, delivered in 30–60 days, and backed by a 90-day ROI guarantee.',
    heroSub:
      'Chronexa builds custom AI and n8n automation for US B2B teams — scoped, fixed-price, delivered in 30–60 days and backed by a 90-day ROI guarantee.',
    serviceName: 'US AI Automation Agency',
    serviceType: 'AI automation agency',
    schemaDescription:
      'AI automation agency and consultants for United States B2B companies: custom AI and n8n workflow automation across document processing, sales, legal, and finance.',
    roi: [
      { value: '30–60 days', label: 'From kickoff to a live automation' },
      { value: '90-day', label: 'ROI guarantee — or we keep working free' },
      { value: '$12M+', label: 'ROI generated for clients to date' },
    ],
    sections: [
      {
        heading: 'AI automation for US enterprises',
        level: 2,
        body: [
          'We help US B2B teams replace manual operations with custom AI and n8n automation — built on the systems you already run, not another SaaS subscription. Engagements are scoped and fixed-price, with measurable ROI targets agreed before we build.',
        ],
      },
      {
        heading: 'What we automate',
        level: 3,
        body: [
          'Document processing and AI research, sales and revenue operations, legal due diligence, insurance claims triage, CPA and tax workflows, and bespoke processes that off-the-shelf tools cannot handle. If it is repetitive and rule-based, it is a candidate for automation.',
        ],
      },
    ],
    process: [
      { title: 'Free automation audit', body: 'We review your workflows and identify where AI saves the most time and cost.' },
      { title: 'Scope & fixed price', body: 'We define deliverables, ROI targets, and a fixed price before you commit.' },
      { title: 'Build & test', body: 'We build on your stack, integrate, and validate against real data.' },
      { title: 'Deploy & measure', body: 'Go live with training and weekly ROI reporting against the agreed targets.' },
    ],
    whyCustom: [
      'Built on your existing stack — an asset you own, not another subscription.',
      'Fixed-price and outcome-scoped, with ROI agreed before the build.',
      'US-time-zone delivery with weekly reporting and a 90-day ROI guarantee.',
    ],
    included: [
      'Free AI workflow audit',
      'Custom build on your existing stack',
      'Document, sales, legal & finance automation',
      'CRM, ERP & API integrations',
      'Security & compliance implementation',
      'Team training & documentation',
      '90-day ROI guarantee',
      'Ongoing optimization & support',
    ],
    faqs: [
      { q: 'Do you work with US-based teams and time zones?', a: 'Yes. We serve US B2B clients across all time zones with overlapping working hours, async updates, and weekly reporting.' },
      { q: 'How fast can you deliver?', a: 'Most automations go live in 30–60 days from kickoff, depending on scope and integrations. You get a written scope and timeline before any build begins.' },
      { q: 'What is the 90-day ROI guarantee?', a: "If you don't hit the agreed ROI targets within 90 days, we work for free until you do, or refund your setup costs." },
      { q: 'What can you automate?', a: 'Document processing, sales and revenue operations, legal, insurance, finance and accounting, and custom processes unique to your business.' },
      { q: 'Do you build on our existing tools?', a: 'Yes. We build on the stack you already run (CRM, ERP, DMS, accounting) rather than forcing a new platform on your team.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['n8n-automation-services', 'cpa-tax-document-automation', 'insurance-claims-triage-automation'],
  },

  /* ============================ SERVICES (capabilities) ============================ */
  {
    slug: 'system-data-integration',
    metaTitle: 'AI System & Data Integration Services | Chronexa',
    metaDescription:
      'Connect your CRMs, ERPs, databases, and SaaS tools into one clean, automated data layer — the integration foundation every AI and automation project depends on.',
    h1: 'AI System & Data Integration',
    heroSub:
      'Connect the tools you already run into one clean, real-time data layer — the foundation every reliable automation and AI workflow is built on.',
    answer:
      'System and data integration connects your CRMs, ERPs, databases, and SaaS apps into one synchronized, clean data layer using custom APIs and n8n workflows — so data flows automatically between systems instead of being copied by hand, and your AI and automation projects have a reliable foundation to run on.',
    serviceName: 'System & Data Integration',
    serviceType: 'System and data integration',
    schemaDescription:
      'Custom API and n8n-based system and data integration: connecting CRMs, ERPs, databases, and SaaS tools into one clean, synchronized, automated data layer.',
    roi: [
      { value: 'One data layer', label: 'Systems synced in real time, not copied by hand' },
      { value: '90%+', label: 'Reduction in manual data entry between tools' },
      { value: 'Any API', label: 'CRMs, ERPs, databases, SaaS — connected to your stack' },
    ],
    sections: [
      {
        heading: 'Integration is the foundation everything else needs',
        level: 2,
        body: [
          'Most automation projects fail for one reason: the data is trapped in disconnected systems. Before AI can score a lead, generate a report, or trigger an action, the underlying tools have to talk to each other reliably. We build that layer — custom integrations that keep your CRM, ERP, finance, and SaaS tools in sync automatically.',
        ],
      },
      {
        heading: 'Clean, real-time, and built to last',
        level: 3,
        body: [
          'We handle the hard parts: field mapping, deduplication, validation, rate limits, retries, and error handling — so integrations keep running in production without babysitting. Built on n8n and custom APIs, the data flows are portable assets you own, not a brittle point-to-point hack.',
        ],
      },
    ],
    process: [
      { title: 'Map your systems & data', body: 'We document every system, the data in each, and how it needs to move.' },
      { title: 'Design the data layer', body: 'Field mapping, sync logic, and validation rules, with a clear source of truth.' },
      { title: 'Build & harden', body: 'Integrations on n8n/APIs with dedup, retries, and monitoring.' },
      { title: 'Deploy & maintain', body: 'Go live with alerting and ongoing support as your stack evolves.' },
    ],
    workflows: [
      'Two-way CRM ↔ ERP sync (accounts, contacts, orders)',
      'Automatic lead routing from forms/ads into the CRM',
      'Finance system ↔ accounting software reconciliation sync',
      'Data warehouse / dashboard feeds kept current automatically',
      'SaaS-to-SaaS sync (support tickets, billing, product usage)',
      'Deduplication & enrichment pipelines across systems',
    ],
    whyCustom: [
      'Connects your exact stack and edge cases — not a fixed connector catalog.',
      'Clean, validated, deduplicated data — not just pipes moving mess around.',
      'Built on n8n/APIs you own, with monitoring and retries for production.',
    ],
    included: [
      'CRM, ERP & database integration',
      'SaaS app connectivity (any API)',
      'Real-time two-way sync',
      'Field mapping & transformation',
      'Deduplication, validation & enrichment',
      'Error handling, retries & monitoring',
    ],
    faqs: [
      { q: 'Which systems can you integrate?', a: 'Salesforce, HubSpot, NetSuite, QuickBooks, Xero, SQL/NoSQL databases, data warehouses, and virtually any tool with an API. If it can be reached programmatically, we can connect it.' },
      { q: 'Is this just Zapier?', a: 'No. We build durable, custom integrations on n8n and APIs with proper field mapping, validation, retries, and monitoring — not brittle per-task automations that break silently.' },
      { q: 'Can you clean up our messy data while integrating?', a: 'Yes — deduplication, validation, and enrichment are part of the build, so you end up with one clean source of truth.' },
      { q: 'Do we own the integrations?', a: 'Yes. They run on infrastructure you control and are portable assets, not a vendor lock-in.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['n8n-automation-services', 'sales-revenue-automation', 'document-processing-automation'],
  },
  {
    slug: 'ai-readiness-assessment',
    metaTitle: 'AI Readiness Assessment & Automation Audit | Chronexa',
    metaDescription:
      'A fixed-scope AI readiness assessment that maps your workflows, data, and systems and returns a prioritized automation roadmap with ROI estimates — your lowest-risk first step.',
    h1: 'AI Readiness Assessment & Automation Audit',
    heroSub:
      'Before you build anything, get a clear, prioritized map of where AI and automation will save you the most time and money — with ROI estimates, not guesswork.',
    answer:
      'An AI readiness assessment is a fixed-scope review of your workflows, data, and systems that returns a prioritized automation roadmap with ROI estimates for each opportunity. It is the lowest-risk way to start: you learn exactly what to automate first and what it is worth before committing to a build.',
    serviceName: 'AI Readiness Assessment',
    serviceType: 'AI readiness assessment',
    schemaDescription:
      'Fixed-scope AI readiness assessment and automation audit: workflow, data, and systems review producing a prioritized automation roadmap with ROI estimates.',
    roi: [
      { value: 'Roadmap', label: 'Prioritized opportunities ranked by ROI' },
      { value: 'Fixed scope', label: 'Clear deliverable, clear price — no open-ended discovery' },
      { value: 'Build-ready', label: 'Each opportunity scoped enough to act on immediately' },
    ],
    sections: [
      {
        heading: 'Start with clarity, not a leap of faith',
        level: 2,
        body: [
          'The fastest way to waste money on AI is to build before you know what is worth building. Our assessment reviews how work actually flows through your team, where the manual effort and errors concentrate, and which systems are ready to automate — then ranks the opportunities by the ROI they will deliver.',
        ],
      },
      {
        heading: 'What you walk away with',
        level: 3,
        body: [
          'A written automation roadmap: each opportunity with the problem it solves, the systems involved, an effort estimate, and an ROI estimate (time saved, cost reduced, throughput gained). You can act on it with us or anyone — it is yours.',
        ],
      },
    ],
    process: [
      { title: 'Discovery sessions', body: 'We map your workflows, data sources, systems, and the pain points your team feels daily.' },
      { title: 'Opportunity analysis', body: 'We identify and quantify automation opportunities across the operation.' },
      { title: 'Prioritized roadmap', body: 'You get a ranked roadmap with ROI estimates and effort for each opportunity.' },
      { title: 'Build plan', body: 'For the opportunities you choose, a fixed-price scope and timeline to deliver.' },
    ],
    workflows: [
      'End-to-end workflow & data-flow mapping',
      'Manual-effort and error-rate analysis by process',
      'Systems & integration readiness review',
      'Opportunity scoring by ROI and effort',
      'Quick-win shortlist for a fast first automation',
      'Written roadmap with ROI estimates',
    ],
    whyCustom: [
      'Outcome-focused: a roadmap you can act on, not a generic report.',
      'ROI-ranked, so you automate the highest-value work first.',
      'Vendor-neutral deliverable — you own it and can use it with anyone.',
    ],
    included: [
      'Workflow & data-flow mapping',
      'Systems & integration review',
      'Automation opportunity identification',
      'ROI & effort estimates per opportunity',
      'Prioritized automation roadmap',
      'Fixed-price build plan for chosen opportunities',
    ],
    faqs: [
      { q: 'Is the assessment really fixed-scope?', a: 'Yes — a defined deliverable (the roadmap) for a defined price and timeline, so there are no open-ended discovery surprises.' },
      { q: 'Do we have to build with you afterward?', a: 'No. The roadmap is yours to act on however you like. Most clients continue with us because the path is already clear, but there is no obligation.' },
      { q: 'How long does it take?', a: 'Typically one to two weeks depending on the size and complexity of your operation.' },
      { q: 'What do we get at the end?', a: 'A written, prioritized automation roadmap with the problem, systems, effort, and ROI estimate for each opportunity — plus a recommended starting point.' },
      { q: 'What does it cost?', a: `It is a fixed, scoped fee — far less than a build — and it de-risks everything that follows. ${GUARANTEE} Book a free intro call to scope it.` },
    ],
    related: ['us-ai-automation-agency', 'n8n-automation-services', 'system-data-integration'],
  },

  /* ======================== USE CASES — BY FUNCTION ======================== */
  {
    slug: 'finance-automation',
    metaTitle: 'AI Finance Automation — AP, Close & Reporting | Chronexa',
    metaDescription:
      'Automate your finance team’s workflows with AI — accounts payable, reconciliations, month-end close, reporting, and expenses. Cut close time and give leaders real-time visibility.',
    h1: 'AI & Automation for Finance',
    heroSub:
      'Give your finance team back its time — AI automation for accounts payable, reconciliations, month-end close, reporting, and expenses, inside the systems you already run.',
    answer:
      'Finance automation uses AI to handle the repetitive, high-volume work inside a company’s finance department — accounts payable, reconciliations, reporting, and expense management — so the month-end close gets faster, manual data entry drops, and leaders get real-time visibility instead of stale spreadsheets. (Run an accounting firm? See our Accounting & CPA Firms use case.)',
    callout:
      'What works at one entity breaks at five. Manual reconciliations and approvals don’t scale with transaction volume — the month-end close gets slower at exactly the moment the business gets bigger.',
    serviceName: 'Finance Automation',
    serviceType: 'Finance automation',
    schemaDescription:
      'AI finance and accounting automation: accounts payable, invoice processing, reconciliations, financial reporting, expense workflows, and cash-flow forecasting.',
    roi: [
      { value: '40–60%', label: 'Less invoice & AP handling time' },
      { value: '50%+', label: 'Faster month-end close' },
      { value: 'Real-time', label: 'Reporting & cash-flow visibility' },
    ],
    sections: [
      {
        heading: 'The operational pressure on modern finance teams',
        level: 2,
        body: [
          'Finance is expected to do more with the same headcount: faster close, cleaner reporting, tighter controls. But spreadsheet reconciliations, manual invoice approvals, disconnected systems, and repetitive journal entries eat the bandwidth that should go to analysis and decisions. As volume grows, the manual model breaks.',
        ],
      },
      {
        heading: 'Where finance automation creates structural advantage',
        level: 3,
        body: [
          'We automate accounts payable and invoice processing (capture, code, route for approval), reconciliations and close, financial reporting, and expense workflows — and layer in cash-flow forecasting. The result is a finance function that scales with revenue instead of headcount, with audit-ready documentation at every step.',
        ],
      },
    ],
    process: [
      { title: 'Map your finance workflows', body: 'AP, close, reporting, and expenses — where the manual effort and risk concentrate.' },
      { title: 'Build the automation', body: 'Invoice capture, coding, approvals, reconciliation, and reporting wired to your accounting stack.' },
      { title: 'Validate & control', body: 'Human review for exceptions, with audit trails and controls baked in.' },
      { title: 'Deploy & measure', body: 'Go live and track close time, handling time, and reporting workload.' },
    ],
    workflows: [
      'Automated invoice capture, coding & approval routing',
      'Bank & ledger reconciliation automation',
      'Month-end close task orchestration',
      'Automated financial reporting & dashboards',
      'Expense capture & policy-compliance checks',
      'Cash-flow forecasting from live data',
    ],
    whyCustom: [
      'Built on your finance stack (NetSuite, QuickBooks, Xero, your ERP), not a rigid product.',
      'Controls, audit trails, and human-in-the-loop where finance needs them.',
      'Scales through month-end close and quarter-end peaks without adding headcount.',
    ],
    included: [
      'AP & invoice processing automation',
      'Reconciliation & close automation',
      'Automated financial reporting',
      'Expense & compliance workflows',
      'Cash-flow forecasting',
      'Accounting-system integration (QBO, Xero, NetSuite)',
      'Audit-ready logging',
    ],
    faqs: [
      { q: 'Which accounting systems do you work with?', a: 'QuickBooks, Xero, NetSuite, and most major accounting and ERP platforms, plus the document and banking tools around them.' },
      { q: 'How much faster can the close get?', a: 'Teams commonly cut the month-end close by half by automating reconciliations and consolidations, with real-time dashboards replacing manual reporting.' },
      { q: 'Is it safe and auditable?', a: 'Yes — controls, approvals, and full audit trails are built in, with human review on exceptions.' },
      { q: 'Does this replace our finance team?', a: 'No — it removes the repetitive processing so the team focuses on analysis, controls, and strategy.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-ledgersync-eliminated-invoice-backlogs-using-ai', label: 'How LedgerSync eliminated invoice backlogs with AI automation' },
    related: ['cpa-tax-document-automation', 'document-processing-automation', 'operations-automation'],
  },
  {
    slug: 'operations-automation',
    metaTitle: 'AI Operations & Back-Office Automation | Chronexa',
    metaDescription:
      'Automate the repetitive back-office and operational workflows that slow your team down — data entry, approvals, handoffs, and reporting — with custom AI and n8n.',
    h1: 'AI & Automation for Operations',
    heroSub:
      'Remove the manual handoffs, data entry, and approvals that bottleneck your operation — so the business scales without scaling headcount.',
    answer:
      'Operations automation replaces the repetitive back-office work — data entry, approvals, internal handoffs, status updates, and reporting — with custom AI and n8n workflows, so processes run faster and more consistently and your team scales output without scaling headcount.',
    serviceName: 'Operations Automation',
    serviceType: 'Operations automation',
    schemaDescription:
      'AI operations and back-office automation: process orchestration, approvals, data entry, internal handoffs, and operational reporting on custom n8n workflows.',
    roi: [
      { value: '10x', label: 'Throughput on automated processes' },
      { value: 'Fewer errors', label: 'Consistent, rule-based execution every time' },
      { value: 'Hours → minutes', label: 'On repetitive operational tasks' },
    ],
    sections: [
      {
        heading: 'Your operation is only as fast as its slowest manual step',
        level: 2,
        body: [
          'Growth exposes the manual seams: a report someone rebuilds every week, an approval that sits in an inbox, data re-keyed between systems, a handoff that drops. Each is small; together they cap how much the business can do without hiring. We automate those seams end to end.',
        ],
      },
      {
        heading: 'Process automation that runs unattended',
        level: 3,
        body: [
          'We orchestrate multi-step processes across your tools — triggering actions, routing approvals, updating systems, and generating reports automatically — with monitoring and exception handling so it runs reliably in production, not just in a demo.',
        ],
      },
    ],
    process: [
      { title: 'Map the process', body: 'We document the steps, systems, decisions, and handoffs end to end.' },
      { title: 'Automate the flow', body: 'n8n workflows trigger actions, route approvals, and update systems automatically.' },
      { title: 'Add intelligence & checks', body: 'AI for decisions and extraction, human review for exceptions.' },
      { title: 'Deploy & monitor', body: 'Go live with alerting and keep optimizing as volume grows.' },
    ],
    workflows: [
      'Approval routing & escalation workflows',
      'Cross-system data entry & status sync',
      'Automated internal & client reporting',
      'Onboarding / offboarding process automation',
      'Scheduling, reminders & SLA tracking',
      'Exception detection with human-in-the-loop review',
    ],
    whyCustom: [
      'Automates your actual process and tools — not a generic template.',
      'Runs unattended with monitoring and exception handling.',
      'Built on n8n you own, so it adapts as the operation changes.',
    ],
    included: [
      'Process discovery & mapping',
      'Multi-step workflow orchestration',
      'Approval & handoff automation',
      'Cross-system data sync',
      'Automated operational reporting',
      'Monitoring & exception handling',
    ],
    faqs: [
      { q: 'What kinds of operations can you automate?', a: 'Any repetitive, rule-based process — approvals, data entry, handoffs, scheduling, reporting, onboarding — across the tools you already use.' },
      { q: 'How is this different from hiring an ops person?', a: 'Automation handles the repetitive volume consistently and 24/7, freeing your people for judgment and exceptions — so you scale output without scaling payroll.' },
      { q: 'What if our process changes?', a: 'Workflows are built on n8n and owned by you; we adjust them as the operation evolves, usually quickly.' },
      { q: 'How long to deploy?', a: 'Most processes go live in 4–6 weeks depending on complexity and integrations.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-autopartsco-scaled-customer-support-with-ai', label: 'How AutoPartsCo transformed operations with AI automation' },
    related: ['finance-automation', 'customer-support-automation', 'n8n-automation-services'],
  },
  {
    slug: 'customer-support-automation',
    metaTitle: 'AI Customer Support Automation | Chronexa',
    metaDescription:
      'Resolve routine customer queries automatically with AI, route the rest to the right person, and give your team context — cutting response times and cost per ticket.',
    h1: 'AI & Automation for Customer Support',
    heroSub:
      'Handle routine queries automatically, route the rest intelligently, and arm your team with context — faster responses, lower cost per ticket, happier customers.',
    answer:
      'Customer support automation uses AI to resolve routine, repetitive queries instantly, classify and route everything else to the right person with full context, and automate the busywork around tickets — cutting response times and cost per ticket while keeping humans on the cases that need them.',
    serviceName: 'Customer Support Automation',
    serviceType: 'Customer support automation',
    schemaDescription:
      'AI customer support automation: AI resolution of routine queries, intelligent ticket triage and routing, response drafting, and CRM/helpdesk integration.',
    roi: [
      { value: '40–70%', label: 'Of routine tickets deflected or auto-resolved' },
      { value: 'Faster', label: 'First-response and resolution times' },
      { value: '24/7', label: 'Coverage without 24/7 headcount' },
    ],
    sections: [
      {
        heading: 'Support volume scales faster than support teams',
        level: 2,
        body: [
          'As you grow, tickets grow faster than the team — and most of them are the same repetitive questions: order status, returns, account changes, FAQs. Answering each by hand is slow and expensive, and it buries the genuinely hard cases that deserve human attention.',
        ],
      },
      {
        heading: 'AI on the routine, humans on the hard',
        level: 3,
        body: [
          'We deploy AI to resolve routine queries instantly (grounded in your knowledge base and policies), classify and route the rest with full context, and draft responses for agents to approve. Your team stops triaging and starts solving — and customers get faster, more consistent answers.',
        ],
      },
    ],
    process: [
      { title: 'Map your support flows', body: 'Ticket types, channels, knowledge sources, and escalation paths.' },
      { title: 'Build AI resolution & routing', body: 'Grounded AI for routine queries, intelligent triage for the rest.' },
      { title: 'Integrate & safeguard', body: 'Wire into your helpdesk/CRM with human approval where it matters.' },
      { title: 'Deploy & improve', body: 'Go live and tune deflection and routing against real tickets.' },
    ],
    workflows: [
      'AI resolution of FAQs, order-status & returns',
      'Ticket classification & priority routing',
      'AI-drafted responses for agent approval',
      'Knowledge-base-grounded answers (no hallucinated policy)',
      'Automatic CRM/helpdesk updates & tagging',
      'Escalation & SLA-breach alerts',
    ],
    whyCustom: [
      'Grounded in your knowledge base and policies — not a generic bot.',
      'Routes with context so agents never start from zero.',
      'Humans stay in the loop on anything sensitive or complex.',
    ],
    included: [
      'AI resolution of routine queries',
      'Ticket triage & intelligent routing',
      'AI-drafted agent responses',
      'Knowledge-base grounding',
      'Helpdesk & CRM integration',
      'Escalation & SLA workflows',
    ],
    faqs: [
      { q: 'Will automation hurt the customer experience?', a: 'Done right it improves it — instant answers on routine questions, faster routing, and humans focused on the cases that need care. Anything sensitive escalates to a person.' },
      { q: 'Which helpdesks do you integrate with?', a: 'Zendesk, Intercom, Freshdesk, HubSpot Service, and most major helpdesk and CRM platforms.' },
      { q: 'How do you stop the AI from giving wrong answers?', a: 'Responses are grounded in your knowledge base and policies (RAG), and sensitive cases route to humans — the AI does not improvise policy.' },
      { q: 'How much volume can it deflect?', a: 'It depends on your ticket mix, but routine, repetitive queries — often the majority — are strong candidates for instant resolution.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    proof: { slug: 'how-autopartsco-scaled-customer-support-with-ai', label: 'How AutoPartsCo scaled customer support with AI' },
    related: ['operations-automation', 'd2c-ecommerce-automation', 'marketing-automation'],
  },
  {
    slug: 'hr-automation',
    metaTitle: 'AI HR & Recruitment Automation | Chronexa',
    metaDescription:
      'Automate hiring, onboarding, and HR operations with AI — resume screening, interview scheduling, document handling, and employee workflows on your existing stack.',
    h1: 'AI & Automation for HR',
    heroSub:
      'Take the manual load off hiring and HR ops — automated screening, scheduling, onboarding, and document workflows so your team focuses on people, not paperwork.',
    answer:
      'HR automation uses AI to handle the repetitive parts of hiring and people operations — resume screening, interview scheduling, onboarding paperwork, and employee requests — so HR teams spend their time on people and culture instead of administrative busywork.',
    serviceName: 'HR Automation',
    serviceType: 'HR automation',
    schemaDescription:
      'AI HR and recruitment automation: resume screening, interview scheduling, onboarding workflows, document processing, and employee request handling.',
    roi: [
      { value: 'Faster', label: 'Time-to-hire with automated screening & scheduling' },
      { value: 'Less admin', label: 'Onboarding & document work handled automatically' },
      { value: 'Consistent', label: 'Compliant, repeatable people processes' },
    ],
    sections: [
      {
        heading: 'HR runs on repetitive, high-volume admin',
        level: 2,
        body: [
          'Screening resumes, coordinating interviews, chasing onboarding documents, answering the same policy questions — HR spends a huge share of its time on process work that is necessary but not strategic. That is exactly the work AI and automation are good at.',
        ],
      },
      {
        heading: 'Automate the process, keep the human judgment',
        level: 3,
        body: [
          'We automate the pipeline — from candidate screening and scheduling to onboarding workflows and document handling — while keeping hiring decisions and sensitive conversations firmly with your team. The result is a faster, more consistent, more compliant people operation.',
        ],
      },
    ],
    process: [
      { title: 'Map HR & hiring workflows', body: 'Sourcing, screening, onboarding, and employee-request processes.' },
      { title: 'Build the automation', body: 'Screening, scheduling, and onboarding workflows wired to your ATS/HRIS.' },
      { title: 'Add safeguards', body: 'Human decision points and compliance checks where required.' },
      { title: 'Deploy & support', body: 'Go live and refine against real hiring and HR volume.' },
    ],
    workflows: [
      'Resume screening & candidate shortlisting',
      'Interview scheduling & reminders',
      'Onboarding document collection & workflows',
      'Employee request & FAQ automation',
      'Offer-letter & contract generation',
      'ATS / HRIS data sync',
    ],
    whyCustom: [
      'Built on your ATS/HRIS and hiring process — not a generic tool.',
      'Keeps hiring decisions and sensitive cases with your people.',
      'Compliance and consistency built into every workflow.',
    ],
    included: [
      'Resume screening & shortlisting',
      'Interview scheduling automation',
      'Onboarding & offboarding workflows',
      'Document collection & processing',
      'Employee request automation',
      'ATS / HRIS integration',
    ],
    faqs: [
      { q: 'Does AI make the hiring decisions?', a: 'No. AI handles screening and coordination to save time; hiring decisions stay with your team, with fairness and compliance safeguards in place.' },
      { q: 'Which HR systems do you integrate with?', a: 'Most major ATS and HRIS platforms, plus the document, email, and scheduling tools around them.' },
      { q: 'Can it speed up onboarding?', a: 'Yes — document collection, account setup, and task orchestration can be largely automated so new hires are productive faster.' },
      { q: 'How long does it take to set up?', a: 'Most HR workflows go live in 4–6 weeks depending on systems and complexity.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['operations-automation', 'document-processing-automation', 'n8n-automation-services'],
  },

  /* ====================== USE CASES — BY INDUSTRY ====================== */
  {
    slug: 'pharma-life-sciences-automation',
    metaTitle: 'AI Automation for Pharma & Life Sciences | Chronexa',
    metaDescription:
      'AI document intelligence and workflow automation for pharma and life sciences — regulatory documents, research data, and compliance-heavy processes, built for your controls.',
    h1: 'AI Automation for Pharma & Life Sciences',
    heroSub:
      'Document intelligence and workflow automation for regulated life-sciences operations — research, regulatory, and compliance-heavy document workflows, built around your controls.',
    answer:
      'AI automation for pharma and life sciences applies document intelligence and workflow automation to the sector\'s most document-heavy, compliance-bound processes — extracting and structuring data from research, regulatory, and quality documents, and automating the workflows around them, all inside your security and audit requirements.',
    serviceName: 'Pharma & Life Sciences Automation',
    serviceType: 'Pharma and life sciences automation',
    schemaDescription:
      'AI document intelligence and workflow automation for pharma and life sciences: regulatory documents, research data extraction, and compliance workflows.',
    roi: [
      { value: 'Hours saved', label: 'On research & regulatory document handling' },
      { value: 'Audit-ready', label: 'Traceable extraction with full provenance' },
      { value: 'Your controls', label: 'Runs inside your security & compliance perimeter' },
    ],
    sections: [
      {
        heading: 'Document-heavy, compliance-bound, and ripe for automation',
        level: 2,
        body: [
          'Few industries handle more dense, high-stakes documents than life sciences — research papers, regulatory filings, quality records, patent and IP material. Extracting and reconciling information by hand is slow and error-prone, and the compliance bar makes generic AI tools a non-starter.',
          'Document intelligence has been a core Chronexa capability since day one, including work in pharma. We build extraction and workflow automation that respects the controls this sector requires.',
        ],
      },
      {
        heading: 'Extraction you can trust, workflows that comply',
        level: 3,
        body: [
          'We combine OCR and LLM extraction against defined schemas with RAG grounding, so every extracted field traces back to its source for audit — and route low-confidence items to expert review. The workflows run inside your environment with access controls, so confidential research and regulatory data never leaves systems you control.',
        ],
      },
    ],
    process: [
      { title: 'Map the document journey', body: 'From source documents to the decisions and filings they support.' },
      { title: 'Build compliant extraction', body: 'OCR + LLM + RAG grounding tuned to your document types and controls.' },
      { title: 'Validate with experts', body: 'Human-in-the-loop review with full provenance and audit trails.' },
      { title: 'Integrate & govern', body: 'Wire into your systems inside your security and compliance perimeter.' },
    ],
    workflows: [
      'Regulatory document extraction & structuring',
      'Research / literature data extraction',
      'Patent & IP document review support',
      'Quality and compliance record processing',
      'Cross-document reconciliation with provenance',
      'Routing & approval workflows with audit trails',
    ],
    whyCustom: [
      'Built for compliance: provenance, audit trails, and access controls.',
      'Runs in your environment — confidential data stays under your control.',
      'Extraction tuned to dense, technical life-sciences documents.',
    ],
    included: [
      'Regulatory & research document extraction',
      'OCR + LLM + RAG grounding',
      'Patent / IP review support',
      'Compliance & quality workflows',
      'Human-in-the-loop expert validation',
      'Audit trails & access controls',
    ],
    faqs: [
      { q: 'Can you meet our compliance and security requirements?', a: 'Yes. Workflows run inside your environment with role-based access and full audit trails, and we scope security and compliance requirements before any build. We work under NDA.' },
      { q: 'How do you ensure extraction is trustworthy?', a: 'Schema-based extraction with RAG grounding makes every field traceable to its source, and low-confidence items go to expert review.' },
      { q: 'Do you have pharma experience?', a: 'Yes — document intelligence in pharma and adjacent regulated fields is part of our experience, though client names are protected under NDA.' },
      { q: 'What systems do you integrate with?', a: 'Document management, quality, and regulatory systems, plus the data stores and tools around them.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['document-processing-automation', 'legal-due-diligence-automation', 'financial-services-automation'],
  },
  {
    slug: 'financial-services-automation',
    metaTitle: 'AI Automation for Financial Services | Chronexa',
    metaDescription:
      'AI automation for financial services — document intelligence, onboarding/KYC workflows, reconciliation, and reporting built to your compliance and security requirements.',
    h1: 'AI Automation for Financial Services',
    heroSub:
      'Automate the document-heavy, compliance-bound workflows of financial services — onboarding, reconciliation, reporting, and analysis — inside your security perimeter.',
    answer:
      'AI automation for financial services applies document intelligence and workflow automation to onboarding/KYC, reconciliation, reporting, and analysis — cutting manual processing and turnaround times while running inside the compliance and security controls the sector demands.',
    serviceName: 'Financial Services Automation',
    serviceType: 'Financial services automation',
    schemaDescription:
      'AI automation for financial services: KYC/onboarding document workflows, reconciliation, reporting, and analysis with compliance-grade controls.',
    roi: [
      { value: 'Faster', label: 'Client onboarding & document turnaround' },
      { value: 'Fewer errors', label: 'Automated reconciliation & checks' },
      { value: 'Compliant', label: 'Audit trails and controls built in' },
    ],
    sections: [
      {
        heading: 'Where regulation meets document volume',
        level: 2,
        body: [
          'Financial services runs on documents and rules: onboarding and KYC packs, statements, agreements, reconciliations, and reporting — all under strict compliance. Manual processing is slow and risky, and the controls rule out generic, uncontrolled AI tools.',
        ],
      },
      {
        heading: 'Automation that respects the controls',
        level: 3,
        body: [
          'We automate onboarding and document workflows, reconciliation, and reporting with AI extraction grounded in source documents, validation, and human review where it matters — all inside your environment with access controls and audit trails. Faster turnaround, fewer errors, and a clean compliance record.',
        ],
      },
    ],
    process: [
      { title: 'Map regulated workflows', body: 'Onboarding/KYC, reconciliation, and reporting, with their control points.' },
      { title: 'Build compliant automation', body: 'AI extraction + validation + workflow, inside your security perimeter.' },
      { title: 'Add controls & review', body: 'Human-in-the-loop and audit trails at every sensitive step.' },
      { title: 'Deploy & monitor', body: 'Go live with monitoring and reporting against turnaround and accuracy.' },
    ],
    workflows: [
      'Client onboarding & KYC document workflows',
      'Statement & agreement data extraction',
      'Automated reconciliation & checks',
      'Regulatory & management reporting',
      'Exception handling with human review',
      'Audit-ready logging across the process',
    ],
    whyCustom: [
      'Runs inside your environment with access controls and audit trails.',
      'Extraction grounded in source documents for traceability.',
      'Tuned to your products, documents, and compliance rules.',
    ],
    included: [
      'Onboarding / KYC document automation',
      'Document extraction & validation',
      'Reconciliation automation',
      'Regulatory & management reporting',
      'Human-in-the-loop review',
      'Audit trails & access controls',
    ],
    faqs: [
      { q: 'How do you handle compliance and data security?', a: 'Workflows run inside your environment with role-based access and full audit trails; we scope compliance and security requirements up front and work under NDA.' },
      { q: 'Can you automate KYC and onboarding?', a: 'Yes — document collection, extraction, checks, and routing are strong automation candidates that cut onboarding turnaround significantly.' },
      { q: 'Is the AI output auditable?', a: 'Yes. Extraction is grounded in source documents so every field is traceable, with human review on exceptions.' },
      { q: 'What systems do you integrate with?', a: 'Core banking, CRM, document management, and reporting systems, plus the tools around them.' },
      { q: 'What does it cost?', a: `Engagements are fixed-price and scoped to the outcome. ${GUARANTEE} Book a free audit for a clear price and ROI estimate.` },
    ],
    related: ['document-processing-automation', 'insurance-claims-triage-automation', 'vc-pe-crm-automation'],
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/**
 * Solution capability cards (automaly-style): each card pairs a capability with
 * the ROI impact it drives. Rendered as the "Where automation creates value"
 * grid on every service/use-case page. ROI impacts use bold-but-defensible
 * ranges tied to the same outcomes as the page's case studies and roi metrics.
 */
export type SolutionCard = { title: string; body: string; roiImpact: string };

export const SOLUTIONS: Record<string, SolutionCard[]> = {
  'legal-due-diligence-automation': [
    { title: 'Due diligence & contract review', body: 'AI reads contracts and filings, flags risk clauses, and writes structured findings back into iManage or NetDocuments.', roiImpact: '60–80% less manual review time per matter' },
    { title: 'Matter intake & classification', body: 'Incoming documents are auto-classified and routed to the right matter and team without paralegal triage.', roiImpact: 'Hours saved on every new matter' },
    { title: 'Compliance & audit trail', body: 'Every extraction is logged and reviewable inside your existing security perimeter.', roiImpact: 'Audit-ready on every document' },
  ],
  'cpa-tax-document-automation': [
    { title: 'Tax document ingestion', body: 'OCR + AI ingest client tax documents and categorize expenses automatically during the season crunch.', roiImpact: '10x throughput in tax season, no new hires' },
    { title: 'Hubdoc → QuickBooks reconciliation', body: 'Receipts flow into reconciled books in QuickBooks or Xero, hands-off.', roiImpact: '78% less manual data entry' },
    { title: 'Exception review queues', body: 'Only the edge cases reach a preparer, with full logging on everything else.', roiImpact: 'Preparers shift to review, not typing' },
  ],
  'insurance-claims-triage-automation': [
    { title: 'FNOL intake', body: 'Capture first notice of loss from any channel into clean, structured claim data.', roiImpact: 'Minutes, not hours, to first action' },
    { title: 'Claims triage & routing', body: 'AI scores severity and routes each claim to the right adjuster inside Guidewire or Duck Creek.', roiImpact: 'Faster cycle time per claim' },
    { title: 'Subrogation detection', body: 'Recovery opportunities are flagged automatically across the whole book.', roiImpact: 'Recovered revenue that used to slip' },
  ],
  'financial-services-automation': [
    { title: 'Client onboarding & KYC', body: 'Automate document collection, verification, and onboarding inside your security perimeter.', roiImpact: 'Days → hours to onboard a client' },
    { title: 'Reconciliation & reporting', body: 'Continuous reconciliation and regulatory reporting generated from live data.', roiImpact: '50%+ less manual reconciliation' },
    { title: 'Compliance monitoring', body: 'Surface anomalies and regulatory changes with a full audit trail behind every action.', roiImpact: 'Audit-ready, continuously' },
  ],
  'vc-pe-crm-automation': [
    { title: 'Deck & data-room parsing', body: 'AI extracts metrics from pitch decks and data rooms straight into Affinity.', roiImpact: 'Hours saved per deal screened' },
    { title: 'Portfolio monitoring', body: 'Automated KPI collection and alerts across the whole portfolio.', roiImpact: 'Real-time portfolio visibility' },
    { title: 'Relationship intelligence', body: 'Affinity stays enriched and current without anyone logging activity manually.', roiImpact: 'Clean pipeline, zero data entry' },
  ],
  'property-management-automation': [
    { title: 'Reserve study automation', body: 'Compress multi-hour reserve reporting into minutes with custom n8n workflows.', roiImpact: '6 hours → 11 minutes per report' },
    { title: 'Maintenance & work-order routing', body: 'Requests are auto-triaged and dispatched to the right vendor.', roiImpact: 'Faster response, fewer escalations' },
    { title: 'Owner & tenant reporting', body: 'Statements and reports generate on schedule, hands-off.', roiImpact: 'Reporting workload near-zero' },
  ],
  'pharma-life-sciences-automation': [
    { title: 'Regulatory document intelligence', body: 'Extract and index research, regulatory, and compliance documents into searchable form.', roiImpact: 'Faster response to regulatory change' },
    { title: 'Research data extraction', body: 'Structure data from studies and reports without manual transcription.', roiImpact: 'Days of manual review removed' },
    { title: 'Controlled, compliant workflows', body: 'Built around your validation and audit controls from day one.', roiImpact: 'Audit-ready by design' },
  ],
  'd2c-ecommerce-automation': [
    { title: 'Order & inventory automation', body: 'Orders and inventory sync across every channel in real time.', roiImpact: '10x order volume, same headcount' },
    { title: 'AI customer support', body: 'Routine tickets resolve automatically; the rest escalate with context.', roiImpact: 'Lower cost per ticket' },
    { title: 'Personalization & pricing', body: 'Dynamic recommendations and pricing across your channels.', roiImpact: 'Higher AOV and conversion' },
  ],
  'finance-automation': [
    { title: 'Accounts payable', body: 'Invoices are captured, coded, and routed for approval automatically.', roiImpact: '40–60% less AP handling time' },
    { title: 'Reconciliation & close', body: 'Bank and ledger reconciliation plus close tasks run on autopilot.', roiImpact: '50%+ faster month-end close' },
    { title: 'Reporting & cash flow', body: 'Live dashboards and forecasts replace manual spreadsheet reporting.', roiImpact: 'Real-time visibility for leaders' },
  ],
  'operations-automation': [
    { title: 'Process orchestration', body: 'Handoffs connect across your tools so work moves without manual nudging.', roiImpact: 'Hours of coordination removed weekly' },
    { title: 'Data entry & sync', body: 'Eliminate re-keying of the same data between systems.', roiImpact: 'Near-zero manual data entry' },
    { title: 'Approvals & exceptions', body: 'Approvals route automatically and only true exceptions surface to a human.', roiImpact: 'Faster throughput, fewer stalls' },
  ],
  'customer-support-automation': [
    { title: 'Automated resolution', body: 'Routine queries resolve instantly with AI grounded in your knowledge base.', roiImpact: 'A large share of tickets deflected' },
    { title: 'Smart routing', body: 'Everything else is classified and routed to the right agent with full context.', roiImpact: 'Faster first response' },
    { title: 'Agent assist', body: 'Drafted replies and surfaced context let agents move far faster.', roiImpact: 'Lower cost per ticket' },
  ],
  'hr-automation': [
    { title: 'Candidate screening', body: 'AI screens and ranks applicants against your criteria.', roiImpact: 'Hours saved per role' },
    { title: 'Scheduling & onboarding', body: 'Interview scheduling and onboarding workflows run themselves.', roiImpact: 'Days → hours to onboard' },
    { title: 'HR document workflows', body: 'HR documents generate and route automatically.', roiImpact: 'Paperwork off the team’s plate' },
  ],
  'document-processing-automation': [
    { title: 'Extraction & classification', body: 'OCR + LLM extract and classify any document against your schema.', roiImpact: '85% less time per document' },
    { title: 'RAG grounding & traceability', body: 'Every output traces back to its source for trust and audit.', roiImpact: 'Accuracy you can defend' },
    { title: 'Human-in-the-loop & STP', body: 'Straight-through for clean cases, human review for the rest.', roiImpact: 'Scales without adding headcount' },
  ],
  'sales-revenue-automation': [
    { title: 'Lead scoring & enrichment', body: 'AI scores and enriches leads and keeps the CRM clean.', roiImpact: '5x more personalized outreach per rep' },
    { title: 'Pipeline & deal-risk', body: 'Stalled deals and risk surface before they slip away.', roiImpact: 'Faster pipeline velocity' },
    { title: 'Forecasting & reporting', body: 'Live forecasts and dashboards generated from CRM data.', roiImpact: 'Forecast accuracy up' },
  ],
  'marketing-automation': [
    { title: 'Multi-channel campaigns', body: 'Content, ads, and email orchestrated across your whole stack.', roiImpact: 'Rapid campaign launches' },
    { title: 'Content & distribution', body: 'Content is scheduled and distributed automatically.', roiImpact: 'Team focuses on strategy, not busywork' },
    { title: 'Attribution & reporting', body: 'Unified performance reporting across every channel.', roiImpact: 'ROI you can actually attribute' },
  ],
  'system-data-integration': [
    { title: 'Unified data layer', body: 'CRMs, ERPs, and SaaS tools connect into one clean, real-time layer.', roiImpact: 'One source of truth' },
    { title: 'Sync & enrichment', body: 'Records stay consistent and enriched across every system.', roiImpact: '90% less manual data handling' },
    { title: 'Legacy & API integration', body: 'Legacy systems bridge to modern APIs — no rip-and-replace.', roiImpact: 'Modernize without re-platforming' },
  ],
  'ai-readiness-assessment': [
    { title: 'Workflow mapping', body: 'We map your processes end to end to find where automation actually pays.', roiImpact: 'Avg 12 opportunities identified' },
    { title: 'Prioritized roadmap', body: 'A sequenced plan ranked by ROI and feasibility, not hype.', roiImpact: 'Clarity before you spend' },
    { title: 'ROI estimates', body: 'Each opportunity is sized with its expected return and payback.', roiImpact: 'Know the payback up front' },
  ],
  'n8n-automation-services': [
    { title: 'Process discovery & mapping', body: 'We scope the workflow end to end before a line of code is written.', roiImpact: 'No scope surprises' },
    { title: 'Custom build on n8n', body: 'Bespoke automation built on infrastructure you own.', roiImpact: 'You own assets, not subscriptions' },
    { title: 'Integration & training', body: 'Wired into your stack and handed over with docs and training.', roiImpact: 'Your team stays in control' },
  ],
  'us-ai-automation-agency': [
    { title: 'Custom AI automation', body: 'n8n and AI systems built around the workflows your US B2B team runs.', roiImpact: 'Built around your workflows' },
    { title: 'Document & revenue ops', body: 'From document processing to RevOps, delivered by one partner.', roiImpact: 'One team across many workflows' },
    { title: 'Secure & owned', body: 'Deployed on infrastructure you own, audit-ready from day one.', roiImpact: 'Data sovereignty by default' },
  ],
};

export function getSolutions(slug: string): SolutionCard[] | undefined {
  return SOLUTIONS[slug];
}

/**
 * Pain points shown as "The problem" chips on use-case pages (function + industry).
 * This is the signature element that distinguishes a use-case layout from a service
 * layout — services lead with capabilities, use cases lead with the problem.
 */
export const PAINS: Record<string, string[]> = {
  // Industries
  'legal-due-diligence-automation': ['Associates burning hours on manual document review', 'Risk clauses slipping through under deadline pressure', 'Due-diligence cycles that don’t scale with deal flow', 'Matter intake bottlenecked on paralegal triage', 'Sensitive client data that can’t leave your DMS', 'No audit trail across thousands of documents'],
  'cpa-tax-document-automation': ['Preparers buried in manual data entry at peak season', 'Client capacity capped by headcount, not demand', 'Receipts and statements reconciled by hand', 'Errors that surface late and cost review time', 'No clean audit trail across thousands of documents', 'Advisory work crowded out by typing'],
  'insurance-claims-triage-automation': ['FNOL intake handled manually across channels', 'Claims sitting in a queue before first action', 'Severity assessed inconsistently by adjusters', 'Subrogation opportunities missed across the book', 'Cycle times stretching as volume grows', 'Re-keying between core systems'],
  'financial-services-automation': ['Onboarding and KYC stuck in manual collection', 'Reconciliation done in spreadsheets', 'Regulatory reporting assembled by hand', 'Compliance gaps with no audit trail', 'Data trapped in disconnected systems', 'Analysts re-keying instead of analysing'],
  'vc-pe-crm-automation': ['Analysts re-keying metrics from decks and data rooms', 'Portfolio KPIs collected by hand each quarter', 'Affinity going stale without manual logging', 'Deal screening capped by analyst hours', 'No single view of relationships across the firm', 'Diligence data scattered across tools'],
  'property-management-automation': ['Reserve studies taking hours of manual reporting', 'Maintenance requests triaged by hand', 'Owner and tenant reports compiled manually', 'Vendor dispatch slowed by coordination', 'Data scattered across portals and spreadsheets', 'Reporting that doesn’t scale with the portfolio'],
  'pharma-life-sciences-automation': ['Regulatory documents reviewed manually under deadline', 'Research data transcribed by hand', 'Compliance-heavy workflows with no automation', 'Slow internal response to regulatory change', 'Validation and audit controls hard to maintain', 'Knowledge locked in unsearchable documents'],
  'd2c-ecommerce-automation': ['Orders and inventory synced manually across channels', 'Support tickets piling up faster than the team', 'Inventory drift causing oversells and stockouts', 'No personalization at scale', 'Headcount rising with order volume', 'Pricing updated by hand across channels'],
  // Functions
  'finance-automation': ['Invoices coded and approved by hand', 'Month-end close dragging on reconciliations', 'Reporting built from stale spreadsheets', 'Expenses chased manually for compliance', 'No real-time view of cash flow', 'Controls that depend on someone remembering'],
  'operations-automation': ['Work stuck in inbox approvals and handoffs', 'The same data re-keyed between systems', 'Status updates chased manually', 'Bottlenecks that scale with volume, not value', 'No visibility into where work stalls', 'Tribal knowledge instead of repeatable process'],
  'customer-support-automation': ['Routine tickets eating agent time', 'Slow first-response times', 'Inconsistent answers across the team', 'Context scattered across tools', 'Cost per ticket rising with volume', 'No deflection of repetitive questions'],
  'hr-automation': ['Screening and shortlisting done manually', 'Interview scheduling ping-pong', 'Onboarding paperwork handled by hand', 'HR documents generated one by one', 'Candidate experience slipping under load', 'Compliance steps tracked in spreadsheets'],
};

export function getPains(slug: string): string[] | undefined {
  return PAINS[slug];
}
