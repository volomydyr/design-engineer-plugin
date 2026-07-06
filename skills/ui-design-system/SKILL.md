---
name: ui-design-system
description: Guides creation of a code-first design system using atomic design patterns. Use when setting up design tokens, auditing design system compliance, or refactoring hardcoded styles into reusable tokens.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Code-First Design System

## Why This Matters

A design system should be built in code, not Figma. With AI-assisted development, tokens and components emerge from implementation – not from upfront planning. You give AI a design frame, develop the first iteration, and then ask it to refactor: separate large files into smaller ones, create reusable components, and extract colors, typography, and spacing into tokens.

This approach ensures every token and component is actually used in your codebase, avoids maintaining two parallel systems (Figma + code), and lets AI handle the mechanical work of consistency enforcement.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) check for any saved design decisions from a previous session, 2) determine the current state of your design system, 3) define the architecture – depth strategy, tokens, semantic aliases, components, 4) guide incremental extraction if code already exists, 5) run a compliance audit, 6) produce the deliverable, capturing design decisions for future sessions." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with code-first design systems and atomic design patterns. If yes, give a one-sentence refresher. If no, explain it in simple terms: instead of designing a system in Figma first, you build tokens and components in code as you develop – colors, spacing, and typography get extracted into reusable values, and components get refactored into reusable pieces, so everything stays consistent and actually used.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding.

---

## Step 0.5: Check for saved design decisions

Before starting, check if the project has a saved design system deliverable at `.design-engineer-plugin/design/dev/design-system.md` – verify existence first (Bash `test -f` or Glob) per the defensive read pattern. If it exists, read it and apply the saved decisions from its "Design decisions" section – direction, depth strategy, spacing base unit, key patterns, component inventory. This prevents re-inventing decisions that were already made in a previous session.

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

```
multiSelect: false  # User must choose one current state
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

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

```
multiSelect: false  # User must choose one depth strategy
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

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

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/dev` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the design system documentation to `.design-engineer-plugin/design/dev/design-system.md` containing:

- Architecture diagram (tokens -> aliases -> components)
- Token inventory (all defined base values)
- Semantic alias mappings
- Component catalog (all reusable components)
- Compliance score and any remaining violations
- Guidelines for extending the system when new screens are added
- Design decisions – direction and feel, depth strategy, spacing base unit, typography choices, color temperature, and key component patterns, so future sessions can reload them without re-deciding

---

## Step 6: Design Decisions Live in the Deliverable

Design decisions are captured in the deliverable's "Design decisions" section as part of Step 5 – there is no separate save file. This compounds: on subsequent runs, Step 0.5 loads these decisions automatically from `.design-engineer-plugin/design/dev/design-system.md`, so each run builds on the last instead of re-deciding.

**When to save:** Add patterns when a component is used 2+ times, is reusable across the project, or has specific measurements worth remembering. Do not save one-off components, temporary experiments, or variations better handled with props.

**Consistency checks:** If `.design-engineer-plugin/design/dev/design-system.md` exists, check against it: spacing on the defined grid, depth using the declared strategy, colors from the defined palette, documented patterns reused instead of reinvented.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing token value, an undocumented component pattern – ask via AskUserQuestion. Never fill gaps silently. Never invent design tokens, color values, or component specifications. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their preferred naming conventions, organizational choices
2. **Existing codebase patterns** – respect and extend what already works
3. **AI suggestions** – propose patterns based on the architecture, but defer to user

---

## What Comes Next

After the design system is established, suggest running `ui-design-to-code-qa` to check implemented UI against design intent, or `dev-agent-setup` to implement features using the design system.

The token, semantic-alias, and component names in this deliverable (`.design-engineer-plugin/design/dev/design-system.md`) are the source that per-screen design specs bind to. The `design-spec` skill reads this file first and references only names that appear here, so the spec never points at a token or component that does not exist.

---

## Resource Files

- [design-system-architecture.md](./references/design-system-architecture.md) – Atomic design pattern for code-first design systems
- [compliance-checklist.md](./references/compliance-checklist.md) – Compliance audit checklist for design system verification
- [starter-values.md](./references/starter-values.md) – Sensible starter values for spacing, typography, borders, surfaces, depth, and shadows
- [prompt-templates.md](./references/prompt-templates.md) – Curated prompt templates for visual polish, glance tests, component specs, and audits


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
