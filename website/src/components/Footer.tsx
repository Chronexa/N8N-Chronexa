import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { site } from '../lib/site';
import { AUDIT_OFFER, INDUSTRY_GROUPS, INSIGHT_GROUPS, SERVICE_GROUPS, WORK_LINKS } from '../lib/nav';
import BookButton from './BookButton';

/* Footer mirrors the nav IA (lib/nav.ts): every service and industry page is one
   click from every page on the site, which is also the internal-link spine the
   SEO pages rely on. */
export default function Footer() {
  const year = 2026; // static to keep the footer a pure server component (no Date() at render)
  const industries = INDUSTRY_GROUPS.flatMap((g) => g.links);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            <Image src="/images/logo.png" alt="" width={36} height={36} className={styles.logoMark} />
            Chronexa
          </p>
          <p>AI-native IT services: AI agents, automation, data and software. Anthropic partner.</p>
          <p className={styles.meta}>{site.locality}</p>
          <a href={`mailto:${site.email}`} className={styles.email}>{site.email}</a>
          <BookButton location="footer" className={styles.link}>{AUDIT_OFFER.cta} →</BookButton>
        </div>

        {SERVICE_GROUPS.map((g) => (
          <div key={g.head} className={styles.col}>
            <h2>{g.head}</h2>
            {g.links.map((l) => <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>)}
          </div>
        ))}

        <div className={styles.col}>
          <h2>Industries</h2>
          {industries.map((l) => <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>)}
        </div>

        <div className={styles.col}>
          <h2>Work & insights</h2>
          {WORK_LINKS.slice(0, 3).map((l) => <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>)}
          {INSIGHT_GROUPS.flatMap((g) => g.links).slice(0, 4).map((l) => <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>)}
          <Link href="/blog" className={styles.link}>Blog</Link>
          <h2>Company</h2>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
          <div className={styles.socials}>
            <a href={site.socials.linkedin} className={styles.link} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={site.socials.twitter} className={styles.link} target="_blank" rel="noopener noreferrer">X / Twitter</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>&copy; {year} {site.name}. All rights reserved.</span>
        <span><Link href="/privacy">Privacy Policy</Link></span>
        <span>Serving the United States and clients worldwide.</span>
      </div>
    </footer>
  );
}
