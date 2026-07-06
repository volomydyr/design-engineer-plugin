# Design Engineer Plugin Development

## Skill loading from commands (doc-compliant pattern)

MOST of this plugin's skills set `disable-model-invocation: true` (they are libraries loaded by commands, not auto-discoverable) — for those, the Skill tool REJECTS programmatic invocation (`Skill <name> cannot be used with Skill tool due to disable-model-invocation`) and you load them by reading the SKILL.md inline. A **curated auto-fire set** of iterate-flow skills deliberately leaves model-invocation ENABLED so Claude loads them on its own when the task is relevant (see "Auto-fire skills" below). Those may be invoked normally or read inline; everything else is read inline.

**Therefore, never tell the model to "load the X skill" or "invoke the Y skill" in a command body.** The model interprets that as a Skill-tool call and the command crashes on the very first run.

### The required pattern

Every command file that references `${DESIGN_ENGINEER_PLUGIN_ROOT}` MUST start its body with this short note (placed just after the `# Title` heading and before any other section). Commands that never reference the plugin root – help.md, stop.md, mute-unmute-sound.md – omit it:

```markdown
## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.
```

This relies on a single, permission-free mechanism: **the plugin's UserPromptSubmit hook (`hooks/de-start-state.sh`) injects `DESIGN_ENGINEER_PLUGIN_ROOT: <abs path>` as `additionalContext` text** on every prompt. The model sees that line in its context and uses it as the substitution value when it encounters `${DESIGN_ENGINEER_PLUGIN_ROOT}/...` in the command body.

### Mechanisms NOT to use, and why

- **Bash injection (`` !`...` ``)** — documented at https://code.claude.com/docs/en/slash-commands.md#inject-dynamic-context, but Claude Code's permission system blocks `!`-prefix patterns at command-load time in Auto mode and any restrictive permission preset, with: `Shell command permission check failed for pattern "!...". Permission for this action has been denied. Reason: Insufficient information about the Bash command to evaluate; action is unverifiable.` v4.8.5 tried this approach and crashed `/design-engineer:launch` for users in Auto mode. Do NOT use bash injection in command bodies.
- **`${CLAUDE_PLUGIN_ROOT}`** — officially documented for `hooks/hooks.json` `command` fields ONLY. Does not auto-expand inside slash command markdown bodies. Hooks may use it; commands may not.
- **`Skill` tool on a disabled skill** — most plugin skills set `disable-model-invocation: true`, so the Skill tool rejects them (`Skill <name> cannot be used with Skill tool due to disable-model-invocation`); load those with `Read ${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<name>/SKILL.md and follow its instructions inline`. The curated auto-fire set (see "Auto-fire skills" below) is the exception — those are model-invocable, so Claude may load them on its own when relevant, and reading them inline still works too.

When a command body instructs the model to run a fixed, known-in-advance Bash call (state detection, the sound-flag toggle, the tidy purge), `allowed-tools` frontmatter is the documented way to pre-permit exactly that call so default-permission sessions don't interrupt with a prompt – `commands/launch.md`, `commands/tidy.md`, and `commands/mute-unmute-sound.md` declare exact-string entries (no `:*` wildcards) for precisely their scripted calls and nothing broader.

### Skill references inside commands

When a command needs to invoke skill instructions, write:

```markdown
Read the SKILL.md at `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<skill-name>/SKILL.md` (substitute the resolved plugin root from the top of this file) and follow its instructions inline. For the disabled majority, do NOT use the `Skill` tool (it rejects them). The auto-fire set may also be invoked normally, but reading inline always works and stays the default when a command orchestrates a specific skill.

### Auto-fire skills (model-invocation enabled)

These iterate-flow skills have `disable-model-invocation` REMOVED so Claude loads them automatically when the task is relevant, giving the existing-project flow its proactive, reach-for-the-right-tool behavior: `ui-design-system`, `ui-aesthetic-review`, `ui-accessibility`, `ui-design-to-code-qa`, `ui-references-moodboard`, `frontend-design`, `psych-full-scan`, `ux-full-review`, `ux-bias-audit`, `ux-ethics-review`, `ux-journey-mapping`, `feedback-to-todos`, `design-spec`, `dev-prototyping`, `meta-document`. Every OTHER skill stays `disable-model-invocation: true` (command-driven only). When Claude auto-loads one of these, let it — do not suppress it because of the "read inline" default above.
```

The "do NOT use the Skill tool" guard is mandatory in every such instruction, as a backstop against the model defaulting to Skill-tool invocation.

### What NOT to write

These phrasings have been observed to cause Skill-tool failures and are forbidden:

- ❌ "Load the X skill" — Claude calls `Skill(X)` and crashes.
- ❌ "Invoke the X skill" — same failure.
- ❌ "Use the X skill" — ambiguous; Claude may pick Skill tool.

The only correct phrasing is **"Read `<path>/SKILL.md` and follow its instructions"** with an explicit Skill-tool prohibition.

### Hooks vs commands

`${CLAUDE_PLUGIN_ROOT}` IS officially documented for `hooks/hooks.json` `command` fields. Hooks may use it directly (and do, throughout `hooks/hooks.json`). This convention applies only to slash command bodies and skill markdown — not to hooks.

## Command hand-offs (continuing the pipeline into another command)

Commands cannot invoke other slash commands. The model has no reliable way to run `/design-engineer:X` mid-flow – the SlashCommand tool's availability varies by session, and "Load /design-engineer:X" fails the same way "Load the X skill" does (see the forbidden phrasings above). When a command or skill body needs to continue the pipeline into another plugin command – a junction the user just chose, like "Move to development" – write this canonical pattern:

1. Announce the transition in one sentence.
2. Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/commands/<name>.md` and follow its instructions inline.
3. Carry forward the relevant context explicitly: the feature plan, the spec path, or the argument branch to follow (e.g. discovery's `feature-spec` branch). `$ARGUMENTS` is not substituted on an inline Read, so name the branch to jump to instead of passing an argument.

Never end the turn telling the user to re-type a command they just chose to continue into.

**Exemption – terminal and pause messages.** Text that ends a session or points at a later session correctly names commands for the user to run themselves: stop.md's resume pointer, help.md listings, tidy.md, "run /design-engineer:launch first" config-missing guards, and "Pause and save" option descriptions. Leave those as plain command names with no inline-Read mechanics. Display-only text (spine tables, overviews, recap templates) may also name commands as labels.

## Versioning Requirements

**HARD RULE: every commit pushed to `main` that touches user-facing code MUST bump the version. No exceptions, even for one-line fixes.**

User-facing code: anything under `commands/`, `skills/`, `agents/`, `hooks/`, scripts in `skills/*/scripts/`, `assets/`, or top-level docs (`CLAUDE.md`, `README.md`). Commits that touch only `CHANGELOG.md`, `.gitignore`, or local dev tooling don't need a bump.

**Why**: Claude Code's plugin cache is keyed by `<plugin>/<version>`. When a user runs `/plugin install` and the registry shows "already at X.Y.Z", Claude Code skips the fetch entirely — your fix never reaches them. The only way to force a fresh pull is to make the version different. There is no "force re-fetch" command in `/plugin`; version-bump-and-push is the protocol.

**The four files that MUST update together** in every release commit:

1. **`.claude-plugin/plugin.json`** — bump `version`
2. **`.claude-plugin/marketplace.json`** — bump matching `version`
3. **`README.md`** — bump the `> **vX.Y.Z**` banner on line 1
4. **`CHANGELOG.md`** — prepend a new dated entry

If any of these four are unchanged in a `main` push that touched user-facing code, the release is broken. Stop and bump before pushing.

### Version bumping rules

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, major reorganization, removed/renamed commands or skills
- **MINOR** (1.0.0 → 1.1.0): New skills, agents, or commands
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, doc updates, minor improvements (this is the default — when in doubt, bump patch)

### Skipping the bump is a bug

If you find yourself thinking "this is too small to bump for" — that's the bug. Even fixing a single typo in a command body's chat output requires a patch bump, because the typo lives in the cached version directory and only a new version directory can replace it. The cost of a patch bump is one number; the cost of a stuck cache is hours of user frustration.

## Directory Structure

```
design-engineer-plugin/           ← repo root = plugin root
├── .claude-plugin/plugin.json
├── CLAUDE.md
├── README.md
├── CHANGELOG.md
├── hooks/
│   ├── hooks.json
│   ├── de-start-state.sh
│   ├── de-statusline.js
│   ├── de-playwright-path-hook.js
│   ├── de-figma-intake-hook.sh
│   ├── de-postcompact-hook.sh
│   ├── de-play-sound.sh
│   └── check_deliverable_deps.py
├── agents/                         # 10 specialized agents
├── commands/                       # 9 main commands + mute-unmute-sound utility
└── skills/                         # 51 skills
```

## Skill Compliance Checklist

When adding or modifying skills:

### YAML Frontmatter (Required)

- [ ] `name:` present and matches directory name
- [ ] `description:` present, describes what it does AND when to use it
- [ ] `disable-model-invocation: true` present on all skills EXCEPT the auto-fire set (the UI-craft, UX/psychology-review, task-entry, and documenting skills listed under "Auto-fire skills")
- [ ] `model:` present – `sonnet` (default) or `haiku` (mechanical tasks)
- [ ] `license: MIT` present on ALL skills
- [ ] `compatibility:` present when skill has external dependencies (MCP servers, Node.js, Python, Bash)

> **Note on `compatibility:`** This is a deliberate plugin-internal extension – not part of Anthropic's canonical skill schema. The plugin uses it for human-readable runtime requirements. Both shapes are accepted: a single string (`compatibility: "Requires Node.js v18+"`) or a structured form for multi-dependency cases (`compatibility:\n  optional:\n    - playwright-cli  # used to rank stock candidates`). Anthropic ignores unknown frontmatter keys, so this is harmless cross-tool.

### Content Rules (Non-Negotiable)

- [ ] ALL content from source files only – never generic internet knowledge
- [ ] English only – no Ukrainian names or translated names
- [ ] Each skill covers exactly ONE activity
- [ ] Prescribes exact workflows from the author's experience
- [ ] Guides thinking process, not just outputs deliverables
- [ ] Enforces User > Docs > AI decision hierarchy
- [ ] Reference files contain FULL ADAPTED content, not summaries
- [ ] Sources merged silently – no attribution like "from the book"

### Structural Rules

- [ ] SKILL.md under 500 lines – detailed content in references/
- [ ] All reference files linked with proper markdown: `[file.md](./references/file.md)`
- [ ] No placeholder text (TODO, TBD, [fill in])
- [ ] AskUserQuestion with numbered-list fallback for cross-platform compatibility
- [ ] AskUserQuestion previews used when presenting visual or architectural options (layout comparisons, spacing scales, design directions, IA structures)

### Pre-Commit Checklist

- [ ] Version bumped in `.claude-plugin/plugin.json`
- [ ] CHANGELOG.md updated
- [ ] README.md component counts verified
- [ ] All JSON files valid (`python3 -m json.tool`)
- [ ] `effort:` present on all skills and agents
- [ ] Agent frontmatter does NOT include `disable-model-invocation:` (skills-only field)

## Model and effort configuration

### The verified mechanics (read this first)

A skill's `model:`/`effort:` frontmatter is **inert when the skill is loaded inline** – which is how the command-driven majority load, so those run at the **main session's** model and effort. Two exceptions where frontmatter DOES apply: **agents** dispatched via Task, and the **auto-fire set** when Claude loads one through the Skill tool (model-invocation enabled). When an auto-fire skill is instead read inline by a command, it runs at the session model like the rest.

Two consequences:

1. **The only runtime levers are the 10 agents' frontmatter and the user's session setting.** The plugin cannot change the session model or effort from inside a skill. Command frontmatter does have a documented `model:` field, but the plugin deliberately leaves it unset – the user's session model stays in control of the inline phases – and no command-level `effort:` field exists at all. So the agent frontmatter carries the real per-agent policy, and the inline planning phases (MVP, information architecture, Plan Mode, design exploration) run at whatever the user's session is set to.
2. **Skill frontmatter stays for compliance, not runtime.** Keep an explicit `model:` and `effort:` on every skill so the schema stays valid and a future Skill-tool path works, but do not rely on it to change behavior. It is cosmetic at runtime today.

**Recommendation surfaced to the user:** because the plugin cannot set the session, the docs and setup flow recommend running a **strong session model at high effort during the inline planning phases** (MVP, information architecture, Plan Mode). That is where premium reasoning pays off and where the plugin has no other lever. Lean implementation against a good plan or spec is fine on a smaller model.

### The agent policy (the real lever)

One policy applies across the 10 agents. There is no cost-mode machinery and no per-mode rewriting – the values live directly in each agent's frontmatter.

| `model:` / `effort:` | Agent | Why |
|---|---|---|
| `opus` / `xhigh` | `design-explorer`, `spec-author` | Workflow-only premium planning – dispatched by discovery's design-exploration and spec-authoring fan-outs |
| `opus` / `high` | `design-system-auditor` | The inline-pipeline Opus agent. Aesthetic critique plus the spec-conformance pass – the place Opus earns its premium |
| `sonnet` / `high` | `ux-researcher`, `psych-scanner` | Research synthesis and psychology critique warrant higher effort, but not Opus |
| `sonnet` / `medium` | `frontend-implementer`, `backend-implementer`, `advisor`, `test-writer`, `compound-documenter` | Lean execution against good specs and plans; structured transforms |

Rationale (official docs): "Sonnet + prompt caching is the practical default… Opus should be reserved for requests that justify the premium"; Haiku is for mechanical work. Premium reasoning is concentrated on planning (the design-exploration and spec-authoring workflows run Opus at xhigh – see Workflows) and on final quality (`design-system-auditor`), rather than spread across every step.

### Skill frontmatter values

Skills keep `model: sonnet` / `effort: medium` (or `haiku` / `low` for clearly mechanical plumbing: setup wizards, status and doc formatting, simple routing). These are inert at inline-load time but kept for compliance and Skill-tool-future. Use **aliases**, not pinned model IDs.

### Allowed values

Use **aliases**, not pinned model IDs:
- `model:` – `sonnet`, `haiku`, or `opus`. No `claude-opus-4-7`-style pins (they drift and need manual refresh), and no `model: inherit` (the plugin is explicit about quality expectations).
- `effort:` – `low`, `medium`, `high`, or (on the design-exploration and spec-authoring workflow agents only) `xhigh`. `max` is not used: it is session-only and prone to overthinking.

### Skill frontmatter shape

Skills include `model:` and `effort:` after `disable-model-invocation`:

```yaml
---
name: skill-name
description: "..."
disable-model-invocation: true
model: sonnet
effort: medium
---
```

### Agent frontmatter

Plugin agents support these frontmatter fields (per [plugins reference](https://code.claude.com/docs/en/plugins-reference#agents)): `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation`. The fields `hooks`, `mcpServers`, and `permissionMode` are silently ignored on plugin-shipped agents (security restriction).

**`disable-model-invocation: true` is a SKILLS-only field** — including it on an agent is invalid. The v5.5.1 fix removed it from `agents/advisor.md` (the only agent that mistakenly had it). Other agents already lacked it.

```yaml
---
name: agent-name
description: "..."
model: sonnet
effort: medium
---
```

For agents that need cross-session memory (like `compound-documenter`), add `memory: project`.

### When adding new agents/skills

- New skills: default to `model: sonnet`, `effort: medium` (`haiku` / `low` for clearly mechanical work). Remember the values are inert at inline-load time – they are for compliance, not runtime.
- New agents: place them in the policy table above. Default to `sonnet` / `medium`; reserve `sonnet` / `high` for research or critique that warrants it. Opus is carried by three agents only: `design-system-auditor` (`high`) in the inline pipeline, plus the workflow-only `design-explorer` and `spec-author` (`xhigh`). Adding a further Opus agent requires a deliberate decision, not a default.
- `xhigh` is used only by the `design-explorer` and `spec-author` workflow agents. Never use `max`, pinned model IDs, or `model: inherit`.
- Never include `disable-model-invocation:` on an agent (skills only).

## Workflows

Claude Code's **workflows** feature dispatches many subagents in the background (16 concurrent, 1000 total per run; resumable; no mid-run user input) and verifies their findings against each other. The plugin uses it only for the few high-value moments that genuinely need more agents than one conversation can coordinate – not everywhere.

Each wiring follows the same contract:

1. **Natural-language opt-in in the command body** ("use a workflow to: …") – the model offers the workflow at that step rather than the plugin hardcoding a dispatch.
2. **Availability gate** – workflows need Claude Code v2.1.154+ on a paid plan. The command checks availability before offering.
3. **Single-pass inline fallback** – when workflows are unavailable or declined, the same work runs once inline. Nothing breaks when workflows are off.

The four wirings:

| Wiring | Where | Fan-out | Agents |
|---|---|---|---|
| **Design exploration** | `commands/discovery.md`, new-product prototype step | One agent per concept direction, then judge and synthesize | **Opus / xhigh** (premium planning) |
| **Spec authoring** | `commands/discovery.md`, feature flow after the IA recap | One agent per screen, authoring `.spec.md` files | **Opus / xhigh** (premium planning) |
| **Competitor analysis** | `commands/discovery.md`, "add depth" step | One agent per competitor (or delegate to a `/deep-research` harness if one is available in the session) | Default tier |
| **Per-page audit** | `commands/review.md` audit step | One agent per page, results synthesized; designer-feedback capture stays after the run | Default tier |

The design-exploration and spec-authoring workflows are the **premium-planning investment**: this is where the plugin concentrates Opus and xhigh, consistent with the model policy (premium reasoning on planning, lean execution after). The workflow agents are the only place `xhigh` is used.

## Spec-driven design

A **design spec** is the positive replacement for the deleted design-grounding, drift, and fidelity deny-hooks: it prevents reinvention up front instead of policing it after. It is the "really good plan" that makes lean implementation work.

**Shape.** One `.spec.md` per screen or surface: short prose intent and rationale, plus per-component fenced `yaml` blocks holding the structured, reference-only spec (token references, existing-component references by path, states, variants, responsive behavior, accessibility, and EARS acceptance criteria). The YAML does the load-bearing work; the prose carries the "why."

**Authoring → consumption → verification.**
- **Authored** by the `design-spec` skill as a premium-planning step in discovery (workflow-eligible – the spec-authoring workflow). The skill reads `ui-design-system`'s `design-system.md` (real tokens, aliases, component paths) and `ui-references-moodboard`'s `references.md` (intent) **first**, so a spec references only names that already exist. A spec that names a nonexistent token is worse than no spec.
- **Consumed** by `frontend-implementer`: where a spec exists it is a binding pre-read, the component reuse table is pre-filled from each spec's reuse block, and the implementer builds to the spec verbatim.
- **Verified** by `design-system-auditor`: a spec-conformance pass checks built components against the spec's YAML and acceptance criteria (FAIL on mismatch), flags dangling token or component references as high-severity, and treats any component no spec mentions as informational, not a failure.

**Graduated strictness.** Specs are required for consequential UI (net-new components, primary or reused surfaces of a feature) and optional for trivial one-off elements. The spec is never a blocking gate, and the auditor does not fail unspecced trivia – this keeps the friction the deleted hooks created from coming back.

**Storage.** Feature-scoped at `.design-engineer-plugin/design/features/<feature-slug>/screens/<screen-slug>.spec.md`; standalone specs at `.design-engineer-plugin/design/specs/<surface-slug>.spec.md`.

### /goal at verifiable build moments

`/goal` is a real Claude Code built-in (v2.1.139+): it sets a completion condition and loops turns until the condition holds, ideal for implementing a design doc until every acceptance criterion is met. It is **user-invoked only** – the plugin SUGGESTS a ready-to-paste `/goal` and STOPS for the user; it never tries to invoke `/goal` itself.

At UI-build moments with a verifiable end state (a `.spec.md` exists, recreating a Figma design, recreating a web frontend via Playwright, or strict Playwright-verified rules), `commands/development.md`, `agents/frontend-implementer.md`, and `skills/design-spec/` compose a `/goal` whose completion condition is the spec's EARS acceptance criteria plus the standing invariants (at least three Playwright iterations of real user flows, zero hardcoded values, only reused or extended components), present it, and wait for the user to paste it or say "go" to proceed without it. Gated on CC v2.1.139+; if `/goal` is unavailable or the user declines, the flow proceeds normally. This is not a global rule – it lives only in those specific steps and the skill.

## The iterate flow (task-driven work on an existing product)

A product that already exists – a commercial codebase the plugin didn't build, or a plugin-built product that has shipped and is now in iteration – opens the **iterate flow** rather than the from-scratch pipeline. The flow is fast and task-driven, and it is the existing-project path: no new mode, picker, or state name was added for it. Detection stays as-is – `.design-engineer-plugin/config.yaml` presence is the auto-detected plugin signature, `project_type` (a one-time first-run choice) plus `resume:` plus the compound-documenter `pipeline-state.md` track which step.

**Where it lives.** The flow and its routing map are authored once in `commands/launch.md` (the `## The iterate flow` section and the `## Task→dispatch map (single source of truth)` section). `commands/launch.md` Step 4 (first-run hand-off) **references** that map rather than restating it – this is deliberate, to keep the routing from drifting into multiple copies. When the dispatch map changes, change it in `launch.md` only.

**Clarify-then-dispatch (the core interaction model).** A starting point ("act on feedback", "redesign a design", "explore a concept", "audit a design") is a conversational entry, not a dispatch trigger. Selecting one makes the model **ask the user for detail** in natural language first; only after it understands the task does it read `project.context` from the config and dispatch the right pieces (a skill, a workflow, an agent, the spec layer, or `/goal`, or a combination). A starting point never auto-spawns an agent or a workflow on selection. The same applies to a free-form prompt: clarify what's needed, then dispatch the most capable fitting tool. Lean in process, powerful in capability – even a one-line request reaches for the right tool, but no forced pipeline.

**The scoped-edit loop** is the workhorse (most iterate-flow work is a scoped edit to something that already exists): restate the exact element, file, and property → locate → edit in place → verify in the browser via Playwright → open a scoped PR, reaching for the spec-driven layer, a workflow, or an agent when the change genuinely warrants it.

**Completion marker + routing.** When the from-scratch pipeline finishes its last step, `commands/development.md` writes a top-level `status: complete` line into `.design-engineer-plugin/config.yaml` (additive, idempotent, gated on `project_type: new`; `meta-document` mirrors the fact into the compound-documenter pipeline state but does not author the marker). Detection then routes a `project_type: new` project carrying `status: complete` to a new state, `returning_complete`, which opens the iterate flow instead of the from-scratch returning path. The branch is mirrored in the two places detection is duplicated today: `hooks/de-start-state.sh` and `commands/launch.md` Step 0. It is additive and fail-safe – absence of `status: complete` yields the prior behavior, and `project_type: existing` projects never reach it.

## Command Naming Convention

Commands live under the `design-engineer:` namespace (derived from the plugin name in `.claude-plugin/plugin.json`):

Slash-command names derive from the filename plus the plugin prefix, so command frontmatter must not include a `name:` key.

- `/design-engineer:launch` - Universal entry point (new projects, returning projects, existing projects)
- `/design-engineer:discovery` - Full design workflow orchestrator
- `/design-engineer:prototype` - HTML prototype generation
- `/design-engineer:development` - Development pipeline
- `/design-engineer:review` - Multi-layer design review (includes psychology audit)
- `/design-engineer:document` - Knowledge documentation and stakeholder communication
- `/design-engineer:stop` - Save progress and pause mid-activity
- `/design-engineer:tidy` - Wipe disposable working artifacts under `.design-engineer-plugin/temporary/`
- `/design-engineer:help` - Shows all available commands and current project status

## Conditional teaching contract

Every skill that opens with a Step 0 / Step 1 "Conditional teaching" instruction (25 skills, listed in `skills/*/SKILL.md`) follows this contract:

1. **ALWAYS ask** whether the user is familiar with the activity. Never assume from earlier conversation. Even if the user already introduced themselves as a designer / PM / engineer, even if they ran 5 prior skills successfully, you still ASK.
2. **ALWAYS give the one-sentence refresher** when the user says yes. The refresher is REQUIRED — the model does not get to decide "this is redundant" on the user's behalf. Phrases like "I'll skip the explainer (you're a designer)", "you already know this", or "skipping the refresher since you've done this before" are forbidden — they're paternalistic shortcuts that strip a memory aid the user explicitly wants.
3. **The user, not the model, decides what's redundant.** If the user genuinely doesn't want refreshers, they can tell you mid-session and you can ask "should I skip refreshers for the rest of this session?" — but the default is always to give them.

**Why this is a hard rule**: across long pipeline sessions, the user is fatigued and context-switched. A one-sentence refresher costs almost nothing and primes the user for the questions that follow. Skipping it because "they already know" is exactly the kind of polite-sounding shortcut that degrades the experience over time. The pattern was added in v5.5.4 after a user reported the model started skipping refreshers mid-pipeline ("I'll skip the explainer — you're a designer; you know competitor analysis") even though they wanted the refresh.

Every Step 0 "Conditional teaching" instruction in skills includes a `> Required: ALWAYS ask...` blockquote that the model must obey.

## Living Documents

Deliverables created by this plugin are documented in two layers:

- **Static dependency graph** at `.design-engineer-plugin/dependencies.yaml` – read-only documentation showing which deliverables inform which downstream ones. The plugin does not mutate this file; users read it to know what's connected.
- **Live progress** at `.claude/agent-memory/design-engineer-compound-documenter/` – three structured files (pipeline-state.md, key-decisions.md, stale-dependents.md) maintained by the compound-documenter agent via Anthropic's documented `memory: project` mechanism. The agent computes stale-dependents by cross-referencing the static graph against recent edits.

Run `/design-engineer:document` at milestones or after a significant decision so the compound-documenter agent flushes state into its memory. Downstream-review prompts also fire automatically via `hooks/check_deliverable_deps.py` when a deliverable file is edited.

**Path note**: deliverable files always live at `.design-engineer-plugin/design/...` – this is fixed in the current implementation.

## Plan Mode

Always use `EnterPlanMode` for any non-trivial implementation planning – never output plans as plain text messages.

### When to Use Plan Mode

Use Plan Mode for any task that involves multiple files, phased implementation, architectural decisions, or more than a single-line fix. Do NOT use Plan Mode for: single-line fixes, typo corrections, or pure research tasks.

### Structured plan format

When in Plan Mode, follow the canonical template at `skills/meta-setup/references/plan-template.md` – use the template structure above its "Execution rules" divider. It is the single source of truth for plan format, including the four-way Reuse taxonomy (use as-is / extend / replace / new). Do not restate or improvise the format.

Every phase MUST have `**Depends on**`, `**Checklist**`, and `**QA**` fields. Dependencies determine implementation order. The checklist breaks the phase into discrete deliverables that can be checked off during implementation. QA instructions tell the user exactly what to review – not generic "check it works" but specific things to look at (files changed, behavior to test, edge cases to verify).

### Project-local storage

After plan approval, copy the approved plan to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[descriptive-name].md`. Create the `.design-engineer-plugin/plans/` directory if it does not exist.

### Archival

When implementation is complete, move the plan from `.design-engineer-plugin/plans/` to `.design-engineer-plugin/plans/archive/`. Create the `.design-engineer-plugin/plans/archive/` directory if it does not exist.

### Workflow

1. `EnterPlanMode` – write a structured plan to the plan file
2. `ExitPlanMode` – present the plan for user approval
3. After approval, copy to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[descriptive-name].md`
4. If a git repo exists and the current branch is `main` or `master`, create a feature branch: `git checkout -b feat/[plan-name-slug]`
5. Create a task for each phase (`TaskCreate`) with `blockedBy` dependencies matching the plan
6. **For each phase in dependency order:**
   a. Mark the phase task `in_progress` (`TaskUpdate`)
   b. Implement only this phase's changes – never touch files from later phases
   c. Run `/simplify` on changed code
   d. **Completeness review** – before presenting to the user:
      - Read the plan's checklist for this phase
      - For each item, verify it was implemented as specified – not differently, not partially
      - Check that no creative additions were made beyond the checklist items
      - For each file edited, verify no important content was removed that wasn't part of the planned change
      - If anything was missed, done differently, or accidentally removed – fix it now
      - Check off each completed item in the plan file
   e. Mark the phase task `complete` (`TaskUpdate`)
   f. Present to the user: what was done (brief), QA instructions from the plan, and "Review this phase and share feedback. I'll proceed to Phase N+1 after your approval."
   g. **WAIT** – do not proceed until the user responds
   h. If the user has feedback, address it (may take multiple rounds of feedback)
   i. Only proceed to the next phase after explicit user approval
   j. After user approves, commit this phase's changes and push using `dev-github-workflow` Mode 1 (Conventional Commits format with phase context AND the plugin attribution footer – Mode 1 is plan-driven so the footer is included; Mode 2 manual user commits do NOT include the footer)
7. After all phases complete, move the plan to `.design-engineer-plugin/plans/archive/`
8. If on a feature branch, create a PR via `gh pr create` and ask the user whether to merge

### Implementation rules

- **Never implement multiple phases in a single turn.** One phase, one review, one approval.
- **Every phase must have QA instructions.** If the phase is simple, the QA can be brief ("check the button color changed"). If complex, be specific ("open the settings page, verify the new panel appears, try toggling it on/off, check that the state persists on page reload").
- **Dependencies determine order.** Always implement sequentially for user review, even if phases are independent.
- **Feedback is iterative.** The user may have multiple rounds of feedback on a single phase. Address all feedback before moving on.
- **Advisor is optional.** The `advisor` skill is available for a strategic second opinion when a plan is large or the path forward is genuinely uncertain, but it is not a required checkpoint. Use it when it would help; skip it otherwise.

## Code Quality: /simplify

`/simplify` is a bundled Claude Code skill that reviews changed code for reuse, quality, and efficiency. For substantial changes it fans out into three parallel review agents. That fan-out is great for new components and large refactors and noisy for one-line color swaps — so the call is **scaled by change size**, not run after every Write/Edit.

### Tier-based scaling (by change size)

Classify each code change into one of three tiers by size alone, and use that to decide whether to call `/simplify`:

| Tier | Trigger | `/simplify` action |
|---|---|---|
| **Trivial** | ≤5 lines AND a single CSS / style / Tailwind property or token swap (color, padding, font-size, etc.) | **Skip `/simplify`.** Inline self-review only — confirm the new value uses an existing token and the change does not introduce raw values, then move on. The 3-agent fan-out is overkill for a one-property change. |
| **Medium** | ≤50 lines (anything that isn't trivial and isn't a new file or large refactor) | Single `/simplify` call. |
| **Large** | >50 lines OR new file OR new component | Full `/simplify` (which internally orchestrates the 3-agent reuse / quality / efficiency fan-out). |

### When to Run (legacy guidance, kept for the Large tier)

- After `backend-implementer` returns (treat as Large)
- After `frontend-implementer` returns (treat as Large)
- Final pass after all code changes, before `design-system-auditor` (treat as Large)

For trivial / medium edits in the per-phase implementation loop, scale per the table above. The Final-pass `/simplify` before `design-system-auditor` always runs as Large regardless of last-edit size — it's auditing the cumulative diff.

### Prototyping exemption (unchanged)

Do NOT run `/simplify` during prototyping. Prototypes are throwaway visual artifacts – code quality doesn't matter. `/simplify` only applies during `/design-engineer:development` implementation.

### How

Invoke `/simplify` as a slash command. It runs in the main conversation; the 3-agent fan-out is internal to the skill and only fires for Large-tier changes (when `/simplify` itself decides the change warrants it). You don't dispatch the agents directly from this plugin.

## Component Gallery Contract

The plugin maintains a **single-page component gallery** in every project where UI work happens – a visual catalog of every component, all variants visible at once, real production styles, source-path labels per entry. Two purposes: (a) duplicate detection (Claude tends to create five new versions of an existing component – the gallery makes redundancy visually obvious), and (b) visual quality assurance (one viewport, all components, real styles – closer to a design canvas than a docs site).

The gallery is **stack-agnostic**. The skill `skills/dev-component-gallery/` queries the bundled context7 MCP for each project's framework's idiomatic showcase pattern and scaffolds accordingly – Next.js route, SwiftUI `#Preview` canvas, Jetpack Compose `@Preview`, vanilla HTML, Astro page, Flutter widgets-gallery, whatever the framework's docs say is current. No hardcoded "framework → location" table; the skill adapts.

### The universal Gallery Contract

Every gallery file the skill scaffolds carries this contract at the top in language-appropriate comment syntax (see `skills/dev-component-gallery/references/gallery-contract.md` for the canonical text and the per-language adaptation table):

> Every component MUST be imported (or used) from its production source. Never copy-paste, restub, or inline a component. NO hardcoded styles, no inline `style="..."` attributes, no extra style rules in the gallery file, no language-equivalent style overrides. Variants are reached via the component's own public API only (props / attributes / modifiers / classes / slots). If a state can't be reached via the component's API, that's a component bug – fix at the component, not in the gallery. Every entry shows its source file path next to the rendered component. The gallery is a viewer, not a workshop.

### Enforcement (no hooks)

- **`agents/frontend-implementer.md`** – after creating or modifying any component, reads `dev-component-gallery`'s SKILL.md (via the `PLUGIN_ROOT` line in its dispatch prompt) and follows it inline to add or update its entry; never duplicates components in the gallery; never writes inline styles in the gallery file. Reads the existing gallery before adding new components (duplicate-detection step).
- **`agents/design-system-auditor.md`** – gallery audit pass at FAIL severity (every component has an entry, no inline styles, imports resolve to production paths, visually-identical entries flagged as duplicates, variants via API only).
- **`skills/dev-claude-md/SKILL.md`** – generated project CLAUDE.md includes the Gallery Contract so the rule survives in the user's repo.
- **`skills/dev-prototyping/SKILL.md`** – cross-references the lifecycle (prototype = design exploration before implementation; gallery = shipped components after).

There is no PreToolUse or Stop hook for the gallery contract. Enforcement is the agents' responsibility.

## Output formatting

Three rules that apply to everything Claude writes – chat messages, deliverables, code comments, UI copy, headings, labels, buttons, filenames, everything:

<!-- The em dash (U+2014) below is an intentional counter-example. Do not "fix" it in dash sweeps. -->
1. **En dashes only** – use `–` (en dash). Never `—` (em dash), `--` (double hyphen), or ` - ` (hyphen as dash). Hyphens in compound words are fine (test-first, psychology-backed).
2. **Sentence case only** – capitalize the first word and proper nouns. Never Title Case. This applies to headings, button labels, tab names, navigation items, placeholder text, menu items, toast messages, and any other text Claude generates.
3. **No internal jargon in user-facing output** – never mention config file names (`.design-engineer-plugin/config.yaml`, `.dependencies.yaml`), internal skill names (`ux-problem-statement`, `meta-setup`), hook names, script names, or detection logic in messages shown to the user. Describe what things DO, not what they're called internally. "Your progress was saved" not "Resume state written to `.design-engineer-plugin/config.yaml`". "You have Figma connected" not "Figma plugin: [FOUND]". This rule applies to all commands, skills, and agents.

Wrong: "User Settings – Account Details"
Right: "User settings – account details"

Wrong: "Save Changes", "View All Projects", "Get Started Now"
Right: "Save changes", "View all projects", "Get started now"

Wrong: "Loading – Please Wait"
Right: "Loading – please wait"

Wrong: "Problem Statement", "Target Audience", "MVP Requirements"
Right: "Problem statement", "Target audience", "MVP requirements"

Wrong: "Data density — over marketing", "sovereignty -- wants"
Right: "Data density – over marketing", "sovereignty – wants"

This is especially important in UI copy – prototypes, components, and any generated product interface must follow all three rules.

4. **No AI writing patterns** – before generating any deliverable, prototype text, or landing page copy, read `skills/shared-references/anti-slop-writing.md` and apply its rules. Key forbidden patterns:
   - "This is not X – this is Y" / "It's not just about X; it's about Y" / "The pain isn't X – it's Y" contrasting formulas
   - Inflated significance ("pivotal moment", "testament to", "evolving landscape")
   - Invented statistics or fabricated research claims
   - Sycophantic tone ("Great question!", "You're absolutely right!")
   - Signposting ("Let's dive in", "Let's explore", "Here's what you need to know")
   - Generic positive conclusions ("The future looks bright", "Exciting times lie ahead")
   - Filler phrases ("In order to", "Due to the fact that", "It is important to note that")
5. **Every question to the user goes through the `AskUserQuestion` tool – never an inline prose question.** Any time you need the user to choose, confirm, or clarify — a direction, a default, a yes/no, "which of these", "should I also…" — you MUST ask it with the `AskUserQuestion` tool (with the numbered-list fallback only when the tool is unavailable). Do NOT write the question as a sentence in your message and wait for a typed reply. This applies everywhere: clarify steps, design decisions, confirmations mid-task, spec choices. If you catch yourself writing "do you want…", "should I…", "would you prefer…", or "let me know which" in prose, stop and issue an `AskUserQuestion` instead. Keeping it light means fewer questions or a single focused one — not dropping to prose.

6. **AskUserQuestion must always have 2–4 options** – never send an AskUserQuestion with only 1 option. The minimum is 2. Always specify `multiSelect: true` or `multiSelect: false` explicitly. Use `multiSelect: true` when multiple answers are valid (failure modes, risk assessment, feature selection, review areas, psychology skills). Use `multiSelect: false` when the user must choose one direction (mode, approach, framework, scope).

   **When a menu needs more than 4 choices**, never emit an AskUserQuestion with more than 4 options. Use one of these two patterns instead:
   - **Group and narrow** (single-choice menus): fold the choices into at most 4 umbrella options, then run a follow-up AskUserQuestion round to narrow within the chosen group.
   - **Numbered chat list** (multiSelect pick-many lists): fall back to a numbered list in chat and accept comma-separated numbers as the answer.

   Never add an explicit "Other" / "Something else" option – AskUserQuestion has a built-in free-text Other, so an explicit one is a wasted slot.

7. **Pad the chat before AskUserQuestion** – on most clients, the question panel overlays the bottom of the chat, hiding whatever you wrote just above it. Before EVERY AskUserQuestion call, end your preceding message with a vertical spacer so the overlay covers the spacer instead of substantive content. Use this exact spacer block (it renders as visible vertical space in markdown clients):

   ```
   ───────────────────
   ───────────────────
   ───────────────────
   ```

   Three horizontal-rule lines is the standard. The spacer must be the last thing in the chat message before the AskUserQuestion call. This rule applies to every AskUserQuestion in commands, skills, and agents – no exceptions.

   **Scope**: the spacer is ONLY for messages that are immediately followed by an actual `AskUserQuestion` tool invocation. Do NOT add it to:
   - Regular chat messages with plain-text questions ("Want me to push it?", "Sound good?", etc.)
   - End-of-turn summaries
   - Any message not paired with an AskUserQuestion tool call
   
   The spacer exists to defeat the panel overlay – no panel, no need for spacer.

## Background continuation rule

When a flow ends with "wait for user feedback before proceeding" — every multi-phase implementation, every prototype iteration, every design-decision approval gate — the assistant MUST NOT initiate any background polling or self-rescheduling. This includes:

- `ScheduleWakeup`, `CronCreate`, `RemoteTrigger`
- The `/loop` skill and any of its variants (`/loop --dynamic`, `/loop --auto`, autonomous loops)
- `Task` invocations with `run_in_background: true`
- `Bash` invocations with `run_in_background: true` (unless the bash command is a known long-running build or test the user explicitly approved)

The signal that allows the next assistant action is the next user message — not a timer, not a filesystem watcher, not a self-reminder.

**Why**: during prototype iteration, the model has fired ScheduleWakeup while the user was typing feedback, causing the assistant to "continue on its own" before the user's input arrived. The user's typing window is not a polling target. Even when the assistant is confident it knows what comes next, the conversation contract is that the user drives the cadence on feedback waits.

**Exception**: legitimate long-running shell processes (e.g., `bun run build`, `npm test --watch`, a webpack dev server) that the user has explicitly asked the assistant to start and that need monitoring. Even then, prefer foreground (`run_in_background: false`) unless the user explicitly approved background monitoring.

## Image handling

Before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links in any prototype, landing page, or generated HTML, Read `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/ui-images/SKILL.md` and follow its instructions inline (do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true`). It decides per image whether to generate (hero / marketing / brand-specific) or stock-fetch (avatars / list rows / decorative many-of-a-kind), produces strong search queries or detailed AI-generation prompts, and lays out destination folders at `.design-engineer-plugin/design/exploration/images/`. This rule applies to every `<img>` tag the model emits – no exceptions, no "the user will replace it later" shortcuts.

## File hygiene (durability tiers)

Everything the plugin produces lives under `.design-engineer-plugin/` (one umbrella, clear mental model). The project root holds only the actual product codebase. Every plugin-produced file falls into one of four tiers; the tier determines where the file lives and whether it ships in git.

| Tier | Where it lives | Goes in git? | Examples |
|---|---|---|---|
| **Durable deliverable** | `.design-engineer-plugin/design/<subdir>/` (foundation, research, planning, exploration, psychology, reviews, dev, features, specs), feature-scoped specs at `design/features/<slug>/screens/`, `.design-engineer-plugin/prototype/`, `.design-engineer-plugin/plans/`, `tests/` (project source code stays at the project root) | Yes — these ARE the work | `problem-statement.md`, `references.md`, captured reference images, `<screen-slug>.spec.md`, `design/dev/decisions.md`, `prototype.html`, plan files, test scripts |
| **Plugin runtime state** | `.design-engineer-plugin/{config.yaml, dependencies.yaml}` and `.design-engineer-plugin/memory/` | Yes | config, dependency graph, project-map.md, debug-solutions.md |
| **Disposable working artifact** | `.design-engineer-plugin/temporary/<scratch\|playwright\|intermediate>/...` | No — gitignored | Playwright debug captures, intermediate analysis dumps, exploratory drafts, "let me check this URL" outputs |
| **Agent memory (Anthropic-managed)** | `.claude/agent-memory/design-engineer-compound-documenter/` | Yes | pipeline-state.md, key-decisions.md, stale-dependents.md (auto-managed by `memory: project` mechanism) |

**Rules for any skill, agent, or hook that writes a file:**

- Durable deliverables go to their canonical path under `.design-engineer-plugin/design/<subdir>/` (or `prototype/`, `plans/`). Every skill's SKILL.md names the exact path. Write deliverables only to those canonical subdirs and filenames; never invent a new subdir or filename for a deliverable.
- Anything throwaway goes to `.design-engineer-plugin/temporary/<scratch|playwright|intermediate>/`. Pick the subdir that matches the artifact's purpose (Playwright captures → `playwright/`, design-pipeline drafts → `intermediate/`, anything else → `scratch/`). Never write disposable artifacts to the project root, to a deliverable subdir, or anywhere else.
- The `init-project-structure.sh` script creates the umbrella + the `temporary/` subdirs and adds them to `.gitignore` automatically. The block is fenced with `# === BEGIN design-engineer-plugin ===` and `# === END design-engineer-plugin ===` so the script can re-run idempotently and replace legacy v5.4.x blocks.
- `.design-engineer-plugin/temporary/` is **purged at completion milestones** – whenever the full `meta-document` runs (end of the discovery spine, development Post-execution, an explicit `/design-engineer:document`) via its Step 7. The user can also run `/design-engineer:tidy` mid-session for the same effect. Lightweight per-step/per-phase flushes do not purge, and the purge never runs between visual-verification captures and QA presentation. Don't write things to `temporary/` expecting them to persist across milestones.
- If you need a file outside both the canonical paths and `temporary/`, that's a bug — pick a tier and a path.

**Why this matters:** without the tier discipline, a single feature implementation can leave a working tree dominated by debug artifacts that obscure the actual deliverables. The user loses the ability to tell which files are committable vs. which are throwaway, and the temptation to "commit everything and move on" pollutes the repository permanently. The tiers + `.gitignore` block + auto-purge let the user run `git add -A` without thinking and only ship what should ship.

**Stack-agnostic boundary:** the plugin's `.gitignore` block only ignores paths the plugin itself guarantees to write — `.design-engineer-plugin/temporary/`. Framework-specific outputs (test runner reports, build caches, native build artifacts, language ecosystem caches) are the user's responsibility to add to their own `.gitignore` outside the plugin's fenced block — since they vary by stack. The plugin doesn't presume Playwright, npm, Next.js, Xcode, Gradle, or any specific tool.

## Browser automation

Playwright is the plugin's one and only browser tool. Every browser action — navigate, screenshot, snapshot, click, fill, scroll, resize, visual verification, a `/design-engineer:review audit`, recreating a web frontend — runs through the bundled Playwright MCP (`mcp__plugin_design-engineer_playwright__*`, or a user-installed `mcp__playwright__*` if present).

- **Never reach for any other browser tool.** Do not use the Claude-in-Chrome browser extension, the `agent-browser` skill, `playwright-cli`, or any other browser automation, even when it is available in the session. If you catch yourself about to, stop and use the Playwright MCP.
- **Never claim Playwright is unavailable, locked, or "in use by another instance."** There is no such lock, and multiple Playwright sessions coexist without conflict. This is a false excuse the model invents to justify a fallback — do not. Launch Playwright and use it directly.
- The ONLY legitimate browser blocker is a **remote** site's bot-wall or auth-wall (Cloudflare, captcha, login gate). Handle those with the bot-block / auth-wall fallback (stop and ask the user, per the sections below) — never by switching to a different browser tool. A local tooling problem is never a reason to skip browser verification or to switch tools.

## Opening HTML for the user

Whenever you write an HTML file for the user to look at — a prototype, a landing page, a design mockup, the component gallery, a per-screen redesign — open it for them automatically and say it is open. Never end with "open it directly", "open it in your browser", or just hand them a path to open themselves. Opening a file from a terminal is awkward, so the plugin does it.

- Right after saving the file, run the OS open command on its path via a shell call: `open <file>` on macOS, `xdg-open <file>` on Linux, `start "" <file>` on Windows. If unsure of the platform, try `open` first.
- Then confirm plainly, e.g. "Opened it in your browser — `<path>`." Keep the path in the message so the user can reopen it later.
- Only if the open command genuinely fails (headless environment, no display) fall back to giving the path with one line: "I couldn't open it automatically here — open this: `<path>`."
- This applies to every HTML artifact the plugin produces, in every flow.

## Playwright filesystem hygiene

Playwright captures (screenshots, snapshots, traces) MUST land in one of the canonical paths below. Without an explicit `filename` argument, Playwright MCP writes to the project root, which pollutes the working tree across long sessions. The plugin enforces this contract via the `de-playwright-path-hook.js` PreToolUse hook on `browser_take_screenshot`, matched for both the bundled Playwright server (`mcp__plugin_design-engineer_playwright__*`) and a user-installed standalone `mcp__playwright__*` server – `filename` values outside the allowed prefixes (`.design-engineer-plugin/` and `tests/`) are denied with a structured help message.

| Capture purpose | Canonical path | Lifetime |
|---|---|---|
| Throwaway / debug (visual verification, "let me check this URL", exploratory analysis, design comparisons) | `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/<descriptive-name>.png` | Disposable. The `.design-engineer-plugin/temporary/` directory is git-ignored. Clean up at any time without losing work. |
| Persistent audit captures (`/design-engineer:review audit` per-page screenshots) | `.design-engineer-plugin/design/reviews/<YYYY-MM-DD>-audit/<page-slug>/screenshot.png` | Committed alongside the audit deliverable. |
| Moodboard reference captures (`ui-references-moodboard` Step 5b) | `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/<NN>-<section>.png` | Committed alongside the references deliverable. |
| Playwright test fixtures / visual regression baselines | `tests/<test-name>/<snapshot>.png` | Committed alongside the test scripts. |

Always `mkdir -p` the parent directory before the screenshot call. Forbidden: `filename: "screenshot.png"`, `filename: "page.png"`, any unprefixed filename, any absolute path, any path containing `..`. The hook denies all four.

The default `<YYYY-MM-DD-HHMMSS>` timestamp pattern for scratch captures keeps debug output organized by session — easy to scan, easy to delete a day's worth in one `rm -rf .design-engineer-plugin/temporary/playwright/2026-05-03-*`. The hook does not enforce the timestamp format inside `.design-engineer-plugin/temporary/playwright/` (that's user discretion); it only enforces that the prefix matches.

## Project state injection

A `UserPromptSubmit` command hook runs on every message and checks for `.design-engineer-plugin/config.yaml` in the project root. If the config file is absent, it injects `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` as context before the model processes anything. This ensures `/design-engineer:launch` routes correctly even when auto-memory contains rich project context from previous sessions.

## Command execution philosophy

All commands – design, review, dev, prototype, document – must follow the same execution pattern:

```
PLAN → EXECUTE → PRESENT → FEEDBACK
```

1. **Plan**: Present what you're about to do (scope, areas to check, approach). Ask for approval or adjustments.
2. **Execute**: Work through the plan one step at a time. After each step, present the finding or result.
3. **Present**: Show each finding individually with context and recommendation.
4. **Feedback**: Ask the user what to do (fix it, skip, dive deeper). Wait for response before proceeding.
5. **Summary**: After all steps, show a summary table.

**No flow should ever:**
- Skip the planning phase
- Dump raw output without structure
- Proceed without explaining what's happening
- Leave the user wondering "what just happened?"
- Re-ask a question the user already answered earlier in the conversation – synthesize from previous answers instead. Re-asking wastes time and breaks trust, especially in long sessions.

### Bot-block fallback (Playwright fails to load the requested page)

Many sites we need to read (Reddit threads, App Store reviews, marketplace product pages, some news/content/SaaS sites) block headless browsers with Cloudflare challenges, captchas, "verify you are human" walls, or 403/429 rate limits. When Playwright hits one of these, the snapshot returns near-empty content, a "Just a moment…" page, an Access Denied page, or a captcha image — NOT the requested content.

**The model MUST stop and ask the user to help.** Never silently skip a blocked URL. Never silently fall back to WebSearch snippets to fake the read. Never quietly drop the URL and continue with whatever was reachable. The user can almost always unblock the site in ~10 seconds (open it in their own browser and paste back what they see, or flip a site-specific blocker / Cloudflare bypass setting), so the cost of asking is trivial and the cost of silent failure is a degraded analysis the user doesn't know is degraded.

Detection signs (any one is enough to trigger the fallback):
- `browser_snapshot` returns a near-empty page or a page with text like "Just a moment…", "Verify you are human", "Checking your browser before accessing…", "Access Denied", "Too Many Requests"
- A captcha image is the dominant content
- HTTP 403 or 429 from `browser_navigate`
- The rendered content is clearly NOT the requested page (e.g., a generic error page or a login wall when the URL was supposed to be public)

Required protocol:
1. **Surface immediately** via `AskUserQuestion` (with the canonical 3-line spacer per output rule #6):
   - question: `"Hit a bot-block on <URL>. Want to help me get past it?"`
   - header: `"Bot-block"`
   - options:
     - `"I'll open it in my browser and paste back what I see"` — user reads + summarizes; you fold their notes in
     - `"I'll turn off the blocker and you retry"` — user flips a site-specific Cloudflare / extension setting; you retry once
     - `"Skip this URL — note it as blocked"` — log `[BLOCKED — skipped]` next to the URL in the deliverable's sources-consulted appendix; move on with reduced confidence
   - multiSelect: false
2. **Apply the choice.** If retry, retry exactly once — if it fails again, surface again with the same options minus the retry option.
3. **Never pretend** the analysis is complete when blocked URLs were silently dropped. Mark them in the sources list.

This rule applies to every Playwright-led step in any skill (competitor analysis Phase 4, references moodboard Step 5b, audit captures during /design-engineer:review, prototype QA, anything else). The agent file `agents/ux-researcher.md` and the per-skill SKILL.md files reference back to this contract.

### Auth wall fallback (signup / login required to see the product)

A separate failure mode from bot-blocks: many products gate their actual UI behind a login or signup wall. Marketing pages and landing pages are public; the dashboard, the editor, the actual product is not. Visiting `app.competitor.com/dashboard` or clicking "Open app" on the marketing site lands you on `/login` or `/signup`. Without an account, the model can't see the UI it was sent to evaluate.

**The model MUST ask the user how to proceed per gated competitor. Never silently give up; never silently fabricate "based on the marketing page" UI claims; never auto-sign-up without explicit user consent.** Automated signup using disposable identity has real ToS, ethical, and legal implications that the plugin author should not unilaterally absorb on behalf of every user — the user owns the decision per competitor.

Detection signs:
- `browser_navigate` redirects to `/login`, `/signup`, `/sign-in`, `/auth`, `/account/create`, or any URL with that semantic
- The page renders a centered email/password form when the URL was supposed to be the product
- A "Sign up to continue" or "Create an account" CTA is the dominant content
- A modal / overlay blocks the page demanding email + password

Required protocol — when an auth wall is detected, surface this `AskUserQuestion` (with the canonical 3-line spacer):

- question: `"<Competitor> requires an account to see the actual product. How should I get past it?"`
- header: `"Auth wall"`
- options:
  - `"I have a test account — I'll paste credentials"` — Recommended when available. User pastes email + password (treat as session-scoped, never persist to any file). You log in via Playwright and proceed. **Best path** because it's a real account on the user's terms.
  - `"I'll sign up myself and share session cookies / a logged-in URL"` — User opens the product in their own browser, signs up normally, then either pastes their session cookies or describes what they see. Lower friction than credentials, no persistent secrets.
  - `"Use a temp-email service to create a throwaway account"` — User explicitly approves automated signup. See "Temp-email signup protocol" below. Note ToS implications inline in the question description.
  - `"Skip this competitor's gated UI — analyze marketing + community signals only"` — Log `[AUTH-WALLED — gated UI not analyzed]` in the sources-consulted appendix. Continue with reduced confidence on UX quality / feature inventory; flag this gap explicitly in the deliverable.
- multiSelect: false

The auth-wall question's option descriptions should include the trade-off note for option 3:

> Note for "Use a temp-email service": this creates an account at the competitor's product using a disposable email. Some products forbid this in ToS, some block known disposable-email domains, and some require phone or payment that this can't bypass. Use only when the competitor's UI is essential to the analysis AND a real account isn't an option AND the user has confirmed they're comfortable with the trade-off.

#### Temp-email signup protocol (only when option 3 is selected)

If the user chose option 3, the model walks Playwright through signup using a public temp-email service. The protocol:

1. **Confirm scope per competitor**, never blanket. The user approving option 3 once doesn't mean approving it for every gated competitor in the analysis. Re-ask per competitor.
2. **Pick a temp-email service**. Reputable options (in order of "less likely to be blocked by competitor signup"): `mail.tm`, `mailinator.com` (public inbox), `temp-mail.io`, `emailondeck.com`. Some competitor signups domain-ban known disposable domains; if signup rejects the email, surface that to the user and ask whether to try a different service or fall back to option 1/2/4.
3. **Generate a random username** at the temp-email service, e.g., `de-research-<6-random-chars>@<service-domain>`.
4. **Sign up** at the competitor: fill the email, generate a random password (16+ chars, mixed), submit.
5. **Retrieve verification email**: navigate to the temp-email inbox, find the most recent message from the competitor, extract the verification link, follow it.
6. **Land on the dashboard** and resume the research (screenshots, UI tour, etc.).
7. **Log in the sources-consulted appendix**: `<competitor URL> — accessed via temp-email signup (mail.tm <username>) on <date>; throwaway account, no persistent data shared`. Transparency.
8. **Stop and ask** if any signup step blocks (phone verification, payment, captcha, "this email looks suspicious"): the user decides whether to retry with a different service, switch to option 1/2, or fall back to option 4.

Forbidden during temp-email signup:
- Persisting the temp-email username/password to any file (chat-only, session-scoped).
- Using the user's real personal info (real name, real email, real phone) for signup. The point is throwaway identity.
- Performing any action beyond what's necessary to view the public product surface (no clicking "Buy", no submitting forms with the competitor's customers' data, no scraping at scale).
- Re-using the same temp-email account across multiple competitors (each competitor → fresh signup).

This protocol is documented as user-consented, per-competitor automation. The plugin does not perform it autonomously.

### Research-heavy steps contract

When a step does external research (competitor analysis, user interviews, references gathering, market scanning, anything that involves browsing or fetching URLs), three additional rules apply on top of the general execution philosophy:

1. **Each research phase is a separate turn ending in `AskUserQuestion`.** No "I did Phase 4a, then 4b, then 4c, then drafted the deliverable, here are highlights" mega-turns. The user wants to react between phases — what communities, what threads, which competitors deserve deeper review.

2. **Highlights in chat are descriptive, not labels.** Every bullet is a complete claim with the evidence and the implication for THIS product, not a one-line tag. Pretend the user will NEVER open the saved file — every important takeaway must be fully understandable from the chat message alone. Wrong: `"GIA certification is the trust currency of the industry — added as A15"`. Right: a 2–3 sentence paragraph that states the claim, names the evidence (with source URL when applicable), says why it matters for this product, and references the artifact ID it became.

3. **Every research deliverable ends with a "Sources consulted" appendix listing every URL visited.** And the chat message that announces the deliverable inlines that same list (not just hides it in the file). Format: flat bulleted list grouped by phase, one URL per line, with a 5–10 word note on what was extracted. The user wants to be able to scan the list and re-verify findings or read threads themselves — their pattern-matching on community discussions is usually stronger than the model's. The chat message after a research deliverable always includes an explicit invitation: "Want to do your own pass on any of these threads? Drop your notes back here and I'll fold them in."

These three rules apply to every research-heavy step in every skill (ux-competitor-analysis, ux-user-interviews, ui-references-moodboard, etc.).

**Agent usage rule:**
- Dispatch an agent when the work would genuinely flood the main context or fan out across many parallel reads; for quick, iterative work, doing it inline is fine.
- After an agent completes, the main model summarizes its output and presents it step by step with AskUserQuestion interaction between findings or deliverable sections, rather than dumping all findings at once.

**Plan copy rule:**
- After ExitPlanMode approval, copy the plan to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[name].md`. This is what git branch matching and archival key off, and it keeps the approved plan with the project rather than only in `~/.claude/`.

**Implementation architecture rule:**
- Implementation must follow the project's existing component architecture. If the project uses atomic design, create separate component files in the appropriate directories (atoms/, molecules/, organisms/, pages/). Never create a monolithic file containing multiple components or views. Read existing components before writing new ones to match patterns, naming, and design token usage.

## Compact-message format (when the user asks for one)

You can NOT reliably detect your own context-window usage from inside a turn — Claude Code does not inject token counts or context-percentage signals into your context, so any auto-trigger based on "I think we're at 90%" is unreliable and was producing inconsistent / no behavior in practice. Do NOT proactively warn the user about context usage. The trigger is **the user explicitly asking** — typing `/design-engineer:stop` (which generates the message via `commands/stop.md` Step 4), or asking in chat for "a compact message", "summarize for /compact", "what should I paste into /compact", etc.

When the user asks, generate a single self-contained compact message that preserves everything the next session needs to pick up without re-reading old chat. Do NOT output a generic "you've worked on a lot, here's a vague summary" — that's the failure mode the user has reported. Fill in real session values; never output placeholders like `[project]` or `[list]`.

The compact message must preserve:
- Current project name, absolute path, and plugin version
- Which `/design-engineer:` command is running
- Current phase and skill position (e.g., "Phase 3 Planning, after `ux-mvp-requirements`, next is `ux-information-architecture`")
- Key decisions made this session — durable choices that affect downstream deliverables (B2B vs B2C focus, mobile-first vs desktop-first, the specific design feel chosen, etc.)
- Deliverables completed this session and any stale dependents from `compound-documenter`'s memory
- What to do next — the literal next action, not "continue the work"
- Any unresolved questions or blockers the user is waiting on

Format the response like this:

> Here's a compact message you can paste into `/compact`:
>
> `Keep full context of <project name> at <absolute path>. Current state: v<X.Y.Z>, running /design-engineer:<command>. Phase <N> (<phase name>): completed <skill list>, next is <skill name>. Key decisions: <bullet list of cross-cutting choices>. Deliverables updated: <list>. Stale dependents: <list or "none">. Next step: <literal next action>. <Any blockers or open questions, or "none">.`

The angle-bracket fields above are placeholders for YOU to fill in from the session — they must NOT appear in the output. If a field genuinely doesn't apply (no stale dependents, no blockers), write "none" instead of leaving the bracket.

Don'ts:
- Do NOT proactively suggest compacting based on perceived session length. You can't measure context reliably; the suggestion will be wrong-timed and annoying.
- Do NOT output the template with placeholders intact (e.g., `[project]`, `<phase name>`).
- Do NOT include conversational filler ("This session has covered a lot of ground...") before the compact message — the user asked for the compact message, not a preamble.
- Do NOT generate a compact message before reading `.design-engineer-plugin/config.yaml` and the compound-documenter memory at `.claude/agent-memory/design-engineer-compound-documenter/` for the actual session state. Generic compact messages are useless — the failure mode is producing one without grounding it in current files.

## Memory Management

The plugin uses two memory layers:

- **Claude Code auto-memory** (`~/.claude/projects/<slug>/memory/MEMORY.md`) – owned and managed by Claude Code itself. The first 200 lines auto-load every session. **Do NOT call Read on this file** – Claude Code already loads it for you, and on fresh projects the file may not exist yet, surfacing a confusing red "File does not exist" error.
- **Plugin-local memory** (`.design-engineer-plugin/memory/`) – owned by the plugin. Contains `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log). Seeded by `init-project-structure.sh` during meta-setup; loaded on demand.

**Defensive read pattern** (belt and suspenders): before calling Read on any plugin memory file, check existence first. Use `Bash test -f .design-engineer-plugin/memory/project-map.md` or `Glob` to verify the file is there. If absent, skip silently – fresh project, nothing to read. Never call Read on `~/.claude/projects/.../memory/MEMORY.md`.

**Note on enforcement**: writes to plugin-local memory files are advisory – Claude updates them when it notices a relevant trigger, but nothing structurally forces the write. Treat the rules below as guidance, not contracts. If you skip a memory update, the next session may lose that context. The compound-documenter agent's project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/` is the structurally enforced layer for pipeline state – see the agent's frontmatter (`memory: project`) for that documented Anthropic mechanism.

### Project Map (`.design-engineer-plugin/memory/project-map.md`)

Maintain a living file tree of the project. Every entry follows this format:

```
path – description (≤10 words) | when to read
```

**Update guidance** (advisory – Claude does this when it notices the trigger; not structurally enforced):
- After creating any file or folder, consider adding an entry with path, description, and read trigger
- After deleting any file or folder, consider removing its entry
- After significant restructuring (moving files, renaming directories), update affected entries
- Skip minor edits to existing files – only structural changes warrant a project-map update

**Read project-map.md BEFORE:**
- Any filesystem exploration or file search
- Creating implementation plans (Plan Mode)
- Running any agent that needs project structure

This replaces ad-hoc exploration. If project-map.md exists, use it instead of globbing or grepping for structure.

### Auto-memory MEMORY.md (managed by Claude Code, NOT by this plugin)

Claude Code's auto-memory `MEMORY.md` is loaded automatically every session. The plugin does not Read or Write this file directly – Claude Code's `/memory` command and its built-in auto-memory mechanism handle it. If you want to record cross-session context, ask the user to use `/memory` or just rely on Claude Code's auto-memory writes.

**What NOT to save anywhere in plugin memory or auto-memory:**
- Individual deliverable content (already in design/)
- Resume state details (already in .design-engineer-plugin/config.yaml + the compound-documenter agent memory)
- Dependency status (already in .design-engineer-plugin/dependencies.yaml as static graph)
- Anything already in this CLAUDE.md
- How the plugin works or what skills exist

### Debug Solutions (`.design-engineer-plugin/memory/debug-solutions.md`)

Save hard-won debugging fixes that took 3+ attempts or required non-obvious solutions.

Each entry: the error, what was tried and failed, what actually fixed it.

**Read debug-solutions.md BEFORE** attempting fixes for build, deploy, or environment errors – the solution may already be documented.

### When to Read Memory

All Read operations on plugin-local memory files MUST verify existence first (Bash `test -f` or `Glob`); skip silently if absent. Never call Read on auto-memory `~/.claude/projects/<slug>/memory/MEMORY.md` – Claude Code already auto-loads it.

| Trigger | What to read |
|---------|-------------|
| Session start | Auto-memory MEMORY.md auto-loads (no Read call needed). Verify and Read `.design-engineer-plugin/memory/project-map.md` if present, before any exploration. |
| Before implementation/planning | `.design-engineer-plugin/memory/project-map.md` (if present) – know the project structure |
| When encountering errors | `.design-engineer-plugin/memory/debug-solutions.md` (if present) – check for known fixes |

### When to Write Memory (advisory)

These are heuristics. Claude updates the files when it notices the trigger; nothing structurally forces the write.

| Trigger | What to update |
|---------|---------------|
| File/folder created or deleted | `.design-engineer-plugin/memory/project-map.md` – add or remove entry |
| Skill or phase completed | invoke compound-documenter (it updates pipeline-state.md structurally) |
| Hard bug solved (3+ attempts) | `.design-engineer-plugin/memory/debug-solutions.md` – error + failed attempts + fix |
| Cross-cutting design decision made | compound-documenter records it in key-decisions.md structurally |
| Session ending | run /design-engineer:document so compound-documenter flushes its memory; optionally update plugin-local memory files if relevant changes occurred |
