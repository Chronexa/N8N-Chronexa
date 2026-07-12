import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import InvestScene from '../../../components/engines/invest-scene/InvestScene';
import {
  INV_RESEARCH_ENGINE,
  INV_RESEARCH_WHATIS, INV_RESEARCH_HOWITWORKS_INTRO,
  INV_RESEARCH_PROBLEM, INV_RESEARCH_INTEGRATION, INV_RESEARCH_ROI, INV_RESEARCH_TESTIMONIALS,
  INV_RESEARCH_FAQS, INV_RESEARCH_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/investment-research-engine`;
const TITLE = 'AI Investment Research Engine — Portfolio Signals, Execution & Monitoring | Chronexa';
const DESCRIPTION =
  'Chronexa\'s AI Investment Research Engine connects to every brokerage via Plaid and Yodlee, scans news and earnings signals, runs XGBoost and LSTM models to surface exact entry and exit points, and presents human-approved orders to your broker — while monitoring risk metrics in real time.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'AI investment research', 'portfolio automation AI', 'XGBoost trading signals',
    'algorithmic portfolio management', 'Plaid portfolio integration', 'AI quant research',
    'automated portfolio rebalancing', 'investment signal generation', 'RIA automation AI',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AI Engines', item: `${site.url}/ai-engines` },
        { '@type': 'ListItem', position: 2, name: 'Investment Research Engine', item: URL },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Investment Research Engine',
      serviceType: 'AI portfolio research and signal generation',
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
      url: URL,
      areaServed: 'US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: INV_RESEARCH_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1 — Full-canvas hero */}
      <section className={`section-dark ${styles.canvasHeroSection}`}>
        <h1 className={styles.srOnly}>Portfolio research, ML signals, and human-approved execution — automated end to end.</h1>
        <InvestScene />
      </section>

      {/* 2 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI Investment Research Engine?</h2>
                {INV_RESEARCH_WHATIS.map((p) => <p key={p.slice(0, 40)} className={styles.prose}>{p}</p>)}
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the Investment Research Engine works, step by step</h2>
                <p className={styles.prose}>{INV_RESEARCH_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {INV_RESEARCH_ENGINE.nodes.map((node, i) => (
                    <li key={node.id} className={styles.step} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                      <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>{node.label}</h3>
                        <p className={styles.stepDetail}>{node.detail}</p>
                        <p className={styles.stepGives}><span className={styles.givesLabel}>What you get</span> {node.gives}</p>
                        <ul className={styles.stepTools}>
                          {node.tools.map((t) => <li key={t} className={styles.stepTool}>{t}</li>)}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Problem */}
              <section className={styles.bodySection} id="problem">
                <p className="eyebrow">The problem</p>
                <h2 className={styles.bodyTitle}>The research problem it solves</h2>
                <p className={styles.prose}>{INV_RESEARCH_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {INV_RESEARCH_PROBLEM.pains.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.pain}>
                      <span className={styles.painMark} aria-hidden="true">✕</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.prose}>{INV_RESEARCH_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{INV_RESEARCH_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {INV_RESEARCH_INTEGRATION.phases.map((ph) => (
                    <li key={ph.phase} className={styles.phase}>
                      <span className={styles.phaseTime}>{ph.time}</span>
                      <span className={styles.phaseInfo}>
                        <span className={styles.phaseTitle}>{ph.phase}</span>
                        <span className={styles.phaseDetail}>{ph.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <h3 className={styles.prereqHead}>What you need to start</h3>
                <ul className={styles.prereqList}>
                  {INV_RESEARCH_INTEGRATION.prerequisites.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.prereq}>
                      <span className={styles.prereqMark} aria-hidden="true">✓</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{INV_RESEARCH_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on an Investment Research Engine</h2>
                <div className={styles.roiStats}>
                  {INV_RESEARCH_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{INV_RESEARCH_ROI.narrative}</p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>What investment teams say</h2>
                <div className={styles.tGrid}>
                  {INV_RESEARCH_TESTIMONIALS.map((t) => (
                    <figure key={t.name} className={styles.tCard}>
                      <blockquote className={styles.tQuote}>&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption className={styles.tWho}>
                        <span className={styles.tName}>{t.name}</span>
                        <span className={styles.tMeta}>{t.role} · {t.company}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className={styles.bodySection} id="faq">
                <p className="eyebrow">FAQ</p>
                <h2 className={styles.bodyTitle}>Investment Research Engine FAQ</h2>
                <div className={styles.faqList}>
                  {INV_RESEARCH_FAQS.map((f) => (
                    <details key={f.q} className={styles.faqItem}>
                      <summary className={styles.faqQ}>{f.q}</summary>
                      <p className={styles.faqA}>{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

            </div>

            {/* Sticky nudge */}
            <aside className={styles.nudgeAside}>
              <div className={styles.nudgeCard}>
                <p className={styles.nudgeKicker}>Free 30-min demo</p>
                <h2 className={styles.nudgeTitle}>{INV_RESEARCH_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{INV_RESEARCH_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="investment-research-engine-nudge">
                  {INV_RESEARCH_NUDGE.cta}
                </BookButton>
                <p className={styles.nudgeMeta}>No obligation · backtest on your actual holdings</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
