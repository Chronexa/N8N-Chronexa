# Dubai / UAE Push — Implementation Plan

**Created:** 2026-07-21. **Basis:** `dubai-competitor-keyword-research-2026-07-21.md` + live GSC + site audit.
**Goal (the only metric that counts):** UAE `book_cta_click` + calculator leads — not traffic. Sequence is ordered by ROI: convert what already ranks first, then build defensible content, then chase traffic.

**Repo mechanics confirmed (build against these, not guesses):**
- Geo/service pages = a thin `src/app/<slug>/page.tsx` (~15 lines) that renders a content object in `src/lib/services-content.ts`. The template to clone is the existing geo page **`us-ai-automation-agency`** (`kind: 'geo'` in `src/lib/taxonomy.ts`, content object + section block at ~line 4019 of `services-content.ts`).
- Internal linking is driven by regex rules in `src/lib/blog-links.ts`. **There is currently NO dubai/uae/geo rule** — so every UAE blog post links to the wrong (fallback) service pages. Fixing this is a prerequisite, not a nicety.
- Blog posts publish via the 5-agent Sanity pipeline; the Strategist agent pulls the top-priority `queued` row from Baserow **Keyword Backlog (table 1022496**, fields Keyword/Layer/Vertical/Priority/Status). Log keywords there BEFORE writing.
- Leads dual-write to Baserow **Website Leads (table 1015183)** + Google Sheet. Track UAE results in GSC with a country=UAE filter.

---

## Phase 0 — Foundation: the Dubai/UAE landing page (Week 1) · HIGHEST ROI
We rank page 1 on four commercial terms with **nothing to convert the click**. Fix that first; everything else links into it.

- [ ] **Build `ai-automation-agency-dubai`** (primary page). Clone the `us-ai-automation-agency` pattern:
  - Add content object in `services-content.ts` (slug `ai-automation-agency-dubai`, hero, 3–5 sections, FAQ, `related[]`).
  - Add thin `src/app/ai-automation-agency-dubai/page.tsx`.
  - Register in `taxonomy.ts` CLASSIFY as `kind: 'geo'`.
  - **Angle:** enterprise / self-hosted / **UAE data residency & sovereignty**, regulated-vertical proof, AED framing, calculator-first CTA. This is our differentiator vs thin local shops — lead with it.
  - Target terms: "ai automation agency dubai", "ai automation uae", "workflow automation dubai".
- [ ] **Add the missing `blog-links.ts` rule:** regex `/dubai|uae|emirates|abu dhabi/i` (title/category/slug) → link to `ai-automation-agency-dubai`. Prerequisite for all UAE content linking.
- [ ] **Repoint internal links** from the 4 ranking blog posts + the 4 existing UAE Sanity posts → the new page.
- [ ] Confirm it enters `sitemap.ts`; submit URL in Search Console.
- [ ] (Optional, we're already ~#2) spin an **`ai-automation-agency-abu-dhabi`** variant from the same object once the Dubai page is proven.

**Done when:** the four terms have a conversion page live + indexed; first UAE calculator/booking leads tracked.

---

## Phase 1 — Fix & convert existing UAE assets (Week 1–2) · cheap climbs
- [ ] **Refresh the listicle** "Top 10 AI Automation Agencies in UAE (Dubai & Abu Dhabi)" (currently pos ~25). Update for 2026, add a differentiator column (enterprise / self-hosted / data-sovereignty), include ourselves honestly, internal-link to the new geo page. Target: climb toward page 1 for "best/top AI automation agencies UAE".
- [ ] **De-stale** "AI Agent Platforms for UAE Businesses: **2024** Guide" → 2026, refresh content.
- [ ] **Strengthen** the post ranking ~#8 for "ai automation uae" (add depth, FAQ, internal links) to push into the top 5.

**Done when:** the three existing rankings move up; all UAE posts link to the geo page.

---

## Phase 2 — On-strategy vertical-geo content (Weeks 2–5) · the defensible core
Aligned to our regulated/enterprise ICP and to service pages that already exist. This is where the data-sovereignty story actually converts. Log each to Keyword Backlog first; write to doctrine (buyer-words open → 3–5 H2 incl. compliance → PAA FAQ → calculator-first CTA → service-page links).

- [ ] **VAT automation for UAE SMEs / FTA e-invoicing** — the "how": n8n reads invoice → applies VAT codes → prepares FTA-compliant report. Links `finance-automation` + CPA calculator. (Real FTA rules only.)
- [ ] **n8n finance workflow examples — UAE edition** (VAT capture, FTA e-invoicing, AED multi-entity close). Links `finance-automation`.
- [ ] **Legal workflow automation UAE** — AI legal workflow vs case-management software. Links `legal-due-diligence-automation`.
- [ ] **Wealth-management UAE** — extend the cluster we already own (RIA compliance UAE / advisor onboarding). Links `ria-compliance-automation` / `financial-services-automation`.
- [ ] **Clinic / healthcare workflow automation UAE** — no-show/reschedule/EMR sync (secondary vertical, weak SERP, worth one post).

**Done when:** 5 posts live, each linking the geo page + correct vertical service page; on-strategy UAE cluster established.

---

## Phase 3 — Top-of-funnel traffic grabs (Weeks 4–7) · selective, keep enterprise framing
Higher traffic, off-core. Every post must route to an enterprise/n8n payoff — do NOT position us as an SMB WhatsApp shop.

- [ ] **Real estate CRM + WhatsApp automation Dubai** — speed-to-lead teardown (Property Finder/Bayut/Dubizzle lead → WhatsApp reply <60s), data stays in UAE. Links `property-management-automation`.
- [ ] **WhatsApp Business API cluster** (setup + pricing UAE + API-vs-app), each ending in an n8n automation payoff.
- [ ] **Freight / logistics AI automation Dubai** — underserved (Jebel Ali); 5 concrete freight automations. New vertical to own early.

---

## Phase 4 — Bottom-funnel commercial (Weeks 6–8)
- [ ] **n8n agency pricing / AI automation cost Dubai (AED bands)** — ties to our ROI calculators; live query nobody localizes.
- [ ] **Migrate from Zapier/Make to n8n** — AED + sovereignty math + "we'll migrate your top 10 Zaps" CTA (→ geo/service page).
- [ ] **n8n vs AI agents in Dubai** — our wheelhouse (we run both n8n + Anthropic); decision tree.

---

## Ongoing (parallel from Week 1) — Authority & off-page
The GSC forensic finding stands: our constraint is **authority, not on-page**. Content alone won't fix rankings.
- [ ] Get listed in the directories & roundups that already rank: **Clutch, GoodFirms**, and the apptunix / anvenssa / whirlocal "top agencies" listicles.
- [ ] Publish **1–2 first-party UAE case studies** (`case-studies` route exists) with named workflow + hours saved + AED impact. First-party proof is the one thing competitors can't copy.

---

## Milestones & success metrics
- **30 days:** Dubai page live + indexed; `blog-links.ts` rule shipped; 3 existing UAE posts refreshed; first UAE lead tracked.
- **60 days:** 5 on-strategy vertical-geo posts live; "ai automation uae" into top 5; listed in ≥2 directories.
- **90 days:** full cluster + bottom-funnel posts; "ai automation agency dubai" onto page 1; measurable UAE `book_cta_click`/calculator leads in GSC (country=UAE) + Baserow Website Leads.

## Dependencies / order-of-operations
1. Phase 0 page + `blog-links.ts` rule must land before any Phase 2–4 content (they all link to the geo page).
2. Log every target keyword to Keyword Backlog (1022496) before writing, so the automated pipeline can pick it up.
3. Authority/off-page runs in parallel from day one — it's the slow lever, start it early.

## Owner split
- **Dev/build (manual):** Phase 0 page, `blog-links.ts` rule, listicle refresh, case-study pages, directory listings.
- **Automated pipeline:** Phase 2–4 blog posts (queue in Baserow → Strategist→Copywriter→Publisher), with human review against the doctrine checklist before publish.
