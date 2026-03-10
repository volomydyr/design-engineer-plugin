# ui-visual-review Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 1: Onboarding flow visual review | 5/5 (100%) | 2/5 (40%) | +60% |
| Eval 2: Live site vs Figma comparison | 5/5 (100%) | 3/5 (60%) | +40% |
| **Overall** | **10/10 (100%)** | **5/10 (40%)** | **+60%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 45,350 | 21,100 | +115% |
| Mean duration (s) | 186.8 | 101.7 | +84% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **AI-artifact detection** — Proactively checks for title case errors, creative embellishments, and AI-added elements not in design
2. **Token compliance scanning** — Systematic scan for hardcoded values and wrong-token references
3. **Proactive discovery** — Finds issues beyond what the user reported (redundant components, near-miss colors)
4. **Severity-based reporting** — P0/P1/P2 organization with file:line references and fix commands
5. **Component reuse verification** — Checks if AI created new components that duplicate existing design system components

### What baseline does instead:
- Eval 1: Addresses user's specific complaints (spacing, colors) but does not proactively check for text casing, AI embellishments, or redundant components
- Eval 2: Good at comparing reported discrepancies (buttons, fonts, cards) but no token compliance scan or structured severity report

### Analyst Notes:
- Baseline scores 40% — visual comparison is an intuitive task that baseline handles at a basic level
- Eval 2 baseline is higher (60%) because the user named specific discrepancies to check, making it a focused debugging task
- Eval 1 baseline is lower (40%) because AI-generated artifact detection requires skill-specific knowledge of common AI mistakes
- The skill's unique value is the systematic methodology — checking everything, not just what the user noticed
