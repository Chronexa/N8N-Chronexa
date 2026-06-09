import * as amplitude from '@amplitude/analytics-browser';

/**
 * Fire an Amplitude event. SSR-safe and never throws — analytics is best-effort
 * and must never break the UX. The SDK is initialized once in <Analytics/>;
 * events fired before init are queued by the SDK.
 */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    amplitude.track(event, props);
  } catch {
    /* ignore */
  }
}

/**
 * Tie this anonymous device to a known person by email. Called when a visitor
 * gives us their email (lead form). Setting user_id = email lets the server-side
 * Cal.com booking events (also keyed by attendee email) merge into the same
 * Amplitude user — so we get one unbroken journey: anon visit → form → booking.
 */
export function identifyByEmail(email: string) {
  if (typeof window === 'undefined' || !email) return;
  try {
    const e = email.trim().toLowerCase();
    amplitude.setUserId(e);
    amplitude.identify(new amplitude.Identify().set('email', e));
  } catch {
    /* ignore */
  }
}
