# ui-accessibility Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 1: Healthcare portal accessibility | 6/6 (100%) | 3/6 (50%) | +50% |
| Eval 2: Contrast ratio audit | 5/5 (100%) | 3/5 (60%) | +40% |
| **Overall** | **11/11 (100%)** | **6/11 (45%)** | **+55%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 44,500 | 20,950 | +112% |
| Mean duration (s) | 180.5 | 99.8 | +81% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Structured WCAG audit framework** — Systematic perceivable/operable/understandable/robust walkthrough
2. **Domain-specific overlays** — Healthcare accessibility concerns (medical terminology, emergency states)
3. **User-population accommodations** — Elderly-specific tap targets, motor control, text sizing guidance
4. **Prioritized remediation** — P0/P1/P2 severity levels with effort estimates and sprint allocation
5. **Stakeholder persuasion** — Legal risk framing, user population data, business impact analysis

### What baseline does instead:
- Eval 1: Lists well-known WCAG best practices (contrast, alt text, keyboard nav) but no structured audit, no healthcare-specific concerns, no elderly accommodations
- Eval 2: Correctly identifies the contrast failure and suggests alternatives but lacks structured audit deliverable and stakeholder argument

### Analyst Notes:
- Baseline scores higher (45%) than most skills because WCAG is well-established knowledge that LLMs handle competently
- The skill's value is in structured methodology, domain overlays, and actionable deliverables — not basic WCAG knowledge
- Contrast-specific eval (95) shows narrower gap because it is a focused, well-known calculation
