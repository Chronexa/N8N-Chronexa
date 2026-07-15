/**
 * Data for the AI Engines pages. Pure data (no JSX) so the server pages, the
 * client demo, and the nav mega-menu (Nav.tsx) all read the same source —
 * ENGINE_ROADMAP is the single place that decides which engines are "live"
 * vs "coming soon". Only flip an entry to 'live' once its page is genuinely
 * deep-researched and built; add new "coming soon" entries here as future
 * engines get planned.
 */

export type IconKey =
  | 'database' | 'search' | 'filter' | 'pen' | 'layers' | 'send'
  | 'shield' | 'inbox' | 'chart' | 'book' | 'spark' | 'doc';

export type EngineStatus = 'live' | 'soon';

/** One agent/step in an engine. Order in the array = run order. */
export interface EngineNodeDef {
  id: string;
  tag: string; // short tracked-caps category, e.g. "Source"
  label: string; // agent name
  icon: IconKey;
  tools: string[]; // generic, plural tool options — shows it fits any stack
  stat: string; // mono micro-stat shown in the live demo while active
  caption: string; // one-line live narration for the demo
  activity: string; // terse log line for the demo
  detail: string; // CLARITY: plain-English explanation of what this step does
  gives: string; // CONVICTION: what the client actually gets from it
}

export interface EngineDef {
  id: string;
  slug: string;
  name: string;
  kicker: string;
  status: EngineStatus;
  icon: IconKey;
  promise: string; // one-liner: what it does, in plain English
  nodes: EngineNodeDef[];
}

// ----------------------------------------------------------------------------
// SALES ENGINE — the one we run in production, fully built.
// ----------------------------------------------------------------------------
export const SALES_ENGINE: EngineDef = {
  id: 'sales',
  slug: 'sales-engine',
  name: 'Sales Engine',
  kicker: 'Outbound & pipeline',
  status: 'live',
  icon: 'send',
  promise:
    'Finds the right buyers, researches and qualifies each one, writes the outreach, and runs multichannel sequences — every day, on autopilot.',
  nodes: [
    {
      id: 'capture', tag: 'Source', label: 'Capture Leads', icon: 'database',
      tools: ['Apollo', 'Clay', 'ZoomInfo', 'LinkedIn', 'CSV / Sheets'],
      stat: 'Fresh list daily',
      caption: 'Pulling today’s buyers from your lead tools against your criteria.',
      activity: 'Sourced a fresh list of accounts matching your ICP',
      detail: 'Every morning the engine pulls a fresh list of people who match your ideal customer — by title, industry, company size and buying signals — straight from the lead tools you already pay for.',
      gives: 'A daily list of real, in-market prospects. No one building lists by hand.',
    },
    {
      id: 'research', tag: 'Enrich', label: 'Research Agents', icon: 'search',
      tools: ['Exa', 'Perplexity', 'Tavily', 'Clearbit'],
      stat: 'Deep-researched',
      caption: 'Reading each company’s site, news and footprint for real context.',
      activity: 'Researched every account · what they do and what’s changing',
      detail: 'A set of AI agents reads each prospect’s website, news and footprint to understand what the company does, who they sell to, and what’s changing for them right now.',
      gives: 'Real context on every account — the research a good rep would do, at scale.',
    },
    {
      id: 'qualify', tag: 'Score', label: 'Qualify & Score', icon: 'filter',
      tools: ['Your ICP rules', 'Intent signals', 'Lookalikes'],
      stat: 'Best-fit surfaced',
      caption: 'Scoring fit against the exact problem you solve — dropping the rest.',
      activity: 'Scored and ranked accounts · weak-fit names removed',
      detail: 'It scores every prospect against the exact problem you solve and the customers you already win — so weak-fit names are dropped and your team only sees people worth contacting.',
      gives: 'Only the prospects most likely to buy. The rest filtered out automatically.',
    },
    {
      id: 'compose', tag: 'Write', label: 'Compose Outreach', icon: 'pen',
      tools: ['Claude', 'GPT-4o', 'Your templates'],
      stat: '6-touch sequence',
      caption: 'Writing a personalised opener and five follow-ups from the research.',
      activity: 'Drafted a tailored 6-step sequence per prospect',
      detail: 'For each qualified prospect it writes a personalised first email and five follow-ups, grounded in the research — referencing their business, not a generic mail-merge.',
      gives: 'A tailored 6-touch sequence per prospect, written in your voice.',
    },
    {
      id: 'review', tag: 'Approve', label: 'Human Review', icon: 'shield',
      tools: ['1-click approve', 'Slack', 'Email'],
      stat: 'You stay in control',
      caption: 'Routing every draft to you for one-click approval before it sends.',
      activity: 'Queued for your approval — nothing sends without a yes',
      detail: 'Nothing sends on its own. The drafts land in a simple queue where you approve, edit or reject in one click — so you keep full control of what goes out in your name.',
      gives: 'Full control. The AI drafts; you decide what actually goes out.',
    },
    {
      id: 'activate', tag: 'Send', label: 'Multichannel Send', icon: 'send',
      tools: ['Instantly', 'Smartlead', 'Lemlist', 'HubSpot', 'Voice / LinkedIn'],
      stat: 'Runs daily',
      caption: 'Sending through your email tool on schedule — replies come to you.',
      activity: 'Approved sequences sending on schedule · replies routed to you',
      detail: 'Approved sequences flow into your email platform and send on schedule, with replies routed back to your team. Add LinkedIn or a voice agent to reach people on more than one channel.',
      gives: 'Outreach that runs itself — daily, across channels — while replies land with you.',
    },
  ],
};

/** What changes for the buyer once the Sales Engine is running — the conviction. */
export const SALES_OUTCOMES: { title: string; body: string }[] = [
  { title: 'Reps close instead of prospect', body: 'The grunt work — list-building, research, first drafts — is done before your team sits down. They spend their day in conversations, not spreadsheets.' },
  { title: 'Every prospect gets real, personalised outreach', body: 'No spray-and-pray that burns your domain and your brand. Each message is grounded in research about that specific company.' },
  { title: 'Pipeline becomes predictable', body: 'The same engine runs every single day, so your top-of-funnel volume no longer depends on who felt motivated to prospect this week.' },
  { title: 'You own it, end to end', body: 'It runs on your tools, inside your stack, with your approval gate. No black box, no platform lock-in, no per-seat tax.' },
];

export const SALES_FAQS: { q: string; a: string }[] = [
  { q: 'Will the emails sound like a robot wrote them?', a: 'No. Each message is grounded in real research about that specific company and written in your voice from your own examples — and you approve or edit every one before it sends. The goal is outreach that reads like your best rep wrote it, not a mail-merge.' },
  { q: 'Do I have to switch my email tool or CRM?', a: 'No. The engine is tool-agnostic. It connects to the lead sources, email platform and CRM you already use — the tools shown are examples; we wire it to yours.' },
  { q: 'How is this different from Apollo, Clay or Instantly on their own?', a: 'Those are pieces of the puzzle — a data source, an enrichment tool, a sender. The engine connects them and adds the research, qualification, writing and approval layer in between, so the whole thing runs end-to-end instead of you stitching steps together by hand.' },
  { q: 'Can I keep control of what gets sent?', a: 'Yes — that’s the point of the approval step. Nothing leaves until a human approves it. You can review everything, sample-check, or auto-approve trusted segments — your call.' },
  { q: 'How many emails a day can it send safely?', a: 'It scales to your domains and sending limits. We set safe daily volumes and warm-up so your deliverability stays healthy — quality outreach, not blast.' },
];

/** The roadmap shown on the hub. Sales links to its page; the rest are honest
 *  "coming soon" — we detail each only after deep-researching the workflow. */
export interface RoadmapItem {
  name: string;
  kicker: string;
  status: EngineStatus;
  icon: IconKey;
  promise: string;
  href?: string;
}

export const ENGINE_ROADMAP: RoadmapItem[] = [
  { name: 'Sales Engine', kicker: 'Outbound & pipeline', status: 'live', icon: 'send', promise: SALES_ENGINE.promise, href: '/ai-engines/sales-engine' },
  { name: 'CPA & Tax Engine', kicker: 'Tax compliance & filing', status: 'live', icon: 'doc', promise: 'Ingests every client document, extracts all fields including K-1s and brokerage composites, pre-fills the return in your tax software, and routes a reviewer-ready file — with flagged items — to your CPA.', href: '/ai-engines/cpa-tax-engine' },
  { name: 'Investment Research Engine', kicker: 'Capital markets & portfolio AI', status: 'live', icon: 'chart', promise: 'Connects to every brokerage via Plaid and Yodlee, scans news and earnings signals, runs XGBoost and LSTM models to surface exact entry and exit points, and presents human-approved orders to your broker — while monitoring risk in real time.', href: '/ai-engines/investment-research-engine' },
  { name: 'Document Intelligence Engine', kicker: 'Any document → a cited answer', status: 'live', icon: 'layers', promise: 'Reads every document your business runs on — leases, loan files, tax returns, audit and compliance files — across legal, finance, compliance and tax, then lets anyone ask a plain-language question and get an answer cited to the exact page, grounded only in your own documents. Nothing is sent to public AI.', href: '/ai-engines/document-intelligence-engine' },
  { name: 'Legal & Regulatory Engine', kicker: 'Alerts, billing, knowledge & diligence', status: 'live', icon: 'shield', promise: 'Closes the four operational gaps in a modern firm: regulatory changes matched to live matters in minutes, AI-tool time captured into billing automatically, closed-matter precedents fed back into your knowledge base, and diligence reports drafted from completed document review.', href: '/ai-engines/legal-regulatory-engine' },
  { name: 'Customer Support Engine', kicker: 'Omnichannel CS · voice + text', status: 'live', icon: 'inbox', promise: 'Indexes your entire knowledge base, classifies every incoming query in under a second, routes it to the right specialist agent — technical, billing, debug, or feature — and escalates to a human with full context when needed. Voice and text, all channels.', href: '/ai-engines/customer-support-engine' },
];

/** Universal stages every engine shares — the "how an AI engine works" explainer. */
export const ENGINE_STAGES: { title: string; body: string }[] = [
  { title: 'Connect', body: 'The engine plugs into the tools, databases and channels you already run — no rip-and-replace. Your data stays in your systems.' },
  { title: 'Reason', body: 'Specialised AI agents research, classify, score and decide — each good at one job, working together on the whole workflow.' },
  { title: 'Act', body: 'It does the work: writes, files, sends, reports, resolves. Real actions in your stack, not suggestions on a dashboard.' },
  { title: 'Stay in control', body: 'A human-approval gate sits wherever you want one, every step is logged, and the whole thing runs inside your environment.' },
];

export const HUB_FAQS: { q: string; a: string }[] = [
  { q: 'What is an AI engine?', a: 'An AI engine is a connected system of specialised AI agents that runs an entire workflow end-to-end — pulling data from your tools, reasoning over it, taking real action, and syncing the result back — rather than a single chatbot that only answers questions. Each engine we build is a different workflow assembled the same way.' },
  { q: 'Do I have to replace my current tools?', a: 'No. Every engine is tool-agnostic. It connects to the platforms you already use — your CRM, help desk, tax software, data feeds or document stores — and works inside your stack.' },
  { q: 'Where does my data live, and is it secure?', a: 'Engines run inside your own environment, so your data stays in your systems. We add human-approval gates, access controls, redaction and full audit logging — which is why regulated firms in finance, legal and tax work with us.' },
  { q: 'Can I start with just one engine?', a: 'Yes — most clients start with a single workflow, prove the ROI, then expand. We scope one engine, agree the success metrics upfront, build and test it, then hand it over with documentation and support.' },
];

// ============================================================================
// CPA & TAX ENGINE — deep-researched, source-cited. Built 2026-06-09.
// ============================================================================

export const CPA_TAX_ENGINE: EngineDef = {
  id: 'cpa-tax',
  slug: 'cpa-tax-engine',
  name: 'CPA & Tax Engine',
  kicker: 'Tax compliance & filing',
  status: 'live',
  icon: 'doc',
  promise:
    'Ingests every client document, extracts all fields including K-1s and non-standard brokerage composites, pre-fills the return in your tax software, and routes a reviewer-ready file — with flagged items — to your CPA.',
  nodes: [
    {
      id: 'intake', tag: 'Intake', label: 'Document Intake', icon: 'inbox',
      tools: ['TaxDome', 'SmartVault', 'SharePoint', 'Google Drive', 'Box'],
      stat: '42 files ingested',
      caption: 'Pulling client documents — 42 files across 3 sources.',
      activity: 'All client documents pulled and queued — no manual upload',
      detail: 'Connects to wherever your clients submit documents — TaxDome, SmartVault, SharePoint, Google Drive, Box, or Dropbox. Every file is pulled, deduplicated, and queued for classification. No one opens a folder. No manual upload. A timestamped intake record is created before any human touches the file.',
      gives: 'Complete, timestamped document record per client — before a preparer opens the file.',
    },
    {
      id: 'classify', tag: 'Classify', label: 'AI Classification', icon: 'layers',
      tools: ['W-2', '1099-B / DIV / INT', 'K-1 (1065 / 1120-S)', 'Schedule E', 'Brokerage composite'],
      stat: '18 doc types classified',
      caption: 'Identifying 18 document types across 42 files.',
      activity: 'Every document identified by type — unrecognised files flagged',
      detail: 'Every document is identified and tagged by type — W-2, 1099-INT, 1099-DIV, 1099-B composite, K-1 (Form 1065), K-1 (Form 1120-S), Schedule E, prior-year return, organizer, receipts. The classifier is trained on the specific visual and structural signatures of tax documents, not a generic document model.',
      gives: 'A labelled document set, sorted by type, with any unrecognised files flagged for human review.',
    },
    {
      id: 'extract', tag: 'Extract', label: 'Field Extraction & Verify', icon: 'search',
      tools: ['OCR engine', 'ML verifier', 'PDF text layer', 'Confidence threshold'],
      stat: '97.4% auto-verified',
      caption: 'Extracting 1,847 fields — 48 flagged for review.',
      activity: '1,847 fields extracted · ML verification pass complete',
      detail: 'Each document class routes to a specialist extraction agent — W-2 Box 1 through Box 20, every 1099-B lot, K-1 Boxes 1–20 for partnership returns. After extraction, an ML verification pass compares each value against the PDF text layer and flags low-confidence reads rather than silently accepting them. Nothing is quietly wrong.',
      gives: 'Extracted data with a confidence score per field and a flagged-items list. Low-confidence reads surface for review, not into the return.',
    },
    {
      id: 'gaps', tag: 'Chase', label: 'Gap Detection', icon: 'spark',
      tools: ['TaxDome', 'Karbon', 'Canopy', 'Email'],
      stat: '3 gaps detected',
      caption: 'Missing documents identified — client reminders sent.',
      activity: 'Gap report built · targeted reminders sent via practice management',
      detail: 'Cross-references the extracted document set against the prior-year return and engagement organiser. Missing K-1 from a partnership that filed an extension? Foreign account in the prior return not in this year\'s organiser? Each gap generates a targeted client reminder via your practice management system — with context, not a generic "please send documents" email.',
      gives: 'A gap report per client and automated reminders through TaxDome, Karbon, or Canopy. You stop manually tracking who owes what.',
    },
    {
      id: 'populate', tag: 'Populate', label: 'Return Population', icon: 'doc',
      tools: ['UltraTax CS', 'CCH Axcess', 'Drake', 'Lacerte', 'ProConnect'],
      stat: 'Return 94% pre-filled',
      caption: 'Importing 1,799 verified fields into UltraTax CS.',
      activity: 'Return pre-filled · 48 flagged items queued for preparer',
      detail: 'Structured, verified data is mapped to your tax software\'s native import format and pushed in — UltraTax CS, CCH Axcess, Drake, Lacerte, ProConnect, GoSystem Tax RS — through the same import mechanisms that SurePrep and GruntWorx use today. The return arrives pre-filled; the flagged items arrive as a structured punch-list in the preparer\'s workflow queue.',
      gives: 'A return that is 90–94% complete before the preparer opens it, with a clear list of what still needs professional judgement.',
    },
    {
      id: 'review', tag: 'Review', label: 'CPA Review & E-file', icon: 'shield',
      tools: ['Review dashboard', 'e-signature', 'IRS MeF', 'SafeSend'],
      stat: '18 min to sign-off',
      caption: 'CPA approves — filed via IRS MeF.',
      activity: 'Reviewer sign-off complete · return filed via IRS MeF',
      detail: 'The preparer sees a review dashboard: source document and extracted value side by side, every flagged item with context, and a single-click approval flow. Nothing is filed until the CPA approves. After approval the return moves to e-signature and IRS MeF submission through the firm\'s existing tax software — nothing bypasses your compliance chain.',
      gives: 'A CPA review that takes 15–25 minutes instead of 3–4 hours, because every repetitive decision has already been resolved.',
    },
  ],
};

/** Concrete sample output revealed per step. Same example account
 *  ("Marcus Chen") flows through all 6 steps so the viewer watches
 *  data being built up and acted on. */
export const CPA_TAX_OUTPUTS: Record<string, string[]> = {
  intake: [
    'W-2 · Employer: Meridian Capital Group',
    '1099-DIV · Fidelity Investments',
    '1099-B · Schwab Composite (38 pages)',
    'K-1 (1065) · Stonegate Partners II LP',
    'K-1 (1120-S) · Chen & Associates LLC',
    '+37 additional documents indexed',
  ],
  classify: [
    'W-2: Box 1 wages $287,400 — Meridian Capital',
    '1099-DIV: Qualified dividends $14,230 — Fidelity',
    '1099-B Composite: 127 transactions — Schwab',
    'K-1 (1065): 20 line items — Stonegate Partners',
    'K-1 (1120-S): Ordinary loss $8,420 — Chen & Assoc.',
    'Prior-year return: 2023 1040 — matched',
  ],
  extract: [
    '✓ W-2 Box 1: $287,400 — PDF text match',
    '✓ 1099-B: $1.2M gross proceeds — 127 lots',
    '✓ K-1 Box 2 rental income: $31,400 — Stonegate',
    '⚠ K-1 Box 20 Code AH — unrecognised entry',
    '⚠ 1099-B lot 43: cost basis missing',
    '✓ 124 of 127 lots auto-verified',
  ],
  gaps: [
    '⚠ K-1 (Stonegate II LP) — partnership filed extension',
    '⚠ FBAR disclosure — $92k HSBC Switzerland not in organiser',
    '✓ All W-2 / 1099 documents present',
    '→ Reminder sent via TaxDome (2 open items)',
    '→ FBAR flagged · partner notification queued',
  ],
  populate: [
    '→ Schedule B: $14,230 dividends imported',
    '→ Schedule D / Form 8949: 127 lots mapped',
    '→ Schedule E: K-1 loss ($8,420) — Chen & Assoc.',
    '→ Carryforward $12,100 from 2023 — verified',
    '→ 48 flagged items queued for preparer review',
    '→ Return 94% pre-filled · ready for CPA',
  ],
  review: [
    '✓ K-1 Box 20 AH — Section 199A applied by preparer',
    '✓ Lot 43 basis: $4,200 confirmed by client',
    '✓ FBAR: partner-reviewed · Form 114 queued',
    '✓ Return reviewed and signed',
    '→ E-filed via IRS MeF',
    'Total: 18 min review vs ~4.5 hrs manual prep',
  ],
};

export const CPA_TAX_WHATIS: string[] = [
  'The AI CPA & Tax Engine is a multi-agent system purpose-built for US accounting firms. It handles the labour-intensive stages of tax prep — document collection, classification, data extraction, gap detection, and return population — autonomously, while leaving professional judgement and sign-off to the CPA.',
  'Think of it as a senior staff accountant who has already processed all 42 of a client\'s documents, extracted every W-2 box, verified every 1099-B lot, identified the missing K-1, and handed you a pre-built file with a punch-list — before you sit down. The engine does not file anything. You do, after reviewing what it prepared.',
  'This matters legally: under the revised AICPA Statements on Standards for Tax Services (effective January 1, 2024), the signing CPA is personally responsible for the completed return, regardless of what tools prepared it. The engine is designed around that constraint — not against it.',
];

export const CPA_TAX_HOWITWORKS_INTRO =
  'Six specialised agents work in sequence, each handing structured data to the next. Each stage is purpose-built for its document type — a K-1 extraction agent trained on Boxes 1–20 of Schedule K-1 (Form 1065) outperforms any general-purpose OCR model on the same data.';

export const CPA_TAX_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Every US CPA firm runs the same gauntlet from January through April 15. The bottleneck is not tax judgement — it\'s the 3–6 hours of data entry, document-chasing, and classification that happen before any judgement begins. That labour is expensive, error-prone, and can\'t be hired away.',
  pains: [
    '58% of clients submit documents after February 15 — compressing the real work into six weeks (CPA Practice Advisor, n=438, 2026).',
    'A complex 1040 with K-1s and brokerage composites requires 3–6 hours of data entry before any tax analysis begins.',
    '70% of CPAs reported making or catching near-miss errors in the final 48 hours before April 15.',
    'SurePrep 1040SCAN — the industry\'s leading scan tool — covers ~700 financial institutions. Any other brokerage gets only summary data, not full extraction.',
    'State K-1s receive zero automated data capture in UltraTax CS; they are indexed to the parent Federal K-1 and left blank (Thomson Reuters documentation).',
    '55,152 accounting degrees awarded in 2023–24 — down 6.6% year-over-year. The staffing shortage is structural. The talent pipeline will not recover at the pace firms need (Journal of Accountancy, Oct 2025).',
  ],
  closing:
    'The result: your most expensive staff spend most of tax season on work that is not tax work. The engine doesn\'t change tax law or replace CPAs — it eliminates the hours that should never have been billable in the first place.',
};

export const CPA_TAX_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most firms are live in 3–5 weeks — not months.',
  phases: [
    { phase: 'Connect document sources', time: 'Week 1–2', detail: 'Authenticate to your DMS — TaxDome, SmartVault, SharePoint, Google Drive, Box. Read-only access; nothing is modified at source.' },
    { phase: 'Configure & test', time: 'Week 2–3', detail: 'Tune the document classifier for your client mix. Run the engine on 10 de-identified prior-year returns. Validate extraction accuracy side-by-side.' },
    { phase: 'Map to your tax software', time: 'Week 3–4', detail: 'Configure the import format for your primary tax software — UltraTax, Drake, CCH, ProConnect, Lacerte, or GoSystem. First full end-to-end import tested.' },
    { phase: 'Parallel run & go-live', time: 'Week 4–5', detail: 'Run 20 live returns in parallel with manual prep. Compare outputs. CPA team signs off. Engine goes live for remaining returns.' },
  ],
  prerequisites: [
    'A practice management or portal system (TaxDome, Karbon, Canopy, or equivalent).',
    'Client documents stored in any standard DMS (Google Drive, SharePoint, Box, SmartVault).',
    'Access to your tax software\'s import/export format — provided by your software vendor.',
    'A designated "Qualified Individual" per FTC Safeguards Rule — most firms already have one.',
    'Your EFIN. The engine does not e-file on your behalf; your existing software and credentials do.',
  ],
  note: 'No public API is needed for any major tax software. Integration uses the same file-import mechanisms SurePrep and GruntWorx use today — proven in production at thousands of US CPA firms.',
};

export const CPA_TAX_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: '40%', label: 'average reduction in prep time per return' },
    { value: '3×', label: 'capacity gain per staff member during busy season' },
    { value: '94%', label: 'return pre-fill rate on standard individual returns' },
    { value: '3–5 wks', label: 'to go live — no multi-month implementation' },
  ],
  narrative:
    'At an average billing rate of $250–$500 per hour, every hour of prep time eliminated is a direct margin gain — reinvested in advisory work or dropped to the bottom line. For a 10-person firm filing 600 returns per season, a 30% throughput gain means roughly 180 additional returns without a new hire. At the industry\'s average $700 per return, that is $126,000 in added capacity revenue per season from the same team. The 40% and 3× figures are benchmarks from Filed, a comparable automation platform. Chronexa provides a parallel-run on 20 live returns before full deployment — you validate results before committing.',
};

/**
 * PLACEHOLDER testimonials — must be replaced with real attributable quotes
 * before this page goes to production.
 */
export const CPA_TAX_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We were burning 3–4 hours per complex return on data entry alone. Now the preparer opens a pre-filled file with flagged items already organised. The first tax season running the engine, we processed 22% more returns with the same staff.', name: 'James Holbrook', role: 'Managing Partner', company: 'Holbrook & Associates CPA' },
  { quote: 'The K-1 extraction alone justified the investment. Every other tool we tested couldn\'t touch state K-1s — they were entirely manual. The engine handles our partnership clients end-to-end.', name: 'Priya Nair', role: 'Tax Manager', company: 'Sterling Ridge Tax Group' },
  { quote: 'We had a data scare three years ago and have been paranoid about client data security since. The WISP documentation and US-hosted architecture weren\'t just checkbox items — they were a genuine selling point when I took it to the partners.', name: 'David Schreiber', role: 'Firm Administrator', company: 'Schreiber Financial Group' },
];

export const CPA_TAX_FAQS: { q: string; a: string }[] = [
  { q: 'Does the engine replace the CPA reviewer?', a: 'No — and it\'s not designed to. Under the revised AICPA Statements on Standards for Tax Services (effective January 1, 2024), the signing CPA is personally responsible for the completed return, regardless of what tools prepared it. The "under penalties of perjury" statement on every filed return means this cannot be delegated to software. What the engine changes is what the reviewer looks at: an organised, pre-filled file with flagged items, instead of a blank screen and a folder of PDFs.' },
  { q: 'Which tax software does it work with?', a: 'Drake, ProConnect (Intuit), CCH Axcess (Wolters Kluwer), UltraTax CS (Thomson Reuters), Lacerte (Intuit), and GoSystem Tax RS. Integration works through each software\'s native import format — the same mechanism SurePrep 1040SCAN and GruntWorx use to populate returns today. No public API is required from any vendor.' },
  { q: 'What happens with K-1s from late-filing partnerships?', a: 'The Gap Detection agent identifies missing K-1s based on prior-year return data and sends targeted reminders to the client. When the K-1 arrives — in September after an extension — it is processed automatically and the return is updated. The preparer is notified. No manual tracking required.' },
  { q: 'Is sending client tax data to a third-party AI tool legal under IRC §7216?', a: 'Yes — with conditions. IRC §7216 and 26 CFR §301.7216-2 permit disclosure of tax return information to third-party service providers without taxpayer consent, as long as the purpose is tax return preparation. The engine is deployed on US-hosted infrastructure, which avoids the separate written-consent requirement that applies to processors located outside the United States. Chronexa provides a standard service agreement that satisfies the §7216 service-provider conditions.' },
  { q: 'We already use SurePrep 1040SCAN — what does the engine add?', a: '1040SCAN is strong for W-2s and brokerage statements from its ~700-institution coverage list. But it explicitly does not capture state K-1 data, and any brokerage not on the list gets only summary amounts — not line-item detail. Crypto CSVs, multi-state allocations, Schedule E worksheets, and non-standard documents remain largely manual. The engine handles the edge cases that represent the majority of your most expensive prep hours — the complex clients who, incidentally, also pay the highest fees.' },
];

export const CPA_TAX_NUDGE = {
  title: 'See it run on one of your actual client returns',
  body: 'We\'ll import a de-identified prior-year return file, run it through the engine live, and show you the reviewer-ready output — flagged items included. No prep required on your end.',
  cta: 'Book a Free Demo',
};

// ============================================================================
// SALES ENGINE — long-form page content (CXO-targeted, lead-gen copy).
// ============================================================================

/** Concrete sample OUTPUT the live demo reveals at each step — the same example
 *  account ("Rahul / Acme Logistics") is enriched as it flows through, so a
 *  viewer literally watches the data being built up and acted on. */
export const SALES_OUTPUTS: Record<string, string[]> = {
  capture: ['Rahul Verma — VP Sales, Acme Logistics', 'Priya Nair — Head of Ops, FleetIQ', '+ 2,338 accounts matched to your ICP'],
  research: ['Series B raised · 14 months ago', 'Hiring 4 SDRs · scaling outbound', 'Stack: HubSpot · Outreach', 'Signal: freight-cost pressure (Q2 update)'],
  qualify: ['Fit score 92 / 100', 'Why: ICP match + active buying intent', '19 low-fit accounts dropped automatically'],
  compose: ['Subj: Cutting Acme’s freight-cost leakage', '“Hi Rahul — saw FleetIQ’s Q2 note on…”', '6-touch sequence drafted in your voice'],
  review: ['38 approved in one click', '2 edited · 1 held back', 'Audit-logged — nothing auto-sends'],
  activate: ['41 enrolled · first touch 09:00 local', 'Channels: email + LinkedIn', 'Replies routed straight to your inbox'],
};

export const SALES_WHATIS: string[] = [
  'The Sales Engine is an AI sales automation system — a coordinated team of AI agents that runs your entire outbound motion end to end. Instead of buying another point tool or hiring another SDR, you get a system that sources prospects, researches every account, qualifies for fit, writes personalised sequences, and sends them through your existing stack — continuously, and under your control.',
  'It is not a chatbot and not a single “AI SDR” gimmick. It is production-grade revenue infrastructure: specialised agents, a human-approval gate, and full visibility — built to fill pipeline predictably while your team stays focused on closing.',
];

export const SALES_HOWITWORKS_INTRO =
  'Six specialised agents work in sequence, each handing structured data to the next — the same way your best SDR would work an account, but at scale and without the manual lift. Here is exactly what happens, and what you get from each step.';

export const SALES_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro: 'If you sell B2B, you already know outbound works — when it is done well. The problem is that doing it well does not scale with headcount.',
  pains: [
    'Reps lose 60–70% of their week to list-building, research and admin instead of selling.',
    'Generic, un-researched blasts burn your domain reputation and your brand.',
    'Pipeline is feast-or-famine — volume depends on who felt motivated to prospect this week.',
    'Every new tool adds another silo your team has to stitch together by hand.',
  ],
  closing: 'The Sales Engine removes the manual layer between your tools, so the work happens on its own — researched, personalised, and approved by you before anything sends.',
};

export const SALES_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most teams are live in 2–4 weeks — not months.',
  phases: [
    { phase: 'Scope & success metrics', time: 'Week 1', detail: 'We map your ICP, your messaging and the single outcome we will measure.' },
    { phase: 'Connect your stack', time: 'Week 1–2', detail: 'We wire the engine to your lead sources, email platform and CRM.' },
    { phase: 'Pilot & tune', time: 'Week 2–3', detail: 'A controlled run with your approval on every send while we tune fit and copy.' },
    { phase: 'Scale safely', time: 'Week 3–4', detail: 'Ramp volume with deliverability guardrails. You own the system end to end.' },
  ],
  prerequisites: [
    'A defined ICP — a clear picture of who your best customers are.',
    'Access to at least one lead source (Apollo, Clay, ZoomInfo, or a list).',
    'An email sending platform and domain(s) for outreach.',
    'A few examples of messaging that already sounds like you.',
  ],
  note: 'No engineering team required on your side. We build, test and hand it over with documentation and support.',
};

export const SALES_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: '10+ hrs', label: 'saved per rep, every week' },
    { value: '3–5×', label: 'more researched accounts touched' },
    { value: '2–4 wks', label: 'to live, not months' },
    { value: '100%', label: 'of sends human-approved' },
  ],
  narrative:
    'The math is simple. When each rep gets back a day or more every week and every prospect is properly researched, the same team books more qualified meetings — without adding headcount or burning the domain. The engine pays for itself in pipeline, then keeps compounding.',
};

/**
 * PLACEHOLDER testimonials — fabricated to show the final design and tone.
 * Replace with real, attributable client quotes before this goes to production.
 */
export const SALES_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We replaced three disconnected tools and half an SDR’s week with one engine. Our reps stopped building lists, and our qualified-meeting rate climbed inside the first month.', name: 'Maya R.', role: 'VP Revenue', company: 'B2B logistics SaaS' },
  { quote: 'What sold me was control. Nothing goes out without our approval, but we are not lifting a finger to research or write. It feels like we hired a research team that never sleeps.', name: 'Daniel K.', role: 'Founder & CEO', company: 'Series B fintech' },
  { quote: 'Pipeline used to be feast or famine. Now it is predictable — the same team, far more researched outreach going out every single day.', name: 'Aisha N.', role: 'Head of Sales', company: 'Enterprise data platform' },
];

export const SALES_NUDGE = {
  title: 'Book your free demo',
  body: 'See the Sales Engine run on your ICP — and walk away with a build estimate in 30 minutes. No slides, just your pipeline.',
  cta: 'Book a Free Audit',
};

// ============================================================================
// REACT FLOW LAYOUT DATA
// Node positions + edges for the WorkflowCanvas interactive demo.
// Each engine gets its own unique layout reflecting its pipeline shape.
// ============================================================================

/** Sales Engine — circular daily loop: source → enrich → qualify → compose → approve → send */
export const SALES_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  // Row 1 — left to right
  capture:  { x: 0,   y: 0   },
  research: { x: 315, y: 0   },
  qualify:  { x: 630, y: 0   },
  // Row 2 — right to left (snake)
  compose:  { x: 630, y: 210 },
  review:   { x: 315, y: 210 },
  activate: { x: 0,   y: 210 },
};

export const SALES_FLOW_EDGES = [
  { id: 'e-cap-res', source: 'capture',  target: 'research', sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-res-qua', source: 'research', target: 'qualify',  sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-qua-com', source: 'qualify',  target: 'compose',  sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-com-rev', source: 'compose',  target: 'review',   sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-rev-act', source: 'review',   target: 'activate', sourceHandle: 'left',   targetHandle: 'right' },
];

export const CPA_TAX_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  // Row 1 — left to right
  intake:   { x: 0,   y: 0   },
  classify: { x: 315, y: 0   },
  extract:  { x: 630, y: 0   },
  // Row 2 — right to left (snake)
  gaps:     { x: 630, y: 210 },
  populate: { x: 315, y: 210 },
  review:   { x: 0,   y: 210 },
};

export const CPA_TAX_FLOW_EDGES = [
  { id: 'e-int-cla', source: 'intake',   target: 'classify', sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-cla-ext', source: 'classify', target: 'extract',  sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-ext-gap', source: 'extract',  target: 'gaps',     sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-gap-pop', source: 'gaps',     target: 'populate', sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-pop-rev', source: 'populate', target: 'review',   sourceHandle: 'left',   targetHandle: 'right' },
];

// ============================================================================
// INVESTMENT RESEARCH ENGINE
// First-hand: Plaid/Yodlee data ingest, XGBoost/LSTM signal generation,
// broker API execution, real-time portfolio monitoring, rebalancing.
// ============================================================================

export const INV_RESEARCH_ENGINE: EngineDef = {
  id: 'investment-research',
  slug: 'investment-research-engine',
  name: 'Investment Research Engine',
  kicker: 'Capital markets & portfolio AI',
  status: 'live',
  icon: 'chart',
  promise:
    'Connects to every brokerage via Plaid and Yodlee, scans news and earnings signals, runs XGBoost and LSTM models to surface exact entry and exit points, and presents human-approved orders to your broker — while monitoring risk metrics in real time.',
  nodes: [
    {
      id: 'ingest', tag: 'Connect', label: 'Data Ingest', icon: 'database',
      tools: ['Plaid', 'Yodlee', 'IBKR API', 'Schwab API', 'Fidelity API'],
      stat: '$2.4M AUM synced',
      caption: 'Syncing live portfolio positions and account data across all connected brokerages.',
      activity: '3 accounts synced · 47 holdings · latest prices pulled',
      detail: 'Connects via Plaid and Yodlee to every linked brokerage and bank account. Pulls current holdings, transaction history, cost basis, and real-time balances — no manual export, no CSV upload. The engine always starts with live portfolio state, so every signal and risk metric is calculated against what you actually hold right now.',
      gives: 'A complete, live picture of the portfolio before any research or analysis begins.',
    },
    {
      id: 'research', tag: 'Research', label: 'Market Research', icon: 'search',
      tools: ['News APIs', 'SEC EDGAR', 'Earnings transcripts', 'Analyst feeds', 'Sentiment model'],
      stat: '247 signals scanned',
      caption: 'Scanning news, earnings, and sentiment signals across every held position.',
      activity: '247 signals scanned · 14 high-conviction triggers identified',
      detail: 'A research agent scans news, earnings call transcripts, SEC filings, and analyst commentary across every held position and watchlist ticker. Sentiment is quantified on a rolling basis and signals are calibrated to your specific holdings — not generic market headlines, but events that historically precede price moves in the securities you own.',
      gives: 'A prioritised signal feed — what matters to your portfolio right now, ranked by conviction.',
    },
    {
      id: 'signal', tag: 'Model', label: 'Signal Generation', icon: 'chart',
      tools: ['XGBoost', 'LSTM', 'Regression ensemble', 'Kelly criterion', '10-year backtest'],
      stat: 'Entry signal · 0.89 confidence',
      caption: 'Running XGBoost and LSTM models to identify entry and exit signals.',
      activity: 'NVDA: entry signal · XGBoost confidence 0.89 · Kelly fraction 4.2%',
      detail: 'Gradient boosting (XGBoost) and LSTM neural networks trained on 10 years of price, volume, and sentiment data produce entry and exit signals with a confidence score per signal. The Kelly criterion sizes each position so you are never overexposed. Signals are probabilistic decision inputs, not instructions — every one is human-reviewed before any order is placed.',
      gives: 'A ranked list of actionable signals — entry price, exit target, position size, confidence score.',
    },
    {
      id: 'execute', tag: 'Execute', label: 'Order Execution', icon: 'send',
      tools: ['IBKR API', 'Alpaca', 'Schwab API', 'TD Ameritrade', 'Human approval gate'],
      stat: 'Order queued · human approved',
      caption: 'Human-approved orders routed to the broker via API.',
      activity: 'BUY 40 NVDA @ market · $14,800 · queued for approval',
      detail: 'Every signal generates a draft order — ticker, direction, size, order type. Nothing routes to the broker until a human approves it. Once approved, the order executes via your broker API. Partial fills, rejections, and fill confirmations are logged and fed back into the portfolio state for the monitoring step.',
      gives: 'Approved orders placed in seconds, with a full audit trail of who approved what and when.',
    },
    {
      id: 'monitor', tag: 'Monitor', label: 'Portfolio Monitor', icon: 'layers',
      tools: ['Real-time P&L', 'Beta tracker', 'Drawdown alert', 'Sharpe calculator', 'Sector exposure'],
      stat: 'Sharpe (30d): 1.84',
      caption: 'Monitoring P&L, risk metrics, and drawdown continuously.',
      activity: 'Beta: 1.12 · Sharpe: 1.84 · Max DD: -3.2% · no alerts triggered',
      detail: 'Continuous monitoring of portfolio-level risk metrics — beta, Sharpe ratio, max drawdown, sector concentration, and correlation. Threshold breaches trigger immediate alerts. The monitor feeds current portfolio state back into the signal model, so every research cycle starts with live data — not what the portfolio looked like when the market opened.',
      gives: 'Live risk visibility — you know the portfolio\'s health at every moment, not just when you log in.',
    },
    {
      id: 'rebalance', tag: 'Rebalance', label: 'Rebalance & Report', icon: 'spark',
      tools: ['Drift detection', 'Tax-loss harvesting', 'Rebalance scheduler', 'Client report'],
      stat: '3 trades to rebalance',
      caption: 'Drift detected — rebalance plan and tax-loss opportunities identified.',
      activity: 'Tech sector: 34% → target 28% · 3 sell orders queued · tax-loss: $4,200',
      detail: 'When sector or position drift exceeds the configured threshold, the rebalance engine calculates the minimum set of trades to restore target allocation. Tax-loss harvesting opportunities are flagged automatically. The rebalance plan is presented for approval — not executed automatically — and the resulting report is formatted for client delivery.',
      gives: 'A rebalance plan that is tax-aware, minimal in turnover, and client-ready — without a spreadsheet.',
    },
  ],
};

export const INV_RESEARCH_OUTPUTS: Record<string, string[]> = {
  ingest: [
    'Plaid: 3 accounts synced · $2.4M AUM',
    '47 holdings · cost basis verified',
    'NVDA: 340 shares · avg cost $148.20',
    'AAPL: 120 shares · avg cost $167.50',
    'Cash: $84,300 · 3.5% of portfolio',
    'Last sync: 09:01 EST · real-time',
  ],
  research: [
    'NVDA: sentiment 0.82 (Bull) · 14 news signals',
    'Q2 earnings beat · data centre revenue +42%',
    'AAPL: sentiment 0.48 (Neutral) · 3 signals',
    'MSFT: SEC 10-Q filed · cloud segment +18%',
    '⚠ Meta: insider selling · 2 exec transactions',
    '247 signals scanned · 14 high-conviction triggers',
  ],
  signal: [
    'NVDA: entry signal · XGBoost confidence 0.89',
    'Kelly fraction: 4.2% · position size: $100,800',
    'Entry zone: $182.40–$187.20 · stop: $174.00',
    'AAPL: hold · no signal · target unchanged',
    '⚠ Meta: exit signal · confidence 0.77',
    'Backtested Sharpe on signals: 2.14 (3yr)',
  ],
  execute: [
    'BUY 40 NVDA @ market · $14,800 · queued',
    'SELL 80 META @ limit $492.00 · queued',
    '→ Awaiting human approval',
    '✓ Approved by portfolio manager · 09:14 EST',
    '→ Routed to IBKR · order ID #7841923',
    '✓ NVDA: filled @ $183.60',
  ],
  monitor: [
    'Portfolio beta: 1.12 (target: 1.0–1.15 ✓)',
    'Sharpe ratio (30d): 1.84',
    'Max drawdown (90d): -3.2% (limit: -8% ✓)',
    'Tech sector: 34% of portfolio',
    'NVDA position: 12.8% (limit: 15% ✓)',
    'No risk alerts triggered',
  ],
  rebalance: [
    'Tech sector: 34% → target 28% · drift +6%',
    'Rebalance: SELL $145,000 tech positions',
    '→ 3 sell orders calculated (min turnover)',
    'Tax-loss harvest: META loss $4,200 captured',
    '→ Rebalance plan queued for approval',
    'Client report: ready to send',
  ],
};

export const INV_RESEARCH_WHATIS: string[] = [
  'The Investment Research Engine is a multi-agent system that connects directly to your portfolio via Plaid and Yodlee, runs continuous news and sentiment research, generates entry and exit signals using XGBoost and LSTM models, and presents human-approved orders to your broker — all without manual data pulling or spreadsheet work.',
  'Think of it as a research analyst and risk manager working in parallel, 24 hours a day. It reads the news, models the signal, calculates the position size, and brings you a draft order — while you stay in control of every execution decision. Nothing trades without your approval.',
  'This matters for compliance: the engine generates signals and draft orders, but every trade requires human sign-off before routing to a broker. Every decision is logged with the timestamp and approver identity — which is what institutional risk and compliance frameworks require, whether you are an SEC-registered RIA or a family office.',
];

export const INV_RESEARCH_HOWITWORKS_INTRO =
  'Six agents work in sequence — data always flows from live sources, never from a cached spreadsheet. Each agent is specialised: the LSTM that models price signals is different from the Kelly calculator that sizes positions. Here is exactly what happens at each step.';

export const INV_RESEARCH_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Portfolio managers and research analysts at mid-size investment firms face a structural problem: the tools exist to do quantitative research, but the data pipeline between market sources and model inputs is entirely manual.',
  pains: [
    'Pulling portfolio data from multiple brokerages into a single view takes 1–2 hours per morning before any analysis begins.',
    'News and sentiment monitoring is ad hoc — the analyst reads what they happen to see, not a systematic signal scan calibrated to their holdings.',
    'ML models exist but sit idle because re-running them requires a manual data refresh and export cycle.',
    'Rebalance calculations live in Excel — not tax-aware, not version-controlled, and one formula error away from a costly mistake.',
    'Trade execution is disconnected from the model output: the signal lives in one tool, the order is placed in another by hand.',
    'Portfolio-level risk metrics — beta, Sharpe, drawdown — are checked periodically, not continuously.',
  ],
  closing:
    'The engine does not replace the portfolio manager — it removes the hours between signal and action, so the manager spends time on judgment, not data plumbing.',
};

export const INV_RESEARCH_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most teams are live in 2–3 weeks.',
  phases: [
    { phase: 'Connect data sources', time: 'Week 1', detail: 'Authenticate Plaid and Yodlee to your brokerage accounts. Map holdings and cost basis. Validate data against your own records before any model runs.' },
    { phase: 'Configure signal model', time: 'Week 1–2', detail: 'Load your watchlist and portfolio. Set risk parameters — sector limits, max position size, drawdown thresholds. Run the first backtest against your actual holdings on 10 years of historical data.' },
    { phase: 'Approval gate + execution', time: 'Week 2', detail: 'Connect to your broker API. Wire the human approval gate. Run 10 live signals through the approval flow before any live orders are placed.' },
    { phase: 'Monitor and calibrate', time: 'Week 2–3', detail: 'Run live for two weeks with daily review. Adjust signal thresholds and Kelly fraction based on observed performance before full deployment.' },
  ],
  prerequisites: [
    'Portfolio held at any major US brokerage (IBKR, Schwab, Fidelity, TD Ameritrade, Alpaca) — Plaid-connected.',
    'A defined investment policy — sector limits, maximum position size, drawdown tolerance.',
    'A designated approver for orders — PM, CIO, or compliance officer.',
    'Historical portfolio data for the backtest — prior-year statements or a brokerage export.',
  ],
  note: 'No Bloomberg terminal required. The engine works with publicly available market data feeds and your brokerage\'s own API — tools you already have access to.',
};

export const INV_RESEARCH_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: '2 hrs', label: 'saved per day on manual data pulling and research' },
    { value: '90 sec', label: 'from signal to human-reviewed draft order' },
    { value: '10 yrs', label: 'of historical data in the signal model backtest' },
    { value: '2–3 wks', label: 'to go live on your live portfolio' },
  ],
  narrative:
    'For a mid-size RIA or family office managing $50M–$500M, the compounding value is time: two hours per day returned to the portfolio manager means 500 hours per year redirected from data pulling to judgment calls and client relationships. On a $100M portfolio, one well-timed signal identified by the model and acted on in seconds — instead of spotted an hour later — can represent more than the engine\'s annual cost. The model is backtested against your actual holdings before go-live, so you see the historical Sharpe and win rate before committing to live capital.',
};

/** PLACEHOLDER — replace with real attributable quotes before production. */
export const INV_RESEARCH_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We were running three separate spreadsheets just to get a clean morning view of our positions. The engine replaced all of that — live data, signals ready by 8 AM, and we haven\'t touched Excel for portfolio data in four months.', name: 'Vikram S.', role: 'Portfolio Manager', company: 'Mid-size RIA, $180M AUM' },
  { quote: 'The XGBoost model surfaced a re-entry signal three hours before I would have manually identified it. That one trade justified the first quarter\'s cost.', name: 'James L.', role: 'CIO', company: 'Single-family office' },
  { quote: 'The approval gate was non-negotiable for us — our compliance requires every trade decision to be human-authorised and logged. The audit trail the engine produces has simplified our quarterly compliance review.', name: 'Priya M.', role: 'Chief Compliance Officer', company: 'SEC-registered investment advisor' },
];

export const INV_RESEARCH_FAQS: { q: string; a: string }[] = [
  { q: 'Does the engine place trades automatically?', a: 'No. Every signal generates a draft order, and nothing routes to the broker until a human approves it. The approval can be one click in a dashboard or a Slack message — your choice. The audit log records who approved, at what time, and what the signal was. This is a hard design constraint, not an option — it is what institutional compliance requires.' },
  { q: 'Which brokerages does it connect to?', a: 'Any brokerage supported by Plaid or Yodlee for portfolio data — which covers the major US custodians including IBKR, Schwab, Fidelity, TD Ameritrade, and Alpaca. Order execution connects via the broker\'s own API.' },
  { q: 'How is the ML model trained and validated?', a: 'XGBoost and LSTM models are trained on 10 years of historical price, volume, and sentiment data. Before go-live, we run a full backtest against your actual holdings and watchlist — you see the historical Sharpe ratio, win rate, and max drawdown the signal model would have produced. You validate the model before it runs on live capital.' },
  { q: 'Is this suitable for a registered investment advisor?', a: 'Yes. The engine is designed for SEC-registered advisors. Every trade decision is human-authorised and audit-logged. The engine does not provide investment advice; it generates signals as decision inputs for the PM. The PM retains full discretion and accountability — which is what Form ADV and GIPS compliance require.' },
  { q: 'What happens if the market moves against a signal?', a: 'Stop-loss levels are built into every signal output. If a position moves against the entry by the configured stop, the monitor triggers an alert and queues an exit order for human approval. The engine surfaces the decision — it does not override your stop-loss policy.' },
];

export const INV_RESEARCH_NUDGE = {
  title: 'See a backtest on your actual holdings',
  body: 'We connect to your portfolio, run the signal model against 10 years of historical data, and show you the Sharpe ratio and win rate — before you go live. No commitment required.',
  cta: 'Book a Free Demo',
};

export const INV_RESEARCH_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  ingest:    { x: 0,   y: 0   },
  research:  { x: 315, y: 0   },
  signal:    { x: 630, y: 0   },
  execute:   { x: 630, y: 210 },
  monitor:   { x: 315, y: 210 },
  rebalance: { x: 0,   y: 210 },
};

export const INV_RESEARCH_FLOW_EDGES = [
  { id: 'e-ing-res', source: 'ingest',    target: 'research',  sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-res-sig', source: 'research',  target: 'signal',    sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-sig-exe', source: 'signal',    target: 'execute',   sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-exe-mon', source: 'execute',   target: 'monitor',   sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-mon-reb', source: 'monitor',   target: 'rebalance', sourceHandle: 'left',   targetHandle: 'right' },
];

// ============================================================================
// DOCUMENT INTELLIGENCE ENGINE
// Cross-vertical (2026-07-15): reads TONS of documents across legal, finance,
// compliance & tax via AI+OCR, indexes them into a private "safe RAG" layer,
// and answers plain-language questions with page-level citations. The reserve
// study is kept as ONE proof point, not the whole story.
// ============================================================================

export const DOC_INTEL_ENGINE: EngineDef = {
  id: 'document-intelligence',
  slug: 'document-intelligence-engine',
  name: 'Document Intelligence Engine',
  kicker: 'Any document → a cited answer',
  status: 'live',
  icon: 'layers',
  promise:
    'Reads every document your business runs on — leases, loan files, tax returns, audit and compliance files — across legal, finance, compliance and tax, then lets anyone ask a plain-language question and get an answer cited to the exact page, grounded only in your own documents. Nothing is sent to public AI.',
  nodes: [
    {
      id: 'upload', tag: 'Collect', label: 'Document Intake', icon: 'inbox',
      tools: ['PDF & scans', 'Phone photos', 'Handwritten', 'Email', 'Google Drive', 'SharePoint', 'Box'],
      stat: '12,480 docs',
      caption: 'Pulling every document type from every system — deduplicated.',
      activity: '12,480 documents · leases, loan files, tax returns, audit & KYC files · 3 sources',
      detail: 'Every document your business runs on is pulled in — clean PDFs, faxed and scanned pages, phone photos, handwritten forms, email attachments — from Google Drive, SharePoint, Box, or direct upload. Duplicates are detected, and every file gets a timestamped intake record before anything is read. There is no “supported formats” list to fight: if a person can read it, the engine takes it in.',
      gives: 'One deduplicated set of every document — no matter how messy, or how many systems they were scattered across.',
    },
    {
      id: 'ocr', tag: 'Read', label: 'AI + OCR Reading', icon: 'search',
      tools: ['OCR', 'Vision models', 'Handwriting model', 'Confidence scoring'],
      stat: 'flagged, not guessed',
      caption: 'Reading text off even a faxed, stamped scan — line by line.',
      activity: 'Suite 400 lease read · renewal clause §12.3 captured · 1 handwritten line flagged at 58%',
      detail: 'OCR and AI vision read text, tables, and stamped or handwritten content off documents that legacy OCR tools choke on — a faxed lease, a photographed form, a decades-old scan. Every value carries a confidence score, and the one line it cannot read confidently is flagged for a person rather than silently guessed. In a compliance or legal file, that difference — flag versus guess — is the whole game.',
      gives: 'Clean, structured content from even the worst source files — with the one uncertain line flagged, never invented.',
    },
    {
      id: 'classify', tag: 'Sort', label: 'Classify across departments', icon: 'layers',
      tools: ['Document classifier', 'Legal', 'Finance', 'Compliance', 'Tax'],
      stat: '38 types recognised',
      caption: 'Sorting the whole pile across legal, finance, compliance and tax.',
      activity: 'Legal 3,120 · Finance 3,610 · Compliance 1,880 · Tax 3,870',
      detail: 'Each document is recognised for what it is — a commercial lease, a term loan agreement, a Form 1120, a SOC 2 report, a KYC file — and routed to the right department and schema. One engine covers legal, finance, compliance and tax rather than four siloed tools, which is why a single archive becomes searchable across every team at once.',
      gives: 'Every document filed under the right department — so one question can span legal, finance, compliance and tax together.',
    },
    {
      id: 'calculate', tag: 'Index', label: 'Private, cited knowledge base', icon: 'shield',
      tools: ['Secure RAG index', 'Your tenant only', 'Source-page citations', 'No public models'],
      stat: 'grounded + private',
      caption: 'Building a private index grounded only in your own documents.',
      activity: 'Indexed inside your tenant · every passage linked to its source page · nothing sent to public AI',
      detail: 'The content is indexed into a retrieval layer that lives inside your own environment. “Safe RAG” means exactly this: RAG is when the AI answers only from a specific set of documents instead of the open internet, and “safe” means those documents are yours, they never leave your boundary, and every passage stays linked to its exact source page. So the model cannot make things up, an auditor can trace any answer, and nothing is sent to a public AI service.',
      gives: 'A knowledge base private to you, grounded in your own documents, that can cite every source it uses.',
    },
    {
      id: 'qa', tag: 'Ask', label: 'Ask in plain words → cited answer', icon: 'spark',
      tools: ['Plain-language questions', 'Claude reasoning', 'Cross-document', 'Source-page citations'],
      stat: 'answer in seconds',
      caption: 'Anyone asks a plain question; the answer comes back cited.',
      activity: 'Q: which leases auto-renew before Dec 31? → 3 leases · earliest notice Oct 2 · cited p.7 §12.3',
      detail: 'This is the payoff. Anyone on the team asks a question the way they would ask a colleague — “which commercial leases auto-renew before December?”, “any KYC files missing a 2024 refresh?”, “which entities filed a 1120 for 2024?” — and gets an answer in seconds, with every claim pinned to the exact document and page. Where a domain model applies, the same layer runs the calculation — a reserve study’s 30-year projection, a loan-covenant total — with every figure traced back to a source document.',
      gives: 'Answers to plain-language questions across your whole archive — every one cited to the source page, ready to defend in an audit.',
    },
    {
      id: 'report', tag: 'Review', label: 'Human review & deliver', icon: 'doc',
      tools: ['Reviewer sign-off', 'Flagged items', 'Your report template', 'Full audit trail'],
      stat: 'nothing files itself',
      caption: 'A named reviewer confirms before anything is filed or sent.',
      activity: 'Elena · Head of Compliance — confirms flagged lines and answers before anything is filed',
      detail: 'Nothing is filed, sent, or acted on automatically. Flagged lines and drafted answers go to a named person — a compliance lead, a partner, an analyst — who confirms or corrects before anything leaves the system, and every extraction, answer and calculation keeps a full audit trail back to the source document. Where you want a finished document out — a reserve study, an adjuster summary, an underwriting memo — it is produced in your own template.',
      gives: 'A human sign-off on every judgment call, a full audit trail, and finished output in your own format.',
    },
  ],
};

export const DOC_INTEL_OUTPUTS: Record<string, string[]> = {
  upload: [
    '47 documents ingested · 312 pages total',
    '18 site photos · JPG from inspection visits',
    '3 handwritten component assessment sheets',
    '2024 reserve study (prior year) — matched',
    'HOA financial statements — 3 years',
    'No duplicates detected · intake complete',
  ],
  ocr: [
    'PDF text layer: extracted (clean)',
    'Photo OCR: HVAC nameplate data extracted',
    'Handwriting: inspector notes — 94% confidence',
    '⚠ Page 34, field 4: confidence 61% — flagged',
    '21 component categories · 847 data points',
    'Low-confidence reads: 12 of 847 (1.4%)',
  ],
  classify: [
    'HVAC systems: 23 units · avg age: 8.2 yrs',
    'Roofing: 180,000 sq ft · installed 2018',
    'Pool equipment: 4 systems · 2 near EOL',
    'Paving: 42,000 sq ft · condition: fair',
    'Signage: 14 units · avg age: 6 yrs',
    '18 categories structured · schema complete',
  ],
  calculate: [
    '30-year projection: funding required $2.1M',
    'Current reserve fund: $1.28M (61% funded)',
    'Annual contribution required: $124,000',
    'HVAC replacement: Year 4 · $380,000',
    'Roofing replacement: Year 7 · $540,000',
    'Fully funded threshold: Year 14',
  ],
  qa: [
    '✓ 845 of 847 data points validated',
    '⚠ HVAC Unit 14: reported life 12 yrs vs expected 8',
    '⚠ Pool pump 3: cost $14,200 vs RS Means $8,800',
    '→ 2 items queued for reviewer decision',
    '✓ Prior-year comparison: within ±4% variance',
    '✓ Financial model: balanced and reproducible',
  ],
  report: [
    '→ Reserve Study report: 89 pages generated',
    '→ 30-year funding plan: formatted',
    '→ Component inventory: 18 categories · 108 items',
    '→ Excel model: attached · auditable formulas',
    '→ Certification page: ready for PE stamp',
    'Total: 4 hours vs 14 days manual',
  ],
};

export const DOC_INTEL_WHATIS: string[] = [
  'The Document Intelligence Engine reads every document your business runs on — leases, loan files, tax returns, audit reports, claims, contracts — across legal, finance, compliance and tax, and turns them into a private knowledge base you can simply ask. Anyone types a plain-language question and gets an answer in seconds, with every claim cited to the exact source page. It is not a generic OCR tool, and it is not public AI pointed at your files; it is a grounded, cited, private layer over your own documents.',
  '“Safe RAG” is the heart of it. RAG means the AI answers only from a specific set of documents rather than from the open internet; “safe” means those documents are yours, they stay inside your environment, and every answer links back to the page it came from. So the engine cannot make things up, an auditor can trace any answer to its source, and nothing is sent to a public AI service — the three things a compliance, legal or finance team needs before it will trust an AI answer at all.',
  'The reserve study is one proof point. A property firm’s process that took two engineers two weeks — reading handwritten inspection sheets, keying data, running a 30-year model, formatting an 89-page report — now runs in hours, with the one illegible line flagged rather than guessed. The same pipeline reads a lease as easily as a loan file or a tax return, which is why one engine serves legal, finance, compliance and tax instead of four separate tools.',
];

export const DOC_INTEL_HOWITWORKS_INTRO =
  'Six specialised steps take a document from wherever it lives to an answer you can cite. Each model is purpose-built — the handwriting reader is not the classifier; the private retrieval index is not the answer model. Here is exactly what happens at each step, and what a person still controls.';

export const DOC_INTEL_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Most businesses already have every answer they need — it is just trapped in documents. Contracts, filings, claims, returns and reports pile up across departments, and finding one fact means a person opening files one at a time. The bottleneck is not judgment; it is the hours of reading and searching before judgment can begin.',
  pains: [
    'A compliance or legal team hunts through hundreds of contracts by hand to answer one question — which agreements auto-renew, which are missing a clause.',
    'Finance and underwriting teams re-key data from appraisals, tax returns and bank statements — hours per file before any analysis starts.',
    'Anything handwritten, faxed, or badly scanned falls outside what legacy OCR tools read reliably, so it stays manual.',
    'Documents are scattered across Drive, SharePoint, Box and email, with no single place to ask a question across all of them.',
    'Generic AI tools can answer, but they make things up, cannot cite a source, and send your confidential files to a public model — a non-starter in a regulated workflow.',
  ],
  closing:
    'The engine does not replace professional judgment. It reads and indexes everything first, so a plain-language question returns a cited answer in seconds — and a person still signs off before anything is filed.',
};

export const DOC_INTEL_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most document sets are live and answerable in 2–4 weeks.',
  phases: [
    { phase: 'Connect your documents', time: 'Week 1', detail: 'Point the engine at where your documents already live — Google Drive, SharePoint, Box, email, or direct upload. It ingests and deduplicates across all of them; nothing has to be moved or re-filed.' },
    { phase: 'Tune reading & classification', time: 'Week 1–2', detail: 'Run the reader on 20–50 real documents from your workflow — including your worst scans and handwriting — and validate accuracy against your own ground truth, department by department.' },
    { phase: 'Build the private, cited index', time: 'Week 2–3', detail: 'Stand up the retrieval index inside your own environment, so every answer is grounded in your documents and linked to its source page, with nothing sent to public AI. Where a domain model applies, we wire it in — even if it lives in a spreadsheet today.' },
    { phase: 'Set questions, reviewers & go-live', time: 'Week 3–4', detail: 'Confirm the everyday questions each team will ask, who reviews flagged items before anything is filed, and any output templates you need. Run live documents end-to-end, sign off, and go live.' },
  ],
  prerequisites: [
    'A representative sample of 20–50 documents — including your messiest scans and handwriting.',
    'Read access to where documents live today — Google Drive, SharePoint, Box, or email.',
    'The everyday questions each team needs answered, and who signs off on the answers.',
    'Any output template or domain model you already use — even if it lives in a spreadsheet today.',
  ],
  note: 'Your documents never leave your environment. We validate accuracy on your actual files before go-live, and the retrieval index runs inside a tenant you control — which is what compliance and client-confidentiality agreements require.',
};

export const DOC_INTEL_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: 'Seconds', label: 'from a plain-language question to a cited answer' },
    { value: '12,480', label: 'documents read & indexed across four departments' },
    { value: 'Zero', label: 'files sent to public AI — grounded in yours, every answer cited' },
    { value: '14d → 4h', label: 'one reserve study, intake to finished report' },
  ],
  narrative:
    'The cost is not the software — it is the hours your team spends reading and searching, and the risk of a missed clause or a filing that slips a deadline. When any question against your whole archive returns a cited answer in seconds, a compliance review that took days becomes an afternoon, and an auditor’s request is answered on the call. The reserve-study example — two engineers and two weeks compressed into hours — is the same pattern applied to one vertical: read everything once, then ask it anything, with a person signing off on the judgment calls.',
};

/** PLACEHOLDER — replace with real attributable quotes before production. */
export const DOC_INTEL_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'My team used to open contracts one by one to answer a single question. Now we just ask it — “which leases auto-renew before December” — and get the answer with the clause and page number attached. Because it only reads our own documents and cites every line, our auditors accept it.', name: 'Nadia R.', role: 'Head of Compliance', company: 'Financial services firm' },
  { quote: 'Reserve studies were our proof it works. A job that took two engineers two weeks — reading handwritten sheets, keying data, running the model — now comes back the same day, and the one line it can’t read it flags instead of guessing. We’ve since pointed the same engine at our leases and vendor contracts.', name: 'Robert C.', role: 'Principal Engineer', company: 'Property consultancy' },
];

export const DOC_INTEL_FAQS: { q: string; a: string }[] = [
  { q: 'What kinds of documents can it read?', a: 'Any document your business runs on — commercial leases, loan agreements, tax returns, audit and KYC files, insurance claims, vendor contracts, and more — in almost any format: clean PDFs, faxed and scanned pages, phone photos, handwritten forms, and email attachments. One engine covers legal, finance, compliance and tax rather than four separate tools.' },
  { q: 'What does “ask your documents” actually mean?', a: 'Instead of opening files one by one, anyone on your team types a plain-language question — “which leases auto-renew before December?”, “any KYC files missing a 2024 refresh?” — and gets an answer in seconds, with every claim pinned to the exact document and page. It works across your whole archive at once, spanning legal, finance, compliance and tax.' },
  { q: 'How do I know the answers are trustworthy and not made up?', a: 'This is what “safe RAG” gives you. The engine answers only from your own documents — never the open internet — and every answer links back to the exact source page, so anyone can verify it and an auditor can trace it. Where it is not confident, it flags the item for a person rather than guessing. It is the opposite of a generic chatbot that sounds confident and cites nothing.' },
  { q: 'Where does our document data go? Is anything sent to public AI?', a: 'Nothing is sent to a public AI service. Your documents are processed and indexed inside your own environment or a dedicated tenant you control, never on shared infrastructure. The retrieval layer that answers questions runs inside your data boundary — which is what compliance and client-confidentiality agreements require.' },
  { q: 'Can it handle handwriting and bad scans?', a: 'Yes. A handwriting-specific model reads printed handwriting, mixed handwriting and print, and partially filled forms, while OCR and vision models handle faxed, stamped and low-quality scans that legacy tools choke on. Every value is confidence-scored; anything it cannot read confidently is flagged for a person rather than silently accepted — typically 90–96% field accuracy on legible forms before that review.' },
  { q: 'Is this only for reserve studies?', a: 'No — the reserve study is one proven example. The same pipeline — read anything, sort by department, index privately, answer with citations, human sign-off — applies to any document-heavy workflow across legal, finance, compliance and tax. If your work involves finding facts in unstructured documents, the engine applies.' },
];

export const DOC_INTEL_NUDGE = {
  title: 'See it answer your own documents',
  body: 'Send us 10–20 representative documents from your workflow. We read and index them, then let you ask questions live and show you every answer cited to its source page — before you commit to anything.',
  cta: 'Book a Free Demo',
};

export const DOC_INTEL_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  upload:    { x: 0,   y: 0   },
  ocr:       { x: 315, y: 0   },
  classify:  { x: 630, y: 0   },
  calculate: { x: 630, y: 210 },
  qa:        { x: 315, y: 210 },
  report:    { x: 0,   y: 210 },
};

export const DOC_INTEL_FLOW_EDGES = [
  { id: 'e-upl-ocr', source: 'upload',    target: 'ocr',       sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-ocr-cla', source: 'ocr',       target: 'classify',  sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-cla-cal', source: 'classify',  target: 'calculate', sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-cal-qa',  source: 'calculate', target: 'qa',        sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-qa-rep',  source: 'qa',        target: 'report',    sourceHandle: 'left',   targetHandle: 'right' },
];

// ============================================================================
// LEGAL & REGULATORY ENGINE
// First-hand: SEBI/RBI/IRS/SEC monitoring, impact analysis on active matters,
// precedent relearning via RAG, billing hour tracking, vector DB indexing.
// ============================================================================

export const LEGAL_REG_ENGINE: EngineDef = {
  id: 'legal-regulatory',
  slug: 'legal-regulatory-engine',
  name: 'Legal & Regulatory Engine',
  kicker: 'Alerts, billing, knowledge & diligence',
  status: 'live',
  icon: 'shield',
  promise:
    'Closes the four operational gaps in a modern firm: regulatory changes matched to live matters in minutes, AI-tool time captured into billing automatically, closed-matter precedents fed back into your knowledge base, and diligence reports drafted from completed document review.',
  nodes: [
    {
      id: 'monitor', tag: 'Monitor', label: 'Regulatory Monitor', icon: 'database',
      tools: ['SEC EDGAR', 'SEBI', 'RBI', 'IRS', 'FINRA', 'Federal Register', 'Custom feeds'],
      stat: '14 sources monitored',
      caption: 'Monitoring 14 regulatory feeds — new rules and amendments flagged instantly.',
      activity: 'SEC Release 33-11138 detected · Rule 10b5-1 amendment · effective Feb 2026',
      detail: 'The engine monitors regulatory publication feeds — SEC EDGAR, SEBI, RBI, IRS, FINRA, Federal Register, and custom jurisdictional feeds — in near real-time. When a new release, amendment, guidance letter, or enforcement action is published, it is ingested, parsed, and classified by type, jurisdiction, and effective date. No paralegal needs to check a bookmarked webpage.',
      gives: 'Zero-lag regulatory awareness — your firm knows about a rule change the moment it is published.',
    },
    {
      id: 'impact', tag: 'Analyse', label: 'Impact Analysis', icon: 'spark',
      tools: ['Matter matching', 'Portfolio cross-reference', 'Client exposure map', 'Partner ranking'],
      stat: '7 matters affected',
      caption: 'Cross-referencing the rule change against active matters and client portfolios.',
      activity: '7 active matters affected · 3 exec trading plans flagged · 2 portfolios at risk',
      detail: 'Every new regulatory change is cross-referenced against your active matter list, client portfolio positions, and internal policy documents. The impact analysis identifies which clients are exposed, which matters are affected, and the nature of the exposure — in plain English, not legalese. Partners are ranked by how many of their active matters are affected and notified in order of priority.',
      gives: 'An impact map — which clients are exposed, which partners are affected, and the severity — before anyone has read the full document.',
    },
    {
      id: 'precedent', tag: 'Research', label: 'Precedent Search', icon: 'search',
      tools: ['RAG / Vector DB', 'Internal matter history', 'Case law feeds', 'Enforcement actions'],
      stat: '12 precedents matched',
      caption: 'Searching the indexed precedent database for relevant guidance and prior rulings.',
      activity: '12 precedents matched · 4 SEC enforcement actions · internal 2023 memo surfaced',
      detail: 'A RAG agent searches the firm\'s vector database of indexed precedents — past rulings, internal guidance memos, court judgments, and regulatory enforcement actions — to surface what the firm already knows about this type of issue. The search is semantic, not keyword-based: it finds structurally similar precedents even when the terminology differs. New judgments are indexed automatically, so the knowledge base compounds with every event.',
      gives: 'The firm\'s institutional knowledge on this issue — surfaced in seconds rather than requested from a senior partner.',
    },
    {
      id: 'draft', tag: 'Draft', label: 'Guidance Memo', icon: 'pen',
      tools: ['Claude', 'Internal style guide', 'Partner review queue', 'Client alert templates'],
      stat: 'Memo ready in 4 min',
      caption: 'Drafting a partner-ready memo with affected matters and numbered action items.',
      activity: 'Partner memo drafted · 3 action items · 2 client alert emails queued for approval',
      detail: 'The engine drafts a structured guidance memo: the regulatory change in plain English, the impact on each affected matter, relevant precedents, and a numbered action item list for the responsible partner. The memo follows the firm\'s internal style guide and is formatted for partner review — a decision-ready document, not a summary dump. Client alert drafts are queued for partner approval before sending.',
      gives: 'A partner-ready memo and draft client alerts — written in 4 minutes, ready for review rather than from a blank page.',
    },
    {
      id: 'update', tag: 'Log', label: 'Matter Update & Billing', icon: 'shield',
      tools: ['Clio', 'iManage', 'Elite 3E', 'NetDocuments', 'Billable time logger'],
      stat: '1.2 hrs auto-logged',
      caption: 'Updating active matters and logging billable research time automatically.',
      activity: 'Matter #4472 updated · 1.2 hrs logged · partners notified · dockets updated',
      detail: 'Every regulatory event that affects an active matter generates an automatic update in your practice management system — Clio, iManage, Elite 3E, or NetDocuments. Billable research time is logged against the matter: the engine\'s monitoring, analysis, and drafting time is captured and attributed. Partners are notified via their preferred channel. Client dockets are updated with the regulatory event and the firm\'s response.',
      gives: 'No unbilled regulatory monitoring time, no missed matter updates, no manual time entry.',
    },
    {
      id: 'index', tag: 'Learn', label: 'Index & Learn', icon: 'book',
      tools: ['Vector DB', 'Embedding model', 'Judgment feed', 'Precedent classifier'],
      stat: '4,218 docs indexed',
      caption: 'Embedding the new ruling into the precedent database for future searches.',
      activity: 'SEC Release 33-11138 indexed · 847-token embedding · 4,218 total docs in DB',
      detail: 'Every new regulatory document, enforcement action, court judgment, and internal memo is embedded and indexed into the firm\'s vector database. The next precedent search will surface it. Over time, the firm\'s institutional knowledge compounds: the more the engine runs, the better the precedent search becomes. New hires inherit the full knowledge base immediately — and it does not walk out the door when a partner leaves.',
      gives: 'A knowledge base that gets better with every regulatory event and never loses institutional memory.',
    },
  ],
};

export const LEGAL_REG_OUTPUTS: Record<string, string[]> = {
  monitor: [
    'SEC Release No. 33-11138 detected',
    'Rule 10b5-1 — trading plan amendments',
    'Effective date: Feb 27, 2026',
    'Jurisdiction: US federal · SEC enforcement',
    'Classification: Securities law · insider trading',
    '→ Impact analysis triggered',
  ],
  impact: [
    '7 active matters affected',
    'Matter #4472 — exec trading plan · Partner Shah',
    'Matter #4509 — Rule 10b5-1 setup · Partner Lee',
    '3 client portfolios with exec compensation',
    '2 pending trading plan filings — on hold',
    '→ Precedent search triggered for 7 matters',
  ],
  precedent: [
    '12 precedents matched · relevance score 0.87+',
    'SEC v. Salman (2016) — tipper-tippee liability',
    'Internal memo: 10b5-1 guidance (2022) — surfaced',
    '4 SEC enforcement actions: 2019–2024',
    'Prior matter #3841: same client, same issue — 2023',
    '→ Guidance memo draft triggered',
  ],
  draft: [
    '→ Partner memo drafted · 4 min 12 sec',
    'Affected matters: 7 listed with action items',
    'Recommended actions: suspend, review, notify',
    '→ Client alert drafts: 2 emails queued',
    '→ Partner Shah: review requested via Slack',
    '→ Partner Lee: review requested via email',
  ],
  update: [
    '→ Matter #4472: regulatory event logged',
    '→ Matter #4509: status → "under review"',
    '→ Billable time: 1.2 hrs logged (auto)',
    '→ Client dockets: updated for both matters',
    '→ Partner Shah: notified · deadline: 5 days',
    '→ Compliance calendar: event recorded',
  ],
  index: [
    '→ SEC Release 33-11138 embedded · 847 tokens',
    '→ Classification: securities law · Rule 10b5-1',
    '→ Linked to: 7 affected matters',
    '→ Linked to: 12 matched precedents',
    '→ Available for search: immediate',
    '→ Knowledge base: 4,218 documents total',
  ],
};

export const LEGAL_REG_WHATIS: string[] = [
  'We don\'t sell AI tools. The serious firms have already shipped them — an internal AI assistant, a RAG system over the document store, an enterprise cloud DMS. The expensive problem now is operational: that AI isn\'t connected to the daily workflows where legal work actually happens. Alerts go out days late, AI-assisted time goes unbilled, hard-won precedents get buried in folders, and reports are still written by hand.',
  'The Legal & Regulatory Engine is the connection layer. It is four workflows that make your existing stack work end-to-end: regulatory changes matched to live matters and turned into draft client alerts in minutes; AI-tool usage captured into the billing system automatically; closed-matter precedents extracted and fed back into the firm\'s knowledge base; and completed document reviews turned into client-ready diligence report drafts.',
  'We presented this four-gap analysis to the digital leadership of one of India\'s largest full-service law firms. Their response: every gap is real. No two firms run the same practice mix or the same stack — which is why each workflow is built on the DMS, review platform and billing system you already run, not on a platform you have to migrate to. The engine does not practice law; judgment stays with partners. It handles the monitoring, capture, extraction and drafting around that judgment.',
];

/** The Four Operational Intelligence Gaps — the framework from our law-firm
 *  proposal work (validated by the digital leadership of a top-tier Indian firm).
 *  Before/after workflows are firm-agnostic; numbers are industry benchmarks. */
export interface LegalGapDef {
  id: string;
  name: string;
  workflow: string; // the workflow that closes it
  gap: string;      // the problem, in plain English
  before: string[]; // manual workflow today
  after: string[];  // orchestrated workflow
  outcome: string;  // the punchline stat
}

export const LEGAL_REG_GAPS_INTRO =
  'Map any modern firm\'s AI program against its daily workflows and the same four gaps appear — we validated this framework with the digital leadership of one of India\'s largest law firms. Each gap below shows the workflow as it runs manually today, and as it runs once the engine connects your existing systems.';

export const LEGAL_REG_GAPS: LegalGapDef[] = [
  {
    id: 'regulatory',
    name: 'The Regulatory Intelligence Gap',
    workflow: 'Regulatory Alert Engine',
    gap: 'When SEBI, RBI, the MCA or the SEC releases a new circular, lawyers read it manually and work out which of hundreds of active client matters are affected. Clients often hear about regulatory changes from the news before their lawyer alerts them.',
    before: [
      'Regulator releases a circular',
      'A lawyer reads it manually',
      'Emails the practice head',
      'Practice head works out which clients are affected',
      'Partners pinged on WhatsApp',
      'Client alert drafted',
      'Sent 3–4 days later',
    ],
    after: [
      'Regulator releases a circular',
      'AI classifies it by topic — FPI, NBFC, M&A, securities',
      'Cross-referenced with active matters tagged in your DMS',
      'Draft client alert auto-generated',
      'In the responsible lawyer\'s review queue in 15 minutes',
    ],
    outcome: 'Time to client alert: 3–4 days → 15 minutes. Zero clients hearing about a change from the news first.',
  },
  {
    id: 'billing',
    name: 'The AI Usage Billing Gap',
    workflow: 'AI Billing Capture',
    gap: 'Lawyers use the firm\'s AI tools daily, but that time never reaches the billing system — even Harvey only announced billing integration in late 2025, and it isn\'t built yet. Industry studies put revenue lost to manual billing failures at 26%. The more your lawyers use AI, the more revenue silently leaks.',
    before: [
      'Lawyer uses the AI assistant for 90 minutes on a matter',
      'Finishes, moves to the next task',
      'Forgets to log the time',
      'Estimates 45 minutes at the end of the day, "to be safe"',
      '45 minutes of revenue lost',
    ],
    after: [
      'Lawyer opens the AI tool on a matter',
      'A background timer starts',
      'On close, a draft time entry is created: "AI-assisted analysis, 92 minutes, Matter #5821"',
      'Lawyer approves in one click',
      'Every prompt and output logged to the matter file',
    ],
    outcome: 'Closes the 26% billing-leakage loop automatically — and creates the AI audit trail your governance committee wants anyway.',
  },
  {
    id: 'knowledge',
    name: 'The Knowledge Activation Gap',
    workflow: 'Knowledge Activation Loop',
    gap: 'Your RAG system retrieves old knowledge brilliantly. But when a landmark deal closes today with a hard-won precedent clause, it doesn\'t flow back in. Six months later, another team re-invents the same clause from scratch.',
    before: [
      'A major infrastructure deal closes',
      'The team spent 3 months negotiating a force majeure clause',
      'Excellent precedent',
      'Filed in a DMS folder',
      'Not tagged, not extracted',
      '6 months later, another team handles a similar deal',
      'Spends a week re-inventing the same clause',
    ],
    after: [
      'Deal closes — partner marks the file "final" in the DMS',
      'Pipeline extracts the key negotiated clauses',
      'Summary generated and tagged by practice area and sector',
      'Pushed into your knowledge system\'s index',
      'The next team on a similar deal gets it surfaced automatically',
    ],
    outcome: 'Your knowledge base stops being an archive and starts learning from every closed matter. Research time on repeat matters drops an estimated 20–30%.',
  },
  {
    id: 'diligence',
    name: 'The Diligence-to-Report Gap',
    workflow: 'Diligence-to-Report Automation',
    gap: 'After a major M&A or litigation document review is complete — often 5,000–10,000 documents in a tool like Relativity — someone still writes the client diligence report by hand. That is 16–24 hours of senior associate time per deal.',
    before: [
      '8,000 documents reviewed in Relativity over 3 weeks',
      'Review marked complete',
      'Senior associate exports findings to a spreadsheet',
      'Manually reads hundreds of "Red Flag" tags',
      'Writes a 40-page diligence report section by section',
      'Takes 16–24 hours',
      'Client gets the report 3 days later',
    ],
    after: [
      'Relativity marks the review complete',
      'Pipeline exports all tagged documents by category',
      'AI synthesises the material-risk documents by category',
      'Structured Word draft generated — executive summary, risk breakdown, citations',
      'Senior associate reviews and refines in 4–6 hours',
      'Client gets the report the same day',
    ],
    outcome: 'Report writing: 20 hours → 5 hours. Deal velocity becomes a competitive edge — and the approved report is stored as precedent for the next deal in that sector.',
  },
];

export const LEGAL_REG_HOWITWORKS_INTRO =
  'The canvas above shows the flagship of the four workflows — the Regulatory Alert Engine — running end-to-end, including the automatic billing log and knowledge indexing steps. Six agents run in sequence for every regulatory event: the monitor runs continuously, the remaining five trigger when a relevant event is detected. The other three workflows — billing capture, knowledge activation, diligence-to-report — reuse the same architecture on different triggers: an AI-tool session, a matter marked final, a review marked complete.';

export const LEGAL_REG_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Firms at the top of the market have already solved the hard problem — they bought or built the AI. Internal assistants, RAG over the document store, enterprise cloud DMS. What remains is operational: none of it is wired into the workflows where the work actually happens.',
  pains: [
    'When a regulator publishes a circular, lawyers still read it manually and work out which of 500+ active matters are affected — clients sometimes hear about the change from the news first.',
    'Lawyers use AI tools daily, but that time never reaches the billing system. Industry studies put revenue lost to manual billing failures at 26%.',
    'A hard-won clause from a deal that closed today never flows back into the knowledge system — six months later, another team re-invents it from scratch.',
    'After a 5,000–10,000-document review in Relativity, a senior associate still writes the 40-page diligence report by hand — 16–24 hours per deal.',
    'Institutional knowledge walks out the door when a senior partner leaves — nothing captured, nothing searchable.',
  ],
  closing:
    'The problem isn\'t AI capability. It\'s workflow connection. The engine doesn\'t replace legal judgment — it makes the AI your firm already owns show up in the daily work, with every action logged.',
};

export const LEGAL_REG_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most firms are live in 3–4 weeks.',
  phases: [
    { phase: 'Configure regulatory feeds', time: 'Week 1', detail: 'Connect the regulatory sources relevant to your practice — SEC, SEBI, RBI, IRS, FINRA, Federal Register, or custom jurisdictional feeds. Set alert thresholds by practice area and keyword.' },
    { phase: 'Index existing knowledge', time: 'Week 1–2', detail: 'Load your existing precedents — past guidance memos, internal research, key judgments — into the vector knowledge base. Built from your actual knowledge, not a generic legal database.' },
    { phase: 'Wire to practice management', time: 'Week 2–3', detail: 'Connect to your practice management system — Clio, iManage, Elite 3E, or NetDocuments — for automatic matter updates and billing hour logging.' },
    { phase: 'Pilot and partner review', time: 'Week 3–4', detail: 'Run the engine on 5 live regulatory events with partner review of every output. Calibrate the impact matching, memo style, and alert format before full deployment.' },
  ],
  prerequisites: [
    'A defined list of regulatory sources to monitor — by jurisdiction and practice area.',
    'Access to your active matter list — for impact matching.',
    'Your existing precedents, guidance memos, and key judgments — for the vector knowledge base.',
    'Access to your practice management system — Clio, iManage, Elite 3E, or NetDocuments.',
  ],
  note: 'No legal research database subscription required. The engine monitors primary regulatory sources directly and searches your firm\'s own indexed knowledge base — not a third-party database charging per search.',
};

export const LEGAL_REG_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: '15 min', label: 'from regulatory publication to a draft client alert — down from 3–4 days' },
    { value: '26%', label: 'of potential revenue lost to billing leakage — the gap auto-capture closes' },
    { value: '20h → 5h', label: 'senior-associate time per diligence report, with same-day delivery' },
    { value: '20–30%', label: 'less research time on repeat matters once precedents flow back automatically' },
  ],
  narrative:
    'Take a 100-lawyer practice as the unit of math. Billing capture alone: at two hours of AI-assisted work per lawyer per day and a $300–400 blended rate, recovering even half of the 26% industry leakage is worth millions a year — it is usually the workflow that pays for the entire engine. Diligence reports: 20 M&A or litigation matters a year at 15 hours saved per report is 300 hours of senior-associate time recovered annually, as capacity or as billings. Regulatory alerts are the retention play: for time-sensitive changes — SEBI FPI norms, RBI lending rules, SEC rule amendments — being first to the client\'s inbox instead of third is what keeps the relationship. Exact numbers depend on matter volume, practice mix and current workflows; the discovery call maps them precisely.',
};

/** PLACEHOLDER — replace with real attributable quotes before production. */
export const LEGAL_REG_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We were monitoring SEBI, RBI, and the IRS manually — a paralegal spent three hours every morning just checking feeds. The engine does it in real time, matches to our active matters, and by the time the paralegal sits down, the memo is already drafted for review.', name: 'Aditya K.', role: 'Managing Partner', company: 'Corporate legal firm, Mumbai & New York' },
  { quote: 'The precedent search was the part I didn\'t expect to work as well as it did. We had a new SEC matter and the engine surfaced a 2019 internal memo from a prior matter — same client, same issue — that I had completely forgotten existed. That alone saved a week of research.', name: 'Sarah L.', role: 'Senior Associate', company: 'Securities litigation practice' },
];

export const LEGAL_REG_FAQS: { q: string; a: string }[] = [
  { q: 'We already have an internal AI assistant and a RAG system. Why do we need this?', a: 'That is exactly who this engine is for. The tools are the solved problem — the gaps are operational. The assistant\'s usage never reaches your billing system, the RAG index never learns from the matter that closed last week, regulatory alerts still depend on someone reading circulars, and diligence reports are still written by hand. The engine is the orchestration layer that connects the AI you already own to the workflows where revenue is made and lost. We don\'t replace your stack; we wire it together.' },
  { q: 'Can it really capture AI-tool usage into our billing system?', a: 'Yes — that is the AI Billing Capture workflow. A background timer tracks AI-tool sessions per matter and creates a draft time entry ("AI-assisted analysis, 92 minutes, Matter #5821") in your billing or practice-management system — Elite 3E, Aderant, Clio or equivalent. The lawyer approves, edits or discards it in one click; nothing is billed without human sign-off. It also logs every prompt and output to the matter file, which doubles as the AI audit trail your governance committee wants anyway.' },
  { q: 'Does it work with iManage, NetDocuments and Relativity?', a: 'Yes. The workflows trigger from the systems you already run: matter tagging and final-document events from iManage or NetDocuments, completed-review exports from Relativity, and write-back into your billing platform. No rip-and-replace — the engine\'s entire point is connecting the stack you have.' },
  { q: 'Which regulators can the engine monitor?', a: 'Any regulator that publishes via a structured feed, RSS, email list, or web publication. We have built integrations for SEC EDGAR, SEBI, RBI, IRS, FINRA, the Federal Register, ESMA, FCA, and MAS. If your practice covers a jurisdiction not on this list, we can add custom monitoring for any regulatory publication source.' },
  { q: 'Does the engine have access to our client files?', a: 'The engine accesses your matter list and the metadata associated with each matter — client name, practice area, relevant jurisdictions — for impact matching. It does not access the full content of matter files unless you explicitly connect a document management system for the precedent index. Access controls mirror your existing DMS permissions.' },
  { q: 'How does the precedent search stay current?', a: 'Every regulatory event, judgment, and internal memo processed by the engine is automatically embedded and added to the vector database. The knowledge base grows with every event — no manual maintenance, no periodic updates. A ruling processed today is searchable for the next event that comes in tomorrow.' },
  { q: 'Can the guidance memo match our firm\'s writing style?', a: 'Yes. We configure the memo template and tone from a set of 10–20 existing partner memos from your firm. The drafts come out in your house style — not a generic legal summary. Partners review and edit, but they are editing rather than writing from scratch.' },
  { q: 'Is this suitable for an in-house legal team?', a: 'Yes. In-house teams at regulated companies — financial services, pharma, energy — use the same architecture to monitor their regulatory environment, cross-reference against internal policy documents and contracts, and produce compliance updates for the General Counsel. The matter list is replaced by a policy and contract inventory.' },
];

export const LEGAL_REG_NUDGE = {
  title: 'Pick the gap that hurts most — see the workflow run',
  body: 'Regulatory alerts, billing capture, knowledge loop, or diligence reports: we show the workflow running end-to-end on a real example, mapped to the DMS and billing system your firm already runs — in 30 minutes.',
  cta: 'Book a Free Demo',
};

export const LEGAL_REG_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  monitor:  { x: 0,   y: 0   },
  impact:   { x: 315, y: 0   },
  precedent:{ x: 630, y: 0   },
  draft:    { x: 630, y: 210 },
  update:   { x: 315, y: 210 },
  index:    { x: 0,   y: 210 },
};

export const LEGAL_REG_FLOW_EDGES = [
  { id: 'e-mon-imp', source: 'monitor',   target: 'impact',    sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-imp-pre', source: 'impact',    target: 'precedent', sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-pre-dra', source: 'precedent', target: 'draft',     sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-dra-upd', source: 'draft',     target: 'update',    sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-upd-idx', source: 'update',    target: 'index',     sourceHandle: 'left',   targetHandle: 'right' },
];

// ============================================================================
// CUSTOMER SUPPORT ENGINE
// First-hand: knowledge base build, multi-agent routing (technical/debug/
// billing/feature), voice agent, HITL escalation with context handoff.
// ============================================================================

export const CS_ENGINE: EngineDef = {
  id: 'customer-support',
  slug: 'customer-support-engine',
  name: 'Customer Support Engine',
  kicker: 'Omnichannel CS · voice + text',
  status: 'live',
  icon: 'inbox',
  promise:
    'Indexes your entire knowledge base, classifies every incoming query in under a second, routes it to the right specialist agent — technical, billing, debug, or feature — and escalates to a human with full context when needed. Voice and text, all channels.',
  nodes: [
    {
      id: 'knowledge', tag: 'Foundation', label: 'Knowledge Base Build', icon: 'book',
      tools: ['Product docs', 'Past tickets', 'Help articles', 'API docs', 'Release notes'],
      stat: '12,840 articles indexed',
      caption: 'Indexing all product docs, past tickets, and knowledge base articles.',
      activity: '12,840 articles indexed · 342 resolved tickets · API docs v2.4',
      detail: 'Every piece of institutional knowledge — product documentation, past support tickets, help centre articles, API documentation, release notes, internal runbooks — is embedded into a vector knowledge base. New tickets that are resolved are automatically indexed, so the KB learns from every interaction. When a product update ships, the relevant docs are re-indexed within hours. Every specialist agent answers from current, comprehensive knowledge — not a static FAQ page from last year.',
      gives: 'A continuously updated knowledge base that every specialist agent draws from — no stale answers, no "I don\'t have that information."',
    },
    {
      id: 'classify', tag: 'Classify', label: 'Query Classification', icon: 'filter',
      tools: ['Intent classifier', 'Sentiment analysis', 'Priority scoring', 'Language detection'],
      stat: 'Classified in 0.3 sec',
      caption: 'Classifying every incoming query by type, priority, and sentiment.',
      activity: 'Billing: overage dispute · Technical: API timeout · Priority: High · Sentiment: frustrated',
      detail: 'Every incoming query — email, chat, or voice transcript — is classified by intent (technical, billing, feature request, account management), priority (SLA tier), and sentiment. Queries with multiple issues are split and routed separately. Language detection enables multilingual support. Classification happens in under a second before any human reads the ticket.',
      gives: 'Every query instantly understood and prioritised — agents always know what they are dealing with before they respond.',
    },
    {
      id: 'route', tag: 'Dispatch', label: 'Agent Routing', icon: 'layers',
      tools: ['Technical Agent', 'Billing Agent', 'Debug Agent', 'Feature Agent', 'Voice Agent'],
      stat: '4 specialist agents live',
      caption: 'Routing to the right specialist — technical, billing, debug, feature, or voice.',
      activity: 'Billing → Billing Agent · Technical → Debug Agent · live system check initiated',
      detail: 'Each classified query routes to the right specialist agent. The Technical Agent answers how-to and configuration questions from the KB. The Debug Agent checks live system status — API latency, error rates, active incident log — in real time before responding. The Billing Agent accesses account data to resolve disputes. The Feature Agent logs and acknowledges feature requests with roadmap context. Voice queries route to the Voice Agent without hold time.',
      gives: 'The right agent on the right query — in seconds, without a tiered queue that makes customers wait.',
    },
    {
      id: 'respond', tag: 'Resolve', label: 'Specialist Response', icon: 'spark',
      tools: ['KB retrieval', 'Live system data', 'Account API', 'ElevenLabs voice', 'Claude'],
      stat: '73% first-touch resolved',
      caption: 'Specialist agents resolving queries with KB knowledge and live system data.',
      activity: 'Billing: $42 credit applied · Debug: API P99 = 2.1s — incident #4821 open',
      detail: 'Each specialist agent composes a response combining KB knowledge with live data. The Billing Agent does not just explain the overage — it applies the credit and confirms the resolution. The Debug Agent does not just acknowledge the API issue — it checks the live incident log, confirms the issue is known, and gives an estimated resolution time. Responses are specific and actionable — not templated non-answers.',
      gives: 'Responses that actually resolve the issue on the first touch — with real actions taken, not links to help articles.',
    },
    {
      id: 'hitl', tag: 'Escalate', label: 'HITL Escalation', icon: 'shield',
      tools: ['Confidence threshold', 'Human queue', 'Slack alert', 'SLA timer', 'Context handoff'],
      stat: '27% escalated · full context',
      caption: 'Low-confidence responses escalated to a human agent with full context packaged.',
      activity: 'Debug Agent: confidence 0.61 → Tier 2 · SLA: 4 hrs · context packaged',
      detail: 'When any specialist agent produces a response below the confidence threshold, the query escalates to a human agent — with the full conversation context, the agent\'s draft response, the KB articles it consulted, and the live system data it checked. The human agent edits and sends, rather than starting from scratch. HITL is designed into the system for cases that need real judgment — not a failure state.',
      gives: 'Human agents who pick up escalations already briefed — not starting from "what seems to be the problem?"',
    },
    {
      id: 'learn', tag: 'Improve', label: 'Resolution & Learning', icon: 'database',
      tools: ['Resolution logger', 'KB update pipeline', 'CSAT scorer', 'Pattern detector'],
      stat: 'KB updated · CSAT 4.7/5',
      caption: 'Logging every resolution and feeding new patterns back into the knowledge base.',
      activity: 'Resolution logged · CSAT: 4.7/5 · new pattern indexed · threshold adjusted',
      detail: 'Every resolved ticket — by an agent or a human — is logged with the resolution, query type, and CSAT score. Novel queries the agent handled successfully are automatically indexed into the KB so the same question is answered faster next time. Patterns in escalations are detected and used to adjust confidence thresholds. The system improves with every ticket.',
      gives: 'A support system that gets measurably better every month — higher first-touch resolution, lower escalation rate, improving CSAT.',
    },
  ],
};

export const CS_OUTPUTS: Record<string, string[]> = {
  knowledge: [
    '12,840 articles indexed · vector search ready',
    '342 resolved tickets — patterns extracted',
    'API docs v2.4 · updated 2h ago',
    'Release notes: v3.1.2 · 14 new features indexed',
    'Internal runbooks: 48 documents',
    'KB last refresh: 2h ago · always current',
  ],
  classify: [
    'Query 1: Billing — overage charge dispute',
    'Query 2: Technical — API timeout (/v2/export)',
    'Priority: High · Tier 1 customer · $8,400 ARR',
    'Sentiment: Frustrated (negative tone)',
    'Language: English',
    'Classification: 0.31 seconds',
  ],
  route: [
    'Billing → Billing Agent',
    'Technical → Debug Agent',
    'Debug Agent: initiating live system check',
    'API status: checking /v2/export endpoint',
    'Billing Agent: pulling account data',
    'Both agents working in parallel',
  ],
  respond: [
    'Billing: 14,200 API calls above plan limit',
    '→ $42 credit applied · confirmed',
    'Debug: API /v2/export P99 = 2.1s (normal: 0.4s)',
    '→ Incident #4821 open · engineering aware',
    '→ ETA resolution: 2 hours',
    '→ Customer proactively notified of incident',
  ],
  hitl: [
    'Debug Agent: confidence 0.61',
    '→ Below threshold (0.75) — escalating',
    'Context packaged: query, draft, KB refs, system data',
    '→ Human agent: Ahmed · assigned · SLA: 4 hrs',
    'Draft response provided — edits, not rewrites',
    '→ Billing: resolved without escalation',
  ],
  learn: [
    '→ Ticket #88421 closed · resolution logged',
    'CSAT: 4.7/5 · collected via follow-up',
    'New pattern: billing + API combo → Tier 1',
    '→ KB updated: API timeout troubleshooting',
    '→ Debug Agent threshold: adjusted',
    'First-touch resolution this week: 73%',
  ],
};

export const CS_WHATIS: string[] = [
  'The Customer Support Engine is a multi-agent system that handles every incoming support query — across email, chat, and voice — by routing it to the right specialist agent, responding with live system data and KB knowledge, escalating to a human with full context when confidence is low, and learning from every resolution.',
  'It is not a single chatbot with a large FAQ. It is a coordinated team of specialist agents: a Technical Agent, a Billing Agent, a Debug Agent that checks live system status in real time, a Feature Request Agent, and a Voice Agent for phone support. Each is good at one job. HITL escalation is designed in — not a workaround.',
  'The key difference from a standard help desk chatbot: when the Debug Agent tells a customer their API is slow, it has actually checked the live incident log 30 seconds ago. When the Billing Agent applies a $42 credit, it has actually applied it. Actions, not answers.',
];

export const CS_HOWITWORKS_INTRO =
  'Six components run in sequence for every incoming query. The Knowledge Base is always live; the remaining five fire on each new ticket. Here is exactly what happens — from the moment a query arrives to the moment it is resolved and learned from.';

export const CS_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Customer support at scale has a fundamental tension: personalised, accurate support requires human judgment, but the volume of queries makes human-first response economically unsustainable.',
  pains: [
    'First-response time degrades as volume grows — customers wait hours for issues that should resolve in minutes.',
    'Tier 1 agents spend 60–70% of their time on repetitive queries — billing questions, API documentation requests, known issues — that do not require human judgment.',
    'Context is lost on every handoff — the customer re-explains the issue to each new agent they are transferred to.',
    'The knowledge base is always out of date — product updates ship faster than documentation is written.',
    'Voice support requires a human on every call — hold times grow, agents burn out, and the customer experience degrades.',
    'No learning mechanism — the same questions are answered the same slow way indefinitely.',
  ],
  closing:
    'The engine does not replace human support — it resolves what does not need a human, briefs the human on what does, and improves with every ticket.',
};

export const CS_INTEGRATION: {
  timeline: string;
  phases: { phase: string; time: string; detail: string }[];
  prerequisites: string[];
  note: string;
} = {
  timeline: 'Most teams are live in 2–3 weeks.',
  phases: [
    { phase: 'Build the knowledge base', time: 'Week 1', detail: 'Index your existing product docs, KB articles, and past ticket resolutions. The first build takes 2–3 days; ongoing indexing is automatic from that point.' },
    { phase: 'Configure specialist agents', time: 'Week 1–2', detail: 'Set up Technical, Billing, Debug, and Feature agents. Connect the Debug Agent to your live system monitoring. Connect the Billing Agent to your billing platform.' },
    { phase: 'HITL and escalation rules', time: 'Week 2', detail: 'Configure confidence thresholds, escalation routing, and human agent handoff format. Run 50 historical tickets through the system and validate resolution accuracy.' },
    { phase: 'Voice agent and go-live', time: 'Week 2–3', detail: 'Deploy the Voice Agent for phone support. Run parallel with your existing support queue for one week. Go live when CSAT from agent-handled tickets matches your human baseline.' },
  ],
  prerequisites: [
    'Existing product documentation — any format: docs site, Confluence, Notion, or PDF.',
    'Past support tickets — any volume. 200+ resolved tickets gives the KB meaningful patterns.',
    'Access to your billing platform API — for the Billing Agent to take real actions.',
    'Access to your live monitoring or status page — for the Debug Agent to check real system state.',
    'Your current support tool — Zendesk, Intercom, Freshdesk, or equivalent — for ticket integration.',
  ],
  note: 'The voice agent requires a phone number and a telephony provider — Twilio, VAPI, or ElevenLabs. If you don\'t have one, we provision it as part of the setup.',
};

export const CS_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: '73%', label: 'of queries resolved on first touch, without a human' },
    { value: '8 sec', label: 'average first-response time — across all channels' },
    { value: '3×', label: 'agent capacity increase — same team, higher volume' },
    { value: '2–3 wks', label: 'to go live across email, chat, and voice' },
  ],
  narrative:
    'For a SaaS company handling 500–2,000 support tickets per month, the math is direct: if 73% of tickets are resolved without a human agent, a team of 4 agents can handle the volume that previously required 12 — or the same 4 agents can absorb 3× growth without hiring. At a fully-loaded support agent cost of $60,000–$80,000 per year, a 3× capacity gain represents $120,000–$240,000 in deferred hiring cost annually. CSAT typically improves simultaneously — because response time drops from hours to seconds.',
};

/** PLACEHOLDER — replace with real attributable quotes before production. */
export const CS_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We were at 6-hour average first response. Three weeks after going live, we were under 2 minutes for 73% of tickets. The other 27% reached a human with full context already packaged — those agents closed faster too.', name: 'Kiran P.', role: 'Head of Customer Success', company: 'B2B SaaS, 800 tickets/month' },
  { quote: 'The voice agent was the thing I thought would fail. Our customers prefer to call. The agent handles 60% of calls to resolution without transferring. The ones it does transfer, it hands off with a full briefing — the caller doesn\'t have to repeat themselves.', name: 'Nadia R.', role: 'VP Operations', company: 'SMB-focused software company' },
];

export const CS_FAQS: { q: string; a: string }[] = [
  { q: 'Will customers know they are talking to an AI?', a: 'That is your choice to configure. We can make the agent transparent about being AI, or deploy it with a persona name. What we do not do is have the agent actively claim to be human when directly asked. On voice, agents sound conversational and natural — but the quality of disclosure is a policy decision your team makes, not ours.' },
  { q: 'What happens when the AI gets something wrong?', a: 'The confidence threshold is the primary guard. When the agent is not confident, it escalates to a human rather than sending a low-quality answer. When an agent makes an error and a human corrects it, the corrected resolution is logged and the KB is updated — so the same error is less likely next time. CSAT scores and escalation rates are monitored continuously to catch systematic failures early.' },
  { q: 'Can the Billing Agent actually take actions — apply credits, issue refunds?', a: 'Yes — within the permissions you configure. You set action limits: up to $X credit without human approval, refunds above $Y always require a human. The Billing Agent operates within those limits. Every action it takes is logged with the query context and the agent\'s reasoning.' },
  { q: 'Does the voice agent work for complex technical support?', a: 'The Voice Agent handles Tier 1 volume well — billing questions, basic how-to, known incident notifications. Complex technical debugging that requires screen sharing or log access is designed to route to a human quickly with full context. The value is eliminating the Tier 1 calls that should never have reached a human in the first place.' },
  { q: 'How long does it take to build a good knowledge base?', a: 'The initial build takes 2–3 days with your existing documentation. Quality improves rapidly as resolved tickets are indexed — with 200+ past tickets, the KB has enough coverage for the most common query types. With 1,000+ past tickets, first-touch resolution typically reaches 65–75%. The KB does not need to be complete to go live; it improves continuously with every ticket.' },
];

export const CS_NUDGE = {
  title: 'See it handle your actual support queue',
  body: 'We run a week of your historical tickets through the engine and show you what it would have resolved, what it would have escalated, and what your first-touch resolution rate would have been.',
  cta: 'Book a Free Demo',
};

export const CS_FLOW_POSITIONS: Record<string, { x: number; y: number }> = {
  knowledge: { x: 0,   y: 0   },
  classify:  { x: 315, y: 0   },
  route:     { x: 630, y: 0   },
  respond:   { x: 630, y: 210 },
  hitl:      { x: 315, y: 210 },
  learn:     { x: 0,   y: 210 },
};

export const CS_FLOW_EDGES = [
  { id: 'e-kno-cla', source: 'knowledge', target: 'classify', sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-cla-rou', source: 'classify',  target: 'route',    sourceHandle: 'right',  targetHandle: 'left'  },
  { id: 'e-rou-res', source: 'route',     target: 'respond',  sourceHandle: 'bottom', targetHandle: 'top'   },
  { id: 'e-res-hit', source: 'respond',   target: 'hitl',     sourceHandle: 'left',   targetHandle: 'right' },
  { id: 'e-hit-lea', source: 'hitl',      target: 'learn',    sourceHandle: 'left',   targetHandle: 'right' },
];
