// CTR optimization: set query-matched metaTitle + metaDescription on the
// high-impression / low-CTR posts from GSC (positions 4-12, ~0% CTR). Titles
// kept concise (brand " | Chronexa" suffix is appended by the template);
// descriptions ~150 chars, lead with the winning query + a concrete benefit.
//   node scripts/gsc-ctr-rewrite.mjs --dry   |   --fix
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } };
const c = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const FIX = process.argv.includes('--fix');

const REWRITES = {
  'n8n-ai-agent-node-build-multi-agent-systems-in-2026': {
    metaTitle: 'n8n AI Agent Node: Build Multi-Agent Systems (2026)',
    metaDescription: "Build production multi-agent systems with n8n's AI Agent node. The 2026 technical guide: memory, tools, orchestration, architecture patterns and working examples.",
  },
  'n8n-ai-agents-features-2026-complete-guide': {
    metaTitle: 'n8n AI Agents 2026: Complete Features Guide',
    metaDescription: "Everything new in n8n's AI agents for 2026 — node features, capabilities, memory and tools, and what teams can build. The complete, up-to-date reference guide.",
  },
  'top-ai-automation-agencies-b2b-saas-2026': {
    metaTitle: 'Top 10 AI Automation Agencies for B2B SaaS (2026)',
    metaDescription: 'The 10 best AI automation agencies for B2B SaaS in 2026, compared on pricing, n8n expertise, delivery speed and results — so you can pick the right partner fast.',
  },
  'n8n-vs-zapier-in-2026-cost-ai-features-and-when-to-choose-each': {
    metaTitle: 'n8n vs Zapier 2026: Pricing, AI & Which to Choose',
    metaDescription: 'n8n vs Zapier in 2026, compared on real pricing, AI agent features and self-hosting — with a clear framework for which one fits your team, stack and budget.',
  },
  'ai-automation-agency-pricing-what-you-get': {
    metaTitle: 'AI Automation Agency Pricing 2026: $10K–$150K',
    metaDescription: "What AI automation actually costs in 2026: a transparent breakdown of $10K, $50K and $150K agency engagements — what's included at each tier and how to budget.",
  },
  'what-is-n8n-the-2026-guide-to-open-source-workflow-ai-automation': {
    metaTitle: 'What Is n8n? 2026 Open-Source AI Automation Guide',
    metaDescription: 'What is n8n? A plain-English 2026 guide to the open-source workflow and AI automation platform — how it works, key nodes and integrations, and when to use it.',
  },
  // Redirect target that inherited the "n8n vs zapier" impressions but had no meta
  // (the original rewrite targeted the old, now-redirected slug).
  'n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis': {
    metaTitle: 'n8n vs Zapier 2026: Real Pricing & Cost Analysis',
    metaDescription: 'n8n vs Zapier in 2026: a real cost analysis for enterprise automation — true pricing at scale, AI agents and self-hosting, plus a clear framework for choosing.',
  },
  // Repurposed post (slug still says "sdr-engine"): ranks for document-automation
  // queries but had no meta.
  'blog-ai-sdr-engine-automation-case-study': {
    metaTitle: 'Document Automation Tools for Regulated Industries (2026)',
    metaDescription: 'The best document automation tools for regulated industries in 2026 — HIPAA, SOC 2 and audit-ready workflows for legal, insurance and financial teams, compared.',
  },
};

const slugs = Object.keys(REWRITES);
const posts = await c.fetch(`*[_type=="post" && slug.current in $slugs]{_id,"slug":slug.current}`, { slugs });
console.log(`${posts.length}/${slugs.length} posts matched.\n`);
for (const p of posts) {
  const r = REWRITES[p.slug];
  console.log(`◆ ${p.slug}\n  T(${r.metaTitle.length}): ${r.metaTitle}\n  D(${r.metaDescription.length}): ${r.metaDescription}`);
  if (FIX) { await c.patch(p._id).set({ metaTitle: r.metaTitle, metaDescription: r.metaDescription }).commit(); console.log('  ✓ patched'); }
  console.log();
}
console.log(FIX ? 'Done.' : 'Dry run — use --fix to apply.');
