'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Nav.module.css';
import BookButton from './BookButton';
import { indexableBuckets, hubPath } from '../lib/blog-taxonomy';
import { AUDIT_OFFER, INDUSTRY_GROUPS, INSIGHT_GROUPS, SERVICE_GROUPS, WORK_LINKS, type NavGroup } from '../lib/nav';

/* ============================================================================
   Nav — one full-bleed dropdown plane, four menus (2026-10-07 IA).

   Services · Industries · Work · Insights · About · CTA — the pattern every
   firm we benchmarked uses (Fractional AI, Simform, Thoughtworks). Content
   lives in lib/nav.ts so Nav and Footer can't drift. Each menu is one 12-unit
   grid: link columns span 3, and the right-hand column is either a feature
   card (the free audit, our primary offer) or empty space.
   ============================================================================ */

function Chevron() {
  return (
    <svg className={styles.caret} width="11" height="11" viewBox="0 0 12 12" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M2.75 4.5 6 7.75 9.25 4.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg className={styles.footerArrow} width="15" height="15" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" />
    </svg>
  );
}

function PanelFooter({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <div className={styles.panelFooter}>
      <Link href={href} className={styles.panelFooterLink} onClick={onClick}>
        {label} <ArrowRight />
      </Link>
    </div>
  );
}

function Columns({ groups, onClick }: { groups: NavGroup[]; onClick: () => void }) {
  return (
    <>
      {groups.map((g) => (
        <div key={g.head} className={styles.col}>
          <p className={styles.colHead}>{g.head}</p>
          <ul className={styles.colList}>
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.colLink} onClick={onClick}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function AuditFeature({ onClick, location }: { onClick: () => void; location: string }) {
  return (
    <div className={styles.feature}>
      <p className={styles.featureHead}>{AUDIT_OFFER.head}</p>
      <p className={styles.featureTitle}>{AUDIT_OFFER.title}</p>
      <p className={styles.featureBody}>{AUDIT_OFFER.body}</p>
      <BookButton className={styles.featureCta} location={location} onClick={onClick}>
        {AUDIT_OFFER.cta} <ArrowRight />
      </BookButton>
    </div>
  );
}

function MenuItem({ id, label, open, onToggle, children }: { id: string; label: string; open: boolean; onToggle: (id: string) => void; children: React.ReactNode }) {
  return (
    <div className={styles.item} data-open={open}>
      <button type="button" className={styles.trigger} aria-expanded={open} onClick={() => onToggle(id)}>
        {label} <Chevron />
      </button>
      <div className={styles.panel}>{children}</div>
    </div>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const close = () => { setOpen(false); setMenu(null); };
  const toggle = (key: string) => setMenu((m) => (m === key ? null : key));

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={close} aria-label="Chronexa home">
        <Image src="/images/logo.png" alt="" width={32} height={32} className={styles.logoMark} priority />
        <span className={styles.logoText}>Chronexa</span>
      </Link>

      <button type="button" className={styles.toggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open} aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}>
        <span className={styles.toggleBar} data-open={open} />
        <span className={styles.toggleBar} data-open={open} />
      </button>

      <nav id="primary-nav" className={styles.links} data-open={open} aria-label="Primary">
        <MenuItem id="services" label="Services" open={menu === "services"} onToggle={toggle}>
          <div className={styles.panelBody}>
            <Columns groups={SERVICE_GROUPS} onClick={close} />
            <AuditFeature onClick={close} location="nav-services" />
          </div>
          <PanelFooter href="/how-we-work" label="How we work: audit, first workflow, partnership" onClick={close} />
        </MenuItem>

        <MenuItem id="industries" label="Industries" open={menu === "industries"} onToggle={toggle}>
          <div className={styles.panelBody}>
            <Columns groups={INDUSTRY_GROUPS} onClick={close} />
            <div className={styles.feature}>
              <p className={styles.featureHead}>Any industry</p>
              <p className={styles.featureTitle}>Don&apos;t see yours?</p>
              <p className={styles.featureBody}>We start from your workflows and tools, not an industry template. Most of what we build is specific to one company.</p>
            </div>
          </div>
          <PanelFooter href="/solutions" label="All solutions" onClick={close} />
        </MenuItem>

        <MenuItem id="work" label="Work" open={menu === "work"} onToggle={toggle}>
          <div className={styles.panelBody}>
            {WORK_LINKS.map((w) => (
              <Link key={w.href + w.label} href={w.href} className={`${styles.engine} ${styles.workItem}`} onClick={close}>
                <span className={styles.engineName}>{w.label}</span>
                <span className={styles.engineBlurb}>{w.blurb}</span>
              </Link>
            ))}
          </div>
        </MenuItem>

        <MenuItem id="insights" label="Insights" open={menu === "insights"} onToggle={toggle}>
          <div className={styles.panelBody}>
            <Columns groups={INSIGHT_GROUPS} onClick={close} />
            <div className={styles.col}>
              <p className={styles.colHead}>Articles</p>
              <ul className={styles.colList}>
                <li><Link href="/blog" className={styles.colLink} onClick={close}>All articles</Link></li>
                {indexableBuckets('topic').slice(0, 4).map((b) => (
                  <li key={b.value}><Link href={hubPath('topic', b.value)} className={styles.colLink} onClick={close}>{b.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </MenuItem>

        <Link href="/about" className={styles.link} onClick={close}>About</Link>

        <BookButton className={styles.cta} location="nav" onClick={close}>Book a strategy call</BookButton>
      </nav>
    </header>
  );
}
