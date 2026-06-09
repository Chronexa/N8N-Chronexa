import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceArticle from '../../components/ServiceArticle';
import { getService } from '../../lib/services-content';
import { serviceMetadata } from '../../lib/seo';

const SLUG = 'ai-readiness-assessment';
const data = getService(SLUG);

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  if (!data) notFound();
  return <ServiceArticle data={data} />;
}
