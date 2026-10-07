'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './WorkspaceConsole.module.css';

/* The workspace console. Four real prompts a team actually runs, each showing
   what got read, what got drafted, and the one thing that still stops for a
   person — because "one prompt does everything" is the fear this page has to
   answer, not the promise it makes. */

const RUNS = [
  {
    id: 'landing',
    tab: 'Marketing',
    prompt: '“Build a landing page for the autumn promotion and prep the Meta campaign.”',
    read: [{ n: '1', t: 'Brand and product context' }, { n: '2', t: 'Last quarter’s campaign performance' }],
    draft: [{ n: '1', t: 'Landing page, on the existing design system' }, { n: '2', t: 'Campaign structure and ad copy' }],
    gate: 'Ad spend commitment',
    gateNote: 'Page and campaign are drafted end to end. Nothing publishes and no budget moves until a named person approves it.',
  },
  {
    id: 'account',
    tab: 'Sales',
    prompt: '“Prep me for the call with Meridian Group this afternoon.”',
    read: [{ n: '1', t: 'CRM record, last three threads' }, { n: '2', t: 'Open tickets and invoice status' }],
    draft: [{ n: '1', t: 'One-page brief with what changed since last call' }, { n: '2', t: 'Three likely questions, answered' }],
    gate: 'Nothing to approve',
    gateNote: 'Read-only. The brief is the output; no system is written to, so there is no gate to clear.',
  },
  {
    id: 'report',
    tab: 'Operations',
    prompt: '“Pull this week’s exceptions across the order and payment systems.”',
    read: [{ n: '1', t: 'Order system, payment system, both read-only' }, { n: '2', t: 'Last week’s resolved exceptions, for pattern' }],
    draft: [{ n: '1', t: 'A prioritised queue, one owner per item' }, { n: '2', t: 'A short note on what changed week over week' }],
    gate: 'Nothing to approve',
    gateNote: 'Assembly work, not action. It shortens the two hours someone spends building this by hand.',
  },
  {
    id: 'feature',
    tab: 'Engineering',
    prompt: '“Add CSV export to the reporting page and open a PR.”',
    read: [{ n: '1', t: 'The existing reporting component and its tests' }, { n: '2', t: 'The team’s coding and PR conventions' }],
    draft: [{ n: '1', t: 'The feature, with tests, on a branch' }, { n: '2', t: 'A PR description a reviewer can act on' }],
    gate: 'Merge and deploy',
    gateNote: 'Code is written and tested. A person reviews the diff and decides whether it ships — the same as any other PR.',
  },
] as const;

export default function WorkspaceConsole() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(RUNS.length, 8000);
  const r = RUNS[active];

  return (
    <div className={s.console} ref={ref} {...holdProps}>
      <div className={s.top}>
        <span>WORKSPACE CONSOLE</span>
        <span>{running ? 'PLAYING · PICK ONE' : 'ILLUSTRATIVE · PICK A ROLE'}</span>
      </div>

      <div className={s.tabs} role="group" aria-label="Example workspace runs">
        {RUNS.map((run, i) => (
          <button key={run.id} type="button" aria-pressed={i === active} onClick={() => pick(i)}>
            {run.tab}
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
        <motion.div key={r.id} {...panelMotion(reduce)}>
          <div className={s.panel}>
            <motion.div className={s.prompt} {...rowMotion(reduce, 0)}>
              <span aria-hidden="true">&gt;</span>
              <p>{r.prompt}</p>
            </motion.div>

            <div className={s.grid}>
              <motion.section {...rowMotion(reduce, 1)}>
                <small>READ</small>
                {r.read.map(x => <p key={x.n}><b>{x.n}</b>{x.t}</p>)}
              </motion.section>
              <motion.section {...rowMotion(reduce, 2)}>
                <small>DRAFTED</small>
                {r.draft.map(x => <p key={x.n}><b>{x.n}</b>{x.t}</p>)}
              </motion.section>
            </div>

            <motion.div className={s.gate} {...rowMotion(reduce, 3)}>
              <span>APPROVAL</span>
              <strong>{r.gate}</strong>
              <button type="button" tabIndex={-1} aria-hidden="true">Review</button>
            </motion.div>
            <motion.p className={s.gateNote} {...rowMotion(reduce, 4)}>{r.gateNote}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className={s.note}>Illustrative examples · access, tools and approval boundaries are configured per role.</p>
    </div>
  );
}
