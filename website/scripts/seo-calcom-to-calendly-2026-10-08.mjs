// Points every cal.com booking link inside Sanity content at the sitewide Calendly link
// (lib/site.ts `booking`). The article renderer appends utm_source/utm_content=<post path>,
// so a booking from an in-text link now records which post produced it; cal.com bookings never did.
//   node scripts/seo-calcom-to-calendly-2026-10-08.mjs            # dry run
//   node scripts/seo-calcom-to-calendly-2026-10-08.mjs --apply
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } return null; };
const client = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const APPLY = process.argv.includes('--apply');
const BACKUP = process.env.BACKUP_DIR || resolve(ROOT, 'tmp/seo-backups-calcom');
if (APPLY) mkdirSync(BACKUP, { recursive: true });
const BOOKING = 'https://calendly.com/ankit-chronexa/30min';
const FIELDS = ['body', 'content1', 'content2', 'technicalContent'];
const isCal = (h) => { try { const u = new URL(h); return /^(www\.)?cal\.com$/.test(u.hostname); } catch { return false; } };
const docs = await client.fetch(`*[_type in ["post","caseStudy"] && !(_id in path("drafts.**"))]{ _id, _type, "slug": slug.current, body, content1, content2, technicalContent }`);
let links = 0, patched = 0;
for (const d of docs) {
  const patch = {};
  for (const f of FIELDS) {
    if (!Array.isArray(d[f])) continue;
    let changed = false;
    const out = d[f].map((b) => {
      if (b?._type === 'htmlTable' && /cal\.com/.test(b.html || '')) { changed = true; links++; return { ...b, html: b.html.replace(/https?:\/\/(www\.)?cal\.com\/[^"'\s<)]*/g, BOOKING) }; }
      if (b?._type !== 'block' || !b.markDefs?.some((m) => m._type === 'link' && isCal(m.href))) return b;
      changed = true;
      return { ...b, markDefs: b.markDefs.map((m) => (m._type === 'link' && isCal(m.href) ? (links++, { ...m, href: BOOKING }) : m)) };
    });
    if (changed) patch[f] = out;
  }
  if (Object.keys(patch).length) {
    patched++;
    if (APPLY) { writeFileSync(resolve(BACKUP, `${d._type}-${d.slug}.json`), JSON.stringify(await client.getDocument(d._id))); await client.patch(d._id).set(patch).commit(); }
  }
}
console.log(`${APPLY ? 'Patched' : 'Would patch'} ${patched} documents, ${links} cal.com links → Calendly.`);
