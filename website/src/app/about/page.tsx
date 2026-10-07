import type { Metadata } from 'next';
import Principles from '../../components/Principles';
import Story from '../../components/Story';
import Team from '../../components/Team';
import Numbers from '../../components/Numbers';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: { absolute: 'About Chronexa | AI Consulting & Development Firm' },
  description:
    'Meet the founders of Chronexa, an AI consulting and development firm and Anthropic partner that runs its own company on the agents it builds.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Chronexa | AI Consulting & Development Firm',
    description: 'Meet the founders of Chronexa, an AI consulting and development firm and Anthropic partner that runs its own company on the agents it builds.',
    url: '/about',
    type: 'website',
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Chronexa | AI Consulting & Development Firm',
    description: 'Meet the founders of Chronexa, an AI consulting and development firm and Anthropic partner that runs its own company on the agents it builds.',
    images: [site.ogImage],
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
    description: site.definition,
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
            Engineers who know <span className={styles.gradientText}>when AI is right.</span>
          </h1>
          <p className={styles.subheadline}>
            Chronexa is an AI consulting and development firm and Anthropic partner. We run our own company on AI agents, and we bring the same agents, integrations and engineering judgment to growing companies in the US and worldwide.
          </p>
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Book a free AI audit
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
                We don&apos;t build demos. Every build is quoted after a free audit, against the time and revenue it unlocks.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Technical Co-founders</h3>
              <p className={styles.cardText}>
                We aren&apos;t just vendors. We are a senior team of engineers and operators sitting at your side.
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
