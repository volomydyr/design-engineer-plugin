---
name: dev-claude-md
description: Generates and maintains a comprehensive CLAUDE.md file for any project. Use when setting up a new project, when the project has evolved significantly, or when switching tech stacks.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# CLAUDE.md Generation and Maintenance

## Why This Matters

CLAUDE.md is a markdown file that lives in the root of your development folder. When you use Claude Code, it automatically reads this file and follows the rules in any conversation. Think of it as instructions that shape how AI behaves throughout your entire coding project.

This file does not stay static. It evolves through many changes during development. It starts as a basic document with tech stack information and grows into a comprehensive set of rules covering everything from source-of-truth hierarchy to specific warnings about outdated approaches.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) gather your project context – what documents, tech stack, and code you have, 2) define the source hierarchy for AI decision-making, 3) generate a customized CLAUDE.md file, 4) explain how to maintain it over time." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what CLAUDE.md is and how it shapes AI behavior in their project. If yes, give a one-sentence refresher. If no, explain it in simple terms: it's a markdown file at the root of your project that Claude Code reads automatically – think of it as persistent instructions that shape how AI behaves throughout your entire codebase.

3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Gather Project Context

```
question: "What information do you already have for your project?"
header: "Available Context"
options:
  - label: "Planning documents (requirements, architecture, etc.)"
    description: "Existing documents from pre-development activities"
  - label: "Tech stack is decided"
    description: "I know what frameworks and tools I will use"
  - label: "Some code already exists"
    description: "Development has started, need to document current state"
  - label: "Starting from zero"
    description: "No documents or code yet – help me plan"
allowMultiSelect: true
```

```
multiSelect: true  # User can have multiple context sources
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Define the Source Hierarchy

The most critical section of any CLAUDE.md. Guide the user through establishing their decision hierarchy based on [source-hierarchy-guide.md](./references/source-hierarchy-guide.md):

1. **User's direct instructions** (highest authority – never override)
2. **Development status file** (current project status, guidelines, warnings)
3. **Design files** (pixel-perfect UI implementation required)
4. **Project knowledge documents** (complete feature specifications)
5. **Global rules** (implementation process guidelines)

---

## Step 3: Generate the CLAUDE.md

Using the template from [claude-md-template.md](./references/claude-md-template.md), generate a CLAUDE.md customized to the user's project. The file should cover:

### Critical Document References
List all project documents AI must read before implementing anything. Point to specific file paths.

### Reuse Existing Development
Before creating any new component, layout, or style:
1. Audit existing codebase
2. Identify reusable patterns
3. Extend existing systems
4. Maintain consistency

### Tech Stack Specifications
Exact technologies to use with no substitutions allowed. Include version constraints where relevant.

### Non-Negotiable Requirements
- Always cite specific sections from project documents when implementing features
- Never modify, interpret, or be creative with documented requirements
- Never guess, assume, or hallucinate – use only specified technologies
- Never invent new features not documented in project knowledge
- Always use the designated tool for clarification when uncertain

### Development Pipeline
If using an agent pipeline, define the sequence:
1. Context analysis (read status, audit code, fetch docs)
2. Planning (create plan, wait for approval)
3. Implementation (backend then frontend)
4. Quality audit (design system compliance)

### Conflict Resolution Protocol
When designs conflict with project document requirements, AI must:
1. State the conflict clearly (quoting both sources)
2. Cite the document source
3. Ask the user how to proceed
4. Wait for a decision before implementing

### Project Status
What is complete, what is in progress, what is planned. Reference the development status file.

---

## Step 4: Explain Maintenance

The CLAUDE.md should be updated:
- After every major development phase
- When new patterns or components are established
- When warnings about failed approaches need to be recorded
- When the tech stack evolves
- When the project structure changes significantly

Suggest the user ask AI to update the file after completing each significant feature or phase.

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – a missing rule, an unaddressed workflow, an assumption nobody mentioned – ask via AskUserQuestion. Never fill gaps silently. Never invent project rules, tech stack details, or workflow steps. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – their project, their rules
2. **Existing project documentation** – requirements and architecture drive the rules
3. **AI suggestions** – propose structure and content based on the template

---

## What Comes Next

After CLAUDE.md is created, suggest `dev-starter-prompts` to generate initial development prompts, or `dev-agent-setup` to set up the agent pipeline referenced in the rules.

---

## Resource Files

- [claude-md-template.md](./references/claude-md-template.md) – Comprehensive template for CLAUDE.md generation
- [source-hierarchy-guide.md](./references/source-hierarchy-guide.md) – How to define and enforce the decision hierarchy


---

## Source citation requirement

Whenever you push back on the user's answer (calling it incomplete, too vague, off-target, missing a framework, etc.) OR invoke a named framework or method, you MUST cite the source in the same response. Format:

> Source: `<relative path to reference file from this skill's directory>` — "<1-line quote of the passage that backs the judgment>"

The user is the designer; they are steering. Without the citation, they are working blindfolded. Cite every time, even when the source feels obvious to you – it is not obvious to them.

If the source is in a deliverable (not a skill reference file), cite the deliverable file path the same way. If the source is a generic principle from your training that has no specific file, name the principle explicitly and acknowledge there is no plugin-internal reference: "This is a general design principle, not from a specific reference in this plugin."
