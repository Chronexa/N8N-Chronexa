/**
 * Growth pages (2026-10-07): the AI-integration-partner positioning, one page per
 * buyer search family. Search data and page-1 checks behind each page are in
 * docs/research/seo-forensics-2026-10-06/PAGE-MAP.md. Rendered by
 * components/growth/GrowthPage.tsx. Worked ROI rows are illustrative and labelled so.
 */
type Card = { h: string; p: string; tag?: string };
export type GrowthPageData = {
  slug: string;
  kind: 'service' | 'guide';
  title: string;        // meta title, keyword first
  description: string;  // <= 160 chars
  crumb: string;
  serviceType: string;
  updated?: string;
  eyebrow: string;
  h1: [string, string];
  heroCopy: string;
  heroNote?: string;
  heroVisual?: 'card' | 'roi';
  card: { title: string; rows: { k: string; v?: string }[]; foot?: string };
  tools?: string[];
  problem: { eyebrow: string; h2: [string, string]; intro: string; cards: Card[] };
  prose?: { h: string; p: string[]; list?: string[] }[];
  steps: { eyebrow: string; h2: [string, string]; intro: string; items: { h: string; p: string; badge?: string }[] };
  builds: { eyebrow: string; h2: [string, string]; intro: string; items: Card[] };
  roi: { h2: [string, string]; intro: string; rows: [string, string, string][]; note?: string };
  wont: string[];
  close: { h2: [string, string]; p: string };
  faqs: { q: string; a: string }[];
  related: [string, string][];
};

// Shared building blocks, so the process reads the same on every page.
const PROCESS: GrowthPageData['steps']['items'] = [
  { h: 'We sit with the founders', p: 'One working session on how the business actually runs: the systems, the workflows, the people in each step, and the one lever that matters most this quarter.', badge: 'FREE' },
  { h: 'We audit your stack and your knowledge', p: 'Which tools you run, where data is retyped between them, where know-how lives only in people’s heads, and which work is worth automating at all.', badge: 'FREE' },
  { h: 'We build one workflow, free, inside a week', p: 'Not a demo. A real automation on your real tools, so you see the output and the time saved before you pay us anything.', badge: 'FREE' },
  { h: 'We size the next builds on ROI', p: 'Hours saved, capacity gained, revenue unlocked. Each next build is priced against that number and agreed in writing before we start.' },
  { h: 'We stay on as your AI team', p: 'We monitor, fix, extend and train. Workflows change as your strategy changes, so we do not hand over one automation and disappear.' },
];

const FAQ_PRICE = { q: 'How much does it cost?', a: 'There is no single price, because no two companies run the same way. The audit is free and the first workflow is free. After that, every build is priced against the return it produces, agreed in writing before work starts. Most clients start with one high-return workflow and add more once it pays for itself.' };
const FAQ_STACK = { q: 'Do we have to change our software?', a: 'No. Our first job is to connect what you already use. Where a tool has no connector, we build one through its API or a custom MCP server. If you want to move to a more modern stack, we will recommend tools, migrate your data and set it up, but we never force it.' };
const FAQ_SPEED = { q: 'How fast do you ship?', a: 'The first working automation goes live inside a week, including the infrastructure it runs on. Larger systems are shipped in weekly increments, so you see progress every week rather than at the end.' };
const FAQ_TEMPLATE = { q: 'Can’t we just use a template or an off-the-shelf tool?', a: 'For basic jobs, yes, and we will tell you when that is the right answer. Most apps now ship connectors and simple AI features. What they cannot do is understand your company: your strategy, your rules, your past work and the people who approve things. That knowledge is what makes automation behave like an experienced employee, and it has to be built for you.' };

export const GROWTH_PAGES: GrowthPageData[] = [
  // ───────────────────────────────────────────────────────────── how-we-work
  {
    slug: 'how-we-work', kind: 'service', crumb: 'How we work', serviceType: 'AI integration partnership',
    title: 'How We Work: Free AI Audit, First Workflow Free | Chronexa',
    description: 'Free AI audit, one workflow built free inside a week, then ROI-priced builds. How Chronexa works as your long-term AI integration partner.',
    eyebrow: 'HOW WE WORK',
    h1: ['We audit first.', 'Then we build what pays.'],
    heroCopy: 'Every engagement starts with the founders and a free audit of how your company really works. We build your first workflow free, ship it inside a week, and only then talk about what comes next.',
    card: { title: 'YOUR FIRST 7 DAYS', rows: [
      { k: 'Founder session: goals, levers, bottlenecks', v: 'Day 1' },
      { k: 'Audit: systems, workflows, people, knowledge', v: 'Day 1–2' },
      { k: 'Pick the one workflow with the biggest return', v: 'Day 2' },
      { k: 'Build it on your real tools', v: 'Day 3–6' },
      { k: 'Live, measured, handed to your team', v: 'Day 7' },
    ], foot: 'You pay nothing for any of this. If it does not save time, you walk away with the audit.' },
    problem: { eyebrow: 'WHY MOST AI PROJECTS STALL', h2: ['Templates break', 'on real companies.'], intro: 'We have watched the same automation work brilliantly in one company and fail in the next. The difference is never the tool. It is the strategy, the process and the people around it.',
      cards: [
        { tag: 'PROBLEM 01', h: 'Tools already do the basics', p: 'Every app ships connectors, MCP integrations and an AI button. Paying someone to rebuild those is money wasted. The value is in what tools cannot know about your business.' },
        { tag: 'PROBLEM 02', h: 'Knowledge lives in people', p: 'How you price, who approves what, which client needs special handling. Until that knowledge is written down and connected, no agent can act like an experienced employee.' },
        { tag: 'PROBLEM 03', h: 'Vendors hand off and leave', p: 'A workflow that fits today drifts as your business changes. One-off builds quietly break, and nobody notices until a client does.' },
      ] },
    steps: { eyebrow: 'THE PROCESS', h2: ['Five steps.', 'Three of them free.'], intro: 'We earn trust before we ask for money. You see a working result on your own tools before any proposal.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE BUILD WITH YOU', h2: ['End to end,', 'not one workflow.'], intro: 'We are your AI integration partner. That covers strategy, the knowledge layer, the automations, the infrastructure and the people who use them.',
      items: [
        { tag: 'STRATEGY', h: 'An AI roadmap sized on ROI', p: 'Which work to automate first, which to leave alone, and what each build is worth in hours and revenue.' },
        { tag: 'KNOWLEDGE', h: 'A company brain agents can use', p: 'Your processes, past work, rules and client history, organised so agents can research, draft, review and approve.' },
        { tag: 'AUTOMATION', h: 'Workflows across your tools', p: 'Reports, research, briefings, inbox triage, data entry, follow-ups, all running on the tools you already pay for.' },
        { tag: 'INTEGRATION', h: 'APIs and MCP servers for old tools', p: 'If something does not connect, we make it connect. Legacy systems included.' },
        { tag: 'INFRASTRUCTURE', h: 'Set up, hosted, monitored', p: 'Your data stays under your control. Every system checks its own output and alerts a human when it fails.' },
        { tag: 'PEOPLE', h: 'A team that is AI-native', p: 'Training so your people use AI properly, trust the systems and keep improving them.' },
      ] },
    roi: { h2: ['Same team,', 'five times the clients.'], intro: 'We judge every build on one question: how much more can the same people deliver? Time saved only matters when it turns into capacity, and capacity turns into revenue.',
      rows: [['Team', '10 people', '10 people'], ['Clients served per month', '100', '300–500'], ['Hours of manual work per client', '6', '1–2'], ['Revenue per employee', '$180k', '$540k+']] },
    wont: ['Rebuilding a connector your tool already ships', 'Automating a process nobody has agreed on yet', 'Fully autonomous decisions where a human must sign off', 'A big-bang system with nothing live for months', 'Anything we cannot measure the return of'],
    close: { h2: ['Start with', 'a free audit.'], p: 'Bring the part of the business that eats the most hours. We map it with you, build the first workflow free, and show you the return before you spend anything.' },
    faqs: [
      { q: 'What happens in the free audit?', a: 'A working session with the founders, then a look at your tools, workflows and where knowledge lives. You leave with a ranked list of what is worth automating, what is not, and the expected return of each.' },
      { q: 'Is the first workflow really free?', a: 'Yes. We build one real workflow on your real tools, live inside a week. It is how we prove the approach works for your company before asking for a commitment.' },
      FAQ_PRICE, FAQ_STACK, FAQ_SPEED, FAQ_TEMPLATE,
    ],
    related: [['/ai-automation-agency', 'AI automation agency'], ['/ai-roi-calculator', 'AI ROI calculator'], ['/ai-knowledge-systems', 'AI knowledge systems'], ['/ai-automation-cost', 'What AI automation costs']],
  },

  // ─────────────────────────────────────────────────── ai-automation-agency
  {
    slug: 'ai-automation-agency', kind: 'service', crumb: 'AI automation agency', serviceType: 'AI automation services',
    title: 'AI Automation Agency & Services: Audit First, Build Free',
    description: 'AI automation agency and services company: we audit your business, build the first workflow free and ship automations in a week. Strategic, not templated.',
    eyebrow: 'AI AUTOMATION AGENCY',
    h1: ['Your AI integration partner,', 'not a workflow vendor.'],
    heroCopy: 'We are the AI automation agency that sits with your founders, learns how your company works, and builds the systems that let the same team serve far more clients. Audit free, first workflow free, live in a week.',
    card: { title: 'WHAT CLIENTS AUTOMATE FIRST', rows: [
      { k: 'Research, reports and presentations', v: '-70% time' },
      { k: 'Daily morning briefing in Slack', v: 'Daily' },
      { k: 'Inbox triage and drafted replies', v: '-60% time' },
      { k: 'Data entry between disconnected tools', v: '0 retyping' },
      { k: 'Client onboarding and follow-ups', v: '3× capacity' },
    ], foot: 'Typical first builds. Figures are illustrative targets, set properly in your audit.' },
    problem: { eyebrow: 'WHY HIRE AN AGENCY AT ALL', h2: ['The easy automation', 'is already in your tools.'], intro: 'If a job can be done with a connector or a template, you should not pay an agency for it. You hire one for the work that needs real knowledge of your business.',
      cards: [
        { tag: 'TEMPLATED', h: 'Connects app A to app B', p: 'Moves data when something happens. Useful, cheap, and something your tools increasingly do on their own.' },
        { tag: 'STRATEGIC', h: 'Understands your company', p: 'Knows your clients, your pricing, your rules and who approves what, so it can research, draft, check and decide what goes to a human.' },
        { tag: 'OUR JOB', h: 'Build the strategic layer', p: 'Centralise your knowledge, connect every tool, and build agents that act like an experienced employee, with people reviewing what matters.' },
      ] },
    steps: { eyebrow: 'HOW AN ENGAGEMENT RUNS', h2: ['Audit, build free,', 'then partner.'], intro: 'We earn the right to your budget by shipping something useful first.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE AUTOMATE', h2: ['The work that', 'eats your week.'], intro: 'Most of it is research, writing, checking and moving information between tools. That is exactly where AI with company knowledge performs best.',
      items: [
        { tag: 'REPORTING', h: 'Reports, decks and analysis', p: 'Data pulled from your tools, analysed, written up in your format and sent for review.' },
        { tag: 'BRIEFINGS', h: 'A daily briefing that writes itself', p: 'Pipeline, cash, client issues and what needs you today, delivered to Slack or email every morning.' },
        { tag: 'INBOX', h: 'Email organised and answered', p: 'Triage, priority, drafted replies that know your clients and your policies, sent only after approval.' },
        { tag: 'CONTENT', h: 'Research and content', p: 'Gathering sources, drafting, editing to your voice, and publishing with a human sign-off.' },
        { tag: 'OPERATIONS', h: 'Onboarding, follow-ups, data entry', p: 'The repetitive work between tools, done once, correctly, without retyping.' },
        { tag: 'AGENTS', h: 'Reviewers and approvers', p: 'Agents that check work against your rules and only escalate what genuinely needs a person.' },
      ] },
    roi: { h2: ['We measure', 'revenue per employee.'], intro: 'Saved hours are only a means. The real number is how many more clients your current team can serve, and what that is worth.',
      rows: [['Hours on manual work per week', '120', '35'], ['Clients served per month', '100', '250'], ['New hires needed to grow', '5', '0–1'], ['Annual revenue capacity', '$1.8M', '$4.5M']] },
    wont: ['Template automations you could build in an afternoon', 'Stack migrations you did not ask for', 'AI that sends to clients without a human approving it', 'Projects with nothing live in the first week', 'Builds where we cannot show you the return'],
    close: { h2: ['See it work', 'before you pay.'], p: 'Book the free audit. We will map your business, pick the workflow with the biggest return, and build it free inside a week.' },
    faqs: [
      { q: 'What does an AI automation agency actually do?', a: 'We find the work in your business that is repetitive, slow or dependent on retyping, connect the tools involved, give AI access to the knowledge it needs, and build systems that do that work with people reviewing the output. Then we keep improving them as your business changes.' },
      { q: 'How are you different from other AI automation agencies?', a: 'Three things. We audit and build the first workflow free. We build company knowledge, not just connections, so agents act on context. And we stay as your ongoing AI team instead of handing over one workflow and leaving.' },
      FAQ_PRICE, FAQ_SPEED, FAQ_STACK, FAQ_TEMPLATE,
      { q: 'Which tools do you work with?', a: 'Whatever you run: Google Workspace, Microsoft 365, Slack, HubSpot, Salesforce, QuickBooks, Xero, Notion, Airtable, practice-management and industry tools, plus n8n, Claude and OpenAI underneath. If it has an API, or even just a database or export, we can connect it.' },
      { q: 'What AI automation services do you offer?', a: 'Audits of how your company works, AI agents and workflows built on your existing tools, integrations for tools that do not connect, automated reports and inbox handling, knowledge systems your agents can use, and training so your team works with them. Every build starts from the audit and the first workflow is free.' },
      { q: 'What is the difference between an automation company and an AI automation agency?', a: 'A traditional automation company wires apps together with fixed rules: when this happens, do that. An AI automation agency also builds steps that read, write, classify and check, using your company knowledge, with a person approving anything that matters. That is why the audit comes first: it shows which jobs need rules and which need judgement.' },
      { q: 'How do I choose an AI automation agency?', a: 'Ask who will build your system and meet them, ask what you will have after the first week, ask how they price (against a return or by the hour), and ask what happens to your data. Be wary of agencies that quote before looking at your tools, or that cannot show a working workflow before you pay. Our guide to the best AI automation agencies covers this in more detail.' },
    ],
    related: [['/how-we-work', 'How we work'], ['/ai-strategy-consulting', 'AI strategy consulting'], ['/ai-integration-services', 'AI integration services'], ['/ai-automation-cost', 'What AI automation costs']],
  },

  // ────────────────────────────────────────────────── ai-strategy-consulting
  {
    slug: 'ai-strategy-consulting', kind: 'service', crumb: 'AI strategy consulting', serviceType: 'AI strategy consulting',
    title: 'AI Strategy Consultant: Audit-First, ROI-Sized AI Plans',
    description: 'AI strategy consultant and AI readiness assessment that end in working systems, not slides. Free audit, ROI-ranked roadmap, first workflow built free.',
    eyebrow: 'AI STRATEGY CONSULTING',
    h1: ['AI strategy that ends', 'in something running.'],
    heroCopy: 'Most AI strategy work ends with a deck. Ours ends with a ranked roadmap sized on revenue, and the first item already live on your tools. We consult and we build, so the plan has to be one we can deliver.',
    card: { title: 'YOUR AI ROADMAP', rows: [
      { k: 'Client reporting automation', v: '$140k/yr' },
      { k: 'Knowledge base for proposals', v: '$90k/yr' },
      { k: 'Inbox and follow-up agent', v: '$60k/yr' },
      { k: 'CRM data hygiene', v: '$25k/yr' },
      { k: 'Chatbot on the website', v: 'Not yet' },
    ], foot: 'Example roadmap, ranked by value. Your audit produces the real one.' },
    problem: { eyebrow: 'WHY AI STRATEGY FAILS', h2: ['Good slides,', 'nothing shipped.'], intro: 'AI strategy goes wrong in predictable ways. All three come from separating the people who plan from the people who build.',
      cards: [
        { tag: 'FAILURE 01', h: 'Ranked by excitement, not return', p: 'The flashy chatbot gets built first. The boring reporting job that would save 20 hours a week waits a year.' },
        { tag: 'FAILURE 02', h: 'Plans no one can build', p: 'Roadmaps written without looking at your actual tools, data and permissions fall apart in implementation.' },
        { tag: 'FAILURE 03', h: 'No owner after the deck', p: 'The consultant leaves, the team is busy, and the plan quietly becomes last year’s document.' },
      ] },
    prose: [
      { h: 'What an AI readiness assessment covers', p: ['An AI readiness assessment answers four questions before any money is spent. Where does the work actually happen, and how much of it is repetitive? Is the data and knowledge AI would need reachable and trustworthy? Which tools and permissions are in place? And who has to approve the result, and how will you know it works?', 'Companies that skip this step tend to start with the most exciting idea rather than the most valuable one. The assessment turns a long list of ideas into a short ranked one, each with a rough size of return.'] },
    ],
    steps: { eyebrow: 'OUR METHOD', h2: ['Strategy you can', 'test in a week.'], intro: 'The audit is the strategy. The free first workflow is the proof that it holds up.', items: PROCESS },
    builds: { eyebrow: 'WHAT YOU GET', h2: ['A plan built on', 'your real numbers.'], intro: 'Every recommendation is tied to hours, capacity and revenue, and to a tool you already own or a specific one we recommend.',
      items: [
        { tag: '01', h: 'Workflow and time map', p: 'Where the hours go, by team and by task, measured with your people.' },
        { tag: '02', h: 'ROI-ranked roadmap', p: 'Each opportunity sized on time saved, capacity gained and revenue unlocked, in order.' },
        { tag: '03', h: 'Knowledge gap report', p: 'What your agents would need to know, and where that knowledge lives today.' },
        { tag: '04', h: 'Tool recommendations', p: 'Keep, connect or replace, with honest reasons. We never force a migration.' },
        { tag: '05', h: 'Risk and approval design', p: 'Where humans must review, what data AI may touch, and how failures get caught.' },
        { tag: '06', h: 'First build, live', p: 'The top item on the roadmap, shipped free inside a week.' },
      ] },
    roi: { h2: ['Ranked by', 'what it earns.'], intro: 'We rank AI opportunities the way a CFO would: by the return per week of effort, not by how impressive they look.',
      rows: [['Opportunities identified', 'Unranked list', '12, ranked by return'], ['Time to first result', '3–6 months', '7 days'], ['Cost of the strategy', 'Consulting fee', 'Free audit'], ['Who builds it', 'Another vendor', 'Same team']] },
    wont: ['A roadmap with no numbers attached', 'Recommending tools we cannot deliver', 'AI projects chosen for the press release', 'Strategy work that ships nothing', 'Telling you to replace a stack that works'],
    close: { h2: ['Get a strategy', 'that ships.'], p: 'Book the free audit. You leave with a ranked AI roadmap for your company, and we build the first item free.' },
    faqs: [
      { q: 'What does an AI strategy consultant do?', a: 'Works out where AI will produce real returns in your business, in what order, with which tools and safeguards. A good one also tells you where AI should not be used yet. We do this through a hands-on audit and then build the first piece ourselves.' },
      { q: 'How long does the strategy take?', a: 'The audit takes one to two working sessions. You have a ranked roadmap within days and the first workflow live within a week.' },
      FAQ_PRICE,
      { q: 'Do you only advise, or also implement?', a: 'Both. We think strategy is only credible if the same people have to deliver it, so we build what we recommend and stay on as your AI team.' },
      FAQ_STACK,
      { q: 'What is an AI readiness assessment?', a: 'A structured look at whether your business is ready to use AI: how your work flows, how clean and reachable your data is, which tools you run, who approves what, and where the risks sit. The output is a ranked list of what to do first and what to fix before you start. Our free audit is a readiness assessment that also builds the first workflow.' },
      { q: 'What is the difference between an AI strategy consultant and an AI consultant?', a: 'The titles overlap. A strategy consultant focuses on choosing what to do and in what order. An AI consultant may also help you implement it. We do both: the audit produces the strategy and the first build tests it.' },
    ],
    related: [['/how-we-work', 'How we work'], ['/ai-roi-calculator', 'AI ROI calculator'], ['/ai-automation-agency', 'AI automation agency'], ['/ai-training-for-employees', 'AI training for employees']],
  },

  // ───────────────────────────────────────────────────────────── ai-consultant
  {
    slug: 'ai-consultant', kind: 'service', crumb: 'AI consultant', serviceType: 'AI consulting', updated: '2026-10-08',
    title: 'AI Consultant for Business: Audit First, Then We Build',
    description: 'Hire an AI consultant who audits how your company works, then builds the first workflow free inside a week. AI consulting for growing businesses.',
    eyebrow: 'AI CONSULTANT · AI CONSULTING FIRM',
    h1: ['An AI consultant who', 'builds what they recommend.'],
    heroCopy: 'Most AI consultants hand you a report. We audit how your company really works, find the work AI can safely take over, and build the first workflow free inside a week. One team from advice to a system that runs.',
    card: { title: 'WHAT AN AI CONSULTANT SHOULD GIVE YOU', rows: [
      { k: 'A map of where the hours go', v: 'Week 1' },
      { k: 'A ranked list of what to automate', v: 'Week 1' },
      { k: 'One working workflow on your tools', v: 'Week 1' },
      { k: 'A written price for each next build', v: 'Week 2' },
    ], foot: 'Free audit. Free first workflow.' },
    problem: { eyebrow: 'WHY COMPANIES HIRE AN AI CONSULTANT', h2: ['Too many options.', 'No one to own them.'], intro: 'Most leaders hiring an AI consultant are not short of ideas. They are short of someone who can tell them which three matter and then make one of them work.',
      cards: [
        { tag: 'PROBLEM 01', h: 'A long list and no order', p: 'Every team has an AI idea. Without a ranking by return, the loudest idea gets built first and the profitable one waits.' },
        { tag: 'PROBLEM 02', h: 'Pilots that never reach production', p: 'A demo works on clean data. Real work has exceptions, permissions and approvals, and the pilot stalls there.' },
        { tag: 'PROBLEM 03', h: 'Advice without delivery', p: 'A strategy deck is only useful if someone can build it. Handing it to a second vendor adds months and loses context.' },
      ] },
    prose: [
      { h: 'What does an AI consultant do?', p: ['An AI consultant works out where artificial intelligence will pay back in your business, in what order, with which tools and which safeguards. A good one also tells you where AI should not be used yet.', 'In practice that means three jobs: understanding how your teams actually work, choosing the few workflows where AI removes real effort, and making sure those workflows are safe, reviewed and measurable. The best consultants also build the first one, because a plan that nobody can implement is not worth much.'] },
      { h: 'AI consultant, AI consulting firm or freelancer?', p: ['A freelance AI consultant is usually the cheapest way to get an opinion. It works well for a narrow question, such as which tool to use for one job. The risk is capacity: one person rarely covers strategy, integration, security and implementation.', 'An AI consulting firm covers more ground and can stay with you after the first project. The risk is distance: the people who sell the work are not always the people who do it. Ask who exactly will build your system, and ask to speak to them before you sign.'] },
      { h: 'How much does an AI consultant cost?', p: ['AI consultants charge in three ways: by the hour, by a fixed project fee, or on a monthly retainer. Hourly suits a short advisory question. Fixed fees suit a defined deliverable such as an audit and roadmap. Retainers suit ongoing work where the scope changes as you learn.', 'There is no honest single number, because scope varies so much. We start with a free audit and a free first workflow, then price each further build in writing against the return it produces. Our page on [what AI automation costs](/ai-automation-cost) shows what drives the price.'] },
      { h: 'Six questions to ask before you hire one', p: ['Whoever you are considering, these separate consultants who deliver from those who present:'], list: [
        'Who will actually do the work, and can I meet them first?',
        'What will I have in my hands after the first week?',
        'How do you rank opportunities: by return, or by what looks impressive?',
        'What happens to my data, and which models and tools will touch it?',
        'Where will a person review the AI’s work before it reaches a client?',
        'What would make you advise me not to use AI for this?',
      ] },
      { h: 'AI consulting for small and mid-sized businesses', p: ['Smaller companies often get the most from a consultant, because a few repeated jobs consume a large share of the team: reporting, inbox handling, data entry between tools, client onboarding. You do not need a data science team or a large budget. You need the right first workflow and someone who builds it on the software you already use.'] },
      { h: 'Generative AI consulting', p: ['Generative AI consulting covers using language models to read, write, summarise and answer questions inside your business. The useful work is rarely the chatbot. It is connecting a model to your own documents, rules and tools so its output reads like it came from an experienced member of your team, and putting review steps around it. That is the work we do.'] },
    ],
    steps: { eyebrow: 'HOW WE CONSULT', h2: ['An engagement you can', 'judge in a week.'], intro: 'The audit is the consulting. The free first workflow is the proof that the advice holds up on your real tools.', items: PROCESS },
    builds: { eyebrow: 'WHAT YOU GET', h2: ['Advice you can', 'point at.'], intro: 'Every deliverable is something concrete, tied to hours, capacity or revenue.',
      items: [
        { tag: '01', h: 'Workflow and time map', p: 'Where the hours go, by team and task, measured with your people rather than guessed.' },
        { tag: '02', h: 'ROI-ranked roadmap', p: 'Each opportunity sized on time saved, capacity gained and revenue unlocked, in order.' },
        { tag: '03', h: 'Tool and data review', p: 'What you already own that can do the job, what to connect, and what to leave alone.' },
        { tag: '04', h: 'Risk and approval design', p: 'Where humans review, what data AI may touch, and how failures are caught.' },
        { tag: '05', h: 'A working first build', p: 'The top item on the roadmap, live on your tools inside a week.' },
        { tag: '06', h: 'An ongoing partner', p: 'We monitor, extend and train your team, so the system keeps up with the business.' },
      ] },
    roi: { h2: ['What good', 'consulting changes.'], intro: 'A useful AI consultant moves three numbers: hours spent on manual work, how many clients the same team can serve, and revenue per employee.',
      rows: [['Time to first result', '3 to 6 months', '7 days'], ['Opportunities ranked by return', 'A list of ideas', 'Ranked, with numbers'], ['Who builds it', 'A second vendor', 'The same team']] },
    wont: ['Recommending AI where a simple rule works', 'A roadmap with no numbers attached', 'Tools we cannot deliver or support', 'Projects chosen for the press release', 'Telling you to replace a stack that works'],
    close: { h2: ['Talk to an AI consultant', 'who ships.'], p: 'Book the free audit. You leave with a ranked view of what AI can do for your company, and we build the first item free.' },
    faqs: [
      { q: 'What does an AI consultant do?', a: 'An AI consultant works out where AI will produce real returns in your business, in what order, with which tools and safeguards, and tells you where it should not be used yet. We also build the first workflow ourselves, because advice is only credible when the same people have to deliver it.' },
      { q: 'How much does an AI consultant cost?', a: 'It depends on scope and on how the consultant charges: hourly, a fixed project fee or a retainer. We start with a free audit and a free first workflow, then price each further build in writing against the return it produces, so you never pay for a roadmap you cannot use.' },
      { q: 'What is the difference between an AI consultant and an AI consulting firm?', a: 'A freelance consultant is one person and suits a narrow question. A firm brings several skills (strategy, integration, security, implementation) and can stay on after the first project. Whichever you choose, ask who will actually build your system and meet them before you sign.' },
      { q: 'Can a small business hire an AI consultant?', a: 'Yes, and small teams often benefit most, because a few repeated jobs such as reporting, inbox handling and re-keying data take a large share of everyone’s week. You need the right first workflow, not a big budget or a technical team.' },
      { q: 'What is generative AI consulting?', a: 'Advice and delivery on using language models inside your business: reading documents, drafting replies and reports, answering questions from your own knowledge, with human review where it matters. The value is in connecting the model to your documents, rules and tools, not in the chatbot itself.' },
      { q: 'Do you work remotely?', a: 'Yes. We serve companies in the US, UK, Canada and the UAE, mostly over video and on your existing tools, so there is no need for an on-site team. If you want an in-person workshop for your leadership team, we can arrange it.' },
      { q: 'Will you tell me if AI is not the answer?', a: 'Yes. Where a simple rule, a spreadsheet or a connector between two tools does the job, we say so and do not build more than you need. Saying no to the wrong project is part of the work.' },
      FAQ_STACK,
    ],
    related: [['/ai-strategy-consulting', 'AI strategy consulting'], ['/ai-automation-agency', 'AI automation agency'], ['/ai-agent-development', 'AI agent development'], ['/ai-automation-cost', 'What AI automation costs']],
  },

  // ──────────────────────────────────────────────────── ai-knowledge-systems
  {
    slug: 'ai-knowledge-systems', kind: 'service', crumb: 'AI knowledge systems', serviceType: 'AI knowledge management',
    title: 'AI Knowledge Management: A Company Brain Agents Can Use',
    description: 'AI knowledge management that centralises your processes, past work and rules so agents can research, draft, review and approve like an expert.',
    eyebrow: 'AI KNOWLEDGE MANAGEMENT',
    h1: ['Intelligence is not a model.', 'It is what your company knows.'],
    heroCopy: 'An agent with no knowledge of your business is a fast intern. We centralise your processes, past work, client history and rules into a knowledge system agents can read, so they act like your most experienced people.',
    card: { title: 'WHAT THE AGENT CAN SEE', rows: [
      { k: 'How you price and what you never discount', v: 'Rules' },
      { k: 'Every past proposal, report and decision', v: 'History' },
      { k: 'Client preferences and open issues', v: 'CRM' },
      { k: 'Who approves what, and when', v: 'Roles' },
      { k: 'What it must never answer', v: 'Limits' },
    ], foot: 'Permissions follow your existing access rules. Nobody sees through the agent what they could not see before.' },
    problem: { eyebrow: 'WHY AGENTS DISAPPOINT', h2: ['Smart model,', 'no context.'], intro: 'Every AI tool now ships connectors. Connecting to your drive is not the same as understanding it. That gap is why most company agents give generic, untrusted answers.',
      cards: [
        { tag: 'SCATTERED', h: 'Knowledge lives in five places', p: 'Docs, email, chat, the CRM and the heads of three senior people. No agent can reason across that.' },
        { tag: 'UNWRITTEN', h: 'The rules are tribal', p: 'How exceptions are handled and who signs off are rarely written down, so agents cannot follow them.' },
        { tag: 'UNTRUSTED', h: 'Answers without sources', p: 'If an answer cannot point to where it came from, nobody senior will rely on it.' },
      ] },
    steps: { eyebrow: 'HOW WE BUILD IT', h2: ['From tribal knowledge', 'to a company brain.'], intro: 'We start from the decisions your people make, then build the knowledge each decision needs.', items: [
      { h: 'Map the decisions', p: 'Which judgement calls your team makes daily, and what they look at to make them.', badge: 'FREE' },
      { h: 'Gather and structure the knowledge', p: 'Documents, past work, rules and client history, cleaned, organised and kept current automatically.' },
      { h: 'Write down the unwritten rules', p: 'Sessions with senior people to capture how they decide, turned into rules agents can follow.' },
      { h: 'Connect agents with permissions', p: 'Agents read only what the person using them is allowed to see, and cite every source.' },
      { h: 'Make agents reviewers, not just writers', p: 'Agents check work against your rules and approve, flag or escalate it, so seniors review exceptions only.' },
    ] },
    builds: { eyebrow: 'WHAT IT POWERS', h2: ['One knowledge layer,', 'many agents.'], intro: 'Build the knowledge once and every new automation gets smarter for free.',
      items: [
        { h: 'Proposal and report drafting', p: 'Drafts that reuse your best past work, your pricing and your voice.' },
        { h: 'Internal Q&A with sources', p: '“How do we handle X?” answered in seconds, with the document it came from.' },
        { h: 'Quality review', p: 'Every deliverable checked against your standards before a senior sees it.' },
        { h: 'Client replies', p: 'Email drafts that know the client’s history and your policies.' },
        { h: 'Onboarding new hires', p: 'New people productive in weeks, not months, because the know-how is searchable.' },
        { h: 'Research', p: 'Agents that search your own archive before the internet.' },
      ] },
    roi: { h2: ['Senior time', 'is the real cost.'], intro: 'The biggest return from a knowledge system is getting senior people out of answering, reviewing and rewriting.',
      rows: [['Senior hours on reviews and questions / week', '25', '6'], ['Time to answer an internal question', '1 day', '30 seconds'], ['New-hire ramp-up', '4 months', '6 weeks'], ['Drafts rewritten by seniors', 'Most', 'Few']] },
    wont: ['An agent that answers without citing a source', 'Access that bypasses your existing permissions', 'Uploading client data to tools you do not control', 'A chatbot bolted onto an unorganised drive', 'Letting agents approve work outside agreed limits'],
    close: { h2: ['Build the brain', 'once.'], p: 'Book the free audit. We map the decisions your team makes and build the first knowledge-backed workflow free.' },
    faqs: [
      { q: 'What is AI knowledge management?', a: 'Organising what your company knows, documents, past work, rules and client history, so that AI agents can find it, reason over it and cite it. It is what turns a generic AI model into something that answers like your own experienced staff.' },
      { q: 'Is this just RAG?', a: 'Retrieval is one part. The harder parts are deciding what knowledge matters, capturing rules that were never written down, keeping it current, and enforcing who may see what. That is most of the work and most of the value.' },
      { q: 'Where does our data live?', a: 'In infrastructure you control, inside your own cloud or accounts where possible. Agents inherit your existing permissions.' },
      FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/ai-agent-development', 'AI agent development'], ['/custom-mcp-server-development', 'Custom MCP servers'], ['/automated-reporting', 'Automated reporting'], ['/how-we-work', 'How we work']],
  },

  // ───────────────────────────────────────────────── ai-integration-services
  {
    slug: 'ai-integration-services', kind: 'service', crumb: 'AI integration services', serviceType: 'AI integration services',
    title: 'AI Integration Services: Connect the Tools You Already Use',
    description: 'AI integration services: API, system and data integration across your existing tools, legacy included, with AI on top. No forced stack change. Live in a week.',
    eyebrow: 'AI INTEGRATION SERVICES',
    h1: ['Keep your tools.', 'Make them work together.'],
    heroCopy: 'Our first priority is to interlink everything you already use. Where tools do not connect, we build the APIs and MCP servers that make them connect, then put AI on top of the joined-up data.',
    tools: ['QuickBooks', 'HubSpot', 'Salesforce', 'Slack', 'Google Sheets', 'Legacy SQL'],
    card: { title: 'INTEGRATION MAP', rows: [
      { k: 'CRM ↔ accounting', v: 'API' },
      { k: 'Practice system ↔ document store', v: 'API' },
      { k: 'Legacy database ↔ AI agents', v: 'MCP' },
      { k: 'Email ↔ CRM ↔ Slack', v: 'Workflow' },
      { k: 'Old desktop tool with no API', v: 'Custom bridge' },
    ], foot: 'Every connection logs what it moved and alerts a person when something fails.' },
    problem: { eyebrow: 'THE REAL PROBLEM', h2: ['Your team is', 'the integration.'], intro: 'In most companies, the connection between tools is a person copying and pasting. That is the first cost AI integration removes.',
      cards: [
        { tag: 'RETYPING', h: 'Same data, entered three times', p: 'Client details in the CRM, the billing system and a spreadsheet, each slightly different.' },
        { tag: 'LEGACY', h: 'The tool that will not connect', p: 'An older system with no modern API that the business still depends on.' },
        { tag: 'BLIND AI', h: 'AI that sees one tool at a time', p: 'An assistant inside one app cannot answer questions that span your whole business.' },
      ] },
    steps: { eyebrow: 'HOW WE INTEGRATE', h2: ['Connect first,', 'automate second.'], intro: 'Integration is the foundation. Every later automation depends on it.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE CONNECT', h2: ['If it holds data,', 'we can reach it.'], intro: 'Modern SaaS, older on-premise systems, databases, spreadsheets and email inboxes.',
      items: [
        { h: 'SaaS to SaaS', p: 'CRM, accounting, project, support and communication tools synced both ways.' },
        { h: 'Custom APIs', p: 'Clean APIs on top of systems that only expose a database or file export.' },
        { h: 'MCP servers', p: 'So Claude, ChatGPT and your own agents can safely read and act in your systems.' },
        { h: 'Legacy bridges', p: 'Older desktop and on-premise software connected without replacing it.' },
        { h: 'Data pipelines', p: 'Your data joined in one place, ready for reporting and AI.' },
        { h: 'Monitoring', p: 'Every integration checks itself and tells a human when something breaks.' },
      ] },
    roi: { h2: ['Retyping is', 'pure cost.'], intro: 'Integration savings are the easiest to measure: every field nobody has to retype, and every error that never happens.',
      rows: [['Hours retyping data / week', '30', '2'], ['Errors from manual entry / month', '40', '<5'], ['Reports that need data from 3+ tools', 'Half a day', 'Automatic'], ['Tools replaced', '—', 'None required']] },
    wont: ['Forcing you onto a new platform', 'Point-to-point hacks with no monitoring', 'Integrations that silently fail', 'Storing your data somewhere you do not control', 'Rebuilding a connector your tool already offers'],
    close: { h2: ['Connect what', 'you already own.'], p: 'Book the free audit. We map where data is retyped today and build the first integration free.' },
    faqs: [
      { q: 'What are AI integration services?', a: 'Connecting your business tools to each other and to AI, so data flows without retyping and AI agents can work across all of it. That includes APIs, MCP servers, data pipelines and bridges to older systems.' },
      { q: 'Can you integrate legacy systems?', a: 'Yes. If a system has a database, a file export or even a stable screen, we can usually build a reliable bridge without replacing it.' },
      FAQ_STACK, FAQ_PRICE, FAQ_SPEED,
      { q: 'What is the difference between API integration, system integration and data integration?', a: 'API integration connects two tools through their published interfaces so they exchange records automatically. System integration joins several systems, often with different formats and owners, into one working process. Data integration moves and reconciles data into one trusted place such as a warehouse or knowledge layer. Most projects use all three, and the audit shows which ones you need.' },
      { q: 'How much do AI integration services cost?', a: 'It depends on how many systems are involved and whether they have usable APIs. We start with a free audit and a free first integration, then price each further piece in writing against the time it saves. See our page on what AI automation costs for the factors that drive the price.' },
    ],
    related: [['/custom-mcp-server-development', 'Custom MCP servers'], ['/tech-stack-migration', 'Tech stack migration'], ['/ai-automation-agency', 'AI automation agency'], ['/how-we-work', 'How we work']],
  },

  // ─────────────────────────────────────────── custom-mcp-server-development
  {
    slug: 'custom-mcp-server-development', kind: 'service', crumb: 'Custom MCP server development', serviceType: 'MCP server development',
    title: 'Custom MCP Server Development for Business Systems',
    description: 'Custom MCP server development: give Claude, ChatGPT and your own agents secure access to internal and legacy systems that have no connector.',
    eyebrow: 'CUSTOM MCP SERVER DEVELOPMENT',
    h1: ['Your systems,', 'readable by AI.'],
    heroCopy: 'MCP is how AI assistants like Claude and ChatGPT talk to other software. Popular apps ship their own servers. Your internal tools, older systems and custom databases do not. We build custom MCP servers for them, with the permissions and audit trail a business needs.',
    tools: ['Claude', 'ChatGPT', 'Cursor', 'n8n', 'Postgres', 'Internal APIs'],
    card: { title: 'MCP SERVER: ops-internal', rows: [
      { k: 'get_client_history(client_id)', v: 'read' },
      { k: 'search_past_proposals(query)', v: 'read' },
      { k: 'create_draft_invoice(…)', v: 'approval' },
      { k: 'update_crm_stage(…)', v: 'approval' },
      { k: 'delete_record(…)', v: 'blocked' },
    ], foot: 'Every tool call is logged with who asked, what ran and what came back.' },
    problem: { eyebrow: 'WHY CUSTOM', h2: ['Public servers cover', 'public apps.'], intro: 'The tools that hold your real advantage, your internal database, your job system, the older tool everyone depends on, will never get an official MCP server.',
      cards: [
        { tag: 'GAP', h: 'No server exists', p: 'Internal and niche software is invisible to AI assistants until someone builds the bridge.' },
        { tag: 'RISK', h: 'Too much access', p: 'Generic servers often expose everything. Businesses need read, write and approve rules per tool.' },
        { tag: 'TRUST', h: 'No audit trail', p: 'If you cannot see what the AI did in your systems, you cannot let it do anything important.' },
      ] },
    steps: { eyebrow: 'HOW WE BUILD', h2: ['Small, safe,', 'then wider.'], intro: 'We start read-only on one system, prove it is useful, then add actions behind approvals.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE DELIVER', h2: ['Production MCP,', 'not a demo.'], intro: 'Hosted where you choose, documented, monitored and maintained.',
      items: [
        { h: 'Tool design', p: 'The right actions for your workflows, named so models use them correctly.' },
        { h: 'Permissions per user', p: 'The AI acts with the access of the person using it, never more.' },
        { h: 'Approval gates', p: 'Write actions wait for a human yes where it matters.' },
        { h: 'Audit logging', p: 'Every call recorded for review and compliance.' },
        { h: 'Legacy adapters', p: 'Servers on top of databases, files and older software without APIs.' },
        { h: 'Agent workflows', p: 'n8n and custom agents that use the server to run real processes.' },
      ] },
    roi: { h2: ['Ask your systems', 'in plain English.'], intro: 'The return comes from people getting answers and actions from internal systems without opening five screens or asking a colleague.',
      rows: [['Lookups across internal systems / day', '40 manual', 'Asked in chat'], ['Time per lookup', '6 min', '20 sec'], ['Systems AI can reach', 'Public apps only', 'All of them'], ['Visibility of AI actions', 'None', 'Full log']] },
    wont: ['Servers with unrestricted write access', 'Exposing data across permission boundaries', 'Running without logs', 'Building what an official server already does', 'Shipping without a rollback plan'],
    close: { h2: ['Connect your', 'hidden systems.'], p: 'Book the free audit. We pick the internal system your team asks about most and build its first MCP server free.' },
    faqs: [
      { q: 'What is an MCP server?', a: 'MCP (Model Context Protocol) is an open standard that lets AI assistants call tools in other software. An MCP server exposes a system’s data and actions, such as look up a client or create a draft invoice, in a way Claude, ChatGPT and other agents can use safely.' },
      { q: 'Why build a custom MCP server?', a: 'Because internal, niche and legacy systems will not get official servers, and because a business needs control over what AI may read, change and approve. A custom server gives you exactly the tools and limits you need.' },
      { q: 'Is it secure?', a: 'We design for least access: per-user permissions, approval gates on actions, full logging, and hosting inside infrastructure you control.' },
      FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/ai-integration-services', 'AI integration services'], ['/ai-agent-development', 'AI agent development'], ['/ai-knowledge-systems', 'AI knowledge systems'], ['/how-we-work', 'How we work']],
  },

  // ───────────────────────────────────────────────────── ai-agent-development
  {
    slug: 'ai-agent-development', kind: 'service', crumb: 'AI agent development', serviceType: 'AI agent development',
    title: 'AI Agent Development Company: Agents That Know Your Business',
    description: 'AI agent development company building custom agents that know your company, check work against your rules and escalate only what needs a human.',
    eyebrow: 'AI AGENT DEVELOPMENT',
    h1: ['Agents that work like', 'your best employee.'],
    heroCopy: 'We build AI agents with real knowledge of your business: they research, draft, check work against your rules, approve what is routine and send the rest to a person. Human-in-the-loop by design, not by accident.',
    card: { title: 'AGENT: report-reviewer', rows: [
      { k: 'Read draft client report', v: 'done' },
      { k: 'Check figures against source data', v: '2 issues' },
      { k: 'Check against house style and rules', v: 'pass' },
      { k: 'Fix the routine issue itself', v: 'fixed' },
      { k: 'Escalate the judgement call to a partner', v: 'sent' },
    ], foot: 'The agent approves the routine and escalates the rest. A person still owns the outcome.' },
    problem: { eyebrow: 'WHY MOST AGENTS FAIL', h2: ['Autonomous is easy.', 'Trusted is hard.'], intro: 'Demos of agents doing everything alone are easy. In a real business, nobody lets them near clients until they know the rules and show their work.',
      cards: [
        { tag: 'NO CONTEXT', h: 'They do not know your business', p: 'Without your knowledge and rules, agents produce generic output someone has to redo.' },
        { tag: 'NO LIMITS', h: 'They act without boundaries', p: 'An agent that can do anything will eventually do the wrong thing in front of a client.' },
        { tag: 'NO PROOF', h: 'They do not show their work', p: 'If a reviewer cannot see why an agent decided something, they review everything again.' },
      ] },
    steps: { eyebrow: 'HOW WE BUILD AGENTS', h2: ['Knowledge, limits,', 'then autonomy.'], intro: 'We widen what an agent may do only after it has proved itself on the narrower job.', items: PROCESS },
    builds: { eyebrow: 'AGENTS WE BUILD', h2: ['Jobs, not', 'chatbots.'], intro: 'Each agent owns a defined job with clear inputs, rules and an approval path.',
      items: [
        { h: 'Research agents', p: 'Gather, compare and summarise sources into a briefing.' },
        { h: 'Drafting agents', p: 'Reports, proposals, replies and decks in your format.' },
        { h: 'Reviewer agents', p: 'Check work against rules and data before a person signs.' },
        { h: 'Operations agents', p: 'Onboarding, data entry and follow-ups across tools.' },
        { h: 'Inbox agents', p: 'Triage, prioritise and draft replies for approval.' },
        { h: 'Briefing agents', p: 'A daily summary of what needs attention, in Slack or email.' },
      ] },
    roi: { h2: ['Review time is', 'where agents pay.'], intro: 'Drafting faster helps. Removing the second and third round of senior review helps far more.',
      rows: [['Senior review rounds per deliverable', '3', '1'], ['Hours per report', '8', '2'], ['Errors reaching the client', 'Occasional', 'Caught by agent'], ['Work an agent approves alone', '0%', 'Routine items only']] },
    wont: ['Agents that email clients without approval', 'Agents with access beyond their job', 'Agents that cannot explain a decision', 'Fully autonomous financial or legal decisions', 'Agents with no failure alerts'],
    close: { h2: ['Hire your first', 'AI employee.'], p: 'Book the free audit. We pick one job, build the agent free, and show you its work before it touches anything important.' },
    faqs: [
      { q: 'What does an AI agent development company build?', a: 'Software agents that use AI models plus access to your tools and knowledge to complete defined jobs: research, drafting, reviewing, data work and follow-ups, with rules about what they may do alone and what needs a person.' },
      { q: 'What is human-in-the-loop AI?', a: 'A design where AI does the work and a person approves the steps that matter. We go further: agents act as reviewers themselves, approving routine items and escalating judgement calls, so people only see what genuinely needs them.' },
      FAQ_TEMPLATE, FAQ_PRICE, FAQ_SPEED,
      { q: 'Do you build custom AI solutions and chatbots?', a: 'Yes, as part of a connected system rather than a standalone widget. A chatbot that cannot see your documents, customers and rules gives generic answers, so we build the knowledge layer and the review steps first, then the agent or chat interface on top.' },
      { q: 'Can I hire you as an AI agent consultant before committing to a build?', a: 'Yes. The free audit is exactly that: we look at your workflows, tell you which tasks suit an agent and which do not, and build one agent workflow free so you can judge the work before you pay for more.' },
    ],
    related: [['/ai-knowledge-systems', 'AI knowledge systems'], ['/custom-mcp-server-development', 'Custom MCP servers'], ['/ai-email-management', 'AI email management'], ['/how-we-work', 'How we work']],
  },

  // ─────────────────────────────────────────────────────── ai-roi-calculator
  {
    slug: 'ai-roi-calculator', kind: 'service', crumb: 'AI ROI calculator', serviceType: 'AI ROI assessment', heroVisual: 'roi',
    title: 'AI ROI Calculator: Revenue Per Employee & Capacity',
    description: 'Free AI ROI calculator: see how many more clients your team can serve, and the revenue per employee you unlock, when manual work is automated.',
    eyebrow: 'AI ROI CALCULATOR',
    h1: ['How many more clients', 'could your team serve?'],
    heroCopy: 'Time saved is only half the story. Put in your team size, clients and manual hours, and see the capacity and revenue per employee automation could unlock with the same people.',
    heroNote: 'No email needed. Change any number and the result updates.',
    card: { title: '', rows: [] },
    problem: { eyebrow: 'WHY CAPACITY, NOT HOURS', h2: ['Saved hours', 'are not revenue yet.'], intro: 'Most ROI calculators stop at hours saved. Those hours only matter when they let you serve more clients or stop hiring for low-level work.',
      cards: [
        { tag: 'HOURS', h: 'Time back', p: 'The starting point: manual work removed from each client or each week.' },
        { tag: 'CAPACITY', h: 'More clients, same team', p: 'If manual work limits growth, removing half of it roughly doubles what the team can take on.' },
        { tag: 'REVENUE', h: 'Revenue per employee', p: 'The number that shows whether AI changed the business: revenue divided by headcount.' },
      ] },
    steps: { eyebrow: 'MAKING THE NUMBER REAL', h2: ['From estimate', 'to evidence.'], intro: 'The calculator is a starting point. The audit replaces every assumption with your real workflows.', items: PROCESS },
    builds: { eyebrow: 'WHERE THE HOURS USUALLY ARE', h2: ['Six places', 'we look first.'], intro: 'In most service businesses, these six account for most of the manual hours.',
      items: [
        { h: 'Research and preparation', p: 'Gathering information before client work can start.' },
        { h: 'Reports and presentations', p: 'Pulling data, writing it up, formatting and checking.' },
        { h: 'Email and follow-ups', p: 'Chasing, answering and updating clients.' },
        { h: 'Data entry between tools', p: 'Retyping the same information into several systems.' },
        { h: 'Review and rework', p: 'Seniors checking and correcting junior work.' },
        { h: 'Onboarding', p: 'Setting up each new client across systems.' },
      ] },
    roi: { h2: ['10 people,', '100 clients. Then?'], intro: 'The question we ask every founder: what would it take for the same team to serve five times the clients?',
      rows: [['Team', '10', '10'], ['Clients per month', '100', '250–500'], ['Revenue per employee', '$180k', '$450k–$900k'], ['Low-level hires needed', 'Several', 'None']] },
    wont: ['ROI claims without your real numbers', 'Counting hours that do not become capacity', 'Automations that cost more to run than they save'],
    close: { h2: ['Turn the estimate', 'into a plan.'], p: 'Book the free audit with your numbers. We check every assumption against your workflows and build the highest-return one free.' },
    faqs: [
      { q: 'How do you calculate AI ROI?', a: 'Start with the manual hours per client or per week, estimate the share AI can safely remove, and convert the freed time into capacity: how many more clients the same team can serve. Multiply by revenue per client and compare with the cost of the build.' },
      { q: 'What is a good revenue per employee?', a: 'It varies by industry, but for service businesses it is usually limited by how much manual work each client needs. Automation raises it by letting each person handle more clients, not by working longer.' },
      { q: 'How accurate is this calculator?', a: 'It is a simple capacity model and assumes manual work is what limits growth. The free audit checks that assumption and replaces every number with your own.' },
      FAQ_PRICE,
    ],
    related: [['/how-we-work', 'How we work'], ['/ai-automation-cost', 'What AI automation costs'], ['/ai-strategy-consulting', 'AI strategy consulting'], ['/tools', 'More calculators']],
  },

  // ───────────────────────────────────────────────────── automated-reporting
  {
    slug: 'automated-reporting', kind: 'service', crumb: 'Automated reporting', serviceType: 'Automated reporting',
    title: 'Automated Reporting & AI Report Generation | Chronexa',
    description: 'Automated reporting with AI: data pulled from your tools, analysed, written in your format and delivered, including a daily briefing in Slack.',
    eyebrow: 'AUTOMATED REPORTING',
    h1: ['Reports that write', 'themselves by 8am.'],
    heroCopy: 'Client reports, weekly updates, board packs, research briefs and a daily morning briefing in Slack. We pull the data from your tools, analyse it, write it in your format and send it for a quick human check.',
    tools: ['Slack', 'Google Sheets', 'HubSpot', 'QuickBooks', 'Looker Studio', 'PowerPoint'],
    card: { title: 'MORNING BRIEFING · 07:58', rows: [
      { k: 'Pipeline: 3 deals moved, 1 stalled 14 days', v: 'Sales' },
      { k: 'Cash: 2 invoices overdue, $18,400', v: 'Finance' },
      { k: 'Client: Acme asked twice about timelines', v: 'Service' },
      { k: 'Team: 2 deliverables due today', v: 'Ops' },
      { k: 'Your 3 priorities for today', v: 'You' },
    ], foot: 'Example briefing with invented figures. Yours is built from your own tools.' },
    problem: { eyebrow: 'WHERE REPORTING TIME GOES', h2: ['The writing', 'is the small part.'], intro: 'Most report time is spent finding, copying, checking and formatting. That is exactly the work automation removes.',
      cards: [
        { tag: 'GATHER', h: 'Data from five places', p: 'Exports from the CRM, accounting, analytics and spreadsheets, stitched together by hand.' },
        { tag: 'FORMAT', h: 'Same deck, every week', p: 'Charts rebuilt, numbers updated, commentary rewritten from scratch.' },
        { tag: 'CHECK', h: 'Errors caught late', p: 'A wrong number found by the client is the most expensive kind.' },
      ] },
    steps: { eyebrow: 'HOW WE BUILD IT', h2: ['Your format,', 'your data, on time.'], intro: 'We start with the report your team dreads most and automate it end to end.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE AUTOMATE', h2: ['Every recurring', 'document.'], intro: 'If you produce it on a schedule, it can be produced for you.',
      items: [
        { h: 'Daily morning briefing', p: 'What changed overnight and what needs you today, in Slack, Teams or email.' },
        { h: 'Client reports', p: 'Monthly and quarterly reports in your template, with commentary.' },
        { h: 'Research briefs', p: 'Sources gathered, compared and summarised before a meeting.' },
        { h: 'Presentations', p: 'Decks built from data, in your brand, ready to edit.' },
        { h: 'Analysis', p: 'Trends, exceptions and the questions worth asking, flagged automatically.' },
        { h: 'Board and investor updates', p: 'Numbers pulled and drafted, ready for the founder’s pen.' },
      ] },
    roi: { h2: ['Hours back', 'every week.'], intro: 'Reporting is the fastest return we build, because it repeats on a schedule and its cost is easy to see.',
      rows: [['Hours per monthly client report', '6', '1'], ['Reports per month', '40', '40'], ['Analyst hours on reporting / month', '240', '40'], ['Errors reaching clients', 'Occasional', 'Checked automatically']] },
    wont: ['Reports sent to clients without a human check', 'Dashboards nobody asked for', 'Numbers without a traceable source', 'Rebuilding a report your BI tool already produces well'],
    close: { h2: ['Never build that', 'report again.'], p: 'Book the free audit. Bring the report your team dreads and we automate it free inside a week.' },
    faqs: [
      { q: 'What is automated reporting?', a: 'Reports produced on a schedule without manual work: data is pulled from your tools, analysed, written into your template and delivered for a quick human check. AI adds the commentary and flags anomalies, not just the charts.' },
      { q: 'Can AI write the commentary, not just the charts?', a: 'Yes, and that is where most of the time goes. With access to your data and past reports, AI drafts the narrative in your voice and highlights what changed and why. A person approves it before it goes out.' },
      { q: 'What is a daily AI briefing?', a: 'A short summary delivered every morning, to Slack, Teams or email, of what changed in your business overnight and what needs your attention today, built from your CRM, finance, inbox and project tools.' },
      FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/ai-email-management', 'AI email management'], ['/ai-knowledge-systems', 'AI knowledge systems'], ['/ai-integration-services', 'AI integration services'], ['/how-we-work', 'How we work']],
  },

  // ───────────────────────────────────────────────────── ai-email-management
  {
    slug: 'ai-email-management', kind: 'service', crumb: 'AI email management', serviceType: 'AI email management',
    title: 'AI Email Management: Inbox Triage & Drafted Replies',
    description: 'AI email management for teams: inboxes sorted by priority, replies drafted with client history and your policies, sent only after approval.',
    eyebrow: 'AI EMAIL MANAGEMENT',
    h1: ['An inbox that knows', 'your clients.'],
    heroCopy: 'We build AI that sorts every inbox by what matters, files what does not, and drafts replies that already know the client’s history and your policies. Nothing is sent without a person saying yes.',
    tools: ['Gmail', 'Outlook', 'HubSpot', 'Salesforce', 'Slack', 'Your knowledge base'],
    card: { title: 'INBOX · 47 NEW', rows: [
      { k: 'Client asking about delayed delivery', v: 'Reply drafted' },
      { k: 'New enquiry from a referral', v: 'Urgent' },
      { k: 'Invoice question, answer in policy', v: 'Reply drafted' },
      { k: 'Vendor pitches and newsletters (31)', v: 'Filed' },
      { k: 'Contract change, needs a partner', v: 'Escalated' },
    ], foot: 'Example inbox. Drafts use your client history and policies, and wait for approval.' },
    problem: { eyebrow: 'WHY EMAIL EATS THE DAY', h2: ['Sorting and answering', 'is the job now.'], intro: 'For many senior people, email is the work. Most of it is routine, but finding the urgent 10% takes the whole morning.',
      cards: [
        { tag: 'VOLUME', h: 'Too much to read', p: 'Important client emails buried under notifications and pitches.' },
        { tag: 'REPEAT', h: 'Same answers, retyped', p: 'Policy questions answered from scratch every time.' },
        { tag: 'CONTEXT', h: 'History is elsewhere', p: 'The reply needs the CRM, past emails and the contract, all in other tabs.' },
      ] },
    steps: { eyebrow: 'HOW WE BUILD IT', h2: ['Sort, draft,', 'approve.'], intro: 'We start with one inbox and one type of email, then widen.', items: PROCESS },
    builds: { eyebrow: 'WHAT IT DOES', h2: ['Your inbox,', 'pre-handled.'], intro: 'Every message is read, sorted and prepared before you open it.',
      items: [
        { h: 'Priority triage', p: 'Urgent, important, routine and noise, sorted automatically.' },
        { h: 'Drafted replies', p: 'In your voice, using client history and your policies.' },
        { h: 'CRM updates', p: 'Contacts, deals and notes updated from email, no retyping.' },
        { h: 'Follow-up tracking', p: 'Nothing waits more than a day without someone knowing.' },
        { h: 'Shared inboxes', p: 'Support and info@ inboxes routed to the right person.' },
        { h: 'Escalation', p: 'Anything sensitive goes straight to the right senior person.' },
      ] },
    roi: { h2: ['Mornings', 'given back.'], intro: 'For senior people, an hour of inbox time saved is an hour of client or strategy work.',
      rows: [['Hours on email / person / day', '2.5', '1'], ['Time to first reply', '1 day', 'Same morning'], ['Missed follow-ups / month', 'Several', 'Near zero'], ['CRM updated from email', 'Rarely', 'Always']] },
    wont: ['Sending emails to clients without approval', 'Reading inboxes beyond agreed scope', 'Answering legal or financial questions alone', 'Storing email content outside your control'],
    close: { h2: ['Take back', 'your mornings.'], p: 'Book the free audit. We set up triage and drafted replies on one inbox, free, inside a week.' },
    faqs: [
      { q: 'What is AI email management?', a: 'AI that reads incoming email, sorts it by priority, files what does not need you, drafts replies using your client history and policies, and keeps your CRM updated, with a person approving anything that is sent.' },
      { q: 'Will it send emails on its own?', a: 'Only if you explicitly allow it for a narrow category, like confirming receipt. By default every reply is a draft waiting for approval.' },
      FAQ_STACK, FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/automated-reporting', 'Automated reporting'], ['/ai-agent-development', 'AI agent development'], ['/ai-knowledge-systems', 'AI knowledge systems'], ['/how-we-work', 'How we work']],
  },

  // ─────────────────────────────────────────────── ai-training-for-employees
  {
    slug: 'ai-training-for-employees', kind: 'service', crumb: 'AI training for employees', serviceType: 'AI training for employees',
    title: 'AI Training for Employees: Make Your Team AI-Native',
    description: 'AI training for employees, built on your real work: how to use AI and automations properly, safely and daily. Paired with systems we build for you.',
    eyebrow: 'AI TRAINING FOR EMPLOYEES',
    h1: ['Tools do not change companies.', 'People using them do.'],
    heroCopy: 'We train your team to be AI-native on their own work, not generic prompt tips. Each role learns the AI tools, workflows and automations that matter for its job, and how to use them safely.',
    tools: ['Claude', 'ChatGPT', 'Copilot', 'Gemini', 'n8n', 'Your workflows'],
    card: { title: 'TRAINING PLAN BY ROLE', rows: [
      { k: 'Founders: AI for decisions and strategy', v: '2 h' },
      { k: 'Managers: reporting and review with AI', v: '3 h' },
      { k: 'Client teams: research, drafting, replies', v: '4 h' },
      { k: 'Ops: running and fixing automations', v: '4 h' },
      { k: 'Everyone: data safety and limits', v: '1 h' },
    ], foot: 'Example plan. Built from your audit, using your own documents and workflows.' },
    problem: { eyebrow: 'WHY TRAINING FAILS', h2: ['Generic tips,', 'no habit.'], intro: 'Most AI training is a webinar on prompts. People try it for a week, then go back to the old way.',
      cards: [
        { tag: 'GENERIC', h: 'Not their work', p: 'Examples about poems and holiday plans do not transfer to client reports.' },
        { tag: 'UNSAFE', h: 'No rules', p: 'Without clear limits, people paste client data into tools they should not.' },
        { tag: 'NO SYSTEM', h: 'Nothing to use after', p: 'Training without workflows and tools set up leaves people with nothing to practise on.' },
      ] },
    steps: { eyebrow: 'HOW WE TRAIN', h2: ['On your work,', 'with your tools.'], intro: 'Training sits on top of real systems we set up, so people practise on the work they do every day.', items: PROCESS },
    builds: { eyebrow: 'WHAT YOUR TEAM LEARNS', h2: ['AI as a', 'daily habit.'], intro: 'Practical skills per role, plus the shared rules that keep the company safe.',
      items: [
        { h: 'AI for research and writing', p: 'Faster first drafts that still sound like your company.' },
        { h: 'Working with company knowledge', p: 'Using your knowledge base and agents, and checking sources.' },
        { h: 'Reviewing AI output', p: 'Spotting errors and knowing when not to trust the answer.' },
        { h: 'Running automations', p: 'What each workflow does, how to spot failures and fix them.' },
        { h: 'Data safety', p: 'What may go into which tool, and why.' },
        { h: 'Building small automations', p: 'For the people who want to go further.' },
      ] },
    roi: { h2: ['Adoption is', 'the multiplier.'], intro: 'A system nobody uses returns nothing. Training is what turns built capacity into used capacity.',
      rows: [['People using AI daily', '20%', '80%+'], ['Time saved per person / week', '1 h', '5–8 h'], ['Data-safety incidents', 'Unknown', 'Clear rules'], ['Automations owned by the team', 'None', 'Several']] },
    wont: ['One-off webinars with no follow-up', 'Training on tools you do not use', 'Encouraging client data in unapproved tools', 'Replacing judgement with prompts'],
    close: { h2: ['Make your team', 'AI-native.'], p: 'Book the free audit. We map the roles, set up the tools and build the first workflow your team will train on, free.' },
    faqs: [
      { q: 'What should AI training for employees cover?', a: 'Using AI on their actual tasks, working with company knowledge, reviewing AI output critically, running the automations they depend on, and the data rules that keep the company safe.' },
      { q: 'Do you train on our own tools?', a: 'Yes. We train on the AI tools you have approved and on the workflows we build with you, using your own documents as examples.' },
      FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/ai-workspace-setup', 'AI workspace setup'], ['/ai-strategy-consulting', 'AI strategy consulting'], ['/how-we-work', 'How we work'], ['/ai-knowledge-systems', 'AI knowledge systems']],
  },

  // ──────────────────────────────────────────────────── tech-stack-migration
  {
    slug: 'tech-stack-migration', kind: 'service', crumb: 'Tech stack migration', serviceType: 'Data migration services',
    title: 'Tech Stack & Data Migration for AI-Ready Teams | Chronexa',
    description: 'Data migration services when you are ready for a modern, AI-ready stack: tools recommended, data moved and checked, and your team trained. Never forced.',
    eyebrow: 'TECH STACK & DATA MIGRATION',
    h1: ['A future-ready stack,', 'only if you want one.'],
    heroCopy: 'We never force a stack change. But if your tools are holding you back, we recommend modern, AI-ready alternatives, migrate your data safely, set everything up and train your team, without stopping the business.',
    tools: ['Legacy CRM', 'Spreadsheets', 'HubSpot', 'Notion', 'Airtable', 'Postgres'],
    card: { title: 'MIGRATION PLAN', rows: [
      { k: 'Audit current tools and data quality', v: 'Week 1' },
      { k: 'Recommend: keep, connect or replace', v: 'Week 1' },
      { k: 'Clean and map the data', v: 'Week 2' },
      { k: 'Migrate in parallel, verify every record', v: 'Week 3' },
      { k: 'Switch over, train the team', v: 'Week 4' },
    ], foot: 'Example timeline. Old and new run side by side until the numbers match.' },
    problem: { eyebrow: 'WHEN TO MOVE', h2: ['Some tools', 'cannot be connected.'], intro: 'Connecting what you have is always our first option. Sometimes a tool is so closed, slow or expensive that moving is the better return.',
      cards: [
        { tag: 'CLOSED', h: 'No way in', p: 'No API, no export, no future. Every workaround costs more each year.' },
        { tag: 'MESSY', h: 'Data nobody trusts', p: 'Duplicates and gaps that make every report and every AI answer worse.' },
        { tag: 'EXPENSIVE', h: 'Paying for what you do not use', p: 'Licences for features nobody touches, and none of the AI ones you need.' },
      ] },
    steps: { eyebrow: 'HOW WE MIGRATE', h2: ['Parallel,', 'verified, reversible.'], intro: 'The business keeps running on the old system until the new one is proven.', items: PROCESS },
    builds: { eyebrow: 'WHAT WE HANDLE', h2: ['End to end,', 'including people.'], intro: 'A migration is only finished when the team works in the new tool by choice.',
      items: [
        { h: 'Tool recommendation', p: 'Honest comparison of options for your size and budget.' },
        { h: 'Data cleaning', p: 'Duplicates merged, gaps filled, history preserved.' },
        { h: 'Migration', p: 'Moved in stages and verified record by record.' },
        { h: 'Integrations rebuilt', p: 'Everything that talked to the old tool now talks to the new one.' },
        { h: 'AI-ready setup', p: 'Structured so agents and automations can use the data.' },
        { h: 'Training', p: 'Your team confident in the new tools from day one.' },
      ] },
    roi: { h2: ['Cheaper to run,', 'easier to automate.'], intro: 'The return from migrating is lower licence cost plus everything that becomes automatable once data is clean and reachable.',
      rows: [['Tools holding the same data', '4', '1–2'], ['Licence cost / year', '$40k', '$22k'], ['Records trusted for reporting', 'Some', 'All'], ['Workflows AI can automate', 'Few', 'Most']] },
    wont: ['Migrating when connecting would do', 'Big-bang switchovers on a Monday', 'Moving data without verification', 'Choosing tools because we resell them'],
    close: { h2: ['Move only', 'if it pays.'], p: 'Book the free audit. We tell you honestly whether to connect, clean or migrate, and build the first step free.' },
    faqs: [
      { q: 'Do we have to migrate to work with you?', a: 'No. Connecting your existing tools is always our first option. We recommend migrating only when it clearly pays for itself.' },
      { q: 'How do you avoid downtime?', a: 'Old and new systems run in parallel, data is verified record by record, and the switch happens only when the numbers match.' },
      FAQ_PRICE, FAQ_SPEED,
    ],
    related: [['/ai-integration-services', 'AI integration services'], ['/custom-mcp-server-development', 'Custom MCP servers'], ['/how-we-work', 'How we work'], ['/ai-training-for-employees', 'AI training for employees']],
  },

  // ─────────────────────────────────────────────────── what-is-ai-automation
  {
    slug: 'what-is-ai-automation', kind: 'guide', crumb: 'What is AI automation', serviceType: 'Guide', updated: '2026-10-07',
    title: 'What Is AI Automation? Examples for Business (2026)',
    description: 'What AI automation is, and how it differs from workflow automation, intelligent automation and hyperautomation. Business examples and how to measure ROI.',
    eyebrow: 'GUIDE · UPDATED OCTOBER 2026',
    h1: ['What is AI automation?', 'A plain-English guide.'],
    heroCopy: 'AI automation is software that does work which used to need human judgement: reading, writing, checking and deciding, inside your business tools. Here is how it works, where it pays and where it does not.',
    card: { title: 'THREE LEVELS OF AUTOMATION', rows: [
      { k: 'Rules: when X happens, do Y', v: 'Basic' },
      { k: 'AI: read, write, classify, summarise', v: 'Smart' },
      { k: 'AI + company knowledge: act like staff', v: 'Strategic' },
    ], foot: 'Most tools now do the first level themselves. The value is in the third.' },
    problem: { eyebrow: 'THE SHORT ANSWER', h2: ['Automation follows rules.', 'AI handles judgement.'], intro: 'Classic automation moves data when something happens. AI automation can also read a document, write a reply, check a report and decide what a human should see.',
      cards: [
        { tag: 'WORKFLOW AUTOMATION', h: 'If this, then that', p: 'A new form submission creates a CRM record. Fast and reliable, but it cannot understand anything.' },
        { tag: 'AI AUTOMATION', h: 'Reads and writes', p: 'An email is read, its intent understood, a reply drafted and the CRM updated with what was agreed.' },
        { tag: 'AI + KNOWLEDGE', h: 'Acts like an employee', p: 'The draft uses the client’s history and your policies, and a reviewer agent checks it before a person approves.' },
      ] },
    prose: [
      { h: 'How AI automation works', p: ['An AI automation has three parts. A trigger starts it, such as a new email, a form, a schedule or a file. An AI model does the judgement step: reading, classifying, summarising, drafting or checking. And integrations carry the result into your tools, such as the CRM, accounting system, Slack or a document.', 'What separates useful AI automation from a demo is the fourth part most guides skip: company knowledge. A model that knows your pricing, past work, client history and approval rules gives answers your senior people would give. A model without it gives generic answers someone has to redo.'] },
      { h: 'AI automation examples for business', p: ['These are the jobs where AI automation pays back fastest in service businesses:'], list: [
        'A daily morning briefing in Slack summarising pipeline, cash and client issues',
        'Client reports and presentations drafted from your data in your format',
        'Inbox triage with replies drafted from client history, sent after approval',
        'Research briefs gathered and summarised before meetings',
        'Client onboarding across CRM, billing and project tools without retyping',
        'Reviewer agents checking work against your rules before a senior signs off',
      ] },
      { h: 'Hyperautomation, intelligent automation and workflow automation: what is the difference?', p: ['These terms overlap, and vendors use them loosely. Workflow automation is the base layer: fixed rules that move data and trigger steps between tools when something happens. Intelligent automation adds AI to those workflows, so a step can read a document, classify an email or draft a reply instead of only passing data along. Hyperautomation is the label analysts use for doing this across many processes at once, combining workflow tools, AI and integrations and automating as many connected steps as can safely be automated.', 'In practice you do not buy one of these. You pick the first process worth automating, build it with the right mix of rules and AI, and widen from there. That is why we start with an audit of where the hours actually go.'] },
      { h: 'Where AI automation does not pay', p: ['Not everything should be automated. Processes nobody has agreed on, decisions that legally need a person, and tasks that happen twice a year rarely return the effort. A good partner will tell you which of your ideas fall into these groups before building anything.'] },
      { h: 'How to measure the ROI', p: ['Hours saved are the start, not the answer. The real measure is capacity: how many more clients the same team can serve once manual work is removed, and what that does to revenue per employee. If 10 people serve 100 clients today and half their time is manual work, removing most of it lets the same 10 serve far more. Our ROI calculator does this sum with your numbers.'] },
      { h: 'Do you need an agency?', p: ['For simple connections between popular apps, often not: many tools now include connectors and basic AI features. You need a partner when the work depends on knowledge of your business, spans many tools, touches older systems without connectors, or needs approvals and audit trails. That is the work we do, starting with a free audit.'] },
    ],
    steps: { eyebrow: 'HOW TO START', h2: ['Start with one', 'high-return job.'], intro: 'Companies that succeed with AI automation start small, measure the return and widen from there. This is how we do it with clients.', items: PROCESS },
    builds: { eyebrow: 'WHAT IT CAN DO', h2: ['Six jobs AI', 'already does well.'], intro: 'All six combine an AI model, your tools and your company knowledge.',
      items: [
        { h: 'Read', p: 'Documents, emails and forms understood and filed.' },
        { h: 'Write', p: 'Reports, replies, proposals and summaries drafted.' },
        { h: 'Check', p: 'Work reviewed against rules and source data.' },
        { h: 'Research', p: 'Information gathered and compared from many sources.' },
        { h: 'Connect', p: 'Data moved between tools without retyping.' },
        { h: 'Decide what needs a human', p: 'Routine handled, exceptions escalated.' },
      ] },
    roi: { h2: ['The capacity', 'question.'], intro: 'Every AI automation decision should answer one question: how many more clients can the same team serve?',
      rows: [['Manual hours per client', '6', '1–2'], ['Clients per team of 10', '100', '250+'], ['New hires to grow', 'Several', 'Few or none']] },
    wont: ['Automating a broken process before fixing it', 'Removing human sign-off where it matters', 'Buying tools before mapping the work'],
    close: { h2: ['See what AI could do', 'in your business.'], p: 'Book a free audit. We map your workflows, show you where AI automation pays and build the first one free.' },
    faqs: [
      { q: 'What is AI automation in simple terms?', a: 'Software that does work which used to need human judgement, like reading documents, writing replies or checking reports, and moves the results into your business tools automatically.' },
      { q: 'What is the difference between AI automation and workflow automation?', a: 'Workflow automation follows fixed rules: when this happens, do that. AI automation adds a judgement step, so it can understand content, write and decide what a person should review.' },
      { q: 'What are examples of AI automation?', a: 'Daily briefings in Slack, automated client reports, inbox triage with drafted replies, research summaries, client onboarding across tools and reviewer agents that check work before sign-off.' },
      { q: 'What is hyperautomation, and how is it different from intelligent automation?', a: 'Intelligent automation is workflow automation with AI added, so steps can read, classify and draft. Hyperautomation is the broader approach of automating as many connected processes as possible by combining workflow tools, AI and integrations. For most companies the practical starting point is the same: one high-return process, built well.' },
      { q: 'Is AI automation expensive?', a: 'It depends on the work, which is why we start with a free audit and a free first workflow. Every further build is priced against the return it produces.' },
    ],
    related: [['/ai-automation', 'AI workflow automation'], ['/ai-automation-agency', 'AI automation agency'], ['/ai-roi-calculator', 'AI ROI calculator'], ['/how-we-work', 'How we work']],
  },

  // ───────────────────────────────────────────────────── ai-automation-cost
  {
    slug: 'ai-automation-cost', kind: 'guide', crumb: 'AI automation cost', serviceType: 'Pricing guide', updated: '2026-10-07',
    title: 'AI Automation Cost & AI Development Pricing Explained',
    description: 'What AI automation and AI development cost, what drives the price, and why we start with a free audit and a free first workflow.',
    eyebrow: 'PRICING · UPDATED OCTOBER 2026',
    h1: ['What does AI automation cost?', 'It depends on the return.'],
    heroCopy: 'There is no honest single price for AI automation, because the same workflow can be a two-day job in one company and a month in another. Here is what drives the cost, how we price, and why the first step is free.',
    card: { title: 'HOW WE PRICE', rows: [
      { k: 'Founder session and audit', v: 'Free' },
      { k: 'First workflow, live in a week', v: 'Free' },
      { k: 'Each next build', v: 'Priced on ROI' },
      { k: 'Ongoing partnership', v: 'Monthly' },
    ], foot: 'Every price is agreed in writing before work starts. No hourly billing.' },
    problem: { eyebrow: 'WHAT DRIVES THE COST', h2: ['Four things', 'set the price.'], intro: 'Model and tool costs are usually small. The real cost is in understanding your business and connecting it properly.',
      cards: [
        { tag: '01', h: 'How many tools are involved', p: 'Two modern apps with APIs is quick. Five tools including a legacy system takes longer.' },
        { tag: '02', h: 'How much knowledge is needed', p: 'An agent that must know your rules and past work needs a knowledge layer built first.' },
        { tag: '03', h: 'How much can go wrong', p: 'Client-facing and financial work needs approvals, checks and audit trails.' },
        { tag: '04', h: 'Running costs', p: 'AI model usage and hosting, usually small next to the hours saved.' },
      ] },
    prose: [
      { h: 'Typical AI automation price ranges', p: ['Across the market, simple workflow automations are often quoted in the low thousands of dollars, AI agents and multi-tool systems in the tens of thousands, and enterprise programmes far higher. Those ranges are wide because the work is genuinely different from company to company.', 'We prefer not to quote a number before we have seen your systems. Instead, the audit and the first workflow are free, and every next build is priced against the return it produces, so you can judge the cost against a measured result rather than a promise.'] },
      { h: 'Build versus buy', p: ['If an off-the-shelf tool does the job, buy it, and we will tell you so. Custom builds pay when the work depends on knowledge of your business, crosses many tools, or needs control over data and approvals.'] },
      { h: 'How to compare quotes', p: ['Ask every vendor the same questions: what is live in the first week, who owns the system, what happens when it fails, who maintains it, and what return they expect it to produce. A quote without answers to those is not comparable.'] },
    ],
    steps: { eyebrow: 'HOW PRICING WORKS', h2: ['Free first,', 'priced on proof.'], intro: 'We ask for money only after you have seen the approach work on your own tools.', items: PROCESS },
    builds: { eyebrow: 'WHAT YOU PAY FOR', h2: ['Outcomes,', 'not hours.'], intro: 'Every engagement includes the parts that make automation last.',
      items: [
        { h: 'Design', p: 'Mapping the work and the knowledge it needs.' },
        { h: 'Build', p: 'Integrations, agents and workflows on your tools.' },
        { h: 'Safety', p: 'Approvals, permissions, logging and failure alerts.' },
        { h: 'Infrastructure', p: 'Set up and hosted where you control the data.' },
        { h: 'Training', p: 'Your team confident using and fixing it.' },
        { h: 'Partnership', p: 'Ongoing changes as your business evolves.' },
      ] },
    roi: { h2: ['Judge the cost', 'against the return.'], intro: 'The right question is not what it costs, but how long it takes to pay back.',
      rows: [['Hours saved per month', '—', '160'], ['Value of those hours', '—', '$8,000/month'], ['Extra clients the team can take', '—', '+20/month'], ['Payback period', '—', 'Weeks, not years']] },
    wont: ['Quoting before understanding your systems', 'Hourly billing with no end in sight', 'Charging for work your tools already do', 'Hidden running costs'],
    close: { h2: ['Find out what yours', 'would cost.'], p: 'Book the free audit. You get the expected return of each opportunity and a free first workflow before any price is discussed.' },
    faqs: [
      { q: 'How much does AI automation cost?', a: 'It varies widely: simple automations are often quoted in the low thousands of dollars and multi-tool AI systems in the tens of thousands. We start with a free audit and a free first workflow, then price each build against the return it produces.' },
      { q: 'How much does it cost to build an AI agent?', a: 'It depends on the job, the tools it must use and how much company knowledge it needs. A narrow agent on modern tools is quick. An agent that reviews and approves work across several systems needs a knowledge layer and approvals first.' },
      { q: 'What are the running costs?', a: 'AI model usage and hosting, usually a small fraction of the hours saved. We estimate them in the audit so there are no surprises.' },
      { q: 'Why is the first workflow free?', a: 'Because the best way to show the approach works for your company is to ship something real on your tools. If it does not save time, you keep the audit and owe nothing.' },
    ],
    related: [['/ai-roi-calculator', 'AI ROI calculator'], ['/how-we-work', 'How we work'], ['/ai-automation-agency', 'AI automation agency'], ['/what-is-ai-automation', 'What is AI automation']],
  },
];

export const growthPage = (slug: string): GrowthPageData => {
  const p = GROWTH_PAGES.find(x => x.slug === slug);
  if (!p) throw new Error(`growth page not found: ${slug}`);
  return p;
};
