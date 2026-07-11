# Blog Automation Pipeline: Technical Execution Plan

**⚠️ SUPERSEDED — This document reflects a pre-production state from 2026-05-12.**
**Canonical reference: `docs/BLOG_AUTOMATION_ARCHITECTURE.md` (verified live state as of 2026-05-13)**

---

**Owner:** Ankit Dhiman  
**Status:** SUPERSEDED  
**Verified as of:** 2026-05-12 (stale — see canonical doc)

---

## 1. System Architecture

```
Agent 1 (Strategist)       Agent 2 (Researcher)       Agent 3 (Copywriter)
  Mon/Thu 8AM UTC     →      Every 10 min         →     Every 5 min
  Perplexity sonar-pro       Perplexity sonar-pro       Claude Sonnet 4.6
  3 briefs → Airtable        Research brief → AT        HTML blog → Airtable
  status: idea_generated  →  status: research_complete → status: copy_written

Agent 4 (Designer)         Agent 5 (Publisher)
  Every 5 min         →      Every 5 min
  Claude Haiku (prompt)      Framer REST API (direct)
  Imagen 3 via Gemini        Published flag = true
  status: generating_image → status: published
```

**Airtable — Source of Truth:**
- Base: `appDyvRC1mKQO6mMJ`
- Blog Pipeline Table: `tblEKgg9T1Z8tsj55`
- Credential ID: `dKOWpUaGvyy1S0eM`

**State Machine (Airtable `Status` field):**
```
idea_generated → researching → research_complete → writing → copy_written
  → generating_image → ready_to_publish → published / failed
```

**Infrastructure:** GCP self-hosted n8n at `https://n8n.chronexa.io`

---

## 2. Verified Current State

| Agent | Workflow ID | Status | Deployed | Working |
|---|---|---|---|---|
| Agent 1: Strategist | Not deployed | — | No | Unknown |
| Agent 2: Researcher | Not deployed | — | No | Unknown |
| Agent 3: Copywriter | `eVPVPBzfFp4obCu0` | Inactive | Yes | Content generation confirmed working |
| Agent 4: Designer | `3EVAeoUzCWBzlvKp` | Inactive | Yes | Gemini blocked (missing env var) |
| Agent 5: Publisher | `Pxyseu0euKXlTXsX` | Inactive | Yes | Framer sync never configured |

**Test record in Airtable:** `recPbwvDmlPrN1ddD`
- Current status: `generating_image` (stuck — needs reset)
- Word Count: 2,180 (content IS written)
- HTML Body: 14,334 chars (content IS saved)
- Cover Image URL: empty
- Framer Item ID: empty (never published)

**Old workflow versions to delete (zero runs, pure clutter):**
`DJ4gxguJBjILeHoi`, `EFr04d5Z3sV1HAGr`, `XUP7991Jbpa6aXjZ`, `EWYSMzNfHkjsdndo`

---

## 3. Blockers — Ranked by Priority

### P0 — Broken task runner (blocks Agents 1 & 2)
**Root cause:** On the GCP Docker deployment, the external n8n task runner process is not running. Every `n8n-nodes-base.code` node times out at 180s.  
**Fix:** Either set `N8N_RUNNERS_MODE=internal` in docker-compose.yml and restart, OR (safer, no server access required) replace all Code nodes with Set nodes before deploying Agents 1 and 2.  
**Agents affected:** Agent 1 (2 Code nodes), Agent 2 (1 Code node)  
**Decision:** Replace Code nodes with Set nodes. Do not require server access to unblock pipeline.

### P1 — GEMINI_API_KEY not in n8n environment (blocks Agent 4)
**Root cause:** The key exists in the local `.env` file on the dev machine, but the GCP Docker n8n container does not read that file. The key must be declared in the `environment:` block of `docker-compose.yml` on the GCP server and the container restarted.  
**Fix:** User action required — SSH to GCP, add `GEMINI_API_KEY=<key>` to docker-compose.yml environment block, run `docker compose up -d`.  
**Workaround if GCP access is unavailable:** Make Agent 4 skip Gemini entirely — generate the image prompt via Claude Haiku (already working), store it in `Cover Image Prompt` field, set `Cover Image URL` to empty, set status to `ready_to_publish`. Images can be added manually later.

### P2 — Agent 5 uses Airtable sync (Framer native sync never configured)
**Root cause:** The current Agent 5 writes to an Airtable "Imported table" (`tblcbyRfuFfABDmFN`) and relies on a Framer-Airtable native CMS sync that was never set up in the Framer editor. There is no such sync active.  
**Fix (correct approach):** Rewrite Agent 5 to call the **Framer REST API directly** using the known field IDs from the Framer Blog collection (`L8b3IANtH`). This is deterministic and does not require any one-time manual step in the Framer editor.

### P3 — Agents 1 & 2 never deployed
**Root cause:** Build never progressed past Agents 3/4/5.  
**Fix:** Fix Code nodes → deploy → activate both agents.

### P4 — Test record stuck at `generating_image`
**Root cause:** Previous Agent 4 run locked the record but Gemini failed (P1). The record status was never reset.  
**Fix:** Airtable MCP update — set `recPbwvDmlPrN1ddD` status back to `copy_written` so Agent 4 can pick it up.

---

## 4. Framer REST API Publishing Reference

Agent 5 must be rewritten to use this API directly. Do not use Airtable sync.

**Collection ID:** `L8b3IANtH`  
**Token:** `$env.FRAMER_API_TOKEN` (already in n8n environment)  
**Endpoint:** `POST https://api.framer.com/sites/{siteId}/collections/{collectionId}/items`

**Field ID Mapping (CRITICAL — use these exact IDs):**
```
zD3ZKyyO9  → Cover Image (image URL string)
vJMe6fpJL  → Published (boolean) — set true to go live
S9w7PJblN  → Category (enum string) — value: "Blog"
eu1SUO8Ae  → Title (string)
Ot6aVH0Gv  → Short Description / Meta (string)
mmsKK_xBb  → Publication Date (ISO 8601 date string)
fSfrbBQqV  → Body Content (HTML string — Framer formattedText)
AblEkj9p6  → Author Name (enum) — value: "Ankit Dhiman"
CEKcF7GJb  → Author Title (enum) — value: "Head of Strategy"
x2h9g6E14  → Author Bio (enum)
Kgwuwd_oX  → Author Photo (image URL string)
```

**HTML format required by Framer:** Tags must include `dir="auto"` attribute.
```html
<h2 dir="auto">Heading Text</h2>
<p dir="auto">Paragraph text here.</p>
```
Agent 3's current HTML output does NOT include `dir="auto"`. Agent 5 must post-process the HTML before sending to Framer.

---

## 5. Execution Phases

Complete these phases in order. Do not skip ahead.

### Phase 1 — Cleanup and Unblock (no code changes required)
1. Delete 4 old workflow versions: `DJ4gxguJBjILeHoi`, `EFr04d5Z3sV1HAGr`, `XUP7991Jbpa6aXjZ`, `EWYSMzNfHkjsdndo`
2. Reset test record `recPbwvDmlPrN1ddD` status from `generating_image` to `copy_written`
3. **[User action]** Add `GEMINI_API_KEY` to GCP docker-compose.yml and restart n8n container

### Phase 2 — Fix and Deploy Agent 5 (Framer REST API)
This is the highest-leverage fix because publishing is the final blocker even if content is ready.

Rewrite Agent 5 with these changes:
- Replace the Airtable "Create Blog in Airtable CMS" node with an HTTP Request node calling the Framer REST API
- Add a Set node before the Framer call to post-process HTML (inject `dir="auto"` into all tags)
- Map all Framer field IDs correctly
- Keep Mark Published step — update Airtable record with `Status: published` and `Framer Item ID` from the API response

**Validate E2E:** Manually trigger Agent 5 (set a test record to `ready_to_publish`). Confirm the post appears on `chronexa.io/blog`.

### Phase 3 — Fix and Deploy Agent 4 (Image generation)
If GEMINI_API_KEY is now in the n8n environment:
- Activate existing Agent 4 (`3EVAeoUzCWBzlvKp`) — no code changes needed
- Fix the Save Image URL node: currently hardcodes `Cover Image URL: ""` — change this to `={{ $json.data.link }}` from the Imgur response OR integrate Cloudflare R2/S3 for image hosting

If GEMINI_API_KEY is NOT yet available:
- Keep Agent 4 in bypass mode (skip Gemini, set `Cover Image URL` to empty, set status to `ready_to_publish` directly)
- Pipeline will still work end-to-end, posts will just have no cover image

### Phase 4 — Fix and Deploy Agent 1 (Strategist)
Replace 2 Code nodes with Set nodes:

**Node: "Aggregate Existing Titles" — Replace Code with Set node**
The Code node aggregates existing titles from Airtable results. Since this reads multiple items and joins them, use n8n's built-in Aggregate node (`n8n-nodes-base.aggregate`) to join the Title field, then pass the result to Perplexity.

Alternative (simpler): Remove this dedup step entirely for V1. Perplexity already has context in the system prompt. The real dedup protection is the Airtable filter itself — if a topic is already in the pipeline, Perplexity won't generate a duplicate because it's instructed not to. Add the dedup node back in V2 once the pipeline is proven.

**Node: "Parse Blog Briefs" — Replace Code with Set node**
The Code node parses Perplexity's JSON array response. Perplexity reliably returns clean JSON (unlike Claude). However, since Set node expressions cannot call `JSON.parse()`, use a different approach:
- Change the Perplexity prompt to return **delimiter-separated** text (same pattern as Agent 3) instead of JSON
- Format: `%%BRIEF_1%%`, `%%BRIEF_2%%`, `%%BRIEF_3%%` each containing pipe-delimited fields
- Parse with `.split()` in Set node expressions

OR: Use the n8n **Extract from Text** node (regex-based) to pull structured data without Code node.

**Preferred approach:** Use Perplexity's JSON output but route through n8n's built-in **JSON Parse** node if available, OR restructure as delimiter format consistent with the rest of the pipeline.

### Phase 5 — Fix and Deploy Agent 2 (Researcher)
Replace 1 Code node with Set node:

**Node: "Extract Research" — Replace Code with Set node**
The Code node simply extracts `choices[0].message.content` and appends citations. This is straightforward with a Set node:

```json
{
  "assignments": {
    "assignments": [
      { "id": "assign-record-id", "name": "record_id", "value": "={{ $('Get Pending Record').first().json.id }}", "type": "string" },
      { "id": "assign-research", "name": "research_brief", "value": "={{ $json.choices[0].message.content }}", "type": "string" }
    ]
  }
}
```

Citations can be handled separately if needed (Perplexity returns them in `$json.citations` array). For V1, the research content alone is sufficient.

### Phase 6 — Full E2E Test
1. Manually create 1 test record in Airtable `tblEKgg9T1Z8tsj55` with status `idea_generated` and a title
2. Activate all 5 agents in order (1 → 2 → 3 → 4 → 5)
3. Monitor status progression in Airtable: `idea_generated` → `researching` → `research_complete` → `writing` → `copy_written` → `generating_image` → `ready_to_publish` → `published`
4. Verify post appears on `chronexa.io/blog`
5. If all stages pass, run Agent 1 on its natural schedule (Mon/Thu 8AM UTC) for ongoing production

---

## 6. Claude Execution Rules (Non-Negotiable)

These rules exist because of real bugs discovered in production. Follow them exactly.

### Rule 1 — Research before touching any node
Before writing or editing any node, run `get_node(mode='full')` via n8n-mcp for that node type. The mistake library at `docs/n8n-node-patterns.md` must be reviewed at session start.

### Rule 2 — Never use Code nodes
The GCP self-hosted n8n task runner is broken. Any `n8n-nodes-base.code` node will timeout at 180s. Replace all Code nodes with Set nodes, Aggregate nodes, or other built-in nodes. This is not optional.

### Rule 3 — Set node v3.4 format is strict
The only valid format for Set node (typeVersion 3.4) is:
```json
{
  "mode": "manual",
  "duplicateItem": false,
  "assignments": {
    "assignments": [
      { "id": "unique-id", "name": "field_name", "value": "={{ expression }}", "type": "string|number|boolean" }
    ]
  },
  "options": {}
}
```
The `fields.values` format from older typeVersions is silently ignored — no error, but no output. This caused the primary parsing failure in Agent 3.

### Rule 4 — Never use JSON.stringify in expressions
Set node expressions cannot call `JSON.stringify()`. Use plain object expressions:
```
WRONG:  "={{ JSON.stringify({ key: $json.value }) }}"
RIGHT:  "={{ ({ key: $json.value }) }}"
```

### Rule 5 — Never mix auth methods in HTTP Request nodes
```
WRONG: authentication: "genericCredentialType" + inline headerParameters
RIGHT: authentication: "none" + sendHeaders: true + explicit headerParameters
```
When using a stored credential (like Perplexity `httpHeaderAuth`), use `predefinedCredentialType` and reference the credential ID. Do not duplicate headers.

### Rule 6 — Claude API key goes in headerParameters directly
The n8n stored Anthropic credential injects `Authorization: Bearer` which the Anthropic API rejects. Always pass the key directly:
```json
{ "name": "x-api-key", "value": "sk-ant-api03-..." }
```

### Rule 7 — Use delimiter format for AI output, never JSON
When an AI node must return structured data, use named delimiters:
```
%%TITLE%%
<value>
%%SLUG%%
<value>
%%HTML_START%%
<content>
%%HTML_END%%
```
Parse with `.split('%%DELIMITER%%')[1].split('%%NEXT%%')[0].trim()` in Set node expressions. JSON parsing is not available in Set node expressions.

### Rule 8 — Always lock before processing
Every agent must: (1) Fetch the record, (2) Immediately update status to an in-progress state (e.g., `writing`, `generating_image`). This prevents two concurrent agent runs from claiming the same record. Never skip the lock step.

### Rule 9 — Deploy with only 4 keys
n8n REST API `PUT /api/v1/workflows/{id}` only accepts: `name`, `nodes`, `connections`, `settings`. Any other key causes a 400 error.

### Rule 10 — Validate before activating
Run `validate_workflow` via n8n-mcp after every JSON change. Fix all errors before deploying. Never activate a workflow that has validation warnings on required fields.

### Rule 11 — Test one record manually before enabling schedule
After deploying any agent, manually trigger it with exactly 1 test record before enabling the scheduler. Confirm the record's Airtable status changed to the expected next state.

### Rule 12 — Read n8n execution data, not just logs
When debugging, fetch execution data via: `GET /api/v1/executions/{id}?includeData=true`. Inspect each node's `data.main[0][0].json` to see actual output. Logs alone are insufficient — execution data shows exactly what each node produced.

---

## 7. Framer HTML Post-Processing Spec

Agent 3 currently outputs HTML without `dir="auto"` attributes. Framer's CMS requires them for proper rendering. Agent 5 must transform the HTML before publishing.

**Transformation required (in Agent 5 Set node, before Framer API call):**
```
Replace: <h2>
With:    <h2 dir="auto">

Replace: <p>
With:    <p dir="auto">

Replace: <ul>
With:    <ul dir="auto">

Replace: <li>
With:    <li dir="auto">
```

This can be done in a Set node expression using `.replace()` chaining. Do NOT use a Code node.

Example expression:
```
={{ $('Map to Framer Schema').first().json['Content']
    .replace(/<h2>/g, '<h2 dir="auto">')
    .replace(/<p>/g, '<p dir="auto">')
    .replace(/<ul>/g, '<ul dir="auto">')
    .replace(/<li>/g, '<li dir="auto">') }}
```

---

## 8. Verification Checklist (Run After Each Phase)

**After Phase 1:**
- [ ] 4 old workflow versions deleted
- [ ] `recPbwvDmlPrN1ddD` status = `copy_written` in Airtable
- [ ] GCP docker-compose.yml has `GEMINI_API_KEY` and container restarted

**After Phase 2 (Agent 5):**
- [ ] Agent 5 deployed with Framer REST API node (not Airtable CMS create)
- [ ] Manually set one record to `ready_to_publish`
- [ ] Agent 5 triggered manually → record status = `published`
- [ ] Post visible on `chronexa.io/blog`
- [ ] Framer Item ID saved back to Airtable

**After Phase 3 (Agent 4):**
- [ ] Reset record to `copy_written`
- [ ] Agent 4 triggered manually → status = `ready_to_publish`
- [ ] `Cover Image URL` populated in Airtable (or confirmed empty if bypassing Gemini)

**After Phase 4 (Agent 1):**
- [ ] No Code nodes present in workflow JSON
- [ ] Agent 1 triggered manually → 3 new records in Airtable with `idea_generated`

**After Phase 5 (Agent 2):**
- [ ] No Code nodes present in workflow JSON
- [ ] Agent 2 triggered manually → 1 record updated to `research_complete` with Research Brief populated

**After Phase 6 (E2E):**
- [ ] All 5 agents active simultaneously
- [ ] Fresh record travels full pipeline without manual intervention
- [ ] Published post appears on website within expected time window (~25 min total)

---

## 9. ID Reference

| Resource | ID |
|---|---|
| Airtable Base | `appDyvRC1mKQO6mMJ` |
| blog_pipeline Table | `tblEKgg9T1Z8tsj55` |
| Imported table (Airtable) | `tblcbyRfuFfABDmFN` |
| Airtable Credential | `dKOWpUaGvyy1S0eM` |
| Framer Blog Collection | `L8b3IANtH` |
| Perplexity Credential | `kFDVD9DToxRCjPcB` |
| Agent 3 (Copywriter) | `eVPVPBzfFp4obCu0` |
| Agent 4 (Designer) | `3EVAeoUzCWBzlvKp` |
| Agent 5 (Publisher) | `Pxyseu0euKXlTXsX` |
| Test Airtable Record | `recPbwvDmlPrN1ddD` |
| n8n instance | `https://n8n.chronexa.io` |

---

## 10. Decisions Made (Do Not Re-Open Without Reason)

| Decision | Rationale |
|---|---|
| No Code nodes | GCP task runner broken; Set nodes are equivalent and deterministic |
| Delimiter format for Claude output (not JSON) | JSON.parse unavailable in Set node expressions; delimiters proven working in Agent 3 |
| Framer REST API instead of Airtable sync | Airtable sync requires one-time Framer editor config that was never done; REST API is deterministic |
| Process 1 record at a time per agent run | Controls API cost; prevents race conditions; simplifies error attribution |
| Agent 4 image bypass as fallback | Unblocks pipeline end-to-end if GEMINI_API_KEY unavailable; images can be added later |
| `dir="auto"` injected in Agent 5, not Agent 3 | Agent 3 is Claude's raw output; transformation is a publishing concern, not a writing concern |
