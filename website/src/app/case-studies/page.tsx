import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCaseStudies, urlFor, type CaseStudy } from '../../sanity/client';
import { site } from '../../lib/site';
import BookButton from '../../components/BookButton';
import styles from './casestudies.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'AI Automation Case Studies: Workflows, Tools and Results | Chronexa' },
  description:
    'See how Chronexa builds AI automation systems for invoices, support, recruiting, legal, CRM, ecommerce and document workflows.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'AI Automation Case Studies: Workflows, Tools and Results | Chronexa',
    description: 'See how Chronexa builds AI automation systems for invoices, support, recruiting, legal, CRM, ecommerce and document workflows.',
    url: '/case-studies',
    type: 'website',
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Case Studies: Workflows, Tools and Results | Chronexa',
    description: 'See how Chronexa builds AI automation systems for invoices, support, recruiting, legal, CRM, ecommerce and document workflows.',
    images: [site.ogImage],
  },
};

export default async function CaseStudiesPage() {
  const studies = sortByPotential(await getAllCaseStudies());
  const featured = studies.slice(0, 6);
  const rest = studies.slice(6);
  const categories = buildCategories(studies);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${site.url}/case-studies#collection`,
        name: 'AI automation case studies',
        description:
          'A demand-led library of Chronexa AI automation work, including client deployments, internal systems, reference builds and market solution stories.',
        url: `${site.url}/case-studies`,
        about: [
          'AI automation',
          'n8n workflow automation',
          'document processing automation',
          'customer service automation',
          'accounts payable automation',
          'CRM automation',
          'legal document automation',
        ],
        publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name, url: site.url },
      },
      {
        '@type': 'ItemList',
        name: 'Chronexa AI automation case studies ordered by commercial search potential',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: studies.length,
        itemListElement: studies.map((cs, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${site.url}/case-studies/${cs.slug.current}`,
          name: cs.title,
          description: cs.quickAnswer || cs.overview,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={styles.wrap}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Case Studies</span>
          </nav>

          <header className={styles.hero}>
            <div>
              <p className="eyebrow">Proof library</p>
              <h1 className={styles.h1}>AI automation case studies, ordered by demand</h1>
              <div className={styles.intro}>
                <p>
                  Chronexa builds AI agents and workflow automation inside the tools a business already uses. These
                  case studies show the problem, the workflow, the tools, the safeguards and the proof basis.
                </p>
                <p>
                  The first studies appear first because they map to stronger commercial search demand: invoice
                  processing, accounts payable, customer support, recruiting, property reports, CRM routing, ecommerce,
                  insurance, contracts and legal document workflows.
                </p>
              </div>
            </div>
            <aside className={styles.heroPanel} aria-label="Case study library summary">
              <strong>{studies.length}</strong>
              <span>case studies and solution stories</span>
              <BookButton location="case-studies-hero">Show us your workflow <span aria-hidden="true">→</span></BookButton>
            </aside>
          </header>

          <nav className={styles.categoryNav} aria-label="Browse case studies by high-intent workflow">
            {categories.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.label}
                <span>{category.count}</span>
              </a>
            ))}
          </nav>

          <section className={styles.priority} aria-labelledby="highest-potential-case-studies">
            <div className={styles.sectionHead}>
              <p className="eyebrow">Start here</p>
              <h2 id="highest-potential-case-studies">Highest-potential studies</h2>
              <p>
                These are placed first because the underlying workflows have stronger buying intent, clearer search
                language and better odds of turning a visitor into a sales conversation.
              </p>
            </div>
            <div className={styles.featuredGrid}>
              {featured.map((cs, index) => (
                <CaseStudyCard key={cs._id} cs={cs} priority={index < 2} featured={index === 0} />
              ))}
            </div>
          </section>

          <section className={styles.indexableGuide} aria-labelledby="how-to-use-case-studies">
            <h2 id="how-to-use-case-studies">How to read these case studies</h2>
            <p>
              Each page is written for buyers and for search systems. It names the workflow in plain English, lists the
              tools used, explains the technical steps, describes human approval points and labels whether the story is a
              client deployment, a Chronexa internal system, a reference build or a market solution story.
            </p>
          </section>

          <section className={styles.allStudies} aria-labelledby="all-case-studies">
            <div className={styles.sectionHead}>
              <p className="eyebrow">Full library</p>
              <h2 id="all-case-studies">All case studies</h2>
            </div>
            <div className={styles.grid}>
              {rest.map((cs) => (
                <CaseStudyCard key={cs._id} cs={cs} />
              ))}
            </div>
          </section>

          {categories.map((category) => (
            <section key={category.id} id={category.id} className={styles.categorySection} aria-labelledby={`${category.id}-heading`}>
              <h2 id={`${category.id}-heading`}>{category.label} case studies</h2>
              <p>{category.description}</p>
              <div className={styles.linkList}>
                {category.studies.map((cs) => (
                  <Link key={cs._id} href={`/case-studies/${cs.slug.current}`}>
                    {cs.title}
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <aside className={styles.cta} aria-label="Build an AI automation system">
            <div>
              <h2>Want one of these built for your business?</h2>
              <p>
                Bring one messy workflow. We will map the systems, show the automation path and tell you what should be
                automated, what should stay human and what it will take to ship.
              </p>
            </div>
            <BookButton location="case-studies-bottom">Book a workflow audit <span aria-hidden="true">→</span></BookButton>
          </aside>
        </div>
      </section>
    </>
  );
}

function CaseStudyCard({ cs, priority = false, featured = false }: { cs: CaseStudy; priority?: boolean; featured?: boolean }) {
  const thumb = cs.thumb?.asset ? urlFor(cs.thumb).width(960).height(540).fit('crop').auto('format').url() : null;
  const description = cs.quickAnswer || cs.overview;
  const topTools = cs.toolsUsed?.slice(0, 4) || [];

  return (
    <Link href={`/case-studies/${cs.slug.current}`} className={`${styles.card} ${featured ? styles.cardFeatured : ''}`}>
      <div className={styles.thumb}>
        {thumb ? (
          <Image
            src={thumb}
            alt={cs.thumb?.alt || cs.title}
            width={960}
            height={540}
            sizes={featured ? '(max-width: 900px) 100vw, 720px' : '(max-width: 800px) 100vw, 380px'}
            priority={priority}
          />
        ) : (
          <div className={styles.thumbFallback} aria-hidden="true">
            <span>{cs.projectType || 'AI automation'}</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.meta}>
          {evidenceLabel(cs.evidenceType)}{cs.industry ? ` | ${cs.industry}` : ''}{cs.year ? ` | ${cs.year}` : ''}
        </span>
        <h2 className={styles.cardTitle}>{cs.title}</h2>
        {description && <p className={styles.summary}>{description}</p>}
        {cs.targetKeyword && <span className={styles.keyword}>Target: {cs.targetKeyword}</span>}
        {topTools.length ? (
          <ul className={styles.tools} aria-label="Tools used">
            {topTools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        ) : null}
        {(cs.stat1 || cs.stat2) && (
          <div className={styles.stats}>
            {cs.stat1 && <span><strong>{cs.stat1}</strong> {cs.stat1Text}</span>}
            {cs.stat2 && <span><strong>{cs.stat2}</strong> {cs.stat2Text}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}

function evidenceLabel(type?: CaseStudy['evidenceType']) {
  if (type === 'client') return 'Client deployment';
  if (type === 'internal') return 'Chronexa system';
  if (type === 'reference') return 'Reference build';
  if (type === 'market') return 'Solution story';
  return 'Case study';
}

const keywordPotential: Record<string, number> = {
  'marketing automation': 3600,
  'AI document processing': 1900,
  'accounts payable automation': 1880,
  'intelligent document processing': 1600,
  'business process automation': 1300,
  'AI workflow automation': 1000,
  'customer service automation': 880,
  'recruiting automation': 720,
  'property condition assessment report': 720,
  'CRM automation': 590,
  'invoice processing automation': 438,
  'ecommerce automation': 260,
  'insurance claims automation': 140,
  'customer feedback analysis': 140,
  'contract review automation': 110,
  'legal document automation': 90,
  'law firm automation': 40,
  'manufacturing workflow automation': 20,
};

const evidencePotential: Record<string, number> = {
  client: 260,
  internal: 170,
  reference: 130,
  market: 100,
};

function sortByPotential(studies: CaseStudy[]) {
  return [...studies].sort((a, b) => studyScore(b) - studyScore(a));
}

function studyScore(cs: CaseStudy) {
  const keyword = inferredKeyword(cs);
  const searchScore = keyword ? keywordPotential[keyword] || 0 : 0;
  const proofScore = cs.evidenceType ? evidencePotential[cs.evidenceType] || 0 : 60;
  const toolScore = Math.min(cs.toolsUsed?.length || 0, 6) * 8;
  const detailScore = (cs.quickAnswer ? 50 : 0) + (cs.workflowSteps?.length ? 40 : 0) + (cs.safeguards?.length ? 30 : 0);
  return searchScore + proofScore + toolScore + detailScore;
}

function inferredKeyword(cs: CaseStudy) {
  if (cs.targetKeyword && keywordPotential[cs.targetKeyword]) return cs.targetKeyword;
  const text = `${cs.title} ${cs.slug.current} ${cs.industry || ''} ${cs.projectType || ''}`.toLowerCase();
  if (/invoice|accounts payable|ap\b/.test(text)) return 'accounts payable automation';
  if (/document|cim|pitch|data-room|diligence|reserve study/.test(text)) return 'AI document processing';
  if (/support|ticket|zendesk/.test(text)) return 'customer service automation';
  if (/recruit|candidate|resume/.test(text)) return 'recruiting automation';
  if (/property condition|assessment|inspection|reserve/.test(text)) return 'property condition assessment report';
  if (/crm|lead|sales|outbound/.test(text)) return 'CRM automation';
  if (/shopify|ecommerce|commerce|returns/.test(text)) return 'ecommerce automation';
  if (/insurance|claim|fnol/.test(text)) return 'insurance claims automation';
  if (/contract|legal|law|matter|imanage|clio/.test(text)) return 'legal document automation';
  if (/manufactur|shift|factory/.test(text)) return 'manufacturing workflow automation';
  return cs.targetKeyword;
}

const categoryDefinitions = [
  {
    id: 'document-processing',
    label: 'Document processing',
    description: 'Invoice, CIM, data-room, report and file-intake workflows where the main problem is extracting facts from documents.',
    test: /document|invoice|accounts payable|cim|pitch|diligence|reserve|data-room|report|ocr/i,
  },
  {
    id: 'sales-support',
    label: 'Sales and support',
    description: 'Lead routing, customer support, feedback triage and revenue workflows that need faster response and cleaner handoffs.',
    test: /crm|lead|sales|support|ticket|customer|feedback|outbound|meta|shopify/i,
  },
  {
    id: 'legal-finance',
    label: 'Legal and finance',
    description: 'Matter intake, contract review, private knowledge search, investment review and finance operations workflows.',
    test: /legal|law|contract|matter|finance|investment|portfolio|quant|pe|private equity/i,
  },
  {
    id: 'operations',
    label: 'Operations automation',
    description: 'Recruiting, manufacturing, ecommerce, property, scheduling and operating workflows that connect several systems.',
    test: /recruit|manufactur|shift|ecommerce|property|booking|calendar|operations|scrum|agriculture/i,
  },
];

function buildCategories(studies: CaseStudy[]) {
  return categoryDefinitions
    .map((category) => ({
      id: category.id,
      label: category.label,
      description: category.description,
      studies: studies.filter((cs) => category.test.test(`${cs.title} ${cs.industry || ''} ${cs.projectType || ''} ${cs.overview || ''}`)),
    }))
    .filter((category) => category.studies.length)
    .map((category) => ({ ...category, count: category.studies.length }));
}
