import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StartupGrowthPage from './StartupGrowthPage';
import { getService } from '../../lib/services-content';
import { serviceMetadata } from '../../lib/seo';
import { site } from '../../lib/site';
import { startupFaqs } from '../../components/startup/faqData';

const SLUG = 'ai-growth-systems-for-startups';
const data = getService(SLUG);

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  if (!data) notFound();

  const url = `${site.url}/${SLUG}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.serviceName,
    serviceType: data.serviceType,
    description: data.schemaDescription,
    url,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: ['IN'],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: startupFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: data.serviceName, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <StartupGrowthPage />
    </>
  );
}
