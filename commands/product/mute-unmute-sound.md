---
name: product:mute-unmute-sound
description: Toggle plugin sound notifications on or off without uninstalling. First call mutes, second call unmutes.
argument-hint: ""
---

# Mute / Unmute Sound

Toggle sound notifications on or off without removing the install. Useful for meetings, libraries, late-night work – anywhere you want the plugin's sounds temporarily silent.

## How it works

Sounds play only when (a) you've globally opted in via `~/.claude/de-sound-enabled` AND (b) you're in a plugin project (the current folder has `.design-engineer-plugin/config.yaml`). This command toggles the global opt-in flag – the project gate is automatic.

The playback shim (`hooks/de-play-sound.sh`) checks both conditions on every invocation. If either is false, the shim exits silently and no sound plays.

State is persistent across Claude Code sessions and restarts.

## Steps

1. Check whether `~/.claude/de-sound-enabled` exists.
2. **If it does NOT exist** (sounds currently off): create it.
   - Run: `mkdir -p ~/.claude && touch ~/.claude/de-sound-enabled`
   - Confirm to the user: "Sounds enabled globally. They'll play when Claude finishes a response or needs your input, in any plugin project. Run `/product:mute-unmute-sound` again to mute."
3. **If it DOES exist** (sounds currently on): remove it.
   - Run: `rm ~/.claude/de-sound-enabled`
   - Confirm to the user: "Sounds muted globally. Toggle anytime with `/product:mute-unmute-sound`."

## Notes

- **Idempotent**: running the command always toggles to the opposite state. No harm in running it multiple times.
- **Two-condition gate**: even with the global flag set, sounds still play only inside design-engineer plugin projects (folders with `.design-engineer-plugin/config.yaml`). Unrelated repos stay silent automatically.
- **Sound hooks are bundled in the plugin** (`hooks/hooks.json` registers them on Stop and Notification events). The toggle works as soon as the plugin is installed – no separate sound install is required.
- **Survives Claude Code restart**: the flag is a real file on disk, not session state.
- **Manual override**: a user can always create or delete the file directly without using this command.
