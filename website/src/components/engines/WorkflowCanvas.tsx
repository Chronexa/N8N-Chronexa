'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from '@xyflow/react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import WorkflowNode, { type NodeStatus } from './WorkflowNode';
import { FlowingEdge } from './FlowingEdge';
import type { EngineDef } from './engines-data';
import styles from './WorkflowCanvas.module.css';

// ─── Timing ───────────────────────────────────────────────────────────────────
const HOLD_MS  = 2700;
const FINAL_MS = 2400;
const RESET_MS = 950; // gap between loops — gives exit animation time

// ─── React Flow setup ─────────────────────────────────────────────────────────
// Both type maps are defined outside the component — stable references prevent
// React Flow from treating them as new objects on every render.
const nodeTypes = { workflowNode: WorkflowNode };
const edgeTypes = { flowing: FlowingEdge };

type FlowEdgeDef = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkflowCanvas({
  engine,
  outputs,
  flowPositions,
  flowEdges: edgeDefs,
}: {
  engine: EngineDef;
  outputs: Record<string, string[]>;
  flowPositions: Record<string, { x: number; y: number }>;
  flowEdges: FlowEdgeDef[];
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfRef    = useRef<ReactFlowInstance<any, any> | null>(null);
  const inView   = useInView(shellRef, { amount: 0.18 });
  const reduced  = useReducedMotion();
  const n        = engine.nodes.length;

  const [step,   setStep]   = useState(-1);
  const [pinned, setPinned] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  // ── Build nodes with 4-state status ─────────────────────────────────────────
  const buildNodes = useCallback(
    (currentStep: number, pinnedId: string | null): Node[] =>
      engine.nodes.map((node, i) => {
        const status: NodeStatus =
          currentStep < 0   ? 'idle'     :
          i < currentStep   ? 'done'     :
          i === currentStep ? 'running'  :
          'upcoming';
        return {
          id: node.id,
          type: 'workflowNode',
          position: flowPositions[node.id] ?? { x: i * 315, y: 0 },
          data: {
            ...node,
            status,
            onNodeClick: (id: string) =>
              setPinned((prev) => (prev === id ? null : id)),
          } as Record<string, unknown>,
          selected: node.id === pinnedId,
          draggable: false,
          selectable: true,
        };
      }),
    [engine.nodes, flowPositions],
  );

  // ── Build edges — FlowingEdge handles all visual state via data.active ────────
  // Edge i is the connection from node i → node i+1.
  // It is "active" when the animation is on the node at the leading end (step === i+1),
  // meaning the dot travels toward the node that is about to light up.
  // At step -1 (idle) or step === n-1 (last node, no outgoing edge): no edge is active.
  const buildEdges = useCallback(
    (currentStep: number): Edge[] =>
      edgeDefs.map((e, i) => {
        const isActive = currentStep > 0 && currentStep === i + 1;
        const isDone   = currentStep > i + 1;
        return {
          ...e,
          type: 'flowing',
          data: { active: isActive, done: isDone },
          markerEnd: {
            type: 'arrowclosed' as const,
            color: isActive ? '#67B035' : isDone ? 'rgba(103,176,53,0.4)' : 'rgba(255,255,255,0.18)',
          },
        };
      }),
    [edgeDefs],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(-1, null));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(-1));

  // Re-derive nodes + edges whenever step or pinned changes
  useEffect(() => {
    setNodes(buildNodes(step, pinned));
    setEdges(buildEdges(step));
  }, [step, pinned, buildNodes, buildEdges, setNodes, setEdges]);

  // ── Viewport zoom — restrained camera tracking ────────────────────────────────
  useEffect(() => {
    if (!rfRef.current || reduced) return;

    if (step < 0) {
      rfRef.current.fitView({ duration: 800, padding: 0.35 });
      return;
    }
    if (step >= n) return;

    const nodePos = flowPositions[engine.nodes[step].id];
    if (!nodePos) return;

    const cx = nodePos.x + 127.5; // center of 255px-wide node
    const cy = nodePos.y + 82;    // center of 164px-tall node
    
    // Very subtle recentering and mild zoom to indicate focus without
    // losing the overall architecture. No dramatic panning sweeps.
    rfRef.current.setCenter(cx, cy, { zoom: 1.05, duration: 800 });
  }, [step, engine.nodes, flowPositions, n, reduced]);

  // ── Auto-play loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) {
      setStep(n - 1);
      return;
    }
    if (!inView) {
      setStep(-1);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let current = -1;

    const tick = () => {
      current += 1;
      if (current >= n) {
        setStep(n - 1);
        setComplete(true);
        timer = setTimeout(() => {
          setComplete(false);
          setStep(-1);
          current = -1;
          setPinned(null);
          timer = setTimeout(tick, RESET_MS);
        }, FINAL_MS);
        return;
      }
      setStep(current);
      timer = setTimeout(tick, HOLD_MS);
    };

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, [inView, reduced, n]);

  // ── Derived state ────────────────────────────────────────────────────────────
  const running = inView && !reduced && step >= 0;
  const shown   = step < 0 ? 0 : step + 1;

  const activeId   = pinned ?? (step >= 0 && step < n ? engine.nodes[step].id : null);
  const activeNode = useMemo(
    () => (activeId ? engine.nodes.find((nd) => nd.id === activeId) : null),
    [activeId, engine.nodes],
  );
  const outputLines = activeNode ? (outputs[activeNode.id] ?? []) : [];

  return (
    <div className={styles.shell} ref={shellRef}>
      <div className={styles.workspace}>

        {/* ── Full-bleed canvas with floating HUD ── */}
        <div className={`${styles.flowWrap} ${complete ? styles.flowWrapComplete : ''}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(instance) => { rfRef.current = instance; }}
            colorMode="dark"
            fitView
            fitViewOptions={{ padding: 0.35, maxZoom: 1 }}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnDrag={false}
            panOnScroll={false}
            preventScrolling={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={32}
              lineWidth={1}
              color="rgba(255, 255, 255, 0.03)"
            />
          </ReactFlow>

          {/* HUD — Minimalist context layer floating over canvas */}
          <div className={styles.hudOverlay}>
            
            {/* Minimalist Title / Context (No Box) */}
            <div className={styles.contextLayer}>
              <span className={styles.contextBreadcrumb}>Chronexa / {engine.name}</span>
              <h3 className={styles.contextTitle}>Live Orchestration</h3>
            </div>

            {/* Top-right: step counter + CTA */}
            <div className={styles.hudControls}>
              <AnimatePresence mode="wait">
                {complete ? (
                  <motion.div
                    key="complete"
                    className={styles.completeBadge}
                    initial={{ opacity: 0, scale: 0.88, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.completeIcon}>✓</span>
                    <span className={styles.completeText}>Pipeline complete</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pill"
                    className={styles.hudStepPill}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.stepCount}>
                      STEP {String(shown).padStart(2, '0')} / {String(n).padStart(2, '0')}
                    </span>
                    <span className={styles.progressTrack} aria-hidden="true">
                      <motion.span
                        className={styles.progressFill}
                        animate={{ width: `${(shown / n) * 100}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      />
                    </span>
                    {pinned && (
                      <button className={styles.clearPin} onClick={() => setPinned(null)}>
                        × unpin
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* CTA removed as requested */}
            </div>

          </div>
        </div>

        {/* ── Output panel ── */}
        <div className={styles.outputPanel}>
          <div className={styles.outHead}>
            <span className={styles.outLabel}>Live Output</span>
            {running && !pinned && <span className={styles.outLiveLabel}>Running</span>}
            {pinned  && <span className={styles.outLiveLabel}>Pinned</span>}
          </div>

          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode.id}
                className={styles.outBody}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={styles.outCaption}>{activeNode.caption}</p>
                <ul className={styles.outLines}>
                  {outputLines.map((line, i) => {
                    const delay = i * 0.2;

                    return (
                      <li
                        // Compound key: activeNode.id ensures React destroys and recreates
                        // this <li> on step change, restarting the CSS animation.
                        key={`${activeNode.id}-${i}`}
                        className={styles.outLine}
                      >
                        <span className={styles.outMark} aria-hidden="true">›</span>
                        <span
                          className={styles.logLine}
                          style={{ animationDelay: `${delay}s` }}
                        >
                          {line}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className={styles.outStat}>
                  <span className={styles.outStatDot} aria-hidden="true" />
                  {activeNode.stat}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                className={styles.outIdle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className={styles.outIdleText}>
                  Scroll into view to watch the engine run.
                </span>
                <span className={styles.outIdleHint}>
                  Click any node to pin its output.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
