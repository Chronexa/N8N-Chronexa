import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../BookButton';
import LeadForm from '../LeadForm';
import TrackView from '../TrackView';
import ScrollDepth from '../ScrollDepth';
import HeroVisual, { Logo } from './HeroVisual';
import type { GrowthPageData } from '../../lib/growth-pages';
import { EXTRAS, type Extra } from '../../lib/growth-extras';
import st from '../../styles/studio.module.css';
import g from './growth.module.css';

export function growthMetadata(p: GrowthPageData): Metadata {
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.title, description: p.description, url: `/${p.slug}`, type: 'website', images: [`/images/growth/${p.slug}.webp`, site.ogImage] },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images: [`/images/growth/${p.slug}.webp`] },
  };
}

function H({ t }: { t: [string, string] }) {
  return <>{t[0]}<br /><em>{t[1]}</em></>;
}

/** Per-page wording for the parts of the layout that were written for the AI-automation pages. */
export type GrowthWording = {
  cta?: string;
  closeList?: [string, string, string];
  form?: { fieldLabel: string; fieldPlaceholder: string; fieldNote: string; note?: string };
  faqLink?: [string, string];
};

export default function GrowthPage({ p, extra, promises, wording }: { p: GrowthPageData; extra?: Extra; promises?: [string, string, string]; wording?: GrowthWording }) {
  const x = extra ?? EXTRAS[p.slug];
  const url = `${site.url}/${p.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': p.kind === 'guide' ? 'Article' : 'Service',
        name: p.h1.join(' '),
        description: p.description,
        url,
        image: `${site.url}/images/growth/${p.slug}.webp`,
        ...(p.kind === 'guide'
          ? { headline: p.h1.join(' '), author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name }, dateModified: p.updated }
          : { serviceType: p.serviceType, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: ['US', 'GB', 'CA', 'AE'] }),
      },
      { '@type': 'FAQPage', mainEntity: p.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: p.crumb, item: url },
      ] },
    ],
  };
  let n = 0;
  const num = () => String(++n).padStart(2, '0');

  return (
    <div className={`${st.page} ${g.wrap}`} /* One brand accent sitewide (2026-10-07 brand audit): per-page colours made every service page look like a different company. */>
      <TrackView event="service_view" props={{ slug: p.slug, name: p.crumb, design: 'growth-v2' }} />
      <ScrollDepth pageType="service" slug={p.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      {/* hero */}
      <section className={`${st.hero} ${g.hero}`} aria-labelledby="h">
        <div>
          <p className={st.eyebrow}><i />{p.eyebrow}</p>
          <h1 id="h"><H t={p.h1} /></h1>
          <p className={st.heroCopy}>{p.heroCopy}</p>
          <div className={st.heroActions}>
            <BookButton location={`growth-hero:${p.slug}`} className={st.primary}>{wording?.cta ?? 'Book a free AI audit'} <span aria-hidden="true">↗</span></BookButton>
            {p.slug !== 'how-we-work'
              ? <Link href="/how-we-work" className={st.ghost}>How we work <span aria-hidden="true">→</span></Link>
              : <a href="#steps" className={st.ghost}>See the process <span aria-hidden="true">↓</span></a>}
          </div>
          <ul className={g.promises}>
            {(promises ?? ['Audit free', 'First workflow free', 'Live in a week']).map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <HeroVisual visual={x.visual} />
      </section>

      {/* real tool logos */}
      <div className={g.logos} aria-label="Tools we connect">
        <span>WORKS WITH<br /><b>WHAT YOU ALREADY USE</b></span>
        <ul>{x.tools.map(t => <li key={t}><Logo name={t} size={24} /><span>{t}</span></li>)}</ul>
      </div>

      {/* 01 problem */}
      <section className={st.band} aria-labelledby="s1">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />{num()} / {p.problem.eyebrow}</p>
            <h2 id="s1"><H t={p.problem.h2} /></h2>
          </div>
          <p>{p.problem.intro}</p>
        </div>
        <div className={g.cards}>
          {p.problem.cards.map(c => <div key={c.h}>{c.tag && <span>{c.tag}</span>}<h3>{c.h}</h3><p>{c.p}</p></div>)}
        </div>
      </section>

      {/* example engagement with illustration */}
      <section className={`${st.band} ${g.storyBand}`} aria-labelledby="s-story">
        <div className={`${g.story} ${x.flip ? g.flip : ''}`}>
          <figure className={g.art}>
            <Image src={`/images/growth/${p.slug}.webp`} alt="" width={1200} height={800} sizes="(max-width:1040px) 100vw, 48vw" />
          </figure>
          <div>
            <p className={st.eyebrow}><i />{x.story.label}</p>
            <h2 id="s-story">{x.story.who}</h2>
            <p className={g.situation}>{x.story.situation}</p>
            <ol className={g.built}>{x.story.built.map(b => <li key={b}>{b}</li>)}</ol>
            <div className={g.results}>{x.story.result.map(r => <div key={r.k}><b>{r.v}</b><span>{r.k}</span></div>)}</div>
            <p className={g.disclaimer}>A composite example with details changed. We do not name clients without their permission.</p>
          </div>
        </div>
      </section>

      {p.prose && (
        <section className={`${st.band} ${g.proseBand}`} aria-label="Guide">
          <div className={g.prose}>
            {p.prose.map(b => (
              <div key={b.h}>
                <h3>{b.h}</h3>
                {b.p.map((t, i) => <p key={i}>{t}</p>)}
                {b.list && <ul>{b.list.map(y => <li key={y}>{y}</li>)}</ul>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* process */}
      <section className={`${st.band} ${g.tinted}`} id="steps" aria-labelledby="s2">
        <div className={g.steps}>
          <div>
            <p className={st.eyebrow}><i />{num()} / {p.steps.eyebrow}</p>
            <h2 id="s2"><H t={p.steps.h2} /></h2>
            <p className={st.lede}>{p.steps.intro}</p>
          </div>
          <ol className={g.stepList}>
            {p.steps.items.map(s => <li key={s.h}><h3>{s.h}{s.badge && <small>{s.badge}</small>}</h3><p>{s.p}</p></li>)}
          </ol>
        </div>
      </section>

      {/* what we build */}
      <section className={st.band} aria-labelledby="s3">
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />{num()} / {p.builds.eyebrow}</p>
            <h2 id="s3"><H t={p.builds.h2} /></h2>
          </div>
          <p>{p.builds.intro}</p>
        </div>
        {x.buildsStyle === 'list'
          ? <ol className={g.buildList}>{p.builds.items.map(c => <li key={c.h}><h3>{c.h}</h3><p>{c.p}</p></li>)}</ol>
          : <div className={`${g.cards} ${g.cards3}`}>{p.builds.items.map(c => <div key={c.h}>{c.tag && <span>{c.tag}</span>}<h3>{c.h}</h3><p>{c.p}</p></div>)}</div>}
      </section>

      {/* ROI */}
      <section className={`${st.band} ${g.tinted}`} aria-labelledby="s4">
        <div className={g.roi}>
          <div>
            <p className={st.eyebrow}><i />{num()} / THE ROI LENS</p>
            <h2 id="s4"><H t={p.roi.h2} /></h2>
            <p className={st.lede}>{p.roi.intro}</p>
            {p.slug !== 'ai-roi-calculator' && <Link className={st.proofLink} href="/ai-roi-calculator">Run your own numbers <span aria-hidden="true">↗</span></Link>}
          </div>
          <div className={g.roiCard}>
            <table className={g.roiTable}>
              <thead><tr><th scope="col">Example</th><th scope="col">Today</th><th scope="col">With the system</th></tr></thead>
              <tbody>{p.roi.rows.map(r => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
            </table>
            <p className={g.roiNote}>{p.roi.note ?? 'Illustrative, not a client result. Your audit replaces these numbers with your own.'}</p>
          </div>
        </div>
      </section>

      {/* won't build */}
      <section className={st.band} aria-labelledby="s5">
        <div className={g.wont}>
          <div>
            <p className={st.eyebrow}><i />{num()} / WHAT WE WON&rsquo;T BUILD</p>
            <h2 id="s5">Saying no is<br /><em>part of the job.</em></h2>
            <p className={st.lede}>Most automation fails because someone automated the wrong thing. These are the builds we turn down.</p>
          </div>
          <ul className={g.wontList}>{p.wont.map(w => <li key={w}>{w}</li>)}</ul>
        </div>
      </section>

      {/* close */}
      <section className={`${st.close} ${g.close}`} id="talk" aria-labelledby="s7">
        <div>
          <p className={st.eyebrow}><i />START HERE</p>
          <h2 id="s7"><H t={p.close.h2} /></h2>
          <p>{p.close.p}</p>
          <ol className={st.closeList}>
            {(wording?.closeList ?? ['A free audit of your systems, workflows and team', 'One workflow built free, live inside a week', 'A plan sized on ROI, priced before we build anything else']).map(t => <li key={t}>{t}</li>)}
          </ol>
          <p className={st.direct}>
            You talk to the people who build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={st.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`growth:${p.slug}`} compact submitLabel="Send this and pick a time" note={wording?.form?.note ?? 'Tell us your team size, the tools you run, and the work that eats the most hours.'} {...(wording?.form ? { fieldLabel: wording.form.fieldLabel, fieldPlaceholder: wording.form.fieldPlaceholder, fieldNote: wording.form.fieldNote } : {})} />
        </div>
      </section>

      {/* faq */}
      <section className={`${st.faq} ${g.faq}`} aria-labelledby="s8">
        <div>
          <p className={st.eyebrow}><i />GOOD QUESTIONS</p>
          <h2 id="s8">Before you book.</h2>
          <Link className={st.proofLink} href={wording?.faqLink?.[0] ?? '/n8n-portfolio'}>{wording?.faqLink?.[1] ?? 'See 35 workflows we have published'} <span aria-hidden="true">↗</span></Link>
        </div>
        <div>{p.faqs.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </section>

      <nav className={`${st.related} ${g.related}`} aria-label="Related">
        <span>Keep reading</span>
        {p.related.map(([href, label]) => <Link key={href} href={href}>{label} ↗</Link>)}
      </nav>
    </div>
  );
}
