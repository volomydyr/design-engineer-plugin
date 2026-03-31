---
name: de:review
description: Context-aware design review. Plans what to review based on your project, executes step by step in Guided mode or all at once in Autopilot.
argument-hint: "[specific area to review]"
---

# Design Review

## Context

<context> #$ARGUMENTS </context>

## Step 1: Read project context

Before asking anything or starting work:

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot) and goal
2. Check what tools are available (is Figma connected? is Playwright available?)
3. Scan the project briefly: what tech stack, what files exist, are there components, is there a design system?

## Step 2: Plan the review

Based on what you found, present a review plan. Only include areas that make sense for THIS project:

```
Based on your project ({tech stack summary}), here's what I can review:
```

Then present a multiSelect AskUserQuestion listing the available areas. The user checks which ones they want:

```
question: "Which areas would you like me to review?"
header: "Review areas"
multiSelect: true
options: [only include what's relevant]
  - "UX and usability" – interaction flows, navigation, state handling, error states
  - "Visual quality" – spacing, typography, color, alignment, polish
  - "Accessibility" – WCAG compliance, keyboard navigation, screen readers
  - "Design system compliance" – only if project has a design system
  - "Figma comparison" – only if Figma is connected
  - "Psychology scan" – cognitive load, decision fatigue, trust signals
  - "Ethics review" – dark patterns, informed consent
```

After user selects areas, ask a scoping question:

```
question: "What should I focus on?"
header: "Scope"
options:
  - label: "Whole app"
    description: "Review all pages and flows"
  - label: "Specific page or flow"
    description: "I will tell you which one to focus on"
  - label: "Recent changes only"
    description: "Review only what has been changed or added recently"
```

If "Specific page or flow": ask which one.

## Step 3: Execute the review

For each selected area, load the relevant skill to use its reference knowledge:

| Review area | Skill to load | Purpose |
|-------------|--------------|---------|
| UX and usability | `ui-design-to-code-qa` | Reference for UX patterns |
| Visual quality | `ui-design-to-code-qa` | Reference for visual quality |
| Accessibility | `ui-accessibility` | WCAG reference material |
| Design system compliance | `ui-design-system` | Design system rules |
| Figma comparison | `ui-design-to-code-qa` with Figma | Side-by-side comparison |
| Psychology scan | `psych-full-scan` | 100+ psychology principles |
| Ethics review | `ux-ethics-review` | Ethics framework |

### Guided mode

Do NOT delegate to autonomous agents. The main model does the review step by step using the loaded skill's reference material.

1. Read the relevant code yourself (Read, Grep, Glob tools)
2. Analyze against the loaded skill's principles
3. Announce: "I found N findings. Here's finding 1 of N..."
4. For each finding, present:
   - Principle name and severity
   - File:line reference
   - What's wrong and why it matters
   - 3–4 specific recommendations, each with a brief explanation and tradeoff. Mark the best one "(Recommended)".
5. Ask via AskUserQuestion: "What would you like to do with this finding?"
   - "Fix it now" – implement the fix before moving on
   - "Note and continue" – save for later, show next finding
   - "Skip" – not relevant, show next
   - "Explain this principle" – teach me why this matters
6. After all findings: summary table grouped by severity

### Autopilot

1. Delegate to agents for speed (psych-scanner, design-system-auditor, etc.)
2. Run all selected review areas in parallel where possible
3. Present complete results as a structured summary grouped by severity
4. Ask what to fix or explore further

## Step 4: Fix execution (after review)

Collect everything the user marked "fix" or "note and continue" during the review.

If there are fixes to make:
1. Present the list of noted fixes
2. Use `EnterPlanMode` to create ONE structured plan covering all fixes
3. `ExitPlanMode` for user approval
4. Execute per the plan workflow (CLAUDE.md): phase by phase, QA per phase
5. After all fixes: trigger `meta-document` / compound documenter to record what changed and why

## Post-review

After the review (or after fixes), ask:

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Fix the noted issues"
    description: "Create a plan and implement the fixes we discussed"
  - label: "Document what we reviewed"
    description: "Save the review findings and any changes made"
  - label: "Review another area"
    description: "Pick a different review area or scope"
```

If fixes were already implemented, replace "Fix the noted issues" with:
```
  - label: "Document what we changed"
    description: "Record the fixes and their rationale"
```
