import Hero from '../components/Hero';
import LogoMarquee from '../components/LogoMarquee';
import Numbers from '../components/Numbers';
import PainPoints from '../components/PainPoints';
import MidPageCta from '../components/MidPageCta';
import PartnershipModel from '../components/PartnershipModel';
import Process from '../components/Process';
import Faq from '../components/Faq';
import WorkShipped from '../components/WorkShipped';
import CtaBand from '../components/CtaBand';
import ScrollDepth from '../components/ScrollDepth';

// Hidden — kept for spoke pages / future use
// import RoiGrid from '../components/RoiGrid';
// import ServiceShowcase from '../components/ServiceShowcase';

export default function Home() {
  return (
    <>
      <ScrollDepth pageType="home" />
      <Hero />

      {/* OAP badge + tech partners */}
      <LogoMarquee />

      {/* Stat bar */}
      <Numbers />

      {/* The problem — mid-page CTA sits right where a reader thinks
          "yes, that's my problem," instead of only at the very bottom. */}
      <section className="section-light">
        <div className="container">
          <PainPoints />
          <MidPageCta />
        </div>
      </section>

      {/* Our method — dark band, core identity statement */}
      <section className="section-dark">
        <div className="container">
          <PartnershipModel />
        </div>
      </section>

      {/* How the engagement runs */}
      <section className="section-light">
        <div className="container">
          <Process />
        </div>
      </section>

      {/* Objections */}
      <section className="section-muted">
        <div className="container">
          <Faq />
        </div>
      </section>

      {/* Client success stories — directly before the CTA */}
      <section id="case-studies" className="section-dark">
        <div className="container">
          <WorkShipped />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
