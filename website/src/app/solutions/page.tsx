import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '../../lib/taxonomy';
import { site } from '../../lib/site';
import styles from './solutions.module.css';

export const metadata: Metadata = {
  title: 'AI Automation Services for Professional Services Firms',
  description:
    'Chronexa\'s AI automation capabilities for law firms, CPA practices, and finance teams — document intelligence, agentic AI systems, RAG knowledge engines, secure AI deployment and more — built on the systems you already run.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'AI Automation Services for Professional Services Firms | Chronexa',
    description:
      'Custom AI automation for law firms, CPA practices, and finance teams — agentic systems, RAG knowledge engines, document intelligence — deployed securely inside your environment.',
    url: '/solutions',
    type: 'website',
  },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.title,
    url: `${site.url}/${s.slug}`,
  })),
};

export default function SolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className={styles.hero}>
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1 className={styles.h1}>AI automation services for professional services firms</h1>
          <p className="heroDescription">
            We don&apos;t sell off-the-shelf software. We build custom AI and automation systems —
            deployed securely inside the environment you already run, and owned by you. Below are
            our core capabilities; for your industry (legal, tax, financial, dealmaking) or
            function,{' '}
            <Link href="/use-cases" className={styles.inlineLink}>see use cases →</Link>
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          <div className={styles.grid}>
            {services.map((s) => (
              <Link href={`/${s.slug}`} key={s.slug} className={styles.card}>
                <h2 className={styles.cardTitle}>{s.navLabel}</h2>
                <p className={styles.cardDesc}>{s.heroSub}</p>
                <span className={`link-arrow ${styles.cardLink}`}>
                  Explore <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 'var(--spacing-xl)', color: 'var(--color-muted)' }}>
            Not sure where to start?{' '}
            <Link href="/ai-readiness-assessment" className={styles.inlineLink}>
              Take the AI Readiness Assessment →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
