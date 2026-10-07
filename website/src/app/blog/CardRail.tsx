'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './blog.module.css';

/**
 * Horizontal card rail with prev/next controls — the NVIDIA arrangement.
 *
 * Cards are passed in as server-rendered `children`, so they stay real anchors in
 * the HTML and the rail only changes how they are presented. Three cards squeezed
 * into a grid beside the description column left each one ~340px, which wrapped
 * headlines onto five lines; a rail lets a card be as wide as it needs to be and
 * puts the overflow sideways instead of down the page.
 */
export default function CardRail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // Step by one card plus its gap, read off the first child so the step always
    // matches whatever the breakpoint decided a card should be.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // Hidden entirely when everything already fits — controls that do nothing are worse
  // than no controls.
  const showControls = !(atStart && atEnd);

  return (
    <div className={styles.railWrap}>
      {showControls && (
        <div className={styles.railControls}>
          <button
            type="button"
            className={styles.railBtn}
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label={`Scroll ${label} back`}
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            className={styles.railBtn}
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label={`Scroll ${label} forward`}
          >
            <Arrow dir="right" />
          </button>
        </div>
      )}
      <div className={styles.rail} ref={ref} onScroll={update}>
        {children}
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M10 3 5 8l5 5" /> : <path d="M6 3l5 5-5 5" />}
    </svg>
  );
}
