---
name: Jakarta Routes
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9dae0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fa'
  surface-container: '#ededf4'
  surface-container-high: '#e7e8ef'
  surface-container-highest: '#e1e2e9'
  on-surface: '#191c20'
  on-surface-variant: '#424751'
  inverse-surface: '#2e3036'
  inverse-on-surface: '#f0f0f7'
  outline: '#727782'
  outline-variant: '#c2c6d3'
  surface-tint: '#1d5fa8'
  primary: '#003b72'
  on-primary: '#ffffff'
  primary-container: '#00529b'
  on-primary-container: '#a5c7ff'
  inverse-primary: '#a6c8ff'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#004150'
  on-tertiary: '#ffffff'
  tertiary-container: '#005a6d'
  on-tertiary-container: '#4bd5fa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#004787'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#b3ebff'
  tertiary-fixed-dim: '#4cd6fb'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#f9f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e9'
  jakarta-night: '#101820'
  monas-gold: '#FFD700'
  surface-gray: '#F8FAFC'
  border-subtle: '#E2E8F0'
typography:
  display-lg: { fontFamily: Montserrat, fontSize: 48px, fontWeight: '700', lineHeight: '1.2', letterSpacing: -0.02em }
  headline-lg: { fontFamily: Montserrat, fontSize: 32px, fontWeight: '600', lineHeight: '1.3' }
  headline-lg-mobile: { fontFamily: Montserrat, fontSize: 24px, fontWeight: '600', lineHeight: '1.3' }
  headline-md: { fontFamily: Montserrat, fontSize: 24px, fontWeight: '600', lineHeight: '1.4' }
  body-lg: { fontFamily: Inter, fontSize: 18px, fontWeight: '400', lineHeight: '1.6' }
  body-md: { fontFamily: Inter, fontSize: 16px, fontWeight: '400', lineHeight: '1.6' }
  label-lg: { fontFamily: Inter, fontSize: 14px, fontWeight: '600', lineHeight: '1.2', letterSpacing: 0.05em }
  label-sm: { fontFamily: Inter, fontSize: 12px, fontWeight: '500', lineHeight: '1.2' }
rounded: { sm: 0.25rem, DEFAULT: 0.5rem, md: 0.75rem, lg: 1rem, xl: 1.5rem, full: 9999px }
spacing: { base: 8px, container-max: 1280px, gutter: 24px, margin-mobile: 16px, margin-desktop: 40px }
---

## Brand & Style

The design system embodies the energy and forward-motion of Indonesia's capital. Corporate / Modern with a high-energy twist, clean white spaces letting the "Dynamic Jakarta" palette pop. Target: international tourists & local explorers. Structured layouts for reliability, soft geometry + energetic accents for warmth. Focus: "Route to Discovery".

## Colors

- **Primary (Jakarta Blue)**: navigation bars, headers, primary iconography.
- **Secondary (Vibrant Orange)**: EXCLUSIVELY for primary CTA ("Rekomendasikan") and active selection states.
- **Tertiary (sky blue)**: highlights & informative tags.
- **Neutral**: clean white (#FFFFFF) mandatory background for content areas.

## Typography

Dual-font: **Montserrat** (bold geometric headlines, tight letter-spacing), **Inter** (body & labels, line-height 1.6).

## Layout & Spacing

Fixed grid desktop (1280px max), fluid mobile. 12-col desktop / 4-col mobile. 8px base rhythm. Mobile: lists reflow to single column; "Selected Items" bar sticks to bottom of viewport as floating element.

## Elevation & Depth

- Level 0: white background.
- Level 1 (cards/forms): #F8FAFC + 1px border #E2E8F0, no shadow.
- Level 2 (hover/active): white/tint + diffused shadow (blur 20px, Y 8px, 6% black).
- Overlays: light backdrop blur (glassmorphism).

## Shapes

Rounded language: buttons/inputs 8px, destination cards 16px, selection indicators 4px.

## Components

- **Buttons**: primary = Secondary Orange bg + white bold text; secondary = outline Primary Blue. "Rekomendasikan" = high-emphasis + leading search icon.
- **Cards**: headline-md title, label-sm category tags, top-right selection checkbox glowing Blue when active.
- **Forms**: large accessible inputs, jakarta-night text, tertiary focus states.
- **Navigation**: clean minimal header; active page = 3px bottom bar Secondary Orange. Mobile: selected-destinations counter as floating badge near primary action.
- **Pagination**: "Load More" pattern or circular indicators (Primary Blue active).
