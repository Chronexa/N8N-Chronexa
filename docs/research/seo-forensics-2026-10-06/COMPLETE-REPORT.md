# Chronexa organic search: the complete report (2026-10-08)

This is the one document. It covers what we knew, what we found, what we changed, what the numbers are now, what you need to decide, and what comes next and why. You do not need to open any other file. The raw research files still exist, but nothing here depends on them.

Plain-English terms: an **impression** is one time Google showed one of our pages in results. **Position** is our rank (1 to 10 is page 1). A **buyer search** is something a person who could hire us would type ("ai automation agency"). **KD** is keyword difficulty, 0 to 100, lower is easier. **CPC** is what advertisers pay per click, a rough sign of how valuable a visitor is. **Owner page** is the single page that is supposed to rank for a group of related searches.

---

## 1. The short version

**The problem.** Chronexa wrote about things buyers do not search for, and never built the pages buyers do search for. In 90 days, buyer-type searches showed us about 22,700 times, 87% of those on page 3 or deeper. Almost nobody saw them. Of the 72 clicks where Google shows the search, 59 were people typing "chronexa". Strangers gave us about 13 clicks in a quarter. No call or lead has ever been traced to a blog post.

**What we did (7 to 8 October 2026).**
1. Built 15 buyer pages, each owning a family of searches, each with its own look, illustration, real tool logos and a labelled example engagement (no client named).
2. Cleaned the blog: repaired about 140 broken or redirecting links, merged overlapping posts, hid 12 posts that have no demand, refreshed 11 posts that were close to page 1, and pointed every post's end-of-article links and button at a buyer page.
3. Built a scored keyword map of 431 search families, gave each valuable family one owner page, and executed the highest-value changes: one new page (`/ai-consultant`), six retargeted service pages and five genuine post rewrites.
4. Fixed tracking so we can see which page produced which enquiry, and saved a baseline to measure against.

Everything above is live on chronexa.io and committed to git.

**What is next.** Google Ads on the same searches, directory listings, Reddit answers. Details and reasons in section 8. **What I need from you** is in section 7: mainly an ad budget and account, and three yes/no decisions.

---

## 2. What we knew before

- 169 blog posts, written in bursts after five strategy changes between July and September.
- Blog clicks had fallen three months in a row. 147 of 169 posts had zero clicks. One post (`top-ai-automation-agencies-b2b-saas-2026`) was 26% of all clicks.
- Nothing had ever been traced from blog to meeting to revenue. Booking tracking only started on 17 September.
- Every review read "more impressions" as progress and recommended writing more.

## 3. What the investigation found

**Where the funnel breaks: at ranking, and behind it, at targeting.**
- Indexing is fine (all posts are indexed).
- We are on page 1 for **0 of 72** buyer searches we checked live. Small independent firms hold most of those top-5 spots, which means they are winnable.
- Page-1 buyer impressions produced 2 clicks. US buyer searches produced 0 clicks.
- About a fifth of the impressions we saw were AI tools checking search results. They never click. They made the numbers look healthier than they were.

**What we wrote versus what buyers search.**
- 55% of the posts with a recorded target keyword targeted phrases with under 20 searches a month (almost all of the CPA, RIA and law series).
- 54% of posts had no recorded target keyword at all.
- The September batch overcorrected into big head terms (for example "ai agents for business", 3,600 a month) where Forbes, Salesforce, IBM and Reddit hold page 1.
- The August plan listed five buyer pages to build first. None was ever built. All five became blog posts.
- The 102 vertical posts earned 3 clicks in 90 days. The formats that did earn clicks were "best X" lists, "X vs Y" comparisons and very specific tool-and-form posts.

**Where real demand is (US, per month).**
- Hiring an AI or automation provider: about 17,650 across 25 phrases (`ai automation agency` 4,400, `ai consulting firm` 2,900, `ai consultant services` 2,400 at $106 CPC).
- Outsourcing vocabulary: `legal process outsourcing` 6,600, `bookkeeping outsourcing` 1,600 ($108 CPC), `accounting outsourcing` 1,000, `data entry outsourcing` 480.
- The vertical phrases we wrote for (CPA, RIA, legal workflow) measure 0 to 40 a month.
- The whole buyer market is roughly 30,000 searches a month, concentrated in about 30 phrases. It supports 6 to 10 well-built pages, not 169 posts.

**Even a buyer who arrived could not see what to buy.** No post said on the first screen what Chronexa sells. The site had 60+ offer pages, hid its one priced product (`/document-pipeline`, $3,500), linked its two headline case studies to 404 pages, and quoted three different price ranges.

**Root causes, ranked.**
1. Strategy: we never built the buyer pages. Each pivot was cheaper to execute as more posts.
2. Keywords: topics were chosen because they were relevant to us, then because they were big, never because buyers search them.
3. Measurement: we counted machines, developers and our own brand name as an audience.
4. Positioning: the visitor could not tell what to buy.
5. Sprawl: too many unrelated subjects on one site, with one search often split across several of our own pages.
6. Authority: unproven either way. The 90-day test settles it.

**The Investmates lesson.** Investmates does not win on service searches either. It wins on specific lookups made at a moment of need (a form, a rule, a deadline) and converts those readers on the site. Chronexa cannot copy the volume, because its buyers do not generate a big informational audience. The lesson that transfers is specificity, content that sits on the task you sell, and one clear next step. So Chronexa should meet buyers at the "hire" moment with commercial pages, plus a few deep tool-specific pages.

## 4. What we changed, and why

### 4.1 Fifteen buyer pages (live)

Each page owns a family of searches, carries the same positioning (we audit first, free audit, free first workflow, live in a week, we build on your tools, we stay on as your AI team) and has its own accent colour, hero visual, generated illustration, real logos and a labelled composite example engagement. Clients are never named.

- `/ai-consultant` (new on 8 Oct): the biggest family, about 18,600 searches a month
- `/ai-automation-agency`: about 11,000 a month
- `/ai-strategy-consulting`: AI strategy consultant and AI readiness assessment, about 2,500
- `/ai-integration-services`, `/ai-agent-development`, `/business-process-automation-consulting` (rebuilt), `/ai-knowledge-systems`, `/custom-mcp-server-development`
- `/automated-reporting`, `/ai-email-management`, `/ai-training-for-employees`, `/tech-stack-migration`
- `/ai-roi-calculator` (a working calculator), `/ai-automation-cost`, `/how-we-work`, `/what-is-ai-automation`

All pass: status 200, indexable, in the sitemap, correct canonical, one H1, structured data, listed in `llms.txt`, and in the menu. Titles are trimmed to 60 characters.

### 4.2 Blog cleanup (live)

- **Links:** about 140 links inside posts and case studies pointed at retired, redirecting or dead pages. All now go to live pages. Links to redirecting pages fell from 36 to near zero. Thirteen redirect chains were flattened and a stale redirect that sent blog page 6 to page 5 was removed.
- **Calendly:** all 164 cal.com booking links in 118 documents now point to Calendly, so every booking records which page it came from.
- **CTAs:** every post now ends with a link to the best-fitting buyer page and the button says "Book a free AI audit".
- **Merges:** nine overlapping posts became four pages (the agency list absorbed the UAE list, the two n8n/Make/Zapier posts became one, three "what is X automation" posts now redirect to `/what-is-ai-automation`, two CPA posts redirect to the CPA page). Two more consultant posts now redirect to `/ai-consultant`.
- **Hidden from Google:** 12 posts with no buyer demand (n8n builder posts and zero-impression posts). One audited post (`b2b-marketing-automation`) is held back until the 15 November checkpoint because it is only three weeks old.
- **Refreshed (11 posts near page 1):** titles and descriptions matched to the searches that actually reach them, a closing buyer-page link, and takeaway boxes built only from each post's own text. No new facts were added.
- **Brand and trust:** the old agency list ranked Chronexa number one with unverified statistics. It is rewritten honestly (section 4.3).

### 4.3 The keyword map and the demand-led rebuild

I scored all 431 search families on: monthly searches, intent (hiring, cost, comparison, problem, definition), how many independent firms hold page 1 (113 new live search-result checks), keyword difficulty, relevance to what Chronexa sells, and CPC. Each valuable family got exactly one owner page.

| Owner page | Searches it owns | US searches/month |
|---|---|---|
| `/ai-consultant` | ai consultant, ai consulting firm, ai consultant services, ai consultant for small business, ai implementation consultant, generative ai consultant | about 18,600 |
| `/ai-automation-agency` | ai automation agency, automation company, automation services, ai automation services | about 11,000 |
| `/ai-strategy-consulting` | ai strategy consultant, ai readiness assessment | about 2,500 |
| `/ai-integration-services` | ai, system, api and data integration services (api integration is $196 CPC) | about 1,800 |
| `/ai-agent-development` | ai agent development company, custom ai development, chatbot development company | about 1,500 |
| `/business-process-automation-consulting` | business process automation consultant, services, company, process automation consulting | about 900 |
| `/document-processing-automation` | document processing, pdf data extraction, data extraction | about 4,500 |
| `/ai-automation-cost` | ai development cost | about 360 |
| agency guide post | ai automation agencies: how to choose | shared with the agency page |
| n8n vs Zapier vs Make post | n8n vs zapier, make vs zapier, zapier alternatives | about 3,100 |
| n8n pricing post | n8n price, cloud pricing, cost, self hosting | about 6,900 |
| legal process outsourcing post | legal process outsourcing | about 6,600 |
| data entry outsourcing post | data entry outsourcing | about 500 |

**Five posts were genuinely rewritten** (same URLs, new angle, structure, FAQs and links; the full text is in git under `docs/research/seo-forensics-2026-10-06/keyword-map/rewrites/`). The agency guide is now a neutral "how to choose" guide with seven questions to ask, red flags and a shortlist by type, and says plainly that Chronexa is one of the agencies. The n8n comparison uses plan prices I read from each vendor's own site on 8 October. The n8n post is now an n8n pricing guide and is back in Google's index.

**Six service pages were retargeted** (title, direct answer, FAQs) to match the phrasings people actually search.

**Searches I deliberately did not chase:**
- Chatbot services (4,400 each): page 1 is chatbot software vendors. The searcher wants a product.
- Head terms (`ai automation` 9,900, `robotic process automation` 6,600, `workflow automation` 2,900): AI answer boxes and definition intent.
- `zapier cost`, accounts payable automation, AI document processing: vendors own them and we do not sell those products.
- `automation company` (3,600) sits on the agency page, but page 1 is mixed with industrial automation firms, so expect partial value.

**Posts left alone on purpose:** the vertical CPA, RIA and law series (kept as a sales library for outbound email and proposals), the agency pricing post (rank 15, but only 30 searches a month), the Palantir post, and all case studies.

### 4.4 Tracking, so we can finally measure

- **Calendly:** every booking made through a site button carries the page it started on. All 5 bookings since tracking began were attributed (the homepage, a calculator, the Shopify page). None came from a blog post.
- **Baserow:** I added a "Landing Page" column to the leads table, and the contact route now records the submitting page on every lead. Before this, generic forms such as the homepage banner and the chatbot did not say which page produced a lead.
- **Weekly measurement script:** `node scripts/seo/km-measure.mjs` compares the last 28 days of Search Console against the baseline for each owner page.

## 5. The baseline (the numbers to beat)

Search Console, non-brand, 6 July to 4 October 2026. Bookings and revenue attributed to search: zero.

| Owner page | Monthly searches (US) | 90-day impressions | Clicks | Avg position |
|---|---|---|---|---|
| `/ai-consultant` family | about 18,600 | 1,281 | 0 | 35 |
| `/ai-automation-agency` family | about 11,000 | 4,414 | 4 | 41 |
| `/business-process-automation-consulting` | about 900 | 1,592 | 1 | 26 |
| n8n comparison family | about 3,100 | 492 | 0 | 26 |
| `/document-processing-automation` family | about 4,500 | 320 | 0 | 46 |
| `/ai-strategy-consulting`, integration, agent development | about 5,700 | under 20 | 0 | not ranked |

The pattern: we already appear for the big families, but far too low and spread over the wrong URLs. The owner pages exist now to fix exactly that.

## 6. Projection (an estimate, not a promise)

If the core pages reach positions 3 to 5, roughly 360 to 600 clicks a month at about 6 to 10% click rate. At a visit-to-call rate of 1.5 to 3%, that is about 5 to 18 calls a month. At a 15 to 25% close rate on a $3,500 to $10,000 first deal, that is roughly $3,000 to $45,000 a month of new revenue at maturity, which is realistically month 4 to 9, not now. These are assumptions to be replaced with real numbers by about week 6.

## 7. What you need to decide

1. **Google Ads budget and account.** About $30 a day on the same buyer searches. It tells us within 2 to 3 weeks which searches book calls, where organic takes months. I recommend yes.
2. **Accounting and bookkeeping outsourcing** (about 6,400 searches a month, KD 4 to 8, $58 to $108 per click, independents hold page 1). Searchers want to hire an outsourced accountant, so we would pitch "the AI alternative for CPA firms". It is the biggest untouched family. I recommend one test page after about four weeks of data, not now.
3. **A HubSpot consultant page** (880 searches, $88 per click, KD 10, one independent on page 1). Worth it only if CRM work is something you want to lead with.
4. **A dedicated n8n agency page** (790 searches). n8n's own directory leads page 1, so I would not build it yet.
5. **ReserveStudy is named** in one case study's title and web address, which breaks your rule against naming clients. I did not change it because renaming also changes the address. Say the word and I will anonymise it and add a redirect.
6. **The calculator emails** (n8n workflow "Calculator Breakdown Emails") still contain a cal.com link. Changing it means editing a live workflow. Want me to switch it to Calendly?

## 8. What is next, and why

1. **Google Ads** on the owner families, each ad landing on its owner page (after your budget approval). Why: fastest proof of which searches convert, and the click data improves the organic page titles.
2. **Directory listings:** the n8n experts directory, Zapier Experts, Make Partners, Clutch, GoodFirms. Why: on tool-hire searches the directories hold page 1, so being listed there beats trying to outrank them. These need your accounts.
3. **Reddit answers**, about three a week from you or Abhishek under real names. Why: Reddit is in the top 5 for about half of our target searches and ranks for years.
4. **Measure weekly, decide on dates.**
   - **15 Nov 2026:** first real read on the new page and the rewrites. Any September post outside the top 20 for its keyword is hidden or repurposed.
   - **30 Nov 2026:** re-rank the work by what moved.
   - **6 Jan 2027 (week 13):** scale if two or more owner pages are in the top 10 or three or more bookings trace to search. If no page is in the top 20 and ads book nothing, cut organic back to upkeep and move the money elsewhere.
5. **A publishing rule.** No new post unless it has a measured volume of at least 50 searches a month, a live result page showing at least two independent firms in the top 5, a reader who could buy, and an owner page to link to. Why: this is the rule we skipped, and it is how 169 posts happened.

## 9. Known limits and small open items

- Search Console is 2 to 3 days behind, and new pages typically take several weeks to settle. Nothing in this report can show the effect of the changes yet.
- I did not complete a line-by-line read of our articles against the top 3 competitors (the helper hit a usage limit). The conclusions rest on the live search results, the traced visitor journeys and the query data.
- Authority (links from other sites) is not measured. The 90-day test is the cheapest way to answer it.
- The 14 first-wave page illustrations were generated with the full-price image model, which your image-cost rule now forbids. They exist, none will be regenerated, and the new page used the cheap model.
- 11 older service and case-study pages still have titles over 65 characters. Two custody-statement posts target the same keyword (their titles now differ). One file with a false-alarm secret-scanner hit (`sync-portfolio-workflows.mjs`) is uncommitted.
- Another session is editing the homepage, footer and sitemap at the same time. The deploy ships whatever is in the folder, so those changes go live with ours.
- Spend: about $2.90 of DataForSEO credit across the whole project, plus one cheap image. Your DataForSEO balance is roughly $34.

## 10. Where things live (only if you ever need them)

- Live site: chronexa.io. Code and research are in the git repo (latest commits `2bec7e6`, `e7684e2`, `3487414`).
- Detailed research: `docs/research/seo-forensics-2026-10-06/` (this file, the original forensic report, the keyword map with its spreadsheets and the five rewrites).
- Weekly measurement: `scripts/seo/km-measure.mjs`.
