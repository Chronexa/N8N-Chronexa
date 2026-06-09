# Chronexa — SEO Strategy & Roadmap (master document)

_Last updated: 2026-06-08. This is the single source of truth. The four companion docs below are deep-dives:_
- [seo-forensic-audit.md](./seo-forensic-audit.md) — the evidence/diagnosis
- [seo-repositioning-strategy.md](./seo-repositioning-strategy.md) — positioning rationale (early snapshot)
- [seo-content-plan.md](./seo-content-plan.md) — the phased content plan (early snapshot)
- [backlink-playbook.md](./backlink-playbook.md) — the off-page program

---

## 1. The diagnosis (why we did all this)

A forensic audit of chronexa.io (live GSC, not theory) found the site is **seen but not clicked**: ~89,600 Google impressions in 90 days → **177 clicks (0.2% CTR)**. The flagship post had 34,264 impressions and 5 clicks. Two root causes:
1. **Wrong traffic** — the site ranked for *informational n8n* queries that attract developers/researchers, not buyers. The commercial/vertical pages got almost no impressions.
2. **Authority is the ceiling** — Semrush confirms a very low domain authority (Authority Score ~6, ~26 referring domains, most near-worthless, 69% nofollow). Low authority is why pages stall at position 7–8 and never reach the top 3 where clicks live.

**Implication:** content and positioning were fixable on-page (done — see §6); the ranking ceiling is off-page (backlinks — see §7), which is the remaining lever.

## 2. Positioning

Chronexa is **not an n8n automation shop** — that's quick-cash filler. The real business is **custom, secure enterprise AI for regulated industries** (finance, legal, tax, dealmaking): agentic systems, RAG/knowledge engines, secure in-environment deployment, applied ML/quant. The whole site now leads with this; **n8n is positioned as an explicit lower-risk "wedge,"** not the brand. Unifying message: _"secure, auditable AI built inside the environment your firm controls."_

## 3. The keyword model — a 3-layer barbell

- **Layer A — Niche moat (priority, win now):** tool-specific, high-intent, low-competition terms (iManage automation, CCH Axcess, K-1 OCR, Form ADV, Affinity, etc.). Winnable at our authority; competitors can't out-experience us.
- **Layer B — Category / consideration:** the "AI automation agency / consultant" cluster (where Automaly ranks) + comparison/buyer-guide. Gets us on the 2–3-quote shortlist; needs authority, so it compounds over time.
- **Layer C — Decision-maker + trend:** build-vs-buy, ROI, "is AI safe for [regulated] data," "AI in [industry] 2026." Speaks to buyers, builds topical authority.

**Operating rules:** prioritise by **CPC, not volume** · ~20 qualified visits/article is success · cluster by SERP overlap · mine People-Also-Ask for FAQs · target US mid-market ($2M–$100M).

## 4. Site architecture (two axes + capabilities)

- **Services = capabilities (what we build)** — a focused set of **8**, signature-led so the menu expresses the moat, not generic parity:
  - *Signature:* Agentic AI Systems · RAG & Knowledge Engines · Document Intelligence · Secure & Compliant AI Deployment · Applied ML & Data Science
  - *Foundational/parity (SEO):* System & Data Integration · Workflow Automation (n8n, the wedge) · AI Readiness Assessment
- **Use Cases = who we serve** — *by function* (Finance, Operations, Customer Support, HR, Sales & Revenue, Marketing) and *by industry* (Legal, CPA/Accounting, Insurance, Financial Services, VC/PE, Property Mgmt, Pharma, D2C).
- **Tool/integration pages (Layer-A moat)** — 15 deep pages targeting tool-specific keywords, each linked up to its vertical pillar and (where relevant) a case study.
- **Blog** — Layer-C decision-maker + Layer-B category content, auto-linked to the right pillar.

## 5. Content model (the quality bar)

Google's 2026 updates reward **information gain** and **first-hand experience**; generic AI content is penalised. Every page/post follows: **problem in the buyer's words → ROI/cost → risk & security (the deal-decider) → proof (real case study) → CTA**, mining PAA for FAQs. Signature service pages are built from a **dedicated deep-research pass** (real architectures, named tools, honest trade-offs) so they read as genuine expertise. Case studies are **anonymized** (NDA) — the value is depth + search intent, not the client name.

## 6. What's built & live (as of 2026-06-08, all deployed to chronexa.io)

- **5 vertical pillars** reframed deep: Legal AI, Tax/CPA AI, Financial Services & Quant, M&A/PE, and Document Intelligence (regulated-industries).
- **8 Services** (capabilities) — incl. 4 new deep-research-backed signature pages (Agentic AI, RAG & Knowledge Engines, Secure & Compliant AI Deployment, Applied ML & Data Science).
- **15 vertical tool pages** — Legal (4), Tax/CPA (4), Financial/RIA (3), M&A/PE (4).
- **10 blogs** — 8 decision-maker + 2 category/comparison.
- **6 case studies** (anonymized); 2 templated ones cut + 301'd.
- **Site-wide reframe** — homepage hero, Solutions hub, agency page, About, llms.txt, page titles, Organization schema — all purged of the old "n8n-first / 30–60 days" positioning.
- **Technical SEO** (from the audit fixes): page-specific Twitter cards, founder LinkedIn in Person schema, case-study heading normalization, real sitemap dates, CTR-optimized metas on top posts.
- Shipped across ~8 verified deploys; ~213 build pages.

## 7. Roadmap — what's left

1. **Off-page / authority (the real lever).** Backlink program per [backlink-playbook.md](./backlink-playbook.md): free **Ahrefs Webmaster Tools** + GSC Links + Bing WMT for data; build links via the **n8n ecosystem** (templates, expert listings), **directories** (Clutch/G2/Capterra/Crunchbase), and **digital PR** (Featured.com/Connectively). This is what moves rankings now that content is done.
2. **Measurement baseline.** Pull the ~58 target keywords + Automaly's terms into **Semrush** (CPC, position, KD); track monthly. **Success @ 60–90 days:** Layer-A tool terms reaching top-5; category terms climbing with authority; and **bookings attributed to vertical pages in Amplitude** (`book_cta_click` by page) — this is a *leads* play, not traffic vanity.
3. **Parked verticals** (Ankit's call, not in scope yet): Insurance, Real Estate/Property, Voice AI/Healthcare, B2B Outbound — existing pages stay; expand after the four priority verticals prove out.

## 8. Open inputs needed from Ankit
- **Semrush CPC/KD export** of the 58 keywords (to finalise priority order + measurement baseline).
- Decision on parked verticals when ready to expand.

## Governance
- Branch/deploy: `website/` is its own repo; push to `main` auto-deploys to Vercel. **Never push/deploy without Ankit's say-so.**
- New Sanity blog posts use `post-<slug>` (hyphen) IDs; new posts render on-demand (don't request a blog URL before its Sanity doc exists, or a 404 caches for up to an hour).
