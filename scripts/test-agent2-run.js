require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = '6SzXgyv0rMfA68l6';
const LAST_KNOWN_EXEC_ID = 11904;

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

function baserowGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.baserow.io' + path);
    const opts = {
      hostname: url.hostname, path: url.pathname + url.search, method: 'GET',
      headers: { 'Authorization': 'Token ' + process.env.BASEROW_API_KEY }
    };
    let data = '';
    const req = https.request(opts, res => { res.on('data', d => data += d); res.on('end', () => { resolve(JSON.parse(data)); }); });
    req.on('error', reject); req.end();
  });
}

async function run() {
  // Snapshot record 55 before
  const before = await baserowGet('/api/database/rows/table/975683/55/?user_field_names=true');
  console.log('BEFORE record 55: status=' + before.Status + ' title=' + before.Title);

  // Schedule swap
  const wf = await n8nRequest('GET', '/workflows/' + WF_ID);
  const schedNode = wf.nodes.find(n => n.type === 'n8n-nodes-base.scheduleTrigger');
  const origParams = JSON.parse(JSON.stringify(schedNode.parameters));

  schedNode.parameters = { rule: { interval: [{ field: 'cronExpression', expression: '* * * * *' }] } };

  const settings = wf.settings || {};
  const allowed = ['executionOrder', 'saveManualExecutions', 'errorWorkflow', 'callerPolicy', 'timezone'];
  Object.keys(settings).forEach(k => { if (!allowed.includes(k)) delete settings[k]; });
  const putBody = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings };

  const updated = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  if (!updated.id) { console.error('Schedule update FAILED:', JSON.stringify(updated)); return; }
  console.log('Schedule -> every-minute. Waiting 95s...');

  await new Promise(r => setTimeout(r, 95000));

  schedNode.parameters = origParams;
  putBody.nodes = wf.nodes;
  const restored = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  console.log('Schedule restored. Active:', restored.active);

  // Find new execution
  const execs = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=5');
  const list = execs.data || [];
  console.log('Recent execs:', list.map(e => e.id + ':' + e.status).join(', '));
  const newExec = list.find(e => e.id > LAST_KNOWN_EXEC_ID);

  if (newExec) {
    const detail = await n8nRequest('GET', '/executions/' + newExec.id + '?includeData=true');
    console.log('\nExec', newExec.id, '| status:', detail.status);
    const runData = detail.data?.resultData?.runData || {};
    Object.entries(runData).forEach(([nodeName, nodeRuns]) => {
      const last = nodeRuns[nodeRuns.length - 1];
      const status = last?.executionStatus || 'unknown';
      let brief = 'no output';
      const out0 = last?.data?.main?.[0]?.[0]?.json;
      if (out0) brief = JSON.stringify(out0).substring(0, 180);
      console.log('  [' + status + '] ' + nodeName + ': ' + brief);
      if (status === 'error') {
        const err = last.error?.message || last.error?.description || JSON.stringify(last.error || '');
        console.log('    ERR:', err.substring(0, 300));
      }
    });
  } else {
    console.log('No new execution found (IDs >' + LAST_KNOWN_EXEC_ID + ')');
  }

  // Check record 55 after
  const after = await baserowGet('/api/database/rows/table/975683/55/?user_field_names=true');
  console.log('\n--- VALIDATION RESULTS ---');
  console.log('1. Status transition:', before.Status, '->', after.Status);
  console.log('2. Title:', after.Title);
  console.log('3. Target Keyword:', after['Target Keyword']);
  if (after['Research Brief']) {
    console.log('4. Research Brief: YES (' + after['Research Brief'].length + ' chars)');
    console.log('   Preview:', after['Research Brief'].substring(0, 200));
  } else {
    console.log('4. Research Brief: NOT SET');
  }
}

run().catch(console.error);
