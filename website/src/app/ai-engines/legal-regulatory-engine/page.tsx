import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import WorkflowCanvasLoader from '../../../components/engines/WorkflowCanvasLoader';
import {
  LEGAL_REG_ENGINE, LEGAL_REG_OUTPUTS, LEGAL_REG_FLOW_POSITIONS, LEGAL_REG_FLOW_EDGES,
  LEGAL_REG_WHATIS, LEGAL_REG_HOWITWORKS_INTRO,
  LEGAL_REG_GAPS, LEGAL_REG_GAPS_INTRO,
  LEGAL_REG_PROBLEM, LEGAL_REG_INTEGRATION, LEGAL_REG_ROI, LEGAL_REG_TESTIMONIALS,
  LEGAL_REG_FAQS, LEGAL_REG_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/legal-regulatory-engine`;
const TITLE = 'AI Workflow Orchestration for Law Firms — Legal & Regulatory Engine | Chronexa';
const DESCRIPTION =
  'Your firm already has AI — the engine connects it to daily work. Regulatory changes matched to live matters in 15 minutes, AI-tool time captured into billing automatically, closed-matter precedents fed back into your knowledge base, and diligence reports drafted from completed document review.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'AI workflow orchestration law firm', 'legal AI automation', 'law firm billing leakage',
    'automated time capture law firm', 'AI usage billing capture legal', 'legal knowledge management AI',
    'due diligence report automation', 'Relativity document review automation', 'iManage workflow automation',
    'AI regulatory monitoring', 'SEC SEBI regulatory alerts', 'regulatory change management',
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
        { '@type': 'ListItem', position: 2, name: 'Legal & Regulatory Engine', item: URL },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Legal & Regulatory Engine',
      serviceType: 'AI regulatory monitoring and legal matter analysis',
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
      url: URL,
      areaServed: 'US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: LEGAL_REG_FAQS.map((f) => ({
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
        <h1 className={styles.srOnly}>AI workflow orchestration for law firms — regulatory alerts matched to live matters, AI usage captured into billing, precedents fed back into your knowledge base, and diligence reports drafted from completed review.</h1>
        <WorkflowCanvasLoader
          engine={LEGAL_REG_ENGINE}
          outputs={LEGAL_REG_OUTPUTS}
          flowPositions={LEGAL_REG_FLOW_POSITIONS}
          flowEdges={LEGAL_REG_FLOW_EDGES}
        />
      </section>

      {/* 2 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI Legal &amp; Regulatory Engine?</h2>
                {LEGAL_REG_WHATIS.map((p) => <p key={p.slice(0, 40)} className={styles.prose}>{p}</p>)}
              </section>

              {/* The Four Operational Intelligence Gaps */}
              <section className={styles.bodySection} id="gaps">
                <p className="eyebrow">The framework</p>
                <h2 className={styles.bodyTitle}>The Four Operational Intelligence Gaps</h2>
                <p className={styles.prose}>{LEGAL_REG_GAPS_INTRO}</p>
                <div className={styles.gapList}>
                  {LEGAL_REG_GAPS.map((g, i) => (
                    <article key={g.id} className={styles.gapCard} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                      <p className={styles.gapNum}>Gap {String(i + 1).padStart(2, '0')} · {g.workflow}</p>
                      <h3 className={styles.gapName}>{g.name}</h3>
                      <p className={styles.gapDesc}>{g.gap}</p>
                      <div className={styles.gapCompare}>
                        <div className={styles.gapCol}>
                          <p className={styles.gapColHead} data-kind="before">Before</p>
                          <ol className={styles.gapSteps}>
                            {g.before.map((s) => <li key={s}>{s}</li>)}
                          </ol>
                        </div>
                        <div className={styles.gapCol}>
                          <p className={styles.gapColHead} data-kind="after">After</p>
                          <ol className={styles.gapSteps}>
                            {g.after.map((s) => <li key={s}>{s}</li>)}
                          </ol>
                        </div>
                      </div>
                      <p className={styles.gapOutcome}>{g.outcome}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the Legal &amp; Regulatory Engine works, step by step</h2>
                <p className={styles.prose}>{LEGAL_REG_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {LEGAL_REG_ENGINE.nodes.map((node, i) => (
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
                <h2 className={styles.bodyTitle}>The problem: your AI isn&rsquo;t wired into the work</h2>
                <p className={styles.prose}>{LEGAL_REG_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {LEGAL_REG_PROBLEM.pains.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.pain}>
                      <span className={styles.painMark} aria-hidden="true">✕</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.prose}>{LEGAL_REG_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{LEGAL_REG_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {LEGAL_REG_INTEGRATION.phases.map((ph) => (
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
                  {LEGAL_REG_INTEGRATION.prerequisites.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.prereq}>
                      <span className={styles.prereqMark} aria-hidden="true">✓</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{LEGAL_REG_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on a Legal &amp; Regulatory Engine</h2>
                <div className={styles.roiStats}>
                  {LEGAL_REG_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{LEGAL_REG_ROI.narrative}</p>
                <p className={styles.prose}>
                  Want your firm&rsquo;s number instead of the benchmark?{' '}
                  <Link href="/law-firm-billing-leakage-calculator">Run the billing-leakage calculator</Link> — your
                  lawyer count, your rates, your estimate in ten seconds.
                </p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>What legal teams say</h2>
                <div className={styles.tGrid}>
                  {LEGAL_REG_TESTIMONIALS.map((t) => (
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
                <h2 className={styles.bodyTitle}>Legal &amp; Regulatory Engine FAQ</h2>
                <div className={styles.faqList}>
                  {LEGAL_REG_FAQS.map((f) => (
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
                <h2 className={styles.nudgeTitle}>{LEGAL_REG_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{LEGAL_REG_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="legal-regulatory-engine-nudge">
                  {LEGAL_REG_NUDGE.cta}
                </BookButton>
                <p className={styles.nudgeMeta}>No obligation · runs on a real regulatory event from your jurisdiction</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
