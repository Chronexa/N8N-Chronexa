'use client';

import styles from '../../components/calculators/calculators.module.css';
import BookButton from '../../components/BookButton';

export default function APArticle() {
  return (
    <article>

      {/* ── Article Body ─────────────────────────────────────────────── */}
      <section className="section-light">
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>

          <header style={{ marginBottom: '2rem' }}>
            <p className="eyebrow" style={{ color: 'var(--brand-green-ink)' }}>The CFO&rsquo;s Briefing</p>
            <h2 style={{ fontSize: 'var(--step-4)', marginBottom: '1rem', lineHeight: 1.15 }}>
              AP Automation Is Not an Efficiency Play. It&rsquo;s a Working Capital Play.
            </h2>
            <p className={styles.prose} style={{ fontSize: 'var(--step-1)' }}>
              Every CFO who has looked at AP automation has been shown a slide about reducing data entry costs. The slide shows a $12 cost-per-invoice dropping to $2.50. The CFO nods politely, does the math in their head ($1M invoices × $9.50 savings = $9.5M), and thinks: &ldquo;That&rsquo;s not worth the change management.&rdquo; They&rsquo;re right — at that framing.
            </p>
            <p className={styles.prose} style={{ marginTop: '1rem' }}>
              The correct framing is not labor efficiency. The correct framing is Working Capital Velocity — and the numbers are dramatically, almost embarrassingly larger.
            </p>
          </header>

          <div style={{ display: 'grid', gap: '2rem' }}>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                1. Understanding the &ldquo;2/10 Net 30&rdquo; Discount — The Invisible Million
              </h3>
              <p className={styles.prose}>
                Most procurement and finance teams know what &ldquo;2/10 Net 30&rdquo; means intellectually: a vendor is offering a 2% discount if you pay within 10 days, with the net balance due in 30 days. Most also know that missing this window means paying full price. What they dramatically underestimate is the aggregate value of that discount at scale.
              </p>
              <p className={styles.prose}>
                Consider a company with $50 million in annual invoice spend. Industry data shows that approximately 20% of vendors offer some form of early payment discount, and the standard discount rate is 2%. This means $10 million in annual spend is eligible for a $200,000 discount — if, and only if, invoices are approved within 10 days of receipt.
              </p>
              <p className={styles.prose}>
                Now consider the typical AP department. An invoice arrives, it sits in an email inbox for 2 days until someone notices it. It is manually entered into the ERP system — a process that takes 12–20 minutes per invoice. It goes through a 3-stage approval workflow that takes an average of 8 days. By the time the invoice is approved and scheduled for payment, 12 days have elapsed. The early payment window closed on day 10. The $200,000 annual discount is simply forfeit — not through any conscious decision, but through process drag.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--brand-green)', paddingLeft: '1.5rem', margin: '1.5rem 0', fontStyle: 'italic', color: 'var(--text-muted-light)' }}>
                &ldquo;Data entry is cheap. Missed opportunities are expensive. CFOs who frame AP automation as a labor saving miss the 10× larger opportunity sitting in the discount window.&rdquo;
              </blockquote>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                2. Days Payable Outstanding: The Hidden Lever on Working Capital
              </h3>
              <p className={styles.prose}>
                Beyond the early payment discount, there is a second, more structural working capital impact: Days Payable Outstanding (DPO). DPO measures how long your business takes to pay its vendors. A higher DPO means you hold onto cash longer — which is generally good for working capital. A lower DPO means you&rsquo;re releasing cash faster than necessary.
              </p>
              <p className={styles.prose}>
                But there&rsquo;s a critical nuance. DPO should be a deliberate, strategic number — optimized to preserve maximum working capital while capturing available discounts. In most organizations, DPO is not strategic; it is the accidental result of a slow AP process. Invoices take 12 days to approve not because the CFO chose 12 days, but because that&rsquo;s how long the email-to-ERP-to-approval chain takes.
              </p>
              <p className={styles.prose}>
                When AI compresses invoice processing from 12 days to 24 hours, the CFO gains something more valuable than labor savings: they gain the ability to choose their DPO. They can capture the early payment discount on the 20% of invoices where it&rsquo;s available, while extending payment terms to the full 30 days on the remaining 80% — optimizing working capital across the entire supplier base simultaneously.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                3. How Manual AP Actually Works (And Where Every Minute Is Lost)
              </h3>
              <p className={styles.prose}>
                To understand the opportunity, it helps to trace the exact journey of a single invoice through a typical manual AP process:
              </p>
              <ol style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.75rem', color: 'var(--text-muted-light)', lineHeight: 1.6, marginTop: '1rem' }}>
                <li><strong style={{ color: 'var(--text-light)' }}>Arrival &amp; Inbox Management (Day 1–2).</strong> The invoice arrives by email, mail, or vendor portal. It sits in a shared inbox until an AP clerk checks it — often 1–2 business days later.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Manual Data Entry into ERP (12–20 minutes).</strong> The clerk opens the invoice PDF, reads every field — vendor name, invoice number, line items, amounts, due date — and manually types it into the ERP system. A 10-line invoice takes a skilled clerk 15 minutes. An error rate of 2–5% is standard for manual data entry.</li>
                <li><strong style={{ color: 'var(--text-light)' }}> 3-Way Match Verification (5–15 minutes).</strong> The clerk manually verifies that the invoice matches the purchase order and the delivery receipt. Discrepancies must be resolved by contacting the vendor or the internal buyer — a process that can take 1–3 days.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Approval Workflow (3–7 days).</strong> The invoice is routed to the appropriate approver based on vendor category and amount. The approver receives an email notification, opens the ERP system, reviews the invoice, and clicks approve. Or they don&rsquo;t — and the AP clerk must send a reminder 2 days later.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Payment Scheduling (Day 10–14).</strong> Approved invoices are batched for payment runs, typically weekly. The payment is scheduled, the vendor is notified, and the invoice is marked closed. Total elapsed time: 12–15 days.</li>
              </ol>
            </section>

          </div>
        </div>
      </section>

      {/* ── Mid-Article Nudge ─────────────────────────────────────────── */}
      <section className="section-muted" style={{ padding: 'var(--spacing-lg) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 'var(--step-2)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                Ready to see your firm&rsquo;s early payment discount opportunity?
              </p>
              <p style={{ color: 'var(--text-muted-dark)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
                We&rsquo;ll audit your AP process and show you exactly how much is being left on the table.
              </p>
            </div>
            <BookButton location="ap-article-mid" className="btn-primary">
              Book a Free AP Audit →
            </BookButton>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '2rem' }}>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                4. What AI-Powered AP Processing Actually Does
              </h3>
              <p className={styles.prose}>
                The Chronexa AP automation pipeline collapses the 12–15 day invoice lifecycle into approximately 24 hours, without changing the approval authority structure or requiring any migration from your existing ERP.
              </p>
              <p className={styles.prose}>
                The process begins the moment an invoice is received — whether by email attachment, vendor portal upload, EDI feed, or physical mail scan. The system reads every field using a combination of Optical Character Recognition (OCR) and AI document understanding, including vendor name normalization, PO number matching, and line-item extraction. Every extracted field carries a confidence score. Fields below the confidence threshold are flagged for human verification and never silently pushed into the ERP.
              </p>
              <p className={styles.prose}>
                The 3-way match is performed automatically: invoice versus purchase order versus goods receipt. Discrepancies are flagged immediately and routed to the appropriate resolver — eliminating the 3–7 day wait for approval simply because no one noticed the mismatch. Approved invoices are automatically scheduled for payment at the optimal time: within 10 days if the vendor offers an early payment discount, or at 29 days if they do not — maximizing both discount capture and working capital retention.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                5. The CFO Business Case: Presenting This to Your Board
              </h3>
              <p className={styles.prose}>
                When presenting AP automation to a board or CFO, the labor savings are a footnote. The headline metrics — the ones that matter to a capital allocator — are:
              </p>
              <ol style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.75rem', color: 'var(--text-muted-light)', lineHeight: 1.6, marginTop: '1rem' }}>
                <li><strong style={{ color: 'var(--text-light)' }}>Early Payment Discount Capture Rate.</strong> What percentage of available discounts is the firm currently capturing? At 12-day processing, the answer is typically 0%. With 24-hour processing, the answer becomes 100%. The delta at $50M spend is $200,000 per year — captured from relationships that already exist.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Working Capital Released.</strong> By compressing the approval-to-payment cycle, the firm can make a conscious decision about DPO — choosing to hold cash for the full 30-day term on standard invoices while paying early only when a discount justifies it.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Error Rate &amp; Fraud Risk Reduction.</strong> Manual AP processes carry a 2–5% error rate in data entry, creating reconciliation costs and audit risk. AI-extracted data with per-field confidence scoring reduces this to under 0.5%, with every exception documented and auditable.</li>
              </ol>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1rem' }}>
                {[
                  { q: 'Which ERP systems does the integration support?', a: 'SAP, Oracle NetSuite, Microsoft Dynamics 365, QuickBooks, Xero, and Sage. Our pipeline pushes verified invoice data directly into your existing system — no migration, no parallel running, no disruption to your current approval authority structure.' },
                  { q: 'How does the system handle international invoices with different formats?', a: 'The Document Intelligence Engine is trained on invoice formats across 40+ countries. Currency conversion, VAT/GST handling, and local date format recognition are all automated. For invoices in non-Latin scripts (Arabic, Chinese, Japanese), we use specialized OCR models with human verification on the first 50 invoices per vendor to establish a high-confidence extraction template.' },
                  { q: 'What happens to invoices the AI cannot read confidently?', a: 'They are immediately flagged and routed to a human reviewer with the AI\'s best attempt pre-populated. The reviewer verifies, corrects if needed, and approves. Every exception is logged and used to improve extraction accuracy for that vendor going forward. Nothing is ever silently accepted with low confidence.' },
                  { q: 'Is this safe for vendor data and banking information?', a: 'Yes. All processing occurs within your own secure cloud tenant — vendor banking data is never sent to shared AI infrastructure. SOC 2 Type II compliance, end-to-end encryption, and role-based access controls are standard.' },
                ].map((item) => (
                  <div key={item.q} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.4rem' }}>{item.q}</p>
                    <p style={{ color: 'var(--text-muted-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </section>

      {/* ── Final Audit CTA ───────────────────────────────────────────── */}
      <section className="section-light" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0b281b 0%, #0f3d28 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            display: 'grid',
            gap: '1rem',
          }}>
            <p className="eyebrow" style={{ color: 'var(--brand-green)' }}>Free Workflow Audit</p>
            <h3 style={{ fontSize: 'var(--step-3)', color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
              Find out exactly how much your slow AP is costing you.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, maxWidth: '55ch', margin: 0 }}>
              In a 30-minute call, we review your current AP process, calculate your exact early payment discount opportunity, and show you the working capital unlock your firm can achieve — with zero disruption to your existing ERP or approval chain.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>
              No commitment. If we can&rsquo;t find an opportunity worth more than the cost to build it, you owe us nothing — and you keep the AP analysis and roadmap.
            </p>
            <BookButton location="ap-article-bottom" className="btn-primary">
              Book the Free Audit Call →
            </BookButton>
          </div>
        </div>
      </section>

    </article>
  );
}
