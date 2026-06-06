/**
 * Framer Blog CSV  →  Sanity importer (one-time migration).
 *
 * What it does:
 *   - Parses "Framer Exports/Framer-Blog (1).csv"
 *   - Preserves each Slug VERBATIM (critical for SEO — do not clean slugs)
 *   - Converts the HTML `Content` into Sanity PortableText
 *   - Downloads every cover (Hero) + inline image from framerusercontent.com and
 *     re-uploads it into Sanity's asset CDN (so you own them after leaving Framer)
 *   - Creates author docs and references them
 *   - Idempotent: deterministic _id per post, uses createOrReplace
 *   - Drafts (:draft=true) are written as Sanity drafts (not published)
 *
 * Prereqs:
 *   1. A free Sanity project. Set in website/.env.local:
 *        NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
 *        NEXT_PUBLIC_SANITY_DATASET=production
 *        SANITY_API_WRITE_TOKEN=sk...          (Editor token, server-side only)
 *   2. Install dev deps:
 *        npm i -D @sanity/client @sanity/block-tools @sanity/schema jsdom csv-parse
 *
 * Run:
 *   node scripts/import-blogs.mjs --dry-run   # parse + report, no writes (no token needed)
 *   node scripts/import-blogs.mjs             # real import
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config as dotenv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
dotenv({ path: resolve(ROOT, '.env.local') });
dotenv({ path: resolve(ROOT, '../.env') }); // repo-root .env fallback

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT = parseInt((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1], 10) || Infinity;
const CSV_PATH = resolve(ROOT, 'Framer Exports', 'Framer-Blog (1).csv');

// Optional: branded fallback cover for the 46 posts with no Hero image.
// Leave null to import those posts without a cover.
const DEFAULT_COVER_URL = null;

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

function slugifyId(prefix, slug) {
  // deterministic, valid Sanity _id (no special chars). Slug FIELD stays verbatim.
  return `${prefix}-${slug.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 120)}`;
}

function parseReadingTime(v) {
  const m = String(v || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : undefined;
}

function parseDate(v) {
  if (!v) return undefined;
  const t = Date.parse(v);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString();
}

function isTrue(v) {
  return String(v || '').trim().toLowerCase() === 'true';
}

async function main() {
  // ---- lazy imports so --dry-run works even before deps are installed ----
  const { parse } = await import('csv-parse/sync');

  const csv = readFileSync(CSV_PATH, 'utf8');
  const rows = parse(csv, { columns: true, skip_empty_lines: true });
  console.log(`Parsed ${rows.length} rows from ${CSV_PATH}`);

  const published = rows.filter((r) => !isTrue(r[':draft']));
  const drafts = rows.filter((r) => isTrue(r[':draft']));
  const withCover = rows.filter((r) => (r['Hero'] || '').startsWith('http'));
  console.log(`  published: ${published.length} | drafts: ${drafts.length} | with cover: ${withCover.length}/${rows.length}`);

  if (DRY_RUN) {
    console.log('\n--dry-run: showing first 3 mapped records (no writes)\n');
    for (const r of rows.slice(0, 3)) {
      console.log({
        _id: slugifyId(isTrue(r[':draft']) ? 'drafts.post' : 'post', r['Slug']),
        slug: r['Slug'],
        title: r['Title'],
        category: r['Category'],
        readingTime: parseReadingTime(r['Reading time']),
        publishedAt: parseDate(r['Date']),
        hero: r['Hero'] ? r['Hero'].slice(0, 60) + '…' : '(none)',
        author: r['Author Names'],
        contentChars: (r['Content'] || '').length,
      });
    }
    console.log('\nDry run OK. Provide Sanity env + deps, then run without --dry-run.');
    return;
  }

  if (!PROJECT_ID || !TOKEN) {
    console.error('✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. See header.');
    process.exit(1);
  }

  console.log(`Using project=${PROJECT_ID} dataset=${DATASET} token=${TOKEN.slice(0, 6)}…${TOKEN.slice(-6)}`);
  const { createClient } = await import('@sanity/client');
  const { htmlToBlocks } = await import('@sanity/block-tools');
  const { Schema } = await import('@sanity/schema');
  const { JSDOM } = await import('jsdom');

  const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2024-01-01', useCdn: false });

  // Compile a minimal schema so block-tools knows the target block type.
  const schema = Schema.compile({
    name: 'default',
    types: [{
      name: 'post', type: 'document',
      fields: [{ name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }],
    }],
  });
  const blockType = schema.get('post').fields.find((f) => f.name === 'body').type;

  // ---- image upload (cached by URL so we never upload the same asset twice) ----
  const assetCache = new Map();
  async function uploadImage(url) {
    if (!url || !url.startsWith('http')) return null;
    if (assetCache.has(url)) return assetCache.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const asset = await client.assets.upload('image', buf, { filename: url.split('/').pop()?.split('?')[0] });
      assetCache.set(url, asset._id);
      return asset._id;
    } catch (e) {
      console.warn(`  ⚠ image upload failed (${url.slice(0, 50)}…): ${e.message}`);
      assetCache.set(url, null);
      return null;
    }
  }

  // author cache → reference
  const authorCache = new Map();
  async function ensureAuthor(name, role, about, avatarUrl) {
    name = (name || '').trim();
    if (!name) return null;
    if (authorCache.has(name)) return authorCache.get(name);
    const _id = slugifyId('author', name.toLowerCase());
    const avatarAsset = await uploadImage(avatarUrl);
    await client.createOrReplace({
      _id, _type: 'author', name,
      role: (role || '').trim() || undefined,
      about: (about || '').trim() || undefined,
      ...(avatarAsset ? { avatar: { _type: 'image', asset: { _type: 'reference', _ref: avatarAsset } } } : {}),
    });
    authorCache.set(name, _id);
    return _id;
  }

  const toImport = rows.slice(0, LIMIT);
  if (LIMIT !== Infinity) console.log(`(--limit=${LIMIT}) importing first ${toImport.length} rows only`);
  let ok = 0, fail = 0;
  for (const r of toImport) {
    const slug = (r['Slug'] || '').trim();
    if (!slug) { fail++; continue; }
    try {
      const html = r['Content'] || '';
      // Pre-upload every inline image, map url -> assetId for the deserialize rule.
      const dom0 = new JSDOM(html);
      const inlineUrls = [...dom0.window.document.querySelectorAll('img')].map((i) => i.src).filter(Boolean);
      const urlToAsset = new Map();
      for (const u of inlineUrls) urlToAsset.set(u, await uploadImage(u));

      const body = htmlToBlocks(html, blockType, {
        parseHtml: (h) => new JSDOM(h).window.document,
        rules: [{
          deserialize(node, next, block) {
            if (node.tagName?.toLowerCase() !== 'img') return undefined;
            const ref = urlToAsset.get(node.src);
            if (!ref) return undefined;
            return block({ _type: 'image', asset: { _type: 'reference', _ref: ref } });
          },
        }],
      });

      const heroUrl = (r['Hero'] || '').startsWith('http') ? r['Hero'] : DEFAULT_COVER_URL;
      const heroAsset = await uploadImage(heroUrl);
      const authorRef = await ensureAuthor(r['Author Names'], r['Author Roles'], r['Author About'], r['Author Avatar']);
      const draft = isTrue(r[':draft']);

      const doc = {
        _id: slugifyId(draft ? 'drafts.post' : 'post', slug),
        _type: 'post',
        title: (r['Title'] || '').trim(),
        slug: { _type: 'slug', current: slug }, // VERBATIM
        category: (r['Category'] || 'Blog').trim(),
        featured: isTrue(r['Featured']),
        excerpt: (r['Short Description'] || '').trim() || undefined,
        readingTime: parseReadingTime(r['Reading time']),
        publishedAt: parseDate(r['Date']),
        body,
        ...(heroAsset ? { hero: { _type: 'image', asset: { _type: 'reference', _ref: heroAsset }, alt: (r['Hero:alt'] || '').trim() || undefined } } : {}),
        ...(authorRef ? { author: { _type: 'reference', _ref: authorRef } } : {}),
      };

      await client.createOrReplace(doc);
      ok++;
      if (ok % 20 === 0) console.log(`  imported ${ok}…`);
    } catch (e) {
      fail++;
      console.warn(`  ✗ ${slug}: ${e.message}`);
    }
  }

  console.log(`\nDone. Imported ${ok}, failed ${fail}. Images uploaded: ${[...assetCache.values()].filter(Boolean).length}`);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
