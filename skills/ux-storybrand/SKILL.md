---
name: ux-storybrand
description: Creates a StoryBrand framework document for clear product messaging where the user is the hero and the product is the guide. Use when crafting landing pages, marketing copy, or UX writing that emotionally connects with users.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# StoryBrand Framework

> **Opt-in depth.** This skill is off the default discovery spine. The default flow runs problem statement, target audience, MVP requirements, information architecture, prototype, then development. Run StoryBrand only when the user adds depth, either by asking for it directly or by picking it from the optional depth menu.

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.existing_brand_docs`. If it indicates the project already has brand voice / messaging documentation (in repo, or via an off-repo reference such as Figma / Notion / Storybook captured in `off_repo_references`), OR `project.context.shipped_ui: true` indicates an established product where regenerating from scratch isn't appropriate, AND the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain how the shipped product implies the brand voice.
2. Ask via AskUserQuestion: "Your project already has brand voice / StoryBrand framing at <location>. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only.
5. If "Re-run anyway" → proceed normally below.

## Why This Matters

StoryBrand is a storytelling method where the user is the main hero, and your product is simply the guide that helps them succeed. It is used far beyond tech – authors and screenwriters apply the same structure. Think about the flow of your favorite movie and you will see the pattern.

It helps you:

- Communicate ideas in a way that connects emotionally
- Sell an idea, especially when you do not have a product yet

Where to use it:

- Marketing, social posts, email, ad campaigns
- Product branding, website copy, UX microcopy
- Basically anywhere words and your business intersect

Most businesses talk about themselves: how great their product is and how advanced their features are. But people only care about themselves. Top brands do not talk about "me" – they talk about you: your problems, your struggles, your transformation. They show how their product helps you avoid failure and become a better version of yourself.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess your readiness and existing materials, 2) share my initial read on the StoryBrand narrative, 3) ask only the questions I can't infer about the 7-element framework, 4) draft the StoryBrand canvas together, 5) iterate until you approve it, 6) save the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with the StoryBrand framework and why it matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Readiness

```
question: "What have you already done before creating StoryBrand messaging?"
header: "StoryBrand Readiness"
options:
  - label: "I have user research and a persona"
    description: "I have talked to users or surveyed them and built a persona"
  - label: "I have a proto-persona only"
    description: "I have assumptions about my user but no validated data"
  - label: "I have an existing StoryBrand to refine"
    description: "I previously created a StoryBrand canvas and want to improve it"
  - label: "Starting from scratch"
    description: "I have not done user research or persona work yet"
```

```
multiSelect: false  # User must choose one readiness state
```

If the user has not done user research, strongly recommend completing `ux-target-audience` first. StoryBrand works best when grounded in real user understanding, not assumptions. However, if the user wants to proceed, continue with available context.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the StoryBrand narrative based on what you know about the project so far. Keep it to 2-3 sentences per thought. Ground these in the user's product context.

---

## Step 3: Ask Strategic Questions

Ask only what you can't infer from what you already know about the project and any existing documents. Don't ask for what the user already gave you or what you can reasonably draw from context. When you do have gaps, batch the questions (no more than 4 at a time) rather than asking one by one. Draw from these key concepts only for the gaps that matter:

- The 7-element StoryBrand framework: hero, 3-layer problem (external, internal, philosophical), guide with empathy and authority, plan, call to action, success, failure
- The user is the hero, the product is the guide
- Application to marketing, social posts, email, ad campaigns, product branding, website copy, UX microcopy

Ask in small batches (no more than 4 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding. There is no minimum question count – once you have enough to draft a grounded deliverable, move on.

---

## Step 4: Draft the StoryBrand Canvas

Based on the user's answers, draft the StoryBrand canvas following the structure in [storybrand-canvas-template.md](./references/storybrand-canvas-template.md).

Present the draft and ask for feedback. Check that:

- The messaging is about the user, not the product
- The problem has all three layers (external, internal, philosophical)
- The plan is simple (3-4 steps maximum)
- Success and failure create emotional contrast
- The language is clear, not jargon-filled

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and new language
2. Test the messaging: does it make the user want to take action?
3. Flag any sections that still sound like the brand talking about itself
4. Ensure the emotional thread is consistent throughout

Repeat until the user explicitly approves the StoryBrand canvas.

---

## Step 6: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/foundation` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final StoryBrand canvas to `.design-engineer-plugin/design/foundation/storybrand.md`.

The document should follow the complete structure from [storybrand-canvas-template.md](./references/storybrand-canvas-template.md).

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing story element, an unaddressed emotional layer, a persona insight nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No solutions in discovery**: During this activity, do not introduce specific product features or solutions. Stay focused on the narrative framework – the hero's journey, the problem layers, the transformation. Feature decisions belong in later pipeline phases.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (persona, user research, problem statement) informs the narrative
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After StoryBrand is finalized, suggest:

1. Use the StoryBrand canvas to write landing page copy
2. Use it as the foundation for UX microcopy throughout the product
3. `ux-business-plan` – Build the business plan informed by the messaging strategy

---

## Resource Files

- [storybrand-canvas-template.md](./references/storybrand-canvas-template.md) – Complete StoryBrand canvas structure with examples


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
