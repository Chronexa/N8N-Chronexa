'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import * as engagement from '@amplitude/engagement-browser';

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

/**
 * Amplitude instrumentation — migrated from the Framer custom-code snippet to the
 * official Browser SDK. Mounted once in the root layout; initializes after mount
 * so it never blocks first paint. Matches the Framer setup (same project key):
 * autocapture, Session Replay, and the Engagement (Guides & Surveys) plugin.
 *
 * Autocapture's pageViews hooks the History API, which the Next.js App Router uses
 * for client-side navigation — so in-app route changes are counted (the one thing
 * a plain snippet would miss on a single-page app).
 */
export default function Analytics() {
  useEffect(() => {
    if (!API_KEY) return;

    // Session Replay at 100% sampling (parity with Framer). Lower sampleRate to cut quota.
    amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));

    amplitude.init(API_KEY, {
      autocapture: {
        elementInteractions: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        attribution: true,
      },
    });

    // Guides & Surveys — attach after init.
    try {
      amplitude.add(engagement.plugin());
    } catch {
      /* engagement is optional — ignore if it fails to attach */
    }
  }, []);

  return null;
}
