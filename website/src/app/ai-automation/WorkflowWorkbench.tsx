'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './WorkflowWorkbench.module.css';

/* The workflow bench. Four real workflow shapes, each broken into the same
   four moves — understand, rule, human boundary, outcome — so the pattern
   reads as a repeatable architecture rather than four different demos. */

const WORKFLOWS = [
  { id: 'intake', tab: 'Document intake', input: 'Email + attachments', understand: 'Classify and extract', rule: 'Validate required fields', human: 'Review conflicts', output: 'Create the case record' },
  { id: 'lead', tab: 'Lead handoff', input: 'New qualified lead', understand: 'Research the account', rule: 'Check territory and fit', human: 'Approve the message', output: 'Update CRM + prepare outreach' },
  { id: 'recon', tab: 'Reconciliation', input: 'Orders + payments', understand: 'Explain likely mismatches', rule: 'Match exact and tolerance', human: 'Resolve exceptions', output: 'Post status + daily report' },
  { id: 'support', tab: 'Support queue', input: 'New customer request', understand: 'Intent + relevant context', rule: 'Policy and entitlement', human: 'Handle uncertain cases', output: 'Draft reply + route ticket' },
] as const;

export default function WorkflowWorkbench() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(WORKFLOWS.length, 8000);
  const item = WORKFLOWS[active];

  return (
    <div className={s.workbench} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>WORKFLOW BENCH</span>
        <span>{running ? 'PLAYING · PICK ONE' : 'PICK A WORKFLOW'}</span>
      </div>

      <div className={s.tabs} role="group" aria-label="Example AI workflows">
        {WORKFLOWS.map((flow, i) => (
          <button key={flow.id} type="button" aria-pressed={i === active} onClick={() => pick(i)}>
            {flow.tab}
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
        <motion.div key={item.id} {...panelMotion(reduce)}>
          <div className={s.panel}>
            <motion.div className={s.incoming} {...rowMotion(reduce, 0)}>
              <small>TRIGGER</small>
              <strong>{item.input}</strong>
            </motion.div>
            <ol>
              <motion.li {...rowMotion(reduce, 1)}><span>AI</span><p><small>UNDERSTAND</small>{item.understand}</p></motion.li>
              <motion.li {...rowMotion(reduce, 2)}><span>IF</span><p><small>EXACT RULE</small>{item.rule}</p></motion.li>
              <motion.li {...rowMotion(reduce, 3)}><span>H</span><p><small>HUMAN BOUNDARY</small>{item.human}</p></motion.li>
            </ol>
            <motion.div className={s.result} {...rowMotion(reduce, 4)}>
              <span>✓</span>
              <p><small>VISIBLE OUTCOME</small><strong>{item.output}</strong></p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className={s.note}>Illustrative architecture · the real workflow is designed around your rules and systems.</p>
    </div>
  );
}
