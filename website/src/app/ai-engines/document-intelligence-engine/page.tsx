import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BookButton from '../../../components/BookButton';
import CtaBand from '../../../components/CtaBand';
import DocIntelScene from '../../../components/engines/docintel-scene/DocIntelScene';
import {
  DOC_INTEL_ENGINE,
  DOC_INTEL_WHATIS, DOC_INTEL_HOWITWORKS_INTRO,
  DOC_INTEL_PROBLEM, DOC_INTEL_INTEGRATION, DOC_INTEL_ROI, DOC_INTEL_TESTIMONIALS,
  DOC_INTEL_FAQS, DOC_INTEL_NUDGE,
} from '../../../components/engines/engines-data';
import { site } from '../../../lib/site';
import styles from '../ai-engines.module.css';

const URL = `${site.url}/ai-engines/document-intelligence-engine`;
const TITLE = 'AI Document Intelligence — Ask Your Documents, Get Cited Answers | Chronexa';
const DESCRIPTION =
  'Chronexa\'s Document Intelligence Engine reads every document your business runs on — leases, loan files, tax returns, audit and compliance files — across legal, finance, compliance and tax, and turns them into a private knowledge base you can simply ask. Plain-language questions return answers in seconds, each cited to the exact source page, grounded only in your own documents with nothing sent to public AI.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'document intelligence software', 'ask your documents AI', 'safe RAG', 'cited AI answers',
    'private document AI', 'AI document processing', 'OCR automation AI', 'legal document AI',
    'financial document extraction', 'compliance document review AI', 'tax document automation',
    'AI OCR handwriting', 'document data extraction AI',
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
        { '@type': 'ListItem', position: 2, name: 'Document Intelligence Engine', item: URL },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Document Intelligence Engine',
      serviceType: 'AI document intelligence, retrieval and cited question-answering',
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
      url: URL,
      areaServed: 'US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: DOC_INTEL_FAQS.map((f) => ({
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

      {/* 1 — Hero: a cross-vertical archive turned into cited answers, live on screen */}
      <section className={`section-dark ${styles.canvasHeroSection}`}>
        <h1 className={styles.srOnly}>Any document, any department — read, indexed, and answerable with a citation in seconds.</h1>
        <DocIntelScene />
      </section>

      {/* 2 — Blog-style body + sticky nudge */}
      <section className="section-light">
        <div className="container">
          <div className={styles.bodyGrid}>
            <div className={styles.bodyMain}>

              {/* What is */}
              <section className={styles.bodySection} id="what">
                <p className="eyebrow">What it is</p>
                <h2 className={styles.bodyTitle}>What is the AI Document Intelligence Engine?</h2>
                {DOC_INTEL_WHATIS.map((p) => <p key={p.slice(0, 40)} className={styles.prose}>{p}</p>)}
              </section>

              {/* How it works */}
              <section className={styles.bodySection} id="how">
                <p className="eyebrow">How it works</p>
                <h2 className={styles.bodyTitle}>How the Document Intelligence Engine works, step by step</h2>
                <p className={styles.prose}>{DOC_INTEL_HOWITWORKS_INTRO}</p>
                <ol className={styles.steps}>
                  {DOC_INTEL_ENGINE.nodes.map((node, i) => (
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
                <h2 className={styles.bodyTitle}>The document processing problem it solves</h2>
                <p className={styles.prose}>{DOC_INTEL_PROBLEM.intro}</p>
                <ul className={styles.painList}>
                  {DOC_INTEL_PROBLEM.pains.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.pain}>
                      <span className={styles.painMark} aria-hidden="true">✕</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.prose}>{DOC_INTEL_PROBLEM.closing}</p>
              </section>

              {/* Time to integrate */}
              <section className={styles.bodySection} id="integrate">
                <p className="eyebrow">Time to value</p>
                <h2 className={styles.bodyTitle}>How fast you go live</h2>
                <p className={styles.timeline}>{DOC_INTEL_INTEGRATION.timeline}</p>
                <ol className={styles.phaseList}>
                  {DOC_INTEL_INTEGRATION.phases.map((ph) => (
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
                  {DOC_INTEL_INTEGRATION.prerequisites.map((p) => (
                    <li key={p.slice(0, 40)} className={styles.prereq}>
                      <span className={styles.prereqMark} aria-hidden="true">✓</span>{p}
                    </li>
                  ))}
                </ul>
                <p className={styles.noteLine}>{DOC_INTEL_INTEGRATION.note}</p>
              </section>

              {/* ROI */}
              <section className={styles.bodySection} id="roi">
                <p className="eyebrow">ROI</p>
                <h2 className={styles.bodyTitle}>The return on a Document Intelligence Engine</h2>
                <div className={styles.roiStats}>
                  {DOC_INTEL_ROI.stats.map((s) => (
                    <div key={s.label} className={styles.roiStat}>
                      <span className={styles.roiValue}>{s.value}</span>
                      <span className={styles.roiLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.prose}>{DOC_INTEL_ROI.narrative}</p>
                <p className={styles.prose}>
                  Want your team&rsquo;s number instead of the benchmark?{' '}
                  <Link href="/document-processing-cost-calculator">Run the document processing cost calculator</Link> —
                  your volume, your touch time, your staff cost, in ten seconds.
                </p>
              </section>

              {/* Testimonials */}
              <section className={styles.bodySection} id="testimonials">
                <p className="eyebrow">Proof</p>
                <h2 className={styles.bodyTitle}>How we prove it — before you commit</h2>
                <div className={styles.tGrid}>
                  {DOC_INTEL_TESTIMONIALS.map((t) => (
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
                <h2 className={styles.bodyTitle}>Document Intelligence Engine FAQ</h2>
                <div className={styles.faqList}>
                  {DOC_INTEL_FAQS.map((f) => (
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
                <h2 className={styles.nudgeTitle}>{DOC_INTEL_NUDGE.title}</h2>
                <p className={styles.nudgeBody}>{DOC_INTEL_NUDGE.body}</p>
                <BookButton className={`btn-primary ${styles.nudgeBtn}`} location="document-intelligence-engine-nudge">
                  {DOC_INTEL_NUDGE.cta}
                </BookButton>
                <p className={styles.nudgeMeta}>No obligation · validated on your actual documents</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
