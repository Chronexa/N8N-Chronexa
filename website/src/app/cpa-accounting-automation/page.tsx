import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { DocumentChase } from './CpaInteractive';
import st from '../../styles/studio.module.css';
import c from './cpa.module.css';

const SLUG = 'cpa-accounting-automation';
const TITLE = 'CPA Firm Automation & Tax Workflow Systems | Chronexa';
const DESCRIPTION =
  'Automation for CPA and accounting firms: engagement-driven document checklists, secure collection, missing-document detection and practice-system integration.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const SPINE = [
  {
    h: 'A client becomes a record, once',
    sub: 'INTAKE',
    p: 'The moment a conversation turns into an engagement, the client exists in one place with the engagement type attached. Not in an email thread, a spreadsheet and the practice-management system with three different spellings of the name.',
  },
  {
    h: 'The engagement decides the checklist',
    sub: 'REQUIREMENTS',
    p: 'A 1040 with three K-1s, a 1040-NR with a treaty position, an S-corp and an expat with foreign accounts need entirely different documents. The checklist is generated from the engagement type and last year’s return, not from a generic list everyone gets.',
  },
  {
    h: 'Collection that does not run on email attachments',
    sub: 'SECURE UPLOAD',
    p: 'A link to a client-specific vault showing exactly what is outstanding and why. Taxpayer data stops arriving as attachments on unencrypted email, which matters for the reason described further down this page.',
  },
  {
    h: 'Every upload is classified and checked',
    sub: 'CLASSIFICATION',
    p: 'What is this document, which checklist item does it satisfy, is it the right tax year, is it legible, is it complete. A 2024 K-1 uploaded against a 2025 engagement is caught on arrival rather than in review.',
  },
  {
    h: 'Missing is computed, not remembered',
    sub: 'GAP DETECTION',
    p: 'The gap between what the engagement requires and what has arrived is always current. It also distinguishes between what the client can fix and what is blocked on a third party, because chasing a client for a partnership’s late K-1 damages the relationship and changes nothing.',
  },
  {
    h: 'The follow-up names the item',
    sub: 'CLIENT CHASE',
    p: 'Specific, polite, and addressed to whoever can actually act — sometimes the client, sometimes a payroll provider or a custodian. Nobody on your team writes the fourth reminder, and no client receives "please send your documents" when what is missing is one page of a passport.',
  },
  {
    h: 'Extraction into something reviewable',
    sub: 'DATA CAPTURE',
    p: 'Figures pulled from the documents into a form a preparer can check against the source in one glance, including the statements that are not in English and the brokerage packs that run to ninety pages.',
  },
  {
    h: 'Professional review, with the questions surfaced',
    sub: 'PREPARER',
    p: 'The judgement calls — reasonable compensation, a treaty position, an exclusion versus a credit — are presented as questions with the numbers attached. The system does not decide them. It refuses to let them be discovered in April.',
  },
  {
    h: 'Status the client can see without emailing you',
    sub: 'COMMUNICATION',
    p: 'Where their return is, what is outstanding, what happens next. A meaningful share of busy-season interruption is clients asking for an update, and that is the cheapest category of work to remove.',
  },
  {
    h: 'Into the systems you already run',
    sub: 'DOWNSTREAM',
    p: 'Practice management, the tax system, the document store and the general ledger stop holding different versions of the truth. The point is not new software; it is removing the re-keying between the software you already pay for.',
  },
];

const REGIME = [
  {
    h: 'You are already regulated as a financial institution',
    p: 'Under the Gramm-Leach-Bliley Act the FTC Safeguards Rule applies to tax preparers, and the IRS reinforces it through Publication 4557. This is the regime that governs a CPA firm’s data — not HIPAA, which people attach to anything sensitive by reflex.',
  },
  {
    h: 'A written information security plan is not optional',
    p: 'A firm filing eleven or more federal returns a year is required to maintain a WISP. The IRS publishes a template in Publication 5708, and the Safeguards Rule requires a named person accountable for the programme, a written risk assessment, specific technical controls and testing of those controls.',
  },
  {
    h: 'Penalties are assessed per day, per violation',
    p: 'The FTC’s published civil penalty under the Safeguards Rule runs to tens of thousands of dollars per violation per day. We are not selling you a compliance product, but any system that touches taxpayer data has to be built as though this is true, because it is.',
  },
  {
    h: 'What that means for how we build',
    p: 'Access is scoped per user and per client, actions are logged, documents live in an encrypted store rather than in inboxes, retention follows your policy rather than accumulating forever, and the whole thing runs in accounts your firm owns so it can be audited without asking us for permission.',
  },
];

const SYSTEMS = [
  { b: 'Practice management', s: 'Firm360, Karbon and similar systems — so job status reflects what has actually arrived rather than what someone remembered to tick.' },
  { b: 'Tax preparation', s: 'UltraTax CS and comparable packages, connected so extracted figures reach the preparer without a second round of keying.' },
  { b: 'Document and delivery', s: 'The secure store and the e-signature and delivery tools your firm already uses for organisers and finished returns.' },
  { b: 'Ledger and payroll', s: 'QuickBooks, Xero and payroll providers, pulled from directly rather than requested from the client as a PDF.' },
];

const SCOPE = [
  'A map of one real engagement type, end to end, before anything is built',
  'Engagement-driven document checklists generated per client, not a shared list',
  'A secure client vault with plain-English status and outstanding items',
  'Classification, tax-year checking and legibility checking on upload',
  'Missing-document detection that separates client items from third-party ones',
  'Automated follow-up addressed to whoever can actually act',
  'Extraction into a preparer-reviewable form with the source alongside',
  'Connections to practice management, tax, ledger and document systems',
  'Client-visible status, so the update emails stop arriving',
  'Access control, logging and documentation aligned to your WISP',
];

const OUTSIDE = [
  'Preparing or filing returns. We build the system; your professionals sign the work.',
  'Acting as your WISP or your compliance function. We build to it and document what we did; your qualified individual owns it.',
  'Replacing your tax software. This connects what you run, it does not compete with it.',
  'Cleaning up years of historic client files beyond an agreed scope.',
];

const FAQS = [
  {
    q: 'Is this "AI that does the tax return"?',
    a: 'No, and any firm promising that is describing a product for the simple returns that already went to consumer software. The clients worth having are the ones whose situation is nuanced enough to need professional judgement, and judgement is the part we deliberately leave alone. What we automate is everything surrounding it: working out what documents this engagement needs, collecting them securely, checking what arrived, chasing what did not, extracting the figures into reviewable form, and keeping the client informed. The value is increasing how much professional work each preparer can get through, not replacing the professional.',
  },
  {
    q: 'Where does the time actually go in our firm?',
    a: 'Industry surveying puts client-side delay at the top. In Wolters Kluwer’s annual survey of close to two thousand US accounting firms, respondents ranked late and unprepared clients as their number one challenge, and published accounts from firms describe spending up to about a third of engagement time on document collection, with individual preparers reporting several hours a week chasing documents during season. Those are third-party figures rather than measurements of your firm — which is why the first thing we do is look at one of your real engagements rather than assume the averages apply to you.',
  },
  {
    q: 'What compliance regime does this actually fall under?',
    a: 'The Gramm-Leach-Bliley Act and the FTC Safeguards Rule, reinforced by the IRS through Publication 4557, with a written information security plan required for firms filing eleven or more returns a year and a template published in IRS Publication 5708. It is worth being blunt about what it is not: HIPAA does not apply to a CPA firm simply because the data is sensitive, and a vendor attaching that label to a tax workflow either does not know the difference or is counting on you not to. Where your firm does hold health information for a specific engagement, that is a real conversation with a real answer, and we will have it properly rather than by putting a badge on a page.',
  },
  {
    q: 'Our clients are not going to use a portal. They email everything.',
    a: 'Some will not, and a system that only works when every client behaves is not a system. So the vault is the preferred path rather than the only one: documents that arrive by email are still classified, checked and matched to the checklist, and the client sees status without having to learn anything new. What changes is that the burden of tracking moves off your staff. In practice the portal adoption problem is usually a request problem — clients ignore "please upload your documents" and respond to "we need page two of your passport and the Q4 payroll report, here is the link".',
  },
  {
    q: 'We already have Karbon or Firm360. Does this replace it?',
    a: 'No. Practice management tells you what the jobs are and where they stand; it does not go and get the documents, work out that a client uploaded last year’s K-1, or write the follow-up naming the two missing items. We build the layer that does that work and then writes the result back, so job status reflects reality rather than someone remembering to update it. If your practice-management system genuinely already does this well for your engagement types, we will say so rather than sell you a second one.',
  },
  {
    q: 'How do you handle documents that are not in English, or are scanned badly?',
    a: 'They are a normal part of this work rather than an edge case — foreign account statements, receipts for foreign tax paid, photographed passport pages. Documents are checked for legibility on arrival, so an unusable scan produces a specific re-upload request the same day instead of surfacing during review in March. Where a document is in another language, it is translated with the original kept alongside it, because the preparer needs to be able to see what the source actually said.',
  },
  {
    q: 'What does an engagement look like and what does it cost?',
    a: 'It starts with one engagement type, mapped end to end with your team — usually the one that causes the most back-and-forth rather than the most common one. That map produces a scope, a definition of what counts as working, and a fixed price, all agreed in writing before any build starts. Pricing depends on how many engagement types you want covered and which systems have to be connected, so there is no list price, and we would rather scope one type properly than sell you a firm-wide programme you cannot absorb during season.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'CPA & Accounting Firm Automation',
        serviceType: 'CPA firm workflow automation, tax document collection and practice-system integration',
        description:
          'Automation for CPA and accounting firms: engagement-driven document checklists, secure client document collection, classification and tax-year checking, missing-document detection, automated client follow-up, data extraction for preparer review, and integration with practice management, tax and ledger systems.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'United States',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'CPA & Accounting Automation', item: `${site.url}/${SLUG}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <div className={st.page}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'CPA & Accounting Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={st.hero} aria-labelledby="h">
        <div>
          <p className={st.eyebrow}><i />CPA &amp; ACCOUNTING FIRM AUTOMATION</p>
          <h1 id="h">The return was never<br /><em>the slow part.</em></h1>
          <p className={st.heroCopy}>
            Getting the documents is. Working out which ones this client needs, chasing the four that
            never arrive, spotting that one is last year&rsquo;s copy, and answering &ldquo;any update?&rdquo;
            for the third time. That work has no professional content and it consumes your season.
          </p>
          <div className={st.heroActions}>
            <BookButton location={`cpa-hero:${SLUG}`} className={st.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#spine" className={st.ghost}>See the whole spine <span aria-hidden="true">↓</span></a>
          </div>
          <p className={st.heroNote}>
            Built around the engagement, not around a generic document list.
            <span>Client names below are invented. The forms, thresholds and failure modes are real.</span>
          </p>
        </div>
        <DocumentChase />
      </section>

      <div className={st.strip} aria-label="Systems we connect">
        <span>THE PRACTICE.<br /><b>WHAT WE CONNECT.</b></span>
        <b>Karbon</b><span>Firm360</span><span>UltraTax CS</span><span>QuickBooks</span><span>Your vault</span><span>n8n</span>
      </div>

      {/* ── 01 where the time goes ───────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s1">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />01 / WHERE THE SEASON ACTUALLY GOES</p>
            <h2 id="s1">The bottleneck is not<br /><em>on your side of the desk.</em></h2>
          </div>
          <p>Every firm knows this and almost none of them have a system pointed at it. The work goes into preparing returns faster, when the delay is upstream of preparation entirely.</p>
        </div>
        <div className={c.sinks}>
          <div className={c.sink}>
            <b>#1</b>
            <span>RANKED CHALLENGE FOR US ACCOUNTING FIRMS</span>
            <p>In Wolters Kluwer&rsquo;s annual survey of close to two thousand US accounting firms, respondents put late and unprepared clients at the top of their list — above staffing, above technology, above fees.</p>
          </div>
          <div className={c.sink}>
            <b>~30%</b>
            <span>OF ENGAGEMENT TIME ON COLLECTION</span>
            <p>Published accounts from practices describe spending up to roughly a third of a typical engagement simply collecting documents. None of that time is billable in a way a client feels good about.</p>
          </div>
          <div className={c.sink}>
            <b>6–10 hrs</b>
            <span>PER PREPARER, PER WEEK, IN SEASON</span>
            <p>Reported time spent chasing documents during tax season. It is not one big block you could schedule around — it is twenty minutes at a time, across every open engagement, all season.</p>
          </div>
        </div>
        <p className={c.sourceNote}>
          These are third-party figures from industry surveys and vendor research, not measurements of
          your firm. We quote them because they match what firms describe on calls, not because we
          think they predict your numbers — which is why an engagement starts by looking at one of
          your real jobs.
        </p>
      </section>

      {/* ── 02 the spine ─────────────────────────────────────────────── */}
      <section id="spine" className={`${st.band} ${st.sunken}`} aria-labelledby="s2">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />02 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s2">Ten steps between<br /><em>&ldquo;yes&rdquo; and the review.</em></h2>
          </div>
          <p>Most firms have automated two or three of these and do the rest by hand. The compounding only starts when the chain is unbroken — a checklist is worth much less if nothing computes what is missing.</p>
        </div>
        <ol className={c.spine}>
          {SPINE.map(x => (
            <li key={x.h}>
              <h3>{x.h}<span>{x.sub}</span></h3>
              <p>{x.p}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 03 the capacity argument ─────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />03 / THE LINE WE WILL NOT CROSS</p>
            <h2 id="s3">Automate the work<br /><em>around the judgement.</em></h2>
          </div>
          <p>This distinction is the whole proposition. Get it wrong in either direction and you either buy nothing useful or you buy something a partner cannot sign their name to.</p>
        </div>
        <div className={c.split}>
          <div className={c.halfA}>
            <span>WHAT THE SYSTEM DOES NOT DO</span>
            <h3>Anything a professional has to be accountable for</h3>
            <ul className={c.splitList}>
              <li>Decide a treaty position, or whether an exclusion beats a credit</li>
              <li>Judge reasonable compensation against distributions</li>
              <li>Determine a filing position on an ambiguous fact pattern</li>
              <li>Sign, file, or tell a client what their tax outcome will be</li>
              <li>Quietly correct a figure it thinks the preparer got wrong</li>
            </ul>
          </div>
          <div className={c.halfB}>
            <span>WHAT IT DOES INSTEAD</span>
            <h3>Puts the question in front of them with the numbers attached</h3>
            <ul className={c.splitList}>
              <li>Surfaces the decision early, in January rather than in April</li>
              <li>Assembles the figures the decision depends on, with sources</li>
              <li>Records what was decided and by whom, in the file</li>
              <li>Removes the forty minutes of assembly that preceded the question</li>
              <li>Makes the same question appear automatically on the next client like it</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 04 the security regime ───────────────────────────────────── */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4">
        <div className={c.regime}>
          <div>
            <p className={st.eyebrow}><i />04 / THE REGIME THAT ACTUALLY APPLIES</p>
            <h2 id="s4">Not HIPAA.<br /><em>Something stricter about this.</em></h2>
            <p className={st.lede}>
              Vendors attach compliance badges to tax workflows almost at random. The rules that
              genuinely govern a CPA firm&rsquo;s data are specific, published, and enforced with
              daily penalties — so they are worth stating properly.
            </p>
            <div className={st.stamp}>Built to the rule.<br /><strong>Owned by your firm.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <div>
            <ul className={c.rules}>
              {REGIME.map(r => (
                <li key={r.h}>
                  <h3>{r.h}</h3>
                  <p>{r.p}</p>
                </li>
              ))}
            </ul>
            <p className={c.notThis}>
              <b>WHY WE LABOUR THE POINT</b>
              Compliance badges get scattered across pages like this one almost decoratively. If you
              are comparing vendors, ask each of them which regulation governs taxpayer data and why.
              It is a fast way to find out who has actually read anything.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05 systems ───────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s5">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />05 / WHAT WE CONNECT</p>
            <h2 id="s5">Your stack,<br /><em>talking to itself.</em></h2>
          </div>
          <p>We are not asking you to move practice-management systems during season, or ever. The gap is between the tools, and that is where we work.</p>
        </div>
        <div className={c.systems}>
          {SYSTEMS.map(x => (
            <div key={x.b} className={c.system}>
              <b>{x.b}</b>
              <span>{x.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 engagement ────────────────────────────────────────────── */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s6">
        <div className={st.scope}>
          <div>
            <p className={st.eyebrow}><i />06 / THE ENGAGEMENT</p>
            <h2 id="s6">One engagement type,<br /><em>mapped properly.</em></h2>
            <p className={st.lede}>
              Usually the one that generates the most back-and-forth rather than the most volume.
              Get that right and the second and third are far cheaper, because the hard part was
              never the software.
            </p>
          </div>
          <div>
            <ul className={st.scopeList}>
              {SCOPE.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}<b aria-hidden="true">↗</b></li>)}
            </ul>
            <details className={st.outside}>
              <summary>What sits outside the scope <span aria-hidden="true">+</span></summary>
              <ul>{OUTSIDE.map(x => <li key={x}>{x}</li>)}</ul>
            </details>
          </div>
        </div>
      </section>

      {/* ── proof ────────────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s7">
        <div className={st.proof}>
          <div>
            <p className={st.eyebrow}><i />RELEVANT WORK</p>
            <h2 id="s7">Where this came from.</h2>
          </div>
          <div>
            <h3>Document-heavy professional work, repeatedly</h3>
            <p>
              The pattern on this page — a required-documents model, classification on arrival,
              computed gaps, structured extraction and a human review step that cannot be skipped —
              came out of building intake-to-output systems for document-heavy professional work,
              including accounting and legal practices.
            </p>
            <p>
              We are deliberately not naming firms or publishing client numbers here. On a call we
              will walk you through the architecture in detail and be specific about what worked,
              what took longer than expected, and which parts we would build differently now.
            </p>
            <Link className={st.proofLink} href="/document-processing-automation">How the extraction side works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={st.close} id="talk" aria-labelledby="s8">
        <div>
          <p className={st.eyebrow}><i />07 / BEFORE THE NEXT SEASON</p>
          <h2 id="s8">Pick the engagement<br />that <em>causes the most email.</em></h2>
          <p>
            Bring one real client type — the one your team groans about — and we will map it end to
            end with you. You get a clear picture of where the hours go and whether a system would
            actually get them back, before anything is quoted.
          </p>
          <ol className={st.closeList}>
            <li>Where the back-and-forth actually starts</li>
            <li>Which steps are worth automating and which are not</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={st.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us your firm size, the engagement types that hurt, and what you run today." />
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className={st.faq} aria-labelledby="s9">
        <div>
          <p className={st.eyebrow}><i />A FEW GOOD QUESTIONS</p>
          <h2 id="s9">Before you start.</h2>
        </div>
        <div>
          {FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <nav className={st.related} aria-label="Related solutions">
        <span>Related solutions</span>
        <Link href="/document-processing-automation">Document Data Extraction ↗</Link>
        <Link href="/legal-ai-automation">Legal AI &amp; Automation ↗</Link>
        <Link href="/investment-research-automation">Investment Research Automation ↗</Link>
      </nav>
    </div>
  );
}
