/**
 * Schedule-swap validation test for Agent 4: Image Designer (Baserow)
 * Gemini image generation takes ~20-30s, Claude prompt ~5s, Imgbb upload ~5s.
 * Total expected: ~60-90s. Swap window: 95s.
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = 'Z2ehkUAAYsub4l2i';

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
        'X-N8N-API-KEY': N8N_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json',
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
    const opts = { hostname: url.hostname, path: url.pathname + url.search, method: 'GET', headers: { 'Authorization': 'Token ' + process.env.BASEROW_API_KEY } };
    let data = '';
    const req = https.request(opts, res => { res.on('data', d => data += d); res.on('end', () => { resolve(JSON.parse(data)); }); });
    req.on('error', reject); req.end();
  });
}

async function run() {
  // Find a copy_written record
  const pending = await baserowGet('/api/database/rows/table/975683/?user_field_names=true&filter__Status__equal=copy_written&size=1');
  if (!pending.results || pending.results.length === 0) {
    console.log('No copy_written records found. Checking for copy_written status...');
    const all = await baserowGet('/api/database/rows/table/975683/?user_field_names=true&size=10');
    console.log('All statuses:', (all.results||[]).map(r => r.id + ':' + r.Status).join(', '));
    return;
  }
  const targetId = pending.results[0].id;
  console.log('TARGET record:', targetId, '| Status:', pending.results[0].Status);
  console.log('  Title:', pending.results[0].Title);
  console.log('  HTML Body:', pending.results[0]['HTML Body'] ? pending.results[0]['HTML Body'].length + ' chars' : 'MISSING');

  // Get last exec ID before test
  const execsBefore = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=1');
  const lastExecId = (execsBefore.data || [])[0]?.id || 0;
  console.log('Last known exec ID:', lastExecId);

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
  console.log('\nSchedule → every-minute. Waiting 110s (Gemini image gen can take ~60s)...');

  await new Promise(r => setTimeout(r, 110000));

  // Restore schedule
  schedNode.parameters = origParams;
  putBody.nodes = wf.nodes;
  const restored = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  console.log('Schedule restored. Active:', restored.active);

  // Find new executions
  const execsAfter = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=5');
  const list = execsAfter.data || [];
  const newExecs = list.filter(e => e.id > lastExecId);
  console.log('\nNew executions:', newExecs.map(e => e.id + ':' + e.status).join(', ') || 'none (may still be running)');

  // Check if still running
  const running = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&status=running&limit=5');
  if ((running.data || []).length > 0) {
    console.log('Execution still running — waiting 30 more seconds...');
    await new Promise(r => setTimeout(r, 30000));
    const execsFinal = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=5');
    const finalList = execsFinal.data || [];
    const finalNew = finalList.filter(e => e.id > lastExecId);
    console.log('Final executions:', finalNew.map(e => e.id + ':' + e.status).join(', '));
    if (finalNew[0]) await inspectExec(finalNew[0].id, targetId);
  } else if (newExecs[0]) {
    await inspectExec(newExecs[0].id, targetId);
  } else {
    // Execution may not be saved yet — check record state directly
    console.log('No completed execution found. Checking record state...');
    await printRecord(targetId);
  }
}

async function inspectExec(execId, targetId) {
  const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
  const N8N_KEY = process.env.N8N_API_KEY;

  function n8nGet(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(N8N_BASE + '/api/v1' + path);
      const lib = url.protocol === 'https:' ? https : require('http');
      const opts = { hostname: url.hostname, port: 443, path: url.pathname + url.search, method: 'GET', headers: { 'X-N8N-API-KEY': N8N_KEY, 'Accept': 'application/json' } };
      let data = '';
      const req = lib.request(opts, res => { res.on('data', d => data += d); res.on('end', () => { resolve(JSON.parse(data)); }); });
      req.on('error', reject); req.end();
    });
  }

  const detail = await n8nGet('/executions/' + execId + '?includeData=true');
  console.log('\nExec ' + execId + ' | status:', detail.status, '| finished:', detail.finishedAt);
  const runData = detail.data?.resultData?.runData || {};
  console.log('Node-by-node results:');
  Object.entries(runData).forEach(([nodeName, nodeRuns]) => {
    const last = nodeRuns[nodeRuns.length - 1];
    const status = last?.executionStatus || 'unknown';
    const out0 = last?.data?.main?.[0]?.[0]?.json;
    let brief = out0 ? JSON.stringify(out0).substring(0, 140) : '';
    console.log('  [' + status + '] ' + nodeName + (brief ? ': ' + brief : ''));
    if (status === 'error') console.log('    ERR:', (last.error?.message || '').substring(0, 200));
  });

  await printRecord(targetId);
}

async function printRecord(targetId) {
  const r = await baserowGet('/api/database/rows/table/975683/' + targetId + '/?user_field_names=true');
  console.log('\n=== VALIDATION REPORT (record', targetId, ') ===');
  console.log('1. Status:              ', r.Status);
  console.log('2. Title:               ', r.Title);
  console.log('3. Target Keyword:       ' + r['Target Keyword']);
  console.log('4. Cover Image URL:      ' + (r['Cover Image URL'] || 'EMPTY'));
  console.log('5. Cover Image Prompt:   ' + (r['Cover Image Prompt'] ? r['Cover Image Prompt'].substring(0, 120) + '...' : 'EMPTY'));
  if (r['Cover Image URL']) {
    console.log('\n   Image URL confirmed:', r['Cover Image URL']);
  }
}

run().catch(console.error);
