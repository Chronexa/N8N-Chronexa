import { site } from './site';
import { track } from './analytics';

type Prefill = { name?: string; email?: string; notes?: string; url?: string };

const BOOKING_HOSTS = new Set(['cal.com', 'www.cal.com', 'calendly.com', 'www.calendly.com']);

/**
 * Add source data that Calendly/Cal expose on the booked event. Blog attribution
 * used to stop at an Amplitude click, so a meeting could not be tied back to the
 * article that produced it. Keep the original booking provider/path and add only
 * standard UTM fields.
 */
export function attributedBookingUrl(
  href: string,
  { location = 'unknown', pathname = '' }: { location?: string; pathname?: string } = {},
) {
  try {
    const url = new URL(href);
    if (!BOOKING_HOSTS.has(url.hostname)) return href;
    const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
    url.searchParams.set('utm_source', isBlog ? 'chronexa-blog' : 'chronexa-website');
    url.searchParams.set('utm_medium', 'organic');
    url.searchParams.set('utm_campaign', isBlog ? 'blog-conversion' : 'website-conversion');
    url.searchParams.set('utm_content', pathname || 'unknown-path');
    url.searchParams.set('utm_term', location);
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Open the Cal.com booking in a new tab, prefilled with the visitor's details
 * (Cal.com reads name/email/notes from the query string). Opening in a new tab
 * keeps the marketing site in place. Client-only (touches window).
 *
 * `prefill.url` overrides the sitewide default (site.booking) for a single
 * caller — e.g. the Shopify landing page uses its own Calendly link without
 * changing the link every other page on the site still opens.
 */
export function openBooking(prefill: Prefill = {}) {
  const u = new URL(attributedBookingUrl(prefill.url || site.booking, {
    location: 'form-success',
    pathname: window.location.pathname,
  }));
  if (prefill.name) u.searchParams.set('name', prefill.name);
  if (prefill.email) u.searchParams.set('email', prefill.email);
  if (prefill.notes) u.searchParams.set('notes', prefill.notes);
  window.open(u.toString(), '_blank', 'noopener,noreferrer');
}

/** Fire the booking-CTA click event to Amplitude (`location` = which CTA: hero/nav/footer/form). */
export function trackBookCta(location: string, pathname?: string) {
  track('book_cta_click', { location, pathname });
}
