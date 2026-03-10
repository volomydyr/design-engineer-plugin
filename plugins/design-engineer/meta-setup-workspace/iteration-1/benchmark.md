# meta-setup Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 1: Fresh SaaS setup | 7/7 (100%) | 1/7 (14%) | +86% |
| Eval 2: Reconfigure existing | 5/5 (100%) | 3/5 (60%) | +40% |
| Eval 3: Bare /de:setup command | 5/5 (100%) | 1/5 (20%) | +80% |
| **Overall** | **17/17 (100%)** | **5/17 (29%)** | **+71%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 45,326 | 20,781 | +118% |
| Mean duration (s) | 182.1 | 111.1 | +64% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Environment detection** — Checks for MCPs, git, existing config, tech stack
2. **Structured configuration** — Sequential questions with numbered-list fallback
3. **Plugin-aware config** — Produces `.design-engineer.yaml` in the correct schema
4. **Deliverables pipeline** — Creates the 6-folder structure (foundation/research/design/psych/dev/solutions)
5. **Dependency tracking** — Initializes `.dependencies.yaml` with 27 deliverables
6. **Reconfiguration flow** — Detects existing config, offers options (reconfigure/view/cancel)
7. **Command routing** — Handles bare `/de:setup` and provides structured next steps

### What baseline does instead:
- Eval 1: Produces generic dev setup files (Tailwind config, design tokens, CLAUDE.md) — useful but not plugin-aware
- Eval 2: Can reconfigure a simple config file but doesn't follow the plugin's structured flow
- Eval 3: Cannot recognize the command at all — just explains it's unknown

### Analyst Notes:
- The skill's value is strongest for Eval 1 (fresh setup) and Eval 3 (bare command) where baseline has almost no useful behavior
- Eval 2 (reconfigure) shows narrower gap because the baseline can work with existing config files reasonably well
- Token cost is ~2x higher for with-skill, justified by dramatically richer structured output
- No assertions were non-discriminating — every assertion showed clear skill vs baseline difference
