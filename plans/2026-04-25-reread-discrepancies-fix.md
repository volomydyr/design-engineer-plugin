# Round A: Reread-discrepancies fix bundle (v2.5.1)

## Context

During the comprehensive plugin reread at the start of this session, 7 discrepancies surfaced — stale text, mismatched paths, broken routing references, undercounted skills. None block the plugin from running, but each represents an internal-consistency gap the user wants closed before public launch. Bundling them into a single patch release.

The 7 items, verified by grep:

1. **`commands/de/prototype.md` line 17** — references mode `(guided/god)`. Stale leftover from before v2.0.0 renamed "God mode" → "Autopilot." Should be `(guided/autopilot)`.
2. **`commands/de/start.md` lines 15–18** — routes on 3 states (`new_to_plugin`, `returning_with_resume`, `returning_no_resume`) plus "not found" fallback. The actual hook (`hooks/de-start-state.sh`) emits only 2 states (`new_to_plugin`, `existing_project`) and emits no `DESIGN_ENGINEER_PROJECT_STATE` at all when config has `project_type: new`. So the resume-state routing is dead. The detect-state.sh script's vocabulary matches start.md's expectation; the hook's vocabulary does not.
3. **`skills/meta-statusline/SKILL.md` lines 127–128** — references `/de:start install` and `/de:start uninstall`. Stale leftover from v1.4.0's `/de:statusline install` syntax that no longer exists. The current command is just `/de:start`.
4. **`skills/meta-setup/SKILL.md` lines 134–151** — Step 4's documented folder scaffold tree is from v1.x. It shows: `foundation/ research/ design/ psych/ dev/ solutions/`. The actual `init-project-structure.sh` creates: `foundation/ research/ research/archive/ planning/ design/ design/references/ design/story-panels/ prototype/ psych/ reviews/ dev/`. CHANGELOG v2.4.0 explicitly removed `solutions/`. The skill doc lies about what gets created.
5. **`skills/meta-setup/SKILL.md` lines 150, 215, 271** — references `.dependencies.yaml` at `{deliverables_path}/.dependencies.yaml` (legacy). The init script creates it at `.design-engineer-plugin/dependencies.yaml` (canonical). The config it writes (line 179) correctly says `.design-engineer-plugin/dependencies.yaml`. So the skill doc contradicts itself in the same file.
6. **`skills/meta-orchestrator/SKILL.md` line 128** — references `documents/design/.dependencies.yaml` (legacy location). Should be `.design-engineer-plugin/dependencies.yaml`.
7. **`README.md`** — headline says `8 commands, 54 skills, 9 agents` (3 places: lines 41, 66, 259). Public-facing tables sum to 49 (4 Meta + 9 UX research + 8 UX design + 14 Psych + 7 UI + 7 Dev). Actual SKILL.md file count is 53. `ui-landing-page` (added in v2.4.0) exists but isn't in any README table. Numbers don't agree anywhere.

## Architectural decisions

- **For #2 (routing states mismatch)**: fix the **hook**, not start.md. The hook is the source of truth (it runs first, injects context). Restore the resume-state distinction the architecture originally intended — for `project_type: new`, the hook should emit `returning_with_resume` if the config has a `resume:` section, otherwise `returning_no_resume`. Then start.md's existing routing works as written. This restores a feature the user wanted (resume-where-you-left-off) that's been broken since v2.0.0.
- **For #4 (folder scaffold doc)**: rewrite the scaffold tree in meta-setup SKILL.md to match init-project-structure.sh exactly. Treat init-project-structure.sh as the source of truth (it's the executable code; the doc is description).
- **For #5 + #6 (dependency path consistency)**: standardize all docs and writers on `.design-engineer-plugin/dependencies.yaml` (the canonical path the init script creates). Keep the dual-path readers (session_dep_summary.py, de-postcompact-hook.sh) as backwards-compat for users who upgraded from a v1.x layout. Update all docs that say `documents/design/.dependencies.yaml` or `{deliverables_path}/.dependencies.yaml`.
- **For #7 (README counts)**: add `ui-landing-page` to the UI design table (UI design becomes 8). Update headline `54 skills` → `50 skills` everywhere (matches the public-table sum: 4+9+8+14+8+7=50). The 3 internal meta-setup-* helpers stay invisible since they're hook-driven internals — users don't invoke them.
- **PATCH bump 2.5.0 → 2.5.1.** All changes are doc fixes + one tiny hook update (no new features, no behavior change beyond restoring the dead resume-state routing). Per CLAUDE.md: PATCH is "Bug fixes, doc updates, minor improvements." Fits.
- **Single phase, single commit.** These are all surgical and independent; no dependencies between them. A phased per-item approval would be overkill.

## Phase 1: All seven fixes + version bump

**Objective**: Close the 7 reread-discrepancies in one pass. Single commit.

**Depends on**: none

**Files**:
- Modify: `commands/de/prototype.md` — `(guided/god)` → `(guided/autopilot)` (item #1)
- Modify: `hooks/de-start-state.sh` — for `project_type: new`, emit `returning_with_resume` or `returning_no_resume` based on whether `resume:` section exists in config (item #2)
- Modify: `skills/meta-statusline/SKILL.md` — replace `/de:start install` and `/de:start uninstall` with the correct invocation (item #3)
- Modify: `skills/meta-setup/SKILL.md` — replace the Step 4 folder scaffold tree with the actual structure from init-project-structure.sh; replace 3 references to `{deliverables_path}/.dependencies.yaml` with `.design-engineer-plugin/dependencies.yaml` (items #4 + #5)
- Modify: `skills/meta-orchestrator/SKILL.md` line 128 — `documents/design/.dependencies.yaml` → `.design-engineer-plugin/dependencies.yaml` (item #6)
- Modify: `README.md` — add `ui-landing-page` row to the UI design table; bump section header to `**UI design (8)**`; update headline `54 skills` → `50 skills` in 3 places (item #7)
- Modify: `.claude-plugin/plugin.json` — version 2.5.0 → 2.5.1
- Modify: `.claude-plugin/marketplace.json` — version 2.5.0 → 2.5.1
- Modify: `CHANGELOG.md` — add `## [2.5.1] – 2026-04-25` entry under Fixed
- Modify: `README.md` — bump banner v2.5.0 → v2.5.1

**Reuse**:
- For item #2: the existing `detect-state.sh` script already implements the exact resume-state-detection logic. Copy that logic inline into the hook (as a third elif branch) — don't shell out to detect-state.sh from the hook because the hook needs to be self-contained.
- For item #7: the existing UI design table format and tone — just add a new row.
- For item #4: copy the actual scaffold structure from init-project-structure.sh's output text (the script's own README-printout at the end accurately documents what it creates).

**Checklist**:
- [ ] `commands/de/prototype.md`: `(guided/god)` → `(guided/autopilot)`
- [ ] `hooks/de-start-state.sh`: in the `project_type: new` branch (currently Case 3 — "inject plugin root only"), check for `resume:` section in config and emit `returning_with_resume` or `returning_no_resume` accordingly
- [ ] `skills/meta-statusline/SKILL.md`: replace `/de:start install` / `/de:start uninstall` with current correct invocation
- [ ] `skills/meta-setup/SKILL.md` Step 4: rewrite the folder scaffold tree to match init-project-structure.sh exactly
- [ ] `skills/meta-setup/SKILL.md`: fix all 3 references to `{deliverables_path}/.dependencies.yaml` → `.design-engineer-plugin/dependencies.yaml`
- [ ] `skills/meta-orchestrator/SKILL.md` line 128: `documents/design/.dependencies.yaml` → `.design-engineer-plugin/dependencies.yaml`
- [ ] `README.md`: add `ui-landing-page` row to UI design table with description matching v2.4.0 changelog
- [ ] `README.md`: bump UI design section header `**UI design (7)**` → `**UI design (8)**`
- [ ] `README.md`: replace `54 skills` with `50 skills` in 3 places
- [ ] Bump versions in plugin.json and marketplace.json (2.5.0 → 2.5.1)
- [ ] Add CHANGELOG 2.5.1 entry under Fixed listing all 7 items
- [ ] Bump README banner v2.5.0 → v2.5.1
- [ ] Validate JSON manifests
- [ ] Smoke-test the hook update with `bash -n`

**QA**: Run these checks after the phase:

```bash
python3 -m json.tool .claude-plugin/plugin.json > /dev/null && echo OK
python3 -m json.tool .claude-plugin/marketplace.json > /dev/null && echo OK
bash -n hooks/de-start-state.sh && echo "hook syntax: OK"

# Confirm zero stale strings remain
grep -nE "guided/god" commands/   # should be empty
grep -nE "/de:start install|/de:start uninstall" skills/   # should be empty
grep -nE "solutions/" skills/meta-setup/   # should be empty
grep -nE "documents/design/\.dependencies\.yaml" skills/   # should be empty
grep -c "54 skills" README.md   # should be 0

# Confirm new strings are present
grep -nE "guided/autopilot" commands/de/prototype.md
grep -c "returning_with_resume\|returning_no_resume" hooks/de-start-state.sh   # should be >=2
grep -c "ui-landing-page" README.md   # should be >=1
grep -c "50 skills" README.md   # should be 3
```

## Risk assessment

- **Risk**: The hook update for item #2 could break routing on malformed configs.
  **Mitigation**: Use `grep -q "^resume:"` (same primitive detect-state.sh uses). Default to `returning_no_resume` on ambiguity. start.md's "not found → load meta-setup" fallback catches anything else.
- **Risk**: README count update misses a hidden reference.
  **Mitigation**: Smoke-test `grep -c "54 skills" README.md` returns 0 after the change.
- **Risk**: Renaming meta-setup scaffold doc breaks something that parses it.
  **Mitigation**: Nothing parses skill markdown for folder structure — humans read it.

## Verification (end-to-end)

Doc fixes verified by grep. Hook update verified by `bash -n` plus a smoke run. The resume-state routing fix can be tested by creating a test config with a `resume:` section and confirming the hook emits `returning_with_resume`. Version bump propagates via the marketplace mechanism already validated in v2.4.1.

## Questions for user

None pending — all 7 items have a clear correct fix that matches existing intent. The architectural choice on item #2 (fix the hook to match start.md/detect-state.sh, vs. fix start.md to match the hook) is settled in favor of fixing the hook because the original design clearly intended resume-state routing (detect-state.sh exists and emits these values; start.md routes on them) — the hook's narrower vocabulary was the regression.
