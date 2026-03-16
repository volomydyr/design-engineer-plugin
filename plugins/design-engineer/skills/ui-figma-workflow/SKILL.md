---
name: ui-figma-workflow
description: Defines a minimal Figma workflow for AI-assisted development. Use when starting high-fidelity design work or preparing Figma frames for handoff to AI coding tools.
disable-model-invocation: true
model: sonnet
---

# Figma Workflow for AI-Assisted Development

## Why This Matters

With AI-assisted development, Figma becomes a tool for visual direction – not for documenting every possible state. You do not need to design every screen beforehand. Instead, design only 5-8 key screens that establish the visual style, and let AI generate the rest to match.

This approach saves significant time and avoids the trap of creating pixel-perfect Figma files that are technically painful to implement. When AI generates components and provides their code, development becomes relatively straightforward.

## Interaction Method

If `AskUserQuestion` is available, use it for all prompts below.

If not, present each question as a numbered list and wait for a reply before proceeding. For multiSelect questions, accept comma-separated numbers (e.g. `1, 3`). Never skip or auto-answer without explicit user consent.

---

## Step 1: Determine the Figma Integration Method

Before starting any design work, establish how designs will be shared with AI tools.

```
question: "How do you want to share Figma designs with your AI coding tool?"
header: "Figma Integration Method"
options:
  - label: "Figma plugin (official)"
    description: "Gives AI access to Dev Mode data – code, not screenshots. Supports code→Figma import. Best for pixel-perfect results."
  - label: "Figma Console MCP"
    description: "Can perform actions in Figma for you (create components, apply tokens, structure files). More powerful but trickier to set up."
  - label: "Manual screenshots"
    description: "Take screenshots of frames and share with AI. Simple but less accurate."
  - label: "Playwright plugin or browser extension"
    description: "Use browser automation to capture live designs."
  - label: "Not sure yet"
    description: "Help me decide based on my setup."
```

If the user selects "Not sure yet," recommend the Figma plugin as the default starting point for most workflows.

---

## Step 2: Identify Key Screens

Based on the user's Information Architecture and MVP Requirements (if available), identify the 5-8 most important screens that will establish the visual direction. These are building blocks – screens that set up the visual style AI can analyze and reuse for other parts of the app.

Guidelines for selecting key screens:
- One onboarding step (sets tone and first impression)
- The main home or dashboard screen (establishes layout patterns)
- One detail view (shows how content is displayed)
- One action screen (shows primary user interaction)
- Navigation structure (bottom tabs, sidebar, or drawer)
- One modal or bottom sheet (shows overlay patterns)

Ask the user to confirm or adjust the selection.

---

## Step 3: Figma Best Practices for AI Handoff

Walk the user through these critical Figma practices:

### Focus on Auto-Layouts
Auto-layouts are essential. AI needs them to understand how to make code responsive. If you skip auto-layouts and use absolute positioning, AI will not know how elements should behave when screen sizes change.

### Components and Tokens

**With Figma Console MCP**: After designing key screens, run `ui-figma-handoff` to automate the creation of components, design tokens, variables, and styles directly in Figma. This takes minutes and produces better development handoff results — structured files with proper variable bindings, component instances, and dev-ready annotations.

**Without Figma Console MCP**: There is no need to name layers properly — Figma now has an AI feature that does it automatically. Do not manually create components, color tokens, or a separate design system in Figma. A single-page Figma file works fine. The design system should be built in code instead. AI handles this well: give it a design frame, develop the first iteration, then ask it to refactor.

### Code-to-Figma Import

If the user has an HTML prototype from `dev-prototyping`, the Figma plugin can import it into Figma as a starting point for high-fidelity design work. This creates Figma frames from the prototype that can then be refined manually — useful for going from code back to design.

### Design Corrections, Not Full Coverage
After AI implements the first iteration, some screens will look good and others will have issues. Design corrections only for the frames where AI made mistakes, share them via the chosen integration method, and let AI adjust the code based on the new references.

---

## Step 4: Using the Figma Plugin Effectively

Share guidance from [figma-mcp-guide.md](./references/figma-mcp-guide.md) on getting the best results:

1. Share designs gradually – smaller elements at a time produce better results than complex full pages
2. Start with functional code first (works well, looks basic), then apply design styles from Figma
3. The MCP adapts code to your tech stack automatically (SwiftUI for iOS, React for web, etc.)
4. Always compare MCP output with existing code patterns in your project

---

## Step 5: Produce the Deliverable

Help the user create a Figma strategy document saved to `{deliverables_path}/design/figma-strategy.md` that includes:

- Integration method chosen and setup status
- List of key screens to design (5-8 screens)
- Notes on visual direction for each screen
- Figma file organization approach (single page recommended)
- Handoff workflow: design -> share -> implement -> review -> correct

---

## Decision Hierarchy

1. **User's direct input** – their design vision, their product
2. **Existing documentation** (MVP Requirements, Information Architecture, design references)
3. **AI suggestions** – fill gaps only, always presented as suggestions

---

## What Comes Next

After Figma designs are created, suggest the logical next step:

- **If Figma Console MCP is available**: suggest `ui-figma-handoff` to structure designs and prepare for developer handoff
- **For development**: suggest `dev-agent-pipeline` to implement designs using the agent pipeline
- **For review**: suggest `ui-visual-review` to review implemented results against the designs

---

## Resource Files

- [figma-for-ai-dev.md](./references/figma-for-ai-dev.md) – Principles for Figma workflow in AI-assisted development
- [figma-mcp-guide.md](./references/figma-mcp-guide.md) – How to use Figma integrations effectively for design handoff
