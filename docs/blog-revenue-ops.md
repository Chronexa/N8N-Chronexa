# Blog Revenue Ops — distribution & measurement protocol

Created 2026-07-12. Owner: Ankit. Purpose: every published post starts the
lead chain (post → calculator → breakdown email → booked call) instead of
waiting for Google. Organic compounds over 3–6 months; distribution is the
same-week revenue path.

## Weekly distribution checklist (runs the week a post publishes)

1. **Newsletter slot.** Add the post to the next weekly newsletter
   (3,251 eligible FU3+Active leads, ManyReach newsletter campaign).
   Subject = the post's meta title, not "New blog post".
2. **Outbound value-touch.** Slot the post into the outbound sequence for the
   matching CRM segment as a no-ask touch. Match by vertical:
   CPA posts → CPA/accounting segment, legal posts → law firm segment, etc.
3. **Founder LinkedIn.** One post/week gets a founder-voice LinkedIn summary
   (Abhishek for finance/RIA topics, Ankit for technical/integration topics,
   Tushar for market/ops topics — per the authorship split).

## Ready-to-send outbound snippets

**Firm360 post → CPA prospects using Firm360** (the SERP-whitespace winner;
nobody else covers this):

> Subject: why AI vendors hit a wall with Firm360
>
> Quick one — we wrote up why Firm360 gates API access behind the firm's own
> account (not the vendor's), and the sponsored-access path that actually
> works: chronexa.io/blog/firm360-api-access-ai-vendors-cpa-firms
>
> If you've had a vendor promise "we integrate with Firm360," the vetting
> checklist in there takes 2 minutes. No pitch — genuinely useful during
> vendor season.

**Time-capture post → law firm prospects on Clio/Elite 3E:**

> Subject: the hours Clio never sees
>
> Most attorneys lose the 4-minute emails and walking-to-lunch calls — work
> that happened but never hit a timer. We wrote up how firms reconstruct the
> real day (attorney approves every entry):
> chronexa.io/blog/clio-elite-3e-n8n-claude-billing-capture
>
> There's a 2-minute calculator in there that estimates your firm's number.
> No email required to use it.

## Monthly measurement review (first Monday, ~30 min)

Per-post success = starting the chain, not direct bookings:

- **GSC** (`scripts/gsc-*.mjs`): impressions + CTR per post. A post with
  impressions but CTR < 1% = meta title/description problem — rewrite those,
  not the post.
- **Amplitude**: `blog_post_view` → `calc_cta_click` (from blog-post
  location) → calculator completion → `book_cta_click`. The calculator leads
  land in Baserow "Website Leads" (table 1015183) — count per source post
  where attributable.
- **Thresholds** (per doctrine: ~20 qualified visits/article is success):
  - 90 days old, near-zero impressions → check indexing/cannibalization,
    then rewrite title/meta or 301 to the closest surviving post.
  - Traffic but zero calculator/CTA clicks → CTA placement problem, add the
    in-body calculator paragraph (see the four expanded CPA posts as the
    pattern).

## Standing hygiene notes

- 111 stale `drafts.*` post documents sit in Sanity (leftovers from the
  91-post cull + older pipeline runs). They don't render anywhere but make
  Studio noisy and risk accidental publishes. Review and discard in bulk —
  do NOT bulk-delete without checking none hold unpublished work.
- The 6 Jul-6 posts and 4 Jul-9 posts were published outside the n8n
  pipeline (route-created IDs vs UUID IDs) — whatever session publishes
  ad-hoc batches must respect the publish route's 1,000-word floor (now
  enforced server-side) and the Tue/Thu cadence.
- Pipeline patch deploy: `node scripts/patch-blog-pipeline-2026-07-12.js`
  (requires N8N_API_KEY; PUTs Agents 1/3/5 — review diff in
  scripts/live-workflows/ first).
