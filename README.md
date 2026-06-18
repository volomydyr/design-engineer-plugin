> **v7.0.0** – see the [changelog](CHANGELOG.md) for what's new.

<img src="logo.svg" width="200" alt="Design Engineer" />

# Design Engineer Plugin

🇺🇦  Плагін для Claude Code, заснований на технічних статтях і практичних прикладах з [volomydyr.com](https://volomydyr.com). Це як швейцарський ніж для дизайн-інженерів: ідеація, дослідження, психологія, прототипування та розробка – усе в одному зручному й легкому у використанні інструменті.

Пишете команду `/design-engineer:launch`, плагін розуміє, на якому ви етапі – чи починаєте з нуля, чи продовжуєте створення продукту, чи хочете скористатися ним для існуючого комерційного проекту. Детальну інструкцію та повний опис можна знайти нижче англійською.

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
/design-engineer:launch
```

This is the only command you need to remember. It figures out your situation – new product, returning project, or existing codebase – and takes you where you need to go. The plugin also checks for recommended tools during setup and helps install anything that's missing.

<br>

## How it works

9 commands, 53 skills, 8 agents, and 3 bundled integrations (Context7 for docs, Figma MCP for Dev Mode connection, Playwright for browser testing). Most commands work in two ways – **guided mode** (step-by-step with user approval at every stage) or **autopilot** (autonomous with minimal input).

You only need to remember one slash command – `/design-engineer:launch`. It figures out where you are (starting from scratch, picking up where you left off, or working on an existing product) and runs the right commands in the right order for you. The list below is just so you can see what's available.

| Command | What it does |
|---------|-------------|
| `/design-engineer:launch` | Detects your project state, no matter if it's an existing product or something you want to build from scratch |
| `/design-engineer:discovery` | Runs the design workflow – discovery, strategy, validation |
| `/design-engineer:prototype` | Generates clickable HTML prototypes from your idea, context docs, references, or existing designs |
| `/design-engineer:development` | Step-by-step development process – CLAUDE.md, agent pipeline, context management, TDD, implementation |
| `/design-engineer:review` | Reviews your work – visual quality, accessibility, psychology (100+ principles), design system, ethics |
| `/design-engineer:document` | Stores decisions, learnings, and project state for future |
| `/design-engineer:stop` | Saves progress, even mid-activity – you can always pick up later |
| `/design-engineer:tidy` | Wipes disposable working artifacts (Playwright captures, intermediate drafts, scratch files) before commit |
| `/design-engineer:help` | Shows all available commands, current project status, and mode |

<br>

## FAQ

### General

<details>
<summary>1. What does this plugin do that Claude Code doesn't do on its own?</summary>
<br>

Claude Code is a general-purpose AI coding tool. It can write code, answer questions, and run commands.

This plugin adds **a product design methodology on top of it** – 53 skills that teach you how to think about problems, users, psychology, and design before you write a single line of code. It also adds:

- **Method, not hooks** – grounding, anti-drift, and test-first discipline are written into the skills and agents that own them, so the plugin guides the work without deny-hooks fighting the tool. Claude Code's auto-mode already covers destructive-command and prompt-injection safety.
- **Spec-driven design** – before implementation, a structured design spec pins down every component grounded in your real tokens and existing components, so the build reuses what exists instead of reinventing it, and matches what was agreed. The implementer builds to the spec and the design-system auditor verifies against it.
- **Specialized agents** that handle specific parts of the workflow, with premium reasoning concentrated on planning and final quality rather than spread across every step
- **A knowledge base** of 100+ psychology principles, design frameworks, and animation references that Claude draws from when reviewing your work
- **Power-user depth when it earns its cost** – the few high-value moments that need many agents (deep design exploration, per-screen spec authoring, competitor analysis, per-page audits) can fan out through Claude Code's workflows feature, with a single-pass inline fallback when workflows are off. At verifiable build moments the plugin also hands you a ready-to-paste `/goal` so Claude loops until your acceptance criteria hold
- **A task-driven iterate flow for products that already exist** – whether it's a commercial codebase the plugin didn't build or a plugin-built product that has shipped, you can just say what you want to work on, or pick a starting point: act on feedback, redesign a design, explore a concept, or audit a design. Each starting point is a conversation, not a button that fires off machinery. The plugin asks what you actually need, reads your project context, then reaches for the right pieces (a skill, a workflow, an agent, a spec, or `/goal`) matched to the task. Most real work is a scoped edit to something that already exists, so the flow leads with a free-form prompt and a reliable scoped-edit loop: restate the exact element and file, change it, verify in the browser, open a focused PR

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

Both, and the existing-project path is first-class. `/design-engineer:launch` detects your situation:

- **New product** – walks you through the full pipeline from problem definition to code. Once that pipeline finishes and the product ships, future sessions on it open the iterate flow below instead of looping back to the start.
- **Returning project** – shows where you left off and lets you resume, jump to a different phase, or browse everything the plugin can do.
- **Existing project** – auto-detects your design system, brand docs, written specs, shipped UI, and component count from the codebase, then asks you about off-repo references (Figma file, Notion docs, Linear tracker, external design-system page like Storybook / Zeroheight). All of that gets stored as project context. From there you land in the **iterate flow**: a fast, task-driven way to work on a product that already exists. It leads with one line – "tell me what you want to work on, or pick a starting point" – and four starting points: act on feedback, redesign a design, explore a concept, audit a design. Each starting point is a conversation, not a trigger: the plugin asks what you actually need, reads your stored project context, then dispatches the right pieces matched to the task (clarify first, dispatch after). Most work here is a scoped edit to something that already exists, so a free-form prompt plus a reliable scoped-edit loop is the workhorse, with skills, workflows, agents, the spec layer, and `/goal` brought in when the change warrants them. From there:
  - The 9 ux-* skills that assume a blank slate (StoryBrand, problem statement, target audience, business plan, competitor analysis, assumptions, story panels, user interviews, behavior mapping) respect what already exists – they ask "use as-is, refine, or re-run from scratch" instead of regenerating.
  - **Spec polish routing** – when you run `/design-engineer:discovery` for a new feature, the first question is "Minimal feature spec vs Full feature flow", with explicit descriptions of what each entails. The minimal branch produces a one-page spec that respects your existing brand voice; the full branch walks you through MVP requirements + IA before implementation. No more guessing which depth the plugin will pick.
  - **Optional-depth multi-select** – inside the full feature flow, before implementation kicks off, you pick which optional audits to run as a multi-select: Brief problem statement, Psychology audit (`psych-decision-fundamentals` + `psych-cognitive-load`), Figma comparison (`ui-figma-guide`), Design-system check (`ui-design-system`). Choices are persisted to your project config and read by `/design-engineer:development` so the implementation phase reflects them inline.
  - **Conditional Figma hand-off** – if Figma is connected and you didn't already pick "Figma comparison" in the optional-depth step, the flow asks once before handing off to dev whether to pull structured Figma data first.
  - **Proactive defaults in `/design-engineer:development`** – if your established project is missing CLAUDE.md, the plugin scaffolds it silently from your existing components (no question asked). If `references.md` is missing on a project that already has shipped UI, you get one 2-option question – "Reuse existing UI as the visual reference" or "Provide image references" (which runs the moodboard skill with curated reference previews and sectional Playwright captures). The old 4-option fast-track / full / skip prompt is gone.
  - `/design-engineer:review audit` runs a page-by-page audit of a deployed app (Playwright captures each page, four review agents run, you add your professional feedback alongside the AI findings, deliverables saved per page).
  - `/design-engineer:discovery feature-spec` produces a truly minimal spec for adding one feature to an established product – no StoryBrand, no business-plan rewrite, just respects the existing brand voice. Reachable either by typing the literal `feature-spec` argument or by picking "Minimal feature spec" in the spec-polish routing question.
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

- **`/design-engineer:launch`** – always start here. It detects your situation and routes you.
- **`/design-engineer:discovery`** – when you need to work through the design process: research, strategy, planning, validation.
- **`/design-engineer:prototype`** – when you want a clickable HTML prototype from an idea or existing designs.
- **`/design-engineer:development`** – when you're ready to build: CLAUDE.md generation, agent pipeline setup, context management, test-first development, AI-assisted implementation.
- **`/design-engineer:review`** – when you want to review what you've built: visual quality, accessibility, psychology, design system compliance, ethics.
- **`/design-engineer:document`** – when you need to save decisions, capture learnings, or communicate with stakeholders. Also auto-purges disposable working artifacts at every phase boundary.
- **`/design-engineer:stop`** – when you want to pause mid-activity and save your progress. Pick up later with `/design-engineer:launch`.
- **`/design-engineer:tidy`** – wipes disposable working artifacts under `.design-engineer-plugin/temporary/` (Playwright captures, intermediate drafts, scratch files). Use before commit, or anytime the working tree feels noisy. `/design-engineer:document` does the same purge automatically at every phase boundary; this is the manual mid-session version.
- **`/design-engineer:help`** – shows all available commands, your current project status, and mode. Works anywhere.

You only need to remember `/design-engineer:launch`. It guides you to everything else.

There's also one small utility command, `/design-engineer:mute-unmute-sound`, that toggles plugin sound notifications on or off without uninstalling. Useful for meetings, libraries, or anywhere you want temporary silence. It's not part of the main 9 because you'll touch it once or twice across the lifetime of the plugin, not as part of any workflow.
</details>

<details>
<summary>7. What are skills and how are they different from commands?</summary>
<br>

**Commands** are the 9 entry points you type (like `/design-engineer:discovery`).

**Skills** are the 53 specialized workflows that commands orchestrate behind the scenes. Each skill does exactly one thing – write a problem statement, audit cognitive load, create a design system, run a bias review.

You don't need to call skills directly. Commands handle the orchestration. But if you want to run a specific skill on its own, you can (e.g., `/ux-problem-statement` or `/psych-cognitive-load`).
</details>

<details>
<summary>8. What are agents and what do they do?</summary>
<br>

8 specialized personas that handle specific parts of the workflow:

- **ux-researcher** – runs research activities
- **psych-scanner** – checks your designs against 100+ psychology principles
- **design-system-auditor** – checks your code against design system rules and audits the component gallery
- **backend-implementer** – builds backend features
- **frontend-implementer** – builds frontend with pixel-perfect design matching, keeps the component gallery in sync
- **test-writer** – writes failing tests before implementation, available when you want test-first discipline
- **compound-documenter** – records decisions and maintains context across sessions
- **advisor** – an optional reviewer that skills can consult at strategic checkpoints (before substantive work, before declaring done, when stuck) – implements [Anthropic's advisor strategy](https://claude.com/blog/the-advisor-strategy) plugin-natively

Agents are dispatched when the work would flood the main context; for quick, iterative work the model does it inline. You don't call them directly.
</details>

<details>
<summary>9. What happens automatically in the background?</summary>
<br>

The plugin installs a handful of advisory and mechanical hooks that work without you doing anything. They never hard-block your work – grounding, anti-drift, and test-first discipline are written into the skills and agents instead, and destructive-command and prompt-injection safety are handled by Claude Code's auto-mode.

- **Project-state injection** – on every message, tells Claude which project you're in and whether the plugin has been set up yet, so `/design-engineer:launch` always routes correctly.
- **Design intake (Figma)** – when a Figma screenshot is about to be used, nudges Claude to pull structured design data first, then asks clarifying questions about interactions and animations the static mockup can't show before any code gets written.
- **Playwright path hygiene** – keeps Playwright captures (screenshots, snapshots, traces) inside the plugin's canonical folders instead of cluttering your project root.
- **Dependency tracking** – when you change a deliverable, flags which other documents might need updating.
- **Session summary** – when you end a session, generates a summary of what changed and which dependent documents might need review.
- **Post-compact recovery** – after a context compaction, re-injects the project state so the session keeps its bearings.
- **Sound notifications** – a chime when a session completes or needs your attention (toggle with `/design-engineer:mute-unmute-sound`).

Two behaviors are enforced as method rather than hooks. **Bot-block and auth-wall fallbacks**: when Playwright hits a Cloudflare challenge, captcha, "verify you are human" wall, or a signup/login gate, Claude stops and asks you for help via AskUserQuestion (you can paste back what you see, flip a blocker setting, provide test credentials, opt in to temp-email throwaway-account signup, or skip with a flag in the deliverable's sources-consulted list) instead of silently dropping the URL. **Background continuation block**: when a flow is waiting on your feedback, Claude won't initiate background polling or self-rescheduling – your next message is the signal.
</details>

<details>
<summary>9.1. Where does everything the plugin creates get stored?</summary>
<br>

Everything the plugin produces lives under a single umbrella folder: `.design-engineer-plugin/`. The project root holds only your actual product code.

```
.design-engineer-plugin/
├── design/
│   ├── foundation/    problem statement, target audience, assumptions, storybrand, business plan
│   ├── research/      competitor analysis, user interviews
│   ├── planning/      MVP requirements, information architecture
│   ├── exploration/   bias audit, behavior map, journey map, ethics review, story panels, references
│   ├── psychology/    psych-* outputs
│   ├── reviews/       aesthetic review, design-to-code QA, audits
│   ├── dev/           CLAUDE.md draft, agent setup, MCP setup, status tracking
│   └── features/      per-feature spec dirs
├── prototype/         prototype.html, landing-page.html
├── plans/             implementation plans (active + archive)
├── memory/            project-map.md, debug-solutions.md
├── temporary/         disposable working files (gitignored, auto-purged at phase boundaries)
├── config.yaml        plugin state
└── dependencies.yaml  static dependency graph

.claude/agent-memory/design-engineer-compound-documenter/
                       cross-session pipeline state (Anthropic-managed via memory: project)
```

One folder is gitignored:
- `.design-engineer-plugin/temporary/` — Playwright debug captures, intermediate analysis dumps, exploratory drafts. Auto-purged at every phase boundary by `/design-engineer:document`. Manual purge: `/design-engineer:tidy`.

Everything else commits with the repo. If you upgraded from v5.4.x and have files at old paths (`design/`, `prototype/`, `plans/` at the project root), see the migration note in CHANGELOG v5.5.0 — it's a 3-line `mv` sequence.
</details>

<details>
<summary>9.2. What if a competitor's site blocks the browser or requires sign-up?</summary>
<br>

Common during competitor analysis. Two related fallbacks, both opt-in per competitor (consent doesn't transfer between sites):

- **Bot-block fallback** (Cloudflare, captcha, "verify you are human", 403/429) — Claude detects the block via `browser_snapshot`, then surfaces an `AskUserQuestion` with three options: you open the URL in your own browser and paste back what you see, you flip a blocker setting and ask Claude to retry, or you skip the URL and Claude flags it as `[BLOCKED — skipped]` in the deliverable's sources-consulted list. Never silently falls back to shallow WebSearch snippets.

- **Auth-wall fallback** (signup/login required to see the actual product) — Claude detects when `browser_navigate` redirects to `/login` or `/signup`, then surfaces four options: provide existing test credentials, sign up yourself and share a session, opt in to a temp-email throwaway-account signup (Claude walks Playwright through it using `mail.tm` / `mailinator` / similar — with the ToS implications named in the question), or skip with `[AUTH-WALLED — gated UI not analyzed]` in the deliverable. Per-competitor consent — never blanket. The plugin does not auto-sign-up without explicit per-competitor opt-in.

Either way, the deliverable is honest about coverage gaps when URLs were blocked or skipped — a `Sources consulted` appendix lists every URL Claude visited (and what was extracted), with `[BLOCKED]` / `[AUTH-WALLED]` flags where relevant.
</details>

### Design & knowledge

<details>
<summary>10. What's the psychology component?</summary>
<br>

11 psychology skills covering 100+ behavioral principles from cognitive science, behavioral economics, and product psychology. Every principle comes with:

- Specific design applications
- Good and bad examples
- Edge cases and constraints

For example, `/design-engineer:review` can scan your product against principles like loss aversion, cognitive load, social proof, the peak-end rule, habit formation, pricing psychology, and dozens more.

Psychology is built into the review process from the ground up, so it shows up where it matters – during design decisions, not as a separate step.
</details>

<details>
<summary>11. How does the plugin handle Figma?</summary>
<br>

Through the bundled official Figma MCP:

- **Read** – pulls design data from Figma Dev Mode (tokens, spacing, colors, component structure) so Claude implements from real specs, not screenshots.
- **Write** – captures web pages and localhost into Figma, creates new Figma files, generates design system rules for your codebase, and executes Figma Plugin API operations (variables, tokens, components, styles, annotations) through its `use_figma` executor. This powers the advanced `ui-figma-handoff` structuring workflow.

The plugin enforces structured design intake – Claude must get proper design data and ask clarifying questions about interactions and animations before implementing anything.

The official Figma MCP is bundled and the only Figma integration the plugin needs. Power users who already run a separate community Figma MCP with dedicated linting or parity tools can keep using it alongside, but nothing in the plugin requires one.

Figma is not required at all. The plugin works without it, but the design-to-code workflow is significantly better with the bundled Figma MCP connected.
</details>

<details>
<summary>12. What's the knowledge base behind it?</summary>
<br>

~17,000 lines of reference material across 100+ files – structured frameworks adapted from the author's [technical articles and practical examples](https://volomydyr.com), along with established sources in psychology, behavioral economics, and design methodology.

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

Four key differences:

1. **Test-first when you want it** – the `test-writer` agent writes failing tests before implementation, so you can keep test-driven development honest. It's a method the development pipeline follows, not a hard hook-block, and prototypes are exempt since they're throwaway artifacts.
2. **Phased implementation** – plans are broken into phases with dependencies. Claude implements one phase at a time, shows you what it did and what to check, and waits for your approval before continuing. Background polling is forbidden during these waits — Claude won't enter `/loop` or schedule wake-ups while you're typing feedback.
3. **Plan fidelity by method** – the development skills tell Claude to implement only the current phase, reuse existing components, and check each phase against the plan's checklist before presenting it, so scope creep, unplanned files, and duplicate components get caught without a deny-hook fighting your edits.
4. **Specialized agents when they help** – the implementation phase reaches for `test-writer`, `frontend-implementer`, `backend-implementer`, `psych-scanner`, and `design-system-auditor` when the work would flood the main context, and iterates inline when it wouldn't. You get the benefit of specialized agents without remembering to ask for them, and without paying for a dispatch on every small change.

The result: you stay in control of what gets built and when, the plugin's specialized helpers run when they earn their cost, and nothing ships that you haven't reviewed.
</details>

<details>
<summary>14. Does it remember things across sessions?</summary>
<br>

Yes, through Anthropic's documented agent-memory mechanism. The `compound-documenter` agent has `memory: project` set in its frontmatter, which gives it a project-local persistent directory at `.claude/agent-memory/design-engineer-compound-documenter/`. Inside that directory it maintains three files that survive across sessions:

- **`pipeline-state.md`** – which phase you're in, what you've completed, what's next, mode, project type, recent deliverables
- **`key-decisions.md`** – append-only log of cross-cutting choices (like "B2B focus" or "mobile-first") that affect multiple deliverables downstream
- **`stale-dependents.md`** – downstream deliverables that may need refreshing because an upstream changed

When you start a new session, run `/design-engineer:document` to invoke the compound-documenter agent – it reads its existing memory, gathers context, and updates the files. The next session reads them and picks up where you left off. The agent-memory directory is project-local and version-controllable, so your team can share state across machines via git.

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

An optional sub-agent that skills can consult for a strategic second opinion – implements [Anthropic's advisor strategy](https://claude.com/blog/the-advisor-strategy) plugin-natively. The strategy: an executor consults a reviewer at high-leverage moments instead of running everything at maximum scrutiny.

The advisor is available at the moments the docs identify as most valuable:

- Before substantive work – before committing to an interpretation, before writing, before declaring an answer
- Before declaring a phase complete – after deliverables are durable (files written, tests run)
- When the executor is stuck – errors recurring, approach not converging
- When considering a change of approach
- Before plan-driven commits if implementation diverged from the approved plan

The advisor returns short numbered course corrections (under 100 words, enumerated steps), and the calling skill applies the advice or uses the docs' "reconcile" pattern when the advice conflicts with empirical evidence ("I found X, you suggest Y, which constraint breaks the tie?").

The advisor is optional, not a required checkpoint – Claude consults it when a plan is large or the path forward is genuinely uncertain, and skips it otherwise. You don't invoke it directly.
</details>

<details>
<summary>17. What are living documents?</summary>
<br>

Two layers, separated by concern:

- **Static dependency graph** at `.design-engineer-plugin/dependencies.yaml`. This file is read-only documentation that maps every deliverable to its upstream and downstream relationships. When you revise your problem statement, you can read the graph to see that your target audience, assumptions, and competitor analysis all depend on it – and decide which to refresh.
- **Live progress** in the `compound-documenter` agent's project-local memory at `.claude/agent-memory/design-engineer-compound-documenter/`. The `stale-dependents.md` file there is auto-computed by the agent – it cross-references the static graph against recent edits to surface which downstream deliverables may need a refresh.

So when you change an upstream document, the workflow is: edit the document → run `/design-engineer:document` → compound-documenter computes which downstream deliverables are now stale and writes them to `stale-dependents.md`. You read the file (or ask Claude to) and decide what to refresh.

This is honest about what the plugin does and what you do. The plugin documents the relationships and surfaces stale candidates; you decide what's worth refreshing.
</details>

<br>

## All 53 skills

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

**Psychology (11)**

| Skill | What it does |
|-------|-------------|
| `psych-full-scan` | Broad scan across 100+ principles, routes to deep-dives |
| `psych-cognitive-load` | Cognitive load, progressive disclosure, recognition over recall |
| `psych-visual-perception` | Gestalt principles, visual hierarchy, attention |
| `psych-decision-fundamentals` | Loss aversion, anchoring, scarcity, social proof, decoy effect, framing |
| `psych-engagement-patterns` | Curiosity gap, variable reward, goal gradient |
| `psych-delight-design` | Peak-end rule, delighters, endowment effect, storytelling, emotional design |
| `psych-simplification` | Serial position, picture superiority, chunking |
| `psych-pricing-psychology` | Sunk cost, reciprocity, pricing perception, commitment, consistency, reactance |
| `psych-social-influence` | Social proof, authority, liking |
| `psych-cognitive-biases` | Availability heuristic, negativity bias |
| `psych-time-perception` | Familiarity bias, shaping, aha moment |

**UI design (11)**

| Skill | What it does |
|-------|-------------|
| `frontend-design` | Distinctive, production-grade frontend interfaces that avoid generic AI aesthetics |
| `ui-references-moodboard` | Design references and inspiration gathering |
| `ui-aesthetic-review` | 4-lens craft critique with named design tests |
| `ui-figma-guide` | Figma workflow for AI-assisted development |
| `ui-figma-handoff` | Figma design structuring and dev handoff (advanced – uses the bundled Figma MCP) |
| `ui-design-system` | Design system architecture and compliance |
| `design-spec` | Per-screen design spec grounded in real tokens and components, built to verbatim and verified against |
| `ui-design-to-code-qa` | Checks if the code matches the design |
| `ui-accessibility` | Accessibility audit (WCAG) |
| `ui-landing-page` | Single-file HTML landing page from StoryBrand narrative |
| `ui-images` | Per-image stock vs AI generation, prompts, folder layout |

**Development (8)**

| Skill | What it does |
|-------|-------------|
| `dev-claude-md` | CLAUDE.md generation and maintenance |
| `dev-starter-prompts` | Starter prompts for new coding sessions |
| `dev-agent-setup` | 3-agent development pipeline setup |
| `dev-status-tracking` | Context management for long-running projects |
| `dev-mcp-setup` | MCP and plugin configuration |
| `dev-github-workflow` | GitHub workflow for designers |
| `dev-prototyping` | Single-file HTML prototype generation |
| `dev-component-gallery` | Stack-agnostic single-page component gallery, kept in sync transparently as components change |

**Iterate (1)**

| Skill | What it does |
|-------|-------------|
| `feedback-to-todos` | Turns feedback from a video, notes, messages, or a transcript into one grounded, cited to-do list for the iterate flow's scoped-edit loop |

</details>

<br>

## Feedback & License

Found a problem? [Open an issue](https://github.com/volomydyr/design-engineer-plugin/issues).

Free and open source – use it however you want ([MIT license](LICENSE)) 🫰.
