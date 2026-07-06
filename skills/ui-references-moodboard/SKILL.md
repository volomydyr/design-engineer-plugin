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

## What this skill DOES NOT produce

This skill is reference-gathering ONLY. It captures real UIs from real products. It is **not** an image-generation skill. Without explicit scope guardrails, the model may conflate this skill with `ux-story-panels` (which produces image-generation prompts) and `ui-images` (which produces image-generation prompts for the project's own hero/avatar/decorative images). That conflation produces hallucinated files like `references-image-prompts.md` containing AI-generation prompts intended to "approximate" the references — which is strictly worse than the references themselves and defeats the entire point.

**Forbidden outputs of this skill** (never write any of these):

- `references-image-prompts.md` — does not exist; do not invent it.
- Any `.md` file describing AI-generation prompts for the references. The references ARE the screenshots.
- Any invocation of `ui-images` from inside this skill. `ui-images` is for the project's own images (hero shot, avatars, etc.), not for "approximating" external references.
- Any invocation of `ux-story-panels` from inside this skill. Story panels are a separate Phase 2 deliverable; they don't belong inside reference gathering.

**The only files this skill writes:**

- `.design-engineer-plugin/design/exploration/references/references.md` — the synthesis document with design intent, "from app X take quality Y" notes, and what to reuse vs. what to avoid.
- `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/<NN>-<section>.png` — viewport-sized Playwright captures of real UIs.
- `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/manifest.md` — per-reference manifest (URL, viewport, "watch for" note).

Anything else is a hallucination. Re-read the steps below if unsure.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) establish design intent (who, what, feel), 2) explore the product domain, 3) understand the product context, 4) identify key screens, 5a) propose curated references and open them in Chrome for you to pick, 5b) capture sectional high-quality screenshots of your picks via Playwright, 6) extract design principles from each, 7) run the WHY checkpoint, 8) organize references into a direction document, 9) produce the final deliverable." This is a commitment device – harder to skip steps you just announced. Each step is a separate interaction with AskUserQuestion at each transition. Do not skip steps or compress multiple steps into one. **Important**: If the user has references ready, collect them right after Step 1 (design intent) – before domain exploration. References ground all subsequent decisions in real examples.

2. **Conditional teaching**: Ask the user if they are familiar with design intent and why it matters before collecting references. If yes, give a one-sentence refresher. If no, explain it in simple terms with a concrete example tied to their product idea. Use the "Why This Matters" section above as a starting point, but make it conversational and product-specific.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


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

Before answering the three intent questions below, Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/frontend-design/SKILL.md` (Anthropic's bundled frontend-design skill). It frames the bold-aesthetic-direction prompt that complements the "feeling words" question. The flavor names it offers — brutally minimal, maximalist chaos, retro-futuristic, organic-natural, luxury-refined, playful-toy-like, editorial-magazine, brutalist-raw, art-deco-geometric, soft-pastel, industrial-utilitarian — extend the "feeling words" vocabulary into named aesthetic directions a designer can actually execute. Always do this Read before establishing intent, so the bold-aesthetic vocabulary is grounded in the bundled skill rather than invented.

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

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to the bold-aesthetic-flavor question below.

After the user picks a feel, ask them to commit to a **bold aesthetic flavor** — a named direction beyond the feeling word. There are 9 flavors, so run this as two AskUserQuestion rounds: first the flavor family, then the specific flavor within it. Before each round, end the preceding chat message with the canonical spacer: three lines of ─ characters.

**Round 1 – flavor family:**

```
question: "Pick a bold aesthetic direction for this product. Bold maximalism and refined minimalism both work — the goal is intentionality, not intensity. Which family fits?"
header: "Aesthetic family"
options:
  - label: "Stripped and precise"
    description: "Minimal, raw, or machine-like. The product IS the content."
  - label: "Dense and expressive"
    description: "Layered, loud, art-directed. Editorial or maximalist energy."
  - label: "Refined and warm"
    description: "Quiet confidence or material honesty. Whitespace, texture, earth tones."
  - label: "Character and era"
    description: "A named personality or period. Playful charm or retro-futuristic worlds."
```

```
multiSelect: false
```

**Round 2 – specific flavor** (present the options for the chosen family):

- **Stripped and precise**:
  - "Brutally minimal" – Stripped to essentials. Hard edges. No decoration. The product IS the content.
  - "Brutalist / raw" – Exposed structure. Default browser styles riffed on. Stark, unpolished, intentional roughness.
  - "Industrial / utilitarian" – Machinery aesthetic. Monospace, gridded data, technical readouts. Precision over warmth.
- **Dense and expressive**:
  - "Maximalist chaos" – Dense, layered, expressive. Multiple typefaces, overlapping elements, controlled-but-loud.
  - "Editorial / magazine" – Long-form layout language. Pull quotes, marginalia, asymmetric grids, art-directed compositions.
- **Refined and warm**:
  - "Luxury / refined" – Generous whitespace. Subtle motion. Considered typography. Quiet confidence over loud claims.
  - "Organic / natural" – Hand-feel, paper-feel, irregular shapes, earth-tone palettes, materially honest surfaces.
- **Character and era**:
  - "Retro-futuristic" – Period-specific aesthetic (90s web, 80s synthwave, 60s sci-fi, etc.). Pick the era explicitly.
  - "Playful / toy-like" – Soft shapes, candy colors, joyful motion. Personality forward, polish in service of charm.

```
multiSelect: false
```

If none of the flavors fits, the user can describe their own direction via the built-in Other free-text option in either round.

The chosen flavor MUST appear in the final `references.md` under a "Bold aesthetic flavor" section, alongside the design feel. Downstream skills (`dev-prototyping`, `ui-landing-page`) read this field as a binding constraint — every prototype / landing page screen must be a precise execution of the flavor.

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

This is a pick-many list of 7 – too many for AskUserQuestion (4-option cap). Present it as a numbered list in chat and ask the user to reply with comma-separated numbers (e.g. "1, 2, 5"):

Which screens are most critical for establishing your visual direction?

1. **Onboarding / Welcome** – first impression and sign-up flow
2. **Home / Dashboard** – main screen users see after login
3. **Primary action screen** – the core feature users come for
4. **Detail / Content view** – how individual items or records are displayed
5. **Navigation structure** – bottom tabs, sidebar, or drawer patterns
6. **Forms / Input screens** – how users enter or edit data
7. **Settings / Profile** – account management and preferences

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 5.

---

## Step 5a: Curated reference browser preview

Now that you know the product type (Step 3) and key screens (Step 4), propose curated references that match. Read [curated-references.md](./references/curated-references.md) and filter to the matching product-type category (mobile fintech, web SaaS dashboard, mobile health, etc.). Pick 8–12 references with a one-sentence "watch for" note for each (the curated file already provides these notes).

Then open each reference in a Playwright-controlled browser, sequentially in tabs, so the user can flip through them without losing the assistant's running state. Use the Playwright `browser_tabs` tool. Playwright tool ids carry a server prefix – `mcp__plugin_design-engineer_playwright__<tool>` for the plugin's bundled server, or `mcp__playwright__<tool>` if the project has its own Playwright MCP; use whichever appears in your tool list.

```
browser_tabs { action: "new", url: "https://example.com/reference-1" }
browser_tabs { action: "new", url: "https://example.com/reference-2" }
# ... repeat for each curated reference (8–12 total)
```

The Playwright browser opens visibly on the user's screen — they can switch to it, scroll, click, and look at each reference exactly as they would in any browser. Keep the tabs open during the whole step so the user can revisit any reference while answering the next question.

Tell the user: "I opened these 8 references in tabs — switch to the Playwright browser window and look at each. Tell me which ones resonate with the design feel you picked in Step 1 (you can pick multiple)."

This is a pick-many list of 8 – too many for AskUserQuestion (4-option cap). Present the references as a numbered list in chat, each with the "watch for" note from the curated file as its description, and ask the user to reply with comma-separated numbers (e.g. "1, 4, 7").

After the user picks, ask one more question (with spacer):

- question: "Do you have your own references to add?"
- header: "Add refs"
- options:
  - label: "No, these are good", description: "Proceed with what's selected."
  - label: "Yes, I'll share URLs", description: "I'll paste URLs in my next message and you'll add them."
- multiSelect: false

If "Yes", wait for the user's URLs in plain text. For each URL the user provides, open another Playwright tab (`browser_tabs { action: "new", url: "<url>" }`) and add to the chosen list.

**BLOCKING REQUIREMENT**: Wait for the user's full reference selection (curated picks + optional custom URLs) before proceeding to Step 5b.

---

## Step 5b: Sectional Playwright capture

For each chosen URL (curated picks + user-added URLs), capture sectional screenshots using the bundled Playwright MCP, following the per-URL recipe in [capture-recipe.md](./references/capture-recipe.md): resize the viewport to the product type, navigate, wait for animation settle, run the bot-block check, then capture a viewport-sized hero plus up to 5 scrolled sections and save a manifest per reference.

**BLOCKING REQUIREMENT**: After all references are captured, present a brief summary to the user (count of references captured, total sections) before proceeding to Step 6 (analysis).

---

## Step 6: Extract design principles from captured references

For each captured reference (curated picks + user-added URLs from Step 5a):

1. Read the manifest.md for the reference (URL, viewport, "watch for" note).
2. View each section PNG (the model has multimodal access — Read each .png file).
3. For each section, ask the user (or note for the deliverable): "What specifically is worth taking from this section? Colors, spacing, typography, the way they handle [observable element]?" Extract design principles, not component blueprints.
4. Aggregate findings per reference: "From <reference> take: [specific quality 1, 2, 3]".

Use the methodology from [reference-gathering-guide.md](./references/reference-gathering-guide.md). Treat all references as aesthetic direction, not component blueprints.

---

## Step 7: State your WHY checkpoint

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

## Step 8: Organize references into a direction document

Help the user compile their references into a structured document. For each key screen:

- Which reference apps inspired the direction
- Specific patterns to adopt (e.g., "card-based layout like App X", "bottom sheet navigation like App Y")
- Color direction informed by the domain color world exploration
- Typography feel tied to the stated design intent
- Interaction patterns worth replicating
- The signature element and where it appears

---

## Step 9: Produce the deliverable

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/exploration/references` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the references document to `.design-engineer-plugin/design/exploration/references/references.md`. Save any collected reference images to the same folder: `.design-engineer-plugin/design/exploration/references/`.

The document should include:

- Design intent (the three questions answered)
- **Bold aesthetic flavor** (the named direction picked in Step 1, e.g. "Editorial / magazine" or "Brutally minimal") — this is a binding constraint for downstream prototyping and landing-page skills
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

This deliverable (`.design-engineer-plugin/design/exploration/references/references.md`) is also the intent source for per-screen design specs. The `design-spec` skill points each spec's `intent_reference` back into this file – the design feel, the bold aesthetic flavor, and the "from app X take quality Y" notes – so the spec's intent traces to the direction agreed here.

---

## Resource Files

- [reference-gathering-guide.md](./references/reference-gathering-guide.md) – Approach to collecting and organizing design references using Mobbin and other tools
- [design-intent-guide.md](./references/design-intent-guide.md) – Full design intent framework: Where Defaults Hide, Intent-First, Domain Exploration, WHY Checkpoint
- [capture-recipe.md](./references/capture-recipe.md) – Per-URL Playwright sectional capture recipe: viewport sizing, bot-block check, hero + scrolled sections, manifest
