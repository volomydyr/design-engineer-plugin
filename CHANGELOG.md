# Changelog

All notable changes to this marketplace will be documented in this file.

## [1.8.0] – 2026-03-16

### Added

- Explicit model configuration across all agents and skills (42 Opus, 17 Sonnet)

## [1.7.0] – 2026-03-12

### Added

- TDD with Playwright CLI — test-writer agent + TDD enforcement hook for mandatory test-first development
- Test archival pattern (`tests/` → `tests/archive/`) mirroring plan archival

### Changed

- Dev pipeline expanded with Red/Green TDD cycle (13 → 17 steps)

## [1.6.1] – 2026-03-12

### Added

- `/simplify` integration — mandatory code quality pass after every code-producing step in dev pipeline and prototyping flows

### Changed

- Dev pipeline renumbered to include /simplify steps (Phase 4: Quality Audit, Phase 5: Wrap Up)

## [1.6.0] – 2026-03-12

### Added

- Plan Mode integration — Claude now uses EnterPlanMode for all non-trivial planning instead of text-based plans
- Project-local plan storage in `plans/` with date-prefixed filenames
- Plan archival to `plans/archive/` when implementation completes
- Structured plan template (summary, architectural decisions, phased breakdown, risk assessment) embedded in CLAUDE.md

### Changed

- Merged `plan-creator` agent into Plan Mode flow — planning now happens in the main conversation with full context, not a sub-agent
- `dev-agent-pipeline` Phase 2 uses Plan Mode instead of plan-creator sub-agent
- Pipeline development loop updated across orchestrator, commands, and agent references
- Agent count 9 → 8, version 1.5.2 → 1.6.0

### Removed

- `plan-creator` agent (replaced by Plan Mode with structured template)

## [1.5.2] – 2026-03-12

### Changed

- Context monitoring now suggests compacting with a ready-to-use compact message proactively — no extra round-trip

## [1.5.1] – 2026-03-12

### Changed

- Renamed Context7, Figma (official), and Playwright from "MCP" to "plugin" across all skills, commands, and references
- `detect-environment.sh` reads `enabledPlugins` and separates output into plugins vs MCPs
- Removed Remotion MCP (unrelated to design engineering)

## [1.5.0] – 2026-03-12

### Added

- New `de-safety-hook.js` PreToolUse hook — context-aware protection against destructive Bash commands
- Blocks rm -rf, git force push, DROP TABLE, git add .env, and more with safer alternatives
- Fail-open design: any hook error allows the command through

## [1.4.0] – 2026-03-12

### Added

- New `de-statusline.js` hook — status line with model, usage limits, context bar, and pipeline progress
- New `meta-statusline` skill and `/de:statusline` command
- Status line installation integrated into `/de:setup`

## [1.3.0] – 2026-03-11

### Added

- New `ui-figma-handoff` skill — automates Figma design structuring and dev handoff preparation using Figma Console MCP
- Code-to-Figma import guidance in `dev-prototyping` and `ui-figma-workflow`
- `figma-handoff` deliverable in dependency graph

### Changed

- Rewrote `figma-for-ai-dev.md` — conditional guidance based on Figma Console MCP availability
- Standardized Figma tool names across all files: "Figma plugin" (official) and "Figma Console MCP"
- Skill count 48 → 49, UI Design category 6 → 7

## [1.2.0] – 2026-03-11

### Added

- New `/de:prototype` command – 8th top-level command for standalone HTML prototype generation (new products, features, or redesigns)
- Rewrote `dev-prototyping`: question-based context gathering (planning docs, existing codebase, Figma designs, or just an idea), generates single-file HTML prototypes in Claude Code, applies design intent and starter values
- Added `prototype` deliverable to dependency graph with full upstream/downstream tracking
- Added "HTML prototype" as review target in `ui-design-critique`, `ui-visual-review`, and `ui-accessibility`
- Added `references/multi-session-workflow.md` to `dev-context-management` with tool-agnostic session management rules

### Changed

- Phase 4 pipeline restructured: `dev-prototyping` now runs sequentially AFTER `ui-design-references` and BEFORE `ui-figma-workflow` (was parallel with figma-workflow)
- `ui-figma-workflow` now depends on prototype deliverable (prototype informs which key screens to design in Figma)
- `dev-prototyping` removed from `/de:dev` command (now accessed via `/de:prototype` or pipeline)
- Cleaned up ~17 "Claude Projects" references across 12 files to be tool-agnostic or Claude Code-specific

### Removed

- Removed `dev-claude-projects` skill (content merged into `dev-context-management` and `meta-compound`)
- Removed parallel-group 4a from pipeline sequence
- Skill count 49 → 48, Development category 8 → 7, Command count 7 → 8

## [1.1.1] – 2026-03-11

### Added

- Session pause/resume via Stop hook and orchestrator resume detection
- Progress routing – automatic phase completion summary in orchestrator startup
- Parallel group execution for independent skills within the same phase
- AskUserQuestion preview mockups for visual/architectural choices (design feel, depth strategy, navigation model)
- Proactive context monitoring instruction with state-preserving compact message format
- Model recommendations – Opus for planning phases, Sonnet (user choice) for development

### Changed

- `meta-orchestrator` startup enhanced with Step 0 (resume check), progress summary, and parallel group handling
- `session_dep_summary.py` now writes resume state to `.design-engineer.yaml`
- Pipeline sequence annotated with 4 parallel groups across Phases 2, 4, and 5

## [1.1.0] – 2026-03-10

### Added

- New `ui-design-critique` skill – 4-lens craft critique framework (Composition, Craft, Content, Structure) with 4 named tests (Swap, Squint, Signature, Token)
- Design intent guide for `ui-design-references` – "Where Defaults Hide" philosophy, Intent-First framework, Product Domain Exploration, WHY checkpoint
- Starter values reference for `ui-design-system` – spacing scales, typography scales, text hierarchy, border progression, surface elevation, depth strategies
- Prompt templates reference for `ui-design-system` – visual polish pass, glance test, component spec, accessibility check, responsive spec, token audit
- Design system persistence – save/load decisions to `.design-system/system.md` across sessions
- UX non-negotiables check in `ui-visual-review` – 6 fundamental usability checks before visual audit
- UX pattern issues catalog in `ui-visual-review` references – navigation context, primary action clarity, interactive element ambiguity, grouping, feedback, accessibility

### Changed

- `ui-design-references` expanded from reference collection to full design thinking skill (intent-first, domain exploration, WHY mandate)
- `ui-visual-review` now runs UX non-negotiables check before visual audit (Steps renumbered 1–6)
- `ui-design-system` checks for saved decisions on startup and offers to save on completion
- Plugin version bumped to 1.1.0, skill count 48 → 49

## [1.0.0] – 2026-03-10

### Added

- Initial marketplace release with the `design-engineer` plugin
- Full-stack product design and AI-assisted development workflow
