# v2.6.6 — Fix "MEMORY.md does not exist" red error on /de:start for fresh projects

## Context

A Windows tester reported a confusing red error during /de:start: `File does not exist: C:\Users\Admin\.claude\projects\D--Coding-projects-mexico-2/memory/MEMORY.md`. Investigation:

- **Path is not mangled.** `D--Coding-projects-mexico-2` is the standard Claude Code auto-memory slug for `D:\Coding projects\mexico-2`. Auto-memory dir is `~/.claude/projects/<slug>/memory/`.
- **Per Anthropic docs**: MEMORY.md auto-loads first 200 lines on every session — Claude Code handles it. The plugin's CLAUDE.md instructs Claude to **Read MEMORY.md** via the Read tool, which is **redundant** AND breaks for brand-new projects where Claude Code hasn't created the dir yet (the dir is lazily created on first Claude Code write).
- **v2.6.1 H3b** added a memory-seeding step to `meta-setup/SKILL.md` lines 187-237, but it's text-only instructions for Claude to follow during setup. Order conflicts: Claude can read auto-memory before the seeding step runs, surfacing the red error.
- **Slug encoding is not safe to mirror** in a bash script: cross-platform (Mac vs Windows path forms), git-root vs working-dir derivation, and observed inconsistencies (e.g., user's local memory at `/Users/merlenkov/.claude/projects/-Users-merlenkov/memory/` from `/Users/merlenkov` rather than the git repo root). Trying to seed inside the auto-memory dir is fragile.

User picked option A: **Seed + drop redundant reads**. Implementation pivots the seeding location to `.design-engineer-plugin/memory/` (plugin-local, no slug encoding) instead of the auto-memory dir, but preserves the intent: no more "File does not exist" red error, no more redundant reads.

## Architectural decisions

- **Stop the plugin from issuing `Read MEMORY.md` instructions.** Per docs, MEMORY.md is auto-loaded by Claude Code itself. The plugin doesn't need to call Read on it — and shouldn't, since the file may not exist yet.
- **Move plugin-defined memory files (`project-map.md`, `debug-solutions.md`) to `.design-engineer-plugin/memory/`** (plugin-local, project-side, already created during meta-setup via `init-project-structure.sh`). No slug encoding needed. Auto-memory MEMORY.md is left to Claude Code entirely.
- **Seed skeletons during scaffolding**, before any read attempt — extend `init-project-structure.sh` so the dir + skeleton files exist atomically when the plugin sets up a project.
- **Add a defensive read pattern to CLAUDE.md** (belt and suspenders): "before reading any plugin memory file, check existence first; if absent, skip silently — fresh project, nothing to read."

## Phase 1: Implementation

**Objective**: Drop redundant MEMORY.md reads, move plugin-defined memory files to plugin-local dir, seed during scaffolding, update all references, ship as v2.6.6.

**Depends on**: none

**Files to modify**:
- `skills/meta-setup/scripts/init-project-structure.sh` — extend to mkdir `.design-engineer-plugin/memory/` and seed `project-map.md` + `debug-solutions.md` skeletons (idempotent: skip if already exist). Drop any auto-memory dir creation logic if present.
- `skills/meta-setup/SKILL.md` (lines 187-237) — replace the auto-memory seeding section with a pointer to `.design-engineer-plugin/memory/` (now seeded by the script). Drop step that asks Claude to write skeleton files.
- `CLAUDE.md` (Memory Management section, lines 463-540) — drop the "Read MEMORY.md" instruction (auto-loaded). Update `project-map.md` and `debug-solutions.md` paths to `.design-engineer-plugin/memory/`. Add the defensive read pattern: "check existence with `Bash test -f` or `Glob` before Read; if absent, skip silently."
- `skills/meta-orchestrator/SKILL.md` — update any references to old auto-memory paths.
- `skills/ux-story-panels/SKILL.md` — same.
- `skills/dev-agent-setup/SKILL.md` — same.
- `README.md` — update FAQ #14 (memory system) if it mentions auto-memory paths for plugin files.
- `.claude-plugin/plugin.json`, `marketplace.json` — bump 2.6.5 → 2.6.6.
- `CHANGELOG.md` — add 2.6.6 entry under both **Changed** (paths moved, redundant reads dropped) and **Fixed** (the red error).
- README banner v2.6.5 → v2.6.6.

**Reuse**:
- `init-project-structure.sh` already creates `.design-engineer-plugin/` and `.design-engineer-plugin/dependencies.yaml`. Add memory-dir creation alongside (sibling). Use the same `[ -f file ] && echo skip || echo create` idempotency pattern that `dependencies.yaml` block already uses.
- Existing skeleton content from `meta-setup/SKILL.md` lines 195-237 (good content, just relocated).

**Checklist**:
- [ ] Audit all plugin files for `~/.claude/projects/<project>/memory/` and `MEMORY.md` references; produce a list before editing
- [ ] Extend `init-project-structure.sh` to seed `.design-engineer-plugin/memory/{project-map.md,debug-solutions.md}` (idempotent)
- [ ] Update `meta-setup/SKILL.md` to drop the auto-memory write block and reference the new plugin-local path
- [ ] Update `CLAUDE.md` Memory Management: drop "Read MEMORY.md" instructions, update plugin-local paths, add defensive existence-check pattern
- [ ] Update `skills/meta-orchestrator/SKILL.md`, `skills/ux-story-panels/SKILL.md`, `skills/dev-agent-setup/SKILL.md` references
- [ ] Update `README.md` FAQ if it references auto-memory paths for plugin files
- [ ] Bump `.claude-plugin/plugin.json` and `marketplace.json` to 2.6.6
- [ ] Add CHANGELOG `[2.6.6] – 2026-04-26` entry (Fixed + Changed)
- [ ] Bump README banner to v2.6.6
- [ ] Validate: `python3 -m json.tool` on plugin.json, marketplace.json
- [ ] Smoke-test: run `init-project-structure.sh` in a fresh `tmp/` dir; verify `.design-engineer-plugin/memory/{project-map.md,debug-solutions.md}` are created with skeleton content; re-run; verify it skips (idempotent)
- [ ] Grep verify: 0 remaining references to `~/.claude/projects/<project>/memory/project-map.md` or `~/.claude/projects/<project>/memory/debug-solutions.md` outside CHANGELOG and `plans/archive/`

**QA**:
1. `mkdir /tmp/de-test && cd /tmp/de-test && bash /Users/merlenkov/design-engineer-plugin/skills/meta-setup/scripts/init-project-structure.sh` → verify it creates the deliverables tree AND `.design-engineer-plugin/memory/project-map.md` + `.design-engineer-plugin/memory/debug-solutions.md`.
2. Re-run the same command → verify no overwrites, idempotent skip messages.
3. `cat .design-engineer-plugin/memory/project-map.md` → verify skeleton content matches what we relocated from meta-setup/SKILL.md.
4. JSON validity: `python3 -m json.tool .claude-plugin/plugin.json` and `marketplace.json`.
5. Grep for stale references: `grep -rn "claude/projects.*memory" /Users/merlenkov/design-engineer-plugin/ --include="*.md"` should show only CHANGELOG (historical) and `plans/archive/` (also historical) lines.
6. Open the plugin in a fresh session in a brand-new dir to manually verify no red "File does not exist" appears (deferred to user).

## Risk assessment

- **Risk**: existing plugin users have notes in `~/.claude/projects/<slug>/memory/project-map.md` and `debug-solutions.md` they care about. **Mitigation**: CHANGELOG includes a one-line migration note: "If you have existing notes in `~/.claude/projects/<slug>/memory/project-map.md` or `debug-solutions.md`, copy them to `.design-engineer-plugin/memory/` in your project — the plugin no longer reads from auto-memory for these files."
- **Risk**: missing a reference in some agent file → broken link. **Mitigation**: pre-edit grep audit (in checklist) lists every file to touch; post-edit grep verifies zero stale references.
- **Risk**: behavior divergence between MEMORY.md (auto-loaded by Claude Code) and the plugin's project-map.md (project-local, on-demand read). **Mitigation**: CLAUDE.md will explicitly say "MEMORY.md is auto-loaded by Claude Code — do NOT call Read on it. project-map.md and debug-solutions.md are plugin-local — Read them on demand, after checking existence with Bash `test -f` or Glob."
- **Risk**: Claude Code's auto-memory MEMORY.md might still be referenced by agents who write to it. **Mitigation**: keep the agent-side write instructions advisory (already advisory per v2.6.1) — Claude Code's auto-memory writes happen via Claude Code itself, not via the plugin's Read/Write tools.

## Verification (end-to-end)

After v2.6.6 lands:
1. Plugin manifests valid, all read 2.6.6.
2. `init-project-structure.sh` creates `.design-engineer-plugin/memory/` with the two skeleton files when run in a fresh dir.
3. Grep across plugin files: 0 instances of `Read MEMORY.md` or auto-memory paths for project-map.md / debug-solutions.md outside CHANGELOG and `plans/archive/`.
4. Manual smoke test in a fresh project (deferred to user) — no "File does not exist" red error during /de:start.

## Questions for user

None — option A approved with the technical pivot to plugin-local memory dir clarified above. Auto-memory MEMORY.md untouched (Claude Code manages it). Plugin-defined memory files relocated to plugin-local. Seeding moves into the existing scaffolding script. Ready to implement on approval.
