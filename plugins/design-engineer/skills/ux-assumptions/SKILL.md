---
name: ux-assumptions
description: Creates a living assumptions document categorizing beliefs about users, product, and business by risk level. Plans validation approaches. Use when identifying assumptions, tracking validation status, or planning research priorities.
disable-model-invocation: true
---

# Assumptions and Hypotheses

## Why This Matters

There are two main types of hypotheses: those based on user, product, or business assumptions, and those tied to functionality. A hypothesis is essentially an assumption with a research method attached to it.

Most designers are not fans of writing them out. But it is easier than it looks if you stick to two simple formulas:

1. "I believe [assumption is true/false], and I can find out by [research method]."
2. "I will achieve [result] if [user group] gets [value] by using [functionality]. I can validate this through [research method]."

This is a living document. New hypotheses are added constantly – usually around 2 AM. The key discipline is tracking them systematically, categorizing by risk, and prioritizing which ones to test first.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand Current State

```
question: "What is your current situation with assumptions and hypotheses?"
header: "Assumptions Status"
options:
  - label: "Starting fresh"
    description: "I have not documented any assumptions yet"
  - label: "I have a list of beliefs"
    description: "I know what I assume but have not structured or prioritized them"
  - label: "I have hypotheses to update"
    description: "I have a document that needs revision based on new research results"
  - label: "Post-research update"
    description: "I just completed surveys or testing and need to update assumption statuses"
```

If the user has existing assumptions or research results, ask them to share before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, briefly analyze the user's product context from multiple assumption angles:

- **User assumptions**: What you believe about who the users are and what they need
- **Product assumptions**: What you believe about how the product should work
- **Business assumptions**: What you believe about how the product will make money and grow
- **Technical assumptions**: What you believe about feasibility and implementation complexity

For each angle, share 2-3 specific assumptions you can already infer from the user's problem statement and persona (if available). Be explicit that these are starting points for discussion, not conclusions.

---

## Step 3: Ask Strategic Questions

Ask 7-10 questions to surface hidden assumptions. Use these as a starting framework:

1. **User identity**: Who are your early users? How confident are you that this is the right group?
2. **Core problem**: What specific problems do they have? Have you verified this with real people?
3. **Solution fit**: How do you believe these problems can be solved? What makes you think your approach is the right one?
4. **Feature priority**: Which features do you consider most important? Why these and not others?
5. **Value proposition**: What is the main value of your product? Would your users describe it the same way?
6. **User acquisition**: How will you get your first users? What channels will work best?
7. **Revenue**: How will you make money? Is this based on evidence or hope?
8. **Competition**: Who are your main competitors? Are you sure you are not missing indirect ones?
9. **Biggest risk**: What is the biggest risk for your product? What could make everything fail?
10. **Risk mitigation**: How do you plan to avoid or reduce that risk?

Ask in small batches (2-3 at a time). Wait for answers before continuing.

---

## Step 4: Draft the Assumptions Document

Based on the user's answers, draft the assumptions document following the structure in [assumptions-template.md](./references/assumptions-template.md).

For each assumption:
- Categorize it (user, product, business, or technical)
- Assess risk level (high, medium, low)
- Suggest a validation method
- Convert it into a testable hypothesis using the two formulas

Present the draft and ask for feedback.

---

## Step 5: Prioritize with Value-Risk Matrix

Help the user prioritize which assumptions to test first using a value-risk matrix:

- **Value axis**: The potential benefit for users and impact on business goals
- **Risk axis**: The possible negative impact on the product and technical complexity

High-value, high-risk assumptions should be tested first. Low-value, low-risk assumptions can wait or go to the parking lot.

New hypotheses are added or adjusted constantly – this is not a fixed process. Prioritization should happen before planning each new round of research, because it determines what gets tested next.

---

## Step 6: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and additions
2. Flag assumptions that contradict each other
3. Ensure every high-risk assumption has a clear validation plan
4. Distinguish between assumptions that need validation and those already confirmed by existing data

Repeat until the user explicitly approves the assumptions document.

---

## Step 7: Produce the Deliverable

Save the final assumptions document to `{deliverables_path}/foundation/assumptions.md`.

The document should follow the complete structure from [assumptions-template.md](./references/assumptions-template.md).

---

## Where New Ideas Go

When building a product, new ideas appear constantly. They should go to one of two places:

- **Assumptions/hypotheses list**: If the idea seems important and could positively or negatively impact the product
- **Parking lot**: A holding area for ideas that do not solve the core user problem and would add unnecessary weight to the MVP

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (problem statement, persona, survey data) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After assumptions are documented, suggest:

1. `ux-user-interviews` – Design research to validate the highest-priority assumptions
2. `ux-competitor-analysis` – Research competitors to validate market-related assumptions

---

## Resource Files

- [assumptions-template.md](./references/assumptions-template.md) – Categorized assumption tracking format with prioritization matrix
