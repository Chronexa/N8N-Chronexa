import Link from 'next/link';
import { site } from '../../lib/site';
import BookButton from '../BookButton';
import LeadForm from '../LeadForm';
import TrackView from '../TrackView';
import ScrollDepth from '../ScrollDepth';
import IndustryDesk, { type DeskItem } from './IndustryDesk';
import s from '../../app/crm-automation-services/crm.module.css';
import x from './industry.module.css';
import HeroStage, { ProofArt } from '../visual/HeroStage';
import type { ArtName } from '../../lib/art';

/** Hero and proof paintings per industry (lib/art.ts); the hero matches the homepage industry index. */
const INDUSTRY_ART: Record<string, [ArtName, string, ArtName]> = {
  'financial-services-automation': ['galaxy-reach', '62% 50%', 'ocean-city'],
  'insurance-claims-triage-automation': ['astronaut-drift', '60% 50%', 'knight-poppies'],
  'vc-pe-crm-automation': ['floating-islands', '60% 50%', 'desert-explorer'],
  'property-management-automation': ['watermill', '60% 50%', 'cloud-tram'],
  'd2c-ecommerce-automation': ['pink-smoke', '50% 35%', 'commerce-room'],
};

/**
 * Industry page (2026-10-08). Same studio language and section rhythm as the solution pages
 * (CRM, support, sales): interactive hero desk → stack strip → 01 recognition → 02 where AI pays
 * back (ROI table) → 03 systems we connect → 04 guardrails → 05 engagement scope → proof → close
 * with form → FAQ → related. Content per industry lives in lib/industry-pages.ts.
 */

type Tile =
  | { kind: 'rows'; chip?: string; rows: [string, string, boolean?][] }
  | { kind: 'bars'; chip: string; bars: number[] };

export type IndustryPageData = {
  slug: string;
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: [string, string];
  heroCopy: string;
  heroNote: [string, string];
  deskLabel: string;
  desk: DeskItem[];
  stack: string[];
  symptomsHead: [string, string, string];
  symptoms: { tile: Tile; label: string; h: string; p: string }[];
  numbers: [string, string][];
  roiHead: [string, string, string];
  roi: [string, string, string, string, string][];
  systemsHead: [string, string, string];
  systems: [string, string][];
  guardsHead: [string, string, string];
  guards: [string, string][];
  scope: string[];
  outside: string[];
  proof: { h: string; p: string[]; link?: [string, string] };
  close: { h: [string, string]; p: string; list: [string, string, string]; field: string };
  faqs: { q: string; a: string }[];
  related: [string, string][];
};

function TileView({ t }: { t: Tile }) {
  if (t.kind === 'bars') {
    return (
      <div className={s.tile}>
        <span className={s.chip}>{t.chip}</span>
        <div className={s.barRow}>{t.bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      </div>
    );
  }
  return (
    <div className={s.tile}>
      {t.chip && <span className={s.chip}>{t.chip}</span>}
      {t.rows.map(([a, b, miss]) => (
        <div key={a} className={s.rowLine}><span>{a}</span><b className={miss ? s.miss : undefined}>{b}</b></div>
      ))}
    </div>
  );
}

export default function IndustryStudio({ d }: { d: IndustryPageData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${site.url}/${d.slug}#service`,
        name: d.name,
        serviceType: d.name,
        description: d.description,
        url: `${site.url}/${d.slug}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Industries', item: `${site.url}/solutions` },
          { '@type': 'ListItem', position: 3, name: d.name, item: `${site.url}/${d.slug}` },
        ],
      },
      { '@type': 'FAQPage', mainEntity: d.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <div className={s.page}>
      <TrackView event="service_view" props={{ slug: d.slug, name: d.name, design: 'industry-studio-v1' }} />
      <ScrollDepth pageType="service" slug={d.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <section className={s.hero} aria-labelledby="h">
        <div>
          <p className={s.eyebrow}><i />{d.eyebrow}</p>
          <h1 id="h">{d.h1[0]} <em>{d.h1[1]}</em></h1>
          <p className={s.heroCopy}>{d.heroCopy}</p>
          <div className={s.heroActions}>
            <BookButton location={`industry-hero:${d.slug}`} className={s.primary}>Book a strategy call <span aria-hidden="true">↗</span></BookButton>
            <a href="#roi" className={s.ghost}>See where AI pays back <span aria-hidden="true">↓</span></a>
          </div>
          <p className={s.heroNote}>{d.heroNote[0]}<span>{d.heroNote[1]}</span></p>
        </div>
        {INDUSTRY_ART[d.slug]
          ? <HeroStage art={INDUSTRY_ART[d.slug][0]} position={INDUSTRY_ART[d.slug][1]}><IndustryDesk slug={d.slug} label={d.deskLabel} items={d.desk} /></HeroStage>
          : <IndustryDesk slug={d.slug} label={d.deskLabel} items={d.desk} />}
      </section>

      <div className={s.strip} aria-label="Systems we work with">
        <span>THE STACK.<br /><b>WHAT WE CONNECT.</b></span>
        {d.stack.map((t, i) => (i === 0 ? <b key={t}>{t}</b> : <span key={t}>{t}</span>))}
      </div>

      <section className={s.band} aria-labelledby="s1">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />01 / {d.symptomsHead[0]}</p>
            <h2 id="s1">{d.symptomsHead[1]}<br /><em>{d.symptomsHead[2]}</em></h2>
          </div>
          <p>These are the four places the work leaks most often. Most firms have at least two of them running right now.</p>
        </div>
        <div className={s.symptoms}>
          {d.symptoms.map((sy, i) => (
            <article key={sy.label}>
              <TileView t={sy.tile} />
              <span>{String(i + 1).padStart(2, '0')} / {sy.label}</span>
              <h3>{sy.h}</h3>
              <p>{sy.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="roi" className={`${s.band} ${s.sunken}`} aria-labelledby="s2">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />02 / {d.roiHead[0]}</p>
            <h2 id="s2">{d.roiHead[1]}<br /><em>{d.roiHead[2]}</em></h2>
          </div>
          <p>Ranked by how fast they usually pay back. The free audit puts your own numbers in the last column.</p>
        </div>
        <dl className={x.numbers}>
          {d.numbers.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
        </dl>
        <div style={{ marginTop: 34 }}>
          <table className={x.roi}>
            <thead><tr><th>Use case</th><th>Today</th><th>With Chronexa</th><th>Typical impact</th></tr></thead>
            <tbody>
              {d.roi.map(([u, today, after, big, small]) => (
                <tr key={u}><td>{u}</td><td>{today}</td><td>{after}</td><td><b>{big}</b><span>{small}</span></td></tr>
              ))}
            </tbody>
          </table>
          <p className={x.roiNote}>Typical results from systems we have delivered and comparable deployments. Your audit replaces them with your own numbers.</p>
        </div>
      </section>

      <section className={s.band} aria-labelledby="s3">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />03 / {d.systemsHead[0]}</p>
            <h2 id="s3">{d.systemsHead[1]}<br /><em>{d.systemsHead[2]}</em></h2>
          </div>
          <p>We connect what you already run first. APIs where they exist, MCP servers and careful automation where they do not.</p>
        </div>
        <div className={x.systems}>
          {d.systems.map(([n, p]) => <div key={n} className={x.system}><strong>{n}</strong><span>{p}</span></div>)}
        </div>
      </section>

      <section className={`${s.band} ${s.sunken}`} aria-labelledby="s4">
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}><i />04 / {d.guardsHead[0]}</p>
            <h2 id="s4">{d.guardsHead[1]}<br /><em>{d.guardsHead[2]}</em></h2>
          </div>
          <p>The controls are designed in from the first workflow, not added after something goes wrong.</p>
        </div>
        <div className={x.guards}>
          {d.guards.map(([h, p]) => <div key={h} className={x.guard}><h3>{h}</h3><p>{p}</p></div>)}
        </div>
      </section>

      <section className={s.band} aria-labelledby="s5">
        <div className={s.scope}>
          <div>
            <p className={s.eyebrow}><i />05 / THE ENGAGEMENT</p>
            <h2 id="s5">Agreed in writing<br /><em>before anything is built.</em></h2>
            <p className={s.lede}>Scope, what counts as working, and the price. Built in your own accounts, documented and exportable. The free audit comes first, and so does the first workflow.</p>
            <div className={s.stamp}>Built for you.<br /><strong>Owned by you.</strong><span aria-hidden="true">↗</span></div>
          </div>
          <div>
            <ul className={s.scopeList}>
              {d.scope.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}<b aria-hidden="true">↗</b></li>)}
            </ul>
            <details className={s.outside}>
              <summary>What sits outside the scope <span aria-hidden="true">+</span></summary>
              <ul>{d.outside.map((o) => <li key={o}>{o}</li>)}</ul>
            </details>
          </div>
        </div>
      </section>

      <section className={s.band} aria-labelledby="s6">
        <div className={s.proof}>
          <div>
            <p className={s.eyebrow}><i />RELEVANT WORK</p>
            <h2 id="s6">We have built this before.</h2>
            {INDUSTRY_ART[d.slug] && <ProofArt art={INDUSTRY_ART[d.slug][2]} />}
          </div>
          <div>
            <h3>{d.proof.h}</h3>
            {d.proof.p.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            {d.proof.link && <Link className={s.proofLink} href={d.proof.link[1]}>{d.proof.link[0]} <span aria-hidden="true">↗</span></Link>}
          </div>
        </div>
      </section>

      <section className={s.close} id="talk" aria-labelledby="s7">
        <div>
          <p className={s.eyebrow}><i />06 / START WITH ONE WORKFLOW</p>
          <h2 id="s7">{d.close.h[0]}<br /><em>{d.close.h[1]}</em></h2>
          <p>{d.close.p}</p>
          <ol className={s.closeList}>{d.close.list.map((l) => <li key={l}>{l}</li>)}</ol>
          <p className={s.direct}>
            You will be talking to the engineers who would build it, not an account manager.
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className={s.formWrap}>
          <p>Rather write it down first?</p>
          <LeadForm source={`industry:${d.slug}`} compact submitLabel="Send this and pick a time" fieldPlaceholder={d.close.field} note="We read it before the call, so the call starts at your problem." />
        </div>
      </section>

      <section className={s.faq} aria-labelledby="s8">
        <div>
          <p className={s.eyebrow}><i />A FEW GOOD QUESTIONS</p>
          <h2 id="s8">Before you start.</h2>
        </div>
        <div>{d.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </section>

      <nav className={s.related} aria-label="Related">
        <span>Related</span>
        {d.related.map(([l, h]) => <Link key={h} href={h}>{l} ↗</Link>)}
      </nav>
    </div>
  );
}
