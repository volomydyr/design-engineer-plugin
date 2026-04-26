---
name: ux-mvp-requirements
description: Defines and prioritizes MVP features using the ICE model, separating must-haves from nice-to-haves. Use when deciding what to build first, cutting scope to launch faster, or when the feature list exceeds initial release capacity.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# MVP Requirements

## Why This Matters

Beginner founders usually think everything is important. They try to pack every possible feature into their product, which means years of building and no launch. Writing clear MVP requirements protects you from that trap.

Good requirements are not about what you create – they are about what you deliberately choose NOT to create. Less functionality often means more functionality that actually matters.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess your current feature planning state, 2) share my initial perspectives on the MVP scope, 3) ask 7–10 strategic questions to sharpen priorities, 4) apply ICE prioritization to every feature, 5) draft the MVP requirements together, 6) iterate until you approve, 7) produce the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with how MVP requirements work and why ruthless prioritization matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Current State

```
question: "What is your current situation with feature planning?"
header: "Feature Planning Status"
options:
  - label: "I have a long list of feature ideas"
    description: "I have collected many ideas but have not prioritized them"
  - label: "I have a rough sense of priorities"
    description: "I know what seems important but have not structured it"
  - label: "I have an existing MVP scope to review"
    description: "I have defined MVP features but need to re-evaluate"
  - label: "Starting from scratch"
    description: "I need to figure out what features are needed"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing feature lists, information architecture, or user research results, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the MVP scope based on what you know about the project so far. Keep it to 2-3 sentences per thought. Be honest about trade-offs.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project. Make sure your questions cover these key concepts:

- ICE model: Impact 1-10, Confidence 1-10, Ease 1-10, multiply for priority score
- Free vs. paid boundary definition
- Parking lot for deferred features
- "Beginner founders often think everything is important"

Ask in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding to Step 4.

---

## Step 4: Apply ICE Prioritization

For every feature identified, apply the ICE model. Score each from 1-10 across three criteria:

- **Impact**: How much users need this feature
- **Confidence**: How sure you are it will be valuable for the product
- **Ease**: How easy it is to design and build (considering both design and technical effort)

Multiply the three scores. Features with the highest ICE score get the highest priority.

Present the scored list and help the user draw the MVP line – everything above the line ships in v1, everything below goes to the parking lot.

**BLOCKING REQUIREMENT**: Wait for the user's feedback on the ICE scores and MVP line before proceeding to Step 5.

---

## Step 5: Draft the MVP Requirements

Based on the prioritized list, draft the MVP requirements document following the structure in [mvp-prioritization-framework.md](./references/mvp-prioritization-framework.md).

Present the draft and ask for feedback. Ensure:

- The MVP is genuinely minimal (challenge anything that is not essential for core value)
- Constraints are clearly documented so the scope does not creep
- Each must-have feature has acceptance criteria
- The parking lot captures everything that was cut, with reasoning

---

## Step 6: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate changes
2. Challenge scope creep – if features keep getting added, push back constructively
3. Verify that the MVP still tells a coherent story (not a random collection of features)
4. Ensure the validation goal is still achievable with this scope

Repeat until the user explicitly approves the MVP requirements.

---

## Step 7: Produce the Deliverable

Save the final MVP requirements to `design/planning/mvp-requirements.md`.

The document should follow the complete structure from [mvp-prioritization-framework.md](./references/mvp-prioritization-framework.md).

After completing the MVP requirements, check if any new assumptions surfaced. If so, Read `design/foundation/assumptions.md` and append the new assumptions with a note: 'Added from MVP requirements on [date].' The assumptions document is a living deliverable that accumulates insights across the pipeline.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing feature, an unaddressed risk, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read. Only include features that emerged from the user's input across previous activities. If AI has ideas or sees gaps, ask: "I noticed X wasn't covered – do you think this belongs?" Not silently add features and label them lower priority. Suggestions must be explicit questions, not items in the deliverable.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (persona, business plan, competitive analysis, IA) informs prioritization
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After MVP requirements are finalized, suggest:

1. `ux-information-architecture` – Map the product structure based on the prioritized feature set
2. Begin UI design and prototyping based on the defined scope

---

## Resource Files

- [mvp-prioritization-framework.md](./references/mvp-prioritization-framework.md) – ICE prioritization matrix, acceptance criteria format, and parking lot structure


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` — "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
