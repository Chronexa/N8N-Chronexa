import type { PortfolioWorkflow, WorkflowCategory } from "./portfolio-data";

const whyByCategory: Record<WorkflowCategory, string> = {
  "AI Agents": "Teams lose time when judgement-heavy work is split across prompts, tabs and handoffs. This workflow turns that sequence into a governed agent process with explicit inputs, outputs and review points.",
  "Lead Generation": "Lead value decays quickly when capture, enrichment and routing happen in separate systems. This workflow closes that gap and creates one reliable path from signal to follow-up.",
  "Sales Outreach": "Personalised outreach becomes expensive when every message starts with manual research. This system separates research, drafting, review and delivery so quality can scale without hiding the evidence.",
  "Marketing Ops": "Marketing data is only useful when it reaches the next decision in a consistent shape. This workflow removes repetitive exports and keeps attribution and downstream actions connected.",
  "Document Processing": "Document workflows fail when extraction is treated as the finish line. This system combines extraction with validation, exception handling and a traceable route into the system of record.",
  "SEO & Content": "Content operations slow down at the handoffs between research, drafting, review, media and publishing. This workflow makes every state visible and gives each stage a defined contract.",
  "CRM & Data Sync": "CRM automation needs more than field mapping. It needs identity rules, conflict handling and a visible audit trail so synchronisation does not quietly damage the source of truth.",
  "Finance & Compliance": "Finance and compliance workflows need deterministic controls around probabilistic AI. This architecture keeps approval, source evidence and exception handling inside the operating path.",
  "Customer Support": "Support automation creates value only when routine work is resolved faster without burying urgent or ambiguous cases. This workflow combines classification, grounded responses and controlled escalation.",
  "Voice AI": "A voice interaction has little operational value if its context disappears after the call. This workflow converts the conversation into structured, actionable records for the team that follows up.",
};

const roiByCategory: Record<WorkflowCategory, string> = {
  "AI Agents": "Fewer manual handoffs and less repeated prompting",
  "Lead Generation": "Faster response and fewer lost leads",
  "Sales Outreach": "More researched touches per seller-hour",
  "Marketing Ops": "Less reporting effort and cleaner attribution",
  "Document Processing": "Less data entry and faster exception review",
  "SEO & Content": "Higher publishing throughput with controlled review",
  "CRM & Data Sync": "Less reconciliation and fewer record-quality failures",
  "Finance & Compliance": "Shorter review cycles with a stronger audit trail",
  "Customer Support": "Lower handling time and faster escalation",
  "Voice AI": "More qualified follow-up from every completed call",
};

export function getWorkflowDetail(workflow: PortfolioWorkflow) {
  const showcase = workflow.id.startsWith("showcase-");
  const internal = workflow.id.startsWith("blog-agent-");
  const proofLabel = showcase ? "Reference architecture" : internal ? "Chronexa operating system" : "Production workflow";
  const apps = workflow.integrations;
  const stackSummary = apps.slice(0, 3).join(", ");

  return {
    proofLabel,
    why: whyByCategory[workflow.category],
    roiTheme: roiByCategory[workflow.category],
    stages: [
      { number: "01", title: "Capture the source event", text: `The workflow starts from its webhook, schedule or source-system event, preserving the original payload and execution context across ${stackSummary}.` },
      { number: "02", title: "Normalise and validate", text: "Required fields, identifiers and formats are checked before any model or downstream system is allowed to act." },
      { number: "03", title: "Add the decision context", text: "Relevant integrations add the context required for the decision, while source data stays distinguishable from generated or inferred data." },
      { number: "04", title: "Apply orchestration logic", text: `n8n routes the item through the rules, AI steps and human gates that define this ${workflow.category.toLowerCase()} process.` },
      { number: "05", title: "Write the controlled outcome", text: "Approved output is written to its downstream system with an idempotent key, execution status and enough context to investigate failures." },
    ],
    controls: [
      "Schema validation before downstream writes",
      "Retry and error routes for external API failures",
      "Duplicate-safe processing and idempotent updates",
      "Human approval where the action carries business risk",
      "Execution logging for support and audit review",
    ],
  };
}
