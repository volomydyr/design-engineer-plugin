---
name: de:setup
description: Smart entry point. Detects your situation and routes you — new projects get full setup, returning projects resume, existing projects get a capability guide.
argument-hint: ""
---

# Design Engineer Setup

## Context

<context> #$ARGUMENTS </context>

The universal entry point for the design-engineer plugin. Handles three situations:

1. **Returning project** – detects your previous session state and lets you resume or browse capabilities
2. **New product** – runs full interactive setup (environment detection, configuration, scaffolding)
3. **Existing project** – shows everything the plugin can do, asks about your situation, and recommends relevant capabilities

## Workflow

### Step 1: Load Setup Skill

Load the `meta-setup` skill. It handles project detection and routing automatically:

- Checks for `.design-engineer.yaml` to detect returning projects
- If returning: shows resume state or config, offers continue/browse/reconfigure
- If new: asks whether this is a new product or existing project
  - New product → full setup flow (environment detection, config questions, scaffolding)
  - Existing project → capability guide first, then minimal config

### Step 2: Follow the Routed Path

The `meta-setup` skill handles all routing. Do not override its detection logic.

For **new products**: environment detection → configuration questions → folder scaffolding → dependency tracking → next step suggestion.

For **existing projects**: show all capabilities in plain language → ask diagnostic questions (project type, what they have, what they want to do) → filtered recommendations → minimal config.

For **returning projects**: show current state → offer to continue, jump to a phase, or browse capabilities.

## Mode

Guided mode only – interactive setup requires user input.
