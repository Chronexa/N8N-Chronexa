# Exa AI Integration Reference

## Account
- **App URL**: https://exa.ai
- **API Docs**: https://docs.exa.ai
- **API Base**: `https://api.exa.ai`
- **API Version**: v1

## Credentials (see .env)
```
EXA_API_KEY={{EXA_API_KEY}}
```

---

## Auth — CRITICAL

**Header**: `x-api-key: {key}` (lowercase)

Do NOT use:
- `Authorization: Bearer ...` — wrong
- `X-API-Key: ...` — wrong capitalisation (some endpoints may accept, use lowercase to be safe)

---

## Role in Outbound Pipeline

Exa replaced Perplexity (May 2026 — Perplexity quota exhausted, card billing issues).

Two calls are made per lead, sequentially:

| Call | Endpoint | Purpose | Output field |
|---|---|---|---|
| Exa News Search | `POST /search` | Find recent company news/events (last 90 days) | `RECENT_TRIGGER` |
| Exa Company Crawl | `POST /contents` | Crawl company homepage for profile | `SUMMARY`, `TECH_STACK_HINTS`, `REGULATED_INDUSTRY` |

Cost per lead: ~$0.011 ($0.009 search + $0.002 contents)

---

## Live n8n Node Configs

### Exa News Search (`id: a48e088c`, type: httpRequest v4.2)

```json
{
  "method": "POST",
  "url": "https://api.exa.ai/search",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "x-api-key", "value": "{{EXA_API_KEY}}" },
      { "name": "Content-Type", "value": "application/json" }
    ]
  },
  "sendBody": true,
  "contentType": "json",
  "jsonBody": "={{ ({ \"query\": $json.company_name + \" \" + $json.company_domain + \" recent news funding product launch hiring expansion leadership 2025 2026\", \"numResults\": 3, \"type\": \"auto\", \"startPublishedDate\": \"2025-09-01\", \"contents\": { \"summary\": { \"query\": \"What is the single most important recent business event for this company from the last 90 days?...\" } } }) }}",
  "onError": "continueErrorOutput"
}
```

**Key params:**
- `type: "auto"` — lets Exa choose neural vs keyword search per query
- `startPublishedDate` — filter to last ~90 days of news
- `numResults: 3` — top 3 results, we use the first
- `contents.summary.query` — targeted prompt for extracting the trigger event

### Exa Company Crawl (`id: exa-crawl-0001`, type: httpRequest v4.2)

```json
{
  "method": "POST",
  "url": "https://api.exa.ai/contents",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "x-api-key", "value": "{{EXA_API_KEY}}" }
    ]
  },
  "sendBody": true,
  "contentType": "json",
  "jsonBody": "={{ ({ \"ids\": [\"https://\" + $(\"Normalize Lead Input\").item.json.company_domain], \"text\": { \"maxCharacters\": 600 }, \"summary\": { \"query\": \"Provide: 1) SUMMARY: ... 2) TECH_STACK: ... 3) REGULATED: YES or NO\" } }) }}",
  "onError": "continueErrorOutput"
}
```

**Key params:**
- `ids` — direct URL crawl, bypasses search entirely
- `text.maxCharacters: 600` — raw text cap to control cost
- `summary.query` — structured prompt asking for 3 labelled sections (SUMMARY, TECH_STACK, REGULATED)

---

## Response Format

### `/search` response

```json
{
  "results": [
    {
      "id": "https://...",
      "title": "Rippling Appoints SVP of Engineering...",
      "url": "https://...",
      "publishedDate": "2026-04-14T00:00:00.000Z",
      "score": 1.0,
      "summary": "Rippling appointed Sonia Parandekar as SVP...",
      "text": "..."
    }
  ],
  "costDollars": { "total": 0.009 }
}
```

**Read RECENT_TRIGGER from**: `results[0].summary`

### `/contents` response

```json
{
  "results": [
    {
      "id": "https://rippling.com",
      "title": "Rippling",
      "summary": "Summary:\nRippling offers a unified workforce platform...\n\nTECH_STACK:\nNOT FOUND...\n\nREGULATED:\nNO",
      "text": "..."
    }
  ],
  "costDollars": { "total": 0.002 }
}
```

**Read SUMMARY, TECH_STACK_HINTS, REGULATED_INDUSTRY from**: `results[0].summary` — parsed with regex in Parse Exa Response node.

---

## Parse Exa Response Node Logic

The Set node (`id: 538a5139`, now named "Parse Exa Response") extracts the 4 intelligence fields:

```js
// RECENT_TRIGGER — from Exa News Search output
$("Exa News Search").item.json.results?.[0]?.summary || 'NOT FOUND'

// SUMMARY — parse "SUMMARY: ..." section from crawl summary
const summary = $json.results[0].summary;
summary.match(/SUMMARY[\s:]+(.+?)(?=TECH_STACK|REGULATED|$)/si)?.[1]?.trim()

// TECH_STACK_HINTS — parse "TECH_STACK: ..." section
summary.match(/TECH_STACK[\s:]+(.+?)(?=REGULATED|$)/si)?.[1]?.trim() || 'NOT FOUND'

// REGULATED_INDUSTRY — parse "REGULATED: YES/NO"
summary.match(/REGULATED[\s:]+(YES|NO)/i)?.[1]?.toUpperCase() || 'NO'
```

**No fence stripping needed** — Exa returns plain text summaries, not JSON wrapped in markdown.

---

## Exa Search Types

| Type | Best for |
|---|---|
| `"auto"` | Default — Exa picks neural vs keyword. Use this. |
| `"neural"` | Semantic similarity search. Better for "find companies like X" |
| `"keyword"` | Exact keyword match. Better for specific named entities |

For company news searches, `"auto"` consistently performs best.

---

## Common API Patterns

### Search for recent news
```bash
curl -X POST "https://api.exa.ai/search" \
  -H "x-api-key: {{EXA_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Accenture recent funding product launch expansion 2026",
    "numResults": 3,
    "type": "auto",
    "startPublishedDate": "2025-09-01",
    "contents": {
      "summary": { "query": "What is the most notable recent business event?" }
    }
  }'
```

### Crawl a specific URL
```bash
curl -X POST "https://api.exa.ai/contents" \
  -H "x-api-key: {{EXA_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["https://rippling.com"],
    "text": { "maxCharacters": 600 },
    "summary": { "query": "Company overview, tech stack, regulated industry?" }
  }'
```

---

## Exa vs Perplexity Comparison

| Dimension | Perplexity (sonar) | Exa |
|---|---|---|
| Architecture | LLM synthesises from web search | Returns real sourced documents + optional LLM summary |
| Citations | Hallucination-prone | Real URLs with publish dates |
| Auth header | `Authorization: Bearer` | `x-api-key` (lowercase) |
| Response format | `choices[0].message.content` (streaming buffer hack) | `results[0].summary` (clean JSON) |
| Parse complexity | 60+ lines of buffer byte assembly | 5 lines of regex |
| Cost/lead | ~$0.005-0.01 (quota hit) | ~$0.011 (2 calls) |
| Reliability | Quota exhausted May 2026 | Active |

---

## Known Limitations

1. **Parked/inactive domains**: If `company_domain` is a GoDaddy parked page, the `/contents` crawl returns no useful data — SUMMARY/TECH_STACK/REGULATED all come back as NOT FOUND. The email generation falls back to Apollo enrichment fields (title, industry, keywords, technologies).

2. **No news for obscure companies**: Mid-market companies (~60%) return no news results for the 90-day window. RECENT_TRIGGER = "NOT FOUND" triggers the fallback prompt in Anthropic email generation.

3. **TECH_STACK_HINTS from homepage**: Company homepages rarely list the software they use internally. Exa often returns NOT FOUND here — the Apollo `technologies` field from the feeder is more reliable for tech stack data.
