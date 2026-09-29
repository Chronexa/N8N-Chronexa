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

/**
 * Tag the anonymous device with how it first arrived (referrer + UTM + landing
 * page). Runs once per browser via VisitorIdentify. This is what lets a lead
 * that converts on a *different* page than they landed on (or weeks later)
 * still carry its real source instead of showing up as untraceable.
 */
export function identifyFirstTouch(props: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    const identify = new amplitude.Identify();
    for (const [k, v] of Object.entries(props)) {
      if (v) identify.setOnce(k, v);
    }
    amplitude.identify(identify);
  } catch {
    /* ignore */
  }
}

/**
 * Read Meta's ad/ad-set IDs straight off the URL (utm_content = ad id,
 * utm_term = adset id — the convention every Meta-ads landing page on this site
 * already uses) and attach them as *overwriting* user properties, not setOnce.
 * Fixes a real gap: Amplitude's own UTM auto-capture strips the query string
 * from Page URL, so on-page behavior (scroll depth, funnel steps) could never
 * be traced back to the specific ad that produced the visit — only Meta's own
 * LPV/lead counts could. Call this once per page load on any Meta-ads landing
 * page, before other events fire, so every event in the session inherits it.
 */
export function identifyAdAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const adId = params.get('utm_content') || '';
    const adsetId = params.get('utm_term') || '';
    const campaignId = params.get('utm_id') || params.get('utm_campaign') || '';
    if (!adId && !adsetId && !campaignId) return;
    const identify = new amplitude.Identify();
    if (adId) identify.set('ad_id', adId);
    if (adsetId) identify.set('adset_id', adsetId);
    if (campaignId) identify.set('campaign_id', campaignId);
    amplitude.identify(identify);
  } catch {
    /* ignore */
  }
}
