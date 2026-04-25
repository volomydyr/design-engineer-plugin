#!/usr/bin/env python3
"""Stop hook: print a session-end reminder to capture progress.

Previously this hook tried to detect "deliverables updated this session" by
checking `last_updated` timestamps in dependencies.yaml. But nothing in the
plugin ever wrote those timestamps, so the detection was always empty and the
"stale dependents" claim was fiction. v2.6.0 removed that machinery.

This hook now prints a simple reminder: run /de:document if work happened
this session, so the compound-documenter agent can update its project-local
agent-memory at .claude/agent-memory/compound-documenter/.
"""

import os
import sys

# Only active in projects that have run /de:start
if not os.path.isfile('.design-engineer-plugin/config.yaml'):
    sys.exit(0)


def main():
    """Print a session-end reminder. No false claims about "updated" deliverables."""
    print("--- Session ended ---")
    print("If you completed any work this session, run /de:document to update")
    print("the compound-documenter agent's memory at:")
    print("  .claude/agent-memory/compound-documenter/")
    print("This keeps your pipeline-state, key decisions, and stale-dependents")
    print("file fresh so future sessions can pick up where you left off.")
    print("---")


if __name__ == "__main__":
    main()
