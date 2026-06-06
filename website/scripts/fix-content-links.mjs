// Audit (and optionally fix) links inside blog post bodies (PortableText markDefs).
// Flags: internal /blog/<slug> targets that don't exist, example.com placeholders,
// and chronexa.com / http://chronexa.io (wrong TLD / insecure → https://chronexa.io).
//   node scripts/fix-content-links.mjs --dry
//   node scripts/fix-content-links.mjs --fix
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } return null; };
const client = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const FIX = process.argv.includes('--fix');

const posts = await client.fetch(`*[_type=="post" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current, body }`);
const slugs = new Set(posts.map((p) => p.slug));

// Repoint known dead internal slugs to the closest existing post (better than
// deleting the link — preserves internal-link equity). Unmapped dead links are unwrapped.
const REPOINT = {
  'self-hosting-n8n-architecture-security-and-cost-breakdown': 'what-is-n8n-the-2026-guide-to-open-source-workflow-ai-automation',
};

function classify(href) {
  if (!href) return null;
  let u; try { u = new URL(href, 'https://chronexa.io'); } catch { return null; }
  const isOurHost = /(^|\.)chronexa\.(io|com)$/.test(u.hostname);
  if (u.hostname === 'example.com') return { kind: 'placeholder', fix: null };
  if (isOurHost && (u.protocol === 'http:' || u.hostname === 'chronexa.com')) return { kind: 'bad-domain', fix: `https://chronexa.io${u.pathname}${u.search}` };
  // internal blog link (relative or our host)
  const m = u.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (m && (href.startsWith('/') || isOurHost) && !slugs.has(m[1])) {
    return { kind: 'dead-internal', fix: REPOINT[m[1]] ? `/blog/${REPOINT[m[1]]}` : null };
  }
  return null;
}

let flagged = 0, patched = 0;
for (const p of posts) {
  if (!Array.isArray(p.body)) continue;
  let changed = false;
  const body = p.body.map((block) => {
    if (block?._type !== 'block' || !Array.isArray(block.markDefs) || !block.markDefs.length) return block;
    const removeKeys = new Set();
    let blockChanged = false;
    const markDefs = block.markDefs.map((def) => {
      if (def._type !== 'link') return def;
      const c = classify(def.href);
      if (!c) return def;
      flagged++;
      console.log(`  ${c.kind.padEnd(13)} ${def.href}${c.fix ? `  →  ${c.fix}` : '  (unwrap)'}  [${p.slug}]`);
      blockChanged = true;
      if (c.fix) return { ...def, href: c.fix };          // rewrite in place
      removeKeys.add(def._key);                            // unwrap placeholder / dead link
      return null;
    }).filter(Boolean);
    if (!blockChanged) return block;
    changed = true;
    const children = (block.children || []).map((sp) =>
      sp.marks?.some((k) => removeKeys.has(k)) ? { ...sp, marks: sp.marks.filter((k) => !removeKeys.has(k)) } : sp
    );
    return { ...block, markDefs, children };
  });
  if (changed && FIX) { await client.patch(p._id).set({ body }).commit(); patched++; console.log(`  ✓ patched ${p.slug}`); }
}
console.log(`\n${flagged} problem link(s) across ${posts.length} posts.${FIX ? ` Patched ${patched} post(s).` : ' (dry run — use --fix to apply)'}`);
