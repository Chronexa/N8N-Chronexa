import Link from 'next/link';
import styles from './ServiceSalesPage.module.css';
import { site } from '../lib/site';
import { getService, getSolutions, type ServiceContent } from '../lib/services-content';
import { getCategoryLabel, getKind } from '../lib/taxonomy';
import BookButton from './BookButton';
import TrackView from './TrackView';
import ScrollDepth from './ScrollDepth';
import LogoChip from './LogoChip';
import CountUp from './CountUp';
import ServiceSceneFrame from './ServiceSceneFrame';
import DocCostCalculator from '../app/document-processing-cost-calculator/DocCostCalculator';
import LegalROICalculator from '../app/law-firm-billing-leakage-calculator/LegalROICalculator';

/**
 * Sales-first service page — the 2026-07 rebuild pattern from the services
 * audit (seo/services-pages-audit-2026-07-25.md). Used only by registry
 * entries that define `sales`; the other 44 pages keep the article templates.
 *
 * Design rules carried from the audit: proof density above the fold (real
 * attributed numbers only), demonstration over argument (engine scene +
 * case spotlight), an intermediate-commitment step (embedded calculator with
 * its own lead capture), and a price anchor sourced from our published
 * pricing tiers. SEO surfaces (h1, answer, sections, FAQs, all JSON-LD) are
 * preserved from the registry so nothing indexable is lost.
 */

const CALCULATORS = {
  docintel: DocCostCalculator,
  legal: LegalROICalculator,
} as const;

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={styles.tick} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function ServiceSalesPage({ data }: { data: ServiceContent }) {
  const sales = data.sales;
  if (!sales) throw new Error(`ServiceSalesPage rendered for "${data.slug}" without a sales block`);

  const url = `${site.url}/${data.slug}`;
  const solutions = getSolutions(data.slug) ?? [];
  const categoryLabel = getCategoryLabel(data.slug);
  const hub = getKind(data.slug) === 'service'
    ? { href: '/solutions', name: 'Solutions' }
    : { href: '/use-cases', name: 'Use Cases' };
  const [problemSection, ...restSections] = data.sections;
  const calculatorKey = sales.calculatorKey ?? sales.scene;
  const Calculator = calculatorKey ? CALCULATORS[calculatorKey] : undefined;
  const cs = sales.caseSpotlight;

  const acc = sales.heroAccent;
  const splitH1 = acc && data.h1.endsWith(acc) ? data.h1.slice(0, -acc.length) : null;

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
      { '@type': 'ListItem', position: 2, name: hub.name, item: `${site.url}${hub.href}` },
      { '@type': 'ListItem', position: 3, name: data.serviceName, item: url },
    ],
  };

  return (
    <>
      <TrackView event="service_view" props={{ slug: data.slug, name: data.serviceName, category: categoryLabel, template: 'sales' }} />
      <ScrollDepth pageType="service" slug={data.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero: keyword h1 + real numbers + the buyer's own stack ───────── */}
      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href={hub.href}>{hub.name}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{data.serviceName}</span>
          </nav>
          <p className={styles.kindPill}>{categoryLabel}</p>
          <h1 className={styles.h1}>
            {splitH1 ? (<>{splitH1}<span className="accent-phrase">{acc}</span></>) : data.h1}
          </h1>
          <p className="heroDescription">{data.heroSub}</p>
          <p className={styles.answer}>{data.answer}</p>

          <div className={styles.heroActions}>
            <BookButton location="service-hero">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
            {sales.scene && <a href="#see-it-run" className="btn-outline">See it run ↓</a>}
          </div>

          <div className={styles.heroStats}>
            {sales.stats.map((s) => (
              <div className={styles.heroStat} key={s.label}>
                <span className={`display-num ${styles.heroStatNum}`}>
                  {typeof s.value === 'number' ? <CountUp value={s.value} suffix={s.suffix ?? ''} /> : s.value}
                </span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.stackRow}>
            <span className={styles.stackLabel}>Plugs into the stack you already run</span>
            <div className={styles.stackChips}>
              {sales.stack.map((t) => (
                <LogoChip key={t.file} file={t.file} name={t.name} size="sm" showName />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── See it run: the engine scene, in window chrome ─────────────────── */}
      {sales.scene && sales.sceneTitle && sales.sceneCaption && (
        <section id="see-it-run" className={`section-dark ${styles.sceneBand}`}>
          <div className="container">
            <p className="eyebrow">See it run</p>
            <h2 className={styles.sectionHead}>{sales.sceneTitle}</h2>
            <p className={styles.sceneCaption}>{sales.sceneCaption}</p>
            <ServiceSceneFrame scene={sales.scene} title={sales.sceneTitle} slug={data.slug} />
          </div>
        </section>
      )}

      {/* ── The problem (registry prose kept — indexable text is preserved) ── */}
      {problemSection && (
        <section className="section-light">
          <div className="container">
            <p className={`eyebrow ${styles.eyebrowGreen}`}>The problem</p>
            <h2 className={styles.sectionHead}>{problemSection.heading}</h2>
            {problemSection.body.map((p, i) => <p key={i} className={styles.lede}>{p}</p>)}
            {data.callout && (
              <aside className={styles.callout}>
                <span className={styles.calloutTag}>The breaking point</span>
                <p>{data.callout}</p>
              </aside>
            )}
          </div>
        </section>
      )}

      {/* ── Proof: one case, told like the homepage spotlight ──────────────── */}
      {cs && (
      <section className={styles.proofBand}>
        <div className="container">
          <p className={`eyebrow ${styles.eyebrowGreen}`}>Proof</p>
          <h2 className={styles.sectionHead}>What this looks like in production</h2>
          <div className={`panel ${styles.spotlight}`}>
            <div className={styles.spotCopy}>
              <span className={styles.labelChip}>{cs.label}</span>
              <h3 className={styles.spotTitle}>{cs.title}</h3>
              <p className={styles.spotBody}>{cs.body}</p>
              <div className={styles.spotStats}>
                {cs.stats.map((s) => (
                  <div className={styles.spotStat} key={s.label}>
                    <span className={`display-num ${styles.spotStatNum}`}><CountUp value={s.value} suffix={s.suffix} /></span>
                    <span className={styles.spotStatLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
              <Link href={`/case-studies/${cs.slug}`} className={`link-arrow ${styles.spotRead}`}>
                Read the full case study <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.spotVisual}>
              <div className={`${styles.spotGrid} grid-texture`} aria-hidden="true" />
              <div className={styles.window} role="img" aria-label={`Simplified view of the ${cs.label} pipeline`}>
                <div className={styles.windowBar} aria-hidden="true">
                  <i /><i /><i />
                  <span>{cs.window.title}</span>
                </div>
                <ul className={styles.rows}>
                  {cs.window.rows.map((r) => (
                    <li key={r.text}>
                      <LogoChip file={r.file} name={r.name} size="sm" />
                      <span className={styles.rowText}>{r.text}</span>
                      <Tick />
                    </li>
                  ))}
                  <li className={styles.gate}>
                    <span className={styles.gateDot} aria-hidden="true" />
                    <span className={styles.rowText}>{cs.window.gate}</span>
                  </li>
                </ul>
              </div>
              <div className={styles.overlayCard} aria-hidden="true">
                <span className={`display-num ${styles.overlayNum}`}>{cs.overlay.big}</span>
                <span className={styles.overlaySmall}>{cs.overlay.small}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── What we automate (+ the tools on each card) ────────────────────── */}
      <section className="section-dark">
        <div className="container">
          <p className="eyebrow">What we automate</p>
          <h2 className={styles.sectionHead}>Where automation creates value</h2>
          <div className={styles.solutionGrid}>
            {solutions.map((s) => (
              <article className={styles.solutionCard} key={s.title}>
                <h3 className={styles.solutionTitle}>{s.title}</h3>
                <p className={styles.solutionBody}>{s.body}</p>
                {sales.solutionLogos?.[s.title] && (
                  <div className={styles.solutionChips}>
                    {sales.solutionLogos[s.title].map((f) => <LogoChip key={f} file={f} name="" size="sm" />)}
                  </div>
                )}
                <p className={styles.solutionRoi}>
                  <span className={styles.solutionRoiTag} aria-hidden="true">↑ ROI impact</span>
                  {s.roiImpact}
                </p>
              </article>
            ))}
          </div>
          {restSections.length > 0 && (
            <div className={styles.prose}>
              {restSections.map((s) => (
                <div key={s.heading}>
                  <h3>{s.heading}</h3>
                  {s.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Run your numbers: the real calculator, lead capture included ───── */}
      {sales.calculator && Calculator && (
        <section className={styles.calcBand}>
          <div className="container">
            <p className={`eyebrow ${styles.eyebrowGreen}`}>Run your numbers</p>
            <h2 className={styles.sectionHead}>{sales.calculator.heading}</h2>
            <p className={styles.lede}>{sales.calculator.sub}</p>
            <div className={styles.calcPanel}>
              <Calculator />
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing anchor + the differentiator ────────────────────────────── */}
      <section className="section-light">
        <div className="container">
          <div className={`panel ${styles.pricing}`}>
            <div>
              <p className={`eyebrow ${styles.eyebrowGreen}`}>What it costs</p>
              <p className={styles.pricingLine}>{sales.pricingLine}</p>
            </div>
            <BookButton location="service-pricing">Start with the free audit <span aria-hidden="true">→</span></BookButton>
          </div>
          <aside className={styles.whyNotChat}>
            <span className={styles.whyNotChatTag}>Why not just ChatGPT?</span>
            <p>
              A chat window answers questions about whatever you paste into it. It cannot watch your inbox, know a new
              document has arrived, classify a hundred thousand filings, or put the result into the systems your team
              works in. That takes infrastructure — integrations, retrieval pipelines, approval gates, logging —
              engineered around the models, inside your environment. That infrastructure is what this page describes.
            </p>
          </aside>
        </div>
      </section>

      {/* ── Approach ───────────────────────────────────────────────────────── */}
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
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
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

      {/* ── Related + closing CTA ──────────────────────────────────────────── */}
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
