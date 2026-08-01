'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta (Facebook) Pixel — the base script the ad platform needs in order to see
 * anything at all. Without this mounted, calls like `fbq('track', 'Lead')` scattered
 * through landing pages are silent no-ops: no conversions, no lookalike audiences,
 * no optimisation signal for the paid campaigns.
 *
 * Renders nothing unless NEXT_PUBLIC_META_PIXEL_ID is set, so a missing ID degrades to
 * "no tracking" rather than a broken page or a console error.
 *
 * Loads `afterInteractive` (never blocks first paint) and fires PageView on the initial
 * load plus every client-side route change — the App Router navigates without a full
 * page reload, which a plain copy-pasted snippet would miss entirely.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  // The inline script below already fires the first PageView; skip the duplicate the
  // effect would otherwise send on mount.
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
