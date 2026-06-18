---
name: design-engineer:discovery
description: Design workflow. For new products, runs the design spine with opt-in depth. For existing projects, runs an abbreviated feature-focused flow. Argument `feature-spec` produces a truly minimal spec for established products with existing brand / design system.
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

1. Read `.design-engineer-plugin/config.yaml` for project type
2. Check for existing deliverables in `design/`
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:launch` first
4. Scan the project: what tech stack, what components exist, what design patterns are used

## Step 2: Route based on project type

Check `project_type` in the config:

### If `project_type: existing` → Feature flow (abbreviated)

This project already exists. Do NOT run the from-scratch spine. The product has users, positioning, and an established codebase. Run an abbreviated feature-focused flow:

#### Step 2.1: Spec polish routing (BLOCKING — choose before any work begins)

Before drafting any spec or running any skill, ask the user how polished the spec needs to be. This routes between the minimal one-page spec (which goes to F1) and the full feature flow (which continues to Step 2.2 below). End the preceding chat message with the canonical 3-horizontal-rule spacer per CLAUDE.md rule #6, then call AskUserQuestion:

- question: "How polished does the spec need to be?"
- header: "Depth"
- options:
  - label: "Minimal feature spec (Recommended for established products)"
    description: "1-page spec — problem in your project's voice, affected pages, key interactions, success criteria. Saves to .design-engineer-plugin/design/features/<slug>/feature-spec.md. Ship-focused. No new folders, no full spine."
  - label: "Full feature flow"
    description: "Walk through MVP requirements + information architecture before implementation. Creates .design-engineer-plugin/design/features/<slug>/ with multiple deliverables. Slower; useful when the feature is ambiguous or affects core navigation."
- multiSelect: false

On "Minimal feature spec" → jump to Step F1 (Minimal feature spec — argument branch below). The user effectively chose the same path as `/design-engineer:discovery feature-spec`.

On "Full feature flow" → continue to Step 2.2 below.

#### Step 2.2: Understand the feature

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

Load `/design-engineer:development` with the feature plan.

The abbreviated feature flow does its research and writes its deliverables inline by default. Dispatch `Task(ux-researcher, ...)` only for research work heavy enough to flood the main context (deep competitor analysis, user interviews); otherwise browse, synthesize, and format the deliverable inline.

Present results to the user step by step with `AskUserQuestion` between findings. When a subagent ran, parse its output rather than dumping it raw.

### If `project_type: new` → Default spine

This is a new product from scratch. Run the default spine (Step 3 below): Problem → Audience → MVP → IA → Prototype → Dev, with opt-in depth offered along the way.

If existing deliverables are found, present current state and recommend where to pick up, then ask the user to confirm.

## Step 3: Execute the spine

### Subagents in this command

Two kept agents support the new-product flow; dispatch them only when warranted:

- **`ux-researcher`** — handles research-heavy work (deep competitor analysis, user interviews, market scanning, anything that involves browsing / fetching / synthesizing many external sources). Dispatch `Task(ux-researcher, ...)` only when that research is heavy enough to flood the main context. Lighter research can be done inline.
- **`compound-documenter`** — invoked by `meta-document` at phase boundaries to flush state into agent memory. The structurally enforced layer (`memory: project`) lives here.

Do all other work — drafting each spine step's deliverable, formatting it, asking the user questions — inline by default. There is no separate writer agent; format and save the deliverable yourself.

For each step in the spine:
1. Announce what's next and why it matters
2. Ask if the user wants to proceed, skip, or adjust
3. Run the step interactively — infer what you can from what the user has already said, and ask only what you genuinely can't resolve, batched, ≤4 questions per round, never re-asking anything already answered
4. If the step is research-heavy and would flood the main context, dispatch `Task(ux-researcher, ...)` and wait for it to return; otherwise do the work inline
5. Present results to the user step by step with `AskUserQuestion` between findings or sections — when a subagent ran, parse its output rather than dumping it raw
6. Wait for the user's feedback on each presented section before moving on
7. After each phase: run the **Phase Recap protocol** (defined below). The protocol prints the recap in chat, persists state via `meta-document`, and gates the transition with `AskUserQuestion`.

### The default spine (new products)

The lean default for a new product is a short spine, run in order. It takes the user from a problem to working code without forcing every research and strategy artifact on them:

**Problem → Audience → MVP → IA → Prototype → Dev**

| Step | Skill | Produces |
|---|---|---|
| Problem | `ux-problem-statement` | A structured problem definition |
| Audience | `ux-target-audience` | The people this is for |
| MVP | `ux-mvp-requirements` | What ships first, prioritized |
| IA | `ux-information-architecture` | Page structure and navigation |
| Prototype | `ui-references-moodboard` → `ui-design-system` → `dev-prototyping` | Design references, a grounded token set, then a clickable HTML prototype |
| Dev | hand-off to `/design-engineer:development` | Implementation |

**Print the spine overview once, before the first step.** Show the user the shape of the journey so they know what's ahead:

> ## What's ahead
>
> ▸ Problem (starting now) — a clear problem statement
> ○ Audience — who this is for
> ○ MVP — what ships first
> ○ Information architecture — pages and navigation
> ○ Prototype — references, a design system, and a clickable HTML prototype
> ○ Hand-off to /design-engineer:development
>
> At the end of each step you'll see a recap with what was produced and a Continue / Revise / Pause gate. You can add deeper research or strategy work at any point, and pause anytime with /design-engineer:stop.

Run each spine step, then run the **Phase Recap protocol** (defined below) before moving to the next.

### Design exploration (Prototype step) – workflow candidate

When you reach the Prototype step (`ui-references-moodboard` → `ui-design-system` → `dev-prototyping`), the design-exploration moment – generating and judging multiple concept directions before committing to one – is a premium-planning step worth fanning out. Offer it before running the moodboard inline: "I can explore several distinct design directions in parallel as a workflow – one Opus agent at xhigh effort per concept direction, then judge and synthesize the strongest – or explore inline. Use a workflow to explore design directions?"

- **Availability gate**: workflows require Claude Code v2.1.154+ on a paid plan. If workflows are unavailable or the user declines, fall back to the single-pass inline path below – nothing breaks.
- **If the user opts in and workflows are available**: dispatch one agent per concept direction (Opus model, xhigh effort – this is premium planning), each exploring a distinct direction grounded in the upstream deliverables. Then judge the returned directions against each other and synthesize the strongest into the references and design-system deliverables. The workflow takes no mid-run input; present the synthesized result when it returns and let the user react.
- **Inline fallback (always available, single pass)**: run the Prototype step as written – Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/SKILL.md`, then `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/SKILL.md`, then `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-prototyping/SKILL.md`, following each inline (do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`).

After either path, run the **Phase Recap protocol** before moving on.

### Add depth (opt-in)

The spine is the default, not the ceiling. At any point — before MVP, before the prototype, or after the spine completes — offer the user deeper work they can opt into. Surface this only when it would genuinely help (the problem is ambiguous, the market is crowded, the product has ethical or persuasion stakes); never march the user through all of it by default. End the preceding chat message with the canonical 3-horizontal-rule spacer (per CLAUDE.md rule #6), then call AskUserQuestion:

- question: "Want to add any deeper work before moving on?"
- header: "Add depth"
- multiSelect: true
- options:
  - label: "Competitor analysis", description: "Map the competitive landscape with ux-competitor-analysis"
  - label: "User interviews", description: "Design and analyze interviews with ux-user-interviews"
  - label: "Messaging & narrative", description: "StoryBrand messaging (ux-storybrand) and product story panels (ux-story-panels)"
  - label: "Business plan", description: "Revenue model and market sizing with ux-business-plan"
  - label: "Audits", description: "Bias (ux-bias-audit), ethics (ux-ethics-review), and journey mapping (ux-journey-mapping)"
  - label: "Full psychology scan", description: "Run the full psych scan (psych-full-scan) plus the motivation audit (ux-motivation-audit) across the product"

For each selected option, Read the matching `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<skill-name>/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`). The assumptions tracker (`ux-assumptions`) and the Figma guide (`ux-figma-guide` / `ui-figma-guide`) are also available on request. After any depth work, run the **Phase Recap protocol** before continuing the spine.

**Competitor analysis – workflow candidate.** When the user selects "Competitor analysis" and the competitive landscape is broad (several competitors, sources worth cross-checking against each other), offer to fan it out: "I can run competitor analysis as a workflow – one agent per competitor, run in parallel, with their findings cross-checked against each other – or delegate it to the bundled `/deep-research` harness, or run `ux-competitor-analysis` inline. Use a workflow for the competitor analysis?"

- **Availability gate**: workflows require Claude Code v2.1.154+ on a paid plan. If workflows are unavailable or the user declines, fall back to one of the single-pass paths below – nothing breaks.
- **If the user opts in and workflows are available**: dispatch one agent per competitor, each researching that competitor against the `ux-competitor-analysis` method, then cross-check the returned findings (claims confirmed across sources vs single-source claims). Workflows take no mid-run input; present the synthesized landscape when it returns. Respect the bot-block and auth-wall fallbacks (CLAUDE.md) for any gated competitor.
- **Or delegate to `/deep-research`**: for research-shaped competitor work, the bundled `/deep-research` harness already fans out web searches, fetches sources, adversarially verifies claims, and synthesizes a cited report – use it instead of authoring a bespoke workflow when that shape fits.
- **Inline fallback (always available, single pass)**: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-competitor-analysis/SKILL.md` and follow it inline.

## Phase Recap protocol (BLOCKING — runs at the end of every spine step)

After completing a spine step (or any opt-in depth work), run this exact sequence before moving on. The user must see a recap of what just happened — without it, they're left wondering "did anything actually finish?" and the deliverables disappear into folders nobody re-opens.

### 1. Glob the deliverables produced in THIS step

Glob only the files the just-finished step actually produced — not the whole `design/` tree. For example, after the Problem step glob `.design-engineer-plugin/design/foundation/problem-statement.md`; after the prototype step glob `.design-engineer-plugin/design/exploration/references.md`, `.design-engineer-plugin/design/dev/design-system.md`, and `.design-engineer-plugin/prototype/prototype.html`. If a depth skill ran, glob that skill's own deliverable path. Keep the recap scoped to what just changed.

### 2. Read every file the Glob returned

In full. Not from memory. The recap quotes from these files; if a file isn't Read, the quote is fabricated, which violates Content Integrity.

### 3. Print the recap in chat

Use this exact structure (no AI-slop preamble, no "let me summarize"):

> ## <Step name> — recap
>
> **Deliverables produced** (each with a 1–2 sentence takeaway pulled from the file, not summarized from memory):
> - `<relative path>` — <takeaway grounded in an exact phrase from the file>
> - …
>
> **Key decisions** (decisions downstream steps will build on — not every line, just the cross-cutting ones):
> - <decision> — from `<file>`, quoting "<exact phrase>"
> - …
>
> **Open threads / risks** (anything unresolved, anything flagged for later, anything the user said "we'll come back to this"):
> - <thread + which deliverable surfaced it>
> - …
>
> **What's next**: <the next spine step, or hand-off to /design-engineer:development if the spine is complete>.

If a section has nothing to say, write "none." Do NOT pad with filler.

### 4. Invoke meta-document inline

Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`. This flushes the recap into the structurally enforced agent-memory layer (`~/.claude/agent-memory/design-engineer-compound-documenter/{pipeline-state.md, key-decisions.md, stale-dependents.md}`). Without this step the recap exists only in chat and is lost on `/compact`.

### 5. AskUserQuestion (BLOCKING — user drives the transition)

End the preceding chat message with the canonical 3-horizontal-rule spacer per CLAUDE.md rule #6, then call AskUserQuestion:

- question: "<Step name> is complete. What now?"
- header: "Next step"
- options:
  - "Continue" — description: "Move forward with <next spine step>."
  - "Add depth" — description: "Run deeper research or strategy work before moving on (competitor analysis, interviews, messaging, business plan, audits, psych scan)."
  - "Revise this step first" — description: "Pick a deliverable from this step to update before moving on."
  - "Pause and save" — description: "Save state and stop here; pick up next time with /design-engineer:launch."
- multiSelect: false

### 6. Apply the user's choice

- "Continue" → proceed to the next spine step.
- "Add depth" → run the Add-depth AskUserQuestion, do the selected work, then re-run this Phase Recap protocol.
- "Revise" → ask which deliverable, re-run that step, then re-run this Phase Recap protocol.
- "Pause" → hand off to `/design-engineer:stop`.

NEVER auto-proceed past Step 5 without an explicit user answer. The recap is the user's signal that work happened; skipping the AskUserQuestion gate breaks the contract this protocol exists to enforce.

## Post-pipeline

After completing the current work:

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Continue the spine"
    description: "Move to the next step of the design spine"
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

### F1.3.45: Optional – decompose into per-screen design specs

The one-page feature spec names WHAT ships; a per-screen design spec names exactly HOW each screen is built, grounded in the project's real tokens and existing components, so implementation reuses instead of reinventing. This is the premium-planning step that lets lean implementation work. It is OPTIONAL and graduated: worth doing for consequential UI (net-new components, primary or reused surfaces); skip it for trivial one-off tweaks. End the preceding chat message with the canonical 3-horizontal-rule spacer per CLAUDE.md rule #6, then call AskUserQuestion:

- question: "Author per-screen design specs before implementation?"
- header: "Design specs"
- multiSelect: false
- options:
  - label: "Yes – author a spec per screen (Recommended for new or reworked UI)"
    description: "For each affected screen, write a grounded design spec: per-component blocks referencing your real tokens and existing components, states, responsive, accessibility, and acceptance criteria. Implementation builds to these verbatim."
  - label: "Skip"
    description: "Go straight to implementation using the feature spec plus existing components."

On "Skip" → continue to F1.3.5.

On "Yes":

1. Determine the screens to spec from the feature spec's "Affected pages" section.
2. **Spec-authoring is a workflow candidate.** When several screens need specs and Claude Code workflows are available, you can fan the authoring out so each screen's spec is written by its own premium-planning agent. Offer it: "I can author these specs as a workflow – one Opus agent at xhigh effort per screen, run in parallel – or author them inline one at a time. Use a workflow to author each `<screen-slug>.spec.md`?"
   - **Availability gate**: workflows require Claude Code v2.1.154+ on a paid plan. If workflows are unavailable or the user declines, fall back to the single-pass inline path in step 3 below – nothing breaks.
   - **If the user opts in and workflows are available**: dispatch one agent per screen (Opus model, xhigh effort – this is premium planning), each instructed to Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/design-spec/SKILL.md` and follow it inline to author that screen's spec. The workflow takes no mid-run input; collect the authored specs when it returns and present them.
3. **Inline fallback (always available, single pass)**: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/design-spec/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool – plugin skills set `disable-model-invocation: true`), authoring each screen's spec one at a time.
4. Specs are stored feature-scoped at `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md`. The `design-spec` skill reads `ui-design-system` output first so every referenced token and component name is real.

After the specs are authored (by either path), continue to F1.3.5.

### F1.3.5: Optional advisor consult (pre-handoff)

After the spec is drafted at `.design-engineer-plugin/design/features/[feature-slug]/feature-spec.md` and before asking the user what's next, you may consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: the drafted spec, brand voice context (from `.design-engineer-plugin/design/foundation/storybrand.md` if present, else from the user's declaration), affected pages, key interactions, and anything you're uncertain about (scope, naming, what was deliberately left out). Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence. Worth doing when the spec is substantive or the scope is ambiguous; skip it for a small, unambiguous spec.

### F1.4: Hand off

Ask via AskUserQuestion: question="What's next?" options: `[{label: "Implement this feature", description: "Route to /design-engineer:development with the spec"}, {label: "Refine the spec further", description: "Iterate before development"}, {label: "Save and stop", description: "Spec is on disk; pick up later"}]`.

If "Implement", route to `/design-engineer:development` and pass the spec path so the dev command can read it and create an implementation plan respecting it.
