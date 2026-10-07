'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import { track } from '../../lib/analytics';
import s from './CrmInteractive.module.css';
import p from './crm.module.css';

/* ────────────────────────────────────────────────────────────────────────
   1. The Slack command centre.
   The single clearest way to explain what "CRM automation" means to a buyer:
   the record is already assembled, the decision is one tap, and the write-back
   happens across every system at once. Illustrative — no live data.
   ──────────────────────────────────────────────────────────────────────── */
const ALERTS = [
  {
    id: 'stale',
    tab: 'Deal gone quiet',
    channel: '#sales-ops',
    title: 'Northwind Logistics — $48,000 — Proposal sent',
    facts: [
      { src: 'CRM', text: 'No stage change for 7 days' },
      { src: 'Gmail', text: 'Prospect replied yesterday. Nobody has answered.' },
      { src: 'Finance', text: 'The discount on this proposal is still unapproved' },
    ],
    actions: ['Approve the discount', 'Reassign', 'Snooze 3 days'],
    result: [
      'Discount marked approved, with who approved it and when',
      'A reply is drafted from the thread and left for you to check',
      'Stage moves to Negotiation and the next check is set for Thursday',
    ],
    note: 'Nobody opened the CRM. The record is still correct.',
  },
  {
    id: 'lead',
    tab: 'New enquiry',
    channel: '#leads',
    title: 'New enquiry — ops@brightpath.co',
    facts: [
      { src: 'Match', text: 'Recognised as an existing account. No second record created.' },
      { src: 'Enrichment', text: '240 staff, third-party logistics, raised a Series B in March' },
      { src: 'Routing', text: 'Territory and current load put this with Priya' },
    ],
    actions: ['Accept', 'Reassign', 'Not a fit'],
    result: [
      'Contact attached to the account that already existed',
      'Priya is notified with the company research already written up',
      'A two-hour first-response timer starts, and escalates if it runs out',
    ],
    note: 'The duplicate that would normally be created here never exists.',
  },
  {
    id: 'risk',
    tab: 'Account at risk',
    channel: '#account-alerts',
    title: 'Meridian Group — invoice 92 days overdue',
    facts: [
      { src: 'Accounting', text: 'Flagged on 2 September. Nothing since.' },
      { src: 'Calendar', text: 'Two meetings with this account booked this week' },
      { src: 'Support', text: 'Three tickets open, one escalated' },
    ],
    actions: ['Put a banner on the record', 'Tell the owner', 'Open the account'],
    result: [
      'Anyone opening this account sees the payment status first',
      'The owner is told before Tuesday’s call, not after it',
      'Renewal is held until finance clears the account',
    ],
    note: 'The business already knew all three of these things. The record did not.',
  },
] as const;

export function CommandCentre() {
  const { ref, active: i, pick: cycle, running, reduce, intervalMs, holdProps } = useAutoCycle(ALERTS.length);
  const a = ALERTS[i];
  // Which alert has had its action played. Storing the id rather than a boolean
  // means switching alert resets the panel on its own, with no effect needed.
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const done = doneFor === a.id;

  // While the demo is playing itself it also plays the action, so a visitor who
  // never clicks still sees the whole loop: alert → decision → write-back.
  // Analytics only fire for real clicks, never for the auto-play.
  useEffect(() => {
    if (!running) return;
    const id = ALERTS[i].id;
    const t = setTimeout(() => setDoneFor(id), 2600);
    return () => clearTimeout(t);
  }, [i, running]);

  const pick = (n: number) => { cycle(n); track('crm_alert_change', { alert: ALERTS[n].id }); };
  const act = () => { setDoneFor(a.id); track('crm_alert_action', { alert: a.id }); };

  return (
    <div className={s.centre} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>Slack as the command centre</span>
        <span>{running ? 'Playing · try an action' : 'Illustrative · no live data'}</span>
      </div>
      <div className={s.picker} role="group" aria-label="Choose an example alert">
        {ALERTS.map((x, n) => (
          <button key={x.id} type="button" aria-pressed={n === i} onClick={() => pick(n)}>
            {x.tab}
            {n === i && (
              <i
                key={`${i}-${running}`}
                className={running ? `${s.progress} ${s.progressRun}` : s.progress}
                style={running ? { animationDuration: `${intervalMs}ms` } : undefined}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={a.id} {...panelMotion(reduce)}>
          <div className={s.message}>
            <p className={s.channel}>{a.channel}</p>
            <div className={s.from}><span aria-hidden="true">◆</span> Chronexa<i>APP</i><time>9:02</time></div>
            <p className={s.subject}>{a.title}</p>
            <dl className={s.facts}>
              {a.facts.map((f, n) => (
                <motion.div key={f.src} {...rowMotion(reduce, n)}><dt>{f.src}</dt><dd>{f.text}</dd></motion.div>
              ))}
            </dl>
            <motion.div className={s.actions} {...rowMotion(reduce, a.facts.length)}>
              <button type="button" className={s.go} onClick={act}>{a.actions[0]}</button>
              <button type="button" onClick={act}>{a.actions[1]}</button>
              <button type="button" onClick={act}>{a.actions[2]}</button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={s.outcome} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key={`${a.id}-done`} {...panelMotion(reduce)}>
              <p className={s.outcomeLabel}>What just happened everywhere else</p>
              <ul>
                {a.result.map((r, n) => <motion.li key={r} {...rowMotion(reduce, n)}>{r}</motion.li>)}
              </ul>
              <motion.p className={s.outcomeNote} {...rowMotion(reduce, a.result.length)}>{a.note}</motion.p>
            </motion.div>
          ) : (
            <motion.p key={`${a.id}-idle`} className={s.prompt} {...panelMotion(reduce)}>
              Choose an action to see what it writes back across your systems.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   2. What we actually build.
   The thing the old page was missing entirely: the inventory, in the order a
   project is genuinely built. Each panel carries its own drawing rather than a
   shared illustration, because the six pieces are not the same shape of work.
   ──────────────────────────────────────────────────────────────────────── */
const BUILD = [
  {
    id: 'schema',
    tab: 'The data model',
    h: 'We design the schema before we automate anything.',
    body: 'This is where most CRM projects are already lost. Tables, relationships, which system is allowed to write to which field, and a separate view for each role. Get this wrong and every automation on top of it inherits the mistake.',
    points: [
      'Accounts, contacts, deals, and whatever else your business actually tracks',
      'One owner per field, so a sync can never quietly overwrite a person',
      'A view for sales, one for finance, one for delivery — same records underneath',
      'Written down, so the next engineer does not have to guess',
    ],
    caption: 'Field ownership is agreed up front. It is what stops a sync war later.',
  },
  {
    id: 'intake',
    tab: 'Records that write themselves',
    h: 'The record exists before anyone thinks to create it.',
    body: 'Enquiries arrive by email, web form, phone, referral, LinkedIn and spreadsheet. Each one is a place a record can be created automatically, matched against what already exists, and enriched — instead of typed in later from memory.',
    points: [
      'Inbound email and web forms parsed into structured records',
      'Matched against existing accounts so duplicates are not created',
      'Enriched with company size, sector, funding and intent signals',
      'Assigned by territory, round-robin or current workload',
    ],
    caption: 'Deduplication runs before creation, not as a monthly clean-up.',
  },
  {
    id: 'slack',
    tab: 'Slack as the command centre',
    h: 'The decision comes to the person. Not the other way round.',
    body: 'Most people will not open a CRM to approve something. They will tap a button in the channel they already have open. So the alert arrives with the context already gathered, and the action writes back everywhere it needs to.',
    points: [
      'Approvals for discounts, proposals, refunds and scope changes',
      'Alerts assembled from several systems, not just the CRM',
      'Actions that write back to the record, the thread and the calendar',
      'A morning digest of what needs a person today',
    ],
    caption: 'Teams already using Microsoft Teams get the same thing there.',
  },
  {
    id: 'checks',
    tab: 'Scheduled checks',
    h: 'Something looks at the data every night, so nobody has to.',
    body: 'A CRM decays quietly. Scheduled jobs catch the decay while it is still small: deals that stopped moving, fields that were never filled, accounts that finance has flagged, duplicates that slipped through, response times that were missed.',
    points: [
      'Stale pipeline surfaced before the forecast is built on it',
      'Required fields checked against the stage the deal claims to be at',
      'Accounts cross-checked against accounting and support',
      'A weekly data-quality summary, so the drift is visible',
    ],
    caption: 'Frequency is set per check. Some run nightly, some hourly.',
  },
  {
    id: 'connect',
    tab: 'Connected systems',
    h: 'One record that knows what the business knows.',
    body: 'The reason a CRM feels wrong is usually not the CRM. It is that the account record has no idea what accounting, support or delivery already know about that customer. Connecting those is often the highest-value part of the job.',
    points: [
      'Gmail or Outlook for the thread history, not a manual log',
      'Meeting notes from Zoom, Meet or Fireflies attached to the account',
      'Accounting for invoice and payment status on the record',
      'Support, delivery, storage, billing and whatever else holds the truth',
    ],
    caption: 'We connect through documented APIs and webhooks, not screen scraping.',
  },
  {
    id: 'agents',
    tab: 'Agents on your records',
    h: 'Ask the CRM a question in plain language.',
    body: 'Once the data is trustworthy, an agent on top of it is genuinely useful rather than a demo. It answers from your records, shows which record it read, and is only allowed to change the things you decided it can change.',
    points: [
      '“What happened with Meridian since June?” answered from the record',
      'Follow-ups drafted from the actual thread, left for a person to send',
      'Account summaries written before a call, not after it',
      'Read access broad, write access narrow and logged',
    ],
    caption: 'Every answer cites the record it came from. Writes are permissioned.',
  },
] as const;

function Figure({ id }: { id: string }) {
  if (id === 'schema') return (
    <figure className={p.figure}>
      <div className={p.schema}>
        <div className={p.schemaCard}><strong>Accounts</strong><span>name · sector · size</span><span>owner — sales</span><span>payment status — finance</span></div>
        <div className={p.schemaCard}><strong>Contacts</strong><span>role · email</span><span>linked to account</span><span>consent — marketing</span></div>
        <div className={p.schemaCard}><strong>Deals</strong><span>stage · value</span><span>discount — finance</span><span>next step — sales</span></div>
      </div>
      <figcaption>Field ownership is agreed up front. It is what stops a sync war later.</figcaption>
    </figure>
  );
  if (id === 'intake') return (
    <figure className={p.figure}>
      <div className={p.flow}>
        <div className={p.flowRow}><span className={p.node}>Inbound email</span><span className={p.node}>Web form</span><span className={p.node}>Referral</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={p.node}>Match against existing accounts</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={p.node}>Enrich</span><span className={p.node}>Score</span><span className={p.node}>Assign</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={`${p.node} ${p.solid}`}>One record, one owner</span><span className={`${p.node} ${p.dash}`}>Unmatched → review</span></div>
      </div>
      <figcaption>Deduplication runs before creation, not as a monthly clean-up.</figcaption>
    </figure>
  );
  if (id === 'slack') return (
    <figure className={p.figure}>
      <div className={p.flow}>
        <div className={p.flowRow}><span className={p.node}>CRM</span><span className={p.node}>Accounting</span><span className={p.node}>Support</span><span className={p.node}>Calendar</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={`${p.node} ${p.solid}`}>One alert, context already gathered</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={p.node}>A person decides</span><span className={p.arrow}>→</span><span className={p.node}>Written back everywhere</span></div>
      </div>
      <figcaption>Teams already using Microsoft Teams get the same thing there.</figcaption>
    </figure>
  );
  if (id === 'checks') return (
    <figure className={p.figure}>
      <div className={p.cron}>
        <div className={p.cronRow}><code>02:00</code><span>Deals with no movement in 7 days</span><b>→ owner</b></div>
        <div className={p.cronRow}><code>02:10</code><span>Required fields missing for the current stage</span><b>→ owner</b></div>
        <div className={p.cronRow}><code>06:00</code><span>Accounts overdue in accounting</span><b>→ banner</b></div>
        <div className={p.cronRow}><code>hourly</code><span>First response older than the agreed SLA</span><b>→ escalate</b></div>
        <div className={p.cronRow}><code>weekly</code><span>Duplicate and data-quality sweep</span><b>→ digest</b></div>
      </div>
      <figcaption>Frequency is set per check. Some run nightly, some hourly.</figcaption>
    </figure>
  );
  if (id === 'connect') return (
    <figure className={p.figure}>
      <div className={p.flow}>
        <div className={p.flowRow}><span className={p.node}>Gmail / Outlook</span><span className={p.node}>Zoom / Meet</span><span className={p.node}>Xero / QuickBooks</span></div>
        <div className={p.flowRow}><span className={p.node}>Zendesk / Intercom</span><span className={p.node}>Drive / SharePoint</span><span className={p.node}>Stripe</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={`${p.node} ${p.solid}`}>The account record</span></div>
      </div>
      <figcaption>We connect through documented APIs and webhooks, not screen scraping.</figcaption>
    </figure>
  );
  return (
    <figure className={p.figure}>
      <div className={p.flow}>
        <div className={p.flowRow}><span className={p.node}>“What happened with Meridian since June?”</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={p.node}>Reads: account, threads, tickets, invoices</span></div>
        <div className={p.flowRow}><span className={p.arrow}>↓</span><span className={`${p.node} ${p.solid}`}>Answer, with the records it used</span><span className={`${p.node} ${p.dash}`}>Write? → needs permission</span></div>
      </div>
      <figcaption>Every answer cites the record it came from. Writes are permissioned.</figcaption>
    </figure>
  );
}

export function BuildTabs() {
  const [i, setI] = useState(0);
  const b = BUILD[i];
  return (
    <>
      <div className={p.tabs} role="group" aria-label="What we build">
        {BUILD.map((x, n) => (
          <button key={x.id} type="button" aria-pressed={n === i} aria-controls="build-panel"
            onClick={() => { setI(n); track('crm_build_tab', { tab: x.id }); }}>
            <span>{String(n + 1).padStart(2, '0')}</span>{x.tab}
          </button>
        ))}
      </div>
      <div id="build-panel" className={p.panel}>
        <div>
          <h3>{b.h}</h3>
          <p>{b.body}</p>
          <ul>{b.points.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
        <Figure id={b.id} />
      </div>
    </>
  );
}
