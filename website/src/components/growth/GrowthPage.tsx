import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../../lib/site';
import TrackView from '../TrackView';
import ScrollDepth from '../ScrollDepth';
import HeroVisual from './HeroVisual';
import IndustryDesk from '../industry/IndustryDesk';
import ArtPlate from '../visual/ArtPlate';
import {
  AlsoExplore, AnswerCard, Deliverables, DemoStage, Label, MoneySection, ProblemTrio,
  ServiceClose, ServiceFaq, ServiceHero, Story, Title, WontBuild, svc,
} from '../service/ServiceParts';
import { GROWTH_DESKS } from '../../lib/growth-desks';
import { GROWTH_ANSWERS, GROWTH_ART } from '../../lib/growth-art';
import { ART } from '../../lib/art';
import type { GrowthPageData } from '../../lib/growth-pages';
import { EXTRAS, type Extra } from '../../lib/growth-extras';

/**
 * The shared layout for the growth pages (v3, 2026-10-11): 18 service pages and guides rebuilt on
 * the same design system as the five primary AI service pages. Each page gets its own world from
 * the art library (hero and story art, lib/growth-art.ts), answers what/who/what you get/price/speed
 * before anything else, then shows the work happening on the dark stage. Guides lead with their
 * explainer instead of the answer card. SEO copy still comes from lib/growth-pages.ts unchanged.
 */

/** Copy may carry inline links written as [text](/path); render them as real links. */
function rich(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? <Link key={i} href={m[2]}>{m[1]}</Link> : part;
  });
}

function heroSrc(slug: string) {
  const a = GROWTH_ART[slug] && ART[GROWTH_ART[slug].hero];
  if (!a) return `/images/growth/${slug}.webp`;
  return a.kind === 'video' ? a.poster : a.src;
}

export function growthMetadata(p: GrowthPageData): Metadata {
  const img = heroSrc(p.slug);
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.title, description: p.description, url: `/${p.slug}`, type: 'website', images: [img, site.ogImage] },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images: [img] },
  };
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
  const look = GROWTH_ART[p.slug];
  const hero = look ? ART[look.hero] : undefined;
  const desk = GROWTH_DESKS[p.slug];
  const guide = p.kind === 'guide';
  const answers = GROWTH_ANSWERS[p.slug];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': guide ? 'Article' : 'Service',
        name: p.h1.join(' '),
        description: p.description,
        url,
        image: `${site.url}${heroSrc(p.slug)}`,
        ...(guide
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
  const cta = wording?.cta ?? 'Book a free AI audit';
  const guideArt = guide ? look?.story : look?.guide ?? look?.hero;
  const Guide = () => p.prose ? (
        <section id="guide" className={svc.band} aria-labelledby="guide-h">
          <div className={svc.guide}>
            <aside className={svc.guideArt}>
              {guideArt && <ArtPlate name={guideArt} position={guide ? look?.storyPos : undefined} className={svc.guidePlate} sizes="(max-width:1080px) 100vw, 36vw" />}
            </aside>
            <div>
              <Label n={num()}>{guide ? 'THE GUIDE' : 'IN DEPTH'}</Label>
              <h2 id="guide-h"><Title t={guide ? p.h1 : ['The plain', 'answers.']} /></h2>
              {p.prose.map(b => (
                <div key={b.h} className={svc.guideBlock}>
                  <h3>{b.h}</h3>
                  {b.p.map((t, i) => <p key={i}>{rich(t)}</p>)}
                  {b.list && <ul>{b.list.map(y => <li key={y}>{rich(y)}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </section>
  ) : null;

  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: p.slug, name: p.crumb, design: 'growth-v3' }} />
      <ScrollDepth pageType="service" slug={p.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <ServiceHero
        slug={p.slug} eyebrow={p.eyebrow} h1={p.h1} sub={p.heroCopy}
        art={heroSrc(p.slug)} artAlt={hero?.alt ?? ''} artPos={look?.heroPos}
        tall={hero?.ratio === 'tall'} split={look?.split} video={hero?.kind === 'video' ? hero.src : undefined}
        cta={cta} seeHref={guide && p.prose ? '#guide' : '#see-it'} seeLabel={guide ? 'Read the guide' : 'See it work'}
        offer={promises ?? ['Audit free', 'First workflow free', 'Live in a week']}
      />
      {answers && <AnswerCard items={answers} />}

      {guide && Guide()}

      <ProblemTrio n={num()} eyebrow={p.problem.eyebrow} h2={p.problem.h2} intro={p.problem.intro} cards={p.problem.cards} />

      <DemoStage n={num()} eyebrow="SEE IT WORK" h2={desk ? ['Watch it', 'do the work.'] : [x.visual.type === 'roi' ? 'Run your' : 'What it', x.visual.type === 'roi' ? 'own numbers.' : 'looks like.']} tools={x.tools}
        intro={desk ? `${desk.label}. Each tab is a real moment from this kind of work: what arrives, what the system prepares, and the one decision a person makes.` : p.card.title ? `${p.card.title.charAt(0)}${p.card.title.slice(1).toLowerCase()}.` : p.heroCopy}
        note={desk ? 'Pick a tab, or let it play.' : 'Example figures. Your audit replaces them with your own.'}>
        {desk ? <IndustryDesk slug={p.slug} label={desk.label} items={desk.items} /> : <HeroVisual visual={x.visual} />}
      </DemoStage>

      <section className={svc.band} aria-labelledby="b-h">
        <div className={svc.head}>
          <div><Label n={num()}>{p.builds.eyebrow}</Label><h2 id="b-h"><Title t={p.builds.h2} /></h2></div>
          <p className={svc.lead}>{p.builds.intro}</p>
        </div>
        <div className={svc.tiles} style={{ '--cols': p.builds.items.length % 4 === 0 ? 4 : 3 } as React.CSSProperties}>
          {p.builds.items.map(c => <article key={c.h} className={svc.tile}>{c.tag && <small>{c.tag}</small>}<h3>{c.h}</h3><p>{c.p}</p></article>)}
        </div>
      </section>

      {look && (
        <Story n={num()} label={x.story.label} who={x.story.who} situation={x.story.situation} built={x.story.built} result={x.story.result}
          fine="A composite example with details changed. We do not name clients without their permission."
          media={<ArtPlate name={guide ? look.hero : look.story} position={guide ? look.heroPos : look.storyPos} className={svc.storyMedia} unveil={false} sizes="(max-width:1080px) 100vw, 50vw" />} />
      )}

      {!guide && Guide()}

      <Deliverables n={num()} eyebrow={p.steps.eyebrow} h2={p.steps.h2} intro={p.steps.intro} sunken
        items={p.steps.items.map(s => ({ h: s.badge ? `${s.h} · ${s.badge.charAt(0)}${s.badge.slice(1).toLowerCase()}` : s.h, p: s.p }))} />

      <MoneySection n={num()} h2={p.roi.h2} intro={p.roi.intro} rows={p.roi.rows} rowsNote={p.roi.note} />
      <WontBuild n={num()} items={p.wont} />

      <ServiceClose slug={p.slug} h2={p.close.h2} p={p.close.p} formTitle="Rather write it down first?"
        next={wording?.closeList ?? undefined}
        form={{ submitLabel: 'Send this and pick a time', note: wording?.form?.note ?? 'Tell us your team size, the tools you run, and the work that eats the most hours.', ...(wording?.form ? { fieldLabel: wording.form.fieldLabel, fieldPlaceholder: wording.form.fieldPlaceholder, fieldNote: wording.form.fieldNote } : {}) }} />

      <ServiceFaq h2={['Before you', 'book.']} faqs={p.faqs} link={wording?.faqLink ?? ['/n8n-portfolio', 'See 35 workflows we have published']} />
      <AlsoExplore links={p.related} />
    </main>
  );
}
