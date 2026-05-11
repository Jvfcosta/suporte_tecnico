---
name: Technical Support System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  margin-page: 32px
  gutter-grid: 24px
  padding-card: 20px
  gap-compact: 8px
  gap-normal: 16px
---

## Brand & Style
This design system is engineered for mission-critical reliability and high-density information management. The brand personality is authoritative, calm, and hyper-efficient, aimed at technical coordinators and facility managers who require immediate clarity across multiple infrastructure domains.

The design style is **Corporate / Modern**, prioritizing structural integrity and functional hierarchy over decorative elements. It utilizes a sophisticated "Utility-First" aesthetic: high-contrast data points are balanced against expansive, neutral backgrounds to reduce cognitive load during long-term monitoring. The interface evokes the feeling of a well-organized command center—precise, stable, and responsive.

## Colors
The palette is anchored by a deep navy primary (#0F172A) used for structural navigation and high-level headings, ensuring a grounded enterprise feel. The background is a clean, cool light gray (#F8FAFC) to provide maximum legibility for data-heavy components.

Status tags and domain identifiers use a vibrant, semantic logic:
- **TI (Information Technology):** Vibrant Blue, signifying connectivity.
- **Electrical:** Golden Yellow, signifying energy and caution.
- **Civil:** Emerald Green, signifying structural stability.
- **Security:** Deep Purple, signifying protection and oversight.
- **Telecom:** International Orange, signifying signal and transmission.

All accent colors must meet WCAG AA contrast ratios against their respective backgrounds for accessibility.

## Typography
This design system utilizes **Inter** for all UI elements to take advantage of its excellent legibility in high-density data environments. For specific technical identifiers (Asset IDs, Serial Numbers), **JetBrains Mono** is introduced to provide a clear distinction between narrative text and technical data.

Scale usage:
- **Headlines:** Use for page titles and section headers.
- **Body:** Standardized for ticket descriptions and user input.
- **Label-Caps:** Reserved for small metadata headers and table column titles.
- **Data-Mono:** Specifically for numeric values, logs, and technical IDs.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 260px, while the main content area utilizes a 12-column fluid grid. A strict 4px baseline grid ensures vertical rhythm across all components.

- **Desktop (1440px+):** 12 columns, 32px page margins, 24px gutters.
- **Tablet (1024px):** 8 columns, 24px page margins, 16px gutters.
- **Mobile (640px):** 4 columns, 16px page margins, 12px gutters.

Whitespace is used strategically to group related information; for instance, metric cards use a tight 8px gap between label and value to imply direct correlation, while separate dashboard sections are divided by 32px of negative space.

## Elevation & Depth
The system employs **Tonal Layers** rather than heavy shadows to maintain a clean, enterprise-grade feel. 

- **Surface Level 0:** Background (#F8FAFC).
- **Surface Level 1:** Cards and Sidebar (#FFFFFF). Uses a 1px border of #E2E8F0 for definition.
- **Surface Level 2:** Modals and Popovers. These use a refined ambient shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08)`.

Interactive elements like buttons or table rows use subtle background-color shifts on hover (typically a 5% darkening of the surface color) to indicate state without adding visual clutter.

## Shapes
A **Soft** (0.25rem) rounding strategy is applied to provide a modern feel while maintaining the rigid structure expected of a professional technical tool. 

- **Standard Components:** Buttons, Input fields, and Checkboxes use the base 0.25rem (4px) radius.
- **Large Containers:** Metric cards and main content areas use `rounded-lg` (8px) to soften the dashboard's overall appearance.
- **Status Badges:** Use a full pill-shape (999px) to clearly differentiate them from interactive buttons.

## Components
### Data Tables
Tables are the heart of the system. Rows should have a minimum height of 48px with a 1px border-bottom (#F1F5F9). Column headers must use `label-caps` in the primary navy color. Alternate row striping is not required; use hover states to highlight active rows.

### Status Badges
Badges use a "Tint-on-Tint" approach: a 10% opacity background of the accent color with the full-strength accent color for the text. This ensures the dashboard doesn't become visually overwhelming when many tags are present.

### Metric Cards
Cards contain a small icon (20px), a `label-caps` description, and a large bold value. They should include a "sparkline" or "trend indicator" (percentage change) in the bottom right corner.

### Sidebar Navigation
The sidebar uses the Primary Navy (#0F172A) as its background. Active items use a semi-transparent white highlight (10% opacity) and a 4px vertical accent bar on the left edge.

### Input Fields
Inputs use a white background with a 1px border (#CBD5E1). On focus, the border transitions to Primary Navy with a subtle 2px glow of the same color at 10% opacity.