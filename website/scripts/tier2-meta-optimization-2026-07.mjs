/**
 * Tier-2 meta/CTR optimization (2026-07-25) — 17 on-strategy posts with real impressions.
 * Rewrites metaTitle/metaDescription toward each post's Backlog keyword, strips unverifiable
 * fabricated stats from SERP display (10x, 80%, $2.4M, 521%, AED ranges…), keeps real numbers
 * (our own pricing, the industry-cited $16/invoice, FINRA NIGO rates from the wealth research).
 * Bodies untouched except how-to-choose (adds its missing service-page link).
 *
 * Run: node scripts/tier2-meta-optimization-2026-07.mjs        (dry run)
 *      FIX=1 node scripts/tier2-meta-optimization-2026-07.mjs  (apply)
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

const METAS = {
  'ai-automation-agency-pricing-what-you-get': {
    metaTitle: 'AI Automation Agency Pricing: What Each Tier Buys (2026)',
    metaDescription: 'What $10K, $50K and $150K actually buy from an AI automation agency — line-item breakdowns and the questions that expose a padded quote.',
  },
  'fintech-automation-with-n8n-8-workflows-for-compliance-teams': {
    metaTitle: 'Fintech Compliance Automation: 8 Production Workflows',
    metaDescription: 'Eight compliance workflows fintech teams actually automate — KYC checks, risk scoring, audit trails — and what each takes to run in production.',
  },
  'document-automation-tools-for-regulated-industries': {
    metaTitle: 'Document Automation Tools for Regulated Industries',
    metaDescription: 'Which document automation tools hold up under compliance — and where firms in finance, legal and accounting still need a custom layer on top.',
  },
  'ai-agent-platforms-uae-guide': {
    metaTitle: 'AI Agent Platforms for UAE Businesses: 2026 Guide',
    metaDescription: 'How UAE businesses choose AI agent platforms: data residency, Arabic support, DIFC and mainland compliance, and where custom beats off-the-shelf.',
  },
  'best-ai-agent-platforms-wealth-management-uae': {
    metaTitle: 'Best AI Agent Platforms for Wealth Management in UAE',
    metaDescription: 'Comparing AI agent platforms for UAE wealth managers — SCA compliance, data residency, onboarding automation — and when a custom build wins.',
  },
  'client-onboarding-automation-ria-custom-workflows': {
    metaTitle: 'RIA Client Onboarding Automation: Why Custom Wins',
    metaDescription: 'Off-the-shelf CRM onboarding can’t handle RIA complexity — custodian forms, KYC, suitability. How custom workflows compress weeks into days.',
  },
  'client-onboarding-automation-uae-wealth-managers': {
    metaTitle: 'Client Onboarding Automation for UAE Wealth Managers',
    metaDescription: 'How DIFC and ADGM wealth managers automate onboarding — KYC, source-of-wealth checks, document collection — without breaking compliance.',
  },
  'why-advisor-client-transfer-paperwork-gets-rejected': {
    metaTitle: 'Why ACAT Transfer Paperwork Gets Rejected — the Fix',
    metaDescription: 'FINRA data shows double-digit NIGO rejection rates on account transfers. The real causes — and the intake automation that prevents them.',
  },
  'ai-contract-review-software-law-firms-roi-compliance': {
    metaTitle: 'AI Contract Review Software for Law Firms: ROI & Risk',
    metaDescription: 'How mid-market law firms evaluate AI contract review software: where the ROI actually comes from, and the confidentiality bar it must clear.',
  },
  'tax-document-automation-workflow-cpa-firms': {
    metaTitle: 'Tax Document Automation Workflow for CPA Firms',
    metaDescription: 'The document workflow that eats CPA staff hours — collection, validation, filing — and how firms automate it without changing tax software.',
  },
  'ai-tax-automation-cost-for-cpa-firms': {
    metaTitle: 'AI Tax Automation Cost for CPA Firms (2026 Guide)',
    metaDescription: 'What AI tax automation actually costs a CPA firm, what drives the price, and how to judge ROI before signing anything.',
  },
  'account-reconciliation-automation-custom-ai-workflows': {
    metaTitle: 'Account Reconciliation Automation for Accounting Firms',
    metaDescription: 'How accounting firms automate client reconciliation — matching, exceptions, close checklists — with staff reviewing instead of keying.',
  },
  'legal-matter-intake-automation-law-firms': {
    metaTitle: 'Legal Matter Intake Automation for Law Firms',
    metaDescription: 'Manual intake loses billable hours and conflict-check control. How matter intake automation feeds your practice platform, every step logged.',
  },
  'reduce-kyc-processing-cost-ai-automation': {
    metaTitle: 'Cut KYC Processing Costs with Agentic AI Workflows',
    metaDescription: 'Where KYC costs actually sit — manual review, document checks, re-verification — and how agentic workflows cut them with audit trails intact.',
  },
  'legal-billing-automation-eliminate-revenue-leakage-save-20-hours-month': {
    metaTitle: 'Legal Billing Automation: Stop Revenue Leakage',
    metaDescription: 'Unlogged time is unbilled revenue. How passive time capture and billing automation recover hours your firm already worked.',
  },
  'manual-invoice-processing-cost-per-invoice-automation': {
    metaTitle: 'Manual Invoice Processing Cost: The $16-Per-Invoice Math',
    metaDescription: 'Why manual invoice processing costs about $16 each once labor, errors and late fees are counted — and when automation pays for itself.',
  },
  'how-to-choose-ai-automation-agency-regulated-industries': {
    metaTitle: 'How to Choose an AI Automation Agency (Regulated Firms)',
    metaDescription: 'The vetting questions that separate a real automation partner from a reseller — data residency, audit trails, §7216, exit terms.',
  },
};

// the one post with zero service-page links gets a closing link paragraph
const LINK_PARA = {
  slug: 'how-to-choose-ai-automation-agency-regulated-industries',
  block: {
    _key: 'tier2-svc-link-1',
    _type: 'block',
    style: 'normal',
    markDefs: [
      { _key: 'tier2l1', _type: 'link', href: '/secure-ai-deployment' },
      { _key: 'tier2l2', _type: 'link', href: '/blog/ai-automation-company-for-cpa-firms' },
    ],
    children: [
      { _key: 'tier2s1', _type: 'span', marks: [], text: 'Whichever agency you shortlist, hold them to the deployment standard first: client data on infrastructure you control, with audit logging — our own bar is documented in ' },
      { _key: 'tier2s2', _type: 'span', marks: ['tier2l1'], text: 'secure & compliant AI deployment' },
      { _key: 'tier2s3', _type: 'span', marks: [], text: '. If you run an accounting practice specifically, the ' },
      { _key: 'tier2s4', _type: 'span', marks: ['tier2l2'], text: 'CPA-firm field guide to choosing an AI automation company' },
      { _key: 'tier2s5', _type: 'span', marks: [], text: ' walks the same diligence in your vocabulary.' },
    ],
  },
};

const slugs = Object.keys(METAS);
const docs = await c.fetch(`*[_type=="post" && !(_id in path("drafts.**")) && slug.current in $slugs]{_id, "slug": slug.current}`, { slugs });
console.log(`Matched ${docs.length}/${slugs.length} posts`);
for (const d of docs) {
  const m = METAS[d.slug];
  console.log(`  ${FIX ? 'PATCH' : 'would patch'} ${d.slug}`);
  console.log(`    MT(${m.metaTitle.length}): ${m.metaTitle}`);
  console.log(`    MD(${m.metaDescription.length}): ${m.metaDescription}`);
  if (m.metaTitle.length > 62 || m.metaDescription.length > 155) { console.log('    ✗ LENGTH FAIL'); process.exit(1); }
  if (FIX) {
    let patch = c.patch(d._id).set(m);
    await patch.commit();
    if (d.slug === LINK_PARA.slug) {
      const has = await c.fetch(`*[_id==$id][0]{"has": count(body[_key=="tier2-svc-link-1"]) > 0}`, { id: d._id });
      if (!has.has) await c.patch(d._id).insert('after', 'body[-1]', [LINK_PARA.block]).commit();
      console.log('    + service-link paragraph appended');
    }
  }
}
console.log(FIX ? '\nDONE.' : '\nDRY RUN — FIX=1 to apply.');
