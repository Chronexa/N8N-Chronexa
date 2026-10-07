# 01 — System inventory (Phase 1) and technical SEO (Phase 10)

Evidence file for the 2026-10-06 SEO forensics. Facts with sources; interpretation is
labelled "Observation (confidence: …)". No conclusions or recommendations.

**How this was gathered (2026-10-06):** code read from the working tree (which is what
is deployed; many `website/` files are uncommitted, e.g. `website/src/app/sitemap.ts`,
`website/src/app/blog/[slug]/page.tsx`, `website/src/components/BookButton.tsx`).
Live behaviour verified against https://chronexa.io with a fresh crawl of every
non-post sitemap URL plus every app route (164 URLs), all 141 literal redirects in
`next.config.ts`, a 347-target internal link check, a 21-post sample, and DataForSEO
On-Page `instant_pages` (6 URLs, $0.0153 + ~$0.008). Raw output:
`<scratchpad>/agent-tech/site-crawl.json`, `dfs-onpage*.json`, scripts `crawl-site.mjs`,
`pag.mjs`, `ssr.mjs`, `relsvc.ts`. The 169-post crawl already in
`<scratchpad>/audit/crawl.json` was reused, not repeated.

---

# PART A — Phase 1: inventory of the SEO/content system

## A1. How articles are created and stored

Four pipelines exist or existed. Only (c) is in current use.

- **(a) n8n 5-agent blog pipeline — INACTIVE.** Added 2026-05-13 (commit `fa3326d`).
  Snapshots in `scripts/live-workflows/blog-agent-{1..5}-*.json` (refreshed 2026-09-22)
  all show `active: false`; last edits 2026-05-19 → 2026-06-11. Agent 1 "GSC Strategist"
  runs weekly, pulls GSC rows, node "Filter Striking Distance" keeps queries at
  position 11–30 with ≥50 impressions and takes the single highest-impression one
  (or a row from Baserow Keyword Backlog `1022496`), then asks Claude for a brief.
  Agents 2–5: research → copywrite → cover image → publish (every 5–10 min crons).
  `.claude/skills/blog-seo-strategy/SKILL.md:43` (2026-07-25): "the old n8n 5-agent
  pipeline is deactivated; leave it off."
  - Observation (confidence: med): the striking-distance picker selects by impressions
    only. The evidence log records that 22% of visible blog query impressions are
    machine-written LLM prompts; a picker of this shape would select such queries. It
    is inactive, so this matters only for posts it produced in May–June.
- **(b) `POST /api/blog-publish`** — `website/src/app/api/blog-publish/route.ts`
  (188 lines). Built as Agent 5's target; accepts title/slug/meta/html_body/cover/
  taxonomy, converts HTML → Portable Text, `createOrReplace` on slug, auto-classifies
  missing taxonomy via `classifyPost()` (`route.ts:129-137`), drops metaTitle if not
  15–70 chars (`route.ts:88-91`), revalidates the post and hub paths.
- **(c) Claude Code sessions → `seo/*.md` → `website/scripts/publish-blog-batch.mjs`
  — IN USE.** Drafts in `seo/` carry frontmatter (`title`, `metaTitle`, `meta`, `slug`,
  `primaryKeyword`, …). The script generates a gpt-image-1 cover, uploads to Sanity and
  POSTs to (b) (`publish-blog-batch.mjs:1-10, 62-94`). 70 draft files carry
  `primaryKeyword`. A linter (`.claude/skills/blog-seo-strategy/scripts/lint-blog-draft.mjs`)
  fires as a PostToolUse hook on `seo/` drafts.
- **(d) One-off Sanity scripts** — ~60 scripts in `website/scripts/` that created,
  rewrote, pruned or re-titled posts directly (e.g. `create-wealth-ria-posts-2026-07-30.mjs`,
  `prune-posts-2026-07.mjs`, `gsc-ctr-rewrite.mjs`, `tier2-meta-optimization-2026-07.mjs`,
  `patch-titles-metas-investmates-style-2026-08-06.mjs`, `fix-*-fabrication-2026-08-05.mjs`).

Corpus shape (from `<scratchpad>/audit/sanity-posts.json`, 169 published):
- `_createdAt`: 76 in 2026-06 (the Framer → Sanity import), 43 Jul, 18 Aug, 32 Sep.
- `publishedAt` by month: 2025-10 1, 2025-12 2, 2026-01 8, 02 7, 03 2, 04 13, 05 14,
  06 29, 07 43, 08 18, 09 32.
- Bylines: Ankit 115, Abhishek 49, Tushar 5.
- The 32 September posts map 1:1 to `seo/*.md` drafts dated 09-12 (23) and 09-14 (9),
  with primary keywords such as "ai form builder", "ai chatbot for ecommerce", "best ai
  recruiting software", "ai native crm", "airtable integrations", "crm marketing
  automation", "what is hyperautomation" (frontmatter `primaryKeyword`).

## A2. Sanity schema and taxonomy

- `website/src/sanity/schema/post.ts`: title, slug, legacy `category` (hidden),
  `industry` (8 values), `topic` (6), `format` (4), `region` (2), featured, hero(+alt),
  excerpt, keyTakeaways (≤5), readingTime, publishedAt, updatedAt, body (block/image/
  htmlTable), author ref, metaTitle, metaDescription. No field for target keyword.
- `author.ts`: name, role, about, avatar, linkedin. `caseStudy.ts`: has `targetKeyword`,
  `secondaryKeywords`, metaTitle (max 60), metaDescription (max 160), workflow steps,
  evidence type, stats, testimonial.
- Taxonomy labels/indexability: `website/src/lib/blog-taxonomy.ts`. Indexable hubs:
  industry `cpa-firms`, `law-firms`, `rias-wealth-management`, `cross-industry`; all six
  topics. Non-indexable (filter chip, no URL): `sales-revenue` (l.132), `startups`
  (l.150), `private-equity-vc` (l.164), `insurance-healthcare` (l.177).
- Hubs are rendered by `website/src/app/blog/HubPage.tsx` via
  `blog/industries/[industry]/page.tsx` and `blog/topics/[topic]/page.tsx`
  (`dynamicParams = false`, `notFound()` for non-indexable). Each hub has a 100–200-word
  intro written in `blog-taxonomy.ts`.
- Post distribution: industry cross-industry 69, CPA 35, RIA 28, law 23, sales-revenue 8,
  PE 3, insurance 3. Topic automation-platforms 53, build-vs-buy 31, compliance 31,
  cost 21, ai-agents 17, document-intelligence 16. Format guide 110, explainer 24,
  comparison 23, case-study 12. Region: none 143, UAE 13, US 13.

## A3. Sitemap, robots.txt, llms.txt

**Code:** `website/src/app/sitemap.ts` (revalidate 3600). Static list l.16-35; a
`RETIRED` set l.40-51 excludes redirected service slugs; solution pages l.54-60;
hubs from `indexableBuckets`; pagination pages 2..n; posts from Sanity; case studies.

**Live https://chronexa.io/sitemap.xml (fetched 2026-10-06): 314 URLs.**
- Blog posts 169 · blog index 1 · industry hubs 4 · topic hubs 6 · blog pagination 7
  (`/blog/page/2..8`)
- Service / solution / use-case / integration pages 42
- n8n portfolio 36 (`/n8n-portfolio` + 35 workflow pages)
- Case studies 33 (index + 32)
- AI engines 7 · calculators + `/tools` 4 · core 4 (`/about`, `/contact`, `/privacy`,
  `/solutions`) · home 1
- `lastmod`: every static/service/hub/pagination URL carries the same build timestamp
  (`2026-10-02T09:35:59Z`) because `sitemap.ts:79` uses `new Date()`; posts use
  `publishedAt || _createdAt` (`sitemap.ts:99`), never `updatedAt`.
- One sitemap URL does not return 200: `/blog/page/6` → **307** to `/blog/page/5`
  (`next.config.ts:76`, `permanent: false`).
- Indexable live pages NOT in the sitemap: `/document-pipeline` (200, index,follow —
  the destination of the blog "offer" CTA) and `/use-cases` (200, index,follow).

**robots.txt** (`website/src/app/robots.ts`, live): `Allow: /`, `Disallow: /api/,
/studio, /internal`, sitemap + host lines. Nothing indexable is blocked.

**llms.txt** (`website/src/app/llms.txt/route.ts`, `force-static`; live 200, 3,751 bytes):
one-paragraph definition ("Chronexa is an AI automation agency…"), the 11 solution
pages from `taxonomy.ts` `services`, 5 key pages (solutions, case studies, blog, about,
contact), email + "IXC, India". Lists no individual blog posts, no case studies, no
calculators, no Shopify offer.

## A4. Canonicals, metadata templates, structured data

- **Root layout** `website/src/app/layout.tsx:44-69`: default title `site.title`
  ("Chronexa | AI Automation Agency That Builds for You"), template `%s | Chronexa`,
  canonical `/`, robots index/follow, googlebot `max-snippet:-1`. Organization + WebSite
  JSON-LD appear on every page.
- **Blog posts** `website/src/app/blog/[slug]/page.tsx:36-58`: `title: { absolute }`
  = metaTitle || title with any trailing "| Chronexa" stripped (no brand suffix by
  design; 168/169 live post titles carry no brand), description = metaDescription ||
  excerpt, canonical `/blog/{slug}`. JSON-LD l.258-305: BlogPosting (headline = `title`,
  not metaTitle; dateModified = updatedAt||publishedAt; author Person with LinkedIn
  sameAs), BreadcrumbList that includes the industry hub (l.283-285) even when that hub
  has no URL, FAQPage when ≥2 FAQ pairs are extracted.
- **Service pages:** `website/src/lib/seo.ts` `serviceMetadata()` (absolute title,
  canonical `/{slug}`) for registry pages; bespoke pages set their own metadata.
- **Inconsistencies observed live:**
  - 8 titles render the brand twice ("… | Chronexa | Chronexa"): `/ai-engines` and all
    6 `/ai-engines/*`, plus `/document-pipeline` (page title already contains
    "| Chronexa" and the layout template appends another).
  - AI-engine titles are 76–98 chars and descriptions 201–421 chars; case-study titles
    up to 113 chars and one description of 1,102 chars
    (`/case-studies/how-reservestudy-automated-report-production-with-ai`). 58 of 146
    indexable non-blog pages have titles >60 chars; 50 have descriptions >160.
  - Blog posts: 5 titles >60 chars, 0 >65; 21 descriptions >160.
  - `/document-pipeline` and `/n8n-portfolio` index emit no page-level schema;
    `/n8n-portfolio/*` emit CreativeWork.

## A5. Internal linking systems

- **Post → service ("Automate this with Chronexa")**: `website/src/components/RelatedServices.tsx`
  using `relatedServices()` in `website/src/lib/blog-links.ts:84-101`: pillar by
  industry (`PILLAR_BY_INDUSTRY`, l.50-58) + keyword regex `RULES` (l.13-37) +
  `FALLBACK` (l.39) = `n8n-automation-services`, `document-processing-automation`,
  `sales-revenue-automation`; capped at 3.
- **"Read next" pillar link** (`[slug]/page.tsx:428-432`) uses `pillarFor()`.
- **Related posts ("Keep reading")**: `website/src/sanity/client.ts:146-162` scores only
  the **60 newest** posts by industry/topic overlap and shows 3. The older 109 posts can
  never appear in any post's "Keep reading" row.
  - Observation (confidence: high): this is a mechanical contributor to the
    already-established "67 posts have no inbound link from another post".
- **Breadcrumb + eyebrow** link the industry hub for every post (`[slug]/page.tsx:330-345`),
  including the 3 industries whose hubs 404 (14 posts: sales-revenue 8, PE 3,
  insurance 3).
- **Calculator matching** `CALC_RULES` (`blog-links.ts:110-114`): legal/billing →
  law-firm billing-leakage calculator; tax/CPA/bookkeeping → CPA capacity calculator;
  document/OCR/data entry → document-cost calculator; none for `startups`.
- **Computed for all 169 posts** (running the real `blog-links.ts` under tsx, script
  `relsvc.ts`):
  - **130 of 169 posts have ≥1 "related service" link that is a 308 redirect.** Targets
    and counts: `n8n-automation-services` 63 (→ `/ai-automation`), `finance-automation`
    44 (→ `/document-processing-automation`), `sales-revenue-automation` 31 (→
    `/ai-sales-outreach-engine`), `ai-automation-agency-dubai` 13 (→ `/ai-automation`),
    `ai-readiness-assessment` 3, `marketing-automation` 1. All 8 sales-revenue posts get
    a redirecting pillar link.
  - CPA posts' pillar is `/cpa-tax-document-automation` (35) and legal posts'
    is `/legal-due-diligence-automation` (23) — the older registry pages, not the
    2026-09-14 rebuilt nav pages `/cpa-accounting-automation` and `/legal-ai-automation`.
- **Reverse direction**: of 64 crawled non-blog, non-case-study, non-portfolio pages,
  **0 link to any individual blog post**; 62 link to `/blog`. The sitewide nav/footer
  links all 10 hubs and `/blog`.
- **Sitewide nav links to 4 redirecting URLs**: `/finance-automation`,
  `/operations-automation`, `/sales-revenue-automation`, `/marketing-automation`
  appear on every crawled page (169/169 in the link check) via the "Use cases → by
  function" menu (`website/src/components/Nav.tsx:155`, data `website/src/lib/taxonomy.ts:56-62`).
- Body links inside Sanity content: 21-post sample had 55–61 internal links per page
  (mostly chrome); body links include retired URLs (see B7).

## A6. Non-blog page architecture (live status, 2026-10-06)

All listed below return 200, self-canonical, `index, follow`, 1 H1, unless noted.

- **Solutions (nav, rebuilt 2026-08-18 → 09-14), 11:** `/ai-automation`,
  `/ai-workspace-setup`, `/business-process-automation-consulting`,
  `/document-processing-automation`, `/ai-sales-outreach-engine`,
  `/crm-automation-services`, `/customer-support-automation`, `/cpa-accounting-automation`,
  `/legal-ai-automation`, `/investment-research-automation`,
  `/industrial-data-predictive-maintenance` (1,227–2,971 words).
- **Use cases by function (in sitemap):** `/hr-automation`, `/cybersecurity-automation`.
  By function, redirected but still in nav: finance, operations, sales-revenue, marketing.
- **Use cases by industry / older pillars, 6:** `/legal-due-diligence-automation`,
  `/cpa-tax-document-automation`, `/insurance-claims-triage-automation`,
  `/financial-services-automation`, `/vc-pe-crm-automation`,
  `/pharma-life-sciences-automation`. Demoted but indexed: `/property-management-automation`,
  `/d2c-ecommerce-automation`; law-firm size pages `/ai-for-{large,mid-size,small}-law-firms`.
- **Integration long-tail, 18:** iManage/NetDocuments, contract review, matter intake,
  regulatory filing, time capture, Relativity, law-firm KM, tax-software AI, K-1 OCR,
  bookkeeping QBO/Xero, SafeSend/Karbon, RIA CRM, RIA compliance, advisor co-pilot,
  Affinity CRM, pitch-deck parsing, term-sheet analysis, portfolio monitoring
  (743–1,363 words each).
- **AI engines, 7:** `/ai-engines` + 6 engines (849–3,781 words; double-brand titles).
- **Calculators/tools, 4:** three calculators (2,437–2,866 words) + `/tools` (284 words).
- **Case studies, 33**, **n8n portfolio, 36** (developer-facing workflow pages incl.
  `/n8n-portfolio/blog-agent-1-strategist` … `-5-publisher`).
- **Core:** `/`, `/solutions`, `/about`, `/contact` (82 words), `/privacy`.
- **Not in sitemap but indexable:** `/document-pipeline` ($3,500 / 14-day offer page;
  title "Document Automation in 14 Days — Fixed Price | Chronexa | Chronexa"), `/use-cases`.
- **Noindex (paid/landing):** `/shopify-store-build`, `/shopify-store-build-india`
  (`noindex, follow`, 2 internal links each, chrome hidden by `ChromeGate`),
  `/n8n-ai-automation-startups` (`noindex, follow`), `/internal/campaigns`
  (`noindex, nofollow`, also robots-disallowed).
- **Overlapping pages per vertical (same buyer, both indexable):**
  CPA = `/cpa-accounting-automation` ("CPA Firm Automation & Tax Workflow Systems"),
  `/cpa-tax-document-automation` ("AI Automation for CPA & Accounting Firms"), hub
  `/blog/industries/cpa-firms` ("AI Automation for CPA & Accounting Firms — Chronexa
  Blog"), `/ai-engines/cpa-tax-engine`. Legal = `/legal-ai-automation`,
  `/legal-due-diligence-automation`, `/ai-engines/legal-regulatory-engine`, 3 law-firm
  size pages, 7 legal integration pages.
  - Observation (confidence: med): this is a cannibalisation risk pattern; whether it
    actually splits rankings needs the GSC page×query data in `03-gsc-forensics.md`.

## A7. Conversion CTAs

**On blog posts** (`[slug]/page.tsx:309-476`), one plan per post from `articleCta()`
(`blog-links.ts:218-234`):
- Sticky bar `BlogStickyCta` (fires `blog_sticky_cta_shown`), mid-article
  `BlogInlineCta`, end block `ArticleCta`, author box, "Keep reading", RelatedServices.
- Tier distribution across the 169 posts (computed): **call 67, calculator 62, scope 36,
  offer 4.**
  - `call` / `scope` → `BookButton` → **Calendly** `https://calendly.com/ankit-chronexa/30min`
    (`website/src/lib/site.ts`, `site.booking`), new tab.
  - `calculator` → `CalcCtaButton` → internal calculator page.
  - `offer` (agency-shopping and outsourcing-vs comparisons) → `/document-pipeline`
    (send-10-documents form).
- **In-body links** written into Sanity content point to **Cal.com**
  `https://cal.com/chronexa/30min` (18 of 21 sampled posts; live 200, a separate booking
  page titled "Discovery: AI Automation Workflow | Ankit Dhiman | Cal.com"). The
  doctrine still instructs this (`SKILL.md:111` "→ cal.com/chronexa/30min").
  - Observation (confidence: med): two booking systems are live on blog pages; the
    Calendly-based attribution in `00-evidence-log.md` would not see Cal.com bookings.
- ExitIntent is suppressed on `/blog*` (`ExitIntent.tsx:15-22`); ChatWidget is present.

**On service pages:** `LeadForm` (one form, email field) + Calendly BookButtons; 148
crawled pages carry the Calendly link. Shopify landing pages carry neither (own form).

## A8. Analytics implementation

- Amplitude Browser SDK, `website/src/components/Analytics.tsx:65-81`: autocapture
  incl. `pageViews` and `attribution`, Session Replay plugin, proxied through
  `/api/amplitude/*` (`next.config.ts:18-28`). First-touch user props (referrer,
  landing_path, utm_*) via `VisitorIdentify.tsx:22-28`.
- Blog events: `blog_post_view` (slug, title, industry, topic, ctaTier —
  `[slug]/page.tsx:309`), `scroll_depth`, `blog_sticky_cta_shown`, `book_cta_click`,
  `calculator_cta_click`, `cta_click` (offer tier).
- **`book_cta_click` pathname:** `trackBookCta(location, pathname?)` (`lib/cal.ts:57-59`).
  Only `BookButton.tsx:28-34` passes pathname. Callers that omit it: `ChatWidget.tsx:313,330`
  (present on blog pages), `LeadForm.tsx:42`, `ExitIntent.tsx:101`,
  `N8nStartupPage.tsx:127`, `startup/HeroLeadForm.tsx:62`.
  - Observation (confidence: med): explains the 102 pathname-less `book_cta_click`
    events in the evidence log.
- **UTMs to booking:** `attributedBookingUrl()` (`lib/cal.ts:16-34`) adds
  `utm_source=chronexa-blog|chronexa-website`, `utm_medium=organic`,
  `utm_campaign=blog-conversion`, `utm_content=<pathname>`, `utm_term=<location>`.
  Applied to BookButton at click time and to in-body Cal.com links at render (verified
  in live HTML). First appears in git in commit `935c1b2` (2026-09-29) although the
  evidence log sees `utm_content` on bookings from ~09-17 (deployed from the
  uncommitted tree before commit).
- **Meta Pixel** (`MetaPixel.tsx`) renders sitewide incl. blog posts (live HTML contains
  `connect.facebook.net` and `facebook.com/tr`). No GA4/GTM.

## A9. SEO tooling inventory

`scripts/` (root):
- `gsc-auth.mjs` — one-time GSC OAuth. `gsc-site-audit.mjs` — 90-day GSC pull →
  `scripts/gsc-audit-data.json`. `gsc-meta-optimizer.mjs` (05-25) — writes meta
  descriptions from each post's top query. `gsc-ctr-targets.mjs` — pos 3–15 low-CTR
  pages. `gsc-cannibalization.mjs` — queries with 2+ own URLs. `gsc-rank-check.mjs`
  (07-28) — monthly rank check for the CPA cluster. `gsc-solution-pages-audit.mjs`
  (09-15) — 12 solution pages: sitemap, indexed, impressions.

`scripts/seo/` (all DataForSEO via `dfs.mjs`, a client with disk cache):
- Diagnosis 08-13: `gsc-deep-pull`, `classify-demand`, `classify-winnability`,
  `discover-demand` (bottom-up demand), `score-opportunities`, `research-volumes`,
  `research-serps`, `research-competitors`, `study-aio` (AI Overview study),
  `weekly-tracker` (+ `tracker-history.json`), `audit-content` (posts × GSC revenue score).
- 08-14 → 08-18 steps: `audit-landing-pages`, `step1-service-demand`, `step2a-geo-screen`,
  `step2b-competitor-gap`, `step2c-winnability`, `step3-page-keyword-actions`,
  `step4-buyer-language`, `step5-authority-check`.
- 08-25 → 09-01: `research-bpo-cluster`, `research-cpa-{bofu,cluster,serps}`,
  `expand-cpa-research`, `check-cpa-gsc`, `research-final-4`, `research-image-workflows`,
  `research-integration-cluster`, `audit-legal-tier1`, `gap-analysis-bpa-cluster`,
  `check-agency-split{,2}`, `blog-seo-audit` ("planned 08-13, never built"),
  `onpage-gate` ("planned, never built"), `task1-keyword-recheck`.
- 09-12 → 09-14: `audit-homepage-metadata`, `bulk-keyword-check`, `build-copy-plan`
  (emits the ayautomate copy plan), `research-new-offers{,-serps}`.
- 10-06: `blog-audit-pull`, `blog-audit-rankings`, `forensics-gsc-pull` (running at
  time of writing; writes `<scratchpad>/forensics/`), `_tmp-investmates.mjs`.

`website/scripts/`: `seo-audit.mjs` (title/meta/canonical/robots/h1 per sitemap URL,
local server), `crawl-links.mjs` (BFS broken-link crawl, local), `submit-gsc.js`,
`audit-rendered-metadata.mjs`, plus the title/meta rewrite scripts listed in A1(d).

Data/outputs: `scripts/seo/data/` (CPA/BPO/integration research JSON, Sanity/Baserow
post dumps), `docs/seo/*.md`, `seo/*.md`, `seo/rank-tracking/`, `docs/research/seo/*`.
Baserow **Keyword Backlog table `1022496`** exists (59 rows per `SKILL.md:68`; Agent 1
and the doctrine read from it).

Observation (confidence: high): titles/metas were rewritten in at least four separate
passes (05-25 `gsc-meta-optimizer`, 06-07 `gsc-ctr-rewrite`, 07-25 `tier2-meta-optimization`,
08-06 `patch-titles-metas-investmates-style`, plus 08-09 brand-suffix removal in code).

## A10. Strategy documents and dated timeline

Each "Built?" is checked against live chronexa.io on 2026-10-06.

| Date | Document / event | One-line thesis or decision | Built? (live check) |
|---|---|---|---|
| 05-13 | commit `fa3326d` | 5-agent n8n blog pipeline + Framer bridge | Built; now inactive |
| 05-25 | commit `f879986` | "Full SEO/AEO site optimization — 120+ programmatic changes" | Built |
| 06-06 | commit `2cf8856`, `website/CLAUDE.md` | Framer → Next.js + Sanity; 157 Framer blogs migrated | Live |
| 06-07 | `df6499a`, `874709e`, `e4e425f` | Blog→service money links on every post; n8n cluster consolidated; CTR rewrites | Live (130/169 now hit redirects, A5) |
| 06-11 | calculators | 3 calculators + `/tools` | Live 200 |
| 07-04 | `8ef4108` | Calculator-first CTA on legal/CPA/document posts | Live (62 posts calculator tier) |
| 07-07/10 | `03c3dbf` | 91 off-positioning posts culled, 301'd | Live 308s |
| 07-20 | `docs/research/seo/seo-report-2026-07-20.md` | Impressions 2.5×, CTR halved, brand = 37% of clicks, n8n-docs queries = 30% of impressions | Report |
| 07-21 | `docs/research/seo/dubai-implementation-plan-2026-07-21.md` | Build `/ai-automation-agency-dubai`, UAE cluster | Built (`25f13f1`), then retired 2026-08 → 308 `/ai-automation`; 13 UAE posts still link it |
| 07-25 | `seo/keyword-reality-audit-2026-07-25.md` | "No keyword strategy in the data — keyword sprawl"; 47% of clicks brand | Report |
| 07-25 | `seo/keyword-strategy-2026-07-25.md`, `SKILL.md` v2, `seo/ai-content-method.md` | 60% vertical lifecycle clusters (CPA→RIA→legal) / 20% agency BOFU / 20% UAE; keyword from Backlog only | Partly: 35 CPA + 28 RIA + 23 law posts exist |
| 07-25 | `seo/services-pages-audit-2026-07-25.md` | 46 service pages earned 5 clicks/90d — shrink the estate | Rebuilt 08-18/09-14 (A6) |
| 07-28 | `f39b12d` | CPA pillar `/cpa-tax-document-automation` rewritten | Live 200 (still the blog pillar) |
| 07-30 | `seo/gap-analysis-2026-07-30.md` | Gap analysis + fabricated-stat purge on 10 posts | Rewrites in `seo/rewrites/` |
| 08-06 | `SKILL.md` §7 | Question-form titles (investmates pattern), linter | Applied to new posts |
| 08-07 | taxonomy + hubs | industry/topic/format + 10 hubs | Live 200 (3 non-indexable hubs 404 but linked) |
| 08-09 | `b74dd74` | Article page rebuild, CTA tiers, brand suffix dropped | Live |
| 08-13 | `docs/seo/diagnosis-2026-08-13.md` | Rank "collapse" fake; only 2,108 imp/quarter were page-1 AND buyer-intent | Report |
| 08-14 | `docs/seo/strategy-2026-08-14.md` | Buyers search "outsourcing/back office/data entry"; Tier-1 pages `/data-entry-outsourcing-services`, `/back-office-outsourcing-services`, `/business-process-automation-services`, `/legal-process-outsourcing`, `/ai-agent-development-company` | **None of the 5 exist (all 404).** Instead 4 blog posts 08-29/30: `data-entry-outsourcing-vs-ai-alternative`, `legal-process-outsourcing-vs-ai-document-review`, `process-automation-services-rpa-vs-ai-agents`, `evaluating-process-automation-services-vendor` |
| 08-14 | `docs/seo/focus-2026-08-14.md` | "Not an AI automation agency — a document-operations firm" (later disputed per memory) | n/a |
| 08-17 | `docs/seo/PLAN.md` step 3 | Link acquisition parked (cannot fund) | Not built |
| 08-18/19 | `PLAN.md` steps 4–5 | 9 nav services → 12, v2 design | Live |
| 08-25 | `docs/seo/keyword-targets.md` | Tier 1 outsourcing clusters; Tier 3: CPA/RIA pages are sales pages, "not SEO" | Tier 1 pages not built (above) |
| 08-27/29 | `0a877c8` | CPA content architecture; `/accounting-automation-services` merged into CPA pillar | 308 live |
| 09-01 | `docs/seo/antigravity-execution-plan-2026-09-01.md` | Execution plan for Gemini; document-extraction cluster declared dead | PLAN.md: A2 blocked, A3 not started |
| 09-12 | `docs/seo/competitor-teardown-2026-09-12.md` | Backlinks are not the wall (Semrush: 129 RDs, not 17); targeting is | Report |
| 09-12 | `docs/seo/master-content-plan.md` (+ `ayautomate-copy-queue.md`) | Copy ayautomate.com: 70–80% structure, 20–30% angle | **Built: 32 posts 09-12/09-14**, live 200 |
| 09-14 | `docs/seo/master-content-plan-automaly.md` | Copy automaly.io — thin harvest (3 Tier A) | Not evidently built |
| 09-14 | solution pages rebuild + cull | Bespoke `/cpa-accounting-automation`, `/legal-ai-automation`, `/investment-research-automation`; 5 solutions 301'd | Live; old pillars also still live |
| 09-15 | offer consolidation | `/ai-agent-development`, `/ai-pilot-production` → `/ai-workspace-setup` | 308 live |
| 09-29 | `/n8n-portfolio` | 35 workflow pages, indexable | Live 200 |
| 09-29/10-05 | Shopify landing pages | Paid-only | Live, noindex |
| 10-06 | `docs/seo/blog-performance-report-2026-10-06.md` | Blog shrinking 3 months; 0 traceable calls | Report |

Observation (confidence: high): between 07-20 and 09-14 the stated content target
moved five times (n8n/agency content → regulated vertical lifecycle clusters → outsourcing
vocabulary → copy competitor blogs with generic head terms such as "ai form builder"/
"ai chatbot for ecommerce" → Shopify paid landing pages), and the 09-12 batch targets
terms the 07-25 doctrine lists as "Dead, do not write" (`SKILL.md:78`: generic head
terms, SaaS/RevOps).

## A11. Prompts/instructions used to generate SEO content

- **n8n Agent 1 brief prompt** (`blog-agent-1-gsc-strategist.json`, node "Claude Brief
  Generation"): persona = "enterprise AI firm … for regulated industries: PE/M&A,
  RIAs, law, CPA, financial services"; "n8n is an implementation detail"; title ≤65
  chars; output TITLE/KEYWORD/SECONDARY/PERSONA/THESIS.
- **n8n Agent 3 copywriter prompt** (`blog-agent-3-copywriter.json`, "Call Claude -
  Write Blog Post"): open with buyer's problem; 3–5 H2s = cost of status quo (ROI
  math) → how a custom AI system solves it → security/compliance; FAQ of 3–4 H3s;
  CTA "free audit"; 1–2 inline links to one of 4 vertical pages; SEO title 60–65 chars.
- **`SKILL.md` v2 (07-25, with 08-14 conflict banner l.8-41)**: buyer = partner/COO,
  never developers; AI alongside not replacing; one firm size; keyword from Backlog;
  brief (12 fields); gap analysis; founder voice; "What matters most" bullets; FAQ;
  key takeaways "what AI engines lift verbatim"; 1,800–2,500 words; question-form
  titles; meta ≤155; calculator-first CTA; linter (no jargon, no em dashes, question
  title, FAQ/takeaways present, attribution warnings).
- **`seo/ai-content-method.md`**: "no post is written without a filled Content Brief,
  and every keyword … comes from the locked map".
- **`docs/seo/master-content-plan.md` (09-12)**: copy competitor post shape, section
  order, keyword and format; non-negotiables = no invented numbers/clients/prices.
- References: `content-gap-analysis-process.md` (WebSearch the SERP, write a gap
  sentence), `ai-authenticity-checklist.md` (humanizer passes), `founder-voices/*`.
- Observation (confidence: med): the instructions optimise for (1) a keyword chosen from
  a list, (2) AI-answer-engine liftability (takeaways, FAQ), (3) buyer voice and
  anti-fabrication, (4) SERP CTR via title formulas. The 08-14 "pull the SERP before
  adopting a keyword" rule lives only in the SKILL banner, not in the linter.

---

# PART B — Phase 10: technical SEO (beyond what is already established)

## B1. Non-blog pages (164 URLs fetched live)

- Every sitemap non-post URL returns 200 with self-canonical, `index, follow`, exactly
  one H1, except `/blog/page/6` (307). No `x-robots-tag` headers seen.
- Schema present: Service + FAQPage + BreadcrumbList on service/integration pages;
  WebApplication on calculators; CollectionPage/ItemList on hubs, `/solutions`,
  `/case-studies`, `/tools`; Article on case studies; CreativeWork on portfolio pages;
  AboutPage, ContactPage. None on `/document-pipeline`, `/privacy`, `/n8n-portfolio`.
- Word counts (main content, approx.): service/solution pages 647–2,971; integration
  pages 743–1,363; case studies 436–1,093; hubs 922–3,215.
- Host normalisation fine: `http://` and `www.` → 308 to `https://chronexa.io`; trailing
  slash → 308 to no-slash. `/Blog/<slug>` (capital B) returns 200 (canonical is lowercase).

## B2. Redirects (`website/next.config.ts:31-237`)

- 143 rules (`permanent: true` ×142 → served as **308**, `permanent: false` ×1 → 307),
  141 literal + 2 pattern (`/portfolio/:slug`, `/articles/:slug`). All 141 literal
  sources resolve to a final 200.
- **13 two-hop chains:** `/services/sales-operations` → `/sales-revenue-automation` →
  `/ai-sales-outreach-engine`; `/services/custom-workflows` and 9 old n8n blog URLs →
  `/n8n-automation-services` → `/ai-automation`;
  `/blog/ai-powered-invoice-processing-services-for-mid-market-companies` →
  `/blog/ai-invoice-processing-mid-market-guide` → `/blog`;
  `/blog/custom-mcp-servers-claude-private-data` → `/secure-ai-deployment` →
  `/legal-ai-automation`.
- **Destinations unrelated to source intent:** 37 sources end at `/blog` (index);
  27 end at `/ai-engines/sales-engine` (e.g. `how-to-automate-soc2-evidence-collection`,
  `gemini-nano-banana-ai-image-gen-automation`, `invoice-reconciliation-automation-saas-founders`);
  13 end at `/blog/how-to-choose-ai-automation-agency-regulated-industries` (e.g.
  `top-ai-automation-agencies-usa-2025`, `-uk-2025`, `-new-york-2025`,
  `best-n8n-agencies-united-states-2025`); `custom-mcp-servers-claude-private-data` ends
  on the legal page.
  - Observation (confidence: med): Google commonly treats redirects to an index or to an
    unrelated page as soft-404s; the evidence log shows 67 redirected blog URLs still
    earning impressions, e.g. `top-ai-automation-agencies-usa-2025` (930 imp, 6 clicks).

## B3. Duplicate / near-duplicate titles and descriptions; thin pages

Across 315 indexable URLs (146 non-blog + 169 posts):
- Exact duplicate title: `/blog/custody-statement-reconciliation-automation-ops-cost`
  and `/blog/custody-statement-reconciliation-automation-ria` both "Custody Statement
  Reconciliation Automation for RIAs".
- Near-duplicates: `/blog/ai-readiness-assessment` vs
  `/blog/ai-readiness-assessment-score-your-organisation`; `/cpa-tax-document-automation`
  vs `/blog/industries/cpa-firms` (same first 35 chars).
- **Title/body mismatch:** `/blog/blog-ai-sdr-engine-automation-case-study` (published
  2026-01-30) has title/metaTitle "Document Automation Tools for Regulated Industries
  (2026)" while its body opens "AI SDR engines automate sales outreach…"; it duplicates
  the topic of `/blog/document-automation-tools-for-regulated-industries`.
- Duplicate description: `/blog` and `/blog/page/2..8` share one description (titles
  differ by page number) — normal for pagination.
- Thin indexable pages (<300 words): `/contact` (82), `/tools` (284). No thin posts in
  the 21-post sample (1,200–3,086 words).

## B4. Rendering

- Posts are statically generated + ISR (`revalidate = 3600`, `generateStaticParams`).
  Three posts (`top-ai-automation-agencies-b2b-saas-2026`,
  `tax-workpaper-preparation-automation`, `firm360-api-access-ai-vendors-cpa-firms`)
  fetched with a Googlebot UA: phrases sampled at 25%, 60% and 95% of the Sanity body
  are all present in the raw HTML (`x-vercel-cache: HIT`). Body text does not depend on JS.
- `/blog` server HTML links 13 posts; pages 2–8 link 24/24/24/24/(6)/24/12.

## B5. Pagination and taxonomy proliferation

- `/blog` + `/blog/page/2..8` (24 per page). **`/blog/page/6` redirects (307) to
  `/blog/page/5`**, but every pager links it and the sitemap lists it. Result
  (`pag.mjs`): **24 posts are not linked from any reachable pagination page** (all 24
  are reachable through a hub).
- Filters (`?industry=` etc.) are client-side; canonical stays `/blog`.
- 10 hub pages (4 industry + 6 topic) + 7 pagination pages for 169 posts; 4 industry
  buckets have no URL. Format and region are filters only. No tag pages.

## B6. Core Web Vitals / performance

- **PageSpeed Insights API: blocked.** Keyless calls returned 429 "Quota exceeded …
  Queries per day" for all 6 URLs; the only Google key in `.env` (`GEMINI_API_KEY`)
  returned 400 "API key expired". No CrUX field data obtained.
- **Substitute: DataForSEO On-Page `instant_pages`** (lab, single load, 412×915 mobile
  UA, browser rendering):

| URL | LCP ms | TTI ms | CLS | TTFB ms | On-page score | Render-blocking scripts |
|---|---|---|---|---|---|---|
| `/` | 932 | 165 | 0.002 | 13 | 95.2 | 8 |
| `/blog` | 2,452 | 2,156 | 0 | 101 | 84.5 (flags `high_loading_time`) | 11 |
| `/blog/top-ai-automation-agencies-b2b-saas-2026` | 540 | 321 | 0 | 13 | 95.2 | 11 |
| `/blog/tax-workpaper-preparation-automation` | 860 | 416 | 0 | 13 | 95.2 | 11 |
| `/blog/firm360-api-access-ai-vendors-cpa-firms` | 1,036 | 955 | 0 | 12 | 95.2 | 11 |
| `/cpa-accounting-automation` | 1,372 | 991 | 0.004 | 101 | 95.2 | 9 |

  41 scripts per page on blog/home; flagged checks common to all: render-blocking
  resources, duplicate meta tag (two `theme-color` tags, light/dark — benign), images
  without alt/title. These are lab numbers from a datacentre, not field data.

## B7. Broken internal links (sample)

Sources: homepage, `/blog`, all hubs and pagination, all non-blog pages (150 with
HTML) + 21 posts. 347 unique internal targets checked: **315 × 200, 28 × 308,
1 × 307, 3 × 404.**
- 404: `/case-studies/ai-automation-tax-workflow-cpa-case-study` (linked from 7 pages
  incl. `/`, `/cpa-tax-document-automation`, `/tax-software-ai-integration`,
  `/k1-tax-form-ocr-extraction`); `/case-studies/how-leading-law-firm-automated-regulatory-intelligence`
  (6 pages incl. `/`, `/legal-due-diligence-automation`); source = hard-coded slugs in
  `website/src/components/WorkShipped.tsx`, `Evidence.tsx`, `website/src/lib/services-content.ts`.
  `/blog/industries/sales-revenue` (from posts; established).
- 308 sitewide: the 4 nav "by function" links (every page). 308 elsewhere:
  `/n8n-automation-services` (17 pages incl. service pages and the cross-industry hub),
  `/ai-automation-agency-dubai`, `/system-data-integration`, `/us-ai-automation-agency`,
  `/secure-ai-deployment`, `/rag-knowledge-engines`, `/ai-readiness-assessment` (from
  `/use-cases`), `/ai-agent-development`, and 12 culled-post URLs still linked from post
  bodies and case studies (e.g. `/blog/build-vs-buy-ai-automation-costs`,
  `/blog/blog-best-n8n-consultants-by-region`, `/blog/what-to-do-when-your-hoa-reserve-study-is-outdated`).
- 307: `/blog/page/6` (from every pager).

## B8. Anything that could suppress indexing

- No indexable page carries `noindex`; no canonical points elsewhere (all checked pages
  self-canonical); robots.txt blocks only `/api/`, `/studio`, `/internal`.
- Sitemap contains one redirected URL (`/blog/page/6`) and no 404s.
- Sitemap advertises 36 portfolio + 33 case-study + 18 integration pages alongside 169
  posts; `lastmod` is identical on all non-post URLs and ignores post `updatedAt`.
- Google's own index status per URL is not in this file: `scripts/seo/forensics-gsc-pull.mjs`
  (URL Inspection of all 314 sitemap URLs) was still running when this was written;
  output will be `<scratchpad>/forensics/url-inspection.json`.

---

# PART C — Is technical SEO plausibly a primary cause of weak organic results?

**Evidence for**
- 130/169 posts send their "related service" links through 308 redirects; the sitewide
  nav sends 4 links per page through 308s; 13 redirect chains exist (B2, A5).
- 24 posts are not reachable via `/blog` pagination (page-6 redirect), and related-posts
  only ever draws from the 60 newest posts — consistent with the established 67 posts
  with no inbound post link (A5, B5).
- 3 hub URLs and 2 case-study URLs 404 while being linked from posts, the homepage and
  service pages (B7).
- 37 culled posts 308 to `/blog` and 27 to `/ai-engines/sales-engine` — likely
  soft-404 handling for URLs that still earn impressions (B2).
- Multiple indexable pages per vertical with near-identical titles (A6, B3); one post
  whose title contradicts its body (B3); 8 double-brand titles and many overlong
  titles/descriptions on non-blog pages (A4).
- Zero non-blog pages link to any blog post, so posts receive internal authority only
  from hubs, pagination and other posts (A5).

**Evidence against**
- All 169 posts and all 145 other sitemap URLs (bar one pagination page) return 200,
  self-canonical, one H1, valid schema, no noindex, in the sitemap (B1, evidence log).
- Article text is fully server-rendered; lab load times are fast (LCP 0.5–1.4 s on
  posts and money pages, CLS ≈ 0); host/slash normalisation is clean (B1, B4, B6).
- The defects found are link-hygiene issues (redirect hops, a handful of 404s, a weak
  related-posts window), not blocking ones; every post is still reachable through a hub.
- The evidence log already shows the visible demand is mostly non-buyer (n8n docs,
  LLM-prompt queries, agency owners) and that only ~2,108 impressions/quarter were
  page-1 and buyer-intent (diagnosis 08-13) — limits that exist independently of
  technical state.
- Strategy and targeting changed roughly five times in eight weeks (A10), and the
  largest recent batch (32 posts, 09-12/14) targets generic head terms; a technically
  clean site cannot convert traffic for terms whose searchers are not buyers.
- Not yet available: Google's own indexing verdicts (URL Inspection pending) and
  real-user CWV (PSI quota exhausted).
