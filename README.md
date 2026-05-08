# N8N-Chronexa: Automated Workflow Builder

This project is designed to automatically generate, test, and deploy n8n workflows for Chronexa.

## Workflow Generation Process
1. **Specs**: Define requirements in `src/specs/`.
2. **Generation**: Use the AI to generate the n8n JSON in `src/workflows/`.
3. **Deployment**: Sync the JSON to the n8n instance via API/MCP.

## Setup
1. Add `N8N_API_URL` and `N8N_API_KEY` to `.env`.
2. Install dependencies: `npm install`.
