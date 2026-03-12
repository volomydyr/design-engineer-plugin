# Changelog

All notable changes to the design-engineer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
- Code-to-Figma import guidance in `dev-prototyping` and `ui-figma-workflow`
- `figma-handoff` deliverable in dependency graph with upstream/downstream tracking

### Changed

- Rewrote `figma-for-ai-dev.md` — no longer says "skip components and tokens"; now recommends automating with Figma Console MCP when available, with minimal approach as fallback
- Updated `figma-mcp-guide.md` — renamed to Figma Integration Guide, added code-to-Figma import capability and `ui-figma-handoff` reference
- `ui-figma-workflow` Step 3 updated: conditional guidance based on Figma Console MCP availability
- Phase 4 pipeline: `ui-figma-handoff` added as optional step after `ui-figma-workflow`
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

- Session pause/resume – Stop hook now writes resume state to `.design-engineer.yaml`; orchestrator detects it on startup and offers to continue where you left off
- Progress routing – orchestrator shows phase completion summary from `.dependencies.yaml` before asking project state
- Parallel group annotations in pipeline sequence for 4 skill groups (Phases 2, 4, 5) with execution guidance for god/guided modes
- AskUserQuestion preview mockups in `ui-design-references` (design feel), `ui-design-system` (depth strategy), and `ux-information-architecture` (navigation model)
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
- Design intent guide reference for `ui-design-references` with "Where Defaults Hide" philosophy, Intent-First framework, Product Domain Exploration, and WHY checkpoint
- Starter values reference for `ui-design-system` with spacing, typography, text hierarchy, border progression, surface elevation, depth strategies, and shadow scales
- Prompt templates reference for `ui-design-system` with 6 curated task-specific prompts
- Design system persistence mechanism (`.design-system/system.md` save/load)
- UX non-negotiables check in `ui-visual-review` (6 fundamental usability principles)
- UX pattern issues section in `ui-visual-review` common issues catalog

### Changed

- `ui-design-references` expanded from reference collection to full design thinking skill
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
  - 8 UX design skills (6p-stories, behavior-mapping, bias-framework, journey-mapping, ethics-review, product-assessment, and more)
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
