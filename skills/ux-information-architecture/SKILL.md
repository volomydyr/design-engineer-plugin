---
name: ux-information-architecture
description: Creates information architecture including screen inventory, navigation structure, user flows, and content hierarchy. Use when you need a structural blueprint before UI design or when navigation feels unclear.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Information Architecture

## Established-product scope reduction

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context`. If `shipped_ui: true` AND the user is here for a single feature (not a full pipeline), reduce scope:

1. Do NOT regenerate the project's full IA – the product has shipped pages/routes, the navigation is established.
2. Focus only on what the *specific feature* the user named needs: which existing pages this feature touches, where new pages slot into existing navigation, content hierarchy for THIS feature only.
3. Output goes to `.design-engineer-plugin/design/features/[feature-slug]/ia.md`, not the project-level `.design-engineer-plugin/design/planning/information-architecture.md`.

If `shipped_ui: false` (greenfield) or the user explicitly wants project-level IA definition, proceed normally below.

## Why This Matters

Imagine you are building a house from scratch. Would you create an architectural plan first, or wing it room by room? Most people would plan first. Yet designers often jump straight into UI without a clear structural plan. That is where Information Architecture (IA) comes in.

IA is a structured diagram that lays out every piece of navigation in your interface. Think of it like prepping for construction: you decide what goes where before picking paint colors or furniture.

It helps you:

- Collect all navigation in one place
- Reveal gaps in your structure
- Prepare for the UI phase with a clear checklist of what to design
- Avoid juggling dozens of ideas in your head and hoping nothing slips through

Keep it simple. IA can be extremely detailed, but simplicity is preferred. For example, you might limit IA to four levels: a top-level section, its steps, the content at each step, and the possible interactions within each.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess your current product structure, 2) share my initial perspectives on the information architecture, 3) ask 7–10 strategic questions to understand the structure, 4) draft the information architecture, 5) iterate until you approve, 6) produce the final deliverable." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what information architecture is and why it matters. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Current State

```
question: "What do you have in terms of product structure so far?"
header: "IA Status"
options:
  - label: "Nothing yet"
    description: "I have not mapped out the product structure"
  - label: "I have MVP requirements"
    description: "I know what features to build but have not organized them into a structure"
  - label: "I have rough sketches or notes"
    description: "I have some ideas about screens and flows but nothing formal"
  - label: "I have an existing IA to update"
    description: "I have a structure document that needs revision"
```

```
multiSelect: false  # User must choose one current state
```

If the user has existing MVP requirements, Service UX Map, or wireframes, ask them to share before proceeding.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Share Initial Perspectives

Before asking questions, share your brief initial thoughts about the information architecture based on what you know about the project so far. Keep it to 2-3 sentences per thought. Ground these in the user's product context.

---

## Step 3: Ask Strategic Questions

Ask 7-10 context-based strategic questions. Adapt your questions to what you already know about the project. Make sure your questions cover these key concepts:

- House-building analogy: plan the structure first versus winging it room by room
- 4 benefits of IA: keeps navigation in one place, reveals gaps, prepares for the UI phase, gives a checklist
- 4-level depth limit (e.g., Onboarding / steps / questions / answer options)
- Simplicity preferred

When asking about navigation models, use AskUserQuestion with previews to help the user choose:

```
question: "How do you envision the main navigation?"
header: "Navigation"
options:
  - label: "Bottom tab bar"
    description: "Fixed tabs at the bottom – standard for mobile apps with 3-5 main sections"
    preview: |
      ┌──────────────────────┐
      │                      │
      │    [Content Area]    │
      │                      │
      │                      │
      ├──────────────────────┤
      │  H   S   +   U   G  │
      └──────────────────────┘
      Always visible, thumb-friendly,
      max 5 items. iOS/Android standard.
  - label: "Sidebar navigation"
    description: "Persistent side panel – common for desktop apps and dashboards"
    preview: |
      ┌──────┬───────────────┐
      │ Logo │               │
      │------│               │
      │ Home │  [Content]    │
      │ Data │               │
      │ Team │               │
      │ Msgs │               │
      │------│               │
      │ Gear │               │
      └──────┴───────────────┘
      Always visible, scalable to
      many sections. Desktop-first.
  - label: "Hamburger menu"
    description: "Hidden navigation behind a menu icon – saves space but reduces discoverability"
    preview: |
      ┌──────────────────────┐
      │ =  App Name      (!) │
      ├──────────────────────┤
      │                      │
      │    [Content Area]    │
      │                      │
      │    No nav visible    │
      │    until = tapped    │
      │                      │
      └──────────────────────┘
      Hidden until opened.
      More space, less discovery.
  - label: "Top navigation"
    description: "Horizontal tabs or links at the top – common for marketing sites and simple web apps"
    preview: |
      ┌──────────────────────┐
      │ Logo  Home  Pricing  │
      │       Blog  Contact  │
      ├──────────────────────┤
      │                      │
      │    [Content Area]    │
      │                      │
      │                      │
      └──────────────────────┘
      Familiar pattern for web.
      Limited to ~6 items.
```

Ask in small batches (2-3 at a time). Wait for answers before continuing.

**BLOCKING REQUIREMENT**: Wait for the user's answers before proceeding to Step 4.

---

## Step 4: Draft the Information Architecture

Based on all gathered information, draft the IA document following the structure in [ia-deliverable-template.md](./references/ia-deliverable-template.md).

Present the draft and ask for feedback. Check that:

- Every MVP feature has a home in the structure
- Navigation depth does not exceed 4 levels (keep it simple)
- The primary user flow is clear and direct
- Nothing from the MVP requirements is missing

---

## Step 5: Iterate Until Approved

Continue refining based on the user's feedback. For each iteration:

1. Incorporate corrections and additions
2. Flag navigation that is getting too deep or complex
3. Ensure consistency in naming and hierarchy
4. Cross-reference against MVP requirements to catch missing items

Repeat until the user explicitly approves the IA.

---

## Step 6: Produce the Deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/planning` (Bash) – or `mkdir -p .design-engineer-plugin/design/features/[feature-slug]` if writing per-feature. The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the final IA document to `.design-engineer-plugin/design/planning/information-architecture.md`.

The document should follow the complete structure from [ia-deliverable-template.md](./references/ia-deliverable-template.md).

---

## Common Mistakes to Avoid

- **Not creating IA at all**: Jumping straight into UI creates a patchwork product
- **Making IA overly complex**: Too many navigation levels confuse users and developers
- **Creating something you cannot understand later**: If you cannot explain the structure in 2 minutes, simplify it

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing screen, an unaddressed flow, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything
2. **Existing documentation** (MVP requirements, Service UX Map, user flows) informs the structure
3. **AI suggestions** fill gaps only when user and docs provide no guidance

---

## What Comes Next

After IA is finalized, suggest:

1. Create wireframes or AI-generated prototypes based on the IA
2. Begin UI design using the IA as a checklist of what to design
3. `ui-references-moodboard` – Collect design references organized by IA sections

---

## Resource Files

- [ia-deliverable-template.md](./references/ia-deliverable-template.md) – IA document structure with screen inventory, flow diagrams, and hierarchy notation


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` – "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
