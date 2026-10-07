import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import N8nEmbed from "../../../components/portfolio/N8nEmbed";
import RoiCalculator from "../../../components/portfolio/RoiCalculator";
import ToolLogo from "../../../components/portfolio/ToolLogo";
import WorkflowCard from "../../../components/portfolio/WorkflowCard";
import { loadWorkflow, minimap, workflowFacts, type WorkflowFacts } from "../../../lib/portfolio-canvas";
import { systemById, workflowBySlug, workflows } from "../../../lib/portfolio-data";
import { founders, site } from "../../../lib/site";
import st from "../../../styles/studio.module.css";
import c from "./workflow.module.css";

const AUTHOR = founders.find((founder) => founder.name === "Ankit Dhiman")!;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workflows.map((workflow) => ({ slug: workflow.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = workflowBySlug(slug);
  if (!workflow) return {};
  return {
    title: `${workflow.title}: n8n Workflow`,
    description: `${workflow.tagline} A real n8n workflow on n8n's own canvas: what it does, how it runs, and how it handles failure.`.slice(0, 158),
    alternates: { canonical: `/n8n-portfolio/${workflow.slug}` },
    openGraph: { title: workflow.title, description: workflow.tagline, url: `/n8n-portfolio/${workflow.slug}`, images: [{ url: `/images/n8n-portfolio/${workflow.slug}.jpg`, width: 1200, height: 800 }] },
  };
}

/** Controls every Chronexa build ships with, on top of what the canvas shows. */
const STANDARD_CONTROLS = [
  "Schema validation before downstream writes",
  "Retry and error routes for external API failures",
  "Duplicate-safe processing and idempotent updates",
  "Human approval where the action carries business risk",
  "Execution logging for support and audit review",
];

const IMPLEMENTATION = [
  ["Discover", "map the current process, systems, volumes, owners and exceptions."],
  ["Design", "define the canonical data model, approvals, retries and system boundaries."],
  ["Build", "implement credentials, nodes, validation and observable error routes."],
  ["Prove", "run controlled data through success, duplicate and failure scenarios."],
  ["Operate", "publish runbooks, ownership and measurable service levels."],
];

/** Failure handling, stated only where the workflow file shows it. */
function safeguards(facts: WorkflowFacts) {
  const one = (count: number, singular: string, plural: string) => (count === 1 ? singular : plural);
  return [
    facts.retries && { stat: String(facts.retries), text: `${one(facts.retries, "node retries", "nodes retry")} automatically when an external API fails.` },
    facts.errorBranches && { stat: String(facts.errorBranches), text: `${one(facts.errorBranches, "node has its own", "nodes have their own")} error branch, so a failure is routed and handled, not just logged.` },
    facts.decisions && { stat: String(facts.decisions), text: `${one(facts.decisions, "decision point (IF or Switch) checks", "decision points (IF or Switch) check")} the data before it moves on.` },
    facts.hasErrorWorkflow && { stat: "✓", text: "Anything unhandled triggers our central error workflow, so a crash gets reported instead of failing silently." },
  ].filter(Boolean) as Array<{ stat: string; text: string }>;
}

export default async function WorkflowPage({ params }: Props) {
  const { slug } = await params;
  const workflow = workflowBySlug(slug);
  if (!workflow) notFound();

  const file = loadWorkflow(slug);
  const facts = workflowFacts(file);
  const system = systemById(workflow.system);
  const guards = safeguards(facts);
  const related = workflows
    .filter((item) => item.system === workflow.system && item.slug !== slug)
    .slice(0, 3)
    .map((item) => {
      const itemFacts = workflowFacts(loadWorkflow(item.slug));
      return { workflow: item, facts: { nodes: itemFacts.nodes, connections: itemFacts.connections, active: itemFacts.active } };
    });

  // Sections are numbered in the order they render; optional ones may be absent.
  const sections = ["why", "what", "how", ...(workflow.human ? ["human"] : []), "tools", "failure", "impact", "roi", "build"];
  const proofLabel = workflow.reference ? "Reference architecture" : workflow.system === "clients" ? (workflow.demo ? "Client pilot" : "Client build") : workflow.slug.startsWith("blog-agent-") ? "Chronexa operating system" : "Production workflow";
  const pageUrl = `${site.url}/n8n-portfolio/${workflow.slug}`;
  const n = (id: string) => String(sections.indexOf(id) + 1).padStart(2, "0");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: workflow.title,
    description: workflow.summary,
    url: `${site.url}/n8n-portfolio/${workflow.slug}`,
    author: { "@type": "Person", name: AUTHOR.name, jobTitle: AUTHOR.role, worksFor: { "@type": "Organization", name: "Chronexa", url: site.url } },
    keywords: ["n8n", ...workflow.tools].join(", "),
  };

  return (
    <div className={st.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className={c.hero}>
        <div className={c.heroTop}>
          <div>
            <Link href="/n8n-portfolio" className={c.back}>← All workflows</Link>
            <p className={st.eyebrow}><i />{system.title.toUpperCase()} {system.em.toUpperCase()}</p>
            <h1>{workflow.title}</h1>
            <p className={c.tagline}>{workflow.tagline}</p>
          </div>
          <dl className={c.facts}>
            <div><dt>Starts</dt><dd>{workflow.trigger}</dd></div>
            <div><dt>Size</dt><dd>{facts.nodes} nodes · {facts.connections} connections</dd></div>
            <div><dt>Tools</dt><dd className={c.toolIcons}>{workflow.tools.map((tool) => <ToolLogo key={tool} name={tool} size={30} />)}</dd></div>
            <div><dt>Category</dt><dd>{workflow.category} · <span className={c.cap}>{workflow.complexity}</span></dd></div>
            <div>
              <dt>Status</dt>
              <dd>{facts.active ? <span className={c.live}>Running on our n8n</span> : workflow.reference ? "Reference architecture" : workflow.demo ? "Demo build" : "Built and run, currently paused"}</dd>
            </div>
          </dl>
        </div>
        <div className={c.canvas}>
          <N8nEmbed workflowJson={JSON.stringify(file)} fileName={`${workflow.slug}.json`} active={facts.active} map={minimap(file)} tall />
          <p className={c.canvasNote}>
            {workflow.reference
              ? <>Drawn by n8n&apos;s own canvas from the reference workflow file. Click it to pan and zoom.</>
              : <>Drawn by n8n&apos;s own canvas from the workflow file, synced {file.syncedAt}. Click it to pan and zoom. Node settings, credentials, prompts and IDs are removed; names, layout and wiring are exactly as built.</>}
          </p>
        </div>
      </section>

      <div className={c.body}>
        <aside className={c.rail}>
          <div className={c.author}>
            <Image src={AUTHOR.image} alt="" width={44} height={44} />
            <div>
              <span>Built by</span>
              <strong>{AUTHOR.name}</strong>
              <small>{AUTHOR.role}, Chronexa</small>
            </div>
          </div>
          {AUTHOR.linkedin ? (
            <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer" className={c.railLink}>Connect on LinkedIn ↗</a>
          ) : null}
          <dl className={c.railFacts}>
            <div><dt>Proof basis</dt><dd>{proofLabel}</dd></div>
            <div><dt>Category</dt><dd>{workflow.category}</dd></div>
            <div><dt>Complexity</dt><dd className={c.cap}>{workflow.complexity}</dd></div>
            <div><dt>Workflow size</dt><dd>{facts.nodes} nodes</dd></div>
          </dl>
          <nav className={c.toc} aria-label="On this page">
            <span>1 · The problem</span>
            <a href="#why">Why teams need this</a>
            <span>2 · How it works</span>
            <a href="#what">What it does</a>
            <a href="#how">Step by step</a>
            {workflow.human ? <a href="#human">Where a person stays in</a> : null}
            <a href="#tools">Tools and apps</a>
            <a href="#failure">When something breaks</a>
            <span>3 · The impact</span>
            <a href="#impact">Projected impact</a>
            <a href="#roi">ROI calculation</a>
            <a href="#build">How we&apos;d build yours</a>
          </nav>
          <Link href="/contact" className={c.railCta}>Build one like this <span aria-hidden="true">→</span></Link>
          <p className={c.share}>
            <span>Share</span>
            <a href={`mailto:?subject=${encodeURIComponent(workflow.title)}&body=${encodeURIComponent(pageUrl)}`}>Email</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </aside>

        <article className={c.article}>
          <p className={c.act}><b>Part 1</b> The problem<span>Why teams need this</span></p>

          <section id="why">
            <p className={st.eyebrow}><i />{n("why")} · THE PROBLEM</p>
            <blockquote className={c.why}>{workflow.why}</blockquote>
          </section>

          <p className={c.act}><b>Part 2</b> How it works<span>What it does, step by step</span></p>

          <section id="what">
            <p className={st.eyebrow}><i />{n("what")} · WHAT IT DOES</p>
            <p className={c.lead}>{workflow.summary}</p>
          </section>

          <section id="how">
            <p className={st.eyebrow}><i />{n("how")} · HOW IT RUNS</p>
            <h2>Step by step, <em>as built.</em></h2>
            <ol className={c.steps}>
              {workflow.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {workflow.human ? (
            <section id="human">
              <p className={st.eyebrow}><i />{n("human")} · WHERE A PERSON STAYS IN</p>
              <div className={st.proof}>
                <h3>The machine drafts. <em className={c.em}>A person decides.</em></h3>
                <p>{workflow.human}</p>
              </div>
            </section>
          ) : null}

          <section id="tools">
            <p className={st.eyebrow}><i />{n("tools")} · TOOLS AND APPS</p>
            <h2>Built around the systems <em>already in the process.</em></h2>
            <div className={c.tools}>
              {workflow.tools.map((tool, index) => (
                <div key={tool}>
                  <ToolLogo name={tool} size={44} />
                  <div>
                    <strong>{tool}</strong>
                    <small>{index === 0 ? "Trigger or source" : index === workflow.tools.length - 1 ? "Destination or delivery" : "Processing and orchestration"}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="failure">
            <p className={st.eyebrow}><i />{n("failure")} · WHEN SOMETHING BREAKS</p>
            <h2>Failure is <em>designed in.</em></h2>
            {guards.length ? (
              <ul className={c.guards}>
                {guards.map((guard) => (
                  <li key={guard.text}><b>{guard.stat}</b><span>{guard.text}</span></li>
                ))}
              </ul>
            ) : null}
            <h3 className={c.subhead}>Standard on every build</h3>
            <ul className={c.controls}>
              {STANDARD_CONTROLS.map((control) => <li key={control}><span aria-hidden="true">✓</span>{control}</li>)}
            </ul>
          </section>

          <p className={c.act}><b>Part 3</b> The impact<span>What it&apos;s worth, and how we&apos;d build yours</span></p>

          <section id="impact">
            <p className={st.eyebrow}><i />{n("impact")} · PROJECTED IMPACT</p>
            <h2>What it should <em>change in the business.</em></h2>
            <div className={c.impact}>
              {workflow.stats.map((stat, index) => (
                <div key={stat}><span>0{index + 1}</span><strong>{stat}</strong><small>Projected</small></div>
              ))}
            </div>
            <p className={c.sectionIntro}>Projections for a typical deployment. The calculation below shows the math, and you can put in your own numbers.</p>
          </section>

          <section id="roi">
            <p className={st.eyebrow}><i />{n("roi")} · ROI CALCULATION</p>
            <h2>How it pays back <em>in your business.</em></h2>
            <p className={c.sectionIntro}>
              The starting numbers are a hypothetical deployment sized to the projections above. Change any of them to your own
              volumes and costs, and the math updates underneath.
            </p>
            <RoiCalculator roi={workflow.roi} />
          </section>

          <section id="build">
            <p className={st.eyebrow}><i />{n("build")} · HOW WE&apos;D BUILD YOURS</p>
            <h2>How we&apos;d build <em>yours.</em></h2>
            <ol className={c.implementation}>
              {IMPLEMENTATION.map(([step, text]) => <li key={step}><b>{step}:</b> {text}</li>)}
            </ol>
          </section>
        </article>
      </div>

      {related.length ? (
        <section className={`${st.band} ${st.sunken}`}>
          <div className={st.sectionHead}>
            <div>
              <p className={st.eyebrow}><i />SAME SYSTEM</p>
              <h2>{system.title} <em>{system.em}</em></h2>
            </div>
            <p>{system.summary}</p>
          </div>
          <div className={c.related}>
            {related.map((item) => <WorkflowCard key={item.workflow.slug} workflow={item.workflow} facts={item.facts} />)}
          </div>
        </section>
      ) : null}

      <section className={`${st.close} ${c.close}`}>
        <div>
          <p className={st.eyebrow}><i />YOUR VERSION</p>
          <h2>Want this, <em>wired to your tools?</em></h2>
        </div>
        <div>
          <p>Tell us what the process looks like today: the systems, the volumes, the step everyone hates. We&apos;ll come back with the n8n version and where a person stays in charge.</p>
          <Link href="/contact" className={st.primary}>Start a project <span aria-hidden="true">→</span></Link>
          <Link href="/n8n-portfolio" className={`${st.ghost} ${c.closeBack}`}>Back to all workflows</Link>
        </div>
      </section>
    </div>
  );
}
