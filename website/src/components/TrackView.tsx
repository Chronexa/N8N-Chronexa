'use client';

import { useEffect } from 'react';
import { track } from '../lib/analytics';

/**
 * Fires a semantic page-view event once on mount, with structured props the
 * autocaptured "[Amplitude] Page Viewed" can't carry (title, category, slug).
 * Drop into a server-rendered page/template with the data it already has.
 */
export default function TrackView({ event, props }: { event: string; props?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, props);
    // Fire exactly once per mount; props are a snapshot of this view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
