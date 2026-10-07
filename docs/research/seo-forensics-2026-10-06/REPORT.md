# Why organic search isn't producing buyers for Chronexa — forensic report (2026-10-07)

Evidence base: Google Search Console for chronexa.io (16 months, every query and page), a 10,620-keyword US market rebuild and 72 live buyer SERPs from DataForSEO, the live search results for every keyword we documented as a target, a crawl of all 169 posts and ~165 other pages, Amplitude, Calendly, Cal.com booking emails, the Baserow leads table, and the repo's own strategy history. Total DataForSEO spend for this investigation: about $2.60 (balance was $39.19).

Supporting evidence (read these for the detail behind any claim):
- `00-evidence-log.md` — every load-bearing number with its source
- `01-system-and-technical.md` — what we built, the strategy timeline, technical SEO
- `08-positioning-and-journeys.md` — what a stranger sees, traced journeys query → booking
- `09-investmates-control.md` — Investmates as the control case
- `content-inventory-triage.csv` — all 169 posts with traffic, target keyword, intent, reader, links, issues and a triage tag

Plain-English terms: an **impression** is one time Google showed us in results. **Position** is our rank (1–10 = page 1). A **buyer query** is a search typed by someone who could hire us ("ai automation services", "automate tax workpaper preparation"), as opposed to a developer, a job-seeker, a student, or an AI tool. An **AI Overview** is Google's AI answer box above the results.

---

# The Verdict

Organic search isn't failing because Google can't see Chronexa. It's failing because almost nothing we published sits where a buyer searches, and the few places a buyer could find us lead to a site that doesn't say clearly what we sell.

In the last 90 days, people searching phrases a buyer would type saw Chronexa about 22,700 times. 87% of those sightings were on page 3 or deeper, so in practice nobody saw them. The ones on page 1 (about 1,170) produced 2 clicks. Of the 72 clicks where Google tells us the search, 59 were people typing "chronexa", people who already knew us. Strip those out and Chronexa got about 13 clicks in a quarter from strangers. In the US, buyer searches produced 0 clicks.

That happened for three reasons, in this order:

1. **We wrote content instead of building the pages buyers search for.** Each of the five strategy changes between July and September produced more blog posts. None of them produced the commercial pages they called for. The August plan listed five money pages to build first; all five return 404 today.
2. **We picked topics because they were relevant to us, not because buyers search them.** 55% of the posts with a recorded target keyword target phrases with essentially zero monthly searches (the CPA/RIA/legal vertical series). The September batch overcorrected into big-volume terms where Salesforce, IBM, Reddit and SaaS vendors hold page 1, and where the searcher is usually shopping for software, not hiring a firm.
3. **Even a buyer who arrives can't see what to buy.** No post's first screen says what Chronexa sells or to whom. The site offers 60+ "solutions/engines/use cases", hides its one priced product, links its two headline case studies to 404 pages, and contradicts itself on price and timeline.

The numbers that looked like progress, rising impressions and 169 posts, mostly measured AI tools, n8n developers and our own brand name. Because nobody separated those from buyers, every review read "more impressions" as momentum and kept publishing.

**Is SEO worth continuing?** Yes, but only as a small, targeted set of commercial pages, not as a blog engine. Real US buyer demand for "hire someone to build automation/AI" exists: roughly 18,000 searches a month across the main phrases, plus about 10,000 in outsourcing vocabulary. Small independent firms hold most of those page-1 slots, so they're winnable for a firm our size. Vertical problem searches (CPA, legal, RIA) are real but tiny. That market can support perhaps 6–10 well-built pages. It cannot support 169 posts, and blogging is the wrong tool for it.

**This revises what I recommended on 2026-10-06.** I said to hold the September batch to a 2026-11-15 checkpoint and keep writing. The forensic evidence says stop adding to that batch now. Keep the checkpoint only to measure the posts that already exist.

---

## 1. Where the funnel is breaking

Demand → indexation → ranking → click → qualified visit → conversion. Each stage, with evidence:

| Stage | Verdict | Evidence | Confidence |
|---|---|---|---|
| **Demand** | Exists, but not where we wrote | US "hire a firm" phrases ≈ 17,650/mo across 25 generic terms (e.g. `ai automation agency` 4,400, `ai consulting firm` 2,900, `ai consultant services` 2,400, `ai agent development company` 720, `ai integration services` 720). The vertical phrases we wrote for measure 0–40/mo. | High |
| **Indexation** | Not the problem | 169/169 posts return 200, self-canonical, server-rendered, in sitemap; 161 of 169 earned impressions; 31/32 September posts were picked up within days. (Full URL-inspection pull did not complete; impressions prove indexing for 161.) | High |
| **Ranking** | **Primary leak** | 0 of 72 buyer SERPs have Chronexa in the top 10. 87% of buyer impressions sit at position >20. Our best-ranked buyer pages: `business process automation consulting` pos 22, `generative ai consulting services` 26.5, `ai automation agency` 52.8. | High |
| **Click (CTR)** | Secondary, and mostly misread | Page-1 impressions are dominated by machine prompts (5,066 of them on page 1, 0 clicks) and n8n documentation queries. Buyer page-1 impressions: 1,173/quarter → 2 clicks. Small numbers, so CTR on real buyer queries can't be judged yet. | Medium |
| **Qualified visit** | Most "traffic" isn't buyers | Visible clicks: 59 of 72 are brand. Of the best post's top queries, most are AI-tool prompts ("who helps b2b saas platforms integrate generative ai…"). Top Palantir query is government-agency intent; Chronexa has no government offer. | High |
| **Offer comprehension** | Weak | See §5 and `08-positioning`. No first-screen statement of what we sell; 60+ offer surfaces; one hidden priced product; proof links 404. | High (on the facts) / Medium (on its impact, untested at volume) |
| **Conversion** | Zero traceable | 0 blog-originated Calendly bookings since tracking began (09-17); ~8 of ~120 "book a call" clicks on blog pages in 90 days; 0 of 74 lead rows from the blog. Cal.com bookings (≈9 since May) carry no source; their profiles (Indian SMBs during the India Meta campaign, a vendor pitch) don't look like blog readers. | Medium (attribution gaps, see §12) |

**The leak is at ranking, and behind that at targeting.** We don't hold page 1 for any buyer query, and the content that does rank on page 1 ranks for queries no buyer types.

What would disprove this: a GSC pull showing meaningful page-1 buyer impressions with healthy CTR but no bookings (that would move the leak to conversion), or Cal.com/booking data showing blog-sourced calls we couldn't see.

---

## 2. What Chronexa has actually written about

169 live posts (Sanity, 2026-10-06). Classified by the post's own taxonomy plus title/keyword rules (rules in the scratchpad scripts, results per post in the CSV).

- **By industry:** cross-industry 41%, CPA 21%, RIA/wealth 17%, law 14%, sales/revenue 5%, PE/VC 2%, insurance 2%.
  - The vertical series (CPA + RIA + law = 86 posts, 51%) earned 15 of 88 post clicks (17%).
- **By format:** guides 65%, explainers 14%, comparisons 14%, case studies 7%.
  - Comparisons (14% of posts) earned 51% of clicks. Lists titled "top/best" (7 posts) earned 46 clicks; question-style titles (59 posts) earned 4.
- **By intent:** informational 65%, commercial investigation 35%. No post is transactional (none is a "hire us for X" page).
- **By funnel stage:** awareness 43%, problem/solution 26%, vendor selection 31%.
- **By topic:** automation platforms 31% (5 clicks), build-vs-buy 18% (45), compliance/security 18% (14), cost/ROI 12% (7), AI agents 10% (15), document intelligence 9% (2).
  - Document intelligence is the closest topic to the only priced offer ($3,500 document pipeline), and it has 16 posts and 2 clicks.
- **By keyword discipline:** 91 of 169 posts (54%) have no recorded target keyword anywhere in the repo or pipeline. Of the 78 that do, 43 target phrases with under 20 searches a month.
- **By publishing rhythm:** 43 posts in July, 18 in August, 32 in September. Three bursts, each following a different strategy.

What we actually wrote: a general AI-and-automation education library, plus a long tail of vertical posts whose phrasing nobody searches, plus a September batch of software-category explainers. What a buyer searches is "who can build this for me?", and that's the one thing we never published as a page.

---

## 3. What people actually search for

Market rebuilt from Chronexa's real services, not from our old keyword lists: 13 problem clusters → 10,620 US keywords (DataForSEO Labs) → strict filter for things Chronexa can actually deliver → 431 distinct keyword groups, ≈169,000 searches/mo (`00-evidence-log`, scratchpad `market-strict-groups.json`). Then 72 hand-picked buyer queries were pulled live.

Where demand exists (US, monthly):

- **Hiring an automation/AI provider:** about 17,650/mo across 25 terms. Top terms:
  - `ai automation agency` 4,400 (no AI Overview; Reddit is #1)
  - `ai consulting firm` 2,900
  - `ai consultant services` 2,400 ($106 CPC)
  - `ai agent development company`, `ai automation services`, `ai integration services` 720 each
  - `ai consultant for small business` 590
  - `ai automation consultant` 590 (career/Indeed noise in the top 3)
  - `automation agency` 480
- **Tool-specialist hiring:** `hubspot consultant` and `zapier agency` 880 each, `n8n agency` 720, `airtable consultant` 210. The tool's own directory or community holds most of these pages: n8n.io and experts.n8n.io sit in the top 3 for n8n terms, and Zapier's own pages sit in the top 3 for Zapier terms.
- **Outsourcing vocabulary** (how back-office buyers say it): `legal process outsourcing` 6,600, `bookkeeping outsourcing` 1,600 ($108 CPC), `accounting outsourcing` 1,000, `data entry outsourcing` 480 — about 10,450 across 9 terms. Independent firms hold the page.
- **Horizontal problems:** `accounts payable automation` 1,600 ($279 CPC, vendor-heavy), `ai document processing` 1,900 (Google/Databricks — walled), `pdf data extraction` 480 (tools), `crm automation` 590 (SAP/Reddit).
- **Vertical problems** — CPA, legal, RIA, insurance: about 1,840/mo across 12 terms. Examples: `accounting automation software` 720 (a software shopper), `ai for financial advisors` 210, `ai for accounting firms` 110, `contract review automation` 110, `legal workflow automation` 90.
  - The exact phrasings we wrote for (`engagement letter automation for cpa firms`, `ria client onboarding automation`, `karbon workflow automation`, `form adv amendment automation` and about 40 more) measure 0.

**Who holds page 1 on the 72 buyer SERPs:**

- **Generic "hire" queries:** independent firms hold 86 of the 125 top-5 slots. Big brands hold a few. Reddit appears on most. An AI Overview shows on 21 of 25.
- **Vertical problem queries:** independent firms hold 42 of 60 top-5 slots.

So the market is small, real, and held by small firms. It isn't a big-tech wall. The two exceptions are tool-specialist terms, where the vendor's own directory is in the way, and the horizontal document/AP terms, where enterprise vendors are in the way.

---

## 4. What we targeted vs what we should have targeted

| | Documented targets (78 posts) | Where buyer demand is |
|---|---|---|
| Phrases with <20 searches/mo | **43 (55%)**, almost all vertical CPA/RIA/law | — |
| Phrases with ≥100 searches/mo | 30, all from the September batch | ≈60 buyer phrases |
| Reader capable of buying a custom build | 45 of 78 by rule; the September ≥100 terms are mostly software shoppers (`ai form builder`, `best ai recruiting software`, `sales automation software`, `ai native crm`) | Hire-a-firm and outsourcing phrases |
| Page type built | Blog post, 100% | Commercial service page (what ranks: agency/consultancy service pages, vendor "services" pages, small-firm landing pages) |
| Chronexa page 1 | 0 of 72 buyer SERPs | — |
| Validated before writing? | No for most. The Backlog (Baserow table 1022496) has 26 rows marked `used`, and **23 of them have no measurable volume**. Of 55 still `queued`, 42 have none. | — |

The classic mistake the brief asks about is confirmed, twice over:

- **July–August, "relevant to what we do":** vertical lifecycle posts phrased the way an automation builder describes the work (`custody statement reconciliation automation`, `ria build vs buy ai automation`), never measured. They get impressions only from machine prompts and a handful of long-tail matches.
- **September, "high volume, so it must be good":** head terms copied from a competitor's blog without checking who searches them or who wins them. `ai agents for business` (3,600/mo) has Forbes, LinkedIn and Domo on top. `ai marketing agent` (1,900) has Salesforce. `ai sales agent` (1,300) has Salesforce and Reddit, and our post says we don't sell outbound.

Meanwhile the August plan, which did point at buyer phrases (outsourcing vocabulary, `business process automation services`, `ai agent development company`), was never built as pages. It became four blog posts on 08-29/30.

---

## 5. Why our content wins or loses (specific examples against SERPs)

Phase-6 caveat: the subagent comparing articles side by side with the top-3 competitors hit the session rate limit before writing its file. These judgements rest on the live SERP composition, the journey tracing in `08-positioning`, and the GSC query data, not on a line-by-line competitor read. That comparison is the first thing to redo if this conclusion is challenged.

**What wins here, and why:**

- `top-ai-automation-agencies-b2b-saas-2026` (23 clicks): a list in the format AI Overviews and agency-shoppers like.
  - Its visible queries are mostly AI-tool prompts, and it ranks Chronexa #1 in a list Chronexa wrote, with no disclosure.
  - That's a trust risk, and Google's guidance treats self-serving rankings as low-quality.
- `palantir-alternatives-mid-market-us-companies` (8 clicks): a comparison format, but its top query is "best palantir alternatives for government agencies". Those clicks can't become customers.
- `ultratax-cs-claude-n8n-tax-season-automation` (6 clicks, pos 6.6) and `why-advisor-client-transfer-paperwork-gets-rejected` (2 clicks, pos 7.4): the only genuinely buyer-shaped wins.
  - Both name a specific tool or form and a specific pain, which is the Investmates pattern. The searches behind them are tiny.

**What loses, and why:**

- **Vertical posts with zero-demand phrasing** (102 posts tagged REPURPOSE, 3 clicks combined in 90 days): there is no search to rank for, and content quality can't fix that.
- **September head-term posts** (25 tagged HOLD, 0 clicks): wrong content type for their SERPs.
  - Google ranks vendor product pages, Reddit threads and enterprise explainers there, not an agency's opinion post.
  - For `what is intelligent automation` the top 5 are IBM, AWS, Automation Anywhere, UiPath and Hyland. We're at position 74.
- **n8n builder content:**
  - `n8n-ai-agents-features-2026-complete-guide` has 6,781 impressions and 3 clicks. People want n8n's own documentation.
  - `fintech-automation-with-n8n…` tells the reader "No. n8n's node-based interface allows compliance teams to build workflows without coding expertise", which argues against hiring us.
- **Commercial pages that should win but don't:** `/business-process-automation-consulting` (pos 22–28 for its terms), `/cpa-tax-document-automation` (pos 45). They compete with our own blog posts for the same queries.
  - 45 buyer queries are split across 2+ Chronexa URLs. For example, `automate tax workpaper preparation` spreads over four URLs at positions 10–66.
  - The service page doesn't even mention workpapers.

**On "me-too" content:** the September batch was deliberately 70–80% a competitor's structure. On SERPs that already hold ten vendor and publisher pages saying the same thing, a reader or Google has no reason to prefer ours. The posts do contain genuine first-hand material: the 11,458-message outbound post-mortem, and the "wrote into a spreadsheet tab that did not exist for six weeks" incident. But that material is buried inside generic category explainers, not built into pages where it's the differentiator. Confidence: medium (no side-by-side read, see caveat).

---

## 6. Chronexa vs Investmates

Full evidence in `09-investmates-control.md`. The surprise is that Investmates doesn't win on service searches either. It isn't in the top 10 for "nri financial advisor usa", and service/brand pages earn about 0% of its US traffic. It wins with very specific lookups made at a moment of need: definitions (80.7% of India traffic), forms and procedures (71.8% of US traffic). The meetings Ankit remembers would have come from turning those informational visitors into calls on the site. That claim can't be verified here (no Investmates analytics or CRM access).

Why the same play doesn't transfer directly:

| Mechanic | Investmates | Chronexa |
|---|---|---|
| Who searches | The person who will pay, about their own money | Usually an employee researching a business purchase; often not the signer |
| Trigger | Dated, personal and urgent (passport expiring, bank asking for Form 15CA) | No deadline; "we should automate this someday" |
| Query shape | Names an exact form, rule or threshold | Names a software category or concept |
| Competition | Government portals, banks, small CA firms; Reddit 0/8; median CPC $0 | SaaS vendors, Big Tech, Reddit (top 5 on 15/30), LinkedIn; median CPC $31.59 |
| Topic vs product | The article's task is the paid service (Form 15CA/15CB, repatriation) | Most targets aren't the task our offer sells |
| Identity in the query | "NRI" defines the customer | The query doesn't reveal firm size, industry or role |
| On-page | 6 named services in nav, "built for NRIs", credentialed CA byline, one consistent 15-min call CTA, problem-specific pop-up | 60+ offer surfaces, no audience line, two booking systems, contradictory prices |
| Volume available | Tens of thousands of personal-finance lookups | The whole US buyer market is ~30k/mo, concentrated in ~30 phrases |

The transferable lessons are specificity, content that sits on the task you sell, a credentialed byline and one clear next step. The non-transferable part is volume: Investmates converts a small fraction of a huge informational audience, and Chronexa's buyers don't generate that audience. So Chronexa has to meet buyers at the hire moment (commercial pages) plus a few deep, tool- and form-specific pages, not a broad library.

---

## 7. Root causes, ranked by impact

**#1 — Strategy failure: we never built the pages buyers search for (commercial-page absence).**
- *Evidence:* 5 strategy changes 07-20 → 09-14 (`01-system`, A10). The August plan's 5 money pages are all 404. 100% of new output since July is blog posts. 0 of 72 buyer SERPs show Chronexa on page 1. What ranks on those SERPs is service pages from small firms.
- *Impact:* explains why buyer impressions sit at pos >20, and why buyer queries land on blog posts or get split across URLs.
- *Confidence:* high.
- *Why it happened:* each pivot was cheaper to execute as more posts, because the publishing pipeline makes posts nearly free while a service page needs positioning decisions. The website was being rebuilt in parallel, and the Shopify work pulled attention away from 09-10.
- *What would disprove it:* a dedicated, consolidated buyer page that still can't climb past position 20 after 3–4 months. That would point at authority instead (see #6).

**#2 — Keyword failure: topic chosen by relevance, then by raw volume, never by "buyer searches this".**
- *Evidence:* 55% of documented targets <20/mo; Backlog 23 of 26 `used` rows have no volume; 54% of posts have no recorded target at all; September targets mostly software-shopper terms on vendor/Reddit SERPs.
- *Impact:* explains the 102 near-zero posts and the 0-click September batch.
- *Confidence:* high.
- *Why:* the "pull the SERP before adopting a keyword" rule was written on 08-14 but lives only in a skill banner, not in the publishing linter. The old n8n pipeline picked topics by GSC impressions, which machine prompts inflate.

**#3 — Measurement failure: we mistook machines, developers and our own brand for an audience.**
- *Evidence:* 59 of 72 visible clicks are brand. Machine prompts produced 6,660 impressions (5,066 on page 1). n8n builder queries produced another 4,021. Reports tracked impressions and post counts.
- *Impact:* a false sense of momentum kept the publishing engine running and hid #1 and #2.
- *Confidence:* high.
- *Disproved if:* the anonymised GSC queries (most clicks have no visible query) turned out to be mostly buyer queries. That's unlikely, given pages and positions.

**#4 — Positioning/offer failure: the arriving visitor can't tell what to buy.**
- *Evidence (`08-positioning`):* no first-screen offer on any post; 60+ offer surfaces; the only priced product (/document-pipeline, $3,500) is hidden from nav, footer and sitemap; homepage proof links 404 under "Every claim is checkable"; prices of $3,500 vs $8K–$80K vs $5K–$50K; one post says "we do not build outbound" while the nav sells an outbound engine.
- *Impact:* caps conversion of whatever traffic arrives. Today it's masked by #1 (too few buyers arrive to test it).
- *Confidence:* high on the facts, medium on the size of the impact.

**#5 — Topical sprawl: too many disconnected subjects for one site.**
- *Evidence:* 42 service pages across CPA, legal, RIA, VC/PE, insurance, HR, cybersecurity, pharma, manufacturing, D2C and industrial maintenance, plus 36 portfolio pages, 32 case studies and 169 posts on everything from Palantir to recruiting software. 45 buyer queries are cannibalised.
- *Impact:* dilutes relevance signals and splits what little ranking strength exists.
- *Confidence:* medium (sprawl's effect on ranking is inferred, not directly measured).

**#6 — Authority: unproven either way.**
- *Evidence:* Ankit struck the "backlinks are the wall" thesis on 09-12 (129 referring domains per Semrush). Today's data shows small firms hold buyer SERPs, which supports him. But we've never had a consolidated buyer page to test with, so authority can't yet be ruled in or out.
- *Confidence:* low.
- *What settles it:* the 90-day test in §11.

Technical SEO is a **secondary** issue, not a root cause. Indexing, rendering, canonicals and speed are clean. There are real hygiene defects that waste link signals but can't explain zero buyer rankings: 130 posts link through redirects, 13 redirect chains, 3 internal 404s, a pagination gap, and "Keep reading" only draws from the 60 newest posts.

---

## 8. Stop / Fix / Double down

**STOP**
- **Writing vertical lifecycle posts** in builder phrasing (CPA/RIA/law workflow posts with zero-volume keywords). There is no search for them.
- **Copying competitor blogs for head terms** (`ai form builder`, `ai marketing agent`, glossary "what is X"). No more posts from the master content plan's Tier A.
- **Publishing any post** whose keyword hasn't passed a recorded check: measured volume, plus a live SERP showing small firms on page 1, plus a reader who could buy. This should be enforced in the linter, not left to memory.
- **n8n how-to and docs-style content.** n8n.io owns that intent and the readers are builders.
- **Ranking Chronexa #1 in our own "top agencies" lists without disclosure.**
- **Counting impressions and post totals as progress** (see §12).

**FIX** (existing assets worth repairing)
- **Homepage proof links:** the 2 case-study links that 404, and the same link on /cpa-tax-document-automation.
- **/document-pipeline:** put it in the nav, footer and sitemap, and make it the end CTA where it fits. It's the only priced, concrete offer.
- **One booking system and one CTA label:** Calendly vs Cal.com, "15-min" vs a 30-min event. Add the page path to every booking click and every lead row.
- **One page per buyer query:**
  - Merge the agency listicles (B2B-SaaS, UAE, plus the redirected USA/UK/NY posts) into one honest "how to choose / who to consider" page.
  - Merge the two Make/n8n/Zapier comparisons.
  - Make `/cpa-tax-document-automation` actually cover workpapers, and point `tax-workpaper-preparation-automation` at it.
- **Link hygiene:** redirected related-service links (130 posts), the 3 hub 404s, the pagination gap, "Keep reading" drawing only from the 60 newest posts.
- **Contradictions:** unify the price and timeline language across pages, and remove the outbound-engine contradiction.

**DOUBLE DOWN** (where the evidence shows opportunity)
- **Commercial "hire" pages** on phrases where small firms hold page 1: `ai automation services` / `ai automation company`, `ai integration services`, `ai agent development company`, `business process automation services / consultant`, `ai consultant for small business`, `workflow automation consultant`.
  - Build about 4 pages, each owning a family of phrases (the automaly/ProsperSpark pattern already documented on 09-12).
- **One cost page:** `ai development cost` (320/mo, all five top results are independent firms), with real numbers from our own offers.
- **Narrow, specific tool-and-form pages in CPA** where we already have signs of life:
  - UltraTax/CCH/SafeSend/Karbon workflows (`ultratax-cs-claude-n8n…` ranks #5)
  - workpaper preparation (691 GSC impressions/quarter for `automate tax workpaper preparation`)

  Treat these as a sales library that also catches a few searches, not as a traffic engine.
- **First-hand material as the differentiator:** the outbound post-mortem, the silent-failure incident, ReserveStudy. Put it on the commercial pages, where competitors can't copy it.

---

## 9. Keyword opportunity map

US, DataForSEO 2026-10-06. "Small firms in top 5" = how many of the top 5 organic results are independent firms rather than big brands, marketplaces or forums. "Feasibility" is a judgement from that plus difficulty (KD) and AI Overview presence.

| Keyword / family | Vol/mo | CPC | Intent | ICP | Service | Chronexa today | SERP (small firms in top 5) | Feasibility | Page type | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| ai automation services / company / agency services | 720 + 390 + 170 | $29–39 | Hire | SMB–mid-market | General automation | Not in top 10 | 3–4 of 5, AIO | High | Service page (one, owns family) | **P1** |
| ai integration services / system integration services | 720 + 390 | $26–46 | Hire | Mid-market | Integration | Not in top 10 | 4 of 5 | High | Service page | **P1** |
| ai agent development company / ai agent consultant | 720 + 140 | $34–49 | Hire | Mid-market | AI agents | Not in top 10 (old page 308'd) | 3–4 of 5 | High | Service page | **P1** |
| business process automation services / company / consultant | 210 + 260 + 170 | $22–47 | Hire | Mid-market | BPA | /business-process-automation-consulting pos 22–28 | 3–4 of 5 | High (page exists, needs consolidation) | Fix existing service page | **P1** |
| ai consultant for small business / small business ai consultant | 590 + 170 | $17–19 | Hire | Small business | General | Not ranked | 4 of 5 | Medium–high | Service page | P2 |
| ai development cost | 320 | — | Cost | Mid-market | All | Not ranked | 5 of 5 | High | Cost guide with our real prices | **P1** |
| ai automation agency | 4,400 | $19 | Hire | Mixed | General | 5 URLs at pos 24–68 | 2 of 5 (Reddit #1), no AIO | Medium | One consolidated agency page | P2 |
| automate tax workpaper preparation / workpaper automation | n/a in DFS; 691 GSC imp/qtr | — | Problem | CPA | CPA tax | Blog pos 10.6 + service pos 66 | 3 of 5 (Juno, Bloomberg Tax, TR) | Medium | Merge into CPA service page | P2 |
| ultratax / cch axcess / safesend-karbon automation | small (tens) | — | Problem | CPA | CPA tax | Blog pos 6.6 (6 clicks) | 3 of 5 | High (low volume) | Keep and extend as tool pages | P2 |
| legal workflow automation / legal document automation | 90 + 90 | $16–64 | Problem | Law | Legal | Not ranked | 4–5 of 5 | High (low volume) | Legal service page section | P3 |
| ai for financial advisors | 210 | $27 | Problem/software | RIA | RIA | Not ranked | 4 of 5 | Medium | Only if RIA offer is real (memory: no RIA client yet) | P3 |
| data entry / back office / bookkeeping outsourcing | 480 + 210 + 1,600 | $55–108 | Hire (outsourcing) | SMB/CPA | Document pipeline | Not ranked | 4 of 5 | High | Positioning decision first (see §11 Q1) | Decide |
| legal process outsourcing | 6,600 | $27 | Hire (labour) | Law | Legal docs | Not ranked | 2 of 5 (Wikipedia, Clio) | Medium; buyer may want labour, not software | Decide | Decide |
| n8n agency / n8n consultant | 720 + 70 | $10–13 | Hire | Mixed | n8n builds | Blog pos ~17–38 | 1–2 of 5 (n8n.io directory) | Low–medium | Service page only, not blog | P3 |
| ai agents for business, ai marketing agent, ai sales agent, what is X | 1,300–3,600 | — | Info/software | Not buyers | — | Pos 4–74, 0 clicks | 0–1 of 5 | Low | **Stop** | Stop |

---

## 10. Content triage (all 169 posts; per-post list in `content-inventory-triage.csv`)

Rule-based first pass. Review each list before acting; nothing has been changed on the site.

- **KEEP — 8 posts, 38 clicks:** earning clicks from relevant queries. Examples: `ultratax-cs-claude-n8n-tax-season-automation`, `why-advisor-client-transfer-paperwork-gets-rejected`, `ai-automation-agency-pricing-what-you-get`, `palantir-alternatives…` (keep, but expect no buyers from it).
- **UPDATE — 11 posts:** positions 4–20 with 100+ impressions. Examples: `tax-workpaper-preparation-automation`, `sec-marketing-rule-compliance-automation`, `manual-invoice-processing-cost-per-invoice-automation`, `productized-automation-vs-custom-development-the-real-cost-breakdown`.
- **MERGE — 9 posts, 33 clicks:**
  - the agency listicles (`top-ai-automation-agencies-b2b-saas-2026` and `blog-top-automation-agencies-uae-dubai`) into one page
  - the two Make/n8n/Zapier comparisons
  - the three "what is … automation" glossary posts into one
  - the overlapping CPA "company for CPA firms" and "tax document workflow" posts into the CPA service page
- **NOINDEX / DELETE candidates — 14 posts:** n8n builder posts (`n8n-ai-agents-features-2026-complete-guide`, `n8n-ai-agent-node-build-multi-agent-systems-in-2026`, `reduce-claude-api-costs-n8n-batch-api`, `self-hosting-n8n…`) plus posts with zero impressions in 90 days.
  - `b2b-marketing-automation` is on this list only because it's new. Re-check it at the checkpoint.
- **REPURPOSE — 102 posts, 3 clicks in 90 days:** mostly the vertical CPA/RIA/law series. Stop judging them on search; use them as a sales library (link from outbound emails, proposals, call follow-ups). Leave them live and out of SEO reporting.
- **HOLD TO CHECKPOINT — 25 September posts:** no more additions to this batch. On 2026-11-15, any post not in the top 20 for its keyword moves to REPURPOSE or NOINDEX.

(Redirects for the earlier culled posts already exist. The fix there is the redirect targets, listed in §8.)

---

## 11. 90-day organic search strategy — the smallest test that proves whether this channel can work

**The question the 90 days answers:** if Chronexa builds a few genuinely good commercial pages for real buyer phrases, do they reach page 1 and produce enquiries? If yes, keep investing. If no, stop investing in organic beyond hygiene.

**Weeks 1–2: decide and fix (no new content)**
1. Ankit answers the open questions below.
2. Repair the conversion path:
   - the homepage proof 404s
   - /document-pipeline in nav and sitemap
   - one booking link with page attribution
   - lead rows store the page URL
   - unified price and timeline language
3. Consolidate the agency listicles and the comparison duplicates. Fix redirected related-service links.

**Weeks 2–6: build four pages, nothing else**
4. **AI automation services page:** owns `ai automation services / company / agency services`.
5. **AI integration & agent development page:** owns `ai integration services`, `ai agent development company`, `system integration services`.
6. **Business process automation services:** rebuild the existing consulting page to own `bpa services / company / consultant`.
7. **What AI automation costs:** owns `ai development cost` and pricing queries, with our real numbers.

Each page must have:
- a first-screen audience and offer line
- one first-hand proof (ReserveStudy, our own pipelines)
- a clear price or price band and timeline
- one CTA

Point every relevant blog post at the matching page.

**Weeks 6–13: measure, and add only if signals appear**
8. Track the four pages weekly (§12). Add a CPA tool page (UltraTax/workpapers) only if at least one of the four reaches the top 20 by week 10.
9. **Week 13 decision:**
   - **Continue** if ≥2 pages are in the top 10 and there's ≥1 attributed enquiry.
   - **Hygiene-only** if no page is in the top 20. That points at authority or demand, and money is better spent on outbound and ads.

**Open questions for Ankit (these change the plan):**
- Q1. **Will Chronexa use "outsourcing" vocabulary?** `bookkeeping outsourcing` (1,600), `data entry outsourcing` (480) and `legal process outsourcing` (6,600) are the largest buyer phrases small firms win. But they imply a labour service, and on 08-14 the "document-ops firm" framing was disputed. Yes adds a fifth page; no drops it.
- Q2. **Which offer leads?** The $3,500 document pipeline is the only priced product, but the four pages above are broader. Should the commercial pages sell the pipeline as the entry offer, or a general fixed-scope build?
- Q3. **Do the self-ranked "top agencies" lists stay?** They're the only posts earning agency-shopper clicks, and they rank Chronexa #1 without disclosure.

---

## 12. Measurement framework — so we never again publish dozens of articles blind

**Never report:** total impressions, site-wide average position, post count, or total clicks including brand. All four went up while buyer clicks stayed near zero.

**Report weekly (extend `scripts/seo/weekly-tracker.mjs`):**
1. **Buyer impressions on page 1**, from GSC, filtered to buyer-class queries with machine prompts and brand excluded. The class rules are in this investigation's `classify.mjs` / `gsc-forensics.mjs`; move them into the tracker.
2. **Non-brand buyer clicks.**
3. **Rank of each commercial page** for its own keyword family (DataForSEO `ranked_keywords`, about $0.02 per run).
4. **Attributed enquiries by landing page:** Calendly `utm_content`, Cal.com (needs attribution added), lead-table page URL, and `book_cta_click` with page path on every component.

**Report monthly:** enquiries → qualified calls → proposals, with the first-touch landing page recorded in the CRM. Add a one-line "how did you find us?" field to the booking form, since Ankit's Investmates evidence came from hearing it on calls.

**Gate before any new page or post (enforce in the linter):** recorded keyword, measured volume ≥ 50 or a documented reason, live SERP showing ≥2 independent firms in the top 5, a reader who could buy, and the commercial page it links to. No gate pass, no publish.

---

## Limits of this investigation, and what would strengthen it

- **Side-by-side content comparison not completed.** The subagent hit the rate limit. Redo it for 10 articles to firm up §5.
- **Full URL-inspection pull not completed.** Indexing is inferred from impressions for 161 of 169 posts.
- **Bookings with no recorded source.** Cal.com bookings carry no source data, in-body link clicks aren't tracked, and most GSC clicks have no visible query. Proper attribution (§12) would settle "is the blog producing anything" within a month.
- **Investmates conversion claim.** Unverifiable without that site's analytics or CRM. A GSC export or the booking form's "how did you hear" answers would turn that comparison from mechanics into numbers.
- **Authority.** Not measured directly (backlink data is out of DataForSEO scope; there's no Semrush subscription). The §11 test is the cheaper way to answer it.
