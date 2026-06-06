// Generate on-brand line-isometric cover images (house style C) for blog posts
// that have no hero, and attach them to the post in Sanity. Idempotent: only
// touches posts where hero is missing. Keys read from .env files (never hardcoded).
//
//   node scripts/gen-blog-covers.mjs --limit 3      # validate on a few first
//   node scripts/gen-blog-covers.mjs                # full run (all cover-less)
//   node scripts/gen-blog-covers.mjs --dry          # list targets, no gen/upload
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

function readEnv(name) {
  for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env'), resolve(ROOT, '../.env')]) {
    try {
      const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return null;
}

const OPENAI_KEY = readEnv('OPENAI_API_KEY');
const projectId = readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = readEnv('NEXT_PUBLIC_SANITY_DATASET') || 'production';
const token = readEnv('SANITY_API_WRITE_TOKEN');
if (!OPENAI_KEY) { console.error('OPENAI_API_KEY missing — stop.'); process.exit(1); }
if (!projectId || !token) { console.error('Sanity projectId / write token missing — stop.'); process.exit(1); }

const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > -1 ? Number(process.argv[i + 1]) : Infinity; })();
const DRY = process.argv.includes('--dry');

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

// --- topic → line-art motif (keeps each cover relevant, not identical) -----
const MOTIFS = [
  [/invoice|billing|accounts payable|reconcil|ledger|expense/i, 'invoices and ledger sheets flowing through connected processing nodes'],
  [/legal|contract|due diligence|clause|law firm|litigation/i, 'legal contracts and folders moving through review nodes'],
  [/complian|hipaa|soc ?2|audit|regulat|kyc|aml|adv form|fiduciary risk/i, 'a shield and a checklist linked to document-processing nodes'],
  [/lead|sales|crm|outbound|prospect|pipeline|revenue/i, 'contact cards flowing through a funnel of connected nodes'],
  [/hoa|reserve study|property|real estate/i, 'building blueprints and property reports through analysis nodes'],
  [/tax|cpa|\bria\b|wealth|advisor|accounting/i, 'tax forms and financial statements organised through automated nodes'],
  [/health|clinical|patient|medical|pharma|life scien/i, 'secure medical record documents through processing nodes'],
  [/ecommerce|cart|retention|d2c|shopify|order|customer support/i, 'order and cart icons flowing through automation nodes'],
  [/marketing|content|email|seo|newsletter|blog/i, 'content and email documents along a publishing pipeline'],
  [/image|gemini|nano banana|generat|creative/i, 'image frames produced along a creative pipeline'],
  [/insurance|claim|underwrit/i, 'insurance claim documents routed through triage nodes'],
  [/integrat|data|api|sync|warehouse|etl/i, 'data records syncing across connected system nodes'],
];
function motifFor(title = '', category = '') {
  const hay = `${title} ${category}`;
  for (const [re, motif] of MOTIFS) if (re.test(hay)) return motif;
  return 'business documents and data flowing through interconnected automation nodes';
}
const STYLE =
  'Minimal editorial line illustration. Fine monochrome charcoal (#1A1A17) linework on warm off-white paper (#FBFAF7), ' +
  'with a SINGLE forest-green (#2F6B3A) accent element. Light isometric depth, generous negative space, thin consistent strokes. ' +
  'CRITICAL: render absolutely NO words, letters, numbers, labels or symbols anywhere — every document, page or surface must be blank ' +
  'or show only abstract horizontal line-marks, never real text. No logos, watermarks, UI, or people. No glowing neon, no robots, no brains. ' +
  'Premium, restrained, editorial. 16:9 wide.';

async function genImage(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1, quality: 'medium' }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('no image in OpenAI response');
  return Buffer.from(b64, 'base64');
}

const posts = await client.fetch(
  `*[_type == "post" && !defined(hero.asset)] | order(publishedAt desc){ _id, "slug": slug.current, title, category }`
);
console.log(`${posts.length} posts without a cover. Processing ${Math.min(posts.length, LIMIT)}.\n`);

let done = 0;
for (const p of posts) {
  if (done >= LIMIT) break;
  const motif = motifFor(p.title, p.category);
  if (DRY) { console.log(`· ${p.slug}\n    motif: ${motif}`); done++; continue; }
  try {
    const buf = await genImage(`${STYLE} Subject: ${motif}.`);
    const asset = await client.assets.upload('image', buf, { filename: `${p.slug}-cover.png`, contentType: 'image/png' });
    const alt = `Abstract line illustration representing ${p.title}`;
    await client.patch(p._id).set({ hero: { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt } }).commit();
    done++;
    console.log(`✓ [${done}] ${p.slug}`);
  } catch (e) {
    console.error(`✗ ${p.slug}: ${e.message}`);
  }
}
console.log(`\nDone. Attached ${done} cover(s).`);
