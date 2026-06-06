import Image from 'next/image';
import styles from './Hero.module.css';
import LeadForm from './LeadForm';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image src="/images/hero-vista.jpg" alt="" fill priority sizes="100vw" className={styles.heroImg} />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroBackground} aria-hidden="true" />
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            AI Automation Built Around Your Workflows
          </h1>
          <p className={styles.heroDescription}>
            Not just chatbots or off-the-shelf tools. We design custom n8n AI automation
            systems that eliminate manual ops across your team — deployed on your existing
            stack in 30–60 days.
          </p>
          <div className={styles.heroActions}>
            <a href="#audit" className="btn-primary">Get My Free Audit <span aria-hidden="true">→</span></a>
            <a href="/solutions" className="btn-outline">Explore Solutions</a>
          </div>
        </div>

        <div className={styles.formCard} id="audit">
          <h2 className={styles.formTitle}>Automation Audit Request</h2>
          <p className={styles.formIntro}>
            We&apos;ll review your workflows and suggest where AI can save time &amp; cost.
          </p>
          <LeadForm source="hero" compact />
        </div>
      </div>
    </section>
  );
}
