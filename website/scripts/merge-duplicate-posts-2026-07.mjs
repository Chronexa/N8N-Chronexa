/**
 * SEO v2 Phase 3 — duplicate-post consolidation (2026-07-25).
 * Deletes the 4 losers (lower GSC position of each duplicate pair); 301s added in next.config.ts.
 *   ai-for-wealth-management-build-vs-buy (38 impr, pos 10.1)  → off-the-shelf-ai-vs-custom-workflows-ria-build-vs-buy-guide (46, pos 8.4)
 *   custom-ai-agents-vs-off-the-shelf-professional-services (3, pos 22) → same survivor
 *   ria-client-onboarding-automation-compliance (41, pos 11.4) → client-onboarding-automation-ria-custom-workflows (117, pos 7.2)
 *   n8n-workflows-cpa-firms-document-collection-deadline (8, dev-framed) → tax-document-collection-automation-cpa-firms (new P9 post)
 *
 * Run: node scripts/merge-duplicate-posts-2026-07.mjs         (dry run)
 *      FIX=1 node scripts/merge-duplicate-posts-2026-07.mjs   (delete)
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const SLUGS = [
  'ai-for-wealth-management-build-vs-buy',
  'custom-ai-agents-vs-off-the-shelf-professional-services',
  'ria-client-onboarding-automation-compliance',
  'n8n-workflows-cpa-firms-document-collection-deadline',
];
const FIX = process.env.FIX === '1';
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = await c.fetch(`*[_type=="post" && slug.current in $slugs]{_id, "slug": slug.current}`, { slugs: SLUGS });
console.log(`Matched ${docs.length} docs for ${SLUGS.length} slugs:`);
for (const d of docs) console.log(`  ${FIX ? 'DELETING' : 'would delete'}: ${d._id}`);
if (FIX) {
  const tx = c.transaction();
  for (const d of docs) tx.delete(d._id);
  await tx.commit();
  console.log('✓ deleted');
} else console.log('DRY RUN — FIX=1 to delete.');
