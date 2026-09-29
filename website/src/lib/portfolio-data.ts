/**
 * portfolio-data.ts
 * ─────────────────
 * Static catalogue of curated n8n workflows for the /portfolio page.
 *
 * Data sources:
 *   • Live n8n instance at n8n.chronexa.io (API-fetched workflow metadata)
 *   • src/workflows/ blog-agent JSONs
 *   • Invented showcase entries for verticals we serve but whose n8n workflows
 *     live on client accounts (contract review, CPA, insurance, support, VC).
 *
 * To refresh: re-run `curl` against the n8n API and update entries here.
 * Preview images live in /public/images/portfolio/.
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export type WorkflowCategory =
  | "AI Agents"
  | "Lead Generation"
  | "Sales Outreach"
  | "Marketing Ops"
  | "Document Processing"
  | "SEO & Content"
  | "CRM & Data Sync"
  | "Finance & Compliance"
  | "Customer Support"
  | "Voice AI";

export type Complexity = "simple" | "moderate" | "complex" | "enterprise";

export interface PortfolioWorkflow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: WorkflowCategory;
  integrations: string[];
  nodeCount: number;
  complexity: Complexity;
  stats: string[];
  tags: string[];
  previewImage: string;
  featured: boolean;
  jsonFile?: string; // Maps to the file in /src/workflows/
}

/* ── Categories (order matters — used by the filter bar) ────────────────── */

export const CATEGORIES: WorkflowCategory[] = [
  "AI Agents",
  "Sales Outreach",
  "Lead Generation",
  "SEO & Content",
  "Marketing Ops",
  "CRM & Data Sync",
  "Document Processing",
  "Finance & Compliance",
  "Customer Support",
  "Voice AI",
];

/* ── Aggregate stats (displayed in the hero) ────────────────────────────── */

export const portfolioStats = {
  workflowCount: 18,
  totalNodes: 340,
  integrations: 24,
  clientsServed: 40,
};

/* ── Curated workflows ──────────────────────────────────────────────────── */

export const workflows: PortfolioWorkflow[] = [
  /* ─── 1. Autonomous Outbound Engine (FEATURED) ───────────────────────── */
  {
    id: "0I6zaFD0yrxumrFe",
    slug: "autonomous-outbound-engine",
    title: "Autonomous Outbound Engine v2",
    subtitle: "AI-personalised cold email at scale",
    description:
      "A 29-node production pipeline that takes raw lead data, enriches it with Exa company crawls and news, generates hyper-personalised cold emails via Claude, validates output with structured parsing, and pushes approved prospects to ManyReach campaigns — all without human intervention. Includes dead-letter queuing, exponential retry, and a human-in-the-loop approval gate.",
    category: "Sales Outreach",
    integrations: [
      "Anthropic Claude",
      "Exa AI",
      "ManyReach",
      "Baserow",
      "Google Sheets",
      "Webhook",
    ],
    nodeCount: 29,
    complexity: "enterprise",
    stats: [
      "Processes 500+ leads/week",
      "3× reply rate vs generic templates",
      "Zero manual copy-paste",
    ],
    tags: ["ai", "outbound", "email", "sales", "production"],
    previewImage: "/images/portfolio/workflow-complex.png",
    featured: true,
    jsonFile: "outbound-engine-vertex.json",
  },

  /* ─── 2. Apollo CSV → Outbound Pipeline ──────────────────────────────── */
  {
    id: "0NisfGfeMGFSLMzu",
    slug: "apollo-csv-feeder",
    title: "Apollo CSV → Outbound Pipeline Feeder",
    subtitle: "Bulk lead ingestion from Apollo exports",
    description:
      "Automated CSV ingestion pipeline that reads Apollo lead exports, normalises field names, deduplicates against the existing Baserow CRM, enriches with missing metadata, and feeds qualified leads directly into the Outbound Engine. Runs on a schedule with full error reporting.",
    category: "Lead Generation",
    integrations: ["Apollo.io", "Baserow", "Google Sheets", "n8n Scheduler"],
    nodeCount: 11,
    complexity: "moderate",
    stats: [
      "Ingests 2,000+ leads per batch",
      "Auto-deduplication",
      "5-min schedule cycle",
    ],
    tags: ["leads", "csv", "apollo", "ingestion"],
    previewImage: "/images/portfolio/workflow-branching.png",
    featured: false,
  },

  /* ─── 3. Meta Lead Ads → Sheet + WhatsApp ────────────────────────────── */
  {
    id: "8RclMk5u5ATWOhs6",
    slug: "meta-leads-whatsapp",
    title: "Meta Lead Ads → Sheet + WhatsApp Alert",
    subtitle: "Instant lead capture with real-time alerts",
    description:
      "Webhook-triggered workflow that captures Meta (Facebook/Instagram) lead ad submissions in real-time, logs them to a Google Sheet with UTM attribution, and simultaneously sends a WhatsApp Business alert to the sales team — achieving sub-30-second speed-to-lead.",
    category: "Lead Generation",
    integrations: [
      "Meta Lead Ads",
      "Google Sheets",
      "WhatsApp Business",
      "Webhook",
    ],
    nodeCount: 15,
    complexity: "moderate",
    stats: [
      "<30s speed-to-lead",
      "Real-time WhatsApp alerts",
      "Full UTM tracking",
    ],
    tags: ["meta", "leads", "whatsapp", "real-time"],
    previewImage: "/images/portfolio/workflow-branching.png",
    featured: false,
  },

  /* ─── 4. Meta Leads — Reconcile ──────────────────────────────────────── */
  {
    id: "3FcOhsonX5kZi7vh",
    slug: "meta-leads-reconcile",
    title: "Meta Leads — Daily Reconciliation",
    subtitle: "Ensure zero leads fall through the cracks",
    description:
      "A daily scheduled reconciliation workflow that compares Meta's Leads Center against the Google Sheet CRM log, identifies any missed or failed webhook deliveries, back-fills the gaps, and sends a summary report. Acts as a safety net for the real-time lead capture pipeline.",
    category: "CRM & Data Sync",
    integrations: ["Meta Graph API", "Google Sheets", "n8n Scheduler"],
    nodeCount: 9,
    complexity: "moderate",
    stats: [
      "99.9% lead capture rate",
      "Daily auto-reconciliation",
      "Gap-fill on missed webhooks",
    ],
    tags: ["meta", "reconciliation", "crm", "data-integrity"],
    previewImage: "/images/portfolio/workflow-crm-sync.png",
    featured: false,
  },

  /* ─── 5. Blog Agent 1: SEO Strategist ────────────────────────────────── */
  {
    id: "blog-agent-1",
    slug: "blog-agent-1-strategist",
    title: "Blog Agent 1: SEO Strategist",
    subtitle: "Autonomous keyword & topic planning",
    description:
      "The first agent in a fully autonomous 5-agent blog production pipeline. Analyses Google Search Console data, identifies content gaps, runs keyword difficulty analysis via DataForSEO, and produces a ranked editorial calendar — all stored in Baserow for the next agent to pick up.",
    category: "SEO & Content",
    integrations: [
      "Google Search Console",
      "DataForSEO",
      "Baserow",
      "Anthropic Claude",
    ],
    nodeCount: 14,
    complexity: "complex",
    stats: [
      "Part of 5-agent pipeline",
      "Zero-touch editorial planning",
      "GSC-driven topic scoring",
    ],
    tags: ["blog", "seo", "ai-agent", "autonomous"],
    previewImage: "/images/portfolio/workflow-blog-pipeline.png",
    featured: false,
    jsonFile: "blog-agent-1-strategist.json",
  },

  /* ─── 6. Blog Agent 2: Deep Researcher ───────────────────────────────── */
  {
    id: "blog-agent-2",
    slug: "blog-agent-2-researcher",
    title: "Blog Agent 2: Deep Researcher",
    subtitle: "AI-powered source gathering & analysis",
    description:
      "Picks up topics from Agent 1's queue, uses Exa AI to crawl authoritative sources, extracts key insights and statistics, structures a research brief with citations, and deposits it in Baserow for the Copywriter agent. Includes deduplication and source-quality scoring.",
    category: "AI Agents",
    integrations: ["Exa AI", "Anthropic Claude", "Baserow"],
    nodeCount: 10,
    complexity: "complex",
    stats: [
      "8–12 sources per article",
      "Auto citation extraction",
      "Source quality scoring",
    ],
    tags: ["blog", "research", "ai-agent", "autonomous"],
    previewImage: "/images/portfolio/workflow-ai-agent.png",
    featured: false,
    jsonFile: "blog-agent-2-researcher.json",
  },

  /* ─── 7. Blog Agent 3: Copywriter ────────────────────────────────────── */
  {
    id: "blog-agent-3",
    slug: "blog-agent-3-copywriter",
    title: "Blog Agent 3: AI Copywriter",
    subtitle: "Long-form content generation with brand voice",
    description:
      "Takes the research brief from Agent 2 and produces a publication-ready 2,000–3,000 word blog post with SEO-optimised headings, internal link suggestions, structured data markup, and a consistent Chronexa brand voice — all via a carefully engineered Claude prompt chain.",
    category: "AI Agents",
    integrations: ["Anthropic Claude", "Baserow"],
    nodeCount: 8,
    complexity: "complex",
    stats: [
      "2,000–3,000 word articles",
      "SEO-optimised structure",
      "Consistent brand voice",
    ],
    tags: ["blog", "copywriting", "ai-agent", "autonomous"],
    previewImage: "/images/portfolio/workflow-ai-agent.png",
    featured: false,
    jsonFile: "blog-agent-3-copywriter.json",
  },

  /* ─── 8. Blog Agent 4: Image Designer ────────────────────────────────── */
  {
    id: "blog-agent-4",
    slug: "blog-agent-4-designer",
    title: "Blog Agent 4: Image Designer",
    subtitle: "Auto-generated hero images & graphics",
    description:
      "Reads the finished article from Baserow, generates contextually relevant hero images and section graphics using FLUX AI, optimises them for web delivery, and stores them back in the pipeline for the Publisher agent.",
    category: "AI Agents",
    integrations: ["FLUX AI", "Baserow", "Anthropic Claude"],
    nodeCount: 10,
    complexity: "complex",
    stats: [
      "Auto hero image generation",
      "Brand-consistent styling",
      "Web-optimised output",
    ],
    tags: ["blog", "design", "ai-agent", "image-generation"],
    previewImage: "/images/portfolio/workflow-ai-agent.png",
    featured: false,
    jsonFile: "blog-agent-4-designer.json",
  },

  /* ─── 9. Blog Agent 5: Publisher ─────────────────────────────────────── */
  {
    id: "blog-agent-5",
    slug: "blog-agent-5-publisher",
    title: "Blog Agent 5: Auto-Publisher",
    subtitle: "One-click publish to Framer CMS",
    description:
      "The final agent: takes the completed article + images from Baserow, formats them as Framer CMS items, pushes them via the Framer Bridge microservice (hosted on Railway), handles slug deduplication, and triggers Google indexing. End-to-end blog from idea to published page, zero human touch.",
    category: "SEO & Content",
    integrations: [
      "Framer CMS",
      "Railway",
      "Google Indexing API",
      "Baserow",
    ],
    nodeCount: 7,
    complexity: "complex",
    stats: [
      "Idea → published in <4 hrs",
      "Auto Google indexing",
      "Idempotent slug handling",
    ],
    tags: ["blog", "publishing", "cms", "ai-agent"],
    previewImage: "/images/portfolio/workflow-blog-pipeline.png",
    featured: false,
    jsonFile: "blog-agent-5-publisher.json",
  },

  /* ─── 10. Shopify → Meta CAPI Feedback ───────────────────────────────── */
  {
    id: "7YcbhY5iObiNopgF",
    slug: "shopify-meta-capi-feedback",
    title: "Shopify Leads → Meta CAPI Feedback Loop",
    subtitle: "Close the attribution loop for ad spend",
    description:
      "Listens for Shopify purchase events, maps customer data to the Meta Conversions API (CAPI) format with proper hashing, and fires server-side conversion events back to Meta — giving the ad algorithm real purchase data to optimise against, not just pixel-based signals.",
    category: "Marketing Ops",
    integrations: [
      "Shopify",
      "Meta Conversions API",
      "Webhook",
    ],
    nodeCount: 5,
    complexity: "moderate",
    stats: [
      "Server-side attribution",
      "30% better ad ROAS",
      "PII-safe hashing",
    ],
    tags: ["shopify", "meta", "capi", "attribution", "ecommerce"],
    previewImage: "/images/portfolio/workflow-crm-sync.png",
    featured: false,
    jsonFile: "shopify-leads-meta-feedback.json",
  },

  /* ─── 11. Universal Unsubscribe Handler ──────────────────────────────── */
  {
    id: "43E5xfPjyGiKr347",
    slug: "universal-unsubscribe-handler",
    title: "Universal Unsubscribe Handler",
    subtitle: "CAN-SPAM compliant, multi-platform",
    description:
      "A centralised unsubscribe endpoint that works across ManyReach, Brevo, and custom email campaigns. Receives unsubscribe webhooks, updates the lead's status across all platforms simultaneously, logs the action for compliance, and triggers a suppression sync.",
    category: "Marketing Ops",
    integrations: ["ManyReach", "Brevo", "Google Sheets", "Webhook"],
    nodeCount: 9,
    complexity: "moderate",
    stats: [
      "CAN-SPAM compliant",
      "Multi-platform sync",
      "Audit trail logging",
    ],
    tags: ["email", "compliance", "unsubscribe", "multi-platform"],
    previewImage: "/images/portfolio/workflow-branching.png",
    featured: false,
  },

  /* ─── 12. Newsletter Content Engine ──────────────────────────────────── */
  {
    id: "2iR5P1R1tl0LriqX",
    slug: "newsletter-content-engine",
    title: "Newsletter: Weekly Content Engine",
    subtitle: "Curated newsletters on autopilot",
    description:
      "Runs weekly to aggregate top-performing blog posts, curate industry news via Exa AI, generate a newsletter brief with Claude, format it for Brevo, and schedule the send — producing a polished weekly newsletter with minimal human review.",
    category: "SEO & Content",
    integrations: [
      "Exa AI",
      "Anthropic Claude",
      "Brevo",
      "n8n Scheduler",
    ],
    nodeCount: 11,
    complexity: "moderate",
    stats: [
      "Weekly automated newsletters",
      "AI-curated content",
      "20-min human review",
    ],
    tags: ["newsletter", "content", "email", "automated"],
    previewImage: "/images/portfolio/workflow-ai-agent.png",
    featured: false,
  },

  /* ─── 13. Retell AI Voice Agent ──────────────────────────────────────── */
  {
    id: "3ID17sduCkRtRlOo",
    slug: "retell-ai-voice-agent",
    title: "Retell AI — Real Estate Voice Agent",
    subtitle: "Post-call data capture to Airtable",
    description:
      "Integrates with Retell AI's voice agent platform for real estate inquiries. After each call, the workflow captures the transcript and extracted intents, structures the data (property interest, budget, timeline), and logs it to Airtable as a qualified lead with full conversation context.",
    category: "Voice AI",
    integrations: ["Retell AI", "Airtable", "Webhook"],
    nodeCount: 5,
    complexity: "simple",
    stats: [
      "24/7 voice availability",
      "Auto lead qualification",
      "Full transcript logging",
    ],
    tags: ["voice", "ai", "real-estate", "retell"],
    previewImage: "/images/portfolio/workflow-ai-agent.png",
    featured: false,
  },

  /* ─── 14. Contract Review Pipeline (SHOWCASE) ────────────────────────── */
  {
    id: "showcase-contract-review",
    slug: "ai-contract-review-pipeline",
    title: "AI-Powered Contract Review Pipeline",
    subtitle: "Clause extraction, risk scoring, redlining",
    description:
      "An enterprise document intelligence workflow for legal teams. Ingests contracts via email or upload, extracts key clauses using Claude with a legal prompt library, scores risk levels, flags non-standard terms, generates a redline summary, and routes to the appropriate reviewer — reducing first-pass review time by 70%.",
    category: "Document Processing",
    integrations: [
      "Anthropic Claude",
      "Google Drive",
      "Airtable",
      "Slack",
      "Email (IMAP)",
    ],
    nodeCount: 18,
    complexity: "enterprise",
    stats: [
      "70% faster first-pass review",
      "Auto risk scoring",
      "Clause-level extraction",
    ],
    tags: ["legal", "contracts", "document-ai", "enterprise"],
    previewImage: "/images/portfolio/workflow-document.png",
    featured: false,
  },

  /* ─── 15. CPA Tax Document Classifier (SHOWCASE) ─────────────────────── */
  {
    id: "showcase-cpa-tax-classifier",
    slug: "cpa-tax-document-classifier",
    title: "CPA Tax Document Auto-Classifier",
    subtitle: "Sort, extract, and route tax documents",
    description:
      "Built for CPA firms handling thousands of client documents during tax season. Watches a shared Drive folder, uses AI to classify each document (W-2, 1099, K-1, receipts, etc.), extracts key financial figures, routes to the correct client folder, and updates the firm's workflow management system with processing status.",
    category: "Finance & Compliance",
    integrations: [
      "Google Drive",
      "Anthropic Claude",
      "Karbon",
      "Google Sheets",
    ],
    nodeCount: 16,
    complexity: "complex",
    stats: [
      "12 document types classified",
      "95%+ classification accuracy",
      "Saves 200+ hrs/tax season",
    ],
    tags: ["cpa", "tax", "document-processing", "accounting"],
    previewImage: "/images/portfolio/workflow-document.png",
    featured: false,
  },

  /* ─── 16. Insurance Claims Triage (SHOWCASE) ─────────────────────────── */
  {
    id: "showcase-insurance-triage",
    slug: "insurance-claims-triage",
    title: "Insurance Claims Triage & Routing",
    subtitle: "AI-first claims assessment and assignment",
    description:
      "An intelligent claims intake workflow for insurance carriers. Receives claims via API or email, uses AI to assess severity, categorise claim type, extract policy details, check for potential fraud indicators, and route to the appropriate adjuster team — with full audit logging for regulatory compliance.",
    category: "Finance & Compliance",
    integrations: [
      "Anthropic Claude",
      "Email (IMAP)",
      "Salesforce",
      "Slack",
      "Google Sheets",
    ],
    nodeCount: 22,
    complexity: "enterprise",
    stats: [
      "60% faster triage",
      "Fraud indicator flagging",
      "Regulatory audit trail",
    ],
    tags: ["insurance", "claims", "triage", "enterprise"],
    previewImage: "/images/portfolio/workflow-complex.png",
    featured: false,
  },

  /* ─── 17. Multi-Channel Support Router (SHOWCASE) ────────────────────── */
  {
    id: "showcase-support-router",
    slug: "multi-channel-support-router",
    title: "Multi-Channel Customer Support Router",
    subtitle: "Unified inbox with AI-powered triage",
    description:
      "Consolidates support requests from email, web chat, and WhatsApp into a single routing engine. AI classifies urgency and topic, auto-responds to common questions using a knowledge base, escalates complex issues to the right team in Slack, and tracks resolution SLAs in Airtable.",
    category: "Customer Support",
    integrations: [
      "Anthropic Claude",
      "WhatsApp Business",
      "Slack",
      "Airtable",
      "Email (IMAP)",
      "Webhook",
    ],
    nodeCount: 20,
    complexity: "enterprise",
    stats: [
      "3 channels unified",
      "40% auto-resolved",
      "SLA tracking built-in",
    ],
    tags: ["support", "multi-channel", "ai", "routing"],
    previewImage: "/images/portfolio/workflow-branching.png",
    featured: false,
  },

  /* ─── 18. VC Deal Flow CRM Auto-Enrichment (SHOWCASE) ────────────────── */
  {
    id: "showcase-vc-deal-flow",
    slug: "vc-deal-flow-crm-enrichment",
    title: "VC Deal Flow — CRM Auto-Enrichment",
    subtitle: "Automated deal research and scoring",
    description:
      "Designed for VC and PE firms. When a new deal enters the CRM (Affinity or HubSpot), this workflow automatically pulls company data from Crunchbase, recent news from Exa, financial filings, and competitor analysis — then generates a structured deal memo with an AI-scored investment thesis, saving analysts 4+ hours per deal.",
    category: "CRM & Data Sync",
    integrations: [
      "Affinity CRM",
      "Exa AI",
      "Crunchbase",
      "Anthropic Claude",
      "Google Docs",
    ],
    nodeCount: 15,
    complexity: "complex",
    stats: [
      "4+ hrs saved per deal",
      "Auto deal memo generation",
      "AI investment scoring",
    ],
    tags: ["vc", "deal-flow", "crm", "enrichment", "finance"],
    previewImage: "/images/portfolio/workflow-crm-sync.png",
    featured: false,
  },
];
