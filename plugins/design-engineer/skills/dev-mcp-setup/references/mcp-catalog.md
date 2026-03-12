# MCP Catalog

MCPs (Model Context Protocol integrations) extend what AI can do beyond basic code generation. They connect your AI tool to other applications – reading designs, fetching documentation, running browser tests, and more.

The rule of thumb: do not install everything you see on the web. Start with the essentials and add others only when you have a specific need. Having too many MCPs is similar to having too many agents – it wastes time and creates confusion.

---

## Essential Plugins

Install these first. They cover the two most critical needs for AI-assisted development: accurate documentation and design data.

### Context7 Plugin

**What it does:** Gives your AI tool access to up-to-date technical documentation for any framework or library. Large language models are trained on information up to a specific date, and everything after that date, AI does not know about. Technical documentation gets regularly updated, and there are situations when AI – even the most powerful model – still has knowledge based on outdated docs.

**Why essential:** Reduces situations where AI hallucinates by providing current information. Without Context7, AI may suggest deprecated APIs, outdated patterns, or installation commands that no longer work.

**How to use it:**
- Specify in your CLAUDE.md or prompts that AI should use Context7 for documentation lookup
- AI will not usually call this plugin on its own unless instructed to
- Use it before any architectural decision: "Use Context7 to look up the current best practice for [topic]"

**When to use:** Before making any architectural decision, when implementing features with framework-specific patterns, when AI suggests code that looks unfamiliar or possibly outdated.

**Repository:** [github.com/upstash/context7](https://github.com/upstash/context7)

---

### Figma Plugin

**What it does:** Gives your AI tool design information from your frames in Figma. Not screenshots, but data from Dev Mode — the same code that developers see when they review your UI before implementing it. Also supports bidirectional workflows — it can import code from Claude Code into Figma, creating Figma frames from your HTML prototype or generated code.

**Why essential:** Enables pixel-perfect implementation without manually describing every design detail. The plugin understands the technologies you use in your project and adapts the code accordingly (e.g., if you use a specific frontend framework, it provides code in that framework's patterns, not generic web code).

**How to use it:**
- Share a Figma frame link with AI and ask it to implement the design
- Use it gradually — smaller elements at a time produce much better results than complex full-page designs
- Start with functional code first (makes it work, even if ugly), then use the Figma plugin to apply the correct styles
- Import HTML prototypes into Figma as a starting point for high-fidelity design work (code-to-Figma import)

**Best practice for design implementation:**
1. Generate something that works well but looks basic
2. Design it nicely in Figma
3. Share the Figma design via the plugin and let AI apply the correct styles without touching the functionality
4. This order (functionality first, then visuals) produces better results than starting with beautiful designs and trying to make them functional

**Important:** Auto-layouts in Figma are critical. AI needs them to understand how to make your code responsive. If you skip auto-layouts and use absolute positioning, AI will not know how elements should behave when screen sizes change.

**Repository:** [help.figma.com/hc/en-us/articles/32132100833559](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)

---

## Recommended

Install these when you have a specific need. They are not required for every project but become valuable for certain workflows.

### Playwright Plugin

**What it does:** Browser automation for testing. Lets AI run your web application, click through user flows, verify that elements render correctly, and catch regressions.

**When to install:** When you are comfortable with the basics and want to adopt a test-driven development (TDD) approach. More advanced but powerful for ensuring quality.

**Use case:** After implementing a feature, ask AI to write and run Playwright tests that verify the feature works correctly. Catches bugs before they reach users.

**Repository:** [github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

---

### Figma Console MCP

**What it does:** Unlike the Figma plugin that primarily reads design data and imports code, the Figma Console MCP can perform actions inside Figma programmatically. It can turn raw frames into components with tokens and styles, create variable collections, organize files, and automate repetitive design tasks. This is a standalone MCP server (not a Claude Code plugin).

**When to install:** After you have explored the Figma plugin and want more advanced design workflows. Particularly useful for design system work and dev handoff preparation. The `ui-figma-handoff` skill provides a guided workflow for using it to structure raw designs and prepare for developer handoff.

**Difficulty:** Trickier to set up than the Figma plugin, especially if you are new to Claude Code. But once learned, it is incredibly powerful for managing your design system programmatically.

**Repository:** [github.com/southleft/figma-console-mcp](https://github.com/southleft/figma-console-mcp)

---

## Configuration Best Practices

### In CLAUDE.md

Add rules for when AI should use each MCP:

```
Before making ANY architectural decision:
1. Use Context7 to find the library documentation
2. Get the official documentation for the topic
3. Combine with existing codebase patterns to make informed decisions
4. NEVER guess – if documentation is unclear, ask the user
```

### In Agent Files

The context-analyzer agent should be configured to use Context7 for documentation lookup. The frontend-implementer agent should reference the Figma plugin for design data. Include these references in the agent templates.

### In Prompts

You can reference MCPs directly in prompts:
- "Use Context7 to look up the current approach for [topic]"
- "Use the Figma plugin to analyze this design: [Figma link]"
- "Use Playwright to test the feature we just implemented"

### Installation Notes

Do not provide hardcoded installation commands in your project setup. MCPs update their setup process frequently. Always point to the official repository for current installation instructions.

When installing an MCP, verify it is working by asking AI to use it on a simple task before relying on it for important work.
