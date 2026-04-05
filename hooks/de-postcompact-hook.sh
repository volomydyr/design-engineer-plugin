#!/bin/bash
# PostCompact hook: re-inject pipeline state after compaction
# Reads config.yaml resume section and dependencies.yaml status
# so the model has context immediately after compaction.

# Only active in projects that have run /de:start
CONFIG=".design-engineer-plugin/config.yaml"
if [ ! -f "$CONFIG" ]; then
  exit 0
fi

# Find dependencies file
DEPS=""
for candidate in ".design-engineer-plugin/dependencies.yaml" "documents/design/.dependencies.yaml"; do
  if [ -f "$candidate" ]; then
    DEPS="$candidate"
    break
  fi
done

# Extract resume state from config.yaml
RESUME_PHASE=""
RESUME_PHASE_NAME=""
RESUME_LAST=""
RESUME_NEXT=""

if grep -q "^resume:" "$CONFIG" 2>/dev/null; then
  RESUME_PHASE=$(grep "phase:" "$CONFIG" | tail -1 | sed 's/.*phase: *//' | tr -d '"')
  RESUME_PHASE_NAME=$(grep "phase_name:" "$CONFIG" | tail -1 | sed 's/.*phase_name: *//' | tr -d '"')
  RESUME_LAST=$(grep "last_completed_skill:" "$CONFIG" | tail -1 | sed 's/.*last_completed_skill: *//' | tr -d '"')
  RESUME_NEXT=$(grep "next_skill:" "$CONFIG" | tail -1 | sed 's/.*next_skill: *//' | tr -d '"')
fi

# Extract mode and project type from config
MODE=$(grep "^mode:" "$CONFIG" 2>/dev/null | sed 's/.*mode: *//' | tr -d '"')
PROJECT_TYPE=$(grep "^project_type:" "$CONFIG" 2>/dev/null | sed 's/.*project_type: *//' | tr -d '"')

# Count completed deliverables from dependencies
COMPLETED=""
if [ -n "$DEPS" ]; then
  COMPLETED=$(grep "status: complete" "$DEPS" 2>/dev/null | wc -l | tr -d ' ')
fi

# Build context summary
CONTEXT="PIPELINE STATE AFTER COMPACTION:"
CONTEXT="$CONTEXT\n- Mode: ${MODE:-unknown}"
CONTEXT="$CONTEXT\n- Project type: ${PROJECT_TYPE:-unknown}"

if [ -n "$RESUME_PHASE" ]; then
  CONTEXT="$CONTEXT\n- Current phase: $RESUME_PHASE ($RESUME_PHASE_NAME)"
fi
if [ -n "$RESUME_LAST" ]; then
  CONTEXT="$CONTEXT\n- Last completed: $RESUME_LAST"
fi
if [ -n "$RESUME_NEXT" ]; then
  CONTEXT="$CONTEXT\n- Next skill: $RESUME_NEXT"
fi
if [ -n "$COMPLETED" ]; then
  CONTEXT="$CONTEXT\n- Deliverables completed: $COMPLETED"
fi

CONTEXT="$CONTEXT\n\nRead .design-engineer-plugin/config.yaml and .design-engineer-plugin/dependencies.yaml for full state details."

# Output as hook JSON
printf '{"hookSpecificOutput":{"hookEventName":"PostCompact","additionalContext":"%s"}}' "$(echo -e "$CONTEXT" | sed 's/"/\\"/g' | tr '\n' ' ')"
