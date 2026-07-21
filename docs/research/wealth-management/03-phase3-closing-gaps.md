# Phase 3 — Closing the Remaining Gaps

Research run 2026-07-12/13. After Phase 2 hit a wall on six questions using general web search, this pass deliberately pointed the research at different, more specific source types per question — government text directly, real job postings, named-executive interviews, and companies that specifically serve the moment a firm buys automation help. 23 sources fetched, 81 claims pulled, 25 checked. **Note on how this pass ran:** it hit a usage limit partway through the fact-checking stage, so a handful of promising leads (flagged below) didn't get their final check the first time — a resume pass is filling those in. Everything below marked "confirmed" has already cleared independent fact-checking.

**Bottom line: this redirected approach worked much better than Phase 2's general search.** Three of the six previously-empty questions now have real, sourced answers. Two are still open. One (client reporting) is still empty even with the better sources.

---

## 1. The IRS/tax side — now partly answered

Phase 2 came back with nothing on this. This pass went straight to IRS.gov instead of blog posts, and got real answers:

- **Who's legally on the hook for RMDs (Required Minimum Distributions — the mandatory yearly withdrawal from certain retirement accounts once someone reaches a set age):** the custodian *may* calculate the number, but by law, **the account owner is always the one legally responsible** if it's wrong. That responsibility doesn't transfer to software or even to the custodian — confirmed directly from IRS.gov.
- **The penalty for getting it wrong is real money:** miss an RMD and the IRS charges a **25% penalty** on the amount that should have been withdrawn (drops to 10% if fixed within two years). Deadlines: the first one is due April 1 of the year after the client turns 73; every year after that, December 31.
- **The single best find of this whole research project so far, insight-wise:** cost-basis and wash-sale reporting (the rule that stops someone from claiming a tax loss if they just rebuy the same investment right away) is **only tracked by the broker within one single account.** By law, a client's wash sales are supposed to be tracked across *everything they own*, including accounts at other custodians — but the automatic paperwork (the 1099-B tax form) never sees across accounts. **That means if a client has money at two different custodians, or multiple accounts, nobody's software is automatically catching wash-sale violations across all of it — a firm has to catch this manually, or it doesn't get caught at all.** This is a concrete, provable, and slightly alarming gap — a strong angle for both a blog post and an actual product idea.

## 2. How manual is investment research really? — one real, named answer

Phase 2 found nothing here. This pass found a named Chief Investment Officer describing his own process on a podcast: **Mark Asaro of Noble Wealth Management said flatly that his firm has no automated models at all** — no "hit a button and it buys everything in that model" process. In his words, that's simply not how his firm does business.

**Important nuance for us:** this reads as a *deliberate choice*, not a technology gap — he's framing manual portfolio construction as part of his firm's craftsmanship and value to clients, not something he wishes were automated. **Caution:** this is one CIO's opinion, not a survey — we shouldn't assume every mid-market firm feels this way, and we should be careful not to pitch "let's automate your investment decisions" to a firm that sees manual research as its actual selling point. The safer, still-valuable angle: automate what's *around* the research (compiling the data an analyst needs, formatting a research report) without touching the actual judgment call.

## 3. Custodian friction (NIGO/ACATS) — now has real numbers

This was thin after two passes. Now we have hard data, though with an important dating caveat:

- A FINRA (the industry's self-regulator) task force found that **11-13% of all account transfer instructions get hard-rejected** — sent back outright, not just delayed. The single most common cause: **the account number the client wrote down from their own statement doesn't match what the old firm has on file** — often because the old firm changed systems or merged with someone else, i.e., not the client's fault at all.
- **Caveat: that 11-13% figure is from an older FINRA report** (the source itself dates to the mid-2000s), so treat it as a historical baseline, not necessarily today's exact rate — but the underlying cause (account-number mismatches from system changes) is a structural problem, likely still real today.
- **What is current:** the company that runs the transfer system itself, DTCC, announced in September 2025 that it removed a processing step, cutting a full account transfer down to **3-4 business days** — proof the industry itself is still actively trying to fix this pain point right now, which is a good signal the problem is real and top-of-mind industrywide, not something we'd be inventing.

## 4. Buying triggers — one real program found, more leads pending verification

- **Confirmed:** Two well-known industry firms, Dynasty Financial Partners and Diamond Consultants, just launched a joint "Breakaway Investment Banking Initiative" (announced October 2025) specifically for advisor teams managing **$1 billion or more** who are deciding whether to go independent, join another big firm, or sell/merge into an RIA. This confirms that "advisor deciding to leave and go independent" is a real, large enough moment that established players are building entire service lines around it — good validation that this trigger moment is real, even if it's aimed at bigger teams than our ICP.
- **Promising but not yet independently confirmed** (the fact-check on these got interrupted by a system limit, being re-run): a named report that private-equity-backed firms make up the large majority of RIA acquisition deals recently, and a named example of a specific large firm (MAI Capital Management) being acquired by a major private equity firm (Carlyle Group) in early 2026. If these hold up, they're exactly the kind of concrete, named, dated deal evidence we were missing — will confirm in the next update to this document.

## 5. Client reporting workflow — still empty

Even with a redirected search at real job postings, this one still came back empty. Two job postings were found that appeared to list "prepare quarterly reports" as a duty, but neither survived independent fact-checking (most likely because job postings disappear or get edited, making them hard to re-verify — not necessarily because the claim was false). **This remains the single question three research passes have not been able to answer from public sources. It's the strongest case yet for just asking a real operator directly.**

## 6. Competitor pricing — a partial new lead
One promising source surfaced (the same Sphynx Automation mentioned in Phase 1) showing a current, three-tier pricing structure — but it didn't make it into this round's confirmed list before the interruption. Will confirm exact numbers in the next update.

---

## Claims checked and thrown out this round (for the record)
Several ACATS turnaround-time and rejection-percentage claims from the same older FINRA report were thrown out — likely because they've been superseded by the 2025 DTCC change described above, not because the original report was wrong for its time. A claim about a company called Dispatch cutting advisor-transition time from hours to 30 minutes, and a claim about it moving $200M in assets in two weeks, were both thrown out on fact-check. Two RIA job-posting claims (see section 5) were thrown out.

## Status of all six original open questions after three research passes
1. IRS-side compliance — **now substantially answered** (see section 1); the wash-sale cross-account gap is a genuinely new, strong finding.
2. Client reporting production — **still empty after three passes.** Needs a real conversation, not more search.
3. Investment research/portfolio construction — **partially answered** with one named, real example (section 2), but only one data point.
4. Buying triggers/decision-makers — **partially answered**, one confirmed program (Dynasty/Diamond) plus a few promising leads pending final confirmation.
5. Competitor pricing — **still mostly open**, one lead (Sphynx) pending confirmation.
6. Custodian NIGO/ACATS friction — **now well-answered** (section 3), best-resourced finding of this whole phase.

*This document will be updated once the interrupted verification finishes confirming or rejecting the remaining pending leads (PE deal data, Sphynx pricing).*
