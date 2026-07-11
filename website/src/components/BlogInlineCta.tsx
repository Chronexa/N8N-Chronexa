'use client';

import { relatedCalculator } from '../lib/blog-links';
import BookButton from './BookButton';
import CalcCtaButton from './CalcCtaButton';
import styles from './BlogInlineCta.module.css';

const LOCATION = 'blog-inline';

/**
 * Mid-article CTA — sits inside the body copy itself, roughly halfway through
 * a long post. The sticky bar and end-of-post CTA only reach readers who
 * scroll the whole way or notice a floating element; this one is in the
 * reading path for anyone who stops partway through.
 */
export default function BlogInlineCta({
  title,
  category,
  slug,
}: {
  title: string;
  category?: string;
  slug: string;
}) {
  const calc = relatedCalculator({ title, category, slug });

  return (
    <aside className={styles.box} aria-label="Talk to Chronexa">
      {calc ? (
        <>
          <p className={styles.eyebrow}>Before you keep reading</p>
          <p className={styles.line}>
            See what this is actually costing your team — free, 2 minutes, no email required.
          </p>
          <CalcCtaButton slug={calc.slug} location={LOCATION} className="btn-primary">
            {calc.navLabel} <span aria-hidden="true">→</span>
          </CalcCtaButton>
        </>
      ) : (
        <>
          <p className={styles.eyebrow}>If this is eating your week</p>
          <p className={styles.line}>
            We build the system that removes this exact kind of manual work — for real, not a demo.
          </p>
          <BookButton location={LOCATION}>
            Book a free 15-min scope call <span aria-hidden="true">→</span>
          </BookButton>
        </>
      )}
    </aside>
  );
}
