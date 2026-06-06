// BFS-crawl the local site and report any internal link that doesn't return 200.
// Also collects external link hosts for a quick sanity list. Usage:
//   node scripts/crawl-links.mjs            (server must be running on :3000)
const BASE = process.env.BASE || 'http://localhost:3000';
const seen = new Set();
const queue = ['/'];
const broken = [];
const external = new Set();
const okPages = [];

const internal = (href) => {
  if (!href) return null;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  try {
    const u = new URL(href, BASE);
    if (u.origin !== BASE) { external.add(u.origin); return null; }
    return u.pathname; // drop hash/query for crawl identity
  } catch { return null; }
};

async function visit(path) {
  if (seen.has(path)) return;
  seen.add(path);
  let res;
  try { res = await fetch(BASE + path, { redirect: 'manual' }); }
  catch (e) { broken.push({ path, status: 'FETCH_ERR ' + e.message }); return; }
  if (res.status >= 400) { broken.push({ path, status: res.status }); return; }
  if (res.status >= 300) { okPages.push(`${path} → ${res.status}`); return; } // redirect, fine
  okPages.push(`${path} (200)`);
  const html = await res.text();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const p = internal(m[1]);
    if (p && !seen.has(p) && !queue.includes(p)) queue.push(p);
  }
}

while (queue.length) {
  const batch = queue.splice(0, 8);
  // eslint-disable-next-line no-await-in-loop
  await Promise.all(batch.map(visit));
}

console.log(`Crawled ${seen.size} internal pages.`);
console.log(`\nExternal hosts linked: ${[...external].join(', ') || '(none)'}`);
if (broken.length) {
  console.log(`\n❌ ${broken.length} BROKEN internal link(s):`);
  for (const b of broken) console.log(`   ${b.status}  ${b.path}`);
  process.exitCode = 1;
} else {
  console.log(`\n✅ No broken internal links — every page returns 200/redirect.`);
}
