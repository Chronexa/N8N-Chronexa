import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '../../components/CtaBand';
import { site } from '../../lib/site';
import CapacityCalculator from './CapacityCalculator';
import CPAArticle from './CPAArticle';
import CalcNudge from '../../components/CalcNudge';
import styles from '../../components/calculators/calculators.module.css';

const URL = `${site.url}/cpa-tax-season-capacity-calculator`;
const TITLE = 'CPA Firm Capacity Planner: Model Your Tax Season Bottleneck | Chronexa';
const DESCRIPTION =
  'Hiring more juniors will not solve your capacity problem. You need to fix the Partner Review Bottleneck. Enter your partner count, hours, and rework rate \u2014 calculate your firm\u2019s true max throughput and the revenue you are leaving on the table.';


export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'tax season staffing model', 'CPA firm capacity planning', 'tax return margin analysis',
    'reducing review loops', 'CPA firm throughput simulator', 'partner review bottleneck',
    'accounting firm capacity', 'tax season automation ROI', 'rework loop rate CPA',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where do the 40% and 3× benchmarks come from?',
    a: 'Both are published benchmarks from Filed, an AI tax-document automation platform, cited on our CPA & Tax Engine page: roughly 40% less prep time per return, and up to 3× busy-season capacity industry-wide. We don&rsquo;t just borrow the number — a 12-person CPA firm we automated hit similar territory first-hand: tax-season overtime hours cut from 312 to 189 (39%), admin time down roughly 40%, document collection dropping from 47 days to 16. The calculator never assumes the 3× ceiling — it models a conservative realization rate that scales with how manual your current process is, so the business case never depends on a best-case number.',
  },
  {
    q: 'Does this include review time, or just prep?',
    a: 'Both, shown separately. Prep — document chasing, classification, data entry and population — drives the capacity number above. Review is modelled on its own: with a side-by-side dashboard where every extracted value links to its source document, CPA review typically drops from 3–4 hours to 15–25 minutes per return. That review-time saving is real and shown in the calculator, but it&rsquo;s added on top of the capacity number, never folded into it — which keeps the headline conservative rather than double-counted.',
  },
  {
    q: 'We are a small firm — does the math still hold?',
    a: 'Yes, with one deliberate constraint built in: the calculator caps how much of the freed prep time your current headcount can realistically absorb before review and sign-off — not prep — becomes the bottleneck. At a firm with plenty of preparers relative to volume, that ceiling never binds and the math scales cleanly. At a small firm with high volume per preparer, the calculator will show your capacity gain leveling off — that is exactly the small-firm situation, where hiring seasonal staff is hardest, made visible in the number instead of hidden behind a flat percentage.',
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
      <section className="section-muted">
        <div className="container">
          <div className={styles.heroInner}>
            <p className="eyebrow">Free Simulator — No email required</p>
            <h1 className={styles.heroTitle}>CPA Firm Capacity Planner: Model Your Tax Season Bottleneck</h1>
            <p className={styles.heroSub}>
              Hiring more juniors won&rsquo;t solve your capacity problem. The constraint is your partners&rsquo; review time. Move the sliders to calculate your firm&rsquo;s true max throughput and the exact revenue your current rework loop is preventing you from capturing.
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
            them (the published benchmark for automated intake, classification, extraction and pre-fill). That freed
            time only converts into added returns up to what your preparer headcount can actually absorb — beyond
            that, review and sign-off time, not prep, is the real constraint. Within that ceiling, the realization rate
            scales with how manual your process is today: firms with more prep hours per return have more room for
            automation to compress. Capacity revenue is simply the added returns at your average fee.
          </p>
          <pre className={styles.formula}>
{`hours freed        = returns × prep hours/return × 40%
capacity ceiling   = preparers × 200h   (headcount limit before review/sign-off binds)
realization rate   = 45%, scaled to your prep hours vs. a 4h reference
added returns      = min(hours freed, capacity ceiling) ÷ (prep hours × 60%) × realization rate
capacity revenue   = added returns × average fee

review hours saved = returns × (your review hours/return − 20 min)   (added on top, not counted above)`}
          </pre>
          <p className={styles.prose}>
            With the defaults — a 10-preparer firm filing 600 returns at 4 prep hours and a $700 average fee — that is
            180 additional returns and $126,000 in added capacity revenue per season: the same worked example
            published on our CPA &amp; Tax Engine page. &ldquo;Prep hours&rdquo; is not one opaque number — it&rsquo;s four
            stages, each shown in the calculator: documents pulled from your client portal automatically (no one chases
            them by hand), classified by type, extracted field-by-field with a verification pass, and pushed into your
            tax software as a 90–94% pre-filled return. The preparer starts from a punch-list, not a blank organizer.
            Review is the fifth stage and the most concrete one: a side-by-side dashboard that takes review from
            hours to minutes per return, shown separately so it&rsquo;s never double-counted into the capacity number.
          </p>

          <h3 className={styles.methodSubhead}>How to use this calculator</h3>
          <ol className={styles.howToList}>
            <li className={styles.howToItem}>Enter your preparer headcount and returns filed per season.</li>
            <li className={styles.howToItem}>Enter your average prep hours per return — intake through population, before review.</li>
            <li className={styles.howToItem}>Enter your average review hours per return today, and your average fee.</li>
            <li className={styles.howToItem}>Read the capacity number, the review-time bar, and the before/after below for what actually changes.</li>
          </ol>

          <div className={styles.caveatBox}>
            <span className={styles.caveatLabel}>When this doesn&rsquo;t fully apply</span>
            <p>
              This model is built around individual and small-business return volume, where documents follow
              recognizable patterns — W-2s, 1099s, K-1s, brokerage statements. Firms whose practice is mostly complex
              trusts, estates or first-year business returns — where judgment, not data entry, dominates the time —
              will see a smaller version of this gain. Firms already running a lean, largely paperless process today
              have less headroom left to compress.
            </p>
          </div>
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

      {/* 4 — SEO Article + Audit CTAs */}
      <CPAArticle />

      {/* 5 — FAQ */}
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
      <CalcNudge
        headline="Seen a number that stops you?"
        sub="We'll model your exact review bottleneck and show the unlock — free 30-min audit, no commitment."
        location="cpa-nudge"
      />
    </>
  );
}
