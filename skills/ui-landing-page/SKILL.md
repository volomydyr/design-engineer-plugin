---
name: ui-landing-page
description: "Generates a single-file HTML landing page with conversion-optimized structure and copy. Reads StoryBrand deliverable as the copy foundation. Use when the user needs a marketing landing page for their product."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Landing Page

Generate a single-file HTML landing page with conversion-optimized structure, copy grounded in the StoryBrand deliverable, and design tokens from the user's references. The landing page is a separate artifact from the product prototype.

**Important**: No git, no /simplify, no TDD during landing page creation. Same rules as prototyping – this is a design artifact, not production code.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: "Here's what I'm going to do: 1) read your StoryBrand deliverable to extract the narrative, 2) choose a copy framework, 3) walk through each of the 9 landing page sections with you, 4) generate the page section by section, 5) assemble into a single HTML file, 6) iterate with you, 7) save the deliverable."

2. **Conditional teaching**: Ask the user if they are familiar with landing page structure and conversion principles. If yes, brief refresher. If no, explain: a landing page is a single-purpose page designed to convert visitors into users. It follows a specific section order (hero → social proof → problem → solution → how it works → testimonials → pricing → FAQ → final CTA) because this order matches how people make decisions.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss copy and layout with the user, get their input, then move to the next. Never dump the entire landing page at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, what a skeptical visitor would think. Then let the user decide.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding.

---

## Step 0.5: Design grounding (BLOCKING)

Before generating any HTML, the design-grounding hook will deny `.html` writes until you have:

1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
4. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/frontend-design/SKILL.md` (Anthropic's bundled frontend-design skill — bold aesthetic direction)
5. Confirmed `.design-engineer-plugin/design/exploration/references.md` exists, AND READ IT
6. Read every existing deliverable under `.design-engineer-plugin/design/{foundation,research,planning,exploration,psychology,reviews,dev}/*.md` (Glob first, then Read each one)

The bundled `frontend-design` Read forces you to commit to the **bold aesthetic flavor** picked in `ui-references-moodboard` Step 1. Re-read the flavor field in `references.md` and apply it as a binding constraint to every section: typography, color, motion, layout. The landing page is an EXECUTION of the flavor, not a parallel creation.

After the Reads, output a compact Pre-Flight block in chat:

- **Bold aesthetic flavor (from references.md)**: <flavor name + 1-sentence interpretation>
- **Palette (from references.md)**: <colors>
- **Typography (from references.md)**: <typeface>
- **Storybrand narrative (from storybrand.md)**: <hero + problem + plan + CTA in 1 line each>
- **Anti-pattern self-check**: PASS / how I'm avoiding cream+orange, Inter/SF Pro defaults, gradient text, glassmorphism, mobile-mockup-in-desktop-frame.

---

## Step 1: Read StoryBrand deliverable

Read `.design-engineer-plugin/design/foundation/storybrand.md` to extract the 7-part narrative:

1. **Hero** – who is the user, what do they want
2. **Problem** – external, internal, philosophical
3. **Guide** – empathy + authority
4. **Plan** – 3–4 steps
5. **CTA** – primary + secondary
6. **Success** – what life looks like after
7. **Failure** – consequences of inaction

If the StoryBrand deliverable does not exist, warn the user and suggest running the `ux-storybrand` skill first. If they want to proceed without it, gather the narrative through questions instead.

Also read: `.design-engineer-plugin/design/foundation/business-plan.md` (for pricing info, if applicable) and `.design-engineer-plugin/design/exploration/references.md` (for design tokens).

Present what was extracted:

> **Narrative foundation (from StoryBrand):**
> - Hero: [extracted]
> - Problem: [extracted]
> - Guide positioning: [extracted]
> - Plan: [extracted]
> - CTA: [extracted]
> - Success vision: [extracted]
> - Failure stakes: [extracted]

**BLOCKING REQUIREMENT**: Wait for the user to confirm the narrative extraction is accurate.

---

## Step 2: Choose copy framework

Reference [landing-page-structure.md](./references/landing-page-structure.md) for the three frameworks.

```
question: "Which copy framework should we use for your landing page?"
header: "Copy framework"
options:
  - label: "StoryBrand (recommended)"
    description: "Your StoryBrand canvas already has the narrative – we'll map it directly to the landing page sections"
  - label: "PAS (Problem-Agitate-Solution)"
    description: "Lead with the pain point, amplify consequences, present your solution"
  - label: "AIDA (Attention-Interest-Desire-Action)"
    description: "Bold claim → details → benefits → CTA"
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one framework
```

**BLOCKING REQUIREMENT**: Wait for the user's choice before proceeding.

---

## Step 3: Section-by-section brief

Walk through each of the 9 landing page sections. For each section, present:
1. What this section does (teach)
2. The content mapped from the StoryBrand deliverable
3. A draft of the copy
4. Ask for the user's input

### Section 1: Hero

From StoryBrand hero + problem. Apply headline formulas from [landing-page-structure.md](./references/landing-page-structure.md).

- Draft headline (6–12 words, outcome-focused)
- Draft subheadline (15–25 words, explains how)
- CTA button text (action verb + value)
- Social proof element for above the fold

Present the draft. Ask the user to approve or rewrite.

**Copy rule**: After the first rejection of AI-generated copy, immediately ask the user to write it themselves. Do not iterate on generating more AI options.

**BLOCKING REQUIREMENT**: Wait for approval before moving to Section 2.

### Section 2: Social proof

What social proof does the user have? Logos, user count, testimonials, ratings, case studies?

```
question: "What social proof do you have available?"
header: "Social proof"
options:
  - label: "Company/brand logos"
    description: "Logos of companies or products that use or endorse your product"
  - label: "User count or metrics"
    description: "Number of users, downloads, or similar scale signals"
  - label: "Testimonials"
    description: "Quotes from real users with name and role"
  - label: "None yet"
    description: "I will add social proof later – skip this section for now"
allowMultiSelect: true
```

```
multiSelect: true  # User can have multiple types of social proof
```

**BLOCKING REQUIREMENT**: Wait for the user's answer.

### Section 3: Problem

From StoryBrand external + internal + philosophical problem. Present 2–3 specific scenarios that the target audience recognizes.

**BLOCKING REQUIREMENT**: Wait for approval.

### Section 4: Solution/Features

From StoryBrand guide + plan. 3–5 key features, each with a benefit-focused description (not feature-focused).

**BLOCKING REQUIREMENT**: Wait for approval.

### Section 5: How it works

From StoryBrand plan. 3–4 simple steps. Each with an icon concept and description.

**BLOCKING REQUIREMENT**: Wait for approval.

### Section 6: Testimonials

If the user has testimonials, use them. If not, create placeholder slots with guidance on what makes a good testimonial (specific result, name + role, relatable context).

**BLOCKING REQUIREMENT**: Wait for approval.

### Section 7: Pricing (if applicable)

From business plan. If the product is free, skip or replace with a "why it's free" section.

**BLOCKING REQUIREMENT**: Wait for approval or skip confirmation.

### Section 8: FAQ

From StoryBrand failure section – address the objections that would prevent someone from trying the product. 5–7 questions with clear, confident answers.

**BLOCKING REQUIREMENT**: Wait for approval.

### Section 9: Final CTA

Reinforce the value proposition. Add urgency or risk reversal if appropriate.

**BLOCKING REQUIREMENT**: Wait for approval.

---

## Step 4: Generate the landing page

Assemble all approved sections into a single HTML file with all CSS in `<style>` and all JS in `<script>`. No external dependencies.

### Generation guidelines

1. Apply design tokens from references.md – same visual direction as the product prototype
2. Use CSS custom properties for all tokens in `:root {}`
3. Follow the mobile optimization rules from [landing-page-structure.md](./references/landing-page-structure.md): full-width CTAs, 48px tap targets, 16px min font
4. **Image-slot rule (HARD)**: each section that needs an image (hero, social proof / press logos, testimonial avatars, product shots, feature illustrations) MUST go through the `ui-images` skill BEFORE writing the `<img>` tag. The skill decides per-image generate-vs-stock, writes prompts or search queries, and places the file in `.design-engineer-plugin/design/exploration/images/`. Do not emit gradient placeholders, emoji-stamped SVGs, or random Pexels grabs. Do not skip the skill on the assumption that "the user will replace it later" – they won't, and the slop ships.
5. Before presenting, read [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) and self-review for design anti-patterns
6. Read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and verify all copy passes the anti-slop check

### File location

Save to: `.design-engineer-plugin/prototype/landing-page.html`

---

## Step 5: Iterate with user

Same iteration approach as product prototyping:

- Guide specific feedback (point to specific elements)
- After first rejection of AI copy, ask user to write it
- Never revert or reinterpret user-provided content
- One concrete change per round

---

## Step 6: Save deliverable

Save the final landing page to `.design-engineer-plugin/prototype/landing-page.html`.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – missing testimonials, no pricing decided, no social proof – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, user quotes, or company logos.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory.

## Anti-slop Writing

Before generating any text for the landing page, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Landing page copy must sound human, not like marketing AI slop. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their vision takes priority
2. **StoryBrand deliverable** – the narrative foundation
3. **Planning documents** – business plan, MVP requirements
4. **AI suggestions** – lowest weight, always presented as suggestions

---

## What Comes Next

After the landing page is complete, suggest:

- **If product prototype also needed**: return to `dev-prototyping`
- **If Figma designs needed**: suggest `ui-figma-guide`
- **If ready for development**: suggest `/design-engineer:development`

---

## Resource Files

- [landing-page-structure.md](./references/landing-page-structure.md) – 9-section structure, CTA rules, mobile optimization, copy frameworks
- [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) – Design anti-patterns to avoid
- [anti-slop-writing.md](../shared-references/anti-slop-writing.md) – Writing quality rules
