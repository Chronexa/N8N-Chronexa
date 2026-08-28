import type { Metadata } from 'next';
import { site } from '../../lib/site';
import styles from './Privacy.module.css';

/**
 * Organisation-wide privacy policy.
 *
 * Written to cover every relationship Chronexa has with personal data — website
 * visitors, prospects across any channel, clients, the data inside systems we build
 * and operate, candidates and suppliers — rather than any single campaign or channel.
 * It is referenced by advertising lead forms, which require a genuine privacy policy,
 * and by client contracts.
 */
export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | Chronexa' },
  description:
    'How Chronexa collects, uses, stores, shares and protects personal information — across our website, our client engagements, the systems we build and operate, and every channel we use to communicate.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | Chronexa',
    description: 'How Chronexa handles personal information across our website, client engagements and communications.',
    url: '/privacy',
    type: 'website',
  },
};

const LAST_UPDATED = '26 August 2026';

export default function PrivacyPage() {
  return (
    <section className={styles.page}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

        <div className={styles.body}>
          <p>
            {site.name} builds and operates automation and artificial-intelligence systems for
            businesses. That work necessarily involves personal information — our own visitors and
            prospects, our clients&apos; staff, and sometimes the data held inside the systems we build.
            This policy explains how we handle all of it.
          </p>
          <p>
            It applies to everything we do: our website, our advertising and marketing, our sales
            conversations, our client engagements, the software we deliver, and our dealings with
            candidates and suppliers. Where a signed agreement with a client says something more
            specific, that agreement governs the data covered by it.
          </p>

          <h2>1. Who we are and how to reach us</h2>
          <p>
            {site.legalName} (trading as {site.name}) operates from {site.locality} and serves clients
            internationally. For the
            personal information described in Section 3 we act as the <strong>controller</strong> — we
            decide why and how it is used. For personal information inside systems we build or run on
            a client&apos;s behalf we act as a <strong>processor</strong>, handling it only on that
            client&apos;s documented instructions.
          </p>
          <p>
            For any privacy question, request or complaint, including requests under the Indian Digital
            Personal Data Protection Act, the GDPR, or comparable laws, write to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> with &quot;Privacy&quot; in the subject.
            That address reaches the person responsible for privacy matters at {site.name}, and we aim
            to respond within 30 days.
          </p>

          <h2>2. Our principles</h2>
          <ul>
            <li>We collect the least we need, and we say why.</li>
            <li>We do not sell personal information, and we never have.</li>
            <li>We do not share it with third parties for their own marketing.</li>
            <li>We do not use client data to train public or third-party AI models.</li>
            <li>Where we can do the work without personal data, we do.</li>
          </ul>

          <h2>3. Information we collect, and why</h2>

          <h3>Prospects and enquiries</h3>
          <p>
            When you contact us — through a form on this website, an advertising lead form on a social
            platform, email, telephone, WhatsApp, LinkedIn, a booked call, or in person — we collect
            what you tell us. Typically that is your name, work email, phone number, employer, role,
            and a description of the problem you want solved. We use it to respond, to prepare for
            conversations with you, and to keep a record of what was discussed.
          </p>
          <p>
            <strong>Our lawful basis</strong> is our legitimate interest in responding to a business
            enquiry you initiated, and your consent where a channel requires it — messaging you on
            WhatsApp, for example, which we do only where you have specifically agreed to it.
          </p>

          <h3>Clients and engagements</h3>
          <p>
            During an engagement we hold contact and role details for the people we work with, together
            with correspondence, meeting records, project documentation and billing information. We use
            this to deliver the work, support it, invoice for it, and meet our legal and tax obligations.
          </p>

          <h3>Data inside the systems we build</h3>
          <p>
            Our work often involves processing documents, records and messages belonging to a client —
            which may contain personal information about that client&apos;s own customers, employees or
            counterparties. We access this only as far as building, testing, operating and supporting
            the system requires. We do not use it for our own purposes, we do not use it to train models
            for other clients, and we return or delete it at the end of the engagement in line with the
            relevant contract.
          </p>

          <h3>Website visitors</h3>
          <p>
            We collect standard technical information — IP address, browser and device type, pages
            viewed, time spent, and the site or advertisement that referred you. We use it to understand
            what is useful, to fix problems, and to measure whether our advertising works.
          </p>

          <h3>Candidates and suppliers</h3>
          <p>
            If you apply to work with us we hold your application and our notes on it for up to twelve
            months. If you supply goods or services to us we hold the contact and payment details needed
            to work with you and pay you.
          </p>

          <h2>4. Cookies, analytics and advertising</h2>
          <p>
            We use cookies and similar technologies for three things: making the site work, measuring
            how it is used, and measuring our advertising. Analytics tell us which pages people read.
            Advertising technologies, including the Meta Pixel and equivalent conversion measurement,
            tell the platform that a visit or an enquiry happened, so we can tell which campaigns produce
            real conversations and stop paying for those that do not.
          </p>
          <p>
            You can block or delete cookies in your browser settings, and control how advertising
            platforms profile you in their own preference centres — for example in your{' '}
            <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">
              Meta ad preferences
            </a>
            . Blocking analytics or advertising cookies does not affect the site&apos;s function.
          </p>

          <h2>5. How we communicate with you</h2>
          <p>
            We contact people by email, telephone and messaging platforms including WhatsApp. Where a
            channel or a law requires your explicit permission before we may use it, we ask for it
            first and record that you gave it.
          </p>
          <p>
            You can stop any of it at any time — reply <strong>STOP</strong> to a message, use the
            unsubscribe link in an email, tell us on a call, or write to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>. We act on those requests promptly and
            keep only the minimum record needed to make sure we do not contact you again by mistake.
          </p>

          <h2>6. Artificial intelligence</h2>
          <p>
            We build AI systems, and we use them in our own work. Two commitments follow from that.
          </p>
          <p>
            First, <strong>we do not use client data or your personal information to train
            general-purpose AI models</strong>, whether ours or a third party&apos;s. Where a system we
            build learns from a client&apos;s data, it does so for that client alone.
          </p>
          <p>
            Second, where we use third-party AI services in delivering work, we choose services that
            contractually exclude the data we send from being used for their own model training, and we
            prefer deployments inside a client&apos;s own environment where the engagement calls for it.
          </p>
          <p>
            We do not make decisions about individuals that produce legal or similarly significant
            effects on them by automated means alone.
          </p>

          <h2>7. Who we share information with</h2>
          <p>
            We use established service providers to run our business. They act on our instructions and
            are bound by confidentiality and data-protection terms. They fall into these categories:
          </p>
          <ul>
            <li>Cloud hosting and infrastructure</li>
            <li>Email, document storage and collaboration tools</li>
            <li>Customer records and workflow systems</li>
            <li>Advertising, messaging and scheduling platforms</li>
            <li>Website and product analytics</li>
            <li>Accounting, invoicing and payment processing</li>
            <li>AI and machine-learning services used to deliver client work</li>
          </ul>
          <p>
            We will also disclose information where the law requires it, where we must to establish or
            defend a legal claim, or in connection with a merger or acquisition — in which case we will
            tell you before your information becomes subject to a different policy.
          </p>
          <p>
            We will name the specific providers relevant to you on request. Clients receive a current
            sub-processor list as part of their engagement.
          </p>

          <h2>8. International transfers</h2>
          <p>
            We operate from India and work with clients and suppliers in other countries, so personal
            information may be processed outside your own. Where we transfer information across borders
            we rely on appropriate safeguards — standard contractual clauses, adequacy decisions, or the
            equivalent mechanism available under the applicable law. Clients with data-residency
            requirements should raise them before an engagement begins; we can usually meet them.
          </p>

          <h2>9. How long we keep information</h2>
          <ul>
            <li><strong>Enquiries that do not become clients:</strong> up to 24 months from last contact.</li>
            <li><strong>Client records:</strong> for the engagement, then as long as tax, accounting and limitation law requires.</li>
            <li><strong>Data inside systems we build:</strong> per the client contract; returned or deleted at the end of the engagement.</li>
            <li><strong>Candidate applications:</strong> up to 12 months.</li>
            <li><strong>Website analytics:</strong> up to 26 months, in aggregate wherever possible.</li>
          </ul>
          <p>You can ask us to delete sooner, and we will unless we are legally required to keep it.</p>

          <h2>10. How we protect information</h2>
          <p>
            Access is limited to the people who need it to do their job. Credentials and secrets are
            held in dedicated secret-management systems, never in code or documents. Systems are
            protected by access controls and multi-factor authentication, data is encrypted in transit
            and at rest with the providers we use, and we review our arrangements regularly.
          </p>
          <p>
            No system is perfectly secure. If a breach affects your personal information we will notify
            you and the relevant authority as the law requires, and tell you plainly what happened and
            what we are doing about it.
          </p>

          <h2>11. Your rights</h2>
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Know what information we hold about you and get a copy</li>
            <li>Have inaccurate information corrected</li>
            <li>Have your information deleted</li>
            <li>Restrict or object to how we use it, including for direct marketing</li>
            <li>Receive your information in a portable format</li>
            <li>Withdraw consent you previously gave, at any time</li>
            <li>Nominate someone to exercise these rights on your behalf</li>
            <li>Complain to your data protection authority</li>
          </ul>
          <p>
            Email <a href={`mailto:${site.email}`}>{site.email}</a>. We do not require any particular
            form of words, and we will not charge you or make it difficult. If the information sits
            inside a system we run for a client, we are the processor and will refer your request to
            that client, telling you that we have done so.
          </p>

          <h2>12. Children</h2>
          <p>
            We sell to businesses and do not direct our services at children. We do not knowingly
            collect information from anyone under 18. If you believe we have, tell us and we will delete
            it.
          </p>

          <h2>13. Changes</h2>
          <p>
            When this policy changes we update the date at the top. Where a change materially affects
            how we use information you have already given us, we will tell you directly rather than
            relying on you noticing.
          </p>

          <div className={styles.contact}>
            <p><strong>Privacy questions, requests or complaints</strong></p>
            <p><a href={`mailto:${site.email}`}>{site.email}</a> — subject line &quot;Privacy&quot;</p>
            <p>{site.legalName}, {site.locality}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
