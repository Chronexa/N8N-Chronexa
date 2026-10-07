"use client";

import { useState } from "react";
import type { RoiModel } from "../../lib/portfolio-data";
import s from "./RoiCalculator.module.css";

const HOURS_PER_FTE = 1800; // working hours in a year for one full-time person
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const num = (n: number, digits = 0) => n.toLocaleString("en-US", { maximumFractionDigits: digits });

type Field = { key: string; label: string; max?: number };

const FIELDS: Record<RoiModel["model"], Field[]> = {
  time: [
    { key: "perMonth", label: "" },
    { key: "minutes", label: "Minutes each, done by hand" },
    { key: "hourly", label: "Hourly cost of that person ($)" },
    { key: "share", label: "Share of the work automated (%)", max: 100 },
  ],
  roas: [
    { key: "spend", label: "Monthly ad spend ($)" },
    { key: "roas", label: "Current ROAS (revenue ÷ spend)" },
    { key: "lift", label: "ROAS improvement (%)" },
  ],
  recovery: [
    { key: "leads", label: "Leads per month" },
    { key: "lostPct", label: "Leads lost without a safety net (%)", max: 100 },
    { key: "valuePerLead", label: "Average value of a lead ($)" },
  ],
};

/** Projected ROI with the working shown. Defaults are hypothetical; every input is editable. */
export default function RoiCalculator({ roi }: { roi: RoiModel }) {
  const [values, setValues] = useState<Record<string, number>>({ ...roi, hourly: 40, build: 0 } as unknown as Record<string, number>);
  const v = (key: string) => values[key] ?? 0;
  const set = (key: string, max?: number) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: Math.max(0, Math.min(max ?? Infinity, Number(event.target.value) || 0)) }));

  const runAnnual = v("runCost") * 12;
  let gross = 0;
  let working = "";
  let headline = "";
  let hours = 0;
  if (roi.model === "time") {
    hours = (v("perMonth") * v("minutes") * 12 * (v("share") / 100)) / 60;
    gross = hours * v("hourly");
    working = `${num(v("perMonth"))} ${roi.unit} × ${num(v("minutes"), 1)} min × 12 months × ${num(v("share"))}% ÷ 60 = ${num(hours)} hours a year × $${num(v("hourly"))}/hour = ${usd(gross)}`;
    headline = `${num(hours)} hours back per year`;
  } else if (roi.model === "roas") {
    gross = v("spend") * 12 * v("roas") * (v("lift") / 100);
    working = `$${num(v("spend"))} spend × 12 months × ${num(v("roas"), 2)} ROAS × ${num(v("lift"))}% improvement = ${usd(gross)} extra revenue a year`;
    headline = `${usd(gross)} extra ad revenue per year`;
  } else {
    const recoveredPct = Math.max(0, v("lostPct") - 0.1); // the workflow targets 99.9% capture
    const recovered = v("leads") * 12 * (recoveredPct / 100);
    gross = recovered * v("valuePerLead");
    working = `${num(v("leads"))} leads × 12 months × (${num(v("lostPct"), 1)}% lost − 0.1% still missed) = ${num(recovered)} leads recovered × $${num(v("valuePerLead"))} = ${usd(gross)}`;
    headline = `${num(recovered)} leads recovered per year`;
  }
  const net = gross - runAnnual;
  const multiple = runAnnual > 0 ? gross / runAnnual : 0;
  const build = v("build");
  const payback = build > 0 && net > 0 ? build / (net / 12) : 0;
  const firstYear = build > 0 ? ((net - build) / build) * 100 : 0;

  const fields = FIELDS[roi.model].map((field) =>
    field.key === "perMonth" && roi.model === "time" ? { ...field, label: `${roi.unit[0].toUpperCase()}${roi.unit.slice(1)} per month` } : field,
  );

  return (
    <div className={s.calculator}>
      <div className={s.inputs}>
        {fields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            <input type="number" min="0" max={field.max} step="any" inputMode="decimal" value={v(field.key)} onChange={set(field.key, field.max)} />
          </label>
        ))}
        <label>
          <span>Running cost per month — APIs, hosting ($)</span>
          <input type="number" min="0" step="any" inputMode="decimal" value={v("runCost")} onChange={set("runCost")} />
        </label>
        <label>
          <span>One-time build cost ($) — optional, for payback</span>
          <input type="number" min="0" step="any" inputMode="decimal" value={v("build") || ""} placeholder="Your quote" onChange={set("build")} />
        </label>
      </div>
      <div className={s.result} aria-live="polite">
        <span>Projected net value per year</span>
        <strong>{usd(net)}</strong>
        <b>{headline}</b>
        <dl className={s.breakdown}>
          {roi.model === "time" ? <div><dt>Full-time equivalent freed</dt><dd>{num(hours / HOURS_PER_FTE, 1)} people</dd></div> : null}
          <div><dt>Gross value</dt><dd>{usd(gross)}</dd></div>
          <div><dt>Running cost</dt><dd>−{usd(runAnnual)}</dd></div>
          {multiple > 0 ? <div><dt>Return per $1 of running cost</dt><dd>${num(multiple, 1)}</dd></div> : null}
          {payback > 0 ? <div><dt>Payback on the build</dt><dd>{num(payback, 1)} months</dd></div> : null}
          {build > 0 ? <div><dt>First-year ROI</dt><dd>{num(firstYear)}%</dd></div> : null}
        </dl>
      </div>
      <p className={s.working}><b>The math:</b> {working}. Net value = gross value − {usd(runAnnual)} running cost a year.</p>
    </div>
  );
}
