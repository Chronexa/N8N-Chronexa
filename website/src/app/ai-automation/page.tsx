import Link from 'next/link';
import AIServicesRail from '../../components/AIServicesRail';
import ScrollDepth from '../../components/ScrollDepth';
import TrackView from '../../components/TrackView';
import {
  AlsoExplore, AnswerCard, Deliverables, DemoStage, Label, MoneySection, Quote, RailGap,
  ServiceClose, ServiceFaq, ServiceHero, ServiceSchema, Story, StoryImage, Title, WontBuild, serviceMetadata, svc,
} from '../../components/service/ServiceParts';
import WorkflowWorkbench from './WorkflowWorkbench';
import c from './workflow.module.css';

const SLUG = 'ai-automation';
const TITLE = 'AI Workflow Automation Services | Chronexa';
const DESCRIPTION = 'We design and build AI-assisted workflows that move real work across your existing systems, with rules, human review, exception handling and measurable outcomes.';
const ART = '/images/service-art/workflow-paper-birds.webp';

export const metadata = serviceMetadata({ slug: SLUG, title: TITLE, description: DESCRIPTION, art: ART });

const SHAPES = [
  ['01', 'Collect', 'Email, forms, files, records and events arrive in one traceable intake.'],
  ['02', 'Understand', 'AI only where the input varies: classify, extract, compare, summarise or draft.'],
  ['03', 'Decide', 'Exact rules first. Ambiguous or high-impact calls go to a named person.'],
  ['04', 'Act', 'The systems that own the work get updated through APIs, n8n or scripts.'],
  ['05', 'Recover', 'Safe failures retry. Exceptions surface with the evidence to fix them.'],
] as const;

const USE_CASES = [
  ['Document operations', 'Invoices, contracts, scans and attachments become checked records in QuickBooks, NetSuite or the system finance already trusts.'],
  ['Revenue operations', 'A new lead or signed deal updates HubSpot or Salesforce with research attached and the next task assigned.'],
  ['Finance operations', 'Invoices, purchase orders and bank feeds matched in QuickBooks, Xero or your ERP. Only real mismatches reach a person.'],
  ['Customer operations', 'Requests classified and answered from your help centre in Zendesk, Intercom or Gmail. Anything outside policy goes to a person with context.'],
  ['Reporting', 'Numbers pulled from the CRM, finance and ops tools into the report your team already reads, on the schedule they expect.'],
  ['Internal handoffs', 'A signed contract or closed deal creates the project, folder, checklist and invoice in Asana, Drive and Xero. Nobody retypes it.'],
] as const;

const SCOPE = [
  { h: 'A map of one real workflow and a baseline', p: 'Every step, exception and owner, plus the time, delay or error rate before we touch it.' },
  { h: 'A fixed scope with testable acceptance criteria', p: 'The data contract and trusted source for every input, agreed before the build.' },
  { h: 'AI, rules and human decisions kept separate', p: 'Each step uses the cheapest reliable method. People keep the judgement calls.' },
  { h: 'Connections to the tools your team already uses', p: 'No new platform to learn. The work shows up where it already lives.' },
  { h: 'Approval gates and a recovery path', p: 'Approvals for anything client-facing, financial or irreversible; retries, duplicate protection and an exception queue with named owners.' },
  { h: 'Logs, testing and a handover you control', p: 'Status a non-developer can follow, production testing, documentation, and everything in your accounts.' },
];

const FAQS = [
  { q: 'How much does AI workflow automation cost?', a: 'There is no single price, because no two workflows are the same. The audit is free and the first workflow is built free inside a week. After that, each workflow is one fixed price, agreed in writing before work starts and sized against the hours, errors or revenue it moves. Third-party usage such as model or platform fees stays visible.' },
  { q: 'How is this different from business process automation consulting?', a: 'Workflow Automation is the build engagement when you already have a recognisable process to improve. Business Process Automation Consulting is assessment-first: it is for teams with several messy processes that need help deciding what to simplify, assist, automate or leave human before commissioning software.' },
  { q: 'How is this different from AI Workspace Setup?', a: 'Here, Chronexa owns delivery of one defined operational workflow and its outcome. AI Workspace Setup gives your team a connected AI environment, reusable skills and training so they can perform many changing tasks themselves. A workflow is a production line; a workspace is a capability your people use.' },
  { q: 'Does every automation need AI?', a: 'No. Exact rules, schedules and API calls are more reliable for exact work. We use AI where inputs vary or language and documents must be interpreted, then constrain its output with validation and human review. A good AI workflow often contains much more ordinary engineering than AI.' },
  { q: 'Can you connect software that has no API?', a: 'Sometimes, through exports, email interfaces, database access or controlled browser automation. We document the reliability trade-off and never present screen automation as equivalent to a supported API.' },
  { q: 'What happens when the workflow is unsure?', a: 'It stops at a designed exception boundary and gives a named person the input, attempted checks and relevant context. The goal is not to remove people from every case; it is to reserve their attention for cases that need judgement.' },
  { q: 'Who owns the finished system?', a: 'You do. We build in accounts and repositories you control, document the connections and failure paths, and hand over the operating runbook. Ongoing support is available, but the workflow should not depend on us to keep running.' },
];

export default function Page() {
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'AI Workflow Automation', design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <ServiceSchema slug={SLUG} name="AI Workflow Automation" serviceType={['AI workflow automation', 'business process automation', 'n8n automation']} description={DESCRIPTION} faqs={FAQS} />

      <ServiceHero
        slug={SLUG} eyebrow="AI WORKFLOW AUTOMATION" h1={['One manual workflow.', 'Built to finish the work.']} art={ART} artPos="66% center"
        artAlt="A woman in a sunflower field watches a long, orderly line of paper birds carry light from a farmhouse to a distant village"
        sub="We take one process your team repeats every week, connect the tools it touches, add AI only where reading or judgement helps, and send the hard cases to the right person."
        cta="Bring us one workflow" seeLabel="Watch one run"
      />
      <AnswerCard items={[
        ['What it is', 'One recurring business process, automated end to end across the tools you already use.'],
        ['Who it’s for', 'Operations, finance and revenue teams doing the same multi-step work every day.'],
        ['What you get', 'A live workflow, its exception queue, a runbook and a before-and-after baseline.'],
        ['How it’s priced', 'Audit and first workflow free. Then one fixed price per workflow, agreed upfront.'],
        ['How fast', 'First workflow live inside a week. Bigger ones ship in weekly slices.'],
      ]} />
      <RailGap />
      <AIServicesRail current={SLUG} />
      <div className={c.connects} aria-label="Workflow surfaces"><span>The system.<b>What it connects.</b></span><ul><li>Email</li><li>CRM</li><li>Documents</li><li>Finance</li><li>APIs</li><li>People</li></ul></div>

      <DemoStage n="01" eyebrow="WATCH ONE RUN" h2={['Pick a workflow.', 'Watch it finish.']} note="Pick a workflow, then follow it from trigger to outcome."
        intro="Document intake, lead handoff, reconciliation, a support queue. Each shows what starts it, where AI reads, which rule decides and who gets the exception.">
        <WorkflowWorkbench />
      </DemoStage>

      <section id="shape" className={svc.band} aria-labelledby="shape-h">
        <div className={svc.head}>
          <div><Label n="02">THE WORKFLOW SHAPE</Label><h2 id="shape-h"><Title t={['From incoming work', 'to a visible outcome.']} /></h2></div>
          <p className={svc.lead}>A reliable workflow is more than a model call. It knows what starts the work, which source to trust, what can proceed and who owns the exception.</p>
        </div>
        <ol className={c.flow}>{SHAPES.map(([n, h, body]) => <li key={h}><span>{n}</span><h3>{h}</h3><p>{body}</p></li>)}</ol>
      </section>

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="cases-h">
        <div className={svc.head}>
          <div><Label n="03">WHERE IT EARNS ITS PLACE</Label><h2 id="cases-h"><Title t={['Repeated work across', 'the tools you already own.']} /></h2></div>
          <p className={svc.lead}>The best candidates have frequent digital inputs, a recognisable normal path, and expensive people spending time on preparation instead of judgement.</p>
        </div>
        <div className={svc.tiles}>{USE_CASES.map(([h, body], i) => <article key={h} className={svc.tile}><small>{String(i + 1).padStart(2, '0')}</small><h3>{h}</h3><p>{body}</p></article>)}</div>
      </section>

      <Story n="04" label="PRODUCTION WORK" who="An engineering firm’s reports, drafted in minutes"
        situation="A US property-services firm wrote long technical reports by hand from site photos, inspector notes and financial models. Analysts spent days on each one before a client ever saw it."
        built={['A workflow that reads the site photos and inspector notes', 'Extracts every component, runs the numbers and writes the narrative', 'Assembles the finished report and hands it to an analyst for review']}
        result={[{ k: 'per report draft, down from days', v: 'Minutes' }, { k: 'less analyst time', v: '85%' }, { k: 'reports a year', v: '1,200+' }]}
        link={['/case-studies', 'See the case studies']}
        media={<StoryImage src="/images/service-art/workflow-watermill.webp" alt="A stone watermill turning beside a stream as an even line of glowing lanterns floats toward a village" />} />

      <Quote text="We had run this reconciliation in Zapier for the better part of a year. It broke every time a supplier changed their invoice format, and nobody wanted to be the one who found out. Chronexa built it once with the exceptions designed in, and we stopped thinking about it." by="Finance operations lead, mid-size distribution company" />

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="fit-h">
        <div className={svc.head}>
          <div><Label n="05">WHICH ENGAGEMENT FITS</Label><h2 id="fit-h"><Title t={['A workflow, or', 'an AI working environment?']} /></h2></div>
          <p className={svc.lead}>Related, but not the same purchase. Choose by who should own the work after we leave.</p>
        </div>
        <div className={svc.tiles}>
          <article className={`${svc.tile} ${svc.tileOn}`}><small>DONE-FOR-YOU SYSTEM</small><h3>AI Workflow Automation</h3><p>You have a defined recurring process. We design, build, test and hand over the workflow that performs it.</p><strong>You are here</strong></article>
          <Link className={svc.tile} href="/ai-workspace-setup"><small>TEAM CAPABILITY</small><h3>AI Workspace Setup</h3><p>You want your people to research, create and automate through a connected AI environment.</p><strong>Explore the workspace offer ↗</strong></Link>
          <Link className={svc.tile} href="/business-process-automation-consulting"><small>ASSESSMENT FIRST</small><h3>Process Automation Consulting</h3><p>Several messy processes, and you need a ranked map before deciding what deserves a build.</p><strong>Start with the audit ↗</strong></Link>
        </div>
      </section>

      <section className={svc.band} aria-labelledby="vs-h">
        <div className={svc.head}>
          <div><Label n="06">WHY NOT JUST&hellip;</Label><h2 id="vs-h"><Title t={['Faster than hiring.', 'Sturdier than a template.']} /></h2></div>
          <p className={svc.lead}>A no-code tool and an in-house hire are both real options. Here is where each one actually costs you.</p>
        </div>
        <div className={c.compareCard}>
          <div className={c.compareScroll}>
            <table className={c.compare}>
              <thead><tr><th scope="col"><span className="visually-hidden">Measure</span></th><th scope="col">DIY with Zapier / Make</th><th scope="col">Hire in-house</th><th scope="col" className={c.us}>Chronexa</th></tr></thead>
              <tbody>
                <tr><th scope="row">Time to a working result</th><td>Live same day, for the simple part</td><td>10–14 weeks just to hire</td><td className={c.us}>First workflow inside a week</td></tr>
                <tr><th scope="row">Exceptions and many systems</th><td>Breaks past two or three connected tools</td><td>Entirely dependent on who you hired</td><td className={c.us}>Built around your exceptions from day one</td></tr>
                <tr><th scope="row">When a system changes</th><td>You, from a support queue</td><td>Whoever you hired, if they are still there</td><td className={c.us}>Us, on the scope you agreed</td></tr>
                <tr><th scope="row">Cost shape</th><td>Per-task pricing that climbs with volume</td><td>$150,000+ base, year-round, work or not</td><td className={c.us}>One fixed price per workflow, agreed upfront</td></tr>
                <tr><th scope="row">Who owns it after</th><td>You, capped by the platform’s limits</td><td>You, if the person stays</td><td className={c.us}>You, in your own accounts, documented</td></tr>
              </tbody>
            </table>
          </div>
          <p className={c.compareNote}>Hiring figures: US senior software engineer base salary and time-to-hire, 2026 (Built In; Recruiting from Scratch). Your own numbers may run higher once benefits and a specialised skill set are priced in.</p>
        </div>
      </section>

      <MoneySection n="07" h2={['Hours back,', 'priced in writing.']} intro="Workflow savings are the easiest to measure: the hours a team stops spending, and the errors that stop reaching clients."
        rows={[['Hours on the process each week', '25', '3'], ['Request to done', '2 days', 'Same hour'], ['Errors reaching a client', 'A few a month', 'Caught, with the reason'], ['Headcount as volume doubles', 'Doubles', 'Same team']]} />

      <Deliverables n="08" eyebrow="THE ENGAGEMENT" h2={['One workflow.', 'Working for real.']} intro="We start from the current process and its real inputs, agree the outcome, build the smallest complete slice, test the exceptions and hand over a system you can watch." items={SCOPE} />
      <WontBuild n="09" intro="A workflow that only works when nothing goes wrong is a demo, not a system. These we turn down." items={['A generic chatbot installed everywhere', 'Automation without an exception owner', 'Unreviewed financial or customer-facing actions', 'A dependency on Chronexa for ordinary operation']} />

      <ServiceClose slug={SLUG} h2={['Show us where work', 'changes hands.']} p="Bring the inbox, spreadsheet, document, system record and workaround. We find the first complete slice worth automating and build it free."
        formTitle="Describe the workflow in your own words."
        form={{ submitLabel: 'Send the workflow', note: 'Include what starts it, which tools it touches and where it usually stops.', fieldLabel: 'Which workflow eats the most hours?', fieldPlaceholder: 'e.g. supplier invoices into Xero, new deals into onboarding', fieldNote: 'Workflow' }} />

      <ServiceFaq h2={['Questions that clarify', 'the boundary.']} faqs={FAQS} link={['/n8n-portfolio', 'See 35 workflows we have published']} />
      <AlsoExplore links={[['/ai-workspace-setup', 'AI Workspace Setup'], ['/business-process-automation-consulting', 'Process Automation Consulting'], ['/document-processing-automation', 'Document Data Extraction'], ['/crm-automation-services', 'CRM automation']]} />
    </main>
  );
}
