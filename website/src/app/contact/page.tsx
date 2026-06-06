import type { Metadata } from 'next';
import { site } from '../../lib/site';
import LeadForm from '../../components/LeadForm';
import styles from './contact.module.css';

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Chronexa',
  url: `${site.url}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: site.name,
    email: site.email,
    url: site.url,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      areaServed: ['US', 'GB', 'CA'],
      availableLanguage: ['en'],
    },
  },
};

export const metadata: Metadata = {
  title: 'Book a Free Automation Audit',
  description:
    "Tell us about your workflows and we'll show you where AI can save time and cost. No spam, no sales pitch — just actionable insights.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Book a Free Automation Audit | Chronexa',
    description: "Tell us about your workflows and we'll show you where AI can save time and cost.",
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <section className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Automation Audit</p>
          <h1 className={styles.h1}>Let&apos;s talk today</h1>
          <p className="heroDescription">
            Sometimes the hardest part is reaching out — but once you do, we&apos;ll make the
            rest easy. We&apos;ll review your workflows and suggest where AI can save time &amp; cost.
          </p>
          <ul className={styles.meta}>
            <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><span>Location</span>{site.locality}</li>
            <li><span>Hours</span>{site.hours}</li>
          </ul>
        </div>

        <div className={styles.formCard}>
          <LeadForm source="contact" />
        </div>
      </div>
    </section>
  );
}
