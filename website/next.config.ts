import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is the workspace root (a sibling repo also has a lockfile).
  turbopack: { root: __dirname },

  // Allow Framer-hosted images during migration (blog/case-study assets).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  // Proxy Amplitude event requests through our own domain.
  // Ad-blockers that filter *.amplitude.com won't touch /api/amplitude/*.
  // Session Replay goes to api-secure.amplitude.com on a separate path.
  async rewrites() {
    return [
      {
        source: '/api/amplitude/:path*',
        destination: 'https://api2.amplitude.com/:path*',
      },
      {
        source: '/api/amplitude-sr/:path*',
        destination: 'https://api-secure.amplitude.com/:path*',
      },
    ];
  },

  async redirects() {
    return [
      // --- Old 3-level /services/* slugs → new flat keyword-first slugs (301) ---
      { source: "/services/legal-due-diligence", destination: "/legal-due-diligence-automation", permanent: true },
      { source: "/services/insurance-claims-triage", destination: "/insurance-claims-triage-automation", permanent: true },
      { source: "/services/accounting-data-ingestion", destination: "/cpa-tax-document-automation", permanent: true },
      { source: "/services/property-management-automation", destination: "/property-management-automation", permanent: true },
      { source: "/services/vc-pe-crm-automation", destination: "/vc-pe-crm-automation", permanent: true },
      // Old services hub → new solutions hub
      { source: "/services", destination: "/solutions", permanent: true },

      // --- Post-launch GSC recheck (2026-06-07): more old Framer URLs still indexed ---
      { source: "/services/sales-operations", destination: "/sales-revenue-automation", permanent: true },
      { source: "/services/custom-workflows", destination: "/n8n-automation-services", permanent: true },
      { source: "/services/legal-automation", destination: "/legal-due-diligence-automation", permanent: true },
      // Framer served some posts under /articles/* — send them to the canonical /blog/* path
      { source: "/articles/:slug", destination: "/blog/:slug", permanent: true },

      // --- Cut case studies (2026-06-08): generic/templated, removed in the enterprise
      //     repositioning. 301 to the case-studies index. Delete the Sanity docs at deploy. ---
      { source: "/case-studies/how-autopartsco-scaled-customer-support-with-ai", destination: "/case-studies", permanent: true },
      { source: "/case-studies/how-freshcart-boosted-lead-quality-with-ai-scoring", destination: "/case-studies", permanent: true },

      // --- 157 existing Framer blogs (preserve link equity) ---
      // Framer served blogs at /blog/:slug, which the new /blog/[slug] route also handles,
      // so most map 1:1 automatically. Add explicit entries here for any slug that CHANGED.
      // {
      //   source: "/old-framer-blog-path/:slug",
      //   destination: "/blog/:slug",
      //   permanent: true,
      // },

      // --- Off-positioning content cull (2026-07-07): 91 legacy posts removed, redirected ---
      // --- (D2C/e-commerce, HOA/real-estate, generic B2B SaaS sales-ops, generic n8n tutorials, ---
      // --- and agency-directory content that undercut the regulated-industries positioning) ---
      { source: "/blog/agency-vs-automation-how-we-beat-an-8-person-team-with-n8n", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/ai-agents-gcc-family-office", destination: "/blog", permanent: true },
      { source: "/blog/ai-evolution-3-layers-enterprise-value", destination: "/blog", permanent: true },
      { source: "/blog/ai-in-2025-hype-reality-and-the-market-landscape", destination: "/blog", permanent: true },
      { source: "/blog/ai-invoice-processing-mid-market-guide", destination: "/blog", permanent: true },
      { source: "/blog/ai-lead-scoring-for-b2b-saas-identify-best-leads-in-real-time", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/ai-powered-marketing-automation-that-doesn-t-feel-like-ai", destination: "/blog", permanent: true },
      { source: "/blog/ai-reserve-study-automation-propertyscope", destination: "/blog", permanent: true },
      { source: "/blog/ai-reserve-study-automation-usa-firms-2026", destination: "/blog", permanent: true },
      { source: "/blog/ai-sdr-engine-lead-research-automation", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/ai-that-qualifies-your-lead-for-high-ticket-clients", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/ai-workflow-automation-agency-owners-complete-guide", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/automate-legacy-software-anthropic-computer-use", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/automated-crm-data-hygiene-stale-opportunity-archival", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/automating-lead-degradation-scoring-unresponsive-prospects", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/automating-out-of-office-reply-parsing-b2b-outbound", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/automating-salesforce-closed-won-handoff-customer-success", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/autonomous-sdr-engine-b2b-pipeline-automation", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/before-you-hire-checklist-automate-first-founder", destination: "/blog", permanent: true },
      { source: "/blog/beyond-the-chatbot-the-rise-of-agentic-ai-in-customer-support", destination: "/blog", permanent: true },
      { source: "/blog/blog-ai-powered-reserve-study-platform-case-study", destination: "/blog", permanent: true },
      { source: "/blog/blog-best-n8n-consultants-by-region", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/building-aisdr-autonomous-sales-agent", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/custom-crm-lead-scoring-models-vs-n8n-workflow-orchestration", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/d2c-eliminate-inventory-stockouts-shopify-amazon-walmart", destination: "/blog", permanent: true },
      { source: "/blog/d2c-order-fulfillment-automation-from-order-to-shipped-in-4-hours", destination: "/blog", permanent: true },
      { source: "/blog/ecommerce-order-operations-automation-dtc-founders-scale-fulfillment", destination: "/blog", permanent: true },
      { source: "/blog/email-deliverability-subdomain-segmentation-automated-outbound-infrastructure", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/enterprise-architecture-build-multi-agent-systems-in-n8n", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/fintech-kyc-automation-roi-calculator-calculate-your-savings-in-2-minutes", destination: "/blog", permanent: true },
      { source: "/blog/founder-bottleneck-decisions-costing-growth", destination: "/blog", permanent: true },
      { source: "/blog/gemini-nano-banana-ai-image-gen-automation", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/grow-smarter-ai-customer-support-strategies-for-smbs-to-compete-with-giants", destination: "/blog", permanent: true },
      { source: "/blog/hidden-costs-traditional-customer-support", destination: "/blog", permanent: true },
      { source: "/blog/how-b2b-saas-companies-reduce-sales-rep-crm-time-from-60-to-20", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/how-d2c-brands-capture-35-more-leads-with-multi-channel-form-automation", destination: "/blog", permanent: true },
      { source: "/blog/how-d2c-brands-turn-an-18-repeat-rate-into-42-in-90-days-through-automation", destination: "/blog", permanent: true },
      { source: "/blog/how-to-automate-soc2-evidence-collection", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/how-to-build-a-lead-capture-system-that-doesn-t-leak-revenue", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/how-to-build-an-ai-powered-lead-generation-machine-in-n8n", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/how-to-build-cart-abandonment-automation-that-recovers-28-of-lost-revenue", destination: "/blog", permanent: true },
      { source: "/blog/how-us-d2c-brands-cut-customer-service-response-time-from-8-hours-to-8-minutes", destination: "/blog", permanent: true },
      { source: "/blog/invoice-reconciliation-automation-agency-ar-bottleneck", destination: "/blog", permanent: true },
      { source: "/blog/invoice-reconciliation-automation-saas-founders", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/migrate-zapier-to-n8n-enterprise-ai", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/multi-step-routing-workflows-complex-b2b-sales-cycles", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/n8n-agency-launch-kit-client-acquisition-framework", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/n8n-automation-dubai-replace-manual-ops-30-days", destination: "/blog", permanent: true },
      { source: "/blog/n8n-for-agencies-packaging-pricing-and-selling-automation-retainers", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/n8n-langchain-integration-complete-rag-workflow-tutorial", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/n8n-roi-calculator-calculate-your-savings-vs-zapier", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/n8n-voice-ai-elevenlabs-twilio-tutorial-2026", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/n8n-workflow-templates-for-founders-7-automations-to-ship-in-a-weekend", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/nvidia-rubin-10x-cheaper-ai-inference-costs-explained", destination: "/blog", permanent: true },
      { source: "/blog/oracle-ai-infrastructure-50b-raise-signals-new-era", destination: "/blog", permanent: true },
      { source: "/blog/property-management-automation-playbook-portfolio-owners", destination: "/blog", permanent: true },
      { source: "/blog/purchase-order-reconciliation-automation-reduce-cycle-time", destination: "/blog", permanent: true },
      { source: "/blog/real-estate-leads-go-cold-5-minutes-instant-response", destination: "/blog", permanent: true },
      { source: "/blog/real-time-inbound-lead-routing-slack-sla-notification-automation", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/replace-zapier-with-n8n-agency", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/reserve-study-automation-for-hoas-ai-powered-reserve-analysis-in-hours-not-weeks", destination: "/blog", permanent: true },
      { source: "/blog/revops-automation-for-b2b-saas-professional-services", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/saas-churn-reduction-automation-data-pipeline", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/saas-revenue-operations-automation-mrr-visibility", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/saas-trial-churn-week-one-how-to-fix", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/seo-automation-with-n8n-from-keyword-research-to-publishing", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/styleup-fashion-ai-support-cost-reduction", destination: "/blog", permanent: true },
      { source: "/blog/syncing-apollo-intent-data-custom-salesforce-dashboards", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/the-ai-content-engine-how-we-build-high-velocity-b2b-saas-pipelines-in-2026", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/the-complete-customer-retention-automation-system-for-d2c-brands", destination: "/blog", permanent: true },
      { source: "/blog/the-complete-guide-to-invoice-automation", destination: "/blog", permanent: true },
      { source: "/blog/top-15-n8n-use-cases-for-b2b-saas", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/top-5-jumio-alternatives-for-mid-market-fintech-companies-in-2025", destination: "/blog", permanent: true },
      { source: "/blog/top-n8n-automation-experts-india", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/vat-compliance-automation-saudi-arabia-n8n-workflows", destination: "/blog", permanent: true },
      { source: "/blog/what-is-n8n-the-2026-guide-to-open-source-workflow-ai-automation", destination: "/n8n-automation-services", permanent: true },
      { source: "/blog/what-to-do-when-your-hoa-reserve-study-is-outdated", destination: "/blog", permanent: true },
      { source: "/blog/why-scaling-lead-outreach-with-humans-is-financial-suicide", destination: "/ai-engines/sales-engine", permanent: true },
      { source: "/blog/xai-funding-20b-series-e-signals-new-compute-era", destination: "/blog", permanent: true },
      { source: "/blog/ai-powered-invoice-processing-services-for-mid-market-companies", destination: "/blog/ai-invoice-processing-mid-market-guide", permanent: true },
      // (2026-07-25: retargeted — old destination build-vs-buy-ai-automation-costs pruned below)
      { source: "/blog/build-vs-buy-ai-automation-cost-comparison", destination: "/blog/ai-for-accounting-firms-build-vs-buy", permanent: true },
      { source: "/blog/legal-document-automation-for-regulated-industries", destination: "/blog/legal-contract-review-automation-guide", permanent: true },
      { source: "/blog/n8n-vs-zapier-for-enterprise-automation-a-real-cost-analysis", destination: "/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams", permanent: true },
      { source: "/blog/top-ai-automation-agencies-usa-2025", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/top-ai-automation-agencies-uk-2025", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/top-ai-automation-agencies-new-york-2025", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/best-n8n-agencies-united-states-2025", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/n8n-agency-usa-moving-off-zapier-2025", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/n8n-vs-make-vs-zapier-comparison", destination: "/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams", permanent: true },
      { source: "/blog/how-to-choose-ai-automation-company", destination: "/blog/how-to-choose-ai-automation-agency-regulated-industries", permanent: true },
      { source: "/blog/ai-automation-roi-us-businesses-2025-benchmarks", destination: "/blog/ai-automation-roi-benchmarks-law-accounting-financial-services-2025", permanent: true },

      // --- SEO strategy v2 prune (2026-07-25): 9 posts with 0 impressions in 90d, >45d old. ---
      // --- Approved by Ankit. Sanity docs deleted same day; each 301s to nearest survivor. ---
      { source: "/blog/fixing-the-legal-operations-nightmare-with-ai-workflows", destination: "/legal-due-diligence-automation", permanent: true },
      { source: "/blog/build-vs-buy-vs-productized-service-fintech-kyc-automation-decision-guide", destination: "/blog/reduce-kyc-processing-cost-ai-automation", permanent: true },
      { source: "/blog/how-fintech-companies-cut-kyc-processing-time-from-14-days-to-2-days", destination: "/blog/reduce-kyc-processing-cost-ai-automation", permanent: true },
      { source: "/blog/how-to-automate-legal-document-processing-without-losing-control", destination: "/document-processing-automation", permanent: true },
      { source: "/blog/legal-tech-automation-12-n8n-workflows-for-law-firms", destination: "/blog/n8n-workflows-law-firms-billing-intake-communication", permanent: true },
      { source: "/blog/custom-mcp-servers-claude-private-data", destination: "/secure-ai-deployment", permanent: true },
      { source: "/blog/ai-document-processing-why-95-cost-reduction-requires-production-infrastructure", destination: "/document-processing-automation", permanent: true },
      { source: "/blog/ai-powered-ma-due-diligence-case-study", destination: "/blog/ai-for-private-equity-deal-lifecycle", permanent: true },
      { source: "/blog/build-vs-buy-ai-automation-costs", destination: "/blog/ai-for-accounting-firms-build-vs-buy", permanent: true },
    ];
  },
};

export default nextConfig;
