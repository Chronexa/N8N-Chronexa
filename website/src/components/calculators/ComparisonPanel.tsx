'use client';

import styles from './calculators.module.css';

export default function ComparisonPanel({
  title,
  beforeSteps,
  afterSteps,
  outcome,
  source,
}: {
  title: string;
  beforeSteps: string[];
  afterSteps: string[];
  outcome?: string;
  source?: string;
}) {
  return (
    <div className={styles.compareWrap}>
      <h3 className={styles.compareTitle}>{title}</h3>
      <div className={styles.compareGrid}>
        <div className={styles.compareCol}>
          <p className={styles.compareHead} data-kind="before">Before Automation</p>
          <ol className={styles.compareSteps}>
            {beforeSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
        <div className={styles.compareCol}>
          <p className={styles.compareHead} data-kind="after">With Automation</p>
          <ol className={styles.compareSteps}>
            {afterSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      {outcome && <p className={styles.compareOutcome}>{outcome}</p>}
      {source && <p className={styles.compareSource}>{source}</p>}
    </div>
  );
}
