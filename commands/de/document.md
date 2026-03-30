---
name: de:document
description: Document decisions, learnings, project state, and stakeholder communication for cross-session continuity.
argument-hint: "[status | stakeholder]"
---

# Project Documentation

## Context

<context> #$ARGUMENTS </context>

Documents decisions, learnings, and project state. Ensures context survives across sessions and team handoffs.

## Step 1: Read project context

1. Read `.design-engineer.yaml` for mode and project state
2. Scan existing deliverables in `docs/design/`
3. Check what has changed recently (git status if available)

## Step 2: Determine what to document

If arguments contain "status", show current project status and recent changes directly.

If arguments contain "stakeholder", jump to stakeholder communication directly.

Otherwise, present what makes sense based on context:

```
question: "What would you like to document?"
header: "Document"
options:
  - label: "What I did today"
    description: "Save this session's work – what changed, what was created, what's next"
  - label: "A decision I made"
    description: "Record a decision and why – so future you (or your team) understands the reasoning"
  - label: "Where things stand"
    description: "See the full project status – what's done, what's in progress, what's next"
  - label: "Explain to my team"
    description: "Frame decisions and trade-offs for non-design audiences"
```

## Step 3: Execute

Load the `meta-document` skill and follow the selected path.

In **Guided mode**: present a draft, ask for review, then save.
In **God mode**: execute and save, show summary.

## Step 4: Confirm

After documenting, confirm what was saved and where. Show a brief summary of the project's current state.
