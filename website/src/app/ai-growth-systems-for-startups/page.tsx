import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceSalesPage from '../../components/ServiceSalesPage';
import { getService } from '../../lib/services-content';
import { serviceMetadata } from '../../lib/seo';

const SLUG = 'ai-growth-systems-for-startups';
const data = getService(SLUG);

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  if (!data) notFound();
  return <ServiceSalesPage data={data} />;
}
