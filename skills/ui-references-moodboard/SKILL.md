---
name: ui-references-moodboard
description: Guides design intent exploration and reference gathering before opening any design tool. Use when starting high-fidelity UI work, establishing visual direction, or when the product needs intentional design decisions rather than defaults.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
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

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) establish design intent (who, what, feel), 2) collect your references early so everything else is grounded in real examples, 3) explore the product domain, 4) understand the product context, 5) identify key screens, 6) run the WHY checkpoint, 7) organize references into a direction document, 8) produce the final deliverable." This is a commitment device – harder to skip steps you just announced. Each step is a separate interaction with AskUserQuestion at each transition. Do not skip steps or compress multiple steps into one. **Important**: If the user has references ready, collect them right after Step 1 (design intent) — before domain exploration. References ground all subsequent decisions in real examples.

2. **Conditional teaching**: Ask the user if they are familiar with design intent and why it matters before collecting references. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

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
    preview: |
      ╭──────────────────────────────╮
      │                              │
      │  Welcome back, Sarah         │
      │                              │
      │  ╭────────╮  ╭────────╮     │
      │  │ ~~~~~~ │  │ ~~~~~~ │     │
      │  │ ~~~~~~ │  │ ~~~~~~ │     │
      │  │        │  │        │     │
      │  ╰────────╯  ╰────────╯     │
      │                              │
      │  ╭──────────────────────╮    │
      │  │  What's on your mind? │    │
      │  ╰──────────────────────╯    │
      ╰──────────────────────────────╯
      Rounded corners, generous spacing,
      soft surfaces, personal tone
  - label: "Cold and precise"
    description: "Technical, exact, efficient – like a surgical instrument or a terminal"
    preview: |
      ┌──────────────────────────────┐
      │ SYSTEM STATUS     v2.4.1     │
      ├──────────────────────────────┤
      │ CPU ████████░░ 78%           │
      │ MEM ██████░░░░ 62%           │
      │ NET ███░░░░░░░ 31%           │
      ├──────────────────────────────┤
      │ > deploy --env production    │
      │ > status: READY              │
      └──────────────────────────────┘
      Sharp edges, tight spacing,
      monospace type, data-forward
  - label: "Dense and powerful"
    description: "Information-rich, professional, complex – like a trading floor or command center"
    preview: |
      ┌────┬───────────────┬─────────┐
      │NAV │ AAPL  +2.4%   │ ALERTS  │
      │    │ MSFT  -0.8%   │   3 new │
      │    │ GOOG  +1.1%   │   1 cri │
      │    ├───────────────┤─────────│
      │    │ ┌──┐┌──┐┌──┐ │ Volume  │
      │    │ │..││. ││..│ │ 2.4M    │
      │    │ └──┘└──┘└──┘ │ +12%    │
      └────┴───────────────┴─────────┘
      Multi-panel, compact spacing,
      high data density, many columns
  - label: "Calm and focused"
    description: "Minimal, spacious, intentional – like a reading app or meditation space"
    preview: |


              The Art of Stillness

              -------------------

              In a world that moves
              too fast, the greatest
              luxury is space to think.


                    [ Continue ]


      Generous whitespace, centered,
      minimal elements, breathing room
```

```
multiSelect: false  # User must choose one design feel
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Explore the Product Domain

Spend time in the product's world before any visual thinking. Produce all four outputs:

1. **Domain** – 5+ concepts, metaphors, vocabulary from this product's world. Not features – territory.
2. **Color world** – 5+ colors that exist naturally in this domain. If this product were a physical space, what would you see?
3. **Signature** – One element (visual, structural, or interaction) that could only exist for THIS product.
4. **Named defaults** – 3 obvious/generic choices for this type of interface. Name them so you can consciously avoid them.

Present these to the user and ask: "Does this capture your product's world? What would you add or change?"

**The test:** Remove the product name from your proposal. Could someone identify what this is for? If not, explore deeper.

**BLOCKING REQUIREMENT**: Wait for the user's feedback on the domain exploration before proceeding to Step 3.

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

```
multiSelect: false  # User must choose one product type
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 4.

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

```
multiSelect: true  # User can select multiple key screens
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 5.

---

## Step 5: Guide Reference Collection

**This step should happen as early as possible** — ideally right after establishing design intent (Step 1). Reference collection grounds all subsequent decisions (domain exploration, color world, signature element) in real examples the user chose, not abstract brainstorming. If the user already has references to share, collect them before proceeding to domain exploration.

Walk the user through collecting references using the approach in [reference-gathering-guide.md](./references/reference-gathering-guide.md).

If the user does not know which apps in their domain are worth studying, Read [curated-references.md](./references/curated-references.md) — it has 8 product-type categories (mobile event/social, mobile productivity, mobile fintech, mobile health, web SaaS dashboard, web fintech, web content/media, macOS native) with 3–5 distinctive-design reference apps per category and a specific quality to study for each. These are seed references, not requirements — the user can override.

For each key screen identified in Step 4 (or generally, if screens haven't been identified yet):

1. Ask the user to share references they already like — screenshots, URLs, app names
2. For each reference shared, ask: "What specifically do you like about this? The colors? The spacing? The typography? The overall feel?" Extract design principles, not component blueprints.
3. Suggest specific search terms for Mobbin (e.g., "healthcare onboarding", "medical records detail")
4. Recommend looking at 3–5 apps in the same domain
5. Help categorize references by: layout patterns, color approaches, typography styles, interaction models

**Important**: Users may share references from completely different products — a banking app because they love the typography, a game because they love the color palette. Treat all references as aesthetic direction, not component blueprints. The deliverable should capture "from Reference X, take: [specific quality]" — not "replicate Reference X's layout."

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

Save the references document to `design/craft/references/references.md`. Save any collected reference images to the same folder: `design/craft/references/`.

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

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing direction, an unaddressed screen, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent statistics, features, or personas. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

This skill enforces User > Docs > AI at every step:

1. **User's direct input** always overrides everything – their taste, their product, their call
2. **Existing documentation** (MVP Requirements, Information Architecture) informs what screens to focus on
3. **AI suggestions** fill gaps only when user and docs provide no guidance – and are always presented as suggestions, not decisions

---

## What Comes Next

After references are collected, suggest running `ui-figma-guide` to design the key screens in Figma using these references as visual direction. After implementation, suggest `ui-aesthetic-review` to verify the build reflects the stated intent.

---

## Resource Files

- [reference-gathering-guide.md](./references/reference-gathering-guide.md) – Approach to collecting and organizing design references using Mobbin and other tools
- [design-intent-guide.md](./references/design-intent-guide.md) – Full design intent framework: Where Defaults Hide, Intent-First, Domain Exploration, WHY Checkpoint
