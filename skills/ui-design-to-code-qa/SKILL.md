---
name: ui-design-to-code-qa
description: "Reviews implemented UI against design intent and catches common AI-generated issues. Use after implementation to verify visual fidelity or when UI discrepancies are reported. Do NOT use for craft quality or aesthetic judgment; see ui-aesthetic-review instead."
model: sonnet
effort: medium
license: MIT
---

# Visual Review

## Why This Matters

AI-generated UI frequently contains specific, predictable issues: title case where sentence case was intended, incorrect spacing, hardcoded values instead of design tokens, creative interpretations of designs, and redundant components that duplicate existing ones. Catching these early prevents accumulated visual debt.

The most common violations are hardcoded values (AI writes specific color values instead of reusing established tokens) and redundant components (AI creates new components from scratch instead of reusing existing ones every time new designs are shared).

Beyond these technical issues, AI-generated UI has recognizable aesthetic fingerprints: the same fonts, the same color palettes, the same card layouts. These patterns are cataloged in the design critique references – consult them when the implementation looks "correct" but feels generic.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine Review Method

```
question: "How do you want to review the implementation?"
header: "Review Method"
options:
  - label: "Compare with Figma designs (via Figma plugin)"
    description: "Side-by-side comparison using Figma plugin data"
  - label: "Review screenshots"
    description: "Analyze provided screenshots of the implementation"
  - label: "Review live URL (via Playwright)"
    description: "Navigate to a URL and take automated screenshots"
  - label: "Review code or HTML prototype"
    description: "Audit the codebase for design system violations, or an HTML prototype file for UX and visual quality"
```

When the review target is an HTML prototype, read the HTML file at the path the user provides (default: `.design-engineer-plugin/prototype/prototype.html`). Run the UX non-negotiables check (Step 3) and an adapted visual audit that focuses on spacing, typography, hierarchy, and interactive states rather than design system token compliance (since prototypes use inline tokens, not a formal design system).

---

## Step 2: Identify Review Scope

Ask the user which screens or components to review. If working within a pipeline, review all screens implemented in the current phase.

---

## Step 3: UX Non-Negotiables Check

Before diving into the visual audit, run a quick UX check. These are fundamental usability principles that must hold regardless of visual style:

### 1. Reduce Thinking
Users should never wonder:
- "Where am I?" – Is the current location clear from navigation state, breadcrumbs, or page title?
- "What do I do next?" – Is the primary action obvious and prominent?
- "Is that clickable?" – Are interactive elements visually distinct from static content?
- "Why did they call it that?" – Are labels self-evident, not jargon?

### 2. Use Conventions
Unusual UI is a tax on every user interaction. Verify that navigation, form patterns, and interaction models follow established conventions for the platform. Flag deviations that lack a clear measured reason.

### 3. Clear Visual Hierarchy
Every screen should answer at a glance: what this page is, what the primary action is, where the navigation is, and what is secondary. If the answer is not immediately clear, the hierarchy needs work.

### 4. Grouping Clarity
If spacing does grouping work, it must be unambiguous: more space around groups than within groups. Related items should be visually closer to each other than to unrelated items.

### 5. Feedback and Forgiveness
Users should see results of actions quickly, understand system status at all times, and be able to recover via undo, back, or cancel where possible. Preventing errors is better than scolding users for making them.

### 6. Accessibility Is Beautiful
Good aesthetics must survive keyboard-only use, low vision, color blindness, small screens, and slow networks. If the design breaks under any of these conditions, it is not finished.

Document any non-negotiable violations before proceeding to the visual audit.

---

## Step 4: Run the Visual Audit

For each screen or component, check against the common issues catalog in [common-ui-issues.md](./references/common-ui-issues.md). For deeper domain knowledge on typography, color, spacing, motion, and interaction design, consult the [design domain references](../ui-aesthetic-review/references/).

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

## Step 5: Produce the Review Report

For each issue found, document:
- **What**: specific description of the issue
- **Where**: file path and line reference
- **Expected**: what the design specifies
- **Actual**: what was implemented
- **Fix**: recommended correction

Before writing the report, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/reviews` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the report to `.design-engineer-plugin/design/reviews/visual-review.md`.

---

## Step 6: Apply Fixes

If the user approves, apply fixes directly. Prioritize:
1. Design system violations (hardcoded values) – highest impact, easiest to fix
2. Typography issues – highly visible to users
3. Component reuse issues – reduce future maintenance burden
4. Visual fidelity gaps – match the design intent

---

## Decision Hierarchy

1. **User's direct input** – if they say the implementation is acceptable, respect that
2. **Figma designs** – the authoritative source for visual intent
3. **Design system patterns** – established conventions in the codebase
4. **AI suggestions** – propose fixes but defer to user

---

## What Comes Next

After the visual review, suggest running `ui-aesthetic-review` to evaluate craft quality beyond correctness, `ui-design-system` in audit mode if many design system violations were found, or `ui-accessibility` to check accessibility compliance.

---

## Resource Files

- [common-ui-issues.md](./references/common-ui-issues.md) – Catalog of common AI-generated UI problems and fixes
- [Design domain references](../ui-aesthetic-review/references/) – Typography, color, spatial design, motion, interaction, responsive, UX writing, and AI anti-patterns (shared with ui-aesthetic-review)


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
