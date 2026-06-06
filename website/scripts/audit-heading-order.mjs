// Audit every blog post for heading-order violations (a11y / axe rule).
// Page renders <h1>{title}</h1> then the PortableText body, so the global
// heading sequence is [1, ...body heading levels]. A violation = descending
// skip (e.g. 1→3, or 2→4). Going back up a level is allowed.
import 'dotenv/config';
import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: true });

const posts = await client.fetch(
  `*[_type == "post"]{ "slug": slug.current, title, body }`
);

const levelOf = (b) => {
  if (b?._type !== 'block') return null;
  const m = /^h([1-6])$/.exec(b.style || '');
  return m ? Number(m[1]) : null;
};

const offenders = [];
for (const p of posts) {
  const bodyLevels = (p.body || []).map(levelOf).filter((x) => x !== null);
  const seq = [1, ...bodyLevels]; // 1 = the page <h1> title
  const issues = [];
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] > seq[i - 1] + 1) issues.push(`h${seq[i - 1]}→h${seq[i]}`);
  }
  // also flag a body that opens directly at h3+ (the common imported case)
  if (bodyLevels.length && bodyLevels[0] >= 3 && !issues.length) {
    issues.push(`opens at h${bodyLevels[0]} (skips h2)`);
  }
  if (issues.length) {
    offenders.push({ slug: p.slug, title: p.title, firstBody: bodyLevels[0] ?? '—', issues });
  }
}

console.log(`\nScanned ${posts.length} posts. ${offenders.length} with heading-order issues:\n`);
for (const o of offenders) {
  console.log(`• ${o.slug}`);
  console.log(`    "${(o.title || '').slice(0, 70)}"`);
  console.log(`    first body heading: h${o.firstBody} | skips: ${o.issues.join(', ')}`);
}
// distribution of each post's first body heading level
const dist = {};
for (const p of posts) {
  const first = (p.body || []).map(levelOf).filter((x) => x !== null)[0] ?? 'none';
  dist[first] = (dist[first] || 0) + 1;
}
console.log('\nFirst-body-heading distribution:', JSON.stringify(dist));
