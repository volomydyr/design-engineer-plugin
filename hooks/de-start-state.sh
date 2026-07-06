#!/usr/bin/env bash
# Inject onboarding or returning-project context for /design-engineer:launch.
# ALWAYS injects DESIGN_ENGINEER_PLUGIN_ROOT for reference file resolution.
# Three cases:
#   1. No config → inject minimal markers (plugin root + new_to_plugin state),
#      but ONLY when the prompt mentions /design-engineer; otherwise exit 0
#      silently so unrelated repos get zero per-prompt noise.
#      The full onboarding sequence lives in commands/launch.md
#      so it loads only when the user invokes /design-engineer:launch, not on
#      every prompt in unrelated repos.
#   2. Config with project_type: existing → inject existing-project context + plugin root
#   3. Config with project_type: new → inject plugin root only

# Resolve plugin root from this script's location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

CONFIG=".design-engineer-plugin/config.yaml"

if [ ! -f "$CONFIG" ]; then
  # Case 1: No config – minimal markers only, and only when the prompt
  # mentions the plugin. The bare "/design-engineer" substring covers all
  # namespaced commands. Otherwise exit 0 silently so every prompt in an
  # unrelated repo stays free of plugin markers. The /design-engineer:launch
  # command body picks up DESIGN_ENGINEER_PROJECT_STATE and runs the full
  # onboarding flow when invoked.
  INPUT="$(cat 2>/dev/null || true)"
  case "$INPUT" in
    *"/design-engineer"*)
      cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: new_to_plugin"}}
HOOK_EOF
      ;;
    *)
      exit 0
      ;;
  esac

elif grep -q "project_type: existing" "$CONFIG" 2>/dev/null; then
  # Case 2: Config exists with project_type: existing – minimal markers only.
  # The full goal-routing AskUserQuestion lives in commands/launch.md
  # Step 0 (re-detect from disk). The hook used to inject the AskUserQuestion text
  # here too, but that duplicated the command body and drifted out of sync (e.g.
  # "Set up development" stayed in the hook after start.md was renamed to "Prepare
  # project for AI coding"). The hook now ONLY emits markers; the command body is
  # the single source of truth for the question text.
  cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: existing_project"}}
HOOK_EOF

else
  # Case 3: Config exists with project_type: new – inject plugin root + resume state
  # The state distinguishes "returning user with active pipeline state" vs
  # "returning user without resume state" so /design-engineer:launch can route to the right
  # path in meta-setup. Detection logic mirrors commands/launch.md Step 0 (the disk
  # read there is the source of truth).
  # Completion branch (additive, fail-safe): a plugin-built project whose from-scratch
  # pipeline finished writes "status: complete". Route it into the iterate flow via
  # returning_complete instead of the returning_* paths. Absence of "status: complete"
  # falls through to the resume check unchanged.
  if grep -q "^status: complete" "$CONFIG" 2>/dev/null; then
    STATE="returning_complete"
  elif grep -q "^resume:" "$CONFIG" 2>/dev/null; then
    STATE="returning_with_resume"
  else
    STATE="returning_no_resume"
  fi
  cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: $STATE"}}
HOOK_EOF
fi
