---
name: de:design
description: Full design workflow orchestrator. God mode (autonomous) or Guided mode (step-by-step). Sequences through discovery, strategy, planning, and validation.
argument-hint: "[god-mode | guided | phase N | skill-name]"
---

# Design Workflow

## Context

<context> #$ARGUMENTS </context>

The primary command for product creation. Handles the entire design pipeline from brainstorm to final design.

## Prerequisites

Verify that `/de:setup` has been run by checking for `design-engineer.local.md` in the project root. If not found, instruct the user to run `/de:setup` first.

## Mode Selection

If no mode was specified in arguments, use AskUserQuestion to ask:

**Question:** "How would you like to work?"

1. **God mode** -- I run the full pipeline autonomously with minimal input from you
2. **Guided mode** -- Step-by-step, I ask questions at every stage and pause for your approval
3. **Direct access** -- Jump to a specific skill or phase

If AskUserQuestion is not available, present the options as a numbered list.

## Project Status Check

Check for existing deliverables in the configured deliverables path. If prior work exists, ask:

**Question:** "I found existing deliverables. What would you like to do?"

1. **Continue** -- Resume from where you left off
2. **Start fresh** -- Begin the pipeline from Phase 1
3. **Jump to phase** -- Start from a specific phase

## Workflow

Load the `meta-orchestrator` skill. It manages the pipeline sequence, phase transitions, and context handoffs.

### Phase 1: Discovery

Skills executed in sequence:

1. Load `ux-big-idea` -- idea validation and refinement
2. Load `ux-problem-statement` -- structured problem definition
3. Load `ux-target-audience` -- persona development
4. Load `ux-assumptions` -- assumption tracking
5. Load `ux-competitor-analysis` -- competitive landscape analysis
6. Load `ux-user-interviews` -- interview design and analysis *(optional -- ask user)*

After Phase 1, run `meta-compound` to document progress.

In Guided mode, pause and ask: "Phase 1 (Discovery) complete. Ready to proceed to Phase 2 (Strategy)?"

### Phase 2: Strategy

Skills executed in sequence:

1. Load `ux-storybrand` -- messaging framework
2. Load `ux-business-plan` -- revenue model and market sizing
3. Load `ux-6p-stories` -- product narrative stories
4. Load `ux-behavior-mapping` -- behavior analysis *(optional)*
5. Load `ux-psych-framework` -- psychology framework *(optional)*

After Phase 2, run `meta-compound` to document progress.

### Phase 3: Planning

Skills executed in sequence:

1. Load `ux-mvp-requirements` -- MVP prioritization
2. Load `ux-information-architecture` -- IA design

After Phase 3, run `meta-compound` to document progress.

### Phase 4: Design & Validation

Skills executed in sequence:

1. Load `ux-bias-framework` -- B.I.A.S. audit
2. Load `ux-journey-mapping` -- journey mapping
3. Load `ux-ethics-review` -- ethical review *(optional)*
4. Load `ui-design-references` -- reference gathering
5. Load `ui-figma-workflow` -- Figma workflow
6. Load `dev-prototyping` -- prototyping and testing
7. Load `ux-product-assessment` -- product assessment *(optional)*

After Phase 4, run `meta-compound` to document progress.

### Transition Checkpoint

Before proceeding to development:

**Question:** "All pre-development phases are complete. What would you like to do?"

1. **Proceed to development** -- Run `/de:dev` to set up the development pipeline
2. **Review deliverables** -- Run `/de:review` to audit everything created
3. **Run psychology audit** -- Run `/de:psych` for a deep psychology review
4. **Document and stop** -- Save progress and end the session

## Agents Used

- `ux-researcher` -- parallel research tasks
- `deliverable-writer` -- document production
- `compound-documenter` -- progress documentation
