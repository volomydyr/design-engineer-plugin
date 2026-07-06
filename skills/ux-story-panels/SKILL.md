---
name: ux-story-panels
description: "Guides creation of Story Panels – comic-style visual product stories with 6 panels that build customer empathy. Produces image generation prompts for each panel, reviews generated images, and iterates until the story is right. Use when starting a new product or documenting an existing product's user experience."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# ux-story-panels Skill

> **Opt-in depth.** This skill is off the default discovery spine. The default flow runs problem statement, target audience, MVP requirements, information architecture, prototype, then development. Run story panels only when the user adds depth, either by asking for it directly or by picking it from the optional depth menu.

## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context`. If `shipped_ui: true` (an established product where regenerating from scratch isn't appropriate), or `off_repo_references` names a source that plausibly already covers user-journey story panels (e.g. Figma / Miro / Notion docs), and the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where – repo path or off-repo reference) OR explain that the established product itself documents the user journey through its shipped flows.
2. Ask via AskUserQuestion: "Your project already has user-journey story panels at <location>. What would you like to do?" Options: "Use them as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use them as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only (e.g., creating panels for a specific new flow).
5. If "Re-run anyway" → proceed normally below.

**Purpose:** Guide the user through creating a Story Panel – a one-pager comic with six panels depicting what a customer goes through for a given experience. The final output is a set of **generated images**, not text descriptions.

**Why stories, not screens?** Screens merely tell you what happens. Only journeys can tell you *why* and *how*. Screens make you focus on your product, not the problem. It is dangerously easy to become attached to existing solutions you have put a lot of effort into (Sunk Cost Fallacy). Stories focus on the customer first.

**Important: Story Panels are visual.** Claude cannot generate images. The workflow is: Claude helps craft the story and writes image generation prompts → the user generates images in an external tool (ChatGPT/DALL-E, Midjourney, etc.) → the user shares generated images back for review → iterate until the panels are right → store final images in the project.

**When to use:** Both for new products (creating empathy stories from scratch) and for existing products (documenting current user stories to identify gaps).

**Reference files:**

- [story-panels-framework.md](./references/story-panels-framework.md) – Complete Story Panels framework with psychology, panel structure, and best practices
- [story-panels-examples.md](./references/story-panels-examples.md) – Good/bad patterns with Airbnb case study
- [example-meddy-health-checkup.jpg](./references/example-meddy-health-checkup.jpg) – Meddy Story Panel: birthday health motivation → too many tests → app recommends right ones
- [example-meddy-test-results.jpg](./references/example-meddy-test-results.jpg) – Meddy Story Panel: test results arrive → can't understand → anxiety → app explains clearly
- [example-meddy-doctor-appointment.jpg](./references/example-meddy-doctor-appointment.jpg) – Meddy Story Panel: need doctor → no info online → friends disagree → app matches perfect doctor
- [example-meddy-prescription.jpg](./references/example-meddy-prescription.jpg) – Meddy Story Panel: need medicine → can't read writing → office closed → app reads prescription
- [example-meddy-skin-mole.jpg](./references/example-meddy-skin-mole.jpg) – Meddy Story Panel: strange mole → 6-month wait → too expensive → app flags urgency → early catch

---

<critical_sequence name="story-panel-creation" enforce_order="strict">

## Workflow

<step number="0" required="true">
### Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) understand your context and the customer experience to focus on, 2) teach the psychology of storytelling and comics, 3) craft the story narrative starting from the ending, 4) generate image prompts for all 6 panels, 5) review generated images and iterate, 6) store the final image and extract actionable insights." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with Story Panels and why visual storytelling matters in product design. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why stories, not screens?" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.
</step>

<step number="1" required="true" depends_on="0">
### Step 1: Understand the Context

Before creating a Story Panel, determine the user's situation.

**Use AskUserQuestion** (with numbered-list fallback):

```
To create a meaningful Story Panel, I need to understand your context:

1. Are you creating a story for a NEW product idea, or documenting an EXISTING product's user experience?
2. What is the product or feature you are working on?
3. Which slice of the customer experience do you want to focus on? (e.g., onboarding, first purchase, a specific task)
4. Who is the customer/hero of this story? Describe them briefly.
5. Do you have any customer research insights (hopes, pains, barriers) already? If yes, share them.
```

```
multiSelect: false  # User must answer all context questions
```

**BLOCKING REQUIREMENT:** Wait for user answers before proceeding. Do not assume or invent customer context.

**After receiving answers**, read [story-panels-framework.md](./references/story-panels-framework.md) to internalize the full framework. Show the user the Meddy example images as references for what a good Story Panel looks like.

When presenting story panel examples to the user, explain the format in text first (what a 6-panel story looks like, the structure, the tone). Then automatically open the example images using Bash: `open [reference-file-path]` on macOS. This opens them in the default image viewer so the user can actually see the examples. If the `open` command fails, fall back to showing the file path so the user can open it manually. Do NOT just say 'Read 2 files (ctrl+o to expand)' – the user cannot see images in the terminal.
</step>

<step number="2" required="true" depends_on="1">
### Step 2: Teach the Psychology of Storytelling

Briefly explain WHY Story Panels work, weaving the education into the conversation naturally:

**Three psychological principles behind storytelling:**

1. **Narrative Bias** – Humans are wired to make sense of the world through stories. When information is presented as a narrative, the brain processes and retains it more effectively than raw data or screen descriptions.

2. **Singularity Effect** – People empathize more with a single individual than with a large group. A Story Panel starring one specific customer creates stronger emotional engagement than aggregate user data.

3. **Character Identification Effect** – Stories make your brain feel like YOU are experiencing the journey. This develops genuine empathy for the hero and their struggles.

**Three psychological principles behind comics specifically:**

1. **Closure** – The brain constantly tries to fill the gaps between comic panels. These gaps act as open-ended questions that force creative thinking and help find solutions.

2. **Miller's Law** – Six panels is short enough to grasp the overall meaning quickly, while leaving enough gaps to imagine improvement opportunities.

3. **Pareidolia** – Humans tend to interpret faces and emotions even in abstract shapes. Even basic stick-figure drawings can convey powerful emotions.

**Key insight:** This is not a drawing competition. The generated images should be simple, warm, comic-style illustrations focused on the character's emotions and real-life context – not polished marketing art.
</step>

<step number="3" required="true" depends_on="2">
### Step 3: Craft the Story Narrative

Guide the user through defining all 6 panels as text first. Start with Panel 6 (the happy ending) and work backward.

**Use AskUserQuestion:**

```
Let's start with the ending. In 5 words or fewer, what does success look like for your customer at the end of this experience?

Think about how they FEEL, not what button they clicked. For example:
- "I saved money and time"
- "I'm not worried anymore"
- "Best doctor ever"
```

```
multiSelect: false  # User must define the ending
```

**BLOCKING REQUIREMENT:** Wait for user input. If the ending focuses on the product rather than the customer, gently redirect.

Then guide through panels 1-5:

- **Panel 1 (Exposition):** The customer's real-life trigger – what starts the journey
- **Panels 2-3 (Rising Action):** The struggle – confusion, frustration, obstacles in REAL LIFE (not in an app)
- **Panel 4 (Climax):** The worst moment OR the turning point
- **Panel 5 (Resolution):** The product helps – this is where your product appears (NOT before)
- **Panel 6 (Denouement):** Already defined – the happy ending

For each panel, define:
- A short caption (5 words max) at the top of the panel
- A speech bubble with the character's thought/words
- The scene description (what's happening visually)

**Critical pattern from the Meddy examples:** The product only appears in Panel 5. Panels 1-4 show the customer's real-life struggle WITHOUT the product. This is what makes Story Panels about empathy, not marketing.
</step>

<step number="4" required="true" depends_on="3">
### Step 4: Generate Image Prompts

> **Scope guard**: this step generates image prompts for the **6 narrative panels of a customer-experience story** that the user just defined in Step 3. It is NOT a generic "produce image prompts" pattern that other skills can pattern-match onto. If you arrived here from `ui-references-moodboard` or `ui-images` thinking you should produce image prompts for design references or for project images: stop. Those skills have their own output paths and their own rules. Story panels live in `.design-engineer-plugin/design/exploration/story-panels/<panel-name>/` only.

Once all 6 panels are defined, generate image generation prompts for an AI image tool (ChatGPT/DALL-E, Midjourney, etc.).

**Generate a single prompt** that produces all 6 panels as one image in a 2x3 grid. The prompt should specify:

- Comic-style illustration, warm color palette, simple clean lines
- 2 columns x 3 rows grid layout with panel borders
- Consistent character appearance across all panels (same hair, clothes, features)
- Each panel has: a caption at the top, a speech bubble, and a scene
- Emotional expressions clearly visible (worried, confused, relieved, happy)
- Real-life settings (not app screens) for panels 1-4
- The product/app appears only in panel 5

**Example prompt structure:**

```
Create a 6-panel comic strip (2x3 grid) in a warm, simple illustration style with consistent character design throughout. Each panel has a short caption at top and a speech bubble.

Panel 1 (top-left): "[Caption]" – [Scene description]. Speech bubble: "[Text]"
Panel 2 (top-right): "[Caption]" – [Scene description]. Speech bubble: "[Text]"
Panel 3 (middle-left): "[Caption]" – [Scene description]. Speech bubble: "[Text]"
Panel 4 (middle-right): "[Caption]" – [Scene description]. Speech bubble: "[Text]"
Panel 5 (bottom-left): "[Caption]" – [Scene description]. Speech bubble: "[Text]"
Panel 6 (bottom-right): "[Caption]" – [Scene description]. Speech bubble: "[Text]"

Style: warm color palette, clean comic-style illustration, expressive faces, simple backgrounds. Character should look consistent across all panels.
```

**Share the prompt with the user** and instruct them to run it in their image generation tool.
</step>

<step number="5" required="true" depends_on="4">
### Step 5: Review Generated Images

Ask the user to share the generated image back.

**When reviewing, check:**

1. **Emotional arc visible?** Can you see the character's emotions change across panels? (worry → confusion → frustration → relief → happiness)
2. **Character consistency?** Does the character look like the same person in all 6 panels?
3. **Captions readable?** Are the panel captions and speech bubbles legible?
4. **Real-life context?** Do panels 1-4 show real-life situations, not app screens?
5. **Product placement correct?** Does the product only appear in panel 5?
6. **Story arc clear?** Can someone understand the full story in under 30 seconds?

**Compare against the Meddy examples** – read the reference images to calibrate quality expectations.

**If issues found:** Suggest specific prompt adjustments and ask the user to regenerate. Common fixes:
- "Make the character's expression more worried in panel 3"
- "Add more contrast between the struggle panels (2-4) and resolution panels (5-6)"
- "The caption text is too small – ask for larger text"
- "Character looks different in panel 4 – emphasize consistency"

**Iterate** until the user is satisfied. Usually 2-3 rounds are enough.
</step>

<step number="6" required="true" depends_on="5">
### Step 6: Store and Extract Insights

Once the final image is approved:

1. **Store the panel files** in a dedicated subfolder per story panel. Before writing, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/exploration/story-panels/[panel-name]` (Bash, with the panel name substituted). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.
   - Script: `.design-engineer-plugin/design/exploration/story-panels/[panel-name]/script.md`
   - Image: `.design-engineer-plugin/design/exploration/story-panels/[panel-name]/panel.png`
2. **Update `.design-engineer-plugin/memory/project-map.md`** with the new files (verify exists first; skip if not)

Then guide the user to extract actionable insights:

```
Now look at your completed Story Panel and consider:

1. What could go wrong between any two panels? Where are the gaps?
2. Which panel shows the biggest emotional drop for the customer?
3. Name one opportunity to improve the customer experience within Panels 2-5.
4. Are there moments where the customer might abandon the journey entirely?
```

**Document the improvement opportunities** as a numbered list. These feed into the next activities (Behavior Mapping, Motivation Framework analysis) if the user continues with the design pipeline.

**Multiple stories:** Each product typically needs 3-5 different Story Panels covering different user scenarios. Ask the user if they want to create another story for a different slice of the experience.
</step>

</critical_sequence>

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing panel detail, an unaddressed emotional beat, a customer context nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **No invented customer research**: If the user has no customer data, the Story Panel becomes a hypothesis to validate, and this must be stated explicitly. Do not fabricate customer quotes, research findings, or behavioral patterns.
3. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

When creating Story Panels, always follow this priority:

1. **User's context and research** – Real customer insights always win
2. **Framework guidelines** – The 6-panel structure and best practices from reference files
3. **AI suggestions** – Only when user has no data and needs a starting point to iterate on

Never invent customer research. If the user has no customer data, the Story Panel becomes a hypothesis to validate, and this must be stated explicitly.


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
