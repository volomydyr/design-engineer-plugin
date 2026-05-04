# Design Engineer Plugin Development

## Skill loading from commands (doc-compliant pattern)

This plugin's skills all set `disable-model-invocation: true` (intentional — skills are libraries loaded by commands, not auto-discoverable workflows). The Skill tool will REJECT any attempt to invoke them programmatically with the error: `Skill <name> cannot be used with Skill tool due to disable-model-invocation`.

**Therefore, never tell the model to "load the X skill" or "invoke the Y skill" in a command body.** The model interprets that as a Skill-tool call and the command crashes on the very first run.

### The required pattern

Every command file MUST start its body with this short note (placed just after the `# Title` heading and before any other section):

```markdown
## Plugin paths

Your conversation context contains a line `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` injected by the plugin's UserPromptSubmit hook. Whenever this command references `${DESIGN_ENGINEER_PLUGIN_ROOT}/...`, substitute the absolute path from that context line. No shell commands are run from this command body.
```

This relies on a single, permission-free mechanism: **the plugin's UserPromptSubmit hook (`hooks/de-start-state.sh`) injects `DESIGN_ENGINEER_PLUGIN_ROOT: <abs path>` as `additionalContext` text** on every prompt. The model sees that line in its context and uses it as the substitution value when it encounters `${DESIGN_ENGINEER_PLUGIN_ROOT}/...` in the command body.

### Mechanisms NOT to use, and why

- **Bash injection (`` !`...` ``)** — documented at https://code.claude.com/docs/en/slash-commands.md#inject-dynamic-context, but Claude Code's permission system blocks `!`-prefix patterns at command-load time in Auto mode and any restrictive permission preset, with: `Shell command permission check failed for pattern "!...". Permission for this action has been denied. Reason: Insufficient information about the Bash command to evaluate; action is unverifiable.` v4.8.5 tried this approach and crashed `/product:launch` for users in Auto mode. Do NOT use bash injection in command bodies.
- **`${CLAUDE_PLUGIN_ROOT}`** — officially documented for `hooks/hooks.json` `command` fields ONLY. Does not auto-expand inside slash command markdown bodies. Hooks may use it; commands may not.
- **`Skill` tool to invoke plugin skills** — every plugin skill sets `disable-model-invocation: true`, so the Skill tool will reject them with `Skill <name> cannot be used with Skill tool due to disable-model-invocation`. The only correct way to load a skill is `Read ${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<name>/SKILL.md and follow its instructions inline`.

### Skill references inside commands

When a command needs to invoke skill instructions, write:

```markdown
Read the SKILL.md at `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<skill-name>/SKILL.md` (substitute the resolved plugin root from the top of this file) and follow its instructions inline. Do NOT use the `Skill` tool — plugin skills set `disable-model-invocation: true` and the Skill tool will reject them.
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
├── .mcp.json
├── CLAUDE.md
├── README.md
├── CHANGELOG.md
├── hooks/
│   ├── hooks.json
│   ├── check_deliverable_deps.py
│   ├── session_dep_summary.py
│   ├── de-statusline.js
│   ├── de-safety-hook.js
│   ├── de-tdd-hook.js
│   ├── de-fidelity-hook.js
│   └── de-prompt-injection-hook.js
├── agents/                         # 10 specialized agents
├── commands/
│   └── product/                    # 9 main commands + mute-unmute-sound utility (product: namespace)
└── skills/                         # 57 skills (56 with SKILL.md + 1 reference-only)
```

## Skill Compliance Checklist

When adding or modifying skills:

### YAML Frontmatter (Required)

- [ ] `name:` present and matches directory name
- [ ] `description:` present, describes what it does AND when to use it
- [ ] `disable-model-invocation: true` present on ALL skills
- [ ] `model:` present – `opus` (default) or `sonnet` (mechanical tasks only)
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

## Model Configuration

Every agent and skill MUST have an explicit `model:` field in its frontmatter.

### Allowed `model:` values (per [Anthropic sub-agent docs](https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields))

Both aliases and full model IDs are officially supported:
- **Aliases**: `opus`, `sonnet`, `haiku`, `inherit`
- **Full model ID**: e.g., `claude-opus-4-7`, `claude-sonnet-4-6`

### Assignment Principles

- **`model: claude-opus-4-7`** – default for tasks requiring deep reasoning, creative output, nuanced analysis, or complex implementation. Pinned explicitly to the version (not the `opus` alias) so the plugin's quality expectations are unambiguous. When Anthropic releases a newer Opus, refresh this pin in a single PATCH bump rather than relying on alias drift.
- **`model: sonnet`** – alias kept for mechanical tasks (file reading, template generation, setup wizards, documentation formatting). Sonnet is updated less frequently and less variably; the alias is fine here.
- **No `model: inherit`** – plugin should be explicit about quality expectations.
- **No `model: haiku`** – not used in this plugin.

### Skill frontmatter

Skills include `model:` and `effort:` after `disable-model-invocation`:

```yaml
---
name: skill-name
description: "..."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
---
```

### Agent frontmatter

Plugin agents support these frontmatter fields (per [plugins reference](https://code.claude.com/docs/en/plugins-reference#agents)): `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation`. The fields `hooks`, `mcpServers`, and `permissionMode` are silently ignored on plugin-shipped agents (security restriction).

**`disable-model-invocation: true` is a SKILLS-only field** — including it on an agent is invalid. The v5.5.1 fix removed it from `agents/advisor.md` (the only agent that mistakenly had it). Other agents already lacked it.

```yaml
---
name: agent-name
description: "..."
model: claude-opus-4-7
effort: high
---
```

For agents that need cross-session memory (like `compound-documenter`), add `memory: project`.

### Effort configuration

Both agents and skills MUST have an explicit `effort:` field in its frontmatter, placed after `model:`. Officially supported on plugin agents per the docs.

#### Assignment principles

- **`effort: xhigh`** – the most complex tasks: broad multi-principle scans, comprehensive reviews, ethical reasoning, pipeline orchestration. New recommended top-tier on Opus 4.7 per Anthropic docs ("Best results for most coding and agentic tasks. Recommended default on Opus 4.7"). Persists across sessions.
- **`effort: high`** – default for most skills and agents. Tasks requiring synthesis, nuanced judgment, multi-perspective analysis, or creative output.
- **`effort: medium`** – structured workflows where the model follows established steps: setup wizards, template generation, documentation formatting.
- **`effort: low`** – not used in this plugin.
- **`effort: max`** – exists but **NOT recommended** for plugin defaults. Per Anthropic: "may show diminishing returns and is prone to overthinking. Test before adopting broadly". Also session-only (does not persist). Use only if a specific component demonstrably benefits from it during testing.

Effort and model are independent axes:
- `model: claude-opus-4-7` + `effort: xhigh` – broadest scans and reviews (psych-full-scan, ux-full-review, ux-bias-audit, ux-ethics-review, meta-orchestrator, advisor)
- `model: claude-opus-4-7` + `effort: high` – deep analysis, creative output, complex implementation
- `model: sonnet` + `effort: high` – sonnet tasks needing thorough reasoning (documentation, testing)
- `model: sonnet` + `effort: medium` – structured sonnet tasks (setup, templates, status tracking)

### When adding new agents/skills

- Default to `model: claude-opus-4-7` unless the task is clearly mechanical
- Default to `effort: high` – downgrade to `medium` only for clearly mechanical tasks, upgrade to `xhigh` for broad multi-principle scans
- Document the rationale if choosing `sonnet` or `medium` for a new component
- Never include `disable-model-invocation:` on an agent (skills only)

## Command Naming Convention

Commands use `product:` prefix to keep the namespace short, distinct, and free of "design" so typing `/design` in the command picker only surfaces `/product:design`:

- `/product:launch` - Universal entry point (new projects, returning projects, existing projects)
- `/product:design` - Full design workflow orchestrator
- `/product:prototype` - HTML prototype generation
- `/product:dev` - Development pipeline
- `/product:review` - Multi-layer design review (includes psychology audit)
- `/product:document` - Knowledge documentation and stakeholder communication
- `/product:stop` - Save progress and pause mid-activity
- `/product:tidy` - Wipe disposable working artifacts under `.design-engineer-plugin/temporary/`
- `/product:help` - Shows all available commands, project status, and mode

## Living Documents

Deliverables created by this plugin are documented in two layers:

- **Static dependency graph** at `.design-engineer-plugin/dependencies.yaml` – read-only documentation showing which deliverables inform which downstream ones. The plugin does not mutate this file; users read it to know what's connected.
- **Live progress** at `.claude/agent-memory/design-engineer-compound-documenter/` – three structured files (pipeline-state.md, key-decisions.md, stale-dependents.md) maintained by the compound-documenter agent via Anthropic's documented `memory: project` mechanism. The agent computes stale-dependents by cross-referencing the static graph against recent edits.

Run `/product:document` after each phase or significant decision so the compound-documenter agent flushes state into its memory. Downstream-review prompts also fire automatically via `hooks/check_deliverable_deps.py` when a deliverable file is edited.

**Path note**: deliverable files always live at `design/...` – this is fixed in the current implementation. The `deliverables_path` field in `.design-engineer-plugin/config.yaml` is a reserved marker for future use; nothing in the code currently reads it.

## Plan Mode

Always use `EnterPlanMode` for any non-trivial implementation planning – never output plans as plain text messages.

### When to Use Plan Mode

Use Plan Mode for any task that involves multiple files, phased implementation, architectural decisions, or more than a single-line fix. Do NOT use Plan Mode for: single-line fixes, typo corrections, or pure research tasks.

### Structured plan format

When in Plan Mode, write plans using this structure:

```markdown
# Implementation Plan: [Feature/Task Name]

## Summary
[1-2 sentence overview of what will be implemented]

## Architectural Decisions
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

## Phase 1: [Phase Name]
**Objective**: [What this accomplishes]
**Depends on**: none
**Files**:
- Create: [file paths]
- Modify: [file paths]
**Reuse**: [List every existing component you will reuse. For each, state: use as-is, extend with new variants/props, or explain why a new component is needed. Never write "leverage existing components" – be specific.]
**Checklist:**
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]
**QA**: [What the user should check and how to verify – be specific]

## Phase 2: [Phase Name]
**Objective**: [What this accomplishes]
**Depends on**: Phase 1
**Files**:
- Create: [file paths]
- Modify: [file paths]
**Reuse**: [List every existing component you will reuse. For each, state: use as-is, extend with new variants/props, or explain why a new component is needed. Never write "leverage existing components" – be specific.]
**Checklist:**
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]
**QA**: [What the user should check and how to verify – be specific]

## Risk Assessment
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

## Questions for User
- [Any decisions that need user input before proceeding]
```

Every phase MUST have `**Depends on**`, `**Checklist**`, and `**QA**` fields. Dependencies determine implementation order. The checklist breaks the phase into discrete deliverables that can be checked off during implementation. QA instructions tell the user exactly what to review – not generic "check it works" but specific things to look at (files changed, behavior to test, edge cases to verify).

### Project-local storage

After plan approval, copy the approved plan to `plans/[YYYY-MM-DD]-[descriptive-name].md` in the project root. Create the `.design-engineer-plugin/.design-engineer-plugin/plans/` directory if it does not exist.

### Archival

When implementation is complete, move the plan from `.design-engineer-plugin/.design-engineer-plugin/plans/` to `.design-engineer-plugin/.design-engineer-plugin/plans/archive/`. Create the `.design-engineer-plugin/.design-engineer-plugin/plans/archive/` directory if it does not exist.

### Workflow

1. `EnterPlanMode` – write a structured plan to the plan file
2. **Advisor checkpoint (early-task):** before `ExitPlanMode` on any plan with more than one phase or non-trivial scope, invoke the `advisor` skill (`skills/advisor/`) with: the user's request, key constraints discovered, the proposed phase breakdown, anything you're uncertain about. Apply the advice or use the reconcile pattern if it conflicts with primary-source evidence. This is the docs' "before substantive work" call ([advisor docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)).
3. `ExitPlanMode` – present the plan for user approval
4. After approval, copy to `.design-engineer-plugin/plans/[YYYY-MM-DD]-[descriptive-name].md`
5. If a git repo exists and the current branch is `main` or `master`, create a feature branch: `git checkout -b feat/[plan-name-slug]`
6. Create a task for each phase (`TaskCreate`) with `blockedBy` dependencies matching the plan
7. **For each phase in dependency order:**
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
   e. **Advisor checkpoint (pre-done):** after deliverables are durable (files written, tests run), invoke the `advisor` skill with: what was implemented, test results, anything that surprised you. Apply or reconcile.
   f. Mark the phase task `complete` (`TaskUpdate`)
   g. Present to the user: what was done (brief), QA instructions from the plan, and "Review this phase and share feedback. I'll proceed to Phase N+1 after your approval."
   h. **WAIT** – do not proceed until the user responds
   i. If the user has feedback, address it (may take multiple rounds of feedback)
   j. Only proceed to the next phase after explicit user approval
   k. After user approves, commit this phase's changes and push using `dev-github-workflow` Mode 1 (Conventional Commits format with phase context AND the plugin attribution footer – Mode 1 is plan-driven so the footer is included; Mode 2 manual user commits do NOT include the footer)
8. After all phases complete, move the plan to `.design-engineer-plugin/.design-engineer-plugin/plans/archive/`
9. If on a feature branch, create a PR via `gh pr create` and ask the user whether to merge

### Implementation rules

- **Never implement multiple phases in a single turn.** One phase, one review, one approval.
- **Every phase must have QA instructions.** If the phase is simple, the QA can be brief ("check the button color changed"). If complex, be specific ("open the settings page, verify the new panel appears, try toggling it on/off, check that the state persists on page reload").
- **Dependencies determine order.** Always implement sequentially for user review, even if phases are independent.
- **Feedback is iterative.** The user may have multiple rounds of feedback on a single phase. Address all feedback before moving on.
- **Advisor consult before declaring done.** After deliverables are durable, invoke the `advisor` skill for a pre-done strategic check. Skip on trivial single-edit tasks (the advisor docs flag short reactive tasks as low-value advisor calls); use it on multi-phase plans and any task where the next action affects what the user sees as "done."

## Code Quality: /simplify

`/simplify` is a bundled Claude Code skill that reviews changed code for reuse, quality, and efficiency. For substantial changes it fans out into three parallel review agents. That fan-out is great for new components and large refactors and noisy for one-line color swaps — so the call is **scaled by change size**, not run after every Write/Edit.

### Tier-based scaling (mirrors the design-grounding hook's tiers)

The design-grounding hook (`hooks/de-design-grounding-hook.js`) classifies each UI Edit / MultiEdit / Write into one of three tiers using `computeChangeSize()` + `isSinglePropertySwap()`. Use the same classification to decide whether to call `/simplify`:

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

Do NOT run `/simplify` during prototyping. Prototypes are throwaway visual artifacts – code quality doesn't matter. `/simplify` only applies during `/product:dev` implementation.

### How

Invoke `/simplify` as a slash command. It runs in the main conversation; the 3-agent fan-out is internal to the skill and only fires for Large-tier changes (when `/simplify` itself decides the change warrants it). You don't dispatch the agents directly from this plugin.

## Design Grounding Pre-Flight scaling

The design-grounding hook denies UI writes until certain reads happen and a Pre-Flight block is output. The depth of the Pre-Flight block is also tier-scaled:

| Tier | Required Pre-Flight output before the edit |
|---|---|
| **Trivial** | One line: `WHY: <reason>`. No Domain Exploration. No Signature Test. No 5-field block. |
| **Medium** | Compact 3-field Pre-Flight: Intent + WHY + anti-pattern self-check. Skip Domain Exploration + Signature Test. |
| **Large** | Full 5-field Pre-Flight: Intent / Domain Exploration / WHY / anti-pattern self-check / Signature Test. |

The hook injects this scaling table into its deny message on the first UI write of the session, so the model receives it once and applies it to every subsequent edit. Keep applying it for the rest of the session — do not silently drift back to full Pre-Flight on small swaps.

### What "trivial" means precisely

A swap qualifies as Trivial only if BOTH conditions hold:

1. The change is ≤5 lines (counted as max of old vs new line count for Edit / MultiEdit, or content lines for Write).
2. The change matches a single CSS / style / Tailwind property pattern — one of: `color`, `background(-color)?`, `fill`, `stroke`, `border-color`, `border`, `padding`, `margin`, `gap`, `width`, `height`, `font-size`, `line-height`, `font-weight`, `border-radius`, `opacity`, `box-shadow`, `outline` (CSS); or their React inline-style camelCase forms; or a single Tailwind utility class swap.

Write (creating a new file) is NEVER Trivial — new files always warrant full grounding. MultiEdit qualifies only when ALL its edits are individually trivial AND there are at most 3 edits.

### What's still required even for Trivial swaps

The hook still enforces the per-session gates regardless of tier:

- `.design-engineer-plugin/prototype/prototype.html` must be Read if it exists.
- `.design-engineer-plugin/design/exploration/references/references.md` (or equivalent) must exist on disk.
- `.design-system/system.md` or `.design-engineer-plugin/design/dev/design-system.md` must be Read if either exists.

These are about whether the user is in a UI-implementation context at all, not about depth — so they fire once per session regardless of edit size.

## Component Gallery Contract

The plugin maintains a **single-page component gallery** in every project where UI work happens – a visual catalog of every component, all variants visible at once, real production styles, source-path labels per entry. Two purposes: (a) duplicate detection (Claude tends to create five new versions of an existing component – the gallery makes redundancy visually obvious), and (b) visual quality assurance (one viewport, all components, real styles – closer to a design canvas than a docs site).

The gallery is **stack-agnostic**. The skill `skills/dev-component-gallery/` queries the bundled context7 MCP for each project's framework's idiomatic showcase pattern and scaffolds accordingly – Next.js route, SwiftUI `#Preview` canvas, Jetpack Compose `@Preview`, vanilla HTML, Astro page, Flutter widgets-gallery, whatever the framework's docs say is current. No hardcoded "framework → location" table; the skill adapts.

### The universal Gallery Contract

Every gallery file the skill scaffolds carries this contract at the top in language-appropriate comment syntax (see `skills/dev-component-gallery/references/gallery-contract.md` for the canonical text and the per-language adaptation table):

> Every component MUST be imported (or used) from its production source. Never copy-paste, restub, or inline a component. NO hardcoded styles, no inline `style="..."` attributes, no extra style rules in the gallery file, no language-equivalent style overrides. Variants are reached via the component's own public API only (props / attributes / modifiers / classes / slots). If a state can't be reached via the component's API, that's a component bug – fix at the component, not in the gallery. Every entry shows its source file path next to the rendered component. The gallery is a viewer, not a workshop.

### Enforcement (no hooks)

- **`agents/frontend-implementer.md`** – after creating or modifying any component, invokes `dev-component-gallery` to add or update its entry; never duplicates components in the gallery; never writes inline styles in the gallery file. Reads the existing gallery before adding new components (duplicate-detection step).
- **`agents/design-system-auditor.md`** – gallery audit pass at FAIL severity (every component has an entry, no inline styles, imports resolve to production paths, visually-identical entries flagged as duplicates, variants via API only).
- **`skills/dev-claude-md/SKILL.md`** – generated project CLAUDE.md includes the Gallery Contract so the rule survives in the user's repo.
- **`skills/dev-prototyping/SKILL.md`** – cross-references the lifecycle (prototype = design exploration before implementation; gallery = shipped components after).

There is no PreToolUse or Stop hook for the gallery contract. Enforcement is the agents' responsibility.

## TDD with Playwright CLI

All code-producing steps follow Test-Driven Development using Playwright CLI. A PreToolUse hook enforces this – source code writes are blocked when no test scripts exist in `tests/`.

### The Iron Law

**No production code without a failing test first.** Wrote code before the test? Delete it. Don't keep as "reference." Don't adapt it. Delete means delete. Implement fresh from tests.

### TDD Cycle

1. **Red**: `test-writer` agent creates failing test scripts in `tests/`
2. Run test scripts → verify they fail **correctly** (fails because feature is missing, not because of typos or script errors)
3. **Green**: Implement the feature (backend-implementer, frontend-implementer)
4. Run test scripts → verify they pass, all other tests still pass, output is clean
5. **Refactor**: `/simplify` cleans up the code

### Red Flags – Stop and Start Over

- Code written before test
- Test passes immediately on first run
- Test written after implementation
- Keeping pre-test code as "reference"
- Rationalizing "just this once"

### Test Storage

- Active test scripts: `tests/*.sh` (executable shell scripts using Playwright CLI)
- Archived tests: `tests/archive/` (moved after feature completion, like `.design-engineer-plugin/.design-engineer-plugin/plans/archive/`)

### When TDD Applies

- After plan approval, before backend-implementer and frontend-implementer
- The hook only activates during implementation (when `.design-engineer-plugin/.design-engineer-plugin/plans/` has active plan files)
- Note: TDD does NOT apply during prototyping. Prototypes are throwaway visual artifacts.

### Testing Anti-Patterns

See `skills/dev-agent-setup/references/testing-anti-patterns.md` for the 5 common anti-patterns: testing mock behavior, test-only methods in production, mocking without understanding, incomplete mocks, and tests as afterthought.

## Requirement Fidelity

Two PostToolUse hooks enforce that plans and implementation match user requirements exactly:

- **Command hook** (`de-fidelity-hook.js`) – injects a fidelity reminder after source code writes during active implementation
- **Prompt hook** (Haiku) – reviews plan files for requirement drift after every write

### What Constitutes Drift

- Features or functionality not explicitly requested by the user
- Modified copy, text, or naming from what the user specified
- "Bonus" features, creative additions, or unsolicited improvements
- Scope expansion beyond what was stated

### What Is NOT Drift

- Implementation details (file structure, variable names, technical approach)
- Reasonable error handling for stated requirements
- Standard patterns required by the framework/language

### The Rule

If a feature, behavior, or piece of copy was not explicitly requested by the user, it must not appear in plans or implementation. The ONLY way to introduce something new is to ask the user first using AskUserQuestion.

### Scope vs. execution

Requirement fidelity is strict on SCOPE but flexible on EXECUTION:
- **Strict on scope**: Never add features, screens, or requirements the user didn't ask for. This stays absolute.
- **Flexible on execution**: Within the approved scope, smart implementation decisions are welcome – better component patterns, cleaner API shapes, optimized interaction flows. Surface these as questions via AskUserQuestion: "I noticed X could work better if we Y – want me to include that?"
- The model should challenge and suggest, but always through AskUserQuestion – never silently add or silently ignore opportunities.

## Output formatting

Three rules that apply to everything Claude writes – chat messages, deliverables, code comments, UI copy, headings, labels, buttons, filenames, everything:

1. **En dashes only** – use `–` (en dash). Never `–` (em dash), `--` (double hyphen), or ` - ` (hyphen as dash). Hyphens in compound words are fine (test-first, psychology-backed).
2. **Sentence case only** – capitalize the first word and proper nouns. Never Title Case. This applies to headings, button labels, tab names, navigation items, placeholder text, menu items, toast messages, and any other text Claude generates.
3. **No internal jargon in user-facing output** – never mention config file names (`.design-engineer-plugin/config.yaml`, `.dependencies.yaml`), internal skill names (`ux-problem-statement`, `meta-orchestrator`), hook names, script names, or detection logic in messages shown to the user. Describe what things DO, not what they're called internally. "Your progress was saved" not "Resume state written to `.design-engineer-plugin/config.yaml`". "You have Figma connected" not "Figma plugin: [FOUND]". This rule applies to all commands, skills, and agents.

Wrong: "User Settings – Account Details"
Right: "User settings – account details"

Wrong: "Save Changes", "View All Projects", "Get Started Now"
Right: "Save changes", "View all projects", "Get started now"

Wrong: "Loading – Please Wait"
Right: "Loading – please wait"

Wrong: "Problem Statement", "Target Audience", "MVP Requirements"
Right: "Problem statement", "Target audience", "MVP requirements"

Wrong: "Data density – over marketing", "sovereignty -- wants"
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
5. **AskUserQuestion must always have 2–4 options** – never send an AskUserQuestion with only 1 option. The minimum is 2. Always specify `multiSelect: true` or `multiSelect: false` explicitly. Use `multiSelect: true` when multiple answers are valid (failure modes, risk assessment, feature selection, review areas, psychology skills). Use `multiSelect: false` when the user must choose one direction (mode, approach, framework, scope).

6. **Pad the chat before AskUserQuestion** – on most clients, the question panel overlays the bottom of the chat, hiding whatever you wrote just above it. Before EVERY AskUserQuestion call, end your preceding message with a vertical spacer so the overlay covers the spacer instead of substantive content. Use this exact spacer block (it renders as visible vertical space in markdown clients):

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

Before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links in any prototype, landing page, or generated HTML, invoke the `ui-images` skill. It decides per image whether to generate (hero / marketing / brand-specific) or stock-fetch (avatars / list rows / decorative many-of-a-kind), produces strong search queries or detailed AI-generation prompts, and lays out destination folders at `.design-engineer-plugin/design/exploration/images/`. This rule applies to every `<img>` tag the model emits – no exceptions, no "the user will replace it later" shortcuts.

## File hygiene (durability tiers)

Everything the plugin produces lives under `.design-engineer-plugin/` (one umbrella, clear mental model). The project root holds only the actual product codebase. Every plugin-produced file falls into one of five tiers; the tier determines where the file lives and whether it ships in git.

| Tier | Where it lives | Goes in git? | Examples |
|---|---|---|---|
| **Durable deliverable** | `.design-engineer-plugin/design/<subdir>/` (foundation, research, planning, exploration, psychology, reviews, dev, features), `.design-engineer-plugin/prototype/`, `.design-engineer-plugin/plans/`, `tests/` (project source code stays at the project root) | Yes — these ARE the work | `problem-statement.md`, `references.md`, captured reference images, `prototype.html`, plan files, test scripts |
| **Plugin runtime state** | `.design-engineer-plugin/{config.yaml, dependencies.yaml}` and `.design-engineer-plugin/memory/` | Yes | config, dependency graph, project-map.md, debug-solutions.md |
| **Disposable working artifact** | `.design-engineer-plugin/temporary/<scratch\|playwright\|intermediate>/...` | No — gitignored | Playwright debug captures, intermediate analysis dumps, exploratory drafts, "let me check this URL" outputs |
| **Per-session marker** | `.design-engineer-plugin/.active-workflow` | No — gitignored | per-turn workflow marker for the process-recall hook |
| **Agent memory (Anthropic-managed)** | `.claude/agent-memory/design-engineer-compound-documenter/` | Yes | pipeline-state.md, key-decisions.md, stale-dependents.md (auto-managed by `memory: project` mechanism) |

**Rules for any skill, agent, or hook that writes a file:**

- Durable deliverables go to their canonical path under `.design-engineer-plugin/design/<subdir>/` (or `prototype/`, `plans/`). Every skill's SKILL.md names the exact path. The path-validation hook (`de-deliverable-path-hook.js`) denies non-canonical subdirs and filenames at write time.
- Anything throwaway goes to `.design-engineer-plugin/temporary/<scratch|playwright|intermediate>/`. Pick the subdir that matches the artifact's purpose (Playwright captures → `playwright/`, design-pipeline drafts → `intermediate/`, anything else → `scratch/`). Never write disposable artifacts to the project root, to a deliverable subdir, or anywhere else.
- The `init-project-structure.sh` script creates the umbrella + the `temporary/` subdirs and adds them to `.gitignore` automatically. The block is fenced with `# === BEGIN design-engineer-plugin ===` and `# === END design-engineer-plugin ===` so the script can re-run idempotently and replace legacy v5.4.x blocks.
- `.design-engineer-plugin/temporary/` is **auto-purged at every phase boundary** by `meta-document` Step 7 (which runs whenever `/product:document` fires). The user can also run `/product:tidy` mid-session for the same effect. Don't write things to `temporary/` expecting them to persist across phases.
- If you need a file outside both the canonical paths and `temporary/`, that's a bug — pick a tier and a path.

**Why this matters:** without the tier discipline, a single feature implementation can leave a working tree dominated by debug artifacts that obscure the actual deliverables. The user loses the ability to tell which files are committable vs. which are throwaway, and the temptation to "commit everything and move on" pollutes the repository permanently. The tiers + `.gitignore` block + auto-purge let the user run `git add -A` without thinking and only ship what should ship.

**Stack-agnostic boundary:** the plugin's `.gitignore` block only ignores paths the plugin itself guarantees to write — `.design-engineer-plugin/temporary/` and `.design-engineer-plugin/.active-workflow`. Framework-specific outputs (test runner reports, build caches, native build artifacts, language ecosystem caches) are the user's responsibility to add to their own `.gitignore` outside the plugin's fenced block — since they vary by stack. The plugin doesn't presume Playwright, npm, Next.js, Xcode, Gradle, or any specific tool.

## Playwright filesystem hygiene

Playwright captures (screenshots, snapshots, traces) MUST land in one of the canonical paths below. Without an explicit `filename` argument, Playwright MCP writes to the project root, which pollutes the working tree across long sessions. The plugin enforces this contract via the `de-playwright-path-hook.js` PreToolUse hook on `mcp__playwright__browser_take_screenshot` — non-conforming `filename` values are denied with a structured help message.

| Capture purpose | Canonical path | Lifetime |
|---|---|---|
| Throwaway / debug (visual verification, "let me check this URL", exploratory analysis, design comparisons) | `.design-engineer-plugin/temporary/playwright/<YYYY-MM-DD-HHMMSS>/<descriptive-name>.png` | Disposable. The `.scratch/` directory is git-ignored. Clean up at any time without losing work. |
| Persistent audit captures (`/product:review audit` per-page screenshots) | `.design-engineer-plugin/design/reviews/<YYYY-MM-DD>-audit/<page-slug>/screenshot.png` | Committed alongside the audit deliverable. |
| Moodboard reference captures (`ui-references-moodboard` Step 5b) | `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/<NN>-<section>.png` | Committed alongside the references deliverable. |
| Playwright test fixtures / visual regression baselines | `tests/<test-name>/<snapshot>.png` | Committed alongside the test scripts. |

Always `mkdir -p` the parent directory before the screenshot call. Forbidden: `filename: "screenshot.png"`, `filename: "page.png"`, any unprefixed filename, any absolute path, any path containing `..`. The hook denies all four.

The default `<YYYY-MM-DD-HHMMSS>` timestamp pattern for scratch captures keeps debug output organized by session — easy to scan, easy to delete a day's worth in one `rm -rf .design-engineer-plugin/temporary/playwright/2026-05-03-*`. The hook does not enforce the timestamp format inside `.design-engineer-plugin/temporary/playwright/` (that's user discretion); it only enforces that the prefix matches.

## Project state injection

A `UserPromptSubmit` command hook runs on every message and checks for `.design-engineer-plugin/config.yaml` in the project root. If the config file is absent, it injects `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` as context before the model processes anything. This ensures `/product:launch` routes correctly even when auto-memory contains rich project context from previous sessions.

## Process recall mechanism (active-workflow marker contract)

Long deterministic workflows are gated by a marker file at `.design-engineer-plugin/.active-workflow`. The marker stores a single line naming the workflow (for example `dev:feature-implementation`). A `UserPromptSubmit` hook (`hooks/de-process-recall-hook.sh`) checks the marker on every prompt and, when present, injects context that asks the model to render the workflow's full step list at the top of its next response.

**Workflows that write the marker** (long, deterministic, multi-step sequences where step-list recall is high signal):
- `/product:dev` feature-implementation flow
- `/product:dev` setup
- `/product:design` new-product full pipeline (per phase)
- `/product:design` existing-project abbreviated feature flow (Step 2.2 through Step 2.7)
- `/product:review` broad audits
- `dev-prototyping` Steps 5–6
- `ui-references-moodboard`

**Workflows that do NOT write the marker** (short, branching, or already-visible flows where the AskUserQuestion-driven UI is itself the process indicator):
- `/product:launch`
- `/product:prototype` Step 7
- `/product:document`
- `/product:help`
- Individual UX and psychology skills invoked outside a pipeline
- `/product:design feature-spec` (the F1 minimal-spec branch)

**Why the split**: process recall is high-signal only on long deterministic sequences. Everywhere else, the visible question-and-answer flow already tells the user where they are; injecting a step list there is noise.

**User-visible contract**: when the marker is present, Claude renders a humane preamble plus the workflow's numbered step list at the top of its next response, with `← current` on the active step. When the marker is absent, Claude responds normally and never mentions process.

**Debugging**: run `tail -f ~/.claude/cache/de-process-recall.log` to verify the hook fires when expected. Each fire appends a single line of the form `[ISO_TIMESTAMP] FIRED | workflow=<name> cwd=<path>`.

## Command execution philosophy

All commands – design, review, dev, prototype, document – must follow the same execution pattern. The mode (from `.design-engineer-plugin/config.yaml`) determines the level of user involvement, but both modes follow the same structure:

```
PLAN → EXECUTE → PRESENT → FEEDBACK
```

**Guided mode:**
1. **Plan**: Present what you're about to do (scope, areas to check, approach). Ask for approval or adjustments.
2. **Execute**: Work through the plan one step at a time. After each step, present the finding or result.
3. **Present**: Show each finding individually with context and recommendation.
4. **Feedback**: Ask the user what to do (fix it, skip, dive deeper). Wait for response before proceeding.
5. **Summary**: After all steps, show a summary table.

**Autopilot:**
1. **Plan**: Briefly show the plan (no approval needed, just transparency).
2. **Execute**: Run all steps autonomously.
3. **Present**: Show complete results as a structured summary.
4. **Feedback**: Ask what to fix or explore further.

**Neither mode should ever:**
- Skip the planning phase
- Dump raw output without structure
- Proceed without explaining what's happening
- Leave the user wondering "what just happened?"
- Re-ask a question the user already answered earlier in the conversation – synthesize from previous answers instead. Re-asking wastes time and breaks trust, especially in long sessions.

Read the mode from `.design-engineer-plugin/config.yaml` at the start of every command. If no config file exists, default to guided mode.

**Agent usage rule:**
- Agents are a core feature of the plugin. They run normally in both modes.
- In Guided mode: after an agent completes, the main model parses the agent's output and presents it step by step with AskUserQuestion interaction between each finding or deliverable section. Never show the agent's raw output directly to the user. Never dump all findings at once.
- In Autopilot: agents run and their complete output is presented as a structured summary.

**Plan copy rule (CRITICAL):**
- After ExitPlanMode approval, IMMEDIATELY copy the plan to `plans/[YYYY-MM-DD]-[name].md`. Without this step: TDD hooks cannot activate (they check `.design-engineer-plugin/.design-engineer-plugin/plans/` for active plans), fidelity hooks cannot check scope drift, and git branch matching cannot work. If the plan only exists in `~/.claude/.design-engineer-plugin/plans/`, none of the safety mechanisms activate. Do not write any code until the plan is in `.design-engineer-plugin/.design-engineer-plugin/plans/`.

**Implementation architecture rule:**
- Implementation must follow the project's existing component architecture. If the project uses atomic design, create separate component files in the appropriate directories (atoms/, molecules/, organisms/, pages/). Never create a monolithic file containing multiple components or views. Read existing components before writing new ones to match patterns, naming, and design token usage.

## Compact-message format (when the user asks for one)

You can NOT reliably detect your own context-window usage from inside a turn — Claude Code does not inject token counts or context-percentage signals into your context, so any auto-trigger based on "I think we're at 90%" is unreliable and was producing inconsistent / no behavior in practice. Do NOT proactively warn the user about context usage. The trigger is **the user explicitly asking** — typing `/product:stop` (which generates the message via `commands/product/stop.md` Step 4), or asking in chat for "a compact message", "summarize for /compact", "what should I paste into /compact", etc.

When the user asks, generate a single self-contained compact message that preserves everything the next session needs to pick up without re-reading old chat. Do NOT output a generic "you've worked on a lot, here's a vague summary" — that's the failure mode the user has reported. Fill in real session values; never output placeholders like `[project]` or `[list]`.

The compact message must preserve:
- Current project name, absolute path, and plugin version
- Which `/product:` command is running and in which mode (guided / autopilot)
- Current phase and skill position (e.g., "Phase 3 Planning, after `ux-mvp-requirements`, next is `ux-information-architecture`")
- Key decisions made this session — durable choices that affect downstream deliverables (B2B vs B2C focus, mobile-first vs desktop-first, the specific design feel chosen, etc.)
- Deliverables completed this session and any stale dependents from `compound-documenter`'s memory
- What to do next — the literal next action, not "continue the work"
- Any unresolved questions or blockers the user is waiting on

Format the response like this:

> Here's a compact message you can paste into `/compact`:
>
> `Keep full context of <project name> at <absolute path>. Current state: v<X.Y.Z>, running /product:<command> in <mode> mode. Phase <N> (<phase name>): completed <skill list>, next is <skill name>. Key decisions: <bullet list of cross-cutting choices>. Deliverables updated: <list>. Stale dependents: <list or "none">. Next step: <literal next action>. <Any blockers or open questions, or "none">.`

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
- Running context-analyzer or any agent that needs project structure

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
| Session ending (Stop hook reminder) | run /product:document so compound-documenter flushes its memory; optionally update plugin-local memory files if relevant changes occurred |
