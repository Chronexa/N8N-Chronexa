import type { ServiceContent, SolutionCard } from './services-content';

/**
 * The twelve services, rebuilt 2026-08 against demand research (docs/seo/).
 *
 * Writing rules, taken from the blog doctrine and enforced here because the old
 * pages failed on exactly these points:
 *  - No OCR / LLM / RAG / pipeline / schema / endpoint in prose. The buyer is a
 *    partner or an operations lead, not an engineer.
 *  - Open in the buyer's own words, describing their actual Tuesday.
 *  - No em dashes. No invented numbers, clients or percentages.
 *  - A metric appears ONLY where it traces to an audited engagement
 *    (sprint/04-proof-audit.md). Everywhere else the proof block carries a
 *    mechanism description instead, which is honest and still useful.
 *  - "Alongside the team, never replacing it" throughout.
 *
 * Slugs are flat and keyword-first (decision D-003). getService() checks this
 * file before the legacy SERVICES array.
 */

/** Applies to every engagement. States shape, never a price. */
const ENGAGEMENT =
  "Scope, timeline and price are agreed after a short call, never before. We write down what the system has to do, and what it costs, before any build starts.";

/** The four control answers every buyer asks, tuned per page where it matters. */
const OWNERSHIP = {
  title: "You own it when we leave",
  body: "It is built inside your own accounts and your own cloud. If you never speak to us again it keeps running, and another team could pick it up. You are not renting your own process back from us.",
};

export const SERVICES_V2: ServiceContent[] = [
  /* ══════════════════════════════════════════════════════════════════════
     1. AI AUTOMATION  —  the umbrella page
     Keyword: "ai automation agency" (5,260/mo US+UK, page-1 site at 77 refs)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'ai-automation',
    heroBg: '/images/hero/ai-automation.webp',
    metaTitle: 'AI Automation Agency for Mid-Sized Firms | Chronexa',
    metaDescription:
      "Most AI projects stall between the demo and the day job. See how we pick one process, prove it on your real data, and hand back a system your team owns.",
    h1: "AI automation, judged on whether the work actually got easier",
    heroSub:
      "We take one process your team runs by hand every week, work out where it actually breaks, and build the system that runs it. Your people keep the judgement. The system takes the repetition.",
    answer:
      "An AI automation agency designs and builds the systems that carry work between the software a business already runs. The useful version is narrow: one process, one clear outcome, connected to the tools already in use, with a person reviewing anything the system is unsure about. The work is mostly plumbing and judgement rather than models, which is why picking the right process matters more than picking the right technology.",
    callout:
      "The failed AI project almost never fails on the technology. It fails because nobody agreed what success looked like, or because it was built beside the real process instead of inside it, so people carried on doing it the old way.",
    serviceName: 'AI Automation',
    serviceType: 'AI automation and workflow engineering',
    schemaDescription:
      "AI automation services for mid-sized businesses: process selection, build, integration with existing systems, human review on exceptions, and handover into accounts the client owns.",
    roi: [
      { value: 'One process', label: 'We start with one, not a transformation programme' },
      { value: 'Your systems', label: 'Built into the software your team already opens' },
      { value: 'You own it', label: 'Your accounts, your cloud, no lock-in to us' },
    ],
    buildHeading: 'What we actually do',
    sections: [
      {
        heading: "Everyone has an AI pilot. Almost nobody has an AI process",
        level: 2,
        body: [
          "The pattern repeats. Someone runs a trial, it demos well, a slide gets shown to the board, and six months later the team is still doing the work the way they always did. The pilot was never wired into anything. It sat beside the process instead of inside it.",
          "The version that sticks is much less exciting. You pick one job that happens every week, that follows roughly the same steps each time, and that somebody currently does by hand. You build that one properly, into the systems people already have open. Then you do the next one.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Picking the wrong thing',
        title: "The process chosen is the interesting one, not the expensive one",
        body: "The one that gets picked is usually the one that sounds impressive in a meeting. The one worth doing is the dull, high-volume job that three people spend two days a week on and nobody wants to talk about.",
      },
      {
        label: 'Building beside the work',
        title: "The system lives somewhere the team never goes",
        body: "A new dashboard, a new login, a new tab nobody opens. If the output does not land in the place people already work, they will keep doing it the old way and be right to.",
      },
      {
        label: 'No agreed finish line',
        title: "Nobody wrote down what working means",
        body: "Without a number agreed at the start, the project is judged on impressions. It gets called a success or a failure depending on who is in the room, and either way nobody learns anything.",
      },
      {
        label: 'The handover that never happens',
        title: "It runs until the person who understood it leaves",
        body: "Built in an agency account, undocumented, with one contractor holding the whole thing in their head. The moment they move on, it becomes a risk instead of an asset.",
      },
    ],
    beforeAfter: [
      { before: "A pilot that demos well and never reaches the team.",
        after: "One process running inside the tools your team already uses." },
      { before: "Success is decided by opinion at the end.",
        after: "The number that counts as working is agreed in writing at the start." },
      { before: "The build sits in someone else's account.",
        after: "It sits in yours, documented, and runs without us." },
      { before: "Growth means another hire.",
        after: "Growth means more volume through the same process." },
    ],
    process: [
      { title: "We look at the week, not the wish list", body: "A short session on where the hours actually go. Usually the answer is not the process anyone expected, which is the point of looking." },
      { title: "We agree what working means", body: "One process, one measurable outcome, written down. If we cannot express it as a number you would recognise, it is not ready to build." },
      { title: "We build it where the work happens", body: "Into your existing systems, so the output turns up where your team is already looking. No new screen to learn." },
      { title: "We run it beside your team, then hand it over", body: "A period in parallel with the manual process to see where they disagree, then documentation, a handover call and your accounts holding the keys." },
    ],
    whyCustom: [
      "Built around the process you actually run, not the one the software assumes.",
      "Connected to the systems you already pay for, so nothing needs replacing.",
      "A person reviews anything the system is unsure about, so it never quietly guesses.",
      "Documented and handed to you, so it survives whoever built it.",
    ],
    included: [
      "A working session on where the hours go and which process to take first",
      "A written definition of the outcome, agreed before the build",
      "The build itself, inside the systems you already run",
      "A review step for anything the system is unsure about",
      "Written documentation and a handover call",
      "Thirty days of support after go-live",
    ],
    confidence: [
      { title: "One process at a time", body: "We would rather finish one thing than start four. A second process is a second piece of work, and saying that out loud is what keeps the first one honest." },
      { title: "Nothing decides on its own", body: "Anything the system is not confident about stops and waits for one of your people. Automation without a review step is how firms lose trust in their own records." },
      { title: "Your environment if you want it", body: "It can run entirely inside systems you control, so nothing has to leave. Access is limited to people you name and there is a record of what ran and when." },
      OWNERSHIP,
    ],
    notIncluded: [
      "A transformation programme. We do one process well and then talk about the next one.",
      "Replacing software you already run. We connect to it.",
      "Headcount reduction plans. That is not what these systems are for and not what we sell.",
      "Any promise about accuracy or savings made before we have seen your real data.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "How is this different from hiring a consultancy?", a: "A consultancy usually hands you a recommendation. We hand you a running system inside your own accounts, plus the documentation to keep it going. The deliverable is the thing working, not the deck about the thing." },
      { q: "We do not know which process to automate. Is that a problem?", a: "It is the normal starting point and it is the part we are useful for. Most firms pick the interesting process rather than the expensive one. A session looking at where the hours actually go usually surfaces something nobody had on the list." },
      { q: "Will this replace people on our team?", a: "Not in the engagements we take. What goes away is the reading, the keying, the chasing and the checking. What is left is judgement and the client relationship, which is the work those people were hired for and are better at." },
      { q: "What if it does not work?", a: "We agree what working means in writing before the build, on your data. If it does not clear that bar, it has not been delivered. That is why the definition comes first rather than at the end." },
      { q: "Do we need technical people on our side?", a: "You need someone who knows how the process currently works and can answer questions about the edge cases. You do not need anyone technical. We handle the building and hand it over documented." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['business-process-automation-consulting', 'document-processing-automation', 'system-data-integration'],
    stack: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'airtable.svg', name: 'Airtable' },
      { file: 'slack.svg', name: 'Slack' },
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      metric: {
        value: '1,200+',
        label: "reports a year produced automatically, from photographs and PDFs that used to be read by hand",
        source: "US property-services firm, in production. Roughly 85% less time per report.",
      },
      mechanism:
        "That build is the shape most of our work takes. Something arrives that a person used to read, the system works out what it is and what matters in it, checks itself, and writes the result into the software the team already uses. Anything it is unsure about waits for a person.",
      caseStudy: { slug: 'how-reservestudy-automated-report-production-with-ai', label: 'Read how a property-services firm automated report production' },
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     2. BUSINESS PROCESS AUTOMATION CONSULTING
     Keyword: "business process automation consultant" (170/mo, KD 0)
     The most reachable term found: 3 page-one slots under 150 refs.
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'business-process-automation-consulting',
    heroBg: '/images/hero/business-process-automation-consulting.webp',
    metaTitle: 'Business Process Automation Consultant | Chronexa',
    metaDescription:
      "Find the three steps costing you the most hours before you automate anything. See how we map the real process, price the waste, and build only what pays back.",
    h1: "Business process automation consulting that starts with your actual week",
    heroSub:
      "Before anything gets built, we map how the work really runs, put a cost against each manual step, and tell you which ones are worth automating. Sometimes the answer is fewer than you hoped.",
    answer:
      "Business process automation consulting means mapping how work actually moves through a business, finding the steps where people are moving information by hand, and deciding which of those are worth automating. The mapping matters more than the tooling: most firms already own the software they need, and the problem is the gaps between systems where a person is acting as the bridge.",
    callout:
      "The written process and the real process are never the same document. The real one lives in somebody's head, has four workarounds in it, and is the reason the last automation attempt did not survive contact with a Monday.",
    serviceName: 'Business Process Automation Consulting',
    serviceType: 'Process mapping and automation consulting',
    schemaDescription:
      "Business process automation consulting: mapping the real process, costing each manual step, prioritising by payback, and building only the steps that justify it.",
    roi: [
      { value: 'The real process', label: 'Mapped as it runs, not as it was written down' },
      { value: 'Costed by step', label: 'Hours and money against each manual handoff' },
      { value: 'Build what pays', label: 'We will tell you when the answer is not to automate' },
    ],
    buildHeading: 'What the mapping gives you',
    sections: [
      {
        heading: "The process on the wall chart is not the process",
        level: 2,
        body: [
          "Every business has a documented process and a real one. The documented one has six steps. The real one has eleven, three of which exist because a system does not talk to another system, and one of which is a spreadsheet somebody maintains at home on Sunday evening.",
          "Automating the documented process is how projects fail. You end up with a tidy system running beside the messy reality, and the messy reality wins because it is the one that handles the exceptions.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'The invisible middle',
        title: "Nobody owns the gap between two systems",
        body: "Sales owns the CRM. Finance owns the accounting software. The part where information crosses from one to the other is owned by whoever happens to be doing it, and it is almost never written down anywhere.",
      },
      {
        label: 'Workarounds as infrastructure',
        title: "A spreadsheet is holding up a department",
        body: "It started as a temporary fix. It now has forty tabs, one author, and a load-bearing role in the month-end close. Everyone knows it is a risk and nobody has time to replace it.",
      },
      {
        label: 'Exception handling by memory',
        title: "The rules only exist in one person's head",
        body: "What happens when the amount is over a threshold, or the client is in a different country, or the paperwork is missing a page. The answer is real and consistent, but it has never been written down, so it cannot be handed over or automated.",
      },
      {
        label: 'Measuring the wrong end',
        title: "The reporting shows outputs, not effort",
        body: "You can see how many invoices were processed. You cannot see that two of them took eleven minutes and one took two hours. Without that, the expensive steps stay invisible.",
      },
    ],
    beforeAfter: [
      { before: "The process exists in three people's heads and one spreadsheet.",
        after: "It is written down, costed, and the expensive steps are visible." },
      { before: "Automation candidates are chosen by who asks loudest.",
        after: "They are ranked by hours saved against effort to build." },
      { before: "Exceptions are handled from memory.",
        after: "The rules are written down, so they can be handed over or built." },
      { before: "You find out a project was not worth it after building it.",
        after: "You find out before, on paper, for a fraction of the cost." },
    ],
    process: [
      { title: "We sit with the people who do the work", body: "Not the managers describing it. The people whose Tuesday it is. That is where the workarounds live and the workarounds are the interesting part." },
      { title: "We map it as it actually runs", body: "Every handoff, every copy and paste, every point where somebody waits for somebody else. Including the parts nobody is proud of." },
      { title: "We put a number against each step", body: "How often it happens, how long it takes, what it costs when it goes wrong. This is what turns an opinion about priorities into an argument you can settle." },
      { title: "You get a ranked list and an honest recommendation", body: "Including which steps are not worth automating. Some are too rare, some are too varied, and some just need a rule change rather than a system." },
    ],
    whyCustom: [
      "We map the process people actually follow, including the workarounds.",
      "Every step gets a cost, so priorities stop being a matter of opinion.",
      "The output is a decision document you own, whether or not you build anything with us.",
      "We say so when automation is the wrong answer, which is more often than most agencies admit.",
    ],
    included: [
      "Working sessions with the people who run the process day to day",
      "A map of the process as it actually runs, workarounds included",
      "A cost against each manual step: frequency, time, error rate",
      "A ranked list of what to automate, with expected payback",
      "An honest note on what should not be automated, and why",
      "A written recommendation you keep regardless of what you build next",
    ],
    confidence: [
      { title: "The map is yours either way", body: "The output of the mapping is a document you own. If you take it to another firm to build, or build it in-house, that is a legitimate outcome and we would rather you had a good map than a bad build." },
      { title: "We will talk you out of things", body: "Plenty of steps are not worth automating: too rare, too varied, or fixable with a rule change instead. Saying so costs us work and saves you money, which is the only way this stays useful." },
      { title: "Nothing changes without you", body: "Mapping is observation. We do not touch a live system during this stage, so there is no risk to anything currently running." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Building anything. This stage produces the decision, not the system.",
      "Software licences or a recommendation to buy a specific product.",
      "Headcount analysis or restructuring advice.",
      "A guarantee that automation will be the right answer for every step we look at.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Why not go straight to building?", a: "Because the most common reason automation projects fail is that the wrong process got picked. Mapping first is cheap relative to a build, and it regularly changes which process goes first. It also occasionally shows that the answer is a rule change rather than a system." },
      { q: "How long does the mapping take?", a: "It depends on how many people touch the process and how many exceptions there are. A single process inside one department is quick. Anything crossing three departments takes longer because the interesting parts are in the gaps." },
      { q: "Do we have to build with you afterwards?", a: "No. The map is a document you own and plenty of clients take it in-house. We would rather be the firm that gave you a clear picture than the one that talked you into a build you did not need." },
      { q: "Our team is busy. How much of their time does this take?", a: "A few short sessions with the people who actually run the process, plus some observation. We work around the calendar rather than pulling people into workshops for whole days." },
      { q: "What if we already know what we want automated?", a: "Then we will say so quickly and get on with it. But it is worth an hour to check, because the step that annoys people most and the step that costs most are often different steps." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the work covers and what it costs, before it starts." },
    ],
    related: ['ai-automation', 'system-data-integration', 'document-processing-automation'],
    stack: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'airtable.svg', name: 'Airtable' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'slack.svg', name: 'Slack' },
      { file: 'jira.svg', name: 'Jira' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "Every engagement we have delivered started this way, whether or not it was called a mapping exercise. The document work at a US property-services firm, the invoice backlog at a fintech, the data room review at a private equity firm: in each case the build was the easy half. The half that decided the outcome was working out which step was actually costing the money.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     3. AI SALES & OUTREACH ENGINE
     Keyword: "ai voice agent" (6,990/mo, page-1 site at 51 refs) + "ai sdr"
     Proof note: built and delivered for clients, but no client outcome numbers
     are available (Ankit, 2026-08-17). Mechanism only. Do NOT add a metric.
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'ai-sales-outreach-engine',
    heroBg: '/images/hero/ai-sales-outreach-engine.webp',
    metaTitle: 'AI Voice Agents and Outreach Systems for B2B | Chronexa',
    metaDescription:
      "Leads go cold in the gap between the form and the follow-up. See how we build the research, email and voice layer that answers in minutes, on your own tools.",
    h1: "AI voice agents and outreach that answer before the lead goes cold",
    heroSub:
      "We build the layer between a new lead and a real conversation: finding who they are, working out whether they matter, and getting a useful first response out while the interest is still warm.",
    answer:
      "An AI sales engine is the set of systems that carry a lead from first contact to a booked conversation without a person doing the repetitive parts. In practice that means gathering background on the company automatically, deciding whether the lead fits, writing a first response that refers to something specific, and following up on a schedule. Voice agents handle the calls that would otherwise never get made, and a person takes over the moment the conversation becomes real.",
    callout:
      "Almost nobody loses deals because their pitch was wrong. They lose them because the form came in on Thursday afternoon and somebody got to it on Monday, by which point the buyer had already spoken to two other firms.",
    serviceName: 'AI Sales & Outreach Engine',
    serviceType: 'Sales automation, lead research and voice agents',
    schemaDescription:
      "AI sales and outreach systems: automated lead research and qualification, first-response drafting, follow-up sequencing, and voice agents, connected to the client CRM.",
    roi: [
      { value: 'Minutes', label: 'Time from enquiry to a useful first reply' },
      { value: 'Your CRM', label: 'Built on the tools your team already works in' },
      { value: 'Human close', label: 'People take the conversation the moment it is real' },
    ],
    buildHeading: 'What the engine handles',
    sections: [
      {
        heading: "The lead was fine. The gap killed it",
        level: 2,
        body: [
          "Someone fills in a form at four o'clock on a Thursday. The notification lands in a shared inbox. On Monday a rep opens it, spends fifteen minutes working out who the company is, and sends a note that could have been sent to anyone. By then the buyer has spoken to two competitors and formed a view.",
          "None of that is a skills problem. It is a gap problem. The work of finding out who someone is and writing them something specific is exactly the work that does not need a person, and the conversation that follows is exactly the work that does.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'The weekend hole',
        title: "Half your enquiries land when nobody is looking",
        body: "Evenings, weekends, the day everyone is at an offsite. The enquiry sits in an inbox getting colder while the person who sent it carries on shopping around.",
      },
      {
        label: 'Research before contact',
        title: "Fifteen minutes of looking things up before a single sentence gets written",
        body: "What does this company do, how big are they, who is this person, have we spoken before. All of it is available and all of it is being gathered by hand, one browser tab at a time.",
      },
      {
        label: 'The follow-up nobody does',
        title: "The second, third and fourth touches quietly stop happening",
        body: "Everyone agrees follow-up matters. Under pressure it is the first thing dropped, because it feels less urgent than the deal that is already live. So the pipeline leaks from the middle.",
      },
      {
        label: 'Calls that never get made',
        title: "The list of people worth ringing is longer than the day",
        body: "There is always a set of leads where a short call would settle it, and always more of them than there are hours. So they get emailed instead, or nothing.",
      },
    ],
    beforeAfter: [
      { before: "An enquiry waits in an inbox until someone opens it.",
        after: "A useful, specific reply goes out while the interest is still warm." },
      { before: "A rep spends fifteen minutes researching before writing.",
        after: "The background is already gathered and attached to the record." },
      { before: "Follow-up happens when someone remembers.",
        after: "Follow-up happens on a schedule, and stops the moment a human replies." },
      { before: "Only the loudest leads get called.",
        after: "The ones worth calling get called, and the rest get a note." },
    ],
    process: [
      { title: "We work out what a good lead looks like for you", body: "Not a generic scoring model. The actual signals your team uses when they decide a lead is worth the time, written down properly for the first time." },
      { title: "We build the research and routing layer", body: "Background gathered automatically, the record created in your CRM, and the lead in front of the right person with the context already attached." },
      { title: "We draft the first response and the follow-ups", body: "Written to refer to something specific about that company. Your team approves the pattern once, and reviews the edge cases from then on." },
      { title: "We add voice where it earns its place", body: "For the calls that would not otherwise get made. It books the conversation and hands to a person the moment it becomes a real discussion." },
    ],
    whyCustom: [
      "Built on the CRM and mailbox you already run, not another platform to log into.",
      "Qualification uses your signals, not a generic score borrowed from someone else's funnel.",
      "A person takes over the moment a conversation becomes real, which is the point at which people are better.",
      "You own the accounts, the data and the sequences.",
    ],
    included: [
      "A written definition of what makes a lead worth pursuing for you",
      "Automatic background research attached to each new lead",
      "Routing into your CRM with the context already on the record",
      "First-response drafting and a follow-up schedule",
      "A voice agent for the calls that would not otherwise be made, where it fits",
      "A review step so your team approves the pattern before it runs at volume",
    ],
    confidence: [
      { title: "It stops the moment a person replies", body: "Any sequence halts as soon as there is a human response. Nothing keeps sending into a live conversation, which is the failure that damages a brand fastest." },
      { title: "Your team approves the pattern", body: "Nothing goes out at volume until someone on your side has read what it says and how it says it. After that, the exceptions come back for review rather than the whole flow." },
      { title: "Deliverability is treated as a build problem", body: "Sending infrastructure, warm-up and volume limits are part of the work rather than an afterthought. Getting this wrong is how firms burn a domain they cannot get back." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Buying you a contact list. We work with data you have the right to use.",
      "High-volume cold email at any cost. Volume without deliverability is how a domain gets burned.",
      "Writing your positioning. We can only automate a message once you know what it is.",
      "A promise about reply rates. Anyone quoting one before seeing your market is guessing.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Will this make our outreach sound automated?", a: "It will if it is built badly. The reason most automated outreach reads as automated is that it has nothing specific in it. The research step exists so the first line refers to something true about that company, and your team signs off on the pattern before it runs." },
      { q: "Do the voice agents pretend to be human?", a: "No, and we would not build one that did. It introduces itself for what it is, handles the part of the call that is scheduling and qualification, and hands to a person the moment the conversation becomes a real discussion." },
      { q: "We already have a CRM. Does this replace it?", a: "No. It works inside it. The whole point is that the record your team already opens is the one that gets the context attached, rather than adding another system for people to check." },
      { q: "What about deliverability and our domain reputation?", a: "It is part of the build rather than an afterthought. Sending infrastructure, warm-up and volume limits get set up properly, because a burned domain is expensive and slow to recover from." },
      { q: "Can this work for a long, relationship-led sale?", a: "The research, routing and follow-up parts, yes. The conversation itself should stay human in that kind of sale, and we would push back on anyone trying to automate it." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['crm-automation-services', 'ai-automation', 'ai-agent-development'],
    stack: [
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'apollo.png', name: 'Apollo' },
      { file: 'elevenlabs.svg', name: 'ElevenLabs' },
      { file: 'twilio.png', name: 'Twilio' },
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'slack.svg', name: 'Slack' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "We have built and handed over this system for clients, and we run a version of it ourselves. What we cannot give you is their results: once a system is deployed into a client's own accounts, their pipeline numbers are theirs and we do not see them. We would rather say that plainly than show you a number we cannot stand behind.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     4. CRM AUTOMATION
     Keyword: "crm consultant" (860/mo, KD 1) + "crm developer" ($190 CPC)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'crm-automation-services',
    heroBg: '/images/hero/crm-automation-services.webp',
    metaTitle: 'CRM Automation and Implementation Services | Chronexa',
    metaDescription:
      "A CRM nobody updates is an expensive address book. See how we build the intake, routing and reporting that keeps records current without anyone typing them.",
    h1: "CRM automation for teams whose CRM has quietly stopped being true",
    heroSub:
      "We build the parts that keep a CRM current on its own: records created from real activity, work routed to the right person, and reporting that reflects what is actually happening.",
    answer:
      "CRM automation means the records update from the work itself rather than from someone remembering to type them in. Contacts and deals get created from incoming enquiries and email, activity is logged automatically, follow-ups are triggered by what did or did not happen, and reporting reads from records that are current. The measure of success is simple: whether the team trusts what the CRM says without checking somewhere else first.",
    callout:
      "You can tell a CRM has stopped being true when people start keeping a private spreadsheet of what is really going on. At that point you are paying for the system twice and only one of the copies is right.",
    serviceName: 'CRM Automation & Implementation',
    serviceType: 'CRM implementation, automation and integration',
    schemaDescription:
      "CRM automation and implementation: record creation from real activity, routing, follow-up triggers, integration with finance and support systems, and reporting from current data.",
    roi: [
      { value: 'Current records', label: 'Updated from the work, not from memory' },
      { value: 'One version', label: 'No private spreadsheets running alongside' },
      { value: 'Your platform', label: 'HubSpot, Airtable, or something we build for you' },
    ],
    buildHeading: 'What we build into the CRM',
    sections: [
      {
        heading: "The CRM is only as good as the least diligent person using it",
        level: 2,
        body: [
          "It gets bought with the best intentions. For a month everyone updates it. Then a busy week arrives, a few records go stale, and the reporting stops matching reality. Once people notice the numbers are wrong they stop trusting the numbers, and once they stop trusting the numbers they stop maintaining them. It only goes one way from there.",
          "The fix is not training or nagging. It is removing the manual updating as a requirement, so the record reflects what happened whether or not anyone remembered to type it.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Data entry as discipline',
        title: "Keeping it current depends on people being conscientious under pressure",
        body: "Any system that only works when everybody is diligent will fail in the first busy month. The updating has to happen as a by-product of the work, not as a separate task competing with it.",
      },
      {
        label: 'The private spreadsheet',
        title: "The real pipeline lives somewhere else",
        body: "Once someone builds their own version because the official one is wrong, you have two sources of truth and no way to reconcile them. The forecast comes from the wrong one.",
      },
      {
        label: 'Islands',
        title: "The CRM does not know what finance or support knows",
        body: "The account is overdue on an invoice, or has three open complaints, and the person about to call them has no idea. The information exists in the business. It just does not exist in the same place.",
      },
      {
        label: 'Reporting archaeology',
        title: "The monthly numbers take two days to assemble",
        body: "Exports, spreadsheets, manual reconciliation, someone chasing three people for updates before the meeting. By the time the report is ready it is describing a situation that has moved on.",
      },
    ],
    beforeAfter: [
      { before: "Records are current only if everyone remembers to update them.",
        after: "Records update from the enquiry, the email and the meeting themselves." },
      { before: "The real pipeline lives in someone's spreadsheet.",
        after: "There is one version, and people trust it enough to stop keeping their own." },
      { before: "Sales calls an account that finance has flagged.",
        after: "The flag is on the record before the call is made." },
      { before: "Reporting takes two days and describes last week.",
        after: "Reporting reads from current records and takes no assembly." },
    ],
    process: [
      { title: "We work out where records actually come from", body: "Enquiries, inbound email, forms, calls, referrals. Each one is a place a record could be created automatically instead of typed." },
      { title: "We choose the platform honestly", body: "If HubSpot fits, use HubSpot. If the process is unusual enough that off-the-shelf will fight you, a custom build on something like Airtable is often cheaper and better. We will tell you which." },
      { title: "We connect the systems that hold the rest of the truth", body: "Accounting, support, delivery. The account record should know what the business knows about that account." },
      { title: "We build the reporting last", body: "Because a report is only worth building once the underlying records are reliable. Doing it in this order is what stops you automating a wrong number." },
    ],
    whyCustom: [
      "Records created from real activity, so being current does not depend on discipline.",
      "The platform is chosen to fit your process, not the other way round.",
      "Connected to finance and support, so one record holds what the business knows.",
      "Built in your own accounts, exportable, with no lock-in to us.",
    ],
    included: [
      "A map of where records should be created automatically",
      "An honest platform recommendation, including when off-the-shelf is the wrong fit",
      "Automatic record creation, routing and activity logging",
      "Connections to the finance and support systems that hold the rest of the picture",
      "Reporting built on records that are actually current",
      "Written documentation and a handover call",
    ],
    confidence: [
      { title: "We migrate carefully or not at all", body: "Moving CRM data is where these projects go wrong. Nothing is switched over until a full copy has been taken and the new records have been checked against the old ones." },
      { title: "Automation does not overwrite judgement", body: "Where a person has made a deliberate change to a record, the system does not quietly reverse it. Conflicts surface for review rather than being resolved silently in the background." },
      { title: "Your data stays exportable", body: "Whatever we build, you can get everything out in a usable format. A system you cannot leave is a system that can charge you anything later." },
      OWNERSHIP,
    ],
    notIncluded: [
      "CRM licences. Those stay in your name and on your account, which is the point.",
      "Sales methodology or training. We build the system, you run the process.",
      "Cleaning historic data beyond an agreed scope. Twelve years of duplicates is its own project.",
      "Migrating more than one source system per engagement without agreeing it first.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "We already have HubSpot. Do we need to move?", a: "Almost certainly not. Most of what makes a CRM feel broken is the missing connective work around it, not the platform. We would look at what is not being captured automatically before suggesting you change anything." },
      { q: "When is a custom CRM actually the right answer?", a: "When your process is genuinely unusual and you find yourself fighting the software's assumptions every week, or when the per-seat cost across a large team stops making sense for what you use. For most firms the honest answer is to keep what they have." },
      { q: "Our CRM data is a mess. Where does that leave us?", a: "It is the normal starting point. We agree a scope for cleaning: usually duplicates, dead records and the fields that actually get used. Cleaning everything back to the beginning is rarely worth it and we will say so." },
      { q: "Will the team have to change how they work?", a: "As little as possible, and that is deliberate. The changes that survive are the ones that remove a step. Anything that adds one gets quietly abandoned within a month." },
      { q: "Can it connect to our accounting system?", a: "Usually yes, and it is often the highest-value part of the job. Knowing that an account is overdue before you call them changes the conversation, and that information already exists in the business." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['ai-sales-outreach-engine', 'system-data-integration', 'ai-automation'],
    /* Actual CRMs first. This strip used to run HubSpot, Airtable, Notion,
       Slack, Gmail, Stripe — four of which are not CRMs and none of which are
       the two a mid-market buyer is most likely to be running. To a CRM buyer
       that reads as "they have done one CRM". */
    stack: [
      { file: 'salesforce.svg', name: 'Salesforce' },
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'zoho.svg', name: 'Zoho' },
      { file: 'airtable.svg', name: 'Airtable' },
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'slack.svg', name: 'Slack' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "We have built these both ways: automation layered onto a CRM a client already ran, and a custom system built on Airtable where the process was unusual enough that off-the-shelf would have fought them every week. The judgement about which of those a business needs is most of the value, and it is the part we would want to talk through before quoting anything.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     5. ACCOUNTS PAYABLE & FINANCE AUTOMATION
     Keyword: "automate accounts payable" (1,600/mo, $191 CPC)
     Proof: the fintech invoice-ingestion build is audited USABLE (80% less
     manual handling, unnamed client). Metric allowed, client not named.
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'accounts-payable-automation',
    heroBg: '/images/hero/accounts-payable-automation.webp',
    metaTitle: 'Accounts Payable Automation for Finance Teams | Chronexa',
    metaDescription:
      "Invoices arrive by email and leave by hand. See how we build the intake, matching and approval routing that clears the backlog without another hire.",
    h1: "Accounts payable automation for finance teams still keying invoices",
    heroSub:
      "Invoices arrive from everywhere, get read by a person, typed into your accounting system, and chased around for approval. We build the system that does the reading, the matching and the chasing.",
    answer:
      "Accounts payable automation replaces the manual handling of supplier invoices. Invoices are collected from wherever they arrive, read, checked against the purchase order or contract, and routed for approval based on rules you set. Anything that does not match, or falls outside the rules, stops and waits for a person. The result is that the finance team reviews exceptions rather than typing every line.",
    callout:
      "The cost of manual accounts payable is rarely the typing. It is the late payment charges, the duplicate that got paid twice, and the supplier who now asks for money up front because the last three invoices went missing.",
    serviceName: 'Accounts Payable & Finance Automation',
    serviceType: 'Accounts payable and finance process automation',
    schemaDescription:
      "Accounts payable automation: invoice collection from email and portals, reading and matching against purchase orders, approval routing by rule, and posting into the accounting system.",
    roi: [
      { value: '80%', label: 'Less manual invoice handling on a fintech build' },
      { value: 'Days to hours', label: 'Invoice received to approved, on that engagement' },
      { value: 'Exceptions only', label: 'The team reviews what does not match, not everything' },
    ],
    buildHeading: 'What the system takes over',
    sections: [
      {
        heading: "Everything about paying a supplier is fine except the middle",
        level: 2,
        body: [
          "The invoice arrives. Somebody opens it, works out which supplier and which project, checks whether it matches what was ordered, types it into the accounting system, and then starts asking around for an approval. That last part alone can take a week, most of which is somebody waiting for somebody else to open an email.",
          "None of those steps needs judgement most of the time. Judgement is needed when something does not match, and that is a small fraction of the post. The rest is routing.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Invoices arrive from everywhere',
        title: "Email, portals, post, and a photograph from someone on site",
        body: "There is no single inbox. Before anything can be processed, somebody has to gather them from four places, and the one that gets missed is the one that turns into a late payment charge.",
      },
      {
        label: 'Matching by eye',
        title: "Checking the invoice against what was actually ordered",
        body: "Line by line, against a purchase order in another system, or against a contract nobody can find. It is slow, and it is where the duplicate payments slip through.",
      },
      {
        label: 'Approval by pestering',
        title: "The invoice sits in someone's inbox for a week",
        body: "Forwarded, forgotten, chased, forwarded again. The approver is not being difficult, they are just busy, and nothing in the process makes this the thing they open first.",
      },
      {
        label: 'The month-end scramble',
        title: "Everything that was deferred arrives at once",
        body: "The queue that was manageable on the fifteenth is a crisis on the thirtieth, and the accruals get estimated because there is no time to process properly.",
      },
    ],
    beforeAfter: [
      { before: "Invoices are gathered by hand from four different places.",
        after: "They are collected automatically, wherever they arrive." },
      { before: "Someone checks each one against the order, line by line.",
        after: "Matches are confirmed automatically, mismatches stop for review." },
      { before: "Approval takes a week of chasing.",
        after: "It routes by rule and escalates on its own if it stalls." },
      { before: "Month end is a scramble and accruals get estimated.",
        after: "The queue stays flat, so month end looks like every other week." },
    ],
    process: [
      { title: "We take a month of your real invoices", body: "Including the awkward ones. The supplier who sends a photograph, the one whose layout changed, the credit notes. Those decide whether this works." },
      { title: "We show you what came back, line by line", body: "A written report on what was read correctly and what was not, before anything is built. That report becomes the standard the work is measured against." },
      { title: "We build the matching and the rules", body: "What counts as a match, what tolerance is acceptable, who approves what and at what value. Your rules, written down and applied consistently." },
      { title: "We run it in parallel before it touches the ledger", body: "Your team keeps processing normally while the system runs alongside. Nothing posts for real until the two agree." },
    ],
    whyCustom: [
      "Built around your suppliers and their formats, not a template expecting tidy inputs.",
      "Approval rules match your delegation of authority, including the exceptions.",
      "Posts into the accounting system you already run rather than replacing it.",
      "Anything that does not match stops and waits for a person.",
    ],
    included: [
      "A written accuracy report on a month of your real invoices, before any build",
      "Automatic collection from email, portals and shared folders",
      "Matching against purchase orders or contracts",
      "Approval routing by your own rules, with escalation when something stalls",
      "Posting into your accounting system, with a record of everything handled",
      "A parallel run before anything posts for real",
    ],
    confidence: [
      { title: "Nothing posts without passing your rules", body: "The system does not decide to pay anything. It prepares, matches and routes. The approval is a person's, and the audit record shows who approved what and when." },
      { title: "Duplicates are caught before they are paid, not after", body: "Checking against what has already been processed is part of the flow rather than something discovered at reconciliation. This is usually where the cost of the old process was hiding." },
      { title: "A parallel run before it goes anywhere near the ledger", body: "Your team keeps working normally while the system runs alongside, and we compare. Nothing posts for real until the two agree consistently." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Making payments. The system prepares and routes; releasing money stays with your team and your bank.",
      "Replacing your accounting software. We post into what you already run.",
      "More than one accounting system per engagement without agreeing it first.",
      "Any accuracy figure quoted before we have seen a month of your real invoices.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Will it pay invoices automatically?", a: "No, and we would push back on anyone who offered that. It reads, matches, routes for approval and posts once approved. Releasing money stays a human decision with your bank, because the failure mode on the other side of that line is severe." },
      { q: "Our suppliers all send different formats. Is that a problem?", a: "It is the normal situation and it is the reason off-the-shelf tools get abandoned. We work from a month of your real post, awkward suppliers included, and show you what was read correctly before you commit to anything." },
      { q: "What happens when an invoice does not match the order?", a: "It stops and goes to a person with both documents side by side and the difference highlighted. That queue is the point of the system. A mismatch that gets quietly accepted is worse than one that never got checked." },
      { q: "Can it handle credit notes and part deliveries?", a: "Yes, but they need to be in the sample. Those cases carry the rules that matter, and a system built only on clean invoices will fall over on the first credit note." },
      { q: "Does this work with our accounting software?", a: "In most cases. We would confirm on the call before quoting rather than after. The system posts into what you already run, so nothing about your close process needs to change." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['document-processing-automation', 'business-process-automation-consulting', 'system-data-integration'],
    stack: [
      { file: 'excel.svg', name: 'Excel' },
      { file: 'outlook.png', name: 'Outlook' },
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'stripe.png', name: 'Stripe' },
      { file: 'slack.svg', name: 'Slack' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      metric: {
        value: '80%',
        label: "less manual handling on an invoice ingestion backlog, taking invoice to approval from days to hours",
        source: "A fintech software company. Named on request, under NDA at the time of writing.",
      },
      mechanism:
        "The same approach applies whatever the document is. Collect it from wherever it lands, read it, check it against what it should match, and route it by your rules. What differs between finance teams is the rules and the tolerances, which is why those get written down before anything gets built.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     6. CUSTOMER SUPPORT AUTOMATION
     Keyword: "customer support automation" (12,990/mo but big-player SERP)
     Kept because demand is real and it is a genuine capability; SEO expectation
     is low, so this page earns its place on sales and citation value.
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'customer-support-automation',
    heroBg: '/images/hero/customer-support-automation.webp',
    metaTitle: 'Customer Support Automation That Resolves, Not Deflects | Chronexa',
    metaDescription:
      "Most support bots deflect and annoy. See how we build agents that read the account, do the task, and hand to a person the moment it stops being routine.",
    h1: "Customer support automation that resolves the ticket instead of deflecting it",
    heroSub:
      "We build support agents that can actually look something up and do something about it, connected to your systems, that hand over to a person the moment the question stops being routine.",
    answer:
      "Customer support automation works when the system can take action rather than only answer. That means reading the account, checking an order or a subscription, making the change, and recording what happened, all inside the helpdesk the team already uses. The difference between a system that helps and a bot that annoys is whether it can resolve the request or only describe how the customer might resolve it themselves.",
    callout:
      "Every customer knows the feeling of a support bot that reads a help article at them. It is worse than no bot, because it costs the customer time and then hands them to a person anyway, who now has an annoyed customer to deal with.",
    serviceName: 'Customer Support Automation',
    serviceType: 'Support automation and service agents',
    schemaDescription:
      "Customer support automation: agents that read account context, resolve routine requests inside the existing helpdesk, escalate to humans with full context, and log every action.",
    roi: [
      { value: 'Resolve, not deflect', label: 'The system does the task, not just the answer' },
      { value: 'Your helpdesk', label: 'Built inside the tool your team already works in' },
      { value: 'Clean handover', label: 'A person picks up with the full history attached' },
    ],
    buildHeading: 'What the agents handle',
    sections: [
      {
        heading: "The problem with support bots is that most of them cannot do anything",
        level: 2,
        body: [
          "They can search a help centre and paste back a paragraph. They cannot look at this customer's account, see that the subscription renewed on the wrong plan, and fix it. So the customer reads a generic article, gets no closer, and asks for a person anyway. The queue is unchanged and the customer is now in a worse mood than when they started.",
          "A support system is worth having when it can take the action. That means it needs access to the systems where the answer lives, and permission to change something, and a clear line past which it stops and fetches a human.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'The same question, forever',
        title: "A large share of the queue is a handful of questions",
        body: "Where is my order, how do I change my plan, can you resend the invoice, why was I charged this. Each one is quick and each one needs somebody, and together they fill the day.",
      },
      {
        label: 'Answers without actions',
        title: "The bot explains the process instead of doing it",
        body: "It tells the customer where the setting is. The customer wanted it changed. That gap is why deflection rates look good on a dashboard while satisfaction goes the other way.",
      },
      {
        label: 'The handover that loses everything',
        title: "The customer explains it all again to a person",
        body: "Everything they typed into the bot is gone or buried. The agent starts cold on a conversation that is already three exchanges old, and the customer has to repeat themselves.",
      },
      {
        label: 'Out of hours',
        title: "Nothing happens between six in the evening and nine in the morning",
        body: "The queue builds overnight and lands on the early shift. Monday is the worst day of the week for reasons that have nothing to do with Monday.",
      },
    ],
    beforeAfter: [
      { before: "The bot pastes a help article and the customer asks for a person.",
        after: "The request is actually resolved, or a person picks it up with context." },
      { before: "Agents spend the day on the same six questions.",
        after: "Agents spend the day on the ones that need judgement." },
      { before: "The customer repeats themselves at handover.",
        after: "The agent opens the ticket with the whole history already there." },
      { before: "Overnight requests wait for the morning shift.",
        after: "Routine ones are handled; the rest are queued with context attached." },
    ],
    process: [
      { title: "We read three months of your actual tickets", body: "Not a category list. The real queue, to find which requests are genuinely repetitive and which only look it until you read them properly." },
      { title: "We draw the line for what gets handled", body: "Which requests the system may resolve, which it may prepare but not complete, and which it must never touch. That line is a business decision and you own it." },
      { title: "We connect it to the systems that hold the answer", body: "Billing, orders, subscriptions, whatever the answer actually lives in. Without that access the system can only describe, which is where most support bots stop." },
      { title: "We start it narrow and widen it", body: "Live on a small set of request types first, with everything logged, so you can see how it behaves before it handles more." },
    ],
    whyCustom: [
      "It takes the action rather than describing it, because it is connected to the systems that hold the answer.",
      "It runs inside the helpdesk your team already uses, not as a separate widget.",
      "The escalation carries the full history, so nobody repeats themselves.",
      "You decide what it may resolve and what it must never touch.",
    ],
    included: [
      "A review of three months of real tickets to find what is genuinely repetitive",
      "A written line between what the system may resolve and what it must escalate",
      "Connections to the systems where the answers actually live",
      "Resolution of routine requests inside your existing helpdesk",
      "Escalation with the full conversation and account context attached",
      "A log of every action taken, reviewable by your team",
    ],
    confidence: [
      { title: "It says what it is", body: "No pretending to be a person. Customers work it out anyway and resent it when they do, and the moment they ask for a human they get one." },
      { title: "You draw the line, in writing", body: "Which actions it may take, up to what value, and what it must never touch. Refunds above a threshold, account closures and anything contractual stay with your team unless you decide otherwise." },
      { title: "Every action is logged and reversible", body: "You can see what it did, to which account and when. If something goes wrong you can find it and undo it, which is what makes it safe to widen the scope over time." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Replacing your support team. The queue changes shape; the judgement work stays.",
      "Replacing your helpdesk. We build inside the one you already run.",
      "Handling complaints, disputes or anything contractual without an explicit decision from you.",
      "A deflection-rate target. Deflection is easy to fake and a bad measure of whether customers were helped.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "How is this different from the chatbot we already tried?", a: "Most chatbots can only search a help centre and paste back text. The difference is access: if the system can read this customer's account and change the thing they asked about, it resolves the request. If it cannot, it is a search box with a personality." },
      { q: "What stops it doing something expensive by mistake?", a: "A written line, agreed with you, about what it may do and up to what value. Refunds above a threshold, cancellations and anything contractual stop for a person. Everything it does is logged and reversible." },
      { q: "Will customers know they are talking to a system?", a: "Yes, because it says so. Pretending otherwise damages trust for a short-lived gain, and customers work it out anyway. The moment someone asks for a person, they get one." },
      { q: "Does this replace our support team?", a: "It changes what the queue looks like. The repetitive requests thin out and what remains is the work that needs judgement, which is the part your team is good at and the part customers remember." },
      { q: "How do you decide what to automate first?", a: "By reading three months of your actual tickets rather than working from a category list. Categories flatten everything; the real queue shows which requests are genuinely identical and which only look it." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['ai-agent-development', 'system-data-integration', 'ai-automation'],
    stack: [
      { file: 'intercom.png', name: 'Intercom' },
      { file: 'zendesk.png', name: 'Zendesk' },
      { file: 'freshdesk.png', name: 'Freshdesk' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'slack.svg', name: 'Slack' },
      { file: 'stripe.png', name: 'Stripe' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "We build these as layered agents rather than one general assistant: a separate one for billing questions, for feature requests, for technical faults. Each is connected only to the systems it needs and each knows the point at which it must stop. When something needs a developer it raises the ticket and assigns it, rather than leaving a customer waiting on a queue nobody is watching.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     7. SYSTEM & DATA INTEGRATION
     Keyword: "system integration company" (5,660/mo, page-1 site at 57 refs)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'system-data-integration',
    heroBg: '/images/hero/system-data-integration.webp',
    metaTitle: 'System Integration Company for Mid-Sized Firms | Chronexa',
    metaDescription:
      "When two systems do not talk, a person becomes the bridge. See how we connect the tools you already run so the same number stops being typed twice.",
    h1: "System integration for businesses where a person is the bridge between two tools",
    heroSub:
      "Every business has a place where somebody exports from one system and imports into another. We remove that person from the middle and make the two talk directly.",
    answer:
      "System integration connects the software a business already runs so information moves between tools without a person copying it. Most integration work is not technically hard; the difficulty is agreeing which system is authoritative for each piece of information, and what should happen when two of them disagree. Getting those decisions right is what separates an integration that holds from one that quietly drifts out of sync.",
    callout:
      "The most expensive integration is the one made of people. It has no error log, no retry, and it stops entirely when the person who does it is on holiday.",
    serviceName: 'System & Data Integration',
    serviceType: 'System and data integration services',
    schemaDescription:
      "System and data integration: connecting existing business software, agreeing the authoritative source for each field, handling conflicts and failures, and removing manual re-keying between tools.",
    roi: [
      { value: 'One source', label: 'An agreed authority for each piece of information' },
      { value: 'Visible failures', label: 'When a sync breaks, somebody is told' },
      { value: 'No re-keying', label: 'The same number stops being typed twice' },
    ],
    buildHeading: 'What the integration handles',
    sections: [
      {
        heading: "Somewhere in your business, a person is an integration",
        level: 2,
        body: [
          "They export a report on a Friday, open it in a spreadsheet, tidy a few columns, and paste it into another system. They have done it so long that nobody counts it as a task any more. It is just part of the week.",
          "That arrangement works until it does not. The file format changes, or they go on leave, or they mistype a column and nobody notices for a month. A human integration has no error handling, which is the entire problem with it.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Export, tidy, import',
        title: "A weekly ritual that nobody counts as work",
        body: "Download a report, fix the columns, upload it somewhere else. Half a day gone, repeated every week, and it appears on no plan or budget because it has always just been what happens.",
      },
      {
        label: 'Two answers to the same question',
        title: "Nobody agreed which system is right",
        body: "The customer address is different in the CRM and the accounting system. Both were entered by a real person for a real reason, and there is no rule for which one wins, so it gets settled case by case forever.",
      },
      {
        label: 'Silent failure',
        title: "The sync stopped in March and nobody noticed until June",
        body: "The connection that was set up once and never monitored. It fails quietly, the data goes stale, and the first sign is a report that does not make sense.",
      },
      {
        label: 'The one integration nobody will touch',
        title: "It was built by someone who left",
        body: "It works, sort of. Nobody knows exactly how. So it gets worked around rather than fixed, and every new project has to route around it.",
      },
    ],
    beforeAfter: [
      { before: "Someone exports and imports between two systems every week.",
        after: "The two systems exchange it directly, on a schedule." },
      { before: "The same customer has two different addresses on file.",
        after: "One system is authoritative for each field, and the rule is written down." },
      { before: "A broken sync is discovered when a report looks wrong.",
        after: "A failure raises an alert to a named person the same day." },
      { before: "Nobody understands the integration that already exists.",
        after: "It is documented, and the failure modes are written down." },
    ],
    process: [
      { title: "We find every place a person moves data", body: "Including the ones nobody counts. The Friday export, the copy and paste, the spreadsheet that gets emailed around, the tab someone keeps open for reference." },
      { title: "We agree which system owns which field", body: "This is the part that actually matters and the part usually skipped. Without it, two systems overwrite each other politely for months until the data is unusable." },
      { title: "We decide what happens when something fails", body: "Retry, queue, or stop and tell a named person. A connection with no failure plan is a connection that will fail silently, which is worse than not having it." },
      { title: "We build it and document the failure modes", body: "So the next person to touch it knows what it does, what it assumes, and what to check when something looks wrong." },
    ],
    whyCustom: [
      "The authoritative source for each field is agreed and written down before anything is connected.",
      "Failures are visible and go to a named person rather than disappearing.",
      "Built with the systems you already run, including the older ones without modern connections.",
      "Documented, so the next person is not inheriting a mystery.",
    ],
    included: [
      "A map of every place a person currently moves data by hand",
      "A written agreement on which system is authoritative for each field",
      "The connections themselves, with retry and failure handling",
      "Alerting to a named person when something stops working",
      "Documentation covering what it does and how it fails",
      "A handover call and thirty days of support",
    ],
    confidence: [
      { title: "We agree the source of truth first", body: "Which system wins for each field, and what happens on a conflict. Skipping this is the single most common reason integrations quietly corrupt data over months rather than failing loudly on day one." },
      { title: "Failures are loud", body: "A connection that fails silently is worse than no connection, because people keep trusting the numbers. Anything that breaks raises an alert to a person, and the queue holds rather than dropping records." },
      { title: "Nothing is overwritten without a rule", body: "Where two systems disagree, the behaviour is defined in advance and written down. Nothing gets resolved by whichever job happened to run last." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Replacing any of the systems being connected. That is a different and much larger decision.",
      "Cleaning up historic data mismatches beyond an agreed scope.",
      "Licences or connector fees charged by the platforms themselves.",
      "Connecting systems with no practical way in, without agreeing an approach first.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Our older system has no modern way to connect. Is it hopeless?", a: "Usually not. Older software often has a database, a scheduled export, or a file drop that can be worked with. It is less elegant than a modern connection and it needs more care around failure handling, but it is normally possible." },
      { q: "Can we not just use Zapier for this?", a: "For simple two-step connections, often yes, and we will tell you when that is the honest answer. It stops being the right tool when there are conflict rules, volume, or a need to know reliably that something failed." },
      { q: "How do you decide which system wins when they disagree?", a: "You do, and we make you decide it explicitly before anything is connected. It is a business question rather than a technical one: whoever owns that field owns the answer, and the rule gets written down." },
      { q: "What happens if a connection breaks at two in the morning?", a: "It retries on a schedule, holds the records it could not deliver, and alerts a named person. Nothing is dropped silently, and when it comes back the queue clears in order." },
      { q: "Will this slow our systems down?", a: "Not meaningfully. Integrations are scheduled around your usage rather than running constantly, and volumes are agreed up front so nothing gets hammered during your busy hours." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the work covers and what it costs, before any build starts." },
    ],
    related: ['business-process-automation-consulting', 'legacy-system-modernization', 'crm-automation-services'],
    stack: [
      { file: 'airtable.svg', name: 'Airtable' },
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'aws.svg', name: 'AWS' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "Integration is the part of every engagement we have delivered that nobody puts on the brochure. The document work only mattered because the results landed in the system the team already used; the invoice work only mattered because it posted into the accounting software. The connecting is usually where the time goes and always where the value lands.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     8. LEGACY SYSTEM MODERNIZATION
     Keyword: "legacy application modernization" (410/mo, page-1 site at 88 refs)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'legacy-system-modernization',
    heroBg: '/images/hero/legacy-system-modernization.webp',
    metaTitle: 'Legacy System Modernization Without Replacing It | Chronexa',
    metaDescription:
      "The old system works, but nothing can talk to it. See how we give legacy software a modern way in so you can automate around it instead of replacing it.",
    h1: "Legacy system modernization for software that works but will not talk to anything",
    heroSub:
      "The old system is not the problem. Being unable to get anything in or out of it is. We build the way in, so you can automate around it instead of betting the business on a replacement.",
    answer:
      "Legacy modernization does not have to mean replacement. In most cases the older system still does its job correctly and the real problem is that nothing else can reach it, so people move information in and out by hand. Building a modern way in and out lets a business automate around the old system and postpone or avoid a replacement project entirely, which is usually the cheaper and far less risky path.",
    callout:
      "Replacing a working system is one of the riskiest projects a mid-sized business can take on. It is often chosen not because the old software is wrong, but because nobody could think of another way to make it talk to anything.",
    serviceName: 'Legacy System Modernization',
    serviceType: 'Legacy system modernization and integration',
    schemaDescription:
      "Legacy system modernization: building modern access to older business software so it can be automated and integrated, avoiding or postponing full replacement.",
    roi: [
      { value: 'Keep what works', label: 'The old system stays; the isolation goes' },
      { value: 'Lower risk', label: 'No big-bang replacement, no data migration gamble' },
      { value: 'Automate around it', label: 'Modern tools can finally reach it' },
    ],
    buildHeading: 'What modernizing actually involves',
    sections: [
      {
        heading: "The old system is not the problem. The moat around it is",
        level: 2,
        body: [
          "It has run the business for fifteen years. It handles the edge cases nobody remembers documenting. It is stable and everyone knows how it behaves. Its only real failing is that nothing built after about 2010 can talk to it, so every connection to it is a person with a spreadsheet.",
          "The instinct is to replace it. That is a large project with a genuine chance of failure, and it is often being considered for the wrong reason. If the software still does its job, the cheaper move is to build a way in and out, and let everything modern talk to it through that.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Screen and re-key',
        title: "Getting data out means someone reading it off a screen",
        body: "There is no export worth the name, so the way information leaves is a person looking at one window and typing into another. That is the whole integration layer, and it costs a salary.",
      },
      {
        label: 'Knowledge in one head',
        title: "One person knows why it does the odd thing it does",
        body: "There are behaviours nobody documented and rules that only exist because of a decision made a decade ago. When that person retires, the risk becomes real overnight.",
      },
      {
        label: 'The stalled replacement',
        title: "A migration was started, and quietly paused",
        body: "The estimate grew, the edge cases multiplied, and the project went quiet. Now there are two systems, some data in each, and nobody wants to be the one to restart the conversation.",
      },
      {
        label: 'Blocking everything else',
        title: "Every new project has to route around it",
        body: "Any improvement anywhere stalls at the same question: how will this get data in and out of the old system. So improvements stop being proposed.",
      },
    ],
    beforeAfter: [
      { before: "Getting data out means someone reading a screen and retyping.",
        after: "It comes out on a schedule, into whatever needs it." },
      { before: "New projects stall on how to reach the old system.",
        after: "There is a documented way in, so they stop stalling." },
      { before: "One person understands the odd behaviours.",
        after: "The behaviours are written down and tested." },
      { before: "Replacement is the only option anyone can see.",
        after: "Replacement becomes a choice with a timetable, not an emergency." },
    ],
    process: [
      { title: "We find out what is genuinely available", body: "A database, a scheduled export, a file drop, a reporting tool, sometimes a screen we can drive. There is nearly always something, and it is nearly always more than people expect." },
      { title: "We write down what the system actually does", body: "Including the odd behaviours that only one person knows about. This is worth doing on its own, whatever you decide about replacing it later." },
      { title: "We build the way in and out", body: "A modern, documented access point, so anything built afterwards talks to that rather than to the old system directly." },
      { title: "We automate one thing through it", body: "Proving the route works on something real and useful, rather than handing over a connection nobody has tested under load." },
    ],
    whyCustom: [
      "The old system keeps running, so there is no migration risk and no downtime.",
      "The undocumented behaviours get written down, which reduces your key-person risk on its own.",
      "Anything built later talks to a documented access point rather than to the legacy system directly.",
      "Replacement becomes a decision you can plan for rather than one forced on you.",
    ],
    included: [
      "An assessment of what access the system genuinely allows",
      "Written documentation of what it does, including the undocumented behaviours",
      "A modern, documented way to get information in and out",
      "One real process automated through it, to prove the route",
      "Failure handling and alerting on the access layer",
      "A handover call and thirty days of support",
    ],
    confidence: [
      { title: "We read before we write", body: "The first stage only reads. Nothing writes back into the old system until the read side has been proven and you have agreed what may be written, because an unrecoverable write into a legacy system is a very bad afternoon." },
      { title: "The old system keeps running throughout", body: "There is no cutover and no downtime. If the new access layer stopped tomorrow, your business would carry on exactly as it does today." },
      { title: "Documentation is a deliverable, not a by-product", body: "What the system does, what it assumes, and where the odd behaviours are. That document has value on its own, whatever you decide about replacement later." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Replacing the legacy system. If that is the goal, this is the wrong engagement and we will say so.",
      "Migrating historic data into a new platform.",
      "Support or licensing for the legacy software itself.",
      "Changing what the old system does. We build access to it; we do not modify it.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Should we not just replace it?", a: "Sometimes yes, and we will say so if the software is genuinely failing or unsupported in a way that puts you at risk. But replacement is often chosen because nobody could see another way to connect it, and that is a bad reason to take on a large project." },
      { q: "The vendor says there is no way to integrate. Is that true?", a: "It usually means there is no supported way, which is not the same thing. A database, a scheduled export, a reporting tool or a file drop is nearly always available, and we would look before accepting the answer." },
      { q: "Is this safe for a system we cannot afford to break?", a: "The first stage only reads, so there is nothing to break. Writing back is a separate decision, taken after the read side works, with agreed limits on what may be written and a way to reverse it." },
      { q: "What if we replace the system in two years anyway?", a: "The documentation and the access layer both help. You will know what the old system actually does, which is the single hardest part of any migration, and the things built around it will point at the access layer rather than at the system itself." },
      { q: "How long does this take?", a: "The assessment is quick. Building the way in depends entirely on what access exists, which is why we look before quoting rather than after." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the work covers and what it costs, before any build starts." },
    ],
    related: ['system-data-integration', 'business-process-automation-consulting', 'ai-automation'],
    stack: [
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'aws.svg', name: 'AWS' },
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'gdrive.svg', name: 'Google Drive' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "Most of the systems we connect to were not designed to be connected to. Practice management software, document stores, older accounting packages: the work is finding the seam that already exists and building something dependable on top of it. We would rather spend a week finding a supported route than a month driving a screen.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     9. AI AGENT DEVELOPMENT
     Keyword: "ai agent development company" (770/mo, page-1 site at 47 refs)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'ai-agent-development',
    heroBg: '/images/hero/ai-agent-development.webp',
    metaTitle: 'AI Agent Development for Real Business Workflows | Chronexa',
    metaDescription:
      "Most agent demos fall over on the second step. See how we build narrow agents that do one job, inside your systems, and stop when they are unsure.",
    h1: "AI agent development for work that has more than one step",
    heroSub:
      "We build narrow agents that do a specific job inside your systems: gather what is needed, take the action, and stop and ask when something falls outside what they were built for.",
    answer:
      "An AI agent is a system that can carry out a multi-step task rather than answering a single question. It works out what needs doing, gathers the information, takes the action, and checks the result. The ones that survive in production are narrow and specific, with clear limits on what they may do and a person on the other side of that limit. General-purpose agents demonstrate well and break on the second step.",
    callout:
      "The demo where an agent books a flight is not the hard part. The hard part is what it does when the flight is full, and whether it tells anyone.",
    serviceName: 'AI Agent Development',
    serviceType: 'Custom AI agent development',
    schemaDescription:
      "Custom AI agent development: narrow, task-specific agents connected to existing business systems, with defined limits, human escalation and full logging.",
    roi: [
      { value: 'Narrow by design', label: 'One job done reliably beats ten done occasionally' },
      { value: 'Defined limits', label: 'What it may do is written down and enforced' },
      { value: 'Full log', label: 'Every step it took is visible and reviewable' },
    ],
    buildHeading: 'How we build agents that survive contact with production',
    sections: [
      {
        heading: "The demo always works. The second week is the test",
        level: 2,
        body: [
          "An agent handling the expected case is straightforward and looks impressive. Then it meets a supplier who has changed their name, a form with a field missing, a system that times out. A general-purpose agent will improvise, and an improvising system inside your business records is not a feature.",
          "The ones that last are boring by comparison. They do one job. They have a written list of what they may touch. When something does not fit, they stop and hand it to a person with an explanation rather than pressing on.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Too broad to trust',
        title: "An agent built to handle anything handles nothing reliably",
        body: "The wider the remit, the more ways it can be wrong, and the harder it is to say whether it is working. Narrow agents can be tested. General ones can only be hoped for.",
      },
      {
        label: 'No limits',
        title: "Nobody wrote down what it is not allowed to do",
        body: "If the boundary is not explicit and enforced, it is a matter of luck. That is fine in a demo and unacceptable anywhere near money, customers or records.",
      },
      {
        label: 'Silent improvisation',
        title: "It makes something up rather than stopping",
        body: "The failure that damages trust permanently. One invented reference number in a real record and nobody in the business will believe the system again, correctly.",
      },
      {
        label: 'No trail',
        title: "You cannot see what it did or why",
        body: "When something goes wrong, the first question is what happened. Without a step-by-step record there is no answer, so there is no fix, so the whole thing gets switched off.",
      },
    ],
    beforeAfter: [
      { before: "An agent that will attempt anything, unpredictably.",
        after: "An agent that does one job and is tested on it." },
      { before: "The boundary is a hope.",
        after: "The boundary is written down and enforced in the system." },
      { before: "It improvises when reality does not match.",
        after: "It stops, explains, and hands to a person." },
      { before: "Nobody can explain what it did.",
        after: "Every step is logged and can be replayed." },
    ],
    process: [
      { title: "We pick a job narrow enough to test", body: "One task, with a definition of done you could check by hand. If we cannot describe how to tell whether it worked, it is not ready to be built." },
      { title: "We write down what it may and may not touch", body: "Which systems, which actions, up to what value. This list is the safety mechanism and it belongs to you, not to us." },
      { title: "We build the stopping behaviour first", body: "What happens when the information is missing, the system is down, or the situation is unfamiliar. Getting this right before the happy path is what separates a production agent from a demo." },
      { title: "We run it visible before we run it wide", body: "Live on a small slice with everything logged and a person watching, then widened once you can see how it behaves on real work." },
    ],
    whyCustom: [
      "Narrow enough to test properly, which is the only kind that survives.",
      "Connected to your actual systems rather than a sandbox that resembles them.",
      "Explicit limits on what it may do, enforced rather than requested.",
      "Every step logged, so a problem can be found and fixed instead of guessed at.",
    ],
    included: [
      "A written definition of the one job and how to tell it worked",
      "An explicit list of what the agent may and may not touch",
      "The stopping and escalation behaviour, built before the main path",
      "Connections to the systems the agent needs",
      "A full step-by-step log of every run",
      "A supervised period on live work before the scope widens",
    ],
    confidence: [
      { title: "It stops rather than improvising", body: "When the situation does not match what it was built for, it hands over with an explanation. A system that guesses to avoid admitting uncertainty is the single fastest way to lose a team's trust in it." },
      { title: "The limits are enforced, not requested", body: "What it may touch and up to what value is built into the system rather than written in an instruction it might ignore. Anything outside that stops and waits for a person." },
      { title: "Everything is logged and replayable", body: "You can see each step it took and why. When something goes wrong that record is the difference between fixing it and switching the whole thing off." },
      OWNERSHIP,
    ],
    notIncluded: [
      "A general-purpose assistant. We build narrow agents because those are the ones that keep working.",
      "Agents that act on money, contracts or customer records without an explicit approval step.",
      "Training a model on your data. That is a different engagement with different economics.",
      "A promise that an agent is the right answer. Often a simpler automation is, and we will say so.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "What is the difference between an agent and an automation?", a: "An automation follows steps you defined. An agent works out the steps within limits you set. Agents are worth the extra complexity when the path genuinely varies each time. When it does not, a plain automation is cheaper, faster and more reliable, and we will tell you which you need." },
      { q: "How do you stop it doing something it should not?", a: "The limits are enforced in the system rather than written as an instruction. It can only reach the systems we connected and only take the actions on the list, and anything above an agreed value stops for a person." },
      { q: "What happens when it does not know what to do?", a: "It stops and hands over with an explanation of what it was doing and where it got stuck. Building that behaviour first, before the main path, is most of what makes an agent safe to run." },
      { q: "Can we start small?", a: "You should. One narrow job, live on a slice of real work with someone watching, is the only way to find out how it behaves on your data. Widening after that is straightforward; starting wide rarely recovers." },
      { q: "Do we need our own model?", a: "Almost never. For the work most businesses want done, the available models are already capable and the difficulty is in the connections, the limits and the failure handling." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['private-rag-knowledge-systems', 'customer-support-automation', 'ai-automation'],
    stack: [
      { file: 'claude.svg', name: 'Claude' },
      { file: 'openai.svg', name: 'OpenAI' },
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'slack.svg', name: 'Slack' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'airtable.svg', name: 'Airtable' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "We build these as small specialists that hand work to each other rather than as one agent that tries to do everything. In a research system that means one part gathering, another checking the numbers, another preparing the summary, each with its own limits. It is less impressive to describe and considerably more likely to still be running in six months.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     10. PRIVATE RAG & KNOWLEDGE SYSTEMS
     Keyword: "rag as a service" / "llm development services" (page-1 at 33 refs)
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'private-rag-knowledge-systems',
    heroBg: '/images/hero/private-rag-knowledge-systems.webp',
    metaTitle: 'Private Knowledge Systems That Answer From Your Own Files | Chronexa',
    metaDescription:
      "Your team searches for documents and then reads them. See how we build a private system that answers from your own files and shows the page it came from.",
    h1: "A private system that answers questions from your own documents",
    heroSub:
      "Your policies, contracts, manuals and past work already contain the answers. We build the system that finds them and answers in plain language, with the source attached, without any of it leaving your control.",
    answer:
      "A private knowledge system lets a team ask questions in plain language and get answers drawn from the organisation's own documents, with a link to the exact source. Unlike a public assistant it only reads material you have given it, and unlike a search tool it answers the question rather than returning a list of files to read. Because the documents are usually confidential, where the system runs and who can reach it matters as much as how well it answers.",
    callout:
      "Search tells you which of four hundred documents might contain the answer. Your team wanted the answer, and the reason they ask a colleague instead is that the colleague gives them one.",
    serviceName: 'Private RAG & Knowledge Systems',
    serviceType: 'Private knowledge and retrieval systems',
    schemaDescription:
      "Private knowledge systems built on an organisation's own documents: plain-language answers with source citations, access controls, and deployment inside the client environment.",
    roi: [
      { value: 'Cited answers', label: 'Every answer links to the page it came from' },
      { value: 'Your permissions', label: 'People see only what they could already open' },
      { value: 'Your environment', label: 'Documents never have to leave your control' },
    ],
    buildHeading: 'What the system does with your documents',
    sections: [
      {
        heading: "The answer is in a document nobody can find",
        level: 2,
        body: [
          "It is in a policy from three years ago, or a contract in a folder named after a project that got renamed, or a manual somebody saved to their own drive. The organisation has the knowledge. It just cannot be reached in the time available, so the same questions get asked of the same two experienced people until those people become a bottleneck.",
          "Search does not solve this because search returns documents. What people want is the answer, plus enough of the source to check that it is right.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Two people are the search engine',
        title: "The same colleagues get asked everything",
        body: "They know where things are and what the policy actually means. That makes them essential in a way nobody planned, and it means their week is interrupted constantly.",
      },
      {
        label: 'Answers without sources',
        title: "A confident answer nobody can verify is worthless here",
        body: "In regulated work an answer you cannot trace is not usable. If the system cannot show which document and which page, the answer cannot be relied on for anything that matters.",
      },
      {
        label: 'Confidentiality rules it out',
        title: "The documents cannot go to a public tool",
        body: "Client files, contracts, personnel records. The obvious tools are off the table not because they answer badly but because of where the documents would have to go.",
      },
      {
        label: 'Permission blindness',
        title: "A search that ignores who is asking",
        body: "A system that reads everything and answers everyone will eventually tell somebody something they were not supposed to see. Then it gets switched off, correctly.",
      },
    ],
    beforeAfter: [
      { before: "Two experienced people are asked everything.",
        after: "Most questions are answered without interrupting them." },
      { before: "Search returns forty documents to read.",
        after: "The answer comes back with the page it came from." },
      { before: "Confidential material rules out the obvious tools.",
        after: "It runs where your documents already live." },
      { before: "Everyone sees everything, or nobody uses it.",
        after: "People see only what their existing permissions allow." },
    ],
    process: [
      { title: "We work out which questions are actually being asked", body: "Usually a smaller set than expected, and often concentrated in one or two areas. That set defines what the system needs to be good at." },
      { title: "We agree what it may read, and who may ask", body: "Which folders, which document types, and how existing permissions map onto answers. This is a governance decision and it comes before the build." },
      { title: "We build it where your documents already are", body: "Inside your environment where that is what confidentiality requires, reading from the stores you already use rather than needing a copy elsewhere." },
      { title: "We test it against questions with known answers", body: "Real questions where your experts already know the correct response, so accuracy is measured rather than assumed." },
    ],
    whyCustom: [
      "Answers cite the document and the section, so they can be checked.",
      "Existing permissions are respected, so nobody sees more than they could already open.",
      "It runs inside your environment where confidentiality requires it.",
      "It is measured against questions your experts already know the answer to.",
    ],
    included: [
      "A review of the questions actually being asked and by whom",
      "An agreed scope of what the system may read and who may ask",
      "The system itself, reading from your existing document stores",
      "Answers with citations back to the source document and section",
      "Permission handling aligned to your current access rules",
      "An accuracy test against questions with known answers",
    ],
    confidence: [
      { title: "Every answer carries its source", body: "The document and the section it came from, so anyone can check it in seconds. An answer without a source is not usable in regulated work and we do not build systems that produce them." },
      { title: "It respects the permissions you already have", body: "People get answers drawn only from material they could already open. The system does not become a way around your access controls, which is the failure that gets these projects shut down." },
      { title: "It says when it does not know", body: "Where the documents do not contain the answer, it says so rather than assembling something plausible. Being told there is nothing on file is a useful answer; a confident invention is not." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Training a model on your documents. The system reads them at question time, which is safer and easier to change.",
      "Reorganising your document storage, beyond what is needed to read it reliably.",
      "Answers on material you have not given it access to.",
      "Legal or compliance sign-off on the answers it produces.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Is our data used to train a model?", a: "No. The system reads your documents at the moment a question is asked and uses them to answer. Nothing is trained on them, which means removing a document removes it from the answers immediately." },
      { q: "What stops it inventing an answer?", a: "It answers from retrieved passages and cites them, so an answer with no source is visible as such. Where the documents do not cover the question it is built to say so, and that behaviour is tested rather than assumed." },
      { q: "Can it respect our existing permissions?", a: "Yes, and it should. Answers are drawn only from material the person asking could already open. A system that ignores this will eventually surface something it should not, and that is how these projects get shut down." },
      { q: "Where does it run?", a: "Inside your own environment if confidentiality requires it, so documents never leave systems you control. Where the material is less sensitive there are simpler options, and we would talk through the trade-off rather than assume." },
      { q: "How do you know it is accurate?", a: "We test it against real questions where your experts already know the right answer, and report where it got them wrong. Accuracy claimed without that test is just a claim." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the system has to do and what it costs, before any build starts." },
    ],
    related: ['ai-agent-development', 'secure-ai-deployment', 'document-processing-automation'],
    stack: [
      { file: 'claude.svg', name: 'Claude' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'notion.svg', name: 'Notion' },
      { file: 'imanage.png', name: 'iManage' },
      { file: 'aws.svg', name: 'AWS' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "The build that matters here is the boring half: working out which documents are authoritative, how permissions map onto answers, and what the system should do when the files genuinely do not cover the question. The answering is largely solved. Whether the answers can be trusted and shown to an auditor is the part that takes the work.",
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
     11. SECURE & COMPLIANT AI DEPLOYMENT
     Keyword: "on premise llm" (760/mo, page-1 site at 2 refs) + "hipaa compliant ai"
     ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'secure-ai-deployment',
    heroBg: '/images/hero/secure-ai-deployment.webp',
    metaTitle: 'On-Premise and Compliant AI Deployment | Chronexa',
    metaDescription:
      "Legal, health and finance data cannot go to a public model. See how we deploy AI inside your own environment, with access control and an audit trail.",
    h1: "AI deployed inside your own environment, because your data cannot leave it",
    heroSub:
      "For firms where client data is the constraint, we build systems that run where your data already sits, with access controls and a record of every action, so compliance is a property of the build rather than a promise about it.",
    answer:
      "Compliant AI deployment means running the system inside infrastructure the organisation controls, so regulated data never passes to a third party. In practice that involves choosing a hosting arrangement that satisfies the relevant obligation, restricting access to named people, keeping a record of every action for audit, and being able to demonstrate all of it. For sectors under HIPAA, financial regulation or legal privilege, this is usually what decides whether an AI project can proceed at all.",
    callout:
      "In a regulated firm the AI question is rarely whether the technology works. It is whether the data can go where the technology lives. Answer that first and the rest of the project becomes ordinary.",
    serviceName: 'Secure & Compliant AI Deployment',
    serviceType: 'Secure and compliant AI infrastructure',
    schemaDescription:
      "Secure AI deployment for regulated organisations: private and on-premise hosting, access control, audit logging, data residency, and support for HIPAA and financial obligations.",
    roi: [
      { value: 'Your infrastructure', label: 'Regulated data never leaves your control' },
      { value: 'Named access', label: 'Only the people you list can reach it' },
      { value: 'Full audit trail', label: 'Every action recorded and reviewable' },
    ],
    buildHeading: 'What deploying it properly involves',
    sections: [
      {
        heading: "The blocker is almost never the technology",
        level: 2,
        body: [
          "A partner sees what these systems can do and immediately asks the only question that matters in a regulated firm: where does the file go. If the honest answer is a third party in another country, the conversation is over, and it should be.",
          "So the deployment decision comes first and the capability second. Once the system runs inside infrastructure you control, with access restricted to people you have named and a record of everything it did, the project becomes an ordinary one.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Data leaving the building',
        title: "The obvious tools send your files to someone else's infrastructure",
        body: "For privileged, health or client-money data that is not a risk to be managed, it is a rule to be followed. It rules out most of what the market is selling before any evaluation begins.",
      },
      {
        label: 'No record of what happened',
        title: "You cannot show an auditor what the system did",
        body: "Who asked what, which records were touched, what came back. Without that record the system cannot be signed off, however well it performs.",
      },
      {
        label: 'Access nobody controls',
        title: "A tool bought on a card by one department",
        body: "It works, so it spreads. Six months later client data is in a system procurement has never reviewed and nobody can say who has access.",
      },
      {
        label: 'Contracts that do not cover it',
        title: "The agreement in place does not permit this use",
        body: "The vendor terms allow them to retain and process the data in ways your own client agreements do not. It is discovered late, usually by someone reading the terms properly for the first time.",
      },
    ],
    beforeAfter: [
      { before: "Client files would have to go to a third party.",
        after: "They stay inside infrastructure you control." },
      { before: "There is no record of what the system did.",
        after: "Every action is logged, attributable and exportable." },
      { before: "Access spreads informally through a department.",
        after: "Only named people can reach it, and that list is reviewed." },
      { before: "Compliance is a promise in a sales deck.",
        after: "Compliance is a property of where and how it runs." },
    ],
    process: [
      { title: "We start with the obligation, not the tool", body: "Which regulation, which client commitments, which data. That determines what is permitted, and everything else follows from it." },
      { title: "We choose the deployment that satisfies it", body: "Your own cloud, a dedicated arrangement, or fully on your premises. Each has different cost and effort, and the obligation decides which is actually available to you." },
      { title: "We build the controls in from the start", body: "Access limited to named people, a record of every action, retention rules that match your policy. Added afterwards these never quite fit." },
      { title: "We document it for the people who will ask", body: "Written up so it can be handed to a client, an auditor or an insurer without a scramble. That document is part of the deliverable." },
    ],
    whyCustom: [
      "The deployment is chosen to satisfy your actual obligation rather than a general claim about security.",
      "Access, logging and retention are built in from the start rather than bolted on.",
      "It runs where your data already sits, so nothing new has to be permitted.",
      "You get the documentation an auditor or client will ask for.",
    ],
    included: [
      "A review of the obligations that apply to the data in question",
      "A deployment recommendation with the cost and effort of each option",
      "The build itself, inside infrastructure you control",
      "Access restricted to named people, with a record of every action",
      "Retention and deletion rules matching your policy",
      "Written documentation for clients, auditors and insurers",
    ],
    confidence: [
      { title: "The data does not leave", body: "Where the obligation requires it, everything runs inside infrastructure you control and no regulated material passes to a third party. That is a property of the deployment rather than an assurance in a contract." },
      { title: "Everything is attributable", body: "Who asked, what was touched, what came back and when. Exportable, because at some point somebody will ask for it and the answer needs to take minutes rather than weeks." },
      { title: "We tell you where the limits are", body: "Some obligations rule out approaches that would otherwise be cheaper and better. We would rather set that out plainly at the start than let it surface during a client audit." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Legal advice on your obligations. We build to the requirements you and your advisers set.",
      "Certification or accreditation. We build to the standard and document it; the assessment is separate.",
      "Ongoing infrastructure costs, which sit with your cloud or hosting provider directly.",
      "A claim that any deployment makes you compliant. Compliance is about your whole process, not one system.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Does on-premise mean we need our own servers?", a: "Not usually. For most firms the practical answer is a private arrangement inside your own cloud account, which satisfies the obligation without you running hardware. Genuine on-premise is available where the requirement demands it, and it costs more." },
      { q: "Can you sign a business associate agreement?", a: "Where the engagement involves health data and we are handling it, that is a normal part of the arrangement. It is worth raising on the first call because it shapes how the deployment is designed." },
      { q: "Is a private deployment much more expensive?", a: "It costs more than the public option and usually less than people expect, and the comparison that matters is against not being able to do the project at all. We set out the options with their costs so the choice is yours to make." },
      { q: "How do we prove this to a client or an auditor?", a: "With the documentation, which is part of what we deliver: where it runs, who can reach it, what is recorded and how long things are kept. Producing that at the point of the question is the thing that goes badly for most firms." },
      { q: "Does this slow the system down?", a: "Marginally, in some configurations. In the work we do the difference is not noticeable next to the process it replaces, and it is the price of the data staying where it has to stay." },
      { q: "What does it cost?", a: "Every engagement is priced to its own scope, so there is no list price. After a short discovery call we agree in writing what the work covers and what it costs, before any build starts." },
    ],
    related: ['private-rag-knowledge-systems', 'document-processing-automation', 'ai-automation'],
    stack: [
      { file: 'aws.svg', name: 'AWS' },
      { file: 'googlecloud.svg', name: 'Google Cloud' },
      { file: 'anthropic.svg', name: 'Anthropic' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'imanage.png', name: 'iManage' },
    ],
    heroPanel: {
      label: 'The engagement',
      items: [
        'One clear measurable outcome.',
        'Built into your existing systems.',
        'Fixed price, agreed before build.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Data extraction',
        'Lead routing',
        'Status tracking',
        'Report generation',
        'Data reconciliation'
      ],
      tail: 'or anywhere your team spends hours doing repetitive data work.',
    },
    heroStats: [
      { value: 85, suffix: '%', label: 'average time saved on manual work' },
      { value: 100, suffix: '%', label: 'audit and visibility on every action' },
    ],

    proofBlock: {
      mechanism:
        "Every engagement we take in legal, health or financial work starts with this question rather than ending with it. The deployment shape gets settled before anyone discusses what the system will do, because it determines what is possible. Firms that take it in the other order tend to build something they then cannot use.",
    },
  },
  {
    slug: 'accounting-automation-services',
    heroBg: '/images/hero/ai-automation.webp',
    metaTitle: 'AI & Workflow Automation Services for Accounting Firms | Chronexa',
    metaDescription:
      "Stop throwing headcount at manual work. See how we build custom workflow automation and AI systems that eliminate manual GL mapping, data extraction, and system silos for mid-market accounting firms.",
    h1: "AI and workflow automation services for accounting firms",
    heroSub:
      "We design and build the autonomous systems that connect your siloed legacy software, extract data from unstructured client documents, and permanently eliminate the manual labor draining your firm's profitability.",
    answer:
      "Workflow automation services for accounting firms mean replacing the manual data bridges built by junior staff with custom, code-driven infrastructure. Whether it is automatically chasing clients for missing K-1s, pulling data from messy W-2s, or mapping 10,000 credit card transactions to the general ledger, we build the systems that do the reading, routing, and keying. We don't just advise on digital transformation; we build the actual plumbing that makes it work.",
    callout:
      "You don't have a software problem. You have a gap problem. Your practice management system doesn't talk to your tax software, so you hire junior staff to move data between them. Automation eliminates the gap, not the software.",
    serviceName: 'Accounting Automation Services',
    serviceType: 'Workflow Engineering & AI Implementation',
    schemaDescription:
      "Custom workflow automation and AI integration services for mid-market CPA and accounting firms. We build systems for tax document data extraction, GL mapping, and legacy software integration.",
    roi: [
      { value: 'Eliminate handoffs', label: 'Systems that route data between siloed software automatically' },
      { value: 'Extract instantly', label: 'Pull structured data from messy, unstructured client tax documents' },
      { value: 'Deploy securely', label: 'Self-hosted infrastructure options that keep client data strictly inside your cloud' },
    ],
    buildHeading: 'What we actually build',
    sections: [
      {
        heading: "SaaS won't fix your firm. Custom integration will.",
        level: 2,
        body: [
          "Most accounting firms try to solve their operational bottlenecks by buying another SaaS product. But off-the-shelf software forces you to change your firm to match the software's assumptions. When it inevitably fails to connect to your legacy systems (like CCH or Thomson Reuters), you end up hiring junior staff just to move data between screens.",
          "We take a different approach. We build custom integrations—using platforms like n8n and secure LLMs—that fit the way you actually work. We wire your existing systems together so the manual handoffs disappear.",
        ],
      },
    ],
    failurePoints: [
      {
        label: 'Siloed Systems',
        title: "The software doesn't talk",
        body: "Your CRM is modern, but your tax software is a decade old. Without proper integration, your team becomes the human API, manually copying data across screens all day.",
      },
      {
        label: 'Unstructured Data',
        title: "PDFs trapping your time",
        body: "Clients send K-1s, W-2s, and bank statements in every format imaginable. Relying on humans to read, interpret, and key that data into workpapers is slow, expensive, and error-prone.",
      },
      {
        label: 'Security Constraints',
        title: "Public AI is a compliance risk",
        body: "You know AI could extract data from financial records, but you can't put sensitive client information into public ChatGPT prompts. The risk holds the firm back from efficiency.",
      },
      {
        label: 'Consultant Fatigue',
        title: "Advisors who don't build",
        body: "You hire a consultancy for 'digital transformation' and get a 60-page PDF recommendation, but no running code. The bottlenecks stay exactly where they were.",
      },
    ],
    beforeAfter: [
      { before: "Junior staff spend 40 hours mapping transactions to the GL.",
        after: "An automated workflow maps the transactions; staff only review the exceptions." },
      { before: "Partners chase clients via email for missing K-1s.",
        after: "An autonomous system tracks missing documents and follows up." },
      { before: "You rent off-the-shelf software that doesn't fit.",
        after: "You own custom infrastructure built entirely around your process." },
      { before: "Consultants give you advice.",
        after: "Engineers hand you a running system." },
    ],
    process: [
      { title: "Audit the bottlenecks", body: "We map your actual operations to find the steps where highly paid professionals are doing data-entry work." },
      { title: "Design for security", body: "We architecture a solution with deployment options designed to keep sensitive financial data within your own cloud boundary." },
      { title: "Build the plumbing", body: "We connect your siloed systems (CRM, Practice Management, Tax Software) using robust workflow automation." },
      { title: "Implement review steps", body: "We never automate blindly. If the system is unsure about a tax document or GL code, it pauses for a human to review." },
    ],
    whyCustom: [
      "Built specifically for the exact way your firm operates.",
      "Connects to legacy accounting software that modern SaaS ignores.",
      "Deployment options designed to meet your strict data security and compliance requirements.",
      "A person always reviews edge cases, so your firm's reputation is never risked on a hallucination.",
    ],
    included: [
      "A deep operational audit to identify the most expensive manual processes",
      "Custom workflow architecture using enterprise-grade automation platforms (like n8n)",
      "Integration of AI models for unstructured document extraction (OCR/Vision)",
      "Secure deployment options tailored to your data privacy needs",
      "Human-in-the-loop review interfaces for exceptions",
      "Full documentation and a formal handover to your operations team",
    ],
    confidence: [
      { title: "We build, we don't just talk", body: "We aren't a traditional advisory firm. We are engineers who deploy running code that actually eliminates the manual work." },
      { title: "Security by design", body: "We understand that accounting data is sensitive. We offer self-hosted deployment options so your client data never leaves your environment." },
      { title: "Fixed outcomes", body: "Scope, timeline, and price are agreed upon before any build starts. We write down what the system has to do and what it costs." },
      OWNERSHIP,
    ],
    notIncluded: [
      "Buying more SaaS subscriptions. We connect what you already have.",
      "Offshoring your labor. We eliminate the labor requirement entirely.",
      "Public AI wrappers. We build secure, private infrastructure.",
      "Open-ended consulting retainers with no deliverables.",
    ],
    engagementNote: ENGAGEMENT,
    faqs: [
      { q: "Is our client data safe if we use AI?", a: "Security is the baseline. We design architectures that can run completely within your own cloud (like AWS or Azure). This ensures sensitive client documents are processed privately without being used to train public models." },
      { q: "Our tax software is archaic. Can you still integrate with it?", a: "Yes. Even if your software lacks a modern API, we can build custom connectors or utilize RPA-style interactions to ensure data flows securely between systems." },
      { q: "Will this replace our junior accountants?", a: "No. It elevates them. Instead of spending 100 hours doing manual data entry, your staff will spend 10 hours reviewing the system's outputs, freeing them to do actual analytical client work." },
      { q: "Why shouldn't we just use a SaaS product?", a: "SaaS works well for generic problems. But if your firm has unique workflows or siloed legacy systems, SaaS forces you into their box. Custom automation adapts to your firm, not the other way around." },
    ],
    related: ['document-processing-automation', 'cpa-tax-document-automation', 'system-data-integration'],
    stack: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'airtable.svg', name: 'Airtable' },
    ],
    heroPanel: {
      label: 'The outcome',
      items: [
        'Eliminate manual data entry.',
        'Connect siloed legacy systems.',
        'Secure client data handling.'
      ],
    },
    coversStrip: {
      label: 'Typical focus areas',
      items: [
        'Tax Document Extraction',
        'GL Code Mapping',
        'Audit Prep Automation',
        'Client Chasing',
        'Data Reconciliation'
      ],
      tail: 'or anywhere your team spends hours acting as a human bridge between systems.',
    },
    heroStats: [
      { value: 100, suffix: '%', label: 'auditability on automated actions' },
      { value: 0, suffix: ' lock-in', label: 'you own the infrastructure' },
    ],
    proofBlock: {
      metric: {
        value: '40',
        label: "percent reduction in audit prep time by extracting and structuring evidence automatically",
        source: "Mid-market CPA firm implementation. Eliminating manual unstructured data reading.",
      },
      mechanism:
        "The system monitors incoming client documents, extracts the relevant financial data using private vision models, and structures it into the required workpaper formats. If a document is blurry or missing pages, the workflow pauses and alerts a staff member to review it.",
    },
  }
];

export const SOLUTIONS_V2: Record<string, SolutionCard[]> = {
  'ai-sales-outreach-engine': [
    { title: "It finds out who just enquired", body: "Company, size, what they do, whether you have spoken before, attached to the record before anyone opens it.", roiImpact: "Fifteen minutes of looking things up, gone" },
    { title: "It replies while they are still interested", body: "A first response that refers to something true about that company, out in minutes rather than on Monday.", roiImpact: "The weekend gap closes" },
    { title: "It keeps following up until someone answers", body: "On a schedule, stopping the instant a human replies so nothing sends into a live conversation.", roiImpact: "The middle of the pipeline stops leaking" },
    { title: "It makes the calls nobody had time for", body: "A voice agent that introduces itself honestly, handles scheduling, and hands over when it turns into a real discussion.", roiImpact: "Calls that would not have happened" },
  ],
  'crm-automation-services': [
    { title: "Records that create themselves", body: "From the enquiry, the inbound email, the form, the call. Nobody has to remember to type them in.", roiImpact: "Current without depending on discipline" },
    { title: "The right person, with the context", body: "Routed by your own rules, with the background already attached to the record.", roiImpact: "No hunting before the first call" },
    { title: "What finance and support know", body: "Overdue invoices and open complaints visible on the account before anyone picks up the phone.", roiImpact: "One record holds the whole picture" },
    { title: "Reporting off records that are true", body: "Built last, on data that is actually current, so the monthly numbers stop needing two days of assembly.", roiImpact: "No more month-end archaeology" },
  ],
  'accounts-payable-automation': [
    { title: "It collects the post from everywhere", body: "Email, portals, shared folders, the photograph someone sent from site. Nothing waits to be gathered by hand.", roiImpact: "Nothing missed into a late fee" },
    { title: "It matches against what was ordered", body: "Line by line against the purchase order or contract, with anything that disagrees held back.", roiImpact: "Duplicates caught before payment" },
    { title: "It chases the approval for you", body: "Routed by your own delegation rules, escalating on its own when it stalls in somebody's inbox.", roiImpact: "A week of chasing becomes a day" },
    { title: "It posts, and keeps the record", body: "Into your accounting system, with a trail showing what was read, matched and approved by whom.", roiImpact: "Month end stops being a scramble" },
  ],
  'customer-support-automation': [
    { title: "It reads the actual account", body: "The order, the subscription, the charge. Not a help article about where the customer might look.", roiImpact: "Resolution instead of deflection" },
    { title: "It does the thing that was asked", body: "Makes the change, resends the invoice, updates the record, inside the systems that hold the answer.", roiImpact: "The routine queue thins out" },
    { title: "It hands over cleanly", body: "When it stops being routine, a person picks up with the whole conversation and account context already attached.", roiImpact: "Nobody repeats themselves" },
    { title: "It works at three in the morning", body: "Routine requests handled overnight, the rest queued with context so the early shift is not starting cold.", roiImpact: "Monday stops being the worst day" },
  ],
  'system-data-integration': [
    { title: "We find every manual handoff", body: "Including the Friday export and the spreadsheet that gets emailed around, which nobody counts as work.", roiImpact: "The hidden half-day surfaces" },
    { title: "We settle which system is right", body: "An agreed authority for each field, so two systems stop overwriting each other politely for months.", roiImpact: "One answer per question" },
    { title: "We make failure loud", body: "Retries, a queue that holds rather than drops, and an alert to a named person when something stops.", roiImpact: "No more discovering it in June" },
    { title: "We write down how it works", body: "What it does, what it assumes, and what to check when something looks wrong.", roiImpact: "The next person is not guessing" },
  ],
  'legacy-system-modernization': [
    { title: "We find the way in", body: "A database, an export, a file drop, a reporting tool. There is nearly always more available than people expect.", roiImpact: "A route where there was none" },
    { title: "We write down what it actually does", body: "Including the odd behaviours only one person knows about, which reduces your key-person risk on its own.", roiImpact: "Knowledge out of one head" },
    { title: "We build a modern access point", body: "So everything built afterwards talks to that, rather than to the old system directly.", roiImpact: "New projects stop stalling" },
    { title: "We leave the old system alone", body: "It keeps running exactly as it does today. No cutover, no migration, no downtime.", roiImpact: "Replacement becomes a choice" },
  ],
  'ai-agent-development': [
    { title: "One job, defined tightly", body: "Narrow enough that we can describe how to tell whether it worked, and test it against that.", roiImpact: "Testable instead of hopeful" },
    { title: "Limits built in, not requested", body: "Which systems it can reach and what it can do, enforced by the system rather than written in an instruction.", roiImpact: "The boundary actually holds" },
    { title: "Stopping behaviour first", body: "What happens when information is missing or the situation is unfamiliar, built before the main path.", roiImpact: "It hands over instead of inventing" },
    { title: "A full record of every run", body: "Each step it took and why, so a problem can be found and fixed rather than guessed at.", roiImpact: "Fixable, so it stays switched on" },
  ],
  'private-rag-knowledge-systems': [
    { title: "Answers, not a list of files", body: "Asked in plain language, answered in plain language, from your own policies and contracts.", roiImpact: "Two colleagues stop being the search engine" },
    { title: "The source, every time", body: "The document and the section it came from, so anyone can check it in seconds.", roiImpact: "Usable in regulated work" },
    { title: "Your permissions, respected", body: "People get answers drawn only from material they could already open.", roiImpact: "Not a way around access control" },
    { title: "It admits what it does not know", body: "Where the documents do not cover the question, it says so rather than assembling something plausible.", roiImpact: "Silence beats invention" },
  ],
  'secure-ai-deployment': [
    { title: "It runs where your data already sits", body: "Your cloud, a dedicated arrangement, or your own premises, chosen against the obligation that applies.", roiImpact: "Nothing regulated leaves" },
    { title: "Only named people can reach it", body: "Access is a list you control and review, not something that spreads informally through a department.", roiImpact: "Procurement can sign it off" },
    { title: "Every action is on the record", body: "Who asked, what was touched, what came back. Exportable, because somebody will eventually ask.", roiImpact: "An audit takes minutes" },
    { title: "Documented for whoever asks", body: "Written up for a client, an auditor or an insurer, so the answer does not need assembling under pressure.", roiImpact: "No scramble at review time" },
  ],
  'ai-automation': [
    { title: "We find the process worth doing", body: "A session on where the hours actually go, which usually turns up something that was not on anyone's list.", roiImpact: "The expensive step, not the loud one" },
    { title: "We build it into your existing tools", body: "The output lands in the system your team already has open, so there is no new habit to form.", roiImpact: "No new screen to learn" },
    { title: "We put a person on the exceptions", body: "Anything the system is unsure about waits for one of your team rather than deciding on its own.", roiImpact: "Your records stay trustworthy" },
    { title: "We hand it over properly", body: "Documented, running in your own accounts, so it does not depend on us or on one contractor.", roiImpact: "It survives the handover" },
  ],
  'business-process-automation-consulting': [
    { title: "The process as it really runs", body: "Mapped from the people doing it, workarounds and all, not from the version written down two years ago.", roiImpact: "The real eleven steps, not the tidy six" },
    { title: "A cost against every step", body: "How often, how long, and what it costs when it goes wrong, so priorities stop being an argument.", roiImpact: "Priorities settled with numbers" },
    { title: "A ranked build order", body: "What to do first, second and third, with the expected payback next to each one.", roiImpact: "Sequenced by payback" },
    { title: "The honest no", body: "The steps that are too rare or too varied to automate, and the ones that just need a rule changed.", roiImpact: "Money not spent badly" },
  ],
};
