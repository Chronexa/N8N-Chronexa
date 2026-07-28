/**
 * Body-optimization batch 3 — legal/document/KYC/pricing (2026-07-25).
 * Audited clean & untouched: ai-contract-review, legal-matter-intake, how-to-choose.
 * Fixes here:
 *  - agency-pricing + fintech posts: in-body H1 → H2, blank filler block removed, junk tail
 *    (wrong byline, stale plaintext related-articles, generic template CTA) removed
 *  - legal-billing + KYC posts: junk tail removed
 *  - document-tools post: two FAQ answers carried fabricated precision (1,013% ROI, $75,695) — rewritten
 *  - method CTA paragraphs appended (billing→leakage calculator; pricing→how-to-choose; KYC→fin-svcs)
 *
 * Run: FIX=1 node scripts/body-batch3-legal-doc-2026-07.mjs
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const FIX = process.env.FIX === '1';
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const span = (k, text, marks = []) => ({ _key: k, _type: 'span', marks, text });
const cta = (kb, parts) => ({
  _key: `${kb}-cta`, _type: 'block', style: 'normal',
  markDefs: parts.filter(p => p.href).map((p, i) => ({ _key: `${kb}-l${i}`, _type: 'link', href: p.href })),
  children: parts.map((p, i) => span(`${kb}-s${i}`, p.text, p.href ? [`${kb}-l${parts.filter(x => x.href).indexOf(p)}`] : [])),
});

const OPS = [
  {
    id: 'post-ai-automation-agency-pricing-what-you-get',
    unsetKeys: ['4b2c3c12cb87', 'daac333cea66', '4be9407836d3', 'a25a01d840da', '775a9e1ea342', '298cc5932a3e', '18140f0d9894', '857aabd7469c', '3011e71479d2'],
    set: { 'body[_key=="a65bca66535b"].style': 'h2', updatedAt: '2026-07-25' },
    appendCta: cta('b3price', [
      { text: 'Pricing only makes sense next to selection criteria — our guide to ' },
      { text: 'choosing an AI automation agency for regulated industries', href: '/blog/how-to-choose-ai-automation-agency-regulated-industries' },
      { text: ' covers the seven questions that expose a padded quote. When you have a number to compare, ' },
      { text: 'book a free 30-minute strategy call', href: 'https://cal.com/chronexa/30min' },
      { text: ' and we will scope yours in writing.' },
    ]),
  },
  {
    id: 'post-fintech-automation-with-n8n-8-workflows-for-compliance-teams',
    unsetKeys: ['4191bc5bad2e', '77bcfdfb52d8', '79879c094811', '7e2299c8e429', 'ff0ba477054d', 'dbe928e764c6', '7c363ac9e3ab', 'ce37dbab663d', '2d3c14e51e30'],
    set: { 'body[_key=="c7d8eb6fd582"].style': 'h2', updatedAt: '2026-07-25' },
    appendCta: cta('b3fin', [
      { text: 'If your compliance team is weighing which of these workflows to automate first, our ' },
      { text: 'financial services automation practice', href: '/financial-services-automation' },
      { text: ' covers the sequencing and the security architecture — or ' },
      { text: 'book a free 30-minute strategy call', href: 'https://cal.com/chronexa/30min' },
      { text: ' to map them to your stack.' },
    ]),
  },
  {
    id: 'post-legal-billing-automation-eliminate-revenue-leakage-save-20-hours-month',
    unsetKeys: ['cf35aa0cc14b', 'dd1031dd0253', 'f89a6cc3f0fc', '32722cf03296', '5f05264d44fb', '1cae3ec5e104', '02beeb233f56', '422e45266ecb'],
    set: { updatedAt: '2026-07-25' },
    appendCta: cta('b3bill', [
      { text: 'Put a number on the leak first: the free ' },
      { text: 'Law Firm Billing Leakage Calculator', href: '/law-firm-billing-leakage-calculator' },
      { text: ' takes two minutes, no email required. The deeper system — passive time capture wired into your billing stack — is covered in ' },
      { text: 'automated time capture & AI billing', href: '/law-firm-automated-time-capture' },
      { text: '.' },
    ]),
  },
  {
    id: 'post-reduce-kyc-processing-cost-ai-automation',
    unsetKeys: ['658e254e5f56', 'cd1876651cfb', 'b15b3b5f5ac0', 'abc8ca35dc5e', 'e8f401926f4d', 'cf681f8ca5b7'],
    set: { updatedAt: '2026-07-25' },
    appendCta: cta('b3kyc', [
      { text: 'KYC is one workflow inside a larger compliance stack — our ' },
      { text: 'financial services automation practice', href: '/financial-services-automation' },
      { text: ' covers how the pieces fit, with audit trails throughout. To scope your document volumes, ' },
      { text: 'book a free 30-minute strategy call', href: 'https://cal.com/chronexa/30min' },
      { text: '.' },
    ]),
  },
  {
    id: 'post-document-automation-tools-for-regulated-industries',
    unsetKeys: [],
    set: {
      updatedAt: '2026-07-25',
      'body[_key=="faq98dcg202"].children': [
        span('b3doc-roi', 'It depends on document volume and how manual the current process is — which is why credible vendors scope against your actual workload instead of quoting a universal ROI figure. Measure your baseline first (hours per engagement on document handling), automate one workflow, and compare the same number a quarter later. Firms with heavy per-engagement document loads typically see payback within the first season.'),
      ],
      'body[_key=="faq9cmzvhc5"].children': [
        span('b3doc-time', 'The savings concentrate in assembly work: gathering, naming, filing and cross-referencing documents before a professional ever reviews them. Firms that automate that layer typically cut preparation time substantially — but the honest way to know your number is to time your current process on three representative engagements and pilot against them.'),
      ],
    },
  },
];

for (const op of OPS) {
  console.log(`\n=== ${op.id}\n  unset ${op.unsetKeys.length} | set ${Object.keys(op.set).length} | CTA: ${op.appendCta ? 'yes' : 'no'}`);
  if (FIX) {
    let patch = c.patch(op.id).set(op.set);
    if (op.unsetKeys.length) patch = patch.unset(op.unsetKeys.map(k => `body[_key=="${k}"]`));
    await patch.commit();
    if (op.appendCta) {
      const has = await c.fetch(`*[_id==$id][0]{"has": count(body[_key==$k]) > 0}`, { id: op.id, k: op.appendCta._key });
      if (!has.has) await c.patch(op.id).insert('after', 'body[-1]', [op.appendCta]).commit();
    }
    console.log('  ✓ patched');
  }
}
console.log(FIX ? '\nDONE — batch 3 applied.' : '\nDRY RUN — FIX=1 to apply.');
