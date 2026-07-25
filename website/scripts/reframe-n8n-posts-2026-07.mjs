/**
 * SEO strategy v2 (2026-07-25): reframe the 2 highest-impression n8n posts for
 * decision-makers (founder/COO) instead of developers. Meta + intro + closing CTA only —
 * ranking body H2s untouched.
 *
 * Run: node scripts/reframe-n8n-posts-2026-07.mjs          (dry run — prints patches)
 *      FIX=1 node scripts/reframe-n8n-posts-2026-07.mjs    (apply)
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

const span = (key, text) => [{ _key: key, _type: 'span', marks: [], text }];

const PATCHES = [
  {
    id: 'post-n8n-ai-agent-node-build-multi-agent-systems-in-2026',
    set: {
      metaTitle: 'n8n AI Agent Node: Production Multi-Agent Patterns (2026)',
      metaDescription:
        'Memory, tools, and multi-agent orchestration in n8n — production patterns from a firm that runs them daily, plus when to build in-house vs bring a partner.',
      // Intro paragraph — keep the definition, add the decision-maker bridge
      'body[_key=="03a5c4ae4da3"].children': span(
        'reframe-intro-1',
        'The n8n AI Agent node is a root-level orchestrator that connects Large Language Models (LLMs) with external tools and memory to autonomously execute complex workflows. Unlike linear automation chains, it uses reasoning loops to plan, execute, and validate tasks dynamically. This guide covers the architecture patterns we run in production at Chronexa — and if you are the founder, COO, or practice owner deciding whether your team should build this in-house, what each pattern means for reliability, maintenance, and cost before you commit engineering time to it.'
      ),
      // Closing CTA — decision-maker framing instead of generic template
      'body[_key=="35a1ffd0f1ca"].children': span(
        'reframe-cta-h2',
        'Should your firm build this in-house?'
      ),
      'body[_key=="25ee4f65c5bf"].children': span(
        'reframe-cta-p',
        'A working prototype takes a weekend. A system your business can rely on every day — with error handling, monitoring, and someone accountable when an API changes — is a different project. Chronexa designs and operates production AI agent systems for firms in finance, legal, and accounting, so the reliability engineering is already done. If you are weighing build vs buy, a 30-minute architecture call will save you weeks of discovery.'
      ),
    },
  },
  {
    id: 'post-top-ai-automation-agencies-b2b-saas-2026',
    set: {
      metaDescription:
        '7 AI automation agencies compared on delivery speed, engineering depth, and results — by a team that builds these systems daily. See who fits your stack.',
      'body[_key=="10668485a82c"].children': span(
        'reframe-intro-2',
        'The year 2026 marks the end of "AI experimentation" and the beginning of "AI infrastructure." For B2B SaaS companies, the challenge has shifted from finding a tool that writes emails to building a technical foundation that orchestrates entire departments. This review is written for the founder or COO choosing a partner — not for engineers comparing tools — so each agency is judged on what actually matters at that table: who delivers, how fast, and what happens after launch.'
      ),
      'body[_key=="66431a60de18"].children': span(
        'reframe-cta2-h2',
        'Choosing a partner for regulated or document-heavy work?'
      ),
      'body[_key=="e17b5cf81a77"].children': span(
        'reframe-cta2-p',
        'Generalist lists stop being useful the moment your workflows touch client money, contracts, or tax documents. If that is your world — finance, legal, accounting, wealth management — the selection criteria change: security posture, audit trails, and whether the vendor deploys on your own cloud matter more than logo walls. We wrote a separate guide on how to choose an AI automation agency for regulated industries, or book a call and pressure-test us against this list directly.'
      ),
    },
  },
];

for (const p of PATCHES) {
  console.log(`\n=== ${p.id} ===`);
  for (const [path, val] of Object.entries(p.set)) {
    const preview = typeof val === 'string' ? val : val[0].text;
    console.log(`  set ${path}\n    → ${preview.slice(0, 110)}...`);
  }
  if (FIX) {
    await c.patch(p.id).set(p.set).commit();
    console.log('  ✓ patched');
  }
}
console.log(FIX ? '\nDONE.' : '\nDRY RUN — FIX=1 to apply.');
