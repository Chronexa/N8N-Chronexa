import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, urlFor, type Post, type SanityImage } from '../../sanity/client';
import { site } from '../../lib/site';
import { indexableBuckets, hubPath, formatLabel, getBucket } from '../../lib/blog-taxonomy';
import BlogFinder, { type FinderEntry } from './BlogFinder';
import NewsletterCallout from '../../components/NewsletterCallout';
import styles from './blog.module.css';

/** Cards per page in the chronological archive. */
export const PER_PAGE = 24;
/** Page one shows one lead story and twelve recent articles. */
export const FIRST_PAGE_ARTICLES = 13;

/**
 * Covers with the headline burned into the artwork. These pass the house-style
 * test (they ARE house style) but the baked text repeats the card headline and
 * sits on a dark band, so they read as broken next to clean covers.
 *
 * Currently one: a leftover from scripts/demo-cover-with-text.mjs, which was run
 * against a single post as an experiment. If that experiment is ever adopted for
 * real, delete this set — text-in-cover then becomes the house style.
 */
const COVER_HAS_BAKED_TEXT = new Set(['redtail-crm-automation-ria']);

export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  industry?: string;
  format?: string;
  date?: string;
  dateLabel?: string;
  readingTime?: number;
  thumb?: string;
  alt?: string;
}

export function toCard(post: Post, width = 640): BlogCard {
  const date = post.publishedAt || post._createdAt;
  return {
    id: post._id,
    slug: post.slug.current,
    title: post.title,
    excerpt: post.excerpt,
    industry: post.industry,
    format: post.format,
    date: date || undefined,
    dateLabel: date
      ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : undefined,
    readingTime: post.readingTime,
    // Show the cover if it was commissioned in the current art direction, or if
    // it is old but still on-style. Everything else falls back to a colour tile.
    thumb:
      post.hero?.asset &&
      (isCommissionedCover(post.heroFile) || isHouseStyleCover(post.heroBg, post.heroPop)) &&
      !COVER_HAS_BAKED_TEXT.has(post.slug.current)
        ? thumbUrl(post.hero, post.heroRatio, width)
        : undefined,
    alt: post.hero?.alt,
  };
}

/**
 * The corpus carries four generations of cover art. Only ~52 use the current house
 * style (charcoal linework on warm cream); the other 76 are older glowing-AI
 * renders — dark green isometrics, saturated blue scenes, some with text baked in.
 * Mixed together they made the grid look broken, and regenerating 76 images was
 * ruled out on cost. So off-style covers are replaced with a colour-coded tile,
 * which costs nothing and makes the page read as one publication.
 *
 * Detection uses Sanity's own palette metadata, and the decisive signal turned out
 * to be POPULATION — how much of the image the dominant colour covers. House-style
 * line art sits on flat cream, so one colour covers 40%+; a busy AI render never
 * exceeds ~10%. The corpus is cleanly bimodal on this (42 above 40, the rest below
 * 15, almost nothing between).
 *
 * Colour is still checked because population alone would keep a flat dark render.
 * Luminance alone was not enough either — a bright blue AI cover scores 0.88 — and
 * HSL saturation inverts at extreme lightness, so this uses absolute chroma.
 */
/**
 * Covers made under the 2026-08 art direction — a deliberate mix of photography,
 * painting, poster art, 3D and celestial work, one bespoke concept per article.
 * They are uploaded as `cover-<slug>.png`, and that prefix is the whole test:
 * these are chosen images, so they are always shown, whatever their palette.
 *
 * Without this they would fail isHouseStyleCover below — most of them are dark or
 * richly coloured — and the page would hide brand-new artwork behind a colour tile.
 * Every future batch is picked up automatically; there is no list to maintain.
 */
function isCommissionedCover(filename?: string) {
  return Boolean(filename?.startsWith('cover-'));
}

function isHouseStyleCover(bg?: string, population?: number) {
  const m = bg?.replace('#', '').match(/../g);
  if (!m || m.length < 3 || !population || population < 15) return false;
  const [r, g, b] = m.map((x) => parseInt(x, 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return luminance > 0.78 && chroma < 0.12;
}

/**
 * Lead = the newest post, full stop.
 *
 * This used to be `posts.find((p) => p.featured) ?? posts[0]`, which was a bug with
 * real consequences: 98 of 143 posts carry `featured: true` from a legacy backfill,
 * so `find` always returned the newest *featured* post and the hero slot froze on a
 * 2026-08-06 article. Worse, the publish route writes `featured: false` on every new
 * post, so nothing published from here on could ever reach the lead slot. The page
 * looked permanently stale no matter how much we published.
 *
 * `featured` is not usable as curation while 68% of the corpus carries it, so recency
 * decides the lead until someone deliberately re-curates the flag.
 */
export const leadPost = (posts: Post[]) => posts[0];

/**
 * The page model, shared by /blog and /blog/page/[n] so the two cannot disagree
 * about how many pages exist.
 *
 * EVERY page renders the same masthead, lead story and collection rails — paging
 * changes the article list underneath, not the shape of the page. Landing on
 * /blog/page/5 and finding a stripped-down layout read as though the site had
 * broken, which is a fair reaction to a page that looks nothing like page 1.
 *
 * Because the lead and the rails are on every page, they are excluded from the
 * archive pool entirely; otherwise those ~25 posts would appear twice on whichever
 * page their chronological slot fell in.
 */
export function buildIndexModel(posts: Post[]) {
  const lead = leadPost(posts);
  return {
    lead,
    firstPage: posts.slice(1, FIRST_PAGE_ARTICLES),
    archivePool: posts.slice(FIRST_PAGE_ARTICLES),
  };
}

/** Total pages when page one has its own lead + recent-story layout. */
export function blogPageCount(posts: Post[]) {
  if (posts.length <= FIRST_PAGE_ARTICLES) return 1;
  return 1 + Math.ceil((posts.length - FIRST_PAGE_ARTICLES) / PER_PAGE);
}

/**
 * Cards are 16:9. The covers are not: 54 are 3:2, 42 are 16:9, and 32 are SQUARE.
 * Centre-cropping a square into 16:9 throws away 43% of the drawing, which is what
 * made those cards look broken — the subject was simply cut off.
 *
 * So: crop only when the source is close enough to 16:9 to survive it, and FIT the
 * rest inside the frame instead. The letterbox is filled white, and because
 * `.thumb img` is multiply-blended over the category wash, that white reads as the
 * card's own tint rather than as a grey bar. Costs nothing and regenerates nothing.
 */
function thumbUrl(hero: SanityImage, ratio: number | undefined, width: number) {
  const height = Math.round((width * 9) / 16);
  const b = urlFor(hero).width(width).height(height).auto('format');
  return ratio && ratio < 1.5
    ? b.fit('fill').bg('ffffff').url()
    : b.fit('crop').crop('entropy').url();
}

/**
 * /blog — a content feed, not a navigation surface.
 *
 * The audience and topic taxonomies live in the Blog nav panel (see Nav.tsx).
 * Putting either on this page as filter chips duplicated the same ten labels
 * twice and buried the first article ~1,400px down. Every multi-audience
 * publisher we studied (Thomson Reuters, a16z, Stripe, Intercom) segments in
 * navigation and never renders two competing taxonomies on the page.
 *
 * Page 1 = lead story + twelve recent articles + crawlable hub directory.
 * Pages 2+ = the chronological archive only.
 */
export default async function BlogIndex({ page }: { page: number }) {
  const posts = await getAllPosts();
  const isFirst = page === 1;

  const leadCard = leadPost(posts) ? toCard(leadPost(posts)!, 1200) : undefined;

  const { firstPage, archivePool } = buildIndexModel(posts);
  const totalPages = blogPageCount(posts);
  const pagePosts = isFirst
    ? firstPage
    : archivePool.slice((page - 2) * PER_PAGE, (page - 1) * PER_PAGE);
  const archive = pagePosts.map((p) => toCard(p));

  // Filter/search index — no excerpts, no image URLs, so it stays small.
  const finderIndex: FinderEntry[] = posts.map((p) => ({
    s: p.slug.current,
    t: p.title,
    i: p.industry ?? '',
    p: p.topic ?? '',
    f: p.format ?? '',
    x: p.excerpt ?? '',
    d: (p.publishedAt || p._createdAt || '').slice(0, 10),
    r: p.readingTime,
  }));

  // Match the structured list to the links a crawler and a reader can actually
  // encounter on this page. The previous ItemList described only the archive
  // grid, silently omitting the lead and every collection rail.
  const visibleCards = [...(isFirst && leadCard ? [leadCard] : []), ...archive];
  const listOffset = isFirst ? 0 : FIRST_PAGE_ARTICLES + (page - 2) * PER_PAGE;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${site.url}/blog#blog`,
        name: 'Chronexa Blog',
        description:
          'Clear guides to AI agents and workflow automation: how they work, what they cost and when a business should build or buy.',
        url: `${site.url}/blog`,
        publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name, url: site.url },
      },
      {
        '@type': 'ItemList',
        name: isFirst ? 'Chronexa blog articles' : `Chronexa blog articles — page ${page}`,
        numberOfItems: visibleCards.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: visibleCards.map((c, i) => ({
          '@type': 'ListItem',
          position: listOffset + i + 1,
          url: `${site.url}/blog/${c.slug}`,
          name: c.title,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          ...(isFirst ? [] : [{ '@type': 'ListItem', position: 3, name: `Page ${page}`, item: `${site.url}/blog/page/${page}` }]),
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* The masthead band, the search box and the chips are all rendered by
          BlogFinder so they sit on one row. The old layout put a full-height
          hero with a large illustration above a separate floating search card,
          which pushed the first article about 1,240px down the page. */}
      <BlogFinder
        entries={finderIndex}
        masthead={
          <>
            <p className="eyebrow">Blog &amp; resources</p>
            <h1 className={styles.h1}>
              {/* Same H1 on every page — the page number lives in the archive
                  heading and in <title>, not in the masthead. */}
              Practical AI automation guides for business teams
            </h1>
            <p className={styles.standfirst}>
              Learn how AI agents and workflow automation work, what they cost and when to build or buy.
            </p>
          </>
        }
      >
        <>
              {isFirst && leadCard && <LeadStory card={leadCard} />}

              <section className={styles.collection} aria-labelledby="archive-heading">
                <div className={styles.collectionHead}>
                  <h2 id="archive-heading" className={styles.collectionTitle}>
                    {isFirst ? 'Latest articles' : `All articles — page ${page}`}
                  </h2>
                  <span className={styles.collectionMeta}>
                    {posts.length} articles{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}
                  </span>
                </div>
                <div className={styles.grid}>
                  {archive.map((card) => (
                    <ArticleCard key={card.id} card={card} showLabel />
                  ))}
                </div>
              </section>

              {isFirst && <BrowseDirectory posts={posts} />}

              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}

              <div className={styles.newsletter}>
                <NewsletterCallout />
              </div>
        </>
      </BlogFinder>
    </>
  );
}

function BrowseDirectory({ posts }: { posts: Post[] }) {
  const groups = (['industry', 'topic'] as const).map((axis) => ({
    axis,
    title: axis === 'industry' ? 'Browse by audience' : 'Browse by topic',
    buckets: indexableBuckets(axis).map((bucket) => ({
      ...bucket,
      count: posts.filter((post) => post[axis] === bucket.value).length,
    })),
  }));

  return (
    <section className={styles.directory} aria-labelledby="browse-heading">
      <div className={styles.collectionHead}>
        <div>
          <h2 id="browse-heading" className={styles.collectionTitle}>Find the right guide</h2>
          <p className={styles.directoryIntro}>Browse focused collections with practical explanations and related articles.</p>
        </div>
      </div>
      <div className={styles.directoryColumns}>
        {groups.map((group) => (
          <div key={group.axis}>
            <h3 className={styles.directoryTitle}>{group.title}</h3>
            <ul className={styles.directoryList}>
              {group.buckets.map((bucket) => (
                <li key={bucket.value}>
                  <Link href={hubPath(group.axis, bucket.value)}>
                    <span>{bucket.label}</span>
                    <span>{bucket.count} articles</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The lead story. Sized by its 16:9 image rather than a fixed min-height — the
 * homepage spotlight it echoes carries stats and a client logo to fill 480px;
 * a post has a title and two lines of standfirst, and forcing that height would
 * leave the copy column stranded in whitespace.
 */
function LeadStory({ card }: { card: BlogCard }) {
  const bucket = card.industry ? getBucket('industry', card.industry) : undefined;
  return (
    <Link
      href={`/blog/${card.slug}`}
      className={styles.lead}
      style={bucket ? ({ '--cat-ink': bucket.ink, '--cat-wash': bucket.wash } as React.CSSProperties) : undefined}
    >
      <div className={styles.leadMedia}>
        {!card.thumb && (
          <div className={styles.thumbFallback} aria-hidden="true">
            <span>{bucket?.short ?? 'Chronexa'}</span>
          </div>
        )}
        {card.thumb && (
          <Image
            src={card.thumb}
            alt={card.alt || card.title}
            width={1200}
            height={675}
            priority
            sizes="(max-width: 860px) 100vw, 620px"
          />
        )}
      </div>
      <div className={styles.leadCopy}>
        <span className={styles.catLabel}>{getBucket('industry', card.industry)?.label ?? 'Featured'}</span>
        <h2 className={styles.leadTitle}>{card.title}</h2>
        {card.excerpt && <p className={styles.leadDek}>{card.excerpt}</p>}
        <span className={styles.meta}>
          {card.date && card.dateLabel && <time dateTime={card.date}>{card.dateLabel}</time>}
          {card.readingTime ? <span>{card.readingTime} min read</span> : null}
        </span>
      </div>
    </Link>
  );
}

/**
 * Article card. `showLabel` only in the mixed archive — inside a collection the
 * section heading already states the audience, so repeating it on every card is
 * noise that competes with the headline.
 */
export function ArticleCard({ card, showLabel = false }: { card: BlogCard; showLabel?: boolean }) {
  const bucket = card.industry ? getBucket('industry', card.industry) : undefined;
  // Inside a collection the section already sets --cat-*; in the mixed archive
  // each card sets its own, which is what stops that grid reading as one beige block.
  const catVars = showLabel && bucket ? ({ '--cat-ink': bucket.ink, '--cat-wash': bucket.wash } as React.CSSProperties) : undefined;

  return (
    <Link href={`/blog/${card.slug}`} className={styles.card} style={catVars}>
      <div className={styles.thumb}>
        {card.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element -- a page can render 30+ cards; a plain lazy <img> keeps them out of the optimizer queue
          <img src={card.thumb} alt={card.alt || card.title} width={640} height={360} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.thumbFallback} aria-hidden="true">
            <span>{bucket?.short ?? 'Chronexa'}</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        {/* Two-part kicker as plain bold text — "CPA & Accounting Firms | Explainer".
            It used to be an uppercase tracked label plus an amber pill badge; two
            decorations stacked on every card is what made these read as a template
            rather than a publication. */}
        <span className={styles.kicker}>
          {bucket && <span className={styles.catLabel}>{showLabel ? bucket.short : bucket.label}</span>}
          {/* "Guide" is 81 of 128 posts, so it carries no information — show the
              format only when it actually distinguishes the piece. */}
          {card.format && card.format !== 'guide' && (
            <span className={styles.kickerType}>
              <span className={styles.kickerSep} aria-hidden="true">|</span>
              {formatLabel(card.format)}
            </span>
          )}
        </span>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        {card.excerpt && <p className={styles.excerpt}>{card.excerpt}</p>}
        <span className={styles.cardSpacer} aria-hidden="true" />
        <span className={styles.meta}>
          {card.date && card.dateLabel && <time dateTime={card.date}>{card.dateLabel}</time>}
          {card.readingTime ? <span>{card.readingTime} min</span> : null}
        </span>
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const href = (n: number) => (n === 1 ? '/blog' : `/blog/page/${n}`);
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className={styles.pageLink}>← Previous</Link>
      )}
      <ul className={styles.pageList}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span className={`${styles.pageLink} ${styles.pageCurrent}`} aria-current="page">{n}</span>
            ) : (
              <Link href={href(n)} className={styles.pageLink}>{n}</Link>
            )}
          </li>
        ))}
      </ul>
      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" className={styles.pageLink}>Next →</Link>
      )}
    </nav>
  );
}
