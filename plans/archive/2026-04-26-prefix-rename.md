# v4.0.0 — Rename `/de:` command prefix to `/design-engineer:`

## Context

Beta tester reported that typing `/de:` triggered Claude Code's auto-naming logic to interpret `de` as the German language code, producing chat titles like "Start German language feature". Real UX papercut for every chat using this plugin.

User picked: rename the prefix entirely (rather than adding a sessionTitle override). Quote: "i think we just need to rename it to design-engineer: or smth". This solves the German confusion at the root: a multi-word prefix like `design-engineer:` is unambiguous to language-detection heuristics.

This is a **breaking change** for existing testers — their `/de:start` muscle memory and any scripts/docs invoking the old prefix will break. Plugin is in beta, so all users are testers who can retype the new prefix. Migration is documented in CHANGELOG.

Surface area: 42 files / 209 lines reference `/de:` across the active repo. Plus the command directory itself needs renaming and each command's frontmatter `name:` field updated.

Per CLAUDE.md versioning rules, "Breaking changes" → MAJOR bump → **v4.0.0** (the second MAJOR in the same beta cycle, but justified by the breaking nature).

## Architectural decisions

- **New prefix is `/design-engineer:`** — matches the plugin name, distinctive, not interpretable as a language code.
- **Drop `/de:` entirely** (no deprecated alias). Beta phase, simplest, no double-maintenance burden of duplicate command files. Users retype.
- **Move command directory**: `commands/de/` → `commands/design-engineer/`. Slash-command resolution is directory-based, so the directory rename IS the command-prefix rename.
- **Update command frontmatter `name:` fields** in all 8 files (`de:start` → `design-engineer:start`, etc.).
- **Bulk sed** `/de:` → `/design-engineer:` across all active files (skip `plans/archive/` — historical accuracy).
- **No automated migration tool** — beta testers just type the new prefix. CHANGELOG documents the rename.
- **Hook script names stay** (`de-start-state.sh`, `de-tdd-hook.js`, etc.) — those are internal file paths, never invoked as slash commands. No need to rename those files. Only the command-invocation prefix changes.

## Phase 1: Rename + bulk migrate + ship v4.0.0

**Objective**: Rename the `/de:` prefix to `/design-engineer:` across the entire active codebase, update directory layout and command frontmatter, ship v4.0.0.

**Depends on**: none

**Files to migrate** (path replacements + directory move):

Directory move:
- `mv commands/de/ commands/design-engineer/`

Frontmatter updates (per command file, in the new location):
- `commands/design-engineer/start.md` — frontmatter `name: de:start` → `name: design-engineer:start`
- Same for: design.md, dev.md, document.md, help.md, prototype.md, review.md, stop.md

Bulk sed (across all `.md`, `.sh`, `.json`, `.py`, `.js` in `commands/`, `agents/`, `skills/`, `hooks/`, `evals/`, plus root `CLAUDE.md` and `README.md`, **skipping `plans/archive/`**):
- `/de:` → `/design-engineer:`

Versions and docs:
- `.claude-plugin/plugin.json` — bump 3.0.0 → 4.0.0
- `.claude-plugin/marketplace.json` — bump 3.0.0 → 4.0.0
- `CHANGELOG.md` — `[4.0.0] – 2026-04-26 — BREAKING` entry with rename rationale and migration note
- `README.md` — bump banner v3.0.0 → v4.0.0; update any command examples in body

**Reuse**:
- The same sed-with-find-xargs pattern used in v3.0.0 path migration. macOS BSD sed: `sed -i '' 's|/de:|/design-engineer:|g'`.
- Existing command frontmatter pattern (already has `name:` field; just changes the value).

**Checklist**:
- [ ] `mv commands/de/ commands/design-engineer/` (preserves git history via `git mv` semantics)
- [ ] Update `name:` frontmatter in all 8 command files in the new directory
- [ ] Run sed pass: `/de:` → `/design-engineer:` across `commands/ agents/ skills/ hooks/ evals/` plus root `CLAUDE.md` and `README.md`
- [ ] Audit grep: 0 remaining `/de:` references in active files (only `plans/archive/` and `CHANGELOG.md` historical entries should match)
- [ ] Bump `.claude-plugin/plugin.json` 3.0.0 → 4.0.0
- [ ] Bump `.claude-plugin/marketplace.json` 3.0.0 → 4.0.0
- [ ] Add CHANGELOG `[4.0.0] – 2026-04-26 — BREAKING` entry with rename rationale and clear migration instruction (just retype new prefix)
- [ ] Bump README banner to v4.0.0
- [ ] Validate JSON manifests
- [ ] Verify each renamed command file has correct frontmatter `name:`

**QA**:
1. `python3 -m json.tool` on plugin.json and marketplace.json.
2. `ls commands/` shows `design-engineer/` directory (not `de/`); contents are 8 .md files with renamed frontmatter.
3. `grep -rn "/de:" --include='*.md' --include='*.sh' --include='*.json' --include='*.py' --include='*.js' . | grep -v 'plans/archive\|.git/\|CHANGELOG.md'` returns 0 matches.
4. `grep -rn "name: de:" commands/` returns 0 matches (all frontmatter updated).
5. Manual reasoning trace: a hypothetical user typing `/design-engineer:start` → Claude Code finds `commands/design-engineer/start.md` → loads it → executes the start command. CLAUDE.md / README documentation references match. No `/de:` references survive in active flow.
6. Versions all read 4.0.0.

## Risk assessment

- **Risk**: existing tester muscle memory broken. **Mitigation**: CHANGELOG migration entry says explicitly "the only change is the prefix; type `/design-engineer:` instead of `/de:`. No file moves needed in user projects." Plus tab-completion in Claude Code makes the longer prefix manageable.
- **Risk**: sed catches `/de:` in unintended contexts (e.g., a code example, a regex, a URL fragment). **Mitigation**: post-sed grep audit + spot-check ~5 randomly modified files. The `/de:` prefix is distinctive enough that false positives should be rare.
- **Risk**: hook script filenames (`de-start-state.sh`, `de-tdd-hook.js`, etc.) might be confusing to keep on `de-` prefix while commands move to `design-engineer:`. **Mitigation**: those files are internal paths, never invoked as commands. Renaming them is out of scope (would need updates to hooks.json plus more file moves with no user-visible benefit). Note in CHANGELOG that internal hook filenames retain `de-` prefix for historical continuity.
- **Risk**: another MAJOR bump so soon after v3.0.0 churns the version number for testers. **Mitigation**: CHANGELOG explains both v3.0.0 and v4.0.0 as the natural conclusion of two distinct beta-feedback items; both are safe to ship together since both are folder/prefix renames that need a one-time tester action.
- **Risk**: any documentation outside this repo (e.g., user blog posts, README screenshots) still shows `/de:`. **Mitigation**: out of scope — the plugin's own docs are the authoritative source post-bump.

## Verification (end-to-end)

After v4.0.0 lands:
1. JSON manifests valid; all read 4.0.0.
2. `commands/design-engineer/` exists with 8 command files; each has `name: design-engineer:<command>` in frontmatter.
3. Grep across active plugin files: 0 references to `/de:` outside CHANGELOG (intentional historical entries) and `plans/archive/` (historical plans).
4. README banner v4.0.0; CLAUDE.md command-naming-convention section updated.
5. Manual smoke test (deferred to user): in any project, type `/design-engineer:start` and verify Claude Code finds and runs the command. Verify the resulting chat title is no longer "Start German language feature" or similar nonsense.

## Questions for user

None — option "rename to design-engineer:" approved. Locking new prefix as `/design-engineer:`. MAJOR bump to v4.0.0. Internal hook filenames stay on `de-` prefix (out of scope). Ready to implement on approval.
