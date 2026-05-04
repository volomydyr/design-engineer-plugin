#!/bin/bash
# PostCompact hook: re-inject pipeline state after compaction
# Reads config.yaml resume section and dependencies.yaml status
# so the model has context immediately after compaction.

# Only active in projects that have run /design-engineer:launch
CONFIG=".design-engineer-plugin/config.yaml"
if [ ! -f "$CONFIG" ]; then
  exit 0
fi

# Extract mode and project type from config
MODE=$(grep "^mode:" "$CONFIG" 2>/dev/null | sed 's/.*mode: *//' | tr -d '"')
PROJECT_TYPE=$(grep "^project_type:" "$CONFIG" 2>/dev/null | sed 's/.*project_type: *//' | tr -d '"')

# Pipeline state lives in the compound-documenter agent's memory at
# .claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md (per the documented
# Anthropic memory: project mechanism). Tell the model to read it back after compaction.
AGENT_MEMORY=".claude/agent-memory/design-engineer-compound-documenter/pipeline-state.md"
HAS_AGENT_MEMORY="no"
if [ -f "$AGENT_MEMORY" ]; then
  HAS_AGENT_MEMORY="yes"
fi

# Build context summary
CONTEXT="PIPELINE STATE AFTER COMPACTION:"
CONTEXT="$CONTEXT\n- Mode: ${MODE:-unknown}"
CONTEXT="$CONTEXT\n- Project type: ${PROJECT_TYPE:-unknown}"

if [ "$HAS_AGENT_MEMORY" = "yes" ]; then
  CONTEXT="$CONTEXT\n- Recover detailed state from: $AGENT_MEMORY"
else
  CONTEXT="$CONTEXT\n- No agent-memory pipeline-state.md yet – invoke /design-engineer:document after the next phase to seed it."
fi

CONTEXT="$CONTEXT\n\nRead .design-engineer-plugin/config.yaml for setup state, and the compound-documenter agent memory above for live pipeline progress."

# Output as hook JSON
printf '{"hookSpecificOutput":{"hookEventName":"PostCompact","additionalContext":"%s"}}' "$(echo -e "$CONTEXT" | sed 's/"/\\"/g' | tr '\n' ' ')"
