/**
 * The single source of truth for this page's FAQ content — imported by
 * FAQAccordion.tsx (renders it) and page.tsx (builds the FAQPage JSON-LD
 * schema from it). Deliberately NOT in FAQAccordion.tsx itself: that file is
 * 'use client', and a client component's exports can't be safely imported
 * into a server component (Next.js's client-boundary serialization breaks
 * plain data exports, not just JSX) — this plain, directive-free module is
 * importable from both.
 */
export const startupFaqs = [
  {
    q: 'What is the Leverage Line?',
    a: 'The Leverage Line is a simple framework for measuring whether your startup\'s output is scaling faster than your headcount — or in lockstep with it. It uses two numbers you already know (your output growth rate and your headcount growth rate) to produce a Leverage Ratio. A ratio near 1.0 means you\'re in the 1:1 Trap — adding people and cost at the same rate you\'re adding output. Above 1.0 means your systems are doing what additional hires would otherwise do. The framework helps founders make the hiring-vs-systems decision with arithmetic instead of instinct.',
  },
  {
    q: 'How is this different from just hiring a growth marketer or SDR?',
    a: 'Hiring is the right call when the work requires human judgment, relationships, or creative strategy. It\'s the wrong call when the work is repeatable — researching prospects, formatting reports, triaging support tickets, compiling data. A growth marketer who spends 60% of their week on research and formatting is a system problem disguised as a hiring problem. The Leverage Line helps you see which is which before you commit the payroll.',
  },
  {
    q: 'We\'re a 15-person startup. Is this too early for us?',
    a: 'The Leverage Line is most relevant for startups that have found product-market fit and are now scaling operations — typically Seed+ through Series B, with 20-150 people. If you\'re pre-PMF and still figuring out what to build, hiring generalists who do everything by hand is correct. If you\'ve found PMF and are now hiring to handle growing volume, you\'re in exactly the right window.',
  },
  {
    q: 'What if we\'ve already tried automation and it didn\'t work?',
    a: 'Most failed automation attempts fail for one of two reasons: they automated the wrong thing (a low-leverage process that didn\'t move the ratio), or they were built as standalone tools disconnected from the team\'s real workflow. Chronexa\'s method starts by diagnosing which specific bottleneck has the highest leverage, then builds the system directly into the tools your team already uses — not as a separate platform they have to learn and remember to check.',
  },
  {
    q: 'How long does implementation take?',
    a: 'A single-function system (e.g., lead enrichment and personalization, or support ticket triage) goes live in 2 to 3 weeks. A multi-function build touching sales, marketing, and operations takes 3 to 4 weeks from discovery call to live deployment. All timelines are agreed in the scoped proposal before work begins.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Transparent, fixed-price project scopes based on the specific bottleneck being solved. The process is: discovery call → scoped proposal with agreed deliverables and ROI metrics → fixed price accepted before any work starts. No hourly billing, no retainer required upfront, no hidden recurring SaaS seat fees. You own the system outright after handoff.',
  },
  {
    q: 'What tools do you integrate with?',
    a: 'We build directly into the tools your team already runs: HubSpot, Slack, Notion, Intercom, WhatsApp Business, Apollo, Clay, Airtable, and custom databases via n8n and API integrations. The whole point is zero new software logins — the system lives inside your existing stack, not beside it.',
  },
  {
    q: 'How secure is our data?',
    a: 'Systems are deployed inside your own cloud environment with zero public LLM data leakage. Every action includes full audit logs for enterprise data governance. We do not store, train on, or retain access to your customer data after handoff.',
  },
];
