import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceArticle from '../../components/ServiceArticle';
import { getService } from '../../lib/services-content';

const SLUG = 'sales-revenue-automation';
const data = getService(SLUG);

export const metadata: Metadata = {
  title: { absolute: data!.metaTitle },
  description: data!.metaDescription,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: data!.metaTitle, description: data!.metaDescription, url: `/${SLUG}`, type: 'website' },
};

export default function Page() {
  if (!data) notFound();
  return <ServiceArticle data={data} />;
}
