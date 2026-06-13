# Canopy Frontend — Management Dashboard

Canopy Frontend is the web-based administrative console for Canopy, designed with a custom, premium **Sage & Linen** theme. It provides a visual dashboard for developers and product managers to control feature flags, target segments, and manage credentials in real-time.

---

## 🛠 Tech Stack

* **Framework**: Next.js 16.2 (App Router)
* **Library**: React 19
* **Styling**: Tailwind CSS
* **Authentication**: NextAuth.js (v5 Beta)
* **Icons**: Lucide React
* **Quality Assurance**: TypeScript & ESLint

---

## 💎 Features Walkthrough

### 1. Feature Flags Dashboard
* **Dynamic Table**: Lists all active and inactive feature flags with key monospaced tags (`bg-[#e8f5ee]`).
* **Visual Statistics**: 4-column metric grid tracking total flags, active status, partial rollouts, and disabled flags.
* **Micro-Animations**: Clean toggle switches that trigger flash animations on state transition (`animate-flash-mint` / `animate-flash-linen`).
* **Row Options**: Direct delete and detail routing on key-clicks.

### 2. Flag Details Page (`/dashboard/flags/[key]`)
* **Targeting Rules Tab**: Create and delete direct user targeting rules (e.g., target users matching specific attribute equations).
* **Segment Targeting Tab**: Shows attached user cohorts with active badges, and contains an **Attach Segment** shortcut modal.

### 3. Segments & Cohorts (`/dashboard/segments`)
* **Segment Creator Page**: A form builder where you can dynamically add/remove user targeting rules.
* **Detail Drawer**: Slide-out panel detailing description, targeting rules, and list of linked flags showing their served variation.
* **Linked Flags Count**: Real-time batch-grouped linked count indicators.

### 4. Settings Dashboard (`/dashboard/settings`)
* **Sticky Observer Navigation**: Left navigation links that auto-highlight on scroll by tracking container viewports.
* **API Keys Section**: Standalone interface (`/dashboard/settings/api-keys`) supporting name search, status filters (All, Active, Revoked), secure plaintext key-reveal modals, `.env` file downloader, and clipboard copy animations.
* **Danger Zone**: Supports bulk flag purging and organization deleting.

---

## ⚙️ Development Setup

### 1. Environment Configuration
Create a `.env.local` file at the root of `canopy-frontend/`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=canopy-local-development-secret-32-characters-long
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### 2. Install & Start Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` with your browser.

---

## 🧪 CLI Commands

* **`npm run dev`** — Starts the hot-reloading development server.
* **`npm run build`** — Compiles the typescript files and builds an optimized Next.js production bundle.
* **`npm run lint`** — Runs ESLint code quality checks.
