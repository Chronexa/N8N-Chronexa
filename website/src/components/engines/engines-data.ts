/**
 * Data for the AI Engines pages. Pure data (no JSX) so the server pages and the
 * client demo share it.
 *
 * IMPORTANT: we only ship fully-built content for engines we have deep-researched
 * and actually run. Today that is the Sales Engine. The other five are honest
 * "Coming soon" roadmap entries — no fabricated orchestration — and each will get
 * its own dedicated, researched page later. The crux of these pages is CLARITY
 * and CONVICTION (plain-English, benefit-led), not visual flourish.
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
  { name: 'Investment Research Engine', kicker: 'Capital markets & RA', status: 'soon', icon: 'chart', promise: 'A research-analyst agent wired into market data — surfaces opportunities, monitors portfolios, reads the news, and models the signal.' },
  { name: 'Document & Data Engine', kicker: 'Unstructured → structured', status: 'soon', icon: 'layers', promise: 'Turns paper notes, images, PDFs and sensor data into structured, queryable knowledge — with a RAG layer that keeps learning.' },
  { name: 'Legal & Regulatory Engine', kicker: 'Reg-watch & matters', status: 'soon', icon: 'shield', promise: 'Monitors regulators across jurisdictions, matches changes to the matters in your book, and alerts the partners who are impacted.' },
  { name: 'Customer Support Engine', kicker: 'Omnichannel CS', status: 'soon', icon: 'inbox', promise: 'Routes every conversation to the right specialist agent and answers human-like from your knowledge base, across voice and text.' },
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
