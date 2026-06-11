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
  forest: '#1c3a2f'
  mint: '#6ee7b7'
  linen: '#f7f7f2'
  mint-soft: '#d1fae5'
  purple-soft: '#ede9fe'
  amber-soft: '#fef3c7'
  red-soft: '#fee2e2'
  boolean-text: '#059669'
  string-text: '#6d28d9'
  number-text: '#d97706'
  json-text: '#dc2626'
typography:
  display:
    fontFamily: DM Serif Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: DM Serif Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: DM Serif Display
    fontSize: 24px
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
    lineHeight: '1.6'
  label-bold:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  section-padding: 5rem
  card-padding: 1.75rem
---

## Brand & Style

The design system embodies a "Sage & Linen" aesthetic—a sophisticated blend of organic serenity and professional reliability. Designed for a developer-centric feature flag service, it balances the technical nature of SaaS with an editorial, high-end feel. 

The visual style is **Corporate / Modern** with a **Minimalist** editorial edge. It utilizes deep, forest greens to convey stability and "always-on" reliability, while mint accents provide a sense of growth and digital freshness. The "Linen" neutral base avoids the sterile coldness of pure white, opting instead for a warm, accessible workspace environment. Elements are structured with generous whitespace and clear, high-contrast borders to maintain professional clarity.

## Colors

The palette is anchored by **Forest (#1c3a2f)**, used for primary backgrounds, headings, and high-impact UI elements. **Mint (#6ee7b7)** serves as the high-energy action color, used for primary buttons, success states, and subtle highlights. **Linen (#f7f7f2)** acts as the secondary background color to create soft depth against pure white surfaces.

Functional variation types are color-coded using a pastel-and-ink system:
- **Boolean:** Soft Mint background with Emerald text.
- **String:** Soft Purple background with Violet text.
- **Number:** Soft Amber background with Ochre text.
- **JSON:** Soft Red background with Crimson text.

For code evaluation blocks, a "Dark Forest" theme is used, employing high-saturation mint, amber, and purple for syntax highlighting against the primary Forest background.

## Typography

This system uses a tiered typographic approach:
- **DM Serif Display** is used for all headlines and "Canopy" branding. It adds an authoritative, literary character to the interface. Headlines should maintain tight line spacing.
- **DM Sans** handles all functional body text and UI labels, providing a clean, geometric contrast to the serif headings.
- **JetBrains Mono** is reserved for technical data, including flag keys, API evaluation examples, and code blocks.

For mobile devices, large display text should scale down to `headline-lg-mobile` to ensure legibility without excessive wrapping. Use `label-bold` for navigation and button text to ensure clear hierarchy.

## Layout & Spacing

The design system utilizes a **Fixed Grid** model for desktop, centered within a 1280px container. On mobile, it transitions to a fluid single-column layout with 1rem side margins.

- **Rhythm:** A consistent 4px/8px baseline is used. 
- **Sections:** Large landing page sections are separated by 5rem (80px) of vertical padding to maintain the minimalist, airy feel.
- **Grids:** Feature sections use a 3-column grid, while variation types use a 4-column grid. 
- **Gutters:** Standard gutters are set to 1.5rem (24px) to provide clear separation between cards and interactive elements.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Surface Tiers:** The primary background is White (#FFFFFF). Secondary sections or interactive cards use Linen (#F7F7F2) to create a subtle "inset" or "elevated" feel without needing drop shadows.
- **Borders:** Cards and input fields use a soft border (Mint-soft #D1FAE5) to define boundaries. This keeps the UI feeling light and clean.
- **Overlays:** For developer-centric content like code blocks, a deep Forest background is used with a 25% black overlay (`rgba(0,0,0,0.25)`) to create internal depth for nested code cards.

## Shapes

The design system utilizes a **Rounded** shape language to soften the technical nature of the product.

- **Standard Radius:** 0.5rem (8px) is the default for input fields and small buttons.
- **Large Radius (rounded-lg):** 1rem (16px) is used for feature cards and container elements.
- **Pill (rounded-full):** Used for status badges, tags, and secondary action buttons (e.g., "Instant flag toggles") to create high visual distinction from primary buttons.

## Components

### Buttons
- **Primary:** Forest background with Linen text, 700 weight. Used for the main "Get Started" actions.
- **Secondary/Mint:** Mint background with Forest text. Used for "Sign In" or "Create Account."
- **Ghost:** Transparent background with a Mint border and Mint text. Used for navigation and secondary GitHub links.

### Cards
- **Feature Cards:** Linen background with a Soft Mint border. 28px top/bottom padding and 24px side padding. Features a Forest icon box (44x44px) with Mint icons.

### Inputs
- **Text Fields:** White background with a Soft Mint border. 0.5rem corner radius. Focus state should intensify the border to the primary Mint color.
- **Toggle Switches:** Mint for the 'ON' state, and a muted Forest-gray for the 'OFF' state.

### Badges
- **Type Badges:** Small, pill-shaped tags using the variation color palette defined in the Colors section. Text is uppercase and bold for high scannability.

### Code Blocks
- Nested cards with a dark semi-transparent background. Use JetBrains Mono for all content. Syntax highlighting must adhere to the Mint/Amber/Purple palette.