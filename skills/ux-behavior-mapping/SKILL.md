---
name: ux-behavior-mapping
description: "Maps user behavior using the Behavior Map framework (Behavior = Motivation x Ability x Prompt). Analyzes activation thresholds, mental models, and prompt validation. Use when user motivation is unclear or for complex products needing behavioral analysis."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# ux-behavior-mapping Skill

## Existing-context augmentation

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context`. This skill enriches existing behavior insights rather than writing a single canonical deliverable, so the pattern is **input augmentation, not skip-check**:

1. If `shipped_ui: true` AND there's prior research / behavior data referenced in `off_repo_references` (Mixpanel, Amplitude, Hotjar findings, conversion analyses in Notion, etc.), ask the user to share what they already know about user behavior on this product OR point this skill at the source.
2. Treat the existing insights as the **starting context** – the Behavior Map should incorporate what's already known about activation thresholds and motivation gaps, not invent them from scratch.
3. If no existing behavior insights are referenced, proceed normally – build the map from first principles using the framework below.

**Purpose:** Guide the user through creating a Behavior Map that visualizes the forces influencing user behavior for a specific product experience. The Behavior Map helps articulate WHY users do or do not take a desired action, and identifies the most efficient levers to change that behavior.

**Classification:** Optional / Advanced. Most useful for complex products where user motivation is unclear, when a desired behavior is not happening, or when a team cannot agree on why users are not converting. Core proven activities are Story Panels and bias audit, but Behavior Mapping adds significant depth when applied.

**When to use:** Both for new products (mapping expected user behaviors to validate assumptions) and existing products (diagnosing why a desired behavior is not happening and finding the most efficient levers to change it).

**Reference files:**

- [behavior-map-framework.md](./references/behavior-map-framework.md) – Complete Behavior Map formula, Activation Threshold, 10 behavior levers, 3 key questions, empathy questions, and the "Replacing X" technique

---

<critical_sequence name="behavior-mapping" enforce_order="strict">

## Workflow

<step number="0" required="true">
### Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand your context and the desired behavior, 2) teach the Behavior Map formula, 3) gather customer research with empathy questions, 4) analyze the 10 behavior levers, 5) map the behavior and determine threshold position, 6) validate the prompt, 7) produce the Behavior Map document." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with the Behavior Map framework (Behavior = Motivation x Ability x Prompt). If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Walk through one concept at a time, explain it simply, give a concrete example related to the user's product, then ask. Do not batch multiple abstract concepts into one question with pre-combined ratings as options.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.
</step>

<step number="1" required="true" depends_on="0">
### Step 1: Understand the Context

Determine what the user is working on and whether they have prior deliverables.

**Use AskUserQuestion** (with numbered-list fallback):

```
To create a meaningful Behavior Map, I need to understand your context:

1. What product or feature are you mapping behavior for?
2. What is the DESIRED user behavior you want to understand or improve? (e.g., "complete onboarding", "upgrade to paid plan", "invite teammates")
3. Have you already created a Story Panel for this experience? If yes, what was the key moment / biggest gap you identified?
4. Do you have any customer research data (survey responses, interview notes, analytics)? If yes, share the key insights.
5. Is this a NEW product (you are predicting behavior) or an EXISTING product (the desired behavior is not happening enough)?
```

```
multiSelect: false  # User must answer all context questions
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. Do not assume customer motivations or abilities.

**After receiving answers**, read [behavior-map-framework.md](./references/behavior-map-framework.md) to internalize the full framework.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the Behavior Map Formula

Explain the core concept naturally as part of the conversation:

**The Behavior Map Formula: Behavior = Motivation x Ability x Prompt**

A user behavior happens only when three elements converge at the same moment:

1. **Motivation** – The willpower to act. The behavior must be aligned with the user's hopes, pains, and existing desires. You cannot impose motivation that does not exist.
2. **Ability** – The capacity to act. The user must have the time, money, physical capacity, mental capacity, and familiarity needed to perform the behavior.
3. **Prompt** – The timely cue to act. Without a prompt, there is no action – even when motivation and ability are both high. The prompt must arrive at the right moment.

**The Activation Threshold:** On the Behavior Map, there is a dashed line representing the minimum combined Motivation and Ability needed for a behavior to occur. If the user falls BELOW this threshold, the behavior does not happen regardless of the prompt.

**Critical ethical insight:** Never try to impose a behavior on a user. Instead: (1) align your product with what users already want to accomplish, (2) highlight how it will help them achieve their goal (Motivation), and only then (3) make it as easy as possible to take action (Ability) with a clear and timely cue (Prompt).

The Behavior Map is a mental model – a simplified representation to help you understand opposing forces influencing user behavior. It is not about placing a prompt as precisely as possible on a chart.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Customer Research with Empathy Questions

Before mapping behavior, ensure the user has customer insights. Guide them through the empathy questions if they do not have data.

**The 3 Empathy Questions:**

**Q1. Hope:**
"If you had a magic wand and could instantly X, how would that change your life?"

**Q2. Pain:**
"What's your #1 challenge when it comes to X? And why is it so challenging?"

**Q3. Barrier:**
"Tell me about the last time you did X, how did that go? What was preventing you from Y?"

Teach the **"Replacing X" technique** (see [behavior-map-framework.md](./references/behavior-map-framework.md) for full details):
- Replace X with the benefit/action of the industry you are in
- Replace Y with a Hope (Motivation) related to the core context X, ideally using the customer's own words from Q1

**Pro tip for better research:** Add this byline at the end of survey questions: "[...] Be super specific to help us understand. Tell us a story if possible to give us some context." This simple addition increases the length of responses by up to 300%, which means more opportunities for valuable insights.

**Use AskUserQuestion:**

```
Do you have answers to these 3 empathy questions from real customers?

1. Yes – I have customer research data I can share
2. No, but I can collect it – give me the questions formatted for my situation
3. No, and I cannot access customers – let's work with assumptions (will be clearly marked as hypotheses)
```

```
multiSelect: false  # User must choose one research state
```

**BLOCKING REQUIREMENT:** Wait for user response. If they choose option 2, format the empathy questions with their specific product context (replacing X and Y). If they choose option 3, proceed but label all motivation/ability assessments as hypotheses.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Analyze the 10 Behavior Levers

Walk the user through assessing each of the 10 behavior levers for their specific situation. Read [behavior-map-framework.md](./references/behavior-map-framework.md) for full descriptions of each lever.

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

Walk through each category ONE AT A TIME. Do not batch all levers into a single question. Explain each concept simply with a concrete example tied to the user's product before asking them to rate it.

**Category 1: Motivation**

Explain what motivation means in this context. Then ask about each lever separately:

1. **Anticipation (hope/fear)** – Explain: "Does your user hope for something or fear something that connects to this behavior?" Give a product-specific example. Then ask the user to rate: Low / Medium / High.

**BLOCKING REQUIREMENT**: Wait for the user's answer before asking the next lever.

2. **Sensation (pleasure/pain)** – Explain: "Does this behavior involve seeking immediate pleasure or avoiding immediate pain?" Give a product-specific example. Then ask to rate.

**BLOCKING REQUIREMENT**: Wait for the user's answer.

3. **Belonging (acceptance/rejection)** – Explain: "Does this behavior connect to social acceptance or fear of rejection?" Give a product-specific example. Then ask to rate.

**BLOCKING REQUIREMENT**: Wait for the user's answer.

**Category 2: Ability**

Explain what ability means – how easy or hard is the behavior? Then walk through each lever:

4. **Time** – "How long does it take?" Rate.
5. **Money** – "How much does it cost?" Rate.
6. **Physical capacity** – "How physically demanding is it?" Rate.
7. **Mental capacity** – "How complicated is it to understand?" Rate.
8. **Practice** – "How familiar is this to the user already?" Rate.

Ask these in a small batch (2–3 at a time) since they're simpler. Wait for answers before the next batch.

**BLOCKING REQUIREMENT**: Wait for all ability ratings.

**Category 3: Prompt**

Explain what prompts are – the triggers that cause action. Then ask:

9. "Do you have an explicit prompt (button, notification, email) at the right moment?"
10. "Are there implicit prompts (situations, emotions, habits) that trigger this behavior?"

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding to Step 5.
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Map the Behavior and Determine Threshold Position

Based on the lever analysis, help the user determine where their desired behavior lands on the Behavior Map.

**The Behavior Map has four zones:**

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

```
multiSelect: false  # User answers prompt validation questions
```

**BLOCKING REQUIREMENT**: Wait for the user's prompt validation answers before proceeding to Step 7.

**Example:** Uber Eats sends food delivery notifications around lunch and dinner time because hunger increases motivation, which increases the chance of being above the Activation Threshold. The prompt itself has not changed – only its timing.
</step>

<step number="7" required="true" depends_on="6">
### Step 7: Produce the Behavior Map Document

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/exploration` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront. Save the document to `.design-engineer-plugin/design/exploration/behavior-map.md`.

Compile the analysis into a structured Behavior Map document:

**Output format:**

```markdown
# Behavior Map: [Product/Feature Name]

## Desired Behavior
[What you want users to do]

## Customer Context
[Key insights from empathy questions or research]

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

## Behavior Map Position
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

After completing the behavior map, check if any new assumptions surfaced. If so, Read `.design-engineer-plugin/design/foundation/assumptions.md` and append the new assumptions with a note: 'Added from behavior mapping on [date].' The assumptions document is a living deliverable that accumulates insights across the pipeline.
</step>

</critical_sequence>

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing lever assessment, an unaddressed behavior, a motivation nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No invented motivations**: During this activity, do not invent customer motivations or ability assessments. If the user has no customer data, every motivation and ability assessment must be labeled as a hypothesis to validate.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's customer research** – Real data from empathy questions, interviews, and analytics always wins
2. **Framework guidelines** – The Behavior Map structure and lever definitions from reference files
3. **AI suggestions** – Only when user has no data; clearly labeled as hypotheses

Never invent customer motivations. If the user has no customer data, every motivation and ability assessment must be labeled as a hypothesis to validate.

---

## Integration Notes

- **Invoked by:** `/design-engineer:discovery` (add depth – part of the full psychology scan option)
- **Receives from:** ux-story-panels (the key moment from the Story Panel becomes the behavior to map)
- **Feeds into:** ux-motivation-audit (Motivation and Ability from the Behavior Map become the foundation for Motivation analysis)
- **Standalone use:** Fully usable independently whenever a team needs to understand why a desired behavior is or is not happening


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
