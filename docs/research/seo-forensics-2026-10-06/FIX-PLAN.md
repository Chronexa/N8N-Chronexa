# Chronexa organic growth — the aggressive fix plan (2026-10-07)

## Context
The forensic report (`docs/research/seo-forensics-2026-10-06/REPORT.md`) found:
- **Strangers barely find us.** Organic gives us ~13 non-brand clicks per quarter. Buyers see us 22,700 times a quarter, but 87% of those views are on page 3 or deeper.
- **We rank nowhere that matters.** Chronexa is on page 1 for 0 of the 72 buyer searches we checked.
- **The blog has never produced a traceable call.**
- **The market is still there.** US "hire a firm to build automation/AI" searches total about 18k a month, plus about 10k in outsourcing wording. Small firms hold most page-1 spots.

The goal: turn search into booked calls within 90 days. We use every legitimate, high-leverage move, not just "write more blogs". This plan replaces the "keep publishing" path. Everything below is measured on **booked calls and pipeline**, not impressions.

**Two kinds of hard line, and why.** First, anything Google treats as spam can get the whole domain demoted: bought links, private link networks, AI page farms, fake reviews. Second, anything that would burn trust with a buyer who checks: invented client numbers, sock-puppet accounts. Everything else is on the table, including paid search, directories, Reddit and buying distribution.

---

## The money math (projection, so we know what we're chasing)
Assumptions, labelled as projections. They are to be replaced with real numbers by week 6.
- **Clicks:** a page at positions 3–5 gets ~6–10% of searches. The 4 core pages target ~6,000 searches/mo combined, so roughly 360–600 clicks/mo once ranked.
- **Clicks to calls:** buyer-intent pages convert visit→call at 1.5–3%, so roughly 5–18 calls/mo.
- **Calls to revenue:** close rate 15–25% × average first deal $3,500 (document pipeline) to $10k (custom build), so roughly **$3k–$45k/mo new revenue** at maturity (month 4–9).
- **Paid search** on the same terms buys this answer in weeks rather than months (see Move 2).

---

## Move 1 — Build the 5 money pages (weeks 1–6) · highest leverage
One page owns a whole family of searches (the automaly.io / ProsperSpark pattern). Each page needs:
- a first-screen line saying who it's for and what you get
- a price band and timeline
- real proof (ReserveStudy, our own production pipelines, the "silent failure" incident)
- one call to action
- an FAQ that answers the People Also Ask questions
- a "how we're different" block written for the Google AI answer box to quote

| Page (URL) | Owns these searches (US vol/mo · CPC) | Who's on page 1 today | Why we can win |
|---|---|---|---|
| `/ai-automation-services` | ai automation services 720 · $39; ai automation company 390 · $30; ai automation agency services 170; automation services 1,000 · $44; automation agency 480 | agent.nexus, effectivesoft, theaiautomationagency.ai, Reddit, cgi | 3–4 of the top 5 are small firms |
| `/ai-integration-services` | ai integration services 720 · $46; system integration services 390 · $26; api integration services 320 · $196; data integration services 320 | oneio, eleks, spec-india, Reddit | 4 of the top 5 are small firms |
| `/ai-agent-development` (restore; currently a 308) | ai agent development company 720 · $34; ai agent consultant 140 · $49; custom ai development company 390 · $77; chatbot development company 210 | masterofcode, techavidus, softteco, leewayhertz | No big-tech wall |
| `/business-process-automation-consulting` (rebuild the existing page, now at pos 22–28) | process automation consulting, bpa services/company/consultant (170–260 each · $22–47), workflow automation consultant 70 · $38 | automaly, cbh, bpaco, msquare | We already have impressions (2,496 per quarter) |
| `/ai-automation-cost` | ai development cost 320; ai automation agency pricing; cost to build ai agent; ai consultant cost | coherentsolutions, azilen, masterofcode: 5/5 small firms | Nobody publishes real prices. We do ($3,500 pipeline, real build bands) |

Supporting fixes for these pages:
- Point every related blog post's in-body link at the matching money page. 45 buyer searches are currently split across our own pages.
- Add the 5 pages to the nav, footer, sitemap and `llms.txt`.

**Critical files:**
- `website/src/app/<slug>/page.tsx` (follow the bespoke studio pattern, per memory `project_solution_pages_studio_rebuild`)
- `website/src/lib/blog-links.ts` (relatedServices, CALC_RULES, articleCta)
- `website/src/lib/site.ts`
- `website/next.config.ts` (remove the `/ai-agent-development` redirect)
- sitemap route

## Move 2 — Paid search on the same terms, starting week 1 (the shortcut)
Organic takes 3–6 months; Google Ads answers "do these searches book calls?" in 2–3 weeks.
- **Exact-match campaign** on the ~25 hire terms above, US only, ₹/$ budget ~$30/day. Land each ad on its money page (the build order puts the first 3 pages live by week 2).
- **Why:**
  - Real conversion data on which keywords produce calls; then pour SEO effort only into the winners.
  - Real ad copy and CTR data to write the organic titles.
- **Kill rule:** stop any keyword that spends 3× the target cost per call with no call.
- **Retargeting:** run Meta and LinkedIn ads at everyone who reads a blog post or money page (the Meta pixel already exists), with the $3,500 "send us 10 documents" offer. This turns the existing ~4,000 blog views per quarter into a second chance at a call.

## Move 3 — Get onto the pages that already rank (weeks 1–3, nearly free)
On many buyer searches, page 1 is directories and communities, not agencies. If we can't outrank them, we get listed inside them.
- **experts.n8n.io** (top 3 for "n8n consultant" and "n8n agency"): apply to the n8n Expert Partner programme.
- **Zapier Experts** directory and **Make Partners**: apply. They hold top-5 spots for zapier/make hiring terms.
- **Clutch, GoodFirms, DesignRush, Sortlist, TechBehemoths:** create full profiles with real reviews from real past clients only. Ask ReserveStudy and anyone we've delivered for. These sites rank for "top AI automation agencies [city/industry]" and get cited in AI Overviews.
- **Anthropic partner directory:** confirm the listing. The homepage claims "Official Anthropic Partner", so make it verifiable.
- **Upwork agency profile:** already active for Shopify. Add an AI automation specialised profile.

## Move 4 — Become the source AI answer engines quote (weeks 2–8)
65 of the 72 buyer searches show a Google AI Overview. 91% of what those overviews cite comes from independent firms, and we are cited 0 times.
- **Publish original data nobody else has.** These pieces earn citations and links:
  1. "We sent 11,458 automated outbound emails. Here's every number." (already partly written in `/blog/ai-sales-agent`; make it a standalone research page with charts)
  2. "AI automation agency pricing, 2026: what 50 agencies actually charge". Gather pricing from public sites, ad copy, directories and Upwork. A listicle with real data is the most-cited format.
  3. "The silent-failure audit: 12 ways production automations lie about succeeding", drawn from our own n8n incidents.
- **Format every money page and research page so an answer engine can quote it:** a one-sentence definition, a numbered process, a price table, a FAQ, and an "updated" date.
- **Track citations monthly** with the existing `scripts/seo/study-aio.mjs` (~$0.20/run).

## Move 5 — Reddit and community distribution (ongoing, founder accounts, disclosed)
Reddit is in the top 5 on 15 of our 30 target searches, and #1 for "ai automation agency".
- Ankit and Abhishek answer real questions in r/n8n, r/automation, r/smallbusiness, r/Accounting, r/taxpros and r/LawFirm, under their real names with Chronexa disclosed in the bio. Give genuine, specific answers, and link our research only where it actually answers the question.
- Target 3 high-quality answers a week. Threads that rank on Google bring referrals for years.
- An existing n8n workflow (Reddit keyword alerts → Slack, see `/n8n-portfolio/reddit-keyword-alerts`) can surface buyer-intent threads daily. Reuse it.
- **No sock-puppets or upvote buying.** Reddit bans the domain, and Google then loses the links.

## Move 6 — Links that come from being useful (weeks 3–12)
- **Free tools are link magnets.** We have 3 calculators. Add 2 that people search for:
  - "AI automation ROI calculator" (searched; "ap automation roi calculator" already gives us 123 impressions)
  - "n8n vs Zapier vs Make cost calculator" (comparison searches total ~2,000/mo)
  - Give each an embed code so other sites link back.
- **Trade-press guest pieces and quotes:**
  - CPA Practice Advisor, Accounting Today, Journal of Accountancy blogs, Above the Law, Lawyerist, Kitces (RIA), and the n8n community blog.
  - Answer journalist requests on Qwoted / Featured / Help a B2B Writer three times a week.
- **Podcast tour:** 6–8 accounting, legal-ops and automation podcasts. Each one gives a link plus a buyer audience.
- **Integration and partner pages:** ask the tools we build on (n8n, Airtable, Baserow, Retell) to feature our case studies. Vendors link to partners.
- **Unlinked mentions:** any mention of Chronexa without a link gets a polite request to add one.

## Move 7 — Fix the leaks (week 1, required before driving any traffic)
1. **Homepage proof links:** fix the 404s (`/case-studies/ai-automation-tax-workflow-cpa-case-study`, `/case-studies/how-leading-law-firm-automated-regulatory-intelligence`), which are also linked from `/cpa-tax-document-automation`. Source: `website/src/components/WorkShipped.tsx`, `Evidence.tsx`, `lib/services-content.ts`.
2. **Make `/document-pipeline` visible:** put it in the nav, footer and sitemap, and make it the default end-of-article offer for document and agency-shopping posts.
3. **One booking system:** Calendly, with the page path on every booking. Replace the cal.com links in 77–118 post bodies via a Sanity script (the fix list is in memory `project_calcom_links_left_in_place`). This needs Ankit's OK, because he chose to leave them on 08-17.
4. **Track every call-to-action click:** add the page path to `book_cta_click` in ChatWidget, LeadForm and ExitIntent. Store the landing-page URL on every Baserow lead row. Add "How did you find us?" to the Calendly form.
5. **One story on price and timeline sitewide:** $3,500 entry, then a fixed-scope build band. Remove the outbound-engine contradiction (`/blog/ai-sales-agent` vs `/ai-sales-outreach-engine`).
6. **Link hygiene:**
   - 130 posts' related-service links go through redirects. Fix `blog-links.ts` FALLBACK and the label bug ("n8n-automation-services →").
   - 3 blog filter pages return 404.
   - /blog/page/6 is in the sitemap but redirects.
   - "Keep reading" only draws from the 60 newest posts.

## Move 8 — Content refresh, merge and prune (weeks 2–6)
From `content-inventory-triage.csv`:
- **Update — near page 1, so push them up:**
  - `tax-workpaper-preparation-automation` (pos 10.6; "automate tax workpaper preparation" 691 impressions/qtr; merge its traffic intent into `/cpa-tax-document-automation`, which must mention workpapers)
  - `ai-automation-agency-pricing-what-you-get` (pos 11, 5,745 impressions; fold it into `/ai-automation-cost`)
  - `sec-marketing-rule-compliance-automation`
  - `manual-invoice-processing-cost-per-invoice-automation`
  - `productized-automation-vs-custom-development…`
  - `palantir-alternatives…` (re-aim at the mid-market searcher; keep it)
- **Merge:**
  - All agency listicles (b2b-saas, UAE, plus the redirected USA/UK/NY posts) into one honest "Best AI automation agencies 2026 (and how to choose)" page. Disclose that it's our list, and show Chronexa as an option with real criteria rather than a self-awarded #1.
  - The two Make/n8n/Zapier posts into one.
  - The 3 "what is X automation" glossary posts into one.
- **Noindex (14 posts):** n8n builder and docs posts, and posts with zero impressions.
- **Repurpose (102 vertical posts):** stop judging them on search. Turn them into a sales library linked from outbound emails, proposals and call follow-ups. Each gets a matching money-page call to action.
- **No new blog posts** unless they pass the gate in Move 10.

## Move 9 — The narrow CPA wedge (weeks 6–12, only if Moves 1–2 show calls)
Our only buyer-shaped organic wins are very specific tool posts: UltraTax at pos 6.6 with 6 clicks, account transfer paperwork at pos 7.4.
- Build 4–6 "bridge" pages named after the exact tools a CPA firm already owns:
  - UltraTax → TaxDome
  - CCH Axcess workpapers
  - SafeSend + Karbon
  - QuickBooks → UltraTax import
  - Each one: the problem, how we connect them, the price, a call to action.
- Small searches, but almost every searcher is a buyer, and the pages double as sales assets.

## Move 10 — The publishing gate (permanent)
Enforce it in `.claude/skills/blog-seo-strategy/scripts/lint-blog-draft.mjs`: no page or post ships unless its frontmatter records:
1. **The keyword family**, with measured volume ≥ 50 (or a written reason).
2. **A SERP check** saved: at least 2 independent firms in the top 5.
3. **A reader who could buy.**
4. **The money page it feeds.**
5. **The ad keyword that proved it converts**, where one exists.

## Open decisions (Ankit), written into the plan as assumptions
- **Outsourcing wording.** Assumed **test it with one page**: `/data-entry-outsourcing-services`, positioned as "the AI alternative to outsourcing" (data entry outsourcing 480 · $55; bookkeeping outsourcing 1,600 · $108). Paid search decides whether it books calls before we build more.
- **Lead offer.** Assumed the **$3,500 document pipeline is the entry offer** on all money pages, with a custom build as step two.
- **Self-ranked listicles.** Assumed **merge and disclose**, as in Move 8.

---

## 90-day calendar
- **Week 1:** Move 7 leak fixes; directory applications (Move 3); Google Ads account and tracking.
- **Weeks 1–2:** `/ai-automation-services`, `/ai-automation-cost`, `/ai-agent-development` live; ads switched on.
- **Weeks 2–4:** `/ai-integration-services`, rebuilt BPA page, outsourcing test page; merges and noindexes (Move 8); first research piece (outbound post-mortem).
- **Weeks 3–8:** pricing study; ROI and cost calculators; Reddit cadence; 3 guest pieces and 4 podcasts pitched.
- **Week 6 checkpoint:** ad data shows which terms book calls. Re-rank the remaining work around those terms.
- **Weeks 6–12:** CPA bridge pages (only if week 6 shows calls); refresh money pages from ad and organic data.
- **Week 13 decision:**
  - **Scale** if ≥2 money pages are in the top 10 and ≥3 calls are attributed to search (paid or organic).
  - **Shrink to hygiene** if no page is in the top 20 and ads book nothing.

## Scorecard (weekly; replaces impressions and post counts)
1. Booked calls by landing page and source (Calendly utm_content, the "how did you find us" answer, Baserow page URL).
2. Ads: cost per call by keyword.
3. Rank of each money page for its keyword family (DataForSEO `ranked_keywords`, ~$0.02).
4. Non-brand buyer clicks (GSC, machine prompts excluded; extend `scripts/seo/weekly-tracker.mjs` with the classifier from the forensic study).
5. Answer-engine citations won (monthly, `study-aio.mjs`).
6. Referring domains gained, from directories, press, podcasts and tools.

## Verification
- **Before any traffic goes live:**
  - Every money page returns 200, is in the sitemap, and has a first-screen offer.
  - A test booking from each page shows the right `utm_content` in Calendly.
  - The homepage proof links resolve.
- **Week 1:** a GSC URL Inspection request for each new page; confirm it is indexed within 7 days.
- **Weekly:** run the scorecard. At week 6 and week 13, write the decision into `docs/research/seo-forensics-2026-10-06/` and memory.
