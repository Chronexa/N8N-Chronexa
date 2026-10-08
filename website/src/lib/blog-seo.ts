/**
 * Blog index hygiene decided in the 2026-10 SEO forensics
 * (docs/research/seo-forensics-2026-10-06/REPORT.md §10). Kept in code, not in
 * Sanity, so the decision is reviewable, reversible in one line, and applies the
 * same way to the page, the sitemap and the redirects.
 */

/**
 * Posts that stay live for anyone who has the link but ask Google not to index
 * them: builder-audience n8n tutorials and posts with zero search demand. They
 * drop out of the sitemap and carry `robots: noindex, follow`.
 *
 * `self-hosting-n8n-architecture-security-and-cost` was removed on 2026-10-08: it was rewritten as the
 * n8n pricing guide (n8n price/cost/self-hosting is ~8k searches a month at low difficulty).
 *
 * `b2b-marketing-automation` is deliberately NOT here. The audit listed it only
 * because it is new (2026-09-14); it is re-judged at the 2026-11-15 checkpoint
 * with the other September posts.
 */
export const NOINDEX_POSTS = new Set<string>([
  'cpa-task-management-software-dynamic-routing',
  'ai-automation-us-private-equity-ma-due-diligence',
  'client-documents-not-ready-to-prep',
  'hipaa-compliant-healthcare-document-automation',
  'how-to-build-an-ai-multi-agent-content-system-in-n8n',
  'job-complete-but-billing-not-updated',
  'manual-data-entry-cost-per-employee-how-to-stop',
  'n8n-ai-agent-node-build-multi-agent-systems-in-2026',
  'n8n-ai-agents-features-2026-complete-guide',
  'oracle-n8n-claude-ai-agent-integration-layer',
  'reduce-claude-api-costs-n8n-batch-api',
  'what-is-ai-workflow-automation-definition-business-owners',
]);

/**
 * Overlapping posts folded into one stronger page. Permanent redirects live in
 * next.config.ts (generated from this map); the sitemap omits the sources.
 * The agency-list merge moved the UAE/Dubai section into the surviving post.
 */
export const MERGED_POSTS: Record<string, string> = {
  'blog-top-automation-agencies-uae-dubai': '/blog/top-ai-automation-agencies-b2b-saas-2026',
  'make-vs-n8n-vs-zapier': '/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams',
  'what-is-hyperautomation': '/what-is-ai-automation',
  'what-is-intelligent-automation': '/what-is-ai-automation',
  'what-is-workflow-automation': '/what-is-ai-automation',
  'ai-automation-consultant': '/ai-consultant',
  'generative-ai-consulting-services': '/ai-consultant',
  'ai-automation-company-for-cpa-firms': '/cpa-tax-document-automation',
  'tax-document-automation-workflow-cpa-firms': '/cpa-tax-document-automation',
};

export const isHiddenFromIndex = (slug: string) => NOINDEX_POSTS.has(slug) || slug in MERGED_POSTS;
