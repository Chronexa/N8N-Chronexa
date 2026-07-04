'use client';

import { useEffect, useRef, useState } from 'react';
import BookButton from './BookButton';
import CalcCtaButton from './CalcCtaButton';
import { track } from '../lib/analytics';
import { relatedCalculator } from '../lib/blog-links';
import styles from './BlogStickyCta.module.css';

const DISMISSED_KEY = 'cx_blog_sticky_dismissed';

/**
 * Always-available conversion CTA for blog posts — the passive counterpart to
 * the exit-intent popup. It never interrupts reading: on wide screens it floats
 * in the empty right-hand gutter beside the 760px reading column; on narrow
 * screens it collapses to a slim bar pinned to the bottom of the viewport.
 *
 * Behaviour:
 *   - Appears only AFTER the reader has scrolled past the intro (~600px) so it
 *     feels earned, not thrown in their face on arrival.
 *   - Hides again near the very bottom, where the article's own footer CTA lives,
 *     so the same ask never stacks on itself.
 *   - Dismissible; once closed it stays gone for the rest of the browser session.
 *
 * When the post topically matches a calculator (legal/CPA-tax/document — see
 * `relatedCalculator`), that becomes the primary ask with a lighter "or book a
 * call" fallback — a cold organic reader is far more likely to spend 2 minutes
 * on a calculator than book a 15-minute call on their first visit. Posts with no
 * calculator fit (most n8n/dev tutorials) keep the original single book-a-call ask.
 *
 * Fires `blog_sticky_cta_shown` once per render; the buttons fire `book_cta_click`
 * / `calculator_cta_click` with location `blog-sticky`.
 */
export default function BlogStickyCta({ slug, title, category }: { slug: string; title?: string; category?: string }) {
  const calc = relatedCalculator({ title, category, slug });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) {
        setDismissed(true);
        return;
      }
    } catch {
      // storage blocked — proceed without the session guard
    }

    let ticking = false;
    const evaluate = () => {
      ticking = false;
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = scrolled + window.innerHeight > docHeight - 900;
      const past = scrolled > 600;
      const show = past && !nearBottom;
      setVisible(show);
      if (show && !shownRef.current) {
        shownRef.current = true;
        track('blog_sticky_cta_shown', { slug });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    evaluate();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [slug]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {}
  }

  if (dismissed || !visible) return null;

  return (
    <aside className={styles.wrap} aria-label={calc ? 'Free calculator' : 'Book a strategy call'}>
      <button className={styles.close} onClick={dismiss} aria-label="Dismiss" type="button">
        ✕
      </button>
      {calc ? (
        <>
          <p className={styles.eyebrow}>Free 2-minute calculator</p>
          <p className={styles.headline}>{calc.benchmarkHook}</p>
          <p className={styles.sub}>See your firm&apos;s number — no email required.</p>
          <CalcCtaButton slug={calc.slug} className={`btn-primary ${styles.btn}`} location="blog-sticky">
            {calc.navLabel}
          </CalcCtaButton>
          <BookButton className={styles.altLink} location="blog-sticky-secondary">
            Prefer to talk? Book a free call →
          </BookButton>
        </>
      ) : (
        <>
          <p className={styles.eyebrow}>See it for your firm</p>
          <p className={styles.headline}>Curious what this would look like in your operation?</p>
          <p className={styles.sub}>15 minutes with the engineer who&apos;d build it — not a sales rep.</p>
          <BookButton className={`btn-primary ${styles.btn}`} location="blog-sticky">
            Book a Free Strategy Call
          </BookButton>
        </>
      )}
    </aside>
  );
}
