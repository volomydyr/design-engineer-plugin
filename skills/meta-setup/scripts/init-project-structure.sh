#!/usr/bin/env bash
# init-project-structure.sh
#
# Lazy folder scaffolding: creates ONLY the structurally-required directories
# (`.design-engineer-plugin/` for plugin state and memory, `plans/` and
# `plans/archive/` for implementation plans, `prototype/` for HTML prototypes
# referenced by hooks). Every other folder under `design/` is created
# on-demand by the skill that writes its first deliverable into it – each
# such skill prepends `mkdir -p design/<subdir>` to its Write step.
#
# Why: an init that pre-creates 11 stubbed `.gitkeep`-marked folders confuses
# users on smaller projects (a 1-page landing site doesn't need separate
# foundation/, research/, planning/, craft/, psych/, reviews/, dev/ trees).
# Folders now appear only when a skill actually puts something in them.
#
# Usage: ./init-project-structure.sh [deliverables_path]
# Default path: design

set -euo pipefail

DELIVERABLES_PATH="${1:-design}"

echo "=== Scaffolding Design-Engineer Project ==="
echo "Deliverables path (lazy): $DELIVERABLES_PATH (created on-demand by skills)"
echo ""

# ─────────────────────────────────────────────
# Plugin state directory (always required)
# ─────────────────────────────────────────────
mkdir -p ".design-engineer-plugin"
mkdir -p ".design-engineer-plugin/memory"
echo "[CREATED] .design-engineer-plugin/ -- plugin state and memory"

# ─────────────────────────────────────────────
# prototype/ at PROJECT ROOT (sibling of design/, not under it)
# Kept eager because hooks reference this path directly. Contains:
# storyboard.html, prototype.html, landing-page.html, prototype-notes.md
# ─────────────────────────────────────────────
mkdir -p "prototype"
echo "[CREATED] prototype/ -- HTML prototypes (project root, sibling of $DELIVERABLES_PATH/)"

# ─────────────────────────────────────────────
# Initialize dependency tracking
# ─────────────────────────────────────────────

# Dependencies go in .design-engineer-plugin/ (technical, not deliverables)
DEPS_FILE=".design-engineer-plugin/dependencies.yaml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_DEPS="$SCRIPT_DIR/../assets/dependencies-default.yaml"

if [ -f "$DEPS_FILE" ]; then
  echo ""
  echo "[EXISTS] .dependencies.yaml already exists -- skipping initialization"
  echo "         To reset, delete the file and re-run this script."
else
  if [ -f "$DEFAULT_DEPS" ]; then
    cp "$DEFAULT_DEPS" "$DEPS_FILE"
    echo ""
    echo "[CREATED] .dependencies.yaml -- dependency tracking initialized from default template"
  else
    # Fallback: create a minimal dependencies file if the default template is not found
    cat > "$DEPS_FILE" << 'YAML'
# Design-Engineer Dependency Graph
# Tracks deliverables and their relationships.
# Status: not_started | in_progress | complete
# When a deliverable is updated, check downstream dependencies.

deliverables: {}
YAML
    echo ""
    echo "[CREATED] .dependencies.yaml -- minimal dependency tracking (default template not found)"
  fi
fi

# ─────────────────────────────────────────────
# Seed plugin-local memory directory
# ─────────────────────────────────────────────
# project-map.md and debug-solutions.md live in .design-engineer-plugin/memory/
# (plugin-local, NOT in Claude Code's auto-memory dir). MEMORY.md is owned by
# Claude Code itself (auto-memory) and the plugin does not touch it.

PROJECT_MAP_FILE=".design-engineer-plugin/memory/project-map.md"
if [ -f "$PROJECT_MAP_FILE" ]; then
  echo ""
  echo "[EXISTS] memory/project-map.md already exists -- skipping seed"
else
  cat > "$PROJECT_MAP_FILE" << 'MAP'
# Project Map

Living file tree of the project. Format per entry:
`path – description (≤10 words) | when to read`

Folders under `design/` are created on-demand by the skill that writes its
first deliverable there. Add entries below as folders appear; remove entries
if a folder is deleted.

## design/ (lazy – populated as skills run)
- foundation/ – core product definition deliverables | read at pipeline start
- research/ – research findings and analysis | read before positioning
- planning/ – MVP requirements and information architecture | read before design and dev
- craft/ – bias audit, journey, references, story panels, image manifests | read before prototyping
- psych/ – psychology audit results | read during design review
- reviews/ – design reviews and assessments | read for quality history
- dev/ – development preparation | read before dev phase

## prototype/ (project root, sibling of design/)
- HTML prototypes (storyboard, prototype, landing page) | read before dev

## Project Root
- .design-engineer-plugin/config.yaml – plugin config and resume state | read by /design-engineer:start
- .design-engineer-plugin/dependencies.yaml – deliverable dependency graph | read by hooks automatically
MAP
  echo ""
  echo "[CREATED] memory/project-map.md -- living file tree (skeleton)"
fi

DEBUG_FILE=".design-engineer-plugin/memory/debug-solutions.md"
if [ -f "$DEBUG_FILE" ]; then
  echo "[EXISTS] memory/debug-solutions.md already exists -- skipping seed"
else
  cat > "$DEBUG_FILE" << 'DEBUG'
# Debug Solutions

Hard-won fixes. Read this before attempting fixes for build, deploy, or environment errors.

Each entry: the error, what was tried and failed, what actually fixed it.

(none yet)
DEBUG
  echo "[CREATED] memory/debug-solutions.md -- known fixes log (skeleton)"
fi

# ─────────────────────────────────────────────
# Create plans directory
# ─────────────────────────────────────────────
mkdir -p "plans/archive"
echo ""
echo "[CREATED] plans/ -- implementation plans"
echo "[CREATED] plans/archive/ -- completed plans"

echo ""
echo "=== Scaffolding Complete ==="
echo ""
echo "Structural directories created:"
echo "  .design-engineer-plugin/   Plugin state, dependency graph, memory"
echo "  .design-engineer-plugin/memory/   project-map.md, debug-solutions.md"
echo "  plans/                     Implementation plans"
echo "  plans/archive/             Completed plans"
echo "  prototype/                 HTML prototypes"
echo ""
echo "Lazy directories ($DELIVERABLES_PATH/<subdir>): created by skills on first write."
echo "  Examples: $DELIVERABLES_PATH/foundation/, $DELIVERABLES_PATH/research/, $DELIVERABLES_PATH/planning/,"
echo "            $DELIVERABLES_PATH/craft/, $DELIVERABLES_PATH/psych/, $DELIVERABLES_PATH/reviews/, $DELIVERABLES_PATH/dev/"
