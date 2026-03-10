# command:de:review Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 24: Figma review | 6/6 (100%) | 2/6 (33%) | +67% |
| Eval 25: Accessibility audit | 6/6 (100%) | 3/6 (50%) | +50% |
| Eval 26: Full review | 6/6 (100%) | 2/6 (33%) | +67% |
| **Overall** | **18/18 (100%)** | **7/18 (39%)** | **+61%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 46,767 | 22,133 | +111% |
| Mean duration (s) | 190.8 | 106.4 | +79% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Multi-skill review pipeline** — Routes to correct review workflow (Figma, accessibility, full) based on argument
2. **Structured per-skill execution** — Loads ui-visual-review, ui-accessibility, psych-master-audit as distinct review passes
3. **Compiled multi-dimensional reports** — Merges findings from 3-6 skills into a structured report with executive summary and per-dimension sections
4. **Psychology principles scan** — Applies 100+ psychology principles to design reviews (baseline never does this)
5. **WCAG-structured accessibility** — Organizes audit by POUR principles with specific criterion references

### What baseline does instead:
- Eval 24: Can recognize Figma review intent and ask for screenshots, but provides flat general design tips instead of multi-skill structured review
- Eval 25: Handles accessibility reasonably (50% pass) since WCAG is well-known, but lacks structured audit format with pass/fail per criterion
- Eval 26: Provides single-pass general review instead of multi-dimensional compiled report from distinct skill frameworks

### Analyst Notes:
- Accessibility eval shows narrowest gap (50% baseline) because accessibility is a well-established domain with wide general knowledge
- Psychology scan is the most discriminating dimension — baseline never applies cognitive biases or behavioral principles to design reviews
- The compiled report structure (executive summary, per-dimension findings, cross-cutting themes) is unique to with-skill runs
