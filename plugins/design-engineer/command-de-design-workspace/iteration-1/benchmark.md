# Benchmark: command:de:design -- Iteration 1

**Date:** 2026-03-10
**Evals:** 12, 13, 14
**Total expectations:** 18

---

## Pass Rates

| Eval | With Skill | Without Skill |
|------|-----------|---------------|
| eval-12 design-god-mode | 7/7 (100%) | 0/7 (0%) |
| eval-13 design-guided-context | 6/6 (100%) | 2/6 (33%) |
| eval-14 design-phase-jump | 5/5 (100%) | 0/5 (0%) |
| **Overall** | **18/18 (100%)** | **2/18 (11%)** |

## Timing

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 49,300 | 17,833 | +176% |
| Mean duration | 198.3s | 95.3s | +108% |

### By Eval

| Eval | Tokens (with) | Tokens (without) | Duration (with) | Duration (without) |
|------|--------------|------------------|----------------|-------------------|
| eval-12 | 52,400 | 16,200 | 215.0s | 89.0s |
| eval-13 | 48,700 | 21,500 | 198.0s | 112.0s |
| eval-14 | 46,800 | 15,800 | 182.0s | 85.0s |

---

## Analyst Notes

### What the skill adds

1. **Pipeline orchestration.** The skill's core value is sequencing 11+ individual skills across 4 design phases in the correct dependency order. Baseline Claude has zero awareness of the phase system, skill names, or execution order -- it fails every orchestration expectation across all three evals.

2. **Interaction mode control.** God mode (eval-12) and Guided mode (eval-13) are fundamentally different execution styles. The skill correctly activates each from command arguments and maintains the mode throughout. Baseline Claude cannot parse mode arguments and defaults to a single one-shot response regardless of intent.

3. **Dependency awareness.** Eval-14 tests phase jumping (skip to Phase 3). The skill checks `.dependencies.yaml` for all 11 upstream deliverables, warns about missing ones, and offers recovery options. Baseline Claude has no concept of deliverable dependencies or phase prerequisites.

4. **Inter-phase compound documentation.** After each phase the skill runs meta-compound to synthesize learnings and update project-status.md. This creates a living knowledge graph that downstream phases consume. Baseline Claude produces no compound documentation.

### Where baseline Claude shows partial competence

Eval-13 is the only eval where baseline passes any expectations (2/6). Both passes relate to domain understanding -- recognizing dual-audience complexity (children as users, parents as buyers) and suggesting separate design approaches. This confirms that baseline Claude has relevant design knowledge but lacks the structural machinery to operationalize it through a phased workflow.

### Cost-quality tradeoff

The skill uses ~2.8x more tokens and ~2.1x more wall-clock time than baseline. This overhead is the cost of running a multi-phase pipeline with inter-phase documentation. Given that baseline achieves only 11% pass rate, the additional tokens are not optional overhead -- they represent the actual work of structured design execution that baseline cannot perform at all.

### Comparison to meta-setup benchmark

The pass rate delta (+89%) exceeds meta-setup's delta (+71%), while the token multiplier (2.8x) is higher than meta-setup's (2.2x). This is expected: design orchestration coordinates more skills across more phases than setup, so both the quality gap and the token cost are larger.
