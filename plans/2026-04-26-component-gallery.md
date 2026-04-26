# v4.6.0 — Component gallery skill, stack-agnostic via context7, enforced in dev skills/agents

## Context

Beta tester wants a Storybook+Figma-style **single-page component gallery** for any project the plugin runs in: every component, every state, all visible at once, so duplicates and gaps are spotted visually. The motivating reference is Yana's `yananaaas.github.io` page — pill-tab nav across categories, all variants visible with toggle pills, source path labels per component, code preview beneath.

Two concrete problems the gallery solves:
1. **Visual redundancy detection.** Claude tends to create five new versions of an existing component because there's no visual inventory. A side-by-side gallery makes duplicates obvious.
2. **Visual quality assurance.** Code-level inspection works but lacks "наглядність" (visual clarity). Storybook works but the user explicitly rejects it as not visually clear enough — it's a docs site, not a canvas. The gallery is closer to a design canvas: one viewport, all components, real production styles.

User refinements through five rounds of iteration:
- **Live token editing dropped.** Was a tester wish but not reliably implementable cross-stack ("language/framework agnostic"). v1 ships read-only.
- **Gitignore dropped.** Gallery is committed to git like normal source.
- **Markup-snapshot trade-off rejected.** Unreliable, drifts.
- **Hardcoded stack table rejected.** Plugin works for "literally everything" — iOS, Android, Flutter, SwiftUI, Compose, Tauri, Unity, web frameworks not yet invented. The skill must adapt, not enumerate.
- **Critical "actually works" constraints.** Gallery MUST import real production components (never duplicate or restub) and MUST NOT contain hardcoded styles (otherwise it lies — user sees fake-correct UI while production has bugs).
- **Enforcement location.** Embed in dev skills/agents, not hooks.

The chosen mechanism: a stack-agnostic skill that queries **context7 MCP** (already bundled since v4.3.0) for the project's framework's official idiomatic showcase pattern, then scaffolds the gallery in whatever shape that framework uses (SwiftUI `#Preview` canvas, Jetpack Compose `@Preview`, Next.js route, vanilla HTML, Astro page, Flutter widgets-gallery, etc.). The Gallery Contract — universal across stacks — lives at the top of every gallery file in language-appropriate comments and is enforced by the agents that produce/audit components.

This is a feature addition: new skill + agent rule additions + CLAUDE.md additions. No breaking changes. **MINOR bump → v4.6.0**.

## Architectural decisions

- **Stack-agnostic via context7, not enumeration.** The skill never carries a hardcoded "framework → location" table. For every project it touches, it (a) detects stack from `.design-engineer-plugin/config.yaml` (already produced by `meta-setup`) plus targeted file presence checks (`Package.swift`, `pubspec.yaml`, `build.gradle`, `Cargo.toml`, `package.json`, etc.); (b) calls the bundled context7 MCP with a query like "single-page component preview/showcase pattern in <framework>"; (c) plans the file path/format/access mechanism from what the docs return. For genuinely novel/obscure stacks not covered by context7, asks the user once and persists the answer in `.design-engineer-plugin/config.yaml`.
- **The Gallery Contract is universal, the syntax adapts.** The contract text is identical regardless of stack — what changes is the comment syntax in which it's embedded (`/* */` for JS, `//` for Swift, `/* */` for Kotlin, `<!-- -->` for HTML, etc.). The skill writes the contract in the file's appropriate comment form.
- **No live editing in v1.** Stays dropped. User explicitly: "we don't need actual live editing… not a reliable way to implement it right now."
- **Not gitignored.** User: "I see no issues in keeping it on git too."
- **No hooks.** All enforcement lives in dev skills/agents per user preference. Specifically: `frontend-implementer` enforces "update gallery after every component change," `design-system-auditor` enforces "gallery is in sync, contract not violated," `dev-claude-md` ensures the rule survives in the user's project, `dev-prototyping` cross-references the lifecycle (prototype before implementation; gallery after). New `dev-component-gallery` skill owns the scaffold/update/context7-query logic.
- **Audit findings at FAIL severity** (per user pick earlier in this session). Gallery violations block the implementation phase same as design-system violations do today.
- **Reuse existing infrastructure.** `skills/meta-setup/scripts/detect-environment.sh` already detects framework markers; `mcp__plugin_design-engineer_context7__*` is already bundled and works. We don't add new detection or new MCP — we compose what exists.
- **CHANGELOG cites the source.** Per the v4.2.0 source-citation requirement, the entry references Yana's gallery as the visual reference and links to context7's role.

## Phase 1: Build `dev-component-gallery` skill + wire enforcement into agents and existing skills

**Objective**: Ship the new skill primitive, embed gallery responsibilities into the relevant dev agents and skills, write the Gallery Contract section into the plugin's CLAUDE.md.

**Depends on**: none

**Files to modify**:

- **NEW** `skills/dev-component-gallery/SKILL.md` — frontmatter (`name: dev-component-gallery`, `description: …`, `model: claude-opus-4-7`, `effort: high` — Opus because stack adaptation needs reasoning over context7 results). Body covers:
  - **Purpose** — visual gallery of every component, all variants, source-labelled, for redundancy detection and visual QA.
  - **Stack-agnostic flow** — (1) detect stack from `.design-engineer-plugin/config.yaml` + targeted file checks, (2) query context7 for the framework's idiomatic single-page showcase pattern, (3) plan file path / format / access mechanism, (4) scaffold with the universal Gallery Contract in language-appropriate comments, (5) seed with all currently-existing components, (6) report what was created and how the user accesses it.
  - **The universal Gallery Contract** — the canonical text, with a per-language adaptation table showing how it gets embedded as comments in JS/TS/Swift/Kotlin/Dart/HTML/CSS/Rust/etc.
  - **Update protocol** — when invoked with a new component, the skill: reads the existing gallery file; finds the right section; adds a new entry that imports the component from its production path; uses only the component's API for variants; never adds inline styles.
  - **Detection fallback** — if context7 returns nothing useful or the stack is unrecognized, ask the user once via AskUserQuestion: "Where should the component gallery live in this project?" — persist answer to `.design-engineer-plugin/config.yaml` as `gallery.path` so future invocations skip the question.
  - **Source citations** at the bottom: link to Yana's reference, link to context7 docs, link to existing `skills/meta-setup/scripts/detect-environment.sh`.
- **NEW** `skills/dev-component-gallery/references/gallery-contract.md` — the canonical contract text + the per-language comment-syntax table. Skill reads this on every invocation so the contract stays consistent.
- **NEW** `skills/dev-component-gallery/references/context7-prompts.md` — the exact context7 query templates (e.g., `"In <framework> <version>, what is the idiomatic single-file component preview/showcase pattern? File location convention. Comment syntax for documentation headers. How to import production components. How to render variants without overrides."`). Keeping the prompt template here makes results reproducible across runs.
- **`agents/frontend-implementer.md`** — under "Your Core Responsibilities" add: "After creating or modifying any component, invoke the `dev-component-gallery` skill to update the gallery. Import (or use) the component from its production source path; never duplicate or restub it. Never add inline styles or extra style rules to the gallery file. Variants use only the component's exposed API." Add a "Gallery sync" subsection in "Before Implementation" that says: "Confirm the gallery file exists for this project (skill scaffolds on first use). Read its current entries to avoid duplicating existing components."
- **`agents/design-system-auditor.md`** — under "Your Core Responsibilities" add a new responsibility: "Audit the component gallery: every file in the project's components directory has a gallery entry; no inline styles or `style=` overrides anywhere in the gallery file; entries import from production paths (resolve check); visually-identical entries flagged as potential duplicates." Add a "Gallery audit" subsection in "Systematic Audit Process" that runs alongside design-system-compliance and aesthetic audits, producing findings at the same FAIL severity.
- **`skills/dev-claude-md/SKILL.md`** — when the skill scaffolds the project's CLAUDE.md, include a new "Component Gallery Contract" section. The section quotes the universal contract and instructs the project: "After creating or modifying a component, update the gallery in the same change. Never duplicate components; never inline styles in the gallery. Run `/design-engineer:dev` and ask for `dev-component-gallery` to scaffold or update."
- **`skills/dev-prototyping/SKILL.md`** — add a one-paragraph cross-reference at the bottom: "**Lifecycle relationship**: prototype is for design exploration *before* implementation (throwaway HTML, no component reuse rules). The component gallery is for shipped components *after* implementation (real imports, real production styles, contract-bound). Don't conflate them — prototypes don't go in the gallery; gallery entries don't appear as prototypes."
- **`CLAUDE.md`** (plugin root) — add a new top-level section "## Component Gallery Contract" between the existing "## Code Quality: /simplify" and "## TDD with Playwright CLI" sections (or wherever fits the section order best — verify by reading neighbors). Section content: the universal contract + a pointer to `skills/dev-component-gallery/SKILL.md` + a clear note that enforcement runs in `frontend-implementer` and `design-system-auditor`, not via hooks.

**Reuse**:
- `skills/meta-setup/scripts/detect-environment.sh` — existing detection produces the YAML the new skill reads.
- `mcp__plugin_design-engineer_context7__*` — bundled MCP, no new wiring needed.
- Existing agent frontmatter pattern (Opus 4.7, high effort) for skill consistency.
- The advisor pattern from v4.5.0 — `dev-component-gallery` should consult the advisor at the "before scaffolding" moment when stack detection produces ambiguous context7 results, since that's the docs' "before committing to an interpretation" moment.

**Implementation details**:

`dev-component-gallery` SKILL.md flow (skeleton):

```
1. Read .design-engineer-plugin/config.yaml. If `gallery.path` already set, jump to step 4.
2. Detect stack:
   - Read existing config (project_type, detected environment from detect-environment.sh)
   - Targeted file checks: Package.swift / pubspec.yaml / build.gradle / Cargo.toml / package.json (read framework name + version)
3. Query context7 (mcp__plugin_design-engineer_context7__resolve-library-id then query-docs):
   - Resolve framework's library id
   - Query: "Idiomatic single-file component preview/showcase pattern. File location convention. Comment syntax. How to import production components. How to render variants without style overrides."
   - If results unclear or empty, advisor consult ("I'm unsure about gallery location for stack X — context7 returned Y, my plan is Z, course correct?"). If still unclear, AskUserQuestion once and persist answer.
4. Plan: file path, file format, comment syntax, access mechanism, render approach.
5. Scaffold:
   - Create the file at the planned path
   - Write the Gallery Contract at top in the right comment syntax (read from references/gallery-contract.md)
   - Seed with all components currently in the project's components directory (use real imports, no styles, source-path labels)
6. Report: "Gallery created at <path>. Access via <mechanism>. Contains N components."
```

Update protocol (when frontend-implementer creates/modifies a component):

```
1. Read existing gallery file
2. Locate the section for this component's category (or create if new)
3. Add or update the entry: import statement uses production path, render uses real component, variants via real API, source-path label included
4. Verify contract not violated: no inline styles added, no component duplicated, no extra style rules
5. Save
```

**Checklist**:
- [ ] Create `skills/dev-component-gallery/SKILL.md` with stack-agnostic flow
- [ ] Create `skills/dev-component-gallery/references/gallery-contract.md` with universal contract + comment-syntax table
- [ ] Create `skills/dev-component-gallery/references/context7-prompts.md` with query templates
- [ ] Update `agents/frontend-implementer.md` — gallery-sync responsibility + before-implementation read-existing-gallery step
- [ ] Update `agents/design-system-auditor.md` — gallery-audit responsibility + systematic audit pass at FAIL severity
- [ ] Update `skills/dev-claude-md/SKILL.md` — generated CLAUDE.md gets Component Gallery Contract section
- [ ] Update `skills/dev-prototyping/SKILL.md` — lifecycle cross-reference paragraph
- [ ] Update plugin `CLAUDE.md` — top-level Component Gallery Contract section
- [ ] Spot-check: skill cites Yana's reference + context7 + detect-environment.sh
- [ ] Spot-check: contract text identical across all four locations (skill references file, generated CLAUDE.md section, plugin CLAUDE.md section, agent prompts)
- [ ] `wc -l skills/dev-component-gallery/SKILL.md` reasonable (~150–250 lines)

**QA**:
1. `ls skills/dev-component-gallery/` shows `SKILL.md`, `references/gallery-contract.md`, `references/context7-prompts.md`.
2. `grep -c "gallery" agents/frontend-implementer.md agents/design-system-auditor.md` returns ≥3 each.
3. `grep -n "Component Gallery Contract" CLAUDE.md skills/dev-claude-md/SKILL.md` shows the section in both the plugin's CLAUDE.md and the skill that generates project CLAUDE.md.
4. `grep -n "context7\|mcp__plugin_design-engineer_context7" skills/dev-component-gallery/SKILL.md` confirms context7 wiring documented.
5. Manual smoke test (deferred to user, after v4.6.0 ships): on a real Next.js project, run `/design-engineer:dev` and ask for the gallery → observe the skill query context7, plan a `app/__gallery__/page.tsx` (or whatever context7 says is current Next idiom), scaffold with contract on top, seed with existing components. On a SwiftUI project, observe a `#Preview`-based scaffold instead.

## Phase 2: Version bump, CHANGELOG, README, ship

**Objective**: Cut v4.6.0, document the feature, push to main.

**Depends on**: Phase 1.

**Files to modify**:

- `.claude-plugin/plugin.json` — bump 4.5.0 → 4.6.0.
- `.claude-plugin/marketplace.json` — bump 4.5.0 → 4.6.0.
- `CHANGELOG.md` — `[4.6.0] – 2026-04-26` Added entry. Body: explain the feature in plain language, mention Yana's gallery as the visual reference (per the v4.2.0 citation requirement), call out the stack-agnostic via context7 design, list the agent/skill enforcement points, note what was explicitly scoped out (live editing, gitignore, hardcoded stack table). Cite context7 MCP and `skills/meta-setup/scripts/detect-environment.sh` as reused infrastructure.
- `README.md` — bump banner v4.5.0 → v4.6.0; add a feature line summarizing the gallery; the "67 improvements" count → 68.

**Reuse**: existing CHANGELOG format from prior 4.x entries.

**Checklist**:
- [ ] `.claude-plugin/plugin.json` 4.5.0 → 4.6.0
- [ ] `.claude-plugin/marketplace.json` 4.5.0 → 4.6.0
- [ ] CHANGELOG `[4.6.0] – 2026-04-26` Added entry, citations included
- [ ] README banner v4.6.0, feature line added, count → 68
- [ ] JSON manifests valid (`python3 -m json.tool` on both)
- [ ] Git status clean before commit (no other in-flight changes)
- [ ] Mode 1 commit per dev-github-workflow (plan-driven, footer included), explicit user authorization before push to main

**QA**:
1. `python3 -m json.tool < .claude-plugin/plugin.json` and same for marketplace — both valid.
2. `grep -n "4.6.0" .claude-plugin/plugin.json .claude-plugin/marketplace.json README.md CHANGELOG.md` shows version in all four.
3. `git status -s` after commit shows clean tree.
4. After push: `git log --oneline -1` shows the v4.6.0 commit on main.

## Risk assessment

- **Risk**: context7 may not have docs for the framework or may return generic results. **Mitigation**: skill consults the advisor (v4.5.0) when context7 results are ambiguous, and falls back to AskUserQuestion if still unclear. Persist the user's answer to `.design-engineer-plugin/config.yaml` so subsequent invocations skip the question. Treats unknown stacks as a recoverable case, not a feature gap.
- **Risk**: the contract is universal but enforcement effectiveness varies by language (some languages don't have idiomatic ways to "forbid" inline styles syntactically). **Mitigation**: the audit pass in `design-system-auditor` catches violations regardless of language — it scans the gallery file for style-rule patterns in the file's syntax. The contract is the convention; the auditor is the gate.
- **Risk**: `frontend-implementer` is already heavy (Design Grounding pre-flight, Figma context fetch, etc.). Adding gallery-sync responsibility could push it into prompt overflow. **Mitigation**: gallery-sync is a small addition (a paragraph in core responsibilities + a paragraph in before-implementation). Existing structure absorbs it. If we see prompt-quality regressions later, factor gallery-sync into a separate sub-skill the agent invokes.
- **Risk**: the new skill may hallucinate framework patterns when context7 is silent. **Mitigation**: the skill explicitly does NOT proceed without either context7 confirmation or user input. No silent guessing — the prompt forbids "make it up" and routes to advisor-then-user fallback.
- **Risk**: scope expansion by the model (e.g., adding live editing back, adding a build step, adding extra config). **Mitigation**: every dropped scope item is listed explicitly in the CHANGELOG with the user's rationale. Plan checklist is the contract — nothing outside the checklist gets implemented.
- **Risk**: gallery-audit findings at FAIL severity could block legitimate iterative work where a developer is mid-flight on a component change. **Mitigation**: per the user's earlier pick, FAIL severity is the right default — gallery hygiene is a first-class quality gate. If it proves too aggressive in practice, downgrade to WARN in v4.6.x. Beta phase, acceptable to ship strict and loosen if feedback says otherwise.

## Verification (end-to-end)

After v4.6.0 lands:
1. `skills/dev-component-gallery/` exists with SKILL.md + references/gallery-contract.md + references/context7-prompts.md.
2. `agents/frontend-implementer.md` includes gallery-sync responsibility and before-implementation gallery read.
3. `agents/design-system-auditor.md` includes gallery audit at FAIL severity in the systematic audit process.
4. `skills/dev-claude-md/SKILL.md` generates a CLAUDE.md that includes the Component Gallery Contract section.
5. `skills/dev-prototyping/SKILL.md` has the lifecycle cross-reference paragraph.
6. Plugin `CLAUDE.md` has a top-level Component Gallery Contract section.
7. JSON manifests valid; version 4.6.0 in both plugin.json and marketplace.json.
8. README banner v4.6.0; CHANGELOG entry under [4.6.0] cites Yana's reference, context7 MCP, detect-environment.sh.
9. Manual smoke test (deferred to user):
   - Run plugin on a real Next.js project; ask for gallery scaffold; observe context7 query, advisor consult on ambiguity, scaffold with contract at top, seed with existing components, accessible at the route the framework's docs say is idiomatic.
   - Run plugin on a SwiftUI project; observe a `#Preview`-based scaffold, contract in `//` comments, components rendered via real imports.
   - Add a new component via `frontend-implementer`; observe the agent invokes `dev-component-gallery` to update the gallery in the same turn.
   - Run `/design-engineer:review` with design-system-auditor; observe gallery audit pass; introduce an inline style on purpose and observe FAIL finding.

## Questions for user

None — design approved through five rounds of refinement (live editing dropped, gitignore dropped, markup snapshots rejected, hardcoded stack table rejected, context7-driven approach approved). MINOR bump v4.6.0. Ready to implement on plan approval.
