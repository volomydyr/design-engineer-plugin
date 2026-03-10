# command-de-psych Benchmark Results — Iteration 1

## Pass Rate Comparison

| Eval | With Skill | Without Skill | Delta |
|------|-----------|---------------|-------|
| Eval 18: Master audit (meditation app) | 6/6 (100%) | 2/6 (33%) | +67% |
| Eval 19: Section deep-dive (fitness streaks) | 6/6 (100%) | 3/6 (50%) | +50% |
| Eval 20: God mode (food delivery full audit) | 6/6 (100%) | 0/6 (0%) | +100% |
| **Overall** | **18/18 (100%)** | **5/18 (28%)** | **+72%** |

## Timing & Token Usage

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Mean tokens | 51,800 | 18,167 | +185% |
| Mean duration (s) | 207.2 | 81.6 | +154% |

## Key Findings

### What the skill adds (that baseline cannot do):
1. **13-section audit framework** — Structured analysis across 130 numbered psychology laws organized into 13 sections (Cognitive Load through Cultural Context)
2. **Master scan prioritization** — Runs psych-master-audit first to identify critical/high/medium/low sections before deep-dives
3. **God mode sequencing** — Autonomously sequences through all 14 skills (master + 13 sections) to produce a comprehensive audit
4. **Specific law references** — Every finding is grounded in a specific numbered law (e.g., Law 2: Hick's Law, Law 32: Goal Gradient Effect)
5. **Scored section reports** — Each section receives a numerical score (X/10) with priority classification
6. **Browser MCP integration** — Checks for Playwright MCP to analyze live URLs with page snapshots
7. **meta-compound documentation** — Creates deliverable files, updates .dependencies.yaml, integrates findings into the design system

### What baseline does instead:
- Eval 18: Identifies the core usability issue (too many choices) but without naming psychology laws, scanning multiple sections, or producing a structured findings report
- Eval 19: Provides practical gamification suggestions that touch on Variable Reward and engagement concepts but without naming laws, analyzing Goal Gradient, or referencing the structured framework
- Eval 20: Cannot recognize the /de:psych command at all — provides general UX psychology tips about food delivery apps without any structured audit, section sequencing, scoring, or documentation

### Analyst Notes:
- The skill's value is strongest for Eval 20 (God mode) where baseline scores 0/6 — the autonomous full-audit pipeline is entirely skill-dependent
- Eval 19 (section deep-dive) shows the narrowest gap at 50% baseline because Claude can offer reasonable general advice about engagement and gamification
- Eval 18 (master audit) baseline passes 2/6 because Claude naturally identifies obvious usability issues like too many choices, even without naming the specific laws
- Token cost is ~2.8x higher for with-skill, justified by structured output that includes section scores, law references, priority levels, and actionable documentation
- All 6 assertions for Eval 20 are fully discriminating — 0% baseline vs 100% with skill
