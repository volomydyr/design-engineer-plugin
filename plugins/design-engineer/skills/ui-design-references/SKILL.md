---
name: ui-design-references
description: Guides design intent exploration and reference gathering before opening any design tool. Use when starting high-fidelity UI work, establishing visual direction, or when the product needs intentional design decisions rather than defaults.
disable-model-invocation: true
---

# Design References and Intent

## Why This Matters

Once your product is validated through testing, you can move to high-fidelity UI. But before collecting references or opening Figma, there is a more fundamental step: understanding the intent behind the design.

Most AI-generated interfaces look the same because intent lives in prose, but code generation pulls from patterns. The gap between them is where defaults win. This skill closes that gap by forcing intentional decisions before any visual work begins.

The process: establish design intent → explore the product domain → collect references → synthesize into direction.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Where Defaults Hide

Before any design work, internalize this principle. Defaults do not announce themselves – they disguise themselves as infrastructure.

- **Typography feels like a container** – but it IS your design. A bakery tool and a trading terminal both need "clean, readable type" – but the type that is warm and handmade is not the type that is cold and precise.
- **Navigation feels like scaffolding** – but it IS your product. Where you are, where you can go, what matters most. A page floating in space is a component demo, not software.
- **Data feels like presentation** – but HOW you show a number matters. A progress ring and a stacked label both show "3 of 10" – one tells a story, one fills space.
- **Token names feel like implementation** – but `--ink` and `--parchment` evoke a world. `--gray-700` and `--surface-2` evoke a template.

The moment you stop asking "why this?" is the moment defaults take over. For the full framework, see [design-intent-guide.md](./references/design-intent-guide.md).

---

## Step 1: Establish Design Intent

Before collecting any references, answer these three questions. If the user cannot answer with specifics, help them get there. Do not guess. Do not default.

**Who is this human?** Not "users." The actual person – where they are when they open this, what is on their mind, what they did 5 minutes ago.

**What must they accomplish?** The verb, not "use the dashboard." Grade these submissions. Find the broken deployment. Approve the payment.

**What should this feel like?** Words that mean something. Not "clean and modern" – every AI says that. Try: warm like a notebook, cold like a terminal, dense like a trading floor, calm like a reading app.

```
question: "How would you describe the feeling this product should have?"
header: "Design Feel"
options:
  - label: "Warm and approachable"
    description: "Friendly, organic, inviting – like a well-worn notebook or a cozy workspace"
  - label: "Cold and precise"
    description: "Technical, exact, efficient – like a surgical instrument or a terminal"
  - label: "Dense and powerful"
    description: "Information-rich, professional, complex – like a trading floor or command center"
  - label: "Calm and focused"
    description: "Minimal, spacious, intentional – like a reading app or meditation space"
```

---

## Step 2: Explore the Product Domain

Spend time in the product's world before any visual thinking. Produce all four outputs:

1. **Domain** – 5+ concepts, metaphors, vocabulary from this product's world. Not features – territory.
2. **Color world** – 5+ colors that exist naturally in this domain. If this product were a physical space, what would you see?
3. **Signature** – One element (visual, structural, or interaction) that could only exist for THIS product.
4. **Named defaults** – 3 obvious/generic choices for this type of interface. Name them so you can consciously avoid them.

Present these to the user and ask: "Does this capture your product's world? What would you add or change?"

**The test:** Remove the product name from your proposal. Could someone identify what this is for? If not, explore deeper.

---

## Step 3: Understand the Product Context

Determine what the user is building:

```
question: "What type of product are you designing for?"
header: "Product Type"
options:
  - label: "Mobile app (iOS)"
    description: "Native iOS application with standard mobile patterns"
  - label: "Mobile app (Android)"
    description: "Native Android application with Material Design patterns"
  - label: "Web application"
    description: "Browser-based application with responsive layouts"
  - label: "Cross-platform mobile"
    description: "React Native, Flutter, or similar cross-platform framework"
```

Then ask about the product domain (e.g., healthcare, fintech, e-commerce, productivity, social) to narrow reference searches.

---

## Step 4: Identify Key Screens to Reference

Based on the user's Information Architecture and MVP Requirements (if available from earlier skills), identify the 5–8 most important screens that need visual direction.

```
question: "Which screens are most critical for establishing your visual direction?"
header: "Key Screens"
options:
  - label: "Onboarding / Welcome"
    description: "First impression and sign-up flow"
  - label: "Home / Dashboard"
    description: "Main screen users see after login"
  - label: "Primary action screen"
    description: "The core feature users come for"
  - label: "Detail / Content view"
    description: "How individual items or records are displayed"
  - label: "Navigation structure"
    description: "Bottom tabs, sidebar, or drawer patterns"
  - label: "Forms / Input screens"
    description: "How users enter or edit data"
  - label: "Settings / Profile"
    description: "Account management and preferences"
allowMultiSelect: true
```

---

## Step 5: Guide Reference Collection

Walk the user through collecting references using the approach in [reference-gathering-guide.md](./references/reference-gathering-guide.md).

For each key screen identified in Step 4:

1. Suggest specific search terms for Mobbin (e.g., "healthcare onboarding", "medical records detail")
2. Recommend looking at 3–5 apps in the same domain
3. Ask the user to note what they like about each reference – specific elements, not just "looks good"
4. Help categorize references by: layout patterns, color approaches, typography styles, interaction models

---

## Step 6: State Your WHY Checkpoint

Before moving to the direction document, state the design intent explicitly:

```
Intent: [who is this human, what must they do, how should it feel]
Palette: [colors from your domain exploration – and WHY they fit]
Depth: [borders / shadows / layered – and WHY this fits the intent]
Surfaces: [your elevation scale – and WHY this color temperature]
Typography: [your typeface – and WHY it fits the intent]
Spacing: [your base unit]
```

For every choice, you must explain WHY. If the answer is "it is common" or "it is clean" or "it works" – you have not chosen. You have defaulted. See the full checkpoint guide in [design-intent-guide.md](./references/design-intent-guide.md).

---

## Step 7: Organize References into a Direction Document

Help the user compile their references into a structured document. For each key screen:

- Which reference apps inspired the direction
- Specific patterns to adopt (e.g., "card-based layout like App X", "bottom sheet navigation like App Y")
- Color direction informed by the domain color world exploration
- Typography feel tied to the stated design intent
- Interaction patterns worth replicating
- The signature element and where it appears

---

## Step 8: Produce the Deliverable

Save the references document to `{deliverables_path}/design/references.md`.

The document should include:

- Design intent (the three questions answered)
- Domain exploration outputs (domain, color world, signature, named defaults)
- Product type and context
- List of key screens with visual direction for each
- Reference apps and what to take from each
- The WHY checkpoint (palette, depth, surfaces, typography, spacing with reasoning)
- Overall visual direction summary (2–3 sentences describing the target aesthetic)
- Notes on what NOT to do (anti-patterns and named defaults to avoid)

---

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything – their taste, their product, their call
2. **Existing documentation** (MVP Requirements, Information Architecture) informs what screens to focus on
3. **AI suggestions** fill gaps only when user and docs provide no guidance – and are always presented as suggestions, not decisions

---

## What Comes Next

After references are collected, suggest running `ui-figma-workflow` to design the key screens in Figma using these references as visual direction. After implementation, suggest `ui-design-critique` to verify the build reflects the stated intent.

---

## Resource Files

- [reference-gathering-guide.md](./references/reference-gathering-guide.md) – Approach to collecting and organizing design references using Mobbin and other tools
- [design-intent-guide.md](./references/design-intent-guide.md) – Full design intent framework: Where Defaults Hide, Intent-First, Domain Exploration, WHY Checkpoint
