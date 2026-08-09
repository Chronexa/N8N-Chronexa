# Blog article page redesign — plan (2026-08-08)

Status: **IMPLEMENTED 2026-08-09.** Built to this plan with the adjustments below.
Not deployed — changes are local; deploying still needs `vercel --prod --yes` from `website/`.

## What shipped vs. this plan

Followed as written, except:

- **Tier C dropped** (per instruction): no lead-magnet assets built. Posts with no
  comparison or calculator fit get a single quiet call CTA.
- **Amplitude baseline NOT captured.** Only `NEXT_PUBLIC_AMPLITUDE_API_KEY` (the
  client ingest key) exists in the environment; the Dashboard API needs an API
  key + secret pair. Baseline-at-ship applies — the conversion target in §9 has
  no "before" number until someone exports it from the Amplitude UI.
- **No price band in the scope CTA.** The plan floated "price band" and a
  "2-week shape"; neither is a claim Chronexa publishes, so the block states only
  what /how-we-work already says: audit first, written fixed price before any
  code, built on your stack against real data.
- **Two defects found during the build that the plan had not spotted**, both
  fixed: 20% of posts rendered no table of contents (a body H1 was stealing a
  nesting level, pushing every section to h3), and the sticky CTA could be jumped
  clean over by a TOC link or #hash deep-link so it never appeared at all.
- **Added**: `website/scripts/audit-blog-article.mjs`, a CDP regression harness
  that asserts the §9 success criteria across nine article variants at two
  viewports.

---

## Original plan (approved 2026-08-08)

Target: `website/src/app/blog/[slug]/page.tsx` + `post.module.css` and the blog CTA components.

Evidence base: Google Search Console pull `scripts/gsc-audit-data.json` (2026-05-07 → 2026-08-05),
a live Sanity query over all 128 published posts, and a headless-Chrome measurement of the live
reading column. Numbers below are measured, not estimated.

---

## 0. The finding that reframes the brief

The brief says the CTAs "are not generating clicks." They are not, but the dominant cause is not CTA design.

| | pages | clicks (90d) | impressions | CTR |
|---|---|---|---|---|
| Blog posts | 204 | **119** | 67,012 | **0.18%** |
| Non-blog pages | 71 | 162 | 17,673 | 0.92% |

**119 organic clicks in 90 days across the whole blog — about 1.3 readers per day.** Nine posts carry
85 of those 119 clicks. At that volume even a best-in-class page converting at 5% yields ~6 CTA clicks
per quarter. No layout can fix that.

The blog sits on 67,012 impressions, with 88 posts ranked at positions 6–10 earning 0.17% CTR against
a ~2–3% par for those positions. **The bottleneck is the search result, not the page.** The redesign is
worth doing, but it earns its keep by fixing the SERP chokepoint first and being ready to convert second.

### The specific SERP defect (page-level, one line of code)

`page.tsx:36` renders `<title>` as `` `${title} | ${site.name}` ``. Measured across all 128 posts:

- median metaTitle length: **54 chars** — well written, within budget
- metaTitle alone over 60 chars: **3 posts (2%)**
- metaTitle **+ `" | Chronexa"`** over 60 chars: **102 posts (80%)** → truncated in the SERP

Example rendered title: `Firm360 API Access: Why AI Vendors Get Blocked & What Works | Chronexa` (70 chars).
The keyword-bearing tail is cut. Every post title was written to a ≤65-char budget per the blog
doctrine, and the template then blows that budget on 80% of them.

### Second-order finding (flagged, out of scope)

The top impression drivers are off-strategy n8n developer tutorials — ~24,000 impressions across five
posts, near-zero clicks, and the wrong buyer entirely (`blog-seo-strategy` §2: "Never developers").
Optimising CTAs on those pages is wasted effort. Worth a separate decision on pruning/repositioning.

---

## 1. Current page audit

### Working — preserve deliberately

- **CMS hygiene is exceptional and rare.** Across 128 published posts: 100% have key takeaways, hero
  image, hero alt text, author, excerpt, reading time, industry and topic; 100% metaDescription,
  99% metaTitle; 95% have ≥3 H2s so the TOC renders. Nothing in the redesign may regress this.
- **`normalizeHeadings()`** (`page.tsx:50`) re-levels imported posts' broken outlines by nesting depth
  so there is exactly one H1 and no skipped levels. Genuinely good; keep as is.
- **Schema graph** — BlogPosting + BreadcrumbList + conditional FAQPage, with the breadcrumb mirroring
  the visible trail exactly. Correct.
- **Static rendering** — `generateStaticParams` + `revalidate = 3600`. Fast by construction.
- **Shared anchor slugifier** so TOC links and heading ids can never drift apart.
- The **`:not(.btn-primary)` guards** on prose link colour — a real bug fix, do not "clean up."

### Weak

1. **Title truncation on 80% of posts** (above). Highest-value defect on the page.
2. **Reading measure is too wide.** Measured on the live page: 760px column at 16.8px Host Grotesk =
   **88 characters per rendered line**. Comfortable sustained reading is 66–75.
3. **Body text is styled as secondary UI text.** `.body p` uses `--text-muted-light` `#6B6862` =
   5.32:1 on paper, while headings are `#1A1A17` = 16.71:1. A 3× contrast gap between heading and
   body across a 2,000-word article. Body copy should be the darkest sustained element on the page.
4. **The excerpt is 100% populated and 0% rendered.** No standfirst/deck. Free reading and AEO win.
5. **Two bordered boxes stack before the first sentence** — key takeaways box, then TOC box, both
   full-width bordered cards. On a 390px viewport the reader scrolls past two panels to reach prose.
6. **TOC is a static one-shot list**, not sticky. Median post has 7 H2s and ~42 blocks; once scrolled
   past, the reader has no way back to the outline.
7. **0% of posts contain a single in-body image.** Median 42 blocks of unbroken prose, no pull quotes,
   no callouts, no visual rhythm. This is the biggest *reading* problem and the page currently offers
   the writing no device to fix it.
8. **Five CTAs, one message.** Sticky floating card + mid-article inline + newsletter + related
   services + end CTA. The problem is sameness, not frequency — most resolve to "book a call."
9. **Amplitude Session Replay runs at 100% sampling** on every article (`Analytics.tsx`). Heaviest
   third-party on the page; a direct INP cost with no reader benefit at this traffic level.
10. **Hero over-fetch** — requested at 1600×840, displayed at max 900px.
11. **FAQPage rich results were deprecated by Google in May 2026.** The markup is still valid and is
    still consumed by Bing/Perplexity/RAG crawlers, so keep it — but stop treating it as a traffic lever.

---

## 2. Research findings that actually drove decisions

- **Line length.** Measured, not assumed: 760px/16.8px = 88 chars. Raising type *and* narrowing the
  column both push toward the 66–75 target. Computed options (Host Grotesk, rendered-calibrated):
  18px/680px → 73 · 19px/660px → **68** · 20px/680px → 66. Mobile at 350px: 18px → 38 chars, comfortable.
- **Editorial practice.** Medium (~21px), Stripe (~18px), HBR and NYT all run body copy at or near the
  darkest text on the page and hold 65–75 chars. None of them mute their body copy. The principle
  worth taking is *contrast hierarchy by size and weight, not by colour* — grey body text is a UI
  convention that does not survive long-form.
- **Answer-engine citation (2026).** What earns citation is answer-first structure where the visible
  content matches the marked-up content, current-year signals, and dense internal linking (2–4 links
  to existing authoritative posts per piece). Chronexa already has the takeaways; the missing surface
  is a rendered standfirst that states the answer before the fold.
- **Structured data (Google, 2026).** Article/BlogPosting, BreadcrumbList and Organization remain
  fully supported. FAQ and How-to rich results are gone. Conclusion: no new schema investment beyond
  tightening what exists.

---

## 3. Proposed article architecture (top → bottom)

```
1  Breadcrumb                     Home / Blog / Industry / Title      (keep — feeds schema)
2  Industry eyebrow               linked to the hub page              (new, scannable)
3  H1
4  Standfirst                     the excerpt, ~20-30 words, 21px     (NEW — answer before the fold)
5  Byline row                     author · role · date · reading time (keep, tighten)
6  Hero image
7  "What matters most"            key takeaways, restyled as an       (restyle, not a bordered box)
                                  answer block, not a card
8  ARTICLE BODY                   sticky TOC in the desktop gutter    (TOC moves out of the flow)
     └ one contextual CTA at the section boundary past the midpoint
     └ FAQ (already authored in-body)
9  Conversion block               intent-matched — see §5
10 Author credibility box
11 Related articles (3)
12 Related services (money links)
   Footer
```

Removed or demoted: the newsletter box (weakest ask on the page, sits inside the body, competes with
the conversion block). The end-of-article button row collapses into the §5 conversion block.

Rationale for the order: the article ends → the single strongest ask fires while intent is highest →
credibility justifies the ask → related reading catches the readers who did not convert. Today the
strongest ask is dead last, after four other blocks.

---

## 4. Reading experience decisions

| Decision | Value | Why |
|---|---|---|
| Body size / column | **19px / 660px → 68 chars per line** | Measured. Current is 88; 66–75 is the comfort band. Bigger type *and* a narrower column both move toward it. |
| Body colour | `--text-light` `#1A1A17` (16.7:1) | Body is the reading surface, not secondary UI. Grey body over 2,000 words is the single biggest perceived-difficulty lever. |
| Line height | 1.7 | Roughly current (1.75), correct for the new size. |
| Hierarchy | by size + weight + space, not colour | H3 currently renders in green ink; at 5 H3s per post that is decorative noise. |
| Section spacing | space *above* a heading ≫ below it | Binds a heading to its own section instead of floating between two. |
| Mobile body | 17.5–18px, full width less padding → ~38 chars | Comfortable; current 16.8px is small for sustained mobile reading. |
| TOC | sticky in the right gutter ≥1100px; `<details>` on mobile | The gutter beside a 660px column is dead space; a sticky outline is navigation, a static list is decoration. Zero JS via CSS `position: sticky`. |
| New body devices | pull quote, callout, comparison table, figure+caption | 0% of posts have in-body imagery. Give the writing something to break 42 blocks of prose with. |

Reading progress bar: **not recommended.** It costs a scroll listener and a fixed element on a page
whose problem is that too many fixed elements already compete. Reading time in the byline does the job.

---

## 5. Lead generation

### Why the current CTAs fail — in order of size

1. **Volume.** ~1.3 organic readers/day. Dominant cause; not fixable by design.
2. **Intent mismatch on the posts that actually earn traffic.** The three highest-earning posts are
   agency-comparison listicles (`top-ai-automation-agencies-*`, 28 + 12 + 7 clicks). That reader is
   mid-shortlist asking "who do I hire." `CALC_RULES` matches none of them, so they fall through to a
   generic "Book a Free Strategy Call." The right next step for a shortlisting reader is *evidence* —
   what we would build, in what shape, at what cost — not a calendar link.
3. **Ask size.** A 15-minute call with a stranger is a large first ask for a cold organic reader. The
   calculator is the correctly-sized ask ("2 minutes, no email") but only fires for legal / tax /
   document topics. Every other post gets the big ask by default.
4. **Sameness, not scarcity.** Five placements delivering one message. Repetition without escalation
   reads as pressure and converts worse than a single well-placed ask.

### Proposal — three intent tiers, one visible ask at a time

- **Tier A — comparison / vendor-selection posts (where the traffic is).** Replace the generic call
  with a concrete scope block: what Chronexa would build for this problem, the delivery shape, the
  price band, then book-a-call as the action. Answers the question the reader is actually holding.
- **Tier B — cost / problem posts with a calculator fit.** Keep calculator-first. This tier is already
  right and should not be touched.
- **Tier C — everything else (the current gap).** Needs a low-friction, topic-matched asset instead of
  a call — a checklist or scorecard per active cluster. **This requires content that does not exist
  yet** (see §9 open decision).

The mid-article CTA keeps its midpoint placement but its copy draws on the post's own industry/topic
labels (100% populated) so it references what the reader just read. The sticky card loses its
multi-line card form and becomes a single-line bar with one action.

Honest gap: **I do not have the current CTA click-rate baseline.** It lives in Amplitude
(`book_cta_click`, `calculator_cta_click`, `blog_post_view`), which is not queryable from here.
Baseline must be pulled before implementation so the change is measurable rather than asserted.

---

## 6. SEO plan

**Do:**
1. **Drop the `" | Chronexa"` suffix from article titles.** Fixes truncation on 80% of posts. Google
   appends the brand itself where it helps; `og:site_name` retains it for social. Biggest single win.
2. **Render the excerpt as a standfirst.** Answer-first content above the fold — the surface AI
   engines lift. Currently written for every post and thrown away.
3. **Fix hero image sizing** (requested 1600w for a ≤900px slot) and give the in-body image renderer
   `next/image` with explicit dimensions before we start adding body images — the current raw `<img>`
   is a latent CLS source.
4. **Verify every post links up to its pillar page** (doctrine §3: CPA posts → `/cpa-tax-document-automation`).
   Today `relatedServices()` falls back to three generic slugs when no keyword rule matches.
5. Add `wordCount` + `articleSection` to BlogPosting. Cheap, and section is 100% populated.

**Explicitly do not:**
- Add new schema types chasing rich results that no longer exist (FAQ, How-to — retired May 2026).
  Keep the existing FAQPage markup, invest nothing further in it.
- Add a reading-progress bar, social share buttons, or comment affordances. None of them serve
  readability, SEO or conversion at this traffic level.

---

## 7. Mobile

Mobile is where the current furniture hurts most, and mobile is not a narrower desktop.

- Body to 17.5–18px (≈38 chars/line at 390px — measured, comfortable). Current 16.8px is undersized.
- **Collapse the pre-article furniture.** Takeaways stay open (they are the payoff); the TOC becomes a
  closed `<details>`. Today two bordered panels stand between the reader and the first sentence.
- **Sticky CTA becomes one line, one action, ≥44px touch target.** The current bar stacks eyebrow +
  headline + sub + button + secondary link, consuming a large share of a small viewport.
- Tables keep `overflow-x: auto` and gain a fade edge so the scroll affordance is visible.
- Boxed sections lose their side borders and become full-bleed tinted bands — borders inside a 350px
  column waste horizontal space on decoration.

---

## 8. Implementation plan

**Modify**
- `website/src/app/blog/[slug]/page.tsx` — title suffix, standfirst, eyebrow, section reorder, schema
  additions, image sizing, TOC into the gutter.
- `website/src/app/blog/[slug]/post.module.css` — type scale, column width, body colour, spacing
  rhythm, sticky TOC, mobile rules, new body devices.
- `website/src/components/BlogStickyCta.tsx` + `.module.css` — single-line mobile bar.
- `website/src/components/BlogInlineCta.tsx` — context-aware copy.
- `website/src/lib/blog-links.ts` — intent tiering (§5), pillar-link guarantee.
- `website/src/components/Analytics.tsx` — Session Replay sampling down from 100%.

**Create**
- `website/src/app/blog/[slug]/ArticleToc.tsx` — sticky outline (CSS-only sticky; no scroll listener).
- Optionally a `callout` / `pullQuote` Portable Text type in `website/src/sanity/schema/post.ts` if
  we want the writing to use the new body devices (small schema addition, additive, safe).

**Do not touch**: `normalizeHeadings`, the anchor slugifier, the breadcrumb/schema pairing, ISR config,
or anything that would regress the 100% CMS field coverage.

Sequencing: title fix ships first and alone — it is one line, it is the biggest lever, and shipping it
separately makes its effect measurable in GSC against everything that follows.

---

## 9. Success criteria

| Dimension | Target | How measured |
|---|---|---|
| SERP CTR | blog CTR 0.18% → **≥1.2%** in 8 weeks on the 41 posts at positions 4–10 | GSC re-pull, same script |
| Readability | 66–75 chars/line desktop, ~38 mobile; body contrast ≥8:1 | headless-Chrome measurement, same method as this audit |
| Conversion | CTA click rate ≥3% of `blog_post_view` | Amplitude — **baseline must be pulled first** |
| Performance | LCP no worse; INP improved | Session Replay sampling + hero sizing |
| Data integrity | 128/128 posts keep takeaways, hero, alt, author, excerpt, taxonomy | re-run the Sanity audit query |

"Done well" = a reader on a phone reaches the first sentence without scrolling past two panels, reads
2,000 words without strain, and meets exactly one ask that refers to what they just read.

---

## Open decisions for Ankit

1. **Tier C assets don't exist.** The "not a call" ask needs a real checklist/scorecard per cluster.
   Build three (CPA, Legal, Wealth), or ship Tiers A and B now and leave C on the generic call?
2. **Amplitude baseline.** Pull blog CTA click-rate before implementation, or accept baseline-at-ship?
3. **Session Replay** at 100% on blog — sample down to 10%, or exclude `/blog` entirely?
4. **The n8n developer posts** (~24k impressions, wrong buyer) — separate decision, not this task.
