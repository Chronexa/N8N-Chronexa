'use client';

import { useId, useState } from 'react';
import type { ServiceExperience, ServiceScenario } from '../lib/service-experiences';
import { track } from '../lib/analytics';
import s from './ServiceExplorer.module.css';

export default function ServiceExplorer({ experience: e, slug }: { experience: ServiceExperience; slug: string }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  if (e.mode === 'estimate') return <WorkloadEstimate slug={slug} />;
  const scenario = e.scenarios[selected];
  const choose = (index: number) => {
    setSelected(index);
    track('service_example_change', { slug, example: e.scenarios[index].label });
  };
  const architecture = ['deployment', 'integration', 'legacy', 'agent'].includes(e.mode);
  const document = ['document', 'invoice', 'record', 'knowledge'].includes(e.mode);

  return (
    <div className={`${s.explorer} ${architecture ? s.architecture : ''}`} data-service-explorer={e.mode}>
      <div className={s.toolbar}><span>{e.mode === 'priority' ? 'Decision guide' : 'Interactive example'}</span><span>Illustrative · No live systems</span></div>
      <fieldset className={s.choices}>
        <legend className={s.srOnly}>{e.question}</legend>
        {e.scenarios.map((item, index) => <button type="button" key={item.label} aria-pressed={index === selected} aria-controls={`${id}-result`} onClick={() => choose(index)}>{item.label}</button>)}
      </fieldset>
      <div id={`${id}-result`} className={`${s.canvas} ${document ? s.document : ''}`} aria-live="polite" aria-atomic="true">
        <div className={s.input}>
          <span className={s.label}>{e.mode === 'knowledge' ? 'Source material' : architecture ? 'Starting conditions' : 'Example input'}</span>
          <ExampleInput mode={e.mode} scenario={scenario} selected={selected} />
        </div>
        <div className={s.route}>
          <ol className={e.mode === 'timeline' ? s.timeline : undefined}>
            {scenario.stages.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}
          </ol>
          <div className={s.result}><span className={s.label}>{e.mode === 'priority' ? 'Where to start' : 'Result'}</span><strong>{scenario.result}</strong></div>
          {e.mode === 'knowledge' && selected === 0 && <details className={s.citation}><summary>Inspect source [1]</summary><blockquote>“Travel expenses must be submitted within 30 days.”</blockquote><p>Example policy · Section 4 · Fictional demonstration</p></details>}
        </div>
      </div>
      <p className={s.explanation}>{scenario.reason}</p>
    </div>
  );
}

function ExampleInput({ mode, scenario, selected }: { mode: ServiceExperience['mode']; scenario: ServiceScenario; selected: number }) {
  if (mode === 'invoice') return <><p className={s.documentTitle}>INV-042</p><dl className={s.fieldList}><div><dt>Purchase order</dt><dd>$2,400</dd></div><div><dt>Invoice</dt><dd>{selected === 1 ? '$2,640' : '$2,400'}</dd></div><div className={selected > 0 ? s.flagged : ''}><dt>{selected === 2 ? 'Record check' : 'Difference'}</dt><dd>{selected === 2 ? 'Already recorded' : selected === 1 ? '+$240' : '$0'}</dd></div></dl><p className={s.smallPrint}>Example supplier · Approval still required</p></>;
  if (mode === 'document') return <><p className={s.documentTitle}>Inspection form</p><dl className={s.fieldList}><div className={selected === 1 ? s.flagged : ''}><dt>Property reference</dt><dd>{selected === 1 ? 'P-10?2' : 'P-1042'}</dd></div><div><dt>Inspection date</dt><dd>12 Sep 2026</dd></div><div><dt>Reference check</dt><dd>{selected === 1 ? 'Needs confirmation' : 'Complete'}</dd></div></dl><p className={s.smallPrint}>Illustrative source · Page 1</p></>;
  if (mode === 'record') return <><p>{scenario.input}</p><dl className={s.fieldList}><div><dt>Sales owns</dt><dd>Account owner</dd></div><div><dt>Accounting owns</dt><dd>Payment status</dd></div><div><dt>Sync rule</dt><dd>Respect field owner</dd></div></dl></>;
  if (mode === 'deployment') return <div className={s.boundaryMap}><div><span className={s.label}>Your infrastructure</span><p>Identity → Application → Documents</p>{selected !== 0 && <p className={s.modelNode}>Model inference</p>}</div>{selected === 0 && <div className={s.externalBoundary}><span aria-hidden="true">↓</span><p>Approved model endpoint</p><small>May sit outside your network</small></div>}</div>;
  if (mode === 'agent') return <><p>{scenario.input}</p><dl className={s.permissions}><div><dt>Read approved sources</dt><dd>Allowed</dd></div><div><dt>Change a contract</dt><dd>Blocked</dd></div></dl></>;
  if (mode === 'ticket') return <><blockquote className={s.request}>{scenario.input}</blockquote><dl className={s.fieldList}><div><dt>Decision</dt><dd>{['Allowed routine task', 'Billing team review', 'Verify identity first'][selected]}</dd></div></dl></>;
  return <p>{scenario.input}</p>;
}

function WorkloadEstimate({ slug }: { slug: string }) {
  const id = useId();
  const [engaged, setEngaged] = useState(false);
  const [volume, setVolume] = useState(500);
  const [minutes, setMinutes] = useState(8);
  const [review, setReview] = useState(3);
  const current = volume * minutes / 60;
  const remaining = volume * review / 60;
  const difference = current - remaining;
  return (
    <div className={s.explorer} data-service-explorer="estimate">
      <div className={s.toolbar}><span>Workload estimate</span><span>Your assumptions · No signup</span></div>
      <div className={s.estimate}>
        <fieldset className={s.inputs} onChange={() => { if (!engaged) { setEngaged(true); track('service_estimate_used', { slug }); } }}><legend>Model one recurring task</legend>
          <label htmlFor={`${id}-volume`}>Items each month <output>{volume.toLocaleString('en-US')}</output></label>
          <input id={`${id}-volume`} type="range" min="0" max="5000" step="50" value={volume} onChange={event => setVolume(Number(event.target.value))} />
          <label htmlFor={`${id}-minutes`}>Minutes per item today <output>{minutes}</output></label>
          <input id={`${id}-minutes`} type="range" min="1" max="30" value={minutes} onChange={event => setMinutes(Number(event.target.value))} />
          <label htmlFor={`${id}-review`}>Expected minutes after automation <output>{review}</output></label>
          <input id={`${id}-review`} type="range" min="0" max="30" value={review} onChange={event => setReview(Number(event.target.value))} />
        </fieldset>
        <div className={s.estimateResult} aria-live="polite">
          <span className={s.label}>{difference < 0 ? 'Additional work each month' : 'Potential capacity each month'}</span>
          <strong>{Math.abs(difference).toFixed(1)}<small>hours</small></strong>
          <div className={s.bar}><span style={{ width: `${current / Math.max(current, remaining, 1) * 100}%` }} /></div><p>Today: {current.toFixed(1)} hours</p>
          <div className={`${s.bar} ${s.after}`}><span style={{ width: `${remaining / Math.max(current, remaining, 1) * 100}%` }} /></div><p>After: {remaining.toFixed(1)} hours</p>
        </div>
      </div>
      <p className={s.explanation}>Monthly items × (minutes today − minutes after) ÷ 60. This is a capacity estimate based on your inputs, not a forecast. Build costs, software costs and exception handling need separate assessment.</p>
    </div>
  );
}
