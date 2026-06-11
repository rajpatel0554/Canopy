# 🌿 Canopy — Phase E Part 2 Progress Log
# Auth Pages: Login + Register + Auth.js Session

> This file is a **fully self-contained** reference. It includes all project context from Phases A–E Part 1 plus everything to build in Phase E Part 2. A new AI assistant reading only this file has full context to continue the project.

---

## ⚡ New Chat Orientation — Read This First

You are helping a **beginner developer** build a portfolio project called **Canopy**.
- Explain every concept before writing code
- Go step by step, never skip ahead
- Act as both a **Senior Frontend Developer** (clean code, best practices) and **Project Manager** (track what's done, what's next)
- The developer understands backend Java/Spring Boot but is new to Next.js/TypeScript/React
- Always explain *why* before *how*
- **IMPORTANT:** Before writing any code for a UI page, first show a visual mockup/preview of how the page will look. The developer wants to see and approve the design before any code is written.

---

## Project Overview — Canopy

**Canopy** is a multi-tenant feature flag service. Organizations use it to manage feature rollouts, run A/B tests, and control feature access across their apps. It is a portfolio project built with production-grade architecture.

**Live GitHub Repo:** https://github.com/rajpatel0554/Canopy

---

## Full Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Java 21 + Spring Boot | Running on port **8081** |
| Database | PostgreSQL | Database name: **canopy_db** |
| ORM | Spring Data JPA + Hibernate | |
| Migrations | Flyway | |
| Auth | JWT (JJWT library) | |
| Package | `com.canopy.canopy_backend` | |
| Frontend | Next.js 16 (App Router) | Running on port **3000** |
| Styling | Tailwind CSS v4 | |
| UI Library | shadcn/ui (Radix, Nova preset) | |
| Frontend Auth | Auth.js (next-auth@beta) | Wraps backend JWT |
| Frontend Deploy | Vercel | Phase F |
| Backend Deploy | Railway | Phase F |

---

## Backend Summary — Phases A through D (All Complete ✅)

### Database Schema
```
canopy_db (PostgreSQL)
├── public/
│     ├── tenants              ← tenant_id, name, slug, created_at
│     ├── users                ← user_id, email, password(BCrypt), tenant_id, role, created_at
│     └── api_keys             ← key_id, tenant_id, hashed_key, name, created_at
│
└── tenant_{slug}/
      ├── flags                ← flag_id, key, name, description, variation_type, enabled, rollout_percentage, created_at
      ├── flag_variations      ← variation_id, flag_id, value(JSONB), is_default
      ├── targeting_rules      ← rule_id, flag_id, attribute, operator, value, variation_id, priority
      ├── segments             ← segment_id, name, description, created_at
      ├── segment_rules        ← rule_id, segment_id, attribute, operator, value
      └── flag_segments        ← flag_id, segment_id, variation_id (composite PK)
```

### Auth Endpoints (Public — No Token Required)
```
POST  /api/auth/register    → { email, password, tenantSlug } → { token, email, role, tenantId }
POST  /api/auth/login       → { email, password }             → { token, email, role, tenantId }
```

### All Other Endpoints (Protected — Bearer Token Required)
```
GET/POST        /api/flags
GET/PUT/DELETE  /api/flags/{flagKey}
PATCH           /api/flags/{flagKey}/toggle
POST            /api/evaluate/{flagKey}
POST            /api/evaluate/batch
GET/POST/DELETE /api/flags/{flagKey}/rules
GET/POST/DELETE /api/segments
GET/POST/DELETE /api/segments/{segmentId}/rules
POST/DELETE     /api/flags/{flagKey}/segments
GET/DELETE      /api/tenants
```

### JWT Token Structure
Every protected request must include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```
The token contains claims: `email`, `tenantSlug`.

---

## Design System — Sage & Linen Theme

### Colors
| Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Forest | `#1c3a2f` | `bg-forest` / `text-forest` | Sidebar, primary buttons |
| Mint | `#6ee7b7` | `bg-mint` / `text-mint` | Accent, active states |
| Linen | `#f7f7f2` | `bg-linen` | Page background |
| Card | `#ffffff` | `bg-card` | Card backgrounds |
| Border | `#d1fae5` | `border-canopy-border` | Borders, dividers |
| Success | `#059669` | `bg-success` | Enabled flags |
| Danger | `#dc2626` | `bg-danger` | Errors, kill switches |
| Warning | `#d97706` | `bg-warning` | Partial rollouts |
| Text | `#374151` | `text-canopy-text` | Body text |
| Muted | `#9ca3af` | `text-muted` | Secondary text |

### Typography
| Role | Font | Tailwind Class |
|---|---|---|
| Headings | DM Serif Display | `font-serif` |
| Body / UI | DM Sans | `font-sans` |
| Code / Keys | JetBrains Mono | `font-mono` / `.font-key` |

---

## Phase E Part 1 — Complete ✅

### What Was Built
- Next.js 16 project created at `D:\Canopy\canopy-frontend`
- Tailwind CSS v4 configured with full Sage & Linen color palette
- DM Serif Display, DM Sans, JetBrains Mono loaded via `next/font/google`
- shadcn/ui initialized (Radix, Nova preset) with 14 components
- All npm dependencies installed (next-auth@beta, clsx, tailwind-merge, lucide-react)
- `types/index.ts` — all TypeScript types defined
- `lib/api.ts` — central API client for all backend endpoints
- `.env.local` — environment variables configured
- `app/page.tsx` — themed placeholder home page verified working
- `CorsConfig.java` — added to Spring Boot backend

### Current File Structure
```
D:\Canopy\
├── canopy-backend/
│   └── src/main/java/com/canopy/canopy_backend/
│       └── config/
│           └── CorsConfig.java       ← CORS fix for localhost:3000
│
└── canopy-frontend/
    ├── app/
    │   ├── layout.tsx                ← DM Sans + DM Serif + JetBrains Mono loaded
    │   ├── globals.css               ← Tailwind v4 @theme with Sage & Linen colors
    │   └── page.tsx                  ← Themed placeholder home page ✅
    ├── components/
    │   └── ui/                       ← 14 shadcn/ui components
    │       ├── button.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── dialog.tsx
    │       ├── table.tsx
    │       ├── badge.tsx
    │       ├── switch.tsx
    │       ├── slider.tsx
    │       ├── select.tsx
    │       ├── tabs.tsx
    │       ├── card.tsx
    │       ├── dropdown-menu.tsx
    │       ├── separator.tsx
    │       └── sonner.tsx
    ├── lib/
    │   ├── api.ts                    ← Central API client
    │   └── utils.ts                  ← shadcn utility (cn function)
    ├── types/
    │   └── index.ts                  ← All TypeScript types
    ├── .env.local                    ← API URL + Auth.js secrets
    ├── tailwind.config.ts            ← Does NOT exist (v4 uses globals.css)
    └── package.json
```

### Key Files Content

#### app/globals.css (Tailwind v4 — no tailwind.config.ts)
```css
@import "tailwindcss";

@theme {
  --color-forest:         #1c3a2f;
  --color-mint:           #6ee7b7;
  --color-linen:          #f7f7f2;
  --color-card:           #ffffff;
  --color-canopy-border:  #d1fae5;
  --color-success:        #059669;
  --color-danger:         #dc2626;
  --color-warning:        #d97706;
  --color-canopy-text:    #374151;
  --color-muted:          #9ca3af;

  --font-serif: var(--font-dm-serif), serif;
  --font-sans:  var(--font-dm-sans), sans-serif;
  --font-mono:  var(--font-jetbrains-mono), monospace;

  --radius: 0.5rem;
}

body {
  background-color: var(--color-linen);
  color: var(--color-canopy-text);
  font-family: var(--font-sans);
}

.font-key {
  font-family: var(--font-mono);
}
```

#### app/layout.tsx
```tsx
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canopy — Feature Flag Service",
  description: "Multi-tenant feature flag management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

---

## Phase E — Full Plan Overview

```
Phase E
├── Part 1 — Project Setup + CORS Fix           ✅ DONE
├── Part 2 — Auth Pages (Login + Register)      ✅ DONE
├── Part 3 — Landing Page (Static)              ✅ DONE
├── Part 4 — App Shell (Sidebar + Dashboard)    ← WE ARE HERE
├── Part 5 — Flags List Page
├── Part 6 — Flag Detail Page
└── Part 7 — Segments Page
```

---

## Phase E — Part 2: Auth Pages

### What Part 2 Accomplishes

By the end of Part 2 you will have:
- A `/login` page connected to `POST /api/auth/login`
- A `/register` page connected to `POST /api/auth/register`
- Auth.js (next-auth@beta) configured to store the JWT from the backend in an encrypted session cookie
- A `middleware.ts` that protects all `/dashboard/*` routes — unauthenticated users are redirected to `/login`
- Route groups set up: `(auth)` for login/register (no sidebar), `(dashboard)` for protected pages (with sidebar — added in Part 3)

### Folder Structure After Part 3
```
app/
├── (auth)/
│   ├── layout.tsx          ← Simple centered layout, no sidebar
│   ├── login/
│   │   └── page.tsx        ← Login form
│   └── register/
│       └── page.tsx        ← Register form
├── (dashboard)/
│   └── layout.tsx          ← Protected layout shell
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts    ← Auth.js API route handler
├── layout.tsx              ← Root layout (fonts, metadata)
├── globals.css             ← Theme & Keyframes
└── page.tsx                ← 🌿 Production Landing Page (staggered Hero, animated tables, typewriter API cards, variation grid)

auth.ts                     ← Auth.js session config
proxy.ts                    ← Next.js 16 Proxy route protection (replaces middleware.ts)
```

### Concepts to Cover Before Coding
1. **What is Auth.js / next-auth?** — Session management wrapper around our backend JWT
2. **What are Route Groups?** — `(auth)` and `(dashboard)` folders with parentheses
3. **What is middleware.ts?** — Runs before every request, used for route protection
4. **What is a session cookie?** — How Auth.js stores the JWT securely in the browser
5. **What is a Credentials Provider?** — How Auth.js uses our custom backend login instead of Google/GitHub OAuth

### Step-by-Step Plan

```
Step 1  — Show Login page mockup (visual preview before code)
Step 2  — Show Register page mockup (visual preview before code)
Step 3  — Get developer approval on both designs
Step 4  — Create route group folders (auth) and (dashboard)
Step 5  — Create (auth)/layout.tsx
Step 6  — Configure Auth.js: lib/auth.ts
Step 7  — Create Auth.js API route: app/api/auth/[...nextauth]/route.ts
Step 8  — Create Login page: app/(auth)/login/page.tsx
Step 9  — Create Register page: app/(auth)/register/page.tsx
Step 10 — Create middleware.ts for route protection
Step 11 — Create (dashboard)/layout.tsx (placeholder, sidebar added in Part 3)
Step 12 — Test: register a new user, login, verify session, check redirect
```

### Auth.js Flow Explained
```
User fills login form
        ↓
signIn("credentials", { email, password })
        ↓
Auth.js calls our authorize() function in lib/auth.ts
        ↓
authorize() calls POST /api/auth/login on Spring Boot
        ↓
Spring Boot returns { token, email, role, tenantId }
        ↓
Auth.js stores this in an encrypted session cookie
        ↓
Every page can call getServerSession() or useSession()
to get { token, email, role, tenantId }
        ↓
Token is passed to all protected API calls
```

### Login Page Design Spec
- Linen background (`bg-linen`)
- Centered card (`bg-card`, `border-canopy-border`, `rounded-xl`, `shadow-sm`)
- 🌿 Logo + "Canopy" in DM Serif Display at top
- "Welcome back" heading
- Email input + Password input
- Forest green "Sign In" button (full width)
- Link to Register page below
- Error message shown in danger red if login fails

### Register Page Design Spec
- Same card layout as Login
- "Create your account" heading
- Email input + Password input + Tenant Slug input
- Tenant Slug explained with helper text: "Your organization's unique identifier (e.g. acme-corp)"
- Forest green "Create Account" button (full width)
- Link back to Login page
- Error message in danger red if registration fails

---

## Important Technical Notes for Part 2

### next-auth@beta with Next.js App Router
- Auth.js v5 (next-auth@beta) has a different API than v4
- Config goes in `lib/auth.ts`, exported as `{ handlers, auth, signIn, signOut }`
- API route is at `app/api/auth/[...nextauth]/route.ts` and just re-exports `handlers`
- Session is accessed server-side with `auth()` (not `getServerSession`)
- Session is accessed client-side with `useSession()` from `next-auth/react`
- `SessionProvider` must wrap the app for client-side session access

### TypeScript Session Augmentation
next-auth needs to be told about our custom session fields (token, role, tenantId).
This requires module augmentation in `lib/auth.ts`:
```ts
declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      email: string;
      role: string;
      tenantId: string;
    }
  }
}
```

### Tenant Slug Rules
- Lowercase letters, numbers, hyphens only
- Examples: `acme-corp`, `raj-dev`, `mycompany`
- The backend creates a separate PostgreSQL schema `tenant_{slug}` on register
- Must be unique across all tenants

---

## Completion Checklist for Part 2 & Part 3

```
☑ Visual mockup of Login page shown and approved
☑ Visual mockup of Register page shown and approved
☑ app/(auth)/layout.tsx created
☑ app/(dashboard)/layout.tsx created
☑ auth.ts — Auth.js config with Credentials provider
☑ app/api/auth/[...nextauth]/route.ts — API handler
☑ app/(auth)/login/page.tsx — Login form connected to backend
☑ app/(auth)/register/page.tsx — Register form connected to backend
☑ proxy.ts — Next.js 16 Proxy protects dashboard routes
☑ app/page.tsx — Static Landing Page with custom scroll animations and typewriter API blocks
☑ Verified Next.js production build runs successfully
```

---

## What's Next After Part 3 — Part 4

```
✅ Phase E Part 1 — Project Setup
✅ Phase E Part 2 — Auth Pages (Login + Register)
✅ Phase E Part 3 — Landing Page (Static)
→  Phase E Part 4 — App Shell (Sidebar + Dashboard Layout)
→  Phase E Part 5 — Flags List Page
→  Phase E Part 6 — Flag Detail Page
→  Phase E Part 7 — Segments Page
→  Phase F        — Deploy (Vercel + Railway)
```

---

## Key Architecture Decisions Log

| Decision | Choice | Why |
|---|---|---|
| Next.js App Router | Yes | Modern, file-system routing, built-in layouts |
| TypeScript | Yes | Catch bugs early, editor autocomplete |
| Tailwind CSS v4 | Installed by default | No tailwind.config.ts — theme in globals.css via @theme |
| Route Groups | `(auth)` and `(dashboard)` | Separate layouts without affecting URLs |
| Auth.js v5 (beta) | next-auth@beta | Wraps backend JWT, handles session securely |
| Credentials Provider | Yes | Our backend does auth, not OAuth |
| Central API client | `lib/api.ts` | DRY — one place for all backend calls |
| shadcn/ui | Radix + Nova preset | We own the code, Tailwind v4 compatible |
| Fonts via next/font | All 3 fonts | Self-hosted, no layout shift, no CSS @import issues |
| CORS via CorsFilter | Done in Part 1 | Spring bean, applies globally |

---

*🌿 Canopy — Built by Raj Patel · Portfolio Project · github.com/rajpatel0554/Canopy*
