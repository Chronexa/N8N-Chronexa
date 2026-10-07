/**
 * Server-only loader for the public workflow files in src/data/portfolio-workflows.
 * Everything the portfolio states about a workflow's structure — node counts,
 * retries, error branches — is counted from the file here, never typed by hand.
 */
import fs from "node:fs";
import path from "node:path";

export type PublicNode = {
  id?: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters: Record<string, unknown> & { width?: number; height?: number };
  disabled?: boolean;
  onError?: string;
  retryOnFail?: boolean;
};

export type PublicWorkflow = {
  name: string;
  active: boolean;
  hasErrorWorkflow: boolean;
  /** Reference architecture built by scripts/build-reference-workflows.mjs. */
  reference?: boolean;
  syncedAt: string;
  nodes: PublicNode[];
  connections: Record<string, Record<string, Array<Array<{ node: string }> | null>>>;
};

export type WorkflowFacts = {
  nodes: number;
  connections: number;
  decisions: number;
  retries: number;
  errorBranches: number;
  active: boolean;
  hasErrorWorkflow: boolean;
  syncedAt: string;
};

export type Minimap = {
  viewBox: string;
  nodes: Array<{ x: number; y: number; trigger: boolean }>;
  notes: Array<{ x: number; y: number; w: number; h: number }>;
  edges: string[];
};

const STICKY = "n8n-nodes-base.stickyNote";
const NODE = 100; // n8n draws a default node as a 100×100 square from its position

const cache = new Map<string, PublicWorkflow>();

export function loadWorkflow(slug: string): PublicWorkflow {
  const hit = cache.get(slug);
  if (hit) return hit;
  const file = path.join(process.cwd(), "src", "data", "portfolio-workflows", `${slug}.json`);
  const workflow = JSON.parse(fs.readFileSync(file, "utf8")) as PublicWorkflow;
  cache.set(slug, workflow);
  return workflow;
}

export function workflowFacts(workflow: PublicWorkflow): WorkflowFacts {
  const nodes = workflow.nodes.filter((node) => node.type !== STICKY);
  const connections = Object.values(workflow.connections)
    .flatMap((byType) => Object.values(byType).flat())
    .reduce((total, targets) => total + (targets?.length ?? 0), 0);
  return {
    nodes: nodes.length,
    connections,
    decisions: nodes.filter((node) => /\.(if|switch)$/.test(node.type)).length,
    retries: nodes.filter((node) => node.retryOnFail).length,
    errorBranches: nodes.filter((node) => node.onError === "continueErrorOutput").length,
    active: workflow.active,
    hasErrorWorkflow: workflow.hasErrorWorkflow,
    syncedAt: workflow.syncedAt,
  };
}

/** A to-scale sketch of the canvas: real node positions, real wiring. */
export function minimap(workflow: PublicWorkflow): Minimap {
  const nodes = workflow.nodes.filter((node) => node.type !== STICKY);
  const notes = workflow.nodes.filter((node) => node.type === STICKY);
  const byName = new Map(nodes.map((node) => [node.name, node]));
  const xs = [...nodes.flatMap((n) => [n.position[0], n.position[0] + NODE]), ...notes.flatMap((n) => [n.position[0], n.position[0] + (n.parameters.width ?? 240)])];
  const ys = [...nodes.flatMap((n) => [n.position[1], n.position[1] + NODE]), ...notes.flatMap((n) => [n.position[1], n.position[1] + (n.parameters.height ?? 160)])];
  const pad = 60;
  // A floor on the frame keeps a 5-node workflow at the same scale as a
  // 20-node one instead of blowing its nodes up to fill the card.
  const spanX = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const spanY = Math.max(...ys) - Math.min(...ys) + pad * 2;
  const width = Math.max(spanX, 1500);
  const height = Math.max(spanY, 520);
  const minX = Math.min(...xs) - pad - (width - spanX) / 2;
  const minY = Math.min(...ys) - pad - (height - spanY) / 2;

  const edges: string[] = [];
  for (const [source, byType] of Object.entries(workflow.connections)) {
    const from = byName.get(source);
    if (!from) continue;
    for (const targets of Object.values(byType).flat()) {
      for (const target of targets ?? []) {
        const to = byName.get(target.node);
        if (!to) continue;
        const x1 = from.position[0] + NODE - minX;
        const y1 = from.position[1] + NODE / 2 - minY;
        const x2 = to.position[0] - minX;
        const y2 = to.position[1] + NODE / 2 - minY;
        const bend = Math.max(60, Math.abs(x2 - x1) / 2);
        edges.push(`M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`);
      }
    }
  }

  return {
    viewBox: `0 0 ${Math.round(width)} ${Math.round(height)}`,
    nodes: nodes.map((node) => ({ x: node.position[0] - minX, y: node.position[1] - minY, trigger: /(Trigger|\.webhook)$/.test(node.type) })),
    notes: notes.map((node) => ({ x: node.position[0] - minX, y: node.position[1] - minY, w: node.parameters.width ?? 240, h: node.parameters.height ?? 160 })),
    edges,
  };
}
