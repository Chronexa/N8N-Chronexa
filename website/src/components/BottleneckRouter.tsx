'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import styles from './BottleneckRouter.module.css';
import { useCasesByIndustry } from '../lib/taxonomy';
import LogoChip from './LogoChip';
import TrackedLink from './TrackedLink';

/**
 * The self-selection section — rebuilt 2026-07 from two stacked card walls
 * (16 cards visible at once) into a SEGMENTED PANEL: one tab bar, one panel
 * at a time, so a visitor scans eight things, not sixteen.
 *
 *   • BY BOTTLENECK — compact cards, each opened by the real tools that
 *     pipeline runs on (only tools we genuinely build with — a logo is a claim).
 *   • BY INDUSTRY — no more bare labels: each industry is a row with what we
 *     actually automate for them, its tool cluster, and the spoke link.
 *
 * Both axes still point at pages that already exist, and both still carry the
 * homepage's internal-linking job. `router_click` events unchanged.
 */

type Logo = { file: string; name: string };
type Bottleneck = { label: string; href: string; hint: string; logos: Logo[] };

const BOTTLENECKS: Bottleneck[] = [
  {
    label: 'Winning new clients',
    href: '/sales-revenue-automation',
    hint: 'Sourcing, research, outreach, follow-up',
    logos: [
      { file: 'apollo.png', name: 'Apollo' },
      { file: 'clay.png', name: 'Clay' },
      { file: 'instantly.png', name: 'Instantly' },
    ],
  },
  {
    label: 'Documents piling up',
    href: '/document-processing-automation',
    hint: 'Intake, extraction, classification, filing',
    logos: [
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'word.svg', name: 'Word' },
    ],
  },
  {
    label: 'Answering customers',
    href: '/customer-support-automation',
    hint: 'Email, chat and voice, grounded in your data',
    logos: [
      { file: 'zendesk.png', name: 'Zendesk' },
      { file: 'intercom.png', name: 'Intercom' },
      { file: 'slack.png', name: 'Slack' },
    ],
  },
  {
    label: 'Invoices and the back office',
    href: '/finance-automation',
    hint: 'AP/AR, reconciliation, reporting',
    logos: [
      { file: 'stripe.png', name: 'Stripe' },
      { file: 'plaid.png', name: 'Plaid' },
      { file: 'excel.svg', name: 'Excel' },
    ],
  },
  {
    label: 'Work stuck between systems',
    href: '/operations-automation',
    hint: 'Handoffs, re-keying, status chasing',
    logos: [
      { file: 'n8n.svg', name: 'n8n' },
      { file: 'airtable.svg', name: 'Airtable' },
      { file: 'slack.png', name: 'Slack' },
    ],
  },
  {
    label: 'Hiring and onboarding',
    href: '/hr-automation',
    hint: 'Screening, scheduling, paperwork, ramp',
    logos: [
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'notion.svg', name: 'Notion' },
    ],
  },
  {
    label: 'Getting found',
    href: '/marketing-automation',
    hint: 'Demand generation and content operations',
    logos: [
      { file: 'google.png', name: 'Google' },
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'notion.svg', name: 'Notion' },
    ],
  },
  {
    label: 'Compliance and monitoring',
    href: '/cybersecurity-automation',
    hint: 'Alerts, evidence collection, audit trails',
    logos: [
      { file: 'sec.png', name: 'SEC EDGAR' },
      { file: 'fedregister.png', name: 'Federal Register' },
      { file: 'slack.png', name: 'Slack' },
    ],
  },
];

/** What we actually automate per industry + the tools it runs on.
    Lines are hint-length: the industry tab renders the SAME card grid as the
    bottleneck tab (one visual system, not a card view and a list view). */
const INDUSTRY_DETAIL: Record<string, { line: string; logos: Logo[] }> = {
  'legal-due-diligence-automation': {
    line: 'Diligence, matter intake, firm knowledge — privileged data stays put',
    logos: [
      { file: 'imanage.png', name: 'iManage' },
      { file: 'netdocuments.png', name: 'NetDocuments' },
      { file: 'clio.png', name: 'Clio' },
    ],
  },
  'cpa-tax-document-automation': {
    line: 'K-1 and 1099 extraction, reviewer-ready returns',
    logos: [
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'excel.svg', name: 'Excel' },
      { file: 'thomsonreuters.png', name: 'Thomson Reuters' },
    ],
  },
  'insurance-claims-triage-automation': {
    line: 'Claims classified and triaged, a human on every exception',
    logos: [
      { file: 'outlook.png', name: 'Outlook' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'box.png', name: 'Box' },
    ],
  },
  'financial-services-automation': {
    line: 'Custodian data unified, every trade human-authorised',
    logos: [
      { file: 'schwab.png', name: 'Charles Schwab' },
      { file: 'fidelity.png', name: 'Fidelity' },
      { file: 'plaid.png', name: 'Plaid' },
    ],
  },
  'vc-pe-crm-automation': {
    line: 'Deal flow, data rooms, portfolio monitoring',
    logos: [
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'gdrive.svg', name: 'Google Drive' },
      { file: 'excel.svg', name: 'Excel' },
    ],
  },
  'pharma-life-sciences-automation': {
    line: 'Literature reviews, safety monitoring, submissions',
    logos: [
      { file: 'word.svg', name: 'Word' },
      { file: 'sharepoint.png', name: 'SharePoint' },
      { file: 'outlook.png', name: 'Outlook' },
    ],
  },
};

type Axis = 'bottleneck' | 'industry';

export default function BottleneckRouter() {
  const [axis, setAxis] = useState<Axis>('bottleneck');
  const reduce = useReducedMotion();

  const industries = useCasesByIndustry.map((u) => ({
    label: u.navLabel,
    href: `/${u.slug}`,
    detail: INDUSTRY_DETAIL[u.slug],
  }));

  return (
    <>
      <div className={styles.headRow}>
        <div className={styles.head}>
          <p className="eyebrow">Where is the work stuck?</p>
          <h2 className={styles.heading}>
            The work isn&apos;t hard. It&apos;s that the same work happens{' '}
            <span className="accent-phrase">again, by hand, every day.</span>
          </h2>
          <p className={styles.sub}>
            Pick the one that sounds most like your week — or the industry you work in — and
            we&apos;ll show you what we&apos;ve already built for it.
          </p>
        </div>
        <Image
          src="/images/3d-docs.webp"
          alt=""
          width={1100}
          height={733}
          sizes="(max-width: 900px) 0px, 380px"
          className={styles.headArt}
          aria-hidden="true"
        />
      </div>

      <div className="seg-tabs" role="tablist" aria-label="Browse by bottleneck or industry">
        <button
          type="button"
          role="tab"
          className="seg-tab"
          aria-selected={axis === 'bottleneck'}
          aria-controls="router-panel"
          onClick={() => setAxis('bottleneck')}
        >
          By bottleneck
        </button>
        <button
          type="button"
          role="tab"
          className="seg-tab"
          aria-selected={axis === 'industry'}
          aria-controls="router-panel"
          onClick={() => setAxis('industry')}
        >
          By industry
        </button>
      </div>

      <div id="router-panel" role="tabpanel" className={styles.panelWrap}>
        <AnimatePresence mode="wait" initial={false}>
          {axis === 'bottleneck' ? (
            <motion.ul
              key="bottleneck"
              className={styles.cards}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {BOTTLENECKS.map((b) => (
                <li key={b.href}>
                  <TrackedLink
                    href={b.href}
                    className={styles.card}
                    event="router_click"
                    props={{ axis: 'bottleneck', label: b.label, destination: b.href }}
                  >
                    <span className={styles.cardLogos}>
                      {b.logos.map((l) => (
                        <LogoChip key={l.file + l.name} file={l.file} name={l.name} size="sm" />
                      ))}
                    </span>
                    <span className={styles.cardLabel}>{b.label}</span>
                    <span className={styles.cardHint}>{b.hint}</span>
                  </TrackedLink>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul
              key="industry"
              className={styles.cards}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {industries.map((ind) => (
                <li key={ind.href}>
                  <TrackedLink
                    href={ind.href}
                    className={styles.card}
                    event="router_click"
                    props={{ axis: 'industry', label: ind.label, destination: ind.href }}
                  >
                    <span className={styles.cardLogos}>
                      {ind.detail?.logos.map((l) => (
                        <LogoChip key={l.file + l.name} file={l.file} name={l.name} size="sm" />
                      ))}
                    </span>
                    <span className={styles.cardLabel}>{ind.label}</span>
                    {ind.detail && <span className={styles.cardHint}>{ind.detail.line}</span>}
                  </TrackedLink>
                </li>
              ))}
              {/* The visitor who isn't on the list is still a lead. */}
              <li>
                <TrackedLink
                  href="/contact"
                  className={`${styles.card} ${styles.cardOpen}`}
                  event="router_click"
                  props={{ axis: 'industry', label: 'Something else', destination: '/contact' }}
                >
                  <span className={styles.cardLabel}>
                    Something else <span aria-hidden="true">→</span>
                  </span>
                  <span className={styles.cardHint}>
                    If the work is repetitive and the data is sensitive, it&apos;s probably ours.
                  </span>
                </TrackedLink>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
