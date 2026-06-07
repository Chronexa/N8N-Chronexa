import Image from 'next/image';
import styles from './CtaBand.module.css';
import { site } from '../lib/site';
import LeadForm from './LeadForm';

export default function CtaBand() {
  return (
    <section className={styles.band} id="audit" aria-labelledby="cta-title">
      <Image src="/images/cta-vista.jpg" alt="" fill sizes="100vw" className={styles.vista} />
      <div className={styles.vistaOverlay} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.lead}>
            Sometimes the hardest part is reaching out — but once you do, we&apos;ll make the
            rest easy.
          </p>
          <h2 id="cta-title" className={styles.title}>Let&apos;s talk today</h2>
          <p className={styles.guarantee}>
            <span aria-hidden="true">✓</span> No-risk guarantee: if we can&apos;t find automation worth more than it costs to build, you owe us nothing — and you keep the roadmap.
          </p>
          <p className={styles.mail}>
            Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>

        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Automation Audit Request</h3>
          <p className={styles.formIntro}>
            We&apos;ll review your workflows and suggest where AI can save time &amp; cost.
          </p>
          <LeadForm source="cta-band" compact />
        </div>
      </div>
    </section>
  );
}
