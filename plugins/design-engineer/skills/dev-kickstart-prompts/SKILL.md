---
name: dev-kickstart-prompts
description: Generates kick-start prompts for beginning development in any IDE. Use when transitioning from planning to coding, or when starting a new development project and needing structured initial prompts.
disable-model-invocation: true
---

# Kick-Start Prompt Generation

## Why This Matters

When you open a new project in an IDE, you are looking at a blank folder. If you are new to programming, it is hard to understand how to begin. Kick-start prompts are starting messages you send to your AI coding tool to set everything up.

The rule of thumb: do not overcomplicate them. Avoid deep technical details or code snippets. These prompts should be high-level references that point to your context documents -- the files from your planning activities placed into the project folder.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

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

---

## Step 2: Determine the AI Tool

```
question: "Which AI coding tool will you use?"
header: "Development Tool"
options:
  - label: "Claude Code (terminal)"
    description: "Anthropic's CLI tool -- supports agents, skills, MCPs"
  - label: "Cursor"
    description: "AI-powered IDE with built-in code generation"
  - label: "Claude Code inside Cursor's terminal"
    description: "Best of both worlds -- Cursor's IDE with Claude Code's capabilities"
  - label: "Other IDE"
    description: "Windsurf, Kiro, or another AI-assisted editor"
```

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

## Decision Hierarchy

1. **User's direct input** -- their tool preference, their project priorities
2. **Existing documentation** -- prompts reference real documents, not assumptions
3. **AI suggestions** -- propose prompt structure and sequence

---

## What Comes Next

After kick-start prompts are generated, the user begins development. Suggest `dev-context-management` to set up status tracking, or `dev-agent-pipeline` if they want automated agent workflows.

---

## Resource Files

- [kickstart-template.md](./references/kickstart-template.md) -- Template structure for IDE-agnostic kick-start prompts
- [dev-prep-assistant.md](./references/dev-prep-assistant.md) -- Complete Development Preparation Assistant methodology
