import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "n8n Automation Portfolio | Production Workflows by Chronexa",
  description:
    "Explore production-grade n8n workflows and AI automations built by Chronexa—from autonomous outbound engines to multi-agent content pipelines.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Automation Portfolio | Chronexa",
    description:
      "Production-grade n8n workflows and AI automations we've built for clients across sales, marketing, legal, finance, and operations.",
    url: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
