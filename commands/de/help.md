---
name: de:help
description: Show all Design Engineer Plugin commands, current project status, and mode.
argument-hint: ""
---

# Design Engineer Plugin – Help

Show the user everything this plugin can do.

## Available commands

Present this table:

| Command | What it does |
|---------|-------------|
| `/de:start` | Set up the plugin for this project – choose your goal and mode |
| `/de:design` | Design workflow – plan new features or build products from scratch |
| `/de:review` | Review your project – UX, visual quality, accessibility, psychology, ethics |
| `/de:dev` | Development pipeline – implementation with TDD, agents, and quality checks |
| `/de:prototype` | Generate clickable HTML prototypes from ideas or designs |
| `/de:document` | Document decisions, progress, and project state |
| `/de:help` | This help screen |

## Current project status

If `.design-engineer-plugin/config.yaml` exists, read it and show:

```
Your project:
- Type: {existing project / new product}
- Mode: {Guided mode / Autopilot}
- Goal: {review / implement / design / dev}
```

If no config exists:

```
This project hasn't been set up yet. Run /de:start to get started.
```

## Quick tips

- In **Guided mode**, the AI explains each step and waits for your input
- In **Autopilot**, the AI plans and executes, then shows you results
- You can run any command directly without going through `/de:start` first
- Use `/de:review` anytime to check your work for quality issues
