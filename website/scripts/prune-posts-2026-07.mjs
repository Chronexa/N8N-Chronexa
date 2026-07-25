/**
 * Prune 9 dead blog posts (0 impressions in 90 days, >45 days old) — SEO strategy v2 cull.
 * Approved by Ankit 2026-07-25. Deletes published + draft versions in Sanity.
 * 301 redirects for these slugs are added separately in next.config.ts.
 *
 * Run: node scripts/prune-posts-2026-07.mjs          (dry run)
 *      FIX=1 node scripts/prune-posts-2026-07.mjs    (delete)
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const SLUGS = [
  'fixing-the-legal-operations-nightmare-with-ai-workflows',
  'build-vs-buy-vs-productized-service-fintech-kyc-automation-decision-guide',
  'how-fintech-companies-cut-kyc-processing-time-from-14-days-to-2-days',
  'how-to-automate-legal-document-processing-without-losing-control',
  'legal-tech-automation-12-n8n-workflows-for-law-firms',
  'custom-mcp-servers-claude-private-data',
  'ai-document-processing-why-95-cost-reduction-requires-production-infrastructure',
  'ai-powered-ma-due-diligence-case-study',
  'build-vs-buy-ai-automation-costs',
];

const FIX = process.env.FIX === '1';
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = await c.fetch(
  `*[_type=="post" && slug.current in $slugs]{ _id, "slug": slug.current, title }`,
  { slugs: SLUGS }
);
console.log(`Matched ${docs.length} documents (published + drafts) for ${SLUGS.length} slugs:`);
for (const d of docs) console.log(`  ${FIX ? 'DELETING' : 'would delete'}: ${d._id}  (${d.slug})`);

const missing = SLUGS.filter(s => !docs.some(d => d.slug === s));
if (missing.length) console.log('\nNot found (already gone?):', missing.join(', '));

if (FIX) {
  const tx = c.transaction();
  for (const d of docs) tx.delete(d._id);
  await tx.commit();
  console.log(`\n✓ Deleted ${docs.length} documents. Sitemap will drop them on next revalidate (1h).`);
} else {
  console.log('\nDRY RUN — run with FIX=1 to delete.');
}
