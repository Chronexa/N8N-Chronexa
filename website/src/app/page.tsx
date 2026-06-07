import Hero from '../components/Hero';
import LogoMarquee from '../components/LogoMarquee';
import QuestionTicker from '../components/QuestionTicker';
import PainPoints from '../components/PainPoints';
import ServiceShowcase from '../components/ServiceShowcase';
import Numbers from '../components/Numbers';
import Process from '../components/Process';
import WorkShipped from '../components/WorkShipped';
import Faq from '../components/Faq';
import CtaBand from '../components/CtaBand';

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <QuestionTicker />

      {/* The problem */}
      <section className="section-light">
        <div className="container">
          <PainPoints />
        </div>
      </section>

      {/* What we automate — recessed band so the white capability cards lift */}
      <section className="section-muted">
        <div className="container">
          <ServiceShowcase />
        </div>
      </section>

      {/* Proof in numbers (self-contained light band, dark stat cards) */}
      <Numbers />

      {/* How it works */}
      <section className="section-light">
        <div className="container">
          <Process />
        </div>
      </section>

      {/* Proof in case studies — the one internal dark accent band */}
      <section className="section-dark">
        <div className="container">
          <WorkShipped />
        </div>
      </section>

      {/* Objections */}
      <section className="section-muted">
        <div className="container">
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
