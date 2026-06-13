# Phase E Part 3 — App Shell (Sidebar + Dashboard Layout)
## Complete Design Decisions & Session Handoff Document
### Canopy — Multi-Tenant Feature Flag Service

---

## 📋 Table of Contents

1. [Project Context](#1-project-context)
2. [Phase Roadmap](#2-phase-roadmap)
3. [What is the App Shell](#3-what-is-the-app-shell)
4. [Design Decisions — Questions & Answers](#4-design-decisions--questions--answers)
5. [Final Approved Layout Specification](#5-final-approved-layout-specification)
6. [Sidebar — Full Specification](#6-sidebar--full-specification)
7. [Top Bar — Full Specification](#7-top-bar--full-specification)
8. [Content Area — Full Specification](#8-content-area--full-specification)
9. [Animation Inventory — All 8 Approved](#9-animation-inventory--all-8-approved)
10. [Sidebar Collapse Animation — Final Decision](#10-sidebar-collapse-animation--final-decision)
11. [Collapsed State Specification](#11-collapsed-state-specification)
12. [Mobile Behavior](#12-mobile-behavior)
13. [Navigation Pages & Routes](#13-navigation-pages--routes)
14. [Production Implementation Notes](#14-production-implementation-notes)
15. [File Structure](#15-file-structure)

---

## 1. Project Context

**Project:** Canopy — Multi-Tenant Feature Flag Service (Portfolio Project)
**Developer:** Raj Patel, BTech 3rd Year, Information Technology
**Current Phase:** E Part 3 — App Shell (Sidebar + Dashboard Layout)
**Status:** Design fully approved. Ready for production code.

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Backend | Spring Boot (Phases A–D already built) |
| Auth | Auth.js (NextAuth v5) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Fonts | DM Serif Display · DM Sans · JetBrains Mono |
| Icons | Tabler Icons (`ti ti-*`) |

### Brand Color Tokens
| Token | Hex | Usage |
|---|---|---|
| Forest | `#1c3a2f` | Sidebar background, primary buttons, headings |
| Mint Strong | `#34d399` | Input focus, active highlights |
| Mint Mid | `#6ee7b7` | Icons, accent elements |
| Mint Soft | `#a7f3d0` | Borders, dividers |
| Mint Light | `#d1fae5` | Success badges, card borders |
| Linen | `#f7f7f2` | Page background canvas |
| White | `#ffffff` | Cards, panels, active nav pill |
| Near-black | `#111827` | Body text |
| Muted | `#9ca3af` | Secondary text, placeholders |
| Success | `#059669` | Enabled flags, positive states |
| Danger | `#dc2626` | Kill switches, error states |
| Warning | `#d97706` | Partial rollouts |

---

## 2. Phase Roadmap

```
✅ Phase A  — Tenant Schema Provisioning
✅ Phase B  — Auth Layer (JWT + Register + Login)
✅ Phase C  — Flag CRUD + Evaluation Engine
✅ Phase D  — Targeting Rules + Segments + Percentage Rollouts
✅ Phase E1 — Project Setup + Theme + Types + API Client + CORS
✅ Phase E2 — Login + Register Pages (design approved + built)
✅ Phase E3 — Landing Page (built, ~90–95% complete)
🔄 Phase E4 — App Shell + Sidebar     ← CURRENT (design APPROVED, code next)
⏭  Phase E5 — Flags List Page
⏭  Phase E6 — Flag Detail Page
⏭  Phase E7 — Segments Page
⏭  Phase F  — Deploy (Vercel + Railway)
```

---

## 3. What is the App Shell

The App Shell is the **persistent frame** that wraps every dashboard page. Once a user logs in, every single page they visit — Flags, Segments, Settings — lives **inside** this shell.

Think of it as the outer container of a house. The rooms (pages) change, but the walls (sidebar, topbar) always stay.

```
┌─────────────────────────────────────────────────────────────────┐
│  APP SHELL                                                       │
│                                                                  │
│  ┌──────────────────┐  ┌────────────────────────────────────┐   │
│  │                  │  │  TOP BAR  (fixed, white, 54px)     │   │
│  │                  │  ├────────────────────────────────────┤   │
│  │  SIDEBAR         │  │                                    │   │
│  │  (fixed, forest  │  │  PAGE CONTENT AREA                 │   │
│  │   collapsible)   │  │  (changes per route)               │   │
│  │                  │  │  scrolls independently             │   │
│  │                  │  │                                    │   │
│  └──────────────────┘  └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Three distinct pieces:**
1. **Sidebar** — Forest green, collapsible, fixed on left
2. **Top Bar** — White, fixed at top of content area
3. **Content Area** — Linen background, scrolls independently

---

## 4. Design Decisions — Questions & Answers

These were answered during the design session before any mockup was built.

| # | Question | Decision |
|---|---|---|
| 1 | Sidebar behavior | **Collapsible** — can shrink to icon + short label state |
| 2 | Mobile behavior | **Hide completely + hamburger menu** — sidebar not visible on small screens |
| 3 | Org context | **Yes** — sidebar shows the org name / slug prominently |
| 4 | Top bar | **Yes** — proper sticky top bar (not inline content header) |
| 5 | Active link style | **Option B** — white background pill, forest text (stands out from green sidebar) |

---

## 5. Final Approved Layout Specification

### Shell Structure
```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR (left, fixed)    │  MAIN AREA (right, flex: 1)      │
│  ┌────────────────────┐   │  ┌──────────────────────────┐    │
│  │  Brand (logo+name) │   │  │  TOP BAR (h: 54px)        │    │
│  │  Org slug section  │   │  │  title | search | avatar  │    │
│  │  ─────────────     │   │  ├──────────────────────────┤    │
│  │  Nav section       │   │  │                          │    │
│  │  ─────────────     │   │  │  CONTENT (scrollable)    │    │
│  │  User + Sign out   │   │  │  padding: 24px           │    │
│  └────────────────────┘   │  └──────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Dimension Tokens
| Element | Expanded | Collapsed |
|---|---|---|
| Sidebar width | `200px` | `76px` |
| Top bar height | `54px` | `54px` (unchanged) |
| Content padding | `24px` | `24px` (unchanged) |
| Nav item height | `~36px` | `~46px` (stacked icon+label) |
| Collapse transition | `320ms` | `320ms` |

---

## 6. Sidebar — Full Specification

### Zone Breakdown (Top to Bottom)

```
┌──────────────────────────┐
│  ZONE 1: Brand            │  logo + "Canopy" in DM Serif Display
│  ──────────────────────  │
│  ZONE 2: Org              │  green dot + "acme-corp" in JetBrains Mono
│  ──────────────────────  │
│  ZONE 3: Nav (flex: 1)   │  section label + nav items
│  ──────────────────────  │
│  ZONE 4: User + Sign out  │  avatar + email + sign out button
└──────────────────────────┘
```

### Zone 1 — Brand
| Property | Value |
|---|---|
| Background | `#1c3a2f` |
| Logo mark | Circular badge, `rgba(110,231,183,0.15)` bg, `ti-plant-2` icon in `#6ee7b7` |
| Brand name | "Canopy" — DM Serif Display, 16px, `#ffffff` |
| Padding | `16px 14px 12px` |
| Border bottom | `0.5px solid rgba(110,231,183,0.12)` |

### Zone 2 — Org Section
| Property | Value |
|---|---|
| Label | "Organization" — 10px, uppercase, `rgba(110,231,183,0.55)` |
| Pill background | `rgba(110,231,183,0.1)` |
| Org dot | 7px circle, `#6ee7b7` |
| Slug font | JetBrains Mono, 11px, `#a7f3d0` |
| Border bottom | `0.5px solid rgba(110,231,183,0.12)` |

### Zone 3 — Navigation
| Nav Item | Icon | Route |
|---|---|---|
| Dashboard | `ti-layout-dashboard` | `/dashboard` |
| Feature Flags | `ti-toggle-right` | `/dashboard/flags` |
| Segments | `ti-users-group` | `/dashboard/segments` |
| API Keys | `ti-key` | `/dashboard/settings/api-keys` |
| Settings | `ti-settings` | `/dashboard/settings` |

**Nav item states:**

| State | Background | Icon color | Label color |
|---|---|---|---|
| Default | `transparent` | `rgba(110,231,183,0.6)` | `rgba(255,255,255,0.65)` |
| Hover | `rgba(110,231,183,0.08)` | `rgba(110,231,183,0.9)` | `rgba(255,255,255,0.9)` |
| Active | `#ffffff` (white pill) | `#1c3a2f` | `#1c3a2f`, font-weight: 500 |

**Active pill transition:** `background-color 0.18s ease` — CSS only, no JS.

### Zone 4 — User + Sign Out
| Element | Detail |
|---|---|
| Avatar | 26px circle, `rgba(110,231,183,0.2)` bg, initials "RP" in `#6ee7b7` |
| Email | 11.5px, `rgba(255,255,255,0.7)` |
| Role | 10px, "Admin", `rgba(110,231,183,0.5)` |
| Sign out icon | `ti-logout`, `rgba(255,255,255,0.3)` |
| Sign out hover | `rgba(220,38,38,0.1)` background |
| Border top | `0.5px solid rgba(110,231,183,0.12)` |

### Collapse Button
| Property | Value |
|---|---|
| Position | `absolute`, top: 18px, right: -11px |
| Size | 22px × 22px circle |
| Background | `#1c3a2f` |
| Border | `0.5px solid rgba(110,231,183,0.3)` |
| Icon | `ti-chevrons-left` in `#6ee7b7` |
| Icon rotation | Rotates 180° when collapsed — CSS transition, same spring curve |
| z-index | `10` |

---

## 7. Top Bar — Full Specification

### Layout
```
┌───────────────────────────────────────────────────────────┐
│  [Page Title]      [Search ⌘K]      [🔔]  [Avatar RP]    │
│  left, flex:1      center-right      right icons          │
└───────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `54px` |
| Background | `#ffffff` |
| Border bottom | `0.5px solid var(--border)` |
| Padding | `0 20px` |

### Elements
| Element | Detail |
|---|---|
| Page title | 15px, font-weight: 500, `#1c3a2f` — updates per route |
| Search bar | `⌘K` pill — expands on click, border turns mint on focus |
| Notification bell | `ti-bell` icon button, red dot indicator |
| User avatar | 28px circle, `#1c3a2f` bg, initials in `#6ee7b7` |

### Search Bar — Expand Animation
| State | Width | Border color |
|---|---|---|
| Default | `110px` | `var(--border)` |
| Focused/Expanded | `190px` | `#6ee7b7` mint |
| Transition | `0.28s cubic-bezier(0.4,0,0.2,1)` | `0.18s ease` |

---

## 8. Content Area — Full Specification

| Property | Value |
|---|---|
| Background | `#f7f7f2` (Linen) |
| Padding | `24px` |
| Overflow | `auto` (scrolls independently) |
| Page title font | DM Serif Display, 22px, `#1c3a2f` |
| Page subtitle | 13px, `#9ca3af` |

### Stat Cards (top of each page)
| Property | Value |
|---|---|
| Background | `#ffffff` |
| Border | `0.5px solid var(--border)` |
| Border radius | `var(--radius-md)` |
| Padding | `14px 16px` |
| Grid | `repeat(3, 1fr)` with `12px` gap |
| Value font | 22px, font-weight: 500, `#1c3a2f` |
| Label font | 11.5px, `#9ca3af` |

---

## 9. Animation Inventory — All 8 Approved

All animations are CSS-only or minimal JS. No animation library required.

| # | Animation | Element | Trigger | Implementation |
|---|---|---|---|---|
| 1 | **Sidebar collapse** | Sidebar width + labels | Toggle button click | Spring cubic-bezier + hybrid state — see Section 10 |
| 2 | **Nav active pill** | Nav item background | Route change / click | `background-color: 0.18s ease` — CSS only |
| 3 | **Page content fade + lift** | Content area | Navigation | `opacity: 0→1` + `translateY: 6px→0`, 220ms |
| 4 | **Toggle switch ripple** | Flag on/off toggles | Click | Spring thumb + ripple ring scale 0→1.6, opacity 1→0 |
| 5 | **Staggered stat cards** | Stat cards on page load | Page mount | `opacity + translateY`, 280ms, 70ms stagger per card |
| 6 | **Topbar search expand** | Search pill | Click / focus | Width `110→190px`, border `→ mint`, 280ms cubic-bezier |
| 7 | **Skeleton loader** | Flag rows while loading | API fetch pending | `@keyframes shimmer`, opacity `0.4→0.8`, 1.4s infinite |
| 8 | **Badge status pop** | Status badges | Status change | `scale 0.7→1.15→1`, spring cubic-bezier, 320ms |

### Animation Timing Reference
```
Sidebar collapse:   320ms  cubic-bezier(0.34, 1.1, 0.64, 1)  — spring
Nav pill:           180ms  ease
Page content fade:  220ms  ease
Toggle thumb:       220ms  cubic-bezier(0.4, 0, 0.2, 1)
Toggle ripple:      300ms  ease
Stagger cards:      280ms  ease  (+ 70ms × index delay)
Search expand:      280ms  cubic-bezier(0.4, 0, 0.2, 1)
Skeleton shimmer:   1400ms ease-in-out  infinite
Badge pop:          320ms  cubic-bezier(0.34, 1.56, 0.64, 1) — spring overshoot
```

---

## 10. Sidebar Collapse Animation — Final Decision

### Decision: Hybrid + Spring Bounce

Two options were combined into one final approach:

**Option D (Hybrid)** — Does not collapse to icon-only. Collapses to a medium width (76px) showing icon + short 3-letter/4-letter label below each icon. Never fully hides the nav context.

**Option E (Spring Bounce)** — Uses a spring cubic-bezier easing curve so the sidebar slightly overshoots when opening and snaps crisply when closing.

### Why This Combination
- Short labels (FLAGS, SEGS, KEYS, CONF) mean the user never has to guess what an icon means when collapsed
- The spring easing makes the open/close feel satisfying and alive — not mechanical
- Collapsed width of 76px gives enough room for icon + label stacked vertically
- Same spring curve is reused on the chevron rotation — consistent feel

### Spring Curve
```css
transition: width 0.32s cubic-bezier(0.34, 1.1, 0.64, 1),
            min-width 0.32s cubic-bezier(0.34, 1.1, 0.64, 1);
```

The `1.1` value in the curve is what creates the overshoot — the sidebar expands slightly past 200px before settling. On close, it snaps back crisply.

### All Options That Were Considered

| Option | Style | Decision |
|---|---|---|
| A — Push & Fade | Width shrinks, labels slide left + fade out | ❌ Rejected — icon-only is less clear |
| B — Always collapsed + tooltips | Permanent icon strip, hover for tooltip | ❌ Rejected — less discoverable |
| C — Overlay drawer | Icons always visible, full drawer slides over content | ❌ Rejected — decided on collapsible instead |
| D — Icon + Short label | Collapses to 76px with icon + 3-letter label | ✅ Chosen (half) |
| E — Spring bounce | Same structure as A but with spring easing | ✅ Chosen (half) |
| **D + E combined** | Hybrid state with spring bounce easing | ✅ **FINAL DECISION** |

---

## 11. Collapsed State Specification

### What Changes When Collapsed

| Element | Expanded | Collapsed |
|---|---|---|
| Sidebar width | `200px` | `76px` |
| Brand name "Canopy" | Visible | `opacity: 0`, `width: 0` |
| Org slug text | Visible | `opacity: 0`, `width: 0` |
| Org dot | Visible | Centered, still visible |
| Nav section label "Menu" | Visible | `opacity: 0` |
| Nav full label ("Feature Flags") | Visible | `opacity: 0`, `width: 0` |
| Nav short label ("FLAGS") | Hidden | `opacity: 1` — fades in |
| Nav item layout | Row (icon + label side by side) | Column (icon above, short label below) |
| User email | Visible | `opacity: 0`, `width: 0` |
| User role | Visible | `opacity: 0`, `width: 0` |
| User avatar | Visible | Centered, still visible |
| Sign out label | Visible | `opacity: 0`, `width: 0` |
| Sign out icon | Visible | Centered, still visible |
| Chevron icon | Points left `←` | Rotates 180° → points right `→` |
| Active white pill | Full width of nav item | Still visible, narrower |

### What Always Stays Visible (Even Collapsed)
- All nav icons
- Short labels (FLAGS, SEGS, KEYS, CONF)
- Active white pill on current page
- Org green dot
- User avatar / initials
- Sign out icon
- Chevron toggle button

### Short Label Map
| Full Label | Short Label |
|---|---|
| Feature Flags | `FLAGS` |
| Segments | `SEGS` |
| API Keys | `KEYS` |
| Settings | `CONF` |
| Dashboard | `DASH` |

### Label Transition Timing
```css
/* Full label fades out first (0.16s), then short label fades in (0.18s with 0.08s delay) */
.nav-full-label {
  transition: opacity 0.16s ease, width 0.22s ease;
}
.nav-short-label {
  transition: opacity 0.18s ease 0.08s; /* delay = waits for full label to leave */
}
```

---

## 12. Mobile Behavior

### Decision
On small screens (below `768px`), the sidebar hides completely. A hamburger menu button (`ti-menu-2`) appears in the top bar. Tapping it slides the sidebar in as a drawer from the left, overlaying the content.

### Breakpoint Behavior
| Breakpoint | Sidebar behavior |
|---|---|
| `≥ 768px` (tablet/desktop) | Sidebar visible, collapsible |
| `< 768px` (mobile) | Sidebar hidden, hamburger appears in topbar |

### Mobile Drawer Spec
| Property | Value |
|---|---|
| Trigger | Hamburger icon in top bar (replaces page title zone on mobile) |
| Animation | `translateX(-100%) → translateX(0)`, 280ms cubic-bezier |
| Width | `240px` (full labels, not collapsed state) |
| Backdrop | Semi-transparent overlay `rgba(0,0,0,0.4)` behind drawer |
| Close | Tap backdrop or tap hamburger again |
| z-index | `50` (above all content) |

---

## 13. Navigation Pages & Routes

These are all the routes that will be accessible via the sidebar:

| Page | Route | Nav Item | Phase |
|---|---|---|---|
| Dashboard overview | `/dashboard` | Dashboard | E4 (this phase) |
| Feature Flags list | `/dashboard/flags` | Feature Flags | E5 |
| Flag detail + targeting | `/dashboard/flags/[flagKey]` | — (child of Flags) | E6 |
| Segments | `/dashboard/segments` | Segments | E7 |
| API Keys | `/dashboard/settings/api-keys` | API Keys | E4 (shell) |
| Settings | `/dashboard/settings` | Settings | E4 (shell) |

### Active State Logic
The active nav item is determined by the current route using Next.js `usePathname()`:
```typescript
const pathname = usePathname();
const isActive = (href: string) => pathname.startsWith(href);
```

Special case: `/dashboard/flags/[flagKey]` should keep "Feature Flags" active (not a separate nav item).

---

## 14. Production Implementation Notes

### Layout Architecture in Next.js App Router
```
app/
  (dashboard)/
    layout.tsx     ← App shell lives here (sidebar + topbar wrapper)
    page.tsx       ← Dashboard overview
    flags/
      page.tsx
      [flagKey]/
        page.tsx
    segments/
      page.tsx
    settings/
      page.tsx
      api-keys/
        page.tsx
```

The `layout.tsx` inside `(dashboard)` renders the shell once. Every child page automatically gets the sidebar and topbar without re-rendering them.

### Sidebar State (useState or zustand)
```typescript
// Option 1: Local state in layout (simpler, good enough for now)
const [collapsed, setCollapsed] = useState(false);

// Option 2: Persist to localStorage so it remembers preference
const [collapsed, setCollapsed] = useState(() => {
  return localStorage.getItem('sidebar-collapsed') === 'true';
});
```

For Canopy (portfolio project), `useState` with `localStorage` persistence is recommended so the sidebar remembers the user's preference across page navigations.

### Sidebar Collapse CSS Classes
```css
/* Tailwind-compatible approach — use data attributes */
[data-collapsed="true"] .sidebar { width: 76px; }
[data-collapsed="false"] .sidebar { width: 200px; }

/* Or use a CSS class toggle */
.sidebar { width: 200px; transition: width 0.32s cubic-bezier(0.34,1.1,0.64,1); }
.sidebar.collapsed { width: 76px; }
```

### Page Content Fade (Animation #3)
```typescript
// Trigger on route change using usePathname
const pathname = usePathname();

useEffect(() => {
  // Add fade-out class, swap content, add fade-in class
  setFading(true);
  const timer = setTimeout(() => setFading(false), 220);
  return () => clearTimeout(timer);
}, [pathname]);
```

### Staggered Stat Cards (Animation #5)
```typescript
// Each card gets a CSS animation-delay based on its index
// Use Tailwind's delay utilities or inline style
<div
  style={{ animationDelay: `${index * 70}ms` }}
  className="animate-fade-up"
>
```

### Skeleton Loader (Animation #7)
Show skeleton rows while the API call is in-flight:
```typescript
const { data: flags, isLoading } = useFlags(); // React Query or SWR

if (isLoading) return <FlagTableSkeleton rows={5} />;
return <FlagTable flags={flags} />;
```

### Toggle Ripple (Animation #4)
```typescript
const handleToggle = (flagKey: string) => {
  // 1. Fire API PATCH /flags/{flagKey}/toggle
  // 2. Trigger ripple animation via state
  // 3. Optimistic update in UI
};
```

### Protected Route
The `(dashboard)/layout.tsx` must check for Auth.js session:
```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');
  return <AppShell session={session}>{children}</AppShell>;
}
```

---

## 15. File Structure

```
canopy-frontend/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx              ← App shell wrapper (sidebar + topbar)
│       ├── page.tsx                ← /dashboard overview
│       ├── flags/
│       │   ├── page.tsx            ← /dashboard/flags (Phase E5)
│       │   └── [flagKey]/
│       │       └── page.tsx        ← /dashboard/flags/[flagKey] (Phase E6)
│       ├── segments/
│       │   └── page.tsx            ← /dashboard/segments (Phase E7)
│       └── settings/
│           ├── page.tsx            ← /dashboard/settings
│           └── api-keys/
│               └── page.tsx        ← /dashboard/settings/api-keys
│
├── components/
│   └── layout/
│       ├── AppShell.tsx            ← Outer shell — sidebar + topbar + content slot
│       ├── Sidebar.tsx             ← Full sidebar with all 4 zones
│       ├── SidebarNavItem.tsx      ← Single nav item (icon + label + short label)
│       ├── TopBar.tsx              ← Top bar with title + search + avatar
│       ├── MobileDrawer.tsx        ← Mobile hamburger drawer
│       └── CommandMenu.tsx         ← ⌘K search modal (Phase E5+)
│
└── hooks/
    └── useSidebarCollapse.ts       ← collapsed state + localStorage persistence
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `AppShell.tsx` | Layout grid (sidebar + main), passes collapsed state down |
| `Sidebar.tsx` | All 4 zones (brand, org, nav, user), collapse class toggling |
| `SidebarNavItem.tsx` | Single nav item — handles active state, icon, full + short label |
| `TopBar.tsx` | Page title (via prop), search pill with expand anim, avatar |
| `MobileDrawer.tsx` | Mobile-only drawer, backdrop, hamburger trigger |
| `useSidebarCollapse.ts` | `useState` + `localStorage` persistence hook |

---

## Quick Reference — Final Approved Checklist

### Layout
- [x] Sidebar fixed left, collapsible
- [x] Collapsed width: 76px, expanded: 200px
- [x] Top bar fixed, 54px, white
- [x] Content area: linen bg, 24px padding, independent scroll

### Sidebar
- [x] Zone 1: Brand — logo + "Canopy" DM Serif Display
- [x] Zone 2: Org — green dot + slug in JetBrains Mono
- [x] Zone 3: Nav — 5 items, white pill active state
- [x] Zone 4: User email + avatar + sign out
- [x] Collapse button: absolute positioned, chevron rotates 180°

### Collapse Animation
- [x] Type: Hybrid (icon + short label) + Spring Bounce
- [x] Collapsed width: 76px (not icon-only)
- [x] Short labels: FLAGS, SEGS, KEYS, CONF, DASH
- [x] Spring curve: `cubic-bezier(0.34, 1.1, 0.64, 1)`
- [x] Duration: 320ms
- [x] Full labels fade out, short labels fade in with 0.08s delay
- [x] Chevron icon rotates 180° on same spring curve

### All 8 Animations
- [x] #1 Sidebar collapse — hybrid + spring (Section 10)
- [x] #2 Nav active pill — 180ms ease CSS only
- [x] #3 Page content fade + lift — 220ms ease
- [x] #4 Toggle switch ripple — spring thumb + ripple ring
- [x] #5 Staggered stat cards — 280ms, 70ms stagger
- [x] #6 Topbar search expand — 280ms cubic-bezier, mint border
- [x] #7 Skeleton loader — shimmer 1.4s infinite
- [x] #8 Badge status pop — spring overshoot 320ms

### Mobile
- [x] Hidden below 768px
- [x] Hamburger icon in top bar
- [x] Drawer slides in from left, 240px wide
- [x] Backdrop overlay behind drawer

---

*Document created after complete Phase E Part 3 design session.*
*All layout, sidebar, animations, and collapse behavior approved.*
*Ready for production Next.js code implementation.*
