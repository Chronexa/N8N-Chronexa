import { site } from '../../lib/site';
import { SERVICES } from '../../lib/services-content';

export const dynamic = 'force-static';

/**
 * /llms.txt — the emerging standard that helps AI answer engines (ChatGPT,
 * Perplexity, Claude, Google AI Overviews) understand and cite the site.
 * Generated from live service data so it never drifts.
 */
export function GET() {
  const services = SERVICES.map(
    (s) => `- [${s.serviceName}](${site.url}/${s.slug}): ${s.metaDescription}`,
  ).join('\n');

  const body = `# ${site.name}

> ${site.description}

Chronexa is an engineer-led, n8n-first AI automation agency for B2B enterprises in the US, UK, and Canada. We build custom AI and n8n workflows on a client's existing stack — scoped, fixed-price, delivered in 30–60 days, and backed by a 90-day ROI guarantee. We build automation assets clients own, not software subscriptions.

## Services
${services}

## Key pages
- [Solutions / all services](${site.url}/solutions): Overview of every AI automation service and the industries we serve.
- [Case studies](${site.url}/case-studies): Quantified outcomes (e.g. reserve-study reports cut from 6 hours to 11 minutes).
- [Blog](${site.url}/blog): Deep-dive articles on n8n, AI agents, and workflow automation for B2B teams.
- [About](${site.url}/about): Who Chronexa is and how we work.
- [Contact](${site.url}/contact): Book a free automation audit.

## Contact
- Email: ${site.email}
- Location: ${site.locality}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
