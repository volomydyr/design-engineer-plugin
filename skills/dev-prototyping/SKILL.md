---
name: dev-prototyping
description: "Generates a single-file HTML prototype directly in Claude Code. Two-step approach: visual storyboard first, then interactive prototype. Use for new products (after planning), new features for existing products, or redesigns. Pulls design context from planning documents or Figma designs."
disable-model-invocation: true
model: opus
effort: high
license: MIT
---

# Dev Prototyping

Generate interactive single-file HTML prototypes directly in Claude Code. Two-step approach: first a visual storyboard for layout/flow review, then a clickable interactive prototype. Works for new products (after planning docs exist), new features for existing products, or redesigns. Pulls design context from planning documents or Figma designs.

**Important**: No git, no /simplify, no TDD during prototyping. The prototype exists for visual feedback and as a reference for real implementation. Git init, branches, commits, tests, and code quality checks start at `/de:dev`. Prototype HTML can be messy – nobody cares about code quality in a throwaway artifact.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do: "Here's what I'm going to do: 1) ask what you want to prototype (product, landing page, or both), 2) gather context from your planning docs, 3) list every screen from your IA document for your approval, 4) create a prototype brief, 5) generate a visual storyboard for review, 6) build the interactive prototype from the approved storyboard, 7) iterate with you, 8) save the deliverable."

2. **Conditional teaching**: Ask the user if they are familiar with single-file HTML prototyping. If yes, give a one-sentence refresher. If no, explain: a self-contained HTML file with all CSS and JS inline that lets you click through real screens and interactions – no build tools, no dependencies, just open in a browser.

3. **Output presentation rule**: Present output incrementally – one screen at a time. After each screen, discuss with the user, get their input, then move to the next. Never dump an entire prototype at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Scope

```
question: "What would you like to prototype?"
header: "Prototype scope"
options:
  - label: "Product only"
    description: "Prototype the product – all screens from onboarding to daily use"
  - label: "Product + landing page"
    description: "Prototype both the product and a marketing landing page"
  - label: "Landing page only"
    description: "Just the landing page – I will handle the product separately"
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one scope
```

If "Product + landing page" or "Landing page only" is selected, note that the landing page will be handled by the `ui-landing-page` skill after the product prototype is complete (or immediately if landing page only).

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Gather context

Read from the deliverables directory and extract:

- **Design feel, palette, depth, typography, spacing** from `references.md` (if it exists from `ui-references-moodboard`)
- **Screens, flows, navigation structure** from the Information Architecture document
- **Feature priorities and acceptance criteria** from MVP Requirements
- **Psychology insights and bias considerations** from `bias-audit.md` and `journey-map.md` (if they exist)
- **Bias audit recommendations** from `{deliverables_path}/design/bias-audit.md` (if it exists). Extract the priority actions and UI recommendations. Apply them when generating prototype screens – these are concrete design improvements that should be visible in the prototype.

Present a summary of what was found:

> **Context extracted from planning docs:**
> - Design feel: [extracted]
> - Key screens: [list]
> - Priority features: [list]
> - Navigation model: [extracted]
> - Psychology considerations: [extracted or "none found"]

If critical documents are missing (MVP Requirements or IA), warn the user and suggest running those skills first – but do not block progress.

If the user selected "Figma designs" as context, explain prerequisites (Figma Desktop open, plugin connected) and ask for a link to specific frames. Fall back to screenshots or manual description if Figma plugin is unavailable.

If the user has no planning docs ("just an idea"), ask 5–7 targeted questions:

1. What does the product/feature do in one sentence?
2. Who is the primary user? (role, technical ability, context of use)
3. How should the product feel? (fast and minimal, warm and friendly, professional and dense, playful, etc.)
4. What are the 3–5 key screens or states?
5. What is the navigation model? (tabs, sidebar, single-page scroll, wizard/stepper)
6. Are there any products you want it to feel similar to?
7. What is the single most important action a user should take?

### Fallback: No design system detected

If no existing design tokens were found from any source, use [starter-values.md](../ui-design-system/references/starter-values.md) as the CSS token baseline. Inform the user:

> "No existing design system detected. Using starter values as the CSS token baseline. These are sensible defaults that can be adjusted later."

**BLOCKING REQUIREMENT**: Wait for the user's acknowledgment of the context summary before proceeding.

---

## Step 3: Screen inventory from IA

Read the Information Architecture document (if it exists). List ALL screens the prototype should cover – every screen from download to daily use, not just the core feature.

Present the list to the user:

> **Screens to prototype:**
> 1. [First launch / onboarding]
> 2. [Permission setup]
> 3. [Core feature – screen 1]
> 4. [Core feature – screen 2]
> 5. [Success state]
> 6. [Settings]
> ...

```
question: "These are the screens I'll prototype. Approve or adjust?"
header: "Screen list"
options:
  - label: "Looks good"
    description: "Prototype all listed screens"
  - label: "Needs adjustments"
    description: "I want to add, remove, or reorder screens"
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one option
```

If adjustments are needed, iterate until approved.

**BLOCKING REQUIREMENT**: Wait for the user's approval of the screen list before proceeding.

---

## Step 4: Prototype brief

Synthesize all gathered context into a prototype brief:

- **Design intent**: How the product should look and feel (warm, clinical, playful, dense, etc.)
- **Key screens**: The approved list from Step 3
- **Priority features**: What interactions must work (vs. what can be placeholder)
- **Navigation model**: How screens connect to each other
- **Styling approach**: Token source (planning docs, Figma, or starter values), color palette, typography, spacing scale

Present the brief to the user:

> **Prototype brief**
>
> **Design intent:** [summary]
> **Screens:** [numbered list from Step 3]
> **Priority features:** [list with must-have vs. nice-to-have]
> **Navigation:** [model]
> **Styling:** [source and key values]

```
question: "Does this brief look correct?"
header: "Brief review"
options:
  - label: "Looks good – start the storyboard"
    description: "Proceed with this brief as-is"
  - label: "Needs adjustments"
    description: "I will tell you what to change"
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one option
```

If adjustments are needed, iterate on the brief until approved.

**BLOCKING REQUIREMENT**: Wait for the user's approval of the brief before proceeding.

---

## Step 5: Visual storyboard (Step A)

Generate static screens showing key states and flows. This is NOT the final prototype – it is a storyboard for reviewing layout, structure, and flow before building the interactive version.

**Tell the user explicitly**: "This is a visual storyboard for review – static screens to validate layout and flow. After you approve these, I'll build the interactive prototype."

### How to generate

1. Generate one screen at a time as a self-contained HTML file
2. Apply design tokens from the context gathered in Step 2 – not generic Bootstrap-like styling
3. Use CSS custom properties for all design tokens (colors, spacing, typography, radii, shadows) in `:root {}`
4. Before presenting each screen, read [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) and self-review: does this screen have any of the listed anti-patterns? If yes, fix before presenting.
5. Present each screen to the user, one at a time
6. Discuss, get feedback, iterate on that screen before moving to the next

### Quality standard

"Functional first, beautiful later" means pixel-perfect Figma-level polish comes later – NOT that the prototype gets a pass on looking like AI slop. The prototype should still look good using references, design tokens, and anti-pattern checks.

### File location

Save to: `{deliverables_path}/prototype/storyboard.html`

Create the directory if it does not exist.

**BLOCKING REQUIREMENT**: Wait for the user's approval of all storyboard screens before proceeding to Step 6.

---

## Step 6: Interactive prototype (Step B)

Take the approved storyboard and build the real clickable version. This step is mandatory – do not skip it.

### How to generate

1. Write a single HTML file with all CSS in `<style>` and all JS in `<script>`. No external dependencies.
2. Use the approved storyboard screens as the visual foundation – layout and flow are already settled.
3. Add interactivity: functional navigation between screens, buttons that do things, forms that respond, state transitions.
4. Cover all key user flows from the brief – every screen, every navigation path.
5. Handle main states: default, active, hover, selected. Skip loading/error/empty states unless specifically requested.

### File location

Save to: `{deliverables_path}/prototype/prototype.html`

**BLOCKING REQUIREMENT**: Wait for the user to review the interactive prototype before proceeding.

---

## Step 7: Iterate with user

This is the core of the prototyping process. Expect many rounds of refinement.

Reference [prototyping-workflow.md](./references/prototyping-workflow.md) for iteration methodology.

### Guide effective feedback

If the user gives vague feedback ("make it look better", "I do not like it"), help them be specific:

> "Can you point to a specific element? For example: 'The header feels too tall', 'The cards should show an image thumbnail on the left', 'The CTA button should be fixed at the bottom of the screen.'"

Specific feedback > vague feedback. One concrete change per message is more effective than a laundry list.

### Copy rule

After the first rejection of AI-generated copy, immediately ask the user to write it themselves. Do not iterate on generating more options. Never make assumptions about what the user intended. If the user provides text, use it exactly as given. Do not revert or reinterpret user-provided content.

### Iteration protocol

For each round:

1. Read the current `prototype.html`
2. Apply the requested changes
3. Describe what changed
4. Ask if another round is needed

### When to stop

Stop iterating when:

- All key user flows are functional and testable
- The prototype accurately represents the product concept
- It is good enough to test with real users
- Further refinement would be about visual polish rather than functionality

---

## Step 8: Save deliverable

Save two files:

### 1. Final prototype

Ensure `{deliverables_path}/prototype/prototype.html` is the latest version with all iterations applied.

### 2. Prototype notes

Save `{deliverables_path}/prototype/prototype-notes.md` with:

```markdown
# Prototype notes

## Screens covered
- [List every screen in the prototype]

## Design decisions
- [Key decisions made during iteration – why things are the way they are]

## Context sources
- [Which sources were used: planning docs, Figma, idea-only]
- [Specific files read and tokens extracted]

## Open questions
- [Anything unresolved that should be addressed in the next phase]
```

---

## Content Integrity

1. **No fabrication**: No fabricated statistics or made-up research claims. If you need a statistic for prototype content, use a real one from the user's research or use placeholder text. Never invent user data, conversion rates, or usage numbers for prototype screens. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the prototype (headings, body copy, button labels, placeholder content), read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their vision for the product takes priority
2. **Planning documents** – what has already been decided and documented
3. **Existing design system** – tokens and patterns from Figma
4. **AI suggestions** – lowest weight, must be verified against context

---

## What Comes Next

After prototyping, suggest the logical next step based on what exists:

- **If landing page was requested** (Step 1): run the `ui-landing-page` skill now
- **If no Figma designs exist**: suggest `ui-figma-guide` to design key screens based on the validated prototype
- **If Figma designs exist and Figma Console MCP is available**: suggest `ui-figma-handoff` to structure designs and prepare for developer handoff
- **If designs exist but need review**: suggest `ui-aesthetic-review` or `ui-design-to-code-qa` to evaluate the prototype against design intent
- **If the prototype needs production implementation**: suggest the development pipeline via `/de:dev`

---

## Resource Files

- [prototyping-workflow.md](./references/prototyping-workflow.md) – Iteration methodology for AI-generated prototypes
- [starter-values.md](../ui-design-system/references/starter-values.md) – CSS token baseline when no existing design system is detected
- [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) – Design anti-patterns to check against before presenting screens
- [anti-slop-writing.md](../shared-references/anti-slop-writing.md) – Writing quality rules for all text output
