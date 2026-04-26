# v4.7.0 — First-class existing-project support: auto-detect state, sweep biased skills, add two workflow branches

## Context

Plugin author's own feedback (after 18+ tester-feedback rounds): the plugin works at maybe 30% of its potential on existing/commercial projects because it's structurally biased toward new pet projects. ~9-11 ux-* skills (StoryBrand, business plan, problem statement, target audience, assumptions, competitor analysis, user interviews, behavior mapping, story panels) assume a blank slate. The Feature flow in `commands/design-engineer/design.md` still imposes ux-mvp-requirements + ux-information-architecture as the entry point, which is overkill for "add one feature to a B2B app that already has docs."

Two concrete commercial scenarios are unsupported today:

1. **Big redesign**: client web app, designer hired to improve. Designer wants to recreate the product (or audit it in place) page-by-page using Playwright, run psych/aesthetic/design-system audits per page, AND attach their own professional feedback per page. Both perspectives stored together.
2. **Small feature on established product**: B2B app with established design language and existing documentation. Don't push StoryBrand, don't impose Phase 1+2, don't even force Phase 3 unless the feature genuinely needs it. Just give a minimal spec respecting the existing context.

User refinements through the planning conversation:
- **Don't over-engineer.** No new schema with five booleans. No multi-release roadmap. No 60-file sweep.
- **The colleague's atomic-design-skills repo was an example, not a template.** Don't mirror its 5 skills.
- **One-sentence skip-check per biased skill** is enough — auto-detection does the heavy lifting; skills just respect what's already known.
- **Argument branches in existing commands**, not new commands. `/design-engineer:design audit` and `/design-engineer:design feature-spec`. No command sprawl.
- **Auto-detect + user-augmented**. `detect-environment.sh` scans the repo for design-system markers / brand docs / specs / shipped UI. `meta-setup` shows the user what was found and asks "anything else outside the repo? Figma file? Notion page? Linear ticket?" — captures off-repo context cleanly.

This is a feature addition with a sweep — backward-compatible in behavior (existing flows still work), MINOR bump → **v4.7.0**.

### Refinements from Ultraplan scoping pass

Ultraplan crashed mid-write but its pre-crash findings corrected six concrete points in the original draft:

1. **Edit point for state capture is `hooks/de-start-state.sh`, not `skills/meta-setup-existing/SKILL.md`.** The hook's ONBOARDING SEQUENCE (STEP 3) is the source of truth for the existing-project flow; the skill is a thin reference.
2. **`ux-user-interviews` and `ux-behavior-mapping` don't write canonical files** — they enrich existing ones. So their pattern is "input augmentation," not "skip-check." Different mechanic, same intent.
3. **`audit` argument moves to `/design-engineer:review`, not `/design-engineer:design`.** review.md already runs psych-scanner / design-system-auditor / ui-aesthetic-review / ux-motivation-audit — semantically that's where audit belongs. design.md is for designing; review.md is for finding issues.
4. **No `meta-orchestrator` edit needed.** Orchestrator owns the from-scratch pipeline; the new argument branches bypass it intentionally.
5. **`design/features/[slug]/` is already an established convention** (design.md:30) — no need to invent it.
6. **`prototype/` is at project root**, not under `design/` — already known but worth noting since the plan references neighbors.

## Architectural decisions

- **No schema, just config fields.** `.design-engineer-plugin/config.yaml` gets a `project.context` section with what was found / declared (existing brand, design system, written specs, shipped UI, off-repo references). Skills read those fields. No new files, no abstractions.
- **One detection extension, not a parallel script.** Add scanning for design-system / brand-doc / spec markers to the existing `skills/meta-setup/scripts/detect-environment.sh`. Same script, same flow, more output.
- **Show + augment pattern for state capture.** `meta-setup` reports what was detected ("Found: design-system folder at `src/design-system/`, tokens.css, README mentions an established brand voice"), then asks "Anything else outside the repo I should know about? Figma project, Notion docs, design-system page, ticket tracker, etc." Captures both repo and off-repo context.
- **One-sentence skip-check per biased skill.** Each of the 9-11 biased ux-* skills gets a top-of-skill check: "If `.design-engineer-plugin/config.yaml` declares this project is established AND the relevant artifact already exists (in repo or referenced off-repo), skip — output a one-line summary referencing the existing artifact, ask the user whether anything needs refinement, and yield. Otherwise proceed normally." Single short paragraph, identical pattern across skills, easy to audit.
- **Two argument branches, not new commands.** `/design-engineer:design audit` (page-by-page commercial audit) and `/design-engineer:design feature-spec` (minimal feature spec for established products). Both live in `commands/design-engineer/design.md` routing logic. No new command files.
- **Audit branch reuses existing review infrastructure.** Page-by-page audit uses Playwright (already in dev-prototyping toolkit) + existing `psych-scanner`, `design-system-auditor`, `ux-motivation-audit` agents/skills. Designer feedback per page is captured via AskUserQuestion and stored at `design/reviews/[date]-page-by-page/[page-name].md` alongside the AI findings.
- **feature-spec branch reuses existing planning skills lightly.** Minimal: 1-paragraph problem framing in the existing brand voice (read from `design/foundation/storybrand.md` if present, else from the user's declaration), 1 IA addition naming affected pages, key interactions, success criteria. Skips ux-target-audience (existing personas if any), skips ux-storybrand entirely (existing brand assumed).
- **Component gallery first-scan path discoverability.** Already wired in v4.6.0 (design-system-auditor auto-scaffolds when components exist but no gallery), but add a single-line note to `commands/design-engineer/review.md` so users know running review on an existing codebase will create the gallery automatically.
- **CHANGELOG cites the colleague's repo** as the structural inspiration (per the v4.2.0 source-citation requirement), explicitly noting we did not mirror its 5 skills.

## Phase 1: Auto-detect existing-project state + sweep biased skills with one-sentence skip-check

**Objective**: Light-touch detection extension + state capture during `meta-setup` + skip-check sweep across the 9-11 biased ux-* skills. Foundation for the workflow branches in Phase 2.

**Depends on**: none.

**Files to modify**:

- **`skills/meta-setup/scripts/detect-environment.sh`** — add a new detection block "Project context detection" after the existing checks. Scan for:
  - **Design-system markers**: `design-system/`, `src/design-system/`, `tokens.css`, `theme.ts`, `tailwind.config.*` with custom theme, `tokens.json`, `*.tokens.*`, `Foundation/Tokens/` (iOS), `theme/` folders, etc.
  - **Brand docs / written specs**: `README.md` length and content (>500 lines suggests substantial existing docs), `docs/`, `documentation/`, `BRAND.md`, `STYLE-GUIDE.md`, `BRANDING.md`, Notion/Linear references in package.json or README.
  - **Shipped UI markers**: presence of routes/pages/screens (framework-specific — `app/`, `pages/`, `src/routes/`, `Sources/<Module>/Views/`, `lib/screens/`).
  - **Component count**: rough count of files under `components/`, `Components/`, `src/components/` (gives signal: 0 = greenfield, >20 = established).
  - Output as structured key/value lines the onboarding hook can parse.
- **`hooks/de-start-state.sh`** (the ONBOARDING SEQUENCE source of truth — Ultraplan correction: NOT `skills/meta-setup-existing/SKILL.md`, which is a thin reference). Insert into PATH B's STEP 3 a new sub-step (between detect-environment.sh run and config.yaml write):
  1. Show the user what was detected in plain language ("Found a design-system folder, established brand voice in README, 34 components, shipped UI at `app/`. Looks like an established project.").
  2. Ask one AskUserQuestion: "Is there anything else outside this repo I should know about?" — options like "Figma project", "Notion / Confluence docs", "Linear / Jira ticket tracker", "Established design-system page (Storybook / Zeroheight / etc.)", "Other / I'll describe in custom answer", "No, that's everything". Multi-select.
  3. Persist all findings + user additions to `.design-engineer-plugin/config.yaml` under `project.context` — fields: `existing_design_system: true|false|<path>`, `existing_brand_docs: true|false|<location>`, `existing_specs: true|false|<location>`, `shipped_ui: true|false`, `off_repo_references: [list of strings]`.
- **Sweep the 9 biased ux-* skills** — `ux-storybrand`, `ux-business-plan`, `ux-problem-statement`, `ux-target-audience`, `ux-assumptions`, `ux-competitor-analysis`, `ux-user-interviews`, `ux-behavior-mapping`, `ux-story-panels`. Each gets a one-sentence skip-check at the top of its body (right after the YAML frontmatter / introduction):

  > **Existing-project skip-check.** Read `.design-engineer-plugin/config.yaml` `project.context`. If `existing_<relevant_field>: true` (e.g., `existing_brand_docs` for ux-storybrand, `existing_personas` for ux-target-audience, etc.), and the user did not explicitly request running this skill, output a one-line summary referencing the existing artifact (or off-repo source the user declared), ask whether anything needs refinement, and yield. Otherwise proceed normally.

  Adapt the field reference per skill (each skill knows what artifact it produces).
- **`skills/ux-mvp-requirements/SKILL.md`** and **`skills/ux-information-architecture/SKILL.md`** — add a similar but slightly more nuanced check: "If `project.context.shipped_ui: true` AND the user is here for a single feature (not a full pipeline), reduce scope: focus only on what this specific feature needs, don't regenerate the whole project's MVP scope or full IA."

**Reuse**:
- Existing `detect-environment.sh` pattern (extends, doesn't duplicate).
- Existing `meta-setup` AskUserQuestion flow (adds one round).
- Existing `.design-engineer-plugin/config.yaml` storage (adds a `project.context` section, no new files).

**Implementation details**:

The skip-check pattern to copy-paste-adapt across the 9 skills:

```markdown
## Existing-project skip-check

Before doing the work below, read `.design-engineer-plugin/config.yaml` `project.context.<relevant_key>`. If it indicates the project already has [this artifact], and the user did not explicitly request rerunning this skill, do not regenerate.

Instead:
1. In one line, summarize what already exists (and where — repo path or off-repo reference).
2. Ask via AskUserQuestion: "Your project already has [artifact at <location>]. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
4. If "Refine" → narrow scope to the user's described refinement only.
5. If "Re-run anyway" → proceed normally below.
```

The adaptation per skill is just substituting `<relevant_key>` and `<artifact>`:
- ux-storybrand → `existing_brand_docs` / "brand voice and StoryBrand framing"
- ux-business-plan → `existing_business_plan` (rare — usually not in repo) / "business plan and revenue model"
- ux-problem-statement → `existing_problem_statement` / "problem framing"
- ux-target-audience → `existing_personas` / "user personas"
- ux-assumptions → `existing_assumptions_log` (rare) / "assumption log"
- ux-competitor-analysis → `existing_competitor_analysis` / "competitor analysis"
- ux-story-panels → `existing_story_panels` / "narrative story panels"

**Special case (Ultraplan correction): `ux-user-interviews` and `ux-behavior-mapping` don't write a single canonical deliverable file — they enrich existing ones.** So their check is a different shape: instead of "skip if artifact exists", it's "if `project.context.off_repo_references` includes user research / behavior insights, treat them as input rather than starting fresh; ask the user to share what they have and use it to enrich the analysis." Same intent (respect existing context), different mechanic (input augmentation, not skip).

**Checklist**:
- [ ] Extend `detect-environment.sh` with project-context detection block (design-system / brand-docs / specs / shipped-UI / component-count)
- [ ] Update `hooks/de-start-state.sh` ONBOARDING SEQUENCE STEP 3 to show detected context + ask the augmentation AskUserQuestion + persist to config.yaml under `project.context` (Ultraplan correction: hook string is the source of truth, not `skills/meta-setup-existing/SKILL.md`)
- [ ] `.design-engineer-plugin/config.yaml` schema example gains a `project.context` section
- [ ] Add skip-check to 7 biased ux-* skills with canonical deliverables (ux-storybrand, ux-business-plan, ux-problem-statement, ux-target-audience, ux-assumptions, ux-competitor-analysis, ux-story-panels)
- [ ] Add input-augmentation pattern (different shape) to 2 enriching skills: `ux-user-interviews`, `ux-behavior-mapping`
- [ ] Update ux-mvp-requirements + ux-information-architecture with feature-scope reduction when `shipped_ui: true`
- [ ] Spot-check: skip-check pattern is identical in shape across the 7 canonical-deliverable skills (only `<relevant_key>` and `<artifact>` differ)

**QA**:
1. `grep -rn "Existing-project skip-check" skills/ux-*/SKILL.md` returns hits in 7 of the 9 biased skills (the 7 with canonical deliverables; the 2 enriching skills get a different pattern named "Existing-context augmentation").
2. `grep -n "project.context" hooks/de-start-state.sh` confirms hook is the persistence source of truth.
3. `grep -n "design-system\|brand\|shipped" skills/meta-setup/scripts/detect-environment.sh` confirms detection block present.
4. Manual smoke test (deferred to user): run `/design-engineer:start` on a real established project with a `tokens.css` and a hefty README → observe detection report + augmentation question + state captured. Then run `/design-engineer:design` with `existing_brand_docs: true` → observe `ux-storybrand` skip-check fires.

## Phase 2: Two argument branches (audit → review.md, feature-spec → design.md) + version bump + ship

**Objective**: Add the page-by-page audit branch to `/design-engineer:review` (Ultraplan correction: review.md is for finding issues; audit semantically belongs there, not in design.md). Add the minimal feature-spec branch to `/design-engineer:design`. Cut v4.7.0.

**Depends on**: Phase 1.

**Files to modify**:

- **`commands/design-engineer/review.md`** — add a new `audit` argument branch (Ultraplan correction: review.md is for finding issues; audit semantically belongs here, not in design.md). review.md already runs `psych-scanner` / `design-system-auditor` / `ui-aesthetic-review` / `ux-motivation-audit` — the audit branch extends this to a multi-page Playwright loop:
  1. Verify project has shipped UI (`project.context.shipped_ui: true`); if not, fall back to single-page review or route to design pipeline.
  2. Ask the user for the entry URL (or list of pages to cover) + a "max pages" cap.
  3. For each page: navigate via Playwright → capture screenshot + structure → run the four agents/skills review.md already uses → present AI findings → ask the user for their professional feedback (AskUserQuestion with "I'll write notes" option) → store both at `design/reviews/[YYYY-MM-DD]-audit/[page-slug].md`.
  4. After all pages: synthesize a redesign brief at `design/reviews/[YYYY-MM-DD]-audit/SUMMARY.md` and route to `/design-engineer:dev` if user wants to act on findings.
  - **Also** in review.md: add a single-line note near the entry point — "Existing codebases without a component gallery will have one auto-scaffolded by `design-system-auditor` during this review (v4.6.0 transparent infrastructure)." Discoverability for gallery first-scan.
  - Update review.md argument-hint to include `audit`.
- **`commands/design-engineer/design.md`** — add a new `feature-spec` argument branch (minimal feature spec for established products):
  1. Verify `project.context.shipped_ui: true` AND `existing_design_system OR existing_brand_docs`.
  2. Ask the user: "Describe the feature (what it does, who uses it, why now)." One AskUserQuestion or short natural-language prompt.
  3. Generate a 1-paragraph problem framing in the project's existing brand voice (read `design/foundation/storybrand.md` if present, else off-repo brand reference declared by user).
  4. Brief IA addition: name the pages this feature touches; if a sitemap exists at `design/planning/information-architecture.md`, reference it; else just enumerate.
  5. Key interactions, success criteria, success metrics if user can articulate them.
  6. Output: `design/features/[feature-slug]/feature-spec.md` — Ultraplan confirms `design/features/[slug]/` is already the established convention from design.md:30. No phases. No StoryBrand. No business plan. Hand off to `/design-engineer:dev`.
  - Update design.md argument-hint from `"[phase N | skill-name]"` to `"[phase N | skill-name | feature-spec]"`.
  - For both branches (audit + feature-spec): still go through Plan Mode for execution per CLAUDE.md plan workflow — but the *output* is the spec/audit, not a multi-phase implementation plan unless the user explicitly asks for one.
- **No `meta-orchestrator` edit** (Ultraplan correction): meta-orchestrator controls the full from-scratch pipeline; the new argument branches bypass it intentionally. No update needed there.
- **`.claude-plugin/plugin.json`** — bump 4.6.0 → 4.7.0.
- **`.claude-plugin/marketplace.json`** — bump 4.6.0 → 4.7.0.
- **`CHANGELOG.md`** — `[4.7.0] – 2026-04-26` Added entry. Body: explain the bias problem, the simpler approach chosen (auto-detect + sweep + branches, not schema-and-multi-release), credit the colleague's atomic-design-skills repo as structural inspiration (with note that we did not mirror its 5 skills). Cite reused infrastructure: `detect-environment.sh`, existing config.yaml, existing review/dev pipelines, v4.6.0 component gallery.
- **`README.md`** — bump banner v4.6.0 → v4.7.0; add a feature line summarizing existing-project support; count 68 → 69.

**Reuse**:
- Existing `psych-scanner`, `design-system-auditor`, `ui-aesthetic-review`, `ux-motivation-audit` agents/skills for the audit branch.
- Existing `dev-prototyping`'s Playwright integration patterns.
- Existing AskUserQuestion + `design/reviews/` storage convention.
- Existing CHANGELOG format from v4.6.0.

**Implementation details**:

For the `audit` branch, the per-page deliverable shape:

```markdown
# [Page name] — Audit

**URL**: [captured URL]
**Date**: [YYYY-MM-DD]

## AI findings

### Psychology (psych-scanner)
[findings]

### Visual / aesthetic (ui-aesthetic-review)
[findings]

### Design system compliance (design-system-auditor)
[findings]

### Motivation / UX (ux-motivation-audit)
[findings]

## Designer's feedback

[user's professional notes per the AskUserQuestion / freeform]

## Combined recommendation

[synthesis: which AI findings to act on, which to defer per designer's input, what the designer flagged that AI missed]
```

For the `feature-spec` branch, the deliverable shape:

```markdown
# [Feature name] — Spec

## Problem (in project's voice)
[1 paragraph using existing brand voice]

## Affected pages
- [Page 1] — [what changes]
- [Page 2] — [what changes]

## Key interactions
[bullet list]

## Success criteria
[bullet list]

## Out of scope
[what this spec does NOT cover]
```

**Checklist**:
- [ ] design.md routes `audit` and `feature-spec` arguments
- [ ] design.md `audit` branch: per-page Playwright + 4 audit agents + designer feedback + storage at `design/reviews/[date]-audit/[page-slug].md` + summary file
- [ ] design.md `feature-spec` branch: minimal spec generator + storage at `design/features/[slug]/feature-spec.md`
- [ ] design.md argument-hint updated
- [ ] review.md adds single-line gallery-first-scan discoverability note
- [ ] meta-orchestrator updated with routing for the two new paths
- [ ] `.claude-plugin/plugin.json` 4.6.0 → 4.7.0
- [ ] `.claude-plugin/marketplace.json` 4.6.0 → 4.7.0
- [ ] CHANGELOG `[4.7.0] – 2026-04-26` entry, citations included
- [ ] README banner v4.7.0, feature line added, count → 69
- [ ] JSON manifests valid
- [ ] Mode 1 commit per `dev-github-workflow`, explicit user authorization before push to main

**QA**:
1. `python3 -m json.tool` succeeds on both manifests.
2. `grep -n "audit\|feature-spec" commands/design-engineer/design.md` shows both branches wired.
3. `grep -n "4.7.0" .claude-plugin/plugin.json .claude-plugin/marketplace.json README.md CHANGELOG.md` shows version in all four.
4. Manual smoke test (deferred to user, after install):
   - On a real commercial app: `/design-engineer:design audit` → observe page-by-page Playwright run, AI findings + AskUserQuestion for designer feedback per page, storage at `design/reviews/[date]-audit/`.
   - On a B2B app with brand docs already present: `/design-engineer:design feature-spec` → observe minimal spec generation respecting brand voice, no StoryBrand pushiness, deliverable at `design/features/[slug]/feature-spec.md`.
   - Run `/design-engineer:start` on a hefty established repo → observe detection + augmentation Q + persistence.
   - Run `/design-engineer:design` standard flow on a project with `existing_brand_docs: true` → observe ux-storybrand skip-check fires with a one-line summary.

## Risk assessment

- **Risk**: skip-check sweep is too aggressive — skips skills the user actually wanted to run. **Mitigation**: skip-check ALWAYS asks via AskUserQuestion ("use existing? refine? re-run anyway?"). Never silent. User can always force the rerun.
- **Risk**: detection produces false positives (e.g., a project has a `design-system/` folder that's empty or stale — gets flagged as established). **Mitigation**: detection is augmented by the user's confirmation question. The user sees what was detected and corrects it on the spot.
- **Risk**: `audit` branch's per-page Playwright run takes a long time on apps with many pages. **Mitigation**: ask the user for the list of pages OR for the entry URL + a "max pages" cap. Don't crawl unbounded.
- **Risk**: `feature-spec` branch produces a spec that's too thin to drive implementation. **Mitigation**: the spec output handing off to `/design-engineer:dev` lets the dev command's Plan Mode workflow flesh out the implementation phases. The spec is intentionally minimal — it's a starting point, not a complete plan.
- **Risk**: scope creep in implementation — sweeping 9 skills could turn into rewriting them. **Mitigation**: the skip-check is a paste-the-same-pattern operation. ~1 paragraph per skill. Plan checklist is the contract; nothing outside the checklist gets implemented.
- **Risk**: this changes the user-facing behavior of `/design-engineer:start` (new questions during onboarding). **Mitigation**: the augmentation question only fires when detection finds existing-project markers. New / blank projects skip it entirely. Existing-project users get the new context capture, which is the whole point.

## Verification (end-to-end)

After v4.7.0 lands:
1. `detect-environment.sh` outputs project-context section (design-system / brand / specs / shipped-UI / component count).
2. meta-setup shows the detected context to the user and asks the augmentation question for off-repo references.
3. `.design-engineer-plugin/config.yaml` includes a `project.context` section after onboarding on an established project.
4. All 9 biased ux-* skills include the same-shape skip-check pattern at the top.
5. `ux-mvp-requirements` and `ux-information-architecture` reduce scope when `shipped_ui: true`.
6. `commands/design-engineer/design.md` routes `audit` and `feature-spec` arguments correctly.
7. `commands/design-engineer/review.md` mentions gallery first-scan auto-scaffold.
8. `meta-orchestrator` references the two new routing paths.
9. Version 4.7.0 in plugin.json / marketplace.json / README banner / CHANGELOG entry.
10. Manual smoke test items above pass on real projects.

## Questions for user

None — refinements approved through the clarifying-question round (auto-detect + augment, argument branches not new commands, one-sentence skip-check). Sweep depth picked per your delegation. Ready to implement on plan approval.
