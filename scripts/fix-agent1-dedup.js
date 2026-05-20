/**
 * Patch Agent 1 (fPqf1XhTxhGyWVbF) to add deduplication check.
 *
 * Inserts between "Parse OK?" (false branch) and "Create Baserow Record":
 *   Check Duplicate Keyword (Code node) — queries Baserow for existing keyword,
 *     adds `duplicate: bool` to item (preserving all other fields)
 *   IF: Already Exists? — true → End: Keyword Already Exists
 *                        false → Create Baserow Record (unchanged)
 *
 * Does NOT modify Create Baserow Record or any other existing node.
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = 'fPqf1XhTxhGyWVbF';
const BASEROW_KEY = process.env.BASEROW_API_KEY;

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
  console.log('Fetching live Agent 1...');
  const wf = await n8nRequest('GET', '/workflows/' + WF_ID);
  console.log('Workflow:', wf.name, '| nodes:', wf.nodes.length);

  // --- Add 3 new nodes ---

  // Node 1: Code node that checks Baserow for existing keyword.
  // Adds `duplicate: bool` to the item so all original fields (title, slug, etc.) are preserved.
  // Create Baserow Record continues to use $json.title, $json.slug, etc. unchanged.
  const checkDupNode = {
    id: 'a1g-dedup-check',
    name: 'Check Duplicate Keyword',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1808, 400],
    parameters: {
      mode: 'runOnceForEachItem',
      jsCode: [
        'const https = require(\'https\');',
        'const keyword = $input.item.json.keyword;',
        '',
        'const result = await new Promise((resolve, reject) => {',
        '  const encodedKw = encodeURIComponent(keyword);',
        '  const path = \'/api/database/rows/table/975683/?user_field_names=true&size=1&filter__Target%20Keyword__equal=\' + encodedKw;',
        '  const req = https.request({',
        '    hostname: \'api.baserow.io\',',
        '    path,',
        '    method: \'GET\',',
        '    headers: { \'Authorization\': \'Token ' + BASEROW_KEY + '\' }',
        '  }, res => {',
        '    let d = \'\';',
        '    res.on(\'data\', c => d += c);',
        '    res.on(\'end\', () => resolve(JSON.parse(d)));',
        '  });',
        '  req.on(\'error\', reject);',
        '  req.end();',
        '});',
        '',
        '// Preserve all original fields; add duplicate flag',
        'return [{ json: { ...$input.item.json, duplicate: result.count > 0 } }];'
      ].join('\n')
    }
  };

  // Node 2: IF node — branch on duplicate flag
  const ifDupNode = {
    id: 'a1g-dedup-if',
    name: 'IF: Already Exists?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: [2032, 400],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 1 },
        conditions: [{
          id: 'dup-flag-check',
          leftValue: '={{ $json.duplicate }}',
          rightValue: true,
          operator: { type: 'boolean', operation: 'equals' }
        }],
        combinator: 'and'
      }
    }
  };

  // Node 3: End node for skipped duplicates
  const endDupNode = {
    id: 'a1g-dedup-end',
    name: 'End: Keyword Already Exists',
    type: 'n8n-nodes-base.noOp',
    typeVersion: 1,
    position: [2256, 304],
    parameters: {}
  };

  wf.nodes.push(checkDupNode, ifDupNode, endDupNode);

  // Move Create Baserow Record to align with new dedup flow
  const createNode = wf.nodes.find(n => n.name === 'Create Baserow Record');
  createNode.position = [2256, 500];

  // --- Update connections ---

  // Parse OK? false (main[1]) was → Create Baserow Record; now → Check Duplicate Keyword
  const parseOkConns = wf.connections['Parse OK?'].main;
  parseOkConns[1] = [{ node: 'Check Duplicate Keyword', type: 'main', index: 0 }];

  // Check Duplicate Keyword → IF: Already Exists?
  wf.connections['Check Duplicate Keyword'] = {
    main: [[{ node: 'IF: Already Exists?', type: 'main', index: 0 }]]
  };

  // IF: Already Exists?
  //   main[0] (true  — duplicate exists) → End: Keyword Already Exists
  //   main[1] (false — no duplicate)     → Create Baserow Record
  wf.connections['IF: Already Exists?'] = {
    main: [
      [{ node: 'End: Keyword Already Exists', type: 'main', index: 0 }],
      [{ node: 'Create Baserow Record',       type: 'main', index: 0 }]
    ]
  };

  // --- PUT the updated workflow ---
  const settings = wf.settings || {};
  const allowed = ['executionOrder', 'saveManualExecutions', 'errorWorkflow', 'callerPolicy', 'timezone'];
  Object.keys(settings).forEach(k => { if (!allowed.includes(k)) delete settings[k]; });

  const putBody = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings };

  console.log('\nPushing updated workflow (' + wf.nodes.length + ' nodes)...');
  const updated = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);

  if (!updated.id) {
    console.error('PUT FAILED:', JSON.stringify(updated).substring(0, 400));
    return;
  }
  console.log('Updated. Active:', updated.active);

  // Print final node map
  console.log('\n=== AGENT 1 UPDATED NODE MAP ===');
  console.log('Schedule Trigger');
  console.log('  → Fetch GSC Striking Distance');
  console.log('  → Filter Striking Distance');
  console.log('  → Has Keywords?');
  console.log('      true  → End: No Keywords Today');
  console.log('      false → Claude Brief Generation');
  console.log('               → Parse Brief Fields');
  console.log('               → Parse OK?');
  console.log('                   true  → End: Parse Failed');
  console.log('                   false → Check Duplicate Keyword  [NEW]');
  console.log('                             → IF: Already Exists?  [NEW]');
  console.log('                                 true  → End: Keyword Already Exists  [NEW]');
  console.log('                                 false → Create Baserow Record  (unchanged)');
}

run().catch(console.error);
