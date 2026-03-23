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

---

## Step 2: Recommend Based on Needs

Recommend MCPs based on the user's workflow:

### Essential (install these first)

**Context7 plugin** – Helps AI get up-to-date technical documentation. Without it, AI uses training data that may reference outdated APIs or deprecated patterns. Specify in your CLAUDE.md or prompts that AI should use Context7, because it will not call this plugin on its own otherwise.

**Figma plugin** – Gives AI access to design data from Figma Dev Mode – code, not screenshots. The plugin adapts code to your tech stack automatically and supports bidirectional workflows (design→code and code→design import). Use it gradually (smaller elements at a time) for best results.

### Recommended (install when needed)

**Playwright plugin** – Browser automation for testing and TDD. More advanced – install once you are comfortable with the basics.

**Figma Console MCP** – Can perform actions in Figma programmatically: turn raw frames into components with tokens and styles, structure files for dev handoff. Trickier to set up but powerful for design system work. The `ui-figma-handoff` skill provides a guided workflow for using it.

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