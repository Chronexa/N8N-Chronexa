import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared render for the Shopify landing pages' social preview image — kept
 * separate from the root /opengraph-image.tsx so a WhatsApp/LinkedIn/X share
 * of a Shopify ad link shows "Shopify redesign" instead of the generic
 * "AI automation agency" card every other page on the site uses.
 * Called from each route's own opengraph-image.tsx (the Next.js file
 * convention requires the file to physically exist in each segment).
 */
export function ShopifyOgImage(subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0B0A',
          padding: 72,
          fontFamily: 'sans-serif',
          backgroundImage:
            'radial-gradient(circle at 80% 15%, rgba(103,176,53,0.22) 0%, transparent 45%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700, color: '#fff' }}>
          Chronexa<span style={{ color: '#67B035' }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#67B035', fontWeight: 600, marginBottom: 20 }}>
            SHOPIFY STORE REDESIGN
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, color: '#fff', lineHeight: 1.08, letterSpacing: -2, maxWidth: 1050 }}>
            Your Shopify store has outgrown its design.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#9aa19a', marginTop: 26, maxWidth: 900 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: '#67B035', display: 'flex' }} />
          <div style={{ fontSize: 28, color: '#67B035', fontWeight: 600 }}>chronexa.io</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
