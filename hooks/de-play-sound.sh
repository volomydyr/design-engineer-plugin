#!/usr/bin/env bash
# Cross-platform sound playback shim for the design-engineer plugin.
# Usage: bash de-play-sound.sh <path-to-wav>
#
# Detects the OS, plays the WAV with the OS-native command, fails silently
# (exit 0) if no player is available so a missing player never blocks
# Claude Code. Backgrounded so playback doesn't delay the calling hook.
#
# Sounds play only when BOTH conditions are true:
#   1. The user has globally opted in via ~/.claude/de-sound-enabled
#      (toggled by /design-engineer:mute-unmute-sound; created during
#      /design-engineer:launch onboarding when the user picks "Yes").
#   2. The current working directory is a design-engineer plugin project,
#      i.e. it contains .design-engineer-plugin/config.yaml.
#
# Either condition false → exit 0, silent. This keeps fresh installs quiet
# until the user is asked, and prevents the plugin's chimes from firing in
# unrelated repos.

SOUND_FILE="${1:-}"

# Global opt-in flag missing → silent
[ -f "$HOME/.claude/de-sound-enabled" ] || exit 0

# Not a plugin project (no .design-engineer-plugin/config.yaml in CWD) → silent
[ -f "$PWD/.design-engineer-plugin/config.yaml" ] || exit 0

# No file or file missing → exit silently
[ -n "$SOUND_FILE" ] && [ -f "$SOUND_FILE" ] || exit 0

# WSL detection: skip silently (WSL does not expose Windows audio by default)
if grep -qi microsoft /proc/version 2>/dev/null; then
  exit 0
fi

case "$(uname -s)" in
  Darwin)
    # macOS: afplay is built-in
    if command -v afplay >/dev/null 2>&1; then
      afplay "$SOUND_FILE" >/dev/null 2>&1 &
    fi
    ;;
  Linux)
    # Linux: try paplay (PulseAudio), then aplay (ALSA), then play (sox)
    if command -v paplay >/dev/null 2>&1; then
      paplay "$SOUND_FILE" >/dev/null 2>&1 &
    elif command -v aplay >/dev/null 2>&1; then
      aplay -q "$SOUND_FILE" >/dev/null 2>&1 &
    elif command -v play >/dev/null 2>&1; then
      play -q "$SOUND_FILE" >/dev/null 2>&1 &
    fi
    ;;
  MINGW*|CYGWIN*|MSYS*)
    # Native Windows shells (Git Bash etc.): use PowerShell
    if command -v powershell.exe >/dev/null 2>&1; then
      powershell.exe -c "(New-Object System.Media.SoundPlayer '$SOUND_FILE').PlaySync()" >/dev/null 2>&1 &
    fi
    ;;
esac

exit 0
