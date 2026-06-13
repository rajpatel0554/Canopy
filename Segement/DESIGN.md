---
name: Canopy Design System
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
  display-lg:
    fontFamily: DM Serif Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Serif Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: DM Serif Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  title-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is built for a technical SaaS environment that balances high-utility developer tools with a sophisticated, calm editorial aesthetic. The brand personality is "The Prepared Architect"—authoritative and precise, yet approachable and grounded. 

The design style is **Corporate Modern with a Minimalist/Editorial influence**. It utilizes a structured grid, generous whitespace, and high-quality serif typography to create a sense of reliability and clarity. The UI avoids unnecessary decorative elements, opting instead for functional depth through subtle borders and a nature-inspired color palette that reduces cognitive load during complex configuration tasks.

## Colors

The color strategy focuses on high legibility and structural hierarchy. 
- **Linen (#f7f7f2)** serves as the primary canvas, providing a warmer, more sophisticated backdrop than pure white.
- **Forest (#1c3a2f)** is used for all semantic grounding—headers, titles, and primary navigation—ensuring the user's eye is drawn to the structural anchors of the application.
- **Mint Accents** are used sparingly for interactivity and success states. The **Mint Shell (#e8f5ee)** tint is reserved for subtle grouping within sections or alternative row highlights.
- **White (#ffffff)** is strictly used for elevated surfaces like cards and input fields to provide maximum contrast against the Linen background.

## Typography

This design system employs a three-family typographic scale.
- **Titles & Headings:** Use **DM Serif Display**. This provides the "Sage" editorial feel, making the product feel established and premium. Use it for page titles and major section headers.
- **UI & Body:** Use **DM Sans**. This geometric sans-serif ensures clarity for data-heavy dashboard elements. 
- **Technical Data:** Use **JetBrains Mono** for feature flag keys, environment variables, and code snippets. This differentiates technical identifiers from natural language.

Labels for inputs and small metadata should use `label-md` with uppercase styling to ensure they are distinct from body text.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for the main content area, maxing out at 1280px for optimal readability. 

- **Vertical Rhythm:** A 4px baseline grid governs all spacing. Use `stack-md` (16px) for most component spacing and `stack-lg` (24px) for section margins.
- **Card Layouts:** Information is grouped in white cards. Multiple cards in a horizontal row should use the 24px gutter.
- **Mobile Adaptation:** On mobile, margins shrink to 16px. Multi-column card layouts reflow into a single-column stack. Sidebars transition into a bottom-anchored or overlay menu.

## Elevation & Depth

This design system uses **Tonal Layers and Low-contrast Outlines** rather than heavy shadows to indicate depth.

- **Level 0 (Canvas):** Linen (#f7f7f2) background.
- **Level 1 (Surfaces):** White (#ffffff) cards. These are defined by a 1px solid border using **Mint Mid (#a7f3d0)** or **Mint Light (#d1fae5)** depending on the content density.
- **Interactivity:** On hover, a card may utilize a very soft, diffused ambient shadow (4px blur, 4% Forest color) to indicate clickability.
- **Overlays:** Modals and dropdowns use a White background with a slightly darker Forest-tinted border (10% opacity) to separate from the Level 1 cards.

## Shapes

The shape language is **Soft and Precise**. 
- **Standard UI elements** (Inputs, Buttons, Cards) use a **0.25rem (4px)** corner radius. This maintains a professional, crisp appearance while avoiding the harshness of sharp corners.
- **Large containers** and prominent feature cards can use `rounded-lg` (8px) to soften the layout.
- **Tags and Status Pills** are the exception, utilizing a fully rounded (pill-shaped) radius to clearly distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Forest (#1c3a2f) background with Mint (#6ee7b7) text. Bold, high-contrast, authoritative.
- **Secondary:** Mint Light (#d1fae5) background with Forest text.
- **Ghost:** No background, Mint-Mid border, Forest text.

### Inputs & Selects
- **Background:** White (#ffffff).
- **Border:** 1px solid Mint-Mid (#a7f3d0).
- **Text:** Near-black (#111827) for typed values, Muted (#9ca3af) for placeholders.
- **Focus:** 1px Forest border with a 2px Mint-Light outer glow.

### Cards
- **Structure:** White background, 1px Mint-Light border. 
- **Header:** Optional Mint-Shell (#e8f5ee) top-strip or background for the header area to group titles.

### Chips & Badges
- **Active Flag:** Mint background with Forest text.
- **Inactive/Draft:** Linen background with Muted text.
- **Key/Monospace Chips:** Mint-Shell background, Forest border, JetBrains Mono font.

### Lists
- Data rows should be separated by 1px Mint-Mid dividers. Use Mint-Shell for hover states on list items.