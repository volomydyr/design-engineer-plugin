# 02b — MCP tool name catalog (Phase 1)

**Plugin**: design-engineer v4.7.0  
**Date**: 2026-04-26  
**Scope**: Inventory of every `mcp__*` and bare `figma_*` / `playwright_*` reference across the plugin.

## Plugin's declared MCP servers (from `.claude-plugin/plugin.json`)

```
context7    → HTTP, https://mcp.context7.com/mcp
figma       → HTTP, https://mcp.figma.com/mcp
playwright  → npx, @playwright/mcp@latest
```

## Anthropic-canonical naming convention (from `canonical-docs/plugins-reference-doc.md`)

Plugin-provided MCP tools resolve as: **`mcp__plugin_<plugin-name>_<server-name>__<tool>`**.

For design-engineer:
- context7 server → `mcp__plugin_design-engineer_context7__*`
- figma server → `mcp__plugin_design-engineer_figma__*`
- playwright server → `mcp__plugin_design-engineer_playwright__*`

Any reference NOT using this prefix will fail to resolve when the plugin is installed standalone.

## Scan results

### A. Correctly namespaced (will resolve)

`mcp__plugin_design-engineer_context7__*` — 11 references, 2 unique tools:
- `mcp__plugin_design-engineer_context7__resolve-library-id`
- `mcp__plugin_design-engineer_context7__query-docs`

**Locations**:
- `skills/dev-component-gallery/SKILL.md:48,49`
- `skills/dev-component-gallery/references/context7-prompts.md:8,9`
- `CHANGELOG.md:40,57` (v4.7.0/v4.6.0 entries)
- `plans/archive/2026-04-26-component-gallery.md:31,59,72`

### B. Bare `figma_*` references — third-party `figma-console` MCP, NOT the plugin's bundled `figma` server (HIGH)

73 references to 25 unique tools. **These are NOT tools provided by the plugin's bundled `figma` MCP server (`mcp.figma.com`).** They are tools from the third-party `figma-console` MCP server, which is a DIFFERENT product. The plugin's bundled figma server provides tools like `get_design_context`, `generate_figma_design`, `get_metadata` (visible in the global tool listing as `mcp__plugin_figma_figma__*` — note the namespace comes from a separate `figma` plugin install, not from design-engineer).

**Tools referenced**: `figma_execute` (14), `figma_batch_create_variables` (9), `figma_lint_design` (5), `figma_check_design_parity` (5), `figma_capture_screenshot` (4), `figma_setup_design_tokens` (4), `figma_get_file_data` (2), plus 18 more.

**Locations** (top hits):
- `skills/ui-figma-guide/references/figma-mcp-routing.md` (28 refs)
- `skills/ui-figma-handoff/references/figma-structuring-guide.md` (15 refs)
- `skills/ui-figma-handoff/SKILL.md` (11 refs)
- `skills/ui-figma-handoff/references/figma-console-helpers.md` (1 ref)
- `skills/ui-figma-guide/SKILL.md` (5 refs)
- `skills/ui-figma-guide/references/figma-for-ai-dev.md` (1 ref)
- `hooks/hooks.json:56` (PreToolUse matcher: `get_screenshot|figma_capture_screenshot|figma_take_screenshot`)

**Why this matters**: A user installing only design-engineer (not also figma-console) will hit dead tools when the Figma skills run. The plugin advertises figma support as bundled, but the actual workflows require a separate MCP server. Either:
- Document the dependency explicitly (skills should say "requires figma-console MCP also installed").
- Or rewrite the skills to use the bundled figma server's actual API (`mcp__plugin_design-engineer_figma__get_design_context`, etc.).

### C. References to a different plugin's namespace (BLOCKER risk)

`mcp__plugin_figma_figma__*` — would only resolve if the user has a separate plugin named `figma` installed. Found in:
- `audit/2026-04-26-comprehensive/00-facts.md:70` (audit doc only, not plugin code — informational, no fix needed)

The single mention in the user's `~/.claude/settings.local.json` (`mcp__plugin_figma_figma__get_metadata`, etc.) confirms the user has a separate `figma` plugin installed locally — explaining why the figma-console-style tools have *appeared* to work for the author. Other users won't have that plugin.

### D. `mcp__playwright__*` (LOW)

1 reference (in audit's own `00-facts.md`). No skill or agent references playwright tools by name. The `dev-prototyping` skill calls Playwright via Bash, not MCP — so the bundled playwright MCP server may be effectively unused. Worth Phase 4 verification.

### E. Bundled-server config keys (OK, not tool calls)

- `figma_console: {true|false}` in `skills/meta-setup/SKILL.md:182` and `skills/meta-setup-configure/SKILL.md:55` (config keys, not tool calls).
- `figma_mcp:` in `CHANGELOG.md:1080` (rename history note).

## Findings (append to 99-ledger.json)

```json
[
  {
    "id": "F-0080",
    "severity": "HIGH",
    "category": "correctness",
    "file": "skills/ui-figma-guide/references/figma-mcp-routing.md + skills/ui-figma-handoff/SKILL.md + skills/ui-figma-handoff/references/figma-structuring-guide.md",
    "line": "73 references across 6 files",
    "evidence": "Skills reference 25 unique bare `figma_*` tool names (figma_execute, figma_batch_create_variables, figma_lint_design, figma_check_design_parity, figma_capture_screenshot, figma_setup_design_tokens, etc.) that come from the third-party `figma-console` MCP server, NOT from the plugin's bundled `figma` HTTP MCP at mcp.figma.com (which provides get_design_context, generate_figma_design, etc.).",
    "why_it_matters": "Users who install only design-engineer (without separately installing figma-console) will hit dead tools when running ui-figma-guide or ui-figma-handoff skills. The plugin advertises Figma as bundled, but the actual implementation requires a different MCP server.",
    "direction": "Decide one: (a) Add a hard dependency note in plugin.json or README that figma-console MCP is required for these skills, with install instructions. OR (b) Rewrite ui-figma-guide and ui-figma-handoff to use only the bundled figma server's actual API (mcp__plugin_design-engineer_figma__get_design_context, generate_figma_design, etc.).",
    "repro": "grep -rn 'figma_execute\\|figma_batch_create_variables\\|figma_lint_design\\|figma_check_design_parity\\|figma_setup_design_tokens' skills/",
    "confidence": "high"
  },
  {
    "id": "F-0081",
    "severity": "MEDIUM",
    "category": "correctness",
    "file": "hooks/hooks.json",
    "line": 56,
    "evidence": "PreToolUse matcher: \"get_screenshot|figma_capture_screenshot|figma_take_screenshot\". The bare `figma_capture_screenshot` and `figma_take_screenshot` are figma-console MCP tools; the bundled figma server uses `get_screenshot` (no figma_ prefix). When users run this plugin without figma-console, the matcher will only match `get_screenshot`, missing the other two — but that's actually fine because those tools won't fire either. The matcher should be reviewed for correctness given the F-0080 dependency uncertainty.",
    "why_it_matters": "Hook matcher logic depends on which figma MCP is installed; behavior is unpredictable.",
    "direction": "Once F-0080 is decided, revise hook matcher to match the actual tool names that will fire in the canonical install configuration.",
    "repro": "grep -n 'figma_capture_screenshot\\|figma_take_screenshot\\|get_screenshot' hooks/hooks.json",
    "confidence": "high"
  },
  {
    "id": "F-0082",
    "severity": "LOW",
    "category": "coverage",
    "file": "plugin.json + skills/dev-prototyping/SKILL.md",
    "line": null,
    "evidence": "Plugin bundles `playwright` MCP server (npx @playwright/mcp@latest), but no skill or agent references `mcp__plugin_design-engineer_playwright__*`. The dev-prototyping skill uses Playwright via Bash subprocess, not MCP. The bundled playwright MCP appears unused.",
    "why_it_matters": "Bundling an unused MCP costs install time and adds a runtime dependency for no observable benefit.",
    "direction": "Either (a) update dev-prototyping (and/or new audit branch in review.md) to use playwright MCP instead of Bash subprocess for richer interaction, OR (b) drop playwright from plugin.json mcpServers and document the Bash invocation route explicitly.",
    "repro": "grep -rn 'mcp__plugin_design-engineer_playwright\\|mcp__playwright' skills/ agents/ commands/ hooks/",
    "confidence": "high"
  }
]
```
