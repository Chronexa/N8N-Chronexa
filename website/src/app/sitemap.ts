import type { MetadataRoute } from 'next';
import { site } from '../lib/site';
import { SERVICES } from '../lib/services-content';
import { getAllPosts, getAllCaseStudies } from '../sanity/client';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/sales-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/cpa-tax-engine', priority: 0.9, freq: 'monthly' },
    { path: '/case-studies', priority: 0.8, freq: 'monthly' },
    { path: '/blog', priority: 0.8, freq: 'weekly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
  ];

  const serviceRoutes = SERVICES.map((s) => ({ path: `/${s.slug}`, priority: 0.9, freq: 'monthly' as const }));

  const base = [...staticRoutes, ...serviceRoutes].map(({ path, priority, freq }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  // Blog posts from Sanity (the bulk of indexable URLs — keeps them discoverable).
  let posts: { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }[] = [];
  try {
    const all = await getAllPosts();
    posts = all.map((p) => ({
      url: `${site.url}/blog/${p.slug.current}`,
      lastModified: p.publishedAt || p._createdAt ? new Date(p.publishedAt || p._createdAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // If Sanity is unreachable at build, still emit the static + service routes.
  }

  let cases: { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }[] = [];
  try {
    const all = await getAllCaseStudies();
    cases = all.map((c) => ({
      url: `${site.url}/case-studies/${c.slug.current}`,
      lastModified: c._updatedAt ? new Date(c._updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // ignore
  }

  return [...base, ...posts, ...cases];
}
