'use client';

import Image from 'next/image';
import Link from 'next/link';
import BookButton from '../BookButton';
import LeadForm from '../LeadForm';
import ScrollDepth from '../ScrollDepth';
import TrackView from '../TrackView';
import LiveStores from '../../app/shopify-store-build/LiveStores';
import { site } from '../../lib/site';
import s from './commerce.module.css';

const PILLARS = [
  { no: '01', h: 'Brand & buying experience', p: 'Positioning, identity, UX and content that help a customer understand the product and choose with confidence.', tags: ['Brand system', 'UX/UI', 'Product storytelling', 'Mobile commerce'] },
  { no: '02', h: 'Shopify engineering', p: 'A fast, maintainable storefront with reusable sections, structured product data and the custom behavior your model needs.', tags: ['Shopify', 'Shopify Plus', 'Theme development', 'Custom features'] },
  { no: '03', h: 'Commerce operations', p: 'Orders, inventory, fulfillment, support, returns and finance connected around a reliable source of truth.', tags: ['ERP / OMS', '3PL', 'Gorgias', 'Returns'] },
  { no: '04', h: 'Growth infrastructure', p: 'Clean measurement and lifecycle signals from campaign click through purchase, retention and repeat revenue.', tags: ['GA4', 'Meta CAPI', 'Klaviyo', 'Experimentation'] },
];

const JOURNEY = [
  { event: '01 / ARRIVE', h: 'The promise continues', p: 'Ad or search intent lands on the right story, collection or product.', signal: 'Campaign → landing context' },
  { event: '02 / DISCOVER', h: 'The catalog makes sense', p: 'Navigation, search, filters and merchandising narrow the decision.', signal: 'Intent → relevant products' },
  { event: '03 / DECIDE', h: 'The product earns trust', p: 'Media, proof, variants, delivery and offer logic remove hesitation.', signal: 'Questions → confidence' },
  { event: '04 / BUY', h: 'Checkout protects intent', p: 'Cart, payments, tax, shipping and discounts work across markets.', signal: 'Intent → completed order' },
  { event: '05 / DELIVER', h: 'Operations keep the promise', p: 'Accurate order data reaches fulfillment, support and finance.', signal: 'Order → customer outcome' },
  { event: '06 / RETURN', h: 'Signals compound', p: 'Lifecycle messaging and support history create the next purchase.', signal: 'Customer → repeat revenue' },
];

const PROCESS = [
  ['01', 'Commerce diagnosis', 'Customers, analytics, catalog, brand, technology and backstage operations mapped into one decision document.'],
  ['02', 'Experience direction', 'Critical journeys, content hierarchy and a visual system prototyped before the build expands.'],
  ['03', 'Storefront + systems', 'Shopify implementation, content model and integrations delivered in reviewable releases.'],
  ['04', 'Launch + improve', 'Acceptance tests, redirects, measurement, training and a prioritized growth backlog.'],
];

const FAQS = [
  ['Do you build new stores and redesign existing Shopify stores?', 'Yes. We build new storefronts, redesign existing Shopify stores and migrate brands from other platforms. We first decide whether the current theme and data model can support the required experience.'],
  ['Is this a template or a custom design?', 'The experience is designed for your brand and catalog. We may use a strong theme foundation when it is the right commercial choice, but the architecture, components, content model and visual system are deliberately adapted.'],
  ['Can you migrate products, customers and SEO equity?', 'Yes. We map products, variants, customers, content and URLs before migration, then validate redirects, canonical behavior, structured product information and analytics at launch.'],
  ['Can you connect our ERP, 3PL, CRM or support stack?', 'Yes, when those systems provide a viable API, connector or exchange format. We define ownership, field mapping, sync direction, retries and reconciliation before implementation.'],
  ['Do you handle conversion optimization after launch?', 'Yes. We can stay as the commerce product team for measurement, experimentation, merchandising improvements, landing pages and ongoing engineering.'],
  ['How much does a build cost?', 'There is no one-size-fits-all price. Design depth, catalog complexity, migration, markets, content and integrations determine the scope. We provide a tailored plan and quote after discovery.'],
];

function goToContact() {
  document.getElementById('commerce-contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

export default function CommerceExperience() {
  return (
    <main className={s.page}>
      <TrackView event="service_view" props={{ slug: 'ecommerce-development', name: 'E-commerce & D2C solutions', design: 'commerce-experience-v2' }} />
      <ScrollDepth pageType="service" slug="ecommerce-development" />

      <section className={s.hero} aria-labelledby="commerce-title">
        <div className={s.heroCopy}>
          <p className={s.kicker}><span /> SHOPIFY & D2C COMMERCE</p>
          <h1 id="commerce-title">Turn the brand<br />into a <em>buying system.</em></h1>
          <p className={s.heroLead}>We design and engineer Shopify stores that connect the customer experience to the operation behind it—from first click to fulfillment and repeat purchase.</p>
          <div className={s.actions}>
            <a href="#stores" className={s.primary}>Explore stores we built <span>↓</span></a>
            <BookButton location="commerce-hero-v2" className={s.secondary}>Discuss your commerce roadmap <span>↗</span></BookButton>
          </div>
          <p className={s.heroNote}>New builds · redesigns · migrations · connected commerce systems</p>
        </div>
        <div className={s.heroStage} aria-label="Examples of responsive Shopify experiences">
          <div className={s.desktopFrame}>
            <div className={s.browserBar}><i /><i /><i /><span>lumiqstore.com</span></div>
            <video autoPlay muted loop playsInline poster="/videos/shopify-landing/hero-desktop.jpg" aria-label="Desktop screen recording of the LUMIQ store"><source src="/videos/shopify-landing/hero-desktop.mp4" type="video/mp4" /></video>
          </div>
          <div className={s.phoneFrame}>
            <video autoPlay muted loop playsInline poster="/videos/shopify-landing/real-home-mobile.jpg" aria-label="Mobile screen recording of the LUMIQ store"><source src="/videos/shopify-landing/real-home-mobile.mp4" type="video/mp4" /></video>
          </div>
          <span className={s.realTag}><i /> REAL STORE / REAL SCREEN RECORDING</span>
        </div>
      </section>

      <section className={s.proofBar} aria-label="Selected stores">
        <p>Selected commerce work</p>
        <div><span><b>LUMIQ</b> Beauty</span><span><b>VitalEdge</b> Performance</span><span><b>Loom & Little</b> Children</span></div>
        <a href="#stores">Try the stores ↓</a>
      </section>

      <section id="stores" className={s.stores} aria-labelledby="stores-title">
        <div className={s.sectionIntro}>
          <div><p className={s.kicker}><span /> THE WORK IS THE PROOF</p><h2 id="stores-title">Browse the stores.<br /><em>Use them like a customer.</em></h2></div>
          <p>Move through navigation, products and cart behavior inside three storefronts we designed and built. Checkout is disabled in these demo copies.</p>
        </div>
        <LiveStores onCta={goToContact} />
      </section>

      <section className={s.manifesto} aria-label="Commerce approach">
        <p>A beautiful homepage is one screen.</p>
        <h2>A successful D2C business is the<br /><em>whole system staying coherent.</em></h2>
        <div><span>BRAND</span><i /><span>STOREFRONT</span><i /><span>OPERATIONS</span><i /><span>GROWTH</span></div>
      </section>

      <section className={s.pillars} aria-labelledby="scope-title">
        <div className={s.sectionIntro}>
          <div><p className={s.kicker}><span /> ONE COMMERCE TEAM</p><h2 id="scope-title">What we design,<br /><em>build and connect.</em></h2></div>
          <p>The scope is shaped around the commercial problem. These workstreams combine into one accountable delivery plan.</p>
        </div>
        <div className={s.pillarGrid}>{PILLARS.map((x) => <article key={x.h}><small>{x.no}</small><h3>{x.h}</h3><p>{x.p}</p><ul>{x.tags.map((t) => <li key={t}>{t}</li>)}</ul></article>)}</div>
      </section>

      <section className={s.journey} aria-labelledby="journey-title">
        <div className={s.sectionIntroDark}>
          <div><p className={s.kicker}><span /> THE COMMERCE JOURNEY</p><h2 id="journey-title">Every handoff<br /><em>protects the sale.</em></h2></div>
          <p>We design the visible purchase path and the data movement behind it together, so the promise made in marketing survives checkout and delivery.</p>
        </div>
        <ol className={s.journeyGrid}>{JOURNEY.map((x) => <li key={x.event}><small>{x.event}</small><h3>{x.h}</h3><p>{x.p}</p><strong>{x.signal}</strong></li>)}</ol>
      </section>

      <section className={s.visualBreak} aria-label="Mobile product experiences">
        <div className={s.visualCopy}><p className={s.kicker}><span /> MOBILE IS THE STORE</p><h2>Designed at the size<br /><em>customers actually buy.</em></h2><p>Hierarchy, media, variant selection, offers, cart and checkout are resolved for small screens first—not compressed after desktop approval.</p></div>
        <div className={s.phoneWall}>
          <Image src="/images/shopify-landing/live-lumiq-mobile.jpg" alt="LUMIQ mobile storefront" fill sizes="(max-width:700px) 33vw, 220px" />
          <Image src="/images/shopify-landing/live-vitaledge-mobile.jpg" alt="VitalEdge mobile storefront" fill sizes="(max-width:700px) 33vw, 220px" />
          <Image src="/images/shopify-landing/live-loom-mobile.jpg" alt="Loom and Little mobile storefront" fill sizes="(max-width:700px) 33vw, 220px" />
        </div>
      </section>

      <section className={s.process} aria-labelledby="process-title">
        <div className={s.sectionIntro}>
          <div><p className={s.kicker}><span /> HOW THE ENGAGEMENT RUNS</p><h2 id="process-title">Decisions first.<br /><em>Then production.</em></h2></div>
          <p>You see working experiences throughout the engagement. Launch is a controlled release with ownership, evidence and a clear next backlog.</p>
        </div>
        <ol>{PROCESS.map(([n, h, p]) => <li key={n}><span>{n}</span><h3>{h}</h3><p>{p}</p></li>)}</ol>
      </section>

      <section className={s.stack} aria-label="Commerce platforms and integrations">
        <p>Designed around your operating stack</p>
        <div>{['Shopify', 'Shopify Plus', 'Klaviyo', 'Gorgias', 'Recharge', 'Stripe', 'GA4', 'Meta', '3PL / ERP', 'Custom APIs'].map((x) => <span key={x}>{x}</span>)}</div>
      </section>

      <section id="commerce-contact" className={s.close} aria-labelledby="commerce-close-title">
        <div>
          <p className={s.kicker}><span /> YOUR NEXT COMMERCE RELEASE</p>
          <h2 id="commerce-close-title">Show us the store.<br /><em>We’ll show you the system.</em></h2>
          <p>Bring us the current storefront, growth target and operational constraints. We’ll identify the work that matters and shape a tailored quote.</p>
          <div className={s.closeLinks}><BookButton location="commerce-close-v2" className={s.closeButton}>Book a commerce workshop <span>↗</span></BookButton><a href={`mailto:${site.email}`}>{site.email}</a></div>
        </div>
        <div className={s.formShell}><p>Tell us where the store is stuck.</p><LeadForm source="ecommerce-redesign" compact submitLabel="Request my commerce review" note="Store URL, platform, target markets and what needs to change." /></div>
      </section>

      <section className={s.faq} aria-labelledby="commerce-faq-title">
        <div><p className={s.kicker}><span /> BEFORE WE START</p><h2 id="commerce-faq-title">The useful questions.</h2><Link href="/shopify-store-build">See our Shopify-specific offer ↗</Link></div>
        <div>{FAQS.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>
    </main>
  );
}
