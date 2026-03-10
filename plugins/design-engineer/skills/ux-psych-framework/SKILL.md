---
name: ux-psych-framework
description: "Applies the Psych Framework to evaluate Net Perceived Value across each step of a user experience. Tracks the user's \"Psych Level\" health bar of motivation vs. friction. Use when performing screen-level analysis of user experience quality."
disable-model-invocation: true
---

# ux-psych-framework Skill

**Purpose:** Guide the user through applying the Psych Framework to visualize and analyze what goes on in the customer's mind at each step of a user experience. Psych is a cognitive resource that every interaction either adds to or subtracts from, and tracking it reveals where the experience is motivating, where it creates friction, and where users are most likely to abandon.

**Classification:** Optional / Advanced. Adds significant analytical depth when applied to specific screens or interaction flows. Most useful after a 6P Story and/or Behavior Map have been created, but can be used standalone on any existing screen or flow.

**When to use:** Both for new products (predicting the Psych variations of a proposed design to identify weak points before building) and existing products (analyzing current screens to find friction points and motivation gaps).

**Reference files:**

- [psych-framework-guide.md](./references/psych-framework-guide.md) – Complete Psych Framework with NPV formula, Psych Levels, variation benchmarks, video game analogy, and analysis template

---

<critical_sequence name="psych-framework-analysis" enforce_order="strict">

## Workflow

<step number="1" required="true">
### Step 1: Understand the Context

Determine what experience the user wants to analyze and what prior work exists.

**Use AskUserQuestion** (with numbered-list fallback):

```
To apply the Psych Framework effectively, I need to understand your context:

1. What product screen or interaction flow are you analyzing?
2. Do you have a screenshot or description of the screen/flow? If yes, share it.
3. Have you completed a Behavior Map (BMap) for this experience? If yes, what were the key motivation and ability insights?
4. Do you have customer research data? Key insights about what motivates and frustrates your users?
5. What is the user's goal when they encounter this screen/flow? What are they trying to accomplish?
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. The Psych Framework requires understanding the customer's context and motivations to accurately assess Psych variations.

**After receiving answers**, read [psych-framework-guide.md](./references/psych-framework-guide.md) to internalize the full framework before guiding the user.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the Psych Framework Concept

Explain the framework naturally as part of the conversation:

**Psych as a Cognitive Resource**

Psych = merging the Motivation and Ability axes of the Behavior Map into a single dimension. Think of Psych as a precious cognitive resource that every user brings to an experience:

- Every user interaction will either **add** Psych (motivation, clarity, delight, progress) or **subtract** Psych (friction, confusion, effort, frustration)
- **Motivating users is just as important as reducing unnecessary friction** – this is the core insight

**The Video Game Analogy**

Think of your customer as the **hero of a video game**, and their Psych Level as their **health bar**:

- Your job is to help them achieve their quest (not just your business goals)
- To keep their Psych up, you need to motivate them AND minimize friction
- If their Psych Level drops too much, it is game over for them – and for you
- The quest is the customer's goal, not your conversion metric

**Net Perceived Value (NPV)**

According to behavioral economics, the human brain constantly (and sometimes subconsciously) perceives an action's "net value" as:

**NPV = Expected Utility - Expected Interaction Cost**

Or in Psych terms:

**NPV = Motivation - Friction**

Every element on a screen, every step in a flow, every word of copy contributes either to Motivation (positive Psych) or Friction (negative Psych). The user's brain is constantly running this calculation.

**Critical insight about friction:**

Friction = less ability. This means that customers have to use MORE Psych to take action. But friction is not always bad. It can have a net positive impact on the user's Psych Level if that "good friction" aligns with the user's motivations. Carefully adding valuable steps in a user experience can sometimes increase the overall conversion rate despite the slight extra time and effort required.
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
- Whether this moment ADDS Psych (motivation, clarity, reassurance) or SUBTRACTS Psych (confusion, friction, doubt)

Try to identify 4-8 key reaction points. You can describe them sequentially as the customer scans or interacts.
```

**Guidance for identifying reaction points:**

- Follow the natural scanning pattern (typically F-shaped for web pages)
- Look for: headlines, images, calls-to-action, form fields, pricing, social proof, error messages, loading states
- Each reaction point should represent a moment where the customer's Psych Level changes
- Not every element is a reaction point – focus on the ones that cause significant positive or negative shifts

**BLOCKING REQUIREMENT:** Wait for user input. If the user struggles, provide examples based on the Swimply case study from the reference file.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Assign Psych Variations

For each identified reaction point, guide the user to assign a Psych variation number.

**Explain the rating system:**

- **Positive numbers** (+1 to +5): Element adds Psych (motivates, clarifies, reassures, delights)
- **Negative numbers** (-1 to -5): Element subtracts Psych (confuses, creates friction, raises doubt, frustrates)
- **Magnitude guide:**
  - +/- 1: Minor effect (small clarity or minor friction)
  - +/- 2-3: Moderate effect (meaningful motivation boost or noticeable friction)
  - +/- 4-5: Major effect (strong emotional impact, significant barrier or breakthrough)

**Use AskUserQuestion:**

```
Now let's assign Psych variations to each reaction point. For each one, give it a number from -5 to +5:

Remember:
- Positive = adds motivation, clarity, reassurance, or delight
- Negative = adds friction, confusion, doubt, or frustration
- Don't obsess over exact numbers – focus on getting the DIRECTION and RELATIVE magnitude right

What Psych variation would you assign to each reaction point you identified?
```

**Important guidance to share with the user (Psych Numerical Precision):**

Focus on the insights, not the numbers. The goal of the Psych Framework is to put yourself in your customer's mind. Psych variations depend a lot on the Motivation and Ability of each user. Do not obsess over whether something is a -2 or a -3. What matters is: Is it positive or negative? Is it small or large relative to other reaction points?

Read [psych-framework-guide.md](./references/psych-framework-guide.md) for the Psych Variation Benchmarks to help calibrate ratings.
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Calculate Running Psych Level

Help the user track the cumulative Psych Level across the experience.

**Process:**

1. Start with a baseline Psych Level (this depends on the customer's context – are they excited, neutral, or already frustrated when they arrive?)
2. Add or subtract each Psych variation sequentially
3. Track the running total at each point

**Key analysis points:**

- **Psych Floor:** The lowest point in the experience. If this drops too low, users abandon.
- **Psych Recovery:** After a dip, does the experience recover the user's Psych? How quickly?
- **End State:** What is the final Psych Level? The Peak-End Rule says users remember based on the average of their peak moment and their end moment.
- **Danger Zone:** Any point where the running Psych Level approaches zero or goes negative is a critical risk for user abandonment.

**Present the analysis as a simple progression:**

```
Step 1: [Description] → Psych: +X → Running Level: X
Step 2: [Description] → Psych: -Y → Running Level: X-Y
Step 3: [Description] → Psych: +Z → Running Level: X-Y+Z
...
```
</step>

<step number="6" required="true" depends_on="5">
### Step 6: Identify Improvement Opportunities

Based on the Psych analysis, guide the user to identify concrete improvements.

**Three types of improvements to consider:**

1. **Reduce friction at the lowest Psych point** – The biggest dip is the most dangerous moment. What can be simplified, clarified, or removed?

2. **Add motivation BEFORE friction points** – If a friction-heavy step is unavoidable (e.g., a required form), add a motivating element BEFORE it to build up the user's Psych reserves. This could be social proof, a benefit reminder, a progress indicator, or a reassuring message.

3. **Amplify existing positive moments** – Where Psych is already rising, can it rise more? Small additions like micro-copy, delighters, or progress celebration can amplify natural positive moments.

**Use AskUserQuestion:**

```
Based on the Psych analysis, here are the key findings:

- Lowest Psych point: [description]
- Highest Psych point: [description]
- End state: [description]
- Critical risk areas: [if any]

Let's brainstorm improvements. For the biggest friction point, can you think of:

1. Something that could be REMOVED or SIMPLIFIED to reduce the Psych cost?
2. Something MOTIVATING that could be added BEFORE this step to build up reserves?
3. A way to make the user feel more CONFIDENT or REASSURED at this moment?
```
</step>

<step number="7" required="true" depends_on="6">
### Step 7: Produce the Psych Analysis Document

Compile the complete analysis.

**Output format:**

```markdown
# Psych Framework Analysis: [Screen/Flow Name]

## Customer Context
- Goal: [What the user is trying to accomplish]
- Arrival state: [How they arrive – motivated, neutral, frustrated]
- Key motivations: [From BMap or research]
- Key ability constraints: [From BMap or research]

## Psych Variation Analysis

| Step | Customer's Thought | Psych Variation | Running Level |
|------|-------------------|-----------------|---------------|
| 1. [Element] | "[Inner monologue]" | +/- X | Y |
| 2. [Element] | "[Inner monologue]" | +/- X | Y |
| ... | ... | ... | ... |

## Key Findings
- **Peak moment:** [Highest Psych point and why]
- **Pit moment:** [Lowest Psych point and why]
- **End state:** [Final Psych Level and implication]
- **Critical risks:** [Points where users are most likely to abandon]

## Improvement Recommendations
1. [Highest priority improvement]
2. [Second priority]
3. [Third priority]

## Psych Level Progression
[Starting Level] → [Key changes] → [End Level]
```

**Final output:** Present the completed Psych Analysis and ask the user to review.
</step>

</critical_sequence>

---

## Specific Empathy Questions (SEQs)

When applying the Psych Framework to a screen, one question often arises: "How do you really know what goes on in your customer's mind?"

The answer is Specific Empathy Questions (SEQs). Unlike the General Empathy Questions (GEQs) used in Behavior Mapping, SEQs are targeted at specific screens or interactions:

- "What did you think when you first saw this screen?"
- "What were you looking for when you landed here?"
- "Was there anything confusing or unexpected?"
- "At what point did you feel most confident? Most uncertain?"

If the user has access to customer research with SEQ-type data, it dramatically improves the accuracy of Psych variation assignments.

---

## Decision Hierarchy

1. **User's customer research and SEQ data** – Real user reactions always win
2. **BMap insights** – Motivation and ability analysis from Behavior Mapping
3. **Framework benchmarks** – Reference Psych Variation Benchmarks from the guide
4. **AI estimates** – Only when no other data exists; clearly labeled as estimates

Never present AI-estimated Psych variations as facts. If the user has no customer data, all variations are estimates to be validated.

---

## Integration Notes

- **Receives from:** ux-behavior-mapping (Motivation and Ability analysis provides the foundation for Psych assessment), ux-6p-stories (improvement opportunities from the story become analysis targets)
- **Feeds into:** Journey mapping activities (Psych variations at the screen level feed into journey-level Psych analysis), B.I.A.S. framework (friction points identified here become candidates for B.I.A.S. improvements)
- **Standalone use:** Fully usable independently on any screen or interaction flow
