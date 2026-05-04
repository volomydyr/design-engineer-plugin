---
name: dev-mcp-setup
description: Guides setup of essential MCP integrations for AI-assisted development. Use when configuring a new development environment or choosing which MCP servers to install.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
compatibility: "Requires Node.js v18+ for MCP server installation"
---

# MCP Setup Guide

## Why This Matters

MCPs are integrations between an AI and another application. They extend what AI can do beyond basic code generation – reading Figma designs, fetching up-to-date documentation, running browser tests, and more. However, installing every MCP you find is counterproductive. Start with the essentials and add others only when you have a specific need.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 0: Before starting

1. **Announce your execution plan**: Before doing anything, state what you will do in this activity: "Here's what I'm going to do: 1) check which MCPs you already have installed, 2) recommend MCPs based on your workflow needs, 3) provide setup guidance for each one, 4) configure CLAUDE.md references so AI uses them consistently." This is a commitment device – harder to skip steps you just announced.

2. **Conditional teaching**: Ask the user if they are familiar with what MCPs are and how they extend AI capabilities. If yes, give a one-sentence refresher. If no, explain it in simple terms: MCPs are integrations between AI and other applications – they let AI read Figma designs, fetch current documentation, run browser tests, and more, instead of being limited to just generating code.
   > **Required: ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Never skip this step because the user "is a designer" or "already demonstrated familiarity earlier." Users want a memory refresh on every activity, including ones they know. Phrases like "I'll skip the explainer (you're a designer)" are forbidden — they signal the model has decided ON BEHALF OF the user that a refresher isn't needed. The user, not the model, decides what's redundant. The refresher takes one sentence; the cost is trivial; the value to a tired user mid-session is high.


3. **Output presentation rule**: Present output incrementally – one section at a time. After each section, discuss with the user, get their input, then move to the next. Never dump an entire deliverable at once.

4. **Challenge ideas**: After the user shares an idea or decision, challenge it – surface blind spots, edge cases, future implications. Then let the user decide with full perspective. This is not about being negative – it's about pressure-testing ideas so the user makes better decisions.

**BLOCKING REQUIREMENT**: Wait for the user to acknowledge the plan before proceeding to Step 1.

---

## Step 1: Assess Current Setup

```
question: "Which MCPs do you already have installed?"
header: "Current MCP Setup"
options:
  - label: "None yet"
    description: "Starting fresh – need guidance on what to install"
  - label: "Context7 plugin"
    description: "Already have up-to-date documentation access"
  - label: "Figma plugin"
    description: "Already have Figma design data access (bidirectional – design→code and code→design)"
  - label: "Figma Console MCP"
    description: "Already have the Figma Console MCP for programmatic Figma actions"
  - label: "Playwright plugin"
    description: "Already have browser automation for testing"
  - label: "Other MCPs"
    description: "I have other integrations installed"
allowMultiSelect: true
```

```
multiSelect: true  # User can have multiple MCPs already installed
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding to Step 2.

---

## Step 2: Recommend Based on Needs

Recommend MCPs based on the user's workflow:

### Essential (install these first)

**Context7 plugin** – Helps AI fetch up-to-date documentation for libraries, frameworks, SDKs, CLIs, and cloud services (React, Next.js, Tailwind, Stripe, etc.). Without it, AI uses training data that may reference outdated APIs or deprecated patterns. This is about external library docs, not your project's own README. Specify in your CLAUDE.md or prompts that AI should use Context7, because it will not call this plugin on its own otherwise.

**Figma plugin** – Gives AI access to design data from Figma Dev Mode – code, not screenshots. The plugin adapts code to your tech stack automatically and supports bidirectional workflows (design→code and code→design import). Use it gradually (smaller elements at a time) for best results.

### Recommended (install when needed)

**Playwright plugin** – Browser automation for testing and TDD. More advanced – install once you are comfortable with the basics.

**Figma Console MCP** – Can perform actions in Figma programmatically: turn raw frames into components with tokens and styles, structure files for dev handoff. Trickier to set up but powerful for design system work. The `ui-figma-handoff` skill provides a guided workflow for using it. Recommended install: search GitHub for "figma-console MCP" or visit https://github.com/southleft/figma-console-mcp. Not bundled with this plugin – `ui-figma-handoff` prompts for install when needed.

---

## Step 3: Provide Setup Guidance

If you write MCP setup notes or a recommendation log to `.design-engineer-plugin/design/dev/`, ensure the parent directory exists first: run `mkdir -p .design-engineer-plugin/design/dev` (Bash). The plugin uses lazy folder scaffolding – folders are created by the skill that needs them, not upfront.

For each recommended MCP, explain:
- What it does in practical terms
- Where to find installation instructions (link to the official repository)
- How to verify it is working
- How to reference it in CLAUDE.md so AI uses it consistently

Important: do not provide hardcoded installation commands. MCPs update their setup process frequently. Always point the user to the official repository for current instructions.

---

## Step 4: Configure CLAUDE.md References

Help the user add MCP usage rules to their CLAUDE.md:
- When to use Context7 (before any architectural decision)
- When to use Figma plugin (when implementing designs, when reviewing visual fidelity, when importing code into Figma)
- When to use Playwright (for testing implemented features)

---

## Content Integrity

1. **No fabrication**: Only include content the user explicitly provided or that was read from an existing deliverable file. If you see a gap – an unclear workflow need, an unknown environment detail – ask via AskUserQuestion. Never fill gaps silently. Never invent installation commands, API endpoints, or configuration details. Never attribute content to a deliverable you haven't Read.
2. **Read before reference**: When referencing any previous deliverable in your output, you MUST Read the file first. Do not quote from memory – read the actual file and use its actual content.

## Anti-slop Writing

Before generating any text for the deliverable, read [anti-slop-writing.md](../shared-references/anti-slop-writing.md) and apply its rules. Scan your output before presenting it to the user.

## Decision Hierarchy

1. **User's direct input** – they choose which MCPs to install based on their needs
2. **Project requirements** – some workflows require specific MCPs
3. **AI suggestions** – recommend based on the proven workflow, but do not push unnecessary tools

---

## What Comes Next

After MCPs are configured, suggest `dev-agent-setup` to set up agents that leverage these MCPs, or `dev-claude-md` to add MCP usage rules to the global configuration.

---

## Resource Files



## Common Issues

### MCP server fails to start
If an MCP server won't start after installation:
1. Check Node.js version: `node --version` (must be v18+)
2. Verify npm dependencies are installed in the MCP server directory
3. Check for port conflicts if the server uses a specific port
4. Review the MCP server logs for specific error messages

### API key rejected
If an MCP server connects but API calls fail:
1. Verify the API key format matches what the service expects
2. Check that the key has the required scopes/permissions
3. Confirm the key has not expired or been rate-limited
4. Test the key independently outside of the MCP server