import { site } from './site';

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

/** Best-effort analytics hook (no-op until an analytics tool is wired). */
export function trackBookCta(location: string) {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (window as any)?.posthog?.capture?.('book_cta_click', { location });
  } catch {
    /* ignore */
  }
}
