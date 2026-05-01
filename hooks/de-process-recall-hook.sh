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

cat <<'HOOK_EOF'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"PROCESS RECALL CHECK: before responding, ask yourself – is there a process I should be following right now? Sources: CLAUDE.md rules, the active skill/command/agent, what the user established earlier in this conversation.\n\nIf a process IS active: at the very top of your response, list EVERY numbered step of the process, one per line, with a `← current` marker on the active step. The number of steps is whatever the process actually has – 2, 7, 30, 100 – do not invent or omit steps to match an example. The surrounding format (header text, punctuation) is flexible; the LIST is the requirement.\n\nThe forbidden shortcuts are:\n- Summarizing (\"7-step workflow, currently on step 3\") without listing the steps\n- \"Currently between step X and step Y\" shorthand\n- Mentioning the process count without enumerating each step\n- Skipping the list because you have followed this process before in the same session\n- Omitting steps to keep the list short\n- Marking yourself on step N then performing step N+1's actions in the same turn (the marker must match the actual work happening this turn)\n- Assuming any step is already done because you did it earlier in the session (\"docs were fetched two messages ago\", \"I already analyzed this\", etc.) – every run of the process redoes every step from scratch, period. The point of a process is following it every single time. \"Already done earlier\" is forbidden reasoning\n\nIllustrative example for a 4-step process (your actual process may have any number of steps):\n\n1. <step 1 short title>\n2. <step 2 short title>\n3. <step 3 short title> ← current\n4. <step 4 short title>\n\nThen proceed with the current step.\n\nIf NO process is active: respond normally. Do NOT mention process at all – do not say \"no process applies\", do not narrate the check."}}
HOOK_EOF
