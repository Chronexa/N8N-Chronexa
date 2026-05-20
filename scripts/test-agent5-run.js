/**
 * Schedule-swap validation test for Agent 5: Publisher (Baserow)
 * Framer bridge connect + publish + site deploy takes ~30-60s.
 * Total expected: ~60-90s. Swap window: 100s.
 *
 * IMPORTANT: Processes the lowest-ID ready_to_publish record (record 19 first).
 * Confirm only ONE record is intended to be processed before running.
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = 'qYIiCFzOoPMNFEmO';
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

function baserowGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.baserow.io' + path);
    const opts = {
      hostname: url.hostname, path: url.pathname + url.search, method: 'GET',
      headers: { 'Authorization': 'Token ' + BASEROW_KEY }
    };
    let data = '';
    const req = https.request(opts, res => {
      res.on('data', d => data += d);
      res.on('end', () => { resolve(JSON.parse(data)); });
    });
    req.on('error', reject); req.end();
  });
}

async function run() {
  // Show all ready_to_publish records so user knows what will be processed
  const allPending = await baserowGet('/api/database/rows/table/975683/?user_field_names=true&filter__Status__equal=ready_to_publish&size=10');
  console.log('=== PRE-TEST STATE ===');
  console.log('ready_to_publish records:', allPending.count);
  (allPending.results || []).forEach(r => {
    console.log(' -', r.id, '|', r.Slug, '| Framer Item ID:', r['Framer Item ID'] || 'EMPTY');
  });

  if (!allPending.results || allPending.results.length === 0) {
    console.log('No ready_to_publish records found — nothing to process.');
    return;
  }

  // Target is the first record returned (lowest ID — record 19 before record 55)
  const targetId = allPending.results[0].id;
  const targetSlug = allPending.results[0].Slug;
  console.log('\nTARGET record:', targetId, '|', targetSlug);
  console.log('Title:', allPending.results[0].Title);

  if (allPending.count > 1) {
    console.log('\nWARNING: Multiple ready_to_publish records exist.');
    console.log('Only record', targetId, 'will be processed (first by ID).');
    console.log('Record', allPending.results[1]?.id, 'will be processed in the next run.');
  }

  // Get last exec ID before test
  const execsBefore = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=1');
  const lastExecId = (execsBefore.data || [])[0]?.id || 0;
  console.log('\nLast known exec ID:', lastExecId);

  // Schedule swap: every-minute
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
  console.log('\nSchedule → every-minute. Waiting 100s (Framer bridge ~30-60s)...');

  await new Promise(r => setTimeout(r, 100000));

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
  let execToInspect = newExecs[0];
  if ((running.data || []).length > 0) {
    console.log('Execution still running — waiting 30 more seconds...');
    await new Promise(r => setTimeout(r, 30000));
    const execsFinal = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=5');
    const finalNew = execsFinal.data.filter(e => e.id > lastExecId);
    console.log('Final executions:', finalNew.map(e => e.id + ':' + e.status).join(', '));
    execToInspect = finalNew[0];
  }

  if (execToInspect) {
    await inspectExec(execToInspect.id, targetId);
  } else {
    console.log('No completed execution found. Checking record state directly...');
    await printRecord(targetId, targetSlug);
  }
}

async function inspectExec(execId, targetId) {
  const detail = await n8nRequest('GET', '/executions/' + execId + '?includeData=true');
  console.log('\nExec ' + execId + ' | status:', detail.status, '| finished:', detail.finishedAt);
  const runData = detail.data?.resultData?.runData || {};
  console.log('Node-by-node results:');
  Object.entries(runData).forEach(([nodeName, nodeRuns]) => {
    const last = nodeRuns[nodeRuns.length - 1];
    const status = last?.executionStatus || 'unknown';
    const out0 = last?.data?.main?.[0]?.[0]?.json;
    const out1 = last?.data?.main?.[1]?.[0]?.json;
    let brief = '';
    if (out0) brief = JSON.stringify(out0).substring(0, 140);
    else if (out1) brief = '[error branch] ' + JSON.stringify(out1).substring(0, 100);
    console.log('  [' + status + '] ' + nodeName + (brief ? ': ' + brief : ''));
    if (status === 'error') {
      console.log('    ERR:', (last.error?.message || '').substring(0, 200));
    }
  });

  await printRecord(targetId);
}

async function printRecord(targetId) {
  const r = await baserowGet('/api/database/rows/table/975683/' + targetId + '/?user_field_names=true');
  console.log('\n=== VALIDATION REPORT (record', targetId, ') ===');
  console.log('1. Status:           ', r.Status);
  console.log('2. Title:            ', r.Title);
  console.log('3. Slug:             ', r.Slug);
  console.log('4. Framer Item ID:   ', r['Framer Item ID'] || 'EMPTY — bridge may have failed');
  console.log('5. Error Log:        ', r['Error Log'] || '(none)');

  if (r['Framer Item ID']) {
    console.log('\nSUCCESS: Record published to Framer CMS with ID:', r['Framer Item ID']);
    console.log('Live URL (when deployed): https://chronexa.io/blog/', r.Slug);
  } else if (r.Status === 'published') {
    console.log('\nWARNING: Status=published but Framer Item ID is empty. Bridge returned without an item ID.');
  } else if (r.Status === 'ready_to_publish') {
    console.log('\nFAILED: Record rolled back to ready_to_publish. Check bridge logs on Railway.');
  } else {
    console.log('\nStatus is', r.Status, '— check execution logs above for details.');
  }
}

run().catch(console.error);
