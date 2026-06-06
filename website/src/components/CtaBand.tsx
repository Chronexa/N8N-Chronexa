import Link from 'next/link';
import Image from 'next/image';
import styles from './CtaBand.module.css';
import { site } from '../lib/site';

export default function CtaBand() {
  return (
    <section className={styles.band} aria-labelledby="cta-title">
      <Image src="/images/cta-vista.jpg" alt="" fill sizes="100vw" className={styles.vista} />
      <div className={styles.vistaOverlay} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <p className={styles.lead}>
          Sometimes the hardest part is reaching out — but once you do, we&apos;ll make the
          rest easy.
        </p>
        <h2 id="cta-title" className={styles.title}>Let&apos;s talk today</h2>
        <div className={styles.actions}>
          <Link href="/contact" className="btn-primary">Book a Free Audit <span aria-hidden="true">→</span></Link>
          <a href={`mailto:${site.email}`} className="btn-outline">{site.email}</a>
        </div>
        <p className={styles.guarantee}>
          <span aria-hidden="true">✓</span> No-risk guarantee: if we can&apos;t find automation worth more than it costs to build, you owe us nothing — and you keep the roadmap.
        </p>
      </div>
    </section>
  );
}
