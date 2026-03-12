---
name: dev-agent-pipeline
description: Sets up a specialized agent pipeline for AI-assisted development with context analysis, planning, implementation, and auditing phases. Use when configuring agent-driven development workflows for a new project.
disable-model-invocation: true
---

# Agent Pipeline Setup

## Why This Matters

Sub-agents run outside your main conversation in separate chats with separate token limits. This means the heavy work of analyzing context, implementing features, and auditing code happens without burning through your main conversation's 200,000 token budget.

In practice, four agents are usually enough. Starting with twelve and refining down is a common experience – maintaining too many agents is hard, and the main conversation forgets to run some of them or does it in the wrong order.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Assess the Project

```
question: "What best describes your project?"
header: "Project Type"
options:
  - label: "Full-stack application (frontend + backend)"
    description: "Needs both data layer and UI implementation agents"
  - label: "Frontend only"
    description: "UI work with no backend – can skip backend-implementer"
  - label: "Backend / API only"
    description: "Data and logic with no UI – can skip frontend-implementer"
  - label: "Not sure yet"
    description: "Help me decide which agents I need"
```

---

## Step 2: Explain the Pipeline

Walk through the proven 3-agent + Plan Mode pipeline pattern:

### Phase 1: Research and Analysis
1. **Context Analyzer** runs first – reads project status, audits existing code, checks available styles and components, fetches up-to-date documentation, and analyzes designs
2. Output: context summary + clarifying questions for the user
3. User answers questions

### Phase 2: Planning (Wait for Approval)
4. Enter **Plan Mode** (`EnterPlanMode`) — write a structured implementation plan to the plan file, then `ExitPlanMode` for user approval
5. Plan includes: summary, architectural decisions, files to create/modify, components to reuse vs. create, step-by-step approach, success criteria
6. **Stop and wait** – user must approve before any implementation begins

### Phase 3: Implementation (Only After Approval)
7. **Backend Implementer** verifies and implements the data layer (always runs, even if "no changes needed")
8. **Frontend Implementer** creates pixel-perfect UI matching designs with zero creative interpretation

### Phase 4: Quality Audit
9. **Design System Auditor** checks all implemented code for violations: hardcoded values, monolithic views, duplicated logic, inconsistent patterns
10. Output: violation report + fixes applied

---

## Step 3: Generate Agent Files

For each agent, generate a markdown file using the adapted templates from:
- [context-analyzer.md](./references/agent-templates/context-analyzer.md)
- [backend-implementer.md](./references/agent-templates/backend-implementer.md)
- [frontend-implementer.md](./references/agent-templates/frontend-implementer.md)
- [design-system-auditor.md](./references/agent-templates/design-system-auditor.md)

Planning is handled by Plan Mode (not an agent). See the structured plan template in the project's CLAUDE.md.

Customize each template based on the user's tech stack, project structure, and existing code. See [pipeline-guide.md](./references/pipeline-guide.md) for how agents work together in practice.

---

## Step 4: Configure the Pipeline in CLAUDE.md

Add the pipeline sequence and agent descriptions to the project's CLAUDE.md file so the main conversation knows when and how to invoke each agent:

```
MANDATORY PIPELINE (Follow Exactly):

PHASE 1: RESEARCH & ANALYSIS
1. context-analyzer -> Understand patterns, raise questions
2. Fetch up-to-date documentation for decisions
3. Ask user for designs + resolve questions
4. Process responses, make informed decisions

PHASE 2: PLANNING (WAIT FOR APPROVAL)
5. Enter Plan Mode -> Write structured plan -> ExitPlanMode for approval
6. Wait for user approval -> Do NOT proceed without it

PHASE 3: IMPLEMENTATION (Only After Approval)
7. backend-implementer -> Verify/refine data layer
8. frontend-implementer -> Implement UI after approval
9. design-system-auditor -> Verify compliance

PHASE 4: WRAP UP
10. Integration testing -> Test full user flow
```

---

## Step 5: Explain Iteration

The first version of agents will not be final. Expect to:
- Update agent files after discovering what works and what does not
- Remove agents that overlap or cause confusion
- Add explicit rules when AI repeatedly makes the same mistake
- Ask AI to update agent markdown files when the project evolves

A good practice is to ask AI to update documents and settings when the project has evolved significantly since the last prompt.

---

## Pipeline Violations to Avoid

- Skipping to frontend implementation without asking for designs
- Skipping plan creation
- Proceeding with implementation before user approves the plan
- Marking backend as "complete" without actually running it
- Making architectural decisions without checking documentation
- Guessing or assuming instead of asking for clarification

---

## Decision Hierarchy

1. **User's direct input** – their tech stack, their approval, their priorities
2. **Project documentation** – requirements and architecture drive agent behavior
3. **AI suggestions** – propose agent configurations based on proven patterns

---

## What Comes Next

After the pipeline is set up, the user sends development prompts and the pipeline runs automatically. Suggest `dev-context-management` for status tracking, or `dev-mcp-setup` to configure the MCPs that agents rely on.

---

## Resource Files

- [context-analyzer.md](./references/agent-templates/context-analyzer.md) – Adapted context analyzer agent template
- [backend-implementer.md](./references/agent-templates/backend-implementer.md) – Adapted backend implementer agent template
- [frontend-implementer.md](./references/agent-templates/frontend-implementer.md) – Adapted frontend implementer agent template
- [design-system-auditor.md](./references/agent-templates/design-system-auditor.md) – Adapted design system auditor agent template
- [pipeline-guide.md](./references/pipeline-guide.md) – How agents work together in practice with approval checkpoints
