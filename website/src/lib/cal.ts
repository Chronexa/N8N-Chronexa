import { site } from './site';
import { track } from './analytics';

type Prefill = { name?: string; email?: string; notes?: string };

/**
 * Open the Cal.com booking in a new tab, prefilled with the visitor's details
 * (Cal.com reads name/email/notes from the query string). Opening in a new tab
 * keeps the marketing site in place. Client-only (touches window).
 */
export function openBooking(prefill: Prefill = {}) {
  const u = new URL(site.booking);
  if (prefill.name) u.searchParams.set('name', prefill.name);
  if (prefill.email) u.searchParams.set('email', prefill.email);
  if (prefill.notes) u.searchParams.set('notes', prefill.notes);
  window.open(u.toString(), '_blank', 'noopener,noreferrer');
}

/** Fire the booking-CTA click event to Amplitude (`location` = which CTA: hero/nav/footer/form). */
export function trackBookCta(location: string) {
  track('book_cta_click', { location });
}
