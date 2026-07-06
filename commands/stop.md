---
description: Save progress and pause. Use when you want to stop mid-activity and come back later. Your progress is saved automatically after completed activities – this command is for pausing mid-activity.
argument-hint: ""
---

# Stop and save progress

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters).

## What this command does

This is an optional safety net for pausing mid-activity. If you've completed a full activity (problem statement, assumptions, etc.), your progress is already saved automatically. Use `/design-engineer:stop` when you're in the middle of an activity and want to pause cleanly.

## Step 1: Read current state

1. Read `.design-engineer-plugin/config.yaml` for the project type, any `status: complete` line, and any existing resume state
2. Read `.design-engineer-plugin/dependencies.yaml` for deliverable status
3. Check the current conversation for any in-progress work (partially drafted deliverables, unanswered questions, ongoing analysis). Note precisely where the activity stands – this is both what Step 3 saves and where the flow picks back up if the user changes their mind in Step 5

## Step 2: Save partial progress

If there is any in-progress work in the current conversation:

1. Save whatever partial content exists to the appropriate deliverable file with a `[DRAFT – IN PROGRESS]` marker at the top
2. Note what was completed and what remains in the file

If no in-progress work exists (the user just wants to stop between activities):

1. Skip this step – automatic saving already handled it

## Step 3: Write the resume block

Write a top-level `resume:` block into `.design-engineer-plugin/config.yaml`. The `resume:` key MUST start at column 0 – state detection greps for `^resume:` (`hooks/de-start-state.sh`), so an indented or nested key is invisible to routing. If a `resume:` block already exists, replace it. Touch nothing else in the config.

Pick the variant that matches the state read in Step 1:

**Pipeline variant** – the from-scratch pipeline is active (`project_type: new` and no `status: complete` line):

```yaml
resume:
  phase: 3
  phase_name: "Product planning"
  last_completed: "ux-mvp-requirements"
  next: "ux-information-architecture"
  saved_at: "2026-07-04T15:30:00Z"
```

**Iterate variant** – the project is in the iterate flow (`project_type: existing`, or `project_type: new` with a `status: complete` line):

```yaml
resume:
  task: "Redesign the settings page header"
  files:
    - "src/components/SettingsHeader.tsx"
  next_action: "Apply the approved spacing change, then verify in the browser"
  saved_at: "2026-07-04T15:30:00Z"
```

The values above are examples – fill in the real session state. `next_action` names the concrete next step to take. `commands/launch.md` reads the iterate variant to offer a "pick up where you left off" option on the next launch.

## Step 4: Suggest compaction

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/compact-template.md` and generate a ready-to-use compact message for the user. Present it:

> "Your progress is saved. If you want to start a fresh session, here's a compact message you can use with `/compact`:"
>
> [generated compact message]

## Step 5: Confirm

Tell the user what was saved and how to resume, matching the variant written in Step 3:

- Pipeline variant: "Saved. You're in Phase [N] ([name]), last finished [the completed step described plainly, e.g. "the MVP requirements step" – never an internal skill name]. Run `/design-engineer:launch` in a new session to pick up where you left off."
- Iterate variant: "Saved. Your paused task – [task] – will be offered when you run `/design-engineer:launch` in a new session."

Then end the chat message with the canonical 3-horizontal-rule spacer and use AskUserQuestion:

```
question: "Anything else before you go?"
header: "Wrap up"
options:
  - label: "That's it"
    description: "I'm done for now"
  - label: "Actually, let me continue"
    description: "I changed my mind – keep going"
multiSelect: false
```

Handle the answer:

- **"That's it"** → end the turn.
- **"Actually, let me continue"** → undo the pause: remove any `[DRAFT – IN PROGRESS]` markers Step 2 added, delete the `resume:` block written in Step 3 (touch nothing else in the config), then pick the activity back up at exactly the point captured in Step 1.
