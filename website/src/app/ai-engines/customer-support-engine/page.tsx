import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import SupportScene from '../../../components/engines/support-scene/SupportScene';
import {
  CS_ENGINE,
  CS_WHATIS, CS_HOWITWORKS_INTRO,
  CS_PROBLEM, CS_INTEGRATION, CS_ROI, CS_TESTIMONIALS,
  CS_FAQS, CS_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/customer-support-engine`;
const TITLE = 'AI Customer Support Engine — Resolves Tickets, Escalates With Context | Chronexa';
const DESCRIPTION =
  'Chronexa\'s Customer Support Engine answers email, chat and voice from your own knowledge base and live system data, takes real actions like applying a credit, and escalates to a human with full context when it is not confident. Answers are grounded and source-attached, it writes in your brand voice, and a customer can always reach a person.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'AI customer support automation', 'ticket deflection vs resolution', 'AI help desk automation',
    'voice agent customer support', 'human escalation support AI', 'AI ticket routing',
    'automated customer service', 'AI support knowledge base', 'customer support AI software',
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
        { '@type': 'ListItem', position: 2, name: 'Customer Support Engine', item: URL },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Customer Support Engine',
      serviceType: 'AI customer support automation',
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
      url: URL,
      areaServed: 'US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: CS_FAQS.map((f) => ({
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

      {/* 1 — Hero: one real ticket resolved on screen, inside a bright chat window */}
      <section className={`section-dark ${styles.canvasHeroSection}`}>
        <h1 className={styles.srOnly}>Every support query routed to the right specialist agent — resolved in seconds, escalated with full context when it needs a human.</h1>
        <SupportScene />
      </section>

      {/* 2 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI Customer Support Engine?</h2>
                {CS_WHATIS.map((p) => <p key={p.slice(0, 40)} className={styles.prose}>{p}</p>)}
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the Customer Support Engine works, step by step</h2>
                <p className={styles.prose}>{CS_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {CS_ENGINE.nodes.map((node, i) => (
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
                <h2 className={styles.bodyTitle}>The customer support problem it solves</h2>
                <p className={styles.prose}>{CS_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {CS_PROBLEM.pains.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.pain}>
                      <span className={styles.painMark} aria-hidden="true">✕</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.prose}>{CS_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{CS_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {CS_INTEGRATION.phases.map((ph) => (
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
                  {CS_INTEGRATION.prerequisites.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.prereq}>
                      <span className={styles.prereqMark} aria-hidden="true">✓</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{CS_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on a Customer Support Engine</h2>
                <div className={styles.roiStats}>
                  {CS_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{CS_ROI.narrative}</p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>How we prove it — before you commit</h2>
                <div className={styles.tGrid}>
                  {CS_TESTIMONIALS.map((t) => (
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
                <h2 className={styles.bodyTitle}>Customer Support Engine FAQ</h2>
                <div className={styles.faqList}>
                  {CS_FAQS.map((f) => (
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
                <h2 className={styles.nudgeTitle}>{CS_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{CS_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="customer-support-engine-nudge">
                  {CS_NUDGE.cta}
                </BookButton>
                <p className={styles.nudgeMeta}>No obligation · runs on your historical support tickets</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
