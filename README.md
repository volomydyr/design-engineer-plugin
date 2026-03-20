# Design Engineer

Full-stack product design and AI-assisted development plugin for Claude Code. 49 skills, 9 agents, 6 commands. An opinionated, battle-tested workflow that takes you from initial idea through psychology-informed UX design to production code.

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
/de:start
```

## Commands

You interact with 6 top-level commands. Behind each one, the full engine of 49 skills and 9 agents runs silently.

| Command | What It Does |
|---------|-------------|
| `/de:start` | Smart entry point. Detects your situation — new projects get full setup, returning projects resume, existing projects get a capability guide. |
| `/de:design` | Full design workflow orchestrator. God mode (autonomous) or Guided mode (step-by-step). Sequences through discovery, strategy, planning, and validation. |
| `/de:prototype` | HTML prototype generation. New products, new features, or redesigns. |
| `/de:dev` | Development pipeline. CLAUDE.md generation, agent pipeline setup, context management, kick-start prompts, GitHub workflow, MCP configuration. |
| `/de:review` | Multi-layer design review. Visual review, accessibility audit, psychology audit (100+ principles), product assessment, design system compliance, ethics review. |
| `/de:document` | Knowledge documentation and stakeholder communication. Documents decisions, learnings, and project state. Prepares findings for stakeholders. |

### Modes

Most commands support two modes:

- **God mode** – runs the full pipeline autonomously with minimal user input
- **Guided mode** – interactive, asks questions at every stage, pauses for approval

## Skills (49)

All skills are hidden from auto-discovery (`disable-model-invocation: true`). Power users can invoke any skill directly.

### Meta (4)

| Skill | What It Does |
|-------|-------------|
| `meta-setup` | Interactive environment setup and project scaffolding |
| `meta-orchestrator` | Central controller for the design pipeline |
| `meta-document` | Knowledge documentation and context engineering |
| `meta-statusline` | Status line installation and management |

### UX Research (10)

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

### UX Design Activities (8)

| Skill | What It Does |
|-------|-------------|
| `ux-story-panels` | Story Panels framework for product narratives |
| `ux-behavior-mapping` | Behavior mapping and mental model analysis |
| `ux-motivation-audit` | Screen-level Motivation Levels and Experience Value analysis |
| `ux-bias-audit` | Bias audit process (Identify, Analyze, Design, Document) |
| `ux-journey-mapping` | Journey mapping and improvement tactics |
| `ux-communicating-decisions` | Communicating design decisions to stakeholders |
| `ux-ethics-review` | Ethical design review |
| `ux-full-review` | Comprehensive product assessment checklist |

### Psychology (14)

| Skill | What It Does |
|-------|-------------|
| `psych-full-scan` | Broad scan across all 100+ principles with routing to sections |
| `psych-cognitive-load` | Laws 1-10: cognitive load, progressive disclosure, recognition |
| `psych-visual-perception` | Laws 11-20: Gestalt, visual hierarchy, attention |
| `psych-decision-fundamentals` | Laws 21-25: loss aversion, anchoring, confirmation bias |
| `psych-decision-persuasion` | Laws 26-30: scarcity, social proof, decoy effect, framing |
| `psych-engagement-patterns` | Laws 31-40: curiosity gap, variable reward, goal gradient |
| `psych-delight-design` | Laws 41-45: peak-end rule, delighters, labor illusion |
| `psych-emotional-retention` | Laws 46-50: endowment effect, storytelling |
| `psych-simplification` | Laws 51-60: serial position, picture superiority, chunking |
| `psych-pricing-psychology` | Laws 61-65: sunk cost, reciprocity |
| `psych-habit-formation` | Laws 66-70: commitment, consistency, reactance |
| `psych-social-influence` | Laws 71-80: social proof, authority, liking |
| `psych-cognitive-biases` | Laws 81-90: availability heuristic, negativity bias |
| `psych-time-perception` | Laws 91-100: familiarity bias, shaping, aha moment |

### UI Design (7)

| Skill | What It Does |
|-------|-------------|
| `ui-references-moodboard` | Design intent exploration and reference gathering |
| `ui-aesthetic-review` | 4-lens craft critique with named design tests |
| `ui-figma-guide` | Figma for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff preparation |
| `ui-design-system` | Design system architecture, compliance, and persistence |
| `ui-design-to-code-qa` | Implementation fidelity review with UX non-negotiables |
| `ui-accessibility` | Accessibility compliance audit |

### Development (7)

| Skill | What It Does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-starter-prompts` | IDE kick-start prompt generation |
| `dev-agent-setup` | 4-agent development pipeline setup |
| `dev-status-tracking` | Long-running project context management |
| `dev-mcp-setup` | MCP configuration guidance |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation from planning docs, existing designs, or just an idea |

## Agents (9)

| Agent | Role |
|-------|------|
| `context-analyzer` | Analyzes project context and codebase structure |
| `backend-implementer` | Implements backend features |
| `frontend-implementer` | Implements frontend features |
| `design-system-auditor` | Audits code against design system rules |
| `psych-scanner` | Scans designs against 100+ psychology principles |
| `ux-researcher` | Conducts research activities |
| `deliverable-writer` | Produces structured deliverable documents |
| `test-writer` | Writes failing Playwright CLI test scripts before implementation |
| `compound-documenter` | Documents decisions and maintains context |

## Power User Guide

Every skill can be invoked directly:

```bash
# Run a specific research activity
/ux-problem-statement

# Run a psychology section
/psych-cognitive-load

# Run the full pipeline
/de:design god-mode
```

## Hooks

The plugin includes five hooks:

- **PreToolUse** (`de-safety-hook.js`) – context-aware protection against destructive Bash commands (rm -rf, git push --force, DROP TABLE, git add .env, etc.). Shows safer alternatives alongside every block. Fail-open design.
- **PreToolUse** (`de-tdd-hook.js`) – enforces test-first development by blocking source code writes (Write/Edit/MultiEdit) when no test scripts exist in `tests/` during active implementation. Fail-open design.
- **PostToolUse** (`check_deliverable_deps.py`) – when a deliverable file is written or edited, checks the dependency graph and advises which downstream documents may need review
- **PostToolUse** (`de-prompt-injection-hook.js`) – scans tool outputs (Read, WebFetch, Bash, Grep, Task, MCP) for indirect prompt injection attempts across 5 categories: instruction override, role-playing/DAN, encoding/obfuscation, context manipulation, instruction smuggling. Warns Claude without blocking. Fail-open design.
- **PostToolUse** (`de-fidelity-hook.js` + Haiku prompt) – enforces requirement fidelity after file writes. Command hook injects fidelity reminders for source code during implementation. Prompt hook (Haiku) reviews plan files for requirement drift — features, copy, or scope not explicitly requested by the user.
- **Stop** (`session_dep_summary.py`) – summarizes which deliverables were updated in this session and which dependents may be stale

## Model Configuration

Every agent and skill specifies an explicit model in its frontmatter:

- **Opus** (42 components: 36 skills, 6 agents) — psychology analysis, UX research, implementation, design review, orchestration
- **Sonnet** (17 components: 14 skills, 3 agents) — context reading, template generation, setup wizards, documentation

See `CLAUDE.md` for assignment principles when adding new components.

## Requirements

- **Claude Code CLI**
- **Node.js** (v18+) — runs the safety hook and status line
- **Python 3** — runs dependency tracking hooks and environment detection
- **Bash** — runs setup scripts (macOS/Linux built-in)
- Recommended plugins: Context7 (bundled), Figma, Playwright
- Optional MCP: Figma Console

## Feedback

Report issues at [github.com/volomydyr/design-engineer-plugin/issues](https://github.com/volomydyr/design-engineer-plugin/issues)

## License

MIT
