import type { CSSProperties } from 'react';
import styles from './ResultsStats.module.css';

const STATS = [
  { num: '85%', desc: 'Reduction in time spent per report' },
  { num: '1200+', desc: 'Reports processed annually' },
  { num: '5x', desc: 'Increase in personalized daily outreach per SDR' },
  { num: '78%', desc: 'Reduction in manual research & drafting time' },
  { num: '90%', desc: 'Reduction in manual monitoring time' },
  { num: null, desc: 'Faster internal response to regulatory changes' },
];

export default function ResultsStats() {
  return (
    <>
      <p className="eyebrow">Real Results From Real Automations</p>

      <div className={styles.statsGrid}>
        {STATS.map((stat, i) => (
          <div key={stat.desc} className={styles.statCard} data-reveal style={{ '--reveal-i': i % 3 } as CSSProperties}>
            {stat.num ? (
              <div className={styles.statNum}>{stat.num}</div>
            ) : (
              <div className={styles.statMark} aria-hidden="true">↑</div>
            )}
            <div className={styles.statDesc}>{stat.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
