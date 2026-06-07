import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getBlogPostBySlug, getBlogSlugs, urlFor, type SanityImage } from '../../../sanity/client';
import { site } from '../../../lib/site';
import BookButton from '../../../components/BookButton';
import RelatedServices from '../../../components/RelatedServices';
import styles from './post.module.css';

export const revalidate = 3600; // ISR: refresh published content hourly

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || 'AI automation insights from Chronexa.';
  const ogImage = post.hero?.asset ? urlFor(post.hero).width(1200).height(630).url() : site.ogImage;
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title, description, url: `/blog/${slug}`, type: 'article', images: [ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

// Imported posts carry their own heading structure: some open at h1 (duplicating
// the page title h1), some jump straight to h3 (skipping h2). Re-level body
// headings by NESTING DEPTH so the outline is always valid: the page <h1> is the
// only h1, body sections start at h2, siblings share a level, and no level is
// skipped (a11y heading-order). Uses a depth stack — text is untouched, only the
// block `style` (h1..h6) is adjusted.
function normalizeHeadings(blocks: unknown): unknown {
  if (!Array.isArray(blocks)) return blocks;
  const open: number[] = []; // source levels of currently-open ancestor headings
  return blocks.map((b) => {
    const block = b as { _type?: string; style?: string };
    if (block?._type !== 'block') return b;
    const m = /^h([1-6])$/.exec(block.style || '');
    if (!m) return b;
    const src = Number(m[1]);
    while (open.length && open[open.length - 1] >= src) open.pop();
    open.push(src);
    const target = Math.min(open.length + 1, 6); // depth 1 → h2, depth 2 → h3 …
    return `h${target}` === block.style ? b : { ...block, style: `h${target}` };
  });
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset) return null;
      return (
        <img
          className={styles.bodyImg}
          src={urlFor(value).width(1400).fit('max').auto('format').url()}
          alt={value.alt || ''}
          loading="lazy"
        />
      );
    },
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const dateStr = post.publishedAt || post._createdAt;
  const dateLabel = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const heroUrl = post.hero?.asset ? urlFor(post.hero).width(1600).height(840).fit('crop').auto('format').url() : null;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        datePublished: post.publishedAt || post._createdAt,
        image: heroUrl ? [heroUrl] : undefined,
        author: post.author?.name
          ? { '@type': 'Person', name: post.author.name, ...(post.author.role ? { jobTitle: post.author.role } : {}) }
          : { '@type': 'Organization', name: site.name },
        publisher: { '@type': 'Organization', name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}/blog/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${site.url}/blog/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className={styles.article}>
        <div className={`container ${styles.head}`}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/blog">Blog</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{post.category || 'Blog'}</span>
          </nav>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            {post.author?.name && <span>{post.author.name}{post.author.role ? `, ${post.author.role}` : ''}</span>}
            {dateLabel && <span>{dateLabel}</span>}
            {post.readingTime ? <span>{post.readingTime} min read</span> : null}
          </div>
        </div>

        {heroUrl && (
          <div className={`container ${styles.heroWrap}`}>
            <Image className={styles.hero} src={heroUrl} alt={post.hero?.alt || post.title} width={1600} height={840} priority sizes="(max-width: 900px) 100vw, 900px" />
          </div>
        )}

        <div className={`container ${styles.body}`}>
          {post.body ? <PortableText value={normalizeHeadings(post.body) as never} components={components} /> : <p>Content coming soon.</p>}
        </div>

        <div className="container">
          <RelatedServices title={post.title} category={post.category} slug={slug} />
        </div>

        <div className={`container ${styles.cta}`}>
          <BookButton location="blog-post">Book a Free Audit <span aria-hidden="true">→</span></BookButton>
          <Link href="/blog" className="btn-outline">More articles</Link>
        </div>
      </article>
    </>
  );
}
