# Figma MCP Routing Guide

Two MCP servers connect AI to Figma. They overlap in some areas but have distinct strengths. This guide tells you which to use for what.

**Important**: Both servers update frequently. If a tool call fails or a capability seems missing, run ToolSearch before assuming it doesn't exist. Tool schemas are the source of truth – this document is a snapshot.

---

## Quick decision

**Use "Figma Plugin" (`plugin:figma:figma`) when:**
- Converting a Figma design to code (design-to-code)
- Capturing a web page or localhost into Figma
- Creating a new Figma file from scratch
- Generating design system rules for a codebase
- You only need to read a design + screenshot in one call

**Use "Figma Console MCP" (`figma-console`) when:**
- Managing variables and design tokens (create, update, batch, export)
- Design linting and accessibility checks (WCAG, contrast, touch targets)
- Design-code parity checking
- Working with Figma Slides
- Working with FigJam boards
- Granular node manipulation with dedicated tools (move, resize, clone, restyle)
- Reading/posting comments
- Plugin debugging (console logs, change watching)

**Use both together when:**
- Building a full design system ("Figma Plugin" for reading + rules, "Figma Console MCP" for token/variable CRUD and linting)
- Design-to-code with QA ("Figma Plugin" for `get_design_context`, "Figma Console MCP" for `check_design_parity` and `lint_design`)
- Iterating on a web capture ("Figma Plugin" for `generate_figma_design`, "Figma Console MCP" for granular edits after)

---

## Architecture differences

| Aspect | "Figma Plugin" | "Figma Console MCP" |
|--------|----------------|---------------------|
| Server name | `plugin:figma:figma` | `figma-console` |
| Tools (as of 2026-03-24) | 16 | 84 |
| Connection | Cloud API (file key + node ID) | Desktop bridge (WebSocket to Figma app) |
| File scope | Any file by key (even closed files) | Only files open in Figma desktop |
| Write model | `use_figma` – single JS executor (50K char limit) | Dedicated tool per operation (structured params) |
| Can create new files | Yes | No |

---

## Capability routing

### "Figma Plugin" only

| Capability | Tool | Notes |
|-----------|------|-------|
| Design context (code + screenshot + metadata) | `get_design_context` | Primary design-to-code tool. Adapts output to your tech stack |
| Web/localhost capture into Figma | `generate_figma_design` | Polling workflow with captureId |
| Create new blank file | `create_new_file` | Requires planKey from `whoami` |
| Design system rules for codebase | `create_design_system_rules` | Generates rules prompt for your repo |
| Code Connect mappings | `get_code_connect_map`, `add_code_connect_map` | Links Figma components to code components |

### "Figma Console MCP" only

| Capability | Tool(s) | Notes |
|-----------|---------|-------|
| Variable/token CRUD | `figma_create_variable`, `figma_batch_create_variables`, `figma_setup_design_tokens` | Batch tools are 10-50x faster |
| Variable code exports | `figma_get_variables` | CSS, Tailwind, TypeScript, Sass |
| Design linting | `figma_lint_design` | WCAG, contrast, touch targets, naming |
| Design-code parity | `figma_check_design_parity` | Compares Figma specs vs code, returns score + fixes |
| Slides (15 tools) | `figma_create_slide`, `figma_list_slides`, etc. | Full slide creation and management |
| FigJam (8 tools) | `figjam_create_stickies`, `figjam_create_connector`, etc. | Board content creation and layout |
| Comments | `figma_get_comments`, `figma_post_comment` | Read, post, reply, delete |
| Console/debugging | `figma_get_console_logs`, `figma_watch_console` | Plugin development and debugging |
| Component documentation | `figma_generate_component_doc` | Structured markdown with anatomy and tokens |
| Design system extraction | `figma_get_design_system_kit` | Tokens + components + styles in one call |

### Either MCP

| Capability | "Figma Plugin" | "Figma Console MCP" | Prefer |
|-----------|----------------|---------------------|--------|
| Screenshots | `get_screenshot` (cloud state) | `figma_capture_screenshot` (local state) | "Figma Plugin" for sharing, "Figma Console MCP" for current edits |
| Arbitrary JS execution | `use_figma` (50K chars) | `figma_execute` (30s timeout) | "Figma Console MCP" if connected, "Figma Plugin" for closed files |
| Node manipulation | Via `use_figma` JS | Dedicated tools (`figma_move_node`, `figma_resize_node`, etc.) | "Figma Console MCP" – dedicated tools are safer |
| Search components | `search_design_system` | `figma_search_components` | Either – "Figma Console MCP" has pagination |
| Read file structure | `get_metadata` | `figma_get_file_data` | "Figma Console MCP" – more configurable |

---

## Common workflows

### Implement a Figma design in code
1. **"Figma Plugin"**: `get_design_context` (nodeId, fileKey) – get code + screenshot + context
2. **"Figma Plugin"**: `search_design_system` – find matching design system assets
3. Write code
4. **"Figma Console MCP"** (optional): `figma_check_design_parity` – verify implementation matches design

### Capture a running app into Figma
1. **"Figma Plugin"**: `generate_figma_design` – initiate capture (supports localhost)
2. **"Figma Plugin"**: Poll with captureId until completed
3. **"Figma Console MCP"** (optional): Granular edits to the captured design

### Set up design tokens from CSS variables
1. **"Figma Console MCP"**: `figma_setup_design_tokens` – atomic creation of collection + modes + tokens
2. Or: `figma_batch_create_variables` for adding to existing collections

### Structure raw designs for handoff
1. **"Figma Console MCP"**: `figma_execute` with `extractTokens` helper – audit raw designs
2. **"Figma Console MCP"**: `figma_batch_create_variables` – create token collections
3. **Either**: Build components ("Figma Console MCP" dedicated tools or "Figma Plugin" `use_figma`)
4. **"Figma Console MCP"**: `figma_lint_design` – verify quality
5. **"Figma Plugin"**: `get_screenshot` – capture final state for documentation

### Audit design for accessibility
1. **"Figma Console MCP"**: `figma_lint_design` – WCAG checks, contrast, touch targets
2. **"Figma Console MCP"**: `figma_check_design_parity` – if comparing against code

---

## When only one MCP is available

**"Figma Plugin" only (no "Figma Console MCP")**: Most design-to-code workflows work fine. Use `use_figma` JS executor for write operations. You lose: dedicated variable tools, linting, parity checking, slides, FigJam, comments. Workaround for variables: write Plugin API JS via `use_figma`.

**"Figma Console MCP" only (no "Figma Plugin")**: You can read designs via `figma_get_file_data` and `figma_capture_screenshot`, but you lose `get_design_context` (the primary design-to-code tool) and web capture. You can still build and structure designs.

**Neither**: Skills fall back to manual workflow – user provides screenshots and design specs.
