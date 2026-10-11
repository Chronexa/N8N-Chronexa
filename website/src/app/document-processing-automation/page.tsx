import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import ArtPlate from '../../components/visual/ArtPlate';
import {
  AlsoExplore, AnswerCard, Deliverables, DemoStage, Label, ServiceClose, ServiceFaq, ServiceHero, ServiceSchema,
  Story, Title, WontBuild, serviceMetadata, svc,
} from '../../components/service/ServiceParts';
import { ART } from '../../lib/art';
import { PipelineBench } from './DocInteractive';
import c from './doc.module.css';

/**
 * Document data extraction (rebuilt 2026-10-11 on the service design system). Every argument from the
 * studio version is kept: five things that break accuracy claims, the twelve-stage chain, the engine
 * question, per-field review, and the real report-production proof. Art: the reader in the daisies.
 */

const SLUG = 'document-processing-automation';
const TITLE = 'Document Processing & Data Extraction Services | Chronexa';
const DESCRIPTION =
  'Document processing services that turn PDFs, scans and forms into checked data: classification, extraction, validation, confidence scores and human review.';
const HERO = ART['reader-daisies'];

export const metadata = serviceMetadata({ slug: SLUG, title: TITLE, description: DESCRIPTION, art: HERO.kind === 'image' ? HERO.src : HERO.poster });

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
  { q: 'What is document processing, and what is intelligent document processing?', a: 'Document processing is turning incoming documents (invoices, forms, contracts, statements, scans) into data a business can use: sorting them, reading the fields, checking them and filing the result in the right system. Intelligent document processing adds AI so it can cope with layouts it has not seen before, and with documents that mix text, tables and handwriting. What matters in practice is not the reading but the checking: confidence scores, validation against your rules and a person reviewing anything uncertain.' },
  { q: 'How is this different from outsourced data entry?', a: 'Outsourced data entry sends documents to a vendor whose staff key the values by hand. Here the reading is done by software inside your own systems, every field is checked against your rules, and only uncertain items go to a person. It is usually faster and keeps your documents in your environment, but a team of people can still be the better answer for rare or highly irregular documents, and we will say so.' },
  { q: 'Is this just OCR with a nicer wrapper?', a: 'No, and the distinction is the entire point of this page. OCR turns pixels into characters, which is the part that has largely been solved. What has not been solved is turning a document into data you can rely on: working out what the document is, whether it is a duplicate or a superseded draft, whether the table on page four continues from page three, whether the totals actually reconcile, which fields are uncertain enough to need a person, and how to keep provenance so a number can be defended a year later. In our experience the extraction step is rarely where a document pipeline fails. It fails at classification, validation or structure — all of which sit either side of OCR.' },
  { q: 'Should we use an LLM or traditional OCR?', a: 'Most production pipelines in 2026 run both, and that is what we build. Multimodal models — Gemini, GPT-4o, Claude and similar — measurably outperform classical OCR on degraded scans, complex tables and handwriting, by roughly ten to fifteen accuracy points on difficult inputs. Classical engines such as AWS Textract, Google Document AI and Tesseract remain better on clean, consistent, high-volume documents where speed, cost and deterministic output matter more than handling the awkward cases. Routing each document to the right engine, and reconciling when they disagree, is a large part of the engineering. Anyone telling you it is one or the other is selling the one they have.' },
  { q: 'What accuracy can you guarantee?', a: 'Not a number, and you should be wary of anyone who offers one before seeing your files. Published benchmarks predict remarkably little about real documents, because the characteristics that break extraction in practice — layout complexity, handwriting, references across pages, varying scan quality and domain-specific conventions — are precisely what standard evaluation sets avoid. What we will commit to is measured on your documents: we run a sample, report per-field accuracy on your actual files, and agree thresholds from that. A pipeline that is 99% accurate on the fields that do not matter and 90% on the one that does is a bad pipeline with a good headline.' },
  { q: 'Our documents are not in English, or not only in English.', a: 'That is normal and it is worth correcting a common piece of shorthand: mainstream OCR engines have supported a hundred-plus languages for years, so language alone is rarely the blocker. What actually causes trouble is the combination — a regional script in an unusual layout, at poor scan quality, with domain conventions no general model has seen, and often mixed languages within one document. We handle those together rather than treating language as a checkbox, and where a document is translated we keep the original alongside so a reviewer can always see what the source really said.' },
  { q: 'What does "AI-ready" actually mean?', a: 'It means the documents can be retrieved from and cited, not just stored. In practice: classified and organised into a schema that reflects your business, chunked in a way that respects the document\'s own structure rather than cutting tables in half, indexed so a query returns the right passage, and carrying enough provenance that an answer can point to a specific page of a specific version. Most "we put our documents into AI" projects fail at exactly this layer — the files were uploaded, but nothing was structured, so the AI answers confidently from the wrong version of a contract.' },
  { q: 'How much human review is there, and does it ever go away?', a: 'At the start, more than people expect — and that is deliberate, because early review is how thresholds get calibrated on your real documents rather than on an assumption. It then falls as validation rules tighten and corrections feed back. It does not go to zero, and we would be suspicious of a system that claimed it had: some documents genuinely are ambiguous, and the right behaviour is to surface them. The number we care about is how much of the queue is genuine ambiguity rather than the same avoidable failure arriving every month.' },
  { q: 'What does an engagement look like?', a: 'It starts with your documents, not a workshop. Send a representative sample — deliberately including the worst ones, because those decide the architecture — and we will tell you where a pipeline would break, what per-field accuracy looks like on your actual files, and which parts are worth automating. That produces a scope, a definition of what counts as working, and a fixed price before any build starts.' },
];

const INPUTS = ['Scanned PDFs', 'Photos', 'Tables', 'Handwriting', 'Spreadsheets', 'Email'];

export default function Page() {
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Document Data Extraction', design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <ServiceSchema slug={SLUG} name="Document Data Extraction & Document Intelligence"
        serviceType={['Document data extraction', 'Intelligent document processing', 'Document intelligence engineering']}
        description="Document intelligence engineering: intake and legibility assessment, document classification and deduplication, layout-aware extraction of fields and tables, validation against business rules, normalisation, per-field confidence scoring, human review, indexing with citations and provenance, and routing into downstream systems."
        faqs={FAQS} />

      <ServiceHero
        slug={SLUG} eyebrow="DOCUMENT DATA EXTRACTION & DOCUMENT INTELLIGENCE"
        h1={['Reading the text was', 'never the hard part.']}
        sub="Knowing what the document is, whether it is the current version, whether the table continues on page four, whether the totals reconcile, and which single field nobody should trust. That is the hard part, and it is where document projects quietly go wrong for months without erroring once."
        art={HERO.kind === 'image' ? HERO.src : HERO.poster} artAlt={HERO.alt} artPos="50% 30%" tall
        cta="Send us a sample" seeLabel="Watch a document break"
        offer={['Sample read free', 'Accuracy measured on your files', 'Fixed price in writing']}
      />
      <AnswerCard items={[
        ['What it is', 'Software that turns PDFs, scans and forms into checked, structured data inside your systems.'],
        ['Who it’s for', 'Teams keying data from invoices, tax forms, statements, contracts or field notes.'],
        ['What you get', 'Classification, extraction, validation, per-field confidence and a review queue that shows the source page.'],
        ['How it’s priced', 'Sample read free. A scope and a fixed price in writing before any build starts.'],
        ['How fast', 'A straight read on your sample first, then the pipeline ships in stages.'],
      ]} />

      <div className={c.inputs} aria-label="What arrives">
        <span>The inputs.<b>What arrives.</b></span>
        <ul>{INPUTS.map((i) => <li key={i}>{i}</li>)}</ul>
        <p>Invoices, tax forms, statements, contracts, field notes, spreadsheets, presentations. Including the ones photographed at an angle, which is usually the real test.</p>
      </div>

      <DemoStage n="01" eyebrow="WATCH A DOCUMENT BREAK" h2={['Four documents.', 'Four different failures.']}
        intro="Each of these real document types survives most of the pipeline and then breaks at a different stage. That is the argument of this page: extraction is rarely where a document fails, so a vendor benchmarked on extraction tells you almost nothing about your documents."
        tools={['Claude', 'Gemini', 'OpenAI', 'Google Sheets', 'QuickBooks', 'n8n']}>
        <PipelineBench />
      </DemoStage>

      <section className={svc.band} aria-labelledby="b-h">
        <div className={svc.head}>
          <div><Label n="02">WHY THE DEMO ALWAYS WORKS</Label><h2 id="b-h"><Title t={['Five things that break', 'every accuracy claim.']} /></h2></div>
          <p className={svc.lead}>Vendor benchmarks are run on documents that have none of these. Your documents have several. That gap is why a 99% demo becomes a 70% reality on your files.</p>
        </div>
        <div className={c.breakers}>
          {BREAKERS.map((b) => <article key={b.n}><b>{b.n}</b><h3>{b.h}</h3><p>{b.p}</p></article>)}
        </div>
        <p className={c.note}>This is not our opinion. Independent 2026 benchmarking of document extraction makes the point directly: benchmark scores predict little about behaviour on documents with exactly these five characteristics, because standard evaluation sets exclude them. Which is why we ask for your worst documents before quoting anything, rather than your cleanest.</p>
      </section>

      <section id="chain" className={`${svc.band} ${svc.sunken}`} aria-labelledby="c-h">
        <div className={svc.head}>
          <div><Label n="03">WHAT WE ACTUALLY BUILD</Label><h2 id="c-h"><Title t={['Twelve stages.', 'OCR is one of them.']} /></h2></div>
          <p className={svc.lead}>Most tools sell you stage four and leave you the other eleven. The eleven are where the cost, the errors and the eventual trust in the output all come from.</p>
        </div>
        <ol className={c.chain}>
          {CHAIN.map((x) => <li key={x.h} className={x.n === 'iv' ? c.ocr : undefined}><span>{x.n}</span><h3>{x.h}</h3><p>{x.p}</p></li>)}
        </ol>
        <p className={c.note}>Not every project needs all twelve, and we will tell you which ones yours does not. But the order matters: indexing documents for AI before they have been classified and validated produces a system that answers fluently from the wrong version of a contract, which is worse than having no system at all.</p>
      </section>

      <section className={svc.band} aria-labelledby="e-h">
        <div className={svc.head}>
          <div><Label n="04">THE ENGINE QUESTION</Label><h2 id="e-h"><Title t={['LLM or OCR is', 'the wrong question.']} /></h2></div>
          <p className={svc.lead}>They fail in opposite directions, which is exactly why production pipelines in 2026 run both and route between them.</p>
        </div>
        <div className={c.engines}>
          <article>
            <small>Classical OCR &amp; document AI</small>
            <h3>Textract, Google Document AI, Tesseract</h3>
            <ul>
              <li>Faster and materially cheaper at volume</li>
              <li>Deterministic — the same input gives the same output, every time</li>
              <li>Strong on clean, consistent, high-volume forms</li>
              <li data-weak>Degrades badly on poor scans, merged cells and handwriting</li>
              <li>Will not invent a value it cannot read, which is a genuine virtue</li>
            </ul>
          </article>
          <ArtPlate name="wired-head" className={c.enginesArt} position="50% 30%" sizes="(max-width: 1080px) 100vw, 24vw" decorative />
          <article>
            <small>Multimodal models</small>
            <h3>Gemini, GPT-4o, Claude and similar</h3>
            <ul>
              <li>Roughly 10–15 accuracy points better on degraded inputs</li>
              <li>Handles complex tables, handwriting and unusual layouts</li>
              <li>Understands context, so it can tell a footnote from a figure</li>
              <li data-weak>Non-deterministic, slower and more expensive per page</li>
              <li data-weak>Will produce a plausible value where it should have refused</li>
            </ul>
          </article>
        </div>
        <p className={c.verdict}>So we route by document, not by preference. Clean high-volume forms go the cheap deterministic route; awkward, degraded and unusual documents go to the model. Where both run and <b>disagree, that disagreement is itself the signal</b>. It is one of the most reliable ways we have found to catch a wrong value before it reaches your ledger.</p>
      </section>

      <Deliverables n="05" eyebrow="THE PART THAT MAKES IT TRUSTED" h2={['Being wrong quietly', 'is the real failure.']} sunken
        intro="A pipeline that errors is annoying. A pipeline that produces confident, plausible, wrong numbers for eight months is expensive, and it is the far more common outcome, because nothing alerts anyone."
        items={REVIEW}
        aside={<ArtPlate name="chrome-face" className={c.reviewArt} position="50% 30%" caption="Score the field. Not the document." sizes="(max-width: 1080px) 100vw, 34vw" />} />

      <section className={svc.band} aria-labelledby="s-h">
        <div className={svc.head}>
          <div><Label n="06">THE ENGAGEMENT</Label><h2 id="s-h"><Title t={['Send the documents', 'you are embarrassed by.']} /></h2></div>
          <p className={svc.lead}>The clean ones tell us nothing. The photographed, faxed, half-legible, wrongly-filed ones decide the architecture, and they are the ones a vendor demo will never be run on.</p>
        </div>
        <ol className={c.scope}>{SCOPE.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
      </section>

      <WontBuild n="07" items={OUTSIDE} intro="What sits outside the scope, said up front so nobody is surprised later." />

      <Story n="08" label="RELEVANT WORK · IN PRODUCTION"
        who="Site photographs and PDFs into 50-page client reports, 1,200+ times a year"
        situation="A US property-services firm produces more than twelve hundred reports a year from thousands of files per engagement: photographs, PDFs, spreadsheets and field notes. Every design decision on this page came out of work like that rather than a whitepaper. Per-field confidence exists because document-level scores hid the one value that mattered, and provenance exists because someone eventually asks where a number came from."
        built={['The system classifies and extracts every file in the engagement', 'It models the numbers and assembles the finished report', 'An analyst reviews the exceptions and owns the final judgement']}
        result={[{ v: '1,200+', k: 'reports a year' }, { v: '50 pages', k: 'per client report' }, { v: 'Exceptions', k: 'all an analyst reviews' }]}
        link={['/case-studies/how-reservestudy-automated-report-production-with-ai', 'Read the report-production case study']}
        media={<ArtPlate name="painted-thoughts" className={svc.storyMedia} unveil={false} sizes="(max-width:1080px) 100vw, 50vw" />} />

      <ServiceClose slug={SLUG} h2={['We will tell you where it', 'would break.']}
        p="Send a representative batch, deliberately including the bad ones. You get a straight read on per-field accuracy against your own documents, which stages would need building, and whether this is worth automating at your volume."
        next={['What your documents actually do to a pipeline', 'Per-field accuracy on your files, not a benchmark', 'A scope and a fixed price, in writing']}
        formTitle="Rather write it down first?"
        form={{ submitLabel: 'Send this and pick a time', note: 'Tell us what the documents are, roughly how many, and where the output has to go.' }} />

      <ServiceFaq h2={['Before you', 'start.']} faqs={FAQS} link={['/case-studies', 'See the case-study library']} />
      <AlsoExplore links={[['/cpa-accounting-automation', 'CPA & accounting automation'], ['/legal-ai-automation', 'Legal AI & automation'], ['/ai-workspace-setup', 'AI workspace setup'], ['/business-process-automation-consulting', 'Business process automation']]} />
    </main>
  );
}
