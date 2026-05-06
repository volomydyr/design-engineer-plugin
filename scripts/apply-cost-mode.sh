#!/usr/bin/env bash
# Apply cost-mode frontmatter rewrites to plugin agents + skills.
#
# Reads .design-engineer-plugin/config.yaml from cwd for cost_mode (light | full).
# Walks every entry in $CLAUDE_PLUGIN_ROOT/assets/cost-modes.json and rewrites
# the model: + effort: lines per the manifest. Idempotent — running multiple
# times produces the same result.
#
# Why frontmatter rewrite (not runtime override): per Claude Code docs,
# `model: inherit` is supported only on skills (not agents), and `effort:
# inherit` does not exist. There is no documented runtime override for
# either field. The only mechanism for a true two-mode toggle is to
# physically rewrite the frontmatter when the user picks a mode. The
# manifest declares both `full` and `light` values for every component
# explicitly, so both directions are clean — no backup files needed.
#
# Fail-open on any error. Logs to ~/.claude/cache/de-cost-mode.log.

set -uo pipefail

PROJECT_CONFIG=".design-engineer-plugin/config.yaml"
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-}"
LOG="$HOME/.claude/cache/de-cost-mode.log"

mkdir -p "$(dirname "$LOG")"

log() {
  echo "[$(date '+%Y-%m-%dT%H:%M:%S%z')] $1" >> "$LOG"
}

if [ -z "$PLUGIN_ROOT" ]; then
  log "ERROR no CLAUDE_PLUGIN_ROOT in env"
  exit 0
fi

MANIFEST="$PLUGIN_ROOT/assets/cost-modes.json"
if [ ! -f "$MANIFEST" ]; then
  log "ERROR manifest missing at $MANIFEST"
  exit 0
fi

# Read mode from config; default to "full" if missing or no config
MODE=""
if [ -f "$PROJECT_CONFIG" ]; then
  MODE=$(grep -E '^cost_mode:' "$PROJECT_CONFIG" 2>/dev/null | head -1 | sed 's/cost_mode:[[:space:]]*//' | tr -d '"' | tr -d "'" | tr -d '[:space:]' || echo "")
fi
[ -z "$MODE" ] && MODE="full"

if [ "$MODE" != "light" ] && [ "$MODE" != "full" ]; then
  log "WARN unknown mode='$MODE', defaulting to full"
  MODE="full"
fi

log "APPLY mode=$MODE plugin_root=$PLUGIN_ROOT cwd=$(pwd)"

python3 - "$MANIFEST" "$PLUGIN_ROOT" "$MODE" <<'PY'
import json, os, re, sys

manifest_path, plugin_root, mode = sys.argv[1], sys.argv[2], sys.argv[3]

with open(manifest_path) as f:
    manifest = json.load(f)

changed = 0
total = 0
for category in ('agents', 'skills'):
    for rel_path, modes in manifest.get(category, {}).items():
        target = os.path.join(plugin_root, rel_path)
        if not os.path.exists(target):
            continue
        cfg = modes.get(mode)
        if not cfg:
            continue
        total += 1
        with open(target) as f:
            content = f.read()
        new_content = re.sub(
            r'^model:[ \t]*.+$',
            f'model: {cfg["model"]}',
            content,
            count=1,
            flags=re.M,
        )
        new_content = re.sub(
            r'^effort:[ \t]*.+$',
            f'effort: {cfg["effort"]}',
            new_content,
            count=1,
            flags=re.M,
        )
        if new_content != content:
            with open(target, 'w') as f:
                f.write(new_content)
            changed += 1

print(f'{changed}/{total} files updated', file=sys.stderr)
PY

PY_EXIT=$?
log "DONE mode=$MODE python_exit=$PY_EXIT"
exit 0
