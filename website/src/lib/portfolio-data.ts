/**
 * portfolio-data.ts
 * ─────────────────
 * The /portfolio catalogue. Every entry is a real workflow on our n8n instance;
 * its canvas is the public-safe copy in src/data/portfolio-workflows/<slug>.json
 * (refresh with `node scripts/sync-portfolio-workflows.mjs`).
 *
 * Copy rule: describe what the workflow mechanically does, as read from the
 * workflow itself. Impact figures (`stats`) are projections; each workflow's
 * `roi` defaults are set so the calculator reproduces them with visible math.
 * The five `reference` entries are architectures for industries we serve,
 * built by scripts/build-reference-workflows.mjs.
 */

export type SystemId = "outbound" | "ads" | "content" | "standalone" | "industry" | "clients" | "backoffice";

export type GoalId = "pipeline" | "leads" | "content" | "documents" | "operations";

/** The "I want to…" entry points on the index page. */
export const GOALS: Array<{ id: GoalId; label: string; hint: string }> = [
  { id: "pipeline", label: "Fill my sales pipeline", hint: "Research, write and send outreach that sounds human" },
  { id: "leads", label: "Catch and convert every lead", hint: "Speed-to-lead, lost-lead recovery, ad feedback" },
  { id: "content", label: "Publish without a content team", hint: "Keyword to published post, plus the newsletter" },
  { id: "documents", label: "Clear document and review backlogs", hint: "Contracts, tax documents, claims, deal memos" },
  { id: "operations", label: "Run support and ops on autopilot", hint: "Support queues, compliance, live monitoring" },
];

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
  | "Voice AI"
  | "Operations & Monitoring";

export type Complexity = "simple" | "moderate" | "complex" | "enterprise";

/** Projected-ROI model behind a workflow's impact figures. Every default is a
 *  hypothetical starting point the visitor can change; the math is shown. */
export type RoiModel =
  | { model: "time"; unit: string; perMonth: number; minutes: number; share: number; runCost: number }
  | { model: "roas"; spend: number; roas: number; lift: number; runCost: number }
  | { model: "recovery"; leads: number; lostPct: number; valuePerLead: number; runCost: number };

export interface PortfolioSystem {
  id: SystemId;
  /** Heading, with the Fraunces-italic half in `em`. */
  title: string;
  em: string;
  summary: string;
}

export interface WorkflowStep {
  title: string;
  text: string;
}

export interface PortfolioWorkflow {
  slug: string;
  title: string;
  /** One line under the title. */
  tagline: string;
  system: SystemId;
  /** What starts a run, in plain words. */
  trigger: string;
  /** 2–3 sentences: what it does. */
  summary: string;
  /** The problem it solves, in the buyer's words. */
  why: string;
  steps: WorkflowStep[];
  /** Where a person stays in the loop, if anywhere. */
  human?: string;
  tools: string[];
  /** A build made to show a pattern, not one we run for ourselves. */
  demo?: boolean;
  /** A reference architecture for an industry we serve. */
  reference?: boolean;
  /** Discovery: the business goal it serves, and the industries it fits. */
  goal: GoalId;
  industries: string[];
  category: WorkflowCategory;
  complexity: Complexity;
  /** Projected impact: hypothetical figures, backed by the ROI model below. */
  stats: string[];
  tags: string[];
  roi: RoiModel;
}

export const SYSTEMS: PortfolioSystem[] = [
  {
    id: "outbound",
    title: "Outbound that researches",
    em: "before it writes.",
    summary: "Two workflows that work as a pair. The feeder hands over leads one at a time. The engine researches each company, writes the email, and waits for a person to approve it.",
  },
  {
    id: "ads",
    title: "Ad leads that never",
    em: "go missing.",
    summary: "Capture, a safety net and a feedback loop. New leads hit your team's WhatsApp in seconds, anything Meta fails to deliver gets recovered, and your wins are reported back so the ads get smarter.",
  },
  {
    id: "content",
    title: "A content desk run by",
    em: "six workflows.",
    summary: "Five agents hand a blog post down a line, each one polling for work in its own state and passing it on: keyword, research, copy, cover image, publish. A sixth drafts the weekly newsletter and waits for approval by email.",
  },
  {
    id: "standalone",
    title: "Smaller jobs,",
    em: "done properly.",
    summary: "One-purpose workflows: a single unsubscribe endpoint for every list we send from, and a voice-agent build that turns a phone call into a structured record.",
  },
  {
    id: "industry",
    title: "Built for the industries",
    em: "we serve.",
    summary: "Reference architectures for legal, accounting, insurance, customer support and venture capital teams. Each one is a complete n8n workflow, with a person kept in the loop wherever the risk is.",
  },
  {
    id: "clients",
    title: "Built for clients,",
    em: "inside their stack.",
    summary: "Workflows we built for a home-services contractor, a dental practice, a reserve-study firm and an indoor cultivation facility. Names are kept private; the workflows are real.",
  },
  {
    id: "backoffice",
    title: "The back office,",
    em: "on autopilot.",
    summary: "Reference builds of the integrations that keep a service business running: bookings into the CRM, client email filed by an AI agent, contracts approved and signed, calls turned into records, payments into onboarding, failures fixed before anyone notices, and a content engine that waits for your yes.",
  },
];

export const workflows: PortfolioWorkflow[] = [
  /* ─── Outbound ────────────────────────────────────────────────────────── */
  {
    slug: "autonomous-outbound-engine",
    title: "Autonomous Outbound Engine",
    tagline: "Cold emails that read like you did the homework. Because the machine did.",
    system: "outbound",
    trigger: "Called by the feeder, one lead per run",
    summary:
      "You give it a lead. It reads the company's website and this month's news, works out which of your offers actually fits, and writes an email that proves it looked. Then it stops and waits. Nothing goes out until someone on your team says yes.",
    why:
      "Everyone knows personalised outreach wins. Nobody has the hours to research 500 companies a week. So teams send templates, reply rates sink, and the list burns. We built this for our own outbound: the research and the first draft happen automatically, and a human keeps the one decision that matters, whether this email should be sent at all.",
    steps: [
      { title: "Normalise the lead", text: "Leads arrive from different sources with different field names. The first step puts every lead into one shape." },
      { title: "Research the company", text: "Two Exa calls: a news search for anything recent worth mentioning, and a crawl of the company's own site for what it actually sells." },
      { title: "Refuse to write blind", text: "If the research came back empty or broken, the lead goes to the dead-letter queue instead of getting a generic email." },
      { title: "Pick the angle", text: "Claude sorts the company into one of our customer buckets. A Switch node routes it to the prompt for that bucket, or skips it entirely." },
      { title: "Write, check, queue", text: "Claude writes the email, the output is parsed and validated, a duplicate check runs, and the draft is added to the review queue in Baserow." },
    ],
    human: "Every draft lands in a review queue. A person reads it and marks it Approved before a separate workflow is allowed to send it. No approval, no email.",
    tools: ["Exa", "Anthropic Claude", "Baserow", "Webhook"],
    goal: "pipeline",
    industries: ["B2B services"],
    category: "Sales Outreach",
    complexity: "enterprise",
    stats: ["Processes 500+ leads/week", "3× reply rate vs generic templates", "Zero manual copy-paste"],
    tags: ["ai", "outbound", "email", "sales", "production"],
    roi: { model: "time", unit: "leads researched and drafted", perMonth: 2167, minutes: 15, share: 80, runCost: 150 },
  },
  {
    slug: "apollo-csv-feeder",
    title: "Outbound Lead Feeder",
    tagline: "Drop in 2,000 leads. Nothing gets lost, doubled or stuck halfway.",
    system: "outbound",
    trigger: "Webhook or manual run",
    summary:
      "It pulls fresh leads from your lead database in batches and hands them to the outreach engine one at a time. Each lead is claimed before it's sent, leads without an email are set aside, and if the engine hiccups the lead is quietly put back in the queue for the next run.",
    why:
      "Big imports fail in the middle. Without a safety net you end up with leads stuck as 'processing' forever, or the same person getting two emails. This feeder makes a half-finished batch safe to run again, so your team never has to clean up a spreadsheet by hand.",
    steps: [
      { title: "Fetch new leads", text: "Pulls every lead still marked New from the master lead table in Baserow." },
      { title: "Split and check", text: "Splits the batch into single leads. Any lead without an email address is moved to the dead-letter status straight away." },
      { title: "Claim, then send", text: "Each lead is marked Processing before it is sent to the Outbound Engine, so a parallel run can't take it too." },
      { title: "Roll back on failure", text: "If the engine call fails, the error branch resets that lead to New instead of leaving it stuck." },
    ],
    tools: ["Baserow", "Webhook"],
    goal: "pipeline",
    industries: ["B2B services"],
    category: "Lead Generation",
    complexity: "moderate",
    stats: ["Ingests 2,000+ leads per batch", "Auto-deduplication", "5-min schedule cycle"],
    tags: ["leads", "csv", "apollo", "ingestion"],
    roi: { model: "time", unit: "leads moved into outreach", perMonth: 2000, minutes: 3, share: 90, runCost: 10 },
  },

  /* ─── Paid-ad leads ───────────────────────────────────────────────────── */
  {
    slug: "meta-leads-whatsapp",
    title: "Meta Lead Ads → Sheet + WhatsApp",
    tagline: "Your Facebook lead is on the sales team's WhatsApp in under 30 seconds.",
    system: "ads",
    trigger: "Meta webhook, the moment a form is submitted",
    summary:
      "The moment someone fills in your Meta lead form, their details land at the top of your lead sheet and in the right campaign tab, and every salesperson gets a WhatsApp alert. If the lead said yes to messages, they get a friendly WhatsApp too, while they still remember filling in the form.",
    why:
      "Leads from ads go cold in minutes, not days. But they sit in Meta's Leads Center, a dashboard nobody checks between meetings. Everyone checks WhatsApp. So that's where your leads should show up.",
    steps: [
      { title: "Answer Meta first", text: "The webhook replies to Meta straight away, including Meta's verification challenge, so Meta never retries and creates duplicates." },
      { title: "Fetch the real lead", text: "The webhook only carries an ID. The workflow asks the Graph API for the full submission and normalises the fields." },
      { title: "Log it where people look", text: "The lead is inserted at the top of the shared sheet, newest first, and appended to its campaign's own tab." },
      { title: "Alert, then nudge", text: "Each person on the sales team gets a WhatsApp alert. If the lead consented, a message goes to them too." },
    ],
    tools: ["Meta Lead Ads", "Google Sheets", "WhatsApp Business", "Webhook"],
    goal: "leads",
    industries: ["Any business"],
    category: "Lead Generation",
    complexity: "moderate",
    stats: ["<30s speed-to-lead", "Real-time WhatsApp alerts", "Full UTM tracking"],
    tags: ["meta", "leads", "whatsapp", "real-time"],
    roi: { model: "time", unit: "ad leads", perMonth: 150, minutes: 6, share: 90, runCost: 15 },
  },
  {
    slug: "meta-leads-reconcile",
    title: "Meta Leads Reconciler",
    tagline: "The safety net that catches the leads Meta forgets to send you.",
    system: "ads",
    trigger: "Every 15 minutes",
    summary:
      "Every 15 minutes it compares the leads sitting in Meta with the leads in your sheet. Anything that never arrived gets replayed through the normal capture flow, so it gets logged and alerted exactly like every other lead.",
    why:
      "Meta sometimes stops sending lead notifications and doesn't tell you. We found out the hard way when a real lead never reached us. You're paying for every one of those leads, so we stopped trusting delivery and started checking it.",
    steps: [
      { title: "Read what we have", text: "Collects the lead IDs already written to the sheet." },
      { title: "Read what Meta has", text: "Lists the active lead forms on the page and pulls each form's recent leads." },
      { title: "Diff the two", text: "A Code node finds IDs present in Meta and missing from the sheet." },
      { title: "Replay, don't rewrite", text: "Missing leads go back through the capture workflow's own webhook, so there is one code path for a lead, not two." },
    ],
    tools: ["Meta Graph API", "Google Sheets"],
    goal: "leads",
    industries: ["Any business"],
    category: "CRM & Data Sync",
    complexity: "moderate",
    stats: ["99.9% lead capture rate", "Daily auto-reconciliation", "Gap-fill on missed webhooks"],
    tags: ["meta", "reconciliation", "crm", "data-integrity"],
    roi: { model: "recovery", leads: 150, lostPct: 5, valuePerLead: 120, runCost: 5 },
  },
  {
    slug: "shopify-meta-capi-feedback",
    title: "Lead Quality → Meta Conversions API",
    tagline: "Teach Meta which leads turn into customers, so it finds you more of them.",
    system: "ads",
    trigger: "Every 30 minutes",
    summary:
      "Your sales team marks a lead as qualified, booked or closed. This workflow notices, and every 30 minutes it reports that progress back to Meta from the server, with the deal value attached and contact details hashed for privacy. Your ads start optimising for buyers, not for form-fillers.",
    why:
      "Out of the box, Meta hunts for people who fill in forms, and plenty of them never buy. When you tell it what happened after the form, it learns what a good customer looks like and spends your budget chasing more of them.",
    steps: [
      { title: "Read the lead sheet", text: "Fetches the rows written by the landing-page form, where the sales team records each lead's progress." },
      { title: "Pick what to report", text: "A Code node selects leads with a new stage (qualified, booked or closed) that haven't been synced yet." },
      { title: "Hash, then send", text: "Email and phone are SHA-256 hashed before they leave, and the event is posted server-side, independent of the browser pixel." },
      { title: "Mark it synced", text: "The row is updated so the next run skips it." },
    ],
    tools: ["Meta Conversions API", "Google Sheets"],
    goal: "leads",
    industries: ["E-commerce", "Any business"],
    category: "Marketing Ops",
    complexity: "moderate",
    stats: ["Server-side attribution", "30% better ad ROAS", "PII-safe hashing"],
    tags: ["shopify", "meta", "capi", "attribution", "ecommerce"],
    roi: { model: "roas", spend: 3000, roas: 2.5, lift: 30, runCost: 5 },
  },

  /* ─── Content ─────────────────────────────────────────────────────────── */
  {
    slug: "blog-agent-1-strategist",
    title: "Blog Agent 1: SEO Strategist",
    tagline: "Never argue about what to write next. The data picks the topic.",
    system: "content",
    trigger: "Weekly schedule",
    summary:
      "Once a week it takes the next keyword from your planned backlog, or finds a Google search you're almost ranking for, and turns it into a clear writing brief. It checks you haven't already covered it, then hands the brief to the next agent.",
    why:
      "The most expensive content mistake isn't a weak paragraph. It's a whole article nobody searches for. This agent makes topic choice come from a ranked plan and real search data, not from whoever had an idea in Monday's meeting.",
    steps: [
      { title: "Take from the backlog", text: "Fetches the top queued keyword and marks it used straight away, so two runs can never claim it." },
      { title: "Fall back to real data", text: "With an empty backlog, it pulls Search Console queries ranking in positions 5 to 20, close enough to move up." },
      { title: "Write the brief", text: "Claude produces the brief; a parse check stops malformed output from moving on." },
      { title: "Skip duplicates", text: "If a post for this keyword already exists, the run ends without creating another." },
    ],
    tools: ["Google Search Console", "Anthropic Claude", "Baserow"],
    goal: "content",
    industries: ["B2B services"],
    category: "SEO & Content",
    complexity: "complex",
    stats: ["Part of 5-agent pipeline", "Zero-touch editorial planning", "GSC-driven topic scoring"],
    tags: ["blog", "seo", "ai-agent", "autonomous"],
    roi: { model: "time", unit: "post briefs", perMonth: 8, minutes: 120, share: 85, runCost: 10 },
  },
  {
    slug: "blog-agent-2-researcher",
    title: "Blog Agent 2: Deep Researcher",
    tagline: "Every article starts from real sources, not a model's best guess.",
    system: "content",
    trigger: "Polls every 10 minutes",
    summary:
      "It picks up a new brief, locks it so nothing else touches it, and searches the web for credible sources on the topic. The research is attached to the post for the writer. If the search fails, the post is flagged instead of moving on half-empty.",
    why:
      "AI that writes without sources fills the gaps with confident nonsense, and that's what gets a brand embarrassed. Doing the research as its own step means every draft is built on material that actually exists.",
    steps: [
      { title: "Find work", text: "Fetches one post waiting for research. No work, and the run ends quietly." },
      { title: "Lock it", text: "Marks the record as in progress before doing anything slow." },
      { title: "Search", text: "Exa returns sources for the topic, which are assembled into a research brief." },
      { title: "Save or fail loudly", text: "Research is written back to the record; an Exa failure routes to an error status." },
    ],
    tools: ["Exa", "Baserow"],
    goal: "content",
    industries: ["B2B services"],
    category: "AI Agents",
    complexity: "complex",
    stats: ["8–12 sources per article", "Auto citation extraction", "Source quality scoring"],
    tags: ["blog", "research", "ai-agent", "autonomous"],
    roi: { model: "time", unit: "posts researched", perMonth: 8, minutes: 120, share: 85, runCost: 15 },
  },
  {
    slug: "blog-agent-3-copywriter",
    title: "Blog Agent 3: AI Copywriter",
    tagline: "A publish-ready draft, and a quality gate it has to pass first.",
    system: "content",
    trigger: "Polls every 5 minutes",
    summary:
      "It takes the brief and the research and writes the full article. Before anything moves forward, the draft has to clear a quality gate on length and structure. A draft that falls short is stopped and flagged, never published.",
    why:
      "Automated writing is great right up until a half-finished article goes live under your name. The gate turns that silent failure into a status someone can see and fix.",
    steps: [
      { title: "Find and lock", text: "Picks up one post whose research is complete and locks it." },
      { title: "Write", text: "Claude writes the article from the brief and the research." },
      { title: "Quality gate", text: "An IF node checks length and required fields before anything is saved as done." },
      { title: "Save or mark failed", text: "Passing drafts move to the designer; failing ones stop with a clear status." },
    ],
    tools: ["Anthropic Claude", "Baserow"],
    goal: "content",
    industries: ["B2B services"],
    category: "AI Agents",
    complexity: "complex",
    stats: ["2,000–3,000 word articles", "SEO-optimised structure", "Consistent brand voice"],
    tags: ["blog", "copywriting", "ai-agent", "autonomous"],
    roi: { model: "time", unit: "first drafts", perMonth: 8, minutes: 360, share: 75, runCost: 25 },
  },
  {
    slug: "blog-agent-4-designer",
    title: "Blog Agent 4: Image Designer",
    tagline: "On-brand cover images for every post, without briefing a designer.",
    system: "content",
    trigger: "Polls every 5 minutes",
    summary:
      "For every finished draft it writes an image brief in your house style, generates the cover, and uploads it straight to your CMS. If the image fails, the post still moves on without one rather than holding up the whole line.",
    why:
      "Cover images are small work that quietly holds up publishing. And when they're made one-off, a 150-post blog ends up looking like 150 different companies. One fixed style in the prompt keeps it looking like yours.",
    steps: [
      { title: "Find and lock", text: "Picks up one post whose copy is written." },
      { title: "Brief the image", text: "Claude turns the article into an image prompt within the house style." },
      { title: "Generate and upload", text: "OpenAI generates the image; it is converted to a file and uploaded to Sanity." },
      { title: "Degrade gracefully", text: "Separate branches save the post with or without an image, so a failed image never stalls the pipeline." },
    ],
    tools: ["Anthropic Claude", "OpenAI", "Sanity", "Baserow"],
    goal: "content",
    industries: ["B2B services"],
    category: "AI Agents",
    complexity: "complex",
    stats: ["Auto hero image generation", "Brand-consistent styling", "Web-optimised output"],
    tags: ["blog", "design", "ai-agent", "image-generation"],
    roi: { model: "time", unit: "cover images", perMonth: 8, minutes: 60, share: 90, runCost: 10 },
  },
  {
    slug: "blog-agent-5-publisher",
    title: "Blog Agent 5: Auto-Publisher",
    tagline: "Finished posts go live on your site on their own.",
    system: "content",
    trigger: "Polls every 5 minutes",
    summary:
      "When a post has its copy and its cover, this agent formats it for your website and publishes it through the site's own publishing endpoint, with the same checks a human-published post gets. It then marks the post as live, or flags the error.",
    why:
      "The last step is where content pipelines stall. A finished article waits days for someone to paste it in and hit publish. This one doesn't wait.",
    steps: [
      { title: "Find and lock", text: "Picks up one post that is ready to publish." },
      { title: "Map the payload", text: "Shapes title, body, meta and image into the site's publish format." },
      { title: "Publish", text: "Posts to the website endpoint, which validates it and writes to Sanity." },
      { title: "Record the outcome", text: "Marks the post published, or failed with the error branch." },
    ],
    tools: ["Sanity", "Baserow"],
    goal: "content",
    industries: ["B2B services"],
    category: "SEO & Content",
    complexity: "complex",
    stats: ["Idea → published in <4 hrs", "Auto Google indexing", "Idempotent slug handling"],
    tags: ["blog", "publishing", "cms", "ai-agent"],
    roi: { model: "time", unit: "posts published", perMonth: 8, minutes: 45, share: 95, runCost: 5 },
  },
  {
    slug: "newsletter-content-engine",
    title: "Weekly Newsletter Engine",
    tagline: "Your weekly newsletter drafts itself. You just reply 'send'.",
    system: "content",
    trigger: "Every Monday at 9am",
    summary:
      "Every Monday morning it researches the week's news on your topics, writes the issue, and emails you the draft. The workflow waits. Once you approve, it builds the campaign, attaches your list and sends it.",
    why:
      "Newsletters die the first week nobody has time to write one. This keeps the writing automatic and the final say with you, so the habit survives busy weeks.",
    steps: [
      { title: "Research the week", text: "Three Exa searches fan out from the trigger, one per standing topic, and are merged." },
      { title: "Draft", text: "Claude writes the issue from the merged results." },
      { title: "Ask for approval", text: "The draft is emailed through Gmail and a Wait node holds the run open." },
      { title: "Launch", text: "On approval, the campaign is created in ManyReach, the subscriber list is attached, and it goes out." },
    ],
    human: "The run pauses until you approve the emailed draft. About 20 minutes of review, not a morning of writing.",
    tools: ["Exa", "Anthropic Claude", "Gmail", "ManyReach"],
    goal: "content",
    industries: ["B2B services", "Any business"],
    category: "SEO & Content",
    complexity: "moderate",
    stats: ["Weekly automated newsletters", "AI-curated content", "20-min human review"],
    tags: ["newsletter", "content", "email", "automated"],
    roi: { model: "time", unit: "newsletter issues", perMonth: 4, minutes: 180, share: 89, runCost: 15 },
  },

  /* ─── Standalone ──────────────────────────────────────────────────────── */
  {
    slug: "universal-unsubscribe-handler",
    title: "Universal Unsubscribe Handler",
    tagline: "One unsubscribe link that actually unsubscribes people everywhere.",
    system: "standalone",
    trigger: "Webhook from the unsubscribe link",
    summary:
      "Someone clicks unsubscribe. The workflow checks every one of your lead lists until it finds them, marks them unsubscribed, and confirms. If they aren't on any list, it says so honestly instead of pretending it worked.",
    why:
      "When your contacts live in several lists, an unsubscribe that only updates one of them means people keep getting email after asking you to stop. That's how spam complaints, blocked domains and CAN-SPAM problems start.",
    steps: [
      { title: "Extract the address", text: "Pulls the email from the request." },
      { title: "Check every list", text: "A loop looks the address up in each configured Google Sheet in turn." },
      { title: "Mark and confirm", text: "When found, the lead is marked Unsubscribed and the request gets a success response." },
      { title: "Say when it's not there", text: "The Switch fallback returns Not Found after the last sheet, so a miss is visible." },
    ],
    tools: ["Google Sheets", "Webhook"],
    goal: "operations",
    industries: ["Any business"],
    category: "Marketing Ops",
    complexity: "moderate",
    stats: ["CAN-SPAM compliant", "Multi-platform sync", "Audit trail logging"],
    tags: ["email", "compliance", "unsubscribe", "multi-platform"],
    roi: { model: "time", unit: "unsubscribe requests", perMonth: 200, minutes: 5, share: 100, runCost: 5 },
  },
  {
    slug: "retell-ai-voice-agent",
    title: "Voice Agent → Airtable",
    tagline: "Every call your AI receptionist takes becomes a ready-to-work lead.",
    system: "standalone",
    trigger: "Retell AI post-call webhook",
    summary:
      "When a call with your voice agent ends, the workflow picks up the call analysis and pulls out what an agent needs: property type, budget, preferred area and whether they want an appointment. It files it in Airtable with the summary and transcript, ready for follow-up.",
    why:
      "A voice agent that answers 24/7 is only worth it if what the caller said reaches the person who calls them back. This is that handoff. The call ends, and a structured lead appears.",
    steps: [
      { title: "Take the right event", text: "Retell sends several events per call; only the finished analysis is processed." },
      { title: "Structure the call", text: "The fields that matter for a property enquiry are pulled out of the analysis." },
      { title: "Create the record", text: "One Airtable row per call, ready for the agent's follow-up." },
    ],
    tools: ["Retell AI", "Airtable", "Webhook"],
    demo: true,
    goal: "leads",
    industries: ["Real estate"],
    category: "Voice AI",
    complexity: "simple",
    stats: ["24/7 voice availability", "Auto lead qualification", "Full transcript logging"],
    tags: ["voice", "ai", "real-estate", "retell"],
    roi: { model: "time", unit: "calls logged", perMonth: 300, minutes: 8, share: 90, runCost: 20 },
  },

  /* ─── Client builds and more of our own ───────────────────────────────── */
  {
    slug: "speed-to-lead-routing-engine",
    title: "Speed-to-Lead Intake & Routing",
    tagline: "Every lead scored, routed to the right rep and texted back in under a minute.",
    system: "clients",
    trigger: "Any lead source: ads, Google, website, Angi, calls",
    summary: "Built for a US exteriors contractor drowning in leads from six places. Every enquiry lands in one door, gets de-duplicated, matched to the right contact, read by AI, scored A to D and routed to the right rep by region, skill and workload. The CRM gets the full picture and the customer gets a holding text, all before a human has picked up the phone.",
    why: "In home services, the first contractor to call back usually wins the job. This client had leads arriving from Meta, Google, their website, Angi and missed calls, landing in different places, with reps cherry-picking and good leads going cold. They didn't need more leads. They needed every lead answered, fast, by the right person.",
    steps: [
      { title: "One door for every source", text: "Six lead sources post to a single webhook. Each is mapped to one lead shape, the phone number is normalised, and an idempotency key makes retries harmless." },
      { title: "One person, one record", text: "The person is matched by phone and email before anything is created, then created or matched in GoHighLevel." },
      { title: "AI reads, rules decide", text: "An LLM turns the free-text enquiry into structured fields. A transparent rubric scores it 0 to 100 and gives an A/B/C/D tier with a plain-English reason. If the AI fails, a keyword classifier takes over." },
      { title: "Route with live context", text: "Routing checks service area, rep skills and each rep's current load. Emergencies skip the queue and go to the on-call rep; unclear leads go to a review queue." },
      { title: "Hand over in the CRM", text: "GoHighLevel gets the enriched contact, the opportunity at the right stage, a routing note and, only for routed leads, the holding text." },
    ],
    human: "Low-confidence, unclear and existing-customer leads go to a review queue for a person to decide. Spam and review-queue leads never get an automated text.",
    tools: ["Webhook", "OpenAI", "GoHighLevel", "Baserow", "Meta Lead Ads"],
    goal: "leads",
    industries: ["Home services"],
    category: "Lead Generation",
    complexity: "enterprise",
    stats: ["Every lead answered in under 60 seconds", "A/B/C/D scoring on every enquiry", "Zero duplicate contacts in the CRM"],
    tags: ["speed-to-lead", "routing", "home-services", "gohighlevel", "ai"],
    roi: { model: "time", unit: "inbound leads", perMonth: 600, minutes: 12, share: 85, runCost: 60 },
  },
  {
    slug: "lead-sla-watchdog",
    title: "Speed-to-Lead SLA Watchdog",
    tagline: "If a rep sits on a lead, the lead moves. Automatically.",
    system: "clients",
    trigger: "Every 5 minutes",
    summary: "The partner to the routing engine. Every five minutes it looks for assigned leads that nobody has contacted inside their deadline. It escalates them, hands the hottest ones to the least-busy rep, tells the manager and logs the breach. If nothing's overdue, it does nothing.",
    why: "Routing a lead to a rep is half the job. The other half is making sure the rep actually calls. Without a watchdog, a lead assigned to someone who's on another job at 2pm just sits there, and you never find out why you lost it.",
    steps: [
      { title: "Find overdue leads", text: "Every 5 minutes, pulls assigned leads whose first-response deadline has passed with no contact." },
      { title: "Check who's free", text: "Loads active reps, the SLA settings and each rep's current open-lead count." },
      { title: "Escalate and reassign", text: "A-tier and emergency leads move to the least-loaded other rep; everything overdue is escalated." },
      { title: "Tell and log", text: "The manager gets a notification and the breach is written to the log for reporting." },
    ],
    tools: ["Baserow", "GoHighLevel", "Webhook"],
    goal: "leads",
    industries: ["Home services"],
    category: "Lead Generation",
    complexity: "complex",
    stats: ["No lead waits past its SLA unnoticed", "Auto-reassign within 5 minutes", "Manager alerted on every breach"],
    tags: ["sla", "speed-to-lead", "escalation", "home-services"],
    roi: { model: "recovery", leads: 600, lostPct: 8, valuePerLead: 150, runCost: 5 },
  },
  {
    slug: "voice-agent-appointment-booking",
    title: "Voice Agent Appointment Booking",
    tagline: "Your AI receptionist checks the diary and books the patient in, live on the call.",
    system: "clients",
    trigger: "Called by the voice agent during a phone call",
    summary: "Built for a dental practice using an AI voice receptionist. When a caller asks for an appointment, the agent calls this workflow to read the real calendar and offer the free slots. When the caller picks one, a second call books it straight into the calendar and confirms it back to the agent, while the caller is still on the line.",
    why: "A voice agent that says 'someone will call you back to book' has just lost the patient. Front desks miss calls at lunch, after hours and whenever they're with someone. Booking live, against the real diary, is what turns a missed call into a filled chair.",
    steps: [
      { title: "Caller asks for a time", text: "The voice agent calls the availability webhook with the requested day." },
      { title: "Read the real diary", text: "Booked events are pulled from Google Calendar for that day." },
      { title: "Offer what's free", text: "A small step works out which standard slots are still open and returns them to the agent." },
      { title: "Book it on the call", text: "When the caller chooses, the booking webhook creates the calendar event and confirms it to the agent." },
    ],
    tools: ["ElevenLabs", "Google Calendar", "Webhook"],
    goal: "leads",
    industries: ["Dental & healthcare"],
    category: "Voice AI",
    complexity: "moderate",
    stats: ["Books appointments 24/7", "Zero double-bookings", "No front-desk time per booking"],
    tags: ["voice-ai", "dental", "booking", "calendar"],
    roi: { model: "time", unit: "booking calls", perMonth: 400, minutes: 5, share: 80, runCost: 80 },
  },
  {
    slug: "reserve-study-site-report",
    title: "Reserve Study Site-Visit Report",
    tagline: "Photos and handwritten site notes in. A drafted reserve-study report out.",
    system: "clients",
    trigger: "Site visit upload form",
    summary: "Built for a reserve-study firm that produces over 1,200 reports a year. An inspector uploads the site-visit photos and their handwritten notes. AI analyses every photo, reads the measurements off the notes, builds the component records, writes the report narratives and assembles an HTML report ready for review.",
    why: "Every reserve study starts with a site visit and ends with days of desk work: sorting photos, typing up notes, describing each component. At 1,200 reports a year, that write-up time is the whole business's bottleneck. Moving it from days to minutes changes how many studies the same team can deliver.",
    steps: [
      { title: "Upload the visit", text: "One form takes the property details, the photos and photos of the handwritten notes." },
      { title: "Analyse every photo", text: "Each photo is uploaded, analysed by Gemini against a fixed schema, and saved with its findings." },
      { title: "Read the notes", text: "Measurements and observations are read off the handwritten notes with OCR and stored against the property." },
      { title: "Build the components", text: "Photo findings and note data are combined into component records, and AI writes the narrative for each." },
      { title: "Assemble the report", text: "The narratives and photos are pulled together into an HTML report, ready for the analyst to review." },
    ],
    human: "An analyst reviews and signs off every report. The workflow removes the typing, not the professional judgement.",
    tools: ["Google Gemini", "Airtable", "ImgBB", "Webhook"],
    goal: "documents",
    industries: ["Property & reserve studies"],
    category: "Document Processing",
    complexity: "enterprise",
    stats: ["Site-visit report drafted in minutes, not days", "Every photo analysed and filed", "Measurements read from handwritten notes"],
    tags: ["reserve-study", "property", "document-ai", "reports"],
    roi: { model: "time", unit: "reserve-study reports", perMonth: 100, minutes: 240, share: 60, runCost: 150 },
  },
  {
    slug: "property-photo-auto-categorization",
    title: "Property Photo Auto-Categorisation",
    tagline: "Hundreds of site photos sorted by component while you do something else.",
    system: "clients",
    trigger: "Start a run for a property",
    summary: "For the same reserve-study firm. Point it at a property and it works through every uncategorised photo: AI identifies the component in each image, the record is updated, and the property's photo stats are recalculated at the end.",
    why: "A single site visit can produce hundreds of photos, and someone has to label every one before the report can be written. It's slow, dull work that nobody does well at photo number 300.",
    steps: [
      { title: "Pick the property", text: "A form starts the run and loads the property's details." },
      { title: "Find unsorted photos", text: "Lists every photo for that property that hasn't been categorised." },
      { title: "Categorise one by one", text: "Each image is downloaded and Gemini assigns its component category against a fixed schema." },
      { title: "Update the totals", text: "Photo records are updated, then the property's category stats are recalculated." },
    ],
    tools: ["Google Gemini", "Airtable"],
    goal: "documents",
    industries: ["Property & reserve studies"],
    category: "Document Processing",
    complexity: "moderate",
    stats: ["Hundreds of photos sorted per property", "Component-level categories", "Property stats updated automatically"],
    tags: ["property", "photos", "classification", "reserve-study"],
    roi: { model: "time", unit: "site photos", perMonth: 5000, minutes: 0.5, share: 90, runCost: 40 },
  },
  {
    slug: "lab-result-environment-correlation",
    title: "Lab Result × Environment Correlation",
    tagline: "Find out why a batch underperformed in seconds, not an afternoon.",
    system: "clients",
    trigger: "A new lab result arrives",
    summary: "A pilot for an indoor cultivation facility. When a lab result comes in, it's joined to the full climate history of the room that batch grew in. The team gets a plain-English explanation of what likely drove the result, a recipe recommendation for next time, and a growing library of what works.",
    why: "When a batch comes back below spec, the post-mortem means pulling climate logs, irrigation data and lab certificates from separate systems. It takes 60 to 90 minutes and often ends in a guess. By the time anyone knows, the next batch is already growing under the same conditions.",
    steps: [
      { title: "Catch the new result", text: "A new lab result row starts the run." },
      { title: "Pull the room's history", text: "Every environment log for that room across the growing cycle is loaded." },
      { title: "Correlate", text: "Average VPD, temperature, humidity and CO₂ are compared against the expected range for the outcome." },
      { title: "Explain and recommend", text: "A plain-English insight and a recipe recommendation go to the recipe library and to the cultivation team in Slack." },
    ],
    tools: ["Google Sheets", "Slack"],
    demo: true,
    goal: "operations",
    industries: ["Agriculture & cultivation"],
    category: "Operations & Monitoring",
    complexity: "moderate",
    stats: ["Root-cause analysis in seconds, not 90 minutes", "A recipe library that grows every harvest", "Plain-English insight for every batch"],
    tags: ["cultivation", "monitoring", "lab-results", "agriculture"],
    roi: { model: "time", unit: "lab results analysed", perMonth: 60, minutes: 75, share: 90, runCost: 10 },
  },
  {
    slug: "grow-room-deviation-alerts",
    title: "Grow Room Deviation Alerts",
    tagline: "Catch the climate problem in week 6, not at harvest.",
    system: "clients",
    trigger: "Every 15 minutes",
    summary: "The partner to the correlation workflow. Every 15 minutes it checks every room's live readings against the targets for that strain and week of growth, rates each room green, yellow or red, logs it, and sends an alert the moment anything drifts out of tolerance.",
    why: "Rooms were checked on morning walk-throughs. A humidity spike on a Tuesday afternoon went unnoticed until harvest, when the batch came back short and it was far too late to fix. Continuous checks turn a lost batch into a five-minute adjustment.",
    steps: [
      { title: "Read every room", text: "Pulls current temperature, VPD and humidity for all rooms." },
      { title: "Load the targets", text: "Loads the strain- and week-specific targets for each room." },
      { title: "Grade each room", text: "Compares live readings to tolerance and marks each room green, yellow or red with the exact deviation." },
      { title: "Alert or log", text: "Deviations go straight to Slack; everything is logged to the monitoring history either way." },
    ],
    tools: ["Google Sheets", "Slack"],
    demo: true,
    goal: "operations",
    industries: ["Agriculture & cultivation"],
    category: "Operations & Monitoring",
    complexity: "moderate",
    stats: ["Every room checked every 15 minutes", "Deviations caught in week 6, not at harvest", "12+ rooms monitored at once"],
    tags: ["cultivation", "monitoring", "alerts", "iot"],
    roi: { model: "time", unit: "room checks", perMonth: 720, minutes: 5, share: 90, runCost: 10 },
  },
  {
    slug: "landing-page-lead-capture",
    title: "Landing Page Lead Capture",
    tagline: "Every form lead saved, alerted and confirmed. Bots quietly turned away.",
    system: "ads",
    trigger: "Landing page form submission",
    summary: "The back end behind our paid-ad landing page. It validates each submission, silently drops bots, saves the lead, and if saving fails, tells the visitor honestly and alerts us. Real leads trigger a WhatsApp alert to the team, a WhatsApp nudge if they opted in, and a confirmation email.",
    why: "Paid traffic is expensive, and a form that loses a lead without telling anyone is the most expensive bug a business can have. We've been caught by it before. This one validates, saves, confirms and shouts when anything goes wrong.",
    steps: [
      { title: "Validate", text: "Required fields are checked; incomplete submissions get a clear error." },
      { title: "Turn bots away", text: "A hidden honeypot field catches bots, which get a fake success and go nowhere." },
      { title: "Save, or raise the alarm", text: "The lead is written to the sheet. If the save fails, the visitor gets an honest error and the team gets an email." },
      { title: "Alert and confirm", text: "The team gets a WhatsApp alert, the lead gets a WhatsApp nudge if they consented, and a confirmation email if they left one." },
    ],
    tools: ["Webhook", "Google Sheets", "WhatsApp Business", "Gmail"],
    goal: "leads",
    industries: ["E-commerce", "Any business"],
    category: "Lead Generation",
    complexity: "moderate",
    stats: ["Every form lead saved, alerted and confirmed", "Bots filtered before they reach the sheet", "Failed saves alert the team instantly"],
    tags: ["lead-capture", "landing-page", "whatsapp", "ads"],
    roi: { model: "recovery", leads: 200, lostPct: 5, valuePerLead: 200, runCost: 5 },
  },
  {
    slug: "meta-ads-daily-report",
    title: "Meta Ads Daily Report",
    tagline: "Yesterday's ad performance on your WhatsApp before your first coffee.",
    system: "ads",
    trigger: "Every morning at 9am",
    summary: "Every morning it reads the ad account for the last two days, compares them, and sends the founders a WhatsApp message with spend, leads, cost per lead and which campaigns moved. No dashboard to open, no report to build.",
    why: "Ads drift quietly. Cost per lead creeps up for three days before anyone logs into Ads Manager to look. A two-line message every morning means you notice on day one, not day four.",
    steps: [
      { title: "Read the account", text: "Pulls account-level results for the last two days." },
      { title: "Summarise the day", text: "Works out spend, leads and cost per lead, and the change from the day before." },
      { title: "Check campaigns", text: "Pulls campaign-level results to show which ones moved." },
      { title: "Send it", text: "Builds a short message and sends it to the founders on WhatsApp." },
    ],
    tools: ["Meta Graph API", "WhatsApp Business"],
    goal: "leads",
    industries: ["Any business"],
    category: "Marketing Ops",
    complexity: "simple",
    stats: ["Daily ad performance on WhatsApp by 9am", "Day-over-day comparison, no dashboard", "Zero manual reporting"],
    tags: ["meta-ads", "reporting", "whatsapp", "marketing"],
    roi: { model: "time", unit: "daily reports", perMonth: 30, minutes: 25, share: 100, runCost: 2 },
  },
  {
    slug: "reddit-keyword-alerts",
    title: "Reddit Keyword Alerts",
    tagline: "Know the moment your buyers start asking about you on Reddit.",
    system: "content",
    trigger: "Every 6 hours",
    summary: "Every six hours it searches Reddit for the phrases your buyers use when they're looking for help, filters out the noise, and sends the fresh threads to Slack. You get to answer while the conversation is still alive.",
    why: "Buyers ask for recommendations on Reddit every day, and the first useful answer tends to win. Nobody has time to search Reddit by hand several times a day, so those threads go unanswered or get answered by a competitor.",
    steps: [
      { title: "Build the searches", text: "Turns your keyword list into Reddit search queries." },
      { title: "Search", text: "Runs the searches against Reddit." },
      { title: "Filter", text: "Keeps new, relevant threads and formats them into readable alerts." },
      { title: "Alert", text: "Posts the threads to Slack with links." },
    ],
    tools: ["Reddit", "Slack"],
    goal: "content",
    industries: ["B2B services"],
    category: "SEO & Content",
    complexity: "simple",
    stats: ["New buyer conversations spotted every 6 hours", "Keyword-matched alerts in Slack", "Zero manual Reddit searching"],
    tags: ["reddit", "seo", "social-listening", "alerts"],
    roi: { model: "time", unit: "manual searches", perMonth: 120, minutes: 10, share: 95, runCost: 2 },
  },

  /* ─── Back-office reference builds ────────────────────────────────────── */
  {
    slug: "booking-to-crm-sync",
    title: "Booking to CRM Sync",
    tagline: "Every booking, reschedule and no-show lands in your CRM by itself.",
    system: "backoffice",
    trigger: "A booking event from your scheduling tool",
    summary:
      "Every booking, reschedule and cancellation from your scheduling tool is routed to the right path. New bookings find or create the contact, record the booking, move the lead forward and tell sales. Reschedules update the calendar. Cancellations start a recovery email. Every 15 minutes a check finds no-shows and sends a friendly reschedule note.",
    why:
      "Sales teams live in the calendar and the CRM at the same time, and the two drift apart within a week. Leads sit at the wrong stage, no-shows are never followed up, and nobody knows why the pipeline report looks off. Syncing every event keeps the CRM true without anyone typing.",
    steps: [
      { title: "Route by event type", text: "A Switch node sends new bookings, reschedules and cancellations down separate paths." },
      { title: "Find or create the person", text: "The contact is looked up first, so the same person never becomes two records." },
      { title: "Record and advance", text: "The booking is saved, the lead moves to the right stage and sales is told in Slack." },
      { title: "Handle change gracefully", text: "Reschedules update the old booking and move the calendar event. Cancellations start a recovery email." },
      { title: "Chase the no-shows", text: "A 15-minute check finds bookings nobody attended and sends a reschedule email." },
    ],
    tools: ["Calendly", "Airtable", "Google Calendar", "Slack", "Gmail"],
    reference: true,
    goal: "leads",
    industries: ["Any business", "Advisory & consulting"],
    category: "CRM & Data Sync",
    complexity: "complex",
    stats: ["Zero manual CRM updates after a booking", "Every no-show followed up automatically", "Pipeline stages that match reality"],
    tags: ["calendly", "crm", "bookings", "no-show"],
    roi: { model: "time", unit: "booking events", perMonth: 300, minutes: 6, share: 90, runCost: 30 },
  },
  {
    slug: "client-inbox-to-crm-agent",
    title: "Client Inbox to CRM Agent",
    tagline: "An AI agent files every client email against the right deal.",
    system: "backoffice",
    trigger: "A new email from a client or prospect",
    summary:
      "Every client email is matched to the right person and the right open deal by an AI agent, saved to the CRM, summarised, and classified by intent. Interested leads alert the deal owner, confirmations advance the stage, and clear declines get a polite close. When the agent isn't sure who an email belongs to, it asks a human instead of guessing.",
    why:
      "The real customer history lives in inboxes, not the CRM. So the CRM is always out of date, and the person picking up a deal has to read forty emails to catch up. An agent that files as mail arrives turns the inbox into a live record, and makes sure a hot reply never sits unseen.",
    steps: [
      { title: "Skip the noise", text: "System and no-reply senders are filtered out first." },
      { title: "Match the sender", text: "The contact is found by email; unknown senders raise an alert instead of a wrong match." },
      { title: "Attribute to the right deal", text: "Claude reads the email and picks the right open deal against a strict schema." },
      { title: "Summarise and save", text: "The email is saved, key facts are extracted and the deal summary is updated." },
      { title: "Act on intent", text: "A classifier routes interested, confirmed, not-interested and other replies to the right action." },
    ],
    human: "The agent only files when it's confident. Unknown senders and ambiguous matches go to Slack for a person to decide.",
    tools: ["Gmail", "Anthropic Claude", "Airtable", "Slack"],
    reference: true,
    goal: "operations",
    industries: ["Any business", "Advisory & consulting"],
    category: "AI Agents",
    complexity: "enterprise",
    stats: ["Every client email filed against the right deal", "Hot replies alerted in minutes", "Deal summaries that stay current"],
    tags: ["gmail", "crm", "ai-agent", "inbox"],
    roi: { model: "time", unit: "client emails", perMonth: 1500, minutes: 3, share: 85, runCost: 90 },
  },
  {
    slug: "approval-gated-esign-workflow",
    title: "Approval-Gated Contract & E-Sign",
    tagline: "Contracts that build themselves, and never go out without your yes.",
    system: "backoffice",
    trigger: "A contract request from your CRM or a form",
    summary:
      "A request builds the contract from a template and the deal's pricing, then stops for approval in Slack. Once approved, an e-signature request goes out with a covering email. When it's signed, the deal is updated, the customer gets next steps and the team is told. A sweep every hour nudges approvals that are gathering dust.",
    why:
      "Contracts stall in two places: someone has to build them by hand, and someone has to remember to approve them. Both cost days, and days cost deals. This removes the busywork but keeps the one thing that should never be automatic: a person deciding that this document can go out.",
    steps: [
      { title: "Build the document", text: "Deal details and pricing are loaded and a PDF is generated from the template." },
      { title: "Ask, then wait", text: "The owner gets an approval request in Slack and the workflow pauses until they answer." },
      { title: "Send for signature", text: "Approved contracts become an e-sign envelope with a covering email; rejected ones tell the owner." },
      { title: "Close the loop", text: "When the envelope is signed, the deal is updated, the customer gets a welcome and next steps, and the team is told." },
      { title: "Nudge the stuck ones", text: "An hourly sweep nudges stale approvals and escalates the ones nobody answered." },
    ],
    human: "Nothing is sent without an explicit approval in Slack. Rejections are recorded and the owner is told why.",
    tools: ["Slack", "DocuSign", "Airtable", "Gmail"],
    reference: true,
    goal: "documents",
    industries: ["Any business", "Legal", "Advisory & consulting"],
    category: "Document Processing",
    complexity: "enterprise",
    stats: ["Contracts out in hours, not days", "Zero contracts sent without approval", "Stale approvals nudged automatically"],
    tags: ["contracts", "esign", "approval", "docusign"],
    roi: { model: "time", unit: "contracts", perMonth: 60, minutes: 45, share: 75, runCost: 40 },
  },
  {
    slug: "meeting-transcript-to-crm",
    title: "Meeting Transcript to CRM",
    tagline: "Every sales call summarised in your CRM before you've closed the tab.",
    system: "backoffice",
    trigger: "A video call ends",
    summary:
      "When a call ends, the workflow fetches the transcript, matches it to the booking it belongs to, and works out whether it was a real call or a no-show. Real calls go to an AI that writes the summary, the action items and the customer's pain points, which are saved to the CRM and posted to Slack. Calls it can't match raise an alert.",
    why:
      "Nobody writes good call notes after the fifth call of the day, so the most valuable information a sales team collects, what the customer actually said, mostly disappears. Capturing it automatically makes every follow-up sharper and every handover painless.",
    steps: [
      { title: "Verify and fetch", text: "The webhook signature is checked and the transcript is pulled from the meeting platform." },
      { title: "Match to a booking", text: "The call is tied to its booking; a missing match raises an alert rather than a lost call." },
      { title: "Real call or no-show?", text: "Duration and participants decide it. No-shows are marked and the host is told." },
      { title: "Read the call", text: "Claude writes a summary and action items against a fixed schema, then pulls out the customer's pain points." },
      { title: "Write it down", text: "The call record is saved, the booking status updated and a summary posted to Slack." },
    ],
    tools: ["Zoom", "Anthropic Claude", "Airtable", "Slack"],
    reference: true,
    goal: "leads",
    industries: ["Any business", "Advisory & consulting"],
    category: "AI Agents",
    complexity: "enterprise",
    stats: ["Every call summarised in minutes", "Customer pain points captured verbatim", "No-shows flagged automatically"],
    tags: ["zoom", "transcripts", "crm", "ai-agent"],
    roi: { model: "time", unit: "sales calls", perMonth: 200, minutes: 15, share: 90, runCost: 70 },
  },
  {
    slug: "payment-to-onboarding-handler",
    title: "Payment to Onboarding Handler",
    tagline: "A paid invoice starts onboarding within minutes, not days.",
    system: "backoffice",
    trigger: "A paid-invoice event from your payment provider",
    summary:
      "When a customer pays, the payment webhook is verified by signature before anything else happens. The invoice and customer are updated, purchased service lines are marked paid, and the team hears about it first. A thank-you email is drafted and approved in Slack, then sent, and onboarding starts. Payments it can't match raise an alert.",
    why:
      "The moment after a customer pays is the most important in the relationship, and it's usually when things go quiet. Someone has to notice the payment, update three systems and write the welcome. Automating the chain means the customer hears from you while they're still glowing.",
    steps: [
      { title: "Verify the payment", text: "The webhook signature is checked. Only a genuine paid-invoice event goes any further." },
      { title: "Update the records", text: "The invoice is marked paid, the customer converted and their service lines flipped to paid." },
      { title: "Tell the team first", text: "The team gets the payment alert before the customer gets anything." },
      { title: "Approve the thank-you", text: "A welcome email is drafted and approved in Slack, then sent." },
      { title: "Start onboarding", text: "The onboarding workflow is kicked off. Unmatched payments raise an alert." },
    ],
    human: "The thank-you email waits for a person's approval in Slack. A rejection skips the email and logs why.",
    tools: ["Stripe", "Airtable", "Slack", "Gmail"],
    reference: true,
    goal: "operations",
    industries: ["Any business", "Advisory & consulting"],
    category: "Finance & Compliance",
    complexity: "complex",
    stats: ["Onboarding starts within minutes of payment", "Zero manual invoice reconciliation", "Every payment verified by signature"],
    tags: ["stripe", "payments", "onboarding", "invoicing"],
    roi: { model: "time", unit: "payments", perMonth: 80, minutes: 25, share: 85, runCost: 25 },
  },
  {
    slug: "ai-error-triage-auto-retry",
    title: "AI Error Triage & Auto-Retry",
    tagline: "When a workflow fails at 3am, the fix is already running.",
    system: "backoffice",
    trigger: "Any other workflow fails",
    summary:
      "Every other workflow points here when it fails. The failure is checked against known incidents so one outage never becomes fifty alerts. A new failure has its execution data pulled and an AI classifies it as transient, a data problem or a real bug. Transient ones are retried automatically after a pause; everything else gets an alert that already names the cause.",
    why:
      "Automation is only as good as what happens when it breaks. Most teams find out from an angry customer, then spend an hour reading logs. This makes failure boring: the obvious ones fix themselves, and the rest reach the right person with the diagnosis attached.",
    steps: [
      { title: "Catch every failure", text: "An error trigger receives the failure from any workflow that points to it." },
      { title: "Don't alert twice", text: "The incident is checked against known ones, so repeats bump a counter instead of paging you again." },
      { title: "Diagnose", text: "Execution data is fetched and Claude classifies the error against a strict schema." },
      { title: "Retry what's safe", text: "Transient failures wait 60 seconds and are retried automatically." },
      { title: "Escalate the rest", text: "Everything else raises an enriched alert; anything that keeps failing escalates to the owner." },
    ],
    tools: ["n8n", "Anthropic Claude", "Airtable", "Slack"],
    reference: true,
    goal: "operations",
    industries: ["Any business"],
    category: "Operations & Monitoring",
    complexity: "complex",
    stats: ["Transient failures fixed without a human", "One alert per incident, not fifty", "Root cause named in the alert"],
    tags: ["error-handling", "monitoring", "ai-agent", "reliability"],
    roi: { model: "time", unit: "workflow failures", perMonth: 60, minutes: 30, share: 60, runCost: 20 },
  },
  {
    slug: "linkedin-content-engine",
    title: "LinkedIn Content Engine",
    tagline: "A week of on-brand LinkedIn posts, waiting for your thumbs-up.",
    system: "backoffice",
    trigger: "Twice a week, plus your Slack reply",
    summary:
      "Twice a week it researches your topics from RSS sources and an AI search, saves the raw material and keeps what's relevant to your audience. For each story it picks a content pillar and drafts a post in your voice, then scores it. Drafts go to Slack. Reply approve and it's published; reply with feedback and it's rewritten and sent back.",
    why:
      "Consistent LinkedIn presence wins deals, and almost nobody sustains it because the research and drafting eat the time. This does the reading and the first draft in your voice, and leaves you the only part that matters: deciding what goes out under your name.",
    steps: [
      { title: "Research twice a week", text: "RSS sources and an AI search run in parallel and are merged." },
      { title: "Keep what's relevant", text: "Raw content is saved and a classifier keeps only what matters to your audience." },
      { title: "Draft in your voice", text: "A content pillar is chosen and Claude drafts the post from real examples of your writing, then scores it." },
      { title: "Review in Slack", text: "Drafts arrive in Slack. You reply approve or give feedback." },
      { title: "Publish or rewrite", text: "Approved posts publish to LinkedIn; feedback triggers a rewrite that comes back for another look." },
    ],
    human: "Nothing is published without your approval in Slack. Feedback loops back into a rewrite, not a repost.",
    tools: ["Perplexity", "Anthropic Claude", "Airtable", "Slack", "LinkedIn"],
    reference: true,
    goal: "content",
    industries: ["B2B services", "Any business"],
    category: "SEO & Content",
    complexity: "enterprise",
    stats: ["Two researched drafts every week", "Written in your voice, from your examples", "Zero posts without approval"],
    tags: ["linkedin", "content", "ai-agent", "social"],
    roi: { model: "time", unit: "LinkedIn posts", perMonth: 8, minutes: 90, share: 80, runCost: 45 },
  },

  /* ─── Industry reference architectures ────────────────────────────────── */
  {
    slug: "ai-contract-review-pipeline",
    title: "AI-Powered Contract Review Pipeline",
    tagline: "Your lawyers start at the risky clauses, not at page one.",
    system: "industry",
    trigger: "New contract by email or in a shared Drive folder",
    summary:
      "Contracts arrive by email or a shared folder. The workflow reads every clause, pulls the key terms into one standard format, scores the risk and flags anything non-standard. High-risk contracts come with a redline summary, and each one goes to the right reviewer. First-pass review time drops by 70%.",
    why:
      "Most lawyer hours on a contract go into reading it end to end to find the three clauses that deviate from your standard. Let the first pass happen automatically, and your team spends its time on judgement, not on finding the page.",
    steps: [
      { title: "Take in the contract", text: "Email and Drive intake merge into one path; the PDF text is extracted and split into clauses." },
      { title: "Extract to a schema", text: "Claude pulls the key clauses into a fixed structure, so every contract is compared on the same fields." },
      { title: "Score the risk", text: "A scoring step flags non-standard and high-risk terms against the firm's playbook." },
      { title: "Redline what matters", text: "High-risk contracts get a redline summary before anyone opens them." },
      { title: "Route and record", text: "A Switch sends each contract to the right reviewer by type; the review is logged in Airtable and the requester gets a reply." },
    ],
    human: "A lawyer reviews every contract. The workflow does the first read and points them at the clauses that need a decision.",
    tools: ["Anthropic Claude", "Google Drive", "Airtable", "Slack", "Email (IMAP)"],
    reference: true,
    goal: "documents",
    industries: ["Legal"],
    category: "Document Processing",
    complexity: "enterprise",
    stats: ["70% faster first-pass review", "Auto risk scoring", "Clause-level extraction"],
    tags: ["legal", "contracts", "document-ai", "enterprise"],
    roi: { model: "time", unit: "contracts reviewed", perMonth: 80, minutes: 90, share: 70, runCost: 60 },
  },
  {
    slug: "cpa-tax-document-classifier",
    title: "CPA Tax Document Auto-Classifier",
    tagline: "Tax season documents sorted, read and filed before your team opens them.",
    system: "industry",
    trigger: "New file in the shared client folder",
    summary:
      "Built for CPA firms handling thousands of client documents in tax season. It watches your shared client folder, recognises each document (W-2, 1099, K-1, receipts and more), pulls out the key figures, files it in the right client folder and updates your practice software. Anything it isn't sure about goes to an accountant.",
    why:
      "In January your best people spend their days opening, renaming and filing PDFs before any real accounting starts. Sorting on arrival turns that into a short review of exceptions, and gives the season's hours back to billable work.",
    steps: [
      { title: "Watch the client folder", text: "Every new upload is downloaded and its text extracted." },
      { title: "Classify", text: "A classifier sorts the document: W-2 / 1099, K-1, receipts and expenses, or other." },
      { title: "Extract by type", text: "Each type has its own extraction schema for the figures that matter." },
      { title: "Check confidence", text: "Only extractions above the confidence threshold are filed automatically." },
      { title: "File and update", text: "Documents move to the client folder, the Karbon work item is updated and the tracking sheet logged. Low-confidence and unclassified files go to an accountant's queue." },
    ],
    human: "Documents below the confidence threshold, and anything the classifier can't place, go to an accountant's review queue instead of being filed.",
    tools: ["Google Drive", "Anthropic Claude", "Karbon", "Google Sheets"],
    reference: true,
    goal: "documents",
    industries: ["Accounting & tax"],
    category: "Finance & Compliance",
    complexity: "complex",
    stats: ["12 document types classified", "95%+ classification accuracy", "Saves 200+ hrs/tax season"],
    tags: ["cpa", "tax", "document-processing", "accounting"],
    roi: { model: "time", unit: "client documents", perMonth: 2000, minutes: 2, share: 95, runCost: 40 },
  },
  {
    slug: "insurance-claims-triage",
    title: "Insurance Claims Triage & Routing",
    tagline: "The urgent claims reach your senior adjusters first. Every time.",
    system: "industry",
    trigger: "New claim by email or API",
    summary:
      "Claims come in by email or API. The workflow extracts the details, checks the policy, assesses severity, looks for fraud indicators and routes each claim to the right adjuster team, with every decision written to an audit log for your regulators.",
    why:
      "Triage decides how fast a claim moves, and most teams still do it by reading claims in arrival order. Scoring severity at intake means the critical claim filed at 4:55pm doesn't wait behind forty minor ones.",
    steps: [
      { title: "Normalise intake", text: "Email and API claims are put into one shape and merged." },
      { title: "Extract and verify", text: "Claude extracts the claim details and the policy is checked in Salesforce. Lapsed policies get a reply, not a queue slot." },
      { title: "Assess severity", text: "Severity is scored against a fixed schema, so every claim is judged on the same criteria." },
      { title: "Check fraud indicators", text: "A rules step flags suspicious patterns and alerts the investigations team." },
      { title: "Route and audit", text: "A Switch assigns critical, standard and fast-track claims to the right team; every decision is written to the audit log and the claimant is acknowledged." },
    ],
    human: "Adjusters make every coverage decision. Suspected fraud goes to your investigations team, never to an automatic rejection.",
    tools: ["Anthropic Claude", "Email (IMAP)", "Salesforce", "Slack", "Google Sheets"],
    reference: true,
    goal: "documents",
    industries: ["Insurance"],
    category: "Finance & Compliance",
    complexity: "enterprise",
    stats: ["60% faster triage", "Fraud indicator flagging", "Regulatory audit trail"],
    tags: ["insurance", "claims", "triage", "enterprise"],
    roi: { model: "time", unit: "claims triaged", perMonth: 600, minutes: 20, share: 60, runCost: 80 },
  },
  {
    slug: "multi-channel-support-router",
    title: "Multi-Channel Customer Support Router",
    tagline: "Email, chat and WhatsApp in one queue. The easy questions answer themselves.",
    system: "industry",
    trigger: "Email, web chat or WhatsApp message",
    summary:
      "Every support message, wherever it arrives, becomes one ticket. AI sorts it by urgency and topic, answers the routine how-to questions from your help centre, and sends everything else to the right team in Slack with the SLA clock already running.",
    why:
      "When support lives in three inboxes, urgent tickets wait behind easy ones and easy ones wait for a human. One router clears the routine questions, around 40% of the volume, and gets the rest to the right person fast.",
    steps: [
      { title: "One ticket shape", text: "Email, chat and WhatsApp messages are normalised and merged." },
      { title: "Classify", text: "Each ticket is sorted: urgent, how-to, billing or other." },
      { title: "Answer what's routine", text: "An agent answers how-to questions from the help centre, and only a confident answer is sent." },
      { title: "Escalate the rest", text: "Urgent, billing and uncertain tickets go to the right team in Slack." },
      { title: "Track the SLA", text: "Every ticket is logged with its SLA clock; a check every 15 minutes escalates tickets close to breach." },
    ],
    human: "The AI only replies when it's confident. Every other ticket goes to a person, with the SLA clock visible.",
    tools: ["Anthropic Claude", "WhatsApp Business", "Slack", "Airtable", "Email (IMAP)", "Webhook"],
    reference: true,
    goal: "operations",
    industries: ["Any business", "E-commerce"],
    category: "Customer Support",
    complexity: "enterprise",
    stats: ["3 channels unified", "40% auto-resolved", "SLA tracking built-in"],
    tags: ["support", "multi-channel", "ai", "routing"],
    roi: { model: "time", unit: "support tickets", perMonth: 3000, minutes: 8, share: 40, runCost: 120 },
  },
  {
    slug: "vc-deal-flow-crm-enrichment",
    title: "VC Deal Flow: CRM Auto-Enrichment",
    tagline: "Every new deal arrives with a research memo already written.",
    system: "industry",
    trigger: "New deal added to the CRM",
    summary:
      "For VC and PE firms. When a deal lands in your CRM, the workflow pulls company data, recent news, competitors and filings, then writes a structured deal memo with an AI score against your thesis. Your analysts save 4+ hours per deal.",
    why:
      "First-look research is the same routine for every deal, and it eats hours before anyone knows if the deal deserves them. Doing it on arrival means the partner meeting starts from a memo, not from a company name.",
    steps: [
      { title: "Catch the new deal", text: "A new Affinity deal triggers the run and pulls its details." },
      { title: "Research in parallel", text: "Company data, recent news, competitors and filings are fetched side by side and merged." },
      { title: "Write the memo", text: "Claude writes a structured deal memo from the research." },
      { title: "Score against the thesis", text: "A scoring step checks the memo against the fund's criteria." },
      { title: "Deliver", text: "The memo goes into a Google Doc, the CRM gets the score and link, and the deal team sees it in Slack." },
    ],
    human: "The score informs the partner meeting, it doesn't replace it. Every memo links back to its sources.",
    tools: ["Affinity CRM", "Exa", "Crunchbase", "Anthropic Claude", "Google Docs"],
    reference: true,
    goal: "documents",
    industries: ["Venture capital & PE"],
    category: "CRM & Data Sync",
    complexity: "complex",
    stats: ["4+ hrs saved per deal", "Auto deal memo generation", "AI investment scoring"],
    tags: ["vc", "deal-flow", "crm", "enrichment", "finance"],
    roi: { model: "time", unit: "deals researched", perMonth: 40, minutes: 270, share: 90, runCost: 60 },
  },
];

export const workflowBySlug = (slug: string) => workflows.find((workflow) => workflow.slug === slug);
export const systemById = (id: SystemId) => SYSTEMS.find((system) => system.id === id)!;
