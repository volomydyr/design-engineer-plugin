# Design Engineer

Full-stack product design and AI-assisted development plugin for Claude Code. An opinionated, battle-tested workflow that takes you from initial idea through psychology-informed UX design to production code.

## Philosophy

- **Teach while working** – every skill guides the thinking process, not just outputs deliverables
- **User > Docs > AI** – enforces this decision hierarchy in every skill
- **Granular and specific** – each skill covers exactly one activity
- **Opinionated with real context** – prescribes exact workflows based on real product-building experience
- **Tool-agnostic with recommendations** – does not lock you into specific tools, but recommends proven ones

## Quick Start

```bash
# Install the plugin
claude plugin marketplace add https://github.com/volomydyr/design-engineer-plugin
claude plugin install design-engineer

# Run setup first (mandatory)
/de:setup
```

## Commands

You interact with 8 top-level commands. Behind each one, the full engine of 49 skills and 9 agents runs silently.

| Command | What It Does |
|---------|-------------|
| `/de:setup` | One-time plugin configuration. Detects your environment, asks about your project, scaffolds deliverable folders. |
| `/de:design` | Full design workflow orchestrator. God mode (autonomous) or Guided mode (step-by-step). Sequences through discovery, strategy, planning, and validation. |
| `/de:research` | UX research activities. Big Idea validation, Problem Statement, Target Audience, Competitive Analysis, User Interviews, Business Plan, and more. |
| `/de:psych` | Psychology audit. Master audit across 100+ principles, section deep-dives, or God mode for full autonomous analysis. |
| `/de:prototype` | HTML prototype generation. New products, new features, or redesigns. |
| `/de:dev` | Development pipeline. CLAUDE.md generation, agent pipeline setup, context management, kick-start prompts, GitHub workflow, MCP configuration. |
| `/de:review` | Multi-layer design review. Visual review, accessibility audit, psychology scan, product assessment, design system compliance, ethics review. |
| `/de:compound` | Knowledge documentation. Documents decisions, learnings, and project state for cross-session continuity. |

### Modes

Most commands support two modes:

- **God mode** – runs the full pipeline autonomously with minimal user input
- **Guided mode** – interactive, asks questions at every stage, pauses for approval

## Skills (49)

All skills are hidden from auto-discovery (`disable-model-invocation: true`). Power users can invoke any skill directly.

### Meta (3)

| Skill | What It Does |
|-------|-------------|
| `meta-setup` | Interactive environment setup and project scaffolding |
| `meta-orchestrator` | Central controller for the design pipeline |
| `meta-compound` | Knowledge documentation and context engineering |

### UX Research (10)

| Skill | What It Does |
|-------|-------------|
| `ux-big-idea` | Idea validation and refinement |
| `ux-problem-statement` | Structured problem definition |
| `ux-target-audience` | Persona development with behavior mapping |
| `ux-assumptions` | Assumption tracking and validation planning |
| `ux-competitor-analysis` | Competitive landscape analysis |
| `ux-user-interviews` | Interview design, preparation, and analysis |
| `ux-storybrand` | StoryBrand messaging framework |
| `ux-business-plan` | Revenue model, market size, go-to-market |
| `ux-mvp-requirements` | MVP prioritization and scoping |
| `ux-information-architecture` | Information architecture design |

### UX Design Activities (8)

| Skill | What It Does |
|-------|-------------|
| `ux-6p-stories` | 6P Stories framework for product narratives |
| `ux-behavior-mapping` | Behavior mapping and mental model analysis |
| `ux-psych-framework` | Psychology framework application |
| `ux-bias-framework` | B.I.A.S. framework (Block, Interpret, Act, Store) |
| `ux-journey-mapping` | Journey mapping and improvement tactics |
| `ux-communicating-decisions` | Communicating design decisions to stakeholders |
| `ux-ethics-review` | Ethical design review |
| `ux-product-assessment` | Comprehensive product assessment checklist |

### Psychology (14)

| Skill | What It Does |
|-------|-------------|
| `psych-master-audit` | Broad scan across all 100+ principles with routing to sections |
| `psych-cognitive-basics` | Laws 1-10: cognitive load, progressive disclosure, recognition |
| `psych-visual-perception` | Laws 11-20: Gestalt, visual hierarchy, attention |
| `psych-decision-making-core` | Laws 21-25: loss aversion, anchoring, confirmation bias |
| `psych-decision-making-advanced` | Laws 26-30: scarcity, social proof, decoy effect, framing |
| `psych-engagement-motivation` | Laws 31-40: curiosity gap, variable reward, goal gradient |
| `psych-emotional-design-core` | Laws 41-45: peak-end rule, delighters, labor illusion |
| `psych-emotional-design-advanced` | Laws 46-50: endowment effect, storytelling |
| `psych-efficiency` | Laws 51-60: serial position, picture superiority, chunking |
| `psych-behavioral-economics-core` | Laws 61-65: sunk cost, reciprocity |
| `psych-behavioral-economics-habits` | Laws 66-70: commitment, consistency, reactance |
| `psych-social-influence` | Laws 71-80: social proof, authority, liking |
| `psych-cognitive-biases` | Laws 81-90: availability heuristic, negativity bias |
| `psych-time-behavior` | Laws 91-100: familiarity bias, shaping, aha moment |

### UI Design (7)

| Skill | What It Does |
|-------|-------------|
| `ui-design-references` | Design intent exploration and reference gathering |
| `ui-design-critique` | 4-lens craft critique with named design tests |
| `ui-figma-workflow` | Figma for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff preparation |
| `ui-design-system` | Design system architecture, compliance, and persistence |
| `ui-visual-review` | Visual UI review with UX non-negotiables |
| `ui-accessibility` | Accessibility compliance audit |

### Development (7)

| Skill | What It Does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-kickstart-prompts` | IDE kick-start prompt generation |
| `dev-agent-pipeline` | 4-agent development pipeline setup |
| `dev-context-management` | Long-running project context management |
| `dev-mcp-setup` | MCP configuration guidance |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation from planning docs, existing designs, or just an idea |

## Agents (9)

| Agent | Role |
|-------|------|
| `context-analyzer` | Analyzes project context and codebase structure |
| `plan-creator` | Creates implementation plans from requirements |
| `backend-implementer` | Implements backend features |
| `frontend-implementer` | Implements frontend features |
| `design-system-auditor` | Audits code against design system rules |
| `psych-scanner` | Scans designs against 100+ psychology principles |
| `ux-researcher` | Conducts research activities |
| `deliverable-writer` | Produces structured deliverable documents |
| `compound-documenter` | Documents decisions and maintains context |

## Power User Guide

Every skill can be invoked directly:

```bash
# Run a specific research activity
/ux-big-idea

# Run a psychology section
/psych-cognitive-basics

# Run the full pipeline
/de:design god-mode
```

## Hooks

The plugin includes two hooks for deliverable dependency tracking:

- **PostToolUse** – when a deliverable file is written or edited, checks the dependency graph and advises which downstream documents may need review
- **Stop** – summarizes which deliverables were updated in this session and which dependents may be stale

## Requirements

- Claude Code CLI
- Recommended: Context7 MCP server (bundled), Figma MCP, Playwright MCP

## Feedback

Report issues at [github.com/volomydyr/design-engineer-plugin/issues](https://github.com/volomydyr/design-engineer-plugin/issues)

## License

MIT
