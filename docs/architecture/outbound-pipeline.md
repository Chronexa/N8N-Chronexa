# Chronexa Outbound Pipeline — Architecture

## Overview

Three n8n workflows form the complete outbound system:

```
[SOURCE SHEETS]
      ↓  (Feeder workflow)
[WEBHOOK TRIGGER]
      ↓  (Outbound Engine)
[EXA — news search + company crawl]
      ↓
[ANTHROPIC — bucket routing]
      ↓
[ANTHROPIC — email generation]
      ↓
[BASEROW — Email Ready]
      ↓  (ManyReach Push workflow, hourly)
[MANYREACH — In Campaign]
      ↓
[SEQUENCES — Day 3, 7, 14]
```

---

## Workflow 1: Feeder (`src/workflows/chronexa-feeder.json`)

**Purpose**: Reads leads from a Google Sheet and feeds them into the Outbound Engine one at a time.

**Trigger**: Manual

**Flow**:
1. Read Apollo Sheet (Google Sheets node) — reads rows from a named tab
2. Loop Over Leads (SplitInBatches, batchSize=1)
3. Send to V2 Engine (HTTP POST to webhook) — 11-field payload
4. Rate Limit Wait (30 seconds between leads)

**Webhook payload sent**:
```json
{
  "first_name":     "from 'First Name' or 'first_name' column",
  "last_name":      "from 'Last Name' or 'last_name' column",
  "email":          "from 'Email' or 'email' column",
  "company_name":   "from 'Company Name' or 'Company' column",
  "company_domain": "from 'Website' or 'Company Website' column",
  "title":          "from 'Title' column",
  "industry":       "from 'Industry' column",
  "keywords":       "from 'Keywords' column",
  "technologies":   "from 'Technologies' column",
  "num_employees":  "from '# Employees' column",
  "annual_revenue": "from 'Annual Revenue' column"
}
```

**Before using**: Replace `REPLACE_WITH_APOLLO_SHEET_ID`, `REPLACE_WITH_TAB_NAME`, and `REPLACE_WITH_V2_WEBHOOK_URL` in the JSON.

---

## Workflow 2: Outbound Engine (`ID: 0I6zaFD0yrxumrFe`)

**Purpose**: Takes a single lead, researches it, classifies it, generates a personalised 4-email sequence, and writes the result to Baserow.

**Trigger**: Webhook at `https://n8n.chronexa.io/webhook/chronexa-outbound`

### Node-by-Node Flow

#### Node: Normalize Lead Input (`e04f095b`, Set v3.4)
Maps 11 fields from `$json.body.*` to clean top-level fields. This is the single source of truth for all downstream nodes.

Output fields: `first_name`, `last_name`, `email`, `company_name`, `company_domain`, `title`, `industry`, `keywords`, `technologies`, `num_employees`, `annual_revenue`

#### Node: Exa News Search (`a48e088c`, HTTP Request v4.2)
POST to `https://api.exa.ai/search`. Searches for recent company news (last 90 days).

**Auth**: `x-api-key` header (lowercase).
**Query**: `{company_name} {company_domain} recent news funding product launch hiring expansion leadership 2025 2026`
**Params**: `type: "auto"`, `numResults: 3`, `startPublishedDate: "2025-09-01"`, contents with targeted summary query.

Output: `results[0].summary` → `RECENT_TRIGGER`

**Known limitation**: ~60% of mid-market companies return no news results for the 90-day window → RECENT_TRIGGER = "NOT FOUND". Email generation falls back to Title, Tech Stack, and Keywords.

#### Node: Exa Company Crawl (new, HTTP Request v4.2)
POST to `https://api.exa.ai/contents`. Directly crawls `https://{company_domain}` homepage.

**Auth**: `x-api-key` header.
**Params**: `ids: ["https://company_domain"]`, `text.maxCharacters: 600`, structured `summary.query` asking for SUMMARY, TECH_STACK, REGULATED in labelled sections.

Output: `results[0].summary` → parsed into `SUMMARY`, `TECH_STACK_HINTS`, `REGULATED_INDUSTRY`

**Known limitation**: Parked domains (GoDaddy etc.) return no useful content. `TECH_STACK_HINTS` is usually NOT FOUND from homepages — the Apollo `technologies` field is more reliable.

Cost: ~$0.011/lead total ($0.009 search + $0.002 crawl).

#### Node: Parse Exa Response (`538a5139`, Set v3.4)
Extracts Exa output and passes through all lead fields.

16 assignments total: 4 from Exa + 3 contact fields + 6 Apollo fields + 3 company fields.

Parse logic is regex-based on Exa's plain text summary (no JSON fence stripping needed — Exa returns clean text, not markdown-wrapped JSON).

#### Node: Gate Error Check (IF)
Checks if Perplexity returned usable data. If not, routes to DLQ path.

#### Node: Anthropic Match Routing Bucket
HTTP POST to Anthropic Messages API (`claude-sonnet-4-5-20250929`).
Classifies the lead into one of three buckets based on their profile:
- **BUCKET 1**: Document & Data Ops (OCR, RAG, unstructured data)
- **BUCKET 2**: Systems Orchestration (CRM/ERP sync, field data)
- **BUCKET 3**: Custom AI Product (bespoke AI builds)

#### Node: Parse Anthropic Response (`cc49379c`, Set v3.4)
Extracts `matched_case_study` and `requires_secure_infrastructure`. Passes through all prior fields.

20 assignments total.

#### Node: Switch Bucket Router
Routes execution to one of three Anthropic email generation nodes based on bucket.

#### Node: Anthropic Generate Cold Email (`76d924d9`, HTTP Request v4.2)
HTTP POST to Anthropic Messages API.

**System prompt**: Instructs Claude to return ONLY valid JSON with this schema:
```json
{
  "subject": "max 8 words, casual",
  "email_body": "3 sentences: trigger observation, Chronexa pitch, architecture question",
  "follow_up_1": "2 sentences: unanswered email + case study angle",
  "follow_up_2": "2 sentences: data point or social proof",
  "follow_up_3": "1 sentence: breakup close"
}
```

**Personalisation inputs**: Contact Title, Industry, Company Size, Tech Stack, Keywords, Recent Trigger.

**Fallback rule**: If RECENT_TRIGGER is "NOT FOUND", Claude uses Tech Stack or Title for the opener instead of a generic line.

**Credential**: Anthropic httpHeaderAuth credential `MBzkzU0jc7m1gBTJ`

#### Node: Parse Email Output (`89945788`, Set v3.4)
Parses Anthropic's JSON response (with markdown fence stripping) and maps to 13 output fields.

**Fence strip expression** (applied to each JSON field):
```js
JSON.parse(
  $json.content[0].text
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
).field_name
```

**13 output fields**: first_name, last_name, email, company_name, company_domain, RECENT_TRIGGER, matched_case_study, subject, initial_email, follow_up_1, follow_up_2, follow_up_3, status="Email Ready"

#### Node: Append to HITL Queue (`0b93bc8d`, HTTP Request v4.2)
POST to Baserow Leads table. Maps all 13 fields from Parse Email Output.

On success (`main[0]`): Baserow row created with Status="Email Ready".
On failure (`main[1]`): Routes to Tag Sheets API Failure.

#### Node: Append to DLQ Sheet (`1b752a25`, HTTP Request v4.2)
POST to Baserow Leads table with Status="DLQ". Triggered on Perplexity gate failure or HITL Queue write failure.

---

## Workflow 3: ManyReach Push (`ID: KdugyCKQYcvGNUzi`)

**Purpose**: Hourly job that picks up Approved leads from Baserow and pushes them to ManyReach.

**Trigger**: Schedule (every 1 hour)

### Flow

1. **Fetch Approved Leads**: GET Baserow rows where Status option ID = `6136390` (Approved), up to 50 per run
2. **Any Approved Leads?** (IF node): Skip if count = 0
3. **Split Into Leads** (SplitOut): One item per lead
4. **Create ManyReach Prospect**: POST to `/api/v2/prospects` with all contact fields + custom1–7
5. **Add to Campaign**: POST to `/api/v2/prospects/bulk` with listId=95635, campaignId=91291
6. **Update Baserow → In Campaign**: PATCH row Status to "In Campaign"

**Note**: The n8n workflow does NOT yet handle the 409 upsert case (existing prospects). If this becomes an issue, add an IF node after Create Prospect to check for 409 and branch to a lookup + PATCH flow.

---

## Data Flow Summary

```
Webhook body
    → Normalize (11 fields)
    → Exa News Search (+ RECENT_TRIGGER from sourced news articles)
    → Exa Company Crawl (+ SUMMARY, TECH_STACK_HINTS, REGULATED_INDUSTRY from homepage)
    → Anthropic routing (+ matched_case_study, requires_secure_infrastructure)
    → Anthropic email (+ subject, email_body, follow_up_1/2/3)
    → Parse Email Output (13 clean fields)
    → Baserow row (Status: Email Ready)
    → [Human reviews in Kanban, flips to Approved]
    → ManyReach prospect (custom1-5 = personalised emails)
    → ManyReach campaign (Status: In Campaign)
    → ManyReach sends Day 0, Day 3, Day 7, Day 14
```

---

## Apollo Enrichment Fields and Why They Matter

Without `title`, `industry`, `technologies`, `keywords`:
> "I noticed you run operations at Work-Fit. We build automation workflows..."

With them:
> "Between Salesforce and QuickBooks, the data sync overhead for staffing placement must be real. We build n8n orchestration layers that eliminate that entirely..."

The Apollo fields feed directly into the Anthropic email prompt. Always include them in the feeder payload.
