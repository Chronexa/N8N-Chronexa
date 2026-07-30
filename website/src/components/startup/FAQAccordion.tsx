'use client';

import React from 'react';
import layouts from './startup-layouts.module.css';
import styles from './FAQAccordion.module.css';
import { startupFaqs } from './faqData';

export default function FAQAccordion() {
  return (
    <section className="section-muted reveal-ready">
      <div className={`container ${styles.wrap}`} data-reveal>
        <p className="eyebrow">Questions</p>
        <h2 className={layouts.sectionHead}>Frequently asked</h2>
        <p className={styles.lede}>
          Everything you need to know about the Leverage Line framework and working with Chronexa.
        </p>

        <div className={styles.list}>
          {startupFaqs.map((faq, idx) => (
            <details key={idx} className={styles.item}>
              <summary className={styles.summary}>
                <span>{faq.q}</span>
                <span className={styles.plus} aria-hidden="true">+</span>
              </summary>
              <p className={styles.answer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
