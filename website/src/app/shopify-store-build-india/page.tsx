import type { Metadata } from 'next';
import ShopifyStorePage from '../shopify-store-build/ShopifyStorePage';
import { INDIA } from '../shopify-store-build/markets';
import { site } from '../../lib/site';
import { FAQS } from '../shopify-store-build/content';

const SLUG = 'shopify-store-build-india';

/**
 * PAID-TRAFFIC ONLY — India-metro duplicate of /shopify-store-build.
 * Same narrative and offer (redesign + conversion-focused rebuild for
 * established Shopify brands, quote-based). Created 2026-09-24 to repurpose
 * the UK campaign for affluent Indian metros (Mumbai, Delhi NCR, Bengaluru,
 * Pune, Hyderabad, Chennai) at ₹1,500/day. Kept out of the nav, sitemap.ts
 * and the search index on purpose (noindex). Registered for internal
 * reference in src/lib/campaigns.ts.
 * 2026-09-24: now renders the shared flagship page with the INDIA market
 * settings (₹ budget bands, +91 default, own lead source) — no forked copy.
 */
export const metadata: Metadata = {
  title: 'Shopify Store Redesign for D2C Brands',
  description:
    'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Contact us for your redesign.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.url}/${SLUG}` },
  openGraph: {
    title: 'Shopify Store Redesign for D2C Brands | Chronexa',
    description:
      'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Contact us for your redesign.',
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
      'We redesign Shopify stores for growing D2C brands: custom design, SEO, brand creative and video, payments, shipping and automation. Contact us for your redesign.',
  },
};

export default function Page() {
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
    areaServed: ['IN'],
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
      <ShopifyStorePage market={INDIA} />
    </>
  );
}
