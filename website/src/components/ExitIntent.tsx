'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ExitIntent.module.css';
import { openBooking, trackBookCta } from '../lib/cal';
import { track } from '../lib/analytics';

const SESSION_KEY = 'chronexa_exit_shown';
const MIN_TIME_ON_PAGE_MS = 12000;

/**
 * One-time exit-intent popup — offers the free calculators or a booking.
 * Skipped on /blog: BlogStickyCta already makes the same "free calculator"
 * offer there, contextually matched to the post — showing both at once is
 * redundant and was reported as visually broken/cluttered on blog pages.
 */
export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isBlogPage = pathname?.startsWith('/blog');

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isBlogPage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 720px)').matches) return; // no reliable exit signal on touch
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const loadedAt = Date.now();

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY > 0) return; // only the "leaving toward the tab bar" gesture
      if (Date.now() - loadedAt < MIN_TIME_ON_PAGE_MS) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(true);
      track('exit_intent_shown');
      document.removeEventListener('mouseleave', onMouseLeave);
    }

    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, [isBlogPage]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { close(); track('exit_intent_dismissed'); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={() => { close(); track('exit_intent_dismissed'); }}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close"
          onClick={() => { close(); track('exit_intent_dismissed'); }}
        >
          ×
        </button>
        <p className={styles.eyebrow}>Before you go</p>
        <h2 id="exit-intent-title" className={styles.title}>
          See your number first — free, 2 minutes, no email required
        </h2>
        <p className={styles.body}>
          Try one of our free calculators to see what manual work is actually costing your firm, or book a
          15-minute call if you'd rather just talk it through.
        </p>
        <div className={styles.actions}>
          <Link
            href="/tools"
            className={styles.secondaryBtn}
            onClick={() => { track('exit_intent_click', { action: 'tools' }); close(); }}
          >
            See free calculators
          </Link>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {
              trackBookCta('exit_intent');
              track('exit_intent_click', { action: 'book' });
              openBooking();
              close();
            }}
          >
            Book a free call
          </button>
        </div>
      </div>
    </div>
  );
}
