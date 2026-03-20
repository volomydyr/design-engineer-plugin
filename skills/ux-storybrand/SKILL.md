---
name: ux-storybrand
description: Creates a StoryBrand framework document for clear product messaging where the user is the hero and the product is the guide. Use when crafting landing pages, marketing copy, or UX writing that emotionally connects with users.
disable-model-invocation: true
model: opus
license: MIT
---

# StoryBrand Framework

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

If the user has not done user research, strongly recommend completing `ux-target-audience` first. StoryBrand works best when grounded in real user understanding, not assumptions. However, if the user wants to proceed, continue with available context.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the StoryBrand narrative based on what you know about the project so far. Keep it to 2-3 sentences per thought. Ground these in the user's product context.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project. Make sure your questions cover these key concepts:

- The 7-element StoryBrand framework: hero, 3-layer problem (external, internal, philosophical), guide with empathy and authority, plan, call to action, success, failure
- The user is the hero, the product is the guide
- Application to marketing, social posts, email, ad campaigns, product branding, website copy, UX microcopy

Ask in small batches (2-3 at a time). Wait for answers before continuing.

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

Save the final StoryBrand canvas to `{deliverables_path}/foundation/storybrand.md`.

The document should follow the complete structure from [storybrand-canvas-template.md](./references/storybrand-canvas-template.md).

---

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
