import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '../components/Hero';
import BookButton from '../components/BookButton';
import ScrollDepth from '../components/ScrollDepth';
import Manifesto from '../components/homepage/Manifesto';
import WorkShowcase from '../components/homepage/WorkShowcase';
import RoiEstimator from '../components/homepage/RoiEstimator';
import ServicesExplorer from '../components/homepage/ServicesExplorer';
import RevealRoot from '../components/homepage/RevealRoot';
import ArtPlate from '../components/visual/ArtPlate';
import type { ArtName } from '../lib/art';
import { INDUSTRY_GROUPS, SERVICE_GROUPS } from '../lib/nav';
import { founders, site } from '../lib/site';
import { getAllPosts, urlFor } from '../sanity/client';
import s from '../components/homepage/home.module.css';

/**
 * Homepage v4 (2026-10-08). Built on the site design system (Fraunces + Host Grotesk, warm paper,
 * Chronexa green, near-black only as punctuation) with a distinct layout per section.
 * Previously v3 (2026-10-08). Straight story: who we are → what we do (every service) → the work
 * we've shipped (live demos + outcomes) → why us → what it's worth → solutions by industry →
 * how we work → insights → questions → close. Clients are never named (NDA).
 * Design: one sans family, light and bright, film only at the top and bottom, no card grids.
 */

export const revalidate = 3600;

const title = 'AI-Native IT Services & AI Automation Agency | Chronexa';
const description =
  'Chronexa is an AI-native IT services firm. We build AI agents, automation, document intelligence, voice agents and custom software for growing and mid-market companies.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title, description, images: [site.ogImage] },
};

const WHO =
  'Chronexa is an AI-native IT services firm. We design, build and run the AI systems, automations and software that growing companies run on. We have built software for more than ten years. Today we build it alongside AI agents, so we ship in days what used to take months. We don’t sell hype or slide decks. Every engagement has a number attached: hours returned, cost per output cut, revenue unlocked.';

const GROUP_LINES: Record<string, string> = {
  'AI & automation': 'AI that does the work inside your business.',
  'Business solutions': 'Systems built for one team or one industry, end to end.',
  'Engineering & teams': 'Software, brands and the people who keep AI working.',
};

const SERVICE_LINES: Record<string, string> = {
  '/ai-strategy-consulting': 'A ranked roadmap of where AI pays back first, with the business case for each.',
  '/ai-automation-agency': 'End-to-end automation of the work your team repeats every day.',
  '/ai-agent-development': 'Agents that research, decide and act inside your tools, with people approving what matters.',
  '/ai-integration-services': 'Claude, GPT and Gemini connected securely to your CRM, ERP and data.',
  '/custom-mcp-server-development': 'A safe, governed way for AI into software that has no integration.',
  '/ai-knowledge-systems': 'Your documents and data turned into answers your team can trust and cite.',
  '/ai-voice-agent-development': 'Phone agents that answer, qualify and book, 24 hours a day.',
  '/document-processing-automation': 'Invoices, forms and contracts read, checked and entered automatically.',
  '/ai-automation': 'One defined business workflow automated end to end, across the tools you already use.',
  '/business-process-automation-consulting': 'Processes mapped, redesigned and automated where the payback is clearest.',
  '/ai-sales-outreach-engine': 'Prospects researched and outreach drafted from evidence, with a person approving every send.',
  '/crm-automation-services': 'A CRM that updates itself, routes leads and alerts the team in Slack.',
  '/customer-support-automation': 'Tickets triaged, answered and escalated with scoped access per agent.',
  '/cpa-accounting-automation': 'Document collection, missing-item detection and practice-software integration for CPA firms.',
  '/legal-ai-automation': 'Secure AI inside your own tenant, inheriting the matter permissions you already enforce.',
  '/investment-research-automation': 'Portfolio consolidation, screening and risk monitoring built on reproducible evidence.',
  '/industrial-data-predictive-maintenance': 'Machine data into condition monitoring and maintenance decisions.',
  '/custom-software-development': 'Platforms, internal tools and SaaS products, built AI-first.',
  '/ui-ux-design-services': 'Interfaces designed around the people who use them every day.',
  '/ecommerce-development': 'Brand, store, content and the automation behind them.',
  '/shopify-seo-services': 'Technical and content SEO that grows organic revenue.',
  '/tech-stack-migration': 'Move off legacy systems without losing data or a day of trading.',
  '/dedicated-ai-engineers': 'Senior AI engineers embedded in your team, month to month.',
  '/ai-training-for-employees': 'Hands-on training that makes your people AI-native on their own work.',
  '/ai-workspace-setup': 'Claude, ChatGPT or Gemini rolled out with the right access, data and guardrails.',
  '/automated-reporting': 'Reports and dashboards that build themselves and land where leaders look.',
};

const WHY: readonly (readonly [string, string, ArtName, string])[] = [
  ['Someone has to judge the output.', 'AI answers confidently whether it is right or wrong. We define what “correct” means for your work, test against it, and route anything uncertain to a person.', 'chrome-face', '50% 30%'],
  ['The model is an engineering decision.', 'Opus, Sonnet, GPT, Gemini, open-weight models: the wrong choice costs ten times more or fails quietly. We pick per task, on accuracy and cost per output.', 'light-rings', '50% 40%'],
  ['Not everything should be automated.', 'Some processes aren’t ready and some tools can’t be connected. We start where automation pays back first and tell you what to leave alone.', 'knight-poppies', '62% 60%'],
  ['Your data has rules.', 'Client PII, financial records and privileged documents can’t go into just any model. Residency, redaction, access and audit are designed in from the first day.', 'glass-bloom', '50% 25%'],
  ['AI needs context to be useful.', 'Data schemas, clean pipelines and orchestration across every tool your people use. Without them, chat windows and connectors are a clever intern with no memory.', 'painted-mind', '50% 30%'],
];

const COMPARE = {
  cols: ['In-house team', 'Independent specialist', 'Delivery agency', 'Build with AI tools', 'Chronexa'],
  rows: [
    ['Best fit', 'Long-term core capability', 'A well-defined specialist task', 'A scoped delivery programme', 'Experiments your team can own', 'Connected AI systems and ongoing engineering'],
    ['Your responsibility', 'Hiring and engineering management', 'Scope and integration ownership', 'Vendor selection and governance', 'Architecture, testing and operations', 'Process expertise and business approvals'],
    ['Cost to plan for', 'Compensation, tools and recruiting', 'Project fee and ongoing maintenance', 'Build scope and support agreement', 'Subscriptions and internal engineering time', 'Agreed build scope, usage and support'],
    ['Quality to verify', 'Test coverage and operational readiness', 'Handover, tests and support', 'Acceptance criteria and delivery evidence', 'Evals, security and recovery', 'Evals, review gates and agreed acceptance tests'],
    ['After launch', 'Your team operates it', 'Agree support separately', 'Defined by the contract', 'Your team operates it', 'Ownership handover; support scoped with you'],
  ],
};

const STEPS = [
  ['Free AI audit', 'We map how your company works and show you where AI pays back first, in numbers.'],
  ['First build', 'One system in production on your tools and data, usually within weeks, so you judge us on results.'],
  ['Ongoing partner', 'We become your AI engineering team. Each next build is quoted against what it unlocks.'],
] as const;

const FAQS: [string, string][] = [
  ['We already use ChatGPT, Claude and Cursor. Why do we need you?', 'Those tools make one person faster. They don’t make a company run on AI. That takes choosing the right model for each task, connecting AI to your systems and data, building the checks that catch wrong output, and designing for compliance. That engineering is what we do, so your people can run the business instead of the plumbing.'],
  ['What does an AI-native IT services firm do differently?', 'We build with AI agents ourselves every day, so we ship in days what traditional firms quote in months. And we measure work by business outcome, the hours, cost per output and revenue it moves, not by hours billed.'],
  ['What is included in the free first workflow?', 'We agree one bounded workflow, its connected tools, test data and acceptance criteria during the free audit. You approve that written scope before work starts. Any provider usage, additional integrations and ongoing support are identified separately; further work requires a separate quote.'],
  ['How do you price?', 'There are no packages. The audit is free. After it, every build is quoted against the time and revenue it unlocks, and you approve the scope and price before we start.'],
  ['Can you work with regulated data?', 'Yes. We have built for legal, tax, financial-services and regulated-advisory teams. We choose models and hosting by where your data is allowed to go, redact what must not leave, keep access scoped, and keep a person approving anything that sends, pays or publishes.'],
  ['Why don’t you name your clients?', 'Most of our work runs under NDA. We describe each system by sector, what we built and the outcome, and we are happy to walk you through the engineering on a call.'],
  ['Who owns what you build?', 'You do: the code, the workflows, the data and the accounts they run in.'],
];

const INSIGHT_SLUGS = ['ai-sales-agent', 'ai-agents-for-business', 'fine-tuning-vs-rag', 'generative-ai-consulting-services'];

function Label({ n, children, dark }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return <p className={dark ? s.labelDark : s.label}><span>{n}</span>{children}</p>;
}

export default async function Home() {
  const posts = await getAllPosts();
  // Curated: the pieces that show how we think (original analysis over generic guides), newest as fallback.
  const picked = INSIGHT_SLUGS.map((slug) => posts.find((p) => p.slug.current === slug)).filter((p): p is (typeof posts)[number] => Boolean(p));
  const insights = [...picked, ...posts.filter((p) => !picked.includes(p))].slice(0, 4);
  const [lead, ...more] = insights;
  const industries = INDUSTRY_GROUPS.flatMap((g) => g.links);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <div className={s.home}>
      <ScrollDepth pageType="home" />
      <RevealRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero />

      {/* 01 Who we are — a tall film holds the left while the statement inks in, facts set in large type below */}
      <section className={s.who}>
        <div className={`container ${s.whoGrid}`}>
          <div className={s.whoArt}>
            <ArtPlate name="galaxy-meditation" className={s.whoFilm} position="50% 50%" sizes="(max-width: 900px) 100vw, 40vw" caption="Systems keep the routine. People keep the judgment." />
          </div>
          <div className={s.whoText}>
            <Label n="01">Who we are</Label>
            <Manifesto text={WHO} />
            <dl className={s.facts} data-reveal>
              <div><dt>10+</dt><dd>years building software for growing companies</dd></div>
              <div><dt>20+</dt><dd>engineers, designers and AI specialists</dd></div>
              <div><dt>35+</dt><dd>AI systems running in production</dd></div>
              <div><dt>9</dt><dd>industries we build for</dd></div>
            </dl>
            <div className={s.leaders} data-reveal>
              <ul>
                {founders.map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <li key={f.name}><img src={f.image} alt={f.name} loading="lazy" /></li>
                ))}
              </ul>
              <p>Led by {founders.map((f) => f.name.split(' ')[0]).join(', ').replace(/, ([^,]*)$/, ' and $1')}. <Link href="/about">Meet the firm →</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 What we do — practice tabs, every service on the green thread */}
      <section className={s.what} id="services">
        <div className="container">
          <div className={s.centerHead} data-reveal>
            <Label n="02">What we do</Label>
            <h2>Choose the work you need done. <em>One team that owns the result.</em></h2>
            <p className={s.lead}>Strategy, engineering and the people to run it. Pick a practice, or let the free audit tell you where to start.</p>
          </div>
          <div data-reveal>
            <ServicesExplorer groups={SERVICE_GROUPS} groupLines={GROUP_LINES} serviceLines={SERVICE_LINES} />
          </div>
        </div>
      </section>

      {/* 03 Work we've shipped — the engine stage: dark, pinned demos */}
      <section className={s.work} id="work">
        <div className="container">
          <div className={s.workHead} data-reveal>
            <div>
              <Label n="03" dark>Work we’ve shipped</Label>
              <h2>Systems running today. <em>Outcomes you can count.</em></h2>
            </div>
            <p>Most of our work runs under NDA, so clients stay unnamed. What we built and what it changed are below. Outcomes are from delivered work or typical for systems like these.</p>
          </div>
          <WorkShowcase />
        </div>
      </section>

      {/* 04 Why us — one big question, five answers on lifted cards, then the comparison */}
      <section className={s.whySec}>
        <div className="container">
          <div className={s.whyHead} data-reveal>
            <Label n="04">Why Chronexa</Label>
            <h2>Anyone can prompt AI. <em>Few can make it run a business.</em></h2>
            <p className={s.lead}>The cost of output has collapsed, yet most companies aren’t growing any faster. With hundreds of people, dozens of tools and years of data, the prompt is the easy part. Everything around it is the work.</p>
          </div>
          <ol className={s.reasons}>
            {WHY.map(([h, p, art, pos], i) => (
              <li key={h} style={{ ['--i' as string]: i }}>
                <ArtPlate name={art} position={pos} className={s.reasonPlate} unveil={false} still sizes="(max-width: 760px) 100vw, 40vw" decorative />
                <div className={s.reasonText}>
                  <span>{String(i + 1).padStart(2, '0')} <small>/ 05</small></span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={s.compare} data-reveal>
            <div className={s.compareHead}>
              <h3>Five ways to get AI work done.</h3>
              <p>Every option can produce something. Only one is built to produce outcomes you can measure.</p>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th scope="col"><span className={s.vh}>Criterion</span></th>{COMPARE.cols.map((c, n) => <th key={c} scope="col" className={n === 4 ? s.us : undefined}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {COMPARE.rows.map(([label, ...cells]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {cells.map((c, n) => <td key={n} data-label={COMPARE.cols[n]} className={n === 4 ? s.us : undefined}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 05 What it's worth — a calculator floating on the green band */}
      <section className={s.worth}>
        <div className="container">
          <div className={s.worthCard} data-reveal>
            <div className={s.worthIntro}>
              <Label n="05">What it’s worth</Label>
              <h2>Put a number on it <em>before you spend a dollar.</em></h2>
              <p className={s.lead}>The same arithmetic we use in the audit. Move the sliders to your company.</p>
            </div>
            <RoiEstimator />
          </div>
        </div>
      </section>

      {/* 06 Solutions by industry — two moving rows of industries */}
      <section className={s.sectors}>
        <div className="container" data-reveal>
          <Label n="06">Solutions by industry</Label>
          <h2>Built for how <em>your industry</em> already works.</h2>
        </div>
        <nav className={`container ${s.industryLinks}`} aria-label="Choose your industry">
          {industries.map(l => <Link key={l.href} href={l.href}>{l.label}<span aria-hidden="true">↗</span></Link>)}
        </nav>
      </section>

      {/* 07 How we work — three nodes on one thread */}
      <section className={s.how}>
        <div className="container">
          <div className={s.howHead} data-reveal>
            <div>
              <Label n="07">How we work</Label>
              <h2>Trust first. <em>Invoice later.</em></h2>
            </div>
            <p className={s.lead}>No packages and no hourly rates. You see us work before you pay us, and every quote is sized against what it saves you.</p>
          </div>
          <ol className={s.path} data-reveal>
            {STEPS.map(([t, b], i) => (
              <li key={t}>
                <span className={s.node}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </li>
            ))}
          </ol>
          <div className={s.howCta}>
            <BookButton location="home-how" className={s.btn}>Start with the free audit</BookButton>
            <Link href="/how-we-work" className={s.textLink}>How an engagement runs →</Link>
            <Link href="/delivery-and-security" className={s.textLink}>Delivery, ownership and security →</Link>
          </div>
        </div>
      </section>

      {/* 08 Insights — one featured essay, three more beside it */}
      {lead && (
        <section className={s.insights}>
          <div className="container">
            <div className={s.insightsHead} data-reveal>
              <div>
                <Label n="08">Insights</Label>
                <h2>How we think <em>about AI and work.</em></h2>
              </div>
              <div className={s.insightLinks}>
                <Link href="/blog">All {posts.length} articles →</Link>
                <Link href="/case-studies">Case studies →</Link>
                <Link href="/n8n-portfolio">Workflow portfolio →</Link>
              </div>
            </div>
            <div className={s.editorial} data-reveal>
              <Link href={`/blog/${lead.slug.current}`} className={s.feature}>
                {lead.hero && (
                  <div className={s.featureArt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={urlFor(lead.hero).width(1100).url()} alt="" loading="lazy" />
                  </div>
                )}
                <span>Featured · {lead.readingTime ? `${lead.readingTime} min read` : 'Essay'}</span>
                <h3>{lead.title}</h3>
                {lead.excerpt && <p>{lead.excerpt}</p>}
              </Link>
              <ul className={s.more}>
                {more.map((p) => (
                  <li key={p._id}>
                    <Link href={`/blog/${p.slug.current}`}>
                      <span>{p.readingTime ? `${p.readingTime} min read` : 'Article'}</span>
                      <strong>{p.title}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 09 Questions */}
      <section className={s.faqSec}>
        <div className={`container ${s.faq}`}>
          <div className={s.faqHead}>
            <Label n="09">Questions</Label>
            <h2>What leaders <em>ask us first.</em></h2>
            <p className={s.lead}>Still deciding? Ask us directly. You’ll talk to a senior engineer, not a sales rep.</p>
            <BookButton location="home-faq" className={s.textLink}>Book a strategy call →</BookButton>
          </div>
          <div>
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Close — back into the film */}
      <section className={s.close}>
        <ArtPlate name="cloud-tram" className={s.closeArt} position="30% 50%" unveil={false} sizes="100vw" decorative />
        <div className={`container ${s.closeInner}`} data-reveal>
          <h2>Let AI do the work. <em>We’ll make sure it’s right.</em></h2>
          <p>30 minutes with a senior engineer. You’ll leave knowing where AI pays back first in your business, whether or not you hire us.</p>
          <div className={s.heroActions}>
            <BookButton location="home-close" className={s.btnGreen}>Book a strategy call</BookButton>
            <a href={`mailto:${site.email}`} className={s.heroLink}>{site.email}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
