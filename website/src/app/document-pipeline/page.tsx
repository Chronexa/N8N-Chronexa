import type { Metadata } from 'next';
import Link from 'next/link';
import SampleRequestForm from '../../components/SampleRequestForm';
import ScrollDepth from '../../components/ScrollDepth';
import styles from './pipeline.module.css';

/**
 * The offer page. One offer, one price, one call to action.
 *
 * This page exists because every other commercial page on the site describes a
 * capability and then asks a stranger to book a call — the highest-commitment
 * ask available, offered before any proof has landed. That path has produced
 * zero genuine enquiries. This page answers the six questions a qualified
 * visitor has in the first thirty seconds (what, who for, what problem, what it
 * costs, why trust you, what happens next) and then asks for documents instead
 * of a meeting.
 *
 * Everything here is verifiable. The ReserveStudy.com numbers are from a system
 * in production. The two unnamed engagements are described as unnamed. Nothing
 * about our own outbound appears anywhere on this page, by design.
 */

const PRICE = '$3,500';
const RUN_RATE = '$1,200';

export const metadata: Metadata = {
  title: 'Document Automation in 14 Days, Fixed Price',
  description:
    'We turn one repetitive document type — invoices, applications, statements, reports — into structured data in your systems. 14 days, $3,500 fixed. Send 10 documents and see the output first.',
  alternates: { canonical: '/document-pipeline' },
  openGraph: {
    title: 'Document Automation in 14 Days — Fixed Price',
    description:
      'One document type, into your systems, working in two weeks. See what comes out of your own documents before you commit.',
    url: '/document-pipeline',
  },
};

const PROOF = [
  {
    client: 'ReserveStudy.com',
    stat: '1,200+',
    statLabel: 'reports a year, in production',
    body: 'Analysts used to pull component ages, cost estimates and depreciation timelines out of inconsistent PDFs by hand, rebuild them in a spreadsheet model, then write the narrative. Growth meant hiring analysts. The pipeline now does the extraction and the first draft, and routes anything uncertain to a human before it ships.',
    result: 'Time per report down roughly 85%.',
    href: '/case-studies/how-reservestudy-automated-report-production-with-ai',
  },
  {
    client: 'A fintech SaaS company',
    stat: '80%',
    statLabel: 'less manual invoice handling',
    body: 'Vendors sent invoices in whatever format they liked and a person keyed each one into the accounts-payable system. The backlog grew faster than they could clear it. Now invoices are read, validated against the purchase order, and written in clean — with low-confidence fields queued for review.',
    result: 'Invoice-to-approval went from days to hours.',
    href: null,
  },
  {
    client: 'A mid-market PE firm',
    stat: '70%',
    statLabel: 'less time in the data room',
    body: 'The deal team read every document in every data room by hand, under deadline. The pipeline ingests the room, classifies what is in it, extracts the terms and figures the team actually looks for, and surfaces the exceptions instead of making them hunt.',
    result: 'Diligence review time cut by 70%.',
    href: null,
  },
];

const STEPS = [
  {
    n: 'Days 1–3',
    h: 'We agree what "working" means',
    p: 'We run 25–50 of your real documents and publish a field-by-field accuracy report — what it got right, what it got wrong, what it flagged as uncertain. That report becomes the written definition of done. You are not paying for a promise.',
  },
  {
    n: 'Days 4–10',
    h: 'We build it',
    p: 'Ingest, extract, validate against your rules, route anything the system is not confident about to a human queue, write clean records into the system you already use. In your environment if the documents are sensitive.',
  },
  {
    n: 'Days 11–13',
    h: 'It runs alongside your team',
    p: 'Live volume through both the pipeline and the existing manual process, side by side, so you can see the difference on real work before anyone relies on it.',
  },
  {
    n: 'Day 14',
    h: 'Handover',
    p: 'A 45-minute walkthrough, a short operating guide, and 30 days of support included. You own it.',
  },
];

const FAQ = [
  {
    q: 'We tried an off-the-shelf tool and it did not work on our documents. Why is this different?',
    a: 'Because those tools assume a fixed layout and real documents drift. A different vendor, a different scanner, a field that moves two centimetres, and the tool silently returns the wrong number — which is worse than returning nothing. We build for the drift, and more importantly anything the system is not confident about goes to a person to check rather than being guessed. That single design decision is why these hold up in production.',
  },
  {
    q: 'What accuracy can you guarantee?',
    a: 'None, until we have seen your documents — and you should be suspicious of anyone who answers this question before that point. What we guarantee is the process: we run 25–50 of your real documents first, publish exactly how each field performed, and you and we agree the acceptance bar in writing before the build starts. You do not pay the balance until that bar is met.',
  },
  {
    q: 'Our documents are confidential. Where does the data go?',
    a: 'Wherever you want it to. The pipeline can run entirely inside your own environment, so documents never leave your infrastructure. For the free sample, redacted documents are completely fine — we only need the layout and the field positions, not your real numbers.',
  },
  {
    q: 'What if our volume is small?',
    a: 'Then we will tell you not to do it. The arithmetic is documents per month times minutes each times what that person costs. If that number does not comfortably exceed the build, this is not worth your money and we would rather say so than take it.',
  },
  {
    q: 'What happens after the 14 days?',
    a: `Nothing you have to buy. Thirty days of support is included. After that, ${RUN_RATE} a month covers running it, monitoring it, and handling new document variants as they appear — but that is a decision to make once it is working, not now. Plenty of clients run it themselves.`,
  },
  {
    q: 'Who actually builds it?',
    a: 'The same engineers you talk to. We are a small senior team, not a sales layer in front of a delivery pool. The person who reviews your sample documents is the person who builds the pipeline.',
  },
];

export default function DocumentPipelinePage() {
  return (
    <>
      <ScrollDepth pageType="offer" />

      {/* Hero — the six questions, answered above the fold. */}
      <section className={`section-dark ${styles.hero}`}>
        <div className="container">
          <p className="eyebrow">Fixed scope · Fixed price · 14 days</p>
          <h1 className={styles.h1}>
            Stop paying people to retype PDFs.
          </h1>
          <p className={styles.sub}>
            If someone on your team opens a document and keys what it says into another system, that job can
            mostly go away. We build the pipeline that reads it, checks it, and puts the data where your team
            already works — and flags anything it is unsure about instead of guessing.
          </p>

          <div className={styles.priceRow}>
            <div className={styles.priceBox}>
              <span className={styles.priceNum}>{PRICE}</span>
              <span className={styles.priceLabel}>fixed, 50% up front</span>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.priceNum}>14 days</span>
              <span className={styles.priceLabel}>from your sample documents</span>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.priceNum}>1</span>
              <span className={styles.priceLabel}>document type, one destination</span>
            </div>
          </div>

          <a href="#start" className="btn-primary">Send 10 documents, see the output</a>
          <p className={styles.heroFine}>
            Free. Two working days. No call required — we look at your documents first.
          </p>
        </div>
      </section>

      {/* Proof, immediately. A stranger decides "is this real" before anything else. */}
      <section className="section-light section-major">
        <div className="container">
          <p className="eyebrow">Running in production</p>
          <h2 className={styles.h2}>Three systems doing this today.</h2>
          <div className={styles.proofGrid}>
            {PROOF.map((p) => (
              <article key={p.client} className={styles.proofCard}>
                <div className={styles.proofStat}>
                  <span className="display-num">{p.stat}</span>
                  <span>{p.statLabel}</span>
                </div>
                <h3>{p.client}</h3>
                <p>{p.body}</p>
                <p className={styles.proofResult}>{p.result}</p>
                {p.href && (
                  <Link href={p.href} className="link-arrow">
                    Read the full case study <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it runs. */}
      <section className="section-muted section-major">
        <div className="container">
          <p className="eyebrow">What the two weeks look like</p>
          <h2 className={styles.h2}>You see real numbers on your own documents before the build starts.</h2>
          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className={styles.stepN}>{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scope — saying no is what makes the price believable. */}
      <section className="section-light section-major">
        <div className="container">
          <div className={styles.scopeGrid}>
            <div>
              <h2 className={styles.h3}>What you get</h2>
              <ul className={styles.list}>
                <li>A field-by-field accuracy report on your real documents, before you commit</li>
                <li>The working pipeline — ingest, extract, validate, route</li>
                <li>A human review queue for anything the system is not confident about</li>
                <li>Data delivered into one system you already use</li>
                <li>Deployment inside your own environment if you want it</li>
                <li>An operating guide and a 45-minute handover</li>
                <li>30 days of support after go-live</li>
              </ul>
            </div>
            <div>
              <h2 className={styles.h3}>What is not included</h2>
              <ul className={`${styles.list} ${styles.listOut}`}>
                <li>A second document type — that is a second engagement</li>
                <li>A second destination system</li>
                <li>Building or replacing your existing software</li>
                <li>Handwriting recognition</li>
                <li>Any accuracy promise made before we have seen your documents</li>
                <li>Your own model and API running costs, which we estimate up front</li>
                <li>Regulatory sign-off or compliance certification</li>
              </ul>
            </div>
          </div>
          <p className={styles.scopeNote}>
            One document type. That constraint is the reason this is two weeks and a fixed number rather than a
            discovery phase and an estimate.
          </p>
        </div>
      </section>

      {/* Objections. */}
      <section className="section-muted section-major">
        <div className="container">
          <h2 className={styles.h2}>The questions people actually ask.</h2>
          <div className={styles.faq}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* The ask. */}
      <section id="start" className={`section-dark section-major ${styles.cta}`}>
        <div className="container">
          <div className={styles.ctaGrid}>
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className={styles.h2}>Send us 10 documents.</h2>
              <p className={styles.sub}>
                We run them and send back what comes out, plus an honest read on where it struggles — within two
                working days, at no cost. Redacted documents are fine; we only need the layout and the fields.
              </p>
              <p className={styles.sub}>
                If the volume does not justify a build, we will tell you that rather than sell you one.
              </p>
            </div>
            <div className={styles.formPanel}>
              <SampleRequestForm source="document-pipeline" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
