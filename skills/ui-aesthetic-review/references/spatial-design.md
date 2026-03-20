# Spatial Design

## Spacing Systems

### Use 4pt Base, Not 8pt

8pt systems are too coarse–you'll frequently need 12px (between 8 and 16). Use 4pt for granularity: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Name Tokens Semantically

Name by relationship (`--space-sm`, `--space-lg`), not value (`--spacing-8`). Use `gap` instead of margins for sibling spacing–it eliminates margin collapse and cleanup hacks.

## Grid Systems

### The Self-Adjusting Grid

Use `repeat(auto-fit, minmax(280px, 1fr))` for responsive grids without breakpoints. Columns are at least 280px, as many as fit per row, leftovers stretch. For complex layouts, use named grid areas (`grid-template-areas`) and redefine them at breakpoints.

## Visual Hierarchy

### The Squint Test

Blur your eyes (or screenshot and blur). Can you still identify:
- The most important element?
- The second most important?
- Clear groupings?

If everything looks the same weight blurred, you have a hierarchy problem.

### Hierarchy Through Multiple Dimensions

Don't rely on size alone. Combine:

| Tool | Strong Hierarchy | Weak Hierarchy |
|------|------------------|----------------|
| **Size** | 3:1 ratio or more | <2:1 ratio |
| **Weight** | Bold vs Regular | Medium vs Regular |
| **Color** | High contrast | Similar tones |
| **Position** | Top/left (primary) | Bottom/right |
| **Space** | Surrounded by white space | Crowded |

**The best hierarchy uses 2-3 dimensions at once**: A heading that's larger, bolder, AND has more space above it.

### Cards Are Not Required

Cards are overused. Spacing and alignment create visual grouping naturally. Use cards only when content is truly distinct and actionable, items need visual comparison in a grid, or content needs clear interaction boundaries. **Never nest cards inside cards**–use spacing, typography, and subtle dividers for hierarchy within a card.

## Container Queries

Viewport queries are for page layouts. **Container queries are for components**:

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: var(--space-md);
}

/* Card layout changes based on its container, not viewport */
@container (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}
```

**Why this matters**: A card in a narrow sidebar stays compact, while the same card in a main content area expands–automatically, without viewport hacks.

## Concentric Border Radius

When nesting rounded elements, the outer radius must equal the inner radius plus the padding between them:

```
outerRadius = innerRadius + padding
```

Mismatched radii on nested elements is one of the most common things that makes interfaces feel off.

```css
/* Good – concentric radii */
.card { border-radius: 20px; padding: 8px; }   /* 12 + 8 = 20 */
.card-inner { border-radius: 12px; }

/* Bad – same radius on both, corners don't align */
.card { border-radius: 12px; padding: 8px; }
.card-inner { border-radius: 12px; }
```

**Exception**: If padding is larger than 24px, treat the layers as separate surfaces and choose each radius independently – strict concentric math at large padding distances isn't noticeable.

## Optical Adjustments

Geometric centering often looks wrong. Align optically when geometry conflicts with perception.

**Text alignment**: Text at `margin-left: 0` looks indented due to letterform whitespace – use a small negative margin (`-0.05em`) to optically align.

**Buttons with icons**: Use slightly less padding on the icon side. A reliable rule: `icon-side padding = text-side padding - 2px`.

```css
/* Good – optical balance */
.button-with-icon {
  padding-left: 16px;
  padding-right: 14px;  /* icon side = text side - 2px */
}
```

**Play triangles**: Play icons are triangular – their geometric center is not their visual center. Shift slightly right with `margin-left: 2px`.

**Asymmetric icons** (stars, arrows, carets): Fix in the SVG directly by adjusting the viewBox or path so no layout adjustment is needed in component code.

## Shadows as Borders

For cards, buttons, and containers, prefer a layered `box-shadow` over a solid border. Shadows use transparency and adapt to any background color; solid borders don't.

**Do not apply to dividers** (`border-b`, `border-t`, separators) – those stay as borders. Only apply to elements where the border creates depth or elevation.

```css
:root {
  /* Light mode – three layers: ring, subtle lift, ambient depth */
  --shadow-border:
    0px 0px 0px 1px rgba(0, 0, 0, 0.06),
    0px 1px 2px -1px rgba(0, 0, 0, 0.06),
    0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  --shadow-border-hover:
    0px 0px 0px 1px rgba(0, 0, 0, 0.08),
    0px 1px 2px -1px rgba(0, 0, 0, 0.08),
    0px 2px 4px 0px rgba(0, 0, 0, 0.06);
}

/* Dark mode – single white ring; depth shadows aren't visible on dark */
[data-theme="dark"] {
  --shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.08);
  --shadow-border-hover: 0 0 0 1px rgba(255, 255, 255, 0.13);
}
```

```css
.card {
  box-shadow: var(--shadow-border);
  transition-property: box-shadow;
  transition-duration: 150ms;
}
.card:hover {
  box-shadow: var(--shadow-border-hover);
}
```

## Image Outlines

Add a subtle 1px outline with low opacity to images. This creates consistent depth and integrates images with bordered or shadowed elements around them.

```css
/* Light mode */
img {
  outline: 1px solid rgba(0, 0, 0, 0.1);
  outline-offset: -1px;  /* inset – doesn't affect layout */
}

/* Dark mode */
img {
  outline: 1px solid rgba(255, 255, 255, 0.1);
  outline-offset: -1px;
}
```

Use `outline` rather than `border` – it doesn't affect layout and `outline-offset: -1px` keeps the image at its intended dimensions.

## Depth & Elevation

Create semantic z-index scales (dropdown → sticky → modal-backdrop → modal → toast → tooltip) instead of arbitrary numbers. For shadows, create a consistent elevation scale (sm → md → lg → xl). **Key insight**: Shadows should be subtle–if you can clearly see it, it's probably too strong.

---

**Avoid**: Arbitrary spacing values outside your scale. Making all spacing equal (variety creates hierarchy). Creating hierarchy through size alone–combine size, weight, color, and space. Same border radius on parent and child (use concentric math).
