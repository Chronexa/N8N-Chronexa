# Senior n8n Architect's Handbook (Chronexa Edition)

This document defines the **State-of-the-Art (SOTA)** methods for building enterprise-grade n8n workflows at Chronexa.

---

## Current Stack at a Glance

| Service | Endpoint / Notes |
|---------|-----------------|
| **n8n** | https://n8n.chronexa.io — REST API at `/api/v1/` |
| **Baserow** | `https://api.baserow.io` — row auth via Database token (`Authorization: Token <key>`); table/field creation requires JWT (`Authorization: JWT <token>`) |
| **Framer CMS** | Published via framer-bridge on Railway (`https://framer-bridge-production-c7d8.up.railway.app`). Collection ID `L8b3IANtH`. Auth: `X-Bridge-Secret` header. |
| **ManyReach** | `https://api.manyreach.com/api/v2/` — Auth: `X-API-Key` header (NOT `Authorization: Bearer`) |
| **Anthropic** | Light tasks: `claude-haiku-4-5-20251001`. Content generation: `claude-sonnet-4-6`. Credential ID in n8n: `MBzkzU0jc7m1gBTJ`. |
| **Exa** | `https://api.exa.ai` — semantic news search and company crawl for the Outbound Engine and Researcher agent |
| **Gemini Imagen 3** | `https://generativelanguage.googleapis.com/v1beta` — hero image generation for Agent 4. Key currently stored in workflow URL (security debt). |

---

## 1. The "Pre-Flight" Research Protocol

Never start building a workflow immediately. A senior architect always:

1. **Fetch Live Truth First**: Run `node scripts/fetch-live.js` to download the current live workflow JSON from n8n. Never assume local `.json` files or in-memory context are current — they may be stale from a previous session.
2. **Explore the Template Library**: Check the 2,300+ available templates for existing patterns to avoid common pitfalls.
3. **Inspect the API Specs**: Use MCP `get_node(mode='full')` to see hidden parameters and advanced settings for every node you plan to use. Run this BEFORE writing any node JSON.
4. **Identify Critical Paths**: Determine which nodes are the "anchors" — in this project that means Baserow HTTP Request nodes, Anthropic AI nodes, and Framer bridge calls — and verify their authentication and body format requirements before building.

> **The anchor node in this project is Baserow.** Every blog pipeline agent and the Outbound Engine uses Baserow as the state store. If a Baserow HTTP Request node is misconfigured (wrong auth method, wrong body format, wrong filter syntax), the entire pipeline stalls silently.

---

## 2. Advanced Error Handling

"Junior" workflows assume the happy path. "Senior" workflows assume failure:

- **Node-Level Retries**: Configure "Retry on Failure" with exponential backoff for all HTTP Request nodes. External APIs (Baserow, ManyReach, Exa, Anthropic, Framer) all have transient failure modes.
- **Global Error Handler**: Every production workflow must reference the centralized error workflow (`errorWorkflow: "MKBhIfmRNZtPDJg0"`). Do not rely solely on node-level `onError` configurations.
- **Data Validation**: Use IF nodes to check required data before calling downstream services. An empty `$json.email` reaching ManyReach creates a corrupt prospect record.
- **Error Output Branches**: When `onError: 'continueErrorOutput'` is set, failures route to `main[1]`, not `main[0]`. Always wire both branches. `main[0]` = success, `main[1]` = error. Both branches receive the INPUT item — error detail is in `executionStatus`.
- **DLQ Pattern**: For workflows that process many records, always wire error branches to a Dead Letter Queue (Baserow row or Google Sheet) rather than silently dropping failed items.

---

## 3. High-Performance JSON Generation

- **Explicit Versioning**: n8n updates nodes frequently. Always pin to the specific `typeVersion` documented in the MCP node reference. Never rely on the default.
- **Minimized Data Bloat**: Use Set nodes to strip unnecessary fields between nodes. For high-volume workflows (Agent 2/3/4/5 run every 5 minutes), disable saving of successful executions (`saveSuccessfulExecutions: false`) to prevent database bloat.
- **Connection Clarity**: For nodes with multiple outputs (IF, Switch, AI Agent), always explicitly wire all branches including the false/default path.
- **No JSON.stringify in HTTP bodies**: n8n serializes `contentType: 'json'` bodies automatically. Using `JSON.stringify()` in a body expression double-encodes the payload — the remote API receives a string, not an object.

```js
// WRONG
"jsonBody": "={{ JSON.stringify({ \"key\": $json.value }) }}"

// CORRECT
"jsonBody": "={{ ({ \"key\": $json.value }) }}"
```

---

## 4. AI-Native Workflow Design

Chronexa specializes in AI Orchestration. Use these SOTA patterns:

- **LangChain over Legacy**: Prefer `@n8n/n8n-nodes-langchain` nodes for any AI task.
- **Structured Output**: Never rely on raw LLM text. Claude (and most LLMs) wrap JSON in markdown code fences. Always strip fences before parsing:

```js
$json.content[0].text
  .replace(/^```[a-z]*\s*/i, '')
  .replace(/\s*```$/, '')
  .trim()
```

Then `JSON.parse()` the result. Never trust `content[0].text` to be fence-free.

- **Multi-Agent Flow**: Design sub-workflows for specific AI "skills" (Research, Summarization, Drafting). The 5-agent blog pipeline is the canonical example — each agent does exactly one thing and hands off via a Baserow status transition.
- **Model Selection**: Use `claude-haiku-4-5-20251001` for lightweight routing/classification tasks. Use `claude-sonnet-4-6` for content generation (copywriting, cold emails). Haiku is ~20× cheaper — don't use Sonnet where Haiku suffices.
- **Bucket Routing**: When LLM input quality varies (e.g., some leads have rich news context, others have none), use an IF/Switch node to route to different prompt templates before calling the LLM. The Outbound Engine's bucket routing is the reference implementation.

---

## 5. Deployment Lifecycle

1. **Fetch Live Truth**: `node scripts/fetch-live.js` — download current workflow state before making any changes.
2. **Local Build**: Generate or patch JSON in `src/workflows/`.
3. **MCP Validation**:
   - `validate_node(mode='minimal')` — basic schema check
   - `validate_node(mode='full')` — full parameter validation
   - `validate_workflow()` — end-to-end workflow graph validation
4. **Deploy**: `PUT /api/v1/workflows/{id}` with exactly four keys: `{ name, nodes, connections, settings }`. Including any other keys (e.g., `id`, `active`, `createdAt`) causes a 400 error.
5. **Verify**: Fire a webhook or use the schedule-swap technique (see test scripts). Poll `/api/v1/executions/{id}?includeData=true` to inspect each node's output.
6. **Baserow state check**: For pipeline agents, query Baserow directly to confirm the record advanced to the expected status.

---

## 6. Baserow Auth Decision Tree

| Operation | Auth Method | Header |
|-----------|-------------|--------|
| Read / write rows | Database token | `Authorization: Token <BASEROW_API_KEY>` |
| Create / delete table or field | JWT (user login) | `Authorization: JWT <token>` |
| Get JWT | `POST /api/user/token-auth/` | body: `{ email, password }` |

- JWT access tokens expire in ~10 minutes. Re-login when expired.
- Database tokens (Token prefix) cannot create tables or fields — this is a hard Baserow constraint, not a permissions misconfiguration.
- Always use `?user_field_names=true` on row endpoints to avoid `field_XXXXXX` ID mapping.
- Single-select filter format: `filter__<field>__single_select_equal={OPTION_ID}` — use the numeric option ID.
- Plain text filter format: `filter__<field>__equal=<value>` — used for the blog pipeline Status field.

---

## 7. n8n Script Safety (CRITICAL)

Always write n8n workflow patch and test scripts as `.js` files. Run them with `node scripts/<name>.js`.

**Never use inline bash `node -e "..."` with double-quoted strings.** The shell silently expands `$json`, `$('NodeName')`, `${variable}`, and similar patterns to empty strings inside double-quoted bash strings. This corrupts every n8n expression in the workflow without any error message.

```bash
# WRONG — shell expands $json and $('NodeName') to empty string ""
node -e "const w = require('./workflow.json'); w.nodes[0].parameters.value = '$json.email'; ..."

# CORRECT — write to a .js file first
cat > scripts/patch-workflow.js << 'HEREDOC'
const w = require('./workflow.json');
w.nodes[0].parameters.value = "={{ $json.email }}";
// ...
HEREDOC
node scripts/patch-workflow.js
```

Use a single-quoted heredoc (`<< 'HEREDOC'`) if you must write the file inline from bash, which prevents shell expansion. Better still: open the file in an editor or use the Write tool directly.

---

## 8. Set Node (v3.4) Assignment Format

Every assignment in a Set node requires all four fields. Missing any field causes silent failures where the assignment is ignored:

```json
{
  "assignments": {
    "assignments": [
      {
        "id": "unique-uuid-here",
        "name": "output_field_name",
        "value": "={{ $json.source_field }}",
        "type": "string"
      }
    ]
  }
}
```

Valid `type` values: `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`.

---

## 9. ManyReach API Conventions

- **Auth**: `X-API-Key: <key>` header. Not `Authorization: Bearer`. Not a query param.
- **Campaign personalization**: Use `{custom1}`–`{custom20}` placeholders in campaign copy. Store personalized content in prospect custom fields at creation time.
- **followup wait**: `waitMin` max is 1000 — use `waitUnits: "Days"` for multi-day gaps.
- **409 on duplicate prospect**: Do not abort. Look up by email (`GET /api/v2/prospects?email={email}`), PATCH custom fields on the existing record, then add to campaign.

---

## 10. Attribution Requirement

Node documentation sourced from the n8n-mcp reference tool, conceived by Romuald Członkowski — [www.aiadvisors.pl/en](https://www.aiadvisors.pl/en). If using a community template as a base, include mandatory attribution in the workflow description field.

---

*Maintained by the Chronexa AI Strategy Team. Last updated: 2026-05-20.*
