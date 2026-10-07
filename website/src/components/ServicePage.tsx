import Link from 'next/link';
import type { CSSProperties } from 'react';
import { site } from '../lib/site';
import { getService, type ServiceContent } from '../lib/services-content';
import { serviceExperiences } from '../lib/service-experiences';
import BookButton from './BookButton';
import LogoChip from './LogoChip';
import TrackView from './TrackView';
import ScrollDepth from './ScrollDepth';
import LeadForm from './LeadForm';
import ServiceExplorer from './ServiceExplorer';
import s from './ServicePage.module.css';

/** Shared foundations; three compositions and twelve distinct decision aids.
 * Keep commercial copy and evidence on the server. Only the examples hydrate.
 */
export default function ServicePage({ data }: { data: ServiceContent }) {
  const e = serviceExperiences[data.slug];
  if (!e) throw new Error(`Missing service experience: ${data.slug}`);
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', '@id': `${site.url}/${data.slug}#service`, name: data.serviceName, serviceType: data.serviceType,
        description: e.intro, url: `${site.url}/${data.slug}`, provider: { '@type': 'Organization', name: site.name, url: site.url } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${site.url}/solutions` },
        { '@type': 'ListItem', position: 3, name: data.serviceName, item: `${site.url}/${data.slug}` },
      ] },
      { '@type': 'FAQPage', mainEntity: data.faqs.map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })) },
    ],
  };
  const advisory = data.slug === 'business-process-automation-consulting';
  const engagement = advisory
    ? 'Assessment and a written recommendation you own.'
    : 'Scope, acceptance criteria and price agreed before implementation.';
  const brief = <><p className={s.eyebrow}>The intended change</p><h2>{e.outcome}</h2><dl><dt>How we measure it</dt><dd>{e.measure}</dd><dt>Engagement</dt><dd>{engagement}</dd></dl></>;
  const controls = <section className={s.controls} aria-labelledby="control-title">
    <div className={s.controlsIntro}>
      <p className={s.eyebrow}>Operating boundaries</p><h2 id="control-title">The rules are part of the system.</h2>
      <p>{e.boundary}</p>
    </div>
    <dl>{data.confidence?.slice(0, 3).map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}</dl>
  </section>;
  const explorer = <div className={s.example} id="example"><h2>{e.question}</h2><ServiceExplorer experience={e} slug={data.slug} /></div>;
  const isArchitecture = e.layout === 'architecture';
  const isWorkbench = e.layout === 'workbench';

  return (
    <div className={`${s.page} ${s[e.layout]}`} style={{ '--service-accent': e.accent } as CSSProperties}>
      <TrackView event="service_view" props={{ slug: data.slug, name: data.serviceName, design: 'enterprise-v3' }} />
      <ScrollDepth pageType="service" slug={data.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className={s.shell}>
        <nav className={s.crumbs} aria-label="Breadcrumb"><Link href="/solutions">Solutions</Link><span aria-hidden="true">/</span><span>{data.serviceName}</span></nav>
        <header className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>{data.serviceName}</p>
            <h1>{e.title}</h1><p className={s.intro}>{e.intro}</p>
            <div className={s.actions}><BookButton location={`service-hero:${data.slug}`} className={s.primary}>Book a discovery call <span aria-hidden="true">↗</span></BookButton><a href={e.layout === 'editorial' ? '#approach' : '#example'} className={s.textLink}>{e.layout === 'editorial' ? 'How we work' : 'Explore the approach'} <span aria-hidden="true">↓</span></a></div>
            <p className={s.audience}>{e.audience}</p>
          </div>
          {e.layout === 'editorial' ? explorer : <aside className={s.brief}>{brief}</aside>}
        </header>
        {e.layout === 'editorial' && <section className={s.briefRow} aria-label="The intended change">{brief}</section>}
        <div className={s.stack}><span>Compatible tools depend on your scope</span><div>{data.stack?.map(tool => <LogoChip key={tool.file} {...tool} showName size="sm" />)}</div></div>

        {isWorkbench && <section className={s.workspace}><div className={s.marginNote}><p className={s.eyebrow}>A closer look</p><h2>{e.detailTitle}</h2><p>{e.boundary}</p></div>{explorer}</section>}
        {isArchitecture && <section className={s.architectureSection}>{explorer}{controls}</section>}

        <section className={s.evidence} aria-labelledby="evidence-title">
          <div><p className={s.eyebrow}>{data.proofBlock?.caseStudy ? 'Relevant delivery' : 'Implementation standard'}</p><h2 id="evidence-title">{data.proofBlock?.caseStudy ? 'Documented work you can inspect.' : 'What we test before handover.'}</h2></div>
          {data.proofBlock?.caseStudy ? <div><h3>{data.proofBlock.caseStudy.label}</h3><p>Review the workflow, implementation and reported results in the case study. We agree a separate baseline and acceptance test for your project.</p><Link className={s.textLink} href={`/case-studies/${data.proofBlock.caseStudy.slug}`}>Read the case study <span aria-hidden="true">↗</span></Link></div> : <div><p>We agree the acceptance test with you before any build starts: the sample data it runs on, what counts as correct and the pass mark it has to clear.</p><p className={s.note}>The interactive example shows proposed behaviour. Your implementation is tested on agreed sample data, including failures and exceptions.</p></div>}
        </section>

        <section className={s.detailsSection} id="approach" aria-labelledby="delivery-title">
          <aside className={s.marginNote}><p className={s.eyebrow}>Working together</p><h2 id="delivery-title">Clear scope.<br />A measured handover.</h2><p>{advisory ? 'Your map and recommendation can be used with an internal team or another implementation partner.' : 'Your team helps define the rules and reviews the result. The build and documentation are handed over in your accounts.'}</p><BookButton location={`service-delivery:${data.slug}`} className={s.textLink}>Book a discovery call ↗</BookButton></aside>
          <div className={s.disclosures}>
            <details><summary>What the engagement includes</summary><div className={s.detailContent}><ul>{data.included.map(item => <li key={item}>{item}</li>)}</ul>{data.notIncluded && <><h3>Outside this scope</h3><ul>{data.notIncluded.map(item => <li key={item}>{item}</li>)}</ul></>}<p>{data.engagementNote}</p></div></details>
            <details><summary>Implementation and acceptance</summary><ol className={s.deliverySteps}>{data.process.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></details>
            {!isArchitecture && <details><summary>Accuracy, access and exception handling</summary><div className={s.detailContent}>{controls}</div></details>}
            <details><summary>Chronexa, an in-house developer, a freelancer or DIY?</summary><div className={s.detailContent}><p>{advisory ? 'Choose based on who can map the work impartially and cost the alternatives.' : 'Choose based on the process, the implementation risk and who will own it after launch.'}</p><div className={s.tableScroll} tabIndex={0} role="region" aria-label="Compare delivery options"><table><caption>Different options fit different work</caption><thead><tr><th scope="col">Option</th><th scope="col">A good fit when</th><th scope="col">Responsibility to plan for</th></tr></thead><tbody>
              <tr><th scope="row">Chronexa</th><td>You need process design, integration and implementation in one engagement.</td><td>Agreed scope, acceptance tests, documentation and handover.</td></tr>
              <tr><th scope="row">In-house developer</th><td>There is ongoing engineering work and internal capacity to own it.</td><td>Prioritisation, system knowledge and operational support.</td></tr>
              <tr><th scope="row">Freelancer</th><td>You have a clear brief and someone who can review the delivery.</td><td>Review, continuity and support should be explicit in the contract.</td></tr>
              <tr><th scope="row">DIY tools</th><td>The task fits a supported connector and straightforward rules.</td><td>Your team configures, tests and maintains the workflow.</td></tr>
            </tbody></table></div></div></details>
            <details><summary>Service details and technical considerations</summary><div className={s.detailContent}><p>{data.answer}</p>{data.sections.map(section => <article key={section.heading}><h3>{section.heading}</h3>{section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>)}<ul>{data.whyCustom.map(item => <li key={item}>{item}</li>)}</ul></div></details>
          </div>
        </section>

        <section className={s.questions} aria-labelledby="questions-title"><aside className={s.marginNote}><p className={s.eyebrow}>Questions</p><h2 id="questions-title">Before you start.</h2><p>If yours is not here, ask it on the call. We would rather tell you a process is a poor fit than scope a build around it.</p><BookButton location={`service-questions:${data.slug}`} className={s.textLink}>Book a discovery call ↗</BookButton></aside><div className={s.disclosures}>{data.faqs.map(faq => <details key={faq.q}><summary>{faq.q}</summary><p className={s.faqAnswer}>{faq.a}</p></details>)}</div></section>
        <section className={s.contact} id="audit"><div><p className={s.eyebrow}>Discuss your project</p><h2>{advisory ? 'Decide where to start.' : 'Plan the next step.'}</h2><p>A discovery call covers your current process, the systems involved and what a useful result would look like.</p><BookButton location={`service-close:${data.slug}`} className={s.primary}>Book a discovery call ↗</BookButton><a href={`mailto:${site.email}`} className={s.email}>{site.email}</a></div><details className={s.contactForm}><summary>Prefer to share the details first?</summary><div><LeadForm source={`service:${data.slug}`} compact submitLabel="Continue to booking" note="Share a short description, then choose a time for a discovery call." /></div></details></section>
        <nav className={s.related} aria-label="Related services"><span>Related expertise</span>{data.related.slice(0,3).map(slug => { const item=getService(slug); return item ? <Link key={slug} href={`/${slug}`}>{item.serviceName} ↗</Link> : null; })}</nav>
      </div>
    </div>
  );
}
