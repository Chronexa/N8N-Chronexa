import Link from 'next/link';
import { site } from '../../lib/site';
import s from './home.module.css';

export default function HomeFooter() {
  return <footer className={s.footer}>
    <div className={s.wrap}>
      <div className={s.footerTop}><div><Link href="/" className={s.footerBrand}>Chronexa<span>↗</span></Link><p>Your AI-native technology partner.<br />Built on expertise. Powered by possibility.</p><a href={`mailto:${site.email}`}>{site.email}</a></div>
        <div><h2>Expertise</h2><Link href="/ai-workspace-setup">AI workspaces & enablement</Link><Link href="/custom-software-development">Software & SaaS development</Link><Link href="/ai-automation">AI agents & automation</Link><Link href="/ai-voice-agent-development">AI voice agents</Link><Link href="/ecommerce-development">Shopify & e-commerce</Link><Link href="/ui-ux-design-services">UX & product design</Link><Link href="/dedicated-ai-engineers">Dedicated AI engineers</Link></div>
        <div><h2>Explore</h2><Link href="/case-studies">Case studies</Link><Link href="/n8n-portfolio">Workflow portfolio</Link><Link href="/ai-engines">AI engines</Link><Link href="/blog">Insights</Link><Link href="/about">About Chronexa</Link><Link href="/contact">Contact</Link></div>
        <div><h2>Connect</h2><a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={site.socials.twitter} target="_blank" rel="noopener noreferrer">X / Twitter ↗</a><p>Based in India.<br />Working with US and<br />global businesses.</p></div>
      </div>
      <div className={s.footerBottom}><span>© 2026 Chronexa Intelligence Private Limited</span><Link href="/privacy">Privacy policy</Link><span>Human expertise. AI-native execution.</span></div>
    </div>
  </footer>;
}
