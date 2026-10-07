'use client';

import { useState } from 'react';
import s from './voice.module.css';

/**
 * Receptionist vs answering service vs AI voice agent, monthly.
 * Assumptions (sources linked on the page):
 *  - Receptionist: $19.00/h (BLS, healthcare receptionists, May 2025) × 173 h/month × 1.3 planning load for payroll costs; covers ~45 of 168 weekly hours.
 *  - Answering service: a user-editable $2.00/call planning assumption; typically takes a message rather than completing the workflow.
 *  - AI voice agent: $0.13/min planning configuration within Retell's published $0.07–$0.31/min range. Build and support quoted separately.
 *  - 30% of calls arrive outside staffed hours; 20% of in-hours calls are missed when the desk is busy (dental studies: 20–38%).
 *  - 40% of calls are bookable.
 */
const HUMAN_MONTHLY = 19 * 173 * 1.3;
const AFTER_HOURS = 0.3;
const BUSY_MISS = 0.2;
const HUMAN_COMPLETION = 0.85;
const SERVICE_COMPLETION = 0.45;
const AI_COMPLETION = 0.85;
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const pct = (n: number) => Math.round(n * 100) + '%';

export default function VoiceRoi() {
  const [calls, setCalls] = useState(1200);
  const [minutes, setMinutes] = useState(3);
  const [value, setValue] = useState(200);
  const [bookable, setBookable] = useState(40);

  const rows = [
    { name: 'Receptionist (1 full-time)', cost: HUMAN_MONTHLY, answered: (1 - AFTER_HOURS) * (1 - BUSY_MISS), hours: '~45 of 168', completion: HUMAN_COMPLETION },
    { name: 'Answering service', cost: calls * 2, answered: 0.95, hours: '24/7', completion: SERVICE_COMPLETION },
    { name: 'AI voice agent', cost: calls * minutes * 0.13, answered: 0.95, hours: '24/7 + concurrent', completion: AI_COMPLETION },
  ].map((r) => {
    const bookings = calls * r.answered * (bookable / 100) * r.completion;
    return { ...r, perCall: r.cost / calls, bookings, revenue: bookings * value };
  });
  const [human, , ai] = rows;
  const extraRevenue = ai.revenue - human.revenue;
  const saved = human.cost - ai.cost;

  return (
    <div className={s.roi}>
      <div className={s.roiInputs}>
        <label>Calls per month <b>{calls.toLocaleString('en-US')}</b>
          <input type="range" min={200} max={6000} step={100} value={calls} onChange={(e) => setCalls(+e.target.value)} /></label>
        <label>Average call length <b>{minutes} min</b>
          <input type="range" min={1} max={8} step={0.5} value={minutes} onChange={(e) => setMinutes(+e.target.value)} /></label>
        <label>Value of one booking <b>{usd(value)}</b>
          <input type="range" min={50} max={1500} step={25} value={value} onChange={(e) => setValue(+e.target.value)} /></label>
        <label>Calls that can become bookings <b>{bookable}%</b>
          <input type="range" min={10} max={80} step={5} value={bookable} onChange={(e) => setBookable(+e.target.value)} /></label>
      </div>

      <p className={s.swipeHint}>Swipe to compare all three options →</p>
      <div className={s.tableWrap} tabIndex={0} aria-label="Scrollable comparison of receptionist, answering service and AI voice agent">
        <table className={s.roiTable}>
          <thead><tr><th scope="col">Per month</th>{rows.map((r) => <th scope="col" key={r.name} className={r === ai ? s.us : ''}>{r.name}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Cost</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{usd(r.cost)}</td>)}</tr>
            <tr><th scope="row">Cost per call</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>${r.perCall.toFixed(2)}</td>)}</tr>
            <tr><th scope="row">Hours covered per week</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{r.hours}</td>)}</tr>
            <tr><th scope="row">Calls answered</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{pct(r.answered)}</td>)}</tr>
            <tr><th scope="row">Workflow completion rate</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{pct(r.completion)}</td>)}</tr>
            <tr><th scope="row">Bookings captured</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{Math.round(r.bookings).toLocaleString('en-US')}</td>)}</tr>
            <tr><th scope="row">Revenue from those bookings</th>{rows.map((r) => <td key={r.name} className={r === ai ? s.us : ''}>{usd(r.revenue)}</td>)}</tr>
          </tbody>
        </table>
      </div>

      <div className={s.roiSum}>
        <div><b>{usd(saved)}</b><span>lower monthly cost than a full-time receptionist</span></div>
        <div><b>{usd(extraRevenue)}</b><span>more booked revenue a month from calls that used to be missed</span></div>
        <div><b>{usd((saved + extraRevenue) * 12)}</b><span>a year, before your team’s time freed up</span></div>
      </div>
      <p className={s.roiNote}>
        Planning assumptions: receptionist at $19.00/hour (<a href="https://www.bls.gov/ooh/office-and-administrative-support/receptionists.htm" target="_blank" rel="noreferrer">US Bureau of Labor Statistics, healthcare, May 2025</a>) plus a 30% payroll-cost allowance;
        answering service at $2 per call; AI usage at $0.13/minute within <a href="https://www.retellai.com/pricing" target="_blank" rel="noreferrer">Retell’s published $0.07–$0.31 range</a>. We model 30% of calls after hours, 20% of staffed-hour calls missed at busy times,
        85% workflow completion for a receptionist and configured AI agent, and 45% for message-taking. Changeable inputs appear above. Provider usage only; our build and support are quoted separately. Illustrative, not a client result or savings guarantee.
      </p>
    </div>
  );
}
