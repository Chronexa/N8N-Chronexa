/**
 * Framer Case Studies CSV → Sanity. Re-hosts images, converts HTML content
 * fields to PortableText, idempotent (deterministic _id). See import-blogs.mjs.
 *
 *   node scripts/import-case-studies.mjs --dry-run
 *   node scripts/import-case-studies.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config as dotenv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
dotenv({ path: resolve(ROOT, '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const CSV_PATH = resolve(ROOT, 'Framer Exports', 'Framer-Case Studies (1).csv');
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const idFor = (slug) => `caseStudy-${slug.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 120)}`;
const clean = (v) => (v || '').trim();

async function main() {
  const { parse } = await import('csv-parse/sync');
  const rows = parse(readFileSync(CSV_PATH, 'utf8'), { columns: true, skip_empty_lines: true });
  console.log(`Parsed ${rows.length} case studies from ${CSV_PATH}`);

  if (DRY_RUN) {
    for (const r of rows.slice(0, 3)) {
      console.log({ slug: r.Slug, title: r.Title, company: r['Company Name'], stats: [r['Significant Number 1'], r['Significant Number 2']] });
    }
    console.log('Dry run OK.');
    return;
  }
  if (!PROJECT_ID || !TOKEN) { console.error('✗ Missing Sanity env'); process.exit(1); }

  const { createClient } = await import('@sanity/client');
  const { htmlToBlocks } = await import('@sanity/block-tools');
  const { Schema } = await import('@sanity/schema');
  const { JSDOM } = await import('jsdom');
  const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2024-01-01', useCdn: false });

  const schema = Schema.compile({ name: 'd', types: [{ name: 'cs', type: 'document', fields: [{ name: 'b', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }] }] });
  const blockType = schema.get('cs').fields.find((f) => f.name === 'b').type;

  const assetCache = new Map();
  async function upload(url) {
    if (!url || !url.startsWith('http')) return null;
    if (assetCache.has(url)) return assetCache.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), { filename: url.split('/').pop()?.split('?')[0] });
      assetCache.set(url, asset._id); return asset._id;
    } catch (e) { console.warn(`  ⚠ image ${url.slice(0, 50)}…: ${e.message}`); assetCache.set(url, null); return null; }
  }
  const imgRef = (id, alt) => (id ? { _type: 'image', asset: { _type: 'reference', _ref: id }, ...(alt ? { alt } : {}) } : undefined);

  async function toBlocks(html) {
    if (!clean(html)) return undefined;
    const urls = [...new JSDOM(html).window.document.querySelectorAll('img')].map((i) => i.src).filter(Boolean);
    const map = new Map();
    for (const u of urls) map.set(u, await upload(u));
    return htmlToBlocks(html, blockType, {
      parseHtml: (h) => new JSDOM(h).window.document,
      rules: [{ deserialize(node, next, block) { if (node.tagName?.toLowerCase() !== 'img') return undefined; const ref = map.get(node.src); return ref ? block({ _type: 'image', asset: { _type: 'reference', _ref: ref } }) : undefined; } }],
    });
  }

  let ok = 0, fail = 0;
  for (const r of rows) {
    const slug = clean(r.Slug);
    if (!slug) { fail++; continue; }
    try {
      const [thumb, logo, clientImg] = await Promise.all([upload(r.Thumb), upload(r.Logo), upload(r['Client Image'])]);
      const doc = {
        _id: idFor(slug), _type: 'caseStudy',
        title: clean(r.Title), slug: { _type: 'slug', current: slug },
        thumb: imgRef(thumb, clean(r['Thumb:alt'])), logo: imgRef(logo, clean(r['Logo:alt'])),
        overview: clean(r.Overview) || undefined,
        projectType: clean(r['Project Type']) || undefined,
        serviceIncluded: clean(r['Service Included']) ? clean(r['Service Included']).split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        companyName: clean(r['Company Name']) || undefined,
        year: clean(r.Year) || undefined,
        industry: clean(r.Industry) || undefined,
        websiteName: clean(r['Website Name']) || undefined,
        websiteLink: clean(r['Website Link']) || undefined,
        content1: await toBlocks(r['Content Field 1']),
        content2: await toBlocks(r['Content Field 2']),
        testimonial: clean(r.Testimonial) || undefined,
        client: clean(r.Client) || undefined,
        clientDetails: clean(r['Client Details']) || undefined,
        clientImage: imgRef(clientImg, clean(r['Client Image:alt'])),
        youtubeLink: clean(r['Youtube link (Optional)']) || undefined,
        stat1: clean(r['Significant Number 1']) || undefined,
        stat1Text: clean(r['Significant Number Text 1']) || undefined,
        stat2: clean(r['Significant Number 2']) || undefined,
        stat2Text: clean(r['Significant Number Text 2']) || undefined,
      };
      await client.createOrReplace(doc);
      ok++; console.log(`  ✓ ${slug}`);
    } catch (e) { fail++; console.warn(`  ✗ ${slug}: ${e.message}`); }
  }
  console.log(`\nDone. Imported ${ok}, failed ${fail}.`);
}
main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
