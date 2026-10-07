'use client';

import LiveStores from '../../app/shopify-store-build/LiveStores';
import { site } from '../../lib/site';

/** The Shopify landing page's live store player, reused on the homepage. The in-store
 *  "Start your redesign" button opens our booking instead of the landing-page form. */
export default function StoresShowcase() {
  return <LiveStores onCta={() => window.open(site.booking, '_blank', 'noopener')} />;
}
