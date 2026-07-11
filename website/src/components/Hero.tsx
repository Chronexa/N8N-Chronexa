import styles from './Hero.module.css';
import BookButton from './BookButton';
import HeroVideo from './HeroVideo';

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
          <h1 id="hero-title" className={styles.heroTitle}>
            We build AI systems that do the work your team shouldn&apos;t have to.
          </h1>
          <p className={styles.heroDescription}>
            Custom automation, AI agents, and document intelligence — built on your data,
            for your workflow. Shipped across property, legal, finance, sales, and agriculture.
          </p>
          <div className={styles.heroActions}>
            <BookButton location="hero" className="btn-primary">Book a discovery call</BookButton>
            <a href="#case-studies" className="btn-outline">
              See what we&apos;ve built <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
