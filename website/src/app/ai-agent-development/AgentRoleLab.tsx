'use client';

import { useState } from 'react';
import s from './agent.module.css';

const roles = [
  { name: 'Research analyst', job: 'Prepare a cited account brief', knowledge: 'Approved sources + CRM', tools: 'Search · CRM · Docs', boundary: 'Cannot contact the account', test: 'Evidence coverage ≥ 90%' },
  { name: 'Document reviewer', job: 'Check a file against policy', knowledge: 'Policies + prior decisions', tools: 'Drive · OCR · Case system', boundary: 'Cannot approve an exception', test: 'Escalates every high-risk gap' },
  { name: 'Ops coordinator', job: 'Prepare and route the next action', knowledge: 'Runbooks + live records', tools: 'Inbox · ERP · Tasks', boundary: 'Cannot change a financial record', test: 'Correct owner and complete context' },
] as const;

export default function AgentRoleLab() {
  const [active, setActive] = useState(0);
  const role = roles[active];
  return <div className={s.roleLab}>
    <div className={s.roleTabs} role="tablist" aria-label="Example agent jobs">{roles.map((item, index) => <button key={item.name} role="tab" aria-selected={index === active} type="button" onClick={() => setActive(index)}>{String(index + 1).padStart(2, '0')} / {item.name}</button>)}</div>
    <div className={s.roleBody}>
      <div className={s.jobCard}><span>ACCOUNTABLE JOB</span><strong>{role.job}</strong><p>The finish line is observable. The agent does not receive a vague instruction to “help the team.”</p></div>
      <ol><li><span>KNOWLEDGE</span><strong>{role.knowledge}</strong></li><li><span>TOOLS</span><strong>{role.tools}</strong></li><li><span>HARD BOUNDARY</span><strong>{role.boundary}</strong></li><li><span>RELEASE TEST</span><strong>{role.test}</strong></li></ol>
      <div className={s.trace}><span>AGENT TRACE</span><p><i>01</i> Retrieved the current policy and account record.</p><p><i>02</i> Compared the request with three acceptance rules.</p><p><i>03</i> Found one unresolved exception.</p><strong>STOPPED FOR HUMAN REVIEW</strong></div>
    </div>
  </div>;
}
