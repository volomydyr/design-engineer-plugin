# Design Engineer

A plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that guides you through every step of building a product — from initial idea through psychology-informed UX design to production code. It teaches you the process while doing the work, not just outputting deliverables.

## What You Need

Before installing, make sure you have the following:

1. **Claude Code** — Anthropic's AI coding tool that runs in your terminal. If you don't have it yet, follow the [official install guide](https://docs.anthropic.com/en/docs/claude-code/getting-started). Claude Code requires an Anthropic account with a Max or Team plan, or API credits.

2. **Node.js v18+** — needed for the plugin's safety hooks and status line. Check with `node --version`. If missing, install from [nodejs.org](https://nodejs.org/) or via `brew install node`.

3. **Python 3** — needed for dependency tracking and environment detection. Check with `python3 --version`. Comes pre-installed on macOS and most Linux distributions.

4. **Bash** — needed for setup scripts. Built into macOS and Linux. Windows users need WSL.

## Install

Open Claude Code in your terminal and run:

```
/install-plugin https://github.com/volomydyr/design-engineer-plugin
```

That's it. The plugin is now available in every Claude Code session.

## Getting Started

Once installed, start a new Claude Code session in your project directory and type:

```
/de:start
```

This is the only command you need to remember. It detects your situation and routes you automatically:

- **New product?** → Interactive setup: detects your environment, asks how you want to work, scaffolds your project, and walks you into the design pipeline.
- **Returning?** → Shows where you left off and lets you resume, jump to a different phase, or browse all capabilities.
- **Existing project?** → Shows everything the plugin can do, asks about your situation, and recommends relevant capabilities.

During setup, the plugin checks for recommended tools (Context7, Figma, Playwright) and offers to help install any that are missing. You don't need to set these up in advance.

## What It Does

You interact with 6 commands. Behind each one, 49 skills and 9 agents run automatically.

| Command | What It Does |
|---------|-------------|
| `/de:start` | Smart entry point — setup, resume, or capability guide depending on your situation |
| `/de:design` | Full design pipeline — discovery, strategy, planning, and validation. Autonomous or step-by-step. |
| `/de:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs |
| `/de:dev` | Development pipeline — environment setup, test-first development, AI-assisted implementation |
| `/de:review` | Multi-layer review — visual quality, accessibility, psychology (100+ principles), design system compliance, ethics |
| `/de:document` | Documents decisions, learnings, and project state. Prepares stakeholder communication. |

### Two Modes

Most commands support:

- **Guided mode** — step-by-step, asks questions at every stage, pauses for your approval. Recommended for learning and thorough work.
- **God mode** — runs autonomously with minimal input. Best for quick validation and rapid exploration.

## How It Works

The plugin is opinionated. It follows a specific methodology built from real product-building experience:

- **User > Docs > AI** — your decisions override documentation, which overrides AI suggestions. Always.
- **One activity per skill** — each skill covers exactly one thing well, with specific workflows and reference materials.
- **Teach the thinking** — skills don't just produce outputs. They walk you through the reasoning, so you learn the process.
- **Psychology-backed** — 14 psychology skills covering 100+ behavioral principles (cognitive load, decision-making, engagement, persuasion, emotional design) are woven into the design review process.

### Pipeline Phases

When running the full design pipeline (`/de:design`), your project moves through:

1. **Discovery** — problem definition, target audience, assumptions, competitive analysis
2. **Strategy** — behavior mapping, product narrative, user stories, business model
3. **Planning** — MVP requirements, information architecture
4. **Design & Validation** — bias audits, journey mapping, prototyping, design references, psychology analysis
5. **Development** — environment setup, test-driven implementation with AI agents

Each phase produces deliverables tracked by a dependency graph. When an upstream document changes, the plugin tells you which downstream documents may need review.

### Agents

9 specialized agents handle specific tasks behind the scenes:

| Agent | Role |
|-------|------|
| `context-analyzer` | Analyzes project context and codebase structure |
| `ux-researcher` | Conducts research activities |
| `deliverable-writer` | Produces structured deliverable documents |
| `psych-scanner` | Scans designs against 100+ psychology principles |
| `design-system-auditor` | Audits code against design system rules |
| `backend-implementer` | Implements backend features |
| `frontend-implementer` | Implements frontend features |
| `test-writer` | Writes failing test scripts before implementation (TDD) |
| `compound-documenter` | Documents decisions and maintains context |

### Safety Hooks

The plugin installs protective hooks that run automatically:

- **Destructive command protection** — blocks `rm -rf`, `git push --force`, `DROP TABLE`, and similar commands, showing safer alternatives
- **Test-first enforcement** — blocks code writes when no tests exist during active implementation
- **Prompt injection defense** — scans external tool outputs for manipulation attempts
- **Requirement fidelity** — flags scope creep in plans and code that wasn't explicitly requested
- **Dependency tracking** — after editing deliverables, advises which downstream documents may need review
- **Session summary** — when you stop, summarizes what changed and what may be stale

### Model Configuration

Every agent and skill specifies which Claude model to use:

- **Opus** (42 components) — psychology analysis, UX research, implementation, design review
- **Sonnet** (17 components) — template generation, setup wizards, documentation

## Recommended Tools

The plugin works on its own, but these tools unlock additional capabilities. Setup (`/de:start`) detects and helps install them automatically.

| Tool | What It Adds | Required? |
|------|-------------|-----------|
| **Context7** | Up-to-date documentation for any library — AI doesn't rely on outdated training data | Bundled with the plugin |
| **Figma** (official plugin) | Reads design data from Figma Dev Mode — structured design info, not screenshots | Recommended for design work |
| **Playwright** | Browser-based testing and visual review of live pages | Recommended for development |
| **Figma Console** (MCP) | Performs actions directly in Figma — create components, apply tokens from prompts | Optional, for advanced Figma workflows |

<details>
<summary><h2>All 49 Skills</h2></summary>

All skills run automatically through commands. Power users can invoke any skill directly (e.g., `/ux-problem-statement`).

### Meta (4)

| Skill | What It Does |
|-------|-------------|
| `meta-setup` | Interactive environment setup and project scaffolding |
| `meta-orchestrator` | Central controller for the design pipeline |
| `meta-document` | Knowledge documentation and context engineering |
| `meta-statusline` | Status line installation and management |

### UX Research (9)

| Skill | What It Does |
|-------|-------------|
| `ux-problem-statement` | Structured problem definition |
| `ux-target-audience` | Persona development with behavior mapping |
| `ux-assumptions` | Assumption tracking and validation planning |
| `ux-competitor-analysis` | Competitive landscape analysis |
| `ux-user-interviews` | Interview design, preparation, and analysis |
| `ux-storybrand` | StoryBrand messaging framework |
| `ux-business-plan` | Revenue model, market size, go-to-market |
| `ux-mvp-requirements` | MVP prioritization and scoping |
| `ux-information-architecture` | Information architecture design |

### UX Design (8)

| Skill | What It Does |
|-------|-------------|
| `ux-story-panels` | Story Panels framework for product narratives |
| `ux-behavior-mapping` | Behavior mapping and mental model analysis |
| `ux-motivation-audit` | Screen-level motivation and experience value analysis |
| `ux-bias-audit` | Bias audit process (Identify, Analyze, Design, Document) |
| `ux-journey-mapping` | Journey mapping and improvement tactics |
| `ux-communicating-decisions` | Communicating design decisions to stakeholders |
| `ux-ethics-review` | Ethical design review |
| `ux-full-review` | Comprehensive product assessment checklist |

### Psychology (14)

| Skill | What It Does |
|-------|-------------|
| `psych-full-scan` | Broad scan across all 100+ principles with routing to deep-dive sections |
| `psych-cognitive-load` | Cognitive load, progressive disclosure, recognition over recall |
| `psych-visual-perception` | Gestalt principles, visual hierarchy, attention |
| `psych-decision-fundamentals` | Loss aversion, anchoring, confirmation bias |
| `psych-decision-persuasion` | Scarcity, social proof, decoy effect, framing |
| `psych-engagement-patterns` | Curiosity gap, variable reward, goal gradient |
| `psych-delight-design` | Peak-end rule, delighters, labor illusion |
| `psych-emotional-retention` | Endowment effect, storytelling, emotional design |
| `psych-simplification` | Serial position, picture superiority, chunking |
| `psych-pricing-psychology` | Sunk cost, reciprocity, pricing perception |
| `psych-habit-formation` | Commitment, consistency, reactance |
| `psych-social-influence` | Social proof, authority, liking |
| `psych-cognitive-biases` | Availability heuristic, negativity bias |
| `psych-time-perception` | Familiarity bias, shaping, aha moment |

### UI Design (7)

| Skill | What It Does |
|-------|-------------|
| `ui-references-moodboard` | Design intent exploration and reference gathering |
| `ui-aesthetic-review` | 4-lens craft critique with named design tests |
| `ui-figma-guide` | Figma for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff preparation |
| `ui-design-system` | Design system architecture, compliance, and persistence |
| `ui-design-to-code-qa` | Implementation fidelity review with UX non-negotiables |
| `ui-accessibility` | Accessibility compliance audit (WCAG) |

### Development (7)

| Skill | What It Does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-starter-prompts` | Kick-start prompt generation for new sessions |
| `dev-agent-setup` | 4-agent development pipeline setup |
| `dev-status-tracking` | Long-running project context management |
| `dev-mcp-setup` | MCP and plugin configuration guidance |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation |

</details>

## Feedback

Report issues at [github.com/volomydyr/design-engineer-plugin/issues](https://github.com/volomydyr/design-engineer-plugin/issues)

## License

MIT
