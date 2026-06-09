# SEO Forensic Audit — chronexa.io

_Date: 2026-06-08 · Property: `sc-domain:chronexa.io` · Window: last 90–120 days of Google Search Console_

This is an evidence-based audit, not a checklist. Every finding below comes from one of:
- **GSC** — live Google Search Console data (`scripts/gsc-ctr-targets.mjs`, `scripts/gsc-cannibalization.mjs`, `scripts/gsc-audit-data.json`)
- **Live HTTP** — `curl` against the production site
- **Code** — the actual Next.js source in `website/`
- **Off-page** — backlink tooling (currently unavailable, see Finding 5)

The site is technically well-built (clean metadata, sitemap, robots, structured data, working 301s, 100/100 Lighthouse). **The problem is not the build. It is that the site is seen but not clicked, and the traffic it earns is the wrong traffic.**

---

## Headline: a click problem, not a ranking problem

**Last 90 days: 89,618 impressions → 177 clicks = 0.2% sitewide CTR.**

| Page | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|
| `/blog/n8n-ai-agent-node-build-multi-agent-systems-in-2026` | 34,264 | 5 | 0.01% | 7.4 |
| `/blog/top-ai-automation-agencies-b2b-saas-2026` | 7,744 | 7 | 0.09% | 8.9 |
| `/blog/ai-in-2025-hype-reality-and-the-market-landscape` | 5,100 | 1 | 0.02% | 10.9 |
| `/blog/n8n-vs-zapier-in-2026-...` (now 301'd) | 4,024 | 0 | 0% | 8.4 |
| `/blog/ai-automation-agency-pricing-what-you-get` | 3,911 | 3 | 0.08% | 8.0 |
| `/` (homepage) | 1,803 | 127 | 7.0% | 3.6 |

The homepage is the only page that converts impressions to clicks (because it ranks pos 3.6, mostly for the brand term). Everything else ranks on page 1–2 and gets **effectively zero clicks**. A normal position-7 result on a high-volume query earns ~1–2% CTR — hundreds of clicks here. 0.01% means the result is functionally invisible: almost certainly sitting *below* an AI Overview / featured snippet on long-tail informational queries, with a title/meta that doesn't earn the click.

**10 pages have ≥200 impressions, rank ≤ position 15, and convert 0.0%.** This is the single biggest, fastest-to-fix bleed — the impressions are already won.

---

## Finding 2 — Wrong traffic: the blog ranks, the money pages don't

- **116 of 131** pages with GSC data are blog posts. The winning queries are informational: _"n8n ai agent tutorial 2026"_, _"n8n vs zapier pricing comparison 2026"_, _"n8n ai agent node documentation 2026"_.
- The **29 commercial service pages** (`legal-due-diligence-automation`, `insurance-claims-triage-automation`, `finance-automation`, etc. — the pages that actually sell) get **near-zero impressions**. None appear in the top pages or in the CTR-target list.
- Translation: chronexa.io ranks for people *learning n8n*, not for buyers searching _"legal document automation agency"_ or _"insurance claims automation company"_. Even if CTR were fixed tomorrow, the resulting clicks would be low purchase-intent.

This is the strategic gap. Fixing CTR (Finding 1) recovers traffic you already earn; fixing this earns the traffic that converts to leads.

---

## Finding 3 — Cannibalization: mostly fixed, residual remains

The consolidation redirects **are deployed and working** (verified live):

| URL | Status | Redirects to |
|---|---|---|
| `/blog/n8n-ai-agent-node-enterprise-architecture-guide-(2026)` | 301 | `…build-multi-agent-systems-in-2026` |
| `/blog/n8n-vs-zapier-in-2026-cost-ai-features-and-when-to-choose-each` | 301 | `…n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis` |
| `/blog/n8n-ai-agent-features-2026` | 301 | `…n8n-ai-agents-features-2026-complete-guide` |
| `/blog/n8n-ai-agents-features-2026` | 301 | `…n8n-ai-agents-features-2026-complete-guide` |

But GSC's 120-day window still shows **up to 5 URLs splitting signal** on _"n8n ai agent…"_ queries, because the data lags the redirects (it will reconsolidate over the coming weeks). And **two pillars remain live (HTTP 200) and overlap** on the same query cluster:
- `/blog/n8n-ai-agents-features-2026-complete-guide`
- `/blog/n8n-ai-agent-node-build-multi-agent-systems-in-2026`

Action: let the 301s reconsolidate, then differentiate these two surviving pillars into distinct query lanes (one "what the node does / features", one "how to build multi-agent systems") or merge and 301 the weaker. Re-run `scripts/gsc-cannibalization.mjs` in ~3 weeks to confirm the 5→1 collapse.

---

## Finding 4 — Brand SERP not locked

Query **"chronexa"**: the homepage ranks only **pos 2.4** (something outranks the brand on its own name), and `/about` competes for the same bare term at pos 8.3. The brand SERP should be wholly owned by the homepage, with `/about` ranking for _"about chronexa"_ — not the bare brand. This is both a cannibalization and an authority signal worth chasing because brand clicks are the highest-intent traffic the site gets (127 of 177 total clicks).

---

## Finding 5 — Off-page is a blind spot (and likely the real ceiling)

The Ahrefs integration returns **"Insufficient plan"** — we currently have **zero backlink visibility**. A freshly-migrated domain (Framer → Next.js) with few referring domains has low authority, which is the most probable reason nothing breaks into the **top 3**, where the clicks actually live. No amount of on-page work lifts a low-authority domain past stronger competitors.

**No paid tool is required to fix this.** Backlink *data* is available free via **Ahrefs Webmaster Tools** (free for your own verified domain — verify through the existing GSC connection), the **GSC Links report**, and **Bing Webmaster Tools**. Building links is then a zero-budget program led by the n8n ecosystem (templates + expert listings), directories, and digital PR. Full plan: **[backlink-playbook.md](./backlink-playbook.md)**. This cannot be fixed in code — it's an ongoing effort, and it's the real growth lever.

---

## Finding 6 — Technical / on-page gaps (code-confirmed)

| Severity | Issue | Location | Note |
|---|---|---|---|
| Low* | Service & case-study pages have no page-specific Twitter Card | `src/app/*/page.tsx`, `src/app/case-studies/[slug]/page.tsx` | They inherit the generic homepage card from `layout.tsx`, so sharing a service page on X shows the homepage preview. Social CTR only — **not a Google ranking factor.** |
| Medium | Founder LinkedIn `sameAs` empty for all 3 founders | `src/lib/site.ts` → Person schema in `layout.tsx` | E-E-A-T signal lost. **Needs the 3 real LinkedIn URLs.** |
| Medium | Case-study body headings not normalized (blog posts are) | `src/app/case-studies/[slug]/page.tsx` vs blog's `normalizeHeadings()` | Risk of broken H-hierarchy if a case study is authored with skipped levels. _(Fixed in this pass.)_ |
| Medium | Sitemap case-study `lastModified` always = build time | `src/app/sitemap.ts` | Sends a false "changed" ping to Google on every deploy. _(Fixed in this pass — now uses Sanity `_updatedAt`.)_ |
| Medium | No blog→case-study internal links (only blog→service) | `src/lib/blog-links.ts`, `RelatedServices.tsx` | Case studies (proof pages) receive no internal link equity. Needs a small design change (case studies are dynamic Sanity content). |
| Low | Blog/case-study body images fall back to `alt=""` | `src/app/blog/[slug]/page.tsx`, `…/case-studies/[slug]/page.tsx` | Empty alt is *correct* for decorative images; forcing a repeated generic alt would harm a11y/SEO. **Real fix is filling the `alt` field in Sanity**, not code. |
| Review | Unverified bold claims | `src/components/Numbers.tsx` ($12M+ ROI, 100+ automations, 80% return, 65× output); `src/lib/services-content.ts` (6 hrs→11 min, 40–60%, 50% faster close) | Trust/legal risk. **Must be substantiated or softened before any promotion.** |

\*Twitter cards are deprioritized because they are not a search ranking factor; they affect social-share appearance only.

---

## Remediation roadmap (prioritized by impact ÷ effort)

### Tier 1 — CTR rescue · highest impact, fastest payback
The impressions are already won; winning even 2% CTR ≈ 10× the clicks. For the ~10 zero-CTR / high-impression pages:
1. Rewrite each page's `<title>` and meta description around the **exact top query it already ranks for** (data: `scripts/gsc-ctr-targets.mjs`). Example: the multi-agent post ranks pos 8.8 for _"n8n ai agent tutorial 2026"_ — the title should lead with that, not a generic headline.
2. Add a concise **direct-answer block** (40–60 words) high on each page to compete for the AI Overview / featured snippet currently eating the clicks.
3. Ensure `FAQPage` + `Article` structured data on these blog posts.
4. Re-measure CTR in GSC after 2–3 weeks.

Existing tooling: `website/scripts/gsc-ctr-rewrite.mjs` already exists for this; blog content is in Sanity.

### Tier 2 — Finish cannibalization + lock brand · low effort
Differentiate or merge the 2 surviving n8n-ai-agent pillars; lock the homepage as sole canonical for "chronexa"; re-verify with `gsc-cannibalization.mjs` in ~3 weeks.

### Tier 3 — Technical quick wins · safe, fast
Founder LinkedIn `sameAs` (needs URLs), case-study heading normalization (done), sitemap `lastModified` (done), page-specific Twitter cards, blog→case-study links, fact-check/soften the bold claims (needs source data).

### Tier 4 — Strategic: rank the money pages + build authority · long game, the real growth lever
1. **Buyer-intent content** targeting commercial queries, internally linked to the 29 service pages.
2. **Backlinks** — get a real backlink data source, baseline referring domains, run a link program (linkable assets, the original-research posts that already perform, guest placement). Authority is the ceiling on everything above.
3. **Self-hosting-n8n content gap** — 5 existing posts want to link to a "self-hosting n8n" post that doesn't exist; writing it captures internal-link demand and a 3.3k-impression query already ranking.

---

## How to reproduce every number here
```bash
# from repo root, OAuth refresh token must be in .env
node scripts/gsc-ctr-targets.mjs        # CTR-bleed pages + their best query
node scripts/gsc-cannibalization.mjs    # queries with 2+ competing URLs
curl -sI https://chronexa.io/blog/<slug># confirm redirect status (301 vs 200)
```
Success after Tier 1/2 ship: sitewide CTR rising off 0.2%, and the "n8n ai agent" cluster collapsing from 5 URLs to 1 in GSC.

## Open inputs — status
- ✅ 3 founders' LinkedIn URLs added to Person `sameAs` (2026-06-08).
- ✅ Bold claims confirmed real by founder — kept as-is.
- ✅ Backlink tooling resolved: **no paid tool needed** — use free Ahrefs Webmaster Tools + GSC Links + Bing WMT (see [backlink-playbook.md](./backlink-playbook.md)).
