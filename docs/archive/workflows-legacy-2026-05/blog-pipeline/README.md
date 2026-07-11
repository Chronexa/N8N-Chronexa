# Blog Pipeline — Status Reference

**Last updated**: 2026-05-20

---

## Current State

All 5 agents fully migrated to Baserow. Airtable is fully decommissioned as of 2026-05-19. Do not reference Airtable.

**Pipeline state machine:**
```
idea_generated → researching → research_complete → writing → copy_written → generating_image → ready_to_publish → publishing → published
```

Each agent polls Baserow on a cron, claims the next record in its input status, processes it, and advances the status to the next stage. The lowest record ID is processed first (FIFO by Baserow row ID).

---

## Workflow IDs

| Agent | Name | Workflow ID | Cron | n8n Status |
|-------|------|-------------|------|------------|
| 1 | GSC Strategist | `fPqf1XhTxhGyWVbF` | every 6h | ACTIVE |
| 2 | Researcher | `6SzXgyv0rMfA68l6` | every 10min | ACTIVE |
| 3 | Copywriter | `EbW7suHY7ji6EhsD` | every 5min | ACTIVE |
| 4 | Image Designer | `Z2ehkUAAYsub4l2i` | every 5min | ACTIVE |
| 5 | Publisher | `qYIiCFzOoPMNFEmO` | every 5min | ACTIVE |

---

## Baserow Blog CMS

| Key | Value |
|-----|-------|
| Database ID | 439709 |
| Database name | Blog CMS |
| Table name | blog_pipeline |
| Table ID | 975683 |
| n8n credential name | Baserow Blog CMS |
| n8n credential ID | `nY2TCXW2BwAXwuHG` |

**Status field type**: plain text (not single-select). Use text equality filters:
```
filter__Status__equal=idea_generated
filter__Status__equal=research_complete
filter__Status__equal=copy_written
# etc.
```

No option IDs are needed — Status values are stored as plain strings.

Always append `?user_field_names=true` to avoid `field_XXXXXXX` mapping.

---

## Framer Bridge

**URL**: https://framer-bridge-production-c7d8.up.railway.app

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/publish` | POST | Publish a post to Framer CMS |
| `/health` | GET | Liveness probe |
| `/item/:itemId` | DELETE | Remove a post by Framer item ID |
| `/publish-site` | POST | Trigger a full Framer site rebuild/deploy |

- **Auth**: `X-Bridge-Secret` header.
- **Collection ID**: `L8b3IANtH`
- **Idempotency** (committed 2026-05-20): if the slug already exists in Framer CMS, `/publish` returns the existing `framer_item_id` instead of throwing a 500. This prevents Agent 5 from crash-looping on already-published posts.
- **PENDING**: This fix is committed locally in `framer-bridge/server.js` but NOT yet deployed to Railway. The Railway deployment still has the old non-idempotent code.
- **Node version**: Node 22 — enforced by `framer-bridge/nixpacks.toml`. Do NOT change this.

---

## Active Issues

### 1. Framer Bridge Crash Loop (BLOCKING)

Agent 5 is failing on approximately 29 records currently at `ready_to_publish`. These records have slugs that already exist in Framer CMS (created by the old Airtable Agent 5 before decommissioning). The non-idempotent bridge returns 500 on duplicate slugs, causing Agent 5 to stall the record at `publishing` indefinitely.

**Fix committed, not deployed.** Deploy the fix via one of:

```bash
# Option A: fix GitHub auth, then push (Railway auto-deploys)
# See HANDOFF.md — GitHub Auth Issue section
git push origin main

# Option B: deploy directly via Railway CLI
cd framer-bridge
railway login
railway up --detach
```

Manually reset records: IDs 17 and 59 were stuck at `publishing` and reset to `ready_to_publish` on 2026-05-20.

### 2. Agent 1 Execution Visibility

Agent 1 has `saveSuccessfulExecutions=undefined` (inherits n8n instance default). Successful executions do not appear in the n8n REST API executions endpoint. This is not a bug — Agent 1 IS running every 6 hours.

To verify Agent 1 is working, query Baserow directly:
```bash
curl "https://api.baserow.io/api/database/rows/table/975683/?filter__Status__equal=idea_generated&user_field_names=true" \
  -H "Authorization: Token 5xwJzwjAM4G5epUcsdcbUd8VqB2FmkmQ" | jq '.count'
```
A rising count confirms Agent 1 is inserting new keyword ideas.

### 3. Gemini API Key Expiry

The Gemini API key for Agent 4 is stored as a `?key=` query parameter directly in the "Generate Image with Gemini" node URL inside the n8n workflow. If image generation stops:

1. Go to n8n → workflow `Z2ehkUAAYsub4l2i` → open the "Generate Image with Gemini" node.
2. Update the `?key=` param with a fresh Gemini API key from the Google AI Studio console.
3. Save and verify.

Current key: `AIzaSyCSRHLPEkOyK-BADOl9z-ClA4jFD0TNSg8` (may have rotated — check Google AI Studio if failing).

---

## Script Reference — End-to-End Test Scripts

Each `scripts/test-agentN-run.js` uses the **schedule-swap technique**:

1. Saves the current cron schedule.
2. Temporarily sets the cron to `* * * * *` (every minute).
3. Waits 95–110 seconds for the workflow to fire and complete.
4. Restores the original cron schedule.
5. Queries Baserow to verify the record advanced to the expected status.

Use these scripts to validate an agent after any code or workflow change:

```bash
node scripts/test-agent2-run.js
node scripts/test-agent3-run.js
node scripts/test-agent4-run.js
node scripts/test-agent5-run.js
```

**CRITICAL — Script Safety**: All patch and test scripts MUST be `.js` files run via `node scripts/<name>.js`. Never use inline `node -e "..."` with double-quoted bash strings — the shell silently expands `$json` and `$('NodeName')` to empty strings, corrupting every n8n expression in the patched workflow.

---

## Agent 1 Dedup Logic

Added 2026-05-20. Before inserting a new keyword row, Agent 1 runs a Code node ("Check Duplicate Keyword", id `a1g-dedup-check`) that queries Baserow for any existing row with the same keyword string. If a match is found, the record is skipped. This prevents duplicate articles from entering the pipeline from repeated GSC pulls.
