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

# Context7, Figma, and Playwright are bundled with the design-engineer plugin (v4.3.0+).
# We still detect their availability so we can surface accurate status — but the messaging
# now reflects "bundled, runs when prerequisites are present" rather than "needs install".

# Context7 -- bundled, no prereq
PLUGINS_FOUND+=("Context7")
echo "[BUNDLED] Context7 -- up-to-date technical documentation (auto-starts with the plugin)"

# Figma -- bundled, prereq is Figma desktop with Dev Mode enabled
PLUGINS_FOUND+=("Figma")
echo "[BUNDLED] Figma -- design data from Figma Dev Mode (auto-starts; open Figma desktop with Dev Mode to use)"

# Playwright -- bundled, prereq is Node.js v18+ for npx
if command -v node >/dev/null 2>&1 && [ "$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)" -ge 18 ] 2>/dev/null; then
  PLUGINS_FOUND+=("Playwright")
  echo "[BUNDLED] Playwright -- browser testing (auto-starts; Node.js v18+ detected)"
else
  PLUGINS_MISSING+=("Playwright (Node.js v18+ required)")
  echo "[BUNDLED, prereq missing] Playwright -- browser testing. Install Node.js v18+ to enable. The MCP fetches @playwright/mcp via npx on first use."
fi

# Figma Console MCP (standalone, OPTIONAL companion — not bundled)
if config_contains "figma.console|figma-console|southleft"; then
  MCPS_FOUND+=("Figma Console")
  echo "[FOUND] Figma Console MCP -- perform actions in Figma directly (optional companion, already installed)"
else
  MCPS_MISSING+=("Figma Console")
  echo "[OPTIONAL] Figma Console MCP -- perform actions in Figma directly (NOT bundled; install separately if you want write access to Figma)"
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
if [ -f ".design-engineer-plugin/config.yaml" ]; then
  echo "[FOUND] Plugin configured"
else
  echo "[MISSING] Plugin not yet configured"
fi

# Check for existing deliverables folder
if [ -d "documents/design" ]; then
  echo "[FOUND] design/ folder exists"
  FILE_COUNT=$(find documents/design -type f -not -name ".gitkeep" -not -name ".dependencies.yaml" -not -name ".DS_Store" 2>/dev/null | wc -l | tr -d ' ')
  echo "        Contains $FILE_COUNT deliverable file(s)"
else
  echo "[MISSING] No deliverables folder"
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
echo "Config:         $([ -f '.design-engineer-plugin/config.yaml' ] && echo 'yes' || echo 'no')"
echo "Deliverables:   $([ -d 'documents/design' ] && echo 'yes' || echo 'no')"
echo "Source code:    $HAS_CODE"
echo ""
echo "=== Detection Complete ==="
