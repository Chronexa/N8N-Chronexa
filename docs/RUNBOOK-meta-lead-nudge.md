# Runbook: Meta lead pipeline — alerts, nudge, daily report

State as of 2026-08-26.

## What runs

| Thing | Where | Status |
|---|---|---|
| Backfill export | `scripts/meta/export-leads.js` | idempotent, re-run any time to repair the sheet |
| Instant lead capture → sheet → team alert | n8n `8RclMk5u5ATWOhs6` | **ACTIVE** |
| Daily ads report, 09:00 IST | n8n `Th2WjGYPPyGRcZ35` | **ACTIVE**, template pending |
| Lead nudge (message the lead) | node `Nudge Lead` in `8RclMk5u5ATWOhs6` | **DISABLED** — see below |

Sheet: `META_LEADS_SHEET_ID` in `.env`. Webhook: `https://n8n.chronexa.io/webhook/meta-leads`.

## Templates on WABA `1048752737749493`

| Template | Category | Purpose |
|---|---|---|
| `new_lead_alert` | UTILITY | to the founders when a lead lands |
| `lead_ack` | **MARKETING** | to the lead. Submitted as UTILITY; **Meta recategorised it** |
| `daily_ads_report` | UTILITY | 09:00 IST summary |

`lead_ack` being MARKETING means a higher per-message price and per-recipient frequency caps.
At their volume the cost difference is a few hundred rupees a month. If it ever matters, the
category can be appealed in WhatsApp Manager, or the wording made more strictly transactional.

## Turning the lead nudge on — do NOT skip step 1

1. **Swap the consent form into the live ad.** The nudge must only ever go to people who ticked
   a box naming WhatsApp. Meta's Feb-2026 policy requires it and the leading cause of WhatsApp
   numbers being banned is messaging without it. New form: `META_LEAD_FORM_ID_V2` in `.env`
   (`37703453319302235`), which carries the consent checkbox and points at the real privacy
   policy. The old live form `2246541482798628` has neither.
   Meta lead forms are immutable, so this means editing the ad to use the new form.
2. **Confirm** `https://chronexa.io/privacy` returns 200. It is referenced by the new form.
3. Enable the `Nudge Lead` node in n8n and save.

The `Consented?` gate in front of it is already live and tested: a lead without the tick is
routed away from the nudge while the team alert still fires.

## Gotchas already paid for

- Every Graph call needs `appsecret_proof`. Because the token never expires the proof is a
  constant, precomputed in `.env` — n8n never has to do crypto.
- `paging.next` from Meta drops the proof; `graphAll` re-attaches it.
- n8n Webhook with `multipleMethods` has **one output per method** (`main[0]`=GET, `main[1]`=POST).
- Build WhatsApp JSON bodies in a Code node, not an inline expression, and strip newlines from
  template parameters — WhatsApp rejects them and several leads type multi-line answers.
- Do not sum `lead` and `onsite_conversion.lead_grouped`; they are the same event, and adding
  both double-counts.
- Never delete sheet rows by row number. Re-run `export-leads.js` instead — it rewrites from Meta.
