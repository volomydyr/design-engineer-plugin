---
name: dev-component-gallery
description: "Stack-agnostic component gallery scaffolder and updater. Creates a single-page visual catalog of every component in the project (all variants, source-labelled, real production styles). Adapts to the project's framework via context7 MCP – never carries a hardcoded stack table. Used by frontend-implementer to keep the gallery in sync after every component change; audited by design-system-auditor."
disable-model-invocation: true
model: claude-opus-4-7
effort: high
license: MIT
---

# Component Gallery Skill

A single-page visual gallery of every component in the project. Every variant, all in one viewport, with source paths labelled – so duplicates are obvious, gaps are visible, and visual quality is auditable. Inspired by Yana's `yananaaas.github.io` reference (pill-tab navigation across categories, real components rendered with production styles, source attribution per entry).

## Purpose

Two specific problems the gallery solves:

1. **Visual redundancy detection.** When Claude tends to create five new versions of an existing component, a side-by-side gallery makes the duplicates obvious. Two cards rendering identical buttons but pointing to `Button.tsx` and `PrimaryButton.tsx` are the redundancy signal.
2. **Visual quality assurance.** Code-level inspection works but lacks visual clarity. Storybook works but is a docs site, not a canvas. The gallery is closer to a design canvas: one viewport, all components, real production styles.

## Stack-agnostic flow

The skill never carries a hardcoded "framework → location" table. The plugin works for every stack – iOS, Android, Flutter, SwiftUI, Compose, web frameworks not yet invented – so the skill adapts on each invocation.

### Step 1: Read existing config

Read `.design-engineer-plugin/config.yaml`. If `gallery.path` is already set (from a previous run on this project), jump to step 4 with the persisted location.

### Step 2: Detect stack

Use existing detection infrastructure:

- The environment summary already produced by `skills/meta-setup/scripts/detect-environment.sh` (run during `/design-engineer:start`).
- Targeted file presence checks for stack markers:
  - `package.json` – read framework name + version (next, vue, svelte, astro, vite + react/vue, etc.)
  - `Package.swift` – Swift / SwiftUI
  - `pubspec.yaml` – Flutter / Dart
  - `build.gradle` / `build.gradle.kts` – Android (Jetpack Compose)
  - `Cargo.toml` – Rust / Tauri / Yew / Leptos
  - `*.csproj` / `MAUI` markers – .NET MAUI
  - `index.html` + custom-element script tags – vanilla web-components stack (Yana's case)
  - Static-site markers – Jekyll, Hugo, Eleventy, Astro static
- Identify the primary UI framework. If multi-target (e.g., Tauri app with React inside), pick the layer the components live in.

### Step 3: Query context7 for the framework's idiomatic showcase pattern

Read the query templates from `references/context7-prompts.md` and use the bundled MCP:

1. `mcp__plugin_design-engineer_context7__resolve-library-id` with the framework name.
2. `mcp__plugin_design-engineer_context7__query-docs` with the primary query template (substitute framework name + version).

What context7 returns determines: file location, file extension, import syntax, variant-rendering pattern, comment syntax, access mechanism. Cite the doc paragraphs in your report to the user.

If primary query returns generic/empty results, run the fallback query from the same reference. If still unclear, **consult the advisor** (`skills/advisor/`, shipped v4.5.0) – this is the docs' "before committing to an interpretation" moment. If the advisor also can't decide, ask the user once via AskUserQuestion:

```
question: "Where should the component gallery live in this project?"
header: "Gallery location"
```

Persist the answer to `.design-engineer-plugin/config.yaml` as `gallery.path` so subsequent invocations skip the question.

**Anti-rule**: never invent a location. If context7 + advisor + user are all silent, stop and explain what's missing – don't ship a guess.

### Step 4: Plan the scaffold

From the docs results (or persisted config), plan:

- **File path** – the location context7 named.
- **File format / extension** – the framework's expected file type.
- **Comment syntax** – read from `references/gallery-contract.md`'s per-language adaptation table.
- **Access mechanism** – URL via the user's existing dev server, Xcode preview, Android Studio preview, etc. Must be something the user already does – never propose a separate process unless context7 explicitly says that's the framework's convention.
- **Render approach** – how to import production components and render variants via their public API.

### Step 5: Scaffold the file

1. Create the file at the planned path.
2. Write the **Gallery Contract** at the top, in the right comment syntax (read canonical text from `references/gallery-contract.md`).
3. Set up tab/section navigation if the framework supports it natively (HTML nav, SwiftUI TabView, Flutter Scaffold tabs, etc.). Sections roughly: Brand / Colors / Typography / Layout / Forms / Navigation / Cards / Feedback / Misc – adapt to what the project actually has.
4. **Seed with all currently-existing components** in the project's components directory. For each component:
   - Import (or use) it from its production source path – never duplicate or restub.
   - Render every variant reachable via the component's public API.
   - Show the source file path next to the rendered output as a label.
   - No inline styles, no extra style rules, no API-bypassing hacks.

### Step 6: Report

**On first scaffold** (gallery didn't exist before this run): surface a one-line mention to the user – "Created a component gallery at <path> – every component in your codebase, all variants, in one place. Open it via <access mechanism> to spot duplicates and check visual consistency." This is the user's discovery moment. Do not wait to be asked; it just needs to be said once.

**On subsequent updates** (gallery already existed): stay silent unless asked. Gallery sync is build-artifact-style infrastructure – same as test runs, formatter passes, or asset bundling. Don't narrate every update. If the update introduced a new section/category, that's worth one line; otherwise nothing.

For the first-scaffold mention, include:
- Where the gallery file lives.
- How to access it (URL, IDE preview, etc.).
- How many components were seeded.
- Which context7 documentation paragraphs justified the location/format choices (these go in a brief "why this location" parenthetical, not as a separate report).

## Update protocol (called by `frontend-implementer` after every component change)

When invoked with a component create or modify, the skill:

1. Reads the existing gallery file at `gallery.path`.
2. Locates the section for the component's category (or creates a new section if none fits).
3. **Adds or updates the entry**:
   - Import statement uses the component's production path.
   - Render uses the real component, not a copy.
   - Variants vary attributes/props/modifiers/classes only – never styles.
   - Source-path label reflects the current file location.
4. **Verifies the contract**: scans the file for inline styles, duplicate components, extra style rules. Any violation is a hard stop – fix or report.
5. Saves.

## When NOT to run

- **During design exploration / prototyping.** That's the prototype lifecycle (`skills/dev-prototyping/`). Prototypes are throwaway – they don't go in the gallery; gallery entries don't appear as prototypes.
- **On non-component changes.** Style-only refactors, business-logic changes, infrastructure code – none of these affect the gallery.
- **Without a project structure.** If `.design-engineer-plugin/config.yaml` doesn't exist, route the user to `/design-engineer:start` first.

## Enforcement summary

This skill produces and maintains the gallery, but it doesn't enforce gallery-sync on its own – enforcement lives in the agents that surround component work:

- `agents/frontend-implementer.md` – invokes this skill after every component create/modify.
- `agents/design-system-auditor.md` – audits the gallery against the contract at FAIL severity.
- `skills/dev-claude-md/SKILL.md` – generated project CLAUDE.md includes the contract so the rule survives in the user's repo.
- `skills/dev-prototyping/SKILL.md` – cross-references the lifecycle relationship.
- Plugin `CLAUDE.md` – top-level Component Gallery Contract section.

No hooks. No PreToolUse blocking. The contract is enforced through skill/agent prompt rules + the auditor's pass.

## Source

- Visual reference: Yana's `yananaaas.github.io` (the canonical example shown in the v4.6.0 feedback round).
- Stack-adaptive scaffold via the bundled context7 MCP – see `references/context7-prompts.md`.
- Detection infrastructure: `skills/meta-setup/scripts/detect-environment.sh`.
- Universal contract text + per-language adaptation: `references/gallery-contract.md`.
- Advisor-consult fallback when context7 is unclear: `skills/advisor/SKILL.md` (v4.5.0).
