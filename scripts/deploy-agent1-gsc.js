#!/usr/bin/env node
/**
 * Chronexa — Deploy Agent 1: GSC Strategist (Baserow)
 * Builds, imports, activates, deactivates old, then test-runs.
 */
require('dotenv').config();
const https = require('https');
const fs = require('fs');

const N8N_KEY = process.env.N8N_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const GSC_EMAIL = process.env.GSC_CLIENT_EMAIL;
const GSC_KEY_RAW = fs.readFileSync('./config/gsc-service-account.json', 'utf8');
const GSC_PRIVATE_KEY = JSON.parse(GSC_KEY_RAW).private_key; // exact key with real newlines

const OLD_WORKFLOW_ID = 'd96au9JL4iHaFdKj';
const BASEROW_CRED_ID = 'nY2TCXW2BwAXwuHG';
const BASEROW_TABLE_ID = 975683;

// ── HTTP helpers ────────────────────────────────────────────────────────────
function n8n(method, path, body) {
  return httpReq('n8n.chronexa.io', method, path,
    { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' }, body);
}

function httpReq(hostname, method, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);
    const req = https.request({ hostname, path, method, headers }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Build Workflow JSON ──────────────────────────────────────────────────────
function buildWorkflow() {
  // Escape private key for embedding in n8n expression string
  // The private key has real newlines — we store it as a literal string in the code node
  // The code node reads from process.env inside n8n's task runner
  
  const gscJwtCode = `const crypto = require('crypto');

const clientEmail = '${GSC_EMAIL}';
// Private key with real newlines embedded
const privateKey = ${JSON.stringify(GSC_PRIVATE_KEY)};

const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: clientEmail,
  scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600
};

const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
const signingInput = \`\${header}.\${body}\`;

const sign = crypto.createSign('RSA-SHA256');
sign.update(signingInput);
sign.end();
const signature = sign.sign(privateKey, 'base64url');

const gsc_jwt = \`\${signingInput}.\${signature}\`;
return [{ json: { gsc_jwt } }];`;

  const filterCode = `const rows = items[0].json.rows || [];
const filtered = rows
  .filter(r => r.position >= 11 && r.position <= 30 && r.impressions >= 50)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 5);

if (filtered.length === 0) {
  return [{ json: { skip: true, reason: 'No striking distance keywords found', total_rows: rows.length } }];
}

return filtered.map(r => ({
  json: {
    skip: false,
    query: r.keys[0],
    impressions: Math.round(r.impressions),
    clicks: Math.round(r.clicks),
    ctr: parseFloat((r.ctr * 100).toFixed(2)),
    position: parseFloat(r.position.toFixed(1))
  }
}));`;

  const parseCode = `const results = [];
for (const item of items) {
  const text = (item.json?.content?.[0]?.text) || '';
  const extract = (tag) => {
    const m = text.match(new RegExp('%%' + tag + '%%\\\\n([\\\\s\\\\S]*?)\\\\n%%' + tag + '%%'));
    return m ? m[1].trim() : '';
  };
  const title     = extract('TITLE');
  const keyword   = extract('KEYWORD');
  const secondary = extract('SECONDARY');
  const persona   = extract('PERSONA');
  const thesis    = extract('THESIS');

  if (!title || !keyword || !thesis) {
    results.push({ json: { parse_error: true, raw_text: text.slice(0, 500) } });
    continue;
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  results.push({ json: { parse_error: false, title, slug, keyword, secondary, persona, thesis } });
}
return results;`;

  const claudePrompt = `You are an expert B2B content strategist for Chronexa.io, an AI automation agency serving wealth managers, CFOs, SaaS founders, supply chain operators, and CPA firms.

A Google Search Console keyword is in position {{ $json.position }} with {{ $json.impressions }} impressions over 90 days. This is a high-opportunity striking distance keyword.

Keyword: {{ $json.query }}

Generate a blog post brief using EXACTLY this format with NO extra text:

%%TITLE%%
[A compelling, specific blog post title targeting this keyword. Max 65 characters.]
%%TITLE%%

%%KEYWORD%%
{{ $json.query }}
%%KEYWORD%%

%%SECONDARY%%
[3-5 secondary keywords, comma-separated, semantically related to the main keyword]
%%SECONDARY%%

%%PERSONA%%
[Pick ONE: wealth_management, supply_chain, saas_founder, agency_owner, cpa_firm]
%%PERSONA%%

%%THESIS%%
[2-3 sentences: the core argument and value of this post for the target persona]
%%THESIS%%`;

  return {
    name: "Agent 1: GSC Strategist (Baserow)",
    nodes: [
      {
        id: "a1g-trigger",
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.2,
        position: [240, 300],
        parameters: {
          rule: {
            interval: [{ field: "hours", hoursInterval: 6 }]
          }
        }
      },
      {
        id: "a1g-build-jwt",
        name: "Build GSC JWT",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [460, 300],
        parameters: {
          mode: "runOnceForAllItems",
          jsCode: gscJwtCode
        }
      },
      {
        id: "a1g-get-token",
        name: "Get GSC Access Token",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [680, 300],
        parameters: {
          method: "POST",
          url: "https://oauth2.googleapis.com/token",
          sendBody: true,
          contentType: "form-urlencoded",
          bodyParameters: {
            parameters: [
              { name: "grant_type", value: "urn:ietf:params:oauth:grant-type:jwt-bearer" },
              { name: "assertion", value: "={{ $json.gsc_jwt }}" }
            ]
          },
          options: { timeout: 15000 }
        }
      },
      {
        id: "a1g-fetch-gsc",
        name: "Fetch GSC Striking Distance",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [900, 300],
        parameters: {
          method: "POST",
          url: "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Achronexa.io/searchAnalytics/query",
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: "Authorization", value: "=Bearer {{ $json.access_token }}" },
              { name: "Content-Type", value: "application/json" }
            ]
          },
          sendBody: true,
          contentType: "json",
          specifyBody: "json",
          jsonBody: "={{ ({ startDate: $now.minus(90,'days').toFormat('yyyy-MM-dd'), endDate: $now.minus(3,'days').toFormat('yyyy-MM-dd'), dimensions: ['query'], rowLimit: 1000, dimensionFilterGroups: [{ filters: [{ dimension: 'query', operator: 'notContains', expression: 'chronexa' }] }] }) }}",
          options: { timeout: 30000 }
        }
      },
      {
        id: "a1g-filter",
        name: "Filter Striking Distance",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1120, 300],
        parameters: {
          mode: "runOnceForAllItems",
          jsCode: filterCode
        }
      },
      {
        id: "a1g-has-keywords",
        name: "Has Keywords?",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [1340, 300],
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              {
                id: "skip-check",
                leftValue: "={{ $json.skip }}",
                rightValue: true,
                operator: { type: "boolean", operation: "true" }
              }
            ],
            combinator: "and"
          }
        }
      },
      {
        id: "a1g-claude",
        name: "Claude Brief Generation",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1560, 400],
        parameters: {
          method: "POST",
          url: "https://api.anthropic.com/v1/messages",
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: "x-api-key", value: ANTHROPIC_KEY },
              { name: "anthropic-version", value: "2023-06-01" },
              { name: "content-type", value: "application/json" }
            ]
          },
          sendBody: true,
          contentType: "json",
          specifyBody: "json",
          jsonBody: `={{ ({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, messages: [{ role: 'user', content: ${JSON.stringify(claudePrompt)} }] }) }}`,
          options: { timeout: 60000 }
        }
      },
      {
        id: "a1g-parse",
        name: "Parse Brief Fields",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1780, 400],
        parameters: {
          mode: "runOnceForEachItem",
          jsCode: parseCode
        }
      },
      {
        id: "a1g-parse-ok",
        name: "Parse OK?",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [2000, 400],
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              {
                id: "parse-error-check",
                leftValue: "={{ $json.parse_error }}",
                rightValue: true,
                operator: { type: "boolean", operation: "true" }
              }
            ],
            combinator: "and"
          }
        }
      },
      {
        id: "a1g-create-row",
        name: "Create Baserow Record",
        type: "n8n-nodes-base.baserow",
        typeVersion: 1,
        position: [2220, 300],
        parameters: {
          operation: "create",
          tableId: BASEROW_TABLE_ID,
          fieldsUi: {
            fieldValues: [
              { fieldId: "Title",              value: "={{ $json.title }}" },
              { fieldId: "Slug",               value: "={{ $json.slug }}" },
              { fieldId: "Target Keyword",     value: "={{ $json.keyword }}" },
              { fieldId: "Secondary Keywords", value: "={{ $json.secondary }}" },
              { fieldId: "Persona",            value: "={{ $json.persona }}" },
              { fieldId: "Thesis",             value: "={{ $json.thesis }}" },
              { fieldId: "Status",             value: "idea_generated" }
            ]
          }
        },
        credentials: {
          baserowApi: {
            id: BASEROW_CRED_ID,
            name: "Baserow Blog CMS"
          }
        }
      },
      {
        id: "a1g-end-no-keywords",
        name: "End: No Keywords Today",
        type: "n8n-nodes-base.noOp",
        typeVersion: 1,
        position: [1560, 200],
        parameters: {}
      },
      {
        id: "a1g-end-parse-fail",
        name: "End: Parse Failed",
        type: "n8n-nodes-base.noOp",
        typeVersion: 1,
        position: [2220, 500],
        parameters: {}
      },
      {
        id: "a1g-sticky",
        name: "⚙️ Agent 1: GSC Strategist (Baserow)",
        type: "n8n-nodes-base.stickyNote",
        typeVersion: 1,
        position: [200, 160],
        parameters: {
          content: "## Agent 1: GSC Strategist (Baserow) v1\n\n**Trigger:** Every 6 hours\n**Input:** Google Search Console searchAnalytics (position 11-30, impressions ≥50)\n**Output:** blog_pipeline row in Baserow (status=idea_generated)\n\n**Auth:** Service account JWT (built in Code node — no n8n GSC cred needed)\n**Model:** claude-haiku-4-5-20251001\n**DB:** Baserow Blog CMS (table 975683)\n\n**Replaces:** Old Agent 1 (time-based persona rotation, no GSC)\nOld workflow ID d96au9JL4iHaFdKj is preserved but deactivated.",
          height: 200,
          width: 480
        }
      }
    ],
    connections: {
      "Schedule Trigger": {
        main: [[{ node: "Build GSC JWT", type: "main", index: 0 }]]
      },
      "Build GSC JWT": {
        main: [[{ node: "Get GSC Access Token", type: "main", index: 0 }]]
      },
      "Get GSC Access Token": {
        main: [[{ node: "Fetch GSC Striking Distance", type: "main", index: 0 }]]
      },
      "Fetch GSC Striking Distance": {
        main: [[{ node: "Filter Striking Distance", type: "main", index: 0 }]]
      },
      "Filter Striking Distance": {
        main: [[{ node: "Has Keywords?", type: "main", index: 0 }]]
      },
      "Has Keywords?": {
        main: [
          [{ node: "End: No Keywords Today", type: "main", index: 0 }],
          [{ node: "Claude Brief Generation", type: "main", index: 0 }]
        ]
      },
      "Claude Brief Generation": {
        main: [[{ node: "Parse Brief Fields", type: "main", index: 0 }]]
      },
      "Parse Brief Fields": {
        main: [[{ node: "Parse OK?", type: "main", index: 0 }]]
      },
      "Parse OK?": {
        main: [
          [{ node: "End: Parse Failed", type: "main", index: 0 }],
          [{ node: "Create Baserow Record", type: "main", index: 0 }]
        ]
      }
    },
    settings: {
      executionOrder: "v1",
      saveManualExecutions: true,
      errorWorkflow: "MKBhIfmRNZtPDJg0",
      callerPolicy: "workflowsFromSameOwner"
    }
  };
}

// ── Main Execution ───────────────────────────────────────────────────────────
async function main() {
  // STEP 1: Build
  console.log('=== STEP 1: Building workflow JSON ===');
  const workflow = buildWorkflow();
  console.log(`Nodes: ${workflow.nodes.length}, Connections: ${Object.keys(workflow.connections).length}`);

  // STEP 2: Import
  console.log('\n=== STEP 2: Importing workflow via n8n API ===');
  const importRes = await n8n('POST', '/api/v1/workflows', workflow);
  console.log('Import status:', importRes.status);
  if (!importRes.data.id) {
    console.error('Import FAILED:', JSON.stringify(importRes.data).slice(0, 500));
    return;
  }
  const newId = importRes.data.id;
  console.log(`✓ New workflow ID: ${newId}`);
  console.log(`  Name: "${importRes.data.name}"`);
  console.log(`  Active: ${importRes.data.active}`);

  // Save workflow to disk
  fs.writeFileSync(`./scripts/live-workflows/blog-agent-1-gsc-strategist.json`,
    JSON.stringify(importRes.data, null, 2));
  console.log('  Saved to scripts/live-workflows/blog-agent-1-gsc-strategist.json');

  // STEP 3: Activate new
  console.log('\n=== STEP 3: Activating new workflow ===');
  const activateRes = await n8n('PATCH', `/api/v1/workflows/${newId}`, { active: true });
  console.log('Activate status:', activateRes.status, '| Active:', activateRes.data.active);

  // STEP 4: Deactivate old
  console.log('\n=== STEP 4: Deactivating old Agent 1 ===');
  const deactivateRes = await n8n('PATCH', `/api/v1/workflows/${OLD_WORKFLOW_ID}`, { active: false });
  console.log('Deactivate status:', deactivateRes.status, '| Active:', deactivateRes.data.active);

  // STEP 5: Manual test run
  console.log('\n=== STEP 5: Triggering manual test run ===');
  const runRes = await n8n('POST', `/api/v1/workflows/${newId}/run`, {});
  console.log('Run trigger status:', runRes.status);
  if (runRes.data.executionId) {
    console.log(`Execution ID: ${runRes.data.executionId}`);
  } else {
    console.log('Run response:', JSON.stringify(runRes.data).slice(0,300));
  }

  console.log('Waiting 45 seconds for execution to complete...');
  await sleep(45000);

  // Fetch execution results
  const execRes = await n8n('GET', `/api/v1/executions?workflowId=${newId}&limit=1&includeData=true`);
  console.log('\n=== EXECUTION RESULTS ===');
  console.log('Fetch status:', execRes.status);
  
  const exec = execRes.data?.data?.[0];
  if (!exec) {
    console.log('No executions found yet:', JSON.stringify(execRes.data).slice(0,300));
    return;
  }

  console.log(`Execution ID: ${exec.id}`);
  console.log(`Status: ${exec.status}`);
  console.log(`Started: ${exec.startedAt}`);
  console.log(`Stopped: ${exec.stoppedAt}`);
  console.log(`Finished: ${exec.finished}`);

  // Parse node results
  const nodeData = exec.data?.resultData?.runData || {};
  const nodes = [
    'Build GSC JWT',
    'Get GSC Access Token', 
    'Fetch GSC Striking Distance',
    'Filter Striking Distance',
    'Has Keywords?',
    'Claude Brief Generation',
    'Parse Brief Fields',
    'Parse OK?',
    'Create Baserow Record',
    'End: No Keywords Today',
    'End: Parse Failed'
  ];

  console.log('\n--- Node-by-Node Results ---');
  for (const nodeName of nodes) {
    const nd = nodeData[nodeName];
    if (!nd) { console.log(`  [${nodeName}]: NOT REACHED`); continue; }
    const nd0 = nd[0];
    const status = nd0?.error ? 'FAILED' : 'OK';
    if (nd0?.error) {
      console.log(`  [${nodeName}]: ${status} — ERROR: ${nd0.error.message}`);
    } else {
      const outItems = nd0?.data?.main?.[0] || [];
      const sample = outItems[0]?.json || {};
      // Report key fields per node
      if (nodeName === 'Build GSC JWT') {
        console.log(`  [${nodeName}]: ${status} — gsc_jwt length: ${(sample.gsc_jwt||'').length}`);
      } else if (nodeName === 'Get GSC Access Token') {
        console.log(`  [${nodeName}]: ${status} — access_token: ${sample.access_token ? 'YES' : 'NO'}, token_type: ${sample.token_type}`);
      } else if (nodeName === 'Fetch GSC Striking Distance') {
        console.log(`  [${nodeName}]: ${status} — rows returned: ${(sample.rows||[]).length}`);
      } else if (nodeName === 'Filter Striking Distance') {
        console.log(`  [${nodeName}]: ${status} — skip: ${sample.skip}, items out: ${outItems.length}`);
        if (!sample.skip) outItems.forEach(i => console.log(`    → query: "${i.json.query}", pos: ${i.json.position}, impressions: ${i.json.impressions}`));
      } else if (nodeName === 'Claude Brief Generation') {
        const ok = sample.content?.[0]?.text?.length > 0;
        console.log(`  [${nodeName}]: ${status} — response received: ${ok ? 'YES' : 'NO'}`);
      } else if (nodeName === 'Parse Brief Fields') {
        console.log(`  [${nodeName}]: ${status} — parse_error: ${sample.parse_error}, title: "${sample.title || 'N/A'}"`);
      } else if (nodeName === 'Create Baserow Record') {
        console.log(`  [${nodeName}]: ${status} — record id: ${sample.id}, Title: "${sample.Title || sample.title || 'N/A'}"`);
      } else {
        console.log(`  [${nodeName}]: ${status} — items: ${outItems.length}`);
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`New workflow ID: ${newId}`);
  console.log(`Old workflow ${OLD_WORKFLOW_ID}: deactivated`);
  console.log(`Execution: ${exec.status}`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
