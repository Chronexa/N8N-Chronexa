import type { Metadata } from 'next';
import N8nStartupPage from './N8nStartupPage';
import { site } from '../../lib/site';

const SLUG = 'n8n-ai-automation-startups';

/**
 * PAID-TRAFFIC ONLY. This is the Meta-ads landing page; it is deliberately kept out of
 * the nav, out of sitemap.ts, and out of the search index. Organic startup traffic is
 * owned by /ai-growth-systems-for-startups — indexing both would split the same queries
 * between two pages and rank both worse. Listed for internal reference at
 * /internal/campaigns. Do not add to taxonomy.ts or sitemap.ts.
 */
export const metadata: Metadata = {
  // No '| Chronexa' suffix — layout.tsx already applies the `%s | Chronexa` template.
  title: 'n8n AI Automation for Startups',
  description:
    'Scale your startup output without scaling headcount. Custom production-grade n8n AI workflows, self-hosted data sovereignty, and zero vendor lock-in.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${site.url}/${SLUG}`,
  },
  openGraph: {
    title: 'n8n AI Automation for Startups | Chronexa',
    description:
      'Scale your startup output without scaling headcount. Custom production-grade n8n AI workflows, self-hosted data sovereignty, and zero vendor lock-in.',
    url: `${site.url}/${SLUG}`,
    type: 'website',
  },
};

export default function Page() {
  const url = `${site.url}/${SLUG}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'n8n AI Automation for Startups',
    serviceType: 'AI Workflow Automation',
    description:
      'Production-grade n8n AI workflow automation for high-growth startups.',
    url,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: ['IN'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <N8nStartupPage />
    </>
  );
}
