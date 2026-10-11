'use client';

import { useState } from 'react';
import s from './integration.module.css';

const systems = [
  { name: 'CRM', detail: 'Customer and pipeline context', mode: 'READ + WRITE' },
  { name: 'Finance', detail: 'Invoices, payments and controls', mode: 'VALIDATED WRITE' },
  { name: 'Documents', detail: 'Contracts, PDFs and attachments', mode: 'READ + EXTRACT' },
  { name: 'Legacy', detail: 'Exports, databases or controlled UI', mode: 'BOUNDED ACCESS' },
] as const;

export default function IntegrationMap() {
  const [active, setActive] = useState(0);
  const system = systems[active];
  return <div className={s.map}>
    <div className={s.systemPicker} role="tablist" aria-label="Example connected systems">{systems.map((item, index) => <button type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} key={item.name}><i />{item.name}</button>)}</div>
    <div className={s.mapStage}>
      <div className={s.source}><span>SELECTED SYSTEM</span><strong>{system.name}</strong><p>{system.detail}</p><b>{system.mode}</b></div>
      <div className={s.path} aria-hidden="true"><i /><i /><i /></div>
      <div className={s.control}><span>CHRONEXA INTEGRATION LAYER</span><strong>Identity → validate → transform → act</strong><small>Idempotency · retries · conflict rules · audit log</small></div>
      <div className={s.path} aria-hidden="true"><i /><i /><i /></div>
      <div className={s.destination}><span>SYSTEM OF RECORD</span><strong>Accepted update</strong><p>or a named exception owner</p><b>NO SILENT FAILURE</b></div>
    </div>
    <div className={s.conflict}><span>CONFLICT RULE</span><p>Two systems changed the same customer record.</p><strong>Write paused → authoritative source checked → owner notified</strong><small>In your build, this rule follows your systems and who owns each record.</small></div>
  </div>;
}
