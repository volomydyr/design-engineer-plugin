#!/usr/bin/env bash
# Inject a generic metacognitive process-recall nudge on every user prompt.
# Prompts Claude to self-check whether a process is active (CLAUDE.md, the
# active skill/command/agent, or what the user established earlier) and to
# briefly state the active process at the top of its response if one applies.
# When no process is active, Claude must respond normally without mentioning
# anything about process. The nudge is fully generic – it never names a
# specific process, so future processes added to the plugin or stated by
# users automatically benefit.
#
# Suppressed on first-touch installs (no config.yaml yet). Reason: at the
# very first prompt, the plugin injects the onboarding sequence which Claude
# would interpret as "the active process" and enumerate at the top of its
# response – jarring for users who have not yet been introduced to anything.
# Once the user has finished onboarding (config.yaml exists), the recall
# nudge resumes on every subsequent prompt as designed.
#
# Logging (added by issue 9): every successful fire appends a line to
# ~/.claude/cache/de-process-recall.log. Tail this file to debug whether
# the hook is firing when expected and which workflow is active. Log
# writes are silent on failure so they never break the hook.
if [ ! -f ".design-engineer-plugin/config.yaml" ]; then
  exit 0
fi

# Resolve active workflow name from the marker file (written by long
# deterministic workflows – see CLAUDE.md "Process recall mechanism").
# Falls back to "unknown" so the log line is still useful when the marker
# is absent or unreadable. Issue 2 owns the gate that decides whether to
# fire based on this marker; issue 9 just logs whatever the gate lets
# through.
WORKFLOW_NAME="unknown"
if [ -f ".design-engineer-plugin/.active-workflow" ]; then
  WORKFLOW_NAME="$(head -n 1 ".design-engineer-plugin/.active-workflow" 2>/dev/null | tr -d '\r\n' || echo unknown)"
  [ -z "$WORKFLOW_NAME" ] && WORKFLOW_NAME="unknown"
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
#
# Issue 2 owns the gate logic above; this hook reads $WORKFLOW_NAME from
# the .active-workflow marker once issue 2's gate lands. Until then, the
# variable is unset and the body still renders as a humane preamble plus
# the rest of the discipline rules.
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
