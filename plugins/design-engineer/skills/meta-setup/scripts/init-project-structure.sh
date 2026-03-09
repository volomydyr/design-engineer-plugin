#!/usr/bin/env bash
# init-project-structure.sh
# Creates the standardized deliverables folder structure for the design-engineer plugin.
# Usage: ./init-project-structure.sh [deliverables_path]
# Default path: docs/design

set -euo pipefail

DELIVERABLES_PATH="${1:-docs/design}"

echo "=== Scaffolding Design-Engineer Deliverables ==="
echo "Path: $DELIVERABLES_PATH"
echo ""

# ─────────────────────────────────────────────
# Create subdirectories
# ─────────────────────────────────────────────

# foundation/ -- Core product definition deliverables
# Contains: Big Idea, Problem Statement, Target Audience, Assumptions,
#           StoryBrand canvas, Business Plan
mkdir -p "$DELIVERABLES_PATH/foundation"
touch "$DELIVERABLES_PATH/foundation/.gitkeep"
echo "[CREATED] foundation/ -- core product definition"

# research/ -- Research findings and competitive analysis
# Contains: Competitor Analysis, User Interview findings, market research
mkdir -p "$DELIVERABLES_PATH/research"
touch "$DELIVERABLES_PATH/research/.gitkeep"
echo "[CREATED] research/ -- research findings and analysis"

# design/ -- Design-specific deliverables
# Contains: MVP Requirements, Information Architecture, design references,
#           Figma workflow notes, journey maps, B.I.A.S. audits
mkdir -p "$DELIVERABLES_PATH/design"
touch "$DELIVERABLES_PATH/design/.gitkeep"
echo "[CREATED] design/ -- design deliverables (IA, flows, references)"

# psych/ -- Psychology audit results and principle applications
# Contains: Master audit results, section-by-section principle applications,
#           ethics reviews
mkdir -p "$DELIVERABLES_PATH/psych"
touch "$DELIVERABLES_PATH/psych/.gitkeep"
echo "[CREATED] psych/ -- psychology audit results"

# dev/ -- Development preparation deliverables
# Contains: CLAUDE.md draft, kickstart prompts, agent configurations,
#           MCP notes, GitHub workflow documentation
mkdir -p "$DELIVERABLES_PATH/dev"
touch "$DELIVERABLES_PATH/dev/.gitkeep"
echo "[CREATED] dev/ -- development preparation"

# solutions/ -- Compound documentation
# Contains: Solved problems, project status, learnings, context files
# for long-term projects. Critical for context survival across sessions,
# chat compaction, and team handoffs.
mkdir -p "$DELIVERABLES_PATH/solutions"
touch "$DELIVERABLES_PATH/solutions/.gitkeep"
echo "[CREATED] solutions/ -- compound documentation and learnings"

# ─────────────────────────────────────────────
# Initialize dependency tracking
# ─────────────────────────────────────────────

DEPS_FILE="$DELIVERABLES_PATH/.dependencies.yaml"
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

echo ""
echo "=== Scaffolding Complete ==="
echo ""
echo "Structure created:"
echo "  $DELIVERABLES_PATH/"
echo "  ├── foundation/    Core product definition"
echo "  ├── research/      Research findings and analysis"
echo "  ├── design/        Design deliverables (IA, flows, references)"
echo "  ├── psych/         Psychology audit results"
echo "  ├── dev/           Development preparation"
echo "  ├── solutions/     Compound documentation and learnings"
echo "  └── .dependencies.yaml"
