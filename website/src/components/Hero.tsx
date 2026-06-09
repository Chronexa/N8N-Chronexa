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
            Custom Enterprise AI for Regulated Industries
          </h1>
          <p className={styles.heroDescription}>
            Not chatbots or off-the-shelf tools. We build bespoke AI and agentic systems —
            RAG knowledge engines, document intelligence, secure deployments — for finance,
            legal, tax and dealmaking teams where the data can’t leak and the work has to
            stand up to an audit.
          </p>
          <div className={styles.heroActions}>
            <BookButton location="hero">Book a Free Audit <span aria-hidden="true">→</span></BookButton>
            <a href="/solutions" className="btn-outline">Explore Solutions</a>
          </div>
        </div>
      </div>
    </section>
  );
}
