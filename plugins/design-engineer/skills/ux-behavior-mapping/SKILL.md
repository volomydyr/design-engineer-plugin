---
name: ux-behavior-mapping
description: "Maps user behavior using the BMap framework (Behavior = Motivation x Ability x Prompt). Analyzes activation thresholds, mental models, and prompt validation. Use when user motivation is unclear or for complex products needing behavioral analysis."
disable-model-invocation: true
---

# ux-behavior-mapping Skill

**Purpose:** Guide the user through creating a Behavior Map (BMap) that visualizes the forces influencing user behavior for a specific product experience. The BMap helps articulate WHY users do or do not take a desired action, and identifies the most efficient levers to change that behavior.

**Classification:** Optional / Advanced. Most useful for complex products where user motivation is unclear, when a desired behavior is not happening, or when a team cannot agree on why users are not converting. Core proven activities are 6P Stories and B.I.A.S., but Behavior Mapping adds significant depth when applied.

**When to use:** Both for new products (mapping expected user behaviors to validate assumptions) and existing products (diagnosing why a desired behavior is not happening and finding the most efficient levers to change it).

**Reference files:**

- [bmap-framework.md](./references/bmap-framework.md) -- Complete BMap formula, Activation Threshold, 10 behavior levers, 3 key questions, GEQs, and the "Replacing X" technique
- [mental-model-guide.md](./references/mental-model-guide.md) -- How to build, use, and validate mental models for product design

---

<critical_sequence name="behavior-mapping" enforce_order="strict">

## Workflow

<step number="1" required="true">
### Step 1: Understand the Context

Determine what the user is working on and whether they have prior deliverables.

**Use AskUserQuestion** (with numbered-list fallback):

```
To create a meaningful Behavior Map, I need to understand your context:

1. What product or feature are you mapping behavior for?
2. What is the DESIRED user behavior you want to understand or improve? (e.g., "complete onboarding", "upgrade to paid plan", "invite teammates")
3. Have you already created a 6P Story for this experience? If yes, what was the key moment / biggest gap you identified?
4. Do you have any customer research data (survey responses, interview notes, analytics)? If yes, share the key insights.
5. Is this a NEW product (you are predicting behavior) or an EXISTING product (the desired behavior is not happening enough)?
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. Do not assume customer motivations or abilities.

**After receiving answers**, read [bmap-framework.md](./references/bmap-framework.md) to internalize the full framework.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the BMap Formula

Explain the core concept naturally as part of the conversation:

**The BMap Formula: Behavior = Motivation x Ability x Prompt**

A user behavior happens only when three elements converge at the same moment:

1. **Motivation** -- The willpower to act. The behavior must be aligned with the user's hopes, pains, and existing desires. You cannot impose motivation that does not exist.
2. **Ability** -- The capacity to act. The user must have the time, money, physical capacity, mental capacity, and familiarity needed to perform the behavior.
3. **Prompt** -- The timely cue to act. Without a prompt, there is no action -- even when motivation and ability are both high. The prompt must arrive at the right moment.

**The Activation Threshold:** On the BMap, there is a dashed line representing the minimum combined Motivation and Ability needed for a behavior to occur. If the user falls BELOW this threshold, the behavior does not happen regardless of the prompt.

**Critical ethical insight:** Never try to impose a behavior on a user. Instead: (1) align your product with what users already want to accomplish, (2) highlight how it will help them achieve their goal (Motivation), and only then (3) make it as easy as possible to take action (Ability) with a clear and timely cue (Prompt).

The BMap is a mental model -- a simplified representation to help you understand opposing forces influencing user behavior. It is not about placing a prompt as precisely as possible on a chart.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Customer Research with General Empathy Questions (GEQs)

Before mapping behavior, ensure the user has customer insights. Guide them through the General Empathy Questions if they do not have data.

**The 3 General Empathy Questions:**

**Q1. Hope:**
"If you had a magic wand and could instantly X, how would that change your life?"

**Q2. Pain:**
"What's your #1 challenge when it comes to X? And why is it so challenging?"

**Q3. Barrier:**
"Tell me about the last time you did X, how did that go? What was preventing you from Y?"

Teach the **"Replacing X" technique** (see [bmap-framework.md](./references/bmap-framework.md) for full details):
- Replace X with the benefit/action of the industry you are in
- Replace Y with a Hope (Motivation) related to the core context X, ideally using the customer's own words from Q1

**Pro tip for better research:** Add this byline at the end of survey questions: "[...] Be super specific to help us understand. Tell us a story if possible to give us some context." This simple addition increases the length of responses by up to 300%, which means more opportunities for valuable insights.

**Use AskUserQuestion:**

```
Do you have answers to these 3 empathy questions from real customers?

1. Yes -- I have customer research data I can share
2. No, but I can collect it -- give me the questions formatted for my situation
3. No, and I cannot access customers -- let's work with assumptions (will be clearly marked as hypotheses)
```

**BLOCKING REQUIREMENT:** Wait for user response. If they choose option 2, format the GEQs with their specific product context (replacing X and Y). If they choose option 3, proceed but label all motivation/ability assessments as hypotheses.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Analyze the 10 Behavior Levers

Walk the user through assessing each of the 10 behavior levers for their specific situation. Read [bmap-framework.md](./references/bmap-framework.md) for full descriptions of each lever.

**Motivation Levers (3):**

| Lever | Question to Assess |
|---|---|
| Anticipation | Is the user seeking hope or avoiding fear related to this behavior? |
| Sensation | Is the user seeking pleasure or avoiding pain? |
| Belonging | Is the user seeking acceptance or avoiding rejection? |

**Ability Levers (5):**

| Lever | Question to Assess |
|---|---|
| Time | How long does it take to complete the behavior? |
| Money | How costly is it? |
| Physical Capacity | How physically demanding is it? |
| Mental Capacity | How complicated is it? |
| Practice | How familiar is it? Has the user done something similar before? |

**Prompt Levers (2):**

| Type | Description |
|---|---|
| Explicit Prompt | The information on what to do next is within the prompt itself (email, notification, button, timer, billboard) |
| Implicit Prompt | The user is cued to take action through an association in memory (places, people, situations, emotions) |

**Important:** The customer's ability is a function of the SCARCEST of the five ability levers at that moment. One very low ability lever can kill the behavior even if the other four are high.

**Use AskUserQuestion** to walk through each category:

```
Let's assess your user's behavior levers. For the desired behavior you described, rate each on a scale of Low / Medium / High:

MOTIVATION:
1. Anticipation (hope/fear) -- How strongly does this behavior connect to something the user hopes for or fears?
2. Sensation (pleasure/pain) -- Does this behavior involve seeking pleasure or avoiding pain?
3. Belonging (acceptance/rejection) -- Does this behavior connect to social acceptance or fear of rejection?

ABILITY:
4. Time -- How long does it take?
5. Money -- How much does it cost?
6. Physical Capacity -- How physically demanding is it?
7. Mental Capacity -- How complicated is it?
8. Practice -- How familiar is it to the user?

PROMPT:
9. Do you have an explicit prompt (button, notification, email) at the right moment?
10. Are there implicit prompts (situations, emotions, habits) that trigger this behavior?
```
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Map the Behavior and Determine Threshold Position

Based on the lever analysis, help the user determine where their desired behavior lands on the BMap.

**The BMap has four zones:**

- **Zone A (High Motivation, High Ability):** Above the Activation Threshold. The behavior is likely to happen with a proper prompt.
- **Zone B (High Motivation, Low Ability):** Below the threshold. The user WANTS to do it but CANNOT. Focus on improving ability levers.
- **Zone C (Low Motivation, High Ability):** Below the threshold. The user CAN do it but does not WANT to. Focus on improving motivation levers.
- **Zone D (Low Motivation, Low Ability):** Well below the threshold. Both motivation and ability need work. Consider whether this is the right behavior to target.

**Guide the user to identify:**

1. Which zone their desired behavior currently lands in
2. What is the single weakest lever dragging them below the threshold
3. What is the most efficient lever to improve (the one that moves them above the threshold with least effort)

**Key insight:** Start small to lead customers to their ultimate outcome gradually. You do not need to solve everything at once. Find the one lever that, when improved, crosses the Activation Threshold.
</step>

<step number="6" required="true" depends_on="5">
### Step 6: Validate the Prompt

Even when motivation and ability are sufficient, without a prompt there is no action.

**Guide the user to evaluate their prompt:**

```
Let's validate your prompt. Answer these questions:

1. Does the prompt arrive at the RIGHT MOMENT (when motivation and ability are both present)?
2. Is the prompt CLEAR about what to do next?
3. Is the prompt APPROPRIATE for the user's current context?
4. Could the prompt be delivered through a different channel for better timing?
5. Are there natural implicit prompts (situations, habits) you could leverage?
```

**Example:** Uber Eats sends food delivery notifications around lunch and dinner time because hunger increases motivation, which increases the chance of being above the Activation Threshold. The prompt itself has not changed -- only its timing.
</step>

<step number="7" required="true" depends_on="6">
### Step 7: Produce the Behavior Map Document

Compile the analysis into a structured Behavior Map document:

**Output format:**

```markdown
# Behavior Map: [Product/Feature Name]

## Desired Behavior
[What you want users to do]

## Customer Context
[Key insights from GEQs or research]

## Behavior Lever Analysis

### Motivation
- Anticipation: [Rating + reasoning]
- Sensation: [Rating + reasoning]
- Belonging: [Rating + reasoning]

### Ability
- Time: [Rating + reasoning]
- Money: [Rating + reasoning]
- Physical Capacity: [Rating + reasoning]
- Mental Capacity: [Rating + reasoning]
- Practice: [Rating + reasoning]

### Prompt
- Explicit: [Description + timing assessment]
- Implicit: [Description + association assessment]

## BMap Position
- Current zone: [A/B/C/D]
- Weakest lever: [Identified lever]
- Activation Threshold status: [Above/Below]

## Recommended Actions
1. [Most efficient lever to improve]
2. [Second priority]
3. [Prompt optimization]

## Hypotheses to Validate
[List any assumptions that need customer research to confirm]
```

**Final output:** Present the completed Behavior Map and ask the user to review it.
</step>

</critical_sequence>

---

## Decision Hierarchy

1. **User's customer research** -- Real data from GEQs, interviews, and analytics always wins
2. **Framework guidelines** -- The BMap structure and lever definitions from reference files
3. **AI suggestions** -- Only when user has no data; clearly labeled as hypotheses

Never invent customer motivations. If the user has no customer data, every motivation and ability assessment must be labeled as a hypothesis to validate.

---

## Integration Notes

- **Receives from:** ux-6p-stories (the key moment from the 6P Story becomes the behavior to map)
- **Feeds into:** ux-psych-framework (Motivation and Ability from the BMap become the foundation for Psych analysis)
- **Standalone use:** Fully usable independently whenever a team needs to understand why a desired behavior is or is not happening
