---
name: ux-problem-statement
description: Creates a problem statement defining what problem exists, who feels it most, and how the product will help. Use when starting a new product, pivoting direction, or when the team lacks clarity on what they are solving.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Problem Statement

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_problem_statement`. If it indicates the project already has problem framing (in repo, or via an off-repo reference such as Notion / Linear / Confluence captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the problem framing.
2. Ask via AskUserQuestion: "Your project already has a problem framing at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only.
5. If "Re-run anyway" → proceed normally below.

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

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand what you have so far, 2) share my initial read on the problem, 3) ask 7–10 strategic questions to sharpen the problem, 4) draft the problem statement together, 5) iterate until you approve it." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what a problem statement is and why it matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

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

```
multiSelect: false  # User must choose one current state
```

If the user has existing notes or a draft, ask them to share the content before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

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

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. Do not generate the deliverable until at least 7 questions have been asked and answered.

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

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/foundation` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final problem statement document to `.design-engineer-plugin/design/foundation/problem-statement.md`.

The document should follow the complete structure from [problem-statement-template.md](./references/problem-statement-template.md), including:

- Executive summary (2-3 sentences)
- The three core questions answered in detail
- Target user snapshot
- Success criteria
- Evolution notes (how this statement may change as you learn more)

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing audience segment, an unaddressed risk, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No solutions in discovery**: During this activity, do not introduce specific product features or solutions. Stay focused on the problem – who has it, how painful it is, what they do today. Solutions belong in later pipeline phases (MVP requirements, product planning).
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

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


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
