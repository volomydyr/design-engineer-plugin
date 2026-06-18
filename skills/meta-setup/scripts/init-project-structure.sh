#!/usr/bin/env bash
# init-project-structure.sh
#
# Lazy folder scaffolding for v5.5.0+. Everything the plugin produces lives
# under `.design-engineer-plugin/` (one umbrella, clear mental model). Only
# the actual product codebase sits at the project root.
#
# This script creates the structural skeleton:
#   .design-engineer-plugin/
#   ├── memory/                        seeded with project-map.md + debug-solutions.md
#   ├── plans/archive/                 implementation plans + completed-plans archive
#   ├── prototype/                     HTML prototypes (storyboard, prototype, landing-page)
#   ├── temporary/                     gitignored; auto-purged at phase boundaries
#   │   ├── scratch/                   general throwaway
#   │   ├── playwright/                Playwright debug captures
#   │   └── intermediate/              prep work and exploratory drafts
#   ├── config.yaml                    written separately by /design-engineer:launch
#   └── dependencies.yaml              copied from the bundled default template
#
# Lazy directories (created on first skill write):
#   .design-engineer-plugin/design/{foundation,research,planning,exploration,
#                                   psychology,reviews,dev,features}/
#
# .gitignore is curated with a single fenced block that ignores
# `.design-engineer-plugin/temporary/`.
#
# Usage: ./init-project-structure.sh [deliverables_path]
# Default deliverables_path: .design-engineer-plugin/design
# (the parameter is kept for backwards compatibility but is no longer used to
# determine the scratch location — scratch is always under
# `.design-engineer-plugin/temporary/`).

set -euo pipefail

DELIVERABLES_PATH="${1:-.design-engineer-plugin/design}"

echo "=== Scaffolding Design-Engineer Project ==="
echo "Umbrella: .design-engineer-plugin/ (single root for all plugin output)"
echo "Deliverables path (lazy): $DELIVERABLES_PATH (created on-demand by skills)"
echo ""

# ─────────────────────────────────────────────
# Plugin umbrella + structural subdirs
# ─────────────────────────────────────────────
mkdir -p ".design-engineer-plugin"
mkdir -p ".design-engineer-plugin/memory"
mkdir -p ".design-engineer-plugin/plans/archive"
mkdir -p ".design-engineer-plugin/prototype"
mkdir -p ".design-engineer-plugin/temporary/scratch"
mkdir -p ".design-engineer-plugin/temporary/playwright"
mkdir -p ".design-engineer-plugin/temporary/intermediate"
echo "[CREATED] .design-engineer-plugin/ umbrella with memory/, plans/, prototype/, temporary/"

# ─────────────────────────────────────────────
# Initialize dependency tracking
# ─────────────────────────────────────────────

DEPS_FILE=".design-engineer-plugin/dependencies.yaml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_DEPS="$SCRIPT_DIR/../assets/dependencies-default.yaml"

if [ -f "$DEPS_FILE" ]; then
  echo ""
  echo "[EXISTS] .design-engineer-plugin/dependencies.yaml already exists -- skipping initialization"
  echo "         To reset, delete the file and re-run this script."
else
  if [ -f "$DEFAULT_DEPS" ]; then
    cp "$DEFAULT_DEPS" "$DEPS_FILE"
    echo ""
    echo "[CREATED] .design-engineer-plugin/dependencies.yaml -- dependency tracking from default template"
  else
    cat > "$DEPS_FILE" << 'YAML'
# Design-Engineer Dependency Graph
# Tracks deliverables and their relationships.
# Status: not_started | in_progress | complete
# When a deliverable is updated, check downstream dependencies.

deliverables: {}
YAML
    echo ""
    echo "[CREATED] .design-engineer-plugin/dependencies.yaml -- minimal (default template not found)"
  fi
fi

# ─────────────────────────────────────────────
# Seed plugin-local memory directory
# ─────────────────────────────────────────────
# project-map.md and debug-solutions.md live in .design-engineer-plugin/memory/
# (plugin-local, NOT in Claude Code's auto-memory dir). MEMORY.md is owned by
# Claude Code itself (auto-memory) and the plugin does not touch it.
# Pipeline state lives in the compound-documenter agent's project-local memory at
# .claude/agent-memory/design-engineer-compound-documenter/ (Anthropic-managed).

PROJECT_MAP_FILE=".design-engineer-plugin/memory/project-map.md"
if [ -f "$PROJECT_MAP_FILE" ]; then
  echo ""
  echo "[EXISTS] memory/project-map.md already exists -- skipping seed"
else
  cat > "$PROJECT_MAP_FILE" << 'MAP'
# Project Map

Living file tree of the project. Format per entry:
`path – description (≤10 words) | when to read`

Folders under `.design-engineer-plugin/design/` are created on-demand by the
skill that writes its first deliverable there. Add entries below as folders
appear; remove entries if a folder is deleted.

## .design-engineer-plugin/design/ (lazy – populated as skills run)
- foundation/ – core product definition deliverables | read at pipeline start
- research/ – research findings and analysis | read before positioning
- planning/ – MVP requirements and information architecture | read before design and dev
- exploration/ – bias audit, journey, references, story panels, image manifests | read before prototyping
- psychology/ – psychology audit results | read during design review
- reviews/ – design reviews and assessments | read for quality history
- dev/ – development preparation | read before dev phase
- features/ – per-feature spec dirs (post-launch features) | read when iterating

## .design-engineer-plugin/prototype/ (committed; HTML prototypes)
- storyboard.html, prototype.html, landing-page.html, prototype-notes.md | read before dev

## .design-engineer-plugin/plans/ (committed; implementation plans)
- <YYYY-MM-DD>-<slug>.md – active implementation plan | read by hooks
- archive/ – completed plans | reference history

## .design-engineer-plugin/temporary/ (GITIGNORED; auto-purged at phase boundaries)
- scratch/ – general throwaway | safe to delete anytime
- playwright/ – Playwright debug captures | safe to delete anytime
- intermediate/ – prep work + exploratory drafts | safe to delete anytime

## Project Root
- .design-engineer-plugin/config.yaml – plugin config and resume state | read by /design-engineer:launch
- .design-engineer-plugin/dependencies.yaml – deliverable dependency graph | read by hooks automatically
- .claude/agent-memory/design-engineer-compound-documenter/ – cross-session pipeline state (Anthropic-managed) | read for resume context
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
# Curate .gitignore (idempotent — won't duplicate the block on re-run)
# ─────────────────────────────────────────────
# Adds a fenced "Design Engineer Plugin" block to the project's .gitignore
# covering disposable working artifacts the plugin creates during a session.
# Idempotent via the BEGIN/END fence so re-running this script doesn't duplicate
# the block. The block is intentionally minimal — only paths the plugin itself
# guarantees to write. Framework-specific outputs (test reports, build caches,
# native build artifacts) are the user's responsibility outside this block.

GITIGNORE_FILE=".gitignore"
GITIGNORE_BEGIN="# === BEGIN design-engineer-plugin ==="
GITIGNORE_END="# === END design-engineer-plugin ==="

if [ -f "$GITIGNORE_FILE" ] && grep -qF "$GITIGNORE_BEGIN" "$GITIGNORE_FILE"; then
  # Block already present, but it may be the legacy v5.4.x block. Replace it
  # in-place if the contents differ from the current canonical block.
  echo ""
  echo "[EXISTS] .gitignore has the design-engineer-plugin block -- checking for legacy contents"

  # Detect legacy block (referenced design/.scratch/ or DELIVERABLES_PATH).
  if grep -qE "design/\.scratch/|\\$DELIVERABLES_PATH/\.scratch/" "$GITIGNORE_FILE"; then
    echo "[UPDATING] .gitignore block contains legacy paths — rewriting"
    # Use awk to strip the old block, then append the new one.
    awk -v begin="$GITIGNORE_BEGIN" -v end="$GITIGNORE_END" '
      $0 == begin { skip = 1; next }
      $0 == end   { skip = 0; next }
      !skip
    ' "$GITIGNORE_FILE" > "$GITIGNORE_FILE.tmp" && mv "$GITIGNORE_FILE.tmp" "$GITIGNORE_FILE"
  else
    echo "[OK] .gitignore block is current -- skipping"
  fi
fi

if [ ! -f "$GITIGNORE_FILE" ] || ! grep -qF "$GITIGNORE_BEGIN" "$GITIGNORE_FILE"; then
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

# All disposable working files (Playwright debug captures, intermediate
# analysis dumps, exploratory drafts, anything the model would discard
# tomorrow). Auto-purged at phase boundaries by /design-engineer:document, or
# manually by /design-engineer:tidy. Never commit anything from temporary/.
.design-engineer-plugin/temporary/
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
# Final summary
# ─────────────────────────────────────────────
echo ""
echo "=== Scaffolding Complete ==="
echo ""
echo "Structural directories created (under .design-engineer-plugin/):"
echo "  memory/             project-map.md, debug-solutions.md"
echo "  plans/              implementation plans"
echo "  plans/archive/      completed plans"
echo "  prototype/          HTML prototypes"
echo "  temporary/scratch/  general throwaway (gitignored)"
echo "  temporary/playwright/  Playwright debug captures (gitignored)"
echo "  temporary/intermediate/  prep work + drafts (gitignored)"
echo ""
echo ".gitignore curated with disposable-artifact patterns."
echo ""
echo "Lazy directories (.design-engineer-plugin/design/<subdir>/): created by skills on first write."
echo "  Examples: .design-engineer-plugin/design/foundation/, .design-engineer-plugin/design/research/,"
echo "            .design-engineer-plugin/design/planning/, .design-engineer-plugin/design/exploration/,"
echo "            .design-engineer-plugin/design/psychology/, .design-engineer-plugin/design/reviews/,"
echo "            .design-engineer-plugin/design/dev/, .design-engineer-plugin/design/features/"
