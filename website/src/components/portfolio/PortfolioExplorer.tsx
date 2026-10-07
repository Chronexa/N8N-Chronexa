"use client";

import { useMemo, useState } from "react";
import { GOALS, type GoalId, type PortfolioWorkflow } from "../../lib/portfolio-data";
import WorkflowCard, { type CardFacts } from "./WorkflowCard";
import s from "./PortfolioExplorer.module.css";

type Item = { workflow: PortfolioWorkflow; facts: CardFacts };

/** Discovery: pick a goal, narrow by industry, or search. */
export default function PortfolioExplorer({ items }: { items: Item[] }) {
  const [goal, setGoal] = useState<GoalId | "all">("all");
  const [industry, setIndustry] = useState("all");
  const [query, setQuery] = useState("");

  const industries = useMemo(
    () => [...new Set(items.flatMap((item) => item.workflow.industries))].sort((a, b) => (a === "Any business" ? -1 : b === "Any business" ? 1 : a.localeCompare(b))),
    [items],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(({ workflow }) => {
      if (goal !== "all" && workflow.goal !== goal) return false;
      if (industry !== "all" && !workflow.industries.includes(industry) && !workflow.industries.includes("Any business")) return false;
      if (!needle) return true;
      return [workflow.title, workflow.tagline, workflow.summary, workflow.category, ...workflow.tools, ...workflow.tags, ...workflow.industries]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [items, goal, industry, query]);

  const count = (id: GoalId) => items.filter((item) => item.workflow.goal === id).length;

  return (
    <div>
      <div className={s.goals} role="group" aria-label="What do you want to fix?">
        {GOALS.map((option) => (
          <button key={option.id} type="button" aria-pressed={goal === option.id} className={s.goal} onClick={() => setGoal(goal === option.id ? "all" : option.id)}>
            <strong>{option.label}</strong>
            <span>{option.hint}</span>
            <b>{count(option.id)} workflow{count(option.id) === 1 ? "" : "s"}</b>
          </button>
        ))}
      </div>

      <div className={s.bar}>
        <label className={s.search}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by tool, task or industry" aria-label="Search workflows" />
        </label>
        <label className={s.select}>
          <span>Industry</span>
          <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
            <option value="all">All industries</option>
            {industries.filter((name) => name !== "Any business").map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <p className={s.result} aria-live="polite">
          {visible.length} of {items.length} workflows
          {goal !== "all" || industry !== "all" || query ? (
            <button type="button" onClick={() => { setGoal("all"); setIndustry("all"); setQuery(""); }}>Clear</button>
          ) : null}
        </p>
      </div>

      {visible.length ? (
        <div className={s.grid}>
          {visible.map((item) => <WorkflowCard key={item.workflow.slug} workflow={item.workflow} facts={item.facts} />)}
        </div>
      ) : (
        <p className={s.empty}>Nothing matches that yet. Tell us the process and we&apos;ll show you what the workflow would look like.</p>
      )}
    </div>
  );
}
