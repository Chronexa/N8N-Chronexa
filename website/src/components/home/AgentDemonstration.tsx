'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import s from './home.module.css';

const DocIntelScene = dynamic(() => import('../engines/docintel-scene/DocIntelScene'), {
  ssr: false,
  loading: () => <div className={s.demoLoading} role="status">Loading the document intelligence walkthrough…</div>,
});

export default function AgentDemonstration() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={s.demo}>
      <div className={s.demoBar}><span>DOCUMENT INTELLIGENCE / SYSTEM WALKTHROUGH</span><button type="button" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? 'Stop walkthrough' : 'Play walkthrough'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button></div>
      {playing ? <div className={s.demoScene}><DocIntelScene /></div> : (
        <div className={s.demoPoster}>
          <div className={s.documentStack} aria-hidden="true">
            <div className={s.backDocument} /><div className={s.frontDocument}><span>COMMERCIAL LEASE</span><b>Terms & conditions</b><i /><i /><i /><strong>12.3 / Renewal clause</strong><i /><i /><small>Source document · page 7</small></div>
            <div className={s.sourceTools}><img src="/logos/gdrive.svg" alt="" width="25" height="25" /><img src="/logos/sharepoint.png" alt="" width="25" height="25" /><span>+ your files</span></div>
          </div>
          <div className={s.agentBridge} aria-hidden="true"><span>CONNECTED AI AGENT</span><div><img src="/logos/claude.svg" alt="" width="32" height="32" /></div><p>Read. Understand. Cite.</p></div>
          <div className={s.answerCard}><span>AN ANSWER YOU CAN CHECK</span><h3>“Which leases renew this quarter?”</h3><p>An answer grounded in your documents, with a link back to the exact clause.</p><div>Source document <span>p. 7 · §12.3 ↗</span></div></div>
          <button className={s.playDemo} type="button" onClick={() => setPlaying(true)}><span aria-hidden="true">▷</span> See the agent at work</button>
        </div>
      )}
      <div className={s.demoFoot}><span>Illustrative walkthrough of our existing engine. No live client data.</span><Link href="/ai-engines/document-intelligence-engine">Explore the engine ↗</Link></div>
    </div>
  );
}
