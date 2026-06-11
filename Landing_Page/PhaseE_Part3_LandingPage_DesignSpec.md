# 🌿 Canopy — Phase E Part 3: Landing Page Design Spec

> This file captures the full design specification for the Canopy landing page.
> No code. Pure design blueprint — fonts, colors, animations, content, layout.
> Read this before writing a single line of production code.

---

## 📋 Table of Contents

1. [Page Overview](#page-overview)
2. [Global Design System](#global-design-system)
3. [Section 1 — Navbar](#section-1--navbar)
4. [Section 2 — Hero](#section-2--hero)
5. [Section 3 — Features](#section-3--features)
6. [Section 4 — How It Works](#section-4--how-it-works)
7. [Section 5 — Evaluation API](#section-5--evaluation-api)
8. [Section 6 — Variation Types](#section-6--variation-types)
9. [Section 7 — Footer](#section-7--footer)
10. [Animation Summary](#animation-summary)
11. [Page Width & Spacing](#page-width--spacing)

---

## Page Overview

| Property | Value |
|---|---|
| File | `app/page.tsx` |
| Route | `/` (home, public, no auth required) |
| Type | 100% static — zero API calls, zero backend dependency |
| Sections | Navbar · Hero · Features · How It Works · API · Variation Types · Footer |

---

## Global Design System

### Colors

| Name | Hex | Usage |
|---|---|---|
| Forest | `#1c3a2f` | Navbar bg, section bg, headings, icon boxes |
| Mint | `#6ee7b7` | Accents, icons, highlights, active toggles |
| Linen | `#f7f7f2` | Off-white section backgrounds, card backgrounds |
| White | `#ffffff` | Pure white card backgrounds |
| Soft Mint Border | `#d1fae5` | Card borders, dividers, connector lines |
| Gray Text | `#9ca3af` | Descriptions, subdued text |
| Near-Black | `#111827` | Body text on white |
| Mid-Gray | `#374151` | Secondary buttons, medium text |

### Fonts

| Font | Usage |
|---|---|
| `DM Serif Display` | All big headings — hero headline, section titles |
| `DM Sans` | All body text, nav links, descriptions, buttons |
| `JetBrains Mono` | Code blocks and flag keys only |

### Font Scale

| Element | Size | Weight | Font |
|---|---|---|---|
| Hero headline | 52–56px | 400 (serif) | DM Serif Display |
| Section headings | 32–36px | 400 (serif) | DM Serif Display |
| Sub-section headings | 28px | 400 (serif) | DM Serif Display |
| Card titles | 16px | 700 | DM Sans |
| Body / descriptions | 14–16px | 400 | DM Sans |
| Nav links | 14px | 500 | DM Sans |
| Code / flag keys | 13px | 400 | JetBrains Mono |
| Stack pills / labels | 11–12px | 400 | DM Sans |

### Badge Colors (Variation Types)

| Type | Background | Text Color |
|---|---|---|
| Boolean | `#d1fae5` | `#059669` |
| String | `#ede9fe` | `#6d28d9` |
| Number | `#fef3c7` | `#d97706` |
| JSON | `#fee2e2` | `#dc2626` |

---

## Section 1 — Navbar

### Layout
Full-width, sticky (stays at top while scrolling), Forest green background.

```
┌──────────────────────────────────────────────────────────────────┐
│  🌿 Canopy                        GitHub ↗   Login   Get Started │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#1c3a2f` (Forest green)

### Left Side — Logo
| Property | Value |
|---|---|
| Icon | 🌿 emoji |
| Text | "Canopy" |
| Font | DM Serif Display |
| Size | ~20px |
| Color | `#f7f7f2` (linen white) |

### Right Side — 3 Buttons

| Button | Style | Background | Border | Text Color | Label |
|---|---|---|---|---|---|
| GitHub | Ghost | Transparent | `#6ee7b7` mint | `#6ee7b7` mint | `GitHub ↗` |
| Login | Ghost | Transparent | `#6ee7b7` mint | `#6ee7b7` mint | `Login` |
| Get Started | Primary | `#6ee7b7` mint | None | `#1c3a2f` forest | `Get Started →` |

**Get Started button:** `font-weight: 700`, `border-radius: 8px`

### Animation
None — loads instantly, always stable.

---

## Section 2 — Hero

### Layout
Centered content. Text stack at top, decorative mockup card below.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              [ Open Source · Portfolio Project ]                 │
│                                                                  │
│         Ship features faster. Stay in control.                  │
│                                                                  │
│    Deploy code independently of releases. Toggle features        │
│    for any user, team, or percentage — without redeploying.     │
│                                                                  │
│         [ Get Started Free → ]   [ ⭐ View on GitHub ]          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────┐      │
│   │  ● ● ●   canopy.app/flags                            │      │
│   │  Flag Key        Name       Type    Rollout  Status  │      │
│   │  new-checkout-flow  New Ch…  Boolean  ████ 100%  ●   │      │
│   │  ui-theme-variant   UI Theme  String   ██  50%  ●    │      │
│   │  max-upload-size    Upload…  Number    █   25%  ○    │      │
│   │  theme-config       Theme…   JSON      ▏   10%  ○    │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#1c3a2f` (Forest green)

### Badge (above headline)
| Property | Value |
|---|---|
| Text | `Open Source · Portfolio Project` |
| Font | DM Sans, 12px |
| Style | Small pill, `border: 1px solid rgba(110,231,183,0.3)` |
| Text Color | `#f7f7f2` linen |
| Background | `rgba(110,231,183,0.08)` very faint mint |
| Border Radius | `9999px` (fully rounded) |

### Headline
| Property | Value |
|---|---|
| Text | `Ship features faster. Stay in control.` |
| Font | DM Serif Display |
| Size | ~52–56px |
| Color | `#f7f7f2` |
| Layout | Line break after "faster." — reads as two lines |

### Sub-text
| Property | Value |
|---|---|
| Text | `Deploy code independently of releases. Toggle features for any user, team, or percentage — without redeploying.` |
| Font | DM Sans |
| Size | ~18px |
| Color | `rgba(247,247,242,0.65)` — linen, slightly faded |
| Max Width | ~600px (so it doesn't stretch too wide) |

### CTA Buttons (side by side, centered)

| Button | Background | Text Color | Border | Border Radius | Label |
|---|---|---|---|---|---|
| Primary | `#1c3a2f` (slightly darker) or white | `#f7f7f2` | None | `9999px` pill | `Get Started Free →` |
| Secondary | Transparent | `#374151` | `#d1fae5` soft mint | `9999px` pill | `⭐ View on GitHub` |

Both buttons: DM Sans, `font-weight: 700`, medium padding.

### Hero Mini Dashboard Mockup

**Purpose:** Purely decorative — not a real component. Shows what the app looks like.

**Outer card:**
- Border: `1px solid rgba(110,231,183,0.15)`
- Background: `rgba(0,0,0,0.25)` dark overlay
- Border radius: `12px`
- Max width: ~780px, centered

**Browser chrome bar at top:**
- 3 dots: 🔴 🟡 🟢 (red, yellow, green circles)
- Fake URL: `canopy.app/flags` — DM Sans, `#9ca3af`, 12px
- Background: slightly darker than card body

**Table inside:**

Columns: `Flag Key` | `Name` | `Type` | `Rollout` | `Status`

| Flag Key | Name | Type | Rollout | Status |
|---|---|---|---|---|
| `new-checkout-flow` | New Checkout | Boolean (green badge) | ████ 100% full bar | Toggle ON — mint |
| `ui-theme-variant` | UI Theme | String (purple badge) | ██ 50% half bar | Toggle ON — mint |
| `max-upload-size` | Upload Limit | Number (amber badge) | █ 25% bar | Toggle OFF — gray |
| `theme-config` | Theme Config | JSON (red badge) | ▏ 10% tiny bar | Toggle OFF — gray |

- Flag Key column: `JetBrains Mono`, 12px, `#9ca3af`
- Name column: DM Sans, 13px, `#f7f7f2`
- Type: colored badge pill (see badge colors above)
- Rollout bar: thin `6px` height bar, mint `#6ee7b7` fill, dark bg track
- Toggle ON: `#6ee7b7` mint background, white circle
- Toggle OFF: `#374151` gray background, white circle

---

## Section 3 — Features

### Layout
White background. Section heading centered at top. 3 cards in a horizontal row below.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│          Everything you need for feature management              │
│         Manage risk, enable experimentation, ship faster.        │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │ [⚡]         │  │ [🎯]         │  │ [📊]         │         │
│   │ Kill Switches│  │ Context-Based│  │ Percentage   │         │
│   │              │  │ Targeting    │  │ Rollouts     │         │
│   │ Instantly    │  │ Serve diff…  │  │ Gradually    │         │
│   │ disable…     │  │              │  │ roll out…    │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#ffffff` (White)

### Section Heading
| Property | Value |
|---|---|
| Text | `Everything you need for feature management` |
| Font | DM Serif Display, ~32px |
| Color | `#1c3a2f` |
| Sub-text | `Manage risk, enable experimentation, and ship faster — without the ops overhead.` |
| Sub-text font | DM Sans, 16px, `#9ca3af` |

### Feature Cards — Shared Style
| Property | Value |
|---|---|
| Background | `#f7f7f2` (linen) |
| Border | `1px solid #d1fae5` |
| Border Radius | `12px` |
| Padding | `28px 24px` |

### Card Structure (top to bottom)
1. **Icon box** — 44×44px, `bg: #1c3a2f`, `border-radius: 10px`, icon color `#6ee7b7` mint
2. **Title** — DM Sans, 16px, `font-weight: 700`, `color: #1c3a2f`
3. **Description** — DM Sans, 14px, `color: #9ca3af`, `line-height: 1.6`

### The 3 Cards

**Card 1 — Kill Switches**
- Icon: ⚡ lightning bolt (or toggle/power icon)
- Title: `Kill Switches`
- Description: `Instantly disable any feature in production with a single toggle — no code change, no redeploy needed.`

**Card 2 — Context-Based Targeting**
- Icon: 🎯 target / crosshair icon
- Title: `Context-Based Targeting`
- Description: `Serve different values to different users based on plan, country, email, or any custom attribute in your context.`

**Card 3 — Percentage Rollouts**
- Icon: 📊 bar chart / slider icon
- Title: `Percentage Rollouts`
- Description: `Gradually roll out features to 1%, 10%, or 50% of users. Control blast radius before full release.`

### Animation
Cards fade in and slide up when they scroll into view. 150ms stagger between each card (card 1 → card 2 → card 3 appear in sequence).

---

## Section 4 — How It Works

### Layout
Linen background. Section heading centered. 3 numbered steps in a horizontal row, connected by a line.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  Up and running in minutes                       │
│                                                                  │
│         ①  ────────────────  ②  ────────────────  ③            │
│                                                                  │
│    Create a flag      Set your rules      Evaluate in code       │
│    Define a flag…     Add targeting…      Call the evaluate…    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#f7f7f2` (Linen)

### Section Heading
| Property | Value |
|---|---|
| Text | `Up and running in minutes` |
| Font | DM Serif Display, ~32px |
| Color | `#1c3a2f` |

### Connector Line (between steps)
| Property | Value |
|---|---|
| Height | `2px` |
| Color | `#d1fae5` (soft mint) |
| Position | Horizontally connects center of step number circles |

### Step Structure
1. **Circle number** — 48px diameter, `bg: #1c3a2f`, number in mint `#6ee7b7`, DM Serif Display
2. **Title** — DM Sans, 16px, `font-weight: 700`, `color: #1c3a2f`, centered below circle
3. **Description** — DM Sans, 14px, `color: #9ca3af`, centered, max-width ~220px per step

### The 3 Steps

**Step 1 — Create a flag**
- Description: `Define a feature flag with a key, type (Boolean, String, Number, or JSON), and your variation values.`

**Step 2 — Set your rules**
- Description: `Add targeting rules by user context — or use a percentage rollout to control exposure gradually.`

**Step 3 — Evaluate in code**
- Description: `Call the evaluate API from your app. Get the right value back for each user in real time.`

### Animation
Optional — each step number can appear one at a time on scroll-in (200ms stagger). Simple fade-in is also fine.

---

## Section 5 — Evaluation API

### Layout
Dark Forest background. Section heading centered. Two code cards side by side below.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│               One API call. Any language.                        │
│        Send context, get a value back. No SDK required.          │
│                                                                  │
│   ┌─────────────────────────┐  ┌─────────────────────────┐      │
│   │ REQUEST                 │  │ RESPONSE · 200 OK        │      │
│   │─────────────────────────│  │──────────────────────────│      │
│   │ POST /api/evaluate/…    │  │ {                        │      │
│   │ {                       │  │   "value": "true",       │      │
│   │   "context": {          │  │   "variationType": …     │      │
│   │     "userId": …         │  │   "enabled": true        │      │
│   │     "plan": "pro"       │  │ }                        │      │
│   │   }                     │  │                          │      │
│   │ }                       │  │ // Matched: rule → ON    │      │
│   └─────────────────────────┘  └─────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#1c3a2f` (Forest green)

### Section Heading
| Property | Value |
|---|---|
| Text | `One API call. Any language.` |
| Font | DM Serif Display, ~32px |
| Color | `#f7f7f2` |
| Sub-text | `Send context, get a value back. No SDK required.` |
| Sub-text font | DM Sans, 16px, `rgba(247,247,242,0.6)` |

### Code Card — Shared Style
| Property | Value |
|---|---|
| Background | `rgba(0,0,0,0.25)` semi-transparent dark |
| Border | `1px solid rgba(110,231,183,0.15)` faint mint |
| Border Radius | `10px` |
| Header band | Slightly darker bg strip at top with label text |
| Header font | JetBrains Mono, small (11px) |

### Left Card — Request

**Header label:** `REQUEST` (mint `#6ee7b7`)

**Content:**
```
POST /api/evaluate/new-checkout-flow
Content-Type: application/json

{
  "context": {
    "userId": "usr_123",
    "email": "raj@example.com",
    "plan": "pro",
    "country": "IN"
  }
}
```

### Right Card — Response

**Header label:** `RESPONSE · 200 OK` (mint `#6ee7b7`)

**Content:**
```
{
  "value": "true",
  "variationType": "BOOLEAN",
  "enabled": true
}

// Matched: targeting rule
// plan EQUALS "pro" → ON
```

### Syntax Highlighting Colors

| Element | Color |
|---|---|
| HTTP Method (`POST`) | `#6ee7b7` mint |
| URL / path | `#fbbf24` amber |
| JSON keys (`"context"`, `"userId"`, etc.) | `#a78bfa` purple |
| String values (`"pro"`, `"IN"`, `"BOOLEAN"`) | `#6ee7b7` mint |
| Boolean values (`true`) | `#6ee7b7` mint |
| Number values | `#fbbf24` amber |
| Comment lines (`// Matched…`) | `rgba(255,255,255,0.3)` faded white |

### Animation
None needed — code is meant to be read, not animated.

---

## Section 6 — Variation Types

### Layout
White background. Heading centered. 4 cards in a horizontal row.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│           Four variation types. One consistent API.              │
│                                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │ Boolean  │  │ String   │  │ Number   │  │ JSON     │      │
│   │  green   │  │  purple  │  │  amber   │  │  red     │      │
│   │ Simple   │  │ Return   │  │ Control  │  │ Return   │      │
│   │ on/off…  │  │ different│  │ limits…  │  │ complex… │      │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Background
`#ffffff` (White)

### Section Heading
| Property | Value |
|---|---|
| Text | `Four variation types. One consistent API.` |
| Font | DM Serif Display, ~28px |
| Color | `#1c3a2f` |

### Type Card — Shared Style
| Property | Value |
|---|---|
| Background | `#f7f7f2` linen |
| Border | `1px solid #d1fae5` |
| Border Radius | `12px` |
| Padding | `24px` |

### Card Structure
1. **Badge pill** at top — type name with its color (see badge colors)
2. **Title** — DM Sans, 16px, bold, `#1c3a2f`
3. **Description** — DM Sans, 14px, `#9ca3af`

### The 4 Cards

**Boolean** (green badge `#d1fae5` / `#059669`)
- Description: `Simple on/off. Perfect for kill switches and feature rollouts.`

**String** (purple badge `#ede9fe` / `#6d28d9`)
- Description: `Return different UI labels, themes, or config strings per user.`

**Number** (amber badge `#fef3c7` / `#d97706`)
- Description: `Control limits, thresholds, or numeric config values dynamically.`

**JSON** (red badge `#fee2e2` / `#dc2626`)
- Description: `Return complex config objects — multiple values in a single flag.`

### Animation
Staggered fade-in on scroll-in. 100ms delay between each card.

---

## Section 7 — Footer

### Background
`#1c3a2f` (Forest green)

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  🌿 Canopy                               GitHub →  [Portfolio]   │
│  Multi-Tenant Feature Flag Service                               │
│ ─────────────────────────────────────────────────────────────── │
│  Built by Raj Patel · 2025        [Next.js][Spring Boot][Postgres][Java 21] │
└──────────────────────────────────────────────────────────────────┘
```

### Top Row (space-between)

**Left:**
- 🌿 `Canopy` — DM Serif Display, `#f7f7f2`, ~20px
- Below: `Multi-Tenant Feature Flag Service` — DM Sans, 13px, `rgba(247,247,242,0.5)`

**Right:**
- `GitHub →` link — DM Sans, mint `#6ee7b7`
- `Portfolio Project` badge — transparent bg, mint border, mint text, `border-radius: 9999px`, 11px

### Divider
`1px solid rgba(110,231,183,0.1)` — barely visible horizontal line

### Bottom Row (space-between)

**Left:**
- `Built by Raj Patel · 2025`
- DM Sans, 12px, `rgba(247,247,242,0.3)` very faded linen

**Right — Stack Pills (4 pills in a row):**

| Pill | Content |
|---|---|
| 1 | `Next.js` |
| 2 | `Spring Boot` |
| 3 | `PostgreSQL` |
| 4 | `Java 21` |

Each pill style:
- Background: Transparent
- Border: `1px solid rgba(110,231,183,0.15)`
- Text: `rgba(247,247,242,0.5)`
- Border Radius: `9999px` (fully rounded)
- Font: DM Sans, 11px
- Padding: `4px 10px`

### Animation
None — footer is static.

---

## Animation Summary

| Element | Animation | Trigger | Duration |
|---|---|---|---|
| Navbar | None — instant | Page load | — |
| Hero badge | Fade in | Page load | 200ms |
| Hero headline | Word-by-word stagger fade + rise | Page load | 180ms per word |
| Hero sub-text | Fade in | After headline | 300ms |
| Hero CTA buttons | Fade in together | After sub-text | 300ms |
| Hero mockup card | Slide up + fade in | After buttons | 400ms delay, 450ms duration |
| Feature cards | Staggered slide up + fade | Scroll into view | 150ms stagger |
| How It Works steps | Staggered fade-in | Scroll into view | 200ms stagger |
| API code cards | Fade in | Scroll into view | 300ms |
| Variation type cards | Staggered fade in | Scroll into view | 100ms stagger |
| Footer | None — static | — | — |

### General Animation Rules
- Entrance animations only — nothing loops (no floating, no pulsing)
- No parallax effects
- Smooth and professional — not distracting
- All animations use `opacity` + `translateY` (fade + rise)
- Easing: `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` for a snappy feel

---

## Page Width & Spacing

| Property | Value |
|---|---|
| Max content width | `1200px`, centered with `auto` margins |
| Section vertical padding | `80px` top and bottom |
| Heading → sub-text gap | `16px` |
| Sub-text → cards/steps gap | `48px` |
| Card grid gap | `24px` |
| Mobile behavior | All multi-column grids collapse to single column |
| Horizontal padding (mobile) | `20px` each side |

---

## Prompt for Production Code Chat

```
I am building Canopy — a multi-tenant feature flag service as a portfolio project.

Reference files:
- PhaseE_Status_LandingPage.md — project status + original landing page spec
- PhaseE_Part2_DesignDecisions.md — auth page design decisions (for design system reference)
- PhaseE_Part3_LandingPage_DesignSpec.md — this file — full landing page design blueprint

Act as a Senior Frontend Developer mentoring a beginner.
Explain concepts before code. Go step by step.
Show me a visual mockup before writing any production Next.js code.

I want to build Phase E Part 3 — the Landing Page (app/page.tsx).
Start by confirming you've read the design spec and summarize the 7 sections.
```

---

*🌿 Canopy — Built by Raj Patel · github.com/rajpatel0554/Canopy*
*Document generated after Phase E Part 3 design specification session.*
*Next step: Visual mockup approval → Production Next.js code.*
