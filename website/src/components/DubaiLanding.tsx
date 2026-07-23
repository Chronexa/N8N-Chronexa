import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './DubaiLanding.module.css';
import { site } from '../lib/site';
import { type ServiceContent } from '../lib/services-content';
import BookButton from './BookButton';
import TrackView from './TrackView';
import ScrollDepth from './ScrollDepth';

const sv = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

const SERVICES = [
  {
    icon: sv(<><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8.2 7.2 10.5 16M15.8 7.2 13.5 16M8.5 6h7" /></>),
    title: 'Workflow Automation',
    body: 'We connect the systems you already run, CRM, WhatsApp, email, spreadsheets, accounting software, into automated workflows built on n8n, so information moves between them without anyone re-typing it.',
    example: 'Example: a new lead from your website or a property listing lands straight in your CRM and gets a WhatsApp reply within a minute, with no one checking an inbox.',
    impact: 'Replaces hours of manual data entry a week with a system that runs itself.',
  },
  {
    icon: sv(<><path d="M4 5h16v11H8l-4 4z" /><path d="M8 10h8M8 13h5" /></>),
    title: 'AI Agents & Chatbots',
    body: 'AI agents built on OpenAI and Anthropic Claude answer customer questions, qualify leads, and handle routine requests in English or Arabic, over WhatsApp, your website, or email.',
    example: 'Example: a customer asks about availability at 11pm and gets an accurate answer immediately, instead of waiting for your team to open the next morning.',
    impact: 'Cuts response time from hours to seconds on the questions that do not need a person.',
  },
  {
    icon: sv(<><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v3h3" /><path d="M9 12h6M9 15h6M9 9h3" /></>),
    title: 'Document Processing',
    body: 'OCR and AI extract structured data from invoices, contracts, and forms, so your team stops retyping information from PDFs into spreadsheets or accounting software.',
    example: 'Example: a batch of supplier invoices is read, categorized, and entered into your accounting system automatically, with a person only reviewing exceptions.',
    impact: 'Turns a task that used to take a full day into a five-minute review.',
  },
  {
    icon: sv(<><path d="M7 3v6l-3 3 3 3v6" /><path d="M17 3v6l3 3-3 3v6" /><path d="M10 12h4" /></>),
    title: 'CRM & WhatsApp Integration',
    body: 'We connect your CRM, Zoho, HubSpot, Salesforce, or your own system, with WhatsApp Business API, email, and your website forms, so every lead and conversation lives in one place.',
    example: 'Example: a message from WhatsApp automatically creates or updates the right contact record in your CRM, with no one copying details by hand.',
    impact: 'Nothing gets lost between the channel a customer messages you on and the system your team works from.',
  },
  {
    icon: sv(<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>),
    title: 'System & Data Integration',
    body: 'We connect your CRM, ERP, accounting software, and spreadsheets into one clean data layer, so the numbers in one system match the numbers in another.',
    example: 'Example: sales figures in your CRM match what shows up in your accounting software at month end, instead of someone reconciling two spreadsheets by hand.',
    impact: 'One accurate source of truth instead of three versions of the same data.',
  },
  {
    icon: sv(<><path d="M4 20V10M11 20V4M18 20v-7" /><path d="M2 20h20" /></>),
    title: 'Reporting & Dashboards',
    body: 'Automated reports and dashboards pull directly from your live systems, so the numbers your team needs each week are already there when they need them.',
    example: 'Example: a report that used to take half a day to compile every Monday morning is ready before anyone sits down.',
    impact: 'Your team spends that time acting on the numbers, not assembling them.',
  },
];

const TOOLS = [
  'n8n', 'OpenAI', 'Anthropic Claude', 'WhatsApp Business API', 'Zoho', 'HubSpot',
  'Salesforce', 'Google Workspace', 'QuickBooks', 'Xero', 'Zapier (migration)', 'Make (migration)',
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

      {/* Hero: full-bleed skyline photo, same construction as the homepage hero */}
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
          <p className={styles.heroDescription}>{data.heroSub}</p>
          <div className={styles.heroActions}>
            <BookButton location="dubai-hero">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
            <Link href="/case-studies" className="btn-outline">See Case Studies</Link>
          </div>
        </div>
      </section>

      {/* What we build: 6 concrete services, each with a named tool, a real
          example, and a plain impact line. This carries the page's sales case. */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">What we build</p>
          <h2 className={styles.sectionHead}>Six things we build most often for Dubai and UAE teams</h2>
          <div className={styles.autoGrid}>
            {SERVICES.map((s) => (
              <article className={styles.autoCard} key={s.title}>
                <span className={styles.autoIcon}>{s.icon}</span>
                <h3 className={styles.autoTitle}>{s.title}</h3>
                <p className={styles.autoBody}>{s.body}</p>
                <p className={styles.autoExample}>{s.example}</p>
                <p className={styles.autoImpact}><span className={styles.impactMark} aria-hidden="true">↑</span>{s.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Chronexa + included */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className={`container ${styles.whyGrid}`}>
          <div>
            <p className="eyebrow">Why Chronexa</p>
            <h2 className={styles.sectionHead}>Why businesses in Dubai work with us</h2>
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
            <p className={styles.guarantee}>90-day ROI guarantee, fixed price</p>
          </div>
        </div>
      </section>

      {/* Technology & tools: the explicit "what can you orchestrate" answer */}
      <section className="section-dark">
        <div className="container">
          <p className={`eyebrow ${styles.toolsEyebrow}`}>Technology & tools</p>
          <h2 className={styles.toolsHead}>What we build on, and what we connect</h2>
          <p className={styles.toolsSub}>Workflows run on n8n. AI agents run on OpenAI and Anthropic Claude. On the integration side, we connect to whatever your team already uses.</p>
          <div className={styles.toolsGrid}>
            {TOOLS.map((t) => (
              <span className={styles.toolChip} key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-light">
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
      <section className="section-light" style={{ paddingTop: 0 }}>
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
          <p className={styles.closingSub}>15 minutes to see if this is worth building for your business. No pressure if it isn&apos;t.</p>
          <BookButton location="dubai-footer">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
        </div>
      </section>
    </>
  );
}
