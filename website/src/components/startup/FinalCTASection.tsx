'use client';

import BookButton from '../BookButton';
import styles from './FinalCTASection.module.css';

export default function FinalCTASection() {
  return (
    <section className="section-light reveal-ready">
      <div className={`container ${styles.wrap}`} data-reveal>
        <h2 className={styles.heading}>
          Cross the <span className="accent-phrase">Leverage Line.</span>
        </h2>

        <p className={styles.lede}>
          One 30-minute call. We run the diagnostic on your company, identify the highest-leverage bottleneck, and tell you honestly whether a system is the right intervention.
        </p>

        <BookButton location="startup-final-cta">
          Book your discovery call <span aria-hidden="true">→</span>
        </BookButton>

        <p className={styles.fine}>
          30 minutes · Fixed-price scopes · You own everything we build
        </p>
      </div>
    </section>
  );
}
