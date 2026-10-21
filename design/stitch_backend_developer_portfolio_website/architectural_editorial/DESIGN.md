---
name: Architectural Editorial
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#674bb4'
  on-secondary: '#ffffff'
  secondary-container: '#ab8ffd'
  on-secondary-container: '#3f1e8b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1a29'
  on-tertiary-container: '#858195'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319b'
  tertiary-fixed: '#e5e0f6'
  tertiary-fixed-dim: '#c8c4d9'
  on-tertiary-fixed: '#1b1a29'
  on-tertiary-fixed-variant: '#474556'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 4.5rem
    fontWeight: '400'
    lineHeight: '1.05'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 2.75rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  display-md:
    fontFamily: Playfair Display
    fontSize: 3.25rem
    fontWeight: '400'
    lineHeight: '1.15'
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: '1.3'
  headline-emphasis:
    fontFamily: Playfair Display
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Geist
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
  code-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 3.5rem
  space-xxl: 6rem
---

## Brand & Style

This design system expresses the discipline, structural precision, and understated craft of a high-end backend engineer. It marries the typographic poise of classical publishing with the strict, grid-bound clarity of architectural blueprints. 

The emotional tone is calm, authoritative, and deliberate. It avoids decorative tech tropes (glows, heavy drop shadows, neon accents) in favor of crisp 1px structural hairlines, generous asymmetrical negative space, and typographic counterpoints between an expressive editorial serif and a technical, neutral sans-serif.

Design principles:
- **Structural Integrity:** Layouts behave like physical masonry and architectural frames—every element aligns to structural axes, defined by thin lines and intentional whitespace.
- **Literary Backend:** Code and infrastructure are treated with literary prestige; complex backend architectures are presented with editorial gravitas rather than corporate dashboards.
- **Restraint and Focus:** Color serves solely as a signal and accent; dark contrasts are purposeful punctuation points within an expansive, luminous light landscape.

## Colors

The system relies on a high-contrast editorial baseline, warmed through delicate off-white grounds and accented with a disciplined violet spectrum.

- **Canvas & Backgrounds:** Base ground is `#FAFAFA` (warm off-white), punctuated by horizontal structural bands of `#F4F4F6` (light technical grey) to demarcate sections without heavy ornamentation.
- **Surfaces & Containers:** Elevated cards sit on crisp `#FFFFFF`, while deep architecture callouts and terminal/code artifacts employ inverted dark cards in `#161618`.
- **Text & Hierarchy:** Primary reading level is anchored in `#111111` (near-black ink). Secondary attributes, metadata, and body support utilize `#6B6B6B` (refined neutral grey).
- **Accents:** `#5B3FA8` (deep royal violet) operates as the primary focal tone for active navigational anchors, selective emphasis in italic serifs, and focal state markers. `#E9E4FA` (pale lavender) serves as a soft, low-contrast background wash for code badges, tags, and interactive hover planes.
- **Structural Lines:** All borders, grid rules, and internal splitters use a razor-sharp 1px line in `#E5E5E7`.

## Typography

The typographic tension pairs the timeless craftsmanship of `Playfair Display` with the utilitarian precision of `Geist`.

- **Editorial Headings:** Set in `Playfair Display`. Titles use regular or medium weights to preserve delicate hairline serifs. Emphasis words and core backend concepts (e.g., *distributed systems*, *latency-critical*, *fault tolerance*) are styled in italic variations tinted with `#5B3FA8`.
- **System Sans & Readability:** Body copy, technical descriptions, and parameters are set in `Geist` with wide, relaxed line heights to promote effortless long-form reading across architectural case studies.
- **Structural Labels:** Metadata, dates, category tags, system metrics, and navigation elements utilize `label-caps`—strictly uppercase, tracking spaced at `0.15em`, conveying an engineering drawing or catalogue classification aesthetic.

## Layout & Spacing

The layout is built upon an architectural grid with visible and implied axial divisions.

- **Grid System:** A 12-column layout on desktop screens with a max-width of `1360px`, framed by wide outer margins (`4rem`). On mobile devices, the system transitions to a single or 4-column flow with `1.25rem` screen edges.
- **Section Banding:** Sections alternate between baseline `#FAFAFA` and full-bleed horizontal bands of `#F4F4F6`, separated strictly by `1px` `#E5E5E7` border rules. Vertical spacing between content clusters relies on deliberate, monumental gaps (`space-xl` and `space-xxl`) to give large serif headlines room to breathe.
- **Component Geometry:** Card grids utilize uniform gutters without offset margins; content within cards adheres strictly to standard padding increments (`space-md` through `space-lg`).

## Elevation & Depth

This design system uses a strictly flat, architectural approach to depth. Elevation is communicated through edge framing and tonal planar shifts rather than cast shadows.

- **Hairline Framing:** Depth and containment are defined exclusively by `1px` continuous borders in `#E5E5E7`. Elements stack like structural blueprints and architectural drawings.
- **Planar Shifts:** Instead of elevation levels 1–5, the hierarchy moves across planar levels:
  - Ground: `#FAFAFA`
  - Recessed Banding: `#F4F4F6`
  - Floating Plate: `#FFFFFF` framed by `#E5E5E7`
  - Monolithic Accent: `#161618` high-contrast dark card
- **Shadows:** No ambient or blurred drop shadows exist in the primary system. Hover states trigger subtle structural changes—such as line color shifting to `#111111` or `#5B3FA8`, or a crisp `1px` translation offset—reinforcing tactile physical construction rather than atmospheric blur.

## Shapes

The design system enforces a sharp geometric aesthetic (`roundedness: 0`). 

- Every corner on buttons, input elements, cards, badges, and modals is strictly `0px` (sharp 90-degree right angles).
- This zero-radius mandate evokes drafting boards, physical print media, technical schematics, and monoliths.
- Circular shapes are prohibited, with the singular exception of functional live status indicators (e.g., a 6px green ping dot indicating API availability).

## Components

### Buttons
- **Primary Action:** Solid `#111111` rectangle, 0px border-radius, `#FFFFFF` uppercase label with `0.15em` tracking. Suffix with an inline directional arrow (`→`) separated by `0.75rem`. On hover, the arrow translates 3px right while background transitions to `#161618`.
- **Secondary Action:** Transparent background with a `1px` solid `#111111` border, `#111111` uppercase tracked text. On hover, background fills with `#111111` and text shifts to `#FFFFFF`.
- **Ghost/Tertiary:** No border; `#111111` or `#5B3FA8` text with an underlined rule set 2px below the baseline that expands on hover.

### Navigation Bar
- **Structure:** Clean fixed or sticky top bar, 64px height, background `#FAFAFA` with a bottom `1px` line in `#E5E5E7`.
- **Monogram:** Minimalist 'SR' mark set in bold uppercase serif or clean geometric strokes, sized to 20px height, anchored to the far left.
- **Links:** Tracked uppercase links (`0.15em`, `0.75rem`, `Geist SemiBold`) in `#6B6B6B`. Hover state shifts to `#111111`.
- **Active Indicator:** Active route features a crisp `2px` solid `#5B3FA8` horizontal underline directly flush with the bottom border of the navbar.

### Cards
- **Light Project Card:** Crisp `#FFFFFF` surface, `1px` border `#E5E5E7`, sharp corners. Padding is `space-lg`. Internal layout includes a categorized `label-caps` top bar, followed by a `headline-md` serif title with italic keywords, body description, and a mono tech stack footer.
- **Architectural Dark Card:** `#161618` surface with subtle `1px` border `#2A2A2D`. Text inverts to `#FAFAFA` with secondary text in `#A0A0A3`. Used for database benchmarks, terminal outputs, and backend topology diagrams.

### Chips & Badges
- **Technical Tag:** Sharp rectangular containers, padding `4px 8px`.
- **Default State:** Background `#F4F4F6`, border `1px` `#E5E5E7`, text `#6B6B6B` in uppercase monospace or `label-caps`.
- **Accent State:** Pale lavender ground `#E9E4FA`, border `1px` `#5B3FA8` (at 30% opacity), text `#5B3FA8`.

### Lists & Case Studies
- **Editorial List Item:** Divided by horizontal `1px` `#E5E5E7` lines spanning the container width. Padding `1.5rem 0`.
- **Layout:** Three-column layout on desktop: Date/Version (`label-caps`, `#6B6B6B`), Project Title & Architecture Role (`Playfair Display`, `#111111`), Metric/Performance Outcome (`Geist`, `#5B3FA8`).

### Input Fields & Controls
- **Text Inputs:** Sharp-edged rectangular fields, `#FFFFFF` ground, `1px` border `#E5E5E7`. Placeholder in `#6B6B6B`. Focus state transitions border to `1px` solid `#5B3FA8` with zero glow.
- **Checkboxes & Radios:** Uncompromising square boxes (`16px x 16px`), `1px` border `#111111`. Checked state fills solid `#111111` or `#5B3FA8` with a sharp geometric mark.

### Footer
- **Layout:** Multi-column architectural footer grounded on `#FAFAFA` with a heavy top border (`1px` `#111111` or `#E5E5E7`).
- **Columns:** 
  1. Monogram 'SR' with a concise statement on backend reliability and architectural philosophy.
  2. Index/Quick Links with tracked labels.
  3. Contact details (PGP Key fingerprint, direct email, location/timezone).
  4. Subtle uppercase social links (GitHub, LinkedIn, ReadCV) that shift to `#5B3FA8` on hover.