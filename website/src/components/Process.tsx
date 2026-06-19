import type { CSSProperties } from 'react';
import styles from './Process.module.css';

const STEPS = [
  {
    title: 'Discovery & Scoping',
    body: 'We map your current workflow end to end — inputs, outputs, edge cases, data sources, and integration points. You get a clear written scope document before any build begins.',
  },
  {
    title: 'Scope & Fixed Price',
    body: 'We define deliverables, success metrics, and the project price — no scope surprises. You approve before we write a single line of code.',
  },
  {
    title: 'Build & Test',
    body: 'We build and integrate the full automation, run it against real data, handle edge cases, and iterate until it performs against the agreed metrics — before it ever touches live operations.',
  },
  {
    title: 'Deploy & Measure',
    body: 'We go live with full documentation, team training, and a support plan. We track agreed ROI metrics weekly and share performance reports so you always know what the system is delivering.',
  },
];

export default function Process() {
  return (
    <>
      <p className="eyebrow">How It Works</p>
      <h2 className={styles.heading}>
        Our 4 Steps to<br />
        <span className={styles.highlight}>AI Automation Success</span>
      </h2>

      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <li className={styles.step} key={step.title} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
