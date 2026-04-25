# Round B finish: H2 verify + H3 + M1 + L1 + L2 → v2.6.1

## Context

Round B audit surfaced 7 findings. v2.5.1 + v2.5.0 + v2.6.0 closed H1 fully and M2 incidentally. This patch closes the 4 remaining items in one consistency/honesty pass:

- **H2** — Verified clean. No fix needed (remaining `status.md` mentions are intentional: user-side dev-status guidance examples, the "don't write here" warning in compound-documenter, and the legitimate `project-status` deliverable name).
- **H3** — Memory system writes (`MEMORY.md`, `project-map.md`, `debug-solutions.md` in `~/.claude/projects/<project>/memory/`) are pure model-discretion. CLAUDE.md tells Claude to update them; nothing enforces it. Different problem than v2.6.0's H1 because these files live in **Claude Code's built-in auto-memory directory** (not in the plugin or project), so neither `memory: project` agent memory nor a project-level hook can target them. The honest fix is downscoping the claim and seeding skeleton files.
- **M1** — `{deliverables_path}` in 44 skill mentions is a template token, not a config-readable path. `deliverables_path` field in config.yaml is set but never read by any code. The "configurable path" claim is fiction. Honest fix: hardcode `documents/design/` everywhere, drop the configurability claim, keep the config field as a future hook (clearly marked).
- **L1** — Root `.mcp.json` duplicates `plugin.json mcpServers.context7`. Per docs the duplicate is redundant for a self-installing plugin; the `plugin.json` declaration is sufficient.
- **L2** — Figma plugin functions referenced 39 times. Most mentions are inside `ui-figma-guide` and related skills which set the context "if Figma is connected" at the start. A handful of mentions in commands/agents lack the hedge — small surgical pass.

PATCH bump 2.6.0 → 2.6.1. No new features, all consistency/honesty fixes.

## Architectural decisions

- **For H3**: Downscope rather than try to enforce. Auto-memory writes happen on Claude's discretion; that's how Claude Code is designed. Claim accordingly. Plus, add a one-time skeleton-seed step in meta-setup so the files exist with starter structure (better than relying on Claude to create them on first need).
- **For M1**: Hardcode `documents/design/` everywhere (replacing `{deliverables_path}` template tokens). Remove "configurable path" language from CLAUDE.md and config files. Keep the `deliverables_path` config field marked as "reserved — future use" so we don't break existing configs.
- **For L1**: Delete root `.mcp.json`. plugin.json's mcpServers loads context7 when the plugin is enabled — the .mcp.json was redundant. The plugin REPO doesn't need its own context7 declaration; users installing the plugin get it from plugin.json.
- **For L2**: Audit the few unhedged mentions in commands/agents and add "if Figma plugin is connected" where missing. Don't touch reference docs inside `ui-figma-guide/references/` — those are loaded only when the skill runs, which already establishes Figma context.

## Phase 1: All five fixes + version bump

**Objective**: Land v2.6.1 in one phase. Single commit.

**Depends on**: none

**Files to modify** (grouped by finding):

H3 (memory downscope + seeding):
- `CLAUDE.md` — soften "should always" / "must" memory-update language to "when relevant"; remove the implication that memory writes are reliable. Add a note that memory updates are advisory.
- `skills/meta-setup/SKILL.md` Step 5 ("Initialize Auto-Memory") — add a small seeding step that writes skeleton MEMORY.md/project-map.md/debug-solutions.md if they don't exist (so the structure is in place before any agent tries to update).

M1 (path consistency):
- Replace every `{deliverables_path}/` with `documents/design/` in: `agents/compound-documenter.md`, `agents/frontend-implementer.md`, `commands/de/design.md`, `commands/de/dev.md`, `commands/de/document.md`, `commands/de/prototype.md`, `skills/dev-prototyping/SKILL.md`, `skills/meta-setup-configure/SKILL.md`, `skills/meta-setup/references/setup-checklist.md`, `skills/meta-setup/SKILL.md`, `skills/ui-references-moodboard/references/curated-references.md`, plus the ~30+ ux/ui/dev/psych skill files that use the placeholder.
- Update `CLAUDE.md` to remove "deliverables_path is configurable" implications.
- Mark `deliverables_path` in `config.yaml` template as "reserved" (clarifying comment).

L1 (remove redundant .mcp.json):
- Delete: `.mcp.json` (root)

L2 (Figma hedge audit):
- Find the few unhedged Figma function mentions in `commands/` and `agents/` and add "if Figma plugin is connected" where missing.

Versioning:
- `.claude-plugin/plugin.json` — 2.6.0 → 2.6.1
- `.claude-plugin/marketplace.json` — same
- `CHANGELOG.md` — add 2.6.1 entry
- `README.md` — banner v2.6.0 → v2.6.1

**Reuse**:
- For M1 templating fixes: use `sed` for the global replace, then verify clean.
- For H3 seeding: the existing init-project-structure.sh has a similar pattern (check-and-create); follow that pattern.
- For L1: just `git rm .mcp.json` and `git status` to confirm.
- For L2: grep + targeted edits.

**Checklist**:
- [ ] H3a: Soften CLAUDE.md memory language (Memory Management section). Replace prescriptive "must" / "always" with advisory phrasing where appropriate.
- [ ] H3b: Add a memory-seed step to meta-setup SKILL.md (touch MEMORY.md, project-map.md, debug-solutions.md with skeleton headers if they don't exist).
- [ ] M1a: Replace `{deliverables_path}/` with `documents/design/` across all skill/agent/command files. Run a single sed pass.
- [ ] M1b: Update CLAUDE.md to remove "configurable path" claims. Mark `deliverables_path` in the config.yaml template as "reserved — current path is fixed at documents/design/".
- [ ] L1: Delete root `.mcp.json`. Verify plugin.json still has the context7 declaration.
- [ ] L2: Grep for unhedged Figma function references in commands/agents/, add "if Figma plugin connected" where missing.
- [ ] Bump versions in plugin.json + marketplace.json (2.6.0 → 2.6.1).
- [ ] Add CHANGELOG 2.6.1 entry.
- [ ] Bump README banner.
- [ ] Validate manifests with `python3 -m json.tool`.
- [ ] Verify by grep: `grep -rn "{deliverables_path}" skills/ commands/ agents/` returns 0; `ls .mcp.json` fails (deleted).

**QA**:
```bash
# JSON validity
python3 -m json.tool .claude-plugin/plugin.json > /dev/null && echo "plugin.json OK"
python3 -m json.tool .claude-plugin/marketplace.json > /dev/null && echo "marketplace.json OK"

# .mcp.json deleted
test ! -f .mcp.json && echo "L1: .mcp.json deleted"

# {deliverables_path} cleaned (M1)
grep -rn "{deliverables_path}" skills/ commands/ agents/ 2>&1 | head
# expected: empty

# Memory skeleton seeded (H3)
grep -nE "MEMORY\.md|project-map\.md|debug-solutions\.md" skills/meta-setup/SKILL.md | head
# expected: at least one mention of "create skeleton" or similar
```

## Risk assessment

- **Risk (M1)**: Hardcoding paths breaks future configurability. Mitigation: keep `deliverables_path` in config.yaml as "reserved" — when someone wants to actually wire it up, they have a marker. Until then, the docs match reality.
- **Risk (L1)**: Removing `.mcp.json` breaks the plugin REPO's own MCP setup (since the repo is itself a Claude Code project, the user develops the plugin here). Mitigation: plugin.json's mcpServers loads context7 when the plugin is enabled. If the user has the plugin enabled (which they do — it's their plugin), context7 is available via plugin.json. The .mcp.json was a duplicate.
- **Risk (H3)**: Downscoping memory claims may surprise users who relied on the prior promise. Mitigation: the prior promise wasn't enforced anyway — users already experienced advisory behavior. Honest language matches actual experience. Plus the seeded skeleton files give them a starting structure they can manually maintain.
- **Risk (L2)**: Adding "if Figma plugin connected" hedges to many places might over-engineer. Mitigation: only touch unhedged mentions in commands/agents (high-traffic paths). Skill reference files inside ui-figma-guide already establish Figma context.

## Verification (end-to-end)

After v2.6.1 lands:
1. JSON manifests still valid; version reads 2.6.1.
2. No `{deliverables_path}` template tokens remain in skills/commands/agents.
3. `.mcp.json` no longer exists at the repo root.
4. Memory section in CLAUDE.md reads as advisory (not prescriptive "must always").
5. Meta-setup creates skeleton memory files on first run.
6. README banner reads v2.6.1.

## Questions for user

None pending — the user requested all four remaining items in one plan. Architecture choices on each are settled per the rationale above. Auto mode + the scratchpad workflow continues as before (project plans/ gets the copy after approval).
