import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './ServiceArticle.module.css';
import { site } from '../lib/site';
import { getService, getSolutions, type ServiceContent } from '../lib/services-content';
import { getCategoryLabel } from '../lib/taxonomy';
import BookButton from './BookButton';
import TrackView from './TrackView';
import ScrollDepth from './ScrollDepth';

// Standard outcomes true of every Chronexa engagement — appended to each page's
// specific ROI metrics to form a 6-tile "commercial impact" grid (automaly-style).
const STANDARD_IMPACTS = [
  { value: 'Weeks', label: 'Typical time to go live, not months' },
  { value: 'Fixed-price', label: 'Scoped to outcomes, ROI agreed up front' },
  { value: 'Human-in-loop', label: 'Review on exceptions, full audit trail' },
];

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);
const IMPACT_ICONS: ReactNode[] = [
  sv(<><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></>),
  sv(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  sv(<><path d="M12 2v20M5 9l7-7 7 7" /></>),
  sv(<><path d="m9 11 3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
  sv(<><path d="M3 7h18M3 12h18M3 17h12" /></>),
  sv(<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></>),
];

export default function ServiceArticle({ data }: { data: ServiceContent }) {
  const url = `${site.url}/${data.slug}`;
  const solutions = getSolutions(data.slug);
  const impacts = [...data.roi, ...STANDARD_IMPACTS].slice(0, 6);
  const categoryLabel = getCategoryLabel(data.slug);

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
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
      { '@type': 'ListItem', position: 3, name: data.serviceName, item: url },
    ],
  };

  return (
    <>
      <TrackView event="service_view" props={{ slug: data.slug, name: data.serviceName, category: categoryLabel }} />
      <ScrollDepth pageType="service" slug={data.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/solutions">Solutions</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{data.serviceName}</span>
          </nav>
          <p className={styles.kindPill}>{categoryLabel}</p>
          <h1 className={styles.h1}>{data.h1}</h1>
          <p className="heroDescription">{data.heroSub}</p>
          {/* Answer-first lead — concise, extractable (AEO) */}
          <p className={styles.answer}>{data.answer}</p>
          <div className={styles.heroActions}>
            <BookButton location="service-hero">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
            <Link href="/case-studies" className="btn-outline">See Case Studies</Link>
          </div>
        </div>
      </section>

      {/* Commercial impact — 6-tile results grid */}
      <section className={styles.impactBand}>
        <div className="container">
          <p className={`eyebrow ${styles.impactEyebrow}`}>The commercial impact</p>
          <div className={styles.impactGrid}>
            {impacts.map((r, i) => (
              <div className={styles.impact} key={r.label}>
                <span className={styles.impactIcon}>{IMPACT_ICONS[i % IMPACT_ICONS.length]}</span>
                <div className={styles.impactValue}>{r.value}</div>
                <div className={styles.impactLabel}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where automation creates value — solution cards with per-capability ROI.
          Kept dark: the one mid-page dark accent that breaks the light rhythm. */}
      {solutions && solutions.length > 0 && (
        <section className="section-dark">
          <div className="container">
            <p className="eyebrow">What we automate</p>
            <h2 className={styles.solutionsHead}>Where automation creates value</h2>
            <div className={styles.solutionsGrid}>
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
          </div>
        </section>
      )}

      {/* Body + included */}
      <section className="section-light">
        <div className={`container ${styles.body}`}>
          <article className={styles.prose}>
            {data.sections.map((s) =>
              s.level === 2 ? (
                <div key={s.heading}><h2>{s.heading}</h2>{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
              ) : (
                <div key={s.heading}><h3>{s.heading}</h3>{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
              ),
            )}

            {data.callout && (
              <aside className={styles.callout}>
                <span className={styles.calloutTag}>The breaking point</span>
                <p>{data.callout}</p>
              </aside>
            )}

            <h2 className={styles.blockHead}>How it works</h2>
            <ol className={styles.steps}>
              {data.process.map((step, i) => (
                <li className={styles.step} key={step.title}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div><strong>{step.title}</strong><p>{step.body}</p></div>
                </li>
              ))}
            </ol>

            {data.workflows && data.workflows.length > 0 && (
              <>
                <h2 className={styles.blockHead}>Example workflows we build</h2>
                <ul className={styles.workflowChips}>
                  {data.workflows.map((w) => (
                    <li key={w} className={styles.chip}><span aria-hidden="true">✦</span>{w}</li>
                  ))}
                </ul>
              </>
            )}

            <h2 className={styles.blockHead}>Why a custom build beats off-the-shelf</h2>
            <ul className={styles.why}>
              {data.whyCustom.map((w) => (
                <li key={w}><span className={styles.check} aria-hidden="true">✓</span>{w}</li>
              ))}
            </ul>
          </article>

          <aside className={styles.aside}>
            <div className="glass-panel">
              <h2 className={styles.asideTitle}>What&apos;s included</h2>
              <ul className={styles.included}>
                {data.included.map((item) => (
                  <li key={item}><span className={styles.check} aria-hidden="true">✓</span>{item}</li>
                ))}
              </ul>
              <BookButton className={`btn-primary ${styles.asideBtn}`} location="service-sidebar">Get a Quote</BookButton>
              <p className={styles.guarantee}>90-day ROI guarantee · fixed price</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Proof */}
      {data.proof && (
        <section className="section-light" style={{ paddingTop: 0 }}>
          <div className="container">
            <Link href={`/case-studies/${data.proof.slug}`} className={styles.proof}>
              <span className={styles.proofTag}>Proof</span>
              <span className={styles.proofText}>{data.proof.label}</span>
              <span className={styles.proofArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* FAQ — light relief band */}
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

      {/* Related */}
      <section className="section-light">
        <div className="container">
          <h2 className={styles.relatedHead}>Related solutions</h2>
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

      {/* Closing CTA — the page previously ended at "Related solutions" with
          no actual ask. Anyone who reads this far already has intent. */}
      <section className="section-dark">
        <div className={`container ${styles.closingCta}`}>
          <h2 className={styles.closingTitle}>Ready to put {data.serviceName} to work?</h2>
          <p className={styles.closingSub}>15 minutes to see if this is worth building for you — no pressure if it isn&apos;t.</p>
          <BookButton location="service-footer">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
        </div>
      </section>
    </>
  );
}
