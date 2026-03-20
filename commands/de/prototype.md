---
name: de:prototype
description: HTML prototype generation. Create clickable prototypes from planning docs, existing designs, or just an idea.
argument-hint: "[new | feature | redesign]"
---

# Prototype

## Context

<context> #$ARGUMENTS </context>

Generate a single-file HTML prototype using the `dev-prototyping` skill.

## Behavior

Load the `dev-prototyping` skill and follow its full 7-step flow.

After the prototype is generated (Step 4), run `/simplify` to review the prototype code for quality and efficiency. If further iterations happen in Step 5, run `/simplify` again after the final iteration round.

Before generating the prototype (Step 4), use the `test-writer` agent to create test scripts that verify the expected prototype behavior. Run the tests to confirm Red phase (failure). After the prototype is generated and `/simplify` has run, run the tests again to verify Green phase (pass).

### Argument Handling

If an argument was provided, use it to pre-select the answer in Step 1 (Understand Context):

| Argument | Pre-selected Option |
|----------|-------------------|
| `new` | "New product from scratch" |
| `feature` | "New feature for existing product" |
| `redesign` | "Redesign of existing feature" |

When pre-selecting, confirm the selection with the user ("Starting a prototype for a new product from scratch — correct?") and proceed directly to Step 2.

If no argument was provided, or the argument does not match any of the above, proceed normally with the Step 1 question.
