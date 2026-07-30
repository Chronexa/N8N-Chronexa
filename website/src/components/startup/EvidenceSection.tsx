'use client';

import CountUp from '../CountUp';
import layouts from './startup-layouts.module.css';
import styles from './EvidenceSection.module.css';

/* Real, company-level Chronexa figures — the same three the homepage carries.
   They were briefly in the hero, which the redesign spec bans stats from
   (§7 Section 1); this is where they belong, next to the sourced research and
   the honest note about what we don't yet have for this vertical. */
const DELIVERY = [
  { value: 6, suffix: '', label: 'engines built & running' },
  { value: 40, suffix: '+', label: 'tools orchestrated across client builds' },
  { value: 1200, suffix: '+', label: 'client reports produced automatically a year' },
];

export default function EvidenceSection() {
  return (
    <section className="section-light reveal-ready">
      <div className={`container ${styles.wrap}`} data-reveal>
        <p className="eyebrow">The Evidence</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '24ch' }}>Proof, honestly</h2>

        {/* What we've actually shipped, company-wide */}
        <div className={styles.delivery}>
          {DELIVERY.map((d) => (
            <div className={styles.deliveryStat} key={d.label}>
              <span className={`display-num ${styles.deliveryNum}`}>
                <CountUp value={d.value} suffix={d.suffix} />
              </span>
              <span className={styles.deliveryLabel}>{d.label}</span>
            </div>
          ))}
        </div>

        {/* Sourced Industry Benchmarks */}
        <div className={styles.benchmarks}>
          <div className={styles.benchmarkCard}>
            <div className={styles.benchmarkTop}>
              <span className={styles.benchmarkSource}>McKinsey Global Institute</span>
              <span className={styles.benchmarkTag}>Industry research, not Chronexa data</span>
            </div>
            <p className={styles.benchmarkBody}>
              60–70% of employee work hours in routine operational roles are automatable with current AI and workflow technology (The Economic Potential of Generative AI, 2023). This is the structural basis for the Headcount Tax calculation in the diagnostic above.
            </p>
          </div>

          <div className={styles.benchmarkCard}>
            <div className={styles.benchmarkTop}>
              <span className={styles.benchmarkSource}>Zapier, State of Business Automation</span>
              <span className={styles.benchmarkTag}>Industry research, not Chronexa data</span>
            </div>
            <p className={styles.benchmarkBody}>
              94% of knowledge workers say they perform repetitive, time-consuming tasks in their role. Marketers who adopt automation reclaim an average of 25 hours a week; support teams reclaim an average of 16 hours a week (2021).
            </p>
          </div>
        </div>

        {/* Founding Cohort Statement */}
        <div className={styles.honestyPanel}>
          <h3 className={styles.honestyTitle}>A note on case studies</h3>
          <p className={styles.honestyClaim}>
            This is a new vertical for Chronexa — we won&apos;t invent client logos or fabricate success metrics to fill a trust-badge strip.
          </p>
          <ul className={styles.honestyList}>
            <li><strong>Real, deployed infrastructure elsewhere.</strong> Chronexa has built production AI systems for enterprise clients across legal, financial services, and CPA verticals — not slide-deck strategy.</li>
            <li><strong>Same engineering standard, new problem set.</strong> This startup vertical applies that same standard to the growth-stage operating model.</li>
            <li><strong>What &quot;early customer&quot; actually buys you.</strong> More founder-level attention, more flexible scoping, and direct access to the person building your system — not a delivery-manager layer.</li>
          </ul>
          <p className={styles.honestyQuote}>
            If you want a vendor with a wall of startup logos, we&apos;re not it yet. If you want someone who will build the system and stand behind it personally, that&apos;s exactly what this is.
          </p>
        </div>
      </div>
    </section>
  );
}
