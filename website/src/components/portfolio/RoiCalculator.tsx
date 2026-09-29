"use client";

import { useMemo, useState } from "react";
import s from "./RoiCalculator.module.css";

export default function RoiCalculator({ theme }: { theme: string }) {
  const [volume, setVolume] = useState(500);
  const [minutes, setMinutes] = useState(12);
  const [hourlyCost, setHourlyCost] = useState(45);
  const [automated, setAutomated] = useState(70);
  const result = useMemo(() => {
    const annualHours = (volume * minutes * 12) / 60;
    const savedHours = annualHours * (automated / 100);
    return { savedHours: Math.round(savedHours), value: Math.round(savedHours * hourlyCost) };
  }, [volume, minutes, hourlyCost, automated]);

  return (
    <div className={s.calculator}>
      <div className={s.inputs}>
        <label>Monthly items<input type="number" min="0" value={volume} onChange={(e) => setVolume(Number(e.target.value))} /></label>
        <label>Minutes per item<input type="number" min="0" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} /></label>
        <label>Loaded hourly cost ($)<input type="number" min="0" value={hourlyCost} onChange={(e) => setHourlyCost(Number(e.target.value))} /></label>
        <label>Work automated (%)<input type="number" min="0" max="100" value={automated} onChange={(e) => setAutomated(Math.min(100, Number(e.target.value)))} /></label>
      </div>
      <div className={s.result}>
        <span>Illustrative annual capacity returned</span>
        <strong>{result.savedHours.toLocaleString()} hours</strong>
        <b>${result.value.toLocaleString()} equivalent</b>
        <p>{theme}. This is a transparent capacity estimate, not a promised financial return.</p>
      </div>
    </div>
  );
}
