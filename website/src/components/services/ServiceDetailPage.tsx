import Image from 'next/image';
import Link from 'next/link';
import BookButton from '../BookButton';
import ScrollDepth from '../ScrollDepth';
import TrackView from '../TrackView';
import { site } from '../../lib/site';
import s from './service-detail.module.css';

export type ServiceDetail = {
  slug: string;
  name: string;
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  audience: string;
  visual: 'voice' | 'commerce';
  visualTitle: string;
  visualSteps: string[];
  strip: string[];
  problem: { label: string; title: string; body: string }[];
  orchestrationTitle: React.ReactNode;
  orchestrationIntro: string;
  flow: { label: string; title: string; body: string }[];
  scope: { title: string; body: string; items: string[] }[];
  safeguardsTitle: React.ReactNode;
  safeguardsIntro: string;
  safeguards: { title: string; body: string }[];
  deliverables: { title: string; body: string }[];
  process: { title: string; body: string }[];
  platforms: string[];
  platformNote: string;
  proof?: { image: string; alt: string; label: string; title: string }[];
  proofCopy?: string;
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

function SystemVisual({ data }: { data: ServiceDetail }) {
  return <div className={`${s.systemVisual} ${s[data.visual]}`} aria-label={data.visualTitle} role="img">
    <div className={s.visualTop}><span>CHRONEXA / SYSTEM VIEW</span><span>ILLUSTRATIVE ARCHITECTURE</span></div>
    <div className={s.visualCore}>
      <span>{data.visual === 'voice' ? 'LIVE CALL' : 'CUSTOMER'}</span>
      <strong>{data.visual === 'voice' ? 'Listen. Decide. Act.' : 'Discover. Buy. Return.'}</strong>
      <i />
    </div>
    <ol>{data.visualSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><b>{step}</b></li>)}</ol>
    <div className={s.visualBottom}><span>BUSINESS RULES</span><span>CONNECTED SYSTEMS</span><span>MEASURED HANDOFF</span></div>
  </div>;
}

export default function ServiceDetailPage({ data }: { data: ServiceDetail }) {
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', '@id': `${site.url}/${data.slug}#service`, name: data.name, description: data.intro, url: `${site.url}/${data.slug}`, provider: { '@id': `${site.url}/#organization` }, areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'] },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/solutions` }, { '@type': 'ListItem', position: 3, name: data.name, item: `${site.url}/${data.slug}` }] },
      { '@type': 'FAQPage', mainEntity: data.faqs.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) },
    ],
  };

  return <div className={s.page}>
    <TrackView event="service_view" props={{ slug: data.slug, name: data.name, design: 'service-detail-v1' }} />
    <ScrollDepth pageType="service" slug={data.slug} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

    <section className={s.hero}>
      <div className={s.wrap}>
        <nav className={s.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/solutions">Services</Link><span>/</span><span aria-current="page">{data.name}</span></nav>
        <div className={s.heroGrid}>
          <div className={s.heroCopy}><p className={s.eyebrow}>{data.eyebrow}</p><h1>{data.title}</h1><p className={s.lead}>{data.intro}</p><div className={s.actions}><BookButton location={`${data.slug}-hero`} className={s.primary}>Discuss your project <span aria-hidden="true">↗</span></BookButton><a href="#how-it-works" className={s.secondary}>See how we build it <span aria-hidden="true">↓</span></a></div><p className={s.audience}>{data.audience}</p></div>
          <SystemVisual data={data} />
        </div>
      </div>
    </section>

    <div className={s.strip}><div className={s.wrap}><span>BUILT AROUND THE COMPLETE SYSTEM</span>{data.strip.map(item => <b key={item}>{item}</b>)}</div></div>

    <section className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><div><p className={s.eyebrow}>THE BUSINESS PROBLEM</p><h2>A working service has to solve<br /><em>more than the visible screen.</em></h2></div><p>The interface is only one part. We map the decisions, systems, exceptions and ownership around it so the result can operate inside your business.</p></div>
        <div className={s.problemGrid}>{data.problem.map((item, index) => <article key={item.title}><span>0{index + 1} / {item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </div>
    </section>

    <section id="how-it-works" className={`${s.section} ${s.dark}`}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><div><p className={s.eyebrow}>SOLUTION ORCHESTRATION</p><h2>{data.orchestrationTitle}</h2></div><p>{data.orchestrationIntro}</p></div>
        <ol className={s.flow}>{data.flow.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><small>{item.label}</small><h3>{item.title}</h3><p>{item.body}</p></div></li>)}</ol>
      </div>
    </section>

    <section className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><div><p className={s.eyebrow}>WHAT WE BUILD</p><h2>The customer experience<br /><em>and the machinery behind it.</em></h2></div><p>Scope is tailored after discovery. These are the workstreams we combine when the engagement calls for them.</p></div>
        <div className={s.scopeGrid}>{data.scope.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p><ul>{item.items.map(line => <li key={line}>{line}</li>)}</ul></article>)}</div>
      </div>
    </section>

    <section className={s.controlBand}>
      <div className={`${s.wrap} ${s.controlGrid}`}><div><p className={s.eyebrow}>QUALITY, CONTROL & FAILURE HANDLING</p><h2>{data.safeguardsTitle}</h2><p>{data.safeguardsIntro}</p></div><div>{data.safeguards.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></div>
    </section>

    {data.proof && <section className={`${s.section} ${s.proofSection}`}><div className={s.wrap}><div className={s.sectionHead}><div><p className={s.eyebrow}>COMMERCE WORK</p><h2>Built to be used.<br /><em>Designed to be remembered.</em></h2></div><p>{data.proofCopy}</p></div><div className={s.proofGrid}>{data.proof.map(item => <article key={item.title}><div><Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><span>{item.label}</span><h3>{item.title}</h3></article>)}</div></div></section>}

    <section className={`${s.section} ${s.deliverySection}`}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><div><p className={s.eyebrow}>A DEFINED ENGAGEMENT</p><h2>What you receive.<br /><em>What happens next.</em></h2></div><p>There is no one-size-fits-all package. We agree the scope, dependencies, acceptance criteria and quote before implementation begins.</p></div>
        <div className={s.deliveryGrid}><div><h3>Core deliverables</h3><ul>{data.deliverables.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>)}</ul></div><div><h3>Delivery process</h3><ol>{data.process.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>)}</ol></div></div>
      </div>
    </section>

    <section className={s.platforms}><div className={s.wrap}><div><p className={s.eyebrow}>PLATFORMS & INTEGRATIONS</p><h2>We choose the stack<br /><em>after we understand the system.</em></h2><p>{data.platformNote}</p></div><div className={s.platformList}>{data.platforms.map(item => <span key={item}>{item}</span>)}</div></div></section>

    <section className={s.section}>
      <div className={`${s.wrap} ${s.faqGrid}`}><div><p className={s.eyebrow}>BEFORE WE START</p><h2>Questions worth<br /><em>answering early.</em></h2><p>We will tell you when a simpler implementation is the better choice and when a dependency needs to be fixed before development begins.</p></div><div>{data.faqs.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></div>
    </section>

    <section className={s.close}><div className={`${s.wrap} ${s.closeGrid}`}><div><p className={s.eyebrow}>YOUR REQUIREMENTS. A CLEAR SCOPE.</p><h2>Let’s build the version<br /><em>your business needs.</em></h2></div><div><p>Tell us what you want to change, what systems are involved and what a useful result looks like. We will shape the engagement and provide a tailored quote.</p><BookButton location={`${data.slug}-close`} className={s.primary}>Talk to our team <span aria-hidden="true">↗</span></BookButton><a href={`mailto:${site.email}`}>{site.email}</a></div></div></section>

    <nav className={s.related} aria-label="Related expertise"><div className={s.wrap}><span>RELATED EXPERTISE</span>{data.related.map(item => <Link key={item.href} href={item.href}>{item.label} <span aria-hidden="true">↗</span></Link>)}</div></nav>
  </div>;
}
