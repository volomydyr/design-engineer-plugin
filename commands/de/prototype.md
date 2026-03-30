---
name: de:prototype
description: HTML prototype generation. Create clickable prototypes from planning docs, existing designs, or just an idea.
argument-hint: "[new | feature | redesign]"
---

# Prototype

## Context

<context> #$ARGUMENTS </context>

Generate a single-file HTML prototype using the `dev-prototyping` skill.

## Step 1: Read project context

1. Read `.design-engineer.yaml` for mode (guided/god)
2. Check what design deliverables exist (docs/design/ — problem statement, IA, user flows, etc.)
3. Check if Figma is connected

## Step 2: Plan

Present what the prototype will be based on:

```
Here's what I have to work with:

{List available context: design docs, Figma designs, user description, etc.}

I'll build a clickable HTML prototype that covers {scope}. Want to adjust?
```

If an argument was provided:
- `new` → prototype for a new product from scratch
- `feature` → prototype for a new feature in the existing product
- `redesign` → prototype to replace an existing feature

Confirm the selection: "Starting a prototype for {type} – correct?"

In **Guided mode**: discuss scope and approach before building.
In **God mode**: show plan briefly, then build.

## Step 3: Execute

Load the `dev-prototyping` skill and follow its full 7-step flow.

In **Guided mode**: pause after the initial prototype for review, iterate based on feedback.
In **God mode**: build the prototype, present it, ask for feedback.

After the prototype is generated, run `/simplify` to review code quality.

## Step 4: Test

Use the `test-writer` agent to create test scripts that verify prototype behavior. Run tests to confirm they pass.

## Post-prototype

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Tweak it"
    description: "Make changes based on what you see – tell me what to adjust"
  - label: "Check the quality"
    description: "Run a design review on the prototype (UX, accessibility, psychology)"
  - label: "Start building for real"
    description: "Use this prototype as the reference and implement in production code"
```
