import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getCaseStudyBySlug, getCaseStudySlugs, urlFor, type SanityImage } from '../../../sanity/client';
import { site } from '../../../lib/site';
import styles from './case.module.css';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: 'Not Found' };
  const description = cs.overview || `How Chronexa helped ${cs.companyName || 'a client'} with AI automation.`;
  const og = cs.thumb?.asset ? urlFor(cs.thumb).width(1200).height(630).url() : site.ogImage;
  return {
    title: { absolute: `${cs.title} | ${site.name}` },
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: { title: cs.title, description, url: `/case-studies/${slug}`, type: 'article', images: [og] },
  };
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) =>
      value?.asset ? <img className={styles.bodyImg} src={urlFor(value).width(1400).fit('max').auto('format').url()} alt={value.alt || ''} loading="lazy" /> : null,
  },
};

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const logo = cs.logo?.asset ? urlFor(cs.logo).width(240).auto('format').url() : null;
  const clientImg = cs.clientImage?.asset ? urlFor(cs.clientImage).width(96).height(96).fit('crop').url() : null;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: cs.title,
        description: cs.overview,
        about: cs.industry,
        author: { '@type': 'Organization', name: site.name, url: site.url },
        publisher: { '@type': 'Organization', name: site.name },
        mainEntityOfPage: `${site.url}/case-studies/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${site.url}/case-studies` },
          { '@type': 'ListItem', position: 3, name: cs.title, item: `${site.url}/case-studies/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className={styles.article}>
        <div className={`container ${styles.head}`}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/case-studies">Case Studies</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{cs.companyName || cs.title}</span>
          </nav>
          {logo && <img className={styles.logo} src={logo} alt={cs.logo?.alt || `${cs.companyName} logo`} />}
          <h1 className={styles.title}>{cs.title}</h1>
          {cs.overview && <p className="heroDescription">{cs.overview}</p>}
          <ul className={styles.facts}>
            {cs.industry && <li><span>Industry</span>{cs.industry}</li>}
            {cs.year && <li><span>Year</span>{cs.year}</li>}
            {cs.serviceIncluded?.length ? <li><span>Services</span>{cs.serviceIncluded.join(', ')}</li> : null}
            {cs.websiteLink && <li><span>Website</span><a href={cs.websiteLink} target="_blank" rel="noopener noreferrer">{cs.websiteName || cs.websiteLink}</a></li>}
          </ul>
        </div>

        {(cs.stat1 || cs.stat2) && (
          <div className={`container ${styles.statsRow}`}>
            {cs.stat1 && <div className={styles.stat}><div className={styles.statNum}>{cs.stat1}</div><div className={styles.statLabel}>{cs.stat1Text}</div></div>}
            {cs.stat2 && <div className={styles.stat}><div className={styles.statNum}>{cs.stat2}</div><div className={styles.statLabel}>{cs.stat2Text}</div></div>}
          </div>
        )}

        <div className={`container ${styles.body}`}>
          {cs.content1 ? <PortableText value={cs.content1 as never} components={components} /> : null}
          {cs.content2 ? <PortableText value={cs.content2 as never} components={components} /> : null}
        </div>

        {cs.testimonial && (
          <div className={`container ${styles.quoteWrap}`}>
            <blockquote className={styles.quote}>{cs.testimonial}</blockquote>
            <div className={styles.client}>
              {clientImg && <img src={clientImg} alt={cs.client || ''} className={styles.clientImg} />}
              <div>
                {cs.client && <strong>{cs.client}</strong>}
                {cs.clientDetails && <span>{cs.clientDetails}</span>}
              </div>
            </div>
          </div>
        )}

        <div className={`container ${styles.cta}`}>
          <Link href="/contact" className="btn-primary">Get results like these <span aria-hidden="true">→</span></Link>
          <Link href="/case-studies" className="btn-outline">More case studies</Link>
        </div>
      </article>
    </>
  );
}
