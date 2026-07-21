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
    'Finds the right buyers, researches and qualifies each one, and drafts the outreach with a real reason attached — every day, behind proper domain setup and CRM suppression, with a human approving every send.',
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
  { q: 'How do you protect our domain and inbox placement?', a: 'This is the part most outbound programmes get wrong, so we treat it as setup, not an afterthought. We send from dedicated domains — never your primary corporate domain — with SPF, DKIM and DMARC properly aligned, mailboxes warmed gradually, and every list verified to keep bounces and spam traps out. Volume ramps only as far as placement, bounce and complaint data support, inside per-domain and per-mailbox limits, and we hold to the bulk-sender requirements Google and Yahoo enforce (authentication, easy one-click unsubscribe, and complaint rates kept under their threshold). If the data says slow down, we slow down — the domain matters more than the target.' },
  { q: 'Will it email people we are already talking to?', a: 'No — the engine checks every account against your CRM before contact and suppresses open opportunities, current customers, recently-closed-lost accounts, and anyone already sitting in another rep’s sequence. Emailing a live deal or an existing client is the fastest way to lose trust in a system like this, so suppression is wired in at the start, not bolted on.' },
  { q: 'What happens when someone replies?', a: 'Replies go to your team, in your inbox — the engine does not hold sales conversations. It routes the reply to the right rep with the research and the thread attached, and handles the mechanical cases automatically: out-of-office detection and re-queueing, unsubscribe and opt-out honoured immediately, and bounced addresses removed from the list. A human takes every real conversation from the first reply onward.' },
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
  { name: 'CPA & Tax Engine', kicker: 'Tax compliance & filing', status: 'live', icon: 'doc', promise: 'Ingests every client document, extracts the fields — including the K-1s and brokerage composites other tools leave manual — pre-fills the return in your tax software, and routes a reviewer-ready file to your CPA with every uncertain item flagged rather than guessed.', href: '/ai-engines/cpa-tax-engine' },
  { name: 'Investment Research Engine', kicker: 'Portfolio research & execution, operated', status: 'live', icon: 'chart', promise: 'Unifies your book across every custodian into one live view, runs your research and your own models on live data, and turns what the PM approves into logged orders — every trade human-authorised, every position private to you. It makes no promise about returns.', href: '/ai-engines/investment-research-engine' },
  { name: 'Document Intelligence Engine', kicker: 'Any document → a cited answer', status: 'live', icon: 'layers', promise: 'Reads every document your business runs on — leases, loan files, tax returns, audit and compliance files — across legal, finance, compliance and tax, then lets anyone ask a plain-language question and get an answer cited to the exact page, grounded only in your own documents. Nothing is sent to public AI.', href: '/ai-engines/document-intelligence-engine' },
  { name: 'Legal & Regulatory Engine', kicker: 'Alerts, billing, knowledge & diligence', status: 'live', icon: 'shield', promise: 'Closes the four operational gaps in a modern firm: regulatory changes matched to live matters the day they publish, AI-tool time captured into billing as it happens, closed-matter precedents fed back into your knowledge base, and diligence reports drafted from completed review — privileged content staying in your tenant, every citation linked to its source.', href: '/ai-engines/legal-regulatory-engine' },
  { name: 'Customer Support Engine', kicker: 'Omnichannel CS · voice + text', status: 'live', icon: 'inbox', promise: 'Answers email, chat and voice from your own knowledge base and live system data, takes real actions like applying a credit, and escalates to a human with full context when it is not confident. Answers are grounded and source-attached, it writes in your brand voice, and a customer can always reach a person.', href: '/ai-engines/customer-support-engine' },
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
    'Ingests every client document, extracts the fields — including the K-1s and non-standard brokerage composites other tools leave manual — pre-fills the return in your tax software, and routes a reviewer-ready file to your CPA with every uncertain item flagged rather than guessed.',
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
      gives: 'A review that starts on the judgement calls instead of the data entry — the repetitive work already resolved, the uncertain items already flagged.',
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
    '⚠ K-1 Box 20 §199A (Code Z) — statement attached, flagged',
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
    'Client documents arrive late — the bulk of them well after mid-February — compressing the real work into the last six weeks of the season.',
    'A complex 1040 with K-1s and brokerage composites requires 3–6 hours of data entry before any tax analysis begins.',
    'The final 48 hours before April 15 are when tired staff make the errors the signing CPA is personally liable for.',
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
    { value: 'Pre-filled', label: 'the preparer opens an organised return, not a stack of PDFs' },
    { value: 'Flagged', label: 'every low-confidence item surfaced — never silently accepted' },
    { value: 'Parallel run', label: 'validated on 20 of your live returns before you commit' },
    { value: '3–5 wks', label: 'to go live — no multi-month implementation' },
  ],
  narrative:
    'The economics are easy to reason about and easy for you to verify. At a $250–$500 blended billing rate, every hour of prep time removed is margin you either reinvest in advisory work or keep. We are deliberately not printing a percentage here: the comparable figures in this market come from other vendors’ deployments rather than ours, and your own mix of 1040s, partnership returns and brokerage composites will drive the result far more than any benchmark. So we run a parallel test on 20 of your live returns before full deployment — engine and preparer working the same files side by side — and you get your own throughput number to decide on. The signing CPA still reviews and signs every return.',
};

/** Honest proof panel — a "how we prove it" parallel run, NOT client quotes.
 *  Replace with real attributable client quotes once available. */
export const CPA_TAX_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We run a parallel test on 20 of your live returns — the engine and your preparer work the same files side by side, and you compare the output line by line before anything changes in your workflow.', name: 'Parallel run on 20 live returns', role: 'before full deployment', company: 'your returns, your comparison' },
  { quote: 'That test gives you your own throughput number — how much prep time actually came out of your mix of 1040s, K-1s and brokerage composites — instead of a percentage borrowed from another firm’s deployment.', name: 'Your throughput, measured', role: 'your mix, not a benchmark', company: 'no borrowed statistics' },
  { quote: 'Before any client data moves we walk your partners through the §7216 consent position, the US-hosted architecture, the WISP documentation and the retention policy — the review your firm has to pass anyway.', name: 'Your security review first', role: '§7216 · US-hosted · WISP', company: 'reviewed before data moves' },
];

export const CPA_TAX_FAQS: { q: string; a: string }[] = [
  { q: 'Does the engine replace the CPA reviewer?', a: 'No — and it\'s not designed to. Under the revised AICPA Statements on Standards for Tax Services (effective January 1, 2024), the signing CPA is personally responsible for the completed return, regardless of what tools prepared it. The "under penalties of perjury" statement on every filed return means this cannot be delegated to software. What the engine changes is what the reviewer looks at: an organised, pre-filled file with flagged items, instead of a blank screen and a folder of PDFs.' },
  { q: 'Which tax software does it work with?', a: 'Drake, ProConnect (Intuit), CCH Axcess (Wolters Kluwer), UltraTax CS (Thomson Reuters), Lacerte (Intuit), and GoSystem Tax RS. Integration works through each software\'s native import format — the same mechanism SurePrep 1040SCAN and GruntWorx use to populate returns today. No public API is required from any vendor.' },
  { q: 'What happens with K-1s from late-filing partnerships?', a: 'The Gap Detection agent identifies missing K-1s based on prior-year return data and sends targeted reminders to the client. When the K-1 arrives — in September after an extension — it is processed automatically and the return is updated. The preparer is notified. No manual tracking required.' },
  { q: 'Is sending client tax data to a third-party AI tool legal under IRC §7216?', a: 'Yes — with conditions. IRC §7216 and 26 CFR §301.7216-2 permit disclosure of tax return information to third-party service providers without taxpayer consent, as long as the purpose is tax return preparation. The engine is deployed on US-hosted infrastructure, which avoids the separate written-consent requirement that applies to processors located outside the United States. Chronexa provides a standard service agreement that satisfies the §7216 service-provider conditions.' },
  { q: 'We already use SurePrep 1040SCAN — what does the engine add?', a: '1040SCAN is strong for W-2s and brokerage statements from its ~700-institution coverage list. But it explicitly does not capture state K-1 data, and any brokerage not on the list gets only summary amounts — not line-item detail. Crypto CSVs, multi-state allocations, Schedule E worksheets, and non-standard documents remain largely manual. The engine handles the edge cases that represent the majority of your most expensive prep hours — the complex clients who, incidentally, also pay the highest fees.' },
  { q: 'Is our client data used to train AI models? What about retention and SOC 2?', a: 'No client data is ever used to train models — not ours, and not any provider\'s. Returns and source documents are processed inside US-hosted infrastructure dedicated to your firm, never on shared infrastructure, and are retained only for the period your engagement letter and record-retention policy specify, then deleted on that schedule. We support your firm\'s security review with the WISP documentation, the §7216 service-provider agreement, and our current security posture and audit status — ask us directly and we will tell you exactly where we stand rather than point at a badge.' },
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
  'The Sales Engine runs the top of your outbound motion — sourcing, research, qualification, writing and sending — through the stack you already pay for. It finds accounts that match your ICP, researches each one for a real reason to reach out, drafts the sequence, and holds it for your approval before anything sends. Replies come back to your team, in your inbox, where a human takes over.',
  'Be precise about the boundary, because “end to end” is usually oversold. The engine does the research-and-drafting work that eats your reps’ week, and a person approves every send. It does not close deals, it does not handle objections, and it does not pretend a bot can hold a sales conversation. Your reps get their selling time back — this is not a replacement for them.',
  'Two things we treat as non-negotiable, because they are what actually kill outbound programmes: your domain reputation and your CRM. Volume only ramps behind dedicated sending domains, aligned SPF, DKIM and DMARC, mailbox warm-up and list verification — and every account is checked against your CRM before contact, so the engine never emails an open opportunity, a current customer, or someone already sitting in another rep’s sequence.',
];

export const SALES_HOWITWORKS_INTRO =
  'Six specialised steps work in sequence, each handing structured data to the next — the way your best SDR would work an account, but at scale and without the manual lift. A person approves before anything reaches a prospect. Here is exactly what happens at each step, and what you get from it.';

export const SALES_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro: 'If you sell B2B, you already know outbound works — when it is done well. The problem is that doing it well does not scale with headcount.',
  pains: [
    'Reps spend more of the week on list-building, research and admin than on actually selling — we measure the real split from your own CRM activity during the pilot.',
    'Generic, un-researched blasts burn your domain reputation and your brand — and once inbox placement drops, it takes weeks to earn back.',
    'Pipeline is feast-or-famine — volume depends on who felt motivated to prospect this week.',
    'Nobody checks the list against the CRM, so prospecting emails land on open opportunities, current customers, and people already in another rep’s sequence.',
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
    { phase: 'Scope & success metrics', time: 'Week 1', detail: 'We map your ICP, your messaging, and the one outcome we will measure — booked meetings, not activity.' },
    { phase: 'Connect your stack & set up sending', time: 'Week 1–2', detail: 'We wire the engine to your lead sources, sending platform and CRM — and set sending up properly: dedicated sending domains, SPF, DKIM and DMARC aligned, mailbox warm-up started, and list verification in the pipeline.' },
    { phase: 'Pilot & tune', time: 'Week 2–3', detail: 'A controlled run at low volume with your approval on every send, while we tune fit and copy — watching inbox placement, bounce and spam-complaint rates before touching volume.' },
    { phase: 'Scale safely', time: 'Week 3–4', detail: 'Ramp only as far as placement and reply data support, inside per-domain and per-mailbox limits. You own the system end to end.' },
  ],
  prerequisites: [
    'A defined ICP — a clear picture of who your best customers are.',
    'Access to at least one lead source (Apollo, Clay, ZoomInfo, or a list).',
    'A sending platform and domain(s) — we set up dedicated sending domains and authentication if you do not have them.',
    'CRM access, so the engine can suppress open opportunities, current customers and active sequences.',
    'A few examples of messaging that already sounds like you.',
  ],
  note: 'No engineering team required on your side. We build, test and hand it over with documentation and support — and we will not ramp volume past what your domain reputation safely supports, whatever the target.',
};

export const SALES_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: 'Meetings', label: 'the one number we optimise — not accounts touched' },
    { value: 'Researched', label: 'every account goes out with a specific reason attached' },
    { value: 'Every send', label: 'approved by a human before it reaches a prospect' },
    { value: '2–4 wks', label: 'to live, not months' },
  ],
  narrative:
    'We will not quote you a reply rate. The honest answer is that it depends on your list, your offer and your domain history — and any vendor quoting one before seeing your data is guessing. What we commit to is the measurement: during the pilot we track booked meetings, positive reply rate and cost per meeting against whatever you are doing today, from your own CRM, and you decide from there. The mechanism is not complicated — reps stop losing their week to list-building and research, every account goes out with a specific reason attached, and volume only ramps as far as your deliverability safely allows.',
};

/** Honest proof panel — a "how we prove it" pilot, NOT customer quotes.
 *  Replace with real attributable client quotes once available. */
export const SALES_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We run the engine on your real ICP and a slice of your actual list, and you approve every send — so you see the research quality and the copy before a single prospect is contacted at volume.', name: 'Run on your own ICP', role: 'Weeks 2–3 of the pilot', company: 'you approve every send' },
  { quote: 'We measure booked meetings, positive reply rate and cost per meeting against what you are doing today, from your own CRM — not against a benchmark from somebody else’s campaign.', name: 'Measured in your CRM', role: 'your baseline, your numbers', company: 'meetings, not activity' },
  { quote: 'Before volume goes anywhere near your main domain we set up dedicated sending domains, align SPF, DKIM and DMARC, warm the mailboxes and verify the list — then watch inbox placement as we ramp.', name: 'Your domain protected first', role: 'authentication · warm-up · verification', company: 'placement watched as we ramp' },
];

export const SALES_NUDGE = {
  title: 'See it run on your ICP',
  body: 'In 30 minutes we run the engine against your real ICP and show you the accounts it finds, the research it attaches and the sequence it drafts — plus exactly how we would protect your domain. No slides.',
  cta: 'Book a Free Demo',
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
  kicker: 'Portfolio research & execution, operated',
  status: 'live',
  icon: 'chart',
  promise:
    'Unifies your book across every custodian into one live view, runs your research and your own models on live data automatically, and turns what the PM approves into logged orders — every trade human-authorised, every position private to you. It removes the hours between a signal and an action; it does not make the call, and it makes no promise about returns.',
  nodes: [
    {
      id: 'ingest', tag: 'Connect', label: 'Unify the book', icon: 'database',
      tools: ['Schwab API', 'Fidelity API', 'IBKR API', 'Addepar', 'Orion'],
      stat: 'one live view',
      caption: 'Pulling every account across every custodian into a single live view.',
      activity: 'All custodians synced · holdings, lots, cost basis and cash in one place',
      detail: 'Connects directly to your custodians and portfolio systems — Schwab, Fidelity, IBKR, and aggregators like Addepar or Orion — not consumer account-aggregation rails. It pulls holdings, lots and cost basis, and cash across every account into one live view, with no morning export and no CSV. Everything downstream runs against what you actually hold right now.',
      gives: 'A single live view of the whole book — every account, before any research begins.',
    },
    {
      id: 'research', tag: 'Research', label: 'Systematic research', icon: 'search',
      tools: ['News APIs', 'SEC EDGAR', 'Earnings transcripts', 'Analyst feeds', 'Your research notes'],
      stat: 'scanned, ranked, cited',
      caption: 'Reading news, filings and transcripts across every holding — each item linked to its source.',
      activity: 'News, 10-Qs and transcripts scanned across every holding · material items flagged with a source link',
      detail: 'A research agent reads news, earnings-call transcripts, SEC filings and analyst commentary across every holding and watchlist name, and surfaces what is material — each item linked back to the filing or transcript it came from, so the analyst reads the evidence rather than a summary they cannot check. It does the morning read; the analyst forms the view.',
      gives: 'A prioritised, cited research feed for every position — the reading done, the judgment still yours.',
    },
    {
      id: 'signal', tag: 'Models', label: 'Your models & rules', icon: 'chart',
      tools: ['Your signal models', 'Rules engine', 'Position-sizing', 'Backtest harness'],
      stat: 'candidates for review',
      caption: 'Running the models and rules your team already uses — automatically, on live data.',
      activity: 'Models run · each candidate shown with the rule that triggered it, sized to your policy',
      detail: 'The engine runs the models and rules your team already uses — a factor screen, a mean-reversion rule, or your own ML — on live data automatically, instead of only when someone remembers to refresh a spreadsheet. Each candidate is shown with the rule that triggered it and sized to your written limits (fractional Kelly, or your own sizing method). These are decision inputs the PM reviews — never instructions, and never a claim about what a security will do.',
      gives: 'Your own models, run continuously on live data — each candidate shown with its trigger and sized to your policy.',
    },
    {
      id: 'execute', tag: 'Execute', label: 'Human-approved execution', icon: 'send',
      tools: ['Broker / OMS API', 'Human approval gate', 'Audit log', 'Fill reconciliation'],
      stat: 'nothing routes without a yes',
      caption: 'Only what a named person approves is routed — every action timestamped.',
      activity: 'Draft orders queued · awaiting PM approval · every approval recorded',
      detail: 'Every candidate the PM accepts becomes a draft order — ticker, direction, size, order type. Nothing routes to the broker until a named person approves it. Once approved, it executes via your broker or OMS, and fills, partials and rejections are reconciled back to the book. Who approved what, and when, is recorded for every single order.',
      gives: 'Approved orders placed in seconds — with a complete, timestamped record of who authorised each one.',
    },
    {
      id: 'monitor', tag: 'Monitor', label: 'Risk vs your limits', icon: 'layers',
      tools: ['Live P&L', 'Exposure limits', 'Drawdown alerts', 'Concentration', 'Correlation'],
      stat: 'watched continuously',
      caption: 'Exposure, drawdown and concentration checked continuously against your policy.',
      activity: 'Beta, exposure, drawdown and concentration checked against your written limits · breaches alert immediately',
      detail: 'Portfolio-level risk — exposure, beta, drawdown, sector concentration, correlation — is watched continuously against the limits written in your investment policy, not spot-checked when someone logs in. A breach triggers an immediate alert, and the current state feeds back into the next research cycle so it always runs on live data.',
      gives: 'Continuous risk visibility against your own limits — a breach reaches you the moment it happens.',
    },
    {
      id: 'rebalance', tag: 'Rebalance', label: 'Tax-aware rebalance & report', icon: 'spark',
      tools: ['Drift detection', 'Tax-lot analysis', 'Rebalance scheduler', 'Client report'],
      stat: 'minimal turnover',
      caption: 'Drift computed against target — a minimal-turnover, tax-aware plan queued for approval.',
      activity: 'Drift vs target computed · minimal-turnover trade set and tax-lot opportunities queued for approval',
      detail: 'When allocation drifts past your threshold, the engine computes the minimum set of trades to return to target and flags tax-lot harvesting opportunities lot by lot, not as a rough estimate. The plan is presented for approval, never executed on its own, and the result is formatted into a client-ready report.',
      gives: 'A tax-aware, minimal-turnover rebalance plan and a client-ready report — without the spreadsheet.',
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
  'The Investment Research Engine is an operations layer for a research and portfolio team. It pulls your whole book across every custodian into one live view, runs your research and your own models on that live data automatically, and turns what the PM approves into logged orders — every execution human-authorised, every position private to you. It removes the hours between a signal and an action. It does not decide what to buy.',
  'Be clear on what it is not: it is not an “AI that beats the market,” and it makes no promise about returns. It surfaces candidates and organises the evidence — cited back to the filing, the transcript, or the model rule that triggered — and the portfolio manager exercises discretion on every one. The value is speed and rigour on the operational work, not a claim to alpha. The models it runs are your models; where we name techniques like gradient boosting or fractional-Kelly sizing, those are implementation details, not the pitch.',
  'That design is what makes it usable at a regulated firm. Every trade is human-authorised before it routes, and who approved what — and when — is logged for your books and records. Your holdings, signals and client data stay inside your own environment and are never sent to a public AI service or used to train anyone’s model — the control an RIA’s compliance function needs before any model touches the book.',
];

export const INV_RESEARCH_HOWITWORKS_INTRO =
  'Six steps take the desk from a scattered morning to a decision-ready view — data always from live sources, never a cached spreadsheet. Each step is specialised, and a person stays in control of every trade. Here is exactly what happens, and where the judgment stays yours.';

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
    { phase: 'Connect custodians & systems', time: 'Week 1', detail: 'Authenticate your custodians and portfolio systems — Schwab, Fidelity, IBKR, and Addepar or Orion. Map holdings and lots. Validate every position against your own records before anything runs.' },
    { phase: 'Load your models & policy', time: 'Week 1–2', detail: 'Bring in your watchlist, your signal models or rules, and your written investment policy — sector limits, position caps, drawdown tolerance. Where you want a backtest, we run your rules against your own history so you see how they would have behaved before anything is live.' },
    { phase: 'Approval gate + execution', time: 'Week 2', detail: 'Connect your broker or OMS and wire the human approval gate. Run draft orders through the approval flow before any live order is placed.' },
    { phase: 'Monitor and calibrate', time: 'Week 2–3', detail: 'Run live with daily review. Tune thresholds and limits against what you actually observe before full rollout.' },
  ],
  prerequisites: [
    'Portfolios held at your custodians (Schwab, Fidelity, IBKR, Alpaca) or aggregated in Addepar or Orion.',
    'A written investment policy — sector limits, position caps, drawdown tolerance.',
    'A designated approver for orders — PM, CIO, or compliance officer.',
    'Your models or rules, and historical data if you want them backtested — even if they live in a spreadsheet today.',
  ],
  note: 'Your holdings, signals and client data never leave your environment and are never used to train anyone’s model. The engine runs inside a tenant you control — the requirement any RIA’s compliance and client agreements impose before an AI system touches the book.',
};

export const INV_RESEARCH_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: 'One live book', label: 'every custodian in a single view — no morning export' },
    { value: 'Hours/day', label: 'returned from data pulling to research and clients' },
    { value: 'Every trade', label: 'human-approved and logged for your books and records' },
    { value: 'Your tenant', label: 'positions and signals never sent to public AI' },
  ],
  narrative:
    'The return here is operational, not a performance claim. The hours a PM and analysts lose every morning to pulling positions, stitching spreadsheets and re-running models by hand come back — redirected to research, client conversations and judgment. It also removes a class of quiet risk: a broken Excel formula in a rebalance, a limit breach noticed late, a trade decision with no clean audit trail. We do not promise returns and we never will. What we can show you, before you commit, is the engine running your own models on your own book in a read-only pilot.',
};

/** Honest proof panel — a "how we prove it" pilot, NOT customer quotes.
 *  Replace with real attributable client quotes once available. */
export const INV_RESEARCH_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We connect to a read-only copy of your book and run the engine on your real positions and your own models — you watch it work before anything is ever wired to a broker.', name: 'Run on your own book', role: 'Week 1 of the pilot', company: 'read-only · no commitment' },
  { quote: 'Where you have a signal model or rule, we backtest it against your own history and show you how it would have behaved — your numbers, not ours. We publish no performance claims of our own.', name: 'Validated on your history', role: 'your rules, your data', company: 'no alpha promised' },
  { quote: 'Every draft order, approval and limit check is logged from day one, so your compliance team sees the exact audit trail they will keep — before you commit to anything.', name: 'The audit trail you keep', role: 'human-approved & logged', company: 'built for RIA books-and-records' },
];

export const INV_RESEARCH_FAQS: { q: string; a: string }[] = [
  { q: 'Does the engine place trades automatically?', a: 'No. Every candidate the PM accepts becomes a draft order, and nothing routes to the broker until a named person approves it. The approval can be one click in a dashboard or a message in Slack — your choice — and the audit log records who approved, when, and what the order was. This is a hard design constraint, not an option.' },
  { q: 'Which custodians and systems does it connect to?', a: 'It connects directly to your custodians and portfolio systems — Schwab, Fidelity, IBKR, Alpaca, and aggregators like Addepar or Orion — for holdings, lots and cash, and executes through your broker or OMS. It is built for how a firm actually custodies assets, not consumer account-aggregation.' },
  { q: 'Does the engine promise returns or "alpha"?', a: 'No, and it never will. The engine runs your models and rules — not a black box we claim beats the market — and organises research cited to its source. Where you want a backtest, we run your rules against your own history so you see how they would have behaved; we publish no performance figures of our own. It is an operations and risk layer, not an alpha claim.' },
  { q: 'Is this suitable for a registered investment adviser?', a: 'Yes — it is built for SEC-registered advisers. Every trade is human-authorised and logged, your data stays in your own tenant, and the engine provides decision inputs, not investment advice; the adviser retains full discretion and accountability. The human-approval audit trail is designed to support your books-and-records obligations, and your compliance team reviews the setup before go-live.' },
  { q: 'Where does our portfolio data go? Is anything sent to public AI?', a: 'Nothing is sent to a public AI service. Your holdings, signals, models and client data are processed inside your own environment or a dedicated tenant you control, and are never used to train anyone’s model. For a book of business, that data boundary is the entire point.' },
  { q: 'What happens if the market moves against a position?', a: 'Stop levels come from your own policy, not ours. If a position breaches a stop you have set, the monitor alerts you and queues an exit order for approval the moment it triggers. The engine surfaces the decision — it does not override your risk rules or act on its own.' },
];

export const INV_RESEARCH_NUDGE = {
  title: 'See it run on your own book',
  body: 'We connect to a read-only copy of your portfolio, run the engine on your real positions and your own models, and show you exactly what it surfaces and how the approval trail looks — before anything ever touches a broker.',
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

/** Honest proof panel — a "how we prove it" pilot, NOT client quotes.
 *  Replace with real attributable client quotes once available. */
export const DOC_INTEL_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'Send us 10–20 of your own documents — including your worst scans and your handwriting — and we read and index them, then let you ask questions live and watch every answer cite its source page.', name: 'Run on your own documents', role: 'before you commit', company: 'your files, your questions' },
  { quote: 'You see the accuracy on your documents and, just as importantly, what it flagged rather than guessed — the uncertain lines routed to a person instead of quietly filled in.', name: 'Accuracy you can check', role: 'flagged, not guessed', company: 'measured on your data' },
  { quote: 'Everything runs inside a tenant you control: nothing goes to a public AI service, nothing trains anyone’s model, and every answer links back to the page it came from for your auditors.', name: 'Private and citable', role: 'your tenant · every answer cited', company: 'nothing to public AI' },
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
      stat: 'your feeds, watched',
      caption: 'Monitoring your regulatory feeds — new rules and amendments flagged the moment they publish.',
      activity: 'New release detected · classified by type, jurisdiction and effective date · matched to live matters',
      detail: 'The engine monitors regulatory publication feeds — SEC EDGAR, SEBI, RBI, IRS, FINRA, Federal Register, and custom jurisdictional feeds — in near real-time. When a new release, amendment, guidance letter, or enforcement action is published, it is ingested, parsed, and classified by type, jurisdiction, and effective date. No paralegal needs to check a bookmarked webpage.',
      gives: 'Zero-lag regulatory awareness — your firm knows about a rule change the moment it is published.',
    },
    {
      id: 'impact', tag: 'Analyse', label: 'Impact Analysis', icon: 'spark',
      tools: ['Matter matching', 'Portfolio cross-reference', 'Client exposure map', 'Partner ranking'],
      stat: 'matched to live matters',
      caption: 'Cross-referencing the rule change against active matters and client portfolios.',
      activity: '7 active matters affected · 3 exec trading plans flagged · 2 portfolios at risk',
      detail: 'Every new regulatory change is cross-referenced against your active matter list, client portfolio positions, and internal policy documents. The impact analysis identifies which clients are exposed, which matters are affected, and the nature of the exposure — in plain English, not legalese. Partners are ranked by how many of their active matters are affected and notified in order of priority.',
      gives: 'An impact map — which clients are exposed, which partners are affected, and the severity — before anyone has read the full document.',
    },
    {
      id: 'precedent', tag: 'Research', label: 'Precedent Search', icon: 'search',
      tools: ['RAG / Vector DB', 'Internal matter history', 'Case law feeds', 'Enforcement actions'],
      stat: 'your own precedents, surfaced',
      caption: 'Searching your indexed precedents for relevant guidance and prior rulings.',
      activity: 'Prior rulings, enforcement actions and an internal memo surfaced — each linked to the source document',
      detail: 'A retrieval agent searches the firm\'s indexed precedents — past rulings, internal guidance memos, court judgments, and regulatory enforcement actions — to surface what the firm already knows about this type of issue. The search is semantic, not keyword-based: it finds structurally similar precedents even when the terminology differs. Critically, every result is returned as a link to the actual document in your system. The engine surfaces authority you already hold; it does not generate case law, and it will not invent a citation.',
      gives: 'The firm\'s institutional knowledge on this issue — surfaced in seconds, every result traceable to the source document.',
    },
    {
      id: 'draft', tag: 'Draft', label: 'Guidance Memo', icon: 'pen',
      tools: ['Claude', 'Internal style guide', 'Partner review queue', 'Client alert templates'],
      stat: 'draft for partner review',
      caption: 'Drafting a partner-ready memo with affected matters and numbered action items.',
      activity: 'Partner memo drafted · 3 action items · client alerts queued for approval',
      detail: 'The engine drafts a structured guidance memo: the regulatory change in plain English, the impact on each affected matter, relevant precedents, and a numbered action item list for the responsible partner. The memo follows the firm\'s internal style guide and is formatted for partner review — a decision-ready document, not a summary dump. Every authority it cites is linked to the source document the engine actually retrieved; anything it cannot ground in a real document is flagged rather than written. Nothing goes to a client until a partner approves it.',
      gives: 'A partner-ready draft with every citation linked to its source — ready for review, never a blank page and never an invented authority.',
    },
    {
      id: 'update', tag: 'Log', label: 'Matter Update & Billing', icon: 'shield',
      tools: ['Clio', 'iManage', 'Elite 3E', 'NetDocuments', 'Billable time logger'],
      stat: 'time captured, not reconstructed',
      caption: 'Updating active matters and logging billable research time automatically.',
      activity: 'Matter #4472 updated · 1.2 hrs logged · partners notified · dockets updated',
      detail: 'Every regulatory event that affects an active matter generates an automatic update in your practice management system — Clio, iManage, Elite 3E, or NetDocuments. Billable research time is logged against the matter: the engine\'s monitoring, analysis, and drafting time is captured and attributed. Partners are notified via their preferred channel. Client dockets are updated with the regulatory event and the firm\'s response.',
      gives: 'No unbilled regulatory monitoring time, no missed matter updates, no manual time entry.',
    },
    {
      id: 'index', tag: 'Learn', label: 'Index & Learn', icon: 'book',
      tools: ['Vector DB', 'Embedding model', 'Judgment feed', 'Precedent classifier'],
      stat: 'indexed on ingest',
      caption: 'Embedding the new ruling into your precedent base for future searches.',
      activity: 'New release embedded and indexed · searchable in the next precedent query',
      detail: 'Every new regulatory document, enforcement action, court judgment, and internal memo is embedded and indexed into the firm\'s vector database. The next precedent search will surface it. Over time, the firm\'s institutional knowledge compounds: the more the engine runs, the better the precedent search becomes. New hires inherit the full knowledge base immediately — and it does not walk out the door when a partner leaves.',
      gives: 'A knowledge base that gets better with every regulatory event and never loses institutional memory.',
    },
  ],
};

export const LEGAL_REG_OUTPUTS: Record<string, string[]> = {
  monitor: [
    'New SEC release detected',
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
    'Salman v. United States (2016) — tipper-tippee liability',
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
    '→ New release embedded and indexed',
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
  'Two questions every partner asks first, answered plainly. Confidentiality: the engine runs inside your own environment or a dedicated tenant you control. Privileged matter content is never sent to a public AI service and is never used to train anyone\'s model, and access mirrors the permissions already set in your DMS. Accuracy: it retrieves from documents your firm already holds and links every authority it cites back to that source, so any citation can be checked in one click — and anything it cannot ground in a real document is flagged rather than written. It will not invent an authority.',
  'The four-gap framework came out of proposal work with the digital leadership of one of India\'s largest full-service firms, who confirmed every gap was real. The workflows themselves are jurisdiction-agnostic — whether your feeds are SEC, FINRA and the Federal Register or SEBI, RBI and MCA — and each is built on the DMS, review platform and billing system you already run, not a platform you have to migrate to. The engine does not practice law; judgment stays with partners. It handles the monitoring, capture, extraction and drafting around that judgment.',
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
    gap: 'Lawyers use the firm\'s AI tools daily, but that time never reaches the billing system — the major legal-AI platforms still leave the capture step to the lawyer. Time reconstructed from memory at the end of the day is systematically under-billed, and the more your lawyers use AI, the more revenue silently leaks. How much it is costing you is a question we answer from your own timekeeping data, not an industry average.',
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
    outcome: 'Closes the AI-time billing leak automatically — and creates the AI audit trail your governance committee wants anyway.',
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
    'Lawyers use AI tools daily, but that time never reaches the billing system — reconstructed at the end of the day, it is systematically under-billed.',
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
    { value: 'Same day', label: 'from regulatory publication to a draft client alert — instead of days later' },
    { value: 'Captured', label: 'AI-assisted time logged as it happens, not reconstructed at day’s end' },
    { value: 'Drafted', label: 'diligence reports and memos start from your review output, not a blank page' },
    { value: 'Compounding', label: 'every closed matter feeds the precedent base instead of a folder' },
  ],
  narrative:
    'The value shows up in three places, and all three are measurable on your own data rather than an industry average. Billing capture is usually the one that pays for the engine: AI-assisted work logged against the matter as it happens, instead of reconstructed from memory at the end of the day — we quantify the gap from your own timekeeping records during the pilot. Diligence and memo drafting converts senior-associate hours from writing into reviewing, on the matters you already run. And regulatory alerting is the retention play: for time-sensitive changes — an SEC rule amendment, an RBI lending circular, a SEBI norm — being first into the client’s inbox instead of third is what keeps the relationship. Exact numbers depend on matter volume, practice mix and current workflows; the discovery call maps them against your figures, not ours.',
};

/** Honest proof panel — a "how we prove it" pilot, NOT client quotes.
 *  Replace with real attributable client quotes once available. */
export const LEGAL_REG_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'Pick the gap that hurts most and we run that one workflow on five of your real regulatory events, matched against your actual matter list — with a partner reviewing every output before anything counts.', name: 'Run on your own matters', role: 'Weeks 3–4 of the pilot', company: 'partner review on every output' },
  { quote: 'Before go-live we quantify the billing gap from your own timekeeping records — what AI-assisted time was logged versus what was actually worked. Your numbers decide the business case, not an industry benchmark.', name: 'Measured on your timekeeping', role: 'your data, not a benchmark', company: 'no industry averages' },
  { quote: 'Every authority the engine cites links back to the document it retrieved from your own systems, so a partner can check any line in one click — and privileged content never leaves your environment.', name: 'Checkable, and privileged', role: 'grounded citations · your tenant', company: 'nothing to public AI' },
];

export const LEGAL_REG_FAQS: { q: string; a: string }[] = [
  { q: 'We already have an internal AI assistant and a RAG system. Why do we need this?', a: 'That is exactly who this engine is for. The tools are the solved problem — the gaps are operational. The assistant\'s usage never reaches your billing system, the RAG index never learns from the matter that closed last week, regulatory alerts still depend on someone reading circulars, and diligence reports are still written by hand. The engine is the orchestration layer that connects the AI you already own to the workflows where revenue is made and lost. We don\'t replace your stack; we wire it together.' },
  { q: 'Can it really capture AI-tool usage into our billing system?', a: 'Yes — that is the AI Billing Capture workflow. A background timer tracks AI-tool sessions per matter and creates a draft time entry ("AI-assisted analysis, 92 minutes, Matter #5821") in your billing or practice-management system — Elite 3E, Aderant, Clio or equivalent. The lawyer approves, edits or discards it in one click; nothing is billed without human sign-off. It also logs every prompt and output to the matter file, which doubles as the AI audit trail your governance committee wants anyway.' },
  { q: 'Does it work with iManage, NetDocuments and Relativity?', a: 'Yes. The workflows trigger from the systems you already run: matter tagging and final-document events from iManage or NetDocuments, completed-review exports from Relativity, and write-back into your billing platform. No rip-and-replace — the engine\'s entire point is connecting the stack you have.' },
  { q: 'Which regulators can the engine monitor?', a: 'Any regulator that publishes via a structured feed, RSS, email list, or web publication. We have built integrations for SEC EDGAR, SEBI, RBI, IRS, FINRA, the Federal Register, ESMA, FCA, and MAS. If your practice covers a jurisdiction not on this list, we can add custom monitoring for any regulatory publication source.' },
  { q: 'What happens to privileged client material? Is anything sent to public AI?', a: 'Nothing is sent to a public AI service, and nothing is used to train anyone\'s model. The engine runs inside your own environment or a dedicated tenant you control, never on shared infrastructure. By default it touches only your matter list and matter metadata — client, practice area, jurisdiction — for impact matching; it reads full matter content only if you explicitly connect your DMS for the precedent index, and then access mirrors the permissions already set in iManage or NetDocuments, so nobody sees through the engine what they could not already see. Data residency is configurable to the jurisdiction your client agreements require, and we will complete your firm\'s security and outside-counsel-guideline review before go-live.' },
  { q: 'How do you stop it inventing case citations?', a: 'By never letting it write authority from memory. The engine retrieves from documents your firm already holds and from primary regulatory sources, and every authority in a draft is rendered as a link back to the specific document it came from — so a partner can verify any line in one click. If it cannot ground a proposition in a retrieved document, it flags the gap instead of filling it. It is a retrieval-and-drafting layer over your own material, not a model asked to recall case law, and a partner still reviews and signs everything before it leaves the firm.' },
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
      stat: 'resolved on first touch',
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
      stat: 'KB updated · outcome logged',
      caption: 'Logging every resolution and feeding new patterns back into the knowledge base.',
      activity: 'Resolution logged · satisfaction survey sent · new pattern indexed · threshold adjusted',
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
  'The Customer Support Engine handles incoming support across email, chat and voice: it routes each query to the right specialist agent, answers using your live system data and your knowledge base, escalates to a human with full context when it is not confident, and learns from every resolution. To be precise about the word, because the industry is not: we count a ticket as *resolved* only when the customer’s issue is actually fixed and they do not come back — not merely *deflected* away from an agent.',
  'It is not a single chatbot with a large FAQ. It is a coordinated team of specialist agents: a Technical Agent, a Billing Agent, a Debug Agent that checks live system status in real time, a Feature Request Agent, and a Voice Agent for phone support. Each is good at one job, and escalation to a human is designed in — not a workaround.',
  'The key difference from a standard help-desk chatbot: when the Debug Agent tells a customer their API is slow, it has actually checked the live incident log 30 seconds ago. When the Billing Agent applies a $42 credit, it has actually applied it. Actions, not answers.',
  'Three controls decide whether a system like this is safe in front of your customers, so they are configured before go-live rather than after. Grounding: answers come from your documented knowledge and live system state with the source attached, and the agent is built to fetch a human rather than improvise a policy it cannot find. Voice: it writes in your brand voice, configured from your style guide and your approved responses — not a generic bot register. Escape hatch: a customer can always reach a person, and asking for one is honoured immediately, on every channel.',
];

export const CS_HOWITWORKS_INTRO =
  'Six components run in sequence for every incoming query. The Knowledge Base is always live; the remaining five fire on each new ticket. Here is exactly what happens — from the moment a query arrives to the moment it is resolved and learned from.';

export const CS_PROBLEM: { intro: string; pains: string[]; closing: string } = {
  intro:
    'Customer support at scale has a fundamental tension: personalised, accurate support requires human judgment, but the volume of queries makes human-first response economically unsustainable.',
  pains: [
    'First-response time degrades as volume grows — customers wait hours for issues that should resolve in minutes.',
    'Tier 1 agents spend most of their week on repetitive queries — billing questions, documentation requests, known issues — that do not need human judgment; we measure the actual share from your own ticket history.',
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
    { phase: 'Guardrails, escalation & brand voice', time: 'Week 2', detail: 'Configure grounding rules, escalation routing and the human-handoff format, and tune the brand voice from your style guide and approved responses. Replay historical tickets through the system and validate every answer against how your team actually answered them.' },
    { phase: 'Voice agent and go-live', time: 'Week 2–3', detail: 'Deploy the Voice Agent for phone support. Run parallel with your existing support queue for one week. Go live when CSAT from agent-handled tickets matches your human baseline.' },
  ],
  prerequisites: [
    'Existing product documentation — any format: docs site, Confluence, Notion, or PDF.',
    'Past support tickets — any volume. 200+ resolved tickets gives the KB meaningful patterns.',
    'Access to your billing platform API — for the Billing Agent to take real actions.',
    'Access to your live monitoring or status page — for the Debug Agent to check real system state.',
    'Your current support tool — Zendesk, Intercom, Freshdesk, or equivalent — for ticket integration.',
    'Your style guide or a set of approved responses — so the agent answers in your brand voice.',
    'Your data-handling requirements — what customer PII the agent may see, and your retention policy.',
  ],
  note: 'Customer data is processed inside your own environment or a dedicated tenant you control, and is never used to train anyone\'s model. The voice agent requires a phone number and a telephony provider — Twilio, VAPI, or ElevenLabs — which we provision as part of the setup if you don\'t have one.',
};

export const CS_ROI: { stats: { value: string; label: string }[]; narrative: string } = {
  stats: [
    { value: 'Your tickets', label: 'resolution rate measured on your own history — not a benchmark' },
    { value: 'Minutes', label: 'to a first response at any hour, instead of a queue overnight' },
    { value: 'Full context', label: 'every escalation reaches a human already briefed' },
    { value: '2–3 wks', label: 'to go live across email, chat, and voice' },
  ],
  narrative:
    'We are not going to quote you a resolution rate. It depends entirely on your product, your ticket mix and how good your documentation is — and a vendor quoting one before reading your tickets is selling you somebody else’s result. What we do instead is replay a week of your real historical tickets through the engine and show you exactly what it would have resolved, what it would have escalated, and where it would have been wrong. That gives you a defensible capacity number calculated from your own volume and your own fully-loaded agent cost — and it tells you, before you commit, whether this is worth doing at all.',
};

/** Honest proof panel — a "how we prove it" pilot, NOT customer quotes.
 *  Replace with real attributable client quotes once available. */
export const CS_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  { quote: 'We replay a week of your real historical tickets through the engine and show you what it would have resolved, what it would have escalated, and — most importantly — where it would have got it wrong.', name: 'Replayed on your tickets', role: 'before anything goes live', company: 'your history, not a benchmark' },
  { quote: 'It runs in parallel with your existing queue, and goes live only when satisfaction on agent-handled tickets matches the baseline your human team already sets.', name: 'Parallel run to your baseline', role: 'the go-live gate', company: 'your CSAT decides' },
  { quote: 'Answers are grounded in your documented knowledge and live system state with the source attached, a sample is human-reviewed every week, and any customer who asks for a person gets one immediately.', name: 'Guardrails you can inspect', role: 'grounded · QA-sampled · always an escape hatch', company: 'wrong answers are the risk we design against' },
];

export const CS_FAQS: { q: string; a: string }[] = [
  { q: 'Will customers know they are talking to an AI?', a: 'That is your choice to configure. We can make the agent transparent about being AI, or deploy it with a persona name. What we do not do is have the agent actively claim to be human when directly asked. On voice, agents sound conversational and natural — but the disclosure policy is a decision your team makes, not ours.' },
  { q: 'What stops it giving a customer a confidently wrong answer?', a: 'A confidence score alone is a weak guard — language models are routinely confident and wrong — so it is not what we rely on. Answers are grounded: the agent responds from your documented knowledge and live system state, with the source attached, and where it cannot find grounding it fetches a human instead of improvising a policy. Before go-live we replay your historical tickets and compare its answer to how your team actually answered, so you see the error rate rather than trusting a threshold. After go-live a sample of conversations is human-reviewed every week, escalation and repeat-contact rates are monitored for drift, and any corrected answer is logged back into the knowledge base. And a customer who asks for a person always gets one.' },
  { q: 'Can it sound like us rather than a generic bot?', a: 'Yes, and this is configured before launch, not tuned afterwards. We build the voice from your style guide and a set of your own approved responses, so the register, the greeting, the apology language and the sign-off match how your team already writes. You review and sign off the tone on real sample tickets during the pilot, and you can lock exact wording for sensitive replies — refunds, outages, cancellations — so those never get improvised.' },
  { q: 'Where does customer data go?', a: 'Customer conversations and any PII are processed inside your own environment or a dedicated tenant you control, never on shared infrastructure, and are never used to train anyone\'s model. You define what the agent is allowed to see and how long anything is retained, and we complete your security review before go-live.' },
  { q: 'Can the Billing Agent actually take actions — apply credits, issue refunds?', a: 'Yes — within the permissions you configure. You set action limits: up to $X credit without human approval, refunds above $Y always require a human. The Billing Agent operates within those limits. Every action it takes is logged with the query context and the agent\'s reasoning.' },
  { q: 'Does the voice agent work for complex technical support?', a: 'The Voice Agent handles Tier 1 volume well — billing questions, basic how-to, known incident notifications. Complex technical debugging that requires screen sharing or log access is designed to route to a human quickly with full context. The value is eliminating the Tier 1 calls that should never have reached a human in the first place.' },
  { q: 'How long does it take to build a good knowledge base?', a: 'The initial build takes 2–3 days with your existing documentation, and quality improves rapidly as resolved tickets are indexed — 200+ past tickets gives meaningful coverage of your most common query types. Rather than quote you a resolution rate, we measure it: the pilot replays your own ticket history so you see the real number for your product before committing. The knowledge base does not need to be complete to go live; it improves with every ticket.' },
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
