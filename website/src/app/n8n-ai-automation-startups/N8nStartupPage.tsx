'use client';

import { useState, type FormEvent } from 'react';
// No Nav/Footer/<main> here — layout.tsx renders the site chrome around every route
// via ChromeGate. Rendering them again duplicated the header and footer on this page.
import ScrollDepth from '../../components/ScrollDepth';
import LogoChip from '../../components/LogoChip';
import { openBooking, trackBookCta } from '../../lib/cal';
import { track, identifyByEmail } from '../../lib/analytics';
import { site } from '../../lib/site';
import { SITUATIONS, IMPACT, FAQS } from './situations';
import styles from './N8nStartupPage.module.css';

/**
 * Meta-ads landing page for startup founders.
 *
 * Rebuilt 2026-08-02 to the plan in docs/n8n-startup-landing-visual-design.md, which
 * replaced a nine-card filterable gallery — the exact pattern the rest of the site
 * moved away from — with a plain, light, mobile-first page.
 *
 * The constraints are deliberate and worth keeping:
 *   • No dark backgrounds. Warm paper and white only.
 *   • Green appears twice: one phrase in the headline, and the buttons. Nowhere else.
 *   • No animation, no textures, no gradients, no mockups, no emojis.
 *   • Mobile is the design target; most of this traffic arrives on a phone.
 *
 * Every figure on the page is published research with its source printed beside it.
 * Nothing here is presented as a client result, because we do not have those numbers.
 */

/* ─── Global types ─────────────────────────────────────────────────────── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}

const PHONE = '+917973190226';
const WHATSAPP = 'https://wa.me/917973190226';

/**
 * Set to a number (e.g. 150000) to publish a starting price. Left null on purpose:
 * inventing a figure is worse than omitting one, and this is a commercial decision.
 * When a real number exists, set it here — the line appears, nothing else changes.
 */
const PRICE_FROM: number | null = null;

/* ─── Icons — outline only, no emojis ─────────────────────────────────── */
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
);

/* ─── Contact buttons ─────────────────────────────────────────────────── */
function ContactButtons({ where }: { where: string }) {
  return (
    <div className={styles.contactRow}>
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.contactBtn}
        onClick={() => track('n8n_startup_whatsapp_click', { where })}
      >
        <IconWhatsApp /> WhatsApp us
      </a>
      <a
        href={`tel:${PHONE}`}
        className={styles.contactBtn}
        onClick={() => track('n8n_startup_call_click', { where })}
      >
        <IconPhone /> Call now
      </a>
    </div>
  );
}

/* ─── Lead form — logic unchanged, it is tested end to end into Baserow,
       the leads sheet and the n8n sheet. Only the styling moved. ───────── */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
const FORM_SOURCE = 'n8n-startup-landing';

function LeadForm({ id, onFocusChange }: { id: string; onFocusChange?: (focused: boolean) => void }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const companySize = String(fd.get('companySize') || '').trim();
    const comments = String(fd.get('comments') || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !company || !companySize) {
      setStatus('error');
      setError('Please fill in your name, work email, company and team size.');
      return;
    }

    setStatus('submitting');
    identifyByEmail(email);
    track('n8n_startup_lead_submit', { source: FORM_SOURCE, form: id });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, companySize, comments, source: FORM_SOURCE }),
    })
      .then((r) => {
        if (r.ok) {
          setStatus('success');
          track('n8n_startup_lead_success', { source: FORM_SOURCE, form: id });

          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Lead', {
              content_name: 'N8n Startup Landing Form',
              currency: 'USD',
            });
          }

          trackBookCta(FORM_SOURCE);
          setTimeout(() => openBooking({ name, email, notes: comments }), 600);
        } else {
          setStatus('error');
          setError('Something went wrong. Please try again.');
        }
      })
      .catch(() => {
        setStatus('error');
        setError('Something went wrong. Please try again.');
      });
  }

  if (status === 'success') {
    return (
      <div className={styles.form}>
        <p className={styles.successText}>Thanks. We are opening the calendar in a new tab.</p>
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
          If it did not open, book directly here
        </a>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      onFocusCapture={() => onFocusChange?.(true)}
      onBlurCapture={() => onFocusChange?.(false)}
    >
      <p className={styles.formLabel}>Tell us what is eating the most time</p>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Your name</span>
        <input className={styles.input} name="name" autoComplete="name" required />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Work email</span>
        <input className={styles.input} name="email" type="email" autoComplete="email" required />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Company</span>
        <input className={styles.input} name="company" autoComplete="organization" required />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Team size</span>
        <select className={styles.input} name="companySize" defaultValue="" required>
          <option value="" disabled>Choose one</option>
          <option value="1-20">1 to 20</option>
          <option value="21-50">21 to 50</option>
          <option value="51-100">51 to 100</option>
          <option value="101-150">101 to 150</option>
          <option value="150+">More than 150</option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>What takes the most time right now (optional)</span>
        <textarea className={styles.input} name="comments" rows={3} />
      </label>

      <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending' : 'Show me what to automate'}
      </button>

      {status === 'error' && <p className={styles.errorText}>{error}</p>}

      <p className={styles.formNote}>
        30 minutes, no slide deck. You get a written plan of what is worth automating and
        what it costs, as a document you can forward to your co-founder. Yours either way.
      </p>
    </form>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function N8nStartupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formFocused, setFormFocused] = useState(false);

  return (
    <div className={styles.page}>
      <ScrollDepth pageType="n8n-startup-landing" />

      {/* 1 — Hero */}
      <section className={`section-light ${styles.hero}`}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <p className="eyebrow">For founders scaling past 20 people</p>
              <h1 className={styles.h1}>
                Do the work of a 100-person team.{' '}
                <span className="accent-phrase">With the team you already have.</span>
              </h1>
              <p className={styles.lede}>
                Every day your people spend hours doing work a machine could do. Replying to
                enquiries. Chasing follow-ups. Answering the same customer question for the
                fortieth time. Copying numbers between WhatsApp, email and Excel. Building the
                same report every Monday.
              </p>
              <p className={styles.lede}>
                We build systems that do that work instead, connected to the tools you already
                use, running on your own infrastructure, owned by you.
              </p>
              <p className={styles.ledeStrong}>
                Your team keeps the thinking. The machine does the typing.
              </p>
              <ContactButtons where="hero" />
            </div>

            <div className={styles.heroForm}>
              <LeadForm id="hero" onFocusChange={setFormFocused} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Credibility strip. No founder photos: this proves the work instead. */}
      <section className={`section-muted ${styles.stripBand}`}>
        <div className="container">
          <div className={styles.strip}>
            <p className={styles.stripLead}>
              We run our own sales outreach and this website&rsquo;s blog on the same systems we
              build for clients.
            </p>
            <div className={styles.stripLogos}>
              {[
                { file: 'n8n.svg', name: 'n8n' },
                { file: 'claude.svg', name: 'Claude' },
                { file: 'openai.svg', name: 'OpenAI' },
                { file: 'slack.svg', name: 'Slack' },
                { file: 'whatsapp.svg', name: 'WhatsApp' },
                { file: 'gmail.svg', name: 'Gmail' },
                { file: 'hubspot.png', name: 'HubSpot' },
                { file: 'airtable.svg', name: 'Airtable' },
              ].map((t) => (
                <LogoChip key={t.file} file={t.file} name={t.name} size="sm" />
              ))}
            </div>
            <p className={styles.stripMeta}>
              Chronexa, India. We reply on WhatsApp within the hour, 9am to 9pm IST.{' '}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={styles.stripLink}>
                +91 79731 90226
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 3 — What it is costing you. Sources print under every figure, on purpose. */}
      <section className={`section-light ${styles.band}`}>
        <div className="container">
          <h2 className={styles.h2}>What that costs you right now</h2>
          <div className={styles.figures}>
            {IMPACT.map((f) => (
              <div key={f.line} className={styles.figure}>
                {/* Static, not counted up — the brief was no animation. */}
                <p className={`display-num ${styles.figureNum}`}>
                  {f.prefix}{f.value}{f.suffix}
                </p>
                <p className={styles.figureLine}>{f.line}</p>
                <p className={styles.figureSource}>{f.source}</p>
              </div>
            ))}
          </div>
          <p className={styles.afterFigures}>
            None of this is a people problem. Nobody is being lazy. It is work that nobody built
            a system for, so a person does it by hand, every day.
          </p>

          {/* 4 — Soft CTA for anyone already convinced */}
          <div className={styles.softCta}>
            <p>Already know which part of this is you?</p>
            <ContactButtons where="after-figures" />
          </div>
        </div>
      </section>

      {/* 5 — The five situations */}
      <section className={`section-muted ${styles.band}`}>
        <div className="container">
          <h2 className={styles.h2}>You will recognise at least three of these</h2>
          <p className={styles.sectionLede}>
            These are not features. They are the five things that break in almost every company
            between 20 and 100 people, whatever it sells.
          </p>

          <div className={styles.situations}>
            {SITUATIONS.map((s) => (
              <article key={s.id} className={styles.situation}>
                <h3 className={styles.situationTitle}>{s.title}</h3>

                <div className={styles.compare}>
                  <div className={styles.compareCol}>
                    <p className={styles.compareLabel}>Today</p>
                    {s.today.map((line) => (
                      <p key={line} className={styles.compareLine}>{line}</p>
                    ))}
                  </div>
                  <div className={styles.compareCol}>
                    <p className={`${styles.compareLabel} ${styles.compareLabelAfter}`}>With Chronexa</p>
                    {s.after.map((line) => (
                      <p key={line} className={styles.compareLine}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className={styles.situationFoot}>
                  <div className={styles.situationLogos}>
                    {s.tools.map((t) => (
                      <LogoChip key={t.file} file={t.file} name={t.name} size="sm" />
                    ))}
                  </div>
                  <p className={styles.humanLine}>A person still decides: {s.human}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Our own systems. The only claim a competitor cannot copy. */}
      <section className={`section-light ${styles.band}`}>
        <div className="container">
          <h2 className={styles.h2}>We built ours first</h2>
          <p className={styles.sectionLede}>
            Two of the five above are not examples. They are how this company runs.
          </p>

          <div className={styles.ownGrid}>
            <div className={styles.own}>
              <h3 className={styles.ownTitle}>Our outbound engine</h3>
              <p className={styles.ownBody}>
                Every prospect is researched automatically, including what the company does and
                what has happened there recently. A short, specific email is written for that one
                company, sent, and followed up. Leads move through their stages on their own.
                Nobody here copies anything between tools.
              </p>
            </div>
            <div className={styles.own}>
              <h3 className={styles.ownTitle}>Our content pipeline</h3>
              <p className={styles.ownBody}>
                Five steps, chained together. One reads Google Search Console and decides what is
                worth writing about. One researches it. One writes it. One makes the cover image.
                One publishes it to this website. It runs every week.
              </p>
            </div>
          </div>

          <p className={styles.ownFoot}>
            On the call we will open both and show you the workflows actually running, rather than
            slides of them.
          </p>
        </div>
      </section>

      {/* 7 — Cost. Answers the fear; the number is optional (see PRICE_FROM). */}
      <section className={`section-muted ${styles.band}`}>
        <div className="container">
          <h2 className={styles.h2}>What it costs</h2>
          <div className={styles.costPanel}>
            {PRICE_FROM !== null && (
              <p className={`display-num ${styles.costNum}`}>
                Most first builds start at ₹{PRICE_FROM.toLocaleString('en-IN')}
              </p>
            )}
            <p className={styles.costBody}>
              Fixed price, agreed in writing before we start. One payment for the build, not a
              monthly licence. Two to three weeks. Thirty days of support included.
            </p>
            <p className={styles.costBody}>
              You own the files, so if you walk away it keeps working and any competent developer
              can pick it up. No per-task fees, and nothing switches off when you stop paying us.
            </p>
            <p className={styles.costMetaHead}>What changes the price</p>
            <p className={styles.costMeta}>How many processes you want built.</p>
            <p className={styles.costMeta}>How many tools they need to connect to.</p>
            <p className={styles.costMeta}>Whether it runs on your servers or ours.</p>
          </div>
        </div>
      </section>

      {/* 8 — The jugaad answer. Respectful, never defensive. */}
      <section className={`section-light ${styles.band}`}>
        <div className="container">
          <div className={styles.prose}>
            <h2 className={styles.h2}>You could probably build version one yourself</h2>
            <p>
              Honestly, you could. n8n is open source, the templates are free, and if you or
              someone on your team is technical you will have something working in a weekend. We
              are not going to pretend otherwise.
            </p>
            <p>
              Here is what usually happens next. Version one works. Then an API changes and it
              stops, quietly, and nobody notices for four days. Then the person who built it gets
              pulled onto the product. Then a customer gets the wrong reply and nobody can explain
              why, because there are no logs. Then it sits broken for a month and everyone goes
              back to doing the work by hand.
            </p>
            <p>
              The build is the easy part. What you are paying us for is that it still works in
              month eight: logging, alerts when something fails, retries, someone accountable when
              an API changes at 2am, and documentation so it is not trapped in one person&rsquo;s
              head. Which, if you think about it, is the problem you came here to solve.
            </p>
            <p>
              If you would rather build it yourself, do. Call us when it breaks and we will fix it
              and hand it back to you working.
            </p>
          </div>
        </div>
      </section>

      {/* 9 — What stays human */}
      <section className={`section-light ${styles.bandTight}`}>
        <div className="container">
          <div className={styles.prose}>
            <h2 className={styles.h2}>What we do not automate</h2>
            <p>
              We do not automate decisions with money or a customer relationship on the other end.
              Refunds, pricing, anything a customer is angry about, anything legal or regulated. A
              person decides those, every time. What the system does is put the full picture in
              front of that person the moment they need it, instead of making them scroll a
              WhatsApp thread to work out what happened.
            </p>
            <p>
              Everything we build keeps a log, so you can see what it did, when and why. If
              something breaks at 2am it tells a person. It does not fail quietly.
            </p>
          </div>
        </div>
      </section>

      {/* 10 — Questions */}
      <section className={`section-muted ${styles.band}`}>
        <div className="container">
          <h2 className={styles.h2}>Questions founders ask</h2>
          <div className={styles.faq}>
            {FAQS.map((f, i) => (
              <div key={f.q} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQ}
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className={styles.faqSign} aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Closing ask */}
      <section className={`section-light ${styles.band}`}>
        <div className="container">
          <div className={styles.closing}>
            <div className={styles.closingText}>
              <h2 className={styles.h2}>Tell us what is eating the most time</h2>
              <p className={styles.lede}>
                Thirty minutes. You describe the work your team does by hand every day. We tell you
                what is worth automating, what it takes and roughly what it costs, in writing.
              </p>
              <ContactButtons where="closing" />
            </div>
            <div className={styles.heroForm}>
              <LeadForm id="closing" onFocusChange={setFormFocused} />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky contact bar, phones only. Hidden while the form has focus so it
          never covers the submit button. */}
      <div className={styles.stickyBar} data-hidden={formFocused || undefined}>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stickyBtn}
          onClick={() => track('n8n_startup_whatsapp_click', { where: 'sticky' })}
        >
          <IconWhatsApp /> WhatsApp
        </a>
        <a
          href={`tel:${PHONE}`}
          className={`${styles.stickyBtn} ${styles.stickyBtnPrimary}`}
          onClick={() => track('n8n_startup_call_click', { where: 'sticky' })}
        >
          <IconPhone /> Call now
        </a>
      </div>
    </div>
  );
}
