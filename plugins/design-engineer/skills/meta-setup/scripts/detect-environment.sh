#!/usr/bin/env bash
# detect-environment.sh
# Checks for installed MCPs, available tools, and project state.
# Outputs a structured summary for the meta-setup skill.

set -euo pipefail

echo "=== Design-Engineer Environment Detection ==="
echo ""

# ─────────────────────────────────────────────
# 1. MCP Detection
# ─────────────────────────────────────────────
echo "--- MCP Detection ---"

MCPS_FOUND=()
MCPS_MISSING=()

# Check for Context7 MCP
# Context7 helps AI get up-to-date technical documentation
# so it does not rely on outdated training data.
if grep -rql "context7" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null; then
  MCPS_FOUND+=("Context7")
  echo "[FOUND] Context7 -- up-to-date technical documentation"
else
  MCPS_MISSING+=("Context7")
  echo "[MISSING] Context7 -- up-to-date technical documentation"
fi

# Check for Figma plugin (official)
# Provides design data from Figma Dev Mode adapted to the project's tech stack.
if grep -rql -i "figma" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null | head -1 | grep -vq "figma-console" 2>/dev/null; then
  # More precise check: look for figma MCP that is NOT figma-console
  if grep -rql -iE "(figma_mcp|figma-mcp|@figma|figma.*dev.mode)" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null; then
    MCPS_FOUND+=("Figma plugin")
    echo "[FOUND] Figma plugin -- design data from Figma Dev Mode"
  else
    # Fallback: any figma reference that is not console
    if grep -rql -i "figma" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null; then
      MCPS_FOUND+=("Figma plugin (unconfirmed)")
      echo "[FOUND] Figma plugin (unconfirmed) -- found figma reference in MCP config"
    else
      MCPS_MISSING+=("Figma plugin")
      echo "[MISSING] Figma plugin -- design data from Figma Dev Mode"
    fi
  fi
else
  MCPS_MISSING+=("Figma plugin")
  echo "[MISSING] Figma plugin -- design data from Figma Dev Mode"
fi

# Check for Figma Console MCP (unofficial, more powerful)
# Can perform actions in Figma: create components, apply tokens and styles.
if grep -rql -i "figma.console\|figma-console\|southleft" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null; then
  MCPS_FOUND+=("Figma Console")
  echo "[FOUND] Figma Console -- perform actions in Figma directly"
else
  MCPS_MISSING+=("Figma Console")
  echo "[MISSING] Figma Console -- perform actions in Figma directly"
fi

# Check for Playwright MCP
# Enables browser-based testing and browsing live URLs for visual review.
if grep -rql -i "playwright" ~/.claude/settings.json ~/.claude/settings.local.json .mcp.json .claude/settings.json .claude/settings.local.json 2>/dev/null; then
  MCPS_FOUND+=("Playwright MCP")
  echo "[FOUND] Playwright MCP -- browser testing and visual review"
else
  MCPS_MISSING+=("Playwright MCP")
  echo "[MISSING] Playwright MCP -- browser testing and visual review"
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
echo "MCPs found:   ${MCPS_FOUND[*]:-none}"
echo "MCPs missing: ${MCPS_MISSING[*]:-none}"
echo "Git:          $([ -d '.git' ] && echo 'yes' || echo 'no')"
echo "CLAUDE.md:    $([ -f 'CLAUDE.md' ] && echo 'yes' || echo 'no')"
echo "Config:       $([ -f '.design-engineer.yaml' ] && echo 'yes' || echo 'no')"
echo "Deliverables: $([ -d 'docs/design' ] && echo 'yes' || echo 'no')"
echo "Source code:  $HAS_CODE"
echo ""
echo "=== Detection Complete ==="
