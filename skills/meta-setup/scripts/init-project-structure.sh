#!/usr/bin/env bash
# init-project-structure.sh
# Creates the standardized deliverables folder structure for the design-engineer plugin.
# Usage: ./init-project-structure.sh [deliverables_path]
# Default path: documents/design

set -euo pipefail

DELIVERABLES_PATH="${1:-documents/design}"

echo "=== Scaffolding Design-Engineer Deliverables ==="
echo "Path: $DELIVERABLES_PATH"
echo ""

# ─────────────────────────────────────────────
# Create subdirectories
# ─────────────────────────────────────────────

# foundation/ -- Core product definition deliverables
# Contains: Problem Statement, Target Audience, Assumptions,
#           StoryBrand canvas, Business Plan
mkdir -p "$DELIVERABLES_PATH/foundation"
touch "$DELIVERABLES_PATH/foundation/.gitkeep"
echo "[CREATED] foundation/ -- core product definition"

# research/ -- Research findings and competitive analysis
# Contains: Competitor Analysis, User Interview findings
mkdir -p "$DELIVERABLES_PATH/research"
touch "$DELIVERABLES_PATH/research/.gitkeep"
echo "[CREATED] research/ -- research findings and analysis"

# research/archive/ -- Timestamped old research
# When research is re-run, old version moves here with a timestamp
mkdir -p "$DELIVERABLES_PATH/research/archive"
touch "$DELIVERABLES_PATH/research/archive/.gitkeep"
echo "[CREATED] research/archive/ -- archived research versions"

# planning/ -- Product planning deliverables
# Contains: MVP Requirements, Information Architecture
mkdir -p "$DELIVERABLES_PATH/planning"
touch "$DELIVERABLES_PATH/planning/.gitkeep"
echo "[CREATED] planning/ -- MVP requirements, information architecture"

# design/ -- Design-specific deliverables
# Contains: Bias audit, journey map, ethics review, behavior map,
#           design references, Figma workflow notes
mkdir -p "$DELIVERABLES_PATH/design"
touch "$DELIVERABLES_PATH/design/.gitkeep"
echo "[CREATED] design/ -- design deliverables"

# design/references/ -- UI reference images from the user
mkdir -p "$DELIVERABLES_PATH/design/references"
touch "$DELIVERABLES_PATH/design/references/.gitkeep"
echo "[CREATED] design/references/ -- UI reference images"

# design/story-panels/ -- Story panel images and scripts
# One subfolder per panel: story-panels/[name]/script.md + panel.png
mkdir -p "$DELIVERABLES_PATH/design/story-panels"
touch "$DELIVERABLES_PATH/design/story-panels/.gitkeep"
echo "[CREATED] design/story-panels/ -- story panel images and scripts"

# prototype/ -- HTML prototypes
# Contains: storyboard.html, prototype.html, landing-page.html, prototype-notes.md
mkdir -p "$DELIVERABLES_PATH/prototype"
touch "$DELIVERABLES_PATH/prototype/.gitkeep"
echo "[CREATED] prototype/ -- HTML prototypes"

# psych/ -- Psychology audit results and principle applications
mkdir -p "$DELIVERABLES_PATH/psych"
touch "$DELIVERABLES_PATH/psych/.gitkeep"
echo "[CREATED] psych/ -- psychology audit results"

# reviews/ -- Design reviews and assessments
# Contains: Visual review, accessibility review, product assessment
mkdir -p "$DELIVERABLES_PATH/reviews"
touch "$DELIVERABLES_PATH/reviews/.gitkeep"
echo "[CREATED] reviews/ -- design reviews and assessments"

# dev/ -- Development preparation deliverables
# Contains: CLAUDE.md draft, kickstart prompts, agent configurations,
#           MCP notes, GitHub workflow documentation, status tracking
mkdir -p "$DELIVERABLES_PATH/dev"
touch "$DELIVERABLES_PATH/dev/.gitkeep"
echo "[CREATED] dev/ -- development preparation"

# ─────────────────────────────────────────────
# Initialize dependency tracking
# ─────────────────────────────────────────────

# Dependencies go in .design-engineer-plugin/ (technical, not deliverables)
mkdir -p ".design-engineer-plugin"
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
mkdir -p ".design-engineer-plugin/memory"

PROJECT_MAP_FILE=".design-engineer-plugin/memory/project-map.md"
if [ -f "$PROJECT_MAP_FILE" ]; then
  echo ""
  echo "[EXISTS] memory/project-map.md already exists -- skipping seed"
else
  cat > "$PROJECT_MAP_FILE" << 'MAP'
# Project Map

Living file tree of the project. Format per entry:
`path – description (≤10 words) | when to read`

## documents/design/
- foundation/ – core product definition deliverables | read at pipeline start
- research/ – research findings and analysis | read before positioning
- planning/ – MVP requirements and information architecture | read before design and dev
- design/ – bias audit, journey, references, story panels | read before prototyping
- prototype/ – HTML prototypes (storyboard, prototype, landing page) | read before dev
- psych/ – psychology audit results | read during design review
- reviews/ – design reviews and assessments | read for quality history
- dev/ – development preparation | read before dev phase

## Project Root
- .design-engineer-plugin/config.yaml – plugin config and resume state | read by /de:start
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
echo "Structure created:"
echo "  $DELIVERABLES_PATH/"
echo "  ├── foundation/          Core product definition"
echo "  ├── research/            Research findings and analysis"
echo "  │   └── archive/         Archived research versions"
echo "  ├── planning/            MVP requirements, information architecture"
echo "  ├── design/              Design deliverables"
echo "  │   ├── references/      UI reference images"
echo "  │   └── story-panels/    Story panel images and scripts"
echo "  ├── prototype/           HTML prototypes"
echo "  ├── psych/               Psychology audit results"
echo "  ├── reviews/             Design reviews and assessments"
echo "  └── dev/                 Development preparation"
echo ""
echo "  plans/                   Implementation plans"
echo "  plans/archive/           Completed plans"
