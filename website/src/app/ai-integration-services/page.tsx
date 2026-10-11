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
import IntegrationMap from './IntegrationMap';
import s from './integration.module.css';

const p = growthPage('ai-integration-services');
const x = EXTRAS[p.slug];
const desk = GROWTH_DESKS[p.slug];
const ART = '/images/service-art/integration-floating-islands.webp';

export const metadata = serviceMetadata({ slug: p.slug, title: p.title, description: p.description, art: ART });

export default function Page() {
  return (
    <main className={svc.svc}>
      <TrackView event="service_view" props={{ slug: p.slug, name: p.crumb, design: 'service-world-v1' }} />
      <ScrollDepth pageType="service" slug={p.slug} />
      <ServiceSchema slug={p.slug} name="AI Integration Services" serviceType={['AI integration services', 'API integration', 'legacy system integration']} description={p.description} faqs={p.faqs} />

      <ServiceHero
        slug={p.slug} eyebrow={p.eyebrow} h1={p.h1} art={ART} artPos="72% center"
        artAlt="Small floating islands, each with its own building, joined to each other by glowing golden threads above the clouds"
        sub="We connect the software you already run, older systems included, so data moves once, nobody retypes it, and AI can finally see across the whole business."
        seeHref="#try" seeLabel="Trace a record"
      />
      <AnswerCard items={[
        ['What it is', 'Connecting your CRM, finance, documents and older systems to each other and to AI.'],
        ['Who it’s for', 'Teams where people retype, reconcile or chase the same record across tools.'],
        ['What you get', 'Monitored connections, one clean data path for AI, and an alert when anything fails.'],
        ['How it’s priced', 'Audit and first integration free. Then a fixed price per connection, in writing.'],
        ['How fast', 'First integration live inside a week. No platform migration required.'],
      ]} />
      <RailGap />
      <AIServicesRail current={p.slug} />

      <ProblemTrio n="01" eyebrow={p.problem.eyebrow} h2={p.problem.h2} intro={p.problem.intro} cards={p.problem.cards} />

      <section id="try" className={`${svc.band} ${svc.sunken}`} aria-labelledby="try-h">
        <div className={svc.head}>
          <div><Label n="02">TRY IT</Label><h2 id="try-h"><Title t={['Trace one record', 'across your systems.']} /></h2></div>
          <p className={svc.lead}>Pick a system. See what gets checked before anything is written, and what happens when two systems disagree.</p>
        </div>
        <IntegrationMap />
      </section>

      <DemoStage n="03" eyebrow="YOUR SYSTEMS, CONNECTED" h2={['One event.', 'Every system updated.']} tools={x.tools}
        intro="A won deal becomes a customer, an invoice and a project. An order lands in a 15-year-old ERP with no API. A sync fails, and a person hears about it in minutes.">
        <IndustryDesk slug={p.slug} label={desk.label} items={desk.items} />
      </DemoStage>

      <Deliverables n="04" eyebrow={p.builds.eyebrow} h2={p.builds.h2} intro={p.builds.intro} items={p.builds.items} />

      <section className={`${svc.band} ${svc.sunken}`} aria-labelledby="fail-h">
        <div className={svc.head}>
          <div><Label n="05">BUILT FOR THE BAD DAY</Label><h2 id="fail-h"><Title t={['The happy path', 'proves almost nothing.']} /></h2></div>
          <p className={svc.lead}>An integration is judged by what it does when a token expires, a field changes or two systems disagree. And by whether it forces you to replace anything.</p>
        </div>
        <div className={s.pair}>
          <div className={s.incident}>
            <span>Incident log</span>
            <h3>A supplier renamed a field overnight.</h3>
            <ol>
              <li><time>09:42</time>Downstream system rejected the record<b>WRITE STOPPED</b></li>
              <li><time>09:42</time>Original data kept untouched<b>NOTHING LOST</b></li>
              <li><time>09:43</time>Named owner alerted in Slack<b>PERSON ON IT</b></li>
              <li><time>10:05</time>Mapping fixed, record replayed<b>RESOLVED</b></li>
            </ol>
            <p>No silent failures, no duplicate invoices, no Monday-morning surprise.</p>
          </div>
          <div className={s.kwr}>
            <span>Your stack</span>
            <h3>Keep, wrap or replace?</h3>
            <dl>
              <div><dt>Keep</dt><dd>When the system does its job well and has a reliable way in.</dd></div>
              <div><dt>Wrap</dt><dd>When the business still needs it but its interface is weak. We build the bridge.</dd></div>
              <div><dt>Replace</dt><dd>Only when it costs more to keep than to move. We will show you the numbers.</dd></div>
            </dl>
            <p>We integrate Salesforce, HubSpot, NetSuite, QuickBooks, Xero, Microsoft 365, Google Workspace, databases and industry software.</p>
          </div>
        </div>
      </section>

      <Story n="06" who={x.story.who} situation={x.story.situation} built={x.story.built} result={x.story.result}
        fine="A composite example with details changed. We do not name clients without their permission."
        media={<IntegratedVisual kind="video" src="/videos/vision/migration-train.mp4" poster="/videos/vision/migration-train.jpg" marker="integration-story" className={svc.storyMedia} position="center" sizes="(max-width:1080px) 100vw, 50vw" />} />

      <MoneySection n="07" h2={p.roi.h2} intro={p.roi.intro} rows={p.roi.rows} />
      <WontBuild n="08" items={p.wont} />

      <ServiceClose slug={p.slug} h2={p.close.h2} p={p.close.p} formTitle="Which systems should talk to each other?"
        form={{ submitLabel: 'Send this and pick a time', note: 'Name the systems, the record that gets retyped and what happens when it goes wrong.', fieldLabel: 'Which systems need connecting?', fieldPlaceholder: 'e.g. HubSpot to QuickBooks, an old job system to our CRM', fieldNote: 'Systems' }} />

      <ServiceFaq h2={['Before you', 'book.']} faqs={p.faqs} link={['/delivery-and-security', 'Delivery and security']} />
      <AlsoExplore links={[['/custom-mcp-server-development', 'Custom MCP servers'], ['/tech-stack-migration', 'Tech stack migration'], ['/crm-automation-services', 'CRM automation'], ['/automated-reporting', 'Automated reporting']]} />
    </main>
  );
}
