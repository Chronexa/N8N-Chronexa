# Setting Tushar up to run Meta ads with Claude

Goal: Tushar can analyse and manage the ad account through Claude, without holding
credentials he does not need.

## Why not just copy Ankit's `.env`

That file holds 60+ secrets — Baserow email **and password**, OpenAI, Anthropic, Gemini,
ManyReach, DataForSEO, Google OAuth refresh tokens, the n8n API key, and the WhatsApp
sending token. None of it is needed to run ads, and the WhatsApp token in the wrong hands
can get the business number banned. Give him an ads-only credential instead.

## Step 1 — finish the scoped Meta account (Ankit, ~3 min)

A system user already exists: **"Ads Analyst (Tushar)"**, id `122097677409459469`,
role EMPLOYEE. It has no assets and no token yet.

In **business.facebook.com → Business Settings → Users → System Users → Ads Analyst (Tushar)**:

1. **Add Assets** → Ad Accounts → select the ad account (`act_1182766592057781`) →
   enable **Manage campaigns** (and View performance). Do **not** grant the Page, the
   WhatsApp account, or the pixel.
2. **Generate New Token** → app **CX Ads** → tick **only** `ads_read` and `ads_management` →
   Never expires.

That token can read and change ads. It cannot send WhatsApp messages, cannot read leads,
and cannot touch the Page.

## Step 2 — give him his own `.env`

Create `.env` in his clone with only these keys:

```
META_AD_ACCOUNT_ID=act_1182766592057781
META_BUSINESS_ID=1166928335409343
META_APP_ID=996838773388054
META_APP_SECRET=<from Ankit>
META_ACCESS_TOKEN=<the ads-only token from Step 1>
META_API_VERSION=v23.0
```

Then run once to derive the signature every call needs:

```bash
node -e "const{loadEnv,setEnv,appSecretProof}=require('./scripts/meta/lib');const e=loadEnv();setEnv('META_ACCESS_TOKEN_PROOF',appSecretProof(e.META_ACCESS_TOKEN,e.META_APP_SECRET))"
```

`META_APP_SECRET` is unavoidable — every Graph call must be signed with it because the app
has *Require App Secret* enabled. It is the one shared secret in this setup.

## Step 3 — Claude Code, web or desktop

**Desktop / CLI (recommended today).** Clone the repo, drop in the `.env` above, run Claude
Code in the folder. Works immediately.

**Web (claude.ai/code).** Works from the GitHub repo, but two things must be true first:

1. **The Meta work must be pushed.** As of 2026-08-27 `scripts/meta/` is untracked — none of
   it is in GitHub, so a web session would open a repo with none of this in it.
2. **Credentials must be set in the web environment**, not the repo. `.env` is gitignored and
   must stay that way. Set the six keys above as environment variables on the cloud
   environment instead.

## What he can and cannot do

| | |
|---|---|
| Read every ad metric, build any report | yes |
| Pause / resume ads, change budgets, create campaigns and creatives | yes |
| Read leads, send WhatsApp, touch the Page or pixel | **no** |
| Touch n8n workflows, Baserow, the website | **no** |

## Guardrail worth adding

`ads_management` means Claude can spend money. Before Tushar works unattended, add a
PreToolUse hook that requires explicit confirmation for any call that creates a campaign,
raises a budget, or resumes a paused ad — reads and reports stay instant. The repo already
has a tenant-isolation hook that can be extended; see `[[project_tenant_isolation_guard]]`.
