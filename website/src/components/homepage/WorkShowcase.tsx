'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FILMS } from '../../app/shopify-store-build/content';
import { CommerceDemo, DocDemo, FlowDemo, MarketingDemo, PlatformDemo, ReportDemo, SalesDemo, VoiceDemo } from './WorkDemos';
import ArtPlate from '../visual/ArtPlate';
import type { ArtName } from '../../lib/art';
import w from './work.module.css';

/**
 * "Work we've shipped" — scrollytelling. Desktop: the chapters scroll on the left and the
 * demo stage on the right stays pinned, switching to the chapter in the middle of the screen.
 * Phones: each chapter carries its own demo inline. Clients are never named (NDA): the work is
 * described by sector, what we built, and the outcome. Outcome figures are from delivered work
 * or are typical results for that kind of system.
 */

type Chapter = {
  id: string;
  area: string;
  title: string;
  body: string;
  metrics: [string, string][];
  stack: string;
  link?: [string, string];
  demo: () => React.ReactNode;
  /** The painting the demo window sits on (lib/art.ts). */
  art: ArtName;
  artPos?: string;
};

const lumiq = FILMS[0].main;

const CHAPTERS: Chapter[] = [
  {
    id: 'reports', area: 'Report automation · Property engineering',
    title: 'The reports a whole firm is built on, drafted in minutes.',
    body: 'An engineering firm wrote long technical reports by hand from site photos, inspector notes and financial models. We built the engine that reads the photos, extracts every component, runs the numbers, writes the narrative and assembles the finished report. Analysts now review instead of write.',
    metrics: [['Days → minutes', 'per report draft'], ['85%', 'less analyst time'], ['1,200+', 'reports a year']],
    stack: 'Computer vision · Claude · n8n · document generation',
    link: ['Read the report automation case study', '/case-studies/how-reservestudy-automated-report-production-with-ai'],
    art: 'painted-thoughts', artPos: '40% 50%',
    demo: () => <ReportDemo />,
  },
  {
    id: 'documents', area: 'Document intelligence · Fintech, tax, private equity',
    title: 'Invoices, tax forms and data rooms, read the way an expert reads them.',
    body: 'Invoice ingestion with a three-way match for a fintech platform. Tax documents extracted for CPA firms, every field traced to the line it came from. A diligence copilot that reads entire data rooms for a private equity firm. Anything uncertain goes to a person, with the reason.',
    metrics: [['80%', 'less manual invoice handling'], ['70%', 'less data-room review'], ['10–15 min', 'from intake to engagement letter']],
    stack: 'Claude vision · citations · OCR · ERP and practice-software integrations',
    link: ['Explore document implementations', '/case-studies#document-processing'],
    art: 'reader-daisies', artPos: '50% 35%',
    demo: () => <DocDemo />,
  },
  {
    id: 'orchestration', area: 'AI orchestration · n8n',
    title: '35+ production workflows, with recovery designed in.',
    body: 'Our orchestration layer connects models, CRMs, inboxes, calendars, ad platforms and databases. Every workflow ships with retries, a dead-letter queue, monitoring and a human approval step before anything sends, spends or publishes.',
    metrics: [['35+', 'workflows in production'], ['15 min', 'longest gap before a missed lead is recovered'], ['100%', 'of outbound sends approved by a person']],
    stack: 'n8n · Claude · OpenAI · MCP servers · webhooks · Baserow · Slack',
    link: ['Open the real workflows', '/n8n-portfolio'],
    art: 'wired-head', artPos: '50% 30%',
    demo: () => <FlowDemo />,
  },
  {
    id: 'marketing', area: 'Marketing engine',
    title: 'A five-agent content team with one human editor.',
    body: 'Search data finds the gap. One agent researches, one writes, one checks every claim, one commissions the artwork, one publishes. The editor approves. The same engine reports on ad spend every morning and flags what changed.',
    metrics: [['169', 'articles researched and published'], ['5 → 1', 'agents to one human editor'], ['9:00 am', 'daily ad performance brief']],
    stack: 'Search Console · Exa · Claude · image models · Sanity · Meta Ads API',
    link: ['See the publishing system', '/case-studies/five-stage-seo-content-production-system'],
    art: 'frame-walk', artPos: '50% 40%',
    demo: () => <MarketingDemo />,
  },
  {
    id: 'sales', area: 'Sales engine',
    title: 'Every prospect researched, every email personal, a website built for each one.',
    body: 'The engine reads a prospect’s recent news and website, drafts outreach grounded in what it found, and builds a personalised preview website for that prospect. New inbound leads get a reply in seconds. Nothing is sent until a person approves it.',
    metrics: [['20 min → 40 s', 'research per prospect'], ['1 site', 'built per prospect, tracked'], ['Seconds', 'from form fill to first reply']],
    stack: 'Apollo · Exa · Claude · Next.js · ManyReach · WhatsApp Cloud API',
    link: ['See the research and approval workflow', '/case-studies/autonomous-outbound-research-and-review-engine'],
    art: 'pigeon-rush', artPos: '50% 35%',
    demo: () => <SalesDemo />,
  },
  {
    id: 'voice', area: 'Voice agents',
    title: 'Every call answered, qualified and booked, at any hour.',
    body: 'Voice agents that sound human, check the live calendar before they offer a slot, book it, and write the call back to your CRM. Built for clinics, home services and any business that loses revenue to missed calls.',
    metrics: [['24/7', 'calls answered'], ['0', 'double bookings: slots checked live'], ['~$0.13', 'per minute of call time']],
    stack: 'Retell · ElevenLabs · n8n · Google Calendar · CRM',
    link: ['Talk to one live', '/ai-voice-agent-development'],
    art: 'crt-head', artPos: '50% 30%',
    demo: () => <VoiceDemo />,
  },
  {
    id: 'platforms', area: 'Data platforms & software',
    title: 'Platforms for regulated industries, built to be checked.',
    body: 'A regulatory index for a top-tier law firm that proves it holds every document the regulator has published, and classifies new ones within 30 minutes. A machine-learning trading-signal platform and mobile app for a SEBI-regulated advisor. Court-grade legal translation with human review.',
    metrics: [['30 min', 'from publication to classified alert'], ['3', 'independent completeness checks'], ['Go + Flutter', 'regulated mobile platform']],
    stack: 'Python · FastAPI · PostgreSQL · XGBoost · Go · Flutter · Next.js',
    link: ['Discuss the architecture', '/contact'],
    art: 'retro-desk', artPos: '50% 40%',
    demo: () => <PlatformDemo />,
  },
  {
    id: 'commerce', area: 'Brands & commerce',
    title: 'Brands designed and built end to end, films included.',
    body: 'Brand strategy, store design and build, photography, campaign films and the automation behind the store, from one team using a ten-role AI studio with a senior designer signing off each step. LUMIQ, our own skincare brand, is the reference build.',
    metrics: [['3', 'brands live'], ['10', 'specialist AI roles per build'], ['Weeks', 'from concept to live store']],
    stack: 'Shopify · Liquid · Claude · image and video models',
    link: ['See the stores', '/ecommerce-development'],
    art: 'phone-products', artPos: '50% 45%',
    demo: () => <CommerceDemo src={lumiq.src} poster={lumiq.poster} />,
  },
];

export default function WorkShowcase() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${w.showcase} ${paused ? w.paused : ''}`}>
      <button type="button" className={w.motionToggle} onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Resume walkthrough motion' : 'Pause walkthrough motion'}</button>
      <div className={w.chapters}>
        {CHAPTERS.map((c, i) => (
          <article
            key={c.id}
            data-i={i}
            ref={(el) => { refs.current[i] = el; }}
            className={`${w.chapter} ${i === active ? w.isActive : ''}`}
          >
            <div className={`${w.inline} ${i === active ? w.run : ''}`}>
              <div className={w.scene}>
                <ArtPlate name={c.art} position={c.artPos} className={w.sceneArt} sizes="100vw" decorative />
                <div className={w.sceneDemo}>{c.demo()}</div>
              </div>
            </div>
            <p className={w.area}><span>{String(i + 1).padStart(2, '0')}</span>{c.area}</p>
            <h3>{c.title}</h3>
            <p className={w.body}>{c.body}</p>
            <dl className={w.metrics}>
              {c.metrics.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
            </dl>
            <p className={w.stack}>{c.stack}</p>
            {c.link && <Link href={c.link[1]} className={w.more}>{c.link[0]} →</Link>}
          </article>
        ))}
      </div>
      <div className={w.stageCol} aria-hidden="true" inert>
        <div className={w.stage}>
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className={`${w.slide} ${i === active ? `${w.on} ${w.run}` : ''}`}>
              <div className={w.scene}>
                <ArtPlate name={c.art} position={c.artPos} className={w.sceneArt} unveil={false} sizes="40vw" decorative />
                <div className={w.sceneDemo}>{c.demo()}</div>
              </div>
            </div>
          ))}
          <p className={w.counter}>{String(active + 1).padStart(2, '0')} <span>/ {String(CHAPTERS.length).padStart(2, '0')}</span></p>
        </div>
      </div>
    </div>
  );
}
