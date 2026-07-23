import type { Metadata } from 'next';
import Principles from '../../components/Principles';
import Story from '../../components/Story';
import Team from '../../components/Team';
import Numbers from '../../components/Numbers';
import CtaBand from '../../components/CtaBand';
import { site, company } from '../../lib/site';

export const metadata: Metadata = {
  title: { absolute: 'About Chronexa — AI Automation for Law Firms, CPA Practices & Finance Teams' },
  description:
    'Chronexa is an engineer-led AI automation agency for professional services firms. We build custom AI systems — legal RAG, tax workflow automation, document intelligence — deployed inside your environment, not a vendor\'s cloud.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Chronexa — AI Automation for Professional Services Firms',
    description: 'An engineer-led AI automation agency for law firms, CPA practices, and finance teams.',
    url: '/about',
    type: 'website',
  },
};

import styles from './AboutHero.module.css';

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

      <section className={`section-dark ${styles.heroSection}`}>
        <div className={styles.glow}></div>
        <div className={`container ${styles.content}`}>
          <p className={styles.eyebrow}>About Chronexa</p>
          <h1 className={styles.headline}>
            We build the engines that power <span className={styles.gradientText}>regulated enterprises.</span>
          </h1>
          <p className={styles.subheadline}>
            Chronexa is an engineer-led automation agency. We architect, build, and deploy custom infrastructure directly into your environment. You own the assets, and your data stays secure.
          </p>
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Book a Discovery Call.
          </a>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>100% Data Ownership</h3>
              <p className={styles.cardText}>
                Deployed inside your environment. Your sensitive data never leaves your control.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Built for ROI</h3>
              <p className={styles.cardText}>
                We don't build toys. Every system is scoped at a fixed price and engineered for measurable returns.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Technical Co-founders</h3>
              <p className={styles.cardText}>
                We aren't just vendors. We are a senior team of engineers and operators sitting at your side.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Story />

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
