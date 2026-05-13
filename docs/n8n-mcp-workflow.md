# n8n-mcp: Mandatory Pre-Build Workflow

## What is n8n-mcp?

`n8n-mcp` (by Romuald Członkowski — aiadvisors.pl) is a local MCP server that exposes the full n8n node library as queryable tools. It lives at `n8n-mcp-repo/` in this project root.

It provides:
- `search_nodes` — find nodes by keyword
- `get_node_info` — full schema for a specific node type (parameters, defaults, typeVersion)
- `validate_node` — check a node config against the live schema before deploying
- `validate_workflow` — full workflow structural validation
- `list_templates` — search 2,300+ community workflow templates

**Attribution required**: Any workflow using a template from this server must include attribution to Romuald Członkowski in the workflow description.

---

## Why We Didn't Use It (and What It Cost Us)

During the initial build of the Outbound Engine and Baserow/ManyReach integrations, we skipped the n8n-mcp research step and wrote nodes from intuition. This caused:

| Bug | Root Cause | Time Lost |
|---|---|---|
| HTTP Request body double-encoded | Didn't know `contentType: 'json'` auto-serialises — used `JSON.stringify` | ~45 min |
| Inline auth headers ignored | Didn't check that `authentication: 'genericCredentialType'` overrides inline headers | ~30 min |
| Set node assignments silently dropped | Didn't know all four fields (`id`, `name`, `value`, `type`) are required | ~20 min |
| n8n PUT returning 400 | Didn't know the four-key whitelist rule | ~15 min |

All of these are in the node schemas. `get_node_info` on `n8n-nodes-base.httpRequest` or `n8n-nodes-base.set` would have shown the correct parameter structure before we wrote a single line.

**Rule**: Run `get_node_info` before writing any node configuration. It takes 30 seconds and eliminates guesswork.

---

## Mandatory Pre-Build Checklist

Before building any new node or workflow, complete these steps in order:

### Step 1: Search templates

```
search_templates("keyword describing the workflow")
```

If a template exists that's ≥70% of what you need, start from it. Adapting is faster than building from scratch, and templates are validated.

Examples:
- `search_templates("baserow create row")`
- `search_templates("anthropic email generation")`
- `search_templates("webhook to google sheets")`

If you use a template, add to the workflow description:
```
Based on template "[Template Name]" by Romuald Członkowski — aiadvisors.pl
```

### Step 2: Get node schema for every node you plan to use

```
get_node_info("n8n-nodes-base.httpRequest")
get_node_info("n8n-nodes-base.set")
get_node_info("n8n-nodes-base.splitInBatches")
get_node_info("n8n-nodes-base.if")
get_node_info("n8n-nodes-base.switch")
```

From the schema, confirm:
- The correct `typeVersion` to pin
- Every required parameter and its accepted values
- The correct expression syntax for dynamic values
- Whether `onError` modes exist and what the output branches are

### Step 3: Write the node JSON

Use only parameters that appear in the schema. Do not set parameters that aren't documented — they may be silently ignored or cause validation errors.

### Step 4: Validate before deploying

```
validate_node(nodeConfig, mode='minimal')
validate_node(nodeConfig, mode='full')
validate_workflow(workflowJson)
```

Fix all errors before calling the n8n REST API. A validated workflow will deploy cleanly; an unvalidated one will fail with cryptic 400 errors.

### Step 5: Deploy

```js
// Whitelist rule: only these four keys
const payload = { name, nodes, connections, settings };
await axios.put(`https://n8n.chronexa.io/api/v1/workflows/${id}`, payload, { headers });
```

---

## Common Node Types and Their Gotchas

These were discovered by NOT checking the schema first. Now documented so you don't repeat it.

### HTTP Request (`n8n-nodes-base.httpRequest`, v4.2)

```json
{
  "typeVersion": 4.2,
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": { "parameters": [{ "name": "Authorization", "value": "Token abc" }] },
  "sendBody": true,
  "contentType": "json",
  "specifyBody": "json",
  "jsonBody": "={{ ({ \"key\": $json.value }) }}",
  "onError": "continueErrorOutput"
}
```

Critical facts the schema reveals:
- `contentType: 'json'` automatically adds `Content-Type: application/json` — do NOT add it in headers
- `authentication: 'none'` is required when using inline headers; `'genericCredentialType'` ignores them
- `jsonBody` expression must return an object, not a string — no `JSON.stringify`
- `onError: 'continueErrorOutput'` sends failures to `main[1]`, not `main[0]`

### Set (`n8n-nodes-base.set`, v3.4)

```json
{
  "typeVersion": 3.4,
  "mode": "manual",
  "assignments": {
    "assignments": [
      { "id": "unique-slug", "name": "field_name", "value": "={{ $json.source }}", "type": "string" }
    ]
  }
}
```

Critical facts:
- All four fields are required: `id`, `name`, `value`, `type`
- `id` can be any unique string — use a descriptive slug
- `type` must be one of: `string`, `number`, `boolean`, `object`, `array`
- Missing `id` or `type` causes silent failure (assignment is ignored)

### SplitInBatches (`n8n-nodes-base.splitInBatches`, v3)

```json
{
  "typeVersion": 3,
  "batchSize": 1,
  "options": {}
}
```

Returns `main[0]` while items remain, `main[1]` when the loop is done.

### IF (`n8n-nodes-base.if`, v2)

```json
{
  "typeVersion": 2,
  "conditions": {
    "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
    "conditions": [
      {
        "id": "condition-id",
        "leftValue": "={{ $json.someField }}",
        "rightValue": "expected_value",
        "operator": { "type": "string", "operation": "equals" }
      }
    ],
    "combinator": "and"
  }
}
```

`main[0]` = true branch, `main[1]` = false branch. Always connect both.

---

## MCP Server Setup (if not already running)

The MCP server lives at `n8n-mcp-repo/`. To start it for use in Claude Code:

```bash
cd n8n-mcp-repo
npm install
npm start
```

Then configure in Claude Code MCP settings. See the repo README for full configuration.

If the MCP server is available in the conversation, prefer `get_node_info` over guessing parameter names from memory.

---

## When MCP Saves the Most Time

| Scenario | MCP tool to use | Saves |
|---|---|---|
| "What parameters does this node accept?" | `get_node_info` | Prevents 400 errors on deploy |
| "Is my node config valid?" | `validate_node` | Catches schema mismatches before API call |
| "Does a template exist for this pattern?" | `search_templates` | Saves hours of build time |
| "What typeVersion should I pin?" | `get_node_info` | Prevents version-specific behaviour surprises |
| "Is this full workflow structurally valid?" | `validate_workflow` | Catches missing connections, orphaned nodes |

---

## The Rule

> **Never write a node configuration from memory or intuition. Always confirm the schema first.**

One `get_node_info` call takes 30 seconds. The bugs it prevents take 30–90 minutes each to diagnose. The math is not close.
