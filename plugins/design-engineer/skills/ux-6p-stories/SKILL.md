---
name: ux-6p-stories
description: Guides users through creating 6P Stories -- comic-style product stories with 6 panels that build customer empathy. Use when starting a new product (creating empathy stories from scratch) or documenting an existing product's user experience. Core UX design activity.
disable-model-invocation: true
---

# ux-6p-stories Skill

**Purpose:** Guide the user through creating a 6P Story -- a one-pager comic with six panels depicting what a customer goes through for a given experience. 6P Stories build customer empathy, reveal improvement opportunities, and communicate user problems more effectively than screens alone.

**Why stories, not screens?** Screens merely tell you what happens. Only journeys can tell you *why* and *how*. Screens make you focus on your product, not the problem. It is dangerously easy to become attached to existing solutions you have put a lot of effort into (Sunk Cost Fallacy). Stories focus on the customer first.

**When to use:** Both for new products (creating empathy stories from scratch to understand the customer journey before building anything) and for existing products (documenting current user stories to identify gaps and improvement opportunities).

**Reference files:**

- [6p-stories-framework.md](./references/6p-stories-framework.md) -- Complete 6P framework with psychology, panel-by-panel guidance, and best practices
- [6p-stories-examples.md](./references/6p-stories-examples.md) -- Adapted case study examples with good/bad patterns

---

<critical_sequence name="6p-story-creation" enforce_order="strict">

## Workflow

<step number="1" required="true">
### Step 1: Understand the Context

Before creating a 6P Story, determine the user's situation.

**Use AskUserQuestion** (with numbered-list fallback):

```
To create a meaningful 6P Story, I need to understand your context:

1. Are you creating a story for a NEW product idea, or documenting an EXISTING product's user experience?
2. What is the product or feature you are working on?
3. Which slice of the customer experience do you want to focus on? (e.g., onboarding, first purchase, a specific task)
4. Who is the customer/hero of this story? Describe them briefly.
5. Do you have any customer research insights (hopes, pains, barriers) already? If yes, share them.
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. Do not assume or invent customer context.

**After receiving answers**, read [6p-stories-framework.md](./references/6p-stories-framework.md) to internalize the full framework before guiding the user.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the Psychology of Storytelling

Briefly explain WHY 6P Stories work, weaving the education into the conversation naturally:

**Three psychological principles behind storytelling:**

1. **Narrative Bias** -- Humans are wired to make sense of the world through stories. When information is presented as a narrative, the brain processes and retains it more effectively than raw data or screen descriptions.

2. **Singularity Effect** -- People empathize more with a single individual than with a large group. A 6P Story starring one specific customer creates stronger emotional engagement than aggregate user data.

3. **Character Identification Effect** -- Stories make your brain feel like YOU are experiencing the journey. This develops genuine empathy for the hero and their struggles.

**Three psychological principles behind comics specifically:**

1. **Closure** -- The brain constantly tries to fill the gaps between comic panels. These gaps act as open-ended questions that force creative thinking and help find solutions. The space between panels is where insights happen.

2. **Miller's Law** -- The average person can only keep 7 plus or minus 2 items in working memory. Six panels is short enough to grasp the overall meaning quickly, while leaving enough gaps to imagine improvement opportunities.

3. **Pareidolia** -- Humans tend to interpret faces and emotions even in abstract shapes and inanimate objects. Even the most basic stick-figure drawing with simple dots for eyes and a curved line for a mouth can convey powerful emotions and build empathy.

**Key insight to share with the user:** This is not a drawing competition. Raw stick figures are actually better than "realistic" or "artsy" drawings. The focus should be on faces, eyes, eyebrows, and mouth -- simple dots, rectangles, and blobs. The brain is surprisingly good at interpreting human emotions even from simple lines because of pareidolia.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Define the Happy Ending

Guide the user to write the 6th panel (bottom right) first -- the customer's success moment.

**Instruct the user:**

- Write the happy ending in 5 words maximum
- This is the customer's success, not the product's success
- Focus on how the customer FEELS after the experience, not what feature they used

**Use AskUserQuestion:**

```
Let's start with the ending. In 5 words or fewer, what does success look like for your customer at the end of this experience?

Think about how they FEEL, not what button they clicked. For example:
- "Finally found the perfect place"
- "Confident about tomorrow's presentation"
- "Relief -- no more manual work"
```

**BLOCKING REQUIREMENT:** Wait for user input. If the ending focuses on the product rather than the customer, gently redirect.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Build the Remaining 5 Panels

Guide the user through panels 1 through 5, working backward from the happy ending.

**Panel structure guidance:**

- **Panel 1 (Exposition):** The customer's starting situation and context. What is their life like before this experience? What triggers the need?
- **Panels 2-3 (Rising Action):** The customer encounters the problem. Show their struggle, confusion, or frustration. What goes wrong? What obstacles appear?
- **Panels 4-5 (Climax and Resolution):** The turning point. How does the customer begin to overcome the challenge? What changes?
- **Panel 6 (Denouement):** Already defined -- the happy ending.

**For each panel, instruct the user to include:**

- A brief caption (5 words maximum per panel)
- The customer's emotion (frown, smile, confusion, relief)
- The customer's thought or speech (speech balloon)
- The real-life context (not just a screen)

**Use AskUserQuestion** to review each panel or batch of panels:

```
Now let's fill in the other 5 panels. For each, give me:
- A short caption (5 words max)
- What the customer is feeling/thinking
- What's happening in their real-life context

You can describe all 5 at once or we can go panel by panel. Which do you prefer?
1. All 5 panels at once
2. One panel at a time
```

**Key reminder to the user:** The main focus should be the customer's life, not your product. You are not just going through the steps in your app, but rather how the customer feels.
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Review Against Best Practices

Evaluate the 6P Story against five quality criteria. Read [6p-stories-framework.md](./references/6p-stories-framework.md) for the full details on each criterion.

**The most impactful 6P Stories respect the following best practices:**

1. **You start with empathy** -- The story focuses more on the customer problem than on your product. You do not merely go through the steps in your app, but rather how the customer feels. The goal is to build empathy to find better solutions.

2. **You capture emotions** -- Empathy requires emotion, so the story highlights emotions. It conveys a mini rollercoaster of ups and downs from the customer's perspective (smiles, frowns, expressions of doubt).

3. **You focus on actions** -- The story does not just describe steps. It makes others feel what the protagonist is going through in a real-life context.

4. **You highlight the hero's struggles** -- It is not enough to include an Exposition in panel 1 and a Denouement in panel 6. Great stories focus on the conflict. Panels 2, 3, 4, or 5 should highlight the customer's main doubts, frustrations, or obstacles.

5. **You look for improvement opportunities** -- 6P stories naturally highlight gaps in the customer experience. Identify what they are. These become actionable insights for design improvements.

**Provide specific feedback** on which criteria the story meets and which need strengthening. Suggest concrete improvements.

Read [6p-stories-examples.md](./references/6p-stories-examples.md) for good and bad example patterns to reference when giving feedback.
</step>

<step number="6" required="true" depends_on="5">
### Step 6: Identify Improvement Opportunities

After the 6P Story is finalized, guide the user to extract actionable insights.

**Ask the user:**

```
Now look at your completed 6P Story and consider:

1. What could go wrong between any two panels? Where are the gaps?
2. Which panel shows the biggest emotional drop for the customer?
3. Name one opportunity to improve the customer experience within Panels 2-5.
4. Are there moments where the customer might abandon the journey entirely?
```

**Document the improvement opportunities** as a numbered list. These feed directly into the next activities (Behavior Mapping, Psych Framework analysis) if the user continues with the design pipeline.

**Final output:** A complete 6P Story description with panel-by-panel breakdown and a list of identified improvement opportunities.
</step>

</critical_sequence>

---

## Decision Hierarchy

When creating 6P Stories, always follow this priority:

1. **User's context and research** -- Real customer insights always win
2. **Framework guidelines** -- The 6P structure and best practices from reference files
3. **AI suggestions** -- Only when user has no data and needs a starting point to iterate on

Never invent customer research. If the user has no customer data, the 6P Story becomes a hypothesis to validate, and this must be stated explicitly.

---

## Integration Notes

- **Feeds into:** ux-behavior-mapping (the key moment from the 6P Story becomes the focus of the Behavior Map), ux-psych-framework (improvement opportunities become Psych analysis targets)
- **Receives from:** Any prior customer research or problem statement work
- **Standalone use:** Fully usable independently for any product at any stage
