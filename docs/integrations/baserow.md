# Baserow Integration Reference

## Account
- **URL**: https://app.baserow.io
- **Email**: team@chronexa.io
- **Workspace ID**: 200019
- **Database ID**: 435827 (Chronexa CRM)

## Credentials (see .env)
| Variable | Purpose | Scope |
|---|---|---|
| `BASEROW_API_KEY` | `{{BASEROW_API_KEY}}` | Row CRUD — Customers + Projects tables |
| `BASEROW_API_KEY_2` | `{{BASEROW_TOKEN}}` | Row CRUD — Leads table (used in n8n) |
| `BASEROW_PASSWORD` | In .env | Needed to generate JWT for schema ops |
| `BASEROW_REFRESH_TOKEN` | In .env | 7-day TTL, use to get new access JWT |

---

## Auth Rules

### Row operations (read/write/update/delete rows)
```
Authorization: Token {{BASEROW_TOKEN}}
```

### Schema operations (create table, create field, create view)
Requires a JWT. Database tokens **cannot** do this — hard Baserow constraint.

```bash
# Step 1: Get JWT (expires in ~10 minutes)
curl -X POST https://api.baserow.io/api/user/token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"email": "team@chronexa.io", "password": "YOUR_PASSWORD"}'
# Returns: { "access_token": "eyJ...", "refresh_token": "eyJ..." }

# Step 2: Use JWT for schema operations
curl -X POST https://api.baserow.io/api/database/fields/table/968761/ \
  -H "Authorization: JWT eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name": "New Field", "type": "text"}'
```

---

## Leads Table

**Table ID**: `968761`
**Row endpoint**: `https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true`

Always append `?user_field_names=true` — otherwise you get `field_8466525` instead of `First Name`.

### Fields
| Field Name | Field ID | Type | Notes |
|---|---|---|---|
| First Name | 8466525 | text | Primary field |
| Last Name | 8466552 | text | |
| Email | 8466553 | email | |
| Company Name | 8466554 | text | |
| Company Domain | 8466555 | url | |
| Title | 8466556 | text | Contact job title |
| Industry | 8466557 | text | |
| Keywords | 8466558 | long_text | Company-own language |
| Technologies | 8466559 | long_text | Tech stack |
| Employees | 8466560 | text | Headcount |
| Annual Revenue | 8466562 | text | |
| Recent Trigger | 8466563 | long_text | From Perplexity — often "NOT FOUND" |
| Bucket | 8466564 | text | BUCKET 1/2/3 from Anthropic routing |
| Subject | 8466565 | text | AI-generated subject line |
| Initial Email | 8466566 | long_text | AI-generated email body |
| Follow Up 1 | 8466567 | long_text | Day 3 follow-up |
| Follow Up 2 | 8466569 | long_text | Day 7 follow-up |
| Follow Up 3 | 8466570 | long_text | Day 14 follow-up |
| Status | 8466572 | single_select | Lead lifecycle state |

### Status Field Options
| Value | Option ID | Color |
|---|---|---|
| Email Ready | 6136389 | green |
| Approved | 6136390 | blue |
| In Campaign | 6136391 | orange |
| Replied | 6136392 | purple |
| Unsubscribed | 6136393 | yellow |
| Bounced | 6136394 | red |
| DLQ | 6136395 | dark-red |

### Views
| View | ID | Type |
|---|---|---|
| All Leads | 1898986 | Grid |
| Leads by Status | 1898987 | Kanban (by Status field) |

---

## Common API Patterns

### Create a row
```bash
curl -X POST "https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true" \
  -H "Authorization: Token {{BASEROW_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "First Name": "Jane",
    "Email": "jane@example.com",
    "Status": "Email Ready"
  }'
```

### Update a row (PATCH — only sends changed fields)
```bash
curl -X PATCH "https://api.baserow.io/api/database/rows/table/968761/{row_id}/?user_field_names=true" \
  -H "Authorization: Token {{BASEROW_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"Status": "In Campaign"}'
```

### Filter by Status (single_select — use option ID, NOT string value)
```bash
# Fetch all "Approved" leads
curl "https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true&filter__Status__single_select_equal=6136390" \
  -H "Authorization: Token {{BASEROW_TOKEN}}"
```

### List fields (to get field IDs after schema changes)
```bash
curl "https://api.baserow.io/api/database/fields/table/968761/" \
  -H "Authorization: Token {{BASEROW_TOKEN}}"
```

---

## In n8n: HTTP Request Node Configuration

```json
{
  "method": "POST",
  "url": "https://api.baserow.io/api/database/rows/table/968761/?user_field_names=true",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Authorization", "value": "Token {{BASEROW_TOKEN}}" }
    ]
  },
  "sendBody": true,
  "contentType": "json",
  "specifyBody": "json",
  "jsonBody": "={{ ({ \"First Name\": $json.first_name || '', \"Status\": \"Email Ready\" }) }}"
}
```

Key rules:
- `authentication: "none"` — never use `genericCredentialType` with inline headers
- No `Content-Type` header manually — `contentType: 'json'` adds it automatically
- Body is a plain object expression — no `JSON.stringify`
- `onError: "continueErrorOutput"` — failures appear in `main[1]`, not `main[0]`
