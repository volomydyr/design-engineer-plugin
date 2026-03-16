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
│   └── de-tdd-hook.js
├── agents/                         # 9 specialized agents
├── commands/
│   └── de/                         # 9 commands (de: namespace)
└── skills/                         # 50 hidden skills
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

- `/de:setup` - One-time plugin configuration
- `/de:design` - Full design workflow orchestrator
- `/de:research` - UX research activities
- `/de:psych` - Psychology audit and deep-dives
- `/de:prototype` - HTML prototype generation
- `/de:dev` - Development pipeline
- `/de:review` - Multi-layer design review
- `/de:compound` - Knowledge documentation
- `/de:statusline` - Status line management

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

### TDD Cycle

1. **Red**: `test-writer` agent creates failing test scripts in `tests/`
2. Run test scripts → verify they fail (expected — feature not built yet)
3. **Green**: Implement the feature (backend-implementer, frontend-implementer)
4. Run test scripts → verify they pass
5. **Refactor**: `/simplify` cleans up the code

### Test Storage

- Active test scripts: `tests/*.sh` (executable shell scripts using Playwright CLI)
- Archived tests: `tests/archive/` (moved after feature completion, like `plans/archive/`)

### When TDD Applies

- After plan approval, before backend-implementer and frontend-implementer
- After prototype generation in dev-prototyping
- The hook only activates during implementation (when `plans/` has active plan files)

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
