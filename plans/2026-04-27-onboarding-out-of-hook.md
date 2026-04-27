# v4.8.3 — Stop polluting non-plugin project context with onboarding text

## Context

Two threads converged in this round of testing:

1. After running `rm -rf ~/.claude/plugins/cache/design-engineer-plugin` + `/plugin uninstall` + `/plugin install` (per the v4.8.1 reinstall guidance), the user opened Claude Code in `~/Cursor-projects/sales-agent-prototype` (an unrelated project) and saw a flood of "Plugin directory does not exist" errors on every UserPromptSubmit / PreToolUse:Bash / PostToolUse:Bash event.

2. The user asked whether the plugin is active globally and how to keep it out of unrelated projects.

Investigation revealed two distinct issues — only one of them is fixable in plugin source.

**Issue A — stale plugin registry (NOT a plugin source bug).** Claude Code's plugin manager keeps tracking `design-engineer @ <version>` even after the cache directory at `~/.claude/plugins/cache/design-engineer-plugin/design-engineer/<version>/` is removed from disk. Each hook event then fails to resolve the script path with "Plugin directory does not exist". The errors fire BEFORE any hook code runs, so no in-script gate can suppress them. **Fix is operational, not source**: reinstall via `/plugin install design-engineer@design-engineer-plugin` so the cache repopulates. v4.8.3 cannot fix this.

**Issue B — onboarding-text bloat in non-plugin projects (real source bug, fixable now).** Auditing every hook script in the repo revealed that 11 of 12 hooks ALREADY have an early-exit CWD gate (`exit 0` if `.design-engineer-plugin/config.yaml` is absent in the current working directory). The exception is `de-start-state.sh`, whose "no config" branch always emits ~2 KB of ONBOARDING SEQUENCE text as `UserPromptSubmit additionalContext`. This text gets injected into Claude's context window on every prompt the user sends from any non-plugin folder — `~/Downloads`, `~/Cursor-projects/...`, anywhere. A silent per-prompt token tax for instructions Claude will only ever consume if the user types `/design-engineer:start`.

The hook scripts that already have the gate (no work needed):

| Script | Hook event | Gate location |
| --- | --- | --- |
| `de-process-recall-hook.sh` | UserPromptSubmit | gated in v4.8.1 |
| `de-safety-hook.js` | PreToolUse:Bash | line 18 |
| `de-tdd-hook.js` | PreToolUse:Write\|Edit\|MultiEdit | line 16 |
| `de-design-grounding-hook.js` | PreToolUse:Write\|Edit\|MultiEdit | line 17 |
| `check_deliverable_deps.py` | PostToolUse:Write\|Edit\|MultiEdit | line 20 |
| `de-fidelity-hook.js` | PostToolUse:Write\|Edit\|MultiEdit | line 19 |
| `de-plan-copy-hook.js` | PostToolUse:Write | line 16 |
| `de-prompt-injection-hook.js` | PostToolUse:Read\|WebFetch\|Bash\|Grep\|Task | line 20 |
| `session_dep_summary.py` | Stop | line 18 |
| `de-postcompact-hook.sh` | PostCompact | line 8 |
| `de-play-sound.sh` | Stop, Notification | gated in v4.8.2 |

So the only fix v4.8.3 needs to make is to `de-start-state.sh`'s Case 1 branch: stop emitting the huge onboarding text on every prompt in non-plugin projects. Move that text into the `/design-engineer:start` command body, where it loads only when the user invokes the command.

## Architectural decisions

- **Onboarding lives in the command, not the hook.** The hook's job is to inject CONTEXT (state markers, plugin root). The command's job is to drive BEHAVIOR (multi-step welcome flow). The current arrangement — hook injects 2 KB of behavioral instructions on every prompt regardless of whether the user is invoking the plugin — inverts that division. Moving the onboarding text into the command body restores it.
- **Hook keeps its 3-case structure; only Case 1 changes.** The "no config" case still emits `DESIGN_ENGINEER_PLUGIN_ROOT` (so any later prompt can resolve plugin file paths via Read) and `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` (so the routing logic in `/design-engineer:start` knows which branch to follow). Cases 2 (existing-project welcome) and 3 (returning + resume / returning + no-resume) stay byte-for-byte identical — they only fire in plugin projects, so their per-prompt cost is paid only by users who opted in.
- **The `/design-engineer:start` command body absorbs the full ONBOARDING SEQUENCE text verbatim.** Same content (intro paragraph + 4-step flow + Path A/B branching + spacer rule + project-context check + status-line install). No content rewrite. Just relocation.
- **No changes to the other 11 hook scripts.** Verified each one already exits silently when `.design-engineer-plugin/config.yaml` is absent. The user's complaint about "the plugin firing in unrelated projects" is — for behavioral hooks — already resolved in source. The visible noise the user saw was the path-resolution error from Issue A, not hook scripts misbehaving.
- **No version-migration code.** No real users on v4.8.0–v4.8.2 yet (per user direction last turn). Pre-existing test installs that depended on the hook injecting onboarding text will pick up the new command-body source on next reinstall.
- **PATCH version bump (v4.8.3).** Same convention as v4.8.1 and v4.8.2 — bug-fix-shaped, no new feature surface.

## Single phase — move onboarding into the command body

**Objective**: trim `de-start-state.sh` Case 1 to a minimal context emission, fold the full ONBOARDING SEQUENCE text into `commands/design-engineer/start.md`, bump version, document.

**Depends on**: nothing.

**Files**:

- **Modify** `hooks/de-start-state.sh` Case 1 (no config) only:
  - Replace the giant heredoc that emits `additionalContext` with the full ONBOARDING SEQUENCE...etc. with a minimal version that emits ONLY `DESIGN_ENGINEER_PLUGIN_ROOT: $PLUGIN_ROOT\n\nDESIGN_ENGINEER_PROJECT_STATE: new_to_plugin`.
  - Update the inline comment block at the top of the file to note that Case 1 used to inject onboarding instructions and now defers that to `commands/design-engineer/start.md`.
  - Keep Case 2 and Case 3 byte-for-byte unchanged.

- **Modify** `commands/design-engineer/start.md`:
  - Keep frontmatter and the existing `<context>` block.
  - Expand the `## Routing` block: keep the routing decision tree, then below it add a `## Onboarding sequence (DESIGN_ENGINEER_PROJECT_STATE = new_to_plugin)` section containing the full onboarding text from the hook, verbatim:
    - Step 1: brief intro paragraph + AskUserQuestion (project-type single-select).
    - Path A — "New product": load meta-setup skill at Step 2 (Detect Environment).
    - Path B — "Existing project":
      - Step 2: AskUserQuestion (goal + mode in one panel).
      - Step 3: setup detail (a–f), including b.5 project-context check + the off-repo refs AskUserQuestion + status-line copy/install.
      - Step 4: "You're all set" + tip + load the matching `/design-engineer:` command.
    - Include the SPACER RULE block (3 horizontal-rule lines) above each AskUserQuestion in the body — this is the rule the hook surfaced in v4.8.1 and it carries over verbatim.
  - Keep the "Advisor checkpoint contract for the loaded skill" section unchanged at the bottom.

- **Modify** `.claude-plugin/plugin.json`: bump 4.8.2 → 4.8.3.
- **Modify** `.claude-plugin/marketplace.json`: same bump.
- **Modify** `README.md` line 1 banner: `> **v4.8.2**` → `> **v4.8.3**`.
- **Modify** `CHANGELOG.md`: prepend a `## [4.8.3] – 2026-04-27` entry under "Fixed" / "Changed":
  - "Onboarding instructions for `/design-engineer:start` were injected into Claude's context on every prompt in every project (~2 KB of text per prompt), even in unrelated repos where the user never invokes the plugin. Fix: relocate the onboarding text from `de-start-state.sh` Case 1 (no-config branch) into the `/design-engineer:start` command body. The hook now emits only `DESIGN_ENGINEER_PLUGIN_ROOT` and `DESIGN_ENGINEER_PROJECT_STATE` markers in non-plugin projects (~150 bytes). Behavior is unchanged: when the user types `/design-engineer:start` the command body provides the same instructions Claude used to receive from the hook."
  - Note that the OTHER source of error noise the user saw — "Plugin directory does not exist" repeated for every hook event — is a stale plugin registry issue (Claude Code remembers an installed version after its cache directory has been removed). It is fixed by reinstalling via `/plugin install design-engineer@design-engineer-plugin`, not by any plugin-source change.

**Reuse**:
- The full ONBOARDING SEQUENCE text in the current `de-start-state.sh` is the source of truth. Copy it verbatim into the command body. No rewording.
- Case 2 and Case 3 hook branches stay as-is.
- The 11 already-gated hook scripts: zero changes needed.
- The CWD gate idiom we settled on in v4.8.2: continues to be the canonical pattern.
- dev-github-workflow Mode 1 commit footer pattern for the v4.8.3 commit.

## Verification

1. **JSON + shell syntax**:
   ```bash
   bash -n hooks/de-start-state.sh
   for f in .claude-plugin/plugin.json .claude-plugin/marketplace.json hooks/hooks.json; do python3 -m json.tool "$f" > /dev/null && echo "OK: $f"; done
   ```

2. **Hook output size — measure the bloat reduction in non-plugin projects**:
   ```bash
   cd /tmp && mkdir -p hook-test-empty && cd hook-test-empty && rm -rf .design-engineer-plugin
   BEFORE_BYTES=$(git -C /Users/merlenkov/design-engineer-plugin show HEAD:hooks/de-start-state.sh | bash | wc -c | tr -d ' ')
   AFTER_BYTES=$(bash /Users/merlenkov/design-engineer-plugin/hooks/de-start-state.sh | wc -c | tr -d ' ')
   echo "Case 1 hook output: $BEFORE_BYTES bytes → $AFTER_BYTES bytes"
   # Expected: BEFORE around 2000+, AFTER under 300.
   ```

3. **Cases 2 and 3 still produce valid JSON**:
   ```bash
   cd /tmp/hook-test-empty
   mkdir -p .design-engineer-plugin && printf 'project_type: existing\n' > .design-engineer-plugin/config.yaml
   bash /Users/merlenkov/design-engineer-plugin/hooks/de-start-state.sh | python3 -m json.tool > /dev/null && echo "Case 2 OK"
   printf 'project_type: new\nresume:\n  step: 1\n' > .design-engineer-plugin/config.yaml
   bash /Users/merlenkov/design-engineer-plugin/hooks/de-start-state.sh | python3 -m json.tool > /dev/null && echo "Case 3 (resume) OK"
   printf 'project_type: new\n' > .design-engineer-plugin/config.yaml
   bash /Users/merlenkov/design-engineer-plugin/hooks/de-start-state.sh | python3 -m json.tool > /dev/null && echo "Case 3 (no-resume) OK"
   ```

4. **End-to-end `/design-engineer:start` in a fresh project** (after pushing and refreshing the cache as in prior PATCH testing):
   - Reinstall plugin (`/plugin marketplace add volomydyr/design-engineer-plugin && /plugin install design-engineer@design-engineer-plugin`).
   - From a fresh, non-plugin directory, run `/design-engineer:start`. Confirm: welcome paragraph appears, AskUserQuestion (project type) appears with the 3-line spacer above it, full onboarding flow continues through goal+mode, env detection, status-line install, and ends at "You're all set."
   - From another non-plugin directory, send a regular prompt (not `/design-engineer:*`). Confirm there's no visible plugin text in the output. The hook still fires (Case 1) but emits only the minimal markers, which are invisible to the user.

## Critical files

- `hooks/de-start-state.sh`
- `commands/design-engineer/start.md`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `README.md`
- `CHANGELOG.md`

## Risks

- **Risk**: the onboarding text in the command body is verbose (~2 KB). Users who view command source files in their terminal might find it noisy. **Mitigation**: this matches how every other plugin command works (commands embed their own behavioral instructions). The text is structured (numbered steps), not raw prose. No special UX treatment is needed.
- **Risk**: if the command body and the hook drift out of sync over time, the welcome flow can break in subtle ways. **Mitigation**: the command body is now the single source of truth for onboarding. The hook does only context emission. Keep all future onboarding edits in the command body.
- **Risk**: Issue A (stale plugin registry) is unsolved by this plan and will keep biting users who clean their plugin cache without going through `/plugin uninstall` first. **Mitigation**: separate operational fix — `/plugin install design-engineer@design-engineer-plugin` repopulates the cache. v4.8.3 cannot fix that, and trying to would be wrong scope.
- **Risk**: in some clients, the way command bodies expand into context may differ from how UserPromptSubmit `additionalContext` injection works (e.g. whether the model treats the text as instructions vs. reference). **Mitigation**: this is how the rest of the plugin's commands already work (`/design-engineer:design`, `/design-engineer:dev`, etc., all carry their own behavioral instructions in their command bodies). Behavior should be identical.

## Questions for user

- v4.8.2 is committed locally (`2482725`) but not pushed. v4.8.3 is a separate, additive commit on top. Two reasonable paths:
  - Push v4.8.2 now, then build v4.8.3 on top and push that.
  - Roll v4.8.2 + v4.8.3 into back-to-back commits and push together.
  Either works; this is purely a release-cadence preference, not a technical question. Default if no answer: roll into a single push at the end of v4.8.3 implementation.
