'use client';

import styles from '../../components/calculators/calculators.module.css';
import BookButton from '../../components/BookButton';
import CtaBand from '../../components/CtaBand';

export default function CPAArticle() {
  return (
    <article>

      {/* ── Article Body ─────────────────────────────────────────────── */}
      <section className="section-light">
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>

          <header style={{ marginBottom: '2rem' }}>
            <p className="eyebrow" style={{ color: 'var(--brand-green-ink)' }}>The Insider&rsquo;s Guide</p>
            <h2 style={{ fontSize: 'var(--step-4)', marginBottom: '1rem', lineHeight: 1.15 }}>
              The CPA Firm Capacity Problem No One Talks About
            </h2>
            <p className={styles.prose} style={{ fontSize: 'var(--step-1)' }}>
              Every February, the same crisis: too many returns, not enough signed partners. The instinct is to hire more seasonal staff. The reality is that more prep staff without fixing the review bottleneck is like adding more cars to a gridlocked freeway.
            </p>
          </header>

          <div style={{ display: 'grid', gap: '2rem' }}>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                1. The Constraint Nobody Is Measuring
              </h3>
              <p className={styles.prose}>
                In every CPA firm, throughput is governed by the slowest node in the production chain. For small and mid-size practices, that node is almost universally the same: the Partner or Senior Reviewer who must sign every single return before it leaves the building.
              </p>
              <p className={styles.prose}>
                A Partner working 60 hours a week across a 14-week tax season has 840 hours of total capacity. At 45 minutes per review — a realistic benchmark for a well-prepared return — that partner can theoretically sign 1,120 returns per season. But that assumes every return arrives perfectly complete and error-free.
              </p>
              <p className={styles.prose}>
                It never does. Industry data shows that in the average CPA firm, 25–35% of returns are kicked back to the preparer for errors, missing documents, or data mismatches. Every kickback costs the partner an additional 30 minutes of re-review time. At a 30% rework rate on 1,000 returns, that&rsquo;s 150 hours of partner time consumed by rework alone — the equivalent of two full weeks of review capacity simply evaporating into corrections.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--brand-green)', paddingLeft: '1.5rem', margin: '1.5rem 0', fontStyle: 'italic', color: 'var(--text-muted-light)' }}>
                &ldquo;The constraint in a CPA firm is never the junior prep time; it is the Senior Reviewer&rsquo;s time. If you speed up juniors without fixing the error rate, you just create a pile of trash on the Partner&rsquo;s desk.&rdquo;
              </blockquote>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                2. Why Hiring More Juniors Makes the Problem Worse
              </h3>
              <p className={styles.prose}>
                This is the counterintuitive insight that most firms miss. When you add a new seasonal preparer, you increase the volume of returns flowing toward the partner&rsquo;s review queue — but the partner&rsquo;s total available hours remain constant. The result is not more capacity; it is a larger backlog and increased stress in the final weeks of filing season.
              </p>
              <p className={styles.prose}>
                The right question is not &ldquo;How many more preparers do we need?&rdquo; The right question is &ldquo;How can we compress the error rate so that each return the partner reviews is essentially complete and correct on first touch?&rdquo;
              </p>
              <p className={styles.prose}>
                Firms that have solved this report a counterintuitive outcome: their senior reviewers are finishing the season with energy to spare, and they are capturing 30–50% more client fees without a single additional partner hire.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                3. The Five Stages Where Time Is Lost
              </h3>
              <p className={styles.prose}>
                To fix the bottleneck, you must first map the full lifecycle of a return from client engagement to partner signature. The time lost to manual work falls into five distinct stages:
              </p>
              <ol style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.75rem', color: 'var(--text-muted-light)', lineHeight: 1.6, marginTop: '1rem' }}>
                <li><strong style={{ color: 'var(--text-light)' }}>Document Collection (4–6 weeks per client).</strong> The average CPA firm spends 47 days chasing documents from clients who haven&rsquo;t yet uploaded their W-2, 1099s, or brokerage statements. During this period, every client portal requires manual checking, every follow-up is a hand-typed email, and nothing moves until the client responds.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Document Classification (20–30 mins per file).</strong> Once documents arrive — often as unordered PDFs, scanned images, and emailed attachments — a staff member must manually open each one, identify its type (W-2, 1099-DIV, K-1, Schedule B brokerage composite), and sort it into the correct folder. Firms handling 1,000+ returns can spend hundreds of staff hours on this task alone.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Data Extraction &amp; Entry (1.5–2.5 hrs per return).</strong> The preparer reads every field from the source documents and re-types it into the tax software. This is the single largest time consumer in the preparation workflow and carries the highest error rate.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Return Population &amp; Review Prep (30–45 mins).</strong> The preparer reviews the populated return for obvious errors, attaches supporting documents, and submits it to the partner review queue.</li>
                <li><strong style={{ color: 'var(--text-light)' }}>Partner Review (45–180 mins per return).</strong> The partner reviews every return against source documents. For a 94% pre-filled return with extracted data, this takes 15–25 minutes. For a manually prepared return with typical errors, it takes 45–180 minutes — and may generate a kickback that doubles the total.</li>
              </ol>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                4. How AI Compresses All Five Stages Simultaneously
              </h3>
              <p className={styles.prose}>
                The breakthrough is not AI replacing the preparer. The breakthrough is AI compressing the first four stages down to near-zero — so the preparer&rsquo;s entire role shifts from data-entry operator to exception reviewer and client advisor.
              </p>
              <p className={styles.prose}>
                When a Chronexa CPA automation pipeline is live, the lifecycle looks radically different. The system monitors client portals and sends automated, personalized follow-up messages when documents are missing or incomplete — reducing the collection window from 47 days to approximately 16 days. When documents arrive, they are classified automatically across 18+ document types within minutes. Every field is extracted, verified against cross-checks (e.g., Box 1 of a W-2 must match Line 1a of the 1040), and pre-populated into your existing tax software — UltraTax, CCH Axcess, Drake, Lacerte, or ProConnect — with a confidence score on every extracted value.
              </p>
              <p className={styles.prose}>
                The return that reaches the partner is 90–94% pre-filled. Every extracted figure is hyperlinked back to its source document on a side-by-side review dashboard. The partner can complete a full return review in 15–25 minutes. More importantly, the rework rate drops from 30% to under 5% — because errors are flagged before the return ever hits the review queue.
              </p>
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
                Want to see what this looks like in your firm?
              </p>
              <p style={{ color: 'var(--text-muted-dark)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
                We&rsquo;ll map your current review bottleneck and model the exact capacity unlock — at no cost.
              </p>
            </div>
            <BookButton location="cpa-article-mid" className="btn-primary">
              Book a Free Capacity Audit →
            </BookButton>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container" style={{ maxWidth: '80ch', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '2rem' }}>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                5. The Real Economic Case: Revenue, Not Cost Savings
              </h3>
              <p className={styles.prose}>
                The conversation around CPA automation is almost always framed around labor cost savings. This is the wrong frame entirely. Partners don&rsquo;t care about saving $35/hour in preparer wages. They care about revenue — specifically, about the revenue ceiling that their current process artificially imposes.
              </p>
              <p className={styles.prose}>
                Consider a 2-partner firm filing 1,000 returns at $750 average per return. Their combined review capacity — at 30% rework and 45 minutes average per review — limits them to approximately 850 completable returns per season. They are effectively turning away $112,500 in billings every year, not because they lack clients, but because they lack partner signing capacity.
              </p>
              <p className={styles.prose}>
                Eliminating the rework loop through AI-verified preparation immediately unlocks the capacity to review and sign 350+ additional returns — without a single additional partner hour. At $750 per return, that is $262,500 in new revenue from the same two partners, in the same 14 weeks, with no change in headcount.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                6. Implementation: From Decision to Live in 3–5 Weeks
              </h3>
              <p className={styles.prose}>
                The most common objection from practice managers is timeline: &ldquo;We can&rsquo;t implement a major technology change during tax season.&rdquo; This is a valid concern for traditional software implementations that require months of IT integration, user training, and migration. It is not a valid concern for the Chronexa CPA workflow.
              </p>
              <p className={styles.prose}>
                Our implementation works with your existing tax software — there is no migration, no data transfer, and no retraining of your preparers on a new platform. The automation layer sits on top of your current stack: it pulls documents from your portal, classifies and extracts them, and pushes pre-filled data into your existing software as if a highly accurate junior preparer had done the work. Your preparers continue using the tools they already know. The pipeline is fully live within 3–5 weeks of engagement.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--step-2)', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1rem' }}>
                {[
                  { q: 'Does AI work on complex returns like trusts and estates?', a: 'The automation handles the data-entry intensive stages (document collection, classification, extraction, and pre-population) extremely well on 1040s, 1120s, and most 1065s. For returns that require significant judgment — complex trusts, first-year business returns with unusual structures — the value shifts from pre-population to faster document retrieval and verification, which still meaningfully compresses review time.' },
                  { q: 'What tax software do you integrate with?', a: 'UltraTax CS, CCH Axcess Tax, Drake, Lacerte, and ProConnect. The pre-filled return lands in the software your preparers already use. No migration required.' },
                  { q: 'How does it handle handwritten or poor-quality scans?', a: 'Our Document Intelligence Engine uses a combination of OCR and AI vision with per-field confidence scoring. Low-confidence reads are flagged for human review and never silently pushed into the return. Your preparers see exactly which fields were auto-extracted and which require verification.' },
                  { q: 'What is the no-risk guarantee?', a: 'If, after your free workflow audit, we cannot identify an automation opportunity worth more in new capacity than the cost of implementing it, you owe us nothing — and you keep the capacity analysis and roadmap we produced.' },
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
              Stop modelling. Start measuring.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, maxWidth: '55ch', margin: 0 }}>
              In a 30-minute call, we map your firm&rsquo;s exact review bottleneck, identify which preparation stages are consuming the most partner time, and show you the precise capacity unlock your firm can achieve before the next filing season.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>
              No commitment. No sales pitch. If we can&rsquo;t find capacity worth more than it costs to unlock it, you keep the roadmap and owe us nothing.
            </p>
            <BookButton location="cpa-article-bottom" className="btn-primary" >
              Book the Free Audit Call →
            </BookButton>
          </div>
        </div>
      </section>

    </article>
  );
}
