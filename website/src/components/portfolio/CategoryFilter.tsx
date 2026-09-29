"use client";

import { CATEGORIES, workflows, type WorkflowCategory } from "../../lib/portfolio-data";
import s from "./CategoryFilter.module.css";

interface Props {
  active: WorkflowCategory | "All";
  onChange: (cat: WorkflowCategory | "All") => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  /* Count workflows per category for the badge */
  const counts = new Map<string, number>();
  for (const w of workflows) {
    counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
  }

  return (
    <div className={s.filterBar} role="tablist" aria-label="Filter by category">
      <button
        role="tab"
        aria-selected={active === "All"}
        className={`${s.pill} ${active === "All" ? s.pillActive : ""}`}
        onClick={() => onChange("All")}
      >
        All
        <span className={s.count}>{workflows.length}</span>
      </button>

      {CATEGORIES.map((cat) => {
        const count = counts.get(cat) ?? 0;
        if (count === 0) return null;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            className={`${s.pill} ${active === cat ? s.pillActive : ""}`}
            onClick={() => onChange(cat)}
          >
            {cat}
            <span className={s.count}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
