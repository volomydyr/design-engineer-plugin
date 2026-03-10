# command-de-research Benchmark Results -- Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 15: Target audience | 5/5 (100%) | 3/5 (60%) | +40% |
| Eval 16: Full pipeline | 6/6 (100%) | 0/6 (0%) | +100% |
| Eval 17: Competitive analysis | 5/5 (100%) | 3/5 (60%) | +40% |
| **Overall** | **16/16 (100%)** | **6/16 (38%)** | **+62%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 43,100 | 20,167 | +114% |
| Mean duration (s) | 172.7 | 100.3 | +72% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Skill routing** -- Parses arguments like `target-audience` and `competitive-analysis` to load the correct ux-* skill directly
2. **Structured persona frameworks** -- Jobs-to-be-done, day-in-the-life scenarios, comparison matrices for primary vs secondary evaluation
3. **Full pipeline sequencing** -- `full` argument triggers ordered execution of 7-8 research skills with context accumulation between them
4. **Optional step handling** -- Asks about ux-user-interviews as an optional pipeline step rather than assuming inclusion or exclusion
5. **Deliverable generation** -- Saves structured markdown deliverables to `docs/design/research/` and `docs/design/foundation/`
6. **Dependency tracking** -- Updates `.dependencies.yaml` after each deliverable and checks downstream impact
7. **Meta-compound consolidation** -- Runs meta-compound after the full pipeline to synthesize cross-cutting themes

### What baseline does instead:
- Eval 15: Can develop basic personas and make a primary/secondary recommendation, but without structured frameworks, deliverable files, or dependency tracking
- Eval 16: Provides general brainstorming about a pet sitting marketplace but has no concept of multi-skill pipelines, sequencing, or context accumulation. Passes 0/6 assertions
- Eval 17: Can list competitors and provide basic pros/cons analysis, but without structured categorization (direct/indirect), comparison matrices, or positioning maps

### Analyst Notes:
- The full pipeline eval (16) is the strongest discriminator -- 100% vs 0% pass rate. Baseline Claude has no concept of multi-skill sequencing or pipeline orchestration
- Direct activity evals (15, 17) show moderate baseline capability (60%) because Claude can do basic persona and competitive work from general knowledge
- The skill's unique value is in structure, depth, and output format -- not just the analytical content itself
- Token cost is ~2x higher for with-skill, consistent with meta-setup benchmarks and justified by structured deliverable output
- All 6 baseline passes were on analytical assertions (persona development, competitor identification) -- baseline never passes on routing, deliverable, or pipeline assertions
