---
name: ui-figma-handoff
description: "Automates Figma design structuring and development handoff preparation. Use when preparing raw designs for development – converts flat frames into components with tokens, then adds annotations, sections, and dev status badges. Do NOT use for learning Figma workflow basics; see ui-figma-guide instead."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
compatibility: "Requires Figma MCP (plugin:figma:figma). Figma Console MCP recommended for advanced operations (variables, linting, batch ops)."
---

# Figma Design Structuring and Dev Handoff

Automate the transformation of raw Figma designs into properly structured design files with components, tokens, variables, and styles – then prepare them for developer handoff with annotations, sections, connectors, and dev status badges.

This skill uses **both Figma MCPs** when available:

- **"Figma Plugin"** (`plugin:figma:figma`) – reading designs (`get_design_context`, `get_screenshot`), JS execution (`use_figma`), design system rules
- **"Figma Console MCP"** (`figma-console`) – variables/tokens (`figma_batch_create_variables`, `figma_setup_design_tokens`), linting (`figma_lint_design`), parity checking (`figma_check_design_parity`), batch operations, dedicated node tools

"Figma Console MCP" is recommended for the full workflow but not strictly required – "Figma Plugin"'s `use_figma` JS executor can handle most write operations. See [figma-mcp-routing.md](../ui-figma-guide/references/figma-mcp-routing.md) for the decision guide.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand Context

```
question: "What do you need to prepare for handoff?"
header: "Handoff Type"
options:
  - label: "Structure raw designs"
    description: "Turn flat Figma frames into components with design tokens, variables, and auto-layouts"
  - label: "Prepare for dev handoff"
    description: "Add annotations, sections, connectors, and dev status badges to structured designs"
  - label: "Full preparation"
    description: "Both – structure first, then prepare for handoff"
  - label: "Existing structured file"
    description: "I already have components and tokens – just need handoff prep"
allowMultiSelect: false
```

Store the selection – it determines which steps are relevant below.

---

## Step 2: Verify Prerequisites

Before proceeding, confirm:

1. **At least one Figma MCP is available.** Test "Figma Plugin" with `get_metadata` or "Figma Console MCP" with `figma_execute`. If neither is available, stop and direct the user to set up a Figma MCP first (see `dev-mcp-setup`).

2. **Figma Desktop app is open** with the target file loaded (required for "Figma Console MCP"; "Figma Plugin" works with closed files too).

3. **Which page(s) contain the designs to process.** Ask the user:

```
question: "Which pages contain the designs you want to process?"
header: "Target Pages"
options:
  - label: "Current page only"
    description: "Process whatever is on the currently active page"
  - label: "Specific pages"
    description: "I will tell you which pages to include"
  - label: "All pages"
    description: "Process every page in the file"
allowMultiSelect: false
```

4. **If structuring designs**, confirm key decisions:

```
question: "How should the design system be structured?"
header: "Structuring Preferences"
options:
  - label: "Light mode only"
    description: "Single mode – no dark mode or multi-theme support"
  - label: "Light and dark modes"
    description: "Two modes with semantic tokens that switch between them"
  - label: "Multiple themes"
    description: "More than two themes (explain in chat)"
allowMultiSelect: false
```

---

## Step 3: Structure Designs

**Skip this step** if the user selected "Prepare for dev handoff" or "Existing structured file" in Step 1.

Follow the 7-phase methodology from [figma-structuring-guide.md](./references/figma-structuring-guide.md). Use helper functions from [figma-console-helpers.md](./references/figma-console-helpers.md).

### Phase 1: Audit

Scan all target screens and extract every unique design token:

- **Colors**: Every fill and stroke (hex + opacity), grouped into primitives and semantic roles
- **Typography**: Unique font family, weight, size, line height, letter spacing combinations
- **Spacing**: Unique padding and gap values from auto-layout frames
- **Border radius**: Unique corner radius values
- **Effects**: Shadows and blurs

Use the `extractTokens` helper via `figma_execute`. Present the extracted inventory to the user for confirmation before proceeding.

### Phase 2: Create Variables

Create two variable collections:

- **Primitives**: Raw values (colors, spacing scales, radius scales)
- **Semantic**: Purpose-based aliases pointing to Primitives (e.g., `bg/primary` → `blue/500`)

Use `figma_batch_create_variables` for solid hex colors and floats (10-50x faster). Use `figma_execute` for RGBA colors (batch tool cannot handle alpha channels).

### Phase 3: Create Styles

Create three style types:

- **Text styles**: Font properties only – no color
- **Effect styles**: Shadows and blurs
- **Paint styles**: Critical for mixed-style text where variables cannot be bound per-range

### Phase 4: Create Components

Build the component hierarchy: Atoms → Molecules → Organisms.

For each component: create with auto-layout, bind fills/strokes to semantic variables, bind radius/spacing to primitive variables, apply text/effect styles, add variants if needed.

### Phase 5: Build Design System Page

Create a dedicated "Design System" page and organize all components.

**CHECKPOINT**: Stop here and ask the user for approval before proceeding to rebuild screens. Present a screenshot of the DS page and a summary of what was created.

### Phase 6: Rebuild Screens

Clone original screens to a "Screens" page. Replace raw frames with component instances and bind all tokens. Fix layout breakages (auto-layout sizing, absolute positioning, collapsed dimensions).

### Phase 7: Quality Pass

Run the `fullAudit` helper on every rebuilt screen. The audit must return 0 issues before declaring done. Fix any remaining raw fills, unbound spacing, missing text styles, or raw corner radii.

---

## Step 4: Prepare Dev Handoff

**Skip this step** if the user selected "Structure raw designs" only in Step 1.

Follow the process from [figma-handoff-guide.md](./references/figma-handoff-guide.md).

### 4a: Organize into Sections

Create Figma Sections (not just frames) for each logical group:

| Section | Purpose |
|---------|---------|
| **Components** | All reusable components relevant to the feature |
| **Context / Reference** | Existing screens or legacy designs that provide context |
| **Feature Designs** | New/updated screens, organized by user flow |

Within each section, arrange frames in rows by feature or flow. Left-to-right in user encounter order. Consistent spacing: ~200px between frames in a row, ~1400px between rows.

### 4b: Add Canvas Headers

Add minimal text headers for navigation – the only text elements on the canvas:

- **Section headers**: Bold 24px, dark gray (#262626), with 16px subtitle
- **Row headers**: Bold 24px for multi-row sections, with subtitle for scope/context

### 4c: Set Native Annotations

Use the `annotations` property on frames. These appear in Dev Mode inspect panel.

Include: flow context, state transitions, implementation hints, edge cases, data flow, sequencing. Keep annotations concise – 2-4 sentences per frame.

Do NOT include: descriptions of visible elements, popover text, button labels, or generic statements.

### 4d: Set Component Descriptions

Use the native `description` property on Component Sets and Components:

- Variant breakdown
- Key props and what they control
- State logic (what drives variant switching)
- Placement context

### 4e: Mark Dev Status

Set `devStatus` on all handoff frames:

- `READY_FOR_DEV` – design is final and approved
- `COMPLETED` – implementation is done and verified

### 4f: Add Visual Connectors

Add vector-path connector lines between sections:

- **Stroke**: 4px blue (#2563EB) for primary flows, 3px for secondary
- **Path**: L-shaped routed paths (never diagonal)
- **Arrow**: Equilateral cap on destination end only
- **Labels**: Semi Bold 28px, matching connector color, positioned at turn points

### 4g: Apply Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Frames | `{Feature} - Step {N}` | `Upload - Step 0` |
| Sections | `{Category} Designs` | `Feature Designs` |
| Connectors | `Flow: {description}` | `Flow: Create task` |
| Labels | `Label: {description}` | `Label: Create task` |
| Row headers | Uppercase task name | `TASK 1: CREATE A TASK` |

---

## Step 5: Verify and Deliver

### Run the Handoff Checklist

Verify every item from the checklist in [figma-handoff-guide.md](./references/figma-handoff-guide.md):

- [ ] Page organized into labeled Sections
- [ ] Frames in logical rows, left-to-right
- [ ] Canvas headers added (section + row)
- [ ] Native annotations on every frame
- [ ] Component descriptions set
- [ ] All frames marked with devStatus
- [ ] Visual connector lines with labels
- [ ] Consistent naming on all elements
- [ ] No redundant text on canvas

### Present Summary

Show the user what was structured/prepared:

> **Handoff Summary**
>
> **Components created**: [count] (atoms, molecules, organisms)
> **Variables**: [count] primitives, [count] semantic
> **Styles**: [count] text, [count] effect, [count] paint
> **Screens rebuilt**: [count]
> **Frames annotated**: [count]
> **Sections**: [list]

---

## Decision Hierarchy

1. **User's direct input** – their design decisions take priority
2. **Existing documentation** – planning docs, design references, design system decisions
3. **AI suggestions** – fill gaps only, always presented as suggestions

---

## What Comes Next

After handoff preparation is complete, suggest the logical next step:

- **Use "Figma Plugin"** to export structured designs to Claude Code for development
- **Run `ui-design-to-code-qa`** to review the structured designs against the original intent
- **Run `ui-aesthetic-review`** for a craft critique of the final designs
- **Proceed to `/design-engineer:dev`** to begin the development pipeline

---

## Resource Files

- [figma-structuring-guide.md](./references/figma-structuring-guide.md) – 7-phase methodology for converting raw Figma designs to structured design files
- [figma-handoff-guide.md](./references/figma-handoff-guide.md) – Process for preparing Figma designs for developer handoff
- [figma-console-helpers.md](./references/figma-console-helpers.md) – Code snippets for Figma Console MCP operations

## Common Issues

### "Figma Console MCP" not connected
If `figma_execute` calls fail or return connection errors:
1. Verify "Figma Console MCP" is running – check your MCP server status
2. Confirm the Figma desktop app is open with the target file active
3. Check `.mcp.json` or `settings.json` for correct MCP server configuration
4. Try `figma_reconnect` to re-establish the connection

### Batch operations timeout
If batch variable or component operations time out:
1. Reduce batch size – split large batches (100+ items) into smaller groups
2. Check that the Figma file is not excessively large (1000+ layers can slow operations)
3. Verify your network connection is stable – MCP calls require consistent connectivity

### Only "Figma Plugin" available (no "Figma Console MCP")
If only "Figma Plugin" is connected:
1. Use `use_figma` (JS executor) for write operations – it supports the full Plugin API
2. Variables must be created via JS instead of `figma_batch_create_variables` – slower but works
3. Linting and parity checking are not available – use `ui-design-to-code-qa` as an alternative
4. Node manipulation works via JS but without input validation of dedicated tools
