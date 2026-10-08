import type { Metadata } from 'next';
import { getService } from './services-content';
import { site } from './site';

/**
 * Builds the full Metadata for a service / use-case page from its slug, including
 * a page-specific Twitter card (otherwise these pages inherit the generic homepage
 * card from layout.tsx). Single source of truth so every service page stays in sync.
 */
/** Google cuts titles near 60 characters; the brand suffix is the first thing to go (it adds the site name itself). */
const fitTitle = (t: string) => (t.length > 60 ? t.replace(/\s*\|\s*Chronexa$/i, '') : t);

export function serviceMetadata(slug: string): Metadata {
  const data = getService(slug);
  const title = fitTitle(data!.metaTitle);
  const description = data!.metaDescription;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `/${slug}`, type: 'website', images: [site.ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [site.ogImage] },
  };
}
