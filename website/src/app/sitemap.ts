import type { MetadataRoute } from 'next';
import { site } from '../lib/site';
import { SERVICES } from '../lib/services-content';
import { SERVICES_V2 } from '../lib/services-v2';
import { CALCULATORS } from '../components/calculators/registry';
import { getAllPosts, getAllCaseStudies } from '../sanity/client';
import { indexableBuckets, hubPath } from '../lib/blog-taxonomy';
import { PER_PAGE } from './blog/BlogIndex';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/sales-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/cpa-tax-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/investment-research-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/document-intelligence-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/legal-regulatory-engine', priority: 0.9, freq: 'monthly' },
    { path: '/ai-engines/customer-support-engine', priority: 0.9, freq: 'monthly' },
    { path: '/tools', priority: 0.8, freq: 'monthly' },
    ...CALCULATORS.map((c) => ({ path: `/${c.slug}`, priority: 0.9, freq: 'monthly' as const })),
    { path: '/case-studies', priority: 0.8, freq: 'monthly' },
    { path: '/blog', priority: 0.8, freq: 'weekly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/privacy', priority: 0.3, freq: 'monthly' },
  ];

  // The twelve rebuilt services plus the legacy use-case and integration pages.
  // Slugs retired in the 2026-08 rebuild are 301'd in next.config.ts and must not
  // appear here, or the sitemap keeps advertising pages that redirect away.
  const RETIRED = new Set([
    'us-ai-automation-agency', 'ai-automation-agency-dubai', 'n8n-automation-services',
    'agentic-ai-systems', 'rag-knowledge-engines', 'sales-revenue-automation',
    'finance-automation', 'ai-readiness-assessment', 'operations-automation',
    'applied-ml-data-science', 'ai-growth-systems-for-startups', 'marketing-automation',
  ]);
  const v2Slugs = new Set(SERVICES_V2.map((s) => s.slug));
  const serviceRoutes = [
    ...SERVICES_V2.map((s) => ({ path: `/${s.slug}`, priority: 0.9, freq: 'monthly' as const })),
    ...SERVICES
      .filter((s) => !RETIRED.has(s.slug) && !v2Slugs.has(s.slug))
      .map((s) => ({ path: `/${s.slug}`, priority: 0.9, freq: 'monthly' as const })),
  ];

  const base = [...staticRoutes, ...serviceRoutes].map(({ path, priority, freq }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  // Blog taxonomy hubs — the mid-tier landing pages between /blog and the posts.
  // Only indexable buckets are listed; thin ones are filter chips with no URL.
  const hubs = (['industry', 'topic'] as const).flatMap((axis) =>
    indexableBuckets(axis).map((b) => ({
      url: `${site.url}${hubPath(axis, b.value)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Blog posts from Sanity (the bulk of indexable URLs — keeps them discoverable).
  let posts: { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }[] = [];
  let pagination: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];
  try {
    const all = await getAllPosts();
    posts = all.map((p) => ({
      url: `${site.url}/blog/${p.slug.current}`,
      lastModified: p.publishedAt || p._createdAt ? new Date(p.publishedAt || p._createdAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    // Pages 2..n. Page 1 is /blog, already in staticRoutes.
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    pagination = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      url: `${site.url}/blog/page/${i + 2}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
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

  return [...base, ...hubs, ...pagination, ...posts, ...cases];
}
