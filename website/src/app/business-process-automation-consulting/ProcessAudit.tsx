'use client';

import { useState } from 'react';
import s from './ProcessAudit.module.css';

const PROCESSES = [
  {
    tab: 'Reconciliation',
    title: 'Orders, invoices and payments are compared every morning',
    verdict: 'Strong build candidate',
    tone: 'build',
    checks: [
      ['Repeatable trigger', 'Every weekday at 08:00'],
      ['Digital inputs', 'ERP, bank feed and billing system'],
      ['Rule boundary', 'Exact, tolerance and duplicate checks'],
      ['Exception owner', 'Finance reviews mismatches only'],
    ],
    automate: 'Collect the records, match them, explain mismatches and open a review item with the evidence attached.',
    keep: 'Finance decides whether a mismatch is acceptable and owns any write-off.',
  },
  {
    tab: 'Approval queue',
    title: 'Requests arrive by email and nobody knows who has the decision',
    verdict: 'Automate the route, not the judgement',
    tone: 'assist',
    checks: [
      ['Repeatable trigger', 'A complete request is submitted'],
      ['Digital inputs', 'Form, policy and budget record'],
      ['Rule boundary', 'Authority and completeness are explicit'],
      ['Exception owner', 'Named approver for policy exceptions'],
    ],
    automate: 'Check completeness, find the right approver, chase the decision and write the result back.',
    keep: 'The approver decides whether the exception is worth taking.',
  },
  {
    tab: 'Client onboarding',
    title: 'The same details are copied into five systems after every sale',
    verdict: 'Strong build candidate',
    tone: 'build',
    checks: [
      ['Repeatable trigger', 'A deal becomes signed'],
      ['Digital inputs', 'CRM, contract and intake form'],
      ['Rule boundary', 'Required fields differ by service'],
      ['Exception owner', 'Operations handles missing or conflicting data'],
    ],
    automate: 'Create the workspace, project, billing record and checklist from one accepted client record.',
    keep: 'Operations resolves identity conflicts and unusual commercial terms.',
  },
  {
    tab: 'Pricing exception',
    title: 'A senior person weighs relationship risk, timing and commercial context',
    verdict: 'Support the decision',
    tone: 'human',
    checks: [
      ['Repeatable trigger', 'Yes'],
      ['Digital inputs', 'Only partly'],
      ['Rule boundary', 'Changes with commercial context'],
      ['Exception owner', 'The decision-maker is the process'],
    ],
    automate: 'Assemble the account history, margin, precedent and deadline into a decision brief.',
    keep: 'The commercial owner makes the call. Automating the final decision would remove the useful part.',
  },
] as const;

export default function ProcessAudit() {
  const [active, setActive] = useState(0);
  const item = PROCESSES[active];

  return (
    <div className={s.audit}>
      <div className={s.bar}><span>PROCESS AUDIT</span><span>ILLUSTRATIVE · PICK ONE</span></div>
      <div className={s.tabs} role="tablist" aria-label="Example business processes">
        {PROCESSES.map((process, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="process-audit-panel"
            id={`process-audit-tab-${index}`}
            key={process.tab}
            onClick={() => setActive(index)}
          >
            {process.tab}
          </button>
        ))}
      </div>
      <div className={s.panel} id="process-audit-panel" role="tabpanel" aria-labelledby={`process-audit-tab-${active}`}>
        <p className={s.kicker}>THE WORK AS IT EXISTS</p>
        <h2>{item.title}</h2>
        <div className={s.checks}>
          {item.checks.map(([label, value]) => (
            <div key={label}><span>{label}</span><b>{value}</b></div>
          ))}
        </div>
        <p className={`${s.verdict} ${s[item.tone]}`}><span />{item.verdict}</p>
        <div className={s.split}>
          <div><span>AUTOMATE</span><p>{item.automate}</p></div>
          <div><span>KEEP HUMAN</span><p>{item.keep}</p></div>
        </div>
      </div>
    </div>
  );
}
