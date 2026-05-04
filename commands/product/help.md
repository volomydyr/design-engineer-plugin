---
name: product:help
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
| `/product:launch` | Detects your situation – setup, resume, or capability guide |
| `/product:design` | Runs the design workflow – discovery, strategy, planning, validation |
| `/product:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs |
| `/product:dev` | Development workflow – CLAUDE.md, agent pipeline, context management, TDD, implementation |
| `/product:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/product:document` | Saves decisions, learnings, and project state. Auto-purges disposable working files at every phase boundary. Helps communicate with stakeholders |
| `/product:stop` | Save progress and pause mid-activity – pick up later with `/product:launch` |
| `/product:tidy` | Manual purge of disposable working files under `.design-engineer-plugin/temporary/` (Playwright debug captures, intermediate drafts, scratch). Use before commit, or anytime the working tree feels noisy |
| `/product:help` | This help screen |

You only need to remember `/product:launch`. It guides you to everything else.

### Modes

Most commands work in two ways:

- **Guided mode** – step-by-step with approval at every stage. The AI explains its thinking, shows findings one at a time, and waits for your input at each step.
- **Autopilot** – autonomous with minimal input. The AI plans and executes, then shows you the results. Faster but you review after, not during.

### What makes it different

- **57 skills** that teach how to think about problems, users, and psychology before writing code
- **10 specialized agents** for research, implementation, testing, design system compliance, and cross-session memory
- **100+ psychology principles** the AI draws from when reviewing your work
- **Safety hooks** that prevent scope creep, enforce test-first development, validate that deliverables land at canonical paths (denying hallucinated subdirs and filenames), surface bot-block / auth-wall fallbacks for browser research instead of silently failing, and check every code write against your approved plan

### Where files live

Everything the plugin produces lives under `.design-engineer-plugin/` — one umbrella, clear mental model. Subdirs: `design/{foundation,research,planning,exploration,psychology,reviews,dev,features}/`, `prototype/`, `plans/`, `memory/`, `temporary/` (gitignored, auto-purged at phase boundaries). The project root holds only your actual product code.

### Your project

If `.design-engineer-plugin/config.yaml` exists, read it and show:

```
Project type: {existing project / new product}
Mode: {Guided mode / Autopilot}
Goal: {if set}
```

If no config exists, show: "This project hasn't been set up yet. Run `/product:launch` to get started."
