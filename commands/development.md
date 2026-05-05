---
name: design-engineer:development
description: Development pipeline. Setup, implementation, and AI-assisted building. Mode determined by your config.
argument-hint: "[setup | pipeline | claude-md | agents | context | github | mcp]"
---

# Development Pipeline

## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.

> **Spacer rule (per CLAUDE.md rule #6)**: Before every `AskUserQuestion` tool call this command makes, end the preceding chat message with the canonical 3-horizontal-rule spacer (three lines of `─` characters). This applies to every option set described in this command body.

## Context

<context> #$ARGUMENTS </context>

Sets up and runs the development workflow. Use after the design pipeline or standalone.

## Step 1: Read project context

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/autopilot), project type, and environment
2. Scan the project: what tech stack, what build tools, does CLAUDE.md exist, are agents configured?
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/design-engineer:launch` first

## Step 1.5: Apply UX/psych depth from feature options

If the user came from `/design-engineer:discovery` (existing-project feature flow), they may have selected optional depth steps in design.md Step 2.5. Surface those insights HERE — before plan generation in Step 2 — so the implementation plan reflects them. Application is inline (Reads + analysis); do not produce separate deliverable files unless the underlying skill prescribes one.

1. Read `.design-engineer-plugin/config.yaml`. Look for `project.feature_options:` (a list of strings).
2. If the key is missing or the list is empty, skip this step entirely.
3. For each option in the list, perform the corresponding skill load and apply it inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true` and the Skill tool will reject them. Always Read SKILL.md and follow its instructions inline.

| Selected option | What to do |
|---|---|
| `Psychology audit` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-decision-fundamentals/SKILL.md` and follow it inline against the planned feature, then Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/psych-cognitive-load/SKILL.md` and follow it inline. |
| `Figma comparison` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-figma-guide/SKILL.md` and follow it inline to pull structured Figma data and compare to the plan. |
| `Design-system check` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-design-system/SKILL.md` and follow it inline against the project's existing tokens and components. |
| `Brief problem statement` | Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ux-problem-statement/SKILL.md` and follow it inline. Rare in dev.md context but supported when the feature was ambiguous and the design step skipped it. |

4. After each option's skill is applied, surface the insights to the user in a short summary (1–3 bullets per option) BEFORE moving to Step 1.55 / Step 2. The point is to inform plan generation, not to gate it — proceed once the user has seen the surfaced findings.

If `project.feature_options` is absent (e.g., user invoked `/design-engineer:development` directly without going through design.md, or the project is `project_type: new`), skip this step silently and proceed to Step 1.55.

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
allowMultiSelect: false
```

```
multiSelect: false  # User must choose one target to start with
```

Each build target gets its own development setup: tech stack, repo/folder, CLAUDE.md, design system, development loop. After the first target is complete, ask if the user wants to proceed to the next target.

**BLOCKING REQUIREMENT**: If multiple targets detected, wait for the user's choice before proceeding.

## Step 1.6: Design Grounding Pre-Flight (BLOCKING)

Before any UI code is generated in this command, you MUST output the Design Grounding block below. The `de-design-grounding-hook` (PreToolUse) hard-denies Write/Edit/MultiEdit on UI files (.tsx .jsx .html .svelte .vue .css .scss) until you have:

1. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-aesthetic-review/references/anti-patterns.md`
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/shared-references/anti-slop-writing.md`
3. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/references/design-intent-guide.md`
4. Confirmed `.design-engineer-plugin/design/exploration/references/references.md` exists in the project (run `ui-references-moodboard` first if missing)
5. Read `.design-engineer-plugin/prototype/prototype.html` if it exists – implementation MUST match its layout, spacing, typography, and color choices. No creative deviation.

**Behavior on missing files** (so you know what's happening before the hook denies a write):

- If `.design-engineer-plugin/prototype/prototype.html` is **missing**: skip prototype check (the v4.7.0 feature-spec branch deliberately bypasses prototyping). Implement using design references + gallery only.
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

- **Greenfield project (`shipped_ui: false`)**: hook denies UI writes until references exist. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-references-moodboard/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool).

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

For the full inlined block content (with prompts and examples), see `agents/frontend-implementer.md` Design Grounding Pre-Flight section.

## Step 2: Plan

Based on what you found, present a plan. Only suggest what's relevant:

- **CLAUDE.md setup** – needed if no CLAUDE.md exists or it's outdated
- **Agent pipeline** – needed if no agents are configured
- **MCP configuration** – only if MCPs are missing or misconfigured
- **GitHub workflow** – only if git is initialized and no workflow is set up
- **Context management** – needed for long-running projects
- **Kick-start prompts** – helpful for teams, optional for solo
- **Feature implementation** – if the user's goal was "Implement from Figma" or they have a specific feature to build

If an argument was provided (`/design-engineer:development setup`, `/design-engineer:development pipeline`), skip planning and go directly to that activity.

In **Guided mode**: ask the user to confirm or adjust the plan.
In **Autopilot**: show the plan briefly, then execute.

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

If the user invoked `/design-engineer:development setup` (the setup-activities sub-flow), run this Bash command at the start of this section to mark the active workflow so the process-recall hook can fire context-appropriately:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "dev:setup" > .design-engineer-plugin/.active-workflow
```

In **Guided mode**: run one at a time, present results, ask for feedback.
In **Autopilot**: run all planned activities, present summary.

After all setup activities for this invocation are complete, clear the marker:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

### Feature implementation

At the start of feature implementation, run this Bash command to mark the active workflow so the process-recall hook can fire context-appropriately:

```bash
mkdir -p .design-engineer-plugin && printf '%s\n' "dev:feature-implementation" > .design-engineer-plugin/.active-workflow
```

Before writing ANY code, follow these steps in order:

**1. Read existing patterns**: Scan the project's component architecture (atoms/, molecules/, organisms/, pages/). Understand design tokens, naming conventions, file structure. Read relevant skill reference files for design knowledge.

**1a. Read the prototype FIRST if it exists**: If `.design-engineer-plugin/prototype/prototype.html` exists, Read it before anything else. It is the visual baseline for the implementation – your code must match its layout, spacing, typography, and color choices. No creative deviation. The `de-design-grounding-hook` denies UI Writes if the prototype exists but was not Read this session.

**2. Read the plan template**: Read `skills/meta-setup/references/plan-template.md` – this is the exact format your plan must follow.

**3. Enter Plan Mode**: Use `EnterPlanMode` to write the implementation plan. Do NOT present the plan as chat text, a summary table, or TaskCreate items. The plan MUST follow the template format with all required fields: Summary, Phases (each with Objective, Depends on, Files, Reuse, Checklist, QA), Risk assessment, Questions for user.

**4. Get approval**: Use `ExitPlanMode` for user approval.

**5. Copy the plan**: IMMEDIATELY after approval, copy the plan to `plans/[YYYY-MM-DD]-[descriptive-name].md` in the project root. Create the `.design-engineer-plugin/.design-engineer-plugin/plans/` directory if it doesn't exist. **This step is CRITICAL – without it, TDD hooks and fidelity hooks cannot activate. Do not write any code until the plan is in `.design-engineer-plugin/.design-engineer-plugin/plans/`.**

**6. Create feature branch**: If on main/master, run `git checkout -b feat/[plan-slug]`.

**7. TDD (REQUIRED — agent dispatch is mandatory, no manual substitute)**: Before writing production code, run `Task(test-writer, plan_path=<path>)`. The agent reads the plan and writes failing Playwright CLI test scripts in `tests/`. Wait for the agent to return; do not continue until its output is available. Writing tests inline yourself instead of dispatching `test-writer` is forbidden — the agent encodes the TDD anti-pattern catalog the main model would otherwise silently violate. Then run the scripts to verify the Red phase (fails because feature is missing).

**8. Implement phase by phase**: Follow the plan's phases in order. For each phase:
   a. Implement only this phase's changes. For UI work, dispatch `Task(frontend-implementer, phase=<n>, plan=<path>)`. For backend work, dispatch `Task(backend-implementer, phase=<n>, plan=<path>)`. **The agent dispatch is REQUIRED in both modes — implementing the phase inline yourself instead of dispatching the implementer is forbidden. The implementer encodes the Gallery Contract, the design-token compliance rules, the pixel-perfect Figma fidelity rules; reproducing that work in the main model is unreliable.** Wait for the agent to return; do not continue until its output is available. Wait for agent return before `/simplify`.
   b. Run `/simplify` on changed code, scaled to the change size (per CLAUDE.md "Code Quality: /simplify" tier table). Trivial single-property swaps: skip `/simplify`, inline self-review only. Medium changes (≤50 lines): single `/simplify` call. Large changes (>50 lines or new file): full `/simplify` (3-agent fan-out runs internally).
   c. Completeness review: check the plan's checklist for this phase
   d. **Advisor checkpoint (pre-done)**: after deliverables are durable (files written, tests run, screenshots captured), consult the advisor by Reading `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/advisor/SKILL.md` and following its instructions (do NOT use the `Skill` tool — plugin skills disable model invocation) with: phase summary, what was implemented, test/screenshot results, anything that surprised you. Apply the advice. If it conflicts with primary-source evidence (a file says X, a test result shows Y), do a single reconcile call. Skip on trivially-scoped phases (one-line edits, type-only changes). If this implementation phase touches user-facing UI (writes to `.tsx`/`.jsx`/`.html`/`.svelte`/`.vue`/`.css`), also run `Task(psych-scanner, target=<changed files or pages>)` once before declaring the phase done. **REQUIRED in both modes — there is no manual psychology-scan substitute; the scanner encodes 100+ cognitive principles the main model cannot reliably apply.** Wait for the agent to return; do not continue until its output is available. The scanner reports prioritized findings; surface them as the phase QA before user review.
   e. Present to user with QA instructions from the plan
   f. Wait for approval before next phase
   g. **BLOCKING REQUIREMENT — commit and push BEFORE starting the next phase.** After the user approves this phase, commit its changes and push using `dev-github-workflow` Mode 1 (Conventional Commits format with phase context AND the plugin attribution footer — Mode 1 is plan-driven so the footer is included; Mode 2 manual user commits do NOT include the footer). Do NOT defer commits to the end of all phases. Do NOT batch multiple phases into a single end-of-implementation commit. Phase boundaries are commit boundaries — one phase, one commit, in the same turn the user approves it. The next phase does not start until this phase is committed and pushed. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-github-workflow/SKILL.md` and follow its Mode 1 instructions inline (do NOT use the `Skill` tool — plugin skills disable model invocation).

**9. After all phases (REQUIRED in both modes)**: Run `Task(design-system-auditor, scope=<changed paths>)` to audit BOTH design system compliance AND aesthetic quality (4 lenses + 4 named tests + AI Slop Test). **The auditor dispatch is mandatory — running an inline aesthetic review yourself is forbidden. The auditor encodes the FAIL-severity gallery contract, design-token compliance rules, and the 14-pattern anti-slop catalog.** Wait for the agent to return; do not continue until its output is available. Review aesthetic FAILs before presenting the implementation to the user — these are blocking advisories, not optional.

**9.5 Tidy-up (BLOCKING — before PR creation)**: review the working tree for stray disposable artifacts that may have leaked outside `.design-engineer-plugin/temporary/scratch/` and the canonical deliverable paths. Run `git status --short` and inspect every untracked / modified file. Classify each per CLAUDE.md "File hygiene (durability tiers)":

- **Durable deliverable** (committable as-is) → leave it.
- **Disposable working artifact** in the wrong place (Playwright dump at project root, intermediate analysis dump under `design/<subdir>/`, ad-hoc debug file anywhere outside `.design-engineer-plugin/temporary/scratch/`) → move it to `.design-engineer-plugin/temporary/scratch/<purpose>/<YYYY-MM-DD-HHMMSS>/` so it's git-ignored, OR delete it if it has no debug value.
- **Pattern that should be git-ignored permanently** (test runner outputs, build caches, framework-specific dumps not yet covered by the existing `.gitignore` block) → ask the user whether to add the pattern to `.gitignore`'s `# === BEGIN design-engineer-plugin ===` block.

Surface findings to the user as a short list before any PR creation: "I found N files outside the canonical paths. Here's my proposed disposition for each — confirm or override before I move on." Do NOT silently move or delete files; the user must approve each disposition. Skip this step only if `git status --short` is empty or contains only modified files within tracked canonical paths.

**meta-document timing rule** (canonical for this command): invoke `meta-document` at the **end of every phase**, immediately after the phase task is marked complete and before presenting QA to the user. This is the same cadence the design pipeline uses; it keeps the compound-documenter's pipeline-state.md in sync turn-by-turn. Do not invoke meta-document mid-phase; do not skip it at end-of-phase.

### Visual verification (UI changes only)

After implementing changes to UI components or pages:
1. Start the dev server if not running (`npm run dev` or equivalent)
2. Use Playwright to navigate to the affected page on localhost
3. Take a screenshot. Per CLAUDE.md "Playwright filesystem hygiene", visual-verification captures are throwaway debug artifacts and MUST be saved under `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/visual-verification-<page-slug>.png`. Run `mkdir -p .design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>` first. Never call `mcp__playwright__browser_take_screenshot` without an explicit `filename` — the `de-playwright-path-hook` denies it.
4. Analyze: does the result match expectations? Check layout, spacing, color, animation direction, element visibility
5. If issues found: fix them before presenting to the user
6. If clean: proceed to present the phase for review

Skip this step for data-only, type-only, or configuration changes.

### Mode differences

**Agents always run fully — in both modes, every time.** The only thing mode changes is how their OUTPUT is presented to the user, not whether they fire. If an agent dispatch line says `Task(<agent>, ...)`, it MUST run. Substituting manual work for an agent dispatch is forbidden in either mode — there is no point shipping these agents (test-writer, frontend-implementer, backend-implementer, psych-scanner, design-system-auditor, advisor, ux-researcher, deliverable-writer, compound-documenter) if the model just does their work itself.

**Why agents always run, even in guided mode**: agents are specialised tools — `frontend-implementer` enforces the Gallery Contract and pixel-perfect Figma fidelity rules; `psych-scanner` knows 100+ cognitive principles; `design-system-auditor` runs the FAIL-severity 4-lens critique. The main model can't and shouldn't replicate that work inline. Skipping agents because "guided mode means do it yourself" defeats the entire architecture.

In **Guided mode**: every `Task(<agent>, ...)` line in the steps above runs. After each agent returns, the main model parses the agent's output and presents it to the user step by step with `AskUserQuestion` between findings / sections. Never dump raw agent output. Never skip the dispatch and do the work manually.

In **Autopilot**: every `Task(<agent>, ...)` line runs. After each agent returns, the main model presents the agent's complete output as a structured summary, then proceeds to the next step without waiting for user approval (the user already opted out of per-step review by choosing autopilot).

The number of `Task(...)` calls is the same in both modes. The presentation cadence is the only thing that differs.

## Post-execution

After all phases of feature implementation are complete (including the `design-system-auditor` pass) and before presenting the post-execution options to the user, clear the active-workflow marker so the process-recall hook stops firing on subsequent casual chat:

```bash
rm -f .design-engineer-plugin/.active-workflow
```

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

For new products (project_type: new), auto-invoke meta-document after implementation cycles before presenting options.
