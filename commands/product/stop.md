---
name: product:stop
description: Save progress and pause. Use when you want to stop mid-activity and come back later. Your progress is saved automatically after completed activities – this command is for pausing mid-activity.
argument-hint: ""
---

# Stop and save progress

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters).

## What this command does

This is an optional safety net for pausing mid-activity. If you've completed a full activity (problem statement, assumptions, etc.), your progress is already saved automatically. Use `/product:stop` when you're in the middle of an activity and want to pause cleanly.

## Step 1: Read current state

1. Read `.design-engineer-plugin/config.yaml` for current phase, mode, and resume state
2. Read `.design-engineer-plugin/dependencies.yaml` for deliverable status
3. Check the current conversation for any in-progress work (partially drafted deliverables, unanswered questions, ongoing analysis)

## Step 2: Save partial progress

If there is any in-progress work in the current conversation:

1. Save whatever partial content exists to the appropriate deliverable file with a `[DRAFT – IN PROGRESS]` marker at the top
2. Note what was completed and what remains in the file

If no in-progress work exists (the user just wants to stop between activities):

1. Skip this step – automatic saving already handled it

## Step 3: Update config

Update `.design-engineer-plugin/config.yaml` with the current resume state:
- Current phase and phase name
- Last completed skill
- Next skill (what to resume with)
- Timestamp

## Step 4: Suggest compaction

Read `skills/shared-references/compact-template.md` and generate a ready-to-use compact message for the user. Present it:

> "Your progress is saved. If you want to start a fresh session, here's a compact message you can use with `/compact`:"
>
> [generated compact message]

## Step 5: Confirm

Tell the user what was saved, where they are in the pipeline, and how to resume:

> "Saved. You're in Phase [N] ([name]), last completed [skill]. Run `/product:launch` in a new session to pick up where you left off."

Use AskUserQuestion:

```
question: "Anything else before you go?"
header: "Wrap up"
options:
  - label: "That's it"
    description: "I'm done for now"
  - label: "Actually, let me continue"
    description: "I changed my mind – keep going"
allowMultiSelect: false
```

```
multiSelect: false
```
