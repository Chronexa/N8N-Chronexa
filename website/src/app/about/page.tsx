import type { Metadata } from 'next';
import Principles from '../../components/Principles';
import Team from '../../components/Team';
import Numbers from '../../components/Numbers';
import CtaBand from '../../components/CtaBand';
import { site, company } from '../../lib/site';

export const metadata: Metadata = {
  title: { absolute: 'About Chronexa — Engineer-Led AI Automation Agency' },
  description:
    'Chronexa is an engineer-led AI and n8n automation agency for B2B enterprises. We build custom automation assets on your existing stack — not software subscriptions.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Chronexa — Engineer-Led AI Automation Agency',
    description: 'An engineer-led AI & n8n automation agency for B2B enterprises.',
    url: '/about',
    type: 'website',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${site.url}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    sameAs: [site.socials.linkedin, site.socials.twitter, site.socials.instagram],
    areaServed: ['US', 'GB', 'CA'],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="section-dark" style={{ paddingTop: 'calc(var(--nav-height) + var(--spacing-xl))' }}>
        <div className="container">
          <p className="eyebrow">About Chronexa</p>
          <h1 style={{ maxWidth: '20ch' }}>An engineer-led AI automation agency</h1>
          <p className="heroDescription" style={{ marginTop: 'var(--spacing-sm)', maxWidth: '65ch' }}>
            We design, build, and maintain custom n8n and AI automation systems for B2B
            enterprises — deployed on the stack you already run, scoped at a fixed price, and
            engineered to grow with you for years. We act as your technical co-founders, not a
            vendor that takes a ticket and disappears.
          </p>
          <p className="heroDescription" style={{ marginTop: 'var(--spacing-md)', maxWidth: '65ch' }}>
            Unlike off-the-shelf SaaS, everything we build is an asset you own. We are n8n-first,
            so your workflows are portable, self-hostable, and free of per-task pricing — with AI
            agents, document processing, and deep integrations engineered to production standards.
          </p>
          <p className="heroDescription" style={{ marginTop: 'var(--spacing-md)', maxWidth: '65ch' }}>
            Founded in {company.foundingYear}, Chronexa is {company.teamDescriptor} with deep,
            hands-on experience across document intelligence, sales and revenue operations, legal,
            insurance, financial services, accounting, and research — serving B2B clients in the US,
            UK, and India.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          <p className="eyebrow">How we work</p>
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Principles we build on</h2>
          <Principles />
        </div>
      </section>

      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <Team />
        </div>
      </section>

      <Numbers />
      <CtaBand />
    </>
  );
}
