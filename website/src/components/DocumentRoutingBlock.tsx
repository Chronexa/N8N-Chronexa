import Link from 'next/link';
import styles from './DocumentRoutingBlock.module.css';
import LineIcon from './Icon';

export default function DocumentRoutingBlock() {
  const routes = [
    {
      title: 'Tax & Accounting',
      body: 'W-2s, K-1s, 1099s, bank statements, and broker reports routed into tax software.',
      href: '/cpa-tax-document-automation',
    },
    {
      title: 'Legal & Due Diligence',
      body: 'Term sheets, NDAs, and contracts parsed for clauses, entities, and risk flags.',
      href: '/legal-due-diligence-automation',
    },
    {
      title: 'Insurance Claims',
      body: 'Medical records, repair estimates, and FNOL forms extracted and verified.',
      href: '/insurance-claims-triage-automation',
    },
    {
      title: 'Financial Services',
      body: 'KYC docs, trailing documents, and loan applications matched to CRM records.',
      href: '/financial-services-automation',
    },
  ];

  return (
    <section className="section-muted" style={{ borderTop: '1px solid var(--border-light)' }}>
      <div className="container" data-reveal>
        <p className="eyebrow">Industry specific</p>
        <h2 className={styles.h2} style={{ fontSize: 'var(--step-2)', fontWeight: 700, marginBottom: '2.5rem' }}>If your documents are...</h2>
        <div className={styles.grid}>
          {routes.map((route) => (
            <Link href={route.href} key={route.href} className={styles.card}>
              <h3 className={styles.cardTitle}>{route.title}</h3>
              <p className={styles.cardBody}>{route.body}</p>
              <span className={styles.arrow}><LineIcon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
