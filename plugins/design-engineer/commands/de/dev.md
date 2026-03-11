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
| 3 | `dev-agent-pipeline` |
| 4 | `dev-context-management` |
| 5 | `dev-github-workflow` |
| 6 | `dev-mcp-setup` |
| 7 | `dev-kickstart-prompts` |

### Development Pipeline Execution (Option 8)

For running the full agent pipeline on a feature:

1. Load `dev-claude-md` to verify CLAUDE.md is current
2. Task `context-analyzer`(feature description) – analyzes project context
3. Task `plan-creator`(analysis results) – creates implementation plan
4. Task `backend-implementer`(plan) – implements backend
5. Task `frontend-implementer`(plan) – implements frontend
6. Task `design-system-auditor`(implementation) – audits against design system
7. Run `meta-compound` to document the development session

### Full Setup (Option 1)

Run in sequence:

1. Load `dev-claude-md` – CLAUDE.md generation
2. Load `dev-kickstart-prompts` – kick-start prompt generation
3. Load `dev-agent-pipeline` – agent pipeline configuration
4. Load `dev-mcp-setup` – MCP server configuration
5. Load `dev-github-workflow` – GitHub workflow setup
6. Load `dev-context-management` – context tracking setup

## Mode

- **Guided mode** for setup activities (requires user input for stack configuration)
- **Both modes** for pipeline execution

## Agents Used

- `context-analyzer` – project context analysis
- `plan-creator` – implementation planning
- `backend-implementer` – backend development
- `frontend-implementer` – frontend development
- `design-system-auditor` – design system compliance
- `compound-documenter` – session documentation
