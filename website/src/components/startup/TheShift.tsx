'use client';

import layouts from './startup-layouts.module.css';
import styles from './TheShift.module.css';

const comparisons = [
  {
    outcome: 'Hiring Plan',
    traditional: { lead: 'Every function that hits capacity gets a new hire.', rest: 'Payroll grows in lockstep with demand.' },
    aiFirst: { lead: 'Every function that hits capacity gets a system first.', rest: 'New hires are reserved for judgment and relationship work only.' },
  },
  {
    outcome: 'Execution Speed',
    traditional: { lead: 'New initiatives take weeks to ramp.', rest: 'They depend on people learning new domains.' },
    aiFirst: { lead: 'Repeatable execution launches in days.', rest: 'The system absorbs the first 70% and a human steers the last 30%.' },
  },
  {
    outcome: 'Runway Efficiency',
    traditional: { lead: 'Fixed monthly burn rises with every new role.', rest: 'One bad quarter threatens the next raise.' },
    aiFirst: { lead: 'Marginal cost per additional lead approaches zero.', rest: 'Runway extends on the same raise.' },
  },
  {
    outcome: 'Decision Speed',
    traditional: { lead: 'Founders wait until Friday for manually compiled reports.', rest: 'Decisions are made on stale data.' },
    aiFirst: { lead: 'Leadership gets same-day automated intelligence.', rest: 'Decisions are made on live data, not last week\'s spreadsheet.' },
  },
  {
    outcome: 'Customer Experience at Scale',
    traditional: { lead: 'Quality degrades as volume grows.', rest: 'Support tickets pile up. Response times stretch.' },
    aiFirst: { lead: 'Quality holds at scale.', rest: 'AI triage handles the repeatable share; humans handle the cases that need a human.' },
  },
];

export default function TheShift() {
  return (
    <section className="section-muted reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Shift</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '24ch' }}>Two ways to scale. One of them works.</h2>
        <p className={layouts.sectionLede}>
          Traditional startups scale by adding headcount to every function that hits capacity. AI-first startups scale by building a system once that absorbs the repeatable share of that function&apos;s work.
        </p>

        {/* Desktop: real 3-column table */}
        <div className={`panel ${styles.compareTable}`}>
          <div className={styles.tableHead}>
            <div className={styles.tableHeadCell}>Outcome</div>
            <div className={styles.tableHeadCell} data-tone="headcount">Scales Headcount</div>
            <div className={styles.tableHeadCell} data-tone="systems">Scales Systems</div>
          </div>
          {comparisons.map((row) => (
            <div className={styles.tableRow} key={row.outcome}>
              <div className={styles.outcomeCell}>{row.outcome}</div>
              <div className={styles.cellTraditional}><strong>{row.traditional.lead}</strong> {row.traditional.rest}</div>
              <div className={styles.cellSystems}><strong>{row.aiFirst.lead}</strong> {row.aiFirst.rest}</div>
            </div>
          ))}
        </div>

        {/* Mobile/tablet: stacked cards, one outcome per block */}
        <div className={styles.compareCards}>
          {comparisons.map((row) => (
            <div className={styles.compareCard} key={row.outcome}>
              <div className={styles.cardOutcome}>{row.outcome}</div>
              <div className={styles.cardCell} data-tone="headcount">
                <span className={styles.cardKicker}>Scales Headcount</span>
                <strong>{row.traditional.lead}</strong> {row.traditional.rest}
              </div>
              <div className={styles.cardCell} data-tone="systems">
                <span className={styles.cardKicker}>Scales Systems</span>
                <strong>{row.aiFirst.lead}</strong> {row.aiFirst.rest}
              </div>
            </div>
          ))}
        </div>

        <p className={layouts.pullQuote}>
          Crossing the Leverage Line is the moment output growth decouples from headcount growth. That decoupling is engineered, not lucky.
        </p>
      </div>
    </section>
  );
}
