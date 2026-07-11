# Outbound Engine — Technical Reference

**Last updated**: 2026-05-20

---

## Overview

Three-workflow outbound sales automation system. Takes raw leads from a Google Sheet or CSV, researches each company with Exa, generates a personalized cold email with Anthropic Claude, stores the draft in Baserow for human review, and on approval pushes the prospect into a ManyReach email sequence.

| Workflow | ID | Trigger |
|----------|----|---------|
| Outbound Engine | `0I6zaFD0yrxumrFe` | Webhook (POST) |
| ManyReach Push | `KdugyCKQYcvGNUzi` | Hourly cron |
| Feeder | see `src/workflows/chronexa-feeder.json` | Manual trigger |

---

## Full Pipeline Flow

```
1. FEEDER (manual)
   Reads rows from Google Sheet (or CSV)
   → POSTs each lead as JSON to the Outbound Engine webhook

2. OUTBOUND ENGINE (webhook-triggered)
   → Normalize Lead Input         [node e04f095b]
   → Exa News Search              [node a48e088c]   90-day news window for the company domain
   → Exa Company Crawl            [node exa-crawl-0001-0000-0000-000000000001]
   → Parse Exa Response           [node 538a5139]
   → Anthropic bucket routing     (IF/Switch — routes by available context)
   → Anthropic Generate Cold Email [node 76d924d9]  (claude-sonnet-4-6)
   → Parse Anthropic Response     [node cc49379c]
   → Parse Email Output           [node 89945788]
   → Append to HITL Queue         [node 0b93bc8d]   Creates Baserow row, status = Email Ready
   → (on error) Append to DLQ Sheet [node 1b752a25]

3. HUMAN REVIEW
   Reviewer opens Baserow Kanban (table 968761)
   Reviews generated email in the "Email Ready" column
   Moves card to "Approved" (sets status option 6136390)

4. MANYREACH PUSH (hourly cron, workflow KdugyCKQYcvGNUzi)
   Queries Baserow for status = Approved (option 6136389 → 6136390)
   → Creates prospect in ManyReach list 95635
   → Adds prospect to campaign 91291 sequence 119067
   → Updates Baserow row status → In Campaign (option 6136391)
   → Sequences fire: Day 0 / Day 3 / Day 7 / Day 14
```

---

## Node IDs (Outbound Engine workflow)

| Node | ID |
|------|----|
| Normalize Lead Input | `e04f095b` |
| Exa News Search | `a48e088c` |
| Exa Company Crawl | `exa-crawl-0001-0000-0000-000000000001` |
| Parse Exa Response | `538a5139` |
| Parse Anthropic Response | `cc49379c` |
| Anthropic Generate Cold Email | `76d924d9` |
| Parse Email Output | `89945788` |
| Append to HITL Queue | `0b93bc8d` |
| Append to DLQ Sheet | `1b752a25` |

---

## Baserow Leads CRM

| Key | Value |
|-----|-------|
| Database ID | 435827 |
| Leads table ID | 968761 |
| Status field ID | 8466572 |
| Status: Email Ready | option ID `6136389` |
| Status: Approved | option ID `6136390` |
| Status: In Campaign | option ID `6136391` |

**Auth**: Database token — `Authorization: Token <BASEROW_API_KEY>` header.

Filter by status (use numeric option ID):
```
filter__Status__single_select_equal=6136390
```

Always append `?user_field_names=true` to row endpoints to avoid `field_XXXXXXX` ID mapping.

---

## ManyReach

| Resource | ID |
|----------|----|
| Campaign "Chronexa Outbound v3" | `91291` |
| List "Chronexa CRM - v3" | `95635` |
| Sequence | `119067` |

**Base URL**: `https://api.manyreach.com/api/v2/`

**Auth**: `X-API-Key: <key>` header.

Do NOT use `Authorization: Bearer` — ManyReach ignores it. Do NOT pass the key as a query param.

**Campaign personalization**: Use `{custom1}`–`{custom20}` placeholders in the campaign subject/body. Store the personalized content in the prospect's custom fields at creation time.

**Duplicate prospect (409)**: Look up by email first:
```
GET /api/v2/prospects?email={email}
```
Then PATCH custom fields on the existing prospect and add to campaign. Do not abort on 409.

**Bulk add**: `POST /api/v2/prospects/bulk?listId={id}&campaignId={id}` — body: `{ "prospects": [{ "email": "..." }] }`.

---

## Anthropic Credential (n8n)

Credential ID: `MBzkzU0jc7m1gBTJ`

Model used for email generation: `claude-sonnet-4-6`

---

## Feeder Setup

The Feeder workflow (`src/workflows/chronexa-feeder.json`) must be configured before first use. Replace these placeholders:

| Placeholder | Replace with |
|-------------|-------------|
| `REPLACE_WITH_APOLLO_SHEET_ID` | Google Sheet ID containing the leads |
| `REPLACE_WITH_TAB_NAME` | Sheet tab name (e.g., `Sheet1`) |
| `REPLACE_WITH_V2_WEBHOOK_URL` | Outbound Engine webhook URL from n8n |

The Feeder is manually triggered — run it once per lead batch.

---

## Known Limitations

1. **Low Exa news coverage** — Approximately 60% of mid-market companies return no Exa news results for the 90-day window. The Anthropic bucket router falls back to Tech Stack / Title context for these leads. Email quality is lower for no-news leads.

2. **No 409 upsert handling** — If a prospect already exists in ManyReach (409 response), the current ManyReach Push workflow does not handle the upsert path. To fix: add an IF node after the create-prospect call to branch on 409, look up the existing prospect ID, PATCH custom fields, and add to campaign.

3. **Feeder is manual** — There is no automated ingestion from Apollo or other sources. The Feeder must be run manually per batch.

4. **DLQ is a sheet append, not a retry queue** — Failed leads in the DLQ Sheet (`node 1b752a25`) are not automatically retried. Monitor the sheet and re-feed manually.

---

## HTTP Request Conventions (apply to all nodes in this workflow)

### Body expressions — never use JSON.stringify
```js
// WRONG — double-encodes; ManyReach/Baserow receive a string, not an object
"jsonBody": "={{ JSON.stringify({ \"email\": $json.email }) }}"

// CORRECT — n8n serializes automatically when contentType is 'json'
"jsonBody": "={{ ({ \"email\": $json.email }) }}"
```

### Authentication — never mix genericCredentialType with inline headers
```json
// CORRECT for ManyReach and Baserow token auth
{
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [{ "name": "X-API-Key", "value": "={{ $env.MANYREACH_API_KEY }}" }]
  }
}
```

### n8n REST API PUT — whitelist only these four keys
```js
// CORRECT — only name, nodes, connections, settings
PUT /api/v1/workflows/{id}  body = { name, nodes, connections, settings }
```
