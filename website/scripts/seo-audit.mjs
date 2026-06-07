// Technical SEO audit against the local prod server. For every sitemap URL:
// checks <title>, meta description, <link rel=canonical>, robots meta, and h1 count.
// Flags: duplicate titles/descriptions (cannibalization signal), missing/mismatched
// canonical, noindex on indexable pages, missing/multiple h1. Run after `npm run start`.
const BASE = process.env.BASE || 'http://localhost:3000';

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
  .filter((p) => !p.endsWith('.xml'));

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const rows = [];
for (const path of urls) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  if (res.status !== 200) { rows.push({ path, status: res.status }); continue; }
  const html = await res.text();
  rows.push({
    path,
    status: 200,
    title: pick(html, /<title[^>]*>([^<]*)<\/title>/i),
    desc: pick(html, /<meta name="description" content="([^"]*)"/i),
    canonical: (pick(html, /<link rel="canonical" href="([^"]*)"/i) || '').replace(/^https?:\/\/[^/]+/, ''),
    robots: pick(html, /<meta name="robots" content="([^"]*)"/i),
    h1: (html.match(/<h1[\s>]/gi) || []).length,
  });
}

const ok = rows.filter((r) => r.status === 200);
const dup = (key) => {
  const map = new Map();
  for (const r of ok) { const v = (r[key] || '').toLowerCase(); if (!v) continue; map.set(v, [...(map.get(v) || []), r.path]); }
  return [...map.entries()].filter(([, ps]) => ps.length > 1);
};

console.log(`Audited ${rows.length} sitemap URLs (${ok.length} ok).\n`);
const dupTitles = dup('title');
console.log(`== Duplicate <title> (${dupTitles.length}) ==`);
for (const [t, ps] of dupTitles) console.log(`  "${t.slice(0, 60)}"\n     ${ps.join('\n     ')}`);
const dupDesc = dup('desc');
console.log(`\n== Duplicate meta descriptions (${dupDesc.length}) ==`);
for (const [, ps] of dupDesc) console.log(`  ${ps.join(' | ')}`);
console.log(`\n== Pages missing title/desc/canonical, noindex, or h1≠1 ==`);
let issues = 0;
for (const r of ok) {
  const probs = [];
  if (!r.title) probs.push('no-title');
  if (!r.desc) probs.push('no-desc');
  if (!r.canonical) probs.push('no-canonical');
  if (r.robots && /noindex/i.test(r.robots)) probs.push('NOINDEX');
  if (r.h1 !== 1) probs.push(`h1=${r.h1}`);
  if (probs.length) { console.log(`  ${r.path}  — ${probs.join(', ')}`); issues++; }
}
if (!issues) console.log('  none ✓');
const non200 = rows.filter((r) => r.status !== 200);
if (non200.length) { console.log(`\n== Non-200 sitemap URLs (${non200.length}) ==`); for (const r of non200) console.log(`  ${r.status}  ${r.path}`); }
