# v4.8.2 — Sound: opt-in by default, gated to plugin projects

## Context

After v4.8.1 shipped the user reinstalled the plugin and noticed two sound-system regressions:

1. **Sounds play before the user is asked.** The sound hooks are registered unconditionally in plugin's `hooks/hooks.json`, so the very first Stop/Notification event after install triggers a chime — *before* `/design-engineer:start` ever runs and asks the user about sound preference. The setup question is post-hoc.
2. **Sounds play in every project, not just plugin projects.** Once the plugin is installed it's globally registered. Open Claude Code in any unrelated repo, hit Stop or get a permission prompt → the plugin's chime fires. Confusing for users who think of the plugin as scoped to a specific project.

Root cause: `hooks/de-play-sound.sh` only consults a single global mute flag (`~/.claude/de-sound-muted`), and that flag's semantics are "absent = sounds on" — i.e., default-on. Nothing in the shim looks at whether the current directory is actually a plugin project, and nothing prevents playback before the user has been asked.

The fix flips both axes:
- **Default off until opted in.** Replace the inverted-mute flag with an explicit opt-in flag (`~/.claude/de-sound-enabled`). Absent flag = silent. The setup question creates the flag if the user picks "Yes".
- **Plugin-project gate.** The shim also requires `.design-engineer-plugin/config.yaml` to exist in the current working directory before playing. So Stop events in non-plugin projects stay silent.

User-confirmed direction (AskUserQuestion answers, captured 2026-04-27):
- Sound preference is **global** (one toggle, asked once during first onboarding, applies to all plugin projects).
- Migration is **clean break** — no migration code needed because there are no real users yet at v4.8.0/v4.8.1; existing test installs can re-run `/design-engineer:mute-unmute-sound` if needed.

Outcome: a fresh install is silent by default. The first time the user goes through `/design-engineer:start`, they're asked. Their answer applies to every plugin project they open, but unrelated repos stay quiet.

## Architectural decisions

- **New flag name and inverted semantics**: `~/.claude/de-sound-enabled` (presence = sounds on). The legacy `~/.claude/de-sound-muted` flag is retired entirely; nothing in the new code reads it. Stale legacy flags on disk have no effect.
- **Two-condition AND in the playback shim**: sounds play only if `~/.claude/de-sound-enabled` exists AND CWD has `.design-engineer-plugin/config.yaml`. Either condition false → exit 0, silent. This is the ONLY gate; no per-project sound key in config.yaml.
- **CWD check uses a literal file test**, not a config parse. The shim doesn't need to read or parse YAML — `[ -f .design-engineer-plugin/config.yaml ]` is enough to decide "this is a plugin project".
- **No migration code**. User confirmed no real users at v4.8.0/v4.8.1 yet. Existing test installs lose sound after upgrade until they re-run `/design-engineer:mute-unmute-sound` once or re-onboard. CHANGELOG documents this.
- **PATCH version bump** (v4.8.2). The change is bug-fix-shaped: sounds were misbehaving and now behave correctly. No new feature surface. Convention so far: PATCH bumps for bug fixes (4.8.0 → 4.8.1 was also bug fixes). Stay consistent.
- **`/design-engineer:mute-unmute-sound` keeps the same UX** (toggles on/off, idempotent, persistent across restarts), only the underlying flag changes. The command is global — works from anywhere. The CWD gate happens at the shim, not at the toggle.

## Single phase — implement the new gate

**Objective**: replace the global mute flag with a global opt-in flag plus a CWD plugin-project gate, in the playback shim, the setup question, and the toggle command. Bump version, update docs.

**Depends on**: none (independent of v4.8.1).

**Files**:

- **Modify** `hooks/de-play-sound.sh` (49 lines today):
  - Replace the legacy mute-flag check (lines 11–13) with the new two-condition gate:
    - `[ -f "$HOME/.claude/de-sound-enabled" ] || exit 0` — global opt-in flag missing → silent
    - `[ -f "$PWD/.design-engineer-plugin/config.yaml" ] || exit 0` — not a plugin project → silent
  - Update the file-header comment block to reflect the new semantics: "Sounds play only if the user has globally opted in via `~/.claude/de-sound-enabled` AND the current directory is a design-engineer plugin project (has `.design-engineer-plugin/config.yaml`). Both conditions must be true. Toggled via `/design-engineer:mute-unmute-sound`."
  - Keep the rest of the file (file-exists check, WSL skip, OS-specific players, backgrounded playback, `exit 0`) as-is.

- **Modify** `commands/design-engineer/mute-unmute-sound.md`:
  - Frontmatter: keep as-is.
  - Body: rewrite the "How it works" section. New mechanism description: "Sounds play only when (a) you've globally opted in via `~/.claude/de-sound-enabled` AND (b) you're in a plugin project (the current folder has `.design-engineer-plugin/config.yaml`). This command toggles the global opt-in flag — the project gate is automatic."
  - "Steps" section: invert logic. Replace `~/.claude/de-sound-muted` with `~/.claude/de-sound-enabled` throughout. New behavior: if flag exists → remove → "Sounds muted globally" message. If flag absent → create → "Sounds enabled globally — they'll play when Claude finishes a response or needs your input, in any plugin project."
  - "Notes" section: update the second bullet to reflect the new per-CWD-and-flag gate. Remove any wording that implied the legacy mute flag.

- **Modify** `skills/meta-setup/SKILL.md` lines 272–308 (the sound-install block):
  - Detect existing state by checking `~/.claude/de-sound-enabled` (present = on; absent = off). Replace every occurrence of `~/.claude/de-sound-muted` with `~/.claude/de-sound-enabled`.
  - Invert the apply logic:
    - "Yes (Recommended)" / "Yes, unmute" → `mkdir -p ~/.claude && touch ~/.claude/de-sound-enabled` (idempotent). Confirm: "Sounds are on globally. You'll hear chimes only inside design-engineer plugin projects."
    - "No, mute them" / "Keep muted" → `rm -f ~/.claude/de-sound-enabled` (idempotent). Confirm: "Sounds muted. Toggle anytime with /design-engineer:mute-unmute-sound."
  - Update the **Background** paragraph to describe the new two-condition gate (global opt-in flag + plugin-project CWD).
  - Keep the legacy-settings.json migration cleanup paragraph (it removes dead `de-play-sound.sh` entries from `~/.claude/settings.json` left by v4.1.0–v4.7.0 — still useful).
  - **Add** a one-liner cleanup of the now-retired legacy flag: `rm -f ~/.claude/de-sound-muted` (idempotent; harmless if absent). Place this right before the "Apply the choice" block so first-time onboarding never leaves a stale flag.

- **Modify** `.claude-plugin/plugin.json`: `"version": "4.8.1"` → `"version": "4.8.2"`.
- **Modify** `.claude-plugin/marketplace.json`: same bump.
- **Modify** `README.md` line 1 banner: `> **v4.8.1**` → `> **v4.8.2**`.
- **Modify** `CHANGELOG.md`: prepend a `## [4.8.2] – 2026-04-27` entry under "Fixed" with two bullets:
  - "Sounds played before the user was asked. Sound hooks fired on the very first Stop/Notification after install, before `/design-engineer:start` ran the setup question. Fix: invert the flag semantics from default-on (`~/.claude/de-sound-muted`, presence = mute) to default-off (`~/.claude/de-sound-enabled`, presence = on). Fresh installs are now silent until the user picks 'Yes' during onboarding."
  - "Sounds played in every project, not just plugin projects. The playback shim never checked whether the current directory was actually a plugin project. Fix: gate `de-play-sound.sh` on `.design-engineer-plugin/config.yaml` being present in CWD. Sounds in unrelated repos now stay silent. The legacy `~/.claude/de-sound-muted` flag is retired; existing test installs lose sound on upgrade and can re-enable it once with `/design-engineer:mute-unmute-sound`."

## Reuse

- `hooks/de-play-sound.sh` — keep all OS-detection logic (Darwin/Linux/MINGW/CYGWIN/MSYS), WSL skip, backgrounded playback. Only the flag-check lines change.
- `hooks/hooks.json` — no edits. The Stop and Notification entries already point to `de-play-sound.sh`; behavior changes via the shim.
- `assets/sounds/de-complete.wav` and `de-attention.wav` — no edits.
- The legacy-settings.json cleanup logic in `meta-setup/SKILL.md` (removes dead v4.1.0–v4.7.0 entries) — keep as-is.
- The dev-github-workflow Mode 1 commit footer pattern — reuse for the v4.8.2 commit.

## Verification

After implementation, run these checks before committing:

1. **Syntax + JSON validity**:
   ```bash
   bash -n hooks/de-play-sound.sh
   python3 -m json.tool .claude-plugin/plugin.json .claude-plugin/marketplace.json hooks/hooks.json > /dev/null
   ```

2. **Shim behavior, all 4 cases** (run from a temp dir):
   ```bash
   cd /tmp && rm -rf sound-test && mkdir sound-test && cd sound-test
   PLAY=/Users/merlenkov/design-engineer-plugin/hooks/de-play-sound.sh
   WAV=/Users/merlenkov/design-engineer-plugin/assets/sounds/de-complete.wav
   # Case A: no flag, no plugin project → silent
   rm -f ~/.claude/de-sound-enabled
   bash $PLAY $WAV    # → no audio
   # Case B: flag set, no plugin project → silent (user's primary complaint)
   touch ~/.claude/de-sound-enabled
   bash $PLAY $WAV    # → no audio
   # Case C: flag set, plugin project → audio
   mkdir -p .design-engineer-plugin && touch .design-engineer-plugin/config.yaml
   bash $PLAY $WAV    # → audio plays
   # Case D: flag absent, plugin project → silent
   rm -f ~/.claude/de-sound-enabled
   bash $PLAY $WAV    # → no audio
   ```

3. **Toggle command**:
   ```bash
   rm -f ~/.claude/de-sound-enabled
   # First /design-engineer:mute-unmute-sound run → creates flag, says "enabled"
   # Second run → removes flag, says "muted"
   ```

4. **End-to-end in Claude Code** (after pushing and refreshing the cache as in v4.8.1 testing):
   - Reinstall plugin from clean cache.
   - Start Claude Code in `~/Downloads` (or any non-plugin folder). Trigger Stop and Notification → confirm silence.
   - Run `/design-engineer:start` — get the welcome question. No chime fired during setup before the question.
   - Pick a goal, finish onboarding, answer "Yes" to the sound question. → flag created.
   - Trigger another Stop in the now-onboarded project → chime plays.
   - Open a different non-plugin folder → trigger Stop → silent.

## Critical files

- `hooks/de-play-sound.sh`
- `commands/design-engineer/mute-unmute-sound.md`
- `skills/meta-setup/SKILL.md` (lines 272–308 only)
- `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`
- `README.md` (line 1 banner)
- `CHANGELOG.md`

## Risks

- **Risk**: a user who picked "Yes" during v4.8.0/v4.8.1 onboarding and expects sounds to keep working will go silent on upgrade. **Mitigation**: user confirmed no real users at this stage; CHANGELOG documents the one-step `/design-engineer:mute-unmute-sound` recovery.
- **Risk**: the CWD check uses `$PWD`, but hooks may run with a different CWD than the user's terminal in some environments. **Mitigation**: Anthropic's hook spec runs hooks in the project root by default, so `$PWD` matches what the user sees. If real-world testing shows CWD drift, fall back to walking up from `$PWD` looking for `.design-engineer-plugin/config.yaml` (deferred to a follow-up if needed; not required for v4.8.2 ship).
- **Risk**: the `mute-unmute-sound` command is global but a user might run it inside a non-plugin folder and expect it to "do nothing" there. **Mitigation**: the command's confirmation message explicitly says "globally" so the scope is clear. The flag affects all plugin projects, none of the non-plugin ones.

## Questions for user

None outstanding. Both directional questions (scope = global, migration = clean break) were answered before this plan was written. Ready to implement on approval.
