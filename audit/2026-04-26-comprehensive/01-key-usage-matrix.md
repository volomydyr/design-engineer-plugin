# Phase 1: Key Usage Matrix

**Generated**: 2026-04-26  
**Scope**: Comprehensive scan of project.context.* keys, skill frontmatter schema compliance, and agent frontmatter schema compliance  
**Status**: Initial audit complete

---

## Section 1: project.context.* Keys – Write & Read Analysis

### Summary

The hook `hooks/de-start-state.sh` writes 9 project.context keys during onboarding (existing-project flow):
- `existing_assumptions_log`
- `existing_brand_docs`
- `existing_business_plan`
- `existing_competitor_analysis`
- `existing_personas`
- `existing_problem_statement`
- `existing_story_panels`
- `off_repo_references`
- `shipped_ui`

These keys are read by 7 ux-* skip-check skills + 2 input-augmentation skills + ux-mvp-requirements + ux-information-architecture + commands/design-engineer/review.md.

### Matrix: Key → Writers & Readers

| Key | Written By | Read By (Location:Line) | Usage Pattern |
|-----|------------|--------------------------|---|
| `existing_assumptions_log` | hooks/de-start-state.sh | skills/ux-assumptions/SKILL.md:14 | Skip-check: read to decide whether to regenerate |
| `existing_brand_docs` | hooks/de-start-state.sh | skills/ux-storybrand/SKILL.md:14 | Skip-check: read to decide whether to regenerate |
| `existing_business_plan` | hooks/de-start-state.sh | skills/ux-business-plan/SKILL.md:14 | Skip-check: read + softer signal via `shipped_ui` |
| `existing_competitor_analysis` | hooks/de-start-state.sh | skills/ux-competitor-analysis/SKILL.md:14 | Skip-check: read to decide whether to regenerate |
| `existing_personas` | hooks/de-start-state.sh | skills/ux-target-audience/SKILL.md:14 | Skip-check: read to decide whether to regenerate |
| `existing_problem_statement` | hooks/de-start-state.sh | skills/ux-problem-statement/SKILL.md:14 | Skip-check: read + softer signal via `shipped_ui` |
| `existing_story_panels` | hooks/de-start-state.sh | skills/ux-story-panels/SKILL.md:14 | Skip-check: read + softer signal via `shipped_ui` |
| `off_repo_references` | hooks/de-start-state.sh | skills/ux-user-interviews/SKILL.md:14 | Input augmentation: read to enrich existing research |
| `shipped_ui` | hooks/de-start-state.sh | skills/ux-problem-statement/SKILL.md:14, skills/ux-business-plan/SKILL.md:14, skills/ux-story-panels/SKILL.md:14, commands/design-engineer/review.md:226 | Softer signal for skip-check (4 files read) |

### Mismatches Identified

#### Orphan Writes (Keys Written But Never Read)
**None found.** All 9 keys written by the hook are read by at least one skill or command.

#### Orphan Reads (Keys Read But Never Written)
**None found.** All keys read by skills are written by the hook.

#### Inconsistent Skip-Check Preambles (Potential Defect)
**Finding**: 7 ux-* canonical-deliverable skills reference `project.context` in their preambles with INCONSISTENT patterns:

1. **ux-problem-statement** (line 14): reads BOTH `existing_problem_statement` AND `shipped_ui` (softer signal)
2. **ux-story-panels** (line 14): reads BOTH `existing_story_panels` AND `shipped_ui` (softer signal)
3. **ux-business-plan** (line 14): reads BOTH `existing_business_plan` AND `shipped_ui` (softer signal)
4. **ux-target-audience** (line 14): reads ONLY `existing_personas` (no `shipped_ui` fallback)
5. **ux-competitor-analysis** (line 14): reads ONLY `existing_competitor_analysis` (no `shipped_ui` fallback)
6. **ux-storybrand** (line 14): reads ONLY `existing_brand_docs` (no `shipped_ui` fallback)
7. **ux-assumptions** (line 14): reads ONLY `existing_assumptions_log` (no `shipped_ui` fallback)

**Impact**: Skills 4–7 lack the softer signal logic that skills 1–3 use. This means:
- Projects with `shipped_ui: true` but no `existing_assumptions_log` will NOT skip ux-assumptions (inconsistent with ux-problem-statement behavior)
- Users see different skip behavior across "logically equivalent" skills

---

## Section 2: Skill Frontmatter Keys – Canonical Compliance

### Summary

**56 skills scanned.** Canonical required keys per Anthropic docs and CLAUDE.md:
- `name` (required, must match directory name)
- `description` (required)
- `model` (required for plugin skills; not optional)
- `effort` (required for all skills per CLAUDE.md)
- `disable-model-invocation` (required; all plugin skills should be false by default or explicitly true)
- `license` (required; all skills use `MIT`)
- `compatibility` (optional; only when skill has external dependencies)
- `allowed-tools` (optional; rarely used)

### Compliance Findings

#### Critical Issues (Missing Required Keys)

| Skill | Issue | File:Line | Impact |
|-------|-------|-----------|--------|
| **advisor** | Missing `disable-model-invocation` | skills/advisor/SKILL.md:1 | Per CLAUDE.md, advisor is a manual checkpoint primitive, not auto-invocable. Default `false` allows unintended auto-invocation. |
| **advisor** | Missing `effort` | skills/advisor/SKILL.md:1 | Cannot prioritize complexity. Confuses context usage estimation. |
| **dev-component-gallery** | Missing `disable-model-invocation` | skills/dev-component-gallery/SKILL.md:1 | Skill is transparent infra (auto-scaffolded by frontend-implementer). Should not be user-invocable. |

#### Non-Canonical Keys Found

| Skill | Non-Canonical Key | Value | Context |
|-------|-------------------|-------|---------|
| **ui-images** | `optional` (under `compatibility`) | `[playwright-cli]` | This appears to be a structured list under `compatibility`, not a top-level key. See SKILL.md line 8–10. |

### Frontmatter Presence Matrix (Summary)

| Skill Category | Count | All Have `model` | All Have `effort` | All Have `disable-model-invocation` |
|---|---|---|---|---|
| advisor-class skills | 1 | ✓ | ✗ (advisor missing) | ✗ (advisor missing) |
| dev-* skills | 9 | ✓ | ✓ | ✗ (dev-component-gallery missing) |
| meta-* skills | 5 | ✓ | ✓ | ✓ |
| psych-* skills | 15 | ✓ | ✓ | ✓ |
| ui-* skills | 9 | ✓ | ✓ | ✓ |
| ux-* skills | 16 | ✓ | ✓ | ✓ |
| **TOTAL** | **56** | **55/56** | **55/56** | **54/56** |

### Detailed Skill Matrix

```
name | model | effort | disable-model-invocation | user-invocable | license | other-keys
-----|-------|--------|--------------------------|-----------------|---------|------------
advisor | sonnet | (MISSING) | (MISSING) | unknown | MIT | (none)
dev-agent-setup | claude-opus-4-7 | high | true | NO | MIT | (none)
dev-claude-md | sonnet | medium | true | NO | MIT | (none)
dev-component-gallery | claude-opus-4-7 | high | (MISSING) | unknown | MIT | (none)
dev-github-workflow | sonnet | medium | true | NO | MIT | (none)
dev-mcp-setup | sonnet | medium | true | NO | MIT | compatibility
dev-prototyping | claude-opus-4-7 | high | true | NO | MIT | (none)
dev-starter-prompts | sonnet | medium | true | NO | MIT | (none)
dev-status-tracking | sonnet | medium | true | NO | MIT | (none)
meta-document | sonnet | medium | true | NO | MIT | (none)
meta-orchestrator | claude-opus-4-7 | xhigh | true | NO | MIT | (none)
meta-setup | claude-opus-4-7 | high | true | NO | MIT | compatibility
meta-setup-configure | claude-opus-4-7 | high | true | NO | MIT | (none)
meta-setup-existing | claude-opus-4-7 | high | true | NO | MIT | (none)
meta-setup-welcome | claude-opus-4-7 | high | true | NO | MIT | (none)
meta-statusline | sonnet | medium | true | NO | MIT | compatibility
psych-cognitive-biases | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-cognitive-load | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-decision-fundamentals | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-decision-persuasion | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-delight-design | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-emotional-retention | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-engagement-patterns | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-full-scan | claude-opus-4-7 | xhigh | true | NO | MIT | (none)
psych-habit-formation | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-pricing-psychology | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-simplification | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-social-influence | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-time-perception | claude-opus-4-7 | high | true | NO | MIT | (none)
psych-visual-perception | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-accessibility | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-aesthetic-review | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-design-system | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-design-to-code-qa | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-figma-guide | sonnet | medium | true | NO | MIT | compatibility
ui-figma-handoff | sonnet | medium | true | NO | MIT | compatibility
ui-images | claude-opus-4-7 | high | true | NO | MIT | (optional)
ui-landing-page | claude-opus-4-7 | high | true | NO | MIT | (none)
ui-references-moodboard | sonnet | medium | true | NO | MIT | (none)
ux-assumptions | sonnet | medium | true | NO | MIT | (none)
ux-behavior-mapping | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-bias-audit | claude-opus-4-7 | xhigh | true | NO | MIT | (none)
ux-business-plan | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-communicating-decisions | sonnet | medium | true | NO | MIT | (none)
ux-competitor-analysis | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-ethics-review | claude-opus-4-7 | xhigh | true | NO | MIT | (none)
ux-full-review | claude-opus-4-7 | xhigh | true | NO | MIT | (none)
ux-information-architecture | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-journey-mapping | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-motivation-audit | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-mvp-requirements | sonnet | medium | true | NO | MIT | (none)
ux-problem-statement | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-story-panels | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-storybrand | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-target-audience | claude-opus-4-7 | high | true | NO | MIT | (none)
ux-user-interviews | claude-opus-4-7 | high | true | NO | MIT | (none)
```

---

## Section 3: Agent Frontmatter Keys – Canonical Compliance

### Summary

**10 agents scanned.** Canonical required keys per Anthropic agent docs:
- `name` (required)
- `description` (required)
- `model` (required per CLAUDE.md "every agent MUST have explicit model")
- `effort` (optional in Anthropic docs, but CLAUDE.md makes it required)
- `memory` (optional; compound-documenter uses `memory: project`)
- Other optional keys: `maxTurns`, `tools`, `disallowedTools`, `skills`, `mcpServers`, `hooks`, `background`, `isolation`, `color`, `initialPrompt`, `permissionMode`

### Compliance Findings

#### Critical Issues
**None found.** All 10 agents have `name`, `description`, `model`, and `effort`.

#### Special Cases

| Agent | Special Keys | Notes |
|-------|--------------|-------|
| **compound-documenter** | `memory: project` | Per Anthropic docs, enables persistent memory across sessions via `.claude/agent-memory/compound-documenter/`. |

### Frontmatter Presence Matrix (All 10 Agents)

| Agent | name | description | model | effort | memory | other-keys |
|-------|------|-------------|-------|--------|--------|------------|
| advisor | ✓ | ✓ | ✓ | ✓ | – | (none) |
| backend-implementer | ✓ | ✓ | ✓ | ✓ | – | (none) |
| compound-documenter | ✓ | ✓ | ✓ | ✓ | ✓ (project) | (none) |
| context-analyzer | ✓ | ✓ | ✓ | ✓ | – | (none) |
| deliverable-writer | ✓ | ✓ | ✓ | ✓ | – | (none) |
| design-system-auditor | ✓ | ✓ | ✓ | ✓ | – | (none) |
| frontend-implementer | ✓ | ✓ | ✓ | ✓ | – | (none) |
| psych-scanner | ✓ | ✓ | ✓ | ✓ | – | (none) |
| test-writer | ✓ | ✓ | ✓ | ✓ | – | (none) |
| ux-researcher | ✓ | ✓ | ✓ | ✓ | – | (none) |

### Model & Effort Distribution

| Model | Count | Effort Values |
|-------|-------|---|
| claude-opus-4-7 | 8 | xhigh (2), high (6) |
| sonnet | 2 | high (2) |

**Note**: compound-documenter uses `sonnet` (lower-cost), appropriate for documentation and memory-state tasks.

---

## Findings (append to 99-ledger.json)

### Finding F-0011: Inconsistent Skip-Check Preambles Across 7 UX Skills

```json
{
  "id": "F-0011",
  "severity": "MEDIUM",
  "category": "consistency",
  "file": "skills/ux-{problem-statement,story-panels,business-plan}/SKILL.md and skills/ux-{target-audience,competitor-analysis,storybrand,assumptions}/SKILL.md",
  "line": "~14 in all 7 skills",
  "evidence": "ux-problem-statement, ux-story-panels, and ux-business-plan reference TWO keys: existing_X AND shipped_ui (softer signal). ux-target-audience, ux-competitor-analysis, ux-storybrand, and ux-assumptions reference ONLY existing_X. This produces inconsistent skip behavior: projects with shipped_ui:true but no existing_assumptions_log will skip ux-problem-statement but not ux-assumptions.",
  "why_it_matters": "Users expect the 7 canonical-deliverable skip-check skills to behave consistently. Mixing two-key vs one-key logic produces surprising behavior and reduces trust in the skip-check mechanism.",
  "direction": "Define a canonical preamble template (2-key pattern: existing_X AND softer shipped_ui signal). Apply identically to all 7 skills. Document the pattern in CLAUDE.md so future skills copy it correctly.",
  "repro": "grep -n 'existing_' skills/ux-problem-statement/SKILL.md skills/ux-target-audience/SKILL.md skills/ux-competitor-analysis/SKILL.md skills/ux-storybrand/SKILL.md skills/ux-business-plan/SKILL.md skills/ux-story-panels/SKILL.md skills/ux-assumptions/SKILL.md | grep -E 'line 14|line 15'",
  "confidence": "high"
}
```

### Finding F-0012: advisor Skill Missing disable-model-invocation and effort

```json
{
  "id": "F-0012",
  "severity": "HIGH",
  "category": "consistency",
  "file": "skills/advisor/SKILL.md",
  "line": "1",
  "evidence": "Frontmatter lacks both disable-model-invocation and effort. advisor is explicitly a manual checkpoint primitive per CLAUDE.md and Anthropic's advisor-tool docs. Default disable-model-invocation:false allows Claude to auto-invoke at any moment.",
  "why_it_matters": "The advisor pattern is designed as an explicit strategic call, not an auto-invocation. Without disable-model-invocation:true, the advisor may fire at unintended moments, adding latency to every subagent. Without effort, context estimation is unreliable.",
  "direction": "Add disable-model-invocation: true and effort: high (or xhigh for strategic calls) to skills/advisor/SKILL.md frontmatter.",
  "repro": "head -10 skills/advisor/SKILL.md",
  "confidence": "high"
}
```

### Finding F-0013: dev-component-gallery Skill Missing disable-model-invocation

```json
{
  "id": "F-0013",
  "severity": "MEDIUM",
  "category": "consistency",
  "file": "skills/dev-component-gallery/SKILL.md",
  "line": "1",
  "evidence": "Frontmatter has model:claude-opus-4-7 and effort:high but lacks disable-model-invocation. This skill is transparent infrastructure auto-scaffolded by frontend-implementer and design-system-auditor agents. It should never be user-invocable or auto-selected by Claude.",
  "why_it_matters": "Without disable-model-invocation:true, Claude may invoke the gallery skill at unexpected moments or it may appear in skill-selection suggestions. This violates the 'transparent infra' design pattern.",
  "direction": "Add disable-model-invocation: true to skills/dev-component-gallery/SKILL.md frontmatter.",
  "repro": "head -10 skills/dev-component-gallery/SKILL.md",
  "confidence": "high"
}
```

### Finding F-0014: Non-Canonical Key in ui-images Skill

```json
{
  "id": "F-0014",
  "severity": "LOW",
  "category": "documentation",
  "file": "skills/ui-images/SKILL.md",
  "line": "8-10",
  "evidence": "Frontmatter includes optional: [playwright-cli] nested under compatibility. This is a structured field, not a top-level non-canonical key, but the structure is non-standard. Canonical approach per CLAUDE.md would be compatibility: 'Requires Node.js v18+ and Playwright CLI (optional fallback)' as plain text.",
  "why_it_matters": "Inconsistent structure makes it harder for tooling to parse compatibility declarations. Other skills use flat string descriptions; ui-images uses nested object.",
  "direction": "Normalize to canonical compatibility format: compatibility: 'Requires Playwright CLI (optional; skill falls back to URL list if absent)' as plain string.",
  "repro": "head -12 skills/ui-images/SKILL.md",
  "confidence": "medium"
}
```

### Finding F-0015: No project.context Orphan Keys Found, But Preamble Inconsistency Discovered

```json
{
  "id": "F-0015",
  "severity": "MEDIUM",
  "category": "coverage",
  "file": "skills/ux-*/SKILL.md",
  "line": "~14",
  "evidence": "Scan of all 9 project.context keys (written by hooks/de-start-state.sh) shows no orphan writes or reads. All keys are read by at least one skill. However, the skip-check preambles that READ these keys are inconsistent: some skills use two-key logic (existing_X + shipped_ui), others use one-key logic (existing_X only). This is documented as Finding F-0011.",
  "why_it_matters": "While no keys are truly orphaned, the inconsistent consumption pattern means some keys (shipped_ui) are underutilized by skills that should benefit from the softer signal.",
  "direction": "See Finding F-0011 for the canonical preamble template fix. Once applied, all 9 keys will be read consistently across all canonical-deliverable skills.",
  "repro": "grep -n 'existing_\\|shipped_ui' skills/ux-*/SKILL.md | head -20",
  "confidence": "high"
}
```

---

## Summary Statistics

| Metric | Count | Status |
|--------|-------|--------|
| Total Skills | 56 | Complete |
| Skills with ALL required keys | 54 | ⚠ 2 missing disable-model-invocation |
| Skills with effort field | 55 | ⚠ 1 missing (advisor) |
| Total Agents | 10 | ✓ Complete |
| Agents with ALL required keys | 10 | ✓ All compliant |
| project.context keys written | 9 | ✓ All used |
| project.context keys read | 9 | ✓ No orphans |
| Inconsistent skip-check patterns | 7 skills | ⚠ 2-key vs 1-key mismatch |

---

## Next Steps (Phase 2+)

1. **Fix F-0011** (Preamble inconsistency): Unify skip-check logic across 7 ux-* skills
2. **Fix F-0012** (advisor skill): Add missing fields
3. **Fix F-0013** (dev-component-gallery): Add missing disable-model-invocation
4. **Fix F-0014** (ui-images): Normalize compatibility format
5. **Verify F-0015** (project.context coverage): Confirm once F-0011 is resolved

