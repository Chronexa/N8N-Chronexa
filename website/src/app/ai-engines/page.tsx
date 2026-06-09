import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BookButton from '../../components/BookButton';
import CtaBand from '../../components/CtaBand';
import { ENGINE_ROADMAP, ENGINE_STAGES, HUB_FAQS } from '../../components/engines/engines-data';
import { site } from '../../lib/site';
import styles from './ai-engines.module.css';

const TITLE = 'AI Engines — Autonomous AI Systems That Run Your Workflows | Chronexa';
const DESCRIPTION =
  'An AI engine is a connected team of specialised AI agents that runs an entire workflow end-to-end inside your stack — not a chatbot. Explore the engines Chronexa builds, starting with the Sales Engine.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${site.url}/ai-engines` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${site.url}/ai-engines`, type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HUB_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero — define the concept, plainly */}
      <section className="section-dark">
        <div className="container">
          <div className={styles.heroInner}>
            <p className="eyebrow">AI Engines</p>
            <h1 className={styles.heroTitle}>AI engines that run the work — not chatbots that talk about it.</h1>
            <p className={styles.heroSub}>
              An AI engine is a connected team of specialised AI agents that runs one of your workflows from start to
              finish: it pulls data from your tools, reasons over it, takes the action, and syncs the result back —
              with you in control. Here are the engines we build.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/ai-engines/sales-engine" className="btn-primary">Explore the Sales Engine →</Link>
              <BookButton className="btn-outline" location="ai-engines-hub-hero">Book a Free Audit</BookButton>
            </div>
          </div>
        </div>
      </section>

      {/* How an AI engine works — universal shape */}
      <section className="section-light">
        <div className="container">
          <header className={styles.sectionHead}>
            <p className="eyebrow">How an AI engine works</p>
            <h2 className={styles.sectionTitle}>Four moves, every engine</h2>
            <p className={styles.sectionLede}>
              However different the workflows look, every engine follows the same shape — which is why a proven one
              adapts to a new job in weeks, not months.
            </p>
          </header>
          <div className={styles.stagesGrid}>
            {ENGINE_STAGES.map((s, i) => (
              <div key={s.title} className={styles.stageCard} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                <p className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</p>
                <h3 className={styles.stageTitle}>{s.title}</h3>
                <p className={styles.stageBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The roadmap — Sales live, the rest honest "coming soon" */}
      <section className="section-muted" id="engines">
        <div className="container">
          <header className={styles.sectionHead}>
            <p className="eyebrow">The engines we build</p>
            <h2 className={styles.sectionTitle}>One architecture, many workflows</h2>
            <p className={styles.sectionLede}>
              Each engine gets its own deep build and its own page. We ship one when it’s genuinely production-ready —
              starting with Sales. The rest are on the way.
            </p>
          </header>
          <div className={styles.enginesGrid}>
            {ENGINE_ROADMAP.map((e, i) => {
              const inner = (
                <>
                  <div className={styles.engineTop}>
                    <span className={styles.engineKicker}>{e.kicker}</span>
                    <span className={styles.engineStatus} data-status={e.status}>{e.status === 'live' ? 'Live' : 'Coming soon'}</span>
                  </div>
                  <h3 className={styles.engineName}>{e.name}</h3>
                  <p className={styles.engineBlurb}>{e.promise}</p>
                  {e.href && <span className={styles.engineLink}>Explore the engine →</span>}
                </>
              );
              return e.href ? (
                <Link key={e.name} href={e.href} className={`${styles.engineCard} ${styles.engineCardLink}`} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                  {inner}
                </Link>
              ) : (
                <article key={e.name} className={styles.engineCard} data-soon data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container">
          <header className={styles.sectionHead}>
            <p className="eyebrow">FAQ</p>
            <h2 className={styles.sectionTitle}>Questions, answered</h2>
          </header>
          <div className={styles.faqList}>
            {HUB_FAQS.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <p className={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
