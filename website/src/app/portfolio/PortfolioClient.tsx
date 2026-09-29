"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { workflows, type WorkflowCategory } from "../../lib/portfolio-data";
import PortfolioHero from "../../components/portfolio/PortfolioHero";
import CategoryFilter from "../../components/portfolio/CategoryFilter";
import WorkflowCard from "../../components/portfolio/WorkflowCard";
import { PortfolioFooter, PortfolioHeader } from "../../components/portfolio/PortfolioChrome";
import ScrollDepth from "../../components/ScrollDepth";
import s from "./portfolio.module.css";

export default function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState<
    WorkflowCategory | "All"
  >("All");
  const [query, setQuery] = useState("");

  /* Filter + sort: featured first, then by node count (most complex first) */
  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? workflows
        : workflows.filter((w) => w.category === activeCategory);

    const needle = query.trim().toLowerCase();
    const base = needle
      ? byCategory.filter((workflow) =>
          [
            workflow.title,
            workflow.subtitle,
            workflow.description,
            ...workflow.integrations,
            ...workflow.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
      : byCategory;

    return [...base].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.nodeCount - a.nodeCount;
    });
  }, [activeCategory, query]);

  return (
    <div className={s.page}>
      <ScrollDepth pageType="portfolio" />

      <PortfolioHeader />

      <PortfolioHero query={query} onQueryChange={setQuery} />

      <section className={s.gridSection} aria-labelledby="workflow-library-title">
        <div className={s.sectionHeading}>
          <div>
            <p>Production library</p>
            <h2 id="workflow-library-title">Automation systems we have built</h2>
          </div>
          <span>{filtered.length} workflow{filtered.length === 1 ? "" : "s"}</span>
        </div>
        <CategoryFilter
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {filtered.length > 0 ? (
          <div className={s.grid}>
            {filtered.map((wf) => (
              <WorkflowCard
                key={wf.id}
                workflow={wf}
              />
            ))}
          </div>
        ) : (
          <div className={s.empty}>
            No workflows found for this category.
          </div>
        )}
      </section>

      <section className={s.cta}>
        <div className={s.ctaStars} aria-hidden="true" />
        <p>Need a workflow that is not here?</p>
        <h2>Bring us the process your team<br />never wants to do again.</h2>
        <Link href="/contact">Build my automation <span aria-hidden="true">→</span></Link>
      </section>

      <PortfolioFooter />
    </div>
  );
}
