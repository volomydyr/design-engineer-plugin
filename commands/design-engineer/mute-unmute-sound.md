---
name: design-engineer:mute-unmute-sound
description: Toggle plugin sound notifications on or off without uninstalling. First call mutes, second call unmutes.
---

# Mute / Unmute Sound

Toggle sound notifications on or off without removing the install. Useful for meetings, libraries, late-night work — anywhere you want the plugin's sounds temporarily silent.

## How it works

The plugin's playback shim (`hooks/de-play-sound.sh`) checks for a flag file at `~/.claude/de-sound-muted` at the top of every invocation. If the file exists, the shim exits silently and no sound plays. This command toggles that flag.

State is persistent across Claude Code sessions and restarts.

## Steps

1. Check whether `~/.claude/de-sound-muted` exists.
2. **If it does NOT exist**: create it (empty file is fine).
   - Run: `touch ~/.claude/de-sound-muted`
   - Confirm to the user: "Sound notifications muted. Run `/design-engineer:mute-unmute-sound` again to unmute."
3. **If it DOES exist**: remove it.
   - Run: `rm ~/.claude/de-sound-muted`
   - Confirm to the user: "Sound notifications unmuted. They will play again on the next Claude response or notification."

## Notes

- **Idempotent**: running the command always toggles to the opposite state. No harm in running it multiple times.
- **No effect if sounds were never installed**: the playback shim is wired through `~/.claude/settings.json` only when the user accepted sound install during `/design-engineer:start`. If sounds were never installed, this command toggles the flag file but no sounds play either way. Inform the user if you detect the install isn't present and offer to run `/design-engineer:start` to install.
- **Survives Claude Code restart**: the flag is a real file on disk, not session state.
- **Manual override**: a user can always create or delete the file directly without using this command.
