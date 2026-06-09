'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './Nav.module.css';
import { services, useCasesByFunction, useCasesByIndustry } from '../lib/taxonomy';
import BookButton from './BookButton';

// ─── AI Engines nav items ────────────────────────────────────────────────────
// Defined inline (not imported from engines-data) to keep the nav bundle lean.

type IconKey = 'send' | 'doc' | 'chart' | 'layers' | 'shield' | 'inbox';

const ENGINE_ICON_PATHS: Record<IconKey, ReactNode> = {
  send:   <><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>,
  doc:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></>,
  chart:  <><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></>,
  layers: <><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>,
  inbox:  <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 5h14l3 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5l3-7z"/></>,
};

function EngIco({ type }: { type: IconKey }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      {ENGINE_ICON_PATHS[type]}
    </svg>
  );
}

type NavEngine = { name: string; kicker: string; icon: IconKey } & (
  | { status: 'live'; href: string; blurb: string }
  | { status: 'soon' }
);

const AI_ENGINES: NavEngine[] = [
  { name: 'Sales Engine',                kicker: 'Outbound & pipeline',          status: 'live', icon: 'send',   href: '/ai-engines/sales-engine',    blurb: 'Sources buyers, researches every account, writes sequences, and sends — on autopilot.' },
  { name: 'CPA & Tax Engine',            kicker: 'Tax compliance & filing',      status: 'live', icon: 'doc',    href: '/ai-engines/cpa-tax-engine',   blurb: 'Extracts every document, pre-fills the return in your tax software, routes to CPA for sign-off.' },
  { name: 'Investment Research Engine',  kicker: 'Capital markets & RA',         status: 'soon', icon: 'chart'  },
  { name: 'Document & Data Engine',      kicker: 'Unstructured → structured',    status: 'soon', icon: 'layers' },
  { name: 'Legal & Regulatory Engine',   kicker: 'Reg-watch & matters',          status: 'soon', icon: 'shield' },
  { name: 'Customer Support Engine',     kicker: 'Omnichannel CS',               status: 'soon', icon: 'inbox'  },
];

const LIVE_ENGINES  = AI_ENGINES.filter((e): e is Extract<NavEngine, { status: 'live' }> => e.status === 'live');
const SOON_ENGINES  = AI_ENGINES.filter((e): e is Extract<NavEngine, { status: 'soon' }> => e.status === 'soon');

// ─── Component ───────────────────────────────────────────────────────────────

export default function Nav() {
  const [open, setOpen]   = useState(false);
  const [menu, setMenu]   = useState<string | null>(null);
  const close             = () => { setOpen(false); setMenu(null); };
  const toggle            = (key: string) => setMenu((m) => (m === key ? null : key));

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

        {/* ── Services ─────────────────────────────────────────────────── */}
        <div className={styles.item} data-open={menu === 'services'}>
          <button type="button" className={styles.trigger}
            aria-expanded={menu === 'services'} onClick={() => toggle('services')}>
            Services <span className={styles.caret} aria-hidden="true">▾</span>
          </button>
          <div className={styles.panel}>
            <div className={styles.panelInner}>
              <p className={styles.panelHead}>What we build</p>
              <div className={styles.panelGrid}>
                {services.map((s) => (
                  <Link key={s.slug} href={`/${s.slug}`} className={styles.panelLink} onClick={close}>
                    <span className={styles.panelLabel}>{s.navLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Use Cases ────────────────────────────────────────────────── */}
        <div className={`${styles.item} ${styles.itemWide}`} data-open={menu === 'usecases'}>
          <button type="button" className={styles.trigger}
            aria-expanded={menu === 'usecases'} onClick={() => toggle('usecases')}>
            Use Cases <span className={styles.caret} aria-hidden="true">▾</span>
          </button>
          <div className={`${styles.panel} ${styles.panelWide}`}>
            <div className={styles.panelInner}>
              <div className={styles.panelCols}>
                <div className={styles.panelCol}>
                  <p className={styles.panelHead}>By function</p>
                  <p className={styles.panelSub}>Automate a department</p>
                  {useCasesByFunction.map((s) => (
                    <Link key={s.slug} href={`/${s.slug}`} className={styles.panelLink} onClick={close}>
                      <span className={styles.panelLabel}>{s.navLabel}</span>
                    </Link>
                  ))}
                </div>
                <div className={styles.panelCol}>
                  <p className={styles.panelHead}>By industry</p>
                  <p className={styles.panelSub}>Built for your sector</p>
                  {useCasesByIndustry.map((s) => (
                    <Link key={s.slug} href={`/${s.slug}`} className={styles.panelLink} onClick={close}>
                      <span className={styles.panelLabel}>{s.navLabel}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.panelFooter}>
              <Link href="/use-cases" className={styles.panelFooterLink} onClick={close}>
                View all use cases <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── AI Engines — mega-menu ────────────────────────────────────── */}
        <div className={`${styles.item} ${styles.itemEngines}`} data-open={menu === 'engines'}>
          <button type="button" className={styles.trigger}
            aria-expanded={menu === 'engines'} onClick={() => toggle('engines')}>
            AI Engines <span className={styles.caret} aria-hidden="true">▾</span>
          </button>
          <div className={`${styles.panel} ${styles.enginePanel}`}>
            <div className={styles.engineCols}>

              {/* Live — left column */}
              <div className={styles.engineColLive}>
                <p className={styles.engineColHead}>Live now</p>
                {LIVE_ENGINES.map((e) => (
                  <Link key={e.name} href={e.href} className={styles.engineCard} onClick={close}>
                    <div className={styles.engineCardTop}>
                      <span className={styles.engineCardIcon}><EngIco type={e.icon} /></span>
                      <span className={styles.engineCardName}>{e.name}</span>
                      <span className={styles.badgeLive}>Live</span>
                    </div>
                    <p className={styles.engineCardBlurb}>{e.blurb}</p>
                    <span className={styles.engineCardCta}>Explore <span aria-hidden="true">→</span></span>
                  </Link>
                ))}
              </div>

              {/* Coming soon — right column */}
              <div className={styles.engineColSoon}>
                <p className={styles.engineColHead}>Coming soon</p>
                {SOON_ENGINES.map((e) => (
                  <div key={e.name} className={styles.engineSoonRow}>
                    <span className={styles.engineSoonIcon}><EngIco type={e.icon} /></span>
                    <span className={styles.engineSoonText}>
                      <span className={styles.engineSoonName}>{e.name}</span>
                      <span className={styles.engineSoonKicker}>{e.kicker}</span>
                    </span>
                    <span className={styles.badgeSoon}>Soon</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panelFooter}>
              <Link href="/ai-engines" className={styles.panelFooterLink} onClick={close}>
                View all 6 AI Engines <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Simple links ─────────────────────────────────────────────── */}
        <Link href="/case-studies" className={styles.link} onClick={close}>Case Studies</Link>
        <Link href="/blog"         className={styles.link} onClick={close}>Blog</Link>
        <Link href="/about"        className={styles.link} onClick={close}>About</Link>

        <BookButton className={styles.cta} location="nav" onClick={close}>Book a Free Audit</BookButton>
      </nav>
    </header>
  );
}
