# N8N-Chronexa — Automation Infrastructure

Chronexa.io's automation infrastructure built on n8n. Two production systems:

1. **SEO Blog Pipeline** — 5-agent autonomous blog production engine (zero human intervention)
2. **Outbound Engine** — AI-personalised cold outreach pipeline for lead generation

## Quick Reference

| System | Key Doc | Status |
|--------|---------|--------|
| Blog Pipeline | [workflows/blog-pipeline/README.md](workflows/blog-pipeline/README.md) | All 5 agents live on Baserow |
| Outbound Engine | [workflows/outbound-engine/README.md](workflows/outbound-engine/README.md) | Live |
| Full Handoff | [HANDOFF.md](HANDOFF.md) | Current as of 2026-05-20 |

## Repo Structure

```
N8N-Chronexa/
├── HANDOFF.md                        ← Complete project handoff (start here)
├── CLAUDE.md                         ← AI agent instructions and live system IDs
│
├── workflows/
│   ├── blog-pipeline/                ← Blog pipeline docs and status
│   │   └── README.md
│   └── outbound-engine/              ← Outbound engine workflows and docs
│       ├── README.md
│       ├── outbound-engine.json      ← n8n workflow JSON (Outbound Engine)
│       ├── manyreach-push.json       ← n8n workflow JSON (ManyReach Push)
│       └── feeder.json               ← n8n workflow JSON (Feeder, manual)
│
├── src/
│   ├── workflows/                    ← Blog pipeline workflow JSONs (do not reorganise)
│   │   ├── blog-agent-1-strategist.json
│   │   ├── blog-agent-2-researcher.json
│   │   ├── blog-agent-3-copywriter.json
│   │   ├── blog-agent-4-designer.json
│   │   └── blog-agent-5-publisher.json
│   └── specs/
│       └── blog-automation.md        ← Blog pipeline original spec
│
├── framer-bridge/                    ← Express microservice on Railway
│   ├── server.js                     ← Publish endpoint (idempotent as of 2026-05-20)
│   ├── nixpacks.toml                 ← Forces Node 22 — DO NOT REMOVE
│   └── package.json
│
├── scripts/                          ← Utility and migration scripts
│   ├── fetch-live.js                 ← Download live workflow JSONs from n8n
│   ├── inject-5-records.js           ← Seed blog pipeline Baserow table
│   ├── create-agent[3-5]-baserow.js  ← Migration scripts (already run — reference only)
│   ├── fix-agent1-dedup.js           ← Patched Agent 1 dedup (already run)
│   ├── test-agent[2-5]-run.js        ← Schedule-swap validation tests
│   └── live-workflows/               ← Snapshots of live n8n workflows
│
└── docs/
    ├── BLOG_AUTOMATION_ARCHITECTURE.md  ← Blog pipeline architecture (canonical)
    ├── SENIOR_ARCHITECT_HANDBOOK.md     ← n8n engineering standards
    └── architecture/
        ├── outbound-pipeline.md         ← Outbound pipeline detailed docs
        └── lead-lifecycle.md
```

## Setup

```bash
npm install
cp .env.example .env   # fill in API keys
```

Required `.env` vars: `N8N_API_URL`, `N8N_API_KEY`, `BASEROW_API_KEY`, `FRAMER_API_TOKEN`, `BRIDGE_SECRET`, `EXA_API_KEY`, `ANTHROPIC_API_KEY`

## n8n Instance

`https://n8n.chronexa.io` — self-hosted on GCP

## Open Issue

The framer-bridge has a bug fix committed locally (duplicate slug idempotency) but not yet deployed to Railway due to a GitHub auth issue. See [HANDOFF.md](HANDOFF.md) for instructions.
