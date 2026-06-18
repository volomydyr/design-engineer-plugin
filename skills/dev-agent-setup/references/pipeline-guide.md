# Agent Pipeline Guide

## How the Pipeline Works in Practice

The agent pipeline is a sequence of specialized AI agents that run for each implementation task. When you send a development prompt, the main conversation reads CLAUDE.md, sees the pipeline definition, and runs each agent in order.

The whole workflow looks like this:

1. The main conversation analyzes your prompt
2. It reads the project context itself (status file, existing code, design system, designs) and raises clarifying questions
3. You provide detailed answers
4. The main conversation creates a detailed implementation plan
5. It pauses for your manual approval
6. After approval, it runs the backend-implementer agent
7. Then runs the frontend-implementer agent
8. Finally runs the design-system-auditor agent
9. Results from all agents flow back to the main conversation

## Why Sub-Agents Matter

Sub-agents run outside your main conversation in separate chats with separate token limits. Your main conversation has a 200,000 token limit. Complex development workflows that require reading many files, creating plans, and writing code burn through that limit fast.

Dispatch a sub-agent when the work would genuinely flood the main context or fan out across many parallel reads; for quick, iterative work, doing it inline is fine. Each sub-agent uses its own set of tokens and returns a summary, so the main conversation only pays for the summary, not the full work.

## Context analysis – first step

Before any implementation, the main conversation grounds itself directly (no separate agent):

- Reads the development status file to understand what is already built
- Reviews existing code, components, and design system files
- Checks available styles, icons, and assets
- Fetches up-to-date documentation for whatever technologies you are using
- Analyzes the designs you are about to implement (via the Figma plugin or design file references)

**Output:** A summary of the current project state plus questions for you to answer before coding begins. This prevents assumptions and catches potential conflicts early.

## The Three Agents

### 1. Backend Implementer – Data Layer First

This agent verifies and implements the data layer. It always runs, even if the answer is "no backend changes needed," because:

- It confirms the data model supports the feature being built
- It catches missing fields, relationships, or API endpoints early
- Backend problems discovered during frontend implementation are expensive to fix

**Output:** Updated or verified data schemas, API endpoints, and any required backend functions.

### 2. Frontend Implementer – Pixel-Perfect UI

This agent creates the UI with one core rule: pixel-perfect implementation with zero creative interpretation. It must match the designs exactly.

This agent should list every component that already exists in the project, which prevents recreation of things already built. This is a common problem – AI frequently creates new components instead of reusing existing ones. Update the agent's component inventory whenever new components are created.

**Output:** Implemented screens and components that match designs, using the existing design system.

### 3. Design System Auditor – Quality Check

This agent runs at the end of any implementation to check for violations. The most common issues are:

- **Hardcoded values**: AI writes specific color values, font sizes, or spacing numbers instead of using design tokens
- **Recreated components**: AI creates new components from scratch instead of reusing existing ones
- **Oversized components**: Single components that do too much and should be split
- **Inconsistent patterns**: New code that does not follow established naming or architectural conventions

**Output:** A violation report listing what was found and what was fixed.

## The Approval Checkpoint

The approval step between planning and implementation is critical. After the main conversation grounds itself in the project context and you answer its questions, it creates a detailed implementation plan and saves it as a file.

**Why this matters:** Without this checkpoint, AI will:
- Build features you have not asked for
- Interpret your requirements creatively instead of following them strictly
- Make architectural decisions without your input
- Skip steps it considers unnecessary

The plan must include:
- Summary of what will be implemented
- Architectural decisions (justified by documentation and codebase patterns)
- Files to create or modify
- Components to reuse vs. create
- Design system tokens to use
- Step-by-step approach
- Success criteria

**You must approve the plan before any implementation begins.** Do not let AI proceed without explicit approval.

## Running Agents Manually

Even though the pipeline runs automatically for big implementation tasks, you can also call agents manually. Not all development is about large features – sometimes you do minor UI improvements or small fixes. In these cases:

- You can run just the design-system-auditor on recently changed code
- You can read the project context yourself to understand the current state before making a decision
- You can skip the full pipeline for trivial changes (fixing a typo, adjusting a margin)

## Iterating on Agent Configurations

Your first version of agents will not be final. Expect the same iterative process:

- **Start with the four templates** and customize them for your project
- **After a few development cycles**, you will notice what works and what does not
- **Update agent files** when you discover repeated mistakes or missing instructions
- **Add explicit rules** when AI keeps making the same error
- **Remove redundant sections** that do not contribute to better output

A good practice is to ask AI to update documents and settings when the project has evolved significantly since the last prompt. This includes agent files, CLAUDE.md, and the development status file.

## Pipeline Violations to Avoid

These are the most common mistakes that break the pipeline:

1. **Skipping to frontend implementation without asking for designs** – the frontend agent needs design references
2. **Skipping the plan creation step** – without a plan, AI builds whatever it thinks is right
3. **Proceeding with implementation before user approves** – approval is mandatory, not optional
4. **Marking backend as "complete" without running it** – even "no changes needed" requires verification
5. **Making architectural decisions without checking documentation** – always use Context7 or equivalent for framework decisions
6. **Guessing or assuming** – when in doubt, ask the user for clarification

## Setting Up the Pipeline

### Step 1: Create Agent Files

Save each customized agent template to `.claude/agents/` in your project root:
- `.claude/agents/backend-implementer.md`
- `.claude/agents/frontend-implementer.md`
- `.claude/agents/design-system-auditor.md`

### Step 2: Add Pipeline to CLAUDE.md

Include the pipeline sequence in your CLAUDE.md file so the main conversation knows when and how to invoke each agent. Specify the exact order and the mandatory approval checkpoint.

### Step 3: Test with a Small Feature

Run the pipeline on a simple feature first to verify everything works. Adjust agent files based on the results before tackling complex implementations.

### Step 4: Maintain Agent Files

After each significant development phase, review and update agent files:
- Add new components to the frontend-implementer's inventory
- Add new services to the backend-implementer's context
- Update the design system auditor's reference architecture
- Add warnings about approaches that did not work
