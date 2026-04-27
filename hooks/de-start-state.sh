#!/usr/bin/env bash
# Inject onboarding or returning-project context for /design-engineer:start.
# ALWAYS injects DESIGN_ENGINEER_PLUGIN_ROOT for reference file resolution.
# Three cases:
#   1. No config → inject minimal markers (plugin root + new_to_plugin state).
#      The full onboarding sequence lives in commands/design-engineer/start.md
#      so it loads only when the user invokes /design-engineer:start, not on
#      every prompt in unrelated repos.
#   2. Config with project_type: existing → inject existing-project context + plugin root
#   3. Config with project_type: new → inject plugin root only

# Resolve plugin root from this script's location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

CONFIG=".design-engineer-plugin/config.yaml"

if [ ! -f "$CONFIG" ]; then
  # Case 1: No config – minimal markers only. The /design-engineer:start
  # command body picks up DESIGN_ENGINEER_PROJECT_STATE and runs the full
  # onboarding flow when invoked.
  cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: new_to_plugin"}}
HOOK_EOF

elif grep -q "project_type: existing" "$CONFIG" 2>/dev/null; then
  # Case 2: Config exists with project_type: existing – show capabilities via AskUserQuestion + plugin root
  cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: existing_project\n\nSPACER RULE: immediately before the AskUserQuestion tool call below, emit this exact 3-line spacer block as the last thing in the chat message preceding the call:\n\n───────────────────\n───────────────────\n───────────────────\n\nThe spacer prevents the question panel from overlaying and cutting off your text. No exceptions.\n\nThis project has the Design Engineer Plugin configured as an existing project. When /design-engineer:start runs:\n\n1. Do NOT show returning-pipeline state or resume information.\n2. Present available commands via AskUserQuestion:\n   question=\"What would you like to do?\"\n   header=\"Goal\"\n   options=[{label: \"Review my project\", description: \"Find issues with UX, accessibility, visual quality, or psychology\"}, {label: \"Implement from Figma\", description: \"Turn Figma designs into production code\"}, {label: \"Design a new feature\", description: \"Think through a new feature before building\"}, {label: \"Set up development\", description: \"Configure the AI build pipeline\"}]\n3. After the user answers, load the matching /design-engineer: command directly.\n4. Do NOT mention config files, project types, or detection state.\n5. Do NOT greet the user with the project name or any information from auto-memory. Do not say \"Welcome back\" or reference previous sessions. Just present the AskUserQuestion immediately."}}
HOOK_EOF

else
  # Case 3: Config exists with project_type: new – inject plugin root + resume state
  # The state distinguishes "returning user with active pipeline state" vs
  # "returning user without resume state" so /design-engineer:start can route to the right
  # path in meta-setup. Detection logic mirrors skills/meta-setup/scripts/detect-state.sh.
  if grep -q "^resume:" "$CONFIG" 2>/dev/null; then
    STATE="returning_with_resume"
  else
    STATE="returning_no_resume"
  fi
  cat <<HOOK_EOF
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: $STATE"}}
HOOK_EOF
fi
