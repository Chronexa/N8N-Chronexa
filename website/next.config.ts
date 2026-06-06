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

      // --- 157 existing Framer blogs (preserve link equity) ---
      // Framer served blogs at /blog/:slug, which the new /blog/[slug] route also handles,
      // so most map 1:1 automatically. Add explicit entries here for any slug that CHANGED.
      // {
      //   source: "/old-framer-blog-path/:slug",
      //   destination: "/blog/:slug",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
