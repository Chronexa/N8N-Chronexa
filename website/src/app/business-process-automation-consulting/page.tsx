import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import ArtPlate from '../../components/visual/ArtPlate';
import {
  AlsoExplore, AnswerCard, Deliverables, DemoStage, Label, ServiceClose, ServiceFaq, ServiceHero, ServiceSchema,
  Story, Title, WontBuild, serviceMetadata, svc,
} from '../../components/service/ServiceParts';
import { ART } from '../../lib/art';
import ProcessAudit from './ProcessAudit';
import c from './bpa.module.css';

/**
 * Business process automation consulting (rebuilt 2026-10-11 on the service design system). All the
 * studio version's arguments stay: the six patterns, the six-answer map, the layers around the happy
 * path, the honest recommendation and the method's origin. Art: the doorway of light in the river.
 */

const SLUG = 'business-process-automation-consulting';
const TITLE = 'Business Process Automation Consulting & Services | Chronexa';
const DESCRIPTION = 'Business process automation consultants and services: we map the process, recommend what to automate, then build it. Assessment first, fixed-scope build.';
const HERO = ART['light-door'];

export const metadata = serviceMetadata({ slug: SLUG, title: TITLE, description: DESCRIPTION, art: HERO.kind === 'image' ? HERO.src : HERO.poster });

const SHORT = [
  ['Consulting', 'We map one real process, including its exceptions, and write a recommendation: automate, assist, simplify first or leave human.'],
  ['Services', 'If a build is justified, we implement it on the systems you already run, with approvals, failure handling and logs, for a fixed price.'],
  ['Company, not just a tool', 'The same team maps, builds and supports it, so the process knowledge is never lost between a consultant and an implementer.'],
] as const;

const VERDICTS = [
  ['Automate', 'High frequency, digital inputs, stable rules, expensive repetition and a clear exception owner.'],
  ['Assist', 'Let the system collect and prepare the evidence, then put a named person at the decision boundary.'],
  ['Leave human', 'Rare, ambiguous, relationship-heavy or high-impact work where judgement is the value rather than the delay.'],
] as const;

const SURFACES = ['Email', 'Spreadsheets', 'Approvals', 'Documents', 'APIs', 'Queues'];

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
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Business Process Automation', design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <ServiceSchema slug={SLUG} name="Business Process Automation Consulting and Implementation"
        serviceType={['Business process assessment', 'Workflow automation', 'Systems integration']} description={DESCRIPTION} faqs={FAQS} />

      <ServiceHero
        slug={SLUG} eyebrow="BUSINESS PROCESS AUTOMATION" h1={['Do not automate the mess.', 'Find the work worth fixing.']}
        sub="The useful first question is not which tool to buy. It is which repeated work has a clear trigger, trustworthy inputs, a boundary for judgement and somebody who owns the exceptions. We map that first, then build only what survives the test."
        art={HERO.kind === 'image' ? HERO.src : HERO.poster} artAlt={HERO.alt} artPos="50% 45%" tall
        cta="Audit one process" seeLabel="Test a process"
        offer={['Assessment first', 'You own the map', 'Fixed-scope build']}
      />
      <AnswerCard items={[
        ['What it is', 'Consultants who map one real process, recommend what to automate, then build it.'],
        ['Who it’s for', 'Operations, finance and delivery leaders whose teams run work through inboxes, spreadsheets and approval threads.'],
        ['What you get', 'A process map and written recommendation you keep, and a fixed-scope build if the evidence says build.'],
        ['How it’s priced', 'Assessment scoped first. Any build fixed-price, agreed in writing.'],
        ['How fast', 'One process mapped in a working session or two. A first automation within weeks.'],
      ]} />

      <section className={svc.band} aria-labelledby="a-h">
        <div className={svc.head}>
          <div><Label n="01">THE SHORT ANSWER</Label><h2 id="a-h"><Title t={['What business process automation consulting', 'actually is.']} /></h2></div>
          <p className={svc.lead}>Business process automation consulting is the work of finding which of your repeated processes should be automated, designing how, and making sure it keeps working. It starts with the process, not the software.</p>
        </div>
        <div className={svc.tiles}>{SHORT.map(([h, p]) => <article key={h} className={svc.tile}><h3>{h}</h3><p>{p}</p></article>)}</div>
        <div className={c.surfaces} aria-label="Typical workflow surfaces"><span>The work. <b>Where it hides.</b></span><ul>{SURFACES.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </section>

      <DemoStage n="02" eyebrow="TEST A PROCESS" h2={['Put one process', 'through the audit.']}
        intro="Pick a process. See which checks it passes, what the system would take over, and what stays with a person. Assessment first, implementation when the evidence says build."
        note="You own the process map and recommendation whether or not we implement it.">
        <ProcessAudit />
      </DemoStage>

      <section id="recognise" className={svc.band} aria-labelledby="r-h">
        <div className={svc.head}>
          <div><Label n="03">RECOGNISE THE PROCESS</Label><h2 id="r-h"><Title t={['Six signs the work is', 'already asking for a system.']} /></h2></div>
          <p className={svc.lead}>These are not departments or software categories. They are the shapes manual work takes across finance, operations, sales, compliance and client delivery.</p>
        </div>
        <div className={c.patterns}>
          <ArtPlate name="pigeon-rush" className={c.patternsArt} position="50% 35%" sizes="(max-width: 1080px) 100vw, 30vw" decorative />
          {PATTERNS.map(([n, h, p]) => <article key={h}><span>{n}</span><h3>{h}</h3><p>{p}</p></article>)}
        </div>
      </section>

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="m-h">
        <div className={c.mapWrap}>
          <div>
            <Label n="04">MAP BEFORE SOFTWARE</Label>
            <h2 id="m-h"><Title t={['A process is six answers,', 'not a flowchart.']} /></h2>
            <p className={svc.lead} style={{ marginTop: '1.2rem' }}>If any one of these is missing, the automation will eventually improvise, stall or create a second manual queue nobody planned for.</p>
            <ArtPlate name="floating-islands" className={c.mapArt} caption="Six answers, each one joined to the next." sizes="(max-width: 1080px) 100vw, 40vw" />
          </div>
          <ol className={c.map}>{MAP.map(([n, h, p]) => <li key={h}><span>{n}</span><div><h3>{h}</h3><p>{p}</p></div></li>)}</ol>
        </div>
      </section>

      <Deliverables n="05" eyebrow="WHAT GETS BUILT" h2={['The workflow around', 'the happy path.']}
        intro="The diagram that sells automation usually shows the normal run. Production work is the intake, ownership, recovery and evidence around it."
        items={LAYERS.map(([, h, p]) => ({ h, p }))} />

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="v-h">
        <div className={svc.head}>
          <div><Label n="06">THE HONEST RECOMMENDATION</Label><h2 id="v-h"><Title t={['Build, assist,', 'or leave it alone.']} /></h2></div>
          <p className={svc.lead}>A useful assessment can conclude that software is not the answer. That is a feature of the engagement, not a failed sales call.</p>
        </div>
        <div className={c.verdicts}>{VERDICTS.map(([h, p], i) => <article key={h} data-v={i}><small>{String(i + 1).padStart(2, '0')}</small><h3>{h}</h3><p>{p}</p></article>)}</div>
      </section>

      <section className={svc.band} aria-labelledby="e-h">
        <div className={svc.head}>
          <div><Label n="07">THE ENGAGEMENT</Label><h2 id="e-h"><Title t={['One real process.', 'Mapped to production.']} /></h2></div>
          <p className={svc.lead}>We begin with the work as it actually happens, including the spreadsheet, workaround and person everyone forgot to mention. The assessment stands alone. A justified build continues into a separately agreed implementation. Recommendation first. No software quota.</p>
        </div>
        <ol className={c.scope}>{SCOPE.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
      </section>

      <WontBuild n="08" intro="Some work should not be automated, and we will say so."
        items={['A broken policy whose owner will not clarify it', 'A decision whose risk cannot be assigned to a person', 'A one-off task with no reusable pattern', 'A fragile workaround presented as permanent architecture']} />

      <Story n="09" label="WHERE THIS METHOD CAME FROM"
        who="The same six answers, run on a dozen different processes"
        situation="This is not a workshop framework. It is the map we draw before every real build. Most of what this kind of engagement finds is not a build opportunity: it is a missing owner or an undocumented exception. Saying that plainly, even when it means recommending nothing gets built, is what makes the recommendation worth trusting the next time."
        built={['An invoice matched against a payment', 'A lead handed from a form into a CRM', 'A report assembled from photographs and PDFs more than 1,200 times a year for one client']}
        result={[{ v: '6', k: 'answers written down before any build' }, { v: '12+', k: 'processes mapped this way' }, { v: '1,200+', k: 'reports a year from one mapped process' }]}
        link={['/case-studies', 'See the case-study library']}
        media={<ArtPlate name="knight-poppies" className={svc.storyMedia} unveil={false} position="62% 60%" sizes="(max-width:1080px) 100vw, 50vw" />} />

      <ServiceClose slug={SLUG} h2={['Show us the process', 'everyone works around.']}
        p="Not the policy diagram: the inbox, tracker, export and approval thread people actually use. We will tell you where the system belongs and where it does not."
        next={['The normal path and every known exception', 'The systems, records and people it touches', 'A written recommendation and scoped next move']}
        formTitle="Describe the process in your own words."
        form={{ submitLabel: 'Send the process', note: 'Include what starts it, who touches it, and where it usually stalls.' }} />

      <ServiceFaq h2={['Questions', 'worth asking.']} faqs={FAQS} link={['/ai-automation-cost', 'What AI automation costs']} />
      <AlsoExplore links={[['/ai-automation', 'AI workflow automation'], ['/document-processing-automation', 'Document data extraction'], ['/ai-workspace-setup', 'AI workspace setup'], ['/ai-consultant', 'Hire an AI consultant']]} />
    </main>
  );
}
