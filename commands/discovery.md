---
name: design-engineer:discovery
description: Design workflow. For new products, runs the full pipeline. For existing projects, runs an abbreviated feature-focused flow. Argument `feature-spec` produces a truly minimal spec for established products with existing brand / design system.
argument-hint: "[phase N | skill-name | feature-spec]"
---

# Design Workflow

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters). This applies to every option set described in this command body. The spacer prevents the question panel from overlaying substantive content on most clients.

## Context

<context> #$ARGUMENTS </context>

## Argument routing

If `$ARGUMENTS` is `feature-spec`, jump to **Step F1: Minimal feature spec** below. Otherwise proceed to Step 1.

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot) and project type
2. Check for existing deliverables in `design/`
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:launch` first
4. Scan the project: what tech stack, what components exist, what design patterns are used

## Step 2: Route based on project type

Check `project_type` in the config:

### If `project_type: existing` → Feature flow (abbreviated)

This project already exists. Do NOT run the full 4-phase from-scratch pipeline. The product has users, positioning, and an established codebase. Run an abbreviated feature-focused flow:

#### Step 2.1: Spec polish routing (BLOCKING — choose before any work begins)

Before drafting any spec or running any skill, ask the user how polished the spec needs to be. This routes between the minimal one-page spec (which goes to F1) and the full feature flow (which continues to Step 2.2 below). End the preceding chat message with the canonical 3-horizontal-rule spacer per CLAUDE.md rule #6, then call AskUserQuestion:

- question: "How polished does the spec need to be?"
- header: "Depth"
- options:
  - label: "Minimal feature spec (Recommended for established products)"
    description: "1-page spec — problem in your project's voice, affected pages, key interactions, success criteria. Saves to .design-engineer-plugin/design/features/<slug>/feature-spec.md. Ship-focused. No new folders, no full pipeline."
  - label: "Full feature flow"
    description: "Walk through MVP requirements + information architecture before implementation. Creates .design-engineer-plugin/design/features/<slug>/ with multiple deliverables. Slower; useful when the feature is ambiguous or affects core navigation."
- multiSelect: false

On "Minimal feature spec" → jump to Step F1 (Minimal feature spec — argument branch below). The user effectively chose the same path as `/design-engineer:discovery feature-spec`.

On "Full feature flow" → continue to Step 2.2 below.

#### Step 2.2: Understand the feature

At the start of this step, mark the active workflow so the process-recall hook fires through the rest of the abbreviated feature flow (this is "complex work" — multi-step design activity that benefits from step-list recall):

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:abbreviated-feature-flow" > .design-engineer-plugin/.active-workflow
```

Ask what the user wants to build. Use AskUserQuestion to clarify: what problem does it solve, who uses it, any constraints, how it fits into the existing product.

#### Step 2.3: Create feature folder

Create `.design-engineer-plugin/design/features/[feature-slug]/` for all deliverables related to this feature. Example: `.design-engineer-plugin/design/features/private-islands/`. This prevents naming collisions when multiple features are designed over time.

#### Step 2.4: Plan the feature

Go directly to `ux-mvp-requirements` – define scope, priorities, and what to reuse from the existing codebase. Then `ux-information-architecture` – define page structure, navigation, and how the feature integrates with existing pages. Save all deliverables in the feature folder.

**After both skills complete**, run a compact recap before Step 2.5:

1. Glob `.design-engineer-plugin/design/features/<slug>/*.md` and Read every file.
2. Print the recap with the same structure as the Phase Recap protocol below (Deliverables produced / Key decisions / Open threads / What's next), scoped to this feature folder.
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow inline (do NOT use the `Skill` tool).
4. Then proceed to Step 2.5. The optional-depth question IS the AskUserQuestion gate — no separate one needed here.

#### Step 2.5: Optional depth (multi-select)

Before proceeding to implementation, ask the user which optional depth steps they want. End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6) before the AskUserQuestion call.

- question: "Which optional depth steps do you want before implementation?"
- header: "Optional depth"
- options:
  - label: "Brief problem statement"
    description: "Structured thinking — useful when the feature is ambiguous"
  - label: "Psychology audit"
    description: "Apply psych-decision-fundamentals + psych-cognitive-load to the planned feature"
  - label: "Figma comparison"
    description: "Pull structured Figma data with ui-figma-guide and compare to the plan"
  - label: "Design-system check"
    description: "Run ui-design-system audit against the project's existing tokens and components"
- multiSelect: true

For each selected option:
- "Brief problem statement" → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-problem-statement/SKILL.md` and follow it inline (do NOT use the Skill tool — plugin skills disable model invocation).
- "Psychology audit" → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-decision-fundamentals/SKILL.md` then `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-cognitive-load/SKILL.md` and follow each inline.
- "Figma comparison" → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-figma-guide/SKILL.md` and follow it inline (THIS IS WHERE ISSUE 15 IS RESOLVED — Figma is now reachable from the existing-project flow).
- "Design-system check" → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/SKILL.md` and follow it inline.

Persist the selections to `.design-engineer-plugin/config.yaml` under `project.feature_options:` as a list of strings. dev.md will read this list to inform implementation grounding (Step 1.5).

#### Step 2.6: Figma hand-off (conditional)

If a Figma project is connected (check `.design-engineer-plugin/config.yaml` for `environment.plugins.figma: true` OR `project.context.off_repo_references` contains `Figma project`), and the user did NOT already include "Figma comparison" in the Step 2.5 optional-depth selections, ask before handing off to dev. End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6), then call AskUserQuestion:

```
question: "Pull Figma designs before implementation?"
header: "Figma"
multiSelect: false
options:
  - label: "Yes – get Figma designs first"
    description: "Read ui-figma-guide and pull structured Figma data for the affected screens. Recommended if designs exist for this feature."
  - label: "Skip"
    description: "Implement without Figma designs (rely on the spec + existing components)."
```

On "Yes" → Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-figma-guide/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true` and the Skill tool will reject them). Pass the affected pages from the spec / IA as the scope. After Figma data is captured, then hand off to `/design-engineer:development`.

On "Skip" → proceed directly to `/design-engineer:development`.

If Figma is not connected, skip this step entirely and go to Step 2.7.

#### Step 2.7: Proceed to implementation

Before handing off to `/design-engineer:development`, clear the abbreviated-feature-flow marker so the process-recall hook stops firing on subsequent casual chat (the dev command will write its own `dev:feature-implementation` marker when it begins implementation):

```bash
rm -f .design-engineer-plugin/.active-workflow
```

Load `/design-engineer:development` with the feature plan.

In Guided mode: ask the user at each step, iterate. Do NOT delegate to agents – the main model does the work interactively.
In Autopilot: execute the abbreviated flow, present results.

### If `project_type: new` → Full pipeline

This is a new product from scratch. Run the full 4-phase pipeline.

If existing deliverables are found, present current state and recommend where to pick up. In Guided mode, ask to confirm. In Autopilot, show briefly and start.

## Step 3: Execute based on mode

### Guided mode

In Guided mode, the main model does ALL user-facing work. Do NOT delegate to autonomous agents (ux-researcher, psych-scanner, etc.). Agents cannot pause for user input – they defeat the purpose of Guided mode.

For each skill in the current phase:
1. Announce what's next and why it matters
2. Ask if the user wants to proceed, skip, or adjust
3. Run the skill YOURSELF – read reference material from the skill, ask the user 7–10 strategic questions, iterate back and forth until satisfied
4. Present the deliverable for review
5. Wait for feedback before moving to the next skill
6. After each phase: run the **Phase Recap protocol** (defined below). The protocol prints the recap in chat, persists state via `meta-document`, runs the advisor consult, and gates the transition with `AskUserQuestion`.

### Autopilot

1. Run all skills in the current phase (delegate to agents for speed)
2. Present a summary of deliverables created
3. After each phase: run the **Phase Recap protocol** (defined below). The recap is printed in chat AND persisted via `meta-document` even in autopilot — the user still wants to see what was produced before the next phase fires.

### Active-workflow marker (full pipeline only)

The four phases below run only for the new-product full-pipeline branch (`project_type: new`). At the start of each phase, run a Bash command to mark the active workflow so the process-recall hook can fire context-appropriately. Replace `<N>` with the phase number (1, 2, 3, or 4):

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase<N>" > .design-engineer-plugin/.active-workflow
```

When transitioning to the next phase, overwrite the marker with the new phase number using the same command. When the full pipeline hands off (post-pipeline AskUserQuestion below), clear the marker:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

The existing-project abbreviated Feature flow (Step 2 → "If `project_type: existing`") and the F1 minimal-spec branch do NOT write this marker.

### Phase 1: Discovery (new products only)

At the start of this phase, mark the active workflow:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase1" > .design-engineer-plugin/.active-workflow
```

**Print the Pipeline overview (BLOCKING — runs once at the start of Phase 1).** Before announcing the first skill, show the user the full map of what's ahead so they know the shape of the journey. Use this exact structure:

> ## Pipeline overview
>
> ▸ Phase 1: Discovery (starting now)
>   ○ Problem statement
>   ○ Target audience
>   ○ Assumptions
>   ○ Competitor analysis
>   ○ User interviews (optional)
>
> Phase 2: Strategy — 4 skills (behavior mapping, StoryBrand, story panels, business plan)
>
> Phase 3: Planning — 2 skills (MVP requirements, information architecture)
>
> Phase 4: Design & validation — 9 skills (bias audit, journey mapping, ethics review, references & moodboard, design system, prototyping, Figma guide, motivation audit, product assessment)
>
> Hand-off to /design-engineer:development
>
> At the end of every phase you'll see a recap with what was produced, key decisions, and a Continue / Revise / Pause gate. You can pause anytime with /design-engineer:stop and resume later.

This overview replaces vague "we'll go through some phases" framing — the user gets the full mental model up front and the per-phase recaps then anchor against it.

Skills in sequence:
1. `ux-problem-statement` – structured problem definition
2. `ux-target-audience` – persona development
3. `ux-assumptions` – assumption tracking
4. `ux-competitor-analysis` – competitive landscape analysis
5. `ux-user-interviews` – interview design and analysis *(optional – ask user)*

**At the end of Phase 1**, run the **Phase Recap protocol** (defined below). Do not write the Phase 2 active-workflow marker until the user answers the recap's AskUserQuestion gate.

### Phase 2: Strategy (new products only)

At the start of this phase, mark the active workflow:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase2" > .design-engineer-plugin/.active-workflow
```

1. `ux-behavior-mapping` – behavior analysis
2. `ux-storybrand` – messaging framework
3. `ux-story-panels` – product narrative stories
4. `ux-business-plan` – revenue model and market sizing

**At the end of Phase 2**, run the **Phase Recap protocol** (defined below). Do not write the Phase 3 active-workflow marker until the user answers the recap's AskUserQuestion gate.

### Phase 3: Planning (both new and existing)

If running the new-product full pipeline, at the start of this phase mark the active workflow (skip this Bash if running the existing-project Feature flow):

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase3" > .design-engineer-plugin/.active-workflow
```

1. `ux-mvp-requirements` – MVP prioritization
2. `ux-information-architecture` – IA design

**At the end of Phase 3**, run the **Phase Recap protocol** (defined below). Do not write the Phase 4 active-workflow marker (or hand off to development for the existing-project flow) until the user answers the recap's AskUserQuestion gate.

### Phase 4: Design & validation (both new and existing, optional for features)

If running the new-product full pipeline, at the start of this phase mark the active workflow (skip this Bash if running the existing-project Feature flow):

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase4" > .design-engineer-plugin/.active-workflow
```

1. `ux-bias-audit` – bias audit
2. `ux-journey-mapping` – journey mapping
3. `ux-ethics-review` – ethical review *(optional)*
4. `ui-references-moodboard` – reference gathering
5. `ui-design-system` – code-first design system definition. Run after references are gathered and before prototyping consumes them. Ensures the prototype's CSS tokens are grounded in a defined system rather than improvised per-screen.
6. `dev-prototyping` – prototyping and testing
7. `ui-figma-guide` – Figma workflow
8. `ux-motivation-audit` – screen-level psychology analysis
9. `ux-full-review` – product assessment *(optional)*

**At the end of Phase 4**, run the **Phase Recap protocol** (defined below). The full pipeline ends here; the recap's AskUserQuestion gate routes the user to development hand-off, review, or pause via the Post-pipeline section that follows.

## Phase Recap protocol (BLOCKING — runs at end of every phase)

After completing all skills in a phase, BEFORE writing the active-workflow marker for the next phase, run this exact sequence. The user must see a recap of what just happened — without it, they're left wondering "did anything actually finish?" and the deliverables disappear into folders nobody re-opens.

### 1. Glob every deliverable produced this phase

Run a Glob for the phase's canonical paths:

- **Phase 1 (Discovery)**: `.design-engineer-plugin/design/foundation/*.md` and `.design-engineer-plugin/design/research/*.md`
- **Phase 2 (Strategy)**: `.design-engineer-plugin/design/foundation/storybrand.md`, `.design-engineer-plugin/design/foundation/business-plan.md`, `.design-engineer-plugin/design/exploration/behavior-map.md`, `.design-engineer-plugin/design/exploration/story-panels/*.md` (if any)
- **Phase 3 (Planning)**: `.design-engineer-plugin/design/planning/*.md`
- **Phase 4 (Design & validation)**: `.design-engineer-plugin/design/exploration/bias-audit.md`, `.design-engineer-plugin/design/exploration/customer-journey-map.md`, `.design-engineer-plugin/design/exploration/ethics-review.md`, `.design-engineer-plugin/design/exploration/references.md`, `.design-engineer-plugin/design/dev/design-system.md`, `.design-engineer-plugin/prototype/prototype.html`, `.design-engineer-plugin/design/reviews/*.md`

### 2. Read every file the Glob returned

In full. Not from memory. The recap quotes from these files; if a file isn't Read, the quote is fabricated, which violates Content Integrity.

### 3. Print the recap in chat

Use this exact structure (no AI-slop preamble, no "let me summarize"). The recap leads with a **Pipeline progress** block so the user always knows where they are in the larger flow before reading the per-phase detail. This block applies only to the new-product full-pipeline branch — skip it for the abbreviated feature flow and the F1 minimal-spec branch (those flows have no phases to track).

#### Canonical pipeline (for the Pipeline progress block)

The full pipeline always runs in this order. Use this exact list — do NOT improvise. Skill names should be shown as user-readable labels (e.g. "Problem statement", not `ux-problem-statement`).

- **Phase 1: Discovery** — Problem statement / Target audience / Assumptions / Competitor analysis / User interviews (optional)
- **Phase 2: Strategy** — Behavior mapping / StoryBrand / Story panels / Business plan
- **Phase 3: Planning** — MVP requirements / Information architecture
- **Phase 4: Design & validation** — Bias audit / Journey mapping / Ethics review (optional) / References & moodboard / Design system / Prototyping / Figma guide / Motivation audit / Product assessment (optional)

After Phase 4 the pipeline ends and the user is offered hand-off to `/design-engineer:development`.

#### Recap output schema

> ## Pipeline progress
>
> _For each phase in order:_
> - **Completed phases** (every phase BEFORE the just-finished one): show `✓ Phase <N>: <name>` and indent the full skill list under it with `✓` for each skill that ran and `⊘` for each optional skill the user skipped. The user wants to see everything they've already accomplished.
> - **Just-finished phase** (the phase this recap is for): show `▸ Phase <N>: <name> (just finished — recap below)` and the full skill list with `✓` / `⊘` markers — same depth as completed phases.
> - **Next phase** (the immediate next one): show `→ Phase <N+1>: <name> (up next)` and the full skill list with `○` markers (planned, not started). This is the only upcoming phase that gets step details — the user wants to know what's about to happen.
> - **Subsequent phases** (every phase AFTER the next one): show only `Phase <N+2>: <name>` and a one-line summary of the phase's role (e.g. "9 skills covering bias audit, references, design system, prototyping, Figma, motivation audit"). Do NOT expand step details for these — the user said overloading them defeats the purpose.
> - **After Phase 4**: show `Hand-off to /design-engineer:development` instead of a phase entry.
>
> ## Phase <N>: <phase name> — recap
>
> **Deliverables produced** (each with a 1–2 sentence takeaway pulled from the file, not summarized from memory):
> - `<relative path>` — <takeaway grounded in an exact phrase from the file>
> - …
>
> **Key decisions this phase** (decisions downstream phases will build on — not every line, just the cross-cutting ones):
> - <decision> — from `<file>`, quoting "<exact phrase>"
> - …
>
> **Open threads / risks** (anything unresolved, anything flagged for later, anything the user said "we'll come back to this"):
> - <thread + which deliverable surfaced it>
> - …
>
> **What's next**: Phase <N+1> (<next phase name>) covers <list of skills, comma separated>.

If a section has nothing to say, write "none." Do NOT pad with filler.

#### Worked example (after finishing Phase 2)

> ## Pipeline progress
>
> ✓ Phase 1: Discovery
>   ✓ Problem statement
>   ✓ Target audience
>   ✓ Assumptions
>   ✓ Competitor analysis
>   ⊘ User interviews (skipped — optional)
>
> ▸ Phase 2: Strategy (just finished — recap below)
>   ✓ Behavior mapping
>   ✓ StoryBrand
>   ✓ Story panels
>   ✓ Business plan
>
> → Phase 3: Planning (up next)
>   ○ MVP requirements
>   ○ Information architecture
>
> Phase 4: Design & validation — 9 skills covering bias audit, references, design system, prototyping, Figma, motivation audit
>
> Hand-off to /design-engineer:development
>
> ## Phase 2: Strategy — recap
>
> **Deliverables produced**:
> - …

### 4. Invoke meta-document inline

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`. This flushes the recap into the structurally enforced agent-memory layer (`~/.claude/agent-memory/design-engineer-compound-documenter/{pipeline-state.md, key-decisions.md, stale-dependents.md}`). Without this step the recap exists only in chat and is lost on `/compact`.

### 5. Advisor checkpoint (pre-done strategic consult)

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool — plugin skills disable model invocation). Pass: phase name, the recap from Step 3, key decisions, anything that surprised you. Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence in the deliverables. This implements the docs' "before declaring done" call after deliverables are durable.

Skip Step 5 only when the user explicitly chose to skip every optional skill in this phase AND the produced deliverable is a single trivial document.

### 6. AskUserQuestion (BLOCKING — user drives the transition)

End the preceding chat message with the canonical 3-horizontal-rule spacer per CLAUDE.md rule #6, then call AskUserQuestion:

- question: "Phase <N> is complete. What now?"
- header: "Phase <N> done"
- options:
  - "Continue to Phase <N+1>" — description: "Move forward with <next phase name>: <skill list>."
  - "Revise this phase first" — description: "Pick a deliverable from this phase to update before moving on."
  - "Pause and save" — description: "Save state and stop here; pick up next time with /design-engineer:launch."
- multiSelect: false

### 7. Apply the user's choice

- "Continue" → write the next phase's active-workflow marker, proceed.
- "Revise" → ask which deliverable, re-run that skill, then re-run the Phase Recap protocol.
- "Pause" → clear the active-workflow marker, hand off to `/design-engineer:stop`.

NEVER auto-proceed past Step 6 without an explicit user answer. The recap is the user's signal that work happened; skipping the AskUserQuestion gate breaks the contract this protocol exists to enforce.

## Post-pipeline

If the new-product full pipeline was running (a `design:full-pipeline-phase*` marker is currently set), clear the active-workflow marker at hand-off so the process-recall hook stops firing on subsequent casual chat:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

After completing the current work:

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Continue to next phase"
    description: "Continue to the next phase of the design pipeline"
  - label: "Review deliverables"
    description: "Review the deliverables for quality before moving on"
  - label: "Move to development"
    description: "Switch to development – set up code pipeline and implement"
  - label: "Save progress and stop"
    description: "Document progress so you can pick up next time"
```

---

## Step F1: Minimal feature spec (`feature-spec` argument)

This branch is for adding a feature to an established product that already has a design language and existing documentation. The plugin must NOT push StoryBrand, business-plan thinking, or full Phase 1+2 / Phase 3 work for these tasks. The output is a single short spec the user (and `/design-engineer:development`) can act on.

### F1.1: Verify project context

Read `.design-engineer-plugin/config.yaml` `project.context`:

- `shipped_ui: true` is required. If false / missing, tell the user feature-spec is for established products only; offer to fall back to the standard Feature flow.
- `existing_design_system: <truthy>` OR `existing_brand_docs: <truthy>` is required. If neither is set, ask the user once: "I don't see a design system or brand docs detected. Can you point me at one (Figma, Notion, Storybook, etc.) or do you want the standard Feature flow instead?" – capture the answer, persist to `off_repo_references`, and proceed only if they pointed somewhere.

### F1.2: Capture the feature

Ask via natural-language prompt or AskUserQuestion: "Describe the feature – what it does, who uses it, why now." Keep it open-ended; the user is the domain expert.

### F1.3: Draft the spec

Read whatever brand voice / design-system context is available:

1. If `.design-engineer-plugin/design/foundation/storybrand.md` exists, read it for the brand voice.
2. Else if `existing_brand_docs` points at a local file, read that.
3. Else if `off_repo_references` names an external source, mention you can't read it but ask the user for 1–2 sentences capturing the brand voice in their own words.

Generate the spec at `.design-engineer-plugin/design/features/[feature-slug]/feature-spec.md` (the `.design-engineer-plugin/design/features/[slug]/` convention is established in design.md's Feature flow section). The spec is short – under one page:

```markdown
# [Feature name] – Spec

## Problem (in project's voice)
[1 paragraph using the existing brand voice]

## Affected pages
- [Page 1] – [what changes]
- [Page 2] – [what changes]

## Key interactions
[bullet list – what users can do, what the system does in response]

## Success criteria
[bullet list – observable outcomes that mean this feature works]

## Out of scope
[what this spec deliberately does NOT cover]
```

**No phases. No StoryBrand framing (it's already in the existing brand). No business plan rewrite. No full IA regeneration.** If you find yourself wanting to add any of those, stop – that's the standard Feature flow, not feature-spec.

### F1.3.4: Spec recap (in chat)

After saving the spec, print a compact recap in chat — same structure as the Phase Recap protocol but scoped to this single feature spec:

> ## Feature spec — recap
>
> **Spec saved at**: `.design-engineer-plugin/design/features/<slug>/feature-spec.md`
>
> **Problem (in project's voice)**: <quote the Problem section verbatim>
>
> **Affected pages**: <list>
>
> **Key interactions**: <list>
>
> **Success criteria**: <list>
>
> **Out of scope**: <list>
>
> **What's next**: implementation via `/design-engineer:development`, or further refinement.

This is a chat-only recap — no `meta-document` invocation here because feature-spec is a single-document flow and the spec file itself IS the persistence layer.

### F1.3.5: Advisor checkpoint (pre-handoff)

After the spec is drafted at `.design-engineer-plugin/design/features/[feature-slug]/feature-spec.md` and before asking the user what's next, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: the drafted spec, brand voice context (from `.design-engineer-plugin/design/foundation/storybrand.md` if present, else from the user's declaration), affected pages, key interactions, and anything you're uncertain about (scope, naming, what was deliberately left out). Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence. This mirrors the per-phase advisor checkpoint in the main pipeline – the feature-spec is substantive enough that a pre-handoff strategic check pays off.

### F1.4: Hand off

Ask via AskUserQuestion: question="What's next?" options: `[{label: "Implement this feature", description: "Route to /design-engineer:development with the spec"}, {label: "Refine the spec further", description: "Iterate before development"}, {label: "Save and stop", description: "Spec is on disk; pick up later"}]`.

If "Implement", route to `/design-engineer:development` and pass the spec path so the dev command can read it and create an implementation plan respecting it.
