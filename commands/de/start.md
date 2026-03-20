---
name: de:start
description: Universal entry point. New projects get setup, returning projects resume where they left off, existing projects get a capability guide.
argument-hint: ""
---

# Design Engineer – Start

*Let's find the right tool for where you are.*

## Context

<context> #$ARGUMENTS </context>

The first command you run. Handles three situations:

1. **Returning project** – detects your previous session state and lets you resume or browse capabilities
2. **New product** – runs interactive setup (environment detection, mode selection, scaffolding)
3. **Existing project** – shows everything the plugin can do, asks about your situation, and recommends relevant capabilities

## Workflow

### Step 1: Load Setup Skill

Load the `meta-setup` skill. It handles project detection and routing automatically:

- Checks for `.design-engineer.yaml` to detect returning projects
- If returning: shows resume state, offers continue/jump/browse
- If new: asks whether this is a new product or existing project
  - New product → mode selection, environment detection with proactive help, auto-scaffolding
  - Existing project → capability guide first, then minimal config

### Step 2: Follow the Routed Path

The `meta-setup` skill handles all routing. Do not override its detection logic.

For **new products**: mode preference → environment detection (proactively help install missing tools) → auto-scaffold with default path → suggest `/de:design`.

For **existing projects**: show all capabilities in plain language → ask diagnostic questions → filtered recommendations → minimal config.

For **returning projects**: show current state → offer to continue, jump to a phase, or browse capabilities.

## Mode

Guided mode only – interactive setup requires user input.
