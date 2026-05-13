# Lead Lifecycle — Status Machine

## State Diagram

```
                    ┌─────────────────────────────────────────────────────┐
                    │                    OUTBOUND ENGINE                  │
[Webhook received]  │                                                     │
        ↓           │   Perplexity →  Anthropic routing →  Anthropic email │
        │           │                                                     │
        ├─ success ─┤────────────────────────────────────────────────────→ [Email Ready]
        │           │                                                     │
        └─ fail ────┤ (Perplexity gate fails OR Baserow write fails)      │
                    │────────────────────────────────────────────────────→ [DLQ]
                    └─────────────────────────────────────────────────────┘

[Email Ready]
    ↓ (human reviews in Baserow Kanban, drags card)
[Approved]
    ↓ (ManyReach Push workflow, runs hourly)
[In Campaign]
    ↓ (ManyReach sends Day 0 → 3 → 7 → 14, prospect replies or bounces)
[Replied]  /  [Unsubscribed]  /  [Bounced]
```

---

## Status Values

| Status | Option ID | Color | Owner | Set By |
|---|---|---|---|---|
| Email Ready | 6136389 | green | Outbound Engine | n8n (Append to HITL Queue node) |
| Approved | 6136390 | blue | Human reviewer | Manual drag in Baserow Kanban |
| In Campaign | 6136391 | orange | ManyReach Push | n8n (Update Baserow → In Campaign node) |
| Replied | 6136392 | purple | Human reviewer | Manual update in Baserow |
| Unsubscribed | 6136393 | yellow | Human reviewer | Manual update in Baserow |
| Bounced | 6136394 | red | Human reviewer | Manual update in Baserow |
| DLQ | 6136395 | dark-red | Outbound Engine | n8n (Append to DLQ Sheet node) |

---

## State Definitions

### Email Ready
**What it means**: The outbound engine successfully generated a personalised 4-email sequence and wrote the lead to Baserow. The lead is waiting for human review.

**Set by**: Node `0b93bc8d` ("Append to HITL Queue") in the Outbound Engine workflow `0I6zaFD0yrxumrFe`.

**Baserow expression**: `"Status": "Email Ready"` in the POST body (static string literal).

**Human action required**: Reviewer opens Baserow Kanban view (View ID `1898987`), reads the email drafts (Subject, Initial Email, Follow Up 1–3), and either:
- Drags to **Approved** if emails look good
- Edits email fields inline then drags to Approved
- Drags to **DLQ** to permanently discard

**ManyReach Push behaviour**: The hourly job filters `filter__Status__single_select_equal=6136390` (Approved). Email Ready leads are NOT picked up — only Approved ones are.

---

### DLQ
**What it means**: Dead Letter Queue. The lead failed processing and will not be emailed.

**Two triggers that write DLQ**:

1. **Perplexity gate failure** — the "Gate Error Check" IF node evaluated Perplexity output as unusable. Routes to node `1b752a25` ("Append to DLQ Sheet").

2. **Baserow write failure** — the "Append to HITL Queue" node (HTTP Request with `onError: 'continueErrorOutput'`) routed to `main[1]` (error branch) → "Tag Sheets API Failure" Set node → "Append to DLQ Sheet".

**Set by**: Node `1b752a25` ("Append to DLQ Sheet") with body `"Status": "DLQ"`.

**Recovery**: DLQ rows must be manually inspected. If the failure was transient (e.g., Baserow API timeout), a human can flip Status back to Email Ready or delete the row and re-trigger the feeder for that lead.

---

### Approved
**What it means**: A human has reviewed the AI-generated emails and approved this lead to be sent.

**Set by**: Human reviewer in Baserow Kanban — drags card from "Email Ready" to "Approved" column.

**ManyReach Push pickup**: Every hour, the ManyReach Push workflow (`KdugyCKQYcvGNUzi`) queries Baserow with `filter__Status__single_select_equal=6136390` and fetches up to 50 Approved leads.

**Important**: The filter uses the numeric option ID (`6136390`), NOT the string "Approved". This is a hard Baserow requirement for single_select fields.

---

### In Campaign
**What it means**: The lead has been created as a prospect in ManyReach and added to Campaign 91291. ManyReach will now send the Day 0 email and schedule follow-ups for Day 3, 7, and 14.

**Set by**: Node "Update Baserow → In Campaign" in the ManyReach Push workflow — HTTP PATCH to `https://api.baserow.io/api/database/rows/table/968761/{row_id}/?user_field_names=true` with body `{"Status": "In Campaign"}`.

**Timing**: The PATCH happens immediately after ManyReach confirms the prospect was added to the campaign (successful response from the bulk endpoint). No polling required.

**What ManyReach sends**:
| Day | Content | Source field in Baserow |
|---|---|---|
| Day 0 | `{custom1}` subject + `{custom2}` body | Subject + Initial Email |
| Day 3 | `{custom3}` | Follow Up 1 |
| Day 7 | `{custom4}` | Follow Up 2 |
| Day 14 | `{custom5}` | Follow Up 3 |

---

### Replied / Unsubscribed / Bounced
**What it means**: Terminal states. ManyReach detects these events but does NOT automatically write back to Baserow.

**Set by**: Human reviewer manually updates the Baserow row after checking ManyReach campaign stats or inbox.

**Future automation opportunity**: A webhook from ManyReach (if supported) or a scheduled polling job could automate these status flips. Not currently implemented.

---

## Transition Rules

| From | To | Trigger | System |
|---|---|---|---|
| (none) | Email Ready | Outbound Engine completes successfully | n8n automated |
| (none) | DLQ | Perplexity gate fails OR Baserow write fails | n8n automated |
| Email Ready | Approved | Human drags card in Kanban | Manual |
| Email Ready | DLQ | Human decides to discard | Manual |
| Approved | In Campaign | ManyReach Push hourly job picks up lead | n8n automated |
| In Campaign | Replied | Human updates after reply received | Manual |
| In Campaign | Unsubscribed | Human updates after unsubscribe | Manual |
| In Campaign | Bounced | Human updates after bounce detected | Manual |
| DLQ | Email Ready | Human corrects error, re-queues | Manual |

---

## Baserow Kanban View

**View ID**: `1898987` ("Leads by Status")
**Type**: Kanban, grouped by Status field

Columns shown left to right:
```
[DLQ] | [Email Ready] | [Approved] | [In Campaign] | [Replied] | [Unsubscribed] | [Bounced]
```

Human reviewers work the "Email Ready" column — reading Subject and email body previews before moving to Approved.

---

## Filtering by Status in Code

Always use numeric option IDs, never string values:

```bash
# Get all Email Ready leads
curl "https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true&filter__Status__single_select_equal=6136389" \
  -H "Authorization: Token {{BASEROW_TOKEN}}"

# Get all Approved leads (used by ManyReach Push)
curl "https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true&filter__Status__single_select_equal=6136390" \
  -H "Authorization: Token {{BASEROW_TOKEN}}"
```

Using `filter__Status__equal=Approved` or `filter__Status__single_select_equal=Approved` will silently return all rows or a 400 error — Baserow requires the ID.

---

## Known Gaps

1. **No automatic ManyReach → Baserow sync**: Replied, Bounced, and Unsubscribed leads require manual Baserow updates. A polling workflow could automate this.

2. **ManyReach Push doesn't handle 409 duplicates in n8n**: If a lead is accidentally Approved twice, the second run will hit a 409 from ManyReach. The current n8n workflow will error; it doesn't yet implement the GET-by-email + PATCH upsert pattern. See `docs/integrations/manyreach.md` for the correct upsert logic.

3. **DLQ recovery is fully manual**: There's no automatic retry. A human must diagnose, fix, and manually re-trigger.
