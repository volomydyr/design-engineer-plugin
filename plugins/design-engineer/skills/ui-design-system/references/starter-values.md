# Starter Values

These are sensible defaults to start from – not prescriptions. Every value should be adjusted based on your product's intent, domain, and audience. The point is to have a system from day one, not to ship these exact numbers.

Use these when starting a new project. Replace them as the design evolves.

---

## Spacing Scale

A non-linear scale that makes choices easy. Pick from the scale – avoid one-off numbers.

**Values:** `0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

**Usage guide:**
- **4** – Micro spacing: icon-to-text gaps, tight element pairs
- **8** – Small spacing: between related items in a list, inside compact controls
- **12** – Component spacing: inside buttons, input padding, between label and input
- **16** – Standard spacing: card padding, section content padding
- **24** – Comfortable spacing: between related groups, card body padding in spacious layouts
- **32** – Section spacing: between distinct groups within a page section
- **48** – Major separation: between page sections
- **64–128** – Page-level spacing: top/bottom page margins, hero sections

**The grouping rule:** inside-group spacing must always be smaller than between-group spacing. If items within a card use 16px gaps, the space between cards must be larger than 16px.

Example (Web):
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
}
```

Example (iOS/SwiftUI):
```swift
enum Spacing {
    static let micro: CGFloat = 4
    static let small: CGFloat = 8
    static let compact: CGFloat = 12
    static let standard: CGFloat = 16
    static let comfortable: CGFloat = 24
    static let section: CGFloat = 32
    static let major: CGFloat = 48
    static let page: CGFloat = 64
}
```

---

## Typography Scale

Keep it tight: 6–8 sizes is enough. Use weight, color, and spacing to create variety before adding new sizes.

**Values (in pixels/points):** `12, 14, 16, 20, 24, 30, 40`

**Usage guide:**
- **12** – Captions, badges, metadata, timestamps
- **14** – Secondary body text, descriptions, helper text
- **16** – Primary body text (the default reading size)
- **20** – Subheadings, section titles, emphasized content
- **24** – Page section headings (h3 equivalent)
- **30** – Page titles, major headings (h2 equivalent)
- **40** – Hero headlines, primary page titles (h1 equivalent)

**Rules:**
- Default body line-height: ~1.5–1.7 for reading comfort
- Heading line-height: ~1.2–1.3 for tighter grouping
- Limit line length to ~45–80 characters for readability
- Use weight and color to differentiate before adding new sizes

### Building Hierarchy Beyond Size

Size is one axis. Combine these to create distinguishable levels:

- **Weight** – Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
- **Letter-spacing** – Tighter for large headings (-0.02em), wider for small labels (+0.04em)
- **Opacity/Color** – Primary text at full contrast, secondary at ~70%, tertiary at ~50%, muted at ~35%

A headline at 24px/700/tight tracking feels very different from body at 24px/400/normal tracking, even at the same size. If you squint and cannot tell heading from body, the hierarchy is too weak.

---

## Text Hierarchy

Build four levels and use all four consistently. If you are only using two, your hierarchy is too flat.

| Level | Purpose | Typical Contrast |
|-------|---------|-----------------|
| **Primary** | Default text, headings, important content | Highest – full foreground color |
| **Secondary** | Supporting text, descriptions, labels | Slightly muted – ~70% opacity or lighter foreground |
| **Tertiary** | Metadata, timestamps, less important info | Noticeably muted – ~50% opacity |
| **Muted** | Disabled text, placeholders, decorative text | Lowest – ~35% opacity |

**The principle:** Each level should be distinguishable at a glance. If you have to look carefully to tell secondary from tertiary, increase the gap between them.

Example (Web):
```css
:root {
  --text-primary: rgba(0, 0, 0, 0.92);
  --text-secondary: rgba(0, 0, 0, 0.68);
  --text-tertiary: rgba(0, 0, 0, 0.48);
  --text-muted: rgba(0, 0, 0, 0.32);
}
```

---

## Border Progression

Borders are not binary. Build a scale that matches intensity to the importance of the boundary.

| Level | Purpose | Typical Treatment |
|-------|---------|------------------|
| **Subtle** | Softer separation, barely there | Very low opacity (~0.05–0.08 alpha) |
| **Default** | Standard borders, card edges, dividers | Low opacity (~0.10–0.15 alpha) |
| **Strong** | Emphasis borders, hover states | Medium opacity (~0.20–0.25 alpha) |
| **Stronger** | Maximum emphasis, focus rings, active states | Higher opacity (~0.35–0.50 alpha) |

**The principle:** Borders should disappear when you are not looking for them, but be findable when you need to understand the structure. If borders are the first thing you notice, they are too strong.

Use rgba/hsla values that blend with the background rather than solid hex colors. Solid borders look harsh in comparison.

Example (Web):
```css
:root {
  --border-subtle: rgba(0, 0, 0, 0.05);
  --border-default: rgba(0, 0, 0, 0.12);
  --border-strong: rgba(0, 0, 0, 0.22);
  --border-stronger: rgba(0, 0, 0, 0.40);
}
```

---

## Surface Elevation

Surfaces stack. A dropdown sits above a card which sits above the page. Build a numbered system.

| Level | Purpose | Example |
|-------|---------|---------|
| **Level 0** | Base background – the app canvas | Page background |
| **Level 1** | Cards, panels – same visual plane as base | Content cards, sidebars |
| **Level 2** | Floating above – dropdowns, popovers | Menus, tooltips |
| **Level 3** | Stacked overlays – nested dropdowns | Sub-menus, nested popovers |
| **Level 4** | Highest elevation (rare) | Modals, critical alerts |

**Key decisions:**

- **Light mode:** Higher elevation = slightly lighter or uses shadow for lift
- **Dark mode:** Higher elevation = slightly lighter. Each jump should be only a few percentage points of lightness.
- **Sidebars:** Same background as canvas, not different. Different colors fragment the space. A subtle border provides enough separation.
- **Inputs:** Slightly darker/inset compared to their surrounding surface – signals "type here" without heavy borders.
- **Dropdowns:** Must be one level above their parent. If both share the same level, the dropdown blends in and layering is lost.

**The subtlety principle:** The difference between elevation levels should be barely perceptible in isolation but clearly structured when surfaces stack. Study Vercel, Linear, or Supabase – their surfaces are barely different but still distinguishable.

Example (Web – dark mode):
```css
:root {
  --surface-0: hsl(0, 0%, 8%);     /* Base */
  --surface-1: hsl(0, 0%, 11%);    /* Cards */
  --surface-2: hsl(0, 0%, 14%);    /* Dropdowns */
  --surface-3: hsl(0, 0%, 17%);    /* Nested overlays */
  --surface-4: hsl(0, 0%, 20%);    /* Modals */
}
```

---

## Depth Strategies

Choose ONE approach and commit. Do not mix strategies.

### Borders-Only (Flat)

Clean, technical, dense. Works for utility-focused tools where information density matters more than visual lift. Used by Linear, Raycast, and many developer tools.

Best when: the interface is dense, the audience values efficiency over aesthetics, the product is a professional tool.

Example (Web):
```css
.card {
  border: 0.5px solid var(--border-default);
}
```

### Subtle Single Shadows

Soft lift without complexity. A single gentle shadow layer. Works for approachable products that want gentle depth.

Best when: the product is consumer-facing, the interface has moderate density, you want warmth without weight.

Example (Web):
```css
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

### Layered Shadows

Rich, premium, dimensional. Multiple shadow layers create realistic depth. Used by Stripe and Mercury.

Best when: cards need to feel like physical objects, the product is premium/financial, the design has generous whitespace.

Example (Web):
```css
.card {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.03),
    0 4px 8px rgba(0, 0, 0, 0.02);
}
```

### Surface Color Shifts

Background tints establish hierarchy without any shadows. A card at `#fff` on a `#f8fafc` background already feels elevated.

Best when: you want the cleanest possible aesthetic, the interface is content-heavy, shadows would add visual noise.

---

## Shadow Scale

If using shadows, build 3–5 levels that map to meaning:

| Level | Purpose | Typical Values |
|-------|---------|---------------|
| **1** | Buttons, cards – subtle lift | Small offset, low blur, low opacity |
| **2** | Popovers, dropdown menus | Medium offset, medium blur |
| **3** | Sticky headers, floating elements | Larger offset, more blur |
| **4** | Modals, dialogs | Large offset, significant blur |
| **5** | High priority overlays (rare) | Maximum depth |

**Dark mode note:** Shadows are less visible on dark backgrounds. In dark mode, lean more on borders and surface color shifts for depth.

---

## Border Radius

Sharper corners feel technical. Rounder corners feel friendly. Build a scale that fits your product's personality.

**Suggested scale:**
- **Small (2–4px)** – Inputs, buttons, badges, chips
- **Medium (6–8px)** – Cards, containers, panels
- **Large (12–16px)** – Modals, large containers, hero sections
- **Full (9999px)** – Pills, circular avatars, round buttons

Do not mix sharp and soft randomly. Inconsistent radius is as jarring as inconsistent spacing.

---

## Color System Principles

These are principles, not a palette. Your palette should come from your domain exploration.

- Define neutrals (backgrounds + text), one primary accent, and semantic colors
- Define shades up front (e.g., 100–900 scale) – do not generate ad-hoc lightens/darkens
- Keep a consistent color temperature in your neutrals (warm gray or cool gray, not both)
- Gray builds structure. Color communicates – status, action, emphasis, identity
- One accent color used with intention beats five colors used without thought

**Contrast requirements:**
- Normal text: target 4.5:1 contrast ratio minimum
- Large text (18px+ or 14px+ bold): target 3:1 minimum
- Interactive elements and focus indicators: target 3:1 minimum

**Semantic colors:**
- **Destructive** – Dangerous actions, errors, critical alerts
- **Warning** – Caution states, approaching limits
- **Success** – Confirmations, completed actions
- **Info** – Neutral informational states

In dark mode, semantic colors often need slight desaturation to avoid looking overly vibrant.

---

## Dark Mode Considerations

Dark interfaces have different needs. The same system applies, but with adjustments:

- **Borders over shadows** – Shadows are less visible on dark backgrounds. Lean on borders for definition.
- **Surface elevation = lighter** – Higher surfaces are lighter, not darker. Subtle increments.
- **Desaturate semantic colors** – Success green, warning yellow, and error red may need to be toned down.
- **Reduce contrast slightly** – Pure white text on pure black backgrounds causes halation (glow effect). Use off-white on off-black.
- **Same structure, different values** – The hierarchy system still applies, just with inverted values.
