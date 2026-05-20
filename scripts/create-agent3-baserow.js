/**
 * Creates Agent 3: Copywriter (Baserow) — replaces Airtable nodes with HTTP Request
 * nodes targeting Baserow table 975683. All prompt logic preserved exactly.
 * Run: node scripts/create-agent3-baserow.js
 */
require('dotenv').config({ path: '.env' });
const https = require('https');
const fs = require('fs');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const BASEROW_TOKEN = process.env.BASEROW_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const TABLE_URL = 'https://api.baserow.io/api/database/rows/table/975683/';

function n8nRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(N8N_BASE + '/api/v1' + apiPath);
    const bodyStr = body ? JSON.stringify(body) : undefined;
    const lib = url.protocol === 'https:' ? https : require('http');
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'X-N8N-API-KEY': N8N_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {})
      }
    };
    let data = '';
    const req = lib.request(options, res => {
      res.on('data', d => data += d);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({ raw: data.substring(0, 500) }); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Read live Agent 3 to extract the original Claude jsonBody (preserves all escapes exactly)
const liveA3 = JSON.parse(fs.readFileSync('scripts/live-workflows/blog-agent-3-copywriter.json', 'utf8'));
const origClaudeNode = liveA3.nodes.find(n => n.name === 'Call Claude - Write Blog Post');

// Update node references in Claude jsonBody:
// $('Get Pending Record').first().json['FieldName'] → $('Extract Record').first().json.field_name
let claudeBody = origClaudeNode.parameters.jsonBody;
claudeBody = claudeBody
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Title'\]/g,               "$('Extract Record').first().json.title")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Target Keyword'\]/g,      "$('Extract Record').first().json.target_keyword")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Secondary Keywords'\]/g,  "$('Extract Record').first().json.secondary_keywords")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Persona'\]/g,             "$('Extract Record').first().json.persona")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Thesis'\]/g,              "$('Extract Record').first().json.thesis")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Research Brief'\]/g,      "$('Extract Record').first().json.research_brief");

// Also update x-api-key to use env var value (avoid hardcoded key drift)
const headerParams = origClaudeNode.parameters.headerParameters.parameters.map(p => {
  if (p.name === 'x-api-key') return { name: 'x-api-key', value: ANTHROPIC_KEY };
  return p;
});

// === WORKFLOW NODES ===
const nodes = [

  // 1. Schedule Trigger — same as original (every 5 min)
  {
    id: 'a3b-trigger',
    name: 'Schedule Trigger',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [240, 300],
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '*/5 * * * *' }] }
    }
  },

  // 2. Fetch Pending Record — HTTP GET Baserow, filter Status=research_complete
  {
    id: 'a3b-fetch',
    name: 'Fetch Pending Record',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [460, 300],
    parameters: {
      method: 'GET',
      url: TABLE_URL,
      authentication: 'none',
      sendQuery: true,
      specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: 'user_field_names', value: 'true' },
          { name: 'filter__Status__equal', value: 'research_complete' },
          { name: 'size', value: '1' }
        ]
      },
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [{ name: 'Authorization', value: 'Token ' + BASEROW_TOKEN }]
      },
      sendBody: false,
      options: { timeout: 15000 }
    }
  },

  // 3. Has Pending Record? — IF count > 0 (safety gate, mirrors Agent 2)
  {
    id: 'a3b-check',
    name: 'Has Pending Record?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: [680, 300],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{
          id: 'check-count',
          leftValue: '={{ $json.count }}',
          rightValue: 0,
          operator: { type: 'number', operation: 'gt' }
        }],
        combinator: 'and'
      },
      options: {}
    }
  },

  // 4. End: No Pending Records — silent exit on false branch
  {
    id: 'a3b-end',
    name: 'End: No Pending Records',
    type: 'n8n-nodes-base.noOp',
    typeVersion: 1,
    position: [900, 460],
    parameters: {}
  },

  // 5. Extract Record — flatten Baserow row into named keys for downstream use
  {
    id: 'a3b-extract',
    name: 'Extract Record',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [900, 300],
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          { id: 'er-id',   name: 'record_id',          value: "={{ $json.results[0].id }}",                       type: 'number' },
          { id: 'er-ti',   name: 'title',               value: "={{ $json.results[0]['Title'] }}",                 type: 'string' },
          { id: 'er-kw',   name: 'target_keyword',      value: "={{ $json.results[0]['Target Keyword'] }}",        type: 'string' },
          { id: 'er-sk',   name: 'secondary_keywords',  value: "={{ $json.results[0]['Secondary Keywords'] }}",    type: 'string' },
          { id: 'er-pe',   name: 'persona',             value: "={{ $json.results[0]['Persona'] }}",               type: 'string' },
          { id: 'er-th',   name: 'thesis',              value: "={{ $json.results[0]['Thesis'] }}",                type: 'string' },
          { id: 'er-rb',   name: 'research_brief',      value: "={{ $json.results[0]['Research Brief'] }}",        type: 'string' }
        ]
      },
      options: {}
    }
  },

  // 6. Lock Record — PATCH Status=writing to prevent double-processing
  {
    id: 'a3b-lock',
    name: 'Lock Record',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1120, 300],
    parameters: {
      method: 'PATCH',
      url: "={{ '" + TABLE_URL + "' + $json.record_id + '/?user_field_names=true' }}",
      authentication: 'none',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'Authorization', value: 'Token ' + BASEROW_TOKEN },
          { name: 'Content-Type',  value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ ({ "Status": "writing" }) }}',
      options: { timeout: 15000 }
    }
  },

  // 7. Call Claude - Write Blog Post — same prompt/model, updated field references
  {
    id: 'a3b-claude',
    name: 'Call Claude - Write Blog Post',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1340, 300],
    onError: 'continueErrorOutput',
    parameters: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'none',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: { parameters: headerParams },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: claudeBody,
      options: { timeout: 120000 }
    }
  },

  // 8. Parse Blog Fields — same delimited parsing, updated record_id source
  {
    id: 'a3b-parse',
    name: 'Parse Blog Fields',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [1560, 300],
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          { id: 'assign-record-id', name: 'record_id',       value: "={{ $('Extract Record').first().json.record_id }}",                                                                                                            type: 'number' },
          { id: 'assign-title',     name: 'title',           value: "={{ $json.content[0].text.split('%%TITLE%%')[1].split('%%SLUG%%')[0].trim() }}",                                                                              type: 'string' },
          { id: 'assign-slug',      name: 'slug',            value: "={{ $json.content[0].text.split('%%SLUG%%')[1].split('%%META%%')[0].trim() }}",                                                                               type: 'string' },
          { id: 'assign-meta',      name: 'meta_description',value: "={{ $json.content[0].text.split('%%META%%')[1].split('%%WORDCOUNT%%')[0].trim() }}",                                                                          type: 'string' },
          { id: 'assign-wc',        name: 'word_count',      value: "={{ parseInt($json.content[0].text.split('%%WORDCOUNT%%')[1].split('%%HTML_START%%')[0].trim()) || 1800 }}",                                                  type: 'number' },
          { id: 'assign-html',      name: 'html_body',       value: "={{ $json.content[0].text.split('%%HTML_START%%')[1].split('%%HTML_END%%')[0].trim() }}",                                                                     type: 'string' }
        ]
      },
      options: {}
    }
  },

  // 9. Quality Gate — same thresholds: word_count >= 1000 AND html_body.length >= 2000
  {
    id: 'a3b-quality',
    name: 'Quality Gate',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: [1780, 300],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [
          { id: 'wc-check',   leftValue: '={{ $json.word_count }}',      rightValue: 1000, operator: { type: 'number', operation: 'gte' } },
          { id: 'html-check', leftValue: '={{ $json.html_body.length }}', rightValue: 2000, operator: { type: 'number', operation: 'gte' } }
        ],
        combinator: 'and'
      },
      options: {}
    }
  },

  // 10. Save Content — PATCH all content fields, Status=copy_written
  {
    id: 'a3b-save',
    name: 'Save Content',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2000, 180],
    parameters: {
      method: 'PATCH',
      url: "={{ '" + TABLE_URL + "' + $json.record_id + '/?user_field_names=true' }}",
      authentication: 'none',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'Authorization', value: 'Token ' + BASEROW_TOKEN },
          { name: 'Content-Type',  value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ ({ "Title": $json.title, "Slug": $json.slug, "Meta Description": $json.meta_description, "HTML Body": $json.html_body, "Word Count": "" + $json.word_count, "Status": "copy_written" }) }}',
      options: { timeout: 30000 }
    }
  },

  // 11. Mark Failed — PATCH Status=failed; handles both quality gate fail AND Claude error
  //     Uses $('Extract Record') for record_id so it works on both branches
  {
    id: 'a3b-fail',
    name: 'Mark Failed',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2000, 440],
    parameters: {
      method: 'PATCH',
      url: "={{ '" + TABLE_URL + "' + $('Extract Record').first().json.record_id + '/?user_field_names=true' }}",
      authentication: 'none',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [
          { name: 'Authorization', value: 'Token ' + BASEROW_TOKEN },
          { name: 'Content-Type',  value: 'application/json' }
        ]
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ ({ "Status": "failed", "Error Log": "Agent3 failed: wc=" + ($json.word_count || "N/A") + " html_len=" + (($json.html_body || "").length) }) }}',
      options: { timeout: 15000 }
    }
  },

  // Sticky note
  {
    id: 'a3b-sticky',
    name: '⚙️ Agent 3: Copywriter (Baserow)',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [240, 100],
    parameters: {
      content: '## Agent 3: Copywriter (Baserow)\nPolls every 5 min for `research_complete` records.\nCalls Claude Sonnet 4.6 to write 1800-2500 word HTML blog post.\nQuality gate: word_count ≥ 1000 AND html_body.length ≥ 2000.\nStatus transitions: research_complete → writing → copy_written (or failed).',
      height: 140,
      width: 500
    }
  }
];

// === CONNECTIONS ===
const connections = {
  'Schedule Trigger':              { main: [[{ node: 'Fetch Pending Record',    type: 'main', index: 0 }]] },
  'Fetch Pending Record':          { main: [[{ node: 'Has Pending Record?',     type: 'main', index: 0 }]] },
  'Has Pending Record?':           { main: [
    [{ node: 'Extract Record',         type: 'main', index: 0 }],   // true  [0]
    [{ node: 'End: No Pending Records',type: 'main', index: 0 }]    // false [1]
  ]},
  'Extract Record':                { main: [[{ node: 'Lock Record',             type: 'main', index: 0 }]] },
  'Lock Record':                   { main: [[{ node: 'Call Claude - Write Blog Post', type: 'main', index: 0 }]] },
  'Call Claude - Write Blog Post': { main: [
    [{ node: 'Parse Blog Fields', type: 'main', index: 0 }],  // success [0]
    [{ node: 'Mark Failed',       type: 'main', index: 0 }]   // error   [1]
  ]},
  'Parse Blog Fields':             { main: [[{ node: 'Quality Gate',            type: 'main', index: 0 }]] },
  'Quality Gate':                  { main: [
    [{ node: 'Save Content', type: 'main', index: 0 }],  // pass [0]
    [{ node: 'Mark Failed',  type: 'main', index: 0 }]   // fail [1]
  ]}
};

async function run() {
  console.log('Creating Agent 3: Copywriter (Baserow)...');

  const payload = {
    name: 'Agent 3: Copywriter (Baserow)',
    nodes,
    connections,
    settings: {
      executionOrder: 'v1',
      saveManualExecutions: false
    }
  };

  const created = await n8nRequest('POST', '/workflows', payload);
  if (!created.id) {
    console.error('CREATE FAILED:', JSON.stringify(created).substring(0, 500));
    process.exit(1);
  }
  const newId = created.id;
  console.log('Created workflow ID:', newId, '| Active:', created.active);

  // Activate it
  const activated = await n8nRequest('POST', '/workflows/' + newId + '/activate');
  console.log('Activated:', activated.active !== false ? 'YES' : 'check manually');

  console.log('\nNew Agent 3 (Baserow) ID:', newId);
  console.log('Old Agent 3 (Airtable) ID: eVPVPBzfFp4obCu0');
  console.log('\nNext step: deactivate old workflow and run validation test.');
}

run().catch(console.error);
