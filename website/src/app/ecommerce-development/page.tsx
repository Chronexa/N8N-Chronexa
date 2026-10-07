import type { Metadata } from 'next';
import Link from 'next/link';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import ScrollDepth from '../../components/ScrollDepth';
import TrackView from '../../components/TrackView';
import StoresShowcase from '../../components/homepage/StoresShowcase';
import BuildStory from '../../components/ecommerce/BuildStory';
import VideoFrame from '../shopify-store-build/VideoFrame';
import { AUTOMATIONS, CAPABILITIES, CART_JOURNEY, FAQS, GATE, STEPS, STUDIO, WONT } from '../../lib/ecommerce-story';
import { site } from '../../lib/site';
import st from '../../styles/studio.module.css';
import g from '../../components/growth/growth.module.css';
import e from '../../components/ecommerce/ecommerce.module.css';

/**
 * E-commerce & D2C brand building, rebuilt 2026-10-07.
 * Keywords (US, DataForSEO): ecommerce website design 1,600 · KD 19 · shopify experts 1,300 · KD 13 ·
 * ecommerce development company 880 · $61 · KD 28 · shopify development services 880 · KD 24 ·
 * shopify plus agency 590 · KD 16 · ecommerce agency 2,400 · KD 34.
 * Benchmarks: Eastside Co (credentials, in-house, case studies), Charle (proprietary platform, metrics).
 * Ours: the thinking behind a real store, shown decision by decision, and no invented proof.
 */
const V = (f: string) => `/videos/shopify-landing/${f}`;
const TITLE = 'Shopify & D2C Brand Building, Not Templates | Chronexa';
const DESCRIPTION = 'We build Shopify stores as brands: research, design, photography, film, SEO, analytics and automation. See the stores and the thinking behind them. Free audit.';

export const metadata: Metadata = {
  title: { absolute: TITLE }, description: DESCRIPTION, alternates: { canonical: '/ecommerce-development' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/ecommerce-development', type: 'website', images: ['/images/shopify-landing/live-lumiq-desktop.jpg'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/images/shopify-landing/live-lumiq-desktop.jpg'] },
};

const COMPARE = [
  ['Starts with', 'A theme and your logo', 'A founder session, your customers and your competitors'],
  ['Research', 'None', 'Market, competitor and customer research before any design'],
  ['Design', 'The sections the theme gives you', 'Every section designed for your products, page by page, approved by you'],
  ['Photography & film', 'Supplier images', 'Art direction, product photography and campaign film in one look'],
  ['SEO', 'Default settings', 'Structure, schema, content model and AI-search readiness built in'],
  ['Analytics', 'A pixel pasted in', 'GA4 and Meta tracking set up, tested and consent-aware'],
  ['After launch', 'You’re on your own', 'Email, SMS and WhatsApp journeys, stock and order automation, and a team that stays'],
  ['Proof', 'Placeholder reviews and permanent “sales”', 'No invented proof. Ever.'],
] as const;

export default function Page() {
  const url = `${site.url}/ecommerce-development`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: 'Shopify and D2C e-commerce development', serviceType: 'Shopify development, e-commerce design, e-commerce automation', description: DESCRIPTION, url, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: ['US', 'GB', 'CA', 'AE', 'AU'] },
      { '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'E-commerce & D2C', item: url }] },
    ],
  };

  return (
    <div className={`${st.page} ${g.wrap}`}>
      <TrackView event="service_view" props={{ slug: 'ecommerce-development', name: 'E-commerce & D2C', design: 'brand-build' }} />
      <ScrollDepth pageType="service" slug="ecommerce-development" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* hero */}
      <section className={e.hero} aria-labelledby="h">
        <div className={e.heroText}>
          <p className={st.eyebrow}><i />E-COMMERCE &amp; D2C BRAND BUILDING</p>
          <h1 id="h">A D2C brand,<br /><em>not a Shopify template.</em></h1>
          <p className={st.heroCopy}>We sit with the founder, research the market, design every page, produce the photography and film, wire the analytics and automation, and launch a store that is yours to run. For D2C founders building brands that sell worldwide.</p>
          <div className={st.heroActions}>
            <BookButton location="ecom-hero" className={st.primary}>Get a free store audit <span aria-hidden="true">↗</span></BookButton>
            <a href="#stores" className={st.ghost}>Shop the stores we built ↓</a>
          </div>
          <ul className={e.promises}><li>Free store audit</li><li>Designed section by section</li><li>You own everything</li></ul>
        </div>
        <div className={e.heroMedia}>
          <VideoFrame id="eco-hero-desktop" frame="laptop" address="lumiq-dev.myshopify.com" src={V('hero-desktop.mp4')} poster={V('hero-desktop.jpg')} label="Screen recording of the LUMIQ homepage on a laptop" priority />
          <div className={e.heroPhone}>
            <VideoFrame id="eco-hero-mobile" frame="phone" src={V('real-home-mobile.mp4')} poster={V('real-home-mobile.jpg')} label="A real session on the LUMIQ store on a phone" priority />
          </div>
        </div>
      </section>

      {/* the difference */}
      <section className={st.band} aria-labelledby="s1">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />01 / THE DIFFERENCE</p>
            <h2 id="s1">Cheap stores are easy.<br /><em>Brands are not.</em></h2>
          </div>
          <p>Anyone can install a theme in a weekend. For a first test store that can be exactly right, and we will say so. We work with founders building a brand that has to look, load and sell like a global one.</p>
        </div>
        <div className={e.compareWrap}>
          <table className={e.compare}>
            <thead><tr><th scope="col"><span className={e.srOnly}>What</span></th><th scope="col">A template store</th><th scope="col" className={e.us}>A Chronexa brand build</th></tr></thead>
            <tbody>{COMPARE.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td data-label="Template store">{a}</td><td data-label="Chronexa brand build" className={e.us}>{b}</td></tr>)}</tbody>
          </table>
        </div>
        <p className={e.compareNote}>Not sure which you need? <BookButton location="ecom-compare" className={e.inlineCta}>The free audit tells you</BookButton>, even when the answer is a paid theme and a good afternoon.</p>
      </section>

      {/* live stores */}
      <section className={`${st.band} ${st.sunken}`} id="stores" aria-labelledby="s2">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />02 / THREE STORES WE BUILT</p>
            <h2 id="s2">Don&rsquo;t take our word.<br /><em>Shop them.</em></h2>
          </div>
          <p>Real storefronts, running live. Scroll, open the menu and add to bag. Everything works except checkout.</p>
        </div>
        <StoresShowcase />
        <p className={e.provenance}><strong>LUMIQ</strong> is our own flagship brand, built end to end to hold ourselves to the standard we sell: identity, packaging, photography, film and the store. <strong>VITALEDGE</strong> and <strong>Loom &amp; Little</strong> are stores we designed and built. These are exact copies of the storefronts, with checkout switched off.</p>
      </section>

      {/* the story */}
      <section className={st.band} id="how-we-built-lumiq" aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />03 / HOW WE BUILT LUMIQ</p>
            <h2 id="s3">The thinking,<br /><em>decision by decision.</em></h2>
          </div>
          <p>A template freelancer shows you the finished page. Here is the work behind it, including what we got wrong first.</p>
        </div>
        <BuildStory />
        <div className={e.storyCta}>
          <p><strong>This is the process you get.</strong> Applied to your brand, your customers and your products.</p>
          <BookButton location="ecom-story" className={st.primary}>Get a free store audit <span aria-hidden="true">↗</span></BookButton>
        </div>
      </section>

      {/* what every build includes */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s4">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />04 / WHAT EVERY BUILD INCLUDES</p>
            <h2 id="s4">One team.<br /><em>The whole brand.</em></h2>
          </div>
          <p>Design, engineering, photography, film, search, tracking and automation, planned together so they read as one brand.</p>
        </div>
        <div className={e.caps}>
          {CAPABILITIES.map((c) => (
            <article key={c.n}>
              <span>{c.n}</span>
              <h3>{c.h}</h3>
              <p>{c.p}</p>
              <ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
              {c.href && <Link href={c.href}>{c.link} <span aria-hidden="true">↗</span></Link>}
            </article>
          ))}
        </div>
      </section>

      {/* process */}
      <section className={st.band} id="process" aria-labelledby="s5">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />05 / FROM CONCEPT TO LAUNCH</p>
            <h2 id="s5">Five steps.<br /><em>You approve each one.</em></h2>
          </div>
          <p>No surprises and no big reveal. You see and sign off the work as it is made.</p>
        </div>
        <ol className={e.steps}>
          {STEPS.map((x) => (
            <li key={x.n}>
              <span>{x.n}</span>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
              <p className={e.get}><b>You get:</b> {x.get}</p>
            </li>
          ))}
        </ol>
        <div className={e.studio}>
          <p>Ten specialist roles, each with its own checklist, run every build:</p>
          <ul>{STUDIO.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </section>

      {/* automation */}
      <section className={`${st.band} ${e.auto}`} aria-labelledby="s6">
        <div className={e.autoGrid}>
          <div>
            <p className={st.eyebrow}><i />06 / THEN WE AUTOMATE THE STORE</p>
            <h2 id="s6">Grow the brand<br /><em>without growing the team.</em></h2>
            <p className={st.lede}>A beautiful store still leaks money if abandoned carts go unanswered and stock runs out unnoticed. We connect the store to the channels your customers actually use, and automate the back office behind it.</p>
            <ul className={e.autoList}>{AUTOMATIONS.map((a) => <li key={a}>{a}</li>)}</ul>
            <div className={e.autoLinks}>
              <Link href="/d2c-ecommerce-automation" className={st.proofLink}>E-commerce automation <span aria-hidden="true">↗</span></Link>
              <Link href="/n8n-portfolio/shopify-meta-capi-feedback" className={st.proofLink}>See a live workflow <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className={e.journey} role="group" aria-label="Example abandoned-cart journey">
            <p className={e.journeyHead}>EXAMPLE · ABANDONED CART JOURNEY</p>
            <ol>
              {CART_JOURNEY.map((j) => (
                <li key={j.t}>
                  <span className={e.when}>{j.t}</span>
                  <div><b>{j.ch}</b><p>{j.msg}</p></div>
                </li>
              ))}
            </ol>
            <p className={e.journeyFoot}>Timings and offers are set with you, against your margins.</p>
          </div>
        </div>
      </section>

      {/* quality gate */}
      <section className={st.band} aria-labelledby="s7">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />07 / THE LAUNCH GATE</p>
            <h2 id="s7">Nothing ships until<br /><em>it passes all eight.</em></h2>
          </div>
          <p>This is what separates a build from an install. Every store goes through the same gate before it goes live.</p>
        </div>
        <ol className={e.gate}>{GATE.map((g, i) => <li key={g.h}><span>{String(i + 1).padStart(2, '0')}</span><h3>{g.h}</h3><p>{g.p}</p></li>)}</ol>
      </section>

      {/* won't do */}
      <section className={`${st.band} ${st.sunken}`} aria-labelledby="s8">
        <div className={e.wont}>
          <div>
            <p className={st.eyebrow}><i />08 / WHAT WE WON&rsquo;T DO</p>
            <h2 id="s8">Saying no is<br /><em>part of the craft.</em></h2>
            <p className={st.lede}>The fastest way to spot a template shop is what it will happily do. These are the things we turn down.</p>
          </div>
          <ul>{WONT.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      </section>

      {/* pricing */}
      <section className={st.band} aria-labelledby="s9">
        <div className={e.price}>
          <div>
            <p className={st.eyebrow}><i />09 / WHAT IT COSTS</p>
            <h2 id="s9">A quote,<br /><em>not a package.</em></h2>
          </div>
          <div>
            <p>Every brand is different, so we don&rsquo;t publish a price list. After the free audit you get a written scope and a fixed quote, and you know exactly what you are paying for before work starts.</p>
            <p>Separate from our quote: your Shopify plan, any paid apps (agreed with you first) and your ad spend.</p>
            <div className={e.priceLinks}>
              <BookButton location="ecom-price" className={st.primary}>Get a free store audit <span aria-hidden="true">↗</span></BookButton>
              <Link href="/custom-shopify-store-cost" className={st.proofLink}>What a Shopify build costs, explained <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* close */}
      <section className={`${st.close} ${e.close}`} id="talk" aria-labelledby="s10">
        <div>
          <p className={st.eyebrow}><i />START HERE</p>
          <h2 id="s10">Get your free<br /><em>store audit.</em></h2>
          <p>Send us your store, or the idea for one. We review it as a shopper would and tell you what we would fix first, what to leave alone and whether you need us at all.</p>
          <ol className={st.closeList}>
            <li>A walk through your store as a shopper, with a ranked fix list</li>
            <li>Honest advice, including when a theme is enough</li>
            <li>A written scope and fixed quote if you want to go further</li>
          </ol>
          <p className={st.direct}>You talk to the people who build it, not an account manager.<a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source="ecommerce-development" compact submitLabel="Send this and pick a time" note="Your store link or idea, and what you want to change." />
        </div>
      </section>

      {/* faq */}
      <section className={`${st.faq} ${e.faq}`} aria-labelledby="s11">
        <div>
          <p className={st.eyebrow}><i />GOOD QUESTIONS</p>
          <h2 id="s11">Before you book.</h2>
          <Link className={st.proofLink} href="/shopify-store-build">See our Shopify store audit offer <span aria-hidden="true">↗</span></Link>
        </div>
        <div>{FAQS.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </section>

      <nav className={`${st.related} ${e.related}`} aria-label="Related">
        <span>Keep reading</span>
        <Link href="/shopify-seo-services">Shopify SEO services ↗</Link>
        <Link href="/shopify-migration-services">Shopify migration ↗</Link>
        <Link href="/custom-shopify-store-cost">What a Shopify build costs ↗</Link>
        <Link href="/d2c-ecommerce-automation">E-commerce automation ↗</Link>
        <Link href="/ui-ux-design-services">UX &amp; product design ↗</Link>
      </nav>
    </div>
  );
}
