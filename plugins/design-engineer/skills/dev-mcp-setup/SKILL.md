---
name: dev-mcp-setup
description: Guides setup of essential MCP integrations for AI-assisted development. Use when configuring a new development environment or choosing which MCP servers to install.
disable-model-invocation: true
---

# MCP Setup Guide

## Why This Matters

MCPs are integrations between an AI and another application. They extend what AI can do beyond basic code generation – reading Figma designs, fetching up-to-date documentation, running browser tests, and more. However, installing every MCP you find is counterproductive. Start with the essentials and add others only when you have a specific need.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Assess Current Setup

```
question: "Which MCPs do you already have installed?"
header: "Current MCP Setup"
options:
  - label: "None yet"
    description: "Starting fresh – need guidance on what to install"
  - label: "Context7"
    description: "Already have up-to-date documentation access"
  - label: "Figma plugin (official)"
    description: "Already have Figma design data access (bidirectional — design→code and code→design)"
  - label: "Figma Console MCP"
    description: "Already have the Figma Console MCP for programmatic Figma actions"
  - label: "Playwright MCP"
    description: "Already have browser automation for testing"
  - label: "Other MCPs"
    description: "I have other integrations installed"
allowMultiSelect: true
```

---

## Step 2: Recommend Based on Needs

Using the catalog from [mcp-catalog.md](./references/mcp-catalog.md), recommend MCPs based on the user's workflow:

### Essential (install these first)

**Context7** – Helps AI get up-to-date technical documentation. Without it, AI uses training data that may reference outdated APIs or deprecated patterns. Specify in your CLAUDE.md or prompts that AI should use Context7, because it will not call this MCP on its own otherwise.

**Figma plugin (official)** – Gives AI access to design data from Figma Dev Mode — code, not screenshots. The plugin adapts code to your tech stack automatically and supports bidirectional workflows (design→code and code→design import). Use it gradually (smaller elements at a time) for best results.

### Recommended (install when needed)

**Playwright MCP** – Browser automation for testing and TDD. More advanced – install once you are comfortable with the basics.

**Figma Console MCP** – Can perform actions in Figma programmatically: turn raw frames into components with tokens and styles, structure files for dev handoff. Trickier to set up but powerful for design system work. The `ui-figma-handoff` skill provides a guided workflow for using it.

### Specialized (install for specific use cases)

**Remotion MCP** – Create videos by talking to AI. Can turn a Figma design into a polished animated video.

---

## Step 3: Provide Setup Guidance

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

## Decision Hierarchy

1. **User's direct input** – they choose which MCPs to install based on their needs
2. **Project requirements** – some workflows require specific MCPs
3. **AI suggestions** – recommend based on the proven workflow, but do not push unnecessary tools

---

## What Comes Next

After MCPs are configured, suggest `dev-agent-pipeline` to set up agents that leverage these MCPs, or `dev-claude-md` to add MCP usage rules to the global configuration.

---

## Resource Files

- [mcp-catalog.md](./references/mcp-catalog.md) – Catalog of recommended MCPs with use cases and setup references
