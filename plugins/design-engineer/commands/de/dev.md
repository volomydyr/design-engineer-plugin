---
name: de:dev
description: Development pipeline. Setup, CLAUDE.md generation, agent pipeline, context management, and more.
argument-hint: "[setup | pipeline | claude-md | agents | context | github | mcp]"
---

# Development Pipeline

## Context

<context> #$ARGUMENTS </context>

Sets up and runs the development workflow. Covers CLAUDE.md generation, AI agent pipeline setup, context management, kick-start prompts, GitHub workflow, and MCP configuration. Use after the design pipeline or standalone.

## Activity Selection

If no activity was specified in arguments, use AskUserQuestion to ask:

**Question:** "What do you need?"

1. **Full development setup** – CLAUDE.md + agents + MCPs + kick-start prompts
2. **CLAUDE.md setup** – Generate or update your CLAUDE.md
3. **Agent pipeline setup** – Configure the 4-agent development pipeline
4. **Context management** – Set up long-running project context tracking
5. **GitHub workflow** – Git workflow setup for designers
6. **MCP configuration** – Configure recommended MCP servers
7. **Kick-start prompts** – Generate IDE kick-start prompts
8. **Run development pipeline** – Execute context-analyzer > plan > backend > frontend > auditor for a feature

If AskUserQuestion is not available, present options as a numbered list.

## Workflow

### Single Activity

Load the corresponding skill:

| Selection | Skill to Load |
|-----------|---------------|
| 1 | Run skills 2-7 in sequence |
| 2 | `dev-claude-md` |
| 3 | `dev-agent-setup` |
| 4 | `dev-status-tracking` |
| 5 | `dev-github-workflow` |
| 6 | `dev-mcp-setup` |
| 7 | `dev-starter-prompts` |

### Development Pipeline Execution (Option 8)

**Critical: build one feature at a time.** Do not attempt to build the entire MVP in a single cycle. The context-analyzer reads all deliverables (MVP requirements, IA, designs) and produces a feature-by-feature build sequence. Each feature goes through the full pipeline cycle below. After each cycle, `compound-documenter` saves progress so the next session can pick up where you left off.

**First run only:** Load `dev-claude-md` to verify CLAUDE.md is current.

**Each feature cycle:**

1. Task `context-analyzer`(feature description) – reads current project state, identifies what to build next
2. Enter Plan Mode → write structured plan for THIS feature only → `ExitPlanMode` → copy to `plans/`
3. Task `test-writer`(plan) – writes failing test scripts to `tests/`
4. Run test scripts – verify Red (all tests fail)
5. Task `backend-implementer`(plan) – implements backend
6. Run `/simplify` – review backend changes
7. Task `frontend-implementer`(plan) – implements frontend
8. Run `/simplify` – review frontend changes
9. Run test scripts – verify Green (all tests pass)
10. Run `/simplify` – final pass on all code changes
11. Task `design-system-auditor`(implementation) – audits against design system
12. Archive test scripts from `tests/` to `tests/archive/`
13. Run `meta-document` to document what was built, update project status, record what's next

After each cycle, show progress and ask: "Feature complete. What would you like to build next?"

### Full Setup (Option 1)

Run in sequence:

1. Load `dev-claude-md` – CLAUDE.md generation
2. Load `dev-starter-prompts` – kick-start prompt generation
3. Load `dev-agent-setup` – agent pipeline configuration
4. Load `dev-mcp-setup` – MCP server configuration
5. Load `dev-github-workflow` – GitHub workflow setup
6. Load `dev-status-tracking` – context tracking setup

## Mode

- **Guided mode** for setup activities (requires user input for stack configuration)
- **Both modes** for pipeline execution

## Agents Used

- `context-analyzer` – project context analysis
- Plan Mode (`EnterPlanMode` / `ExitPlanMode`) – implementation planning
- `test-writer` – TDD test script creation
- `backend-implementer` – backend development
- `frontend-implementer` – frontend development
- `design-system-auditor` – design system compliance
- `compound-documenter` – session documentation
