# LEDGER — Comprehensive plugin audit (2026-04-26)

**Status**: All 6 phases complete. **108 findings** (2 BLOCKER, 55 HIGH, 38 MEDIUM, 13 LOW).

**How to read**: BLOCKERs first; then top-20 HIGH; then full table by severity; then patterns / what's right / what I did NOT audit. Each finding cross-references `99-ledger.json` (sorted by severity).

---

## BLOCKERs (2)

These prevent the plugin from functioning correctly. Fix before anything else.

| ID | File | Title | Why it matters |
|---|---|---|---|
| **F-0010** | `skills/meta-setup/SKILL.md + hooks/hooks.json` | skills/meta-setup/SKILL | Sound notifications are 100% broken for everyone who installed v4.1.0+. The same install path may also affect future hook additions written to settings.json. The mute toggle (`/design-engineer:mute-unmute-sound`) is irrelevant when sounds never play in the first place. |
| **F-0291** | `skills/meta-setup/scripts/detect-environment.sh + skills/meta-setup/scripts/init-project-structure.sh` | detect-environment | This is a live BLOCKER bug — the script lies about every freshly-set-up project. Status line and config likely show wrong values. F-0008 was MEDIUM but should be re-graded BLOCKER given this revealed dependency. |

**Fix order**: F-0291 first (touches the entire plugin's deliverable detection — every fresh project is mis-detected today). F-0010 second (visible to users; longer-tail fix involving install path).

---

## Top 20 HIGH (55 total HIGH; showing the 20 with broadest reach)

| ID | Category | File | Direction (one-line fix) |
|---|---|---|---|
| F-0001 | documentation | `README.md` | Update line 67 prose to '57 skills' to match the other three references. |
| F-0002 | documentation | `CLAUDE.md` | Update CLAUDE.md to '10 specialized agents' and '57 skills (56 with SKILL.md)' or whichever matches the canonical count. |
| F-0003 | consistency | `agents/advisor.md` | Add `disable-model-invocation: true` to advisor.md frontmatter (or confirm intentional default by adding a comment). |
| F-0005 | consistency | `skills/ux-*/SKILL.md` | Define a canonical preamble template with two-key reading (`existing_X` AND `shipped_ui` softer signal); apply identically to all 7 skills;  |
| F-0012 | consistency | `skills/advisor/SKILL.md` | Add disable-model-invocation: true and effort: high to skills/advisor/SKILL.md frontmatter. |
| F-0040 | correctness | `agents/frontend-implementer.md` | Verify each pre-flight Read fires deterministically; if not, add explicit blocking via PreToolUse hook keyed on the agent's first Write atte |
| F-0044 | correctness | `commands/design-engineer/dev.md + hooks/de-design-grounding-hook.js` | Document expected behavior on each missing-file case in dev.md; add hook output messages that explicitly say which file is missing and why t |
| F-0080 | correctness | `skills/ui-figma-guide/* + skills/ui-figma-handoff/*` | Decide one: (a) Document hard dependency on figma-console MCP in README + plugin manifest, OR (b) Rewrite skills to use only the bundled fig |
| F-0120 | consistency | `skills/dev-component-gallery/SKILL.md` | Add disable-model-invocation: true to frontmatter. |
| F-0121 | compliance | `skills/dev-component-gallery/SKILL.md` | Replace all — with – (en dash) throughout the file. |
| F-0122 | compliance | `skills/dev-claude-md/SKILL.md` | Replace all — with – (en dash) in the file. |
| F-0123 | compliance | `skills/dev-github-workflow/SKILL.md` | Replace all — with – (en dash) throughout the file. |
| F-0124 | compliance | `skills/dev-prototyping/SKILL.md` | Replace all — with – (en dash) throughout the file. |
| F-0125 | correctness | `skills/dev-mcp-setup/references/` | Either remove the empty references/ directory or populate it with essential-mcp-matrix.md or similar. |
| F-0126 | consistency | `skills/dev-agent-setup/SKILL.md` | Add padding spacer block (3 horizontal rule lines) before each AskUserQuestion invocation. |
| F-0136 | compliance | `skills/ui-images/SKILL.md` | Replace all — with – (en dash) throughout the file. |
| F-0156 | compliance | `skills/ux-assumptions/SKILL.md` | Replace all — with – (en dash) in the file |
| F-0157 | compliance | `skills/ux-behavior-mapping/SKILL.md` | Replace all — with – (en dash) in the file |
| F-0158 | compliance | `skills/ux-bias-audit/SKILL.md` | Replace all — with – (en dash) in the file |
| F-0159 | compliance | `skills/ux-business-plan/SKILL.md` | Replace all — with – (en dash) in the file |

---

## All 108 findings — full table

Sorted by severity, then ID. See `99-ledger.json` for full evidence + repro per finding.

| ID | Severity | Category | File | Title (excerpt) |
|---|---|---|---|---|
| F-0010 | BLOCKER | correctness | `skills/meta-setup/SKILL.md + hooks/hooks.json` | skills/meta-setup/SKILL.md:311,323 instructs the install agent to write Stop/Notification hook entri |
| F-0291 | BLOCKER | correctness | `skills/meta-setup/scripts/detect-environment.sh + skills/met` | detect-environment.sh:102 checks `if [ -d 'documents/design' ]`. init-project-structure.sh creates ` |
| F-0001 | HIGH | documentation | `README.md` | README.md says "51 skills" once and "57 skills" three times. Counts disagree internally. |
| F-0002 | HIGH | documentation | `CLAUDE.md` | Line 35: '9 specialized agents'; Line 38: '54 hidden skills'. Actual: 10 agents, 56 skills with SKIL |
| F-0003 | HIGH | consistency | `agents/advisor.md` | Frontmatter lacks `disable-model-invocation:`. Default per Anthropic docs is `false`, meaning Claude |
| F-0005 | HIGH | consistency | `skills/ux-*/SKILL.md` | Skip-check preamble drift across 7 ux-* canonical-deliverable skills (storybrand, business-plan, pro |
| F-0012 | HIGH | consistency | `skills/advisor/SKILL.md` | Frontmatter lacks both disable-model-invocation and effort. advisor is explicitly a manual checkpoin |
| F-0040 | HIGH | correctness | `agents/frontend-implementer.md` | Agent has multiple required Read steps before any implementation can proceed (gallery, prototype, de |
| F-0044 | HIGH | correctness | `commands/design-engineer/dev.md + hooks/de-design-grounding-` | dev.md Step 'design grounding pre-flight' requires 3 reference files (CLAUDE.md, prototype, design r |
| F-0080 | HIGH | correctness | `skills/ui-figma-guide/* + skills/ui-figma-handoff/*` | Skills reference 25 unique bare figma_* tool names that come from the third-party figma-console MCP  |
| F-0120 | HIGH | consistency | `skills/dev-component-gallery/SKILL.md` | Frontmatter (lines 1–7) has model, effort, license but lacks disable-model-invocation field. Default |
| F-0121 | HIGH | compliance | `skills/dev-component-gallery/SKILL.md` | 33 em dashes (—) found in description and body text. Violates CLAUDE.md Rule #1 (en dashes only). |
| F-0122 | HIGH | compliance | `skills/dev-claude-md/SKILL.md` | 4 em dashes (—) in procedural sections. Violates CLAUDE.md Rule #1. |
| F-0123 | HIGH | compliance | `skills/dev-github-workflow/SKILL.md` | 8 em dashes (—) throughout the file. Violates CLAUDE.md Rule #1. |
| F-0124 | HIGH | compliance | `skills/dev-prototyping/SKILL.md` | 8 em dashes (—) in design intent and test guidance sections. Violates CLAUDE.md Rule #1. |
| F-0125 | HIGH | correctness | `skills/dev-mcp-setup/references/` | Directory exists but contains 0 files (empty directory). Skill teaches MCP setup but has no referenc |
| F-0126 | HIGH | consistency | `skills/dev-agent-setup/SKILL.md` | AskUserQuestion blocks lack required padding spacer (3 lines of ───────) per CLAUDE.md output rules. |
| F-0136 | HIGH | compliance | `skills/ui-images/SKILL.md` | 11 em dashes (—) found throughout the file. |
| F-0156 | HIGH | compliance | `skills/ux-assumptions/SKILL.md` | 2 em dashes in text |
| F-0157 | HIGH | compliance | `skills/ux-behavior-mapping/SKILL.md` | 3 em dashes in text |
| F-0158 | HIGH | compliance | `skills/ux-bias-audit/SKILL.md` | 1 em dash in text |
| F-0159 | HIGH | compliance | `skills/ux-business-plan/SKILL.md` | 2 em dashes in text |
| F-0160 | HIGH | compliance | `skills/ux-communicating-decisions/SKILL.md` | 1 em dash in text |
| F-0161 | HIGH | compliance | `skills/ux-competitor-analysis/SKILL.md` | 2 em dashes in text |
| F-0162 | HIGH | compliance | `skills/ux-ethics-review/SKILL.md` | 1 em dash in text |
| F-0163 | HIGH | compliance | `skills/ux-full-review/SKILL.md` | 1 em dash in text |
| F-0164 | HIGH | compliance | `skills/ux-information-architecture/SKILL.md` | 2 em dashes in text |
| F-0165 | HIGH | compliance | `skills/ux-journey-mapping/SKILL.md` | 1 em dash in text |
| F-0166 | HIGH | compliance | `skills/ux-motivation-audit/SKILL.md` | 1 em dash in text |
| F-0167 | HIGH | compliance | `skills/ux-mvp-requirements/SKILL.md` | 2 em dashes in text |
| F-0168 | HIGH | compliance | `skills/ux-problem-statement/SKILL.md` | 3 em dashes in text |
| F-0169 | HIGH | compliance | `skills/ux-story-panels/SKILL.md` | 3 em dashes in text |
| F-0170 | HIGH | compliance | `skills/ux-storybrand/SKILL.md` | 2 em dashes in text |
| F-0171 | HIGH | compliance | `skills/ux-target-audience/SKILL.md` | 2 em dashes in text |
| F-0172 | HIGH | compliance | `skills/ux-user-interviews/SKILL.md` | 3 em dashes in text |
| F-0173 | HIGH | compliance | `skills/psych-cognitive-biases/SKILL.md` | 1 em dash in text |
| F-0174 | HIGH | compliance | `skills/psych-cognitive-load/SKILL.md` | 1 em dash in text |
| F-0175 | HIGH | compliance | `skills/psych-decision-fundamentals/SKILL.md` | 1 em dash in text |
| F-0176 | HIGH | compliance | `skills/psych-decision-persuasion/SKILL.md` | 1 em dash in text |
| F-0177 | HIGH | compliance | `skills/psych-delight-design/SKILL.md` | 1 em dash in text |
| F-0178 | HIGH | compliance | `skills/psych-emotional-retention/SKILL.md` | 1 em dash in text |
| F-0179 | HIGH | compliance | `skills/psych-engagement-patterns/SKILL.md` | 1 em dash in text |
| F-0180 | HIGH | compliance | `skills/psych-full-scan/SKILL.md` | 1 em dash in text |
| F-0181 | HIGH | compliance | `skills/psych-habit-formation/SKILL.md` | 1 em dash in text |
| F-0182 | HIGH | compliance | `skills/psych-pricing-psychology/SKILL.md` | 1 em dash in text |
| F-0183 | HIGH | compliance | `skills/psych-simplification/SKILL.md` | 1 em dash in text |
| F-0184 | HIGH | compliance | `skills/psych-social-influence/SKILL.md` | 1 em dash in text |
| F-0185 | HIGH | compliance | `skills/psych-time-perception/SKILL.md` | 1 em dash in text |
| F-0186 | HIGH | compliance | `skills/psych-visual-perception/SKILL.md` | 1 em dash in text |
| F-0221 | HIGH | documentation | `agents/compound-documenter.md` | Defensive Read pattern (test -f before Read on memory files) documented in CLAUDE.md but not in comp |
| F-0240 | HIGH | consistency | `commands/design-engineer/design.md` | 9 em dashes in design.md (CLAUDE.md rule #1 forbids). |
| F-0241 | HIGH | consistency | `commands/design-engineer/dev.md` | 6 em dashes in dev.md. |
| F-0246 | HIGH | consistency | `commands/design-engineer/review.md` | 9 em dashes in review.md. |
| F-0247 | HIGH | consistency | `commands/design-engineer/start.md` | 3 em dashes in start.md. |
| F-0251 | HIGH | consistency | `commands/design-engineer/*.md` | Multiple AskUserQuestion call sites across design.md, dev.md, review.md lack the 3-horizontal-rule p |
| F-0283 | HIGH | correctness | `skills/meta-setup/SKILL.md (install) + hooks/de-statusline.j` | de-statusline.js is installed by copying to ~/.claude/hooks/ and registering in ~/.claude/settings.j |
| F-0292 | HIGH | documentation | `skills/meta-setup/SKILL.md` | SKILL.md:144 documents the scaffolded folder structure as `design/design/...` (double-nested). init- |
| F-0004 | MEDIUM | consistency | `skills/dev-component-gallery/SKILL.md` | Frontmatter has model/effort/license but lacks `disable-model-invocation:`. Skill is intended as tra |
| F-0006 | MEDIUM | coverage | `evals/evals.json` | 8 skills have zero eval entries: advisor, dev-component-gallery, meta-setup-configure, meta-setup-ex |
| F-0008 | MEDIUM | consistency | `skills/meta-setup/scripts/detect-environment.sh + hooks/de-d` | Active code references `documents/design/` (legacy folder convention) while everything else uses `de |
| F-0011 | MEDIUM | consistency | `skills/ux-{problem-statement,story-panels,business-plan,targ` | ux-problem-statement, ux-story-panels, and ux-business-plan reference TWO keys in skip-check preambl |
| F-0013 | MEDIUM | consistency | `skills/dev-component-gallery/SKILL.md` | Frontmatter has model:claude-opus-4-7 and effort:high but lacks disable-model-invocation. This skill |
| F-0015 | MEDIUM | coverage | `skills/ux-*/SKILL.md (all 7 canonical-deliverable skills)` | All 9 project.context keys written by hooks/de-start-state.sh are read by at least one skill; no orp |
| F-0041 | MEDIUM | maintainability | `hooks/de-design-grounding-hook.js` | Hook hardcodes 'documents/design/prototype/prototype.html' as the required Read path. Tightly couple |
| F-0042 | MEDIUM | consistency | `agents/frontend-implementer.md` | Pre-flight expects to read prototype.html as baseline; behavior when prototype doesn't exist (e.g.,  |
| F-0043 | MEDIUM | consistency | `commands/design-engineer/design.md` | Feature-spec branch produces a minimal spec but does not invoke advisor checkpoint (advisor is invok |
| F-0045 | MEDIUM | correctness | `agents/test-writer.md + skills/dev-agent-setup/references/te` | test-writer agent references skills/dev-agent-setup/references/testing-anti-patterns.md (also refere |
| F-0081 | MEDIUM | correctness | `hooks/hooks.json` | PreToolUse matcher: get_screenshot figma_capture_screenshot figma_take_screenshot. Two of the three  |
| F-0127 | MEDIUM | structure | `skills/dev-prototyping/SKILL.md` | File is 442 lines. Exceeds ~350-line guideline for main skill file (detailed content should live in  |
| F-0128 | MEDIUM | coverage | `skills/dev-github-workflow/SKILL.md` | Section teaches branch creation and PR flow but does not document branch naming convention (feat/*,  |
| F-0129 | MEDIUM | coverage | `skills/dev-agent-setup/SKILL.md` | Section teaches iterative refinement (scale down from 12 to 4 agents) but doesn't show what mistakes |
| F-0130 | MEDIUM | coverage | `skills/dev-component-gallery/SKILL.md` | Skill claims to adapt via context7 MCP ('never carries a hardcoded stack table') but provides no exa |
| F-0131 | MEDIUM | coverage | `skills/dev-starter-prompts/SKILL.md` | Skill generates kick-start prompts but doesn't teach voice/tone consistency. Generated prompts shoul |
| F-0132 | MEDIUM | coverage | `skills/dev-status-tracking/SKILL.md` | Skill teaches compaction pattern but doesn't specify when to trigger it (e.g., 'when <150K tokens re |
| F-0133 | MEDIUM | coverage | `skills/dev-mcp-setup/SKILL.md` | Skill says 'start with essentials' but doesn't define what 'essential' means upfront. Essentials are |
| F-0134 | MEDIUM | clarity | `skills/dev-github-workflow/SKILL.md` | Section says Mode 1 footer appears 'only when actively driving' but doesn't define 'actively' (does  |
| F-0137 | MEDIUM | compliance | `skills/ui-accessibility/SKILL.md` | 1 em dash (—) in text. Violates CLAUDE.md Rule #1. |
| F-0138 | MEDIUM | compliance | `skills/ui-aesthetic-review/SKILL.md` | 1 em dash (—) in text. Violates CLAUDE.md Rule #1. |
| F-0139 | MEDIUM | compliance | `skills/ui-design-system/SKILL.md` | 1 em dash (—) in text. Violates CLAUDE.md Rule #1. |
| F-0140 | MEDIUM | compliance | `skills/ui-design-to-code-qa/SKILL.md` | 1 em dash (—) in text. Violates CLAUDE.md Rule #1. |
| F-0141 | MEDIUM | compliance | `skills/ui-landing-page/SKILL.md` | 1 em dash (—) in text. Violates CLAUDE.md Rule #1. |
| F-0142 | MEDIUM | compliance | `skills/ui-references-moodboard/SKILL.md` | 5 em dashes (—) found throughout the file. Violates CLAUDE.md Rule #1. |
| F-0143 | MEDIUM | structure | `skills/ui-references-moodboard/SKILL.md` | File is 319 lines. Exceeds ~300-line guideline for main skill file (detailed content should live in  |
| F-0144 | MEDIUM | clarity | `skills/ui-figma-guide/SKILL.md and skills/ui-figma-handoff/S` | Both skills serve Figma users but lack explicit decision criteria in user-facing text: when to use g |
| F-0145 | MEDIUM | coverage | `All ui-* skills (9 total)` | No existing_X or skip-check preamble patterns detected. Unlike meta-* skills, ui-* skills have no pr |
| F-0146 | MEDIUM | coverage | `skills/ui-design-to-code-qa/SKILL.md` | Skill claims to catch 'specific, predictable issues' (title case, spacing, hardcoded values, redunda |
| F-0187 | MEDIUM | structure | `skills/ux-behavior-mapping/SKILL.md, ux-full-review/SKILL.md` | 4 skills exceed 300 lines (315–350): ux-behavior-mapping (350), ux-full-review (350), ux-journey-map |
| F-0188 | MEDIUM | coverage | `skills/ux-assumptions/SKILL.md, ux-business-plan/SKILL.md, u` | 3 skills teach frameworks but don't provide templates: ux-assumptions (no assumptions template), ux- |
| F-0189 | MEDIUM | coverage | `All psych-* skills (14 total)` | No case study or real-world example reference files documenting the principle in action |
| F-0190 | MEDIUM | coverage | `skills/ux-full-review/SKILL.md` | Skill coordinates 20+ ux-* skills but doesn't document a master checklist or dependency matrix showi |
| F-0191 | MEDIUM | coverage | `skills/psych-full-scan/SKILL.md` | Coordinates all 14 psych-* skills but lacks guidance on running subsets for different project types |
| F-0220 | MEDIUM | consistency | `agents/*.md` | 9 of 10 agents use Title Case for major section headings (e.g., 'Pre-Flight Checks', 'Tool Usage').  |
| F-0222 | MEDIUM | discoverability | `agents/frontend-implementer.md` | Agent references project-local files (gallery, prototype, design refs) without distinguishing requir |
| F-0249 | MEDIUM | consistency | `commands/design-engineer/mute-unmute-sound.md + stop.md` | Both lack `argument-hint:` field. Other 7 commands have it (some empty string). |
| F-0290 | MEDIUM | consistency | `skills/meta-setup/scripts/detect-state.sh` | detect-state.sh missing `set -euo pipefail`. detect-environment.sh and init-project-structure.sh bot |
| F-0007 | LOW | process | `plans/2026-04-26-existing-project-support.md` | v4.7.0 plan still in plans/ root; CLAUDE.md plan workflow mandates archival to plans/archive/ on com |
| F-0009 | LOW | consistency | `commands/design-engineer/stop.md` | Description and body use em dashes (—) at lines 3, 22, 60. Plugin CLAUDE.md rule #1 explicitly forbi |
| F-0014 | LOW | documentation | `skills/ui-images/SKILL.md` | Frontmatter includes optional: [playwright-cli] nested under compatibility (lines 8–10). This is non |
| F-0046 | LOW | consistency | `commands/design-engineer/review.md` | Reference material paths use variable substitution inconsistently (some use ${CLAUDE_PLUGIN_ROOT}, s |
| F-0047 | LOW | consistency | `commands/design-engineer/dev.md` | meta-document skill auto-invocation timing in dev.md is unclear. |
| F-0048 | LOW | maintainability | `agents/compound-documenter.md` | Defensive Read pattern (test -f before Read) is documented in CLAUDE.md but not in the agent body. |
| F-0082 | LOW | coverage | `plugin.json + skills/dev-prototyping/SKILL.md` | Plugin bundles playwright MCP server but no skill or agent references mcp__plugin_design-engineer_pl |
| F-0135 | LOW | tone | `skills/dev-claude-md/SKILL.md` | Line 152: 'The generated CLAUDE.md MUST include...' uses imperative tone (MUST). Violates gentle adv |
| F-0147 | LOW | correctness | `skills/ui-accessibility/SKILL.md` | References WCAG 2.1 AA as the standard. WCAG 2.2 was released in 2023; 2.1 is now outdated (though s |
| F-0223 | LOW | discoverability | `agents/advisor.md` | Agent body launches into role description without 1-line preamble explaining 'when this agent is inv |
| F-0288 | LOW | coverage | `hooks/hooks.json` | Plugin uses 6 of 28 canonical hook events (UserPromptSubmit, PreToolUse, PostToolUse, PostCompact, S |
| F-0293 | LOW | maintainability | `skills/meta-setup/scripts/detect-state.sh` | detect-state.sh is documented in skills/meta-setup/SKILL.md but never invoked from any skill, agent, |
| F-0294 | LOW | correctness | `skills/meta-setup/scripts/*` | Some scripts in skills/meta-setup/scripts/ may lack the executable bit. |

---

## Patterns observed

### 1. Em-dash epidemic (~120 occurrences across all surfaces)

CLAUDE.md rule #1 forbids em dashes (`—`); 100% of psych-* skills, 8 of 9 commands, 4 of 8 dev-skills, 6 of 9 ui-skills, and 9 of 10 agent headings violate it. Plugin self-violates its own most strictly-enforced output rule.

**Direction**: Single-pass `find . -name '*.md' -exec sed -i '' 's/—/–/g' {} \;` (macOS) on plugin sources, then spot-check that no embedded code blocks contain intentional em-dashes. ~2 hours of work, single highest-ROI fix.

### 2. Folder-convention drift (`documents/design/` ↔ `design/`)

F-0008 + F-0291 + F-0292: detect-environment.sh checks `documents/design/`, init-project-structure.sh creates `design/`, de-design-grounding-hook.js requires `documents/design/prototype/prototype.html`, SKILL.md documents `design/design/`. Four files in the migration's seam, all out of sync. The plugin's most fundamental detection (does the project have deliverables?) returns wrong answer for every fresh setup.

**Direction**: pick `design/` as the canonical convention (it's what scaffolding creates), update the other 3 files in one commit. F-0291 is BLOCKER.

### 3. Hook registration via settings.json (F-0010 class)

F-0010 (sound) + F-0283 (statusline): the plugin instructs meta-setup to write hook entries into `~/.claude/settings.json` with `${CLAUDE_PLUGIN_ROOT}` substitution. Per Anthropic docs, that variable only resolves in plugin-bundled `hooks/hooks.json`. So sound is broken, and statusline runs as a snapshot copy that doesn't update when the plugin updates.

**Direction**: register sound hooks in `hooks/hooks.json` (Stop event for completion, Notification event for attention). For statusline, either add a hooks.json `statusLine` registration if the plugin spec supports it, or symlink the script so updates propagate.

### 4. Documentation/inventory drift

F-0001 (README skill count: 51 vs 57), F-0002 (CLAUDE.md: 9 agents/54 skills; actual 10/56-57). No single canonical inventory file the docs reference. Add `audit/INVENTORY.md` (or similar) and have README.md/CLAUDE.md cite it once instead of inlining counts.

### 5. Skip-check preamble drift across 7 ux-* skills (v4.7.0 seam)

F-0005, F-0011, F-0015: the 7 canonical-deliverable skills' skip-check preambles drifted during v4.7.0 sweep. Most use `existing_X` only; ux-business-plan adds a `shipped_ui` softer-signal clause; ux-problem-statement and ux-story-panels use both. Same input projects get inconsistent skip behavior across skills.

**Direction**: define a canonical preamble template (probably the two-key version), apply identically to all 7 skills.

### 6. Coverage gaps in evals (8 untested skills)

F-0006: advisor, dev-component-gallery, meta-setup-configure, meta-setup-existing, meta-setup-welcome, shared-references, ui-images, ui-landing-page have zero eval entries. All v4.5–4.7 additions or rarely-modified surfaces.

### 7. v4.5–4.7 seams concentrate the rot

Findings cluster around recent additions: advisor (F-0003, F-0012, F-0023, F-0223), dev-component-gallery (F-0004, F-0013, F-0120, F-0121), feature-spec branch (F-0043, F-0258), audit branch (F-0080, F-0081), project.context schema (F-0005, F-0011, F-0015). When shipping incrementally, the seams between rounds are the highest-debt zones.

---

## What's right (preserve when fixing)

- **Plugin manifest versions consistent**: plugin.json, marketplace.json, README banner, CHANGELOG header all at v4.7.0.
- **`hooks/hooks.json` exists at the canonical Anthropic path** required for `${CLAUDE_PLUGIN_ROOT}` resolution.
- **`skills/shared-references/` correctly contains no SKILL.md** (it's reference-only, explaining the 56-vs-57 count).
- **`agents/compound-documenter.md` HAS `model: sonnet`** (Ultraplan-corrected; my earlier exploration was wrong).
- **`disable-model-invocation: true` present on 95%+ of skills** (only advisor + dev-component-gallery missing it; F-0003, F-0004).
- **All hooks fail-open** (exit 0 on errors): plugin never crashes user workflow even if a hook script breaks. Solid defensive design.
- **The 87-pattern prompt-injection hook** is sophisticated and well-categorized.
- **MCP namespace usage in dev-component-gallery** uses correct `mcp__plugin_design-engineer_context7__*` form (F-0080 is about ui-figma-* skills, not gallery).
- **Conventional Commits + Mode 1/Mode 2 footer scope** is well-implemented per dev-github-workflow.
- **Plan Mode + plan archival workflow** is comprehensive (CLAUDE.md describes it well; F-0007 is one missed archival, not a systemic issue).
- **POSIX bash 3.2 portability**: scripts and hooks use only POSIX-safe constructs.
- **psych-* skills are uniformly well-structured** with consistent frontmatter and no double-coverage of the 100 principles.
- **Mute toggle (`~/.claude/de-sound-muted`)** is well-designed and works independently of the broken install path.
- **Advisor pattern integration** into Plan Mode + per-phase + dev-github-workflow Mode 1 is broadly correct (one gap: F-0043 feature-spec branch).
- **Evals infrastructure exists** (341 eval entries) — coverage gaps are 8 specific surfaces, not a systemic absence.

---

## What I did NOT audit (coverage gaps in this audit)

- **Live execution of evals** against an actual model. Audit is static/coverage only — actually running the 341 evals is a separate effort.
- **Windows or Linux behavior**. Sound shim and statusline are documented as cross-platform but not behaviorally verified.
- **MCP server response handling**. Audit treats MCP tool calls as static references; didn't verify the plugin handles MCP errors gracefully (server down, schema mismatch).
- **Plugin install flow against a real Claude Code instance**. Per plan, behavioral verification was deferred — fixture-based traces only.
- **Performance / timeout characteristics** of hook scripts. hooks.json declares timeouts but didn't profile actual runtime.
- **Git history before 2025-12** — limited to last 30 commits per plan.
- **Localization** — plugin is English-only; didn't audit for any leaked Ukrainian or other-language strings.
- **Accessibility of generated UI**. ui-accessibility skill exists but its outputs weren't audited against WCAG 2.2.
- **Eval entries that exist** — only checked which skills lack evals; didn't audit the quality of the evals that ARE present.
- **Sub-agent context-passing in practice** — flagged as MEDIUM concern but not behaviorally verified.

---

## Recommended remediation order

**Hotfix v4.7.1 (2-3 hours)**:
1. F-0291 (BLOCKER): align detect-environment.sh + de-design-grounding-hook.js + meta-setup SKILL.md doc on `design/` convention.
2. F-0010 (BLOCKER): move sound hook into plugin's hooks/hooks.json; remove the meta-setup install path.
3. F-0001, F-0002: fix README + CLAUDE.md count drift (5 minutes).
4. F-0003, F-0004: add `disable-model-invocation:` to advisor + dev-component-gallery.
5. F-0007: archive the v4.7.0 plan to `plans/archive/`.

**v4.8.0 (focused remediation, ~6-8 hours)**:
6. Em-dash sweep across all surfaces (~2 hours).
7. F-0005 + F-0011 + F-0015: normalize skip-check preambles across the 7 ux-* skills (~1 hour).
8. F-0080: decide and document the figma-console MCP dependency (~30 min decision + doc).
9. F-0240–F-0258: AskUserQuestion spacer audit across commands (~1 hour).
10. F-0220: agent heading sentence-case sweep (~30 min).
11. F-0006: add evals for the 8 uncovered skills (~2-3 hours).

**Backlog (v4.9.0+)**:
12. Behavioral verification on the 5 fixture repos.
13. Live MCP-server error-handling tests.
14. WCAG 2.2 update to ui-accessibility.
15. Notification-event-based attention sound (F-0288).

---

## Audit metadata

- **Date**: 2026-04-26
- **Plugin version audited**: v4.7.0
- **Phases run**: Phase 0 (baseline) → Phase 1 (matrices) → Phase 2 (10 surfaces) → Phase 3 (canonical-doc cross-check) → Phase 4 (fixture-traced behavioral) → Phase 5 (process & coverage) → Phase 6 (synthesis).
- **Sub-agents invoked**: ~10 parallel Explore + 3 Plan-mode Explore.
- **Canonical Anthropic docs fetched and persisted**: hooks-doc.md, agents-doc.md, plugins-reference-doc.md (in `canonical-docs/`).
- **Fixture repos created**: 5 (empty, greenfield, existing-heavy, ios, python) under `fixtures/`.
- **Source-of-truth artifacts**: `99-ledger.json` (machine-readable), `00-facts.md` (frozen baseline), `01-key-usage-matrix.md` (cross-references), `02-reference-graph.md` (dependency graph), `02b-mcp-tool-catalog.md` (MCP namespace catalog).
- **Per-surface reports**: `04-static-A-meta-skills.md`, `05-static-B-dev-skills.md`, `06-static-C-ui-skills.md`, `07-static-D-discovery-skills.md`, `04-static-G-agents.md`, `04-static-H-commands.md`, `04-static-J-scripts.md` (Surface I findings folded into ledger directly).
