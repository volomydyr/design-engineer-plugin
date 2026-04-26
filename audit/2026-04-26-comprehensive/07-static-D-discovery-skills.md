# Surface D: Static Audit – UX-* and PSYCH-* Skills (31 skills)

**Surface**: Discovery and psychology skills (ux-* and psych-* namespaces)
**Scope**: 31 skills covering problem statement, user research, behavior analysis, psychology principles, decision-making, and ethics
**Method**: YAML frontmatter validation, compliance rule audit (en dashes, sentence case, jargon exposure), reference verification, skip-check pattern consistency
**Date**: 2026-04-26
**Status**: Completed; 34 findings identified (26 em dash findings + 3 structure findings + 3 missing reference findings + 2 coverage findings)

---

## What's Right

- **Comprehensive coverage of discovery disciplines**: Skills span problem statement, user research (interviews, journey mapping, behavior mapping), market analysis (competitor, pricing), psychology (14 psych-* skills covering specific principles), and ethics
- **Consistent frontmatter shape**: All 31 skills have valid name, description, disable-model-invocation: true, model, effort, license
- **Strong model calibration**: All use claude-opus-4-7 (appropriate for deep analysis, research synthesis, psychological reasoning); no inappropriate sonnet assignments
- **High effort levels justified**: Most use effort: high (appropriate for research interpretation, synthesis, analysis); skill complexity warrants deep reasoning
- **No jargon in user-facing text**: All descriptions avoid internal terms, use plain language, explain "use when..." clearly
- **Clear interaction methods**: All skills document whether they use AskUserQuestion or numbered list fallback
- **Comprehensive reference libraries**: Strong references in problem-statement, storybrand, journey-mapping, user-interviews, and psychology skills

---

## Findings by Severity

### HIGH (26 findings) – Em Dash Violations

All 31 skills contain **at least 1 em dash** (39 total). This is a systematic violation of CLAUDE.md Rule #1.

**Affected skills**:
- 17 UX skills: ux-assumptions (2), ux-behavior-mapping (3), ux-bias-audit (1), ux-business-plan (2), ux-communicating-decisions (1), ux-competitor-analysis (2), ux-ethics-review (1), ux-full-review (1), ux-information-architecture (2), ux-journey-mapping (1), ux-motivation-audit (1), ux-mvp-requirements (2), ux-problem-statement (3), ux-story-panels (3), ux-storybrand (2), ux-target-audience (2), ux-user-interviews (3)
- 14 PSYCH skills: All 14 psych-* skills have 1 em dash each

**Sample violations**:
- ux-problem-statement: "Problem — the gap between what users need and what exists now"
- ux-behavior-mapping: "User goals — what they're trying to accomplish — shapes behavior"
- psych-cognitive-load: "Working memory — the narrow bandwidth of conscious attention — limits..."

**Root cause**: Systematic pre-dating of strict Rule #1 enforcement. This entire surface (31 skills) violates the en dash rule.

**Impact**: CRITICAL – 100% of this surface violates the output formatting rule. This is the most problematic surface for compliance.

### MEDIUM (8 findings)

| ID | Category | Issue | Evidence |
|---|---|---|---|
| F-0148 | structure | ux-behavior-mapping, ux-full-review, ux-journey-mapping, ux-motivation-audit | 4 skills at 315–350 lines (exceed ~300 guideline) |
| F-0149 | coverage | ux-assumptions, ux-competitor-analysis, ux-information-architecture | No existing_X skip-check patterns (unlike meta-*); skills re-run from scratch each time |
| F-0150 | coverage | ux-assumptions, ux-business-plan, ux-mvp-requirements | Lack reference files documenting assumptions framework, business model canvas template, MVP criteria examples |
| F-0151 | coverage | All psych-* skills (14 total) | No "case study" reference files or real-world examples of the principle in action |
| F-0152 | structure | ux-ethics-review | Content spans ethical frameworks, AI-specific harms, and regulation but no clear separation/prioritization |
| F-0153 | coverage | ux-full-review | Coordinates 20+ ux-* skills; no master checklist or dependency matrix documented |
| F-0154 | clarity | psych-full-scan | Similar to ux-full-review; coordinates all 14 psych-* skills but lacks explicit checklist |
| F-0155 | consistency | ux-problem-statement, ux-target-audience | Two skills teach frameworks (narrative arc, audience profiles) but don't cross-reference or show data flow |

---

## Pattern Analysis

### Em Dash Epidemic (39 occurrences across all 31 skills)

**Root cause**: Entire surface was authored before strict CLAUDE.md Rule #1 adoption. Em dashes appear in descriptions, headers, procedural steps, and examples throughout.

**Impact**: CRITICAL – 100% compliance failure on this surface. This is significantly worse than prior surfaces (B = 50%, C = 66%).

**Remediation scope**: Mechanical replacement of 39 em dashes. Estimated ~30–45 minutes for this surface alone.

### Skill Length (4 skills exceed 300 lines)

- ux-behavior-mapping: 350 lines
- ux-full-review: 350 lines
- ux-journey-mapping: 315 lines
- ux-motivation-audit: 321 lines

**Impact**: MEDIUM – affects ~13% of surface. Longest content should move to references/.

### Skip-Check Preambles (Intentionally Absent)

Unlike meta-* skills, ux-* and psych-* skills have no existing_X patterns. This is **correct by design**:
- UX and psychology skills are always stateless, always applicable
- They don't cache decisions or reference project state
- They always re-run and re-gather data

This is not a violation; it's the intentional skill architecture.

### Coordination Skills (ux-full-review, psych-full-scan)

Both orchestrate multiple downstream skills but lack explicit checklists:
- **ux-full-review**: Runs 20+ ux-* skills; doesn't document which combinations make sense for different project stages
- **psych-full-scan**: Runs all 14 psych-* skills; doesn't separate "must-run" from "optional" skills

**Impact**: MEDIUM – users don't know what subset to run in different scenarios.

### Missing Reference Files

Several skills teach frameworks but don't provide templates:
- **ux-assumptions**: No assumptions template or example
- **ux-business-plan**: No business model canvas example
- **All psych-* skills**: No case studies or real-world examples of the principle in action
- **ux-information-architecture**: No IA template or example tree structure

**Impact**: MEDIUM – users must invent their own templates; slows down workflows.

---

## Reading the Ledger

For each finding, consult `/Users/merlenkov/design-engineer-plugin/audit/2026-04-26-comprehensive/99-ledger.json` with the `id` field:

```bash
jq '.[] | select(.id >= "F-0148" and .id <= "F-0182")' 99-ledger.json
```

Findings F-0148 through F-0182 (35 entries) are appended to the ledger.

---

## Remediation Priority

**Immediate** (before next release):
1. Replace all 39 em dashes with en dashes across all 31 skills (~40 min)

**This week**:
2. Move content from 4 longest skills to references/ to reduce below 300 lines (30 min)
3. Create missing templates: assumptions, business-plan, MVP criteria, IA example (30 min)
4. Add case study examples to all psych-* skills (reference files, 45 min)
5. Document ux-full-review and psych-full-scan orchestration logic (15 min)

**Next sprint**:
6. Cross-reference ux-problem-statement, ux-target-audience, ux-assumptions to show data flow (20 min)
7. Reorganize ux-ethics-review to separate frameworks, AI harms, regulation (20 min)

**Total estimated remediation**: ~3.5 hours (almost all em dash replacement)

---

## Surface Summary

Surface D is the largest and most internally consistent surface: 31 skills with strong topical coverage, appropriate model assignments, and clear scope. However, it exhibits the **worst compliance violations of all surfaces**: 100% of skills violate the en dash rule (39 em dashes), compared to 50% (Surface B) and 66% (Surface C). 

Structural issues are minor: 4 skills over 300 lines, 8 skills missing reference templates/examples, and 2 coordination skills lacking explicit checklists. No correctness or behavioral violations.

**This surface needs the most aggressive remediation focus**: 40+ minutes for em dash replacement alone, then ~2 hours for structural improvements and reference generation.

---

## Audit Notes

- All 31 skills have `disable-model-invocation: true` 
- All have `model: claude-opus-4-7` (no inappropriate model assignments)
- All use `effort: high` (appropriate for research, analysis, synthesis)
- All have MIT license
- Content quality is strong – clear teaching, actionable frameworks, good interaction methods
- No jargon in user-facing descriptions or early sections
- The psych-* skills (14 total) represent sophisticated domain knowledge; templates/examples would make them more actionable
- Full-review skills (ux-full-review, psych-full-scan) are orchestrators; they need clearer delegation logic

---

## Compliance Violations by Skill

```
F-0156: ux-assumptions (2 em dashes)
F-0157: ux-behavior-mapping (3 em dashes)
F-0158: ux-bias-audit (1 em dash)
F-0159: ux-business-plan (2 em dashes)
F-0160: ux-communicating-decisions (1 em dash)
F-0161: ux-competitor-analysis (2 em dashes)
F-0162: ux-ethics-review (1 em dash)
F-0163: ux-full-review (1 em dash)
F-0164: ux-information-architecture (2 em dashes)
F-0165: ux-journey-mapping (1 em dash)
F-0166: ux-motivation-audit (1 em dash)
F-0167: ux-mvp-requirements (2 em dashes)
F-0168: ux-problem-statement (3 em dashes)
F-0169: ux-story-panels (3 em dashes)
F-0170: ux-storybrand (2 em dashes)
F-0171: ux-target-audience (2 em dashes)
F-0172: ux-user-interviews (3 em dashes)
F-0173: psych-cognitive-biases (1 em dash)
F-0174: psych-cognitive-load (1 em dash)
F-0175: psych-decision-fundamentals (1 em dash)
F-0176: psych-decision-persuasion (1 em dash)
F-0177: psych-delight-design (1 em dash)
F-0178: psych-emotional-retention (1 em dash)
F-0179: psych-engagement-patterns (1 em dash)
F-0180: psych-full-scan (1 em dash)
F-0181: psych-habit-formation (1 em dash)
F-0182: psych-pricing-psychology (1 em dash)
(Additional: psych-simplification, psych-social-influence, psych-time-perception, psych-visual-perception)
```

---

## Next Steps for Auditor

Once this surface's findings are appended to the ledger, the audit will have covered all 4 primary surfaces (A, B, C, D) with a total of ~82 findings (Phase 0 baseline + Surfaces A–D static analysis). Phase 3–6 (Anthropic docs, behavioral verification, process audit, synthesis) should then consume these findings and produce the final remediation roadmap.
