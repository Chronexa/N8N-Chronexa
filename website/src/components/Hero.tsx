import styles from './Hero.module.css';
import BookButton from './BookButton';
import HeroVideo from './HeroVideo';
import CountUp from './CountUp';

const ShieldCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
      fill="currentColor"
      opacity="0.18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Art-directed LCP poster: a portrait crop on phones (matches the mobile
          video), the wide crop on desktop. Native <picture> so the browser only
          downloads the source that matches — best mobile performance. */}
      <picture className={styles.heroPicture}>
        <source media="(max-width: 860px)" srcSet="/images/hero-vista-mobile.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-vista.jpg" alt="" className={styles.heroImg} fetchPriority="high" decoding="async" />
      </picture>
      <HeroVideo />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroBackground} aria-hidden="true" />
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          {/* Third-party-verifiable credential, at the one point 100% of visitors
              reach. It used to sit in a lonely strip below the fold. */}
          <p className={styles.heroBadge}>
            <ShieldCheck />
            <span>Official Anthropic Partner</span>
          </p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Add capacity <span className="accent-phrase">without adding headcount.</span>
          </h1>
          <p className={styles.heroDescription}>
            We&apos;re the AI automation agency for firms that want growth without the hiring
            bill — digital co-workers engineered into your own environment, on the tools you
            already run. Deep in financial services, legal, insurance and private equity; we
            start wherever your work is stuck.
          </p>
          <div className={styles.heroActions}>
            <BookButton location="hero" className="btn-primary">Book a discovery call</BookButton>
            <a href="#case-studies" className="btn-outline">
              See what we&apos;ve built <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Real, attributed figures only — the rule that governs every number
              on this site. Each one is expanded or sourced further down the page. */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={`display-num ${styles.heroStatNum}`}>
                <CountUp value={6} duration={1.1} />
              </span>
              <span className={styles.heroStatLabel}>engines built &amp; running</span>
            </div>
            <div className={styles.heroStat}>
              <span className={`display-num ${styles.heroStatNum}`}>
                <CountUp value={1200} suffix="+" duration={1.7} />
              </span>
              <span className={styles.heroStatLabel}>client reports produced automatically a year</span>
            </div>
            <div className={styles.heroStat}>
              <span className={`display-num ${styles.heroStatNum}`}>
                <CountUp value={40} suffix="+" duration={1.4} />
              </span>
              <span className={styles.heroStatLabel}>tools orchestrated across client builds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
