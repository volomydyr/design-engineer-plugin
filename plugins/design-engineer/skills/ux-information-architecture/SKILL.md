---
name: ux-information-architecture
description: Creates information architecture including screen inventory, navigation structure, user flows, and content hierarchy. Use when you need a structural blueprint before UI design or when navigation feels unclear.
disable-model-invocation: true
---

# Information Architecture

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

If the user has existing MVP requirements, Service UX Map, or wireframes, ask them to share before proceeding.

---

## Step 2: Share Initial Perspectives

Before asking questions, briefly share how the product structure could be organized from multiple angles:

- **User journey perspective**: What screens or steps the user encounters from first touch to core value
- **Navigation perspective**: How the main sections relate to each other
- **Depth perspective**: How many levels deep the navigation goes
- **Platform perspective**: How structure differs between mobile and desktop (if applicable)

Keep each to 2-3 sentences. Ground these in the user's product context.

---

## Step 3: Ask Strategic Questions

Ask 7-10 questions to define the product's structural blueprint:

1. **Core screens**: What are the most important screens or pages in your product? List everything you can think of.
2. **Entry points**: How do users first encounter your product? (Landing page, app store, referral link, onboarding)
3. **Primary flow**: What is the main path a user takes from opening the product to getting value?
4. **Navigation model**: Use AskUserQuestion with previews to help the user choose:

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
5. **Content types**: What types of content does your product display? (Text, cards, lists, media, forms, dashboards)
6. **Depth levels**: How many levels deep should the navigation go? (Top-level sections, sub-sections, detail views, modals)
7. **User states**: What different states does a user go through? (First-time, returning, free tier, paid tier)
8. **Settings and account**: What settings or account management features are needed?
9. **Edge cases**: What happens when content is empty, loading fails, or limits are reached?
10. **Platform priority**: Are you designing for mobile-first, desktop-first, or both equally?

Ask in small batches (2-3 at a time). Wait for answers before continuing.

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

Save the final IA document to `{deliverables_path}/foundation/information-architecture.md`.

The document should follow the complete structure from [ia-deliverable-template.md](./references/ia-deliverable-template.md).

---

## Common Mistakes to Avoid

- **Not creating IA at all**: Jumping straight into UI creates a patchwork product
- **Making IA overly complex**: Too many navigation levels confuse users and developers
- **Creating something you cannot understand later**: If you cannot explain the structure in 2 minutes, simplify it

---

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
3. `ui-design-references` – Collect design references organized by IA sections

---

## Resource Files

- [ia-deliverable-template.md](./references/ia-deliverable-template.md) – IA document structure with screen inventory, flow diagrams, and hierarchy notation
