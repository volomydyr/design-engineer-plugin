---
name: dev-claude-projects
description: Sets up and optimizes a Claude Projects workspace for pre-development activities. Use when starting a new product and needing a structured multi-chat workflow for ideation, research, and planning before coding.
disable-model-invocation: true
---

# Claude Projects Workspace Setup

## Why This Matters

Before writing any code, you need a rich context for AI. Claude Projects is a workspace where you store files and rules that AI accesses in every future chat. The multi-chat workflow – one activity per chat, deliverables saved between chats – prevents context degradation and reduces hallucinations.

You can and should use Claude to set up Claude. Start with a blank project and use the first chat to create foundational documents together.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Understand the User's Situation

```
question: "What stage is your project at?"
header: "Project Stage"
options:
  - label: "Just an idea (a few sentences)"
    description: "I have a concept but nothing documented yet"
  - label: "Some research done"
    description: "I have notes, findings, or partial documents"
  - label: "Planning documents exist"
    description: "I have problem statements, audience docs, or requirements"
  - label: "Ready to code"
    description: "Planning is complete, I need to set up for development"
```

---

## Step 2: Create Foundational Documents

Guide the user through creating these documents in their first Claude Project chat:

### Project Instructions (Global Rules)
Rules that guide every future chat:
- Project idea – simple description of what the product is
- Decision hierarchy – User's experience (highest weight) > Project documentation > AI suggestions (lowest weight, most likely to contain mistakes)
- Multi-chat workflow – each activity gets its own chat, AI always checks the status tracker first
- Document standards – all documents in markdown, written simply, with executive summaries
- Process for each step – AI shares brief thoughts first, asks 7-10 strategic questions, works through problems together, creates documentation only after understanding well enough
- Stay in scope – never jump ahead, always focused on one step only

### Status Tracker
Phase and step breakdown appropriate for the project type. Updated manually after each chat by copying the deliverable to project knowledge.

### Assumptions Document
Track what the user believes to be true. Updated throughout the project as assumptions are confirmed or invalidated.

---

## Step 3: Provide the Setup Prompt

Share the complete setup prompt from [claude-project-setup-prompt.md](./references/claude-project-setup-prompt.md) for the user to copy into their first Claude Project chat. This prompt generates all foundational documents in one session.

---

## Step 4: Explain the Multi-Chat Workflow

Walk through the rules from [multi-chat-workflow-rules.md](./references/multi-chat-workflow-rules.md):

- **Why one step per chat**: prevents context degradation, reduces hallucinations, maintains focus
- **Between chats**: upload deliverables to project knowledge so the next chat has full context
- **Starting new chats**: AI provides a brief prompt for each next chat (check tracker, follow rules, review knowledge, start with assumptions + questions)
- **Step completion**: only when a final deliverable exists and the user explicitly says the step is complete
- **Step scope discipline**: never ask about moving to the next step – stay in the current step until the deliverable is ready
- **Revisiting**: can revisit and update previous step deliverables based on new knowledge, but never work on future steps

---

## Step 5: Verify AI Claims

Teach the critical verification habit:
- When AI makes a claim based on research or documents, ask it to provide specific quotes
- Open those sources and search for the exact text
- If the exact text cannot be found, Claude probably invented it
- This applies throughout the entire project, not just setup

---

## Decision Hierarchy

1. **User's direct input** – highest weight, least likely to be wrong
2. **Project documentation** – what has already been decided and written down
3. **AI suggestions** – lowest weight, most likely to contain mistakes

---

## What Comes Next

After the Claude Project is set up, the user follows their status tracker through pre-development activities. When ready for coding, suggest `dev-claude-md` to set up global rules for the IDE, or `dev-kickstart-prompts` to generate initial development prompts.

---

## Resource Files

- [claude-project-setup-prompt.md](./references/claude-project-setup-prompt.md) – Complete setup prompt template for initializing a Claude Project
- [multi-chat-workflow-rules.md](./references/multi-chat-workflow-rules.md) – Rules for the one-activity-per-chat workflow
