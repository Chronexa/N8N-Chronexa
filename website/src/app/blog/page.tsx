import type { Metadata } from 'next';
import BlogIndex from './BlogIndex';
import { site } from '../../lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'AI Automation Guides and Comparisons | Chronexa' },
  description:
    'Learn how AI agents and workflow automation work, what they cost and when to build or buy. Clear guides for business teams.',
  // Self-referencing canonical. Filter state lives in query params applied
  // client-side, so every ?industry=… permutation consolidates back to this URL.
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/blog/rss.xml' },
  },
  openGraph: {
    title: 'AI Automation Guides and Comparisons | Chronexa',
    description: 'Learn how AI agents and workflow automation work, what they cost and when to build or buy. Clear guides for business teams.',
    url: '/blog',
    type: 'website',
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Guides and Comparisons | Chronexa',
    description: 'Learn how AI agents and workflow automation work, what they cost and when to build or buy. Clear guides for business teams.',
    images: [site.ogImage],
  },
};

export default function BlogIndexPage() {
  return <BlogIndex page={1} />;
}
