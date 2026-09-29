import Image from "next/image";
import Link from "next/link";
import type { PortfolioWorkflow } from "../../lib/portfolio-data";
import s from "./WorkflowCard.module.css";

interface Props {
  workflow: PortfolioWorkflow;
}

export default function WorkflowCard({ workflow }: Props) {
  const {
    title,
    subtitle,
    category,
    integrations,
    nodeCount,
    complexity,
    previewImage,
    featured,
  } = workflow;

  return (
    <article className={`${s.card} ${featured ? s.featured : ""}`}>
      <Link href={`/portfolio/${workflow.slug}`} className={s.cardLink} aria-label={`View ${title}`}>
      {/* Preview image */}
      <div className={s.imageWrap}>
        <Image
          src={previewImage}
          alt={`${title} workflow diagram`}
          fill
          sizes={featured ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          loading={featured ? "eager" : "lazy"}
          className={s.previewImg}
        />
        <span className={s.categoryBadge}>{category}</span>
      </div>

      {/* Body */}
      <div className={s.body}>
        {featured && <span className={s.featuredBadge}>Featured Build</span>}

        <h3 className={s.title}>{title}</h3>
        <p className={s.subtitle}>{subtitle}</p>

        {/* Integration tags */}
        <div className={s.integrations}>
          {integrations.slice(0, featured ? 6 : 4).map((int) => (
            <span key={int} className={s.integrationTag}>
              {int}
            </span>
          ))}
          {integrations.length > (featured ? 6 : 4) && (
            <span className={s.integrationTag}>
              +{integrations.length - (featured ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className={s.meta}>
          <span className={s.metaItem}>
            <span className={s.metaIcon} aria-hidden="true">⬡</span>
            {nodeCount} nodes
          </span>
          <span className={`${s.complexityBadge} ${s[complexity]}`}>
            {complexity}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className={s.viewPrompt} aria-hidden="true">
        <span className={s.viewLabel}>View Details →</span>
      </div>
      </Link>
    </article>
  );
}
