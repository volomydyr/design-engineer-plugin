---
name: design-engineer:design
description: Design workflow. For new products, runs the full pipeline. For existing projects, runs an abbreviated feature-focused flow.
argument-hint: "[phase N | skill-name]"
---

# Design Workflow

## Context

<context> #$ARGUMENTS </context>

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot) and project type
2. Check for existing deliverables in `design/`
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:start` first
4. Scan the project: what tech stack, what components exist, what design patterns are used

## Step 2: Route based on project type

Check `project_type` in the config:

### If `project_type: existing` → Feature flow (abbreviated)

This project already exists. Do NOT run the full 4-phase from-scratch pipeline. The product has users, positioning, and an established codebase. Run an abbreviated feature-focused flow:

1. **Understand the feature**: Ask what the user wants to build. Use AskUserQuestion to clarify: what problem does it solve, who uses it, any constraints, how it fits into the existing product.

2. **Create feature folder**: Create `design/features/[feature-slug]/` for all deliverables related to this feature. Example: `design/features/private-islands/`. This prevents naming collisions when multiple features are designed over time.

3. **Plan the feature**: Go directly to `ux-mvp-requirements` – define scope, priorities, and what to reuse from the existing codebase. Then `ux-information-architecture` – define page structure, navigation, and how the feature integrates with existing pages. Save all deliverables in the feature folder.

4. **Optional depth** (ask the user): Offer these as optional add-ons, not defaults:
   - Brief problem statement (if the feature is complex and needs structured thinking)
   - Psychology audit on the planned feature
   - Figma comparison (if designs exist)

5. **Proceed to implementation**: Load `/design-engineer:dev` with the feature plan.

In Guided mode: ask the user at each step, iterate. Do NOT delegate to agents – the main model does the work interactively.
In Autopilot: execute the abbreviated flow, present results.

### If `project_type: new` → Full pipeline

This is a new product from scratch. Run the full 4-phase pipeline.

If existing deliverables are found, present current state and recommend where to pick up. In Guided mode, ask to confirm. In Autopilot, show briefly and start.

## Step 3: Execute based on mode

### Guided mode

In Guided mode, the main model does ALL user-facing work. Do NOT delegate to autonomous agents (ux-researcher, psych-scanner, etc.). Agents cannot pause for user input – they defeat the purpose of Guided mode.

For each skill in the current phase:
1. Announce what's next and why it matters
2. Ask if the user wants to proceed, skip, or adjust
3. Run the skill YOURSELF – read reference material from the skill, ask the user 7–10 strategic questions, iterate back and forth until satisfied
4. Present the deliverable for review
5. Wait for feedback before moving to the next skill
6. After each phase: summarize what was created, invoke `meta-document` to save progress, ask to continue

### Autopilot

1. Run all skills in the current phase (delegate to agents for speed)
2. Present a summary of deliverables created
3. After each phase: invoke `meta-document`, ask to continue or review

### Phase 1: Discovery (new products only)

Skills in sequence:
1. `ux-problem-statement` – structured problem definition
2. `ux-target-audience` – persona development
3. `ux-assumptions` – assumption tracking
4. `ux-competitor-analysis` – competitive landscape analysis
5. `ux-user-interviews` – interview design and analysis *(optional – ask user)*

### Phase 2: Strategy (new products only)

1. `ux-behavior-mapping` – behavior analysis
2. `ux-storybrand` – messaging framework
3. `ux-story-panels` – product narrative stories
4. `ux-business-plan` – revenue model and market sizing

### Phase 3: Planning (both new and existing)

1. `ux-mvp-requirements` – MVP prioritization
2. `ux-information-architecture` – IA design

### Phase 4: Design & validation (both new and existing, optional for features)

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
  - label: "Continue to next phase"
    description: "Continue to the next phase of the design pipeline"
  - label: "Review deliverables"
    description: "Review the deliverables for quality before moving on"
  - label: "Move to development"
    description: "Switch to development – set up code pipeline and implement"
  - label: "Save progress and stop"
    description: "Document progress so you can pick up next time"
```
