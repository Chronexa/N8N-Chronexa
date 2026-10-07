# SEO forensics — working evidence log (started 2026-10-06)

Purpose: hold every load-bearing fact found during the investigation, with its source, so
the final report (`REPORT.md`) can be built from evidence rather than memory. Facts only
here; interpretation goes in the report. Each entry: **fact** · source · date pulled.

Investigation files in this folder:
- `00-evidence-log.md` — this file (owner: lead investigator)
- `01-system-and-technical.md` — repo/system inventory + technical SEO (subagent)
- `06-content-quality-vs-serp.md` — article-vs-competitor comparison (subagent)
- `08-positioning-and-journeys.md` — first-visit comprehension + journey tracing (subagent)
- `09-investmates-control.md` — Investmates comparison (subagent)
- `03-gsc-forensics.md`, `04-market-demand.md`, `05-keyword-reconstruction.md` — lead
- `_sample-articles.md` — sample article list with live GSC top queries

## Sources and access (checked 2026-10-06)

- GSC: `sc-domain:chronexa.io` (owner) via OAuth in root `.env`. **No investmates.io property** in this account — Investmates comparison is public data + DataForSEO only.
- DataForSEO: balance **$39.19** (lifetime spend $51). Scope rule in CLAUDE.md: SERP + Labs + On-Page only.
- Amplitude project `781983` "Chronexa Website": events incl. `blog_post_view`, `blog_sticky_cta_shown`, `book_cta_click`, `booking_confirmed`, `lead_form_submit`, calculator events.
- Calendly user `ankit-chronexa`: invitee `tracking.utm_content` = page path where booking started (present from ~2026-09-17; absent on 09-02/09-03 bookings).
- Baserow Website Leads table `1015183` via JWT (`POST /api/user/token-auth/` with BASEROW_EMAIL/PASSWORD loaded through node dotenv — shell `source .env` silently fails).
- Sanity project `up57bpxm` dataset `production`: 169 published posts.

## Baseline facts carried in from the 2026-10-06 performance audit
(source: `docs/seo/blog-performance-report-2026-10-06.md`, raw data in session scratchpad)

- Blog GSC, 90d to 2026-10-04: 110 clicks, 54,109 impressions, CTR 0.20%. Site-wide 90d to 10-06: 219 clicks / 80,820 imp.
- Monthly blog clicks: Jan 22, Feb 12, Mar 15, Apr 19, May 14, Jun 42, Jul 58, Aug 36, Sep 24. Monthly blog impressions peaked Mar (38,197).
- 147 of 169 live posts had zero clicks in 90d; top post = 26% of live-post clicks; top 5 = 66%; top 10 = 82%.
- Query-level: only 10 of 110 blog clicks have a visible query (GSC anonymisation). 22% of visible query impressions are machine-written prompts (293 queries matching "list only real… no explanations", >85 chars, etc.).
- Weekly tracker (4w to 10-03 vs prior 4w, site-wide): non-brand clicks 2→1; enquiry-page clicks 5→1; buyer page-1 imps 1,532→2,856; brand clicks 20→13; fixed-cohort rank 41.95→41.87 (756 queries).
- Content mix (Sanity taxonomy): cross-industry 69 posts / 70 clicks; CPA 35 / 8; RIA 28 / 4; law 23 / 3; sales-revenue 8 / 3; PE 3 / 0; insurance 3 / 0.
- Title pattern: "top/best" titles 7 posts / 46 clicks; question titles 59 posts / 4 clicks; "comparison" format 23 posts / 45 clicks.
- 09-12/09-14 batch: 32 posts, 0 clicks, 2,920 imp, imp-weighted pos 35.8 at ~day 24. 2 of 32 target keywords in DataForSEO top-100. Of 30 target SERPs: AI Overview on 30/30; Reddit top-5 on 15/30.
- DataForSEO ranked_keywords for chronexa.io (US): **35 keywords total**, 14 on /blog/, est. ~27 visits/mo; pos 1–3: 0; pos 4–10: 2.
- Conversion: Calendly 13 bookings since 2026-07-01; 5 tracked since 09-17 = 3× /shopify-store-build, 1× /law-firm-billing-leakage-calculator, 1× / (hero); **0 from /blog/**. Amplitude 90d: ~4,285 blog_post_view (≈2,176 in one week of 07-06, likely anomaly), ~977 sticky CTA shown, ~8 of ~120 book_cta_click on /blog/ paths (102 book_cta_click events lack `pathname`). Baserow leads: 74 rows, 0 blog-sourced; 59 Shopify landing.
- Technical crawl: 169/169 posts 200, canonical correct, 1 H1, BlogPosting + Breadcrumb schema all, FAQPage 149/169, none noindex, all in sitemap, avg 424ms HTML fetch. 3 hub URLs 404 (`/blog/industries/{sales-revenue,private-equity-vc,insurance-healthcare}`) and posts link to them. 67 posts have no inbound link from another post (reachable via hubs). 99 non-live blog URLs still earn impressions (67 redirect, 31 hub pages).

## New facts — forensic investigation

### Strategy history (from repo docs)
- 2026-07-25 v2 doctrine (`.claude/skills/blog-seo-strategy/SKILL.md`): 60% vertical lifecycle clusters (CPA first, then RIA, then legal), 20% "winnable-agency BOFU", 20% UAE/G20; keyword chosen from Baserow Keyword Backlog table `1022496`.
- 2026-08-13 diagnosis (`docs/seo/diagnosis-2026-08-13.md`): only 2,108 impressions/quarter were simultaneously page-1 and buyer-intent; 55% of non-brand impressions at pos >20; 26% builder (n8n) queries; 15/15 commercial SERPs had AIO; Chronexa cited 0.
- 2026-08-14 v3 strategy (`docs/seo/strategy-2026-08-14.md`): verticals CPA/RIA "Sales + authority, not SEO"; Tier-1 build order = `/data-entry-outsourcing-services`, `/back-office-outsourcing-services`, `/business-process-automation-services`, `/legal-process-outsourcing`, `/ai-agent-development-company`, ranked listicles.
- **2026-10-06 live check: none of those five Tier-1 pages exists — all five return 404.** `/ai-agent-development` and `/us-ai-automation-agency` return 308 redirects; `/business-process-automation-consulting` returns 200.
- 2026-09-12 (`project_seo_thesis_correction_2026_09_12`, `docs/seo/master-content-plan.md`): pivot to copying ayautomate.com blog (70–80% structure, 20–30% angle); 32 posts shipped 09-12/09-14.

### Query reality on our best pages (GSC 90d, page×query)
- Best post `top-ai-automation-agencies-b2b-saas-2026` top visible queries are LLM-style prompts: "who helps b2b saas platforms integrate generative ai into their core workflows?" (66 imp, pos 3.8), "which companies combine outsourcing with ai automation?" (59 imp). The human head term "top ai automation agencies" = 44 imp at pos 26.5.
- `blog-best-ai-lead-scoring-platforms-b2b-saas`: top 4 queries are all "what are the top 10 brands in the 'saas' industry associated with …? list only real… no explanations." (1,817 + 271 + 224 + 213 imp). 5,854 imp, 1 click.
- `ai-automation-agency-pricing-what-you-get`: top query "how do agencies productize ai marketing operations automation packages and price them in usd?" (890 imp) — audience = agency owners, not buyers.
- `palantir-alternatives-mid-market-us-companies`: top query "best palantir alternatives for government agencies" (391 imp, pos 6.9, 0 cl).
- `n8n-ai-agents-features-2026-complete-guide`: "n8n ai agents (official) documentation 2026" family, pos 5.8–8.4, 0 clicks.
- `tax-workpaper-preparation-automation`: "automate tax workpaper preparation" 273 imp, pos 10.6, 0 clicks — a real buyer-shaped query.

### GSC forensics, whole site (scripts/seo/forensics-gsc-pull.mjs; analysis in scratchpad gsc-forensics.json) — pulled 2026-10-06
Windows: q0 = 2026-07-06..10-04, q1 = 04-06..07-05, q2 = 01-05..04-05, q3 = 2025-10-06..2026-01-04. Query classes by rule (brand / machine = ≥13 words or LLM-prompt patterns / builder / career / buyer_hire / buyer_problem / adjacent_info / off_topic) — rules in scratchpad `classify.mjs` + `gsc-forensics.mjs`.
- Site monthly clicks: Oct-25 8, Nov 12, Dec 14, Jan 44, Feb 35, Mar 51, Apr 63, May 67, **Jun 111, Jul 100**, Aug 84, Sep 54. Monthly impressions 18k–39k since Jan. Impression-weighted avg position 8–9 (Jan–Apr) → 22–26 (Jul–Oct) as new pages entered deep.
- q0 page totals: 366 pages, 84,156 imp, 225 clicks. Visible-query share: 44,513 imp / 72 clicks.
- **q0 visible clicks by class: brand 59 of 72.** Non-brand visible clicks = 13 in a quarter.
- q0 buyer_hire: 778 queries, 12,273 imp, 7 clicks; buyer_problem: 721 queries, 10,429 imp, 1 click. **Buyer impressions on page 1 (pos ≤10): 1,173 imp across 248 queries → 2 clicks.** 87% of buyer impressions sit at pos >20 (buyer_hire 10,926 of 12,273; buyer_problem 8,913 of 10,429).
- q0 machine-prompt queries: 534 queries, 6,660 imp, 0 clicks, 5,066 of them on page 1. Builder (n8n etc.): 4,021 imp, 1 click.
- Buyer-query geography q0: USA 14,345 imp / **0 clicks**; UK 2,134 / 0; UAE 1,976 / 1; India 401 / 1. All-query geography: USA 49,080 imp / 50 clicks; India 2,125 / 56 clicks (mostly brand).
- Brand clicks: q1 130 → q0 59 ("chronexa" 58). Homepage clicks 155 → 80. Brand demand halved quarter-on-quarter.
- q0 by page type: blog_post 247 pages / 51,830 imp / 108 clk; service_solution 71 / 24,354 / 24; calculator_tool 4 / 2,426 / 8; home 2 / 1,515 / 80; case_study 25 / 717 / 1; portfolio 0 imp.
- Top buyer queries we appear for (q0, all deep): marketing automation agency 786 imp pos 35; automate tax workpaper preparation 691 pos 36.7; business process automation consulting 662 pos 22.3 (1 click); revops data automation 632 pos 42.7; generative ai consulting services 610 pos 26.5; ai automation agency 562 pos 52.8; process automation consulting 342 pos 23.8; business process automation consultant 316 pos 27.8; ai automation consultant 227 pos 34; n8n automation agency 181 pos 29.4.
- Cannibalisation q0 (human non-brand queries with ≥2 URLs each ≥5 imp): 52 queries, 45 of them buyer-class, 4,530 imp. Examples: "automate tax workpaper preparation" split across /cpa-tax-document-automation (pos 66), /blog/tax-workpaper-preparation-automation (10.6), /blog/industries/cpa-firms (50), /ai-engines/cpa-tax-engine (41.6). "ai automation agency" split across 5 URLs at pos 24–68. "cpa automation" across 4 URLs.
- Pages losing most clicks q1→q0: homepage 155→80 (brand), n8n-ai-agent-node post 8→2 (21,556→1,294 imp), fintech-n8n post 14→11.

### Conversion attribution beyond Calendly (2026-10-06)
- Cal.com: Gmail (team@chronexa.io) holds "new event scheduled" confirmations from hello@cal.com since May: 05-16 Kalyan Naluvala; 06-16 (self/test); 06-22 Marianela A.; 07-07 vasu…; 08-06 Prince Kumar; 08-14 Surender Singh (indialoans.net); 08-14 "Abhishek enterprises" (ammolitecables.com, note "Electrical supply business"); 08-15 (one more); 08-16 Vidhya (sripadainstitute.com, "Training center...wants to automate evrything"); 09-29 Sweder Visser (LOKI Intelligence, Amsterdam — vendor pitching pentests). No UTM/source data in Cal.com emails. Profiles = Indian SMBs (period coincides with India Meta lead campaign Aug 2026) + one vendor; none identifiable as a US blog reader.
- 118 blog posts carry cal.com links in body (positioning subagent); in-body link clicks are not tracked in Amplitude.

### Subagent evidence files (summaries; details in each file)
- `01-system-and-technical.md`: n8n 5-agent pipeline inactive (Agent 1 picked GSC queries by impressions only, pos 11–30, ≥50 imp — would select machine prompts). Current: Claude Code → seo/*.md → publish-blog-batch.mjs → /api/blog-publish → Sanity. Strategy target changed ~5 times 07-20..09-14; 08-14 Tier-1 outsourcing pages never built (became 4 blog posts 08-29/30). 130 posts have ≥1 related-service link through a 308; no service page links to any blog post; "Keep reading" draws only from 60 newest posts; /blog/page/6 307→5 but in sitemap; 143 redirect rules, 13 two-hop chains, 37 culled URLs → /blog, 27 → /ai-engines/sales-engine; 3 internal 404s (2 hard-coded case-study links). Body fully SSR; lab LCP 0.5–1.4s posts; PSI field data unavailable (quota).
- `08-positioning-and-journeys.md`: no blog post's first screen says what Chronexa sells/for whom; homepage H1 "Automate repetitive work with AI." with no audience; /document-pipeline ($3,500 fixed, 14 days) is the only priced offer and is not in nav/footer/homepage/sitemap; 11 solutions + 12 use cases + 6 engines + 42 indexable service pages; contradictory prices ($3,500 / $8K–$80K / $5K–$50K) and timelines (14 days / 6–20 weeks); homepage CPA "84%/3×" and law "90%" case-study links 404 under "Every claim is checkable"; 0 posts name a client; 5 posts link a case study; 107 posts link a service page in-body; 204 of 775 service links (26%) hit redirects; /blog/ai-sales-agent says "we do not build [outbound] for clients" while its Read-next redirects to /ai-sales-outreach-engine; Palantir post's top query is "for government agencies" but Chronexa has no government offer; location shown as "IXC, India"; 33 posts call Ankit "Founder & CEO" vs byline "Co-founder & CTO".
- `09-investmates-control.md`: investmates.io est. 23,100 US visits/mo (1,706 kw) + 43,800 India (728 kw); US traffic 71.8% form/procedure pages (one passport-renewal page = 68%); India 80.7% definitions; service/hire queries ~0–1.1% (almost all brand); not top-10 for "nri financial advisor usa". Median KD of their top kw 0–4 vs Chronexa targets 14; median CPC $0 vs $31.59. Their SERPs = gov portals/banks/small CA firms, Reddit 0/8; Chronexa's = SaaS vendors + Reddit 15/30 + LinkedIn 13/30. Investmates cited in AIO on 5 queries. Every article: 6-service nav, "built for NRIs" line, updated date, key-facts box, CA byline, "Book a free 15-minute call", tax-article popup offer. Founder's "searched-read-booked" claim unverifiable (no GSC/CRM access).
