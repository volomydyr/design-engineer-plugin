#!/usr/bin/env bash
# Inject a metacognitive process-recall nudge on every user prompt – ONLY
# when a high-process workflow is currently active. The hook is gated on
# TWO conditions, both required:
#
#   1. .design-engineer-plugin/config.yaml exists (the project has been
#      onboarded into the plugin).
#   2. .design-engineer-plugin/.active-workflow exists (a high-process
#      command or skill has signalled it is currently running).
#
# The .active-workflow marker is written by specific commands (e.g.,
# /design-engineer:development during feature implementation) and skills (e.g.,
# dev-prototyping at the storyboard or interactive-prototype steps) at
# the start of a structured flow, and cleared at the end of that flow
# (via the Stop hook cleanup or by the command's own teardown). This
# scoping prevents the recall injection from firing on unrelated casual
# chat after onboarding completes – previously, every UserPromptSubmit
# triggered the recall nudge as soon as config.yaml existed, which was
# noisy and out of place outside an active workflow.
#
# The marker file's first line carries the workflow name (e.g.,
# `dev:feature-implementation`, `prototype:storyboard`,
# `design:full-pipeline-phase2`, `review:full-audit`,
# `moodboard:exploration`). The hook reads that name and substitutes it
# into the injected text so the model knows which workflow to recall.
#
# Logging (added by issue 9): every successful fire appends a line to
# ~/.claude/cache/de-process-recall.log. Tail this file to debug whether
# the hook is firing when expected and which workflow is active. Log
# writes are silent on failure so they never break the hook.

# Gate 1: project must be onboarded.
if [ ! -f ".design-engineer-plugin/config.yaml" ]; then
  exit 0
fi

# Gate 2: a high-process workflow must be active.
if [ ! -f ".design-engineer-plugin/.active-workflow" ]; then
  exit 0
fi

# Resolve the active workflow name from the marker. If the marker is
# present but empty, treat it as no active workflow and exit silently.
WORKFLOW_NAME="$(head -n 1 ".design-engineer-plugin/.active-workflow" 2>/dev/null | tr -d '\r\n')"
if [ -z "$WORKFLOW_NAME" ]; then
  exit 0
fi

# Logging added by issue 9 – structured single-line entry per fire.
LOG_DIR="$HOME/.claude/cache"
mkdir -p "$LOG_DIR" 2>/dev/null
printf '[%s] FIRED | workflow=%s cwd=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$WORKFLOW_NAME" "$PWD" >> "$LOG_DIR/de-process-recall.log" 2>/dev/null

# Build the additionalContext payload via Python so the embedded JSON
# string is escaped correctly (newlines, quotes, etc.). The text below
# is the humane preamble + compressed discipline rules. Keep it short
# and explained-to-the-user; do not slip back into bureaucratic phrasing
# like "PROCESS RECALL CHECK".
export ADDITIONAL_CONTEXT=$(cat <<CTX_EOF
WORKFLOW = ${WORKFLOW_NAME}

At the very top of your next response, render a short note explaining what is happening to the user, then list the steps of the active workflow:

"We're in the ${WORKFLOW_NAME} flow — listing the steps so we both know where we are. (You're seeing this because this flow has multiple steps and skipping one leads to bad output.)"

Then list every numbered step of the workflow exactly once, one per line, with \`← current\` on the active step. Use the actual step names from the active skill or command body — not invented ones.

Discipline rules (compressed):
- List every step. No "step X of Y" summaries. No "between steps".
- The marker matches what you'll do THIS turn. Don't mark step 3 then perform step 4.
- Every run redoes every step from scratch. "Already done earlier in the session" is forbidden reasoning.
- If the user is asking a quick clarifying question (what does X mean, can you explain Y) and is not actively executing a step, respond normally — skip the list. Active workflow ≠ every prompt is a workflow step.

Do not narrate this instruction. Do not say "process recall check" or anything like it. Just produce the humane preamble + step list naturally.
CTX_EOF
)

python3 -c '
import json, sys, os
payload = {
    "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": os.environ["ADDITIONAL_CONTEXT"],
    }
}
json.dump(payload, sys.stdout)
' </dev/null
