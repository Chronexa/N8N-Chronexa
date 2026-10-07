'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './CpaInteractive.module.css';

/* The document chase, shown rather than described. Pick an engagement type and
   the checklist that engagement actually generates appears, with what came in,
   what is missing, what came in wrong, and what the system did about each.
   Client names are invented; the form names and thresholds are real. */

type Row = {
  doc: string;
  state: 'in' | 'missing' | 'wrong' | 'unreadable';
  note: string;
};

type Engagement = {
  id: string;
  tab: string;
  client: string;
  detail: string;
  rows: Row[];
  chase: string;
  preparer: string;
};

const ENGAGEMENTS: Engagement[] = [
  {
    id: 'k1',
    tab: '1040 with K-1s',
    client: 'Individual · three partnership interests',
    detail: 'Checklist generated from last year’s return plus the engagement letter',
    rows: [
      { doc: 'Form W-2', state: 'in', note: 'Matched to the employer on the prior-year return' },
      { doc: 'Form 1099-B — brokerage', state: 'in', note: '84 pages, parsed to a positions summary' },
      { doc: 'Schedule K-1 — Harbour Lane LP', state: 'in', note: 'Tax year checked: 2025' },
      { doc: 'Schedule K-1 — Ridgeway Partners', state: 'wrong', note: 'This is the 2024 K-1. The client uploaded last year’s copy.' },
      { doc: 'Schedule K-1 — Everett Holdings', state: 'missing', note: 'Partnership is on extension. Flagged as blocked on a third party, not on the client.' },
      { doc: 'Form 1098 — mortgage interest', state: 'in', note: 'Amount extracted, tied to the same property as last year' },
    ],
    chase: 'One email to the client, naming the two items only they can fix — not a generic "please send your documents" reminder. The Everett K-1 is excluded from the chase because chasing the client for it would be wrong.',
    preparer: 'The preparer sees the return is 4 of 6 ready, that one item is a client error with the exact reason, and that one is blocked externally with a date to re-check. Nobody had to open a folder to find that out.',
  },
  {
    id: 'nr',
    tab: 'Non-resident (1040-NR)',
    client: 'Non-resident individual · US-source income',
    detail: 'Residency and treaty position drive the whole checklist',
    rows: [
      { doc: 'Substantial presence day count', state: 'in', note: 'Entry and exit dates supplied; count computed and shown to the preparer' },
      { doc: 'Form W-8BEN on file with payers', state: 'missing', note: 'Not on file with one of the two payers. This changes the withholding position.' },
      { doc: 'Form 1042-S', state: 'in', note: 'Income code and withholding rate extracted' },
      { doc: 'Treaty article being claimed', state: 'missing', note: 'Requires a professional decision. Routed to the preparer, not asked of the client.' },
      { doc: 'Passport and visa history', state: 'unreadable', note: 'Photographed at an angle, two pages illegible. Re-upload requested with a specific instruction.' },
    ],
    chase: 'Two separate messages, because two different people have to act. The client gets a re-upload request for the passport pages. The preparer gets the treaty question, because a client cannot answer it and should not be asked to.',
    preparer: 'The judgement calls are separated from the admin and land in front of the person qualified to make them. That separation is the whole point of the system.',
  },
  {
    id: 'scorp',
    tab: 'S-corporation',
    client: 'Closely held S-corp · one shareholder-employee',
    detail: 'Books, payroll and basis, not a shoebox of receipts',
    rows: [
      { doc: 'Trial balance from the bookkeeping file', state: 'in', note: 'Pulled directly rather than emailed as a PDF' },
      { doc: 'Payroll reports — four quarters', state: 'missing', note: 'Q4 only. Requested from the payroll provider, not from the client.' },
      { doc: 'Fixed asset additions', state: 'in', note: 'Three invoices over the capitalisation threshold flagged for a depreciation decision' },
      { doc: 'Shareholder distributions', state: 'in', note: 'Totalled and compared against officer compensation for the preparer to review' },
      { doc: 'Loan agreements affecting basis', state: 'missing', note: 'Referenced in the prior-year workpapers but never collected' },
    ],
    chase: 'The Q4 payroll report is requested from the provider directly. The loan agreement request goes to the client with the reason attached, because "we need it for basis" gets a faster answer than "please upload any loan documents".',
    preparer: 'Reasonable compensation against distributions is surfaced as a question, with the numbers next to it. The system does not answer it. It just refuses to let it be discovered in April.',
  },
  {
    id: 'expat',
    tab: 'Expat and foreign accounts',
    client: 'US citizen abroad · accounts in two countries',
    detail: 'Threshold-driven: the checklist changes as balances are read',
    rows: [
      { doc: 'Foreign account statements', state: 'in', note: 'Two institutions, statements in a non-English format and layout' },
      { doc: 'FBAR (FinCEN 114) determination', state: 'in', note: 'Aggregate exceeded the $10,000 threshold during the year, so the filing is added to the engagement automatically' },
      { doc: 'Form 8938 threshold check', state: 'in', note: 'Computed from the same statements; different threshold, different test, shown separately' },
      { doc: 'Foreign earned income support', state: 'missing', note: 'Needed to choose between the exclusion and the foreign tax credit' },
      { doc: 'Foreign tax paid — receipts', state: 'unreadable', note: 'Two documents are in the local language. Translated, with the original kept alongside.' },
    ],
    chase: 'One request, for the two things actually outstanding. The client is not asked whether they need an FBAR — the balances already answered that, and asking would only produce a guess.',
    preparer: 'The thresholds are tested from the documents rather than from a questionnaire the client fills in from memory. That is the difference between a checklist and an intake form.',
  },
];

const STATE_LABEL: Record<Row['state'], string> = {
  in: 'Received',
  missing: 'Missing',
  wrong: 'Wrong document',
  unreadable: 'Unreadable',
};

export function DocumentChase() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(ENGAGEMENTS.length, 8000);
  const e = ENGAGEMENTS[active];
  const ready = e.rows.filter(r => r.state === 'in').length;

  return (
    <div className={s.chase} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>THE DOCUMENT CHECKLIST</span>
        <span>{running ? 'PLAYING · PICK ONE' : 'PICK AN ENGAGEMENT'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose an engagement type">
        {ENGAGEMENTS.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={i === active} onClick={() => pick(i)}>
            {x.tab}
            {i === active && (
              <i
                key={`${active}-${running}`}
                className={running ? `${s.progress} ${s.progressRun}` : s.progress}
                style={running ? { animationDuration: `${intervalMs}ms` } : undefined}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={e.id} {...panelMotion(reduce)}>
          <div className={s.head}>
            <div>
              <b>{e.client}</b>
              <span>{e.detail}</span>
            </div>
            <span className={s.count}>
              {ready}/{e.rows.length} ready
            </span>
          </div>

          {/* The rows arriving one by one is the point: the checklist is being
              worked through, not displayed. */}
          <ul className={s.rows} aria-live="polite">
            {e.rows.map((r, i) => (
              <motion.li key={r.doc} className={s[r.state]} {...rowMotion(reduce, i)}>
                <span className={s.state}>{STATE_LABEL[r.state]}</span>
                <div>
                  <b>{r.doc}</b>
                  <span>{r.note}</span>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div className={s.outcome} {...rowMotion(reduce, e.rows.length)}>
            <p className={s.label}>What the system sends</p>
            <p>{e.chase}</p>
            <p className={s.label}>What the preparer opens</p>
            <p className={s.preparer}>{e.preparer}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
