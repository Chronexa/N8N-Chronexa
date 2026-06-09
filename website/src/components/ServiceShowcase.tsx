import Link from 'next/link';
import type { ReactNode, CSSProperties } from 'react';
import { useCasesByIndustry } from '../lib/taxonomy';
import styles from './ServiceShowcase.module.css';

type Service = { title: string; description: string; href: string; icon: ReactNode };

const I = {
  doc: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><circle cx="11" cy="13" r="2.5" /><path d="m15 17-1.8-1.8" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /><path d="M19 7v4h-4" />
    </svg>
  ),
  integrate: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h6a3 3 0 0 1 3 3v6M6 9v6a3 3 0 0 0 3 3h6" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 11 14-7v16L3 13z" /><path d="M3 11v2a2 2 0 0 0 2 2h2" /><path d="M8 15v3a1.5 1.5 0 0 0 3 0v-2" /><path d="M19 8a3 3 0 0 1 0 8" />
    </svg>
  ),
  assess: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6l1 4H8z" /><path d="M8 7v3a4 4 0 0 0 8 0V7" /><path d="M12 14v4M8 21h8" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  ),
};

const SERVICES: Service[] = [
  { title: 'Legal AI', description: 'Regulatory-change monitoring, legal RAG over your matters and precedents, and due-diligence automation — deployed securely inside your environment.', href: '/legal-due-diligence-automation', icon: I.doc },
  { title: 'Tax & Accounting AI', description: 'An AI copilot for CPA firms that chases client documents, reads W-2s, 1099s and K-1s, and drafts returns — so preparers do advisory, not data entry.', href: '/cpa-tax-document-automation', icon: I.assess },
  { title: 'Financial Services & Quant', description: 'Compliance and KYC automation, equity-research copilots, and quant/ML systems (XGBoost, LSTM) — built inside your security perimeter.', href: '/financial-services-automation', icon: I.sales },
  { title: 'M&A, PE & Investment Banking', description: 'Due-diligence and data-room analysis, deal-flow parsing into your CRM, and portfolio monitoring — where confidential deal data can’t leak.', href: '/vc-pe-crm-automation', icon: I.integrate },
  { title: 'Document Intelligence for Regulated Industries', description: 'OCR + LLM extraction with RAG grounding and human-in-the-loop validation — auditable document automation across legal, finance and pharma.', href: '/document-processing-automation', icon: I.custom },
  { title: 'Custom AI Agents & Workflow Automation', description: 'Bespoke agentic systems for the work that doesn’t fit a package — plus fast, lower-cost workflow automation for ops and sales.', href: '/n8n-automation-services', icon: I.marketing },
];

export default function ServiceShowcase() {
  return (
    <>
      <p className="eyebrow">What we build</p>
      <h2 className={styles.heading}>Enterprise AI for the work that can’t leak</h2>

      <div className={styles.grid}>
        {SERVICES.map((service, i) => (
          <Link href={service.href} className={styles.card} key={service.title} data-reveal style={{ '--reveal-i': i % 3 } as CSSProperties}>
            <span className={styles.cardIcon}>{service.icon}</span>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardDesc}>{service.description}</p>
            <span className={`link-arrow ${styles.cardLink}`}>Explore <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>

      <p className={styles.industries}>
        <span className={styles.industriesLabel}>Built for your industry:</span>{' '}
        {useCasesByIndustry.map((u, i) => (
          <span key={u.slug}>
            {i > 0 && <span className={styles.dot} aria-hidden="true"> · </span>}
            <Link href={`/${u.slug}`} className={styles.industryLink}>{u.navLabel}</Link>
          </span>
        ))}
        {' '}
        <Link href="/use-cases" className={styles.allLink}>See all use cases <span aria-hidden="true">→</span></Link>
      </p>
    </>
  );
}
