import Link from 'next/link';
import type { ReactNode } from 'react';
import { useCasesByIndustry } from '../lib/taxonomy';
import styles from './IndustryGrid.module.css';

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

// Icon per industry slug.
const ICONS: Record<string, ReactNode> = {
  'legal-due-diligence-automation': sv(<><path d="M12 3v18M7 21h10M5 7h14M5 7 3 13h4zM19 7l-2 6h4z" /></>),
  'cpa-tax-document-automation': sv(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h3" /></>),
  'insurance-claims-triage-automation': sv(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></>),
  'financial-services-automation': sv(<><path d="M3 21h18M4 10h16M5 10 12 4l7 6M7 10v8M12 10v8M17 10v8" /></>),
  'vc-pe-crm-automation': sv(<><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></>),
  'property-management-automation': sv(<><path d="M3 21h18M5 21V8l7-4 7 4v13" /><path d="M9 21v-5h6v5M9 11h.01M15 11h.01" /></>),
  'pharma-life-sciences-automation': sv(<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7 15h10" /></>),
  'd2c-ecommerce-automation': sv(<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L22 7H6" /></>),
};

export default function IndustryGrid() {
  return (
    <>
      <p className="eyebrow">Built for your industry</p>
      <h2 className={styles.heading}>Deep automation for your sector</h2>
      <div className={styles.grid}>
        {useCasesByIndustry.map((u) => (
          <Link href={`/${u.slug}`} key={u.slug} className={styles.card} data-reveal>
            <span className={styles.icon}>{ICONS[u.slug]}</span>
            <h3 className={styles.cardTitle}>{u.navLabel}</h3>
            <p className={styles.cardDesc}>{u.heroSub}</p>
            <span className={`link-arrow ${styles.link}`}>Explore <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
      <p className={styles.more}>
        <Link href="/use-cases" className="link-arrow">See all use cases — by function &amp; industry <span aria-hidden="true">→</span></Link>
      </p>
    </>
  );
}
