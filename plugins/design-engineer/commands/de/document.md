---
name: de:document
description: Document decisions, learnings, project state, and stakeholder communication for cross-session continuity.
argument-hint: "[status | stakeholder]"
---

# Project Documentation

## Context

<context> #$ARGUMENTS </context>

Documents decisions, learnings, and project state. Ensures context survives across sessions, chat compaction, and team handoffs. Can be invoked manually at any time – also auto-triggered by orchestrators after major phases.

## Workflow

### Step 1: Load Compound Skill

Load the `meta-document` skill. It handles the documentation process.

### Step 2: Determine Action

If arguments contain "status", show current project status and recent changes.

If arguments contain "stakeholder", jump directly to option 6 below.

Otherwise, use AskUserQuestion to ask:

**Question:** "What would you like to document?"

1. **Current progress** – Save what has been done in this session
2. **Decision** – Record an important decision and its rationale
3. **Learning** – Document something that worked well or poorly
4. **Project status** – View and update overall project state
5. **Context refresh** – Regenerate the living context file from all deliverables
6. **Prepare stakeholder communication** – Frame decisions, trade-offs, and rationale for non-design audiences

If AskUserQuestion is not available, present options as a numbered list.

### Step 3: Execute

Based on selection:

1. **Current progress** – Scan deliverables modified in the current session, summarize changes, update the project status file and living context
2. **Decision** – Ask what was decided and why, record in a structured format within the project's solutions directory
3. **Learning** – Ask what was learned, categorize (design, development, process), store for future reference
4. **Project status** – Read the current status file, display progress across all phases, highlight what is next
5. **Context refresh** – Read all existing deliverables, regenerate the living context file, verify dependency graph is current
6. **Stakeholder communication** – Load `ux-communicating-decisions` to help frame design decisions, trade-offs, and recommendations for stakeholders (PMs, engineers, executives)

### Step 4: Verify

After documenting, confirm what was saved and where. Show a brief summary of the project's current state.

## Agents Used

- `compound-documenter` – handles structured documentation
