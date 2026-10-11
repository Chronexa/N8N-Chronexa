import type { Metadata } from 'next';
import Capabilities from '../../components/enterprise/Capabilities';
import Link from 'next/link';
import { services } from '../../lib/taxonomy';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import CtaBand from '../../components/CtaBand';
import LogoChip from '../../components/LogoChip';
import styles from './solutions.module.css';

export const metadata: Metadata = {
  title: { absolute: 'IT Consulting & Software Development Services | Chronexa' },
  description: 'Explore software engineering, AI automation, voice agents, Shopify, UX design and dedicated AI engineers for US businesses and global teams.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'IT Consulting & Software Development Services | Chronexa',
    description: 'Explore software engineering, AI automation, voice agents, Shopify, UX design and dedicated AI engineers for US businesses and global teams.',
    url: '/solutions', type: 'website', images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Consulting & Software Development Services | Chronexa',
    description: 'Explore software engineering, AI automation, voice agents, Shopify, UX design and dedicated AI engineers for US businesses and global teams.',
    images: [site.ogImage],
  },
};

type SalesCard = {
  label: string;
  outcome: string;
  fit: string;
  steps: [string, string, string];
  accent: 'green' | 'blue' | 'coral' | 'violet' | 'amber';
};

const salesCards: Record<string, SalesCard> = {
  'ai-automation': {
    label: 'Done-for-you workflow',
    outcome: 'Remove one defined manual workflow from your team’s week.',
    fit: 'For teams with a recurring process they want us to design, build and hand over.',
    steps: ['Map the real work', 'Build the whole path', 'Run it for real'], accent: 'green',
  },
  'ai-workspace-setup': {
    label: 'Build team capability',
    outcome: 'Give employees a connected AI environment they can use to research, create, automate and ship.',
    fit: 'For companies that want Claude, Codex, connectors, reusable skills and training delivered together.',
    steps: ['Configure the workspace', 'Connect company tools', 'Train on real work'], accent: 'violet',
  },
  'ai-strategy-consulting': {
    label: 'Decide what to fund',
    outcome: 'Turn a long list of AI ideas into a sequenced, evidence-backed roadmap.',
    fit: 'For leaders who need to compare value, readiness and risk before commissioning software.',
    steps: ['Map the real work', 'Rank value and risk', 'Define the first test'], accent: 'violet',
  },
  'ai-agent-development': {
    label: 'Give AI a defined job',
    outcome: 'Build an agent that works from your knowledge, tools and approval rules.',
    fit: 'For repeated jobs that need language, judgement and access to several systems.',
    steps: ['Define the job', 'Set knowledge and limits', 'Evaluate before autonomy'], accent: 'coral',
  },
  'ai-integration-services': {
    label: 'Connect tools and data',
    outcome: 'Remove retyping and give every workflow a trusted path between systems.',
    fit: 'For operations split across SaaS, databases, documents and legacy software.',
    steps: ['Name the source of truth', 'Connect the critical path', 'Monitor every failure'], accent: 'blue',
  },
  'ai-voice-agent-development': {
    label: 'Complete work by phone',
    outcome: 'Answer, qualify, book and update the systems behind the conversation.',
    fit: 'For teams losing bookings or service capacity to unanswered and repetitive calls.',
    steps: ['Map real calls', 'Connect business tools', 'Test and operate'], accent: 'amber',
  },
  'document-processing-automation': {
    label: 'Documents and data',
    outcome: 'Turn PDFs, scans and forms into checked, structured records.',
    fit: 'For teams opening documents and typing the same facts into another system.',
    steps: ['Read every file', 'Check uncertain fields', 'Write to your system'], accent: 'blue',
  },
  'customer-support-automation': {
    label: 'Customer operations',
    outcome: 'Resolve routine support work faster and hand complex cases to a person.',
    fit: 'For support teams repeating answers, copying context and routing tickets by hand.',
    steps: ['Understand the request', 'Find the right answer', 'Resolve or escalate'], accent: 'amber',
  },
};

/*
 * Commercial order, not taxonomy order. DataForSEO US exact-match snapshot,
 * 2026-09-14: AI automation services KD 3; document processing automation KD 7;
 * accounts payable automation KD 27; system integration services KD 7;
 * customer support automation KD 15. Search opportunity is balanced against
 * buyer intent and the proof Chronexa can credibly show on-page.
 */
const priority = ['ai-strategy-consulting', 'ai-automation', 'ai-agent-development', 'ai-integration-services', 'ai-voice-agent-development'];
const orderedServices = [...services].sort((a, b) => {
  const ai = priority.indexOf(a.slug);
  const bi = priority.indexOf(b.slug);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
});
const featured = orderedServices.filter((service) => priority.includes(service.slug));
const featuredSlugs = new Set(featured.map((service) => service.slug));
const additional = orderedServices.filter((service) => !featuredSlugs.has(service.slug));

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage', '@id': `${site.url}/solutions#page`, name: 'AI automation services',
      description: 'AI workflow automation, connected AI workspaces and specialist systems built around the software a business already uses.',
      url: `${site.url}/solutions`, isPartOf: { '@id': `${site.url}/#website` },
      about: ['AI automation services', 'workflow automation services', 'AI workspace setup', 'MCP integration', 'system integration services'],
    },
    {
      '@type': 'ItemList',
      itemListElement: orderedServices.map((service, index) => ({
        '@type': 'ListItem', position: index + 1, name: service.title, url: `${site.url}/${service.slug}`,
      })),
    },
  ],
};

export default function SolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Technology consulting & engineering</p>
              <h1>The expertise to build what’s next.</h1>
              <p className={styles.heroLead}>From custom software and digital commerce to applied AI and dedicated engineers. Start with your business priorities, then choose the expertise and engagement that fit.</p>
              <div className={styles.heroActions}>
                <BookButton location="solutions-hero" className="btn-primary">Discuss your project</BookButton>
                <Link href="/case-studies" className={styles.secondaryCta}>See real workflows <span aria-hidden="true">→</span></Link>
              </div>
              <p className={styles.reassure}>Free 30-minute call · Clear engagement boundary · You own the system</p>
            </div>
            <div className={styles.heroVisual}>
              <SystemsMap />
            </div>
          </div>
        </section>

        <Capabilities />

        <section className={styles.proofStrip} aria-label="Chronexa delivery proof">
          <div className="container">
            <div><strong>1,200+</strong><span>reports produced automatically each year</span></div>
            <div><strong>85%</strong><span>less time on a proven report workflow</span></div>
            <div><strong>Fixed price</strong><span>scope agreed before we build</span></div>
            <div><strong>Your system</strong><span>built in accounts you control</span></div>
          </div>
        </section>

        <section className={styles.decisionSection} aria-labelledby="engagement-choice">
          <div className="container">
            <div className={styles.sectionHead}>
              <p className="eyebrow">Choose the engagement</p>
              <h2 id="engagement-choice">What do you need us to leave behind?</h2>
              <p>Three starting points prevent the same work from being sold under different AI labels.</p>
            </div>
            <div className={styles.decisionGrid}>
              <Link href="/ai-automation"><span>01 · A WORKING SYSTEM</span><h3>“Automate this workflow for us.”</h3><p>You know the repeated process. We build and hand over the complete operating path.</p><strong>AI Workflow Automation ↗</strong></Link>
              <Link href="/ai-workspace-setup"><span>02 · A CAPABLE TEAM</span><h3>“Help our people work through AI.”</h3><p>We configure the environment, connectors and skills, then train employees on real work.</p><strong>AI Workspace Setup ↗</strong></Link>
              <Link href="/business-process-automation-consulting"><span>03 · A PRIORITISED PLAN</span><h3>“We do not know what to fix first.”</h3><p>We audit several messy processes and identify what to simplify, assist or automate.</p><strong>Process Automation Consulting ↗</strong></Link>
            </div>
          </div>
        </section>

        <section className={styles.routeSection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <p className="eyebrow">Choose the problem</p>
              <h2>What should change after we leave?</h2>
              <p>Five primary AI services cover the buying decision. Specialist pages remain available below for narrower systems, industries and search needs.</p>
            </div>
            <div className={styles.featuredGrid}>
              {featured.map((service, index) => {
                const card = salesCards[service.slug];
                return (
                  <Link href={`/${service.slug}`} key={service.slug} className={`${styles.featuredCard} ${styles[card.accent]}`}>
                    <div className={styles.cardTop}><span>{card.label}</span><strong>{String(index + 1).padStart(2, '0')}</strong></div>
                    <h2>{service.navLabel}</h2>
                    <p className={styles.outcome}>{card.outcome}</p>
                    <p className={styles.fit}>{card.fit}</p>
                    <div className={styles.miniFlow} aria-label={`${service.navLabel} workflow`}>
                      {card.steps.map((step, stepIndex) => <span key={step}><i>{stepIndex + 1}</i>{step}</span>)}
                    </div>
                    <span className={styles.cardCta}>See what you get <b aria-hidden="true">→</b></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.additionalSection}>
          <div className="container">
            <details className={styles.additionalDetails}>
              <summary><span><small>More ways we help</small><strong>See {additional.length} specialist solutions</strong></span><i aria-hidden="true" /></summary>
              <div className={styles.additionalGrid}>
                {additional.map((service) => (
                  <Link href={`/${service.slug}`} key={service.slug} className={styles.additionalCard}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    <div><h3>{service.navLabel}</h3><p>{service.heroSub}</p></div>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </section>

        <section className={styles.proofStory}>
          <div className={`container ${styles.proofGrid}`}>
            <div>
              <p className={styles.eyebrow}>Proof before promises</p>
              <h2>A report workflow that stopped being a capacity problem.</h2>
              <p>A US property-services team now produces more than 1,200 reports a year from site photographs and PDFs. The system prepares the report; people review the exceptions and own the final judgement.</p>
              <Link href="/case-studies/how-reservestudy-automated-report-production-with-ai" className={styles.proofLink}>Read the case study <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.proofNumbers}>
              <div><strong>1,200+</strong><span>reports every year</span></div>
              <div><strong>~85%</strong><span>less time per report</span></div>
              <div><strong>Human review</strong><span>on anything uncertain</span></div>
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className="container">
            <div className={styles.sectionHead}><p className="eyebrow">A clear first engagement</p><h2>From messy workflow to working system</h2></div>
            <ol className={styles.processGrid}>
              <li><span>01</span><h3>Show us the work</h3><p>Bring one process your team repeats every week and the tools it touches.</p></li>
              <li><span>02</span><h3>Get the build plan</h3><p>We map the bottleneck, the exceptions, the outcome and a fixed scope.</p></li>
              <li><span>03</span><h3>Run it for real</h3><p>We build in your accounts, test with real work and hand over the system.</p></li>
            </ol>
          </div>
        </section>
        <CtaBand />
      </main>
    </>
  );
}

function SystemsMap() {
  const inputs = [
    { file: 'gmail.svg', name: 'Gmail' },
    { file: 'gdrive.svg', name: 'Google Drive' },
    { file: 'hubspot.png', name: 'HubSpot' },
  ];
  const outputs = [
    { file: 'quickbooks.svg', name: 'QuickBooks' },
    { file: 'slack.svg', name: 'Slack' },
    { file: 'salesforce.svg', name: 'Salesforce' },
  ];

  return (
    <div className={styles.systemMap} aria-label="Example automation connecting business inputs to checked outcomes">
      <div className={styles.mapHeader}>
        <span>Example system</span>
        <strong><i /> Live</strong>
      </div>
      <div className={styles.mapBody}>
        <div className={styles.mapColumn}>
          <small>Work arrives</small>
          {inputs.map((tool) => <LogoChip key={tool.name} {...tool} showName size="sm" />)}
        </div>
        <div className={styles.mapCore}>
          <span>1</span><p>Read and route</p>
          <span>2</span><p>Check the rules</p>
          <span>3</span><p>Ask a person if unsure</p>
        </div>
        <div className={styles.mapColumn}>
          <small>Work completes</small>
          {outputs.map((tool) => <LogoChip key={tool.name} {...tool} showName size="sm" />)}
        </div>
      </div>
      <div className={styles.mapResult}><span>✓</span><p><strong>Every action is visible</strong><small>The team reviews exceptions, not every item.</small></p></div>
    </div>
  );
}
