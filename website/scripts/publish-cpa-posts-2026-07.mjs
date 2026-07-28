/**
 * SEO v2 Phase 3 — publish the CPA cluster posts (2026-07-25).
 *  - 4 NEW posts (createOrReplace, deterministic _id post-<slug>)
 *  - 1 REWRITE (patch of existing cpa-firm-client-onboarding-automation-3-days — keeps slug/equity/publishedAt/hero)
 * All follow .claude/skills/blog-seo-strategy (v2): one firm size + its apprehension, alongside-not-replace,
 * ≥3 real specifics, no fabricated numbers, FAQ H3s, calculator-first CTA, pillar links.
 *
 * Run: node scripts/publish-cpa-posts-2026-07.mjs           (dry run — validates + word counts)
 *      FIX=1 node scripts/publish-cpa-posts-2026-07.mjs     (publish)
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const FIX = process.env.FIX === '1';
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// ---------- portable-text helpers ----------
let K = 0;
const key = p => `${p}${(++K).toString(36).padStart(4, '0')}`;
const span = (text, marks = []) => ({ _key: key('s'), _type: 'span', marks, text });
const block = (style, children, markDefs = [], extra = {}) => ({ _key: key('b'), _type: 'block', style, children, markDefs, ...extra });
const h2 = t => block('h2', [span(t)]);
const h3 = t => block('h3', [span(t)]);
const p = (...parts) => {
  const markDefs = [], children = [];
  for (const part of parts) {
    if (typeof part === 'string') children.push(span(part));
    else { const id = key('l'); markDefs.push({ _key: id, _type: 'link', href: part.href }); children.push(span(part.text, [id])); }
  }
  return block('normal', children, markDefs);
};
const li = t => block('normal', [span(t)], [], { listItem: 'bullet', level: 1 });
const wordCount = body => body.reduce((n, b) => n + (b.children || []).reduce((m, s) => m + s.text.split(/\s+/).filter(Boolean).length, 0), 0);

const PILLAR = { href: '/cpa-tax-document-automation', text: 'AI automation for CPA and accounting firms' };
const CALC = { href: '/cpa-tax-season-capacity-calculator', text: 'CPA Tax Season Capacity Calculator' };

// ============================================================
// POST 1 (P8, REWRITE) — CPA client onboarding automation
// Buyer: mid-market firm partner/COO · Apprehension: staff disruption & integration
// ============================================================
const post1Body = [
  p('Ask any partner what onboarding a new client actually involves and the honest answer is: three meetings, a dozen emails, an engagement letter that sits in someone’s drafts folder for a week, and a document checklist the client half-completes. Nobody planned it that way. It accreted. And every firm we talk to knows exactly how much goodwill it burns — the client said yes at the first meeting, then spent three weeks watching the firm shuffle paperwork before any actual accounting happened.'),
  h2('What onboarding costs when it runs on memory and inboxes'),
  p('The pieces of CPA client onboarding are individually small: schedule the intake call, write up what was discussed, collect the prior-year returns, run the conflict and independence checks, draft and price the engagement letter, get it signed, request the document list, chase the document list. None of them is hard. What makes the process expensive is that each step waits on a person remembering to do it — and during the weeks that takes, the client is at their most likely to stall, shop around, or arrive at tax season with half their records missing.'),
  p('There is also a compliance clock running underneath it. If the engagement involves using or disclosing client tax return information beyond preparation — sharing it with a vendor, an offshore preparer, or an advisory affiliate — IRC §7216 requires written consent, and the cleanest place to capture that is during onboarding, not mid-engagement. The AICPA has long recommended a signed engagement letter before work begins, both as professional-liability protection and scope control. When onboarding runs on memory, these are exactly the steps that slip.'),
  h2('What an automated onboarding path actually looks like'),
  p('The version we build for accounting firms follows the same path the firm already uses — it just removes the waiting between steps:'),
  li('The intake meeting is captured and summarized into a structured record: entities involved, filing history, services discussed, red flags, and next steps — written to the practice-management system (Karbon, Canopy, Firm360 or equivalent), not to someone’s notebook.'),
  li('The engagement letter is drafted minutes after the call, from the firm’s own templates and rate card, scoped to what was actually discussed. A partner reviews, adjusts, and sends it for e-signature the same day.'),
  li('The document checklist goes out automatically once the letter is signed — prior-year returns, W-2s, 1099s, K-1s, bank and brokerage statements — and the system follows up on what hasn’t arrived, politely and persistently, so staff don’t have to.'),
  li('Every step lands in one tracked record: what was discussed, what was sent, what is signed, what is still outstanding. Anyone in the firm can answer “where is this client?” without asking around.'),
  p('The compression is real: a path that routinely takes two to three weeks of elapsed back-and-forth collapses into days, because nothing waits on a human remembering to send the next email. In the tax-season build we describe in ', { href: '/case-studies/ai-automation-tax-workflow-cpa-case-study', text: 'our CPA firm case study' }, ', automating the document chase alone cut manual follow-up work by 84% — onboarding is the same mechanics applied earlier in the client’s life.'),
  h2('Your team keeps every decision — the system does the in-between'),
  p('The apprehension mid-market firms raise first is not cost — it is disruption. Nobody wants to re-train forty people on new software in September, and nobody wants a system that quietly sends a client something a partner never saw. Both concerns shape how this is built. The automation runs behind the tools the firm already uses — the practice-management system stays the source of truth, the engagement letter comes from the firm’s own template, e-signature stays with the provider you already trust. Staff do not learn a new app; they see fewer chase emails to write.'),
  p('And the judgment calls stay human. A partner still decides scope and pricing, still reviews the engagement letter, still signs off before anything client-facing goes out. The system drafts, tracks, reminds, and files. That division — people on judgment and relationships, software on the connective work — is the whole design principle, and it is why staff adopt it instead of fighting it: it removes the part of onboarding everyone already hated.'),
  h2('Two weeks of onboarding, before and after'),
  p('Before: Monday, good intake call. Wednesday, the partner starts the engagement letter between reviews and finishes it Friday. It sits unsent over the weekend, goes out Tuesday, gets signed Thursday. The document request email goes out the following Monday; the client uploads half the list; nobody notices the other half is missing until someone opens the file two weeks later. Elapsed: 17–20 days, and the client’s first impression of the firm is silence punctuated by requests.'),
  p('After: Monday, the same call — captured and summarized by the time the partner is back at their desk. The engagement letter draft is waiting; the partner edits scope and pricing in ten minutes and sends it. Signed Tuesday. The checklist goes out Tuesday afternoon, generated from the services scoped in the letter; reminders run themselves; the tracker shows three items outstanding by Friday, and the system is already following up on them. Elapsed to a working file: under a week — with fewer staff touches, not more.'),
  p('The same record that onboarding creates keeps paying after it: the engagement’s status, documents and communications stay tracked through the season, which is how the firm answers “where are we with this client?” in one glance next February instead of an email archaeology dig. Onboarding is simply the first stage of the lifecycle — the rest of it is what ', PILLAR, ' covers.'),
  h2('Security and the paper trail'),
  p('Onboarding data is client tax data, so it is handled like it: the system deploys on infrastructure the firm controls — a dedicated model instance via OpenAI, Google Vertex, AWS or Azure inside your own cloud — with role-based access and an audit log on every document and message. Nothing trains a public model. That posture also maps to what the FTC Safeguards Rule already asks of a firm’s written information security plan when any vendor touches client data: named access, oversight, and an exit path. A vendor who cannot answer those questions during your onboarding project is telling you something.'),
  h2('Frequently Asked Questions'),
  h3('Will this disrupt how our staff already work?'),
  p('It is built not to. The practice-management system you already run stays the source of truth, letters come from your templates, and staff interact with the same tools they use today — there is no new app to learn. What changes is that the chasing, drafting and status-tracking happen without anyone having to remember them.'),
  h3('Does the engagement letter still get partner review?'),
  p('Always. The system produces a scoped draft from your templates and the intake conversation; a partner reviews, edits and approves before anything is sent for signature. Automation removes the wait, not the judgment.'),
  h3('How long does implementation take?'),
  p('Most firms are live in 4–6 weeks. Starting outside peak season means the system is settled well before January, when the onboarding volume actually hits.'),
  h3('What does it connect to?'),
  p('Karbon, Canopy, Firm360 and similar practice-management platforms; QuickBooks Online and Xero on the accounting side; your existing e-signature and document-portal tools. If your firm runs on something specific, that is a scoping question, not a blocker.'),
  p('If you want the number before the conversation: our free ', CALC, ' shows what manual onboarding and document handling currently cost your firm per season — two minutes, no email required. Or see the full picture of ', PILLAR, ' and book a call when it is worth 30 minutes.'),
];

// ============================================================
// POST 2 (P9, NEW) — tax document collection automation
// Buyer: solo/small firm owner · Apprehension: cost & complexity ("I'm not technical")
// ============================================================
const post2Body = [
  p('It is March 28th and you are still waiting on one K-1, two brokerage statements, and a client who swears the 1099 is “in the mail.” You know the pattern because it repeats every season: the returns are not the bottleneck — the documents are. For a small firm, the chase is personal: it is you or your one admin sending the third reminder email, logging what came in, and deciding whether to file the extension now or hope the documents land this week.'),
  h2('The real cost of chasing documents by hand'),
  p('Count what one incomplete client actually costs. Three to five reminder emails, each hand-written. A spreadsheet or memory tracking who sent what. A return opened and set aside twice because a schedule was missing. The Form 7004 or 4868 extension you file not because the work was hard but because the paper arrived late. Multiply by forty or eighty clients and the chase quietly becomes one of the biggest line items of the season — unbilled, repetitive, and exhausting the exact weeks you can least afford it. Firms that measure it are consistently shocked; in the mid-market build described in ', { href: '/case-studies/ai-automation-tax-workflow-cpa-case-study', text: 'our CPA case study' }, ', 84% of manual follow-up time disappeared when the chase was automated.'),
  h2('What tax document collection automation actually does'),
  p('The system is not a portal your clients will ignore. It is the follow-through you currently do by hand, run automatically:'),
  li('Each client gets a personalized checklist generated from last year’s return — if they had a Schedule E last year, rental documents are on the list this year.'),
  li('Reminders go out on a schedule you set, escalate politely, and stop the moment the document arrives. No client gets chased for something they already sent.'),
  li('Whatever arrives — email attachment, portal upload, photographed receipt — is recognized, labeled (W-2, 1099-INT, K-1, brokerage 1099 consolidated), and filed against the client, with anything ambiguous routed to you.'),
  li('You see one dashboard: who is complete, who is close, who needs the extension conversation — instead of reconstructing that picture from your inbox every Monday.'),
  p('Tools like TaxCaddy, SafeSend Exchange or Liscio already handle pieces of this — secure upload, requests, reminders. Where a custom build earns its keep is the connective layer those tools stop at: reading what arrived, tying it to the prior-year checklist, updating your workflow tool, and telling you specifically what is still missing. That last mile is what turns a document portal into a system that ends the chase.'),
  h2('“I’m not technical” is the design constraint, not a problem'),
  p('For a solo practitioner or a three-person firm, the honest apprehensions are cost and complexity — nobody has an IT department, and nobody is buying an enterprise platform in February. So the small-firm version of this is deliberately narrow: it connects to the email and storage you already use (Outlook or Gmail, your existing portal, QuickBooks Online if bookkeeping is in scope), the checklist and reminder cadence are set once before the season, and from then on your involvement is approving the exceptions it flags. No servers to run, no dashboard to babysit, no staff training beyond “the reminders send themselves now.”'),
  p('Scope discipline is also cost discipline: automating just collection and intake is a small, fixed-price build — not an AI transformation program. It sits alongside you the way a very reliable assistant would: it never files a return, never makes a judgment call, and never emails a client anything you have not templated. It just refuses to forget.'),
  h2('What a season with it actually looks like'),
  p('January: engagement letters go out, and each signed letter triggers that client’s checklist — built from what they filed last year, adjusted for what changed. You review the lists once, in bulk, before anything sends. February: documents flow in and file themselves; the Monday dashboard replaces the Monday inbox excavation. You call the three clients who genuinely need a phone call — the system tells you who they are — instead of emailing forty who don’t.'),
  p('March: the complete files move to prep the day they become complete, not the day someone notices. The extension list forms itself from what is still outstanding, so the Form 4868 and 7004 decisions happen calmly in the third week of March instead of frantically in the second week of April. April: you file, and the chase log — every request, every receipt, every reminder — is already sitting in each client’s record if a question ever comes up. The season’s shape doesn’t change; the 9 p.m. reminder-writing disappears from it.'),
  h2('Clients feel it too'),
  p('The chase is not only your cost — it is your client’s experience of the firm. From their side, the manual version is four reminder emails that all say “still missing some items” without saying which, and a nagging worry that something got lost. The automated version is one clear checklist that updates as they send things, reminders that name the exact missing document, and silence once they are done — which, for a client, reads as competence. Small firms compete on relationship; a collection system that never nags a compliant client and never forgets a delinquent one protects exactly that. It also removes the season’s worst relationship moment: the April call where you tell a good client they are going on extension because of paperwork nobody tracked.'),
  h2('Client data, handled properly'),
  p('Even a two-person firm sits under the FTC Safeguards Rule, which requires a written information security plan and oversight of any service provider touching client data. A collection system must clear that bar: documents encrypted in transit and at rest, access limited to your firm, an audit trail of every file received and read, and — in our builds — processing on infrastructure you control rather than a shared black box, with nothing training a public model. If a vendor cannot state where the client documents physically live, keep looking.'),
  h2('Frequently Asked Questions'),
  h3('Will my clients actually use it?'),
  p('They do not have to change much — replying to a reminder email with an attachment works. The system meets clients where they already are; the structure happens on your side, not theirs.'),
  h3('What does it cost for a small firm?'),
  p('A scoped collection-and-intake build is a fixed-price project, sized to a small firm — not an enterprise license. Run the ', CALC, ' first: if the chase is not actually costing you meaningful hours, automation is not worth buying, and the calculator will tell you that too.'),
  h3('Can it read the documents, or just collect them?'),
  p('Both. Incoming files are recognized and labeled by form type (W-2, 1099 variants, K-1, statements), matched against each client’s checklist, and filed. Full field-level extraction into your tax software is a natural second phase — see our overview of ', PILLAR, '.'),
  h3('When should I set this up?'),
  p('Off-season. A 4–6 week build finished by November means the January engagement letters go out with the checklist system already live — the worst time to install plumbing is during the flood.'),
  p('Start with the number: the free ', CALC, ' shows what document chasing costs your practice per season — two minutes, no email required. If the number is ugly, ', { href: '/contact', text: 'talk to us' }, '.'),
];

// ============================================================
// POST 3 (P13, NEW) — tax workpaper preparation automation
// Buyer: mid-market firm partner/ops · Apprehension: accuracy + integration with existing stack
// ============================================================
const post3Body = [
  p('Every reviewer knows the feeling: the return is “done,” but the workpapers are not — the binder is missing a tie-out, the K-1 detail does not foot to the summary, and the staff member who assembled it is on another engagement. Workpaper preparation is where accuracy is actually manufactured in a tax practice, and it is still, in most firms, assembled by hand: download, rename, index, cross-reference, tick, tie.'),
  h2('The status quo: skilled people doing assembly work'),
  p('The workpaper file for a business return is mostly mechanical: source documents indexed against the trial balance, prior-year comparatives pulled forward, standard leadsheets populated, K-1 and 1099 detail reconciled to totals, open-item lists maintained until they close. Firms staff this with people trained to do far more — seniors who should be reviewing are instead formatting, and reviewers burn hours confirming that page 4 really does tie to page 11. The cost is not just hours; it is that every manual hand-off is a place where a transposed number survives until review catches it. In our tax-season automation work, the same firm that cut document-chase time by 84% also tripled documents processed per staff member — capacity that came from removing assembly, not from working faster.'),
  h2('What automation takes over — and what it does not touch'),
  li('Document intake and indexing: incoming PDFs are recognized by type, named to your convention, and filed to the right workpaper section automatically.'),
  li('Data extraction: W-2s, 1099s, K-1s and brokerage statements are read field-by-field against each form’s schema and staged next to the source image for review — the number and its evidence side by side.'),
  li('Tie-outs and rollforward: extracted figures are compared to the trial balance and prior year; differences surface as an exception list instead of a reviewer discovery.'),
  li('Open items: the missing-document list maintains itself, feeding the same follow-up automation that handles collection.'),
  p('What it does not touch: judgment. Elections, positions, characterization questions, anything ambiguous — those route to a human with the source document attached. The design goal is a reviewer who opens a binder where the mechanical work is already done and evidenced, and whose time goes to the ten items that actually need a professional. Your preparers are not replaced; they are promoted to the work you hired them for.'),
  h2('Anatomy of one business-return binder, timed'),
  p('Take a routine 1120-S with a dozen source documents and follow the hours. Twenty minutes downloading and renaming files to the firm convention. Fifteen indexing them into the binder sections. Forty keying figures from the K-1s, 1099s and statements into leadsheets. Twenty tying those figures to the trial balance and prior year, and another fifteen writing up the open-item list for the two documents that never arrived. Roughly two hours of assembly before a single professional judgment is made — per return, hundreds of times a season.'),
  p('Now the automated version of the same binder: documents arrive already labeled and filed (the collection layer did that), extraction stages every figure next to its source image, the tie-out report is waiting with two exceptions flagged, and the open-item list is already chasing itself. The preparer’s two hours become twenty minutes of verification and the exceptions. Multiply by the season’s volume and that is where the tripled per-staff throughput in our case-study build came from — the returns did not get easier; the assembly stopped being human work.'),
  h2('It has to live inside your existing stack — or it is worthless'),
  p('The mid-market objection we hear most is not about the AI — it is “we run CCH Axcess and a document management system we have used for a decade; we are not migrating.” Correct, and you should not. A workpaper automation layer earns its place only if it reads from and writes to what you already run: Axcess or UltraTax CS on the prep side, your existing DMS folder structure, your existing review workflow. In practice that is an orchestration layer — watching for documents, extracting, comparing, filing — with your current software remaining the system of record. If a vendor’s answer to integration is “export to our platform,” that is a migration wearing a costume.'),
  h2('The pilot: prove it on twenty returns'),
  p('Nobody should buy workpaper automation on faith. The structure that works: pick twenty completed returns from last season — a representative mix of easy 1040s, a multi-K-1 partnership, the client whose brokerage sends 60-page consolidated statements — and run the system against them cold. Compare its binders to the ones your staff actually produced: extraction accuracy per form type, exceptions flagged versus errors your reviewers had caught, time per binder. The prior-season answer key already exists, so the evaluation costs review hours, not client risk. If the numbers hold, roll it into the live season on one office or one partner’s book first. If they don’t, you have spent a few thousand dollars learning that — against a six-figure season of assembly labor, that is cheap information either way.'),
  h2('Accuracy, evidence, and the audit trail'),
  p('Extraction accuracy is a fair question, and the honest answer is: it is measured, not promised. Every extracted field carries a confidence score; low-confidence items go to a human queue, and the firm sets the threshold. Every value keeps a link to the exact source page it came from, so review is verification, not archaeology. And every action — what was read, what was changed, by whom — is logged, which is precisely the evidence trail peer review and your professional-liability carrier want to see. Client data stays on infrastructure the firm controls (dedicated instances on OpenAI, Vertex, AWS or Azure), nothing trains a public model, and the FTC Safeguards Rule vendor-oversight questions have written answers before the pilot starts.'),
  h2('Frequently Asked Questions'),
  h3('How accurate is the extraction on real documents?'),
  p('Accuracy is tuned per form type on your actual documents during the pilot, with confidence thresholds routing anything uncertain to review. The system is designed so that what reaches a preparer is either verified or explicitly flagged — never silently wrong.'),
  h3('Does it work with CCH Axcess / UltraTax CS?'),
  p('That integration is the core of the build — extracted, verified data lands in your prep software rather than a separate dashboard. The specifics depend on your configuration, which is what the scoping conversation establishes.'),
  h3('What happens to our current workpaper conventions?'),
  p('They are the template. The system adopts your index, your naming, your leadsheets — reviewers should open a binder that looks exactly like the firm’s, just already assembled.'),
  h3('Is this only worth it for large firms?'),
  p('The economics turn on volume and pain, not headcount. A firm processing a few hundred business returns with two reviewers bottlenecked on assembly often gains more than a large firm with idle capacity. Put your own numbers into the ', CALC, ' — it takes two minutes.'),
  p('Workpaper assembly is one stage of the lifecycle we automate for accounting firms — the full picture, from onboarding to filing, is here: ', PILLAR, '. When you want to pressure-test it against your stack, book a call.'),
];

// ============================================================
// POST 4 (P11, NEW, BOFU/commercial ≥1800w) — AI automation company for CPA firms
// Buyer: mid-market managing partner · Apprehension: security + vendor risk
// ============================================================
const post4Body = [
  p('Somewhere between the third AI webinar and the fourth vendor cold email, most managing partners arrive at the same practical question: if we are going to do this, who do we actually hire? Not which model is smartest, not what the future of the profession is — which company do we let inside a practice that runs on client tax data, and how do we tell the real ones from the deck-ware?'),
  h2('The market you are actually choosing from'),
  p('Strip the branding and there are four kinds of company selling “AI for accountants.” Product vendors sell software — practice tools like Karbon or Canopy, delivery tools like SafeSend, extraction tools — excellent at what they do, bounded by what they built. Big consultancies sell transformation programs sized for the Big Four. Generalist AI agencies sell enthusiasm across every industry at once — yesterday a restaurant chatbot, today your K-1 pipeline. And a small number of specialist automation companies build custom systems on top of the tools a firm already runs. The first two are legitimate but often mis-sized for a mid-market firm; the third is where the horror stories come from; the fourth is the category this article is really about — and the one where diligence matters most, because “custom” can hide anything.'),
  h2('Seven questions that separate builders from deck-ware'),
  li('“Where does our client data physically run?” The only good answer names infrastructure you control — a dedicated instance on OpenAI, Google Vertex, AWS or Azure inside your cloud — with a commitment that nothing trains a public model. “Our secure platform” is not an answer; it is a question you have not asked yet.'),
  li('“How do you integrate with our stack — specifically?” Make them name the mechanism for your practice-management and tax software. Watch for the tell we wrote about in ', { href: '/blog/firm360-api-access-ai-vendors-cpa-firms', text: 'the Firm360 API access piece' }, ': platforms often grant access to the firm, not the vendor — a real builder knows the sponsored-access dance and tells you about it before you discover it.'),
  li('“What happens under IRC §7216?” Routing return information through a vendor’s systems is a disclosure that needs written client consent. A vendor who has never heard of §7216 has never seriously worked with a tax practice.'),
  li('“What do you hand our Safeguards Rule plan?” The FTC requires your written information security plan to cover service providers. The right vendor arrives with the paperwork — security posture, access model, retention, offboarding — rather than treating the request as friction.'),
  li('“Who reviews before anything is filed or sent?” The answer must be: your people, always. Systems that quietly act without a review gate are how a firm ends up explaining an AI-drafted email to a client.'),
  li('“Show me one build for a firm like ours, end to end.” Not logos — mechanics. What arrived, what was extracted, what the exception rate was, where humans intervened. Builders love this question; resellers change the subject.'),
  li('“What does exit look like?” Tokens revoked, data returned or destroyed on a schedule, confirmed by you. Agreed on day one, in writing, or you are renting a dependency, not buying a system.'),
  h2('The pricing conversation, decoded'),
  p('You will meet three models. Subscriptions per user per month — right for product tools, wrong for custom work, because your needs are not linear in seats. Time-and-materials — defensible for genuine R&D, but open-ended in exactly the way a firm’s budget season hates. And fixed-price scoped builds — a defined outcome (“document collection and intake automated, integrated with Karbon and UltraTax, live by November”) for a defined number. We run fixed-price because it moves the scoping risk to the people who can control it; whoever you hire, insist the price maps to an outcome you can verify, not to effort you cannot audit. A useful sanity check before any pricing call: run the ', CALC, ' — two minutes, no email — so you know what the manual status quo costs before someone quotes you the automated one.'),
  h2('The one framing question that predicts the relationship'),
  p('Ask the vendor what happens to your staff. The wrong answer talks about replacing associates and headcount savings — wrong not because efficiency is bad, but because it misreads what a firm is. Mid-market practices are hiring, not firing; the constraint is that skilled people spend their hours on chasing, keying and assembling instead of review, advisory and clients. The right system sits alongside your team: it does the reading, filing, drafting and follow-up, and your people keep every judgment call. That framing is also the honest description of the ', PILLAR, ' work — capacity without headcount, not headcount without people. A vendor who pitches replacement will build a system your staff resist; one who pitches leverage will build one they defend.'),
  h2('How to run the evaluation in two weeks'),
  p('You do not need a procurement department to do this well — you need a process a managing partner can run between client work. Week one: pick the single workflow that hurts most (for most firms it is document collection or onboarding — if you are unsure, the calculator will locate it), write one page describing it honestly, and send that page to two or three candidate companies with the seven questions attached. Real builders answer in specifics within days; the ones who reply with a demo of an unrelated platform have answered a different question, and that is also information.'),
  p('Week two: take the strongest one or two responses to a working session — not a pitch, a whiteboard. Bring your actual stack list (tax software, practice management, DMS, portal) and two or three anonymized problem documents. Watch whether they ask about your edge cases — the amended return, the client with three K-1s and a mid-year entity change — or steer back to their slides. Ask for the fixed price and the go-live date in writing. The whole exercise costs the firm perhaps six partner-hours, and it filters harder than any RFP.'),
  h2('The right first project'),
  p('Whatever company you choose, shape the first engagement the same way: one workflow, fixed price, live inside 4–6 weeks, measured against a number you recorded before it started — reminder emails sent per week, days from intake call to signed letter, hours per workpaper binder. Small enough that a disappointing outcome is a lesson rather than a write-off; concrete enough that a good outcome makes the second project obvious. Firms that start with “automate everything” buy roadmaps. Firms that start with one measured workflow buy proof, and proof compounds.'),
  h2('Red flags that end the meeting'),
  li('“We don’t need API access — we have a workaround.” Usually browser automation against your software’s UI, which breaks the first time that vendor ships an update — ideally not on April 12th.'),
  li('Case studies with astonishing percentages and no mechanics. If they cannot walk you through how the number was measured, it was not.'),
  li('A pilot that requires migrating your data into their platform. That is a product sale wearing a consulting costume.'),
  li('No answer to “who owns the workflows when we part ways?” You should own the system; they should own the maintenance contract they earn.'),
  h2('Six months in: what a good engagement looks like'),
  p('Judge the company you chose by what exists half a year later. The first workflow is live and boring — boring is the goal; nobody talks about the document chase anymore because there isn’t one. The before/after number you recorded is written down and honest: follow-up emails per week, days to a signed engagement letter, hours per binder — whichever you measured, measured the same way twice. Your staff describe the system in their own words as “the thing that does X for me,” not “the AI project.” And the firm owns what was built: the workflows are documented, the credentials are yours, the vendor’s role has shifted from building to maintaining, and a second project has suggested itself from the first one’s data.'),
  p('The failure mode is just as recognizable: six months of roadmap decks, a pilot still “two weeks away,” a platform login your staff avoid, and a monthly invoice justified by activity rather than outcomes. The difference between the two futures was almost always visible in week one — in whether the vendor asked for your edge cases or showed you their slides. That is why the two-week evaluation above is worth running properly: it is the cheapest look you will ever get at the six-month picture.'),
  h2('Frequently Asked Questions'),
  h3('Should we hire an AI company or build in-house?'),
  p('If you have engineers who want to own it, building teaches you the most — our ', { href: '/blog/ai-for-accounting-firms-build-vs-buy', text: 'build-vs-buy analysis for accounting firms' }, ' walks the real math. Most mid-market firms land on buying the build and owning the result, because tax season does not pause for debugging.'),
  h3('How much should a first project cost?'),
  p('Small enough to be a decision, not a gamble: one scoped workflow — document collection, onboarding, or extraction — fixed-price, live in 4–6 weeks. Distrust seven-figure first proposals and “free pilots” that require your client data on someone else’s platform.'),
  h3('How do we evaluate security if we don’t have an IT department?'),
  p('Use the seven questions above as the checklist — they are answerable in plain English. Any vendor who cannot explain their security posture without jargon is hiding either complexity or its absence.'),
  h3('Does Chronexa pass its own checklist?'),
  p('That is the right instinct — make us prove it. The questions in this article are the ones we would rather answer before a pilot than after an incident; bring the list to the call.'),
  p('When you are ready to shortlist: start with the number from the free ', CALC, ', read how we approach ', PILLAR, ', and put us through the seven questions — book the call when the list is ready.'),
];

// ============================================================
// POST 5 (P15, NEW) — SafeSend automation for CPA firms
// Buyer: mid-market firm ops/partner · Apprehension: integration ("we already bought SafeSend")
// ============================================================
const post5Body = [
  p('Your firm already pays for SafeSend. Returns go out for e-signature through it, the 8879s come back signed, clients get their copies without anyone burning a CD. So when someone proposes “automating tax delivery,” the fair response is: didn’t we already buy that? Mostly, yes — and the gap between “mostly” and “actually” is where firms still bleed hours every March.'),
  h2('What SafeSend genuinely covers'),
  p('Credit where due: the SafeSend Suite (now part of Thomson Reuters) handles the last mile well. Assembled returns are delivered through SafeSend Returns with guided e-signature of Form 8879, K-1 distribution to partners, quarterly estimate reminders, and — through SafeSend Exchange and Organizers — secure document exchange and digital organizers on the front end. For the delivery step itself, the product does what it says, and this article is not a teardown of it.'),
  h2('The gaps: everything that touches SafeSend by hand'),
  p('Watch what your admin team actually does in peak season and the pattern appears on both sides of the product:'),
  li('Upstream: someone assembles and uploads each return batch, checks that the K-1 packages match the partner list, and keys client emails and delivery options — return by return, firm by firm convention.'),
  li('Downstream: someone watches for what has not been signed, chases the client who stalled at the ID-verification step, reconciles “signed” status back into Axcess or UltraTax and the practice-management system, and closes the loop on estimates.'),
  li('Around it: organizer responses and exchanged documents still need to be read, classified, and moved into the workpaper flow — SafeSend transports them; it does not interpret them.'),
  p('None of this is SafeSend’s failure — it is the boundary of any product: it automates its own steps, not the connective tissue between your systems. The connective tissue is precisely what an orchestration layer automates: batch assembly and upload driven from your tax software’s completion status, signature tracking that updates Karbon or Canopy without a human copying statuses, unsigned-return chasing that escalates on your schedule, and incoming organizer documents read and filed like any other intake — the same mechanics as ', { href: '/blog/tax-document-collection-automation-cpa-firms', text: 'automated document collection' }, ', pointed at delivery.'),
  h2('“We already have too many tools” is exactly right'),
  p('The mid-market worry here is tool fatigue — the firm bought SafeSend, bought a practice-management system, bought a portal, and the last thing anyone wants is platform number six. Agreed: the answer is not another platform. An orchestration layer has no login your staff live in; it is plumbing between the tools you already chose — SafeSend, CCH Axcess or UltraTax CS, Karbon or Canopy — doing the copying, checking and chasing your people currently do between tabs. We wrote up one production version of exactly this stack in ', { href: '/blog/cch-axcess-safesend-karbon-ai-agent-n8n', text: 'our CCH Axcess + SafeSend + Karbon build notes' }, '. Your team keeps working where they already work; the in-between stops being manual. That is also the alongside-your-staff principle in miniature: software does the status-copying; humans keep every client conversation.'),
  p('The K-1 side deserves its own mention, because partnership work multiplies the manual layer. A 40-partner return means one filing but forty distribution packages, forty delivery preferences, forty possible bounced emails — and next year, forty address changes to catch. SafeSend Returns distributes the packages; keeping the partner roster current, reconciling who has retrieved what, and flagging the three partners whose emails bounced back into someone’s to-do list is the connective work that stays manual. For firms with real partnership volume, that reconciliation alone can justify the orchestration layer — it is the difference between “sent” and “received,” which is the difference that matters in April.'),
  h2('A March Thursday, before and after'),
  p('Before: forty returns clear review this week. An admin assembles each package, uploads batches to SafeSend, keys delivery emails, and checks yesterday’s uploads went out. Another spreadsheet tracks signatures; unsigned ones get a hand-written nudge on Friday. When an 8879 comes back, someone marks it signed in the tracker, updates Karbon, and — if anyone remembers — flags the client’s estimate schedule. Every step small, every step manual, every step on the same three people during the worst month of their year.'),
  p('After: review completion in the tax software is the trigger. Packages assemble and upload on their own; delivery preferences come from the client record, not from memory; the signature tracker is the practice-management system itself, updated as statuses change. Friday’s nudges write themselves and stop when the 8879 lands. The admin team’s Thursday becomes exceptions only: the bounced email, the client who wants paper, the signature stuck at ID verification. Same product, same staff — the copying between systems is what disappeared.'),
  h2('Security posture for the delivery chain'),
  p('Delivery automation touches finished returns — the most sensitive artifact a firm produces — so the bar is the same as everywhere else in our ', PILLAR, ' work: the orchestration runs on infrastructure the firm controls, credentials are scoped to named service accounts, every push and status-read is logged, and nothing about a client return trains any public model. Because return information moves through an additional processor, your engagement letters and IRC §7216 consents should already contemplate it — and your FTC Safeguards Rule plan gets the vendor documentation before go-live, not after.'),
  h2('What stays human'),
  p('Deliberately out of scope: anything that is actually a client conversation. The client who always wants paper still gets paper — the system just knows that and routes accordingly instead of someone remembering. The signature stuck for a week gets a phone call from a person, flagged with context, not a fifth automated email. And no return, package or client-facing message moves without having passed the firm’s existing review gates — the automation acts on statuses your professionals set, never ahead of them. The division of labor is the same one that runs through everything we build for firms: software does the copying, checking and chasing; your people keep the judgment and the relationship. Delivery is simply the stage of the lifecycle where that division is most visible, because it is where the firm’s work product meets the client.'),
  h2('Frequently Asked Questions'),
  h3('Does this replace SafeSend?'),
  p('No — it removes the manual work around SafeSend. The product keeps doing delivery and e-signature; the automation feeds it, watches it, and reconciles its results into your other systems.'),
  h3('Can it chase clients who have not signed?'),
  p('Yes — unsigned-return follow-up on your cadence, stopping the moment the 8879 comes back, with escalation to a human for the clients who genuinely need a phone call.'),
  h3('We are mid-migration to Axcess — should we wait?'),
  p('Usually no: the orchestration layer is built against interfaces, so it can bridge the transition — often reducing the double-keying a migration temporarily creates. It is a scoping question, not a blocker.'),
  h3('What is the first step?'),
  p('Measure the manual layer: the free ', CALC, ' takes two minutes, no email, and shows what the copy-check-chase work around your delivery chain costs per season. If the number justifies it, the scoping call is 30 minutes.'),
  p('Already ran the calculator? The broader system — onboarding to delivery — is here: ', PILLAR, '. Book the call when you want it mapped to your stack.'),
];

// ============================================================
const POSTS = [
  {
    mode: 'patch', // rewrite existing — keeps slug, publishedAt, hero, equity
    id: 'post-cpa-firm-client-onboarding-automation-3-days',
    keyword: 'CPA client onboarding automation',
    set: {
      title: 'CPA Client Onboarding Automation: First Call to Signed in Days',
      metaTitle: 'CPA Client Onboarding Automation: Call to Signed in Days',
      metaDescription: 'How CPA firms compress onboarding from three weeks to days: meeting capture, engagement letters, document checklists — partners keep every decision.',
      excerpt: 'Onboarding runs on memory and inboxes at most firms. Here is the automated path — intake meeting to signed letter to complete documents — without disrupting how your staff work.',
      body: post1Body,
      keyTakeaways: [
        'CPA client onboarding typically stalls two to three weeks on hand-offs: meeting write-ups, engagement letter drafting, and document chasing.',
        'Automation compresses onboarding to days by drafting the engagement letter from the intake meeting and auto-chasing the document checklist.',
        'IRC §7216 consent and the signed engagement letter belong at onboarding — automating the path makes them unskippable.',
        'Partners keep scope, pricing and review; the system only drafts, tracks and reminds.',
        'The build runs behind Karbon, Canopy or Firm360 — staff learn nothing new.',
      ],
      author: { _ref: 'author-abhishek-walia', _type: 'reference' },
      updatedAt: '2026-07-25',
      readingTime: 8,
    },
  },
  {
    mode: 'create',
    slug: 'tax-document-collection-automation-cpa-firms',
    keyword: 'tax document collection automation for CPA firms',
    doc: {
      title: 'Tax Document Collection Automation for CPA Firms: End the Chase',
      metaTitle: 'Tax Document Collection Automation for CPA Firms',
      metaDescription: 'Small-firm guide to automating the tax document chase: prior-year checklists, self-stopping reminders, auto-filed documents — no IT department required.',
      excerpt: 'The returns are not the bottleneck — the documents are. How small CPA firms automate the checklist, the reminders and the filing without buying an enterprise platform.',
      body: post2Body,
      keyTakeaways: [
        'Document chasing is unbilled work: multiple hand-written reminders and manual tracking per client, repeated across the whole book each season.',
        'Effective collection automation generates each checklist from the prior-year return, so requests match the client’s actual filing.',
        'Reminders must stop automatically when a document arrives — chasing clients for delivered items destroys trust in the system.',
        'Portals like TaxCaddy or SafeSend Exchange transport documents; the automation layer reads, labels and files them.',
        'The FTC Safeguards Rule applies to solo firms too: any collection vendor belongs in the written security plan.',
      ],
      author: { _ref: 'author-abhishek-walia', _type: 'reference' },
      readingTime: 7,
    },
  },
  {
    mode: 'create',
    slug: 'tax-workpaper-preparation-automation',
    keyword: 'tax workpaper preparation automation',
    doc: {
      title: 'Tax Workpaper Preparation Automation: Assembly Off Your Staff',
      metaTitle: 'Tax Workpaper Preparation Automation for CPA Firms',
      metaDescription: 'Automate workpaper assembly — indexing, extraction, tie-outs, rollforward — inside CCH Axcess or UltraTax, with every value linked to its source page.',
      excerpt: 'Workpaper binders are still assembled by hand in most firms. What automation takes over, what stays human, and why it must live inside your existing stack.',
      body: post3Body,
      keyTakeaways: [
        'Workpaper assembly is mechanical — indexing, extraction, tie-outs, rollforward — and consumes senior staff who should be reviewing.',
        'Every extracted value should keep a link to its source page, turning review into verification instead of archaeology.',
        'Confidence thresholds route uncertain extractions to humans; what reaches a preparer is verified or explicitly flagged.',
        'Automation must write into CCH Axcess or UltraTax CS — a separate platform is a migration in disguise.',
        'Judgment items — elections, positions, characterization — always route to a professional with the source attached.',
      ],
      author: { _ref: 'author-abhishek-walia', _type: 'reference' },
      readingTime: 7,
    },
  },
  {
    mode: 'create',
    slug: 'ai-automation-company-for-cpa-firms',
    keyword: 'AI automation company for CPA firms',
    doc: {
      title: 'Choosing an AI Automation Company for Your CPA Firm: A Field Guide',
      metaTitle: 'AI Automation Company for CPA Firms: How to Choose',
      metaDescription: 'Seven questions that separate real builders from deck-ware: data residency, §7216, Safeguards Rule paperwork, integration, pricing and exit terms.',
      excerpt: 'Which company do you let inside a practice that runs on client tax data? The vendor landscape, the seven vetting questions, the pricing models and the red flags.',
      body: post4Body,
      keyTakeaways: [
        'The “AI for accountants” market splits into product vendors, big consultancies, generalist agencies and specialist builders — diligence differs for each.',
        'Data residency is the first vetting question: the right answer names infrastructure the firm controls, not “our secure platform.”',
        'IRC §7216 consent and FTC Safeguards Rule documentation are table stakes — a vendor unfamiliar with either has not worked with tax practices.',
        'Fixed-price scoped builds map cost to verifiable outcomes; open-ended time-and-materials moves scoping risk onto the firm.',
        'Vendors pitching staff replacement build systems staff resist; vendors pitching leverage alongside staff build systems staff defend.',
      ],
      author: { _ref: 'author-ankit-dhiman', _type: 'reference' },
      readingTime: 9,
    },
  },
  {
    mode: 'create',
    slug: 'safesend-automation-for-cpa-firms',
    keyword: 'SafeSend automation for CPA firms',
    doc: {
      title: 'SafeSend Automation for CPA Firms: Closing the Manual Gaps',
      metaTitle: 'SafeSend Automation for CPA Firms: The Manual Gaps',
      metaDescription: 'SafeSend covers delivery and e-signature — batch upload, signature chasing and reconciliation stay manual. How an orchestration layer closes the loop.',
      excerpt: 'You already bought SafeSend. The hours leak in the connective tissue around it — assembly, chasing, reconciliation. What an orchestration layer automates.',
      body: post5Body,
      keyTakeaways: [
        'SafeSend automates delivery and Form 8879 e-signature; the manual work survives upstream (batch assembly, upload) and downstream (chasing, reconciliation).',
        'An orchestration layer is plumbing between SafeSend, the tax software and practice management — not a sixth platform with its own login.',
        'Unsigned-return follow-up should run on the firm’s cadence and stop the moment the 8879 returns.',
        'Organizer responses and exchanged documents need reading and filing — transport tools do not interpret content.',
        'Finished returns moving through any processor belong in §7216 consents and the Safeguards Rule plan before go-live.',
      ],
      author: { _ref: 'author-ankit-dhiman', _type: 'reference' },
      readingTime: 7,
    },
  },
];

// ---------- validate + publish ----------
for (const post of POSTS) {
  const body = post.mode === 'patch' ? post.set.body : post.doc.body;
  const title = post.mode === 'patch' ? post.set.title : post.doc.title;
  const wc = wordCount(body);
  const mt = post.mode === 'patch' ? post.set.metaTitle : post.doc.metaTitle;
  const md = post.mode === 'patch' ? post.set.metaDescription : post.doc.metaDescription;
  console.log(`\n=== [${post.mode}] ${post.slug || post.id}`);
  console.log(`    keyword: ${post.keyword}`);
  console.log(`    title ${title.length}ch | metaTitle ${mt.length}ch | metaDesc ${md.length}ch | ~${wc} words | ${body.filter(b => b.style === 'h2').length} H2s, ${body.filter(b => b.style === 'h3').length} H3s`);
  if (title.length > 70) console.log('    ⚠ title long');
  if (md.length > 160) console.log('    ⚠ metaDesc long');
  if (wc < 1100) console.log('    ⚠ short');
}

if (FIX) {
  for (const post of POSTS) {
    if (post.mode === 'patch') {
      await c.patch(post.id).set(post.set).commit();
      console.log(`✓ patched ${post.id}`);
    } else {
      const doc = {
        _id: `post-${post.slug}`,
        _type: 'post',
        slug: { _type: 'slug', current: post.slug },
        category: 'Blog',
        featured: false,
        publishedAt: '2026-07-25T12:00:00.000Z',
        ...post.doc,
      };
      await c.createOrReplace(doc);
      console.log(`✓ created post-${post.slug}`);
    }
  }
  console.log('\nDONE — 5 posts live in Sanity.');
} else {
  console.log('\nDRY RUN — FIX=1 to publish.');
}
