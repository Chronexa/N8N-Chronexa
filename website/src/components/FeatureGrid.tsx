import type { CSSProperties } from 'react';
import styles from './FeatureGrid.module.css';

const FEATURES = [
  {
    title: 'Clear Scope, Clear Timeline',
    body: 'Start with one workflow. We define inputs, outputs, edge cases, and success metrics — then ship in planned phases. No ambiguity, no surprises.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'ROI Targets Agreed Upfront',
    body: 'We set measurable outcomes before building: time saved, cycle time, error rate, throughput. Progress is tracked against those targets after go-live.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    ),
  },
  {
    title: 'Built, Tested, Then Handed Over',
    body: 'Discovery → build → testing → rollout. You get documentation, team training, and a support plan. Not a handoff and disappear.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  return (
    <>
      <h2 className={styles.subHeroText}>
        Custom AI Automation, Built<br />For Your Exact Workflows
      </h2>
      <p className={styles.subHeroDesc}>
        Chronexa designs, builds, and maintains reliable automations across your tools, so
        work moves faster with fewer handoffs, less manual effort, and fewer errors.
      </p>

      <div className={styles.featureGrid}>
        {FEATURES.map((feature, i) => (
          <div className={styles.feature} key={feature.title} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
