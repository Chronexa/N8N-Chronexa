// Second pass of the 2026-10-08 SEO cleanup: in-body links that still go through a redirect.
// Resolves every internal link target against the live site (following redirects), then
//   - rewrites the link to its final live URL when that is a real page, or
//   - unwraps the link (keeps the text) when it only ever lands on /blog or a 404.
// Covers blog posts and case studies. Idempotent.
//   node scripts/seo-link-hops-2026-10-08.mjs            # dry run
//   node scripts/seo-link-hops-2026-10-08.mjs --apply
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } return null; };
const client = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const APPLY = process.argv.includes('--apply');
const BACKUP = process.env.BACKUP_DIR || resolve(ROOT, 'tmp/seo-backups-2026-10-08-hops');
if (APPLY) mkdirSync(BACKUP, { recursive: true });
const SITE = 'https://chronexa.io';
const FIELDS = ['body', 'content1', 'content2', 'technicalContent'];

// Pages merged in this cleanup are not redirecting on production yet; resolve them locally.
const MERGED = {
  '/blog/blog-top-automation-agencies-uae-dubai': '/blog/top-ai-automation-agencies-b2b-saas-2026',
  '/blog/make-vs-n8n-vs-zapier': '/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams',
  '/blog/what-is-hyperautomation': '/what-is-ai-automation',
  '/blog/what-is-intelligent-automation': '/what-is-ai-automation',
  '/blog/what-is-workflow-automation': '/what-is-ai-automation',
  '/blog/ai-automation-company-for-cpa-firms': '/cpa-tax-document-automation',
  '/blog/tax-document-automation-workflow-cpa-firms': '/cpa-tax-document-automation',
};
// Old flat slugs that production still 308s through a retired page; land on the live replacement.
const PAGE_OVERRIDE = { '/n8n-automation-services': '/ai-automation-agency', '/ai-automation': '/ai-automation' };

const cache = new Map();
async function resolvePath(path) {
  if (cache.has(path)) return cache.get(path);
  let cur = MERGED[path] || PAGE_OVERRIDE[path] || path;
  let result;
  for (let i = 0; i < 6; i++) {
    if (MERGED[cur]) { cur = MERGED[cur]; continue; }
    if (PAGE_OVERRIDE[cur] && PAGE_OVERRIDE[cur] !== cur) { cur = PAGE_OVERRIDE[cur]; continue; }
    const r = await fetch(SITE + cur, { redirect: 'manual', method: 'GET' });
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get('location') || '';
      cur = new URL(loc, SITE).pathname;
      continue;
    }
    result = r.status === 200 ? { kind: 'live', to: cur } : { kind: 'dead' };
    break;
  }
  result ||= { kind: 'dead' };
  if (result.kind === 'live' && /^\/blog\/?$/.test(result.to)) result = { kind: 'dead' }; // lands on the index only: drop the link
  cache.set(path, result);
  return result;
}
const internalPath = (href) => {
  try { const u = new URL(href, SITE); if (!/^(www\.)?chronexa\.io$/.test(u.hostname)) return null; return { path: u.pathname.replace(/\/$/, '') || '/', tail: `${u.search}${u.hash}` }; } catch { return null; }
};

const docs = await client.fetch(`*[_type in ["post","caseStudy"] && !(_id in path("drafts.**"))]{ _id, _type, "slug": slug.current, body, content1, content2, technicalContent }`);
let rewrites = 0, unwraps = 0, patched = 0;

for (const d of docs) {
  if (MERGED[`/blog/${d.slug}`]) continue; // merged posts now 301; nothing to maintain
  const patch = {};
  for (const f of FIELDS) {
    if (!Array.isArray(d[f])) continue;
    let changed = false;
    const blocks = [];
    for (const b of d[f]) {
      if (b?._type !== 'block' || !b.markDefs?.length) { blocks.push(b); continue; }
      const drop = new Set(); let ch = false;
      const markDefs = [];
      for (const m of b.markDefs) {
        const ip = m._type === 'link' ? internalPath(m.href) : null;
        if (!ip || ip.path === '/' ) { markDefs.push(m); continue; }
        const r = await resolvePath(ip.path);
        if (r.kind === 'live' && r.to === ip.path && m.href.startsWith('/')) { markDefs.push(m); continue; }       // already clean
        if (r.kind === 'live' && r.to === ip.path) { markDefs.push(m); continue; }                                // absolute but live: leave
        if (r.kind === 'live') { console.log(`  rewrite ${m.href} → ${r.to}  [${d._type}:${d.slug}]`); rewrites++; ch = true; markDefs.push({ ...m, href: `${r.to}${ip.tail}` }); }
        else { console.log(`  unwrap  ${m.href}  (lands on /blog or 404)  [${d._type}:${d.slug}]`); unwraps++; ch = true; drop.add(m._key); }
      }
      if (!ch) { blocks.push(b); continue; }
      changed = true;
      blocks.push({ ...b, markDefs, children: (b.children || []).map((c) => ({ ...c, marks: (c.marks || []).filter((k) => !drop.has(k)) })) });
    }
    if (changed) patch[f] = blocks;
  }
  if (Object.keys(patch).length) {
    patched++;
    if (APPLY) {
      writeFileSync(resolve(BACKUP, `${d._type}-${d.slug}.json`), JSON.stringify(await client.getDocument(d._id), null, 1));
      await client.patch(d._id).set(patch).commit();
    }
  }
}
console.log(`\n${APPLY ? 'Patched' : 'Would patch'} ${patched} documents: ${rewrites} rewrites, ${unwraps} unwraps.`);
