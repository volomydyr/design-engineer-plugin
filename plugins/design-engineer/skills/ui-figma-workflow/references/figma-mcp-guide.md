# Figma MCP Guide

## Overview

Two Figma MCP servers are available for AI-assisted development. Each serves a different purpose, and understanding when to use which one will produce better results.

---

## 1. Figma Dev Mode MCP (Official)

**What it provides**: Gives your AI tool design information from your frames in Figma. Not screenshots, but data from Dev Mode – the same code that developers see when they review your UI before implementing it.

**Key capability**: The MCP understands the technologies you use in your coding project. For example, if you are working on an iOS app with SwiftUI, AI does not just copy the code from Figma (which might be related to web development). Instead, it adapts the code to the correct framework automatically.

**Setup**: Follow the official guide at https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server

**When to use**:
- Day-to-day design-to-code workflow
- When you need pixel-accurate implementation of specific frames
- When working with any standard tech stack (SwiftUI, React, Flutter, etc.)
- As the default starting point for most workflows

---

## 2. Figma Console MCP (Unofficial)

**What it provides**: Unlike the official alternative, it does not just access design code from Dev Mode – it can actually perform actions in Figma for you. For instance, it can turn raw frames into components with tokens and styles based on your prompt.

**Key capability**: Bi-directional interaction with Figma. Instead of just reading design data, it can create, modify, and organize design elements programmatically.

**Setup**: Available at https://github.com/southleft/figma-console-mcp – requires more configuration than the official MCP. Recommended to try after you have explored the official MCP first.

**When to use**:
- When you need to create components, apply tokens, or set up styles in Figma programmatically
- When automating repetitive Figma tasks
- When you want AI to organize your Figma file structure
- After you are comfortable with the official MCP workflow

---

## Best Practices for Using Figma MCP

### Share Designs Gradually

If you share a complex design with AI and tell it to build it, the result will typically look bad, especially if it has many components. Instead, use the Figma MCP gradually, sharing smaller elements at a time. This produces much better results because AI can focus on getting each piece right.

### Start with Functionality, Then Apply Design

The best workflow for recreating UI through Figma MCP:

1. **Generate functional code first** – build something that works well but looks basic
2. **Design it in Figma** – create the visual design for each component or screen
3. **Apply styles via MCP** – give AI the Figma designs to apply correct styles without touching functionality

Starting with beautiful designs and then trying to make them functional is a more complex task for AI. Going from functional to beautiful produces better results with fewer iterations.

### Adapt to Your Tech Stack

The MCP automatically adapts code to your project's technology stack. When reviewing MCP output:

- Verify that generated code uses the correct framework patterns
- Compare with existing code patterns in your project
- Check that component naming follows your established conventions
- Ensure generated styles reference your design system tokens, not hardcoded values

### Iterative Correction Cycle

1. Share a Figma frame via MCP
2. Review the AI-generated implementation
3. Identify discrepancies between design and code
4. Create correction frames in Figma for any issues
5. Share corrections via MCP and let AI adjust

---

## Choosing Between the Two MCPs

| Scenario | Recommended MCP |
|---|---|
| First time using Figma with AI tools | Official Figma Dev Mode MCP |
| Design-to-code for specific screens | Official Figma Dev Mode MCP |
| Creating components in Figma programmatically | Figma Console MCP |
| Applying design tokens to existing frames | Figma Console MCP |
| Automating Figma organization | Figma Console MCP |
| Reading design specifications for code | Official Figma Dev Mode MCP |

---

## Common Pitfalls

- **Sharing too much at once** – break complex pages into individual components or sections
- **Skipping the functional-first approach** – always get working code before applying visual design
- **Ignoring tech stack adaptation** – always verify the MCP output matches your framework patterns
- **Not comparing with existing code** – MCP output should integrate with your codebase, not create parallel patterns
- **Using Figma Console MCP before understanding the official one** – learn the basics first, then explore the advanced capabilities
