# Phase 1 — AICPA & CIMA / "Josi" call notes (2026-07-13)

**Source:** BD call, Ankit Dhiman + Abhishek Walia (Chronexa) with Adam Hibbs (AICPA & CIMA). 33 min, recorded (Fathom). Confidentiality rules for this whole document: see [README](README.md).

## 1. What "Josi" actually is — independently verified

Correction to the call transcript: the product is **Josi**, not "Josie" (name confirmed on AICPA's own site). Named after Josiah Wedgwood, the 18th-century potter regarded as the father of cost accounting.

- **Confirmed, public, safe to cite with sources:**
  - Josi is AICPA & CIMA's GenAI research assistant, launched **2025-10-27**. Provides accelerated research/summaries over AICPA's professional library (40,000+ accounting/auditing materials). [Journal of Accountancy](https://www.journalofaccountancy.com/news/2025/oct/aicpa-releases-gen-ai-tool-josi/), [AICPA & CIMA official announcement](https://www.aicpa-cima.com/news/article/genai-research-tool-offers-information-and-insights-from-aicpas-professional).
  - Hosted in AICPA's **private Azure environment**; each firm's data/queries are isolated, not shared across firms. Matches what Adam described on the call (a closed, secure Azure OpenAI instance rather than public ChatGPT/Claude).
  - 400+ firms had purchased, trialed, or demoed it as of late October 2025 coverage — [Inside Public Accounting](https://insidepublicaccounting.com/2025/10/28/aicpa-launches-genai-research-tool-josi-for-accounting-and-auditing-professionals/).
  - Priced/designed for small-to-mid-size firms, not enterprise deployments.
- **From the call only (not independently verified — attribute to "conversations with the platform" at most, never quote Adam directly without sign-off):**
  - Architecture is RAG (retrieval-augmented generation — the AI looks up licensed source documents at query time rather than relying purely on what the underlying model memorized in training). Frontier model is OpenAI's, run in the closed Azure instance specifically to control both cost-per-query and IP exposure.
  - Content AICPA can only **directly sell**, not freely sublicense: FASB/GASB codifications, PCAOB standards. Any platform-integration deal (e.g. embedding Josi into a firm's own software via MCP — Model Context Protocol, the emerging standard for letting one AI tool call into another system) has to route around that restriction, either firm-by-firm or via a bulk deal with FASB directly.
  - Roadmap: document upload (rolling out; wasn't available on the trial Ankit used — he couldn't upload an Excel file), team-level sharing, eventual IFRS/IFAC content for non-US markets. Deliberately **not** pursuing deep back-office system integration (e.g. connecting to Firm360, UltraTax CS) — Adam was explicit that's "a different market" than Josi is scoped for.
  - Stated philosophy: growth is "content-led, not feature-led" — i.e., AICPA believes the moat is licensed authoritative content, not a killer feature.

## 2. The flagship insight: AI tools may be running on unlicensed professional content — and the real case behind it

This is the single most blog-worthy thing from the call, but **Adam's specific claim needs correcting before it's ever published.**

**What Adam said:** a class-action suit was filed against Anthropic in November 2025 specifically over professional/accounting standards content (FASB, GASB, PCAOB material) being absorbed into LLM training without AICPA's permission, and that this is "the same as Napster" for rights holders.

**What's actually verified (checked 2026-07-14):**
- The real, landmark case is **Bartz v. Anthropic** — a class action by book authors (Andrea Bartz, Charles Graeber, Kirk Wallace Johnson), not by AICPA or any accounting-standards body. It concerns **~7 million pirated books** Anthropic downloaded from shadow libraries for training, not professional/accounting standards specifically.
- In June 2025, Judge Alsup ruled training on *legally acquired* books was fair use, but keeping/using *pirated* copies was not.
- Anthropic agreed to a **$1.5 billion settlement** (the largest copyright class-action recovery on record), preliminarily approved 2025-09-25. [Kluwer Copyright Blog](https://legalblogs.wolterskluwer.com/copyright-blog/the-bartz-v-anthropic-settlement-understanding-americas-largest-copyright-settlement/), [Courthouse News](https://www.courthousenews.com/authors-publishers-near-final-approval-of-1-5-billion-anthropic-copyright-settlement/), [IPWatchdog](https://ipwatchdog.com/2025/10/02/ai-training-data-watershed-1-5-billion-anthropic-settlement/).
- No search evidence of a separate suit specifically about FASB/GASB/PCAOB/AICPA content. Adam most likely generalized the Bartz precedent to the accounting-standards case he cares about — a reasonable inference, but not itself a documented fact.

**Why this is still a strong, legitimate blog angle:** the underlying legal exposure is real and now has a $1.5B precedent behind it — AI vendors and the firms that plug into them are exposed if training/retrieval content was never properly licensed. The buyer-relevant question is genuinely underwritten in CPA-facing content right now: *"When your firm's AI tool cites a standard, was that content actually licensed — and does your engagement letter say anything about it?"* That's a Layer C (decision-maker + trend/compliance) angle, arguably crossing into Layer A if narrowed to a specific tool/workflow (e.g., "AI research tools and FASB licensing risk"). If written, lead with Bartz v. Anthropic as the cited precedent, frame the AICPA-content point as "the same exposure logic applied to professional standards," and never attribute the claim to Adam or AICPA by name.

Also concrete and citable without attribution: the call surfaced a real, practical action item worth turning into buyer-facing content — **most engagement letters (the contract a CPA firm signs with a client) say nothing about AI use on client data or on licensed standards content.** That's a checklist-style post opportunity independent of the lawsuit angle ("5 things your engagement letter should say about AI before you deploy it").

## 3. Chronexa's own case-study material surfaced on the call (already anonymized — keep it that way)

Two client engagements Ankit described, both already anonymized on the call itself:

**Mid-market US CPA firm (Firm360 + UltraTax CS as their existing stack):**
- The buying insight: this firm explicitly rejected the idea of a new standalone tool — "we don't want another tool." What they wanted was automation woven into the software they already run. Worth a direct quote-style line in a blog: firms don't want another login, they want their existing stack to get smarter.
- Full workflow Chronexa built: intake call → AI transcription → auto-built client profile → auto-detects missing documents (e.g. W-2, K-1) → auto-emails client for what's missing → client uploads to a secure document vault → OCR extraction (explicitly *not* AI — classical OCR, e.g. Azure Document Intelligence / Google's document OCR) structures the data first → AI then cross-checks the structured data for conflicts/missing info and flags tax-saving strategies → auto-drafts a scope document with recommended services and a rough price *before* the advisor call even happens → engagement letter auto-sent ~10-15 minutes after the call ends → e-signature → auto-invoice → onboarding.
- **Privacy-by-design detail worth a full section on its own:** the AI never sees whose data it's processing. Documents are OCR'd into structured numbers first (e.g. "this is a PFIC unit's fund value," not "this is Adam's fund"), and only the structured, de-identified data reaches the AI step. This is a genuinely differentiated, specific trust story — most "AI for accountants" content just says "your data is secure" with no mechanism behind it.
- **PFIC example** (Passive Foreign Investment Company — a US tax classification triggered when a US taxpayer owns a foreign mutual fund/ETF, requiring extra IRS reporting and often punitive tax calculations): Chronexa built a regulatory-monitoring bot that watches IRS/SEC updates, matches new rules against a firm's actual client portfolios, flags which specific clients are affected, and drafts the client-facing explanation email automatically. Strong concrete example of "AI reads regulatory change and tells you exactly who it affects" — much more specific than generic "AI keeps you compliant" copy.

**Litigation firm (one of India's largest, unnamed):** AI-assisted precedent search and matter search across the firm's own historical records, plus client profile building. Thin detail on the call — not enough here yet for a standalone post, but useful as a one-line proof point that Chronexa's document-intelligence pattern generalizes beyond CPA into legal.

## 4. Ranked blog-worthy angles

1. **"Is your firm's AI tool using licensed content — or borrowed content?"** — Layer C compliance/trend angle. Lead with Bartz v. Anthropic (real, verified, $1.5B), extend the logic to professional standards licensing generally, close with the engagement-letter checklist. CTA: book-a-call (no calculator fits cleanly; this is a governance topic, not a cost-quantification one). Needs the cannibalization check (see README open items) before drafting.
2. **"5 things your engagement letter should say about AI before you deploy it"** — practical checklist post, doesn't depend on the lawsuit-attribution risk at all, safer to greenlight sooner. Layer C, CTA: book-a-call.
3. **"What CPA firms actually want from AI: not another tool"** — built around the anonymized Firm360/UltraTax CS case, the "we don't want another tool" line, and the full intake-to-engagement-letter workflow. Layer A candidate if titled around a specific tool pairing (e.g. "UltraTax CS document automation" or "Firm360 AI integration"). CTA: `cpa-tax-season-capacity-calculator` fits well (tax/K-1/UltraTax keywords match `CALC_RULES`).
4. **"How to automate client onboarding without AI ever seeing whose data it is"** — the OCR-before-AI / de-identification architecture as its own piece. Genuinely differentiated trust/security angle for the compliance-minded buyer this ICP always is. CTA: `document-processing-cost-calculator` (OCR/extraction match).
5. **PFIC regulatory-monitoring bot as a worked example** — folds well into #3 rather than standing alone; the detail is strong but narrow (PFIC-specific), better as a concrete example inside a broader "AI regulatory monitoring for tax firms" post than its own post.

## Next steps
- Run the cannibalization check against the live blog for angle #1 and #3 before drafting either.
- Get Ankit's explicit sign-off before any draft references Josi/AICPA/Adam by name, even indirectly (e.g. "a leading accounting body's AI assistant").
- If angle #1 gets greenlit, independently re-verify the Bartz v. Anthropic settlement is still at the same status (it was only preliminarily approved as of the sources checked here) before publishing a date-specific claim.
