import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UseCaseArticle from '../../components/UseCaseArticle';
import { getService } from '../../lib/services-content';
import { serviceMetadata } from '../../lib/seo';

const SLUG = 'cpa-tax-document-automation';
const data = getService(SLUG);

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  if (!data) notFound();
  return <UseCaseArticle data={data} />;
}
