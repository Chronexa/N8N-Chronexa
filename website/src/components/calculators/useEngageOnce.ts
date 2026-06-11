'use client';

import { useCallback, useRef } from 'react';
import { track } from '../../lib/analytics';

/** Fires `calculator_engage` exactly once — the top of the calculator funnel. */
export function useEngageOnce(source: string) {
  const engagedRef = useRef(false);
  return useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    track('calculator_engage', { source });
  }, [source]);
}
