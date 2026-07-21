# Chronexa Calculator Suite — Redevelopment Plan

**Date:** 2026-07-21
**Scope:** `law-firm-billing-leakage-calculator`, `document-processing-cost-calculator`, retrofit of `cpa-tax-season-capacity-calculator`
**Status:** Plan — not yet built (except the CPA first-pass changes already shipped 2026-07-15/16, treated below as needing a consistency retrofit)

## 1. Why this plan exists

An audit of the three live calculators found them structurally sound but shallow: single blended sliders, one headline number, no visible mechanism. Fixing the CPA calculator's broken sliders this session (prep-hours and preparer-headcount now actually move the output) solved the *correctness* problem but not the *depth* problem.

Ankit benchmarked the suite against investmates.io's calculator suite (401(k) projection, retirement planning, AUM-vs-fixed-fee advisor comparison) via direct Playwright inspection. That suite is materially more convincing, and inspection identified *why*, precisely — not vibes:

- Every number is decomposed into its real components (a total is never left as one opaque figure).
- A number is never shown alone — it's compared against a named alternative scenario, side by side, with mirrored line items.
- Estimates are shown as a range with a stated midpoint, not a single point pretending to be precise.
- The written content below the tool includes numbered "how to use this" steps, a real mechanism explanation, and — critically — an honest section on when the tool's own recommended path does *not* apply.

None of this requires a charting library, a simulation engine, or new invented statistics. It requires reusing patterns Chronexa has already built once (see §3) and applying real, already-published domain data (see §4) more completely than the calculators currently do.

**Hard constraint carried through this whole plan:** every number, claim, and comparison below is sourced to something already published in this codebase (`engines-data.ts`, existing FAQ copy, the CPA case-study blog post). Nothing here introduces a new statistic. Where Chronexa doesn't have real data for a plausible-sounding feature (e.g. a per-sub-stage time breakdown for document classification), the plan explicitly says so and recommends leaving it as descriptive text, not a fabricated number.

## 2. Explicitly out of scope for this plan

Flagged as *possible future phases*, not designed here, because they'd require either new infrastructure or data Chronexa doesn't have:

- Multi-year/multi-season trajectory charts (needs real time-series data and likely a charting library).
- Monte-Carlo-style confidence simulation (no data basis — would fabricate false statistical rigor).
- A progressive-disclosure "11 advanced inputs" tier like the benchmark's retirement calculator. Chronexa's calculators are B2B lead-gen tools, not consumer financial-planning tools; the audience wants a fast, credible number, not an 11-field form. Revisit only if user data ever shows people wanting more precision than 4-5 sliders give.

## 3. Reusable architecture — two shared pieces, no new dependencies

Confirmed via codebase research: **no charting library exists** (`recharts`/`chart.js`/`victory`/`nivo`/`visx`/`d3` all absent from `website/package.json`), and none is needed. Two patterns already live in production solve this:

### 3.1 `ComparisonPanel` — two-column before/after

Already shipping on `/ai-engines/legal-regulatory-engine` (`src/app/ai-engines/legal-regulatory-engine/page.tsx`, rendering `LEGAL_REG_GAPS` from `engines-data.ts`). Pattern:

```tsx
<div className={styles.gapCompare}>
  <div className={styles.gapCol}>
    <p className={styles.gapColHead} data-kind="before">Before</p>
    <ol className={styles.gapSteps}>{before.map((s) => <li key={s}>{s}</li>)}</ol>
  </div>
  <div className={styles.gapCol}>
    <p className={styles.gapColHead} data-kind="after">After</p>
    <ol className={styles.gapSteps}>{after.map((s) => <li key={s}>{s}</li>)}</ol>
  </div>
</div>
```

CSS lives in `src/app/ai-engines/ai-engines.module.css`: `.gapCompare` is a `1fr 1fr` grid (collapses to `1fr` under 860px, matching the calculators' own breakpoint), `.gapColHead[data-kind='before']` uses `var(--color-alert)` (burnt orange), `[data-kind='after']` uses `var(--accent-on-surface)` (ink-green) — this before=orange/after=green convention is the one existing site precedent for manual-vs-automated signaling and should be reused, not reinvented.

**Action:** build `src/components/calculators/ComparisonPanel.tsx`, a small component taking `{ beforeSteps: string[]; afterSteps: string[]; outcome?: string }`, styled with new classes in `calculators.module.css` (`.compareGrid`/`.compareCol`/`.compareHead[data-kind]`/`.compareSteps`/`.compareOutcome`) ported from the `gapCompare` pattern but namespaced to the calculators module so there's no cross-module coupling. Reuse the same before=orange/after=green color convention for consistency across the site.

### 3.2 Hero comparison bar — track + fill, no charting library

Used identically in `LegalScene.module.css` (`.billMeterWrap`/`.billMeterFill`) and `InvestScene.module.css` (`.sgBar`/`.sgBarFill`, `.riskBar`/`.riskBarFill`):

```css
.xBar { height: 7px; border-radius: var(--radius-pill); background: var(--border-dark); overflow: hidden; }
.xBarFill { display: block; height: 100%; border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--brand-green), var(--brand-green-hover));
  transition: width .12s linear; }
```

Driven by `style={{ width: '${n}%' }}` computed from calculator state in React — a plain CSS transition, not a framer-motion `animate` call (confirmed: the `motion` package, i.e. current-name framer-motion, is in `package.json` but only used for `useInView`/`useReducedMotion` across every `*-scene` component — never `animate`).

**Important constraint on this bar:** use it for exactly **one** real, absolute before/after number per calculator — the single most dramatic legitimate stat — not for every sub-stage. Chronexa doesn't have honest per-sub-stage time data (e.g. "classification takes N minutes manually"), so inventing bars for every pipeline stage would mean inventing numbers. The multi-stage pipeline story stays as the existing descriptive list pattern (§3.3). One hero bar per calculator, each side sourced to something the calculator already computes or a published benchmark:

| Calculator | Before (from calculator's own inputs/constants) | After (published benchmark, not slider-driven) |
|---|---|---|
| Legal | `hoursLostPerWeek` (already computed: `hours × 5 × LEAKAGE`) | `hoursLostPerWeek × (1 − RECOVERY)` — i.e. still-lost hours even after automated capture, using the calculator's own existing conservative 50% recovery constant. No new number invented. |
| CPA | `reviewHours` slider (already built this session) | `20 min` (the published 15–25 min benchmark midpoint — already built this session as `REVIEW_HOURS_AFTER`) |
| Document-processing | N/A (no per-document "after" time exists honestly) — use the flagship **turnaround** stat instead: `14 days` | `4 hours` (real, first-party reserve-study result, already cited in existing FAQ copy, from `DOC_INTEL_ROI`) |

**Action:** build `src/components/calculators/HeroBar.tsx` — `{ label, beforeValue, beforeUnit, afterValue, afterUnit }`, rendering two stacked `.xBar` rows sized relative to `beforeValue` (the larger number, always shown as the 100%-width reference bar) with the "after" bar's width scaled proportionally. New CSS: `.heroBar`/`.heroBarRow`/`.heroBarLabel`/`.heroBarTrack`/`.heroBarFill[data-kind='before'|'after']` (before = `var(--color-alert)` fill, after = `var(--brand-green)` fill — same semantic convention as the ComparisonPanel).

### 3.3 Keep: the existing stage-list pattern

The `.taskHeading`/`.taskList`/`.taskRow`/`.taskStage`/`.taskAfter` classes built this session for the CPA calculator are sound and should be **generalized, not discarded** — every calculator gets a "where the [time/hours] actually go" list mapped from that engine's real `nodes[].detail`/`nodes[].gives` text. This is the multi-stage narrative; the ComparisonPanel (§3.1) is the single-workflow before/after; the HeroBar (§3.2) is the one dramatic number. All three together are what make one interaction produce a layered, self-corroborating output instead of one card.

## 4. Per-calculator specs

### 4.1 Legal — Law Firm Billing Leakage Calculator

Files: `src/app/law-firm-billing-leakage-calculator/LeakageCalculator.tsx`, `page.tsx`.

**Scope discipline:** `LEGAL_REG_ENGINE.nodes` has six pipeline stages (monitor/impact/precedent/draft/update/index), but only **one** — `update` ("Matter Update & Billing") — is actually about billing capture. The other five belong to a different product story (regulatory alerts, precedent search, diligence memos) and must **not** be pulled into this calculator; doing so would misrepresent scope and dilute the page's focus. The real usable content lives in `LEGAL_REG_GAPS`, specifically **Gap 2, "The AI Usage Billing Gap"** (`engines-data.ts`, ~line 1082), which already has fully-written, ready-to-lift copy:

- `before`: `['Lawyer uses the AI assistant for 90 minutes on a matter', 'Finishes, moves to the next task', 'Forgets to log the time', 'Estimates 45 minutes at the end of the day, "to be safe"', '45 minutes of revenue lost']`
- `after`: `['Lawyer opens the AI tool on a matter', 'A background timer starts', 'On close, a draft time entry is created: "AI-assisted analysis, 92 minutes, Matter #5821"', 'Lawyer approves in one click', 'Every prompt and output logged to the matter file']`
- `outcome`: `'Closes the 26% billing-leakage loop automatically — and creates the AI audit trail your governance committee wants anyway.'`

**Build:**
1. `ComparisonPanel` using the Gap 2 `before`/`after` arrays verbatim (cite it as "the same before/after published on the Legal & Regulatory Engine page" in a caption — reinforces cross-page consistency, the same strength already established between the CPA calculator and its engine page).
2. `HeroBar`: "Hours lost per lawyer, per week" — before = `hoursLostPerWeek` (existing computed value), after = `hoursLostPerWeek * (1 - RECOVERY)` (existing constant, `RECOVERY = 0.5`).
3. Visual banding: the 26% leakage figure is already reframed in FAQ copy as "modeled, inside the documented 15–30% range" — but the *live result* doesn't show this range visually. Add a `resultBand`-style low/mid/high treatment to the leakage sub-label, matching the document-processing calculator's existing pattern (see §5).
4. Content depth (methodology section): add a numbered "How to use this calculator" (4 steps: enter fee-earning lawyers → enter blended rate → enter billable hours/day → read your leak/recoverable numbers), and expand the existing fixed-fee/contingency FAQ into a short standalone "When this doesn't fully apply" paragraph — real content already drafted in the FAQ, just needs promoting into the main body per the InvestMates pattern of not hiding caveats in an accordion.

### 4.2 Document-Processing Cost Calculator

Files: `src/app/document-processing-cost-calculator/DocCostCalculator.tsx`, `page.tsx`.

This calculator is already the most disciplined of the three (audit finding: every slider input provably reaches the headline number, real named citations — APQC, Ardent Partners — already in place). The gap is entirely about *depth of mechanism*, not honesty of the existing numbers.

`DOC_INTEL_ENGINE.nodes` (6 stages: upload/ocr/classify/calculate-index/qa/report) gives real, usable per-stage narrative:
- Intake: every format/source pulled automatically, deduplicated, timestamped.
- OCR + read: handles scans, photos, handwriting; every value confidence-scored; low-confidence flagged to a human, never silently guessed.
- Classify: sorted across legal/finance/compliance/tax automatically.
- Index: private, tenant-only RAG index, every passage cited to its source page.
- Q&A: plain-language question → cited answer in seconds.
- Report/review: named human reviewer confirms before anything is filed — nothing auto-files.

**Build:**
1. Stage list (§3.3) using the six nodes above, same treatment as CPA's task list.
2. `ComparisonPanel`: synthesize a before/after from the six nodes (this is real synthesis of already-published content, not new invention) — Before: "opened, read, and re-keyed by hand; filed manually; no way to search across documents; a question means re-reading everything." After: "every format ingested automatically; OCR + AI reads even handwriting with a confidence score; sorted across departments automatically; a plain-language question gets a cited answer in seconds; a named reviewer signs off before anything is filed."
3. `HeroBar`: the flagship **14 days → 4 hours** turnaround stat (from `DOC_INTEL_ROI`, already used as prose in the existing FAQ) — promote it to the visual hero bar, since it's the single most dramatic legitimate number this calculator has access to.
4. Content depth: add numbered "how to use this calculator" steps, and a "when this doesn't apply" paragraph (e.g. very low monthly volume where the automation's fixed setup cost dominates, or documents requiring pure professional judgment rather than extraction) — reasoned honestly from the calculator's own model, not a new invented segment stat.

### 4.3 CPA Tax-Season Capacity Calculator — consistency retrofit

Files: `src/app/cpa-tax-season-capacity-calculator/CapacityCalculator.tsx`, `page.tsx`.

Already rebuilt this session (5th "review hours" slider, task list, review callout). This is a **retrofit for consistency**, not a rebuild:

1. Replace the ad hoc `.taskList` markup with the shared stage-list pattern (§3.3) so all three calculators render this piece identically in markup/CSS, even though each pulls from its own engine's node data.
2. Replace the current text-only `.reviewCallout` with the shared `HeroBar` component (before = `reviewHours` slider, after = `REVIEW_HOURS_AFTER` = 20 min) — this is the exact case the HeroBar was designed around.
3. Add a `ComparisonPanel`, synthesized from `CPA_TAX_ENGINE.nodes` the same way as document-processing: Before: "staff check portals for new documents, chase clients by email, sort every file by hand, retype every field, review line by line for hours." After: "documents pulled automatically and gaps chased for you, 18+ types classified on arrival, thousands of fields extracted and verified, return arrives ~94% pre-filled, review drops to ~20 minutes."
4. Visual banding: show the 45% realization rate as a range rather than a single percentage, matching document-processing's pattern (see §5). The existing conservative framing ("the engine's benchmark is 3×") stays as the upper bound reference.
5. Add "how to use this calculator" numbered steps to the methodology section (the other two will get this fresh; CPA's methodology section currently jumps straight into formulas).

## 5. The two open decisions — recommendations

**Should the CPA calculator get a new "loaded cost per preparer hour" input, to produce a direct dollar-savings figure the way document-processing does?**

**Recommendation: no.** CPA firms price by fee-per-return, not billable hourly rate — unlike law firms (billable hourly, native fit) or AP/finance teams (loaded hourly cost is the standard metric they already think in). Revenue-via-added-capacity is the domain-authentic frame for this audience; bolting on an hourly-cost slider to manufacture a second dollar figure would read as an unnecessary extra field rather than real modeling, and risks exactly the "intern adds more sliders" pattern being avoided. Keep capacity/revenue as the one dollar metric; let the review-time savings stay in hours (already a strong, concrete number on its own — "3.5h → 20 min" doesn't need a dollar conversion to land).

**Should legal and CPA show a banded range instead of a single point estimate, matching document-processing's existing 40–60% band?**

**Recommendation: yes.** This was flagged in the original audit as document-processing's real strength over the other two, and it costs nothing new to add — the honest range already exists in copy (legal: "15–30%, we model 26%"; CPA: "conservative, the engine's benchmark is 3×") but isn't visually banded in the live result the way document-processing's `savingsLow`/`savingsMid`/`savingsHigh` sub-label already is. Concretely: add a low/high band display next to the leakage sub-label (legal) and the realization-rate sub-label (CPA), reusing the existing `resultBand`-style presentation already proven in `DocCostCalculator.tsx`.

## 6. Content-depth upgrade (applies to all three `page.tsx` methodology sections)

Each page's "Methodology" section gets two additions, both sourced from real, already-published material:

1. **A numbered "How to use this calculator" block** (3-4 steps) — mechanical, not persuasive: what to enter and why, in the order a first-time visitor would naturally fill the sliders.
2. **A "When this doesn't fully apply" paragraph**, promoted out of the FAQ accordion into visible body copy (InvestMates' pattern: caveats that argue against the tool's own conclusion build more trust than caveats buried in a collapsed FAQ). Legal already has fixed-fee/contingency content to promote; document-processing and CPA need one written each, reasoned from the existing model rather than new invented data.

No new external citations are needed — Legal already cites Clio's Legal Trends Report; document-processing already cites APQC and Ardent Partners; CPA already cites Filed plus the first-party case study. This section is about *surfacing* existing honesty more prominently, not sourcing new claims.

## 7. Build sequence

| Phase | Work | Files touched |
|---|---|---|
| 0 | Build `ComparisonPanel.tsx`, `HeroBar.tsx`, and their CSS in `calculators.module.css` (or a new `calculators.module.css` addendum) — foundation only, no calculator-specific logic yet | `src/components/calculators/ComparisonPanel.tsx` (new), `src/components/calculators/HeroBar.tsx` (new), `src/components/calculators/calculators.module.css` |
| 1 | Legal calculator rebuild (richest ready-made content, lowest new-writing burden — do this first) | `LeakageCalculator.tsx`, `law-firm-billing-leakage-calculator/page.tsx` |
| 2 | Document-processing calculator rebuild | `DocCostCalculator.tsx`, `document-processing-cost-calculator/page.tsx` |
| 3 | CPA retrofit (swap ad hoc markup for the shared components built in Phase 0) | `CapacityCalculator.tsx`, `cpa-tax-season-capacity-calculator/page.tsx` |
| 4 | Cross-cutting QA | all of the above |

## 8. Verification plan

- **Typecheck:** `cd website && npx tsc --noEmit -p tsconfig.json` after each phase.
- **Math sanity check:** a standalone Node script per calculator (same pattern used to verify the CPA rebuild this session) confirming: no NaN/negative values across each slider's full min-max range, and — for CPA specifically — that the defaults still reproduce the published 180-returns/$126,000 worked example exactly (this number is cross-referenced on the `/ai-engines/cpa-tax-engine` page and must not silently drift).
- **Visual check:** run the dev server and screenshot each calculator at both the desktop width and the existing 860px/620px breakpoints, confirming the new `ComparisonPanel` collapses to a single column and the `HeroBar` remains legible at narrow widths.
- **Content check:** re-read each page's FAQ + methodology section end-to-end for internal consistency (no page should contradict its own engine page or another calculator's citation of the same benchmark — this is the exact class of bug found and fixed earlier this session with the Filed/case-study mix-up).
