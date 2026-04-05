#!/usr/bin/env python3
"""PostToolUse hook: check dependency graph after deliverable edits."""

import json
import os
import sys
import re
from datetime import datetime, timedelta

# Only active in projects that have run /de:start
if not os.path.isfile('.design-engineer-plugin/config.yaml'):
    sys.exit(0)


def parse_simple_yaml(text):
    """Minimal YAML parser for the dependencies file structure."""
    deliverables = {}
    current = None
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        # Top-level key under deliverables:
        indent = len(line) - len(line.lstrip())
        if indent == 2 and stripped.endswith(":") and not stripped.startswith("-"):
            current = stripped[:-1]
            deliverables[current] = {"informs": [], "folder": "", "last_updated": ""}
        elif current and indent == 4:
            m = re.match(r"(\w[\w-]*):\s*(.*)", stripped)
            if m:
                key, val = m.group(1), m.group(2)
                if key == "informs":
                    if val and val != "[]":
                        deliverables[current]["informs"] = [
                            v.strip().strip("'\"") for v in val.strip("[]").split(",")
                        ]
                    else:
                        deliverables[current]["informs"] = []
                elif key == "folder":
                    deliverables[current]["folder"] = val.strip()
                elif key == "last_updated":
                    deliverables[current]["last_updated"] = val.strip().strip("'\"")
        elif current and indent == 6 and stripped.startswith("- "):
            val = stripped[2:].strip().strip("'\"")
            if "informs" in deliverables.get(current, {}):
                deliverables[current]["informs"].append(val)
    return deliverables


def find_deliverable_key(filepath, deliverables):
    """Match a file path to a deliverable key based on filename."""
    basename = os.path.splitext(os.path.basename(filepath))[0].lower()
    if basename in deliverables:
        return basename
    # Try matching with common transformations
    normalized = basename.replace("_", "-")
    if normalized in deliverables:
        return normalized
    return None


def find_project_root(filepath):
    """Walk up from filepath looking for .design-engineer-plugin/dependencies.yaml."""
    normalized = filepath.replace("\\", "/")
    directory = os.path.dirname(normalized)
    while directory and directory != os.path.dirname(directory):
        deps_path = os.path.join(directory, ".design-engineer-plugin", "dependencies.yaml")
        if os.path.isfile(deps_path):
            return directory, deps_path
        directory = os.path.dirname(directory)
    return None, None


def check_staleness(filepath, key, deliverables):
    """Check if a research deliverable is stale (>90 days old)."""
    normalized = filepath.replace("\\", "/")
    if "/research/" not in normalized:
        return None
    last_updated = deliverables.get(key, {}).get("last_updated", "")
    if not last_updated:
        return None
    try:
        updated_date = datetime.strptime(last_updated, "%Y-%m-%d")
        if datetime.now() - updated_date > timedelta(days=90):
            return last_updated
    except ValueError:
        pass
    return None


def main():
    try:
        hook_input = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, ValueError):
        return

    tool_input = hook_input.get("tool_input", {})
    filepath = tool_input.get("file_path") or tool_input.get("path", "")
    if not filepath:
        return

    # Find project root by looking for .design-engineer-plugin/dependencies.yaml
    project_root, deps_path = find_project_root(filepath)
    if not project_root or not deps_path:
        return

    try:
        with open(deps_path, "r") as f:
            content = f.read()
    except OSError:
        return

    deliverables = parse_simple_yaml(content)
    key = find_deliverable_key(filepath, deliverables)
    if not key:
        return

    downstream = deliverables.get(key, {}).get("informs", [])
    if not downstream:
        return

    items = ", ".join(downstream)
    print(f"Updated '{key}'. Downstream dependents that may need review: {items}")

    # Check staleness for research deliverables
    stale_date = check_staleness(filepath, key, deliverables)
    if stale_date:
        print(f"Note: This research was last updated on {stale_date} (more than 90 days ago). Consider re-running it for current data.")


if __name__ == "__main__":
    main()
