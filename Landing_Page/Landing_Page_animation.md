### **🌿 Canopy Landing Page — Animation Guide**

---

#### **🧠 Core Philosophy First**

Before listing animations, understand **why** each one exists:

* **Entrance animations** → guide the eye, create hierarchy  
* **Scroll animations** → reward the user for exploring  
* **Hover animations** → give feedback, make the page feel alive  
* **Loop animations** → only for things that are meant to feel "live" (like a dashboard)

**Rule:** Every animation must have a reason. If removing it doesn't hurt the experience, it shouldn't be there.

---

### **SECTION 1 — Navbar**

#### **Animation 1 — Navbar Entrance**

**What:** The entire navbar slides down from `y: -100%` to `y: 0` and fades in **Trigger:** Page load **Duration:** `400ms` **Easing:** `ease-out` **Delay:** `0ms` — first thing that appears

#### **Animation 2 — Navbar Background on Scroll**

**What:** When the user scrolls down past the hero, the navbar gets a subtle `backdrop-blur` \+ slightly darker Forest bg \+ a thin bottom border `1px solid rgba(110,231,183,0.1)` to separate it from content beneath **Trigger:** Scroll past `80px` **Duration:** `200ms` transition **Why:** Without this, the navbar floats invisibly over light-colored sections like Features

#### **Animation 3 — Button Hover States**

**What:**

* `GitHub` and `Login` ghost buttons → mint border brightens, slight bg tint `rgba(110,231,183,0.08)`  
* `Get Started` primary button → scale up to `1.03`, slight brightness increase **Duration:** `150ms` **Easing:** `ease-out`

---

### **SECTION 2 — Hero**

#### **Animation 4 — Badge Fade In**

**What:** The `Open Source · Portfolio Project` badge fades in from `opacity: 0` to `opacity: 1` \+ rises `10px` **Trigger:** Page load **Duration:** `400ms` **Delay:** `100ms` (just after navbar)

#### **Animation 5 — Headline Word-by-Word Stagger**

**What:** `Ship features faster. Stay in control.` — each **word** fades in and rises from `y: 20px` to `y: 0`, one word at a time **Trigger:** Page load **Duration per word:** `350ms` **Stagger between words:** `80ms` **Delay:** `300ms` (after badge) **Why:** This is the single most important animation on the page — the headline is the first thing a visitor reads

#### **Animation 6 — Sub-text Fade In**

**What:** The paragraph below the headline fades from `opacity: 0` to `opacity: 1` **Trigger:** After headline finishes **Duration:** `400ms` **Delay:** `800ms` from page load

#### **Animation 7 — CTA Buttons Pop In**

**What:** Both buttons scale from `scale: 0.92` to `scale: 1` and fade in together **Trigger:** After sub-text **Duration:** `350ms` **Delay:** `1100ms` from page load **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot/bounce feel

#### **Animation 8 — Dashboard Mockup Slide Up**

**What:** The entire mockup card slides up from `y: 40px` to `y: 0` and fades in **Trigger:** After buttons appear **Duration:** `500ms` **Delay:** `1300ms` from page load **Easing:** `ease-out`

#### **Animation 9 — Dashboard Toggle Auto-Play (Loop)**

**What:** After the card appears, the toggles in the mockup animate in sequence — the Row 1 toggle pulses mint glow briefly (like someone just flipped it ON), then Row 2 does the same, 1 second apart **Trigger:** After mockup appears, then loops every `6 seconds` **Duration per toggle:** `600ms` glow pulse **Why:** This makes the mockup feel like a live product, not a static screenshot — it's the most memorable part of the hero

#### **Animation 10 — Rollout Bars Fill**

**What:** When the mockup card first appears, the rollout progress bars fill from `width: 0%` to their final value (100%, 50%, 25%, 10%) with a smooth fill animation **Trigger:** Mockup entrance (one time only) **Duration:** `800ms` **Stagger:** `150ms` between each row **Easing:** `ease-out`

---

### **SECTION 3 — Features**

#### **Animation 11 — Section Heading Fade Up**

**What:** `Everything you need for feature management` fades in and rises `20px` **Trigger:** Scroll into view (Intersection Observer) **Duration:** `500ms` **Threshold:** When `30%` of the element is visible

#### **Animation 12 — Feature Cards Staggered Entrance**

**What:** Each card fades in and rises from `y: 30px` to `y: 0`, one after another **Trigger:** Scroll into view **Duration:** `450ms` per card **Stagger:** `150ms` (card 1 → card 2 → card 3\) **Easing:** `ease-out`

#### **Animation 13 — Feature Card Hover**

**What:** On hover — card rises `-4px` (`translateY(-4px)`), border color brightens from `#d1fae5` to `#6ee7b7`, box shadow appears `0 8px 24px rgba(28,58,47,0.1)` **Duration:** `200ms` **Why:** Makes the cards feel interactive and polished — like they want to be read

#### **Animation 14 — Icon Box Hover**

**What:** When hovering a feature card, the icon box inside does a subtle `scale(1.1)` with a mint glow shadow `0 0 12px rgba(110,231,183,0.4)` **Duration:** `200ms` **Why:** Adds a second layer of depth to the hover — the icon responds too, not just the card

---

### **SECTION 4 — How It Works**

#### **Animation 15 — Step Numbers Count Up Entrance**

**What:** The 3 circles (1, 2, 3\) scale from `scale: 0` to `scale: 1` one by one with a springy bounce **Trigger:** Scroll into view **Duration:** `400ms` per circle **Stagger:** `200ms` **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — the same bounce as the hero buttons

#### **Animation 16 — Connector Line Draw**

**What:** The horizontal line between step circles animates its `width` from `0%` to `100%` left-to-right, as if being drawn in real time **Trigger:** After circle 1 appears **Duration:** `600ms` **Easing:** `ease-in-out` **Why:** This is the most satisfying animation on the page — the line "connecting" the steps draws itself as you watch

#### **Animation 17 — Step Text Fade In**

**What:** Each step's title and description fade in after its circle appears **Trigger:** After each respective circle animates **Duration:** `300ms` **Delay:** `100ms` after each circle

---

### **SECTION 5 — Evaluation API**

#### **Animation 18 — Section Heading Fade Up**

**What:** `One API call. Any language.` fades and rises **Trigger:** Scroll into view **Duration:** `500ms`

#### **Animation 19 — Code Cards Slide In From Sides**

**What:** Left code card slides in from `x: -30px`, right card from `x: +30px`, both fading in simultaneously **Trigger:** Scroll into view **Duration:** `500ms` **Easing:** `ease-out` **Why:** Much more interesting than both cards just fading up — the left/right slide mirrors the REQUEST/RESPONSE relationship

#### **Animation 20 — Code Typewriter Effect (Optional but Impressive)**

**What:** After the cards appear, the code inside types itself character by character — starting with `POST /api/evaluate/new-checkout-flow` on the left, then the response appears on the right **Trigger:** After cards finish sliding in **Duration:** `~1.5 seconds` total **Why:** This is the single most "wow" animation on the entire page. It makes the API feel real and alive. Recruiters will stop scrolling for this. **Note:** Mark this as optional — if it causes performance issues, skip it and use a simple fade-in instead

---

### **SECTION 6 — Variation Types**

#### **Animation 21 — Section Heading Fade Up**

**What:** Standard fade \+ rise **Trigger:** Scroll into view **Duration:** `500ms`

#### **Animation 22 — Type Cards Staggered Entrance**

**What:** Each of the 4 cards fades in and rises, left to right **Trigger:** Scroll into view **Duration:** `400ms` per card **Stagger:** `100ms`

#### **Animation 23 — Badge Pill Hover Glow**

**What:** On hovering each card, the colored badge pill gets a soft glow matching its color — e.g. Boolean badge gets a `box-shadow: 0 0 10px rgba(5,150,105,0.3)` green glow **Duration:** `200ms` **Why:** Subtle but delightful — each badge type glows its own color

---

### **SECTION 7 — Footer**

#### **Animation 24 — Footer Fade In**

**What:** The footer content fades in as it enters the viewport **Trigger:** Scroll into view **Duration:** `400ms`

#### **Animation 25 — Stack Pills Hover**

**What:** On hovering a stack pill (`Next.js`, `Spring Boot`, etc.) — border brightens to mint `#6ee7b7`, text brightens to `#f7f7f2` **Duration:** `150ms`

---

### **🌐 Global Scroll Behavior**

#### **Animation 26 — Smooth Scroll**

**What:** When any nav link or CTA button navigates to a section, the page scrolls smoothly instead of jumping **Implementation:** `scroll-behavior: smooth` in CSS or Next.js `scrollIntoView({ behavior: 'smooth' })`

#### **Animation 27 — Scroll Progress Indicator (Optional)**

**What:** A thin mint `#6ee7b7` line at the very top of the page (above the navbar) that fills from left to right as the user scrolls down the page **Height:** `2px` **Why:** Common on developer-focused sites — signals "you are reading something worth finishing"

---

### **📋 Priority Order for Implementation**

MUST HAVE (core experience):  
1\.  Navbar entrance slide down  
2\.  Hero headline word-by-word stagger  
3\.  Hero CTA buttons pop in  
4\.  Dashboard mockup slide up  
5\.  Rollout bars fill animation  
6\.  Feature cards staggered entrance \+ hover lift  
7\.  How It Works connector line draw  
8\.  Step circles bounce entrance  
9\.  Scroll-triggered fade-up on all section headings  
10\. Navbar bg change on scroll

GREAT TO HAVE (polish):  
11\. Dashboard toggle pulse loop  
12\. Code cards slide in from sides  
13\. Variation type cards stagger  
14\. Badge pill hover glow  
15\. Smooth scroll

OPTIONAL (impressive but complex):  
16\. Code typewriter effect in API section  
17\. Scroll progress bar at top

---

### **⚠️ What NOT to Animate**

* **No parallax** — makes people feel sick on mobile  
* **No infinite floating elements** — distracting while reading  
* **No page transition wipes** — this is a single landing page  
* **No animation on the footer** — people scroll there with purpose, don't slow them down  
* **No hover animations on the navbar logo** — logos shouldn't wiggle

---

Once you approve this list, the next step is building the actual Next.js code with these animations using **Framer Motion** (the standard animation library for Next.js). That will be part of the production code session.

