'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as amplitude from '@amplitude/analytics-browser';

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
// Sales pages need an uninterrupted explanation and booking path. Do not
// auto-launch Guides & Surveys over their interactive examples.
const SERVICE_PATHS = new Set([
  '/ai-automation', '/business-process-automation-consulting',
  '/document-processing-automation',
  '/ai-sales-outreach-engine', '/crm-automation-services',
  '/customer-support-automation', '/ai-workspace-setup',
  '/cpa-accounting-automation',
  '/legal-ai-automation', '/investment-research-automation',
  '/industrial-data-predictive-maintenance',
]);

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
  const pathname = usePathname();
  useEffect(() => {
    if (SERVICE_PATHS.has(pathname.replace(/\/$/, ''))) {
      // Also cover client-side navigation from a page that loaded surveys.
      amplitude.remove('@amplitude/engagement-browser');
      window.engagement?.shutdown();
    }
  }, [pathname]);
  useEffect(() => {
    if (!API_KEY) return;

    // Sampled by entry path — full capture everywhere except the blog. Read
    // once at mount: the SDK is initialised a single time per session, so this
    // is the landing page, not the current route.
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

    // Keep page views and conversion tracking immediate. Optional replay and
    // survey bundles load later, outside the initial rendering window.
    const entryPath = window.location.pathname;
    const timer = window.setTimeout(() => {
      void import('@amplitude/plugin-session-replay-browser')
        .then(({ sessionReplayPlugin }) => amplitude.add(sessionReplayPlugin({ sampleRate: replaySampleRate(entryPath) })))
        .catch(() => { /* Optional diagnostics must not interrupt the page. */ });
      if (!SERVICE_PATHS.has(window.location.pathname.replace(/\/$/, ''))) {
        void import('@amplitude/engagement-browser')
          .then(engagement => { if (!SERVICE_PATHS.has(window.location.pathname.replace(/\/$/, ''))) amplitude.add(engagement.plugin()); })
          .catch(() => { /* Guides & Surveys are optional. */ });
      }
    }, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
