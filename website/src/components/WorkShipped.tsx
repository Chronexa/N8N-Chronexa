import Link from 'next/link';
import type { CSSProperties } from 'react';
import styles from './WorkShipped.module.css';

const WORK = [
  {
    label: 'DOCUMENT AUTOMATION · PROPERTY',
    metric: '3 weeks → 4 hours',
    title: 'How ReserveStudy.com cut report creation time from days to minutes',
    body: "Thousands of site images processed, OCR'd, and financially modelled. 50+ page reserve study generated automatically.",
  },
  {
    label: 'END-TO-END PIPELINE · SALES',
    metric: 'Zero manual steps',
    title: 'Scaling a personalised outbound pipeline without increasing sales headcount',
    body: 'ICP discovery, enrichment, personalised email sequences, CRM updates — runs continuously, flags replies for humans.',
  },
  {
    label: 'AI RESEARCH AGENT · LEGAL',
    metric: 'Days → minutes',
    title: 'How a leading corporate law firm automated regulatory intelligence with AI',
    body: 'Regulatory tracking, case research, HITL review, client communications — automated end to end.',
  },
];

export default function WorkShipped() {
  return (
    <>
      <div className={styles.head}>
        <div>
          <p className="eyebrow">Real Results</p>
          <h2 className={styles.heading}>Client Success<br />Stories.</h2>
        </div>
        <Link href="/case-studies" className={`link-arrow ${styles.headLink}`}>
          Check Portfolio <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.workGrid}>
        {WORK.map((item, i) => (
          <Link href="/case-studies" className={styles.workCard} key={item.title} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
            <div className={styles.workCardTop}>
              <p className={styles.workLabel}>{item.label}</p>
              <div className={styles.workMetric}>{item.metric}</div>
              <h3>{item.title}</h3>
              <p className={styles.workBody}>{item.body}</p>
            </div>
            <div className={styles.workCardBottom}>
              <span>Read Case Study</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>

      <p className={styles.footnote}>Every system is custom. None of this is off-the-shelf.</p>
    </>
  );
}
