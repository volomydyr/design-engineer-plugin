#!/usr/bin/env bash
# Inject project state for /de:start routing.
# Only outputs when .design-engineer.yaml does NOT exist (new-to-plugin case).
# In configured projects, stays silent.

CONFIG=".design-engineer.yaml"

# Only inject state for unconfigured projects — configured projects route correctly
if [ ! -f "$CONFIG" ]; then
  echo "DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin"
  echo "This project has never used the Design Engineer plugin."
  echo "When /de:start runs, follow Path B exactly as written — no personalization, no memory references."
fi
