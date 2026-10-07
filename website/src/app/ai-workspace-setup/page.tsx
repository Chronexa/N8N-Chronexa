import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import WorkspaceConsole from './WorkspaceConsole';
import st from '../../styles/studio.module.css';
import c from './workspace.module.css';

const SLUG = 'ai-workspace-setup';
const TITLE = 'AI Workspace Setup & Team Enablement | Chronexa';
const DESCRIPTION = 'We configure Claude Code, Codex and connected AI workspaces around your company systems, then build reusable skills and train your team to use them safely.';

export const metadata: Metadata = {
  title: { absolute: TITLE }, description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const LAYERS = [
  ['01', 'Environment', 'Claude Code, Codex or another capable AI client configured for the team’s operating systems, IDEs and repositories.'],
  ['02', 'Company context', 'Project instructions, terminology, brand rules, technical standards and approved sources that travel with the work.'],
  ['03', 'Connections', 'CRM, email, files, analytics, databases and internal APIs exposed through approved connectors or custom MCP tools.'],
  ['04', 'Skills and playbooks', 'Reusable ways to research, create, analyse, update, test and publish—not a folder of clever one-off prompts.'],
  ['05', 'Permissions', 'Separate read, draft, approve and execute boundaries, with secrets managed outside prompts and repositories.'],
  ['06', 'People', 'Role-specific training on real work, with examples employees can repeat after the workshop ends.'],
] as const;

const JOBS = [
  ['Marketing', ['Pull performance and audience data straight from Meta Ads Manager and the CMS to brief a new campaign', 'Draft and stage a landing-page change on the existing design system, tested before anyone reviews it', 'Structure a Meta campaign end to end — audiences, creative, budget — with spend held behind approval']],
  ['Sales', ['Research an account across the CRM, email threads and public sources before a call', 'Turn a Salesforce or HubSpot record and its history into a one-page call brief', 'Draft the follow-up and update the opportunity stage after a rep reviews it']],
  ['Operations', ['Pull the week’s numbers out of QuickBooks, the CRM and a spreadsheet into one report, automatically', 'Turn a list of exceptions into a prioritised, owner-ready queue instead of a shared inbox', 'Build a small internal tool around a spreadsheet process a team already runs by hand']],
  ['Product & engineering', ['Read an unfamiliar part of the codebase and explain it before anything gets touched', 'Build, test and open a PR for a bounded feature on a real branch', 'Turn a repeated engineering instruction into a reusable skill the whole team can call on']],
] as const;

const LAUNCH = [
  'AI workspace configuration for the agreed teams and environments', 'A role-and-work audit focused on repeatable, valuable tasks',
  'Shared company and project instructions with version control', 'Three production-ready skills or playbooks around real work',
  'Connections to selected company systems through existing integrations', 'One scoped custom MCP or API tool when a standard connector is insufficient',
  'Permission, secret and approval boundaries for each connected action', 'Hands-on training sessions using the team’s own work',
  'A written operating guide and recorded handover', 'A 30-day adoption review and prioritised expansion backlog',
] as const;

const FAQS = [
  { q: 'Is this only a Claude setup service?', a: 'No. Claude Code is often a strong fit and we can configure it deeply, but the service is deliberately model- and client-aware. We can work with Codex and other capable environments when they better fit your repositories, tools, security requirements or existing subscriptions. The durable assets are your instructions, skills, connections and operating rules.' },
  { q: 'Do employees need to be developers?', a: 'No, but each role needs an interface appropriate to the work. Some employees may use a desktop workspace while technical users work in an IDE or terminal. We teach the minimum concepts required to inspect changes, approve actions and recover safely; we do not turn a finance or marketing workshop into a programming course.' },
  { q: 'How is this different from AI Workflow Automation?', a: 'Workflow Automation gives you one defined, done-for-you operational system. AI Workspace Setup gives your people a connected environment and reusable skills for many tasks that change from week to week. We may build a small workflow during enablement, but the commercial outcome is team capability rather than one automated process.' },
  { q: 'Can AI publish website changes or launch advertising campaigns?', a: 'It can prepare code, assets and campaign configuration when the necessary systems expose supported tools or APIs. Production deployment, customer communication and budget changes remain behind explicit review and approval. We design for fast execution without pretending that consequential actions should be invisible.' },
  { q: 'What is a custom MCP tool?', a: 'It is a deliberately scoped interface that lets an AI client read from or act through a company system. A useful tool might read a CRM opportunity, fetch an approved report or prepare a draft website deployment. We define narrow operations and permissions instead of handing the model an unrestricted company credential.' },
  { q: 'What happens after the initial setup?', a: 'The team can operate the delivered environment independently. If you want continued expansion, an Embedded AI Engineer can add skills, connectors and internal tools, review adoption and help departments move the next use cases into controlled operation.' },
];

export default function Page() {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', '@id': `${site.url}/${SLUG}#service`, name: 'AI Workspace Setup and Team Enablement', serviceType: 'Claude Code and Codex setup, MCP integration, AI skills development and employee training', description: DESCRIPTION, url: `${site.url}/${SLUG}`, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: 'Worldwide' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` }, { '@type': 'ListItem', position: 3, name: 'AI Workspace Setup', item: `${site.url}/${SLUG}` }] },
    { '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ] };

  return <div className={st.page}>
    <TrackView event="service_view" props={{ slug: SLUG, name: 'AI Workspace Setup', design: 'studio-v1' }} />
    <ScrollDepth pageType="service" slug={SLUG} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className={st.hero} aria-labelledby="h"><div>
      <p className={st.eyebrow}><i />AI WORKSPACE SETUP &amp; TEAM ENABLEMENT</p>
      <h1 id="h">Give your team AI<br /><em>that can reach the work.</em></h1>
      <p className={st.heroCopy}>We configure Claude Code, Codex or the right AI environment around your company context and systems. Then we build the skills, connectors and approval boundaries that let employees research, create, automate and ship without waiting for a specialist at every step.</p>
      <div className={st.heroActions}><BookButton location={`workspace-hero:${SLUG}`} className={st.primary}>Design the workspace <span aria-hidden="true">↗</span></BookButton><a href="#stack" className={st.ghost}>See what gets configured <span aria-hidden="true">↓</span></a></div>
      <p className={st.heroNote}>Tools, context and training delivered together.<span>The goal is independent capability—not permanent dependence on a consultant or one model vendor.</span></p>
    </div><WorkspaceConsole /></section>
    <div className={st.strip} aria-label="AI workspace surfaces"><span>THE WORKSPACE.<br /><b>WHAT IT CAN REACH.</b></span><b>Claude</b><span>Codex</span><span>CRM</span><span>Email</span><span>Repositories</span><span>MCP</span></div>

    <section id="stack" className={st.band} aria-labelledby="s1"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />01 / THE COMPANY LAYER</p><h2 id="s1">A capable model is<br /><em>only the starting point.</em></h2></div><p>Useful work appears when the AI understands the environment, can reach approved systems, follows repeatable instructions and knows which action requires a person.</p></div><div className={c.layers}>{LAYERS.map(([n,h,p]) => <article key={h}><span>{n}</span><div><h3>{h}</h3><p>{p}</p></div></article>)}</div></section>

    <section className={st.band} aria-labelledby="sp"><div className={st.proof}><div><p className={st.eyebrow}><i />RELEVANT WORK</p><h2 id="sp">We run on the thing we’re selling.</h2></div><div><h3>Chronexa operates through this exact setup, every day — not as a demo.</h3><p>This isn’t a service assembled from a framework. Chronexa’s own marketing, sales and engineering work runs through a configured AI workspace: campaigns get drafted and structured before a person approves the spend, CRM records get researched and updated, code changes get written, tested and opened as a PR for review. If it’s described on this page, it’s a step we run ourselves first.</p><p>The read / draft / approve / execute boundary further down this page exists because we hit the failure modes before a client did — a draft that looked finished but wasn’t, an action that should have waited for a person and didn’t. That’s what shaped the permission model, not a security checklist.</p><Link className={st.proofLink} href="/case-studies">See how we build this discipline for clients <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className={`${st.band} ${st.sunken}`} aria-labelledby="s2"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />02 / TRAIN ON REAL WORK</p><h2 id="s2">Not prompt training.<br /><em>Operating practice.</em></h2></div><p>Each team leaves with working examples tied to its actual systems and responsibilities. The playbook includes how to inspect, approve and recover—not just how to ask.</p></div><div className={c.jobs}>{JOBS.map(([team,jobs]) => <article key={team}><h3>{team}</h3><ul>{jobs.map(job => <li key={job}>{job}</li>)}</ul></article>)}</div></section>

    <section className={st.band} aria-labelledby="s3"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />03 / ACTION NEEDS A BOUNDARY</p><h2 id="s3">Fast enough to matter.<br /><em>Controlled enough to trust.</em></h2></div><p>Connecting a tool is not the same as granting every action. We define increasing levels of authority around the consequence of the work.</p></div><ol className={c.authority}><li><span>READ</span><h3>Find and explain</h3><p>Search approved sources and return evidence without changing a system.</p></li><li><span>DRAFT</span><h3>Prepare the work</h3><p>Create code, messages, reports or campaign configuration for review.</p></li><li><span>APPROVE</span><h3>A person decides</h3><p>Show the proposed action, impact and evidence to a named owner.</p></li><li><span>EXECUTE</span><h3>Act within limits</h3><p>Run approved operations with narrow credentials, logs and recovery paths.</p></li></ol></section>

    <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4"><div className={st.sectionHead}><div><p className={st.eyebrow}><i />04 / TWO WAYS TO ENGAGE</p><h2 id="s4">Launch the capability.<br /><em>Then expand if useful.</em></h2></div><p>Begin with a fixed implementation. Keep an embedded specialist only when there is a real backlog of additional teams, systems and use cases.</p></div><div className={c.offers}><article><span>FIXED-SCOPE START</span><h3>AI Workspace Launch</h3><p>Configure the environment, connect the first systems, deliver reusable skills and train the first team.</p><ul><li>Defined teams and use cases</li><li>Agreed connectors and one custom tool</li><li>Training, handover and 30-day review</li></ul><BookButton location={`workspace-launch:${SLUG}`} className={c.offerCta}>Plan a workspace launch ↗</BookButton></article><article><span>ONGOING CAPABILITY</span><h3>Embedded AI Engineer</h3><p>A Chronexa specialist extends the workspace alongside your team without becoming a permanent bottleneck.</p><ul><li>New skills, MCP tools and internal utilities</li><li>Adoption reviews and role-specific office hours</li><li>Testing and controlled production changes</li></ul><BookButton location={`embedded-engineer:${SLUG}`} className={c.offerCta}>Discuss embedded support ↗</BookButton></article></div></section>

    <section className={st.band} aria-labelledby="s5b"><div className={st.scope}><div><p className={st.eyebrow}><i />05 / THE EMBEDDED AI ENGINEER, IN DETAIL</p><h2 id="s5b">Faster than a hire.<br /><em>Accountable like one.</em></h2><p className={st.lede}>Most companies lose the first quarter of an AI hire to recruiting, onboarding and ramp &mdash; then lose the institutional knowledge again the day that person leaves. An embedded engineer starts inside a pattern we already built: the workspace, the connectors, the approval boundaries. There is nothing to ramp up on.</p><div className={st.stamp}>Live in weeks.<br /><strong>Not a hiring cycle.</strong><span aria-hidden="true">↗</span></div></div><div><div className={st.compareScroll}><table className={st.compare}><thead><tr><th></th><th>In-house hire</th><th>Freelancer / contractor</th><th className={st.us}>Embedded AI Engineer</th></tr></thead><tbody>
      <tr><th>Time to start</th><td>10&ndash;14 weeks to hire, then weeks to ramp</td><td>Days, with no continuity guarantee</td><td className={st.us}>1&ndash;2 weeks, already trained on the pattern</td></tr>
      <tr><th>If it is not working</th><td>A slow, expensive process to undo</td><td>Find another one, re-explain everything</td><td className={st.us}>Scoped down or swapped inside the engagement</td></tr>
      <tr><th>Institutional memory</th><td>Walks out the door if they leave</td><td>Rebuilt with every new contractor</td><td className={st.us}>Held by Chronexa, documented as it is built</td></tr>
      <tr><th>Cost shape</th><td>$150,000+ base, year-round, backlog or not</td><td>Hourly, scales with scope creep</td><td className={st.us}>Scoped to the backlog, paused or extended as it changes</td></tr>
    </tbody></table></div><p className={c.compareNote}>Hiring figures: US senior software/AI engineer base salary and time-to-hire, 2026 (Built In; Recruiting from Scratch). The first 30 days include a structured adoption review &mdash; a connector or skill that is not earning its place gets cut rather than padded into the scope.</p></div></div></section>

    <section className={st.band} aria-label="Client testimonial"><div className={st.testimonial}><blockquote>&ldquo;Our first real automation was live inside the second week, not the second quarter. Six months on, the person who built it still knows exactly why every approval rule exists &mdash; nothing got handed off and forgotten.&rdquo;</blockquote><cite>Head of operations, B2B SaaS company</cite></div></section>

    <section className={st.band} aria-labelledby="s5"><div className={st.scope}><div><p className={st.eyebrow}><i />06 / THE WORKSPACE LAUNCH</p><h2 id="s5">Useful on Monday.<br /><em>Owned after handover.</em></h2><p className={st.lede}>We configure the first environment around a small set of real jobs, so employees learn by completing work that already matters. The final backlog shows where to expand and what should remain a conventional workflow.</p><div className={st.stamp}>Context. Tools. Skills.<br /><strong>People ready to use them.</strong><span aria-hidden="true">↗</span></div></div><div><ul className={st.scopeList}>{LAUNCH.map((item,i) => <li key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}<b aria-hidden="true">↗</b></li>)}</ul><details className={st.outside}><summary>What this is not <span aria-hidden="true">+</span></summary><ul><li>A generic prompting workshop</li><li>Unrestricted access to every company system</li><li>A promise that non-technical users never need review</li><li>Vendor lock-in disguised as transformation</li></ul></details></div></div></section>

    <section className={st.close} id="talk" aria-labelledby="s6"><div><p className={st.eyebrow}><i />BRING THE TEAM AND THE TOOLS</p><h2 id="s6">Show us what people<br /><em>wait on every week.</em></h2><p>We will map the roles, systems and first useful jobs, then recommend the smallest workspace that can demonstrate independent capability.</p><ol className={st.closeList}><li>Choose the first roles and repeatable jobs</li><li>Define connections and approval boundaries</li><li>Leave with a fixed launch scope</li></ol><p className={st.direct}>Technical and operational owners are welcome on the first call.<a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className={st.formWrap}><p>Describe the team you want to enable.</p><LeadForm source={`solution:${SLUG}`} compact submitLabel="Plan the workspace" note="Include the roles, systems and tasks you want AI to help perform." /></div></section>

    <section className={st.faq} aria-labelledby="s7"><div><p className={st.eyebrow}><i />BEFORE THE SETUP</p><h2 id="s7">Questions that shape the environment.</h2></div><div>{FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
    <nav className={st.related} aria-label="Related solutions"><span>Related solutions</span><Link href="/ai-automation">AI Workflow Automation ↗</Link><Link href="/business-process-automation-consulting">Process Automation Consulting ↗</Link><Link href="/document-processing-automation">Document Data Extraction ↗</Link></nav>
  </div>;
}
