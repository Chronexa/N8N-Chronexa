'use client';
import { useState } from 'react';
import { track } from '../../lib/analytics';
import g from './growth.module.css';

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/** Capacity model: if manual work is the bottleneck, removing a share of it lets the same
 *  team serve proportionally more clients. Kept deliberately simple so a founder can check it. */
export default function RoiCalculator() {
  const [team, setTeam] = useState(10);
  const [clients, setClients] = useState(100);
  const [hours, setHours] = useState(6);
  const [share, setShare] = useState(50);
  const [rev, setRev] = useState(1500);
  const [touched, setTouched] = useState(false);

  const s = Math.min(Math.max(share, 0), 90) / 100;
  const freed = clients * hours * s;
  const capacity = Math.round(clients / (1 - s));
  const extra = capacity - clients;
  const unlocked = extra * rev * 12;
  const rpeNow = (clients * rev * 12) / Math.max(team, 1);
  const rpeAfter = (capacity * rev * 12) / Math.max(team, 1);

  const on = (set: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(Number(e.target.value) || 0);
    if (!touched) { setTouched(true); track('calculator_engage', { calculator: 'ai-roi' }); }
  };

  return (
    <div className={g.calc} aria-label="AI ROI calculator">
      <div className={g.cardBar}><i /><i /><i /><span>AI ROI CALCULATOR</span></div>
      <div className={g.calcGrid}>
        <label>People on the team<input type="number" min={1} value={team} onChange={on(setTeam)} /></label>
        <label>Clients served per month<input type="number" min={1} value={clients} onChange={on(setClients)} /></label>
        <label>Manual hours per client<input type="number" min={0} value={hours} onChange={on(setHours)} /></label>
        <label>Share we could automate (%)<input type="number" min={0} max={90} value={share} onChange={on(setShare)} /></label>
        <label style={{ gridColumn: '1/-1' }}>Revenue per client per month ($)<input type="number" min={0} value={rev} onChange={on(setRev)} /></label>
      </div>
      <div className={g.calcOut}>
        <div><b>{Math.round(freed).toLocaleString('en-US')} h</b><span>hours freed every month</span></div>
        <div><b>{clients} → {capacity}</b><span>clients the same team can serve</span></div>
        <div><b>{money(rpeNow)}</b><span>revenue per employee today</span></div>
        <div><b>{money(rpeAfter)}</b><span>revenue per employee after</span></div>
        <div className={g.big}><b>{money(unlocked)}</b><span>new annual revenue capacity, with the same {team} people</span></div>
      </div>
      <p className={g.cardFoot}>Assumes manual work is what limits how many clients you take on. The free audit checks that assumption against your real workflows.</p>
    </div>
  );
}
