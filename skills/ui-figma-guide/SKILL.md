---
name: ui-figma-guide
description: "Defines a minimal Figma workflow for AI-assisted development. Use when starting high-fidelity design work or preparing Figma frames for handoff to AI coding tools. Do NOT use for automated design structuring or dev handoff; see ui-figma-handoff instead."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
compatibility: "Requires Figma MCP (plugin:figma:figma)"
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
header: "Figma integration"
options:
  - label: ""Figma Plugin" (recommended)"
    description: "Reads designs, captures web pages into Figma, generates design system rules. Covers most workflows."
  - label: "Both "Figma Plugin" + "Figma Console MCP""
    description: ""Figma Plugin" for reading/capturing, "Figma Console MCP" for variables, linting, batch operations, slides, FigJam. Best for design system automation."
  - label: "Manual screenshots"
    description: "Take screenshots of frames and share with AI. Simple but less accurate."
  - label: "Playwright or browser extension"
    description: "Use browser automation to capture live designs."
```

For detailed guidance on which MCP to use for what, see [figma-mcp-routing.md](./references/figma-mcp-routing.md).

---

### Step 1.5: Clarify intent

Before proceeding to screen selection, ask what the user wants to do:

```
question: "What would you like to do with your Figma designs?"
header: "Figma intent"
options:
  - label: "Share my redesigned screens"
    description: "I've updated my designs in Figma and want the plugin to see them"
  - label: "Push prototype to Figma"
    description: "Import the HTML prototype into Figma for refinement"
  - label: "Extract design tokens"
    description: "Pull colors, typography, spacing from Figma for development"
allowMultiSelect: false
```

```
multiSelect: false
```

**BLOCKING REQUIREMENT**: Wait for the user's answer before proceeding.

**Important**: After Figma designs exist, prototypes are throwaway artifacts. Do not suggest updating prototypes to match Figma designs – Figma is now the source of truth. The next step is psychology review, not prototype updates.

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

**With "Figma Console MCP"**: After designing key screens, run `ui-figma-handoff` to automate the creation of components, design tokens, variables, and styles directly in Figma. This takes minutes and produces better development handoff results – structured files with proper variable bindings, component instances, and dev-ready annotations.

**Without "Figma Console MCP"**: There is no need to name layers properly – Figma now has an AI feature that does it automatically. Do not manually create components, color tokens, or a separate design system in Figma. A single-page Figma file works fine. The design system should be built in code instead. AI handles this well: give it a design frame, develop the first iteration, then ask it to refactor.

### Web capture and code-to-Figma import

"Figma Plugin" can capture any web page or localhost URL into Figma as editable design frames (`generate_figma_design`). This works for:

- HTML prototypes from `dev-prototyping` – import them into Figma for high-fidelity refinement
- Running web apps on localhost – capture the current state into Figma for design iteration
- External URLs – capture competitor or reference pages

This enables a round-trip workflow: generate prototype → capture into Figma → refine design → export back to code.

### Design system rules from code

"Figma Plugin" can also generate design system rules directly from your codebase (`create_design_system_rules`). This analyzes your existing components and tokens and creates a rules prompt that ensures Figma-to-code consistency. Useful when the code is ahead of Figma.

### Design Corrections, Not Full Coverage
After AI implements the first iteration, some screens will look good and others will have issues. Design corrections only for the frames where AI made mistakes, share them via the chosen integration method, and let AI adjust the code based on the new references.

---

## Step 4: Using the Figma Plugin Effectively

Share guidance on getting the best results with "Figma Plugin":

1. Share designs gradually – smaller elements at a time produce better results than complex full pages
2. Start with functional code first (works well, looks basic), then apply design styles from Figma
3. The MCP adapts code to your tech stack automatically (SwiftUI for iOS, React for web, etc.)
4. Always compare MCP output with existing code patterns in your project

---

## Step 5: Produce the Deliverable

Help the user create a Figma strategy document saved to `design/craft/figma-strategy.md` that includes:

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

- **If "Figma Console MCP" is available**: suggest `ui-figma-handoff` to structure designs and prepare for developer handoff
- **For development**: suggest `dev-agent-setup` to implement designs using the agent pipeline
- **For review**: suggest `ui-design-to-code-qa` to review implemented results against the designs

---

## Resource Files

- [figma-for-ai-dev.md](./references/figma-for-ai-dev.md) – Principles for Figma workflow in AI-assisted development
- [figma-mcp-routing.md](./references/figma-mcp-routing.md) – Which Figma MCP to use for what (decision guide + capability matrix)

## Common Issues

### Figma MCP returns no data
If `get_design_context` or `get_screenshot` returns empty results:
1. Verify the Figma file URL format – use `figma.com/design/:fileKey/:fileName?node-id=:nodeId`
2. Convert dashes to colons in node-id parameters (URL uses `-`, API uses `:`)
3. Ensure the file is not in a team with restricted API access
4. Try `get_metadata` first to confirm the file is accessible

### Screenshots fail
If `get_screenshot` returns errors:
1. Confirm the Figma file is open and the target frame exists
2. Check that the node-id points to a visible frame (not a hidden or deleted layer)
3. Try capturing a parent frame if the specific node fails

### Web capture fails or stalls
If `generate_figma_design` returns errors or the capture never completes:
1. Verify the URL is accessible (localhost must be running, external URLs must be public)
2. Check that the page has fully loaded before initiating capture
3. For localhost, ensure the dev server is running and the port is correct
4. Poll with the captureId – captures can take 10-30 seconds for complex pages
