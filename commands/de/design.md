---
name: de:design
description: Full design workflow. Sequences through discovery, strategy, planning, and validation phases. Mode and pace determined by your config.
argument-hint: "[phase N | skill-name]"
---

# Design Workflow

## Context

<context> #$ARGUMENTS </context>

The primary command for product creation. Handles the entire design pipeline from brainstorm to final design.

## Step 1: Read project context

1. Read `.design-engineer.yaml` for mode (guided/god) and project type
2. Check for existing deliverables in `docs/design/`
3. If `.design-engineer.yaml` not found, tell the user to run `/de:start` first

## Step 2: Plan

If existing deliverables are found, present current state:

```
Here's where your project stands:

Phase 1 (Discovery): {complete/in progress/not started}
Phase 2 (Strategy): {status}
Phase 3 (Planning): {status}
Phase 4 (Design & Validation): {status}

I recommend picking up at {next logical step}.
```

In **Guided mode**: ask the user to confirm or adjust before proceeding.
In **God mode**: show the plan briefly, then start.

If a specific phase or skill was passed as argument, jump to that directly.

## Step 3: Execute based on mode

The pipeline has 4 phases. Each phase runs skills in sequence.

### Guided mode

For each skill in the current phase:
1. Announce what's next and why it matters
2. Ask if the user wants to proceed, skip, or adjust
3. Run the skill
4. Present the deliverable for review
5. Wait for feedback before moving to the next skill
6. After each phase: summarize what was created, ask to continue to next phase

### God mode

1. Run all skills in the current phase autonomously
2. Present a summary of deliverables created
3. Ask whether to continue to the next phase or review anything

### Phase 1: Discovery

Skills in sequence:
1. `ux-problem-statement` – structured problem definition
2. `ux-target-audience` – persona development
3. `ux-assumptions` – assumption tracking
4. `ux-competitor-analysis` – competitive landscape analysis
5. `ux-user-interviews` – interview design and analysis *(optional – ask user)*

### Phase 2: Strategy

1. `ux-behavior-mapping` – behavior analysis
2. `ux-storybrand` – messaging framework
3. `ux-story-panels` – product narrative stories
4. `ux-business-plan` – revenue model and market sizing

### Phase 3: Planning

1. `ux-mvp-requirements` – MVP prioritization
2. `ux-information-architecture` – IA design

### Phase 4: Design & Validation

1. `ux-bias-audit` – bias audit
2. `ux-journey-mapping` – journey mapping
3. `ux-ethics-review` – ethical review *(optional)*
4. `ui-references-moodboard` – reference gathering
5. `dev-prototyping` – prototyping and testing
6. `ui-figma-guide` – Figma workflow
7. `ux-motivation-audit` – screen-level psychology analysis
8. `ux-full-review` – product assessment *(optional)*

## Post-pipeline

After completing the current work:

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Keep going"
    description: "Continue to the next phase of the design pipeline"
  - label: "Check what we made"
    description: "Review the deliverables for quality before moving on"
  - label: "Start building"
    description: "Switch to development – set up code pipeline and implement"
  - label: "Save and stop"
    description: "Document progress so you can pick up next time"
```
