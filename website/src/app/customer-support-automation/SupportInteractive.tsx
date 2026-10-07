'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './SupportInteractive.module.css';

/* The triage bench. Four tickets that a real support queue actually contains,
   each routed to the agent that owns it. The point of the demo is the third
   column: what that agent is allowed to read. A support agent with access to
   everything is the thing that goes wrong, so scope is shown, not hidden. */

type Ticket = {
  id: string;
  tab: string;
  from: string;
  channel: string;
  body: string;
  agent: string;
  reads: { system: string; scope: string }[];
  verdict: 'answered' | 'acted' | 'escalated';
  reply: string;
  cites?: string[];
  note: string;
};

const TICKETS: Ticket[] = [
  {
    id: 'docs',
    tab: 'A documented question',
    from: 'priya@ardentworks.com',
    channel: 'Intercom · web',
    body: 'How do I change the billing email on our account? The invoices are still going to someone who left.',
    agent: 'Knowledge agent',
    reads: [
      { system: 'Help centre', scope: 'published articles' },
      { system: 'Product docs', scope: 'current version only' },
    ],
    verdict: 'answered',
    reply:
      'Billing email is changed under Settings → Billing → Invoice recipient. It is separate from the account owner, which is why removing the user did not move the invoices. Changes apply from the next invoice; earlier ones keep the old address.',
    cites: ['Help centre — "Managing billing contacts"', 'Docs — Settings reference §4.2'],
    note: 'This is the ticket every vendor bot handles well. If most of your queue looks like this, buy the off-the-shelf one — we will tell you so.',
  },
  {
    id: 'account',
    tab: 'Needs their account',
    from: 'ops@northgate.io',
    channel: 'Email',
    body: 'We were charged twice in September. Can you check what happened and refund one of them?',
    agent: 'Billing agent',
    reads: [
      { system: 'Stripe', scope: 'read-only, this customer' },
      { system: 'Subscription record', scope: 'this account' },
      { system: 'Refund policy', scope: 'internal, not customer-facing' },
    ],
    verdict: 'acted',
    reply:
      'There are two charges on 3 September: INV-20418 for the September subscription, and INV-20431, a proration created when a seat was added the same day. The second is legitimate rather than a duplicate, so a refund would be wrong — but it should have been billed on the next cycle. I have flagged it for a credit and a human is confirming before anything moves.',
    note: 'No help centre article contains this answer. It exists in Stripe, and only for this customer. Note also what did not happen: nothing was refunded automatically.',
  },
  {
    id: 'technical',
    tab: 'Needs your logs',
    from: 'dev@lumenpath.co',
    channel: 'Slack Connect',
    body: 'Our nightly export has been stuck at 40% for two hours. Nothing changed on our side.',
    agent: 'Technical agent',
    reads: [
      { system: 'Job queue', scope: 'read-only, this tenant' },
      { system: 'Error logs', scope: 'redacted, 24h window' },
      { system: 'Status page', scope: 'public' },
    ],
    verdict: 'acted',
    reply:
      'Job 8841 is not stuck, it is retrying. Three rows are failing on a date field that arrived as 31/09/2026, which is not a real date, and the retry backoff is holding the whole run at 40%. The rows are in the attached list. Fix those and the run completes, or reply here and we will skip them for tonight.',
    note: 'This is the ticket that would have cost an engineer forty minutes. It needs read access to your systems, which is exactly why the access is narrow, logged and redacted.',
  },
  {
    id: 'human',
    tab: 'Should not be answered',
    from: 'm.doyle@caldera-group.com',
    channel: 'WhatsApp',
    body: 'This is the third time this month. Honestly we are close to just cancelling.',
    agent: 'Escalation agent',
    reads: [
      { system: 'Ticket history', scope: 'this account, 90 days' },
      { system: 'Account record', scope: 'owner, plan, renewal date' },
    ],
    verdict: 'escalated',
    reply:
      'Routed to Sarah, who owns this account, with a summary: three tickets in 31 days on the same import failure, none of which closed with a root cause. Renewal is in six weeks. The customer has not been sent an automated reply.',
    note: 'The most valuable thing an automated system does here is recognise that it should stop. A cheerful bot answer to this message costs you the account.',
  },
];

const VERDICT_LABEL: Record<Ticket['verdict'], string> = {
  answered: 'Answered from documentation',
  acted: 'Answered from live data',
  escalated: 'Handed to a person',
};

export function TriageBench() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(TICKETS.length);
  const t = TICKETS[active];

  return (
    <div className={s.bench} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>THE TRIAGE BENCH</span>
        <span>{running ? 'PLAYING · PICK ANY TICKET' : 'PICK A TICKET'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose a support ticket">
        {TICKETS.map((x, i) => (
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
        <motion.div key={t.id} {...panelMotion(reduce)}>
          <div className={s.ticket}>
            <p className={s.meta}>
              <b>{t.from}</b>
              <span>{t.channel}</span>
            </p>
            <p className={s.body}>&ldquo;{t.body}&rdquo;</p>
          </div>

          <div className={s.route} aria-live="polite">
            <motion.div className={s.routeHead} {...rowMotion(reduce, 0)}>
              <span className={s.agentTag}>{t.agent}</span>
              <span className={`${s.verdict} ${s[t.verdict]}`}>{VERDICT_LABEL[t.verdict]}</span>
            </motion.div>

            <p className={s.label}>What this agent is allowed to read</p>
            <ul className={s.reads}>
              {t.reads.map((r, i) => (
                <motion.li key={r.system} {...rowMotion(reduce, i + 1)}>
                  <b>{r.system}</b>
                  <span>{r.scope}</span>
                </motion.li>
              ))}
            </ul>

            <p className={s.label}>{t.verdict === 'escalated' ? 'What happens instead' : 'What the customer gets'}</p>
            <motion.p className={s.reply} {...rowMotion(reduce, t.reads.length + 1)}>{t.reply}</motion.p>

            {t.cites && (
              <motion.ul className={s.cites} {...rowMotion(reduce, t.reads.length + 2)}>
                {t.cites.map(c => (
                  <li key={c}>{c}</li>
                ))}
              </motion.ul>
            )}

            <motion.p className={s.note} {...rowMotion(reduce, t.reads.length + 3)}>{t.note}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
