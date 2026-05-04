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

This skill is reference-gathering ONLY. It captures real UIs from real products. It is **not** an image-generation skill. In autopilot mode the model has been observed to conflate this skill with `ux-story-panels` (which produces image-generation prompts) and `ui-images` (which produces image-generation prompts for the project's own hero/avatar/decorative images). That conflation produces hallucinated files like `references-image-prompts.md` containing AI-generation prompts intended to "approximate" the references — which is strictly worse than the references themselves and defeats the entire point.

**Forbidden outputs of this skill** (denied at write time by `de-deliverable-path-hook.js`):

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

At the start of this step, run a Bash command to mark the active workflow so the process-recall hook can fire context-appropriately:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "moodboard:exploration" > .design-engineer-plugin/.active-workflow
```

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) establish design intent (who, what, feel), 2) explore the product domain, 3) understand the product context, 4) identify key screens, 5a) propose curated references and open them in Chrome for you to pick, 5b) capture sectional high-quality screenshots of your picks via Playwright, 6) extract design principles from each, 7) run the WHY checkpoint, 8) organize references into a direction document, 9) produce the final deliverable." This is a commitment device – harder to skip steps you just announced. Each step is a separate interaction with AskUserQuestion at each transition. Do not skip steps or compress multiple steps into one. **Important**: If the user has references ready, collect them right after Step 1 (design intent) – before domain exploration. References ground all subsequent decisions in real examples.

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

## Step 5a: Curated reference browser preview

Now that you know the product type (Step 3) and key screens (Step 4), propose curated references that match. Read [curated-references.md](./references/curated-references.md) and filter to the matching product-type category (mobile fintech, web SaaS dashboard, mobile health, etc.). Pick 8–12 references with a one-sentence "watch for" note for each (the curated file already provides these notes).

Then open each reference in a Playwright-controlled browser, sequentially in tabs, so the user can flip through them without losing the assistant's running state. Use the bundled Playwright MCP:

```
mcp__playwright__browser_tabs { action: "new", url: "https://example.com/reference-1" }
mcp__playwright__browser_tabs { action: "new", url: "https://example.com/reference-2" }
# ... repeat for each curated reference (8–12 total)
```

The Playwright browser opens visibly on the user's screen — they can switch to it, scroll, click, and look at each reference exactly as they would in any browser. Keep the tabs open during the whole step so the user can revisit any reference while answering the next question.

Tell the user: "I opened these 8 references in tabs — switch to the Playwright browser window and look at each. Tell me which ones resonate with the design feel you picked in Step 1 (you can pick multiple)."

Then end the preceding chat message with the canonical 3-horizontal-rule spacer (CLAUDE.md rule #6) and call AskUserQuestion (multiSelect: true) listing the 8 references as options. Each option's description is the "watch for" note from the curated file.

After the user picks, ask one more question (with spacer):

- question: "Do you have your own references to add?"
- header: "Add refs"
- options:
  - label: "No, these are good", description: "Proceed with what's selected."
  - label: "Yes, I'll share URLs", description: "I'll paste URLs in my next message and you'll add them."
- multiSelect: false

If "Yes", wait for the user's URLs in plain text. For each URL the user provides, open another Playwright tab (`mcp__playwright__browser_tabs { action: "new", url: "<url>" }`) and add to the chosen list.

**BLOCKING REQUIREMENT**: Wait for the user's full reference selection (curated picks + optional custom URLs) before proceeding to Step 5b.

---

## Step 5b: Sectional Playwright capture

For each chosen URL, capture sectional screenshots using Playwright. Sections beat full-page captures because (a) the model can read each one in detail, (b) the file size is reasonable, (c) we can wait per-section for animation settle.

For each URL:

1. **Resize the viewport** to match the product type from Step 3:
   - Web/Desktop: `mcp__playwright__browser_resize { width: 1440, height: 900 }`
   - Mobile (iOS/Android): `mcp__playwright__browser_resize { width: 414, height: 896 }`

2. **Navigate**: `mcp__playwright__browser_navigate { url: "<chosen-url>" }`

3. **Wait for load + animation settle**: `mcp__playwright__browser_wait_for { time: 3 }` (3 seconds. If a more specific signal exists — e.g., a known visible word — also wait for `text: "<known word>"`).

4. **Scroll to top**: `mcp__playwright__browser_evaluate { function: "() => window.scrollTo(0, 0)" }`

5. **Capture viewport-sized hero** (NOT fullPage): `mcp__playwright__browser_take_screenshot { fullPage: false, filename: ".design-engineer-plugin/design/exploration/references/captures/<reference-slug>/01-hero.png" }`. Ensure the parent dir exists first: `mkdir -p .design-engineer-plugin/design/exploration/references/captures/<reference-slug>`.

6. **Loop sections** until bottom or up to 5 sections:
   - `mcp__playwright__browser_evaluate { function: "() => window.scrollBy(0, 700)" }`
   - `mcp__playwright__browser_wait_for { time: 1 }`
   - `mcp__playwright__browser_take_screenshot { fullPage: false, filename: ".design-engineer-plugin/design/exploration/references/captures/<reference-slug>/02-section.png" }` (incrementing the prefix per section: 02, 03, 04, 05).
   - Stop when the page bottom is reached: detect via `() => window.innerHeight + window.scrollY >= document.body.scrollHeight - 50`.

7. **Save manifest** at `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/manifest.md`:

   ```markdown
   # <Reference name>
   - URL: <url>
   - Viewport: <width>×<height>
   - Captured: <ISO timestamp>
   - Sections: 01-hero.png, 02-section.png, ...
   - Watch for: <"watch for" note from curated-references.md>
   ```

**Quality note on DPR**: Playwright MCP captures at the OS viewport resolution. To get hi-DPR images, the resize command at Step 1 should use a doubled width (e.g., `2880×1800` for desktop or `828×1792` for mobile) — the captured PNG will be at native pixel density. If the captures still look low-resolution after this, document the limitation in the manifest; the sectional + waited approach is still strictly better than the current full-page approach.

**BLOCKING REQUIREMENT**: After all references are captured, present a brief summary to the user (count of references captured, total sections) before proceeding to Step 5 (analysis).

---

## Step 5: Extract design principles from captured references

For each captured reference (curated picks + user-added URLs from Step 5a):

1. Read the manifest.md for the reference (URL, viewport, "watch for" note).
2. View each section PNG (the model has multimodal access — Read each .png file).
3. For each section, ask the user (or note for the deliverable): "What specifically is worth taking from this section? Colors, spacing, typography, the way they handle [observable element]?" Extract design principles, not component blueprints.
4. Aggregate findings per reference: "From <reference> take: [specific quality 1, 2, 3]".

Use the methodology from [reference-gathering-guide.md](./references/reference-gathering-guide.md). Treat all references as aesthetic direction, not component blueprints.

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

Before writing the deliverable, ensure the parent directory exists: run `mkdir -p .design-engineer-plugin/design/exploration/references` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Save the references document to `.design-engineer-plugin/design/exploration/references/references.md`. Save any collected reference images to the same folder: `.design-engineer-plugin/design/exploration/references/`.

The document should include:

- Design intent (the three questions answered)
- Domain exploration outputs (domain, color world, signature, named defaults)
- Product type and context
- List of key screens with visual direction for each
- Reference apps and what to take from each
- The WHY checkpoint (palette, depth, surfaces, typography, spacing with reasoning)
- Overall visual direction summary (2–3 sentences describing the target aesthetic)
- Notes on what NOT to do (anti-patterns and named defaults to avoid)

After the deliverable is saved, clear the active-workflow marker so the process-recall hook stops firing on subsequent casual chat:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

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
