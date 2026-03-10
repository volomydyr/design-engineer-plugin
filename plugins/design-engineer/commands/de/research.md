---
name: de:research
description: UX research activities. Run individual activities or the full research pipeline.
argument-hint: "[big-idea | problem-statement | target-audience | assumptions | competitive-analysis | user-interviews | business-plan | storybrand | full]"
---

# UX Research

## Context

<context> #$ARGUMENTS </context>

Focused entry point for UX research. Covers everything from initial idea validation through competitive analysis and user interviews. Use standalone or as part of the full `/de:design` pipeline.

## Activity Selection

If no specific activity was specified in arguments, use AskUserQuestion to ask:

**Question:** "What research activity do you need?"

1. **Big Idea validation** – Refine and validate your product idea
2. **Problem Statement** – Define the problem you are solving
3. **Target Audience** – Develop user personas
4. **Assumptions & Hypotheses** – Track and plan validation for assumptions
5. **Competitive Analysis** – Analyze the competitive landscape
6. **User Interviews** – Design, prepare, and analyze interviews
7. **Business Plan** – Revenue model, market size, go-to-market
8. **StoryBrand** – Product messaging framework
9. **Full research pipeline** – Run all of the above in sequence

If AskUserQuestion is not available, present options as a numbered list.

## Workflow

### Single Activity

Load the corresponding skill directly:

| Selection | Skill to Load |
|-----------|---------------|
| 1 | `ux-big-idea` |
| 2 | `ux-problem-statement` |
| 3 | `ux-target-audience` |
| 4 | `ux-assumptions` |
| 5 | `ux-competitor-analysis` |
| 6 | `ux-user-interviews` |
| 7 | `ux-business-plan` |
| 8 | `ux-storybrand` |

After completing any single activity, ask:

"Activity complete. Would you like to run another research activity, or are you done?"

### Full Pipeline

Run all activities in sequence (same as Phase 1 + partial Phase 2 of `/de:design`):

1. Load `ux-big-idea`
2. Load `ux-problem-statement`
3. Load `ux-target-audience`
4. Load `ux-assumptions`
5. Load `ux-competitor-analysis`
6. Load `ux-user-interviews` *(ask if the user wants to include this)*
7. Load `ux-business-plan`
8. Load `ux-storybrand`

Run `meta-compound` after completing the pipeline to document all research findings.

## Mode

- **Guided mode** for interviews (requires human interaction)
- **Both modes** for desk research activities
- **God mode** available for full pipeline (runs autonomously)

## Agents Used

- `ux-researcher` – parallel research tasks
- `deliverable-writer` – document production
- `compound-documenter` – progress documentation
