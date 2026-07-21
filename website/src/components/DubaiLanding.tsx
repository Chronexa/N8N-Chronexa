import Image from 'next/image';
import Link from 'next/link';
import styles from './DubaiLanding.module.css';
import { site, founders } from '../lib/site';
import { type ServiceContent } from '../lib/services-content';
import BookButton from './BookButton';
import TrackView from './TrackView';
import ScrollDepth from './ScrollDepth';

const PAIN_POINTS = [
  'Leads sit in a shared inbox until someone remembers to reply',
  'The same customer details get typed into three different systems',
  'WhatsApp messages, invoices and reports pile up faster than your team can clear them',
  'Reports get rebuilt by hand every week from numbers scattered across tools',
  'Growth means hiring more people to do the same manual work — not less',
];

const AUTOMATIONS = [
  { title: 'Workflow Automation (n8n)', body: 'Connect the tools you already use and automate the busywork between them — self-hosted, so you own it outright.' },
  { title: 'AI Agents & Chatbots', body: 'Handle customer replies, lead qualification and routine questions around the clock, in English or Arabic.' },
  { title: 'Document Processing & OCR', body: 'Turn invoices, forms and PDFs into structured, usable data automatically.' },
  { title: 'CRM & WhatsApp Integration', body: 'Sync leads and conversations across your CRM, WhatsApp Business and inbox in real time.' },
  { title: 'Data & System Integration', body: 'Connect your CRM, ERP and spreadsheets into one clean, always-current data layer.' },
  { title: 'Reporting & Analytics Automation', body: 'Dashboards and reports that update themselves — no manual pull every week.' },
];

const INDUSTRIES = [
  'Retail & E-commerce', 'Real Estate', 'Logistics & Trading', 'Hospitality',
  'Healthcare & Clinics', 'Finance & Accounting', 'Legal', 'Financial Services & Wealth Management',
  'Professional Services', 'Startups & SMEs',
];

export default function DubaiLanding({ data }: { data: ServiceContent }) {
  const url = `${site.url}/${data.slug}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.serviceName,
    serviceType: data.serviceType,
    description: data.schemaDescription,
    url,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: ['AE', 'Dubai', 'Abu Dhabi'],
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
      { '@type': 'ListItem', position: 2, name: data.serviceName, item: url },
    ],
  };

  return (
    <>
      <TrackView event="service_view" props={{ slug: data.slug, name: data.serviceName, category: 'Geo' }} />
      <ScrollDepth pageType="service" slug={data.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero — full-bleed skyline photo behind the text, same construction as
          the homepage hero (absolute image + directional scrim + left-anchored
          content column), not a boxed side panel. */}
      <section className={styles.hero} aria-labelledby="dubai-hero-title">
        <picture className={styles.heroPicture}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/dubai-skyline-hero.jpg" alt="" className={styles.heroImg} fetchPriority="high" decoding="async" />
        </picture>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={`container ${styles.heroContainer}`}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{data.serviceName}</span>
          </nav>
          <p className={styles.kindPill}>AI Automation Agency · Dubai &amp; UAE</p>
          <h1 id="dubai-hero-title" className={styles.heroTitle}>We automate the work slowing your Dubai business down.</h1>
          <p className={styles.heroDescription}>Workflow automation, AI agents and document processing — built for your business, not a template. Fixed-price, with a 90-day ROI guarantee.</p>
          <div className={styles.heroActions}>
            <BookButton location="dubai-hero">Book a Free Audit <span aria-hidden="true">→</span></BookButton>
            <Link href="/case-studies" className="btn-outline">See Case Studies</Link>
          </div>
        </div>
      </section>

      {/* Who's behind this — real founders, real credentials. No client
          metrics for this market yet, so credibility comes from the people. */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">Who&apos;s behind this</p>
          <h2 className={styles.sectionHead}>Built by engineers and operators, not a call center</h2>
          <div className={styles.foundersGrid}>
            {founders.map((f) => (
              <article className={styles.founderCard} key={f.name}>
                <Image src={f.image} alt={f.name} width={72} height={72} className={styles.founderImg} />
                <div>
                  <p className={styles.founderName}>{f.name}</p>
                  <p className={styles.founderRole}>{f.role} · {f.credential}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points — specific, not a rhetorical-question gimmick */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">Where the hours actually go</p>
          <h2 className={styles.sectionHead}>The manual work eating your team&apos;s week</h2>
          <ul className={styles.painGrid}>
            {PAIN_POINTS.map((p) => (
              <li className={styles.painItem} key={p}>
                <span className={styles.painMark} aria-hidden="true">＋</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we build — broad functional grid, any industry */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">What we build</p>
          <h2 className={styles.sectionHead}>Workflow automation, AI agents, and the integrations between them</h2>
          <div className={styles.autoGrid}>
            {AUTOMATIONS.map((a) => (
              <article className={styles.autoCard} key={a.title}>
                <h3 className={styles.autoTitle}>{a.title}</h3>
                <p className={styles.autoBody}>{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries — the explicit "anyone is served" statement, one dark accent band */}
      <section className="section-dark">
        <div className="container">
          <p className={`eyebrow ${styles.industriesEyebrow}`}>Who we work with</p>
          <h2 className={styles.industriesHead}>Not just finance and legal — any industry</h2>
          <div className={styles.industriesGrid}>
            {INDUSTRIES.map((ind) => (
              <span className={styles.industryChip} key={ind}>{ind}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Chronexa + process */}
      <section className="section-light">
        <div className={`container ${styles.whyGrid}`}>
          <div>
            <p className="eyebrow">Why Chronexa</p>
            <h2 className={styles.sectionHead}>What&apos;s different about working with us</h2>
            <ul className={styles.why}>
              {data.whyCustom.map((w) => (
                <li key={w}><span className={styles.check} aria-hidden="true">✓</span>{w}</li>
              ))}
            </ul>
          </div>
          <div className="glass-panel">
            <h3 className={styles.includedTitle}>What&apos;s included</h3>
            <ul className={styles.included}>
              {data.included.map((item) => (
                <li key={item}><span className={styles.check} aria-hidden="true">✓</span>{item}</li>
              ))}
            </ul>
            <BookButton className={`btn-primary ${styles.includedBtn}`} location="dubai-sidebar">Get a Quote</BookButton>
            <p className={styles.guarantee}>90-day ROI guarantee · fixed price</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2 className={styles.sectionHead}>From audit to live in weeks</h2>
          <ol className={styles.steps}>
            {data.process.map((step, i) => (
              <li className={styles.step} key={step.title}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{step.title}</strong><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className={`container ${styles.faqWrap}`}>
          <h2 className={styles.sectionHead}>Frequently asked questions</h2>
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

      {/* Closing CTA */}
      <section className="section-dark">
        <div className={`container ${styles.closingCta}`}>
          <h2 className={styles.closingTitle}>Ready to see what we&apos;d automate for you?</h2>
          <p className={styles.closingSub}>15 minutes to see if this is worth building for your business — no pressure if it isn&apos;t.</p>
          <BookButton location="dubai-footer">Book a Free Audit <span aria-hidden="true">→</span></BookButton>
        </div>
      </section>
    </>
  );
}
