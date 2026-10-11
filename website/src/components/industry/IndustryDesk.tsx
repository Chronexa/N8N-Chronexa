'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAutoCycle, panelMotion, rowMotion } from '../useAutoCycle';
import { track } from '../../lib/analytics';
import s from '../../app/crm-automation-services/CrmInteractive.module.css';

/**
 * Industry "desk": the same proven interaction as the CRM command centre (an item arrives already
 * assembled, a person makes one decision, the write-back happens everywhere) with each industry's
 * own items. Plays itself until the visitor picks a tab; analytics only for real clicks.
 */
export type DeskItem = {
  id: string;
  tab: string;
  channel: string;
  title: string;
  facts: { src: string; text: string }[];
  actions: [string, string, string];
  result: string[];
  note: string;
};

export default function IndustryDesk({ slug, label, items }: { slug: string; label: string; items: DeskItem[] }) {
  const { ref, active: i, pick: cycle, running, reduce, intervalMs, holdProps } = useAutoCycle(items.length);
  const a = items[i];
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const done = doneFor === a.id;

  useEffect(() => {
    if (!running) return;
    const id = items[i].id;
    const t = setTimeout(() => setDoneFor(id), 2600);
    return () => clearTimeout(t);
  }, [i, running, items]);

  const pick = (n: number) => { cycle(n); track('industry_desk_change', { slug, item: items[n].id }); };
  const act = () => { setDoneFor(a.id); track('industry_desk_action', { slug, item: a.id }); };

  return (
    <div className={s.centre} ref={ref} {...holdProps}>
      <div className={s.bar}>
        <span>{label}</span>
        <span>{running ? 'Playing · try an action' : 'Pick an item · try an action'}</span>
      </div>
      <div className={s.picker} role="group" aria-label="Choose an example">
        {items.map((x, n) => (
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
            <div className={s.from}><span aria-hidden="true">◆</span> Chronexa<i>AGENT</i><time>9:02</time></div>
            <p className={s.subject}>{a.title}</p>
            <dl className={s.facts}>
              {a.facts.map((f, n) => (
                <motion.div key={f.src + n} {...rowMotion(reduce, n)}><dt>{f.src}</dt><dd>{f.text}</dd></motion.div>
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
