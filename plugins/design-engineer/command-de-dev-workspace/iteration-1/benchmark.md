# command-de-dev Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 21: Dev CLAUDE.md | 6/6 (100%) | 3/6 (50%) | +50% |
| Eval 22: Dev full setup | 6/6 (100%) | 2/6 (33%) | +67% |
| Eval 23: Dev pipeline | 6/6 (100%) | 1/6 (17%) | +83% |
| **Overall** | **18/18 (100%)** | **6/18 (33%)** | **+67%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 51,367 | 21,600 | +138% |
| Mean duration (s) | 206.5 | 109.4 | +89% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **Command routing** — Parses `/de:dev` arguments (claude-md, setup, pipeline) and routes to the correct skill or execution mode
2. **CLAUDE.md generation with source hierarchy** — Guides users through defining User > Docs > AI hierarchy, conflict resolution protocol, and pipeline rules
3. **Multi-skill orchestration** — The `setup` argument triggers a 7-skill sequential workflow (claude-projects, claude-md, kickstart-prompts, agent-config, mcp-notes, github-workflow, compound)
4. **Agent pipeline execution** — The `pipeline` argument triggers the 5-agent sequence (context-analyzer, plan-creator, backend-implementer, frontend-implementer, design-system-auditor) plus meta-compound documentation
5. **Approval gates** — Plan-creator agent pauses for user approval before implementation begins
6. **Design system auditing** — Generated code is audited against the project's design system for consistency
7. **Compound documentation** — Every pipeline execution is documented with patterns, learnings, and status

### What baseline does instead:
- Eval 21: Generates a usable but generic CLAUDE.md -- includes tech stack but misses source hierarchy, conflict resolution, and pipeline rules
- Eval 22: Creates basic project structure and CLAUDE.md but treats setup as a single task, missing the 7-skill orchestration, IDE-specific config, and kickstart prompts
- Eval 23: Writes code directly without any pipeline structure -- produces a monolithic component and single API route, no plan approval, no context analysis, no audit

### Analyst Notes:
- The skill's value is strongest for Eval 23 (pipeline) where baseline has almost no pipeline awareness and just writes code directly
- Eval 21 (CLAUDE.md) shows the narrowest gap because baseline Claude can produce a reasonable CLAUDE.md, just missing the structured workflow aspects
- Eval 22 (full setup) demonstrates the orchestration gap -- baseline cannot sequence 7 skills or adapt outputs for specific IDE environments
- Token cost is ~2.4x higher for with-skill, justified by dramatically richer structured output including approval gates and audit steps
- The pipeline eval (23) is the most discriminating -- 6/6 vs 1/6 shows baseline cannot replicate multi-agent orchestration
