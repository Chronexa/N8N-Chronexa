'use client';

import { useEffect, useState } from 'react';
import BookButton from './BookButton';
import styles from './CalcNudge.module.css';

/**
 * Sticky bottom nudge bar — appears after user has scrolled 600px.
 * Mirrors the Investmates-style persistent CTA strip.
 * Dismissible via ×.
 */
export default function CalcNudge({
  headline = "Seen a number worth a conversation?",
  sub = "We'll run the same model on your actual workflows and show you where the lever is.",
  location = 'calc-nudge',
}: {
  headline?: string;
  sub?: string;
  location?: string;
}) {
  const [visible, setVisible]   = useState(false);
  const [dismissed, setDismiss] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600 && !dismissed) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className={styles.nudge} role="complementary" aria-label="Booking nudge">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.nudgeHead}>{headline}</p>
          <p className={styles.nudgeSub}>{sub}</p>
        </div>
        <div className={styles.actions}>
          <BookButton className={`btn-primary ${styles.nudgeBtn}`} location={location}>
            Book a Discovery Call. Call →
          </BookButton>
          <button
            className={styles.dismiss}
            onClick={() => { setVisible(false); setDismiss(true); }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
