# v4.4.0 — Disable Claude Code default attribution + scope plugin attribution to plugin-driven commits

## Context

Beta tester wants Claude Code's default `Co-Authored-By: Claude` trailer disabled on commits and PRs. Per Anthropic docs (`/en/settings`), the mechanism is `attribution: { commit: "", pr: "" }` in `~/.claude/settings.json` — empty strings disable the default trailer. The plugin's own footer ("Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin") is what the user wants to keep, but **only when the plugin is actively driving the commit**, not on every random commit the user makes in unrelated projects.

User refinement: "always disable on plugin install and keep the plugin attribution only when plugin is used, so that the user's commits dont reference this plugin in unrelated projects".

Two changes:
1. **Always disable Claude Code's default attribution** during `/design-engineer:start` setup. No opt-in question — bake into the setup flow. Read existing `~/.claude/settings.json`, set `attribution.commit = ""` and `attribution.pr = ""` (preserving everything else). If the user has customized attribution to a non-default value before, leave it alone (respect user customization).
2. **Scope plugin attribution to plan-driven commits only.** `dev-github-workflow/SKILL.md` Mode 1 (Automatic, runs after a plan-phase approval) keeps the footer. Mode 2 (Manual, runs when user says "commit") drops the footer — that's user-driven work that may be unrelated to the plugin's pipeline.

This is a behavior refinement, no breaking API change. **MINOR bump → v4.4.0** per CLAUDE.md versioning rules (modifies plugin behavior in user-visible ways but doesn't break inputs/outputs).

## Architectural decisions

- **Always-disable on install**, not opt-in. User explicitly chose this over the question pattern. Setup is silent on this — no UX added.
- **Respect prior customization**: read current `~/.claude/settings.json` first. If `attribution` already exists with non-empty `commit` or `pr` strings, the user has customized it; do not overwrite. If `attribution` is absent or already `{commit: "", pr: ""}`, write our default. Same merge-don't-overwrite ethos as the status-line and sound install.
- **Plugin attribution rule**: footer only on plan-driven commits (Mode 1). Mode 2 (manual user `commit`/`push`) treats it like a regular Conventional Commits message without the design-engineer footer.
- **Update CLAUDE.md commit instructions** (line 243) to reflect the scoped attribution: "the plugin attribution footer applies in plan-execution commits only".

## Phase 1: Implement disable-default + scope plugin footer

**Objective**: Wire the always-disable behavior into meta-setup, scope the plugin footer to Mode 1 only, ship as v4.4.0.

**Depends on**: none

**Files to modify**:

- `skills/meta-setup/SKILL.md` — add a new step (silent, no question) in the setup flow before finalization: read `~/.claude/settings.json`, ensure `attribution: { commit: "", pr: "" }` is present (merge-don't-overwrite if user already has a customized non-default value; just add the field if absent).
- `skills/dev-github-workflow/SKILL.md`:
  - Section "Commit Message Format" (line ~61) — split into two variants. Mode-1 commits include the "Built with design-engineer" footer; Mode-2 commits do not.
  - Mode 2 (Manual, line ~117) — explicitly drop the footer. The commit message follows Conventional Commits without the plugin footer. Add a one-line clarifier: "Plugin attribution applies only when the plugin is driving the commit (Mode 1, post-plan-approval). Manual commits are user-driven and stay attribution-free except for what the user provides."
  - Mode 1 (Automatic, line ~94) — keeps the footer as-is.
  - PR creation (line ~191) — keep plugin attribution in PR description for plan-driven PRs (Mode 1 path), drop for manual user-invoked PR creation.
- `CLAUDE.md` line 243 — update Plan Mode workflow text from "Conventional Commits format with phase context and plugin attribution" to "Conventional Commits format with phase context and plugin attribution (footer applies only in plan-driven commits)".
- `.claude-plugin/plugin.json` — bump 4.3.1 → 4.4.0.
- `.claude-plugin/marketplace.json` — bump 4.3.1 → 4.4.0.
- `CHANGELOG.md` — `[4.4.0] – 2026-04-26` entry under Changed.
- `README.md` — bump banner v4.3.1 → v4.4.0.

**Reuse**:
- The status-line install pattern in `meta-setup/SKILL.md` (lines 222-237) for the "read settings.json, merge-don't-overwrite, write back" mechanic.
- Existing Mode 1 / Mode 2 split in `dev-github-workflow/SKILL.md` — already separated. Just modify what each section instructs.

**Implementation details**:

For meta-setup, the new step (after status-line install, before sound-install or before finalization):

```
Silently apply attribution defaults:
1. Read `~/.claude/settings.json` (create if missing).
2. Check the `attribution` field:
   - If absent → write `{ "commit": "", "pr": "" }`.
   - If present and `commit` or `pr` is "" or default Anthropic text → set both to "".
   - If present with custom non-default text → leave alone (user has customized).
3. Write settings.json back with 2-space indentation.
4. Confirm to the user in plain language: "Disabled the default Co-Authored-By trailer on commits — the plugin only adds its own attribution when actively driving a commit (during a plan-execution phase). Manual commits in other projects stay attribution-free."
```

For dev-github-workflow Commit Message Format section, split into:

```markdown
### Mode 1 commit format (plan-driven — includes plugin attribution)

type(scope): brief description

Phase N – what was accomplished

Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin

### Mode 2 commit format (manual user-invoked — no plugin footer)

type(scope): brief description

[optional body]
```

**Checklist**:
- [ ] Add silent attribution-defaults step to `skills/meta-setup/SKILL.md` (after status-line, before finalization)
- [ ] Update `skills/dev-github-workflow/SKILL.md` Commit Message Format to show two variants
- [ ] Update Mode 2 instructions to explicitly drop the plugin footer
- [ ] Update Mode 1 to keep the footer (no actual change, just clarification)
- [ ] Update `dev-github-workflow/SKILL.md` PR creation step (line 191) — only include plugin attribution in plan-driven PRs
- [ ] Update CLAUDE.md line 243 to clarify scope of plugin attribution
- [ ] Bump `.claude-plugin/plugin.json` 4.3.1 → 4.4.0
- [ ] Bump `.claude-plugin/marketplace.json` 4.3.1 → 4.4.0
- [ ] Add CHANGELOG `[4.4.0] – 2026-04-26` entry under Changed
- [ ] Bump README banner to v4.4.0
- [ ] Validate JSON manifests
- [ ] Spot-check each modified file for consistency

**QA**:
1. JSON manifests valid: `python3 -m json.tool`.
2. `grep -n "attribution" skills/meta-setup/SKILL.md` returns the new silent-disable step.
3. `grep -n "Mode 1\|Mode 2\|Built with design-engineer" skills/dev-github-workflow/SKILL.md` shows the split format and Mode-2 footer drop.
4. CLAUDE.md line 243 reflects the scoped attribution.
5. Manual smoke test (deferred to user): re-run /design-engineer:start; observe that ~/.claude/settings.json gains `attribution: {commit: "", pr: ""}`. Run a manual `/design-engineer:dev` plan-phase commit — footer should appear. Run a manual `commit` outside a plan — footer should NOT appear.

## Risk assessment

- **Risk**: silent attribution write to `~/.claude/settings.json` might surprise users who had a custom value. **Mitigation**: merge-don't-overwrite — only write the empty defaults if the field is absent OR already empty/default. If user has a customized non-default value, leave it alone. Same ethos as status-line install.
- **Risk**: Mode 2 (manual) is the more common path — users typing "commit" — and dropping the footer means the plugin's contribution is invisible there. **Mitigation**: that's exactly the user's intent ("user's commits don't reference this plugin in unrelated projects"). No mitigation needed.
- **Risk**: PR creation gets ambiguous between "plugin-driven PR" vs "user manually says PR". **Mitigation**: same Mode 1 / Mode 2 distinction applies. Only Mode 1 PR description includes the footer.
- **Risk**: existing testers' projects already have plan-driven commits with the footer — no harm, those stay as-is. Future commits follow new rules.
- **Risk**: Anthropic's `attribution` setting might be deprecated in favor of `includeCoAuthoredBy`. **Mitigation**: docs explicitly say `attribution` takes precedence over the deprecated `includeCoAuthoredBy`. Using the recommended one.

## Verification (end-to-end)

After v4.4.0 lands:
1. JSON manifests valid; all read 4.4.0.
2. meta-setup writes `attribution: {commit: "", pr: ""}` to ~/.claude/settings.json on first run (preserving existing customizations).
3. dev-github-workflow Mode 1 commits include "Built with design-engineer" footer; Mode 2 commits don't.
4. CLAUDE.md updated: Plan Mode workflow text mentions the scoped footer.
5. README banner v4.4.0.
6. Manual smoke test (deferred to user): plan-driven commit → footer present; manual commit → footer absent; ~/.claude/settings.json shows attribution disabled for Claude Code's default.

## Questions for user

None — option B (always disable on install) approved with the refinement (scope plugin footer to plan-driven commits only). MINOR bump v4.4.0. Ready to implement on approval.
