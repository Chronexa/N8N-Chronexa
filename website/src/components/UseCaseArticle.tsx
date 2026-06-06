import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './UseCaseArticle.module.css';
import { site } from '../lib/site';
import { getService, getSolutions, getPains, type ServiceContent } from '../lib/services-content';
import { getCategoryLabel } from '../lib/taxonomy';

// Same standard outcomes as the service template, so the brand reads consistently.
const STANDARD_IMPACTS = [
  { value: 'Weeks', label: 'Typical time to go live, not months' },
  { value: 'Fixed-price', label: 'Scoped to outcomes, ROI agreed up front' },
  { value: 'Human-in-loop', label: 'Review on exceptions, full audit trail' },
];

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

export default function UseCaseArticle({ data }: { data: ServiceContent }) {
  const url = `${site.url}/${data.slug}`;
  const solutions = getSolutions(data.slug);
  const pains = getPains(data.slug) ?? [];
  const impacts = [...data.roi, ...STANDARD_IMPACTS].slice(0, 6);
  const categoryLabel = getCategoryLabel(data.slug);
  const [problemSection, ...restSections] = data.sections;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.serviceName,
    serviceType: data.serviceType,
    description: data.schemaDescription,
    url,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: ['US', 'GB', 'CA'],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: `${site.url}/use-cases` },
      { '@type': 'ListItem', position: 3, name: data.serviceName, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/use-cases">Use Cases</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{data.serviceName}</span>
          </nav>
          <p className={styles.kindPill}>{categoryLabel}</p>
          <h1 className={styles.h1}>{data.h1}</h1>
          <p className="heroDescription">{data.heroSub}</p>
          <p className={styles.answer}>{data.answer}</p>
          <div className={styles.heroActions}>
            <Link href="/contact" className="btn-primary">Book a Free Audit <span aria-hidden="true">→</span></Link>
            <Link href="/case-studies" className="btn-outline">See Case Studies</Link>
          </div>
        </div>
      </section>

      {/* The problem — pain chips + breaking-point callout (light) */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--brand-green-ink)' }}>The problem</p>
          <h2 className={styles.sectionHead}>{problemSection?.heading ?? 'Where the manual work piles up'}</h2>
          {problemSection?.body.map((p, i) => <p key={i} className={styles.lede}>{p}</p>)}

          {pains.length > 0 && (
            <ul className={styles.painGrid}>
              {pains.map((p) => (
                <li className={styles.pain} key={p}>
                  <span className={styles.painIcon}>{sv(<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>)}</span>
                  {p}
                </li>
              ))}
            </ul>
          )}

          {data.callout && (
            <aside className={styles.callout}>
              <span className={styles.calloutTag}>The breaking point</span>
              <p>{data.callout}</p>
            </aside>
          )}
        </div>
      </section>

      {/* The solution — capability columns with per-capability ROI (dark) */}
      <section className="section-dark">
        <div className="container">
          <p className="eyebrow">The solution</p>
          <h2 className={styles.sectionHead}>Where automation removes the friction</h2>

          {solutions && solutions.length > 0 && (
            <div className={styles.solutionGrid}>
              {solutions.map((s) => (
                <article className={styles.solutionCard} key={s.title}>
                  <h3 className={styles.solutionTitle}>{s.title}</h3>
                  <p className={styles.solutionBody}>{s.body}</p>
                  <p className={styles.solutionRoi}>
                    <span className={styles.solutionRoiTag} aria-hidden="true">↑ ROI impact</span>
                    {s.roiImpact}
                  </p>
                </article>
              ))}
            </div>
          )}

          {restSections.length > 0 && (
            <div className={styles.prose}>
              {restSections.map((s) =>
                s.level === 2 ? (
                  <div key={s.heading}><h3>{s.heading}</h3>{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
                ) : (
                  <div key={s.heading}><h3>{s.heading}</h3>{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
                ),
              )}
            </div>
          )}

          {data.workflows && data.workflows.length > 0 && (
            <>
              <p className={styles.miniHead}>Example workflows we build</p>
              <ul className={styles.workflowChips}>
                {data.workflows.map((w) => (
                  <li key={w} className={styles.chip}><span aria-hidden="true">✦</span>{w}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* The results — 6-tile grid (light) */}
      <section className={styles.resultsBand}>
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--brand-green-ink)' }}>The results</p>
          <h2 className={styles.sectionHead}>The commercial impact</h2>
          <div className={styles.impactGrid}>
            {impacts.map((r) => (
              <div className={styles.impact} key={r.label}>
                <div className={styles.impactValue}>{r.value}</div>
                <div className={styles.impactLabel}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our approach — process steps + why custom (dark) */}
      <section className="section-dark">
        <div className="container">
          <p className="eyebrow">Our approach</p>
          <h2 className={styles.sectionHead}>From manual to automated</h2>
          <ol className={styles.steps}>
            {data.process.map((step, i) => (
              <li className={styles.step} key={step.title}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>

          <div className={styles.whyWrap}>
            <p className={styles.miniHead}>Why a custom build beats off-the-shelf</p>
            <ul className={styles.why}>
              {data.whyCustom.map((w) => (
                <li key={w}><span className={styles.check} aria-hidden="true">✓</span>{w}</li>
              ))}
            </ul>
          </div>

          {data.proof && (
            <Link href={`/case-studies/${data.proof.slug}`} className={styles.proof}>
              <span className={styles.proofTag}>Proof</span>
              <span className={styles.proofText}>{data.proof.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </section>

      {/* FAQ (light) */}
      <section className="section-light">
        <div className={`container ${styles.faqWrap}`}>
          <h2 className={styles.faqHead}>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {data.faqs.map((f) => (
              <details className={styles.faqItem} key={f.q}>
                <summary className={styles.faqSummary}><span>{f.q}</span><span className={styles.faqIcon} aria-hidden="true" /></summary>
                <p className={styles.faqAnswer}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related (light) */}
      <section className="section-light">
        <div className="container">
          <h2 className={styles.relatedHead}>Related use cases &amp; services</h2>
          <div className={styles.relatedGrid}>
            {data.related.map((slug) => {
              const r = getService(slug);
              if (!r) return null;
              return (
                <Link href={`/${r.slug}`} key={slug} className={styles.relatedCard}>
                  <span>{r.serviceName}</span><span aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
