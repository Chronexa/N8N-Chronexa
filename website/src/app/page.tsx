import Hero from '../components/Hero';
import LogoMarquee from '../components/LogoMarquee';
import WorkShipped from '../components/WorkShipped';
import BottleneckRouter from '../components/BottleneckRouter';
import MidPageCta from '../components/MidPageCta';
import EngineShowcase from '../components/EngineShowcase';
import Evidence from '../components/Evidence';
import HowWeWork from '../components/HowWeWork';
import StackDiagram from '../components/StackDiagram';
import Team from '../components/Team';
import ToolsStrip from '../components/ToolsStrip';
import Faq from '../components/Faq';
import CtaBand from '../components/CtaBand';
import ScrollDepth from '../components/ScrollDepth';

// Hidden — kept for spoke pages / future use
// import RoiGrid from '../components/RoiGrid';
// import ServiceShowcase from '../components/ServiceShowcase';

/**
 * Homepage — rebuilt 2026-07.
 *
 * The argument runs: attention → credibility → evidence → relevance →
 * capability → category → safety → humanity → low-friction alternative →
 * objections → action.
 *
 * Three inversions against the previous build, all deliberate:
 *   • Proof (WorkShipped) moved from 8th to 3rd. A stranger decides "is this
 *     real" before "is this relevant"; the old order asked them to read ~600
 *     words of methodology first, and almost nobody reached the case studies.
 *   • The two process sections (PartnershipModel + Process) collapsed into one
 *     HowWeWork. They made the same argument twice.
 *   • The FAQ moved below the proof. Objection handling before desire just
 *     hands the reader reasons to leave.
 *
 * Two sections are new, and they exist to let one page serve both a regulated
 * enterprise and a general automation lead without diluting either:
 * BottleneckRouter (they self-select) and EngineShowcase (capability shown, not
 * claimed). BottleneckRouter also replaces the old PainPoints block — the
 * router IS the problem statement, phrased in the visitor's own words.
 */
export default function Home() {
  return (
    <>
      <ScrollDepth pageType="home" />

      {/* 1 — Hero. Background video retained; copy is capacity-led, and the
             Anthropic partnership pill moved up into it. */}
      <Hero />

      {/* 2 — Trust strip: the stack you already run. */}
      <LogoMarquee />

      {/* 3 — Proof, early. Each card deep-links to its own case study. */}
      <section id="case-studies" className="section-light section-major">
        <div className="container">
          <WorkShipped />
        </div>
      </section>

      {/* 4 — Self-selection by bottleneck or industry, with the mid-page CTA
             sitting right where a visitor thinks "yes, that's my week". */}
      <section className="section-light">
        <div className="container">
          <BottleneckRouter />
          <MidPageCta />
        </div>
      </section>

      {/* 5 — The differentiator: six built engines, one mounted at a time.
             One of only three dark moments on the page — the scenes are built
             on dark stages, and the emphasis belongs here. */}
      <section className="section-dark section-major section-live">
        <div className="container">
          <EngineShowcase />
        </div>
      </section>

      {/* 6 — Cited industry research + our own attributed numbers. */}
      <section className="section-light section-major">
        <div className="container">
          <Evidence />
        </div>
      </section>

      {/* 7 — One process section, not two. */}
      <section className="section-light">
        <div className="container">
          <HowWeWork />
        </div>
      </section>

      {/* 7.5 — The connection diagram: work arrives from their stack, the engine
             does the middle, results land back where people look. "what it plugs
             into" → "the people who build it" (Team next). */}
      <section className="section-muted section-major">
        <div className="container">
          <StackDiagram />
        </div>
      </section>

      {/* 8 — The people. Services are bought from humans, and the credentials
             here (CA, 10+ yrs engineering) are what a CPA or finance buyer
             is actually checking for. */}
      <section className="section-light">
        <div className="container">
          <Team />
        </div>
      </section>

      {/* 9 — The second conversion path for visitors not ready to book. */}
      <section className="section-muted">
        <div className="container">
          <ToolsStrip />
        </div>
      </section>

      {/* 10 — Objections, after desire. */}
      <section className="section-light">
        <div className="container">
          <Faq />
        </div>
      </section>

      {/* 11 — Close. Booking first, form as fallback. */}
      <CtaBand />
    </>
  );
}
