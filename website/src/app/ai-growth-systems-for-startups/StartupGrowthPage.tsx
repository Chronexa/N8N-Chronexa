'use client';

import React from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import HeroSection from '../../components/startup/HeroSection';
import LeverageLineConcept from '../../components/startup/LeverageLineConcept';
import LeverageDiagnostic from '../../components/startup/LeverageDiagnostic';
import WhyThisHappens from '../../components/startup/WhyThisHappens';
import TheShift from '../../components/startup/TheShift';
import LifeAboveLine from '../../components/startup/LifeAboveLine';
import MethodSection from '../../components/startup/MethodSection';
import ImplementationRoadmap from '../../components/startup/ImplementationRoadmap';
import EvidenceSection from '../../components/startup/EvidenceSection';
import FAQAccordion from '../../components/startup/FAQAccordion';
import FinalCTASection from '../../components/startup/FinalCTASection';

export default function StartupGrowthPage() {
  return (
    <div className="reveal-ready">
      <Nav />
      <main id="main">
        {/* 1. Hero — Self-recognition, not value prop */}
        <HeroSection />

        {/* 2. The Leverage Line — Name the pattern */}
        <LeverageLineConcept />

        {/* 3. The Diagnostic — Personalize it with their own numbers */}
        <LeverageDiagnostic />

        {/* 4. Why This Happens — Empathy, not shame */}
        <WhyThisHappens />

        {/* 5. The Shift — Two ways to scale, by outcome */}
        <TheShift />

        {/* 6. Life Above the Line — Future vision in founder language */}
        <LifeAboveLine />

        {/* 7. How Chronexa Gets You There — Method, not badges */}
        <MethodSection />

        {/* 8. The Build — Process + pricing */}
        <ImplementationRoadmap />

        {/* 9. The Evidence — Honest proof */}
        <EvidenceSection />

        {/* 10. FAQ — Leverage Line vocabulary */}
        <FAQAccordion />

        {/* 11. Final CTA — One clear ask */}
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
