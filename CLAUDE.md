# Design Engineer Plugin Development

## Versioning Requirements

Every change to this plugin MUST include updates to all three files:

1. **`.claude-plugin/plugin.json`** - Bump version using semver
2. **`CHANGELOG.md`** - Document changes using Keep a Changelog format
3. **`README.md`** - Verify/update component counts

### Version Bumping Rules

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, major reorganization
- **MINOR** (1.0.0 → 1.1.0): New skills, agents, or commands
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, doc updates, minor improvements

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
├── agents/                         # 9 specialized agents
├── commands/
│   └── de/                         # 8 commands (de: namespace)
└── skills/                         # 54 hidden skills
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

## Model Configuration

Every agent and skill MUST have an explicit `model:` field in its frontmatter.

### Assignment Principles

- **`model: opus`** – default for tasks requiring deep reasoning, creative output, nuanced analysis, or complex implementation
- **`model: sonnet`** – for mechanical tasks: file reading, template generation, setup wizards, documentation formatting
- **No `model: inherit`** – plugin should be explicit about quality expectations
- **No `model: haiku`** – not used in this plugin

### Skill frontmatter

Skills include `model:` and `effort:` after `disable-model-invocation`:

```yaml
---
name: skill-name
description: "..."
disable-model-invocation: true
model: opus
effort: high
---
```

### Effort configuration

Every agent and skill MUST have an explicit `effort:` field in its frontmatter, placed after `model:`.

#### Assignment principles

- **`effort: max`** – the most complex tasks: broad multi-principle scans, comprehensive reviews, ethical reasoning, pipeline orchestration. Opus 4.6 only.
- **`effort: high`** – default for most skills. Tasks requiring synthesis, nuanced judgment, multi-perspective analysis, or creative output.
- **`effort: medium`** – structured workflows where the model follows established steps: setup wizards, template generation, documentation formatting.
- **`effort: low`** – not used in this plugin.

Effort and model are independent axes:
- `model: opus` + `effort: max` – broadest scans and reviews (psych-full-scan, ux-full-review, ux-bias-audit, ux-ethics-review, meta-orchestrator)
- `model: opus` + `effort: high` – deep analysis, creative output, complex implementation
- `model: sonnet` + `effort: high` – sonnet tasks needing thorough reasoning (documentation, testing)
- `model: sonnet` + `effort: medium` – structured sonnet tasks (setup, templates, status tracking)

### When adding new agents/skills

- Default to `model: opus` unless the task is clearly mechanical
- Default to `effort: high` – downgrade to `medium` only for clearly mechanical tasks, upgrade to `max` for broad multi-principle scans
- Document the rationale if choosing `sonnet` or `medium` for a new component

## Command Naming Convention

Commands use `de:` prefix (short for design-engineer) to avoid conflicts with Claude Code's built-in `/review` and `/plan`:

- `/de:start` - Smart entry point (new projects, returning projects, existing projects)
- `/de:design` - Full design workflow orchestrator
- `/de:prototype` - HTML prototype generation
- `/de:dev` - Development pipeline
- `/de:review` - Multi-layer design review (includes psychology audit)
- `/de:document` - Knowledge documentation and stakeholder communication
- `/de:stop` - Save progress and pause mid-activity
- `/de:help` - Shows all available commands, project status, and mode

## Living Documents

Deliverables created by this plugin are documented in two layers:

- **Static dependency graph** at `.design-engineer-plugin/dependencies.yaml` — read-only documentation showing which deliverables inform which downstream ones. The plugin does not mutate this file; users read it to know what's connected.
- **Live progress** at `.claude/agent-memory/compound-documenter/` — three structured files (pipeline-state.md, key-decisions.md, stale-dependents.md) maintained by the compound-documenter agent via Anthropic's documented `memory: project` mechanism. The agent computes stale-dependents by cross-referencing the static graph against recent edits.

Run `/de:document` after each phase or significant decision so the compound-documenter agent flushes state into its memory. Downstream-review prompts also fire automatically via `hooks/check_deliverable_deps.py` when a deliverable file is edited.

**Path note**: deliverable files always live at `documents/design/...` — this is fixed in the current implementation. The `deliverables_path` field in `.design-engineer-plugin/config.yaml` is a reserved marker for future use; nothing in the code currently reads it.

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

After plan approval, copy the approved plan to `plans/[YYYY-MM-DD]-[descriptive-name].md` in the project root. Create the `plans/` directory if it does not exist.

### Archival

When implementation is complete, move the plan from `plans/` to `plans/archive/`. Create the `plans/archive/` directory if it does not exist.

### Workflow

1. `EnterPlanMode` – write a structured plan to the plan file
2. `ExitPlanMode` – present the plan for user approval
3. After approval, copy to `plans/[YYYY-MM-DD]-[descriptive-name].md`
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
   j. After user approves, commit this phase's changes and push using `dev-github-workflow` (Conventional Commits format with phase context and plugin attribution)
7. After all phases complete, move the plan to `plans/archive/`
8. If on a feature branch, create a PR via `gh pr create` and ask the user whether to merge

### Implementation rules

- **Never implement multiple phases in a single turn.** One phase, one review, one approval.
- **Every phase must have QA instructions.** If the phase is simple, the QA can be brief ("check the button color changed"). If complex, be specific ("open the settings page, verify the new panel appears, try toggling it on/off, check that the state persists on page reload").
- **Dependencies determine order.** Always implement sequentially for user review, even if phases are independent.
- **Feedback is iterative.** The user may have multiple rounds of feedback on a single phase. Address all feedback before moving on.

## Code Quality: /simplify

After every code-producing step, run `/simplify` to review changed code for reuse, quality, and efficiency. This is mandatory.

### When to Run

- After `backend-implementer` returns
- After `frontend-implementer` returns
- Final pass after all code changes (before `design-system-auditor`)

Note: Do NOT run /simplify during prototyping. Prototypes are throwaway visual artifacts — code quality doesn't matter. /simplify only applies during `/de:dev` implementation.

### How

Use the Skill tool to invoke `/simplify`. It runs in the main conversation, not inside sub-agents.

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
- Archived tests: `tests/archive/` (moved after feature completion, like `plans/archive/`)

### When TDD Applies

- After plan approval, before backend-implementer and frontend-implementer
- The hook only activates during implementation (when `plans/` has active plan files)
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

1. **En dashes only** – use `–` (en dash). Never `—` (em dash), `--` (double hyphen), or ` - ` (hyphen as dash). Hyphens in compound words are fine (test-first, psychology-backed).
2. **Sentence case only** – capitalize the first word and proper nouns. Never Title Case. This applies to headings, button labels, tab names, navigation items, placeholder text, menu items, toast messages, and any other text Claude generates.
3. **No internal jargon in user-facing output** – never mention config file names (`.design-engineer-plugin/config.yaml`, `.dependencies.yaml`), internal skill names (`ux-problem-statement`, `meta-orchestrator`), hook names, script names, or detection logic in messages shown to the user. Describe what things DO, not what they're called internally. "Your progress was saved" not "Resume state written to `.design-engineer-plugin/config.yaml`". "You have Figma connected" not "Figma plugin: [FOUND]". This rule applies to all commands, skills, and agents.

Wrong: "User Settings — Account Details"
Right: "User settings – account details"

Wrong: "Save Changes", "View All Projects", "Get Started Now"
Right: "Save changes", "View all projects", "Get started now"

Wrong: "Loading — Please Wait"
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

## Image handling

Before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links in any prototype, landing page, or generated HTML, invoke the `ui-images` skill. It decides per image whether to generate (hero / marketing / brand-specific) or stock-fetch (avatars / list rows / decorative many-of-a-kind), produces strong search queries or detailed AI-generation prompts, and lays out destination folders at `documents/design/design/images/`. This rule applies to every `<img>` tag the model emits — no exceptions, no "the user will replace it later" shortcuts.

## Project state injection

A `UserPromptSubmit` command hook runs on every message and checks for `.design-engineer-plugin/config.yaml` in the project root. If the config file is absent, it injects `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` as context before the model processes anything. This ensures `/de:start` routes correctly even when auto-memory contains rich project context from previous sessions.

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
- After ExitPlanMode approval, IMMEDIATELY copy the plan to `plans/[YYYY-MM-DD]-[name].md`. Without this step: TDD hooks cannot activate (they check `plans/` for active plans), fidelity hooks cannot check scope drift, and git branch matching cannot work. If the plan only exists in `~/.claude/plans/`, none of the safety mechanisms activate. Do not write any code until the plan is in `plans/`.

**Implementation architecture rule:**
- Implementation must follow the project's existing component architecture. If the project uses atomic design, create separate component files in the appropriate directories (atoms/, molecules/, organisms/, pages/). Never create a monolithic file containing multiple components or views. Read existing components before writing new ones to match patterns, naming, and design token usage.

## Context Monitoring

When running long design sessions (multi-skill, multi-phase), monitor conversation length. If you estimate context usage is approaching 90% (typically after 20+ tool calls in a single session or when the conversation has been running for an extended period with many skill invocations):

Proactively suggest compacting **with a ready-to-use compact message included in the same response**. Do not wait for the user to agree before generating the message – include it immediately so they can copy-paste it into `/compact` with no extra round-trip.

The compact message must preserve:
- Current project name, path, and version
- Which command is running and in which mode
- Current phase and skill position
- Key decisions made this session (from the decisions log or conversation)
- Deliverables completed and any stale dependents
- What to do next
- Any unresolved questions or blockers

Format the suggestion like this:

> This session has covered a lot of ground. Context is getting heavy – if you'd like to compact, here's a message you can use with `/compact`:
>
> `Keep full context of [project] at [path]. Current state: v[X], running /de:[command] in [mode] mode. Phase [N] ([name]): completed [skills], next is [skill]. Key decisions: [list]. Deliverables updated: [list]. Stale dependents: [list]. Next step: [action]. [Any blockers or open questions].`

Fill in the template with actual values from the current session – never output the template with placeholders.

Important:
- Do NOT warn earlier than ~90% – premature warnings are distracting
- This is a SUGGESTION, not a requirement – never tell the user they must compact
- If the user dismisses the suggestion, do not bring it up again in the same session

## Memory Management

The plugin uses two memory layers:

- **Claude Code auto-memory** (`~/.claude/projects/<slug>/memory/MEMORY.md`) — owned and managed by Claude Code itself. The first 200 lines auto-load every session. **Do NOT call Read on this file** — Claude Code already loads it for you, and on fresh projects the file may not exist yet, surfacing a confusing red "File does not exist" error.
- **Plugin-local memory** (`.design-engineer-plugin/memory/`) — owned by the plugin. Contains `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log). Seeded by `init-project-structure.sh` during meta-setup; loaded on demand.

**Defensive read pattern** (belt and suspenders): before calling Read on any plugin memory file, check existence first. Use `Bash test -f .design-engineer-plugin/memory/project-map.md` or `Glob` to verify the file is there. If absent, skip silently — fresh project, nothing to read. Never call Read on `~/.claude/projects/.../memory/MEMORY.md`.

**Note on enforcement**: writes to plugin-local memory files are advisory — Claude updates them when it notices a relevant trigger, but nothing structurally forces the write. Treat the rules below as guidance, not contracts. If you skip a memory update, the next session may lose that context. The compound-documenter agent's project-local memory at `.claude/agent-memory/compound-documenter/` is the structurally enforced layer for pipeline state — see the agent's frontmatter (`memory: project`) for that documented Anthropic mechanism.

### Project Map (`.design-engineer-plugin/memory/project-map.md`)

Maintain a living file tree of the project. Every entry follows this format:

```
path – description (≤10 words) | when to read
```

**Update guidance** (advisory — Claude does this when it notices the trigger; not structurally enforced):
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

Claude Code's auto-memory `MEMORY.md` is loaded automatically every session. The plugin does not Read or Write this file directly — Claude Code's `/memory` command and its built-in auto-memory mechanism handle it. If you want to record cross-session context, ask the user to use `/memory` or just rely on Claude Code's auto-memory writes.

**What NOT to save anywhere in plugin memory or auto-memory:**
- Individual deliverable content (already in documents/design/)
- Resume state details (already in .design-engineer-plugin/config.yaml + the compound-documenter agent memory)
- Dependency status (already in .design-engineer-plugin/dependencies.yaml as static graph)
- Anything already in this CLAUDE.md
- How the plugin works or what skills exist

### Debug Solutions (`.design-engineer-plugin/memory/debug-solutions.md`)

Save hard-won debugging fixes that took 3+ attempts or required non-obvious solutions.

Each entry: the error, what was tried and failed, what actually fixed it.

**Read debug-solutions.md BEFORE** attempting fixes for build, deploy, or environment errors – the solution may already be documented.

### When to Read Memory

All Read operations on plugin-local memory files MUST verify existence first (Bash `test -f` or `Glob`); skip silently if absent. Never call Read on auto-memory `~/.claude/projects/<slug>/memory/MEMORY.md` — Claude Code already auto-loads it.

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
| Session ending (Stop hook reminder) | run /de:document so compound-documenter flushes its memory; optionally update plugin-local memory files if relevant changes occurred |
