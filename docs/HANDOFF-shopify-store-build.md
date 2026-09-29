# Handoff: Shopify Store Build landing page + Meta ads feedback loop

Written 2026-09-11 for a clean handoff to a different coding agent (OpenAI Codex)
continuing this work in the same repo/IDE. Everything below reflects live,
verified state as of this date — not aspirational or planned state.

## 1. What this project is

Chronexa (chronexa.io) is pivoting its Meta (Facebook/Instagram) ad spend from a
generic "AI automation for startups" pitch to a single, narrow offer: **building
Shopify/D2C e-commerce stores for Indian Instagram-first sellers**, priced by
custom quote (not a published fixed price). This is a **locked decision** — do not
propose reverting to AI-automation messaging on this funnel, and do not
relitigate the fixed-price-vs-quote change without the founder (Ankit) raising it.

**No ad spend has happened yet.** Partners fund the ad account later. Everything
built so far is pre-launch setup: landing page, lead capture, qualification logic,
and the Meta Conversions API (CAPI) feedback loop. Treat any "campaign build" or
"creative generation" work as still-pending, not started.

## 2. What's live right now

- **Landing page:** `https://chronexa.io/shopify-store-build` — noindex, paid-traffic-only, registered in `website/src/lib/campaigns.ts`.
- **Meta Pixel:** `1710816843570026` (site-wide, `website/src/components/MetaPixel.tsx`).
- **n8n workflow `rRtLi2ojJDk0wfY6`** "Shopify Landing — Lead Capture" — webhook `POST https://n8n.chronexa.io/webhook/shopify-landing-lead`, writes every submission into a Google Sheet.
- **n8n workflow `7YcbhY5iObiNopgF`** "Shopify Leads → Meta Feedback" — active, runs every 30 minutes, reports `QualifiedLead` / `BookedCall` / `Purchase` events to Meta CAPI once a human marks a lead's status in the sheet.
- Local JSON mirrors of both workflows live in `src/workflows/` and were just re-fetched from live n8n — trust them, but re-fetch again (`GET {N8N_API_URL}/workflows/{id}`) before editing if any time has passed, per this repo's zero-assumption rule.
- Full technical spec: `src/specs/shopify-landing-lead-capture.md` — read this before touching either workflow.

## 3. Files that make up the funnel

| File | Role |
|---|---|
| `website/src/app/shopify-store-build/content.ts` | All landing-page copy: hero, pillars, portfolio (3 real demo stores), included/not-included lists, FAQ. Comments in the file explain what was deliberately *not* copied from a Meta-AI-generated brief (no fabricated stats, no fake screenshots) — read those comments before editing copy. |
| `website/src/app/shopify-store-build/ShopifyStorePage.tsx` | The page component. 2-step lead form (name/WhatsApp/store link → qualifying questions), scroll-reveal animation via `motion` (the current name for Framer Motion), animated stats bar via `CountUp`. |
| `website/src/app/shopify-store-build/ShopifyStorePage.module.css` | CSS Modules — **no Tailwind anywhere in this repo.** Uses the site's existing design tokens (`website/src/app/globals.css`); a dark `.section-dark` band holds the offer/form section so it visually pops. |
| `website/src/app/shopify-store-build/page.tsx` | Metadata + JSON-LD (Service + FAQPage schema). Price schema uses `priceSpecification` with no numeric price (quote-based, not fixed). |
| `website/src/app/api/contact/route.ts` | Shared lead-capture endpoint for the *whole site*, not just this page (`source` field discriminates). For `source: 'shopify-store-landing'`: email is optional (phone required instead), computes `shopQualified` (budget ≥ ₹25-50k band AND a store/IG URL present), and fires 5 side-effects **concurrently via `Promise.all`** (Baserow write, Sheets write, Meta CAPI, forward to the n8n capture webhook, generic webhook mirror) — this was a real perf fix; don't revert to sequential `await`s (was 5-15s, now ~1.5-2s). |
| `website/src/lib/meta-capi.ts` | `sendLeadEvent()` — builds and POSTs the Meta CAPI payload (SHA-256 hashed em/ph, `fbc`/`fbp`, `eventId`). |
| `website/src/components/ChromeGate.tsx` | Excludes the site nav/footer on paid landing pages. `LANDING_PREFIXES` is exported from here — reuse it, don't hardcode a second list, when excluding other global widgets from these pages. |
| `website/src/components/ChatWidget.tsx` | Site-wide "Chat with Ankit" launcher (pitches the *old* AI-automation service). Explicitly excluded on `LANDING_PREFIXES` pages — it was found rendering unconditionally on this funnel's page during this session and fixed. If you add another global widget/popup to `layout.tsx`, check whether it needs the same exclusion. |
| `src/workflows/shopify-landing-lead-capture.json`, `src/workflows/shopify-leads-meta-feedback.json` | Local mirrors of the two live n8n workflows. |
| `src/specs/shopify-landing-lead-capture.md` | The authoritative spec: request schema, full 28-column sheet schema, feedback event logic, the two bugs fixed today (below). |
| `docs/strategy/meta-ecommerce-ads-playbook.md` | Original campaign strategy doc (kept; not one of the "delete this" long docs). |

## 4. Data flow (as built)

```
Visitor clicks Meta ad
  -> lands on /shopify-store-build (fbc/fbp cookies set by the pixel)
  -> fills 2-step form -> POST /api/contact
       - Baserow "Website Leads" table (write-only token, no delete permission — see §6)
       - Google Sheet "Leads" tab (mirrored, generic)
       - Meta CAPI "Lead" event (server-side, same eventId as the browser's fbq call)
       - n8n webhook "shopify-landing-lead" -> writes the FULL qualifier row into
         spreadsheet 14KS0yf2gYscjLdUaGKk2Xi4oBBqX1zvNi6tbuxi-uT8, tab "Leads"
         (28 columns, A-AB — see the spec doc for the schema)
  -> a human works the lead: calls, updates columns N-T (qualified? booked? won?)
     and, ideally, Z/AA/AB (when each of those actually happened)
  -> every 30 min, "Shopify Leads → Meta Feedback" reads the sheet, finds
     newly-updated rows, sends QualifiedLead / BookedCall / Purchase to Meta CAPI
     with the lead's original fbc/fbp so Meta attributes it back to the ad click
  -> marks column Y "Synced to Meta" so it never double-fires
```

## 5. Fixed this session (2026-09-11) — verified live, not just written

1. **Landing page rebuilt** (4th pass) against feedback that it was too long, too
   flat/text-heavy, and still showed a fixed ₹25,000 price. Now: 6 sections (was
   9), scroll-reveal motion, animated stats, dark CTA band, zero mentions of
   ₹25,000 anywhere (copy, meta tags, JSON-LD, form dropdown labels) — replaced
   with "get a fixed quote."
2. **`/api/contact` performance bug**: 5 external calls were sequential (5-15s
   response); now `Promise.all` (~1.5-2s). Confirmed via CDP-automated form
   submission, not just code review.
3. **ChatWidget global-mount bug**: the site's "Chat with Ankit" launcher (which
   pitches AI-automation, not Shopify builds) was rendering on this page with no
   exclusion. Fixed via the shared `LANDING_PREFIXES` list.
4. **Meta CAPI dedup bug**: browser pixel `Lead` and server CAPI `Lead` used
   different `event_id`s, so Meta double-counted every lead. Now share one ID,
   generated client-side and passed through.
5. **Meta CAPI stale-timestamp bug**: `QualifiedLead`/`BookedCall`/`Purchase`
   events always used "now" instead of when the thing actually happened. Fixed by
   adding sheet columns Z/AA/AB and reading them — **but capped at 7 days**,
   because Meta's Conversions API hard-rejects (`error 2804003`) any event older
   than that. This was discovered by testing against the real Meta API, not
   assumed from documentation — worth remembering if you touch this logic again.
6. Cleaned up: a full local disk (`/tmp/cdp-*` — dozens of leftover headless-Chrome
   profile directories from CDP-based screenshot/testing scripts, 1.4GB) that was
   blocking `next build` entirely with `ENOSPC`. **If you use the CDP screenshot/
   testing pattern in this repo (raw WebSocket to a headless Chrome instance —
   there's no Puppeteer/Playwright dependency here), always pass a fresh
   `--user-data-dir` per run AND delete it afterward**, or the disk fills up
   silently over a long session.

## 6. Known open items (not blocking, but real)

- **Sunpress vs SantramFarm**: the "Sunpress" demo store's homepage says
  "Sunpress" but its live product/checkout pages say "SantramFarm" — an
  unfinished rename on the client's Shopify store. Currently shown as "Sunpress"
  in `content.ts` with a comment flagging it. Needs Ankit/Tushar to confirm
  which name is correct before this matters for real ad traffic.
- **No real client testimonial** — only a founder (Tushar) quote exists. If a
  real customer quote becomes available, it belongs in `content.ts`'s `QUOTE`.
- **"~7 days" vs the FAQ's "3-4 weeks"** — the hero uses "~7 days" as a marketing
  hook; the FAQ doesn't currently need reconciling since the literal timeline
  section was deliberately cut, but confirm this is still fine before scaling spend.
- **3 stray test rows in Baserow's "Website Leads" table** (`CDP Verify Test`,
  phone `9999999999`) — the site's own `BASEROW_LEADS_TOKEN` only has
  Read+Create permission, not Delete, so these couldn't be cleaned up
  programmatically. Trivial to delete by hand in the Baserow UI, or ask Ankit for
  a delete-capable token.
- **Meta access token is hardcoded inline** in the "Send Meta Event" n8n node
  instead of stored as a proper n8n credential. Works fine, but normal hygiene
  would be to rotate it into a credential at some point.
- **Not yet built** (explicitly out of scope until ad spend is approved):
  the actual paused campaign skeleton (1 CBO, ₹2,000/day, 2 ad sets, 4 ads),
  AI-generated ad creatives (OpenAI image API), a second page variant for
  existing-store owners (Buyer 2).
- **Good ideas from a Meta-AI-generated audit, not yet implemented** (low
  priority pre-spend, listed here so they aren't lost): rename the custom
  `BookedCall` event to Meta's standard `Schedule` event (easier to select in
  Ads Manager without a Custom Conversion); give `QualifiedLead` a calibrated
  `value` (e.g. based on budget band + photos-ready) instead of none, so Meta
  gets a non-binary signal once there's real volume to optimize on.

## 7. Engineering conventions specific to this repo (don't relearn the hard way)

- **No Tailwind.** CSS Modules only, using tokens from `website/src/app/globals.css`.
- **Vercel does not auto-deploy from git.** Run `vercel --prod --yes` from inside
  `website/` and curl-verify the live URL afterward.
- **n8n workflow updates via the raw REST API** (`PUT /workflows/{id}`) must send
  *only* `{ name, nodes, connections, settings }` — including extra keys from a
  GET response (like `availableInMCP`) makes the PUT fail. This repo also has an
  n8n MCP tool suite (`get_workflow_details`, `validate_workflow`,
  `update_workflow` via the SDK) — prefer that for anything beyond a small
  surgical node-parameter patch.
- **Meta CAPI event_time**: must be within the last 7 days or the whole request
  is rejected (not just that event) — see §5.5.
- Credentials: `website/.env.local` has Baserow + Google Sheets/OAuth for the
  website's own API routes; repo-root `.env` has `N8N_API_URL`/`N8N_API_KEY` plus
  the same Google OAuth client (both can refresh the same Google account's
  access token — useful for scripts that need to read/write the n8n-side sheet
  directly, as several verification scripts this session did).

## 8. How to verify changes to this funnel

1. `cd website && npm run build` — must stay clean (typecheck + build).
2. `node scripts/check-mobile.mjs http://localhost:PORT/shopify-store-build` — real
   mobile-viewport overflow check via CDP (not a fake window-resize check).
3. For a full form submission test, drive the DOM directly via CDP
   (`document.querySelector(...).requestSubmit()`) rather than relying on native
   `<select>`/`<input>` autofill — this repo has no Puppeteer/Playwright, scripts
   are hand-rolled against the raw DevTools Protocol. Clean up any test rows this
   creates in both the generic Google Sheet and the n8n-specific "Leads" sheet
   (see §6 for why Baserow cleanup may need a human).
4. For n8n changes, test the actual Meta API call directly (a plain `fetch` with
   the real token) before trusting new logic — this is how the 7-day rejection in
   §5.5 was caught, and code review alone would have missed it.
