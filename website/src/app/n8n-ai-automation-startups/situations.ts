/**
 * The five situations — the heart of the page.
 *
 * Chosen because a founder in almost any industry recognises them straight away,
 * and because these are patterns we genuinely build. Written as a plain
 * before-and-after: no diagram, no animation, no toggle. Reading the comparison
 * is the whole experience.
 *
 * Every `human` line is deliberate. It says what a person still decides, which is
 * both true and the thing that stops a careful buyer from walking away.
 *
 * Logos are claims: only list tools we actually build with, and only files that
 * exist in /public/logos.
 */

export type Tool = { file: string; name: string };

export type Situation = {
  id: string;
  /** The situation in a founder's own words. Must be scannable on its own. */
  title: string;
  today: string[];
  after: string[];
  tools: Tool[];
  /** Completes the sentence "A person still decides: …" */
  human: string;
};

export const SITUATIONS: Situation[] = [
  {
    id: 'enquiries',
    title: 'An enquiry comes in and nobody answers for six hours',
    today: [
      'A form fill at 9:40pm. A WhatsApp message on Sunday. An IndiaMART lead nobody opened.',
      'Whoever is free replies, eventually.',
      'By then the customer has already bought somewhere else.',
    ],
    after: [
      'Every enquiry is picked up within minutes, whichever channel it arrived on.',
      'The system works out who they are, writes a reply in your words, and sends it.',
      'The lead reaches the right person with the background already attached.',
    ],
    tools: [
      { file: 'whatsapp.svg', name: 'WhatsApp' },
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'slack.svg', name: 'Slack' },
    ],
    human: 'who gets a call, and what price you quote.',
  },
  {
    id: 'support',
    title: 'The same fifty questions, all day, every day',
    today: [
      'Where is my order. Is this in stock. When does it ship. Can I change the address.',
      'Someone senior is answering these at ten at night, because nobody else can.',
    ],
    after: [
      'The routine ones are answered straight away, in your words, on whatever channel the customer used.',
      'Anything unusual or expensive goes to a person, with the history already summarised.',
    ],
    tools: [
      { file: 'whatsapp.svg', name: 'WhatsApp' },
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'zendesk.png', name: 'Zendesk' },
      { file: 'claude.svg', name: 'Claude' },
    ],
    human: 'refunds, exceptions, and any customer who is upset.',
  },
  {
    id: 'visibility',
    title: 'Nobody actually knows what is going on',
    today: [
      'Status sits in four places. A WhatsApp group, someone’s inbox, an Excel file, and a project tool three weeks out of date.',
      'You find out something slipped when the customer tells you.',
    ],
    after: [
      'One summary every morning, in Slack or on WhatsApp.',
      'What moved, what is stuck and for how long, who is waiting on whom, and the few numbers you watch.',
      'Pulled from the tools your team already uses, so nobody has to update anything extra.',
    ],
    tools: [
      { file: 'slack.svg', name: 'Slack' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'gmail.svg', name: 'Gmail' },
    ],
    human: 'what to do about it. The summary only tells you where to look.',
  },
  {
    id: 'marketing',
    title: 'Marketing stops the week your marketing person is busy',
    today: [
      'Three posts in a good week, then nothing for a month.',
      'The blog has not moved since the person who owned it left.',
      'Everyone agrees it matters. Nobody has the hours.',
    ],
    after: [
      'Research, writing, images and scheduling run to a calendar, whether or not anyone is free that week.',
      'You approve. You do not produce.',
    ],
    tools: [
      { file: 'claude.svg', name: 'Claude' },
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'instagram.svg', name: 'Instagram' },
      { file: 'perplexity.svg', name: 'Perplexity' },
    ],
    human: 'the positioning, the offer, and what actually goes out.',
  },
  {
    id: 'documents',
    title: 'Paperwork that needs a person to read it',
    today: [
      'Invoices, purchase orders, KYC files, GST paperwork, vendor documents.',
      'Read by a person, typed in by the same person, and typed in wrong often enough to matter.',
    ],
    after: [
      'Documents are read, the numbers pulled out and checked against what they should be, then filed where they belong.',
      'Anything that does not add up gets flagged. The rest goes through without anyone touching it.',
    ],
    tools: [
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'slack.svg', name: 'Slack' },
    ],
    human: 'anything flagged, and anything where money leaves the building.',
  },
];

/* ─── The three researched numbers ───────────────────────────────────────
   Every figure here is published research, and the source prints on the page
   underneath it. That is the point: it is what separates this page from an
   agency that made its numbers up. Never add a figure without a source, and
   never present any of these as a Chronexa client result. */

export type ImpactFigure = {
  value: number;
  prefix?: string;
  suffix?: string;
  line: string;
  source: string;
};

export const IMPACT: ImpactFigure[] = [
  {
    value: 42,
    suffix: ' hrs',
    line: 'The average company takes 42 hours to reply to a new enquiry. Almost a quarter never reply at all.',
    source: 'Harvard Business Review, study of 2,241 companies',
  },
  {
    value: 7,
    suffix: '×',
    line: 'Reply within the hour instead and you are seven times more likely to qualify that lead.',
    source: 'Same study, and the MIT Lead Response Management research',
  },
  {
    value: 60,
    suffix: '%',
    line: 'Six of every ten hours your team works go to status updates, chasing information and retyping things that already exist.',
    source: 'Asana Anatomy of Work Index, 13,000 knowledge workers',
  },
];

/* ─── FAQ ──────────────────────────────────────────────────────────────
   House rule: every answer is at least one full paragraph, written both for a
   founder skimming and for an AI answer engine quoting it. */

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does it take?',
    a: 'Most first builds go live in two to three weeks. Week one is spent sitting with whoever does the work by hand today and mapping what actually happens, which is usually different from what the process document says happens. Week two is building it and connecting it to the tools you already run. Week three is testing against your real data, fixing what breaks, and handing it over. Larger builds take longer, and we will tell you that before you commit rather than halfway through.',
  },
  {
    q: 'We already use Zapier or Make. Why change?',
    a: 'You may not need to. If the bill is small and nothing important breaks, leave it alone. It stops working for you when you are paying per task at volume, when the logic gets complex enough that Zapier cannot express it, or when customer data needs to stay inside your own systems. We build on n8n, which is open source and can run on your own servers, so your cost stops scaling with usage and your data never leaves your infrastructure. Moving existing Zaps across is one of the more common things we are asked to do.',
  },
  {
    q: 'Is our data safe?',
    a: 'Yes, and the reason is how it is built rather than a promise on a website. We can deploy the whole system inside your own cloud account, so customer records, documents and messages never sit on our servers at all. Where an AI model is involved we use providers that do not train on your data, or run models inside your own environment for anything sensitive. If you are in a regulated sector such as fintech or healthcare, tell us on the first call and we will design for that from the start instead of retrofitting it later.',
  },
  {
    q: 'What happens when it breaks?',
    a: 'Eventually something will break. An API changes, a vendor has an outage, someone renames a column. What matters is whether it fails loudly or silently. Everything we build is monitored, retries automatically on temporary failures, and alerts a real person when something needs attention, so you hear about it from us and not from a customer. Thirty days of support comes with every build, and most clients keep a small monthly arrangement after that for monitoring and changes. You are never locked in, because you own the files.',
  },
  {
    q: 'Can we start with just one thing?',
    a: 'Yes, and we would rather you did. Pick the one process that hurts most. We build that, and you judge us on it before committing to anything else. It is a better test than any case study we could show you, and it is how most of our longer engagements actually started.',
  },
  {
    q: 'Does this work for a company like ours?',
    a: 'The five situations on this page turn up in software companies, D2C brands, manufacturers, logistics businesses and professional services firms alike, because they are about how work is organised rather than what you sell. What changes is which tools we connect to: ERP and dispatch systems for a manufacturer, orders and returns for a D2C brand, a CRM and ticketing stack for a software company. If we do not think we can help you, we will say so on the first call rather than sell you a project.',
  },
];
