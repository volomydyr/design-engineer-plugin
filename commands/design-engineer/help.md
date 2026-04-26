---
name: design-engineer:help
description: Show all Design Engineer Plugin commands, current project status, and mode.
argument-hint: ""
---

# Design Engineer Plugin – Help

Present this information to the user. Do not modify the text – show it as written.

---

A plugin for Claude Code that walks you through building a product, start to finish. Think of it as a swiss knife for product design. It packs a full methodology into one tool – research, psychology, prototyping, development – but stays easy to pick up. You run one command, it figures out where you are, and opens the right instrument.

### Commands

| Command | What it does |
|---------|-------------|
| `/design-engineer:start` | Detects your situation – setup, resume, or capability guide |
| `/design-engineer:design` | Runs the design workflow – discovery, strategy, planning, validation |
| `/design-engineer:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs |
| `/design-engineer:dev` | Development workflow – CLAUDE.md, agent pipeline, context management, TDD, implementation |
| `/design-engineer:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/design-engineer:document` | Saves decisions, learnings, and project state. Helps communicate with stakeholders |
| `/design-engineer:stop` | Save progress and pause mid-activity – pick up later with `/design-engineer:start` |
| `/design-engineer:help` | This help screen |

You only need to remember `/design-engineer:start`. It guides you to everything else.

### Modes

Most commands work in two ways:

- **Guided mode** – step-by-step with approval at every stage. The AI explains its thinking, shows findings one at a time, and waits for your input at each step.
- **Autopilot** – autonomous with minimal input. The AI plans and executes, then shows you the results. Faster but you review after, not during.

### What makes it different

- **54 skills** that teach how to think about problems, users, and psychology before writing code
- **9 specialized agents** for research, implementation, testing, and design system compliance
- **100+ psychology principles** the AI draws from when reviewing your work
- **Safety hooks** that prevent scope creep, enforce test-first development, and check every code write against your approved plan

### Your project

If `.design-engineer-plugin/config.yaml` exists, read it and show:

```
Project type: {existing project / new product}
Mode: {Guided mode / Autopilot}
Goal: {if set}
```

If no config exists, show: "This project hasn't been set up yet. Run `/design-engineer:start` to get started."
