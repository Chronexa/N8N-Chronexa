import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts } from '../../../../sanity/client';
import { site } from '../../../../lib/site';
import BlogIndex, { blogPageCount } from '../../BlogIndex';

export const revalidate = 3600;

/**
 * Counted off the SAME pool BlogIndex paginates — the lead story and the
 * collection rails appear on every page, so they are not part of the archive.
 * Deriving this from posts.length instead would generate a trailing page that
 * renders an empty grid.
 */
async function pageCount() {
  const posts = await getAllPosts();
  return blogPageCount(posts);
}

/**
 * Pages 2..n only. Page 1 lives at /blog — emitting /blog/page/1 as well would be
 * a duplicate of it.
 */
export async function generateStaticParams() {
  const total = await pageCount();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const title = `AI Automation Guides: Page ${n} | Chronexa`;
  const description =
    'Learn how AI agents and workflow automation work, what they cost and when to build or buy. Clear guides for business teams.';
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/blog/page/${n}` },
    openGraph: {
      title,
      description,
      url: `/blog/page/${n}`,
      type: 'website',
      images: [site.ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [site.ogImage] },
  };
}

export default async function BlogPaginatedPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const page = Number(n);
  const total = await pageCount();

  // Reject page 1 (canonical home is /blog), non-integers and out-of-range values
  // rather than rendering an empty grid on a 200.
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();

  return <BlogIndex page={page} />;
}
