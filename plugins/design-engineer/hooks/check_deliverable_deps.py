#!/usr/bin/env python3
"""PostToolUse hook: check dependency graph after deliverable edits."""

import json
import os
import sys
import re


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
            deliverables[current] = {"informs": [], "folder": ""}
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


def main():
    try:
        hook_input = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, ValueError):
        return

    tool_input = hook_input.get("tool_input", {})
    filepath = tool_input.get("file_path") or tool_input.get("path", "")
    if not filepath:
        return

    # Only act on files in the docs/design/ directory
    if "docs/design/" not in filepath.replace("\\", "/"):
        return

    # Find .dependencies.yaml relative to the docs/design/ root
    design_idx = filepath.replace("\\", "/").index("docs/design/")
    project_root = filepath[:design_idx]
    deps_path = os.path.join(project_root, "docs", "design", ".dependencies.yaml")

    if not os.path.isfile(deps_path):
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


if __name__ == "__main__":
    main()
