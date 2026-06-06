import type { ReactNode, CSSProperties } from 'react';
import styles from './PainPoints.module.css';
import BookButton from './BookButton';

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

const PAINS = [
  {
    icon: sv(<><path d="M3 7h18M3 12h18M3 17h12" /><path d="m19 15 3 3-3 3" /></>),
    title: 'Manual work hides the real problem',
    body: 'Every spreadsheet, copy-paste, and inbox approval is effort you can’t scale. Layering more tools on top makes future fixes more expensive, not cheaper.',
  },
  {
    icon: sv(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 17h7M17.5 14v7" /></>),
    title: 'More tools, less control',
    body: 'Each new app adds another disconnected silo. Without one clean data layer, visibility drops exactly when you need it most.',
  },
  {
    icon: sv(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
    title: 'Busy isn’t the same as ROI',
    body: 'Point solutions burn budget without moving the numbers. Effort climbs while throughput and margin quietly stall.',
  },
  {
    icon: sv(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="M12 9v3M12 15h.01" /></>),
    title: 'Speed without guardrails is risk',
    body: 'Rushing AI in without controls, data governance, and audit trails exposes you — especially in legal, finance, and regulated work.',
  },
];

export default function PainPoints() {
  return (
    <>
      <p className="eyebrow">Why scaling gets harder</p>
      <h2 className={styles.heading}>Growth shouldn&apos;t mean more chaos</h2>
      <p className={styles.intro}>
        As you grow, the manual workarounds that used to work start to cost you. More tools,
        more handoffs, more risk — and the team runs faster just to stand still.
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

      <p className={styles.closer}>
        These are the exact gaps a{' '}
        <BookButton className={styles.closerLink} location="painpoints">free Chronexa audit</BookButton>{' '}
        finds — and a roadmap to fix.
      </p>
    </>
  );
}
