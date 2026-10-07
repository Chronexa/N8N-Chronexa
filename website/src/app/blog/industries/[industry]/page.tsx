import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HubPage, { hubMetadata } from '../../HubPage';
import { getBucket, indexableBuckets } from '../../../../lib/blog-taxonomy';

export const revalidate = 3600;

/** Only indexable hubs get a URL — thin buckets stay filter chips on /blog. */
export function generateStaticParams() {
  return indexableBuckets('industry').map((b) => ({ industry: b.value }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry } = await params;
  return hubMetadata('industry', industry) as Metadata;
}

export default async function IndustryHub({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const bucket = getBucket('industry', industry);
  if (!bucket?.indexable) notFound();
  return <HubPage axis="industry" bucket={bucket} />;
}
