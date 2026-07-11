# Chronexa N8N-Chronexa — Project Handoff

**Date**: 2026-05-20
**Company**: Chronexa.io — B2B AI automation agency, UAE/Dubai
**Repo**: github.com/Chronexa/N8N-Chronexa
**n8n instance**: https://n8n.chronexa.io
**Live blog**: https://chronexa.io/blog

---

## Overview

This repo contains two independent production systems:

1. **SEO Blog Pipeline** — 5 autonomous agents that research, write, illustrate, and publish SEO articles to Framer CMS.
2. **Outbound Engine** — 3 workflows that research leads, generate personalized cold emails via Claude, and push approved prospects into ManyReach sequences.

---

## System 1: SEO Blog Pipeline

### Architecture Summary

Five n8n workflows run on polling crons. All share a single Baserow table as the state machine (`blog_pipeline`, table ID 975683, DB 439709). Each agent claims the next record in the correct status, processes it, and advances the status to the next stage.

**State machine:**
```
idea_generated → researching → research_complete → writing → copy_written → generating_image → ready_to_publish → publishing → published
```

Airtable was fully decommissioned on 2026-05-19. Do not reference it.

### Workflow IDs

| Agent | Name | Workflow ID | Cron | Status |
|-------|------|-------------|------|--------|
| 1 | GSC Strategist | fPqf1XhTxhGyWVbF | every 6h | ACTIVE |
| 2 | Researcher | 6SzXgyv0rMfA68l6 | every 10min | ACTIVE |
| 3 | Copywriter | EbW7suHY7ji6EhsD | every 5min | ACTIVE |
| 4 | Image Designer | Z2ehkUAAYsub4l2i | every 5min | ACTIVE |
| 5 | Publisher | qYIiCFzOoPMNFEmO | every 5min | ACTIVE |

### Baserow Blog CMS

| Key | Value |
|-----|-------|
| Database ID | 439709 |
| Table name | blog_pipeline |
| Table ID | 975683 |
| n8n credential name | Baserow Blog CMS |
| n8n credential ID | nY2TCXW2BwAXwuHG |

Filter format (all Status comparisons use text equality, no option IDs):
```
filter__Status__equal=<value>
```
Sort: default order by ID ascending (lowest ID processes first — FIFO).

### Per-Agent Notes

**Agent 1 — GSC Strategist**
- Pulls low-ranking keywords from Google Search Console.
- Dedup check added 2026-05-20: before inserting, queries Baserow for an existing identical keyword. If found, skips. Dedup node: `Check Duplicate Keyword` (Code node, id `a1g-dedup-check`).
- `saveSuccessfulExecutions` is `undefined` (inherits n8n instance default). Executions do NOT appear in the n8n REST API. The workflow IS active and running every 6 hours — verify pipeline health by querying Baserow for new `idea_generated` records instead.

**Agent 2 — Researcher**
- Uses Exa (`api.exa.ai`) to search for recent news and crawl company pages.
- `EXA_API_KEY` in `.env`.
- Two prior bugs fixed (literal newlines, shell-expanded expressions) — see scripts/fix-agent2-*.js.

**Agent 3 — Copywriter**
- Calls Anthropic (claude-sonnet-4-6) to generate the full article.
- Uses n8n credential ID `MBzkzU0jc7m1gBTJ` for Anthropic.
- AI output is markdown-fenced — strip fences before `JSON.parse()`.

**Agent 4 — Image Designer**
- Generates a hero image via Gemini Imagen 3 (`generativelanguage.googleapis.com/v1beta`).
- Uploads to Imgbb; both the Imgbb key and the Gemini key are hardcoded directly in the workflow node (security debt — see below).
- **Current Gemini key**: `AIzaSyCSRHLPEkOyK-BADOl9z-ClA4jFD0TNSg8` (stored as `?key=` query param in the "Generate Image with Gemini" node URL). The previous key had expired — if images stop generating, check this first.

**Agent 5 — Publisher**
- Calls the Framer bridge to publish each post to Framer CMS.
- Transitions status to `publishing`, then to `published` on success.

### Framer Bridge

**URL**: https://framer-bridge-production-c7d8.up.railway.app

| Endpoint | Method | Description |
|----------|--------|-------------|
| /publish | POST | Publish a blog post to Framer CMS (idempotent) |
| /health | GET | Liveness check |
| /item/:itemId | DELETE | Remove a post |
| /publish-site | POST | Trigger a Framer site deploy |

- **Auth**: `X-Bridge-Secret` header (value from `BRIDGE_SECRET` env var).
- **Idempotency** (as of 2026-05-20): if a slug already exists in Framer, returns the existing `framer_item_id` instead of 500. This fix is committed locally but NOT yet deployed to Railway (see Active Issues below).
- **Node version**: Node 22 — enforced via `framer-bridge/nixpacks.toml`. Do NOT change.
- **Collection ID**: `L8b3IANtH`

### Active Issues

#### 1. Framer Bridge Crash Loop (BLOCKING — highest priority)

Agent 5 is crash-looping on approximately 29 `ready_to_publish` records that already have duplicate slugs in Framer CMS (created by the old Airtable Agent 5 before decommissioning).

The fix (duplicate-slug idempotency) is committed in `framer-bridge/server.js` locally but NOT deployed.

**Fix path A (preferred)**:
```bash
# First fix the GitHub auth issue (see section below), then:
git push origin main
# Railway auto-deploys from GitHub on push.
```

**Fix path B (direct)**:
```bash
cd framer-bridge
railway login          # authenticate as Chronexa org
railway up --detach    # push directly to Railway without GitHub
```

Stuck records that were manually reset to unblock testing:
- Record IDs **17** and **59** — status was stuck at `publishing`, reset to `ready_to_publish` on 2026-05-20.

#### 2. Agent 1 Execution Visibility

`saveSuccessfulExecutions=undefined` — n8n API returns zero executions for Agent 1. This is expected behavior, not a bug. To verify Agent 1 is running, query Baserow:
```
GET https://api.baserow.io/api/database/rows/table/975683/?filter__Status__equal=idea_generated
Authorization: Token <BASEROW_API_KEY>
```

#### 3. Gemini Key Expiry (Security Debt)

The Gemini API key is stored as a `?key=` query param in the Agent 4 workflow URL. If image generation stops, update the key directly in the n8n workflow node. Longer-term fix: move to an n8n credential.

---

## System 2: Outbound Engine

### Workflow IDs

| Workflow | ID | Trigger |
|----------|----|---------|
| Outbound Engine | 0I6zaFD0yrxumrFe | Webhook |
| ManyReach Push | KdugyCKQYcvGNUzi | Hourly cron |
| Feeder | see src/workflows/chronexa-feeder.json | Manual |

### Flow

```
Lead CSV / Google Sheet
  → Feeder (manual trigger)
    → Webhook → Outbound Engine
      → Normalize Lead Input
      → Exa News Search (90-day window)
      → Exa Company Crawl
      → Parse Exa Response
      → Anthropic bucket routing
      → Anthropic Generate Cold Email (claude-sonnet-4-6)
      → Parse Email Output
      → Baserow row created (status: Email Ready)
        → [Human reviews in Baserow Kanban]
          → status set to Approved
            → ManyReach Push (hourly cron)
              → Prospect created in ManyReach
              → status set to In Campaign
              → Sequences: Day 0 / Day 3 / Day 7 / Day 14
```

### Baserow Leads CRM

| Key | Value |
|-----|-------|
| Database ID | 435827 |
| Leads table ID | 968761 |
| Status field ID | 8466572 |
| Status: Email Ready | option ID 6136389 |
| Status: Approved | option ID 6136390 |
| Status: In Campaign | option ID 6136391 |

### ManyReach

| Resource | ID |
|----------|----|
| Campaign "Chronexa Outbound v3" | 91291 |
| List "Chronexa CRM - v3" | 95635 |
| Sequence | 119067 |

API base URL: `https://api.manyreach.com/api/v2/`
Auth: `X-API-Key: <key>` header — NOT `Authorization: Bearer`, NOT a query param.

### Anthropic Credential (n8n)

Credential ID: `MBzkzU0jc7m1gBTJ`

---

## Environment Variables (.env)

All scripts load via `dotenv`. The `.env` file lives at the repo root and is gitignored.

| Variable | Purpose |
|----------|---------|
| `N8N_API_URL` | n8n REST API base URL |
| `N8N_API_KEY` | n8n REST API key |
| `BASEROW_API_KEY` | Baserow database token (value: `5xwJzwjAM4G5epUcsdcbUd8VqB2FmkmQ`). Note: this token is also hardcoded directly inside n8n HTTP Request nodes — see Known Security Debt. |
| `FRAMER_API_TOKEN` | Used by framer-bridge to authenticate with Framer SDK |
| `BRIDGE_SECRET` | `X-Bridge-Secret` header value for framer-bridge |
| `FRAMER_BRIDGE_URL` | `https://framer-bridge-production-c7d8.up.railway.app` |
| `EXA_API_KEY` | Used by Agent 2 (Researcher) for Exa news search and company crawl |
| `ANTHROPIC_API_KEY` | Used by Agent 3 (Copywriter) and Outbound Engine |
| `GEMINI_API_KEY` | Gemini Imagen 3 — currently stored in Agent 4 workflow URL directly (security debt) |

---

## Scripts Reference

All scripts use `dotenv` from `.env`. Run with: `node scripts/<name>.js`

### Blog Pipeline Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| scripts/fetch-live.js | Fetch all live workflow JSONs from n8n to scripts/live-workflows/ | Ongoing utility |
| scripts/inject-5-records.js | Insert seed records into Baserow table 975683 | Run as needed |
| scripts/create-agent3-baserow.js | Migrated Agent 3 from Airtable to Baserow | Already run — reference only |
| scripts/create-agent4-baserow.js | Migrated Agent 4 from Airtable to Baserow | Already run — reference only |
| scripts/create-agent5-baserow.js | Migrated Agent 5 from Airtable to Baserow | Already run — reference only |
| scripts/fix-agent1-dedup.js | Patched Agent 1 with dedup check node | Already run — reference only |
| scripts/fix-agent2-brb.js | Fixed literal newlines in Agent 2 expressions | Already run — reference only |
| scripts/fix-agent2-expressions.js | Fixed shell-expanded $ expressions in Agent 2 | Already run — reference only |
| scripts/test-agent2-run.js | Schedule-swap end-to-end validation for Agent 2 | Use for regression testing |
| scripts/test-agent3-run.js | Schedule-swap end-to-end validation for Agent 3 | Use for regression testing |
| scripts/test-agent4-run.js | Schedule-swap end-to-end validation for Agent 4 | Use for regression testing |
| scripts/test-agent5-run.js | Schedule-swap end-to-end validation for Agent 5 | Use for regression testing |

**CRITICAL — n8n Script Safety Rule:**
Always write n8n workflow patch scripts as `.js` files. NEVER use inline bash `node -e "..."` with double-quoted strings. The shell silently expands `$json`, `$('NodeName')`, and similar patterns to empty strings inside double-quoted bash heredocs/strings, corrupting every n8n expression in the workflow. Write to a `.js` file and run `node scripts/myscript.js`.

---

## Known Security Debt

These are accepted risks tracked here for the next sprint:

1. **BASEROW_API_KEY hardcoded in n8n** — All Baserow HTTP Request nodes in n8n workflows use the token value inline rather than an n8n credential object.
2. **Imgbb API key hardcoded** — The Imgbb upload key is hardcoded in the Agent 4 workflow node.
3. **Gemini API key hardcoded** — The Gemini key is stored as a `?key=` query parameter in the Agent 4 "Generate Image with Gemini" node URL, visible in execution logs.

---

## GitHub Auth Issue

`git push` is currently blocked. macOS Keychain has cached credentials for the account `imatesdev`, which returns a 403 on the Chronexa org repo.

**Fix:**
1. Open **Keychain Access** (macOS) → search for `github.com` → delete the entry.
2. Run `git push origin main` — macOS will prompt for credentials. Enter the Chronexa org account credentials.

**Alternative:** Create a GitHub Personal Access Token scoped to the `Chronexa` org and use it as the password when prompted, or configure it via:
```bash
git remote set-url origin https://<PAT>@github.com/Chronexa/N8N-Chronexa.git
```

This is the same blocker preventing the framer-bridge fix from being deployed via GitHub.

---

## Quick Health Check Checklist

Run these to verify system state after any change:

```bash
# 1. Fetch live workflow state
node scripts/fetch-live.js

# 2. Check blog pipeline record counts by status
curl -s "https://api.baserow.io/api/database/rows/table/975683/?filter__Status__equal=idea_generated" \
  -H "Authorization: Token 5xwJzwjAM4G5epUcsdcbUd8VqB2FmkmQ" | jq '.count'

# 3. Check framer-bridge health
curl https://framer-bridge-production-c7d8.up.railway.app/health

# 4. Run end-to-end test for any agent
node scripts/test-agent5-run.js
```

---

*Last updated: 2026-05-20 — Ankit Dhiman / Chronexa AI Strategy Team*
