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
import AgentRoleLab from './AgentRoleLab';
import s from './agent.module.css';

const p = growthPage('ai-agent-development');
const x = EXTRAS[p.slug];
const desk = GROWTH_DESKS[p.slug];
const ART = '/images/service-art/agent-starlight-apprentice.webp';

export const metadata = serviceMetadata({ slug: p.slug, title: p.title, description: p.description, art: ART });

const KINDS = [
  ['CHATBOT', 'Answers questions', 'Conversation is the product. Good for looking things up in a bounded set of answers.', false],
  ['WORKFLOW', 'Moves a known process', 'The path is mostly fixed. Best when inputs and the outcome are stable.', false],
  ['AI AGENT', 'Owns one job across tools', 'The path can vary inside explicit limits. Best when language, judgement and several tools meet.', true],
] as const;

const CONTROLS = [
  { h: 'One job with a finish line', p: 'A briefing written, a report checked, a request resolved. Something a reviewer can recognise as done.' },
  { h: 'Knowledge it is allowed to use', p: 'Your policies, past work and live records, with the source shown next to every claim.' },
  { h: 'Tools with narrow permissions', p: 'Read here, draft there, never send or pay without approval. No blanket access.' },
  { h: 'A test before it goes live', p: 'Normal, ambiguous and forbidden tasks. It is released only when it passes.' },
  { h: 'A person on every consequence', p: 'Anything client-facing, financial or irreversible waits for a named human.' },
  { h: 'A record of everything it did', p: 'Inputs, sources, actions, cost and failures stay visible after launch.' },
];

export default function Page() {
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: p.slug, name: p.crumb, design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={p.slug} />
      <ServiceSchema slug={p.slug} name="Custom AI Agent Development" serviceType={['AI agent development', 'custom AI agents', 'human-in-the-loop AI']} description={p.description} faqs={p.faqs} />

      <ServiceHero
        split slug={p.slug} eyebrow={p.eyebrow} h1={p.h1} art={ART}
        artAlt="A figure made of starlight carries a basket through a blossoming orchard while a gardener walks beside it, pointing the way"
        sub="We build AI agents that know your business, check work against your rules, handle the routine themselves and hand a person anything that needs judgement."
        seeHref="#try" seeLabel="Pick a job"
      />
      <AnswerCard items={[
        ['What it is', 'A custom AI agent that does one defined job inside your tools: research, drafting, reviewing or follow-up.'],
        ['Who it’s for', 'Teams whose senior people lose hours checking, drafting or chasing routine work.'],
        ['What you get', 'A working agent, the knowledge it uses, its permissions and the test it must pass.'],
        ['How it’s priced', 'First agent workflow free. Then fixed-price builds, with model usage shown openly.'],
        ['How fast', 'First agent live inside a week. Its freedom widens only when it has earned it.'],
      ]} />
      <RailGap />
      <AIServicesRail current={p.slug} />

      <section id="try" className={svc.band} aria-labelledby="try-h">
        <div className={svc.head}>
          <div><Label n="01">TRY IT</Label><h2 id="try-h"><Title t={['An agent is a job,', 'not a personality.']} /></h2></div>
          <p className={svc.lead}>Pick a job. Its knowledge, tools, hard limits and release test change with it, and it stops where a person should decide.</p>
        </div>
        <AgentRoleLab />
      </section>

      <ProblemTrio n="02" eyebrow={p.problem.eyebrow} h2={p.problem.h2} intro={p.problem.intro} cards={p.problem.cards} />

      <DemoStage n="03" eyebrow="AN AGENT AT WORK" h2={['Watch an agent', 'know when not to guess.']} tools={x.tools}
        intro="A research agent, a reviewer agent and an inbox agent, each doing its job and stopping exactly where a person should take over.">
        <IndustryDesk slug={p.slug} label={desk.label} items={desk.items} />
      </DemoStage>

      <section className={svc.band} aria-labelledby="kinds-h">
        <div className={svc.head}>
          <div><Label n="04">BUY THE RIGHT THING</Label><h2 id="kinds-h"><Title t={['Chatbot, workflow', 'or agent?']} /></h2></div>
          <p className={svc.lead}>Buy the simplest thing that can do the job safely. If a fixed workflow will do, we will build that instead and tell you why.</p>
        </div>
        <div className={svc.tiles}>
          {KINDS.map(([tag, h, body, on]) => <article key={tag} className={`${svc.tile} ${on ? svc.tileOn : ''}`}><small>{tag}</small><h3>{h}</h3><p>{body}</p>{on && <strong>What this page builds</strong>}</article>)}
        </div>
      </section>

      <Deliverables sunken n="05" eyebrow="PROOF BEFORE FREEDOM" h2={['Six controls around', 'every agent we ship.']}
        intro="The model is one layer. What makes an agent safe to trust with real work is everything around it."
        items={CONTROLS}
        aside={
          <div className={s.score}>
            <span>Release test before go-live</span>
            <div className={s.scoreTop}><b>21/24</b><small>tasks passed with evidence</small></div>
            <ol>
              <li>Normal tasks completed <b>12 / 12</b></li>
              <li>Unclear tasks sent to a person <b>6 / 7</b></li>
              <li>Forbidden actions refused <b>3 / 3</b></li>
              <li className={s.gap}>Evidence gaps to fix <b>2</b></li>
            </ol>
            <p>Release waits until both gaps are fixed and retested.</p>
          </div>
        } />

      <section className={svc.band} aria-labelledby="builds-h">
        <div className={svc.head}>
          <div><Label n="06">{p.builds.eyebrow}</Label><h2 id="builds-h"><Title t={p.builds.h2} /></h2></div>
          <p className={svc.lead}>{p.builds.intro}</p>
        </div>
        <div className={svc.tiles}>{p.builds.items.map((b) => <article key={b.h} className={svc.tile}><small>AGENT</small><h3>{b.h}</h3><p>{b.p}</p></article>)}</div>
      </section>

      <Story n="07" who={x.story.who} situation={x.story.situation} built={x.story.built} result={x.story.result}
        fine="A composite example with details changed. We do not name clients without their permission."
        media={<IntegratedVisual kind="video" src="/videos/vision/agent-exploration.mp4" poster="/videos/vision/agent-exploration.jpg" marker="agent-story" className={svc.storyMedia} position="center" sizes="(max-width:1080px) 100vw, 50vw" />} />

      <MoneySection n="08" h2={p.roi.h2} intro={p.roi.intro} rows={p.roi.rows} />
      <WontBuild n="09" items={p.wont} />

      <ServiceClose slug={p.slug} h2={p.close.h2} p={p.close.p} formTitle="Which job should your first agent own?"
        form={{ submitLabel: 'Send this and pick a time', note: 'Tell us the inputs, the tools, what “done” looks like and who approves it.', fieldLabel: 'Which job should the agent do?', fieldPlaceholder: 'e.g. check client reports before a partner signs', fieldNote: 'Agent job' }} />

      <ServiceFaq h2={['Before you', 'book.']} faqs={p.faqs} link={['/delivery-and-security', 'Delivery and security']} />
      <AlsoExplore links={[['/ai-knowledge-systems', 'AI knowledge systems'], ['/custom-mcp-server-development', 'Custom MCP servers'], ['/ai-email-management', 'AI email management'], ['/customer-support-automation', 'Customer support automation']]} />
    </main>
  );
}
