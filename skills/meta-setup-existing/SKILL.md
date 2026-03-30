---
name: meta-setup-existing
description: "Onboarding for existing projects using the Design Engineer Plugin for the first time. Goal + mode → auto-setup → status line → auto-run."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Existing Project Onboarding

You have exactly 3 actions to perform, in this order. Do not skip any. Do not start working on the user's goal until all 3 are done.

## Action 1: Ask goal and mode together

Make ONE AskUserQuestion call with BOTH questions below. No text before it.

```
questions:
  - question: "What would you like to do with your existing project?"
    header: "Goal"
    options:
      - label: "Review what I have"
        description: "Audit quality, find UX issues, check accessibility"
      - label: "Implement from Figma"
        description: "I have designs ready to turn into code"
      - label: "Design a new feature"
        description: "Start the design thinking process for something new"
      - label: "Set up the dev workflow"
        description: "Configure AI-assisted development for this project"
    multiSelect: false
  - question: "How do you want to work?"
    header: "Mode"
    options:
      - label: "Guided mode (Recommended)"
        description: "Step by step – I share my thinking, ask questions, and you review each step"
      - label: "God mode"
        description: "Mostly automated – I plan and execute with minimal interruption. Faster but less control."
    multiSelect: false
```

Wait for both answers before proceeding.

## Action 2: Run setup, then ask about status line

After receiving both answers from Action 1:

**First**, run setup silently (no questions):
1. Run `detect-environment.sh` from the `meta-setup` skill's scripts directory
2. Create `.design-engineer.yaml` in the project root:
   ```yaml
   project:
     type: "existing"
     mode: "{selected_mode}"
     deliverables_path: "docs/design/"
   environment:
     plugins:
       context7: {detected}
       figma: {detected}
       playwright: {detected}
     mcps:
       figma_console: {detected}
   dependencies:
     tracking_file: "docs/design/.dependencies.yaml"
     auto_suggest: true
   ```
3. Scaffold `docs/design/` via `init-project-structure.sh` from the `meta-setup` skill's scripts directory
4. Show brief environment results in plain language (✓/✗, no technical names)
5. If essential tools missing (Figma or documentation access), offer to help install

**Then** ask about the status line:

```
questions:
  - question: "Would you like to install the design-engineer status line?"
    header: "Status line"
    options:
      - label: "Yes (Recommended)"
        description: "Shows model, usage limits, context bar, and pipeline progress below every prompt"
      - label: "No"
        description: "Skip – re-run /de:start later to install"
    multiSelect: false
```

If "Yes": install using the status line steps from `meta-setup` Step 5 (check existing config, create dirs, copy script, update settings.json, explain watch mode).

## Action 3: Auto-run the chosen command

Say "You're all set. Let's get started." then immediately load the command matching the goal:

| Goal | Command |
|------|---------|
| Review what I have | `/de:review` |
| Implement from Figma | `/de:dev` |
| Design a new feature | `/de:design` |
| Set up the dev workflow | `/de:dev` |

The command reads mode from `.design-engineer.yaml` and follows PLAN → EXECUTE → PRESENT → FEEDBACK.

---

## Fallback: Custom goal

If the user typed something custom instead of selecting an option in Action 1, show this capability list and let them pick:

```
Here's everything this plugin can help you with:

RESEARCH & DISCOVERY
• Define and analyze your core problem
• Build behavioral user personas
• Map and test your assumptions
• Research your competition
• Prepare and analyze user interviews

STRATEGY & POSITIONING
• Map what drives user behavior (Behavior Map framework)
• Build your product narrative (StoryBrand)
• Create user empathy stories (Story Panels)
• Plan your business model and revenue

PLANNING
• Define MVP scope and feature priorities
• Design information architecture and user flows

DESIGN & VALIDATION
• Audit designs for cognitive biases
• Map customer journey highs and lows
• Review ethics and dark patterns
• Collect and organize design references
• Generate clickable HTML prototypes
• Design key screens with Figma workflow
• Analyze UX psychology per screen
• Run a full product assessment

DEVELOPMENT
• Set up development environment and AI-assisted build pipeline
• Build features iteratively with test-first approach

REVIEW & AUDIT
• Design craft quality review
• Implementation fidelity check
• Accessibility audit (WCAG)
• Psychology scan (100 laws)
• Design system compliance
```

After they pick, continue with Action 2 and Action 3 as normal.
