# Shopify Landing — Lead Capture + Meta Feedback

## Status (2026-09-11)
Two live n8n workflows, both verified end-to-end with a real test row:

1. **`Shopify Landing — Lead Capture`** (`rRtLi2ojJDk0wfY6`) — receives every submission
   from `chronexa.io/shopify-store-build` and writes it to the "Leads" tab of the Google
   Sheet below. Fixed 2026-09-10: it had been pointed at a tab called "Sheet1", which
   does not exist in this spreadsheet, so it had **zero successful executions since
   it was built** on 2026-07-29. Now targets the real tab, "Leads".
2. **`Shopify Leads → Meta Feedback`** (`7YcbhY5iObiNopgF`) — new 2026-09-11. Every 30
   minutes, reads the same sheet, finds rows the team has marked `Qualified After Call`,
   `Call Booked`, or `Deal Status = Won` that haven't been reported yet, and sends the
   matching event (`QualifiedLead` / `BookedCall` / `Purchase`) to Meta's Conversions
   API — hashed email/phone + the lead's original `fbp`/`fbc` cookies, so Meta can
   attribute it back to the ad click and learn what a good customer looks like instead
   of optimising for raw form fills.

## Trigger
`POST /webhook/shopify-landing-lead` (unchanged)

Request body — extended 2026-09-10 to carry the qualifier fields from the new
landing page (`name`, `phone` still required; everything else optional):
```json
{
  "name": "string, required",
  "phone": "string, required",
  "email": "string",
  "businessName": "string",
  "storeUrl": "string — Instagram or Shopify link",
  "sellsOnline": "new | existing | marketplace",
  "sells": "string — what they sell / what they picked in \"looking for\"",
  "monthlyOrders": "string, optional",
  "budget": "under-15k | 15-40k | 40-75k | 75k+",
  "photosReady": "string, optional",
  "waConsent": "boolean — WhatsApp opt-in",
  "qualified": "boolean — computed by /api/contact: budget 25k+ AND storeUrl present",
  "fbp": "string — Meta browser cookie",
  "fbc": "string — Meta click cookie",
  "pageUrl": "string",
  "honeypot": "string — must be empty; filled = bot",
  "submittedAt": "ISO timestamp"
}
```

## Sheet — "Leads" tab
Spreadsheet `14KS0yf2gYscjLdUaGKk2Xi4oBBqX1zvNi6tbuxi-uT8`, tab **`Leads`** (NOT "Sheet1").

Columns A–X are written by the capture workflow on every submission. Columns
**N–T are filled in by hand** by whoever works the lead — this is the label data the
feedback workflow reads. **Z–AB added 2026-09-11** — also hand-filled, whenever
convenient, not required at the moment of status change:

| Col | Header | Filled by |
|---|---|---|
| A–M | Submitted At … Auto-Qualified | capture workflow, automatic |
| N | Call Status (Picked Up / Not Picked Up) | manual |
| O | Qualified After Call (Yes/No) | manual |
| P | Disqualify Reason | manual |
| Q | Call Booked (Yes/No) | manual |
| R | Call Show-up (Yes/No) | manual |
| S | Deal Status (Won/Lost/In Progress) | manual |
| T | Remarks | manual |
| U–X | fbp, fbc, Page URL, Source | capture workflow, automatic |
| Y | Synced to Meta | feedback workflow, automatic — do not edit by hand |
| Z | Qualified At (any parseable date/time) | manual, optional |
| AA | Booked At (any parseable date/time) | manual, optional |
| AB | Closed At (any parseable date/time) | manual, optional |

The Read Leads Sheet node's range is `Leads!A1:AB1000` — extend that range too if
more columns are ever added, or new columns silently won't be seen.

## Feedback logic (`Shopify Leads → Meta Feedback`)
Priority per row, first match wins: `Deal Status = Won` → `Purchase` (value ₹25,000) ·
else `Call Booked = Yes` → `BookedCall` · else `Qualified After Call = Yes` →
`QualifiedLead`. Rows with `Synced to Meta` already set are skipped, so nothing
double-fires. Runs every 30 minutes.

**`event_time` (fixed 2026-09-11):** each event uses the matching Z/AA/AB timestamp,
not "now" — so Meta learns the real time the action happened, not whenever this
30-min job happened to run. **Meta's Conversions API hard-rejects any `event_time`
more than 7 days old (confirmed live: error code `2804003`, "Event timestamp too
old")** — if the relevant column is blank, unparseable, or older than 7 days, the
code falls back to `now` rather than losing the event outright. See the
`safeEventTime()` function in the "Find Leads To Report" node.

**`event_id` dedup (fixed 2026-09-11):** the landing page's browser pixel `Lead`
event and `/api/contact`'s server-side CAPI `Lead` event previously used different
IDs, so Meta counted every lead twice. The browser now generates one ID per
submission and sends it both to `fbq('track', 'Lead', ..., { eventID })` and in the
POST body as `eventId`; `/api/contact` reuses that same ID for its own CAPI call.
This only applies to the *initial* `Lead` event — `QualifiedLead` / `BookedCall` /
`Purchase` are server-only with no browser counterpart, so they don't need this.

## Destination
- Auth: n8n credential `founder@mail.chronexa Google Sheets account` (`1K7E7AST665xcGuJ`)
  via `httpRequest` + `predefinedCredentialType` — same pattern as the rest of this repo.
- Meta CAPI: pixel `1710816843570026`, token in n8n's "Send Meta Event" node (same
  values as the website's `META_PIXEL_ID` / `META_CAPI_TOKEN`).

## Error handling
Unchanged on the capture side: `Retry on Fail` on the Sheets append, org-wide
`errorWorkflow` (`MKBhIfmRNZtPDJg0`) as the backstop, Gmail alert to
info@chronexa.io / team@chronexa.io on a save failure.

Budget values now match the displayed INR ranges. The website still accepts legacy `15-25k`, `25-50k`, and `50k+` submissions; historical rows are unchanged. Initial fit includes current `40-75k` / `75k+` and legacy `25-50k` / `50k+`. Final qualification remains a human decision.
