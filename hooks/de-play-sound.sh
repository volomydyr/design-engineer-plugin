#!/usr/bin/env bash
# Cross-platform sound playback shim for the design-engineer plugin.
# Usage: bash de-play-sound.sh <path-to-wav>
#
# Detects the OS, plays the WAV with the OS-native command, fails silently
# (exit 0) if no player is available so a missing player never blocks
# Claude Code. Backgrounded so playback doesn't delay the calling hook.
#
# Sound gate – per-project opt-in with a legacy global fallback:
#   1. The current working directory must be a design-engineer plugin
#      project, i.e. it contains .design-engineer-plugin/config.yaml.
#   2. The config's top-level `sound:` key decides:
#        sound: enabled → play
#        sound: <any other value, e.g. muted> → silent
#        key absent → legacy fallback: play only if the old global opt-in
#        flag ~/.claude/de-sound-enabled exists (kept for one release so
#        projects configured before the per-project key keep working).
#   The key is set during /design-engineer:launch onboarding and toggled
#   by /design-engineer:mute-unmute-sound.
#
# Any gate failing → exit 0, silent. This keeps fresh installs quiet
# until the user is asked, and prevents the plugin's chimes from firing in
# unrelated repos.

SOUND_FILE="${1:-}"

# Not a plugin project (no .design-engineer-plugin/config.yaml in CWD) → silent
CONFIG_FILE="$PWD/.design-engineer-plugin/config.yaml"
[ -f "$CONFIG_FILE" ] || exit 0

# Per-project sound key decides; the legacy global flag is the fallback
if grep -qE '^sound:[[:space:]]*enabled[[:space:]]*$' "$CONFIG_FILE"; then
  : # opted in for this project → play
elif grep -qE '^sound:' "$CONFIG_FILE"; then
  exit 0 # explicit non-enabled value (e.g. muted) → silent
elif [ -f "$HOME/.claude/de-sound-enabled" ]; then
  : # no per-project key; legacy global opt-in present → play
else
  exit 0 # no opt-in anywhere → silent
fi

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
