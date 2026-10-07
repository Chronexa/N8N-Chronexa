import Image from "next/image";
import Link from "next/link";
import type { PortfolioWorkflow } from "../../lib/portfolio-data";
import { ToolLogoRow } from "./ToolLogo";
import s from "./WorkflowCard.module.css";

/** Structure counted from the workflow file, passed in by the server. */
export type CardFacts = { nodes: number; connections: number; active: boolean };

export default function WorkflowCard({ workflow, facts }: { workflow: PortfolioWorkflow; facts: CardFacts }) {
  return (
    <Link href={`/n8n-portfolio/${workflow.slug}`} className={s.card}>
      <div className={s.cover}>
        <Image src={`/images/n8n-portfolio/${workflow.slug}.jpg`} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1040px) 50vw, 33vw" />
        {facts.active ? <span className={s.live}>Running now</span> : workflow.reference ? <span className={s.demo}>Reference architecture</span> : workflow.demo ? <span className={s.demo}>Demo build</span> : null}
        <span className={s.logos}><ToolLogoRow tools={workflow.tools} max={5} size={34} /></span>
      </div>
      <div className={s.body}>
        <p className={s.kicker}><span>{workflow.category}</span><span className={s[workflow.complexity]}>{workflow.complexity}</span></p>
        <h3>{workflow.title}</h3>
        <p>{workflow.tagline}</p>
        <p className={s.stat}><b>{workflow.stats[0]}</b><small>projected</small></p>
        <dl className={s.meta}>
          <div><dt>Starts</dt><dd>{workflow.trigger}</dd></div>
          <div><dt>Size</dt><dd>{facts.nodes} nodes · {facts.connections} links</dd></div>
        </dl>
        <span className={s.open}>See how it works <b aria-hidden="true">→</b></span>
      </div>
    </Link>
  );
}
