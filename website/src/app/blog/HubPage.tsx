import Link from 'next/link';
import { getPostsForHub } from '../../sanity/client';
import { site } from '../../lib/site';
import { bucketsFor, getBucket, hubPath, type Axis, type Bucket } from '../../lib/blog-taxonomy';
import { relatedServices } from '../../lib/blog-links';
import { ArticleCard, toCard } from './BlogIndex';
import BookButton from '../../components/BookButton';
import styles from './hub.module.css';
import grid from './blog.module.css';

/**
 * Shared renderer for /blog/industries/[industry] and /blog/topics/[topic].
 *
 * This is the highest-intent surface in the blog: someone reading "everything
 * written for CPA firms" has self-identified their vertical. So the intro is a
 * definitional passage an AI answer engine can quote, and the closing CTA names
 * the vertical rather than offering a generic "book a call".
 *
 * The second axis appears only here, never alongside the first on /blog — the
 * pattern Thomson Reuters uses to avoid two competing taxonomies on one screen.
 */
export default async function HubPage({ axis, bucket }: { axis: Axis; bucket: Bucket }) {
  const posts = await getPostsForHub(axis, bucket.value);
  const cards = posts.map((p) => toCard(p));
  const url = `${site.url}${hubPath(axis, bucket.value)}`;
  const axisLabel = axis === 'industry' ? 'Industries' : 'Topics';
  const siblings = bucketsFor(axis).filter((b) => b.indexable && b.value !== bucket.value);
  const money = relatedServices({ title: `${bucket.heading} ${bucket.label}`, slug: bucket.value });

  // On an industry hub, the useful cross-axis move is "now narrow by topic" —
  // and vice versa. This is the only place both axes coexist.
  const crossAxis: Axis = axis === 'industry' ? 'topic' : 'industry';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: bucket.heading,
        description: bucket.metaDescription,
        url,
        isPartOf: { '@type': 'Blog', '@id': `${site.url}/blog#blog`, name: 'Chronexa Blog' },
        publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name, url: site.url },
      },
      {
        '@type': 'ItemList',
        name: bucket.heading,
        numberOfItems: cards.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: cards.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${site.url}/blog/${c.slug}`,
          name: c.title,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: axisLabel, item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 4, name: bucket.label, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={grid.wrap}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{bucket.label}</span>
          </nav>

          <header className={styles.head}>
            <p className="eyebrow">{axis === 'industry' ? 'Articles by industry' : 'Articles by topic'}</p>
            <h1 className={grid.h1}>{bucket.heading}</h1>
            <div className={styles.intro}>
              {bucket.intro.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </header>

          <div className={styles.countRow}>
            <span className={styles.count}>
              {cards.length} {cards.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <div className={grid.grid}>
            {cards.map((c) => (
              <ArticleCard key={c.id} card={c} />
            ))}
          </div>

          {/* The cross-axis move, offered only after the reader has picked a lane. */}
          <nav className={styles.cross} aria-label={`Browse by ${crossAxis}`}>
            <h2 className={styles.crossHead}>
              {axis === 'industry' ? 'Or go deeper on one topic' : 'Or browse by who it’s for'}
            </h2>
            <ul className={styles.crossList}>
              {bucketsFor(crossAxis)
                .filter((b) => b.indexable)
                .map((b) => (
                  <li key={b.value}>
                    <Link href={hubPath(crossAxis, b.value)}>{b.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>

          <aside className={styles.cta} aria-label="Work with Chronexa">
            <h2 className={styles.ctaTitle}>
              {axis === 'industry'
                ? `Building AI automation for ${bucket.label.toLowerCase()}?`
                : `Need this built properly?`}
            </h2>
            <p className={styles.ctaBody}>
              We scope it fixed-price before any code, build it inside your own environment, and you own the system
              outright. A 30-minute call is enough to tell you whether it is worth doing.
            </p>
            <div className={styles.ctaRow}>
              <BookButton location={`blog-hub-${bucket.value}`}>
                Book a discovery call <span aria-hidden="true">→</span>
              </BookButton>
              {money.slice(0, 2).map((m) => (
                <Link key={m.slug} href={`/${m.slug}`} className={styles.ctaSecondary}>
                  {m.label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </aside>

          <nav className={styles.siblings} aria-label={`Other ${axisLabel.toLowerCase()}`}>
            <ul className={styles.crossList}>
              {siblings.map((b) => (
                <li key={b.value}>
                  <Link href={hubPath(axis, b.value)}>{b.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/blog">All articles</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

/** Shared metadata builder for both hub routes. */
export function hubMetadata(axis: Axis, value: string) {
  const bucket = getBucket(axis, value);
  if (!bucket) return { title: 'Not Found' };
  const path = hubPath(axis, value);
  return {
    title: { absolute: bucket.metaTitle },
    description: bucket.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: bucket.metaTitle, description: bucket.metaDescription, url: path, type: 'website' as const },
    twitter: { card: 'summary_large_image' as const, title: bucket.metaTitle, description: bucket.metaDescription },
  };
}
