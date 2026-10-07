import styles from './Numbers.module.css';

const STATS = [
  {
    big: '$12M+',
    label: 'Revenue unlocked for clients',
    detail: 'Across sales, ops, and document workflows',
  },
  {
    big: '80%',
    label: 'Reduction in manual processing time',
    detail: 'Average across document-heavy engagements',
  },
  {
    big: '65×',
    label: 'Output per operator',
    detail: 'What one person produces with AI vs without',
  },
  {
    big: '1 wk',
    label: 'To your first workflow live',
    detail: 'Free audit first, then a quote sized on ROI',
  },
];

export default function Numbers() {
  return (
    <section className={styles.numbersSection} aria-labelledby="numbers-title">
      <div className="container">
        <div className={styles.header}>
          <p className="eyebrow">By the numbers</p>
          <h2 id="numbers-title" className={styles.numbersTitle}>
            Numbers don&apos;t lie and ours say you&apos;re in good hands.
          </h2>
        </div>
        <div className={styles.numbersBox}>
          {STATS.map((s) => (
            <div className={styles.group} key={s.big}>
              <div className={styles.numBig}>{s.big}</div>
              <div className={styles.numLabel}>{s.label}</div>
              <p className={styles.numDetail}>{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
