import crypto from 'crypto';

/**
 * Meta Conversions API — server-side lead reporting.
 *
 * The browser pixel is not enough on its own. It only fires on pages that
 * explicitly call `fbq('track', 'Lead')` (as of writing, exactly one page does),
 * and it is routinely blocked by iOS, ad blockers and privacy browsers. The
 * result is that Meta only ever learns about a fraction of real enquiries, so it
 * optimises towards whoever taps a form rather than whoever becomes a customer.
 *
 * Sending the same event from the server closes that gap: it fires for every
 * submission, from every page, regardless of the visitor's browser.
 *
 * Meta requires personal identifiers to be SHA-256 hashed after normalisation.
 * We never send raw email addresses or phone numbers.
 */

const GRAPH_VERSION = process.env.META_API_VERSION || 'v23.0';

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

/** Meta's normalisation rules: trim, lowercase, then hash. Empty stays empty. */
const hashEmail = (email: string) => {
  const v = email.trim().toLowerCase();
  return v ? sha256(v) : undefined;
};

/** Phone numbers: digits only, country code included, no leading +. */
const hashPhone = (phone: string) => {
  let v = String(phone).replace(/[^\d]/g, '');
  if (!v) return undefined;
  // A bare 10-digit Indian mobile needs its country code before hashing, or it
  // will never match the same person as recorded elsewhere.
  if (v.length === 10) v = `91${v}`;
  return sha256(v);
};

const hashName = (name: string) => {
  const v = name.trim().toLowerCase();
  return v ? sha256(v) : undefined;
};

export type LeadEventInput = {
  email: string;
  name?: string;
  phone?: string;
  /** Page the lead submitted from — Meta uses it for attribution context. */
  sourceUrl?: string;
  /** Meta's browser cookies, when the request carried them. */
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  /** Distinguishes one form from another in Meta's reporting. */
  eventId?: string;
};

/**
 * Report a Lead conversion. Best-effort by design: a failure here must never
 * block or fail the visitor's form submission, so everything is caught and
 * logged rather than thrown.
 */
export async function sendLeadEvent(input: LeadEventInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return; // Not configured — silently no-op, as before.

  const firstName = input.name ? input.name.trim().split(/\s+/)[0] : '';

  const userData: Record<string, unknown> = {
    em: hashEmail(input.email),
    ph: input.phone ? hashPhone(input.phone) : undefined,
    fn: firstName ? hashName(firstName) : undefined,
    client_ip_address: input.clientIp,
    client_user_agent: input.userAgent,
    fbp: input.fbp,
    fbc: input.fbc,
  };
  for (const k of Object.keys(userData)) if (userData[k] === undefined) delete userData[k];

  const body = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: input.sourceUrl,
      // Shared with the browser pixel's event id where one exists, so Meta
      // de-duplicates instead of counting the same lead twice.
      event_id: input.eventId,
      user_data: userData,
    }],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (!res.ok) {
      console.error('[capi] Lead event rejected:', res.status, (await res.text()).slice(0, 300));
    }
  } catch (e) {
    console.error('[capi] Lead event failed:', e);
  }
}
