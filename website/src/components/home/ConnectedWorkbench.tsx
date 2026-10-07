'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import s from './home.module.css';

const runs = [
  {
    id: 'product', label: 'Build a product', category: 'PRODUCT & ENGINEERING',
    prompt: 'Build a customer portal around our existing data. Give us a working version to review.',
    context: ['Product requirements', 'Existing code & data', 'Design & coding standards'],
    tools: [['github.svg', 'GitHub'], ['postgresql.svg', 'Database'], ['openai.svg', 'Codex']],
    steps: ['Understand the codebase and plan the implementation', 'Build the interface, logic and integrations', 'Run checks and prepare a reviewable release'],
    output: 'Customer portal', outputType: 'PREVIEW / READY FOR REVIEW',
    files: ['Interface & user journeys', 'Application code', 'Tests & release notes'],
    decision: 'We review architecture, behavior and edge cases. You review the product before it goes live.',
    href: '/custom-software-development', link: 'Explore product engineering',
  },
  {
    id: 'marketing', label: 'Run marketing', category: 'CONTENT & CAMPAIGNS',
    prompt: 'Research this topic, prepare an article and campaign creative, and stage everything for review.',
    context: ['Brand voice & audience', 'Search & campaign data', 'Editorial standards'],
    tools: [['claude.svg', 'Claude'], ['googleanalytics.svg', 'Analytics'], ['n8n.svg', 'n8n']],
    steps: ['Research the topic and inspect the source material', 'Prepare the article, visuals and campaign drafts', 'Stage the work in the publishing and ad systems'],
    output: 'Campaign workspace', outputType: 'DRAFTS / READY FOR REVIEW',
    files: ['Researched article & sources', 'Creative & campaign brief', 'Staged publishing updates'],
    decision: 'We check the claims, creative and configuration. Publishing and ad spend wait for approval.',
    href: '/ai-workspace-setup', link: 'Explore connected AI workspaces',
  },
  {
    id: 'operations', label: 'Connect operations', category: 'WORKFLOWS & BUSINESS SYSTEMS',
    prompt: 'Connect new customer enquiries to our CRM, qualify them and prepare the next action.',
    context: ['Qualification criteria', 'CRM fields & sales stages', 'Follow-up & approval rules'],
    tools: [['gmail.svg', 'Email'], ['n8n.svg', 'n8n'], ['hubspot.png', 'HubSpot']],
    steps: ['Read the enquiry and collect the relevant context', 'Check the criteria and update the right records', 'Prepare a follow-up or route an exception to a person'],
    output: 'Connected lead workflow', outputType: 'WORKFLOW / READY FOR REVIEW',
    files: ['Connected systems', 'Tested routing & error paths', 'Follow-up review queue'],
    decision: 'We validate the routing and integrations. Your team sets which actions can run and which need review.',
    href: '/ai-automation', link: 'Explore AI workflow automation',
  },
] as const;

export default function ConnectedWorkbench() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const run = runs[active];

  return (
    <div className={s.workbench}>
      <div className={s.workbenchTop}>
        <div className={s.workbenchBrand}><span aria-hidden="true">c<span>×</span></span> THE CONNECTED WORKSPACE</div>
        <span className={s.illustrative}>ILLUSTRATIVE EXAMPLES</span>
      </div>
      <div className={s.workbenchTabs} role="tablist" aria-label="Explore how we work">
        {runs.map((item, index) => (
          <button key={item.id} id={`run-tab-${item.id}`} role="tab" type="button"
            ref={el => { buttons.current[index] = el; }}
            aria-selected={active === index} aria-controls={`run-panel-${item.id}`} tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={event => {
              let next = index;
              if (event.key === 'ArrowRight') next = (index + 1) % runs.length;
              else if (event.key === 'ArrowLeft') next = (index + runs.length - 1) % runs.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = runs.length - 1;
              else return;
              event.preventDefault(); setActive(next); buttons.current[next]?.focus();
            }}>
            <span>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div id={`run-panel-${run.id}`} role="tabpanel" aria-labelledby={`run-tab-${run.id}`} className={s.workbenchPanel}>
        <aside className={s.contextPane}>
          <p className={s.consoleLabel}>YOUR BUSINESS CONTEXT</p>
          {run.context.map(item => <p className={s.contextFile} key={item}><span aria-hidden="true">▤</span>{item}</p>)}
          <p className={s.consoleLabel}>CONNECTED TOOLS</p>
          <div className={s.toolList}>{run.tools.map(([file, name]) => <span key={name}><img src={`/logos/${file}`} alt="" width="20" height="20" />{name}</span>)}</div>
          <div className={s.contextNote}>Configured around your systems.<br />Guided by our engineers.</div>
        </aside>
        <div className={s.executionPane}>
          <p className={s.consoleLabel}>{run.category}</p>
          <div className={s.prompt}><span aria-hidden="true">↳</span><p>{run.prompt}</p></div>
          <ol className={s.runSteps}>{run.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
          <div className={s.reviewBoundary}><span aria-hidden="true">↳</span><div><strong>Expert judgment stays in the loop.</strong><p>{run.decision}</p></div></div>
        </div>
        <div className={s.outputPane}>
          <div className={s.outputTop}><span>THE OUTPUT</span><span aria-hidden="true">↗</span></div>
          <div className={s.outputArtifact} aria-hidden="true"><div /><div /><div /><div /><div /></div>
          <span className={s.outputType}>{run.outputType}</span><h3>{run.output}</h3>
          <ul>{run.files.map(file => <li key={file}><span aria-hidden="true">✓</span>{file}</li>)}</ul>
          <Link href={run.href}>{run.link}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className={s.workbenchFoot}><span>Context → connected tools → useful work → review</span><span>YOUR SYSTEMS. YOUR APPROVAL.</span></div>
    </div>
  );
}
