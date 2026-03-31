#!/usr/bin/env python3
"""Stop hook: summarize deliverable changes, stale dependents, and write resume state."""

import os
import re
import sys
from datetime import datetime, timedelta, timezone

# Only active in projects that have run /de:start
if not os.path.isfile('.design-engineer-plugin/config.yaml'):
    sys.exit(0)


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


def find_project_root(start_dir):
    """Walk up from start_dir looking for .design-engineer-plugin/config.yaml."""
    d = start_dir
    for _ in range(6):
        if os.path.isfile(os.path.join(d, ".design-engineer-plugin/config.yaml")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    return None


def find_deps_path(start_dir):
    """Look for .dependencies.yaml in common locations."""
    candidates = []
    d = start_dir
    for _ in range(4):
        candidates.append(os.path.join(d, ".design-engineer-plugin", "dependencies.yaml"))
        candidates.append(os.path.join(d, "documents", "design", ".dependencies.yaml"))
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    for c in candidates:
        if os.path.isfile(c):
            return c
    return None


# Phase name lookup
PHASE_NAMES = {
    "1": "Discovery and Foundation",
    "2": "Strategy and Positioning",
    "3": "Product Planning",
    "4": "Design and Validation",
    "5": "Development",
}


def derive_resume_state(deliverables, updated, stale):
    """Derive phase/skill position from deliverable state."""
    # Find the highest phase with a completed or recently updated deliverable
    current_phase = "1"
    last_completed_skill = None
    next_skill = None

    # Build phase -> deliverables mapping
    phase_deliverables = {}
    for key, val in deliverables.items():
        phase = val.get("phase", "")
        if phase:
            phase_deliverables.setdefault(phase, []).append((key, val))

    # Find the most advanced phase with recent work
    for phase_num in sorted(phase_deliverables.keys()):
        phase_items = phase_deliverables[phase_num]
        has_recent = any(k in updated for k, _ in phase_items)
        if has_recent:
            current_phase = phase_num
            # Find last completed and next pending in this phase
            for key, val in phase_items:
                status = val.get("status", "not_started")
                if status == "complete" or key in updated:
                    last_completed_skill = val.get("skill", key)
                elif status == "not_started" and next_skill is None:
                    next_skill = val.get("skill", key)

    # If no next skill found in current phase, check the next phase
    if next_skill is None:
        next_phase = str(int(current_phase) + 1) if current_phase.isdigit() else None
        if next_phase and next_phase in phase_deliverables:
            for key, val in phase_deliverables[next_phase]:
                if val.get("status", "not_started") == "not_started":
                    next_skill = val.get("skill", key)
                    break

    return current_phase, last_completed_skill, next_skill


def write_resume_state(project_root, deliverables, updated, stale):
    """Write resume section into .design-engineer-plugin/config.yaml."""
    config_path = os.path.join(project_root, ".design-engineer-plugin/config.yaml")
    if not os.path.isfile(config_path):
        return

    current_phase, last_skill, next_skill = derive_resume_state(
        deliverables, updated, stale
    )
    phase_name = PHASE_NAMES.get(current_phase, "Unknown")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # Build the resume YAML block
    lines = [
        "",
        "resume:",
        f'  timestamp: "{now}"',
        f"  phase: {current_phase}",
        f'  phase_name: "{phase_name}"',
    ]
    if last_skill:
        lines.append(f'  last_completed_skill: "{last_skill}"')
    if next_skill:
        lines.append(f'  next_skill: "{next_skill}"')
    if updated:
        lines.append("  deliverables_updated:")
        for u in sorted(updated):
            lines.append(f"    - {u}")
    if stale:
        lines.append("  stale_dependents:")
        for s in sorted(stale):
            lines.append(f"    - {s}")

    resume_block = "\n".join(lines) + "\n"

    # Read existing config, strip any previous resume section, append new one
    try:
        with open(config_path, "r") as f:
            config_text = f.read()
    except OSError:
        return

    # Remove existing resume: section (from "resume:" to next top-level key or EOF)
    config_text = re.sub(
        r"\nresume:\n(?:  [^\n]*\n|    - [^\n]*\n)*", "\n", config_text
    )
    config_text = config_text.rstrip("\n")

    try:
        with open(config_path, "w") as f:
            f.write(config_text + resume_block)
    except OSError:
        pass


def main():
    cwd = os.getcwd()

    # Find dependencies file
    deps_path = find_deps_path(cwd)
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

    # Print dependency summary (original behavior)
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

    # Memory reminder
    print("")
    print("MEMORY: Update auto-memory before session ends:")
    print("- Update project-map.md if any files/folders were created or removed")
    print("- Update MEMORY.md pipeline position if phase/skill progress was made")
    print("- Save to debug-solutions.md if any hard bugs were solved this session")

    # Write resume state to .design-engineer-plugin/config.yaml (if it exists)
    project_root = find_project_root(cwd)
    if project_root:
        write_resume_state(project_root, deliverables, updated, stale)


if __name__ == "__main__":
    main()
