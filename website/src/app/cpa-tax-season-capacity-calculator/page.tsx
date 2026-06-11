import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import CapacityCalculator from './CapacityCalculator';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/cpa-tax-season-capacity-calculator`;
const TITLE = 'CPA Tax Season Capacity Calculator — Returns You Could Add Without Hiring | Chronexa';
const DESCRIPTION =
  'Document automation cuts prep time per return by 40%. Enter your preparers, return volume, prep hours and average fee — see how many returns your current team could add next season, and what that capacity is worth.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'CPA tax season capacity calculator', 'tax firm capacity planning', 'tax preparation automation ROI',
    'CPA firm capacity', 'returns per preparer', 'tax document automation savings',
    'accounting firm busy season staffing', 'tax prep time per return',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where do the 40% and 3× benchmarks come from?',
    a: 'They are the published benchmarks on our CPA & Tax Engine page, drawn from documented results in AI tax-document automation (benchmarks from Filed): roughly 40% less preparation time per return once intake, classification, extraction and return population are automated, and up to 3× staff capacity in busy season. The calculator deliberately models throughput at a conservative 30% — not the 3× best case — so the business case never depends on a ceiling number.',
  },
  {
    q: 'Does this include review time, or just prep?',
    a: 'Just prep — intake, classification, data entry and population. Review is a separate gain: with a side-by-side review dashboard where every extracted value links to its source document, CPA review typically drops from 3–4 hours to 15–25 minutes per return. The calculator leaves that out, which makes its estimate more conservative, not less.',
  },
  {
    q: 'We are a small firm — does the math still hold?',
    a: 'Yes. The model is linear, so it holds at 600 returns or 6,000. What changes at smaller firms is which constraint binds first: capacity per preparer matters most when hiring seasonal staff is hardest, which is exactly the small-firm situation.',
  },
  {
    q: 'What does it take to actually capture this capacity?',
    a: 'The pipeline behind the numbers: client documents pulled automatically from your portal, classified by type (W-2s, 1099s, K-1s, brokerage composites), fields extracted and verified, and the return pre-filled in your existing tax software — UltraTax, CCH Axcess, Drake, Lacerte or ProConnect. Firms typically go live in 3–5 weeks, before season.',
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
        { '@type': 'ListItem', position: 3, name: 'CPA Tax-Season Capacity Calculator', item: URL },
      ],
    },
    {
      '@type': 'WebApplication',
      name: 'CPA Tax-Season Capacity Calculator',
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
            <h1 className={styles.heroTitle}>How many returns is your team leaving on the table next season?</h1>
            <p className={styles.heroSub}>
              Automated document intake, extraction and return pre-fill cut prep time per return by about 40%. That
              freed time is capacity — returns your current team could file without a single seasonal hire. Move the
              sliders.
            </p>
          </div>
          <CapacityCalculator />
        </div>
      </section>

      {/* 2 — Methodology */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">Methodology</p>
          <h2 className={styles.bodyTitle}>The math, in the open</h2>
          <p className={styles.prose}>
            No black box. Prep hours are your returns multiplied by your average prep time; automation removes 40% of
            them (the published benchmark for automated intake, classification, extraction and pre-fill). Throughput is
            modelled at a deliberately conservative 30% gain — the engine benchmark is 3× — and capacity revenue is
            simply the added returns at your average fee.
          </p>
          <pre className={styles.formula}>
{`hours freed      = returns × prep hours/return × 40%
added returns    = returns × 30%   (conservative; benchmark is 3×)
capacity revenue = added returns × average fee`}
          </pre>
          <p className={styles.prose}>
            With the defaults — a 10-preparer firm filing 600 returns at a $700 average fee — that is 180 additional
            returns and $126,000 in added capacity revenue per season: the same worked example published on our CPA
            &amp; Tax Engine page. Where the 40% comes from in practice: documents are pulled from your client portal
            automatically, classified by type, extracted field-by-field with a verification pass, and pushed into your
            tax software as a 90–94% pre-filled return. The preparer starts from a punch-list, not a blank organizer.
          </p>
        </div>
      </section>

      {/* 3 — The fix */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">The fix</p>
          <h2 className={styles.bodyTitle}>How firms capture the capacity</h2>
          <div className={styles.fixGrid}>
            <Link href="/cpa-tax-document-automation" className={styles.fixCard}>
              <p className={styles.fixKicker}>The service</p>
              <p className={styles.fixTitle}>CPA tax document automation</p>
              <p className={styles.fixBody}>
                Document chasing, intake, classification and extraction automated end-to-end — 84% less manual client
                follow-up, 3× more documents processed per staff member.
              </p>
            </Link>
            <Link href="/ai-engines/cpa-tax-engine" className={styles.fixCard}>
              <p className={styles.fixKicker}>The engine</p>
              <p className={styles.fixTitle}>The CPA &amp; Tax Engine</p>
              <p className={styles.fixBody}>
                Watch the full pipeline run: intake → classification → extraction → gap chasing → return population →
                CPA review, with every number this calculator uses.
              </p>
            </Link>
            <Link href="/tax-software-ai-integration" className={styles.fixCard}>
              <p className={styles.fixKicker}>Your stack</p>
              <p className={styles.fixTitle}>Built on your tax software</p>
              <p className={styles.fixBody}>
                UltraTax CS, CCH Axcess, Drake, Lacerte, ProConnect — the pre-filled return lands in the software your
                preparers already use. No migration.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — FAQ */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 className={styles.bodyTitle}>Tax-season capacity, answered</h2>
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
