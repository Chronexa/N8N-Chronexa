import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { GovernanceGate } from './LegalInteractive';
import st from '../../styles/studio.module.css';
import c from './legal.module.css';
import HeroStage, { ProofArt } from '../../components/visual/HeroStage';

const SLUG = 'legal-ai-automation';
const TITLE = 'Legal AI & Automation for Law Firms | Chronexa';
const DESCRIPTION =
  'Secure legal AI inside your own tenant: retrieval that inherits iManage and SharePoint permissions, verifiable citations and full audit trails.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const DUTIES = [
  {
    n: 'RULE 1.1',
    h: 'Competence',
    p: 'The opinion treats understanding a tool’s benefits and risks as part of competence — not optional literacy. In practice that means your people need to know what the system can and cannot see, and why it sometimes refuses.',
  },
  {
    n: 'RULE 1.6',
    h: 'Confidentiality',
    p: 'Client information cannot simply be fed into a tool. Where a tool learns from inputs or shares an environment across firms, informed consent may be part of the analysis. Building inside your own tenant removes most of that question rather than answering it.',
  },
  {
    n: 'RULE 1.4',
    h: 'Communication',
    p: 'In some circumstances clients need to be told how these tools are used in their matter. That is a firm decision, not a vendor one, but the system should be able to tell you exactly what it did on a matter so the conversation is possible.',
  },
  {
    n: 'RULES 3.1 & 3.3',
    h: 'Candor to the tribunal',
    p: 'Courts have sanctioned lawyers who filed briefs containing authorities a tool invented. Every design decision on this page — retrieval-only citation, marked gaps, no smoothing over uncertainty — exists because of this failure mode.',
  },
  {
    n: 'RULES 5.1 & 5.3',
    h: 'Supervision',
    p: 'Output has to be supervised the way a junior’s work is supervised, which means a partner needs to be able to see what was used and what was assumed. Unauditable output is unsupervisable output.',
  },
  {
    n: 'RULE 1.5',
    h: 'Reasonable fees',
    p: 'If a task now takes two hours instead of eight, billing eight is a problem. This is a business-model question rather than a technical one, and it is worth deciding deliberately before the efficiency arrives rather than after.',
  },
];

const GROUPS = [
  {
    h: 'Knowing what the firm already knows',
    p: 'The firm has answered this question before. The problem is that the answer is inside a matter nobody remembers, filed under a client name nobody recognises.',
    items: [
      'Retrieval across the document store that respects matter permissions',
      'Precedent and clause lookup with the source document attached',
      'Comparison between versions of an agreement, showing what moved',
      'Internal know-how systems that surface prior work on similar issues',
    ],
  },
  {
    h: 'Matter research and preparation',
    p: 'The assembly work that surrounds analysis — gathering, organising, summarising — rather than the analysis itself.',
    items: [
      'Matter research with every assertion traceable to a retrieved source',
      'Document organisation, ingestion and structured filing at intake',
      'Translation of documents with the original preserved alongside',
      'Chronologies and issue lists built from the documents in the matter',
    ],
  },
  {
    h: 'Watching the outside world',
    p: 'No client confidentiality is engaged here, which is why this is often the safest and fastest place for a firm to start.',
    items: [
      'Regulatory-change monitoring mapped to the matters it touches',
      'Filing and docket monitoring with alerts to the responsible lawyer',
      'Tracking published guidance and policy change across jurisdictions',
      'Digests written for the practice group rather than for everyone',
    ],
  },
  {
    h: 'Drafting and the workflow between tools',
    p: 'Where the firm already owns good legal software, the gap is usually between the systems rather than inside any one of them.',
    items: [
      'First-draft memos and standard documents from retrieved material',
      'Workflow automation between the document, practice and billing systems',
      'Matter-specific alerts when something in the file changes',
      'Structured handover packs so a matter can move between people cleanly',
    ],
  },
];

const DEPLOY = [
  {
    h: 'Inside your Microsoft tenant',
    s: 'THE USUAL ANSWER',
    p: 'An enterprise model instance in your own Azure subscription, with the document store and identity you already run. Data stays within the environment your firm controls and your existing permissions carry through.',
    p2: 'This is where most firms land, because the governance question is largely answered by the architecture rather than by a contract clause.',
  },
  {
    h: 'Inside your AWS environment',
    s: 'SAME PRINCIPLE',
    p: 'The same shape where the firm’s infrastructure is already there. Nothing about the design depends on a particular cloud — it depends on the environment being yours.',
    p2: 'We build to your security team’s standards and hand over documentation they can actually review.',
  },
  {
    h: 'Alongside the legal tools you own',
    s: 'OFTEN THE CHEAPEST',
    p: 'If your research and review platforms already do a job well, we connect and orchestrate them rather than rebuild them. The value is frequently in the workflow between systems, not in another system.',
    p2: 'We will tell you when the honest answer is to use what you have and automate around it.',
  },
];

const SCOPE = [
  'A read of where confidential material actually lives today, including the copies',
  'Deployment inside your Azure or AWS environment, in your firm’s accounts',
  'Retrieval that inherits document-management permissions rather than re-implementing them',
  'Citation-controlled answers with the source document and page attached',
  'Regulatory and filing monitoring mapped to the matters it affects',
  'Document ingestion, organisation and translation at intake',
  'Drafting support that marks what it could not verify',
  'Workflow automation between document, practice and billing systems',
  'Audit trails covering queries, sources, refusals and who accepted what',
  'Documentation your security and risk people can review without us present',
];

const OUTSIDE = [
  'Legal advice. We build systems; your lawyers practise law and own the work product.',
  'Acting as your compliance or risk function. We build to your policies and document what we built.',
  'Replacing your research platform or your document management system.',
  'Autonomous filing, sending or signing. Nothing goes to a client, a court or a counterparty without a lawyer.',
];

const FAQS = [
  {
    q: 'Is there actually an ethics rule about this, or is it vendor scare-talk?',
    a: 'There is a specific one. On 29 July 2024 the ABA Standing Committee on Ethics and Professional Responsibility issued Formal Opinion 512, its first formal guidance on generative AI, addressing competence, confidentiality, communication with clients, candor to the tribunal, supervision and fees. It does not prohibit these tools; it sets out the conditions for using them properly, including that a lawyer must think carefully before putting client information into a tool and that informed consent can be part of the analysis. State bars have issued their own guidance too, so the applicable rules depend on your jurisdiction. The practical consequence for a build is that architecture does most of the ethical work: a system inside your own environment, inheriting your permissions, with an audit trail, answers most of these questions structurally rather than by policy.',
  },
  {
    q: 'How do you stop it inventing case law?',
    a: 'By not letting it write authorities at all. Citations come from retrieval over sources the system can point at — your documents, your subscribed materials, published sources — rather than from the model’s memory, and anything it cannot support is marked as an open question instead of being written over smoothly. This is not a theoretical concern: courts have sanctioned lawyers for filing briefs containing authorities that a tool fabricated, and that specific failure is the reason the design refuses to produce a confident-sounding paragraph it cannot substantiate. A lawyer still verifies. The system’s job is to make verification quick rather than to make it feel unnecessary.',
  },
  {
    q: 'What happens to our ethical walls?',
    a: 'They have to be enforced by the same system that enforces them today, which in most firms means the document management platform. This is the single most common way legal AI projects go wrong: someone builds a retrieval index over everything the firm holds, and it quietly becomes a route around permissions the firm spent years configuring. We build retrieval that inherits matter-level permissions at query time, so a lawyer who is not on a matter gets nothing — not a summary, not a redacted answer, not even confirmation that responsive documents exist. Attempts are logged, because a refusal is as much a part of the record as an answer.',
  },
  {
    q: 'Does HIPAA apply to us?',
    a: 'Almost certainly not by virtue of being a law firm, and it is worth saying plainly because these labels get attached to legal pages indiscriminately. The regime that governs your data is the Rules of Professional Conduct, your clients’ outside counsel guidelines, and whatever contractual security obligations you have signed up to — which are frequently stricter and more specific than the certifications vendors advertise. Where a firm genuinely handles protected health information for a client matter, HIPAA may apply to that engagement, and that is a real conversation with a real answer rather than a badge on a web page. We would rather scope the actual requirement than decorate the page.',
  },
  {
    q: 'Can this run on ChatGPT or Claude directly?',
    a: 'Not for client material, and that is the whole reason this page exists. Consumer and general-purpose tools are a poor fit for confidential matter content because of where the data goes and what may be retained. What works is an enterprise model instance running inside your own Azure or AWS environment, where inputs are not used for training, logging is under your control, and the data never leaves the boundary your firm is responsible for. The models themselves are largely the same; the difference is entirely in where they run and what surrounds them.',
  },
  {
    q: 'Where should a firm start if it has never done this?',
    a: 'Regulatory and filing monitoring, almost always. It produces something genuinely useful within weeks, it engages no client confidentiality because the sources are public, and it lets your risk people watch the system behave before anything touches a matter. From there the natural second step is retrieval over the firm’s own documents, which is more valuable and requires the permission work to be done properly. Starting with drafting is the common instinct and usually the wrong order, because it is the highest-scrutiny use with the least trust established.',
  },
  {
    q: 'What does an engagement cost?',
    a: 'It depends on which environment you run, which systems have to be connected and how much of the permission model is already clean, so there is no list price. The first step is a short assessment: where confidential material actually lives today including the copies nobody talks about, what your security team will and will not approve, and which use case gives you something useful fastest. That produces a scope, an acceptance definition and a fixed price in writing before any build starts.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'Legal AI & Automation for Law Firms',
        serviceType: 'Legal AI deployment, secure document retrieval and law firm workflow automation',
        description:
          'Secure legal AI and automation for law firms: enterprise model deployment inside the firm’s own Azure or AWS environment, retrieval that inherits iManage and SharePoint matter permissions, citation-controlled answers, regulatory-change monitoring, document organisation and translation, drafting support and audit trails.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'Legal AI & Automation', item: `${site.url}/${SLUG}` },
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
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Legal AI & Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={st.hero} aria-labelledby="h">
        <div>
          <p className={st.eyebrow}><i />LEGAL AI &amp; AUTOMATION FOR LAW FIRMS</p>
          <h1 id="h">The hard part is not the model.<br /><em>It is who may see what.</em></h1>
          <p className={st.heroCopy}>
            A firm can buy a capable model this afternoon. What it cannot buy is a system that
            inherits every matter permission, cites only what it can point at, refuses the questions
            it should refuse, and leaves a record a partner can supervise. That is the build.
          </p>
          <div className={st.heroActions}>
            <BookButton location={`legal-hero:${SLUG}`} className={st.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#walls" className={st.ghost}>See the permission problem <span aria-hidden="true">↓</span></a>
          </div>
          <p className={st.heroNote}>
            Deployed inside your own Azure or AWS environment.
            <span>Not a wrapper around a consumer chatbot, and not a tool that learns from your matters.</span>
          </p>
        </div>
        <HeroStage art="doorways" position="64% 50%"><GovernanceGate /></HeroStage>
      </section>

      <div className={st.strip} aria-label="Systems we work with">
        <span>THE ENVIRONMENT.<br /><b>WHERE IT RUNS.</b></span>
        <b>iManage</b><span>SharePoint</span><span>NetDocuments</span><span>Azure</span><span>AWS</span><span>n8n</span>
      </div>

      {/* ── 01 the duties ────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s1">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />01 / THE TEST EVERY LEGAL AI TOOL HAS TO PASS</p>
            <h2 id="s1">There is a published<br /><em>opinion on this now.</em></h2>
          </div>
          <p>ABA Formal Opinion 512, issued 29 July 2024. It does not prohibit these tools. It sets out the duties they have to be built around, which is a far more useful thing for a buyer.</p>
        </div>
        <div className={c.duties}>
          {DUTIES.map(d => (
            <article key={d.n} className={c.duty}>
              <span>{d.n}</span>
              <h3>{d.h}</h3>
              <p>{d.p}</p>
            </article>
          ))}
        </div>
        <p className={c.opinionNote}>
          State bars have issued their own guidance as well, so the rules that bind you depend on your
          jurisdiction. The practical point for a build is the same everywhere: architecture answers
          most of these duties structurally. A system running inside your environment, inheriting your
          permissions, citing only retrieved sources and logging what it did satisfies more of this
          list by design than any policy document can by assertion.
        </p>
      </section>

      {/* ── 02 the permission argument ───────────────────────────────── */}
      <section id="walls" className={`${st.band} ${st.sunken}`} aria-labelledby="s2">
        <div className={c.perm}>
          <div>
            <p className={st.eyebrow}><i />02 / HOW THESE PROJECTS ACTUALLY FAIL</p>
            <h2 id="s2">An index over everything<br /><em>is a hole in every wall.</em></h2>
            <p className={st.lede}>
              The most common legal AI failure is not a hallucination. It is a retrieval index built
              across the whole document store, which quietly becomes a route around the ethical walls
              the firm spent years configuring — and nobody notices, because it never looks like a
              breach. It looks like a helpful summary.
            </p>
            <p className={st.lede}>
              Permissions have to be applied at query time, by the system that already owns them.
              Anything else is a copy of your access model that will drift out of date the first time
              a matter is walled.
            </p>
            <div className={st.stamp}>Same walls.<br /><strong>New tools.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <div className={c.wallDiagram}>
            <div className={c.wallRow}>
              <span className={c.chip}><b>ASKS</b>Lawyer staffed on the matter</span>
              <span className={c.pass} aria-hidden="true">→</span>
              <span className={c.chip}><b>GETS</b>The eleven documents, with sources</span>
            </div>
            <div className={c.wallRow}>
              <span className={c.chip}><b>ASKS</b>Lawyer not on the matter</span>
              <span className={c.stop} aria-hidden="true">✕</span>
              <span className={c.chip}><b>GETS</b>Nothing. Not even that documents exist.</span>
            </div>
            <div className={c.wallRow}>
              <span className={c.chip}><b>ASKS</b>Lawyer behind an ethical wall</span>
              <span className={c.stop} aria-hidden="true">✕</span>
              <span className={c.chip}><b>GETS</b>Nothing, and the attempt is logged</span>
            </div>
            <div className={c.wallRow}>
              <span className={c.chip}><b>ASKS</b>Anyone, about public sources</span>
              <span className={c.pass} aria-hidden="true">→</span>
              <span className={c.chip}><b>GETS</b>The answer. No confidentiality engaged.</span>
            </div>
            <p className={c.wallCaption}>
              The rules are not reimplemented in the AI layer. They are read from the document
              management system at the moment of the query, so a permission change takes effect
              immediately and a walled matter is walled everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* ── 03 what we build ─────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />03 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s3">Four kinds of work,<br /><em>in increasing order of risk.</em></h2>
          </div>
          <p>Most firms should start at the third group, where no client material is involved at all, and earn their way toward the others. We will say so even though it is the smallest first project.</p>
        </div>
        <div className={c.catalogue}>
          {GROUPS.map(g => (
            <article key={g.h} className={c.group}>
              <h3>{g.h}</h3>
              <p>{g.p}</p>
              <ul>{g.items.map(i => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── 04 deployment ────────────────────────────────────────────── */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />04 / WHERE IT RUNS</p>
            <h2 id="s4">In your environment,<br /><em>under your identity.</em></h2>
          </div>
          <p>The models are broadly the same wherever they run. Everything that matters to a risk committee is about the boundary they run inside and what surrounds them.</p>
        </div>
        <div className={c.deploy}>
          {DEPLOY.map(d => (
            <div key={d.h} className={c.shape}>
              <h3>{d.h}</h3>
              <span>{d.s}</span>
              <p>{d.p}</p>
              <p>{d.p2}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 engagement ────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s5">
        <div className={st.scope}>
          <div>
            <p className={st.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">It starts with<br /><em>where the copies are.</em></h2>
            <p className={st.lede}>
              Every firm has confidential material in more places than the document management system
              — inboxes, shared drives, someone&rsquo;s desktop. Finding that out is unglamorous, and
              it is the work that decides whether any of this can be done safely.
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
            <h2 id="s6">Where this came from.</h2><ProofArt art="glass-bloom" />
          </div>
          <div>
            <h3>Retrieval where an unsupported answer was a liability</h3>
            <p>
              The citation-controlled retrieval, the refusal behaviour and the audit trail described
              here were developed for document-heavy professional work where an answer nobody could
              trace back to a source was not a minor defect but a real problem. Legal work needs the
              same discipline for sharper reasons.
            </p>
            <p>
              We are not naming firms or publishing engagement details on a public page. On a call we
              will go through the architecture properly, including the parts that were harder than
              expected and what we would design differently now.
            </p>
            <Link className={st.proofLink} href="/ai-workspace-setup">How connected AI workspaces are built <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={st.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={st.eyebrow}><i />06 / START WHERE THE RISK IS LOWEST</p>
          <h2 id="s7">Bring your risk people<br />to the <em>first conversation.</em></h2>
          <p>
            Not the second one. The questions they will ask decide the architecture, so having them
            in the room early is faster than designing something and then discovering what will not
            be approved.
          </p>
          <ol className={st.closeList}>
            <li>Where confidential material actually lives today</li>
            <li>Which use case gives you something useful fastest</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={st.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us your document system, your cloud, and what you would want it to do first." />
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
        <Link href="/document-processing-automation">Document Data Extraction ↗</Link>
        <Link href="/cpa-accounting-automation">CPA &amp; Accounting Automation ↗</Link>
      </nav>
    </div>
  );
}
