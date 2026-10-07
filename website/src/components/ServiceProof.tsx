import Link from 'next/link';
import styles from './ServiceProof.module.css';
import CountUp from './CountUp';
import type { ServiceContent } from '../lib/services-content';

/**
 * The service-page proof block (2026-08-19).
 *
 * Replaces a flat run-on line — "Proof 1,200+ client reports produced a year,
 * from raw site photos and PDFs ReserveStudy.com, in production. Roughly 85%
 * less time per report." — where the number carried no more visual weight than
 * its own footnote. Ankit's note: a big number with no hierarchy and no
 * consequence means nothing to a buyer and fails to show the ROI.
 *
 * So the number now gets three distinct levels, which is the whole fix:
 *   1. the figure itself, counting up, at display scale;
 *   2. the CONSEQUENCE beside it in near-black — what that number bought them;
 *   3. the attribution and case-study link underneath, muted.
 *
 * Composition follows Evidence.tsx on the homepage, which already solved this.
 *
 * SOURCING RULE, inherited verbatim from Evidence.tsx and non-negotiable:
 * nothing appears here without a traceable source. `metric` is our own delivery
 * and must trace to a written-up engagement. `research` is third-party and must
 * name its report and link to it. A page with neither renders the mechanism
 * description alone rather than inventing a number.
 */

const Arrow = (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
);

/** Splits "1,200" or "85" into a number CountUp can animate, keeping "1,200+" intact. */
function parseMetric(value: string): { num: number | null; raw: string } {
  const cleaned = value.replace(/,/g, '');
  const m = cleaned.match(/^(\d+(?:\.\d+)?)/);
  return { num: m ? Number(m[1]) : null, raw: value };
}

export default function ServiceProof({ proof }: { proof: NonNullable<ServiceContent['proofBlock']> }) {
  const { metric, mechanism, caseStudy, research } = proof;
  const parsed = metric ? parseMetric(metric.value) : null;

  return (
    <div className={styles.wrap} data-reveal>
      {metric && parsed && (
        <div className={styles.lead}>
          <p className={styles.leadNum}>
            {parsed.num !== null
              ? <CountUp value={parsed.num} suffix={metric.value.replace(/^[\d,.]+/, '')} duration={1.8} />
              : metric.value}
            {metric.unit && <span className={styles.leadUnit}>{metric.unit}</span>}
          </p>
          <div className={styles.leadText}>
            <p className={styles.leadLabel}>{metric.label}</p>
            {metric.outcome && <p className={styles.leadOutcome}>{metric.outcome}</p>}
            <p className={styles.leadSource}>{metric.source}</p>
          </div>
        </div>
      )}

      {mechanism && (
        <p className={`${styles.mechanism} ${metric ? styles.mechanismUnderLead : ''}`}>{mechanism}</p>
      )}

      {caseStudy && (
        <Link href={`/case-studies/${caseStudy.slug}`} className={styles.link}>
          {caseStudy.label} {Arrow}
        </Link>
      )}

      {research && research.length > 0 && (
        <div className={styles.research}>
          <p className={styles.researchLabel}>
            {metric ? 'And what the wider research says' : 'What the research says'}
          </p>
          <ul className={styles.researchList}>
            {research.map((r) => (
              <li key={r.source + r.value}>
                <strong className={styles.researchNum}>{r.value}</strong>
                <span className={styles.researchText}>{r.label}</span>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={styles.source}>
                  {r.source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
