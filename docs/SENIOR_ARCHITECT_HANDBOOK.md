# Senior n8n Architect's Handbook (Chronexa Edition)

This document defines the **State-of-the-Art (SOTA)** methods for building enterprise-grade n8n workflows at Chronexa.

## 1. The "Pre-Flight" Research Protocol
Never start building a workflow immediately. A senior architect always:
1.  **Explores the Template Library**: Check for existing patterns to avoid common pitfalls.
2.  **Inspects the API Specs**: Use MCP `get_node` to see hidden parameters and advanced settings.
3.  **Identifies Critical Paths**: Determine which nodes are the "anchors" (Airtable, Slack, HTTP) and verify their connection requirements.

## 2. Advanced Error Handling
"Junior" workflows assume the happy path. "Senior" workflows assume failure:
- **Node-Level Retries**: Configure "Retry on Failure" with exponential backoff for flaky APIs.
- **Global Error Handler**: Every project must have a dedicated Error Workflow that logs failures to a central Chronexa dashboard.
- **Data Validation**: Use IF nodes to check if required data exists before calling the next service.

## 3. High-Performance JSON Generation
- **Explicit Versioning**: n8n updates nodes frequently. Always pin to a stable `typeVersion`.
- **Minimized Data Bloat**: Use the "Set" node to strip unnecessary JSON fields between nodes to keep execution logs clean and memory usage low.
- **Connection Clarity**: For nodes with multiple outputs (IF, Switch, AI Agent), always label the branches.

## 4. AI-Native Workflow Design
Chronexa specializes in AI Orchestration. Use these SOTA patterns:
- **LangChain over Legacy**: Prefer `@n8n/n8n-nodes-langchain` nodes for any AI task.
- **Structured Output**: Never rely on raw LLM text. Always use an **Output Parser** with a strict JSON schema.
- **Multi-Agent Flow**: Design sub-workflows for specific AI "skills" (Research, Summarization, Drafting).

## 5. Deployment Lifecycle
1. **Local Build**: Generate JSON in `src/workflows/`.
2. **MCP Validation**: Run `validate_workflow` tool.
3. **Draft Deploy**: Push to a `[DRAFT]` workflow in n8n for manual verification.
4. **Production Promotion**: Update the production workflow and activate.

---
*Maintained by the Chronexa AI Strategy Team.*
