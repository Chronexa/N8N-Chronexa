# Backlink Playbook — Chronexa.io (White-Hat, No Ahrefs Budget)

*Replaces the earlier draft of this doc, which recommended fake "scholarship" outreach to
university financial-aid offices, fabricated statistics fed to journalists, buying
undisclosed paid links, and hijacking expired domains. Those tactics are Google Spam
Policy violations (manual-action / de-index risk on the whole domain) and several cross
into actual fraud or deceptive-advertising territory (FTC disclosure rules on paid links,
misrepresentation to universities). None of it is used here. This doc replaces it with the
real, slower, compounding plan — same one referenced in the 2026-06-08 SEO forensic audit.*

**The core finding driving this plan:** the site's ranking ceiling isn't on-page content
anymore (that work is done — 4 pillars, 16 vertical tool pages, decision-maker blogs). It's
domain authority. 89K Google impressions in 90 days produced 177 clicks (0.2% CTR) and the
29 commercial pages (legal/CPA/finance) get close to zero impressions at all. Backlinks are
the lever that moves both numbers. No Ahrefs budget — everything below uses free data
(Ahrefs Webmaster Tools for the verified domain, Google Search Console, Bing Webmaster
Tools) instead of a paid subscription.

---

## 1. Directory & category listings (fastest, lowest effort)
Get Chronexa listed under the *specific* categories a law-firm or CPA-firm buyer searches,
not generic "AI agency" — that's where the commercial pages need the authority, not the
blog.
- **Clutch** — list under "AI Consulting" + tag legal/accounting industry focus. Clutch
  profiles rank well for "[category] agency" searches directly.
- **G2 / Capterra** — only worth it if there's a demoable product angle (the calculators
  qualify); otherwise skip, low relevance for a services firm.
- **Crunchbase** — company profile with the real founders, funding-free but still a
  DR-relevant, low-effort `dofollow`.
- Legal-industry-specific: **Bar & Bench**, **LawSikho** directories, **ILTA** (International
  Legal Technology Association) vendor listings if there's a self-serve tier.

## 2. Digital PR — pitch the work, not manufactured stats
Chronexa's real moat is delivered work competitors can't claim (legal RAG for one of
India's largest corporate litigation firms, CPA tax copilots, HFT/quant systems). Pitch
*that*, honestly, to the trade press the buyer actually reads:
- **Bar & Bench** (India legal news) — pitch a bylined piece or a "how AI is changing
  regulatory tracking for Indian law firms" contribution, referencing the real litigation-firm
  work (anonymized per client NDA, per how the case studies already run). Outstanding
  action item from the 2026-06-08 audit — draft below.
- **Featured.com / Connectively (formerly HARO)** — respond to journalist queries tagged
  legal-tech, accounting-tech, fintech. Free, and every accepted pitch is a citation from a
  writer already covering the niche.
- Trade pubs for the other two verticals once Bar & Bench lands: **Accounting Today** /
  **CPA Practice Advisor** (CPA vertical), **AdvisorHub** / **Wealth Management magazine**
  (RIA/wealth vertical).

## 3. The n8n ecosystem (still relevant — it's the wedge, not the brand)
Chronexa's n8n content already ranks (just for the wrong audience). Turn that into
authority instead of ignoring it:
- Submit any reusable n8n templates to **n8n's own template library** — official
  `dofollow` link back, and it's the single most topically-relevant placement available.
- GitHub: if any internal tooling is safe to open-source (a small utility, not client work),
  a real repo with real stars earns natural links over time — no fabrication needed.

## 4. Measurement (free tools only)
- **Ahrefs Webmaster Tools** — free for a verified domain, gives real backlink data without
  the paid plan.
- **GSC Links report** — dashboard-only (not in the API), check monthly.
- **Bing Webmaster Tools** — same idea, secondary signal.
- Re-baseline the tracked keyword list quarterly and compare against Automaly.io (the one
  real competitor worth watching — see positioning strategy) to see if the gap is closing.

---

## What NOT to do (kept as an explicit list, since the deleted version normalized these)
- No fake awards/badges designed purely to bait a `dofollow` link.
- No buying or renewing expired domains to redirect their link equity.
- No fabricated statistics presented to journalists as real research.
- No paid link insertions without disclosure (`rel="sponsored"`) — and generally just don't.
- No scholarship or "grant" pages whose real purpose is a link, not the stated offer.

This is slower than the growth-hacker version. It's also the version that doesn't risk a
manual action wiping out the content work already shipped.
