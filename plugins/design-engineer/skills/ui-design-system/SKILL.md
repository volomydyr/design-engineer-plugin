---
name: ui-design-system
description: Guides creation of a code-first design system using atomic design patterns. Use when setting up design tokens, auditing design system compliance, or refactoring hardcoded styles into reusable tokens.
disable-model-invocation: true
model: opus
---

# Code-First Design System

## Why This Matters

A design system should be built in code, not Figma. With AI-assisted development, tokens and components emerge from implementation – not from upfront planning. You give AI a design frame, develop the first iteration, and then ask it to refactor: separate large files into smaller ones, create reusable components, and extract colors, typography, and spacing into tokens.

This approach ensures every token and component is actually used in your codebase, avoids maintaining two parallel systems (Figma + code), and lets AI handle the mechanical work of consistency enforcement.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Check for Saved Design Decisions

Before starting, check if the project has a saved design system file at `.design-system/system.md`. If it exists, read it and apply the saved decisions – direction, depth strategy, spacing base unit, key patterns, component inventory. This prevents re-inventing decisions that were already made in a previous session.

If the file exists, present the saved decisions to the user and ask if they are still current before proceeding.

---

## Step 1: Determine Current State

```
question: "What is the current state of your project's design system?"
header: "Design System Status"
options:
  - label: "No design system yet"
    description: "Starting from scratch – will build incrementally during development"
  - label: "Some hardcoded styles exist"
    description: "Code exists but uses magic numbers, inline colors, and inconsistent patterns"
  - label: "Partial design system"
    description: "Some tokens and components exist but coverage is incomplete"
  - label: "Full design system – need audit"
    description: "System exists but may have compliance gaps or violations"
```

---

## Step 2: Define the Architecture

Walk the user through the atomic design system architecture described in [design-system-architecture.md](./references/design-system-architecture.md):

For projects starting from scratch, use the starter values in [starter-values.md](./references/starter-values.md) as a sensible starting point – spacing scales, typography scales, text hierarchy, border progression, surface elevation, and depth strategies.

Before defining layers, establish the depth strategy. This is a foundational decision that affects every surface in the system:

```
question: "Which depth strategy fits your product's intent?"
header: "Depth Strategy"
options:
  - label: "Borders only"
    description: "Clean, technical – structure through lines, not dimension"
    preview: |
      ┌────────────────────┐
      │ Card Title          │
      ├────────────────────┤
      │ Content here        │
      │                     │
      │ ┌────────┐          │
      │ │ Button │          │
      │ └────────┘          │
      └────────────────────┘
      No shadows, no elevation.
      Flat and precise.
  - label: "Subtle shadows"
    description: "Gentle depth – elements float slightly above the surface"
    preview: |
      ╭────────────────────╮ .
      │ Card Title          │ .
      │                     │ .
      │ Content here        │ .
      │                     │ .
      │ ╭────────╮          │ .
      │ │ Button │.         │ .
      │ ╰────────╯          │ .
      ╰────────────────────╯ .
       ......................
      Soft shadows, slight lift.
  - label: "Layered surfaces"
    description: "Tonal shifts create depth without visible shadows"
    preview: |
      ========================
      = .................... =
      = . Card Title        . =
      = .                   . =
      = . Content here      . =
      = .                   . =
      = . [[[Button]]]      . =
      = .                   . =
      = .................... =
      ========================
      Background > surface > element.
      Depth through color, not shadow.
  - label: "Mixed (contextual)"
    description: "Borders for structure, shadows for interactive elements"
    preview: |
      ┌────────────────────┐
      │ Card Title          │
      │                     │
      │ Content here        │
      │                     │
      │ ╭────────╮ .        │
      │ │ Button │ .        │
      │ ╰────────╯ .        │
      │  ..........         │
      └────────────────────┘
      Borders for containers,
      shadows for interactive elements.
```

### Layer 1: Design Tokens (Base Values)
Foundation layer containing raw values – colors (hex/RGB), spacing (points/pixels), typography (font sizes, weights, line heights), border radii, shadow definitions, animation durations, icon sizes, and accessibility constants (minimum tap target size of 56 points).

### Layer 2: Semantic Aliases (Context-Specific)
Meaningful names that reference base tokens. Instead of `Color(hex: "#007AFF")`, use `Color.primaryAction`. Instead of `Font.system(size: 16)`, use `Font.bodyDefault`. Semantic aliases make intent clear and enable theme changes by updating one mapping.

### Layer 3: View Components (Reusable UI)
Components that consume semantic aliases – buttons, input fields, cards, containers, navigation elements. Each component uses only semantic aliases, never raw values.

---

## Step 3: Incremental Extraction

For projects with existing code, guide the extraction process:

1. **Audit existing code** – scan for hardcoded colors, font sizes, spacing values, and magic numbers
2. **Identify patterns** – group repeated values into logical categories
3. **Create tokens** – define base values for each identified pattern
4. **Create aliases** – map tokens to semantic names based on usage context
5. **Replace hardcoded values** – substitute raw values with semantic aliases throughout the codebase
6. **Extract components** – identify repeated UI patterns and create reusable components

---

## Step 4: Run the Compliance Audit

Use the checklist from [compliance-checklist.md](./references/compliance-checklist.md) to verify compliance:

- Zero hardcoded color values (RGB, hex, or system colors)
- Zero hardcoded font sizes or weights
- Zero magic numbers for spacing or sizing
- All views follow single responsibility principle
- No duplicated styling logic across files
- All icons use a centralized icon system
- Consistent naming conventions following the semantic alias pattern
- All components use semantic aliases, not raw token values

---

## Step 5: Produce the Deliverable

Save the design system documentation to `{deliverables_path}/dev/design-system.md` containing:

- Architecture diagram (tokens -> aliases -> components)
- Token inventory (all defined base values)
- Semantic alias mappings
- Component catalog (all reusable components)
- Compliance score and any remaining violations
- Guidelines for extending the system when new screens are added

---

## Step 6: Save Design Decisions

After completing the design system, offer to save the key decisions for future sessions:

```
"Want me to save these design decisions for future sessions?"
```

If yes, write to `.design-system/system.md` in the project root:

- **Direction and feel** – the stated design intent
- **Depth strategy** – which approach was chosen (borders-only, shadows, layered, surface shifts)
- **Spacing base unit** – the scale in use
- **Typography choices** – typeface, scale, hierarchy levels
- **Color temperature** – warm/cool neutrals, accent color, semantic colors
- **Key component patterns** – established components and their usage rules
- **Component inventory** – list of all reusable components created

This compounds: each save makes future work faster and more consistent. On subsequent runs, Step 0 loads these decisions automatically.

**When to save:** Add patterns when a component is used 2+ times, is reusable across the project, or has specific measurements worth remembering. Do not save one-off components, temporary experiments, or variations better handled with props.

**Consistency checks:** If `.design-system/system.md` exists, check against it: spacing on the defined grid, depth using the declared strategy, colors from the defined palette, documented patterns reused instead of reinvented.

---

## Decision Hierarchy

1. **User's direct input** – their preferred naming conventions, organizational choices
2. **Existing codebase patterns** – respect and extend what already works
3. **AI suggestions** – propose patterns based on the architecture, but defer to user

---

## What Comes Next

After the design system is established, suggest running `ui-visual-review` to check implemented UI against design intent, or `dev-agent-pipeline` to implement features using the design system.

---

## Resource Files

- [design-system-architecture.md](./references/design-system-architecture.md) – Atomic design pattern for code-first design systems
- [compliance-checklist.md](./references/compliance-checklist.md) – Compliance audit checklist for design system verification
- [starter-values.md](./references/starter-values.md) – Sensible starter values for spacing, typography, borders, surfaces, depth, and shadows
- [prompt-templates.md](./references/prompt-templates.md) – Curated prompt templates for visual polish, glance tests, component specs, and audits
