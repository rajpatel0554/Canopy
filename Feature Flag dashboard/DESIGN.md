---
name: Sage & Linen
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fd'
  surface-container-highest: '#d9e3f7'
  on-surface: '#121c2a'
  on-surface-variant: '#414845'
  inverse-surface: '#273140'
  inverse-on-surface: '#ebf1ff'
  outline: '#727974'
  outline-variant: '#c1c8c3'
  surface-tint: '#466558'
  primary: '#05241a'
  on-primary: '#ffffff'
  primary-container: '#1c3a2f'
  on-primary-container: '#84a496'
  inverse-primary: '#adcebe'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#80f9c8'
  on-secondary-container: '#007353'
  tertiary: '#1e201d'
  on-tertiary: '#ffffff'
  tertiary-container: '#333532'
  on-tertiary-container: '#9c9d99'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8eada'
  primary-fixed-dim: '#adcebe'
  on-primary-fixed: '#012017'
  on-primary-fixed-variant: '#2f4d41'
  secondary-fixed: '#80f9c8'
  secondary-fixed-dim: '#62dcad'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#e2e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454744'
  background: '#f9f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f7'
typography:
  headline-lg:
    fontFamily: DM Serif Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: DM Serif Display
    fontSize: 22px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  sidebar-width: 260px
---

## Brand & Style

The design system is built for a technical environment that prioritizes clarity, calm, and precision. It blends a "Corporate Modern" foundation with "Minimalist" editorial touches to transform the usually chaotic nature of feature flag management into a serene, structured experience.

The aesthetic, rooted in the "Sage & Linen" theme, uses a sophisticated organic palette to reduce the cognitive load of DevOps workflows. It avoids the aggressive neon-on-dark tropes of developer tools, opting instead for a tactile, high-end dashboard feel that communicates stability and intentionality.

**Key Visual Principles:**
- **Organic Precision:** Sharp technical data (monospaced keys) set against soft, natural backgrounds.
- **Editorial Hierarchy:** Using serif headings to provide a sense of authority and "state of the union" clarity for feature rollouts.
- **Intentional Contrast:** Deep forest tones for navigation to anchor the user, with light linen surfaces for the primary workspace to enhance readability.

## Colors

The palette is divided into functional zones to create clear mental models:
- **Navigation Zone (Primary):** Uses the "Forest" (#1C3A2F) as a high-contrast sidebar background, providing a solid anchor for the interface.
- **Canvas Zone (Tertiary):** The "Linen" (#F7F7F2) background provides a warm, low-strain surface for long-term monitoring.
- **Action & Pulse (Secondary):** "Mint" (#6EE7B7) is the primary interactive color, used for active states, successful toggles, and primary call-to-actions.
- **Data Types:** A specific categorical palette is used for feature flag variants (Boolean, String, Number, JSON) to allow for instant visual parsing of configuration types.

## Typography

This system employs a tri-font strategy to balance elegance with technical utility:
- **Headings:** DM Serif Display brings an editorial, sophisticated feel to page titles and section headers, making the dashboard feel like a controlled environment.
- **Body & UI:** DM Sans provides a neutral, highly legible sans-serif for controls, descriptions, and list items.
- **Technical Data:** JetBrains Mono is strictly reserved for "Keys," "JSON payloads," and "Environment Variables," ensuring that code-specific characters are unmistakable.

On mobile devices, `headline-lg` should scale down to 28px to maintain readability without excessive wrapping.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid** model:
- **Sidebar:** A fixed 260px vertical navigation bar anchored to the left.
- **Main Canvas:** A fluid area with a maximum content width of 1280px to prevent line lengths from becoming unreadable on ultra-wide monitors.
- **Grid:** A 12-column grid system is used within the main canvas for card layouts.
- **Rhythm:** An 8px linear scale (referenced as `base * n`) governs all padding and margins. 

**Breakpoints:**
- **Mobile (<768px):** Sidebar collapses into a hamburger menu; horizontal padding reduces to 16px; cards stack vertically.
- **Tablet (768px - 1024px):** Sidebar remains visible but may transition to an icon-only "rail" if space is constrained.
- **Desktop (>1024px):** Full sidebar and 24px-40px page margins.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Low-Contrast Outlines** to define hierarchy. 

- **Level 0 (Background):** The "Linen" (#F7F7F2) surface.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) cards. These use a 1px border of #D1FAE5 (Mint-Border) and a very soft, diffused shadow (`0px 4px 12px rgba(28, 58, 47, 0.05)`) to suggest a slight lift from the linen background.
- **Level 2 (Modals/Overlays):** These use a more pronounced shadow to pull them forward and include a background blur (Backdrop Filter: 8px) over the page content.

Depth is communicated more through color shifts (Linen to White) than through heavy drop shadows, maintaining the clean, minimalist aesthetic.

## Shapes

The shape language is "Soft," utilizing a 0.25rem (4px) base radius. This provides just enough softness to feel modern and approachable while maintaining the professional, technical structure required for a developer tool.

- **Primary Radius (4px):** Applied to Buttons, Inputs, and Badges.
- **Container Radius (8px):** Applied to Cards and Modals.
- **Full Radius (Pill):** Reserved exclusively for Toggles and the "Rollout Bar" to emphasize their status as fluid, interactive elements.

## Components

### Buttons & Toggles
- **Primary Button:** Mint background, Forest text. High contrast for critical actions.
- **Toggles:** The primary state indicator. ON state uses the Mint fill. OFF state uses Muted (#9CA3AF). The thumb is always White, maintaining a tactile look.

### Cards
- Cards represent individual Feature Flags. They must have a White background and a #D1FAE5 border. 
- Header areas within cards should use the `headline-sm` serif for the flag name and `label-code` for the technical key.

### Badges & Chips
- Use the Variant palette defined in the Colors section. 
- Badges are small, subtly rounded, and use a "Tinted background / Deep text" color pairing for maximum legibility.

### Rollout Bar
- A custom component showing percentage-based traffic distribution. 
- Track: #D1FAE5 (Mint-Border). 
- Fill: #6EE7B7 (Mint).
- Labels: Use `label-code` at either end to indicate 0% and 100%.

### Navigation
- Active items in the sidebar should use a Mint tint background (10% opacity) or Mint text to contrast against the Forest sidebar.
- Hover states should be subtle, utilizing a slight lightening of the background.