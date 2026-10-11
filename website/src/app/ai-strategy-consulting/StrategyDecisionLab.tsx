'use client';

import { useMemo, useState } from 'react';
import s from './strategy.module.css';

const examples = [
  { label: 'Client reporting', volume: 9, effort: 8, readiness: 9, risk: 3 },
  { label: 'Contract preparation', volume: 6, effort: 8, readiness: 6, risk: 7 },
  { label: 'Website chatbot', volume: 4, effort: 3, readiness: 5, risk: 5 },
] as const;

export default function StrategyDecisionLab() {
  const [volume, setVolume] = useState(7);
  const [effort, setEffort] = useState(7);
  const [readiness, setReadiness] = useState(6);
  const [risk, setRisk] = useState(4);
  const [picked, setPicked] = useState<string | null>(null);

  const result = useMemo(() => {
    const value = volume * 4 + effort * 3 + readiness * 3 - risk * 2;
    if (value >= 65 && readiness >= 6 && risk <= 6) return { label: 'BUILD FIRST', note: 'High recurring value with enough evidence for a bounded production test.', band: 'build' };
    if (value >= 44) return { label: 'PILOT', note: 'Worth testing, but the first scope should reduce the largest uncertainty.', band: 'pilot' };
    return { label: 'DEFER', note: 'Fix the process, evidence or ownership before committing build budget.', band: 'defer' };
  }, [volume, effort, readiness, risk]);

  const apply = (item: (typeof examples)[number]) => {
    setVolume(item.volume); setEffort(item.effort); setReadiness(item.readiness); setRisk(item.risk); setPicked(item.label);
  };

  return (
    <div className={s.lab}>
      <div className={s.exampleTabs} aria-label="Example AI opportunities">
        {examples.map((item) => <button key={item.label} type="button" aria-pressed={picked === item.label} onClick={() => apply(item)}>{item.label}</button>)}
      </div>
      <div className={s.controls}>
        <label>Recurring volume <strong>{volume}/10</strong><input type="range" min="1" max="10" value={volume} onChange={(event) => { setVolume(Number(event.target.value)); setPicked(null); }} /></label>
        <label>Human effort today <strong>{effort}/10</strong><input type="range" min="1" max="10" value={effort} onChange={(event) => { setEffort(Number(event.target.value)); setPicked(null); }} /></label>
        <label>Data readiness <strong>{readiness}/10</strong><input type="range" min="1" max="10" value={readiness} onChange={(event) => { setReadiness(Number(event.target.value)); setPicked(null); }} /></label>
        <label>Decision risk <strong>{risk}/10</strong><input type="range" min="1" max="10" value={risk} onChange={(event) => { setRisk(Number(event.target.value)); setPicked(null); }} /></label>
      </div>
      <div className={`${s.labResult} ${s[result.band]}`} aria-live="polite">
        <span>PLANNING SIGNAL</span><strong>{result.label}</strong><p>{result.note}</p><small>In discovery, these sliders are replaced by your volumes, samples and owners.</small>
      </div>
    </div>
  );
}
