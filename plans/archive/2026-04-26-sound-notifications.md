# v4.1.0 — Optional sound notifications (Stop + Notification hooks, opt-in install)

## Context

Beta tester wants audio cues when Claude finishes responding or needs user action. Reference snippet they shared used 4 hook events (SessionStart, UserPromptSubmit, Notification, Stop) with `afplay` (macOS-only). User refined the scope on review:

- **Hybrid approach**: opt-in during setup (not silent surprise sounds) + apply consistently if opted in.
- **Same sound for everyone**: bundle audio files in the plugin, not OS-specific system sounds.
- **Suggest a specific sound** rather than asking the user to find one.

Right-fit hook events per Anthropic docs (already-fetched this session):
- **Stop** — fires when Claude finishes responding. Use for completion sound.
- **Notification** — fires when Claude waits for user input (permission requests, AskUserQuestion). Use for attention sound. **Better than UserPromptSubmit** (which fires when the *user* submits, not when Claude needs them).
- Skip SessionStart (every session opens with a chime is annoying) and skip UserPromptSubmit.

This is additive (no breaking change) and adds new functionality. **MINOR bump → v4.1.0** per CLAUDE.md versioning rules.

## Architectural decisions

- **Bundle 2 WAV files at `assets/sounds/`** — `de-complete.wav` (Stop hook) and `de-attention.wav` (Notification hook). WAV chosen because every OS player handles raw PCM WAV without codec issues. Files kept tiny (≤30KB each, ~200-400ms).
- **Sound source: Kenney CC0 UI Audio** (kenney.nl/assets/ui-audio). CC0 = public domain, no attribution required, redistribution unrestricted. Two specific picks chosen for distinctiveness:
  - `bong_001.wav` → renamed to `de-complete.wav` (warm, short, "task done" feeling)
  - `confirmation_001.wav` → renamed to `de-attention.wav` (alerting, distinct from completion)
- **Cross-platform playback shim**: tiny script `hooks/de-play-sound.sh` that detects OS and plays the bundled file with the OS-native command. macOS `afplay`, Linux `paplay` then `aplay` fallback, Windows skipped via WSL detection (or if Powershell available, runs that). Fail silent (`2>/dev/null`, exit 0) so a missing player never blocks Claude Code.
- **Opt-in install via meta-setup**: new question in `meta-setup/SKILL.md` between the status-line install (Step 5) and the finalization step. If user opts in, write Stop + Notification hook entries to user's `~/.claude/settings.json` (user-level, not plugin-level — same scope as status-line install).
- **No SessionStart / UserPromptSubmit hooks**: those would fire too often and annoy. Only Stop and Notification.
- **Existing user settings preserved**: install script reads `~/.claude/settings.json`, merges hook entries (doesn't overwrite). If existing Stop/Notification hooks of similar shape exist, ask user before replacing.
- **Sounds bundled, not user-configurable in v4.1.0**: keeps scope minimal. Custom-sound override is a future enhancement if testers ask for it.

## Phase 1: Build the sound system + install flow

**Objective**: Ship `ui-images`-style opt-in setup question, sound playback shim, bundled audio assets, and the meta-setup integration. Ship as v4.1.0.

**Depends on**: none

**Files**:

Create:
- `assets/sounds/de-complete.wav` — sourced from Kenney CC0 UI Audio (or downloaded equivalent). Renamed from source. ~200-400ms, ≤30KB.
- `assets/sounds/de-attention.wav` — same source, distinct sound. ≤30KB.
- `assets/sounds/LICENSE.md` — short note: "Sounds are CC0 (public domain) from kenney.nl/assets/ui-audio. No attribution required. Redistributable freely."
- `hooks/de-play-sound.sh` — POSIX bash playback shim. Takes one arg (path to .wav). Detects OS, runs platform-native player, fails silent.

Modify:
- `skills/meta-setup/SKILL.md` — add new step (between status-line and finalization) asking the user via AskUserQuestion: "Would you like sound notifications when Claude finishes responding or needs your input?" with options Yes/No. If Yes: write Stop + Notification hook entries to `~/.claude/settings.json`. Use the same merge-don't-overwrite pattern as the status-line install. Document the cross-platform mechanic clearly.
- `.claude-plugin/plugin.json` — bump 4.0.0 → 4.1.0.
- `.claude-plugin/marketplace.json` — bump 4.0.0 → 4.1.0.
- `CHANGELOG.md` — `[4.1.0] – 2026-04-26` entry under Added.
- `README.md` — bump banner v4.0.0 → v4.1.0; add a brief mention of sound notifications in the Getting Started or features section if one fits naturally.

**Reuse**:
- The status-line install pattern from `meta-setup/SKILL.md` lines 210-235 — same shape: AskUserQuestion → conditionally write to `~/.claude/settings.json` → preserve existing config.
- Bash `case "$(uname -s)"` pattern from existing scripts for OS detection (see `init-project-structure.sh` for `set -euo pipefail` style).
- `${CLAUDE_PLUGIN_ROOT}` substitution for resolving bundled sound files at hook invocation time (so the hook command is `bash ${CLAUDE_PLUGIN_ROOT}/hooks/de-play-sound.sh ${CLAUDE_PLUGIN_ROOT}/assets/sounds/de-complete.wav`).

**Sound files: how to source them**:
The user is on macOS. The sound files need to be downloaded from Kenney's pack and committed to the repo. Two options:
1. **User downloads them and commits**: I list specific filenames from Kenney's UI Audio pack; user downloads them, I rename and commit. Cleanest licensing trail.
2. **Bash + curl from a CC0 mirror**: brittle (URLs change), and downloading from inside the plan execution is unusual.

I'll go with option 1 in implementation: I'll specify the exact Kenney filenames, ask the user to download from kenney.nl/assets/ui-audio (free zip download, one-time action), drop the two specific files into `assets/sounds/`, then I rename + finalize. Adds a small manual step but the sound files are then permanently in the repo.

**Alternative if user can't download**: pre-generate synthesized tones with ffmpeg (deterministic 2-note sine-wave chimes). I can build these in-session if ffmpeg is available — verifiable via `command -v ffmpeg`.

**Checklist**:
- [ ] User downloads 2 specific sound files from Kenney CC0 UI Audio (or I generate ffmpeg sine tones if user prefers + ffmpeg is available)
- [ ] Place files at `assets/sounds/de-complete.wav` and `assets/sounds/de-attention.wav`
- [ ] Write `assets/sounds/LICENSE.md` noting CC0 source
- [ ] Write `hooks/de-play-sound.sh` (POSIX bash, OS detection, fail-silent playback)
- [ ] `chmod +x hooks/de-play-sound.sh`
- [ ] Smoke-test the shim: `bash hooks/de-play-sound.sh assets/sounds/de-complete.wav` plays the sound on macOS
- [ ] Add sound-install AskUserQuestion to `meta-setup/SKILL.md` with clear opt-in messaging
- [ ] Document the install mechanic: writes Stop + Notification hooks to `~/.claude/settings.json` pointing at the bundled files via `${CLAUDE_PLUGIN_ROOT}`
- [ ] Bump `.claude-plugin/plugin.json` and `marketplace.json` to 4.1.0
- [ ] Add CHANGELOG `[4.1.0] – 2026-04-26` entry under Added
- [ ] Bump README banner to v4.1.0
- [ ] Validate JSON manifests
- [ ] Verify scripts have correct shebangs and are executable

**QA**:
1. JSON manifests valid: `python3 -m json.tool .claude-plugin/plugin.json` and `marketplace.json`.
2. Sound files exist: `ls -la assets/sounds/` shows 2 .wav files (each ≤30KB) plus LICENSE.md.
3. Playback shim works: `bash hooks/de-play-sound.sh assets/sounds/de-complete.wav` plays the sound on macOS without errors. Fails silent if a player isn't found (`exit 0`, no error to stderr).
4. Hook command shape: the install writes a JSON entry like `{"type": "command", "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/de-play-sound.sh ${CLAUDE_PLUGIN_ROOT}/assets/sounds/de-complete.wav"}` — verifiable by inspecting `~/.claude/settings.json` after a test install.
5. meta-setup integration: opt-in question fires after status-line question, before finalization. User saying "No" doesn't write any hook entries.

## Risk assessment

- **Risk**: sound files inflate plugin size. **Mitigation**: 2 × 30KB = 60KB total. Plugin is already much larger; this is negligible.
- **Risk**: Linux user without `paplay` and `aplay` hears nothing. **Mitigation**: shim tries multiple players in order, fail-silent if all missing. CHANGELOG notes the requirement.
- **Risk**: Windows users on WSL get no sound (WSL doesn't expose Windows audio by default). **Mitigation**: shim detects WSL and exits silently. WSL users not getting sound is expected behavior; documented.
- **Risk**: hook entry in `~/.claude/settings.json` conflicts with user's existing Stop/Notification hooks. **Mitigation**: merge-don't-overwrite logic in the install script — read existing JSON, append our hook entry if not already present, preserve everything else. Same pattern as status-line install.
- **Risk**: testers find sound annoying after a few days. **Mitigation**: opt-in by default, clear question in setup. Uninstall path: re-run setup or manually remove entries from `~/.claude/settings.json`. Document the uninstall path in CHANGELOG.
- **Risk**: Kenney CC0 license terms change in future. **Mitigation**: CC0 is irrevocable; once licensed CC0, files stay CC0 even if the website's terms change later.

## Verification (end-to-end)

After v4.1.0 lands:
1. JSON manifests valid; all four read 4.1.0.
2. `assets/sounds/` contains 2 WAV files + LICENSE.md.
3. `hooks/de-play-sound.sh` exists, executable, fail-silent, plays the bundled WAVs on the user's OS.
4. `meta-setup/SKILL.md` has the opt-in question after status-line and before finalization.
5. README banner v4.1.0.
6. Manual smoke test (deferred to user): run `/design-engineer:start` on a fresh project, accept the sound install, then trigger Claude Code to finish a response → verify completion sound plays. Trigger an AskUserQuestion → verify attention sound plays.

## Sound source: locked

**Kenney CC0 UI Audio** (kenney.nl/assets/ui-audio). Acquisition strategy in implementation:
1. **First try**: I attempt to download the pack via `curl` + `unzip` in-session, extract two specific files, commit them, discard the rest. If the URL fetch works, no manual step needed.
2. **Fallback**: if curl fetch fails, I give you the exact one-liner to run (`curl -L <url> -o /tmp/kenney.zip && unzip -j /tmp/kenney.zip 'Audio/<file>' -d <plugin>/assets/sounds/`). You run it once, I rename + finalize.

License is CC0 either way (irrevocable, no attribution required, redistributable). License note goes in `assets/sounds/LICENSE.md`.

## Questions for user

None — Kenney CC0 source approved; acquisition path documented above. Ready to implement on approval.
