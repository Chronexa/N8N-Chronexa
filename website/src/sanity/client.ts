import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

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
  asset?: { _ref?: string };
  alt?: string;
}

/** Shape returned by the queries below — mirrors the `post` schema. */
export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  readingTime?: number;
  publishedAt?: string;
  hero?: SanityImage;
  // PortableText blocks — typed loosely to avoid a hard @portabletext dependency here.
  body?: unknown[];
  metaTitle?: string;
  metaDescription?: string;
  author?: { name?: string; role?: string };
}

const POST_FIELDS = `
  _id, _createdAt, title, slug, excerpt, category, readingTime, publishedAt,
  hero, body, metaTitle, metaDescription,
  author->{ name, role }
`;

const CARD_FIELDS = `
  _id, _createdAt, title, slug, excerpt, category, readingTime, publishedAt, hero,
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
  return safeFetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`, undefined, []);
}

/** Single post by slug. */
export async function getBlogPostBySlug(slug: string): Promise<Post | null> {
  return safeFetch(`*[_type == "post" && slug.current == $slug][0]{ ${POST_FIELDS} }`, { slug }, null);
}

/** Published posts, newest first — used by the blog index (no heavy body field). */
export async function getAllPosts(): Promise<Post[]> {
  return safeFetch(`*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc){ ${CARD_FIELDS} }`, undefined, []);
}

/* ----------------------------- Case studies ----------------------------- */
export interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  thumb?: SanityImage;
  logo?: SanityImage;
  overview?: string;
  projectType?: string;
  serviceIncluded?: string[];
  companyName?: string;
  year?: string;
  industry?: string;
  websiteName?: string;
  websiteLink?: string;
  content1?: unknown[];
  content2?: unknown[];
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
  _id, title, slug, thumb, logo, overview, projectType, serviceIncluded,
  companyName, year, industry, websiteName, websiteLink,
  content1, content2, testimonial, client, clientDetails, clientImage, youtubeLink,
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
