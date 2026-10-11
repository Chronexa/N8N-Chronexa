'use client';
import { useState } from 'react';
import { calculateVoiceRoi, type VoiceRoiInputs } from '../../lib/voice-roi';
import s from './voice.module.css';
const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const defaults: VoiceRoiInputs = { calls: 1200, minutes: 3, minuteRate: .13, setup: 6000, support: 500, bookingValue: 200, margin: 40, currentCompletion: 20, targetCompletion: 25, capacity: 40, avoidedCash: 0 };
const fields: { key: keyof VoiceRoiInputs; label: string; step?: number; max?: number }[] = [
  { key: 'calls', label: 'Calls per month', step: 100 },
  { key: 'minutes', label: 'Minutes per call', step: .5 },
  { key: 'bookingValue', label: 'Revenue per completed appointment ($)' },
  { key: 'margin', label: 'Contribution margin after service costs (%)', max: 100 },
  { key: 'currentCompletion', label: 'Current completed appointments / all calls (%)', max: 100 },
  { key: 'targetCompletion', label: 'Planned completed appointments / all calls (%)', max: 100 },
  { key: 'capacity', label: 'Capacity for additional appointments / month' },
  { key: 'minuteRate', label: 'All-in provider and telephony cost ($ / min)', step: .01 },
  { key: 'setup', label: 'One-time implementation budget ($)', step: 500 },
  { key: 'support', label: 'Monthly support and other platform costs ($)', step: 50 },
  { key: 'avoidedCash', label: 'Actual monthly spending you can stop ($)', step: 100 },
];
export default function VoiceRoi() {
  const [input, setInput] = useState(defaults);
  const [hourly, setHourly] = useState(19);
  const [serviceRate, setServiceRate] = useState(2);
  const result = calculateVoiceRoi(input);
  const field = ({ key, label, step = 1, max }: typeof fields[number]) => <label key={key}>{label}<input type="number" min={0} max={max} step={step} value={input[key]} onChange={e => setInput(v => ({ ...v, [key]: Math.min(max ?? Infinity, Math.max(0, Number(e.target.value))) }))} /></label>;
  return <div className={s.roi}>
    <p>Start with your call logs and available appointment capacity. These editable defaults illustrate the calculation; they are not quoted prices or promised results.</p>
    <div className={s.roiInputs}>{fields.slice(0, 4).map(field)}</div>
    <details open><summary>Business assumptions and full implementation costs</summary><div className={s.roiInputs}>{fields.slice(4).map(field)}
      <label>Receptionist hourly wage ($)<input type="number" min={0} value={hourly} onChange={e => setHourly(Math.max(0, +e.target.value))} /></label>
      <label>Answering service cost per call ($)<input type="number" min={0} step={.1} value={serviceRate} onChange={e => setServiceRate(Math.max(0, +e.target.value))} /></label>
    </div></details>
    <p className={s.swipeHint}>Swipe to compare costs →</p>
    <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Scrollable monthly cost comparison">
      <table className={s.roiTable}><caption>Monthly planning costs — these services cover different responsibilities</caption><thead><tr><th scope="col">Cost basis</th><th scope="col">Full-time receptionist</th><th scope="col">Answering service</th><th scope="col">AI voice system</th></tr></thead><tbody>
        <tr><th scope="row">Recurring cost</th><td>{usd(hourly * 173 * 1.3)}</td><td>{usd(input.calls * serviceRate)}</td><td>{usd(result.monthlyCost)}</td></tr>
        <tr><th scope="row">What this includes</th><td>173 hours + 30% payroll allowance</td><td>{input.calls.toLocaleString()} calls at your rate</td><td>{usd(result.usage)} usage + {usd(input.support)} support/platform costs</td></tr>
        <tr><th scope="row">One-time implementation</th><td>Recruitment and training extra</td><td>Check provider quote</td><td>{usd(input.setup)}</td></tr>
        <tr><th scope="row">Coverage and scope</th><td>Staffed hours; calls and in-person work</td><td>Provider plan and agreed call handling</td><td>Configured call workflows; human fallback required</td></tr>
      </tbody></table>
    </div>
    <div className={s.roiSum} aria-live="polite">
      <div><b>{usd(result.monthlyNet)}</b><span>estimated monthly net benefit after recurring costs</span></div>
      <div><b>{usd(result.firstYearNet)}</b><span>estimated first-year net benefit, including implementation</span></div>
      <div><b>{result.paybackMonths === null ? 'No payback' : `${result.paybackMonths.toFixed(1)} months`}</b><span>estimated implementation payback at these assumptions</span></div>
    </div>
    <p className={s.roiNote}>{result.additionalCompleted.toLocaleString('en-US', { maximumFractionDigits: 1 })} additional completed appointments × {usd(input.bookingValue)} × {input.margin}% contribution margin = {usd(result.contribution)} monthly contribution. Add only spending you can actually stop, then subtract usage and support. Staff cost is not automatically counted as savings. Completion rates include eligibility, attendance and cancellations; added appointments are capped by your capacity. Check total usage pricing with <a href="https://www.retellai.com/pricing" target="_blank" rel="noreferrer">Retell</a> or your chosen provider. Implementation and ongoing support are scoped and quoted individually.</p>
  </div>;
}
