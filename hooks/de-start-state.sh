#!/usr/bin/env bash
# Inject project state + first-action directive for /de:start routing.
# Only outputs when .design-engineer.yaml does NOT exist (new-to-plugin case).
# In configured projects, stays silent (exits with no output).
# Output format: JSON with hookSpecificOutput.additionalContext

CONFIG=".design-engineer.yaml"

# Only inject state for unconfigured projects — configured projects route correctly
if [ ! -f "$CONFIG" ]; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin\n\nFIRST ACTION REQUIRED: When /de:start runs, your first output must be an AskUserQuestion call with exactly these parameters — no text before it, no greeting, no project summary, no memory:\n\nquestion: \"Welcome to Design Engineer. What brings you here?\"\nheader: \"Project Type\"\noptions:\n  - label: \"New product idea\"\n    description: \"Starting from scratch – I have an idea or a problem I want to solve\"\n  - label: \"Existing project\"\n    description: \"I already have a product, codebase, or designs – I want to improve, review, or add features\""}}
EOF
fi
