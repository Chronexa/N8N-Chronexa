# SEO Repositioning & Keyword Architecture — chronexa.io

_Date: 2026-06-08. Decision owner: Ankit. Companion to [seo-forensic-audit.md](./seo-forensic-audit.md) and [backlink-playbook.md](./backlink-playbook.md)._

## The decision

Chronexa is **not an n8n automation company** — that's just quick-cashflow work. The real (and high-value) business is **bespoke enterprise AI for regulated, data-sensitive industries**: agentic systems, RAG/vector-DB knowledge engines, secure cloud deployments (dedicated OpenAI/Azure instances), and quant/ML systems. The website is being repositioned to match: **enterprise AI front and centre, n8n demoted to a single "quick automation" wedge page.**

## Why this is right (it's not a guess — the demand already finds us)

The current site ranks for informational n8n queries that don't convert (0.2% sitewide CTR — see the forensic audit). But buried in GSC is proof the *enterprise* demand is already landing on chronexa.io with nowhere good to go:

| Query already earning impressions | Impr | Position |
|---|---|---|
| document automation tools for regulated industries | 194 | 12.9 |
| which document automation tools are best for regulated industries? | 52 | 4.9 |
| private equity fund tax K-1 preparation manual workflow pain points | 67 | 7.5 |
| best tools for automated model documentation and approvals for regulated industries | 6 | **1.0** |
| "...scale without headcount but still pass HIPAA audits..." (sales ops, healthcare insurer) | 13 | **2.0** |
| AI platforms for enterprise workflow automation with transparency/auditability/HIPAA/GDPR/finance/healthcare | 15 | 12.9 |
| AI workflow automation for legal teams | 7 | 77 |
| self-healing tools for fintech compliance | 16 | 7.0 |
| n8n langchain nodes rag | 4 | 6.0 |

These are long, natural-language (AI-Overview-era) queries from high-intent regulated buyers. They currently hit a stray blog post. **The unifying position that owns all of them: "secure, auditable AI automation for regulated industries."** That theme already ranks — we just need to build real pages behind it.

## The cross-cutting wedge

> **Chronexa builds secure, auditable AI systems for regulated industries — finance, legal, tax, and dealmaking — where the data can't leak and the work has to stand up to an audit.**

This is ownable (competitors don't have the depth), maps to all 4 priority verticals, and matches demand that already exists. Everything below ladders up to it.

---

## New site architecture

### Top of site
- **Homepage** — rewrite hero from "n8n automation" to the secure-enterprise-AI position above. Lead with regulated-industry proof, not workflow tooling.
- **Solutions hub** — reframed around capabilities that matter to enterprise buyers: *Agentic systems · RAG / knowledge engines · Secure & compliant AI deployment · Quant & ML systems · Workflow automation (the wedge)*.

### Four vertical pillar pages (priority order = build order)

Each pillar is a deep, conversion-focused page (not a thin 1,200-word landing like Automaly's): the buyer's problem in their words → the architecture Chronexa builds → named tools/stack → measured ROI from a real case study → the security/compliance model → CTA. Each links to its case study and supporting blogs.

1. **Legal AI** — `/legal-ai-automation` (proof: India litigation firm regulatory-intelligence build, 90% ↓ monitoring, 5× faster). Covers: legal RAG/vector-DB, regulatory circular tracking (SEBI/RBI/SCC), matter & precedent databases, secure deployment.
   - _Primary:_ AI workflow automation for legal teams · legal document automation for regulated firms
   - _Long-tail (live demand):_ best document automation software compliance legal · legal RAG vector database · regulatory document automation
2. **Tax & accounting AI (CPA)** — `/cpa-tax-automation` (proof: CPA tax-season system, 84% ↓ follow-up, 3× docs/staff). Covers: tax document copilots, client intake automation, K-1 prep, compliance, savings research.
   - _Primary:_ AI tax automation for CPA firms · tax document automation services
   - _Long-tail (live demand):_ private equity fund tax K-1 preparation · tax bookkeeping client onboarding automation
3. **Financial services & quant AI** — `/financial-services-ai` (proof: LedgerSync fintech — **needs deepening**, see below; quant work is NDA-bound → lead with thought-leadership). Covers: secure AI for financial firms, compliance/auditability, equity research, ML/quant systems (XGBoost/LSTM).
   - _Primary:_ secure AI automation for financial services · fintech compliance automation
   - _Long-tail (live demand):_ self-healing tools for fintech compliance · AI compliance workflow · n8n financial services automation
4. **M&A / investment banking AI** — `/ma-investment-banking-ai` (**needs net-new proof content** — no case study yet). Covers: due-diligence automation, deal data rooms, equity/market research.
   - _Primary:_ AI for M&A due diligence · investment research automation
   - _Long-tail:_ private-equity workflow automation · deal sourcing automation

### Cross-cutting pillar
- **Secure & compliant AI for regulated industries** — `/regulated-industries-ai` — the page that captures the HIPAA/GDPR/auditability/transparency cluster already ranking (some at pos 1–2). Hub linking down to all 4 verticals.

### The n8n wedge
- Collapse the n8n-heavy pages into **one** honest page — `/workflow-automation` (or keep `/n8n-automation-services`) positioned as "fast, lower-cost workflow automation for ops/sales." Keep it for cashflow leads; stop letting it define the brand. 301 the redundant n8n pages into it.

### Existing pages — disposition
- **Keep + deepen:** legal-due-diligence-automation, cpa-tax-document-automation, financial-services-automation, vc-pe-crm-automation, document-processing-automation → fold into the new pillars (301 where slugs change).
- **Keep as wedge:** n8n-automation-services, system-data-integration.
- **Demote/merge:** the generic function pages (operations/hr/customer-support/marketing) — keep only if they earn impressions; otherwise merge.

---

## Content model — the rule that makes Google reward us

Google's March 2026 core update made **Information Gain** (saying what others can't) and **first-hand Experience** the dominant signals; generic AI content lost 60–80% visibility. So every page and blog must follow the **lived-experience template**:

1. **The problem in the client's words** — the specific, nuanced pain (e.g. "legal analysts manually monitoring SEBI, RBI, SCC circulars daily").
2. **The architecture we built** — real components, named tools, the actual stack (vector DB, RAG, dedicated Azure/OpenAI instance, HITL arbitration).
3. **The hard part** — what made it nuanced and why off-the-shelf tools fail.
4. **Measured ROI** — real numbers from the engagement.
5. **The security/compliance model** — how data stays auditable and contained (this is the differentiator for regulated buyers).
6. **CTA** — book a call for this vertical.

**Blogs:** no prompt-and-publish. Each blog = one real problem we've solved, written from the chair of the person who lives it. Depth over volume.

### Case-study cleanup (do this — it's actively hurting us now)
Three case studies (AutoPartsCo, FreshCart Foods, LedgerSync) carry **identical stats** (60% ↓ workload, 3× throughput) and generic "transformed operations using AI automation" titles. That's exactly the templated content the 2026 update punishes. Either **deepen each with the real specifics** (LedgerSync especially — it's our only fintech proof) or **remove them**. Keep the strong, specific ones (Legal regulatory intelligence, CPA tax, ReserveStudy, Cultinnis).

---

## Build sequence (impact ÷ proof-on-hand)

1. **Legal AI + Tax/CPA AI pillars first** — both have strong, specific case studies *and* live GSC demand → fastest credible wins.
2. **Regulated-industries cross-pillar** — captures the compliance/auditability queries already at pos 1–2.
3. **Financial services & quant** — deepen LedgerSync; write the quant/ML thought-leadership piece.
4. **M&A / IB** — needs net-new proof; write a deep methodology piece to seed it.
5. **Homepage + Solutions hub reframe** once the pillars exist to point to.
6. **n8n consolidation** — merge to one wedge page + 301s.

## Keyword research note
The keyword targets above are grounded in (a) chronexa.io's live GSC impressions (real demand, not estimates) and (b) market scan of the legal-RAG and CPA-tax-AI spaces. For search-volume/difficulty numbers, pull each target in **Semrush** (Ankit has access) before finalising page titles — GSC tells us what we already rank for; Semrush sizes the headroom.

## Safety
Every slug change = a 301 (in `next.config.ts` / `src/proxy.ts`) so we keep the impressions already landing. Re-run `node scripts/gsc-cannibalization.mjs` and the page-audit after launch. Never push to GitHub / deploy without Ankit's say-so.
