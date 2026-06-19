import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ChromeGate from "../components/ChromeGate";
import ScrollReveal from "../components/ScrollReveal";
import Analytics from "../components/Analytics";
import VisitorIdentify from "../components/VisitorIdentify";
import ChatWidget from "../components/ChatWidget";
import ExitIntent from "../components/ExitIntent";
import { site, founders, company } from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

// Editorial display serif for headlines (the "not-an-AI-template" signal).
// Variable across weight + optical size; opsz auto-tunes contrast at large sizes.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
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
  colorScheme: "light dark",
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
      logo: `${site.url}/images/logo.png`,
      foundingDate: company.foundingYear,
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
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
        <VisitorIdentify />
        <ChatWidget />
        <ExitIntent />
      </body>
    </html>
  );
}
