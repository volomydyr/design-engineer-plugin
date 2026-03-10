---
name: ux-big-idea
description: Guides defining and refining a product idea into a structured Big Idea document. Use when starting a new product or when an existing idea needs evaluation for viability, risks, and clarity before design work.
disable-model-invocation: true
---

# Big Idea

## Why This Matters

Every product starts with a spark. But before you rush into wireframes or mockups, you need something simple to guide you -- a Big Idea document. It does two things really well:

1. Checks whether your idea solves a real problem for a real person.
2. Highlights risks before you spend time and money.

It does not need to be perfect or polished; it just needs to make sense to you and your future users. The human brain craves clarity. Starting is always hard, especially when you do not fully understand what lies ahead. A Big Idea document helps you simulate that stability and increases your desire to move forward.

Another obstacle is that beginner founders tend to believe their ideas are brilliant, while reality often proves the opposite. This document helps you examine your idea in detail, assess its potential, and identify possible risks before investing significant time and resources.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand the User's Starting Point

Before doing anything, determine what the user already has. Ask:

```
question: "Where are you with your product idea right now?"
header: "Idea Status"
options:
  - label: "I have a rough idea"
    description: "Something came to mind but I have not written anything down yet"
  - label: "I have some notes"
    description: "I have written down some thoughts but nothing structured"
  - label: "I have a partial Big Idea document"
    description: "Some sections are drafted but it is incomplete"
  - label: "I want to revisit an existing Big Idea"
    description: "I have a document but it needs to evolve based on new learnings"
```

If the user has existing notes or documents, ask them to share the content before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, briefly share how the idea could be approached from multiple angles. Cover 3-4 perspectives in 2-3 sentences each:

- **User perspective**: Who might benefit from this and what pain they might experience today
- **Market perspective**: What the competitive landscape might look like and where gaps could exist
- **Feasibility perspective**: What it might take to build this and what the biggest unknowns are
- **Business perspective**: How this could potentially sustain itself financially

Keep this brief and honest. Do not oversell. The goal is to give the user starting points for their own thinking, not to validate or invalidate the idea prematurely.

---

## Step 3: Ask Strategic Questions

Ask 7-10 questions to deeply understand the idea. Adapt based on the user's answers from Step 1. Use these as a starting framework, but adjust or add questions based on what the user has already shared:

1. **The spark**: What inspired this idea? Was it a personal frustration, something you observed, or a gap you noticed?
2. **The problem**: What specific problem does this solve? Who currently suffers from it?
3. **Current alternatives**: How do people solve this problem today? What tools or workarounds do they use?
4. **Why now**: What has changed (technology, behavior, market) that makes this idea viable now?
5. **Unique angle**: What would your product do differently from everything that already exists?
6. **Target user**: If you had to describe one specific person who needs this the most, who would they be?
7. **Success signal**: How would you know this idea is working? What would early success look like?
8. **Biggest risk**: What is the one thing that could kill this idea entirely?
9. **Scope reality**: What is the smallest version of this that would still deliver value?
10. **Personal commitment**: Why are you the right person to build this? What keeps you motivated?

Ask questions one at a time or in small batches (2-3). Wait for answers before continuing. Do not move forward until you have enough context to form a meaningful picture of the idea.

---

## Step 4: Iterate on the Big Idea Structure

Based on the user's answers, draft the Big Idea document structure. The full document will contain these sections (each handled by its own dedicated skill later):

- **Problem Statement**: What real issue exists out there, and why current solutions do not cut it
- **User Persona**: Who struggles the most with this problem, and what their day-to-day looks like
- **Assumptions and Hypotheses**: Your best guesses, phrased so they can be tested later
- **Competitive Analysis**: How others are approaching it (direct and indirect competitors)
- **Business Plan**: The basic mechanics of how this thing could make money
- **StoryBrand Framework**: The narrative that makes the user the hero, not the product
- **Service UX Map**: A mix of CJM and Blueprint to see both user and system sides of the journey
- **Information Architecture**: The first sketch of how everything fits together
- **MVP Requirements**: The smallest version that actually delivers value
- **Parking Lot**: A backlog for ideas that sound cool but do not belong in the first release

Present a brief summary for each section based on what you have learned so far. Mark sections where you have enough context with a draft summary, and mark sections where more information is needed.

Ask the user to review and provide feedback.

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate the user's corrections and additions
2. Flag any contradictions or gaps you notice
3. Share your perspective honestly -- if something seems risky or unclear, say so
4. Ask follow-up questions where needed

Repeat this cycle until the user explicitly approves the Big Idea overview.

---

## Step 6: Produce the Deliverable

Save the final Big Idea overview document to `{deliverables_path}/foundation/big-idea.md`.

The document should include:

- A one-paragraph executive summary of the idea
- Brief summaries for each of the 10 sections listed above
- A "Key Risks" section highlighting the top 3-5 risks identified
- A "Next Steps" section recommending which detailed skill to run first (typically `ux-problem-statement`)

---

## Two Important Reminders

Include these at the top of the deliverable:

1. **This is an iterative process.** Do not expect version 1 to be "the final one." A good Big Idea document evolves many times, especially after research and testing. That is a good sign -- it means you are learning and adapting the product to reality.

2. **Be ready to pivot.** It is completely normal to eventually realize that your idea does not work -- it does not solve a real problem or would cost more than it could ever generate. It is better to reach this conclusion early and change direction than to discover it a year in. The goal is not to prove that your idea is perfect, but to deeply understand its potential and the challenges that lie ahead.

---

## Idea Evaluation Criteria

When evaluating the idea's strength, reference the criteria in [idea-validation-criteria.md](./references/idea-validation-criteria.md). Use these criteria to give the user honest feedback about their idea's current strengths and weaknesses.

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything -- their vision, their product, their call
2. **Existing documentation** (if the user has notes, research, or prior work) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance -- and are always presented as suggestions, not decisions

---

## What Comes Next

After the Big Idea overview is complete, suggest running the individual skills in this order:

1. `ux-problem-statement` -- Define the core problem in detail
2. `ux-target-audience` -- Build detailed user personas
3. `ux-assumptions` -- Document and categorize assumptions
4. `ux-competitor-analysis` -- Research the competitive landscape
5. Continue through the remaining Big Idea sections as needed

---

## Resource Files

- [idea-validation-criteria.md](./references/idea-validation-criteria.md) -- Criteria for evaluating idea strength, common pitfalls, and red flags to watch for
