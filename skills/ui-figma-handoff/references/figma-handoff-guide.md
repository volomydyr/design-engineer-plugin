# Figma Dev Handoff Guide

A consistent process for preparing Figma design pages for developer handoff. Optimized for clarity in both human review and AI-assisted development workflows.

---

## Core Principles

1. **Native tools over canvas clutter** – Use Figma's built-in Dev Mode features instead of adding text frames, sticky notes, or comment-style elements on the canvas.
2. **Don't repeat what's visible** – Annotations should explain logic, flow, and implementation context – not describe what a developer can already see by looking at the frame.
3. **Minimal canvas additions** – Only add elements that aid navigation or show relationships between screens. Every added element should earn its place.
4. **Consistent structure** – Follow the same layout, naming, and annotation patterns across all handoff pages so developers always know where to find information.

---

## Page Structure

Organize the handoff page into clearly labeled **Figma Sections**:

| Section | Purpose |
|---------|---------|
| **Components** | All reusable components relevant to the feature |
| **Context / Reference** | Existing screens or legacy designs that provide context for what's changing |
| **Feature Designs** | The new/updated screens, organized by user flow or feature area |

### Layout Rules

- Use Figma **Sections** (not just frames) to group related content – they appear in the page sidebar and are easier to navigate.
- Within each section, organize frames in **rows by feature or user flow**. One row = one logical flow or task.
- Keep consistent spacing: ~200px gap between frames in a row, ~1400px between rows.
- Place frames left-to-right in the order the user would encounter them.

---

## Section Headers (Canvas)

Add minimal text headers on the canvas for navigation. These are the **only** text elements that should live directly on the canvas.

### Section-Level Headers

- **Font**: Bold, 24px
- **Color**: Dark gray (#262626)
- **Content**: Short section label (e.g., "FEATURE DESIGNS")
- **Subtitle**: Regular, 16px, medium gray (#737373). One line summarizing the section's purpose.
- **Position**: Above the first row of frames in each section.

### Row Headers (for multi-row sections)

- **Font**: Bold, 24px
- **Color**: Dark gray (#262626)
- **Content**: Row identifier and brief context (e.g., "TASK 1: CREATE NEW ITEM")
- **Subtitle**: Regular, 16px, medium gray. Step count, progress info, or scope note.
- **Position**: Above each row of frames, left-aligned with the first frame.

---

## Native Figma Annotations

Use the `annotations` property on frames. These appear in the Dev Mode inspect panel when a developer selects a frame.

### What to Include

Focus on information that is NOT visible from looking at the design:

- **Flow context**: What action or screen leads here? What triggers this state?
- **State transitions**: What happens when the user completes this step? What updates server-side?
- **Implementation hints**: Z-index considerations, focus management, DOM timing, event handling.
- **Edge cases**: Empty states, viewport constraints, interrupted flows, error recovery.
- **Data flow**: Where does content come from? What API calls are involved? What gets persisted?
- **Sequencing**: If interactions must happen in a specific order, explain the enforcement mechanism.

### What NOT to Include

- Descriptions of visual elements already visible on the frame.
- Popover text, button labels, or copy that's readable in the design.
- Generic statements like "this is a modal" or "user sees a list."

### Style

- Write in direct, technical language aimed at developers.
- Use hyphens (-) not em dashes.
- Keep annotations concise – aim for 2-4 sentences per frame.
- Start with the most important context (entry point or trigger).

---

## Component Descriptions

Use the native `description` property on **Component Sets** and **Components**. This shows up in the component panel and in Dev Mode.

Include:

- Variant breakdown (what each variant represents)
- Key props and what they control
- State logic (what drives variant switching at runtime)
- Placement context (where this component appears in the UI)

Do NOT add separate annotations on components if descriptions are already set – avoid duplication.

---

## Dev Status Badges

Mark all handoff frames with the appropriate `devStatus`:

| Status | When to Use |
|--------|-------------|
| `READY_FOR_DEV` | Design is final and approved for implementation |
| `COMPLETED` | Implementation is done and verified |

This shows colored badges in Dev Mode, making it easy to scan which frames need work.

---

## Visual Connector Lines (Canvas)

Add vector-path connector lines on the canvas to show navigation flow between sections or screen groups that are far apart. These complement annotations by being visible at all zoom levels.

### When to Use

- Connecting screens across different Figma sections.
- Showing the entry point into each feature flow from a shared starting screen.
- Any cross-section relationship that would be hard to follow without visual cues.

### Style

- **Stroke**: 4px, blue (#2563EB) for primary flows; 3px for secondary flows.
- **Path**: L-shaped routed paths (horizontal then vertical, or vertical then horizontal). Never diagonal lines.
- **Arrowhead**: Equilateral arrow cap on the destination end only.
- **Fills**: None (stroke only).

### Labels on Connectors

Every connector line gets a text label:

- **Font**: Semi Bold, 28px
- **Color**: Match the connector color (blue for primary, gray for secondary)
- **Position**: Directly above the horizontal segment of the connector, near the turn point.
- **Content**: Short description of the flow (e.g., "Create a task", "Settings to Profile").

### Routing

- All connectors from a shared origin should fan out from a common vertical trunk line.
- Each branch turns horizontally toward its target row.
- Labels sit at the horizontal branch so they are visually associated with the correct destination.

---

## Naming Conventions

Consistent naming helps developers navigate the Figma file and helps AI agents parse it programmatically.

| Element | Pattern | Example |
|---------|---------|---------|
| Frames | `{Feature} - Step {N}` | `Upload - Step 0` |
| Sections | `{Category} Designs` or `{Category} Components` | `Feature Designs` |
| Connector vectors | `Flow: {description}` | `Flow: Create a task` |
| Connector labels | `Label: {description}` | `Label: Create a task` |
| Row headers | Uppercase task/feature name | `TASK 1: CREATE A TASK` |

---

## Handoff Checklist

Use this before marking a handoff page as complete:

- [ ] Page organized into clearly labeled Sections
- [ ] Frames arranged in logical rows (one flow per row, left-to-right)
- [ ] Minimal section and row headers added on canvas
- [ ] Native annotations set on every frame (logic, flow context, edge cases)
- [ ] Component descriptions set via native `description` property
- [ ] All frames marked with `devStatus: READY_FOR_DEV`
- [ ] Visual connector lines between sections with labeled L-shaped paths
- [ ] Connector labels positioned at turn points, large and readable
- [ ] No redundant text on canvas (nothing that duplicates visible design content)
- [ ] No sticky notes, comment frames, or annotation cards on canvas
- [ ] Consistent naming on all frames, vectors, labels, and sections
- [ ] Screenshot review at 50% zoom to verify overall readability
