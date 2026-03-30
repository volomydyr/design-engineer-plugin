---
name: de:review
description: Context-aware design review. Plans what to review based on your project, executes step by step in Guided mode or all at once in God mode.
argument-hint: "[specific area to review]"
---

# Design Review

## Context

<context> #$ARGUMENTS </context>

## Step 1: Read project context

Before asking anything or starting work:

1. Read `.design-engineer.yaml` for mode (guided/god) and goal
2. Check what tools are available (is Figma connected? is Playwright available?)
3. Scan the project briefly: what tech stack, what files exist, are there components, is there a design system?

## Step 2: Plan the review

Based on what you found, present a review plan. Only include areas that make sense for THIS project:

```
Based on your project ({tech stack summary}), here's what I recommend reviewing:

1. {Area 1} – {brief description of what I'll check}
2. {Area 2} – {brief description}
3. {Area 3} – {brief description}

I'll review these {one at a time / all at once} and show you findings as I go.
```

Guidelines for building the plan:
- **UX and usability** – always relevant if the project has UI
- **Visual quality** – always relevant if the project has UI (spacing, typography, color, polish)
- **Accessibility** – always relevant (WCAG compliance, keyboard navigation, screen readers)
- **Design system compliance** – only if the project has a design system or component library
- **Figma comparison** – only if Figma is connected and the user has designs to compare against
- **Psychology scan** – include as an option if the project has user-facing UI, but not as a default
- **Ethics review** – include as an option, not as a default

In **Guided mode**: ask the user to approve or adjust the plan before executing.
In **God mode**: show the plan briefly, then execute without waiting for approval.

If the user specified an argument (e.g. `/de:review psych`), skip planning and go directly to that specific review area.

## Step 3: Execute the review

### Guided mode

1. Work through the plan one area at a time
2. For each area:
   a. Announce what you're reviewing: "Checking {area}..."
   b. Do the work (load the appropriate skill or agent)
   c. Present findings individually with severity level and recommendation
   d. Ask: "Fix this? Skip? Dive deeper?" — wait for response before continuing
3. After all areas: show a summary table grouped by severity
4. Ask what to do next (see post-review below)

### God mode

1. Execute all planned review areas (use parallel agents where possible)
2. Present complete results as a structured summary grouped by severity
3. Ask what to fix or explore further

## Skills and agents to use per review area

| Review area | Skill/agent | When to use |
|-------------|------------|-------------|
| UX and usability | `ui-design-to-code-qa` | UI projects |
| Visual quality | `ui-design-to-code-qa` | UI projects |
| Accessibility | `ui-accessibility` | Always |
| Design system compliance | `design-system-auditor` agent | Projects with design system |
| Figma comparison | `ui-design-to-code-qa` with Figma plugin | Figma connected |
| Psychology scan | `psych-full-scan` | User-facing UI |
| Ethics review | `ux-ethics-review` | On request |
| Full product assessment | `ux-full-review` | On request |

## Post-review

After the review is complete, ask:

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Fix the issues"
    description: "Work through the findings and implement fixes"
  - label: "Document findings"
    description: "Save the review results for reference"
  - label: "Review another area"
    description: "Run a different type of review"
```
