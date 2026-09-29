"use client";

import React, { useMemo } from "react";
import {
  Controls,
  Handle,
  Position,
  ReactFlow,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import s from "./WorkflowCanvas.module.css";

export type PublicWorkflowNode = {
  id?: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters: {
    content?: string;
    width?: number;
    height?: number;
    color?: number;
    [key: string]: unknown;
  };
};

export type PublicWorkflow = {
  name?: string;
  nodes: PublicWorkflowNode[];
  connections: Record<
    string,
    { main?: Array<Array<{ node: string; type?: string; index?: number }>> }
  >;
};

/* ── Brand colors for each integration ─────────────────────────────── */
const BRAND_COLORS: Record<string, { bg: string; fg: string }> = {
  "Anthropic Claude":    { bg: "#d4a27f", fg: "#1a1210" },
  "Exa AI":              { bg: "#6366f1", fg: "#ffffff" },
  "ManyReach":           { bg: "#22c55e", fg: "#ffffff" },
  "Baserow":             { bg: "#198754", fg: "#ffffff" },
  "Google Sheets":       { bg: "#0f9d58", fg: "#ffffff" },
  "Webhook":             { bg: "#9b59b6", fg: "#ffffff" },
  "Apollo.io":           { bg: "#2563eb", fg: "#ffffff" },
  "n8n Scheduler":       { bg: "#ea4b71", fg: "#ffffff" },
  "Meta Lead Ads":       { bg: "#1877f2", fg: "#ffffff" },
  "WhatsApp Business":   { bg: "#25d366", fg: "#ffffff" },
  "Meta Graph API":      { bg: "#1877f2", fg: "#ffffff" },
  "Google Search Console":{ bg: "#4285f4", fg: "#ffffff" },
  "DataForSEO":          { bg: "#f97316", fg: "#ffffff" },
  "Framer CMS":          { bg: "#0055ff", fg: "#ffffff" },
  "Railway":             { bg: "#c049e8", fg: "#ffffff" },
  "Google Indexing API": { bg: "#4285f4", fg: "#ffffff" },
  "Shopify":             { bg: "#96bf48", fg: "#ffffff" },
  "Meta Conversions API":{ bg: "#1877f2", fg: "#ffffff" },
  "Brevo":               { bg: "#0b4f6c", fg: "#ffffff" },
  "FLUX AI":             { bg: "#f43f5e", fg: "#ffffff" },
  "Retell AI":           { bg: "#818cf8", fg: "#ffffff" },
  "Airtable":            { bg: "#18bfff", fg: "#ffffff" },
  "Google Drive":        { bg: "#4285f4", fg: "#ffffff" },
  "Slack":               { bg: "#4a154b", fg: "#ffffff" },
  "Email (IMAP)":        { bg: "#ef4444", fg: "#ffffff" },
  "Karbon":              { bg: "#3b82f6", fg: "#ffffff" },
  "Salesforce":          { bg: "#00a1e0", fg: "#ffffff" },
  "Affinity CRM":        { bg: "#5b4fff", fg: "#ffffff" },
  "Crunchbase":          { bg: "#0288d1", fg: "#ffffff" },
  "Google Docs":         { bg: "#4285f4", fg: "#ffffff" },
};

const DEFAULT_COLOR = { bg: "#ea4b71", fg: "#ffffff" };

/* ── Custom SVG Icons for Core Nodes ──────────────────────────────── */
const CORE_ICONS = {
  webhook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  schedule: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  set: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  if: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  http: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
};

/* ── SVG icon paths for popular integrations ──────────────────────── */
const LOCAL_LOGOS: Array<[RegExp, string]> = [
  [/google.*sheet|sheets/i, "/logos/googlesheets.svg"],
  [/google.*drive|drive/i, "/logos/gdrive.svg"],
  [/anthropic|claude/i, "/logos/anthropic.svg"],
  [/airtable/i, "/logos/airtable.svg"],
  [/slack/i, "/logos/slack.svg"],
  [/shopify/i, "/logos/shopify.svg"],
  [/whatsapp/i, "/logos/whatsapp.svg"],
  [/salesforce/i, "/logos/salesforce.svg"],
  [/openai/i, "/logos/openai.svg"],
  [/n8n/i, "/logos/n8n.svg"],
];

const REMOTE_LOGOS: Array<[RegExp, string]> = [
  [/exa/i, "exa.ai"],
  [/manyreach/i, "manyreach.com"],
  [/baserow/i, "baserow.io"],
  [/apollo/i, "apollo.io"],
  [/meta|facebook/i, "meta.com"],
  [/brevo|sendinblue/i, "brevo.com"],
  [/framer/i, "framer.com"],
];

function getNodeIcon(label: string, nodeType = ""): React.ReactNode {
  const key = label.toLowerCase();
  const typeKey = nodeType.toLowerCase();
  const localLogo = LOCAL_LOGOS.find(([pattern]) => pattern.test(`${label} ${nodeType}`));
  if (localLogo) {
    // These assets are served locally so the workflow never depends on an icon CDN.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={localLogo[1]} alt="" width="32" height="32" />;
  }
  const remoteLogo = REMOTE_LOGOS.find(([pattern]) => pattern.test(label));
  if (remoteLogo) {
    // Only uncommon vendors use the favicon fallback; primary logos are bundled locally.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`https://www.google.com/s2/favicons?domain=${remoteLogo[1]}&sz=128`} alt="" width="32" height="32" />;
  }
  
  // Core n8n nodes
  if (typeKey.includes("webhook") || key.includes("webhook")) return CORE_ICONS.webhook;
  if (typeKey.includes("schedule") || key.includes("schedule")) return CORE_ICONS.schedule;
  if (typeKey.endsWith(".set") || key.includes("set fields")) return CORE_ICONS.set;
  if (typeKey.endsWith(".if") || key.startsWith("if ")) return CORE_ICONS.if;
  if (typeKey.includes("httprequest")) return CORE_ICONS.http;
  if (typeKey.includes("code")) return <div className={s.textIcon}>JS</div>;
  if (typeKey.includes("switch")) return <div className={s.textIcon}>SW</div>;

  // Fallback text icon
  return <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{label.slice(0, 2).toUpperCase()}</div>;
}

/* ── Node type identifiers ────────────────────────────────────────── */
function getNodeType(label: string, index: number, total: number): string {
  const key = label.toLowerCase();
  if (key.includes("webhook") || key.includes("scheduler") || key.includes("schedule")) return "trigger";
  if (index === 0) return "trigger";
  if (key.includes("claude") || key.includes("ai") || key.includes("flux")) return "ai";
  if (index === total - 1) return "output";
  return "action";
}

/* ── Custom n8n-style node component ──────────────────────────────── */
type CanvasData = {
  label: string;
  index: number;
  total: number;
  brandBg: string;
  brandFg: string;
  icon: React.ReactNode;
  nodeType: string;
  isSticky?: boolean;
  content?: string;
  width?: number;
  height?: number;
  color?: number;
  hasTrigger?: boolean;
};

// Map n8n color codes to sticky note backgrounds
const STICKY_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: "#fff59d", text: "#333333" }, // Yellow
  2: { bg: "#81d4fa", text: "#111111" }, // Blue
  3: { bg: "#a5d6a7", text: "#111111" }, // Green
  4: { bg: "#ef9a9a", text: "#111111" }, // Red
  5: { bg: "#ce93d8", text: "#111111" }, // Purple
  6: { bg: "#e0e0e0", text: "#333333" }, // Grey
  7: { bg: "#ffffff", text: "#333333" }, // White
};

function N8nNode({ data }: NodeProps<Node<CanvasData>>) {
  if (data.isSticky) {
    const c = STICKY_COLORS[data.color || 1] || STICKY_COLORS[1];
    return (
      <div 
        className={s.stickyNote} 
        style={{ 
          width: data.width || 240, 
          height: data.height || 200,
          backgroundColor: c.bg,
          color: c.text
        }}
      >
        <div className={s.stickyContent}>{data.content}</div>
      </div>
    );
  }

  const isTrigger = data.nodeType === "trigger" || data.hasTrigger;

  return (
    <div className={s.nodeWrap}>
      {/* Actual Node Box */}
      <div className={s.nodeBox}>
        {/* Incoming handle - Triggers don't have inputs */}
        {!isTrigger && (
          <Handle type="target" position={Position.Left} className={s.handleTarget} />
        )}

        <div className={s.nodeIconWrap} style={{ backgroundColor: data.brandBg, color: data.brandFg }}>
          <span className={s.nodeIcon}>{data.icon}</span>
        </div>

        {/* Trigger bolt */}
        {isTrigger && (
          <div className={s.triggerBolt}>⚡</div>
        )}

        {/* Outgoing handle - Every node can output in n8n except strictly leaf nodes, but safest is to always provide it so connections work */}
        <Handle type="source" position={Position.Right} className={s.handleSource} />
      </div>

      {/* Label positioned absolutely below the node */}
      <div className={s.nodeLabelWrap}>
        <div className={s.nodeLabel}>{data.label}</div>
        <div className={s.nodeSubLabel}>{data.nodeType}</div>
      </div>
    </div>
  );
}

const nodeTypes = { n8n: N8nNode };

/* ── Layout algorithm: uses actual n8n JSON or falls back ─────── */
function layoutNodes(integrations: string[], n8nJson?: PublicWorkflow | null) {
  if (n8nJson && n8nJson.nodes && Array.isArray(n8nJson.nodes)) {
    // Separate sticky notes and standard nodes to ensure sticky notes render BEHIND
    const stickyNodes = n8nJson.nodes.filter((n) => n.type === 'n8n-nodes-base.stickyNote');
    const standardNodes = n8nJson.nodes.filter((n) => n.type !== 'n8n-nodes-base.stickyNote');

    const createReactFlowNode = (n: PublicWorkflowNode, index: number) => {
      const isSticky = n.type === 'n8n-nodes-base.stickyNote';
      const brand = BRAND_COLORS[n.name] || DEFAULT_COLOR;
      let nodeType = n.type.split('.').pop() || 'action';
      if (nodeType.toLowerCase().includes('trigger')) nodeType = 'trigger';
      if (n.name.toLowerCase().includes('trigger')) nodeType = 'trigger';
      
      return {
        id: n.name, // n8n connections use node names
        type: "n8n",
        position: { x: n.position[0], y: n.position[1] },
        // Use a lower zIndex for sticky notes so they don't block clicks on standard nodes
        zIndex: isSticky ? -1 : 1,
        data: {
          label: n.name,
          index,
          total: n8nJson.nodes.length,
          brandBg: brand.bg,
          brandFg: brand.fg,
          icon: getNodeIcon(n.name, n.type),
          nodeType,
          isSticky,
          hasTrigger: nodeType === 'trigger',
          content: n.parameters?.content || "",
          width: n.parameters?.width || 240,
          height: n.parameters?.height || 200,
          color: n.parameters?.color || 1
        },
      };
    };

    const nodes: Node<CanvasData>[] = [
      ...stickyNodes.map((n, i) => createReactFlowNode(n, i)),
      ...standardNodes.map((n, i) => createReactFlowNode(n, i + stickyNodes.length))
    ];

    const edges: Edge[] = [];
    if (n8nJson.connections) {
      Object.keys(n8nJson.connections).forEach((sourceName) => {
        const sourceCons = n8nJson.connections[sourceName];
        if (sourceCons.main) {
          sourceCons.main.forEach((targetsList, outputIndex) => {
            if (Array.isArray(targetsList)) {
              targetsList.forEach((targetInfo, targetIndex) => {
                edges.push({
                  id: `e-${sourceName}-${outputIndex}-${targetInfo.node}-${targetIndex}`,
                  source: sourceName,
                  target: targetInfo.node,
                  type: "smoothstep",
                  animated: false,
                  style: { stroke: "#c4c4c4", strokeWidth: 1.5 },
                  markerEnd: { 
                    type: MarkerType.ArrowClosed, 
                    color: "#c4c4c4",
                    width: 15,
                    height: 15
                  },
                });
              });
            }
          });
        }
      });
    }

    return { nodes, edges };
  }

  // Fallback to auto layout
  const total = integrations.length;
  const cols = total <= 3 ? total : total <= 6 ? 3 : 4;
  const nodeW = 200; // tighter spacing for grid
  const nodeH = 120;
  const gapX = 80;
  const gapY = 80;

  const nodes: Node<CanvasData>[] = integrations.map((label, index) => {
    const brand = BRAND_COLORS[label] || DEFAULT_COLOR;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const xOffset = row % 2 === 1 ? nodeW / 2 : 0;

    return {
      id: `n-${index}`,
      type: "n8n",
      position: {
        x: 60 + col * (nodeW + gapX) + xOffset,
        y: 60 + row * (nodeH + gapY),
      },
      data: {
        label,
        index,
        total,
        brandBg: brand.bg,
        brandFg: brand.fg,
        icon: getNodeIcon(label),
        nodeType: getNodeType(label, index, total),
        hasTrigger: index === 0
      },
    };
  });

  const edges: Edge[] = [];
  for (let i = 0; i < total - 1; i++) {
    edges.push({
      id: `e-${i}`,
      source: `n-${i}`,
      target: `n-${i + 1}`,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#c4c4c4", strokeWidth: 1.5 },
      markerEnd: { 
        type: MarkerType.ArrowClosed, 
        color: "#c4c4c4",
        width: 15,
        height: 15
      },
    });
  }

  return { nodes, edges };
}

/* ── Main canvas component ────────────────────────────────────────── */
export default function WorkflowCanvas({
  title,
  integrations,
  n8nJson
}: {
  title: string;
  integrations: string[];
  n8nJson?: PublicWorkflow | null;
}) {
  const { nodes, edges } = useMemo(
    () => layoutNodes(integrations, n8nJson),
    [integrations, n8nJson]
  );
  const showEntireWorkflow = nodes.length <= 12;
  const initialViewport = useMemo(() => {
    const firstNode = nodes.find((node) => !node.data.isSticky) ?? nodes[0];
    const zoom = 0.78;
    return {
      x: 64 - (firstNode?.position.x ?? 0) * zoom,
      y: 180 - (firstNode?.position.y ?? 0) * zoom,
      zoom,
    };
  }, [nodes]);

  return (
    <div
      className={s.shell}
      aria-label={`Interactive workflow preview for ${title}`}
    >
      <div className={s.canvasMeta}>
        <span><i /> Live architecture</span>
        <strong>{nodes.filter((node) => !node.data.isSticky).length} executable nodes · {edges.length} connections</strong>
      </div>
      <div className={s.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView={showEntireWorkflow}
          fitViewOptions={{ padding: 0.15 }}
          defaultViewport={initialViewport}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
          panOnScroll
          zoomOnDoubleClick={false}
        >
          <Controls
            showInteractive={false}
            className={s.controls}
            position="bottom-left"
            orientation="horizontal"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
