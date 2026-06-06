import type { ReactNode } from 'react';

// Server layout: owns route config + Studio <head> metadata (incl. noindex).
// The page itself is a Client Component (the Studio is a browser SPA).
export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
