# Enterprise Agentic Blog Automation — Architecture Spec
**⚠️ SUPERSEDED — This document reflects pre-production design assumptions from 2026-05-09.**
**Canonical reference: `docs/BLOG_AUTOMATION_ARCHITECTURE.md` (verified live state as of 2026-05-13)**

---

**Chronexa.io | Status: SUPERSEDED | Original Date: 2026-05-09**

---

## 1. Strategic Context

**Chronexa Identity:** AI orchestration firm replacing expensive SaaS point-solutions with custom workflows. Target: mid-market CXOs/COOs in Wealth Management, Supply Chain, SaaS, and Agency sectors.

**Voice:** Authoritative, technical B2B thought leadership. Anti-generic-SaaS. Author persona: Ankit Dhiman, Head of Strategy.

**Goal:** Zero-human-in-the-loop (0-HITL) SEO blog engine producing 3–5 posts/week that generate inbound leads, build authority, and rank on Google.

**Existing state:** 123 blog posts already live on Framer site. Pipeline must avoid duplicate topics.

---

## 2. Architecture Overview

Five modular n8n sub-workflows orchestrated by a master scheduler, with Airtable as the state machine.

```
[Schedule] → [Agent 1: SEO Strategist] → Airtable (status: idea_generated)
                                            ↓
                                     [Agent 2: Researcher] → Airtable (status: research_complete)
                                            ↓
                                     [Agent 3: Copywriter] → Airtable (status: copy_written)
                                            ↓
                                     [Agent 4: Image Designer] → Airtable (status: ready_to_publish)
                                            ↓
                                     [Agent 5: Publisher] → Framer CMS → Airtable (status: published)
```

---

## 3. Airtable CMS Schema

**Base ID:** `appDyvRC1mKQO6mMJ`

### Table: `blog_pipeline`
| Field | Type | Description |
|-------|------|-------------|
| `title` | Single line text | SEO-optimized blog title |
| `slug` | Single line text | URL slug (auto-generated) |
| `status` | Single select | `idea_generated` → `research_complete` → `copy_written` → `ready_to_publish` → `published` → `failed` |
| `target_keyword` | Single line text | Primary keyword |
| `secondary_keywords` | Long text | Comma-separated |
| `persona` | Single select | `rIA`, `supply_chain`, `saas_founder`, `agency_owner`, `cpa_firm` |
| `thesis` | Long text | Core argument / unique angle |
| `research_brief` | Long text | Raw research from Perplexity |
| `meta_description` | Single line text | 155-char SEO description |
| `html_body` | Long text | Framer-formatted HTML content |
| `cover_image_url` | URL | Generated cover image (Gemini) |
| `cover_image_prompt` | Long text | Prompt used for image generation |
| `framer_item_id` | Single line text | ID returned from Framer after publish |
| `error_log` | Long text | Error details if status = failed |
| `created_at` | Date | Auto-set on row creation |
| `published_at` | Date | Set when published to Framer |
| `word_count` | Number | Approximate word count |
| `gsc_keyword_volume` | Number | Search volume (from GSC, optional) |

---

## 4. Agent Specifications

### Agent 1: SEO Strategist (`blog-agent-1-strategist`)
**Trigger:** Schedule — Every Monday & Thursday at 8:00 AM UTC  
**Output:** 3 new rows in Airtable `blog_pipeline` with status `idea_generated`

**Steps:**
1. **Fetch Existing Topics** — HTTP Request → Airtable API → get all `title` + `target_keyword` values (deduplicate)
2. **Trend Research** — HTTP Request → Perplexity API (`sonar-pro` model) with prompt: "What are the top 5 emerging pain points and questions being discussed in [RIA/Supply Chain/SaaS/Agency] operations circles this week related to AI and workflow automation?"
3. **GSC Analysis** (when available) — HTTP Request → GSC API → get queries with impressions > 50 and position 11–30 ("striking distance" keywords)
4. **Brief Generation** — HTTP Request → Anthropic API (Claude Sonnet) → given trends + existing topics + Chronexa voice, generate 3 blog briefs each with: `title`, `target_keyword`, `secondary_keywords`, `persona`, `thesis`
5. **Output Parser** — Code Node → parse JSON array of 3 briefs
6. **Deduplication IF** — Check generated titles against existing Airtable topics
7. **Airtable Create** — Create 3 new rows with status `idea_generated`
8. **Error Handling** — On any failure: set `status = failed`, log error, continue to next item

### Agent 2: Deep Researcher (`blog-agent-2-researcher`)
**Trigger:** Airtable (polling every 15 min) — filter: `status = idea_generated`  
**Processes:** 1 record at a time (to manage API costs)

**Steps:**
1. **Lock Record** — Immediately set status to `researching` (prevents double-processing)
2. **Perplexity Research** — HTTP Request → Perplexity API with thesis + keyword → get citations, stats, competitor analysis, recent news
3. **Parse & Structure** — Code Node → extract key statistics, quotes, competitor insights, recommended subheadings
4. **Update Airtable** — Set `research_brief` field, set status `research_complete`
5. **Error** → set status `failed`, log error

### Agent 3: Master Copywriter (`blog-agent-3-copywriter`)
**Trigger:** Airtable polling — filter: `status = research_complete`

**Steps:**
1. **Lock** — Set status `writing`
2. **Fetch Context** — Pull existing blog titles to avoid repeated angles
3. **Claude Content Generation** — HTTP Request → Anthropic API (Claude Sonnet 4.5+)
   - System prompt encodes Chronexa voice, Framer HTML format, B2B authority tone
   - Generates: full HTML body (1,800–2,500 words), meta description, slug, word count
4. **Output Parser** — Code Node → validate JSON structure, check HTML has h1/h2 tags, min 1,500 words
5. **Quality Gate IF** — Word count < 1,200 → retry once, then fail
6. **Update Airtable** — Set `html_body`, `meta_description`, `slug`, `word_count`, status `copy_written`
7. **Error** → status `failed`, log

### Agent 4: Image Designer (`blog-agent-4-designer`)
**Trigger:** Airtable polling — filter: `status = copy_written`

**Steps:**
1. **Lock** — Set status `generating_image`
2. **Prompt Engineering** — HTTP Request → Anthropic API → read title + thesis → generate a conceptual, enterprise-grade image prompt (no text in image, abstract/metaphorical style)
3. **Image Generation** — HTTP Request → Gemini API (`imagen-3.0-generate-002`) → generate 1024×576 cover image
4. **Image Upload** — HTTP Request → upload to a hosted URL (Cloudflare R2 or direct Framer upload endpoint)
5. **Update Airtable** — Set `cover_image_url`, `cover_image_prompt`, status `ready_to_publish`
6. **Error** → status `failed`, log

### Agent 5: Publisher (`blog-agent-5-publisher`)
**Trigger:** Airtable polling — filter: `status = ready_to_publish`

**Steps:**
1. **Lock** — Set status `publishing`
2. **Build Framer Payload** — Code Node → map Airtable fields to Framer field IDs:
   - `eu1SUO8Ae` ← `title`
   - `Ot6aVH0Gv` ← `meta_description`
   - `mmsKK_xBb` ← today's date
   - `fSfrbBQqV` ← `html_body`
   - `S9w7PJblN` ← `"Blog"` (fixed)
   - `vJMe6fpJL` ← `true` (publish immediately)
   - `zD3ZKyyO9` ← `cover_image_url`
   - `AblEkj9p6` ← `"Ankit Dhiman"` (fixed)
   - `CEKcF7GJb` ← `"Head of Strategy"` (fixed)
3. **Framer API Create Item** — HTTP Request → `POST` to Framer Server API → Collection `L8b3IANtH`
4. **Validate Response** — IF node → check `item.id` returned
5. **Update Airtable** — Set `framer_item_id`, `published_at`, status `published`
6. **Error** → status `failed`, log

---

## 5. Technical Standards

### Error Recovery
- Each agent sets status to a locked intermediate state immediately to prevent double-processing
- All HTTP Request nodes use exponential backoff retry (3 attempts)
- Failed records get `error_log` populated for manual review
- Dead letter queue: separate Airtable view filtered on `status = failed`

### Rate Limits & Cost Management
- Agents 2–5 process ONE record at a time (not batch) to stay within API rate limits
- Perplexity calls limited to Agent 1 (weekly) and Agent 2 (per article) only
- Claude used for writing + prompt engineering only (not research)
- Gemini used for images only

### Framer HTML Format
All generated HTML must use Framer's dir attribute format:
```html
<h1 dir="auto">Heading Here</h1>
<p dir="auto">Paragraph text.</p>
<h2 dir="auto">Subheading</h2>
<blockquote dir="auto">Quote text.</blockquote>
```

### n8n Deployment Targets
- n8n instance: `https://n8n.chronexa.io`
- Deploy as DRAFT first, test with 1 article end-to-end, then activate production schedule

---

## 6. Build Order

1. **Airtable Setup** — Create `blog_pipeline` table with correct schema
2. **Agent 5 (Publisher)** — Test the Framer publishing plumbing first (smallest blast radius)
3. **Agent 3 (Copywriter)** — Core value; test with a manually-written brief
4. **Agent 4 (Designer)** — Image generation
5. **Agent 2 (Researcher)** — Research enrichment
6. **Agent 1 (Strategist)** — Full automation trigger
7. **Integration Test** — End-to-end with 1 article, verify on live site

---

## 7. Pending Dependencies

| Dependency | Status | Action Required |
|------------|--------|-----------------|
| Airtable token scopes | Blocked | User: add `data.records:read/write` + base access |
| GSC API keys | Pending | User to provide service account JSON |
| Image hosting | TBD | Decide: Cloudflare R2, Framer direct upload, or Airtable attachment |
| Perplexity API key | Not in .env | User to provide |

---

*Architecture by Claude Code | Chronexa.io | 2026-05-09*
