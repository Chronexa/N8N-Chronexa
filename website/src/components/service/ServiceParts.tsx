import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BookButton from '../BookButton';
import LeadForm from '../LeadForm';
import { Logo } from '../growth/HeroVisual';
import { founders, site } from '../../lib/site';
import s from './service.module.css';

/**
 * Building blocks for the five primary AI service pages (2026-10-11). Each page composes these in
 * its own order around its own signature interactive and hero art, so the pages share a grammar
 * without sharing a template. Copy stays short: one headline, one sentence, then something to see.
 */

export { s as svc };

type Faq = { q: string; a: string };

export function serviceMetadata({ slug, title, description, art }: { slug: string; title: string; description: string; art: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `/${slug}`, type: 'website', images: [art, site.ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [art] },
  };
}

export function ServiceSchema({ slug, name, serviceType, description, faqs }: { slug: string; name: string; serviceType: string[]; description: string; faqs: Faq[] }) {
  const url = `${site.url}/${slug}`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', '@id': `${url}#service`, name, serviceType, description, url, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: ['US', 'GB', 'CA', 'AE'] },
    { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/solutions` },
      { '@type': 'ListItem', position: 3, name, item: url },
    ] },
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}

export function Label({ n, children, dark }: { n?: string; children: ReactNode; dark?: boolean }) {
  return <p className={dark ? s.labelDark : s.label}>{n && <span>{n}</span>}{children}</p>;
}

/** Two-line headline with the one green italic phrase. */
export function Title({ t }: { t: [string, string] }) {
  return <>{t[0]} <em>{t[1]}</em></>;
}

export const OFFER = ['Audit free', 'First workflow free', 'Live in a week'];

export function ServiceHero({ slug, eyebrow, h1, sub, art, artAlt, artPos, cta = 'Book a free AI audit', seeHref = '#see-it', seeLabel = 'See it work', offer = OFFER, split }: {
  slug: string; eyebrow: string; h1: [string, string]; sub: string; art: string; artAlt: string; artPos?: string;
  cta?: string; seeHref?: string; seeLabel?: string; offer?: string[]; split?: boolean;
}) {
  return (
    <section className={`${s.hero} ${split ? s.heroSplit : ''}`} aria-labelledby="h" style={artPos ? ({ '--art-pos': artPos } as React.CSSProperties) : undefined}>
      <figure className={s.heroArt}><Image src={art} alt={artAlt} fill priority sizes={split ? '(max-width:820px) 100vw, 52vw' : '100vw'} /></figure>
      <div className={s.heroWash} aria-hidden="true" />
      <div className={s.heroCopy}>
        <Label>{eyebrow}</Label>
        <h1 id="h">{h1[0]}<br /><em>{h1[1]}</em></h1>
        <p className={s.heroSub}>{sub}</p>
        <div className={s.heroActions}>
          <BookButton location={`service-hero:${slug}`} className={s.btn}>{cta} <span aria-hidden="true">↗</span></BookButton>
          <a href={seeHref} className={s.ghost}>{seeLabel} <span aria-hidden="true">↓</span></a>
        </div>
        <ul className={s.offer}>{offer.map((o) => <li key={o}>{o}</li>)}</ul>
      </div>
    </section>
  );
}

/** What it is, who it is for, what you get, how it is priced, how fast: answered before anything else. */
export function AnswerCard({ items, flush }: { items: [string, string][]; flush?: boolean }) {
  return (
    <dl className={`${s.answer} ${flush ? s.answerFlush : ''}`} aria-label="This service at a glance">
      {items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

export function RailGap() { return <div className={s.railGap} aria-hidden="true" />; }

export function ProblemTrio({ n, eyebrow, h2, intro, cards }: { n: string; eyebrow: string; h2: [string, string]; intro: string; cards: { tag?: string; h: string; p: string }[] }) {
  return (
    <section className={s.band} aria-labelledby={`p-${n}`}>
      <div className={s.head}>
        <div><Label n={n}>{eyebrow}</Label><h2 id={`p-${n}`}><Title t={h2} /></h2></div>
        <p className={s.lead}>{intro}</p>
      </div>
      <div className={s.trio}>{cards.map((c) => <article key={c.h}>{c.tag && <small>{c.tag}</small>}<h3>{c.h}</h3><p>{c.p}</p></article>)}</div>
    </section>
  );
}

export function DemoStage({ n, eyebrow, h2, intro, tools, note = 'Pick a tab, or let it play.', children, id = 'see-it' }: {
  n: string; eyebrow: string; h2: [string, string]; intro: string; tools?: string[]; note?: string; children: ReactNode; id?: string;
}) {
  return (
    <section id={id} className={`${s.band} ${s.dark}`} aria-labelledby={`d-${n}`}>
      <div className={s.stage}>
        <div>
          <Label n={n} dark>{eyebrow}</Label>
          <h2 id={`d-${n}`}><Title t={h2} /></h2>
          <p className={s.lead} style={{ marginTop: '1.2rem' }}>{intro}</p>
          <p className={s.stageNote}>{note}</p>
          {tools && <div className={s.works}><span>Works with what you already use</span><ul>{tools.map((t) => <li key={t}><Logo name={t} size={20} />{t}</li>)}</ul></div>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export function Deliverables({ n, eyebrow, h2, intro, items, sunken, aside }: { n: string; eyebrow: string; h2: [string, string]; intro: string; items: { h: string; p: string }[]; sunken?: boolean; aside?: ReactNode }) {
  return (
    <section className={`${s.band} ${sunken ? s.sunken : ''}`} aria-labelledby={`g-${n}`}>
      <div className={s.split}>
        <div><Label n={n}>{eyebrow}</Label><h2 id={`g-${n}`}><Title t={h2} /></h2><p className={s.lead} style={{ marginTop: '1.2rem' }}>{intro}</p>{aside}</div>
        <ol className={s.thread}>{items.map((i) => <li key={i.h}><h3>{i.h}</h3><p>{i.p}</p></li>)}</ol>
      </div>
    </section>
  );
}

export function Story({ n, label = 'EXAMPLE ENGAGEMENT', who, situation, built, result, media, fine, link }: {
  n: string; label?: string; who: string; situation: string; built: string[]; result: { k: string; v: string }[]; media: ReactNode; fine?: string; link?: [string, string];
}) {
  return (
    <section className={s.band} aria-labelledby={`st-${n}`}>
      <div className={s.story}>
        {media}
        <div className={s.storyBody}>
          <Label n={n}>{label}</Label>
          <h3 id={`st-${n}`}>{who}</h3>
          <p>{situation}</p>
          <ol className={s.built}>{built.map((b) => <li key={b}>{b}</li>)}</ol>
          <div className={s.results}>{result.map((r) => <div key={r.k}><b>{r.v}</b><span>{r.k}</span></div>)}</div>
          {link && <Link className={`${s.textLink} ${s.storyLink}`} href={link[0]}>{link[1]} <span aria-hidden="true">↗</span></Link>}
          {fine && <p className={s.fine}>{fine}</p>}
        </div>
      </div>
    </section>
  );
}

export function StoryImage({ src, alt }: { src: string; alt: string }) {
  return <figure className={s.storyMedia}><Image src={src} alt={alt} fill sizes="(max-width:1080px) 100vw, 50vw" /></figure>;
}

export type Rung = { step: string; price: string; note: string };
export const DEFAULT_LADDER: Rung[] = [
  { step: 'Audit of your workflows and tools', price: 'Free', note: 'One or two working sessions. You keep the findings either way.' },
  { step: 'First workflow, built and live', price: 'Free', note: 'On your real tools inside a week, so you judge the output before paying.' },
  { step: 'Each next build', price: 'Fixed price', note: 'Sized against the hours, errors or revenue it moves. Agreed in writing first.' },
  { step: 'Running and improving it', price: 'Optional', note: 'Monitoring, fixes and new steps as your work changes. Cancel any month.' },
];

export function MoneySection({ n, h2, intro, rows, ladder = DEFAULT_LADDER, rowsNote = 'Example figures for a typical engagement. Your audit replaces them with your own numbers.' }: {
  n: string; h2: [string, string]; intro: string; rows: [string, string, string][]; ladder?: Rung[]; rowsNote?: string;
}) {
  return (
    <section className={`${s.band} ${s.sunken}`} aria-labelledby={`m-${n}`}>
      <div className={s.headSolo}><Label n={n}>RETURN AND PRICE</Label><h2 id={`m-${n}`}><Title t={h2} /></h2><p className={s.lead}>{intro}</p></div>
      <div className={s.money}>
        <div className={s.card}>
          <h3>What changes</h3>
          <p>{rowsNote}</p>
          <table className={s.roi}>
            <thead><tr><th scope="col">Measure</th><th scope="col">Today</th><th scope="col">With the system</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </table>
          <p className={s.cardFoot}><Link className={s.textLink} href="/ai-roi-calculator">Run your own numbers ↗</Link></p>
        </div>
        <div className={s.card}>
          <h3>How pricing works</h3>
          <p>No retainer to start and no price before we have seen the work.</p>
          <ol className={s.ladder}>{ladder.map((r) => <li key={r.step}><strong>{r.step}</strong><b>{r.price}</b><span>{r.note}</span></li>)}</ol>
          <p className={s.cardFoot}><Link className={s.textLink} href="/ai-automation-cost">What drives the cost of AI automation ↗</Link></p>
        </div>
      </div>
    </section>
  );
}

export function WontBuild({ n, items, intro = 'Most automation fails because someone automated the wrong thing. These are the builds we turn down.' }: { n: string; items: string[]; intro?: string }) {
  return (
    <section className={s.band} aria-labelledby={`w-${n}`}>
      <div className={s.wont}>
        <div><Label n={n}>WHAT WE WON&rsquo;T BUILD</Label><h2 id={`w-${n}`}>Saying no is <em>part of the job.</em></h2><p className={s.lead} style={{ marginTop: '1.2rem' }}>{intro}</p></div>
        <ul>{items.map((w) => <li key={w}>{w}</li>)}</ul>
      </div>
    </section>
  );
}

export function Quote({ text, by }: { text: string; by: string }) {
  return (
    <section className={s.band} aria-label="Client testimonial">
      <figure className={s.quote}><blockquote>&ldquo;{text}&rdquo;</blockquote><cite>{by}</cite></figure>
    </section>
  );
}

export function ServiceClose({ slug, h2, p, next = ['A free audit of the work, the tools and the people involved', 'One workflow built free and live inside a week', 'A plan sized on ROI, priced in writing before anything else is built'], formTitle, form }: {
  slug: string; h2: [string, string]; p: string; next?: string[]; formTitle: string;
  form: { submitLabel: string; note: string; fieldLabel?: string; fieldPlaceholder?: string; fieldNote?: string };
}) {
  const names = founders.map((f) => f.name.split(' ')[0]);
  return (
    <section id="talk" className={`${s.band} ${s.dark}`} aria-labelledby="close-h">
      <div className={s.close}>
        <div>
          <Label dark>START HERE</Label>
          <h2 id="close-h"><Title t={h2} /></h2>
          <p className={s.lead} style={{ marginTop: '1.2rem' }}>{p}</p>
          <ol className={s.next}>{next.map((t) => <li key={t}>{t}</li>)}</ol>
          <div className={s.people}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className={s.faces}>{founders.map((f) => <img key={f.name} src={f.image} alt={f.name} loading="lazy" />)}</span>
            <span>You talk to {names.slice(0, -1).join(', ')} and {names.at(-1)}, the people who build it. <a href={`mailto:${site.email}`}>{site.email}</a></span>
          </div>
          <p style={{ marginTop: '1.6rem' }}><BookButton location={`service-close:${slug}`} className={s.btn}>Book a free AI audit <span aria-hidden="true">↗</span></BookButton></p>
        </div>
        <div className={s.formCard}>
          <p>{formTitle}</p>
          <LeadForm source={`service:${slug}`} compact {...form} />
        </div>
      </div>
    </section>
  );
}

export function ServiceFaq({ h2, faqs, explain, link }: { h2: [string, string]; faqs: Faq[]; explain?: { h: string; p: string[] }[]; link?: [string, string] }) {
  return (
    <section className={s.band} aria-labelledby="faq-h">
      <div className={s.faq}>
        <div>
          <Label>GOOD QUESTIONS</Label>
          <h2 id="faq-h"><Title t={h2} /></h2>
          {explain?.map((b) => <div key={b.h} className={s.explain}><h3>{b.h}</h3>{b.p.map((t) => <p key={t.slice(0, 40)}>{t}</p>)}</div>)}
          {link && <p style={{ marginTop: '1.6rem' }}><Link className={s.textLink} href={link[0]}>{link[1]} ↗</Link></p>}
        </div>
        <div>{faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </div>
    </section>
  );
}

export function AlsoExplore({ links }: { links: [string, string][] }) {
  return <nav className={s.also} aria-label="Related pages"><span>Also explore</span>{links.map(([href, label]) => <Link key={href} href={href}>{label} ↗</Link>)}</nav>;
}
