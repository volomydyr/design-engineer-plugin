# v3.0.0 — Restructure project artifact folders (drop documents/, fix design/design/, move prototype/ to top)

## Context

Beta tester reported three structural complaints about the deliverables folder layout:

1. `documents/` is a redundant wrapper — it only ever contains `design/`, so the extra level adds zero information.
2. `design/design/` is a confusing double-word path — the inner `design/` is a category for design-craft work (references, story panels, journey, bias audit, ethics, behavior map) that lives alongside foundation/research/planning/etc., but using the same word at two depths reads as a typo.
3. `prototype/` doesn't belong inside `documents/` because (a) a prototype isn't really a document, (b) it's the most-viewed artefact and burying it makes it hard to find.

User picked **Option A** (full restructure): drop `documents/`, rename inner `design/` to a distinct category name, move `prototype/` to project root.

This is a **breaking change for existing users** — their projects have content in old paths. Plugin is in beta phase, so all users are testers who can handle a one-time `mv` migration. Migration command goes in CHANGELOG. Per CLAUDE.md versioning rules ("MAJOR (1.0.0 → 2.0.0): Breaking changes, major reorganization") this is a MAJOR bump → **v3.0.0**.

Surface area: 40 files reference `documents/design/`, 13 reference `design/design/`, 7 reference `design/prototype/`. Bulk path migration with sed, file-by-file verification afterward.

## Architectural decisions

- **Drop `documents/` wrapper entirely.** Top-level becomes `design/` (the deliverables tree) plus `prototype/` (the artefact) plus existing `plans/`, `.claude/`, `.design-engineer-plugin/`.
- **Rename inner `design/` to `craft/`.** Captures "design-craft work" (references, story panels, journey maps, bias audit, ethics, behavior map). Short, distinctive, no doubling. Alternatives considered: `visual/` (too narrow — doesn't capture journey maps or ethics work), `aesthetics/` (too narrow), `design-craft/` (verbose), `ui/` (conflicts with broader UI conceptual work, and we already have `ui-*` skill names). `craft/` wins.
- **Move `prototype/` to project root** as a sibling of `design/` and `plans/`. Final shape:
  ```
  project-root/
  ├── .claude/
  ├── .design-engineer-plugin/
  ├── design/
  │   ├── foundation/
  │   ├── research/
  │   ├── planning/
  │   ├── craft/         ← was design/design/
  │   │   ├── references/
  │   │   └── story-panels/
  │   ├── psych/
  │   ├── reviews/
  │   └── dev/
  ├── prototype/         ← was documents/design/prototype/
  └── plans/
  ```
- **Migration order matters for sed.** Most-specific paths first to avoid double-rewriting:
  1. `documents/design/design/` → `design/craft/`
  2. `documents/design/prototype/` → `prototype/`
  3. `documents/design/` → `design/`
- **No automated migration tool.** Beta testers can run `mv documents/design/design design/craft && mv documents/design/prototype prototype && mv documents/design design && rmdir documents` themselves. CHANGELOG documents the exact command.
- **`deliverables_path` config field** stays reserved (already marked as such). Hardcoded path is now `design/` (was `documents/design/`).

## Phase 1: Bulk path migration + scaffolding update + version bump

**Objective**: Migrate all 40+ files to the new structure, update scaffolding script, ship as v3.0.0. Single phase because the changes are interconnected — half-shipping breaks everything.

**Depends on**: none

**Files to migrate** (path replacements):
- All 40 files referencing `documents/design/` (commands, agents, skills, hooks, scripts, README, CLAUDE.md, CHANGELOG)
- All 13 files referencing `design/design/`
- All 7 files referencing `design/prototype/` or `documents/design/prototype/`

**Files to modify** (structural updates):
- `skills/meta-setup/scripts/init-project-structure.sh` — completely rewrite for new layout. Drop `documents/` wrapper creation, replace `design/design/` with `design/craft/`, move `prototype/` mkdir out from under `design/`. Memory-seed paths unchanged (already plugin-local at `.design-engineer-plugin/memory/`).
- `skills/meta-setup/scripts/detect-environment.sh` — verify any path checks still work; update if needed.
- `hooks/de-start-state.sh` — uses `$PLUGIN_ROOT` not project paths, so likely no change; verify.
- `CLAUDE.md` — update Image handling section path (`documents/design/design/images/` → `design/craft/images/`); update any other path mentions.
- `README.md` — bump banner v2.7.0 → v3.0.0; update any folder-tree examples; update FAQ if it mentions old paths.
- `CHANGELOG.md` — add `[3.0.0] – 2026-04-26` entry under **Changed (BREAKING)** with the migration command.
- `.claude-plugin/plugin.json`, `marketplace.json` — bump 2.7.0 → 3.0.0.

**Migration approach**:
1. Run sed across all `.md`, `.sh`, `.json`, `.py`, `.js` files in:
   - `commands/`
   - `agents/`
   - `skills/`
   - `hooks/`
   - root files: `CLAUDE.md`, `README.md`
2. Sed order (most-specific first):
   ```
   sed -i '' 's|documents/design/design/|design/craft/|g'
   sed -i '' 's|documents/design/prototype/|prototype/|g'
   sed -i '' 's|documents/design/|design/|g'
   sed -i '' 's|design/design/|design/craft/|g'  # catches stragglers without docs/ prefix
   sed -i '' 's|design/prototype/|prototype/|g'  # catches stragglers
   ```
3. After sed, do a scan grep to confirm zero remaining references to old paths.
4. Manually rewrite `init-project-structure.sh` (sed alone won't get the structural reordering right).
5. Update CHANGELOG entry to include the migration command for users.
6. Bump versions, README banner.

**Reuse**:
- `init-project-structure.sh` existing structure as the template — keep `set -euo pipefail`, `DELIVERABLES_PATH` arg, idempotency checks for `dependencies.yaml` and memory seeds. Just change the directory tree it creates.
- The folder-creation pattern (`mkdir -p`, `touch .gitkeep`, echo CREATED) used throughout the script.

**Checklist**:
- [ ] Run sed pass 1: `documents/design/design/` → `design/craft/`
- [ ] Run sed pass 2: `documents/design/prototype/` → `prototype/`
- [ ] Run sed pass 3: `documents/design/` → `design/`
- [ ] Run sed pass 4 (stragglers): `design/design/` → `design/craft/`
- [ ] Run sed pass 5 (stragglers): `design/prototype/` → `prototype/` (only where context implies the prototype dir, not the dev-prototyping skill)
- [ ] Manually rewrite `skills/meta-setup/scripts/init-project-structure.sh` for new layout
- [ ] Verify `skills/meta-setup/scripts/detect-environment.sh` doesn't break (any hardcoded paths?)
- [ ] Update CLAUDE.md image-handling path: `documents/design/design/images/` → `design/craft/images/`
- [ ] Update CLAUDE.md "Living Documents" section if it mentions old paths
- [ ] Update README.md (banner, any folder examples, FAQ)
- [ ] Bump `.claude-plugin/plugin.json` 2.7.0 → 3.0.0
- [ ] Bump `.claude-plugin/marketplace.json` 2.7.0 → 3.0.0
- [ ] Add CHANGELOG `[3.0.0] – 2026-04-26` entry under **Changed (BREAKING)** with migration command
- [ ] Validate JSON manifests
- [ ] Smoke-test scaffolding script in fresh tmp dir
- [ ] Final grep audit: 0 remaining references to `documents/design/`, `design/design/` outside CHANGELOG and `plans/archive/`

**QA**:
1. `python3 -m json.tool` on plugin.json and marketplace.json.
2. Smoke test: `mkdir /tmp/de-test-3.0.0 && cd /tmp/de-test-3.0.0 && bash <plugin>/skills/meta-setup/scripts/init-project-structure.sh` → verify `design/{foundation,research,planning,craft,psych,reviews,dev}/`, `prototype/`, `plans/archive/`, `.design-engineer-plugin/{memory/{project-map.md,debug-solutions.md},dependencies.yaml}` all exist. NO `documents/` dir created.
3. Re-run scaffold → verify idempotency (skip messages for existing files).
4. Grep audit: `grep -rn "documents/design\|design/design" <plugin>/ --include="*.md" --include="*.sh" --include="*.json"` should return matches ONLY in CHANGELOG (historical) and `plans/archive/` (historical).
5. Manual reasoning trace: a hypothetical /de:start run on a fresh project creates the new structure; ui-images writes to `design/craft/images/`; landing-page saves to `prototype/landing-page.html`. All paths consistent.

## Risk assessment

- **Risk**: existing testers' projects break on next plugin run because old paths no longer match. **Mitigation**: CHANGELOG includes the exact `mv` migration command at the top of the 3.0.0 entry. Also: the old paths simply don't exist in the new docs, so testers running fresh setups won't conflict. Existing setups need the one-time `mv`.
- **Risk**: sed silently mangles a path that contains the search text in a different context (e.g., a code example, a regex pattern). **Mitigation**: post-sed grep audit catches anomalies; spot-check 5-10 randomly chosen modified files.
- **Risk**: name `craft/` is wrong/confusing for some users. **Mitigation**: it's a directory name, easy to rename in v3.0.1 if feedback hits. The cost of picking the "wrong" word is minor compared to the cost of leaving the structure broken.
- **Risk**: plan files in `plans/archive/` reference old paths; they'd break if we touched them. **Mitigation**: explicitly skip `plans/archive/` in sed runs. Historical plans should remain unchanged.
- **Risk**: `plans/2026-04-26-ui-images-skill.md` (current plan, just landed) references `documents/design/design/images/`. **Mitigation**: include this file in the sed migration since it's still a "current" plan that gets archived later. Same for the new plan we're writing now.
- **Risk**: macOS sed (BSD) vs GNU sed flag differences (`-i ''` vs `-i`). **Mitigation**: use `-i ''` (BSD form) consistently — the user is on macOS (confirmed from CLAUDE.md context).

## Verification (end-to-end)

After v3.0.0 lands:
1. JSON manifests valid, all read 3.0.0.
2. `init-project-structure.sh` creates the new layout in a fresh dir; no `documents/` folder appears.
3. Grep audit returns 0 references to old paths in active plugin files (only CHANGELOG and `plans/archive/`).
4. README banner v3.0.0; folder-tree examples reflect new structure.
5. CHANGELOG has the migration `mv` command for existing testers.
6. Manual smoke test (deferred to user): run `/de:start` on a fresh project, verify new structure; on an existing project, run the migration command and verify subsequent plugin commands still work.

## Questions for user

None — option A approved (full restructure). `craft/` chosen as inner-folder name; locked unless you object before implementation. Migration handled by CHANGELOG-documented `mv` command (no auto-migration tool). MAJOR bump to v3.0.0. Ready to implement on approval.
