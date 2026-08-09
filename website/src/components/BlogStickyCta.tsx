'use client';

import { useEffect, useRef, useState } from 'react';
import BookButton from './BookButton';
import CalcCtaButton from './CalcCtaButton';
import { track } from '../lib/analytics';
import type { ArticleCtaPlan } from '../lib/blog-links';
import styles from './BlogStickyCta.module.css';

const DISMISSED_KEY = 'cx_blog_sticky_dismissed';

/**
 * Read the session dismissal during render rather than in an effect. Safe for
 * SSR (returns false on the server) and safe for hydration: the bar is hidden
 * on the server and on the first client render either way, because `past` only
 * becomes true once the reader has actually scrolled past the article opening.
 */
function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(DISMISSED_KEY) !== null;
  } catch {
    return false; // storage blocked — proceed without the session guard
  }
}

/**
 * The passive, always-available ask — one line, one action.
 *
 * Two things changed here and both matter:
 *
 * 1. It is now a single line. The previous version stacked an eyebrow, a
 *    headline, a sub-line, a button and a secondary link into a floating card
 *    that ate a large share of a phone viewport while the reader was trying to
 *    read.
 *
 * 2. It observes instead of polling. The old implementation ran a scroll +
 *    resize listener that read `document.documentElement.scrollHeight` inside
 *    every rAF frame, which forces layout on every frame of every scroll. Two
 *    IntersectionObservers do the same job with no main-thread work between
 *    intersections — a straight INP win.
 *
 * It stands down whenever an in-page ask (`[data-cta-block]`) is on screen, and
 * stays down for good once the end-of-article block has been reached, so the
 * reader never faces two asks at once or the same ask twice.
 */
export default function BlogStickyCta({ slug, plan }: { slug: string; plan: ArticleCtaPlan }) {
  // Both signals start "suppressed" and are only ever relaxed from an observer
  // callback. The article page always renders the sentinel and the end-of-post
  // block, so the observers always fire; if either ever went missing the bar
  // simply stays hidden, which is the safe failure.
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(true);
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(readDismissed);
  const shownRef = useRef(false);

  useEffect(() => {
    const sentinel = document.querySelector('[data-cta-sentinel]');
    const blocks = Array.from(document.querySelectorAll('[data-cta-block]'));

    // "Past the intro": the whole opening region has scrolled above the fold.
    // Testing `bottom <= 0` (not `top`) is what makes a tall sentinel work — the
    // reader is past it only once its last pixel is behind them.
    const startIo = new IntersectionObserver(
      ([e]) => setPast(!e.isIntersecting && e.boundingClientRect.bottom <= 0),
      { threshold: 0 },
    );
    if (sentinel) startIo.observe(sentinel);

    // Any in-page ask on screen suppresses the bar; reaching the end retires it.
    const live = new Set<Element>();
    const blockIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            live.add(e.target);
            if (e.target.hasAttribute('data-cta-end')) setDone(true);
          } else {
            live.delete(e.target);
          }
        }
        setBlocked(live.size > 0);
      },
      // No negative bottom margin: shrinking the detection box let the
      // end-of-article block sit in the last 10% of the viewport without
      // registering, so the floating bar and the end block were briefly on
      // screen together. Any ask in view now suppresses the bar.
      { rootMargin: '0px' },
    );
    blocks.forEach((b) => blockIo.observe(b));

    return () => {
      startIo.disconnect();
      blockIo.disconnect();
    };
  }, []);

  const visible = past && !blocked && !done && !dismissed;

  useEffect(() => {
    if (visible && !shownRef.current) {
      shownRef.current = true;
      track('blog_sticky_cta_shown', { slug, tier: plan.tier });
    }
  }, [visible, slug, plan.tier]);

  if (!visible) return null;

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {}
  }

  // `action` has to stand on its own: a 390px phone reserves a right-hand corner
  // for the chat FAB, which leaves no usable room for a separate label, so the
  // label is hidden there and the button alone carries the message. On desktop
  // the label returns as a lead-in.
  const copy =
    plan.tier === 'calculator'
      ? { label: 'Two minutes, no email', action: "Get your firm's number" }
      : plan.tier === 'scope'
        ? { label: 'Still comparing?', action: 'See how we would scope it' }
        : { label: 'No sales rep', action: 'Book a 15-min call' };

  return (
    <aside className={styles.wrap} aria-label="Next step">
      <p className={styles.label}>{copy.label}</p>
      {plan.tier === 'calculator' ? (
        <CalcCtaButton slug={plan.calc.slug} className={styles.action} location="blog-sticky">
          {copy.action} <span aria-hidden="true">→</span>
        </CalcCtaButton>
      ) : (
        <BookButton className={styles.action} location="blog-sticky">
          {copy.action} <span aria-hidden="true">→</span>
        </BookButton>
      )}
      <button className={styles.close} onClick={dismiss} aria-label="Dismiss" type="button">
        <span aria-hidden="true">✕</span>
      </button>
    </aside>
  );
}
