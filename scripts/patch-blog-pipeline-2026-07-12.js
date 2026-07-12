// Patch the live blog pipeline:
//  Agent 3 (EbW7suHY7ji6EhsD): real word-count gate (computed, not self-reported),
//    floor 1500 words / 8000 html chars / title <= 70; prompt hard-rules.
//  Agent 5 (qYIiCFzOoPMNFEmO): publish cadence Tue/Thu 14:00 UTC instead of every 5 min.
//  Agent 1 (fPqf1XhTxhGyWVbF): SERP-whitespace guard in the strategist prompt.
require('dotenv').config({ path: '/Users/ankitdhiman/Work/N8N-Chronexa/.env' });
const fs = require('fs');

const KEY = process.env.N8N_API_KEY;
const BASE = process.env.N8N_BASE_URL || 'https://n8n.chronexa.io';
const DIR = '/Users/ankitdhiman/Work/N8N-Chronexa/scripts/live-workflows';

async function put(id, wf) {
  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings };
  const r = await fetch(`${BASE}/api/v1/workflows/${id}`, {
    method: 'PUT',
    headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`PUT ${id} failed: ${r.status} ${await r.text()}`);
  console.log(`PUT ok: ${wf.name} (${id})`);
}

function mustReplace(str, from, to, label) {
  if (!str.includes(from)) throw new Error(`anchor not found for ${label}: ${from.slice(0, 60)}`);
  return str.replace(from, to);
}

async function main() {
  // ---------- Agent 3: Copywriter ----------
  const a3 = JSON.parse(fs.readFileSync(`${DIR}/blog-agent-3-copywriter.json`, 'utf8'));

  // 1. Parse Blog Fields: compute word_count from the actual HTML body.
  const parse = a3.nodes.find((n) => n.name === 'Parse Blog Fields');
  const wc = parse.parameters.assignments.assignments.find((a) => a.name === 'word_count');
  wc.value =
    "={{ ($json.content[0].text.split('%%HTML_START%%')[1] || '').split('%%HTML_END%%')[0].replace(/<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length }}";

  // 2. Quality Gate: 1500 words computed, 8000 html chars, title sanity.
  const gate = a3.nodes.find((n) => n.name === 'Quality Gate');
  gate.parameters.conditions.conditions = [
    { id: 'wc-check', leftValue: '={{ $json.word_count }}', rightValue: 1500, operator: { type: 'number', operation: 'gte' } },
    { id: 'html-check', leftValue: '={{ $json.html_body.length }}', rightValue: 8000, operator: { type: 'number', operation: 'gte' } },
    { id: 'title-max', leftValue: '={{ $json.title.length }}', rightValue: 70, operator: { type: 'number', operation: 'lte' } },
    { id: 'title-min', leftValue: '={{ $json.title.length }}', rightValue: 20, operator: { type: 'number', operation: 'gte' } },
  ];

  // 3. Prompt hard-rules (inserted text is apostrophe-free: it lives inside a
  //    single-quoted JS string within the n8n expression).
  const call = a3.nodes.find((n) => n.name === 'Call Claude - Write Blog Post');
  let jb = call.parameters.jsonBody;

  jb = mustReplace(
    jb,
    'Workflow tools such as n8n are implementation details, never the story.\\n\\nBRAND VOICE',
    'Workflow tools such as n8n are implementation details, never the story. Never make n8n, Claude, or any tool the hero of the title or meta description — the story is the buyer problem and the secure custom system Chronexa builds.\\n\\nBRAND VOICE',
    'tool-hero ban'
  );

  jb = mustReplace(
    jb,
    'No fluff, no generic AI hype.\\n\\nSTRUCTURE',
    'No fluff, no generic AI hype.\\n\\nHARD REQUIREMENTS (posts violating these are rejected automatically):\\n- Body MUST be at least 1,500 words; target 1,800-2,500.\\n- The security/compliance <h2> MUST name the actual regulations for the persona: cpa_firm — IRC §7216, FTC Safeguards Rule, IRS Publication 4557; legal — ABA Model Rule 1.6 and privilege; wealth_management or financial_services — SEC, FINRA, Regulation S-P; private_equity — LP confidentiality and SEC exam readiness.\\n- Write section headings specific to THIS topic. Do not reuse formulaic H2s such as Where This Goes Wrong or How Firms Actually Phase This In.\\n- If the topic involves legal billing, CPA or tax workload, or document processing, close with the matching free calculator as the primary CTA (https://chronexa.io/law-firm-billing-leakage-calculator or https://chronexa.io/cpa-tax-season-capacity-calculator or https://chronexa.io/document-processing-cost-calculator), framed as: two minutes, no email required. Booking a call is the secondary ask.\\n\\nSTRUCTURE',
    'hard requirements'
  );

  jb = mustReplace(
    jb,
    '<your SEO title 60-65 chars>',
    '<your SEO title, max 65 chars: phrased the way a buyer would actually search or ask, primary keyword near the front. Never a clever hook nobody would type>',
    'title rule'
  );

  call.parameters.jsonBody = jb;
  await put('EbW7suHY7ji6EhsD', a3);

  // ---------- Agent 5: Publisher ----------
  const a5 = JSON.parse(fs.readFileSync(`${DIR}/blog-agent-5-publisher.json`, 'utf8'));
  const sched = a5.nodes.find((n) => n.name === 'Schedule Trigger');
  sched.parameters.rule.interval = [{ field: 'cronExpression', expression: '0 14 * * 2,4' }];
  await put('qYIiCFzOoPMNFEmO', a5);

  // ---------- Agent 1: GSC Strategist ----------
  const a1 = JSON.parse(fs.readFileSync(`${DIR}/blog-agent-1-gsc-strategist.json`, 'utf8'));
  const brief = a1.nodes.find((n) => n.name === 'Claude Brief Generation');
  brief.parameters.jsonBody = mustReplace(
    brief.parameters.jsonBody,
    'No generic AI content.',
    'No generic AI content.\\n\\nKeyword selection guard: if the top search results for this keyword would be dominated by the tool vendor itself or by major publishers making the same claim, reframe the brief toward the specific gap those results do not cover — a niche integration, an edge case, a compliance angle — instead of competing head-on. Prefer narrow tool + vertical + problem angles over broad category terms.',
    'serp guard'
  );
  await put('fPqf1XhTxhGyWVbF', a1);

  console.log('All three workflows patched.');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
