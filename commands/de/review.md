---
name: de:review
description: Context-aware design review. Plans what to review based on your project, executes step by step in Guided mode or as a summary in Autopilot.
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

Based on what you found, present ALL available review areas as text:

```
Here's what I can review for your project:

**Core areas:**
- UX and usability – interaction flows, navigation, state handling, error states
- Visual quality – spacing, typography, color, alignment, polish
- Accessibility – WCAG compliance, keyboard navigation, screen readers
- Design system compliance – token usage, component reuse, naming patterns

**Additional areas:**
- Figma comparison – compare implementation against Figma designs side by side
- Psychology scan – cognitive load, decision fatigue, trust signals, behavioral patterns
- Ethics review – dark patterns, informed consent, data transparency
```

Then make ONE AskUserQuestion call with BOTH questions in the `questions` array (they appear on the same screen):

```
questions:
  - question: "Which core areas would you like me to review?"
    header: "Core review"
    multiSelect: true
    options:
      - label: "UX and usability (Recommended)"
        description: "Interaction flows, navigation, state handling, error states"
      - label: "Visual quality (Recommended)"
        description: "Spacing, typography, color, alignment, polish"
      - label: "Accessibility (Recommended)"
        description: "WCAG compliance, keyboard navigation, screen readers"
      - label: "Design system compliance"
        description: "Token usage, component reuse, naming patterns"
  - question: "Would you like any additional review areas?"
    header: "Additional"
    multiSelect: true
    options:
      - label: "Figma comparison"
        description: "Compare implementation against your Figma designs"
      - label: "Psychology scan"
        description: "Cognitive load, decision fatigue, trust signals"
      - label: "Ethics review"
        description: "Dark patterns, informed consent, data transparency"
```

Mark recommended ones with "(Recommended)" based on project scan. Both questions MUST be in a SINGLE AskUserQuestion call.

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

## Step 3: Read reference material

Before starting the review, Read the relevant reference files from the plugin's knowledge base. Look for `DESIGN_ENGINEER_PLUGIN_ROOT` in your context — it contains the absolute path to the plugin directory. Use it to resolve file paths.

For each selected area, Read these reference files BEFORE analyzing code:

| Review area | Reference files to Read |
|-------------|----------------------|
| UX and usability | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Visual quality | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-to-code-qa/references/` |
| Accessibility | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-accessibility/references/` |
| Design system compliance | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/references/` |
| Figma comparison | If Figma plugin is connected, use `get_design_context` for structured design data; otherwise fall back to screenshots provided by the user |
| Psychology scan | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-full-scan/references/principles-master.md` |
| Ethics review | `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-ethics-review/references/` |

This reference material is what makes the plugin's review better than a generic AI review. Do not skip reading it.

## Step 4: Execute the review

### Guided mode

Agents CAN run for analysis. But after an agent completes, parse its output and present findings one at a time with AskUserQuestion interaction. Never show the agent's raw output directly.

1. Read the relevant code yourself or run the appropriate agent
2. Announce: "I found N findings. Here's finding 1 of N..."
3. For each finding, present:
   - Principle name and severity
   - File:line reference
   - What's wrong and why it matters
   - At least 3 recommendations. Each recommendation must include:
     - **What to do** (1 sentence)
     - **Why it helps** (1 sentence)
     - **Tradeoff** (1 sentence)
   - Mark the best recommendation "(Recommended)"
4. Ask via AskUserQuestion after each finding:
   ```
   question: "What would you like to do with this finding?"
   header: "Action"
   options:
     - label: "Fix it now"
       description: "Implement the fix before moving on"
     - label: "Note and continue"
       description: "Save for later, show next finding"
     - label: "Skip"
       description: "Not relevant, show next"
     - label: "Explain this principle"
       description: "Teach me why this matters"
   ```
5. After all findings: summary table grouped by severity
6. Ask what to do next (see post-review below)

### Autopilot

1. Run agents for speed (psych-scanner, design-system-auditor, etc.)
2. Present complete results as a structured summary grouped by severity
3. Ask what to fix or explore further

## Step 5: Fix execution (after review)

Collect everything the user marked "fix" or "note and continue" during the review.

If there are fixes to make:
1. Present the list of noted fixes
2. Read the plan template at the plugin's `skills/meta-setup/references/plan-template.md`
3. Use `EnterPlanMode` to create ONE structured plan covering all fixes
4. `ExitPlanMode` for user approval
5. IMMEDIATELY copy approved plan to `plans/[YYYY-MM-DD]-[name].md`
6. Execute per the plan workflow (CLAUDE.md): phase by phase, QA per phase
7. After all fixes: trigger `meta-document` to record what changed and why

## Post-review

After the review (or after fixes), ALWAYS use AskUserQuestion with specific options. Never end with a plain text question.

If fixes haven't been done yet:
```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Fix the noted issues"
    description: "Create a plan and implement the fixes we discussed"
  - label: "Document what we reviewed"
    description: "Save the review findings for reference"
  - label: "Review another area"
    description: "Pick a different review area or scope"
```

If fixes were already implemented:
```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Document what we changed"
    description: "Record the fixes and their rationale"
  - label: "Review another area"
    description: "Pick a different review area or scope"
  - label: "Done for now"
    description: "End the session"
```

IMPORTANT: Every transition point in the review flow MUST use AskUserQuestion. Never end with "Is there anything else?" or any plain text question.
