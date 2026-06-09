import styles from './Faq.module.css';

export const FAQS = [
  {
    q: 'How long does implementation take?',
    a: 'Typically 4–6 weeks from kickoff to full automation. Week 1 is discovery and mapping, weeks 2–3 are building and integrating, week 4 is testing and optimization, then we go live.',
  },
  {
    q: 'What tools do you integrate with?',
    a: 'We integrate with all major platforms including HubSpot, Salesforce, Mailchimp, Google Ads, LinkedIn Ads, QuickBooks, and 50+ other tools. If you use a specific platform, we can likely connect it.',
  },
  {
    q: 'Do we need technical expertise to manage this?',
    a: 'No. We build and manage everything for you. Your team just focuses on strategy and results. We handle all the technical setup, integrations, and ongoing optimization.',
  },
  {
    q: 'What if our process needs to change?',
    a: 'We include unlimited workflow adjustments for the first 90 days. After that, we provide ongoing optimization as part of your monthly service. Changes are typically implemented within 1–2 business days.',
  },
  {
    q: 'How do you measure ROI?',
    a: "We track time saved, cost reduction, lead volume, conversion rates, and revenue impact. You receive regular reports showing exactly what's working and where we're optimizing, measured against the ROI targets we agree up front and backed by our 90-day ROI guarantee.",
  },
  {
    q: "What happens if results don't meet expectations?",
    a: "We offer a 90-day ROI guarantee. If you don't hit agreed-upon targets, we'll work for free until you do or refund your setup costs. We're committed to your success.",
  },
  {
    q: 'Can you automate our existing workflows?',
    a: 'Yes. We can automate your current processes and also help you design new high-performing workflows. We typically start by automating what already works, then build additional systems based on your goals.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Faq() {
  return (
    <div className={styles.faqSection}>
      <div>
        <p className="eyebrow">Frequently Asked Questions</p>
        <h2 className={styles.faqTitle}>We get asked this all the time</h2>
      </div>
      <div className={styles.list}>
        {FAQS.map((f) => (
          <details className={styles.item} key={f.q}>
            <summary className={styles.summary}>
              <span>{f.q}</span>
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{f.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
