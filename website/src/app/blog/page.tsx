import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, urlFor } from '../../sanity/client';
import BlogGrid, { type BlogCard } from './BlogGrid';
import { site } from '../../lib/site';
import styles from './blog.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — AI Automation Insights for Professional Services Firms',
  description:
    'Practical guides on agentic AI, legal RAG, tax workflow automation, and document intelligence — written for law firms, CPA practices, and finance teams.',
  alternates: { canonical: '/blog' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Automation Blog — Chronexa',
  description:
    'Deep-dive insights on AI automation, agentic systems, and workflow engineering for law firms, CPA firms, and finance teams.',
  url: `${site.url}/blog`,
  publisher: { '@type': 'Organization', name: site.name, url: site.url },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  const cards: BlogCard[] = posts.map((post) => {
    const date = post.publishedAt || post._createdAt;
    return {
      id: post._id,
      href: `/blog/${post.slug.current}`,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category || 'Blog',
      dateLabel: date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      readingTime: post.readingTime,
      thumb: post.hero?.asset ? urlFor(post.hero).width(640).height(360).fit('crop').crop('entropy').auto('format').url() : undefined,
      alt: post.hero?.alt,
    };
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1 className={styles.h1}>AI automation insights for professional services firms</h1>
          <p className="heroDescription">
            Practical guides on agentic AI, legal RAG, tax workflow automation, and document intelligence — written for
            law firms, CPA practices, and finance teams.
          </p>
          <p className="heroDescription" style={{ marginBottom: 'var(--spacing-lg)' }}>
            {posts.length} articles.{' '}
            <Link href="/contact" style={{ textDecoration: 'underline' }}>
              Building AI automation for your firm? Book a free audit →
            </Link>
          </p>

          <BlogGrid cards={cards} />
        </div>
      </section>
    </>
  );
}
