'use client';

import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import type { EngineNodeDef, IconKey } from './engines-data';
import styles from './WorkflowCanvas.module.css';

// ─── Icon set ────────────────────────────────────────────────────────────────

const PATHS: Record<IconKey, React.ReactElement> = {
  database: (<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></>),
  search:   (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  filter:   (<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />),
  pen:      (<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></>),
  layers:   (<><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></>),
  send:     (<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>),
  shield:   (<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>),
  inbox:    (<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5 5h14l3 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5l3-7z" /></>),
  chart:    (<><path d="M3 3v18h18" /><path d="M7 14l3-3 3 3 5-6" /></>),
  book:     (<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  spark:    (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" /><circle cx="12" cy="12" r="2.5" /></>),
  doc:      (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></>),
};

function Ico({ icon, size = 17 }: { icon: IconKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[icon]}
    </svg>
  );
}

function CheckIco() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeStatus = 'idle' | 'upcoming' | 'running' | 'done';

export type WorkflowNodeData = EngineNodeDef & {
  status: NodeStatus;
  onNodeClick?: (id: string) => void;
};

// ─── Animation variants ───────────────────────────────────────────────────────
// Using Record<string, unknown> to satisfy TS strict variant typing.
// Framer-motion's Easing requires literal types ('easeIn') not plain strings.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: Record<string, any> = {
  idle:     { opacity: 0.35, scale: 1, y: 0, transition: { duration: 0.3 } },
  upcoming: { opacity: 0.35, scale: 1, y: 0, transition: { duration: 0.3 } },
  running:  { 
    opacity: 1,   
    scale: 1.03, 
    y: -2, 
    filter: 'drop-shadow(0 8px 16px rgba(103,176,53,0.15))',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
  done:     { 
    opacity: 0.75, 
    scale: 1, 
    y: 0, 
    filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tagVariants: Record<string, any> = {
  hidden:  { opacity: 1, transition: { duration: 0.15 } },
  visible: { opacity: 1, transition: { delay: 0.14, duration: 0.28 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bodyVariants: Record<string, any> = {
  hidden:  { opacity: 1, y: 0, transition: { duration: 0.15 } },
  visible: { opacity: 1, y: 0, transition: { delay: 0.26, duration: 0.32, ease: 'easeOut' } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activityVariants: Record<string, any> = {
  hidden: { opacity: 0, y: 4, transition: { duration: 0.15 } }, // Keep activity hidden until active
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: 0.38, ease: 'easeOut' }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chipsContainer: Record<string, any> = {
  hidden:  { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.44 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chipItem: Record<string, any> = {
  hidden:  { opacity: 1, scale: 1, x: 0 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.24, ease: 'easeOut' } },
};

// ─── WorkflowNode component ────────────────────────────────────────────────────

export default function WorkflowNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as WorkflowNodeData;
  const chips = d.tools.slice(0, 3);
  const extra = d.tools.length - chips.length;
  const isActive = d.status === 'running' || d.status === 'done';

  return (
    <>
      <Handle id="left"   type="target" position={Position.Left}   className={styles.rfHandle} />
      <Handle id="right"  type="source" position={Position.Right}  className={styles.rfHandle} />
      <Handle id="top"    type="target" position={Position.Top}    className={styles.rfHandle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={styles.rfHandle} />

      <motion.div
        className={styles.wfNode}
        data-status={d.status}
        data-selected={selected ? 'true' : undefined}
        onClick={() => d.onNodeClick?.(id)}
        role="button"
        aria-label={`${d.label} — ${d.status}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && d.onNodeClick?.(id)}
        variants={cardVariants}
        initial="upcoming"
        animate={d.status}
      >
        {d.status === 'running' && (
          <span className={styles.wfNodeShimmer} aria-hidden="true" />
        )}

        {/* Tag row — staggered reveal first */}
        <motion.div
          className={styles.wfNodeHeader}
          variants={tagVariants}
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
        >
          <span className={styles.wfNodeTag}>{d.tag}</span>
          {d.status === 'running' && <span className={styles.wfRunDot} aria-hidden="true" />}
          {d.status === 'done'    && <span className={styles.wfCheckWrap}><CheckIco /></span>}
        </motion.div>

        {/* Icon + label — slides up second */}
        <motion.div
          className={styles.wfNodeBody}
          variants={bodyVariants}
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
        >
          <div className={styles.wfNodeIcon} data-status={d.status}>
            <Ico icon={d.icon} size={17} />
          </div>
          <span className={styles.wfNodeLabel}>{d.label}</span>
        </motion.div>

        {d.status === 'running' && d.activity && (
          <motion.p
            className={styles.wfActivity}
            variants={activityVariants}
            initial="hidden"
            animate="visible"
          >
            {d.activity}
          </motion.p>
        )}

        {/* Chips — stagger in last */}
        <motion.div
          className={styles.wfNodeChips}
          variants={chipsContainer}
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
        >
          {chips.map((t) => (
            <motion.span key={t} className={styles.wfChip} variants={chipItem}>{t}</motion.span>
          ))}
          {extra > 0 && (
            <motion.span className={`${styles.wfChip} ${styles.wfChipMore}`} variants={chipItem}>+{extra}</motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
