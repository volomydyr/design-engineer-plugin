# Essential MCPs reference

The design-engineer plugin bundles three MCPs and recommends one optional companion. This reference is for the `dev-mcp-setup` skill to draw from when guiding users through MCP configuration.

## Bundled with this plugin (auto-start, no separate install)

### Context7 (HTTP, https://mcp.context7.com/mcp)

**Purpose**: up-to-date technical documentation lookup. Resolves library names to package IDs and queries authoritative docs.

**When the AI uses it**: any time it needs current syntax, API shape, or migration guidance for a framework, library, SDK, CLI tool, or cloud service – even well-known ones like React, Next.js, Tailwind, Django. Bundled because the plugin's stack-agnostic skills (e.g., `dev-component-gallery`) rely on it to adapt to the project's framework without a hardcoded stack table.

**Plugin tool prefix**: `mcp__plugin_design-engineer_context7__*`

**Prerequisites**: none. Auto-starts when the plugin is enabled.

### Figma (HTTP, https://mcp.figma.com/mcp)

**Purpose**: structured design data from Figma Dev Mode – not screenshots, code-ready design data adapted to the project's tech stack.

**When the AI uses it**: design-to-code workflows (`get_design_context`, `generate_figma_design`, `get_screenshot`), code-to-design imports, design system rule generation.

**Plugin tool prefix**: `mcp__plugin_design-engineer_figma__*`

**Prerequisites**: Figma desktop app installed with Dev Mode enabled. The MCP connects to the running Figma desktop session.

### Playwright (npx @playwright/mcp@latest)

**Purpose**: browser automation – screenshots, navigation, interaction, network/console inspection of running web apps.

**When the AI uses it**: visual verification during dev (`/design-engineer:dev` after UI implementation), the audit branch in `/design-engineer:review audit` (page-by-page commercial audit), prototype QA.

**Plugin tool prefix**: `mcp__plugin_design-engineer_playwright__*`

**Prerequisites**: Node.js v18+ on the user's machine so npx can fetch the package on first use.

## Optional companion (NOT bundled – separate install required)

### Figma Console MCP

**Purpose**: write operations against Figma – variable/token CRUD, design linting, design-code parity checks, batch operations, Slides, FigJam, granular node manipulation. Where the bundled Figma MCP is read-oriented, Figma Console is write-oriented.

**When the AI uses it**: the `ui-figma-handoff` skill (advanced workflow). The plugin works without it – `ui-figma-guide` and most other skills use only the bundled Figma MCP.

**Install**: search GitHub for "figma-console MCP" or visit https://github.com/southleft/figma-console-mcp. Install instructions are in the upstream repo. Once installed, both servers run side-by-side.

**Prerequisites**: Figma desktop with Dev Mode + the Console MCP plugin installed.

## Decision matrix: which MCP for what

For the full Figma MCP routing decision (which server has which tools, how to choose between them), see `skills/ui-figma-guide/references/figma-mcp-routing.md`.

For everything else, the rule is simple: if the AI is asking for documentation, it's `context7`; if it's reading Figma designs, it's bundled `figma`; if it's running a browser, it's `playwright`; if it's writing variables/tokens to Figma or doing batch design ops, it's the optional `figma-console`.

## Setting up MCPs in the user's project

The plugin's bundled MCPs auto-start. There's nothing for the user to install for context7, figma (read), and playwright beyond the prerequisites listed above. The `dev-mcp-setup` skill walks through:

1. Detecting prerequisites via `detect-environment.sh` (Node v18+? Figma desktop reachable?).
2. Surfacing missing prerequisites with install pointers.
3. Asking whether the user wants the optional Figma Console MCP and surfacing the install link if yes.
4. Updating CLAUDE.md so AI knows which MCPs are available in this project.

No `~/.claude/settings.json` writes are needed for the bundled MCPs – they're declared in the plugin's `.claude-plugin/plugin.json` and Claude Code starts them automatically when the plugin is enabled.
