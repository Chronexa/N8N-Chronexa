import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Blog slug redirects (301) for the 13 indexed URLs whose Framer slugs drifted
 * (parentheses, dots, or since-renamed). These live in proxy (formerly
 * "middleware") rather than next.config `redirects()` because path-to-regexp
 * treats `(` `)` as special characters and would mis-parse them. Keys are the
 * DECODED old paths.
 *
 * Validated against 90-day GSC data: these 13 carry ~6% of blog impressions.
 * The other 103 ranking blog URLs match the export verbatim and need no redirect.
 */
const BLOG_REDIRECTS: Record<string, string> = {
  '/blog/n8n-voice-ai-elevenlabs-twilio-tutorial-(2026)': '/blog/n8n-voice-ai-elevenlabs-twilio-tutorial-2026',

  // ── Cannibalization consolidation (GSC-driven, 2026-06). The "n8n AI agent 2026"
  // cluster split ~15 queries across 5 near-duplicate posts → hundreds of impressions,
  // ~0 clicks. Merged to 2 pillars; 301 the 3 duplicates straight to a pillar (no
  // chains) so their ranking signal consolidates. The 3 are already unpublished, so
  // these turn their current 404s into proper redirects.
  //   pillar A (build/technical): /blog/n8n-ai-agent-node-build-multi-agent-systems-in-2026
  //   pillar B (features ref):    /blog/n8n-ai-agents-features-2026-complete-guide
  '/blog/n8n-ai-agent-node-enterprise-architecture-guide-(2026)': '/blog/n8n-ai-agent-node-build-multi-agent-systems-in-2026',
  '/blog/n8n-ai-agent-node-enterprise-architecture-guide-2026': '/blog/n8n-ai-agent-node-build-multi-agent-systems-in-2026',
  '/blog/n8n-ai-agents-features-2026': '/blog/n8n-ai-agents-features-2026-complete-guide',
  '/blog/n8n-ai-agent-features-2026': '/blog/n8n-ai-agents-features-2026-complete-guide',

  '/blog/top-15-n8n-use-cases-for-b2b-saas-(with-ready-to-clone-workflows)': '/blog/top-15-n8n-use-cases-for-b2b-saas',
  '/blog/he-glass-box-agency-why-chronexa-is-built-on-n8n-(and-why-you-should-care)': '/blog/the-glass-box-agency-why-chronexa-is-built-on-n8n',
  '/blog/n8n-agency-launch-kit-client-acquisition-framework-(free)': '/blog/n8n-agency-launch-kit-client-acquisition-framework',
  '/blog/you-re-not-understaffed.-you-re-under-automated.': '/blog/youre-not-understaffed-youre-under-automated',
  '/blog/beyond-chatgpt-why-law-firms-are-migrating-to-private-self-hosted-ai-infrastructure-in-2026': '/blog/law-firms-private-self-hosted-ai-infrastructure',
  '/blog/how-multi-channel-d2c-brands-eliminate-inventory-stockouts-across-shopify-amazon-and-walmart': '/blog/d2c-eliminate-inventory-stockouts-shopify-amazon-walmart',
  '/blog/what-to-do-when-your-hoa-reserve-study-is-outdated-(and-how-to-update-it-fast)': '/blog/what-to-do-when-your-hoa-reserve-study-is-outdated',
  '/blog/off-the-shelf-ai-vs.-custom-workflows-the-ria-build-vs.-buy-guide': '/blog/off-the-shelf-ai-vs-custom-workflows-ria-build-vs-buy-guide',
  '/blog/the-death-of-the-billable-hour-how-agentic-workflows-are-driving-value-based-pricing-in-2026': '/blog/billable-hour-death-agentic-workflows-value-based-pricing',
  '/blog/the-silent-profit-drain-unmasking-the-hidden-costs-of-traditional-customer-support': '/blog/hidden-costs-traditional-customer-support',
  '/blog/when-a-5m-trust-distribution-depends-on-finding-the-right-clause-in-the-right-pdf': '/blog/trust-distribution-ai-clause-search-pdf',

  // ── Post-launch GSC recheck (2026-06-07): old Framer blog URLs Google still
  // indexes that 404'd on the new site. Mapped to the closest live post.
  // Recovers ~9k/120-day impressions (top two: the n8n-vs-zapier guide ~5k and
  // the self-hosting-n8n guide ~3.8k). Run scripts/gsc-cannibalization.mjs-style
  // page audit after future Sanity slug changes to catch new drift.
  '/blog/n8n-vs-zapier-in-2026-cost-ai-features-and-when-to-choose-each': '/blog/n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis',
  '/blog/n8n-vs-zapier-in-2026-an-enterprise-teardown': '/blog/n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis',
  '/blog/self-hosting-n8n-architecture-security-and-cost-breakdown': '/blog/self-hosting-n8n-architecture-security-and-cost',
  '/blog/document-automation-tools-regulated-industries-guide': '/blog/document-automation-tools-for-regulated-industries',
  '/blog/document-automation-tools-regulated-industries-cpa-firms': '/blog/document-automation-tools-for-regulated-industries',
  '/blog/saas-crm-optimisation': '/blog/how-b2b-saas-companies-reduce-sales-rep-crm-time-from-60-to-20',
  '/blog/ai-agent-platforms-uae-wealth-managers-cfos': '/blog/best-ai-agent-platforms-wealth-management-uae',
  '/blog/best-ai-agent-platforms-uae-wealth-managers': '/blog/best-ai-agent-platforms-wealth-management-uae',
  '/blog/why-scaling-lead-outreach-with-humans-is-financial-suicide-(and-how-ai-agents-are-changing-the-game)': '/blog/why-scaling-lead-outreach-with-humans-is-financial-suicide',
};

export function proxy(req: NextRequest) {
  const path = decodeURIComponent(req.nextUrl.pathname);
  const dest = BLOG_REDIRECTS[path];
  if (dest) {
    const url = req.nextUrl.clone();
    url.pathname = dest;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

// Only run for blog paths — keeps proxy off every other request.
export const config = { matcher: '/blog/:path*' };
