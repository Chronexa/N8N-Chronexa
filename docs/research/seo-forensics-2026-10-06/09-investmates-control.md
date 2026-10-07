# 09 — Investmates as a control case (evidence, 2026-10-06)

Purpose: document *how* organic search works for investmates.io, so the lead investigator can
judge which mechanics transfer to chronexa.io. Facts carry a source; interpretations are
labelled **Observation (confidence: …)**. No recommendations in this file.

## Sources and method

- DataForSEO Labs `ranked_keywords/live` for investmates.io, US (2840) and India (2356), top
  1,000 by estimated traffic (etv); `domain_rank_overview/live` both markets;
  `keyword_overview/live` for service-hire terms (NRI and automation) and for Chronexa's 30
  target keywords; `serp/google/organic/live/advanced` (desktop, depth 10) for 9 queries.
  Pulled 2026-10-06. **Spend: $0.316.** Raw JSON: session scratchpad `agent-investmates/`.
- Live HTML of 5 Investmates articles, homepage, `/nri-financial-advisor-usa`,
  `/repatriation-of-funds-usa-nri`, plus chronexa.io homepage and
  `/blog/tax-workpaper-preparation-automation`, fetched with curl 2026-10-06.
- Chronexa SERP set: `scratchpad/audit/blog-rankings.json` (`serps`, 30 target keywords,
  top-5 domains + AIO flag) from the 2026-10-06 performance audit.
- Internal: repo + memory grep for "investmates". **No Investmates GSC, analytics or CRM data
  exists in this account.** The founder's account of "searched → read → booked" cannot be
  verified with data here; everything about conversion below is inferred from public pages.
- "etv" = DataForSEO's estimated monthly organic visits (volume × CTR curve by position). It
  is a model, not measured clicks. Semrush (2026-09-12) put total traffic at ~17,300/mo;
  DataForSEO puts it higher (US 23,085 + IN 43,835). Treat both as order-of-magnitude.

## 1. Keyword universe

### Domain totals (DataForSEO, 2026-10-06)

| Market | Ranked keywords | Pos 1 | Pos 2–3 | Pos 4–10 | Est. visits/mo | Paid-equivalent value |
|---|---|---|---|---|---|---|
| US | 1,706 | 2 | 16 | 677 | 23,085 | $28,676 |
| India | 728 | 4 | 48 | 384 | 43,835 | $12,777 |
| chronexa.io US (from 00-evidence-log) | 35 | 0 | 0 | 2 | ~27 | — |

Investmates has 54 ranking URLs in US, 69 in India. Traffic is extremely concentrated.

### Top pages by estimated traffic (both markets)

| # | URL | US etv | IN etv | Biggest keyword (vol/mo, pos, KD) | Type |
|---|---|---|---|---|---|
| 1 | /blog/how-to-renew-indian-passport-in-usa | 15,636 | 287 | indian passport renew in usa (22,200, 6, KD 0) — 442 variants ranked | procedure |
| 2 | /blog/repatriable-vs-non-repatriable | 3,206 | 11,640 | repatriable meaning (IN 33,100, **pos 1**, KD 0) | definition |
| 3 | /blog/who-is-nri | 713 | 11,190 | nri meaning (14,800, 4, KD 0); nri full form (90,500, 11) | definition |
| 4 | /blog/what-is-residential-status | 25 | 9,201 | residential status (14,800, 3, KD 0) | definition |
| 5 | /blog/indian-banks-in-usa | 1,375 | 596 | indian banks (8,100, 4, KD 10) | directory |
| 6 | /blog/nre-fd-rates-compared | 207 | 1,014 | sbi nri fd rates (1,300, 4) | comparison |
| 7 | /blog/nro-account | 13 | 1,084 | nro full form (8,100, 5) | definition |
| 8 | /blog/form-15ca-15cb | 2 | 948 | form 15ca and 15cb (2,900, 4) | procedure |
| 9 | /blog/nre-account | 28 | 845 | nre (8,100, 7) | definition |
| 10 | /blog/gold-carry-usa-india | 3 | 846 | indian customs for gold (5,400, 4) | regulation |
| 11 | /blog/form-10f | 3 | 698 | form 10f india (2,900, 5) | procedure |
| 12 | /blog/what-is-oci | 20 | 668 | oci card meaning (4,400, 7) | definition |
| 13 | /blog/how-to-apply-oci-card-usa | 683 | 0 | oci application (12,100, 12, CPC $34) | procedure |
| 14 | /calculator/residential-status-calculator | 0 | 525 | ror status (2,900, 2, KD 25) | calculator |
| 15 | / (brand) | 1 | 486 | investmates (1,600, 1) | brand |
| 16 | /blog/can-nri-buy-agricultural-land-in-india | 1 | 451 | — | regulation |
| 17 | /blog/tax-residency-certificate-nri | 0 | 424 | certificate of residence for tax purposes (3,600, 4) | procedure |
| 18 | /blog/form-13-lower-tds-nri | 2 | 319 | form 13 for income tax (1,300, 3) | procedure |
| 19 | /blog/rnor-status | 0 | 290 | rnor status (1,000, 2) | definition |
| 20 | /calculator/401k-withdrawal-calculator | 282 | 0 | 401k withdrawal calculator (9,900, 32) | calculator |
| 25 | /blog/turbotax-vs-freetaxusa | 209 | 0 | freetaxusa vs turbotax (8,100, 9) | comparison |
| 28 | /blog/monarch-vs-ynab | 158 | 0 | ynab vs monarch (1,600, 5) | comparison |

### Top 50 keywords by estimated traffic (combined US + IN)

Dominated by variants of 5 pages; listed in full for completeness.

| # | Keyword | Mkt | Vol | Pos | etv | CPC | KD | Intent | Page | Type |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | repatriable meaning | IN | 33100 | 1 | 10062 | – | 0 | info | repatriable-vs-non-repatriable | definition |
| 2 | repatriable meaning | US | 14800 | 2 | 2398 | – | 0 | info | repatriable-vs-non-repatriable | definition |
| 3 | residential status | IN | 14800 | 3 | 1440 | – | 0 | info | what-is-residential-status | definition |
| 4 | resident status meaning | IN | 8100 | 2 | 1312 | – | 0 | info | what-is-residential-status | definition |
| 5 | residential status meaning | IN | 8100 | 2 | 1312 | – | 0 | info | what-is-residential-status | definition |
| 6 | n r i meaning | IN | 14800 | 4 | 975 | – | 0 | info | who-is-nri | definition |
| 7 | nri meaning | IN | 14800 | 4 | 975 | – | 0 | info | who-is-nri | definition |
| 8 | nris meaning | IN | 14800 | 4 | 975 | – | 0 | info | who-is-nri | definition |
| 9 | nri full form | IN | 90500 | 11 | 824 | – | 0 | info | who-is-nri | definition |
| 10 | repatriable definition | US | 8100 | 3 | 788 | – | 1 | info | repatriable-vs-non-repatriable | definition |
| 11 | repatriable meaning in hindi | IN | 8100 | 3 | 788 | – | 0 | info | repatriable-vs-non-repatriable | definition |
| 12 | residence status means | IN | 8100 | 3 | 788 | – | 0 | info | what-is-residential-status | definition |
| 13 | indian passport renew in usa | US | 22200 | 6 | 750 | $0.02 | 0 | info | how-to-renew-indian-passport-in-usa | procedure |
| 14 | residential status in income tax | IN | 4400 | 2 | 713 | $0.01 | 0 | info | what-is-residential-status | definition |
| 15 | full form of nri | IN | 90500 | 12 | 679 | – | 0 | info | who-is-nri | definition |
| 16 | indian banks | US | 8100 | 4 | 534 | $5.66 | 10 | nav | indian-banks-in-usa | directory |
| 17 | nris full form | IN | 90500 | 14 | 507 | – | 0 | info | who-is-nri | definition |
| 18 | investmates | IN | 1600 | 1 | 486 | $1.67 | 12 | nav | / | brand |
| 19 | repatriable definition | IN | 1600 | 1 | 486 | – | 0 | info | repatriable-vs-non-repatriable | definition |
| 20 | ror status | IN | 2900 | 2 | 470 | – | 25 | info | calculator/residential-status-calculator | calculator |
| 21 | us indian passport renewal | US | 9900 | 5 | 464 | $1.54 | 1 | info | how-to-renew-indian-passport-in-usa | procedure |
| 22 | full form nri | IN | 90500 | 15 | 462 | – | 0 | info | who-is-nri | definition |
| 23 | income tax resident status | IN | 4400 | 3 | 428 | $0.01 | 8 | info | what-is-residential-status | definition |
| 24 | income tax residential status | IN | 4400 | 3 | 428 | $0.01 | 0 | info | what-is-residential-status | definition |
| 25 | residential status income tax | IN | 4400 | 3 | 428 | $0.01 | 0 | info | what-is-residential-status | definition |
| 26 | n r i full form | IN | 90500 | 17 | 389 | – | 0 | info | who-is-nri | definition |
| 27 | nro full form | IN | 8100 | 5 | 380 | $2.63 | 0 | info | nro-account | definition |
| 28 | indian customs for gold | IN | 5400 | 4 | 356 | – | 0 | info | gold-carry-usa-india | regulation |
| 29 | what is an nri in india | IN | 5400 | 4 | 356 | – | 0 | info | who-is-nri | definition |
| 30 | indian passport renewal at usa | US | 9900 | 6 | 335 | $1.54 | 0 | info | how-to-renew-indian-passport-in-usa | procedure |
| 31 | indian passport renewal from usa | US | 9900 | 6 | 335 | $1.54 | 8 | info | how-to-renew-indian-passport-in-usa | procedure |
| 32 | passport renewal in usa for india | US | 9900 | 6 | 335 | $1.54 | 4 | info | how-to-renew-indian-passport-in-usa | procedure |
| 33 | passport renewal in usa for indian | US | 9900 | 6 | 335 | $1.54 | 0 | info | how-to-renew-indian-passport-in-usa | procedure |
| 34 | renew indian passport in usa | US | 9900 | 6 | 335 | $1.54 | 0 | trans | how-to-renew-indian-passport-in-usa | procedure |
| 35 | usa indian passport renewal | US | 9900 | 6 | 335 | $1.54 | 5 | info | how-to-renew-indian-passport-in-usa | procedure |
| 36 | extend indian passport in usa | US | 22200 | 9 | 333 | $0.02 | 8 | trans | how-to-renew-indian-passport-in-usa | procedure |
| 37 | indian passport extension in us | US | 22200 | 9 | 333 | $0.02 | 4 | info | how-to-renew-indian-passport-in-usa | procedure |
| 38 | indian passport extension in usa | US | 22200 | 9 | 333 | $0.02 | 7 | info | how-to-renew-indian-passport-in-usa | procedure |
| 39 | residential status for income tax | IN | 4400 | 4 | 290 | $0.01 | 0 | info | what-is-residential-status | definition |
| 40 | resident individual meaning | IN | 2900 | 3 | 282 | – | 0 | info | what-is-residential-status | definition |
| 41 | who is an nri | IN | 2900 | 3 | 282 | $0.01 | 0 | info | who-is-nri | definition |
| 42 | who.is nri | IN | 2900 | 3 | 282 | $0.01 | 0 | info | who-is-nri | definition |
| 43 | full form nro | IN | 8100 | 6 | 274 | $2.63 | 0 | info | nro-account | definition |
| 44 | nri kya hota hai | IN | 1600 | 2 | 259 | – | 0 | info | who-is-nri | definition |
| 45 | india passport renewal from usa | US | 9900 | 7 | 253 | $1.54 | 0 | info | how-to-renew-indian-passport-in-usa | procedure |
| 46 | passport renewal in usa for indian passport | US | 9900 | 7 | 253 | $1.54 | 3 | trans | how-to-renew-indian-passport-in-usa | procedure |
| 47 | renewal for indian passport in usa | US | 9900 | 7 | 253 | $1.54 | 0 | trans | how-to-renew-indian-passport-in-usa | procedure |
| 48 | nri's | IN | 33100 | 12 | 248 | $2.66 | 0 | info | who-is-nri | definition |
| 49 | certificate of residence for tax purposes | IN | 3600 | 4 | 237 | $0.66 | 0 | info | tax-residency-certificate-nri | procedure |
| 50 | n r i meaning in hindi | IN | 2400 | 3 | 234 | – | 0 | info | who-is-nri | definition |

### Traffic share by content type (classified by URL, all 1,000 US / 728 IN rows)

| Type | US share of etv | IN share of etv |
|---|---|---|
| Form / procedure (passport, OCI, Form 10F/15CA/13, TRC, how-to-file, PAN) | **71.8%** | 7.2% |
| Definition (NRI, repatriable, residential status, NRE/NRO, OCI, RNOR, 115H) | 17.6% | **80.7%** |
| Comparison / directory (Indian banks in USA, FD rates, TurboTax vs FreeTaxUSA, Monarch vs YNAB) | 8.5% | 4.3% |
| Calculator / tool | 1.2% | 1.2% |
| Regulation / rule change (gold customs, property TDS, visa rules) | 0.7% | 5.2% |
| Service-hire / brand pages | **0.0%** (5 kw, ~5 visits) | 1.1% (almost all = brand query "investmates") |

Other distribution facts:
- Search intent (DataForSEO label), share of etv: US informational 74.7%, transactional 16.2%
  (passport "renew…" phrasing), navigational 7.9%, commercial 1.2%. IN informational 95.0%.
- Keyword difficulty, top 200 rows: median **4** (US), **0** (IN); max 26 / 41.
- CPC, top 200 rows: median **$0**; 102 of 200 (US) and 119 of 200 (IN) have no CPC at all.
  The few high-CPC rows are bank/fees terms (oci application $34, icici branches $14.62).
- Split by subject matter (URL regex): US — money/tax/investment pages 17.5% of etv,
  life-admin/consumer pages (passport, OCI, banks list, budgeting apps) **82.5%**.
  IN — money/tax 66.2%, life-admin 32.6%; 13.8% of IN etv is "full form"/Hindi phrasings.
- **Service-hire demand in the NRI niche is tiny** (keyword_overview, monthly volume):
  US — nri financial advisor 30, nri tax filing services 40 ($28.76 CPC), nri wealth
  management 30, nri tax consultant 20, cross border financial planner 210 ($21.36),
  cross border tax advisor 170 ($25.72). IN — nri tax consultant 70, nri financial advisor 40.
- SERP `nri financial advisor usa` (US): investmates.io **not in top 10**, despite having
  `/nri-financial-advisor-usa`. Top 10 = clarityfinancialconsultancy.com, nfour.in, reddit,
  investnrich.com, creativeplanning.com, nriwealth.com, moneyvesta.com.

**Observation (confidence: high):** Investmates' organic traffic is not service-hire search.
Essentially none of it comes from people looking for an advisor; it comes from people looking
up a definition, a form or a government procedure. Any enquiries it produces must be
generated *after* arrival, by the page and the site, not by the query.

**Observation (confidence: medium):** The single biggest US page (passport renewal, 68% of
US etv) is about a service Investmates does not sell. Its connection to the paid service is
audience (US-based Indians), not problem.

## 2. Audience and the moment of search

Who types the winning queries (inferred from query wording, page topic and SERP neighbours):

| Query family | Who | Trigger moment | Urgency / personal stakes | Distance to Investmates' paid service |
|---|---|---|---|---|
| Form 10F, Form 15CA/15CB, TRC, Form 13, TDS on property sale | NRI with Indian income being taxed/remitted | A bank, buyer or CA asks for the form now; money is stuck or over-withheld | High; own money, deadline | **Very close** — `/repatriation-of-funds-usa-nri` sells exactly this ("We handle FEMA rules, NRO limits, Form 15CA/15CB") |
| Repatriable / NRE / NRO / FCNR | NRI moving money in/out of India | Deciding where to park or how to move funds | Medium–high; own money | Close — repatriation + advisory service |
| Residential status / RNOR / ROR | NRI or returning NRI working out tax exposure; also Indian commerce students (SERP is full of study notes: studycaller, studocu) | Filing or planning a move | High for NRIs; zero for students | Close for NRIs ("NRI Return to India Planning"); none for students |
| NRI meaning / full form | Mostly general Indian public, students; Hindi variants | Curiosity / form-filling | Low | Distant |
| Passport renewal / OCI | Any Indian citizen in US | Passport expiring, travel planned | High but non-financial | Distant (not a service they sell) |
| Indian banks in USA, FD rates, TurboTax vs FreeTaxUSA, Monarch vs YNAB | US-based Indians managing money | Choosing a bank/app | Low–medium | Medium (audience match; app/advisory) |

**Observation (confidence: medium):** The searcher is always an individual making a decision
about their own money or paperwork; searcher = decision-maker = payer. Several query
families (Form 10F/15CA/TRC/Form 13, repatriation) are the literal first step of the
service Investmates sells, so the article is the free version of the paid job.

**Observation (confidence: medium):** A large share of the traffic volume (passport, "NRI
full form", Hindi phrasings, student notes SERPs) is audience-adjacent but problem-unrelated.
The enquiry-producing slice is probably the smaller money-and-forms set (US money/tax pages =
~4,000 est. visits/mo; IN money/tax pages ~29,000 est. visits/mo but India-resident
searchers may not be US NRIs). Not verifiable without their analytics.

## 3. SERP difficulty — Investmates' winning SERPs vs Chronexa's targets

Investmates SERPs (DataForSEO live, 2026-10-06, desktop):

| Query (mkt) | AIO | Investmates in AIO refs | Investmates organic pos | Who else ranks in top 10 |
|---|---|---|---|---|
| repatriable meaning (IN) | yes | **yes** | (not in organic 10 on this pull; Labs says pos 1) | savetaxs, prepclever, DBS Bank, YouTube ×2, passportindia.gov.in, nricaservices, corplawupdates, chittorgarh |
| residential status (IN) | yes | **yes** | not in organic 10 | studycaller, studocu ×2, incometaxindia.gov.in, Economic Times, caclubindia, taxguru, YouTube |
| nri meaning (IN) | yes | **yes** | 4 | DBS, Axis, HSBC AM, Tata AIA, IndusInd, tax2win, Kotak, IDFC First (banks/insurers) |
| form 10f (IN) | yes | **yes** | 4 | incometax.gov.in, incometaxindia.gov.in, SBI, RSM Canada, AKM Global, tax2win, YouTube |
| form 15ca and 15cb (IN) | yes | **yes** | not in organic 10 | eztax, CA firms (caindelhiindia, cavijaysingh), shunya, LinkedIn, taxguru, setindiabiz, e-startupindia, jainam |
| indian passport renewal in usa (US) | yes | no (refs = VFS, embassy, consulates) | not in organic 10 | VFS ×2, consulates/embassy ×4, YouTube, Reddit (pos 6), aapassports |
| indian banks in usa (US) | **no** | — | not in organic 10 | ICICI USA, SBI US, sbnri, goinri, BOI USA, LinkedIn, consulate, Reddit (8), Wise, visament |
| oci application (US) | yes | no (refs = gov + VFS) | not in organic 10 | ociservices.gov.in, VFS ×2, consulates ×3, Facebook, documitra |
| nri financial advisor usa (US) | yes | no | not in top 10 | small NRI advisory firms, Reddit, Creative Planning |

(Labs positions and live SERP positions differ by pull/date/device; Labs = monthly snapshot.)

Chronexa's 30 target SERPs (`blog-rankings.json`, US): AIO on **30/30**; Reddit in top 5 on
**15/30**; LinkedIn in top 5 on **13/30**; repeated vendors in top 5: Salesforce 5, IBM 3,
Airtable 4 (www + support), Gartner 2, Automation Anywhere 2, AWS 2, n8n.io 2, plus SAP,
HubSpot, Google Workspace, Shopify, monday.com, Forbes, HBS. Aug 2026 diagnosis: Chronexa
cited in **0** of 15 commercial AIOs checked (00-evidence-log).

Keyword metrics side by side (DataForSEO keyword_overview, US):

| Metric | Investmates top-200 ranked keywords | Chronexa 30 target keywords |
|---|---|---|
| Median KD | 4 (US) / 0 (IN) | 14 |
| Median CPC | $0 (half have no CPC) | **$31.59** (range $0.21–$115.53) |
| Median monthly volume | (variant clusters 1,000–22,200) | 260; sum of all 30 = 15,770 |
| Intent label | 75–95% informational | 25 of 30 "commercial" |
| Reddit in top 5 | 0 of 8 checked (Reddit at pos 6 and 8 only) | 15 of 30 |
| Who owns top spots | gov portals, banks, CA firms, study-note sites, YouTube | SaaS vendors, Big Tech, analysts, Reddit, LinkedIn |
| Site cited in AIO | yes on 5 of 7 AIO SERPs where it ranks a definition/form page | 0 cited (Aug check) |

Chronexa target terms by keyword itself (my classification): ~12 of 30 name a product
category a buyer would license, not hire — `ai form builder`, `sales automation software`,
`ai tax preparation software`, `ai native crm`, `best ai recruiting software`, `ai market
research tool`, `ai chatbot for ecommerce`, `integration software as a service`, `ai
contract lifecycle management`, `sales document automation`, `ai sales agent`, `ai marketing
agent` (top-5s for these are product vendors: Quickbase, PandaDoc, Salesforce, M-Files…).
Only `ai automation consultant`, `generative ai consulting services`, `n8n consultant` and
`rag as a service` are hire-shaped.

**Observation (confidence: high):** KD alone does not separate the two (Chronexa's targets
are also low-KD, median 14). What separates them is CPC and SERP owners: Investmates'
queries have no advertiser economics and the incumbents (government portals, banks) do not
write explanatory, opinionated, cross-border content; Chronexa's queries carry $20–$115 CPCs
and are owned by vendors with large content teams and by Reddit/LinkedIn.

**Observation (confidence: medium):** Investmates gets cited inside AI Overviews on its
definition/form SERPs (AIO refs list investmates.io on repatriable, residential status, NRI
meaning, Form 10F, 15CA/15CB). The AIO is not blocking it; it is a second placement.

## 4. Article-to-product journey (5 articles fetched)

Articles: `/blog/how-to-renew-indian-passport-in-usa`, `/blog/repatriable-vs-non-repatriable`,
`/blog/who-is-nri`, `/blog/form-10f`, `/blog/what-is-residential-status`.

What every article page carries (identical template on all 5):
- **Global nav "Services" menu** naming six paid services in plain words: "Tax Planning and
  Filing — Tax filing, DTAA optimization, and US-India compliance", "Financial Advisory",
  "Repatriation of Funds — Move money home efficiently with minimal tax impact", "Estate &
  Inheritance Planning", "NRI Return to India Planning", "Retirement Planning". Plus a
  "Features" menu for the app and "Sign in / Get Started Free".
- One-line category statement under the nav: "InvestMates is an AI-powered wealth management
  platform built for NRIs and Global Indians…"
- Visible updated date + breadcrumb (e.g. "NRI Taxation · Updated · September 29, 2026").
- Opening: table of contents → 2–4 sentence intro → **"Key Takeaway"** box with 4–6 bullet
  facts (thresholds, limits, costs) before the body.
- End of article: **author box**, then a fixed CTA block: "Free consultation — Talk to an NRI
  tax advisor. Book a free 15-minute call with our expert advisor who specializes in NRI
  taxes and cross-border financial planning. [Book a free call]" (a button, not a Calendly
  link; opens an on-site flow).
- A second, page-level prompt (sticky/pop-up text in HTML): on tax articles (Form 10F,
  residential status) "Hi NRIs, are you paying more tax than you should? Get a free review of
  your US-India taxes to find missed DTAA credits and any FBAR or PFIC gaps that put you at
  risk. [Speak with NRI Tax Expert]"; on passport/NRI pages "Need help with cross-border
  financial planning? … [Book Free Advisory Call]" / "Talk to an Expert".
- Footer: services list again, "NRI Tools" (DTAA, 401k, Residential Status calculators),
  "Join NRI Community" (WhatsApp group link), CIN U72900TZ2021PTC037733, **ARN 264792**,
  DPIIT number.
- In-body links: to other blog posts and calculators (e.g. residential-status article → the
  residential status calculator and substantial presence test calculator); outbound links to
  official sources (incometax.gov.in, passportindia.gov.in, VFS). **No in-body links to the
  paid service pages were observed**; the service is reached via nav, author CTA and pop-up.
- No price shown on articles. Homepage/service pages state the pricing *model* ("No AUM Fees.
  Ever. Transparent, flat-fee pricing", "Save up to 90% on advisory fees … compared to 1–2%
  AUM fees") but not a number.

Service page evidence (`/nri-financial-advisor-usa`, `/repatriation-of-funds-usa-nri`):
named advisors with credentials (Krishnan Subramanian, "CPA · CA · Enrolled Agent", 30+
years; Shabrish, "RIA · Investment Advisor", 15+ years); "$200M+ Assets managed for NRIs";
four first-person client stories with specific dollar amounts (e.g. "$700K in a 401(k) and
four months before moving to India"); CTAs "Book a free advisor consultation", "Book a free
30-minute strategy call", "Book my free repatriation review". The repatriation page names
the same forms the blog ranks for (Form 15CA/15CB, NRO limits, FEMA).

Trust signals on articles: author byline at top and bio at bottom. Tax articles are bylined
to the CPA/CA/EA (Form 10F, residential status); general pages to "Prakash, CEO & Founder
of InvestMates … leadership experience at Microsoft, HCL, and Accenture". No SEBI RIA number
was found in the fetched HTML (ARN 264792 is shown; ARN is an AMFI mutual-fund distributor
registration — interpretation, not verified here).

Chronexa comparison (one buyer-shaped post, `/blog/tax-workpaper-preparation-automation`,
plus homepage): nav lists use cases by function and industry, an "AI Engines" menu and a
blog menu; homepage H1 "Automate repetitive work with AI." and title "AI Automation Agency
That Builds for You"; post has an in-body link "book a 30-minute scoping call" (Calendly, UTM
tagged), a calculator CTA "Tax Season Capacity Calculator → Or book a 15-min call →", and an
author box (Abhishek Walia, "Chartered Accountant (India) and SEBI-registered investment
adviser"). Calendly bookings traced to /blog/: **0** since 2026-09-17 (00-evidence-log).

**Observation (confidence: medium):** The Investmates conversion path is
problem article → (reader realises the problem is bigger/riskier than the article: DTAA
credits, FBAR, PFIC penalties) → free 15-minute call with a named, credentialed person
whose name is already on the article. The article does not argue for the service; the nav,
byline and pop-up do the selling, and the reader already knows the category ("NRI tax +
wealth help") because the query itself established they are an NRI with a money problem.

**Observation (confidence: high):** Category clarity is immediate on Investmates (every page
names the six services and the audience "NRIs"). The reader's identity (NRI) is the
segmentation; no qualification step is needed.

## 5. Content style and information gain

Specifics found in the fetched articles (sample):
- Passport: "$146 in total ($125 government passport fee, which already includes the $2 ICWF
  contribution, plus the $19 VFS service charge)"; jumbo $196; "$146 to $321"; "3-4 weeks"
  normal, "3 working days" Tatkal; VFS replaced CKGS "November 2020"; ICAO photo rule
  "September 2025"; DD/MM/YYYY date-format mistake.
- Residential status: Section 6, Income Tax Act 1961; 182-day and 60-day tests; "From April
  2026, NRIs earning more than ₹15 lakh from Indian sources face a stricter 120-day
  threshold"; FEMA penalty for not converting savings to NRO/NRE.
- Form 10F: e-filing mandatory after "July 16, 2022"; "Form 41 for tax year 2026-27 onward";
  can file without PAN; EVC vs DSC verification; worked example "standard tax rate might be
  20%, but under the India-US DTAA, this could reduce to 15%". One unsourced stat: "About 80%
  of DTAA claim rejections happen because of documentation mistakes."
- Repatriable: NRO outward cap "USD 1 million per financial year"; NRO TDS "30% plus
  surcharge and cess"; comparison table repatriable vs non-repatriable.
- Length: 2,740–6,413 words (text incl. template). Freshness: published Aug 2025–Mar 2026,
  **modified 2026-09-28 to 2026-10-06** (passport and repatriable articles modified on the
  day of this pull).

**Observation (confidence: medium):** Information gain is procedural, not opinion: exact
fees, day counts, form numbers, deadlines, portal steps, and US-India interaction (DTAA,
FBAR, PFIC) that the government page does not explain and the bank page does not cover.
First-hand expertise is signalled by the practitioner byline on tax topics. Pages are
kept current to rule changes (Form 41, April 2026 threshold).

## 6. Market economics, side by side

Facts are sourced; estimates are marked **(est.)**.

| Dimension | Investmates | Chronexa |
|---|---|---|
| Who searches | Individual NRIs / Indian-origin people in US (and Indians in India) | Mix: ops/IT staff researching tools, agency owners, students, LLM-generated prompts (00-evidence-log: 22% of visible blog query impressions are machine-written prompts) |
| Searcher = buyer? | Yes — person with the problem pays (est., high confidence) | Often not — business purchase, multi-person decision (est.) |
| Size of searcher pool | US Indian-diaspora population in the millions (est., public census order of magnitude; not pulled this session). Single queries: 3,600–33,100/mo | 30 targets sum to 15,770/mo US; median 260/mo per term |
| Trigger | Discrete life/tax event with a form or deadline (passport expiry, bank asks for Form 10F, remittance, move back to India, annual filing) | No external trigger or deadline; chronic inefficiency |
| Problem frequency | Recurring for the same person (annual tax/FBAR, every remittance, multi-year return-to-India plan) (est.) | One-off project per firm (est.) |
| Ticket / pricing visible | Flat fee, "No AUM fees", no number shown; free 15/30-min call | Fixed offer $3,500 + optional $1,200/mo (revenue-sprint memory, 2026-08-10); site CTA "Book a discovery call" |
| Buying cycle | One call, one decision-maker (est.) | Scoping, multiple stakeholders, vendor comparison (est.) |
| Service-hire search demand | Tiny: 20–210/mo per term | Larger but expensive: ai automation agency 4,400 ($19.48), ai consulting services 2,400 ($106.49), ai agent development company 720 ($33.58), ai automation services 720 ($38.91), intelligent document processing 1,600 ($33.76), business process automation consultant 170 ($44.61), workflow automation consultant 70, n8n consultant 70 |
| Advertiser pressure on informational terms | Near zero (median CPC $0) | High (median CPC $31.59 on targets) |
| Who else writes the explainer | Government portals (procedural, not explanatory), banks (product-led), small CA firms, study-note sites | SaaS vendors, Big Tech, analysts, Reddit threads, LinkedIn posts |
| Fit between top-ranking topic and paid service | Form 10F / 15CA / repatriation / residential status = the first step of the paid service | Most target terms describe software categories or general concepts, not the $3,500 document pipeline |
| Referring domains (Semrush 2026-09-12) | ~374 | 129 |

## Mechanics that differ (factual list)

1. Investmates' traffic comes from definitions (IN 80.7%) and forms/procedures (US 71.8%);
   service-hire and brand pages earn ~0% (US) and 1.1% (IN, almost all the brand query).
2. Investmates does not rank top 10 for its own service query (`nri financial advisor usa`),
   and NRI service-hire terms have 20–210 searches/mo. Its organic enquiries, if any, are
   created on-site after an informational visit.
3. Investmates' winning keywords have median KD 0–4 and median CPC $0; Chronexa's 30 targets
   have median KD 14 and median CPC $31.59.
4. Investmates' SERP neighbours are government portals, banks, CA firms and study-note sites;
   Chronexa's are SaaS vendors, Big Tech, analysts, Reddit (15/30 top-5) and LinkedIn (13/30).
5. AI Overviews appear on both sets; Investmates is cited inside 5 of the AIOs checked,
   Chronexa was cited in 0 of 15 in August.
6. Investmates' queries name a specific form, rule, threshold or government process tied to
   a dated event; Chronexa's targets name a software category or concept with no deadline.
7. On Investmates the searcher's identity (NRI) defines the customer; on Chronexa the query
   does not reveal firm size, industry or buying role.
8. Investmates' searcher is the payer of a personal-finance service; Chronexa's searcher is
   usually an employee researching a business purchase.
9. Investmates' article topics (Form 15CA/15CB, repatriation, residential status) are the
   same tasks its service pages sell; most Chronexa target topics are not the task its offer
   sells.
10. Every Investmates page shows the same six named services in the nav, a one-line
    "built for NRIs" statement, an "Updated" date, a Key Takeaway box, a credentialed byline,
    and one consistent free-15-minute-call CTA plus a problem-specific pop-up
    ("missed DTAA credits… FBAR or PFIC gaps"); no prices, no in-body service links.
11. Investmates' tax articles are bylined by a practising CPA/CA/EA whose name and photo
    also appear on the service pages; the call is with that same kind of person.
12. Investmates articles carry exact fees, day counts, form numbers and rule-change dates
    and were updated within the last 10 days; they cite official portals.
13. Investmates' traffic is heavily concentrated: one page (passport renewal) = 68% of US
    est. traffic; four pages = ~80% of IN est. traffic; much of the volume (passport, NRI
    full form, Hindi phrasings, student-notes SERPs) is audience-adjacent but not tied to a
    paid service.
14. Investmates' conversion claim (searched → read → booked) is founder-reported; no
    analytics, GSC or CRM data for investmates.io was available to verify it.
