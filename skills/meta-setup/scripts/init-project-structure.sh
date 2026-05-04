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
# foundation/, research/, planning/, exploration/, psychology/, reviews/, dev/ trees).
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
- exploration/ – bias audit, journey, references, story panels, image manifests | read before prototyping
- psychology/ – psychology audit results | read during design review
- reviews/ – design reviews and assessments | read for quality history
- dev/ – development preparation | read before dev phase

## prototype/ (project root, sibling of design/)
- HTML prototypes (storyboard, prototype, landing page) | read before dev

## Project Root
- .design-engineer-plugin/config.yaml – plugin config and resume state | read by /product:launch
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

# ─────────────────────────────────────────────
# Curate .gitignore (idempotent — won't duplicate the block on re-run)
# ─────────────────────────────────────────────
# Adds a fenced "Design Engineer Plugin" block to the project's .gitignore
# covering disposable working artifacts the plugin creates during a session.
# Without this block, a long feature implementation can leave 100+ files in
# the working tree (Playwright debug captures dumped to root before the
# de-playwright-path-hook landed in v5.2.0, test-results/, the active-
# workflow marker, scratch dir). Idempotent via the BEGIN/END fence so
# re-running this script doesn't duplicate the block.

GITIGNORE_FILE=".gitignore"
GITIGNORE_BEGIN="# === BEGIN design-engineer-plugin ==="
GITIGNORE_END="# === END design-engineer-plugin ==="

if [ -f "$GITIGNORE_FILE" ] && grep -qF "$GITIGNORE_BEGIN" "$GITIGNORE_FILE"; then
  echo ""
  echo "[EXISTS] .gitignore already has the design-engineer-plugin block -- skipping"
else
  # Ensure trailing newline before appending
  if [ -f "$GITIGNORE_FILE" ] && [ -n "$(tail -c 1 "$GITIGNORE_FILE")" ]; then
    echo "" >> "$GITIGNORE_FILE"
  fi
  cat >> "$GITIGNORE_FILE" <<GITIGNORE
$GITIGNORE_BEGIN
# Disposable working artifacts the plugin creates during a session.
# Stack-agnostic — only includes paths the plugin itself guarantees to
# write. Framework-specific outputs (test reports, build caches, native
# build artifacts, etc.) are the user's responsibility to add to their
# own .gitignore — outside this fenced block — since they vary by stack.

# Universal scratch directory for any throwaway working file (Playwright
# debug captures, intermediate analysis dumps, exploratory comparisons,
# anything the model would discard tomorrow). Skills and hooks must put
# transient artifacts here, NOT under design/<subdir>/.
$DELIVERABLES_PATH/.scratch/

# Active-workflow marker (process-recall hook gate; per-session state).
.design-engineer-plugin/.active-workflow
$GITIGNORE_END
GITIGNORE
  if [ -f "$GITIGNORE_FILE" ]; then
    echo ""
    echo "[UPDATED] .gitignore -- appended design-engineer-plugin block"
  else
    echo ""
    echo "[CREATED] .gitignore -- with design-engineer-plugin block"
  fi
fi

# ─────────────────────────────────────────────
# Create the universal scratch directory (git-ignored per .gitignore above)
# ─────────────────────────────────────────────
mkdir -p "$DELIVERABLES_PATH/.scratch"
echo "[CREATED] $DELIVERABLES_PATH/.scratch/ -- universal scratch (git-ignored)"

echo ""
echo "=== Scaffolding Complete ==="
echo ""
echo "Structural directories created:"
echo "  .design-engineer-plugin/   Plugin state, dependency graph, memory"
echo "  .design-engineer-plugin/memory/   project-map.md, debug-solutions.md"
echo "  plans/                     Implementation plans"
echo "  plans/archive/             Completed plans"
echo "  prototype/                 HTML prototypes"
echo "  $DELIVERABLES_PATH/.scratch/      Universal scratch (git-ignored)"
echo ""
echo ".gitignore curated with disposable-artifact patterns."
echo ""
echo "Lazy directories ($DELIVERABLES_PATH/<subdir>): created by skills on first write."
echo "  Examples: $DELIVERABLES_PATH/foundation/, $DELIVERABLES_PATH/research/, $DELIVERABLES_PATH/planning/,"
echo "            $DELIVERABLES_PATH/exploration/, $DELIVERABLES_PATH/psychology/, $DELIVERABLES_PATH/reviews/, $DELIVERABLES_PATH/dev/"
