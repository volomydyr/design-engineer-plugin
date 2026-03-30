---
name: de:dev
description: Development pipeline. Setup, implementation, and AI-assisted building. Mode determined by your config.
argument-hint: "[setup | pipeline | claude-md | agents | context | github | mcp]"
---

# Development Pipeline

## Context

<context> #$ARGUMENTS </context>

Sets up and runs the development workflow. Use after the design pipeline or standalone.

## Step 1: Read project context

1. Read `.design-engineer.yaml` for mode (guided/god), project type, and environment
2. Scan the project: what tech stack, what build tools, does CLAUDE.md exist, are agents configured?
3. If `.design-engineer.yaml` not found, tell the user to run `/de:start` first

## Step 2: Plan

Based on what you found, present a plan. Only suggest what's relevant:

```
Based on your project ({tech stack}), here's what I recommend:

1. {Activity 1} – {why it's needed}
2. {Activity 2} – {why}

Want to adjust the plan?
```

Guidelines for building the plan:
- **CLAUDE.md setup** – needed if no CLAUDE.md exists or it's outdated
- **Agent pipeline** – needed if no agents are configured
- **MCP configuration** – only if MCPs are missing or misconfigured
- **GitHub workflow** – only if git is initialized and no workflow is set up
- **Context management** – needed for long-running projects
- **Kick-start prompts** – helpful for teams, optional for solo
- **Feature implementation** – if the user's goal was "Implement from Figma" or they have a specific feature to build

If an argument was provided (`/de:dev setup`, `/de:dev pipeline`), skip planning and go directly to that activity.

In **Guided mode**: ask the user to confirm or adjust the plan.
In **God mode**: show the plan briefly, then execute.

## Step 3: Execute based on mode

### Setup activities

| Activity | Skill |
|----------|-------|
| CLAUDE.md setup | `dev-claude-md` |
| Agent pipeline | `dev-agent-setup` |
| MCP configuration | `dev-mcp-setup` |
| GitHub workflow | `dev-github-workflow` |
| Context management | `dev-status-tracking` |
| Kick-start prompts | `dev-starter-prompts` |

In **Guided mode**: run one at a time, present results, ask for feedback.
In **God mode**: run all planned activities, present summary.

### Feature implementation (pipeline)

Build one feature at a time. Each feature goes through:

1. `context-analyzer` agent – reads project state, identifies what to build
2. Plan Mode – write structured plan for this feature
3. `test-writer` agent – create failing tests (Red phase)
4. `backend-implementer` agent – implement backend
5. Run `/simplify` – review code
6. `frontend-implementer` agent – implement frontend
7. Run `/simplify` – review code
8. Run tests – verify Green phase
9. `design-system-auditor` agent – audit compliance
10. `dev-github-workflow` – commit and push
11. `meta-document` – document progress

In **Guided mode**: pause after each step for review.
In **God mode**: run the full cycle, present results at the end.

## Post-execution

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Build another feature"
    description: "Start the next feature cycle"
  - label: "Review what we built"
    description: "Run /de:review on the implementation"
  - label: "Document progress"
    description: "Save what was done for the next session"
```
