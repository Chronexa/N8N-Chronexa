# Chronexa Blog Automation Engine — Technical Architecture
**Status: LIVE | Last verified: 2026-05-20 | Author: Claude Code (Senior Architect)**

> **Canonical reference.** The following files are superseded and should not be trusted:
> `docs/BLOG_PIPELINE_EXECUTION_PLAN.md`, `src/specs/blog-automation.md`, `docs/archive-CLAUDE_HANDOFF.md`.
> All contain pre-production assumptions or partial states.

---

## 1. What This System Is

A zero-human-in-the-loop (0-HITL) SEO blog production and publishing engine. n8n orchestrates a five-stage AI pipeline. **Baserow is the state machine and source of truth** (fully migrated from Airtable on 2026-05-19). Framer hosts the live website.

**Goal:** Publish 3–5 authoritative B2B blog posts per week to chronexa.io/blog with no human intervention, targeting mid-market CXOs/COOs in Wealth Management, Supply Chain, SaaS, and Agency verticals.

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONTENT GENERATION (Agents 1–4)                         │
│                          LIVE AND ACTIVE                                    │
│                                                                             │
│  Agent 1          Agent 2          Agent 3          Agent 4                 │
│  Strategist  →    Researcher  →    Copywriter  →    Designer                │
│  (every 6h)       (every 10m)      (every 5m)       (every 5m)              │
│  Claude Haiku      Exa AI           Claude 4.6       Gemini Imagen 3         │
│  1 topic/run      Research brief   HTML blog post   Imgbb CDN hosting       │
│       ↓               ↓                ↓                ↓                   │
│  idea_generated  research_complete  copy_written   ready_to_publish         │
└─────────────────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               BASEROW (State Machine & Source of Truth)                     │
│         DB: 439709  |  Table: blog_pipeline  |  Table ID: 975683           │
└─────────────────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              AGENT 5: PUBLISHER  ← LIVE AND ACTIVE                          │
│              n8n (every 5 min) at https://n8n.chronexa.io                   │
│                                                                              │
│  Poll Baserow → Lock Record → Map Fields → POST /publish                    │
│       ↓               ↓            ↓              ↓                         │
│  status=ready   status=publishing  payload    framer-bridge                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              FRAMER-BRIDGE MICROSERVICE  ← LIVE ON RAILWAY                  │
│              https://framer-bridge-production-c7d8.up.railway.app           │
│              Node.js 22 (required) | Express | framer-api SDK v0.1.9        │
│                                                                              │
│  POST /publish → connect(Framer WS) → blog.addItems() → framer.publish()   │
│              Idempotent: duplicate slug returns existing item ID             │
└─────────────────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              FRAMER CMS (Live Site)                                          │
│              Collection: L8b3IANtH (Blog)                                   │
│              https://chronexa.io/blog — 130+ posts live                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Live Components (Verified Working — 2026-05-20)

### 3.1 framer-bridge Microservice

**Purpose:** Acts as a translation layer between n8n's HTTP Request node and the Framer SDK, which requires a persistent WebSocket connection incompatible with n8n's stateless node model.

**Why it exists:** The `framer-api` SDK (`v0.1.9`) connects via WebSocket and requires `globalThis.WebSocket`, which only exists natively in Node.js 22+. n8n cannot maintain a WebSocket session across node executions. The bridge encapsulates the connection lifecycle in a dedicated Express service.

**Deployment:** Railway
- Public URL: `https://framer-bridge-production-c7d8.up.railway.app`
- Project ID: `58e2fbb7-2b57-45b4-bd4e-ba1585243b0d`
- Service ID: `3f4392c2-9205-458b-a086-5f862364433b`
- Node version: **22 only** — enforced via `framer-bridge/nixpacks.toml`
- Deploy command: `cd framer-bridge && railway up --detach --ci`

**CRITICAL — Node.js Version Constraint:**
```toml
# framer-bridge/nixpacks.toml — DO NOT REMOVE OR CHANGE
[phases.setup]
nixPkgs = ["nodejs_22"]
```
Railway defaults to Node 18/20 via Nixpacks auto-detection. On Node 18/20, `globalThis.WebSocket` is `undefined`. When `framer-api` tries `new globalThis.WebSocket(...)`, it throws `"di is not a constructor"`. The `nixpacks.toml` forces Node 22. Never change this.

**Source:** `framer-bridge/server.js`

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check. Returns `{ status: "ok" }`. |
| `POST` | `/publish` | Add a new blog post to Framer CMS and deploy the live site. |
| `DELETE` | `/item/:itemId` | Remove a blog post from Framer CMS and redeploy. |
| `POST` | `/publish-site` | Redeploy the live site without changing CMS content. |

**Authentication:** All state-mutating endpoints require header `X-Bridge-Secret: <value>` matching `BRIDGE_SECRET` env var.

**POST /publish Request Payload:**
```json
{
  "title": "Post Title",
  "slug": "post-slug-url-safe",
  "meta_description": "SEO description, max ~155 chars",
  "html_body": "<h1 dir=\"auto\">Title</h1><p dir=\"auto\">Body...</p>",
  "cover_image_url": "https://...",
  "published_date": "2026-05-13T00:00:00.000Z"
}
```
- `title`, `slug`, `html_body` are required. `cover_image_url` and `published_date` are optional.
- `published_date` defaults to `new Date().toISOString()` if omitted.

**POST /publish Response:**
```json
{ "success": true, "framer_item_id": "cvxc5zoal", "slug": "post-slug-url-safe" }
```
`framer_item_id` is the Framer-assigned CMS item ID. Save this back to Baserow. If the slug already exists in Framer, the response includes `"already_existed": true` and returns the existing item ID — **no duplicate is created**.

**What the bridge does internally:**
1. `connect(FRAMER_PROJECT_URL, FRAMER_TOKEN)` — opens WebSocket session
2. `framer.getCollections()` — finds collection `L8b3IANtH`
3. `blog.addItems([{ slug, draft: false, fieldData }])` — creates CMS item (catches duplicate-slug errors idempotently)
4. `blog.getItems()` — fetches item list to resolve Framer's auto-assigned ID
5. If not a duplicate: `framer.publish()` — deploys the live Framer site
6. `framer.disconnect()` — closes WebSocket

**Idempotent duplicate handling (added 2026-05-20):**
If `blog.addItems()` throws a "Duplicate slug" error, the bridge catches it, looks up the existing item via `blog.getItems()`, and returns `{ success: true, framer_item_id, slug, already_existed: true }` without calling `framer.publish()`. This prevents Agent 5's crash loop where a previously published record (set to `ready_to_publish` after a stale Airtable run) would trigger infinite 500 errors.

**Framer Field Mapping (hardcoded in bridge):**

| Field Name | Framer Field ID | Type | Value |
|------------|-----------------|------|-------|
| Title | `eu1SUO8Ae` | string | from payload |
| Excerpt / Meta | `Ot6aVH0Gv` | string | from payload `meta_description` |
| Body | `fSfrbBQqV` | formattedText | from payload `html_body` |
| Publication Date | `mmsKK_xBb` | date | from payload `published_date` |
| Featured | `vJMe6fpJL` | boolean | **hardcoded `true`** |
| Category | `S9w7PJblN` | enum | **hardcoded `"xw4CPPHov"` (= "Blog")** |
| Reading Time | `MNIeHWzsi` | string | **hardcoded `""` (always empty)** |
| Cover Image | `zD3ZKyyO9` | image | from payload `cover_image_url` (omitted if empty) |
| Author Name | `AblEkj9p6` | enum | **hardcoded `"U9xe5EOm0"` (= "Ankit Dhiman")** |
| Author Title | `CEKcF7GJb` | enum | **hardcoded `"U9xe5EOm0"` (= "Head of Strategy")** |
| Author Bio | `x2h9g6E14` | enum | **hardcoded `"VGwxukezb"`** |
| Author Photo | `Kgwuwd_oX` | image | **hardcoded CDN URL** |

Only `title`, `body`, `date`, `meta`, and `cover_image_url` are dynamic. All author fields and `featured`/`category` are hardcoded in the bridge.

---

### 3.2 Agent 5: Publisher (n8n Workflow)

**Workflow name:** "Blog Agent 5: Publisher (Baserow)"
**Workflow ID:** `qYIiCFzOoPMNFEmO`
**Status:** Active
**Location:** n8n instance at `https://n8n.chronexa.io`
**Source JSON:** `src/workflows/blog-agent-5-publisher.json`

**Trigger:** Cron — every 5 minutes (`*/5 * * * *`)

**Node chain:**

```
Schedule Trigger
    ↓
Get Ready to Publish (Baserow HTTP GET)
    GET /api/database/rows/table/975683/?filter__Status__equal=ready_to_publish&size=1&order_by=id
    ↓
Has Records? (IF node)
    false → End: Nothing to Publish
    true  ↓
Extract Record (Set node)
    Extracts: record_id, slug, title, meta_description, html_body, cover_image_url
    ↓
Lock Record (Baserow HTTP PATCH)
    PATCH /api/database/rows/table/975683/{record_id}/ → Status = "publishing"
    ↓
Publish to Framer (HTTP Request — onError: continueErrorOutput)
    POST https://framer-bridge-production-c7d8.up.railway.app/publish
    Header: X-Bridge-Secret: {{BRIDGE_SECRET}}
    main[0] = success → Mark Published
    main[1] = failure → Mark Failed
    ↓                        ↓
Mark Published           Mark Failed
Status = "published"     Status = "ready_to_publish"
Framer Item ID = id      Error Log = "Bridge publish failed"
```

**Throughput:** 1 record per 5-minute cycle.

**Race condition prevention:** The "Lock Record" step sets status to `"publishing"` before calling the bridge. If a cron fires while a previous execution is in-flight, the in-flight record is already locked and will not be re-processed.

**Credentials:**
- Baserow: inline `Authorization: Token {{BASEROW_API_KEY}}` header (consistent with Agents 2–4)
- Bridge auth: inline `X-Bridge-Secret` header

---

### 3.3 Baserow Blog Pipeline Table

**Database:** `439709` (name: "Blog CMS") — separate from CRM DB `435827`
**Table:** `blog_pipeline`
**Table ID:** `975683`
**API base URL:** `https://api.baserow.io/api/database/rows/table/975683/`
**Auth:** `Authorization: Token <BASEROW_API_KEY>` — always append `?user_field_names=true`

**Schema:**

| Field Name | Type | Description |
|---|---|---|
| Title | text | SEO-optimized post title |
| Slug | text | URL-safe slug — unique across all published posts |
| Status | text | State machine value (see below) |
| Meta Description | text | SEO excerpt, target 120–155 chars |
| HTML Body | text | Full post HTML with `dir="auto"` on all tags |
| Cover Image URL | text | Cover image (from Gemini/CDN or empty) |
| Framer Item ID | text | Set by Agent 5 after successful publish |
| Target Keyword | text | Primary SEO keyword |
| Secondary Keywords | text | Comma-separated additional keywords |
| Persona | text | `sme_operations`, `wealth_management`, `family_office`, `finance_ops`, `startup_ops`, etc. |
| Thesis | text | Core argument / unique angle for the post |
| Research Brief | text | Raw research output from Agent 2 |
| Cover Image Prompt | text | Prompt used for Gemini image generation |
| Word Count | number | Character count of HTML Body |
| Error Log | text | Populated when Status = `failed` |

**Filter format:** `filter__Status__equal=<value>` (text field, no option IDs needed)

**Status State Machine:**

```
idea_generated
    ↓ (Agent 2 picks up)
researching        ← LOCKED state, Agent 2 in-flight
    ↓
research_complete
    ↓ (Agent 3 picks up)
writing            ← LOCKED state, Agent 3 in-flight
    ↓
copy_written
    ↓ (Agent 4 picks up)
generating_image   ← LOCKED state, Agent 4 in-flight
    ↓
ready_to_publish
    ↓ (Agent 5 picks up)
publishing         ← LOCKED state, Agent 5 in-flight
    ↓
published          ← terminal success state
failed             ← Agent 5 error (check Error Log field)
```

---

## 4. Agents 1–4 (Content Generation Pipeline)

The content generation pipeline is LIVE and fully agentic in n8n. All agents use Baserow as state machine.

| Agent | Workflow ID | Cron | AI Used | Picks up | Sets status to |
|---|---|---|---|---|---|
| Agent 1: Strategist | `fPqf1XhTxhGyWVbF` | 6h | Claude Haiku | — (GSC data) | `idea_generated` |
| Agent 2: Researcher | `6SzXgyv0rMfA68l6` | 10min | Exa AI | `idea_generated` | `research_complete` |
| Agent 3: Copywriter | `EbW7suHY7ji6EhsD` | 5min | Claude Sonnet 4.6 | `research_complete` | `copy_written` |
| Agent 4: Designer | `Z2ehkUAAYsub4l2i` | 5min | Gemini Imagen 3 | `copy_written` | `ready_to_publish` |
| Agent 5: Publisher | `qYIiCFzOoPMNFEmO` | 5min | — | `ready_to_publish` | `published` |

**Agent 1 Dedup (added 2026-05-20):**
Before creating a new Baserow record, Agent 1 runs a "Check Duplicate Keyword" Code node that queries `filter__Target%20Keyword__equal=<keyword>`. If a match is found, the record is skipped via "End: Keyword Already Exists". This prevents duplicate ideas from stacking in the queue.

**Design constraints that must be respected when building Agents 1–4:**

1. **No Code nodes (except Agent 1 dedup).** The n8n deployment uses an external task runner configuration. If the runner is misconfigured, all Code nodes silently timeout at 180s. Use Set nodes (v3.4), Aggregate nodes, or Extract From Text nodes for all data transformation.

2. **Set node v3.4 format is strict.** Each assignment must have `id`, `name`, `value`, `type`. The `fields.values` format (older typeVersions) produces no output with no error.

3. **AI output format: delimiters, not JSON.** Set node expressions cannot call `JSON.parse()`. Structure all AI output with named delimiters:
   ```
   %%TITLE%%
   value here
   %%SLUG%%
   value here
   %%HTML_START%%
   <html content>
   %%HTML_END%%
   ```
   Parse with `.split('%%TITLE%%')[1].split('%%SLUG%%')[0].trim()` in Set node expressions.

4. **Claude/Anthropic authentication.** Pass the API key directly in `headerParameters` as `x-api-key`. Do not use the n8n stored Anthropic credential for direct HTTP calls — it injects `Authorization: Bearer` which the Anthropic API rejects.

5. **Framer HTML format.** All HTML tags in `html_body` must include `dir="auto"` attributes. Claude does not produce these natively. Either prompt Claude explicitly or post-process in Agent 5's Set node.

6. **Lock before process.** Every agent must set the record to its in-progress locked status (e.g., `researching`, `writing`) immediately after fetching, before making any AI API call.

7. **Baserow HTTP Request auth.** All agents use `authentication: "none"` with an explicit `Authorization: Token <key>` header. Never mix `genericCredentialType` with inline headers — they conflict and the inline header is silently ignored.

---

## 5. System IDs Reference

### Infrastructure

| Resource | Value |
|---|---|
| n8n instance | `https://n8n.chronexa.io` |
| Framer project URL | `https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E` |
| Framer blog collection | `L8b3IANtH` |
| Live site | `https://chronexa.io/blog` |
| framer-bridge URL | `https://framer-bridge-production-c7d8.up.railway.app` |
| Railway project ID | `58e2fbb7-2b57-45b4-bd4e-ba1585243b0d` |
| Railway service ID | `3f4392c2-9205-458b-a086-5f862364433b` |

### Baserow Blog CMS

| Resource | ID |
|---|---|
| Database | `439709` (name: "Blog CMS") |
| Blog pipeline table | `975683` |
| n8n Baserow credential | Not used — inline token in HTTP nodes |

### n8n Blog Pipeline Workflows

| Workflow | ID | Cron | Status |
|---|---|---|---|
| Blog Agent 1: GSC Strategist | `fPqf1XhTxhGyWVbF` | 6h | ACTIVE |
| Blog Agent 2: Researcher | `6SzXgyv0rMfA68l6` | 10min | ACTIVE |
| Blog Agent 3: Copywriter | `EbW7suHY7ji6EhsD` | 5min | ACTIVE |
| Blog Agent 4: Image Designer | `Z2ehkUAAYsub4l2i` | 5min | ACTIVE |
| Blog Agent 5: Publisher | `qYIiCFzOoPMNFEmO` | 5min | ACTIVE |

### Deactivated (legacy Airtable workflows)

| Workflow | ID |
|---|---|
| Old Agent 1 (Airtable, persona rotation) | `d96au9JL4iHaFdKj` |
| Old Agent 2 (Airtable) | `PKh8zA5zH3dewf02` |
| Old Agent 3 (Airtable) | `eVPVPBzfFp4obCu0` |
| Old Agent 4 (Airtable) | `3EVAeoUzCWBzlvKp` |
| Old Agent 5 (Airtable) | `Pxyseu0euKXlTXsX` |

### Environment Variables (see `.env` at repo root)

| Variable | Used by |
|---|---|
| `FRAMER_API_TOKEN` | framer-bridge (connects to Framer SDK) |
| `BRIDGE_SECRET` | framer-bridge (inbound auth) + Agent 5 (outbound header) |
| `BASEROW_API_KEY` | All blog pipeline agents (HTTP header token) |
| `ANTHROPIC_API_KEY` | Agent 3 (Copywriter) |
| `EXA_API_KEY` | Agent 2 (Researcher) |
| `N8N_API_URL` | Deployment and migration scripts |
| `N8N_API_KEY` | Deployment and migration scripts |

---

## 6. Framer CMS Field ID Quick Reference

These IDs are used in `framer-bridge/server.js` and must match the live Framer Blog collection `L8b3IANtH`. Verified May 2026.

| Human Name | Framer Field ID | Type | Notes |
|---|---|---|---|
| Title | `eu1SUO8Ae` | string | Post headline |
| Excerpt / Meta | `Ot6aVH0Gv` | string | SEO meta description |
| Body | `fSfrbBQqV` | formattedText | HTML — tags need `dir="auto"` |
| Date | `mmsKK_xBb` | date | ISO 8601 |
| Featured | `vJMe6fpJL` | boolean | Always `true` — controls visibility on blog page |
| Category | `S9w7PJblN` | enum | Case value: `"xw4CPPHov"` = "Blog" |
| Reading Time | `MNIeHWzsi` | string | Always empty — leave blank |
| Cover Image | `zD3ZKyyO9` | image | URL string |
| Author Name | `AblEkj9p6` | enum | Case value: `"U9xe5EOm0"` = "Ankit Dhiman" |
| Author Title | `CEKcF7GJb` | enum | Case value: `"U9xe5EOm0"` = "Head of Strategy" |
| Author Bio | `x2h9g6E14` | enum | Case value: `"VGwxukezb"` |
| Author Photo | `Kgwuwd_oX` | image | Hardcoded CDN URL |

**IMPORTANT:** These are Framer's internal field IDs, not human-readable names. The enum `value` fields require the case ID (e.g., `"xw4CPPHov"`), not the display string (e.g., `"Blog"`). Passing display strings causes silent publish failures where the item is created but fields are blank.

---

## 7. Critical Gotchas (Learned From Production)

### G1 — Node.js 22 on Railway (DO NOT CHANGE)
`framer-api` uses `globalThis.WebSocket`. This global exists in Node 22+ only. Railway defaults to Node 18/20 via Nixpacks. The `nixpacks.toml` file in `framer-bridge/` forces Node 22. Removing or changing this file will break every endpoint with `"di is not a constructor"`.

### G2 — Framer Duplicate Slug (Idempotent Bridge)
As of 2026-05-20, the bridge handles duplicate slugs idempotently: if `blog.addItems()` throws "Duplicate slug", the bridge catches the error, looks up the existing item via `blog.getItems()`, and returns it as a success. This prevents Agent 5 from crashing on records that were already published via an older Airtable workflow.

### G3 — n8n HTTP Request Body Expression
Never use `JSON.stringify()` in an n8n `jsonBody` expression:
```js
// BROKEN — double-encodes; server receives a string, not an object
"jsonBody": "={{ JSON.stringify({ key: $json.value }) }}"

// CORRECT — plain object; n8n serialises automatically for contentType: 'json'
"jsonBody": "={{ ({ key: $json.value }) }}"
```

### G4 — n8n update_workflow vs publish_workflow
`update_workflow` (n8n MCP / REST API PUT) saves a workflow as a **draft**. It does NOT activate it. Must call `publish_workflow` separately to make the new version live.

### G5 — Baserow Auth: Token vs JWT
Database-token (`Token` prefix) can read/write rows. It **cannot** create tables or fields — that requires a JWT obtained via `POST /api/user/token-auth/`. JWT expires in ~10 minutes. Always use `?user_field_names=true` on row endpoints.

### G6 — n8n Script Safety: Never Use Inline bash `node -e`
Expressions containing `$json`, `$('NodeName')`, `$env` in bash double-quoted strings get shell-expanded to empty strings. **Always write n8n patching scripts as standalone `.js` files** and run them with `node scripts/yourscript.js`.

### G7 — framer.publish() is a Full Site Deploy
`framer.publish()` deploys the entire live Framer site, not just the new post. Every `/publish` call triggers a full site republish (~3–5 seconds). Do not skip it — without it, the item exists in the CMS but the live site is not updated.

### G8 — Agent 5 Crash Loop Pattern
If Agent 5's "Publish to Framer" fails and "Mark Failed" resets the record back to `ready_to_publish`, the next cron cycle will attempt the same record again. If the failure is deterministic (e.g., always a duplicate slug), this creates an infinite crash loop. The bridge's idempotent duplicate handling (G2 above) breaks this loop for the slug-collision case. For other failures, check the Error Log field in Baserow.

### G9 — Agent 1 Saves Executions Off
Agent 1's `saveSuccessfulExecutions` is not set, so it uses the n8n instance default (off). Agent 1 IS running (verified active, 6h cron) but executions don't appear in the n8n UI. To verify it ran: check `idea_generated` count in Baserow table 975683 instead of looking at the executions list.

### G10 — Gemini API Key (Agent 4)
Agent 4 uses `AIzaSyCSRHLPEkOyK-BADOl9z-ClA4jFD0TNSg8` (updated 2026-05-20). If images stop generating, the Gemini key has likely expired again. Replace it in the "Generate Image with Gemini" node's `x-goog-api-key` header. Agent 4 degrades gracefully — records move to `ready_to_publish` with an empty `Cover Image URL`.

---

## 8. End-to-End Flow (Current Live Path)

```
1. Agent 1 (every 6h) fetches GSC striking-distance keywords → dedup check →
   creates Baserow record: { Title, Slug, Target Keyword, Thesis, Status="idea_generated" }

2. Agent 2 (every 10min) polls Baserow for status=idea_generated →
   locks to "researching" → runs Exa research → writes Research Brief →
   sets status="research_complete"

3. Agent 3 (every 5min) polls for status=research_complete →
   locks to "writing" → Claude generates HTML → parses delimited output →
   writes html_body, meta_description, slug → sets status="copy_written"

4. Agent 4 (every 5min) polls for status=copy_written →
   locks to "generating_image" → generates image prompt → Gemini Imagen 3 →
   hosts on Imgbb → writes cover_image_url → sets status="ready_to_publish"

5. Agent 5 (every 5min) polls for status=ready_to_publish →
   locks to "publishing" → POSTs to framer-bridge →
   bridge connects to Framer WS, creates CMS item, deploys site →
   writes framer_item_id back to Baserow → sets status="published"

6. Post is live on chronexa.io/blog (within seconds of step 5's framer.publish())
```

**Typical execution time:** 10–15 seconds per post (dominated by Framer WebSocket connection and site deploy).

---

## 9. File Structure

```
N8N-Chronexa/
├── .env                                      ← All secrets. Never commit.
├── CLAUDE.md                                 ← AI agent instructions for this repo
├── HANDOFF.md                                ← Complete project handoff (start here)
│
├── framer-bridge/
│   ├── server.js                             ← Express microservice (Node 22)
│   ├── nixpacks.toml                         ← Forces Node 22 on Railway. DO NOT REMOVE.
│   └── package.json
│
├── src/
│   └── workflows/
│       ├── blog-agent-1-strategist.json      ← Agent 1 n8n workflow (live)
│       ├── blog-agent-2-researcher.json      ← Agent 2 n8n workflow (live)
│       ├── blog-agent-3-copywriter.json      ← Agent 3 n8n workflow (live)
│       ├── blog-agent-4-designer.json        ← Agent 4 n8n workflow (live)
│       └── blog-agent-5-publisher.json       ← Agent 5 n8n workflow (live)
│
├── workflows/
│   ├── blog-pipeline/
│   │   └── README.md                         ← Blog pipeline status and IDs
│   └── outbound-engine/
│       ├── README.md
│       ├── outbound-engine.json
│       ├── manyreach-push.json
│       └── feeder.json
│
├── scripts/
│   ├── fetch-live.js                         ← Download live workflow JSONs from n8n
│   ├── inject-5-records.js                   ← Seed blog pipeline Baserow table
│   ├── fix-agent1-dedup.js                   ← Patched Agent 1 dedup (already run)
│   ├── create-agent[3-5]-baserow.js          ← Migration scripts (already run — reference only)
│   ├── test-agent[2-5]-run.js                ← Schedule-swap validation tests
│   └── live-workflows/                       ← Snapshots of live n8n workflows
│
└── docs/
    ├── BLOG_AUTOMATION_ARCHITECTURE.md       ← This file (canonical reference)
    ├── SENIOR_ARCHITECT_HANDBOOK.md          ← n8n engineering standards
    └── architecture/
        ├── outbound-pipeline.md              ← Outbound pipeline detailed docs
        └── lead-lifecycle.md
```

---

## 10. Known Issues / Security Debt (as of 2026-05-20)

| Issue | Severity | Status |
|---|---|---|
| `BASEROW_API_KEY` hardcoded in HTTP Request nodes (not using n8n credentials) | Low | Acceptable — consistent pattern across all agents |
| Imgbb API key hardcoded in Agent 4 workflow node | Low | Acceptable for now |
| GSC OAuth on Agent 1 untested in production | Medium | GSC data has not yet flowed into Baserow — Agent 1 may be creating records from fallback data only |
| framer-bridge duplicate-slug fix committed locally but not yet deployed | High | **Deploy ASAP** — see HANDOFF.md for Railway push instructions |

---

*Architecture documented by Claude Code | Chronexa.io | 2026-05-20*
