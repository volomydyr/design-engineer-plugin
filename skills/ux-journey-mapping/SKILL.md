---
name: ux-journey-mapping
description: Creates and improves customer journey maps by identifying key moments and applying proven improvement tactics. Use when designing a new product experience, reviewing an existing one, or optimizing the user's emotional arc.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Journey Mapping

## Why This Matters

A good customer journey map will help you:

1. Distill customer experiences to their top 5-8 moments.
2. Support and complement Story Panels (see `ux-story-panels`).
3. Systemize the Motivation Lead and lessons of your experience (see `ux-motivation-audit`).

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

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) determine the scope and starting point, 2) understand the context of your product and user, 3) identify the 5–8 key moments in the journey, 4) compose the journey map, 5) review improvement tactics, 6) generate improvement ideas, 7) apply the 'In Real Life' test, 8) produce the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with journey mapping and why distilling experiences to 5–8 key moments matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present the journey map step by step – each moment individually, discuss, then next. Do not dump the entire journey map table at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

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

```
multiSelect: false  # User must choose one mode
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

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

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding to Step 3.

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

```
multiSelect: false  # User must choose one option
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

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

```
multiSelect: false  # User must choose one focus area
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

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

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/exploration` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final journey map and improvement plan to `.design-engineer-plugin/design/exploration/customer-journey-map.md`.

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

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing moment, an unaddressed transition, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

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


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
