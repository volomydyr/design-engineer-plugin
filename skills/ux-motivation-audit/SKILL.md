---
name: ux-motivation-audit
description: "Applies the Motivation Framework to evaluate Experience Value across each step of a user experience. Tracks the user's \"Motivation Level\" health bar of motivation vs. friction. Use when performing screen-level analysis of user experience quality."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# ux-motivation-audit Skill

**Purpose:** Guide the user through applying the Motivation Framework to visualize and analyze what goes on in the customer's mind at each step of a user experience. Motivation is a cognitive resource that every interaction either adds to or subtracts from, and tracking it reveals where the experience is motivating, where it creates friction, and where users are most likely to abandon.

**Classification:** Optional / Advanced. Adds significant analytical depth when applied to specific screens or interaction flows. Most useful after a Story Panel and/or Behavior Map have been created, but can be used standalone on any existing screen or flow.

**When to use:** Both for new products (predicting the Motivation variations of a proposed design to identify weak points before building) and existing products (analyzing current screens to find friction points and motivation gaps).

**Reference files:**

- [motivation-framework-guide.md](./references/motivation-framework-guide.md) – Complete Motivation Framework with Experience Value formula, Motivation Levels, variation benchmarks, video game analogy, and analysis template

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand the context of the screen or flow you want to analyze, 2) teach the Motivation Framework concept, 3) identify key reaction points, 4) assign Motivation variations to each point, 5) calculate the running Motivation Level, 6) identify improvement opportunities, 7) produce the Motivation Analysis document." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with the Motivation Framework and Experience Value. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product. Use the "Purpose" section above as a starting point, but make it conversational and product-specific.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

<critical_sequence name="motivation-framework-analysis" enforce_order="strict">

## Workflow

<step number="1" required="true">
### Step 1: Understand the Context

Determine what experience the user wants to analyze and what prior work exists.

**Use AskUserQuestion** (with numbered-list fallback):

```
To apply the Motivation Framework effectively, I need to understand your context:

1. What product screen or interaction flow are you analyzing?
2. Do you have a screenshot or description of the screen/flow? If yes, share it.
3. Have you completed a Behavior Map for this experience? If yes, what were the key motivation and ability insights?
4. Do you have customer research data? Key insights about what motivates and frustrates your users?
5. What is the user's goal when they encounter this screen/flow? What are they trying to accomplish?
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. The Motivation Framework requires understanding the customer's context and motivations to accurately assess Motivation variations.

**After receiving answers**, read [motivation-framework-guide.md](./references/motivation-framework-guide.md) to internalize the full framework before guiding the user.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the Motivation Framework Concept

Explain the framework naturally as part of the conversation:

**Motivation as a Cognitive Resource**

Motivation = merging the Motivation and Ability axes of the Behavior Map into a single dimension. Think of Motivation as a precious cognitive resource that every user brings to an experience:

- Every user interaction will either **add** Motivation (motivation, clarity, delight, progress) or **subtract** Motivation (friction, confusion, effort, frustration)
- **Motivating users is just as important as reducing unnecessary friction** – this is the core insight

**The Video Game Analogy**

Think of your customer as the **hero of a video game**, and their Motivation Level as their **health bar**:

- Your job is to help them achieve their quest (not just your business goals)
- To keep their Motivation up, you need to motivate them AND minimize friction
- If their Motivation Level drops too much, it is game over for them – and for you
- The quest is the customer's goal, not your conversion metric

**Experience Value**

According to behavioral economics, the human brain constantly (and sometimes subconsciously) perceives an action's "net value" as:

**Experience Value = Expected Utility - Expected Interaction Cost**

Or in Motivation terms:

**Experience Value = Motivation - Friction**

Every element on a screen, every step in a flow, every word of copy contributes either to Motivation (positive Motivation) or Friction (negative Motivation). The user's brain is constantly running this calculation.

**Critical insight about friction:**

Friction = less ability. This means that customers have to use MORE Motivation to take action. But friction is not always bad. It can have a net positive impact on the user's Motivation Level if that "good friction" aligns with the user's motivations. Carefully adding valuable steps in a user experience can sometimes increase the overall conversion rate despite the slight extra time and effort required.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Identify Key Reaction Points

Guide the user through marking the key moments where the customer has a psychological reaction while scanning or interacting with the screen/flow.

**Use AskUserQuestion:**

```
Let's identify the key reaction points in your screen/flow. As the customer scans or interacts with it, what are the moments where they have a psychological reaction?

For each moment, describe:
- What the customer sees or encounters
- What they are likely THINKING at that moment (their inner monologue)
- Whether this moment ADDS Motivation (motivation, clarity, reassurance) or SUBTRACTS Motivation (confusion, friction, doubt)

Try to identify 4-8 key reaction points. You can describe them sequentially as the customer scans or interacts.
```

**Guidance for identifying reaction points:**

- Follow the natural scanning pattern (typically F-shaped for web pages)
- Look for: headlines, images, calls-to-action, form fields, pricing, social proof, error messages, loading states
- Each reaction point should represent a moment where the customer's Motivation Level changes
- Not every element is a reaction point – focus on the ones that cause significant positive or negative shifts

**BLOCKING REQUIREMENT:** Wait for user input. If the user struggles, provide examples based on the Swimply case study from the reference file.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Assign Motivation Variations

For each identified reaction point, guide the user to assign a Motivation variation number.

**Explain the rating system:**

- **Positive numbers** (+1 to +5): Element adds Motivation (motivates, clarifies, reassures, delights)
- **Negative numbers** (-1 to -5): Element subtracts Motivation (confuses, creates friction, raises doubt, frustrates)
- **Magnitude guide:**
  - +/- 1: Minor effect (small clarity or minor friction)
  - +/- 2-3: Moderate effect (meaningful motivation boost or noticeable friction)
  - +/- 4-5: Major effect (strong emotional impact, significant barrier or breakthrough)

**Use AskUserQuestion:**

```
Now let's assign Motivation variations to each reaction point. For each one, give it a number from -5 to +5:

Remember:
- Positive = adds motivation, clarity, reassurance, or delight
- Negative = adds friction, confusion, doubt, or frustration
- Don't obsess over exact numbers – focus on getting the DIRECTION and RELATIVE magnitude right

What Motivation variation would you assign to each reaction point you identified?
```

**Important guidance to share with the user (Motivation Numerical Precision):**

Focus on the insights, not the numbers. The goal of the Motivation Framework is to put yourself in your customer's mind. Motivation variations depend a lot on the Motivation and Ability of each user. Do not obsess over whether something is a -2 or a -3. What matters is: Is it positive or negative? Is it small or large relative to other reaction points?

Read [motivation-framework-guide.md](./references/motivation-framework-guide.md) for the Motivation Variation Benchmarks to help calibrate ratings.
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Calculate Running Motivation Level

Help the user track the cumulative Motivation Level across the experience.

**Process:**

1. Start with a baseline Motivation Level (this depends on the customer's context – are they excited, neutral, or already frustrated when they arrive?)
2. Add or subtract each Motivation variation sequentially
3. Track the running total at each point

**Key analysis points:**

- **Motivation Floor:** The lowest point in the experience. If this drops too low, users abandon.
- **Motivation Recovery:** After a dip, does the experience recover the user's Motivation? How quickly?
- **End State:** What is the final Motivation Level? The Peak-End Rule says users remember based on the average of their peak moment and their end moment.
- **Danger Zone:** Any point where the running Motivation Level approaches zero or goes negative is a critical risk for user abandonment.

**Present the analysis as a simple progression:**

```
Step 1: [Description] → Motivation: +X → Running Level: X
Step 2: [Description] → Motivation: -Y → Running Level: X-Y
Step 3: [Description] → Motivation: +Z → Running Level: X-Y+Z
...
```
</step>

<step number="6" required="true" depends_on="5">
### Step 6: Identify Improvement Opportunities

Based on the Motivation analysis, guide the user to identify concrete improvements.

**Three types of improvements to consider:**

1. **Reduce friction at the lowest Motivation point** – The biggest dip is the most dangerous moment. What can be simplified, clarified, or removed?

2. **Add motivation BEFORE friction points** – If a friction-heavy step is unavoidable (e.g., a required form), add a motivating element BEFORE it to build up the user's Motivation reserves. This could be social proof, a benefit reminder, a progress indicator, or a reassuring message.

3. **Amplify existing positive moments** – Where Motivation is already rising, can it rise more? Small additions like micro-copy, delighters, or progress celebration can amplify natural positive moments.

**Use AskUserQuestion:**

```
Based on the Motivation analysis, here are the key findings:

- Lowest Motivation point: [description]
- Highest Motivation point: [description]
- End state: [description]
- Critical risk areas: [if any]

Let's brainstorm improvements. For the biggest friction point, can you think of:

1. Something that could be REMOVED or SIMPLIFIED to reduce the Motivation cost?
2. Something MOTIVATING that could be added BEFORE this step to build up reserves?
3. A way to make the user feel more CONFIDENT or REASSURED at this moment?
```
</step>

<step number="7" required="true" depends_on="6">
### Step 7: Produce the Motivation Analysis Document

Compile the complete analysis.

**Output format:**

```markdown
# Motivation Framework Analysis: [Screen/Flow Name]

## Customer Context
- Goal: [What the user is trying to accomplish]
- Arrival state: [How they arrive – motivated, neutral, frustrated]
- Key motivations: [From Behavior Map or research]
- Key ability constraints: [From Behavior Map or research]

## Motivation Variation Analysis

| Step | Customer's Thought | Motivation Variation | Running Level |
|------|-------------------|-----------------|---------------|
| 1. [Element] | "[Inner monologue]" | +/- X | Y |
| 2. [Element] | "[Inner monologue]" | +/- X | Y |
| ... | ... | ... | ... |

## Key Findings
- **Peak moment:** [Highest Motivation point and why]
- **Pit moment:** [Lowest Motivation point and why]
- **End state:** [Final Motivation Level and implication]
- **Critical risks:** [Points where users are most likely to abandon]

## Improvement Recommendations
1. [Highest priority improvement]
2. [Second priority]
3. [Third priority]

## Motivation Level Progression
[Starting Level] → [Key changes] → [End Level]
```

**Final output:** Present the completed Motivation Analysis and ask the user to review.
</step>

</critical_sequence>

---

## Specific Empathy Questions (SEQs)

When applying the Motivation Framework to a screen, one question often arises: "How do you really know what goes on in your customer's mind?"

The answer is Specific Empathy Questions (SEQs). Unlike the general empathy questions used in Behavior Mapping, SEQs are targeted at specific screens or interactions:

- "What did you think when you first saw this screen?"
- "What were you looking for when you landed here?"
- "Was there anything confusing or unexpected?"
- "At what point did you feel most confident? Most uncertain?"

If the user has access to customer research with SEQ-type data, it dramatically improves the accuracy of Motivation variation assignments.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing reaction point, an unaddressed friction area, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's customer research and SEQ data** – Real user reactions always win
2. **Behavior Mapping insights** – Motivation and ability analysis from Behavior Mapping
3. **Framework benchmarks** – Reference Motivation Variation Benchmarks from the guide
4. **AI estimates** – Only when no other data exists; clearly labeled as estimates

Never present AI-estimated Motivation variations as facts. If the user has no customer data, all variations are estimates to be validated.

---

## Integration Notes

- **Receives from:** ux-behavior-mapping (Motivation and Ability analysis provides the foundation for Motivation assessment), ux-story-panels (improvement opportunities from the story become analysis targets)
- **Feeds into:** Journey mapping activities (Motivation variations at the screen level feed into journey-level Motivation analysis), bias audit process (friction points identified here become candidates for bias audit improvements)
- **Standalone use:** Fully usable independently on any screen or interaction flow


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` — "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
