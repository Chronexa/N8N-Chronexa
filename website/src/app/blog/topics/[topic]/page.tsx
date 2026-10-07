import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HubPage, { hubMetadata } from '../../HubPage';
import { getBucket, indexableBuckets } from '../../../../lib/blog-taxonomy';

export const revalidate = 3600;

/** Only indexable hubs get a URL — thin buckets stay filter chips on /blog. */
export function generateStaticParams() {
  return indexableBuckets('topic').map((b) => ({ topic: b.value }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  return hubMetadata('topic', topic) as Metadata;
}

export default async function TopicHub({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const bucket = getBucket('topic', topic);
  if (!bucket?.indexable) notFound();
  return <HubPage axis="topic" bucket={bucket} />;
}
