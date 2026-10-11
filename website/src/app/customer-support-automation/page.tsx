import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { TriageBench } from './SupportInteractive';
import s from './support.module.css';
import HeroStage, { ProofArt } from '../../components/visual/HeroStage';

const SLUG = 'customer-support-automation';
const TITLE = 'Customer Service Automation & AI Support Agents | Chronexa';
const DESCRIPTION =
  'Custom AI support agents that answer from your live systems, not just your help centre: routed by query type, scoped access, cited answers, real escalation.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const AGENTS = [
  {
    n: 'ROUTER',
    name: 'The classifier',
    p: 'Reads the message and decides what kind of question it is before anything tries to answer it. Nothing else runs until this has committed to a category, because an agent guessing at scope is how the wrong system gets touched.',
    sees: ['The message and its channel', 'Which product or plan the sender is on', 'Nothing else — it never answers'],
  },
  {
    n: 'KNOWLEDGE',
    name: 'Documentation agent',
    p: 'Answers the questions your help centre already covers, with the article it used shown underneath. Retrieval is restricted to published, current content so it cannot quote a draft or a superseded version back to a customer.',
    sees: ['Published help centre articles', 'Product docs at the current version', 'Release notes'],
  },
  {
    n: 'ACCOUNT',
    name: 'Billing and account agent',
    p: 'Handles the questions whose answer only exists inside the customer record — invoices, plan changes, seats, renewal dates. It reads live and writes almost nothing; anything that moves money waits for a person.',
    sees: ['Billing system, read-only, this customer', 'Subscription and seat records', 'Internal policy, never quoted verbatim'],
  },
  {
    n: 'TECHNICAL',
    name: 'Debugging agent',
    p: 'For the tickets that are not answerable from documentation because they describe something specific going wrong right now. It reads the job, the error and the recent history, and reports what it found rather than guessing.',
    sees: ['Job and queue state for that tenant', 'Redacted error logs, recent window', 'Status page and known incidents'],
  },
  {
    n: 'CLARIFY',
    name: 'Clarification agent',
    p: 'Half of support tickets do not contain enough information to answer. Rather than producing a confident guess, this one asks the single most useful follow-up question and holds the ticket open until it gets an answer.',
    sees: ['The thread so far', 'What the routed agent said it was missing'],
  },
  {
    n: 'ESCALATE',
    name: 'Escalation agent',
    p: 'Decides when the system should stop. Repeat contacts, cancellation language, anything legal or contractual, anything a confident answer would make worse. It writes the handover summary so the person picking it up is not starting cold.',
    sees: ['Ticket history for that account', 'Account owner, plan and renewal date', 'Who is on shift'],
  },
];

const RAILS = [
  {
    h: 'Every answer shows what it came from',
    p: 'Retrieval is citation-controlled: the agent can only assert something it can point at, and the source appears with the reply. If the supporting content is not there, it does not improvise a plausible version.',
  },
  {
    h: 'Not answering is a valid outcome',
    p: 'Confidence thresholds and hard categories send a ticket to a person untouched. We would rather a customer wait twenty minutes for a correct human answer than get an instant wrong one they act on.',
  },
  {
    h: 'Read access is narrow and per agent',
    p: 'The debugging agent cannot see billing. The knowledge agent cannot see the database. Each one gets the minimum it needs for its category, scoped to the tenant it is answering about, and the access is logged.',
  },
  {
    h: 'Writes are the exception, not the default',
    p: 'Most of the value is in reading and explaining. Where an action is genuinely safe and reversible it is automated; refunds, cancellations, credits and anything contractual queue for approval instead.',
  },
  {
    h: 'You can read the reasoning afterwards',
    p: 'Every conversation stores which agent handled it, what it retrieved, what it decided and why it escalated. When something goes wrong you get a trace, not a shrug — and that trace is what makes the next version better.',
  },
];

const SCOPE = [
  'A read of your last few thousand tickets, sorted into what is actually being asked',
  'Routing rules and categories agreed with your team, not inferred',
  'Retrieval over your help centre, docs and internal notes, with citations',
  'Read-only connections to the systems that hold the real answers',
  'Confidence thresholds and the categories that must always reach a human',
  'Escalation summaries written for the person picking the ticket up',
  'Deployment into Intercom, Zendesk, WhatsApp, email or your own app',
  'A review queue and a way to correct the system when it gets one wrong',
  'Logging, traces and a weekly view of what it handled and what it refused',
  'Documentation and handover, running in your own accounts and keys',
];

const OUTSIDE = [
  'Rewriting your help centre. We will tell you which gaps matter most, and that is often the highest-value work — but it is a content project with its own scope.',
  'Replacing your helpdesk. This sits on top of Intercom, Zendesk or whatever you run today.',
  'Staffing. We do not provide support agents, only the system your agents work alongside.',
  'A guaranteed deflection percentage. Anyone quoting you one before reading your tickets is guessing.',
];

const FAQS = [
  {
    q: 'We already have Zendesk AI / Intercom Fin. Why would we build anything?',
    a: 'Often you would not, and that is a real answer rather than a polite one. Both are genuinely good at the part of your queue that a well-written help centre already covers, and if that is most of your volume, the off-the-shelf agent is the cheaper and faster buy. The case for building starts when a large share of your tickets need something only your own systems know — the state of this order, this job, this subscription, this error — or when per-resolution pricing at your volume has stopped looking like a bargain. Send us a few hundred anonymised tickets and we will tell you which situation you are in before quoting anything.',
  },
  {
    q: 'Is it true that these tools can only answer from help centre articles?',
    a: 'No, and it is worth being precise because the shorthand gets repeated a lot. Both Zendesk and Intercom support custom actions that can call your APIs, and Intercom publishes a developer platform for exactly that. The practical difference is where the orchestration lives and what it costs to maintain: building deep, multi-step, multi-system behaviour inside a vendor framework means modelling your logic in their abstractions, on their release cycle, priced per resolution. Owning the orchestration means the routing, the retrieval, the access scoping and the escalation rules are yours to change. For simple lookups the vendor route is usually the better trade. For anything shaped like real diagnosis, it usually is not.',
  },
  {
    q: 'What deflection rate should we actually expect?',
    a: 'Lower than the marketing suggests and higher than a sceptic assumes. Independent analyses through 2026 put well-tuned deployments in roughly the twenty to forty-five percent range after several months of iteration, against vendor case studies quoting fifty to eighty. The single biggest determinant is not the model, it is whether the answers exist anywhere the system can reach. If a third of your tickets ask something no document and no system can answer, then a third of your tickets are not automatable at any price, and we would rather tell you that at the start.',
  },
  {
    q: 'How do you stop it inventing an answer?',
    a: 'Three ways, and none of them is prompt wording. Retrieval is citation-controlled, so an answer has to be traceable to a source or the agent does not make it. Confidence thresholds hand the ticket to a person rather than producing a lower-quality reply. And each agent has a narrow, defined job, which makes it far harder for the system to drift into territory it has no grounding in. Hallucination is largely an architecture problem, not a wording problem.',
  },
  {
    q: 'What can the system actually see about our customers?',
    a: 'Exactly what you scope it to, per agent, and no more. The debugging agent cannot read billing; the knowledge agent cannot read the database. Access is read-only by default, restricted to the tenant being asked about, and logged. Where the work touches regulated data — payment details, health information, anything with a specific legal regime — the applicable requirements are part of the design conversation rather than an assumption, and we scope the data flows to match what actually applies to you.',
  },
  {
    q: 'Can it take actions, or only reply?',
    a: 'It can act, but the default is deliberately conservative. Safe and reversible things — resending a receipt, retrying a failed job, updating a preference — are automated. Anything that moves money, ends a contract or is hard to undo is queued for a person with the reasoning attached. The point is not to maximise how much the system does on its own; it is to make sure every action it takes is one you would have approved anyway.',
  },
  {
    q: 'How long does it take and what does it cost?',
    a: 'It depends on how many categories you want covered and how many systems have to be reached, so there is no list price. The first step is small and concrete: we read a sample of your real tickets, sort them into what is answerable from documentation, what needs live data, and what needs a human, and come back with a scope, an acceptance definition and a fixed price before any build starts.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'Customer Service Automation & AI Support Agents',
        serviceType: 'Customer service automation, AI support agent development and helpdesk integration',
        description:
          'Custom multi-agent customer service automation: query routing, citation-controlled retrieval over help centre and internal documentation, scoped read access to billing, job and log data, defined escalation to humans, and deployment into Intercom, Zendesk, WhatsApp or a custom application.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'Customer Service Automation', item: `${site.url}/${SLUG}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <div className={s.page}>
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Customer Service Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={s.hero} aria-labelledby="h">
        <div>
          <p className={s.eyebrow}><i />CUSTOMER SERVICE AUTOMATION · AI SUPPORT AGENTS</p>
          <h1 id="h">Your help centre is <em>the ceiling.</em></h1>
          <p className={s.heroCopy}>
            Every support bot you can buy answers from your documentation. So the tickets it deflects
            are the ones you had already answered — and the ones that actually cost you time still
            land on a person, because the answer lives in your billing system, your job queue or your
            logs. We build the agents that can read those.
          </p>
          <div className={s.heroActions}>
            <BookButton location={`support-hero:${SLUG}`} className={s.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#mix" className={s.ghost}>See where the ceiling is <span aria-hidden="true">↓</span></a>
          </div>
          <p className={s.heroNote}>
            Sits on top of Intercom, Zendesk, WhatsApp or your own app.
            <span>We are not replacing your helpdesk, and we will tell you when the built-in AI is the better buy.</span>
          </p>
        </div>
        <HeroStage art="blooming-horn" position="60% 50%"><TriageBench /></HeroStage>
      </section>

      <div className={s.strip} aria-label="Systems we work with">
        <span>THE SURFACE.<br /><b>WHERE IT RUNS.</b></span>
        <b>Intercom</b><span>Zendesk</span><span>WhatsApp</span><span>Slack</span><span>Your app</span><span>n8n</span>
      </div>

      {/* ── 01 the meter ─────────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s1">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />01 / THE THING NOBODY MODELS FIRST</p>
            <h2 id="s1">Support AI is now sold<br /><em>by the answer.</em></h2>
          </div>
          <p>Which is fair, and often good value. It is also a cost that grows with the exact thing you are trying to grow, so it is worth doing the arithmetic before you are locked into it.</p>
        </div>
        <div className={s.meter}>
          <div className={s.card}>
            <span>INTERCOM FIN</span>
            <h3>Priced per resolved outcome</h3>
            <p className={s.price}><b>$0.99</b><span>per outcome</span></p>
            <p>Intercom publishes Fin at $0.99 per outcome across its plans, where an outcome is a resolution, a procedure handoff or a disqualification. Lead qualification is billed separately and higher.</p>
            <p>Good economics when a resolution genuinely saves a person twenty minutes. Less obviously good at high volume on questions that were cheap to answer anyway.</p>
            <cite>Source: Intercom&rsquo;s published Fin pricing, as of September 2026.</cite>
          </div>
          <div className={s.card}>
            <span>ZENDESK AI AGENTS</span>
            <h3>Priced per verified resolution</h3>
            <p className={s.price}><b>~$1.50</b><span>per resolution</span></p>
            <p>Zendesk moved to outcome-based billing and, since May 2026, charges only for a verified resolution — the AI answered, a check confirmed it solved the issue, and the customer did not escalate. Escalated conversations are not billed.</p>
            <p>Independent 2026 analyses put the effective rate near $1.50 on committed volume and around $2.00 pay-as-you-go, falling at scale, on top of seat licences.</p>
            <cite>Zendesk publishes the model; the per-resolution figures are third-party estimates, not a list price. Check your own quote.</cite>
          </div>
          <div className={s.card}>
            <span>A SYSTEM YOU OWN</span>
            <h3>Priced once, then run at cost</h3>
            <p className={s.price}><b>No</b><span>per-resolution fee</span></p>
            <p>You pay for the build, then for the model usage and hosting underneath it — which for most support volumes is cents, not dollars, per conversation. Nothing about your cost curve punishes you for growing.</p>
            <p>The trade is real and worth stating: you now own a system. It needs maintaining, and it only makes sense past a certain volume or complexity. Below that, buy the vendor one.</p>
            <cite>We will do this arithmetic with your actual ticket numbers on the first call, including when it says do not build.</cite>
          </div>
        </div>
      </section>

      {/* ── 02 ticket mix ────────────────────────────────────────────── */}
      <section id="mix" className={`${s.band} ${s.sunken}`} aria-labelledby="s2">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />02 / SORT YOUR OWN QUEUE</p>
            <h2 id="s2">Four kinds of ticket.<br /><em>Only one is documented.</em></h2>
          </div>
          <p>Before anyone quotes you a deflection rate, this is the split that decides it. The proportions vary enormously by business — which is why we read your tickets rather than assume.</p>
        </div>
        <div className={s.mix}>
          <div>
            <p className={s.mixNote}>
              Vendor AI is measured against the whole queue, but it can only reach the first band. If
              a third of your tickets ask something no document contains, a third of your tickets are
              not deflectable at any price, by anyone, until something else can read the answer.
            </p>
            <p className={s.mixNote}>
              That is the entire argument on this page. Everything we build is aimed at bands two and
              three — and at being honest about band four rather than papering over it.
            </p>
            <p className={s.mixNote}>
              The bars below are illustrative shapes, not your numbers. Getting your actual numbers
              takes us about a week with a ticket export.
            </p>
          </div>
          <div className={s.bars}>
            <div className={s.barItem}>
              <div className={s.barTop}><h3>Answerable from documentation</h3><b>bought, not built</b></div>
              <div className={s.track}><i style={{ width: '38%' }} /></div>
              <p>&ldquo;How do I change the billing email?&rdquo; The answer is written down and applies to everyone. <b>Off-the-shelf AI handles this well.</b> If this is most of your queue, buy it and skip us.</p>
            </div>
            <div className={s.barItem}>
              <div className={s.barTop}><h3>Needs this customer&rsquo;s live state</h3><b>where we start</b></div>
              <div className={s.track}><i style={{ width: '27%' }} /></div>
              <p>&ldquo;Why was I charged twice?&rdquo; There is a correct answer, but it exists in your billing system for this account only. <b>Needs scoped read access, not better documentation.</b></p>
            </div>
            <div className={s.barItem}>
              <div className={s.barTop}><h3>Needs someone to look at the logs</h3><b>the expensive band</b></div>
              <div className={s.track}><i style={{ width: '21%' }} /></div>
              <p>&ldquo;The export has been stuck for two hours.&rdquo; Today this interrupts an engineer. <b>An agent that can read the job and the error resolves most of these without one.</b></p>
            </div>
            <div className={s.barItem}>
              <div className={s.barTop}><h3>Should reach a person quickly</h3><b>protect this band</b></div>
              <div className={s.track}><i style={{ width: '14%' }} /></div>
              <p>Cancellations, complaints, anything contractual, anything already escalated twice. <b>The measure of a good system here is how fast it gets out of the way.</b></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 agents ────────────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s3">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />03 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s3">Six narrow agents,<br /><em>not one clever one.</em></h2>
          </div>
          <p>A single agent with access to everything is both worse at the job and harder to trust. Splitting by question type means each one has a small remit, a small blast radius and a scope you can read.</p>
        </div>
        <div className={s.agents}>
          {AGENTS.map(a => (
            <article key={a.n} className={s.agent}>
              <span>{a.n}</span>
              <h3>{a.name}</h3>
              <p>{a.p}</p>
              <div className={s.seesBlock}>
                <p className={s.seesLabel}>What it can read</p>
                <ul className={s.sees}>{a.sees.map(x => <li key={x}>{x}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 04 guardrails ────────────────────────────────────────────── */}
      <section className={`${s.band} ${s.sunken}`} aria-labelledby="s4">
        <div className={s.rails}>
          <div>
            <p className={s.eyebrow}><i />04 / THE PART THAT DECIDES IF YOU KEEP IT</p>
            <h2 id="s4">A wrong answer<br /><em>costs more than no answer.</em></h2>
            <p className={s.mixNote}>
              Support automation does not usually get switched off because it was slow. It gets
              switched off because it confidently told a customer something untrue and somebody had
              to clean it up. These five rules exist because of that.
            </p>
            <div className={s.railStamp}>Say less.<br /><strong>Be right.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <ol className={s.railList}>
            {RAILS.map(r => (
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
      <section className={s.band} aria-labelledby="s5">
        <div className={s.scope}>
          <div>
            <p className={s.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">It starts by reading<br /><em>your real tickets.</em></h2>
            <p className={s.lede}>
              Not a workshop and not a maturity assessment. A sample of what your customers actually
              wrote, sorted into what can be answered and by what. That read is what the scope and
              the price are built from.
            </p>
          </div>
          <div>
            <ul className={s.scopeList}>
              {SCOPE.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}<b aria-hidden="true">↗</b></li>)}
            </ul>
            <details className={s.outside}>
              <summary>What sits outside the scope <span aria-hidden="true">+</span></summary>
              <ul>{OUTSIDE.map(x => <li key={x}>{x}</li>)}</ul>
            </details>
          </div>
        </div>
      </section>

      {/* ── proof ────────────────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s6">
        <div className={s.proof}>
          <div>
            <p className={s.eyebrow}><i />RELEVANT WORK</p>
            <h2 id="s6">Where this came from.</h2><ProofArt art="crt-head" />
          </div>
          <div>
            <h3>Retrieval that has to cite, because the answers had consequences</h3>
            <p>
              The architecture on this page did not start in support. It came out of building
              retrieval systems for document-heavy work where an unsupported answer was not an
              inconvenience but a liability — which is where the citation-controlled retrieval, the
              confidence thresholds and the refusal behaviour were all forced on us.
            </p>
            <p>
              Support turned out to need the same discipline for the same reason. The interesting
              part of the work is rarely the model; it is deciding which agent may read what, and
              what the system does when it is not sure.
            </p>
            <Link className={s.proofLink} href="/ai-workspace-setup">How connected AI workspaces are built <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={s.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={s.eyebrow}><i />06 / SEND US YOUR TICKETS</p>
          <h2 id="s7">Let us tell you<br />what is <em>actually automatable.</em></h2>
          <p>
            Export a few hundred recent tickets, anonymised. We will sort them into the four bands
            above and come back with a number you can trust — including the possibility that the
            answer is to fix your help centre and buy the built-in agent.
          </p>
          <ol className={s.closeList}>
            <li>What your queue is really made of</li>
            <li>Which bands are worth automating at your volume</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={s.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={s.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us what your support queue looks like and which tool you run today." />
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className={s.faq} aria-labelledby="s8">
        <div>
          <p className={s.eyebrow}><i />A FEW GOOD QUESTIONS</p>
          <h2 id="s8">Before you start.</h2>
        </div>
        <div>
          {FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <nav className={s.related} aria-label="Related solutions">
        <span>Related solutions</span>
        <Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link>
        <Link href="/ai-automation">AI Workflow Automation ↗</Link>
        <Link href="/crm-automation-services">CRM Automation ↗</Link>
      </nav>
    </div>
  );
}
