---
name: dev-starter-prompts
description: Generates kick-start prompts for beginning development in any IDE. Use when transitioning from planning to coding or when starting a new project and needing structured initial prompts.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Kick-Start Prompt Generation

## Why This Matters

When you open a new project in an IDE, you are looking at a blank folder. If you are new to programming, it is hard to understand how to begin. Kick-start prompts are starting messages you send to your AI coding tool to set everything up.

The rule of thumb: do not overcomplicate them. Avoid deep technical details or code snippets. These prompts should be high-level references that point to your context documents – the files from your planning activities placed into the project folder.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) check which planning documents you have ready, 2) determine which AI coding tool you'll use, 3) generate 3–5 focused kick-start prompts customized to your project, 4) review and customize them with you." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with kick-start prompts and how they work. If yes, give a one-sentence refresher. If no, explain it in simple terms: these are the first messages you send to your AI coding tool to set up the project – high-level instructions that point to your context documents, not deep technical commands.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Gather Available Context

```
question: "Which planning documents do you have ready?"
header: "Available Documents"
options:
  - label: "MVP Requirements"
    description: "Prioritized feature list with acceptance criteria"
  - label: "Information Architecture"
    description: "Screen inventory, navigation, user flows"
  - label: "Design references or Figma designs"
    description: "Visual direction for the product"
  - label: "Business Plan / StoryBrand"
    description: "Messaging, positioning, or revenue model"
  - label: "Target Audience / Personas"
    description: "User profiles and pain points"
  - label: "CLAUDE.md already created"
    description: "Global rules file is ready"
  - label: "None yet"
    description: "Starting without planning documents"
allowMultiSelect: true
```

```
multiSelect: true  # User can have multiple document types ready
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Determine the AI Tool

```
question: "Which AI coding tool will you use?"
header: "Development Tool"
options:
  - label: "Claude Code (terminal)"
    description: "Anthropic's CLI tool – supports agents, skills, MCPs"
  - label: "Cursor"
    description: "AI-powered IDE with built-in code generation"
  - label: "Claude Code inside Cursor's terminal"
    description: "Best of both worlds – Cursor's IDE with Claude Code's capabilities"
  - label: "Other IDE"
    description: "Windsurf, Kiro, or another AI-assisted editor"
```

```
multiSelect: false  # User must choose one development tool
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 3.

---

## Step 3: Generate the Prompts

Using the template from [kickstart-template.md](./references/kickstart-template.md) and the methodology from [dev-prep-assistant.md](./references/dev-prep-assistant.md), generate a set of 3-5 focused prompts:

### Prompt 1: Project Initialization
- Create folder structure
- Install dependencies using official documentation (never hardcoded commands)
- Set up configuration files
- Reference: point to relevant planning documents

### Prompt 2: Foundation Setup
- Establish the design token system or styling foundation
- Set up navigation structure based on Information Architecture
- Create the app entry point
- Reference: point to Information Architecture document

### Prompt 3: First Feature Implementation
- Implement the most critical feature from MVP Requirements
- Reference the design files for visual direction
- Specify that AI should ask clarifying questions before implementing

### Prompt 4: Design System Extraction (after first feature)
- Refactor the first implementation to extract reusable tokens and components
- Create the design system structure from implemented code
- Establish naming conventions for future development

### Prompt 5: Second Feature (with patterns)
- Implement the next priority feature reusing patterns from the first
- Validate that the design system is being followed

---

## Step 4: Review and Customize

Present the generated prompts to the user for review. Each prompt should:
- Be one clear objective (not multiple goals)
- Reference existing documents by file path
- Specify behavioral expectations (ask questions first, wait for approval)
- Avoid code snippets or deep technical details
- Focus on outcomes, not implementation methods

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing document, an unaddressed workflow step – ask via AskUserQuestion. Never fill gaps silently. Never invent project details, file paths, or tech stack choices. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their tool preference, their project priorities
2. **Existing documentation** – prompts reference real documents, not assumptions
3. **AI suggestions** – propose prompt structure and sequence

---

## What Comes Next

After kick-start prompts are generated, the user begins development. Suggest `dev-status-tracking` to set up status tracking, or `dev-agent-setup` if they want automated agent workflows.

---

## Resource Files

- [kickstart-template.md](./references/kickstart-template.md) – Template structure for IDE-agnostic kick-start prompts
- [dev-prep-assistant.md](./references/dev-prep-assistant.md) – Complete Development Preparation Assistant methodology
