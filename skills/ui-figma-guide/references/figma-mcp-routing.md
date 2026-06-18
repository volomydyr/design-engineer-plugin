# Figma MCP Routing Guide

The bundled official Figma MCP ("Figma Plugin", `plugin:figma:figma`) is the default and only Figma integration the plugin needs. It reads designs AND writes into Figma through its `use_figma` JavaScript executor, so every Figma workflow in this plugin runs on it without any extra install.

A separate community server, the optional Figma Console MCP (`figma-console`), is NOT bundled and NOT required. If a user happens to have it installed, it adds dedicated tools for a few niche capabilities (linting, design-code parity, Slides, FigJam) that are convenient but never necessary. Treat everything about `figma-console` in this guide as optional: only reach for it when the phrase "if you have the figma-console MCP installed" applies.

**Important**: Both servers update frequently. If a tool call fails or a capability seems missing, run ToolSearch before assuming it doesn't exist. Tool schemas are the source of truth – this document is a snapshot.

---

## Quick decision

**Default to "Figma Plugin" (`plugin:figma:figma`) for everything:**
- Converting a Figma design to code (design-to-code)
- Capturing a web page or localhost into Figma
- Creating a new Figma file from scratch
- Generating design system rules for a codebase
- Reading a design + screenshot in one call
- Writing into Figma – variables, design tokens, components, styles, annotations, structuring for handoff – via the `use_figma` JS executor

**Optionally use "Figma Console MCP" (`figma-console`) only if you already have it installed, when you want:**
- Dedicated lint tooling (`figma_lint_design` – WCAG, contrast, touch targets) instead of an in-skill audit helper
- Dedicated design-code parity scoring (`figma_check_design_parity`)
- Slides authoring
- FigJam board content
- Reading/posting comments
- Plugin console debugging (console logs, change watching)

None of these gate any plugin workflow. Where a capability has a `figma-console` shortcut, the bundled "Figma Plugin" has a `use_figma`-based path that does the same job.

---

## Architecture differences

| Aspect | "Figma Plugin" (bundled, default) | "Figma Console MCP" (optional, if installed) |
|--------|----------------|---------------------|
| Server name | `plugin:figma:figma` | `figma-console` |
| Bundled? | Yes – auto-starts with the plugin | No – separate community install |
| Required? | For Figma workflows, yes | Never – purely additive |
| Connection | Cloud API (file key + node ID) | Desktop bridge (WebSocket to Figma app) |
| File scope | Any file by key (even closed files) | Only files open in Figma desktop |
| Write model | `use_figma` – single JS executor (50K char limit) running the full Figma Plugin API | Dedicated tool per operation (structured params) |
| Can create new files | Yes | No |

---

## Capability routing

### "Figma Plugin" (bundled) – the default for reads AND writes

| Capability | Tool | Notes |
|-----------|------|-------|
| Design context (code + screenshot + metadata) | `get_design_context` | Primary design-to-code tool. Adapts output to your tech stack |
| Web/localhost capture into Figma | `generate_figma_design` | Polling workflow with captureId |
| Create new blank file | `create_new_file` | Requires planKey from `whoami` |
| Design system rules for codebase | `create_design_system_rules` | Generates rules prompt for your repo |
| Code Connect mappings | `get_code_connect_map`, `add_code_connect_map` | Links Figma components to code components |
| Variables / design tokens | `use_figma` (`createVariable()` + `setValueForMode()`, batched) | Full token CRUD via the Plugin API; this is how `ui-figma-handoff` builds collections |
| Components, styles, structuring | `use_figma` | Create components, bind variables, apply text/effect/paint styles, build the design system page |
| Annotations + dev status for handoff | `use_figma` | Native `annotations`, `description`, `devStatus` properties |
| Node manipulation (move, resize, clone, restyle) | `use_figma` | Plugin API calls inside the executor |
| Screenshots | `get_screenshot` | Cloud state – good for sharing and documentation |
| Search design system | `search_design_system` | Find matching design system assets |
| Read file structure | `get_metadata` | Confirm a file is accessible, inspect structure |
| In-skill quality audit | `use_figma` running the `fullAudit` helper | Verifies zero raw values; substitutes for a dedicated lint tool |

### "Figma Console MCP" (optional, only if installed) – niche conveniences

| Capability | Tool(s) | Notes |
|-----------|---------|-------|
| Dedicated lint pass | `figma_lint_design` | WCAG, contrast, touch targets, naming. The bundled path uses the `fullAudit` helper via `use_figma` instead |
| Dedicated parity scoring | `figma_check_design_parity` | Compares Figma specs vs code, returns score + fixes. Otherwise run `ui-design-to-code-qa` |
| Slides (15 tools) | `figma_create_slide`, `figma_list_slides`, etc. | Slide creation and management |
| FigJam (8 tools) | `figjam_create_stickies`, `figjam_create_connector`, etc. | Board content creation and layout |
| Comments | `figma_get_comments`, `figma_post_comment` | Read, post, reply, delete |
| Console/debugging | `figma_get_console_logs`, `figma_watch_console` | Plugin development and debugging |

Everything in this second table is optional. None of it is required for the plugin's design-to-code, structuring, or handoff workflows.

---

## Common workflows

All of these run on the bundled "Figma Plugin". The `figma-console` notes are optional add-ons, only relevant if you already have that server installed.

### Implement a Figma design in code
1. **"Figma Plugin"**: `get_design_context` (nodeId, fileKey) – get code + screenshot + context
2. **"Figma Plugin"**: `search_design_system` – find matching design system assets
3. Write code
4. Verify: run `ui-design-to-code-qa` for a parity review. *Optional:* if you have `figma-console`, `figma_check_design_parity` gives a quick score.

### Capture a running app into Figma
1. **"Figma Plugin"**: `generate_figma_design` – initiate capture (supports localhost)
2. **"Figma Plugin"**: Poll with captureId until completed
3. **"Figma Plugin"**: `use_figma` – granular edits to the captured design

### Set up design tokens from CSS variables
1. **"Figma Plugin"**: `use_figma` with `createVariable()` + `setValueForMode()`, batched into one execution – create the collection + modes + tokens atomically. See the `ui-figma-handoff` helpers for the pattern.

### Structure raw designs for handoff
1. **"Figma Plugin"**: `use_figma` with the `extractTokens` helper – audit raw designs
2. **"Figma Plugin"**: `use_figma` – create token collections (`createVariable()` + `setValueForMode()`)
3. **"Figma Plugin"**: `use_figma` – build components, bind variables, apply styles
4. **"Figma Plugin"**: `use_figma` running the `fullAudit` helper – verify quality (zero raw values)
5. **"Figma Plugin"**: `get_screenshot` – capture final state for documentation

This is exactly the path `ui-figma-handoff` takes – no `figma-console` needed.

### Audit design for accessibility
1. **"Figma Plugin"**: `use_figma` running the `fullAudit` helper – check for raw values and unbound tokens
2. Run `ui-aesthetic-review` and `ui-design-to-code-qa` for craft and parity. *Optional:* if you have `figma-console`, `figma_lint_design` adds dedicated WCAG/contrast/touch-target checks.

---

## When only the bundled MCP is available

This is the normal, expected case. The bundled "Figma Plugin" covers the full plugin Figma workflow on its own:

- **Reads**: `get_design_context`, `get_screenshot`, `get_metadata`, `search_design_system`
- **Writes**: everything via `use_figma` – variables, tokens, components, styles, annotations, dev status, node manipulation
- **Web capture and new files**: `generate_figma_design`, `create_new_file`
- **Quality**: the `fullAudit` helper via `use_figma`, plus `ui-design-to-code-qa` for parity

You only "lose" the optional conveniences of `figma-console` (a dedicated lint tool, a parity-score tool, Slides, FigJam, comments, console debugging) – none of which any plugin workflow requires.

**Neither MCP available**: skills fall back to a manual workflow – the user provides screenshots and design specs.
