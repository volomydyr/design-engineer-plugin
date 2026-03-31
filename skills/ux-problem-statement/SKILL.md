---
name: ux-problem-statement
description: Creates a problem statement defining what problem exists, who feels it most, and how the product will help. Use when starting a new product, pivoting direction, or when the team lacks clarity on what they are solving.
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Problem Statement

## Why This Matters

The very first step in building a product is defining the problem you are solving. Without this, everything else – personas, hypotheses, even design decisions – will float in the air without a foundation.

A solid problem statement answers three key questions:

1. **What problem exists right now that is not being solved well?** This helps you identify the gap among existing products.
2. **Who feels this pain the most?** This points to your target audience and ensures you are not building a product "for everyone."
3. **How will your product make their life better?** This explains your uniqueness among competitors.

Keep it short and concrete. Do not describe features or solutions yet – stay focused on the pain.

A common mistake is slipping into "solution mode" too early. The stronger version of a problem statement always comes after you strip away specific features and focus purely on the problems. For example, mentioning "motivation" or "personalization" is already describing solutions, not problems.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand Context

Determine what the user already has:

```
question: "What do you have so far regarding the problem your product solves?"
header: "Current State"
options:
  - label: "Nothing yet"
    description: "I have an idea but have not written down the problem"
  - label: "Rough notes"
    description: "I have some thoughts about the problem but nothing structured"
  - label: "Existing problem statement"
    description: "I have a draft that needs refinement"
  - label: "Evolved understanding"
    description: "My initial problem statement no longer reflects what I have learned"
```

If the user has existing notes or a draft, ask them to share the content before proceeding.

---

## Step 2: Share Initial Perspectives

Before diving into questions, share your brief initial thoughts about the problem statement based on what you already know about the project. Draw on the user's context from Step 1, any existing project documents, and your understanding of the domain.

Be honest and direct. If the problem seems narrow or broad, say so. If you see potential blind spots or strengths, mention them. The goal is to give the user starting material for their own thinking – not to follow a rigid template.

---

## Step 3: Ask Strategic Questions

**Ask 7–10 strategic questions. Do NOT generate the deliverable after fewer than 7 questions.** The forcing questions below are mandatory when the user's context is thin – do not skip them. Adapt to what you already know from Step 1. Cover these key concepts:

- What problem exists right now that is not being solved well?
- Who feels this pain the most?
- How will your product make their life better?
- Warning: avoid "solution mode" – focus on the problem, not features

### Forcing questions

These cut through vague thinking. Adapt them to the user's context – don't ask all of them mechanically, but make sure the hard ones get asked:

- **Demand reality**: Who specifically needs this? Can you name 3 real people (or types of people) who would pay for it or change their behavior because of it?
- **Status quo**: What do people do today without your product? Why is that not good enough? Be specific – "they use spreadsheets" or "they ask a colleague" is better than "there's no good solution."
- **Narrowest wedge**: What is the smallest, most focused version of this product that would still change someone's behavior? Not an MVP feature list – the single thing that makes someone switch.
- **Surprising observations**: What have you seen or experienced that most people building in this space have not? What do you know that others don't?
- **Failure mode**: If this product fails, what's the most likely reason? What assumption, if wrong, kills the whole thing?
- **Existing alternatives**: Who are the closest competitors, and why haven't they solved this? Is the gap in their product, their market, their awareness, or something else?

When the user already has a clear problem statement draft, skip the forcing questions and go straight to refinement. Use them when the user's context is thin or their thinking is vague.

Ask questions one at a time or in small batches (2-3). Wait for answers before continuing.

---

## Step 4: Draft the Problem Statement

Based on the user's answers, draft the problem statement document following the structure in [problem-statement-template.md](./references/problem-statement-template.md).

Present the draft and ask for feedback. Pay special attention to:

- Whether the statement slips into "solution mode" (describing features instead of problems)
- Whether the target user is specific enough (not "everyone" or "all professionals")
- Whether the pain is real and significant (not a nice-to-have improvement)

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate the user's corrections and additions
2. Flag if the statement is drifting toward solutions instead of problems
3. Check that the three core questions are clearly answered
4. Share your honest perspective – if something feels weak or unclear, say so
5. Ask follow-up questions where needed

Repeat until the user explicitly approves the problem statement.

---

## Step 6: Produce the Deliverable

Save the final problem statement document to `{deliverables_path}/foundation/problem-statement.md`.

The document should follow the complete structure from [problem-statement-template.md](./references/problem-statement-template.md), including:

- Executive summary (2-3 sentences)
- The three core questions answered in detail
- Target user snapshot
- Success criteria
- Evolution notes (how this statement may change as you learn more)

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (Big Idea doc, prior research) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance – always presented as suggestions, not decisions

---

## What Comes Next

After the problem statement is finalized, suggest:

1. `ux-target-audience` – Build detailed user personas based on the problem
2. `ux-assumptions` – Document what you believe to be true and plan validation

---

## Resource Files

- [problem-statement-template.md](./references/problem-statement-template.md) – Complete deliverable structure with examples and anti-patterns
