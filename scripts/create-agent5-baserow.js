/**
 * Agent 5 (Publisher) migration: Airtable → Baserow
 *
 * Reads live Agent 5 (Pxyseu0euKXlTXsX) to preserve the Publish to Framer node
 * verbatim (bridge secret hardcoded in original). Builds Baserow equivalent:
 *   Fetch Pending → IF gate → Extract Record → Lock Record
 *   → Map to Framer Schema → Publish to Framer (with error branch)
 *   → Mark Published | Mark Failed
 *
 * Run:  node scripts/create-agent5-baserow.js
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const BASEROW_KEY = process.env.BASEROW_API_KEY;
const OLD_WF_ID = 'Pxyseu0euKXlTXsX';
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

async function run() {
  console.log('Fetching live Agent 5 (Pxyseu0euKXlTXsX)...');
  const oldWf = await n8nRequest('GET', '/workflows/' + OLD_WF_ID);
  console.log('Fetched:', oldWf.name, '| nodes:', oldWf.nodes.length);

  // Preserve the Publish to Framer node verbatim (has hardcoded bridge secret)
  const origPublish = oldWf.nodes.find(n => n.name === 'Publish to Framer');
  if (!origPublish) {
    console.error('ERROR: Could not find Publish to Framer node in live workflow');
    return;
  }
  console.log('Preserved Publish to Framer node:', origPublish.parameters.url);

  // ---- Build new workflow nodes ----
  const nodes = [
    {
      id: 'a5b-sched-001',
      name: 'Schedule Trigger',
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1.2,
      position: [0, 0],
      parameters: {
        rule: { interval: [{ field: 'cronExpression', expression: '*/5 * * * *' }] }
      }
    },
    {
      id: 'a5b-fetch-001',
      name: 'Fetch Pending Record',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [220, 0],
      parameters: {
        method: 'GET',
        url: TABLE_URL + '?user_field_names=true&filter__Status__equal=ready_to_publish&size=1',
        authentication: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: 'Authorization', value: 'Token ' + BASEROW_KEY }]
        },
        options: {}
      }
    },
    {
      id: 'a5b-if-001',
      name: 'IF: Has Record?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [440, 0],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
          conditions: [{
            id: 'cond-count',
            leftValue: '={{ $json.count }}',
            rightValue: 0,
            operator: { type: 'number', operation: 'gt' }
          }],
          combinator: 'and'
        }
      }
    },
    {
      id: 'a5b-extract-001',
      name: 'Extract Record',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [660, -120],
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            { id: 'ea-rid',   name: 'record_id',        value: '={{ $json.results[0].id }}',                    type: 'number' },
            { id: 'ea-slug',  name: 'slug',              value: "={{ $json.results[0]['Slug'] }}",               type: 'string' },
            { id: 'ea-title', name: 'title',             value: "={{ $json.results[0]['Title'] }}",              type: 'string' },
            { id: 'ea-meta',  name: 'meta_description',  value: "={{ $json.results[0]['Meta Description'] }}",  type: 'string' },
            { id: 'ea-body',  name: 'html_body',         value: "={{ $json.results[0]['HTML Body'] }}",          type: 'string' },
            { id: 'ea-hero',  name: 'cover_image_url',   value: "={{ $json.results[0]['Cover Image URL'] || '' }}", type: 'string' }
          ]
        },
        options: {}
      }
    },
    {
      id: 'a5b-lock-001',
      name: 'Lock Record',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [880, -120],
      parameters: {
        method: 'PATCH',
        url: "={{ '" + TABLE_URL + "' + $json.record_id + '/?user_field_names=true' }}",
        authentication: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: 'Authorization', value: 'Token ' + BASEROW_KEY }]
        },
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: '={{ ({ "Status": "publishing" }) }}',
        options: {}
      }
    },
    {
      id: 'a5b-map-001',
      name: 'Map to Framer Schema',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [1100, -120],
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            { id: 'mf-rid',   name: 'record_id',        value: "={{ $('Extract Record').first().json.record_id }}",       type: 'number' },
            { id: 'mf-slug',  name: 'slug',              value: "={{ $('Extract Record').first().json.slug }}",            type: 'string' },
            { id: 'mf-title', name: 'title',             value: "={{ $('Extract Record').first().json.title }}",           type: 'string' },
            { id: 'mf-meta',  name: 'meta_description',  value: "={{ $('Extract Record').first().json.meta_description }}", type: 'string' },
            { id: 'mf-body',  name: 'html_body',         value: "={{ $('Extract Record').first().json.html_body }}",       type: 'string' },
            { id: 'mf-hero',  name: 'cover_image_url',   value: "={{ $('Extract Record').first().json.cover_image_url }}", type: 'string' },
            { id: 'mf-date',  name: 'published_date',    value: '={{ new Date().toISOString() }}',                        type: 'string' }
          ]
        },
        options: {}
      }
    },
    // Preserve the Publish to Framer node verbatim, add error routing
    {
      ...origPublish,
      id: 'a5b-publish-001',
      position: [1320, -120],
      onError: 'continueErrorOutput'
    },
    {
      id: 'a5b-mark-pub-001',
      name: 'Mark Published',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [1540, -220],
      parameters: {
        method: 'PATCH',
        url: "={{ '" + TABLE_URL + "' + $('Extract Record').first().json.record_id + '/?user_field_names=true' }}",
        authentication: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: 'Authorization', value: 'Token ' + BASEROW_KEY }]
        },
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: "={{ ({ \"Status\": \"published\", \"Framer Item ID\": $json.framer_item_id || '' }) }}",
        options: {}
      }
    },
    {
      id: 'a5b-mark-fail-001',
      name: 'Mark Failed',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [1540, -20],
      parameters: {
        method: 'PATCH',
        url: "={{ '" + TABLE_URL + "' + $('Extract Record').first().json.record_id + '/?user_field_names=true' }}",
        authentication: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [{ name: 'Authorization', value: 'Token ' + BASEROW_KEY }]
        },
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: '={{ ({ "Status": "ready_to_publish", "Error Log": "Bridge publish failed" }) }}',
        options: {}
      }
    },
    {
      id: 'a5b-end-001',
      name: 'End: No Pending Records',
      type: 'n8n-nodes-base.noOp',
      typeVersion: 1,
      position: [660, 100],
      parameters: {}
    }
  ];

  const connections = {
    'Schedule Trigger': {
      main: [[{ node: 'Fetch Pending Record', type: 'main', index: 0 }]]
    },
    'Fetch Pending Record': {
      main: [[{ node: 'IF: Has Record?', type: 'main', index: 0 }]]
    },
    'IF: Has Record?': {
      main: [
        [{ node: 'Extract Record', type: 'main', index: 0 }],         // true
        [{ node: 'End: No Pending Records', type: 'main', index: 0 }] // false
      ]
    },
    'Extract Record': {
      main: [[{ node: 'Lock Record', type: 'main', index: 0 }]]
    },
    'Lock Record': {
      main: [[{ node: 'Map to Framer Schema', type: 'main', index: 0 }]]
    },
    'Map to Framer Schema': {
      main: [[{ node: 'Publish to Framer', type: 'main', index: 0 }]]
    },
    'Publish to Framer': {
      main: [
        [{ node: 'Mark Published', type: 'main', index: 0 }], // success
        [{ node: 'Mark Failed',    type: 'main', index: 0 }]  // error
      ]
    }
  };

  const settings = {
    executionOrder: 'v1',
    saveManualExecutions: true,
    callerPolicy: 'workflowsFromSameOwner',
    errorWorkflow: 'MKBhIfmRNZtPDJg0'
  };

  // Create new workflow
  console.log('\nCreating new workflow...');
  const newWf = await n8nRequest('POST', '/workflows', {
    name: 'Blog Agent 5: Publisher (Baserow)',
    nodes,
    connections,
    settings
  });

  if (!newWf.id) {
    console.error('CREATE FAILED:', JSON.stringify(newWf));
    return;
  }
  console.log('Created workflow ID:', newWf.id);

  // Activate new workflow
  const activated = await n8nRequest('POST', '/workflows/' + newWf.id + '/activate');
  console.log('Activated:', activated.active === true ? 'YES' : JSON.stringify(activated));

  // Deactivate old workflow
  const deactivated = await n8nRequest('POST', '/workflows/' + OLD_WF_ID + '/deactivate');
  console.log('Old Agent 5 deactivated:', deactivated.active === false ? 'YES' : JSON.stringify(deactivated));

  console.log('\n=== AGENT 5 MIGRATION COMPLETE ===');
  console.log('New workflow ID:', newWf.id, '(ACTIVE)');
  console.log('Old workflow ID:', OLD_WF_ID, '(DEACTIVATED)');
  console.log('\nNode map:');
  console.log('  Schedule Trigger → Fetch Pending Record → IF: Has Record?');
  console.log('    true  → Extract Record → Lock Record → Map to Framer Schema → Publish to Framer');
  console.log('    false → End: No Pending Records');
  console.log('  Publish to Framer main[0] → Mark Published (Baserow PATCH: published + Framer Item ID)');
  console.log('  Publish to Framer main[1] → Mark Failed (Baserow PATCH: rollback to ready_to_publish)');
  console.log('\nSave this workflow ID for the test script: WF_ID =', newWf.id);
}

run().catch(console.error);
