'use client';

import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import ScrollDepth from '../../components/ScrollDepth';
import HeroSection from '../../components/startup/HeroSection';
import LeverageLineConcept from '../../components/startup/LeverageLineConcept';
import LeverageDiagnostic from '../../components/startup/LeverageDiagnostic';
import GrowthEngine from '../../components/startup/GrowthEngine';
import WhyThisHappens from '../../components/startup/WhyThisHappens';
import TheShift from '../../components/startup/TheShift';
import MethodSection from '../../components/startup/MethodSection';
import ImplementationRoadmap from '../../components/startup/ImplementationRoadmap';
import EvidenceSection from '../../components/startup/EvidenceSection';
import FAQAccordion from '../../components/startup/FAQAccordion';
import FinalCTASection from '../../components/startup/FinalCTASection';

/**
 * AI Growth Systems for Startups — restructured 2026-07-30 against the
 * homepage's own argument logic, after the page kept reading as a theory
 * lecture rather than a sales page.
 *
 * Two inversions, both borrowed from the homepage rebuild's reasoning:
 *
 *   • THE PRODUCT MOVED UP, from 7th to 4th. The old order ran hero →
 *     framework → diagnostic → three more conceptual sections (why it happens,
 *     the shift, life above the line) before showing anything we actually
 *     build. A founder who has just computed their own ratio is at peak intent
 *     and was handed more theory. GrowthEngine now lands immediately after the
 *     diagnostic: "here is what 'a system instead of a hire' actually is,
 *     running on your tools." Same fix the homepage made moving proof 8th → 3rd.
 *
 *   • LIFEABOVELINE WAS CUT, not moved. Its five outcome cards (Revenue,
 *     Runway, Execution Speed, Hiring Discipline, CX at Scale) were the same
 *     five outcomes TheShift already argues as a Headcount-vs-Systems
 *     comparison table — the identical argument twice, in two formats. The
 *     table survives because contrast persuades harder than a benefits list.
 *     (The file is left in place, unimported, in case that call is wrong.)
 *
 * The page also had no tonal variation — every band was light or muted, which
 * is why it read as flat no matter how the type was tuned. GrowthEngine is the
 * one dark section, placed at the emphatic beat, exactly as the homepage uses
 * .section-dark for its EngineShowcase.
 */
export default function StartupGrowthPage() {
  return (
    <div className="reveal-ready">
      <ScrollDepth pageType="startup-landing" />
      <Nav />
      <main id="main">
        {/* 1 — Recognition, credential, the real stack, and the form. */}
        <HeroSection />

        {/* 2 — Name the pattern. */}
        <LeverageLineConcept />

        {/* 3 — Make it theirs: their two numbers, their ratio, their tax. */}
        <LeverageDiagnostic />

        {/* 4 — The answer, at peak intent. The page's one dark band: their
               stack on both ends, a model doing the middle, a human gate, and
               a readout denominated in headcount. */}
        <section className="section-dark section-major section-live">
          <div className="container">
            <GrowthEngine />
          </div>
        </section>

        {/* 5 — Why it persisted. Placed after the fix, so the page never runs
               two conceptual sections back to back. */}
        <WhyThisHappens />

        {/* 6 — Two ways to scale, by outcome. */}
        <TheShift />

        {/* 7 — How we'd approach it, then what actually happens if you say yes. */}
        <MethodSection />
        <ImplementationRoadmap />

        {/* 8 — Honest proof: sourced research, no invented client results. */}
        <EvidenceSection />

        {/* 9 — Objections, after desire. */}
        <FAQAccordion />

        {/* 10 — One clear ask. */}
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
