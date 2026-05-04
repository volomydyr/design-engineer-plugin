---
name: dev-agent-setup
description: Sets up a specialized agent pipeline for AI-assisted development with context analysis, planning, implementation, and auditing phases. Use when configuring agent-driven development workflows for a new project.
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Agent Pipeline Setup

## Why This Matters

Sub-agents run outside your main conversation in separate chats with separate token limits. This means the heavy work of analyzing context, implementing features, and auditing code happens without burning through your main conversation's 200,000 token budget.

In practice, four agents are usually enough. Starting with twelve and refining down is a common experience – maintaining too many agents is hard, and the main conversation forgets to run some of them or does it in the wrong order.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) assess your project type, 2) explain the proven agent pipeline pattern, 3) read memory for project context, 4) set up the agent files customized to your project, 5) configure the pipeline in your CLAUDE.md, 6) explain how iteration works." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with the agent pipeline concept – sub-agents running in separate chats with separate token limits. If yes, give a one-sentence refresher. If no, explain it in simple terms: agents are specialized AI workers that handle heavy tasks (analyzing code, implementing features, auditing quality) in their own conversations, so your main conversation stays light and responsive.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

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

```
multiSelect: false  # User must choose one project type
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Explain the Pipeline

Walk through the proven 3-agent + Plan Mode pipeline pattern:

### Phase 1: Research and Analysis
1. **Context Analyzer** runs first – reads project status, audits existing code, checks available styles and components, fetches up-to-date documentation, and analyzes designs
2. Output: context summary + clarifying questions for the user
3. User answers questions

### Phase 2: Planning (Wait for Approval)
4. Enter **Plan Mode** (`EnterPlanMode`) – write a structured implementation plan to the plan file, then `ExitPlanMode` for user approval
5. Plan includes: summary, architectural decisions, files to create/modify, components to reuse vs. create, step-by-step approach, success criteria
6. **Stop and wait** – user must approve before any implementation begins

### Phase 3: TDD + Implementation (Only After Approval)
7. **Test Writer** creates failing test scripts in `tests/` using Playwright CLI
8. Run test scripts → verify Red (all tests fail – feature not built yet)
9. **Backend Implementer** verifies and implements the data layer (always runs, even if "no changes needed")
10. Run `/simplify` – review backend changes for reuse, quality, and efficiency
11. **Frontend Implementer** creates pixel-perfect UI matching designs with zero creative interpretation
12. Run `/simplify` – review frontend changes for reuse, quality, and efficiency
13. Run test scripts → verify Green (all tests pass)

### Phase 4: Quality Audit
14. Run `/simplify` – final pass reviewing all code changes together
15. **Design System Auditor** checks all implemented code for violations: hardcoded values, monolithic views, duplicated logic, inconsistent patterns
16. Output: violation report + fixes applied

---

## Step 3: Read Memory Before Setup

Before setting up agents, read plugin-local memory if it exists. Verify each file with `Bash test -f` first; skip silently if absent (fresh project):
- **`.design-engineer-plugin/memory/project-map.md`** – understand the current project structure without exploring
- **`.design-engineer-plugin/memory/debug-solutions.md`** – check for known environment gotchas before configuring

## Step 4: Set Up Agent Files

If you write any setup notes, configuration summary, or agent-customization log to `.design-engineer-plugin/design/dev/`, ensure the parent directory exists first: run `mkdir -p .design-engineer-plugin/design/dev` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

Copy the agent files from this plugin's `agents/` directory into the user's project. The agents to copy:
- `context-analyzer.md`
- `test-writer.md`
- `backend-implementer.md`
- `frontend-implementer.md`
- `design-system-auditor.md`

Customize each agent for the user's tech stack, project structure, and existing code. Planning is handled by Plan Mode (not an agent). See the structured plan template in the project's CLAUDE.md.

See [pipeline-guide.md](./references/pipeline-guide.md) for how agents work together in practice.

---

## Step 5: Configure the Pipeline in CLAUDE.md

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

PHASE 3: TDD + IMPLEMENTATION (Only After Approval)
7. test-writer -> Write failing test scripts
8. Run tests -> Verify Red (all fail)
9. backend-implementer -> Verify/refine data layer (ALWAYS run)
10. /simplify -> Review backend changes
11. frontend-implementer -> Implement UI (after designs + approval)
12. /simplify -> Review frontend changes
13. Run tests -> Verify Green (all pass)

PHASE 4: QUALITY AUDIT
14. /simplify -> Final pass on all code changes
15. design-system-auditor -> Verify compliance

PHASE 5: WRAP UP
16. Archive tests -> Move tests/ to tests/archive/
17. Integration testing -> Test full user flow
```

---

## Step 6: Explain Iteration

### Feature-by-Feature Development

**Critical: build one feature at a time.** Do not attempt to build the entire MVP in a single pipeline run. The context-analyzer reads all deliverables (MVP requirements, IA, designs) and identifies what to build next. Each feature goes through the full pipeline cycle (context analysis → plan → tests → backend → frontend → audit → compound). After each cycle, `meta-document` saves progress so the next session can resume.

### Preserving Debug Solutions

When a debugging session during the development loop takes 3+ attempts or the fix is non-obvious:

1. Save to `.design-engineer-plugin/memory/debug-solutions.md`: the error, what was tried and failed, what actually fixed it
2. Before attempting fixes for similar errors in future cycles, verify `.design-engineer-plugin/memory/debug-solutions.md` exists and read it first
3. After each feature cycle, update `.design-engineer-plugin/memory/project-map.md` with any new files or folders created

This prevents re-discovering solutions across sessions. The development loop often spans multiple conversations, and hard-won fixes must survive session boundaries.

### Agent Iteration

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
- Skipping `/simplify` after implementation steps
- Skipping test-writer before implementation
- Implementing code without running tests first (Red phase)

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing tech stack detail, an unclear project structure – ask via AskUserQuestion. Never fill gaps silently. Never invent agent configurations, project paths, or workflow steps. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their tech stack, their approval, their priorities
2. **Project documentation** – requirements and architecture drive agent behavior
3. **AI suggestions** – propose agent configurations based on proven patterns

---

## What Comes Next

After the pipeline is set up, the user sends development prompts and the pipeline runs automatically. Suggest `dev-status-tracking` for status tracking, or `dev-mcp-setup` to configure the MCPs that agents rely on.

---

## Resource Files

- [pipeline-guide.md](./references/pipeline-guide.md) – How agents work together in practice with approval checkpoints
