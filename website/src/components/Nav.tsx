'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Nav.module.css';
import { services, useCasesByFunction, useCasesByIndustry } from '../lib/taxonomy';

export default function Nav() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [menu, setMenu] = useState<string | null>(null); // which dropdown is open
  const close = () => { setOpen(false); setMenu(null); };
  const toggleMenu = (key: string) => setMenu((m) => (m === key ? null : key));

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={close} aria-label="Chronexa home">
        <Image src="/images/logo.png" alt="" width={32} height={32} className={styles.logoMark} priority />
        <span className={styles.logoText}>Chronexa</span>
      </Link>

      <button
        type="button"
        className={styles.toggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.toggleBar} data-open={open} />
        <span className={styles.toggleBar} data-open={open} />
      </button>

      <nav id="primary-nav" className={styles.links} data-open={open} aria-label="Primary">
        {/* Services dropdown */}
        <div className={styles.item} data-open={menu === 'services'}>
          <button type="button" className={styles.trigger} aria-expanded={menu === 'services'} onClick={() => toggleMenu('services')}>
            Services <span className={styles.caret} aria-hidden="true">▾</span>
          </button>
          <div className={styles.panel}>
            <div className={styles.panelGrid}>
              {services.map((s) => (
                <Link key={s.slug} href={`/${s.slug}`} className={styles.panelLink} onClick={close}>
                  <span className={styles.panelLabel}>{s.navLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases dropdown (by function + by industry) */}
        <div className={`${styles.item} ${styles.itemWide}`} data-open={menu === 'usecases'}>
          <button type="button" className={styles.trigger} aria-expanded={menu === 'usecases'} onClick={() => toggleMenu('usecases')}>
            Use Cases <span className={styles.caret} aria-hidden="true">▾</span>
          </button>
          <div className={`${styles.panel} ${styles.panelWide}`}>
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

        <Link href="/case-studies" className={styles.link} onClick={close}>Case Studies</Link>
        <Link href="/blog" className={styles.link} onClick={close}>Blog</Link>
        <Link href="/about" className={styles.link} onClick={close}>About</Link>
        <Link href="/contact" className={styles.cta} onClick={close}>Book a Free Audit</Link>
      </nav>
    </header>
  );
}
