---
name: ux-journey-mapping
description: Creates and improves customer journey maps by identifying key moments and applying proven improvement tactics. Use when designing a new product experience, reviewing an existing one, or optimizing the user's emotional arc.
disable-model-invocation: true
model: opus
---

# Journey Mapping

## Why This Matters

A good customer journey map will help you:

1. Distill customer experiences to their top 5-8 moments.
2. Support and complement Story Panels (see `ux-story-panels`).
3. Systemize the Motivation Lead and lessons of your experience (see `ux-motivation-levels`).

Unfortunately, many people believe they need incredibly detailed customer journey maps. But a customer journey map that is too exhaustive is:

- Complicated to build
- Difficult to share between colleagues
- Hard to use constantly during product initiatives

You should instead boil down your experiences to their top 5-8 moments. Your resulting customer journey map will contain 5 types of elements that represent the emotional highs, lows, and transitions of the user's experience. Just like with Story Panels, this structure allows your brain to remember and use this journey map more easily, so you can make significant improvements to your experience.

## Reference Files

- [journey-elements.md](./references/journey-elements.md) – 5 element types with definitions and examples
- [journey-improvement-tactics.md](./references/journey-improvement-tactics.md) – 4 improvement tactics with checklist
- [journey-case-study.md](./references/journey-case-study.md) – Brave Browser onboarding case study

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine Scope and Starting Point

Ask:

```
question: "What would you like to work on?"
header: "Journey Mapping Mode"
options:
  - label: "Map a new customer journey"
    description: "Create a journey map for a product or feature from scratch"
  - label: "Improve an existing journey"
    description: "I already have a journey map or experience to optimize"
  - label: "Both – map first, then improve"
    description: "Walk me through the full process end to end"
```

If the user selects option 1 or 3, proceed to Step 2.
If the user selects option 2, skip to Step 5.

---

## Step 2: Understand the Context

Before mapping, gather context about the product and user experience. Ask:

1. **What product or feature are we mapping?** Get a clear description of the scope.
2. **Who is the user?** If the user has already completed `ux-target-audience` or `ux-story-panels`, reference those deliverables. Otherwise, ask for a brief description of the target user.
3. **What is the starting trigger?** What brings the user to this experience? (e.g., an ad, a search result, a recommendation, a need)
4. **What is the desired end state?** What does success look like for both the user and the business?

If the user has existing notes, documents, or a Story Panel, ask them to share that content before proceeding.

---

## Step 3: Identify the 5-8 Key Moments

Guide the user through identifying the most important moments in their customer journey. Refer to [journey-elements.md](./references/journey-elements.md) for the full definitions.

Explain the 5 element types briefly:

| Symbol | Element | Description |
|--------|---------|-------------|
| Peak | Highest delight mark in your experience |
| Pit | Lowest delight point in your experience |
| Jump/Rise | Motivation increase in your experience |
| Drop | Motivation decrease in your experience |
| Transition | Natural boundary between one part and another |

Walk through the experience chronologically and ask the user to identify each key moment:

```
question: "Let's map the key moments. Starting from the trigger, what is the first significant moment in the experience?"
header: "Moment 1"
```

For each moment, determine:
- What happens at this point?
- How does the user feel? (delight level: high, medium, low, negative)
- Which element type does this represent? (Peak, Pit, Jump, Drop, or Transition)
- Why does this moment matter?

Continue until you have 5-8 moments mapped. If the user is struggling, use these techniques:

- **Think of it as a real-life experience.** If your product were a real person interaction, what would the key moments be?
- **Break down broad steps.** If a moment feels too big, split it into smaller sub-journeys.
- **Focus on emotional shifts.** Where does the user's feeling change significantly?

Important: Remember that a Transition is a moment marking the start or end of a journey. It signals the "stops in a day" – from the previous screen for a moment. In history, you could say that every step you do while walking is a Transition: from a place to another. But real Milestones in a day are things like "leaving your house", "arriving at the airport", "bumping into a random friend for lunch", etc.

Focus on the most crucial Transitions from the perspective of the customer's motivations. Avoid getting lost in the micro-steps of your screens.

---

## Step 4: Compose the Journey Map

Arrange the identified moments into a visual journey structure:

1. List moments in chronological order (left to right)
2. Assign a relative delight level to each moment (vertical axis)
3. Connect them to show the emotional arc
4. Label each with its element type

Present the journey map as a structured table:

| # | Moment | Element Type | Delight Level | Description |
|---|--------|-------------|---------------|-------------|
| 1 | ... | ... | ... | ... |

After presenting, ask:

```
question: "Does this journey map capture the key moments accurately? What would you change?"
header: "Journey Map Review"
options:
  - label: "Looks good – let's continue"
    description: "The map captures the experience well"
  - label: "I want to adjust some moments"
    description: "Some elements need corrections"
  - label: "I want to add more moments"
    description: "There are important moments missing"
```

Iterate until the user approves the map.

If the user chose "Map a new journey" only (option 1 in Step 1), skip to Step 8.

---

## Step 5: Review Improvement Tactics

Now that the journey is mapped, apply the 4 improvement tactics from [journey-improvement-tactics.md](./references/journey-improvement-tactics.md):

Briefly explain each tactic to the user:

1. **Mark the Transition** – Identify the most critical Transition and make it feel intentional, acknowledged, and smooth.
2. **Elevate the Peak** – Find ways to make the highest moment even more memorable and delightful.
3. **Fill the Biggest Pit** – Address the lowest moment to reduce friction, frustration, or confusion.
4. **Reorder Important Steps** – Rearrange steps strategically to leverage Hyperbolic Discounting and the Peak-End Rule.

Before diving into specific improvements, share the key psychology behind these tactics:

### Peak-End Rule
People do not evaluate an experience based on the average or a sum of all the micro-experiences. Specifically, your brain heavily weights the Peaks, the Pits, and the Transitions. You do not need to fix everything – focus on these high-impact moments.

### Hyperbolic Discounting
People prefer smaller, immediate rewards rather than larger, future ones. That is why it is often better for your product to deliver a smaller reward now (e.g., a preview of something important) instead of leaving your customers waiting.

### The ROI of Delight
Studies have shown that delighting your "good" customers (i.e., those who are already engaged) drives approximately 9 times more revenue than focusing on satisfying your "average" customers. Delight is not decoration – it has a significant return on investment.

---

## Step 6: Generate Improvement Ideas

For each tactic, generate specific improvement ideas for the user's journey. Refer to the full checklist in [journey-improvement-tactics.md](./references/journey-improvement-tactics.md).

Ask:

```
question: "Which improvement area should we focus on first?"
header: "Improvement Focus"
options:
  - label: "Mark the Transition"
    description: "Make key transition moments intentional and smooth"
  - label: "Elevate the Peak"
    description: "Make the best moment even better"
  - label: "Fill the Biggest Pit"
    description: "Address the worst moment in the experience"
  - label: "Reorder Important Steps"
    description: "Rearrange the sequence for better psychology"
  - label: "All of them"
    description: "Walk me through each one systematically"
```

For each selected tactic, use the detailed questions from the reference file. Generate 3-5 concrete, specific ideas per tactic. Present them as actionable suggestions, not abstract concepts.

After generating ideas, ask the user to:

1. Write down their top 3 ideas
2. Explore 1 idea in detail: pick the one that will feel the most natural to "test" (by doing wireframes, mockups, etc.). Choose the degree of fidelity appropriate for the project.

---

## Step 7: The "In Real Life" Test

Before finalizing any improvement, apply the "In Real Life" test:

> With a bit of imagination, try to transform your screens and interactions into real people. What would they look like? What would they say? How would they act? Is it a person you would want to know and hang out with?

Remember: just like in real life, people prefer to nurture a positive relationship with technology. This is one powerful way to evaluate your improvements.

Ask:

```
question: "If this experience were a real person interaction, would it feel natural, friendly, and respectful?"
header: "In Real Life Test"
```

---

## Step 8: Produce the Deliverable

Save the final journey map and improvement plan to `{deliverables_path}/journeys/customer-journey-map.md`.

The document should include:

1. **Journey Overview** – Product/feature name, target user, trigger, and desired end state
2. **Journey Map** – The 5-8 key moments table with element types and delight levels
3. **Visual Arc Description** – A text description of the emotional flow
4. **Improvement Opportunities** (if applicable) – Top 3 ideas with specific implementation notes
5. **"In Real Life" Assessment** – How the experience would feel as a real interaction
6. **Next Steps** – Recommended actions and which skill to run next

---

## Comparing Journeys: Existing vs Ideal

The Story Panel you described in `ux-story-panels` was probably an "ideal" scenario. Once done, it is always a good idea to compare with reality. If you have an existing product, map the current journey alongside the ideal one to identify the biggest gaps.

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything – their experience, their product, their call
2. **Existing documentation** (Story Panels, research, prior journey maps) informs suggestions
3. **AI suggestions** fill gaps only when user and docs provide no guidance – and are always presented as suggestions, not decisions

---

## What Comes Next

After the journey map is complete, suggest:

1. `ux-bias-audit` – Apply the bias audit process to audit specific moments
2. `ux-ethics-review` – Ensure improvements are ethical and humane (optional but recommended)
3. `ux-communicating-decisions` – Prepare to present journey findings to stakeholders
