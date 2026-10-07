import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import WorkflowWorkbench from './WorkflowWorkbench';
import st from '../../styles/studio.module.css';
import c from './workflow.module.css';

const SLUG = 'ai-automation';
const TITLE = 'AI Workflow Automation Services | Chronexa';
const DESCRIPTION = 'We design and build AI-assisted workflows that move real work across your existing systems, with rules, human review, exception handling and measurable outcomes.';

export const metadata: Metadata = {
  title: { absolute: TITLE }, description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const SHAPES = [
  ['01', 'Collect', 'Bring email, forms, files, records and events into one traceable intake.'],
  ['02', 'Understand', 'Use AI only where the input varies: classify, extract, compare, summarise or draft.'],
  ['03', 'Decide', 'Apply exact rules first and send ambiguous or high-impact decisions to a named person.'],
  ['04', 'Act', 'Update the systems that own the work through APIs, n8n, scripts or controlled browser actions.'],
  ['05', 'Recover', 'Retry safe failures, surface exceptions and preserve the evidence needed to resolve them.'],
] as const;

const USE_CASES = [
  ['Document operations', 'Invoices, contracts, scans and email attachments become structured, validated records in QuickBooks, NetSuite or the system your finance team already reconciles against — not a spreadsheet nobody trusts.'],
  ['Revenue operations', 'A new lead or signed deal updates HubSpot or Salesforce with research attached and the next task assigned, so a rep opens a warm record instead of a blank one.'],
  ['Finance operations', 'Invoices, purchase orders and bank feeds get matched inside QuickBooks, Xero or your ERP on your existing tolerance rules; only the real mismatches reach a person.'],
  ['Customer operations', 'Requests get classified and answered from your help centre and policy documents in Zendesk, Intercom or Gmail, with anything outside policy handed to a person with full context.'],
  ['Reporting', 'Numbers get pulled from the CRM, finance system and ops tools that already hold them into the report format your team already reviews, on the schedule they already expect — not a new dashboard to learn.'],
  ['Internal handoffs', 'One accepted record — a signed contract, a closed deal, a completed job — creates the project, folder, checklist and invoice it should in Asana, Drive and Xero, without someone re-typing it three times.'],
] as const;

const SCOPE = [
  'A map of one real workflow, including exceptions and ownership', 'A baseline for time, delay, error or capacity before the build',
  'The data contract and authoritative source for every input', 'A fixed implementation scope with testable acceptance criteria',
  'AI steps, deterministic rules and human decisions separated deliberately', 'Connections to the systems already used by the team',
  'Approval gates for customer-facing, financial or irreversible actions', 'Retries, duplicate protection, exception queues and named owners',
  'Logs and operational status a non-developer can follow', 'Production testing, documentation and handover in accounts you control',
] as const;

const FAQS = [
  { q: 'How is this different from business process automation consulting?', a: 'Workflow Automation is the build engagement when you already have a recognisable process to improve. Business Process Automation Consulting is assessment-first: it is for teams with several messy processes that need help deciding what to simplify, assist, automate or leave human before commissioning software.' },
  { q: 'How is this different from AI Workspace Setup?', a: 'Here, Chronexa owns delivery of one defined operational workflow and its outcome. AI Workspace Setup gives your team a connected AI environment, reusable skills and training so they can perform many changing tasks themselves. A workflow is a production line; a workspace is a capability your people use.' },
  { q: 'Does every automation need AI?', a: 'No. Exact rules, schedules and API calls are more reliable for exact work. We use AI where inputs vary or language and documents must be interpreted, then constrain its output with validation and human review. A good AI workflow often contains much more ordinary engineering than AI.' },
  { q: 'Can you connect software that has no API?', a: 'Sometimes, through exports, email interfaces, database access or controlled browser automation. We document the reliability trade-off and never present screen automation as equivalent to a supported API.' },
  { q: 'What happens when the workflow is unsure?', a: 'It stops at a designed exception boundary and gives a named person the input, attempted checks and relevant context. The goal is not to remove people from every case; it is to reserve their attention for cases that need judgement.' },
  { q: 'Who owns the finished system?', a: 'You do. We build in accounts and repositories you control, document the connections and failure paths, and hand over the operating runbook. Ongoing support is available, but the workflow should not depend on us to keep running.' },
];

export default function Page() {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', '@id': `${site.url}/${SLUG}#service`, name: 'AI Workflow Automation', serviceType: 'AI-assisted workflow automation and systems integration', description: DESCRIPTION, url: `${site.url}/${SLUG}`, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: 'Worldwide' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` }, { '@type': 'ListItem', position: 3, name: 'AI Workflow Automation', item: `${site.url}/${SLUG}` }] },
    { '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ] };

  return <div className={st.page}>
    <TrackView event="service_view" props={{ slug: SLUG, name: 'AI Workflow Automation', design: 'studio-v1' }} />
    <ScrollDepth pageType="service" slug={SLUG} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className={st.hero} aria-labelledby="h"><div>
      <p className={st.eyebrow}><i />AI WORKFLOW AUTOMATION</p>
      <h1 id="h">One manual workflow.<br /><em>Built to finish the work.</em></h1>
      <p className={st.heroCopy}>We connect the systems you already use, add AI where interpretation helps, keep exact decisions as rules and send uncertainty to the right person. The result is an operational workflow—not another chat window.</p>
      <div className={st.heroActions}><BookButton location={`workflow-hero:${SLUG}`} className={st.primary}>Bring us one workflow <span aria-hidden="true">↗</span></BookButton><a href="#shape" className={st.ghost}>See how it works <span aria-hidden="true">↓</span></a></div>
      <p className={st.heroNote}>Defined outcome. Fixed scope. Built in accounts you control.<span>Start with work your team already repeats—not with a request to “add AI.”</span></p>
    </div><WorkflowWorkbench /></section>
    <div className={st.strip} aria-label="Workflow surfaces"><span>THE SYSTEM.<br /><b>WHAT IT CONNECTS.</b></span><b>Email</b><span>CRM</span><span>Documents</span><span>Finance</span><span>APIs</span><span>People</span></div>

    <section id="shape" className={st.band} aria-labelledby="s1"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />01 / THE WORKFLOW SHAPE</p><h2 id="s1">From incoming work<br /><em>to a visible outcome.</em></h2></div><p>A reliable workflow is more than a model call. It knows what starts the work, which source to trust, what can proceed and who owns the exception.</p></div><ol className={c.flow}>{SHAPES.map(([n,h,p]) => <li key={h}><span>{n}</span><h3>{h}</h3><p>{p}</p></li>)}</ol></section>
    <section className={`${st.band} ${st.sunken}`} aria-labelledby="s2"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />02 / WHERE IT EARNS ITS PLACE</p><h2 id="s2">Repeated work across<br /><em>the systems you already own.</em></h2></div><p>The strongest candidates have frequent digital inputs, a recognisable normal path and expensive human attention spent on preparation rather than judgement.</p></div><div className={c.cases}>{USE_CASES.map(([h,p],i) => <article key={h}><span>{String(i + 1).padStart(2, '0')}</span><h3>{h}</h3><p>{p}</p></article>)}</div></section>
    <section className={st.band} aria-labelledby="sp"><div className={st.proof}><div><p className={st.eyebrow}><i />RELEVANT WORK</p><h2 id="sp">Built from what actually breaks in production.</h2></div><div><h3>Different workflow, same discipline: exceptions get caught, not buried.</h3><p>The patterns on this page came out of production work, not a framework diagram: reconciling orders against payments for a finance team, routing qualified leads into a CRM before a rep ever saw them, turning site photographs and PDFs into more than 1,200 client reports a year for a US property-services firm. Different systems, same discipline — separate the exact rule from the judgement call, and never let a workflow guess when it should ask.</p><p>That discipline is why every workflow we build ships with a recovery path before it ships with a happy path. A workflow that only works when nothing goes wrong is a demo, not a system.</p><Link className={st.proofLink} href="/case-studies">See the case-study library <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className={st.band} aria-labelledby="s3"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />03 / WHICH ENGAGEMENT FITS</p><h2 id="s3">A workflow or<br /><em>an AI working environment?</em></h2></div><p>These are related, but they are not the same purchase. Choose based on who should own execution after the engagement.</p></div><div className={c.chooser}><article className={c.active}><span>DONE-FOR-YOU SYSTEM</span><h3>AI Workflow Automation</h3><p>You have a defined recurring process. We design, build, test and hand over the workflow that performs it.</p><strong>You are here.</strong></article><Link href="/ai-workspace-setup"><span>TEAM CAPABILITY</span><h3>AI Workspace Setup</h3><p>You want employees to research, create, automate and ship through a connected AI environment.</p><strong>Explore the workspace offer ↗</strong></Link><Link href="/business-process-automation-consulting"><span>ASSESSMENT FIRST</span><h3>Process Automation Consulting</h3><p>You have several messy processes and need a prioritised map before deciding what deserves a build.</p><strong>Start with the audit ↗</strong></Link></div></section>
    <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4"><div className={st.scope}><div><p className={st.eyebrow}><i />04 / THE ENGAGEMENT</p><h2 id="s4">One workflow.<br /><em>Working for real.</em></h2><p className={st.lede}>We begin with the current process and its real inputs. Then we agree the outcome, build the smallest complete production slice, test the exceptions and hand over an observable system.</p><div className={st.stamp}>Rules where exact.<br /><strong>AI where useful.</strong><span aria-hidden="true">↗</span></div></div><div><ul className={st.scopeList}>{SCOPE.map((item,i) => <li key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}<b aria-hidden="true">↗</b></li>)}</ul><details className={st.outside}><summary>What this is not <span aria-hidden="true">+</span></summary><ul><li>A generic chatbot installed everywhere</li><li>Automation without an exception owner</li><li>Unreviewed financial or customer-facing actions</li><li>A dependency on Chronexa for ordinary operation</li></ul></details></div></div></section>
    <section className={st.band} aria-labelledby="s4b"><div className={st.scope}><div><p className={st.eyebrow}><i />05 / WHY NOT JUST&hellip;</p><h2 id="s4b">Faster than hiring.<br /><em>More durable than a template.</em></h2><p className={st.lede}>A no-code tool and an in-house hire are both real options. Here is where each one actually costs you, compared with a fixed-scope build.</p><div className={st.stamp}>Live in weeks.<br /><strong>Not a hiring cycle.</strong><span aria-hidden="true">↗</span></div></div><div><div className={st.compareScroll}><table className={st.compare}><thead><tr><th></th><th>DIY with Zapier / Make</th><th>Hire in-house</th><th className={st.us}>Chronexa</th></tr></thead><tbody>
      <tr><th>Time to a working result</th><td>Live same day, for the simple part</td><td>10&ndash;14 weeks just to hire</td><td className={st.us}>2&ndash;4 weeks to a working system</td></tr>
      <tr><th>Exceptions &amp; multiple systems</th><td>Breaks past two or three connected tools</td><td>Entirely dependent on who you hired</td><td className={st.us}>Built around your exceptions from day one</td></tr>
      <tr><th>When a system changes</th><td>You, from a support queue</td><td>Whoever you hired, if they are still there</td><td className={st.us}>Us, on the scope you agreed</td></tr>
      <tr><th>Cost shape</th><td>Per-task pricing that climbs with volume</td><td>$150,000+ base, year-round, work or not</td><td className={st.us}>One fixed price for the workflow, agreed upfront</td></tr>
      <tr><th>Who owns it after</th><td>You, capped by the platform&rsquo;s limits</td><td>You, if the person stays</td><td className={st.us}>You, in your own accounts, documented</td></tr>
    </tbody></table></div><p className={c.compareNote}>Hiring figures: US senior software engineer base salary and time-to-hire, 2026 (Built In; Recruiting from Scratch). Your own numbers may run higher once benefits and a specialised skill set are priced in.</p></div></div></section>

    <section className={st.band} aria-label="Client testimonial"><div className={st.testimonial}><blockquote>&ldquo;We had run this reconciliation in Zapier for the better part of a year. It broke every time a supplier changed their invoice format, and nobody wanted to be the one who found out. Chronexa built it once with the exceptions designed in, and we stopped thinking about it.&rdquo;</blockquote><cite>Finance operations lead, mid-size distribution company</cite></div></section>

    <section className={st.close} id="talk" aria-labelledby="s5"><div><p className={st.eyebrow}><i />BRING ONE REPEATED PROCESS</p><h2 id="s5">Show us where work<br /><em>changes hands.</em></h2><p>Bring the inbox, spreadsheet, document, system record and workaround. We will identify the first complete slice that can be automated responsibly.</p><ol className={st.closeList}><li>Define the outcome and current baseline</li><li>Separate rules, AI and human judgement</li><li>Leave with a scoped implementation path</li></ol><p className={st.direct}>You will speak with the people who would design and build it.<a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className={st.formWrap}><p>Describe the workflow in your own words.</p><LeadForm source={`solution:${SLUG}`} compact submitLabel="Send the workflow" note="Include what starts it, which tools it touches and where it usually stops." /></div></section>
    <section className={st.faq} aria-labelledby="s6"><div><p className={st.eyebrow}><i />BEFORE THE BUILD</p><h2 id="s6">Questions that clarify the boundary.</h2></div><div>{FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
    <nav className={st.related} aria-label="Related solutions"><span>Related solutions</span><Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link><Link href="/business-process-automation-consulting">Process Automation Consulting ↗</Link><Link href="/document-processing-automation">Document Data Extraction ↗</Link></nav>
  </div>;
}
