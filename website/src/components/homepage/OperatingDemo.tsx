'use client';

import { AnimatePresence, motion } from 'motion/react';
import { panelMotion, rowMotion, useAutoCycle } from '../useAutoCycle';
import s from './OperatingDemo.module.css';

/**
 * "How we run Chronexa" — the homepage's one demo.
 *
 * Four jobs our own agents do every week, as they actually run: each one does the
 * work, stops itself at least once where a mistake would cost money or trust,
 * and ends at a named person's approval. The stop is the point — it is the
 * judgment argument, shown instead of claimed.
 *
 * Motion contract (useAutoCycle): advances every 9s, pauses on hover/focus and
 * off-screen, stops for good once the visitor picks a tab, static under
 * prefers-reduced-motion.
 */

type Step = { text: string; kind: 'done' | 'stop' };
type Job = {
  id: string;
  tab: string;
  agent: string;
  tools: [string, string][];
  steps: Step[];
  approval: string;
  action: string;
};

const JOBS: Job[] = [
  {
    id: 'article',
    tab: 'Publish an article',
    agent: 'Content agent',
    tools: [['google.png', 'Search Console'], ['claude.svg', 'Claude'], ['openai.svg', 'Image model']],
    steps: [
      { kind: 'done', text: 'Picked the topic from search data: 1,000 searches a month, low competition' },
      { kind: 'done', text: 'Read the top 10 Google results and 14 sources' },
      { kind: 'done', text: 'Drafted the article in our house style' },
      { kind: 'stop', text: 'Removed one statistic it couldn’t source' },
      { kind: 'done', text: 'Generated the cover image and the meta description' },
    ],
    approval: 'Ready to publish to the blog',
    action: 'Publish',
  },
  {
    id: 'workflow',
    tab: 'Build a workflow',
    agent: 'Automation agent',
    tools: [['n8n.svg', 'n8n'], ['claude.svg', 'Claude'], ['slack.svg', 'Slack']],
    steps: [
      { kind: 'done', text: 'Read the brief: route new support tickets by urgency' },
      { kind: 'done', text: 'Checked every node setting against the n8n docs' },
      { kind: 'done', text: 'Built 14 steps with retries and error alerts' },
      { kind: 'stop', text: 'Kept refunds over $500 with a person, not the agent' },
      { kind: 'done', text: 'Ran 20 test tickets, all routed correctly' },
    ],
    approval: 'Ready to switch on in production',
    action: 'Switch on',
  },
  {
    id: 'ads',
    tab: 'Report on ad spend',
    agent: 'Reporting agent',
    tools: [['googlesheets.svg', 'Leads sheet'], ['whatsapp.svg', 'WhatsApp'], ['claude.svg', 'Claude']],
    steps: [
      { kind: 'done', text: 'Pulled yesterday’s spend, clicks and leads from Meta Ads' },
      { kind: 'done', text: 'Matched 7 new leads against the CRM' },
      { kind: 'done', text: 'Found cost per lead up 38% on one ad set' },
      { kind: 'stop', text: 'Didn’t pause it. Budget changes need a person' },
      { kind: 'done', text: 'Sent the summary to the team on WhatsApp' },
    ],
    approval: 'Pause ad set B and move its budget?',
    action: 'Approve',
  },
  {
    id: 'call',
    tab: 'Prepare a sales call',
    agent: 'Research agent',
    tools: [['gmail.svg', 'Gmail'], ['linkedin.png', 'LinkedIn'], ['claude.svg', 'Claude']],
    steps: [
      { kind: 'done', text: 'New booking: Head of Operations, 140-person logistics firm' },
      { kind: 'done', text: 'Read their site, recent news and open job posts' },
      { kind: 'done', text: 'Found 6 open roles doing manual data entry' },
      { kind: 'stop', text: 'Left out a guess about their revenue it couldn’t verify' },
      { kind: 'done', text: 'Wrote three questions and the likely bottleneck' },
    ],
    approval: 'Brief ready for tomorrow’s call',
    action: 'Send to my inbox',
  },
];

function Check() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Stop() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 8h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;
}

export default function OperatingDemo() {
  const { ref, active, pick, running, reduce, intervalMs, holdProps } = useAutoCycle(JOBS.length, 9000);
  const job = JOBS[active];

  return (
    <div ref={ref} className={s.window} {...holdProps}>
      <div className={s.bar} aria-hidden="true"><i /><i /><i /><span>chronexa · operations workspace</span></div>
      <div className={s.body}>
        <div className={s.tabs} role="tablist" aria-label="Jobs our agents run">
          {JOBS.map((j, i) => (
            <button key={j.id} type="button" role="tab" aria-selected={i === active} className={s.tab} onClick={() => pick(i)}>
              <span>{j.tab}</span>
              <small>{j.agent}</small>
              {i === active && running && (
                <i className={s.fill} style={{ animationDuration: `${intervalMs}ms` }} key={`fill-${active}`} />
              )}
            </button>
          ))}
        </div>

        <div className={s.panel} role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={job.id} {...panelMotion(reduce)}>
              <div className={s.head}>
                <p className={s.agent}><span className={s.dot} />{job.agent} · running</p>
                <ul className={s.tools}>
                  {job.tools.map(([logo, name]) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <li key={name}><img src={`/logos/${logo}`} alt="" width={16} height={16} />{name}</li>
                  ))}
                </ul>
              </div>
              <ol className={s.steps}>
                {job.steps.map((st, i) => (
                  <motion.li key={st.text} className={st.kind === 'stop' ? s.stop : s.done} {...rowMotion(reduce, i)}>
                    <span className={s.icon}>{st.kind === 'stop' ? <Stop /> : <Check />}</span>
                    <span>{st.text}</span>
                    {st.kind === 'stop' && <em>Stopped</em>}
                  </motion.li>
                ))}
              </ol>
              <motion.div className={s.approval} {...rowMotion(reduce, job.steps.length + 1)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/team-ankit.png" alt="" width={36} height={36} />
                <div><small>Waiting for Ankit</small><p>{job.approval}</p></div>
                <span className={s.approve}>{job.action}</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
