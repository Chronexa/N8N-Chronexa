'use client';

import { useEffect } from 'react';
import { track } from '../lib/analytics';

/**
 * Read-depth signal for content pages: fires `scroll_depth` at the 50% and 90%
 * milestones (once each), then detaches. Passive listener + rAF throttle so it
 * never janks scrolling (keeps the page's perf scores intact). 90% ≈ "read it".
 */
export default function ScrollDepth({ pageType, slug }: { pageType: string; slug?: string }) {
  useEffect(() => {
    const milestones = [50, 90];
    const hit = new Set<number>();
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        const pct = Math.round((doc.scrollTop / max) * 100);
        for (const m of milestones) {
          if (pct >= m && !hit.has(m)) {
            hit.add(m);
            track('scroll_depth', { percent: m, page_type: pageType, slug });
          }
        }
        if (hit.size === milestones.length) window.removeEventListener('scroll', onScroll);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageType, slug]);

  return null;
}
