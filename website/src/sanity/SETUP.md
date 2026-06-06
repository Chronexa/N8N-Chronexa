# Sanity — setup & operations

**Status: LIVE.** Studio is embedded at `/studio`, schema is in [`schema/`](./schema),
and 157 posts have been imported. Project `up57bpxm`, dataset `production` (public).

## Environment (website/.env.local — gitignored)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=up57bpxm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=...          # Editor token — importer + n8n writes
SANITY_ACCESS_MANAGER_TOKEN=...     # Access-manager token (not used at runtime)
```

## Embedded Studio (`/studio`)

- `sanity.config.ts` (repo root) + `src/app/studio/[[...tool]]/{layout,page}.tsx`.
- The page is a Client Component (`'use client'`); the layout (server) carries
  `dynamic='force-static'` + `next-sanity/studio` metadata (noindex).
- `ChromeGate` hides the site Nav/Footer on `/studio`.

### ⚠️ One manual step: CORS origins (Admin-only, do in Manage UI)

The browser Studio calls the Sanity API with your login, so each origin must be
allow-listed. API tokens **cannot** add CORS (needs Administrator); do it in the UI:

> sanity.io/manage → project `up57bpxm` → **API → CORS origins → Add CORS origin**
> Add each with **Allow credentials = ON**:
> - `http://localhost:3000`  (local dev)
> - the Vercel deployment URL (after first deploy)
> - `https://chronexa.io`  (final domain)

Until an origin is added, `/studio` loads but login/data calls fail in that origin.

## One-time blog import

`node scripts/import-blogs.mjs` (`--dry-run` to preview, `--limit=N` to test).
Re-running is idempotent (deterministic `_id`s). Re-run to fix the 1 cover image
that hit a transient Framer error during the initial import.

## n8n publishing

n8n writes `_type:"post"` docs via the Content Lake API using `SANITY_API_WRITE_TOKEN`.
Field names match [`schema/post.ts`](./schema/post.ts). Add a revalidation webhook so
new posts appear without a redeploy (`/blog` + `/blog/[slug]` use ISR, 1h).
