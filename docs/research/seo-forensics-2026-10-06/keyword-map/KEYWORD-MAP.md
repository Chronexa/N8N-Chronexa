# Keyword-to-page map and library rebuild (2026-10-08)

Follows the forensic study (`REPORT.md`) and the structural cleanup. The question this answers: **which searches should each page own, and what did we change because of it.** Built from the existing forensic data (10,620 US keywords grouped into 431 families, 16 months of Search Console, 72 buyer SERPs), plus 113 new live SERP checks and one volume pull of 60 comparison/cost phrases. New DataForSEO spend: about $0.19.

Files in this folder: `scored-families.csv` (all 431 families, scored), `page-decisions.csv` (every indexed page), `baseline-2026-10-08.csv` (the numbers to beat), `rewrites/` (the five rewritten posts, as published).

## 1. What the data says

- **The money is in "hire" searches, not blog topics.** Families where someone is looking to hire a consultant, agency or integrator carry CPCs of $19 to $196 and are mostly low difficulty (KD 1 to 24). The blog has never been the right page type for them. Service pages are.
- **The biggest unclaimed family is "AI consultant".** About 18,600 US searches a month across 13 phrasings (`ai consultant` 8,100, `ai consulting firm` 2,900, `ai consultant services` 2,400 at $106 CPC), KD 8 to 24. We had no page for it. Two blog posts (`ai-automation-consultant`, `generative-ai-consulting-services`) were picking up about 1,400 impressions at position 35 to 36 between them.
- **We already show up for the agency family, far too low.** The `ai automation agency` / services / company family is about 11,000 searches a month. We earned 4,414 impressions over 90 days at an average position of 41 and 4 clicks, spread over five different URLs. One owner page was missing, so none of them rank.
- **Outsourcing vocabulary is a real second market.** `legal process outsourcing` is 6,600 a month at KD 6. `accounting outsourcing` / `bookkeeping outsourcing` together are about 6,400 at KD 4 to 8 and $58 to $108 CPC. `data entry outsourcing` is 480 at KD 0. We have posts at position 19 and 52 for this vocabulary, never built around it.
- **Comparison and tool-cost searches are modest but cheap to win.** `n8n price` and its variants add up to about 6,900 a month at KD 8 to 11. `n8n vs zapier`, `make vs zapier`, `zapier alternatives` and similar add up to about 3,100. Chronexa has real n8n expertise, so these are honest to answer.
- **The "best AI automation agencies" listicle format has almost no search of its own** (`best ai automation agencies` 20 a month, `top ai automation agencies` 20). People search `ai automation agencies` (4,400, shared with the singular). The post survives as a comparison guide, not as a ranking.
- **Nothing in the vertical series has demand.** Legal workflow automation is 90 a month. Workpaper automation has no measured volume. They stay as sales material, not search targets.

## 2. How families are scored

`score = monthly searches × intent weight × ranking feasibility × ICP relevance × CPC factor`

- **Intent weight:** hire 1.0, hire via outsourcing vocabulary 0.7, cost 0.85, compare 0.8, tool integration 0.45, problem/job 0.55, definition or head term 0.2, informational 0.12.
- **Feasibility:** from the live page-1 results. Starts at 0.2, adds for each independent site in the top five, subtracts for big brands and AI Overviews and for keyword difficulty. Where no SERP was pulled, difficulty alone is used (flagged `kd-only` in the CSV).
- **Relevance:** the 2 or 3 rating from the forensic study.
- **CPC factor:** 0.6 to 1.0, a proxy for what a visit is worth.

Scores are for ranking opportunities against each other, not forecasts.

## 3. The master map: top 45 families and who owns them

| Rank | Family (US monthly searches) | CPC | KD | Intent | Indep. in top 5 | Score | Owner |
|---|---|---|---|---|---|---|---|
| 1 | ai consultant (8,100) | $52 | 14 | hire | 2 | 3578 | /ai-consultant |
| 2 | chatbot customer service (4,400) | $89 | 41 | hire | 4 | 2339 | Deferred: page 1 is chatbot software (Botpress, Eesel, Crisp); the searcher wants a product |
| 3 | ai chatbot service (4,400) | $27 | 71 | hire | 4 | 1864 | Deferred: KD 71, page 1 is chatbot software (Lindy, Eesel, Botpress) |
| 4 | ai consulting firm (2,900) | $53 | 11 | hire | 4 | 1803 | /ai-consultant |
| 5 | ai automation agency (4,400) | $19 | 19 | hire | 2 | 1718 | /ai-automation-agency |
| 6 | automation company (3,600) | $11 | 37 | hire | 4 | 1672 | /ai-automation-agency |
| 7 | accounting outsourcing service (2,900) | $58 | 5 | hire_outsourcing | 5 | 1519 | Deferred: DECISION NEEDED: searchers want to hire outsourced accountants (see open decisions) |
| 8 | ai consultant services (2,400) | $106 | 8 | hire | 3 | 1070 | /ai-consultant |
| 9 | legal process outsourcing (6,600) | $27 | 6 | hire_outsourcing | 2 | 831 | /blog/legal-process-outsourcing-vs-ai-document-review (rewritten) |
| 10 | automation services (1,000) | $44 | 19 | hire | 5 | 784 | /ai-automation-agency |
| 11 | bookkeeping outsourcing (1,600) | $108 | 4 | hire_outsourcing | 4 | 759 | Deferred: DECISION NEEDED (same cluster) |
| 12 | ai integration services (720) | $46 | 1 | hire | 4 | 462 | /ai-integration-services |
| 13 | ai automation services (720) | $39 | 3 | hire | 4 | 451 | /ai-automation-agency |
| 14 | accounting outsourcing (1,000) | $80 | 8 | hire_outsourcing | 4 | 437 | Deferred: DECISION NEEDED (same cluster) |
| 15 | ai agent development company (720) | $34 | 9 | hire | 4 | 433 | /ai-agent-development |
| 16 | n8n price (4,400) | $8 | 8 | tool_pricing | 2 | 402 | /blog/self-hosting-n8n-… (rewritten) |
| 17 | document processing (1,600) | $24 | 12 | problem_job | 5 | 393 | /document-processing-automation |
| 18 | ai chatbot services (4,400) | $27 | 74 | hire | 2 | 391 | Deferred: KD 74, software vendors and big brands |
| 19 | ai consultant agency (1,000) | $36 | 24 | hire | 3 | 364 | /ai-consultant |
| 20 | ai consultant business (720) | $41 | 11 | hire | 3 | 344 | /ai-consultant |
| 21 | ai consultant for small business (590) | $19 | 0 | hire | 4 | 334 | /ai-consultant |
| 22 | accounting outsourcing firm (880) | $74 | 0 | hire_outsourcing | 2 | 324 | Deferred: DECISION NEEDED (same cluster) |
| 23 | ai consultant near me (720) | $25 | 0 | hire | 2 | 324 | /ai-consultant |
| 24 | automation agency (480) | $10 | 23 | hire | 5 | 323 | /ai-automation-agency |
| 25 | data extraction transformation and loading (1,300) | $31 | 16 | problem_job | 4 | 276 | /document-processing-automation |
| 26 | ai implementation consultant (590) | $48 | 9 | hire | 3 | 273 | /ai-consultant |
| 27 | n8n automation (1,600) | $9 | 32 | tool_integration | 5 | 269 | /ai-automation-agency (n8n section; no dedicated page yet) |
| 28 | ai automation (9,900) | $23 | 26 | head_generic | 1 | 256 | Deferred: Head term, AI Overview, 1 independent in top 5; earns visibility from the agency page, not its own page |
| 29 | ai automation consultant (590) | $49 | 0 | hire | 2 | 244 | /ai-consultant |
| 30 | robotic process automation (6,600) | $22 | 43 | head_generic | 3 | 239 | Deferred: Definition intent, big vendors |
| 31 | system integration services (390) | $26 | 7 | hire | 4 | 220 | /ai-integration-services |
| 32 | data entry outsourcing (480) | $55 | 0 | hire_outsourcing | 4 | 210 | /blog/data-entry-outsourcing-vs-ai-alternative (rewritten) |
| 33 | api integration services (320) | $196 | 22 | hire | 4 | 200 | /ai-integration-services |
| 34 | workflow automation softwares (2,400) | $62 | 38 | head_generic | 4 | 177 | - |
| 35 | custom ai development company (390) | $77 | 31 | hire | 3 | 174 | /ai-agent-development |
| 36 | automate rpa (6,600) | $22 | 41 | tool_integration | 2 | 173 | Deferred: RPA vendors own it (2 big brands) |
| 37 | zapier agency (880) | $14 | 32 | hire | 2 | 172 | Deferred: Zapier-run directory and big brands dominate |
| 38 | hubspot consultant (880) | $88 | 10 | hire | 1 | 165 | Deferred: DECISION NEEDED: strong $88 CPC but HubSpot ecosystem directory leads; needs a dedicated HubSpot page |
| 39 | zapier cost (8,100) | $5 | 25 | tool_pricing | 0 | 162 | Deferred: 0 independents in top 5; we do not sell Zapier |
| 40 | ai agent for customer service (720) | $91 | 8 | hire | 2 | 161 | Deferred: 2 big brands in top 5, AI Overview; /customer-support-automation stays as is |
| 41 | accounting automation software (720) | $84 | 15 | software_buyer | 4 | 145 | - |
| 42 | generative ai consultant (320) | $84 | 7 | hire | 3 | 142 | /ai-consultant |
| 43 | business process automation softwares (1,000) | $0 | 25 | problem_job | 4 | 135 | - |
| 44 | accounts payable automation (1,600) | $279 | 27 | problem_job | 2 | 128 | Deferred: Software vendors own it; we dropped the AP offer in Sept |
| 45 | automation agency ai (480) | $0 | 37 | hire | 3 | 126 | /ai-automation-agency |

Every owned family has one owner URL. Phrases that fall inside a family (plural, word order) belong to the same owner.

## 4. Owner pages by intent

**Transactional / hire (service pages):** `/ai-consultant` (new), `/ai-automation-agency`, `/ai-strategy-consulting` (AI strategy consultant 1,760 and AI readiness assessment 720, KD 3 to 13), `/ai-integration-services`, `/ai-agent-development`, `/business-process-automation-consulting`.

**Commercial investigation (posts):** the agency comparison guide, the n8n/Zapier/Make comparison, the legal process outsourcing guide, the data entry outsourcing guide. `/ai-automation-cost` owns cost.

**Tool and implementation:** the n8n pricing guide. n8n agency and consultant searches (720 and 70, with n8n's own directory on top) are covered by a section on the agency page, not a dedicated page.

**Problem / job:** `/document-processing-automation` (document processing 1,600, KD 12, five independents on page 1). Vertical posts remain linked from outbound email and proposals.

**Pure informational:** `/what-is-ai-automation` only. No further glossary posts.

## 5. Cannibalisation fixed

| Was competing for | Now |
|---|---|
| AI consultant: two blog posts at positions 35 and 36 | Both merged into `/ai-consultant` with 301s |
| AI automation agency: five URLs, none above position 38 | `/ai-automation-agency` owns the service searches. The listicle post owns "which agency" |
| n8n vs Zapier vs Make: two posts | Already merged (10-08 cleanup) |
| Three "what is X automation" posts | Already merged into `/what-is-ai-automation` |
| Agency pricing: a post and the cost page | Post kept for its position 15 ranking, cost page owns "ai development cost" |

## 6. What was rewritten (executed 2026-10-08)

Genuine rewrites of existing URLs (same slug, hero and publish date). The full text is in `rewrites/`.

| URL | Old angle | New target | Why |
|---|---|---|---|
| `/blog/top-ai-automation-agencies-b2b-saas-2026` | "Top 10 for B2B SaaS" with Chronexa ranked first and unverified stats | "AI automation agencies: how to choose one and who to compare": four types, seven questions, red flags, shortlist by type, pricing models, UAE section | 1,362 impressions at position 27; honest framing, no self-ranking, no invented statistics |
| `/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams` | Feature comparison with stale prices | Pricing model per tool, a worked example, self-hosting, AI, when to pick which, Zapier alternatives. Prices read from vendor pages on 8 October 2026 | 1,552 impressions at position 15.6; comparison family of about 3,100 searches |
| `/blog/self-hosting-n8n-architecture-security-and-cost` (was noindex) | Enterprise security essay | "n8n pricing in 2026": plans, what an execution is, real self-hosting cost, when each option fits | n8n price/cost/self-hosting is about 6,900 searches at low difficulty; back in the index and sitemap |
| `/blog/legal-process-outsourcing-vs-ai-document-review` | LPO vs AI, assumed the reader had already decided | "Legal process outsourcing: services, costs and the AI alternative": definition first, then pricing models, risks, AI comparison | LPO is 6,600 searches at KD 6 and we already sat at position 19 for the vocabulary |
| `/blog/data-entry-outsourcing-vs-ai-alternative` | First-person essay | Definition, pricing models, risks, provider checklist, then the three builds and the comparison | 480 searches, $55 CPC, KD 0, four independents on page 1 |

Pages retargeted without a rewrite (title, answer-first content, FAQs): `/ai-automation-agency`, `/ai-strategy-consulting`, `/ai-integration-services`, `/ai-agent-development`, `/business-process-automation-consulting`, `/document-processing-automation`.

New page: `/ai-consultant`, with generated art, nine answer-first sections and eight FAQs written around the phrasings people use.

## 7. Library decisions

Counts from `page-decisions.csv` (indexed pages only): 123 posts REPURPOSE (weak organic demand, kept as a sales library), 11 refreshed in the earlier cleanup, 7 KEEP (earning clicks), 5 REWRITE (above, plus the n8n pricing post that was noindex), 2 MERGE (consultant posts), plus the 13 noindexed and 7 merged posts from the first cleanup.

Not rewritten on purpose: `ai-automation-agency-pricing-what-you-get` (433 impressions at position 15, but the family has 30 searches a month), `palantir-alternatives` (110 searches a month), the vertical CPA, legal and RIA series (tiny volume), and all case studies.

## 8. Deliberately not targeted

- **Chatbot service families** (`chatbot customer service` 4,400, `ai chatbot service` 4,400): page 1 is chatbot software vendors. The searcher wants a product.
- **Head terms** (`ai automation` 9,900, `robotic process automation` 6,600, `workflow automation` 2,900): AI Overviews and definition intent. They come as visibility from the owner pages.
- **Zapier cost, accounts payable automation, AI document processing, intelligent document processing:** vendors own page 1 and we do not sell those products.
- **`automation company` (3,600):** the SERP is mixed with industrial automation firms. It sits on the agency page, but expect partial value.

## 9. Decisions for Ankit

1. **Accounting and bookkeeping outsourcing (about 6,400 searches, KD 4 to 8, CPC $58 to $108, independents hold page 1).** Searchers want to hire an outsourced accountant. We would answer as "the AI alternative for accounting firms and finance teams", which narrows the reader to CPA firms and back offices. It is the largest untouched family. Recommend a single test page, only after the first four weeks of data on the pages above.
2. **A HubSpot consultant page (880 searches, $88 CPC, KD 10).** Only one independent on page 1. Worth it only if CRM work is an offer you want to lead with.
3. **Whether to build a dedicated n8n agency page** (720 plus 70 searches). Feasibility is low while n8n's directory leads.

## 10. Baseline (before these changes had any effect)

Search Console non-brand data for 2026-07-06 to 2026-10-04 and attributed bookings. Bookings and revenue are zero because no booking has been attributed to a search landing page yet.

| Owner URL | Role | Target families | Monthly searches (US) | Max CPC | GSC 90d impressions | Clicks | Avg position | Bookings | Revenue |
|---|---|---|---|---|---|---|---|---|---|
| /ai-consultant | transactional (hire) | ai consultant, ai consulting firm, ai consultant services, ai consultant agency… | 18,630 | $106 | 1281 | 0 | 34.9 | 0 | $0 |
| /ai-automation-agency | transactional (hire) | ai automation agency, automation company, automation services, ai automation services… | 11,020 | $44 | 4414 | 4 | 40.8 | 0 | $0 |
| /ai-strategy-consulting | transactional (hire) | ai strategy consultant, ai strategy consulting, ai readiness assessment | 2,480 | $86 | 16 | 0 | 61.8 | 0 | $0 |
| /ai-integration-services | transactional (hire) | ai integration services, system integration services, api integration services, data integration services… | 1,790 | $196 | 1 | 0 | 4.0 | 0 | $0 |
| /ai-agent-development | transactional (hire) | ai agent development company, custom ai development company, chatbot development company, ai agent consultant | 1,460 | $77 | 2 | 0 | 35.5 | 0 | $0 |
| /business-process-automation-consulting | transactional (hire) | business process automation consultant, business automation consultant, business process automation company, business process automation services… | 910 | $56 | 1592 | 1 | 25.9 | 0 | $0 |
| /document-processing-automation | problem / outsourcing alternative | document processing, pdf data extraction, data extraction, intelligent document processing | 4,560 | $34 | 320 | 0 | 46.1 | 0 | $0 |
| /ai-automation-cost | commercial investigation (cost) | ai development cost, ai automation cost, ai automation agency pricing | 360 | $6 | 150 | 0 | 27.9 | 0 | $0 |
| /blog/top-ai-automation-agencies-b2b-saas-2026 | commercial investigation (list) | best ai automation agencies, top ai automation agencies, how to choose an ai automation agency | 40 | $34 | 140 | 1 | 27.1 | 0 | $0 |
| /blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams | commercial investigation (compare) | n8n vs zapier, make vs zapier, zapier vs make, n8n vs make… | 3,140 | $20 | 492 | 0 | 26.4 | 0 | $0 |
| /blog/self-hosting-n8n-architecture-security-and-cost | tool / cost | n8n pricing, n8n cloud pricing, n8n cost, n8n self hosting | 6,870 | $8 | 8 | 0 | 9.0 | 0 | $0 |
| /blog/legal-process-outsourcing-vs-ai-document-review | commercial investigation (outsourcing) | legal process outsourcing, legal process outsourcing services, legal process outsourcing companies | 6,980 | $27 | 0 | 0 | - | 0 | $0 |
| /blog/data-entry-outsourcing-vs-ai-alternative | commercial investigation (outsourcing) | data entry outsourcing, back office outsourcing | 690 | $55 | 2 | 0 | 75.0 | 0 | $0 |


## 11. How we measure it

For every owner page the baseline above fixes four numbers before any change had effect: monthly searches, impressions, clicks and average position for the target families. Two more follow the visit.

- **Weekly:** `node scripts/seo/km-measure.mjs` compares the last 28 days of Search Console with the baseline for each owner page, scaled to 28 days, and shows how many impressions the owner URL itself earns versus other URLs. A page is only "winning" when its own impressions and position improve, not when the family's total moves.
- **Bookings by landing page:** Calendly `utm_content` carries the page path on every booking made through a site button, and the Baserow `Landing Page` column now records the page on every form lead. Search-sourced bookings are those where the landing path is an owner URL.
- **Checkpoints:** 2026-11-15 (the existing post checkpoint, plus first read on the new page and rewrites), 2026-11-30 (week 7: re-rank the work by what moved), 2027-01-06 (week 13: scale if two or more owner pages are in the top 10 or three or more bookings trace to search; otherwise cut organic back to upkeep).
- **Leading signals:** an owner URL entering the top 20 for its main phrase, CTR above 3 percent once in the top 10, and the number of different phrasings it appears for.

Search Console reports are two to three days behind, and new pages typically take several weeks to settle, so the first useful read is around the 2026-11-15 checkpoint.
