'use client';

import { useEffect } from 'react';
import { identifyFirstTouch } from '../lib/analytics';

const STORAGE_KEY = 'chronexa_first_touch';

/**
 * Captures how a visitor first arrived — referrer, UTM params, landing page —
 * once per browser, and attaches it to their Amplitude identity. Runs silently
 * on every page via the root layout. Exists so a lead that converts on a
 * different page (or days later) still carries its real source, instead of
 * disappearing the way real leads have before.
 */
export default function VisitorIdentify() {
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return; // already captured this browser

      const params = new URLSearchParams(window.location.search);
      const firstTouch = {
        referrer: document.referrer || 'direct',
        landing_path: window.location.pathname,
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        first_seen_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(firstTouch));
      identifyFirstTouch(firstTouch);
    } catch {
      /* localStorage unavailable (private browsing, etc.) — skip silently */
    }
  }, []);

  return null;
}
