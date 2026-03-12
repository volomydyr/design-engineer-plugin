---
name: dev-prototyping
description: "Generates a single-file HTML prototype directly in Claude Code. Use for new products (after planning), new features for existing products, or redesigns. Pulls design context from planning documents, existing codebases, or Figma designs."
disable-model-invocation: true
---

# Dev Prototyping

Generate interactive single-file HTML prototypes directly in Claude Code. Works for new products (after planning docs exist), new features for existing products, or redesigns of current features. Pulls design context from planning documents, existing codebases, or Figma designs.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand Context

```
question: "What are you prototyping?"
header: "Prototype Type"
options:
  - label: "New product from scratch"
    description: "Full pipeline — planning docs exist (MVP requirements, IA, references)"
  - label: "New feature for existing product"
    description: "Adding to a product that already has designs or code"
  - label: "Redesign of existing feature"
    description: "Rethinking something that currently exists"
allowMultiSelect: false
```

Store the selection — it determines which context-gathering paths are relevant in Step 2.

---

## Step 2: Gather Available Context

```
question: "What context do you have available?"
header: "Available Context Sources"
options:
  - label: "Planning documents in design-docs/"
    description: "MVP requirements, IA, design references, journey map"
  - label: "Existing codebase with design tokens"
    description: "CSS variables, Tailwind config, design system in code"
  - label: "Figma designs I can share"
    description: "Figma Desktop open with file — can share link"
  - label: "Just an idea"
    description: "No formal context — will describe what I want"
allowMultiSelect: true
```

For each selected source, follow the corresponding path below. Multiple paths can run together.

### Path A: Planning Documents

Read from `design-docs/` and extract:

- **Design feel, palette, depth, typography, spacing** from `references.md` (if it exists from `ui-design-references`)
- **Screens, flows, navigation structure** from the Information Architecture document
- **Feature priorities and acceptance criteria** from MVP Requirements
- **Psychology insights and bias considerations** from `bias-audit.md` and `journey-map.md` (if they exist)

Present a summary of what was found:

> **Context extracted from planning docs:**
> - Design feel: [extracted]
> - Key screens: [list]
> - Priority features: [list]
> - Navigation model: [extracted]
> - Psychology considerations: [extracted or "none found"]

If critical documents are missing (MVP Requirements or IA), warn the user and suggest running those skills first — but do not block progress.

### Path B: Existing Codebase

Ask the user to point to design token files:

```
question: "Where are your design tokens?"
header: "Token File Locations"
options:
  - label: "CSS custom properties file"
    description: "A .css file with :root { --color-primary: ... }"
  - label: "Tailwind config"
    description: "tailwind.config.js or tailwind.config.ts"
  - label: "Theme/tokens file"
    description: "A JS/TS/JSON file exporting design tokens"
  - label: "Not sure — search for me"
    description: "I will look for common patterns in the codebase"
allowMultiSelect: true
```

For "Not sure — search for me": look for files matching `**/tailwind.config.*`, `**/theme.*`, `**/tokens.*`, `**/variables.css`, `**/_variables.scss`. Read them and extract colors, typography, spacing as the baseline for prototype styling.

Present what was found and confirm with the user before using.

### Path C: Figma Designs

Explain prerequisites:

1. **Figma Desktop app** must be open with the file loaded
2. **Dev mode access** requires a paid Figma plan
3. **Figma plugin** must be installed and connected

Ask the user to share a link to specific frames they want to prototype. Use the Figma plugin tools to read design context — layout structure, colors, typography, spacing, component hierarchy.

If the Figma plugin is not available or not working, fall back to asking the user to describe the designs manually or share screenshots.

### Path D: Just an Idea

Ask 5-7 targeted questions:

1. What does the product/feature do in one sentence?
2. Who is the primary user? (role, technical ability, context of use)
3. How should the product feel? (fast and minimal, warm and friendly, professional and dense, playful, etc.)
4. What are the 3-5 key screens or states?
5. What is the navigation model? (tabs, sidebar, single-page scroll, wizard/stepper)
6. Are there any products you want it to feel similar to?
7. What is the single most important action a user should take?

### Fallback: No Design System Detected

If no existing design tokens were found from any source, use [starter-values.md](../ui-design-system/references/starter-values.md) as the CSS token baseline. Inform the user:

> "No existing design system detected. Using starter values as the CSS token baseline. These are sensible defaults that can be adjusted later."

---

## Step 3: Establish Prototype Brief

Synthesize all gathered context into a prototype brief:

- **Design intent**: How the product should look and feel (warm, clinical, playful, dense, etc.)
- **Key screens**: List every screen the prototype will include
- **Priority features**: What interactions must work (vs. what can be placeholder)
- **Navigation model**: How screens connect to each other
- **Styling approach**: Token source (planning docs, existing codebase, Figma, or starter values), color palette, typography, spacing scale

Present the brief to the user:

> **Prototype Brief**
>
> **Design Intent:** [summary]
> **Screens:** [numbered list]
> **Priority Features:** [list with must-have vs. nice-to-have]
> **Navigation:** [model]
> **Styling:** [source and key values]

Ask for explicit approval before generating:

```
question: "Does this brief look correct?"
header: "Brief Review"
options:
  - label: "Looks good — generate the prototype"
    description: "Proceed with this brief as-is"
  - label: "Needs adjustments"
    description: "I will tell you what to change"
allowMultiSelect: false
```

If adjustments are needed, iterate on the brief until approved.

---

## Step 4: Generate the Prototype

Write a single HTML file with all CSS in `<style>` and all JS in `<script>`. No external dependencies — everything self-contained.

### Generation Guidelines

1. **Apply design intent from context** — not generic Bootstrap-like styling. Use the colors, typography, and spacing extracted in Step 2
2. **Use CSS custom properties** for all design tokens (colors, spacing, typography, radii, shadows). Define them in `:root {}`
3. **Cover all key user flows** from the brief — every screen, every navigation path
4. **Include navigation** — functional links/tabs/sidebar that switch between screens
5. **Include interactive elements** — buttons that do things, forms that respond, state transitions that are visible
6. **Functional first** — the prototype should feel like a real product when clicking through, even if it looks basic
7. **Handle main states** — default, active, hover, selected. Skip loading/error/empty states unless specifically requested

### File Location

Save to: `design-docs/prototype/prototype.html`

Create the directory if it does not exist.

### Iteration Methodology

Reference [prototyping-workflow.md](./references/prototyping-workflow.md) for the iteration approach. Key principles:

- Do not build immediately — first share your development plan and get approval
- Ask clarifying questions about interactions, flows, and edge cases before generating
- The first generation is a starting point, not a final product

### Code Quality Pass

After generating the prototype file, run `/simplify` to review the generated HTML/CSS/JS for reuse, quality, and efficiency.

---

## Step 5: Iterate with User

This is the core of the prototyping process. Expect many rounds of refinement — dozens or more. Each round of feedback gets the prototype closer to the idea in the user's head.

Reference [prototyping-workflow.md](./references/prototyping-workflow.md) for iteration methodology.

### Guide Effective Feedback

If the user gives vague feedback ("make it look better", "I do not like it"), help them be specific:

> "Can you point to a specific element? For example: 'The header feels too tall', 'The cards should show an image thumbnail on the left', 'The CTA button should be fixed at the bottom of the screen.'"

Specific feedback > vague feedback. One concrete change per message is more effective than a laundry list.

### Iteration Protocol

For each round:

1. Read the current `prototype.html`
2. Apply the requested changes
3. Describe what changed
4. Ask if another round is needed

### When to Stop

Stop iterating when:

- All key user flows are functional and testable
- The prototype accurately represents the product concept
- It is good enough to test with real users
- Further refinement would be about visual polish rather than functionality

### Final Quality Pass

After the last iteration round, run `/simplify` one final time to ensure the completed prototype is clean and efficient.

---

## Step 6: Testing (Optional)

```
question: "Would you like to test this prototype with users?"
header: "User Testing"
options:
  - label: "Yes — help me set up testing"
    description: "I will host the prototype and run unmoderated user tests"
  - label: "No — skip to saving deliverables"
    description: "The prototype is good enough for now"
allowMultiSelect: false
```

### If Yes: Set Up Testing

**Hosting the prototype:**

- **Local hosting**: Run `python3 -m http.server` from the `design-docs/prototype/` directory, then open `http://localhost:8000/prototype.html` in a browser
- **Static hosting**: Deploy to Vercel, Netlify, or GitHub Pages for a shareable URL
- **Simple share**: For quick sharing, any static file host works — the prototype is a single HTML file with no dependencies

**Setting up tests:**

1. Open the prototype URL in a browser
2. Paste it into a user testing tool (Useberry, Maze, or similar)
3. Create a test script with specific tasks for users to complete
4. If unfamiliar with the testing tool, ask for help navigating the interface (share screenshots when guidance does not match what you see)

**Ask for help writing the test script** if needed — good tasks are specific, realistic, ordered to follow a natural user journey, and written without leading language.

**Wait for the user to return with results.** Do not proceed until test results are available.

### When Results Arrive: Dual-Analysis

Apply the dual-analysis method from [testing-analysis-guide.md](./references/testing-analysis-guide.md):

1. **Ask the user to watch every test recording first** and form their own conclusions
2. **Do not ask the user to share their conclusions yet** — keep them private
3. **Analyze the raw results independently** — without knowing the user's interpretation, to avoid bias
4. **Then ask the user to share their analysis** and identify what might have been missed
5. **Combine the best from both versions** — user insights plus independent analysis

AI tends to invent findings that are not supported by data. Always verify claims against actual test results.

---

## Step 7: Save Deliverable

Save two files:

### 1. Final Prototype

Ensure `design-docs/prototype/prototype.html` is the latest version with all iterations applied.

### 2. Prototype Notes

Save `design-docs/prototype/prototype-notes.md` with:

```markdown
# Prototype Notes

## Screens Covered
- [List every screen in the prototype]

## Design Decisions
- [Key decisions made during iteration — why things are the way they are]

## Context Sources
- [Which sources were used: planning docs, codebase, Figma, idea-only]
- [Specific files read and tokens extracted]

## Test Results (if applicable)
- [Summary of user testing findings]
- [Key changes made based on testing]

## Open Questions
- [Anything unresolved that should be addressed in the next phase]
```

---

## Decision Hierarchy

1. **User's direct input** — their vision for the product takes priority
2. **Planning documents** — what has already been decided and documented
3. **Existing design system** — tokens and patterns from the codebase or Figma
4. **AI suggestions** — lowest weight, must be verified against context

---

## What Comes Next

After prototyping, suggest the logical next step based on what exists:

- **If no Figma designs exist**: suggest `ui-figma-workflow` to design key screens based on the validated prototype. If the Figma plugin is available, the prototype HTML can be imported into Figma as a starting point for high-fidelity design work (code-to-Figma import creates Figma frames from the prototype that can then be refined manually).
- **If Figma designs exist and Figma Console MCP is available**: suggest `ui-figma-handoff` to structure designs and prepare for developer handoff
- **If designs exist but need review**: suggest `ui-design-critique` or `ui-visual-review` to evaluate the prototype against design intent
- **If the prototype needs production implementation**: suggest the development pipeline via `/de:dev`

---

## Resource Files

- [prototyping-workflow.md](./references/prototyping-workflow.md) – Iteration methodology for AI-generated prototypes
- [testing-analysis-guide.md](./references/testing-analysis-guide.md) – Dual-analysis approach for user testing results
- [starter-values.md](../ui-design-system/references/starter-values.md) – CSS token baseline when no existing design system is detected
