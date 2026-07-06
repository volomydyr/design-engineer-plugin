---
description: Development pipeline. Setup, implementation, and AI-assisted building.
argument-hint: "[setup | pipeline | claude-md | agents | context | github | mcp]"
---

# Development Pipeline

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters). This applies to every option set described in this command body.

## Context

<context> #$ARGUMENTS </context>

Sets up and runs the development workflow. Use after the design pipeline or standalone.

## Step 0: Argument routing

Route on `$ARGUMENTS` before anything else:

- **`claude-md`, `agents`, `context`, `github`, or `mcp`** – run Step 1 (read project context) only, then skip Steps 1.5, 1.55, 1.6, and Step 2 entirely and jump straight to the matching Step 3 setup activity:

  | Argument | Step 3 setup activity |
  |---|---|
  | `claude-md` | CLAUDE.md setup (`dev-claude-md`) |
  | `agents` | Agent pipeline (`dev-agent-setup`) |
  | `context` | Context management (`dev-status-tracking`) |
  | `github` | GitHub workflow (`dev-github-workflow`) |
  | `mcp` | MCP configuration (`dev-mcp-setup`) |

- **`setup`** – run Step 1, skip Steps 1.5–1.6, and go to Step 2 with the plan restricted to the setup activities (no Feature implementation).
- **`pipeline` or no argument** – proceed through the full path unchanged: Step 1 → 1.5 → 1.55 → 1.6 → 2.

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for project type and environment
2. Scan the project: what tech stack, what build tools, does CLAUDE.md exist, are agents configured?
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:launch` first

## Step 1.5: Apply UX/psych depth from feature options

If the user came from `/design-engineer:discovery` (existing-project feature flow), they may have selected optional depth steps in discovery.md Step 2.5. Surface those insights HERE — before plan generation in Step 2 — so the implementation plan reflects them. Application is inline (Reads + analysis); do not produce separate deliverable files unless the underlying skill prescribes one.

1. Read `.design-engineer-plugin/config.yaml`. Look for `project.feature_options:` (a list of strings).
2. If the key is missing or the list is empty, skip this step entirely.
3. For each option in the list, perform the corresponding skill load and apply it inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true` and the Skill tool will reject them. Always Read SKILL.md and follow its instructions inline.

| Selected option | What to do |
|---|---|
| `Psychology audit` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-decision-fundamentals/SKILL.md` and follow it inline against the planned feature, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-cognitive-load/SKILL.md` and follow it inline. |
| `Figma comparison` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-figma-guide/SKILL.md` and follow it inline to pull structured Figma data and compare to the plan. |
| `Design-system check` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/SKILL.md` and follow it inline against the project's existing tokens and components. |
| `Brief problem statement` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-problem-statement/SKILL.md` and follow it inline. Rare in this command's context but supported when the feature was ambiguous and the design step skipped it. |

4. After each option's skill is applied, surface the insights to the user in a short summary (1–3 bullets per option) BEFORE moving to Step 1.55 / Step 2. The point is to inform plan generation, not to gate it — proceed once the user has seen the surfaced findings.
5. Once all selected options have been applied, remove the `project.feature_options` key (or set it to an empty list) in `.design-engineer-plugin/config.yaml`. Selections are one-shot – stale entries must not re-run the previous feature's audits on later `/design-engineer:development` invocations.

If `project.feature_options` is absent (e.g., user invoked `/design-engineer:development` directly without going through discovery.md, or the project is `project_type: new`), skip this step silently and proceed to Step 1.55.

## Step 1.55: Detect build targets

Read the MVP requirements and Information Architecture documents (if they exist). Before suggesting any tech stack, the product type, platform, and technical requirements should be obvious from these documents. Do not suggest technologies that contradict the product design (e.g., do not suggest Electron for a native macOS overlay app).

Identify distinct build targets – for example:
- macOS app + web landing page = 2 targets
- Chrome extension + backend API = 2 targets
- Web app only = 1 target

If multiple build targets exist, ask via AskUserQuestion:

```
question: "Your product has multiple build targets. Which would you like to build first?"
header: "Build targets"
options:
  - label: "[Target 1]"
    description: "[Tech stack and scope]"
  - label: "[Target 2]"
    description: "[Tech stack and scope]"
multiSelect: false
```

Each build target gets its own development setup: tech stack, repo/folder, CLAUDE.md, design system, development loop. After the first target is complete, ask if the user wants to proceed to the next target.

**BLOCKING REQUIREMENT**: If multiple targets detected, wait for the user's choice before proceeding.

## Step 1.6: Design grounding pre-flight

Before any UI code is generated in this command, ground yourself and output the Design Grounding block below. This is written method, not optional: UI work that skips it drifts into AI-slop defaults that ignore the user's taste. Before writing or editing any UI file (.tsx .jsx .html .svelte .vue .css .scss), you MUST have:

1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
4. Confirmed `.design-engineer-plugin/design/exploration/references/references.md` exists in the project (run `ui-references-moodboard` first if missing)
5. Read `.design-engineer-plugin/prototype/prototype.html` if it exists – implementation MUST match its layout, spacing, typography, and color choices. No creative deviation.
6. If per-screen `.spec.md` files exist for this feature, read them now – build to them, no improvisation. Look under `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md` (and `.design-engineer-plugin/design/specs/<surface-slug>.spec.md` for standalone surfaces). Each spec's per-component ```yaml blocks (token refs, reused-component refs by path, states, responsive, a11y) and EARS acceptance criteria are BINDING – the implementation reuses exactly those components and tokens and satisfies every acceptance criterion. Where a spec exists for a screen you're about to build, it overrides any improvised choice.

**Behavior on missing files**:

- If `.design-engineer-plugin/prototype/prototype.html` is **missing**: skip prototype check (the feature-spec branch deliberately bypasses prototyping). Implement using design references + gallery only.
- If any of the three `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/.../*.md` plugin docs are **missing**: this means the plugin install is corrupt. Surface the error, don't try to proceed without them.

**Project signal detection** (run before the CLAUDE.md and references checks below):

Read `.design-engineer-plugin/config.yaml`. The deterministic branches below depend on `project.context.shipped_ui` (boolean) and `project.context.component_count` (integer). Treat the project as **established** when `shipped_ui: true` OR `component_count > 0`. Otherwise treat it as **greenfield**. If the config does not have these fields yet, fall back to a quick filesystem check: established if `src/components/`, `app/components/`, `components/` (top level), or any equivalent component directory contains 1+ `.tsx`/`.jsx`/`.vue`/`.svelte` files.

**CLAUDE.md missing**:

- **Established project**: silently scaffold via the `dev-claude-md` skill in non-interactive mode. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-claude-md/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`). The skill's Step 0.5 detects this command's non-interactive request and runs an inference pass over the codebase instead of the question-driven flow. After the scaffold, surface a one-line confirmation: "Created CLAUDE.md from your existing components — review it later if you want." Do NOT ask the user a question for this.
- **Greenfield project**: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-claude-md/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool). The skill's interactive Step 1+ flow is the right path here.

**`.design-engineer-plugin/design/exploration/references/references.md` missing**:

- **Established project (`shipped_ui: true`)**: ask exactly ONE question with two options. End the preceding chat message with the canonical 3-horizontal-rule spacer, then call AskUserQuestion:

  ```
  - question: "Use existing components as the visual reference, or provide image references?"
  - header: "References"
  - options:
    - label: "Reuse existing UI (Recommended)"
      description: "Treat the existing components/pages as the visual baseline. I'll scan them, write a short references.md naming the patterns to preserve (typography, spacing, color tokens, layout primitives), and any UI work will follow them."
    - label: "Provide image references"
      description: "Run the moodboard skill — pick references in your browser, I'll capture them at high quality, and we'll establish design intent from those images."
  - multiSelect: false
  ```

  - **If user chooses "Reuse existing UI (Recommended)"**:
    1. Run `mkdir -p .design-engineer-plugin/design/exploration/references` to ensure the destination exists.
    2. Use Glob to scan `src/components/`, `src/app/`, `app/components/`, or whatever component directory the project actually uses (detect from filesystem).
    3. Write `.design-engineer-plugin/design/exploration/references/references.md` with three sections: (a) a 1-paragraph design intent inferred from CLAUDE.md and the repo, (b) a "Reuse" section listing the actual component file paths and their roles in the UI, (c) a "Do not introduce" section forbidding new tokens, new typefaces, or new component variants without explicit user request.
    4. Do not ask further questions about visual direction — the existing components ARE the direction.

  - **If user chooses "Provide image references"**:
    1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/SKILL.md` and follow its instructions inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`.

- **Greenfield project (`shipped_ui: false`)**: do not write UI until references exist. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool).

After the Reads, output this block and fill in EVERY field:

### Design Intent
- **Who is this human**: [a specific person, not "users"]
- **What verb must they accomplish**: [the actual action]
- **How should this feel**: [warm like a notebook / cold like a terminal / dense like a trading floor / calm like a reading app / precise / playful – NEVER "clean and modern"]

### Domain Exploration
- **Domain words (5+)**, **Color world (5+)**, **Signature element (1)**, **Named defaults (3)**

### WHY Checkpoint
- Palette WHY, Depth WHY, Surfaces WHY, Typography WHY (NOT Inter/SF Pro/Roboto/Lato/Montserrat without stated reason), Spacing WHY, Token names WHY (NOT `--gray-N`, `--surface-N`, `--primary`)

### Anti-pattern self-check
- [ ] Cream/beige bg + orange CTA, 3D emoji as illustration, emoji avatars, pill chips with emoji, generic CTA copy, default fonts, generic tokens, cards-in-cards, identical card grids, glassmorphism, centered everything, default drop shadows, gradient text, purple-blue gradients, modal for everything

### Signature Test
List 5 specific places where design intent manifests. If fewer than 5 concrete components – STOP and rework.

For the full guidance behind each field (with prompts and examples), see `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md` and `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`.

## Step 2: Plan

Based on what you found, present a plan. Only suggest what's relevant:

- **CLAUDE.md setup** – needed if no CLAUDE.md exists or it's outdated
- **Agent pipeline** – needed if no agents are configured
- **MCP configuration** – only if MCPs are missing or misconfigured
- **GitHub workflow** – only if git is initialized and no workflow is set up
- **Context management** – needed for long-running projects
- **Kick-start prompts** – helpful for teams, optional for solo
- **Feature implementation** – if the user's goal was "Implement from Figma" or they have a specific feature to build

Argument routing already happened in Step 0 – single-activity arguments never reach this step, and the `setup` argument restricts this plan to the setup activities only.

Ask the user to confirm or adjust the plan.

## Step 3: Execute

### Setup activities

| Activity | Skill |
|----------|-------|
| CLAUDE.md setup | `dev-claude-md` |
| Agent pipeline | `dev-agent-setup` |
| MCP configuration | `dev-mcp-setup` |
| GitHub workflow | `dev-github-workflow` |
| Context management | `dev-status-tracking` |
| Kick-start prompts | `dev-starter-prompts` |

Run one at a time, present results, and ask for feedback after each activity.

### Feature implementation

Announce this plan to the user before doing anything: "Here's what I'm going to do: 1) read the existing project patterns and any per-screen design specs for this feature, 2) read the prototype if one exists, 3) walk you through 3–5 implementation decisions with options to choose from (the MVP requirements are intentionally high-level – the implementation choices are yours, not mine), 4) read the plan template, 5) enter Plan Mode and draft the plan with your decisions baked in, 6) get your approval and save the approved plan to the project, 7) create a feature branch, 8) write the plan's tests first, 9) if the build has a verifiable end state, suggest an optional /goal command you can run, 10) implement phase by phase – each phase gets a drift check against the decisions we agreed, is presented for your approval, and is committed once you approve it, 11) run the design-system audit at the end, and 12) tidy any stray working files before opening a PR."

Before writing ANY code, follow these steps in order:

**1. Read existing patterns**: Scan the project's component architecture (atoms/, molecules/, organisms/, pages/). Understand design tokens, naming conventions, file structure. Read relevant skill reference files for design knowledge.

**1.0 Read the per-screen design specs (BINDING build input)**: If `.spec.md` files exist for this feature (under `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md`, or `.design-engineer-plugin/design/specs/<surface-slug>.spec.md` for standalone surfaces), Read each one before drafting the plan. For every screen with a spec, extract from its per-component ```yaml blocks the exact list of required components (reused by path vs net-new), the interactions and states, the responsive and a11y requirements, and the EARS acceptance criteria. These are the build inputs the plan must satisfy verbatim – reuse the referenced components, bind to the referenced tokens, do not reinvent. Carry the extracted component/interaction list into the pre-plan dialogue (Step 1b.1) and the plan itself; the spec, where it exists for a screen, is the source of truth that overrides any improvised default. If no `.spec.md` exists for a screen, proceed with the rest of this section unchanged.

**1a. Read the prototype FIRST if it exists**: If `.design-engineer-plugin/prototype/prototype.html` exists, Read it before anything else. It is the visual baseline for the implementation – your code must match its layout, spacing, typography, and color choices. No creative deviation. Do not write UI if the prototype exists but was not Read this session.

**1b. Pre-plan MVP dialogue (REQUIRED before plan mode)**: MVP requirements are intentionally HIGH-LEVEL — they name what the user can do, not how the screen executes it. Without a per-decision dialogue, you will pick implementation defaults from your own interpretation and produce AI-slop UI that ignores the user's specific taste. The pre-plan dialogue is the design-discussion phase the dev pipeline lives or dies on.

Do the dialogue first and persist its outcome to `.design-engineer-plugin/design/dev/decisions.md` before drafting any plan. Do not call `ExitPlanMode` until that file exists. Drafting a plan without doing the dialogue first wastes work.

Run this sequence BEFORE Step 2:

**1b.1 Surface upstream context** — Quote, in chat, what the existing deliverables say about this feature. No paraphrasing — exact phrases.

> ### MVP requirement(s) in scope: <list>
>
> **From `mvp-requirements.md`** ("<exact section / line>"):
> - <quote>
>
> **From `information-architecture.md`** (the screens this feature touches):
> - <quote with screen names + nav context>
>
> **From `references.md`** (design intent, palette, typography, flavor):
> - <quote>
>
> **From `bias-audit.md`** (UI moves the implementation must apply, if any):
> - <quote>
>
> **From the per-screen design spec** (if a `<screen-slug>.spec.md` exists for a screen this feature touches) – BINDING:
> - <required components: reused-by-path vs net-new, quoted from the spec's `reuse` / component ```yaml blocks>
> - <required interactions + states, quoted from the spec>
> - <EARS acceptance criteria the build must satisfy, quoted verbatim>
>
> **From the prototype** (if `.design-engineer-plugin/prototype/prototype.html` exists):
> - <observed pattern, layout decisions already locked in>

If a deliverable doesn't exist or doesn't address this feature, STOP. Use `AskUserQuestion` to ask the user whether to (a) update the missing deliverable first, (b) provide the missing input directly in chat, or (c) proceed without it and accept the quality drop. Never silently fabricate.

**1b.2 List 3–5 of the most consequential open implementation decisions** for THIS feature. Pick from these categories — these are where defaults silently win:

- **Component reuse strategy** — extend an existing atom/molecule with new props, or create a new component
- **Data flow & state management** — local component state / lifted state / context / store / server-cache
- **Error handling pattern** — inline form errors / toast notifications / full-screen error states / silent retry
- **Copy direction** — literal/instructional / branded-and-specific / terse-utility / conversational (must match `storybrand.md` voice if present)
- **Accessibility surface area** — keyboard-only / screen-reader / reduced-motion / contrast — which states get explicit testing
- **Performance budget** — what's the acceptable initial render time, first paint cost, bundle delta
- **Test strategy** — happy-path only / + key edge cases / + accessibility + visual regression / + load
- **Deployment surface** — feature-flagged behind a kill-switch / fully shipped / behind login / public

Cap at 5 decisions. Over-elaboration is its own failure mode. Pick the 3–5 that, if defaulted, would most damage the implementation given the chosen aesthetic flavor (from `references.md`) and the upstream constraints. Adjust the decision list per feature — do NOT mechanically pick the same 5 every time.

**1b.3 For EACH decision, run an AskUserQuestion** with 2–4 named options. Each option's description must be a one-sentence trade-off summary referencing concrete patterns when useful. Format (canonical 3-line spacer per CLAUDE.md rule #6 before each call):

```
question: "Decision N of M for <feature>: <decision category>: <plain-language framing>"
header: "<feature>: <decision>"
options:
  - label: "<option 1 short label>"
    description: "<concrete pattern + 1-sentence trade-off>"
  - label: "<option 2 short label>"
    description: "<...>"
  - label: "<option 3 short label, optional>"
    description: "<...>"
  - label: "<option 4 short label, optional>"
    description: "<...>"
multiSelect: false
```

Do NOT add an explicit "Other" option – AskUserQuestion has a built-in free-text Other, so the user always has an escape hatch. Wait for the user's answer on each decision before asking the next. Do NOT batch multiple decisions into one AskUserQuestion. Do NOT skip ahead and start drafting the plan before all decisions are answered.

**1b.4 Persist the decisions** to `.design-engineer-plugin/design/dev/decisions.md` (create the directory if it doesn't exist: `mkdir -p .design-engineer-plugin/design/dev`). Format:

```markdown
# Implementation decisions — <feature name>

Source: `mvp-requirements.md` (<requirement quote>), `information-architecture.md` (<screens>)

## <Decision category 1>
Chose **<option>** over <alternatives>. Reason: <user's reasoning, or "user preference / no reason given" if none stated>.

## <Decision category 2>
Chose **<option>** over <alternatives>. Reason: <…>.

…
```

This file is a durable deliverable, committed alongside the plan. It exists so a future session (or a new collaborator) can understand WHY the implementation looks the way it does — the decisions log is the "minutes" of the design dialogue.

**1b.5 ONLY THEN proceed to Step 2.** No hook enforces this for you – before calling `ExitPlanMode`, verify that `.design-engineer-plugin/design/dev/decisions.md` exists and contains every decision from 1b.3; if it does not, go back and complete 1b.4 first.

**2. Read the plan template**: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-setup/references/plan-template.md` – this is the exact format your plan must follow.

**3. Enter Plan Mode**: Use `EnterPlanMode` to write the implementation plan. Do NOT present the plan as chat text, a summary table, or TaskCreate items. The plan MUST follow the template format with all required fields: Summary, Phases (each with Objective, Depends on, Files, Reuse, Checklist, QA), Risk assessment, Questions for user.

**4. Get approval**: Use `ExitPlanMode` for user approval.

**5. Copy the plan**: IMMEDIATELY after approval, copy the plan to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[descriptive-name].md`. Create the `.design-engineer-plugin/plans/` directory if it doesn't exist. The plan is the durable record of what was approved; keep it on disk before writing any code so implementation can be checked against it.

**6. Create feature branch**: If on main/master, run `git checkout -b feat/[plan-slug]`.

**7. Tests first**: Before writing production code, write the plan's tests as failing Playwright CLI test scripts in `tests/`, then run them to verify the Red phase (they fail because the feature is missing). Write them inline by default. Dispatch `Task(test-writer, plan_path=<path>)` only when the test surface is large enough to flood the main context or when it can run in parallel with other work. Avoid the common test anti-patterns: testing mock behavior, test-only methods in production, mocking without understanding, incomplete mocks, and tests written after the implementation.

**7.1 Preflight first – playwright-cli must exist before any test script does.** The test scripts shell out to `playwright-cli`, which the plugin does not bundle. Before writing or dispatching any test scripts, run a single check: `command -v playwright-cli`. If it is on PATH, proceed exactly as above. If it is absent, do NOT write scripts yet – a missing harness makes every script exit non-zero and fake a "correctly failing" Red phase. Instead, end the preceding chat message with the canonical 3-line spacer (per the spacer rule at the top of this command), then ask via AskUserQuestion:

```
question: "Script-based TDD needs playwright-cli, which isn't installed. How do you want to verify this feature?"
header: "Test harness"
options:
  - label: "I'll install playwright-cli – recheck and continue"
    description: "Install it per its own docs, then I re-run the check once and proceed with script TDD"
  - label: "Skip script TDD for this feature"
    description: "I verify each phase with the bundled Playwright browser tools instead – navigate and snapshot per phase"
multiSelect: false
```

If the user picks the first option, wait for them to confirm the install, re-run `command -v playwright-cli` once, and proceed with Step 7 normally. If it is still absent, fall back to the second option. If the user picks the second option, note in the plan that Red/Green is checked per phase by navigating and snapshotting via the bundled Playwright MCP tools, and skip writing `tests/` scripts for this feature. Do not invent an install command for the user – playwright-cli's own docs are the source of truth. This preflight runs BEFORE the rest of Step 7 – no script is written and no `Task(test-writer, ...)` is dispatched until it passes or the user chooses the fallback.

**7.5 Suggest a `/goal` for the build (suggest-and-wait, only when a verifiable end state exists)**: At the point UI implementation begins – right before the first phase writes code – check whether this build has a verifiable end state: a per-screen `.spec.md` exists for the feature, OR you are recreating a Figma design, OR recreating a web frontend verified via Playwright, OR the user gave strict Playwright-verifiable rules. If none of those hold, skip this step and go to Step 8.

`/goal` is a Claude Code built-in (CC v2.1.139+) that sets a completion condition and keeps taking turns until it holds – its headline use is implementing a design doc until all acceptance criteria are met. It is **user-invoked only**: the plugin SUGGESTS a ready-to-paste `/goal` and STOPS for the user; it NEVER invokes `/goal` itself.

1. **Availability gate**: `/goal` requires Claude Code v2.1.139+. If you cannot confirm the running version supports it, or the user has indicated `/goal` is unavailable, skip this step silently and proceed to Step 8 normally.
2. **Compose the completion condition from the spec's EARS acceptance criteria.** When a `.spec.md` exists, pull every screen's EARS acceptance criteria verbatim and join them into the goal condition; append the standing build invariants: verified via at least 3 Playwright iterations, zero hardcoded values (tokens only), and only reused components (no reinvented ones). When no spec exists but a Figma/Playwright end state does, phrase the condition as "the built UI matches <the Figma design / the reference frontend> as confirmed by Playwright, with zero hardcoded values and only reused components."
3. **Present the ready-to-paste command and STOP.** Show the user the exact line to paste, e.g.:

   > Optional: paste this into Claude Code to have it keep iterating until the spec is satisfied (you run it, I never do):
   >
   > `/goal Implement <feature> until all acceptance criteria hold: <EARS criteria joined>; verified via ≥3 Playwright iterations, zero hardcoded values, only reused components.`
   >
   > Or just say "go" and I'll proceed with the normal phase-by-phase flow without `/goal`.

4. **Wait for the user.** Do NOT invoke `/goal` yourself under any circumstance. If the user pastes it, the goal loop drives the build; if they say "go" or decline, proceed to Step 8 normally. Either way the per-phase flow below still applies.

**8. Implement phase by phase**: Follow the plan's phases in order. For each phase:
   a. Implement only this phase's changes. Do this inline by default. Dispatch a subagent (`Task(frontend-implementer, phase=<n>, plan=<path>)` for UI work, `Task(backend-implementer, phase=<n>, plan=<path>)` for backend work) only when the phase is large enough to flood the main context or when independent phases can genuinely run in parallel. Every Task prompt that dispatches a plugin agent MUST include a line `PLUGIN_ROOT: <absolute path>` carrying the resolved DESIGN_ENGINEER_PLUGIN_ROOT from your context, so the agent can Read the plugin's reference files (agents do not inherit this conversation). Whether you implement inline or via an implementer, the same grounding applies: keep every component in the component gallery (imported from its production source, no inline styles), use design tokens rather than raw values, and match Figma designs pixel-for-pixel when they exist. When you dispatch, wait for the agent to return before continuing.

   **a.1 Drift audit (runs immediately after the phase's code is written)**: output the structured "Drift audit" block in chat before any further work — before `/simplify`, before presenting the phase. The block traces every user-facing element (button, link, image, headline, label, placeholder, CTA, badge, icon, chip, modal title, error message, empty state, tooltip) to a specific source line in `.design-engineer-plugin/design/dev/decisions.md` (dev dialogue), `.design-engineer-plugin/prototype/decisions.md` (prototype dialogue), `mvp-requirements.md`, `information-architecture.md`, `references.md`, or `storybrand.md` — OR admits the element as drift. Drift items default to "remove now"; only borderline cases warrant `AskUserQuestion`. This catches the dev-pipeline failure mode where the model invents marketplace-pattern features (heart icons, "trusted seller" badges, shipping/returns copy, newsletter opt-ins, etc.) that nobody asked for. Without the visible audit, drift compounds across phases and "match the visual reference" silently overrides the spec.

   Continue with `/simplify` only after the drift audit is output and any drift items have been addressed.
   b. Run `/simplify` on changed code, scaled to the change size (per CLAUDE.md "Code Quality: /simplify" tier table). Trivial single-property swaps: skip `/simplify`, inline self-review only. Medium changes (≤50 lines): single `/simplify` call. Large changes (>50 lines or new file): full `/simplify` (3-agent fan-out runs internally).
   c. Completeness review: check the plan's checklist for this phase
   d. **Optional advisor consult (pre-done)**: on a non-trivial phase, after deliverables are durable (files written, tests run, screenshots captured), you may consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: phase summary, what was implemented, test/screenshot results, anything that surprised you. Apply the advice. If it conflicts with primary-source evidence (a file says X, a test result shows Y), do a single reconcile call. Skip on trivially-scoped phases (one-line edits, type-only changes). For a psychology pass on the UI of this phase, run `/design-engineer:review`.
   e. Present to user with QA instructions from the plan
   f. Wait for approval before next phase
   g. **BLOCKING REQUIREMENT — commit and push BEFORE starting the next phase.** After the user approves this phase, commit its changes and push using `dev-github-workflow` Mode 1 (Conventional Commits format with phase context AND the plugin attribution footer — Mode 1 is plan-driven so the footer is included; Mode 2 manual user commits do NOT include the footer). Do NOT defer commits to the end of all phases. Do NOT batch multiple phases into a single end-of-implementation commit. Phase boundaries are commit boundaries — one phase, one commit, in the same turn the user approves it. The next phase does not start until this phase is committed and pushed. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-github-workflow/SKILL.md` and follow its Mode 1 instructions inline (do NOT use the `Skill` tool — plugin skills disable model invocation).

**9. After all phases**: Run `Task(design-system-auditor, scope=<changed paths>)` to audit BOTH design system compliance AND aesthetic quality (4 lenses + 4 named tests + AI Slop Test). Include a `PLUGIN_ROOT: <absolute path>` line in the Task prompt, carrying the resolved DESIGN_ENGINEER_PLUGIN_ROOT from your context, so the agent can Read the plugin's critique and gallery-contract reference files. This audit warrants a dedicated agent — it encodes the FAIL-severity gallery contract, design-token compliance rules, and the anti-slop catalog, and runs the heaviest reasoning in the pipeline. Wait for the agent to return; do not continue until its output is available. Review aesthetic FAILs before presenting the implementation to the user — these are blocking advisories, not optional.

**9.5 Tidy-up (BLOCKING — before PR creation)**: review the working tree for stray disposable artifacts that may have leaked outside `.design-engineer-plugin/temporary/scratch/` and the canonical deliverable paths. Run `git status --short` and inspect every untracked / modified file. Classify each per CLAUDE.md "File hygiene (durability tiers)":

- **Durable deliverable** (committable as-is) → leave it.
- **Disposable working artifact** in the wrong place (Playwright dump at project root, intermediate analysis dump under `design/<subdir>/`, ad-hoc debug file anywhere outside `.design-engineer-plugin/temporary/scratch/`) → move it to `.design-engineer-plugin/temporary/scratch/<purpose>/<YYYY-MM-DD-HHMMSS>/` so it's git-ignored, OR delete it if it has no debug value.
- **Pattern that should be git-ignored permanently** (test runner outputs, build caches, framework-specific dumps not yet covered by the existing `.gitignore` block) → ask the user whether to add the pattern to `.gitignore`'s `# === BEGIN design-engineer-plugin ===` block.

Surface findings to the user as a short list before any PR creation: "I found N files outside the canonical paths. Here's my proposed disposition for each — confirm or override before I move on." Do NOT silently move or delete files; the user must approve each disposition. Skip this step only if `git status --short` is empty or contains only modified files within tracked canonical paths.

**Documentation timing rule** (canonical for this command): a per-phase boundary uses a **lightweight flush** – one `compound-documenter` agent dispatch with a short brief (phase completed, files changed, deliverable paths, any cross-cutting decisions). Run it after the user approves the phase (alongside step g's commit), never before presenting QA. This is the same cadence the design pipeline uses; it keeps the compound-documenter's pipeline-state.md in sync without the full documentation ceremony. The full `meta-document` skill – including its temporary/ purge – runs only at Post-execution (below); never run it mid-pipeline, and never purge `temporary/` between visual-verification captures and presenting QA (the captures are the QA evidence).

### Visual verification (UI changes only)

After implementing changes to UI components or pages:
1. Start the dev server if not running (`npm run dev` or equivalent)
2. Use Playwright to navigate to the affected page on localhost
3. Take a screenshot. Per CLAUDE.md "Playwright filesystem hygiene", visual-verification captures are throwaway debug artifacts and MUST be saved under `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/visual-verification-<page-slug>.png`. Run `mkdir -p .design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>` first. Never call the Playwright `browser_take_screenshot` tool without an explicit `filename` — the `de-playwright-path-hook` denies it (the hook matches both the bundled and standalone Playwright servers). Playwright tool ids carry a server prefix – `mcp__plugin_design-engineer_playwright__<tool>` for the plugin's bundled server, or `mcp__playwright__<tool>` if the project has its own Playwright MCP; use whichever appears in your tool list.
4. Analyze: does the result match expectations? Check layout, spacing, color, animation direction, element visibility
5. If issues found: fix them before presenting to the user
6. If clean: proceed to present the phase for review

Skip this step for data-only, type-only, or configuration changes.

### Presenting results

**When to dispatch a subagent**: do the work inline by default. Dispatch a subagent (`Task(<agent>, ...)`) only when the work would flood the main context or when independent work can genuinely run in parallel. The `design-system-auditor` pass is the one step that always warrants its own agent — its critique is heavy and specialized. For everything else, inline is the default and a dispatch is a deliberate choice, not a requirement. If a dispatched agent returns a `BLOCKED – needs user input` section, relay its question to the user via AskUserQuestion, then re-dispatch the agent with the answer and the agent's progress summary included in the prompt.

Present results to the user step by step with `AskUserQuestion` between findings / sections. When a subagent ran, parse its output rather than dumping it raw.

## Post-execution

After all phases of feature implementation are complete (including the `design-system-auditor` pass), present the post-execution options to the user.

ALWAYS use AskUserQuestion with specific options. Never end with a plain text question.

For existing projects:
```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Next feature"
    description: "Pick up the next feature from the build sequence"
  - label: "Review implementation"
    description: "Review the implementation for quality, accessibility, or design compliance"
  - label: "Document what we changed"
    description: "Record what was built and why"
  - label: "Done for now"
    description: "End the session"
```

On selection:

- "Next feature" → re-enter the Feature implementation flow (Step 3) from its start for the next MVP requirement in the build sequence, or ask which feature to build if no sequence exists.
- "Review implementation" → announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/review.md` and follow its instructions inline, scoped to what was just built.
- "Document what we changed" → announce the transition in one sentence, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/document.md` and follow its instructions inline.
- "Done for now" → for `project_type: new`, run the Completion marker section below before ending; then end the session – the user can pick up later with `/design-engineer:launch`.

For new products (project_type: new), run the full `meta-document` at this Post-execution milestone before presenting options: Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/meta-document/SKILL.md` and follow its instructions inline (never the `Skill` tool). This milestone run includes the schema-validated documentation entry and the temporary/ purge – the per-phase lightweight flushes above deliberately skip both. After the meta-document run, new products present the SAME four options above with the same handlers – the option set is shared across project types; only the meta-document auto-invoke and the Completion marker below are new-product-specific.

### Completion marker (project_type: new only)

This Post-execution point is where the from-scratch pipeline finishes its last step. When the build that just completed was part of the from-scratch product build (`.design-engineer-plugin/config.yaml` has `project_type: new`), confirm with the user that the product is actually complete before writing the completion marker – finishing one feature does not mean the whole MVP is built. Once written, the marker routes the now-shipped product into the iterate flow on the next launch instead of the from-scratch returning path.

1. Read `.design-engineer-plugin/config.yaml`.
2. Proceed only if it has `project_type: new`. If `project_type: existing`, skip this entirely – existing projects are already in the iterate flow and never carry a from-scratch completion marker.
3. If the config already contains a top-level line `status: complete`, do nothing (idempotent – do not duplicate it).
4. Otherwise confirm completion with the user before writing anything:
   - If `.design-engineer-plugin/design/planning/mvp-requirements.md` exists, read it and list in chat any requirements not yet built. If the file is missing, skip the list.
   - Ask one AskUserQuestion (canonical 3-line spacer before the call, per the spacer rule at the top of this command):

   ```
   question: "Is the product complete, or are there more MVP features to build?"
   header: "Completion"
   multiSelect: false
   options:
     - label: "Product complete"
       description: "Mark the product shipped – next launch uses the iterate flow"
     - label: "More to build"
       description: "Keep the from-scratch pipeline open for the remaining features"
   ```

   - On "Product complete": append (or set) a single top-level line `status: complete` in `.design-engineer-plugin/config.yaml`. Keep it top-level (sibling of `project_type:` / `resume:`), so launch reads it as the `returning_complete` signal. Do not remove or rewrite any other field; this is additive.
   - On "More to build": write nothing and proceed to the normal Post-execution options above.
5. Note the completion in the documentation flush: when you run the full meta-document at Post-execution above (loaded inline — never the Skill tool), include "from-scratch pipeline complete – product shipped, marked complete in config" in the context you pass to compound-documenter, so the pipeline-state reflects the shipped state.

This is fail-safe: if the marker is absent (e.g. the build was interrupted before reaching Post-execution), launch behaves exactly as it does today. The marker only ever flips a fully-finished from-scratch product into the iterate flow on its next launch.
