'use client';

import { useEffect, useState } from 'react';
import styles from './FloatingCta.module.css';
import { site } from '../lib/site';
import { trackBookCta } from '../lib/cal';

/**
 * The persistent booking nudge (Ankit, 2026-08-19: "I want a floating CTA on
 * the screen that nudges them to book a call with us").
 *
 * Rules it holds to, so it nudges rather than nags:
 *   • It does not appear until the reader is past the hero (~70% of one screen).
 *     Before that the hero's own button is on screen and a second one competing
 *     with it just looks desperate.
 *   • It hides again once the closing CTA band scrolls into view, so the reader
 *     is never looking at two versions of the same ask.
 *   • It is dismissible, and the dismissal sticks for the session. A CTA you
 *     cannot close is a popup.
 *   • It sits ABOVE the chat widget in the corner stack, and moves out of its
 *     way on small screens rather than overlapping it.
 *
 * No timers, no exit-intent, no modal. It is a bar, not an interruption.
 */
export default function FloatingCta({ label = 'Book a discovery call' }: { label?: string }) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('cx-floating-cta-closed') === '1') { setClosed(true); return; }

    // Hide again once the real closing CTA is on screen.
    const band = document.getElementById('audit');
    let bandVisible = false;
    const io = band
      ? new IntersectionObserver(([e]) => { bandVisible = e.isIntersecting; onScroll(); }, { threshold: 0 })
      : null;
    if (band && io) io.observe(band);

    function onScroll() {
      const past = window.scrollY > window.innerHeight * 0.7;
      setShown(past && !bandVisible);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  if (closed) return null;

  return (
    <div className={`${styles.wrap} ${shown ? styles.in : ''}`} aria-hidden={!shown}>
      <a
        href={site.booking}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        tabIndex={shown ? 0 : -1}
        onClick={() => trackBookCta('floating')}
      >
        <span className={styles.text}>{label}</span>
        <span className={styles.sub}>Free · 30 minutes · no commitment</span>
      </a>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss"
        tabIndex={shown ? 0 : -1}
        onClick={() => { sessionStorage.setItem('cx-floating-cta-closed', '1'); setClosed(true); }}
      >
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}
