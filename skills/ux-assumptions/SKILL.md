---
name: ux-assumptions
description: Creates a living assumptions document categorizing beliefs about users, product, and business by risk level. Plans validation approaches. Use when identifying assumptions, tracking validation status, or planning research priorities.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Assumptions and Hypotheses

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_assumptions_log`. If it indicates the project already has an assumption / hypothesis log (in repo, or via an off-repo reference such as Notion / Linear captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the validated assumptions.
2. Ask via AskUserQuestion: "Your project already has an assumption / hypothesis log at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only (e.g., appending new assumptions).
5. If "Re-run anyway" → proceed normally below.

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

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand your current state with assumptions, 2) share my initial read on your assumptions and hypotheses, 3) ask 7–10 strategic questions to surface assumptions, 4) draft the assumptions document with categories and risk levels, 5) prioritize with a value-risk matrix, 6) iterate until you approve it, 7) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what assumptions and hypotheses are in product development and why they matter. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

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

```
multiSelect: false  # User must choose one current state
```

If the user has existing assumptions or research results, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the user's assumptions and hypotheses based on what you already know about the project. Draw on the user's context from Step 1, the problem statement, persona (if available), and your understanding of the domain.

Be explicit that these are starting points for discussion, not conclusions. If you can already spot risky assumptions or contradictions in the existing context, mention them. The goal is to give the user starting material for their own thinking – not to follow a rigid template.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project from Step 1 and any existing documents. Make sure your questions cover these key concepts:

- Two hypothesis formulas: "I believe [assumption], and I can find out by [method]" and "I will achieve [result] if [user group] gets [value] by using [functionality]"
- Lean UX guiding prompts (User: "My early users are...", Product: "These problems can be solved with...", Business: "I will get most of my users through...")
- Value-risk prioritization (Jeff Gothelf)
- Parking lot for ideas that do not solve the core problem

Ask in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. Do not generate the deliverable until at least 7 questions have been asked and answered.

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

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/foundation` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final assumptions document to `.design-engineer-plugin/design/foundation/assumptions.md`.

The document should follow the complete structure from [assumptions-template.md](./references/assumptions-template.md).

---

## Where New Ideas Go

When building a product, new ideas appear constantly. They should go to one of two places:

- **Assumptions/hypotheses list**: If the idea seems important and could positively or negatively impact the product
- **Parking lot**: A holding area for ideas that do not solve the core user problem and would add unnecessary weight to the MVP

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing assumption, an unaddressed risk, a contradiction nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No parking lot section. No invented features.** The assumptions activity should output assumptions, hypotheses, and a risk matrix – that's it. If AI sees gaps, ask the user, not add them to the deliverable.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

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


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
