'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import * as engagement from '@amplitude/engagement-browser';

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

/* ---------------------------------------------------------------------------
   Session Replay sampling.

   Replay is the heaviest third-party work on any page: it observes and
   serialises DOM mutations for the whole session. On a long article that cost
   lands squarely on INP, for a page type whose value is reading rather than
   interaction — and the blog serves roughly 1.3 organic readers a day, so 100%
   capture buys very little behavioural insight for it.

   Marketing/product pages keep full capture. Reverting is a one-line change:
   set BLOG_REPLAY_SAMPLE_RATE back to 1.
   --------------------------------------------------------------------------- */
const DEFAULT_REPLAY_SAMPLE_RATE = 1;
const BLOG_REPLAY_SAMPLE_RATE = 0.1;

/** Sampling for the page the session starts on. */
function replaySampleRate(pathname: string): number {
  return pathname.startsWith('/blog') ? BLOG_REPLAY_SAMPLE_RATE : DEFAULT_REPLAY_SAMPLE_RATE;
}

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

    // Sampled by entry path — full capture everywhere except the blog. Read
    // once at mount: the SDK is initialised a single time per session, so this
    // is the landing page, not the current route.
    amplitude.add(sessionReplayPlugin({ sampleRate: replaySampleRate(window.location.pathname) }));

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
