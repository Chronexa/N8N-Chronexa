import Image from 'next/image';
import styles from './Faq.module.css';

/**
 * Homepage FAQ. Written for the questions a serious buyer actually asks before
 * a first call — rewritten 2026-07 to carry the agency positioning: the two
 * questions that define us ("why not just ChatGPT?" and "are you a tool?")
 * now lead, followed by data, control, failure modes, ownership and price.
 */
export const FAQS = [
  {
    q: 'How is this different from just using ChatGPT or Claude?',
    a: 'A chat window answers questions about whatever you paste into it. It cannot watch your inbox, know a new document has arrived, classify a hundred thousand filings, or put the result into the systems your team works in. That takes infrastructure — integrations, retrieval pipelines, approval gates, logging — engineered around the models, inside your environment. That infrastructure is what we build.',
  },
  {
    q: 'Are you a software product, or an agency?',
    a: 'An agency. We are AI integration and infrastructure partners: a senior engineering team that designs, builds and runs custom AI systems inside your business. There is no product to subscribe to — what you get is working infrastructure on your own stack, and you own it outright.',
  },
  {
    q: 'Do you build with tools like n8n and Zapier, or write custom code?',
    a: 'Whichever the problem actually needs — orchestration tools where they fit, custom code and fine-tuned models where they do not, often both in one system. The value is not the tool; it is the system design, the integrations and the reliability engineering around it. We are not reselling a workflow builder.',
  },
  {
    q: 'Where does our data live, and who can see it?',
    a: 'Inside your own environment. We deploy on the infrastructure you already run — including private, self-hosted model instances on AWS, Azure or Google Vertex AI where compliance requires it — with role-based access and full audit logging. Your data never leaves your boundary and is never used to train a model: not ours, and not any provider’s.',
  },
  {
    q: 'What happens when the AI gets something wrong?',
    a: 'It is designed to surface uncertainty rather than guess. Low-confidence outputs are flagged for a human instead of being silently accepted, and a human-approval gate sits wherever you want one — before a document is filed, an order is placed, or an email leaves. Every step is logged, so you can always see what happened and why.',
  },
  {
    q: 'Do we have to replace the tools we already use?',
    a: 'No. Everything we build wires into the stack you already run — your CRM, DMS, practice management, tax software, accounting system or data warehouse. Replacing a working system is the most expensive way to start, so we connect to it instead.',
  },
  {
    q: 'Who owns the system if we stop working with you?',
    a: 'You do. We build assets you own outright, on your infrastructure, documented and handed over — not a subscription you rent from us. If we part ways, the system keeps running and your team has what it needs to operate and change it.',
  },
  {
    q: 'How long until it is live, and what does it cost?',
    a: 'A focused workflow is typically live in 3–5 weeks; a full multi-agent system across a department is usually a couple of months. Every engagement is fixed-price, with the scope, the success metrics and the price agreed in writing before any code is written. The audit that precedes it is free.',
  },
  {
    q: 'We are not in finance, legal or insurance. Do you still work with us?',
    a: 'Yes. Our depth is in regulated industries — financial services, legal, insurance, private equity — because that is where the constraints are hardest. But the work is defined by the bottleneck, not the sector: if you have repetitive, high-volume work in documents, sales, support or operations, the same engineering applies.',
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
        {/* The orchestration render — one hub, many systems, one amber human. */}
        <Image
          src="/images/3d-orchestration.webp"
          alt=""
          width={1100}
          height={733}
          sizes="(max-width: 820px) 86vw, 360px"
          className={styles.art}
          aria-hidden="true"
        />
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
