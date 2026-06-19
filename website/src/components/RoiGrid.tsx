import type { CSSProperties } from 'react';
import styles from './RoiGrid.module.css';

const WAYS = [
  {
    label: 'Document Automation',
    stat: '80% faster',
    heading: 'Cut document processing time by 80%+',
    body: 'OCR, extraction, financial modelling, and report generation — what took your team weeks runs in hours. Built for property, legal, finance, and any document-heavy operation.',
  },
  {
    label: 'Sales & Revenue',
    stat: '$12M+ ROI',
    heading: 'Full pipeline from ICP to outreach — zero manual steps',
    body: 'AI discovers your ideal prospects, enriches the data, writes personalised sequences, and updates your CRM. Sales teams close more without hiring more.',
  },
  {
    label: 'Research & Intelligence',
    stat: '10× faster',
    heading: 'Answers in minutes, not days',
    body: 'Legal research, regulatory monitoring, market intelligence — your team gets accurate, sourced answers in minutes. No more hours lost to manual search.',
  },
  {
    label: 'Custom AI Agents',
    stat: '65× output',
    heading: 'AI that runs your workflow end to end',
    body: 'Bespoke agentic systems for the work that doesn\'t fit a package. Built on your data, deployed in your environment, owned by you — not a vendor subscription.',
  },
];

export default function RoiGrid() {
  return (
    <>
      <p className="eyebrow">Proven results</p>
      <h2 className={styles.heading}>
        4 Ways We&apos;ve Delivered Measurable ROI<br />for Businesses Like Yours
      </h2>
      <p className={styles.sub}>
        Real capabilities that have saved clients hundreds of hours and unlocked significant revenue gains.
      </p>
      <div className={styles.grid}>
        {WAYS.map((w, i) => (
          <article className={styles.card} key={w.label} data-reveal style={{ '--reveal-i': i % 2 } as CSSProperties}>
            <div className={styles.cardTop}>
              <p className={styles.cardLabel}>{w.label}</p>
              <span className={styles.cardStat}>{w.stat}</span>
            </div>
            <h3 className={styles.cardHeading}>{w.heading}</h3>
            <p className={styles.cardBody}>{w.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
