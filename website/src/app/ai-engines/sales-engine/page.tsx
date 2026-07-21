import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import SalesScene from '../../../components/engines/sales-scene/SalesScene';
import {
  SALES_ENGINE,
  SALES_WHATIS, SALES_HOWITWORKS_INTRO, SALES_PROBLEM,
  SALES_INTEGRATION, SALES_ROI, SALES_TESTIMONIALS, SALES_FAQS, SALES_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/sales-engine`;
const TITLE = 'AI Sales Engine — Automated Outbound, Lead Research & Sequences | Chronexa';
const DESCRIPTION =
  'The AI Sales Engine runs the top of your outbound: it sources buyers, researches and qualifies each account, and drafts personalised sequences that send through your own stack — with a human approving every send. Dedicated sending domains, SPF/DKIM/DMARC and CRM suppression are set up first, so volume never costs you your inbox placement. Live in 2–4 weeks.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['AI sales engine', 'AI sales automation', 'automated outbound', 'AI SDR', 'AI lead generation', 'AI cold email', 'sales pipeline automation'],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI Engines', item: `${site.url}/ai-engines` },
      { '@type': 'ListItem', position: 2, name: 'Sales Engine', item: URL },
    ] },
    { '@type': 'Service', name: 'AI Sales Engine', serviceType: 'AI sales automation', provider: { '@type': 'Organization', name: site.name, url: site.url }, description: DESCRIPTION, url: URL, areaServed: 'Global' },
    { '@type': 'FAQPage', mainEntity: SALES_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1 — Hero: one morning's outbound run built on screen, inside a bright app window */}
      <section className={`section-dark ${styles.canvasHeroSection}`}>
        {/* sr-only h1 keeps this page indexed correctly by search engines */}
        <h1 className={styles.srOnly}>Your entire outbound motion, run by a team of AI agents.</h1>
        <SalesScene />
      </section>

      {/* 3 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI Sales Engine?</h2>
                {SALES_WHATIS.map((p) => <p key={p} className={styles.prose}>{p}</p>)}
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the Sales Engine works, step by step</h2>
                <p className={styles.prose}>{SALES_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {SALES_ENGINE.nodes.map((node, i) => (
                    <li key={node.id} className={styles.step} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
                      <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>{node.label}</h3>
                        <p className={styles.stepDetail}>{node.detail}</p>
                        <p className={styles.stepGives}><span className={styles.givesLabel}>What you get</span> {node.gives}</p>
                        <ul className={styles.stepTools}>
                          {node.tools.map((t) => (<li key={t} className={styles.stepTool}>{t}</li>))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Problem */}
              <section className={styles.bodySection} id="problem">
                <p className="eyebrow">The problem</p>
                <h2 className={styles.bodyTitle}>The outbound problem it solves</h2>
                <p className={styles.prose}>{SALES_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {SALES_PROBLEM.pains.map((p) => (
                    <li key={p} className={styles.pain}><span className={styles.painMark} aria-hidden="true">✕</span>{p}</li>
                  ))}
                </ul>
                <p className={styles.prose}>{SALES_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate + prerequisites */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{SALES_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {SALES_INTEGRATION.phases.map((ph) => (
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
                  {SALES_INTEGRATION.prerequisites.map((p) => (
                    <li key={p} className={styles.prereq}><span className={styles.prereqMark} aria-hidden="true">✓</span>{p}</li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{SALES_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on a Sales Engine</h2>
                <div className={styles.roiStats}>
                  {SALES_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{SALES_ROI.narrative}</p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>How we prove it — before you commit</h2>
                <div className={styles.tGrid}>
                  {SALES_TESTIMONIALS.map((t) => (
                    <figure key={t.name} className={styles.tCard}>
                      <blockquote className={styles.tQuote}>{t.quote}</blockquote>
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
                <h2 className={styles.bodyTitle}>Sales Engine FAQ</h2>
                <div className={styles.faqList}>
                  {SALES_FAQS.map((f) => (
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
                <h2 className={styles.nudgeTitle}>{SALES_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{SALES_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="sales-engine-nudge">{SALES_NUDGE.cta}</BookButton>
                <p className={styles.nudgeMeta}>No obligation · see it run on your ICP</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
