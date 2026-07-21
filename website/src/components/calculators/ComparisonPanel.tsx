import styles from './calculators.module.css';

/**
 * Shared "Before / After" workflow comparison, reused across all three
 * calculators. Mirrors the before/after pattern already shipping on
 * /ai-engines/legal-regulatory-engine (LEGAL_REG_GAPS) — same
 * before=alert/after=brand-green convention, ported into the calculators
 * module so there's no cross-module CSS coupling.
 */
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
      <p className={styles.compareTitle}>{title}</p>
      <div className={styles.compareGrid}>
        <div className={styles.compareCol}>
          <p className={styles.compareHead} data-kind="before">Before</p>
          <ol className={styles.compareSteps}>
            {beforeSteps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>
        <div className={styles.compareCol}>
          <p className={styles.compareHead} data-kind="after">After</p>
          <ol className={styles.compareSteps}>
            {afterSteps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>
      </div>
      {outcome && <p className={styles.compareOutcome}>{outcome}</p>}
      {source && <p className={styles.compareSource}>{source}</p>}
    </div>
  );
}
