import type { Metadata } from "next";
import Link from "next/link";
import N8nEmbed from "../../components/portfolio/N8nEmbed";
import PortfolioExplorer from "../../components/portfolio/PortfolioExplorer";
import ToolLogo from "../../components/portfolio/ToolLogo";
import { canonicalTool } from "../../lib/tool-logos";
import ScrollDepth from "../../components/ScrollDepth";
import { loadWorkflow, minimap, workflowFacts } from "../../lib/portfolio-canvas";
import { SYSTEMS, workflows } from "../../lib/portfolio-data";
import st from "../../styles/studio.module.css";
import c from "./portfolio.module.css";

export const metadata: Metadata = {
  title: "n8n Automation Portfolio | Workflows, Walkthroughs & ROI",
  description:
    "18 n8n workflows and AI automations by Chronexa — outbound, lead capture, content, legal, CPA, insurance and support — each with projected ROI.",
  alternates: { canonical: "/n8n-portfolio" },
  openGraph: {
    title: "n8n Workflow Portfolio | Chronexa",
    description: "Production n8n workflows and reference architectures, each on n8n's own canvas with projected ROI.",
    url: "/n8n-portfolio",
  },
};

const FEATURED = "autonomous-outbound-engine";

export default function PortfolioPage() {
  const items = workflows.map((workflow) => {
    const facts = workflowFacts(loadWorkflow(workflow.slug));
    return { workflow, facts: { nodes: facts.nodes, connections: facts.connections, active: facts.active } };
  });
  const totals = {
    nodes: items.reduce((sum, item) => sum + item.facts.nodes, 0),
    connections: items.reduce((sum, item) => sum + item.facts.connections, 0),
    running: items.filter((item) => item.facts.active).length,
  };
  const featured = loadWorkflow(FEATURED);
  // Every tool used across the portfolio, most-used first. Generic plumbing is left out.
  const toolCounts = new Map<string, number>();
  for (const workflow of workflows) {
    for (const tool of new Set(workflow.tools.map(canonicalTool))) toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
  }
  const tools = [...toolCounts.entries()].filter(([tool]) => !["Webhook", "n8n"].includes(tool)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <div className={st.page}>
      <ScrollDepth pageType="portfolio" />

      <section className={`${st.hero} ${c.hero}`}>
        <div>
          <p className={st.eyebrow}><i />N8N WORKFLOW PORTFOLIO</p>
          <h1>The workflows behind <em>the work nobody wants to do.</em></h1>
          <p className={st.heroCopy}>
            {workflows.length}{" "}n8n automations we&apos;ve designed and built: systems we&apos;ve delivered for clients, the ones that run
            our own sales, leads and content, and reference builds for legal, accounting, insurance and investment teams. Open any of them and you&apos;ll
            see the real workflow, how it runs, and what it could be worth to you.
          </p>
          <div className={st.heroActions}>
            <a href="#find" className={st.primary}>Find a workflow for my team <span aria-hidden="true">↓</span></a>
            <Link href="/contact" className={st.ghost}>Or tell us your process<span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className={c.heroCanvas}>
          <N8nEmbed workflowJson={JSON.stringify(featured)} fileName="autonomous-outbound-engine.json" active={featured.active} map={minimap(featured)} />
          <Link href={`/n8n-portfolio/${FEATURED}`} className={c.heroCaption}>
            Live: our Autonomous Outbound Engine, {workflowFacts(featured).nodes} nodes. Click the canvas to explore it. <b>See how it works →</b>
          </Link>
        </div>
      </section>

      <div className={st.strip}>
        <span>COUNTED FROM THE <b>WORKFLOW FILES</b></span>
        <span><b>{workflows.length}</b> workflows</span>
        <span><b>{totals.nodes}</b> nodes</span>
        <span><b>{totals.connections}</b> connections</span>
        <span><b>{totals.running}</b> running now</span>
      </div>

      <section className={`${st.band} ${c.stack}`} aria-label="Tools these workflows connect">
        <div className={c.stackHead}>
          <div>
            <p className={st.eyebrow}><i />THE STACK</p>
            <h2>Wired into the tools <em>your team already uses.</em></h2>
          </div>
          <p>{tools.length} apps across these workflows. If it has an API, we can connect it to n8n.</p>
        </div>
        <ul className={c.stackGrid}>
          {tools.map(([tool, count]) => (
            <li key={tool}>
              <ToolLogo name={tool} size={44} />
              <span><strong>{tool}</strong><small>{count} workflow{count === 1 ? "" : "s"}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${st.band} ${c.journey}`} aria-label="How to use this portfolio">
        {[
          ["01", "Find it", "Start from what you want to fix, not from a tool name. Filter by goal or industry."],
          ["02", "Understand it", "Every page opens the real workflow on n8n's canvas, then walks through it step by step, in plain English."],
          ["03", "Price the impact", "Projected results, and an ROI calculator you can run with your own volumes and costs."],
        ].map(([number, title, text]) => (
          <div key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>
        ))}
      </section>

      <section id="find" className={`${st.band} ${st.sunken} ${c.find}`}>
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />01 · FIND IT</p>
            <h2>What do you want <em>to fix first?</em></h2>
          </div>
          <p>Pick a goal to narrow the list, or search for the tool your team already uses.</p>
        </div>
        <PortfolioExplorer items={items} />
      </section>

      <section className={`${st.band} ${c.systems}`}>
        <div className={st.sectionHead}>
          <div>
            <p className={st.eyebrow}><i />HOW THEY FIT TOGETHER</p>
            <h2>Workflows work best <em>as systems.</em></h2>
          </div>
          <p>Most of these run alongside each other. Here&apos;s how they group, and what each group does as a whole.</p>
        </div>
        <div className={c.systemList}>
          {SYSTEMS.map((system) => {
            const members = workflows.filter((workflow) => workflow.system === system.id);
            return (
              <article key={system.id}>
                <h3>{system.title} <em>{system.em}</em></h3>
                <p>{system.summary}</p>
                <ul>
                  {members.map((workflow) => <li key={workflow.slug}><Link href={`/n8n-portfolio/${workflow.slug}`}>{workflow.title}</Link></li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`${st.close} ${c.close}`}>
        <div>
          <p className={st.eyebrow}><i />YOUR PROCESS NEXT</p>
          <h2>Show us the process your team <em>never wants to do again.</em></h2>
        </div>
        <div>
          <p>
            Every workflow here started as a job someone was doing by hand. Tell us the one that eats your week. We&apos;ll come
            back with what the n8n version looks like, where a person stays in charge, and what it should pay back.
          </p>
          <Link href="/contact" className={st.primary}>Start a project <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
