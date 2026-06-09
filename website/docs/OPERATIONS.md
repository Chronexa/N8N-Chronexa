# Chronexa Website — Operations Runbook

The chronexa.io marketing site: Next.js 16 (App Router, TypeScript, vanilla CSS Modules — **no Tailwind**), Sanity CMS, deployed on Vercel. This is the single reference for how it's hosted, deployed, and wired. Companion: [analytics-taxonomy.md](./analytics-taxonomy.md).

_Last updated: 2026-06-08._

---

## Hosting & deploy

| | |
|---|---|
| **Repo** | `github.com/Chronexa/chronexa-website` (private). gh authed as `Chronexa`. |
| **Vercel project** | `chronexa-website` · scope `chronexa-projects` · `prj_O8XlGtV9sffnsBDCHiNBExZZLXMf` |
| **Framework** | pinned via `vercel.json` (`framework: nextjs`) |
| **Auto-deploy** | Git-connected: **push to `main` → production deploy** automatically |
| **Manual deploy** | from `website/`: `npx vercel@latest --prod` (CLI not globally installed — use `npx`; login is the device-code flow) |
| **Deploy protection** | ON for `*.vercel.app` preview URLs (401 / Vercel login); the production domain is public |

**Verify a deploy is live:** the API routes flip 404→405 for GET when deployed (e.g. `curl -s -o /dev/null -w '%{http_code}' https://chronexa.io/api/cal/webhook` → `405`).

---

## Domains & DNS (GoDaddy)

| Host | Record | Value | Notes |
|---|---|---|---|
| `chronexa.io` (apex) | A | `216.198.79.1` | Vercel |
| `www.chronexa.io` | CNAME | `cname.vercel-dns.com` | **308-redirects to apex** (set in Vercel project → Domains) |

Canonical host is the **apex**. `NEXT_PUBLIC_SITE_URL` is unset — code defaults to `https://chronexa.io`, which is correct (canonical/OG/sitemap all resolve to it). DNS cutover from the old Framer site done 2026-06-07.

---

## Environment variables (Vercel + local `website/.env.local`)

`.env.local` is gitignored — **secrets never travel with code**. Set the same vars on Vercel (Production; add Preview/Development if branch previews need them — note: `vercel env add … preview` needs a branch arg).

| Var | Purpose | Public? |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` / `_API_VERSION` | Sanity CMS (blog/case studies). Project `up57bpxm`. | public |
| `SANITY_API_WRITE_TOKEN` / `SANITY_ACCESS_MANAGER_TOKEN` | Sanity writes / studio | secret |
| `BASEROW_LEADS_TOKEN` | Lead capture → Baserow | secret |
| `BASEROW_HOST` (`https://api.baserow.io`) / `BASEROW_LEADS_TABLE_ID` (`1015183`) | Baserow target | config |
| `GSC_CLIENT_ID` / `GSC_CLIENT_SECRET` / `GOOGLE_OAUTH_REFRESH_TOKEN` | Google OAuth (Sheets append; also GSC API) | secret |
| `GOOGLE_SHEET_ID` | Leads mirror sheet | config |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | Amplitude client key (project `chronexa-153286`) | public (browser) |
| `CAL_WEBHOOK_SECRET` | HMAC-verify Cal.com webhook | secret |

> Old `BASEROW_API_KEY` is dead — use `BASEROW_LEADS_TOKEN`. The Google **service account** was removed (Workspace blocked it); Sheets/Drive use OAuth (client id/secret + refresh token).

---

## Lead capture

`POST /api/contact` (`src/app/api/contact/route.ts`) **dual-writes** each lead, best-effort (never blocks the UX):
1. **Baserow** "Website Leads" table `1015183` (DB 435827) — *not* the Master Leads CRM.
2. **Google Sheet** (in Ankit's Drive) via OAuth refresh token.

The form (`LeadForm.tsx`) then hands the visitor to **Cal.com** (`https://cal.com/chronexa/30min`), prefilled. Verified working on the live domain.

---

## SEO

- **Sitemap** `https://chronexa.io/sitemap.xml`, declared in `robots.txt`. Registered in GSC (`sc-domain:chronexa.io`, submitted 2026-06-01, 0 errors). Google re-reads it automatically. The saved `GSC_REFRESH_TOKEN` is **read-only** — to push a fresh submit, re-consent with the `webmasters` write scope or use the GSC dashboard.
- **Redirects (preserve rankings):** `next.config.ts` `redirects()` for path-level (services, `/articles/:slug → /blog/:slug`); `src/proxy.ts` exact-match map for blog slugs (handles parentheses/special chars path-to-regexp can't). All `permanent` (301/308).
- **404-recovery audit (re-run after any Sanity slug change):** pull GSC-indexed pages via the Search Console API (`searchanalytics.query`, dimension `page`), HEAD-test each against the live site, and add a redirect for any that 404. This caught 13 dead Framer URLs post-launch (incl. a ~5k-impression n8n-vs-zapier page) → all now 301-redirect.
- Per-page canonicals, OG/Twitter tags, dynamic `/opengraph-image`, JSON-LD schema, `llms.txt`. Blog posts auto-link to relevant service pages ("Automate this with Chronexa").

---

## Analytics — see [analytics-taxonomy.md](./analytics-taxonomy.md)

Amplitude (Browser SDK v2, project `chronexa-153286`), migrated from Framer. Autocapture + Session Replay + Engagement, plus custom KPI events (content views, scroll depth, form lifecycle, CTA clicks) and **server-side Cal.com booking events** via `POST /api/cal/webhook` (HMAC-verified with `CAL_WEBHOOK_SECRET`). Identity stitched by email (`identifyByEmail` on form submit) so anon visit → form → booking is one user.

**Cal.com webhook:** subscriber URL `https://chronexa.io/api/cal/webhook`, triggers map to `booking_confirmed/requested/rejected/cancelled/rescheduled`, `meeting_completed`, `booking_no_show`.

---

## Security

- **Never commit secrets.** `.env*` gitignored. Run `gitleaks git --staged --config ../.gitleaks.toml` before committing (clean = ok).
- Public client keys (`NEXT_PUBLIC_*`) are inlined into the browser bundle by design — that's fine.
- **Open security item:** rotate the Cal.com **API key** (`cal_live_…`) shared in chat 2026-06-08 — the webhook doesn't use it, so rotating is free. (Amplitude secret key + Cal webhook secret were also chat-exposed; rotate if cautious.)

---

## Open / future items

- Rotate the exposed Cal API key (above).
- Add env vars to Vercel **Preview** environment if branch-preview deploys need Sanity/leads/analytics.
- Pre-launch fact-check of bold claims ($12M ROI / 100+ automations; named tools) and add founders' personal LinkedIn URLs (Person schema `sameAs`).
- A QA test identity (`webhook-qa@chronexa.test`) exists in Amplitude from webhook testing — filter it out of reports.
- `website/CLAUDE.md` is stale (describes the pre-launch Framer→Next migration / old dark theme) — this runbook + the taxonomy doc are the current source of truth.
