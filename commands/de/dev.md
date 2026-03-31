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

1. Read `.design-engineer-plugin/config.yaml` for mode (guided/god), project type, and environment
2. Scan the project: what tech stack, what build tools, does CLAUDE.md exist, are agents configured?
3. If `.design-engineer-plugin/config.yaml` not found, tell the user to run `/de:start` first

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
In **Autopilot**: show the plan briefly, then execute.

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
In **Autopilot**: run all planned activities, present summary.

### Feature implementation (pipeline)

Build one feature at a time. Before writing ANY source code:

1. **Read existing patterns**: Scan the project's component architecture (atoms/, molecules/, organisms/, pages/). Understand the design system tokens, naming conventions, and file structure. Load relevant skill reference files for design knowledge.

2. **Plan via Plan Mode**: You MUST use `EnterPlanMode` to create a structured plan. Do NOT present the plan as chat text or a table. The plan must include all fields from the CLAUDE.md structured plan format: Objective, Depends on, Files (Create/Modify), Reuse (list every existing component – use as-is, extend, or explain why new), Checklist, and QA. After writing the plan, use `ExitPlanMode` for user approval. Copy approved plan to `plans/`.

3. **Follow the project's architecture**: If the project uses atomic design, create separate component files in the appropriate directories. Never create a monolithic file containing multiple components. Match existing naming patterns.

4. **TDD**: Before writing production code, use `test-writer` to create failing tests. Run tests to verify Red (fails because feature is missing). This is not optional – the TDD Iron Law applies.

5. **Implement phase by phase**: Follow the plan's phases in order. Each phase: implement → run `/simplify` → completeness review → present to user with QA → wait for approval. Never implement multiple phases in a single turn.

6. **After all phases**: Run `design-system-auditor` to audit compliance. Run `dev-github-workflow` to commit. Run `meta-document` to record progress.

After EVERY Write or Edit to source code, run `/simplify`. The plugin considers code unfinished until `/simplify` has reviewed it.

In **Guided mode**: the main model implements step by step. Do NOT delegate to backend-implementer or frontend-implementer agents – they can't pause for feedback. Pause after each phase for user review.
In **Autopilot**: delegate to agents for speed. Run the full cycle, present results at the end.

## Post-execution

```
question: "What would you like to do next?"
header: "Next step"
options:
  - label: "Next feature"
    description: "Pick up the next feature from the build sequence"
  - label: "Review implementation"
    description: "Review the implementation for quality, accessibility, or design compliance"
  - label: "Save progress and stop"
    description: "Document progress so you can pick up next time"
```
