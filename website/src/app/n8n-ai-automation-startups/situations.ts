/**
 * The five situations — the heart of the page.
 *
 * WRITING RULE: keep it short. Two lines a side, fragments rather than full
 * sentences, no line longer than about fifteen words. The first draft of this
 * page read as a document instead of a landing page; the fix was cutting words,
 * not adding decoration. If a line can lose half its words, cut it.
 *
 * Every `human` line stays. It says what a person still decides, which is both
 * true and the thing that stops a careful buyer from walking away.
 *
 * Logos are claims: only tools we actually build with, and only files that exist
 * in /public/logos.
 */

export type Tool = { file: string; name: string };

export type Situation = {
  id: string;
  /** Two-digit marker. Typographic rhythm, not decoration. */
  num: string;
  /** The situation in a founder's own words. Must work read on its own. */
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
    num: '01',
    title: 'An enquiry comes in and nobody answers for six hours',
    today: [
      'A form fill at 9:40pm. A WhatsApp message on Sunday.',
      'By the time someone replies, they have bought elsewhere.',
    ],
    after: [
      'Picked up within minutes, on any channel.',
      'Researched, answered, and handed to the right person with the background attached.',
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
    num: '02',
    title: 'The same fifty questions, all day',
    today: [
      'Where is my order. Is it in stock. When does it ship.',
      'Someone senior is answering these at ten at night.',
    ],
    after: [
      'Routine questions answered straight away, in your words.',
      'Anything unusual goes to a person, with the history already summarised.',
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
    num: '03',
    title: 'Nobody knows what is actually going on',
    today: [
      'Status sits in a WhatsApp group, an inbox, an Excel file and a stale project tool.',
      'You find out something slipped when the customer tells you.',
    ],
    after: [
      'One summary every morning: what moved, what is stuck, who is waiting.',
      'Pulled from the tools your team already uses.',
    ],
    tools: [
      { file: 'slack.svg', name: 'Slack' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'gmail.svg', name: 'Gmail' },
    ],
    human: 'what to do about it.',
  },
  {
    id: 'marketing',
    num: '04',
    title: 'Marketing stops the week your marketing person is busy',
    today: [
      'Three posts in a good week, then nothing for a month.',
      'The blog has not moved since its owner left.',
    ],
    after: [
      'Research, writing, images and scheduling run to a calendar.',
      'You approve. You do not produce.',
    ],
    tools: [
      { file: 'claude.svg', name: 'Claude' },
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'instagram.svg', name: 'Instagram' },
      { file: 'perplexity.svg', name: 'Perplexity' },
    ],
    human: 'the positioning, the offer, and what goes out.',
  },
  {
    id: 'documents',
    num: '05',
    title: 'Paperwork that needs a person to read it',
    today: [
      'Invoices, purchase orders, KYC files, GST paperwork.',
      'Read by a person, typed in by the same person, and typed in wrong.',
    ],
    after: [
      'Read, checked against what they should be, and filed.',
      'Anything that does not add up is flagged. The rest goes through.',
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
   Every figure is published research and the source prints underneath it on the
   page. That is the point: it is what separates this page from an agency that
   made its numbers up. Never add a figure without a source, and never present
   any of these as a Chronexa client result. */

export type ImpactFigure = {
  value: string;
  line: string;
  source: string;
};

export const IMPACT: ImpactFigure[] = [
  {
    value: '42 hrs',
    line: 'The average company takes 42 hours to answer a new enquiry. A quarter never answer.',
    source: 'Harvard Business Review, 2,241 companies',
  },
  {
    value: '7×',
    line: 'Answer within the hour and you are seven times more likely to qualify that lead.',
    source: 'Same study, and the MIT lead response research',
  },
  {
    value: '60%',
    line: 'Six of every ten hours your team works go to chasing information and retyping it.',
    source: 'Asana, 13,000 knowledge workers',
  },
];

/* ─── FAQ ──────────────────────────────────────────────────────────────
   Full-paragraph answers are the house standard for indexed pages, where they
   earn SEO and AI-citation value. This page is noindex and paid-traffic only, so
   the answers are trimmed to what a founder will actually read on a phone —
   still complete, roughly half the length. */

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does it take?',
    a: 'Two to three weeks for a first build. Week one we sit with whoever does the work by hand and map what actually happens, which is usually not what the process document says. Week two we build it and connect it to your tools. Week three we test it on your real data and hand it over. Bigger builds take longer, and we say so before you commit.',
  },
  {
    q: 'We already use Zapier or Make. Why change?',
    a: 'You may not need to. If the bill is small and nothing important breaks, leave it. It stops working when you pay per task at volume, when the logic gets too complex for Zapier to express, or when your data needs to stay on your own systems. We build on n8n, which is open source and self-hostable, so cost stops scaling with usage. Moving existing Zaps across is routine for us.',
  },
  {
    q: 'Is our data safe?',
    a: 'Yes, and because of how it is built rather than a promise. We can deploy the whole system inside your own cloud account, so customer records and documents never touch our servers. Where an AI model is involved we use providers that do not train on your data, or run models in your environment. If you are in fintech, healthcare or anything audited, say so on the first call and we design for it from the start.',
  },
  {
    q: 'What happens when it breaks?',
    a: 'Something will break eventually. An API changes, a vendor goes down, someone renames a column. What matters is that it fails loudly. Everything is monitored, retries on temporary failures, and alerts a person when it genuinely needs attention, so you hear it from us and not from a customer. Thirty days of support is included, and you own the files either way.',
  },
  {
    q: 'Can we start with just one thing?',
    a: 'Yes, and we would prefer it. Pick the process that hurts most, we build that, and you judge us on it before committing to anything else. It is a better test than any case study, and it is how most of our longer engagements began.',
  },
  {
    q: 'Does this work for a company like ours?',
    a: 'These five situations turn up in software companies, D2C brands, manufacturers and services firms alike, because they are about how work is organised rather than what you sell. What changes is which tools we connect to: ERP and dispatch for a manufacturer, orders and returns for a D2C brand, CRM and ticketing for software. If we cannot help, we will say so on the call.',
  },
];
