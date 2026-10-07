'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../../components/useAutoCycle';
import s from './LegalInteractive.module.css';

/* The governance gate. For each task: where the data goes, which duty is
   engaged, what the system returns, and what a lawyer still has to do.
   The fourth tab is the one that matters most — it returns nothing. */

type Task = {
  id: string;
  tab: string;
  ask: string;
  where: string;
  duty: string;
  dutyNote: string;
  returns: string;
  human: string;
  audit: string;
  blocked?: boolean;
};

const TASKS: Task[] = [
  {
    id: 'retrieve',
    tab: 'Find it in the matter',
    ask: 'Which documents in this matter cap indemnity, and where does each one sit?',
    where: 'Your tenant. Retrieval runs over the document store; nothing leaves the environment your firm controls.',
    duty: 'Model Rule 1.6 — Confidentiality',
    dutyNote: 'Client information stays inside the firm’s own environment, so there is no third-party disclosure to consent to.',
    returns:
      'Eleven documents, each with the clause quoted and a link to the exact page in the document management system. Two disagree with each other, and that disagreement is flagged rather than reconciled.',
    human: 'The lawyer opens the two that conflict. The system has found them; it has not decided which one governs.',
    audit: 'Query, documents returned, permission set applied, timestamp, user.',
  },
  {
    id: 'draft',
    tab: 'Draft the first pass',
    ask: 'Prepare a first-draft memo on the issue in this matter.',
    where: 'An enterprise model instance in your Azure or AWS environment, with prompts and outputs logged and not used for training.',
    duty: 'Rules 1.1 and 3.3 — Competence and candor',
    dutyNote: 'Courts have sanctioned lawyers who filed briefs containing authorities a tool invented. This is the failure mode the design is built around.',
    returns:
      'A structured draft in which every authority is a retrieved citation the system can point at, and anything it could not verify is marked as an open question rather than written smoothly over.',
    human: 'The lawyer verifies the authorities and owns the analysis. The draft is a starting point, and the system is built to make that obvious rather than to sound finished.',
    audit: 'Every source used, every gap flagged, the model version, and who accepted the draft.',
  },
  {
    id: 'monitor',
    tab: 'Watch for changes',
    ask: 'Tell us when anything changes in the rules that affect these fourteen matters.',
    where: 'Public sources only. No client data is involved, which changes the risk profile entirely.',
    duty: 'Rule 1.4 — Communication',
    dutyNote: 'The duty here is about keeping clients informed, not about confidentiality — so the system can be far more autonomous.',
    returns:
      'A change detected in a published rule, mapped to the four matters it actually touches, with the specific paragraph that moved and a plain summary of what it alters.',
    human: 'A lawyer decides whether the client needs telling and what it means for the matter. The system supplies the trigger and the evidence.',
    audit: 'Source, retrieval date, the diff, which matters were matched and why.',
  },
  {
    id: 'blocked',
    tab: 'Someone who should not see it',
    ask: 'An associate not staffed on the matter asks the same question as the first tab.',
    where: 'The same store, the same index — and the same permissions the document management system already enforces.',
    duty: 'Rule 1.6 and the firm’s own ethical walls',
    dutyNote: 'This is where most legal AI projects quietly break: a retrieval index built over everything becomes a way around the permissions the firm spent years configuring.',
    returns: 'Nothing. Not a summary, not a redacted answer, not an acknowledgement that responsive documents exist.',
    human: 'They request access through the process the firm already has. The AI layer is not a route around it.',
    audit: 'The attempt is logged. Refusals are recorded as carefully as answers.',
    blocked: true,
  },
];

export function GovernanceGate() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(TASKS.length);
  const t = TASKS[active];

  return (
    <div className={s.gate} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>THE GOVERNANCE GATE</span>
        <span>{running ? 'PLAYING · PICK A TASK' : 'PICK A TASK'}</span>
      </div>

      <div className={s.picker} role="group" aria-label="Choose a task">
        {TASKS.map((x, i) => (
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
          <p className={s.ask}>&ldquo;{t.ask}&rdquo;</p>

          <div className={s.body} aria-live="polite">
            <div className={s.meta}>
              <motion.div {...rowMotion(reduce, 0)}>
                <p className={s.label}>Where it runs</p>
                <p className={s.metaText}>{t.where}</p>
              </motion.div>
              <motion.div {...rowMotion(reduce, 1)}>
                <p className={s.label}>Duty engaged</p>
                <p className={s.duty}>{t.duty}</p>
                <p className={s.metaText}>{t.dutyNote}</p>
              </motion.div>
            </div>

            <motion.div {...rowMotion(reduce, 2)}>
              <p className={s.label}>What comes back</p>
              <p className={t.blocked ? s.returnsBlocked : s.returns}>{t.returns}</p>
            </motion.div>

            <motion.div {...rowMotion(reduce, 3)}>
              <p className={s.label}>What a lawyer still does</p>
              <p className={s.human}>{t.human}</p>
            </motion.div>

            <motion.p className={s.audit} {...rowMotion(reduce, 4)}>
              <b>ON THE RECORD</b>
              {t.audit}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
