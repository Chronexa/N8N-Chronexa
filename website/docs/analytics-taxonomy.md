# Chronexa — Analytics Taxonomy & KPI Map

**Tool:** Amplitude (Browser SDK v2 + server HTTP API) · **Project:** `chronexa-153286`
**Client key env:** `NEXT_PUBLIC_AMPLITUDE_API_KEY` · **Cal webhook secret env:** `CAL_WEBHOOK_SECRET`
**Code:** `Analytics.tsx` (init) · `lib/analytics.ts` (`track` / `identifyByEmail`) · `TrackView.tsx` · `ScrollDepth.tsx` · `LeadForm.tsx` · `lib/cal.ts` · `app/api/cal/webhook/route.ts`

Single source of truth for what we track and **why** (which business question each event answers). Add a row here whenever you add an event.

---

## 1. KPI framework (what we're trying to learn)

**North-star metric:** qualified **calls booked** (the audit/demo) — the top of our revenue pipeline.

We measure a 5-stage funnel; every event below maps to one stage:

| Stage | Business question | Primary metric | Events that power it |
|---|---|---|---|
| **Acquisition** | Where do visitors come from? Which channels/campaigns? | Sessions, by source | autocapture `[Amplitude] Page Viewed` + attribution (UTM/referrer) |
| **Engagement** | What content holds attention? What do they read? | Pages/session, scroll-through rate, content views | `blog_post_view`, `service_view`, `case_study_view`, `scroll_depth` |
| **Intent** | Who's showing buying signals? | CTA-click rate, form-start rate | `book_cta_click`, `lead_form_start` |
| **Conversion** | Who converts to a lead / a booking? | Lead rate, **booking rate** | `lead_form_submit`, `booking_confirmed` |
| **Retention/quality** | Do bookings hold? Reschedule/cancel/no-show? | Cancel & reschedule rate | `booking_cancelled`, `booking_rescheduled` |

**Key conversion rates to build as Amplitude charts:**
- Visit → CTA click (`book_cta_click` / sessions)
- CTA click → form submit (`lead_form_submit` / `book_cta_click`)
- Form submit → booking (`booking_confirmed` / `lead_form_submit`) ← the loop the Cal webhook closes
- Booking → held (1 − `booking_cancelled` / `booking_confirmed`)
- Segment **all** of the above by `utm_source`, `referrer`, landing page, and content `category`.

---

## 2. Custom events (hand-instrumented)

### Engagement
| Event | Fires when | Properties | Code |
|---|---|---|---|
| `blog_post_view` | A blog post renders | `slug`, `title`, `category` | `blog/[slug]/page.tsx` → `TrackView` |
| `service_view` | A service/solution page renders | `slug`, `name`, `category` | `ServiceArticle.tsx` → `TrackView` |
| `case_study_view` | A case study renders | `slug`, `title`, `client`, `industry` | `case-studies/[slug]/page.tsx` → `TrackView` |
| `scroll_depth` | Reader passes 50% then 90% of a content page (once each) | `percent` (50\|90), `page_type` (blog\|service\|case_study), `slug` | `ScrollDepth.tsx` |

### Intent
| Event | Fires when | Properties | Values |
|---|---|---|---|
| `book_cta_click` | Any "Book / Get a free audit" button **or** a form submit | `location` | `hero`, `nav`, `painpoints`, `service-hero`, `service-sidebar`, `usecase-hero`, `blog-post`, `case-study`, `contact-intro`, `form:contact`, `form:cta-band` |
| `lead_form_start` | First focus on a lead-form field | `source` | `contact`, `cta-band` |

### Conversion
| Event | Fires when | Properties |
|---|---|---|
| `lead_form_submit` | Lead form submitted (valid name + email). Also calls `identifyByEmail`. | `source` (`contact`\|`cta-band`) |
| `booking_confirmed` | **Server** — Cal.com `BOOKING_CREATED` | `booking_uid`, `event_title`, `event_type_slug`, `start_time`, `duration_min`, `attendee_timezone`, `trigger` |
| `booking_requested` | **Server** — `BOOKING_REQUESTED` (confirmation-required flow) | (as above) |
| `booking_rejected` | **Server** — `BOOKING_REJECTED` | (as above) |
| `booking_cancelled` | **Server** — `BOOKING_CANCELLED` | …+ `cancellation_reason` |
| `booking_rescheduled` | **Server** — `BOOKING_RESCHEDULED` | …+ `reschedule_uid` |

### Retention / quality (server — Cal.com)
| Event | Fires when | Why it matters |
|---|---|---|
| `meeting_completed` | `MEETING_ENDED` | The call actually happened — the **strongest qualified-lead signal** (not just booked, but held) |
| `booking_no_show` | `BOOKING_NO_SHOW_UPDATED` | No-show rate — pipeline quality + whether reminders are working |

> A form submit deliberately fires **both** `lead_form_submit` (with `source`) and `book_cta_click` (`location: "form:<source>"`). Use `lead_form_submit` for form conversions; `book_cta_click` for *all* booking intent (buttons + forms).

---

## 3. Autocapture events (fired automatically by the SDK)

Enabled in `Analytics.tsx`. Amplitude prefixes these `[Amplitude]`. They cover the long tail so we don't hand-code generic clicks.

| Event | Captures |
|---|---|
| `[Amplitude] Page Viewed` | Every load **and** SPA route change (Page URL/Path/Title, referrer) |
| `[Amplitude] Element Clicked` | Clicks (tag, text, href, id, class) — derive nav/outbound clicks here |
| `[Amplitude] Element Changed` | Input/select changes |
| `[Amplitude] Form Started` / `Form Submitted` | Native form interaction |
| `[Amplitude] File Downloaded` | File-link clicks |
| `[Amplitude] Start Session` / `End Session` | Session boundaries |

---

## 4. Identity & attribution

| Field | Meaning |
|---|---|
| `device_id` | Anonymous per-browser (cookie `AMP_80b7ff9a78`) |
| `user_id` | Set to the **lowercased email** when a visitor submits the lead form (`identifyByEmail`). This is the **merge key**: the anonymous browsing journey + the form + the server-side Cal booking all resolve to one user. |
| Attribution (user props) | `utm_source/medium/campaign/term/content`, `referrer`, `referring_domain`, `gclid`, `fbclid` — first-touch (cookie `AMP_MKTG_80b7ff9a78`) |

**Session Replay** on at 100% (`sampleRate: 1`); **Engagement (Guides & Surveys)** plugin loaded.

---

## 5. Server-side booking events (Cal.com webhook)

`POST /api/cal/webhook` (`app/api/cal/webhook/route.ts`, Node runtime). Verifies Cal's `X-Cal-Signature-256` HMAC against `CAL_WEBHOOK_SECRET`, maps the trigger to an event, and forwards to Amplitude's HTTP API keyed by attendee email.

**Setup checklist:**
1. Cal.com → Settings → Developer → **Webhooks** → Subscriber URL = `https://chronexa.io/api/cal/webhook`
2. Triggers: `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`
3. Copy the webhook's **signing secret** → add `CAL_WEBHOOK_SECRET` in Vercel (Production). Until set, the endpoint accepts unverified payloads (logs a warning) so you can test.
4. The Cal **API key** is *not* used here (webhook-based). Rotate the one shared in chat.

---

## 6. Conventions for adding events

- **Names:** custom events use `snake_case` (`book_cta_click`); leave the `[Amplitude]` prefix to autocapture.
- **How:** `import { track } from '@/lib/analytics'` → `track('event_name', { prop })`. SSR-safe, never throws. For page-type views use `<TrackView event=… props=… />`.
- **Properties:** keep them few, stable, low-cardinality (`location`, `source`, `category`, `page_type`). Document every new event here.
- **Don't double-track:** prefer autocapture for generic clicks; add a named event only for high-value, decision-driving actions.
