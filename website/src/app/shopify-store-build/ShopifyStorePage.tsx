'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VideoFrame from './VideoFrame';
import dynamic from 'next/dynamic';

// Below the fold: split into their own chunks so they don't delay the hero's first paint (LCP). Still server-rendered.
const LiveStores = dynamic(() => import('./LiveStores'));
import ScrollDepth from '../../components/ScrollDepth';
import { site } from '../../lib/site';
import { track, identifyAdAttribution } from '../../lib/analytics';
import { QUOTE, FAQS, TOUR, ANGLES, HERO_SCOPE, LIVE_STORES, FILMS, TESTIMONIALS, PROCESS, services, type AngleId } from './content';
import { GLOBAL, COUNTRY_CODES, detectCountryCode, type Market } from './markets';
import styles from './ShopifyStorePage.module.css';
import fs from './Flagship.module.css';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}

const PHONE = '+917973190226';
const V = (f: string) => `/videos/shopify-landing/${f}`;

/** Meta's ad/ad-set IDs off the URL, for attaching directly to lead-level
 * events — belt-and-suspenders alongside the session-wide identify in
 * identifyAdAttribution(), so a lead record itself carries its ad/adset even
 * if something clears the session between visit and submit. */
function adParams() {
  if (typeof window === 'undefined') return { adId: '', adsetId: '' };
  const params = new URLSearchParams(window.location.search);
  return { adId: params.get('utm_content') || '', adsetId: params.get('utm_term') || '' };
}

function scrollToForm() {
  document.getElementById('lead-form')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}

function ContactButtons({ where }: { where: string }) {
  return (
    <div className={styles.contactRow}>
      <a href={`tel:${PHONE}`} className={styles.contactBtn} onClick={() => track('shopify_landing_call_click', { where })}>
        Call now
      </a>
    </div>
  );
}

function CallLink({ where, className }: { where: string; className: string }) {
  return <a href={`tel:${PHONE}`} className={className} onClick={() => track('shopify_landing_call_click', { where })}>Or call us</a>;
}

type FormStatus = 'idle' | 'submitting' | 'done' | 'error';

/** 2026-09-28: cut to 3 required fields (name, phone, budget). 2026-10-01: store URL is required too
 * (a free audit needs the store link); budget stays. No Calendly: we phone every lead, so the
 * form entry itself is the booking.
 * Amplitude 24–28 Sep: 21 people started the old 6-required-field form, 5 sent it. Email,
 * "what do you sell" and "main problem" are gone; the problem now comes from the ad's
 * ?angle= instead of a question. Country code is pre-picked from the device time zone. */
function LeadForm({ market, angle }: { market: Market; angle: AngleId }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  // Server renders the market default; the client swaps in the detected country on hydration.
  const detectedCode = useSyncExternalStore(noSubscribe, () => detectCountryCode(market.countryCode), () => market.countryCode);
  const [pickedCode, setCountryCode] = useState<string | null>(null);
  const countryCode = pickedCode ?? detectedCode;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    if (String(fd.get('company_website') || '').trim()) { setStatus('done'); return; } // honeypot

    const name = String(fd.get('name') || '').trim();
    const code = countryCode.replace(/[^\d]/g, '');
    const localPhone = String(fd.get('phone') || '').replace(/[^\d]/g, '').replace(/^0+/, '');
    // Normalized once here so every downstream system (Sheet, CAPI, WhatsApp) reads the same coded number.
    const phone = code && localPhone ? `+${code}${localPhone}` : '';
    const storeUrl = String(fd.get('storeUrl') || '').trim();
    const budget = String(fd.get('budget') || '').trim();
    if (!name || localPhone.length < 6 || !budget || !storeUrl) {
      setError('Please add your name, phone number, budget and store website.');
      return;
    }

    // Matching eventID on the pixel and our server CAPI call lets Meta merge the two copies of this Lead.
    const eventId = `lead-${market.formSource}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const payload = {
      name,
      phone,
      storeUrl,
      email: '',
      company: '',
      // Which ad angle brought them in — replaces the old "main problem" question.
      sellsOnline: `Ad angle: ${angle}`,
      budget,
      waConsent: fd.get('waConsent') === 'on',
      source: market.formSource,
      eventId,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    setStatus('submitting');
    track('shopify_landing_lead_submit', {
      source: market.formSource, budget, angle, countryCode: code,
      hasStoreUrl: !!storeUrl, hasWaConsent: payload.waConsent,
      ...adParams(),
    });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Never leave the button on "Sending…": give up and show the call fallback.
      signal: AbortSignal.timeout(12000),
    })
      .then((r) => r.json().catch(() => ({ ok: r.ok })))
      .then((res: { ok?: boolean; qualified?: boolean }) => {
        if (!res.ok) { setStatus('error'); setError('Something went wrong. Please call us instead.'); return; }
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead', { content_name: market.pixelName, content_category: angle }, { eventID: eventId });
        }
        track('shopify_landing_lead_success', { source: market.formSource, qualified: !!res.qualified });
        setStatus('done');
      })
      .catch(() => { setStatus('error'); setError('Something went wrong. Please call us instead.'); });
  }

  if (status === 'done') {
    return (
      <div className={`${styles.form} ${fs.formCard}`} id="lead-form" role="status">
        <p className={styles.successText}>Thank you. We&rsquo;ve got your details.</p>
        <p className={styles.nurtureText}>We&rsquo;ll review your store and call or WhatsApp you soon with your free audit.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.form} ${fs.formCard}`} id="lead-form">
      <p className={styles.formLabel}>Get your free store audit</p>
      <p className={fs.formIntro}>Takes 30 seconds.</p>
      <form onSubmit={onSubmit} noValidate>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Your name</span>
          <input className={styles.input} name="name" autoComplete="name" required />
        </label>
        <div className={styles.field}>
          <label htmlFor="lead-phone" className={styles.fieldLabel}>Phone number</label>
          <div className={fs.phoneRow}>
            <select
              className={`${styles.input} ${fs.codeSelect}`}
              name="countryCode"
              aria-label="Country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((c) => <option key={c.code + c.label} value={c.code}>{c.label} +{c.code}</option>)}
            </select>
            <input id="lead-phone" className={styles.input} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={countryCode === market.countryCode ? market.phonePlaceholder : 'Phone number'} required />
          </div>
        </div>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Your budget</span>
          <select className={styles.input} name="budget" defaultValue="" required>
            <option value="" disabled>Choose a range</option>
            {market.budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Your store website</span>
          <input className={styles.input} name="storeUrl" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" required />
        </label>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />
        <label className={styles.consent}>
          <input type="checkbox" name="waConsent" defaultChecked />
          <span>You can message me on WhatsApp. I&rsquo;ve read the <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.</span>
        </label>
        <button className={`${styles.submit} ${fs.submitBig}`} type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : <>Get my free store audit <span aria-hidden="true">→</span></>}
        </button>
        {(error || status === 'error') && <p role="alert" className={styles.errorText}>{error || 'Something went wrong. Please call us instead.'}</p>}
        <p className={styles.formNote}>Free, no obligation. We review your store, then call you. You get a written plan and a fixed price before any work starts.</p>
      </form>
    </div>
  );
}

/** ?angle= on the ad's link picks the hero that matches the ad clicked. */
const noSubscribe = () => () => {};
function readAngle(fallback: AngleId): AngleId {
  const a = new URLSearchParams(window.location.search).get('angle');
  return a && Object.hasOwn(ANGLES, a) ? (a as AngleId) : fallback;
}

/** Shared by /shopify-store-build (global) and /shopify-store-build-india — only `market` differs.
 * Section order (2026-09-29, rev 2): hero → store names → live stores → what we do →
 * CONTACT FORM → client notes → how it works → LUMIQ tour → FAQ → brand & video → closing Contact Us band.
 * Nothing was removed; Ankit moved the form after the scope and the films to the end. */
export default function ShopifyStorePage({ market = GLOBAL }: { market?: Market }) {
  // No ?angle= → the market's default hero: India matches its only live ad (C1, "built for D2C brands"), global keeps 'outgrown'.
  // Server renders that default; the client swaps to the ad's angle on hydration (same 3-line height, no shift).
  const defaultAngle: AngleId = market.id === 'india' ? 'd2c' : 'outgrown';
  const angle = useSyncExternalStore(noSubscribe, () => readAngle(defaultAngle), () => defaultAngle);
  const [chapter, setChapter] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // The mobile bottom "Contact Us" bar hides while another big Contact Us (hero, form, closing band) is on screen.
  const [ctaInView, setCtaInView] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const enquiryRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  useEffect(() => {
    identifyAdAttribution();
    track('shopify_landing_angle_view', { angle: readAngle(market.id === 'india' ? 'd2c' : 'outgrown'), market: market.id });
  }, [market.id]);
  useEffect(() => {
    const els = [heroRef.current, enquiryRef.current, finalRef.current].filter((x): x is HTMLElement => !!x);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); }
      setCtaInView(visible.size > 0);
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const hero = ANGLES[angle];
  const tour = TOUR[chapter];
  const serviceList = services(market);
  const contactUs = (where: string) => {
    track(where === 'hero' ? 'shopify_landing_hero_cta_click' : where === 'sticky' ? 'shopify_landing_sticky_cta_click' : where === 'header' ? 'shopify_landing_header_cta_click' : 'shopify_landing_section_cta_click', { where, angle });
    scrollToForm();
    window.setTimeout(() => document.querySelector<HTMLInputElement>('#lead-form input[name="name"]')?.focus({ preventScroll: true }), 700);
  };
  const pickChapter = (i: number) => {
    setAutoAdvance(false);
    setChapter(i);
    track('shopify_landing_tour_chapter', { chapter: TOUR[i].id });
  };
  const navClick = (to: string) => track('shopify_landing_nav_click', { to });

  return (
    <div className={`${styles.page} ${fs.flagship}`}>
      <ScrollDepth pageType={market.formSource} />
      <header className={`${styles.topbar} ${fs.topbar}`}>
        <Link href="/" className={styles.wordmark}>chronexa<span>✳</span></Link>
        <nav className={fs.navLinks} aria-label="Page sections">
          <a href="#live-stores" onClick={() => navClick('live-stores')}>Our stores</a>
          <a href="#services" onClick={() => navClick('services')}>What we do</a>
          <a href="#process" onClick={() => navClick('process')}>How it works</a>
          <a href="#faq" onClick={() => navClick('faq')}>Questions</a>
        </nav>
        <button type="button" className={fs.headerCta} onClick={() => contactUs('header')}>Free audit</button>
      </header>

      {/* 1 — Hero: headline matches the ad clicked; one line on the offer; one big button. */}
      <section ref={heroRef} className={fs.hero} aria-labelledby="hero-heading">
        <div className={fs.heroCopy}>
          <p className={styles.eyebrow}><span /> SHOPIFY STORE REDESIGN</p>
          <h1 id="hero-heading"><span>{hero.lines[0]}</span> <span>{hero.lines[1]}</span> <em>{hero.em}</em></h1>
          <p className={fs.heroLead}>{hero.lead}</p>
          <ul className={fs.scopeChips} aria-label="What the redesign covers">{HERO_SCOPE.map((x) => <li key={x}>{x}</li>)}</ul>
          <div className={fs.heroActions}>
            <button type="button" className={fs.ctaBig} onClick={() => contactUs('hero')}>Get my free store audit <span aria-hidden="true">→</span></button>
            <CallLink where="hero" className={fs.ctaGhostDark} />
          </div>
          <p className={fs.heroNote}>Free store audit, then a call. You get a clear plan and a fixed price.</p>
        </div>
        <div className={fs.heroStage}>
          <VideoFrame id="hero-desktop" frame="laptop" address="lumiq-dev.myshopify.com" src={V('hero-desktop.mp4')} poster={V('hero-desktop.jpg')} label="Screen recording of the LUMIQ Shopify homepage scrolling on desktop" priority className={fs.heroLaptop} />
          <VideoFrame id="hero-mobile" frame="phone" src={V('real-home-mobile.mp4')} poster={V('real-home-mobile.jpg')} label="A real session on the LUMIQ store on a phone" priority className={fs.heroPhone} />
          <p className={fs.recordingTag}><span aria-hidden="true" /> <i className={fs.recWho}>LUMIQ, a store we built · </i>real screen recording</p>
        </div>
      </section>

      {/* 2 — The brands we built, named plainly. */}
      <section className={fs.proof} aria-label="Stores we designed and built">
        <p className={fs.proofIntro}>Stores we designed &amp; built:</p>
        <ul>{LIVE_STORES.map((b) => <li key={b.id}><strong>{b.name}</strong><span>{b.category}</span></li>)}</ul>
        <a className={fs.proofLink} href="#live-stores" onClick={() => track('shopify_landing_proof_jump')}>Shop them below <span aria-hidden="true">↓</span></a>
      </section>

      {/* 3 — The stores themselves, live on this page (no Shopify password). */}
      <section id="live-stores" className={fs.tryIt} aria-labelledby="live-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>01 / THREE STORES WE BUILT</p><h2 id="live-heading">Don&rsquo;t take our word for it.<br /><em>Shop them.</em></h2></div>
          <p>Three brands we designed and built, live right here. Browse the menu, open a product, add to bag. It&rsquo;s the real store, with checkout switched off.</p>
        </div>
        <LiveStores onCta={() => contactUs('live_store')} />
      </section>

      {/* 4 — What we do: the scope, unmistakable. */}
      <section id="services" className={fs.services} aria-labelledby="services-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>02 / WHAT WE DO</p><h2 id="services-heading">Everything your store needs.<br /><em>One team.</em></h2></div>
          <p>We don&rsquo;t just redesign the pages. We build the brand, the traffic and the systems behind them, so you can grow without hiring a bigger team.</p>
        </div>
        <ul className={fs.serviceGrid}>
          {serviceList.map((sv, i) => (
            <li key={sv.id} className={fs.serviceCard}>
              <p className={fs.serviceN}>0{i + 1}</p>
              <h3>{sv.title}</h3>
              <p className={fs.serviceOutcome}>{sv.outcome}</p>
              <ul>{sv.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </li>
          ))}
        </ul>
        <div className={fs.sectionCta}>
          <button type="button" className={fs.ctaBig} onClick={() => contactUs('services')}>Get my free store audit <span aria-hidden="true">→</span></button>
          <p>Every store is different, so there are no prices here. You get a written plan and a fixed price after the first call.</p>
        </div>
      </section>

      {/* 5 — The form, after the stores and the scope. On phones the form comes before the supporting copy. */}
      <section ref={enquiryRef} className={`${styles.enquiry} ${fs.enquiry}`} aria-labelledby="enquiry-heading">
        <div className={fs.enquiryHead}>
          <p className={styles.eyebrow}>FREE STORE AUDIT</p>
          <h2 id="enquiry-heading">Get your free store audit.<br /><em>We&rsquo;ll call you back.</em></h2>
          <p>Leave your number and your store link. We review your store, call you with what we found, then send a written plan and a fixed price.</p>
        </div>
        <LeadForm market={market} angle={angle} />
        <div className={fs.enquiryMore}>
          <ol className={styles.roadmapList}><li>What your redesign should cover</li><li>How the new store will look and work</li><li>A written plan and fixed price</li></ol>
          <blockquote>&ldquo;{QUOTE.text}&rdquo;<footer><span className={styles.founderInitial} aria-hidden="true">T</span><span><strong>Tushar</strong><br />Co-founder, Chronexa</span></footer></blockquote>
        </div>
      </section>

      {/* 6 — Client voices: an editorial wall, not a generic review grid. */}
      <section className={fs.testimonials} aria-labelledby="testimonials-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>03 / CLIENT NOTES</p><h2 id="testimonials-heading">Built with the people<br /><em>behind the brands.</em></h2></div>
          <p>Notes from six clients after working with us on their stores — from careful rebuilds to full brand and Shopify systems.</p>
        </div>
        <div className={fs.testimonialGrid}>
          {TESTIMONIALS.map((testimonial, index) => (
            <article key={testimonial.id} className={fs.testimonialCard}>
              {'image' in testimonial && (
                <div className={fs.testimonialVisual} aria-hidden="true">
                  <Image src={testimonial.image} alt="" fill sizes="(max-width: 700px) 82vw, (max-width: 1100px) 42vw, 32vw" />
                  <span>{testimonial.brand}</span>
                </div>
              )}
              <div className={fs.testimonialBody}>
                <p className={fs.quoteMark} aria-hidden="true">“</p>
                <blockquote>{testimonial.quote}</blockquote>
                <footer>
                  <span className={fs.clientInitial} aria-hidden="true">{testimonial.name.charAt(0)}</span>
                  <span><strong>{testimonial.name}</strong><small>{testimonial.brand} · {testimonial.category}</small></span>
                </footer>
              </div>
              <span className={fs.noteNumber} aria-hidden="true">0{index + 1}</span>
            </article>
          ))}
        </div>
        <p className={fs.swipeNote}>Swipe to read all six <span aria-hidden="true">→</span></p>
      </section>

      {/* 7 — How it works. */}
      <section id="process" className={fs.process} aria-labelledby="process-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>04 / HOW IT WORKS</p><h2 id="process-heading">From first call<br /><em>to launch.</em></h2></div>
          <p>You sign off at every stage. The plan, timeline and price are agreed in writing before work starts.</p>
        </div>
        <ol className={fs.steps}>
          {PROCESS.map((st) => (
            <li key={st.n}>
              <p className={fs.stepTop}><span>{st.n}</span></p>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
        <div className={fs.sectionCta}>
          <button type="button" className={fs.ctaBig} onClick={() => contactUs('process')}>Get my free store audit <span aria-hidden="true">→</span></button>
        </div>
      </section>

      {/* 8 — Proof in depth: real sessions on LUMIQ. */}
      <section id="inside-lumiq" className={fs.tour} aria-labelledby="tour-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>05 / INSIDE LUMIQ</p><h2 id="tour-heading">Watch a real shopper<br /><em>go from tap to checkout.</em></h2></div>
          <p>Real sessions on LUMIQ, recorded on a phone and a laptop: browsing, the menu, the product page, the cart and checkout.</p>
        </div>
        <div className={fs.tourTabs} role="group" aria-label="Choose part of the store">
          {TOUR.map((t, i) => (
            <button key={t.id} type="button" aria-pressed={chapter === i} aria-controls="tour-stage" onClick={() => pickChapter(i)} className={chapter === i ? fs.tabOn : ''}>
              <span>0{i + 1}</span>{t.tab}
            </button>
          ))}
        </div>
        <div id="tour-stage" className={fs.tourStage}>
          <div className={`${fs.tourScreen} ${tour.frame === 'phone' ? fs.tourScreenPhone : ''}`}>
            <VideoFrame
              key={tour.frame}
              id={`tour-${tour.id}`}
              frame={tour.frame}
              address={`lumiq-dev.myshopify.com${tour.path === '/' ? '' : tour.path}`}
              src={tour.src}
              poster={tour.poster}
              aspect={'aspect' in tour ? tour.aspect : undefined}
              label={`Screen recording of the LUMIQ ${tour.tab.toLowerCase()}`}
              loop={!autoAdvance}
              onEnded={() => { if (autoAdvance) setChapter((c) => (c + 1) % TOUR.length); }}
            />
          </div>
          <div className={fs.tourInfo} aria-live="polite">
            <p className={fs.tourCount}>{String(chapter + 1).padStart(2, '0')} / {String(TOUR.length).padStart(2, '0')}</p>
            <h3>{tour.title}</h3>
            <p>{tour.why}</p>
            <ul className={fs.tags}>{tour.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <button type="button" className={fs.nextBtn} onClick={() => pickChapter((chapter + 1) % TOUR.length)}>
              Next: {TOUR[(chapter + 1) % TOUR.length].tab} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className={`${styles.faqSection} ${fs.faq}`} aria-labelledby="faq-heading"><div><p className={styles.eyebrow}>COMMON QUESTIONS</p><h2 id="faq-heading">Before we begin.</h2><ContactButtons where="faq" /></div><div>{FAQS.map((f, i) => <div key={f.q} className={styles.faqItem}><button type="button" className={styles.faqQ} aria-expanded={openFaq === i} aria-controls={`faq-answer-${i}`} onClick={() => { setOpenFaq(openFaq === i ? null : i); if (openFaq !== i) track('shopify_landing_faq_open', { q: i }); }}>{f.q}<span aria-hidden="true">{openFaq === i ? '−' : '+'}</span></button><p id={`faq-answer-${i}`} hidden={openFaq !== i} className={styles.faqA}>{f.a}</p></div>)}</div></section>

      {/* 9 — Brand & video (last content section, after the FAQ): every brand gets its own identity and films. */}
      <section className={fs.films} aria-labelledby="films-heading">
        <div className={fs.sectionHead}>
          <div><p className={styles.eyebrow}>06 / BRAND &amp; VIDEO</p><h2 id="films-heading">Three brands.<br /><em>Three identities.</em></h2></div>
          <p>Each store gets its own look, photos and videos, made for that brand and used across the store, social media and ads.</p>
        </div>
        <div className={fs.filmGrid}>
          {FILMS.map((b) => (
            <article key={b.brand} className={fs.filmBrand}>
              <header><h3>{b.brand}</h3><p>{b.category} · {b.tone}</p></header>
              <VideoFrame id={`film-${b.brand}`} src={b.main.src} poster={b.main.poster} label={b.main.label} className={fs.filmMain} />
              <div className={fs.filmSide}>
                {b.side.map((c) => <VideoFrame key={c.src} id={`film-${b.brand}-side`} src={c.src} poster={c.poster} label={c.label} className={fs.filmSmall} />)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 10 — Closing ask for people who read to the end. */}
      <section ref={finalRef} className={fs.finalCta} aria-labelledby="final-heading">
        <h2 id="final-heading">Want a free audit of <em>your store?</em></h2>
        <p>Free store audit. No obligation.</p>
        <div className={fs.heroActions}>
          <button type="button" className={fs.ctaBig} onClick={() => contactUs('final')}>Get my free store audit <span aria-hidden="true">→</span></button>
          <CallLink where="final" className={fs.ctaGhostDark} />
        </div>
      </section>

      <footer className={styles.pageFoot}><Link href="/" className={styles.wordmark}>chronexa<span>✳</span></Link><p>{market.id === 'india' ? `${site.legalName}, India. Remote team, working with Shopify brands.` : 'Chronexa · remote-first, working with Shopify brands in the US, UK and worldwide.'}<br /><a href="/privacy">Privacy policy</a> · Your store. Your ownership.</p><span>DESIGNED TO SELL. ↗</span></footer>
      <div className={`${styles.stickyBar} ${ctaInView ? fs.stickyHidden : ''}`}>
        <button className={`${styles.stickyBtn} ${styles.stickyBtnPrimary} ${fs.stickyMain}`} onClick={() => contactUs('sticky')}>Get my free store audit →</button>
        <a href={`tel:${PHONE}`} className={styles.stickyBtn} onClick={() => track('shopify_landing_call_click', { where: 'sticky' })}>Call</a>
      </div>
    </div>
  );
}
