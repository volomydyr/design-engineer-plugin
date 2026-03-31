#!/usr/bin/env bash
# Detect project state for /de:start routing.
# Outputs exactly one line: STATE=<value>
#
# Values:
#   returning_with_resume  – .design-engineer-plugin/config.yaml exists and has a resume: section
#   returning_no_resume    – .design-engineer-plugin/config.yaml exists but no resume: section
#   new_to_plugin          – no .design-engineer-plugin/config.yaml found

CONFIG_FILE=".design-engineer-plugin/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "STATE=new_to_plugin"
    exit 0
fi

if grep -q "^resume:" "$CONFIG_FILE" 2>/dev/null; then
    echo "STATE=returning_with_resume"
else
    echo "STATE=returning_no_resume"
fi
