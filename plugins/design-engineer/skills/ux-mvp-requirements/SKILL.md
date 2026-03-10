---
name: ux-mvp-requirements
description: Defines and prioritizes MVP features using the ICE model, separating must-haves from nice-to-haves. Use when you need to decide what to build first, cut scope to launch faster, or when the feature list has grown beyond what is realistic for initial release.
disable-model-invocation: true
---

# MVP Requirements

## Why This Matters

Beginner founders usually think everything is important. They try to pack every possible feature into their product, which means years of building and no launch. Writing clear MVP requirements protects you from that trap.

Good requirements are not about what you create -- they are about what you deliberately choose NOT to create. Less functionality often means more functionality that actually matters.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

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

If the user has existing feature lists, information architecture, or user research results, ask them to share before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, share how the MVP scope could be viewed from multiple angles:

- **User perspective**: What is the minimum set of features that delivers the core value promise
- **Business perspective**: What features are needed to validate the business model
- **Technical perspective**: What is realistic to build given the available resources and timeline
- **Competitive perspective**: What is the minimum to be credibly different from existing solutions

Keep each to 2-3 sentences. Be honest about trade-offs.

---

## Step 3: Ask Strategic Questions

Ask 7-10 questions to define the MVP boundary:

1. **Core value**: If your product could do only ONE thing, what would it be?
2. **Feature inventory**: List every feature you have considered. Do not filter yet -- just get them all out.
3. **User journey**: What is the minimum path a user takes from first touch to experiencing value?
4. **Deal breakers**: Which features, if missing, would make the product useless?
5. **Nice-to-haves**: Which features would be great but the product still works without them?
6. **Constraints**: What are your constraints? Time, budget, technical skills, team size?
7. **Free vs. paid scope**: If you have a freemium model, what is in the free tier vs. paid tier for MVP?
8. **Competitor baseline**: What do competitors offer at their most basic level?
9. **Validation goal**: What specific hypothesis does the MVP need to validate?
10. **Launch timeline**: When do you want to launch, and what is realistic?

Ask in small batches (2-3 at a time). Wait for answers before continuing.

---

## Step 4: Apply ICE Prioritization

For every feature identified, apply the ICE model. Score each from 1-10 across three criteria:

- **Impact**: How much users need this feature
- **Confidence**: How sure you are it will be valuable for the product
- **Ease**: How easy it is to design and build (considering both design and technical effort)

Multiply the three scores. Features with the highest ICE score get the highest priority.

Present the scored list and help the user draw the MVP line -- everything above the line ships in v1, everything below goes to the parking lot.

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
2. Challenge scope creep -- if features keep getting added, push back constructively
3. Verify that the MVP still tells a coherent story (not a random collection of features)
4. Ensure the validation goal is still achievable with this scope

Repeat until the user explicitly approves the MVP requirements.

---

## Step 7: Produce the Deliverable

Save the final MVP requirements to `{deliverables_path}/foundation/mvp-requirements.md`.

The document should follow the complete structure from [mvp-prioritization-framework.md](./references/mvp-prioritization-framework.md).

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (persona, business plan, competitive analysis, IA) informs prioritization
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After MVP requirements are finalized, suggest:

1. `ux-information-architecture` -- Map the product structure based on the prioritized feature set
2. Begin UI design and prototyping based on the defined scope

---

## Resource Files

- [mvp-prioritization-framework.md](./references/mvp-prioritization-framework.md) -- ICE prioritization matrix, acceptance criteria format, and parking lot structure
