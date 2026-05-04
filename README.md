> **v5.5.6** – see the [changelog](CHANGELOG.md) for what's new.

<img src="logo.svg" width="200" alt="Design Engineer" />

# Design Engineer Plugin

🇺🇦  Плагін для Claude Code, заснований на технічних статтях і практичних прикладах з [volomydyr.com](https://volomydyr.com). Це як швейцарський ніж для дизайн-інженерів: ідеація, дослідження, психологія, прототипування та розробка – усе в одному зручному й легкому у використанні інструменті.

Пишете команду `/product:launch`, плагін розуміє, на якому ви етапі – чи починаєте з нуля, чи продовжуєте створення продукту, чи хочете скористатися ним для існуючого комерційного проекту. Детальну інструкцію та повний опис можна знайти нижче англійською.

[Звʼязатися з автором (LinkedIn)](https://www.linkedin.com/in/merlenkov/) · [Телеграм спільнота про АІ та Дизайн (1,200+ учасників)](https://t.me/+RzzmoFVG5awzYjIy)

<br>

## Getting started

Claude Code writes code; it doesn't think about users, psychology, or design. **Design Engineer** is a plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that walks you through building a product, start to finish. It packs a full methodology into one tool – research, psychology, prototyping, development – but stays easy to use. You run one command, it figures out where you are, and runs the right commands in the right order for you.

**Open Claude Code in your terminal and run these two commands, one at a time:**

```
/plugin marketplace add volomydyr/design-engineer-plugin
```

```
/plugin install design-engineer@design-engineer-plugin
```

That's it. The plugin is available in every Claude Code session from now on. **Start a new session in your project directory and type:**

```
/product:launch
```

This is the only command you need to remember. It figures out your situation – new product, returning project, or existing codebase – and takes you where you need to go. The plugin also checks for recommended tools during setup and helps install anything that's missing.

<br>

## How it works

9 commands, 57 skills, 10 agents, and 3 bundled integrations (Context7 for docs, Figma MCP for Dev Mode connection, Playwright for browser testing). Most commands work in two ways – **guided mode** (step-by-step with user approval at every stage) or **autopilot** (autonomous with minimal input).

You only need to remember one slash command – `/product:launch`. It figures out where you are (starting from scratch, picking up where you left off, or working on an existing product) and runs the right commands in the right order for you. The list below is just so you can see what's available.

| Command | What it does |
|---------|-------------|
| `/product:launch` | Detects your project state, no matter if it's an existing product or something you want to build from scratch |
| `/product:design` | Runs the design workflow – discovery, strategy, validation |
| `/product:prototype` | Generates clickable HTML prototypes from your idea, context docs, references, or existing designs |
| `/product:dev` | Step-by-step development process – CLAUDE.md, agent pipeline, context management, TDD, implementation |
| `/product:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/product:document` | Stores decisions, learnings, and project state for future |
| `/product:stop` | Saves progress, even mid-activity – you can always pick up later |
| `/product:tidy` | Wipes disposable working artifacts (Playwright captures, intermediate drafts, scratch files) before commit |
| `/product:help` | Shows all available commands, current project status, and mode |

<br>

## FAQ

### General

<details>
<summary>1. What does this plugin do that Claude Code doesn't do on its own?</summary>
<br>

Claude Code is a general-purpose AI coding tool. It can write code, answer questions, and run commands.

This plugin adds **a product design methodology on top of it** – 57 skills that teach you how to think about problems, users, psychology, and design before you write a single line of code. It also adds:

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

Both, and the existing-project path is first-class. `/product:launch` detects your situation:

- **New product** – walks you through the full pipeline from problem definition to code.
- **Returning project** – shows where you left off and lets you resume, jump to a different phase, or browse everything the plugin can do.
- **Existing project** – auto-detects your design system, brand docs, written specs, shipped UI, and component count from the codebase, then asks you about off-repo references (Figma file, Notion docs, Linear tracker, external design-system page like Storybook / Zeroheight). All of that gets stored as project context. From there:
  - The 9 ux-* skills that assume a blank slate (StoryBrand, problem statement, target audience, business plan, competitor analysis, assumptions, story panels, user interviews, behavior mapping) respect what already exists – they ask "use as-is, refine, or re-run from scratch" instead of regenerating.
  - **Spec polish routing** – when you run `/product:design` for a new feature, the first question is "Minimal feature spec vs Full feature flow", with explicit descriptions of what each entails. The minimal branch produces a one-page spec that respects your existing brand voice; the full branch walks you through MVP requirements + IA before implementation. No more guessing which depth the plugin will pick.
  - **Optional-depth multi-select** – inside the full feature flow, before implementation kicks off, you pick which optional audits to run as a multi-select: Brief problem statement, Psychology audit (`psych-decision-fundamentals` + `psych-cognitive-load`), Figma comparison (`ui-figma-guide`), Design-system check (`ui-design-system`). Choices are persisted to your project config and read by `/product:dev` so the implementation phase reflects them inline.
  - **Conditional Figma hand-off** – if Figma is connected and you didn't already pick "Figma comparison" in the optional-depth step, the flow asks once before handing off to dev whether to pull structured Figma data first.
  - **Proactive defaults in `/product:dev`** – if your established project is missing CLAUDE.md, the plugin scaffolds it silently from your existing components (no question asked). If `references.md` is missing on a project that already has shipped UI, you get one 2-option question – "Reuse existing UI as the visual reference" or "Provide image references" (which runs the moodboard skill with curated reference previews and sectional Playwright captures). The old 4-option fast-track / full / skip prompt is gone.
  - **Process recall through the abbreviated feature flow** – Steps 2.2 through 2.7 of the existing-project flow are classified as "complex work", so the active workflow's step list renders at the top of Claude's response while the flow runs (see hooks list in FAQ 9 for the full mechanism).
  - `/product:review audit` runs a page-by-page audit of a deployed app (Playwright captures each page, four review agents run, you add your professional feedback alongside the AI findings, deliverables saved per page).
  - `/product:design feature-spec` produces a truly minimal spec for adding one feature to an established product – no StoryBrand, no business-plan rewrite, just respects the existing brand voice. Reachable either by typing the literal `feature-spec` argument or by picking "Minimal feature spec" in the spec-polish routing question.
  - You can still run any skill individually (psychology review, accessibility audit, design system setup, etc.) without the full pipeline.
</details>

<details>
<summary>4. Does it work with any tech stack?</summary>
<br>

Yes. The plugin is stack-agnostic. The design, research, and psychology skills work regardless of what you're building with. The development skills (agents, TDD, implementation) work with whatever languages and frameworks your project uses.

During setup, the plugin detects and helps install optional tools that expand its capabilities – Figma for design-to-code workflows, Playwright for browser testing, and Context7 for up-to-date library docs. None are required.
</details>

<details>
<summary>5. Will this work on the Claude Pro plan?</summary>
<br>

Yes, but the plugin is token-heavy. The Pro plan's 5-hour rate limits will hit fast – even one full design pipeline pass can exhaust them. The plugin works best on Max.
</details>

### Structure

<details>
<summary>6. What are the 9 commands and when do I use each one?</summary>
<br>

- **`/product:launch`** – always start here. It detects your situation and routes you.
- **`/product:design`** – when you need to work through the design process: research, strategy, planning, validation.
- **`/product:prototype`** – when you want a clickable HTML prototype from an idea or existing designs.
- **`/product:dev`** – when you're ready to build: CLAUDE.md generation, agent pipeline setup, context management, test-first development, AI-assisted implementation.
- **`/product:review`** – when you want to review what you've built: visual quality, accessibility, psychology, design system compliance, ethics.
- **`/product:document`** – when you need to save decisions, capture learnings, or communicate with stakeholders. Also auto-purges disposable working artifacts at every phase boundary.
- **`/product:stop`** – when you want to pause mid-activity and save your progress. Pick up later with `/product:launch`.
- **`/product:tidy`** – wipes disposable working artifacts under `.design-engineer-plugin/temporary/` (Playwright captures, intermediate drafts, scratch files). Use before commit, or anytime the working tree feels noisy. `/product:document` does the same purge automatically at every phase boundary; this is the manual mid-session version.
- **`/product:help`** – shows all available commands, your current project status, and mode. Works anywhere.

You only need to remember `/product:launch`. It guides you to everything else.

There's also one small utility command, `/product:mute-unmute-sound`, that toggles plugin sound notifications on or off without uninstalling. Useful for meetings, libraries, or anywhere you want temporary silence. It's not part of the main 9 because you'll touch it once or twice across the lifetime of the plugin, not as part of any workflow.
</details>

<details>
<summary>7. What are skills and how are they different from commands?</summary>
<br>

**Commands** are the 9 entry points you type (like `/product:design`).

**Skills** are the 57 specialized workflows that commands orchestrate behind the scenes. Each skill does exactly one thing – write a problem statement, audit cognitive load, create a design system, run a bias review.

You don't need to call skills directly. Commands handle the orchestration. But if you want to run a specific skill on its own, you can (e.g., `/ux-problem-statement` or `/psych-cognitive-load`).
</details>

<details>
<summary>8. What are agents and what do they do?</summary>
<br>

10 specialized personas that handle specific parts of the workflow:

- **context-analyzer** – reads your project and figures out what to build next
- **ux-researcher** – runs research activities
- **deliverable-writer** – writes structured documents
- **psych-scanner** – checks your designs against 100+ psychology principles
- **design-system-auditor** – checks your code against design system rules and audits the component gallery
- **backend-implementer** – builds backend features
- **frontend-implementer** – builds frontend with pixel-perfect design matching, keeps the component gallery in sync
- **test-writer** – writes failing tests before any implementation starts
- **compound-documenter** – records decisions and maintains context across sessions
- **advisor** – an Opus 4.7 reviewer model that other skills consult at strategic checkpoints (before substantive work, before declaring done, when stuck) – implements [Anthropic's advisor strategy](https://claude.com/blog/the-advisor-strategy) plugin-natively

Agents activate automatically when needed. You don't call them directly.
</details>

<details>
<summary>9. What happens automatically in the background?</summary>
<br>

The plugin installs several hooks that work without you doing anything:

- **Destructive command protection** – catches dangerous commands (`rm -rf`, `git push --force`, `DROP TABLE`) and shows safer alternatives.
- **Test-first enforcement** – blocks code writes until test scripts exist. Keeps test-driven development honest. Prototype writes are exempt (prototypes are throwaway visual artifacts).
- **Requirement fidelity (code)** – after every code write, checks that the implementation matches your approved plan. Catches scope creep, unplanned files, phases implemented out of order, and new components that duplicate existing ones.
- **Requirement fidelity (plans)** – reviews plan files for requirement drift. If a plan adds features, copy, or scope you didn't ask for, it gets flagged before implementation starts.
- **Prompt injection defense** – watches for manipulation attempts hidden in external content (web pages, files, tool outputs).
- **Design intake validation (tier-scaled)** – blocks screenshot-only Figma work (requires structured design data first), asks clarifying questions about interactions and animations before coding, and gates UI writes until you've Read the required design knowledge (anti-patterns catalog, anti-slop writing rules, design-intent guide, and your project's own `.design-system/system.md` / `.design-engineer-plugin/design/dev/design-system.md` if present). The gate **scales by change size**: trivial single-property swaps (≤5 lines, one CSS / Tailwind property change) skip the heavy ritual; medium changes get a compact 3-field Pre-Flight + a single `/simplify`; large changes (>50 lines or new component) get the full 5-field Pre-Flight + the 3-agent `/simplify` fan-out. So a one-token color swap doesn't pay the cost of a new component build.
- **Process recall** – inside long deterministic workflows (`/product:dev` feature implementation and setup, `/product:design` new-product full pipeline and existing-project abbreviated feature flow, `/product:review` broad audits, `dev-prototyping` storyboard and interactive steps, and `ui-references-moodboard`), Claude renders the workflow's full step list at the top of its next response with the current step marked. Outside those workflows the hook is silent so it doesn't pollute casual chat. Each fire is logged at `~/.claude/cache/de-process-recall.log` for debugging.
- **Background continuation block** – when a flow is waiting on your feedback (every prototype iteration, every implementation phase approval gate), Claude is forbidden from initiating background polling or self-rescheduling (`ScheduleWakeup`, `CronCreate`, `/loop`, background `Task` or `Bash`). Your typing window is not a polling target — your next message is the signal.
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

For example, `/product:review` can scan your product against principles like loss aversion, cognitive load, social proof, the peak-end rule, habit formation, pricing psychology, and dozens more.

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

Five key differences:

1. **Test-first** – the plugin enforces TDD. You can't write production code until failing tests exist. A hook enforces this, not just a suggestion. Prototype writes are exempt — prototypes are throwaway artifacts.
2. **Phased implementation** – plans are broken into phases with dependencies. Claude implements one phase at a time, shows you what it did and what to check, and waits for your approval before continuing. Background polling is forbidden during these waits — Claude won't enter `/loop` or schedule wake-ups while you're typing feedback.
3. **Fidelity enforcement** – after every code write, the plugin checks that the implementation matches your plan. Unplanned files, scope creep, out-of-order phases, and duplicate components all get flagged automatically.
4. **Explicit agent invocation** – the implementation phase uses explicit `Task(test-writer)`, `Task(frontend-implementer)`, `Task(backend-implementer)`, `Task(psych-scanner)`, and `Task(design-system-auditor)` calls instead of prose suggestions, so the model doesn't drift back to inlining everything in the main turn. You get the benefit of specialized agents without remembering to ask for them.
5. **Tiered grounding overhead** – the plugin's design-grounding ritual scales by change size. A one-token color swap classifies as "Trivial" — output one line of WHY, no `/simplify` agent fan-out. A 30-line component refactor classifies as "Medium" — compact 3-field Pre-Flight + single `/simplify`. A new component file or 100-line refactor is "Large" — full 5-field Pre-Flight + the 3-agent `/simplify` fan-out. You don't pay the full ritual cost for small swaps.

The result: you stay in control of what gets built and when, the plugin's specialized helpers actually run, the cost scales with the work, and nothing ships that you haven't reviewed.
</details>

<details>
<summary>14. Does it remember things across sessions?</summary>
<br>

Yes, through Anthropic's documented agent-memory mechanism. The `compound-documenter` agent has `memory: project` set in its frontmatter, which gives it a project-local persistent directory at `.claude/agent-memory/design-engineer-compound-documenter/`. Inside that directory it maintains three files that survive across sessions:

- **`pipeline-state.md`** – which phase you're in, what you've completed, what's next, mode, project type, recent deliverables
- **`key-decisions.md`** – append-only log of cross-cutting choices (like "B2B focus" or "mobile-first") that affect multiple deliverables downstream
- **`stale-dependents.md`** – downstream deliverables that may need refreshing because an upstream changed

When you start a new session, run `/product:document` to invoke the compound-documenter agent – it reads its existing memory, gathers context, and updates the files. The next session reads them and picks up where you left off. The agent-memory directory is project-local and version-controllable, so your team can share state across machines via git.

The plugin also seeds a `project-map.md` (file tree) and `debug-solutions.md` (hard-won fixes) at `.design-engineer-plugin/memory/` in your project for cross-session continuity beyond the design pipeline. These are project-local files (no auto-memory paths involved).
</details>

<details>
<summary>15. What's the component gallery and when does it appear?</summary>
<br>

A single-page visual catalog of every component in your project – every variant rendered with real production styles, source-path labels per entry. Two purposes: catch duplicates that AI tends to silently introduce (5 different Button components doing similar things), and give you one viewport where you can see the full design system at a glance.

It's stack-agnostic. The plugin queries [Context7](https://context7.com) for your specific framework's idiomatic single-page showcase pattern (SwiftUI `#Preview` canvas, Jetpack Compose `@Preview`, Next.js route, vanilla HTML, etc.) and scaffolds accordingly. It imports your real components from their production paths – never copies, never reimplements, never inlines styles. If a state can't be reached via the component's API, that's flagged as a component bug, not patched in the gallery.

The gallery is **transparent infrastructure**: no menu, no permission ask, no "do you want a gallery?" prompt. The first time `frontend-implementer` touches a component (or `design-system-auditor` runs on a project with components), it auto-scaffolds and surfaces a one-line mention so you discover it organically. After that, gallery updates are silent – same as a build artifact.

`design-system-auditor` audits the gallery alongside its other passes at FAIL severity: every component file has an entry, no inline styles, imports resolve, visually-identical entries flagged as duplicates.
</details>

<details>
<summary>16. What's the advisor and how does it work?</summary>
<br>

A dedicated Opus 4.7 sub-agent that other skills consult at strategic checkpoints – implements [Anthropic's advisor strategy](https://claude.com/blog/the-advisor-strategy) plugin-natively. The strategy: a faster executor model consults a higher-intelligence advisor model at high-leverage moments instead of running everything at maximum capability.

The advisor fires automatically at the moments the docs identify as most valuable:

- Before substantive work – before committing to an interpretation, before writing, before declaring an answer
- Before declaring a phase complete – after deliverables are durable (files written, tests run)
- When the executor is stuck – errors recurring, approach not converging
- When considering a change of approach
- Before plan-driven commits if implementation diverged from the approved plan

The advisor returns short numbered course corrections (under 100 words, enumerated steps), and the calling skill applies the advice or uses the docs' "reconcile" pattern when the advice conflicts with empirical evidence ("I found X, you suggest Y, which constraint breaks the tie?").

You don't invoke the advisor directly – it's wired into Plan Mode workflow, all five `/product:*` commands, the dev-github-workflow Mode 1 commit flow, and the meta-orchestrator's major phase transitions.
</details>

<details>
<summary>17. What are living documents?</summary>
<br>

Two layers, separated by concern:

- **Static dependency graph** at `.design-engineer-plugin/dependencies.yaml`. This file is read-only documentation that maps every deliverable to its upstream and downstream relationships. When you revise your problem statement, you can read the graph to see that your target audience, assumptions, and competitor analysis all depend on it – and decide which to refresh.
- **Live progress** in the `compound-documenter` agent's project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/`. The `stale-dependents.md` file there is auto-computed by the agent – it cross-references the static graph against recent edits to surface which downstream deliverables may need a refresh.

So when you change an upstream document, the workflow is: edit the document → run `/product:document` → compound-documenter computes which downstream deliverables are now stale and writes them to `stale-dependents.md`. You read the file (or ask Claude to) and decide what to refresh.

This is honest about what the plugin does and what you do. The plugin documents the relationships and surfaces stale candidates; you decide what's worth refreshing.
</details>

<br>

## All 57 skills

<details>
<summary>Show all</summary>
<br>

All skills run automatically through commands. If you want, you can also call any skill directly (e.g., `/ux-problem-statement`).

**Meta (5)**

| Skill | What it does |
|-------|-------------|
| `meta-setup` | Environment setup and project scaffolding |
| `meta-orchestrator` | Controls the design pipeline |
| `meta-document` | Documents knowledge and maintains context |
| `meta-statusline` | Installs and manages the status line |
| `advisor` | Strategic-checkpoint consult (before substantive work, before declaring done, when stuck) |

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

**UI design (9)**

| Skill | What it does |
|-------|-------------|
| `ui-references-moodboard` | Design references and inspiration gathering |
| `ui-aesthetic-review` | 4-lens craft critique with named design tests |
| `ui-figma-guide` | Figma workflow for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff (advanced – uses figma-console MCP, optional install) |
| `ui-design-system` | Design system architecture and compliance |
| `ui-design-to-code-qa` | Checks if the code matches the design |
| `ui-accessibility` | Accessibility audit (WCAG) |
| `ui-landing-page` | Single-file HTML landing page from StoryBrand narrative |
| `ui-images` | Per-image stock vs AI generation, prompts, folder layout |

**Development (8)**

| Skill | What it does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-starter-prompts` | Starter prompts for new coding sessions |
| `dev-agent-setup` | 4-agent development pipeline setup |
| `dev-status-tracking` | Context management for long-running projects |
| `dev-mcp-setup` | MCP and plugin configuration |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation |
| `dev-component-gallery` | Stack-agnostic single-page component gallery, kept in sync transparently as components change |

</details>

<br>

## Feedback & License

Found a problem? [Open an issue](https://github.com/volomydyr/design-engineer-plugin/issues).

Free and open source – use it however you want ([MIT license](LICENSE)) 🫰.
