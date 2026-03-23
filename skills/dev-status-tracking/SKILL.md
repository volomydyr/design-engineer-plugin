---
name: dev-status-tracking
description: Teaches and implements context management for long-running development projects. Use when context loss becomes a problem or when setting up status tracking for AI-assisted workflows.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Context Management

## Why This Matters

When you work on something complex with AI, it forgets things. Every conversation has a token limit (~200,000 tokens), and when you hit it, earlier parts get compressed or lost. AI might forget components already built, decisions already made, and approaches that did not work.

The solution is simple: keep a status file for AI to read at the start of every development task. Sub-agents also help by running heavy work in separate chats with separate token limits, preserving the main conversation's budget.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Set Up the Status File

Create a development status file using the template from [status-tracking-template.md](./references/status-tracking-template.md). This file is separate from CLAUDE.md (separation of concerns) and should contain:

- **Completed features** – what is already built and working
- **In-progress work** – what is currently being developed
- **Planned features** – what comes next
- **Critical warnings** – approaches that failed, gotchas to remember
- **Design system status** – current token and component inventory
- **Available assets** – icons, images, and other resources
- **Architecture decisions** – key choices and their rationale

Place this file in a predictable location (e.g., `dev-status/development-context.md` or `status.md` at the project root).

---

## Step 2: Configure Automatic Updates

Add a rule to the project's CLAUDE.md requiring AI to:
1. Read the status file at the start of every development task
2. Update the status file after completing major features or phases
3. Record any new warnings or failed approaches

Note: AI can forget to track status even with rules in place. The user should nudge AI to update after every big development phase.

---

## Step 3: Implement the One-Activity-Per-Chat Pattern

For browser-based AI tools (pre-development):
- Each activity gets its own chat to prevent context degradation
- Save deliverables between sessions (to project knowledge, files, or equivalent)
- Start each new chat by checking the status tracker
- In browser-based tools, saving deliverables to the project's knowledge must be done manually – AI cannot do this on its own

For Claude Code (development):
- Use sub-agents for heavy work (context analysis, implementation, auditing)
- Each sub-agent runs in a separate chat with its own token budget
- Results come back to the main conversation without burning its tokens
- Prefer manual compaction with specific instructions over auto-compaction when approaching limits

---

## Step 4: Context Survival Strategies

Share the strategies from [context-survival-guide.md](./references/context-survival-guide.md):

### When to Update Context
- After every feature AI implements
- After any critical bug is fixed
- Before working on anything unfamiliar
- When the project structure changes
- When new patterns or components are established

### Handling Chat Compaction
- When approaching 200k tokens, AI automatically compresses earlier conversation
- This compression loses some details – prefer to avoid hitting the limit
- If compaction happens, ask AI to re-read the status file and CLAUDE.md
- For critical work, start a fresh conversation rather than continuing a compacted one

### Recovering Lost Context
- The status file is the primary recovery mechanism
- GitHub commit history serves as a secondary record
- IDE Timeline feature can recover individual file changes
- Regular commits prevent catastrophic context loss

---

## Decision Hierarchy

1. **User's direct input** – they decide what is important to track
2. **Project documentation** – the status file reflects real project state
3. **AI suggestions** – propose what to include in status updates

---

## What Comes Next

After context management is set up, suggest `dev-github-workflow` for version control (another context preservation mechanism), or `dev-agent-setup` to set up sub-agents that help preserve the main conversation's token budget.

---

## Resource Files

- [status-tracking-template.md](./references/status-tracking-template.md) – Development status file template
- [context-survival-guide.md](./references/context-survival-guide.md) – Strategies for maintaining context across sessions
- [multi-session-workflow.md](./references/multi-session-workflow.md) – Tool-agnostic rules for multi-session workflows
