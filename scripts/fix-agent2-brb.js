require('dotenv').config({ path: '.env' });
const https = require('https');

const N8N_BASE = process.env.N8N_API_URL.replace(/\/api\/v1\/?$/, '');
const N8N_KEY = process.env.N8N_API_KEY;
const WF_ID = '6SzXgyv0rMfA68l6';

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
  const wf = await n8nRequest('GET', '/workflows/' + WF_ID);
  console.log('Fetched:', wf.name);

  const brbNode = wf.nodes.find(n => n.name === 'Build Research Brief');
  if (!brbNode) { console.error('BRB node not found'); return; }

  // Replace the entire assignments with clean, properly escaped versions
  brbNode.parameters.assignments.assignments = [
    {
      id: 'rb-id',
      name: 'record_id',
      value: "={{ $('Extract Record').first().json.record_id }}",
      type: 'number'
    },
    {
      id: 'rb-brief',
      name: 'research_brief',
      // Use \\n instead of literal newlines — valid JS string escapes
      value: "={{ $json.results.map((r, i) => '## Source ' + (i + 1) + ': ' + r.title + '\\nURL: ' + r.url + '\\nPublished: ' + (r.publishedDate ? r.publishedDate.substring(0, 10) : 'N/A') + '\\n\\n' + (r.summary || 'No summary available')).join('\\n\\n---\\n\\n') }}",
      type: 'string'
    }
  ];

  // Verify no literal newlines
  const rbValue = brbNode.parameters.assignments.assignments[1].value;
  let hasRealNewlines = false;
  for (let i = 0; i < rbValue.length; i++) {
    if (rbValue.charCodeAt(i) === 10) { hasRealNewlines = true; break; }
  }
  console.log('Has literal newlines:', hasRealNewlines, '(should be false)');
  console.log('Value preview:', rbValue.substring(0, 100));

  const settings = wf.settings || {};
  const allowed = ['executionOrder', 'saveManualExecutions', 'errorWorkflow', 'callerPolicy', 'timezone'];
  Object.keys(settings).forEach(k => { if (!allowed.includes(k)) delete settings[k]; });

  const putBody = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings };
  const updated = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  if (updated.id) {
    console.log('Workflow updated. Active:', updated.active);
    const brbFixed = updated.nodes.find(n => n.name === 'Build Research Brief');
    console.log('Confirmed saved rb-brief value (first 80):', brbFixed.parameters.assignments.assignments[1].value.substring(0, 80));
  } else {
    console.error('Update FAILED:', JSON.stringify(updated).substring(0, 300));
  }
}

run().catch(console.error);
