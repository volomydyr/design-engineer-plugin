---
name: dev-prototyping
description: "Generates a single-file HTML prototype directly in Claude Code. One-pass approach: gather context, agree on a brief, generate the interactive prototype, iterate. Use for new products (after planning), new features for existing products, or redesigns. Pulls design context from planning documents or Figma designs."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Dev Prototyping

Generate interactive single-file HTML prototypes directly in Claude Code. One-pass approach: a clickable HTML prototype, generated screen by screen, iterated with the user. Works for new products (after planning docs exist), new features for existing products, or redesigns. Pulls design context from planning documents or Figma designs.

**Important**: No git, no /simplify, no TDD during prototyping. The prototype exists for visual feedback and as a reference for real implementation. Git init, branches, commits, tests, and code quality checks start at `/design-engineer:development`. Prototype HTML can be messy – nobody cares about code quality in a throwaway artifact.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do: "Here's what I'm going to do: 1) ask what you want to prototype (product, landing page, or both), 2) ask the target platform (mobile app, responsive web, desktop web, or both), 3) gather context from your planning docs, 4) list every screen from your IA document for your approval, 5) draft a prototype brief in chat (not a file – the brief lives in the conversation only), 6) build the interactive prototype screen by screen — and for EACH screen, before generating any HTML, walk you through 3–5 open design decisions (input pattern, layout, interactions, copy direction, etc.) with 2–4 specific options per decision so you pick what fits. The MVP requirements are intentionally high-level; the implementation choices are yours, not mine. 7) iterate with you, 8) save the deliverable plus a decisions log."

2. **Conditional teaching**: Ask the user if they are familiar with single-file HTML prototyping. If yes, give a one-sentence refresher. If no, explain: a self-contained HTML file with all CSS and JS inline that lets you click through real screens and interactions – no build tools, no dependencies, just open in a browser.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one screen at a time. After each screen, discuss with the user, get their input, then move to the next. Never dump an entire prototype at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 0.5: Design Grounding Pre-Flight (BLOCKING)

Before generating any HTML for the prototype, you MUST output the Design Grounding block below. The `de-design-grounding-hook` (PreToolUse) will hard-deny your Write/Edit calls on any `.html` file until you have:

1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
4. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/frontend-design/SKILL.md` (Anthropic's bundled frontend-design skill — pick a BOLD aesthetic direction)
5. Confirmed `.design-engineer-plugin/design/exploration/references/references.md` exists (or run `ui-references-moodboard` first)

This is not advisory. The hook returns `permissionDecision: deny` if any prerequisite is missing. Prototypes are throwaway artifacts visually but they must NOT look like AI slop – they set the visual baseline that downstream development inherits.

After the Reads, output this block and fill in EVERY field:

### Design Intent
- **Who is this human**: [a specific person, not "users". Where they are, what's on their mind right now]
- **What verb must they accomplish**: [the actual action, not "use the app"]
- **How should this feel**: [warm like a notebook / cold like a terminal / dense like a trading floor / calm like a reading app / precise like a surgical instrument / playful like a creative tool – NEVER "clean and modern"]
- **Bold aesthetic flavor (frontend-design)**: [pick ONE extreme — brutally minimal / maximalist chaos / retro-futuristic / organic-natural / luxury-refined / playful-toy-like / editorial-magazine / brutalist-raw / art-deco-geometric / soft-pastel / industrial-utilitarian / something specific from the references. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity. NEVER "clean and modern".]
- **Differentiation (the unforgettable thing)**: [the one specific element a tester would describe to a friend — a typography choice, a layout move, a signature interaction, a color decision. If you can't name it, you haven't decided.]

### Domain Exploration
- **Domain words (5+)**: [vocabulary from this product's world]
- **Color world (5+)**: [colors that exist naturally in this product's domain]
- **Signature element (1)**: [one element that could only exist for THIS product]
- **Named defaults (3)**: [obvious choices for this product type that you will NOT do]

### WHY Checkpoint
- **Palette WHY**: [why these colors fit this product's world]
- **Depth WHY**: [borders / shadows / layered – and why this fits the intent]
- **Surfaces WHY**: [elevation scale and why this color temperature]
- **Typography WHY**: [typeface and why it fits – NOT Inter/SF Pro/Roboto/Lato/Montserrat unless stated WHY]
- **Spacing WHY**: [base unit and what it says about density]
- **Token names WHY**: [`--ink`, `--parchment`, `--scrub-teal` – NOT `--gray-700`, `--surface-2`, `--primary`]

### Anti-pattern self-check
For each, state PASS or how I am avoiding:
- [ ] Cream/beige background + orange CTA combo
- [ ] 3D Apple/Google emoji as character illustration or hero
- [ ] Flag emoji or any emoji as avatars
- [ ] Pill chips with leading emoji
- [ ] Generic CTA copy ("Get started", "Join this event", "Learn more")
- [ ] Inter / SF Pro / Roboto / Lato / Montserrat without stated WHY
- [ ] Generic token names (`--gray-N`, `--surface-N`, `--primary`)
- [ ] Cards nested in cards
- [ ] Identical card grids
- [ ] Glassmorphism / blur effects as decoration
- [ ] Centering everything
- [ ] Default drop shadows
- [ ] Gradient text on headings
- [ ] Purple-blue gradients / cyan-on-dark / neon accents

### Signature Test
List 5 specific places where the design intent manifests:
1. [specific element + why it expresses the intent]
2. ...
3. ...
4. ...
5. ...

If you cannot fill all 5 with concrete components, the signature does not exist – STOP and rework before any Write.

### Deliverable Anchors (BLOCKING)

Every Pre-Flight field above must trace back to a real deliverable from the discovery and planning phases. The whole point of running `/design-engineer:discovery` first is so the prototype reflects what was decided. If the prototype generates from scratch, the discovery output was thrown away.

Fill in EVERY anchor below. If the field has no upstream deliverable, STOP and ask the user before generating — never guess. Cite the source file and the specific line / section the field came from.

- **Who is this human**: ← from `.design-engineer-plugin/design/foundation/problem-statement.md` and/or `target-audience.md`. Quote the relevant sentence.
- **What verb must they accomplish**: ← from `problem-statement.md` (the user's actual goal) and/or `mvp-requirements.md` (the priority feature this prototype demonstrates).
- **How should this feel**: ← from `.design-engineer-plugin/design/exploration/references.md` (Design Feel section). Use the EXACT feeling words from references.md, not paraphrased.
- **Bold aesthetic flavor**: ← from `references.md` Design Direction synthesis (the direction document built in `ui-references-moodboard` Step 7). If references.md doesn't name a flavor, ASK the user before picking one.
- **Differentiation**: ← from `references.md` Signature element + the Domain Exploration outputs.
- **Palette WHY**: ← from `references.md` Color World (5+ colors from the product's domain). Use those colors. Do NOT invent a palette.
- **Typography WHY**: ← from `references.md` Typography section. Do NOT default to Inter / SF Pro / Roboto / Lato / Montserrat unless `references.md` names one with stated reasoning.
- **Token names WHY**: ← from `references.md` token suggestions, OR derived from the Domain words in references.md. Names like `--ink`, `--scrub-teal` not `--gray-700`.
- **Screens covered**: ← from `.design-engineer-plugin/design/planning/information-architecture.md`. The prototype's screen list MUST be the IA's screen list. Do not add screens the IA doesn't have. Do not skip screens the IA marks as primary.
- **Priority features**: ← from `.design-engineer-plugin/design/planning/mvp-requirements.md` (must-have features only — not nice-to-haves, not creative additions).
- **Bias / psychology to apply**: ← from `.design-engineer-plugin/design/exploration/bias-audit.md` (priority actions section) and `.design-engineer-plugin/design/psychology/*.md` if present. List 3+ specific UI moves the prototype must implement.

If any of these deliverables exist but you have not yet Read them, the design-grounding hook will deny your HTML write. The hook checks every existing `.md` file under `.design-engineer-plugin/design/{foundation,research,planning,exploration,psychology,reviews,dev,features}/` and requires it to have been Read this session.

If a deliverable does NOT exist (e.g. the user is in autopilot and skipped bias-audit), that field is "n/a — not produced upstream" — but you MUST surface that gap to the user via AskUserQuestion before generating, asking whether to (a) run the missing skill first, (b) ask the user to provide that input directly in chat, or (c) proceed without it and accept the reduced quality.

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

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 1.5.

---

## Step 1.5: Target platform

```
question: "What is the target platform for this prototype?"
header: "Target platform"
options:
  - label: "Mobile app"
    description: "Single phone-width layout (375–414px primary viewport). Native iOS/Android-style UI."
  - label: "Responsive web"
    description: "Full-width layout that adapts from desktop down to mobile. Fills the viewport at every size."
  - label: "Desktop web"
    description: "Fixed-width layout for desktop browsers (≥1024px primary viewport). No mobile adaptation required."
  - label: "Both mobile and web"
    description: "Generate two separate sets of screens – a mobile-app version AND a responsive-web version. They are not mixed in one layout."
```

```
multiSelect: false
```

This answer carries forward into the Step 4 prototype brief and governs how Step 5 generates layouts. The answer is binding – the prototype MUST reflect the chosen platform without exception. See the Step 5 hard rule for what each choice means in practice.

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Gather context (READ every existing deliverable)

This step is the structural fix for "the prototype doesn't follow the deliverables." Run a Glob first to enumerate every `.md` file under `.design-engineer-plugin/design/`. Then Read EVERY one of them — not just the headline ones — before drafting the brief. The design-grounding hook will deny HTML writes later if any of these reads are missing.

Run:

```
Glob: .design-engineer-plugin/design/**/*.md
```

For every path the Glob returns, call `Read`. The full set typically includes (each one is conditional on it existing in the project):

- `design/foundation/problem-statement.md` — who the human is, what they're trying to do
- `design/foundation/target-audience.md` — segments, personas
- `design/foundation/storybrand.md` — narrative voice, copy direction
- `design/foundation/business-plan.md` — constraints, monetization signals that affect IA
- `design/foundation/assumptions.md` — what's been validated vs. what's still hypothesis
- `design/research/competitor-analysis.md` — patterns to inherit, patterns to avoid
- `design/research/research-findings.md` — user evidence
- `design/planning/information-architecture.md` — the screen inventory the prototype MUST implement
- `design/planning/mvp-requirements.md` — the priority features the prototype MUST cover
- `design/exploration/references.md` — design intent, palette, typography, signature, named defaults
- `design/exploration/bias-audit.md` — UI moves the prototype must apply
- `design/exploration/customer-journey-map.md` — emotional arc to reflect in the design
- `design/exploration/behavior-map.md` — interaction patterns to support
- `design/exploration/ethics-review.md` — patterns to avoid
- `design/psychology/*.md` — any psychology scan outputs
- `design/dev/design-system.md` — tokens, semantic colors, components if the project has them

Read each one in full. Do NOT skim. Do NOT summarize from memory. The hook will check the transcript for actual `Read` calls.

After reading, present a structured summary that quotes from the deliverables (not paraphrases):

> **Anchored summary from deliverables:**
> - **Who** (from problem-statement.md): "<exact quote>"
> - **Goal** (from problem-statement.md / mvp-requirements.md): "<exact quote>"
> - **Design feel** (from references.md): "<exact words from references>"
> - **Bold aesthetic flavor** (from references.md, if present): "<flavor>" or "not stated upstream — needs to be picked"
> - **Palette** (from references.md): [color list]
> - **Typography** (from references.md): [typeface]
> - **Screens** (from information-architecture.md): [exact ordered list]
> - **Priority features** (from mvp-requirements.md): [must-haves only]
> - **Bias / psychology recommendations** (from bias-audit.md and psychology/*.md): [specific UI moves]

If a deliverable is missing entirely (e.g. the user skipped `ui-references-moodboard` and there is no `references.md`), STOP — the prototype will look generic without it. Use AskUserQuestion to ask the user whether to (a) run the missing skill now, (b) provide the input directly in chat as a substitute, or (c) proceed without it and accept the quality drop. Never silently fabricate a substitute.

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

**This step is chat-only — DO NOT write a `brief.md` file.** The brief is a synthesis you present to the user in conversation. Step 5 (interactive prototype) is the only file-producing step in this flow.

Synthesize all gathered context into a prototype brief:

- **Target platform**: The choice from Step 1.5 (Mobile app / Responsive web / Desktop web / Both). Repeat this verbatim – do not paraphrase or downgrade it.
- **Design intent**: How the product should look and feel (warm, clinical, playful, dense, etc.)
- **Key screens**: The approved list from Step 3
- **Priority features**: What interactions must work (vs. what can be placeholder)
- **Navigation model**: How screens connect to each other
- **Styling approach**: Token source (planning docs, Figma, or starter values), color palette, typography, spacing scale

Present the brief to the user:

> **Prototype brief**
>
> **Target platform:** [verbatim from Step 1.5]
> **Design intent:** [summary]
> **Screens:** [numbered list from Step 3]
> **Priority features:** [list with must-have vs. nice-to-have]
> **Navigation:** [model]
> **Styling:** [source and key values]

```
question: "Does this brief look correct?"
header: "Brief review"
options:
  - label: "Looks good – start building the prototype"
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

## Step 5: Generate the interactive prototype

Build the prototype as a single self-contained HTML file. No two-step storyboard-then-interactive split — direct from the approved brief to the clickable prototype, generated screen by screen.

**The hard rule of this step**: MVP requirements are HIGH-LEVEL. They name what the user can do, not how the screen executes it. "Allow the user to schedule a session" is the requirement; "calendar grid vs natural-language input vs preset time slots vs continuous availability bar" is the implementation choice. The model does NOT get to silently pick implementation choices on the user's behalf — for every screen, every consequential open decision must be surfaced as 2–4 named options with trade-offs, and the user picks. This is the design-discussion phase the prototype lives or dies on.

At the start of this step, run a Bash command to mark the active workflow so the process-recall hook can fire context-appropriately:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "prototype:interactive" > .design-engineer-plugin/.active-workflow
```

### Per-screen design dialogue (BLOCKING — runs BEFORE generating any HTML for the screen)

For EVERY screen in the IA, run this sequence before writing or editing the HTML for that screen. No exceptions. The prototype is built one screen at a time, and each screen gets its own dialogue cycle.

#### Step 5.1 — Surface upstream context

Quote, in chat, what the existing deliverables say about THIS screen. No paraphrasing — exact phrases.

> ### Screen N: <name from IA>
>
> **From `information-architecture.md`** ("<exact section / line>"):
> - Position in the flow: <exact phrase>
> - Navigation in / out: <exact phrase>
>
> **From `mvp-requirements.md`** ("<exact must-have>"):
> - The high-level requirement(s) this screen serves: <quote>
>
> **From `references.md`** (the design intent / palette / typography / flavor that applies to this screen): <quote>
>
> **From `bias-audit.md`** (any UI moves that affect this screen): <quote, if any>

If the upstream deliverables don't say anything about this screen, STOP — the prototype cannot proceed without grounding. Use AskUserQuestion to ask the user whether to (a) update `information-architecture.md` first to add this screen, (b) provide the missing input directly in chat, or (c) skip this screen for now.

#### Step 5.2 — List 3–5 open implementation decisions for this screen

The MVP requirement says WHAT the user does on this screen. The implementation decisions are HOW. Identify 3–5 of the most consequential open decisions for THIS screen (do not exceed 5; over-elaboration is its own failure mode). Pick from these decision categories — these are the categories where defaults silently win:

- **Input pattern** — how the user provides data (form fields / smart input / preset chooser / direct manipulation / voice / drag-drop / sliders)
- **Layout pattern** — how the screen is organised (single column / split view / hub-and-spoke / stacked cards / sticky panel + scrolling content / overlapping zones / asymmetric grid)
- **Primary interaction pattern** — how the main action is invoked (full-screen flow / modal / drawer / inline expand / new page / wizard / single-tap)
- **Information density** — how much the user sees at once (rich/dense / minimal/spaced / progressive disclosure)
- **Hierarchy move** — what dominates the screen (the action / the data / the navigation / the system status)
- **Copy direction** — how copy speaks (literal/instructional / conversational / branded-and-specific / terse-utility)
- **State handling** — how loading / error / empty states are surfaced (full-screen / inline / toast / skeleton / no state — assume always populated)
- **Navigation affordance** — how the user knows where they can go next (visible always / on hover / on focus / contextual cue / ambient hint)

Pick the 3–5 decisions that, if defaulted, would most damage the screen's distinctiveness given the chosen aesthetic flavor (Step 0.5). For a screen with a brutalist flavor, layout pattern and density matter more than copy direction. For an editorial flavor, hierarchy and copy direction dominate. Adjust the decision list per screen — do NOT mechanically pick the same 5 for every screen.

#### Step 5.3 — For each open decision, ask the user via AskUserQuestion

For each of the 3–5 decisions, run an AskUserQuestion with 2–4 named options. Each option's description must be a one-sentence trade-off summary, not a label. Reference concrete products / patterns when useful.

Format (canonical 3-line spacer per CLAUDE.md rule #6 before each call):

```
question: "Decision N of M for <screen name> — <decision category>: <plain-language framing of the choice>"
header: "<screen>: <decision>"
options:
  - label: "<option 1 short label>"
    description: "<concrete pattern + 1-sentence trade-off — e.g. 'Calendar grid like Notion's date picker. Best when most users pick a specific day. Heavier on the screen.'>"
  - label: "<option 2 short label>"
    description: "<...>"
  - label: "<option 3 short label, optional>"
    description: "<...>"
  - label: "Other (I'll describe in chat)"
    description: "None of the above fits — I have a specific direction in mind."
multiSelect: false
```

Include "Other (I'll describe in chat)" as the LAST option on EVERY decision question — the user must always have an escape hatch. Never present 4 options without an Other.

Wait for the user's answer on each decision before asking the next. Do NOT batch multiple decisions into one AskUserQuestion. Do NOT skip ahead and start generating HTML before all decisions for this screen are answered. The dialogue is the work; the HTML is the artifact of the dialogue.

#### Step 5.4 — Persist the decisions to the decisions log

After all decisions for this screen are answered, append to `.design-engineer-plugin/prototype/decisions.md` (create the file with a header on first screen). Format:

```markdown
## Screen N: <screen name>

Source: `information-architecture.md` (Screen N), `mvp-requirements.md` (<requirement>)

- **<decision category>**: chose <option> over <alternatives>. Reason: <user's reasoning, or "user preference / no reason given" if none stated>.
- **<decision category>**: chose <option> over <alternatives>. Reason: <...>.
- ...
```

This file is a durable deliverable, committed alongside `prototype.html`. It exists so a future session (or a new collaborator) can understand WHY the prototype looks the way it does — the decisions log is the "minutes" of the design dialogue.

#### Step 5.5 — Generate the screen HTML with the user's decisions baked in

Only now write the HTML for this screen. Apply the user's decisions exactly as chosen — do NOT silently substitute a different pattern, do NOT add extra decisions you didn't ask about. The Source Anchors block (Step 5 step 9 below) must reference the decisions.md entries for this screen, not the model's own framing.

If during generation you discover a sub-decision the dialogue didn't cover (e.g. "the user picked 'preset chooser' but we didn't decide whether the chooser is horizontal or vertical"), STOP and ask the user before proceeding. Never silently default sub-decisions either.

---

### How to generate

1. Write a single HTML file with all CSS in `<style>` and all JS in `<script>`. No external dependencies.
2. Apply design tokens from the context gathered in Step 2 – not generic Bootstrap-like styling. Use CSS custom properties for all design tokens (colors, spacing, typography, radii, shadows) in `:root {}`. Token names must evoke the product's world (`--ink`, `--parchment`, `--scrub-teal`) – never generic (`--gray-700`, `--surface-2`, `--primary`).
3. **Apply the bold aesthetic flavor** named in the Step 0.5 Pre-Flight Intent block. The flavor is binding — every typography, color, motion, layout decision should be a precise execution of that direction. Bold maximalism AND refined minimalism both pass; "safe and inoffensive" doesn't.
4. **Target-platform layout rule (HARD)**: read the Target platform field from the Step 4 brief and apply it without exception:
   - **Mobile app**: design at mobile viewport (375–414px). The HTML body itself fills the viewport at mobile widths. Do NOT wrap the UI in a desktop-shaped container.
   - **Responsive web**: layouts MUST fill the viewport at every breakpoint. NEVER wrap content in a centered phone-shaped container, NEVER apply `max-width: 414px` / `375px` / similar mobile-frame constraints to the page body, NEVER add a "fake-iphone" CSS chrome around the UI. Use grid/flex layouts that breathe across desktop, tablet, mobile.
   - **Desktop web**: full-bleed desktop layout (≥1024px primary viewport). No mobile adaptation required. Same prohibition as Responsive web on mobile-frame wrappers.
   - **Both mobile and web**: generate TWO separate sets of screens – one mobile-viewport set AND one full-width responsive set. NEVER mix them in one layout (no "mobile-mockup-floating-in-desktop-canvas" pattern). Save them to separate filenames if needed.
5. **Image-slot rule**: BEFORE generating any `<img src="...">` tag, gradient placeholder, emoji-stamped SVG, or random Pexels/Unsplash link, invoke the `ui-images` skill. The skill builds an image manifest, decides per-image whether to generate or stock-fetch, produces strong search queries or detailed AI-generation prompts, and lays out destination folders. This is mandatory whenever the screen has a hero, illustration, photo background, product mockup, avatar, or any other image slot. Do not skip – this is what prevents the gray-gradient + emoji slop default.
6. Add interactivity from the start: functional navigation between screens, buttons that do things, forms that respond, state transitions. The prototype is clickable on the first present, not a static mockup that becomes interactive later.
7. Cover all key user flows from the brief – every screen, every navigation path. Handle main states: default, active, hover, selected. Skip loading/error/empty states unless specifically requested.
8. Generate one screen at a time. Before presenting each screen, read [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) and self-review: does this screen have any of the 14+ listed anti-patterns? Pay special attention to "Mobile mockup floating in desktop frame" if the target is Responsive or Desktop web, and to the hard-banned typefaces (Inter / SF Pro / Roboto / Lato / Montserrat) and token names (`--gray-N`, `--surface-N`, `--primary`). If you find any, fix before presenting.
9. **Per-screen Source Anchors (BLOCKING)**: when presenting each screen to the user, the chat message MUST include a "Source Anchors" block showing which deliverables AND which user-chosen design decisions informed this screen. Format:

   ```
   Screen: <screen name from IA>
   Source Anchors:
   - Layout: from decisions.md (chose "<option>" over "<alternatives>") + references.md ("<exact quote>")
   - Input pattern: from decisions.md (chose "<option>" over "<alternatives>")
   - Primary interaction: from decisions.md (chose "<option>")
   - Copy direction: from decisions.md (chose "<option>") + storybrand.md ("<exact voice quote>")
   - Palette: from references.md ("<exact color description>")
   - Typography: from references.md ("<exact typeface>")
   - Bias / psychology applied: from bias-audit.md ("<exact recommendation>") and how this screen implements it
   - IA position: from information-architecture.md (Screen <N> of <total>, navigation context)
   - MVP requirement served: from mvp-requirements.md ("<exact requirement>")
   ```

   Every line must trace to either a deliverable file or a `decisions.md` entry created by the per-screen design dialogue (Step 5.1–5.5). If a screen has no anchor for a section, that section is forbidden — STOP and ASK the user before generating a layout / copy / token choice that has no upstream basis. The prototype is an EXECUTION of the deliverables and the user's design decisions, not a parallel creation.

10. Present each screen to the user, one at a time, with the Source Anchors block above the rendered HTML. Discuss, get feedback, iterate on that screen before moving to the next.

### File location

Save to: `.design-engineer-plugin/prototype/prototype.html`

Create the directory if it does not exist. The prototype is a single file — there is no separate `storyboard.html` file (that two-step flow was removed in v6.1.0 because it produced confusing intermediate output without improving the final prototype).

**BLOCKING REQUIREMENT**: Wait for the user to review and approve each screen before generating the next.

---

## Step 6: Iterate with user

This is the core of the prototyping process. Expect many rounds of refinement.

### No background continuation during feedback waits

After presenting an iteration to the user, you MUST WAIT for their next message. Do NOT call `ScheduleWakeup`. Do NOT call `RemoteTrigger`. Do NOT call `CronCreate`. Do NOT enter `/loop` (any variant — auto, dynamic, autonomous). Do NOT spawn a `Task` agent with `run_in_background: true`. Do NOT start a `Bash` command with `run_in_background: true` that fires a wakeup. The user's input window is not a polling target — the conversation is the polling mechanism. The next user message is the signal.

The forbidden tools list for this step: `ScheduleWakeup`, `CronCreate`, `RemoteTrigger`, the `/loop` skill (and any of its variants), any background `Task` or `Bash` invocation that schedules a follow-up. The only allowed action between assistant turns during feedback wait is silence.

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

## Step 7: Save deliverables

After saving the deliverables below, clear the active-workflow marker so the process-recall hook stops firing on subsequent casual chat:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

Save three files:

### 1. Final prototype

Ensure `.design-engineer-plugin/prototype/prototype.html` is the latest version with all iterations applied.

### 2. Decisions log

Ensure `.design-engineer-plugin/prototype/decisions.md` reflects every per-screen design decision the user made during the dialogue (Step 5.1–5.5). This file should already exist from the per-screen dialogue protocol — Step 7 is just confirming it's complete. If a screen's decisions are missing, that's a bug — go back and fill them in before saving.

### 3. Prototype notes

Save `.design-engineer-plugin/prototype/prototype-notes.md` with:

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
- **If the prototype needs production implementation**: suggest the development pipeline via `/design-engineer:development`

---

## Resource Files

- [prototyping-workflow.md](./references/prototyping-workflow.md) – Iteration methodology for AI-generated prototypes
- [starter-values.md](../ui-design-system/references/starter-values.md) – CSS token baseline when no existing design system is detected
- [anti-patterns.md](../ui-aesthetic-review/references/anti-patterns.md) – Design anti-patterns to check against before presenting screens
- [anti-slop-writing.md](../shared-references/anti-slop-writing.md) – Writing quality rules for all text output

---

## Lifecycle relationship: prototype vs. component gallery

Prototype and component gallery sit at different points in the product lifecycle – do not conflate them:

- **Prototype** is for design exploration *before* implementation. Throwaway HTML, no component-reuse rules, free to inline styles, free to fake interactivity. Lives at `.design-engineer-plugin/prototype/prototype.html`. Goal: validate the design intent quickly.
- **Component gallery** is for shipped components *after* implementation. Real imports from production paths, real production styles, contract-bound (no duplicates, no inline styles, variants via component API only). Path determined by the project's stack via `skills/dev-component-gallery/`. Goal: visual QA + redundancy detection on what's actually in the codebase.

Don't move prototype HTML into the gallery. Don't write gallery entries in prototype style. The two artifacts have opposite rules because they serve opposite purposes.
