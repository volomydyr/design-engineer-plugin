# Changelog

All notable changes to the design-engineer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [1.17.0] – 2026-03-20

### Added

- **Eval overhaul**: 222 new evals (196 trigger tests, 6 functional for uncovered skills, 20 error/edge cases). Added `type` field to all evals (`functional`, `trigger_positive`, `trigger_negative`, `error`). Total coverage: 341 evals across all 49 skills and 6 commands.
- **Negative triggers in descriptions**: 22 skills now include "Do NOT use for..." phrases to prevent cross-triggering, especially among the 14 psychology skill pairs.
- **Error handling sections**: 6 MCP-dependent skills now have "Common Issues" troubleshooting guides per Anthropic's skill guide.
- **Optional frontmatter**: `license: MIT` on all 49 skills. `compatibility` on 6 skills with external dependencies.

### Changed

- **CLAUDE.md Skill Compliance Checklist**: Updated to include `license` and `compatibility` (when applicable) as frontmatter fields.

## [1.16.1] – 2026-03-20

### Changed

- **README rewrite for newcomers**: Prerequisites with install links, getting started guide, how-it-works overview, recommended tools table, collapsible skill reference. Written for someone who may have never used Claude Code before.

## [1.16.0] – 2026-03-20

### Changed

- **Flattened directory structure**: Plugin root is now the repo root per Anthropic's official plugin spec. Removed the unnecessary `plugins/design-engineer/` nesting layer.

### Removed

- 54 eval workspace directories (unused, not referenced by evals.json)
- Root-level duplicate files: README.md (pointer), CHANGELOG.md (subset), AUDIT-REPORT.md (one-time v1.10.1 artifact)
- `.claude-plugin/marketplace.json` (stale marketplace wrapper)

## [1.15.0] – 2026-03-20

### Changed

- **Skill name clarity**: Renamed 20 skills for clear, unambiguous names that are impossible to confuse with each other
- UI skills: `ui-craft-review` → `ui-aesthetic-review`, `ui-implementation-review` → `ui-design-to-code-qa`, `ui-design-references` → `ui-references-moodboard`, `ui-figma-workflow` → `ui-figma-guide`
- Dev skills: `dev-context-management` → `dev-status-tracking`, `dev-agent-pipeline` → `dev-agent-setup`, `dev-kickstart-prompts` → `dev-starter-prompts`
- UX skills: `ux-product-assessment` → `ux-full-review`, `ux-motivation-levels` → `ux-motivation-audit`
- Psych skills: `psych-master-audit` → `psych-full-scan`, `psych-cognitive-basics` → `psych-cognitive-load`, `psych-engagement-motivation` → `psych-engagement-patterns`, `psych-efficiency` → `psych-simplification`, `psych-time-behavior` → `psych-time-perception`
- Psych econ/decision/emotion pairs: `psych-behavioral-economics-core` → `psych-pricing-psychology`, `psych-behavioral-economics-habits` → `psych-habit-formation`, `psych-decision-making-core` → `psych-decision-fundamentals`, `psych-decision-making-advanced` → `psych-decision-persuasion`, `psych-emotional-design-core` → `psych-delight-design`, `psych-emotional-design-advanced` → `psych-emotional-retention`
- Updated all cross-references: pipeline-sequence, commands, agents, evals.json, README, CHANGELOG, AUDIT-REPORT
- Renamed 17 eval workspace directories to match new skill names
- Eval workspace content (transcripts, grading) left as frozen historical artifacts

## [1.14.0] – 2026-03-20

### Changed

- **Standardized terminology across all skills
- `ux-story-panels` → `ux-story-panels` — skill directory, reference files, and all cross-references
- `ux-motivation-audit` → `ux-motivation-audit` — skill directory, reference files, and all cross-references
- Standardized bias audit framework terminology
- Standardized behavior mapping terminology
- Standardized research question terminology
- Standardized experience value terminology
- Standardized motivation framework terminology



## [1.13.1] – 2026-03-19

### Added

- Complete persona example in `persona-framework.md` — shows what a well-written persona looks like with specific, observable details (based on real product design)
- Consolidated StoryBrand canvas view in `storybrand-canvas-template.md` — all 7 elements shown together as one cohesive narrative
- Lean Canvas section in `business-plan-template.md` — one-page business snapshot framework (Ash Maurya)
- TAM/SAM/SOM structured explanation in `business-plan-template.md` — expanded from a passing mention to actionable definitions

### Fixed

- Removed hallucinated CHANGELOG entry "Remotion MCP added to dev-mcp-setup skill" from v1.13.0 (Remotion is unrelated to this plugin; was removed in v1.5.1)

## [1.13.0] – 2026-03-19

### Added

- Story Panels image-generation workflow: Claude crafts story + generates image prompts, user generates in external tool, shares back for review, iterates
- 5 Story Panel example images as reference files (health checkup, test results, doctor appointment, prescription, skin mole)
- Statusline `--watch` mode: user runs in separate terminal for usage limit tracking, Claude never accesses credentials
- Usage monitor instructions in /de:start setup flow

### Removed

- `mental-model-guide.md` — 95% invented content, sourced concepts already in behavior-map-framework.md
- `figma-mcp-guide.md` — redundant with meta-setup environment detection
- `mcp-catalog.md` — redundant with meta-setup environment detection

### Changed

- **12 UX reference files trimmed and improved
- `accessibility-checklist.md` — corrected 56pt tap target to 44pt (WCAG 2.2 standard)
- `de-statusline.js` — removed credential access from Claude-triggered mode; usage fetching now only happens in user-initiated `--watch` mode

### Security

- Statusline no longer accesses macOS Keychain or credentials when triggered by Claude. The `--watch` mode (run by user in separate terminal) is the only code path that touches credentials.

## [1.12.0] – 2026-03-19

### Added

- Auto-memory integration: CLAUDE.md now includes a Memory Management section guiding Claude on when to read/write auto-memory across sessions
- Project Map (`memory/project-map.md`): living file tree with descriptions and "when to read" triggers — replaces ad-hoc filesystem exploration
- Debug Solutions (`memory/debug-solutions.md`): preserves hard-won debugging fixes (3+ attempts) so they survive session boundaries
- Memory initialization in `/de:start`: seeds MEMORY.md, project-map.md, and debug-solutions.md for new and existing projects
- Memory checkpoints in `meta-orchestrator`: reads memory at startup, updates pipeline position and project map after each phase
- Memory checkpoints in `dev-agent-setup`: reads project map and debug solutions before development, saves new fixes during the loop
- Stop hook memory reminder: prints a reminder to update memory at every session end

### Changed

- `meta-orchestrator` Step 0 now reads auto-memory (MEMORY.md + project-map.md) before checking resume state
- `dev-agent-setup` steps renumbered (3→6) to accommodate new memory read step

## [1.11.0] – 2026-03-18

### Added

- Smart entry point: `/de:setup` now detects project state and routes to three paths — returning projects resume, new products get full setup, existing projects get a capability guide with filtered recommendations
- Capability guide: existing project users see all plugin capabilities in plain language, answer diagnostic questions, and get filtered recommendations
- Iterative build enforcement: dev pipeline explicitly requires one-feature-at-a-time development with compound documentation after each cycle
- `/de:document` command: renamed from `/de:compound`, now includes stakeholder communication option (promotes `ux-communicating-decisions`)
- Psychology audit merged into `/de:review`: expanded psychology option with master audit, section deep-dive, and god mode

### Removed

- `/de:research` command (subset of `/de:design` — use design with phase jumping or direct access)
- `/de:statusline` command (status line install handled by `/de:setup`)
- `/de:psych` command (merged into `/de:review` as expanded psychology option)
- Agent templates from `dev-agent-setup` (users copy actual agents from `agents/` directory instead)

### Renamed

- `ui-design-critique` → `ui-aesthetic-review` (distinguishes from implementation review)
- `ui-visual-review` → `ui-design-to-code-qa` (clarifies focus on implementation fidelity)
- `ux-psych-framework` → `ux-motivation-audit` (matches the specific technique: Motivation Levels + Experience Value)
- `meta-compound` → `meta-document` (self-explanatory name)
- `ux-bias-framework` → `ux-bias-audit` (action-oriented: performs a bias audit)

### Changed

- Pipeline Phase 1: removed `ux-big-idea` (was a misinterpretation of the article's concept), pipeline now starts with `ux-problem-statement`
- Pipeline Phase 2: reordered to `ux-behavior-mapping` → `ux-storybrand` → `ux-story-panels` → `ux-business-plan` (behavior mapping is foundational, informs everything after)
- Pipeline Phase 4: moved `ux-psych-framework` here from Phase 2 (needs actual designs to analyze Motivation Levels)
- All UX skills: replaced rigid "4-angle perspectives" and predefined question lists with context-based approach — AI shares brief thoughts based on project knowledge, then asks 7-10 context-adapted questions with source-specific concept guidance
- `/de:setup` description updated to reflect smart entry point behavior
- `/de:design` prerequisite check now uses `.design-engineer.yaml` (was `design-engineer.local.md`)
- Documentation fixes: root README counts, plugin README model counts, CLAUDE.md directory listing, stale eval references

### Removed

- `ux-big-idea` skill (directory, references, all cross-references)
- Parallel group 2a (behavior-mapping and psych-framework no longer parallel)
- Rigid "Share Initial Perspectives" pattern with fixed 4-angle templates across all skills
- Predefined strategic question lists across all skills (replaced with context-based guidance)

## [1.10.1] – 2026-03-18

### Added

- `de-fidelity-hook.js` PostToolUse command hook — injects requirement fidelity reminders after source code writes during active implementation
- Haiku prompt hook for plan files — reviews plans for requirement drift (added features, modified copy, scope expansion) and warns Claude to revert or ask the user
- Requirement Fidelity section in CLAUDE.md defining drift vs. acceptable implementation details

## [1.10.0] – 2026-03-18

### Added

- `de-prompt-injection-hook.js` PostToolUse hook — scans tool outputs for indirect prompt injection attempts across 5 categories (instruction override, role-playing/DAN, encoding/obfuscation, context manipulation, instruction smuggling). 55+ patterns ported from lasso-security/claude-hooks to JavaScript. Warns Claude without blocking. Fail-open design.

## [1.9.3] – 2026-03-18

### Added

- testing-anti-patterns.md reference in dev-agent-setup (5 anti-patterns with code examples, gate functions, common rationalizations, red flags)

### Changed

- test-writer agent: Iron Law, verify RED/GREEN checklists, When Stuck table, Good Tests table, anti-patterns reference link
- CLAUDE.md TDD section: Iron Law, Red Flags list, detailed verify steps, anti-patterns reference

## [1.9.2] – 2026-03-18

### Added

- advanced-animations.md: clip-path patterns, gesture/drag, WAAPI, debugging

### Changed

- motion-design.md: animation decision framework, never scale(0), popover transform-origin, blur masking, @starting-style, spring configuration, asymmetric timing, Framer Motion/CSS-vs-JS performance
- ui-design-critique/skill.md: craft philosophy ("taste is trained", Paul Graham quote)

## [1.9.1] – 2026-03-18

### Changed

- typography.md: added text wrapping (balance/pretty), font smoothing, tabular-nums when-to-use guide
- spatial-design.md: added concentric border radius, expanded optical alignment, shadows as borders, image outlines
- motion-design.md: added interruptible animations, contextual icon animations (exact values), scale on press, skip-animation-on-load, expanded performance section
- interaction-design.md: added minimum hit area with pseudo-element pattern and collision rule

## [1.9.0] – 2026-03-18

### Added

- 8 frontend design reference files in ui-design-critique (typography, color-and-contrast, spatial-design, motion-design, interaction-design, responsive-design, ux-writing, anti-patterns)
- AI Slop Test as 5th named test in ui-design-critique — checks against documented common AI aesthetic patterns
- Cross-references from ui-visual-review to shared design domain references

## [1.8.0] – 2026-03-16

### Added

- Explicit model configuration for all 9 agents and 50 skills
- Model Configuration section in CLAUDE.md with assignment principles
- Model guidance in agent templates for user project customization

### Changed

- 6 agents set to `model: opus`, 3 to `model: sonnet` (was: all `inherit`)
- 36 skills set to `model: opus`, 14 to `model: sonnet` (was: no model field)
- Skill Compliance Checklist updated to require `model:` field

## [1.7.0] – 2026-03-12

### Added

- TDD with Playwright CLI — mandatory test-first development for all code-producing steps
- New `test-writer` agent — writes failing Playwright CLI test scripts before implementation (context-isolated)
- New `de-tdd-hook.js` PreToolUse hook — blocks source code writes when no test scripts exist in `tests/`
- Test archival pattern: active tests in `tests/`, archived to `tests/archive/` after feature completion
- New agent template `test-writer.md` for user project customization

### Changed

- Dev pipeline Phase 3 expanded: test-writer → Red → implementation → Green (was: implementation only)
- Pipeline steps renumbered: 13 → 17 steps across 5 phases
- Pipeline Violations expanded with TDD-specific violations
- REMEMBER FOR EVERY PROMPT expanded to 12 items
- Agent count 8 → 9

## [1.6.1] – 2026-03-12

### Added

- `/simplify` integration — mandatory code quality pass after every code-producing step
- Runs after backend-implementer, after frontend-implementer, and as a final pass before design-system-auditor
- Runs after prototype generation and final iteration in dev-prototyping
- Code quality rule added to CLAUDE.md and CLAUDE.md template

### Changed

- Dev pipeline renumbered: Phase 3 includes /simplify steps, old Phase 4 (Wrap Up) split into Phase 4 (Quality Audit) + Phase 5 (Wrap Up)
- Pipeline Violations updated to include skipping /simplify
- REMEMBER FOR EVERY PROMPT expanded to 11 items

## [1.6.0] – 2026-03-12

### Added

- Plan Mode integration — Claude now uses EnterPlanMode for all non-trivial planning instead of text-based plans
- Project-local plan storage in `plans/` with date-prefixed filenames
- Plan archival to `plans/archive/` when implementation completes
- Structured plan template (summary, architectural decisions, phased breakdown, risk assessment) embedded in CLAUDE.md

### Changed

- Merged `plan-creator` agent into Plan Mode flow — planning now happens in the main conversation with full context, not a sub-agent
- `dev-agent-setup` Phase 2 uses Plan Mode instead of plan-creator sub-agent
- Pipeline development loop updated across orchestrator, commands, and agent references
- Agent count 9 → 8, version 1.5.2 → 1.6.0

### Removed

- `plan-creator` agent (replaced by Plan Mode with structured template)

## [1.5.2] – 2026-03-12

### Changed

- Context monitoring now includes a ready-to-use compact message proactively in the warning — no extra round-trip needed
- Updated compaction guidance in context-engineering-guide, context-survival-guide, meta-compound skill, and CLAUDE.md template to match the proactive pattern

## [1.5.1] – 2026-03-12

### Changed

- Renamed Context7, Figma (official), and Playwright from "MCP" to "plugin" across all skills, commands, and references
- `detect-environment.sh` now reads `enabledPlugins` from `~/.claude/settings.json` and separates output into `Plugins found:` / `MCPs found:`
- Simplified fragile Figma plugin detection logic
- `.design-engineer.yaml` template: split `mcps:` block into `plugins:` and `mcps:` sections, `figma_mcp:` → `figma:`
- `setup-checklist.md`: `Context7 MCP` → `Context7 plugin`, `Playwright MCP` → `Playwright plugin`, `Figma with MCP` → `Figma with plugin`
- `mcp-catalog.md`: section headers updated, `Essential MCPs` → `Essential Plugins`, `Recommended MCPs` → `Recommended`

### Removed

- Remotion MCP from `dev-mcp-setup` skill and `mcp-catalog.md` (unrelated to design engineering)
- "Specialized MCPs" category from catalog

## [1.5.0] – 2026-03-12

### Added

- New `de-safety-hook.js` PreToolUse hook — context-aware protection against destructive Bash commands
  - Filesystem: blocks `rm -rf`, `chmod 777`
  - Git: blocks force push, `reset --hard`, `clean -f`, `checkout --`, `branch -D`, `stash drop/clear`
  - Database: blocks `DROP TABLE/DATABASE/SCHEMA`, `TRUNCATE`, `DELETE` without `WHERE`
  - Environment: warns on `git add .env` (staging secrets)
  - Context-aware: allows patterns in data context (grep, echo, cat, etc.)
  - Shows safer alternatives alongside every block
  - Fail-open design with debug logging to `~/.claude/cache/de-safety.log`

### Changed

- Updated hooks description to include safety

## [1.4.0] – 2026-03-12

### Added

- New `de-statusline.js` hook — status line showing model, usage limits (5h/7d with reset times), context bar, and pipeline progress
- New `meta-statusline` skill — manages status line installation, uninstallation, and status checking
- New `/de:statusline` command with install | uninstall | status subcommands
- Status line question added to `/de:setup` flow (new Step 6)
- Bridge file compatibility with GSD context monitor (`/tmp/claude-ctx-{session}.json`)
- Background API fetch for Anthropic usage data with 60s cache

### Changed

- `meta-setup` now includes status line installation option (Steps 6-8 renumbered from 5-7)
- Skill count 49 → 50, command count 8 → 9

## [1.3.0] – 2026-03-11

### Added

- New `ui-figma-handoff` skill — automates Figma design structuring (components, tokens, variables, styles) and dev handoff preparation (annotations, sections, connectors, dev status) using Figma Console MCP
- Three new reference files: `figma-structuring-guide.md` (7-phase methodology), `figma-handoff-guide.md` (handoff preparation process), `figma-console-helpers.md` (code snippets for Figma Console MCP)
- Code-to-Figma import guidance in `dev-prototyping` and `ui-figma-guide`
- `figma-handoff` deliverable in dependency graph with upstream/downstream tracking

### Changed

- Rewrote `figma-for-ai-dev.md` — no longer says "skip components and tokens"; now recommends automating with Figma Console MCP when available, with minimal approach as fallback
- Updated `figma-mcp-guide.md` — renamed to Figma Integration Guide, added code-to-Figma import capability and `ui-figma-handoff` reference
- `ui-figma-guide` Step 3 updated: conditional guidance based on Figma Console MCP availability
- Phase 4 pipeline: `ui-figma-handoff` added as optional step after `ui-figma-guide`
- Standardized Figma tool names across all files: "Figma plugin" (official) and "Figma Console MCP"
- Skill count 48 → 49, UI Design category 6 → 7

## [1.2.0] – 2026-03-11

### Added

- New `/de:prototype` command – 8th top-level command for standalone HTML prototype generation (new products, features, or redesigns)
- Rewrote `dev-prototyping`: question-based context gathering (planning docs, existing codebase, Figma designs, or just an idea), generates single-file HTML prototypes in Claude Code, applies design intent and starter values
- Added `prototype` deliverable to dependency graph with full upstream/downstream tracking
- Added "HTML prototype" as review target in `ui-design-critique`, `ui-visual-review`, and `ui-accessibility`
- Added `references/multi-session-workflow.md` to `dev-status-tracking` with tool-agnostic session management rules

### Changed

- Phase 4 pipeline restructured: `dev-prototyping` now runs sequentially AFTER `ui-references-moodboard` and BEFORE `ui-figma-guide` (was parallel with figma-workflow)
- `ui-figma-guide` now depends on prototype deliverable (prototype informs which key screens to design in Figma)
- `dev-prototyping` removed from `/de:dev` command (now accessed via `/de:prototype` or pipeline)
- Cleaned up ~17 "Claude Projects" references across 12 files to be tool-agnostic or Claude Code-specific

### Removed

- Removed `dev-claude-projects` skill (content merged into `dev-status-tracking` and `meta-compound`)
- Removed parallel-group 4a from pipeline sequence
- Skill count 49 → 48, Development category 8 → 7, Command count 7 → 8

## [1.1.1] – 2026-03-11

### Added

- Session pause/resume – Stop hook now writes resume state to `.design-engineer.yaml`; orchestrator detects it on startup and offers to continue where you left off
- Progress routing – orchestrator shows phase completion summary from `.dependencies.yaml` before asking project state
- Parallel group annotations in pipeline sequence for 4 skill groups (Phases 2, 4, 5) with execution guidance for god/guided modes
- AskUserQuestion preview mockups in `ui-references-moodboard` (design feel), `ui-design-system` (depth strategy), and `ux-information-architecture` (navigation model)
- Context monitoring instruction in CLAUDE.md – suggests compaction at ~90% usage with state-preserving compact message
- Model recommendations in orchestrator – suggests Opus for planning phases, asks user preference (Sonnet default) at Phase 5 transition
- Preview usage rule added to Skill Compliance Checklist

### Changed

- `meta-orchestrator` startup sequence now checks for resume state (Step 0) before asking mode/project state
- `meta-orchestrator` reads `.dependencies.yaml` for automatic progress summary, skipping redundant project state question
- `meta-orchestrator` handles parallel groups during pipeline execution (god mode: simultaneous agents; guided mode: user choice)
- `session_dep_summary.py` enhanced to write resume state in addition to printing dependency summary

## [1.1.0] – 2026-03-10

### Added

- New `ui-design-critique` skill with 4-lens craft critique framework (Composition, Craft, Content, Structure) and 4 named tests (Swap, Squint, Signature, Token)
- Design intent guide reference for `ui-references-moodboard` with "Where Defaults Hide" philosophy, Intent-First framework, Product Domain Exploration, and WHY checkpoint
- Starter values reference for `ui-design-system` with spacing, typography, text hierarchy, border progression, surface elevation, depth strategies, and shadow scales
- Prompt templates reference for `ui-design-system` with 6 curated task-specific prompts
- Design system persistence mechanism (`.design-system/system.md` save/load)
- UX non-negotiables check in `ui-visual-review` (6 fundamental usability principles)
- UX pattern issues section in `ui-visual-review` common issues catalog

### Changed

- `ui-references-moodboard` expanded from reference collection to full design thinking skill
- `ui-visual-review` adds UX non-negotiables check before visual audit
- `ui-design-system` checks for saved decisions on startup and offers persistence on completion
- Skill count 48 → 49, UI Design category 5 → 6

## [1.0.0] – 2026-03-10

### Added

- Initial plugin scaffold with marketplace and plugin manifests
- 7 entry point commands using `de:` namespace (`de:setup`, `de:design`, `de:research`, `de:psych`, `de:dev`, `de:review`, `de:compound`)
- 48 hidden skills across 6 categories:
  - 3 meta skills (setup, orchestrator, compound)
  - 10 UX research skills (big-idea through information-architecture)
  - 8 UX design skills (story-panels, behavior-mapping, bias-audit, journey-mapping, ethics-review, product-assessment, and more)
  - 14 psychology skills covering 100 UX laws across 10 sections (cognitive basics, visual perception, decision-making, engagement, emotional design, efficiency, behavioral economics, social influence, cognitive biases, time and behavior)
  - 5 UI design skills (design-references, figma-workflow, design-system, visual-review, accessibility)
  - 8 development skills (claude-projects, claude-md, kickstart-prompts, agent-pipeline, context-management, mcp-setup, github-workflow, prototyping)
- 9 specialized agents (context-analyzer, plan-creator, backend-implementer, frontend-implementer, design-system-auditor, psych-scanner, ux-researcher, deliverable-writer, compound-documenter)
- 80 reference files with full adapted content from source materials
- 2 hook scripts for deliverable dependency tracking (PostToolUse and Stop hooks)
- Context7 MCP server integration (bundled)
- Dependency graph system with `.dependencies.yaml` tracking
- God mode and Guided mode for commands
- Eval test suite with realistic test prompts
