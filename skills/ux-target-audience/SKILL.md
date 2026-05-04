---
name: ux-target-audience
description: Develops detailed user personas with demographics, motivations, pain points, and behavioral patterns. Use when defining or refining who your product is for, after the problem statement is established.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Target Audience

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_personas`. If it indicates the project already has user personas (in repo, or via an off-repo reference such as Notion / Confluence captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the audience definition.
2. Ask via AskUserQuestion: "Your project already has user personas at <location>. What would you like to do?" Options: "Use them as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use them as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only.
5. If "Re-run anyway" → proceed normally below.

## Why This Matters

A user persona helps you stay focused on who you are building the product for. Every time a new idea pops into your head, check it against the persona. This way, you avoid one of the most common traps – building features instead of solving real needs.

You can start with a proto-persona: your best guess of who the user is, even without solid data. Later, you refine it as you gather insights from surveys and user tests.

There is no universal template for a persona – the details always depend on your product. Still, focus on four categories:

- **Background**: Their role, environment, and daily situation
- **Behaviors**: How they act, make decisions, or approach the problem area
- **Pain points**: What frustrates them most about today's solutions
- **Goals**: What "better" looks like for them

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess what you already know about your target users, 2) share my initial read on the audience, 3) ask 7–10 strategic questions to build the persona, 4) draft the persona document together, 5) iterate until you approve it, 6) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what a user persona is and why it matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Current Knowledge

```
question: "How well do you know your target users right now?"
header: "User Knowledge"
options:
  - label: "I have a general idea"
    description: "I know roughly who they are but have not documented it"
  - label: "I have a proto-persona"
    description: "I have written down my assumptions about the user"
  - label: "I have survey or interview data"
    description: "I have talked to real users or collected responses"
  - label: "I have an existing persona to update"
    description: "I have a persona document that needs revision based on new insights"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing data, surveys, or persona drafts, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the target audience based on what you already know about the project. Draw on the user's context from Step 1, the problem statement (if available), and your understanding of the domain.

Be honest about what is speculation versus what is grounded in shared data. If you see patterns or potential segments worth exploring, mention them. The goal is to give the user starting material for their own thinking – not to follow a rigid template.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project from Step 1 and any existing documents. Make sure your questions cover these key concepts:

- Proto-persona: best guess of who the user is
- 4 categories: background, behaviors, pain points, goals
- 3 empathy questions (Hope/Pain/Barrier): "If you had a magic wand...", "What is your biggest challenge...", "Last time you tried to solve this..."
- 3 reasons ideas fail: users not motivated enough, product too complex, no trigger to act

Ask questions in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. Do not generate the deliverable until at least 7 questions have been asked and answered.

---

## Step 4: Draft the Persona

Based on the user's answers, draft the persona document following the structure in [persona-framework.md](./references/persona-framework.md).

Present the draft and ask for feedback. Pay special attention to:

- Whether the persona is specific enough (not "all professionals" or "anyone who wants to learn")
- Whether behaviors are described concretely (not "they use social media" but "they save learning links in Telegram chats they never revisit")
- Whether the Behavior Map questions revealed genuine emotional insights

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and additions
2. Flag if the persona is becoming too broad or too generic
3. Distinguish between confirmed knowledge and assumptions (mark assumptions explicitly)
4. Ask follow-up questions where needed

Repeat until the user explicitly approves the persona.

---

## Step 6: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/foundation` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final persona document to `.design-engineer-plugin/design/foundation/target-audience.md`.

The document should follow the complete structure from [persona-framework.md](./references/persona-framework.md).

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing audience segment, an unaddressed risk, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **Do not add secondary personas or audience segments without asking the user first.** If you see a gap, ask: "Should we consider a secondary audience?"
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (problem statement, survey results) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After the persona is finalized, suggest:

1. `ux-assumptions` – Document and categorize all assumptions about the user and product
2. `ux-user-interviews` – Design research to validate the persona with real users

---

## Resource Files

- [persona-framework.md](./references/persona-framework.md) – Complete persona structure integrating Behavior Map questions with practical product context


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
