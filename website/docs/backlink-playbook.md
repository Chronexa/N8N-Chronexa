# Backlink Playbook — chronexa.io (zero budget)

_Companion to [seo-forensic-audit.md](./seo-forensic-audit.md), Finding 5 (off-page / authority). No paid tools required._

Authority is the ceiling on chronexa.io's rankings — the site ranks position 7–8 and can't break into the top 3 because the domain has few referring domains. This playbook is how to fix that for free.

---

## Step 0 — Get backlink data for free (no Ahrefs subscription)

You do **not** need a paid plan to see your own backlinks. Set up all three:

1. **Ahrefs Webmaster Tools (AWT)** — free. Verify ownership of chronexa.io (easiest: via the existing Google Search Console connection). Gives backlinks, referring domains, anchor text, and a site audit for your own domain. This replaces the paid Ahrefs dependency for monitoring our own profile.
   → https://ahrefs.com/webmaster-tools
2. **Google Search Console → Links report** (left sidebar in the GSC dashboard). Shows top linking sites, most-linked pages, and anchor text. It's your own first-party data. _(Note: this report is dashboard-only — not exposed in the GSC API our scripts use.)_
3. **Bing Webmaster Tools** — free, separate backlink index; catches links Google/Ahrefs miss.
   → https://www.bing.com/webmasters

The paid Ahrefs plan only matters for spying on **competitors'** backlinks — a later nice-to-have, not needed to start.

**Baseline task:** record current referring-domain count from AWT so progress is measurable. Re-check monthly.

---

## Tier A — n8n ecosystem (highest relevance, do first)

Chronexa is an n8n shop, so links from the n8n ecosystem are the most topically relevant and the easiest to earn. These move the needle more than generic directories.

- **n8n template hub** — publish 3–5 of your real production workflow templates (sanitised). Each gets a creator profile link back to chronexa.io. → n8n.io workflow templates / creator program.
- **n8n community forum** — create a company/expert profile; answer questions in your verticals (legal/finance/insurance automation), linking to the relevant service page or blog only where genuinely helpful.
- **n8n "experts / partners" listing** — apply to be listed as an n8n implementation partner if eligible.
- **Reddit** — r/n8n, r/automation, r/nocode: answer real questions; link to the already-performing assets (n8n-vs-Zapier cost analysis, agency-pricing breakdown) where they directly answer the question.

## Tier B — Citation / directory links (foundational, one afternoon)

Consistent NAP (Name, Address, Phone) across all. Submit to:

- Clutch.co, G2, Capterra, GoodFirms, DesignRush, TrustRadius (B2B service directories)
- Crunchbase (company profile)
- LinkedIn company page (already exists — ensure website link is set)
- The Manifest, Sortlist, UpCity (agency directories)

These are low-authority individually but establish baseline trust signals and consistent brand entity data.

## Tier C — Digital PR (free, earns high-authority news links)

Respond to journalist queries as an AI-automation expert. Founders (Abhishek/Ankit/Tushar) answer 2–3 relevant queries per week:

- **Featured.com** (free Q&A, formerly Terkel)
- **Connectively** (the HARO successor)
- **Qwoted**, **SourceBottle**

A single answer picked up by a news/industry site is worth more than dozens of directory links.

## Tier D — Linkable assets + outreach (ongoing)

- **Promote what already ranks.** The n8n-vs-Zapier cost analysis and the agency-pricing transparency post are naturally citable. Share them where people debate these topics; they earn links passively.
- **Write the "self-hosting n8n" content-gap post** (flagged in the audit) — 5 existing posts want to link to it internally, and it targets a query already earning ~3.3k impressions.
- **Unlinked-mention reclamation** — Google `"Chronexa" -site:chronexa.io`; where you're mentioned without a link, email and ask for one.
- **Founder personal brand** — Ankit/Tushar posting on LinkedIn consistently; personal profiles now in the site's Person schema (E-E-A-T) so they reinforce each other.

---

## Priority order for the first 30 days

1. Set up AWT + Bing WMT; baseline referring domains (Step 0).
2. Publish 3 n8n templates + create forum/Reddit presence (Tier A).
3. Submit to the Tier B directories (one batch).
4. Start a weekly Featured.com/Connectively answering habit (Tier C).
5. Write the self-hosting-n8n post (Tier D).

Re-measure referring domains in AWT monthly. Authority compounds slowly — expect ranking movement over 2–3 months, not weeks.
