import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { getCaseStudyBySlug, getCaseStudySlugs, urlFor, type SanityImage } from '../../../sanity/client';
import { site } from '../../../lib/site';
import BookButton from '../../../components/BookButton';
import TrackView from '../../../components/TrackView';
import ScrollDepth from '../../../components/ScrollDepth';
import styles from './case.module.css';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: 'Not Found' };
  const title = cs.metaTitle || `${cs.title} | ${site.name}`;
  const full = (cs.metaDescription || cs.overview || `How Chronexa helped ${cs.companyName || 'a client'} with AI automation.`).replace(/\s+/g, ' ').trim();
  // Google shows ~155 characters; long Sanity overviews were being cut mid-sentence.
  const description = full.length <= 158 ? full : full.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const og = cs.thumb?.asset ? urlFor(cs.thumb).width(1200).height(630).url() : site.ogImage;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: { title, description, url: `/case-studies/${slug}`, type: 'article', images: [og] },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  };
}

// Re-level Sanity body headings so the document keeps one H1 (the page title) and no
// skipped levels, regardless of how the author styled headings in the CMS.
function normalizeHeadings(blocks: unknown): unknown {
  if (!Array.isArray(blocks)) return blocks;
  const open: number[] = [];
  return blocks.map((b) => {
    const block = b as { _type?: string; style?: string };
    if (block?._type !== 'block') return b;
    const m = /^h([1-6])$/.exec(block.style || '');
    if (!m) return b;
    const src = Number(m[1]);
    while (open.length && open[open.length - 1] >= src) open.pop();
    open.push(src);
    const target = Math.min(open.length + 1, 6);
    return `h${target}` === block.style ? b : { ...block, style: `h${target}` };
  });
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
  const cover = cs.thumb?.asset ? urlFor(cs.thumb).width(1440).height(810).fit('crop').auto('format').url() : null;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: cs.title,
        description: cs.overview,
        about: [cs.industry, cs.targetKeyword].filter(Boolean),
        keywords: [cs.targetKeyword, ...(cs.secondaryKeywords || []), ...(cs.toolsUsed || [])].filter(Boolean).join(', '),
        image: cover || undefined,
        datePublished: cs.publishedAt,
        dateModified: cs._updatedAt,
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
      <TrackView event="case_study_view" props={{ slug, title: cs.title, client: cs.companyName, industry: cs.industry }} />
      <ScrollDepth pageType="case_study" slug={slug} />
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
            {cs.evidenceType && <li><span>Proof basis</span>{evidenceLabel(cs.evidenceType)}</li>}
            {cs.industry && <li><span>Industry</span>{cs.industry}</li>}
            {cs.year && <li><span>Year</span>{cs.year}</li>}
            {cs.serviceIncluded?.length ? <li><span>Services</span>{cs.serviceIncluded.join(', ')}</li> : null}
            {cs.websiteLink && <li><span>Website</span><a href={cs.websiteLink} target="_blank" rel="noopener noreferrer">{cs.websiteName || cs.websiteLink}</a></li>}
          </ul>
          {cs.evidenceNote && <p className={styles.evidenceNote}>{cs.evidenceNote}</p>}
        </div>

        {cover && (
          <div className={`container ${styles.coverWrap}`}>
            <img className={styles.cover} src={cover} alt={cs.thumb?.alt || `Workflow architecture for ${cs.title}`} width="1440" height="810" />
          </div>
        )}

        {(cs.stat1 || cs.stat2) && (
          <div className={`container ${styles.statsRow}`}>
            {cs.stat1 && <div className={styles.stat}><div className={styles.statNum}>{cs.stat1}</div><div className={styles.statLabel}>{cs.stat1Text}</div></div>}
            {cs.stat2 && <div className={styles.stat}><div className={styles.statNum}>{cs.stat2}</div><div className={styles.statLabel}>{cs.stat2Text}</div></div>}
          </div>
        )}

        <div className={`container ${styles.body}`}>
          {cs.quickAnswer && <section className={styles.answerBox} aria-labelledby="quick-answer"><h2 id="quick-answer">The short answer</h2><p>{cs.quickAnswer}</p></section>}
          {cs.toolsUsed?.length ? <section><h2>Tools and systems used</h2><ul className={styles.toolList}>{cs.toolsUsed.map((tool) => <li key={tool}>{tool}</li>)}</ul></section> : null}
          {cs.content1 ? <PortableText value={normalizeHeadings(cs.content1) as never} components={components} /> : null}
          {cs.workflowSteps?.length ? <section><h2>How the workflow runs</h2><ol className={styles.steps}>{cs.workflowSteps.map((step) => <li key={step._key}><strong>{step.name}</strong><p>{step.description}</p></li>)}</ol></section> : null}
          {cs.content2 ? <PortableText value={normalizeHeadings(cs.content2) as never} components={components} /> : null}
          {cs.technicalContent ? <PortableText value={normalizeHeadings(cs.technicalContent) as never} components={components} /> : null}
          {cs.safeguards?.length ? <section><h2>Safeguards and failure handling</h2><ul>{cs.safeguards.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
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
          <BookButton location="case-study">Get results like these <span aria-hidden="true">→</span></BookButton>
          <Link href="/case-studies" className="btn-outline">More case studies</Link>
        </div>
      </article>
    </>
  );
}

function evidenceLabel(type: 'client' | 'internal' | 'reference' | 'market') {
  if (type === 'client') return 'Deployed for a client';
  if (type === 'internal') return 'Running inside Chronexa';
  if (type === 'market') return 'Market solution story';
  return 'Working reference build';
}
