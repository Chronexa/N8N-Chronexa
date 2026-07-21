import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import DocCostCalculator from './DocCostCalculator';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/document-processing-cost-calculator`;
const TITLE = 'Document Processing Cost Calculator — What Manual Handling Really Costs | Chronexa';
const DESCRIPTION =
  'Manual document handling costs $10–$40 per document once you count the full touch time. Enter your monthly volume, minutes per document and staff cost — see your annual cost and the 40–60% that automation removes.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'document processing cost calculator', 'invoice processing cost', 'cost per invoice',
    'document automation ROI', 'AP automation savings calculator', 'manual data entry cost',
    'document processing automation', 'OCR automation savings',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where does the 40–60% reduction come from?',
    a: 'It is the published range on our document and finance automation pages for invoice and AP handling once intake, extraction and routing are automated, and it is consistent with our first-hand client results — a reserve-study document pipeline whose turnaround went from 14 days to 4 hours, and 5× throughput per analyst. The calculator highlights the 50% midpoint and always shows the full band.',
  },
  {
    q: 'How does my number compare to industry benchmarks?',
    a: 'For invoices specifically, APQC benchmarking puts the median cost at roughly $21 per manually processed invoice (top-quartile organisations reach ~$10), and Ardent Partners cites $15–40 for manual-heavy AP teams. If your per-document cost lands in that range, you are typical — which is the problem.',
  },
  {
    q: 'What document types does this apply to?',
    a: 'Anything staff currently read and re-key: invoices, insurance claims and FNOL packets, tax documents, loan files, inspection forms, contracts, statements. Extraction handles scanned PDFs, photos and handwriting — our published accuracy on handwritten inspection forms is 94%, with every field carrying a confidence score so low-confidence reads route to a human instead of into your system.',
  },
  {
    q: 'Does automation replace the processing team?',
    a: 'It redeploys them. The model assumes the freed time moves to exceptions, review and higher-value work — that is also why we model savings at the band rather than promising 100% removal. Human review on flagged items is part of the design, not a failure of it.',
  },
  {
    q: 'Is the data I enter here stored anywhere?',
    a: 'No — the sliders run entirely in your browser. We only receive your inputs if you choose to submit the form with your email, in which case we use them to prepare your breakdown.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${site.url}/tools` },
        { '@type': 'ListItem', position: 3, name: 'Document Processing Cost Calculator', item: URL },
      ],
    },
    {
      '@type': 'WebApplication',
      name: 'Document Processing Cost Calculator',
      url: URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: site.name, url: site.url },
      description: DESCRIPTION,
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
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

      {/* 1 — Dark hero with the live calculator */}
      <section className="section-dark">
        <div className="container">
          <div className={styles.heroInner}>
            <p className="eyebrow">Free calculator</p>
            <h1 className={styles.heroTitle}>What is manual document processing actually costing you?</h1>
            <p className={styles.heroSub}>
              Every document a person opens, reads, re-keys and files costs real staff time — typically $10–$40 each
              once you count the full touch. Multiply by your monthly volume and the number stops looking small. Move
              the sliders.
            </p>
          </div>
          <DocCostCalculator />
        </div>
      </section>

      {/* 2 — Methodology */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">Methodology</p>
          <h2 className={styles.bodyTitle}>The math, in the open</h2>
          <p className={styles.prose}>
            Annual cost is your monthly volume times twelve, times handling minutes per document, priced at your loaded
            staff cost. Savings apply the 40–60% handling-time reduction we publish for automated intake, extraction
            and routing — shown as a band with the midpoint highlighted, never a single best-case number.
          </p>
          <pre className={styles.formula}>
{`annual cost = docs/month × 12 × minutes/doc ÷ 60 × hourly cost
savings     = annual cost × 40–60%   (midpoint 50% shown)`}
          </pre>
          <p className={styles.prose}>
            External cross-checks for the per-document cost: APQC benchmarking puts the median manually processed
            invoice at roughly $21 (top quartile ~$10); Ardent Partners cites $15–40 for manual-heavy AP teams. Our own
            first-hand result on a document-heavy pipeline — reserve studies — cut turnaround from 14 days to 4 hours
            at 94% extraction accuracy on handwritten forms, with every extracted field carrying a confidence score and
            low-confidence reads routed to a human.
          </p>

          <h3 className={styles.methodSubhead}>How to use this calculator</h3>
          <ol className={styles.howToList}>
            <li className={styles.howToItem}>Enter your monthly document volume — invoices, claims, forms, statements, contracts.</li>
            <li className={styles.howToItem}>Enter the full touch time per document: open, read, extract, re-key, file, route.</li>
            <li className={styles.howToItem}>Enter your loaded hourly cost — salary plus benefits and overhead, per hour.</li>
            <li className={styles.howToItem}>Read your annual cost, the savings band, and the before/after below for what changes.</li>
          </ol>

          <div className={styles.caveatBox}>
            <span className={styles.caveatLabel}>When this doesn&rsquo;t fully apply</span>
            <p>
              This model assumes documents follow patterns extraction can learn — invoices, claims, forms, statements,
              contracts. At very low volume (a few hundred documents a month), the fixed cost of setting up extraction
              may take longer to pay back. And documents that need a genuine judgment call rather than reading and
              re-keying values won&rsquo;t see the same handling-time reduction, though they still benefit from being
              searchable and cited once indexed.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — The fix */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">The fix</p>
          <h2 className={styles.bodyTitle}>How teams remove the 40–60%</h2>
          <div className={styles.fixGrid}>
            <Link href="/document-processing-automation" className={styles.fixCard}>
              <p className={styles.fixKicker}>The service</p>
              <p className={styles.fixTitle}>Document processing automation</p>
              <p className={styles.fixBody}>
                Intake, classification, field extraction and system write-back for any document type — scanned, photographed
                or handwritten — with human review on flagged items.
              </p>
            </Link>
            <Link href="/ai-engines/document-intelligence-engine" className={styles.fixCard}>
              <p className={styles.fixKicker}>The engine</p>
              <p className={styles.fixTitle}>The Document Intelligence Engine</p>
              <p className={styles.fixBody}>
                Watch the pipeline run end-to-end — the same system behind the 14-days-to-4-hours client result this
                calculator cites.
              </p>
            </Link>
            <Link href="/finance-automation" className={styles.fixCard}>
              <p className={styles.fixKicker}>For finance teams</p>
              <p className={styles.fixTitle}>Invoice &amp; AP automation</p>
              <p className={styles.fixBody}>
                The finance-specific version: 40–60% less invoice and AP handling time, 50%+ faster month-end close.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — FAQ */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 className={styles.bodyTitle}>Document processing costs, answered</h2>
          <div className={styles.faqList}>
            {FAQS.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <p className={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
