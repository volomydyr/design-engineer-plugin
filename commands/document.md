---
description: Document decisions, learnings, project state, and stakeholder communication for cross-session continuity.
argument-hint: "[status | stakeholder]"
---

# Project Documentation

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

## Context

<context> #$ARGUMENTS </context>

Documents decisions, learnings, and project state. Ensures context survives across sessions and team handoffs.

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for project state
2. Scan existing deliverables in `.design-engineer-plugin/design/`
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

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions for the selected path. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`.

For the "Stakeholder summary" path, also Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-communicating-decisions/SKILL.md` and follow its instructions inline – it carries the stakeholder framing and communication structure (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`).

Present a draft, ask for review, then save.

## Step 3.5: Optional advisor consult

Before writing the deliverable to disk, an advisor consult is available when the record is consequential or contested – a decision with real trade-offs, a stakeholder summary framing sensitive choices, or anything that felt genuinely uncertain while drafting. This consult is an optional checkpoint. When it would help, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool – plugin skills disable model invocation) with: what's being documented, the framing chosen, anything that felt uncertain or contested, and "I'm about to finalize this as the documented record – any course correction?" Apply the advice or use the reconcile pattern. Skip it on routine session-progress saves, straightforward decision records, and status runs (`status` argument).

## Step 4: Confirm

After documenting, confirm what was saved and where. Show a brief summary of the project's current state.
