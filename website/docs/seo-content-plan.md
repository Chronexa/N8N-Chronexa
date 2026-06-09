# Final SEO Content Plan — chronexa.io

_2026-06-08. The execution plan for the enterprise-AI repositioning. Companion to [seo-repositioning-strategy.md](./seo-repositioning-strategy.md), [seo-forensic-audit.md](./seo-forensic-audit.md), [backlink-playbook.md](./backlink-playbook.md)._

## Why

The site is *seen but not clicked* (89.6k impressions → 0.2% CTR) and ranks **informational** content that pulls developers/researchers, not buyers. Repositioning to **secure, custom enterprise AI for regulated industries**. Inputs: Automaly's Semrush profile (386 kw / ~431 visits — engine is the "ai automation services/consultant/agency" cluster + a Pipedrive niche; modest absolute volume), a 58-keyword buyer list (US mid-market, heavy on tool-specific terms), and our own GSC (already ranking pos 1–13 for regulated-buyer queries with no pages built).

## Keyword model — 3-layer barbell

- **Layer A — Niche moat (priority, win now):** tool-specific / nuanced vertical terms (`iManage workflow automation`, `CCH Axcess automated data ingestion`, `K-1 tax form OCR extraction`, `Form ADV amendment automation`, `Affinity CRM workflow automation`). Low competition, high CPC/intent, winnable at our authority, impossible for competitors to out-experience.
- **Layer B — Category / consideration (steady):** `ai automation agency/services/consultant`, `[vertical] AI automation company`, comparison/alternative. Gets us on the 2–3-quote shortlist; needs authority, modest volume.
- **Layer C — Decision-maker + trend:** `build vs buy AI for [vertical]`, `AI [vertical] ROI/cost`, `is AI safe for [regulated] data`, `AI in [legal/finance] 2026`. Speaks to buyers, builds topical authority.

**Operating rules:** prioritize by **CPC not volume** · ~20 qualified visits/article is success · **cluster by SERP overlap** · mine **People-Also-Ask** for H2s + FAQ · US mid-market.

## Architecture (depth-first: Legal, Tax/CPA, Financial+Wealth, M&A/PE)

Each vertical = pillar (done) + SERP-clustered **tool pages** (new `ServiceContent` entries on the existing `UseCaseArticle` system, registered as `integration` kind so they don't bloat the nav) + decision-maker **blogs** (Sanity). Internal links: each tool page ↔ its pillar (`related[]`) ↔ its case study.

- **Legal** `/legal-due-diligence-automation` → tool pages: iManage & NetDocuments · contract-review software · matter-intake & conflict-check · regulatory/SEC filing monitoring.
- **Tax/CPA** `/cpa-tax-document-automation` → tax-software AI integration (CCH Axcess/ProConnect/UltraTax/Drake) · K-1 OCR extraction · Hubdoc→QuickBooks & Xero reconciliation · SafeSend & Karbon.
- **Financial + Wealth/RIA** `/financial-services-automation` → Redtail & Wealthbox for RIAs · Form ADV & SEC marketing-rule compliance · AI co-pilot for financial advisors (meeting-prep + Orion reporting). Quant/equity-research stays in the pillar (NDA).
- **M&A/PE** `/vc-pe-crm-automation` → Affinity CRM automation · pitch-deck parsing · AI term-sheet analysis · portfolio-company monitoring.

**Parked (later track):** Insurance, Real Estate/Property, Voice AI/Healthcare, B2B Outbound — existing pages stay; expand after the 4 priorities prove out.

## Content model (every page & post)

Decision-maker framing: **problem in the buyer's words → ROI/cost → risk & security (the deal-decider) → proof (real case study) → CTA.** Mine PAA for H2s + FAQ. First-hand depth only — no prompt-and-publish.

## Sequence

1. **Phase 1 — done:** 5 pillars repositioned, homepage reframed, templated case studies cut.
2. **Phase 2:** Legal + Tax/CPA tool pages + decision-maker blogs.
3. **Phase 3:** Financial/Wealth + M&A/PE tool pages + blogs.
4. **Phase 4:** Layer B category/comparison + `/us-ai-automation-agency` reframe.
5. **Ongoing:** backlinks (authority ceiling) + measurement.

## Measurement

Baseline the 58 kw + Automaly's category terms in Semrush now (CPC, position, KD); re-check monthly. **Success (60–90 days):** Layer-A tool terms top-5 in weeks; category terms climbing with authority; **bookings attributed to vertical pages in Amplitude** (`book_cta_click` by page) — this is a leads play, not traffic vanity.
