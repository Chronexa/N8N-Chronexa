import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getBlogPostBySlug, getBlogSlugs, getRelatedPosts, urlFor, type SanityImage } from '../../../sanity/client';
import { site } from '../../../lib/site';
import { blockText, extractFaq, extractHeadings, slugifyHeading, type PTBlockLike } from '../../../lib/blog-article';
import BookButton from '../../../components/BookButton';
import RelatedServices from '../../../components/RelatedServices';
import ShareRow from '../../../components/ShareRow';
import TrackView from '../../../components/TrackView';
import ScrollDepth from '../../../components/ScrollDepth';
import NewsletterCallout from '../../../components/NewsletterCallout';
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
  const ogImage = post.hero?.asset ? urlFor(post.hero).width(1200).height(630).fit('crop').crop('entropy').url() : site.ogImage;
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

// Headings render with stable anchor ids so the TOC (and inbound #links) work.
const anchorId = (value: unknown) => slugifyHeading(blockText(value as PTBlockLike));

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => <h2 id={anchorId(value)}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={anchorId(value)}>{children}</h3>,
  },
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
    // Data tables (sanitized markup, see schema/htmlTable.ts) — scrollable on mobile
    htmlTable: ({ value }: { value: { html?: string } }) => {
      if (!value?.html) return null;
      return <div className={styles.tableWrap} dangerouslySetInnerHTML={{ __html: value.html }} />;
    },
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const dateStr = post.publishedAt || post._createdAt;
  const dateLabel = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  // Show "Updated" only for meaningful revisions (>7 days after publish) — not
  // every CMS touch; mass same-day stamps read as fake freshness.
  const updated =
    post.updatedAt && dateStr && new Date(post.updatedAt).getTime() - new Date(dateStr).getTime() > 7 * 86400_000
      ? new Date(post.updatedAt)
      : null;
  const updatedLabel = updated ? updated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const heroUrl = post.hero?.asset ? urlFor(post.hero).width(1600).height(840).fit('crop').crop('entropy').auto('format').url() : null;

  const body = normalizeHeadings(post.body);
  const headings = extractHeadings(body).filter((h) => h.level === 2);
  const faq = extractFaq(body);
  const related = await getRelatedPosts(slug, post.category);
  const pageUrl = `${site.url}/blog/${slug}`;
  const avatarUrl = post.author?.avatar?.asset ? urlFor(post.author.avatar).width(112).height(112).fit('crop').url() : null;

  const authorSchema = post.author?.name
    ? {
        '@type': 'Person',
        name: post.author.name,
        ...(post.author.role ? { jobTitle: post.author.role } : {}),
        ...(post.author.linkedin ? { sameAs: [post.author.linkedin], url: post.author.linkedin } : {}),
        ...(avatarUrl ? { image: avatarUrl } : {}),
      }
    : { '@type': 'Organization', name: site.name };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        datePublished: post.publishedAt || post._createdAt,
        dateModified: post.updatedAt || post.publishedAt || post._createdAt,
        image: heroUrl ? [heroUrl] : undefined,
        author: authorSchema,
        publisher: { '@type': 'Organization', name: site.name, url: site.url },
        mainEntityOfPage: pageUrl,
        keywords: post.category
          ? `${post.category}, AI automation, professional services, workflow automation`
          : 'AI automation, professional services, workflow automation',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
        ],
      },
      ...(faq.length >= 2
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faq.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <TrackView event="blog_post_view" props={{ slug, title: post.title, category: post.category }} />
      <ScrollDepth pageType="blog" slug={slug} />
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
            {updatedLabel && <span>Updated {updatedLabel}</span>}
            {post.readingTime ? <span>{post.readingTime} min read</span> : null}
          </div>
          <div className={styles.share}>
            <ShareRow url={pageUrl} title={post.title} />
          </div>
        </div>

        {heroUrl && (
          <div className={`container ${styles.heroWrap}`}>
            <Image className={styles.hero} src={heroUrl} alt={post.hero?.alt || post.title} width={1600} height={840} priority sizes="(max-width: 900px) 100vw, 900px" />
          </div>
        )}

        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className={`container ${styles.body}`}>
            <section className={styles.takeaways} aria-label="Key takeaways">
              <p className={styles.boxEyebrow}>Key takeaways</p>
              <ul>
                {post.keyTakeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {headings.length >= 3 && (
          <div className={`container ${styles.body}`}>
            <nav className={styles.toc} aria-label="Table of contents">
              <p className={styles.boxEyebrow}>In this article</p>
              <ol>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        <div className={`container ${styles.body}`}>
          {post.body ? <PortableText value={body as never} components={components} /> : <p>Content coming soon.</p>}
          <NewsletterCallout />
        </div>

        {post.author?.name && (
          <div className="container">
            <aside className={styles.authorBox} aria-label="About the author">
              {avatarUrl && <Image className={styles.authorAvatar} src={avatarUrl} alt={post.author.name} width={56} height={56} />}
              <div>
                <p className={styles.authorName}>
                  {post.author.name}
                  {post.author.role ? <span className={styles.authorRole}> · {post.author.role}</span> : null}
                </p>
                {post.author.about && <p className={styles.authorAbout}>{post.author.about}</p>}
                {post.author.linkedin && (
                  <a className={styles.authorLink} href={post.author.linkedin} target="_blank" rel="noopener noreferrer">
                    Connect on LinkedIn →
                  </a>
                )}
              </div>
            </aside>
          </div>
        )}

        {related.length > 0 && (
          <div className="container">
            <section className={styles.related} aria-label="Related articles">
              <p className={styles.boxEyebrow}>Keep reading</p>
              <div className={styles.relatedGrid}>
                {related.map((p) => {
                  const thumb = p.hero?.asset ? urlFor(p.hero).width(480).height(270).fit('crop').crop('entropy').auto('format').url() : null;
                  return (
                    <Link key={p._id} href={`/blog/${p.slug.current}`} className={styles.relatedCard}>
                      {thumb && <Image src={thumb} alt="" width={480} height={270} sizes="(max-width: 720px) 100vw, 240px" />}
                      <span className={styles.relatedCat}>{p.category || 'Blog'}</span>
                      <span className={styles.relatedTitle}>{p.title}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        )}

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
