# Surface B: Static Audit – Dev-* Skills (8 skills)

**Surface**: Development and infrastructure skills (dev-* namespace)
**Scope**: 8 skills responsible for agent setup, Git workflows, component gallery, MCP configuration, prototyping, project documentation, status tracking
**Method**: YAML frontmatter validation, compliance rule audit (en dashes, sentence case, jargon exposure), reference verification
**Date**: 2026-04-26
**Status**: Completed; 16 findings identified (7 HIGH, 8 MEDIUM, 1 LOW)

---

## What's Right

- **Comprehensive reference libraries**: All dev-* skills except dev-mcp-setup include well-structured references/ directories with educational and procedural content
- **Consistent frontmatter shape**: All 8 skills have valid YAML frontmatter with name, description, model, effort, license fields
- **Model assignment appropriate**: Skills use claude-opus-4-7 for complex tasks (agent-setup, prototyping, component-gallery) and sonnet for mechanical tasks (claude-md, github-workflow, starter-prompts, status-tracking)
- **Effort levels calibrated**: xhigh not used (appropriate for this surface); high/medium balance matches task complexity
- **Content quality**: Procedural skills teach workflows with high clarity and actionable steps

---

## Findings by Severity

### HIGH (7 findings)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0120 | dev-component-gallery | Missing `disable-model-invocation:` | Frontmatter line 1–7 lacks disable flag; defaults to false |
| F-0121 | dev-component-gallery | 33 em dashes in body text | Lines 3, 11, 22 and throughout; violates CLAUDE.md Rule #1 |
| F-0122 | dev-claude-md | 4 em dashes in body text | Lines 152, 154, 156; violates CLAUDE.md Rule #1 |
| F-0123 | dev-github-workflow | 8 em dashes in body text | Lines 63, 65, etc.; violates CLAUDE.md Rule #1 |
| F-0124 | dev-prototyping | 8 em dashes in body text | Lines 47, 54, 64; violates CLAUDE.md Rule #1 |
| F-0125 | dev-mcp-setup | references/ directory is empty (0 files) | Directory exists but no content; will fail on reference loads |
| F-0126 | dev-agent-setup | AskUserQuestion panels lack required padding spacer | Multiple questions lack 3-line `───────` padding before tool invocation |

### MEDIUM (8 findings)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0127 | dev-prototyping | Overly long content (442 lines) | Exceeds ~350-line target; some procedural detail should move to references/ |
| F-0128 | dev-github-workflow | Branch naming convention documentation missing | Docs don't specify pattern (feat/*, bugfix/*, etc.) |
| F-0129 | dev-agent-setup | Agent iteration section lacks negative example | Section teaches best practice but doesn't show what NOT to do |
| F-0130 | dev-component-gallery | Stack adapter implementation incomplete | Skill claims to adapt via context7 but no example flow shown |
| F-0131 | dev-starter-prompts | No guidance on prompt tone/voice | Skill generates prompts but doesn't teach voice consistency with CLAUDE.md |
| F-0132 | dev-status-tracking | Context compaction trigger thresholds not specified | Skill teaches compaction but doesn't say "when <X> tokens remaining" |
| F-0133 | dev-mcp-setup | "Essential MCPs" list not defined upfront | Skill mentions "start with essentials" but essentials are presented mid-skill |
| F-0134 | dev-github-workflow | Mode 1 vs Mode 2 footer attribution scope ambiguous | Docs say plugin footer appears "only when actively driving" but doesn't define "actively" |

### LOW (1 finding)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0135 | dev-claude-md | "MUST include" phrasing is imperative (alien to tone rule) | Line 152: "The generated CLAUDE.md MUST include..." violates gentle advisory tone |

---

## Pattern Analysis

### Em Dash Epidemic (62 total occurrences across 4 skills)

**Skills affected**: dev-component-gallery (33), dev-prototyping (8), dev-github-workflow (8), dev-claude-md (4)

**Root cause**: Dev skills are older, pre-dating strict CLAUDE.md Rule #1 adoption. Em dashes appear in descriptions, procedural sections, and reference prose—systematic replacement needed across this surface.

**Impact**: HIGH – every dev-* skill except dev-agent-setup, dev-mcp-setup, dev-starter-prompts, dev-status-tracking violates the en dash rule. This is 50% of the surface.

### Disable-Model-Invocation Inconsistency

Only 1 skill missing (dev-component-gallery), but paired with em dash violations suggests skills were written when that requirement was not fully enforced.

### Empty References Directory (dev-mcp-setup)

Unique to this skill. Directory exists but contains no files. This is a structural anomaly—either the directory should be removed or reference files should be created.

---

## Reading the Ledger

For each finding, consult `/Users/merlenkov/design-engineer-plugin/audit/2026-04-26-comprehensive/99-ledger.json` with the `id` field:

```bash
jq '.[] | select(.id=="F-0120")' 99-ledger.json
```

Findings F-0120 through F-0135 are appended to the ledger.

---

## Remediation Priority

**Immediate** (before next release):
1. Replace all em dashes with en dashes (62 replacements, ~15 min)
2. Add `disable-model-invocation: true` to dev-component-gallery frontmatter (1 line)
3. Add required padding spacers to AskUserQuestion blocks in dev-agent-setup (5–8 blocks, ~10 min)

**This week**:
4. Populate dev-mcp-setup/references/ with essential-MCPs.md (15 min)
5. Move longest sections of dev-prototyping to references/ to reduce main skill below 350 lines (20 min)
6. Document branch naming convention in dev-github-workflow (10 min)
7. Clarify Mode 1 vs Mode 2 "actively driving" definition with examples (10 min)

**Next sprint** (lower urgency):
8. Add negative example to dev-agent-setup agent-iteration section (15 min)
9. Document context-compaction token thresholds in dev-status-tracking (10 min)
10. Define "essential MCPs" upfront in dev-mcp-setup as a list (5 min)
11. Add stack-adapter flow example to dev-component-gallery (20 min)
12. Document prompt tone/voice guidance in dev-starter-prompts (15 min)

**Total estimated remediation**: ~3 hours

---

## Surface Summary

Surface B has good structural compliance (frontmatter, model assignment, effort calibration) but exhibits systematic violations of output-formatting rules (em dashes) that pre-date the current CLAUDE.md strictness. One critical structural gap (empty references directory) and one missing frontmatter field. No correctness violations (code/behavior bugs). All issues are fixable in under 3 hours.

The skill content quality is strong—no jargon exposure, clear teaching, actionable procedures. The violations are housekeeping rather than substance.

---

## Audit Notes

- No execution/behavioral issues detected (this is static analysis only)
- All skills have valid name/description matching their directory names
- License: MIT on all 8 skills
- No hardcoded paths or internal jargon in user-facing content (all jargon confined to technical sections)
- Component gallery skill demonstrates sophisticated design intent (stack-agnostic adaptation) but implementation incomplete in docs
