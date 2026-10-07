import type { Metadata } from 'next';
import { site } from '../../lib/site';
import LeadForm from '../../components/LeadForm';
import BookButton from '../../components/BookButton';
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
  title: { absolute: 'Discuss Your Technology Project | Chronexa' },
  description:
    "Talk to Chronexa about software development, AI automation, voice agents, Shopify, UX design or dedicated engineering support.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Discuss Your Technology Project | Chronexa',
    description: "Talk to Chronexa about software development, AI automation, voice agents, Shopify, UX design or dedicated engineering support.",
    url: '/contact',
    type: 'website',
    images: [site.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discuss Your Technology Project | Chronexa',
    description: "Talk to Chronexa about software development, AI automation, voice agents, Shopify, UX design or dedicated engineering support.",
    images: [site.ogImage],
  },
};

export default function ContactPage() {
  return (
    <section className={styles.wrap}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Talk to our team</p>
          <h1 className={styles.h1}>Let&apos;s talk today</h1>
          <p className="heroDescription">
            Tell us about your product, technology challenge or engineering roadmap. We’ll discuss your priorities and help define a practical next step.
          </p>
          <div className={styles.bookRow}>
            <BookButton location="contact-intro">Book a Discovery Call. <span aria-hidden="true">→</span></BookButton>
            <span className={styles.bookNote}>Free 30-min call · pick a time that works</span>
          </div>
          <ul className={styles.meta}>
            <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><span>Location</span>{site.locality}</li>
          </ul>
        </div>

        <div className={styles.formCard}>
          <LeadForm source="contact" />
        </div>
      </div>
    </section>
  );
}
