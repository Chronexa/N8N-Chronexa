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
    name: 'Shopify Store Portfolio (Meta ads)',
    purpose:
      'Paid landing page for the D2C Shopify studio offer — "Complete Shopify Store for ₹25,000". Links into the live demo stores, ends on a Calendly CTA.',
    traffic: 'external',
    indexed: false,
    inNav: false,
    host: 'chronexa-portfolio.vercel.app',
    launched: '2026-06-22',
    notes:
      'Separate Vercel project (chronexa-portfolio) built from the Ecommerce/Portfolio repo — a hand-written static page, not part of this Next.js site.',
  },
];

export const campaignsByTraffic = (t: CampaignTraffic) =>
  CAMPAIGN_PAGES.filter((c) => c.traffic === t);

/** Full clickable URL for a registry entry. */
export const campaignUrl = (c: CampaignPage) =>
  c.path.startsWith('http') ? c.path : `https://chronexa.io/${c.path}`;
