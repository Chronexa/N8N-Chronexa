"use client";

import { portfolioStats } from "../../lib/portfolio-data";
import s from "./PortfolioHero.module.css";

export default function PortfolioHero({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <section className={s.hero}>
      <div className={s.gridBg} aria-hidden="true" />

      <div className={`container ${s.content}`}>
        <h1 className={s.title}>
          {portfolioStats.workflowCount}+ Production n8n<br />
          <span className={s.titleAccent}>Workflow Automations</span>
        </h1>

        <p className={s.subtitle}>
          Explore AI agents and workflow automations engineered for sales,
          marketing, content, finance and operations.
        </p>
        <label className={s.search}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search workflows, apps, use cases..." />
          <kbd>⌘ K</kbd>
        </label>
        <div className={s.quickLinks}><span>Popular:</span><button onClick={() => onQueryChange("AI agent")}>AI agents</button><button onClick={() => onQueryChange("sales")}>Sales</button><button onClick={() => onQueryChange("document")}>Document processing</button></div>
      </div>
    </section>
  );
}
