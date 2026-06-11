import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { site } from '../lib/site';
import { services, useCasesByIndustry } from '../lib/taxonomy';
import { CALCULATORS } from './calculators/registry';

export default function Footer() {
  const year = 2026; // static to keep the footer a pure server component (no Date() at render)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            <Image src="/images/logo.png" alt="" width={36} height={36} className={styles.logoMark} />
            Chronexa
          </p>
          <p>{site.tagline}. We build assets, not software subscriptions.</p>
          <a href={`mailto:${site.email}`} className={styles.email}>{site.email}</a>
        </div>

        <div className={styles.col}>
          <h2>Services</h2>
          {services.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className={styles.link}>{s.navLabel}</Link>
          ))}
          <Link href="/solutions" className={styles.link}>All services</Link>
        </div>

        <div className={styles.col}>
          <h2>Use cases</h2>
          {useCasesByIndustry.slice(0, 6).map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className={styles.link}>{s.navLabel}</Link>
          ))}
          <Link href="/use-cases" className={styles.link}>All use cases</Link>
        </div>

        <div className={styles.col}>
          <h2>Company</h2>
          <Link href="/ai-engines" className={styles.link}>AI Engines</Link>
          <Link href="/case-studies" className={styles.link}>Case Studies</Link>
          <Link href="/blog" className={styles.link}>Blog</Link>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
          <h2>Free tools</h2>
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className={styles.link}>{c.navLabel}</Link>
          ))}
          <Link href="/tools" className={styles.link}>All free tools</Link>
        </div>

        <div className={styles.col}>
          <h2>Get in touch</h2>
          <p className={styles.meta}>{site.locality}</p>
          <p className={styles.meta}>{site.hours}</p>
          <p className={styles.meta}>Sun: Closed</p>
          <div className={styles.socials}>
            <a href={site.socials.linkedin} className={styles.link} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={site.socials.twitter} className={styles.link} target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href={site.socials.instagram} className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>&copy; {year} {site.name}. All rights reserved.</span>
        <span>Engineered for B2B enterprises. Delivering globally.</span>
      </div>
    </footer>
  );
}
