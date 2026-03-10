#!/usr/bin/env python3
"""Stop hook: summarize deliverable changes and stale dependents."""

import os
import re
import sys
from datetime import datetime, timedelta, timezone


def parse_dependencies_yaml(text):
    """Minimal YAML parser for the dependencies file structure."""
    deliverables = {}
    current = None
    current_list_key = None
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        if indent == 2 and stripped.endswith(":") and not stripped.startswith("-"):
            current = stripped[:-1]
            deliverables[current] = {"informs": [], "depends_on": [], "last_updated": None}
            current_list_key = None
        elif current and indent == 4:
            m = re.match(r"([\w_-]+):\s*(.*)", stripped)
            if m:
                key, val = m.group(1), m.group(2)
                if key in ("informs", "depends_on"):
                    current_list_key = key
                    if val and val not in ("[]", ""):
                        deliverables[current][key] = [
                            v.strip().strip("'\"") for v in val.strip("[]").split(",")
                        ]
                    else:
                        deliverables[current][key] = []
                elif key == "last_updated":
                    current_list_key = None
                    val = val.strip().strip("'\"")
                    deliverables[current]["last_updated"] = val if val and val != "null" else None
                else:
                    current_list_key = None
                    deliverables[current][key] = val.strip()
        elif current and indent == 6 and stripped.startswith("- "):
            val = stripped[2:].strip().strip("'\"")
            if current_list_key and current_list_key in deliverables.get(current, {}):
                deliverables[current][current_list_key].append(val)
    return deliverables


def is_recent(timestamp_str, hours=12):
    """Check if a timestamp string is within the recent window."""
    if not timestamp_str:
        return False
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(timestamp_str, fmt).replace(tzinfo=timezone.utc)
            return datetime.now(timezone.utc) - dt < timedelta(hours=hours)
        except ValueError:
            continue
    return False


def main():
    # Look for .dependencies.yaml in common locations
    candidates = []
    cwd = os.getcwd()
    candidates.append(os.path.join(cwd, "docs", "design", ".dependencies.yaml"))
    # Walk up to 3 levels looking for docs/design/
    d = cwd
    for _ in range(4):
        candidates.append(os.path.join(d, "docs", "design", ".dependencies.yaml"))
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent

    deps_path = None
    for c in candidates:
        if os.path.isfile(c):
            deps_path = c
            break
    if not deps_path:
        return

    try:
        with open(deps_path, "r") as f:
            content = f.read()
    except OSError:
        return

    deliverables = parse_dependencies_yaml(content)
    if not deliverables:
        return

    updated = [k for k, v in deliverables.items() if is_recent(v.get("last_updated"))]
    if not updated:
        return

    # Collect stale dependents
    stale = set()
    for key in updated:
        for dep in deliverables.get(key, {}).get("informs", []):
            if dep not in updated and dep in deliverables:
                stale.add(dep)

    print("--- Session Dependency Summary ---")
    print(f"Deliverables updated this session: {', '.join(sorted(updated))}")
    if stale:
        print(f"Potentially stale dependents: {', '.join(sorted(stale))}")
        print("Suggested next steps:")
        for s in sorted(stale):
            print(f"  - Review and update '{s}'")
    else:
        print("No downstream dependents need review.")
    print("---")


if __name__ == "__main__":
    main()
