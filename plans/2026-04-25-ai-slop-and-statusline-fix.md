# Fix: AI-slop UI output + status-line phase indicator removal + lag-doc note

## Context

A beta tester ran the full pipeline and got back the screenshot in [Image #48] — a mobile event-detail screen with **every fingerprint of generic AI-generated UI**: cream/beige background + orange CTA + 3D Apple-emoji surfer character as illustration + flag-emoji "avatars" + pill-chip-with-emoji components + generic "Join this event" CTA copy. Every single one of these patterns is in the plugin's domain (anti-patterns + anti-slop) but **the plugin's design knowledge never reached the code-generation phase**.

Grep confirmed the architectural gap:
- `commands/de/dev.md` references **zero** design knowledge files (no anti-patterns, no anti-slop, no design-intent-guide, no references.md, no critique-framework).
- `agents/frontend-implementer.md` references **zero** design knowledge files.
- `skills/dev-prototyping/SKILL.md` references the design files but only in a soft "self-review before presenting" gate — easy for the model to skim past.
- The 4 named tests (Swap, Squint, Signature, Token) and the AI Slop Test from `critique-framework.md` are **never invoked as gates anywhere**.
- The WHY Checkpoint in `design-intent-guide.md` is described as "mandatory" in prose, but no code or hook enforces it.
- `anti-patterns.md` is dashboard/SaaS-heavy. The 2026 mobile-app slop the screenshot exposes (cream + orange + 3D emoji + flag avatars + emoji pill chips) is **not in the catalog**.

Re-grounded in Anthropic's docs, the only deterministic enforcement primitives are:
- **PreToolUse hook with `permissionDecision: "deny"`** (HARD block — write does not happen).
- **`additionalContext`** is advisory ("added discretely... no guarantee the model will treat it as authoritative").
- **`PostToolUse decision: "block"`** is advisory (the tool already ran; the hook just feeds back to the model).
- **Subagent `skills:` field** preloads skill content into agent context — but **cannot preload skills with `disable-model-invocation: true`** (which every skill in this plugin sets per CLAUDE.md). So preloading via that field is structurally blocked by the plugin's own conventions.

The skills doc explicitly says: *"If a skill seems to stop influencing behavior… use hooks to enforce behavior deterministically."* That is exactly the path here.

This plan fixes 4 issues bundled (since the dependency files all overlap):

- **Issue 4 (the critical one)** — AI-slop output. Solution: PreToolUse hook gate + inlined rules in agent/skill/command files + 2026 catalog refresh + tight prototype→dev coupling + post-UI aesthetic audit.
- **Issue 2** — phase indicator stuck/dead. Solution: remove the segment from status line and update related docs.
- **Issue 1** — status-line lag during long tool calls. Solution: doc note explaining Claude Code's update model.
- **Issue 3** — Expo question. Confirmed not a bug (Claude choosing tech stacks based on product type, no plugin-specific Expo training exists). No code change.

## Architectural decisions

- **Inline rules into agent/skill/command files instead of using subagent skill preloading.** The `skills:` preload field would be cleanest but is blocked by `disable-model-invocation: true` (a plugin-wide convention with real reasons — skills are command-orchestrated, not auto-loaded). Inlining the operating procedure into the agent's own markdown gets the same effect without violating the plugin's skill philosophy: agent files are loaded as system prompts when the agent is invoked, so anything inlined there is guaranteed in context.
- **Use `PreToolUse` deny as the enforcement primitive.** This is the only HARD block per the docs. The hook scans `transcript_path` to verify required Reads happened, checks for `references.md` on disk, and checks `prototype.html` was Read if it exists. Hard fails the Write/Edit if not.
- **Inline the WHY Checkpoint structure, the AI Slop Test, and the named tests directly** into agent/skill prompts. Prose like "this checkpoint is mandatory" is not enforcement; structured templates the model must fill in are.
- **Catalog refresh covers 2026 patterns.** The current catalog is 2024-era dashboard slop. The user's screenshot exposes 2026 mobile-app slop that isn't documented. Without this refresh, the model's "self-check against anti-patterns" passes on a technicality.
- **The aesthetic audit pass uses the existing `design-system-auditor` agent** — repurposed to cover both token compliance (existing) and aesthetic quality (new). This avoids creating a new agent.
- **Phase indicator removal is the right call.** Nothing in the plugin ever writes `status: complete` to `dependencies.yaml`, so the segment has been dead since launch. Removing is safer than implementing a missing status-write subsystem (which would touch every skill).
- **Version bump 2.4.1 → 2.5.0 (MINOR).** New hook + new agent responsibility = MINOR per CLAUDE.md.
- **No file moves, no folder restructure.** All changes are content edits + one new hook + one new reference file.

---

## Phase 1: New PreToolUse hook — design-grounding gate

**Objective**: Hard-enforce that required design knowledge was Read before any UI write. Returns `permissionDecision: "deny"` with a specific actionable error if prerequisites are missing.

**Depends on**: none

**Files**:
- Create: `hooks/de-design-grounding-hook.js`
- Modify: `hooks/hooks.json` (register the new hook on Write|Edit|MultiEdit, gated like other hooks on `.design-engineer-plugin/config.yaml` existing)

**Reuse**: The pattern from `hooks/de-tdd-hook.js` (the closest analog — also a PreToolUse blocker on Write|Edit|MultiEdit, also gates on the config file existing, also reads `transcript_path` style). Copy its scaffold (stdin parse, fail-open error handling, log file at `~/.claude/cache/de-design-grounding.log`, exit codes).

**Hook logic** (pseudocode):
```
if !exists(.design-engineer-plugin/config.yaml): exit 0
read tool_input.file_path
if !UI_EXTENSION (.tsx .jsx .html .svelte .vue .css .scss .astro): exit 0
if isExemptPath (tests/, plans/, node_modules/, plugins/, agents/, hooks/, skills/, commands/, .design-system/, documents/design/prototype/): exit 0
if no plans/ directory or no active plan: exit 0  // only enforce during implementation phase

read transcript_path (JSONL)
required_reads = [
  "ui-aesthetic-review/references/anti-patterns.md",
  "shared-references/anti-slop-writing.md",
  "ui-references-moodboard/references/design-intent-guide.md",
]
missing = required_reads filter (not present in transcript)

references_md_exists = fileExists(documents/design/design/references/references.md OR documents/design/design/references.md)

prototype_html_exists = fileExists(documents/design/prototype/prototype.html)
if prototype_html_exists:
  if "documents/design/prototype/prototype.html" not in transcript Reads:
    deny("Prototype exists at documents/design/prototype/prototype.html but you have not read it. Read it first — your implementation must match its layout, spacing, and styling. Do not creatively deviate.")

if !references_md_exists:
  deny("No references.md found. Before writing UI, establish design intent: who is this user, what verb must they perform, how should it feel (warm/cold/dense/calm/precise/playful — not 'clean and modern'). Save this to documents/design/design/references/references.md.")

if missing:
  deny("Required design knowledge not yet read this session: <list>. Read these files before any UI write — they contain the operating procedure for crafted output. Files: <absolute paths via DESIGN_ENGINEER_PLUGIN_ROOT>.")

exit 0
```

**Hook output format** (per docs):
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "<specific reason text>"
  }
}
```

**Checklist**:
- [ ] Create `hooks/de-design-grounding-hook.js` based on `de-tdd-hook.js` scaffold
- [ ] Implement transcript scanning — read `transcript_path` JSONL, look for `tool_name: "Read"` entries with matching `file_path`
- [ ] Implement filesystem checks for `references.md` and `prototype.html`
- [ ] Implement deny logic with actionable error messages (each message tells the model exactly which file to Read or which content to produce, with absolute paths)
- [ ] Register hook in `hooks/hooks.json` under `PreToolUse` with `matcher: "Write|Edit|MultiEdit"`
- [ ] Validate `hooks/hooks.json` with `python3 -m json.tool`
- [ ] Set executable bit on the JS file (no chmod needed for `node` invocation, but verify shebang `#!/usr/bin/env node`)

**QA**: After this phase, the hook's existence shouldn't affect anything yet because we haven't tested it end-to-end. Verify:
1. `python3 -m json.tool hooks/hooks.json` succeeds.
2. `node hooks/de-design-grounding-hook.js < /dev/null` exits cleanly (no crash on empty input).
3. Run an empty test: from a project WITHOUT `.design-engineer-plugin/config.yaml`, the hook exits 0 silently.

End-to-end test happens in Phase 9 verification (after all changes land).

---

## Phase 2: Inline rules into agent, skill, and command files

**Objective**: Force the design-grounding operating procedure into the model's context by inlining it into the prompts that actually load. Eliminates reliance on the model "noticing" referenced files.

**Depends on**: Phase 1 (so the rules and the enforcement gate ship together)

**Files**:
- Modify: `agents/frontend-implementer.md` — add a "Design Grounding Pre-Flight" section at the top of the agent's responsibilities, with the WHY Checkpoint template, AI Slop Test, and a 2026-aware anti-pattern checklist inlined
- Modify: `skills/dev-prototyping/SKILL.md` — add a "Pre-Flight Design Grounding" sub-section in Step 0 with the WHY Checkpoint template, mandatory Reads list, and explicit "do not generate any HTML until this block is output"
- Modify: `commands/de/dev.md` — add a "Design Grounding Pre-Flight" step before any code generation in the implementation flow

**Reuse**: The exact wording of the WHY Checkpoint from `skills/ui-references-moodboard/references/design-intent-guide.md` lines 119–148. Copy verbatim — don't paraphrase. The 4 named tests from `skills/ui-aesthetic-review/references/critique-framework.md`. The anti-pattern catalog summary from `skills/ui-aesthetic-review/references/anti-patterns.md`.

**Inlined block template** (used in all three locations with light context-specific intro):
```markdown
## Design Grounding Pre-Flight (BLOCKING)

Before writing any UI code or HTML, you MUST output the following block. The de-design-grounding-hook will deny your Write/Edit calls until you have:
1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
4. Confirmed `documents/design/design/references/references.md` exists (if not, run ui-references-moodboard first)
5. Read `documents/design/prototype/prototype.html` if it exists (your implementation must match it; no creative deviation)

After the Reads, output this block verbatim and fill in EVERY field:

### Design Intent
- **Who is this human**: [a specific person, not "users". Where they are when they open this, what's on their mind]
- **What verb must they accomplish**: [the actual action, not "use the dashboard"]
- **How should this feel**: [warm like a notebook / cold like a terminal / dense like a trading floor / calm like a reading app / precise like a surgical instrument / playful like a creative tool — NEVER "clean and modern"]

### Domain Exploration
- **Domain words (5+)**: [vocabulary from this product's world]
- **Color world (5+)**: [colors that exist naturally in this product's domain]
- **Signature element (1)**: [one element that could only exist for THIS product]
- **Named defaults (3)**: [obvious choices for this product type that you will NOT do, named so you can avoid them]

### WHY Checkpoint
- **Palette WHY**: [why these colors fit this product's world]
- **Depth WHY**: [borders / shadows / layered — and why this fits the intent]
- **Surfaces WHY**: [your elevation scale and why this color temperature]
- **Typography WHY**: [your typeface and why it fits the intent — NOT Inter/SF Pro/Roboto/Lato/Montserrat unless you state a specific reason]
- **Spacing WHY**: [your base unit and what it says about density]
- **Token names WHY**: [the words the tokens use — `--ink`, `--parchment`, `--scrub-teal` not `--gray-700`, `--surface-2`, `--primary`]

### Anti-pattern self-check (against the 2026 catalog)
For each, state PASS or how I am avoiding:
- [ ] Cream/beige background + orange CTA combo
- [ ] 3D emoji as character illustration (Apple/Google emoji as page heroes)
- [ ] Flag emoji or any emoji as avatars
- [ ] Pill chips with leading emoji
- [ ] Generic CTA copy ("Get started", "Join this event", "Learn more")
- [ ] Inter / SF Pro / Roboto / Lato / Montserrat typeface without stated WHY
- [ ] Generic token names (`--gray-N`, `--surface-N`, `--primary`)
- [ ] Cards nested in cards
- [ ] Identical card grids
- [ ] Glassmorphism / blur effects as decoration
- [ ] Centering everything
- [ ] Default drop shadows
- [ ] Gradient text on headings
- [ ] Purple-blue gradients / cyan-on-dark / neon accents
- [ ] Modal for everything

### Signature Test
List 5 specific places where the design intent manifests in this output:
1. [specific element + why it expresses the intent]
2. ...
3. ...
4. ...
5. ...

If you cannot fill all 5 with concrete components (not "the overall feel"), the signature does not exist — STOP and rework before any Write.
```

**Checklist**:
- [ ] Add the block to `agents/frontend-implementer.md` (place it after the "Before Implementation" section)
- [ ] Add the block to `skills/dev-prototyping/SKILL.md` Step 0 (between announcement and conditional teaching)
- [ ] Add the block to `commands/de/dev.md` Step 2 (before "Plan", so it gates plan creation too)
- [ ] Cross-reference the hook in each location — explicit mention that `de-design-grounding-hook.js` will block Writes if this block is missing
- [ ] Verify wording matches the source files exactly (don't paraphrase the WHY Checkpoint or named tests)

**QA**: Read the three modified files. Confirm:
1. The Design Grounding Pre-Flight block appears in all three.
2. The block is inserted before any UI-code-producing step (so it gates code, not retroactively).
3. The mandatory Reads list matches the hook's checks (otherwise the hook denies even when the model thinks it followed instructions).

---

## Phase 3: Refresh `anti-patterns.md` with 2026 mobile-app slop catalog

**Objective**: Add the patterns from the user's screenshot to the catalog so the self-check has concrete entries to fail.

**Depends on**: Phase 2 (Phase 2's anti-pattern self-check references catalog entries — they need to exist first)

**Files**:
- Modify: `skills/ui-aesthetic-review/references/anti-patterns.md`

**Reuse**: The existing file's heading structure and tone (specific, declarative, "this is the new generic"-style). Don't create a new file.

**Checklist**:
- [ ] Add a new section `## Mobile App Anti-Patterns (2026)` after the existing "Visual Anti-Patterns" section
- [ ] Document: **Cream/beige background + orange CTA** — the new "Inter font" of mobile design. Specific to event/social/booking apps. Signal: AI defaulted to "warm friendly mobile."
- [ ] Document: **3D emoji as character illustration** — Apple/Google emoji posed as page hero or section illustration. Signal: model needed an image, defaulted to emoji.
- [ ] Document: **Emoji avatars** (flag emoji, country emoji, generic emoji) — replacing real photos or letter avatars. Signal: model didn't decide on an avatar system.
- [ ] Document: **Pill chips with leading emoji** — small rounded badges with category emoji + label ("🏄 Surfing"). Signal: template-style categorization.
- [ ] Document: **Generic CTA copy** — "Get started", "Join this event", "Learn more", "Continue". Signal: model didn't write copy specific to this product's voice.
- [ ] Add a `## Hard Bans` section listing things that always require explicit user-stated WHY:
  - Inter / SF Pro / Roboto / Lato / Open Sans / Montserrat typefaces
  - Token names like `--gray-N`, `--surface-N`, `--primary`, `--secondary`, `--accent`
  - Emoji as avatars / illustrations / hero images
  - Cream + orange combo without domain-grounded reason
- [ ] Update the "AI Slop Test" section at the bottom to reference the new mobile catalog

**QA**: Open `anti-patterns.md`. Confirm:
1. New "Mobile App Anti-Patterns (2026)" section is present with all 5 patterns documented.
2. New "Hard Bans" section is present.
3. Existing 2024 sections are untouched.
4. The file still reads as a coherent catalog, not a patchwork.

---

## Phase 4: Tight prototype-to-dev coupling

**Objective**: Force `/de:dev` to use `prototype.html` as the visual baseline when it exists. The hook from Phase 1 already enforces the Read; this phase makes the agent/command instructions explicit about treating it as the baseline (no creative deviation).

**Depends on**: Phase 1, Phase 2

**Files**:
- Modify: `agents/frontend-implementer.md` — add explicit "if prototype.html exists, your implementation MUST match its layout/spacing/typography/color choices unless the user explicitly says otherwise; do not creatively deviate"
- Modify: `commands/de/dev.md` — add "Read prototype.html FIRST if it exists" as the very first step under "Read existing patterns"

**Reuse**: The "pixel-perfect Figma matching, zero creative interpretation" language already in `frontend-implementer.md`. Extend it to cover prototypes.

**Checklist**:
- [ ] Add prototype-as-baseline rule to `frontend-implementer.md` "Critical Implementation Reminders" section
- [ ] Add prototype-Read-first instruction to `commands/de/dev.md` Step 3 ("Read existing patterns")
- [ ] Cross-reference the hook's prototype enforcement so the agent knows the gate is real

**QA**: Read both files. Confirm the prototype-as-baseline rule is explicit and unambiguous in both locations.

---

## Phase 5: Aesthetic audit pass via `design-system-auditor` agent

**Objective**: After UI implementation completes, run a multi-stage aesthetic critique (4 lenses + 4 named tests + AI Slop Test) and surface findings before the model presents to the user.

**Depends on**: Phase 1, Phase 2, Phase 3

**Files**:
- Modify: `agents/design-system-auditor.md` — extend the agent's responsibility from "token compliance only" to "token compliance AND aesthetic critique"
- Modify: `commands/de/dev.md` — add "After UI implementation, invoke design-system-auditor for aesthetic audit" to the post-implementation flow

**Reuse**: The 4-lens framework (Composition / Craft / Content / Structure) and 4 named tests (Swap / Squint / Signature / Token) + AI Slop Test from `skills/ui-aesthetic-review/references/critique-framework.md`. Don't reinvent — link or inline the structure.

**Checklist**:
- [ ] Update `agents/design-system-auditor.md` description to mention aesthetic audit
- [ ] Add a "Aesthetic Audit Pass" section to the agent's instructions covering the 4 lenses + 4 named tests + AI Slop Test as a structured report
- [ ] Add explicit "regenerate if any test fails" rule (advisory but stated in agent prompt; the hook from Phase 1 doesn't cover post-write enforcement)
- [ ] Update `commands/de/dev.md` post-implementation flow to invoke design-system-auditor for aesthetic audit (not just token compliance)
- [ ] Note in commands/de/dev.md: this is advisory enforcement (the model may choose to skip), so the gate is mostly the Phase 1 pre-write hook + Phase 2 inline rules

**QA**: Read `design-system-auditor.md` and `commands/de/dev.md`. Confirm:
1. The auditor's role explicitly covers both token compliance and aesthetic critique.
2. The 4 lenses + 4 named tests + AI Slop Test are listed as the audit structure.
3. `commands/de/dev.md` invokes the auditor after UI work, not before.

---

## Phase 6: Pre-curated reference apps per product type

**Objective**: Provide concrete aesthetic anchors for users who skip `ui-references-moodboard` or don't know good apps in their product domain. References real apps known for distinctive (not slop) design.

**Depends on**: none (independent of the enforcement work)

**Files**:
- Create: `skills/ui-references-moodboard/references/curated-references.md`
- Modify: `skills/ui-references-moodboard/SKILL.md` Step 5 to reference the new file

**Reuse**: The product-type categorization implied in `commands/de/dev.md` Step 1.5 (build target detection — macOS app, Chrome extension, web app, mobile app, etc.) and `skills/ui-references-moodboard/SKILL.md` Step 3 (mobile iOS/Android, web app, cross-platform).

**Categories to cover** (with 3–5 reference apps each):
- Mobile event/social (e.g., Partiful, Luma, Bandsintown)
- Mobile productivity (e.g., Things, Linear mobile, Cron)
- Mobile fintech (e.g., Lunchmoney, Copilot, Monarch)
- Mobile health (e.g., Strava, Whoop, Oura)
- Web SaaS dashboard (e.g., Linear, Vercel, Stripe Atlas)
- Web fintech (e.g., Mercury, Brex, Ramp)
- Web content/media (e.g., Are.na, Read.cv, Anchor.fm)
- Macos / native desktop (e.g., Things, Reflect, Cron, Raycast)

For each app, document:
- Why it's a reference (specific quality, not "looks good")
- One signature element to study (typography choice, color world, layout pattern)

**Checklist**:
- [ ] Create `curated-references.md` with the 8 categories
- [ ] Per app, write a 1–2 sentence "study this for X" note
- [ ] Update `ui-references-moodboard/SKILL.md` Step 5 to recommend reading `curated-references.md` BEFORE Mobbin search if user has no specific apps in mind
- [ ] Add a note: these are seed references, not requirements — user can override

**QA**: Open the new file. Confirm:
1. Each category has 3–5 specific app names (not generic "fintech app").
2. Each app has a specific reason to study it.
3. The skill's Step 5 references the new file.

---

## Phase 7: Remove phase indicator from status line

**Objective**: Delete the dead pipeline-state segment per the user's earlier choice. The segment has been broken since launch (nothing writes `status: complete` to `dependencies.yaml`).

**Depends on**: none

**Files**:
- Modify: `hooks/de-statusline.js` — remove `buildPipelineSegment()` function, remove its call site, remove `parseDependenciesYaml()` and `findDepsPath()` if no longer used elsewhere
- Modify: `skills/meta-statusline/SKILL.md` — remove the phase-state mention from the "What the Status Line Shows" section (and from any other place it claims phase progress)
- Modify: `README.md` — verify no claim about pipeline progress in the status line; remove if present
- Modify: `commands/de/help.md` — same check
- Modify: `hooks/de-postcompact-hook.sh` — keep the dependency-counting logic (it's used for compact context injection, not the status line) — verify no dependency on the removed JS code

**Checklist**:
- [ ] Remove `buildPipelineSegment()` function definition from `de-statusline.js`
- [ ] Remove the call site in the main statusline output assembly
- [ ] Remove `findDepsPath()` and `parseDependenciesYaml()` if they have no other callers in this file
- [ ] Update `skills/meta-statusline/SKILL.md` "What the Status Line Shows" — remove "Pipeline state" bullet, update the example output line
- [ ] Grep the README and commands for any "Phase X: Strategy • 3/7"-style examples and remove
- [ ] Run `node hooks/de-statusline.js < /dev/null` to verify it doesn't crash after the removal

**QA**: Read the modified files. Confirm:
1. `de-statusline.js` has no references to phase, deliverables, or `dependencies.yaml`.
2. `meta-statusline/SKILL.md` no longer mentions pipeline state.
3. README/help no longer claim the status line shows phase progress.
4. Running `node hooks/de-statusline.js < /dev/null` succeeds without errors.

---

## Phase 8: Status-line lag note (Issue 1)

**Objective**: Document the platform behavior so testers understand status-line staleness during long tool calls is expected, not a plugin bug.

**Depends on**: Phase 7 (so the doc reflects the new status-line scope)

**Files**:
- Modify: `skills/meta-statusline/SKILL.md` — add to "Common Issues" section
- Modify: `README.md` — small note in the FAQ #9 section (Hooks)

**Checklist**:
- [ ] Add a "Status line stale during long file generation" entry to `meta-statusline/SKILL.md` Common Issues with: "The status line refreshes at the end of each model turn. If a single tool call (e.g., generating a long file) takes minutes, the line may show stale numbers until that turn completes. This is Claude Code's update model, not a plugin bug. Counts catch up after the long write finishes."
- [ ] (Optional) Add a similar one-liner to README FAQ#9

**QA**: Open the modified files. Confirm the note exists, is concise, and doesn't oversell the issue.

---

## Phase 9: Versioning + CHANGELOG + README banner

**Objective**: Bump version, document changes, sync the README banner. New hook + new agent responsibility = MINOR per CLAUDE.md.

**Depends on**: Phases 1–8

**Files**:
- Modify: `.claude-plugin/plugin.json` — version `2.4.1` → `2.5.0`
- Modify: `.claude-plugin/marketplace.json` — version `2.4.1` → `2.5.0`
- Modify: `CHANGELOG.md` — add `## [2.5.0] – 2026-04-25` entry
- Modify: `README.md` — banner `v2.4.1` → `v2.5.0`

**CHANGELOG content** (Keep a Changelog format):
```markdown
## [2.5.0] – 2026-04-25

### Added
- **Design grounding hook** (`de-design-grounding-hook.js`) — new PreToolUse hook that hard-blocks UI Writes/Edits unless required design knowledge has been Read this session and `references.md` exists in the project. Uses Anthropic's documented `permissionDecision: "deny"` enforcement primitive.
- **Mobile app anti-patterns catalog (2026)** added to `anti-patterns.md` — cream/beige + orange CTA, 3D emoji as illustration, emoji avatars, pill-chips-with-emoji, generic CTA copy, plus hard bans on Inter/SF Pro/Roboto/Lato/Montserrat without stated WHY and on generic token names.
- **Curated reference apps** (`skills/ui-references-moodboard/references/curated-references.md`) — 8 product categories with 3–5 distinctive-design reference apps each, so users skipping moodboard still have aesthetic anchors.
- **Aesthetic audit pass** in `design-system-auditor` agent — extended from token compliance only to also run the 4 lenses + 4 named tests + AI Slop Test from `critique-framework.md`.

### Changed
- **Inlined the WHY Checkpoint, AI Slop Test, and 2026 anti-pattern self-check** into `agents/frontend-implementer.md`, `skills/dev-prototyping/SKILL.md`, and `commands/de/dev.md` — the operating procedure is now in the agent/skill prompts directly, not just in reference files the model may not Read.
- **Tight prototype-to-dev coupling** — `/de:dev` and `frontend-implementer` now treat `prototype.html` as the visual baseline when it exists; no creative deviation. Enforced by the new hook.

### Removed
- **Phase indicator from status line** — the segment had been dead since launch (nothing wrote `status: complete` to `dependencies.yaml`). Removed `buildPipelineSegment()` from `de-statusline.js` and the related parsing helpers. Updated `meta-statusline` skill docs.

### Fixed
- (Status-line lag during long tool calls) — documented as Claude Code's update model, not a plugin bug. Added a Common Issues note to `meta-statusline` skill.
```

**Checklist**:
- [ ] Bump `plugin.json` version
- [ ] Bump `marketplace.json` version
- [ ] Add the 2.5.0 CHANGELOG entry above the existing 2.4.1 block
- [ ] Bump README banner
- [ ] Validate both manifests with `python3 -m json.tool`

**QA**: Run `python3 -m json.tool` on both manifests. Open CHANGELOG and README — confirm 2.5.0 entry is present, README banner reads `v2.5.0`.

---

## Risk assessment

- **Risk**: The PreToolUse hook is too strict and blocks legitimate Writes (e.g., a `.css` file the user created themselves outside any UI flow).
  **Mitigation**: The hook gates on `plans/` having an active plan file (so it only fires during plan execution) AND on `.design-engineer-plugin/config.yaml` existing. Outside those contexts, the hook exits 0 silently. The exempt-paths list also covers tests/, hooks/, skills/, etc.

- **Risk**: The hook's transcript scan misses Reads of the required files because the JSONL format changes between Claude Code versions.
  **Mitigation**: Fail-open. If transcript parsing throws, the hook exits 0 and lets the write through. We'd rather miss enforcement on rare format changes than block users systematically.

- **Risk**: Inlining the entire WHY Checkpoint + named tests + anti-pattern checklist into 3 files duplicates content; future updates to the checkpoint structure require touching 3 places.
  **Mitigation**: Acceptable. The duplication is intentional — agents and skills load their own prompts, so the rules need to be in each. The reference files in `skills/ui-references-moodboard/references/` and `skills/ui-aesthetic-review/references/` remain the canonical source for deep dives, and the inlined block is a deliberate operating-procedure subset, not the full content.

- **Risk**: The 2026 mobile-app catalog is opinionated and may misfire on legitimate designs (e.g., a beach/surf app that genuinely should have warm/orange branding).
  **Mitigation**: The catalog says these patterns require **explicit stated WHY** — they're not bans, they're forcing functions to make the model articulate why the choice fits the product. A real surf app has a real reason; the AI default does not.

- **Risk**: The post-write aesthetic audit (Phase 5) is advisory per the docs (PostToolUse mechanics) — the model can skip it.
  **Mitigation**: Documented in the plan. The pre-write hook (Phase 1) is the strict enforcement layer. The post-write audit is a quality booster, not the gate.

- **Risk**: Removing the phase indicator (Phase 7) reduces apparent functionality — users who've seen it before may notice it's gone.
  **Mitigation**: It was dead code anyway. Documented in CHANGELOG. The status line still shows model + dir + context bar + 5h/7d usage — the actually-working segments.

## Verification (end-to-end)

After all 9 phases land, the user (or a fresh tester) should run `/de:dev` from a clean project. The expected behavior:

1. The model attempts a Write to a `.tsx` or `.html` file before reading the design knowledge → **HARD BLOCK** with a specific message telling it which files to Read and what block to output.
2. The model Reads the required files, outputs the Design Grounding Pre-Flight block (Intent / Domain / WHY / anti-pattern self-check / Signature Test).
3. With the block produced and Reads logged, the next Write succeeds.
4. After UI implementation, `design-system-auditor` runs an aesthetic audit (advisory but typically followed when the agent's prompt says to).
5. Status line shows model + dir + context bar + 5h/7d usage. **No phase segment.** Stays accurate at the end of each turn.

Manual smoke test the user can run before tagging the release:

```bash
# In a test project with .design-engineer-plugin/config.yaml and an active plan in plans/:
# (1) Confirm hook exits 0 from project without UI write
echo '{"tool_input": {"file_path": "/tmp/foo.txt"}, "tool_name": "Write"}' | node hooks/de-design-grounding-hook.js

# (2) Confirm hook denies a UI write without prerequisites
echo '{"tool_input": {"file_path": "/tmp/foo.tsx"}, "tool_name": "Write", "transcript_path": "/tmp/empty.jsonl"}' | node hooks/de-design-grounding-hook.js
# Expected: stdout JSON with permissionDecision: "deny"

# (3) Confirm statusline runs cleanly without phase segment
echo '{"model": {"display_name": "Opus 4.7"}, "context_window": {"remaining_percentage": 75}}' | node hooks/de-statusline.js
# Expected: model + dir + context bar, no phase segment

# (4) Validate manifests
python3 -m json.tool .claude-plugin/plugin.json
python3 -m json.tool .claude-plugin/marketplace.json
python3 -m json.tool hooks/hooks.json
```

End-to-end real test: install v2.5.0 in a fresh project, run `/de:dev` with a 2-sentence product idea, and verify the model is forced through the design-grounding gate before any code Writes succeed.

## Questions for user

None pending. The architecture is settled (Option C from the v3 options). The plan covers Issues 1, 2, and 4 (Issue 3 confirmed not a bug). Auto mode is active, so phases will execute back-to-back with brief QA summaries; user can interrupt at any phase.
