import styles from './calculators.module.css';

/**
 * One real, absolute before/after number per calculator, shown as two
 * proportional track+fill bars — the track+fill technique already used in
 * LegalScene/InvestScene (.billMeterFill/.sgBarFill), just no charting
 * library. `beforeValue`/`afterValue` must be in the same unit (bar width is
 * proportional to them); `beforeLabel`/`afterLabel` are the display strings.
 */
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
  const max = Math.max(beforeValue, afterValue, 0.0001);
  const beforePct = Math.min(100, Math.max(2, (beforeValue / max) * 100));
  const afterPct = Math.min(100, Math.max(2, (afterValue / max) * 100));

  return (
    <div className={styles.heroBar}>
      <p className={styles.heroBarLabel}>{label}</p>
      <div className={styles.heroBarRow}>
        <span className={styles.heroBarTag}>Today</span>
        <div className={styles.heroBarTrack}>
          <span className={styles.heroBarFill} data-kind="before" style={{ width: `${beforePct}%` }} />
        </div>
        <span className={styles.heroBarValue}>{beforeLabel}</span>
      </div>
      <div className={styles.heroBarRow}>
        <span className={styles.heroBarTag}>With the engine</span>
        <div className={styles.heroBarTrack}>
          <span className={styles.heroBarFill} data-kind="after" style={{ width: `${afterPct}%` }} />
        </div>
        <span className={styles.heroBarValue}>{afterLabel}</span>
      </div>
    </div>
  );
}
