# v4.3.0 — Bundle Figma + Playwright MCPs as plugin connectors

## Context

Beta tester opened the plugin in Claude desktop's Plugin Directory and saw `Connectors: 1 (context7)`. They thought the directory was missing entries because the plugin documents many other integrations (Figma, Playwright, Figma Console MCP). Audit confirmed the directory is technically correct — the plugin currently bundles only `context7`. The other integrations are *companion plugins* the user installs separately during meta-setup.

User decision: rather than reframe expectations, just bundle Figma and Playwright too. Quote: "I am 99% sure every designer who's gonna use this plugin will use all these mcps/clis at some point." Figma Console MCP stays optional (alternative to the official Figma plugin, less common).

Per Anthropic docs (`/en/plugins-reference`), anything in `plugin.json mcpServers` "starts automatically when the plugin is enabled". So bundling Figma + Playwright means every plugin user gets these MCPs auto-started. Trade-off: small invasiveness (an extra HTTP MCP that does nothing if Figma desktop isn't open; an `npx` that pulls Playwright on first use) for big perception/onboarding wins (Connectors count goes 1 → 3, fewer manual install steps, design tester's complaint resolved).

This is additive — no breaking change. **MINOR bump → v4.3.0** per CLAUDE.md versioning rules.

## Architectural decisions

- **Inline configs in plugin.json mcpServers** (not `.mcp.json` separate file) — keeps everything in one place. Plugin already uses inline; consistent.
- **Use the exact configs from the official Anthropic plugins** (read directly from `~/.claude/plugins/cache/claude-plugins-official/{figma,playwright}/.mcp.json`):
  - `figma` → HTTP at `https://mcp.figma.com/mcp`
  - `playwright` → `npx @playwright/mcp@latest`
- **Don't bundle Figma Console MCP** (per user). It stays an optional install via `meta-setup` flow as a power-user alternative.
- **No removal of `meta-setup` env-detection**. The detect-environment.sh still detects Figma/Playwright availability, but now those will *always* register as found via plugin auto-install — meta-setup messaging needs an update so it doesn't redundantly offer to install what's already bundled.
- **Update meta-setup's framing**: status of Figma/Playwright moves from "optional, install separately" to "bundled (just open Figma desktop / run with Node available)". The tester's onboarding question "would you like to install Figma plugin?" no longer makes sense.
- **README "How it works" section** updated to mention the three bundled connectors (Context7, Figma, Playwright).

## Phase 1: Bundle MCPs + update meta-setup messaging + ship v4.3.0

**Objective**: Add Figma and Playwright to plugin.json mcpServers, refresh meta-setup messaging accordingly, ship as v4.3.0.

**Depends on**: none

**Files to modify**:

- `.claude-plugin/plugin.json` — add `figma` and `playwright` entries to `mcpServers`. Bump version 4.2.0 → 4.3.0.
- `.claude-plugin/marketplace.json` — bump 4.2.0 → 4.3.0.
- `skills/meta-setup/SKILL.md` — update tool-detection messaging. Today the SKILL.md describes Figma/Playwright as optional installs the user must accept. Now those are bundled. Change wording to: "Figma plugin is bundled — open Figma desktop with Dev Mode enabled to use it. Playwright is bundled — Node.js v18+ required so npx can fetch the MCP on first use." Drop the install-prompts for Figma and Playwright from the meta-setup flow.
- `skills/meta-setup/scripts/detect-environment.sh` — keep checking for Figma/Playwright availability (still useful for the "Figma desktop is open" / "Node is installed" status), but the [MISSING] message changes from "you need to install this plugin" to "this MCP is bundled but the underlying app/runtime isn't running" (Figma desktop not running; Node not installed).
- `README.md` — banner v4.2.0 → v4.3.0. Update "How it works" or FAQ to mention the three bundled connectors.
- `CHANGELOG.md` — `[4.3.0] – 2026-04-26` entry under Added.

**Reuse**:
- Existing `mcpServers` block in plugin.json (just append two entries to the same object).
- Existing detect-environment.sh logic for Figma/Playwright detection (just relabel messages).

**Plugin.json mcpServers (after change)**:

```json
"mcpServers": {
  "context7": {
    "type": "http",
    "url": "https://mcp.context7.com/mcp"
  },
  "figma": {
    "type": "http",
    "url": "https://mcp.figma.com/mcp"
  },
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest"]
  }
}
```

**Checklist**:
- [ ] Add `figma` and `playwright` entries to `.claude-plugin/plugin.json mcpServers` using the exact configs from Anthropic's official plugins
- [ ] Bump `.claude-plugin/plugin.json` 4.2.0 → 4.3.0
- [ ] Bump `.claude-plugin/marketplace.json` 4.2.0 → 4.3.0
- [ ] Update `skills/meta-setup/SKILL.md` to reflect bundled status: drop install prompts for Figma/Playwright, update messaging to "bundled, runs when prerequisites are present"
- [ ] Update `skills/meta-setup/scripts/detect-environment.sh` messages so "MISSING" reads as "bundled but [prerequisite] absent" rather than "needs install"
- [ ] Update `README.md` banner to v4.3.0; mention three bundled connectors in How it works / FAQ
- [ ] Add CHANGELOG `[4.3.0] – 2026-04-26` entry under Added
- [ ] Validate JSON manifests
- [ ] Verify plugin.json schema is correct (the new mcp entries are well-formed)

**QA**:
1. JSON manifests valid: `python3 -m json.tool .claude-plugin/plugin.json`, `marketplace.json`.
2. plugin.json mcpServers contains 3 entries: context7, figma, playwright.
3. meta-setup/SKILL.md no longer asks the user to install Figma or Playwright separately.
4. README.md mentions the three bundled connectors.
5. Manual smoke test (deferred to user): re-install plugin via Claude desktop, open Plugin Directory, verify "Connectors: 3" with all three names listed.

## Risk assessment

- **Risk**: Playwright requires Node.js; users without Node will see npx errors on plugin enable. **Mitigation**: meta-setup's environment detection already checks for Node 18+; if absent, message tells user how to install. CHANGELOG also notes the prerequisite.
- **Risk**: Figma MCP at `mcp.figma.com` requires Figma account / Figma desktop running with Dev Mode. Users without Figma see the MCP fail. **Mitigation**: MCP fails gracefully (returns errors when called); doesn't break unrelated plugin work. meta-setup messaging clarifies.
- **Risk**: Figma's HTTP URL changes in the future and our hardcoded copy goes stale. **Mitigation**: we read it directly from the official plugin today; if it changes, we sync. The actual MCP server is owned by Figma, not us — they're unlikely to change URLs frequently.
- **Risk**: Auto-installing Playwright via `npx @playwright/mcp@latest` triggers an npm download on every plugin enable. **Mitigation**: npx caches; first install is the only slow one. Same behavior as the official Anthropic Playwright plugin. Acceptable.
- **Risk**: User has the official Figma or Playwright Anthropic plugin already installed, then our plugin enables a duplicate MCP. **Mitigation**: MCP server names are unique within a plugin namespace (per Anthropic docs); Claude Code dedupes by URL/command. Worst case: two `figma` MCPs register and the user picks. Not a hard error.

## Verification (end-to-end)

After v4.3.0 lands:
1. JSON manifests valid; all read 4.3.0.
2. plugin.json `mcpServers` has 3 entries.
3. meta-setup/SKILL.md reflects bundled status; no Figma/Playwright install prompts.
4. README banner v4.3.0; bundled connectors mentioned.
5. Manual smoke test (deferred to user): reinstall plugin, check Plugin Directory shows `Connectors: 3 (context7, figma, playwright)`.

## Questions for user

None — option B (bundle Figma + Playwright, keep Figma Console optional) approved. Configs locked from official Anthropic plugins. MINOR bump to v4.3.0. Ready to implement on approval.
