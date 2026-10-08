import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { PipelineBench } from './DocInteractive';
import st from '../../styles/studio.module.css';
import c from './doc.module.css';

const SLUG = 'document-processing-automation';
const TITLE = 'Document Processing & Data Extraction Services | Chronexa';
const DESCRIPTION =
  'Document processing services that turn PDFs, scans and forms into checked data: classification, extraction, validation, confidence scores and human review.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const BREAKERS = [
  { n: '01', h: 'Layout complexity', p: 'Merged cells, nested tables, multi-column pages, footnotes that look like values. The text extracts fine; the relationships between it do not.' },
  { n: '02', h: 'Handwriting', p: 'Field notes, signatures, a figure written in a margin. Present in more business documents than anyone plans for, and absent from most test sets.' },
  { n: '03', h: 'Cross-page references', p: 'A table continuing onto page four, a total that lives three pages from its line items, a credit note that changes an invoice elsewhere in the batch.' },
  { n: '04', h: 'Scan quality variation', p: 'The same form arrives clean from one client, photographed at an angle from another, and faxed at 150 dpi from a third. One pipeline has to survive all three.' },
  { n: '05', h: 'Domain conventions', p: 'A field that means one thing in your industry and something else everywhere else. No general model knows your conventions, and no benchmark tests them.' },
];

const CHAIN = [
  { n: 'i', h: 'Ingest', p: 'From email, a portal, a shared drive, a scanner or an API — including the folder somebody drags in at the last minute.' },
  { n: 'ii', h: 'Assess', p: 'Is this legible, complete and the right document at all? Judged before anything is extracted, so an unusable page produces a request rather than a wrong value.' },
  { n: 'iii', h: 'Classify', p: 'What is this, which schema applies, is it a duplicate, is it superseded by a later version. Nobody labels documents in the real world.' },
  { n: 'iv', h: 'Extract', p: 'Fields, tables and text pulled with the layout understood rather than flattened into a stream of words.' },
  { n: 'v', h: 'Validate', p: 'Do the line items sum to the total, does the tax recompute, does the date make sense, does this match the prior-year record. Most errors surface here, not in extraction.' },
  { n: 'vi', h: 'Structure', p: 'Merged cells resolved, continuations stitched across pages, footnotes separated from figures, rows counted against the document.' },
  { n: 'vii', h: 'Normalise', p: 'Dates, currencies, units, names and identifiers reduced to one consistent form, so downstream systems are not each guessing differently.' },
  { n: 'viii', h: 'Score', p: 'A confidence value per field, not per document. A 92% document can still contain one field nobody should trust.' },
  { n: 'ix', h: 'Review', p: 'Anything below threshold, anything contradictory and anything in a category you flagged reaches a person, with the source page beside it.' },
  { n: 'x', h: 'Organise', p: 'Filed into a structure and schema that makes sense to your business, rather than a flat bucket that becomes its own problem in a year.' },
  { n: 'xi', h: 'Index & cite', p: 'Made retrievable so an AI system can answer from it and point at the exact page it used. This is what "AI-ready" actually means.' },
  { n: 'xii', h: 'Route', p: 'Into the ledger, the CRM, the compliance workflow, the report or the next system — with provenance carried along, not left behind.' },
];

const REVIEW = [
  { h: 'Confidence is per field, not per document', p: 'A document-level score hides the one value that matters. Scoring each field means a review queue that contains twelve fields rather than four hundred documents, and a reviewer who knows exactly where to look.' },
  { h: 'Thresholds are yours, and they differ by field', p: 'A supplier name being slightly wrong is an annoyance. A bank account number being slightly wrong is a fraud incident. The same threshold for both is how pipelines cause damage, so we set them per field with you.' },
  { h: 'Provenance travels with the value', p: 'Every extracted figure keeps which document, which version, which page and when it was read. When someone challenges a number nine months later, that question has an answer rather than an investigation.' },
  { h: 'The system is allowed to refuse', p: 'An illegible page produces a specific re-request the same day. A classifier that is unsure holds the file rather than guessing it into the wrong pile. Refusing is cheaper than being confidently wrong.' },
  { h: 'Corrections train the next run', p: 'What a reviewer fixes is captured, so the same failure does not arrive every month forever. The measure of a good pipeline is that the review queue shrinks.' },
];

const SCOPE = [
  'A read of a real sample of your documents, including the bad ones',
  'Document classification, deduplication and version ranking at intake',
  'Legibility and completeness assessment before extraction',
  'Layout-aware extraction covering tables, multi-column pages and handwriting where present',
  'Validation rules built from your business logic, not generic checks',
  'Normalisation of dates, currencies, units, names and identifiers',
  'Per-field confidence scoring with thresholds agreed field by field',
  'A review queue that shows the source page beside the extracted value',
  'Indexing for retrieval with citations, so the output is genuinely AI-ready',
  'Routing into your ledger, CRM, database or downstream workflow, with provenance',
];

const OUTSIDE = [
  'Guaranteeing a headline accuracy percentage before seeing your documents. Anyone quoting one is quoting a benchmark, not your files.',
  'Data-entry outsourcing. We build the system; we are not a keying vendor.',
  'Rekeying your historic archive beyond an agreed scope. Backfiles are their own project with their own economics.',
  'Deciding what your extracted data means. We deliver correct structured data; the business judgement stays yours.',
];

const FAQS = [
  {
    q: 'What is document processing, and what is intelligent document processing?',
    a: 'Document processing is turning incoming documents (invoices, forms, contracts, statements, scans) into data a business can use: sorting them, reading the fields, checking them and filing the result in the right system. Intelligent document processing adds AI so it can cope with layouts it has not seen before, and with documents that mix text, tables and handwriting. What matters in practice is not the reading but the checking: confidence scores, validation against your rules and a person reviewing anything uncertain.',
  },
  {
    q: 'How is this different from outsourced data entry?',
    a: 'Outsourced data entry sends documents to a vendor whose staff key the values by hand. Here the reading is done by software inside your own systems, every field is checked against your rules, and only uncertain items go to a person. It is usually faster and keeps your documents in your environment, but a team of people can still be the better answer for rare or highly irregular documents, and we will say so.',
  },
  {
    q: 'Is this just OCR with a nicer wrapper?',
    a: 'No, and the distinction is the entire point of this page. OCR turns pixels into characters, which is the part that has largely been solved. What has not been solved is turning a document into data you can rely on: working out what the document is, whether it is a duplicate or a superseded draft, whether the table on page four continues from page three, whether the totals actually reconcile, which fields are uncertain enough to need a person, and how to keep provenance so a number can be defended a year later. In our experience the extraction step is rarely where a document pipeline fails. It fails at classification, validation or structure — all of which sit either side of OCR.',
  },
  {
    q: 'Should we use an LLM or traditional OCR?',
    a: 'Most production pipelines in 2026 run both, and that is what we build. Multimodal models — Gemini, GPT-4o, Claude and similar — measurably outperform classical OCR on degraded scans, complex tables and handwriting, by roughly ten to fifteen accuracy points on difficult inputs. Classical engines such as AWS Textract, Google Document AI and Tesseract remain better on clean, consistent, high-volume documents where speed, cost and deterministic output matter more than handling the awkward cases. Routing each document to the right engine, and reconciling when they disagree, is a large part of the engineering. Anyone telling you it is one or the other is selling the one they have.',
  },
  {
    q: 'What accuracy can you guarantee?',
    a: 'Not a number, and you should be wary of anyone who offers one before seeing your files. Published benchmarks predict remarkably little about real documents, because the characteristics that break extraction in practice — layout complexity, handwriting, references across pages, varying scan quality and domain-specific conventions — are precisely what standard evaluation sets avoid. What we will commit to is measured on your documents: we run a sample, report per-field accuracy on your actual files, and agree thresholds from that. A pipeline that is 99% accurate on the fields that do not matter and 90% on the one that does is a bad pipeline with a good headline.',
  },
  {
    q: 'Our documents are not in English, or not only in English.',
    a: 'That is normal and it is worth correcting a common piece of shorthand: mainstream OCR engines have supported a hundred-plus languages for years, so language alone is rarely the blocker. What actually causes trouble is the combination — a regional script in an unusual layout, at poor scan quality, with domain conventions no general model has seen, and often mixed languages within one document. We handle those together rather than treating language as a checkbox, and where a document is translated we keep the original alongside so a reviewer can always see what the source really said.',
  },
  {
    q: 'What does "AI-ready" actually mean?',
    a: 'It means the documents can be retrieved from and cited, not just stored. In practice: classified and organised into a schema that reflects your business, chunked in a way that respects the document\'s own structure rather than cutting tables in half, indexed so a query returns the right passage, and carrying enough provenance that an answer can point to a specific page of a specific version. Most "we put our documents into AI" projects fail at exactly this layer — the files were uploaded, but nothing was structured, so the AI answers confidently from the wrong version of a contract.',
  },
  {
    q: 'How much human review is there, and does it ever go away?',
    a: 'At the start, more than people expect — and that is deliberate, because early review is how thresholds get calibrated on your real documents rather than on an assumption. It then falls as validation rules tighten and corrections feed back. It does not go to zero, and we would be suspicious of a system that claimed it had: some documents genuinely are ambiguous, and the right behaviour is to surface them. The number we care about is how much of the queue is genuine ambiguity rather than the same avoidable failure arriving every month.',
  },
  {
    q: 'What does an engagement look like?',
    a: 'It starts with your documents, not a workshop. Send a representative sample — deliberately including the worst ones, because those decide the architecture — and we will tell you where a pipeline would break, what per-field accuracy looks like on your actual files, and which parts are worth automating. That produces a scope, a definition of what counts as working, and a fixed price before any build starts.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'Document Data Extraction & Document Intelligence',
        serviceType: 'Document data extraction, intelligent document processing and document intelligence engineering',
        description:
          'Document intelligence engineering: intake and legibility assessment, document classification and deduplication, layout-aware extraction of fields and tables, validation against business rules, normalisation, per-field confidence scoring, human review, indexing with citations and provenance, and routing into downstream systems.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'Document Data Extraction', item: `${site.url}/${SLUG}` },
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
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Document Data Extraction', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={st.hero} aria-labelledby="h">
        <div>
          <p className={st.eyebrow}><i />DOCUMENT DATA EXTRACTION &amp; DOCUMENT INTELLIGENCE</p>
          <h1 id="h">Reading the text was<br /><em>never the hard part.</em></h1>
          <p className={st.heroCopy}>
            Knowing what the document is, whether it is the current version, whether the table
            continues on page four, whether the totals reconcile, and which single field nobody
            should trust — that is the hard part. It is also where document projects quietly go
            wrong for months without erroring once.
          </p>
          <div className={st.heroActions}>
            <BookButton location={`doc-hero:${SLUG}`} className={st.primary}>Send us a sample <span aria-hidden="true">↗</span></BookButton>
            <a href="#chain" className={st.ghost}>See the whole chain <span aria-hidden="true">↓</span></a>
          </div>
          <p className={st.heroNote}>
            Invoices, tax forms, statements, contracts, field notes, spreadsheets, presentations.
            <span>Including the ones photographed at an angle, which is usually the real test.</span>
          </p>
        </div>
        <PipelineBench />
      </section>

      <div className={st.strip} aria-label="What we work with">
        <span>THE INPUTS.<br /><b>WHAT ARRIVES.</b></span>
        <b>Scanned PDFs</b><span>Photos</span><span>Tables</span><span>Handwriting</span><span>Spreadsheets</span><span>Email</span>
      </div>

      {/* ── 01 why benchmarks mislead ────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s1">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />01 / WHY THE DEMO ALWAYS WORKS</p>
            <h2 id="s1">Five things that break<br /><em>every accuracy claim.</em></h2>
          </div>
          <p>Vendor benchmarks are run on documents that have none of these. Your documents have several. That gap is why a 99% demo becomes a 70% reality on your files.</p>
        </div>
        <div className={c.breakers}>
          {BREAKERS.map(b => (
            <article key={b.n} className={c.breaker}>
              <b>{b.n}</b>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </article>
          ))}
        </div>
        <p className={c.sourceNote}>
          This is not our opinion. Independent 2026 benchmarking of document extraction makes the
          point directly: benchmark scores predict little about behaviour on documents with exactly
          these five characteristics, because standard evaluation sets exclude them. Which is why we
          ask for your worst documents before quoting anything, rather than your cleanest.
        </p>
      </section>

      {/* ── 02 the chain ─────────────────────────────────────────────── */}
      <section id="chain" className={`${st.band} ${st.sunken}`} aria-labelledby="s2">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />02 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s2">Twelve stages.<br /><em>OCR is one of them.</em></h2>
          </div>
          <p>Most tools sell you stage four and leave you the other eleven. The eleven are where the cost, the errors and the eventual trust in the output all come from.</p>
        </div>
        <div className={c.chain}>
          {CHAIN.map(x => (
            <article key={x.h} className={c.link}>
              <span>{x.n}</span>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
            </article>
          ))}
        </div>
        <p className={c.chainNote}>
          Not every project needs all twelve, and we will tell you which ones yours does not. But the
          order matters: indexing documents for AI before they have been classified and validated
          produces a system that answers fluently from the wrong version of a contract, which is
          worse than having no system at all.
        </p>
      </section>

      {/* ── 03 engines ───────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />03 / THE ENGINE QUESTION</p>
            <h2 id="s3">LLM or OCR is<br /><em>the wrong question.</em></h2>
          </div>
          <p>They fail in opposite directions, which is exactly why production pipelines in 2026 run both and route between them.</p>
        </div>
        <div className={c.engines}>
          <div className={c.engine}>
            <span>CLASSICAL OCR &amp; DOCUMENT AI</span>
            <h3>Textract, Google Document AI, Tesseract</h3>
            <ul>
              <li>Faster and materially cheaper at volume</li>
              <li>Deterministic — the same input gives the same output, every time</li>
              <li>Strong on clean, consistent, high-volume forms</li>
              <li>Degrades badly on poor scans, merged cells and handwriting</li>
              <li>Will not invent a value it cannot read, which is a genuine virtue</li>
            </ul>
          </div>
          <div className={c.engine}>
            <span>MULTIMODAL MODELS</span>
            <h3>Gemini, GPT-4o, Claude and similar</h3>
            <ul>
              <li>Roughly 10–15 accuracy points better on degraded inputs</li>
              <li>Handles complex tables, handwriting and unusual layouts</li>
              <li>Understands context, so it can tell a footnote from a figure</li>
              <li>Non-deterministic, slower and more expensive per page</li>
              <li>Will produce a plausible value where it should have refused</li>
            </ul>
          </div>
        </div>
        <p className={c.verdict}>
          So we route by document, not by preference. Clean high-volume forms go the cheap
          deterministic route; awkward, degraded and unusual documents go to the model. Where both
          run and <b>disagree, that disagreement is itself the signal</b> — it is one of the most
          reliable ways we have found to catch a wrong value before it reaches your ledger.
        </p>
      </section>

      {/* ── 04 review ────────────────────────────────────────────────── */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4">
        <div className={c.review}>
          <div>
            <p className={st.eyebrow}><i />04 / THE PART THAT MAKES IT TRUSTED</p>
            <h2 id="s4">Being wrong quietly<br /><em>is the real failure.</em></h2>
            <p className={st.lede}>
              A pipeline that errors is annoying. A pipeline that produces confident, plausible,
              wrong numbers for eight months is expensive — and it is the far more common outcome,
              because nothing alerts anyone.
            </p>
            <div className={st.stamp}>Score the field.<br /><strong>Not the document.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <ol className={c.reviewList}>
            {REVIEW.map(r => (
              <li key={r.h}>
                <div>
                  <h3>{r.h}</h3>
                  <p>{r.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 05 engagement ────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s5">
        <div className={st.scope}>
          <div>
            <p className={st.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">Send the documents<br /><em>you are embarrassed by.</em></h2>
            <p className={st.lede}>
              The clean ones tell us nothing. The photographed, faxed, half-legible, wrongly-filed
              ones decide the architecture — and they are the ones a vendor demo will never
              be run on.
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
      <section className={st.band} aria-labelledby="s6">
        <div className={st.proof}>
          <div>
            <p className={st.eyebrow}><i />RELEVANT WORK</p>
            <h2 id="s6">At volume, in production.</h2>
          </div>
          <div>
            <h3>Site photographs and PDFs into 50-page client reports, 1,200+ times a year</h3>
            <p>
              A US property-services firm produces more than twelve hundred reports a year from
              thousands of files per engagement — photographs, PDFs, spreadsheets and field notes.
              The system classifies, extracts, models and assembles the report; an analyst reviews
              the exceptions and owns the final judgement.
            </p>
            <p>
              Every design decision described on this page came out of work like that rather than
              from a whitepaper: per-field confidence exists because document-level scores hid the
              one value that mattered, and provenance exists because someone eventually asks where
              a number came from.
            </p>
            <Link className={st.proofLink} href="/case-studies/how-reservestudy-automated-report-production-with-ai">Read the report-production case study <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={st.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={st.eyebrow}><i />06 / START WITH A SAMPLE</p>
          <h2 id="s7">We will tell you<br />where it <em>would break.</em></h2>
          <p>
            Send a representative batch — deliberately including the bad ones. You get a straight
            read on per-field accuracy against your own documents, which stages would need building,
            and whether this is worth automating at your volume.
          </p>
          <ol className={st.closeList}>
            <li>What your documents actually do to a pipeline</li>
            <li>Per-field accuracy on your files, not a benchmark</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={st.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us what the documents are, roughly how many, and where the output has to go." />
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className={st.faq} aria-labelledby="s8">
        <div>
          <p className={st.eyebrow}><i />A FEW GOOD QUESTIONS</p>
          <h2 id="s8">Before you start.</h2>
        </div>
        <div>
          {FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <nav className={st.related} aria-label="Related solutions">
        <span>Related solutions</span>
        <Link href="/cpa-accounting-automation">CPA &amp; Accounting Automation ↗</Link>
        <Link href="/legal-ai-automation">Legal AI &amp; Automation ↗</Link>
        <Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link>
      </nav>
    </div>
  );
}
