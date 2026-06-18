---
name: design-engineer:help
description: Show all Design Engineer Plugin commands and current project status.
argument-hint: ""
---

# Design Engineer Plugin – Help

Present this information to the user. Do not modify the text – show it as written.

---

A plugin for Claude Code that walks you through building a product, start to finish. Think of it as a swiss knife for product design. It packs a full methodology into one tool – research, psychology, prototyping, development – but stays easy to pick up. You run one command, it figures out where you are, and opens the right instrument.

### Commands

| Command | What it does |
|---------|-------------|
| `/design-engineer:launch` | Detects your situation – new product setup, resume, or the task-driven iterate flow for a product that already exists |
| `/design-engineer:discovery` | Runs the design workflow – discovery, strategy, planning, validation |
| `/design-engineer:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs |
| `/design-engineer:development` | Development workflow – CLAUDE.md, agent pipeline, context management, implementation |
| `/design-engineer:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/design-engineer:document` | Saves decisions, learnings, and project state. Auto-purges disposable working files at every phase boundary. Helps communicate with stakeholders |
| `/design-engineer:stop` | Save progress and pause mid-activity – pick up later with `/design-engineer:launch` |
| `/design-engineer:tidy` | Manual purge of disposable working files under `.design-engineer-plugin/temporary/` (Playwright debug captures, intermediate drafts, scratch). Use before commit, or anytime the working tree feels noisy |
| `/design-engineer:help` | This help screen |

You only need to remember `/design-engineer:launch`. It guides you to everything else.

### What makes it different

- **53 skills** that teach how to think about problems, users, and psychology before writing code
- **8 specialized agents** for research, implementation, testing, design system compliance, and cross-session memory
- **100+ psychology principles** the AI draws from when reviewing your work
- **Grounded methodology** that keeps work traced to source, surfaces bot-block / auth-wall fallbacks for browser research instead of silently failing, and keeps deliverables at canonical paths

### Where files live

Everything the plugin produces lives under `.design-engineer-plugin/` — one umbrella, clear mental model. Subdirs: `design/{foundation,research,planning,exploration,psychology,reviews,dev,features}/`, `prototype/`, `plans/`, `memory/`, `temporary/` (gitignored, auto-purged at phase boundaries). The project root holds only your actual product code.

### Your project

If `.design-engineer-plugin/config.yaml` exists, read it and show:

```
Project type: {existing project / new product}
Goal: {if set}
```

If no config exists, show: "This project hasn't been set up yet. Run `/design-engineer:launch` to get started."
