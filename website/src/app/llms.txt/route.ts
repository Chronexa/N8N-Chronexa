import { site } from '../../lib/site';
import { capabilities } from '../../lib/capabilities';
import { services as solutionPages } from '../../lib/taxonomy';
import { GROWTH_PAGES } from '../../lib/growth-pages';
import { PRODUCT_PAGES } from '../../lib/product-pages';

export const dynamic = 'force-static';

/**
 * /llms.txt — the emerging standard that helps AI answer engines (ChatGPT,
 * Perplexity, Claude, Google AI Overviews) understand and cite the site.
 * Generated from live service data so it never drifts.
 */
export function GET() {
  const services = solutionPages.map(
    (s) => `- [${s.title}](${site.url}/${s.slug}): ${s.heroSub}`,
  ).join('\n');

  const body = `# ${site.name}

> ${site.definition}

Chronexa is an Anthropic partner. Services: AI strategy consulting, AI automation, AI agent development, AI integration and custom MCP servers, AI knowledge systems, AI voice agents, custom software and SaaS development, UX and product design, e-commerce and D2C brand building on Shopify, dedicated AI engineers and AI training for teams. Every engagement starts with a free AI audit; the first workflow is built free, usually within a week; later builds are quoted against the time and revenue they unlock (no packages, no hourly billing). Clients own the code, data and accounts. Chronexa runs its own company on the same agents it builds, with a person approving anything that publishes, spends or sends. It is a services firm and long-term implementation partner, not a SaaS product.

## Core services
${capabilities.map(s => `- [${s.searchTitle}](${site.url}/${s.slug}): ${s.description}`).join("\n")}

## Specialist solutions
${services}

## How we work, guides and tools
${GROWTH_PAGES.map(p => `- [${p.crumb}](${site.url}/${p.slug}): ${p.description}`).join('\n')}
${['shopify-seo-services', 'shopify-migration-services', 'custom-shopify-store-cost'].map(k => PRODUCT_PAGES[k].p).map(p => `- [${p.crumb}](${site.url}/${p.slug}): ${p.description}`).join('\n')}

## Key pages
- [All solutions](${site.url}/solutions): AI automation systems for documents, sales, support, finance, professional services and operations.
- [Case studies](${site.url}/case-studies): What Chronexa built and the time, cost or capacity it saved.
- [Blog](${site.url}/blog): Clear guides to AI agents and workflow automation, including cost and build-versus-buy decisions.
- [About](${site.url}/about): Who Chronexa is and how we work.
- [Contact](${site.url}/contact): Discuss a project or engineering engagement.

## Contact
- Email: ${site.email}
- Location: ${site.locality}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
