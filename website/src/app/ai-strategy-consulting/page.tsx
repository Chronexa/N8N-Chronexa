import AIServicesRail from '../../components/AIServicesRail';
import IndustryDesk from '../../components/industry/IndustryDesk';
import ScrollDepth from '../../components/ScrollDepth';
import TrackView from '../../components/TrackView';
import IntegratedVisual from '../../components/visual/IntegratedVisual';
import {
  AlsoExplore, AnswerCard, Deliverables, DemoStage, Label, MoneySection, ProblemTrio, RailGap,
  ServiceClose, ServiceFaq, ServiceHero, ServiceSchema, Story, Title, WontBuild, serviceMetadata, svc,
} from '../../components/service/ServiceParts';
import { GROWTH_DESKS } from '../../lib/growth-desks';
import { EXTRAS } from '../../lib/growth-extras';
import { growthPage } from '../../lib/growth-pages';
import StrategyDecisionLab from './StrategyDecisionLab';
import s from './strategy.module.css';

const p = growthPage('ai-strategy-consulting');
const x = EXTRAS[p.slug];
const desk = GROWTH_DESKS[p.slug];
const ART = '/images/service-art/strategy-doorways.webp';

export const metadata = serviceMetadata({ slug: p.slug, title: p.title, description: p.description, art: ART });

// The audit's output, ranked by return (same example as the roadmap card used across the site).
const ROADMAP = x.visual.type === 'bars' ? x.visual.rows : [];

const ROLES = [
  ['CEO / FOUNDER', 'Where does this create leverage?', 'Investment order, time to a first result and the cost of waiting.'],
  ['CTO', 'Can our systems support it?', 'Data access, security, ownership and what it does to technical debt.'],
  ['COO', 'Will it survive real work?', 'Exceptions, who approves what, adoption and who runs it after launch.'],
  ['CFO', 'What controls the cost?', 'What drives the price, model and tool usage, and a clear point to stop.'],
] as const;

export default function Page() {
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: p.slug, name: p.crumb, design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={p.slug} />
      <ServiceSchema slug={p.slug} name="AI Strategy Consulting" serviceType={['AI strategy consulting', 'AI readiness assessment', 'AI roadmap consulting']} description={p.description} faqs={p.faqs} />

      <ServiceHero
        slug={p.slug} eyebrow={p.eyebrow} h1={p.h1} art={ART} artPos="64% center"
        artAlt="A person in a meadow at golden hour facing several glowing doorways, one brighter than the rest"
        sub="We find where AI will pay back in your business, rank every idea by return, and build the top one free inside a week. The same team plans it and ships it."
        seeHref="#try" seeLabel="Test an idea"
      />
      <AnswerCard items={[
        ['What it is', 'An audit of how your company really works, turned into an AI roadmap ranked by return.'],
        ['Who it’s for', 'Founders and operators with more AI ideas than certainty about which to fund.'],
        ['What you get', 'A ranked roadmap, the business case for the top items, and the first one live.'],
        ['How it’s priced', 'Audit free. First build free. Every next build fixed-price, agreed in writing.'],
        ['How fast', 'Roadmap within days. First result running inside a week.'],
      ]} />
      <RailGap />
      <AIServicesRail current={p.slug} />

      <ProblemTrio n="01" eyebrow={p.problem.eyebrow} h2={p.problem.h2} intro={p.problem.intro} cards={p.problem.cards} />

      <section id="try" className={`${svc.band} ${svc.sunken}`} aria-labelledby="try-h">
        <div className={svc.head}>
          <div><Label n="02">TRY IT</Label><h2 id="try-h"><Title t={['Put one idea', 'under pressure.']} /></h2></div>
          <p className={svc.lead}>Move the sliders the way we would in the audit. The most exciting idea is rarely the best first build, and this shows why in ten seconds.</p>
        </div>
        <div className={s.tryGrid}>
          <StrategyDecisionLab />
          <aside className={s.roadmap} aria-label="Example ranked roadmap">
            <span>What the audit hands you</span>
            <strong>Every idea, ranked by what it earns.</strong>
            <ol>{ROADMAP.map((r) => <li key={r.k} className={r.v < 10 ? s.not : undefined}><div>{r.k}<b>{r.label}</b></div><i style={{ width: `${Math.max(r.v, 6)}%` }} /></li>)}</ol>
            <p>Example roadmap. Your audit produces the real one, with the working behind every number.</p>
          </aside>
        </div>
      </section>

      <DemoStage n="03" eyebrow="SEE AN AUDIT" h2={['Watch the audit', 'turn into decisions.']} tools={x.tools}
        intro="Three real audit moments: mapping where a finance team’s hours go, testing three models on 50 contracts, and ranking the roadmap. Each ends in a decision someone can act on.">
        <IndustryDesk slug={p.slug} label={desk.label} items={desk.items} />
      </DemoStage>

      <Deliverables n="04" eyebrow={p.builds.eyebrow} h2={p.builds.h2} intro={p.builds.intro} items={p.builds.items} />

      <Story n="05" who={x.story.who} situation={x.story.situation} built={x.story.built} result={x.story.result}
        fine="A composite example with details changed. We do not name clients without their permission."
        media={<IntegratedVisual kind="video" src="/videos/vision/strategy-decision-field.mp4" poster="/videos/vision/strategy-decision-field.jpg" marker="strategy-story" className={svc.storyMedia} position="center" sizes="(max-width:1080px) 100vw, 50vw" />} />

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="roles-h">
        <div className={svc.head}>
          <div><Label n="06">FOR THE WHOLE LEADERSHIP TEAM</Label><h2 id="roles-h"><Title t={['One roadmap.', 'Four reasons to trust it.']} /></h2></div>
          <p className={svc.lead}>Each leader asks a different question before funding AI. The roadmap answers all four in one document.</p>
        </div>
        <div className={svc.tiles} style={{ '--cols': 4 } as React.CSSProperties}>
          {ROLES.map(([who, q, a]) => <article key={who} className={svc.tile}><small>{who}</small><h3>{q}</h3><p>{a}</p></article>)}
        </div>
      </section>

      <MoneySection n="07" h2={p.roi.h2} intro={p.roi.intro} rows={p.roi.rows} />
      <WontBuild n="08" items={p.wont} />

      <ServiceClose slug={p.slug} h2={p.close.h2} p={p.close.p} formTitle="Which AI ideas are on the table?"
        form={{ submitLabel: 'Send this and pick a time', note: 'Tell us the ideas, the teams involved and the result that would matter this year.', fieldLabel: 'Which AI ideas are you weighing?', fieldPlaceholder: 'e.g. client reporting, proposal drafting, a support agent', fieldNote: 'AI ideas' }} />

      <ServiceFaq h2={['Before you', 'book.']} faqs={p.faqs} explain={p.prose} link={['/how-we-work', 'How we work']} />
      <AlsoExplore links={[['/ai-consultant', 'Hire an AI consultant'], ['/business-process-automation-consulting', 'Process automation consulting'], ['/ai-automation-agency', 'AI automation agency'], ['/ai-roi-calculator', 'AI ROI calculator']]} />
    </main>
  );
}
