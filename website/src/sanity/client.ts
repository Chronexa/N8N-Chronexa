import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { MERGED_POSTS } from "../lib/blog-seo";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // false → hits api.sanity.io (fresh). Correct for SSG/ISR: pages are statically
  // generated and revalidated server-side, so the CDN buys nothing and the
  // non-CDN endpoint is the reliable one at build time.
  useCdn: false,
  perspective: "published", // never serve drafts on the public site
  // Resilience for build-time SSG fetches over flaky networks.
  timeout: 30000,
  maxRetries: 3,
});

const builder = createImageUrlBuilder({ projectId, dataset });
/** Build an image URL from a Sanity image object (hero / inline images). */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export interface SanityImage {
  asset?: { _ref?: string; _id?: string; url?: string; metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } } };
  alt?: string;
}

/** Shape returned by the queries below — mirrors the `post` schema. */
export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  /** @deprecated legacy Blog/Resources split — superseded by industry/topic/format. */
  category?: string;
  /** Blog taxonomy — see src/lib/blog-taxonomy.ts for labels and hub rules. */
  industry?: string;
  topic?: string;
  format?: string;
  region?: string;
  featured?: boolean;
  readingTime?: number;
  publishedAt?: string;
  updatedAt?: string;
  keyTakeaways?: string[];
  hero?: SanityImage;
  /** width/height of the hero asset. Cards are 16:9 (1.78); anything much squarer
   *  must be fitted rather than cropped or it loses ~43% of the illustration. */
  heroRatio?: number;
  /** Dominant swatch colour + how much of the image it covers, from Sanity's own
   *  palette metadata. Together these identify current house-style covers versus
   *  the older glowing-AI art. See isHouseStyleCover in BlogIndex.tsx. */
  heroBg?: string;
  heroPop?: number;
  /** Asset filename. Covers commissioned in the 2026-08 art direction are uploaded
   *  as `cover-<slug>.png`; that prefix is how the card knows to show the image
   *  rather than fall back to a colour tile. See isCommissionedCover in BlogIndex. */
  heroFile?: string;
  // PortableText blocks — typed loosely to avoid a hard @portabletext dependency here.
  body?: unknown[];
  metaTitle?: string;
  metaDescription?: string;
  author?: { name?: string; role?: string; about?: string; linkedin?: string; avatar?: SanityImage };
}

const POST_FIELDS = `
  _id, _createdAt, title, slug, excerpt, category, industry, topic, format, region,
  readingTime, publishedAt, updatedAt,
  keyTakeaways, hero, body, metaTitle, metaDescription,
  author->{ name, role, about, linkedin, avatar }
`;

const CARD_FIELDS = `
  _id, _createdAt, title, slug, excerpt, category, industry, topic, format, region,
  featured, readingTime, publishedAt, hero,
  "heroRatio": hero.asset->metadata.dimensions.aspectRatio,
  "heroBg": hero.asset->metadata.palette.dominant.background,
  "heroPop": hero.asset->metadata.palette.dominant.population,
  "heroFile": hero.asset->originalFilename,
  author->{ name, role }
`;

/**
 * Fault-tolerant fetch: if Sanity is unreachable (e.g. a CMS outage during a
 * build), return a safe fallback instead of crashing the whole site build.
 * Affected pages simply defer to on-demand ISR and render once Sanity is back.
 */
async function safeFetch<T>(query: string, params: Record<string, unknown> | undefined, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch (e) {
    console.error('[sanity] fetch failed, using fallback:', (e as Error)?.message);
    return fallback;
  }
}

/** All slugs — used by generateStaticParams for the blog. */
export async function getBlogSlugs(): Promise<{ slug: string }[]> {
  return safeFetch(
    `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`,
    undefined,
    [],
  );
}

/**
 * Single post by slug.
 *
 * Deliberately NOT wrapped in safeFetch. A swallowed network error returns null,
 * the page calls notFound(), and Next bakes a permanent 404 for a live article —
 * which is exactly what happened when one query timed out mid-build. A missing
 * post and an unreachable CMS are different things: only the first is a 404, and
 * the second must fail the build loudly so it gets retried.
 */
export async function getBlogPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ ${POST_FIELDS} }`,
    { slug },
  );
}

/** Published posts, newest first — used by the blog index (no heavy body field). */
// Posts folded into another page (lib/blog-seo.ts) now 301; never list or link them.
const notMerged = (p: Post) => !(p.slug.current in MERGED_POSTS);

export async function getAllPosts(): Promise<Post[]> {
  const posts = await safeFetch<Post[]>(
    `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc){ ${CARD_FIELDS} }`,
    undefined,
    [],
  );
  return posts.filter(notMerged);
}

/**
 * Up to 3 related posts for the "Keep reading" row.
 *
 * Ranked by taxonomy overlap rather than the old Blog/Resources `category`, which
 * matched ~85% of the corpus and so ranked almost nothing. Same industry AND topic
 * is the strongest signal, then same industry, then same topic, padded with the
 * newest posts so the row is never short.
 */
export async function getRelatedPosts(slug: string, opts?: { industry?: string; topic?: string }): Promise<Post[]> {
  const posts = (await safeFetch<Post[]>(
    `*[_type == "post" && defined(slug.current) && slug.current != $slug && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc)
      { ${CARD_FIELDS} }[0...70]`,
    { slug },
    []
  )).filter(notMerged);
  const score = (p: Post) =>
    (opts?.industry && p.industry === opts.industry ? 2 : 0) + (opts?.topic && p.topic === opts.topic ? 1 : 0);
  // Stable sort: equal scores keep the newest-first order from the query.
  return posts
    .map((p, i) => ({ p, i, s: score(p) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.p);
}

/** Every post in one hub, newest first. Powers /blog/industries/* and /blog/topics/*. */
export async function getPostsForHub(axis: 'industry' | 'topic', value: string): Promise<Post[]> {
  // Field name is interpolated, not parameterised — GROQ cannot parameterise an
  // attribute path. Safe because `axis` is a union of two literals, never user input.
  const posts = await safeFetch<Post[]>(
    `*[_type == "post" && defined(slug.current) && ${axis} == $value && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc){ ${CARD_FIELDS} }`,
    { value },
    []
  );
  return posts.filter(notMerged);
}

/** Per-hub post counts, so the index can show depth without fetching every post. */
export async function getHubCounts(axis: 'industry' | 'topic'): Promise<Record<string, number>> {
  const rows = await safeFetch<{ value: string | null }[]>(
    `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "value": ${axis} }`,
    undefined,
    []
  );
  return rows.reduce<Record<string, number>>((acc, r) => {
    if (r.value) acc[r.value] = (acc[r.value] || 0) + 1;
    return acc;
  }, {});
}

/* ----------------------------- Case studies ----------------------------- */
export interface CaseStudy {
  _id: string;
  _updatedAt?: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: { current: string };
  thumb?: SanityImage;
  logo?: SanityImage;
  overview?: string;
  quickAnswer?: string;
  targetKeyword?: string;
  secondaryKeywords?: string[];
  toolsUsed?: string[];
  workflowSteps?: { _key: string; name: string; description: string }[];
  safeguards?: string[];
  publishedAt?: string;
  projectType?: string;
  evidenceType?: 'client' | 'internal' | 'reference' | 'market';
  evidenceNote?: string;
  serviceIncluded?: string[];
  companyName?: string;
  year?: string;
  industry?: string;
  websiteName?: string;
  websiteLink?: string;
  content1?: unknown[];
  content2?: unknown[];
  technicalContent?: unknown[];
  testimonial?: string;
  client?: string;
  clientDetails?: string;
  clientImage?: SanityImage;
  youtubeLink?: string;
  stat1?: string;
  stat1Text?: string;
  stat2?: string;
  stat2Text?: string;
}

const CASE_FIELDS = `
  _id, _createdAt, _updatedAt, title, metaTitle, metaDescription, slug,
  thumb{alt, hotspot, crop, asset->{_id, url, metadata{lqip, dimensions}}}, logo,
  overview, quickAnswer, targetKeyword, secondaryKeywords, toolsUsed,
  workflowSteps[]{_key, name, description}, safeguards, publishedAt,
  projectType, evidenceType, evidenceNote, serviceIncluded,
  companyName, year, industry, websiteName, websiteLink,
  content1, content2, technicalContent, testimonial, client, clientDetails, clientImage, youtubeLink,
  stat1, stat1Text, stat2, stat2Text
`;

export async function getCaseStudySlugs(): Promise<{ slug: string }[]> {
  return safeFetch(`*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current }`, undefined, []);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return safeFetch(`*[_type == "caseStudy" && slug.current == $slug][0]{ ${CASE_FIELDS} }`, { slug }, null);
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return safeFetch(`*[_type == "caseStudy" && defined(slug.current)] | order(year desc){ ${CASE_FIELDS} }`, undefined, []);
}
