import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getBlogPostBySlug, getBlogSlugs, getRelatedPosts, urlFor, type SanityImage } from '../../../sanity/client';
import { site } from '../../../lib/site';
import {
  blockText,
  extractFaq,
  extractHeadings,
  midpointBlockIndex,
  slugifyHeading,
  wordCount,
  type PTBlockLike,
} from '../../../lib/blog-article';
import { articleCta, pillarFor } from '../../../lib/blog-links';
import { getBucket, hubPath, labelFor } from '../../../lib/blog-taxonomy';
import RelatedServices from '../../../components/RelatedServices';
import TrackView from '../../../components/TrackView';
import ScrollDepth from '../../../components/ScrollDepth';
import BlogStickyCta from '../../../components/BlogStickyCta';
import BlogInlineCta from '../../../components/BlogInlineCta';
import ArticleCta from '../../../components/ArticleCta';
import ArticleToc from '../../../components/ArticleToc';
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
  // A handful of metaTitles were authored with the brand already appended, back
  // when the template added it too ("… | Chronexa | Chronexa"). Strip it here so
  // the SERP title stays inside its character budget regardless of what the CMS
  // holds, and so future authoring cannot reintroduce the truncation.
  const title = (post.metaTitle || post.title).replace(/\s*[|–-]\s*Chronexa\s*$/i, '').trim();
  const description = post.metaDescription || post.excerpt || 'AI automation insights from Chronexa.';
  const ogImage = post.hero?.asset ? urlFor(post.hero).width(1200).height(630).fit('crop').crop('entropy').url() : site.ogImage;
  return {
    // No " | Chronexa" suffix. Every metaTitle is written to a ~55-char budget;
    // appending the brand pushed 80% of the corpus past the ~60-char point where
    // Google truncates, cutting the keyword-bearing tail of the title on the
    // exact posts ranking 6-10. The brand still reaches social via og:site_name,
    // and Google appends the site name to the SERP title itself where it helps.
    title: { absolute: title },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title, description, url: `/blog/${slug}`, type: 'article', siteName: site.name, images: [ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

// Imported posts carry their own heading structure: some open at h1 (duplicating
// the page title h1), some jump straight to h3 (skipping h2). Re-level body
// headings by NESTING DEPTH so the outline is always valid: the page <h1> is the
// only h1, body sections start at h2, siblings share a level, and no level is
// skipped (a11y heading-order). Uses a depth stack — text is untouched, only the
// block `style` (h1..h6) is adjusted.
//
// A body h1 is ALWAYS a duplicate of the page title, so it renders as an h2 but
// does not open a nesting level. Letting it do so pushed every real section down
// to h3, which suppressed the table of contents (it lists h2s) on 20% of the
// corpus — including the highest-traffic posts. 18 posts open with an h1; others
// carry one partway through, with the same effect from that point on.
function normalizeHeadings(blocks: unknown): unknown {
  if (!Array.isArray(blocks)) return blocks;
  const open: number[] = []; // source levels of currently-open ancestor headings
  return blocks.map((b) => {
    const block = b as { _type?: string; style?: string };
    if (block?._type !== 'block') return b;
    const m = /^h([1-6])$/.exec(block.style || '');
    if (!m) return b;
    const src = Number(m[1]);
    if (src === 1) {
      open.length = 0; // title-level: closes every open section, opens none
      return block.style === 'h2' ? b : { ...block, style: 'h2' };
    }
    while (open.length && open[open.length - 1] >= src) open.pop();
    open.push(src);
    const target = Math.min(open.length + 1, 6); // depth 1 → h2, depth 2 → h3 …
    return `h${target}` === block.style ? b : { ...block, style: `h${target}` };
  });
}

/**
 * Sentence-shaped audience phrases for the end-of-article CTA. Deliberately not
 * derived from the taxonomy `short` labels: those are index-page chips
 * ("Cross-Industry", "Sales") and produce copy like "scope this for
 * cross-industry". Industries with no natural phrase are simply left out.
 */
const AUDIENCE_PHRASE: Record<string, string> = {
  'cpa-firms': 'a CPA firm',
  'law-firms': 'a law firm',
  'rias-wealth-management': 'an RIA',
  'private-equity-vc': 'a PE or VC firm',
  'insurance-healthcare': 'an insurer',
  'sales-revenue': 'a revenue team',
};

/**
 * Imported posts restate the article title as an H1 inside the body, so the
 * headline rendered twice — and once body H1s stopped stealing a nesting level
 * (see normalizeHeadings) it also showed up as a redundant table-of-contents
 * entry. A document has exactly one H1 and the page owns it, so any body H1 is
 * by definition a second title: all 25 in the corpus are restatements, some
 * verbatim and some reworded, none an actual section heading.
 *
 * Guarded on count: if a post ever uses H1 as its section level (3 or more),
 * stripping them would gut the outline, so those are left to normalizeHeadings
 * to re-level instead.
 */
function dropDuplicateTitleHeadings(blocks: unknown): unknown {
  if (!Array.isArray(blocks)) return blocks;
  const isH1 = (b: unknown) => {
    const blk = b as { _type?: string; style?: string };
    return blk?._type === 'block' && blk.style === 'h1';
  };
  const count = blocks.filter(isH1).length;
  if (count === 0 || count > 2) return blocks;
  return blocks.filter((b) => !isH1(b));
}

// Headings render with stable anchor ids so the TOC (and inbound #links) work.
const anchorId = (value: unknown) => slugifyHeading(blockText(value as PTBlockLike));

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => <h2 id={anchorId(value)}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={anchorId(value)}>{children}</h3>,
  },
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      // Explicit dimensions so an in-body image can never shift the text below
      // it while loading. No post uses these yet; this is the guard for when
      // they do.
      return (
        <figure className={styles.figure}>
          <Image
            src={urlFor(value).width(1320).fit('max').auto('format').url()}
            alt={value.alt || ''}
            width={1320}
            height={743}
            sizes="(max-width: 1119px) 100vw, 660px"
            loading="lazy"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    // Data tables (sanitized markup, see schema/htmlTable.ts) — scrollable on mobile
    htmlTable: ({ value }: { value: { html?: string } }) => {
      if (!value?.html) return null;
      return (
        <div className={styles.tableScroll}>
          <div className={styles.tableWrap} dangerouslySetInnerHTML={{ __html: value.html }} />
        </div>
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
  // Show "Updated" only for meaningful revisions (>7 days after publish) — not
  // every CMS touch; mass same-day stamps read as fake freshness.
  const updated =
    post.updatedAt && dateStr && new Date(post.updatedAt).getTime() - new Date(dateStr).getTime() > 7 * 86400_000
      ? new Date(post.updatedAt)
      : null;
  const updatedLabel = updated ? updated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  // A 4:3 crop serves both placements from one download: a tall panel beside the
  // headline on desktop, a slim band on a phone. `entropy` keeps the busy part of
  // the frame when either placement crops it. 1600 wide because the desktop panel
  // reaches ~1030 CSS px on a 1920 screen, which is ~2060 device pixels on a
  // retina display — a 1200px source would be upscaled there.
  const heroUrl = post.hero?.asset
    ? urlFor(post.hero).width(1600).height(1200).fit('crop').crop('entropy').auto('format').url()
    : null;
  const heroSchemaUrl = post.hero?.asset
    ? urlFor(post.hero).width(1200).height(675).fit('crop').crop('entropy').url()
    : null;

  const body = normalizeHeadings(dropDuplicateTitleHeadings(post.body));
  const bodyBlocks = Array.isArray(body) ? (body as unknown[]) : [];
  const inlineCtaAt = midpointBlockIndex(bodyBlocks);
  const headings = extractHeadings(body).filter((h) => h.level === 2);
  const faq = extractFaq(body);
  const words = wordCount(body);
  const related = await getRelatedPosts(slug, { industry: post.industry, topic: post.topic });

  // Human-readable taxonomy labels, reused for the breadcrumb, schema keywords and
  // the keyword-matching helpers below (which take a free-text `category` haystack).
  const industryBucket = getBucket('industry', post.industry);
  const industryLabel = labelFor('industry', post.industry);
  const topicLabel = labelFor('topic', post.topic);
  const taxonomyHay = [industryLabel, topicLabel].filter(Boolean).join(' ');

  // One ask, chosen by reader intent — see articleCta() in blog-links.ts.
  const ctaPlan = articleCta({
    title: post.title,
    category: taxonomyHay,
    slug,
    format: post.format,
    topic: post.topic,
  });
  const pillar = pillarFor(post.industry);

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
        image: heroSchemaUrl ? [heroSchemaUrl] : undefined,
        author: authorSchema,
        publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name, url: site.url },
        mainEntityOfPage: pageUrl,
        inLanguage: 'en',
        ...(industryLabel ? { articleSection: industryLabel } : {}),
        ...(words ? { wordCount: words } : {}),
        keywords: [industryLabel, topicLabel, 'AI automation', 'workflow automation'].filter(Boolean),
      },
      {
        // Mirrors the visible breadcrumb exactly, including the industry hub —
        // Google flags a BreadcrumbList that disagrees with the rendered trail.
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          ...(post.industry && industryLabel
            ? [{ '@type': 'ListItem', position: 3, name: industryLabel, item: `${site.url}${hubPath('industry', post.industry)}` }]
            : []),
          { '@type': 'ListItem', position: post.industry && industryLabel ? 4 : 3, name: post.title, item: pageUrl },
        ],
      },
      // FAQ rich results were retired in May 2026, but the markup stays: it is
      // valid vocabulary and is still consumed by Bing and the AI answer-engine
      // crawlers. Kept as-is, not invested in further.
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
      <TrackView event="blog_post_view" props={{ slug, title: post.title, industry: post.industry, topic: post.topic, ctaTier: ctaPlan.tier }} />
      <ScrollDepth pageType="blog" slug={slug} />
      <BlogStickyCta slug={slug} plan={ctaPlan} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className={styles.article}>
        <div className="container">
          {/* The article opening doubles as the sticky-CTA sentinel. It has to be
              a TALL region, not a marker div: a zero-height marker can be jumped
              clean over by one large scroll — a table-of-contents link, a #hash
              deep-link, a restored scroll position — in which case its
              intersection state never changes, no observer callback fires, and
              the bar never appears at all. A region that spans the whole opening
              is either on screen or behind you, so the transition always fires. */}
          <div data-cta-sentinel>
          {/* ---------------------------------------------------- masthead -- */}
          <header className={styles.head}>
            <div className={styles.headText}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span>
              <Link href="/blog">Blog</Link><span aria-hidden="true">/</span>
              {post.industry && industryLabel && (
                <>
                  <Link href={hubPath('industry', post.industry)}>{industryLabel}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
              <span aria-current="page">{post.title}</span>
            </nav>

            {post.industry && industryLabel && (
              <Link
                href={hubPath('industry', post.industry)}
                className={styles.eyebrow}
                style={industryBucket ? { color: industryBucket.ink } : undefined}
              >
                {industryLabel}
              </Link>
            )}

            <h1 className={styles.title}>{post.title}</h1>

            {/* The standfirst. Written for every post and, until now, rendered on
                none of them — it is both the fastest way for a reader to decide
                to stay and the passage an answer engine can lift. */}
            {post.excerpt && <p className={styles.standfirst}>{post.excerpt}</p>}

            <div className={styles.meta}>
              {post.author?.name && (
                <span className={styles.byline}>
                  {post.author.name}
                  {post.author.role ? <span className={styles.bylineRole}>, {post.author.role}</span> : null}
                </span>
              )}
              {dateLabel && <span>{dateLabel}</span>}
              {updatedLabel && <span>Updated {updatedLabel}</span>}
              {post.readingTime ? <span>{post.readingTime} min read</span> : null}
            </div>
            </div>

            {/* The cover no longer sits between the reader and the article as a
                518px block. On desktop it bleeds off the right edge behind the
                headline column and dissolves into the paper, costing no vertical
                space at all; on a phone it becomes a slim full-bleed band. One
                <img>, positioned two ways — the text always sits on clean paper,
                so a dark abstract cover and a bright photo both stay legible. */}
            {heroUrl && (
              <figure className={styles.cover} aria-hidden={post.hero?.alt ? undefined : 'true'}>
                <Image
                  src={heroUrl}
                  alt={post.hero?.alt || ''}
                  width={1600}
                  height={1200}
                  priority
                  /* The panel starts at 44% of the text column and bleeds to the
                     viewport edge, so it measures ~55vw at every desktop width —
                     not a fixed 640px, which was making the browser fetch a file
                     too small for the slot and render it soft. */
                  sizes="(max-width: 999px) 100vw, 56vw"
                />
              </figure>
            )}
          </header>

          {/* ------------------------------------------------- key answer -- */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <section className={styles.takeaways} aria-labelledby="takeaways-label">
              <h2 id="takeaways-label" className={styles.takeawaysLabel}>What matters most</h2>
              <ul>
                {post.keyTakeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          </div>{/* /sentinel — end of the article opening */}

          {/* ------------------------------------------ outline + article -- */}
          <div className={styles.shell}>
            <aside className={styles.rail}>
              <ArticleToc headings={headings} />
            </aside>

            <div className={styles.body}>
              {post.body ? (
                inlineCtaAt > 0 ? (
                  <>
                    <PortableText value={bodyBlocks.slice(0, inlineCtaAt) as never} components={components} />
                    <BlogInlineCta plan={ctaPlan} subject={topicLabel || industryLabel} />
                    <PortableText value={bodyBlocks.slice(inlineCtaAt) as never} components={components} />
                  </>
                ) : (
                  <PortableText value={body as never} components={components} />
                )
              ) : (
                <p>Content coming soon.</p>
              )}

              {pillar && (
                <p className={styles.pillarLink}>
                  Read next: <Link href={`/${pillar.slug}`}>{pillar.label}</Link>
                </p>
              )}
            </div>
          </div>

          {/* ------------------------------------------------- conversion -- */}
          <div className={styles.footWrap}>
            <ArticleCta plan={ctaPlan} audience={post.industry ? AUDIENCE_PHRASE[post.industry] : undefined} />

            {post.author?.name && (
              <aside className={styles.authorBox} aria-label="About the author">
                {avatarUrl && <Image className={styles.authorAvatar} src={avatarUrl} alt="" width={56} height={56} />}
                <div>
                  <p className={styles.authorName}>
                    {post.author.name}
                    {post.author.role ? <span className={styles.authorRole}> · {post.author.role}</span> : null}
                  </p>
                  {post.author.about && <p className={styles.authorAbout}>{post.author.about}</p>}
                  {post.author.linkedin && (
                    <a className={styles.authorLink} href={post.author.linkedin} target="_blank" rel="noopener noreferrer">
                      Connect on LinkedIn <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </aside>
            )}

            {related.length > 0 && (
              <section className={styles.related} aria-labelledby="related-label">
                <h2 id="related-label" className={styles.sectionLabel}>Keep reading</h2>
                <div className={styles.relatedGrid}>
                  {related.map((p) => {
                    const thumb = p.hero?.asset ? urlFor(p.hero).width(480).height(270).fit('crop').crop('entropy').auto('format').url() : null;
                    return (
                      <Link key={p._id} href={`/blog/${p.slug.current}`} className={styles.relatedCard}>
                        {thumb && <Image src={thumb} alt="" width={480} height={270} sizes="(max-width: 720px) 100vw, 320px" />}
                        <span className={styles.relatedCat}>{labelFor('industry', p.industry) || 'Article'}</span>
                        <span className={styles.relatedTitle}>{p.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <RelatedServices title={post.title} category={taxonomyHay} slug={slug} industry={post.industry} />
          </div>
        </div>
      </article>
    </>
  );
}
