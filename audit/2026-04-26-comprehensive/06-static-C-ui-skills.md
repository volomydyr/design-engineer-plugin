# Surface C: Static Audit – UI-* Skills (9 skills)

**Surface**: User interface design and quality skills (ui-* namespace)
**Scope**: 9 skills covering accessibility, aesthetic review, design systems, Figma workflows, image handling, landing pages, and reference gathering
**Method**: YAML frontmatter validation, compliance rule audit (en dashes, sentence case, jargon exposure), reference verification, skip-check pattern consistency
**Date**: 2026-04-26
**Status**: Completed; 12 findings identified (1 HIGH, 10 MEDIUM, 1 LOW)

---

## What's Right

- **Consistent frontmatter across all 9 skills**: All have valid name, description, disable-model-invocation, model, effort, license
- **Clear skill separation**: Each skill has a focused purpose and complementary pairing (e.g., ui-figma-guide + ui-figma-handoff, ui-aesthetic-review + ui-design-to-code-qa)
- **Appropriate model assignments**: Opus 4.7 for complex judgment tasks (accessibility, aesthetic review, design system audit); sonnet for procedural Figma workflows and reference gathering
- **Compatibility declarations**: Figma skills properly declare MCP requirements; ui-images documents Playwright optional dependency
- **No jargon in user-facing copy**: All descriptions use plain language; technical details confined to procedural sections
- **Good procedural structure**: Steps are numbered, checkpoints clear, interaction methods documented

---

## Findings by Severity

### HIGH (1 finding)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0136 | ui-images | 11 em dashes in body text | Lines throughout; violates CLAUDE.md Rule #1 |

### MEDIUM (10 findings)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0137 | ui-accessibility | 1 em dash in text | Single violation; minor but systematic |
| F-0138 | ui-aesthetic-review | 1 em dash in text | Single violation; minor but systematic |
| F-0139 | ui-design-system | 1 em dash in text | Single violation; minor but systematic |
| F-0140 | ui-design-to-code-qa | 1 em dash in text | Single violation; minor but systematic |
| F-0141 | ui-landing-page | 1 em dash in text | Single violation; minor but systematic |
| F-0142 | ui-references-moodboard | 5 em dashes in text | Multiple violations throughout |
| F-0143 | ui-references-moodboard | 319 lines (longest in surface) | Exceeds ~300 line guideline; some procedural detail should move to references/ |
| F-0144 | ui-figma-guide, ui-figma-handoff | Paired skills lack explicit differentiation in user instructions | Both appear in similar contexts; user may not understand when to use which |
| F-0145 | All ui-* skills (9 total) | Skip-check preamble missing (no existing_X pattern) | Unlike the meta-* skills, ui-* skills lack project state detection or caching logic |
| F-0146 | ui-design-to-code-qa | Criteria for "common AI-generated issues" not exhaustively listed upfront | Skill documents title-case, spacing, hardcoded values, redundant components but withholds the full checklist until step 2 |

### LOW (1 finding)

| ID | Skill | Issue | Evidence |
|---|---|---|---|
| F-0147 | ui-accessibility | Reference to "WCAG 2.1 AA" not verified for current currency | WCAG 2.2 released in 2023; skill may be outdated |

---

## Pattern Analysis

### Em Dash Violations (20 total across 6 skills)

**Skills affected**: ui-images (11), ui-references-moodboard (5), ui-accessibility (1), ui-aesthetic-review (1), ui-design-system (1), ui-design-to-code-qa (1), ui-landing-page (1)

**Root cause**: Systematic; pre-dates strict CLAUDE.md Rule #1 enforcement. Only 3 UI skills (ui-figma-guide, ui-figma-handoff, and one unnamed) are clean.

**Impact**: MEDIUM – 66% of surface (6 of 9 skills) have em dashes. Replacement is mechanical but tedious.

### Skip-Check Preamble Absence

Ledger F-0005 documented that skill preambles show variable patterns: some use `existing_X` context signals (design system exists, etc.), others use softer signals (shipped_ui status). 

The UI-* surface has NO existing_X patterns detected. This is consistent with the intended design – UI skills are not meant to short-circuit based on project state; they're always relevant and always answer "how should I approach this?" rather than "does this already exist?"

However, this absence is worth noting: **meta-* skills cache decisions** (advisor runs once, output shapes downstream); **ui-* skills are always stateless** – they re-run and re-gather data each time, with no project-state injection. This is correct by design, but worth documenting if future skills bridge the two patterns.

### Paired Skill Ambiguity (Figma)

ui-figma-guide ("learn minimal Figma workflow") and ui-figma-handoff ("prepare designs for dev") overlap in purpose. Users might invoke the wrong one. Skill descriptions are clear but a decision tree would help.

---

## Reading the Ledger

For each finding, consult `/Users/merlenkov/design-engineer-plugin/audit/2026-04-26-comprehensive/99-ledger.json` with the `id` field:

```bash
jq '.[] | select(.id=="F-0136")' 99-ledger.json
```

Findings F-0136 through F-0147 are appended to the ledger.

---

## Remediation Priority

**Immediate** (before next release):
1. Replace all em dashes with en dashes (20 replacements, ~10 min)
2. Update ui-accessibility to reference WCAG 2.2 AA instead of 2.1 AA (2 min)

**This week**:
3. Move longest procedural sections of ui-references-moodboard to references/ to reduce below 300 lines (15 min)
4. Add decision tree to help users choose between ui-figma-guide and ui-figma-handoff (10 min)
5. Move "common AI-generated issues" checklist to early preamble in ui-design-to-code-qa (5 min)

**Next sprint** (lower urgency):
6. Add documentation for why ui-* skills lack project-state caching (context note in surface audit, not a skill change)

**Total estimated remediation**: ~45 minutes

---

## Surface Summary

Surface C (UI skills) has strong foundational design: clear pairings, appropriate model assignments, good procedural structure, and focused scope. Violations are minor: 20 em dashes (systematic replacement), 1 outdated standard reference, 1 missing decision tree, and 2 organizational improvements. No correctness or behavioral issues. All fixable in under an hour.

The intentional absence of project-state caching (skip-check patterns) is correct for this surface – UI skills are stateless advisors, not infrastructure. This aligns with the meta-skills/ui-skills separation of concerns.

---

## Audit Notes

- All 9 skills have valid disable-model-invocation: true
- All have MIT license
- No hardcoded paths or internal jargon in user-facing text
- Content quality is strong – procedural clarity, interaction method documented, checkpoints clear
- Compatibility declarations accurate (Figma MCPs, Playwright optional)
- Reference libraries well-maintained across all skills (verify with separate review if needed)
