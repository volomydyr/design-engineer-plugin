---
name: meta-setup-existing
description: "Onboarding flow for existing projects using the Design Engineer Plugin for the first time. Shows capabilities, asks diagnostic questions, recommends next steps, runs minimal setup."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Existing Project Setup

This project already exists but is using the Design Engineer Plugin for the first time. Follow every step in order. Do not use auto-memory for personalization, project summaries, or skipping questions.

## Step 1: Show Capabilities

Present this list, then proceed to Step 2. Do not ask what the user wants yet.

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
• Audit designs for cognitive biases (bias audit)
• Map customer journey highs and lows
• Review ethics and dark patterns
• Collect and organize design references
• Generate clickable HTML prototypes
• Design key screens with Figma workflow
• Analyze UX psychology per screen (Motivation Levels)
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

## Step 2: Diagnostic Questions

Ask all three questions in order using AskUserQuestion. Do not skip any, even if you know the answers from memory.

**Question 1:**

```
question: "What kind of project is this?"
header: "Project type"
options:
  - label: "App (mobile or web)"
    description: "A software application with UI"
  - label: "Website"
    description: "A website or landing page"
  - label: "Design system"
    description: "A component library or design system"
  - label: "Something else"
    description: "Tell me more about your project"
```

**Question 2:**

```
question: "What do you currently have?"
header: "Current state"
options:
  - label: "Code + designs"
    description: "Both a codebase and Figma/design files exist"
  - label: "Code only"
    description: "A working codebase but no formal designs"
  - label: "Designs only"
    description: "Figma files or design specs but no code"
  - label: "Documentation only"
    description: "Research, specs, or planning docs but no code or designs"
```

**Question 3:**

```
question: "What would you like to do?"
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
```

## Step 3: Recommendations

Based on the goal the user selected, recommend the most relevant command:

| Goal | Recommendation |
|------|---------------|
| Review what I have | `/de:review` – run a multi-layer design review (visual, accessibility, psychology, design system) |
| Implement from Figma | `/de:dev` – set up the development pipeline and implement from Figma designs |
| Design a new feature | `/de:design` – start the full design workflow (discovery → strategy → planning → validation) |
| Set up the dev workflow | `/de:dev` – configure CLAUDE.md, agent pipeline, testing, and context management |

Present the recommendation with a brief explanation of what it does and how to run it. Mention that all commands are available anytime – this is just a suggested starting point.

## Step 4: Minimal Setup

This step is mandatory. Do not skip it.

1. Run environment detection. Present results in plain language:
   - ✓ for available tools (describe what they enable, not their technical names)
   - ✗ for missing tools (offer to help install essential ones)
   - If essential tools are missing (Figma connection or documentation access), proactively offer to help install them.

2. Ask only essential config: deliverables path (default: `docs/design/`) and design tool integration.

3. Write `.design-engineer.yaml` with `project.type: "existing"`.

4. Scaffold folders using the `meta-setup` skill's `scripts/init-project-structure.sh`.

5. Ask about the status line:

```
question: "Would you like to install the design-engineer status line?"
header: "Status line"
options:
  - label: "Yes (Recommended)"
    description: "Shows model, usage limits, context bar, and pipeline progress below every prompt"
  - label: "No"
    description: "Skip – re-run /de:start later to install"
```

If "Yes": follow the status line installation steps from the `meta-setup` skill's Step 5.

6. Do NOT ask about mode preference, team size, or dev environment.

7. Confirm setup is complete:

```
You're all set.

Your design docs will live in docs/design/
{Figma connected / not connected}
Status line: {installed / skipped}

Run the recommended command above to get started, or use /de:start anytime to see what's available.
```
