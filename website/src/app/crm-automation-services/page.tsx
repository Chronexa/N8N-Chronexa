import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { CommandCentre, BuildTabs } from './CrmInteractive';
import s from './crm.module.css';

const SLUG = 'crm-automation-services';
const TITLE = 'CRM Automation, Custom CRM & Airtable Builds | Chronexa';
const DESCRIPTION =
  'We build the layer that keeps a CRM current: records created from real activity, approvals in Slack, nightly data checks, and custom CRMs on Airtable and n8n.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const SCOPE = [
  'A written data model: tables, relationships and who owns each field',
  'An honest platform call, including when your current CRM is fine',
  'Automatic record creation from email, forms, calls and referrals',
  'Matching and enrichment, so duplicates are not created in the first place',
  'Routing rules by territory, workload or seniority',
  'Slack or Teams approvals, alerts and a daily digest',
  'Scheduled checks for stale deals, missing fields and overdue accounts',
  'Connections to accounting, support, calendar and email',
  'Reporting built last, on records that are actually current',
  'Documentation and a handover call, in your own accounts',
];

const OUTSIDE = [
  'CRM licences. They stay in your name and on your account, which is the point.',
  'Sales methodology or training. We build the system; you run the process.',
  'Cleaning historic data beyond an agreed scope. Twelve years of duplicates is its own project.',
  'Migrating more than one source system per engagement without agreeing it first.',
];

const FAQS = [
  {
    q: 'We already pay for HubSpot. Are you going to tell us to move?',
    a: 'Probably not, and we will say so on the first call if that is the answer. Most of what makes a CRM feel broken is the missing work around it — records that never get created, systems that do not talk, nobody warned when something changes. That is fixable without touching the platform. We only recommend moving when you are genuinely fighting the software every week.',
  },
  {
    q: 'Why do you reach for Airtable so often?',
    a: 'Because a lot of businesses are not running a textbook sales pipeline. They are tracking projects, properties, cases, shipments, applications or clients through stages a CRM was never designed for, and they end up bending an expensive tool into a shape it resists. Airtable lets us model what the business actually does, and n8n does the orchestration around it. When a normal pipeline genuinely fits, a normal CRM is the cheaper answer and we will tell you.',
  },
  {
    q: 'Is this just Zapier with extra steps?',
    a: 'No, and the difference matters when something breaks. Point-to-point automations are fine until you have forty of them and no idea which one wrote the wrong value. We build a data model first, decide which system owns which field, then orchestrate on top with retries, error handling, logging and a human review path for anything ambiguous.',
  },
  {
    q: 'Our CRM data is a mess. Do we have to fix that first?',
    a: 'It is the normal starting point and no, not all of it. We agree a scope: usually duplicates, dead records and the fields that people actually use. Cleaning everything back to the beginning is rarely worth what it costs, and we will say so rather than bill you for it.',
  },
  {
    q: 'Will automation overwrite something a person deliberately changed?',
    a: 'It is designed not to. Every field has one system that owns it, and where a person has made a deliberate change the automation does not quietly reverse it. Conflicts surface for review instead of being resolved silently in the background, because a sync war is worse than a stale field.',
  },
  {
    q: 'Can an AI agent actually be trusted with our CRM?',
    a: 'With read access, yes, and that is where most of the value is: answering questions from the records, summarising an account before a call, drafting a follow-up from the real thread. Write access is deliberately narrow, permissioned per field and logged. An agent that can change anything is a liability, not a feature.',
  },
  {
    q: 'What does it cost?',
    a: 'Every engagement is priced to its own scope, so there is no list price. After a discovery call we write down what the system has to do, what counts as working, and what it costs — before any build starts.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'CRM Automation & Custom CRM Development',
        serviceType: 'CRM automation, custom CRM development and system integration',
        description:
          'CRM automation and custom CRM builds: data modelling, automatic record creation and enrichment, routing, Slack approvals, scheduled data checks, integration with accounting and support systems, and AI agents over CRM records. Built on Airtable and n8n, or on an existing CRM.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'CRM Automation', item: `${site.url}/${SLUG}` },
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
      <TrackView event="service_view" props={{ slug: SLUG, name: 'CRM Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={s.hero} aria-labelledby="h">
        <div>
          <p className={s.eyebrow}><i />CRM AUTOMATION · CUSTOM CRM ON AIRTABLE</p>
          <h1 id="h">Every CRM is accurate for <em>about a month.</em></h1>
          <p className={s.heroCopy}>
            Then a busy week happens. Records go stale, the reporting stops matching reality, and
            somebody quietly starts keeping their own spreadsheet. We build the layer that keeps the
            record current from the work itself, so being up to date stops depending on anyone
            remembering.
          </p>
          <div className={s.heroActions}>
            <BookButton location={`crm-hero:${SLUG}`} className={s.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#build" className={s.ghost}>See what we build <span aria-hidden="true">↓</span></a>
          </div>
          <p className={s.heroNote}>
            Usually Airtable and n8n. Sometimes the CRM you already own.
            <span>The platform call is part of the work, not a decision we make before meeting you.</span>
          </p>
        </div>
        <CommandCentre />
      </section>

      <div className={s.strip} aria-label="Tools we work with">
        <span>THE STACK.<br /><b>WHAT WE CONNECT.</b></span>
        <b>Airtable</b><span>n8n</span><span>Slack</span><span>HubSpot</span><span>Salesforce</span><span>Gmail</span>
      </div>

      {/* ── 01 recognition ───────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s1">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />01 / YOU ALREADY KNOW IF THIS IS YOU</p>
            <h2 id="s1">Nobody decides to stop<br /><em>trusting the CRM.</em></h2>
          </div>
          <p>It goes wrong quietly, in four fairly predictable ways. Most teams have at least two of them running right now.</p>
        </div>
        <div className={s.symptoms}>
          <article>
            <div className={s.tile}>
              <span className={s.chip}>forecast_v4_FINAL.xlsx</span>
              <div className={s.rowLine}><span>CRM says</span><b>$310k</b></div>
              <div className={s.rowLine}><span>The spreadsheet says</span><b>$194k</b></div>
            </div>
            <span>01 / THE PRIVATE SPREADSHEET</span>
            <h3>The real pipeline lives on someone&rsquo;s laptop.</h3>
            <p>The number quoted in the Monday meeting does not come from the CRM, because the CRM&rsquo;s version is wrong. You are now paying for the system twice and only one copy is right.</p>
          </article>
          <article>
            <div className={s.tile}>
              <div className={s.rowLine}><span>Finance</span><b className={s.miss}>92 days overdue</b></div>
              <div className={s.rowLine}><span>Support</span><b className={s.miss}>3 open tickets</b></div>
              <div className={s.rowLine}><span>On the record</span><b>—</b></div>
            </div>
            <span>02 / THE CALL NOBODY WARNED YOU ABOUT</span>
            <h3>Sales rings an account that finance has flagged.</h3>
            <p>The information existed in the business. Accounting knew, support knew. It just did not exist on the record of the person about to pick up the phone.</p>
          </article>
          <article>
            <div className={s.tile}>
              <span className={s.chip}>Month end</span>
              <div className={s.barRow}><i style={{ height: '92%' }} /><i style={{ height: '78%' }} /><i style={{ height: '30%' }} /><i style={{ height: '22%' }} /><i style={{ height: '55%' }} /><i style={{ height: '18%' }} /></div>
            </div>
            <span>03 / TWO DAYS OF ARCHAEOLOGY</span>
            <h3>The monthly report has to be assembled by hand.</h3>
            <p>Exports, pasting, and chasing three people for updates before the meeting. By the time it is finished it is describing a situation that has already moved on.</p>
          </article>
          <article>
            <div className={s.tile}>
              <span className={s.chip}>40 licences · 11 users</span>
              <div className={s.seatGrid}>{Array.from({ length: 40 }, (_, i) => <i key={i} className={i < 11 ? s.on : undefined} />)}</div>
            </div>
            <span>04 / SEATS THAT NOBODY OPENS</span>
            <h3>You are paying per seat for a tool most people avoid.</h3>
            <p>The rest of the team works out of their inbox and tells somebody else what happened. Every one of those handovers is a place the record silently stops being true.</p>
          </article>
        </div>
      </section>

      {/* ── 02 what we build ─────────────────────────────────────────── */}
      <section id="build" className={`${s.band} ${s.sunken}`} aria-labelledby="s2">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />02 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s2">Six pieces,<br /><em>in this order.</em></h2>
          </div>
          <p>Not every project needs all six. The order matters more than the list — reporting built on records nobody trusts just automates a wrong number.</p>
        </div>
        <BuildTabs />
      </section>

      {/* ── 03 platform call ─────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s3">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />03 / THE PLATFORM CALL</p>
            <h2 id="s3">The honest answer is<br /><em>sometimes &ldquo;keep what you have.&rdquo;</em></h2>
          </div>
          <p>We do not sell a platform, so we have nothing to defend. This is roughly how the call goes.</p>
        </div>
        <div className={s.calls}>
          <div className={s.call}>
            <h3>Build it on Airtable</h3>
            <span>OUR USUAL STARTING POINT</span>
            <ul>
              <li>Your process is not a sales pipeline — it is matters, projects, properties, applications or clients moving through stages</li>
              <li>You need objects a CRM does not have, and you are tired of abusing custom fields</li>
              <li>Operations, delivery and sales all need the same records, and per-seat pricing across that many people stops making sense</li>
              <li>You want the schema to change as the business changes, without a consultant every time</li>
            </ul>
          </div>
          <div className={s.call}>
            <h3>Keep your CRM, fix around it</h3>
            <span>MORE OFTEN THAN PEOPLE EXPECT</span>
            <ul>
              <li>You run a fairly standard sales motion and the pipeline shape genuinely fits</li>
              <li>The team already lives in it, and moving would cost more in disruption than it returns</li>
              <li>What is actually broken is the connective work: intake, routing, the systems that never talk</li>
              <li>You have compliance or reporting tied to the platform that is not worth unpicking</li>
            </ul>
          </div>
          <div className={s.call}>
            <h3>Build something custom</h3>
            <span>THE RARE CASE</span>
            <ul>
              <li>The volume or the logic is beyond what a no-code base will hold reliably</li>
              <li>You need it embedded in a product your customers use, not an internal tool</li>
              <li>There are data residency or audit requirements that decide the architecture for you</li>
              <li>We will tell you if this is you. It is the most expensive answer and it is usually not the right one.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 04 engagement ────────────────────────────────────────────── */}
      <section className={`${s.band} ${s.sunken}`} aria-labelledby="s4">
        <div className={s.scope}>
          <div>
            <p className={s.eyebrow}><i />04 / THE ENGAGEMENT</p>
            <h2 id="s4">Agreed in writing<br /><em>before anything is built.</em></h2>
            <p className={s.lede}>
              Scope, what counts as working, and the price. Built in your own accounts, documented,
              and exportable — a system you cannot leave is a system that can charge you anything later.
            </p>
            <div className={s.stamp}>Built for you.<br /><strong>Owned by you.</strong><span aria-hidden="true">↗</span></div>
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
      <section className={s.band} aria-labelledby="s5">
        <div className={s.proof}>
          <div>
            <p className={s.eyebrow}><i />RELEVANT WORK</p>
            <h2 id="s5">We run this ourselves.</h2>
          </div>
          <div>
            <h3>Our own CRM is an Airtable base with n8n around it</h3>
            <p>
              Lead capture, enrichment, scoring, routing, campaign state and follow-up all run through
              it, and the approvals land in Slack. It is the same architecture we describe above,
              which is why we are comfortable recommending it — and why we can tell you honestly
              where it gets awkward.
            </p>
            <p>
              We have also built the other version: automation layered onto a CRM a client already
              ran, because moving would have cost more than it returned. Judging which of those a
              business needs is most of the value, and it is the part worth a call before anything
              is quoted.
            </p>
            <Link className={s.proofLink} href="/case-studies/b2b-crm-lead-routing-follow-up-automation">Read the lead routing case study <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={s.close} id="talk" aria-labelledby="s6">
        <div>
          <p className={s.eyebrow}><i />05 / START WITH ONE PROCESS</p>
          <h2 id="s6">Show us where the<br />record <em>stops being true.</em></h2>
          <p>
            A discovery call covers what you run today, where records come from, and which systems
            already know things the CRM does not. You get a straight answer on whether this is a
            platform problem or a plumbing problem.
          </p>
          <ol className={s.closeList}>
            <li>What is breaking, and how often</li>
            <li>Whether to keep, extend or replace what you have</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={s.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={s.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us what your CRM is missing. We will read it before the call." />
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────── */}
      <section className={s.faq} aria-labelledby="s7">
        <div>
          <p className={s.eyebrow}><i />A FEW GOOD QUESTIONS</p>
          <h2 id="s7">Before you start.</h2>
        </div>
        <div>
          {FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <nav className={s.related} aria-label="Related solutions">
        <span>Related solutions</span>
        <Link href="/ai-sales-outreach-engine">AI Sales &amp; Outreach Engine ↗</Link>
        <Link href="/document-processing-automation">Document Data Extraction ↗</Link>
        <Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link>
      </nav>
    </div>
  );
}
