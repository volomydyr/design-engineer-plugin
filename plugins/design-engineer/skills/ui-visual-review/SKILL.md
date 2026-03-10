---
name: ui-visual-review
description: Reviews implemented UI against design intent and catches common AI-generated issues. Use after any implementation phase to verify visual fidelity, or when the user reports UI discrepancies.
disable-model-invocation: true
---

# Visual Review

## Why This Matters

AI-generated UI frequently contains specific, predictable issues: title case where sentence case was intended, incorrect spacing, hardcoded values instead of design tokens, creative interpretations of designs, and redundant components that duplicate existing ones. Catching these early prevents accumulated visual debt.

The most common violations are hardcoded values (AI writes specific color values instead of reusing established tokens) and redundant components (AI creates new components from scratch instead of reusing existing ones every time new designs are shared).

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine Review Method

```
question: "How do you want to review the implementation?"
header: "Review Method"
options:
  - label: "Compare with Figma designs (via MCP)"
    description: "Side-by-side comparison using Figma MCP data"
  - label: "Review screenshots"
    description: "Analyze provided screenshots of the implementation"
  - label: "Review live URL (via Playwright)"
    description: "Navigate to a URL and take automated screenshots"
  - label: "Review code only"
    description: "Audit the codebase for design system violations without visual comparison"
```

---

## Step 2: Identify Review Scope

Ask the user which screens or components to review. If working within a pipeline, review all screens implemented in the current phase.

---

## Step 3: Run the Visual Audit

For each screen or component, check against the common issues catalog in [common-ui-issues.md](./references/common-ui-issues.md):

### Typography Issues
- Title case used instead of sentence case (extremely common with AI)
- Incorrect font weights or sizes
- Missing letter spacing or line height adjustments
- Generic fonts used instead of the project's chosen typeface

### Spacing and Layout Issues
- Inconsistent padding and margins
- Elements not aligned to the established spacing grid
- Incorrect responsive behavior (especially when auto-layouts were missing in Figma)
- Bottom safe area not handled properly on mobile

### Design System Violations
- Hardcoded color values instead of semantic tokens
- Hardcoded font sizes instead of typography aliases
- Magic numbers for spacing instead of spacing constants
- Inline styles instead of reusable view modifiers or components

### Component Issues
- New components created when existing ones should have been reused
- Components with different naming conventions than established patterns
- Monolithic views that should be broken into smaller subviews
- Duplicated logic across multiple views

### Visual Fidelity
- Creative interpretations of the Figma design (AI added elements not in the design)
- Missing visual details (shadows, borders, gradients, corner radii)
- Incorrect icon usage or missing icons
- Animation or transition differences from the design intent

---

## Step 4: Produce the Review Report

For each issue found, document:
- **What**: specific description of the issue
- **Where**: file path and line reference
- **Expected**: what the design specifies
- **Actual**: what was implemented
- **Fix**: recommended correction

Save the report to `{deliverables_path}/reviews/visual-review.md`.

---

## Step 5: Apply Fixes

If the user approves, apply fixes directly. Prioritize:
1. Design system violations (hardcoded values) -- highest impact, easiest to fix
2. Typography issues -- highly visible to users
3. Component reuse issues -- reduce future maintenance burden
4. Visual fidelity gaps -- match the design intent

---

## Decision Hierarchy

1. **User's direct input** -- if they say the implementation is acceptable, respect that
2. **Figma designs** -- the authoritative source for visual intent
3. **Design system patterns** -- established conventions in the codebase
4. **AI suggestions** -- propose fixes but defer to user

---

## What Comes Next

After the visual review, suggest running `ui-design-system` in audit mode if many design system violations were found, or `ui-accessibility` to check accessibility compliance.

---

## Resource Files

- [common-ui-issues.md](./references/common-ui-issues.md) -- Catalog of common AI-generated UI problems and fixes
