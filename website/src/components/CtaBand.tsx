import Image from 'next/image';
import styles from './CtaBand.module.css';
import { site } from '../lib/site';
import LeadForm from './LeadForm';
import BookButton from './BookButton';

/**
 * The closing CTA.
 *
 * Booking is the primary action and sits above the form; the form stays as the
 * fallback for people who would rather write than book.
 *
 * Background: the vista photograph (restored 2026-07 by request) under a
 * directional scrim, with one green thread drawing itself across the band via
 * the sitewide data-reveal system — the photo gives the band depth, the thread
 * keeps it in the page's grammar.
 */
export default function CtaBand() {
  return (
    <section className={styles.band} id="audit" aria-labelledby="cta-title">
      <Image src="/images/cta-vista.jpg" alt="" fill sizes="100vw" className={styles.vista} />
      <div className={styles.vistaOverlay} aria-hidden="true" />
      <svg
        className={styles.thread}
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        aria-hidden="true"
        data-reveal
      >
        <path
          className={styles.threadPath}
          d="M-20,330 C240,300 400,140 640,170 C880,200 1020,100 1220,120"
        />
      </svg>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.lead}>
            Bring us the workflow that keeps eating your team&apos;s week.
          </p>
          <h2 id="cta-title" className={styles.title}>
            Let&apos;s find <span className="accent-phrase">the first one</span> to fix.
          </h2>
          <p className={styles.guarantee}>
            <span aria-hidden="true">✓</span> The audit is free. If we can&apos;t find automation
            worth more than it costs to build, you owe us nothing — and you keep the roadmap.
          </p>
          <div className={styles.actions}>
            <BookButton location="cta-band" className="btn-primary">Book a discovery call</BookButton>
          </div>
          <p className={styles.mail}>
            Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Or tell us what&apos;s slow</h3>
          <p className={styles.formIntro}>
            We&apos;ll review your workflows and come back with where AI saves the most time and
            cost.
          </p>
          <LeadForm source="cta-band" compact />
        </div>
      </div>
    </section>
  );
}
