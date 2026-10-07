import type { Metadata } from 'next';
import { preconnect } from 'react-dom';
import ShopifyStorePage from './ShopifyStorePage';
import { site } from '../../lib/site';
import { FAQS } from './content';

const SLUG = 'shopify-store-build';

/**
 * PAID-TRAFFIC ONLY — the Shopify redesign / conversion Meta-ads landing page.
 * Kept out of the nav, sitemap.ts and the search index on purpose (noindex).
 * Registered for internal reference in src/lib/campaigns.ts.
 * Repositioned 2026-09-21: established Shopify brands, redesign +
 * conversion-focused development, quote-based (no stated price). Replaces
 * the earlier India / new-store-build / ₹25,000 offer on this same URL.
 * 2026-09-24 flagship overhaul: the page now shows the work (screen-recorded
 * store tours, LUMIQ campaign video, real catalog products) instead of
 * linking out to password-gated demo stores. Market switched UK → US/EU
 * (USD budget bands, +1 default) the same day — see markets.ts.
 */
export const metadata: Metadata = {
  title: 'Shopify Store Redesign for D2C Brands',
  description:
    'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Get a free store audit.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.url}/${SLUG}` },
  openGraph: {
    title: 'Shopify Store Redesign for D2C Brands | Chronexa',
    description:
      'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Get a free store audit.',
    url: `${site.url}/${SLUG}`,
    type: 'website',
  },
  // Without this, Twitter/X (and WhatsApp/iMessage previews that fall back to
  // the twitter: tags) inherit the root layout's generic "AI automation
  // agency" title/description instead of this page's own — page-level
  // metadata.openGraph doesn't backfill metadata.twitter.
  twitter: {
    card: 'summary_large_image',
    title: 'Shopify Store Redesign for D2C Brands | Chronexa',
    description:
      'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Get a free store audit.',
  },
};

export default function Page() {
  // Open the Meta Pixel's connection early: its load is what counts the ad click as a "landing page view".
  preconnect('https://connect.facebook.net');
  const url = `${site.url}/${SLUG}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Shopify Store Redesign',
    serviceType: 'E-commerce store redesign',
    description:
      'Shopify store redesign for D2C brands: custom store design, SEO and AI search, brand identity, photography and campaign video, conversion and checkout, payments and shipping setup, and store automation.',
    url,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: ['US', 'CA', 'GB', 'IE', 'AU', { '@type': 'Place', name: 'European Union' }],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ShopifyStorePage />
    </>
  );
}
