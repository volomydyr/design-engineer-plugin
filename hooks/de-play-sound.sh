#!/usr/bin/env bash
# Cross-platform sound playback shim for the design-engineer plugin.
# Usage: bash de-play-sound.sh <path-to-wav>
#
# Detects the OS, plays the WAV with the OS-native command, fails silently
# (exit 0) if no player is available so a missing player never blocks
# Claude Code. Backgrounded so playback doesn't delay the calling hook.

SOUND_FILE="${1:-}"

# Mute flag: if ~/.claude/de-sound-muted exists, exit silently. Toggled via
# the /design-engineer:mute-unmute-sound command (creates/removes the flag).
[ -f "$HOME/.claude/de-sound-muted" ] && exit 0

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
