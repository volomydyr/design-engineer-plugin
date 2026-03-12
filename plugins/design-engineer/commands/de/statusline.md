---
name: de:statusline
description: Install, uninstall, or check the design-engineer status line.
argument-hint: "[install | uninstall | status]"
---

# Status Line Management

## Context

<context> #$ARGUMENTS </context>

Manages the design-engineer status line that displays model, usage limits, context bar, and pipeline state.

## Workflow

### Step 1: Load Statusline Skill

Load the `meta-statusline` skill. It handles detection, installation, and uninstallation.

### Step 2: Execute

Pass the arguments to the skill:

| Argument | Action |
|----------|--------|
| `install` | Copy script and configure settings.json |
| `uninstall` | Remove status line from settings |
| `status` | Show current configuration |
| *(none)* | Ask the user what to do |

## What the Status Line Shows

- **Model + directory** — shortened model name and project folder
- **Usage limits** — 5-hour and 7-day utilization with reset time
- **Context bar** — context window usage with color coding
- **Pipeline state** — current phase and deliverable progress (when active)
