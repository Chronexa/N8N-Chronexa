# Handoff to Claude Code

## Project Context
The goal is to build a fully agentic, automated SEO blog generation and publishing workflow using **n8n** as the primary orchestration engine. This is intended to act as an automated marketing team, requiring zero human intervention for the day-to-day blog production cycle.

## Architecture & Integrations
- **Orchestration:** n8n (Enterprise-Grade Architect standards apply, as per `GEMINI.md`).
- **Frontend / Website:** Framer (Project: Chronexa Live)
- **Database / CMS Base:** Airtable (Base ID: `appDyvRC1mKQO6mMJ`)
- **AI Models for Generation & Analysis:**
  - OpenAI (for idea research / content)
  - Claude (for content writing / analysis)
  - Gemini (specifically designated for blog cover image generation)
- **SEO & Analytics:** Google Search Console (GSC) - Keys pending setup by the user.

## Proposed Workflow Phases
1. **Idea Research:** Utilizing AI (e.g., Perplexity, OpenAI, Claude) and GSC data to discover high-value SEO themes, niches, and keywords based on current website context.
2. **Content Writing:** Generating high-quality, authoritative SEO content tailored to the target audience.
3. **Image Generation:** Creating blog cover images using Gemini.
4. **Data Storage:** Saving all generated content, metadata, and image links into the Airtable CMS base.
5. **Publishing:** Automatically pushing the completed blogs from Airtable/n8n to the Framer website via Framer API.

## Current State & Action Items for Claude
- **Credentials:** The user has provided API keys for Framer, OpenAI, Anthropic (Claude), Airtable, and Gemini. **Ensure these are securely saved into a `.env` file** and NEVER printed in logs. 
- **Website Context Gathering:** The user wants to start by understanding the current website context (from Framer) to answer:
  1. What does the company do and what is it about?
  2. What kind of customers are served?
  3. What existing blogs have been written?
  4. What are the content niches, themes, keywords, and SEO strategies?
- **Next Step for Claude:** 
  1. Securely configure the `.env` file with the provided keys from the user's history.
  2. Perform the website context research to answer the 4 questions above.
  3. Propose a detailed, step-by-step n8n architecture for the SEO blog automation workflow based on the 5 phases.