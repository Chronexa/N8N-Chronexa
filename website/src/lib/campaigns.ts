/**
 * Registry of every landing page Chronexa runs — organic service pages that live in the
 * nav, paid ad pages that deliberately do not, and pages hosted outside this repo.
 *
 * This is the single place to look when you cannot remember what exists or where it is.
 * It powers the private index at /internal/campaigns (noindex, unlinked).
 *
 * ADDING A NEW LANDING PAGE — one entry here, then:
 *   traffic: 'organic'  → also add it to CLASSIFY in taxonomy.ts (puts it in the nav +
 *                         the /solutions or /use-cases hub). sitemap.ts picks it up
 *                         automatically via services-content.ts.
 *   traffic: 'paid'     → do NOT touch taxonomy.ts or sitemap.ts. Set
 *                         `robots: { index: false, follow: true }` in its page.tsx so it
 *                         cannot compete with the organic page covering the same topic.
 *   traffic: 'external' → hosted in another repo/Vercel project; record the full URL.
 */

export type CampaignTraffic = 'organic' | 'paid' | 'external';

export type CampaignPage = {
  /** Route on chronexa.io (no leading slash), or a full URL when traffic is 'external'. */
  path: string;
  /** Plain-English name — how you'd refer to it in conversation, not the SEO title. */
  name: string;
  /** What this page is for and who it's aimed at. */
  purpose: string;
  traffic: CampaignTraffic;
  /** True when the page is meant to rank in Google. Paid pages are false by design. */
  indexed: boolean;
  /** True when the page is reachable from the site nav / a hub page. */
  inNav: boolean;
  /** Where it's deployed. */
  host: 'chronexa.io' | 'chronexa-portfolio.vercel.app';
  /** ISO date the page went live. */
  launched: string;
  /** Anything worth remembering — competing pages, campaign names, gotchas. */
  notes?: string;
};

export const CAMPAIGN_PAGES: CampaignPage[] = [
  {
    path: 'ai-growth-systems-for-startups',
    name: 'AI Growth Systems for Startups',
    purpose:
      'Core service page for growth-stage startup founders. Owns all organic startup search — the Leverage Ratio / Headcount Tax framing.',
    traffic: 'organic',
    indexed: true,
    inNav: true,
    host: 'chronexa.io',
    launched: '2026-07-30',
    notes:
      'Promoted into the Services menu on 2026-07-30. This is the only startup page allowed to chase Google.',
  },
  {
    path: 'n8n-ai-automation-startups',
    name: 'n8n AI Automation for Startups (Meta ads)',
    purpose:
      'Paid landing page for Meta ads — "Scale like a 100-person team. Without hiring one." Hero lead form posts to /api/contact (Baserow + Sheet + n8n webhook).',
    traffic: 'paid',
    indexed: false,
    inNav: false,
    host: 'chronexa.io',
    launched: '2026-07-30',
    notes:
      'Deliberately noindex so it cannot split startup queries with /ai-growth-systems-for-startups or /n8n-automation-services. Fires a Meta Pixel Lead event on form success.',
  },
  {
    path: 'n8n-automation-services',
    name: 'n8n Automation Services & Consulting',
    purpose:
      'Core service page for the n8n / workflow-automation keyword cluster. Sits in the Services menu as "Workflow Automation (n8n)".',
    traffic: 'organic',
    indexed: true,
    inNav: true,
    host: 'chronexa.io',
    launched: '2026-06-11',
  },
  {
    path: 'https://chronexa-portfolio.vercel.app/',
    name: 'Shopify Store Portfolio (Meta ads) — SUPERSEDED',
    purpose:
      'Old paid landing page for the D2C Shopify offer — "Complete Shopify Store for ₹25,000". A generic feature page with no lead form, no pixel, no qualifier. Replaced 2026-09-10 by /shopify-store-build.',
    traffic: 'external',
    indexed: false,
    inNav: false,
    host: 'chronexa-portfolio.vercel.app',
    launched: '2026-06-22',
    notes:
      'DO NOT send ad traffic here any more. Separate static Vercel project (chronexa-portfolio), no instrumentation. Kept only as a link to the demo stores.',
  },
  {
    path: 'shopify-store-build',
    name: 'Shopify Redesign & Conversion for Established Brands (Meta ads — UK)',
    purpose:
      'Paid landing page for established Shopify stores — redesign + conversion-focused rebuild, not a new-store build. Repositioned 2026-09-21 from the earlier India / ₹25,000 / Instagram-first offer on this same URL. Qualifier form (Shopify store URL required, GBP budget gate) posts to /api/contact as source "shopify-store-landing"; qualified leads get the Calendly booking, everyone else a nurture reply. Fires a Meta Pixel + CAPI Lead event.',
    traffic: 'paid',
    indexed: false,
    inNav: false,
    host: 'chronexa.io',
    launched: '2026-09-10',
    notes:
      'The only e-commerce ad destination. UK test decided 2026-09-21 — quote-based, no stated price, targets stores that already exist. Strategy: docs/strategy/meta-ecommerce-ads-playbook.md (pre-repositioning, kept for the lead-quality evidence, not the current offer). noindex so it cannot compete with the organic /d2c-ecommerce-automation page. Feeds the n8n → Meta QualifiedLead/BookedCall/Purchase feedback loop.',
  },
  {
    path: 'shopify-store-build-india',
    name: 'Shopify Redesign & Conversion for Established Brands (Meta ads — India metro)',
    purpose:
      'Duplicate of /shopify-store-build created 2026-09-24 to repurpose the same UK campaign narrative and creatives for affluent Indian metros (Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai) at ₹1,500/day. Same content, same three ad-concept narrative, same Calendly. Only difference: INR budget bands (under-20k-inr / 20-50k-inr / 50k-1lakh-inr / 1lakh+-inr since 2026-09-25; lakh bands before) instead of GBP, India-first country-code default, and a distinct form source ("shopify-store-landing-india") so leads stay separately labelled from the UK page in Baserow/Sheets/CAPI. Since the 2026-09-24 flagship overhaul it renders the same ShopifyStorePage component with the INDIA settings from shopify-store-build/markets.ts — one page, two markets, no fork.',
    traffic: 'paid',
    indexed: false,
    inNav: false,
    host: 'chronexa.io',
    launched: '2026-09-24',
    notes:
      'Meta campaign "Shopify Redesign — India Metro (Sep 2026)" (120248274304840534) — campaign, ad set and all 3 ads kept PAUSED, not launched. /api/contact treats this source identically to shopify-store-landing via the isShopifyLanding() gate (qualifier fields, phone requirement, source-aware CAPI phone hashing) — only the budget-band values and the Source label differ.',
  },
];

export const campaignsByTraffic = (t: CampaignTraffic) =>
  CAMPAIGN_PAGES.filter((c) => c.traffic === t);

/** Full clickable URL for a registry entry. */
export const campaignUrl = (c: CampaignPage) =>
  c.path.startsWith('http') ? c.path : `https://chronexa.io/${c.path}`;
