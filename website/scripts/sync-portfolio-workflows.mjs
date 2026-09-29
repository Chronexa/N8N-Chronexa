import fs from "node:fs";
import path from "node:path";

const websiteRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.resolve(websiteRoot, "..", "src", "workflows");
const outputRoot = path.join(websiteRoot, "src", "data", "portfolio-workflows");

fs.mkdirSync(outputRoot, { recursive: true });

for (const fileName of fs.readdirSync(sourceRoot).filter((name) => name.endsWith(".json"))) {
  const source = JSON.parse(fs.readFileSync(path.join(sourceRoot, fileName), "utf8"));
  const nodes = (source.nodes ?? []).map((node) => {
    const sticky = node.type === "n8n-nodes-base.stickyNote";
    const heading = String(node.parameters?.content ?? "Workflow architecture")
      .split("\n")
      .find((line) => line.trim())
      ?.replace(/^#+\s*/, "") ?? "Workflow architecture";
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      typeVersion: node.typeVersion,
      position: node.position,
      parameters: sticky
        ? {
            content: `## ${heading}\n\nPublic architecture preview. Operational parameters, credentials, endpoints, and prompts are intentionally omitted.`,
            width: node.parameters?.width,
            height: node.parameters?.height,
            color: node.parameters?.color,
          }
        : {},
    };
  });

  const publicWorkflow = { name: source.name ?? path.basename(fileName, ".json"), nodes, connections: source.connections ?? {} };
  fs.writeFileSync(path.join(outputRoot, fileName), `${JSON.stringify(publicWorkflow, null, 2)}\n`, "utf8");
  console.log(`Synced ${fileName}: ${nodes.length} public nodes`);
}
