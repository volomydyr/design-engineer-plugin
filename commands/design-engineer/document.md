---
name: design-engineer:document
description: Document decisions, learnings, project state, and stakeholder communication for cross-session continuity.
argument-hint: "[status | stakeholder]"
---

# Project Documentation

## Context

<context> #$ARGUMENTS </context>

Documents decisions, learnings, and project state. Ensures context survives across sessions and team handoffs.

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for mode and project state
2. Scan existing deliverables in `design/`
3. Check what has changed recently (git status if available)

## Step 2: Determine what to document

If arguments contain "status", show current project status and recent changes directly.

If arguments contain "stakeholder", jump to stakeholder communication directly.

Otherwise, present what makes sense based on context:

```
question: "What would you like to document?"
header: "Document"
options:
  - label: "This session's progress"
    description: "Save this session's work – what changed, what was created, what's next"
  - label: "Record a decision"
    description: "Record a decision and why – so future you (or your team) understands the reasoning"
  - label: "Project status"
    description: "See the full project status – what's done, what's in progress, what's next"
  - label: "Stakeholder summary"
    description: "Frame decisions and trade-offs for non-design audiences"
```

## Step 3: Execute

Load the `meta-document` skill and follow the selected path.

In **Guided mode**: present a draft, ask for review, then save.
In **Autopilot**: execute and save, show summary.

## Step 4: Confirm

After documenting, confirm what was saved and where. Show a brief summary of the project's current state.
