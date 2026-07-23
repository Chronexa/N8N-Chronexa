'use client';

import styles from './calculators.module.css';

export default function HeroBar({
  label,
  beforeValue,
  beforeLabel,
  afterValue,
  afterLabel,
}: {
  label: string;
  beforeValue: number;
  beforeLabel: string;
  afterValue: number;
  afterLabel: string;
}) {
  const max = Math.max(beforeValue, afterValue);
  const beforePct = max > 0 ? (beforeValue / max) * 100 : 0;
  const afterPct = max > 0 ? (afterValue / max) * 100 : 0;

  return (
    <div className={styles.heroBar}>
      <p className={styles.heroBarLabel}>{label}</p>
      
      <div className={styles.heroBarRow}>
        <span className={styles.heroBarTag}>Before AI</span>
        <div className={styles.heroBarTrack}>
          <span 
            className={styles.heroBarFill} 
            data-kind="before" 
            style={{ width: `${beforePct}%` }}
          />
        </div>
        <span className={styles.heroBarValue}>{beforeLabel}</span>
      </div>

      <div className={styles.heroBarRow}>
        <span className={styles.heroBarTag}>After AI</span>
        <div className={styles.heroBarTrack}>
          <span 
            className={styles.heroBarFill} 
            data-kind="after" 
            style={{ width: `${afterPct}%` }}
          />
        </div>
        <span className={styles.heroBarValue}>{afterLabel}</span>
      </div>
    </div>
  );
}
