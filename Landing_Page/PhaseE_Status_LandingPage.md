# 🌿 Canopy — Phase E: Current Status + Landing Page

> Focused reference file. Use this in a new chat alongside PhaseE_Part1.md for full context.
> This file covers: revised Phase E plan, landing page spec, and backend gaps discovered.

---

## Quick Project Context

- **Project:** Canopy — Multi-Tenant Feature Flag Service (portfolio project)
- **GitHub:** https://github.com/rajpatel0554/Canopy
- **Backend:** Java 21 + Spring Boot 4.x on port **8081** — Phases A–D complete ✅
- **Frontend:** Next.js (App Router) + Tailwind + shadcn/ui — Phase E in progress
- **Design System:** Sage & Linen theme — Forest `#1c3a2f`, Mint `#6ee7b7`, Linen `#f7f7f2`
- **Fonts:** DM Serif Display (headings), DM Sans (body), JetBrains Mono (flag keys/code)

---

## Revised Phase E — Full Step Plan

> Landing page was added as Part 3. Everything shifted down by one.

```
✅ Part 1 — Project Setup
      Next.js, Tailwind, shadcn/ui, Sage & Linen theme,
      TypeScript types, API client (lib/api.ts), CORS fix on backend

🔄 Part 2 — Login + Register Pages         (building in separate chat)
      Auth.js session, split panel layout (Forest left / White right),
      connects to POST /api/auth/login and /api/auth/register

⏭  Part 3 — Landing Page                   ← NEXT TO BUILD
      Static page at app/page.tsx
      No backend calls — pure UI

⏭  Part 4 — App Shell (Sidebar + Dashboard Layout)
      Forest sidebar, top bar, route groups (auth) vs (dashboard)

⏭  Part 5 — Flags List Page
      Table, toggle switches, create flag modal

⏭  Part 6 — Flag Detail Page               ← needs 2 backend fixes first (see below)
      Targeting rules tab, segments tab, rollout slider

⏭  Part 7 — Segments Page
      Segments list, create modal, manage rules

⏭  Phase F — Deploy
      Vercel (frontend) + Railway (backend + DB)
```

### Why Landing Page Before Sidebar

Build landing page (`/`) before the dashboard layout. If you set up the sidebar layout first and accidentally scope it to `/`, the sidebar appears on the landing page. Building it standalone first keeps concerns clean.

---

## Part 3 — Landing Page Spec

**File:** `app/page.tsx`
**Route:** `/` (home, fully public, no auth required)
**Type:** 100% static — zero API calls, zero backend dependency

### Sections (top to bottom)

| Section | Content |
|---|---|
| **Nav** | Forest `#1c3a2f` bg · 🌿 Canopy logo (DM Serif) · GitHub link · Login · Get Started → button |
| **Hero** | Badge "Open Source · Portfolio Project" · Serif headline "Ship features faster. Stay in control." · Subtext · Two CTA buttons · Mini dashboard mockup image below |
| **Features** | 3-column card grid on white bg · Kill Switches · Context-Based Targeting · Percentage Rollouts |
| **How It Works** | 3-step flow on Linen bg · Create a flag → Set your rules → Evaluate in code |
| **Evaluation API** | Dark Forest bg · Two code blocks side by side (request + response) |
| **Variation Types** | 4-column grid · Boolean / String / Number / JSON with badge colors |
| **Footer** | Forest bg · Logo + tagline · GitHub link · Stack pills (Next.js, Spring Boot, PostgreSQL, Java 21) · "Built by Raj Patel · 2025" |

### Hero Mini Dashboard Mockup

A visual replica of the flags table (not a real component — purely decorative HTML/CSS):

```
Columns: Flag Key | Name | Type | Rollout | Status
Row 1:   new-checkout-flow  | New Checkout | Boolean  | 100% ████ | Toggle ON
Row 2:   ui-theme-variant   | UI Theme     | String   |  50% ██   | Toggle ON
Row 3:   max-upload-size    | Upload Limit | Number   |  25% █    | Toggle OFF
Row 4:   theme-config       | Theme Config | JSON     |  10% ▏    | Toggle OFF
```

### Badge Colors (match existing design system)

| Type | Background | Text |
|---|---|---|
| Boolean | `#d1fae5` | `#059669` |
| String | `#ede9fe` | `#6d28d9` |
| Number | `#fef3c7` | `#d97706` |
| JSON | `#fee2e2` | `#dc2626` |

### Nav Buttons

```
GitHub    → btn-ghost  (mint border, mint text, transparent bg)
Login     → btn-ghost  (same)
Get Started → btn-primary (mint bg, forest text, font-weight 700)
```

### CTA Buttons (Hero)

```
"Get Started Free →"  → bg: #1c3a2f, text: #f7f7f2, font-weight: 700
"⭐ View on GitHub"   → transparent bg, border: #d1fae5, text: #374151
```

### Feature Cards

```
bg: #f7f7f2  border: #d1fae5  border-radius: 12px  padding: 28px 24px
Icon box: 44×44px, bg: #1c3a2f, rounded 10px, icon color: #6ee7b7
Title: 16px font-weight 700 color: #1c3a2f
Desc: 14px color: #9ca3af line-height: 1.6
```

### How It Works Steps

```
Step numbers: 48px circle, bg: #1c3a2f, text: #6ee7b7, DM Serif Display
Connector line between steps: height 2px, bg: #d1fae5
Title: 16px font-weight 700 color: #1c3a2f
Desc: 14px color: #9ca3af
```

### API Code Section

```
Background: #1c3a2f (Forest)
Two side-by-side dark cards (rgba(0,0,0,0.25) bg)
Card header: smaller dark band, monospace label text

Left card — Request:
  POST /api/evaluate/new-checkout-flow
  Body: { "context": { "userId", "email", "plan", "country" } }

Right card — Response:
  200 OK
  Body: { "value": "true", "variationType": "BOOLEAN", "enabled": true }
  Comment: // Matched: targeting rule — plan EQUALS "pro" → ON

Syntax colors:
  Methods/booleans: #6ee7b7 (mint)
  Keys:             #a78bfa (purple)
  Strings:          #6ee7b7 (mint)
  URLs:             #fbbf24 (amber)
  Comments:         rgba(255,255,255,0.3)
```

### Footer

```
Background: #1c3a2f
Left: 🌿 Canopy (DM Serif, #f7f7f2) + tagline "Multi-Tenant Feature Flag Service"
Right: "GitHub →" link + "Portfolio Project" badge
Divider: 1px rgba(110,231,183,0.1)
Bottom row left: "Built by Raj Patel · 2025" (rgba(247,247,242,0.3))
Bottom row right: Stack pills — Next.js · Spring Boot · PostgreSQL · Java 21
```

---

## Backend Gaps — What Needs Fixing Before Part 6

> Parts 3, 4, 5 need zero backend changes.
> Part 6 (Flag Detail Page) needs these two endpoints before you start building it.

### Gap 1 — Missing `GET /api/flags/{flagKey}/variations`

**Why needed:** Flag Detail page has a "Add Targeting Rule" form. The variation dropdown (which variation does this rule return?) needs to fetch the list of variations for the flag.

**Where to add:** `FlagController.java` — one new GET method.

**Response shape:**
```json
[
  { "variationId": "uuid", "flagId": "uuid", "value": "true", "isDefault": true },
  { "variationId": "uuid", "flagId": "uuid", "value": "false", "isDefault": false }
]
```

### Gap 2 — Missing `GET /api/flags/{flagKey}/segments`

**Why needed:** Flag Detail page has a Segments tab showing which segments are currently attached to this flag. POST and DELETE to attach/detach already exist, but there's no GET to retrieve the current list.

**Where to add:** `FlagController.java` or `SegmentController.java` — one new GET method.

**Response shape:**
```json
[
  { "segmentId": "uuid", "name": "Beta Testers", "description": "...", "rules": [...] }
]
```

### Gap 3 — CORS for Production (Fix at Deploy Time)

**Why needed:** `CorsConfig.java` currently hardcodes `http://localhost:3000`. When deployed to Vercel, the backend on Railway will reject all requests from the Vercel URL.

**Fix:** Read allowed origin from environment variable:

```java
config.setAllowedOrigins(List.of(
    "http://localhost:3000",
    System.getenv().getOrDefault("ALLOWED_ORIGIN", "")
));
```

Then set `ALLOWED_ORIGIN=https://your-app.vercel.app` in Railway environment variables at deploy time.

**When to fix:** Phase F (Deploy) — not needed until then.

---

## When to Fix Each Gap

| Gap | Fix Before | Priority |
|---|---|---|
| Gap 1 — Flag variations endpoint | Part 6 (Flag Detail) | High |
| Gap 2 — Attached segments endpoint | Part 6 (Flag Detail) | High |
| Gap 3 — Production CORS | Phase F (Deploy) | Low for now |

---

## Completion Status

```
✅ Phase A — Tenant Schema Provisioning
✅ Phase B — Auth Layer (JWT + Register + Login)
✅ Phase C — Flag CRUD + Evaluation Engine
✅ Phase D — Targeting Rules + Segments + Percentage Rollouts
✅ Phase E Part 1 — Project Setup + Theme + Types + API Client + CORS
🔄 Phase E Part 2 — Login + Register Pages (in progress)
⏭  Phase E Part 3 — Landing Page             ← build next
⏭  Phase E Part 4 — App Shell + Sidebar
⏭  Phase E Part 5 — Flags List Page
⏭  Phase E Part 6 — Flag Detail Page
⏭  Phase E Part 7 — Segments Page
⏭  Phase F        — Deploy (Vercel + Railway)
```

---

## Prompt for New Chat

```
I am building Canopy — a multi-tenant feature flag service as a portfolio project.

I have two reference files:
- PhaseE_Part1.md — full project context (Phases A–D) + Part 1 setup details
- PhaseE_Status_LandingPage.md — current status, revised Phase E plan, and landing page spec

Please read both files before responding.

Act as a Senior Frontend Developer and Project Manager mentoring a beginner.
Explain concepts before code. Go step by step.

I want to build Phase E Part 3 — the Landing Page (app/page.tsx).
Walk me through it step by step. Start by confirming you've read both files
and summarizing what we're building before writing any code.
```

---

*🌿 Canopy — Built by Raj Patel · github.com/rajpatel0554/Canopy*
