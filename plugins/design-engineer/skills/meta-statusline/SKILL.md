---
name: meta-statusline
description: "Installs, uninstalls, or checks the design-engineer status line. Copies the statusline script to ~/.claude/hooks/ and configures settings.json. Use when running /de:setup."
disable-model-invocation: true
model: sonnet
---

# Design-Engineer Status Line

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding.

---

## Step 1: Detect Current Configuration

Read `~/.claude/settings.json`. Check whether the `statusLine` field exists.

If it exists, extract the `command` value and determine the source:
- Contains `de-statusline.js` → design-engineer status line (already installed)
- Contains `gsd-statusline.js` → GSD status line
- Anything else → unknown third-party status line

Display what was found.

---

## Step 2: Determine Action

If the command was invoked with an argument:
- `install` → go to Step 3
- `uninstall` → go to Step 4
- `status` → go to Step 5

Otherwise ask:

```
question: "What would you like to do with the status line?"
header: "Action"
options:
  - label: "Install"
    description: "Install the design-engineer status line (replaces any existing one)"
  - label: "Uninstall"
    description: "Remove the design-engineer status line from settings"
  - label: "Check status"
    description: "Show current status line configuration"
```

---

## Step 3: Install

### 3a. Warn if replacing

If a different status line is currently configured, display:

```
A status line is already configured:
  {current command value}

Installing the design-engineer status line will replace it.
The previous script file will NOT be deleted — only the settings.json pointer changes.
```

Then ask for confirmation:

```
question: "Replace the existing status line?"
header: "Confirm"
options:
  - label: "Yes, replace it"
    description: "Install the design-engineer status line"
  - label: "Cancel"
    description: "Keep the current status line"
```

If cancelled, stop.

If the design-engineer status line is already installed, inform the user that it will be updated with the latest version from the plugin.

### 3b. Copy the script

Create directories if needed:

```bash
mkdir -p ~/.claude/hooks ~/.claude/cache
```

Copy the statusline script from the plugin:

```bash
cp "${CLAUDE_PLUGIN_ROOT}/hooks/de-statusline.js" ~/.claude/hooks/de-statusline.js
```

### 3c. Update settings.json

Read `~/.claude/settings.json`, set the `statusLine` field:

```json
"statusLine": {
  "type": "command",
  "command": "node \"~/.claude/hooks/de-statusline.js\""
}
```

Replace `~` with the actual home directory path. Preserve all other settings. Write back with 2-space indentation.

### 3d. Confirm

Display:

```
Status line installed.

  Script:   ~/.claude/hooks/de-statusline.js
  Settings: ~/.claude/settings.json (statusLine updated)

The status line will appear on the next Claude Code prompt.
Usage limits (5h/7d) will appear after the first background API fetch (~1 minute).

To update after a plugin update: /de:setup install
To remove: /de:setup uninstall
```

---

## Step 4: Uninstall

### 4a. Remove from settings

Read `~/.claude/settings.json`, delete the `statusLine` field entirely. Write back with 2-space indentation, preserving all other settings.

### 4b. Optionally delete the script

```
question: "Also delete the status line script file?"
header: "Cleanup"
options:
  - label: "Yes, delete it"
    description: "Remove ~/.claude/hooks/de-statusline.js"
  - label: "No, keep the file"
    description: "Only remove the settings.json reference"
```

If yes, delete `~/.claude/hooks/de-statusline.js`.

### 4c. Confirm

Display: "Status line removed. Settings updated."

---

## Step 5: Check Status

Read and display:

1. **Current statusLine** value from `~/.claude/settings.json` (or "none configured")
2. **Script file**: whether `~/.claude/hooks/de-statusline.js` exists
3. **Usage cache**: whether `~/.claude/cache/de-usage.json` exists, and how old it is

---

## What the Status Line Shows

When installed, the status line displays below every Claude Code prompt:

```
Opus * my-project | 5h: 12% (2h31m) * 7d: 8% | [=======---] 35% | Phase 2: Strategy * 3/7
```

- **Model + directory** — shortened model name and project folder
- **Usage limits** — 5-hour and 7-day utilization with reset time (fetched from Anthropic API, cached 60s)
- **Context bar** — context window usage with color coding (green/yellow/orange/red)
- **Pipeline state** — current phase and deliverable progress (only shown when a design pipeline is active)

---

## Decision Hierarchy

1. **User decisions** always override — if the user wants to keep their existing status line, respect that.
2. **Detected state** informs — check what is currently configured before making changes.
3. **AI suggestions** fill gaps only when user provides no guidance.
