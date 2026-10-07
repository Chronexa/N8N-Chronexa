'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './SalesInteractive.module.css';

/* Same prospect, two emails. The left-hand version is what generic AI
   personalisation produces; the right is what the pipeline produces once a
   real signal and real research are in front of it. Companies are invented
   for the demo — the mechanism is the point, not the names. */

type Case = {
  id: string;
  tab: string;
  company: string;
  who: string;
  signal: string;
  signalSrc: string;
  found: string[];
  generic: string;
  ours: string;
  gate: string;
};

const CASES: Case[] = [
  {
    id: 'hiring',
    tab: 'A hiring signal',
    company: 'Kestrel Freight',
    who: 'VP Operations · 240 staff · 3PL',
    signal: 'Third ops coordinator role posted in 60 days',
    signalSrc: 'Careers page + job boards',
    found: [
      'All three postings list "manual data entry between TMS and customer portals"',
      'They run MercuryGate; two named customer portals are mentioned by name',
      'Head of Ops posted about "hiring our way out of admin" seven weeks ago',
    ],
    generic:
      'Hi — I noticed Kestrel Freight is growing fast in the logistics space! Companies like yours are leveraging AI to streamline operations and unlock productivity. Would you be open to a quick 15-minute chat this week to explore how we could help you scale?',
    ours:
      'You have posted the same ops coordinator role three times since July, and all three list keying data between MercuryGate and customer portals. That is usually a sign the portals have no API worth using and someone is retyping. We have built the middle layer for that before. Worth fifteen minutes, or should I send you how it was structured instead?',
    gate: 'Sent. Signal verified, claim checked against the postings, no numbers asserted.',
  },
  {
    id: 'funding',
    tab: 'A funding signal',
    company: 'Alto Health',
    who: 'COO · Series A, 8 weeks ago',
    signal: 'Raised $14m; hiring a first RevOps lead',
    signalSrc: 'Funding announcement + LinkedIn',
    found: [
      'Job spec asks for "cleaning up our Salesforce" as the first 90-day goal',
      'Two ops tools appear in their engineering blog: Salesforce and a homegrown intake app',
      'CEO has written twice about not wanting to add headcount to fix process',
    ],
    generic:
      'Congratulations on your recent funding round! With new capital, now is the perfect time to invest in AI automation. We help fast-growing companies like Alto Health improve efficiency and eliminate repetitive work. Do you have 15 minutes on Thursday?',
    ours:
      'Your RevOps posting puts "clean up Salesforce" in the first ninety days, which usually means the intake app and Salesforce disagree about who owns which field. That is a data-model problem before it is a hiring problem, and it does not go away when the RevOps lead starts. Happy to send how we would sequence it — no call needed unless it is useful.',
    gate: 'Sent. Funding congratulation removed at drafting: everyone sends that one.',
  },
  {
    id: 'held',
    tab: 'One that got stopped',
    company: 'Brant & Wills',
    who: 'Managing Partner · 40-person firm',
    signal: 'Posted about document review workload',
    signalSrc: 'LinkedIn post, 11 days old',
    found: [
      'The post is about a specific case, not an operational complaint',
      'No hiring, no tooling change, no other signal in 90 days',
      'The firm is in a jurisdiction we have no delivery reference for',
    ],
    generic:
      'Saw your post about document review — this is exactly the kind of manual work AI can eliminate. Our clients typically see 70% time savings on document-heavy processes. Can I show you a quick demo?',
    ours: 'No email sent.',
    gate:
      'Held by the review queue. One post about one case is not a buying signal, and the draft would have claimed a saving we cannot evidence. Removed from the sequence rather than sent weaker.',
  },
];

export function OutreachBench() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(CASES.length);
  const c = CASES[active];
  const held = c.id === 'held';

  return (
    <div className={s.bench} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>SAME PROSPECT · TWO ENGINES</span>
        <span>{running ? 'PLAYING · PICK ANY' : 'ILLUSTRATIVE'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose an example">
        {CASES.map((x, i) => (
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
        <motion.div key={c.id} {...panelMotion(reduce)}>
          <div className={s.prospect}>
            <div>
              <b>{c.company}</b>
              <span>{c.who}</span>
            </div>
            <motion.p className={s.signal} {...rowMotion(reduce, 0)}>
              <i />
              {c.signal}
              <em>{c.signalSrc}</em>
            </motion.p>
          </div>

          <div className={s.found} aria-live="polite">
            <p className={s.label}>What the research step actually found</p>
            <ul>
              {c.found.map((f, i) => (
                <motion.li key={f} {...rowMotion(reduce, i + 1)}>{f}</motion.li>
              ))}
            </ul>
          </div>

          <div className={s.compare}>
            <motion.div className={s.col} {...rowMotion(reduce, c.found.length + 1)}>
              <p className={s.colHead}>Generic AI personalisation</p>
              <p className={s.mailBad}>{c.generic}</p>
            </motion.div>
            <motion.div className={s.col} {...rowMotion(reduce, c.found.length + 2)}>
              <p className={s.colHead}>{held ? 'What the engine did' : 'Written from the research'}</p>
              <p className={held ? s.mailHeld : s.mailGood}>{c.ours}</p>
            </motion.div>
          </div>

          <motion.p className={`${s.gate} ${held ? s.gateHeld : ''}`} {...rowMotion(reduce, c.found.length + 3)}>
            <b>{held ? 'HELD' : 'REVIEW GATE'}</b>
            {c.gate}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
