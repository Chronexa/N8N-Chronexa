import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioFooter, PortfolioHeader } from "../../../components/portfolio/PortfolioChrome";
import RoiCalculator from "../../../components/portfolio/RoiCalculator";
import WorkflowCanvas from "../../../components/portfolio/WorkflowCanvas";
import { getWorkflowDetail } from "../../../lib/portfolio-detail";
import { workflows } from "../../../lib/portfolio-data";
import { site, founders } from "../../../lib/site";
import s from "./workflow.module.css";

/** The author for all portfolio workflows */
const AUTHOR = founders.find((f) => f.name === "Ankit Dhiman")!;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workflows.map((workflow) => ({ slug: workflow.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = workflows.find((item) => item.slug === slug);
  if (!workflow) return {};
  return {
    title: `${workflow.title} | n8n Workflow Portfolio`,
    description: `${workflow.subtitle}. See what it does, how it works, tools used, operating controls and an illustrative ROI model.`,
    alternates: { canonical: `/portfolio/${workflow.slug}` },
    openGraph: {
      title: workflow.title,
      description: workflow.description,
      url: `/portfolio/${workflow.slug}`,
      images: [{ url: workflow.previewImage }],
    },
  };
}

import fs from "node:fs";
import path from "node:path";
import type { PublicWorkflow } from "../../../components/portfolio/WorkflowCanvas";

export default async function WorkflowPage({ params }: Props) {
  const { slug } = await params;
  const workflow = workflows.find((item) => item.slug === slug);
  if (!workflow) notFound();
  
  // Attempt to load the real n8n workflow JSON if it exists
  let workflowJson: PublicWorkflow | null = null;
  try {
    const fileName = workflow.jsonFile || `${slug}.json`;
    const jsonPath = path.join(process.cwd(), "src", "data", "portfolio-workflows", fileName);
    if (fs.existsSync(jsonPath)) {
      workflowJson = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as PublicWorkflow;
    }
  } catch (e) {
    console.error("Failed to load workflow JSON:", e);
  }

  const detail = getWorkflowDetail(workflow);
  const related = workflows.filter((item) => item.slug !== slug && item.category === workflow.category).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: workflow.title,
    description: workflow.description,
    url: `${site.url}/portfolio/${workflow.slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      jobTitle: AUTHOR.role,
      image: `${site.url}${AUTHOR.image}`,
      worksFor: { "@type": "Organization", name: "Chronexa", url: site.url },
      ...(AUTHOR.linkedin ? { sameAs: [AUTHOR.linkedin] } : {}),
    },
    creator: { "@type": "Organization", name: "Chronexa", url: site.url },
    keywords: workflow.tags.join(", "),
  };

  return (
    <div className={s.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PortfolioHeader />

      <section className={s.hero}>
        <div className={s.heroGlow} aria-hidden="true" />
        <div className={s.heroCopy}>
          <Link href="/portfolio" className={s.back}>← Back to workflows</Link>
          <div className={s.iconRow} aria-label="Key tools">
            {workflow.integrations.slice(0, 4).map((tool) => <span key={tool}>{tool.slice(0, 2)}</span>)}
            {workflow.integrations.length > 4 ? <i>+{workflow.integrations.length - 4}</i> : null}
          </div>
          <h1>{workflow.title}</h1>
          <p>{workflow.subtitle}</p>
          <Link href="/contact" className={s.primaryCta}>Build a workflow like this <span>→</span></Link>
        </div>
        <WorkflowCanvas 
          title={workflow.title} 
          integrations={workflow.integrations}
          n8nJson={workflowJson} 
        />
      </section>

      <div className={s.contentLayout}>
        <aside className={s.metaRail}>
          {/* Author card — real person */}
          <div className={s.author}>
            <Image
              src={AUTHOR.image}
              alt={AUTHOR.name}
              width={42}
              height={42}
              className={s.authorAvatar}
            />
            <div>
              <span>Built by</span>
              <strong>{AUTHOR.name}</strong>
              <small>{AUTHOR.role} · Chronexa</small>
            </div>
          </div>
          {AUTHOR.linkedin && (
            <a
              href={AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={s.authorLinkedin}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          )}

          <dl>
            <div><dt>Proof basis</dt><dd><i />{detail.proofLabel}</dd></div>
            <div><dt>Category</dt><dd>{workflow.category}</dd></div>
            <div><dt>Complexity</dt><dd>{workflow.complexity}</dd></div>
            <div><dt>Workflow size</dt><dd>{workflow.nodeCount} nodes</dd></div>
          </dl>

          <div className={s.share}>
            <span>Share</span>
            <a href={`mailto:?subject=${encodeURIComponent(workflow.title)}&body=${encodeURIComponent(`${site.url}/portfolio/${workflow.slug}`)}`}>Email</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/portfolio/${workflow.slug}`)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </aside>

        <article className={s.article}>
          <section>
            <p className={s.eyebrow}>How it works</p>
            <h2>A production workflow, not a happy-path demo.</h2>
            <p className={s.lead}>{workflow.description}</p>
          </section>

          <section>
            <p className={s.eyebrow}>What it does</p>
            <h2>From source event to controlled outcome</h2>
            <div className={s.stages}>
              {detail.stages.map((stage) => <div className={s.stage} key={stage.number}><span>{stage.number}</span><div><h3>{stage.title}</h3><p>{stage.text}</p></div></div>)}
            </div>
          </section>

          <section className={s.why}>
            <div><p className={s.eyebrow}>Why this workflow exists</p><h2>Automation should remove an operating constraint.</h2></div>
            <p>{detail.why}</p>
          </section>

          <section>
            <p className={s.eyebrow}>ROI model</p>
            <h2>Model the capacity before making the business case.</h2>
            <p className={s.sectionIntro}>Change the operating assumptions below to estimate the annual labour capacity this workflow could return.</p>
            <RoiCalculator theme={detail.roiTheme} />
            <div className={s.outcomes}>
              {workflow.stats.map((stat, index) => <div key={stat}><span>0{index + 1}</span><strong>{stat}</strong><small>{workflow.id.startsWith("showcase-") ? "Design target" : "Workflow measure"}</small></div>)}
            </div>
          </section>

          <section>
            <p className={s.eyebrow}>Tools and apps</p>
            <h2>Built around the systems already in the process.</h2>
            <div className={s.tools}>{workflow.integrations.map((tool, index) => <div key={tool}><span>{tool.slice(0, 2)}</span><div><strong>{tool}</strong><small>{index === 0 ? "Trigger or source" : index === workflow.integrations.length - 1 ? "Destination or delivery" : "Processing and orchestration"}</small></div></div>)}</div>
          </section>

          <section>
            <p className={s.eyebrow}>Production controls</p>
            <h2>Failure is designed into the workflow.</h2>
            <div className={s.controls}>{detail.controls.map((control) => <div key={control}><span>✓</span>{control}</div>)}</div>
          </section>

          <section className={s.implementation}>
            <p className={s.eyebrow}>Implementation path</p>
            <h2>How this moves from map to production</h2>
            <ol><li><b>Discover:</b> map the current process, systems, volumes, owners and exceptions.</li><li><b>Design:</b> define the canonical data model, approvals, retries and system boundaries.</li><li><b>Build:</b> implement credentials, nodes, validation and observable error routes.</li><li><b>Prove:</b> run controlled data through success, duplicate and failure scenarios.</li><li><b>Operate:</b> publish runbooks, ownership and measurable service levels.</li></ol>
          </section>
        </article>
      </div>

      {related.length ? <section className={s.related}><p className={s.eyebrow}>More {workflow.category} workflows</p><div className={s.relatedGrid}>{related.map((item) => <Link href={`/portfolio/${item.slug}`} key={item.slug}><div className={s.relatedImage}><Image src={item.previewImage} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div><span>{item.title}</span><small>{item.nodeCount} nodes · {item.complexity}</small></Link>)}</div></section> : null}

      <section className={s.cta}><p>Have a workflow like this?</p><h2>Show us the process.<br />We will map the production path.</h2><Link href="/contact">Start a project <span>→</span></Link></section>
      <PortfolioFooter />
    </div>
  );
}
