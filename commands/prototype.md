---
description: HTML prototype generation. Create clickable prototypes from planning docs, existing designs, or just an idea.
argument-hint: "[new | feature | redesign]"
---

# Prototype

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

## Context

<context> #$ARGUMENTS </context>

Generate a single-file HTML prototype using the `dev-prototyping` skill.

## Step 1: Read project context

1. Check what design deliverables exist (.design-engineer-plugin/design/ – problem statement, IA, user flows, etc.)
2. Check if Figma is connected

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

Discuss scope and approach before building.

## Step 3: Execute

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-prototyping/SKILL.md` and follow its full 7-step flow. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`.

After the initial prototype, pause for review and iterate based on feedback. Before each review pause, click through the main flows in the browser (Playwright) to confirm links, states, and interactions work; save any captures under `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/`. For a prototype the user plans to keep long-term, offer the `test-writer` agent as an opt-in – never by default.

Note: do NOT run /simplify on prototype HTML. Prototypes are throwaway visual artifacts; code quality is irrelevant in this phase. /simplify applies only during /design-engineer:development implementation.

## Post-prototype

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Iterate on this"
    description: "Make changes based on what you see – tell me what to adjust"
  - label: "Review quality"
    description: "Run a design review on the prototype (UX, accessibility, psychology)"
  - label: "Move to development"
    description: "Use this prototype as the reference and implement in production code"
  - label: "Done for now"
    description: "The prototype stays saved on disk – pick it up later with /design-engineer:launch"
multiSelect: false
```

On selection:

- "Iterate on this" → ask what to adjust and keep iterating within this command.
- "Review quality" → announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/review.md` and follow its instructions inline, scoped to the prototype.
- "Move to development" → announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/development.md` and follow its instructions inline, carrying forward the prototype path (`.design-engineer-plugin/prototype/prototype.html`) as the visual reference. Do NOT end the turn telling the user to run `/design-engineer:development` themselves.
- "Done for now" → confirm the prototype's saved path and end the session.
