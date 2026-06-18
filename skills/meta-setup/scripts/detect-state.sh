#!/usr/bin/env bash
# Detect project state for /design-engineer:launch routing.
# Outputs exactly one line: STATE=<value>
#
# Values:
#   returning_complete     – config exists, project_type is not existing, and has status: complete
#   returning_with_resume  – .design-engineer-plugin/config.yaml exists and has a resume: section
#   returning_no_resume    – .design-engineer-plugin/config.yaml exists but no resume: section
#   new_to_plugin          – no .design-engineer-plugin/config.yaml found

set -euo pipefail

CONFIG_FILE=".design-engineer-plugin/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "STATE=new_to_plugin"
    exit 0
fi

# Completion branch (additive, fail-safe): a plugin-built project (project_type: new,
# i.e. not existing) whose from-scratch pipeline finished writes "status: complete".
# Route it into the iterate flow instead of the returning_* paths. Absence of
# "status: complete" falls through to the existing branches unchanged.
if ! grep -q "^project_type: existing" "$CONFIG_FILE" 2>/dev/null \
    && grep -q "^status: complete" "$CONFIG_FILE" 2>/dev/null; then
    echo "STATE=returning_complete"
    exit 0
fi

if grep -q "^resume:" "$CONFIG_FILE" 2>/dev/null; then
    echo "STATE=returning_with_resume"
else
    echo "STATE=returning_no_resume"
fi
