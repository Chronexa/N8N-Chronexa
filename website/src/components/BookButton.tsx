'use client';

import { site } from '../lib/site';
import { attributedBookingUrl, trackBookCta } from '../lib/cal';

/**
 * Primary conversion CTA → opens the Cal.com booking in a new tab (keeps the
 * marketing site in place). Plain href, so it can never dead-end and adds no
 * third-party scripts/cookies. `location` labels the click for analytics.
 */
export default function BookButton({
  children,
  className = 'btn-primary',
  location = 'unknown',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  location?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={site.booking}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(event) => {
        const pathname = window.location.pathname;
        // Update synchronously before the browser follows the anchor. The plain
        // untagged href remains a no-JS fallback.
        event.currentTarget.href = attributedBookingUrl(site.booking, { location, pathname });
        trackBookCta(location, pathname);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
