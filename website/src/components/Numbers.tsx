import styles from './Numbers.module.css';

const GROUPS = [
  {
    label: 'Experience',
    big: '5+',
    bigLabel: 'Industries served',
    details: ['10+ countries reached', 'Document, legal, sales, marketing & e-commerce'],
  },
  {
    label: 'Client Success',
    big: '100+',
    bigLabel: 'Automations deployed',
    details: ['90% client satisfaction rate', '30–45 days average launch time'],
  },
  {
    label: 'Impact',
    big: '$12M+',
    bigLabel: 'ROI generated',
    details: ['80% client return rate', '65× average output increase'],
  },
];

export default function Numbers() {
  return (
    <section className={styles.numbersSection} aria-labelledby="numbers-title">
      <div className={`container ${styles.numbersInner}`}>
        <div>
          <p className="eyebrow">By the numbers</p>
          <h2 id="numbers-title" className={styles.numbersTitle}>
            Numbers don&apos;t lie and ours say you&apos;re in good hands.
          </h2>
        </div>
        <div className={styles.numbersBox}>
          {GROUPS.map((g) => (
            <div className={styles.group} key={g.label}>
              <span className={styles.groupLabel}>{g.label}</span>
              <div className={styles.numBig}>{g.big}</div>
              <div className={styles.numLabel}>{g.bigLabel}</div>
              <ul className={styles.details}>
                {g.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
