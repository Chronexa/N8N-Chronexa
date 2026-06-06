import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '../../lib/taxonomy';
import { site } from '../../lib/site';
import styles from './solutions.module.css';

export const metadata: Metadata = {
  title: 'AI Automation Services',
  description:
    'Chronexa\'s AI automation services — document intelligence, sales & revenue operations, marketing automation, system & data integration, custom AI agents, and an AI readiness assessment. Built on your existing stack.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'AI Automation Services | Chronexa',
    description:
      'Document intelligence, RevOps, marketing, data integration, and custom AI agents — built on your existing stack.',
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
          <h1 className={styles.h1}>AI automation services</h1>
          <p className="heroDescription">
            We don&apos;t sell off-the-shelf software. We build custom n8n and AI workflows on
            top of the systems you already run — scoped, fixed-price, and live in 30–60 days.
            Looking for your industry or function?{' '}
            <Link href="/use-cases" className={styles.inlineLink}>See use cases →</Link>
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
        </div>
      </section>
    </>
  );
}
