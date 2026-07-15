import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import LeakageCalculator from './LeakageCalculator';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/law-firm-billing-leakage-calculator`;
const TITLE = 'Law Firm Billing Leakage Calculator — How Much Revenue Is Your Firm Losing? | Chronexa';
const DESCRIPTION =
  'Firms typically lose 15–30% of billable time to unlogged work. Enter your lawyer count, blended rate and billable hours — see what your firm leaks per year, what is recoverable, and the workflows that close the gap.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'law firm billing leakage', 'billing leakage calculator', 'legal billing leakage',
    'law firm revenue leakage', 'automated time capture law firm', 'unbilled hours law firm',
    'legal billing automation ROI', 'law firm time capture',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where does the 26% leakage figure come from?',
    a: 'It is Chronexa’s own modeled estimate — we’d rather say that plainly than borrow false precision from a study that doesn’t exist. It sits inside a documented range: industry estimates put collectible billable-hour loss to unbilled time and write-downs at 15–30%, and Clio’s Legal Trends Report — the most-cited benchmark in the industry — finds the average attorney captures just 2.5 of 8 billable hours a day and firms collect 93% of what they bill. We model 26%, near the middle of that range, specifically for time that is worked but never reaches a timesheet — reconstructed from memory, logged short "to be safe", or lost entirely to AI-assisted sessions. Your firm’s actual rate depends on practice mix and timekeeping discipline, which is what an audit measures.',
  },
  {
    q: 'Why does AI adoption make billing leakage worse?',
    a: 'Because no legal AI platform writes its usage to your billing system. When a lawyer spends 90 minutes working with an AI assistant on a matter, that time is billable, matter-attributable work — and it is invisible to your timekeeping process. The more your lawyers use AI, the more work compresses into sessions that never get logged.',
  },
  {
    q: 'Does this apply to fixed-fee or contingency work?',
    a: 'The calculator models hourly billing, where leakage converts directly into lost revenue. On fixed-fee work the same failure shows up differently — as unmeasured effort and margin erosion you cannot see. Mixed-model firms should apply the calculator to the hourly share of their practice.',
  },
  {
    q: 'How is the recoverable number calculated?',
    a: 'Conservatively: half of the estimated leak. Automated time capture — a background timer that turns work sessions into draft time entries the lawyer approves in one click — typically recovers a large share of unlogged time, but we model 50% so the business case never depends on a best-case assumption.',
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
        { '@type': 'ListItem', position: 2, name: 'Law Firm Billing Leakage Calculator', item: URL },
      ],
    },
    {
      '@type': 'WebApplication',
      name: 'Law Firm Billing Leakage Calculator',
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
            <h1 className={styles.heroTitle}>How much revenue is your firm losing to billing leakage?</h1>
            <p className={styles.heroSub}>
              Firms typically lose 15–30% of billable time to unlogged work — time reconstructed from memory, sessions
              logged short, AI-assisted work that never reaches a timesheet. We model 26%. Move the sliders.
            </p>
          </div>
          <LeakageCalculator />
        </div>
      </section>

      {/* 2 — Methodology (transparent math = citable asset) */}
      <section className="section-light">
        <div className="container">
          <p className="eyebrow">Methodology</p>
          <h2 className={styles.bodyTitle}>The math, in the open</h2>
          <p className={styles.prose}>
            No black box: the calculator multiplies your fee-earning lawyers by your blended billable rate and daily
            billable hours across 250 working days to get potential annual billings. It then applies a 26% leakage
            rate — our own modeled estimate, set inside a documented range: industry estimates put collectible-hour
            loss to unbilled time at 15–30%, and Clio&rsquo;s Legal Trends Report finds the average attorney captures
            just 2.5 of 8 billable hours a day. Recovery is modeled at a deliberately conservative 50% of the leak.
          </p>
          <pre className={styles.formula}>
{`potential  = lawyers × rate × billable hours/day × 250 days
leakage    = potential × 26%   (modeled, inside the documented 15–30% range)
recoverable = leakage × 50%    (conservative capture)`}
          </pre>
          <p className={styles.prose}>
            Where this leakage actually comes from: lawyers reconstructing their day at 6pm and rounding down &ldquo;to
            be safe&rdquo;, work sessions that never reach the timesheet — and increasingly, AI-assisted work, because no
            AI platform writes its usage to a billing system. A lawyer who spends 90 minutes with the firm&rsquo;s AI
            assistant on a matter has done billable, supervised professional work that timekeeping was never designed
            to see. The more efficient your lawyers get, the bigger that blind spot grows. This figure is specifically
            about time that never reaches a bill — pre-bill write-downs and slow collections are real, separate drains
            on realized revenue that this calculator does not attempt to model.
          </p>
        </div>
      </section>

      {/* 3 — How firms close the leak */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">The fix</p>
          <h2 className={styles.bodyTitle}>How firms close the leak</h2>
          <div className={styles.fixGrid}>
            <Link href="/law-firm-automated-time-capture" className={styles.fixCard}>
              <p className={styles.fixKicker}>Workflow 01</p>
              <p className={styles.fixTitle}>Automated time capture</p>
              <p className={styles.fixBody}>
                A background timer turns every work session — AI tools included — into a draft time entry against the
                right matter. The lawyer approves in one click. This is the workflow that closes the leak directly.
              </p>
            </Link>
            <Link href="/ai-engines/legal-regulatory-engine" className={styles.fixCard}>
              <p className={styles.fixKicker}>The framework</p>
              <p className={styles.fixTitle}>The Four Operational Intelligence Gaps</p>
              <p className={styles.fixBody}>
                Billing is one of four gaps between the AI law firms already own and the workflows where revenue is made
                — alongside regulatory alerts, knowledge capture and diligence reports.
              </p>
            </Link>
            <Link href="/ai-for-large-law-firms" className={styles.fixCard}>
              <p className={styles.fixKicker}>By firm size</p>
              <p className={styles.fixTitle}>What this looks like at your firm</p>
              <p className={styles.fixBody}>
                A 500-lawyer firm and a 12-lawyer boutique close the leak very differently. See the approach for large,
                mid-size and small firms.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — FAQ */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h2 className={styles.bodyTitle}>Billing leakage, answered</h2>
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
