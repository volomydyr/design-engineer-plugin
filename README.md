<img src="logo.svg" width="200" alt="Design Engineer" />

# Design Engineer Plugin

🇺🇦  Плагін для Claude Code, заснований на технічних статтях і практичних прикладах з [volomydyr.com](https://volomydyr.com). Це як швейцарський ніж для дизайн-інженерів: ідеація, дослідження, психологія, прототипування та розробка – усе в одному зручному й легкому у використанні інструменті.

Пишете команду `/de:start`, плагін розуміє, на якому ви етапі – чи починаєте з нуля, чи продовжуєте створення продукту, чи хочете скористатися ним для існуючого комерційного проекту. Детальну інструкцію та повний опис можна знайти нижче англійською.

[Звʼязатися з автором (LinkedIn)](https://www.linkedin.com/in/merlenkov/) · [Телеграм спільнота про АІ та Дизайн (1,100+ учасників)](https://t.me/+RzzmoFVG5awzYjIy)

<br>

## Getting started

A plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that walks you through building a product, start to finish. Think of it as a swiss knife for product design. It packs a full methodology into one tool – research, psychology, prototyping, development – but stays easy to pick up. You run one command, it figures out where you are, and opens the right instrument.

**Open Claude Code in your terminal and run these two commands, one at a time:**

```
/plugin marketplace add volomydyr/design-engineer-plugin
```

```
/plugin install design-engineer@design-engineer-plugin
```

That's it. The plugin is available in every Claude Code session from now on. **Start a new session in your project directory and type:**

```
/de:start
```

This is the only command you need to remember. It figures out your situation – new product, returning project, or existing codebase – and takes you where you need to go. The plugin also checks for recommended tools during setup and helps install anything that's missing.

<br>

## How it works

7 commands, 49 skills, and 9 agents. Most commands work in two ways – **guided mode** (step-by-step with approval at every stage) or **autopilot** (autonomous with minimal input).

| Command | What it does |
|---------|-------------|
| `/de:start` | Detects your situation – setup, resume, or capability guide |
| `/de:design` | Runs the design workflow – discovery, strategy, planning, validation |
| `/de:prototype` | Generates clickable HTML prototypes from an idea, planning docs, or existing designs |
| `/de:dev` | Development workflow – CLAUDE.md, agent pipeline, context management, TDD, implementation |
| `/de:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/de:document` | Saves decisions, learnings, and project state. Helps communicate with stakeholders |
| `/de:help` | Shows all available commands, current project status, and mode |

<br>

## FAQ

### General

<details>
<summary>1. What does this plugin do that Claude Code doesn't do on its own?</summary>
<br>

Claude Code is a general-purpose AI coding tool. It can write code, answer questions, and run commands.

This plugin adds **a product design methodology on top of it** – 49 skills that teach you how to think about problems, users, psychology, and design before you write a single line of code. It also adds:

- **Safety hooks** that prevent common AI mistakes (scope creep, skipping tests, ignoring your requirements)
- **Specialized agents** that handle specific parts of the workflow
- **A knowledge base** of 100+ psychology principles, design frameworks, and animation references that Claude draws from when reviewing your work

Think of Claude Code as the engine and this plugin as the driver who knows the route.
</details>

<details>
<summary>2. Do I need to know design or UX to use this?</summary>
<br>

No. The plugin teaches you the thinking as you go. Each skill walks you through the process – asking the right questions, considering the right trade-offs – not just producing documents.

If you're an engineer who wants to build better products but doesn't have a design background, this is built for you.
</details>

<details>
<summary>3. Can I use this for an existing project or only new products?</summary>
<br>

Both. `/de:start` detects your situation:

- **New product** – walks you through the full pipeline from problem definition to code
- **Returning project** – shows where you left off and lets you resume, jump to a different phase, or browse everything the plugin can do
- **Existing project** – shows all capabilities, asks about your situation, and recommends what's relevant. You can run any skill individually – a psychology review, an accessibility audit, a design system setup – without going through the full pipeline.
</details>

<details>
<summary>4. Does it work with any tech stack?</summary>
<br>

Yes. The plugin is stack-agnostic. The design, research, and psychology skills work regardless of what you're building with. The development skills (agents, TDD, implementation) work with whatever languages and frameworks your project uses.

During setup, the plugin detects and helps install optional tools that expand its capabilities – Figma for design-to-code workflows, Playwright for browser testing, and Context7 for up-to-date library docs. None are required.
</details>

### Structure

<details>
<summary>5. What are the 7 commands and when do I use each one?</summary>
<br>

- **`/de:start`** – always start here. It detects your situation and routes you.
- **`/de:design`** – when you need to work through the design process: research, strategy, planning, validation.
- **`/de:prototype`** – when you want a clickable HTML prototype from an idea or existing designs.
- **`/de:dev`** – when you're ready to build: CLAUDE.md generation, agent pipeline setup, context management, test-first development, AI-assisted implementation.
- **`/de:review`** – when you want to review what you've built: visual quality, accessibility, psychology, design system compliance, ethics.
- **`/de:document`** – when you need to save decisions, capture learnings, or communicate with stakeholders.
- **`/de:help`** – shows all available commands, your current project status, and mode. Works anywhere.

You only need to remember `/de:start`. It guides you to everything else.
</details>

<details>
<summary>7. What are skills and how are they different from commands?</summary>
<br>

**Commands** are the 7 entry points you type (like `/de:design`).

**Skills** are the 49 specialized workflows that commands orchestrate behind the scenes. Each skill does exactly one thing – write a problem statement, audit cognitive load, create a design system, run a bias review.

You don't need to call skills directly. Commands handle the orchestration. But if you want to run a specific skill on its own, you can (e.g., `/ux-problem-statement` or `/psych-cognitive-load`).
</details>

<details>
<summary>8. What are agents and what do they do?</summary>
<br>

9 specialized personas that handle specific parts of the workflow:

- **context-analyzer** – reads your project and figures out what to build next
- **ux-researcher** – runs research activities
- **deliverable-writer** – writes structured documents
- **psych-scanner** – checks your designs against 100+ psychology principles
- **design-system-auditor** – checks your code against design system rules
- **backend-implementer** – builds backend features
- **frontend-implementer** – builds frontend with pixel-perfect design matching
- **test-writer** – writes failing tests before any implementation starts
- **compound-documenter** – records decisions and maintains context across sessions

Agents activate automatically when needed. You don't call them directly.
</details>

<details>
<summary>9. What happens automatically in the background?</summary>
<br>

The plugin installs several hooks that work without you doing anything:

- **Prompt cleanup** – light grammar fixes and filler word removal before Claude processes your messages. Helpful if you use voice-to-text.
- **Destructive command protection** – catches dangerous commands (`rm -rf`, `git push --force`, `DROP TABLE`) and shows safer alternatives.
- **Test-first enforcement** – blocks code writes until test scripts exist. Keeps test-driven development honest.
- **Requirement fidelity (code)** – after every code write, checks that the implementation matches your approved plan. Catches scope creep, unplanned files, phases implemented out of order, and new components that duplicate existing ones.
- **Requirement fidelity (plans)** – reviews plan files for requirement drift. If a plan adds features, copy, or scope you didn't ask for, it gets flagged before implementation starts.
- **Prompt injection defense** – watches for manipulation attempts hidden in external content (web pages, files, tool outputs).
- **Design intake validation** – blocks screenshot-only Figma work (requires structured design data first) and asks clarifying questions about interactions, animations, and edge cases before coding.
- **Dependency tracking** – when you change a deliverable, flags which other documents might need updating.
- **Session summary** – when you end a session, generates a summary of what changed and which dependent documents might need review.
</details>

### Design & knowledge

<details>
<summary>10. What's the psychology component?</summary>
<br>

14 psychology skills covering 100+ behavioral principles from cognitive science, behavioral economics, and product psychology. Every principle comes with:

- Specific design applications
- Good and bad examples
- Edge cases and constraints

For example, `/de:review` can scan your product against principles like loss aversion, cognitive load, social proof, the peak-end rule, habit formation, pricing psychology, and dozens more.

Psychology is built into the review process from the ground up, so it shows up where it matters – during design decisions, not as a separate step.
</details>

<details>
<summary>11. How does the plugin handle Figma?</summary>
<br>

Two integrations:

- **"Figma Plugin"** (official, recommended) – reads design data from Figma Dev Mode (tokens, spacing, colors, component structure), captures web pages and localhost into Figma, creates new Figma files, generates design system rules for your codebase, and can execute arbitrary Figma Plugin API operations.
- **"Figma Console MCP"** (optional) – adds variable and token management, design linting, design-code parity checking, component documentation generation, design system extraction, comments, Figma Slides, FigJam boards, and granular node manipulation through dedicated tools.

The plugin includes a routing guide that decides which integration to use for what. It also enforces structured design intake – Claude must get proper design data and ask clarifying questions about interactions and animations before implementing anything.

Neither is required. The plugin works without Figma, but the design-to-code workflow is significantly better with at least the "Figma Plugin" installed.
</details>

<details>
<summary>12. What's the knowledge base behind it?</summary>
<br>

~16,000 lines of reference material across 90+ files – structured frameworks adapted from the author's [technical articles and practical examples](https://volomydyr.com), along with established sources in psychology, behavioral economics, and design methodology.

What's covered:

- **Psychology** – 100+ behavioral principles with definitions, design applications, examples, and edge cases
- **Animation** – emotion-to-animation mapping, per-component timing, easing curves, industry-specific philosophies, troubleshooting guides
- **Design** – typography scales, color theory (OKLCH, dark mode), spatial systems, responsive patterns, interaction states
- **Anti-patterns** – common AI design mistakes to avoid (purple gradients, cards-in-cards, identical grids, bounce easing)
- **UX research** – competitor analysis frameworks, behavior mapping, bias audit processes, interview guides
- **Development** – TDD anti-patterns, Conventional Commits, MCP routing

When Claude reviews your work or makes suggestions, it draws from this knowledge base – giving you the depth of a specialized design-engineering resource, not just a general AI model.
</details>

### Development & workflow

<details>
<summary>13. How does the development workflow differ from regular Claude Code?</summary>
<br>

Three key differences:

1. **Test-first** – the plugin enforces TDD. You can't write production code until failing tests exist. A hook enforces this, not just a suggestion.
2. **Phased implementation** – plans are broken into phases with dependencies. Claude implements one phase at a time, shows you what it did and what to check, and waits for your approval before continuing.
3. **Fidelity enforcement** – after every code write, the plugin checks that the implementation matches your plan. Unplanned files, scope creep, out-of-order phases, and duplicate components all get flagged automatically.

The result: you stay in control of what gets built and when, and nothing ships that you haven't reviewed.
</details>

<details>
<summary>14. Does it remember things across sessions?</summary>
<br>

Yes. The plugin maintains a memory system that persists between chat sessions:

- **Pipeline state** – which phase you're in, what you've completed, what's next
- **Key decisions** – cross-cutting choices (like "B2B focus" or "mobile-first") that affect multiple deliverables downstream
- **Project map** – a living file tree so Claude doesn't need to re-explore your project structure every session
- **Debug solutions** – hard-won fixes that took multiple attempts, saved so you don't have to solve the same problem twice

When you start a new session, the plugin picks up where you left off. You don't need to re-explain your project or decisions.
</details>

<details>
<summary>15. What are living documents?</summary>
<br>

Every deliverable the plugin creates (problem statement, personas, business plan, MVP requirements, etc.) is tracked with its dependencies. When you change an upstream document, the plugin flags which downstream documents might need updating.

For example, if you revise your problem statement, the plugin knows that your target audience, assumptions, and competitor analysis all depend on it – and tells you they may need review.

This means deliverables stay connected to each other instead of going stale as your thinking evolves.
</details>

<br>

## All 49 skills

<details>
<summary>Show all</summary>
<br>

All skills run automatically through commands. If you want, you can also call any skill directly (e.g., `/ux-problem-statement`).

**Meta (4)**

| Skill | What it does |
|-------|-------------|
| `meta-setup` | Environment setup and project scaffolding |
| `meta-orchestrator` | Controls the design pipeline |
| `meta-document` | Documents knowledge and maintains context |
| `meta-statusline` | Installs and manages the status line |

**UX research (9)**

| Skill | What it does |
|-------|-------------|
| `ux-problem-statement` | Problem definition |
| `ux-target-audience` | Persona development and behavior mapping |
| `ux-assumptions` | Assumption tracking and validation planning |
| `ux-competitor-analysis` | Competitive landscape analysis |
| `ux-user-interviews` | Interview design, prep, and analysis |
| `ux-storybrand` | StoryBrand messaging framework |
| `ux-business-plan` | Revenue model, market size, go-to-market |
| `ux-mvp-requirements` | MVP prioritization and scoping |
| `ux-information-architecture` | Information architecture |

**UX design (8)**

| Skill | What it does |
|-------|-------------|
| `ux-story-panels` | Visual product narratives (Story Panels) |
| `ux-behavior-mapping` | Behavior mapping and mental models |
| `ux-motivation-audit` | Screen-level motivation analysis |
| `ux-bias-audit` | Bias audit (Identify, Analyze, Design, Document) |
| `ux-journey-mapping` | Journey mapping and improvement tactics |
| `ux-communicating-decisions` | Communicating design decisions to stakeholders |
| `ux-ethics-review` | Ethical design review |
| `ux-full-review` | Full product assessment checklist |

**Psychology (14)**

| Skill | What it does |
|-------|-------------|
| `psych-full-scan` | Broad scan across 100+ principles, routes to deep-dives |
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

**UI design (7)**

| Skill | What it does |
|-------|-------------|
| `ui-references-moodboard` | Design references and inspiration gathering |
| `ui-aesthetic-review` | 4-lens craft critique with named design tests |
| `ui-figma-guide` | Figma workflow for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff |
| `ui-design-system` | Design system architecture and compliance |
| `ui-design-to-code-qa` | Checks if the code matches the design |
| `ui-accessibility` | Accessibility audit (WCAG) |

**Development (7)**

| Skill | What it does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-starter-prompts` | Starter prompts for new coding sessions |
| `dev-agent-setup` | 4-agent development pipeline setup |
| `dev-status-tracking` | Context management for long-running projects |
| `dev-mcp-setup` | MCP and plugin configuration |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation |

</details>

<br>

## Feedback & License

Found a problem? [Open an issue](https://github.com/volomydyr/design-engineer-plugin/issues).

Free and open source – use it however you want ([MIT license](LICENSE)) 🫰.
