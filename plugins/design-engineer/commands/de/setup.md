---
name: de:setup
description: One-time plugin configuration. Detects environment, asks about your project, scaffolds deliverable folders.
argument-hint: ""
---

# Design Engineer Setup

## Context

<context> #$ARGUMENTS </context>

This is the mandatory first command. Run it once before using any other design-engineer command.

## What Happens

1. **Environment detection** -- automatically detects installed MCPs (Context7, Figma MCP, Playwright, Figma Console), available tools, and project state
2. **Configuration questions** -- asks 5-7 questions about your project and preferences
3. **Project scaffolding** -- creates a standardized folder structure for design deliverables
4. **Dependency tracking** -- initializes the cross-document dependency graph

## Workflow

### Step 1: Load Setup Skill

Load the `meta-setup` skill. This skill handles the entire setup process interactively.

### Step 2: Environment Detection

Run the environment detection script to identify available tools:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/meta-setup/scripts/detect-environment.sh
```

Report findings to the user before proceeding.

### Step 3: Configuration Questions

Use AskUserQuestion to ask each configuration question one at a time.

If AskUserQuestion is not available, present questions as numbered lists and ask the user to reply with the number of their choice.

Questions to ask (from the setup checklist in `meta-setup`):

1. **Project state** -- Is this a new idea, an existing project without design docs, or an existing project with design docs?
2. **Working mode** -- Do you prefer God mode (autonomous) or Guided mode (step-by-step)?
3. **Team size** -- Are you working solo or with a team?
4. **Deliverables path** -- Where should design documents be stored? (default: `docs/design/`)
5. **Tool preferences** -- Which design tools do you use? (Figma, Sketch, other)
6. **Development stack** -- What is your tech stack? (This helps adapt agent templates)
7. **Prior research** -- Do you have existing research, personas, or competitive analysis to import?

### Step 4: Project Scaffolding

Run the project initialization script:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/meta-setup/scripts/init-project-structure.sh
```

### Step 5: Configuration File

Create `design-engineer.local.md` in the project root with the user's answers. This file is read by all subsequent commands.

### Step 6: Confirmation

Summarize what was detected, configured, and created. Suggest the next command based on project state:

- New idea: "Run `/de:design` to start the full design pipeline"
- Existing project without docs: "Run `/de:research` to begin research activities"
- Existing project with docs: "Run `/de:review` to audit your current design"

## Mode

Guided mode only -- interactive setup requires user input.
