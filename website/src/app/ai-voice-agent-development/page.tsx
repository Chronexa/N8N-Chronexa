import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AIServicesRail from '../../components/AIServicesRail';
import { AnswerCard, RailGap, svc } from '../../components/service/ServiceParts';
import BookButton from '../../components/BookButton';
import LeadForm from '../../components/LeadForm';
import ScrollDepth from '../../components/ScrollDepth';
import TrackView from '../../components/TrackView';
import ImmersiveVoiceHero from '../../components/voice/ImmersiveVoiceHero';
import VoiceRoi from '../../components/voice/VoiceRoi';
import { site } from '../../lib/site';
import s from './voice-v3.module.css';

const title = 'AI Voice Agent Development Services | Chronexa';
const description = 'Custom AI voice agent development for inbound calls, AI receptionists, appointment booking and outbound workflows connected to your CRM, calendar and business systems.';
export const metadata: Metadata = {
  title: { absolute: title }, description,
  keywords: ['AI voice agent development', 'AI receptionist', 'AI phone agent', 'AI call agent', 'voice AI development company', 'appointment booking AI', 'conversational AI voice bot'],
  alternates: { canonical: '/ai-voice-agent-development' },
  openGraph: { title, description, url: '/ai-voice-agent-development', images: [site.ogImage] },
  twitter: { card: 'summary_large_image', title, description, images: [site.ogImage] },
};

const FAQS = [
  ['Can the agent use our existing phone number?', 'Usually. We can route an existing number, start with overflow or after-hours forwarding, or provision a dedicated line. The setup depends on your carrier and phone system.'],
  ['Can it book directly into our calendar or practice system?', 'Yes. We connect the agent to the available API or approved integration layer, define exactly what it can read and write, and design a fallback for failed or ambiguous actions.'],
  ['Can it understand accents and switch languages?', 'Yes. We select the speech stack for your callers, add business names and local terminology, and test real accents and language switching before launch. Coverage depends on the selected provider.'],
  ['What happens when a caller needs a person?', 'The agent can warm-transfer the call or create a priority follow-up with the caller’s name, reason and conversation summary. Human handoff is part of the flow, not an exception added later.'],
  ['How is pricing calculated?', 'Provider usage is metered by the selected voice, model and telephony stack. Chronexa quotes discovery, integration and ongoing operation after understanding call volume, systems and risk.'],
  ['How long does AI voice agent development take?', 'A focused receptionist or appointment-booking pilot can often be designed and tested in several weeks. Multi-location deployments, regulated workflows and custom system integrations take longer. We set the release plan after mapping your calls, tools and approval requirements.'],
  ['Do you build inbound and outbound AI phone agents?', 'Yes. Inbound agents can answer, qualify, schedule, route and support callers. Outbound agents can run consented reminders, lead follow-up, reactivation and service notifications. The workflow, disclosures and calling rules are configured for the use case and market.'],
  ['Which AI voice platforms do you work with?', 'We build with providers such as Retell AI, ElevenLabs, Twilio and OpenAI, as well as your existing CRM, scheduling, help-desk and automation systems. We choose the stack around latency, language coverage, control, integration requirements and operating cost.'],
];

const CAPABILITIES = [
  ['Conversation design', 'Call flows, interruption handling, clarification, business terminology and brand voice designed around real caller intent.'],
  ['Voice and language', 'Natural voices, multilingual conversations, accent testing, pronunciation dictionaries and latency tuning.'],
  ['Telephony deployment', 'New numbers, call forwarding, overflow and after-hours routing, SIP or supported contact-center connections.'],
  ['Business integrations', 'Calendars, CRMs, practice systems, help desks, payments, messaging and custom APIs with controlled permissions.'],
  ['Workflow automation', 'Bookings, lead creation, follow-up messages, summaries, notifications and human handoffs completed during the call.'],
  ['Testing and guardrails', 'Scenario simulations, tool-failure fallbacks, escalation rules, prohibited actions and release acceptance criteria.'],
  ['Analytics and evaluation', 'Transcripts, outcome tracking, call reviews, latency monitoring and prompt or workflow version comparison.'],
  ['Managed optimization', 'Ongoing review of failed calls, new intents, knowledge changes and measurable completion performance.'],
];

const INDUSTRIES = [
  ['Dental practices', 'New-patient intake, hygiene bookings, rescheduling, insurance FAQs and emergency escalation.', 'AI receptionist for dental offices'],
  ['Medical clinics', 'Appointment requests, location and service information, reminders and approved staff handoff.', 'Healthcare appointment scheduling'],
  ['Salons and med spas', 'Service discovery, provider matching, deposits, waitlists, cancellations and rebooking.', 'Salon AI booking agent'],
  ['Home services', 'Urgency triage, ZIP-code qualification, estimates, dispatch windows and after-hours calls.', 'AI phone agent for home services'],
  ['Professional services', 'New-client qualification, consultation scheduling, routing and structured intake summaries.', 'AI call agent for lead intake'],
  ['Retail and ecommerce', 'Order questions, product guidance, returns triage, abandoned-cart follow-up and customer care.', 'Voice AI for ecommerce support'],
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', name: 'AI Voice Agent Development Services', serviceType: ['AI voice agent development', 'AI receptionist development', 'AI phone agent integration'], description, url: `${site.url}/ai-voice-agent-development`, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: ['US', 'GB', 'CA', 'AE'], hasOfferCatalog: { '@type': 'OfferCatalog', name: 'AI voice agent services', itemListElement: CAPABILITIES.map(([name, itemDescription]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, description: itemDescription } })) } },
      { '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  return (
    <main className={s.page}>
      <TrackView event="service_view" props={{ slug: 'ai-voice-agent-development', name: 'AI voice agent development', design: 'immersive-voice-v3' }} />
      <ScrollDepth pageType="service" slug="ai-voice-agent-development" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <ImmersiveVoiceHero />
      <div className={svc.svc}>
        <AnswerCard flush items={[
          ['What it is', 'An AI phone agent that answers, qualifies, books and updates your systems while the caller talks.'],
          ['Who it’s for', 'Clinics, salons, home services and sales teams losing bookings to missed or repetitive calls.'],
          ['What you get', 'A working agent on your line, connected to your calendar and CRM, with clear transfer rules.'],
          ['How it’s priced', 'A pilot on one call type first. Then priced on call volume, languages and integrations.'],
          ['How fast', 'A test line your team can challenge within days. Live once it passes your calls.'],
        ]} />
        <RailGap />
        <AIServicesRail current="ai-voice-agent-development" />
      </div>

      <section className={s.statement} aria-labelledby="statement-title">
        <p>THE DIFFERENCE</p>
        <h2 id="statement-title">A beautiful voice is the beginning.{' '}<br /><em>The implementation is the product.</em></h2>
        <figure className={s.statementArt}><Image src="/images/service-art/voice-blooming-horn.webp" alt="A giant brass gramophone horn rising from a poppy meadow, releasing a spiral of butterflies into the sky" fill sizes="(max-width:760px) 100vw, 1250px" /></figure>
        <div className={s.statementRail}><span>Conversation</span><i /><span>Decision</span><i /><span>Action</span><i /><span>Business result</span></div>
      </section>

      <section className={s.orchestration} aria-labelledby="orchestration-title">
        <div className={s.orchestrationHead}>
          <p>LIVE ORCHESTRATION</p>
          <h2 id="orchestration-title">While the caller talks,{' '}<br /><em>the business moves.</em></h2>
        </div>
        <div className={s.orchestrationStage}>
          <div className={s.callCard}>
            <div><span className={s.liveDot} /> LIVE CALL <b>01:18</b></div>
            <p>“Tomorrow after three works. Can you send the intake form too?”</p>
            <div className={s.miniWave}>{Array.from({ length: 25 }, (_, i) => <i key={i} style={{ height: `${8 + ((i * 13) % 30)}px` }} />)}</div>
          </div>
          <div className={s.route} aria-hidden="true"><i /><i /><i /></div>
          <div className={s.brain}>
            <span>CHRONEXA AGENT LAYER</span>
            <strong>Intent: new patient booking</strong>
            <div><small>Knowledge grounded</small><small>Consent checked</small><small>Action permitted</small></div>
          </div>
          <div className={s.route} aria-hidden="true"><i /><i /><i /></div>
          <div className={s.toolStack}>
            <div><small>CALENDAR</small><strong>Tomorrow · 3:30 PM</strong><span>Slot held</span></div>
            <div><small>CRM</small><strong>New lead created</strong><span>Source: inbound call</span></div>
            <div><small>SMS</small><strong>Confirmation queued</strong><span>Intake link included</span></div>
          </div>
        </div>
        <p className={s.providerLine}>Built across the stack that fits the deployment <span>Retell</span><span>ElevenLabs</span><span>Twilio</span><span>OpenAI</span><span>n8n</span><span>Your APIs</span></p>
      </section>

      <section className={s.proofLedger} aria-labelledby="voice-proof-title">
        <div><p>PROOF / BEFORE RELEASE</p><h2 id="voice-proof-title">Hear the demo.<br /><em>Inspect the system.</em></h2><span>Talk to the agent above, then inspect the workflow behind one: availability checks, booking logic and the handoff to your team.</span><Link href="/case-studies/voice-agent-availability-and-booking-orchestration">Inspect the voice workflow ↗</Link></div>
        <div className={s.proofChecks}><article><span>01</span><strong>Conversation</strong><p>Intent, interruptions, clarification and language are tested with real scenarios.</p></article><article><span>02</span><strong>Business action</strong><p>Calendar, CRM, messaging and transfer actions are validated independently.</p></article><article><span>03</span><strong>Release evidence</strong><p>Successful, ambiguous and prohibited calls form the acceptance set.</p></article><article><span>04</span><strong>Operation</strong><p>Transcripts, outcomes, latency, cost and failures stay visible after launch.</p></article></div>
      </section>

      <section className={s.worlds} aria-labelledby="worlds-title">
        <div className={s.worldsIntro}><p>BUILT FOR THE CALLS THAT RUN LOCAL BUSINESS</p><h2 id="worlds-title">Two businesses.{' '}<br /><em>Two completely different agents.</em></h2></div>
        <article className={s.world}>
          <Image src="/images/voice-v3/dental-practice.webp" alt="Reception desk inside a modern dental practice" fill sizes="100vw" />
          <div className={s.worldShade} />
          <div className={s.worldCopy}><span>01 / DENTAL & CLINICS</span><h3>The front desk that never sends a new patient to voicemail.</h3><p>New appointments, insurance FAQs, rescheduling, emergency routing and after-hours intake.</p></div>
          <div className={s.bookingCard}><small>NEW PATIENT</small><strong>Cleaning · 60 min</strong><span>Tomorrow, 3:30 PM</span><b>Booked & confirmed ✓</b></div>
        </article>
        <article className={`${s.world} ${s.worldSalon}`}>
          <Image src="/images/voice-v3/salon-studio.webp" alt="Client arriving at a modern independent hair salon" fill sizes="100vw" />
          <div className={s.worldShade} />
          <div className={s.worldCopy}><span>02 / SALONS & MED SPAS</span><h3>The booking agent that knows every service, stylist and opening.</h3><p>Service discovery, deposits, stylist matching, waitlists, reminders and rebooking.</p></div>
          <div className={s.bookingCard}><small>RETURNING CLIENT</small><strong>Balayage · Sofia</strong><span>Saturday, 10:00 AM</span><b>$40 deposit link sent ✓</b></div>
        </article>
      </section>

      <section className={s.roles} aria-labelledby="roles-title">
        <div><p>ONE VOICE SYSTEM / MANY JOBS</p><h2 id="roles-title">Give the agent{' '}<br /><em>a finish line.</em></h2></div>
        <ol>
          <li><span>01</span><h3>Reception</h3><p>Answer, understand, book, reschedule and route.</p></li>
          <li><span>02</span><h3>Inbound sales</h3><p>Qualify urgency, value and fit before the handoff.</p></li>
          <li><span>03</span><h3>Customer care</h3><p>Resolve routine requests and open the right ticket.</p></li>
          <li><span>04</span><h3>Outbound operations</h3><p>Run consented reminders, recalls and follow-ups.</p></li>
        </ol>
      </section>

      <section className={s.capabilities} aria-labelledby="capabilities-title">
        <div className={s.capabilitiesHead}>
          <p>AI VOICE AGENT DEVELOPMENT SERVICES</p>
          <h2 id="capabilities-title">Every layer required{' '}<br /><em>for a production call.</em></h2>
          <p>Chronexa designs, builds and operates custom AI voice agents. We combine conversational AI with the telephony, business data, integrations and quality controls required to complete work reliably.</p>
        </div>
        <div className={s.capabilityGrid}>{CAPABILITIES.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className={s.industrySection} aria-labelledby="industries-title">
        <div className={s.industryHead}>
          <p>AI RECEPTIONISTS BY INDUSTRY</p>
          <h2 id="industries-title">One architecture.{' '}<br /><em>Your operating reality.</em></h2>
          <p>An effective AI receptionist must know what your team can promise, which system holds the truth and when a person should take over. That configuration changes by industry.</p>
        </div>
        <div className={s.industryGallery}>
          <article className={s.galleryClinic}>
            <Image src="/images/voice-v3/medical-clinic.webp" alt="Clinic coordinator assisting a patient at a reception desk" fill sizes="(max-width: 760px) 100vw, 48vw" />
            <div><span>CLINICS</span><strong>Every appointment starts with trust.</strong><small>Scheduling · routing · patient information</small></div>
          </article>
          <article>
            <Image src="/images/voice-v3/med-spa.webp" alt="Med-spa practitioner consulting with a client" fill sizes="(max-width: 760px) 100vw, 25vw" />
            <div><span>MED SPAS</span><strong>Turn questions into booked consultations.</strong><small>Service matching · deposits · rebooking</small></div>
          </article>
          <article>
            <Image src="/images/voice-v3/home-services.webp" alt="Home-service technician arriving for a scheduled visit" fill sizes="(max-width: 760px) 100vw, 25vw" />
            <div><span>HOME SERVICES</span><strong>Route urgent calls to the right visit.</strong><small>Qualification · dispatch · follow-up</small></div>
          </article>
        </div>
        <div className={s.industryList}>{INDUSTRIES.map(([title, body, label], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{body}</p></div><b>{label}</b></article>)}</div>
      </section>

      <section className={s.stackSection} aria-labelledby="stack-title">
        <div className={s.stackCopy}>
          <p>PLATFORM-AGNOSTIC IMPLEMENTATION</p>
          <h2 id="stack-title">The right voice stack.{' '}<br /><em>Connected to yours.</em></h2>
          <p>We can implement Retell AI or ElevenLabs for conversational voice, Twilio or an existing carrier for telephony, and OpenAI or another approved model for reasoning. The value comes from connecting that stack to the systems where your team already works.</p>
          <div className={s.stackLinks}><Link href="/ai-integration-services">AI integration services ↗</Link><Link href="/business-process-automation-consulting">Workflow automation consulting ↗</Link><Link href="/custom-software-development">Custom software development ↗</Link></div>
        </div>
        <div className={s.stackMap}>
          <div><small>VOICE + TELEPHONY</small><span>Retell AI</span><span>ElevenLabs</span><span>Twilio</span><span>Existing phone system</span></div>
          <i>→</i>
          <div className={s.stackCore}><small>CHRONEXA AGENT LAYER</small><strong>Conversation logic</strong><strong>Permissions</strong><strong>Workflow orchestration</strong><strong>Evaluation</strong></div>
          <i>→</i>
          <div><small>YOUR BUSINESS SYSTEMS</small><span>CRM</span><span>Calendar</span><span>Practice software</span><span>Help desk + payments</span></div>
        </div>
      </section>

      <section className={s.roi} aria-labelledby="roi-title">
        <div className={s.roiHead}><p>YOUR NUMBERS / NOT A SALES CLAIM</p><h2 id="roi-title">Model the calls{' '}<br /><em>before you automate them.</em></h2><span>Adjust volume, duration, booking value and conversion potential. We replace these planning assumptions with your call data during discovery.</span></div>
        <VoiceRoi />
      </section>

      <section className={s.release} aria-labelledby="release-title">
        <div className={s.releaseCopy}><p>FROM DEMO TO PHONE LINE</p><h2 id="release-title">A production agent{' '}<br /><em>is operated, not launched.</em></h2></div>
        <div className={s.operationsVisual}>
          <Image src="/images/voice-v3/voice-operations.webp" alt="Voice operations team reviewing call analytics and agent performance" fill sizes="100vw" />
          <div><span>MANAGED VOICE OPERATIONS</span><strong>Listen to failures.{' '}<br />Improve the system.</strong><p>We review conversations, evaluate outcomes, identify new caller intents and adjust prompts, knowledge and workflows over time.</p></div>
        </div>
        <div className={s.releaseTimeline}>
          <article><span>01</span><div><h3>Listen</h3><p>Real call reasons, policies, edge cases and measures of success.</p></div><b>Call map</b></article>
          <article><span>02</span><div><h3>Prototype</h3><p>Your voice, terminology and flow on a test line your team can challenge.</p></div><b>Working agent</b></article>
          <article><span>03</span><div><h3>Connect</h3><p>Calendar, CRM, knowledge, messaging and escalation with defined permissions.</p></div><b>System actions</b></article>
          <article><span>04</span><div><h3>Operate</h3><p>Conversation reviews, success evaluations, prompt versions and weekly improvement.</p></div><b>Managed performance</b></article>
        </div>
      </section>

      <section className={s.close} aria-labelledby="close-title">
        <div>
          <p>BRING US THE CALL FLOW</p>
          <h2 id="close-title">We’ll build the agent{' '}<br /><em>and everything behind it.</em></h2>
          <div className={s.closeActions}><BookButton location="voice-v3-close" className={s.primary}>Design my voice system <span>↗</span></BookButton><a href={`mailto:${site.email}`}>{site.email}</a></div>
        </div>
        <div className={s.form}><p>What should happen after “hello”?</p><LeadForm source="voice-agent-immersive-v3" fieldLabel="Which calls should your agent handle?" fieldPlaceholder="Business type, monthly calls, booking or CRM tools" fieldNote="Voice workflow" compact submitLabel="Send my call flow" note="Tell us the business, call volume, systems and the result the agent should complete." /></div>
      </section>

      <section className={s.faq} aria-labelledby="faq-title">
        <div><p>BEFORE WE BUILD</p><h2 id="faq-title">Questions that{' '}<br />change the system.</h2><Link href="/case-studies/voice-agent-availability-and-booking-orchestration">See a voice workflow ↗</Link></div>
        <div>{FAQS.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>
    </main>
  );
}
