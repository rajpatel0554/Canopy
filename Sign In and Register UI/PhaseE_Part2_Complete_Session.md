# Phase E Part 2 — Login & Register Pages
## Complete Design, Bug Analysis & Resolution Document
### Canopy — Multi-Tenant Feature Flag Service

---

## 📋 Table of Contents

1. [Project Context](#1-project-context)
2. [Phase Roadmap](#2-phase-roadmap)
3. [Final Approved Design Specification](#3-final-approved-design-specification)
4. [Complete Feature List](#4-complete-feature-list)
5. [Animation Inventory](#5-animation-inventory)
6. [All Design Decisions Made](#6-all-design-decisions-made)
7. [Bug History — Every Issue Found and Fixed](#7-bug-history--every-issue-found-and-fixed)
8. [Root Cause Analysis — White Corner Bleed](#8-root-cause-analysis--white-corner-bleed)
9. [Final Correct CSS Architecture](#9-final-correct-css-architecture)
10. [User Flow](#10-user-flow)
11. [Production Implementation Notes](#11-production-implementation-notes)

---

## 1. Project Context

**Project:** Canopy — Multi-Tenant Feature Flag Service (Portfolio Project)
**Developer:** Raj Patel, BTech 3rd Year, Information Technology
**Current Phase:** E Part 2 — Login + Register Pages
**Status:** Design fully approved. Ready for production code.

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Backend | Spring Boot (Phases A–D already built) |
| Auth | Auth.js (NextAuth v5) |
| UI Components | shadcn/ui (14 components installed) |
| Fonts | DM Serif Display · DM Sans · JetBrains Mono |
| Icons | Tabler Icons (ti ti-*) |

### Brand Color Tokens
| Token | Hex | Usage |
|---|---|---|
| Forest | `#1c3a2f` | Left panel bg, buttons, labels |
| Forest Hover | `#2a5040` | Button hover state |
| Mint Strong | `#34d399` | Input focus border |
| Mint Mid | `#6ee7b7` | Pills, brand underline |
| Mint Soft | `#a7f3d0` | Input borders |
| Mint Light | `#d1fae5` | Success bg, slug chip |
| Mint Shell | `#e8f5ee` | Tab switcher background |
| White | `#ffffff` | Right panel, inputs |
| Near-black | `#111827` | Input typed text |
| Muted | `#9ca3af` | Subtitles, placeholders |
| Error BG | `#fef2f2` | Error banner background |
| Error Border | `#fecaca` | Error banner border |
| Error Text | `#dc2626` | Error message color |

---

## 2. Phase Roadmap

```
✅ Phase A  — Tenant Schema Provisioning
✅ Phase B  — Auth Layer (JWT + Register + Login)
✅ Phase C  — Flag CRUD + Evaluation Engine
✅ Phase D  — Targeting Rules + Segments + Percentage Rollouts
✅ Phase E1 — Project Setup + Theme + Types + API Client + CORS
🔄 Phase E2 — Login + Register Pages        ← CURRENT (design APPROVED, code next)
⏭  Phase E3 — Landing Page
⏭  Phase E4 — App Shell + Sidebar
⏭  Phase E5 — Flags List Page
⏭  Phase E6 — Flag Detail Page
⏭  Phase E7 — Segments Page
⏭  Phase F  — Deploy (Vercel + Railway)
```

---

## 3. Final Approved Design Specification

### Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  .card-shell                                                │
│  background: linear-gradient(→, #1c3a2f 42%, #ffffff 42%)  │
│  border-radius: 10px   overflow: hidden                     │
│  box-shadow: 0 8px 40px rgba(28,58,47,0.22)                │
│                                                             │
│  ┌───────────────────────┬─────────────────────────────┐   │
│  │  LEFT PANEL  (42%)    │  RIGHT PANEL  (58%)          │   │
│  │  bg: transparent      │  bg: #ffffff                 │   │
│  │  (gradient shows thru)│                              │   │
│  │                       │  Wavy "Canopy" brand         │   │
│  │  Logo + "Canopy"      │  Option A Tab switcher       │   │
│  │  "Ship faster."       │  Form (Login or Register)    │   │
│  │  "Stay in control."   │  CTA button (morph anim)    │   │
│  │  Subtitle text        │  Footer link                 │   │
│  │  3 floating pills     │                              │   │
│  │  Portfolio footer     │                              │   │
│  └───────────────────────┴─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Left Panel Content
| Element | Value |
|---|---|
| Logo circle bg | `rgba(110,231,183,0.18)` |
| Brand name | "Canopy" — DM Serif Display 20px white |
| Headline | "Ship faster. / Stay in control." |
| Subtitle | "Feature flags, A/B tests, and targeting rules — all in one place for your team." |
| Pill 1 | 🔘 Instant flag toggles |
| Pill 2 | 🧪 A/B testing built-in |
| Pill 3 | 👥 Multi-tenant ready |
| Footer | "🌿 Portfolio project · Raj Patel" |

### Right Panel — Login Form
| Element | Detail |
|---|---|
| Brand | Wavy "Canopy" letters + mint underline draws in |
| Heading | "Welcome back" — staggered word animation |
| Subtitle | "Sign in to your workspace" |
| Error bar | Collapsed (max-height: 0) → expands on error |
| Google SSO | "Continue with Google" — real Google logo colors |
| Divider | "or sign in with email" |
| Email field | Label above, white bg, mint border, validation icon |
| Password field | Same + eye toggle button |
| Row | Remember me checkbox + Forgot password? link |
| Enter hint | "Press Enter ↵ to sign in" — appears when both fields filled |
| CTA | "Sign In" — morphing button animation |
| Footer | "No account? Create one" |
| Success state | Animated mint checkmark + "Redirecting to dashboard…" |

### Right Panel — Register Form
| Element | Detail |
|---|---|
| Heading | "Create your account" — staggered 3-word animation |
| Subtitle | "Set up your organization in seconds" |
| Error bar | Same collapse pattern as Login |
| Google SSO | Same as Login |
| Divider | "or register with email" |
| Email field | Same as Login with inline validation |
| Password field | Same + password strength bar |
| Strength bar | 3 segments: Weak(red) → Good(amber) → Strong(green) |
| Strength messages | "Weak — add more characters" / "Good — try adding symbols" / "Strong password ✓" |
| Slug field | JetBrains Mono font, auto-formatter |
| Slug hint | e.g. `acme-corp` chip |
| CTA | "Create Account" — same morph animation |
| Footer | "Have an account? Sign in" |
| Success state | Confetti + Toast + "Account created! Welcome to Canopy 🌿" |

---

## 4. Complete Feature List

### Tab Switcher — Option A (Sliding Pill)
- Shell background: `#e8f5ee` mint — always visible
- Inactive: `#1c3a2f` text on transparent — always readable
- Active: `#1c3a2f` forest fill + white text + subtle shadow
- Transition: smooth `background-color 0.22s` ease
- Dark mode proof: `-webkit-text-fill-color` used on all text

### Input Fields (Above-Label Pattern)
- **Why above-label not floating:** Floating labels broke in dark mode, caused positioning bugs with eye button white box
- Label: `font-weight: 700`, `color: #1c3a2f`, `font-size: 12.5px`
- Input: white bg, `1.5px solid #a7f3d0` border, `border-radius: 8px`, `padding: 9px 14px`
- Focus: `border-color: #34d399` + `box-shadow: 0 0 0 3px rgba(52,211,153,0.15)`
- Valid state: `border-color: #34d399`
- Invalid state: `border-color: #fca5a5`

### Field Focus Highlight
- On focus: `border-left: 2.5px solid #6ee7b7` + `background: rgba(110,231,183,0.04)`
- On blur: reverts via CSS transition `0.18s ease`
- Fires only on genuine user interaction (not programmatic error focus)

### Inline Email Validation
- Fires on `oninput` and `onblur`
- Green ✓ badge (mint bg) when valid
- Red ✕ badge (red bg) when invalid
- Input border changes color to match

### Password Eye Toggle
- `background: transparent` — no white box
- `border-left: 1.5px solid #a7f3d0` divider only
- Toggles `ti-eye` / `ti-eye-off` icon class

### Password Strength Bar (Register only)
```js
let score = 0;
if (val.length >= 6)                              score++; // length
if (val.length >= 10 && /[A-Z]/.test(val))        score++; // uppercase
if (/[^a-zA-Z0-9]/.test(val) && val.length >= 8) score++; // special char
// score 1 = Weak (#dc2626)
// score 2 = Good  (#d97706)
// score 3 = Strong (#059669)
```
Height fixed at `32px` always — never causes layout shift.

### Slug Auto-Formatter (Register only)
```js
val.toLowerCase()
   .replace(/\s+/g, '-')
   .replace(/[^a-z0-9-]/g, '')
   .replace(/-+/g, '-')
```
Preview updates live: `Your slug: acme-corp`

### Form Shake on Error
- `@keyframes shake` — 7px → 5px → 3px damped oscillation
- Fires on `.shake-zone` after morph animation completes
- Applied to: Login form, Register form

### Button Morph Animation
1. Button text disappears
2. Button shrinks to circle `42px × 42px` via `border-radius` + `width` transition
3. Spinner rotates inside
4. After 1800ms: uncollapses, text returns, error or success fires

### Enter Hint
- Height `20px` reserved always — zero layout shift
- Visible when email is valid AND password length ≥ 4
- Hidden immediately when error state fires
- `color: transparent` → `#9ca3af` transition (no reflow)

### Error Bar — Max-Height Collapse
```css
/* Hidden — zero space consumed */
.err-bar {
  max-height: 0;
  margin-bottom: 0;
  opacity: 0;
  padding: 0 12px;
}
/* Visible — smooth expansion */
.err-bar.on {
  max-height: 44px;
  margin-bottom: 10px;
  padding: 10px 12px;
  opacity: 1;
}
```
Transition: `max-height 0.25s ease, opacity 0.22s ease, margin 0.25s ease`

### Error Focus Trap (Accessibility)
- Loops through field IDs after shake completes (650ms delay)
- Focuses first empty or `.invalid` field
- Screen reader compatible — `el.focus()` triggers announcement

### Google SSO Button
- Real Google logo SVG (4 paths: blue, green, yellow, red)
- Hover: `border-color: #a7f3d0` + `translateY(-1px)`
- Present on BOTH Login and Register

### Confetti on Register Success
- 55 pieces, randomised: color (6 brand shades), size, position, delay, shape
- Falls with `@keyframes confettiFall` translateY + rotate
- Auto-removed from DOM after 3 seconds

### Toast Notification on Register Success
- Slides in from top-right: `translateX(110%) → translateX(0)`
- Mint progress bar shrinks over 3.5 seconds
- Dismissible with ✕ button
- Auto-dismisses after 3.5 seconds

### Tab Slide Transition
- Login → Register: old slides left out, new slides in from right
- Register → Login: old slides right out, new slides in from left
- Heading animation replays on every tab switch

---

## 5. Animation Inventory

| Animation | Element | Keyframe | Duration | Trigger |
|---|---|---|---|---|
| Card entrance | Whole card | `cardIn` fade+rise 14px | 450ms | Page load |
| Gentle wave | "Canopy" letters | `gentleWave` ±3px | 2.8s loop | Page load |
| Word fade-in | Heading words | `wordIn` opacity+rise | 380ms per word, 180ms stagger | Tab switch |
| Underline draw | Brand underline | `underlineDraw` width 0→100% | 500ms at 1s delay | Page load |
| Pill float | Left panel pills | `pillFloat` ±4px | 3.2s loop, staggered | Page load |
| Tab slide | Form content | `slideOut*` + `slideIn*` | 200ms | Tab click |
| Error bar expand | Error banner | max-height transition | 250ms | Validation fail |
| Form shake | Field group | `shake` damped oscillation | 500ms | Login/Register error |
| Button morph | CTA button | border-radius + width | 350ms | Button click |
| Spinner | Inside button | `spin` rotate 360° | 650ms loop | Morphing state |
| Success pop | Success state | `successPop` scale bounce | 400ms | After morph |
| Checkmark draw | Success icon | `checkDraw` stroke-dashoffset | 400ms | Success state on |
| Confetti fall | 55 pieces | `confettiFall` fall+rotate | 1.2–2.4s each | Register success |
| Toast slide-in | Toast | `toastIn` translateX | 400ms | Register success |
| Toast progress | Progress bar | `progressShrink` scaleX | 3.5s linear | Toast visible |
| Enter hint fade | Hint text | color transition | 200ms | Fields filled |
| Field highlight | Left border | border-color transition | 180ms | Input focus |

---

## 6. All Design Decisions Made

### Tab Design — Iterations
| Version | What | Why Rejected |
|---|---|---|
| v1 | Single border, faint mint inactive | Text invisible in dark mode |
| v2 | `#374151` gray text on linen | Still low contrast, browser override |
| v3 | Mint bg inactive, forest active | Two-color split looked like two unrelated buttons |
| **v4 ✅** | **Option A Sliding Pill** | Mint shell, inactive always visible, active forest fill |

**4 options shown to user:** Sliding pill, Underline indicator, Two separate pills, White card lift. User chose Option A.

### Input Pattern — Iterations
| Pattern | Tried | Outcome |
|---|---|---|
| Floating labels | Yes | Broke in dark mode, eye button got white box, absolute positioning conflicts |
| **Above-field labels** | **Final** | **Clean, no bugs, used by Stripe/GitHub/Linear** |

### Wavy Animation — Iterations
| Version | Amplitude | Duration | Result |
|---|---|---|---|
| v1 | 7px | 1.6s | Too aggressive, jittery |
| **v2 ✅** | **3px** | **2.8s** | Gentle, approved |

### Border Radius / Corner Fix — All Attempts
See full history in Section 7.

### Heading Word Spacing Bug
- **Problem:** "Welcomeback" merged, "Createyouraccount" merged
- **Root cause:** Space character `' '` inside `display:inline-block` span gets whitespace-collapsed by browser
- **Fix:** Parent uses `display:flex; gap:7px` — no space characters in text content

---

## 7. Bug History — Every Issue Found and Fixed

### Complete Bug Table

| # | Bug | Root Cause | Fix Applied |
|---|---|---|---|
| 1 | Wavy letters too aggressive | Amplitude 7px, speed 1.6s | Reduced to 3px / 2.8s |
| 2 | Tabs invisible without hover | Browser dark mode overriding `color` property | `color-scheme: light only` + `-webkit-text-fill-color` |
| 3 | "Welcomeback" words merged | Whitespace collapse inside `inline-block` spans | `display:flex; gap:7px` on heading container |
| 4 | Top/bottom corner gaps | Widget container padding pushing card inward | `.bleed { margin: -12px }` (later replaced) |
| 5 | Border radius too large | 16px clipping left panel content | Reduced to 10px |
| 6 | Left panel gap when Register expands | Right panel grew taller than left | `align-items: stretch` on outer container |
| 7 | Floating labels breaking | Dark mode + absolute positioning + eye button bg inheritance | Replaced with above-field label pattern |
| 8 | Eye button white box | Browser assigning default background to `<button>` | `background-color: transparent !important` |
| 9 | "Create Account" text invisible | Dark mode overriding button text color | `-webkit-text-fill-color: #fff !important` |
| 10 | Canopy underline too wide | Wrapper stretching to full panel width | `display: inline-flex; width: fit-content` |
| 11 | Large dead space above Google button | Error bar used `height: 40px` always (even hidden) | Replaced with `max-height: 0` collapse technique |
| 12 | Large dead space on Register above email | Same error bar dead space issue | Same max-height fix |
| 13 | Bottom gap left panel on error expand | `.outer min-height` fixed, error bar height dynamic | All dynamic elements pre-allocated height |
| 14 | White corner bleed — bottom-left | Widget frame white exposed by border-radius clip | Multiple attempts (see Section 8) |
| 15 | White corner bleed — top-right/bottom-right | Previous fix created opposite problem | Gradient shell architecture (see Section 8) |
| 16 | Enter hint visible during error | No state tracking | `errShowing` flag prevents hint showing after error |
| 17 | Focus highlight fires on programmatic focus | `onfocus` fires on `el.focus()` from error trap | Trap uses `el.focus()` without calling `hf()` |
| 18 | Strength bar causes layout shift | Appeared from display:none → adds 32px | Fixed height `32px` block always in DOM |
| 19 | Slug preview causes layout shift | Appeared on first keypress | Fixed `height: 18px` reserved always |
| 20 | Enter hint causes layout shift | Appeared when fields filled | Fixed `height: 20px` reserved, color transition only |

---

## 8. Root Cause Analysis — White Corner Bleed

This was the most persistent bug. It went through 6 failed fix attempts.

### Why It Was So Hard

The problem isn't the card. It's what's **behind** the card.

```
Browser rendering layers:
  Layer 0: Widget frame (always white in Claude.ai)
  Layer 1: Your card (with border-radius + overflow:hidden)
  
When border-radius clips corners:
  → the clip reveals Layer 0 (white)
  → regardless of what color Layer 1 has
```

### All Failed Attempts

| Attempt | What Was Tried | Why It Failed |
|---|---|---|
| 1 | `background: #1c3a2f` on `.outer` | Right panel still white, caused dark green on right corners |
| 2 | Per-panel `border-radius` (left panel gets left corners, right gets right) | `.card-shell` was transparent → widget frame white showed through both panels' clipped corners |
| 3 | `.root-bg` wrapper div with `background: #1c3a2f` | Widget frame still visible at `.page-wrap` clip boundary |
| 4 | `background: linear-gradient` on `.page-wrap` with `margin: -12px .bleed` | Negative margin caused sub-pixel gap at corners during dynamic height changes |
| 5 | Per-panel border-radius (second attempt with explicit backgrounds) | Same as attempt 2 — transparent shell always exposes widget frame |

### The Correct Fix — Gradient Shell

```
RULE: overflow:hidden must live on the SAME element
      that owns the background being revealed at corners.

.card-shell {
  background: linear-gradient(to right, #1c3a2f 42%, #ffffff 42%);
  border-radius: 10px;
  overflow: hidden;       ← clips corners → exposes gradient
}

.lp {
  background: transparent;  ← gradient's green left shows through
  /* NO border-radius, NO overflow:hidden */
}

.rp {
  background: #ffffff;      ← matches gradient's white right
  /* NO border-radius, NO overflow:hidden */
}
```

**Why this works permanently:**
- The gradient is width-based (`42%` stop)
- At ANY height, top-left and bottom-left corners expose `#1c3a2f` green
- At ANY height, top-right and bottom-right corners expose `#ffffff` white
- Dynamic content (error bars expanding, tab switching) cannot affect a width-based gradient
- No margin tricks, no wrapper layers, no JavaScript

---

## 9. Final Correct CSS Architecture

### The Three Critical Rules
```css
/* RULE 1: gradient on the shell — matches both panel colors */
.card-shell {
  background: linear-gradient(to right, #1c3a2f 42%, #ffffff 42%);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(28,58,47,0.22);
  display: flex;
  align-items: stretch;
  min-height: 560px;
  position: relative;
}

/* RULE 2: left panel transparent — gradient paints it green */
.lp {
  width: 42%;
  flex-shrink: 0;
  background: transparent !important;
  min-width: 0;
  /* NO overflow:hidden, NO border-radius */
}

/* RULE 3: right panel explicit white — matches gradient */
.rp {
  flex: 1;
  background-color: #ffffff !important;
  min-width: 0;
  /* NO overflow:hidden, NO border-radius */
}
```

### Critical CSS Properties Explained

| Property | Where | Why |
|---|---|---|
| `align-items: stretch` | `.card-shell` | Forces both panels to match the taller one's height |
| `min-width: 0` | `.lp` and `.rp` | Allows flex children to shrink below content width (responsive) |
| `overflow: hidden` | `.card-shell` ONLY | Clips all four corners against the gradient |
| `max-height: 0 → 44px` | `.err-bar` | Zero space when hidden, smooth expansion when shown |
| `height: 32px` fixed | `.strength-block` | Strength bar never causes layout shift |
| `height: 18px` fixed | `.slug-preview` | Slug hint never causes layout shift |
| `height: 20px` fixed | `.enter-hint` | Enter hint uses color transition, not display toggle |
| `-webkit-text-fill-color` | All text | Prevents dark mode from overriding colors |
| `color-scheme: light only` | `:root` | Prevents browser dark mode from touching inputs |
| `appearance: none` | All inputs | Removes browser-specific input styling |

---

## 10. User Flow

```
User visits canopy.com
         │
         ▼
   Landing Page (Phase E3)    ← First thing any visitor sees
   Hero + features + pricing
         │
         │  clicks "Get Started" or "Sign In"
         ▼
   Auth Page (Phase E2)       ← What we built
   ┌─────────────┐
   │  Sign In    │ ──→ Spring Boot /auth/login ──→ Dashboard
   │  Register   │ ──→ Spring Boot /auth/register ──→ Dashboard
   └─────────────┘
         │
         ▼
   Dashboard (Phases A–D)
```

---

## 11. Production Implementation Notes

### File Structure
```
src/
  app/
    (auth)/
      login/
        page.tsx           ← Login page
      register/
        page.tsx           ← Register page
      layout.tsx           ← Auth layout (no sidebar)
  components/
    auth/
      AuthCard.tsx         ← The split panel wrapper
      LoginForm.tsx        ← Login form content
      RegisterForm.tsx     ← Register form content
      TabSwitcher.tsx      ← Option A sliding pill tabs
      SSOButton.tsx        ← Google SSO button
      PasswordStrength.tsx ← Strength bar + label
      SlugInput.tsx        ← Slug field + auto-formatter
```

### API Calls
```typescript
// Login → POST /api/auth/login
// Body:  { email, password }
// 200:   { token, user } → store in Auth.js session → redirect /dashboard
// 401:   show error bar "Invalid email or password"

// Register → POST /api/auth/register  
// Body:  { email, password, organizationSlug }
// 201:   auto-login → confetti + toast → redirect /dashboard
// 409:   show error bar "This email is already registered"
// 422:   show error bar "Please fill in all fields correctly"
```

### Auth.js Session Config
```typescript
// Use JWT strategy (matches Spring Boot JWT)
// Store: { token, email, organizationSlug, role }
// Protected routes: middleware.ts → redirect to /login if no session
// After login: router.push('/dashboard')
```

### Dark Mode
- The auth pages force light mode via `color-scheme: light only` on `:root`
- This is intentional — the design was built for light mode only
- The dashboard can have its own dark mode handling separately

### In Production vs Preview
- The white corner bleed bug is a **widget/iframe-specific issue**
- In Next.js production, `body { background: #1c3a2f }` on the auth layout eliminates it
- The gradient shell fix is still the correct approach and works in both environments

### Responsive Behavior
- `min-width: 0` on both panels allows them to shrink
- Below ~640px: consider stacking panels vertically (Phase E3 design decision)
- All text uses `white-space: nowrap` where overflow could be an issue

---

## 12. Password Strength Logic (Production Implementation)

```typescript
function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10 && /[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password) && password.length >= 8) score++;
  return score as 0 | 1 | 2 | 3;
}

const STRENGTH_CONFIG = {
  0: { color: '#9ca3af', label: 'Enter a password' },
  1: { color: '#dc2626', label: 'Weak — add more characters' },
  2: { color: '#d97706', label: 'Good — try adding symbols' },
  3: { color: '#059669', label: 'Strong password ✓' },
};
```

---

## 13. Slug Auto-Formatter (Production Implementation)

```typescript
function formatSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, '-')       // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '') // remove invalid chars
    .replace(/-+/g, '-');       // collapse multiple hyphens
}
```

---
*Document created after complete Phase E Part 2 design and bug resolution session.*
*All designs approved. All bugs documented and fixed. Ready for production code.*
