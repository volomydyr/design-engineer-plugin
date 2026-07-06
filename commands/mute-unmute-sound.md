---
description: Toggle plugin sound notifications on or off without uninstalling. First call mutes, second call unmutes.
argument-hint: ""
allowed-tools: Bash(test -f ~/.claude/de-sound-enabled && echo present || echo absent)
---

# Mute / Unmute Sound

Toggle sound notifications on or off for the current project without removing the install. Useful for meetings, libraries, late-night work – anywhere you want the plugin's sounds temporarily silent.

## How it works

The sound opt-in lives in the project config: a top-level `sound:` key in `.design-engineer-plugin/config.yaml` with value `enabled` or `muted`. The playback shim (`hooks/de-play-sound.sh`) reads that key on every invocation – `enabled` plays, any other value is silent. When the key is absent (a project configured before the per-project key existed), the shim falls back to the legacy global flag `~/.claude/de-sound-enabled`.

This command writes the key into the current project's config, so it is a per-project toggle – other plugin projects keep their own setting.

State is persistent across Claude Code sessions and restarts.

## Steps

1. **Guard**: check that `.design-engineer-plugin/config.yaml` exists in the current directory. If it does NOT, tell the user: "This folder isn't set up with the plugin yet – run /design-engineer:launch here first, then toggle sounds." and stop.
2. **Read the effective state** from `.design-engineer-plugin/config.yaml`:
   - Top-level `sound: enabled` line present → sounds are currently ON.
   - Top-level `sound:` line with any other value (e.g. `muted`) → sounds are currently OFF.
   - No `sound:` key → fall back to the legacy flag: run `test -f ~/.claude/de-sound-enabled && echo present || echo absent`. Present = currently ON, absent = currently OFF.
3. **If sounds are currently OFF**: set `sound: enabled` in the config (replace an existing `sound:` line, or append the key if absent).
   - Confirm to the user: "Sounds enabled for this project. They'll play when Claude finishes a response or needs your input. Run `/design-engineer:mute-unmute-sound` again to mute."
4. **If sounds are currently ON**: set `sound: muted` in the config (replace an existing `sound:` line, or append the key – an explicit `muted` also overrides a leftover legacy flag).
   - Confirm to the user: "Sounds muted for this project. Toggle anytime with `/design-engineer:mute-unmute-sound`."

## Notes

- **Idempotent**: running the command always toggles to the opposite state. No harm in running it multiple times.
- **Per-project**: the key lives in the project's own config, so each plugin project keeps its own sound setting. Unrelated repos stay silent automatically (no config, no sound).
- **Sound hooks are bundled in the plugin** (`hooks/hooks.json` registers them on Stop and Notification events). The toggle works as soon as the plugin is installed – no separate sound install is required.
- **Survives Claude Code restart**: the key is a real line in a real file on disk, not session state.
- **Legacy flag**: `~/.claude/de-sound-enabled` (the pre-per-project global opt-in) still enables sounds in projects whose config has no `sound:` key. This command never deletes that file – an explicit `sound:` key simply takes precedence for this project.
- **Manual override**: a user can always edit the `sound:` line in the config directly without using this command.
