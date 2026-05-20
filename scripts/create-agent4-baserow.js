/**
 * Creates Agent 4: Image Designer (Baserow) — replaces Airtable nodes with HTTP Request
 * nodes targeting Baserow table 975683. All image generation logic preserved exactly.
 * Run: node scripts/create-agent4-baserow.js
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

// Read live Agent 4 to extract image nodes verbatim (preserves all escapes & API keys)
const liveA4 = JSON.parse(fs.readFileSync('scripts/live-workflows/blog-agent-4-designer.json', 'utf8'));

// Pull nodes we're keeping/adapting
const origGenPrompt  = liveA4.nodes.find(n => n.name === 'Generate Image Prompt');
const origExtract    = liveA4.nodes.find(n => n.name === 'Extract Image Prompt');
const origGemini     = liveA4.nodes.find(n => n.name === 'Generate Image with Gemini');
const origImgbb      = liveA4.nodes.find(n => n.name === 'Upload Image to Imgbb');

// Update Generate Image Prompt jsonBody:
// $('Get Pending Record').first().json['Title'] → $('Extract Record').first().json.title
// $('Get Pending Record').first().json['Thesis'] → $('Extract Record').first().json.thesis
let genPromptBody = origGenPrompt.parameters.jsonBody;
genPromptBody = genPromptBody
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Title'\]/g,  "$('Extract Record').first().json.title")
  .replace(/\$\('Get Pending Record'\)\.first\(\)\.json\['Thesis'\]/g, "$('Extract Record').first().json.thesis");

// Update x-api-key in Generate Image Prompt to use env value
const promptHeaders = origGenPrompt.parameters.headerParameters.parameters.map(p =>
  p.name === 'x-api-key' ? { name: 'x-api-key', value: ANTHROPIC_KEY } : p
);

// Update Extract Image Prompt: record_id source changes from Airtable id to Baserow record_id
const extractAssignments = origExtract.parameters.assignments.assignments.map(a => {
  if (a.name === 'record_id') {
    return { ...a, value: "={{ $('Extract Record').first().json.record_id }}", type: 'number' };
  }
  return a; // image_prompt unchanged: $json.content[0].text.trim()
});

// === WORKFLOW NODES ===
const nodes = [

  // 1. Schedule Trigger — same as original (every 5 min)
  {
    id: 'a4b-trigger',
    name: 'Schedule Trigger',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [240, 300],
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '*/5 * * * *' }] }
    }
  },

  // 2. Fetch Pending Record — HTTP GET Baserow, filter Status=copy_written
  {
    id: 'a4b-fetch',
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
          { name: 'filter__Status__equal', value: 'copy_written' },
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

  // 3. Has Pending Record? — IF count > 0 (prevents empty-run noise)
  {
    id: 'a4b-check',
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
    id: 'a4b-end',
    name: 'End: No Pending Records',
    type: 'n8n-nodes-base.noOp',
    typeVersion: 1,
    position: [900, 460],
    parameters: {}
  },

  // 5. Extract Record — flatten Baserow row: record_id, title, thesis
  {
    id: 'a4b-extract',
    name: 'Extract Record',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [900, 300],
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          { id: 'er-id',    name: 'record_id', value: "={{ $json.results[0].id }}",          type: 'number' },
          { id: 'er-title', name: 'title',     value: "={{ $json.results[0]['Title'] }}",     type: 'string' },
          { id: 'er-thesis',name: 'thesis',    value: "={{ $json.results[0]['Thesis'] }}",    type: 'string' }
        ]
      },
      options: {}
    }
  },

  // 6. Lock Record — PATCH Status=generating_image to prevent double-processing
  {
    id: 'a4b-lock',
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
      jsonBody: '={{ ({ "Status": "generating_image" }) }}',
      options: { timeout: 15000 }
    }
  },

  // 7. Generate Image Prompt — Claude Haiku generates Imagen prompt (same model/system prompt)
  //    onError → Mark Failed (new safety branch)
  {
    id: 'a4b-gen-prompt',
    name: 'Generate Image Prompt',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1340, 300],
    onError: 'continueErrorOutput',
    parameters: {
      ...origGenPrompt.parameters,
      headerParameters: { parameters: promptHeaders },
      jsonBody: genPromptBody
    }
  },

  // 8. Extract Image Prompt — Set: record_id (updated source) + image_prompt (unchanged)
  {
    id: 'a4b-extract-prompt',
    name: 'Extract Image Prompt',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [1560, 300],
    parameters: {
      ...origExtract.parameters,
      assignments: { assignments: extractAssignments }
    }
  },

  // 9. Generate Image with Gemini — Imagen 3, onError → Save Image URL (No Image)
  //    Copied verbatim from live workflow (API key, prompt template, params all preserved)
  {
    id: 'a4b-gen-image',
    name: 'Generate Image with Gemini',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1780, 300],
    onError: 'continueErrorOutput',
    parameters: origGemini.parameters
  },

  // 10. Upload Image to Imgbb — base64 PNG → CDN, onError → Save Image URL (No Image)
  //     Copied verbatim from live workflow (API key, record_id ref all preserved)
  {
    id: 'a4b-upload-imgbb',
    name: 'Upload Image to Imgbb',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2000, 200],
    onError: 'continueErrorOutput',
    parameters: origImgbb.parameters
  },

  // 11. Save Image URL (With Image) — PATCH Baserow: cover_url + prompt + ready_to_publish
  {
    id: 'a4b-save-image-success',
    name: 'Save Image URL (With Image)',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2220, 200],
    parameters: {
      method: 'PATCH',
      url: "={{ '" + TABLE_URL + "' + $('Extract Image Prompt').first().json.record_id + '/?user_field_names=true' }}",
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
      jsonBody: "={{ ({ \"Cover Image URL\": $json.data?.display_url || '', \"Cover Image Prompt\": $('Extract Image Prompt').first().json.image_prompt, \"Status\": \"ready_to_publish\" }) }}",
      options: { timeout: 15000 }
    }
  },

  // 12. Save Image URL (No Image) — PATCH Baserow: empty cover_url + ready_to_publish
  //     Graceful degradation: image gen or upload failed, still mark ready_to_publish
  {
    id: 'a4b-save-image-no',
    name: 'Save Image URL (No Image)',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2000, 440],
    parameters: {
      method: 'PATCH',
      url: "={{ '" + TABLE_URL + "' + $('Extract Image Prompt').first().json.record_id + '/?user_field_names=true' }}",
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
      jsonBody: "={{ ({ \"Cover Image URL\": '', \"Cover Image Prompt\": $('Extract Image Prompt').first().json.image_prompt, \"Status\": \"ready_to_publish\" }) }}",
      options: { timeout: 15000 }
    }
  },

  // 13. Mark Failed — PATCH Baserow Status=failed (handles Generate Image Prompt API error)
  {
    id: 'a4b-fail',
    name: 'Mark Failed',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1560, 460],
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
      jsonBody: '={{ ({ "Status": "failed", "Error Log": "Image prompt generation failed (Claude API error)" }) }}',
      options: { timeout: 15000 }
    }
  },

  // Sticky note
  {
    id: 'a4b-sticky',
    name: '⚙️ Agent 4: Image Designer (Baserow)',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [240, 100],
    parameters: {
      content: '## Agent 4: Image Designer (Baserow)\nPolls every 5 min for `copy_written` records.\nClaude Haiku → image prompt → Gemini Imagen 3 → Imgbb CDN → Baserow.\nGraceful degradation: image failure still sets ready_to_publish with empty cover URL.\nStatus: copy_written → generating_image → ready_to_publish (or failed on Claude error).',
      height: 140,
      width: 560
    }
  }
];

// === CONNECTIONS ===
const connections = {
  'Schedule Trigger':          { main: [[{ node: 'Fetch Pending Record',    type: 'main', index: 0 }]] },
  'Fetch Pending Record':      { main: [[{ node: 'Has Pending Record?',     type: 'main', index: 0 }]] },
  'Has Pending Record?':       { main: [
    [{ node: 'Extract Record',          type: 'main', index: 0 }],  // true  [0]
    [{ node: 'End: No Pending Records', type: 'main', index: 0 }]   // false [1]
  ]},
  'Extract Record':            { main: [[{ node: 'Lock Record',             type: 'main', index: 0 }]] },
  'Lock Record':               { main: [[{ node: 'Generate Image Prompt',   type: 'main', index: 0 }]] },
  'Generate Image Prompt':     { main: [
    [{ node: 'Extract Image Prompt',    type: 'main', index: 0 }],  // success [0]
    [{ node: 'Mark Failed',             type: 'main', index: 0 }]   // error   [1]  ← new safety
  ]},
  'Extract Image Prompt':      { main: [[{ node: 'Generate Image with Gemini', type: 'main', index: 0 }]] },
  'Generate Image with Gemini':{ main: [
    [{ node: 'Upload Image to Imgbb',        type: 'main', index: 0 }],  // success [0]
    [{ node: 'Save Image URL (No Image)',     type: 'main', index: 0 }]  // error   [1]
  ]},
  'Upload Image to Imgbb':     { main: [
    [{ node: 'Save Image URL (With Image)',   type: 'main', index: 0 }],  // success [0]
    [{ node: 'Save Image URL (No Image)',     type: 'main', index: 0 }]   // error   [1]
  ]}
};

async function run() {
  console.log('Creating Agent 4: Image Designer (Baserow)...');

  const payload = {
    name: 'Agent 4: Image Designer (Baserow)',
    nodes,
    connections,
    settings: { executionOrder: 'v1', saveManualExecutions: false }
  };

  const created = await n8nRequest('POST', '/workflows', payload);
  if (!created.id) {
    console.error('CREATE FAILED:', JSON.stringify(created).substring(0, 600));
    process.exit(1);
  }
  const newId = created.id;
  console.log('Created workflow ID:', newId, '| Active:', created.active);

  const activated = await n8nRequest('POST', '/workflows/' + newId + '/activate');
  console.log('Activated:', activated.active !== false ? 'YES' : 'NO — check n8n UI');

  // Deactivate old Airtable Agent 4
  const deactivated = await n8nRequest('POST', '/workflows/3EVAeoUzCWBzlvKp/deactivate');
  console.log('Old Agent 4 (3EVAeoUzCWBzlvKp) deactivated. Active:', deactivated.active);

  console.log('\n=== SWAP COMPLETE ===');
  console.log('New Agent 4 (Baserow) ID:', newId);
  console.log('Old Agent 4 (Airtable) ID: 3EVAeoUzCWBzlvKp  [deactivated]');
}

run().catch(console.error);
