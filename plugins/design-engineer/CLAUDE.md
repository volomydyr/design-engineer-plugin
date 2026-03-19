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
plugins/design-engineer/
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
│   └── de/                         # 6 commands (de: namespace)
└── skills/                         # 49 hidden skills
```

## Skill Compliance Checklist

When adding or modifying skills:

### YAML Frontmatter (Required)

- [ ] `name:` present and matches directory name
- [ ] `description:` present, describes what it does AND when to use it
- [ ] `disable-model-invocation: true` present on ALL skills
- [ ] `model:` present — `opus` (default) or `sonnet` (mechanical tasks only)

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

## Model Configuration

Every agent and skill MUST have an explicit `model:` field in its frontmatter.

### Assignment Principles

- **`model: opus`** — default for tasks requiring deep reasoning, creative output, nuanced analysis, or complex implementation
- **`model: sonnet`** — for mechanical tasks: file reading, template generation, setup wizards, documentation formatting
- **No `model: inherit`** — plugin should be explicit about quality expectations
- **No `model: haiku`** — not used in this plugin

### Skill Frontmatter

Skills include `model:` after `disable-model-invocation`:

```yaml
---
name: skill-name
description: "..."
disable-model-invocation: true
model: opus
---
```

### When Adding New Agents/Skills

- Default to `model: opus` unless the task is clearly mechanical
- Document the rationale if choosing `sonnet` for a new component

## Command Naming Convention

Commands use `de:` prefix (short for design-engineer) to avoid conflicts with Claude Code's built-in `/review` and `/plan`:

- `/de:start` - Smart entry point (new projects, returning projects, existing projects)
- `/de:design` - Full design workflow orchestrator
- `/de:prototype` - HTML prototype generation
- `/de:dev` - Development pipeline
- `/de:review` - Multi-layer design review (includes psychology audit)
- `/de:document` - Knowledge documentation and stakeholder communication

## Living Documents

Deliverables created by this plugin are living documents tracked via `.dependencies.yaml`. When an upstream deliverable changes, downstream documents may need review. The hook scripts in `hooks/` implement this tracking automatically.

## Plan Mode

Always use `EnterPlanMode` for any non-trivial implementation planning — never output plans as plain text messages.

### When to Use Plan Mode

Use Plan Mode for any task that involves multiple files, phased implementation, architectural decisions, or more than a single-line fix. Do NOT use Plan Mode for: single-line fixes, typo corrections, or pure research tasks.

### Structured Plan Format

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
**Files**:
- Create: [file paths]
- Modify: [file paths]
**Reuse**: [Existing components/patterns to leverage]
**Success criteria**: [Verification steps]

## Phase 2: [Phase Name]
...

## Risk Assessment
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

## Questions for User
- [Any decisions that need user input before proceeding]
```

### Project-Local Storage

After plan approval, copy the approved plan to `plans/[YYYY-MM-DD]-[descriptive-name].md` in the project root. Create the `plans/` directory if it does not exist.

### Archival

When implementation is complete, move the plan from `plans/` to `plans/archive/`. Create the `plans/archive/` directory if it does not exist.

### Workflow

1. `EnterPlanMode` — write a structured plan to the plan file
2. `ExitPlanMode` — present the plan for user approval
3. After approval, copy to `plans/[YYYY-MM-DD]-[descriptive-name].md`
4. Implement the plan
5. After completion, move the plan to `plans/archive/`

## Code Quality: /simplify

After every code-producing step, run `/simplify` to review changed code for reuse, quality, and efficiency. This is mandatory.

### When to Run

- After `backend-implementer` returns
- After `frontend-implementer` returns
- Final pass after all code changes (before `design-system-auditor`)
- After prototype generation in `dev-prototyping`

### How

Use the Skill tool to invoke `/simplify`. It runs in the main conversation, not inside sub-agents.

## TDD with Playwright CLI

All code-producing steps follow Test-Driven Development using Playwright CLI. A PreToolUse hook enforces this — source code writes are blocked when no test scripts exist in `tests/`.

### The Iron Law

**No production code without a failing test first.** Wrote code before the test? Delete it. Don't keep as "reference." Don't adapt it. Delete means delete. Implement fresh from tests.

### TDD Cycle

1. **Red**: `test-writer` agent creates failing test scripts in `tests/`
2. Run test scripts → verify they fail **correctly** (fails because feature is missing, not because of typos or script errors)
3. **Green**: Implement the feature (backend-implementer, frontend-implementer)
4. Run test scripts → verify they pass, all other tests still pass, output is clean
5. **Refactor**: `/simplify` cleans up the code

### Red Flags — Stop and Start Over

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
- After prototype generation in dev-prototyping
- The hook only activates during implementation (when `plans/` has active plan files)

### Testing Anti-Patterns

See `skills/dev-agent-pipeline/references/testing-anti-patterns.md` for the 5 common anti-patterns: testing mock behavior, test-only methods in production, mocking without understanding, incomplete mocks, and tests as afterthought.

## Requirement Fidelity

Two PostToolUse hooks enforce that plans and implementation match user requirements exactly:

- **Command hook** (`de-fidelity-hook.js`) — injects a fidelity reminder after source code writes during active implementation
- **Prompt hook** (Haiku) — reviews plan files for requirement drift after every write

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

## Context Monitoring

When running long design sessions (multi-skill, multi-phase), monitor conversation length. If you estimate context usage is approaching 90% (typically after 20+ tool calls in a single session or when the conversation has been running for an extended period with many skill invocations):

Proactively suggest compacting **with a ready-to-use compact message included in the same response**. Do not wait for the user to agree before generating the message — include it immediately so they can copy-paste it into `/compact` with no extra round-trip.

The compact message must preserve:
- Current project name, path, and version
- Which command is running and in which mode
- Current phase and skill position
- Key decisions made this session (from the decisions log or conversation)
- Deliverables completed and any stale dependents
- What to do next
- Any unresolved questions or blockers

Format the suggestion like this:

> This session has covered a lot of ground. Context is getting heavy — if you'd like to compact, here's a message you can use with `/compact`:
>
> `Keep full context of [project] at [path]. Current state: v[X], running /de:[command] in [mode] mode. Phase [N] ([name]): completed [skills], next is [skill]. Key decisions: [list]. Deliverables updated: [list]. Stale dependents: [list]. Next step: [action]. [Any blockers or open questions].`

Fill in the template with actual values from the current session — never output the template with placeholders.

Important:
- Do NOT warn earlier than ~90% — premature warnings are distracting
- This is a SUGGESTION, not a requirement — never tell the user they must compact
- If the user dismisses the suggestion, do not bring it up again in the same session

## Memory Management

This plugin integrates with Claude Code's auto-memory system (`~/.claude/projects/<project>/memory/`) to maintain project awareness across sessions. MEMORY.md auto-loads every session (first 200 lines). Topic files load on demand.

### Project Map (`memory/project-map.md`)

Maintain a living file tree of the project. Every entry follows this format:

```
path — description (≤10 words) | when to read
```

**Update rules:**
- After creating any file or folder → add an entry with path, description, and read trigger
- After deleting any file or folder → remove its entry
- After significant restructuring (moving files, renaming directories) → update affected entries
- Do NOT update entries for minor edits to existing files — only structural changes

**Read project-map.md BEFORE:**
- Any filesystem exploration or file search
- Creating implementation plans (Plan Mode)
- Running context-analyzer or any agent that needs project structure

This replaces ad-hoc exploration. If project-map.md exists, use it instead of globbing or grepping for structure.

### MEMORY.md (Pipeline State + Key Decisions)

Keep MEMORY.md under 150 lines. It stores:

- **Pipeline State**: current phase, last completed skill, next skill, mode
- **Key Decisions**: one-line entries for cross-cutting decisions that affect multiple downstream deliverables (e.g., "B2B focus", "mobile-first", "subscription model chosen over freemium")
- **Topic Files routing table**: links to topic files with explicit "read when..." triggers

**What to save to MEMORY.md:**
- Pipeline position changes (after completing a skill or phase)
- Business/design decisions that affect 2+ deliverables downstream
- Mode preference and project type

**What NOT to save anywhere in memory:**
- Individual deliverable content (already in docs/design/)
- Resume state details (already in .design-engineer.yaml)
- Dependency status (already in .dependencies.yaml)
- Anything already in this CLAUDE.md
- How the plugin works or what skills exist

### Debug Solutions (`memory/debug-solutions.md`)

Save hard-won debugging fixes that took 3+ attempts or required non-obvious solutions.

Each entry: the error, what was tried and failed, what actually fixed it.

**Read debug-solutions.md BEFORE** attempting fixes for build, deploy, or environment errors — the solution may already be documented.

### When to Read Memory

| Trigger | What to read |
|---------|-------------|
| Session start | MEMORY.md auto-loads. Read project-map.md before any exploration. |
| Before phase transitions | MEMORY.md — verify key decisions still hold |
| Before implementation/planning | project-map.md — know the project structure |
| When encountering errors | debug-solutions.md — check for known fixes |
| After chat compaction | Re-read MEMORY.md for recovered context |

### When to Write Memory

| Trigger | What to update |
|---------|---------------|
| File/folder created or deleted | project-map.md — add or remove entry |
| Cross-cutting design decision made | MEMORY.md "Key Decisions" — one-line entry with date |
| Skill or phase completed | MEMORY.md "Pipeline State" — update position |
| Hard bug solved (3+ attempts) | debug-solutions.md — error + failed attempts + fix |
| Session ending (Stop hook reminder) | All of the above if changes occurred this session |
