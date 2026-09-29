import Image from "next/image";
import Link from "next/link";
import s from "./PortfolioChrome.module.css";

export function PortfolioHeader() {
  return (
    <header className={s.nav}>
      <Link href="/" className={s.brand} aria-label="Chronexa home">
        <Image src="/images/logo.png" alt="" width={26} height={26} priority />
        <span>Chronexa</span>
        <i>n8n portfolio</i>
      </Link>
      <nav className={s.navLinks} aria-label="Portfolio navigation">
        <Link href="/portfolio">Workflows</Link>
        <Link href="/solutions">Solutions</Link>
        <Link href="/case-studies">Case studies</Link>
        <Link href="/blog">Insights</Link>
      </nav>
      <Link href="/contact" className={s.navCta}>Start a project</Link>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <div className={s.footerScene}>
      <div className={s.stars} aria-hidden="true" />
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <div>
            <Link href="/" className={s.footerBrand}>
              <Image src="/images/logo.png" alt="" width={28} height={28} /> Chronexa
            </Link>
            <p>Automate without limits.</p>
          </div>
          <div><strong>Explore</strong><Link href="/portfolio">Workflows</Link><Link href="/solutions">Solutions</Link><Link href="/case-studies">Case studies</Link></div>
          <div><strong>Company</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><a href="mailto:info@chronexa.io">Email us</a></div>
        </div>
        <div className={s.footerBottom}><span>© 2026 Chronexa</span><span>Production-grade n8n automation</span></div>
      </footer>
    </div>
  );
}
