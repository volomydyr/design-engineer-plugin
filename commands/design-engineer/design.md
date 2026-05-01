---
name: design-engineer:design
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
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:start` first
4. Scan the project: what tech stack, what components exist, what design patterns are used

## Step 2: Route based on project type

Check `project_type` in the config:

### If `project_type: existing` → Feature flow (abbreviated)

This project already exists. Do NOT run the full 4-phase from-scratch pipeline. The product has users, positioning, and an established codebase. Run an abbreviated feature-focused flow:

1. **Understand the feature**: Ask what the user wants to build. Use AskUserQuestion to clarify: what problem does it solve, who uses it, any constraints, how it fits into the existing product.

2. **Create feature folder**: Create `design/features/[feature-slug]/` for all deliverables related to this feature. Example: `design/features/private-islands/`. This prevents naming collisions when multiple features are designed over time.

3. **Plan the feature**: Go directly to `ux-mvp-requirements` – define scope, priorities, and what to reuse from the existing codebase. Then `ux-information-architecture` – define page structure, navigation, and how the feature integrates with existing pages. Save all deliverables in the feature folder.

4. **Optional depth** (ask the user): Offer these as optional add-ons, not defaults:
   - Brief problem statement (if the feature is complex and needs structured thinking)
   - Psychology audit on the planned feature
   - Figma comparison (if designs exist)

5. **Proceed to implementation**: Load `/design-engineer:dev` with the feature plan.

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
6. After each phase: summarize what was created, invoke `meta-document` to save progress, ask to continue

### Autopilot

1. Run all skills in the current phase (delegate to agents for speed)
2. Present a summary of deliverables created
3. After each phase: invoke `meta-document`, ask to continue or review

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

Skills in sequence:
1. `ux-problem-statement` – structured problem definition
2. `ux-target-audience` – persona development
3. `ux-assumptions` – assumption tracking
4. `ux-competitor-analysis` – competitive landscape analysis
5. `ux-user-interviews` – interview design and analysis *(optional – ask user)*

### Phase 2: Strategy (new products only)

At the start of this phase, mark the active workflow:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase2" > .design-engineer-plugin/.active-workflow
```

1. `ux-behavior-mapping` – behavior analysis
2. `ux-storybrand` – messaging framework
3. `ux-story-panels` – product narrative stories
4. `ux-business-plan` – revenue model and market sizing

### Phase 3: Planning (both new and existing)

If running the new-product full pipeline, at the start of this phase mark the active workflow (skip this Bash if running the existing-project Feature flow):

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "design:full-pipeline-phase3" > .design-engineer-plugin/.active-workflow
```

1. `ux-mvp-requirements` – MVP prioritization
2. `ux-information-architecture` – IA design

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

## Per-phase advisor checkpoint

After completing each phase above (Discovery / Strategy / Planning / Design & validation), before transitioning to the next phase or hand-off, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: phase name, deliverables produced, key decisions made, anything that surprised you. Apply the advice or use the reconcile pattern. This implements the docs' "before declaring done" call after deliverables are durable – it's the higher-leverage moment in this command, since each phase produces multiple decisions that downstream phases build on.

Skip the consult on phases where the user explicitly chose to skip optional skills and the produced deliverable is a single trivial document.

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

This branch is for adding a feature to an established product that already has a design language and existing documentation. The plugin must NOT push StoryBrand, business-plan thinking, or full Phase 1+2 / Phase 3 work for these tasks. The output is a single short spec the user (and `/design-engineer:dev`) can act on.

### F1.1: Verify project context

Read `.design-engineer-plugin/config.yaml` `project.context`:

- `shipped_ui: true` is required. If false / missing, tell the user feature-spec is for established products only; offer to fall back to the standard Feature flow.
- `existing_design_system: <truthy>` OR `existing_brand_docs: <truthy>` is required. If neither is set, ask the user once: "I don't see a design system or brand docs detected. Can you point me at one (Figma, Notion, Storybook, etc.) or do you want the standard Feature flow instead?" – capture the answer, persist to `off_repo_references`, and proceed only if they pointed somewhere.

### F1.2: Capture the feature

Ask via natural-language prompt or AskUserQuestion: "Describe the feature – what it does, who uses it, why now." Keep it open-ended; the user is the domain expert.

### F1.3: Draft the spec

Read whatever brand voice / design-system context is available:

1. If `design/foundation/storybrand.md` exists, read it for the brand voice.
2. Else if `existing_brand_docs` points at a local file, read that.
3. Else if `off_repo_references` names an external source, mention you can't read it but ask the user for 1–2 sentences capturing the brand voice in their own words.

Generate the spec at `design/features/[feature-slug]/feature-spec.md` (the `design/features/[slug]/` convention is established in design.md's Feature flow section). The spec is short – under one page:

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

### F1.3.5: Advisor checkpoint (pre-handoff)

After the spec is drafted at `design/features/[feature-slug]/feature-spec.md` and before asking the user what's next, consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: the drafted spec, brand voice context (from `design/foundation/storybrand.md` if present, else from the user's declaration), affected pages, key interactions, and anything you're uncertain about (scope, naming, what was deliberately left out). Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence. This mirrors the per-phase advisor checkpoint in the main pipeline – the feature-spec is substantive enough that a pre-handoff strategic check pays off.

### F1.4: Hand off

Ask via AskUserQuestion: question="What's next?" options: `[{label: "Implement this feature", description: "Route to /design-engineer:dev with the spec"}, {label: "Refine the spec further", description: "Iterate before development"}, {label: "Save and stop", description: "Spec is on disk; pick up later"}]`.

If "Implement", route to `/design-engineer:dev` and pass the spec path so the dev command can read it and create an implementation plan respecting it.
