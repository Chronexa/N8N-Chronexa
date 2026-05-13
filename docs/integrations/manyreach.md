# ManyReach Integration Reference

## Account
- **App URL**: https://app.manyreach.com
- **API Docs**: https://app.manyreach.com/api?o=33445#v2/description/introduction
- **API Version**: v2

## Credentials (see .env)
```
MANYREACH_API_KEY=e905cb87-bf60-4257-82e9-9020547b7fd1
MANYREACH_CAMPAIGN_ID=91291
MANYREACH_LIST_ID=95635
MANYREACH_SEQUENCE_ID=119067
```

---

## Auth — CRITICAL

**Header**: `X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1`

This is non-standard. Do NOT use:
- `Authorization: Bearer ...` — wrong
- `Authorization: Token ...` — wrong
- Query param `?apikey=...` — not supported in v2

---

## Live Resources

### Campaign: "Chronexa Outbound v3"
- **Campaign ID**: `91291`
- **Status**: Draft (start manually in UI before first live send)
- **Senders**: All 10 connected accounts (Mon–Fri, 9–5 ET)
- **Daily limit**: 50 per sender
- **Schedule**: Mon–Fri 9:00–17:00 America/New_York

### List: "Chronexa CRM - v3"
- **List ID**: `95635`
- All prospects created from Baserow go into this list

### Sequence
- **Sequence ID**: `119067`
- **Follow-up 1**: Day 3 — body `{custom3}`
- **Follow-up 2**: Day 7 — body `{custom4}`
- **Follow-up 3**: Day 14 — body `{custom5}`

---

## Custom Field Convention (Personalization)

ManyReach supports `{custom1}`–`{custom20}` placeholders in campaign subject and body.
We use this to inject fully AI-generated, per-prospect content:

| Custom Field | Contains |
|---|---|
| `custom1` | Subject line |
| `custom2` | Initial email body |
| `custom3` | Follow-up 1 body |
| `custom4` | Follow-up 2 body |
| `custom5` | Follow-up 3 body |
| `custom6` | Baserow Status at time of push |
| `custom7` | Bucket (BUCKET 1/2/3) |

Campaign template: `subject: "{custom1}"`, `body: "{custom2}"`
Follow-up templates: `body: "{custom3}"`, `{custom4}`, `{custom5}`

---

## Common API Patterns

### Create a prospect
```bash
curl -X POST https://api.manyreach.com/api/v2/prospects \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "baseListId": 95635,
    "firstName": "Jane",
    "lastName": "Doe",
    "company": "Acme Corp",
    "domain": "acme.com",
    "jobPosition": "COO",
    "industry": "SaaS",
    "custom1": "Your Salesforce sync question",
    "custom2": "Email body here...",
    "custom3": "Follow-up 1 here...",
    "custom4": "Follow-up 2 here...",
    "custom5": "Follow-up 3 here..."
  }'
# Returns: { "prospectId": 123456, ... }
```

### Look up prospect by email (for 409 upsert)
```bash
curl "https://api.manyreach.com/api/v2/prospects?email=jane@example.com" \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1"
# Returns: { "items": [{ "prospectId": 123456, ... }] }
```

### Add prospect to campaign (bulk endpoint)
```bash
curl -X POST "https://api.manyreach.com/api/v2/prospects/bulk?listId=95635&campaignId=91291&addOnlyIfNew=false&notInOtherCampaign=false" \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1" \
  -H "Content-Type: application/json" \
  -d '{"prospects": [{"email": "jane@example.com"}]}'
# Returns: { "totalProcessed": 1, "prospectsInserted": 1, "prospectsUpdated": 0 }
```

### Update prospect custom fields (after 409)
```bash
curl -X PATCH "https://api.manyreach.com/api/v2/prospects/{prospectId}" \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1" \
  -H "Content-Type: application/json" \
  -d '{"custom1": "New subject", "custom2": "New body..."}'
```

### List campaigns
```bash
curl "https://api.manyreach.com/api/v2/campaigns?pageQuery.limit=50" \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1"
```

### Add follow-up to sequence
```bash
curl -X POST "https://api.manyreach.com/api/v2/sequences/{sequenceId}/followups" \
  -H "X-API-Key: e905cb87-bf60-4257-82e9-9020547b7fd1" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "{custom3}",
    "waitMin": 3,
    "waitUnits": "Days",
    "useOriginalSubject": true,
    "sendInSameThread": true
  }'
```
**Note**: `waitMin` is the count in `waitUnits`. Max value is 1000. Use `"Days"` for multi-day gaps — never try to express 3 days as 4320 minutes (exceeds max).

---

## Upsert Pattern (handle 409 duplicates)

```js
async function upsertProspect(lead, apiKey, listId) {
  const created = await POST('/api/v2/prospects', { ...lead, baseListId: listId });
  if (created.prospectId) return created.prospectId;

  if (created.status === 409) {
    const found = await GET(`/api/v2/prospects?email=${lead.email}`);
    const existing = found.items[0];
    // Refresh custom fields with latest AI-generated content
    await PATCH(`/api/v2/prospects/${existing.prospectId}`, {
      custom1: lead.custom1,
      custom2: lead.custom2,
      custom3: lead.custom3,
      custom4: lead.custom4,
      custom5: lead.custom5
    });
    return existing.prospectId;
  }
  throw new Error('Prospect creation failed: ' + JSON.stringify(created));
}
```

---

## Senders Configured
| Email | Sender ID | Status |
|---|---|---|
| founder@mail.chronexa.io | 359804 | Active |
| info@chronexa.io | 374083 | Active |
| tushar@mail.chronexa.io | 374100 | Active |
| abhishek@connect.chronexa.org | 374110 | Active |
| outreach@connect.chronexa.org | 374111 | Active |
| tushar@connect.chronexa.org | 374112 | Active |
| ankitdhiman@connect.chronexa.org | 386746 | Active |
| a.dhiman@connect.chronexa.org | 386747 | Active |
| abhishekwalia@connect.chronexa.org | 386748 | Active |
| a.walia@mail.chronexa.io | 386749 | Active |
