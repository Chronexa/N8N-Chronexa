import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UseCaseArticle from '../../components/UseCaseArticle';
import { getService } from '../../lib/services-content';

const SLUG = 'vc-pe-crm-automation';
const data = getService(SLUG);

export const metadata: Metadata = {
  title: { absolute: data!.metaTitle },
  description: data!.metaDescription,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: data!.metaTitle, description: data!.metaDescription, url: `/${SLUG}`, type: 'website' },
};

export default function Page() {
  if (!data) notFound();
  return <UseCaseArticle data={data} />;
}
