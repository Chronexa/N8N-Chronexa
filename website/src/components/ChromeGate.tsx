'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Renders the site chrome (Nav + Footer) around page content, EXCEPT on /studio,
 * where the embedded Sanity Studio takes over the full viewport.
 * Nav/Footer are passed in as props (rendered in the server layout) so Footer
 * stays a Server Component.
 */
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

  return (
    <>
      {nav}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}
