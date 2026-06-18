# Essential MCPs reference

The design-engineer plugin bundles three MCPs (Context7, Figma, Playwright) and needs no others. This reference is for the `dev-mcp-setup` skill to draw from when guiding users through MCP configuration.

## Bundled with this plugin (auto-start, no separate install)

### Context7 (HTTP, https://mcp.context7.com/mcp)

**Purpose**: up-to-date documentation lookup for libraries, frameworks, SDKs, CLIs, and cloud services. Resolves library names to package IDs and queries authoritative docs. External library docs only – not the project's own README or internal docs.

**When the AI uses it**: any time it needs current syntax, API shape, or migration guidance for a framework, library, SDK, CLI tool, or cloud service – even well-known ones like React, Next.js, Tailwind, Django. Bundled because the plugin's stack-agnostic skills (e.g., `dev-component-gallery`) rely on it to adapt to the project's framework without a hardcoded stack table.

**Plugin tool prefix**: `mcp__plugin_design-engineer_context7__*`

**Prerequisites**: none. Auto-starts when the plugin is enabled.

### Figma (HTTP, https://mcp.figma.com/mcp)

**Purpose**: structured design data from Figma Dev Mode – not screenshots, code-ready design data adapted to the project's tech stack. Also writes into Figma (variables, tokens, components, styles, annotations) through its `use_figma` executor.

**When the AI uses it**: design-to-code workflows (`get_design_context`, `generate_figma_design`, `get_screenshot`), code-to-design imports, design system rule generation, and the `ui-figma-handoff` structuring/handoff workflow (write operations via `use_figma`).

**Plugin tool prefix**: `mcp__plugin_design-engineer_figma__*`

**Prerequisites**: Figma desktop app installed with Dev Mode enabled. The MCP connects to the running Figma desktop session.

### Playwright (npx @playwright/mcp@latest)

**Purpose**: browser automation – screenshots, navigation, interaction, network/console inspection of running web apps.

**When the AI uses it**: visual verification during dev (`/design-engineer:development` after UI implementation), the audit branch in `/design-engineer:review audit` (page-by-page commercial audit), prototype QA.

**Plugin tool prefix**: `mcp__plugin_design-engineer_playwright__*`

**Prerequisites**: Node.js v18+ on the user's machine so npx can fetch the package on first use.

## Optional power-user companion (NOT bundled, NOT required)

Some users already run a separate community Figma MCP (for example one with dedicated linting, design-code parity, Slides, or FigJam tools). It can sit alongside the bundled Figma MCP, but the plugin never requires it: every Figma read and write the plugin's skills depend on, including the `ui-figma-handoff` structuring and handoff workflow, runs on the bundled Figma MCP via `get_design_context`, `get_screenshot`, and the `use_figma` executor. Do not advertise a separate Figma write MCP as a needed dependency during setup or detection.

## Decision matrix: which MCP for what

For the full Figma MCP routing decision (which tools cover which capability), see `skills/ui-figma-guide/references/figma-mcp-routing.md`.

For everything else, the rule is simple: if the AI is asking for documentation, it's `context7`; if it's reading from or writing to Figma, it's the bundled `figma` (reads via `get_design_context` / `get_screenshot`, writes via `use_figma`); if it's running a browser, it's `playwright`.

## Setting up MCPs in the user's project

The plugin's bundled MCPs auto-start. There's nothing for the user to install for context7, figma, and playwright beyond the prerequisites listed above. The `dev-mcp-setup` skill walks through:

1. Detecting prerequisites via `detect-environment.sh` (Node v18+? Figma desktop reachable?).
2. Surfacing missing prerequisites with install pointers.
3. Updating CLAUDE.md so AI knows which MCPs are available in this project.

No `~/.claude/settings.json` writes are needed for the bundled MCPs – they're declared in the plugin's `.claude-plugin/plugin.json` and Claude Code starts them automatically when the plugin is enabled.
