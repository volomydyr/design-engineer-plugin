---
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
| `/design-engineer:launch` | Detects your situation – new product setup, resume, or a product that already exists |
| `/design-engineer:discovery` | Runs the design workflow – discovery, strategy, planning, validation – argument `feature-spec` produces a truly minimal spec for established products |
| `/design-engineer:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs – arguments `new \| feature \| redesign` |
| `/design-engineer:development` | Development workflow – CLAUDE.md, agent pipeline, context management, implementation |
| `/design-engineer:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics – argument `audit` runs a multi-page commercial audit with designer-feedback capture per page |
| `/design-engineer:document` | Saves decisions, learnings, and project state. Purges disposable working files at completion milestones. Helps communicate with stakeholders – arguments `status \| stakeholder` |
| `/design-engineer:stop` | Save progress and pause mid-activity – pick up later with `/design-engineer:launch` |
| `/design-engineer:tidy` | Manual purge of disposable working files under `.design-engineer-plugin/temporary/` (Playwright debug captures, intermediate drafts, scratch). Use before commit, or anytime the working tree feels noisy |
| `/design-engineer:mute-unmute-sound` | Toggle plugin sound notifications on or off – first call mutes, second unmutes |
| `/design-engineer:help` | This help screen |

You only need to remember `/design-engineer:launch`. It guides you to everything else.

### What makes it different

- **51 skills** that teach you how to think about problems, users, psychology, and design before you write a single line of code
- **Built-in discipline** that prevents common AI mistakes (scope creep, skipping tests, ignoring your requirements)
- **10 specialized agents** that handle specific parts of the workflow
- **A knowledge base** of 100+ psychology principles, design frameworks, and animation references that Claude draws from when reviewing your work
- **Existing-project support** – for a product that already exists, you say what you want to work on, or pick a starting point, and the plugin runs the right skills for the task

### Where files live

Everything the plugin produces lives under `.design-engineer-plugin/` — one umbrella, clear mental model. Subdirs: `design/{foundation,research,planning,exploration,psychology,reviews,dev,features,specs}/`, `prototype/`, `plans/`, `memory/`, `temporary/` (gitignored, purged at completion milestones). The project root holds only your actual product code.

### Your project

If `.design-engineer-plugin/config.yaml` exists, read it and show:

```
Project type: {existing project / new product}
Goal: {if set}
```

If no config exists, show: "This project hasn't been set up yet. Run `/design-engineer:launch` to get started."
