import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import WorkflowCanvasLoader from '../../../components/engines/WorkflowCanvasLoader';
import {
  CPA_TAX_ENGINE, CPA_TAX_OUTPUTS, CPA_TAX_FLOW_POSITIONS, CPA_TAX_FLOW_EDGES,
  CPA_TAX_WHATIS, CPA_TAX_HOWITWORKS_INTRO,
  CPA_TAX_PROBLEM, CPA_TAX_INTEGRATION, CPA_TAX_ROI, CPA_TAX_TESTIMONIALS,
  CPA_TAX_FAQS, CPA_TAX_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/cpa-tax-engine`;
const TITLE = 'AI CPA & Tax Engine — Automated Tax Return Preparation | Chronexa';
const DESCRIPTION =
  'Chronexa\'s AI CPA & Tax Engine ingests every client document, extracts all fields including K-1s and brokerage composites, pre-fills the return in your tax software, and routes a reviewer-ready file to your CPA. Live in 3–5 weeks.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'AI CPA tax preparation', 'automated tax return preparation', 'AI tax data entry software',
    'CPA firm automation', 'tax prep workflow automation', 'K-1 extraction AI',
    'AI accounting firm software', 'reduce CPA busy season', 'document extraction CPA',
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
        { '@type': 'ListItem', position: 2, name: 'CPA & Tax Engine', item: URL },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI CPA & Tax Engine',
      serviceType: 'AI tax preparation automation',
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
      url: URL,
      areaServed: 'US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: CPA_TAX_FAQS.map((f) => ({
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

      {/* 1 — Full-canvas hero: the shell IS the hero */}
      <section className={`section-dark ${styles.canvasHeroSection}`}>
        <h1 className={styles.srOnly}>Your entire tax-prep workflow, automated from intake to e-file.</h1>
        <WorkflowCanvasLoader
          engine={CPA_TAX_ENGINE}
          outputs={CPA_TAX_OUTPUTS}
          flowPositions={CPA_TAX_FLOW_POSITIONS}
          flowEdges={CPA_TAX_FLOW_EDGES}
        />
      </section>

      {/* 3 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI CPA &amp; Tax Engine?</h2>
                {CPA_TAX_WHATIS.map((p) => <p key={p.slice(0, 40)} className={styles.prose}>{p}</p>)}
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the CPA &amp; Tax Engine works, step by step</h2>
                <p className={styles.prose}>{CPA_TAX_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {CPA_TAX_ENGINE.nodes.map((node, i) => (
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
                <h2 className={styles.bodyTitle}>The tax-prep problem it solves</h2>
                <p className={styles.prose}>{CPA_TAX_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {CPA_TAX_PROBLEM.pains.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.pain}>
                      <span className={styles.painMark} aria-hidden="true">✕</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.prose}>{CPA_TAX_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{CPA_TAX_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {CPA_TAX_INTEGRATION.phases.map((ph) => (
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
                  {CPA_TAX_INTEGRATION.prerequisites.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.prereq}>
                      <span className={styles.prereqMark} aria-hidden="true">✓</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{CPA_TAX_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on a CPA &amp; Tax Engine</h2>
                <div className={styles.roiStats}>
                  {CPA_TAX_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{CPA_TAX_ROI.narrative}</p>
                <p className={styles.prose}>
                  Want your firm&rsquo;s number instead of the benchmark?{' '}
                  <Link href="/cpa-tax-season-capacity-calculator">Run the tax-season capacity calculator</Link> — your
                  preparers, your return volume, your fee, in ten seconds.
                </p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>What tax teams say</h2>
                <div className={styles.tGrid}>
                  {CPA_TAX_TESTIMONIALS.map((t) => (
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
                <h2 className={styles.bodyTitle}>CPA &amp; Tax Engine FAQ</h2>
                <div className={styles.faqList}>
                  {CPA_TAX_FAQS.map((f) => (
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
                <h2 className={styles.nudgeTitle}>{CPA_TAX_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{CPA_TAX_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="cpa-tax-engine-nudge">
                  {CPA_TAX_NUDGE.cta}
                </BookButton>
                <p className={styles.nudgeMeta}>No obligation · runs on your real client mix</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
