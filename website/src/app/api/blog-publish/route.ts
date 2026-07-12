import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@sanity/client';
import { htmlToPortableText } from '../../../lib/html-to-portable-text';

/**
 * POST /api/blog-publish — publish endpoint for the n8n blog pipeline (Agent 5).
 *
 * Replaces the old Framer bridge: accepts the same payload shape the pipeline
 * already produces, converts HTML → PortableText (src/lib/html-to-portable-text.ts,
 * dependency-free — jsdom/block-tools break in the serverless bundle), and
 * createOrReplace's the Sanity post doc (idempotent on slug — re-publishing
 * updates in place).
 *
 * Auth: `x-publish-secret` header must equal env BLOG_PUBLISH_SECRET.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: '2024-01-01', token: TOKEN, useCdn: false });

function secretOk(req: NextRequest): boolean {
  const expected = process.env.BLOG_PUBLISH_SECRET;
  const got = req.headers.get('x-publish-secret');
  if (!expected || !got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sanitizeId(slug: string): string {
  return `post-${slug.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 120)}`;
}

/** cdn.sanity.io/images/<proj>/<ds>/<hash>-<dims>.<ext> → image-<hash>-<dims>-<ext> */
function assetRefFromCdnUrl(url: string): string | null {
  const m = url.match(/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([A-Za-z0-9]+-\d+x\d+)\.(\w+)/);
  return m ? `image-${m[1]}-${m[2]}` : null;
}

export async function POST(req: NextRequest) {
  if (!secretOk(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!TOKEN) return NextResponse.json({ error: 'SANITY_API_WRITE_TOKEN not configured' }, { status: 500 });

  let payload: {
    title?: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    html_body?: string;
    cover_image_url?: string;
    published_date?: string;
    category?: string;
    key_takeaways?: string | string[];
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const { title, slug, meta_title, meta_description, html_body, cover_image_url, published_date, category, key_takeaways } = payload;
  if (!title || !slug || !html_body) {
    return NextResponse.json({ error: 'title, slug and html_body are required' }, { status: 400 });
  }

  // Server-side quality backstop: every publisher (pipeline or ad-hoc script)
  // goes through this route, so thin content gets rejected here even if an
  // upstream gate is bypassed. The pipeline's own gate is stricter (1,500).
  const bodyWords = html_body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (bodyWords < 1000) {
    return NextResponse.json(
      { error: `html_body is ${bodyWords} words; minimum is 1000 (doctrine target 1800-2500)` },
      { status: 422 }
    );
  }

  // Optional SERP title. Stored only when it's a plausible complete phrase —
  // never auto-truncated (a mid-word 60-char slice is worse than no metaTitle,
  // which falls back to the full title at render time).
  const metaTitle = meta_title?.trim();
  const metaTitleOk = !!metaTitle && metaTitle.length >= 15 && metaTitle.length <= 70;

  try {
    const body = htmlToPortableText(html_body);
    if (body.length === 0) {
      return NextResponse.json({ error: 'html_body produced no content blocks' }, { status: 400 });
    }

    // Cover: prefer deriving the asset ref straight from a Sanity CDN URL
    // (Agent 4 uploads there); fall back to fetching + re-uploading external URLs.
    let heroRef: string | null = null;
    if (cover_image_url?.includes('cdn.sanity.io')) {
      heroRef = assetRefFromCdnUrl(cover_image_url);
    } else if (cover_image_url?.startsWith('http')) {
      const res = await fetch(cover_image_url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        const asset = await client.assets.upload('image', buf, { filename: `${slug}-cover.png` });
        heroRef = asset._id;
      }
    }

    // 3-5 one-line takeaways (newline-separated string from n8n, or an array)
    const takeaways = (Array.isArray(key_takeaways) ? key_takeaways : (key_takeaways || '').split('\n'))
      .map((t) => t.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);

    // Re-publishing an existing post is a real content revision → dateModified.
    const docId = sanitizeId(slug);
    const exists = await client.fetch<string | null>('*[_id == $id][0]._id', { id: docId });

    const doc = {
      _id: docId,
      _type: 'post',
      title: title.trim(),
      slug: { _type: 'slug', current: slug.trim() },
      category: (category || 'Resources').trim(),
      featured: false,
      excerpt: meta_description?.trim() || undefined,
      ...(metaTitleOk ? { metaTitle } : {}),
      metaDescription: meta_description?.trim() || undefined,
      ...(takeaways.length >= 3 ? { keyTakeaways: takeaways } : {}),
      readingTime: Math.max(2, Math.round(bodyWords / 200)),
      publishedAt: published_date || new Date().toISOString(),
      ...(exists ? { updatedAt: new Date().toISOString() } : {}),
      body,
      ...(heroRef
        ? { hero: { _type: 'image', asset: { _type: 'reference', _ref: heroRef }, alt: `Abstract line illustration representing ${title.trim()}` } }
        : {}),
      author: { _type: 'reference', _ref: 'author-ankit-dhiman' },
    };

    const created = await client.createOrReplace(doc);

    // Surface the post immediately instead of waiting out the 1h ISR window.
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      revalidatePath('/sitemap.xml');
    } catch {
      /* best-effort */
    }

    return NextResponse.json({ ok: true, id: created._id, url: `https://chronexa.io/blog/${slug}`, hasCover: !!heroRef });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
