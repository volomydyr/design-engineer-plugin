# Figma Integration Guide

## Overview

Two Figma integrations are available for AI-assisted development. Each serves a different purpose, and understanding when to use which one will produce better results.

---

## 1. Figma Plugin (Official)

**What it provides**: Gives your AI tool design information from your frames in Figma. Not screenshots, but data from Dev Mode — the same code that developers see when they review your UI before implementing it.

**Key capabilities**:
- The plugin understands the technologies you use in your coding project. For example, if you are working on an iOS app with SwiftUI, AI does not just copy the code from Figma (which might be related to web development). Instead, it adapts the code to the correct framework automatically.
- **Code-to-Figma import**: The plugin supports bidirectional workflows — it can import code from Claude Code into Figma, creating Figma frames from your HTML prototype or generated code. This is useful when you want to go from a working prototype back to design for refinement.

**Setup**: Follow the official guide at https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server

**When to use**:
- Day-to-day design-to-code workflow
- When you need pixel-accurate implementation of specific frames
- When working with any standard tech stack (SwiftUI, React, Flutter, etc.)
- As the default starting point for most workflows
- When importing code/prototypes back into Figma for design iteration

---

## 2. Figma Console MCP

**What it provides**: Unlike the Figma plugin that primarily reads design data and imports code, the Figma Console MCP can perform actions inside Figma programmatically. It can create components, apply design tokens, set up variable collections, organize files, and automate repetitive design tasks.

**Key capability**: Full programmatic control over Figma files via `figma_execute`. Instead of just reading design data, it can create, modify, and organize design elements — turning raw designs into structured files with components, variables, styles, and dev annotations.

**Setup**: Available at https://github.com/southleft/figma-console-mcp — requires more configuration than the official plugin. Recommended to try after you have explored the Figma plugin first.

**When to use**:
- When you need to create components, apply tokens, or set up styles in Figma programmatically
- When automating the structuring of raw designs into proper design files
- When preparing Figma files for developer handoff (annotations, sections, dev status)
- When you want AI to organize your Figma file structure
- After you are comfortable with the Figma plugin workflow
- For the `ui-figma-handoff` skill workflow (requires this tool)

---

## Best Practices for Using the Figma Plugin

### Share Designs Gradually

If you share a complex design with AI and tell it to build it, the result will typically look bad, especially if it has many components. Instead, use the Figma plugin gradually, sharing smaller elements at a time. This produces much better results because AI can focus on getting each piece right.

### Start with Functionality, Then Apply Design

The best workflow for recreating UI through the Figma plugin:

1. **Generate functional code first** — build something that works well but looks basic
2. **Design it in Figma** — create the visual design for each component or screen
3. **Apply styles via the plugin** — give AI the Figma designs to apply correct styles without touching functionality

Starting with beautiful designs and then trying to make them functional is a more complex task for AI. Going from functional to beautiful produces better results with fewer iterations.

### Adapt to Your Tech Stack

The plugin automatically adapts code to your project's technology stack. When reviewing plugin output:

- Verify that generated code uses the correct framework patterns
- Compare with existing code patterns in your project
- Check that component naming follows your established conventions
- Ensure generated styles reference your design system tokens, not hardcoded values

### Iterative Correction Cycle

1. Share a Figma frame via the plugin
2. Review the AI-generated implementation
3. Identify discrepancies between design and code
4. Create correction frames in Figma for any issues
5. Share corrections via the plugin and let AI adjust

---

## Choosing Between the Two

| Scenario | Recommended Tool |
|---|---|
| First time using Figma with AI tools | Figma plugin |
| Design-to-code for specific screens | Figma plugin |
| Code-to-Figma import (prototype → design) | Figma plugin |
| Creating components in Figma programmatically | Figma Console MCP |
| Applying design tokens to existing frames | Figma Console MCP |
| Structuring raw designs for dev handoff | Figma Console MCP |
| Automating Figma file organization | Figma Console MCP |
| Reading design specifications for code | Figma plugin |

---

## Common Pitfalls

- **Sharing too much at once** — break complex pages into individual components or sections
- **Skipping the functional-first approach** — always get working code before applying visual design
- **Ignoring tech stack adaptation** — always verify the output matches your framework patterns
- **Not comparing with existing code** — output should integrate with your codebase, not create parallel patterns
- **Using Figma Console MCP before understanding the Figma plugin** — learn the basics first, then explore the advanced capabilities
