/**
 * Full rewrite of account-reconciliation-automation-custom-ai-workflows (2026-07-25).
 * WHY: old body was dense with fabricated case studies ("Mitchell & Associates", "Agentmelt",
 * invented 96.1%/$187K/340-hour figures). Rewritten to the v2 method: keyword
 * "account reconciliation automation", mid-market firm, accuracy/integration apprehension,
 * alongside-not-replace, real specifics only. Slug/equity/publishedAt/hero preserved via patch.
 *
 * Run: FIX=1 node scripts/rewrite-reconciliation-post-2026-07.mjs
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

let K = 0;
const key = p => `rw${p}${(++K).toString(36).padStart(3, '0')}`;
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

const PILLAR = { href: '/cpa-tax-document-automation', text: 'AI automation for CPA and accounting firms' };
const CALC = { href: '/cpa-tax-season-capacity-calculator', text: 'CPA Tax Season Capacity Calculator' };

const body = [
  p('Month-end at most accounting firms has a familiar soundtrack: a senior bookkeeper working through a client’s four bank accounts, two credit cards and a line of credit, matching transactions one screen at a time. The client’s books are not complicated — they are just voluminous, inconsistent, and spread across feeds that never quite agree. Account reconciliation automation exists because this work is high-volume, rule-shaped, and consumes exactly the people a firm can least afford to park on it.'),
  h2('Why reconciliation eats senior hours'),
  p('The mechanics are unglamorous. Bank feeds import most transactions, but the exceptions define the workload: a vendor that changed its payment descriptor, a deposit that nets three invoices, a transfer that looks like revenue, duplicate feeds after a bank migration. Off-the-shelf matching rules in QuickBooks Online or Xero clear the easy majority and then stop — and everything they cannot match falls to a human, client by client, month after month.'),
  p('The structural problem is that packaged software applies the same fixed rules to every client, while every client’s books misbehave differently. A construction client’s retainage payments, a property client’s trust transfers, an e-commerce client’s processor payouts netting fees — each needs its own matching logic. Firms end up staffing the gap with their most experienced people, because only they know each client’s quirks. That knowledge living in one bookkeeper’s head is also exactly what makes the close fragile when that person is out, or leaves.'),
  h2('What account reconciliation automation actually does'),
  p('A custom reconciliation workflow has three layers, and none of them is exotic:'),
  li('Ingestion: bank and card activity, ledger exports and statements are pulled automatically — API connections such as Plaid or the accounting platform’s own feeds — so nobody downloads a CSV again.'),
  li('Client-specific matching: instead of one global ruleset, each client’s workflow encodes how that client’s transactions actually behave — the descriptor variants, the netted deposits, the recurring inter-account transfers — and applies it consistently every month.'),
  li('Exception routing: whatever the system cannot match above the firm’s confidence threshold lands in a review queue with context attached — the candidate matches, the history, the source lines — so the reviewer decides in seconds instead of investigating for minutes.'),
  p('The staff experience is the point: your bookkeepers stop being matchers and become reviewers. The system does the reading and comparing; your people make the calls it is not sure about, and every call they make teaches the workflow the client’s next quirk. Nobody is replaced — the same team simply closes more clients, sooner, with the judgment work left where it belongs. It is the same alongside-your-staff pattern as the rest of our ', PILLAR, ' work, applied to the close.'),
  h2('Custom workflow or packaged tool?'),
  p('The fair question is why not buy BlackLine or FloQast and be done. For standardized, high-volume corporate closes, those platforms are strong — that is what they are engineered for. The mid-market accounting firm’s problem is different: dozens of small clients, each with a distinct and slightly messy financial footprint, on a stack the firm already runs. Per-seat platform pricing scales badly across many small clients, and rigid rule engines handle client-level weirdness worst of all. A custom workflow inverts that: it is built around your clients’ actual behavior, runs behind QuickBooks Online, Xero or your existing stack, and costs the same whether five people or fifty touch the output.'),
  p('The honest counterpoint: if your firm logs under roughly a hundred reconciliation hours a month, packaged tooling or the accounting platform’s native rules may genuinely be enough. Automation earns its keep on volume and complexity — the ', CALC, ' takes two minutes and will tell you which side of that line your firm is on.'),
  h2('Accuracy, evidence, and where the data lives'),
  p('For a mid-market firm the deciding questions are accuracy and integration, so both get engineering rather than promises. Every automated match carries a confidence score, the threshold is the firm’s to set, and anything below it routes to review — what reaches the ledger is either verified or explicitly flagged, never silently guessed. Every match keeps its evidence: which lines, which rule, which reviewer confirmed it, exportable when a client, auditor or peer reviewer asks. And client financial data stays on infrastructure the firm controls — dedicated model instances via OpenAI, Google Vertex, AWS or Azure — with role-based access, full logging, and nothing training a public model. That is also the documentation your FTC Safeguards Rule plan expects for any vendor touching client books.'),
  h2('Frequently Asked Questions'),
  h3('How much of reconciliation can actually be automated?'),
  p('The honest answer is: the majority of transaction matching, and none of the judgment. Real proportions depend on your clients’ feed quality and consistency, which is why we scope against a sample of your actual books rather than quoting a universal percentage.'),
  h3('Does this replace our bookkeepers?'),
  p('No. It moves them from matching to reviewing — the exceptions, the judgment calls, the client conversations. Firms use the recovered hours to take on more clients or move staff toward advisory work, not to cut the team.'),
  h3('What does it integrate with?'),
  p('QuickBooks Online and Xero are most common, plus bank connections via Plaid or native feeds, and your practice-management stack for status visibility. The scoping question is your specific mix, not whether integration is possible.'),
  h3('How do we know if the investment is worth it?'),
  p('Measure the status quo first: reconciliation hours per month, close-cycle length, and how often senior staff are pulled from billable or advisory work to fix the close. The free ', CALC, ' gives you that baseline in two minutes, no email required.'),
  p('Reconciliation is one stage of the lifecycle we automate for accounting firms — the full picture, from onboarding through delivery, is here: ', PILLAR, '. When you want it mapped against your client base, book a call.'),
];

const SET = {
  title: 'Account Reconciliation Automation for Accounting Firms',
  body,
  keyTakeaways: [
    'Reconciliation consumes senior staff because packaged software applies fixed rules while every client’s books misbehave differently.',
    'Account reconciliation automation has three layers: automated ingestion, client-specific matching, and exception routing with context.',
    'Bookkeepers shift from matching to reviewing — the system reads and compares; humans keep every judgment call.',
    'Below roughly 100 reconciliation hours a month, native platform rules may be enough; automation earns its keep on volume.',
    'Every automated match keeps evidence — lines, rule, reviewer — exportable for auditors and peer review.',
  ],
  updatedAt: '2026-07-25',
  readingTime: 7,
  author: { _ref: 'author-abhishek-walia', _type: 'reference' },
};

console.log(`New body: ${body.length} blocks, ~${body.reduce((n, b) => n + b.children.reduce((m, s) => m + s.text.split(/\s+/).filter(Boolean).length, 0), 0)} words`);
if (FIX) {
  await c.patch('post-account-reconciliation-automation-custom-ai-workflows').set(SET).commit();
  console.log('✓ rewritten (slug, publishedAt, hero preserved)');
} else console.log('DRY RUN — FIX=1 to apply.');
