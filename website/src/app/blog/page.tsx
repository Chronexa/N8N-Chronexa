import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, urlFor } from '../../sanity/client';
import styles from './blog.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — AI & Workflow Automation Insights',
  description:
    'Deep-dive insights on n8n, AI automation, and workflow engineering for legal, insurance, accounting, property, and venture capital teams.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className="eyebrow">Blog</p>
        <h1 className={styles.h1}>AI &amp; workflow automation insights</h1>
        <p className="heroDescription" style={{ marginBottom: 'var(--spacing-lg)' }}>
          {posts.length} articles on n8n, AI agents, and automation for B2B teams.
        </p>

        <div className={styles.grid}>
          {posts.map((post) => {
            const href = `/blog/${post.slug.current}`;
            const thumb = post.hero?.asset ? urlFor(post.hero).width(640).height(360).fit('crop').auto('format').url() : null;
            const date = post.publishedAt || post._createdAt;
            return (
              <Link href={href} key={post._id} className={styles.card}>
                <div className={styles.thumb}>
                  {thumb ? (
                    <Image src={thumb} alt={post.hero?.alt || post.title} width={640} height={360} sizes="(max-width: 720px) 100vw, 380px" />
                  ) : (
                    <div className={styles.thumbFallback} aria-hidden="true">Chronexa</div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cat}>{post.category || 'Blog'}</span>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
                  <div className={styles.cardMeta}>
                    {date && <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                    {post.readingTime ? <span>{post.readingTime} min</span> : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
