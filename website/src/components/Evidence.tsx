import Link from 'next/link';
import styles from './Evidence.module.css';
import CountUp from './CountUp';

/**
 * The evidence band — rebuilt 2026-07 from a 10-card wall into ONE composed
 * panel, led by a single giant counting number (the pattern that makes a page
 * read "results", not "claims").
 *
 * Composition, top to bottom inside one hairline-bordered panel:
 *   1. The lead number — our single most concrete delivery figure, counting up
 *      on scroll, attributed and linked.
 *   2. The six delivery stats as a hairline grid (cells, not floating cards),
 *      each attributed to its engagement and linked to that case study.
 *   3. The industry research compressed to one cited strip.
 *
 * SOURCING RULE (unchanged from the previous build): nothing appears here
 * without a traceable source. Rows 1–2 are our own delivery, attributed per
 * engagement. Row 3 names its report. Do not add unattributed aggregates.
 */

const TR_URL =
  'https://www.thomsonreuters.com/en/press-releases/2025/june/the-ai-adoption-reality-check-firms-with-ai-strategies-are-twice-as-likely-to-see-ai-driven-revenue-growth-those-without-risk-falling-behind';

type Delivered = { value: number; suffix: string; label: string; client: string; slug: string };

/* Three, not six — one per flagship vertical, each linked to its case study.
   The other engagements remain on /case-studies; a stat wall stops persuading
   after the third number. Clients are described, never named. */
const DELIVERED: Delivered[] = [
  {
    value: 85,
    suffix: '%',
    label: 'less time per client report — intelligent document processing at 1,200+ reports a year',
    client: 'US property-services firm',
    slug: 'how-reservestudy-automated-report-production-with-ai',
  },
  {
    value: 90,
    suffix: '%',
    label: 'less manual regulatory monitoring, and 5× faster internal response',
    client: 'Corporate law firm',
    slug: 'how-leading-law-firm-automated-regulatory-intelligence',
  },
  {
    value: 84,
    suffix: '%',
    label: 'less client follow-up and document chasing, 3× documents per staff member',
    client: 'CPA firm',
    slug: 'ai-automation-tax-workflow-cpa-case-study',
  },
];

type Research = { value: string; label: string; source: string; href: string };

const RESEARCH: Research[] = [
  {
    value: '5 hrs',
    label: 'a week, per professional, that AI is expected to hand back within a year',
    source: 'Thomson Reuters, Future of Professionals 2025',
    href: TR_URL,
  },
  {
    value: '$19,000',
    label: 'the average annual value of that recovered time, per person',
    source: 'Thomson Reuters, Future of Professionals 2025',
    href: TR_URL,
  },
  {
    value: '22%',
    label: 'of firms have a defined AI strategy — and they are twice as likely to see revenue growth from it',
    source: 'Thomson Reuters, Future of Professionals 2025',
    href: TR_URL,
  },
];

export default function Evidence() {
  return (
    <>
      <div className={styles.head}>
        <p className="eyebrow">The evidence</p>
        <h2 className={styles.heading}>
          Real numbers, <span className="accent-phrase">with the receipts attached.</span>
        </h2>
        <p className={styles.sub}>
          Two kinds of number: <strong className={styles.keyGreen}>green</strong> is our own
          delivery, each figure linked to its engagement; <strong className={styles.keyAmber}>amber</strong>{' '}
          is the industry, measured by named reports. Every claim is checkable.
        </p>
      </div>

      <div className={`panel ${styles.panel}`}>
        {/* 1 — the lead number */}
        <Link
          href="/case-studies/how-reservestudy-automated-report-production-with-ai"
          className={styles.heroStat}
        >
          <span className={`display-num ${styles.heroNum}`}>
            <CountUp value={1200} suffix="+" duration={1.8} />
          </span>
          <span className={styles.heroStatLabel}>
            finished client reports a year, produced automatically from raw site photos and
            documents for a US property-services firm — every one reviewed by a human before it
            ships. <span className={styles.heroStatLink}>Read how →</span>
          </span>
        </Link>

        {/* 2 — delivery grid: hairline cells inside the panel */}
        <div className={styles.grid}>
          {DELIVERED.map((d) => (
            <Link href={`/case-studies/${d.slug}`} className={styles.cell} key={d.slug}>
              <span className={`display-num ${styles.cellNum}`}>
                <CountUp value={d.value} suffix={d.suffix} />
              </span>
              <p className={styles.cellLabel}>{d.label}</p>
              <span className={styles.cellClient}>
                {d.client} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>

        {/* 3 — the category, measured by people other than us */}
        <div className={styles.research}>
          <p className={styles.researchLabel}>What the research says</p>
          <ul className={styles.researchList}>
            {RESEARCH.map((r) => (
              <li key={r.value}>
                <strong>{r.value}</strong>
                <span className={styles.researchText}>{r.label}</span>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={styles.source}>
                  {r.source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
