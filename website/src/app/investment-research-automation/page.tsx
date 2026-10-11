import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import TrackView from '../../components/TrackView';
import ScrollDepth from '../../components/ScrollDepth';
import { ResearchDesk } from './ResearchInteractive';
import st from '../../styles/studio.module.css';
import c from './research.module.css';
import HeroStage, { ProofArt } from '../../components/visual/HeroStage';

const SLUG = 'investment-research-automation';
const TITLE = 'Investment Research & Portfolio Data Automation | Chronexa';
const DESCRIPTION =
  'Portfolio consolidation, screening and risk monitoring for RIAs and investment firms — built on Plaid, Yodlee and market data, with reproducible records.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `/${SLUG}`, type: 'website', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
};

const SUBS = [
  {
    h: 'The SEC has already charged firms over AI claims',
    p: 'In March 2024 it brought actions against two investment advisers for statements about AI and machine-learning capabilities they did not actually have. The enforcement risk here is not hypothetical and it does not require anything to go wrong with the portfolio.',
  },
  {
    h: 'An AI claim is an advertisement',
    p: 'The Marketing Rule governs advertisements including AI-generated content and any performance figures attached to them, and it prohibits untrue or unsubstantiated statements and cherry-picked results. A capability you cannot evidence is a marketing problem before it is a technology problem.',
  },
  {
    h: 'Your compliance programme has to mention it',
    p: 'The compliance-rule requirement is for written policies reasonably designed to prevent violations. If AI is being used materially in your process, policies that are silent on it are not reasonably designed — and silence is the default state at most firms right now.',
  },
  {
    h: 'And the records have to exist afterwards',
    p: 'Books-and-records obligations mean the material behind a performance figure has to be retained. That has a direct architectural consequence: every run has to be reproducible, with its data vintage, its criteria and its output kept — which is why that appears on every tab of the demo above.',
  },
];

const MODELS = [
  {
    cls: 'yes',
    h: 'Gradient-boosted trees',
    sub: 'XGBoost, LightGBM',
    p: 'Genuinely strong on the tabular, feature-rich problems this industry actually has: ranking a universe against stated criteria, classifying transactions, scoring data quality, flagging which filings deserve a human read. Explainable enough that you can say why something ranked where it did.',
    v: 'We use these',
  },
  {
    cls: 'yes',
    h: 'Retrieval over documents',
    sub: 'Filings, factsheets, research',
    p: 'Reading far more source material than a team can, and pulling out what matters with the passage attached. This is where AI most reliably adds hours back to a research process, and it is the least glamorous thing on this list.',
    v: 'We use these',
  },
  {
    cls: 'maybe',
    h: 'Sequence models on time series',
    sub: 'LSTM and similar',
    p: 'Defensible for specific, well-posed problems — anomaly detection in flows, filling gaps in data, some volatility work. We have used them where the problem genuinely had that shape, and we will tell you when yours does not.',
    v: 'Sometimes',
  },
  {
    cls: 'no',
    h: 'Price prediction as a product',
    sub: '"Our AI picks winners"',
    p: 'Out-of-sample performance on raw price prediction does not survive contact with reality, and marketing it is the exact conduct the SEC has charged firms over. We will build your screening, risk and research infrastructure. We will not build you a claim you cannot substantiate.',
    v: 'We decline',
  },
];

const BUYERS = [
  {
    n: 'RIA / WEALTH MANAGER',
    h: 'The problem is held-away accounts',
    p: 'You cannot advise on what you cannot see, and the client’s real picture is spread across accounts you do not custody. Consolidation, drift monitoring and review preparation are where the time goes — not stock selection.',
  },
  {
    n: 'INVESTMENT RESEARCH',
    h: 'The problem is reading volume',
    p: 'More filings, transcripts and factsheets exist than any team can read. The work is triage: getting the right twenty documents in front of an analyst with the relevant passages marked, consistently, on a schedule.',
  },
  {
    n: 'BROKER / PLATFORM',
    h: 'The problem is data reconciliation',
    p: 'Identifiers that disagree across providers, corporate actions that break history, feeds that fail quietly. The unglamorous plumbing decides whether anything built on top is trustworthy.',
  },
  {
    n: 'FAMILY OFFICE',
    h: 'The problem is everything being bespoke',
    p: 'Multiple custodians, private holdings that no feed covers, reporting that has to match how this family thinks. Off-the-shelf portfolio software tends to fit badly, which is precisely when a built system earns its cost.',
  },
  {
    n: 'FINTECH PLATFORM',
    h: 'The problem is what you ship to users',
    p: 'This is product engineering rather than internal tooling — aggregation, categorisation and analytics that have to work for every customer, not just the ones your ops team can babysit.',
  },
  {
    n: 'NOT A FIT',
    h: 'If you want signals, not systems',
    p: 'Firms looking for a model that tells them what to buy are looking for something else, and probably something that does not work. We build the infrastructure around an investment process that already exists.',
  },
];

const SOURCES = [
  { b: 'Account aggregation', s: 'Plaid and Yodlee for held-away accounts, alongside your custodian feeds.' },
  { b: 'Market data', s: 'Prices, corporate actions and reference data from the providers your mandate requires.' },
  { b: 'Exchanges', s: 'NSE, BSE, NYSE and NASDAQ — we have built across US and Indian market data.' },
  { b: 'Funds and ETFs', s: 'Holdings and composition, so look-through exposure is real rather than assumed.' },
  { b: 'Fundamentals', s: 'Statements, ratios and revisions, with the vintage recorded for every run.' },
  { b: 'Documents', s: 'Filings, factsheets and research, indexed so an answer can cite the passage.' },
];

const SCOPE = [
  'A written definition of the workflow, before any modelling',
  'Account aggregation and custodian feeds into one consolidated position',
  'Identifier reconciliation, with unreconciled items reported as unreconciled',
  'Look-through into funds and ETFs so concentration is measured properly',
  'Screening that applies your stated criteria consistently, on a schedule',
  'Risk, drift and rebalancing analysis against target models',
  'Document retrieval across filings and research, with cited passages',
  'Models only where the problem genuinely has that shape, and named as such',
  'Reproducible runs: data vintage, criteria, model version and full output retained',
  'Reporting your compliance people can evidence, in your own accounts',
];

const OUTSIDE = [
  'Investment advice or recommendations. We build systems; your licensed people advise.',
  'Acting as your compliance function. We build so your obligations are servable, and document what we built.',
  'Any claim about future performance, or a system marketed as predicting prices.',
  'Sourcing market data licences. Those stay in your name, which also keeps the terms yours.',
];

const FAQS = [
  {
    q: 'Why does a technical page open with regulation?',
    a: 'Because in this industry the regulation is the constraint that shapes the build, and pretending otherwise produces systems that cannot be used. In March 2024 the SEC charged two investment advisers over statements about AI capabilities they did not have, the Marketing Rule treats AI claims and their performance figures as advertisements subject to substantiation, and books-and-records obligations mean the material behind a figure has to be retained. Those three facts together mean a research system has to be reproducible by design — same data vintage, same criteria, same output — rather than having an audit trail bolted on later. That is an architectural requirement, not a compliance afterthought.',
  },
  {
    q: 'Do XGBoost and LSTM actually do anything useful here, or is that résumé padding?',
    a: 'Gradient-boosted trees genuinely do. The problems this industry has are mostly tabular and feature-rich — ranking a universe against stated criteria, classifying transactions, scoring data quality, deciding which filings deserve a human read — and that is exactly where XGBoost and LightGBM perform well while staying explainable enough that you can say why something ranked where it did. Sequence models like LSTM are defensible on specific, well-posed problems such as anomaly detection in flows or gap-filling in data. What does not hold up is raw price prediction, where out-of-sample performance is poor and marketing it is the conduct that gets firms charged. We use these techniques where the problem has that shape and say plainly when it does not.',
  },
  {
    q: 'What is actually hard about connecting financial data?',
    a: 'Not the connection. Plaid and Yodlee links are the easy afternoon. The hard part is that the same holding arrives under different identifiers from different providers, corporate actions silently break historic series, fund look-through requires composition data that is not always current, and feeds fail in ways that look like a real change in position rather than an error. A consolidated number that quietly drops what it could not reconcile is worse than no number, because someone will put it in front of a client. Most of the engineering in this work is reconciliation and failure handling, and it is the part that decides whether anything built on top can be trusted.',
  },
  {
    q: 'Will this replace our portfolio management software?',
    a: 'Usually not, and we would treat it as a warning sign if that were the first suggestion. Established portfolio and reporting platforms do a great deal well, and the gaps tend to be specific: held-away accounts that never make it in, a screen your process needs that the platform cannot express, look-through exposure the reporting does not compute, review packs assembled by hand every quarter. We build into those gaps and connect what you already run. Family offices with genuinely bespoke structures are the most common exception, because off-the-shelf software fits them worst.',
  },
  {
    q: 'We are in India, or investing across both markets. Does that change anything?',
    a: 'It changes the data layer rather than the architecture. We have built across Indian and US market data — NSE and BSE alongside NYSE and NASDAQ — and the differences that matter in practice are corporate-action handling, identifier conventions, settlement and how fund composition data is published. The regulatory framing on this page is US-specific because most of the buyers reading it are; if your obligations sit with a different regulator then the specific rules differ, but the underlying design requirement does not. Reproducible runs and evidenced outputs are good practice everywhere and mandatory in most places.',
  },
  {
    q: 'How do you handle our data and our clients’ data?',
    a: 'It runs in your accounts, under your credentials, with your data-protection obligations designed in rather than assumed. That matters particularly for advisers because the amended Regulation S-P now requires written incident-response programmes and customer notification within thirty days of a qualifying incident, with compliance phased in across 2025 and 2026 depending on size. Practically, that means logging, retention and breach detection are part of the build rather than an operational afterthought, and we document what we built so your compliance people can review it without needing us in the room.',
  },
  {
    q: 'What does an engagement look like?',
    a: 'It starts with one workflow written down properly — usually consolidation, because everything else depends on the positions being right. That produces a scope, a definition of what counts as working, and a fixed price before any build starts. We would rather deliver one workflow that your team actually uses every week than a platform that impresses in a demo and is quietly abandoned by the second quarter, and pricing follows the number of data sources and workflows rather than a per-seat licence.',
  },
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${SLUG}#service`,
        name: 'Investment Research & Portfolio Data Automation',
        serviceType: 'Investment research automation, portfolio consolidation and financial data engineering',
        description:
          'Automation for investment firms, RIAs and wealth managers: account aggregation via Plaid and Yodlee, custodian and market-data integration across NSE, BSE, NYSE and NASDAQ, portfolio consolidation and look-through, screening, risk and drift monitoring, rebalancing analysis, document retrieval over filings and research, and reproducible, evidenced outputs.',
        url: `${site.url}/${SLUG}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: 'Investment Research Automation', item: `${site.url}/${SLUG}` },
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
      <TrackView event="service_view" props={{ slug: SLUG, name: 'Investment Research Automation', design: 'studio-v1' }} />
      <ScrollDepth pageType="service" slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <section className={st.hero} aria-labelledby="h">
        <div>
          <p className={st.eyebrow}><i />INVESTMENT RESEARCH &amp; PORTFOLIO DATA AUTOMATION</p>
          <h1 id="h">Your edge is the process.<br /><em>Not the model.</em></h1>
          <p className={st.heroCopy}>
            Nobody serious is buying a system that picks stocks. What actually costs firms their week
            is consolidating positions across accounts they do not custody, running the same screen by
            hand every quarter, and assembling review packs. That work is systematisable. The other
            thing is not.
          </p>
          <div className={st.heroActions}>
            <BookButton location={`research-hero:${SLUG}`} className={st.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton>
            <a href="#models" className={st.ghost}>Which models we actually use <span aria-hidden="true">↓</span></a>
          </div>
          <p className={st.heroNote}>
            Plaid, Yodlee, custodian feeds and market data, in your own accounts.
            <span>Built so every output can be reproduced later — which regulation increasingly requires.</span>
          </p>
        </div>
        <HeroStage art="spiral-sky" position="62% 45%"><ResearchDesk /></HeroStage>
      </section>

      <div className={st.strip} aria-label="Data sources we work with">
        <span>THE DATA.<br /><b>WHAT WE CONNECT.</b></span>
        <b>Plaid</b><span>Yodlee</span><span>NYSE</span><span>NASDAQ</span><span>NSE</span><span>BSE</span>
      </div>

      {/* ── 01 substantiation ────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s1">
        <div className={c.subs}>
          <div>
            <p className={st.eyebrow}><i />01 / THE CONSTRAINT THAT SHAPES EVERYTHING</p>
            <h2 id="s1">If you cannot evidence it,<br /><em>you cannot say it.</em></h2>
            <p className={st.lede}>
              In most industries overclaiming about AI is embarrassing. In this one it is an
              enforcement matter, and it does not require anything to go wrong with the portfolio —
              only for the description to outrun what the records support.
            </p>
            <p className={st.lede}>
              That is not a disclaimer at the bottom of this page. It is the reason the system is
              built to reproduce every run.
            </p>
            <div className={st.stamp}>Reproducible.<br /><strong>Or not shipped.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <ul className={c.subsList}>
            {SUBS.map(x => (
              <li key={x.h}>
                <h3>{x.h}</h3>
                <p>{x.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 02 honest models ─────────────────────────────────────────── */}
      <section id="models" className={`${st.band} ${st.sunken}`} aria-labelledby="s2">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />02 / WHAT WE USE AND WHAT WE REFUSE</p>
            <h2 id="s2">Four techniques.<br /><em>One of them we turn down.</em></h2>
          </div>
          <p>Most agencies list every model they have heard of. It is more useful to say where each one genuinely earns its place, and where reaching for it is the tell that someone is selling.</p>
        </div>
        <div className={c.models}>
          {MODELS.map(m => (
            <article key={m.h} className={`${c.model} ${c[m.cls]}`}>
              <h3>{m.h}<span>{m.sub}</span></h3>
              <p>{m.p}</p>
              <span className={c.verdict}>{m.v}</span>
            </article>
          ))}
        </div>
      </section>

      {/* ── 03 who you are ───────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />03 / THESE ARE NOT THE SAME BUSINESS</p>
            <h2 id="s3">A wealth manager and a<br />research shop <em>share almost nothing.</em></h2>
          </div>
          <p>Vendors sell all of these the same product. The honest position is that the problem changes completely depending on which of these you are — so find yourself here before reading anything else on this page.</p>
        </div>
        <div className={c.buyers}>
          {BUYERS.map(b => (
            <article key={b.n} className={c.buyer}>
              <span>{b.n}</span>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 04 the data layer ────────────────────────────────────────── */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4">
        <div className={c.data}>
          <div>
            <p className={st.eyebrow}><i />04 / THE DATA LAYER</p>
            <h2 id="s4">Connecting is easy.<br /><em>Reconciling is the job.</em></h2>
            <p className={st.lede}>
              A Plaid link takes an afternoon. Making the resulting numbers trustworthy takes the rest
              of the project, and that is the part nobody demos.
            </p>
          </div>
          <div>
            <div className={c.sources}>
              {SOURCES.map(s => (
                <div key={s.b} className={c.source}>
                  <b>{s.b}</b>
                  <span>{s.s}</span>
                </div>
              ))}
            </div>
            <p className={c.hardPart}>
              The same holding arrives under different identifiers from different providers. Corporate
              actions break historic series. Fund composition is not always current. Feeds fail in
              ways that look like a genuine change in position rather than an error. A consolidated
              total that quietly drops what it could not reconcile is worse than no total, because
              somebody will put it in front of a client — so ours reports what it could not reconcile,
              by name.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05 engagement ────────────────────────────────────────────── */}
      <section className={st.band} aria-labelledby="s5">
        <div className={st.scope}>
          <div>
            <p className={st.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">One workflow,<br /><em>written down properly.</em></h2>
            <p className={st.lede}>
              Usually consolidation, because everything downstream depends on the positions being
              right. Getting that wrong makes every screen, every risk number and every client review
              built on it wrong in a way nobody notices for months.
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
            <h2 id="s6">Where this came from.</h2><ProofArt art="light-rings" />
          </div>
          <div>
            <h3>Financial data integration across two markets</h3>
            <p>
              We have built account aggregation and market-data workflows across US and Indian
              markets — Plaid and Yodlee for held-away accounts, exchange and fundamental data, fund
              composition for look-through — and used gradient-boosted models where the problem was
              genuinely a ranking or classification problem rather than a prediction one.
            </p>
            <p>
              Our own co-founder is a chartered accountant and SEBI-registered investment adviser,
              which is a large part of why this page argues about substantiation rather than about
              model architecture. On a call we will go through what we built, what it did, and where
              the reconciliation work turned out to be much larger than expected.
            </p>
            <Link className={st.proofLink} href="/document-processing-automation">How the integration side works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────────────── */}
      <section className={st.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={st.eyebrow}><i />06 / START WITH THE POSITIONS</p>
          <h2 id="s7">Tell us which number<br />you <em>do not fully trust.</em></h2>
          <p>
            Every firm has one — the consolidated total, the exposure figure, the screen output that
            somebody checks by hand before it goes anywhere. That is the workflow worth building
            first, and it is a better starting question than which model to use.
          </p>
          <ol className={st.closeList}>
            <li>Which workflow is costing you the most hours</li>
            <li>Whether your data sources can actually support it</li>
            <li>A scope and a fixed price, in writing</li>
          </ol>
          <p className={st.direct}>
            You will be talking to the people who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`solution:${SLUG}`} compact submitLabel="Send this and pick a time" note="Tell us what kind of firm you are, your custodians and data sources, and the workflow that hurts." />
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
        <Link href="/ai-workspace-setup">AI Workspace Setup ↗</Link>
      </nav>
    </div>
  );
}
