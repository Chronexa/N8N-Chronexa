/**
 * Schedule-swap validation test for Agent 3: Copywriter (Baserow)
 * Triggers one execution by swapping schedule to every-minute, waits, restores.
 * Reports the full before/after state of the processed record.
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = 'EbW7suHY7ji6EhsD';
const LAST_KNOWN_EXEC_ID = 0; // Will be set dynamically below

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
  // Get the first research_complete record to track
  const pending = await baserowGet('/api/database/rows/table/975683/?user_field_names=true&filter__Status__equal=research_complete&size=1');
  if (!pending.results || pending.results.length === 0) {
    console.log('No research_complete records found — nothing to process.');
    return;
  }
  const targetId = pending.results[0].id;
  const targetTitle = pending.results[0].Title;
  const targetKeyword = pending.results[0]['Target Keyword'];
  console.log('TARGET record: id=' + targetId + ' status=' + pending.results[0].Status);
  console.log('  Title: ' + targetTitle);
  console.log('  Keyword: ' + targetKeyword);
  console.log('  Research Brief: ' + (pending.results[0]['Research Brief'] ? pending.results[0]['Research Brief'].length + ' chars' : 'MISSING'));

  // Get current latest execution ID so we can find the new one after the test
  const execsBefore = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=1');
  const lastExecId = (execsBefore.data || [])[0]?.id || 0;
  console.log('\nLast known exec ID:', lastExecId);

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
  console.log('\nSchedule → every-minute. Waiting 95s for Claude to write the post...');
  console.log('(Claude needs ~30-60s to write 1800-2500 words)');

  await new Promise(r => setTimeout(r, 95000));

  // Restore schedule
  schedNode.parameters = origParams;
  putBody.nodes = wf.nodes;
  const restored = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  console.log('\nSchedule restored. Active:', restored.active);

  // Find new executions
  const execsAfter = await n8nRequest('GET', '/executions?workflowId=' + WF_ID + '&limit=5');
  const list = execsAfter.data || [];
  const newExecs = list.filter(e => e.id > lastExecId);
  console.log('\nNew executions: ' + newExecs.map(e => e.id + ':' + e.status).join(', '));

  // Inspect the most recent new execution
  const targetExec = newExecs[0];
  if (targetExec) {
    const detail = await n8nRequest('GET', '/executions/' + targetExec.id + '?includeData=true');
    console.log('\nExec ' + targetExec.id + ' | status: ' + detail.status);
    const runData = detail.data?.resultData?.runData || {};
    console.log('Node-by-node results:');
    Object.entries(runData).forEach(([nodeName, nodeRuns]) => {
      const last = nodeRuns[nodeRuns.length - 1];
      const status = last?.executionStatus || 'unknown';
      let brief = '';
      const out0 = last?.data?.main?.[0]?.[0]?.json;
      if (out0) brief = JSON.stringify(out0).substring(0, 160);
      console.log('  [' + status + '] ' + nodeName + (brief ? ': ' + brief : ''));
      if (status === 'error') {
        const err = last.error?.message || last.error?.description || '';
        console.log('    ERR: ' + err.substring(0, 300));
      }
    });
  }

  // Check Baserow record after
  const after = await baserowGet('/api/database/rows/table/975683/' + targetId + '/?user_field_names=true');
  console.log('\n=== VALIDATION REPORT ===');
  console.log('1. Status transition:    research_complete → ' + after.Status);
  console.log('2. Title:               ', after.Title);
  console.log('3. Target Keyword:       ' + after['Target Keyword']);
  console.log('4. Slug written?         ' + (after.Slug ? after.Slug : 'NO'));
  console.log('5. Meta Description?     ' + (after['Meta Description'] ? after['Meta Description'].length + ' chars' : 'NO'));
  console.log('6. HTML Body?            ' + (after['HTML Body'] ? after['HTML Body'].length + ' chars' : 'NO'));
  console.log('7. Word Count?           ' + (after['Word Count'] || 'NO'));
  if (after['HTML Body']) {
    console.log('\nHTML preview (first 300 chars):');
    console.log(after['HTML Body'].substring(0, 300));
  }
}

run().catch(console.error);
