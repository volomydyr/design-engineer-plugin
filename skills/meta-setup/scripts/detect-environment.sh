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
# We still detect their availability so we can surface accurate status – but the messaging
# now reflects "bundled, runs when prerequisites are present" rather than "needs install".

# Context7 -- bundled, no prereq
PLUGINS_FOUND+=("Context7")
echo "[BUNDLED] Context7 -- up-to-date library and framework docs lookup (auto-starts with the plugin)"

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

# The bundled Figma MCP handles both reading and writing (variables, tokens,
# components, styles, annotations) via its use_figma executor, so no separate
# Figma write MCP is detected or advertised as a dependency here.

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
if [ -d "design" ]; then
  echo "[FOUND] design/ folder exists"
  FILE_COUNT=$(find design -type f -not -name ".gitkeep" -not -name ".dependencies.yaml" -not -name ".DS_Store" 2>/dev/null | wc -l | tr -d ' ')
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
# 2.5. Project Context Detection (existing-project signal)
# ─────────────────────────────────────────────
# Detects markers that indicate this is an established project so the onboarding
# flow can ask the user about off-repo references (Figma, Notion, etc.) and
# biased ux-* skills can short-circuit when the relevant artifact already exists.

echo "--- Project Context Detection ---"

# Design system markers
DESIGN_SYSTEM_PATH=""
for p in "design-system" "src/design-system" "packages/design-system" "Foundation/Tokens" "theme" "src/theme" "src/styles/tokens"; do
  if [ -d "$p" ]; then DESIGN_SYSTEM_PATH="$p"; break; fi
done
if [ -z "$DESIGN_SYSTEM_PATH" ]; then
  for f in "tokens.css" "tokens.json" "src/tokens.css" "theme.ts" "src/theme.ts"; do
    if [ -f "$f" ]; then DESIGN_SYSTEM_PATH="$f"; break; fi
  done
fi
if [ -z "$DESIGN_SYSTEM_PATH" ] && [ -f "tailwind.config.js" ]; then
  if grep -q "extend:" tailwind.config.js 2>/dev/null; then DESIGN_SYSTEM_PATH="tailwind.config.js (custom theme)"; fi
fi
if [ -n "$DESIGN_SYSTEM_PATH" ]; then
  echo "[FOUND] existing_design_system: $DESIGN_SYSTEM_PATH"
else
  echo "[NONE] existing_design_system: none detected"
fi

# Brand docs / written specs
BRAND_DOC=""
for f in "BRAND.md" "BRANDING.md" "STYLE-GUIDE.md" "docs/brand.md" "docs/branding.md"; do
  if [ -f "$f" ]; then BRAND_DOC="$f"; break; fi
done
if [ -z "$BRAND_DOC" ] && [ -f "README.md" ]; then
  RM_LINES=$(wc -l < README.md 2>/dev/null || echo 0)
  if [ "$RM_LINES" -gt 200 ]; then BRAND_DOC="README.md ($RM_LINES lines – substantial)"; fi
fi
if [ -n "$BRAND_DOC" ]; then
  echo "[FOUND] existing_brand_docs: $BRAND_DOC"
else
  echo "[NONE] existing_brand_docs: none detected"
fi

# Spec / docs folder
SPECS_PATH=""
for d in "docs" "documentation" "specs"; do
  if [ -d "$d" ] && [ "$(ls -1 "$d" 2>/dev/null | wc -l)" -gt 1 ]; then SPECS_PATH="$d"; break; fi
done
if [ -n "$SPECS_PATH" ]; then
  echo "[FOUND] existing_specs: $SPECS_PATH"
else
  echo "[NONE] existing_specs: none detected"
fi

# Shipped UI markers (framework-natural routable-page locations)
SHIPPED_UI="false"
for d in "app" "pages" "src/routes" "src/pages" "lib/screens" "Sources/Views"; do
  if [ -d "$d" ] && [ "$(find "$d" -maxdepth 3 -type f 2>/dev/null | wc -l)" -gt 0 ]; then SHIPPED_UI="true"; break; fi
done
echo "[INFO] shipped_ui: $SHIPPED_UI"

# Component count (rough signal: 0 = greenfield, >20 = established)
COMPONENT_COUNT=0
for d in "components" "Components" "src/components" "src/Components" "packages/ui/src/components"; do
  if [ -d "$d" ]; then
    n=$(find "$d" -maxdepth 4 -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" -o -name "*.swift" -o -name "*.kt" -o -name "*.dart" \) 2>/dev/null | wc -l | tr -d ' ')
    COMPONENT_COUNT=$((COMPONENT_COUNT + n))
  fi
done
echo "[INFO] component_count: $COMPONENT_COUNT"

echo ""

# ─────────────────────────────────────────────
# 3. Summary
# ─────────────────────────────────────────────
echo "--- Summary ---"
echo "Plugins found:  ${PLUGINS_FOUND[*]:-none}"
echo "Plugins missing: ${PLUGINS_MISSING[*]:-none}"
echo "Git:            $([ -d '.git' ] && echo 'yes' || echo 'no')"
echo "CLAUDE.md:      $([ -f 'CLAUDE.md' ] && echo 'yes' || echo 'no')"
echo "Config:         $([ -f '.design-engineer-plugin/config.yaml' ] && echo 'yes' || echo 'no')"
echo "Deliverables:   $([ -d 'design' ] && echo 'yes' || echo 'no')"
echo "Source code:    $HAS_CODE"
echo ""
echo "=== Detection Complete ==="
