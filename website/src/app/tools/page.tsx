import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import { CALCULATORS } from '../../components/calculators/registry';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/tools`;
const TITLE = 'Free AI Automation ROI Calculators & Tools | Chronexa';
const DESCRIPTION =
  'Free, ungated calculators with the math in the open: law-firm billing leakage, CPA tax-season capacity, document processing cost. See what manual work costs you — and what automation recovers — in your own numbers.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'automation ROI calculator', 'AI ROI calculator', 'billing leakage calculator',
    'tax season capacity calculator', 'document processing cost calculator', 'free business calculators',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Free Tools', item: URL },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Free AI Automation Calculators',
      itemListElement: CALCULATORS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `${site.url}/${c.slug}`,
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section-dark">
        <div className="container">
          <div className={styles.heroInner}>
            <p className="eyebrow">Free tools</p>
            <h1 className={styles.heroTitle}>Calculators with the math in the open</h1>
            <p className={styles.heroSub}>
              No gates, no black boxes. Each calculator runs live in your browser on published benchmarks, shows its
              formula, and models recovery conservatively — so the number you get is one you can defend to a partner or
              a CFO.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          <div className={styles.fixGrid}>
            {CALCULATORS.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className={styles.fixCard}>
                <p className={styles.fixKicker}>{c.benchmarkHook}</p>
                <p className={styles.fixTitle}>{c.title}</p>
                <p className={styles.fixBody}>{c.description}</p>
              </Link>
            ))}
          </div>
          <p className={styles.prose} style={{ marginTop: 'var(--spacing-md)' }}>
            More calculators are on the way — insurance claims leakage and customer-support cost-per-ticket are next.
            Every tool here follows the same rules: your inputs stay in your browser, the methodology is published on
            the page, and the benchmarks come from our own published engine results or named industry studies.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
