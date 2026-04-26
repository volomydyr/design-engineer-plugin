# v4.8.0 — Audit-driven full remediation: fix all 108 findings

## Context

The 2026-04-26 comprehensive audit (`audit/2026-04-26-comprehensive/`) produced **108 findings** (2 BLOCKER, 55 HIGH, 38 MEDIUM, 13 LOW). The user's directive: fix all of them in one MINOR bump (v4.8.0). This plan addresses every finding with an explicit phase, files-to-modify, and ledger-ID coverage table at the end.

User direction captured during scoping (overrides defaults):
- **Sound (F-0010)**: keep the install-time question in `/design-engineer:start`, but make sounds actually play. Mute toggle (`/design-engineer:mute-unmute-sound`) must keep working.
- **Figma (F-0080)**: bundled Figma plugin MCP is the default. The figma-console MCP is optional; offer the GitHub install link only when the user opts into advanced workflows. Don't force figma-console as a hard dependency.
- **Em-dash sweep**: plugin source only (`skills/`, `agents/`, `commands/`, `hooks/`, `README.md`, `CLAUDE.md`). Skip `CHANGELOG.md`, `plans/archive/`, `audit/`.
- **Version**: single MINOR bump → **v4.8.0**.

## Architectural decisions

- **One MINOR ship, not split**. v4.8.0 includes everything. CHANGELOG narrates the audit + remediation as a single quality-overhaul release.
- **Sounds use the existing flag-file mute mechanism, not settings.json hooks**. Register sound hooks unconditionally in plugin's `hooks/hooks.json` (Stop + Notification). The install question maps "Yes" → ensure `~/.claude/de-sound-muted` is absent; "No" → create the flag. The mute-unmute-sound command continues to toggle the flag. Net: `${CLAUDE_PLUGIN_ROOT}` resolves correctly (per Anthropic docs), opt-in is preserved, mute toggle keeps working without changes.
- **Figma routing already has good content** (`skills/ui-figma-guide/references/figma-mcp-routing.md`). Keep it. The fix is making the bundled Figma plugin the default in skill flows and offering an opt-in install pointer for figma-console when users hit advanced workflows. No skill rewrites.
- **Folder convention is `design/` everywhere**. The script (`init-project-structure.sh`) creates `design/` at root with subfolders `foundation/`, `research/`, `planning/`, `craft/` (with `references/` and `story-panels/` inside), `psych/`, `reviews/`, `dev/`. `prototype/` is at root, sibling of `design/`. Every other reference must align.
- **`compatibility:` frontmatter is a deliberate plugin extension**, not a violation. Anthropic docs don't sanction it but don't forbid it. Keep it (informative for users) and add a CLAUDE.md note that it's plugin-internal.
- **Em-dash sweep is mechanical**, applied via `find … -exec sed -i '' 's/—/–/g'` then spot-verified. ~335 lines across 6 directories. Single phase, single commit.
- **No new content invented**. Where the audit flagged "missing case studies" or "missing templates" (F-0150, F-0151), the fix is to add **stubs** that reference real artifacts the user can fill in over time, not to fabricate domain content.
- **Each phase is independently reviewable**. CLAUDE.md mandates "one phase, one review, one approval." Eleven phases below; each ends in a dev-github-workflow Mode 1 commit only after explicit user approval.
- **Coverage gate**: every F-XXXX ID in `audit/2026-04-26-comprehensive/99-ledger.json` must map to exactly one phase (or be explicitly deferred with reason). The mapping table is at the bottom of this plan.

## Phase 1 — BLOCKERs + onboarding correctness

**Objective**: Fix the 2 BLOCKERs (sound + folder convention) and the directly-related correctness findings. After this phase, fresh-install + sound work correctly.

**Depends on**: none.

**Files**:
- **Modify** `hooks/hooks.json` — add Stop and Notification event entries for `bash ${CLAUDE_PLUGIN_ROOT}/hooks/de-play-sound.sh ${CLAUDE_PLUGIN_ROOT}/assets/sounds/de-complete.wav` (Stop) and `de-attention.wav` (Notification). Update the existing Stop entry to keep `session_dep_summary.py` AND add the sound entry. Update PreToolUse matcher line 56: drop `figma_capture_screenshot|figma_take_screenshot` (figma-console-only); keep `get_screenshot` (bundled figma); add a comment explaining why.
- **Modify** `skills/meta-setup/SKILL.md`:
  - Lines 274–323: rewrite the sound-install block. New flow: ask the same 2-/3-option question; on "Yes/Reinstall" delete `~/.claude/de-sound-muted` if it exists; on "No/Uninstall" create the empty flag file. Drop ALL writes to `~/.claude/settings.json`. The hook is already registered in `hooks/hooks.json` so `${CLAUDE_PLUGIN_ROOT}` resolves correctly.
  - Lines 139–150: rewrite the folder-structure documentation tree to match what `init-project-structure.sh` actually creates: `design/{foundation,research,research/archive,planning,craft,craft/references,craft/story-panels,psych,reviews,dev}` plus `prototype/` at project root.
- **Modify** `skills/meta-setup/scripts/detect-environment.sh` lines 102, 104, 228: replace `documents/design` with `design`.
- **Modify** `hooks/de-design-grounding-hook.js` line 57: replace `'documents/design/prototype/prototype.html'` with `'prototype/prototype.html'` (per init-project-structure.sh:64, prototype/ is at root, not under design/).
- **Modify** `commands/design-engineer/mute-unmute-sound.md`: remove the "wired through ~/.claude/settings.json only when the user accepted sound install" wording (lines ~30); replace with "Sound hooks are bundled in the plugin's `hooks/hooks.json`. The `~/.claude/de-sound-muted` flag controls whether sounds play. This command toggles the flag." Idempotent and works regardless of whether sound was previously installed.
- **Move** `plans/2026-04-26-existing-project-support.md` → `plans/archive/2026-04-26-existing-project-support.md` (F-0007).

**Reuse**:
- Existing `hooks/de-play-sound.sh` — already has the mute-flag check at line ~13; no edits needed. Already cross-platform. Already fail-silent.
- Existing `~/.claude/de-sound-muted` flag-file mechanism — works for both Stop and Notification because both use the same shim script.
- Existing `skills/meta-setup/scripts/init-project-structure.sh` — no edits; it's already correct (creates `design/`).

**Checklist**:
- [ ] hooks/hooks.json: add Stop entry with sound shim (alongside existing session_dep_summary.py); add Notification array with sound shim; update PreToolUse matcher line 56.
- [ ] meta-setup/SKILL.md sound block rewritten to use flag-file (no settings.json writes).
- [ ] meta-setup/SKILL.md folder doc rewritten to match actual scaffolded structure.
- [ ] detect-environment.sh:102,104,228 → `design/`.
- [ ] de-design-grounding-hook.js:57 → `prototype/prototype.html` (root, not under design/).
- [ ] mute-unmute-sound.md updated.
- [ ] Plan file archived.

**QA**:
1. Run `bash skills/meta-setup/scripts/init-project-structure.sh /tmp/scaffold-test`. Verify: `/tmp/scaffold-test/design/` exists with all 8 subfolders; `/tmp/scaffold-test/prototype/` exists at root.
2. From `/tmp/scaffold-test`, run `bash <plugin-root>/skills/meta-setup/scripts/detect-environment.sh`. Verify: output shows `Deliverables: yes` (was `no` before fix).
3. Restart Claude Code (or reinstall plugin). Trigger a Stop event (any response end) and observe the de-complete.wav plays. Run `/design-engineer:mute-unmute-sound` — verify the next Stop is silent. Run again — verify sounds resume.
4. Trigger an AskUserQuestion. Observe de-attention.wav plays.
5. `python3 -m json.tool hooks/hooks.json` — confirms valid JSON.
6. Verify `plans/archive/2026-04-26-existing-project-support.md` exists; `plans/2026-04-26-existing-project-support.md` does not.

**Coverage**: F-0007, F-0008, F-0010, F-0041, F-0081, F-0291, F-0292.

---

## Phase 2 — Em-dash sweep (~335 lines)

**Objective**: Replace every em dash (`—`) with en dash (`–`) across plugin source. Spot-verify no code blocks or quoted strings were corrupted.

**Depends on**: Phase 1 (so the BLOCKER fixes commit doesn't conflict with the sweep diff).

**Files**: every `*.md` and `*.js` and `*.sh` and `*.py` and `*.json` under `skills/`, `agents/`, `commands/`, `hooks/`, plus `README.md`, `CLAUDE.md`. Skip `CHANGELOG.md`, `plans/archive/`, `audit/`, `evals/evals.json`, `assets/`.

**Reuse**:
- Existing `dev-github-workflow` Mode 1 commit pattern.

**Implementation**:
1. Single sed pass: `find skills agents commands hooks -type f \( -name "*.md" -o -name "*.js" -o -name "*.sh" -o -name "*.py" \) -print0 | xargs -0 sed -i '' 's/—/–/g'`
2. Then: `sed -i '' 's/—/–/g' README.md CLAUDE.md`
3. Spot-verify no false-positives by re-grepping for em dashes: `grep -rn '—' skills agents commands hooks README.md CLAUDE.md` — must return 0 lines outside CHANGELOG.md.
4. Manually inspect any commit/code-block content that legitimately contained em dashes (unlikely but possible — e.g., quoted historical text). Restore if needed.
5. Verify no double-hyphen `--` or lone-hyphen ` - ` masquerading as dashes per CLAUDE.md rule #1: `grep -rnE '[a-zA-Z] -- [a-zA-Z]| - [a-z]' skills agents commands hooks` — review hits, fix obvious ones.

**Checklist**:
- [ ] sed pass on skills/, agents/, commands/, hooks/.
- [ ] sed pass on README.md and CLAUDE.md.
- [ ] Verification grep returns 0 em dashes.
- [ ] Spot-check of 5 high-traffic files (CLAUDE.md, README.md, agents/advisor.md, skills/meta-setup/SKILL.md, commands/design-engineer/design.md) shows clean replacement.

**QA**: `grep -c '—' skills agents commands hooks README.md CLAUDE.md 2>/dev/null` returns 0 across all files. Diff is large but mechanical. Reviewer scans the diff for any line where the replacement looks wrong (e.g., a code block where `—` was a literal in a string).

**Coverage**: F-0009, F-0121, F-0122, F-0123, F-0124, F-0136, F-0156–F-0186 (en-masse), F-0220 (sweep + sentence-case below), F-0240, F-0241, F-0242, F-0243, F-0244, F-0245, F-0246, F-0247, F-0248.

---

## Phase 3 — Documentation count drift + frontmatter gaps

**Objective**: Fix the 3 user-visible count drifts and the 2 missing-frontmatter findings.

**Depends on**: Phase 2 (so the en-dash sweep doesn't fight with manual edits).

**Files**:
- **Modify** `README.md:67`: "51 skills" → "57 skills".
- **Modify** `CLAUDE.md:35`: "9 specialized agents" → "10 specialized agents".
- **Modify** `CLAUDE.md:38`: "54 hidden skills" → "56 hidden skills (57 folders, 1 reference-only)" or pick "57 skills" — match README.md style; recommend `57 skills` since README uses it.
- **Modify** `agents/advisor.md` frontmatter: add `disable-model-invocation: true` after `description:` and ensure `effort: xhigh` is explicit. Currently frontmatter is `name`, `description`, `model`, `effort` — add the missing fields per CLAUDE.md mandate (every agent must have `model:` and `effort:`; `disable-model-invocation:` should be explicit for advisor since it's a checkpoint, not auto-invocable).
- **Modify** `skills/dev-component-gallery/SKILL.md` frontmatter: add `disable-model-invocation: true` after `description:`. Currently lacks it; CLAUDE.md mandates it on every skill.
- **Modify** `CLAUDE.md` "Skill Compliance Checklist" section (line ~92): add a note that `compatibility:` is a plugin-internal extension (not Anthropic-canonical) used for human-readable runtime requirements.

**Reuse**:
- Existing CLAUDE.md frontmatter rules section.

**Checklist**:
- [ ] README.md:67 updated.
- [ ] CLAUDE.md:35,38 updated.
- [ ] advisor.md frontmatter updated.
- [ ] dev-component-gallery/SKILL.md frontmatter updated.
- [ ] CLAUDE.md `compatibility:` extension note added.

**QA**: 
- `grep -nE '57 skills|10 (specialized )?agents' README.md CLAUDE.md` shows both consistent.
- `head -10 agents/advisor.md skills/dev-component-gallery/SKILL.md` shows complete frontmatter.

**Coverage**: F-0001, F-0002, F-0003, F-0004, F-0014.

---

## Phase 4 — Skip-check + scope-reduction normalization (v4.7.0 seam fix)

**Objective**: Define one canonical preamble template and apply it identically to all 7 ux-* skills. Verify the 2 input-augmentation skills + 2 scope-reduction skills are aligned.

**Depends on**: Phase 3 (frontmatter clean first).

**Files**:
- Define canonical template (in plan, not a separate file). Template:
  ```markdown
  ## Existing-project skip-check
  
  Read `.design-engineer-plugin/config.yaml` `project.context.<KEY>`. If `existing_<X>: true` (the project already has this artifact in repo or off-repo) OR `shipped_ui: true` (this is an established product where regenerating from scratch isn't appropriate) AND the user did not explicitly request rerunning this skill:
  1. Summarize in one line what already exists and where.
  2. Ask via AskUserQuestion: "Your project already has [artifact at <location>]. What would you like to do?" Options: "Use it as-is and proceed", "Refine specific parts (I'll describe)", "Re-run from scratch anyway".
  3. If "Use it as-is" → yield; the calling flow continues with the existing artifact.
  4. If "Refine" → narrow scope to the user's described refinement only.
  5. If "Re-run anyway" → proceed normally below.
  ```
- Apply this template (substituting `<KEY>` and `<X>` per skill) to:
  - `skills/ux-storybrand/SKILL.md` → `existing_brand_docs` / "brand voice and StoryBrand framing"
  - `skills/ux-business-plan/SKILL.md` → `existing_business_plan` / "business plan and revenue model"
  - `skills/ux-problem-statement/SKILL.md` → `existing_problem_statement` / "problem framing"
  - `skills/ux-target-audience/SKILL.md` → `existing_personas` / "user personas"
  - `skills/ux-assumptions/SKILL.md` → `existing_assumptions_log` / "assumption log"
  - `skills/ux-competitor-analysis/SKILL.md` → `existing_competitor_analysis` / "competitor analysis"
  - `skills/ux-story-panels/SKILL.md` → `existing_story_panels` / "narrative story panels"
- Verify (no rewrite needed) the input-augmentation pattern in `skills/ux-user-interviews/SKILL.md` and `skills/ux-behavior-mapping/SKILL.md` follows the same shape.
- Verify `skills/ux-mvp-requirements/SKILL.md` and `skills/ux-information-architecture/SKILL.md` reduce scope when `project.context.shipped_ui: true` — output to `design/features/[feature-slug]/` instead of project-level.

**Reuse**:
- Existing `project.context.*` keys (already defined in `hooks/de-start-state.sh` step 3.b.5).

**Checklist**:
- [ ] All 7 skip-check skills have identical preamble structure.
- [ ] All 7 read both `existing_X` AND `shipped_ui`.
- [ ] 2 input-augmentation skills verified parallel-shape.
- [ ] 2 scope-reduction skills verified.

**QA**:
- `for f in skills/ux-{storybrand,business-plan,problem-statement,target-audience,assumptions,competitor-analysis,story-panels}/SKILL.md; do grep -A 7 "Existing-project skip-check" "$f"; echo "---"; done` shows identical structure across the 7.
- Manual smoke (deferred): Run `/design-engineer:design` on a project with `existing_brand_docs: true` set in config — verify ux-storybrand fires the skip-check.

**Coverage**: F-0005, F-0011, F-0015.

---

## Phase 5 — Figma MCP scope decision + bundled-first routing

**Objective**: Don't make figma-console a hard dependency. Default to bundled Figma plugin. Offer opt-in install pointer for figma-console when users hit advanced workflows.

**Depends on**: none (independent of phases 1-4).

**Files**:
- **Modify** `skills/ui-figma-guide/SKILL.md`: in the existing "Figma integration" question (Step 1), change the labels so "Figma Plugin (Recommended, bundled)" is option 1, "Both (advanced — requires figma-console install)" is option 2. When user picks "Both", display: "figma-console MCP isn't bundled with this plugin — install instructions: https://github.com/figma/figma-console-mcp (or whatever the canonical repo is). Once installed, both servers run side-by-side." — let user proceed once they confirm install.
- **Modify** `skills/ui-figma-handoff/SKILL.md`: at the top of the skill body, add an explicit "Prerequisites" section that says "This skill uses the figma-console MCP for variables, linting, and batch operations. If you don't have it installed, see [link]. The skill will gracefully prompt and pause until you confirm install." On first tool use, check tool availability via the Skill body instructing the agent to attempt a `figma_get_status` call; on failure, prompt the user with the install link.
- **Modify** `skills/dev-mcp-setup/SKILL.md`: line 82 already mentions Figma Console MCP exists. Add: "Recommended install: https://github.com/figma/figma-console-mcp. The plugin's `ui-figma-handoff` skill prompts for this install when needed."
- **Modify** `README.md` "All 57 skills" section's UI catalog: add a one-liner next to ui-figma-handoff: "(advanced — uses figma-console MCP, optional install)".
- **Verify** no further changes needed in `skills/ui-figma-guide/references/figma-mcp-routing.md` (the guide is already correct).
- **Verify** the hooks/hooks.json:56 matcher fix from Phase 1 is sufficient.

**Reuse**:
- Existing `figma-mcp-routing.md` (correctly differentiates the two servers).
- Existing AskUserQuestion pattern in ui-figma-guide.

**Checklist**:
- [ ] ui-figma-guide Step 1 question updated with "bundled" / "advanced" framing.
- [ ] ui-figma-handoff prerequisites section added with install link.
- [ ] dev-mcp-setup mention augmented.
- [ ] README skill catalog notes the optional dependency.

**QA**: Run `/design-engineer:dev` (Implement from Figma) flow on a project. Verify the question prefers bundled Figma plugin. Pick "Both" and confirm the install pointer appears with the GitHub link.

**Coverage**: F-0080, F-0144 (figma-guide vs figma-handoff decision criteria — addressed by clearer prereqs).

---

## Phase 6 — Agent + skill style polish

**Objective**: Clean up agent headings, descriptions, and missing pre-flight documentation flagged by Surface G + Phase 1 audit.

**Depends on**: Phase 2 (em dashes done first).

**Files**:
- **Modify** all 10 `agents/*.md`: convert section headings from Title Case to sentence case. Use the exact pattern: `## Pre-Flight Checks` → `## Pre-flight checks`. Run `grep -nE '^## [A-Z][a-z]+ [A-Z]' agents/*.md` and lowercase every match per CLAUDE.md rule #2.
- **Modify** `agents/compound-documenter.md`: add a `## Defensive read pattern` section (~10 lines) referencing CLAUDE.md memory rules: "Before calling Read on memory files, verify they exist via test -f (Bash) or Glob; skip silently if absent."
- **Modify** `agents/frontend-implementer.md`: add `## Required pre-reads` and `## Optional pre-reads` headings explicitly listing what each section requires. Required: CLAUDE.md, design references, gallery (if exists). Optional: prototype (if exists, otherwise skip with explicit note).
- **Modify** `agents/advisor.md`: add 1-sentence preamble at top of body: "When invoked, you receive a brief from the calling skill or executor. Read it, return one short enumerated plan or course correction, no prose, no general advice." Frontmatter already updated in Phase 3.
- **Modify** `agents/context-analyzer.md`: replace ambiguous "status tracking file" with the actual filename: `.claude/agent-memory/compound-documenter/pipeline-state.md`.
- **Modify** `commands/design-engineer/dev.md`: document expected behavior on each missing-file case in the "design grounding pre-flight" section. Add: "If prototype.html missing: skip prototype check (feature-spec branch supports this). If references.md missing: warn but proceed. If CLAUDE.md missing: hard-block, surface 'this project has no CLAUDE.md; run /design-engineer:dev claude-md first'."
- **Modify** `commands/design-engineer/design.md` feature-spec branch (Step F1.x): add advisor checkpoint after F1.3 (spec drafted) and before F1.4 (handoff). Insert: "**Advisor checkpoint**: invoke `skills/advisor/` with the drafted spec, brand voice context, and any uncertainty about scope. Apply or reconcile."
- **Verify** `skills/dev-agent-setup/references/testing-anti-patterns.md` exists. If not, create with the 5 anti-patterns from CLAUDE.md TDD section: testing mock behavior, test-only methods in production, mocking without understanding, incomplete mocks, tests as afterthought.

**Reuse**:
- Existing CLAUDE.md memory pattern (line ~500).
- Existing CLAUDE.md TDD anti-patterns reference.

**Checklist**:
- [ ] 10 agents have sentence-case headings.
- [ ] compound-documenter defensive-read note added.
- [ ] frontend-implementer required/optional pre-reads added.
- [ ] advisor preamble added.
- [ ] context-analyzer file path specified.
- [ ] dev.md design grounding error handling documented.
- [ ] design.md feature-spec advisor checkpoint added.
- [ ] testing-anti-patterns.md exists.

**QA**: 
- `grep -nE '^## [A-Z][a-z]+ [A-Z]' agents/*.md` returns 0.
- `head -20 agents/{compound-documenter,frontend-implementer,advisor,context-analyzer}.md` shows the new sections.
- `ls skills/dev-agent-setup/references/testing-anti-patterns.md` exists.

**Coverage**: F-0040, F-0042, F-0043, F-0044, F-0045, F-0046, F-0047, F-0048, F-0220, F-0221, F-0222, F-0223, F-0224, F-0258.

---

## Phase 7 — AskUserQuestion spacers + command consistency

**Objective**: Add the 3-horizontal-rule padding spacer before EVERY AskUserQuestion call site in commands and skills. Fix the missing argument-hint frontmatter.

**Depends on**: Phase 6 (so command bodies are stabilized first).

**Files**:
- **Identify** all AskUserQuestion call sites: `grep -rln "AskUserQuestion" skills/ agents/ commands/`.
- **Modify** every site: ensure the message immediately preceding the AskUserQuestion call ends with the canonical spacer (3 lines of `───────────────────`). If absent, add it. CLAUDE.md scope-clause: only add if the message is paired with an actual `AskUserQuestion` tool invocation, NOT for plain-text questions.
- **Modify** `commands/design-engineer/mute-unmute-sound.md` and `commands/design-engineer/stop.md` frontmatter: add `argument-hint: ""` (or omit consistently — recommend explicit empty string for consistency with other commands).
- **Modify** `commands/design-engineer/dev.md` Step ~10: define one rule for meta-document invocation: "invoke meta-document at end of every phase". Remove other timing-ambiguous mentions.
- **Modify** `commands/design-engineer/review.md`: pick one canonical path style for reference materials. Recommend `${CLAUDE_PLUGIN_ROOT}/skills/...` for plugin assets; project-relative for design/.

**Reuse**:
- CLAUDE.md spacer rule (line ~399).
- Existing AskUserQuestion patterns.

**Checklist**:
- [ ] Every AskUserQuestion site in commands/ has the spacer above it.
- [ ] Every AskUserQuestion site in skills/ has the spacer (or is excluded per CLAUDE.md scope rule).
- [ ] Both commands have `argument-hint:` frontmatter.
- [ ] dev.md meta-document timing unified.
- [ ] review.md path style consistent.

**QA**: 
- `grep -rB6 'AskUserQuestion' commands/design-engineer/ | grep -B5 -A1 'AskUserQuestion'` — manually scan each site for the spacer.
- `grep -A4 '^---' commands/design-engineer/{mute-unmute-sound,stop}.md` — both have argument-hint.

**Coverage**: F-0046, F-0047, F-0126, F-0249, F-0250, F-0251, F-0252, F-0253, F-0254, F-0255, F-0256, F-0257.

---

## Phase 8 — Hook + script polish

**Objective**: Clean up Surface I + J findings (hook portability, script bash compat, dead code).

**Depends on**: Phase 1 (hooks.json already updated).

**Files**:
- **Modify** `skills/meta-setup/scripts/detect-state.sh`: add `set -euo pipefail` at top.
- **Decide** detect-state.sh fate (audit flagged as dead): since the user's directive is "fix everything", check one more time whether anything calls it. If truly dead (`grep -rn 'detect-state.sh' .`), delete it. If used by a hidden flow, wire it explicitly into a skill.
- **Modify** all script + hook permissions: `chmod +x hooks/*.sh skills/meta-setup/scripts/*.sh`.
- **Modify** `hooks/hooks.json`: bump statusLine handling? No — statusLine is not a hook event. Note F-0283 for v4.9.0+ backlog (symlink statusline.js so plugin updates propagate).

**Reuse**:
- Existing script structure.

**Checklist**:
- [ ] detect-state.sh has `set -euo pipefail`.
- [ ] detect-state.sh either deleted (preferred) or wired into a skill flow.
- [ ] All scripts/hooks executable (`ls -la` shows `x` bits).

**QA**: `head -3 skills/meta-setup/scripts/*.sh` shows shebangs + set directives. `ls -la skills/meta-setup/scripts/ hooks/` shows executable bits.

**Coverage**: F-0290, F-0293, F-0294.

---

## Phase 9 — Eval coverage gaps

**Objective**: Add at least one eval entry per uncovered skill (8 skills per F-0006).

**Depends on**: Phase 6 (skills stabilized first).

**Files**:
- **Modify** `evals/evals.json`: add eval entries for:
  - `advisor` (test: when invoked at a checkpoint with a brief, returns a short enumerated plan)
  - `dev-component-gallery` (test: scaffolds gallery on a Next.js project; queries context7; produces single-page output)
  - `meta-setup-configure` (test: flag-based config writes)
  - `meta-setup-existing` (test: existing-project routing)
  - `meta-setup-welcome` (test: welcome-flow routing)
  - `shared-references` (test: reference resolution for anti-slop / anti-patterns)
  - `ui-images` (test: per-image generate vs stock decision)
  - `ui-landing-page` (test: landing page generation following style rules)

Each eval should be the smallest end-to-end verification: a prompt + expected_output_pattern. Stubs are fine — purpose is to flag regressions, not exhaustive testing.

**Reuse**:
- Existing eval format in `evals/evals.json` (functional type, prompt + expected_output schema).

**Checklist**:
- [ ] 8 new eval entries added.
- [ ] `python3 -m json.tool evals/evals.json` valid.
- [ ] `python3 -c "import json; d=json.load(open('evals/evals.json'))['evals']; covered={e.get('skill') for e in d if e.get('skill')}; ..."` shows 0 uncovered skills.

**QA**: Manual: re-run the F-0006 repro command from the ledger; uncovered list returns empty.

**Coverage**: F-0006.

---

## Phase 10 — Surface D + C content polish

**Objective**: Address the medium/low Surface C + D findings: long-skill structure, ui-* compatibility format consistency, WCAG update, missing templates, double-coverage clarification, orchestration docs.

**Depends on**: Phase 6 (skills stabilized first).

**Files**:
- **Modify** `skills/ui-accessibility/SKILL.md`: replace WCAG 2.1 references with WCAG 2.2 (per F-0147; standard updated in 2023).
- **Modify** `skills/ui-images/SKILL.md` frontmatter: keep the structured `compatibility:` (it's deliberately rich); add a note in CLAUDE.md `compatibility:` extension section that this richer shape is also acceptable.
- **Modify** long skills (>300 lines per F-0127, F-0143, F-0148, F-0187): move detailed content from main SKILL.md to `references/` subdirectories to keep main bodies under 500 lines per CLAUDE.md guidance:
  - `skills/dev-prototyping/SKILL.md` (442 lines) → split detailed step content into `references/prototyping-stages.md`.
  - `skills/ui-references-moodboard/SKILL.md` (319 lines) → split into `references/moodboard-stages.md`.
  - `skills/ux-behavior-mapping/SKILL.md` (~330 lines) → split detailed framework content into `references/behavior-frameworks.md`.
  - `skills/ux-journey-mapping/SKILL.md` (~340 lines) → split detailed framework into `references/journey-frameworks.md`.
  - `skills/ux-motivation-audit/SKILL.md` (~315 lines) → split into `references/motivation-frameworks.md`.
  - `skills/ux-full-review/SKILL.md` (~350 lines) → split mode-specific content into `references/review-modes.md`.
- **Modify** `skills/ux-full-review/SKILL.md` and `skills/psych-full-scan/SKILL.md`: add explicit "Mode" / orchestration-subset documentation per F-0153, F-0154, F-0190, F-0191.
- **Create** missing template stubs (per F-0150, F-0151):
  - `skills/ux-assumptions/references/assumptions-template.md` (table format).
  - `skills/ux-business-plan/references/business-model-canvas-example.md` (filled example).
  - `skills/ux-mvp-requirements/references/mvp-criteria-checklist.md` (checklist).
  - For each of 14 psych-* skills, add `references/case-studies.md` STUB with placeholder structure (not fabricated content; user fills in real cases over time).
- **Modify** `skills/dev-mcp-setup/references/`: this directory was empty per F-0125. Add `essential-mcps.md` with bundled+recommended MCPs cross-referenced.

**Reuse**:
- Existing references/ pattern across skills.

**Checklist**:
- [ ] WCAG 2.1 → 2.2 across ui-accessibility.
- [ ] 6 long skills' content moved to references/ (each main body <500 lines).
- [ ] ux-full-review and psych-full-scan have orchestration sections.
- [ ] 3 template stubs + 14 case-study stubs created.
- [ ] dev-mcp-setup/references/essential-mcps.md created.

**QA**: 
- `grep -rn 'WCAG 2.1' skills/ui-accessibility/` returns 0.
- `wc -l skills/dev-prototyping/SKILL.md skills/ui-references-moodboard/SKILL.md skills/ux-*/SKILL.md` — all <500 lines.
- `ls skills/dev-mcp-setup/references/` non-empty.

**Coverage**: F-0125, F-0127, F-0142, F-0143, F-0144, F-0145, F-0146, F-0147, F-0148, F-0150, F-0151, F-0152, F-0153, F-0154, F-0187, F-0188, F-0189, F-0190, F-0191.

---

## Phase 11 — Surface A + B medium polish

**Objective**: Surface A (meta-*) and Surface B (dev-*) medium-severity findings not yet covered.

**Depends on**: Phase 6.

**Files**:
- **Modify** `skills/meta-orchestrator/SKILL.md`, `skills/meta-orchestrator/SKILL.md`: any remaining issues flagged in Surface A report.
- **Modify** Surface B medium findings (F-0128, F-0129, F-0130, F-0131, F-0132, F-0133, F-0134, F-0135 — most are "no issues found" passes per Surface B report; verify and skip if truly no action needed).
- **Modify** Surface C medium findings (F-0140, F-0141, F-0156–F-0186 are em dashes — covered by Phase 2; F-0149 if relevant).
- **Modify** Surface E (psych-*) — the audit found psych-* skills are in excellent shape; only need verification that case-study stubs from Phase 10 are well-organized.

**Reuse**:
- Existing skill structures.

**Checklist**:
- [ ] Surface A report's findings (other than Phase 1 BLOCKERs) addressed.
- [ ] Surface B passes verified.
- [ ] Surface E passes verified.

**QA**: Re-read each surface report and confirm no open findings beyond what Phase 1-10 cover.

**Coverage**: F-0100–F-0119 (Surface A), F-0128, F-0129, F-0130, F-0131, F-0132, F-0133, F-0134, F-0135, F-0137, F-0138, F-0139, F-0140, F-0141, F-0149.

---

## Phase 12 — Version bump + CHANGELOG + README banner + commit + push

**Objective**: Land v4.8.0.

**Depends on**: All previous phases approved.

**Files**:
- **Modify** `.claude-plugin/plugin.json` version: 4.7.0 → 4.8.0.
- **Modify** `.claude-plugin/marketplace.json` version: 4.7.0 → 4.8.0.
- **Modify** `README.md` banner: 4.7.0 → 4.8.0.
- **Modify** `CHANGELOG.md`: add `[4.8.0] – <date>` entry. Body: "Audit-driven full remediation of 108 findings from 2026-04-26 audit. 2 BLOCKERs fixed (sound notifications, folder-convention detection). Em-dash sweep (~335 lines). Skip-check normalization across 7 ux-* skills. Figma-MCP routing clarified. AskUserQuestion spacer audit. Frontmatter compliance + count drift fixes. Cite reused infrastructure: existing flag-file mute mechanism, existing init-project-structure.sh layout, existing figma-mcp-routing.md. Audit cited at audit/2026-04-26-comprehensive/."
- **Run** `python3 -m json.tool .claude-plugin/plugin.json .claude-plugin/marketplace.json evals/evals.json` to validate JSON.
- **Run** sweep verification commands (see Verification section).
- **Commit** via dev-github-workflow Mode 1 (plan-driven; commit footer included). Commit message format:
  ```
  v4.8.0: audit-driven remediation of 108 findings — 2 BLOCKERs + em-dash sweep + skip-check normalization
  
  Comprehensive remediation pass against the 2026-04-26 audit. Addresses
  every finding in audit/2026-04-26-comprehensive/99-ledger.json.
  
  BLOCKERs fixed:
  - Sound notifications now fire correctly (registered in plugin's
    hooks/hooks.json with ${CLAUDE_PLUGIN_ROOT} that resolves; install
    question maps to the ~/.claude/de-sound-muted flag instead of writing
    to settings.json where the variable never resolved).
  - Fresh-project deliverable detection now works (detect-environment.sh
    + de-design-grounding-hook.js aligned on `design/` convention; init
    script already used `design/`, only the checks were stale).
  
  Quality sweep:
  - ~335 em dashes replaced with en dashes (CLAUDE.md rule #1).
  - 7 ux-* canonical-deliverable skills now share an identical
    skip-check preamble (the v4.7.0 skip-check pattern had drifted).
  - Figma MCP routing clarified: bundled Figma plugin is the default;
    figma-console MCP install pointer surfaced in advanced workflows.
  - AskUserQuestion spacer compliance audited across commands.
  - Agent headings normalized to sentence case.
  - 8 skills got eval coverage stubs.
  - 6 long skills' content split into references/.
  - WCAG 2.1 → 2.2 in ui-accessibility.
  
  Doc fixes:
  - README "51 skills" → "57 skills"; CLAUDE.md "9 agents/54 skills" 
    → "10 agents/57 skills".
  - advisor.md and dev-component-gallery.md frontmatter complete.
  - meta-setup/SKILL.md folder doc matches actual scaffolded structure.
  - Compatibility frontmatter documented as deliberate plugin extension.
  
  Audit method: 6-phase plan (baseline → matrices → 10 surfaces → docs
  cross-check → fixture-traced behavioral → process & coverage → synthesis).
  Sub-agent waves; canonical Anthropic docs fetched and persisted.
  
  Built with design-engineer – https://github.com/volomydyr/design-engineer-plugin
  ```
- **Push** to main only after explicit user authorization.
- **Archive** this plan: `mv plans/<this plan>.md plans/archive/`.

**Reuse**:
- dev-github-workflow Mode 1 commit pattern.
- Keep-a-Changelog format from prior CHANGELOG entries.

**Checklist**:
- [ ] plugin.json + marketplace.json bumped.
- [ ] README banner bumped.
- [ ] CHANGELOG entry written.
- [ ] All JSON files valid.
- [ ] Verification gate (below) passes.
- [ ] Commit landed.
- [ ] Pushed to main with explicit user authorization.
- [ ] This plan archived.

**QA**: `grep -nE '4\.8\.0' .claude-plugin/plugin.json .claude-plugin/marketplace.json README.md CHANGELOG.md` — version present in all four. `git log -1 --pretty=%B` shows the commit message.

**Coverage**: F-0007 (already done in Phase 1, restated here for completeness).

---

## Risk assessment

- **Risk**: em-dash sweep (Phase 2) corrupts a code block where `—` was a literal. **Mitigation**: post-sweep grep + spot-check 5 high-traffic files; reviewer scans the diff.
- **Risk**: F-0010 fix breaks for users who already have sound entries in their `~/.claude/settings.json` from prior installs. **Mitigation**: meta-setup install rewrite uses a 3-option question that detects prior install in settings.json; on "Reinstall" or "Uninstall" we ALSO clean the legacy settings.json entries (since they don't work anyway). Document this in CHANGELOG.
- **Risk**: Phase 4 skip-check rewrite changes which projects skip vs proceed. **Mitigation**: the new template adds `shipped_ui` as a softer signal but still asks the user via AskUserQuestion before yielding; users can always force a re-run.
- **Risk**: Phase 5 figma-console install pointer link breaks if the upstream repo URL changes. **Mitigation**: route through README's "Required additional MCPs" section (single canonical URL); update once if needed.
- **Risk**: Phase 10 long-skill split changes loaded-content shape. **Mitigation**: main SKILL.md retains the workflow; references/ holds detailed content. Skill-content lifecycle (per Anthropic docs) loads only SKILL.md initially, references on demand. No behavior change.
- **Risk**: Phase 9 evals are stubs that don't run reliably. **Mitigation**: evals are coverage stubs, not exhaustive — purpose is regression flag. Real eval execution is a separate v4.9.0 effort.
- **Risk**: 11 phases is a long review burden for the user. **Mitigation**: phases are independent (Phase 2 sweep can land before Phase 3 docs; Phase 5 figma is independent of skip-check). User can approve in batches if preferred.
- **Risk**: behavioral verification of fixes is deferred. **Mitigation**: each phase has explicit QA steps; Phase 12 verification gate runs the ledger's repro commands and confirms each finding is addressed.

## Verification

Final gate before commit (Phase 12):

1. **Ledger coverage table** (below): every F-XXXX in `99-ledger.json` is in some phase's "Coverage" line OR in the "Deferred to v4.9.0+" list.
2. **BLOCKER repros fail** (i.e., the bug is gone):
   - F-0291 repro: scaffold a fresh project; `detect-environment.sh` reports `Deliverables: yes`.
   - F-0010 repro: fresh install with sound = Yes; trigger Stop event; sound plays.
3. **Em-dash sweep verification**: `grep -rc '—' skills agents commands hooks README.md CLAUDE.md` returns 0.
4. **Frontmatter sweep verification**: `grep -L 'disable-model-invocation' skills/*/SKILL.md` returns only `skills/shared-references/` (which has no SKILL.md).
5. **Skip-check uniformity**: side-by-side diff of the 7 preambles shows identical structure (only `<KEY>` and `<X>` differ).
6. **Count consistency**: README.md, CLAUDE.md, plugin.json, marketplace.json, CHANGELOG.md latest entry all reference v4.8.0; README shows 57/10/9 (skills/agents/commands).
7. **Eval coverage**: F-0006 repro returns empty list.
8. **Manual smoke (deferred to user)**: install plugin in a fresh project; run `/design-engineer:start`; observe new sound install flow; observe `design/` scaffolding; run `/design-engineer:design` on a heavy project; observe skip-check fires on ux-storybrand.

## Ledger coverage table

Every F-XXXX in `99-ledger.json` mapped to its phase. Phase 12 verifies completeness.

| Finding ID | Severity | Phase |
|---|---|---|
| F-0001 | HIGH | 3 |
| F-0002 | HIGH | 3 |
| F-0003 | HIGH | 3 |
| F-0004 | MEDIUM | 3 |
| F-0005 | HIGH | 4 |
| F-0006 | MEDIUM | 9 |
| F-0007 | LOW | 1 |
| F-0008 | MEDIUM | 1 |
| F-0009 | LOW | 2 |
| F-0010 | BLOCKER | 1 |
| F-0011 | MEDIUM | 4 |
| F-0012 | HIGH | 3 (advisor effort field) |
| F-0013 | MEDIUM | 3 (covered by F-0004) |
| F-0014 | LOW | 3 |
| F-0015 | MEDIUM | 4 |
| F-0040 | HIGH | 6 |
| F-0041 | MEDIUM | 1 |
| F-0042 | MEDIUM | 6 |
| F-0043 | MEDIUM | 6 |
| F-0044 | HIGH | 6 |
| F-0045 | MEDIUM | 6 |
| F-0046 | LOW | 7 |
| F-0047 | LOW | 7 |
| F-0048 | LOW | 6 |
| F-0080 | HIGH | 5 |
| F-0081 | MEDIUM | 1 |
| F-0082 | LOW | DEFERRED v4.9.0 (playwright MCP usage decision) |
| F-0100–F-0119 | various | 11 (Surface A) |
| F-0120 | HIGH | 3 |
| F-0121–F-0124 | HIGH | 2 (em dashes) |
| F-0125 | HIGH | 10 |
| F-0126 | HIGH | 7 (spacers) |
| F-0127 | MEDIUM | 10 |
| F-0128–F-0135 | various | 11 (Surface B passes mostly; verify) |
| F-0136 | HIGH | 2 |
| F-0137–F-0139 | various | 11 |
| F-0140–F-0146 | various | 10 |
| F-0147 | LOW | 10 (WCAG) |
| F-0148, F-0149 | various | 10 |
| F-0150–F-0154 | MEDIUM | 10 |
| F-0156–F-0186 | HIGH | 2 (em dashes) |
| F-0187–F-0191 | various | 10 |
| F-0220 | MEDIUM | 6 |
| F-0221 | HIGH | 6 |
| F-0222–F-0224 | various | 6 |
| F-0240–F-0248 | HIGH | 2 (em dashes) |
| F-0249–F-0250 | MEDIUM | 7 (argument-hint) |
| F-0251–F-0257 | HIGH/MEDIUM | 7 (spacers) |
| F-0258 | MEDIUM | 6 (advisor in feature-spec) |
| F-0260–F-0282 | mostly pass | 11 (verify) |
| F-0283 | HIGH | DEFERRED v4.9.0 (statusline symlink design) |
| F-0285–F-0289 | mostly pass | 11 (verify) |
| F-0290 | MEDIUM | 8 |
| F-0291 | BLOCKER | 1 |
| F-0292 | HIGH | 1 |
| F-0293 | LOW | 8 |
| F-0294 | LOW | 8 |

**Deferred to v4.9.0+** (with reason):
- **F-0082** (playwright MCP unused): decision requires UX research on whether playwright MCP would meaningfully improve dev-prototyping vs current Bash invocation. Not urgent.
- **F-0283** (statusline symlink): structural rework of how the plugin's statusline is installed. Touches user environment. Deserves its own plan + behavioral verification.

## Critical files / paths

- **BLOCKER fix scope**: `hooks/hooks.json`, `skills/meta-setup/SKILL.md`, `skills/meta-setup/scripts/detect-environment.sh`, `hooks/de-design-grounding-hook.js`, `commands/design-engineer/mute-unmute-sound.md`.
- **Em-dash sweep scope**: `skills/`, `agents/`, `commands/`, `hooks/`, `README.md`, `CLAUDE.md`.
- **Skip-check rewrite scope**: 7 ux-* SKILL.md files (storybrand, business-plan, problem-statement, target-audience, assumptions, competitor-analysis, story-panels).
- **Figma scope**: `skills/ui-figma-guide/SKILL.md`, `skills/ui-figma-handoff/SKILL.md`, `skills/dev-mcp-setup/SKILL.md`, `README.md`.
- **Manifest**: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `CHANGELOG.md`, `README.md`.
- **Audit reference (read-only)**: `audit/2026-04-26-comprehensive/99-ledger.json`, `audit/2026-04-26-comprehensive/LEDGER.md`.

## Questions for user

None blocking — directional decisions captured during scoping (sound flag-file mechanism, figma optional-install, em-dash plugin-source-only, single v4.8.0). Ready to implement upon plan approval. If you want me to split into multiple sub-plans (e.g., land Phase 1 alone first, then the rest), say so — I'd recommend single batch since phases are mostly independent and the CHANGELOG narrative is cleaner.
