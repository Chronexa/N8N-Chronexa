import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCaseStudies, urlFor } from '../../sanity/client';
import styles from './casestudies.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Case Studies & Portfolio',
  description:
    'Real automation outcomes from Chronexa — compressing 6-hour reserve studies into 11 minutes, scaling outbound without headcount, automating regulatory intelligence, and more.',
  alternates: { canonical: '/case-studies' },
};

export default async function CaseStudiesPage() {
  const studies = await getAllCaseStudies();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className="eyebrow">Real Results</p>
        <h1 className={styles.h1}>Work we&apos;ve actually shipped</h1>
        <p className="heroDescription" style={{ marginBottom: 'var(--spacing-lg)' }}>
          Quantified outcomes from custom AI and n8n automation builds across legal, insurance,
          accounting, real estate, agriculture, and e-commerce.
        </p>

        <div className={styles.grid}>
          {studies.map((cs) => {
            const thumb = cs.thumb?.asset ? urlFor(cs.thumb).width(720).height(420).fit('crop').auto('format').url() : null;
            return (
              <Link href={`/case-studies/${cs.slug.current}`} key={cs._id} className={styles.card}>
                <div className={styles.thumb}>
                  {thumb ? (
                    <Image src={thumb} alt={cs.thumb?.alt || cs.title} width={720} height={420} sizes="(max-width: 800px) 100vw, 380px" />
                  ) : (
                    <div className={styles.thumbFallback} aria-hidden="true">Chronexa</div>
                  )}
                </div>
                <div className={styles.body}>
                  <span className={styles.meta}>{cs.industry || cs.projectType}{cs.year ? ` • ${cs.year}` : ''}</span>
                  <h2 className={styles.cardTitle}>{cs.title}</h2>
                  {(cs.stat1 || cs.stat2) && (
                    <div className={styles.stats}>
                      {cs.stat1 && <span><strong>{cs.stat1}</strong> {cs.stat1Text}</span>}
                      {cs.stat2 && <span><strong>{cs.stat2}</strong> {cs.stat2Text}</span>}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
