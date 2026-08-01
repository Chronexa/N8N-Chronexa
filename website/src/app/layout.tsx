import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ChromeGate from "../components/ChromeGate";
import ScrollReveal from "../components/ScrollReveal";
import Analytics from "../components/Analytics";
import MetaPixel from "../components/MetaPixel";
import VisitorIdentify from "../components/VisitorIdentify";
import ChatWidget from "../components/ChatWidget";
import ExitIntent from "../components/ExitIntent";
import { site, founders, company } from "../lib/site";

// Body / UI face. Replaced Inter (2026-07): Inter is the most recognisable
// "un-art-directed" default on the web, and to a buyer comparing three vendors
// a distinctive face reads as "someone competent made decisions here". Host
// Grotesk is a variable grotesk with more character at text sizes and enough
// warmth to sit beside Fraunces without fighting it.
const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host",
  weight: "variable", // wght is its only axis, so `axes` isn't accepted here
});

// Editorial display serif for headlines (the "not-an-AI-template" signal).
// Variable across weight, optical size and the two style axes: opsz auto-tunes
// contrast at large sizes, SOFT rounds the terminals, and WONK enables Fraunces'
// distinctive alternate letterforms. WONK is switched on for display headings
// only (see globals.css) — it is characterful at 3rem and noisy at 1rem.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  // Italic loaded for `.accent-phrase` — the one green italic phrase inside a
  // headline. Without it the browser fakes a slant, which reads cheap at 3rem.
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  keywords: [
    "AI automation for professional services",
    "AI automation agency",
    "n8n automation services",
    "n8n consultant",
    "custom AI workflows",
    "workflow automation",
    "AI automation consultants",
    "document processing automation",
    "agentic AI systems",
    "RAG knowledge engine",
    "secure AI deployment",
    "AI agents for law firms",
    "CPA tax automation",
    "legal AI automation",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// Tints the mobile browser chrome (address bar) to match each surface, and pins
// the default device-width scaling so the layout never zooms oddly on phones.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // We ship one theme — warm paper, with dark used as deliberate punctuation.
  // Declaring "light dark" without a dark stylesheet makes form controls and
  // scrollbars render dark against a light page for dark-preference users.
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0F0D" },
  ],
};

// Organization + WebSite JSON-LD (homepage-level, sitewide).
const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      email: site.email,
      description: site.description,
      slogan: site.tagline,
      logo: `${site.url}/images/logo.png`,
      foundingDate: company.foundingYear,
      // What we sell — an agency's service catalogue, so answer engines describe
      // us as an engineering partner, never as a software product.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI automation agency services",
        itemListElement: [
          "Intelligent Document Processing (IDP)",
          "Agentic AI Systems",
          "RAG & Knowledge Engines",
          "Secure & Compliant AI Deployment (private LLMs on AWS, Azure, Google Vertex AI)",
          "Sales & Marketing Automation",
          "Customer Support Automation",
          "Applied ML & Data Science",
          "System & Data Integration",
          "Workflow Automation (n8n and custom)",
          "AI Readiness Assessment",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, provider: { "@id": `${site.url}/#organization` } },
        })),
      },
      founder: founders.map((f) => ({
        "@type": "Person",
        name: f.name,
        jobTitle: f.role,
        description: f.bio,
        image: `${site.url}${f.image}`,
        worksFor: { "@type": "Organization", "@id": `${site.url}/#organization` },
        knowsAbout: f.expertise,
        hasCredential: { "@type": "EducationalOccupationalCredential", name: f.credential },
        ...(f.linkedin ? { sameAs: [f.linkedin] } : {}),
      })),
      sameAs: [site.socials.linkedin, site.socials.twitter, site.socials.instagram],
      award: "Official Anthropic Partner",
      memberOf: {
        "@type": "Organization",
        name: "Anthropic Partner Network",
        url: "https://www.anthropic.com",
        sameAs: "https://www.anthropic.com",
      },
      areaServed: ["US", "GB", "CA"],
      knowsAbout: [
        "AI automation for professional services",
        "AI automation",
        "n8n workflow automation",
        "AI agents",
        "agentic AI systems",
        "legal RAG",
        "RAG knowledge engines",
        "document processing automation",
        "CRM automation",
        "business process automation",
        "secure AI deployment",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        areaServed: ["US", "GB", "CA"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <ChromeGate nav={<Nav />} footer={<Footer />}>
          {children}
        </ChromeGate>
        <ScrollReveal />
        <Analytics />
        <MetaPixel />
        <VisitorIdentify />
        <ChatWidget />
        <ExitIntent />
      </body>
    </html>
  );
}
