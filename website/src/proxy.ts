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
  '/blog/n8n-ai-agent-node-enterprise-architecture-guide-(2026)': '/blog/n8n-ai-agent-node-enterprise-architecture-guide-2026',
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
