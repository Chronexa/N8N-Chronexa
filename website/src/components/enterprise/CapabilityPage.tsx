import type { Metadata } from 'next';
import Link from 'next/link';
import { capabilities } from '../../lib/capabilities';
import { site } from '../../lib/site';
import BookButton from '../BookButton';
import SystemIllustration from './SystemIllustration';
import styles from './enterprise.module.css';

type Capability = (typeof capabilities)[number];
export function capabilityMetadata(service: Capability): Metadata {
  const title = `${service.searchTitle} | Chronexa`;
  return { title: { absolute: title }, description: service.description, alternates: { canonical: `/${service.slug}` }, openGraph: { title, description: service.description, url: `/${service.slug}`, images: [site.ogImage] }, twitter: { card: 'summary_large_image', title, description: service.description, images: [site.ogImage] } };
}
export default function CapabilityPage({ service: s }: { service: Capability }) {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', '@id': `${site.url}/${s.slug}#service`, name: s.searchTitle, description: s.description, url: `${site.url}/${s.slug}`, provider: { '@id': `${site.url}/#organization` }, areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'] },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/solutions` }, { '@type': 'ListItem', position: 3, name: s.title, item: `${site.url}/${s.slug}` }] },
  ] };
  return <div className={styles.service}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />
    <section className={styles.serviceHero}><div className="container"><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/solutions">Services</Link><span>/</span><span aria-current="page">{s.title}</span></nav><div className={styles.split}><div><p className={styles.kicker}>{s.searchTitle}</p><h1>{s.short}</h1><p>{s.description}</p><BookButton location={`${s.slug}-hero`}>Discuss your project ↗</BookButton><p style={{fontSize:12, marginTop:20}}>For US businesses and global teams.</p></div><SystemIllustration kind={s.diagram} /></div></div></section>
    <section className={styles.section}><div className={`container ${styles.split}`}><div><p className={styles.kicker}>THE ENGAGEMENT</p><h2>Clear deliverables.<br />Shared expectations.</h2><p>We define scope, dependencies and acceptance criteria together. Your team knows what is being built, how it will be validated and what happens at handover.</p></div><ul className={styles.deliverables}>{s.deliverables.map((d,i)=><li key={d}><span>0{i+1}</span>{d}</li>)}</ul></div></section>
    <section className={styles.section} style={{paddingTop:0}}><div className="container"><p className={styles.kicker}>FROM DISCOVERY TO DELIVERY</p><h2>How we approach the work.</h2><ol className={styles.process} style={{marginTop:40}}>{s.steps.map((step,i)=><li key={step}><span>0{i+1}</span><h3>{['Discover','Design & build','Validate & deliver'][i]}</h3><p>{step}</p></li>)}</ol></div></section>
    <section className={styles.dark}><div className={`container ${styles.split}`}><div><p className={styles.kicker}>CONNECTED EXPERTISE</p><h2>A service that fits<br />the bigger picture.</h2><p>Connect this engagement to your wider product, operations and engineering roadmap.</p></div><div><Link href={s.related} className={styles.textLink}>{s.relatedLabel} ↗</Link><br /><Link href={s.resource} className={styles.textLink}>{s.resourceLabel} ↗</Link><br /><Link href="/case-studies" className={styles.textLink}>Explore our delivery case studies ↗</Link></div></div></section>
    <section className={styles.section}><div className={`container ${styles.faq}`}><div><p className={styles.kicker}>BEFORE WE START</p><h2>Built around<br />your requirements.</h2></div><div><details><summary>What does an engagement cost?</summary><p>Pricing depends on scope, integrations, delivery requirements and the engineering capacity involved. We agree a proposal and commercial terms after discovery, before implementation begins.</p></details><details><summary>Can you work with our existing team and systems?</summary><p>Yes. We review your current architecture and delivery process, agree responsibilities with your team and identify the integrations and access needed to deliver the work.</p></details><details><summary>What happens after launch?</summary><p>We hand over the agreed code, designs and operating documentation. Support, maintenance and future development are scoped explicitly so responsibilities remain clear after delivery.</p></details></div></div></section>
    <section className={styles.closing}><div className={`container ${styles.split}`}><div><p className={styles.kicker}>LET’S TALK</p><h2>What are you<br />building next?</h2></div><div><p>Tell us about the challenge, your current systems and the outcome you need.</p><BookButton location={`${s.slug}-close`}>Talk to our team ↗</BookButton><br /><Link href="/solutions" className={styles.textLink}>Explore all services ↗</Link></div></div></section>
  </div>;
}
