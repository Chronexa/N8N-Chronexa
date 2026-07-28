/**
 * SEO strategy v2 (2026-07-25): patch the blog pipeline's Strategist + Copywriter prompts
 * with the keyword-locked content method (seo/ai-content-method.md).
 *
 * Surgical anchor-string replacements on the LIVE workflow JSON (fetched via fetch-live.js).
 * Fails hard if any anchor is missing — never PUTs a half-patched workflow.
 * PUT uses the 4-key whitelist { name, nodes, connections, settings }.
 *
 * Adds to Strategist brief: lifecycle stage, firm size, that size's apprehension, geo —
 * carried inside %%THESIS%% so no downstream schema/parse changes are needed.
 * Adds to Copywriter: alongside-not-replace positioning, no-fabrication rule,
 * ≥3 real specifics, apprehension addressed in security section, calculator-first CTA, UAE localization.
 *
 * Run: node scripts/patch-blog-pipeline-2026-07-25.js          (dry run — shows diffs)
 *      APPLY=1 node scripts/patch-blog-pipeline-2026-07-25.js  (PUT to live n8n)
 */
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const APPLY = process.env.APPLY === '1';
const BASE = process.env.N8N_API_URL; // e.g. https://n8n.chronexa.io/api/v1
const KEY = process.env.N8N_API_KEY;
const H = { headers: { 'X-N8N-API-KEY': KEY } };

const PATCHES = [
  {
    id: 'fPqf1XhTxhGyWVbF',
    file: 'scripts/live-workflows/blog-agent-1-gsc-strategist.json',
    node: 'Claude Brief Generation',
    replacements: [
      {
        anchor:
          'Brief principles: state the problem exactly as the buyer would phrase it, promise concrete ROI, treat security and compliance as the deal-decider, demand first-hand operational depth. No generic AI content.',
        replace:
          'Brief principles: state the problem exactly as the buyer would phrase it, promise concrete ROI, treat security and compliance as the deal-decider, demand first-hand operational depth. No generic AI content. Position AI as working ALONGSIDE the firm\\u2019s team \\u2014 doing the reading, chasing, filing and first-draft work while their people keep review, judgment and client relationships \\u2014 never as replacing staff.',
      },
      {
        anchor:
          '%%THESIS%%\\n[2-3 sentences: the core argument and value of this post for the target persona]\\n%%THESIS%%',
        replace:
          '%%THESIS%%\\n[4-6 sentences covering, in order: (1) the core argument and value for the target persona; (2) LIFECYCLE STAGE the pain sits in \\u2014 Acquire, Onboard, Serve, or Retain; (3) FIRM SIZE to write for \\u2014 pick ONE of solo/small, mid-market, or large; (4) that size\\u2019s #1 APPREHENSION about AI, which the post must address head-on \\u2014 cost/complexity for solo-small, security/integration/staff-disruption for mid-market, data-residency/audit/vendor-risk for large; (5) GEO \\u2014 US unless the keyword names UAE/Dubai/DIFC/ADGM, in which case localize to the real regulator and local tools.]\\n%%THESIS%%',
      },
    ],
  },
  {
    id: 'EbW7suHY7ji6EhsD',
    file: 'scripts/live-workflows/blog-agent-3-copywriter.json',
    node: 'Call Claude - Write Blog Post',
    replacements: [
      {
        anchor:
          'BRAND VOICE: Authoritative, specific, written from the chair of the person who lives the problem. Concrete numbers and workflow detail over adjectives. No fluff, no generic AI hype.',
        replace:
          'BRAND VOICE: Authoritative, specific, written from the chair of the person who lives the problem. Concrete numbers and workflow detail over adjectives. No fluff, no generic AI hype. NEVER fabricate numbers, statistics, client names or case studies \\u2014 if you do not have a real, verifiable specific, write the sentence without one. Include at least 3 real specifics per post: a named tool, a named regulation, a real number. POSITIONING: AI sits ALONGSIDE the firm\\u2019s staff \\u2014 it does the reading, chasing, filing and first-pass drafting while their people keep review, judgment and the client relationship. Never frame AI as replacing staff; partners are hiring, not firing. Address the firm-size APPREHENSION named in the THESIS head-on inside the security/compliance section. If the keyword or thesis names UAE/Dubai/DIFC/ADGM, localize fully: real local regulator and tools, not US ones.',
      },
      {
        anchor: '4. Close with a short CTA paragraph inviting a free audit at Chronexa.',
        replace:
          '4. Close with a CTA chosen by topic fit: CPA/tax topics \\u2014 lead with the free CPA Tax Season Capacity Calculator at https://chronexa.io/cpa-tax-season-capacity-calculator (\\u201ctwo minutes, no email required\\u201d) with booking a call as the lighter secondary ask; legal billing/leakage topics \\u2014 https://chronexa.io/law-firm-billing-leakage-calculator; document/OCR-heavy topics \\u2014 https://chronexa.io/document-processing-cost-calculator; everything else \\u2014 invite a free strategy call at https://cal.com/chronexa/30min.',
      },
    ],
  },
];

// \uXXXX escapes in `replace` are for readability here; convert to real chars.
const unescape = s => s.replace(/\\u2019/g, '’').replace(/\\u2014/g, '—').replace(/\\u201c/g, '“').replace(/\\u201d/g, '”').replace(/\\n/g, '\\n');

(async () => {
  for (const p of PATCHES) {
    const wf = JSON.parse(fs.readFileSync(p.file, 'utf8'));
    const node = wf.nodes.find(n => n.name === p.node);
    if (!node) throw new Error(`Node not found: ${p.node} in ${p.file}`);
    let body = node.parameters.jsonBody;
    console.log(`\n=== ${p.file} :: ${p.node} ===`);
    for (const r of p.replacements) {
      const anchor = r.anchor; // anchors written exactly as stored (literal \n stays two chars)
      const replacement = unescape(r.replace);
      const count = body.split(anchor).length - 1;
      if (count !== 1) throw new Error(`Anchor matched ${count}× (need exactly 1): "${anchor.slice(0, 60)}..."`);
      body = body.replace(anchor, replacement);
      console.log(`  ✓ anchor ok: "${anchor.slice(0, 60)}..."`);
      console.log(`    → "${replacement.slice(0, 100)}..."`);
    }
    node.parameters.jsonBody = body;

    if (APPLY) {
      const payload = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings };
      await axios.put(`${BASE}/workflows/${p.id}`, payload, H);
      fs.writeFileSync(p.file, JSON.stringify(wf, null, 2)); // keep mirror in sync
      console.log(`  ✓ PUT ${p.id} + mirror updated`);
    }
  }
  console.log(APPLY ? '\nDONE — prompts patched live.' : '\nDRY RUN — APPLY=1 to push.');
})().catch(e => { console.error('FAIL:', e.response?.status, e.response?.data?.message || e.message); process.exit(1); });
