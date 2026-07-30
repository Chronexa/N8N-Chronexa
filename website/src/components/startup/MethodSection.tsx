'use client';

import BookButton from '../BookButton';
import layouts from './startup-layouts.module.css';
import styles from './MethodSection.module.css';
import { IconTarget, IconLink, IconCompound } from './icons';

export default function MethodSection() {
  return (
    <section id="method" className="section-light reveal-ready">
      <div className={`container ${styles.wrap}`} data-reveal>
        <p className="eyebrow">Methodology</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '26ch' }}>How Chronexa moves a company above the Line</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNode}>01</span>
            <div className={styles.stepHead}>
              <span className={layouts.iconBadge} data-tone="accent"><IconTarget /></span>
              <h3 className={styles.stepTitle}>One measurable answer, not a generic audit.</h3>
            </div>
            <p className={styles.stepBody}>
              We use this same framework — the Leverage Line — to find the single function in your company where converting repeatable work into a system would produce the largest ratio shift.
            </p>
          </div>

          <div className={styles.step}>
            <span className={styles.stepNode}>02</span>
            <div className={styles.stepHead}>
              <span className={layouts.iconBadge} data-tone="accent"><IconLink /></span>
              <h3 className={styles.stepTitle}>Fixed-price, inside the tools you already run.</h3>
            </div>
            <p className={styles.stepBody}>
              Integrated directly into HubSpot, Slack, Notion, Intercom, WhatsApp. No new software logins, no platform migration, no per-seat SaaS tax that scales against you. You own the system outright.
            </p>
          </div>

          <div className={styles.step}>
            <span className={styles.stepNode} data-final="true">03</span>
            <div className={styles.stepHead}>
              <span className={layouts.iconBadge} data-tone="accent"><IconCompound /></span>
              <h3 className={styles.stepTitle} data-final="true">Compound.</h3>
            </div>
            <p className={styles.stepBody}>
              Each system makes the next one cheaper and faster to build, because the stack is already wired for it. <strong>Systems compound, headcount doesn&apos;t.</strong> The first build is the hardest — every one after leverages the infrastructure of the one before it.
            </p>
          </div>
        </div>

        <div className={styles.ctaWrap}>
          <BookButton location="startup-method">
            Book your systems audit <span aria-hidden="true">→</span>
          </BookButton>
        </div>
      </div>
    </section>
  );
}
