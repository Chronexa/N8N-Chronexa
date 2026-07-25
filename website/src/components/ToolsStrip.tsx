import Image from 'next/image';
import styles from './ToolsStrip.module.css';
import { CALCULATORS } from './calculators/registry';
import TrackedLink from './TrackedLink';

/**
 * The second conversion path.
 *
 * Most visitors are not ready to talk to a human on the first visit, and a
 * calendar link is the only thing the page used to offer them. A diagnostic
 * converts traffic a booking button cannot, and it hands the follow-up
 * conversation a real problem statement instead of "saw the website".
 *
 * These three calculators already existed and already email the visitor their
 * breakdown (via the n8n "Calculator Breakdown Emails" workflow) — they were
 * simply unreachable from anywhere except the footer.
 *
 * Styled deliberately quieter than the primary CTA: this is the alternative for
 * people who aren't ready, not a competitor to booking a call.
 */
/* The benchmark number leads each card — pulled from the registry's hook and
   set huge, so the card promises a number before it asks for a click. */
const LEAD_STAT: Record<string, { big: string; rest: string }> = {
  'law-firm-billing-leakage-calculator': {
    big: '26%',
    rest: 'of potential billings never reach an invoice',
  },
  'cpa-tax-season-capacity-calculator': {
    big: '3×',
    rest: 'busy-season capacity at published automation rates',
  },
  'document-processing-cost-calculator': {
    big: '$10–40',
    rest: 'what manual handling costs per document, industry-wide',
  },
};

export default function ToolsStrip() {
  return (
    <>
      <div className={styles.headRow}>
        <div className={styles.head}>
          <p className="eyebrow">Not ready to talk yet?</p>
          <h2 className={styles.heading}>
            Work out the number <span className="accent-phrase">yourself, first.</span>
          </h2>
          <p className={styles.sub}>
            Three calculators built on published industry benchmarks. Put your own figures in and
            you get the breakdown by email — no call required.
          </p>
        </div>
        <Image
          src="/images/3d-growth.webp"
          alt=""
          width={1100}
          height={733}
          sizes="(max-width: 900px) 0px, 360px"
          className={styles.headArt}
          aria-hidden="true"
        />
      </div>

      <div className={styles.grid}>
        {CALCULATORS.map((c, i) => {
          const stat = LEAD_STAT[c.slug];
          return (
            <TrackedLink
              href={`/${c.slug}`}
              className={styles.card}
              key={c.slug}
              reveal={i}
              event="calculator_click"
              props={{ slug: c.slug, source: 'homepage' }}
            >
              {stat && (
                <>
                  <span className={`display-num ${styles.big}`}>{stat.big}</span>
                  <p className={styles.rest}>{stat.rest}</p>
                </>
              )}
              <h3 className={styles.cardTitle}>{c.navLabel}</h3>
              <p className={styles.desc}>{c.description}</p>
              <span className={styles.cta}>
                Run it <span aria-hidden="true">→</span>
              </span>
            </TrackedLink>
          );
        })}
      </div>
    </>
  );
}
