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

### Step 1: Read Injected State

A hook has already detected the project state and injected it into your context. Look for the line starting with `DESIGN_ENGINEER_PROJECT_STATE:` – this is the definitive routing signal.

Load the `meta-setup` skill. It reads this state and routes automatically:

- `new_to_plugin`: asks whether this is a new product or existing project, then guides setup
- `returning_with_resume`: shows resume state, offers continue/jump/browse
- `returning_no_resume`: shows config summary, offers start/browse/reconfigure

Do not override the injected state with auto-memory or project context.

### Step 2: Follow the Routed Path

The `meta-setup` skill handles all routing based on the injected state.

For **new products**: mode preference → environment detection (proactively help install missing tools) → auto-scaffold with default path → suggest `/de:design`.

For **existing projects**: show all capabilities in plain language → ask diagnostic questions → filtered recommendations → minimal config.

For **returning projects**: show current state → offer to continue, jump to a phase, or browse capabilities.

## Mode

Guided mode only – interactive setup requires user input.
