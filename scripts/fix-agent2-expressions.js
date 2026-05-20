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
  console.log('Fetched workflow:', wf.name);

  // === Fix 1: Extract Record Set node ===
  const extractNode = wf.nodes.find(n => n.name === 'Extract Record');
  if (!extractNode) { console.error('Extract Record node not found'); return; }

  const assignments = extractNode.parameters.assignments.assignments;
  assignments.forEach(a => {
    if (a.value === '={{ .results[0].id }}') {
      a.value = '={{ $json.results[0].id }}';
      console.log('Fixed record_id expression');
    }
    if (a.value === "={{ .results[0]['Title'] }}") {
      a.value = "={{ $json.results[0]['Title'] }}";
      console.log('Fixed title expression');
    }
    if (a.value === "={{ .results[0]['Target Keyword'] }}") {
      a.value = "={{ $json.results[0]['Target Keyword'] }}";
      console.log('Fixed target_keyword expression');
    }
    if (a.value === "={{ .results[0]['Persona'] }}") {
      a.value = "={{ $json.results[0]['Persona'] }}";
      console.log('Fixed persona expression');
    }
    if (a.value === "={{ .results[0]['Thesis'] }}") {
      a.value = "={{ $json.results[0]['Thesis'] }}";
      console.log('Fixed thesis expression');
    }
  });

  // === Fix 2: Exa Deep Research jsonBody ===
  const exaNode = wf.nodes.find(n => n.name === 'Exa Deep Research');
  if (!exaNode) { console.error('Exa node not found'); return; }

  // The correct Exa jsonBody with proper $('Extract Record') references
  exaNode.parameters.jsonBody = `={
  "query": "{{ $('Extract Record').first().json.target_keyword }} {{ $('Extract Record').first().json.persona.replace(/_/g, ' ') }} statistics data case study operations 2025 2026",
  "numResults": 5,
  "type": "auto",
  "startPublishedDate": "2025-01-01",
  "contents": {
    "summary": {
      "query": "Extract: (1) specific statistics and percentages with sources, (2) real company or firm examples, (3) key operational pain points for the target business persona, (4) financial or efficiency impact numbers. Context: {{ $('Extract Record').first().json.thesis }}"
    }
  }
}`;
  console.log('Fixed Exa jsonBody expressions');

  // === PUT ===
  const settings = wf.settings || {};
  const allowed = ['executionOrder', 'saveManualExecutions', 'errorWorkflow', 'callerPolicy', 'timezone'];
  Object.keys(settings).forEach(k => { if (!allowed.includes(k)) delete settings[k]; });

  const putBody = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings };
  const updated = await n8nRequest('PUT', '/workflows/' + WF_ID, putBody);
  if (updated.id) {
    console.log('Workflow updated successfully. Active:', updated.active);
    // Verify
    const extractFixed = updated.nodes.find(n => n.name === 'Extract Record');
    const exaFixed = updated.nodes.find(n => n.name === 'Exa Deep Research');
    console.log('Verify record_id expr:', extractFixed.parameters.assignments.assignments[0].value);
    console.log('Verify Exa body (first 80):', exaFixed.parameters.jsonBody.substring(0, 80));
  } else {
    console.error('Update FAILED:', JSON.stringify(updated).substring(0, 300));
  }
}

run().catch(console.error);
