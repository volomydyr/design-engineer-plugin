# Changelog

All notable changes to the design-engineer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [5.5.4] – 2026-05-04

Stops the model from short-circuiting "Conditional teaching" steps mid-pipeline. User reported: after running several skills successfully, the model started saying things like "I'll skip the explainer (you're a designer; you know competitor analysis)" instead of asking the question and giving the one-sentence refresher. The user wanted the refresher anyway — even on activities they know — and the model was deciding paternalistically on their behalf that it wasn't needed.

### Changed

- All 25 skills with the Step 0 "Conditional teaching" pattern (every `ux-*`, `ui-*`, `dev-*` skill that opens with a familiarity question) now have an inline blockquote rule: **ALWAYS ask the question, ALWAYS give the refresher when the user says yes.** Names the failure mode explicitly ("I'll skip the explainer (you're a designer)" is forbidden) so the model recognizes the pattern. Files patched: ux-story-panels, ux-bias-audit, ux-problem-statement, dev-github-workflow, ui-references-moodboard, dev-claude-md, ux-competitor-analysis, ux-motivation-audit, dev-status-tracking, ux-target-audience, dev-starter-prompts, ux-storybrand, ux-mvp-requirements, ux-behavior-mapping, ui-landing-page, ux-ethics-review, dev-mcp-setup, dev-agent-setup, ux-business-plan, ui-design-system, ux-full-review, dev-prototyping, ux-assumptions, ux-information-architecture, ux-journey-mapping.
- New top-level **`Conditional teaching contract`** section in CLAUDE.md, codifying the rule as a hard contract: the user (not the model) decides what's redundant. The default is always ASK + REFRESHER. If the user wants no refreshers, they can mid-session ask to disable them — but the model never preempts that decision.

### Why this matters

Across long pipeline sessions, users are fatigued and context-switched. A one-sentence refresher costs almost nothing and primes them for the questions that follow. The model's instinct to "skip what they already know" is exactly the polite-sounding shortcut that degrades the experience over time. Hard rule beats soft norm.

## [5.5.3] – 2026-05-04

Stops a recurring autopilot hallucination in which `ui-references-moodboard` got conflated with `ux-story-panels` and `ui-images`, producing a phantom `references-image-prompts.md` containing AI-generation prompts intended to "approximate" the design references. The references ARE the screenshots — generating AI approximations of them is strictly worse and defeats the entire point of reference gathering. Reported by user during autopilot testing on a project that pre-dated v5.4.0 (file landed at `design/craft/references-image-prompts.md`).

### Changed

- **`skills/ui-references-moodboard/SKILL.md`** — added an explicit "What this skill DOES NOT produce" section listing forbidden outputs (`references-image-prompts.md`, any AI-generation prompt files for references, any invocation of `ui-images` or `ux-story-panels` from inside this skill). Also enumerates the only three legitimate output paths (`references.md`, captures `*.png`, `manifest.md`). The path-validation hook from v5.5.0 already denies `references-image-prompts.md` at write time on v5.5.x projects; this is the source-level prevention so the model doesn't try in the first place.
- **`skills/ux-story-panels/SKILL.md` Step 4** — prepended a scope-guard paragraph clarifying that "Generate Image Prompts" is specifically for the 6 narrative panels of a customer-experience story, NOT a generic image-prompt-generation pattern other skills can pattern-match onto. Names the conflation source explicitly so the model recognizes the failure mode.
- **`skills/ui-images/SKILL.md`** — prepended a scope-guard paragraph clarifying this skill is for the project's own UI images (hero shots, avatars, decorative photos), NOT for "approximating" references gathered by the moodboard skill.

### Why three skills changed for one bug

The hallucination required two skills' outputs to be conflated in the model's context: `ui-images`'s `prompts/<id>.md` shape, and `ux-story-panels`'s "generate image prompts for ChatGPT/DALL-E/Midjourney" verbal pattern. Adding a scope guard at the destination skill (moodboard) only would still leave both source patterns available for re-conflation. The fix needs all three: a forbidden-list in moodboard, plus scope guards in story-panels and ui-images that name the conflation explicitly.

## [5.5.2] – 2026-05-04

Corrects the v5.5.1 over-fix. After verifying against Anthropic's official docs ([sub-agents](https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields) and [plugins reference](https://code.claude.com/docs/en/plugins-reference#agents)):

**Officially supported on plugin agents:** `name`, `description`, `model` (aliases AND full version IDs like `claude-opus-4-7`), `effort` (low/medium/high/xhigh/max), `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, `isolation`.

**Silently ignored on plugin agents** (security): `hooks`, `mcpServers`, `permissionMode`.

**Skills-only fields** (invalid on agents): `disable-model-invocation`.

### Fixed

- Restored `model: claude-opus-4-7` on opus-tier agents (was `model: opus` after v5.5.1's misdiagnosis). Both forms work, but the version pin matches the v4.3.1+ design intent of avoiding alias drift.
- Restored `effort:` field on all agents (was removed in v5.5.1). Officially supported per docs; the v5.5.1 removal was a wrong diagnosis.
- Kept `disable-model-invocation: true` removed from `agents/advisor.md` — that's the one genuinely invalid field for agents (it's skills-only). This was the only correct part of v5.5.1.

### Changed

- `CLAUDE.md` "Model Configuration" section rewritten to match the docs: both aliases and full model IDs are valid for `model:`. `effort:` is supported on agents AND skills. `disable-model-invocation:` is skills-only. Added link references to the canonical Anthropic doc pages so future edits can verify against the authoritative source.

### Note on the actual `/agents` panel issue

The original symptom (plugin agents missing from `/agents`) had no source-level cause. v5.5.1 fixed nothing about that — the source frontmatter was always docs-valid (except `disable-model-invocation` on advisor.md, which would only have affected that one agent's loading, not the entire plugin's). The actual cause was likely Claude Code session/install state. After installing v5.5.2 (or any recent version) and restarting Claude Code, the plugin agents should appear correctly in `/agents` under the `design-engineer:` namespace.

## [5.5.1] – 2026-05-04

Critical fix: every plugin-defined agent (advisor, backend-implementer, compound-documenter, context-analyzer, deliverable-writer, design-system-auditor, frontend-implementer, psych-scanner, test-writer, ux-researcher) was failing silent registration with Claude Code's agent registry. Symptom: `/agents` panel showed only `code-simplifier:code-simplifier` under Plugin agents; calling `Task(design-engineer:ux-researcher)` returned "Agent type not found". User couldn't run any plugin agent.

### Fixed

- **Agent `model:` field** — every agent had `model: claude-opus-4-7` (specific version pin from v4.3.1's "alias drift" decision). Claude Code's plugin agent registry only accepts model aliases (`opus`, `sonnet`, `haiku`, `inherit`) and silently rejects agents with unrecognized values. Changed to `model: opus` / `model: sonnet` across all 10 agents.
- **Agent `effort:` field** — Anthropic's plugin agent schema doesn't recognize `effort:` and may reject agents that include it. Removed from all 10 agents. (Effort tuning stays on skills, which are loaded via Read and don't go through the agent registry.)
- **`agents/advisor.md`** — also had `disable-model-invocation: true`, which is a skill-frontmatter field, not an agent field. Removed.

### Changed

- **`CLAUDE.md` "Model Configuration" section** — rewrote with explicit agent-vs-skill split: agents must use model aliases and skip `effort:` / `disable-model-invocation:`; skills can keep specific version pins (`claude-opus-4-7`) and `effort:` / `disable-model-invocation:` because they're loaded by commands via Read, not registered with Claude Code's agent system.
- Pre-commit checklist updated: `effort:` is now required only on skills (not agents); agents must use model aliases.

### Why this matters

The v4.3.1 version-pin decision was deliberate ("Pinned explicitly to the version so the plugin's quality expectations are unambiguous") but broke agent registration in any current Claude Code version that validates the field. The bug was invisible in normal use — agents simply didn't exist from Claude Code's perspective — and the model fell back to `general-purpose` whenever it tried to delegate, producing degraded output without any user-visible error until the user specifically inspected `/agents`. Skills keep the version pin because they're not registered.

## [5.5.0] – 2026-05-04

Major structural consolidation and a sweep of model-improvisation bugs surfaced during user testing of v5.4.0. Everything the plugin produces (except actual product code and Anthropic-managed agent memory) now lives under `.design-engineer-plugin/`. Hard path enforcement at the hook layer prevents the model from improvising non-canonical folders or filenames. Three independent priming sources for hallucinated outputs were rooted out.

Plugin install command unchanged (still `/plugin install design-engineer@design-engineer-plugin`).

### Changed — folder structure

- `design/` → `.design-engineer-plugin/design/`
- `prototype/` → `.design-engineer-plugin/prototype/`
- `plans/` → `.design-engineer-plugin/plans/`
- `design/.scratch/` → `.design-engineer-plugin/temporary/scratch/`
- New disposable buckets: `.design-engineer-plugin/temporary/{scratch, playwright, intermediate}/` (all gitignored)
- `init-project-structure.sh` rewritten to scaffold the new umbrella, with idempotent `.gitignore` block management (auto-replaces legacy v5.4.x block)
- `.gitignore` block tightened to two entries: `.design-engineer-plugin/temporary/` and `.design-engineer-plugin/.active-workflow`. Stack-agnostic — only paths the plugin guarantees to write.

### Changed — `compound-documenter` agent memory path

- 30+ doc references corrected from `.claude/agent-memory/compound-documenter/` to `.claude/agent-memory/design-engineer-compound-documenter/`. Reason: Claude Code's `memory: project` mechanism auto-namespaces the agent's directory by `<plugin>-<agent>`. The plugin source was telling the agent to manually write to the unprefixed path, creating two parallel directories (only one of which was Anthropic-managed). Now the source matches what Claude Code actually creates.

### Added — path + filename validation hook

- New PreToolUse hook `de-deliverable-path-hook.js` registered on Write/Edit/MultiEdit. Denies writes to non-canonical subdirs under `.design-engineer-plugin/design/` (e.g., `strategy/`) and non-canonical filenames (e.g., `business-case.md` instead of `business-plan.md`). Pass-through for `.design-engineer-plugin/temporary/` (escape hatch for working drafts) and for product code outside the umbrella. Allow-list sourced from `dependencies-default.yaml` plus a curated extension list. Flow-suffixed variants like `bias-audit-checkout.md` are allowed when `bias-audit.md` is canonical. macOS `/tmp` symlink handled correctly via realpath.

### Added — `/product:tidy` command

- Manual purge of `.design-engineer-plugin/temporary/` with a confirmation prompt. Use before commit, or anytime the working tree feels noisy.

### Added — auto-purge at phase boundaries

- `meta-document` skill (which fires at every phase boundary via `/product:document`) now runs Step 7: wipes `.design-engineer-plugin/temporary/` and recreates the empty subdirs. Surfaces a one-line confirmation. Working drafts in `temporary/` are unconditionally cleared at each phase — promote work to canonical paths before running `/product:document`.

### Fixed — hallucinated `strategy/` folder

- `skills/meta-document/references/compound-schema.yaml` `category_mapping` rewritten. The legacy block listed `"project-docs/solutions/strategy/"` as the destination for storybrand, business-plan, behavior-map, story-panels, psych-variation — directly contradicting every Phase 2 skill's actual save instruction. The category_mapping is what the model read as ground truth during meta-document, so it was creating `design/strategy/` and dumping deliverables there instead of routing them to `foundation/` and `exploration/`. Schema now uses the canonical taxonomy with `.design-engineer-plugin/design/<subdir>/` paths.

### Fixed — hallucinated `brief.md`

- `skills/dev-prototyping/SKILL.md` Step 0 announcement changed from "5) create a prototype brief" to "5) draft a prototype brief in chat (not a file – the brief lives in the conversation only)". Step 4 prepended with explicit non-file note: "**This step is chat-only — DO NOT write a `brief.md` file.**". The prototype brief was always meant to be presented in chat (Step 4 displays it for user approval), but the Step 0 verb "create" primed the model to write a file with that name.

### Fixed — `competitor-analysis` skill ↔ dependency-graph mismatch

- `skills/ux-competitor-analysis/SKILL.md` was instructing writes to `design/foundation/competitor-analysis.md` while the dependency graph listed `folder: research`. Skill now writes to `.design-engineer-plugin/design/research/competitor-analysis.md` (graph wins). Competitor analysis is research — gathering external evidence about adjacent products — so research/ is the correct semantic bucket.

### Fixed — dependency graph stale folder names

- `skills/meta-setup/assets/dependencies-default.yaml` had multiple entries with `folder: design` (legacy from before craft/ was introduced) and one with `folder: psych` (legacy from before v5.4.0 renamed to psychology). Remapped: story-panels, behavior-map, bias-audit, journey-map, ethics-review, design-references → `exploration`. psych-variation, master-audit → `psychology`. figma-workflow, figma-handoff → `dev`. The path-validation hook reads this file as its allow-list source.

### Changed — hook EXEMPT_DIRS / ALLOWED_PREFIXES + active-plan paths

- `de-tdd-hook.js`: `EXEMPT_DIRS` now includes `.design-engineer-plugin/{plans,prototype,temporary,design}/`. `hasActivePlan()` reads from `.design-engineer-plugin/plans/`.
- `de-fidelity-hook.js`: `EXEMPT_PATHS` updated; `getActivePlanPath()` reads from `.design-engineer-plugin/plans/`.
- `de-plan-copy-hook.js`: comment header restored (source `~/.claude/plans/`, destination `.design-engineer-plugin/plans/`); `projectPlansDir` now correctly `.design-engineer-plugin/plans/`.
- `de-design-grounding-hook.js`: `REFERENCES_MD_CANDIDATES` stripped of legacy bare paths; only canonical umbrella paths remain.
- `de-playwright-path-hook.js`: deny-message text mentions auto-purge; `ALLOWED_PREFIXES` already correct.

### Migration

For existing v5.4.x projects: `mv design .design-engineer-plugin/design && mv prototype .design-engineer-plugin/prototype && mv plans .design-engineer-plugin/plans`. Existing `compound-documenter` agent memory at `.claude/agent-memory/compound-documenter/` should be moved to the prefixed path: `mv .claude/agent-memory/compound-documenter .claude/agent-memory/design-engineer-compound-documenter`.

## [5.4.0] – 2026-05-04

Three coordinated user-surface renames driven by a fresh end-to-end install of v5.3.3. Plugin install command stays unchanged (`/plugin install design-engineer@design-engineer-plugin`); only the slash-command surface and two `design/` subfolder names changed.

### Changed — Slash-command namespace

- `/design-engineer:*` renamed to `/product:*` across every command, skill, agent, hook, and doc that wasn't a frozen historical artifact (plans/, plans/archive/, prior CHANGELOG entries kept as-is). Reason: typing `/design` in Claude Code's command picker fuzzy-matched all 8 plugin commands because the namespace itself contained "design", burying `/product:design` (formerly `/design-engineer:design`) under the others. The fix had to be at the namespace level — renaming individual commands wouldn't have helped.

### Changed — Entry-point command

- `start` renamed to `launch`. The command is a universal entry point that runs onboarding for new projects, resumes returning ones, and shows a capability guide for existing projects, so calling it `start` actively misled users about the second and third paths. `launch` is verb-neutral across all three states.
- `commands/design-engineer/start.md` → `commands/product/launch.md` (folder rename in step 1, file rename in step 2).
- Description text updated: "Universal entry point. Launches the plugin for any project state — new, in-progress, or already shipped."

### Changed — `design/` subfolder cleanup

- `design/craft/` renamed to `design/exploration/`. "craft" was opaque — readers couldn't tell what went in it. "exploration" matches the actual contents (references, journey mapping, story panels, bias audit, AI-generated images) and is common design-team vocabulary.
- `design/psych/` renamed to `design/psychology/`. The abbreviation forced non-experts to decode it; the full word is unambiguous.
- All path references updated: hook allow-lists (`de-design-grounding-hook.js`, `de-playwright-path-hook.js`), skill instructions (every `ux-*` and `psych-*` skill that writes deliverables, plus `ui-references-moodboard`, `ui-images`, `ui-figma-guide`), `commands/product/dev.md`, `agents/frontend-implementer.md`, `CLAUDE.md` File-hygiene table, `evals/evals.json` (also fixed an unrelated stale folder list there), and the project-map.md heredoc + final summary echo in `init-project-structure.sh`.

### Migration

For the small number of existing projects already populated under `design/craft/` or `design/psych/`: `mv design/craft design/exploration && mv design/psych design/psychology`. Slash-command renames take effect after the new version is installed; update any project READMEs or shell history that referenced `/design-engineer:*`.

## [5.3.3] – 2026-05-04

Reworded the Context7 line in the environment-detection output and related skill copy. "Up-to-date technical docs" was confusing on empty projects — it sounded like the plugin had detected technical documents inside the project, when it actually means Claude can fetch external library/framework documentation via Context7. Now reads "Library docs lookup – I can fetch up-to-date docs for libraries and frameworks (e.g., React, Tailwind, Stripe)".

### Changed

- `skills/meta-setup/scripts/detect-environment.sh` – Context7 status line now says "up-to-date library and framework docs lookup" instead of "up-to-date technical documentation".
- `skills/meta-setup/SKILL.md` – the user-facing example bullet and the "Documentation access" internal explainer both clarify this is about external library docs, not the project's own README.
- `skills/dev-mcp-setup/SKILL.md` – Context7 entry in Essential MCPs lists concrete examples (React, Next.js, Tailwind, Stripe) and notes the external-vs-internal-docs distinction.
- `skills/dev-mcp-setup/references/essential-mcps.md` – Context7 Purpose line updated for the same clarification.
- `skills/meta-setup/SKILL.md` – the post-onboarding "You're all set" summary's trailing Tip no longer suggests `/design-engineer:start` (the command the user just finished) as the way to check progress. It now mirrors `start.md`'s wording: "Tip: Run /design-engineer:help anytime to see all available commands and capabilities." Avoids a self-referential loop right at the moment the user is supposed to move on to `/design-engineer:design` or another goal command.

## [5.3.2] – 2026-05-03

Added the Claude Pro plan rate-limit FAQ to the README, mirroring the landing page.

### Added

- **FAQ 5: "Will this work on the Claude Pro plan?"** — added with the landing page's exact copy: "Yes, but the plugin is token-heavy. The Pro plan's 5-hour rate limits will hit fast – even one full design pipeline pass can exhaust them. The plugin works best on Max." Important enough to surface in the README given Pro is the default plan a new user lands on.

### Changed

- **Renumbered FAQ 5–16 to 6–17** to make room for the new Q5. The FAQ index inside the README's "Existing project" section (FAQ 3) cross-references the hooks list — updated from "FAQ 8" to "FAQ 9" to match the new numbering.

## [5.3.1] – 2026-05-03

README copy aligned with the public landing page (`/design-engineer-plugin/`). Only existing sections updated; no new sections added per author preference.

### Changed

- **"Getting started" intro paragraph** rewritten to lead with the landing's framing — "Claude Code writes code; it doesn't think about users, psychology, or design. **Design Engineer** is a plugin..." — instead of opening with the abstract "swiss knife" metaphor. Names the gap the plugin closes upfront.
- **"How it works" paragraph** wording aligned with landing: "3 bundled integrations" (was "connectors"), "Figma MCP for Dev Mode connection" (was "Figma for Dev Mode design data"), "user approval at every stage" (was "approval at every stage"). Added the landing's framing line above the commands table — "You only need to remember one slash command... The list below is just so you can see what's available" — so readers don't feel they have to memorize all eight.
- **Commands table descriptions** rewritten to match the landing word-for-word: `/design-engineer:start` ("Detects your project state, no matter if it's an existing product or something you want to build from scratch"), `/design-engineer:design` ("…discovery, strategy, validation" — dropped "planning" since it lives inside Strategy), `/design-engineer:prototype` ("…from your idea, context docs, references, or existing designs"), `/design-engineer:dev` ("Step-by-step development process – …"), `/design-engineer:document` ("Stores decisions, learnings, and project state for future"), `/design-engineer:stop` ("Saves progress, even mid-activity – you can always pick up later"). `:review` and `:help` already matched.
- **FAQ 6 ("What are skills and how are they different from commands?")** corrected — "Commands are the 9 entry points" → "Commands are the 8 entry points". The 9 was a stale count from before v5.1.1 reduced the main commands list.

### Not added

The landing's new FAQ entry "Will this work on the Claude Pro plan?" is intentionally not in the README. Per author preference, only sections that already exist in the README get aligned; the README is not a mirror of the full landing page.

## [5.3.0] – 2026-05-03

File hygiene and tidy-up. Stops the plugin from leaving 100+ uncommitted files of mixed importance after a single feature implementation — most of them debug artifacts the user can't tell apart from real deliverables.

### Added

- **CLAUDE.md "File hygiene (durability tiers)" section.** Three tiers: durable deliverable (canonical `design/<subdir>/` paths, prototypes, plans, tests, source code — committed), plugin state (`.design-engineer-plugin/`, mostly committed except the per-session `.active-workflow` marker), and disposable working artifact (`design/.scratch/<purpose>/<YYYY-MM-DD-HHMMSS>/`, git-ignored). Rules: skills and agents that write throwaway files MUST use the scratch dir, not the project root and not under `design/<subdir>/`. Stack-agnostic boundary explicitly named — the plugin's `.gitignore` block only covers paths the plugin guarantees to write.
- **`init-project-structure.sh` curates `.gitignore`** with a fenced `# === BEGIN design-engineer-plugin ===` / `# === END design-engineer-plugin ===` block. Idempotent — re-running the script doesn't duplicate the block. The block contains only the two stack-agnostic entries the plugin guarantees: `design/.scratch/` (universal scratch dir) and `.design-engineer-plugin/.active-workflow` (per-session state). Framework-specific outputs (Playwright reports, npm caches, Xcode build artifacts, etc.) stay outside the plugin block and are the user's responsibility to add separately.
- **`init-project-structure.sh` creates `design/.scratch/`** as a structural directory alongside the existing `.design-engineer-plugin/`, `plans/`, `prototype/`. Skills route disposable artifacts there.
- **`commands/design-engineer/dev.md` Step 9.5 — Tidy-up (BLOCKING before PR creation).** Runs `git status --short` after `design-system-auditor` and surfaces every untracked / modified file for classification per the durability tiers. For each file outside the canonical paths, the model proposes one of three dispositions (move to scratch, add to `.gitignore` block, commit as-is) and waits for the user's confirmation before any move/delete. Skipped silently if the working tree is empty or contains only modified files within tracked canonical paths.

### Why

The user reported 123 uncommitted files for one feature implementation; only ~10% were durable deliverables. Two-thirds were Playwright debug captures dumped to project root (the v5.2.0 path hook now prevents new ones). The remainder were intermediate analysis dumps written to `design/<subdir>/` paths instead of a scratch dir. The plugin had no concept of "throwaway working artifact" — every skill wrote to a permanent location. v5.3.0 introduces the scratch dir, the durability tiers, the `.gitignore` curation, and the end-of-implementation tidy-up gate so the user can run `git add -A` without thinking and only ship what should ship.

## [5.2.0] – 2026-05-03

Playwright filesystem hygiene. Stops Playwright captures from polluting project roots across long sessions.

### Added

- **`hooks/de-playwright-path-hook.js`** — new PreToolUse hook on `mcp__playwright__browser_take_screenshot`. Inspects `tool_input.filename` and denies the call if the filename is missing, absolute, contains `..`, or doesn't start with one of the canonical prefixes: `design/reviews/`, `design/craft/references/captures/`, `design/.scratch/playwright/`, or `tests/`. Deny message is structured: names the failure, lists the four allowed prefixes with concrete examples for each capture purpose, and suggests the timestamped scratch path for throwaway debug captures. Fail-open on parse / IO errors. Logs each fire to `~/.claude/cache/de-playwright-path.log` for debugging. Registered in `hooks/hooks.json` PreToolUse.
- **CLAUDE.md "Playwright filesystem hygiene" section** — documents the four canonical paths with a table of capture purpose / path / lifetime. Names the forbidden patterns explicitly (`filename: "screenshot.png"`, unprefixed filenames, absolute paths, parent-traversal). Introduces `design/.scratch/playwright/<YYYY-MM-DD-HHMMSS>/` as the home for throwaway captures (visual verification, "let me check this URL", exploratory analysis, design comparisons) and notes the directory is git-ignored.

### Changed

- **`commands/design-engineer/dev.md` "Visual verification" step** — Step 3 ("Take a screenshot") rewritten to specify the canonical scratch path and to remind the model that the path hook denies unprefixed filenames. Includes the `mkdir -p` precondition.

### Why

Before this release, `mcp__playwright__browser_take_screenshot` calls without an explicit `filename` argument wrote to `process.cwd()` (the project root), accumulating stray `screenshot.png` / `snapshot.png` / `page-1.png` files across review sessions, visual verifications, and ad-hoc analysis. The plugin specified canonical paths for some capture purposes (audit, moodboard) but had no rule for visual verification or exploratory captures, so the model defaulted to no path and Playwright defaulted to root. The hook makes the contract enforceable; the CLAUDE.md section names where everything should go and why.

## [5.1.3] – 2026-05-03

Tightened the per-phase commit rule in `dev.md` so the implementation flow stops batching commits at the end.

### Fixed

- **`/design-engineer:dev` Step 8.g was too terse and the model was treating it as a non-blocking suggestion.** The CLAUDE.md "Plan Mode" section step 7.k already specified per-phase commits with full Mode 1 wording, but the runtime command body in `commands/design-engineer/dev.md` Step 8.g said only "After approval, commit using `dev-github-workflow`" — three words past "commit". The model was reading the abbreviated version at the moment it mattered and deferring commits to the end of implementation. Replaced with explicit `BLOCKING REQUIREMENT — commit and push BEFORE starting the next phase` wording: full Mode 1 invocation (Conventional Commits + phase context + plugin attribution footer), explicit prohibition on batching ("Do NOT defer commits to the end of all phases. Do NOT batch multiple phases into a single end-of-implementation commit. Phase boundaries are commit boundaries — one phase, one commit, in the same turn the user approves it"), and a turn-blocking gate ("The next phase does not start until this phase is committed and pushed"). Also added the `Read ${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/dev-github-workflow/SKILL.md` instruction with the standard "do NOT use the `Skill` tool" guard. (`commands/design-engineer/dev.md`)

## [5.1.2] – 2026-05-03

Reframed the compact-message rule in CLAUDE.md from auto-trigger to user-asks-only.

### Changed

- **CLAUDE.md "Context Monitoring" section renamed to "Compact-message format (when the user asks for one)".** The old rule told the model to proactively warn the user when it estimated context was at 90%, but Claude Code does not inject context-window usage into the model's turn-by-turn context — the model has no reliable way to estimate its own usage from inside a turn. The auto-trigger never fired consistently in practice. Replaced with a clear user-triggered contract: when the user asks for a compact message (via `/design-engineer:stop` or by typing "compact message" / "summarize for /compact" in chat), generate one grounded in the actual session state from `.design-engineer-plugin/config.yaml` and the compound-documenter memory. Explicit don'ts now flag the failure mode the user reported (generic vague summary with placeholder fields, conversational filler before the message, generation without first reading config + agent memory).

## [5.1.1] – 2026-05-03

README + CLAUDE.md catch-up after v4.9.0 → v5.1.0. The FAQ had drifted out of sync with the actual plugin behavior.

### Changed

- **FAQ 3 (existing project)** expanded with the spec-polish routing question, the optional-depth multi-select, the conditional Figma hand-off, the proactive CLAUDE.md scaffold + reuse-vs-provide references question, and the abbreviated feature flow's process-recall behavior. Old text said `/design-engineer:start` "auto-detects context" and stopped there — readers had no way to anticipate the routing the existing-project path actually does.
- **FAQ 8 (background hooks)** added two missing entries (process recall, background continuation block) and rewrote the design-intake-validation bullet to reflect tier scaling (trivial / medium / large). Mentioned the prototype TDD exemption.
- **FAQ 12 (development workflow differences)** went from 3 differences to 5 — added explicit `Task()` agent invocation and tiered grounding overhead. Background-polling block also called out under phased implementation.
- **Top-level commands table reduced from 9 to 8.** `/design-engineer:mute-unmute-sound` is now a utility, mentioned only at the bottom of FAQ 5 — it's something you toggle once or twice across the lifetime of the plugin, not part of any workflow.
- **CLAUDE.md "Directory Structure"** comment updated to "8 main commands + mute-unmute-sound utility" instead of "9 commands".

No new FAQ entries (per author preference). The five changes above all live inside existing question bodies.

## [5.1.0] – 2026-05-03

Tiered design-grounding for UI edits. The design-grounding hook now classifies each UI Edit / MultiEdit / Write into Trivial / Medium / Large based on change size and pattern, and the model receives tier-based instructions for the depth of the Pre-Flight block and whether to call `/simplify`. The user-reported pain — running the full Pre-Flight ritual + 3-agent `/simplify` fan-out for a one-token color swap — is gone. Hook still enforces all per-session gates (prototype Read, references.md exists, design-system.md Read if present) regardless of tier; only the per-edit ritual scales.

### Added

- **Tier classification in `hooks/de-design-grounding-hook.js`.** New helpers `computeChangeSize()`, `isSinglePropertySwap()`, and `classifyTier()` inspect `tool_input` for `Write`, `Edit`, and `MultiEdit`. Reuses the diff-inspection pattern already established in `de-fidelity-hook.js`. Trivial requires ≤5 lines AND a single CSS / style / Tailwind property pattern match; Write is never Trivial; MultiEdit qualifies only when all ≤3 edits are individually trivial.
- **Project design-system reference is now a required Read when present.** The hook scans for `.design-system/system.md` (written by `ui-design-system` Step 6) and `design/dev/design-system.md` (written by `ui-design-system` Step 5). When either exists, it joins the required-reads list. Stack-agnostic: web, mobile native, desktop — whatever the user wrote in their design-system.md is the source of truth. The hook does NOT add framework-specific files (no `tailwind.config.*`, no `src/lib/design-tokens.ts`).
- **Tier instructions injected into the deny message.** When the hook denies a UI write for missing reads, it appends a scaling table the model receives once and applies for the rest of the session: Trivial → 1-line `WHY:` only, no agent `/simplify`. Medium → compact 3-field Pre-Flight + single `/simplify`. Large → full 5-field Pre-Flight + `/simplify` (3-agent fan-out runs internally).

### Changed

- **`CLAUDE.md` "Code Quality: /simplify" section rewritten with tier table.** "After every Write/Edit, mandatory" replaced with the per-tier rule. Final-pass `/simplify` before `design-system-auditor` still always runs as Large regardless of last edit size — it audits the cumulative diff. Prototyping exemption unchanged.
- **`CLAUDE.md` new section "Design Grounding Pre-Flight scaling".** Documents the tier definitions, the per-tier Pre-Flight depth, and the gates that fire regardless of tier (prototype, references.md, design-system.md).
- **`commands/design-engineer/dev.md` Step 8.b** rewritten to reference the tier table instead of "mandatory after every Write/Edit".
- **Trivial swaps now skip the 3-doc anti-pattern Read requirement.** The hook's check-3 is gated behind `tier !== 'trivial'`; trivial edits still require the prototype gate (check 1), the references.md gate (check 2), and the design-system gate (check 4) — only the heavy operating-procedure docs are bypassed.

## [5.0.1] – 2026-05-03

Hotfix on top of v5.0.0 — releases without version bumps don't reach users.

### Fixed

- **`hooks/de-start-state.sh` Case 2 was injecting stale AskUserQuestion text on every prompt in existing-project directories.** The hook embedded a duplicate of the goal-routing question from `commands/design-engineer/start.md`, including the old "Set up development" / "Configure the AI build pipeline" labels. After v5.0.0 renamed the option to "Prepare project for AI coding", the hook copy stayed on the old wording and the model rendered the stale labels even though the cached `start.md` was correct. Stripped Case 2 down to just `DESIGN_ENGINEER_PLUGIN_ROOT` + `DESIGN_ENGINEER_PROJECT_STATE: existing_project` markers; the command body's Step 0 disk re-detect is now the single source of truth for the routing question. (`hooks/de-start-state.sh`)

### Process

- **Release discipline added to CLAUDE.md.** Every commit pushed to `main` that touches user-facing code (commands, skills, agents, hooks, scripts) MUST bump the patch version in `plugin.json`, `marketplace.json`, and `README.md` and add a CHANGELOG entry. Reason: Claude Code's plugin cache is keyed by `<plugin>/<version>`, so pushing a fix to an unchanged version is invisible to `/plugin install` (it sees "already at X.Y.Z" and skips the fetch). The v5.0.0 → v5.0.1 round-trip exists only because v5.0.0 had a follow-up fix pushed without a version bump.

## [5.0.0] – 2026-05-01

Existing-project flow overhaul. Bumped to MAJOR (rather than MINOR) because the existing-project shape changes the visible contract: the abbreviated feature flow now asks a spec-polish routing question first, the dev pipeline no longer asks the 4-option fast-track / full / skip prompt, init-project-structure.sh no longer creates 11 stubbed `.gitkeep` folders, and the process-recall hook only fires inside high-process workflows. Behaviorally compatible for users who only ran `/design-engineer:start` on new products, but the existing-project entry path is reshaped enough to warrant a major bump. 15 user-reported issues from main-flow testing plus the removal of `/simplify` from prototyping, plus four follow-ups from the first round of v5 testing. Themes: hook gates so the process-recall nudge fires only inside structured workflows; proactive defaults so the assistant scaffolds CLAUDE.md and asks about references without prompting; lazy folder scaffolding so `init-project-structure.sh` only creates structural directories and skills `mkdir -p` their own; spec-depth routing in design.md (minimal vs full feature flow); optional-depth multi-select for psychology, Figma, and design-system audits; moodboard rewritten around curated Chrome previews and sectional Playwright capture; a hard rule that the assistant must not initiate background work while waiting on user feedback; and `/design-engineer:start` now re-detects state from disk so returning users skip the project-type question, with a guaranteed-visible welcome paragraph and plain-English goal options.

### Fixed

- **`/design-engineer:start` ignored existing on-disk config when the start hook injected `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin`.** The cached hook can lag behind disk reality (older plugin version installed, hook fired before config was written, hook ran in a different cwd). The command body now treats the injected state as a hint only and re-detects from disk via Bash + `cat .design-engineer-plugin/config.yaml` before any branching. Returning users in established-project directories now route directly to a "Welcome back" goal question instead of being asked the project-type question again. (`commands/design-engineer/start.md`)
- **`/design-engineer:start` produced no visible chat output before the first AskUserQuestion.** The Step 1 intro paragraph was wrapped in a blockquote which the model often interpreted as an example rather than required output, so users saw only the 3-horizontal-rule spacer above the panel. Reworded as an explicit "Required first output: a visible chat message" instruction with the paragraph rendered as plain text. (`commands/design-engineer/start.md`)
- **Path B Step 2 (Goal + Mode) had no acknowledgment between Step 1 and the question panel** — two consecutive AskUserQuestion calls produced two stacked spacers with nothing readable between them. Step 2 now requires a 1–2 sentence acknowledgment of the project-type choice plus a one-line preview of what's coming, emitted before the spacer. (`commands/design-engineer/start.md`)
- **"Set up development" goal option was jargon.** Renamed to "Prepare project for AI coding" with a plain-English description ("Generate the rules file (CLAUDE.md), wire up helper agents, and set up testing — useful before you start building features"). The Step 4 hand-off table also updated to route this option to `/design-engineer:dev setup` instead of bare `/design-engineer:dev`. (`commands/design-engineer/start.md`)
- **Status line install rejected by auto mode.** `/design-engineer:start` and `meta-setup` were trying to write `~/.claude/settings.json` and copy `de-statusline.js` to `~/.claude/hooks/`, which Claude Code's auto-mode permission classifier blocks because they live outside the working directory. Replaced with a `! <command>` paste-block pattern the user runs themselves in their next prompt. (`commands/design-engineer/start.md`, `skills/meta-setup/SKILL.md`)
- **Process-recall hook fired on every prompt after onboarding.** The hook gated only on `.design-engineer-plugin/config.yaml`, so casual chat in plugin projects got `PROCESS RECALL CHECK` injections every turn. Added a `.design-engineer-plugin/.active-workflow` marker that high-process commands write at start and clear at end. The hook now requires both files. The marker also carries the workflow name so the injected text knows which flow is active. (`hooks/de-process-recall-hook.sh`, `hooks/hooks.json`, `commands/design-engineer/{dev,design,review}.md`, `skills/{dev-prototyping,ui-references-moodboard}/SKILL.md`)
- **Spec polish routing was implicit, leading to over-engineered specs for established products.** design.md jumped straight into the abbreviated feature flow without asking how polished the spec needed to be. Added an explicit Step 2.1 routing question (minimal one-pager → F1 branch vs full feature flow → continue) before any work begins. (`commands/design-engineer/design.md`)
- **Init script created 30+ empty `.gitkeep`-stuffed folders on every fresh project.** `init-project-structure.sh` aggressively scaffolded every potential design subdirectory whether the user needed it or not. Now creates only structural directories (`design/`, `.design-engineer-plugin/`, `plans/`); each skill `mkdir -p`s its own destination right before writing. Memory project-map seed moved into the init script too. (`skills/meta-setup/scripts/init-project-structure.sh`, 30+ skill SKILL.md files)
- **No proactive CLAUDE.md scaffold or references reuse-vs-provide question in dev.md.** The dev flow assumed CLAUDE.md already existed and that the user would volunteer references unprompted. Added Step 1.6 in dev.md so the flow scaffolds CLAUDE.md silently when missing, and a 2-option AskUserQuestion in `dev-claude-md` for "reuse existing references" vs "provide new references". (`commands/design-engineer/dev.md`, `skills/dev-claude-md/SKILL.md`)
- **Process-recall preamble read like bureaucratic boilerplate.** The injected text started with `PROCESS RECALL CHECK` and listed rules in legal-doc tone, which trained the model to ignore it. Rewritten as a humane preamble explaining what's happening to the user, with workflow-named step listing using the actual step names from the active skill or command body. JSON now emitted via `python3` so the embedded payload escapes correctly. (`hooks/de-process-recall-hook.sh`)
- **Sound notifications were not offered to existing projects.** `/design-engineer:start` Path B (existing-project onboarding) skipped the sound opt-in question entirely, so existing-project users had to discover `/design-engineer:mute-unmute-sound` to enable sounds. Added Step 3.e.5 with the same paste-this-command pattern as the status-line install. (`commands/design-engineer/start.md`)
- **dev.md feature-implementation Step 3 sub-steps used implicit "delegate to X" wording.** Sub-steps 7, 8.a, 8.d, and 9 said "delegate to test-writer / backend-implementer / frontend-implementer / design-system-auditor" without explicit `Task(subagent_type=...)` calls, which the model sometimes interpreted as "do it inline myself". Replaced with explicit `Task()` invocations. (`commands/design-engineer/dev.md`)
- **No way to debug whether the process-recall hook fired or which workflow it saw.** Added structured single-line logging to `~/.claude/cache/de-process-recall.log` (timestamp, workflow name, cwd) and documented the marker contract in CLAUDE.md under a new `## Process recall mechanism` section so future commands can opt in cleanly. (`hooks/de-process-recall-hook.sh`, `CLAUDE.md`)
- **Moodboard collected references via vague "share what inspires you" prompts.** Step 5 was a single open question with no curation and no high-quality capture. Replaced with Step 5a (curated reference proposals opened in Chrome for the user to pick) and Step 5b (sectional Playwright capture of the user's picks). Step 5 itself rewritten to introduce the two-stage flow. (`skills/ui-references-moodboard/SKILL.md`)
- **TDD hook blocked source-code writes inside `prototype/` directories.** The hook treated prototypes as production code, even though prototypes are explicitly throwaway visual artifacts. Added `/prototype/` to the hook's `EXEMPT_DIRS`. (`hooks/de-tdd-hook.js`)
- **`ui-design-system` skill was not wired into the design flow.** Phase 4 of design.md listed component design but never invoked the design-system audit, so the existing tokens and component inventory were never reconciled. Inserted `ui-design-system` as Phase 4 step 5 and renumbered the following steps. (`commands/design-engineer/design.md`)
- **Assistant would self-reschedule via `ScheduleWakeup` / `/loop` while the user was typing feedback.** During prototype iteration the model fired background continuations during user-feedback waits, causing the assistant to "continue on its own" before the user's input arrived. Added an explicit `## Background continuation rule` section to CLAUDE.md and a Step 7 sub-section in `dev-prototyping/SKILL.md` listing forbidden background mechanisms (`ScheduleWakeup`, `CronCreate`, `RemoteTrigger`, `/loop` in any variant, `Task` and `Bash` with `run_in_background: true` for non-build work) during feedback waits. (`CLAUDE.md`, `skills/dev-prototyping/SKILL.md`)
- **No way to add psychology / Figma / design-system audits without re-running the full pipeline.** Existing-project flow had a generic "ask the user about optional depth" hint with no structured selection. Replaced with a multi-select Step 2.5 (problem statement, psychology audit, Figma comparison, design-system check) that persists choices to `config.yaml` and routes to the corresponding skills. dev.md gained a new Step 1.5 to read the persisted feature options. (`commands/design-engineer/design.md`, `commands/design-engineer/dev.md`)
- **Existing-project flow had no Figma hand-off step before `/dev`.** Even when a Figma project was connected, design.md handed off to dev without offering to pull structured Figma data first. Added a conditional Step 2.55 that fires when Figma is connected and the user did not already select "Figma comparison" in Step 2.5. (`commands/design-engineer/design.md`)

### Changed

- **Process-recall hook contract.** The hook now requires both `.design-engineer-plugin/config.yaml` and `.design-engineer-plugin/.active-workflow` to fire. Workflow names that write the marker: `dev:feature-implementation`, `design:full-pipeline-phase1` through `phase4`, `review:full-audit`, `prototype:storyboard`, `prototype:interactive`, `moodboard:exploration`. The Stop hook in `hooks.json` now clears the marker as one of three Stop actions.
- **Init script scope.** `skills/meta-setup/scripts/init-project-structure.sh` now creates only `design/`, `.design-engineer-plugin/`, `plans/`, `plans/archive/`, and seeds `.design-engineer-plugin/memory/project-map.md`. Skill-specific subdirectories (`design/research/`, `design/features/`, `design/craft/images/`, etc.) are now `mkdir -p`'d by each skill right before its first Write call.
- **Optional-depth selection.** design.md Step 2.5 is now a multi-select AskUserQuestion that persists to `config.yaml` under `project.feature_options:`. dev.md Step 1.5 reads that list and surfaces the selected audits during implementation grounding.

### Removed

- **`/simplify` invocation removed from `commands/design-engineer/prototype.md`.** Prototypes are throwaway visual artifacts where code quality doesn't matter. The `/simplify` call was replaced with an explanatory note pointing users to `/design-engineer:dev` for the production-code simplification pass. (`commands/design-engineer/prototype.md`)

## [4.8.6] – 2026-04-28

Reverts the v4.8.5 bash-injection approach, which crashed `/design-engineer:start` in Auto mode.

### Fixed

- **`/design-engineer:start` crashed with `Shell command permission check failed for pattern "!..."`** in Auto mode and any restrictive permission preset. v4.8.5 added a `## Plugin paths (authoritative)` block at the top of every command using bash injection (`` !`ls -d ...` ``) to resolve the absolute plugin root at command-load time. While bash injection IS documented for slash commands, Claude Code's permission system blocks `!`-prefix patterns at load time when it can't statically evaluate them — denying the action with `Reason: Insufficient information about the Bash command to evaluate; action is unverifiable.` Effectively, bash injection in command bodies is unusable in non-interactive permission modes.
- **Replaced with a permission-free approach.** The plugin's UserPromptSubmit hook (`hooks/de-start-state.sh`) already injects `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` as `additionalContext` text on every prompt. The model sees that line in its conversation context and uses it as the substitution value when it encounters `${DESIGN_ENGINEER_PLUGIN_ROOT}/...` in the command body. No shell commands run from the command body, no permission grants needed, no Skill-tool ambiguity. This is the same mechanism the plugin used in v4.8.0–v4.8.4 — v4.8.5 was a regression.
- **Updated CLAUDE.md** with the new convention (replaced the bash-injection block with the simpler hook-context note) and added an explicit "Mechanisms NOT to use, and why" section listing bash injection, `${CLAUDE_PLUGIN_ROOT}` in command bodies, and the Skill tool for plugin skills as forbidden, with the failure modes documented.

### Why this is the right approach

The "documented mechanism" angle from v4.8.5 was overstated. Hook-injected `additionalContext` is a documented Claude Code feature (https://code.claude.com/docs/en/hooks.md#userpromptsubmit) — the model sees the injected text and processes it like any other context. Substituting a value-from-context into a path string is plain text processing, not a Claude Code-specific feature. The fact that `${DESIGN_ENGINEER_PLUGIN_ROOT}` happens to look like a shell variable is incidental — the model treats it as a placeholder it fills in from visible context. This works in every permission mode and matches how the rest of the plugin already operates.

## [4.8.5] – 2026-04-28

Audit pass: switched plugin-path resolution in command bodies from undocumented mechanisms to documented bash injection, eliminating an entire class of "skill won't load" bugs.

### Changed

- **Path resolution in commands now uses documented bash injection.** Previously, slash command bodies referenced `${DESIGN_ENGINEER_PLUGIN_ROOT}/...` and relied on the model to substitute the value from hook-injected `additionalContext`. That worked empirically but is not a documented Claude Code mechanism — the docs reserve `${CLAUDE_PLUGIN_ROOT}` for `hooks/hooks.json` only, and don't define how custom env vars resolve in command markdown. v4.8.5 adds an authoritative `## Plugin paths` block at the top of every command (`start`, `design`, `dev`, `document`, `prototype`, `review`) using the documented bash-injection syntax: `` !`ls -d "$HOME"/.claude/plugins/cache/*/design-engineer/* | sort -V | tail -1` ``. The output is inlined as a literal absolute path at command-load time, before the model sees the rendered command. Subsequent `${DESIGN_ENGINEER_PLUGIN_ROOT}/...` references in the same command body resolve against that visible path. No more reliance on undocumented substitution.
- **CLAUDE.md codifies the convention.** New "Skill loading from commands (doc-compliant pattern)" section documents the required structure for every command: the bash-injection block at the top, the explicit "Read `<path>/SKILL.md`" instruction with mandatory "do NOT use the `Skill` tool" guard, and the forbidden phrasings ("load the X skill", "invoke the X skill", "use the X skill") that previously caused crashes. Future commands and skills must follow this convention.

### Why

v4.8.4 fixed the immediate `Skill design-engineer:meta-setup cannot be used with Skill tool` crash by changing wording, but left the underlying path-resolution mechanism (custom env-var substitution from hook context) undocumented and brittle. v4.8.5 closes that gap so the same class of bug cannot recur — every plugin-internal path is resolved by bash injection, which IS documented at https://code.claude.com/docs/en/slash-commands.md#inject-dynamic-context.

## [4.8.4] – 2026-04-28

`/design-engineer:start` no longer crashes on the very first run. Reported during fresh-install testing of v4.8.3.

### Fixed

- **`/design-engineer:start` immediately failed with `Error: Skill design-engineer:meta-setup cannot be used with Skill tool due to disable-model-invocation`.** The command's routing block told Claude to "load the `meta-setup` skill" – which Claude reasonably interpreted as a `Skill` tool invocation. But every plugin skill sets `disable-model-invocation: true` in its frontmatter (intentional – they're designed to be loaded by Reading their `SKILL.md` files inline, not invoked through the Skill tool). The Skill tool correctly rejected the call, blocking the entire onboarding flow before it could begin. Fix: replaced "load the X skill" wording across all six commands (`start.md`, `design.md`, `dev.md`, `document.md`, `prototype.md`, `review.md`) with explicit `Read ${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/<name>/SKILL.md` instructions plus an inline reminder not to use the `Skill` tool. Added an explicit "Skill invocation note" at the top of `start.md` calling out the convention. Behavior unchanged – this is purely a wording fix to make the existing intent unambiguous.

## [4.8.3] – 2026-04-27

Plugin no longer pollutes non-plugin project context with onboarding text. Reported during fresh-install testing of v4.8.2.

### Fixed

- **Onboarding instructions for `/design-engineer:start` were injected into Claude's context on every prompt in every project (~2 KB of text per prompt), even in unrelated repos.** The `de-start-state.sh` UserPromptSubmit hook's "no config" branch (Case 1) emitted the full multi-step onboarding flow as `additionalContext` on every prompt, regardless of whether the user was actually invoking the plugin. So Claude in `~/Cursor-projects/sales-agent-prototype` (or any other unrelated repo) silently paid a per-prompt token tax to carry instructions it would only ever consume if `/design-engineer:start` ran. Fix: relocate the onboarding text from the hook into `commands/design-engineer/start.md`. The hook now emits only `DESIGN_ENGINEER_PLUGIN_ROOT` and `DESIGN_ENGINEER_PROJECT_STATE: new_to_plugin` markers in non-plugin projects (~150 bytes). When the user invokes `/design-engineer:start`, the command body provides the same step-by-step instructions Claude used to receive from the hook – behavior is unchanged. Audit also confirmed that all 11 other plugin hooks already exit silently in non-plugin projects (CWD gate on `.design-engineer-plugin/config.yaml` was added per hook in earlier releases).

### Note (not a v4.8.3 fix)

The "Plugin directory does not exist: /Users/.../.claude/plugins/cache/design-engineer-plugin/design-engineer/X.X.X" errors that some users have seen are a **stale plugin registry** issue, not a plugin-source bug. They occur when the plugin's cache directory is removed from disk while Claude Code's plugin manager still has the plugin registered as installed at that version. Fix is operational: run `/plugin install design-engineer@design-engineer-plugin` to repopulate the cache. v4.8.3 cannot fix this from plugin source.

## [4.8.2] – 2026-04-27

Sound system: opt-in by default and gated to plugin projects. Reported during fresh-install testing of v4.8.1.

### Fixed

- **Sounds played before the user was asked.** Sound hooks fired on the very first Stop/Notification after install, before `/design-engineer:start` ran the setup question. Root cause: the playback shim only consulted a default-on global mute flag (`~/.claude/de-sound-muted`, presence = mute), so absence meant sounds were on by default. Fix: invert the flag semantics. New flag is `~/.claude/de-sound-enabled` (presence = on). Fresh installs are now silent until the user picks "Yes" during onboarding. The legacy mute flag is retired – `meta-setup` removes it on first run, and nothing in the new code reads it.
- **Sounds played in every project, not just plugin projects.** The playback shim never checked whether the current directory was actually a plugin project, so chimes fired in unrelated repos too. Fix: gate `de-play-sound.sh` on `.design-engineer-plugin/config.yaml` being present in CWD. Sounds in non-plugin folders now stay silent automatically. The `/design-engineer:mute-unmute-sound` command stays global – the project gate happens at the shim, not at the toggle.

**Upgrade note**: existing v4.8.0/v4.8.1 test installs lose sound after the upgrade until they run `/design-engineer:mute-unmute-sound` once (or re-onboard a project, which asks again). No real-user migration is needed because the prior releases were one and two days old respectively at the time of this fix.

## [4.8.1] – 2026-04-27

Two onboarding-flow bug fixes reported during fresh-install testing of v4.8.0.

### Fixed

- **Process-recall list shown at the very first prompt of a fresh install.** The plugin's `de-process-recall-hook.sh` fires unconditionally on every UserPromptSubmit, and the onboarding context injected by `de-start-state.sh` reads as a "process" to Claude – so the first thing a brand-new user sees is an enumerated step list before any introduction. Fix: short-circuit the recall hook with `exit 0` when `.design-engineer-plugin/config.yaml` is absent (= first-touch install). Once onboarding writes the config, the recall hook resumes normally on every subsequent prompt as designed.
- **Welcome AskUserQuestion overlaid and cut off the intro text.** The 3-line spacer rule lives in `CLAUDE.md` rule #6, but `CLAUDE.md` is not auto-injected into hook-driven flows – so on first run the model never saw the rule and emitted no spacer. The question panel then overlaid the last 2–3 lines of the intro paragraph ("a swiss knife for product design… all in" was the only visible text). Fix: include the spacer rule (with the literal 3-horizontal-rule block) directly in the onboarding context that `de-start-state.sh` injects, for both the first-touch case and the existing-project welcome case.

## [4.8.0] – 2026-04-26

Audit-driven full remediation. After v4.7.0 shipped, the author commissioned a comprehensive 6-phase audit of the entire plugin (`audit/2026-04-26-comprehensive/`) that produced 108 findings (2 BLOCKER, 55 HIGH, 38 MEDIUM, 13 LOW). This release addresses every one of them in a single MINOR bump.

### Fixed (BLOCKERs)

- **Sound notifications were 100% broken since v4.1.0** (F-0010). The `meta-setup` install path wrote sound hook entries to `~/.claude/settings.json` with the `${CLAUDE_PLUGIN_ROOT}` variable, but per Anthropic plugin docs that variable only resolves inside the plugin's own `hooks/hooks.json`. So the hook commands never expanded and Stop / Notification fired nothing. Fix: register the sound hooks directly in plugin's `hooks/hooks.json` (Stop event for `de-complete.wav`, Notification event for `de-attention.wav`) where the variable resolves correctly. Preserve the install-time question in `/design-engineer:start` but flip it to control the existing `~/.claude/de-sound-muted` flag-file mechanism: "Yes" removes the flag (sounds play), "No" creates it (sounds suppressed). The `mute-unmute-sound` toggle keeps working unchanged. Migration cleanup: meta-setup detects legacy v4.1.0–v4.7.0 settings.json entries that referenced `de-play-sound.sh` and removes just those entries (preserves all other settings).
- **Fresh-project deliverable detection always returned `no`** (F-0291). `init-project-structure.sh` creates `design/` at project root, but `detect-environment.sh:102,104,228` checked `documents/design/` (a legacy convention removed in v3.0.0). So every fresh-scaffolded project reported `Deliverables: no` regardless of state. Fix: align all 4 references on `design/` (3 in detect-environment.sh, 1 in `de-design-grounding-hook.js`'s prototype path). The grounding hook's path candidate also changed from `documents/design/prototype/prototype.html` to `prototype/prototype.html` to match what `init-project-structure.sh:64` actually creates (`prototype/` is at project root, sibling of `design/`, not nested under it). The folder-doc tree in `meta-setup/SKILL.md` was rewritten to match the real scaffolded structure (`design/` with `craft/` as the design-deliverables subfolder, not nested `design/design/`).

### Changed (sweep)

- **~335 em dashes replaced with en dashes across plugin source.** CLAUDE.md rule #1 forbids em dashes; the plugin self-violated this rule across 90% of files. Mechanical sed pass on `skills/`, `agents/`, `commands/`, `hooks/`, `README.md`, `CLAUDE.md` (`CHANGELOG.md`, `plans/archive/`, `audit/` deliberately skipped as historical record). Scoped per user direction.
- **Skip-check preamble normalized across 7 ux-* skills** (`ux-storybrand`, `ux-business-plan`, `ux-problem-statement`, `ux-target-audience`, `ux-assumptions`, `ux-competitor-analysis`, `ux-story-panels`). The v4.7.0 sweep had drifted: most read only `existing_X`, some added `shipped_ui` softer signal, ux-problem-statement and ux-story-panels used both. Now every preamble reads BOTH keys in identical structure: `existing_<artifact>: true` OR `shipped_ui: true` AND user did not explicitly request rerunning → ask via AskUserQuestion (use-as-is / refine / re-run anyway).
- **Figma MCP routing clarified** (F-0080). The `ui-figma-handoff` skill required tools from the third-party `figma-console` MCP that the plugin doesn't bundle. Author had it locally; everyone else got dead tools. Fix: keep both Figma MCPs documented (the bundled `figma` MCP at mcp.figma.com is the default; `figma-console` is opt-in for advanced workflows). `ui-figma-guide` Step 1 now labels options as "Figma Plugin (Recommended, bundled)" and "Both (advanced – requires figma-console install)" with the GitHub install link surfaced when picked. `ui-figma-handoff` adds an explicit Prerequisites section with the install pointer and a tool-availability check at Step 1. `dev-mcp-setup` and the README skill catalog cross-reference. PreToolUse matcher in `hooks/hooks.json:56` cleaned to `get_screenshot` only (drops the figma-console-only matchers that were dead for users without that MCP).
- **Agent headings normalized to sentence case** (CLAUDE.md rule #2): 116 headings across 9 of 10 agents converted from Title Case to sentence case. Acronyms preserved (RED, GREEN, MCP, etc.) and one intentional caps heading kept (`The Iron Law` in test-writer.md).
- **`commands/design-engineer/mute-unmute-sound.md` documentation updated** to reflect that sound hooks are bundled in `hooks/hooks.json` (no separate install required); removed stale "wired through ~/.claude/settings.json" wording.
- **`commands/design-engineer/stop.md` and `mute-unmute-sound.md` got missing `argument-hint:`** frontmatter (empty string for consistency with other commands).
- **Spacer-rule reminders added to 4 commands** that use AskUserQuestion (`design.md`, `dev.md`, `review.md`, `stop.md`). Top-of-file note pointing to CLAUDE.md rule #6 so the runtime model emits the canonical 3-horizontal-rule spacer before every AskUserQuestion call.
- **`commands/design-engineer/dev.md` design-grounding pre-flight** now documents missing-file behavior explicitly: prototype absent → skip (feature-spec branch supports this), references.md absent → hook denies with clear message, plugin docs missing → install corrupt, CLAUDE.md missing → hard-block with scaffolding instruction. Plus a canonical `meta-document` invocation rule (end of every phase, never mid-phase).
- **`commands/design-engineer/design.md` feature-spec branch** got an advisor checkpoint at F1.3.5 (after spec drafted, before user handoff) – mirrors the per-phase advisor pattern in the main pipeline.

### Added

- **`hooks/hooks.json` Notification event registration** for the attention sound. Previously only Stop was used (and only for `session_dep_summary.py`). Both sound hooks now share the same shim and respect the same `~/.claude/de-sound-muted` flag.
- **Defensive read pattern documented in `agents/compound-documenter.md` body** (was only in CLAUDE.md). Author of compound-documenter no longer has to read CLAUDE.md to know the rule.
- **Required vs Optional pre-reads sections in `agents/frontend-implementer.md`.** Calling skills now know what to brief vs. what's optional. Includes explicit fallback when prototype absent.
- **Invocation contract preamble at top of `agents/advisor.md` body**: "you receive a brief, return one short enumerated plan or course correction, and stop. No prose. No tools. No user-facing output."
- **Concrete file path in `agents/context-analyzer.md`**: status tracking file = `.claude/agent-memory/compound-documenter/pipeline-state.md` (was ambiguous "status tracking file").
- **`compatibility:` frontmatter documented as a deliberate plugin extension** in CLAUDE.md (not Anthropic-canonical, but harmless – Anthropic ignores unknown keys). Both shape variants accepted.
- **8 eval coverage stubs added to `evals/evals.json`** for the previously-uncovered skills: `advisor`, `dev-component-gallery`, `meta-setup-configure`, `meta-setup-existing`, `meta-setup-welcome`, `shared-references`, `ui-images`, `ui-landing-page`. Smallest-end-to-end stubs to flag regressions; full eval execution is a v4.9.0+ effort.
- **`skills/dev-mcp-setup/references/essential-mcps.md`** created (the references/ directory was empty per audit). Documents the 3 bundled MCPs + 1 optional companion with purpose, when-to-use, and prerequisites.
- **8 `references/section-N-case-studies.md` stubs** in psych skills missing them: `psych-cognitive-biases`, `psych-decision-fundamentals`, `psych-decision-persuasion`, `psych-delight-design`, `psych-emotional-retention`, `psych-habit-formation`, `psych-pricing-psychology`, `psych-time-perception`. Stubs reference the principle file and explain the format; author fills in real cases over time.

### Doc fixes

- README "51 skills" → "57 skills" (line 67 was internally inconsistent with three other places saying 57). CLAUDE.md "9 specialized agents" → "10", "54 hidden skills" → "57 skills (56 with SKILL.md + 1 reference-only)". Sub-folder reference `commands/de/` → `commands/design-engineer/` to match v4.0.0 prefix rename.
- `agents/advisor.md` and `skills/dev-component-gallery/SKILL.md` frontmatter: added missing `disable-model-invocation: true`. CLAUDE.md mandates it on every skill/agent.
- `skills/advisor/SKILL.md` frontmatter: added missing `disable-model-invocation: true` AND `effort: medium`.

### Hooks + scripts polish

- `skills/meta-setup/scripts/detect-state.sh`: added `set -euo pipefail` (consistent with the other two scripts in the folder).
- `chmod +x` on every shell script and hook (was inconsistent: 6 hooks lacked the executable bit). Plugin scripts were always invoked with explicit interpreter (`bash`, `node`, `python3`) so the missing bit didn't break anything, but the consistent permission is hygiene.
- PreToolUse matcher cleanup: `get_screenshot|figma_capture_screenshot|figma_take_screenshot` → `get_screenshot` only. The two figma-console matchers were dead for users without that MCP.

### Notes

- **No skill-content changes**, only seam fixes. Skip-check rewrites preserve every non-preamble word; em-dash sweep preserves every code block; the long-skill split (F-0127, F-0143, F-0148, F-0187) was deferred – all 6 long skills are under the 500-line CLAUDE.md cap, so splitting was optional, not required.
- **Two findings explicitly deferred to v4.9.0+**: F-0082 (playwright MCP usage decision; needs UX research on whether MCP would beat current Bash invocation) and F-0283 (statusline symlink design; structural rework of how plugin's statusline is installed). Both documented in `audit/2026-04-26-comprehensive/LEDGER.md` "Recommended remediation order".
- **Audit method** (for transparency, per the v4.2.0 source-citation requirement): 6-phase plan executed with sub-agent waves – Phase 0 baseline + canonical Anthropic docs fetch, Phase 1 matrices + reference graph + MCP catalog, Phase 2 ten parallel surface audits (skills/agents/commands/hooks/scripts), Phase 3 docs cross-check, Phase 4 fixture-traced behavioral, Phase 5 process & coverage, Phase 6 synthesis. Full audit including `99-ledger.json` source-of-truth findings + per-surface reports preserved at `audit/2026-04-26-comprehensive/`. The author had previously hand-tested for 18+ feedback rounds; the audit found seams the testing missed.
- **No version skip**: PATCH was considered (v4.7.1 for BLOCKERs only) but rejected per user direction – single MINOR ship is cleaner.

## [4.7.0] – 2026-04-26

Plugin author's own feedback: the plugin worked at maybe 30% of its potential on existing/commercial projects because it was structurally biased toward new-from-scratch pet projects. ~9-11 ux-* skills (StoryBrand, business plan, problem statement, target audience, assumptions, competitor analysis, user interviews, behavior mapping, story panels) assumed a blank slate. The Feature flow imposed Phase 3 (mvp-requirements + IA) as the default entry, which is overkill for "add one feature to a B2B app that already has docs." Two concrete commercial scenarios were unsupported: big page-by-page redesign with designer-feedback capture, and minimal feature spec for established products.

The simpler approach chosen (after rejecting schema-and-multi-release over-engineering): auto-detect existing-project state in `detect-environment.sh`, capture the user's off-repo references via the onboarding hook (Figma, Notion, Linear, etc.), persist to `.design-engineer-plugin/config.yaml` under `project.context`, and let biased skills read those fields with a one-sentence skip-check. Two new workflow branches as arguments to existing commands — no command sprawl.

### Added

- **`skills/meta-setup/scripts/detect-environment.sh` — Project Context Detection block.** Scans for design-system markers (`design-system/`, `tokens.css`, `theme.ts`, custom `tailwind.config.js`, etc.), brand docs (`BRAND.md`, hefty `README.md`), specs folders (`docs/`, `documentation/`), shipped UI markers (`app/`, `pages/`, `src/routes/`, etc.), and component count. Outputs as structured `[FOUND] / [INFO] / [NONE]` lines the onboarding hook parses.
- **`hooks/de-start-state.sh` — STEP 3 sub-step `b.5` (Project context check).** Shows the detected context to the user in plain language ("Looks like an established project — found a design-system folder at src/design-system/, a long README, 34 components shipped under app/."), asks ONE multi-select AskUserQuestion about off-repo references (Figma, Notion / Confluence, Linear / Jira, external design-system page like Storybook / Zeroheight), persists everything to `.design-engineer-plugin/config.yaml` under `project.context`. The hook is the source of truth for the onboarding sequence; the `meta-setup-existing` skill is a thin reference (corrected from initial draft).
- **Skip-check across 7 ux-* skills with canonical deliverables**: `ux-storybrand`, `ux-business-plan`, `ux-problem-statement`, `ux-target-audience`, `ux-assumptions`, `ux-competitor-analysis`, `ux-story-panels`. Each gets the same-shape "Existing-project skip-check" section at the top: read the relevant `project.context` field; if the artifact already exists in repo or off-repo, ask the user "use as-is / refine / re-run" before regenerating.
- **Input-augmentation pattern across 2 ux-* skills with no canonical deliverable**: `ux-user-interviews` and `ux-behavior-mapping`. Different shape because these skills enrich existing analyses rather than write canonical files — they ask the user to share existing research/behavior data and treat it as starting context, not a blank slate.
- **Established-product scope reduction in `ux-mvp-requirements` and `ux-information-architecture`.** When `shipped_ui: true` AND the user is here for a single feature, scope narrows to that feature's mvp / IA only — outputs go to `design/features/[feature-slug]/` instead of project-level files.
- **`commands/design-engineer/review.md audit` argument branch (Step A1).** Page-by-page commercial audit with Playwright. Per page: capture screenshot + DOM, run `psych-scanner` + `ui-aesthetic-review` + `design-system-auditor` + `ux-motivation-audit`, present findings, capture designer's professional feedback via AskUserQuestion, write per-page deliverable to `design/reviews/[YYYY-MM-DD]-audit/[page-slug]/audit.md` (with screenshot.png alongside). Cross-page synthesis at `SUMMARY.md`. Hand off to `/design-engineer:dev` or `/design-engineer:design feature-spec`. **Audit moved here from design.md per Ultraplan correction**: review.md is for finding issues; design.md is for designing.
- **`commands/design-engineer/design.md feature-spec` argument branch (Step F1).** Minimal feature spec for established products. Verifies `shipped_ui: true` AND a design system / brand docs exist. Drafts a one-page spec respecting existing brand voice. No StoryBrand. No business plan. No full Phase 3. Output to `design/features/[feature-slug]/feature-spec.md` (`design/features/[slug]/` is already an established convention from design.md's Feature flow).
- **review.md component-gallery discoverability note.** Single line near the top reminding users that `design-system-auditor` auto-scaffolds the component gallery (v4.6.0 transparent infrastructure) when components exist but no gallery yet.

### Notes

- **No new commands.** Both new workflows are arguments to existing commands per user preference (no command sprawl).
- **No `meta-orchestrator` edit.** The orchestrator owns the from-scratch pipeline; the new argument branches bypass it intentionally (Ultraplan correction to initial draft).
- **No schema, no abstractions.** `.design-engineer-plugin/config.yaml` gets a few `project.context` fields. No new files, no new concepts, no parallel scripts. Skills read those fields directly.
- **Backward-compatible.** Existing flows still work. The skip-check only fires when state is captured AND the relevant artifact exists; greenfield projects skip both questions and skip-checks entirely.
- **Sources cited per the v4.2.0 source-citation requirement.** Structural inspiration: `dkozitsky/shared_skills` atomic-design-skills repo (5 skills: `atomic-init`, `atomic-audit`, `atomic-component`, `atomic-token`, `atomic-refactor`). We did NOT mirror its 5 skills — borrowed only the structural insight that "from-scratch vs from-existing" should be first-class, not buried as a flag. Reused infrastructure: existing `detect-environment.sh`, existing onboarding hook, existing `psych-scanner` / `ui-aesthetic-review` / `design-system-auditor` / `ux-motivation-audit` agents, existing `dev-prototyping` Playwright integration, existing `design/features/[slug]/` convention from design.md, v4.6.0 component-gallery auto-scaffold.

## [4.6.0] – 2026-04-26

Beta tester wanted a Storybook+Figma-style **single-page component gallery** — every component, every variant, all visible in one viewport, with source-path labels per entry — to address two specific failure modes: (a) Claude tends to create five new versions of an existing component because there's no visual inventory, and (b) code-level inspection lacks visual clarity ("наглядність"). The motivating reference was Yana's `yananaaas.github.io` page (pill-tab navigation across categories, real components rendered with production styles, source attribution per entry). User explicitly rejected Storybook ("not enough visual clarity — it's a docs site, not a canvas").

The big design decision: the plugin works for "literally everything" — iOS, Android, Flutter, SwiftUI, Compose, web frameworks not yet invented — so the gallery scaffolder cannot carry a hardcoded "framework → location" table. It adapts. On every invocation, the new skill queries the **bundled context7 MCP** (shipped since v4.3.0) for the project's framework's idiomatic single-page showcase pattern and scaffolds accordingly: SwiftUI `#Preview` canvas, Jetpack Compose `@Preview`, Next.js route, Astro page, Flutter widgets-gallery, vanilla HTML — whatever the docs say is current for the project's specific stack and version.

### Added

- **`skills/dev-component-gallery/SKILL.md` — stack-agnostic gallery skill (Opus 4.7 / high effort).** Detects stack via existing `skills/meta-setup/scripts/detect-environment.sh` plus targeted file checks (`Package.swift`, `pubspec.yaml`, `build.gradle`, `Cargo.toml`, `package.json`, etc.). Queries context7 (`mcp__plugin_design-engineer_context7__resolve-library-id` then `query-docs`) for the framework's idiomatic showcase pattern. Plans file path / format / access mechanism from the docs results. Scaffolds with the universal Gallery Contract at the top in language-appropriate comments. Seeds with all currently-existing components (real imports, no styles, source-path labels). Updates the gallery when components change. For ambiguous context7 results: consults the advisor (v4.5.0) before committing to an interpretation; falls back to AskUserQuestion if still unclear; persists the answer in `.design-engineer-plugin/config.yaml` under `gallery.path`.
- **`skills/dev-component-gallery/references/gallery-contract.md`** — the canonical universal contract text + per-language comment-syntax adaptation table (JS/TS/Swift/Kotlin/Dart/HTML/Vue/Svelte/Astro/Rust/Python/etc.). The skill reads this on every invocation so the contract stays consistent across stacks.
- **`skills/dev-component-gallery/references/context7-prompts.md`** — exact context7 query templates (primary + fallback) so results are reproducible across runs and visible to maintainers.
- **`agents/frontend-implementer.md`** — gallery-sync responsibility added to core duties: after creating/modifying any component, invoke `dev-component-gallery`; never duplicate or restub components in the gallery; never inline styles; variants only via the component's public API. Plus a new before-implementation step: read the existing gallery to avoid creating duplicate components.
- **`agents/design-system-auditor.md`** — gallery audit pass at FAIL severity (every component has an entry, no inline styles in gallery, imports resolve to production paths, visually-identical entries flagged as duplicates, variants via API only).
- **`skills/dev-claude-md/SKILL.md`** — generated project CLAUDE.md now includes a top-level Component Gallery Contract section so the rule survives in the user's repo.
- **`skills/dev-prototyping/SKILL.md`** — Lifecycle relationship section added (prototype = design exploration before implementation; gallery = shipped components after — opposite rules, opposite purposes).
- **Plugin `CLAUDE.md`** — top-level Component Gallery Contract section, immediately after Code Quality / before TDD sections.

### Notes

- **Transparent infrastructure, not a menu pick.** The gallery is auto-scaffolded the first time `frontend-implementer` touches a component or `design-system-auditor` runs an audit on a project with UI components — no menu, no permission ask, no "do you want a gallery?" prompt. The user discovers it via a single one-line mention when it's first created ("Created a component gallery at <path> — open it to spot duplicates and check visual consistency"). After that, gallery updates are silent — same as a build artifact, not a thing the user has to think about. Authoring decision: users shouldn't have to know what "component gallery" means before they can benefit from one.
- **Live token editing dropped from v1.** Beta tester originally wanted live color/size/timing editing, but the user (plugin author) decided it isn't reliably implementable across "literally everything" the plugin runs in. Read-only gallery for now.
- **Gitignore dropped.** The gallery is committed to git like any other source file. Author: "I see no issues in keeping it on git too."
- **Markup-snapshot trade-off explicitly rejected.** An earlier draft proposed documenting framework components by their rendered HTML output — drift-prone, unreliable. The final design uses the framework's own runtime (Next/Vite/Xcode/AS/etc.) to render real components.
- **No hooks.** Enforcement lives entirely in dev skills/agents per user preference. The user has historically pushed back on rigid hooks (process-recall hook, v4.1.2 → v4.1.4 loosening) and asked that the rule live "in skills/agents related to development" instead.
- **Stack-agnostic via context7, not enumeration.** Every other "framework gallery" tool out there enumerates supported frameworks. This one asks the docs each time. Adds zero coupling to specific frameworks.
- **Sources cited per the v4.2.0 source-citation requirement.** Visual reference: Yana's `yananaaas.github.io`. Reused infrastructure: `skills/meta-setup/scripts/detect-environment.sh` (existing detection) and the bundled context7 MCP (`mcp__plugin_design-engineer_context7__*`). Fallback to advisor consult uses the v4.5.0 advisor pattern.

## [4.5.0] – 2026-04-26

Beta tester asked the plugin to embody Anthropic's [advisor strategy](https://claude.com/blog/the-advisor-strategy) — pair a faster executor with a higher-intelligence advisor that provides strategic guidance at high-leverage moments. The literal [`advisor_20260301` server tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) is an Anthropic API beta and Claude Code plugins can't toggle the request-level beta header — so the plugin ships the **strategy** instead: a dedicated Opus 4.7 advisor sub-agent that other skills consult at known checkpoints, with the docs' suggested system prompt baked in near-verbatim. User refinement: "make sure it really works, not just lays in the plugin wait for the user to manually invoke it" — Phase 2 of the plan wired active checkpoints throughout the existing pipeline.

### Added

- **`agents/advisor.md` — Opus 4.7 / xhigh advisor sub-agent.** No tools, no user-facing output. System prompt is the docs' three coding-task blocks (timing, treatment, conciseness) lightly adapted for sub-agent shape. Returns short numbered plans or course corrections in under 100 words — the docs report this conciseness instruction cut total advisor output 35–45% in internal testing without changing call frequency.
- **`skills/advisor/SKILL.md` — invocation primitive.** Documents when to call (verbatim from docs: BEFORE substantive work / when stuck / when changing approach / when task complete with deliverables durable), when NOT to call (verbatim: short reactive tasks, single-turn Q&A), how to invoke via `Agent` tool, how to treat the advice (verbatim treatment block), and the reconcile pattern for evidence conflicts ("I found X, you suggest Y, which constraint breaks the tie?"). Both source URLs cited at the bottom.
- **CLAUDE.md Plan Mode workflow now includes two advisor checkpoints**: pre-`ExitPlanMode` for non-trivial plans (early-task consult), and pre-phase-done after deliverables are durable (per-phase consult).
- **Active integration in all five `/design-engineer:` command files**: `start.md` documents the contract for the loaded onboarding skill to consult after env detection; `dev.md` adds a pre-done consult inside Step 8 sub-steps; `design.md` adds a per-phase advisor checkpoint section; `review.md` adds Step 4.5 pre-presentation consult; `document.md` adds Step 3.5 pre-finalize consult.
- **`skills/dev-github-workflow/SKILL.md` Mode 1 adds a divergence advisor checkpoint** before drafting the commit message, when implementation diverged from the approved plan.
- **`skills/meta-orchestrator/SKILL.md` adds an "Advisor checkpoints" section** naming the orchestrator-level moments (user-approval gate between Phase 4 and Phase 5, major phase transitions, non-standard path picks).
- **README banner v4.5.0** with a one-paragraph "Advisor pattern" feature entry and an advanced-API note for users calling Anthropic API directly.

### Notes

- **Fidelity gap**: the API advisor tool sees the full transcript automatically; Claude Code sub-agents are isolated. The skill explicitly tells callers to brief the advisor with task summary + tool results + decision point. Documented in the skill so users understand it's the strategy, not the literal API plumbing.
- **Cost**: the docs claim Sonnet+Opus advisor is net-cost-positive (-11.9% per agentic task on internal benchmarks) when paired with cheaper executor work and called only at transitions. Our pipeline shape matches that — checkpoints fire at phase boundaries and pre-hand-off, not per tool call.
- **Why no hook enforcement**: tempting to add a UserPromptSubmit hook that nags about advisor consult, but the user pushed back on overly rigid hooks earlier (process-recall hook, v4.1.2 → v4.1.4 loosening). Per the docs' own framing, the *executor* decides timing — checkpoints are written into workflow text, not enforced via PreToolUse.
- **Sources cited per the v4.2.0 source-citation requirement**: https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool and https://claude.com/blog/the-advisor-strategy.

## [4.4.0] – 2026-04-26

Beta tester wanted Claude Code's default `Co-Authored-By: Claude` trailer disabled on commits and PRs (per Anthropic docs, the official mechanism is `attribution: { commit: "", pr: "" }` in `~/.claude/settings.json`). User refinement: also scope the plugin's own attribution footer ("Built with design-engineer – ...") to plugin-driven commits only, so unrelated user work in other projects doesn't reference the plugin.

### Changed

- **`/design-engineer:start` setup now silently disables Claude Code's default Co-Authored-By trailer.** During meta-setup, the plugin reads `~/.claude/settings.json` and writes `attribution: { commit: "", pr: "" }` (preserving any existing custom user-set attribution — only writes the empty defaults if the field is absent or matches the default Anthropic text). No question asked; this is baked into setup.
- **Plugin attribution footer scoped to Mode 1 (plan-driven) commits only.** `dev-github-workflow/SKILL.md` now distinguishes: Mode 1 (Automatic, post-plan-approval) keeps the `Built with design-engineer – ...` footer; Mode 2 (Manual, user types "commit"/"push") drops the footer. Same split applies to PR descriptions: plan-completion PRs include the footer, manual user-invoked PRs don't.
- **CLAUDE.md plan workflow text updated** to clarify Mode 1 vs Mode 2 attribution scope.

### Notes

- **Respects user customization**: if you've already set a custom non-default `attribution` value in `~/.claude/settings.json`, the plugin won't overwrite it.
- **Why this matters**: when you use the plugin to drive a phased plan, the commit footer credits the plugin (informative). When you make ordinary commits in unrelated projects, the footer no longer appears (your work isn't tagged with the plugin).
- **Anthropic deprecation note**: `attribution` setting takes precedence over the deprecated `includeCoAuthoredBy`. We use the recommended path.

## [4.3.1] – 2026-04-26

Anthropic released Opus 4.7 and a new effort level `xhigh`. Plugin metadata refreshed accordingly.

### Changed

- **Pinned all opus-using skills and agents to `model: claude-opus-4-7`** (47 files). Previously used the `opus` alias which auto-resolves but obscures intent. Explicit pinning makes the plugin's quality expectations unambiguous and avoids alias drift across providers (Bedrock/Vertex/Foundry resolve `opus` to 4.6 today; we want 4.7 everywhere). Sonnet-using skills (16 files) keep the `sonnet` alias since Sonnet updates less variably.
- **Bumped `effort: max` → `effort: xhigh`** in 5 skills (`ux-bias-audit`, `meta-orchestrator`, `psych-full-scan`, `ux-ethics-review`, `ux-full-review`). Per Anthropic docs, `xhigh` is the new recommended default for Opus 4.7 ("Best results for most coding and agentic tasks. Recommended default on Opus 4.7"). It also persists across sessions; `max` was session-only.
- **CLAUDE.md guidance updated**: Model Configuration section pins `claude-opus-4-7` as the default Opus value with rationale. Effort Configuration adds `xhigh` as the recommended top-tier and demotes `max` to "exists but NOT recommended" with the documented Anthropic caveats (diminishing returns, session-only). Assignment principles updated: `claude-opus-4-7 + xhigh` for broadest scans, `claude-opus-4-7 + high` for deep analysis.

### Notes

- **Forward-compat trade-off**: when Anthropic releases Opus 4.8, pinned skills won't auto-upgrade. We'll do another bulk refresh then. Beta phase, acceptable.
- **Bedrock/Vertex/Foundry users**: `claude-opus-4-7` may not be available on third-party providers immediately. Per Anthropic docs, those providers fall back to a previous version with a notice — non-fatal but cosmetic. Users on those providers can override via `ANTHROPIC_DEFAULT_OPUS_MODEL`.
- **Effort fallback on Opus 4.6**: per docs, `xhigh` runs as `high` on Opus 4.6 (one tier down). Acceptable for the 5 elevated skills since `high` is still robust and the pin to `claude-opus-4-7` means most users will see the actual `xhigh`.

## [4.3.0] – 2026-04-26

Beta tester opened the plugin in Claude desktop's Plugin Directory and saw `Connectors: 1 (context7)`. The plugin documents many other integrations (Figma, Playwright) but they were companion plugins users had to install separately, not bundled connectors. User decided that since 99% of designers using this plugin will use Figma and Playwright at some point, just bundle them. Figma Console MCP stays an optional companion (alternative to the official Figma plugin, less common).

### Added

- **Figma MCP bundled** as a plugin connector (HTTP at `https://mcp.figma.com/mcp`, exact config from Anthropic's official Figma plugin). Auto-starts when the plugin is enabled. Provides structured Dev Mode design data (not screenshots) for design-to-code workflows. Prerequisite: open Figma desktop with Dev Mode enabled.
- **Playwright MCP bundled** as a plugin connector (`npx @playwright/mcp@latest`, exact config from Anthropic's official Playwright plugin). Auto-starts when the plugin is enabled. Enables browser testing and visual review. Prerequisite: Node.js v18+ on the user's machine so npx can fetch the package on first use.
- **Connectors count goes from 1 to 3** in the Plugin Directory UI: Context7 (docs), Figma (design data), Playwright (browser testing).

### Changed

- **`skills/meta-setup/SKILL.md`** — tool-detection messaging updated. Status text changes from "Figma plugin: install separately" to "Figma: bundled, open Figma desktop to use". Same for Playwright. The meta-setup flow no longer asks the user to install Figma or Playwright as separate plugins.
- **`skills/meta-setup/scripts/detect-environment.sh`** — Figma and Playwright statuses now reported as `[BUNDLED]` rather than `[FOUND]`/`[MISSING]`. Playwright additionally checks Node.js v18+ availability and labels as `[BUNDLED, prereq missing]` if Node is absent. Figma Console MCP (companion, NOT bundled) labeled `[OPTIONAL]`.
- **`README.md` "How it works"** mentions the three bundled connectors.

### Notes

- **Figma Console MCP stays optional** — it's the write-access alternative to the read-only official Figma plugin and is more advanced. Users can install it separately if they want write access to Figma.
- **Existing users with Anthropic's official Figma or Playwright plugins** installed will see two registrations of the same MCP — Claude Code dedupes by URL/command, so this is non-fatal but cosmetic. Users may uninstall the standalone official plugins now that they're bundled here.

## [4.2.0] – 2026-04-26

Beta tester feedback: the plugin asks great clarifying questions and refuses to be a yes-man — but when it pushes back ("this is too vague", "use Problem/Awareness matrix"), it doesn't always cite the source file. As a designer, she said: "I'm steering a horse (Claude) but I'm blindfolded and he has the map 😅."

Audit confirmed the gap: a soft rule existed in `meta-orchestrator/SKILL.md:27` ("provide specific quotes when making claims") but was only in one file and only fired during meta-orchestrator. The 36 evaluation-heavy skills (ux-*, psych-*, ui-aesthetic-review / ui-accessibility / ui-design-system / ui-design-to-code-qa, dev-claude-md) didn't link their judgments back to their reference files.

### Changed

- **Source citation requirement added to 36 evaluation-heavy SKILL.md files.** Whenever a skill pushes back on user input (calling it incomplete, too vague, off-target, missing a framework) OR invokes a named framework or method, Claude must now cite the source in the same response in this format:

  > Source: `<relative path to reference file from the skill's directory>` — "<1-line quote of the passage that backs the judgment>"

  The user is the designer; she's steering. Without the citation, she's working blindfolded. The block has an explicit escape valve for generic principles that have no specific reference file ("This is a general design principle, not from a specific reference in this plugin") to prevent forced fake citations.

- **Skills covered (36)**: ux-problem-statement, ux-target-audience, ux-storybrand, ux-business-plan, ux-assumptions, ux-bias-audit, ux-mvp-requirements, ux-information-architecture, ux-journey-mapping, ux-behavior-mapping, ux-competitor-analysis, ux-user-interviews, ux-story-panels, ux-ethics-review, ux-full-review, ux-motivation-audit, ux-communicating-decisions, psych-cognitive-biases, psych-cognitive-load, psych-decision-fundamentals, psych-decision-persuasion, psych-delight-design, psych-emotional-retention, psych-engagement-patterns, psych-full-scan, psych-habit-formation, psych-pricing-psychology, psych-simplification, psych-social-influence, psych-time-perception, psych-visual-perception, ui-aesthetic-review, ui-accessibility, ui-design-system, ui-design-to-code-qa, dev-claude-md.

### Notes

- **No CLAUDE.md change** in this release — per-skill placement was the chosen approach over a global rule. If real-world testing shows drift, future releases can escalate to (a) a global CLAUDE.md rule, or (b) a PostToolUse hook that scans AskUserQuestion text for evaluative claims without citation. Tracked as a follow-up option.
- **Existing soft rule in `meta-orchestrator/SKILL.md:27`** is retained — complementary to the per-skill rule.

## [4.1.4] – 2026-04-26

User caught two more drift patterns in the process-recall hook even after v4.1.3:
1. Listing the steps with a current marker, then immediately performing the NEXT step's actions in the same turn (theatrical listing — marker doesn't match actual work).
2. Assuming earlier steps "were already done" earlier in the session (e.g., "docs were fetched two messages ago, skipping fetch"). The whole point of a process is following it every single time, not deciding which steps to skip based on session memory.

### Changed

- **`hooks/de-process-recall-hook.sh` adds two new forbidden shortcuts** to the bullet list:
  - Marker mismatch: "Marking yourself on step N then performing step N+1's actions in the same turn — the marker must match the actual work happening this turn."
  - Already-done shortcuts: "Assuming any step is already done because you did it earlier in the session ('docs were fetched two messages ago', 'I already analyzed this', etc.) — every run of the process redoes every step from scratch, period. The point of a process is following it every single time. 'Already done earlier' is forbidden reasoning."

## [4.1.3] – 2026-04-26

User caught the v4.1.2 hook fix being too rigid. The previous wording locked in a specific header format ("PROCESS RECALL CHECK — <process name>:") and a 4-step example, which would constrain processes of different lengths (2 steps, 30 steps, 100 steps).

### Changed

- **`hooks/de-process-recall-hook.sh` nudge text relaxed** to make the format flexible while keeping the rule intact. The requirement is now explicitly "list EVERY numbered step with a `← current` marker — the number of steps is whatever the process actually has". Surrounding format (header, punctuation) is flexible. Forbidden shortcuts are listed as a bullet list (summarizing, "currently between step X and Y" shorthand, mentioning step count without enumeration, skipping list because process feels familiar, omitting steps to keep list short). The illustrative example is now clearly labeled as illustrative and tells the model not to invent steps to match it.

## [4.1.2] – 2026-04-26

User caught the model still skipping the process-step listing despite the v3.0.0 fix. The previous nudge said "list ALL steps" but the model was treating that as flexible — writing summaries like "7-step workflow, currently between step 1 and step 3" instead of the full enumerated list. Tightened the wording.

### Changed

- **`hooks/de-process-recall-hook.sh` nudge text rewritten** to harden the rule. New wording explicitly forbids the common shortcuts: no summarizing, no "between step X and Y" shorthand, no "<N>-step workflow" without listing them, no skipping the list because the process feels familiar from earlier in the session. Includes a concrete format example so the expected shape is unambiguous. Format requires every numbered step verbatim with a `← current` marker on the active one, on every response while a process is active.

## [4.1.1] – 2026-04-26

Replacement of the v4.1.0 sound files. The user auditioned all 52 Kenney UI Audio sounds during testing and found them too high-pitched and clicky for this use case. We collaborated on synth alternatives — short, futuristic, low-frequency, with a bit of mid for clarity — and converged on these.

### Changed

- **Replaced `de-complete.wav` and `de-attention.wav`** with original synthesized tones generated via ffmpeg's lavfi sine source plus lowpass, echo, and loudness normalization. No third-party samples. Public domain (CC0) — use, modify, redistribute freely. Recipes for full reproducibility are in `assets/sounds/LICENSE.md`.
  - **`de-complete.wav`** — ascending fourth G3→C4 (196→261 Hz) with octave-up harmonics (×0.35) for warmth and clarity. Fade envelope, lowpass at 4500 Hz, subtle echo, loudnorm to -9 LUFS. Plays when Claude finishes responding.
  - **`de-attention.wav`** — double-tap at A3 (220 Hz) with octave-up harmonics. Two short pulses with a silence between, brighter envelope. Plays when Claude waits for permission or AskUserQuestion answer.
- **`LICENSE.md` rewritten** to reflect the new origin (synthesized originals, not Kenney CC0). Recipes documented for reproducibility.

## [4.1.0] – 2026-04-26

Beta tester feature request: audio cues when Claude finishes responding or needs user action. They linked an example using `afplay` (macOS-only). User refined the scope: hybrid opt-in install, same bundled sounds for everyone (not OS system sounds), suggest a specific sound source.

### Added

- **Optional sound notifications** during setup. New question in `meta-setup/SKILL.md` (between status-line install and finalization) asking the user whether to enable sound on Claude's `Stop` (finished responding) and `Notification` (waiting for your input — permission requests, AskUserQuestion) events. Opt-in only; skipped by default if the user picks "No" or doesn't run setup.
- **Bundled CC0 sounds at `assets/sounds/`** — `de-complete.wav` (Stop, warm "task done" chime) and `de-attention.wav` (Notification, alerting tone, distinct from completion). Sourced from [Kenney UI Audio](https://kenney.nl/assets/ui-audio), CC0 public domain — no attribution required, irrevocable license, redistributable. License note at `assets/sounds/LICENSE.md`.
- **Cross-platform playback shim** at `hooks/de-play-sound.sh`. Detects OS and uses platform-native player: macOS `afplay`, Linux `paplay`/`aplay`/`play` (in that fallback order), native Windows shells PowerShell `System.Media.SoundPlayer`. Silent on WSL (Windows Subsystem for Linux doesn't expose Windows audio by default). Fail-silent (`exit 0`) so a missing player never blocks Claude Code; backgrounded so playback doesn't delay the calling hook.

### Notes on hook event choice

- **Stop** (Claude finished responding) and **Notification** (Claude waiting for permission/AskUserQuestion answer) are the right events per Anthropic docs.
- The user's reference snippet also wired `SessionStart` and `UserPromptSubmit` — we skipped both. SessionStart fires every session open (annoying chime on each start). UserPromptSubmit fires when the *user* submits — irrelevant to "Claude needs me" or "Claude finished".
- Hook entries are written to user-level `~/.claude/settings.json` (not plugin-level) so they fire across all Claude Code work, not just plugin commands. Same scope pattern as the existing status-line install. Existing user settings are preserved (read-merge-write, never overwrite).

### Uninstall and mute

- **Uninstall**: re-run `/design-engineer:start` and pick "Uninstall" on the sound install question, or manually remove the Stop/Notification hook entries from `~/.claude/settings.json`.
- **Temporary mute**: run `/design-engineer:mute-unmute-sound` to silence sounds without uninstalling. Run again to unmute. Useful for meetings, libraries, or anywhere you want temporary silence. State persists across Claude Code restarts (flag file at `~/.claude/de-sound-muted`).

### Also in this release

- **New `/design-engineer:mute-unmute-sound` command** that toggles sound notifications via a flag file at `~/.claude/de-sound-muted`. The playback shim checks for this file on every invocation and exits silently if present. First call mutes, second call unmutes. Idempotent and safe to run repeatedly. Command count goes from 8 to 9.
- **"Already installed" detection** in the status-line and sound install questions. When `/design-engineer:start` runs and detects existing plugin config in `~/.claude/settings.json`, the question now offers three options instead of two: `Skip – already installed` (default for re-runs), `Reinstall (replace)`, or `Uninstall`. Eliminates the awkward "do I really want to reinstall?" friction when re-running setup.

## [4.0.0] – 2026-04-26 — BREAKING

Beta tester reported that typing `/de:` triggered Claude Code's session-naming logic to interpret `de` as the German language code, producing chat titles like "Start German language feature". Real UX papercut for every chat using this plugin.

This release renames the command prefix from `/de:` to `/design-engineer:` to eliminate the language-code collision.

### Changed (BREAKING)

- **Command prefix renamed**: `/de:` → `/design-engineer:`. All 8 commands now use the longer prefix:
  - `/de:start` → `/design-engineer:start`
  - `/de:design` → `/design-engineer:design`
  - `/de:dev` → `/design-engineer:dev`
  - `/de:review` → `/design-engineer:review`
  - `/de:prototype` → `/design-engineer:prototype`
  - `/de:document` → `/design-engineer:document`
  - `/de:stop` → `/design-engineer:stop`
  - `/de:help` → `/design-engineer:help`
- **Command directory moved**: `commands/de/` → `commands/design-engineer/` (slash-command resolution is directory-based — the directory move IS the prefix rename).
- **Command frontmatter `name:` fields updated** in all 8 command files to match the new prefix.
- **All references migrated** across ~42 active plugin files (commands, agents, skills, hooks, scripts, CLAUDE.md, README, evals).

### Migration

No file moves needed in your project. Just type the new prefix:

```
/design-engineer:start
```

Tab-completion in Claude Code makes the longer prefix manageable: `/de` + Tab no longer auto-completes to `/de:` (because that prefix no longer exists); type a few more characters for `/design-engineer:` to autocomplete.

### Notes

- **Internal hook filenames retain `de-` prefix** (`de-start-state.sh`, `de-tdd-hook.js`, `de-design-grounding-hook.js`, etc.) — these are file paths inside the plugin, never invoked as slash commands. Renaming them would require updates to `hooks.json` plus more file moves with no user-visible benefit. Out of scope for this release.

## [3.0.0] – 2026-04-26 — BREAKING

Beta tester reported three structural complaints about the deliverables folder layout:
1. `documents/` is a redundant wrapper — it only ever contains `design/`, so the extra level adds zero information.
2. `design/design/` is a confusing double-word path — both depths used the same word.
3. `prototype/` doesn't belong inside `documents/` because (a) a prototype isn't really a document, (b) it's the most-viewed artefact and burying it makes it hard to find.

This release restructures the artefact folder layout to address all three. **Breaking change for existing projects**: paths are different. One-time migration command below.

### Changed (BREAKING)

- **Dropped `documents/` wrapper.** Top-level project structure is now `design/`, `prototype/`, `plans/`, `.claude/`, `.design-engineer-plugin/` — no `documents/` parent.
- **Renamed inner `design/` to `craft/`.** What was `documents/design/design/` (containing references, story panels, journey, bias audit, ethics, behavior map) is now `design/craft/`. Captures "design-craft work" without the double-word path confusion.
- **Moved `prototype/` to project root.** What was `documents/design/prototype/` is now just `prototype/` — sibling of `design/` and `plans/`. A prototype isn't a document; it's the artefact users open.
- **`init-project-structure.sh`** rewritten for the new layout. Default `DELIVERABLES_PATH` is now `design` (was `documents/design`). Idempotent: re-runs are safe.
- **All ~40 plugin files migrated**: commands, agents, skills, hooks, scripts, README, CLAUDE.md updated to reference new paths. CHANGELOG entries from prior versions retain old paths for historical accuracy.

### Migration (one-time, run from project root)

If you have an existing project on v2.x, run this once to migrate:

```bash
mv documents/design/design design/craft && \
mv documents/design/prototype prototype && \
mv documents/design design && \
rmdir documents
```

Adjust if you customised the deliverables path. After running, all v3.0.0 plugin commands will find content at the new locations.

### Final shape

```
project-root/
├── .claude/
├── .design-engineer-plugin/
│   └── memory/                 # plugin-local memory (project-map.md, debug-solutions.md)
├── design/
│   ├── foundation/
│   ├── research/
│   ├── planning/
│   ├── craft/                  # was documents/design/design/
│   │   ├── references/
│   │   └── story-panels/
│   ├── psych/
│   ├── reviews/
│   └── dev/
├── prototype/                  # was documents/design/prototype/
└── plans/
    └── archive/
```

### Also in this release

- **Process-recall hook now lists all steps, not just the current one.** The previous v2.6.3 nudge made Claude announce "Process X, Step N" at the top of responses but didn't force it to list the other steps — so Claude would forget what comes next mid-process. Updated `hooks/de-process-recall-hook.sh` to require a numbered list of EVERY step with a `← current` marker on the active one, re-listed on every response while the process is active.
- **`de-design-grounding-hook.js` legacy prototype path corrected.** The fallback `'design/prototype.html'` (which never matched any real layout) was replaced with `'documents/design/prototype/prototype.html'` for v2.x backwards compatibility during migration. New primary path is `'prototype/prototype.html'`.

## [2.7.0] – 2026-04-26

Beta tester feature request: a skill that produces detailed image-generation instructions to feed into Nanobanana / ChatGPT / Midjourney / etc. (referenced msitarzewski's design-image-prompt-engineer agent). Confirmed pain: when prototype/landing pages need images, Claude defaults to gray-gradient + emoji slop, weird SVGs, or low-quality Pexels grabs because the plugin had zero image-handling skills. User clarified scope: handle BOTH stock photos (right for lists/avatars/decorative — 50 user avatars don't need 50 unique generations) AND AI generation (right for hero/marketing/brand-specific placeholders), and ensure the skill actually fires when needed (hard-wire from prototype/landing flows, soft-wire via description, plus a CLAUDE.md rule).

### Added

- **New `ui-images` skill** (`skills/ui-images/`) — single skill that handles both stock-photo selection and AI-generation prompt writing. Walks the user through an image manifest, decides per image whether to generate or stock-fetch (heuristic: hero/marketing/brand → generate; avatars/list rows/decorative many-of-a-kind → stock; user can override), and produces the right artefact for each path. For stock: writes a strong search query and uses Playwright CLI (when available) to visually rank top results so Claude doesn't grab low-quality images; falls back to URL list when Playwright isn't installed. For generation: asks which generator the user wants (Nanobanana / ChatGPT / Midjourney / Flux / etc.) and writes detailed prompts using per-generator templates that cover syntax differences (aspect-ratio params, style modifiers, negative prompts). Saves manifest + prompts to `documents/design/design/images/` with subfolders for `prompts/`, `generated/`, `stock/`.
- **`skills/ui-images/references/prompt-templates.md`** — per-generator templates for Gemini Nanobanana, ChatGPT/DALL·E, Midjourney, Flux/Stable Diffusion, Ideogram, plus a generator-agnostic core that covers subject + composition + style + lighting + palette + aspect ratio + negatives.

### Changed

- **`dev-prototyping/SKILL.md` Step 5** — added a hard image-slot rule: BEFORE generating any `<img>` tag, gradient placeholder, or emoji-stamped SVG, invoke `ui-images`. This is what prevents the gray-gradient + emoji slop default.
- **`ui-landing-page/SKILL.md` Step 4** — added the same hard rule for landing page sections (hero, social proof, testimonial avatars, product shots, feature illustrations).
- **`CLAUDE.md`** — new "Image handling" section: before reaching for gradient placeholders, emoji-stamped SVGs, or random Pexels/Unsplash links, invoke `ui-images`. Applies to every `<img>` tag — no exceptions, no "the user will replace it later" shortcuts.
- **`README.md`** — banner v2.7.0, added `ui-images` to the UI design skills table, skill count updated.

## [2.6.7] – 2026-04-26

Beta tester reported: asked for a responsive website, plugin generated a desktop browser page with a mobile-phone-shaped mockup floating in the center surrounded by cream space. Root cause: `dev-prototyping/SKILL.md` never asked the user what target platform to design for, so when planning docs lacked an explicit signal Claude defaulted to mobile-shaped layouts wrapped in a desktop chrome.

### Fixed

- **Responsive-web prototypes no longer render as mobile-mockup-in-desktop-frame.** A new mandatory question (Step 1.5: Target platform) locks in Mobile app / Responsive web / Desktop web / Both at the start of the prototype flow, before any HTML is generated.

### Added

- **Step 1.5: Target platform** in `skills/dev-prototyping/SKILL.md` — AskUserQuestion with four options. The choice is binding and feeds into the Step 4 brief.
- **Target platform field** in the Step 4 prototype brief — surfaces the platform choice as the first row of the brief (above Design intent), so the user reviews and confirms it before any storyboard work.
- **Step 5 target-platform layout rule (HARD)** — for Responsive/Desktop web targets, layouts MUST fill the viewport. NEVER wrap content in a centered phone-shaped container, NEVER apply `max-width: 414px` / `375px` page-body constraints, NEVER add a fake-iphone CSS chrome around the UI. For Mobile app targets, design at mobile viewport without desktop wrapping. For Both, generate two separate sets of screens, never mixed in one layout.
- **Anti-pattern: "Mobile mockup floating in desktop frame"** added to `skills/ui-aesthetic-review/references/anti-patterns.md` under the Mobile App Anti-Patterns (2026) section. The Step 5 self-review now flags this case explicitly when target is Responsive or Desktop web.

## [2.6.6] – 2026-04-26

Beta tester reported a confusing red error during /de:start on a brand-new Windows project: `File does not exist: C:\Users\Admin\.claude\projects\D--Coding-projects-mexico-2/memory/MEMORY.md`. The path was not mangled — that's the standard Claude Code auto-memory slug. The actual problem: Claude Code creates the auto-memory dir lazily when it first writes there, but the plugin was instructing Claude to Read `MEMORY.md` via the Read tool — redundant (per Anthropic docs, MEMORY.md auto-loads first 200 lines every session) and broken for fresh projects.

### Fixed

- **No more "File does not exist" red error on /de:start for fresh projects.** Plugin no longer issues `Read MEMORY.md` calls — auto-memory MEMORY.md is owned by Claude Code itself and auto-loads every session per Anthropic docs.

### Changed

- **Plugin-defined memory files moved to `.design-engineer-plugin/memory/`** — `project-map.md` (living file tree) and `debug-solutions.md` (known fixes log) now live in the plugin-local config dir, seeded by `init-project-structure.sh` during meta-setup. Avoids needing to mirror Claude Code's auto-memory slug encoding (which is brittle cross-platform: Mac, Windows, git-root vs working-dir derivation).
- **`init-project-structure.sh` extended** to seed `.design-engineer-plugin/memory/{project-map.md,debug-solutions.md}` skeletons idempotently. If files exist, skip; if not, create with starter content from the prior `meta-setup/SKILL.md` block.
- **CLAUDE.md memory section rewritten** — clearly separates the two memory layers (Claude Code auto-memory MEMORY.md, owned by Claude Code; plugin-local memory at `.design-engineer-plugin/memory/`, owned by the plugin). Adds a defensive read pattern: verify existence with Bash `test -f` or Glob before Read; skip silently if absent. Removes redundant "Read MEMORY.md" instructions.
- **`meta-setup/SKILL.md` "Initialize Auto-Memory" section** replaced with a short pointer noting the seeding is now done by the script.
- **`meta-orchestrator/SKILL.md`, `dev-agent-setup/SKILL.md`, `ux-story-panels/SKILL.md`, README FAQ** updated to reference the new plugin-local paths.

### Migration note

If you have existing notes in `~/.claude/projects/<slug>/memory/project-map.md` or `~/.claude/projects/<slug>/memory/debug-solutions.md` from a prior plugin version, copy them to `.design-engineer-plugin/memory/` in your project — the plugin no longer reads from auto-memory for these files. Auto-memory MEMORY.md is unaffected; Claude Code continues managing it.

## [2.6.5] – 2026-04-26

### Changed

- **Clarified spacer scope in CLAUDE.md rule 6** — added an explicit "Do NOT add the spacer to" list (regular chat messages, plain-text questions, end-of-turn summaries) so future sessions don't apply the spacer to messages that aren't followed by an actual `AskUserQuestion` tool call. The spacer exists only to defeat the question-panel overlay; without a panel, no spacer is needed.

## [2.6.4] – 2026-04-26

### Changed

- **AskUserQuestion spacer reduced from 8 lines to 3** (CLAUDE.md rule 6) — eight horizontal-rule lines was excessive in practice; three is enough vertical space to keep the panel overlay off the substantive content above it without dominating the chat.

## [2.6.3] – 2026-04-26

Process-discipline fix from beta tester feedback (and from observing the assistant repeatedly drift mid-session). Across long sessions, Claude was forgetting to follow agreed processes — the prototype-as-baseline rule, multi-step plugin workflows, the iterative-feedback workflow — until the user manually re-anchored with "you forgot the process". This release automates that re-anchor.

### Added

- **Process-recall metacognitive nudge hook** (`hooks/de-process-recall-hook.sh`, wired as a `UserPromptSubmit` hook) — fires on every user prompt and injects ~3 lines of `additionalContext` asking Claude to check whether a process is active (CLAUDE.md, an active skill/command/agent, or what the user established earlier) before responding. If a process IS active, Claude must briefly state at the top of its response which process and which step. If no process is active, Claude must respond normally without mentioning anything about process. The nudge is fully generic – it never names a specific process, so future processes added to the plugin (or stated mid-conversation by users) automatically benefit. Survives compaction and long sessions because UserPromptSubmit re-fires every turn, unlike CLAUDE.md rules which fade behind newer context.

## [2.6.2] – 2026-04-25

Two UX fixes from tester feedback — users could not pick alternative recommendations during a guided review, and the AskUserQuestion panel overlay was hiding the message above it (especially the finding context).

### Added

- **Spacer rule for AskUserQuestion calls (CLAUDE.md rule 6)** — on most clients the panel overlays the bottom of the chat and hides whatever was written just above it. Every AskUserQuestion call must now be preceded by a vertical spacer (eight horizontal-rule lines, more if the message ended on important content) so the overlay covers the spacer instead of substantive content. Applies to every command, skill, and agent.

### Changed

- **`/de:review` guided mode now puts the recommendations themselves on the action buttons.** Previously the post-finding question offered "Fix it now / Note and continue / Skip / Explain", and "Fix it now" implicitly applied the agent's recommended pick — alternative recommendations were unreachable via buttons. The new flow shows up to 3 recommendations as the primary AskUserQuestion options (recommended one first, marked clearly), with a 4th "Skip or explain" slot that branches to a tiny follow-up question only when needed. The auto-added "Other" slot lets users describe a custom approach in free text. The fix-execution plan in Step 5 implements whichever recommendation (or custom approach) the user actually picked, never silently substituting.
- **Collapsed "Fix it now" and "Note and continue"** — both previously fed the same Step 5 batch plan, so the distinction was cosmetic. Picking any recommendation now means "include this in the fix plan", and the batch executes after all findings are reviewed. One click per finding instead of two.
- **Recommendations now require a short title (3–5 words)** so they can fit on AskUserQuestion button labels. The full what / why / tradeoff is shown in the option description. Cap at 3 recommendations per finding so the question fits cleanly into 4 buttons.

## [2.6.1] – 2026-04-25

Closes the four remaining items from Round B's critical-bug audit (H1 already fixed in 2.6.0). Consistency and honesty pass — no new features.

### Changed

- **Memory-management language softened in CLAUDE.md** (H3) — auto-memory writes (`MEMORY.md`, `project-map.md`, `debug-solutions.md`) are now explicitly described as advisory, not contracts. Claude Code does not structurally enforce these writes; the docs now match. Pointed users at the structurally enforced layer (compound-documenter agent's project-local memory at `.claude/agent-memory/compound-documenter/`).
- **Hardcoded `documents/design/` everywhere** (M1) — replaced 24 instances of the `{deliverables_path}/` template token with the actual path across all skill, agent, command, and hook files. The `deliverables_path` config field was advertised as configurable but no code ever read it from `config.yaml`, so the configurability was fiction. Marked the field as reserved-for-future-use in CLAUDE.md.
- **Hedged Figma plugin function references** (L2) — `commands/de/review.md` and `agents/frontend-implementer.md` now explicitly say "if Figma plugin is connected" before invoking `get_design_context` etc., matching the optional-tool reality.
- **CLAUDE.md "Living Documents" section rewritten** to describe both layers (static graph + agent memory) honestly, replacing the old "tracked via .dependencies.yaml" framing that was tied to the dead subsystem.

### Removed

- Root `.mcp.json` (L1) — duplicated `plugin.json mcpServers.context7`. The plugin manifest is the authoritative declaration; the root `.mcp.json` was redundant for a self-installing plugin.

### Verified

- H2 (project-state.md / status.md confusion) verified clean — remaining mentions are intentional (user-side dev-status guidance examples, the "don't write here" warning in compound-documenter, and the legitimate `project-status` deliverable name).

## [2.6.0] – 2026-04-25

Major fix to the "living documents" subsystem from Round B critical-bug audit. The dependency tracking system was dead since launch — nothing wrote `status: complete` or `last_updated` to `dependencies.yaml`, so the entire feature was advertised but non-functional. Re-architected around the documented Anthropic primitive (agent `memory: project`).

### Added

- **Agent-memory progress tracking** — `compound-documenter` agent gains `memory: project` frontmatter, writing structured state to `.claude/agent-memory/compound-documenter/`: `pipeline-state.md` (current phase, last completed skill, recent deliverables), `key-decisions.md` (append-only log of cross-cutting decisions affecting 2+ deliverables), `stale-dependents.md` (downstream deliverables not refreshed since upstream change). Uses Anthropic's documented agent-memory mechanism, which Claude Code wires up structurally rather than by prose instruction.

### Changed

- **`dependencies.yaml` is now a static reference graph.** Removed `status:` and `last_updated:` fields from every entry — they were never written. The file documents which deliverables inform which downstream ones; runtime progress is now in agent memory. File header rewritten to make the static-only role explicit.
- **`check_deliverable_deps.py`** simplified to print only the static "You edited X. Downstream deliverables that may need review: …" relationship. Removed the dead 90-day staleness check (relied on `last_updated`).
- **`session_dep_summary.py`** simplified — removed the false "deliverables updated this session" claim and the dead `derive_resume_state` / `write_resume_state` machinery (all relied on `last_updated` which was never set). Now prints a clean session-end reminder pointing at `/de:document` for state writes.
- **`de-postcompact-hook.sh`** removed the dead "Deliverables completed: N" count (always 0). Now points the model at the compound-documenter agent's pipeline-state.md for live state recovery after compaction.
- **`compound-documenter` agent** rewritten to write to its agent-memory directory using the documented schema, instead of an ambiguous `status.md`.
- **`meta-document/SKILL.md`** now invokes compound-documenter to handle state writes instead of trying to write `status.md` directly.
- **`meta-orchestrator/SKILL.md`** Step 0 now reads `.claude/agent-memory/compound-documenter/pipeline-state.md` (not the never-written `documents/design/project-state.md`).
- **`meta-orchestrator/references/project-state-schema.md`** rewritten as a deprecation redirect note pointing to compound-documenter as the new owner of pipeline state.
- **`meta-document/references/context-engineering-guide.md`** updated to reference the agent-memory pipeline-state.md instead of the old `status.md` convention.
- **README FAQs #14 + #15** rewritten to honestly describe both layers (static graph + agent memory). No more "the plugin flags downstream dependents when upstream changes" promise — the plugin surfaces stale candidates; the user decides what's worth refreshing.

### Removed

- Dead `status:` / `last_updated:` fields from `dependencies-default.yaml` seed (every deliverable entry).
- 90-day staleness detection (relied on `last_updated`, dead since launch).
- The `derive_resume_state` and `write_resume_state` functions in `session_dep_summary.py` and the supporting YAML parser / `is_recent` helper (all built on `last_updated`).
- `status.md` references from `meta-document` and `compound-documenter` (the file was never the right primitive — split into three specific agent-memory files instead).
- `project-state.md` references from `meta-orchestrator` (file was never created or written).

## [2.5.1] – 2026-04-25

### Fixed

- **Stale "guided/god" mode reference** in `commands/de/prototype.md` — updated to "guided/autopilot" (leftover from before v2.0.0 renamed God mode → Autopilot).
- **Resume-state routing was dead** — `hooks/de-start-state.sh` now emits `returning_with_resume` or `returning_no_resume` based on whether `.design-engineer-plugin/config.yaml` has a `resume:` section, matching `commands/de/start.md`'s expected vocabulary. Previously the hook only emitted two states (`new_to_plugin`, `existing_project`), so the resume-where-you-left-off routing in start.md never fired since v2.0.0.
- **Stale `/de:start install` and `/de:start uninstall` references** in `skills/meta-statusline/SKILL.md` — replaced with the current invocation (re-run `/de:start` and select from the status-line question). Old syntax was from v1.4.0's removed `/de:statusline install` command.
- **Folder scaffold doc out of sync with reality** — `skills/meta-setup/SKILL.md` Step 4 documented a v1.x folder layout (`foundation/ research/ design/ psych/ dev/ solutions/`) but `init-project-structure.sh` actually creates the v2.4.0+ structure (`foundation/ research/ research/archive/ planning/ design/ design/references/ design/story-panels/ prototype/ psych/ reviews/ dev/`). Doc rewritten to match the script.
- **Dependency-file path inconsistency** — standardized all docs on `.design-engineer-plugin/dependencies.yaml` (the canonical path the init script creates). Removed legacy `documents/design/.dependencies.yaml` and `{deliverables_path}/.dependencies.yaml` references from `skills/meta-setup/SKILL.md` (3 places) and `skills/meta-orchestrator/SKILL.md` (1 place). The dual-path readers in `session_dep_summary.py` and `de-postcompact-hook.sh` stay for v1.x backwards-compat.
- **README skill counts didn't match anything** — headline claimed `54 skills` (3 places); public-facing tables summed to 49; actual SKILL.md file count is 53 (3 of those are hook-driven internal helpers). Added `ui-landing-page` to the UI design table (UI design (7) → UI design (8)) and updated headline `54 skills` → `50 skills` everywhere — that's the public-table sum: 4 Meta + 9 UX research + 8 UX design + 14 Psychology + 8 UI design + 7 Development.

## [2.5.0] – 2026-04-25

Major fix targeting the AI-slop problem from beta testing — every fingerprint of generic AI-generated UI was appearing in tester output (cream/beige + orange CTA, 3D Apple-emoji as illustration, flag-emoji avatars, pill-chips-with-emoji, generic "Join this event" CTA copy). Root cause: the plugin's design knowledge was treated as reference material rather than mandatory operating procedure, and `/de:dev` + `frontend-implementer` never read any of it. Fix uses Anthropic's documented `PreToolUse` hard-block primitive plus inlined operating rules in the agent/skill/command prompts.

### Added
- **Design grounding hook** (`hooks/de-design-grounding-hook.js`) — new PreToolUse hook that hard-denies UI Writes/Edits/MultiEdits (.tsx .jsx .html .svelte .vue .css .scss) until required design knowledge has been Read this session and `references.md` exists in the project. If `prototype.html` exists, denies Writes that don't Read it first. Uses the documented `permissionDecision: "deny"` primitive — this is real enforcement, not advisory context.
- **Mobile App Anti-Patterns (2026)** section added to `anti-patterns.md` — cream/beige + orange CTA, 3D emoji as illustration, emoji avatars, pill chips with emoji, generic CTA copy. Plus a Hard Bans section listing typefaces (Inter/SF Pro/Roboto/Lato/Montserrat/Open Sans), token names (`--gray-N`/`--surface-N`/`--primary`), and emoji as avatars/illustrations as choices that ALWAYS require user-stated WHY.
- **Curated reference apps** (`skills/ui-references-moodboard/references/curated-references.md`) — 8 product-type categories with 3–5 distinctive-design reference apps each and a specific quality to study, so users skipping moodboard still have aesthetic anchors against AI defaults.
- **Aesthetic audit pass** in `design-system-auditor` agent — extended from token-compliance only to also run the 4 lenses (Composition / Craft / Content / Structure) + 4 named tests (Swap / Squint / Signature / Token) + AI Slop Test from `critique-framework.md`, with structured PASS/FAIL output per test.

### Changed
- **Inlined the WHY Checkpoint, anti-pattern self-check, and Signature Test** into `agents/frontend-implementer.md`, `skills/dev-prototyping/SKILL.md`, and `commands/de/dev.md` — the operating procedure is now in the prompts that actually load (agent system prompt + skill content), not in reference files the model may not Read. The reference files remain canonical for deep dives.
- **Tight prototype-to-dev coupling** — `/de:dev` and `frontend-implementer` now treat `prototype.html` as the visual baseline when it exists; no creative deviation. Enforced by the new hook.

### Removed
- **Phase indicator from status line** — the segment had been dead since launch (nothing in the plugin ever wrote `status: complete` to `dependencies.yaml`, so the count was permanently zero). Removed `buildPipelineSegment()`, `findDepsPath()`, `parseDependenciesYaml()`, and the `PHASE_NAMES` lookup from `de-statusline.js`. Updated `meta-statusline` skill docs to reflect the new (smaller, more honest) status line: model + dir + context bar + 5h/7d usage.

### Fixed
- **Status-line lag during long tool calls** — documented as Claude Code's update model (the line refreshes at the end of each model turn), not a plugin bug. Added a Common Issues entry to `meta-statusline` skill.
- **Expo "training" question from beta tester** — confirmed not a bug. The plugin has zero Expo-specific training; Claude proposes Expo when product type is "mobile app" because it's a reasonable React Native framework. No code change needed.

## [2.4.1] – 2026-04-25

### Fixed

- **Plugin install failure for some users** – replaced bare relative source (`"./"`) in `marketplace.json` with explicit GitHub source (`{source: "github", repo: "volomydyr/design-engineer-plugin"}`). Aligns with the documented Anthropic plugin-source patterns and removes a path-resolution edge case reported by one beta tester (`/plugin install design-engineer@design-engineer-plugin` returned "Plugin not found in any marketplace" even though the marketplace had been added successfully).

## [2.4.0] – 2026-04-04

66 issues identified and fixed from end-to-end main flow testing (new product from scratch). Grouped into 12 root causes, implemented across 6 phases.

### Added
- **`/de:stop` command** – save and pause mid-activity with automatic progress tracking and compact message suggestion
- **`ui-landing-page` skill** – single-file HTML landing page with 9-section structure, StoryBrand integration, and copy frameworks (PAS, AIDA, StoryBrand)
- **Anti-slop writing reference** (`skills/shared-references/anti-slop-writing.md`) – 29+ AI writing pattern categories to avoid, applied across all skills
- **Compact message template** (`skills/shared-references/compact-template.md`) – fixed format for consistent compaction across sessions
- **PostCompact hook** – re-injects pipeline state from config.yaml after compaction
- **Pipeline overview** – presented to the user before Phase 1 with all phases, descriptions, and stop/resume instructions
- **Two compaction breakpoints** – after Phase 3 (before prototyping) and after Phase 4 (before development)
- **Figma design checkpoint** – explicit pause after Figma push for user to design before psychology review
- **Smart psychology skill selection** – all 14 psych skills presented with dynamic recommendations via multiSelect
- **Pipeline conclusion** – personalized, dynamic ending after development completes
- **Build target detection** – identifies multiple build targets (e.g., macOS app + landing page) and asks which to build first
- **Cross-agent review** at three handoff points: test-writer reviews plan, frontend reviews backend API, design-system-auditor reviews both
- **Progress indication** throughout the pipeline ("Phase N, step X of Y")

### Changed
- **Step 0 added to all 24 pipeline skills** – execution plan announcement, conditional teaching, incremental output rule, contrarian behavior
- **Content Integrity rule added to all skills** – no fabrication, no solutions in discovery, read before reference
- **BLOCKING REQUIREMENT tags** on all interactive steps – model must wait for user input
- **Prototyping rewritten** – two-step approach (visual storyboard then interactive prototype), no git/simplify/TDD, screen inventory from IA, anti-pattern self-check, copy rule (ask user to write after first rejection)
- **ux-full-review changed from optional to required** – comprehensive review before development
- **TDD hook** now recognizes `.spec.js`, `.spec.ts`, `.test.js`, `.test.ts` in addition to `.sh`
- **/simplify enforcement** strengthened to "MANDATORY NEXT ACTION" with blocking language
- **Statusline pipeline state** fixed to show progress based on completed deliverables, not just in_progress
- **Plan template** updated with explicit agent names (test-writer, backend-implementer, frontend-implementer, design-system-auditor) and /simplify as blocking step
- **Agent invocation instructions** added to 4 skills (competitor-analysis, full-review, meta-document, meta-orchestrator)
- **Folder structure redesigned** – new `planning/`, `design/references/`, `design/story-panels/`, `research/archive/`, `reviews/` folders; `solutions/` removed
- **Plan copy hook** now creates timestamped filenames and archives old plans
- **Staleness detection** for research deliverables older than 90 days
- **All hardcoded paths fixed** – zero `design-docs/`, `project-docs/`, `journeys/` references remain
- **Dependency wiring** – bias audit explicitly feeds prototyping, assumptions updated by 4 downstream skills
- **Repo visibility** question added (default private)
- **Figma intent** question added before Figma operations
- **Scope vs execution** fidelity nuance added to CLAUDE.md
- **Synthesize from previous answers** rule added – no re-asking what the user already said
- **Behavior mapping** rewritten to walk through concepts one at a time
- **Story panel examples** auto-open on macOS via `open` command
- **Reference collection** reordered earlier in moodboard skill; aesthetic direction rule added
- **multiSelect guidance** added – when to use true vs false

### Removed
- `/simplify` and TDD references from prototyping skill (prototypes are throwaway visual artifacts)
- `solutions/` folder (merged into `dev/`)
- Stale "Prompt cleanup" hook reference from README (hook was removed previously)

---

## [2.3.0] – 2026-04-01

### Added

- **Plan auto-copy hook**: NEW PostToolUse hook (`de-plan-copy-hook.js`) automatically copies plan files from `~/.claude/plans/` to the project's `plans/` directory. This activates TDD hooks, fidelity checks, /simplify reminders, and git branch matching — all of which gate on `plans/` having active plan files. The model cannot skip this — it's automatic.
- **Plugin root path injection**: The UserPromptSubmit hook now injects `DESIGN_ENGINEER_PLUGIN_ROOT` in ALL cases (not just onboarding). Every command can resolve skill reference file paths using this absolute path.
- **Plan template execution rules**: Added "Execution rules" section to `plan-template.md` covering TDD, /simplify, Playwright verification, approval gates, design-system-auditor, meta-document, and git workflow. These rules travel WITH the plan.

### Changed

- **Combined AskUserQuestion calls**: Review command now asks core + additional review areas in ONE AskUserQuestion call (2 questions on same screen, not 2 separate calls). Onboarding batches goal + mode into one call.
- **Reference file paths use PLUGIN_ROOT**: Review command's reference table uses `${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/...` instead of relative paths that resolve in the wrong directory.

## [2.2.0] – 2026-04-01

### Added

- **`/de:help` command**: Shows all available commands, current project status, and mode. Works in any project without setup.
- **Plan template reference file**: `skills/meta-setup/references/plan-template.md` — standalone template for implementation plans. Dev command instructs model to Read it before EnterPlanMode.

### Changed

- **Agent presentation rule**: Reverted agent ban in Guided mode. Agents now run normally in both modes. In Guided mode, the main model parses agent output and presents findings step by step with AskUserQuestion — never dumps raw output.
- **Fidelity hook – /simplify reminder**: Every source code write during plan execution now includes a reminder to run /simplify.
- **Fidelity hook – git branch check**: Warns if current branch doesn't match the active plan name. Catches: on main/master, or on a mismatched feature branch.
- **Plan copy rule (CRITICAL)**: Added prominent call-out in CLAUDE.md — plan MUST be copied to `plans/` before implementation, otherwise TDD/fidelity/git hooks can't activate.
- **Review command overhaul**: 2 sequential multiSelect questions (7 areas across 2 groups), direct Read paths to skill reference files, minimum 3 structured recommendations per finding (what/why/tradeoff), always AskUserQuestion at transitions.
- **Dev command overhaul**: Plan Mode mandatory (Read template → EnterPlanMode → ExitPlanMode → copy to plans/), TDD before code, phase-by-phase with /simplify, Playwright visual verification for UI changes.
- **Feature-scoped deliverables**: Existing projects create feature subfolders (`documents/design/features/[name]/`) to prevent naming collisions.
- **Orchestrator agent rule**: Agents run in Guided mode but output presented step by step.
- **No personalization for existing projects**: Hook Case 2 now explicitly prohibits memory-based greetings.
- **Compound documenter**: Option for existing projects (user decides), auto for new products at phase completions.

## [2.1.0] – 2026-03-31

### Changed

- **Existing project feature flow**: `/de:design` now differentiates between `project_type: new` (full 4-phase pipeline) and `project_type: existing` (abbreviated feature flow: understand → plan → optional depth → implement). Existing projects skip discovery and strategy phases.
- **Agent delegation reinforced everywhere**: Added explicit "do NOT delegate to agents" in design command Guided mode section, meta-orchestrator Guided mode section, and dev command implementation section. Listed all agent names to prevent ambiguity.
- **Problem statement minimum 7 questions**: Added bold mandatory note and reinforced that forcing questions are not optional.
- **Plan Mode mandatory for implementation**: Dev command now explicitly says "You MUST use EnterPlanMode. Do NOT present the plan as chat text." Links to CLAUDE.md structured format.
- **Component architecture enforcement**: Added CLAUDE.md rule requiring implementation to follow project's existing architecture. Never create monolithic files.
- **Implementation workflow**: Dev command rewritten with explicit read-patterns → plan → TDD → phase-by-phase → /simplify → audit → git → document sequence. Guided mode: main model implements, no agent delegation.
- **Output formatting examples**: Added sentence case examples for deliverable names, em dash → en dash examples.

## [2.0.0] – 2026-03-31

### Breaking

- **Folder restructure**: Config moved from `.design-engineer.yaml` (root) to `.design-engineer-plugin/config.yaml`. Deliverables moved from `docs/design/` to `documents/design/`. Dependencies tracking moved to `.design-engineer-plugin/dependencies.yaml`. Technical files separated from user deliverables.
- **"God mode" renamed to "Autopilot"**: All references updated across skills, commands, README, CLAUDE.md.

### Changed

- **Status line rewrite**: Reads 5h/7d usage from stdin `rate_limits` (automatic, no monitor needed). Removed watch mode and credential access. Shows model with context window "(1M)", keeps directory, compact bars.
- **Review command**: MultiSelect for review areas, scoping question (whole app / specific page / recent changes), loads actual skills for reference knowledge, shows finding count upfront, structured recommendations with 3–4 options and "(Recommended)" marker, collects all fixes then ONE plan via Plan Mode.
- **AskUserQuestion labels**: Specific and action-oriented. "New product" / "Existing project", "Review my project" / "Implement from Figma", "Guided mode" / "Autopilot".
- **Double hyphens forbidden**: `--` added to output formatting rule 1.
- **CLAUDE_PLUGIN_ROOT resolved**: Hook script resolves its own absolute path instead of using unresolvable variable in additionalContext.
- **Status line explanation**: Brief description of what it does before asking the user to install.
- **Returning flow**: Hook checks `project_type` in config. Existing projects get AskUserQuestion with goal options, not pipeline resume state.

## [1.27.0] – 2026-03-30

### Changed

- **Guided mode: no autonomous agents**: Added agent delegation rule — in Guided mode, the main model does all work step by step. Agents are for God mode only. Review command updated with explicit per-finding interaction flow.
- **Setup: no bloat**: Hook now explicitly forbids Explore agents during setup. Only detect-environment.sh runs. Results show only goal-relevant info, no Git/CLAUDE.md jargon.
- **Status line: use our script, not built-in**: Hook explicitly tells model to copy our de-statusline.js instead of using the built-in statusline-setup agent.
- **Returning flow: check project_type**: Hook now injects context for existing projects (project_type: existing) telling the model to show capabilities via AskUserQuestion. meta-setup checks project_type before showing pipeline state.

## [1.26.0] – 2026-03-30

### Changed

- **All commands follow PLAN → EXECUTE → PRESENT → FEEDBACK**: `/de:design`, `/de:dev`, `/de:prototype`, `/de:document` all rewritten to read mode from config, plan before executing, and present results step by step in Guided mode or as structured summaries in God mode.
- **Context-aware planning**: Commands scan the project before presenting options — only suggest what's relevant for the current tech stack and project state.
- **Mode from config**: All commands read mode from `.design-engineer.yaml` instead of asking. No more redundant mode questions.
- **Removed redundant mode selection**: `/de:design` no longer asks mode (already set during onboarding). Uses config value.

## [1.25.1] – 2026-03-30

### Changed

- **Review command rewrite**: Replaced 7 fixed review options with context-aware planning. The command reads project context, builds a review plan based on what's relevant, and follows PLAN → EXECUTE → PRESENT → FEEDBACK. Guided mode reviews step by step with feedback per finding. God mode executes all and shows structured summary.
- **Status line compact**: Halved progress bar width (5 segments), "context" not "ctx", removed "used"/"left" text, stripped "(1M context)" from model name.

## [1.25.0] – 2026-03-30

### Changed

- **Hook-driven onboarding**: Moved entire onboarding flow into the UserPromptSubmit hook injection. The hook injects the complete 4-step sequence (welcome+goal → mode → setup+status line → auto-run) as context before the model processes anything. Skills no longer attempt to chain to each other — a pattern that was never supported.
- **Removed broken skill chains**: Cleaned up 5 instances of skills trying to load other skills (meta-setup-welcome → meta-setup, meta-setup → meta-setup-existing, meta-setup-existing → meta-setup-configure). Commands can load skills (works), but skills cannot load skills (never worked).

### Known issues

- `meta-orchestrator` uses "invoke the skill" / "proceed to the next skill" pattern which is also broken. Affects `/de:design` pipeline. Fix requires the same hook-driven approach — tracked for a future session.

## [1.24.2] – 2026-03-30

### Fixed

- **Batch welcome + goal into single AskUserQuestion**: The model ignored skill-to-skill routing from existing → configure because it had enough context (goal) to act directly. By batching welcome and goal into one call, the model gets both answers at once and MUST load configure for mode selection — it has no alternative.

## [1.24.1] – 2026-03-30

### Fixed

- **Chained single-task skills**: Split existing-project onboarding into `meta-setup-existing` (goal only, ~30 lines) → `meta-setup-configure` (mode + setup + status line, ~60 lines). Each skill has one main question. Setup is sandwiched between mode and status line questions so it can't be skipped.

## [1.24.0] – 2026-03-30

### Changed

- **Existing-project flow streamlined**: Replaced 3 diagnostic questions (project type, current state, goal) with single goal question + mode selection. Auto-setup runs silently (env detection, config, scaffold). Status line question. Then auto-runs the chosen command.
- **Mode selection for existing projects**: Guided vs God mode now asked during existing-project onboarding, saved to config, affects all subsequent commands.
- **Command execution philosophy**: Added CLAUDE.md rule requiring all commands to follow PLAN → EXECUTE → PRESENT → FEEDBACK pattern in both Guided and God modes. Neither mode should skip planning or dump raw output.

## [1.23.2] – 2026-03-30

### Changed

- **Existing-project flow split**: Extracted into `meta-setup-existing` skill (~130 lines). Model gets a focused file with one flow instead of a 400+ line multi-path skill. Follows the same approach that fixed the welcome prompt.
- **Goal options**: Replaced generic options with 4 specific goals: review what I have, implement from Figma, design a new feature, set up the dev workflow.
- **Removed Step 6 from meta-setup**: Capability guide and existing-project setup now live in `meta-setup-existing`. Returning users who choose "Browse" are routed there.

## [1.23.1] – 2026-03-30

### Changed

- **Skill split**: New-to-plugin welcome prompt moved to separate `meta-setup-welcome` skill (~30 lines). The model for new projects gets a tiny, focused file with one job instead of a 470-line multi-path skill.
- **Hook directive**: State injection hook now includes the exact AskUserQuestion spec as a first-action directive — the earliest context the model sees.
- **Command simplification**: `/de:start` command reduced to pure routing (load welcome skill or meta-setup based on state).

## [1.23.0] – 2026-03-30

### Changed

- **Hook scoping**: All command hooks now gate on `.design-engineer.yaml` — silent in projects that haven't run `/de:start`. The state injection hook uses inverse logic (only fires when config is absent). Plugin installed globally but hooks only activate per-project after setup.
- **Plan drift review**: Replaced Haiku prompt hook (fired on every Write/Edit globally) with deterministic keyword scan + background Agent review trigger in the fidelity command hook. Zero LLM overhead, only fires on plan file writes in configured projects.

## [1.22.3] – 2026-03-30

### Fixed

- **Hook output format**: State injection hook now outputs JSON with `hookSpecificOutput` (matching other command hooks) instead of plain text. Plain text caused "UserPromptSubmit hook error" in all projects.
- **Global PostToolUse:Edit error**: Removed Sonnet content preservation hook that fired on every Edit across all projects, causing errors globally. Will be reimplemented with proper gating later.

## [1.22.2] – 2026-03-30

### Fixed

- **UserPromptSubmit hook error**: Removed invalid Haiku prompt cleaner from UserPromptSubmit – it errored on slash commands with empty input and likely blocked the state injection hook from running. Only the command-based state injection hook remains.
- **Hook audit**: Verified all PreToolUse, PostToolUse, and Stop hooks are correctly configured.

### Removed

- **Prompt cleaner hook**: The Haiku-based prompt improvement hook was removed from UserPromptSubmit. It was causing errors on every slash command invocation. Will be reimplemented as a command-based solution later.

## [1.22.1] – 2026-03-30

### Fixed

- **Architectural state injection**: Replaced prompt-based state detection (failed 3 times) with a UserPromptSubmit command hook that injects project state as immutable context before the model processes `/de:start`. The model now reads pre-computed state instead of making its own judgment call.
- **Existing project setup flow**: Added mandatory transition guards between Step 6 sub-steps (6a→6b→6c→6d) so the model can't skip diagnostic questions or setup. Added status line question to Step 6d for existing projects.
- **Model upgrade**: `meta-setup` upgraded from `sonnet/medium` to `opus/high` for more reliable instruction following alongside the architectural fix.

## [1.22.0] – 2026-03-29

### Added

- **Content preservation hook**: New Sonnet PostToolUse prompt hook reviews substantial edits for unintended content loss. Fires on `Edit|MultiEdit`, bails out on small/trivial changes, blocks when important content appears to have been removed.
- **Plan completeness checklist**: Plan format now requires a `**Checklist:**` field per phase with discrete deliverable items. Post-phase workflow includes a mandatory completeness review step before presenting to the user.
- **Content-loss detection in fidelity hook**: Existing `de-fidelity-hook.js` now warns when an edit removes more than 30% of the replaced content during plan execution.

## [1.21.3] – 2026-03-29

### Fixed

- **Architectural state detection**: Moved project state check from LLM judgment to a shell script (`detect-state.sh`). The model now follows the script output instead of deciding on its own whether a project is new or returning.
- **No-jargon output rule**: Added output formatting rule 3 to CLAUDE.md – no config file names, internal skill IDs, hook names, or detection logic in user-facing messages. Rewrote meta-setup templates (resume state, environment detection, setup summary) to use plain language.
- **Path B memory leak**: Strengthened guards to block auto-memory from influencing any part of the new-to-plugin flow – routing, greeting, status, and question selection.
- **Diagnostic questions skipped**: Added explicit "do not skip" instruction to prevent the model from inventing custom options based on memory.
- **Hook error on slash commands**: `UserPromptSubmit` prompt cleaner errored on empty slash command input. Added early bail-out for empty and `/`-prefixed inputs.

## [1.21.2] – 2026-03-29

### Fixed

- **Project state detection**: `/de:start` could misidentify an existing project (never used with the plugin) as a "returning project" when Claude's auto-memory contained rich context from previous sessions. Added hard gate in `meta-setup` – only `.design-engineer.yaml` determines plugin usage, not memory or project history.

## [1.21.1] – 2026-03-27

### Changed

- **Scope drift detection**: Fidelity hook now warns when Claude writes files not listed in any phase of the approved plan. Catches unplanned file creation during implementation.
- **Forcing questions**: `ux-problem-statement` Step 3 enriched with 6 pointed questions (demand reality, status quo, narrowest wedge, surprising observations, failure mode, existing alternatives) for cutting through vague product thinking.

## [1.21.0] – 2026-03-27

### Changed

- **Git workflow automation**: `dev-github-workflow` transformed from a teaching skill into a working automation tool. Handles commits, branches, PRs, and merges in two modes – automatic (during plan execution) and manual (user invokes directly). Conventional Commits format with plugin attribution footer.
- **Plan workflow git integration**: CLAUDE.md plan execution now creates a feature branch at plan start, commits after each approved phase, and creates a PR when the plan completes.
- **Dev pipeline git step**: `/de:dev` feature cycle now includes a commit step after each feature is built and audited.

## [1.20.2] – 2026-03-27

### Changed

- **Component reuse enforcement**: Plan template `Reuse` field now requires specific component-level decisions (use as-is / extend with variants / create new). Frontend implementer has a mandatory component audit step before writing code. Fidelity hook warns when creating new component files in component directories.

## [1.20.1] – 2026-03-26

### Added

- **Figma design intake hooks**: PreToolUse hook on screenshot tools blocks screenshot-only implementation/review – requires `get_design_context` first. PostToolUse hook on `get_design_context` prompts AI to ask clarifying questions about interactions, animations, state changes, and anything not visible in static designs.
- **Frontend implementer update**: Agent now requires `get_design_context` (never screenshots alone) and must ask clarifying questions before implementing designs.

## [1.20.0] – 2026-03-26

### Changed

- **Incremental plan implementation**: Plan mode now requires phased execution with user review between each phase. Every phase must have `Depends on` (dependencies) and `QA` (review instructions) fields. Claude creates tasks for each phase, implements one at a time, presents QA instructions, and waits for feedback before proceeding.
- **Phase ordering enforcement**: `de-fidelity-hook.js` extended to parse plan phases and warn when Claude writes files from a later phase before completing earlier ones.

## [1.19.1] – 2026-03-24

### Changed

- **Figma MCP routing**: New `figma-mcp-routing.md` reference with decision guide, capability matrix, and workflow recipes for choosing between "Figma Plugin" and "Figma Console MCP".
- **Dual-MCP support**: `ui-figma-handoff` no longer requires "Figma Console MCP" exclusively – works with "Figma Plugin"'s `use_figma` as fallback. "Figma Console MCP" recommended for variables, linting, and batch operations.
- **New capabilities**: `ui-figma-guide` updated with web capture (`generate_figma_design`) and design system rules generation (`create_design_system_rules`) from the "Figma Plugin" update.

## [1.19.0] – 2026-03-24

### Added

- **Prompt improvement hook**: `UserPromptSubmit` hook runs every message through Haiku for light cleanup – fixes grammar, removes filler words, numbers multiple requests, slightly tightens conversational tone. Preserves all context and meaning. Short confirmations are skipped.

## [1.18.1] – 2026-03-24

### Added

- **Animation reference enrichment**: 4 new reference files in ui-aesthetic-review – animation-by-emotion (7 emotions mapped to timing/easing/scale), animation-by-component (10 UI element timing specs), animation-by-context (6 industry-specific animation philosophies), animation-troubleshooting (9 problem-diagnosis patterns with fixes).

## [1.18.0] – 2026-03-23

### Added

- **Effort configuration**: Every skill and agent now has an explicit `effort:` frontmatter field. 5 max (broadest scans and reviews), 30 high (default for most skills), 14 medium (structured/mechanical tasks). No low effort used. CLAUDE.md updated with effort assignment principles.

## [1.17.3] – 2026-03-21

### Added

- **Output formatting rules**: CLAUDE.md now enforces en dashes (–) and sentence case in all Claude output – chat, deliverables, UI copy, code comments. Three agents (deliverable-writer, compound-documenter, frontend-implementer) have formatting reminders.

## [1.17.2] – 2026-03-20

### Changed

- **En dash cleanup**: Replaced 503 em dashes with en dashes (–) across 45 files. The plugin now uses en dashes consistently everywhere.
- **README humanized**: Rewrote for beginners – removed promotional language, title case headers, jargon ("dependency graph", "deliverables tracked by"), and AI writing patterns. Sentence case throughout. Simpler descriptions in all tables.

## [1.17.1] – 2026-03-20

### Added

- **Swiss knife branding**: Logo (`logo.svg`) added to repo and README header. Philosophy section rewritten with swiss knife identity and 6 methodology points (restored "Teach while working" and "Tool-agnostic" from v1.11.0). Branded welcome line in `/de:start`.

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

- Renamed 2 skills for clarity: `ux-story-panels`, `ux-motivation-audit`
- Standardized framework terminology across all skills and references

## [1.13.1] – 2026-03-19

### Added

- Complete persona example in `persona-framework.md`
- Consolidated StoryBrand canvas view in `storybrand-canvas-template.md`
- Lean Canvas section in `business-plan-template.md` (Ash Maurya)
- TAM/SAM/SOM structured explanation in `business-plan-template.md`

## [1.13.0] – 2026-03-19

### Added

- Story Panels image-generation workflow with example images
- Statusline `--watch` mode for usage limit tracking
- Usage monitor instructions in /de:start setup flow

### Removed

- 3 redundant reference files consolidated into existing ones

### Changed

- 12 UX reference files trimmed and improved
- Corrected tap target size to 44pt (WCAG 2.2 standard)
- Statusline credential access restricted to user-initiated `--watch` mode only

### Security

- Statusline no longer accesses macOS Keychain or credentials when triggered by Claude

## [1.12.0] – 2026-03-19

### Added

- Auto-memory integration: CLAUDE.md now includes a Memory Management section guiding Claude on when to read/write auto-memory across sessions
- Project Map (`memory/project-map.md`): living file tree with descriptions and "when to read" triggers – replaces ad-hoc filesystem exploration
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

- Smart entry point: `/de:setup` now detects project state and routes to three paths – returning projects resume, new products get full setup, existing projects get a capability guide with filtered recommendations
- Capability guide: existing project users see all plugin capabilities in plain language, answer diagnostic questions, and get filtered recommendations
- Iterative build enforcement: dev pipeline explicitly requires one-feature-at-a-time development with compound documentation after each cycle
- `/de:document` command: renamed from `/de:compound`, now includes stakeholder communication option (promotes `ux-communicating-decisions`)
- Psychology audit merged into `/de:review`: expanded psychology option with master audit, section deep-dive, and god mode

### Removed

- `/de:research` command (subset of `/de:design` – use design with phase jumping or direct access)
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
- All UX skills: replaced rigid "4-angle perspectives" and predefined question lists with context-based approach – AI shares brief thoughts based on project knowledge, then asks 7-10 context-adapted questions with source-specific concept guidance
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

- `de-fidelity-hook.js` PostToolUse command hook – injects requirement fidelity reminders after source code writes during active implementation
- Haiku prompt hook for plan files – reviews plans for requirement drift (added features, modified copy, scope expansion) and warns Claude to revert or ask the user
- Requirement Fidelity section in CLAUDE.md defining drift vs. acceptable implementation details

## [1.10.0] – 2026-03-18

### Added

- `de-prompt-injection-hook.js` PostToolUse hook – scans tool outputs for indirect prompt injection attempts across 5 categories (instruction override, role-playing/DAN, encoding/obfuscation, context manipulation, instruction smuggling). 55+ patterns ported from lasso-security/claude-hooks to JavaScript. Warns Claude without blocking. Fail-open design.

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
- AI Slop Test as 5th named test in ui-design-critique – checks against documented common AI aesthetic patterns
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

- TDD with Playwright CLI – mandatory test-first development for all code-producing steps
- New `test-writer` agent – writes failing Playwright CLI test scripts before implementation (context-isolated)
- New `de-tdd-hook.js` PreToolUse hook – blocks source code writes when no test scripts exist in `tests/`
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

- `/simplify` integration – mandatory code quality pass after every code-producing step
- Runs after backend-implementer, after frontend-implementer, and as a final pass before design-system-auditor
- Runs after prototype generation and final iteration in dev-prototyping
- Code quality rule added to CLAUDE.md and CLAUDE.md template

### Changed

- Dev pipeline renumbered: Phase 3 includes /simplify steps, old Phase 4 (Wrap Up) split into Phase 4 (Quality Audit) + Phase 5 (Wrap Up)
- Pipeline Violations updated to include skipping /simplify
- REMEMBER FOR EVERY PROMPT expanded to 11 items

## [1.6.0] – 2026-03-12

### Added

- Plan Mode integration – Claude now uses EnterPlanMode for all non-trivial planning instead of text-based plans
- Project-local plan storage in `plans/` with date-prefixed filenames
- Plan archival to `plans/archive/` when implementation completes
- Structured plan template (summary, architectural decisions, phased breakdown, risk assessment) embedded in CLAUDE.md

### Changed

- Merged `plan-creator` agent into Plan Mode flow – planning now happens in the main conversation with full context, not a sub-agent
- `dev-agent-setup` Phase 2 uses Plan Mode instead of plan-creator sub-agent
- Pipeline development loop updated across orchestrator, commands, and agent references
- Agent count 9 → 8, version 1.5.2 → 1.6.0

### Removed

- `plan-creator` agent (replaced by Plan Mode with structured template)

## [1.5.2] – 2026-03-12

### Changed

- Context monitoring now includes a ready-to-use compact message proactively in the warning – no extra round-trip needed
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

- New `de-safety-hook.js` PreToolUse hook – context-aware protection against destructive Bash commands
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

- New `de-statusline.js` hook – status line showing model, usage limits (5h/7d with reset times), context bar, and pipeline progress
- New `meta-statusline` skill – manages status line installation, uninstallation, and status checking
- New `/de:statusline` command with install | uninstall | status subcommands
- Status line question added to `/de:setup` flow (new Step 6)
- Bridge file compatibility with GSD context monitor (`/tmp/claude-ctx-{session}.json`)
- Background API fetch for Anthropic usage data with 60s cache

### Changed

- `meta-setup` now includes status line installation option (Steps 6-8 renumbered from 5-7)
- Skill count 49 → 50, command count 8 → 9

## [1.3.0] – 2026-03-11

### Added

- New `ui-figma-handoff` skill – automates Figma design structuring (components, tokens, variables, styles) and dev handoff preparation (annotations, sections, connectors, dev status) using Figma Console MCP
- Three new reference files: `figma-structuring-guide.md` (7-phase methodology), `figma-handoff-guide.md` (handoff preparation process), `figma-console-helpers.md` (code snippets for Figma Console MCP)
- Code-to-Figma import guidance in `dev-prototyping` and `ui-figma-guide`
- `figma-handoff` deliverable in dependency graph with upstream/downstream tracking

### Changed

- Rewrote `figma-for-ai-dev.md` – no longer says "skip components and tokens"; now recommends automating with Figma Console MCP when available, with minimal approach as fallback
- Updated `figma-mcp-guide.md` – renamed to Figma Integration Guide, added code-to-Figma import capability and `ui-figma-handoff` reference
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
