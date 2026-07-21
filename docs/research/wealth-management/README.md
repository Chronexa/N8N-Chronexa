# Wealth Management / RIA Research — Living Document

**Purpose:** Build Chronexa's real, insider-level understanding of independent wealth management firms (called RIAs — Registered Investment Advisers, the legal category for an independent advice firm registered with the SEC) so we can (1) define who we should sell to, (2) find automation work worth doing for them, and (3) write blog content that reads as genuinely knowledgeable instead of generic AI-agency content. This is a foundation document, not a finished report — it grows as we research more and as Ankit reviews, questions, and redirects it.

Market entry into this space is a decided call. This research does not revisit that — it's about understanding the industry deeply enough to act on it well.

## How to use this document
- Each phase of research is its own file, added as we go.
- Every claim carries a confidence label and a source. If something reads as fact with no source, flag it — it hasn't been checked.
- Where a finding was actively fact-checked and found wrong, we keep the record of what was killed and why (see "Killed claims" in each phase file) — those are just as useful as confirmed ones, so we don't waste time reproving them later.
- Open questions at the end of each phase carry forward until closed.

## Locked scope decisions (2026-07-12)
- **Geography:** US only. (Wealth management/advisory fee pools outside the US, e.g. India, are much smaller and structured differently — commission-based, not fee-based.)
- **Anchor business type:** Independent RIAs, not big wirehouse brokerages, not hedge funds, not family offices. Those are different businesses with different economics; we'll research them as separate later passes if useful.
- **Target firm size (ICP — Ideal Customer Profile, meaning "the type of company we should be selling to"):** roughly $150M–$3B in client assets managed, 10–75 staff. The floor of ~$150M comes from Chronexa's typical project price ($10K–75K, confirmed by Ankit 2026-07-12) — a firm needs to be running enough revenue to spend that comfortably without it being a board-level decision.

## Phases
1. [Phase 0 — Framing](00-framing.md) — the questions we had to answer before researching, assumptions challenged, blind spots flagged. Done 2026-07-12.
2. [Phase 1 — Economics, Tech Stack, Core Workflows](01-phase1-economics-tech-workflows.md) — how these firms make money, what software they run, where the busywork lives. Done 2026-07-12.
3. [Phase 2 — Compliance, AI Adoption Gaps & Competitors](02-phase2-compliance-competitors.md) — SEC rules confirmed manual-by-regulation (with a neglect twist), AI trust/resistance pattern, one real buying-trigger example. Done 2026-07-12. **Weaker pass than Phase 1** — 4 of 6 topics came back thin or empty; see that doc's "What this means for next steps."
4. [Phase 3 — Closing the Remaining Gaps](03-phase3-closing-gaps.md) — redirected the search strategy (primary regulatory text, named executive interviews, real job postings) at the six questions Phase 2 couldn't answer. Done 2026-07-12/13. **Worked much better than Phase 2** — 3 of 6 questions now have real answers, most notably a genuine gap in wash-sale tax monitoring across custodians. A handful of promising leads (a named PE acquisition, competitor pricing) were still mid-verification when the research tool hit a usage limit — flagged in that doc as pending, to confirm once it's back.

## Open questions carried forward (updated as phases close)
- ~~Which SEC-side steps are legally required?~~ **Answered in Phase 2** — Rule 204-2 (books/records) and Rule 206(4)-7 (annual review) are hard requirements, but firms often fail to execute even the mandated ones.
- ~~Which IRS-side steps are legally required?~~ **Substantially answered in Phase 3** — RMD responsibility, penalties, and deadlines are confirmed from IRS.gov directly. Best find: wash-sale monitoring is only tracked *within* a single account by law/broker reporting, not across a client's multiple accounts or custodians — a real, provable manual gap.
- How do client performance reports actually get produced day-to-day, and what do clients complain about? *(Still empty after THREE passes, including one aimed at real job postings. This is the strongest case for talking to a real operator instead of more web research.)*
- How manual is investment research / portfolio construction inside these firms really? *(Phase 3 found one named CIO — Mark Asaro, Noble Wealth Management — who says his firm is deliberately model-free/manual by choice, not neglect. One data point, not a pattern yet.)*
- Who actually decides to buy automation/ops help, and when? *(Phase 3 confirmed one real program — Dynasty Financial Partners' & Diamond Consultants' "Breakaway Investment Banking Initiative," Oct 2025, for $1B+ teams. A named PE acquisition and a PE-deal-share stat were found but not yet independently confirmed — pending.)*
- Who are our real competitors right now, and what do they charge? *(Still mostly open — a lead on current Sphynx Automation pricing surfaced in Phase 3 but wasn't confirmed before the research tool hit a usage limit.)*
- What do custodians (Schwab, Fidelity, Pershing) actually put firms through operationally, and how bad is it? *(Now well-answered — Phase 3 found FINRA's 11-13% hard-reject rate for account transfers, with the most common cause being account-number mismatches from back-office system changes, plus a 2025 DTCC process change that cut transfer time to 3-4 business days. Reject-rate figure is from an older report — treat as a historical baseline, not necessarily today's exact number.)*

**Standing status as of end of Phase 3:** redirecting the source strategy (primary text, named interviews, job postings) worked much better than repeating general web search — worth doing again for the two still-open questions (client reporting production, competitor pricing) rather than defaulting straight to "needs a human conversation." That said, client reporting has now failed three separate attempts and is the strongest remaining candidate for a real operator conversation if one becomes available.
