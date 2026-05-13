# n8n Node Patterns & Mistake Library

> Real bugs hit in production, documented as: **What we tried → What broke → Correct pattern.**
> Every entry here cost real debugging time. Read before writing any node.

---

## HTTP Request Node (v4.2)

### Mistake 1: JSON.stringify in body expression

**What we tried:**
```js
"jsonBody": "={{ JSON.stringify({ \"First Name\": $json.first_name }) }}"
```

**What broke:**
Baserow received a JSON-encoded *string* instead of an object. The API returned a 400 or wrote `"[object Object]"` to the field.

**Why it happens:**
When `contentType: 'json'`, n8n already serialises the expression result. Wrapping in `JSON.stringify` double-encodes it — you get a string containing JSON, not a JSON object.

**Correct pattern:**
```js
"jsonBody": "={{ ({ \"First Name\": $json.first_name || '' }) }}"
```
Plain object expression. Parentheses around the object literal are required to avoid n8n parser ambiguity.

---

### Mistake 2: Mixing genericCredentialType with inline headers

**What we tried:**
```json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [{ "name": "Authorization", "value": "Token abc123" }]
  }
}
```

**What broke:**
The HTTP request failed authentication. n8n looked for a stored credential of type `httpHeaderAuth` and ignored the inline header parameters entirely.

**Why it happens:**
`genericCredentialType` tells n8n to load auth from its credential store. Inline headers are only applied when `authentication` is `"none"`.

**Correct pattern:**
```json
{
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [{ "name": "Authorization", "value": "Token abc123" }]
  }
}
```

---

### Mistake 3: Misreading onError: continueErrorOutput

**What we tried:**
Checking `main[0]` output after a failed request, seeing no data, concluding the node didn't run.

**What broke:**
Nothing — the node ran fine. Failures route to `main[1]` (the error branch), not `main[0]`. We were inspecting the wrong output branch.

**Correct pattern:**
When `onError: 'continueErrorOutput'` is set:
- `main[0]` = success output (the API response)
- `main[1]` = error output (contains the INPUT item that caused the failure, not the HTTP error)

To see the actual HTTP error, check `executionStatus` and `error` fields in the raw execution data, not the output items.

---

### Mistake 4: Content-Type header conflicts

**What we tried:**
Manually adding `Content-Type: application/json` as a header parameter alongside `contentType: 'json'`.

**What broke:**
Duplicate Content-Type headers caused some APIs to return 400.

**Correct pattern:**
When `contentType: 'json'` is set, n8n adds the Content-Type header automatically. Never add it manually in `headerParameters`.

---

## n8n REST API (Workflow Deployment)

### Mistake 5: PUT with full workflow object

**What we tried:**
```js
const payload = fullWorkflowObject; // everything returned by GET
await axios.put(`/api/v1/workflows/${id}`, payload);
```

**What broke:**
400 Bad Request. The n8n API rejects unknown or read-only fields like `id`, `active`, `createdAt`, `updatedAt`, `versionId`, `tags`.

**Correct pattern:**
```js
const payload = {
  name: wf.name,
  nodes: wf.nodes,
  connections: wf.connections,
  settings: wf.settings
};
await axios.put(`/api/v1/workflows/${id}`, payload);
```
Only these four keys. Nothing else.

---

### Mistake 6: Polling stale execution ID

**What we tried:**
After firing a webhook, immediately calling `GET /api/v1/executions?limit=1` and assuming the result was the execution we triggered.

**What broke:**
Got the previous execution's ID. The new execution hadn't appeared yet.

**Correct pattern:**
```js
// 1. Capture last known ID before firing
const pre = await axios.get(`/api/v1/executions?limit=1&workflowId=${id}`);
const lastId = pre.data.data[0]?.id;

// 2. Fire webhook
await axios.post(webhookUrl, payload);

// 3. Poll until a DIFFERENT ID appears
while (true) {
  await sleep(3000);
  const r = await axios.get(`/api/v1/executions?limit=1&workflowId=${id}`);
  const newId = r.data.data[0]?.id;
  if (newId && newId !== lastId) { execId = newId; break; }
}

// 4. Then poll for stoppedAt
while (true) {
  await sleep(5000);
  const exec = await axios.get(`/api/v1/executions/${execId}?includeData=true`);
  if (exec.data.stoppedAt) break;
}
```

---

## Set Node (v3.4)

### Mistake 7: Missing required assignment fields

**What we tried:**
```json
{ "name": "first_name", "value": "={{ $json.body.first_name }}" }
```

**What broke:**
Silent failure — the assignment was ignored or caused a node error.

**Correct pattern:**
Every assignment requires all four fields:
```json
{
  "id": "any-unique-string",
  "name": "first_name",
  "value": "={{ $json.body.first_name || '' }}",
  "type": "string"
}
```
`id` can be any string — use a short descriptive slug. `type` must be one of: `string`, `number`, `boolean`, `object`, `array`.

---

## Anthropic / AI Nodes

### Mistake 8: Assuming Claude returns clean JSON

**What we tried:**
```js
JSON.parse($json.content[0].text)
```

**What broke:**
`SyntaxError: Unexpected token \`` — Claude wrapped the JSON in markdown fences:
```
```json
{ "subject": "...", "email_body": "..." }
```
```

**Correct pattern:**
Always strip fences before parsing, even when the system prompt says "no fences":
```js
const raw = $json.content[0].text
  .replace(/^```[a-z]*\s*/i, '')
  .replace(/\s*```$/, '')
  .trim();
JSON.parse(raw)
```

**System prompt that reduces (but doesn't eliminate) fence wrapping:**
```
Return ONLY valid JSON — no preamble, no markdown fences, no explanation.
```

---

## Baserow Integration

### Mistake 9: Using database token for schema operations

**What we tried:**
`POST /api/database/tables/database/435827/` with `Authorization: Token hvXc2...`

**What broke:**
`{"detail": "Authentication credentials were not provided."}` — even though the token was valid for row operations.

**Why it happens:**
Baserow database tokens are scoped to row CRUD only. Creating tables, fields, and views requires a user JWT obtained via `POST /api/user/token-auth/`.

**Correct pattern:**
```bash
# Get JWT (expires ~10 min)
curl -X POST https://api.baserow.io/api/user/token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"email": "team@chronexa.io", "password": "..."}'

# Use JWT for schema operations
curl -X POST https://api.baserow.io/api/database/fields/table/968761/ \
  -H "Authorization: JWT eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name": "Status", "type": "single_select", ...}'
```

---

### Mistake 10: Wrong single_select filter format

**What we tried:**
`filter__Status__equal=Approved` or `filter__Status__single_select_equal=Approved`

**What broke:**
Returned all rows (filter silently ignored) or 400 error.

**Correct pattern:**
Single-select filters require the **numeric option ID**, not the string value:
```
filter__Status__single_select_equal=6136390
```
Option IDs are returned when you GET the field schema or inspect a row response.

Our Status option IDs:
- `6136389` = Email Ready
- `6136390` = Approved
- `6136391` = In Campaign
- `6136392` = Replied
- `6136393` = Unsubscribed
- `6136394` = Bounced
- `6136395` = DLQ

---

## ManyReach Integration

### Mistake 11: Wrong auth header format

**What we tried:**
`Authorization: Bearer e905cb87-...` then `Authorization: Token e905cb87-...`

**What broke:**
All v2 endpoints returned 401 or URL_NOT_FOUND.

**Correct pattern:**
```
X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1
```
ManyReach v2 uses `X-API-Key`, not `Authorization`. This is non-standard and easy to miss.

---

### Mistake 12: Followup wait time exceeding max

**What we tried:**
`"waitMin": 4320, "waitUnits": "Minutes"` (= 3 days in minutes)

**What broke:**
`422 Validation Error: WaitMin must be an integer between 1 and 1000`

**Correct pattern:**
`waitMin` is the count in whatever unit `waitUnits` specifies — not always minutes:
```json
{ "waitMin": 3, "waitUnits": "Days" }
{ "waitMin": 7, "waitUnits": "Days" }
{ "waitMin": 14, "waitUnits": "Days" }
```

---

### Mistake 13: Aborting on 409 duplicate prospect

**What we tried:**
```js
if (response.status === 409) throw new Error('Duplicate');
```

**What broke:**
Existing leads already in ManyReach CRM could never be updated or re-added to a new campaign.

**Correct pattern:**
Handle 409 as an upsert signal:
```js
if (response.status === 409) {
  // Look up by email
  const found = await GET(`/api/v2/prospects?email=${email}`);
  const prospectId = found.items[0].prospectId;
  // Update custom fields with latest generated content
  await PATCH(`/api/v2/prospects/${prospectId}`, { custom1, custom2, custom3, custom4, custom5 });
  return prospectId;
}
```
