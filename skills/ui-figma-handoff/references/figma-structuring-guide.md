# Figma Design Structuring Guide

Transform raw Figma design files (flat frames, no components/styles/tokens) into fully structured design files with design systems, tokens, variables, styles, components, and pixel-identical rebuilt screens.

This guide requires the **Figma Console MCP** for all operations.

---

## Methodology Overview

### The Process (7 Phases)

```
Phase 1: AUDIT         → Scan all screens, extract every unique color/font/spacing/radius/effect
Phase 2: VARIABLES     → Create Primitives + Semantic variable collections
Phase 3: STYLES        → Create text styles, effect styles, paint styles
Phase 4: COMPONENTS    → Build atomic design system (atoms → molecules → organisms)
Phase 5: DS PAGE       → Organize components on a dedicated Design System page → CHECKPOINT
Phase 6: REBUILD       → Clone originals, swap raw frames to instances, bind all tokens
Phase 7: QUALITY PASS  → Screen-by-screen deep comparison, fix every difference
```

### Tool Strategy

| Tool | Use For | Notes |
|---|---|---|
| `figma_execute` | ALL creation, modification, and property reading | Primary tool. Uses CDP (no API quota). Always reliable. |
| `figma_batch_create_variables` | Bulk variable creation (solid hex colors + floats) | 10-50x faster than individual calls. Cannot handle RGBA. |
| `figma_batch_update_variables` | Bulk variable value updates | Same performance advantage as batch create. |
| `figma_capture_screenshot` | Visual spot-checks only | NOT for verification – use `figma_execute` to read properties. |

### Key Decisions (Ask User Before Starting)

Before Phase 1, confirm via AskUserQuestion:

1. **Modes**: Light mode only or multi-mode (light/dark)?
2. **Structure**: Primitives + Semantic collections? (recommended default)
3. **Icons**: Flatten vectors? Normalize size? Color strategy?
4. **Images**: Reuse by reference or re-export?
5. **Fonts**: Are all required fonts installed on the host machine?

---

## Phase 1: Audit and Token Extraction

### What to Extract

Scan ALL screens systematically and catalog:

1. **Colors**: Every unique fill/stroke (hex + opacity). Group into Primitives and Semantic roles.
2. **Spacing**: Unique padding and itemSpacing values from auto-layout frames.
3. **Border Radius**: Unique cornerRadius values.
4. **Typography**: Unique combinations of fontFamily, fontWeight, fontSize, lineHeight, letterSpacing.
5. **Effects**: Shadows and blurs.
6. **Icons**: Unique vectors (note size, color, context).

### How to Extract

Use `figma_execute` with the `extractTokens` helper from [figma-console-helpers.md](./figma-console-helpers.md).

**Critical**: Ignore hidden nodes (`visible === false`). Do not extract tokens from hidden layers – they are often junk or forgotten layers.

### Present Results

After extraction, present the token inventory to the user:

> **Audit Results**
> - Colors: [count] unique values → [proposed primitive groups]
> - Typography: [count] unique combinations → [proposed style names]
> - Spacing: [list of values] → [proposed scale]
> - Radius: [list of values] → [proposed scale]
> - Effects: [count] → [proposed names]
> - Icons: [count] unique vectors

Get user confirmation before proceeding to Phase 2.

---

## Phase 2: Create Variables (Design Tokens)

### Collection Structure

- **Primitives Collection**: Raw values – colors by hue/shade, spacing scales, radius scales.
- **Semantic Collection**: Purpose-based aliases pointing to Primitives – `bg/primary` → `blue/500`.

### Creation Strategy

1. **Solid Hex/Floats**: Use `figma_batch_create_variables` for maximum speed.
2. **RGBA/Alpha**: Use `figma_execute` with `createVariable()` + `setValueForMode()` (batch tool fails on RGBA).
3. **Aliases**: Use `setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: primitiveVar.id })`.

### Naming Convention Standards

| Category | Pattern | Examples |
|----------|---------|----------|
| Colors | `hue/shade` | `blue/500`, `gray/200`, `neutral/white` |
| Alpha | `color/usage-alpha` | `overlay/dark`, `overlay/light` |
| Spacing | `space/N` | `space/4`, `space/8`, `space/16` |
| Radius | `radius/size` | `radius/sm`, `radius/md`, `radius/lg`, `radius/full` |
| Semantic | `role/variant` | `bg/primary`, `text/secondary`, `border/default`, `interactive/primary` |

---

## Phase 3: Create Styles (Text, Effect, Paint)

### Three Style Types

1. **Text Styles**: Font family, size, weight, line height, letter spacing. Do NOT include color – colors are handled by paint styles and variables.
2. **Effect Styles**: Shadows and blurs.
3. **Paint Styles**: Critical for mixed-style text.

### The Paint Style Requirement

Text styles do not carry fill colors. Variables cannot be bound to per-range text fills (`setRangeBoundVariable` limitation).

**Solution**: Create paint styles for every semantic color used in text (e.g., `text/primary`, `text/accent`). Bind the paint style's internal paint to the semantic variable. Apply per-range via `setRangeFillStyleIdAsync()`.

See the `applyMixedTextStyles` helper in [figma-console-helpers.md](./figma-console-helpers.md) for the implementation pattern.

---

## Phase 4: Create Components

### Hierarchy

- **Atoms**: Button, input, icon, divider, badge, avatar.
- **Molecules**: Search bar, list item, card, form field.
- **Organisms**: Header, bottom sheet, navigation bar, complex sections.

### Component Creation Checklist

For EACH component:

1. `figma.createComponent()` – create the base
2. Set auto-layout (padding, spacing, alignment)
3. Bind fills/strokes to semantic variables
4. Bind radius/spacing to primitive variables
5. Apply text and effect styles
6. Add variants with `COMPONENT_SET` if needed
7. Add component properties (text, icon swap, boolean)
8. Verify visually via screenshot

### Critical Component Rules

- **Mixed-Style Text**: NEVER add text properties to components with mixed-style text (bold keywords, colored ranges). It destroys per-character formatting. Leave the text node as a regular child.
- **Icon Swaps**: Expose on the Component/Set level. Nested icon properties do not propagate automatically – set directly on the nested instance.
- **Variant Naming**: Name children `property=value` (e.g., `state=hover`, `size=large`).

---

## Phase 5: Build Design System Page

1. Create a "Design System" page.
2. Organize into sections: Atoms, Molecules, Organisms, Icons.
3. Add section labels for navigation.

### CHECKPOINT

**Stop here.** Present a screenshot and summary to the user. Ask for explicit approval before rebuilding screens. This is the point of no return – rebuilding screens is the most time-consuming phase.

---

## Phase 6: Rebuild Screens with Components

### Strategy

1. **Clone** original screens to a "Screens" page.
2. **Filter Hidden Elements**: Do NOT reproduce elements where `visible === false`. If hidden in the original, exclude from the rebuild.
3. **Bulk-Apply** variable bindings (fills, strokes) and text styles via automated sweep.
4. **Swap** raw frames to component instances.
5. **Fix** visual breakages.

### Common Breakages and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Stretched/collapsed layout | Auto-layout sizing wrong | Set `layoutSizingHorizontal`/`Vertical` correctly |
| Floating elements stacked | Overlay in auto-layout | Set `layoutPositioning = 'ABSOLUTE'` with explicit x,y |
| Height collapses to 0 | Vertical sizing | Set `layoutSizingVertical = 'HUG'` |
| Icon color wrong | Stroke not bound | Use `bindStrokesDeep` helper |

---

## Phase 7: Deep Quality Pass

### Non-Negotiable Rules

1. **One screen at a time.** Do not multitask screens.
2. **API verification.** Use `figma_execute` to read properties. Screenshots are for spot-checks only.
3. **Zero raw values.** Every fill, stroke, radius, and spacing must be bound to a variable or style.
4. **Componentization rule.** If an element appears 2+ times across screens, it MUST be a component.
5. **Audit function.** Do not declare "done" until the `fullAudit` helper returns 0 issues.

### Audit Process

For each rebuilt screen:

1. Run `fullAudit` via `figma_execute`
2. Review all reported issues
3. Fix each issue (bind variables, apply styles, swap to components)
4. Re-run audit
5. Repeat until 0 issues remain

See the `fullAudit` helper in [figma-console-helpers.md](./figma-console-helpers.md).

---

## Critical Rules

These are hard-won lessons from real structuring sessions:

- **Ignore Hidden Elements**: Hidden elements (`visible === false`) are often junk or forgotten layers. Do not include them in rebuilt screens.
- **Async Methods**: Always use `Async` suffixed methods (e.g., `getVariableByIdAsync`, `setRangeFillStyleIdAsync`).
- **Mixed Nodes**: Guard against `figma.mixed` on any property read (fontName, fills, cornerRadius, etc.).
- **Raw Color First**: Set the raw color value BEFORE calling `setBoundVariableForPaint`. Otherwise the visual does not update.
- **Fill/Hug Order**: Set `layoutSizingHorizontal = 'FILL'` AFTER `appendChild`, not before.
- **Font Loading**: Load fonts via `figma.loadFontAsync()` before modifying text content or styles.
- **Variable IDs**: Always re-query the actual collection before using variable IDs. In long sessions, IDs from conversation history may become stale after context compaction.

---

## Bottleneck Solutions

Common problems encountered during structuring and their proven solutions.

### B1: setBoundVariableForPaint Does Not Update Visual

**Symptom**: Variable bound but visual shows old color.

**Solution**: Set raw color first, then bind:

```javascript
fills[0] = { ...fills[0], color: { r: 1, g: 0, b: 0 }, opacity: 1 };
fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', variable);
node.fills = fills;
```

### B2: Mixed-Style Text Cannot Use Variables for Per-Range Fills

**Symptom**: `setRangeBoundVariable()` only accepts font fields. No `fills` field available.

**Solution**: Create paint styles with fills bound to semantic variables, then apply per-range via `setRangeFillStyleIdAsync()`. See the helper in [figma-console-helpers.md](./figma-console-helpers.md).

### B3: Component Text Properties Destroy Mixed-Style Formatting

**Symptom**: Adding a text component property causes all per-character font/color to collapse into uniform text.

**Solution**: Do not add text properties to components needing mixed styles. Leave the text node as a regular child. Set per-instance formatting via `setRangeFontName()` + `setRangeFills()`.

### B4: Nested Icon Properties Do Not Propagate

**Symptom**: Setting an icon property on a parent component does not change the icon in a nested instance.

**Solution**: Access the nested instance directly and set its own icon property.

### B5: Padding Bound to Wrong Variable Overrides Raw Value

**Symptom**: `node.paddingTop = 16` works in execution but reverts because a bound variable takes precedence.

**Solution**: Always bind the CORRECT variable instead of setting raw values. Use `figma_execute` to look up the right variable ID from the collection first.

### B6: Context Compaction Corrupts Variable ID Mappings

**Symptom**: After long sessions, variable ID mappings become wrong.

**Solution**: Always re-query the actual collection before using IDs:

```javascript
const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);
for (const varId of collection.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  // Use v.name and v.id – these are the truth
}
```

### B7: Batch Tool Cannot Handle RGBA

**Symptom**: `figma_batch_create_variables` rejects colors with alpha channels.

**Solution**: Use batch tool for solid hex colors and floats only. Use `figma_execute` with `createVariable()` + `setValueForMode()` for RGBA colors.

### B8: COMPONENT_SET Bounds Do Not Auto-Resize

**Symptom**: After adding a new variant child, it is visually clipped.

**Solution**: Manually resize the set bounds after adding children. Calculate the bounding box of all children and add padding.

### B9: Normalizing Icon Components Breaks All Instances

**Symptom**: Changing icon component defaults cascades to all instances, breaking per-context overrides.

**Solution**: Before normalizing: catalog all instances and their current overrides. After normalizing: restore every override.

### B10: Absolute-Positioned Elements in Auto-Layout

**Symptom**: Overlay elements get stacked by auto-layout instead of floating freely.

**Solution**: Set `layoutPositioning = 'ABSOLUTE'` with explicit x, y coordinates.

### B11: Missing Colors in the Design System

**Symptom**: Original design uses a color not in the extracted palette.

**Solution**: Add it as a new primitive + semantic token immediately. Do not skip – zero raw values is non-negotiable.
