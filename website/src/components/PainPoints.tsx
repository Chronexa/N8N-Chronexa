import type { ReactNode, CSSProperties } from 'react';
import styles from './PainPoints.module.css';

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

const PAINS = [
  {
    icon: sv(<><path d="M3 7h18M3 12h18M3 17h12" /><path d="m19 15 3 3-3 3" /></>),
    title: 'What got you here won’t get you there.',
    body: 'The workarounds that worked when your team was small start to break under volume. Every spreadsheet, every inbox approval, every manual handoff is a process that cannot grow with you.',
  },
  {
    icon: sv(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 17h7M17.5 14v7" /></>),
    title: 'More tools, more fragmentation.',
    body: 'Adding another app does not add control — it adds another silo. Without a connected data layer, visibility disappears exactly when decisions need to be made.',
  },
  {
    icon: sv(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
    title: 'Activity isn’t the same as output.',
    body: 'Teams can be fully occupied and still underperform on the metrics that matter. Point solutions burn budget without moving revenue, margin, or capacity.',
  },
  {
    icon: sv(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="M12 9v3M12 15h.01" /></>),
    title: 'Speed without structure is its own kind of risk.',
    body: 'Deploying AI without governance, audit trails, or data controls creates exposure — especially where decisions carry legal, financial, or operational consequences.',
  },
];

export default function PainPoints() {
  return (
    <>
      <p className="eyebrow">Why scaling gets harder</p>
      <h2 className={styles.heading}>Why AI &amp; automation is harder to scale than it looks</h2>
      <p className={styles.intro}>
        As organisations grow, processes that once worked start to cost more than they save.
        The problem is rarely the team. It&apos;s the absence of the right system underneath them.
      </p>

      <div className={styles.grid}>
        {PAINS.map((p, i) => (
          <article className={styles.card} key={p.title} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <span className={styles.icon}>{p.icon}</span>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardBody}>{p.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
