import type { Metadata } from 'next';
import Link from 'next/link';
import { useCasesByFunction, useCasesByIndustry } from '../../lib/taxonomy';
import { site } from '../../lib/site';
import styles from './use-cases.module.css';

export const metadata: Metadata = {
  title: { absolute: 'AI Automation Use Cases for Business Teams | Chronexa' },
  description:
    'See how AI can automate work across sales, support, finance, operations, legal and more. Find ideas you can apply to your business.',
  alternates: { canonical: '/use-cases' },
  openGraph: {
    title: 'AI Automation Use Cases for Business Teams | Chronexa',
    description: 'See how AI can automate work across sales, support, finance, operations, legal and more. Find ideas you can apply to your business.',
    url: '/use-cases',
    type: 'website',
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Use Cases for Business Teams | Chronexa',
    description: 'See how AI can automate work across sales, support, finance, operations, legal and more. Find ideas you can apply to your business.',
    images: [site.ogImage],
  },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [...useCasesByFunction, ...useCasesByIndustry].map((u, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: u.title,
    url: `${site.url}/${u.slug}`,
  })),
};

function Group({ title, sub, items }: { title: string; sub: string; items: typeof useCasesByFunction }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHeadRow}>
        <h2 className={styles.groupHead}>{title}</h2>
        <p className={styles.groupSub}>{sub}</p>
      </div>
      <div className={styles.grid}>
        {items.map((u) => (
          <Link href={`/${u.slug}`} key={u.slug} className={styles.card}>
            <h3 className={styles.cardTitle}>{u.navLabel}</h3>
            <p className={styles.cardDesc}>{u.heroSub}</p>
            <span className={`link-arrow ${styles.cardLink}`}>Explore <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function UseCasesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <section className={styles.hero}>
        <div className="container">
          <p className="eyebrow">Use Cases</p>
          <h1 className={styles.h1}>Automation for your function — and your industry</h1>
          <p className="heroDescription">
            However you frame the problem, we&apos;ve built for it. Explore AI and n8n automation
            use cases by business function or by industry.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          <Group
            title="By function"
            sub="Automate a department end to end — whatever industry you're in."
            items={useCasesByFunction}
          />
          <div style={{ marginTop: 'var(--spacing-2xl)' }}>
            <Group
              title="By industry"
              sub="Pre-built for the realities, systems, and compliance of your sector."
              items={useCasesByIndustry}
            />
          </div>
          <p style={{ marginTop: 'var(--spacing-xl)', color: 'var(--color-muted)' }}>
            Not sure where to start?{' '}
            <Link href="/business-process-automation-consulting" className={styles.inlineLink}>
              Take the AI Readiness Assessment →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
