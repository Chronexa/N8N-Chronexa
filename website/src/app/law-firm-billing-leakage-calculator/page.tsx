import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import LegalROICalculator from './LegalROICalculator';
import LegalROIBlog from './LegalROIBlog';
import CalcNudge from '../../components/CalcNudge';
import BookButton from '../../components/BookButton';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/law-firm-billing-leakage-calculator`;
const TITLE = 'Law Firm Realization Rate Calculator: Stop Revenue Leakage | Chronexa';
const DESCRIPTION =
  'Most firms focus on Billable Hours. Elite firms focus on Realization Rate. See exactly how much revenue your firm is losing to pre-bill write-downs and WIP leakage — and how much AI narrative coaching can recover immediately.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'attorney realization rates', 'WIP write-downs', 'law firm profitability metrics', 'legal billing hygiene',
    'law firm realization rate calculator', 'billing leakage calculator', 'pre-bill write-downs',
    'legal billing automation ROI', 'law firm time capture', 'ABA realization rate benchmark',
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
      <section className="section-muted">
        <div className="container">
          <div className={styles.heroInner}>
            <p className="eyebrow">Free Simulator — No email required</p>
            <h1 className={styles.heroTitle}>
              Law Firm Realization Rate Calculator: Stop Revenue Leakage
            </h1>
            <p className={styles.heroSub}>
              Most firms focus on Billable Hours. Elite firms focus on Realization Rate. The ABA benchmark for top-performing firms is 93%. Move the sliders to see exactly how much your firm is burning in pre-bill write-downs — and how much is immediately recoverable.
            </p>
          </div>
          <LegalROICalculator />
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

          <h3 className={styles.methodSubhead}>How to use this calculator</h3>
          <ol className={styles.howToList}>
            <li className={styles.howToItem}>Enter your fee-earning lawyer count — partners, associates and any billing staff.</li>
            <li className={styles.howToItem}>Enter your blended billable rate across that group, not just partner rate.</li>
            <li className={styles.howToItem}>Enter typical billable hours per lawyer per day — most firms land between 5 and 7.</li>
            <li className={styles.howToItem}>Read the leak and recoverable figures, and the before/after below for how automated time capture changes it.</li>
          </ol>

          <div className={styles.caveatBox}>
            <span className={styles.caveatLabel}>When this doesn&rsquo;t fully apply</span>
            <p>
              This model is built for hourly billing, where leakage converts directly into lost revenue. On fixed-fee
              or contingency work, the same failure shows up differently — as unmeasured effort and margin erosion
              you can&rsquo;t see in a billing report. If your firm mixes both, apply the calculator only to the
              hourly share of your practice; the fixed-fee share needs a different diagnostic; ask us and we&rsquo;ll
              point you to it.
            </p>
          </div>
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

      {/* 3 — SEO Article */}
      <LegalROIBlog />

      {/* 4 — Dark Audit CTA */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0b281b 0%, #0f3d28 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            display: 'grid',
            gap: '1rem',
          }}>
            <p className="eyebrow" style={{ color: 'var(--brand-green)' }}>Free Workflow Audit</p>
            <h3 style={{ fontSize: 'var(--step-3)', color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
              See what this number means for your firm specifically.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, maxWidth: '55ch', margin: 0 }}>
              In a 30-minute call, we map your firm&rsquo;s exact billing and narrative workflow, identify the top 3 write-down sources, and show you the realization rate improvement your firm can achieve before the next billing cycle.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>
              No commitment. If we can&rsquo;t find revenue worth more than it costs to recover it, you keep the analysis and owe us nothing.
            </p>
            <BookButton location="legal-article-bottom" className="btn-primary">
              Book the Free Audit Call &rarr;
            </BookButton>
          </div>
        </div>
      </section>

      {/* 5 — FAQ */}
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
      <CalcNudge
        headline="Seen a number that matters?"
        sub="We'll map exactly where your firm's write-downs are originating — in a free 30-minute audit."
        location="legal-nudge"
      />
    </>
  );
}
