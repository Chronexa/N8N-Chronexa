# /n8n-ai-automation-startups — visual plan (final)

Companion to `n8n-startup-landing-copy.md` (v3). Rewritten 2026-08-02 to Ankit's final
direction. Earlier drafts of this file proposed dark bands, animated threads and app-window
mockups. All removed. Nothing here is waiting on anyone.

---

## The rules this page follows

1. **No black or dark backgrounds anywhere on the page.** Warm paper and white only.
2. **Simple colour.** One green, used sparingly. Grey for supporting text. Nothing else.
3. **Neatness first.** Clear type hierarchy, generous space, everything easily readable.
4. **Minimalist.** No animation, no mockups, no textures, no gradients, no decoration.
5. **Mobile first.** Designed for a phone, then widened for desktop.
6. **No emojis. Natural human writing** — plain sentences, no marketing cadence.
7. **No founder photos.** We don't have them and we're not waiting for them.

The site's own header and footer stay as they are — this covers the page body.

---

## Colour and type

**Backgrounds.** Only three: warm paper `--bg-light` (#FBFAF7) as the default, warm sunken
`--bg-sunken` (#F3F1EA) for alternating bands so sections separate without lines, and white
`--bg-card` (#FFFFFF) for panels that sit on top.

**Green.** `--brand-green-ink` (#2F6B3A) for green text — it meets contrast on light
backgrounds, the neon green does not. Solid green fill is used for exactly one thing: the
primary button. Nowhere else.

**Text.** `--text-light` (#1A1A17) for everything you must read. `--text-muted-light`
(#6B6862) for supporting lines and sources. No third grey.

**Type.** Fraunces for headings only. Host Grotesk for all body text, at `--step-0`
minimum — no small print except source lines. Body copy capped at 65 characters per line.
Everything left-aligned; nothing centred except the closing call to action.

**Borders.** One hairline weight, `--border-light`. No shadows except `--shadow-sm` on the
form. No rounded corners beyond `--radius-md`.

**Removed from earlier drafts:** `.grid-texture`, `--panel-grad-*`, `--shadow-lg`,
`--shadow-glow`, the amber accent, `section-dark`, all `motion/react` animation.

The amber "human gate" is replaced by a plain line of text reading "A person still
decides: …" — clearer than a colour, and it works for colour-blind readers.

---

## Page structure

Eleven sections. Bands alternate paper / sunken so they separate without dividers.

| # | Section | Band | What it is |
|---|---|---|---|
| 1 | Hero | paper | Headline, four lines of explanation, the form, call and WhatsApp buttons |
| 2 | Credibility strip | sunken | One row. Proof of work, not people. See below |
| 3 | Three numbers | paper | What the mess costs, each with its source printed |
| 4 | Soft CTA row | paper | One line and a button, for people already convinced |
| 5 | Five situations | sunken | The heart of the page. See below |
| 6 | Our own systems | paper | Our outbound engine and content pipeline, described plainly |
| 7 | What it costs | sunken | Answers the fear, not the number. See below |
| 8 | Build it yourself? | paper | The honest answer |
| 9 | What stays human | paper | Short |
| 10 | Questions | sunken | Existing accordion, restyled light |
| 11 | Closing ask | paper | Repeat the form, plus call and WhatsApp |

---

## Section 1 — Hero

Single column on mobile: heading, then explanation, then the form, then the two buttons.
Two columns above 900px, text left, form right. The form keeps its existing `/api/contact`
wiring, which is tested and working.

The heading uses one green italic phrase — "with the team you already have" — and that is
the only green on the screen apart from the button. No logos here.

---

## Section 2 — Credibility strip

We have no founder photographs, so this proves the work instead. One row, small text, no
images of people:

- "We run our own sales outreach and this blog on the same systems we build for clients."
- A single row of small logos for tools we genuinely build with.
- "Chronexa · India · we reply on WhatsApp within the hour, 9am to 9pm IST."
- The WhatsApp number written out as tappable text.

A number a real person answers is a better trust signal in this market than a headshot, so
this is not a compromise. If photographs ever exist they drop into the same row.

---

## Section 5 — The five situations

One white panel containing five full-width rows, divided by hairlines. Not five floating
cards, and not a filterable gallery — the gallery is what made the current page look like a
template.

Each row, top to bottom:

1. **The situation, as one bold line** in the founder's own words. Scannable at speed —
   someone should find the one that is theirs without reading the rest.
2. **Today** — three or four plain lines describing how it works now.
3. **With Chronexa** — the same, describing how it works after.
4. A small row of the real tool logos involved.
5. One muted line: "A person still decides: …"

On mobile, Today and With Chronexa stack vertically with a hairline between them. Above
900px they sit side by side in two columns. No toggle, no animation, no diagram. The
comparison does the work.

---

## Section 7 — What it costs

We are not inventing a price, and we are not leaving the question unanswered either. This
section answers what the founder is actually worried about:

> Fixed price, agreed in writing before we start. One payment for the build, not a monthly
> licence. Two to three weeks. Thirty days of support included. You own the files, so if
> you walk away it keeps working. No per-task fees, and nothing switches off when you stop
> paying us.

Then three short lines on what changes the price: how many systems, how many tools they
connect to, and whether it runs on your servers or ours.

In code this sits behind one constant, `PRICE_FROM`, set to `null`. The number line does
not render. The day a figure is chosen it is a one-line change and "Most first builds
start at ₹X" appears. No redesign needed.

---

## Mobile

Mobile is the design target — most of the traffic will be on a phone.

- Single column throughout. Nothing needs sideways scrolling.
- Tap targets at least 44px. Buttons full width on small screens.
- A sticky bar at the bottom with Call and WhatsApp, always reachable. It hides while the
  form is being filled so it never covers the submit button.
- No animation means the page is light and loads fast, which matters more than any effect.

---

## Writing rules for the copy

The copy in `n8n-startup-landing-copy.md` gets one pass before it goes in:

- No emojis anywhere.
- Plain sentences of varied length. No "not just X, but Y". No three-item rhythms used for
  effect. No dashes standing in for full stops.
- Say the ordinary word. "Reply", not "respond". "Costs", not "incurs".
- Nothing that sounds like marketing wrote it.

---

## Build order

Seven steps. After step four the page is already better than what is live, so it can ship
early if wanted.

| # | Step | Files |
|---|---|---|
| 1 | Remove the nine-card gallery, category filter, 30-logo cloud and stat row. Keep the hero form and its wiring. | `N8nStartupPage.tsx`, `.module.css` |
| 2 | Rebuild the hero, add the credibility strip and the sticky mobile bar | same, plus `CredibilityStrip` |
| 3 | Three-number panel with sources, and the soft CTA row | `ImpactNumbers` |
| 4 | The five-situation panel | `SituationPanel` + data file |
| 5 | Our own systems, described plainly | inline |
| 6 | Cost, build-it-yourself, what stays human | inline |
| 7 | Questions and closing ask, restyled light | inline |

Then build, check on a real phone, deploy with `vercel --prod --yes` from `website/`
(pushing to git does not deploy this project), and re-test the form end to end.
