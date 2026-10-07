import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { OutreachBench } from './SalesInteractive';
import s from './sales.module.css';

const SLUG = 'ai-sales-outreach-engine';
const TITLE = 'AI SDR & Outbound Sales Engine Development | Chronexa';
const DESCRIPTION =
  'Signal-triggered outbound engines: buying-signal detection, research per prospect, drafts held for human review, sending infrastructure and CRM write-back.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const MODES = [
  {
    n: 'A',
    h: 'It is a deliverability problem wearing a copywriting costume',
    p: 'The reply rate is near zero, so the team rewrites the subject line. But the messages were never seen — they went to spam, or to a domain that had already been burned by the last sequence. Every fix aimed at the copy makes no difference, because the copy was never the variable.',
    p2: 'This is the single most common cause of a dead outbound programme, and it is invisible from inside the sending tool, which cheerfully reports them as delivered.',
    tell: 'Tell: open rates that look fine but replies at zero',
  },
  {
    n: 'B',
    h: 'The list is right on paper and wrong in practice',
    p: 'Correct industry, correct headcount, correct job title — and no reason on earth for any of them to care this week. Firmographic filters describe who could buy. They say nothing about who is currently in a position to.',
    p2: 'Volume then gets used to compensate, which raises complaint rates, which damages the domain, which brings you back to problem A.',
    tell: 'Tell: the ICP is a filter, not a moment',
  },
  {
    n: 'C',
    h: 'Personalisation that everyone can now see through',
    p: 'A first line scraped from LinkedIn, a compliment about growth, a congratulations on the funding round. Buyers have received thousands of these and recognise the pattern instantly — and increasingly so do spam filters.',
    p2: 'Independent 2026 measurement puts AI-written outbound below human-written on replies and meaningfully above it on spam complaints. More personalisation of this kind actively makes things worse.',
    tell: 'Tell: it mentions their company but says nothing about them',
  },
  {
    n: 'D',
    h: 'Nothing that comes back is connected to anything',
    p: 'A reply arrives in a shared inbox. Someone sees it eight hours later, cannot tell what was sent, has no idea whether this account is already in a sequence, and answers from scratch. The interested prospect cools while the sequence keeps sending them step three.',
    p2: 'The engine is judged on emails sent when the number that matters is what happens in the ninety minutes after somebody answers one.',
    tell: 'Tell: nobody can say what happened to last month’s replies',
  },
];

const RAIL = [
  {
    h: 'The signal layer',
    sub: 'WHAT MAKES THIS WEEK DIFFERENT',
    p: 'Before anyone is contacted, something has to have changed: a role posted three times, a funding round, a new tool in the stack, a leadership change, a public complaint about a process you fix. We define which signals actually predict a conversation for your business and build the detection for them.',
    p2: 'This is the part that moves the number. Broadly targeted B2B cold email sits in the low single digits for replies; outreach tied to a specific, verifiable trigger performs several times better, and it is the same email engine either way.',
  },
  {
    h: 'The data layer',
    sub: 'APOLLO, CLAY AND YOUR OWN RECORDS',
    p: 'Building and enriching the list, deduplicating against everyone you have already contacted, suppressing current customers and open opportunities, and keeping the whole thing in one place rather than in four exports on someone’s desktop.',
    p2: 'Clay is genuinely powerful and genuinely a build tool — it rewards someone who can construct the workflow and quietly punishes teams who cannot. Often that is the honest reason a stack is underperforming.',
  },
  {
    h: 'Per-prospect research',
    sub: 'THE STEP MOST STACKS SKIP',
    p: 'For each account the engine reads what is publicly there — the postings, the site, the announcement, the engineering blog — and extracts the two or three specific facts a human researcher would have written down. Not adjectives about the company. Facts you could be wrong about.',
    p2: 'Anything it cannot verify does not get asserted. That constraint is what stops the drafting step producing the confident nonsense in the left-hand column above.',
  },
  {
    h: 'Drafting against the research',
    sub: 'AND AGAINST A LIST OF BANNED MOVES',
    p: 'The model writes from the researched facts only, in your voice, with an explicit list of things it may not do: no invented metrics, no congratulations, no claimed savings, no borrowed case studies, no pretending to have met them.',
    p2: 'Most of the quality comes from those prohibitions rather than from the prompt being clever. An email that says one true specific thing beats a fluent one that says nothing.',
  },
  {
    h: 'The review queue',
    sub: 'A HUMAN GATE THAT IS ACTUALLY USED',
    p: 'Drafts land somewhere a person can approve, edit or kill them — Slack or a simple queue — before anything sends. Early on that is every email. As the pattern proves out, categories graduate to sending automatically and the rest stay gated.',
    p2: 'Killing a draft is a first-class outcome. If the research did not turn up a real reason to write, the correct output is no email, and the system is built to produce that.',
  },
  {
    h: 'Sending infrastructure',
    sub: 'THE UNGLAMOROUS HALF',
    p: 'Separate sending domains so your primary domain is never the thing at risk, authentication set up properly, warmed inboxes, volume caps per mailbox, and monitoring that tells you a domain is degrading before the replies stop.',
    p2: 'A note worth its own line: Apollo is a strong data and sequencing product, and its own sending is not built for high-volume cold outbound. Past a couple of hundred a day it is normal to pair it with dedicated sending infrastructure, and we will set that up rather than pretend one tool does everything.',
  },
  {
    h: 'Replies, routing and write-back',
    sub: 'WHERE THE MONEY ACTUALLY IS',
    p: 'Classifying what came back — interested, not now, wrong person, unsubscribe, out of office — stopping the sequence immediately, routing the real ones to a named person with the full thread and the research attached, and writing all of it into the CRM as it happens.',
    p2: 'Referrals to the right contact get followed automatically. Not-now replies go into a dated re-approach list rather than evaporating. This is the least exciting stage and the one that most often turns a flat programme into a working one.',
  },
];

const GATES = [
  {
    h: 'We are not selling you an AI SDR',
    p: 'The category as sold — an autonomous agent that finds, writes to and books prospects with nobody watching — measures worse than a competent human on the numbers that matter. We build the engine around your people, not a replacement for them.',
  },
  {
    h: 'Volume is capped on purpose',
    p: 'Deliverability is a shared resource you can spend but not buy back. Every engine we build has per-domain and per-mailbox limits, and we would rather send four hundred researched emails a week than four thousand that end the year with a burnt domain.',
  },
  {
    h: 'No claim goes out that we cannot evidence',
    p: 'No invented percentages, no borrowed case studies, no results attributed to clients who did not agree to it. Partly because it is dishonest and partly because a specific true observation outperforms a generic impressive one.',
  },
  {
    h: 'You own the accounts and the data',
    p: 'Domains, inboxes, Apollo, Clay, the CRM, the n8n instance — all in your name. If you stop working with us the engine keeps running, which is the only version of this that is fair.',
  },
];

const SCOPE = [
  'A defined ICP plus the buying signals that actually precede a conversation',
  'Signal detection and monitoring across the sources that carry them',
  'List building, enrichment, deduplication and suppression',
  'Per-prospect research that extracts verifiable facts, not adjectives',
  'Drafting in your voice, against explicit rules about what may not be claimed',
  'A review queue in Slack or a simple approval UI, with kill and edit',
  'Sending infrastructure: separate domains, authentication, warmup, caps',
  'Reply classification, sequence halting and routing to a named person',
  'CRM write-back so the pipeline reflects outbound without manual entry',
  'Reporting on replies and conversations, not on emails sent',
];

const OUTSIDE = [
  'Selling. We build the engine; your people take the conversations it produces.',
  'A guaranteed number of meetings. Anyone promising that before seeing your market is guessing, and the guess is usually wrong.',
  'Buying purchased contact lists. It is the fastest way to destroy a sending domain.',
  'Sending on your primary domain. We will not do it, even if asked.',
];

const FAQS = [
  {
    q: 'Should we just buy an AI SDR product instead?',
    a: 'If your motion is simple, your market is large and undifferentiated, and you mainly need volume, then quite possibly yes, and it will be live much faster than anything custom. The reason to build is when your buying signal is specific to your business and no product knows how to detect it, when the research that makes an email land requires reading something a generic tool will not read, or when you already have the tools and the results are flat. It is also worth knowing what the measured performance of the category actually is before you buy on the demo, which is the point of the numbers section on this page.',
  },
  {
    q: 'What reply rate should we expect?',
    a: 'Published 2026 benchmarks put a well-run broad B2B cold email campaign at roughly three to six percent replies, with anything under three usually pointing at targeting or deliverability rather than copy. Campaigns tied to a specific, verifiable trigger — a funding round, a leadership change, a technology adoption, a repeated job posting — are reported in the five to eighteen percent range. We will not quote you a number for your market before running it, and we would treat anyone who does with suspicion. What we will do is instrument it so you can see which signal is producing conversations and which is producing nothing.',
  },
  {
    q: 'We already have Apollo and Clay. Do we need anything else?',
    a: 'Frequently you have most of what you need and the gap is in three places: no signal layer deciding who is worth contacting this week, no research step producing something specific to say, and no reply handling once someone answers. There is also a practical infrastructure point — Apollo is a strong data and sequencing platform, but its native sending is not designed for high-volume cold outbound, so past a couple of hundred sends a day it is normal to add dedicated sending infrastructure alongside it. We are happy to build on the stack you already pay for rather than replace it.',
  },
  {
    q: 'Is AI-written outbound going to hurt our domain?',
    a: 'It can, and the honest reason is worth stating: independent analysis through 2026 found AI-generated outbound replied to slightly less often than human-written and flagged as spam noticeably more. The mechanism is not that models write badly, it is that pattern-identical personalisation at volume looks exactly like what filters and buyers are both trained to reject. That is why every engine we build caps volume, sends from separate domains, runs research before drafting rather than templating around a scraped first line, and keeps a human gate until a category has earned its way out of one.',
  },
  {
    q: 'How do you handle replies that are not a yes?',
    a: 'Deliberately, because that is where most programmes leak. Replies are classified on arrival and the sequence stops immediately regardless of the answer — nothing is worse than step three arriving after someone has already responded. Referrals to a colleague are followed to the right contact. Not-now becomes a dated re-approach with the context preserved, so whoever picks it up in four months is not starting cold. Unsubscribes are honoured everywhere, not just in the tool that sent the message. Only genuine interest reaches a person, with the thread and the original research attached.',
  },
  {
    q: 'Do you do LinkedIn as well as email?',
    a: 'Yes, and usually the two together, since the same signal and the same research should feed both. We are careful about automation on LinkedIn specifically: aggressive tooling there risks the account rather than a domain you can replace, so the sensible pattern is machine-prepared and human-sent, with the research surfaced to the person rather than the action taken for them.',
  },
  {
    q: 'What does it cost and how long does it take?',
    a: 'It depends on how many signals you want detected and how much infrastructure already exists, so there is no list price. The engagement starts with a short piece of work that is valuable on its own: defining the signals that actually precede a deal for you, and auditing what your current sending setup is doing to your deliverability. After that you get a scope, an acceptance definition and a fixed price in writing before any build starts.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'AI SDR & Outbound Sales Engine Development',
        serviceType: 'AI SDR development, outbound sales automation and signal-based prospecting systems',
        description:
          'Custom outbound sales engines: buying-signal detection, list building and enrichment with Apollo and Clay, per-prospect research, AI drafting constrained to verified facts, a human review queue, dedicated sending infrastructure, reply classification and CRM write-back.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'AI Sales & Outreach Engine', item: `${site.url}/${SLUG}` },
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
      <TrackView event="service_view" props={{ slug: SLUG, name: 'AI Sales & Outreach Engine', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={s.hero} aria-labelledby="h">
        <div>
          <p className={s.eyebrow}><i />AI SDR &amp; OUTBOUND ENGINE DEVELOPMENT</p>
          <h1 id="h">The emails are going out.<br /><em>Nothing is coming back.</em></h1>
          <p className={s.heroCopy}>
            So the team rewrites the subject line again. But the thing that separates outbound that
            works from outbound that does not is almost never the copy — it is whether there was a
            reason to write this week, and whether anybody found out something true before writing.
          </p>
          <div className={s.heroActions}>
            <BookButton location={`sales-hero:${SLUG}`} className={s.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#numbers" className={s.ghost}>See the actual benchmarks <span aria-hidden="true">↓</span></a>
          </div>
          <p className={s.heroNote}>
            Built on Apollo, Clay and n8n, in your own accounts.
            <span>Companies in the example are invented. The mechanism is what we are showing you.</span>
          </p>
        </div>
        <OutreachBench />
      </section>

      <div className={s.strip} aria-label="Tools we work with">
        <span>THE STACK.<br /><b>WHAT WE BUILD ON.</b></span>
        <b>Apollo</b><span>Clay</span><span>n8n</span><span>Slack</span><span>HubSpot</span><span>Smartlead</span>
      </div>

      {/* ── 01 the numbers ───────────────────────────────────────────── */}
      <section id="numbers" className={s.band} aria-labelledby="s1">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />01 / THE NUMBERS NOBODY PUTS ON THIS KIND OF PAGE</p>
            <h2 id="s1">The category is oversold.<br /><em>The mechanism is not.</em></h2>
          </div>
          <p>These are published 2026 benchmarks, including the ones that are inconvenient for anybody selling outbound automation. We would rather you knew them before the call than after the invoice.</p>
        </div>
        <div className={s.numbers}>
          <div className={s.stat}>
            <b>3–6%</b>
            <span>REPLY RATE, BROAD B2B COLD EMAIL</span>
            <p>What a well-run but broadly targeted campaign returns. Below three percent generally indicates a targeting or deliverability fault rather than weak writing — which is why rewriting the copy so rarely fixes it.</p>
          </div>
          <div className={s.stat}>
            <b>5–18%</b>
            <span>REPLY RATE, SIGNAL-TRIGGERED OUTREACH</span>
            <p>Outreach tied to a specific verifiable trigger — a funding round, a leadership change, a technology adoption, a repeatedly reposted role. Same infrastructure, same writers. The variable is timing and specificity.</p>
          </div>
          <div className={s.stat}>
            <b>8% vs 3%</b>
            <span>SPAM-FLAG RATE, AI VS HUMAN WRITTEN</span>
            <p>In the same analysis, AI-written outbound replied slightly below human-written and was flagged as spam more than twice as often. Automation applied without judgement does not just underperform — it costs you the domain.</p>
          </div>
        </div>
        <p className={s.sourceNote}>
          Sources: reply-rate benchmarks published by Apollo for 2026 cold outreach, and an independent
          2026 analysis of roughly 100,000 AI-sent outbound emails. Ranges vary by market and by how a
          reply is counted — treat them as the shape of the problem, not as a promise about yours.
        </p>
      </section>

      {/* ── 02 failure modes ─────────────────────────────────────────── */}
      <section className={`${s.band} ${s.sunken}`} aria-labelledby="s2">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />02 / FOUR WAYS IT DIES</p>
            <h2 id="s2">You probably have<br /><em>two of these running.</em></h2>
          </div>
          <p>Every dead outbound programme we have looked at failed in one of these four places, and in almost none of them was the diagnosis the one the team had arrived at.</p>
        </div>
        <div className={s.modes}>
          {MODES.map(m => (
            <article key={m.n} className={s.mode}>
              <b>{m.n}</b>
              <div>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
                <p>{m.p2}</p>
                <span className={s.tell}>{m.tell}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 03 the build ─────────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s3">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />03 / WHAT WE ACTUALLY BUILD</p>
            <h2 id="s3">Seven stages.<br /><em>Most stacks have three.</em></h2>
          </div>
          <p>The missing four are almost always the signal layer, the research step, the review gate and the reply handling — which is to say, all of the parts that are not the sending.</p>
        </div>
        <ol className={s.rail}>
          {RAIL.map(r => (
            <li key={r.h}>
              <h3>{r.h}<span>{r.sub}</span></h3>
              <div>
                <p>{r.p}</p>
                <p>{r.p2}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 04 the gate ──────────────────────────────────────────────── */}
      <section className={`${s.band} ${s.sunken}`} aria-labelledby="s4">
        <div className={s.gate}>
          <div>
            <p className={s.eyebrow}><i />04 / HOW WE WILL NOT BUILD IT</p>
            <h2 id="s4">Four rules that<br /><em>cost us volume.</em></h2>
            <p className={s.lede}>
              Some of these will read as us arguing against our own upsell. They are here because
              outbound is the one system where doing more of it badly damages an asset you cannot
              simply repurchase.
            </p>
            <div className={s.gateStamp}>Fewer emails.<br /><strong>Real ones.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <ul className={s.gateList}>
            {GATES.map(g => (
              <li key={g.h}>
                <h3>{g.h}</h3>
                <p>{g.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 05 engagement ────────────────────────────────────────────── */}
      <section className={s.band} aria-labelledby="s5">
        <div className={s.scope}>
          <div>
            <p className={s.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">Signals first,<br /><em>sending last.</em></h2>
            <p className={s.lede}>
              The first piece of work is defining what actually precedes a deal for you, and auditing
              what your current setup is doing to your deliverability. Both are useful even if you
              never build anything with us.
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
            <h2 id="s6">We run this on ourselves.</h2>
          </div>
          <div>
            <h3>Our own outbound engine is the architecture on this page</h3>
            <p>
              Lead capture and enrichment in our own CRM, research per prospect, drafting against the
              research, a human approval queue, then sending — with the whole thing orchestrated in
              n8n. Every stage described above exists because we needed it, and several of the rules
              in the previous section exist because we learned them the expensive way.
            </p>
            <p>
              We will talk you through what that programme has and has not produced for us, with the
              real numbers, on a call. It is a more useful conversation than a case study, and it is
              the fastest way for you to judge whether we know what we are talking about.
            </p>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={s.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={s.eyebrow}><i />06 / START WITH THE SIGNAL</p>
          <h2 id="s7">What has to be true<br />for someone to <em>need you this month?</em></h2>
          <p>
            That question is the whole engagement in one line. If you can answer it, we can usually
            detect it. Bring your current setup and we will tell you whether the problem is the
            targeting, the infrastructure or the writing — and it is very rarely the writing.
          </p>
          <ol className={s.closeList}>
            <li>The signals that actually precede a deal for you</li>
            <li>What your current sending is doing to your domain</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={s.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={s.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us what you sell, who to, and what your outbound is doing today." />
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
        <Link href="/crm-automation-services">CRM Automation ↗</Link>
        <Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link>
        <Link href="/ai-automation">AI Workflow Automation ↗</Link>
      </nav>
    </div>
  );
}
