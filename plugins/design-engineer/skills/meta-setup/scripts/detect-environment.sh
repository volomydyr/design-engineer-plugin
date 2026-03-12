#!/usr/bin/env bash
# detect-environment.sh
# Checks for installed plugins and MCPs, available tools, and project state.
# Outputs a structured summary for the meta-setup skill.

set -euo pipefail

echo "=== Design-Engineer Environment Detection ==="
echo ""

# ─────────────────────────────────────────────
# 1. Plugin & MCP Detection
# ─────────────────────────────────────────────
echo "--- Plugin & MCP Detection ---"

PLUGINS_FOUND=()
PLUGINS_MISSING=()
MCPS_FOUND=()
MCPS_MISSING=()

# Helper: search across all MCP/settings config files
CONFIG_FILES=(~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json)

config_contains() {
  grep -rql -iE "$1" "${CONFIG_FILES[@]}" 2>/dev/null
}

# Read enabledPlugins from ~/.claude/settings.json
ENABLED_PLUGINS=""
if [ -f ~/.claude/settings.json ]; then
  ENABLED_PLUGINS=$(python3 -c "
import json, sys
try:
    with open('$HOME/.claude/settings.json') as f:
        data = json.load(f)
    plugins = data.get('enabledPlugins', [])
    print(' '.join(plugins))
except Exception:
    pass
" 2>/dev/null || true)
fi

# Check for Context7 plugin
if echo "$ENABLED_PLUGINS" | grep -qi "context7" 2>/dev/null || config_contains "context7"; then
  PLUGINS_FOUND+=("Context7")
  echo "[FOUND] Context7 plugin -- up-to-date technical documentation"
else
  PLUGINS_MISSING+=("Context7")
  echo "[MISSING] Context7 plugin -- up-to-date technical documentation"
fi

# Check for Figma plugin (official)
if echo "$ENABLED_PLUGINS" | grep -qi "figma" 2>/dev/null && ! echo "$ENABLED_PLUGINS" | grep -qi "figma-console" 2>/dev/null; then
  PLUGINS_FOUND+=("Figma")
  echo "[FOUND] Figma plugin -- design data from Figma Dev Mode"
elif config_contains "(figma_mcp|figma-mcp|@figma|figma.*dev.mode)"; then
  PLUGINS_FOUND+=("Figma")
  echo "[FOUND] Figma plugin -- design data from Figma Dev Mode"
else
  PLUGINS_MISSING+=("Figma")
  echo "[MISSING] Figma plugin -- design data from Figma Dev Mode"
fi

# Check for Playwright plugin
if echo "$ENABLED_PLUGINS" | grep -qi "playwright" 2>/dev/null || config_contains "playwright"; then
  PLUGINS_FOUND+=("Playwright")
  echo "[FOUND] Playwright plugin -- browser testing and visual review"
else
  PLUGINS_MISSING+=("Playwright")
  echo "[MISSING] Playwright plugin -- browser testing and visual review"
fi

# Check for Figma Console MCP (standalone MCP server, not a plugin)
if config_contains "figma.console|figma-console|southleft"; then
  MCPS_FOUND+=("Figma Console")
  echo "[FOUND] Figma Console MCP -- perform actions in Figma directly"
else
  MCPS_MISSING+=("Figma Console")
  echo "[MISSING] Figma Console MCP -- perform actions in Figma directly"
fi

echo ""

# ─────────────────────────────────────────────
# 2. Project State Detection
# ─────────────────────────────────────────────
echo "--- Project State ---"

# Check git initialization
if [ -d ".git" ]; then
  echo "[FOUND] Git repository initialized"
else
  echo "[MISSING] Git repository -- not initialized"
fi

# Check for existing CLAUDE.md
if [ -f "CLAUDE.md" ]; then
  echo "[FOUND] CLAUDE.md exists in project root"
else
  echo "[MISSING] CLAUDE.md -- no global rules file"
fi

# Check for existing design-engineer config
if [ -f ".design-engineer.yaml" ]; then
  echo "[FOUND] .design-engineer.yaml -- plugin already configured"
else
  echo "[MISSING] .design-engineer.yaml -- plugin not yet configured"
fi

# Check for existing deliverables folder
if [ -d "docs/design" ]; then
  echo "[FOUND] docs/design/ folder exists"
  # Count existing deliverables
  FILE_COUNT=$(find docs/design -type f -not -name ".gitkeep" -not -name ".dependencies.yaml" -not -name ".DS_Store" 2>/dev/null | wc -l | tr -d ' ')
  echo "        Contains $FILE_COUNT deliverable file(s)"
else
  echo "[MISSING] docs/design/ -- no deliverables folder"
fi

# Check for existing source code (indicators of development progress)
HAS_CODE=false
if [ -f "package.json" ] || [ -f "Gemfile" ] || [ -f "pyproject.toml" ] || [ -f "requirements.txt" ] || [ -f "tsconfig.json" ] || [ -f "Cargo.toml" ] || [ -f "go.mod" ] || [ -d "*.xcodeproj" ] || ls *.xcodeproj 1>/dev/null 2>&1; then
  HAS_CODE=true
  echo "[FOUND] Source code detected -- development appears to have started"
else
  echo "[INFO] No source code detected -- appears to be a new project"
fi

# Check for existing package/dependency files to detect tech stack
echo ""
echo "--- Tech Stack Detection ---"
if [ -f "Package.swift" ] || ls *.xcodeproj 1>/dev/null 2>&1; then
  echo "[DETECTED] iOS / Swift / SwiftUI project"
elif [ -f "tsconfig.json" ]; then
  echo "[DETECTED] TypeScript project"
elif [ -f "package.json" ]; then
  echo "[DETECTED] JavaScript / Node.js project"
elif [ -f "Gemfile" ] && [ -f "config/routes.rb" ]; then
  echo "[DETECTED] Ruby on Rails project"
elif [ -f "Gemfile" ]; then
  echo "[DETECTED] Ruby project"
elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  echo "[DETECTED] Python project"
elif [ -f "Cargo.toml" ]; then
  echo "[DETECTED] Rust project"
elif [ -f "go.mod" ]; then
  echo "[DETECTED] Go project"
else
  echo "[INFO] No specific tech stack detected"
fi

echo ""

# ─────────────────────────────────────────────
# 3. Summary
# ─────────────────────────────────────────────
echo "--- Summary ---"
echo "Plugins found:  ${PLUGINS_FOUND[*]:-none}"
echo "Plugins missing: ${PLUGINS_MISSING[*]:-none}"
echo "MCPs found:     ${MCPS_FOUND[*]:-none}"
echo "MCPs missing:   ${MCPS_MISSING[*]:-none}"
echo "Git:            $([ -d '.git' ] && echo 'yes' || echo 'no')"
echo "CLAUDE.md:      $([ -f 'CLAUDE.md' ] && echo 'yes' || echo 'no')"
echo "Config:         $([ -f '.design-engineer.yaml' ] && echo 'yes' || echo 'no')"
echo "Deliverables:   $([ -d 'docs/design' ] && echo 'yes' || echo 'no')"
echo "Source code:    $HAS_CODE"
echo ""
echo "=== Detection Complete ==="
