import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import ProcessAudit from './ProcessAudit';
import st from '../../styles/studio.module.css';
import c from './bpa.module.css';

const SLUG = 'business-process-automation-consulting';
const TITLE = 'Business Process Automation Consulting & Services | Chronexa';
const DESCRIPTION = 'Business process automation consultants and services: we map the process, recommend what to automate, then build it. Assessment first, fixed-scope build.';

export const metadata: Metadata = {
  title: { absolute: TITLE }, description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const PATTERNS = [
  ['01', 'The inbox is the queue', 'Work arrives as email, then somebody reads it, decides what it is, forwards it and updates a separate tracker.'],
  ['02', 'The spreadsheet is the integration', 'A person exports from one system, reshapes the file and imports it into another because the two systems never agreed.'],
  ['03', 'The approval has no owner', 'A request is complete, but it sits until somebody remembers which person has authority for this amount or exception.'],
  ['04', 'The same check happens every week', 'Someone compares statuses, dates, totals or documents on a schedule and reports only the things that changed.'],
  ['05', 'The handoff loses its context', 'Sales, operations and finance each recreate the same record because the decision and its evidence did not travel with it.'],
  ['06', 'The exception is found at the end', 'The happy path runs quickly. One missing field or conflicting value is discovered only after downstream work has started.'],
] as const;

const MAP = [
  ['01', 'Trigger', 'What starts the work, exactly?'], ['02', 'Input', 'Which record or document is authoritative?'],
  ['03', 'Decision', 'What can be expressed as a rule?'], ['04', 'Exception', 'What makes the normal path stop?'],
  ['05', 'Owner', 'Who may resolve or approve it?'], ['06', 'Evidence', 'What proves the work completed correctly?'],
] as const;

const LAYERS = [
  ['01', 'Intake and identity', 'Forms, email, webhooks, files or scheduled jobs become one typed request with a stable ID.'],
  ['02', 'Rules and enrichment', 'Required fields, policy checks, lookups and AI-assisted classification happen before the workflow can move.'],
  ['03', 'System actions', 'APIs, n8n, Python, Apps Script or browser automation move the accepted data into the systems that own it.'],
  ['04', 'Human decisions', 'Approvals and judgement arrive with the context attached; the system records who decided and why.'],
  ['05', 'Exceptions and recovery', 'A failed API call, duplicate record or incomplete request enters a named queue rather than disappearing inside a run log.'],
  ['06', 'Operational proof', 'Status, timestamps, inputs, actions and outcomes remain visible so the team can audit the process and improve it.'],
] as const;

const SCOPE = [
  'A working-session map of one real process, including its exceptions', 'A written recommendation: automate, assist, simplify first, or leave human',
  'The data model, ownership rules and acceptance criteria', 'A fixed implementation scope for the first useful slice',
  'Connections to the systems that already own the records', 'Approval gates and human-review queues where judgement belongs',
  'Failure handling, retry rules and an exception owner', 'Logs, operational status and handover documentation',
  'Testing with representative real inputs and edge cases', 'A measured production run before expanding the workflow',
] as const;

const FAQS = [
  { q: 'Is this consulting or implementation?', a: 'Both, with a clean decision between them. The first deliverable is a map and written recommendation you own. It may say to simplify the process, change ownership, buy an existing product, or build. If a build is justified, implementation is separately scoped with acceptance criteria and a fixed price. We do not need to recommend software work to make the assessment commercially worthwhile.' },
  { q: 'Which process should we start with?', a: 'Choose work that happens often, already uses digital inputs, has a recognisable normal path and consumes expensive human attention without needing human judgement on every item. Reconciliation, intake, recurring checks and cross-system re-keying are usually better first candidates than a rare executive decision.' },
  { q: 'Do you replace our existing software?', a: 'Usually no. Most business-process problems live between systems: the email before the CRM update, the spreadsheet between billing and finance, or the approval after a form submission. We connect and clarify the systems you already operate. Replacement is recommended only when the system itself is the constraint.' },
  { q: 'Where does AI belong in a workflow?', a: 'Where an input varies but the output can still be checked: classifying a request, extracting fields, drafting a response, summarising context or identifying a likely exception. Deterministic rules handle exact decisions. People retain ambiguous, high-impact judgement. Calling the whole workflow AI usually hides these useful boundaries.' },
  { q: 'Can you automate a system with no API?', a: 'Sometimes. Scheduled exports, database access, email interfaces and controlled browser automation are possible fallbacks. They are less reliable than a supported API and must be assessed honestly. We will not present a fragile screen-clicking robot as a durable integration without documenting that dependency.' },
  { q: 'What does a business process automation consultant do?', a: 'A business process automation consultant studies how a piece of work really gets done, finds the steps that are repetitive, rule-based and slow, and recommends which to automate, which to simplify and which to leave with people. A good one then helps build or oversee the implementation and measures whether it worked. Our assessment produces the process map and a written recommendation you keep.' },
  { q: 'How much does business process automation consulting cost?', a: 'It depends on how many processes, systems and exceptions are involved. We scope the assessment first, then give a fixed price for the first build. Because the recommendation is yours either way, you can compare our scope with anyone else’s. Our page on what AI automation costs explains what moves the price.' },
  { q: 'What is the difference between business process automation and RPA?', a: 'Business process automation is the goal: moving work through a process with less manual effort. Robotic process automation (RPA) is one technique, software robots that imitate clicks on a screen. Many processes are better served by direct integrations, workflow tools and AI that reads documents, with RPA kept for systems that offer no other way in.' },
  { q: 'How long does a business process automation project take?', a: 'A single well-understood process can be mapped in a working session or two and a first automation built within weeks. Larger programmes are delivered in increments so you see working results regularly rather than at the end.' },
  { q: 'How do we know the automation worked?', a: 'Before building, we agree what a correct completion looks like: the record created, the amounts reconciled, the decision logged, the exception routed or the report delivered. Production measures are attached to that outcome, alongside failure rate and manual exceptions—not to the number of workflow runs.' },
];

export default function Page() {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', '@id': `${site.url}/${SLUG}#service`, name: 'Business Process Automation Consulting and Implementation', serviceType: 'Business process assessment, workflow automation and systems integration', description: DESCRIPTION, url: `${site.url}/${SLUG}`, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: 'Worldwide' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
      { '@type': 'ListItem', position: 3, name: 'Business Process Automation', item: `${site.url}/${SLUG}` },
    ] },
    { '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ] };

  return (
    <div className={st.page}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Business Process Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <section className={st.hero} aria-labelledby="h"><div>
        <p className={st.eyebrow}><i />BUSINESS PROCESS AUTOMATION</p>
        <h1 id="h">Do not automate the mess.<br /><em>Find the work worth fixing.</em></h1>
        <p className={st.heroCopy}>The useful first question is not which tool to buy. It is which repeated work has a clear trigger, trustworthy inputs, a boundary for judgement and somebody who owns the exceptions. We map that first—then build only what survives the test.</p>
        <div className={st.heroActions}><BookButton location={`bpa-hero:${SLUG}`} className={st.primary}>Audit one process <span aria-hidden="true">↗</span></BookButton><a href="#recognise" className={st.ghost}>See the patterns <span aria-hidden="true">↓</span></a></div>
        <p className={st.heroNote}>Assessment first. Implementation when the evidence says build.<span>You own the process map and recommendation whether or not we implement it.</span></p>
      </div><ProcessAudit /></section>

      <section className={st.band} aria-labelledby="s0"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />THE SHORT ANSWER</p><h2 id="s0">What business process automation<br /><em>consulting actually is.</em></h2></div><p>Business process automation consulting is the work of finding which of your repeated processes should be automated, designing how, and making sure it keeps working. It starts with the process, not the software.</p></div><div className={c.decision}><article><h3>Consulting</h3><p>We map one real process, including its exceptions, and write a recommendation: automate, assist, simplify first or leave human.</p></article><article><h3>Services</h3><p>If a build is justified, we implement it on the systems you already run, with approvals, failure handling and logs, for a fixed price.</p></article><article><h3>Company, not just a tool</h3><p>The same team maps, builds and supports it, so the process knowledge is never lost between a consultant and an implementer.</p></article></div></section>

      <div className={st.strip} aria-label="Typical workflow surfaces"><span>THE WORK.<br /><b>WHERE IT HIDES.</b></span><b>Email</b><span>Spreadsheets</span><span>Approvals</span><span>Documents</span><span>APIs</span><span>Queues</span></div>

      <section id="recognise" className={st.band} aria-labelledby="s1"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />01 / RECOGNISE THE PROCESS</p><h2 id="s1">Six signs the work is<br /><em>already asking for a system.</em></h2></div><p>These are not departments or software categories. They are the shapes manual work takes across finance, operations, sales, compliance and client delivery.</p></div><div className={c.patterns}>{PATTERNS.map(([n,h,p]) => <article className={c.pattern} key={h}><span>{n}</span><h3>{h}</h3><p>{p}</p></article>)}</div></section>

      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s2"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />02 / MAP BEFORE SOFTWARE</p><h2 id="s2">A process is six answers,<br /><em>not a flowchart.</em></h2></div><p>If any one of these is missing, the automation will eventually improvise, stall or create a second manual queue nobody planned for.</p></div><ol className={c.map}>{MAP.map(([n,h,p],i) => <li key={h}><span>{n}</span><h3>{h}</h3><p>{p}</p>{i < MAP.length - 1 ? <i aria-hidden="true" /> : null}</li>)}</ol></section>

      <section className={st.band} aria-labelledby="s3"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />03 / WHAT GETS BUILT</p><h2 id="s3">The workflow around<br /><em>the happy path.</em></h2></div><p>The diagram that sells automation usually shows the normal run. Production work is the intake, ownership, recovery and evidence around it.</p></div><div className={c.layers}>{LAYERS.map(([n,h,p]) => <article className={c.layer} key={h}><span>{n}</span><div><h3>{h}</h3><p>{p}</p></div></article>)}</div></section>

      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />04 / THE HONEST RECOMMENDATION</p><h2 id="s4">Build, assist,<br /><em>or leave it alone.</em></h2></div><p>A useful assessment can conclude that software is not the answer. That is a feature of the engagement, not a failed sales call.</p></div><div className={c.decision}><article><h3>Automate</h3><p>High frequency, digital inputs, stable rules, expensive repetition and a clear exception owner.</p></article><article><h3>Assist</h3><p>Let the system collect and prepare the evidence, then put a named person at the decision boundary.</p></article><article><h3>Leave human</h3><p>Rare, ambiguous, relationship-heavy or high-impact work where judgement is the value rather than the delay.</p></article></div></section>

      <section className={st.band} aria-labelledby="s5"><div className={st.scope}><div><p className={st.eyebrow}><i />05 / THE ENGAGEMENT</p><h2 id="s5">One real process.<br /><em>Mapped to production.</em></h2><p className={st.lede}>We begin with the work as it actually happens, including the spreadsheet, workaround and person everyone forgot to mention. The assessment stands alone. A justified build continues into a separately agreed implementation.</p><div className={st.stamp}>Recommendation first.<br /><strong>No software quota.</strong><span aria-hidden="true">↗</span></div></div><div><ul className={st.scopeList}>{SCOPE.map((item,i) => <li key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}<b aria-hidden="true">↗</b></li>)}</ul><details className={st.outside}><summary>What we will not automate <span aria-hidden="true">+</span></summary><ul><li>A broken policy whose owner will not clarify it</li><li>A decision whose risk cannot be assigned to a person</li><li>A one-off task with no reusable pattern</li><li>A fragile workaround presented as permanent architecture</li></ul></details></div></div></section>

      <section className={st.band} aria-labelledby="sp"><div className={st.proof}><div><p className={st.eyebrow}><i />RELEVANT WORK</p><h2 id="sp">Where this method came from.</h2></div><div><h3>The same six answers, run on a dozen different processes</h3><p>This is not a workshop framework. It is the map we draw before every real build: an invoice matched against a payment, a lead handed from a form into a CRM, a report assembled from photographs and PDFs more than 1,200 times a year for one client. Every one of those started as this exercise — trigger, input, decision, exception, owner, evidence — written down before a line of automation existed.</p><p>Most of what this kind of engagement finds is not a build opportunity. It is a missing owner or an undocumented exception. Saying that plainly, even when it means recommending nothing gets built, is what makes the recommendation worth trusting the next time.</p><Link className={st.proofLink} href="/case-studies">See the case-study library <span aria-hidden="true">↗</span></Link></div></div></section>

      <section className={st.close} id="talk" aria-labelledby="s6"><div><p className={st.eyebrow}><i />BRING THE REAL WORK</p><h2 id="s6">Show us the process<br /><em>everyone works around.</em></h2><p>Not the policy diagram—the inbox, tracker, export and approval thread people actually use. We will tell you where the system belongs and where it does not.</p><ol className={st.closeList}><li>The normal path and every known exception</li><li>The systems, records and people it touches</li><li>A written recommendation and scoped next move</li></ol><p className={st.direct}>You will speak with the people who would map and build it.<a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className={st.formWrap}><p>Describe the process in your own words.</p><LeadForm source={`solution:${SLUG}`} compact submitLabel="Send the process" note="Include what starts it, who touches it, and where it usually stalls." /></div></section>

      <section className={st.faq} aria-labelledby="s7"><div><p className={st.eyebrow}><i />BEFORE THE ASSESSMENT</p><h2 id="s7">Questions worth asking.</h2></div><div>{FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
      <nav className={st.related} aria-label="Related solutions"><span>Related solutions</span><Link href="/ai-automation">AI Workflow Automation ↗</Link><Link href="/document-processing-automation">Document Data Extraction ↗</Link><Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link></nav>
    </div>
  );
}
