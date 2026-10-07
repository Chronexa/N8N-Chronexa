'use client';

import { useState } from 'react';
import BookButton from '../BookButton';
import s from './home.module.css';

/**
 * "What it's worth" — a three-input ROI estimate. Assumptions are stated under the result:
 * 60% of repeatable work automated, 46 working weeks, 1,800 hours per full-time person.
 * The free audit replaces these with the company's real numbers.
 */
const AUTOMATABLE = 0.6;
const WEEKS = 46;
const FTE_HOURS = 1800;

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${fmt(Math.round(n / 1000))}k`);

function Slider({ label, value, min, max, step, onChange, show }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; show: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className={s.slider}>
      <span className={s.sliderTop}><span>{label}</span><b>{show}</b></span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--p' as string]: `${pct}%` }}
      />
    </label>
  );
}

export default function RoiEstimator() {
  const [people, setPeople] = useState(25);
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(55);

  const hoursBack = people * hours * WEEKS * AUTOMATABLE;
  const value = hoursBack * rate;
  const fte = hoursBack / FTE_HOURS;

  return (
    <div className={s.roi}>
      <div className={s.roiInputs}>
        <Slider label="People doing repeatable work" value={people} min={1} max={300} step={1} onChange={setPeople} show={fmt(people)} />
        <Slider label="Hours each spends on it per week" value={hours} min={1} max={30} step={1} onChange={setHours} show={`${hours} h`} />
        <Slider label="Loaded cost per hour" value={rate} min={20} max={200} step={5} onChange={setRate} show={`$${rate}`} />
        <p className={s.roiNote}>Assumes 60% of that work is automated, across 46 working weeks. The free audit replaces every assumption here with your real numbers.</p>
      </div>
      <div className={s.roiOut} aria-live="polite">
        <div><b>{fmt(hoursBack)}</b><span>hours returned to your team each year</span></div>
        <div><b>{money(value)}</b><span>of capacity a year, at today’s cost</span></div>
        <div><b>{fte.toFixed(1)}</b><span>full-time people’s worth of work, without hiring</span></div>
        <BookButton location="home-roi" className={s.btnDark}>Get your real number</BookButton>
      </div>
    </div>
  );
}
