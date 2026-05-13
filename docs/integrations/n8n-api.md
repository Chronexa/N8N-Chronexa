# n8n REST API — Deployment & Operations Guide

## Instance
- **URL**: https://n8n.chronexa.io
- **API Base**: https://n8n.chronexa.io/api/v1
- **API Key**: stored in `.env` as `N8N_API_KEY`
- **Auth header**: `X-N8N-API-KEY: {key}`

---

## Live Workflows
| Workflow | ID | Trigger | Status |
|---|---|---|---|
| Chronexa Autonomous Outbound Engine v2.0 | `0I6zaFD0yrxumrFe` | Webhook | Active |
| Chronexa: Baserow → ManyReach Push | `KdugyCKQYcvGNUzi` | Schedule (hourly) | Active |
| Chronexa Feeder: Apollo CSV to V2 Engine | (local only) | Manual | Local JSON |

**Webhook URL**: `https://n8n.chronexa.io/webhook/chronexa-outbound`

---

## Deploying a Workflow (PUT pattern)

### The four-key whitelist rule
The n8n API only accepts these four keys in a PUT body. Anything else causes a 400:

```js
const payload = {
  name:        workflow.name,
  nodes:       workflow.nodes,
  connections: workflow.connections,
  settings:    workflow.settings
};
// Do NOT include: id, active, createdAt, updatedAt, versionId, tags, pinData
```

### Full deploy script pattern
```js
const axios = require('axios');

const N8N_KEY = process.env.N8N_API_KEY;
const WORKFLOW_ID = '0I6zaFD0yrxumrFe';
const headers = { 'X-N8N-API-KEY': N8N_KEY };

async function deploy() {
  // 1. Fetch live workflow
  const wf = (await axios.get(
    `https://n8n.chronexa.io/api/v1/workflows/${WORKFLOW_ID}`, { headers }
  )).data;

  // 2. Patch specific nodes
  const nodeIdx = wf.nodes.findIndex(n => n.id === 'TARGET_NODE_ID');
  wf.nodes[nodeIdx].parameters.someField = 'new value';

  // 3. PUT with whitelist
  const payload = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings };
  const resp = await axios.put(
    `https://n8n.chronexa.io/api/v1/workflows/${WORKFLOW_ID}`, payload, { headers }
  );
  console.log('Deployed:', resp.status, 'nodes:', resp.data.nodes?.length);
}
```

### Creating a new workflow
```js
const resp = await axios.post(
  'https://n8n.chronexa.io/api/v1/workflows',
  workflowJson,  // full workflow object including name, nodes, connections, settings
  { headers }
);
const newId = resp.data.id;
```

### Activating a workflow
```js
await axios.post(
  `https://n8n.chronexa.io/api/v1/workflows/${id}/activate`,
  {}, { headers }
);
```

---

## Testing a Workflow (Execution Polling)

### Fire + poll pattern
```js
async function fireAndWait(webhookUrl, payload, workflowId, headers) {
  // 1. Record last known execution
  const pre = await axios.get(
    `https://n8n.chronexa.io/api/v1/executions?limit=1&workflowId=${workflowId}`,
    { headers }
  );
  const lastId = pre.data.data[0]?.id;

  // 2. Fire
  await axios.post(webhookUrl, payload, { headers: { 'Content-Type': 'application/json' } });

  // 3. Wait for new execution to appear (poll until ID changes)
  let execId;
  for (let i = 0; i < 20; i++) {
    await sleep(3000);
    const r = await axios.get(
      `https://n8n.chronexa.io/api/v1/executions?limit=1&workflowId=${workflowId}`,
      { headers }
    );
    const newId = r.data.data[0]?.id;
    if (newId && newId !== lastId) { execId = newId; break; }
  }

  // 4. Wait for completion (poll stoppedAt)
  for (let i = 0; i < 36; i++) {
    await sleep(5000);
    const exec = await axios.get(
      `https://n8n.chronexa.io/api/v1/executions/${execId}?includeData=true`,
      { headers }
    );
    if (exec.data.stoppedAt) return exec.data;
  }
  throw new Error('Execution timed out');
}
```

### Inspecting node output from execution data
```js
const runData = execData.data?.resultData?.runData;

// Success output
const successItems = runData['Node Name']?.[0]?.data?.main?.[0];
// Error output (when onError: 'continueErrorOutput')
const errorItems  = runData['Node Name']?.[0]?.data?.main?.[1];

// Both contain the item's json field:
const value = successItems?.[0]?.json?.fieldName;
```

---

## Webhook Payload for Outbound Engine

```json
{
  "first_name":      "Jane",
  "last_name":       "Doe",
  "email":           "jane@example.com",
  "company_name":    "Acme Corp",
  "company_domain":  "acme.com",
  "title":           "COO",
  "industry":        "Healthcare Staffing",
  "keywords":        "occupational health, injury prevention",
  "technologies":    "Salesforce, QuickBooks",
  "num_employees":   "50",
  "annual_revenue":  "$5M"
}
```

All fields are optional except `first_name`, `last_name`, `email`, `company_name`, `company_domain`.
Apollo enrichment fields (`title`, `industry`, `keywords`, `technologies`, `num_employees`, `annual_revenue`) dramatically improve email quality — include them when available.

---

## Key Node IDs in Outbound Engine (`0I6zaFD0yrxumrFe`)

| Node Name | ID | Type | Role |
|---|---|---|---|
| Webhook Trigger | — | webhook | Entry point |
| Normalize Lead Input | `e04f095b` | set v3.4 | Maps body → clean fields |
| Perplexity Extract Triggers | — | httpRequest | RECENT_TRIGGER research |
| Parse Perplexity Response | `538a5139` | set v3.4 | Extracts + passes through |
| Gate Error Check | — | if | DLQ if Perplexity failed |
| Anthropic Match Routing Bucket | — | httpRequest | BUCKET 1/2/3 classification |
| Parse Anthropic Response | `cc49379c` | set v3.4 | Extracts bucket + passes through |
| Switch Bucket Router | — | switch | Routes by bucket |
| Anthropic Generate Cold Email | `76d924d9` | httpRequest | Generates subject + 4 emails as JSON |
| Parse Email Output | `89945788` | set v3.4 | Parses JSON, maps 13 output fields |
| Append to HITL Queue | `0b93bc8d` | httpRequest | POST to Baserow Leads table |
| Tag Sheets API Failure | — | set | Labels failure source |
| Append to DLQ Sheet | `1b752a25` | httpRequest | POST to Baserow with Status=DLQ |
