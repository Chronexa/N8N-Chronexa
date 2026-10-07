'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Renders the site chrome (Nav + Footer) around page content, EXCEPT on:
 *   • /studio — the embedded Sanity Studio takes the full viewport.
 *   • paid Meta-ads landing pages — a full site nav gives cold ad traffic exits
 *     it should not have. These pages carry their own minimal header/footer.
 * Nav/Footer are passed in as props (rendered in the server layout) so Footer
 * stays a Server Component.
 */
// Exact path or sub-path match — '/shopify-store-build' does NOT cover '/shopify-store-build-india'.
export const LANDING_PREFIXES = ['/shopify-store-build', '/shopify-store-build-india'];
export default function ChromeGate({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio')) return <>{children}</>;
  if (LANDING_PREFIXES.some((p) => pathname === p || pathname?.startsWith(p + '/'))) {
    // Paid landing pages: keep the main landmark + skip-link target, drop Nav/Footer.
    return <main id="main">{children}</main>;
  }

  return (
    <>
      {nav}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}
