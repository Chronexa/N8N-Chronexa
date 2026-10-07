import type { MetadataRoute } from 'next';
import { site } from '../lib/site';
import { newCapabilities } from '../lib/capabilities';
import { SERVICES } from '../lib/services-content';
import { SERVICES_V2 } from '../lib/services-v2';
import { CALCULATORS } from '../components/calculators/registry';
import { getAllPosts, getAllCaseStudies } from '../sanity/client';
import { indexableBuckets, hubPath } from '../lib/blog-taxonomy';
import { blogPageCount } from './blog/BlogIndex';
import { workflows } from '../lib/portfolio-data';
import { isHiddenFromIndex } from '../lib/blog-seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'monthly' },
    ...newCapabilities.map(s => ({ path: `/${s.slug}`, priority: 0.9, freq: 'monthly' as const })),
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
    { path: '/n8n-portfolio', priority: 0.8, freq: 'monthly' },
    ...workflows.map((workflow) => ({ path: `/n8n-portfolio/${workflow.slug}`, priority: 0.7, freq: 'monthly' as const })),
    { path: '/blog', priority: 0.8, freq: 'weekly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/privacy', priority: 0.3, freq: 'monthly' },
  ];

  // The primary solutions plus the legacy use-case and integration pages.
  // Slugs retired in the 2026-08 rebuild are 301'd in next.config.ts and must not
  // appear here, or the sitemap keeps advertising pages that redirect away.
  const RETIRED = new Set([
    'us-ai-automation-agency', 'ai-automation-agency-dubai', 'n8n-automation-services',
    'agentic-ai-systems', 'rag-knowledge-engines', 'sales-revenue-automation',
    'finance-automation', 'ai-readiness-assessment', 'operations-automation',
    'applied-ml-data-science', 'ai-growth-systems-for-startups', 'marketing-automation',
    // Solution cull 2026-09-14 — folded into the pages where the work lives.
    'accounts-payable-automation', 'private-rag-knowledge-systems', 'secure-ai-deployment',
    'system-data-integration', 'legacy-system-modernization',
    // Offer consolidation 2026-09-15 — capabilities folded into AI Workspace Setup.
    'ai-agent-development', 'ai-pilot-production',
  ]);
  // Bespoke solution pages without an entry in SERVICES/SERVICES_V2.
  // entry in SERVICES/SERVICES_V2, so they have to be listed explicitly.
  const SOLUTION_PAGES = [
    'cpa-accounting-automation',
    'legal-ai-automation',
    'investment-research-automation',
    'ai-workspace-setup',
    'industrial-data-predictive-maintenance',
    // Growth pages 2026-10-07 (lib/growth-pages.ts)
    'how-we-work', 'ai-automation-agency', 'ai-strategy-consulting', 'ai-knowledge-systems',
    'ai-integration-services', 'custom-mcp-server-development', 'ai-agent-development',
    'ai-roi-calculator', 'automated-reporting', 'ai-email-management', 'ai-training-for-employees',
    'tech-stack-migration', 'what-is-ai-automation', 'ai-automation-cost', 'document-pipeline',
    // Supporting pages for /ecommerce-development (2026-10-07; lib/product-pages.ts)
    'shopify-seo-services', 'shopify-migration-services', 'custom-shopify-store-cost',
  ];
  const v2Slugs = new Set(SERVICES_V2.map((s) => s.slug));
  const serviceRoutes = [
    ...SOLUTION_PAGES.map((slug) => ({ path: `/${slug}`, priority: 0.9, freq: 'monthly' as const })),
    // RETIRED has to filter v2 as well — the 2026-09 cull removed five slugs
    // that still have SERVICES_V2 entries, and without this the sitemap keeps
    // advertising URLs that now 301 away.
    ...SERVICES_V2
      .filter((s) => !RETIRED.has(s.slug))
      .map((s) => ({ path: `/${s.slug}`, priority: 0.9, freq: 'monthly' as const })),
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
    posts = all
      .filter((p) => !isHiddenFromIndex(p.slug.current))
      .map((p) => ({
      url: `${site.url}/blog/${p.slug.current}`,
      lastModified: p.publishedAt || p._createdAt ? new Date(p.publishedAt || p._createdAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    // Pages 2..n. Page 1 is /blog, already in staticRoutes.
    const totalPages = blogPageCount(all);
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
